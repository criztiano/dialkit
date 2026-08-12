// src/vue/useDialKit.ts
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";

// src/color-core.ts
var LONG_PRESS_MS = 500;
var PALETTE_DRAG_CANCEL_PX = 3;
var HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
var clamp = (n, min, max) => Math.min(max, Math.max(min, n));
var clamp01 = (n) => clamp(n, 0, 1);
var byte = (n) => clamp(Math.round(n), 0, 255);
function parseHex(input) {
  if (typeof input !== "string") return null;
  let s = input.trim();
  if (!s.startsWith("#")) s = `#${s}`;
  if (!HEX_COLOR_REGEX.test(s)) return null;
  let h35 = s.slice(1);
  if (h35.length <= 4) h35 = h35.split("").map((c) => c + c).join("");
  const r = parseInt(h35.slice(0, 2), 16);
  const g = parseInt(h35.slice(2, 4), 16);
  const b = parseInt(h35.slice(4, 6), 16);
  const a = h35.length === 8 ? parseInt(h35.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}
function formatHex(rgba, alphaEnabled) {
  const hx = (n) => byte(n).toString(16).padStart(2, "0");
  const base = `#${hx(rgba.r)}${hx(rgba.g)}${hx(rgba.b)}`;
  return alphaEnabled ? `${base}${hx(clamp01(rgba.a) * 255)}` : base;
}
function normalizeHex(input, alphaEnabled) {
  const rgba = parseHex(input);
  return rgba ? formatHex(rgba, alphaEnabled) : null;
}
function displayHex(value) {
  const rgba = parseHex(value);
  if (!rgba) return (value ?? "").toUpperCase();
  return formatHex(rgba, false).toUpperCase();
}
function bareHex(value) {
  return displayHex(value).replace(/^#/, "");
}
function normalizeHexEdit(input, alphaEnabled, currentAlpha) {
  const rgba = parseHex(input);
  if (!rgba) return null;
  const digits = input.trim().replace(/^#/, "").length;
  if (alphaEnabled && (digits === 3 || digits === 6)) rgba.a = clamp01(currentAlpha);
  return formatHex(rgba, alphaEnabled);
}
function opacityPercent(rgba) {
  return Math.round(clamp01(rgba.a) * 100);
}
function rgbToHsv(rgba) {
  const r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h35 = 0;
  if (d !== 0) {
    if (max === r) h35 = (g - b) / d % 6;
    else if (max === g) h35 = (b - r) / d + 2;
    else h35 = (r - g) / d + 4;
    h35 *= 60;
    if (h35 < 0) h35 += 360;
  }
  return { h: h35, s: max === 0 ? 0 : d / max, v: max, a: rgba.a };
}
function hsvToRgb(hsva) {
  const h35 = (hsva.h % 360 + 360) % 360;
  const s = clamp01(hsva.s), v = clamp01(hsva.v);
  const c = v * s;
  const x = c * (1 - Math.abs(h35 / 60 % 2 - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h35 < 60) [r, g, b] = [c, x, 0];
  else if (h35 < 120) [r, g, b] = [x, c, 0];
  else if (h35 < 180) [r, g, b] = [0, c, x];
  else if (h35 < 240) [r, g, b] = [0, x, c];
  else if (h35 < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: byte((r + m) * 255), g: byte((g + m) * 255), b: byte((b + m) * 255), a: hsva.a };
}
function rgbToHsl(rgba) {
  const { h: h35, s, v, a } = rgbToHsv(rgba);
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h: h35, s: sl, l, a };
}
function hslToRgb(hsla) {
  const l = clamp01(hsla.l), s = clamp01(hsla.s);
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);
  return hsvToRgb({ h: hsla.h, s: sv, v, a: hsla.a });
}
var srgbToLinear = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
var linearToSrgb = (c) => c <= 31308e-7 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
function rgbToOklab(rgba) {
  const r = srgbToLinear(rgba.r / 255);
  const g = srgbToLinear(rgba.g / 255);
  const b = srgbToLinear(rgba.b / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    A: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    B: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  };
}
function oklabToLinearRgb(L, A, B) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2307590544 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  };
}
function rgbToOklch(rgba) {
  const { L, A, B } = rgbToOklab(rgba);
  const c = Math.sqrt(A * A + B * B);
  let h35 = Math.atan2(B, A) * 180 / Math.PI;
  if (h35 < 0) h35 += 360;
  return { l: L, c, h: c < 1e-6 ? 0 : h35, a: rgba.a };
}
var GAMUT_EPS = 1e-4;
function inSrgbGamut(l, c, h35) {
  const rad = h35 * Math.PI / 180;
  const { r, g, b } = oklabToLinearRgb(l, c * Math.cos(rad), c * Math.sin(rad));
  return r >= -GAMUT_EPS && r <= 1 + GAMUT_EPS && g >= -GAMUT_EPS && g <= 1 + GAMUT_EPS && b >= -GAMUT_EPS && b <= 1 + GAMUT_EPS;
}
function clampOklchToSrgb(oklch) {
  const l = clamp01(oklch.l);
  const h35 = (oklch.h % 360 + 360) % 360;
  const c = Math.max(0, oklch.c);
  if (inSrgbGamut(l, c, h35)) return { l, c, h: h35, a: clamp01(oklch.a) };
  let lo = 0, hi = c;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inSrgbGamut(l, mid, h35)) lo = mid;
    else hi = mid;
  }
  return { l, c: lo, h: h35, a: clamp01(oklch.a) };
}
function oklchToRgb(oklch) {
  const { l, c, h: h35, a } = clampOklchToSrgb(oklch);
  const rad = h35 * Math.PI / 180;
  const lin = oklabToLinearRgb(l, c * Math.cos(rad), c * Math.sin(rad));
  return {
    r: byte(linearToSrgb(clamp01(lin.r)) * 255),
    g: byte(linearToSrgb(clamp01(lin.g)) * 255),
    b: byte(linearToSrgb(clamp01(lin.b)) * 255),
    a: clamp01(a)
  };
}
var ALPHA_CHANNEL = { key: "a", label: "A", min: 0, max: 100, step: 1, precision: 0 };
var CHANNELS = {
  rgb: [
    { key: "r", label: "R", min: 0, max: 255, step: 1, precision: 0 },
    { key: "g", label: "G", min: 0, max: 255, step: 1, precision: 0 },
    { key: "b", label: "B", min: 0, max: 255, step: 1, precision: 0 }
  ],
  hsl: [
    { key: "h", label: "H", min: 0, max: 360, step: 1, precision: 0 },
    { key: "s", label: "S", min: 0, max: 100, step: 1, precision: 0 },
    { key: "l", label: "L", min: 0, max: 100, step: 1, precision: 0 }
  ],
  oklch: [
    { key: "l", label: "L", min: 0, max: 1, step: 0.01, precision: 2 },
    { key: "c", label: "C", min: 0, max: 0.4, step: 5e-3, precision: 3 },
    { key: "h", label: "H", min: 0, max: 360, step: 1, precision: 0 }
  ]
};
function getChannels(format, alphaEnabled) {
  return alphaEnabled ? [...CHANNELS[format], ALPHA_CHANNEL] : CHANNELS[format];
}
var round = (n, precision) => {
  const f = 10 ** precision;
  return Math.round(n * f) / f;
};
function rgbaToChannels(rgba, format, alphaEnabled) {
  let values;
  if (format === "rgb") {
    values = [rgba.r, rgba.g, rgba.b];
  } else if (format === "hsl") {
    const { h: h35, s, l } = rgbToHsl(rgba);
    values = [round(h35, 0), round(s * 100, 0), round(l * 100, 0)];
  } else {
    const { l, c, h: h35 } = rgbToOklch(rgba);
    values = [round(l, 2), round(c, 3), round(h35, 0)];
  }
  if (alphaEnabled) values.push(opacityPercent(rgba));
  return values;
}
function channelsToRgba(values, format, alphaEnabled) {
  const specs = getChannels(format, alphaEnabled);
  const v = specs.map((spec, i) => {
    const n = Number(values[i]);
    const fallback = spec.key === "a" ? spec.max : spec.min;
    return clamp(Number.isFinite(n) ? n : fallback, spec.min, spec.max);
  });
  const a = alphaEnabled ? v[3] / 100 : 1;
  if (format === "rgb") return { r: byte(v[0]), g: byte(v[1]), b: byte(v[2]), a };
  if (format === "hsl") return hslToRgb({ h: v[0], s: v[1] / 100, l: v[2] / 100, a });
  return oklchToRgb({ l: v[0], c: v[1], h: v[2], a });
}
var PALETTE_SIZE = 8;
var PALETTE_STORAGE_KEY = "dialkit:color-palette";
function emptyPalette() {
  return Array(PALETTE_SIZE).fill(null);
}
function serializePalette(slots) {
  return JSON.stringify(slots.slice(0, PALETTE_SIZE));
}
function deserializePalette(raw) {
  const slots = emptyPalette();
  if (!raw) return slots;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return slots;
  }
  if (!Array.isArray(parsed)) return slots;
  for (let i = 0; i < PALETTE_SIZE; i++) {
    const entry = parsed[i];
    if (typeof entry === "string" && HEX_COLOR_REGEX.test(entry)) slots[i] = entry;
  }
  return slots;
}

// src/gradient-core.ts
var MIN_STOPS = 2;
var STOP_DETACH_PX = 24;
var DEFAULT_GRADIENT = {
  type: "linear",
  angle: 90,
  stops: [
    { color: "#6366f1ff", position: 0 },
    { color: "#ec4899ff", position: 1 }
  ]
};
var clamp012 = (n) => Math.min(1, Math.max(0, n));
var clampPct = (n) => Math.min(100, Math.max(0, n));
var clampScale = (n) => Math.min(200, Math.max(10, n));
var clampSquash = (n) => Math.min(200, Math.max(1, n));
var wrapAngle = (a) => (a % 360 + 360) % 360;
var round2 = (n, p) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};
var cloneDefaultStops = () => DEFAULT_GRADIENT.stops.map((s) => ({ ...s }));
var cloneDefault = () => ({
  type: DEFAULT_GRADIENT.type,
  angle: DEFAULT_GRADIENT.angle,
  stops: cloneDefaultStops()
});
var sortedStops = (stops) => [...stops].sort((a, b) => a.position - b.position);
var stopString = (stops) => sortedStops(stops).map((s) => `${s.color} ${round2(clamp012(s.position) * 100, 2)}%`).join(", ");
var normColor = (color) => {
  const rgba = parseHex(color);
  return rgba ? formatHex(rgba, true) : "#000000ff";
};
function gradientToCss(value) {
  const stopStr = stopString(value.stops);
  const angle = round2(wrapAngle(value.angle), 2);
  const cx = round2(clampPct(value.centerX ?? 50), 2);
  const cy = round2(clampPct(value.centerY ?? 50), 2);
  switch (value.type) {
    case "radial": {
      const rx = clampScale(value.scale ?? 100);
      const ry = value.squash === void 0 ? rx : clampSquash(value.squash);
      if (rx === 100 && ry === 100) {
        return `radial-gradient(circle at ${cx}% ${cy}%, ${stopStr})`;
      }
      return `radial-gradient(${round2(rx, 2)}% ${round2(ry, 2)}% at ${cx}% ${cy}%, ${stopStr})`;
    }
    case "conic":
      return `conic-gradient(from ${angle}deg at ${cx}% ${cy}%, ${stopStr})`;
    case "linear":
    default:
      return `linear-gradient(${angle}deg, ${stopStr})`;
  }
}
function gradientFillBox(value, boxW, boxH) {
  if (value.type !== "radial" || boxW <= 0 || boxH <= 0) {
    return {
      background: gradientToCss(value),
      transform: "none",
      transformOrigin: "50% 50%",
      left: 0,
      top: 0,
      width: boxW,
      height: boxH
    };
  }
  const cxPx = clampPct(value.centerX ?? 50) / 100 * boxW;
  const cyPx = clampPct(value.centerY ?? 50) / 100 * boxH;
  const scaleX = clampScale(value.scale ?? 100) / 100;
  const scaleY = (value.squash === void 0 ? clampScale(value.scale ?? 100) : clampSquash(value.squash)) / 100;
  const rx = round2(scaleX * boxW, 2);
  const ry = round2(scaleY * boxH, 2);
  const side = round2(2 * Math.hypot(boxW, boxH), 2);
  const rotation = wrapAngle(value.rotation ?? 0);
  return {
    background: `radial-gradient(${rx}px ${ry}px at 50% 50%, ${stopString(value.stops)})`,
    transform: rotation === 0 ? "none" : `rotate(${round2(rotation, 2)}deg)`,
    transformOrigin: "50% 50%",
    left: round2(cxPx - side / 2, 2),
    top: round2(cyPx - side / 2, 2),
    width: side,
    height: side
  };
}
function lerpPremult(a, b, t) {
  const pa = a.a + (b.a - a.a) * t;
  if (pa === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (ca, aa, cb, ba) => (ca * aa + (cb * ba - ca * aa) * t) / pa;
  return {
    r: mix(a.r, a.a, b.r, b.a),
    g: mix(a.g, a.a, b.g, b.a),
    b: mix(a.b, a.a, b.b, b.a),
    a: pa
  };
}
function colorAtPosition(value, position) {
  const stops = sortedStops(value.stops);
  if (stops.length === 0) return "#000000ff";
  const p = clamp012(position);
  if (p <= stops[0].position) return normColor(stops[0].color);
  const last = stops[stops.length - 1];
  if (p >= last.position) return normColor(last.color);
  let i = 0;
  while (i < stops.length - 1 && stops[i + 1].position <= p) i++;
  const a = stops[i];
  const b = stops[i + 1];
  const span = b.position - a.position;
  const t = span === 0 ? 0 : (p - a.position) / span;
  const ca = parseHex(a.color) ?? { r: 0, g: 0, b: 0, a: 1 };
  const cb = parseHex(b.color) ?? { r: 0, g: 0, b: 0, a: 1 };
  return formatHex(lerpPremult(ca, cb, t), true);
}
function normalizeGradient(input) {
  if (!input || typeof input !== "object") return cloneDefault();
  const obj = input;
  if (!Array.isArray(obj.stops)) return cloneDefault();
  const type = obj.type === "radial" || obj.type === "conic" ? obj.type : "linear";
  const rawAngle = Number(obj.angle);
  const angle = Number.isFinite(rawAngle) ? wrapAngle(rawAngle) : DEFAULT_GRADIENT.angle;
  const extras = {};
  const cx = Number(obj.centerX);
  if (Number.isFinite(cx)) extras.centerX = clampPct(cx);
  const cy = Number(obj.centerY);
  if (Number.isFinite(cy)) extras.centerY = clampPct(cy);
  const scale = Number(obj.scale);
  if (Number.isFinite(scale)) extras.scale = clampScale(scale);
  const squash = Number(obj.squash);
  if (Number.isFinite(squash)) extras.squash = clampSquash(squash);
  const rotation = Number(obj.rotation);
  if (Number.isFinite(rotation)) extras.rotation = wrapAngle(rotation);
  const stops = [];
  for (const raw of obj.stops) {
    if (!raw || typeof raw !== "object") continue;
    const s = raw;
    const rgba = typeof s.color === "string" ? parseHex(s.color) : null;
    const pos = Number(s.position);
    if (!rgba || !Number.isFinite(pos)) continue;
    stops.push({ color: formatHex(rgba, true), position: clamp012(pos) });
  }
  if (stops.length < MIN_STOPS) return { type, angle, stops: cloneDefaultStops(), ...extras };
  stops.sort((a, b) => a.position - b.position);
  return { type, angle, stops, ...extras };
}
function addStop(value, position) {
  const stop = { color: colorAtPosition(value, position), position: clamp012(position) };
  const stops = [...value.stops, stop].sort((a, b) => a.position - b.position);
  return { value: { ...value, stops }, index: stops.indexOf(stop) };
}
function moveStop(value, index, position) {
  if (index < 0 || index >= value.stops.length) return { value, index };
  const moved = { ...value.stops[index], position: clamp012(position) };
  const stops = value.stops.map((s, i) => i === index ? moved : s);
  stops.sort((a, b) => a.position - b.position);
  return { value: { ...value, stops }, index: stops.indexOf(moved) };
}
function removeStop(value, index) {
  if (value.stops.length <= MIN_STOPS || index < 0 || index >= value.stops.length) return value;
  return { ...value, stops: value.stops.filter((_, i) => i !== index) };
}
function setStopColor(value, index, hex) {
  if (index < 0 || index >= value.stops.length) return value;
  const rgba = parseHex(hex);
  if (!rgba) return value;
  const color = formatHex(rgba, true);
  return { ...value, stops: value.stops.map((s, i) => i === index ? { ...s, color } : s) };
}
function setGradientType(value, type) {
  return { ...value, type };
}
function setGradientAngle(value, angle) {
  return { ...value, angle: wrapAngle(angle) };
}
function setGradientCenter(value, centerX, centerY) {
  return { ...value, centerX: clampPct(centerX), centerY: clampPct(centerY) };
}
function setGradientScale(value, scale) {
  return { ...value, scale: clampScale(scale) };
}
function setGradientSquash(value, squash) {
  return { ...value, squash: clampSquash(squash) };
}
function setGradientRotation(value, rotation) {
  return { ...value, rotation: wrapAngle(rotation) };
}

// src/xy-pad-core.ts
var XY_DETENT_PX = 6;
var XY_DEFAULT_STEP = 0.01;
function decimalsForStep(step) {
  const s = step.toString();
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}
function roundToStep(val, step) {
  return parseFloat(val.toFixed(decimalsForStep(step)));
}
function resolveAxis(axis) {
  const min = axis?.min ?? 0;
  const max = axis?.max ?? 1;
  const step = axis?.step ?? XY_DEFAULT_STEP;
  const bipolar = axis?.bipolar ?? false;
  const origin = axis?.origin ?? (bipolar ? (min + max) / 2 : min);
  return { min, max, step, origin, bipolar };
}
function clamp2(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
function snapToStep(v, step, min) {
  if (step <= 0) return v;
  const snapped = min + Math.round((v - min) / step) * step;
  return roundToStep(snapped, step);
}
function valueToNorm(v, axis) {
  if (axis.max === axis.min) return 0;
  return clamp2((v - axis.min) / (axis.max - axis.min), 0, 1);
}
function normToValue(n, axis) {
  const t = clamp2(n, 0, 1);
  return axis.min + t * (axis.max - axis.min);
}
function invertY(n) {
  return 1 - n;
}
function valueFromPoint(point, xAxis, yAxis, snap = false) {
  let x = clamp2(normToValue(point.x, xAxis), xAxis.min, xAxis.max);
  let y = clamp2(normToValue(invertY(point.y), yAxis), yAxis.min, yAxis.max);
  if (snap) {
    x = snapToStep(x, xAxis.step, xAxis.min);
    y = snapToStep(y, yAxis.step, yAxis.min);
  }
  return { x, y };
}
function pointFromValue(value, xAxis, yAxis) {
  return {
    x: valueToNorm(value.x, xAxis),
    y: invertY(valueToNorm(value.y, yAxis))
  };
}
function applyDetentAxis(value, axis, pxFromOrigin) {
  if (axis.bipolar && pxFromOrigin <= XY_DETENT_PX) return axis.origin;
  return value;
}
function effectiveStep(axis, mode) {
  const range = axis.max - axis.min;
  if (mode === "fine") return range * 0.01;
  if (mode === "coarse") return range * 0.1;
  return axis.step;
}
function nudge(value, axis, direction, xAxis, yAxis, mode = "normal") {
  const spec = axis === "x" ? xAxis : yAxis;
  const step = effectiveStep(spec, mode);
  const next = roundToStep(clamp2(value[axis] + direction * step, spec.min, spec.max), step);
  return axis === "x" ? { x: next, y: value.y } : { x: value.x, y: next };
}
function centerValue(xAxis, yAxis) {
  return { x: xAxis.origin, y: yAxis.origin };
}
function coerceComponent(v, axis) {
  return typeof v === "number" && Number.isFinite(v) ? v : axis.origin;
}
function normalizeValue(value, xAxis, yAxis, snap = false) {
  const resolve = (raw, axis) => {
    let v = clamp2(coerceComponent(raw, axis), axis.min, axis.max);
    if (snap) v = snapToStep(v, axis.step, axis.min);
    return v + 0;
  };
  return {
    x: resolve(value?.x, xAxis),
    y: resolve(value?.y, yAxis)
  };
}

// src/range-slider-core.ts
function clamp3(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
function orderRange(v) {
  return v.min <= v.max ? v : { min: v.max, max: v.min };
}
function clampRange(v, min, max) {
  return orderRange({ min: clamp3(v.min, min, max), max: clamp3(v.max, min, max) });
}
function setLow(nextLow, current, min) {
  return { min: clamp3(nextLow, min, current.max), max: current.max };
}
function setHigh(nextHigh, current, max) {
  return { min: current.min, max: clamp3(nextHigh, current.min, max) };
}
function shiftSpan(deltaValue, current, min, max) {
  const width = current.max - current.min;
  const desiredMin = clamp3(current.min + deltaValue, min, max - width);
  return { min: desiredMin, max: desiredMin + width };
}
function nearestHandle(atValue, current) {
  const dMin = Math.abs(atValue - current.min);
  const dMax = Math.abs(atValue - current.max);
  if (dMin < dMax) return "min";
  if (dMax < dMin) return "max";
  return atValue < current.min ? "min" : "max";
}
function pickDragTarget(atValue, current, hitValue) {
  const nearLow = Math.abs(atValue - current.min) <= hitValue;
  const nearHigh = Math.abs(atValue - current.max) <= hitValue;
  if (nearLow && nearHigh) return nearestHandle(atValue, current);
  if (nearLow) return "min";
  if (nearHigh) return "max";
  if (atValue > current.min && atValue < current.max) return "span";
  return nearestHandle(atValue, current);
}
function isOutsideSpan(atValue, current) {
  return atValue <= current.min || atValue >= current.max;
}
function handleLeftStyles(lowPercent, highPercent) {
  const gap = `(${highPercent}% - ${lowPercent}%)`;
  const ramp = `clamp(0px, calc(30px - ${gap}), 12px)`;
  return {
    low: `max(2px, min(calc(100% - 5px), calc(${lowPercent}% + 6px - ${ramp})))`,
    high: `min(calc(100% - 5px), max(2px, calc(${highPercent}% - 9px + ${ramp})))`
  };
}

// src/store/persist.ts
var STORAGE_VERSION = "v1";
function resolvePersistTarget(kind, id, persist) {
  if (!persist) return null;
  const config = persist === true ? {} : persist;
  const base = config.key ?? id;
  if (!base) return null;
  return {
    key: `dialkit:${STORAGE_VERSION}:${kind}:${base}`,
    storage: config.storage ?? "localStorage"
  };
}
function getStorage(name) {
  try {
    if (typeof window === "undefined") return null;
    return name === "sessionStorage" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}
function loadPersisted(target) {
  if (!target) return null;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return null;
    const raw = storage.getItem(target.key);
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function savePersisted(target, value) {
  if (!target) return;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return;
    storage.setItem(target.key, JSON.stringify(value));
  } catch {
  }
}
function clearPersisted(target) {
  if (!target) return;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return;
    storage.removeItem(target.key);
  } catch {
  }
}

// src/store/DialStore.ts
var EMPTY_VALUES = Object.freeze({});
function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
}
function hintDomId(scope, path) {
  return `dialkit-hint-${scope}-${path}`.replace(/\s+/g, "-");
}
function inferStep(min, max) {
  const range = max - min;
  if (range <= 1) return 0.01;
  if (range <= 10) return 0.1;
  if (range <= 100) return 1;
  return 10;
}
function isHexColor(value) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
}
function sameMarkers(a, b) {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((m, i) => Object.is(m, b[i]));
}
function resolveValueHasType(value, type) {
  return typeof value === "object" && value !== null && "type" in value && value.type === type;
}
function isSpringConfigValue(value) {
  return resolveValueHasType(value, "spring");
}
function isEasingConfigValue(value) {
  return resolveValueHasType(value, "easing");
}
function resolveDialValues(config, flatValues) {
  return resolveConfigValues(config, flatValues, "");
}
function resolveConfigValues(config, flatValues, prefix) {
  const result = {};
  for (const [key, configValue] of Object.entries(config)) {
    if (key === "_collapsed" || key === "_collapsible") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === "number") {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (typeof configValue === "number" || typeof configValue === "boolean" || typeof configValue === "string") {
      result[key] = flatValues[path] ?? configValue;
    } else if (resolveValueHasType(configValue, "spring") || resolveValueHasType(configValue, "easing")) {
      result[key] = flatValues[path] ?? configValue;
    } else if (resolveValueHasType(configValue, "action")) {
      result[key] = flatValues[path] ?? configValue;
    } else if (resolveValueHasType(configValue, "select") && Array.isArray(configValue.options)) {
      const select = configValue;
      const defaultValue = select.default ?? (typeof select.options[0] === "string" ? select.options[0] : select.options[0]?.value);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (resolveValueHasType(configValue, "color")) {
      result[key] = flatValues[path] ?? configValue.default ?? "#000000";
    } else if (resolveValueHasType(configValue, "text")) {
      result[key] = flatValues[path] ?? configValue.default ?? "";
    } else if (resolveValueHasType(configValue, "curve")) {
    } else if (typeof configValue === "object" && configValue !== null) {
      result[key] = resolveConfigValues(configValue, flatValues, path);
    }
  }
  return result;
}
var DialStoreClass = class {
  constructor() {
    this.panels = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
    this.globalListeners = /* @__PURE__ */ new Set();
    this.snapshots = /* @__PURE__ */ new Map();
    this.actionListeners = /* @__PURE__ */ new Map();
    this.eventListeners = /* @__PURE__ */ new Map();
    // Affordance status and disabled state are app-pushed presentation, not
    // control values: they stay out of `values` so they are never persisted, saved
    // into a preset, or diffed against the config. One listener set covers both, so
    // a control's shell needs a single subscription.
    this.affordanceStatus = /* @__PURE__ */ new Map();
    this.disabledPaths = /* @__PURE__ */ new Map();
    this.controlStateListeners = /* @__PURE__ */ new Map();
    this.presets = /* @__PURE__ */ new Map();
    this.activePreset = /* @__PURE__ */ new Map();
    // Host-owned preset providers. The serialized form (functions drop out of
    // JSON, leaving list + activeId) decides whether a swap is visible: adapters
    // replace the object on every host render so callbacks never go stale, and
    // only a data change should notify.
    this.presetProviders = /* @__PURE__ */ new Map();
    this.baseValues = /* @__PURE__ */ new Map();
    // Resolved storage target per panel (null = persistence off). Absent = not
    // yet registered.
    this.persistTargets = /* @__PURE__ */ new Map();
  }
  registerPanel(id, name, config, shortcuts, options = {}) {
    const existingPanel = this.panels.get(id);
    if (existingPanel && existingPanel.kind !== options.kind) {
      console.warn(
        `[dialkit] Panel id "${id}" cannot be shared by a timeline and a standard panel; the most recent registration controls where it renders.`
      );
    }
    const target = resolvePersistTarget("panel", id, options.persist);
    this.persistTargets.set(id, target);
    const controls = this.parseConfig(config, "", shortcuts);
    this.applyControlExtras(controls, options.hints, options.affordances, options.labels);
    const values = this.flattenValues(config, "");
    this.initTransitionModes(config, "", values);
    this.overlayPersistedValues(target, values);
    this.panels.set(id, { id, name, controls, values, shortcuts: shortcuts ?? {}, hints: options.hints, affordances: options.affordances, labels: options.labels, kind: options.kind });
    this.snapshots.set(id, { ...values });
    this.baseValues.set(id, { ...values });
    this.notifyGlobal();
  }
  updatePanel(id, name, config, shortcuts, options = {}) {
    const existing = this.panels.get(id);
    if (!existing) {
      this.registerPanel(id, name, config, shortcuts, options);
      return;
    }
    const hints = options.hints ?? existing.hints;
    const affordances = options.affordances ?? existing.affordances;
    const labels = options.labels ?? existing.labels;
    const controls = this.parseConfig(config, "", shortcuts);
    this.applyControlExtras(controls, hints, affordances, labels);
    const controlsByPath = this.mapControlsByPath(controls);
    const defaultValues = this.flattenValues(config, "");
    const nextValues = {};
    for (const [path, defaultValue] of Object.entries(defaultValues)) {
      nextValues[path] = this.normalizePreservedValue(
        existing.values[path],
        defaultValue,
        controlsByPath.get(path)
      );
    }
    this.initTransitionModes(config, "", nextValues);
    for (const [path, mode] of Object.entries(existing.values)) {
      if (!path.endsWith(".__mode")) {
        continue;
      }
      const transitionPath = path.slice(0, -"__mode".length - 1);
      const transitionControl = controlsByPath.get(transitionPath);
      if (transitionControl?.type === "transition") {
        nextValues[path] = mode;
      }
    }
    const nextPanel = { id, name, controls, values: nextValues, shortcuts: shortcuts ?? existing.shortcuts, hints, affordances, labels, kind: options.kind ?? existing.kind };
    this.panels.set(id, nextPanel);
    this.snapshots.set(id, { ...nextValues });
    const previousBaseValues = this.baseValues.get(id) ?? {};
    const nextBaseValues = {};
    for (const [path, defaultValue] of Object.entries(defaultValues)) {
      nextBaseValues[path] = this.normalizePreservedValue(
        previousBaseValues[path],
        defaultValue,
        controlsByPath.get(path)
      );
    }
    for (const [path, value] of Object.entries(nextValues)) {
      if (path.endsWith(".__mode")) {
        nextBaseValues[path] = value;
      }
    }
    this.baseValues.set(id, nextBaseValues);
    this.savePanelValues(id);
    this.notify(id);
    this.notifyGlobal();
  }
  unregisterPanel(id) {
    this.panels.delete(id);
    if (this.listeners.get(id)?.size === 0) this.listeners.delete(id);
    if (this.actionListeners.get(id)?.size === 0) this.actionListeners.delete(id);
    if (this.eventListeners.get(id)?.size === 0) this.eventListeners.delete(id);
    if (this.controlStateListeners.get(id)?.size === 0) this.controlStateListeners.delete(id);
    this.affordanceStatus.delete(id);
    this.disabledPaths.delete(id);
    this.snapshots.delete(id);
    this.baseValues.delete(id);
    this.persistTargets.delete(id);
    this.presetProviders.delete(id);
    this.notifyGlobal();
  }
  // Overlay saved values onto freshly-computed defaults, in place. Only keys
  // that still exist in `values` (i.e. the current config) are restored.
  overlayPersistedValues(target, values) {
    const persisted = loadPersisted(target);
    if (!persisted) return;
    for (const key of Object.keys(values)) {
      if (Object.prototype.hasOwnProperty.call(persisted, key)) {
        values[key] = persisted[key];
      }
    }
  }
  // Save the panel's current flat values (fail-soft, no-op when persistence is
  // off). Called after every edit so timing/values survive a reload.
  savePanelValues(panelId) {
    const target = this.persistTargets.get(panelId);
    if (!target) return;
    const panel = this.panels.get(panelId);
    if (panel) savePersisted(target, panel.values);
  }
  updateValue(panelId, path, value) {
    const panel = this.panels.get(panelId);
    if (!panel) return;
    panel.values[path] = value;
    const activeId = this.activePreset.get(panelId);
    if (activeId) {
      const presets = this.presets.get(panelId) ?? [];
      const preset = presets.find((p) => p.id === activeId);
      if (preset) preset.values[path] = value;
    } else {
      const base = this.baseValues.get(panelId);
      if (base) base[path] = value;
    }
    this.snapshots.set(panelId, { ...panel.values });
    this.savePanelValues(panelId);
    this.notify(panelId);
  }
  // Apply several path/value edits atomically — one snapshot + one notify.
  // The timeline uses this when a single gesture trades time between fields
  // (e.g. resizing a clip's start edge shifts both its position and duration),
  // where an intermediate single-field state would be invalid.
  updateValues(panelId, updates) {
    const panel = this.panels.get(panelId);
    if (!panel) return;
    const activeId = this.activePreset.get(panelId);
    const preset = activeId ? (this.presets.get(panelId) ?? []).find((p) => p.id === activeId) : void 0;
    const base = this.baseValues.get(panelId);
    for (const [path, value] of Object.entries(updates)) {
      panel.values[path] = value;
      if (preset) preset.values[path] = value;
      else if (base) base[path] = value;
    }
    this.snapshots.set(panelId, { ...panel.values });
    this.savePanelValues(panelId);
    this.notify(panelId);
  }
  updateSpringMode(panelId, path, mode) {
    this.updateTransitionMode(panelId, path, mode);
  }
  getSpringMode(panelId, path) {
    const mode = this.getTransitionMode(panelId, path);
    if (mode === "easing") return "simple";
    return mode;
  }
  updateTransitionMode(panelId, path, mode) {
    const panel = this.panels.get(panelId);
    if (!panel) return;
    panel.values[`${path}.__mode`] = mode;
    this.snapshots.set(panelId, { ...panel.values });
    this.notify(panelId);
  }
  getTransitionMode(panelId, path) {
    const panel = this.panels.get(panelId);
    if (!panel) return "simple";
    return panel.values[`${path}.__mode`] || "simple";
  }
  getValue(panelId, path) {
    const panel = this.panels.get(panelId);
    return panel?.values[path];
  }
  getValues(panelId) {
    return this.snapshots.get(panelId) ?? EMPTY_VALUES;
  }
  getPanels(kind) {
    const all = Array.from(this.panels.values());
    if (kind === "panel") return all.filter((panel) => panel.kind !== "timeline");
    if (kind === "timeline") return all.filter((panel) => panel.kind === "timeline");
    return all;
  }
  getPanel(id) {
    return this.panels.get(id);
  }
  subscribe(panelId, listener) {
    if (!this.listeners.has(panelId)) {
      this.listeners.set(panelId, /* @__PURE__ */ new Set());
    }
    this.listeners.get(panelId).add(listener);
    return () => {
      const listeners2 = this.listeners.get(panelId);
      listeners2?.delete(listener);
      if (listeners2?.size === 0 && !this.panels.has(panelId)) {
        this.listeners.delete(panelId);
      }
    };
  }
  subscribeGlobal(listener) {
    this.globalListeners.add(listener);
    return () => this.globalListeners.delete(listener);
  }
  subscribeActions(panelId, listener) {
    if (!this.actionListeners.has(panelId)) {
      this.actionListeners.set(panelId, /* @__PURE__ */ new Set());
    }
    this.actionListeners.get(panelId).add(listener);
    return () => {
      const listeners2 = this.actionListeners.get(panelId);
      listeners2?.delete(listener);
      if (listeners2?.size === 0 && !this.panels.has(panelId)) {
        this.actionListeners.delete(panelId);
      }
    };
  }
  triggerAction(panelId, path) {
    this.actionListeners.get(panelId)?.forEach((fn) => fn(path));
  }
  // Generic non-value event channel (file picked, chip removed, list mutated).
  subscribeEvents(panelId, listener) {
    if (!this.eventListeners.has(panelId)) {
      this.eventListeners.set(panelId, /* @__PURE__ */ new Set());
    }
    this.eventListeners.get(panelId).add(listener);
    return () => {
      const listeners2 = this.eventListeners.get(panelId);
      listeners2?.delete(listener);
      if (listeners2?.size === 0 && !this.panels.has(panelId)) {
        this.eventListeners.delete(panelId);
      }
    };
  }
  emitEvent(panelId, path, event) {
    this.eventListeners.get(panelId)?.forEach((fn) => fn(path, event));
  }
  /**
   * How lit a control's affordance dot is. Callers may push this as often as
   * they like — an unchanged status is dropped without notifying, so driving it
   * from an audio callback costs nothing.
   */
  setAffordanceStatus(panelId, path, status) {
    let byPath = this.affordanceStatus.get(panelId);
    if (status === "off") {
      if (!byPath?.delete(path)) return;
    } else {
      if (byPath?.get(path) === status) return;
      if (!byPath) {
        byPath = /* @__PURE__ */ new Map();
        this.affordanceStatus.set(panelId, byPath);
      }
      byPath.set(path, status);
    }
    this.notifyControlState(panelId);
  }
  getAffordanceStatus(panelId, path) {
    return this.affordanceStatus.get(panelId)?.get(path) ?? "off";
  }
  /**
   * Greys a control out and stops it responding. Runtime-only by design: a
   * config default plus a runtime override would be two sources of truth, and
   * calling this once covers the static case.
   */
  setDisabled(panelId, path, disabled) {
    let paths = this.disabledPaths.get(panelId);
    if (disabled) {
      if (paths?.has(path)) return;
      if (!paths) {
        paths = /* @__PURE__ */ new Set();
        this.disabledPaths.set(panelId, paths);
      }
      paths.add(path);
    } else if (!paths?.delete(path)) {
      return;
    }
    this.notifyControlState(panelId);
  }
  isDisabled(panelId, path) {
    return this.disabledPaths.get(panelId)?.has(path) ?? false;
  }
  /** One channel for every app-pushed presentation change on a panel. */
  subscribeControlState(panelId, listener) {
    if (!this.controlStateListeners.has(panelId)) {
      this.controlStateListeners.set(panelId, /* @__PURE__ */ new Set());
    }
    this.controlStateListeners.get(panelId).add(listener);
    return () => {
      const listeners2 = this.controlStateListeners.get(panelId);
      listeners2?.delete(listener);
      if (listeners2?.size === 0 && !this.panels.has(panelId)) {
        this.controlStateListeners.delete(panelId);
      }
    };
  }
  notifyControlState(panelId) {
    this.controlStateListeners.get(panelId)?.forEach((fn) => fn());
  }
  /**
   * Refresh curve rows' host-supplied presentation (sample function + markers)
   * in place. Functions drop out of the serialized config diff (the
   * `formatValue` precedent), so a host that rebuilds its config per render
   * would otherwise leave the preview drawing a stale closure; markers ride the
   * same sync so the whole curve row stays one coherent refresh. Adapters call
   * this after every render — the same contract as setPresetProvider — and only
   * an actual change (function identity, marker values) notifies, on the
   * control-state channel: curve rows are presentation, and the value snapshot
   * must not churn (a new snapshot would re-render the host, whose rebuilt
   * closure would notify again, forever). Markers are compared by value, not
   * identity, because a per-render rebuild remakes the array every time.
   */
  syncCurveConfigs(panelId, config) {
    const panel = this.panels.get(panelId);
    if (!panel) return;
    let changed = false;
    const visit = (cfg, prefix) => {
      for (const [key, value] of Object.entries(cfg)) {
        if (key === "_collapsed" || key === "_collapsible") continue;
        const path = prefix ? `${prefix}.${key}` : key;
        if (this.isCurveConfig(value)) {
          const control = this.findControlByPath(panel.controls, path);
          if (control?.type === "curve") {
            if (control.sample !== value.sample) {
              control.sample = value.sample;
              changed = true;
            }
            if (!sameMarkers(control.markers, value.markers)) {
              control.markers = value.markers;
              changed = true;
            }
          }
        } else if (typeof value === "object" && value !== null && !Array.isArray(value) && !this.isSpringConfig(value) && !this.isEasingConfig(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value)) {
          visit(value, path);
        }
      }
    };
    visit(config, "");
    if (changed) this.notifyControlState(panelId);
  }
  savePreset(panelId, name) {
    const panel = this.panels.get(panelId);
    if (!panel) throw new Error(`Panel ${panelId} not found`);
    const id = `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const preset = {
      id,
      name,
      values: { ...panel.values }
    };
    const existing = this.presets.get(panelId) ?? [];
    this.presets.set(panelId, [...existing, preset]);
    this.activePreset.set(panelId, id);
    this.snapshots.set(panelId, { ...panel.values });
    this.notify(panelId);
    return id;
  }
  loadPreset(panelId, presetId) {
    const panel = this.panels.get(panelId);
    if (!panel) return;
    const presets = this.presets.get(panelId) ?? [];
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    panel.values = { ...preset.values };
    this.snapshots.set(panelId, { ...panel.values });
    this.activePreset.set(panelId, presetId);
    this.savePanelValues(panelId);
    this.notify(panelId);
  }
  deletePreset(panelId, presetId) {
    const presets = this.presets.get(panelId) ?? [];
    this.presets.set(panelId, presets.filter((p) => p.id !== presetId));
    if (this.activePreset.get(panelId) === presetId) {
      this.activePreset.set(panelId, null);
    }
    const panel = this.panels.get(panelId);
    if (panel) {
      this.snapshots.set(panelId, { ...panel.values });
    }
    this.notify(panelId);
  }
  getPresets(panelId) {
    return this.presets.get(panelId) ?? [];
  }
  getActivePresetId(panelId) {
    const provider = this.getPresetProvider(panelId);
    if (provider) return provider.activeId ?? null;
    return this.activePreset.get(panelId) ?? null;
  }
  clearActivePreset(panelId) {
    const panel = this.panels.get(panelId);
    const base = this.baseValues.get(panelId);
    if (panel && base) {
      panel.values = { ...base };
      this.snapshots.set(panelId, { ...panel.values });
    }
    this.activePreset.set(panelId, null);
    this.notify(panelId);
  }
  /**
   * Install (or clear) a host-owned preset provider. Safe to call on every
   * host render: the object is always swapped so `onSelect`/`onCreate`/
   * `onDelete` never close over stale host state, but listeners are only
   * notified when the visible data (list, active id) actually changed.
   */
  setPresetProvider(panelId, provider) {
    const entry = this.presetProviders.get(panelId);
    if (!provider) {
      if (!entry) return;
      this.presetProviders.delete(panelId);
    } else {
      const serialized = JSON.stringify(provider);
      this.presetProviders.set(panelId, { provider, serialized });
      if (entry?.serialized === serialized) return;
    }
    const panel = this.panels.get(panelId);
    if (panel) {
      this.snapshots.set(panelId, { ...panel.values });
    }
    this.notify(panelId);
  }
  getPresetProvider(panelId) {
    return this.presetProviders.get(panelId)?.provider ?? null;
  }
  /** Provider mode hides the implicit "Version 1" base row — the host owns the whole list. */
  hasPresetProvider(panelId) {
    return this.presetProviders.has(panelId);
  }
  /** The dropdown rows in host order, from the provider when one is set. */
  getPresetItems(panelId) {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      return provider.presets.map((p) => ({
        id: p.id,
        name: p.label,
        deletable: !!provider.onDelete && !p.readonly
      }));
    }
    return this.getPresets(panelId).map((p) => ({ id: p.id, name: p.name, deletable: true }));
  }
  /**
   * Row clicked. Stock mode loads the snapshot (null = back to base values);
   * provider mode hands the id to the host, which applies values itself.
   */
  selectPreset(panelId, presetId) {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      if (presetId) void provider.onSelect(presetId);
      return;
    }
    if (presetId) this.loadPreset(panelId, presetId);
    else this.clearActivePreset(panelId);
  }
  /**
   * "+" pressed. Stock mode snapshots into "Version N" (N counts the implicit
   * base as version 1); provider mode suggests the matching "Preset N" label.
   */
  createPreset(panelId) {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      void provider.onCreate(`Preset ${provider.presets.length + 1}`);
      return;
    }
    this.savePreset(panelId, `Version ${this.getPresets(panelId).length + 2}`);
  }
  /** Trash icon pressed on a row (only rendered when the item is deletable). */
  removePreset(panelId, presetId) {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      void provider.onDelete?.(presetId);
      return;
    }
    this.deletePreset(panelId, presetId);
  }
  resolveShortcutTarget(key, modifier) {
    for (const panel of this.panels.values()) {
      for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
        if (!shortcut.key) continue;
        if (shortcut.key.toLowerCase() !== key.toLowerCase()) continue;
        const scMod = shortcut.modifier ?? void 0;
        if (scMod !== modifier) continue;
        const control = this.findControlByPath(panel.controls, path);
        if (control) {
          return { panelId: panel.id, path, control };
        }
      }
    }
    return null;
  }
  resolveScrollOnlyTargets() {
    const results = [];
    for (const panel of this.panels.values()) {
      for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
        if ((shortcut.interaction ?? "scroll") !== "scroll-only") continue;
        const control = this.findControlByPath(panel.controls, path);
        if (control) {
          results.push({ panelId: panel.id, path, control, shortcut });
        }
      }
    }
    return results;
  }
  findControlByPath(controls, path) {
    for (const control of controls) {
      if (control.path === path) return control;
      if (control.type === "folder" && control.children) {
        const found = this.findControlByPath(control.children, path);
        if (found) return found;
      }
    }
    return null;
  }
  notify(panelId) {
    this.listeners.get(panelId)?.forEach((fn) => fn());
  }
  notifyGlobal() {
    this.globalListeners.forEach((fn) => fn());
  }
  initTransitionModes(config, prefix, values) {
    for (const [key, value] of Object.entries(config)) {
      if (key === "_collapsed" || key === "_collapsible") continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (this.isEasingConfig(value)) {
        values[`${path}.__mode`] = "easing";
      } else if (this.isSpringConfig(value)) {
        const hasPhysics = value.stiffness !== void 0 || value.damping !== void 0 || value.mass !== void 0;
        const hasTime = value.visualDuration !== void 0 || value.bounce !== void 0;
        values[`${path}.__mode`] = hasPhysics && !hasTime ? "advanced" : "simple";
      } else if (typeof value === "object" && value !== null && !Array.isArray(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value) && !this.isCurveConfig(value)) {
        this.initTransitionModes(value, path, values);
      }
    }
  }
  parseConfig(config, prefix, shortcuts) {
    const controls = [];
    for (const [key, value] of Object.entries(config)) {
      if (key === "_collapsed" || key === "_collapsible" || key === "_enabled") continue;
      const path = prefix ? `${prefix}.${key}` : key;
      const label = this.formatLabel(key);
      const shortcut = shortcuts?.[path];
      if (Array.isArray(value) && value.length <= 4 && typeof value[0] === "number") {
        const tuple = value;
        controls.push({
          type: "slider",
          path,
          label,
          min: tuple[1],
          max: tuple[2],
          step: tuple[3] ?? this.inferStep(tuple[1], tuple[2]),
          shortcut
        });
      } else if (typeof value === "number") {
        const { min, max, step } = this.inferRange(value);
        controls.push({ type: "slider", path, label, min, max, step, shortcut });
      } else if (this.isSliderConfig(value)) {
        controls.push({
          type: "slider",
          path,
          label,
          min: value.min,
          max: value.max,
          step: value.step ?? this.inferStep(value.min, value.max),
          unit: value.unit,
          formatValue: value.formatValue,
          origin: value.origin,
          bipolar: value.bipolar,
          shortcut
        });
      } else if (typeof value === "boolean") {
        controls.push({ type: "toggle", path, label, shortcut });
      } else if (this.isSpringConfig(value) || this.isEasingConfig(value)) {
        controls.push({ type: "transition", path, label });
      } else if (this.isActionConfig(value)) {
        controls.push({ type: "action", path, label: value.label || label });
      } else if (this.isSelectConfig(value)) {
        controls.push({ type: "select", path, label, options: value.options });
      } else if (this.isColorConfig(value)) {
        controls.push({ type: "color", path, label, alpha: value.alpha, palette: value.palette });
      } else if (this.isGradientConfig(value)) {
        controls.push({ type: "gradient", path, label });
      } else if (this.isXYConfig(value)) {
        controls.push({ type: "xy", path, label, xAxis: value.x, yAxis: value.y, grid: value.grid, density: value.density, snap: value.snap, returnToCenter: value.returnToCenter, showValues: value.showValues });
      } else if (this.isTextConfig(value)) {
        controls.push({ type: "text", path, label, placeholder: value.placeholder });
      } else if (this.isRangeConfig(value)) {
        controls.push({
          type: "range",
          path,
          label,
          min: value.min,
          max: value.max,
          step: value.step ?? this.inferStep(value.min, value.max),
          rangeDefault: value.default ?? { min: value.min, max: value.max }
        });
      } else if (this.isGalleryConfig(value)) {
        controls.push({ type: "gallery", path, label, items: value.items, columns: value.columns });
      } else if (this.isFileConfig(value)) {
        controls.push({ type: "file", path, label, accept: value.accept, multiple: value.multiple });
      } else if (this.isSwatchConfig(value)) {
        controls.push({ type: "swatch", path, label, swatchOptions: value.options });
      } else if (this.isChipsConfig(value)) {
        controls.push({ type: "chips", path, label, chipOptions: value.options });
      } else if (this.isMultiSelectConfig(value)) {
        controls.push({ type: "multiselect", path, label, multiSelectOptions: value.options });
      } else if (this.isListConfig(value)) {
        controls.push({ type: "list", path, label, itemTypes: value.itemTypes, addLabel: value.addLabel, maxItems: value.max });
      } else if (this.isCurveConfig(value)) {
        controls.push({
          type: "curve",
          path,
          label: typeof value.label === "string" ? value.label : label,
          hideLabel: value.label === false || void 0,
          sample: value.sample,
          domain: value.domain,
          markers: value.markers,
          height: value.height
        });
      } else if (typeof value === "string") {
        if (this.isHexColor(value)) {
          const hasAlpha = value.length === 5 || value.length === 9;
          controls.push({ type: "color", path, label, alpha: hasAlpha || void 0 });
        } else {
          controls.push({ type: "text", path, label });
        }
      } else if (typeof value === "object" && value !== null) {
        const folderConfig = value;
        const module = "_enabled" in folderConfig ? true : void 0;
        const collapsible = !module && folderConfig._collapsible === false ? false : void 0;
        const defaultOpen = collapsible === false ? true : "_collapsed" in folderConfig ? !folderConfig._collapsed : true;
        controls.push({
          type: "folder",
          path,
          label,
          defaultOpen,
          collapsible,
          module,
          children: this.parseConfig(folderConfig, path, shortcuts)
        });
      }
    }
    return controls;
  }
  flattenValues(config, prefix) {
    const values = {};
    for (const [key, value] of Object.entries(config)) {
      if (key === "_collapsed" || key === "_collapsible") continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(value) && value.length <= 4 && typeof value[0] === "number") {
        values[path] = value[0];
      } else if (this.isSliderConfig(value)) {
        values[path] = value.default;
      } else if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
        values[path] = value;
      } else if (this.isSpringConfig(value) || this.isEasingConfig(value)) {
        values[path] = value;
      } else if (this.isActionConfig(value)) {
        values[path] = value;
      } else if (this.isSelectConfig(value)) {
        const firstOption = value.options[0];
        const firstValue = typeof firstOption === "string" ? firstOption : firstOption.value;
        values[path] = value.default ?? firstValue;
      } else if (this.isColorConfig(value)) {
        values[path] = value.default ?? "#000000";
      } else if (this.isGradientConfig(value)) {
        values[path] = normalizeGradient(value.default ?? DEFAULT_GRADIENT);
      } else if (this.isXYConfig(value)) {
        const xAxis = resolveAxis(value.x);
        const yAxis = resolveAxis(value.y);
        values[path] = normalizeValue(value.default, xAxis, yAxis, value.snap ?? false);
      } else if (this.isTextConfig(value)) {
        values[path] = value.default ?? "";
      } else if (this.isRangeConfig(value)) {
        values[path] = value.default ?? { min: value.min, max: value.max };
      } else if (this.isGalleryConfig(value)) {
        values[path] = value.default ?? value.items[0]?.id ?? "";
      } else if (this.isFileConfig(value)) {
        values[path] = "";
      } else if (this.isSwatchConfig(value)) {
        values[path] = value.default ?? value.options[0]?.value ?? "";
      } else if (this.isChipsConfig(value)) {
        values[path] = value.default ?? value.options[0]?.value ?? "";
      } else if (this.isMultiSelectConfig(value)) {
        values[path] = value.default ?? [];
      } else if (this.isListConfig(value)) {
        values[path] = normalizeListItems(value);
      } else if (this.isCurveConfig(value)) {
      } else if (typeof value === "object" && value !== null) {
        Object.assign(values, this.flattenValues(value, path));
      }
    }
    return values;
  }
  isSpringConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "spring";
  }
  isEasingConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "easing";
  }
  isActionConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "action";
  }
  isSelectConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "select" && "options" in value && Array.isArray(value.options);
  }
  isColorConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "color";
  }
  isGradientConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "gradient";
  }
  // Explicit { type: 'xy' } only — a bare { x, y } object would collide with the
  // "nested object → folder" fallback, so the shorthand is deliberately unsupported.
  isXYConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "xy";
  }
  isRangeConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "range";
  }
  // A stored range VALUE ({min,max} numbers), as opposed to a range config.
  // Used to preserve the leaf value by identity across a panel update.
  isRangeValue(value) {
    return typeof value === "object" && value !== null && typeof value.min === "number" && typeof value.max === "number";
  }
  isTextConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "text";
  }
  isGalleryConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "gallery" && "items" in value && Array.isArray(value.items);
  }
  isFileConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "file";
  }
  isSwatchConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "swatch" && "options" in value && Array.isArray(value.options);
  }
  isChipsConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "chips" && "options" in value && Array.isArray(value.options);
  }
  isMultiSelectConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "multiselect" && "options" in value && Array.isArray(value.options);
  }
  isSliderConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "slider" && typeof value.min === "number" && typeof value.max === "number";
  }
  isCurveConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "curve" && typeof value.sample === "function";
  }
  isListConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "list" && "itemTypes" in value && typeof value.itemTypes === "object";
  }
  isHexColor(value) {
    return HEX_COLOR_REGEX.test(value);
  }
  formatLabel(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
  }
  inferRange(value) {
    if (value >= 0 && value <= 1) {
      return { min: 0, max: 1, step: 0.01 };
    } else if (value >= 0 && value <= 10) {
      return { min: 0, max: value * 3 || 10, step: 0.1 };
    } else if (value >= 0 && value <= 100) {
      return { min: 0, max: value * 3 || 100, step: 1 };
    } else if (value >= 0) {
      return { min: 0, max: value * 3 || 1e3, step: 10 };
    } else {
      return { min: value * 3, max: -value * 3, step: 1 };
    }
  }
  inferStep(min, max) {
    const range = max - min;
    if (range <= 1) return 0.01;
    if (range <= 10) return 0.1;
    if (range <= 100) return 1;
    return 10;
  }
  normalizePreservedValue(existingValue, defaultValue, control) {
    if (existingValue === void 0 || !control) {
      return defaultValue;
    }
    switch (control.type) {
      case "slider": {
        if (typeof existingValue !== "number" || typeof defaultValue !== "number") {
          return defaultValue;
        }
        const min = control.min ?? Number.NEGATIVE_INFINITY;
        const max = control.max ?? Number.POSITIVE_INFINITY;
        const clamped = Math.min(max, Math.max(min, existingValue));
        if (typeof control.step !== "number" || control.step <= 0) {
          return clamped;
        }
        return this.roundToStep(clamped, min, max, control.step);
      }
      case "toggle":
        return typeof existingValue === "boolean" ? existingValue : defaultValue;
      case "select": {
        if (typeof existingValue !== "string") {
          return defaultValue;
        }
        const options = control.options ?? [];
        const validValues = new Set(options.map((option) => typeof option === "string" ? option : option.value));
        return validValues.has(existingValue) ? existingValue : defaultValue;
      }
      case "swatch": {
        if (typeof existingValue !== "string") {
          return defaultValue;
        }
        const validValues = new Set((control.swatchOptions ?? []).map((option) => option.value));
        return validValues.has(existingValue) ? existingValue : defaultValue;
      }
      case "chips": {
        if (typeof existingValue !== "string") {
          return defaultValue;
        }
        const validValues = new Set((control.chipOptions ?? []).map((option) => option.value));
        return validValues.has(existingValue) ? existingValue : defaultValue;
      }
      case "multiselect": {
        if (!Array.isArray(existingValue) || existingValue.some((v) => typeof v !== "string")) {
          return defaultValue;
        }
        const validValues = new Set((control.multiSelectOptions ?? []).map((option) => option.value));
        return existingValue.filter((v) => validValues.has(v));
      }
      case "color": {
        if (typeof existingValue !== "string" || !this.isHexColor(existingValue)) {
          return defaultValue;
        }
        if (!control.alpha && (existingValue.length === 5 || existingValue.length === 9)) {
          return existingValue.length === 9 ? existingValue.slice(0, 7) : existingValue.slice(0, 4);
        }
        if (control.alpha && (existingValue.length === 4 || existingValue.length === 7)) {
          return existingValue + (existingValue.length === 7 ? "ff" : "f");
        }
        return existingValue;
      }
      case "gradient": {
        if (typeof existingValue !== "object" || existingValue === null || !Array.isArray(existingValue.stops)) {
          return defaultValue;
        }
        return normalizeGradient(existingValue);
      }
      case "xy": {
        if (typeof existingValue !== "object" || existingValue === null || Array.isArray(existingValue)) {
          return defaultValue;
        }
        const candidate = existingValue;
        if (typeof candidate.x !== "number" || typeof candidate.y !== "number") {
          return defaultValue;
        }
        const xAxis = resolveAxis(control.xAxis);
        const yAxis = resolveAxis(control.yAxis);
        return normalizeValue(candidate, xAxis, yAxis, false);
      }
      case "text":
      case "file":
        return typeof existingValue === "string" ? existingValue : defaultValue;
      case "list":
        return Array.isArray(existingValue) ? existingValue : defaultValue;
      case "range": {
        if (!this.isRangeValue(existingValue)) {
          return defaultValue;
        }
        const lo = control.min ?? Number.NEGATIVE_INFINITY;
        const hi = control.max ?? Number.POSITIVE_INFINITY;
        return clampRange(existingValue, lo, hi);
      }
      case "gallery": {
        if (typeof existingValue !== "string") {
          return defaultValue;
        }
        const validIds = new Set((control.items ?? []).map((item) => item.id));
        return validIds.has(existingValue) ? existingValue : defaultValue;
      }
      case "transition":
        if (this.isSpringConfig(defaultValue)) {
          return this.isSpringConfig(existingValue) ? existingValue : defaultValue;
        }
        if (this.isEasingConfig(defaultValue)) {
          return this.isEasingConfig(existingValue) ? existingValue : defaultValue;
        }
        return defaultValue;
      case "action":
        return defaultValue;
      default:
        return defaultValue;
    }
  }
  roundToStep(value, min, max, step) {
    const snapped = min + Math.round((value - min) / step) * step;
    const clamped = Math.min(max, Math.max(min, snapped));
    const precision = this.stepPrecision(step);
    return Number(clamped.toFixed(precision));
  }
  stepPrecision(step) {
    const text = String(step);
    const decimalIndex = text.indexOf(".");
    return decimalIndex === -1 ? 0 : text.length - decimalIndex - 1;
  }
  // Stamp path-keyed extras onto the parsed tree. A post-pass rather than
  // parseConfig parameters: these are cross-cutting metadata like shortcuts, and
  // every control — including folders and bare-shorthand sliders — is reachable
  // by path once the tree exists.
  applyControlExtras(controls, hints, affordances, labels) {
    if (!hints && !affordances && !labels) return;
    for (const control of controls) {
      const hint = hints?.[control.path];
      if (hint) control.hint = hint;
      const affordance = affordances?.[control.path];
      if (affordance) control.affordance = affordance;
      const label = labels?.[control.path];
      if (label) control.label = label;
      if (control.children) this.applyControlExtras(control.children, hints, affordances, labels);
    }
  }
  mapControlsByPath(controls) {
    const map = /* @__PURE__ */ new Map();
    const visit = (nodes) => {
      for (const node of nodes) {
        if (node.type === "folder" && node.children) {
          if (node.module) {
            const enabledPath = `${node.path}._enabled`;
            map.set(enabledPath, { type: "toggle", path: enabledPath, label: "Enabled" });
          }
          visit(node.children);
          continue;
        }
        map.set(node.path, node);
      }
    };
    visit(controls);
    return map;
  }
};
function listHasType(value, type) {
  return typeof value === "object" && value !== null && "type" in value && value.type === type;
}
function listFormatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
}
function listIsHexColor(value) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
}
function listInferStep(min, max) {
  const range = max - min;
  if (range <= 1) return 0.01;
  if (range <= 10) return 0.1;
  if (range <= 100) return 1;
  return 10;
}
function listInferRange(value) {
  if (value >= 0 && value <= 1) return { min: 0, max: 1, step: 0.01 };
  if (value >= 0 && value <= 10) return { min: 0, max: value * 3 || 10, step: 0.1 };
  if (value >= 0 && value <= 100) return { min: 0, max: value * 3 || 100, step: 1 };
  if (value >= 0) return { min: 0, max: value * 3 || 1e3, step: 10 };
  return { min: value * 3, max: -value * 3, step: 1 };
}
function parseListItemSchema(schema, hints, groups) {
  const fields = [];
  for (const [key, def] of Object.entries(schema)) {
    const label = listFormatLabel(key);
    const hint = hints?.[key];
    const group = groups?.[key];
    if (Array.isArray(def) && def.length <= 4 && typeof def[0] === "number") {
      const [d, min, max, step] = def;
      fields.push({ key, label, hint, group, kind: "slider", min, max, step: step ?? listInferStep(min, max), defaultValue: d });
    } else if (typeof def === "number") {
      const { min, max, step } = listInferRange(def);
      fields.push({ key, label, hint, group, kind: "slider", min, max, step, defaultValue: def });
    } else if (typeof def === "boolean") {
      fields.push({ key, label, hint, group, kind: "toggle", defaultValue: def });
    } else if (listHasType(def, "select") && Array.isArray(def.options)) {
      const select = def;
      const first = select.options[0];
      const firstValue = typeof first === "string" ? first : first?.value ?? "";
      fields.push({ key, label, hint, group, kind: "select", options: select.options, defaultValue: select.default ?? firstValue });
    } else if (listHasType(def, "color")) {
      const color = def;
      fields.push({ key, label, hint, group, kind: "color", palette: color.palette, defaultValue: color.default ?? "#000000" });
    } else if (listHasType(def, "swatch") && Array.isArray(def.options)) {
      const swatch = def;
      fields.push({
        key,
        label,
        hint,
        group,
        kind: "swatch",
        swatchOptions: swatch.options,
        defaultValue: swatch.default ?? swatch.options[0]?.value ?? ""
      });
    } else if (listHasType(def, "text")) {
      const text = def;
      fields.push({ key, label, hint, group, kind: "text", placeholder: text.placeholder, defaultValue: text.default ?? "" });
    } else if (typeof def === "string") {
      fields.push({ key, label, hint, group, kind: listIsHexColor(def) ? "color" : "text", defaultValue: def });
    }
  }
  return fields;
}
function defaultListItemParams(schema) {
  const params = {};
  for (const field of parseListItemSchema(schema)) {
    params[field.key] = field.defaultValue;
  }
  return params;
}
function normalizeListItems(config) {
  const items = config.default ?? [];
  return items.filter((item) => item && typeof item.type === "string" && config.itemTypes[item.type]).map((item) => {
    const row = {
      type: item.type,
      params: { ...defaultListItemParams(config.itemTypes[item.type].schema), ...item.params ?? {} }
    };
    const title = typeof item.title === "string" ? item.title.trim() : "";
    if (title) row.title = title;
    return row;
  });
}
var DialStore = new DialStoreClass();

// src/vue/useDialKit.ts
var dialKitInstance = 0;
function useDialKit(name, config, options) {
  const panelId = `${name}-${++dialKitInstance}`;
  const configRef = shallowRef(config);
  const onActionRef = ref(options?.onAction);
  const shortcutsRef = shallowRef(options?.shortcuts);
  const values = ref(DialStore.getValues(panelId));
  const mounted = ref(false);
  const serializedConfig = computed(() => JSON.stringify(config));
  const serializedShortcuts = computed(() => JSON.stringify(options?.shortcuts));
  let unsubscribeValues;
  let unsubscribeActions;
  const register = () => {
    DialStore.registerPanel(panelId, name, configRef.value, shortcutsRef.value, {
      hints: options?.hints,
      affordances: options?.affordances,
      labels: options?.labels
    });
    DialStore.setPresetProvider(panelId, options?.presets ?? null);
    values.value = DialStore.getValues(panelId);
    unsubscribeValues = DialStore.subscribe(panelId, () => {
      values.value = DialStore.getValues(panelId);
    });
    unsubscribeActions = DialStore.subscribeActions(panelId, (action) => {
      onActionRef.value?.(action);
    });
  };
  watch(() => options?.onAction, (next) => {
    onActionRef.value = next;
  });
  watch(() => options?.shortcuts, (next) => {
    shortcutsRef.value = next;
  });
  watch(() => JSON.stringify(options?.presets ?? null), () => {
    if (mounted.value) {
      DialStore.setPresetProvider(panelId, options?.presets ?? null);
    }
  });
  watch([serializedConfig, serializedShortcuts], () => {
    configRef.value = config;
    shortcutsRef.value = options?.shortcuts;
    if (mounted.value) {
      DialStore.updatePanel(panelId, name, configRef.value, shortcutsRef.value, {
        hints: options?.hints,
        affordances: options?.affordances,
        labels: options?.labels
      });
      values.value = DialStore.getValues(panelId);
    }
  });
  onMounted(register);
  onMounted(() => {
    mounted.value = true;
  });
  onUnmounted(() => {
    unsubscribeValues?.();
    unsubscribeActions?.();
    DialStore.unregisterPanel(panelId);
  });
  return computed(() => buildResolvedValues(configRef.value, values.value, ""));
}
function buildResolvedValues(config, flatValues, prefix) {
  const result = {};
  for (const [key, configValue] of Object.entries(config)) {
    if (key === "_collapsed" || key === "_collapsible") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === "number") {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (typeof configValue === "number" || typeof configValue === "boolean" || typeof configValue === "string") {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSpringConfig(configValue) || isEasingConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? "#000000";
    } else if (isGradientConfig(configValue)) {
      result[key] = flatValues[path] ?? normalizeGradient(configValue.default ?? DEFAULT_GRADIENT);
    } else if (isTextConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? "";
    } else if (typeof configValue === "object" && configValue !== null) {
      result[key] = buildResolvedValues(configValue, flatValues, path);
    }
  }
  return result;
}
function hasType(value, type) {
  return typeof value === "object" && value !== null && "type" in value && value.type === type;
}
function isSpringConfig(value) {
  return hasType(value, "spring");
}
function isEasingConfig(value) {
  return hasType(value, "easing");
}
function isActionConfig(value) {
  return hasType(value, "action");
}
function isSelectConfig(value) {
  return hasType(value, "select") && "options" in value && Array.isArray(value.options);
}
function isColorConfig(value) {
  return hasType(value, "color");
}
function isGradientConfig(value) {
  return hasType(value, "gradient");
}
function isTextConfig(value) {
  return hasType(value, "text");
}
function getFirstOptionValue(options) {
  const first = options[0];
  return typeof first === "string" ? first : first.value;
}

// src/vue/directives/dialkit.ts
import {
  createApp,
  defineComponent as defineComponent27,
  h as h27,
  shallowRef as shallowRef2
} from "vue";

// src/vue/components/DialRoot.ts
import { defineComponent as defineComponent26, h as h26, onMounted as onMounted17, onUnmounted as onUnmounted11, ref as ref22, Teleport as Teleport6 } from "vue";

// src/store/TimelineStore.ts
var MIN_LOOP_REGION = 0.02;
function loopSpan(duration, loopStart, loopEnd) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  if (!Number.isFinite(loopStart)) loopStart = 0;
  const end = Number.isFinite(loopEnd) ? Math.min(Math.max(0, loopEnd), duration) : duration;
  const start = Math.min(Math.max(0, loopStart), duration);
  const span = end - start;
  return span > 0 ? span : duration;
}
function foldLoopTime(time, duration, loopStart = 0, loopEnd) {
  if (!Number.isFinite(time) || !Number.isFinite(duration) || duration <= 0) {
    return { time: 0, wraps: 0 };
  }
  const end = Number.isFinite(loopEnd) ? Math.min(Math.max(0, loopEnd), duration) : duration;
  if (time < end) return { time, wraps: 0 };
  const span = loopSpan(duration, loopStart, end);
  const base = end - span;
  const over = time - base;
  return { time: base + over % span, wraps: Math.floor(over / span) };
}
var TIMELINE_CLIP_COLORS = [
  "#E8E8E8"
  // neutral white — slightly off-white so the pure-white selection ring still reads
];
var EMPTY_TRANSPORT = Object.freeze({ time: 0, playing: false, duration: 0, wraps: 0 });
var TimelineStoreClass = class {
  constructor() {
    this.timelines = /* @__PURE__ */ new Map();
    this.transports = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
    this.globalListeners = /* @__PURE__ */ new Set();
    this.registrationCounts = /* @__PURE__ */ new Map();
    // User-defined loop windows. Absent = loop the whole timeline. The stored
    // object reference is stable until set/clear so useSyncExternalStore readers
    // don't churn.
    this.loopRegions = /* @__PURE__ */ new Map();
    this.persistTargets = /* @__PURE__ */ new Map();
    this.listCache = null;
    this.rafId = null;
    this.lastTick = 0;
    this.tick = (now) => {
      const dt = Math.max(0, (now - this.lastTick) / 1e3);
      this.lastTick = now;
      let anyPlaying = false;
      for (const [id, transport] of this.transports) {
        if (!transport.playing) continue;
        const meta = this.timelines.get(id);
        const duration = meta?.duration ?? transport.duration;
        if (!Number.isFinite(duration) || duration <= 0) {
          this.transports.set(id, { time: 0, playing: false, duration: 0, wraps: 0 });
          this.notify(id);
          continue;
        }
        let time = transport.time + dt;
        let wraps = transport.wraps;
        const region = this.effectiveRegion(id, duration);
        if (time >= region.end) {
          const folded = foldLoopTime(time, duration, region.start, region.end);
          time = folded.time;
          wraps += folded.wraps;
        }
        this.transports.set(id, { time, playing: true, duration, wraps });
        anyPlaying = true;
        this.notify(id);
      }
      this.rafId = anyPlaying ? window.requestAnimationFrame(this.tick) : null;
    };
  }
  register(meta, options) {
    const existing = this.timelines.get(meta.id);
    if (existing && existing.name !== meta.name) {
      console.warn(
        `[dialkit] Timeline id "${meta.id}" is already registered by "${existing.name}"; "${meta.name}" will share and overwrite that transport.`
      );
    }
    const firstRegistration = !this.registrationCounts.has(meta.id);
    this.registrationCounts.set(meta.id, (this.registrationCounts.get(meta.id) ?? 0) + 1);
    if (firstRegistration) {
      this.persistTargets.set(meta.id, resolvePersistTarget("timeline-loop", meta.id, options.persist));
      this.hydrateLoopRegion(meta);
    }
    this.applyMeta(meta, options.autoplay);
  }
  update(meta) {
    if (!this.timelines.has(meta.id)) return;
    this.applyMeta(meta, false);
  }
  unregister(id) {
    const nextCount = (this.registrationCounts.get(id) ?? 1) - 1;
    if (nextCount > 0) {
      this.registrationCounts.set(id, nextCount);
      return;
    }
    this.registrationCounts.delete(id);
    this.timelines.delete(id);
    this.transports.delete(id);
    this.loopRegions.delete(id);
    this.persistTargets.delete(id);
    if (this.listeners.get(id)?.size === 0) this.listeners.delete(id);
    this.listCache = null;
    this.notifyGlobal();
  }
  /** Restore a persisted loop region, or seed one from a code-defined
   * `options.loop`. No region at all = loop the whole timeline (the default). */
  hydrateLoopRegion(meta) {
    const duration = Number.isFinite(meta.duration) ? Math.max(0, meta.duration) : 0;
    const persisted = loadPersisted(this.persistTargets.get(meta.id) ?? null);
    if (persisted && Number.isFinite(persisted.start) && Number.isFinite(persisted.end)) {
      const region = this.normalizeRegion(persisted.start, persisted.end, duration);
      if (region) this.loopRegions.set(meta.id, region);
      return;
    }
    if (meta.loop) {
      const region = this.normalizeRegion(meta.loopStart, duration, duration);
      if (region) this.loopRegions.set(meta.id, region);
    }
  }
  /** Clamp to [0,duration], order min/max, and reject degenerate widths. */
  normalizeRegion(start, end, duration) {
    if (!Number.isFinite(start) || !Number.isFinite(end) || duration <= 0) return null;
    const lo = Math.min(Math.max(0, Math.min(start, end)), duration);
    const hi = Math.min(Math.max(0, Math.max(start, end)), duration);
    if (hi - lo < MIN_LOOP_REGION) return null;
    return { start: lo, end: hi };
  }
  setLoopRegion(id, start, end) {
    const transport = this.transports.get(id);
    const duration = transport?.duration ?? this.timelines.get(id)?.duration ?? 0;
    const region = this.normalizeRegion(start, end, duration);
    if (!region) return;
    this.loopRegions.set(id, region);
    savePersisted(this.persistTargets.get(id) ?? null, region);
    this.notify(id);
  }
  clearLoopRegion(id) {
    if (!this.loopRegions.has(id)) return;
    this.loopRegions.delete(id);
    clearPersisted(this.persistTargets.get(id) ?? null);
    this.notify(id);
  }
  /** The raw user/code region, or undefined when looping the whole timeline.
   * The reference is stable between changes (safe for useSyncExternalStore). */
  getLoopRegion(id) {
    return this.loopRegions.get(id);
  }
  /** The region the clock actually loops within: the user/code region, or the
   * whole timeline `[0, duration]` when none is set. Playback always wraps. */
  effectiveRegion(id, duration) {
    const region = this.loopRegions.get(id);
    if (region) return region;
    return { start: 0, end: Math.max(0, duration) };
  }
  play(id) {
    const transport = this.transports.get(id);
    if (!transport || transport.duration <= 0 || transport.playing) return;
    const region = this.effectiveRegion(id, transport.duration);
    const restart = transport.time >= region.end;
    this.transports.set(id, {
      ...transport,
      time: restart ? region.start : transport.time,
      wraps: restart ? 0 : transport.wraps,
      playing: true
    });
    this.notify(id);
    this.ensureLoop();
  }
  pause(id) {
    const transport = this.transports.get(id);
    if (!transport || !transport.playing) return;
    this.transports.set(id, { ...transport, playing: false });
    this.notify(id);
  }
  replay(id) {
    const transport = this.transports.get(id);
    if (!transport || transport.duration <= 0) return;
    const region = this.effectiveRegion(id, transport.duration);
    this.transports.set(id, { ...transport, time: region.start, wraps: 0, playing: true });
    this.notify(id);
    this.ensureLoop();
  }
  seek(id, time) {
    const transport = this.transports.get(id);
    if (!transport || !Number.isFinite(time)) return;
    const clamped = Math.min(transport.duration, Math.max(0, time));
    this.transports.set(id, { ...transport, time: clamped, wraps: 0 });
    this.notify(id);
  }
  getTransport(id) {
    return this.transports.get(id) ?? EMPTY_TRANSPORT;
  }
  getTimeline(id) {
    return this.timelines.get(id);
  }
  getTimelines() {
    if (!this.listCache) {
      this.listCache = Array.from(this.timelines.values());
    }
    return this.listCache;
  }
  subscribe(id, listener) {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, /* @__PURE__ */ new Set());
    }
    this.listeners.get(id).add(listener);
    return () => {
      const listeners2 = this.listeners.get(id);
      listeners2?.delete(listener);
      if (listeners2?.size === 0 && !this.timelines.has(id)) {
        this.listeners.delete(id);
      }
    };
  }
  subscribeGlobal(listener) {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }
  applyMeta(meta, autoplay) {
    const duration = Number.isFinite(meta.duration) ? Math.max(0, meta.duration) : 0;
    const loopStart = Number.isFinite(meta.loopStart) ? Math.min(duration, Math.max(0, meta.loopStart)) : 0;
    const safeMeta = { ...meta, duration, loopStart };
    this.timelines.set(meta.id, safeMeta);
    const region = this.loopRegions.get(meta.id);
    if (region) {
      const reclamped = this.normalizeRegion(region.start, region.end, duration);
      if (reclamped) this.loopRegions.set(meta.id, reclamped);
      else this.loopRegions.delete(meta.id);
    }
    const existing = this.transports.get(meta.id);
    if (existing) {
      this.transports.set(meta.id, {
        time: Math.min(existing.time, duration),
        playing: duration > 0 && existing.playing,
        duration,
        wraps: existing.wraps
      });
    } else {
      const playing = duration > 0 && autoplay;
      this.transports.set(meta.id, { time: 0, playing, duration, wraps: 0 });
      if (playing) this.ensureLoop();
    }
    this.listCache = null;
    this.notify(meta.id);
    this.notifyGlobal();
  }
  ensureLoop() {
    if (this.rafId !== null || typeof window === "undefined") return;
    this.lastTick = performance.now();
    this.rafId = window.requestAnimationFrame(this.tick);
  }
  notify(id) {
    this.listeners.get(id)?.forEach((fn) => fn());
  }
  notifyGlobal() {
    this.globalListeners.forEach((fn) => fn());
  }
};
var TimelineStore = /* @__PURE__ */ new TimelineStoreClass();

// src/vue/components/Panel.ts
import { Fragment as Fragment2, defineComponent as defineComponent24, h as h24, onMounted as onMounted15, onUnmounted as onUnmounted9, ref as ref20 } from "vue";
import { AnimatePresence as AnimatePresence6, motion as motion6 } from "motion-v";

// src/icons.ts
var ICON_CHEVRON = "M6 9.5L12 15.5L18 9.5";
var ICON_CHECK = "M5 12.75L10 19L19 5";
var ICON_PAUSE = [
  "M6.75 3C5.23122 3 4 4.23122 4 5.75V18.25C4 19.7688 5.23122 21 6.75 21H7.25C8.76878 21 10 19.7688 10 18.25V5.75C10 4.23122 8.76878 3 7.25 3H6.75Z",
  "M16.75 3C15.2312 3 14 4.23122 14 5.75V18.25C14 19.7688 15.2312 21 16.75 21H17.25C18.7688 21 20 19.7688 20 18.25V5.75C20 4.23122 18.7688 3 17.25 3H16.75Z"
];
var ICON_PLAY = "M9.24394 2.36758C7.41419 1.18362 5 2.49701 5 4.67639V19.3238C5 21.5032 7.41419 22.8166 9.24394 21.6326L20.5624 14.3089C22.2371 13.2253 22.2372 10.775 20.5624 9.69129L9.24394 2.36758Z";
var ICON_REPLAY = [
  "M12 2.5C17.2466 2.50016 21.5 6.7534 21.5 12C21.5 17.2466 17.2466 21.4998 12 21.5C7.52191 21.5 3.76987 18.4025 2.76465 14.2344C2.63517 13.6975 2.96508 13.1578 3.50195 13.0283C4.03883 12.8988 4.57851 13.2288 4.70801 13.7656C5.5016 17.0563 8.46701 19.5 12 19.5C16.142 19.4998 19.5 16.142 19.5 12C19.5 7.85796 16.142 4.50016 12 4.5C9.32981 4.5 6.98389 5.89541 5.6543 8H7.5C8.05228 8 8.5 8.44772 8.5 9C8.5 9.55228 8.05228 10 7.5 10H3.5C2.94772 10 2.5 9.55228 2.5 9V5C2.5 4.44772 2.94772 4 3.5 4C4.05228 4 4.5 4.44772 4.5 5V6.16797C6.2376 3.93677 8.95063 2.5 12 2.5Z",
  "M10 9.94043C10 9.33379 10.6826 8.97849 11.1797 9.32617L14.1221 11.3857C14.5486 11.6843 14.5486 12.3157 14.1221 12.6143L11.1797 14.6738C10.6826 15.0215 10 14.6662 10 14.0596V9.94043Z"
];
var ICON_LOOP = [
  "M17 2L21 6L17 10",
  "M3 11V9C3 7.34315 4.34315 6 6 6H21",
  "M7 22L3 18L7 14",
  "M21 13V15C21 16.6569 19.6569 18 18 18H3"
];
var ICON_TIMELINE = [
  "M18.868 10C20.8517 10.0003 22.2886 11.8914 21.7577 13.8027L20.369 18.8027C20.0083 20.1012 18.826 20.9999 17.4784 21H6.51941C5.17179 21 3.98948 20.1012 3.62878 18.8027L2.24011 13.8027C1.7092 11.8913 3.14603 10.0003 5.12976 10H18.868Z",
  "M18.9989 6.5C19.5511 6.50007 19.9989 6.94776 19.9989 7.5C19.9989 8.05224 19.5511 8.49993 18.9989 8.5H4.9989C4.44661 8.5 3.9989 8.05228 3.9989 7.5C3.9989 6.94772 4.44661 6.5 4.9989 6.5H18.9989Z",
  "M16.9989 3C17.5511 3.00007 17.9989 3.44776 17.9989 4C17.9989 4.55224 17.5511 4.99993 16.9989 5H6.9989C6.44661 5 5.9989 4.55228 5.9989 4C5.9989 3.44772 6.44661 3 6.9989 3H16.9989Z"
];
var ICON_GRIP = [
  { cx: "9", cy: "6" },
  { cx: "9", cy: "12" },
  { cx: "9", cy: "18" },
  { cx: "15", cy: "6" },
  { cx: "15", cy: "12" },
  { cx: "15", cy: "18" }
];
var ICON_CLIPBOARD = {
  board: "M8 6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V7H8V6Z",
  sparkle: "M19.2405 16.1852L18.5436 14.3733C18.4571 14.1484 18.241 14 18 14C17.759 14 17.5429 14.1484 17.4564 14.3733L16.7595 16.1852C16.658 16.4493 16.4493 16.658 16.1852 16.7595L14.3733 17.4564C14.1484 17.5429 14 17.759 14 18C14 18.241 14.1484 18.4571 14.3733 18.5436L16.1852 19.2405C16.4493 19.342 16.658 19.5507 16.7595 19.8148L17.4564 21.6267C17.5429 21.8516 17.759 22 18 22C18.241 22 18.4571 21.8516 18.5436 21.6267L19.2405 19.8148C19.342 19.5507 19.5507 19.342 19.8148 19.2405L21.6267 18.5436C21.8516 18.4571 22 18.241 22 18C22 17.759 21.8516 17.5429 21.6267 17.4564L19.8148 16.7595C19.5507 16.658 19.342 16.4493 19.2405 16.1852Z",
  body: "M16 5H17C18.6569 5 20 6.34315 20 8V11M8 5H7C5.34315 5 4 6.34315 4 8V18C4 19.6569 5.34315 21 7 21H12"
};
var ICON_ADD_PRESET = [
  "M4 6H20",
  "M4 12H10",
  "M15 15L21 15",
  "M18 12V18",
  "M4 18H10"
];
var ICON_TRASH = [
  "M5 6.5L5.80734 18.2064C5.91582 19.7794 7.22348 21 8.80023 21H15.1998C16.7765 21 18.0842 19.7794 18.1927 18.2064L19 6.5",
  "M10 11V16",
  "M14 11V16",
  "M3.5 6H20.5",
  "M8.07092 5.74621C8.42348 3.89745 10.0485 2.5 12 2.5C13.9515 2.5 15.5765 3.89745 15.9291 5.74621"
];
var ICON_PANEL = {
  path: "M6.84766 11.75C6.78583 11.9899 6.75 12.2408 6.75 12.5C6.75 12.7592 6.78583 13.0101 6.84766 13.25H2C1.58579 13.25 1.25 12.9142 1.25 12.5C1.25 12.0858 1.58579 11.75 2 11.75H6.84766ZM14 11.75C14.4142 11.75 14.75 12.0858 14.75 12.5C14.75 12.9142 14.4142 13.25 14 13.25H12.6523C12.7142 13.0101 12.75 12.7592 12.75 12.5C12.75 12.2408 12.7142 11.9899 12.6523 11.75H14ZM3.09766 7.25C3.03583 7.48994 3 7.74075 3 8C3 8.25925 3.03583 8.51006 3.09766 8.75H2C1.58579 8.75 1.25 8.41421 1.25 8C1.25 7.58579 1.58579 7.25 2 7.25H3.09766ZM14 7.25C14.4142 7.25 14.75 7.58579 14.75 8C14.75 8.41421 14.4142 8.75 14 8.75H8.90234C8.96417 8.51006 9 8.25925 9 8C9 7.74075 8.96417 7.48994 8.90234 7.25H14ZM7.59766 2.75C7.53583 2.98994 7.5 3.24075 7.5 3.5C7.5 3.75925 7.53583 4.01006 7.59766 4.25H2C1.58579 4.25 1.25 3.91421 1.25 3.5C1.25 3.08579 1.58579 2.75 2 2.75H7.59766ZM14 2.75C14.4142 2.75 14.75 3.08579 14.75 3.5C14.75 3.91421 14.4142 4.25 14 4.25H13.4023C13.4642 4.01006 13.5 3.75925 13.5 3.5C13.5 3.24075 13.4642 2.98994 13.4023 2.75H14Z",
  circles: [
    { cx: "6", cy: "8", r: "0.998596" },
    { cx: "10.4999", cy: "3.5", r: "0.998657" },
    { cx: "9.75015", cy: "12.5", r: "0.997986" }
  ]
};

// src/vue/components/Folder.ts
import { defineComponent, h, onMounted as onMounted2, onUnmounted as onUnmounted2, ref as ref2 } from "vue";
import { AnimatePresence, motion } from "motion-v";
var Folder = defineComponent({
  name: "DialKitFolder",
  props: {
    title: { type: String, required: true },
    defaultOpen: { type: Boolean, default: true },
    /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
    collapsible: { type: Boolean, default: true },
    isRoot: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    toolbar: {
      type: null,
      required: false,
      default: null
    },
    /** One line of help for the section, revealed on hover over the header. */
    hint: { type: String, default: void 0 },
    hintId: { type: String, default: void 0 }
  },
  emits: ["openChange"],
  setup(props, { emit, slots }) {
    const isOpen = ref2(props.collapsible ? props.defaultOpen : true);
    const isCollapsed = ref2(props.collapsible ? !props.defaultOpen : false);
    const contentRef = ref2(null);
    const contentHeight = ref2(void 0);
    const windowHeight = ref2(typeof window !== "undefined" ? window.innerHeight : 800);
    let resizeHandler = null;
    if (props.isRoot) {
      resizeHandler = () => {
        windowHeight.value = window.innerHeight;
      };
      window.addEventListener("resize", resizeHandler);
    }
    onUnmounted2(() => {
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
    });
    const handleToggle = () => {
      if (!props.collapsible) return;
      if (props.inline && props.isRoot) return;
      const next = !isOpen.value;
      isOpen.value = next;
      isCollapsed.value = !next;
      emit("openChange", next);
    };
    let ro = null;
    onMounted2(() => {
      if (!props.isRoot || typeof ResizeObserver === "undefined") return;
      const el = contentRef.value;
      if (!el) return;
      ro = new ResizeObserver(() => {
        if (isOpen.value) {
          const next = el.offsetHeight;
          if (contentHeight.value !== next) {
            contentHeight.value = next;
          }
        }
      });
      ro.observe(el);
      if (isOpen.value) {
        contentHeight.value = el.offsetHeight;
      }
    });
    onUnmounted2(() => {
      ro?.disconnect();
    });
    const renderHeader = () => h("div", {
      class: `dialkit-folder-header ${props.isRoot ? "dialkit-panel-header" : ""} ${props.collapsible ? "" : "dialkit-folder-header-static"}`,
      onClick: props.collapsible ? handleToggle : void 0,
      "data-hint": props.hint ? "true" : void 0,
      "aria-describedby": props.hint ? props.hintId : void 0
    }, [
      h("div", { class: "dialkit-folder-header-top" }, [
        props.isRoot ? isOpen.value ? h("div", { class: "dialkit-folder-title-row" }, [
          h("span", { class: "dialkit-folder-title dialkit-folder-title-root" }, props.title)
        ]) : null : h("div", { class: "dialkit-folder-title-row" }, [
          h("span", { class: "dialkit-folder-title" }, props.title)
        ]),
        props.isRoot && !props.inline ? h("svg", { class: "dialkit-panel-icon", viewBox: "0 0 16 16", fill: "none" }, [
          h("path", {
            opacity: "0.5",
            d: ICON_PANEL.path,
            fill: "currentColor"
          }),
          ...ICON_PANEL.circles.map((c) => h("circle", { cx: c.cx, cy: c.cy, r: c.r, fill: "currentColor", stroke: "currentColor", "stroke-width": "1.25" }))
        ]) : null,
        !props.isRoot && props.collapsible ? h(motion.svg, {
          class: "dialkit-folder-icon",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          initial: false,
          animate: { rotate: isOpen.value ? 0 : 180 },
          transition: { type: "spring", visualDuration: 0.35, bounce: 0.15 }
        }, [h("path", { d: ICON_CHEVRON })]) : null
      ]),
      props.isRoot && props.toolbar && isOpen.value ? h("div", { class: "dialkit-panel-toolbar", onClick: (event) => event.stopPropagation() }, [props.toolbar()]) : null,
      props.hint ? h("span", { class: "dialkit-hint", id: props.hintId, role: "tooltip" }, props.hint) : null
    ]);
    const renderChildren = () => h("div", { class: "dialkit-folder-inner" }, slots.default ? slots.default() : []);
    const renderContent = () => {
      if (props.isRoot) {
        return isOpen.value ? h("div", { class: "dialkit-folder-content" }, [renderChildren()]) : null;
      }
      return h(AnimatePresence, { initial: false }, {
        default: () => isOpen.value ? [h(motion.div, {
          key: "dialkit-folder-content",
          class: "dialkit-folder-content",
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          transition: { type: "spring", visualDuration: 0.35, bounce: 0.1 },
          style: { clipPath: "inset(0 -20px)" }
        }, [renderChildren()])] : []
      });
    };
    const folderContent = () => h("div", {
      ref: props.isRoot ? contentRef : void 0,
      class: `dialkit-folder ${props.isRoot ? "dialkit-folder-root" : ""}`
    }, [
      renderHeader(),
      renderContent()
    ]);
    return () => {
      if (props.isRoot) {
        if (props.inline) {
          return h("div", { class: "dialkit-panel-inner dialkit-panel-inline" }, [folderContent()]);
        }
        const panelStyle = isOpen.value ? {
          width: 280,
          height: contentHeight.value !== void 0 ? Math.min(contentHeight.value + 10, windowHeight.value - 32) : "auto",
          borderRadius: 14,
          boxShadow: "var(--dial-shadow)",
          cursor: void 0,
          overflowY: "auto"
        } : {
          width: 42,
          height: 42,
          borderRadius: 21,
          boxShadow: "var(--dial-shadow-collapsed)",
          overflow: "hidden",
          cursor: "pointer"
        };
        return h(motion.div, {
          class: "dialkit-panel-inner",
          style: panelStyle,
          onClick: !isOpen.value ? handleToggle : void 0,
          "data-collapsed": String(isCollapsed.value),
          whilePress: !isOpen.value ? { scale: 0.9 } : void 0,
          transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 }
        }, [folderContent()]);
      }
      return folderContent();
    };
  }
});

// src/vue/components/ControlRenderer.ts
import { Fragment, defineComponent as defineComponent22, h as h22, inject as inject2 } from "vue";

// src/vue/components/ColorControl.ts
import { Teleport, defineComponent as defineComponent4, h as h4, nextTick as nextTick2, onMounted as onMounted5, ref as ref5, watch as watch4 } from "vue";
import { AnimatePresence as AnimatePresence2, motion as motion2 } from "motion-v";

// src/vue/components/ColorPickerPanel.ts
import { computed as computed2, defineComponent as defineComponent3, h as h3, onBeforeUnmount, onMounted as onMounted4, ref as ref4, watch as watch3 } from "vue";

// src/vue/components/SegmentedControl.ts
import { defineComponent as defineComponent2, h as h2, nextTick, onMounted as onMounted3, onUnmounted as onUnmounted3, ref as ref3, watch as watch2 } from "vue";
import { animate } from "motion";
var SegmentedControl = defineComponent2({
  name: "DialKitSegmentedControl",
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const containerRef = ref3(null);
    const pillRef = ref3(null);
    const buttonRefs = /* @__PURE__ */ new Map();
    const pillReady = ref3(false);
    let hasAnimated = false;
    let pillAnim = null;
    const measurePill = () => {
      const button = buttonRefs.get(props.value);
      const container = containerRef.value;
      if (!button || !container) return null;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      return {
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width
      };
    };
    const setPillImmediate = (left, width) => {
      if (!pillRef.value) return;
      pillRef.value.style.left = `${left}px`;
      pillRef.value.style.width = `${width}px`;
      pillRef.value.style.visibility = "visible";
    };
    const updatePill = (shouldAnimate) => {
      const next = measurePill();
      if (!next) return;
      if (!pillReady.value) {
        setPillImmediate(next.left, next.width);
        pillReady.value = true;
        return;
      }
      if (!shouldAnimate || !hasAnimated || !pillRef.value) {
        pillAnim?.stop();
        pillAnim = null;
        setPillImmediate(next.left, next.width);
        return;
      }
      pillAnim?.stop();
      pillAnim = animate(
        pillRef.value,
        {
          left: next.left,
          width: next.width
        },
        {
          type: "spring",
          visualDuration: 0.2,
          bounce: 0.15,
          onComplete: () => {
            pillAnim = null;
          }
        }
      );
    };
    let ro;
    onMounted3(() => {
      nextTick(() => {
        updatePill(false);
        hasAnimated = true;
      });
      if (typeof ResizeObserver !== "undefined" && containerRef.value) {
        ro = new ResizeObserver(() => updatePill(false));
        ro.observe(containerRef.value);
      }
    });
    onUnmounted3(() => {
      pillAnim?.stop();
      ro?.disconnect();
    });
    watch2(
      () => props.value,
      () => {
        updatePill(true);
      },
      { flush: "post" }
    );
    return () => h2("div", { ref: containerRef, class: "dialkit-segmented" }, [
      h2("div", {
        ref: pillRef,
        class: "dialkit-segmented-pill",
        style: {
          left: "0px",
          width: "0px",
          visibility: pillReady.value ? "visible" : "hidden"
        }
      }),
      ...props.options.map((option) => h2("button", {
        ref: ((el) => {
          if (el instanceof HTMLElement) {
            buttonRefs.set(option.value, el);
            return;
          }
          buttonRefs.delete(option.value);
        }),
        class: "dialkit-segmented-button",
        "data-active": String(props.value === option.value),
        onClick: () => emit("change", option.value)
      }, option.label))
    ]);
  }
});

// src/color-palette-store.ts
var cache = null;
var listeners = /* @__PURE__ */ new Set();
var storageListenerAttached = false;
function readStorage() {
  try {
    if (typeof window === "undefined") return emptyPalette();
    return deserializePalette(window.localStorage.getItem(PALETTE_STORAGE_KEY));
  } catch {
    return emptyPalette();
  }
}
function notify() {
  const slots = cache ?? emptyPalette();
  listeners.forEach((cb) => cb(slots));
}
function onStorageEvent(e) {
  if (e.key !== PALETTE_STORAGE_KEY) return;
  cache = deserializePalette(e.newValue);
  notify();
}
function loadPalette() {
  if (cache === null) cache = readStorage();
  return cache;
}
function savePalette(slots) {
  cache = slots;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, serializePalette(slots));
    }
  } catch {
  }
  notify();
}
function subscribePalette(cb) {
  listeners.add(cb);
  if (!storageListenerAttached && typeof window !== "undefined") {
    window.addEventListener("storage", onStorageEvent);
    storageListenerAttached = true;
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && storageListenerAttached && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorageEvent);
      storageListenerAttached = false;
    }
  };
}

// src/vue/components/ColorPickerPanel.ts
var FORMAT_OPTIONS = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" }
];
var stickyFormat = "hex";
var BLACK = { h: 0, s: 0, v: 0, a: 1 };
var HEX_ALPHA_SPEC = { key: "a", label: "A", min: 0, max: 100, step: 1, precision: 0 };
function useAreaDrag(onPoint) {
  const elRef = ref4(null);
  let dragging = false;
  const readPoint = (e) => {
    const el = elRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    onPoint(x, y);
  };
  const endDrag = () => {
    dragging = false;
  };
  const handlers = {
    onPointerdown: (e) => {
      e.preventDefault();
      elRef.value?.setPointerCapture(e.pointerId);
      dragging = true;
      readPoint(e);
    },
    onPointermove: (e) => {
      if (dragging && e.buttons === 0) {
        dragging = false;
        return;
      }
      if (dragging) readPoint(e);
    },
    onPointerup: endDrag,
    onPointercancel: endDrag
  };
  return { elRef, handlers };
}
var ChannelField = defineComponent3({
  name: "DialKitColorChannelField",
  props: {
    spec: { type: Object, required: true },
    value: { type: Number, required: true }
  },
  emits: ["commit"],
  setup(props, { emit }) {
    const draft = ref4(null);
    const commit = () => {
      if (draft.value !== null) emit("commit", Number(draft.value));
      draft.value = null;
    };
    return () => h3("label", { class: "dialkit-color-field" }, [
      h3("input", {
        type: "text",
        inputmode: "decimal",
        value: draft.value ?? String(props.value),
        onFocus: (e) => {
          draft.value = String(props.value);
          e.target.select();
        },
        onInput: (e) => {
          draft.value = e.target.value;
        },
        onBlur: commit,
        onKeydown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            draft.value = null;
            e.target.blur();
          }
        }
      }),
      h3("span", { class: "dialkit-color-field-label" }, props.spec.label)
    ]);
  }
});
var HexField = defineComponent3({
  name: "DialKitColorHexField",
  props: {
    value: { type: String, required: true },
    alpha: { type: Boolean, required: true }
  },
  emits: ["commit"],
  setup(props, { emit }) {
    const draft = ref4(null);
    const commit = () => {
      if (draft.value !== null) {
        const normalized = normalizeHex(draft.value, props.alpha);
        if (normalized) emit("commit", normalized);
      }
      draft.value = null;
    };
    return () => h3("label", { class: "dialkit-color-field dialkit-color-field-hex" }, [
      h3("input", {
        type: "text",
        spellcheck: false,
        value: (draft.value ?? props.value).toUpperCase(),
        onFocus: (e) => {
          draft.value = props.value;
          e.target.select();
        },
        onInput: (e) => {
          draft.value = e.target.value;
        },
        onBlur: commit,
        onKeydown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            draft.value = null;
            e.target.blur();
          }
        }
      }),
      h3("span", { class: "dialkit-color-field-label" }, "HEX")
    ]);
  }
});
var PaletteSlot = defineComponent3({
  name: "DialKitColorPaletteSlot",
  props: {
    color: { type: String, default: null }
  },
  emits: ["save", "apply", "clear"],
  setup(props, { emit }) {
    const holding = ref4(false);
    let timer = null;
    let origin = null;
    let fired = false;
    const cancelHold = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      origin = null;
      holding.value = false;
    };
    onBeforeUnmount(cancelHold);
    return () => h3("button", {
      class: "dialkit-color-palette-slot",
      "data-filled": String(props.color !== null),
      "data-holding": String(holding.value),
      style: props.color ? { "--swatch-color": props.color } : void 0,
      title: props.color ? `${props.color.toUpperCase()} \u2014 click to apply, hold to clear` : "Save current color",
      onContextmenu: (e) => e.preventDefault(),
      onPointerdown: (e) => {
        fired = false;
        if (!props.color) return;
        origin = { x: e.clientX, y: e.clientY };
        holding.value = true;
        timer = setTimeout(() => {
          fired = true;
          cancelHold();
          emit("clear");
        }, LONG_PRESS_MS);
      },
      onPointermove: (e) => {
        if (!origin) return;
        if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > PALETTE_DRAG_CANCEL_PX) {
          cancelHold();
        }
      },
      onPointerup: cancelHold,
      onPointerleave: cancelHold,
      onPointercancel: cancelHold,
      onClick: () => {
        if (fired) {
          fired = false;
          return;
        }
        if (props.color) emit("apply");
        else emit("save");
      }
    });
  }
});
var ColorPickerPanel = defineComponent3({
  name: "DialKitColorPickerPanel",
  props: {
    value: { type: String, required: true },
    alpha: { type: Boolean, default: false },
    palette: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const initialRgba = parseHex(props.value);
    const hsva = ref4(initialRgba ? rgbToHsv(initialRgba) : { ...BLACK });
    const format = ref4(stickyFormat);
    const slots = ref4(props.palette ? loadPalette() : emptyPalette());
    let lastEmitted = props.value;
    watch3(() => props.value, (value) => {
      if (value === lastEmitted) return;
      lastEmitted = value;
      const rgba2 = parseHex(value);
      if (rgba2) hsva.value = rgbToHsv(rgba2);
    });
    let unsubscribePalette;
    onMounted4(() => {
      if (props.palette) {
        unsubscribePalette = subscribePalette((next) => {
          slots.value = next;
        });
      }
    });
    onBeforeUnmount(() => unsubscribePalette?.());
    const emitColor = (next) => {
      hsva.value = next;
      const hex = formatHex(hsvToRgb(next), props.alpha);
      lastEmitted = hex;
      emit("change", hex);
    };
    const applyHex = (hex) => {
      const rgba2 = parseHex(hex);
      if (!rgba2) return;
      const normalized = formatHex(rgba2, props.alpha);
      hsva.value = rgbToHsv(rgba2);
      lastEmitted = normalized;
      emit("change", normalized);
    };
    const svDrag = useAreaDrag((x, y) => emitColor({ ...hsva.value, s: x, v: 1 - y }));
    const hueDrag = useAreaDrag((x) => emitColor({ ...hsva.value, h: Math.min(x * 360, 359.999) }));
    const alphaDrag = useAreaDrag((x) => emitColor({ ...hsva.value, a: x }));
    const rgba = computed2(() => hsvToRgb(hsva.value));
    const opaqueHex = computed2(() => formatHex(rgba.value, false));
    const currentHex = computed2(() => formatHex(rgba.value, props.alpha));
    const channelSpecs = computed2(() => format.value === "hex" ? [] : getChannels(format.value, props.alpha));
    const channelValues = computed2(() => format.value === "hex" ? [] : rgbaToChannels(rgba.value, format.value, props.alpha));
    const commitChannel = (index, n) => {
      const next = [...channelValues.value];
      next[index] = n;
      const committed = channelsToRgba(next, format.value, props.alpha);
      const nextHsva = rgbToHsv(committed);
      if (nextHsva.s === 0) nextHsva.h = hsva.value.h;
      if (nextHsva.v === 0) nextHsva.s = hsva.value.s;
      emitColor(nextHsva);
    };
    return () => h3("div", {
      class: "dialkit-color-picker",
      style: { "--picker-hue": String(hsva.value.h) }
    }, [
      h3("div", {
        class: "dialkit-color-sv",
        ref: svDrag.elRef,
        ...svDrag.handlers
      }, [
        h3("div", {
          class: "dialkit-color-sv-thumb",
          style: {
            left: `${hsva.value.s * 100}%`,
            top: `${(1 - hsva.value.v) * 100}%`,
            background: opaqueHex.value
          }
        })
      ]),
      h3("div", {
        class: "dialkit-color-slider dialkit-color-hue",
        ref: hueDrag.elRef,
        ...hueDrag.handlers
      }, [
        h3("div", {
          class: "dialkit-color-slider-thumb",
          style: {
            left: `${hsva.value.h / 360 * 100}%`,
            background: `hsl(${hsva.value.h} 100% 50%)`
          }
        })
      ]),
      props.alpha ? h3("div", {
        class: "dialkit-color-slider dialkit-color-alpha dialkit-checker",
        ref: alphaDrag.elRef,
        ...alphaDrag.handlers
      }, [
        h3("div", {
          class: "dialkit-color-alpha-gradient",
          style: { background: `linear-gradient(to right, transparent, ${opaqueHex.value})` }
        }),
        h3("div", {
          class: "dialkit-color-slider-thumb",
          style: {
            left: `${hsva.value.a * 100}%`,
            background: opaqueHex.value,
            opacity: String(Math.max(hsva.value.a, 0.15))
          }
        })
      ]) : null,
      h3(SegmentedControl, {
        options: FORMAT_OPTIONS,
        value: format.value,
        onChange: (f) => {
          stickyFormat = f;
          format.value = f;
        }
      }),
      h3("div", { class: "dialkit-color-fields", "data-format": format.value }, format.value === "hex" ? [
        h3(HexField, {
          value: currentHex.value,
          alpha: props.alpha,
          onCommit: (hex) => applyHex(hex)
        }),
        props.alpha ? h3(ChannelField, {
          spec: HEX_ALPHA_SPEC,
          value: opacityPercent(rgba.value),
          onCommit: (n) => emitColor({ ...hsva.value, a: Math.min(1, Math.max(0, n / 100)) })
        }) : null
      ] : channelSpecs.value.map((spec, i) => h3(ChannelField, {
        key: `${format.value}-${spec.key}`,
        spec,
        value: channelValues.value[i],
        onCommit: (n) => commitChannel(i, n)
      }))),
      props.palette ? h3("div", { class: "dialkit-color-palette" }, Array.from({ length: PALETTE_SIZE }, (_, i) => h3(PaletteSlot, {
        key: i,
        color: slots.value[i] ?? null,
        // Read the store at commit time — a 500ms hold is long enough for
        // another panel or tab to have rewritten the palette underneath.
        onSave: () => savePalette(loadPalette().map((s, j) => j === i ? currentHex.value : s)),
        onApply: () => {
          const saved = slots.value[i];
          if (saved) applyHex(saved);
        },
        onClear: () => savePalette(loadPalette().map((s, j) => j === i ? null : s))
      }))) : null
    ]);
  }
});

// src/vue/components/ColorControl.ts
var PICKER_WIDTH = 240;
var PICKER_BASE_HEIGHT = 270;
var PICKER_ALPHA_HEIGHT = 22;
var PICKER_PALETTE_HEIGHT = 30;
var ColorControl = defineComponent4({
  name: "DialKitColorControl",
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    alpha: { type: Boolean, default: false },
    palette: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const isEditing = ref5(false);
    const editValue = ref5(bareHex(props.value));
    const isOpen = ref5(false);
    const pos = ref5(null);
    const portalTarget = ref5(null);
    const swatchRef = ref5(null);
    const pickerRef = ref5(null);
    const hexInputRef = ref5(null);
    watch4(() => props.value, (value) => {
      if (!isEditing.value) editValue.value = bareHex(value);
    });
    watch4(isEditing, async (editing) => {
      if (!editing) return;
      await nextTick2();
      hexInputRef.value?.focus();
      hexInputRef.value?.select();
    });
    const updatePos = () => {
      const el = swatchRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pickerHeight = PICKER_BASE_HEIGHT + (props.alpha ? PICKER_ALPHA_HEIGHT : 0) + (props.palette ? PICKER_PALETTE_HEIGHT : 0);
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
      const left = Math.max(8, rect.right - PICKER_WIDTH);
      pos.value = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
    };
    const openPicker = () => {
      updatePos();
      isOpen.value = true;
    };
    const closePicker = () => {
      isOpen.value = false;
    };
    const togglePicker = () => {
      if (isOpen.value) closePicker();
      else openPicker();
    };
    const setPickerRef = (node) => {
      if (node instanceof HTMLElement) {
        pickerRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        pickerRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      pickerRef.value = null;
    };
    watch4(isOpen, (open, _, onCleanup) => {
      if (!open) return;
      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event) => {
        const target = event.target;
        if (swatchRef.value?.contains(target) || pickerRef.value?.contains(target)) return;
        closePicker();
      };
      const handleKeydown = (event) => {
        if (event.key === "Escape") {
          closePicker();
          swatchRef.value?.focus();
        }
      };
      updatePos();
      document.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("keydown", handleKeydown);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);
      onCleanup(() => {
        document.removeEventListener("mousedown", handleDocumentClick);
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      });
    });
    onMounted5(() => {
      const root = swatchRef.value?.closest(".dialkit-root");
      portalTarget.value = root ?? document.body;
    });
    const submitText = () => {
      isEditing.value = false;
      const normalized = normalizeHexEdit(editValue.value, props.alpha, parseHex(props.value)?.a ?? 1);
      if (normalized) {
        emit("change", normalized);
      } else {
        editValue.value = bareHex(props.value);
      }
    };
    return () => {
      const rgba = parseHex(props.value);
      return h4("div", { class: "dialkit-color-control" }, [
        h4("span", { class: "dialkit-color-label" }, props.label),
        h4("div", { class: "dialkit-color-inputs" }, [
          // The whole token (hash included) is the click target for editing.
          h4("span", {
            class: "dialkit-color-hex-wrap",
            onClick: () => {
              isEditing.value = true;
            }
          }, [
            h4("span", { class: "dialkit-color-hash", "aria-hidden": "true" }, "#"),
            isEditing.value ? h4("input", {
              ref: hexInputRef,
              type: "text",
              class: "dialkit-color-hex-input",
              "aria-label": `Hex color for ${props.label}`,
              value: editValue.value,
              onInput: (event) => {
                editValue.value = event.target.value;
              },
              onBlur: submitText,
              onKeydown: (event) => {
                if (event.key === "Enter") {
                  submitText();
                } else if (event.key === "Escape") {
                  event.stopPropagation();
                  isEditing.value = false;
                  editValue.value = bareHex(props.value);
                }
              }
            }) : h4("span", {
              class: "dialkit-color-hex",
              "aria-label": `Hex color for ${props.label}`
            }, bareHex(props.value))
          ]),
          ...props.alpha && rgba ? [
            h4("span", { class: "dialkit-color-divider", "aria-hidden": "true" }),
            h4("span", { class: "dialkit-color-opacity" }, [
              `${opacityPercent(rgba)} `,
              h4("span", { class: "dialkit-color-opacity-unit" }, "%")
            ])
          ] : [],
          h4("button", {
            ref: swatchRef,
            class: "dialkit-color-swatch",
            style: { "--swatch-color": props.value },
            "data-open": String(isOpen.value),
            title: "Pick color",
            "aria-label": `Pick color for ${props.label}`,
            "aria-expanded": isOpen.value,
            onClick: togglePicker
          })
        ]),
        portalTarget.value ? h4(Teleport, { to: portalTarget.value }, [
          h4(AnimatePresence2, null, {
            default: () => isOpen.value && pos.value ? [h4(motion2.div, {
              key: "dialkit-color-picker-popover",
              ref: setPickerRef,
              class: "dialkit-color-picker-popover",
              initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
              transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
              style: {
                position: "fixed",
                left: `${pos.value.left}px`,
                width: `${PICKER_WIDTH}px`,
                ...pos.value.above ? {
                  bottom: `${window.innerHeight - pos.value.top}px`,
                  transformOrigin: "bottom right"
                } : {
                  top: `${pos.value.top}px`,
                  transformOrigin: "top right"
                }
              }
            }, [
              h4(ColorPickerPanel, {
                value: props.value,
                alpha: props.alpha,
                palette: props.palette,
                onChange: (next) => emit("change", next)
              })
            ])] : []
          })
        ]) : null
      ]);
    };
  }
});

// src/vue/components/ModuleFolder.ts
import { defineComponent as defineComponent5, h as h5, ref as ref6 } from "vue";
var ModuleFolder = defineComponent5({
  name: "DialKitModuleFolder",
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    onEnabledChange: { type: Function, default: void 0 },
    defaultOpen: { type: Boolean, default: true },
    hint: { type: String, default: void 0 },
    hintId: { type: String, default: void 0 }
  },
  setup(props, { slots }) {
    const isOpen = ref6(props.defaultOpen);
    const setEnabled = (enabled) => {
      props.onEnabledChange?.(enabled);
      if (enabled) isOpen.value = true;
    };
    return () => h5("div", { class: "dialkit-module" }, [
      h5(
        "div",
        {
          class: "dialkit-module-header dialkit-module-header-toggle",
          onClick: () => {
            if (props.enabled) isOpen.value = !isOpen.value;
          },
          "data-hint": props.hint ? "true" : void 0,
          "aria-describedby": props.hint ? props.hintId : void 0
        },
        [
          h5("span", { class: "dialkit-module-title" }, props.title),
          h5("div", { class: "dialkit-module-switch", onClick: (e) => e.stopPropagation() }, [
            h5(SegmentedControl, {
              options: [
                { value: "off", label: "Off" },
                { value: "on", label: "On" }
              ],
              value: props.enabled ? "on" : "off",
              onChange: (value) => setEnabled(value === "on")
            })
          ]),
          ...props.hint ? [h5("span", { class: "dialkit-hint", id: props.hintId, role: "tooltip" }, props.hint)] : []
        ]
      ),
      h5("div", { class: "dialkit-module-collapse", "data-open": props.enabled && isOpen.value }, [
        h5("div", { class: "dialkit-module-collapse-clip" }, [
          h5("div", { class: "dialkit-module-inner" }, slots.default ? slots.default() : [])
        ])
      ])
    ]);
  }
});

// src/vue/components/ControlShell.ts
import { computed as computed3, defineComponent as defineComponent6, h as h6, onBeforeUnmount as onBeforeUnmount2, onMounted as onMounted6, ref as ref7, Teleport as Teleport2, watch as watch5 } from "vue";

// src/affordance-core.ts
var AFFORDANCE_POPOVER_WIDTH = 200;
var GAP = 6;
var EDGE = 8;
function placePopover(anchor, popoverHeight, viewportHeight, width = AFFORDANCE_POPOVER_WIDTH) {
  const below = anchor.bottom + GAP;
  const overflowsBelow = popoverHeight > 0 && below + popoverHeight > viewportHeight - EDGE;
  const above = anchor.top - GAP - popoverHeight;
  return {
    // Only flip when there is actually more room above, or a short viewport
    // would trade one clipped edge for the other.
    top: overflowsBelow && above >= EDGE ? above : below,
    left: Math.max(EDGE, anchor.right - width)
  };
}

// src/vue/components/ControlShell.ts
var ControlShell = defineComponent6({
  name: "DialKitControlShell",
  props: {
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint: { type: String, default: void 0 },
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title: { type: String, default: void 0 },
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: { type: String, required: true },
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance: { type: Object, default: void 0 },
    /** Required alongside `affordance` — together they address the status slice. */
    panelId: { type: String, default: void 0 },
    path: { type: String, default: void 0 }
  },
  setup(props, { slots }) {
    const hasAffordance = computed3(() => Boolean(props.affordance && props.panelId && props.path));
    const label = computed3(() => props.affordance?.label ?? "Options");
    const open = ref7(false);
    const status = ref7("off");
    const disabled = ref7(false);
    const pos = ref7(null);
    const portalTarget = ref7(null);
    const dotEl = ref7(null);
    const popoverEl = ref7(null);
    let unsubscribe;
    const resubscribe = () => {
      unsubscribe?.();
      unsubscribe = void 0;
      const panelId = props.panelId;
      const path = props.path;
      if (!panelId || !path) return;
      const read = () => {
        status.value = DialStore.getAffordanceStatus(panelId, path);
        disabled.value = DialStore.isDisabled(panelId, path);
      };
      read();
      unsubscribe = DialStore.subscribeControlState(panelId, read);
    };
    const place = () => {
      const rect = dotEl.value?.getBoundingClientRect();
      if (!rect) return;
      const next = placePopover(rect, popoverEl.value?.offsetHeight ?? 0, window.innerHeight);
      if (pos.value?.top !== next.top || pos.value?.left !== next.left) pos.value = next;
    };
    const onPointerDown = (e) => {
      const target = e.target;
      if (dotEl.value?.contains(target) || popoverEl.value?.contains(target)) return;
      open.value = false;
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      open.value = false;
      dotEl.value?.focus();
    };
    onMounted6(() => {
      resubscribe();
      portalTarget.value = dotEl.value?.closest(".dialkit-root") ?? document.body;
    });
    watch5(() => [props.panelId, props.path, hasAffordance.value], resubscribe);
    watch5(open, async (isOpen) => {
      if (!isOpen) {
        pos.value = null;
        window.removeEventListener("scroll", place, true);
        window.removeEventListener("resize", place);
        document.removeEventListener("mousedown", onPointerDown);
        document.removeEventListener("keydown", onKeyDown);
        return;
      }
      window.addEventListener("scroll", place, true);
      window.addEventListener("resize", place);
      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
      await Promise.resolve();
      place();
      await Promise.resolve();
      place();
      const first = popoverEl.value?.querySelector(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (first ?? popoverEl.value)?.focus();
    });
    onBeforeUnmount2(() => {
      unsubscribe?.();
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
    return () => {
      const children = slots.default ? slots.default() : [];
      const wrapper = h6("div", {
        class: "dialkit-control-tip",
        "data-hint": props.hint ? "true" : void 0,
        "data-affordance": hasAffordance.value ? "true" : void 0,
        "data-affordance-open": open.value ? "true" : void 0,
        "data-disabled": disabled.value ? "true" : void 0,
        "aria-disabled": disabled.value ? "true" : void 0,
        role: props.hint ? "group" : void 0,
        "aria-describedby": props.hint ? props.id : void 0,
        title: props.hint ? void 0 : props.title
      }, [
        ...children,
        props.hint ? h6("span", { class: "dialkit-hint", id: props.id, role: "tooltip" }, props.hint) : null,
        hasAffordance.value ? h6("button", {
          ref: dotEl,
          type: "button",
          class: "dialkit-affordance-dot",
          "data-status": status.value,
          "data-open": String(open.value),
          "aria-label": label.value,
          "aria-expanded": open.value,
          onClick: () => {
            open.value = !open.value;
          }
        }) : null
      ]);
      if (!open.value || !hasAffordance.value || !portalTarget.value) return wrapper;
      return [
        wrapper,
        h6(Teleport2, { to: portalTarget.value }, [
          h6("div", {
            ref: popoverEl,
            class: "dialkit-affordance-popover",
            role: "dialog",
            "aria-label": label.value,
            tabindex: -1,
            style: {
              left: `${pos.value?.left ?? 0}px`,
              top: `${pos.value?.top ?? 0}px`,
              width: `${AFFORDANCE_POPOVER_WIDTH}px`,
              // Hidden until measured, so it never flashes at the wrong spot.
              visibility: pos.value ? void 0 : "hidden"
            }
          }, [
            h6("span", { class: "dialkit-affordance-popover-title" }, label.value),
            // Rendered as a component, not called: a stateful popover needs its
            // own instance.
            h6(props.affordance.content, {
              panelId: props.panelId,
              path: props.path,
              status: status.value,
              setStatus: (next) => DialStore.setAffordanceStatus(props.panelId, props.path, next)
            })
          ])
        ])
      ];
    };
  }
});

// src/vue/components/GradientControl.ts
import { Teleport as Teleport3, defineComponent as defineComponent9, h as h9, onMounted as onMounted8, ref as ref10, watch as watch6 } from "vue";
import { AnimatePresence as AnimatePresence3, motion as motion3 } from "motion-v";

// src/vue/components/GradientPanel.ts
import { computed as computed4, defineComponent as defineComponent8, h as h8, ref as ref9, onBeforeUnmount as onBeforeUnmount4 } from "vue";

// src/vue/components/GradientTransformPad.ts
import { defineComponent as defineComponent7, h as h7, onBeforeUnmount as onBeforeUnmount3, onMounted as onMounted7, ref as ref8 } from "vue";
var clamp4 = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var wrap360 = (deg) => (deg % 360 + 360) % 360;
var RAD = Math.PI / 180;
var vectorToAngle = (dx, dy) => wrap360(Math.atan2(dx, -dy) / RAD);
var GradientTransformPad = defineComponent7({
  name: "DialKitGradientTransformPad",
  props: {
    value: { type: Object, required: true }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const padRef = ref8(null);
    let drag = null;
    const size = ref8({ w: 0, h: 0 });
    let ro = null;
    onMounted7(() => {
      const el = padRef.value;
      if (!el) return;
      const measure = () => {
        size.value = { w: el.clientWidth, h: el.clientHeight };
      };
      measure();
      ro = new ResizeObserver(measure);
      ro.observe(el);
    });
    onBeforeUnmount3(() => ro?.disconnect());
    const onHandleDown = (kind) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
      }
      drag = { kind, pointerId: e.pointerId };
    };
    const onHandleMove = (e) => {
      if (!drag || drag.pointerId !== e.pointerId || !padRef.value) return;
      const kind = drag.kind;
      if (e.buttons === 0) {
        drag = null;
        return;
      }
      const rect = padRef.value.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (kind === "center") {
        emit("change", setGradientCenter(props.value, px / rect.width * 100, py / rect.height * 100));
        return;
      }
      const cx = props.value.centerX ?? 50;
      const cy = props.value.centerY ?? 50;
      if (kind === "angle") {
        const isConic = props.value.type === "conic";
        const ox = isConic ? cx / 100 * rect.width : rect.width / 2;
        const oy = isConic ? cy / 100 * rect.height : rect.height / 2;
        emit("change", setGradientAngle(props.value, vectorToAngle(px - ox, py - oy)));
        return;
      }
      const dx = px - cx / 100 * rect.width;
      const dy = py - cy / 100 * rect.height;
      const dist = Math.hypot(dx, dy);
      const deg = Math.atan2(dy, dx) / RAD;
      if (kind === "major") {
        const nextScale = dist / rect.width * 100;
        emit("change", setGradientScale(setGradientRotation(props.value, deg), nextScale));
        return;
      }
      const nextSquash = dist / rect.height * 100;
      emit("change", setGradientRotation(setGradientSquash(props.value, nextSquash), deg - 90));
    };
    const onHandleUp = (e) => {
      if (drag?.pointerId === e.pointerId) drag = null;
    };
    const handleProps = (kind) => ({
      onPointerdown: onHandleDown(kind),
      onPointermove: onHandleMove,
      onPointerup: onHandleUp,
      onPointercancel: onHandleUp,
      onLostpointercapture: onHandleUp
    });
    return () => {
      const value = props.value;
      const radial = value.type === "radial";
      const conic = value.type === "conic";
      const cx = value.centerX ?? 50;
      const cy = value.centerY ?? 50;
      const scale = value.scale ?? 100;
      const rotation = value.rotation ?? 0;
      const { w, h: hh } = size.value;
      const cxPx = cx / 100 * w;
      const cyPx = cy / 100 * hh;
      const rxPx = scale / 100 * w;
      const ryPx = Math.max(10, (value.squash ?? scale) / 100 * hh);
      const theta = rotation * RAD;
      const majorX = cxPx + Math.cos(theta) * rxPx;
      const majorY = cyPx + Math.sin(theta) * rxPx;
      const minorX = cxPx - Math.sin(theta) * ryPx;
      const minorY = cyPx + Math.cos(theta) * ryPx;
      const pin = (x, y) => ({ x: clamp4(x, 5, w - 5), y: clamp4(y, 5, hh - 5) });
      const major = pin(majorX, majorY);
      const minor = pin(minorX, minorY);
      const majorLineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
      const majorLineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;
      const angleOx = conic ? cxPx : w / 2;
      const angleOy = conic ? cyPx : hh / 2;
      const spokeR = Math.max(10, Math.min(w, hh) / 2 - 8);
      const aTheta = value.angle * RAD;
      const angleHandle = pin(angleOx + Math.sin(aTheta) * spokeR, angleOy - Math.cos(aTheta) * spokeR);
      const angleLineLen = Math.hypot(angleHandle.x - angleOx, angleHandle.y - angleOy);
      const angleLineAngle = Math.atan2(angleHandle.y - angleOy, angleHandle.x - angleOx) / RAD;
      const fill = gradientFillBox(value, w, hh);
      return h7("div", { ref: padRef, class: "dialkit-gradient-pad dialkit-checker" }, [
        h7("div", {
          class: "dialkit-gradient-pad-fill",
          style: {
            background: fill.background,
            transform: fill.transform,
            transformOrigin: fill.transformOrigin,
            left: `${fill.left}px`,
            top: `${fill.top}px`,
            width: `${fill.width}px`,
            height: `${fill.height}px`
          }
        }),
        ...radial ? [
          h7("div", {
            class: "dialkit-gradient-pad-line",
            style: {
              left: `${cxPx}px`,
              top: `${cyPx}px`,
              width: `${majorLineLen}px`,
              transform: `rotate(${majorLineAngle}deg)`
            }
          }),
          h7("button", {
            type: "button",
            class: "dialkit-gradient-pad-handle",
            "data-kind": "major",
            "aria-label": "Gradient size and rotation",
            style: { left: `${major.x}px`, top: `${major.y}px` },
            ...handleProps("major")
          }),
          h7("button", {
            type: "button",
            class: "dialkit-gradient-pad-handle",
            "data-kind": "minor",
            "aria-label": "Gradient squash",
            style: { left: `${minor.x}px`, top: `${minor.y}px` },
            ...handleProps("minor")
          })
        ] : [
          h7("div", {
            class: "dialkit-gradient-pad-line",
            style: {
              left: `${angleOx}px`,
              top: `${angleOy}px`,
              width: `${angleLineLen}px`,
              transform: `rotate(${angleLineAngle}deg)`
            }
          }),
          h7("button", {
            type: "button",
            class: "dialkit-gradient-pad-handle",
            "data-kind": "angle",
            "aria-label": "Gradient angle",
            style: { left: `${angleHandle.x}px`, top: `${angleHandle.y}px` },
            ...handleProps("angle")
          })
        ],
        ...radial || conic ? [
          h7("button", {
            type: "button",
            class: "dialkit-gradient-pad-handle",
            "data-kind": "center",
            "aria-label": "Gradient center",
            style: { left: `${clamp4(cxPx, 5, w - 5)}px`, top: `${clamp4(cyPx, 5, hh - 5)}px` },
            ...handleProps("center")
          })
        ] : []
      ]);
    };
  }
});

// src/vue/components/GradientPanel.ts
var TYPE_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
  { value: "conic", label: "Conic" }
];
function rampCss(stops) {
  return gradientToCss({ type: "linear", angle: 90, stops });
}
var GradientPanel = defineComponent8({
  name: "DialKitGradientPanel",
  props: {
    value: { type: Object, required: true }
  },
  emits: ["change", "drag"],
  setup(props, { emit }) {
    const selectedIndex = ref9(0);
    const holdingIndex = ref9(-1);
    const detach = ref9(null);
    const stripRef = ref9(null);
    const gripRef = ref9(null);
    const gripOrigin = ref9(null);
    const onGripDown = (e) => {
      e.preventDefault();
      try {
        gripRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      gripOrigin.value = { x: e.clientX, y: e.clientY };
    };
    const onGripMove = (e) => {
      if (!gripOrigin.value || e.buttons === 0) return;
      emit("drag", e.clientX - gripOrigin.value.x, e.clientY - gripOrigin.value.y);
      gripOrigin.value = { x: e.clientX, y: e.clientY };
    };
    const onGripUp = () => {
      gripOrigin.value = null;
    };
    const drag = {
      mode: "idle",
      activeIndex: -1,
      originX: 0,
      originY: 0,
      timer: null,
      working: props.value
    };
    const safeIndex = computed4(() => Math.min(selectedIndex.value, props.value.stops.length - 1));
    const stripPos = (clientX) => {
      const rect = stripRef.value.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    };
    const stripCenterY = () => {
      const rect = stripRef.value.getBoundingClientRect();
      return rect.top + rect.height / 2;
    };
    const clearTimer = () => {
      if (drag.timer) clearTimeout(drag.timer);
      drag.timer = null;
    };
    onBeforeUnmount4(clearTimer);
    const resetDrag = () => {
      clearTimer();
      drag.mode = "idle";
      holdingIndex.value = -1;
    };
    const commitMove = (clientX) => {
      const r = moveStop(drag.working, drag.activeIndex, stripPos(clientX));
      drag.working = r.value;
      drag.activeIndex = r.index;
      selectedIndex.value = r.index;
      emit("change", r.value);
    };
    const onPointerDown = (e) => {
      e.preventDefault();
      try {
        stripRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      drag.originX = e.clientX;
      drag.originY = e.clientY;
      drag.working = props.value;
      const handle = e.target.closest(".dialkit-gradient-stop");
      if (handle) {
        const index2 = Number(handle.dataset.index);
        selectedIndex.value = index2;
        drag.activeIndex = index2;
        drag.mode = "pending";
        if (props.value.stops.length > MIN_STOPS) {
          holdingIndex.value = index2;
          drag.timer = setTimeout(() => {
            drag.timer = null;
            drag.mode = "idle";
            holdingIndex.value = -1;
            const next2 = removeStop(props.value, index2);
            emit("change", next2);
            selectedIndex.value = Math.min(index2, next2.stops.length - 1);
          }, LONG_PRESS_MS);
        }
        return;
      }
      const { value: next, index } = addStop(props.value, stripPos(e.clientX));
      drag.working = next;
      drag.activeIndex = index;
      drag.mode = "dragging";
      selectedIndex.value = index;
      emit("change", next);
    };
    const onPointerMove = (e) => {
      if (drag.mode === "idle") return;
      if (e.buttons === 0) {
        detach.value = null;
        resetDrag();
        return;
      }
      if (drag.mode === "pending") {
        if (Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY) <= PALETTE_DRAG_CANCEL_PX) return;
        clearTimer();
        holdingIndex.value = -1;
        drag.mode = "dragging";
      }
      if (drag.mode === "dragging") {
        const offV = e.clientY - stripCenterY();
        if (drag.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
          drag.mode = "detached";
          detach.value = { index: drag.activeIndex, y: offV };
          return;
        }
        commitMove(e.clientX);
        return;
      }
      if (drag.mode === "detached") {
        const offV = e.clientY - stripCenterY();
        if (Math.abs(offV) <= STOP_DETACH_PX) {
          drag.mode = "dragging";
          detach.value = null;
          commitMove(e.clientX);
        } else {
          detach.value = { index: drag.activeIndex, y: offV };
        }
      }
    };
    const onPointerUp = () => {
      if (drag.mode === "detached") {
        const next = removeStop(drag.working, drag.activeIndex);
        emit("change", next);
        selectedIndex.value = Math.min(drag.activeIndex, next.stops.length - 1);
      }
      detach.value = null;
      resetDrag();
    };
    return () => {
      const value = props.value;
      const previewStops = detach.value ? value.stops.filter((_, i) => i !== detach.value.index) : value.stops;
      return h8("div", { class: "dialkit-gradient-panel" }, [
        h8("div", { class: "dialkit-gradient-toolbar" }, [
          h8("button", {
            ref: gripRef,
            type: "button",
            class: "dialkit-gradient-grip",
            "aria-label": "Drag to move",
            title: "Drag to move",
            onPointerdown: onGripDown,
            onPointermove: onGripMove,
            onPointerup: onGripUp,
            onPointercancel: onGripUp,
            onLostpointercapture: onGripUp
          }, [
            h8(
              "svg",
              { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" },
              ICON_GRIP.map((c) => h8("circle", { cx: c.cx, cy: c.cy, r: "1.5" }))
            )
          ]),
          h8(SegmentedControl, {
            options: TYPE_OPTIONS,
            value: value.type,
            onChange: (t) => emit("change", setGradientType(value, t))
          })
        ]),
        h8(GradientTransformPad, {
          value,
          onChange: (v) => emit("change", v)
        }),
        h8("div", {
          ref: stripRef,
          class: "dialkit-gradient-strip",
          style: { "--gradient-ramp": rampCss(previewStops) },
          onPointerdown: onPointerDown,
          onPointermove: onPointerMove,
          onPointerup: onPointerUp,
          onPointercancel: onPointerUp
        }, value.stops.map((stop, i) => {
          const detaching = detach.value?.index === i;
          return h8("button", {
            key: i,
            type: "button",
            class: "dialkit-gradient-stop",
            "data-index": i,
            "data-selected": String(i === safeIndex.value),
            "data-holding": String(i === holdingIndex.value),
            "data-detaching": String(detaching),
            style: {
              left: `${stop.position * 100}%`,
              zIndex: i === safeIndex.value ? 99 : i + 1,
              "--swatch-color": stop.color,
              "--detach-y": detaching ? `${detach.value.y}px` : "0px"
            },
            "aria-label": `Gradient stop ${i + 1}`
          });
        })),
        h8("span", { class: "dialkit-gradient-divider", "aria-hidden": "true" }),
        h8(ColorPickerPanel, {
          key: safeIndex.value,
          value: value.stops[safeIndex.value].color,
          alpha: true,
          palette: false,
          onChange: (hex) => emit("change", setStopColor(value, safeIndex.value, hex))
        })
      ]);
    };
  }
});

// src/vue/components/GradientControl.ts
var PANEL_WIDTH = 240;
var PANEL_HEIGHT_ANGLED = 470;
var PANEL_HEIGHT_RADIAL = 430;
var GradientControl = defineComponent9({
  name: "DialKitGradientControl",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const isOpen = ref10(false);
    const pos = ref10(null);
    const dragPos = ref10(null);
    const portalTarget = ref10(null);
    const triggerRef = ref10(null);
    const panelRef = ref10(null);
    const onPanelDrag = (dx, dy) => {
      let base = dragPos.value;
      if (!base) {
        const p = pos.value;
        const el = panelRef.value;
        if (!p || !el) return;
        base = { left: p.left, top: p.above ? p.top - el.offsetHeight : p.top };
      }
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      dragPos.value = { left, top };
    };
    const updatePos = () => {
      const el = triggerRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const panelHeight = props.value.type === "radial" ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < panelHeight && rect.top > spaceBelow;
      const left = Math.max(8, rect.right - PANEL_WIDTH);
      pos.value = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
    };
    const openPanel = () => {
      dragPos.value = null;
      updatePos();
      isOpen.value = true;
    };
    const closePanel = () => {
      isOpen.value = false;
    };
    const togglePanel = () => {
      if (isOpen.value) closePanel();
      else openPanel();
    };
    const setPanelRef = (node) => {
      if (node instanceof HTMLElement) {
        panelRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        panelRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      panelRef.value = null;
    };
    watch6(() => props.value.type, () => {
      if (isOpen.value) updatePos();
    });
    watch6(isOpen, (open, _, onCleanup) => {
      if (!open) return;
      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event) => {
        const target = event.target;
        if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return;
        closePanel();
      };
      const handleKeydown = (event) => {
        if (event.key === "Escape") {
          closePanel();
          triggerRef.value?.focus();
        }
      };
      updatePos();
      document.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("keydown", handleKeydown);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);
      onCleanup(() => {
        document.removeEventListener("mousedown", handleDocumentClick);
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      });
    });
    onMounted8(() => {
      const root = triggerRef.value?.closest(".dialkit-root");
      portalTarget.value = root ?? document.body;
    });
    return () => h9("div", { class: "dialkit-gradient-control" }, [
      h9("span", { class: "dialkit-gradient-label" }, props.label),
      h9("button", {
        ref: triggerRef,
        class: "dialkit-gradient-preview dialkit-checker",
        style: { "--gradient-preview": gradientToCss(props.value) },
        "data-open": String(isOpen.value),
        title: "Edit gradient",
        "aria-label": `Edit gradient for ${props.label}`,
        "aria-expanded": isOpen.value,
        onClick: togglePanel
      }),
      portalTarget.value ? h9(Teleport3, { to: portalTarget.value }, [
        h9(AnimatePresence3, null, {
          default: () => isOpen.value && pos.value ? [h9(motion3.div, {
            key: "dialkit-gradient-popover",
            ref: setPanelRef,
            class: "dialkit-gradient-popover",
            initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
            style: {
              position: "fixed",
              width: `${PANEL_WIDTH}px`,
              ...dragPos.value ? {
                left: `${dragPos.value.left}px`,
                top: `${dragPos.value.top}px`,
                transformOrigin: "top left"
              } : pos.value.above ? {
                left: `${pos.value.left}px`,
                bottom: `${window.innerHeight - pos.value.top}px`,
                transformOrigin: "bottom right"
              } : {
                left: `${pos.value.left}px`,
                top: `${pos.value.top}px`,
                transformOrigin: "top right"
              }
            }
          }, [
            h9(GradientPanel, {
              value: props.value,
              onChange: (next) => emit("change", next),
              onDrag: onPanelDrag
            })
          ])] : []
        })
      ]) : null
    ]);
  }
});

// src/vue/components/RangeSlider.ts
import { defineComponent as defineComponent10, h as h10, computed as computed5, nextTick as nextTick3, onMounted as onMounted9, onUnmounted as onUnmounted4, ref as ref11, watch as watch7 } from "vue";
import { animate as animate2, motionValue } from "motion-v";

// src/shortcut-utils.ts
function decimalsForStep2(step) {
  const s = step.toString();
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}
function roundValue(val, step) {
  const raw = Math.round(val / step) * step;
  return parseFloat(raw.toFixed(decimalsForStep2(step)));
}
function getEffectiveStep(control, shortcut) {
  const min = control.min ?? 0;
  const max = control.max ?? 1;
  const range = max - min;
  const mode = shortcut.mode ?? "normal";
  return mode === "fine" ? range * 0.01 : mode === "coarse" ? range * 0.1 : control.step ?? 1;
}
function applySliderDelta(panelId, path, control, effectiveStep2, direction) {
  const currentValue = DialStore.getValue(panelId, path);
  const min = control.min ?? 0;
  const max = control.max ?? 1;
  const newValue = Math.max(min, Math.min(max, currentValue + direction * effectiveStep2));
  DialStore.updateValue(panelId, path, roundValue(newValue, effectiveStep2));
}
function snapToDecile(rawValue, min, max) {
  const normalized = (rawValue - min) / (max - min);
  const nearest = Math.round(normalized * 10) / 10;
  if (Math.abs(normalized - nearest) <= 0.03125) {
    return min + nearest * (max - min);
  }
  return rawValue;
}
function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if (el.contentEditable === "true") return true;
  return false;
}
function getActiveModifier(e) {
  if (e.altKey) return "alt";
  if (e.shiftKey) return "shift";
  if (e.metaKey) return "meta";
  return void 0;
}
function findControl(controls, path) {
  for (const control of controls) {
    if (control.path === path) return control;
    if (control.type === "folder" && control.children) {
      const found = findControl(control.children, path);
      if (found) return found;
    }
  }
  return null;
}
var DRAG_SENSITIVITY = 4;
function formatInteractionLabel(interaction) {
  switch (interaction) {
    case "drag":
      return "Drag";
    case "move":
      return "Move";
    case "scroll-only":
      return "Scroll";
    default:
      return "Scroll";
  }
}
function formatSliderShortcut(sc) {
  const interaction = sc.interaction ?? "scroll";
  const actionLabel = formatInteractionLabel(interaction);
  if (!sc.key) return actionLabel;
  const mod = formatModifier(sc.modifier);
  return `${mod}${sc.key.toUpperCase()}+${actionLabel}`;
}
function formatToggleShortcut(sc) {
  if (!sc.key) return "Press";
  const mod = formatModifier(sc.modifier);
  return `${mod}${sc.key.toUpperCase()}`;
}
function formatModifier(modifier) {
  return modifier === "alt" ? "\u2325" : modifier === "shift" ? "\u21E7" : modifier === "meta" ? "\u2318" : "";
}

// src/vue/components/RangeSlider.ts
var CLICK_THRESHOLD = 3;
var HANDLE_HIT_PX = 12;
var RangeSlider = defineComponent10({
  name: "DialKitRangeSlider",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true },
    /** Lower bound of the track. */
    min: { type: Number, required: false },
    /** Upper bound of the track. */
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue: { type: Object, required: false, default: void 0 }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const min = computed5(() => props.min ?? 0);
    const max = computed5(() => props.max ?? 1);
    const step = computed5(() => props.step ?? 0.01);
    const wrapperRef = ref11(null);
    const fillRef = ref11(null);
    const lowHandleRef = ref11(null);
    const highHandleRef = ref11(null);
    const inputRef = ref11(null);
    const isInteracting = ref11(false);
    const isDragging = ref11(false);
    const isHovered = ref11(false);
    const editing = ref11(null);
    const inputValue = ref11("");
    const value = computed5(
      () => isInteracting.value ? props.value : clampRange(props.value, min.value, max.value)
    );
    const span = computed5(() => max.value - min.value);
    const percentFromValue = (v) => span.value === 0 ? 0 : (v - min.value) / span.value * 100;
    const lowPercent = computed5(() => percentFromValue(value.value.min));
    const highPercent = computed5(() => percentFromValue(value.value.max));
    const isActive = computed5(() => isInteracting.value || isHovered.value);
    const lowMotion = motionValue(lowPercent.value);
    const highMotion = motionValue(highPercent.value);
    let pointerDownPos = null;
    let isClickFlag = true;
    let dragTarget = null;
    let clickMoves = false;
    let dragStartValue = props.value;
    let dragStartValueAt = 0;
    let wrapperRect = null;
    let scaleVal = 1;
    let lowAnim = null;
    let highAnim = null;
    const stopAnims = () => {
      lowAnim?.stop();
      highAnim?.stop();
      lowAnim = null;
      highAnim = null;
    };
    const applyFillStyles = () => {
      const lo = lowMotion.get();
      const hi = highMotion.get();
      if (fillRef.value) {
        fillRef.value.style.left = `${lo}%`;
        fillRef.value.style.width = `${Math.max(0, hi - lo)}%`;
      }
      const handles = handleLeftStyles(lo, hi);
      if (lowHandleRef.value) lowHandleRef.value.style.left = handles.low;
      if (highHandleRef.value) highHandleRef.value.style.left = handles.high;
    };
    const REST_OPACITY = 0.35;
    const handleOpacityFor = (which) => {
      if (!isActive.value) return REST_OPACITY;
      if (isDragging.value && dragTarget === which) return 0.95;
      return 0.7;
    };
    const applyHandleOpacity = () => {
      if (lowHandleRef.value) lowHandleRef.value.style.opacity = String(handleOpacityFor("min"));
      if (highHandleRef.value) highHandleRef.value.style.opacity = String(handleOpacityFor("max"));
    };
    const positionToValue = (clientX) => {
      if (!wrapperRect) return value.value.min;
      const screenX = clientX - wrapperRect.left;
      const sceneX = screenX / scaleVal;
      const nativeWidth = wrapperRef.value ? wrapperRef.value.offsetWidth : wrapperRect.width;
      const pct = Math.max(0, Math.min(1, sceneX / nativeWidth));
      const rawValue = min.value + pct * (max.value - min.value);
      return Math.max(min.value, Math.min(max.value, rawValue));
    };
    const syncMotion = (next) => {
      lowMotion.jump(percentFromValue(next.min));
      highMotion.jump(percentFromValue(next.max));
    };
    const handlePointerDown = (event) => {
      if (editing.value) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isInteracting.value = true;
      if (wrapperRef.value) {
        wrapperRect = wrapperRef.value.getBoundingClientRect();
        scaleVal = wrapperRect.width / wrapperRef.value.offsetWidth;
      }
      const current = clampRange(props.value, min.value, max.value);
      const atValue = positionToValue(event.clientX);
      const trackW = wrapperRef.value?.offsetWidth ?? 1;
      const hitV = HANDLE_HIT_PX / trackW * (max.value - min.value);
      dragTarget = pickDragTarget(atValue, current, hitV);
      clickMoves = dragTarget !== "span" && isOutsideSpan(atValue, current);
      dragStartValue = current;
      dragStartValueAt = atValue;
    };
    const handlePointerMove = (event) => {
      if (!isInteracting.value || !pointerDownPos) return;
      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickFlag && distance > CLICK_THRESHOLD) {
        isClickFlag = false;
        isDragging.value = true;
      }
      if (isClickFlag) return;
      const raw = roundValue(positionToValue(event.clientX), step.value);
      const current = value.value;
      let next;
      if (dragTarget === "span") {
        const delta = raw - roundValue(dragStartValueAt, step.value);
        next = shiftSpan(delta, dragStartValue, min.value, max.value);
      } else if (dragTarget === "min") {
        next = setLow(raw, current, min.value);
      } else {
        next = setHigh(raw, current, max.value);
      }
      stopAnims();
      syncMotion(next);
      emit("change", next);
    };
    const handlePointerUp = (event) => {
      if (!isInteracting.value) return;
      if (isClickFlag && clickMoves) {
        const current = value.value;
        const raw = roundValue(positionToValue(event.clientX), step.value);
        const which = dragTarget ?? nearestHandle(raw, current);
        const next = which === "min" ? setLow(raw, current, min.value) : setHigh(raw, current, max.value);
        const targetMotion = which === "min" ? lowMotion : highMotion;
        const targetPct = percentFromValue(which === "min" ? next.min : next.max);
        stopAnims();
        const active = animate2(targetMotion, targetPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            if (which === "min") lowAnim = null;
            else highAnim = null;
          }
        });
        if (which === "min") lowAnim = active;
        else highAnim = active;
        emit("change", next);
      }
      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
      dragTarget = null;
    };
    const handlePointerCancel = () => {
      if (!isInteracting.value) return;
      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
      dragTarget = null;
    };
    const handleDoubleClick = () => {
      if (editing.value !== null) return;
      const d = clampRange(props.defaultValue ?? { min: min.value, max: max.value }, min.value, max.value);
      stopAnims();
      lowAnim = animate2(lowMotion, percentFromValue(d.min), {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          lowAnim = null;
        }
      });
      highAnim = animate2(highMotion, percentFromValue(d.max), {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          highAnim = null;
        }
      });
      emit("change", d);
    };
    const decimals = computed5(() => decimalsForStep2(step.value));
    const openEditor = (which, event) => {
      event.stopPropagation();
      editing.value = which;
      inputValue.value = (which === "min" ? value.value.min : value.value.max).toFixed(decimals.value);
    };
    const commitEditor = () => {
      if (!editing.value) return;
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        const rounded = roundValue(parsed, step.value);
        const current = value.value;
        const next = editing.value === "min" ? setLow(rounded, current, min.value) : setHigh(rounded, current, max.value);
        emit("change", next);
      }
      editing.value = null;
    };
    const handleInputKeydown = (event) => {
      if (event.key === "Enter") {
        commitEditor();
      } else if (event.key === "Escape") {
        editing.value = null;
      }
    };
    watch7([lowPercent, highPercent], ([lo, hi]) => {
      if (!isInteracting.value && !lowAnim && !highAnim) {
        lowMotion.jump(lo);
        highMotion.jump(hi);
      }
    });
    watch7([isActive, isDragging], () => {
      applyHandleOpacity();
    });
    watch7(editing, async (which) => {
      if (which === null) return;
      await nextTick3();
      inputRef.value?.focus();
      inputRef.value?.select();
    });
    let unsubLow = null;
    let unsubHigh = null;
    onMounted9(() => {
      unsubLow = lowMotion.on("change", applyFillStyles);
      unsubHigh = highMotion.on("change", applyFillStyles);
      applyFillStyles();
      applyHandleOpacity();
    });
    onUnmounted4(() => {
      stopAnims();
      unsubLow?.();
      unsubHigh?.();
    });
    return () => {
      const current = value.value;
      const lowText = current.min.toFixed(decimals.value);
      const highText = current.max.toFixed(decimals.value);
      const handles = handleLeftStyles(lowPercent.value, highPercent.value);
      return h10("div", { ref: wrapperRef, class: "dialkit-range-slider-wrapper" }, [
        h10("div", {
          class: `dialkit-range-slider ${isActive.value ? "dialkit-range-slider-active" : ""}`,
          onPointerdown: handlePointerDown,
          onPointermove: handlePointerMove,
          onPointerup: handlePointerUp,
          onPointercancel: handlePointerCancel,
          onDblclick: handleDoubleClick,
          onMouseenter: () => {
            isHovered.value = true;
          },
          onMouseleave: () => {
            isHovered.value = false;
          }
        }, [
          h10("div", {
            ref: fillRef,
            class: "dialkit-range-slider-fill",
            style: {
              left: `${lowPercent.value}%`,
              width: `${Math.max(0, highPercent.value - lowPercent.value)}%`
            }
          }),
          h10("div", {
            ref: lowHandleRef,
            class: "dialkit-range-slider-handle",
            style: {
              left: handles.low,
              transform: "translateY(-50%)",
              opacity: handleOpacityFor("min")
            }
          }),
          h10("div", {
            ref: highHandleRef,
            class: "dialkit-range-slider-handle",
            style: {
              left: handles.high,
              transform: "translateY(-50%)",
              opacity: handleOpacityFor("max")
            }
          }),
          h10("span", { class: "dialkit-range-slider-label" }, props.label),
          editing.value !== null ? h10("input", {
            ref: inputRef,
            type: "text",
            class: "dialkit-range-slider-input",
            value: inputValue.value,
            onInput: (event) => {
              inputValue.value = event.target.value;
            },
            onKeydown: handleInputKeydown,
            onBlur: commitEditor,
            onClick: (event) => event.stopPropagation(),
            onPointerdown: (event) => event.stopPropagation()
          }) : h10("span", { class: "dialkit-range-slider-value" }, [
            h10("span", {
              class: "dialkit-range-slider-bound",
              onClick: (event) => openEditor("min", event),
              onPointerdown: (event) => event.stopPropagation()
            }, lowText),
            h10("span", { class: "dialkit-range-slider-dash" }, "\u2013"),
            h10("span", {
              class: "dialkit-range-slider-bound",
              onClick: (event) => openEditor("max", event),
              onPointerdown: (event) => event.stopPropagation()
            }, highText)
          ])
        ])
      ]);
    };
  }
});

// src/vue/components/SelectControl.ts
import { Teleport as Teleport4, defineComponent as defineComponent11, h as h11, onMounted as onMounted10, ref as ref12, watch as watch8 } from "vue";
import { AnimatePresence as AnimatePresence4, motion as motion4 } from "motion-v";
function toTitleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
function normalizeOptions(options) {
  return options.map(
    (option) => typeof option === "string" ? { value: option, label: toTitleCase(option) } : option
  );
}
var SelectControl = defineComponent11({
  name: "DialKitSelectControl",
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    options: {
      type: Array,
      required: true
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const isOpen = ref12(false);
    const pos = ref12(null);
    const portalTarget = ref12(null);
    const triggerRef = ref12(null);
    const dropdownRef = ref12(null);
    const normalizedOptions = () => normalizeOptions(props.options);
    const selectedLabel = () => normalizedOptions().find((option) => option.value === props.value)?.label ?? props.value;
    const updatePos = () => {
      if (!triggerRef.value) return;
      const rect = triggerRef.value.getBoundingClientRect();
      const dropdownHeight = 8 + normalizedOptions().length * 36;
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
      pos.value = {
        top: above ? rect.top - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        above
      };
    };
    const openDropdown = () => {
      updatePos();
      isOpen.value = true;
    };
    const closeDropdown = () => {
      isOpen.value = false;
    };
    const setDropdownRef = (node) => {
      if (node instanceof HTMLElement) {
        dropdownRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        dropdownRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      dropdownRef.value = null;
    };
    const toggleDropdown = () => {
      if (isOpen.value) closeDropdown();
      else openDropdown();
    };
    watch8(isOpen, (open, _, onCleanup) => {
      if (!open) return;
      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event) => {
        const target = event.target;
        if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
        closeDropdown();
      };
      updatePos();
      document.addEventListener("mousedown", handleDocumentClick);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);
      onCleanup(() => {
        document.removeEventListener("mousedown", handleDocumentClick);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      });
    });
    onMounted10(() => {
      const root = triggerRef.value?.closest(".dialkit-root");
      portalTarget.value = root ?? document.body;
    });
    return () => h11("div", { class: "dialkit-select-row" }, [
      h11("button", {
        ref: triggerRef,
        class: "dialkit-select-trigger",
        "data-open": String(isOpen.value),
        onClick: toggleDropdown
      }, [
        h11("span", { class: "dialkit-select-label" }, props.label),
        h11("div", { class: "dialkit-select-right" }, [
          h11("span", { class: "dialkit-select-value" }, selectedLabel()),
          h11(motion4.svg, {
            class: "dialkit-select-chevron",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            animate: { rotate: isOpen.value ? 180 : 0 },
            transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 }
          }, [h11("path", { d: "M6 9.5L12 15.5L18 9.5" })])
        ])
      ]),
      portalTarget.value ? h11(Teleport4, { to: portalTarget.value }, [
        h11(AnimatePresence4, null, {
          default: () => isOpen.value && pos.value ? [h11(motion4.div, {
            key: "dialkit-select-dropdown",
            ref: setDropdownRef,
            class: "dialkit-select-dropdown",
            initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
            style: {
              position: "fixed",
              left: `${pos.value.left}px`,
              width: `${pos.value.width}px`,
              ...pos.value.above ? {
                bottom: `${window.innerHeight - pos.value.top}px`,
                transformOrigin: "bottom"
              } : {
                top: `${pos.value.top}px`,
                transformOrigin: "top"
              }
            }
          }, normalizedOptions().map((option) => h11("button", {
            key: option.value,
            class: "dialkit-select-option",
            "data-selected": String(option.value === props.value),
            onClick: () => {
              emit("change", option.value);
              closeDropdown();
            }
          }, option.label)))] : []
        })
      ]) : null
    ]);
  }
});

// src/vue/components/ShortcutListener.ts
import { defineComponent as defineComponent12, inject, onMounted as onMounted11, onUnmounted as onUnmounted5, provide, ref as ref13 } from "vue";
var ShortcutKey = /* @__PURE__ */ Symbol("DialKitShortcut");
function useShortcutContext() {
  return inject(ShortcutKey, {
    activePanelId: ref13(null),
    activePath: ref13(null)
  });
}
var ShortcutListener = defineComponent12({
  name: "DialKitShortcutListener",
  setup(_, { slots }) {
    const activePanelId = ref13(null);
    const activePath = ref13(null);
    const activeKeys = /* @__PURE__ */ new Set();
    let isDragging = false;
    let lastMouseX = null;
    let dragAccumulator = 0;
    provide(ShortcutKey, { activePanelId, activePath });
    const resolveActiveTarget = (interaction) => {
      for (const key of activeKeys) {
        const panels = DialStore.getPanels();
        for (const panel of panels) {
          for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
            if (!shortcut.key) continue;
            if (shortcut.key.toLowerCase() !== key) continue;
            if ((shortcut.interaction ?? "scroll") !== interaction) continue;
            const control = DialStore.getPanel(panel.id)?.controls ? findControl(panel.controls, path) : null;
            if (control && control.type === "slider") {
              return { panelId: panel.id, path, control, shortcut };
            }
          }
        }
      }
      return null;
    };
    const handleKeyDown = (e) => {
      if (isInputFocused()) return;
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
        if (activeKeys.size > 0) {
          const target2 = resolveActiveTarget("scroll") || resolveActiveTarget("drag") || resolveActiveTarget("move");
          if (target2 && target2.control.type === "slider") {
            e.preventDefault();
            const direction = key === "arrowright" || key === "arrowup" ? 1 : -1;
            const effectiveStep2 = getEffectiveStep(target2.control, target2.shortcut);
            applySliderDelta(target2.panelId, target2.path, target2.control, effectiveStep2, direction);
            return;
          }
        }
      }
      const wasAlreadyHeld = activeKeys.has(key);
      activeKeys.add(key);
      const modifier = getActiveModifier(e);
      const target = DialStore.resolveShortcutTarget(key, modifier);
      if (target) {
        activePanelId.value = target.panelId;
        activePath.value = target.path;
        if (!wasAlreadyHeld && target.control.type === "toggle") {
          const currentValue = DialStore.getValue(target.panelId, target.path);
          DialStore.updateValue(target.panelId, target.path, !currentValue);
        }
      }
      if (!wasAlreadyHeld) {
        lastMouseX = null;
        dragAccumulator = 0;
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      activeKeys.delete(key);
      isDragging = false;
      lastMouseX = null;
      dragAccumulator = 0;
      if (activeKeys.size === 0) {
        activePanelId.value = null;
        activePath.value = null;
      } else {
        let found = false;
        for (const remainingKey of activeKeys) {
          const modifier = getActiveModifier(e);
          const target = DialStore.resolveShortcutTarget(remainingKey, modifier);
          if (target) {
            activePanelId.value = target.panelId;
            activePath.value = target.path;
            found = true;
            break;
          }
        }
        if (!found) {
          activePanelId.value = null;
          activePath.value = null;
        }
      }
    };
    const handleWheel = (e) => {
      if (isInputFocused()) return;
      const modifier = getActiveModifier(e);
      if (activeKeys.size > 0) {
        for (const key of activeKeys) {
          const target = DialStore.resolveShortcutTarget(key, modifier);
          if (!target) continue;
          const { panelId, path, control } = target;
          const interaction = control.shortcut?.interaction ?? "scroll";
          if (interaction !== "scroll" || control.type !== "slider") continue;
          e.preventDefault();
          const effectiveStep2 = getEffectiveStep(control, control.shortcut);
          const direction = e.deltaY > 0 ? -1 : 1;
          applySliderDelta(panelId, path, control, effectiveStep2, direction);
          return;
        }
      }
      const scrollOnlyTargets = DialStore.resolveScrollOnlyTargets();
      for (const { panelId, path, control, shortcut } of scrollOnlyTargets) {
        if (control.type !== "slider") continue;
        e.preventDefault();
        const effectiveStep2 = getEffectiveStep(control, shortcut);
        const direction = e.deltaY > 0 ? -1 : 1;
        applySliderDelta(panelId, path, control, effectiveStep2, direction);
        return;
      }
    };
    const handleMouseDown = (e) => {
      if (isInputFocused()) return;
      if (activeKeys.size === 0) return;
      const target = resolveActiveTarget("drag");
      if (target) {
        isDragging = true;
        lastMouseX = e.clientX;
        dragAccumulator = 0;
        e.preventDefault();
      }
    };
    const handleMouseUp = () => {
      isDragging = false;
      lastMouseX = null;
      dragAccumulator = 0;
    };
    const handleMouseMove = (e) => {
      if (isInputFocused()) return;
      if (activeKeys.size === 0) return;
      if (isDragging) {
        const target = resolveActiveTarget("drag");
        if (target && lastMouseX !== null) {
          const deltaX = e.clientX - lastMouseX;
          lastMouseX = e.clientX;
          dragAccumulator += deltaX;
          const effectiveStep2 = getEffectiveStep(target.control, target.shortcut);
          const steps = Math.trunc(dragAccumulator / DRAG_SENSITIVITY);
          if (steps !== 0) {
            dragAccumulator -= steps * DRAG_SENSITIVITY;
            applySliderDelta(target.panelId, target.path, target.control, effectiveStep2, steps);
          }
        }
        return;
      }
      const moveTarget = resolveActiveTarget("move");
      if (moveTarget) {
        if (lastMouseX === null) {
          lastMouseX = e.clientX;
          return;
        }
        const deltaX = e.clientX - lastMouseX;
        lastMouseX = e.clientX;
        dragAccumulator += deltaX;
        const effectiveStep2 = getEffectiveStep(moveTarget.control, moveTarget.shortcut);
        const steps = Math.trunc(dragAccumulator / DRAG_SENSITIVITY);
        if (steps !== 0) {
          dragAccumulator -= steps * DRAG_SENSITIVITY;
          applySliderDelta(moveTarget.panelId, moveTarget.path, moveTarget.control, effectiveStep2, steps);
        }
      }
    };
    const handleWindowBlur = () => {
      activeKeys.clear();
      isDragging = false;
      lastMouseX = null;
      dragAccumulator = 0;
      activePanelId.value = null;
      activePath.value = null;
    };
    onMounted11(() => {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("blur", handleWindowBlur);
    });
    onUnmounted5(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    });
    return () => slots.default?.();
  }
});

// src/vue/components/Slider.ts
import { defineComponent as defineComponent13, h as h13, computed as computed6, nextTick as nextTick4, onMounted as onMounted12, onUnmounted as onUnmounted6, ref as ref14, watch as watch9 } from "vue";
import { animate as animate3, motionValue as motionValue2 } from "motion-v";
var CLICK_THRESHOLD2 = 3;
var DEAD_ZONE = 32;
var MAX_CURSOR_RANGE = 200;
var MAX_STRETCH = 8;
var Slider = defineComponent13({
  name: "DialKitSlider",
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    unit: { type: String, required: false },
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min`.
     */
    origin: { type: Number, required: false, default: void 0 },
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar: { type: Boolean, default: false },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const min = computed6(() => props.min ?? 0);
    const max = computed6(() => props.max ?? 1);
    const step = computed6(() => props.step ?? 0.01);
    const resolvedOrigin = computed6(
      () => Math.min(max.value, Math.max(min.value, props.origin ?? (props.bipolar ? 0 : min.value)))
    );
    const hasOrigin = computed6(() => resolvedOrigin.value > min.value);
    const originPercent = computed6(
      () => (resolvedOrigin.value - min.value) / (max.value - min.value) * 100
    );
    const DETENT_PX = 6;
    const wrapperRef = ref14(null);
    const trackRef = ref14(null);
    const fillRef = ref14(null);
    const handleRef = ref14(null);
    const labelRef = ref14(null);
    const valueSpanRef = ref14(null);
    const inputRef = ref14(null);
    const isInteracting = ref14(false);
    const isDragging = ref14(false);
    const isHovered = ref14(false);
    const isValueHovered = ref14(false);
    const isValueEditable = ref14(false);
    const showInput = ref14(false);
    const inputValue = ref14("");
    const fillPercent = motionValue2((props.value - min.value) / (max.value - min.value) * 100);
    const rubberStretchPx = motionValue2(0);
    const handleOpacityMv = motionValue2(0);
    const handleScaleXMv = motionValue2(0.25);
    const handleScaleYMv = motionValue2(1);
    const percentage = computed6(() => (props.value - min.value) / (max.value - min.value) * 100);
    const isActive = computed6(() => isInteracting.value || isHovered.value);
    const displayValue = computed6(() => props.value.toFixed(decimalsForStep2(step.value)));
    let pointerDownPos = null;
    let isClickFlag = true;
    let wrapperRect = null;
    let scaleVal = 1;
    let hoverTimeout = null;
    let snapAnim = null;
    let rubberAnim = null;
    let handleOpacityAnim = null;
    let handleScaleXAnim = null;
    let handleScaleYAnim = null;
    const applyFillStyles = (pct) => {
      if (fillRef.value) {
        fillRef.value.style.left = hasOrigin.value ? `${Math.min(pct, originPercent.value)}%` : "0%";
        fillRef.value.style.width = hasOrigin.value ? `${Math.abs(pct - originPercent.value)}%` : `${pct}%`;
      }
      if (handleRef.value) handleRef.value.style.left = `max(5px, calc(${pct}% - 9px))`;
    };
    const applyDetent = (v) => {
      if (!hasOrigin.value || !wrapperRef.value) return v;
      const trackWidth = wrapperRef.value.offsetWidth;
      if (trackWidth <= 0) return v;
      const detentValue = DETENT_PX / trackWidth * (max.value - min.value);
      return Math.abs(v - resolvedOrigin.value) <= detentValue ? resolvedOrigin.value : v;
    };
    const applyRubberStyles = (stretch) => {
      if (!trackRef.value) return;
      trackRef.value.style.width = `calc(100% + ${Math.abs(stretch)}px)`;
      trackRef.value.style.transform = `translateX(${stretch < 0 ? stretch : 0}px)`;
    };
    const applyHandleVisualStyles = () => {
      if (!handleRef.value) return;
      handleRef.value.style.opacity = String(handleOpacityMv.get());
      handleRef.value.style.transform = `translateY(-50%) scaleX(${handleScaleXMv.get()}) scaleY(${handleScaleYMv.get()})`;
    };
    const positionToValue = (clientX) => {
      if (!wrapperRect) return props.value;
      const screenX = clientX - wrapperRect.left;
      const sceneX = screenX / scaleVal;
      const nativeWidth = wrapperRef.value ? wrapperRef.value.offsetWidth : wrapperRect.width;
      const pct = Math.max(0, Math.min(1, sceneX / nativeWidth));
      const rawValue = min.value + pct * (max.value - min.value);
      return Math.max(min.value, Math.min(max.value, rawValue));
    };
    const percentFromValue = (value) => (value - min.value) / (max.value - min.value) * 100;
    const computeRubberStretch = (clientX, sign) => {
      if (!wrapperRect) return 0;
      const distancePast = sign < 0 ? wrapperRect.left - clientX : clientX - wrapperRect.right;
      const overflow = Math.max(0, distancePast - DEAD_ZONE);
      return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
    };
    const leftThreshold = () => {
      const HANDLE_BUFFER = 8;
      const LABEL_CSS_LEFT = 10;
      const trackWidth = wrapperRef.value?.offsetWidth;
      if (trackWidth && labelRef.value) {
        return (LABEL_CSS_LEFT + labelRef.value.offsetWidth + HANDLE_BUFFER) / trackWidth * 100;
      }
      return 30;
    };
    const rightThreshold = () => {
      const HANDLE_BUFFER = 8;
      const VALUE_CSS_RIGHT = 10;
      const trackWidth = wrapperRef.value?.offsetWidth;
      if (trackWidth && valueSpanRef.value) {
        return (trackWidth - VALUE_CSS_RIGHT - valueSpanRef.value.offsetWidth - HANDLE_BUFFER) / trackWidth * 100;
      }
      return 78;
    };
    const valueDodge = () => percentage.value < leftThreshold() || percentage.value > rightThreshold();
    const handleOpacity = () => {
      if (!isActive.value) return 0;
      if (valueDodge()) return 0.1;
      if (isDragging.value) return 0.9;
      return 0.5;
    };
    const animateHandleState = () => {
      const targetOpacity = handleOpacity();
      const targetScaleX = isActive.value ? 1 : 0.25;
      const targetScaleY = isActive.value && valueDodge() ? 0.75 : 1;
      handleOpacityAnim?.stop();
      handleScaleXAnim?.stop();
      handleScaleYAnim?.stop();
      handleOpacityAnim = animate3(handleOpacityMv, targetOpacity, { duration: 0.15 });
      handleScaleXAnim = animate3(handleScaleXMv, targetScaleX, {
        type: "spring",
        visualDuration: 0.25,
        bounce: 0.15
      });
      handleScaleYAnim = animate3(handleScaleYMv, targetScaleY, {
        type: "spring",
        visualDuration: 0.2,
        bounce: 0.1
      });
    };
    const handlePointerDown = (event) => {
      if (showInput.value) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isInteracting.value = true;
      if (wrapperRef.value) {
        wrapperRect = wrapperRef.value.getBoundingClientRect();
        scaleVal = wrapperRect.width / wrapperRef.value.offsetWidth;
      }
    };
    const handlePointerMove = (event) => {
      if (!isInteracting.value || !pointerDownPos) return;
      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickFlag && distance > CLICK_THRESHOLD2) {
        isClickFlag = false;
        isDragging.value = true;
      }
      if (!isClickFlag) {
        if (wrapperRect) {
          if (event.clientX < wrapperRect.left) {
            rubberStretchPx.jump(computeRubberStretch(event.clientX, -1));
          } else if (event.clientX > wrapperRect.right) {
            rubberStretchPx.jump(computeRubberStretch(event.clientX, 1));
          } else {
            rubberStretchPx.jump(0);
          }
        }
        const nextValue = applyDetent(positionToValue(event.clientX));
        const nextPct = percentFromValue(nextValue);
        if (snapAnim) {
          snapAnim.stop();
          snapAnim = null;
        }
        fillPercent.jump(nextPct);
        emit("change", roundValue(nextValue, step.value));
      }
    };
    const handlePointerUp = (event) => {
      if (!isInteracting.value) return;
      if (isClickFlag) {
        const rawValue = positionToValue(event.clientX);
        const discreteSteps2 = (max.value - min.value) / step.value;
        const snappedValue = discreteSteps2 <= 10 ? Math.max(min.value, Math.min(max.value, min.value + Math.round((rawValue - min.value) / step.value) * step.value)) : snapToDecile(rawValue, min.value, max.value);
        const nextPct = percentFromValue(snappedValue);
        snapAnim?.stop();
        snapAnim = animate3(fillPercent, nextPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            snapAnim = null;
          }
        });
        emit("change", roundValue(snappedValue, step.value));
      }
      if (rubberStretchPx.get() !== 0) {
        rubberAnim?.stop();
        rubberAnim = animate3(rubberStretchPx, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15
        });
      }
      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
    };
    const handlePointerCancel = () => {
      if (!isInteracting.value) return;
      isInteracting.value = false;
      isDragging.value = false;
      rubberStretchPx.jump(0);
      pointerDownPos = null;
    };
    const handleInputSubmit = () => {
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        const clamped = Math.max(min.value, Math.min(max.value, parsed));
        emit("change", roundValue(clamped, step.value));
      }
      showInput.value = false;
      isValueHovered.value = false;
      isValueEditable.value = false;
    };
    const handleValueClick = (event) => {
      if (!isValueEditable.value) return;
      event.stopPropagation();
      event.preventDefault();
      showInput.value = true;
      inputValue.value = props.value.toFixed(decimalsForStep2(step.value));
    };
    const handleInputKeydown = (event) => {
      if (event.key === "Enter") {
        handleInputSubmit();
      } else if (event.key === "Escape") {
        showInput.value = false;
        isValueHovered.value = false;
      }
    };
    watch9(() => props.value, () => {
      if (!isInteracting.value && !snapAnim) {
        fillPercent.jump(percentage.value);
      }
    });
    watch9([isInteracting, isHovered, isDragging, () => props.value], () => {
      animateHandleState();
    });
    watch9([isValueHovered, showInput, isValueEditable], () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      if (isValueHovered.value && !showInput.value && !isValueEditable.value) {
        hoverTimeout = setTimeout(() => {
          isValueEditable.value = true;
          animateHandleState();
        }, 800);
      } else if (!isValueHovered.value && !showInput.value) {
        isValueEditable.value = false;
      }
    });
    watch9(showInput, async (visible) => {
      if (!visible) return;
      await nextTick4();
      inputRef.value?.focus();
      inputRef.value?.select();
    });
    const discreteSteps = computed6(() => (max.value - min.value) / step.value);
    const hashMarks = computed6(() => {
      const marks = [];
      if (discreteSteps.value <= 10) {
        const count = Math.max(0, Math.floor(discreteSteps.value) - 1);
        for (let i = 0; i < count; i += 1) {
          const pct = (i + 1) * step.value / (max.value - min.value) * 100;
          marks.push(h13("div", { class: "dialkit-slider-hashmark", style: { left: `${pct}%` } }));
        }
        return marks;
      }
      for (let i = 0; i < 9; i += 1) {
        const pct = (i + 1) * 10;
        marks.push(h13("div", { class: "dialkit-slider-hashmark", style: { left: `${pct}%` } }));
      }
      return marks;
    });
    let unsubFill = null;
    let unsubRubber = null;
    let unsubHandleOpacity = null;
    let unsubHandleScaleX = null;
    let unsubHandleScaleY = null;
    onMounted12(() => {
      unsubFill = fillPercent.on("change", applyFillStyles);
      unsubRubber = rubberStretchPx.on("change", applyRubberStyles);
      unsubHandleOpacity = handleOpacityMv.on("change", applyHandleVisualStyles);
      unsubHandleScaleX = handleScaleXMv.on("change", applyHandleVisualStyles);
      unsubHandleScaleY = handleScaleYMv.on("change", applyHandleVisualStyles);
      applyFillStyles(fillPercent.get());
      applyRubberStyles(rubberStretchPx.get());
      applyHandleVisualStyles();
      animateHandleState();
    });
    onUnmounted6(() => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      snapAnim?.stop();
      rubberAnim?.stop();
      handleOpacityAnim?.stop();
      handleScaleXAnim?.stop();
      handleScaleYAnim?.stop();
      unsubFill?.();
      unsubRubber?.();
      unsubHandleOpacity?.();
      unsubHandleScaleX?.();
      unsubHandleScaleY?.();
    });
    return () => h13("div", { ref: wrapperRef, class: "dialkit-slider-wrapper" }, [
      h13("div", {
        ref: trackRef,
        class: `dialkit-slider ${isActive.value ? "dialkit-slider-active" : ""}`,
        onPointerdown: handlePointerDown,
        onPointermove: handlePointerMove,
        onPointerup: handlePointerUp,
        onPointercancel: handlePointerCancel,
        onMouseenter: () => {
          isHovered.value = true;
          animateHandleState();
        },
        onMouseleave: () => {
          isHovered.value = false;
          animateHandleState();
        }
      }, [
        h13("div", { class: "dialkit-slider-hashmarks" }, hashMarks.value),
        h13("div", {
          ref: fillRef,
          class: "dialkit-slider-fill",
          style: {
            left: hasOrigin.value ? `${Math.min(fillPercent.get(), originPercent.value)}%` : "0%",
            width: hasOrigin.value ? `${Math.abs(fillPercent.get() - originPercent.value)}%` : `${fillPercent.get()}%`
          }
        }),
        h13("div", {
          ref: handleRef,
          class: "dialkit-slider-handle",
          style: {
            left: `max(5px, calc(${fillPercent.get()}% - 9px))`,
            transform: "translateY(-50%) scaleX(0.25) scaleY(1)",
            opacity: 0
          }
        }),
        h13("span", { ref: labelRef, class: "dialkit-slider-label" }, [
          props.label,
          props.shortcut ? h13("span", {
            class: `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`
          }, formatSliderShortcut(props.shortcut)) : null
        ]),
        showInput.value ? h13("input", {
          ref: inputRef,
          type: "text",
          class: "dialkit-slider-input",
          value: inputValue.value,
          onInput: (event) => {
            inputValue.value = event.target.value;
          },
          onKeydown: handleInputKeydown,
          onBlur: handleInputSubmit,
          onClick: (event) => event.stopPropagation(),
          onMousedown: (event) => event.stopPropagation()
        }) : h13("span", {
          ref: valueSpanRef,
          class: `dialkit-slider-value ${isValueEditable.value ? "dialkit-slider-value-editable" : ""}`,
          onMouseenter: () => {
            isValueHovered.value = true;
          },
          onMouseleave: () => {
            isValueHovered.value = false;
          },
          onClick: handleValueClick,
          onMousedown: (event) => {
            if (isValueEditable.value) event.stopPropagation();
          },
          style: { cursor: isValueEditable.value ? "text" : "default" }
        }, displayValue.value)
      ])
    ]);
  }
});

// src/vue/components/SpringControl.ts
import { defineComponent as defineComponent15, h as h15, onMounted as onMounted13, onUnmounted as onUnmounted7, ref as ref15 } from "vue";

// src/vue/components/SpringVisualization.ts
import { defineComponent as defineComponent14, h as h14, computed as computed7 } from "vue";
function generateSpringCurve(stiffness, damping, mass, duration) {
  const points = [];
  const steps = 100;
  const dt = duration / steps;
  let position = 0;
  let velocity = 0;
  const target = 1;
  for (let i = 0; i <= steps; i += 1) {
    const time = i * dt;
    points.push([time, position]);
    const springForce = -stiffness * (position - target);
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
  }
  return points;
}
var SpringVisualization = defineComponent14({
  name: "DialKitSpringVisualization",
  props: {
    spring: {
      type: Object,
      required: true
    },
    isSimpleMode: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const width = 256;
    const height = 140;
    const pathData = computed7(() => {
      let stiffness;
      let damping;
      let mass;
      if (props.isSimpleMode) {
        const visualDuration = props.spring.visualDuration ?? 0.3;
        const bounce = props.spring.bounce ?? 0.2;
        mass = 1;
        stiffness = (2 * Math.PI / visualDuration) ** 2;
        const dampingRatio = 1 - bounce;
        damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
      } else {
        stiffness = props.spring.stiffness ?? 400;
        damping = props.spring.damping ?? 17;
        mass = props.spring.mass ?? 1;
      }
      const duration = 2;
      const points = generateSpringCurve(stiffness, damping, mass, duration);
      const values = points.map(([, value]) => value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const valueRange = maxValue - minValue;
      return points.map(([time, value], index) => {
        const x = time / duration * width;
        const normalizedValue = (value - minValue) / (valueRange || 1);
        const y = height - (normalizedValue * height * 0.6 + height * 0.2);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      }).join(" ");
    });
    return () => h14("svg", { viewBox: `0 0 ${width} ${height}`, class: "dialkit-spring-viz" }, [
      ...Array.from({ length: 3 }).flatMap((_, index) => {
        const lineIndex = index + 1;
        const x = width / 4 * lineIndex;
        const y = height / 4 * lineIndex;
        return [
          h14("line", { x1: x, y1: 0, x2: x, y2: height, stroke: "rgba(255, 255, 255, 0.08)", "stroke-width": 1 }),
          h14("line", { x1: 0, y1: y, x2: width, y2: y, stroke: "rgba(255, 255, 255, 0.08)", "stroke-width": 1 })
        ];
      }),
      h14("line", {
        x1: 0,
        y1: height / 2,
        x2: width,
        y2: height / 2,
        stroke: "rgba(255, 255, 255, 0.15)",
        "stroke-width": 1,
        "stroke-dasharray": "4,4"
      }),
      h14("path", {
        d: pathData.value,
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      })
    ]);
  }
});

// src/vue/components/SpringControl.ts
var SpringControl = defineComponent15({
  name: "DialKitSpringControl",
  props: {
    panelId: { type: String, required: true },
    path: { type: String, required: true },
    label: { type: String, required: true },
    spring: {
      type: Object,
      required: true
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const mode = ref15(DialStore.getSpringMode(props.panelId, props.path));
    let unsub;
    onMounted13(() => {
      unsub = DialStore.subscribe(props.panelId, () => {
        mode.value = DialStore.getSpringMode(props.panelId, props.path);
      });
    });
    onUnmounted7(() => {
      unsub?.();
    });
    const isSimpleMode = () => mode.value === "simple";
    const cache2 = {
      simple: props.spring.visualDuration !== void 0 ? { ...props.spring } : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
      advanced: props.spring.stiffness !== void 0 ? { ...props.spring } : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
    };
    const handleModeChange = (nextMode) => {
      if (isSimpleMode()) {
        cache2.simple = { ...props.spring };
      } else {
        cache2.advanced = { ...props.spring };
      }
      DialStore.updateSpringMode(props.panelId, props.path, nextMode);
      if (nextMode === "simple") {
        emit("change", cache2.simple);
      } else {
        emit("change", cache2.advanced);
      }
    };
    const handleUpdate = (key, value) => {
      if (isSimpleMode()) {
        const { stiffness, damping, mass, ...rest } = props.spring;
        emit("change", { ...rest, [key]: value });
      } else {
        const { visualDuration, bounce, ...rest } = props.spring;
        emit("change", { ...rest, [key]: value });
      }
    };
    return () => h15(Folder, { title: props.label, defaultOpen: true }, {
      default: () => [
        h15("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, [
          h15(SpringVisualization, { spring: props.spring, isSimpleMode: isSimpleMode() }),
          h15("div", { class: "dialkit-labeled-control" }, [
            h15("span", { class: "dialkit-labeled-control-label" }, "Type"),
            h15(SegmentedControl, {
              options: [
                { value: "simple", label: "Time" },
                { value: "advanced", label: "Physics" }
              ],
              value: mode.value,
              onChange: handleModeChange
            })
          ]),
          ...isSimpleMode() ? [
            h15(Slider, {
              label: "Duration",
              value: props.spring.visualDuration ?? 0.3,
              min: 0.1,
              max: 1,
              step: 0.05,
              unit: "s",
              onChange: (next) => handleUpdate("visualDuration", next)
            }),
            h15(Slider, {
              label: "Bounce",
              value: props.spring.bounce ?? 0.2,
              min: 0,
              max: 1,
              step: 0.05,
              onChange: (next) => handleUpdate("bounce", next)
            })
          ] : [
            h15(Slider, {
              label: "Stiffness",
              value: props.spring.stiffness ?? 400,
              min: 1,
              max: 1e3,
              step: 10,
              onChange: (next) => handleUpdate("stiffness", next)
            }),
            h15(Slider, {
              label: "Damping",
              value: props.spring.damping ?? 17,
              min: 1,
              max: 100,
              step: 1,
              onChange: (next) => handleUpdate("damping", next)
            }),
            h15(Slider, {
              label: "Mass",
              value: props.spring.mass ?? 1,
              min: 0.1,
              max: 10,
              step: 0.1,
              onChange: (next) => handleUpdate("mass", next)
            })
          ]
        ])
      ]
    });
  }
});

// src/vue/components/TextControl.ts
import { defineComponent as defineComponent16, h as h16, ref as ref16 } from "vue";
var textControlInstance = 0;
var TextControl = defineComponent16({
  name: "DialKitTextControl",
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    placeholder: { type: String, required: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const inputId = ref16(`dialkit-text-${++textControlInstance}`);
    return () => h16("div", { class: "dialkit-text-control" }, [
      h16("label", { class: "dialkit-text-label", for: inputId.value }, props.label),
      h16("input", {
        id: inputId.value,
        type: "text",
        class: "dialkit-text-input",
        value: props.value,
        placeholder: props.placeholder,
        onInput: (event) => emit("change", event.target.value)
      })
    ]);
  }
});

// src/vue/components/Toggle.ts
import { defineComponent as defineComponent17, h as h17 } from "vue";
var Toggle = defineComponent17({
  name: "DialKitToggle",
  props: {
    label: { type: String, required: true },
    checked: { type: Boolean, required: true },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () => h17("div", { class: "dialkit-labeled-control" }, [
      h17("span", { class: "dialkit-labeled-control-label" }, [
        props.label,
        props.shortcut ? h17("span", {
          class: `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`
        }, formatToggleShortcut(props.shortcut)) : null
      ]),
      h17(SegmentedControl, {
        options: [
          { value: "off", label: "Off" },
          { value: "on", label: "On" }
        ],
        value: props.checked ? "on" : "off",
        onChange: (value) => emit("change", value === "on")
      })
    ]);
  }
});

// src/vue/components/TransitionControl.ts
import { defineComponent as defineComponent19, h as h19, onMounted as onMounted14, onUnmounted as onUnmounted8, ref as ref17 } from "vue";

// src/vue/components/EasingVisualization.ts
import { defineComponent as defineComponent18, h as h18, computed as computed8 } from "vue";
var EasingVisualization = defineComponent18({
  name: "DialKitEasingVisualization",
  props: {
    easing: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const size = 200;
    const pad = 10;
    const inner = size - pad * 2;
    const unit = inner / 2;
    const curve = computed8(() => {
      const [x1, y1, x2, y2] = props.easing.ease;
      const toSvg = (nx, ny) => ({
        x: pad + (nx + 0.5) * unit,
        y: pad + (1.5 - ny) * unit
      });
      const start = toSvg(0, 0);
      const end = toSvg(1, 1);
      const p1 = toSvg(x1, y1);
      const p2 = toSvg(x2, y2);
      return `M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
    });
    return () => h18("svg", {
      viewBox: `0 0 ${size} ${size}`,
      preserveAspectRatio: "xMidYMid slice",
      class: "dialkit-spring-viz dialkit-easing-viz"
    }, [
      h18("line", {
        x1: pad + (0 + 0.5) * unit,
        y1: pad + (1.5 - 0) * unit,
        x2: pad + (1 + 0.5) * unit,
        y2: pad + (1.5 - 1) * unit,
        stroke: "rgba(255, 255, 255, 0.15)",
        "stroke-width": 1,
        "stroke-dasharray": "4,4"
      }),
      h18("path", {
        d: curve.value,
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        "stroke-width": 2,
        "stroke-linecap": "round"
      })
    ]);
  }
});

// src/vue/components/TransitionControl.ts
function formatEase(ease) {
  return ease.map((value) => Number(value.toFixed(2))).join(", ");
}
function parseEase(value) {
  const parts = value.split(",").map((part) => Number.parseFloat(part.trim()));
  if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
    return parts;
  }
  return null;
}
var EaseTextInput = defineComponent19({
  name: "DialKitEaseTextInput",
  props: {
    ease: {
      type: Array,
      required: true
    },
    onChange: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const editing = ref17(false);
    const draft = ref17("");
    const handleFocus = () => {
      draft.value = formatEase(props.ease);
      editing.value = true;
    };
    const handleBlur = () => {
      const parsed = parseEase(draft.value);
      if (parsed) props.onChange(parsed);
      editing.value = false;
    };
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        event.target.blur();
      }
    };
    return () => h19("div", { class: "dialkit-labeled-control" }, [
      h19("span", { class: "dialkit-labeled-control-label" }, "Ease"),
      h19("input", {
        type: "text",
        class: "dialkit-text-input",
        value: editing.value ? draft.value : formatEase(props.ease),
        spellcheck: false,
        onInput: (event) => {
          draft.value = event.target.value;
        },
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeydown: handleKeydown
      })
    ]);
  }
});
var TransitionControl = defineComponent19({
  name: "DialKitTransitionControl",
  props: {
    panelId: { type: String, required: true },
    path: { type: String, required: true },
    label: { type: String, required: true },
    value: {
      type: Object,
      required: true
    },
    hideDuration: { type: Boolean, default: false },
    durationControl: Object
  },
  emits: ["change"],
  setup(props, { emit }) {
    const mode = ref17(DialStore.getTransitionMode(props.panelId, props.path));
    let unsub;
    onMounted14(() => {
      unsub = DialStore.subscribe(props.panelId, () => {
        mode.value = DialStore.getTransitionMode(props.panelId, props.path);
      });
    });
    onUnmounted8(() => unsub?.());
    const cache2 = {
      easing: props.value.type === "easing" ? { ...props.value } : { type: "easing", duration: 0.3, ease: [1, -0.4, 0.5, 1] },
      simple: props.value.type === "spring" && props.value.visualDuration !== void 0 ? { ...props.value } : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
      advanced: props.value.type === "spring" && props.value.stiffness !== void 0 ? { ...props.value } : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
    };
    const spring = () => {
      if (props.value.type === "spring") {
        if (mode.value === "simple") cache2.simple = props.value;
        else if (mode.value === "advanced") cache2.advanced = props.value;
        return props.value;
      }
      return cache2.simple;
    };
    const easing = () => {
      if (props.value.type === "easing") {
        cache2.easing = props.value;
        return props.value;
      }
      return cache2.easing;
    };
    const handleModeChange = (nextMode) => {
      DialStore.updateTransitionMode(props.panelId, props.path, nextMode);
      if (nextMode === "easing") {
        emit("change", cache2.easing);
      } else if (nextMode === "simple") {
        emit("change", cache2.simple);
      } else {
        emit("change", cache2.advanced);
      }
    };
    const updateEase = (index, value) => {
      const current = easing();
      const next = [...current.ease];
      next[index] = value;
      emit("change", { ...current, ease: next });
    };
    const handleSpringUpdate = (key, value) => {
      const current = spring();
      if (mode.value === "simple") {
        const { stiffness, damping, mass, ...rest } = current;
        emit("change", { ...rest, [key]: value });
      } else {
        const { visualDuration, bounce, ...rest } = current;
        emit("change", { ...rest, [key]: value });
      }
    };
    return () => {
      const isEasing = mode.value === "easing";
      const isSimpleSpring = mode.value === "simple";
      const currentSpring = spring();
      const currentEasing = easing();
      const durationSlider = !props.hideDuration && (isEasing || isSimpleSpring) ? h19(Slider, {
        label: "Duration",
        value: props.durationControl?.value ?? (isEasing ? currentEasing.duration : currentSpring.visualDuration ?? 0.3),
        min: props.durationControl?.min ?? 0.1,
        max: props.durationControl?.max ?? (isEasing ? 2 : 1),
        step: props.durationControl?.step ?? 0.05,
        unit: "s",
        onChange: props.durationControl?.onChange ?? ((next) => {
          if (isEasing) emit("change", { ...currentEasing, duration: next });
          else handleSpringUpdate("visualDuration", next);
        })
      }) : null;
      return h19(Folder, { title: props.label, defaultOpen: true }, {
        default: () => [
          h19("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, [
            isEasing ? h19(EasingVisualization, { easing: currentEasing }) : h19(SpringVisualization, { spring: currentSpring, isSimpleMode: isSimpleSpring }),
            h19("div", { class: "dialkit-labeled-control" }, [
              h19("span", { class: "dialkit-labeled-control-label" }, "Type"),
              h19(SegmentedControl, {
                options: [
                  { value: "easing", label: "Easing" },
                  { value: "simple", label: "Time" },
                  { value: "advanced", label: "Physics" }
                ],
                value: mode.value,
                onChange: handleModeChange
              })
            ]),
            ...isEasing ? [
              h19(Slider, { label: "x1", value: currentEasing.ease[0], min: 0, max: 1, step: 0.01, onChange: (next) => updateEase(0, next) }),
              h19(Slider, { label: "y1", value: currentEasing.ease[1], min: -1, max: 2, step: 0.01, onChange: (next) => updateEase(1, next) }),
              h19(Slider, { label: "x2", value: currentEasing.ease[2], min: 0, max: 1, step: 0.01, onChange: (next) => updateEase(2, next) }),
              h19(Slider, { label: "y2", value: currentEasing.ease[3], min: -1, max: 2, step: 0.01, onChange: (next) => updateEase(3, next) }),
              h19(EaseTextInput, {
                ease: currentEasing.ease,
                onChange: (next) => emit("change", { ...currentEasing, ease: next })
              })
            ] : isSimpleSpring ? [
              h19(Slider, {
                label: "Bounce",
                value: currentSpring.bounce ?? 0.2,
                min: 0,
                max: 1,
                step: 0.05,
                onChange: (next) => handleSpringUpdate("bounce", next)
              })
            ] : [
              h19(Slider, {
                label: "Stiffness",
                value: currentSpring.stiffness ?? 400,
                min: 1,
                max: 1e3,
                step: 10,
                onChange: (next) => handleSpringUpdate("stiffness", next)
              }),
              h19(Slider, {
                label: "Damping",
                value: currentSpring.damping ?? 17,
                min: 1,
                max: 100,
                step: 1,
                onChange: (next) => handleSpringUpdate("damping", next)
              }),
              h19(Slider, {
                label: "Mass",
                value: currentSpring.mass ?? 1,
                min: 0.1,
                max: 10,
                step: 0.1,
                onChange: (next) => handleSpringUpdate("mass", next)
              })
            ],
            durationSlider
          ])
        ]
      });
    };
  }
});

// src/vue/components/XYControl.ts
import { defineComponent as defineComponent21, h as h21 } from "vue";

// src/vue/components/XYPad.ts
import { computed as computed9, defineComponent as defineComponent20, h as h20, ref as ref18 } from "vue";
var DEFAULT_GRID_X = 5;
var DEFAULT_GRID_Y = 5;
var FINE_DRAG = 0.15;
function decimalsForStep3(step) {
  const s = step.toString();
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}
function formatComponent(v, axis) {
  return (v + 0).toFixed(decimalsForStep3(axis.step));
}
var XYPad = defineComponent20({
  name: "DialKitXYPad",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true },
    /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
    x: { type: Object, default: void 0 },
    /** Vertical axis, Cartesian (top = max). Same defaults as x. */
    y: { type: Object, default: void 0 },
    /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
    size: { type: Number, default: 160 },
    /**
     * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
     * faint at rest and stronger on interaction. Pass `false` to hide it, or a
     * number for a uniform N×N count. `density` multiplies whichever grid applies.
     */
    grid: { type: [Boolean, Number], default: void 0 },
    /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density: { type: Number, default: 1 },
    /** Snap the emitted value to each axis's step. Default false (continuous). */
    snap: { type: Boolean, default: false },
    /** Spring back to centre on release (joystick). Default false = hold. */
    returnToCenter: { type: Boolean, default: false },
    /** Show the live value next to each axis label (default false = label only). */
    showValues: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Override the readout / aria-valuetext text. Owns the full string. */
    formatValue: { type: Function, default: void 0 },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const xAxis = computed9(() => resolveAxis(props.x));
    const yAxis = computed9(() => resolveAxis(props.y));
    const areaRef = ref18(null);
    let dragging = false;
    const active = ref18(false);
    const draggingState = ref18(false);
    const pointToValue = (clientX, clientY, fine) => {
      const el = areaRef.value;
      if (!el) return props.value;
      const rect = el.getBoundingClientRect();
      const xa = xAxis.value;
      const ya = yAxis.value;
      let px = (clientX - rect.left) / rect.width;
      let py = (clientY - rect.top) / rect.height;
      if (fine) {
        const cur = pointFromValue(props.value, xa, ya);
        px = cur.x + (px - cur.x) * FINE_DRAG;
        py = cur.y + (py - cur.y) * FINE_DRAG;
      }
      px = Math.min(1, Math.max(0, px));
      py = Math.min(1, Math.max(0, py));
      const next = valueFromPoint({ x: px, y: py }, xa, ya, props.snap);
      const originPoint = pointFromValue({ x: xa.origin, y: ya.origin }, xa, ya);
      const dxPx = Math.abs(px - originPoint.x) * rect.width;
      const dyPx = Math.abs(py - originPoint.y) * rect.height;
      return {
        x: applyDetentAxis(next.x, xa, dxPx),
        y: applyDetentAxis(next.y, ya, dyPx)
      };
    };
    const emitValue = (next) => {
      emit("change", next);
    };
    const handlePointerDown = (e) => {
      if (props.disabled) return;
      if (e.button !== 0 || !e.isPrimary) return;
      if (e.altKey) return;
      e.preventDefault();
      try {
        areaRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      areaRef.value?.focus();
      dragging = true;
      active.value = true;
      draggingState.value = true;
      emitValue(pointToValue(e.clientX, e.clientY, e.shiftKey));
    };
    const handlePointerMove = (e) => {
      if (!dragging) return;
      if (e.buttons === 0) {
        finishDrag(e);
        return;
      }
      emitValue(pointToValue(e.clientX, e.clientY, e.shiftKey));
    };
    const finishDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      draggingState.value = false;
      try {
        areaRef.value?.releasePointerCapture(e.pointerId);
      } catch {
      }
      const el = areaRef.value;
      const stillActive = (el?.matches(":hover") ?? false) || el === (el?.ownerDocument ?? document).activeElement;
      if (!stillActive) active.value = false;
      if (props.returnToCenter) {
        emitValue(normalizeValue(centerValue(xAxis.value, yAxis.value), xAxis.value, yAxis.value, props.snap));
      }
    };
    const handleKeyDown = (e) => {
      if (props.disabled) return;
      const mode = e.shiftKey ? "coarse" : e.altKey ? "fine" : "normal";
      const cur = props.value;
      const xa = xAxis.value;
      const ya = yAxis.value;
      const ctrl = e.ctrlKey || e.metaKey;
      let next = null;
      switch (e.key) {
        case "ArrowUp":
          next = nudge(cur, "y", 1, xa, ya, mode);
          break;
        case "ArrowDown":
          next = nudge(cur, "y", -1, xa, ya, mode);
          break;
        case "ArrowRight":
          next = nudge(cur, "x", 1, xa, ya, mode);
          break;
        case "ArrowLeft":
          next = nudge(cur, "x", -1, xa, ya, mode);
          break;
        case "PageUp":
          next = nudge(cur, "y", 1, xa, ya, "coarse");
          break;
        case "PageDown":
          next = nudge(cur, "y", -1, xa, ya, "coarse");
          break;
        case "Home":
          next = ctrl ? { x: xa.min, y: ya.min } : { x: xa.min, y: cur.y };
          break;
        case "End":
          next = ctrl ? { x: xa.max, y: ya.max } : { x: xa.max, y: cur.y };
          break;
        default:
          return;
      }
      e.preventDefault();
      emitValue(next);
    };
    const reset = () => {
      if (props.disabled) return;
      emitValue(normalizeValue(centerValue(xAxis.value, yAxis.value), xAxis.value, yAxis.value, props.snap));
    };
    return () => {
      const xa = xAxis.value;
      const ya = yAxis.value;
      const value = props.value;
      const xLabel = props.x?.label ?? "X";
      const yLabel = props.y?.label ?? "Y";
      const xText = `${xLabel} ${formatComponent(value.x, xa)}`;
      const yText = `${yLabel} ${formatComponent(value.y, ya)}`;
      const xVisual = props.showValues ? xText : xLabel;
      const yVisual = props.showValues ? yText : yLabel;
      const readout = props.formatValue ? props.formatValue(value) : `${xText}  ${yText}`;
      const dens = typeof props.density === "number" && props.density > 0 ? props.density : 1;
      let baseX, baseY;
      if (props.grid === false) {
        baseX = 0;
        baseY = 0;
      } else if (typeof props.grid === "number") {
        baseX = props.grid;
        baseY = props.grid;
      } else {
        baseX = DEFAULT_GRID_X;
        baseY = DEFAULT_GRID_Y;
      }
      const gridX = baseX > 0 ? Math.round(baseX * dens) : 0;
      const gridY = baseY > 0 ? Math.round(baseY * dens) : 0;
      const showGrid = gridX > 0 && gridY > 0;
      const point = pointFromValue(value, xa, ya);
      const leftPct = `${point.x * 100}%`;
      const topPct = `${point.y * 100}%`;
      return h20("div", {
        class: "dialkit-xy",
        "data-active": String(active.value),
        "data-disabled": String(props.disabled)
      }, [
        h20("div", { class: "dialkit-xy-header" }, [
          h20("span", { class: "dialkit-xy-label" }, [
            props.label,
            props.shortcut ? h20("span", {
              class: `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`
            }, formatSliderShortcut(props.shortcut)) : null
          ])
        ]),
        h20("div", {
          ref: areaRef,
          class: "dialkit-xy-area",
          // Only the height is fixed (from `size`); width is fluid (CSS width:100%),
          // so the pad grows to fill the container and is no longer forced square.
          style: { height: `${props.size}px` },
          role: "application",
          "aria-roledescription": "2D pad",
          "aria-label": props.label,
          "aria-valuetext": readout,
          "aria-valuemin": xa.min,
          "aria-valuemax": xa.max,
          "aria-valuenow": value.x,
          "aria-disabled": props.disabled || void 0,
          tabindex: props.disabled ? -1 : 0,
          "data-active": String(active.value),
          "data-dragging": String(draggingState.value),
          "data-disabled": String(props.disabled),
          onPointerdown: handlePointerDown,
          onPointermove: handlePointerMove,
          onPointerup: finishDrag,
          onPointercancel: finishDrag,
          onDblclick: reset,
          onClick: (e) => {
            if (e.altKey) reset();
          },
          onKeydown: handleKeyDown,
          onFocus: () => {
            active.value = true;
          },
          onBlur: () => {
            active.value = false;
          },
          onPointerenter: () => {
            active.value = true;
          },
          onPointerleave: () => {
            if (!dragging) active.value = false;
          }
        }, [
          showGrid ? h20("div", {
            class: "dialkit-xy-grid",
            "aria-hidden": "true",
            style: {
              "--dial-xy-grid-step-x": `${100 / gridX}%`,
              "--dial-xy-grid-step-y": `${100 / gridY}%`
            }
          }) : null,
          // Live axis labels, decorative (aria-valuetext owns the accessible string):
          // X along the bottom edge, Y up the left edge.
          h20("div", { class: "dialkit-xy-axis dialkit-xy-axis-x", "aria-hidden": "true" }, xVisual),
          h20("div", { class: "dialkit-xy-axis dialkit-xy-axis-y", "aria-hidden": "true" }, yVisual),
          // Crosshair guides tracking the thumb, revealed on data-active.
          h20("div", { class: "dialkit-xy-guide dialkit-xy-guide-v", "aria-hidden": "true", style: { left: leftPct } }),
          h20("div", { class: "dialkit-xy-guide dialkit-xy-guide-h", "aria-hidden": "true", style: { top: topPct } }),
          h20("div", { class: "dialkit-xy-thumb", "aria-hidden": "true", style: { left: leftPct, top: topPct } })
        ])
      ]);
    };
  }
});

// src/vue/components/XYControl.ts
var XYControl = defineComponent21({
  name: "DialKitXYControl",
  props: {
    label: { type: String, required: true },
    value: { type: Object, required: true },
    x: { type: Object, default: void 0 },
    y: { type: Object, default: void 0 },
    grid: { type: [Boolean, Number], default: void 0 },
    density: { type: Number, default: void 0 },
    snap: { type: Boolean, default: void 0 },
    returnToCenter: { type: Boolean, default: void 0 },
    showValues: { type: Boolean, default: void 0 },
    shortcut: { type: Object, default: void 0 },
    shortcutActive: { type: Boolean, default: false }
  },
  emits: ["change"],
  setup(props, { emit }) {
    return () => h21(XYPad, {
      label: props.label,
      value: props.value,
      x: props.x,
      y: props.y,
      grid: props.grid,
      density: props.density,
      snap: props.snap,
      returnToCenter: props.returnToCenter,
      showValues: props.showValues,
      shortcut: props.shortcut,
      shortcutActive: props.shortcutActive,
      onChange: (next) => emit("change", next)
    });
  }
});

// src/vue/components/ControlRenderer.ts
var ControlRenderer = defineComponent22({
  name: "DialKitControlRenderer",
  props: {
    panelId: { type: String, required: true },
    controls: { type: Array, required: true },
    values: { type: Object, required: true },
    transitionDuration: Object
  },
  setup(props) {
    const shortcut = inject2(ShortcutKey, void 0);
    const isShortcutActive = (path) => shortcut?.activePanelId.value === props.panelId && shortcut.activePath.value === path;
    const hintId = (control) => hintDomId(props.panelId, control.path);
    const renderControlNode = (control) => {
      const value = props.values[control.path];
      switch (control.type) {
        case "slider":
          return h22(Slider, {
            key: control.path,
            label: control.label,
            value,
            min: control.min,
            max: control.max,
            step: control.step,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "range":
          return h22(RangeSlider, {
            key: control.path,
            label: control.label,
            value,
            min: control.min ?? 0,
            max: control.max ?? 1,
            step: control.step,
            defaultValue: control.rangeDefault,
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "toggle":
          return h22(Toggle, {
            key: control.path,
            label: control.label,
            checked: value,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "spring":
          return h22(SpringControl, {
            key: control.path,
            panelId: props.panelId,
            path: control.path,
            label: control.label,
            spring: value,
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "transition":
          return h22(TransitionControl, {
            key: control.path,
            panelId: props.panelId,
            path: control.path,
            label: control.label,
            value,
            durationControl: props.transitionDuration,
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "folder":
          if (control.module) {
            const enabledPath = `${control.path}._enabled`;
            return h22(ModuleFolder, {
              key: control.path,
              title: control.label,
              enabled: props.values[enabledPath],
              onEnabledChange: (next) => DialStore.updateValue(props.panelId, enabledPath, next),
              defaultOpen: control.defaultOpen ?? true,
              hint: control.hint,
              hintId: hintId(control)
            }, { default: () => (control.children ?? []).map(renderControl) });
          }
          return h22(Folder, {
            key: control.path,
            title: control.label,
            defaultOpen: control.defaultOpen ?? true,
            collapsible: control.collapsible ?? true,
            hint: control.hint,
            hintId: hintId(control)
          }, { default: () => (control.children ?? []).map(renderControl) });
        case "text":
          return h22(TextControl, {
            key: control.path,
            label: control.label,
            value,
            placeholder: control.placeholder,
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "select":
          return h22(SelectControl, {
            key: control.path,
            label: control.label,
            value,
            options: control.options ?? [],
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "color":
          return h22(ColorControl, {
            key: control.path,
            label: control.label,
            value,
            alpha: control.alpha,
            palette: control.palette,
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "gradient":
          return h22(GradientControl, {
            key: control.path,
            label: control.label,
            value,
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "xy":
          return h22(XYControl, {
            key: control.path,
            label: control.label,
            value,
            x: control.xAxis,
            y: control.yAxis,
            grid: control.grid,
            density: control.density,
            snap: control.snap,
            returnToCenter: control.returnToCenter,
            showValues: control.showValues,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
          });
        case "action":
          return h22("button", {
            key: control.path,
            class: "dialkit-button",
            // The wrapper greys every control out, but only a real `disabled`
            // takes a button out of the tab order too.
            disabled: DialStore.isDisabled(props.panelId, control.path),
            onClick: () => DialStore.triggerAction(props.panelId, control.path)
          }, control.label);
        default:
          return null;
      }
    };
    const renderControl = (control) => {
      const node = renderControlNode(control);
      if (control.type === "folder") return node;
      return h22(ControlShell, {
        key: control.path,
        hint: control.hint,
        title: control.path,
        id: hintId(control),
        affordance: control.affordance,
        panelId: props.panelId,
        path: control.path
      }, { default: () => node });
    };
    return () => h22(Fragment, null, props.controls.map(renderControl));
  }
});

// src/vue/components/PresetManager.ts
import { Teleport as Teleport5, defineComponent as defineComponent23, h as h23, ref as ref19, watch as watch10 } from "vue";
import { AnimatePresence as AnimatePresence5, motion as motion5 } from "motion-v";
var PresetManager = defineComponent23({
  name: "DialKitPresetManager",
  props: {
    panelId: { type: String, required: true },
    presets: {
      type: Array,
      required: true
    },
    activePresetId: {
      type: String,
      required: false,
      default: null
    },
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode: { type: Boolean, default: false }
  },
  setup(props) {
    const isOpen = ref19(false);
    const pos = ref19({ top: 0, left: 0, width: 0 });
    const triggerRef = ref19(null);
    const dropdownRef = ref19(null);
    const hasPresets = () => props.presets.length > 0;
    const activePreset = () => props.presets.find((preset) => preset.id === props.activePresetId);
    const open = () => {
      if (!hasPresets()) return;
      const rect = triggerRef.value?.getBoundingClientRect();
      if (rect) {
        pos.value = { top: rect.bottom + 4, left: rect.left, width: rect.width };
      }
      isOpen.value = true;
    };
    const close = () => {
      isOpen.value = false;
    };
    const setDropdownRef = (node) => {
      if (node instanceof HTMLElement) {
        dropdownRef.value = node;
        return;
      }
      if (node && typeof node === "object" && "$el" in node) {
        const el = node.$el;
        dropdownRef.value = el instanceof HTMLElement ? el : null;
        return;
      }
      dropdownRef.value = null;
    };
    const toggle = () => {
      if (isOpen.value) close();
      else open();
    };
    watch10(isOpen, (open2, _, onCleanup) => {
      if (!open2) return;
      const handler = (event) => {
        const target = event.target;
        if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
        close();
      };
      document.addEventListener("mousedown", handler);
      onCleanup(() => {
        document.removeEventListener("mousedown", handler);
      });
    });
    const handleSelect = (presetId) => {
      DialStore.selectPreset(props.panelId, presetId);
      close();
    };
    const handleDelete = (event, presetId) => {
      event.stopPropagation();
      DialStore.removePreset(props.panelId, presetId);
    };
    return () => h23("div", { class: "dialkit-preset-manager" }, [
      h23("button", {
        ref: triggerRef,
        class: "dialkit-preset-trigger",
        onClick: toggle,
        "data-open": String(isOpen.value),
        "data-has-preset": String(!!activePreset()),
        "data-disabled": String(!hasPresets())
      }, [
        h23("span", { class: "dialkit-preset-label" }, activePreset()?.name ?? (props.providerMode ? "Presets" : "Version 1")),
        h23(motion5.svg, {
          class: "dialkit-select-chevron",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          animate: { rotate: isOpen.value ? 180 : 0, opacity: hasPresets() ? 0.6 : 0.25 },
          transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 }
        }, [h23("path", { d: ICON_CHEVRON })])
      ]),
      h23(Teleport5, { to: "body" }, [
        h23(AnimatePresence5, null, {
          default: () => isOpen.value ? [h23(motion5.div, {
            key: "dialkit-preset-dropdown",
            ref: setDropdownRef,
            class: "dialkit-root dialkit-preset-dropdown",
            style: {
              position: "fixed",
              top: `${pos.value.top}px`,
              left: `${pos.value.left}px`,
              minWidth: `${pos.value.width}px`
            },
            initial: { opacity: 0, y: 4, scale: 0.97 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0 }
          }, [
            ...props.providerMode ? [] : [h23("div", {
              class: "dialkit-preset-item",
              "data-active": String(!props.activePresetId),
              onClick: () => handleSelect(null)
            }, [h23("span", { class: "dialkit-preset-name" }, "Version 1")])],
            ...props.presets.map((preset) => h23("div", {
              key: preset.id,
              class: "dialkit-preset-item",
              "data-active": String(preset.id === props.activePresetId),
              onClick: () => handleSelect(preset.id)
            }, [
              h23("span", { class: "dialkit-preset-name" }, preset.name),
              ...preset.deletable ?? true ? [h23("button", {
                class: "dialkit-preset-delete",
                onClick: (event) => handleDelete(event, preset.id),
                title: "Delete preset"
              }, [
                h23("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, ICON_TRASH.map((d) => h23("path", { d })))
              ])] : []
            ]))
          ])] : []
        })
      ])
    ]);
  }
});

// src/vue/components/Panel.ts
var Panel = defineComponent24({
  name: "DialKitPanel",
  props: {
    panel: {
      type: Object,
      required: true
    },
    defaultOpen: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    },
    // Extra toolbar node injected after the built-in preset/copy controls —
    // used to surface the timeline visibility toggle in the panel header.
    toolbarExtra: Function
  },
  setup(props) {
    const values = ref20(DialStore.getValues(props.panel.id));
    const presets = ref20(DialStore.getPresetItems(props.panel.id));
    const activePresetId = ref20(DialStore.getActivePresetId(props.panel.id));
    const providerMode = ref20(DialStore.hasPresetProvider(props.panel.id));
    const copied = ref20(false);
    let unsubscribe;
    let copiedTimeout = null;
    onMounted15(() => {
      unsubscribe = DialStore.subscribe(props.panel.id, () => {
        values.value = DialStore.getValues(props.panel.id);
        presets.value = DialStore.getPresetItems(props.panel.id);
        activePresetId.value = DialStore.getActivePresetId(props.panel.id);
        providerMode.value = DialStore.hasPresetProvider(props.panel.id);
      });
    });
    onUnmounted9(() => {
      unsubscribe?.();
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
    });
    const handleAddPreset = () => DialStore.createPreset(props.panel.id);
    const handleCopy = () => {
      const json = JSON.stringify(values.value, null, 2);
      const instruction = `Update the useDialKit configuration for "${props.panel.name}" with these values:

\`\`\`json
${json}
\`\`\`

Apply these values as the new defaults in the useDialKit call.`;
      try {
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(instruction).catch(() => void 0);
        }
      } catch {
      }
      copied.value = true;
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
      copiedTimeout = window.setTimeout(() => {
        copied.value = false;
      }, 1500);
    };
    return () => {
      const toolbarNode = h24(Fragment2, null, [
        h24(motion6.button, {
          class: "dialkit-toolbar-add",
          onClick: handleAddPreset,
          title: "Add preset",
          whilePress: { scale: 0.9 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 }
        }, [
          h24("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, ICON_ADD_PRESET.map((d) => h24("path", { d })))
        ]),
        h24(PresetManager, {
          panelId: props.panel.id,
          presets: presets.value,
          activePresetId: activePresetId.value,
          providerMode: providerMode.value
        }),
        h24(motion6.button, {
          class: "dialkit-toolbar-copy",
          onClick: handleCopy,
          title: "Copy parameters",
          whilePress: { scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 }
        }, [
          h24("span", { class: "dialkit-toolbar-copy-icon-wrap" }, [
            h24("span", {
              class: "dialkit-toolbar-copy-icon",
              style: { opacity: copied.value ? 0 : 1, transition: "opacity 120ms ease" }
            }, [
              h24("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                width: 16,
                height: 16
              }, [
                h24("path", {
                  d: ICON_CLIPBOARD.board,
                  stroke: "currentColor",
                  "stroke-width": 2,
                  "stroke-linejoin": "round"
                }),
                h24("path", {
                  d: ICON_CLIPBOARD.sparkle,
                  fill: "currentColor"
                }),
                h24("path", {
                  d: ICON_CLIPBOARD.body,
                  stroke: "currentColor",
                  "stroke-width": 2,
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ])
            ]),
            h24(AnimatePresence6, { initial: false, mode: "popLayout" }, {
              default: () => copied.value ? [h24(motion6.span, {
                key: "check",
                class: "dialkit-toolbar-copy-icon",
                initial: { scale: 0.5, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.5, opacity: 0 },
                transition: { type: "spring", visualDuration: 0.3, bounce: 0.2 }
              }, [
                h24("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": 2,
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  width: 16,
                  height: 16
                }, [h24("path", { d: ICON_CHECK })])
              ])] : []
            })
          ]),
          "Copy"
        ]),
        props.toolbarExtra?.()
      ]);
      return h24("div", { class: "dialkit-panel-wrapper" }, [
        h24(Folder, {
          title: props.panel.name,
          defaultOpen: props.defaultOpen,
          isRoot: true,
          inline: props.inline,
          toolbar: () => toolbarNode
        }, {
          default: () => [
            h24(ControlRenderer, {
              panelId: props.panel.id,
              controls: props.panel.controls,
              values: values.value
            })
          ]
        })
      ]);
    };
  }
});

// src/vue/components/Timeline/TimelineToggleButton.ts
import { defineComponent as defineComponent25, h as h25, onMounted as onMounted16, onUnmounted as onUnmounted10, ref as ref21 } from "vue";

// src/store/TimelineUiStore.ts
var TimelineUiStoreClass = class {
  constructor() {
    this.visible = true;
    this.initialized = false;
    this.controllers = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
  }
  getVisible() {
    for (const controller of this.controllers.values()) {
      if (controller.visible !== void 0) return controller.visible;
    }
    return this.visible;
  }
  registerController(id, controller) {
    const previous = this.getVisible();
    if (!this.initialized) {
      this.visible = controller.defaultVisible;
      this.initialized = true;
    }
    this.controllers.set(id, controller);
    if (previous !== this.getVisible()) this.notify();
    return () => {
      const before = this.getVisible();
      this.controllers.delete(id);
      if (this.controllers.size === 0) this.initialized = false;
      if (before !== this.getVisible()) this.notify();
    };
  }
  updateController(id, controller) {
    if (!this.controllers.has(id)) return;
    const previous = this.getVisible();
    this.controllers.set(id, controller);
    if (previous !== this.getVisible()) this.notify();
  }
  requestVisible(visible) {
    const current = this.getVisible();
    if (current === visible) return;
    const controlled = Array.from(this.controllers.values()).filter(
      (controller) => controller.visible !== void 0
    );
    if (controlled.length > 0) {
      controlled.forEach((controller) => controller.onVisibilityChange?.(visible));
      return;
    }
    this.visible = visible;
    this.controllers.forEach((controller) => controller.onVisibilityChange?.(visible));
    this.notify();
  }
  toggle() {
    this.requestVisible(!this.getVisible());
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  notify() {
    this.listeners.forEach((listener) => listener());
  }
};
var TimelineUiStore = /* @__PURE__ */ new TimelineUiStoreClass();

// src/vue/components/Timeline/TimelineToggleButton.ts
var TimelineToggleButton = defineComponent25({
  name: "DialKitTimelineToggleButton",
  setup() {
    const visible = ref21(TimelineUiStore.getVisible());
    let unsubscribe;
    onMounted16(() => {
      unsubscribe = TimelineUiStore.subscribe(() => {
        visible.value = TimelineUiStore.getVisible();
      });
    });
    onUnmounted10(() => unsubscribe?.());
    return () => {
      const label = visible.value ? "Hide timeline" : "Show timeline";
      return h25("button", {
        class: "dialkit-toolbar-add dialkit-timeline-toolbar-toggle",
        "data-active": visible.value || void 0,
        "aria-pressed": visible.value,
        "aria-label": label,
        title: label,
        onClick: () => TimelineUiStore.toggle()
      }, [
        h25(
          "svg",
          { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
          ICON_TIMELINE.map((path) => h25("path", { d: path, fill: "currentColor" }))
        )
      ]);
    };
  }
});

// src/vue/components/DialRoot.ts
var isDevDefault = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import.meta !== "undefined" && import.meta.env?.MODE ? import.meta.env.MODE !== "production" : true;
var DialRoot = defineComponent26({
  name: "DialKitDialRoot",
  props: {
    position: {
      type: String,
      default: "top-right"
    },
    defaultOpen: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: "popover"
    },
    theme: {
      type: String,
      default: "system"
    },
    productionEnabled: {
      type: Boolean,
      default: isDevDefault
    }
  },
  setup(props) {
    const panels = ref22([]);
    const timelines = ref22([]);
    const mounted = ref22(false);
    let unsubscribePanels;
    let unsubscribeTimelines;
    onMounted17(() => {
      mounted.value = true;
      panels.value = DialStore.getPanels("panel");
      timelines.value = TimelineStore.getTimelines();
      unsubscribePanels = DialStore.subscribeGlobal(() => {
        panels.value = DialStore.getPanels("panel");
      });
      unsubscribeTimelines = TimelineStore.subscribeGlobal(() => {
        timelines.value = TimelineStore.getTimelines();
      });
    });
    onUnmounted11(() => {
      unsubscribePanels?.();
      unsubscribeTimelines?.();
    });
    const timelineToggle = () => timelines.value.length > 0 ? h26(TimelineToggleButton) : null;
    const renderPanels = () => {
      if (panels.value.length === 0) {
        return [h26("div", { class: "dialkit-panel-wrapper" }, [
          h26(Folder, {
            title: "DialKit",
            defaultOpen: props.mode === "inline" || props.defaultOpen,
            isRoot: true,
            inline: props.mode === "inline",
            toolbar: () => h26(TimelineToggleButton)
          }, { default: () => [h26("div", { class: "dialkit-timeline-toolkit-only" }, "Timeline")] })
        ])];
      }
      return panels.value.map((panel) => h26(Panel, {
        key: panel.id,
        panel,
        defaultOpen: props.mode === "inline" || props.defaultOpen,
        inline: props.mode === "inline",
        toolbarExtra: timelineToggle
      }));
    };
    const renderContent = () => h26(ShortcutListener, null, {
      default: () => h26("div", { class: "dialkit-root", "data-mode": props.mode, "data-theme": props.theme }, [
        h26("div", {
          class: "dialkit-panel",
          "data-position": props.mode === "inline" ? void 0 : props.position,
          "data-mode": props.mode
        }, renderPanels())
      ])
    });
    return () => {
      if (!props.productionEnabled || !mounted.value || typeof window === "undefined" || panels.value.length === 0 && timelines.value.length === 0) {
        return null;
      }
      if (props.mode === "inline") {
        return renderContent();
      }
      return h26(Teleport6, { to: "body" }, renderContent());
    };
  }
});

// src/vue/directives/dialkit.ts
var states = /* @__PURE__ */ new WeakMap();
function normalizeDirectiveValue(value) {
  if (!value) return {};
  if (value === "inline" || value === "popover") {
    return { mode: value };
  }
  return value;
}
function mountDialRoot(el, value) {
  if (typeof window === "undefined") return;
  const host = document.createElement("div");
  el.appendChild(host);
  const props = shallowRef2(normalizeDirectiveValue(value));
  const RootHost = defineComponent27({
    name: "DialKitDirectiveHost",
    setup() {
      return () => h27(DialRoot, props.value);
    }
  });
  const app = createApp(RootHost);
  app.mount(host);
  states.set(el, { app, host, props });
}
function unmountDialRoot(el) {
  const state = states.get(el);
  if (!state) return;
  state.app.unmount();
  state.host.remove();
  states.delete(el);
}
var vDialKit = {
  mounted(el, binding) {
    mountDialRoot(el, binding.value);
  },
  updated(el, binding) {
    const state = states.get(el);
    if (!state) {
      mountDialRoot(el, binding.value);
      return;
    }
    state.props.value = normalizeDirectiveValue(binding.value);
  },
  beforeUnmount(el) {
    unmountDialRoot(el);
  }
};

// src/vue/useDialTimeline.ts
import { computed as computed10, onMounted as onMounted18, onUnmounted as onUnmounted12, shallowRef as shallowRef3, watch as watch11 } from "vue";

// src/transition-math.ts
function round22(value) {
  return Math.round(value * 100) / 100;
}
function clamp5(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function isTransitionConfig(value) {
  return isSpringConfigValue(value) || isEasingConfigValue(value);
}
function isPhysicsSpring(transition) {
  return transition.type === "spring" && (transition.stiffness !== void 0 || transition.damping !== void 0 || transition.mass !== void 0);
}
function springParams(spring) {
  if (isPhysicsSpring(spring)) {
    return { stiffness: spring.stiffness ?? 200, damping: spring.damping ?? 25, mass: spring.mass ?? 1 };
  }
  const visualDuration = Math.max(0.05, spring.visualDuration ?? 0.3);
  const bounce = spring.bounce ?? 0.3;
  const root = 2 * Math.PI / (visualDuration * 1.2);
  const stiffness = root * root;
  const damping = 2 * Math.min(1, Math.max(0.05, 1 - bounce)) * Math.sqrt(stiffness);
  return { stiffness, damping, mass: 1 };
}
function springProgress(t, { stiffness, damping, mass }) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 0.9999) {
    const wd2 = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd2 * t) + zeta * w0 / wd2 * Math.sin(wd2 * t));
  }
  if (zeta < 1.0001) {
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  }
  const wd = w0 * Math.sqrt(zeta * zeta - 1);
  const r1 = -zeta * w0 + wd;
  const r2 = -zeta * w0 - wd;
  return 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2);
}
function springSettleDuration(params) {
  const w0 = Math.sqrt(params.stiffness / params.mass);
  const zeta = params.damping / (2 * Math.sqrt(params.stiffness * params.mass));
  const decay = zeta >= 1 ? zeta * w0 - w0 * Math.sqrt(Math.max(0, zeta * zeta - 1)) : zeta * w0;
  const duration = Math.log(200) / Math.max(decay, 1e-6);
  return round22(clamp5(duration, 0.05, 10));
}
function cubicBezierProgress(p, [x1, y1, x2, y2]) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  const sampleX = (t2) => bezierAxis(t2, x1, x2);
  const sampleY = (t2) => bezierAxis(t2, y1, y2);
  let t = p;
  for (let i = 0; i < 8; i++) {
    const x = sampleX(t) - p;
    if (Math.abs(x) < 1e-5) return sampleY(t);
    const dx = bezierAxisDerivative(t, x1, x2);
    if (Math.abs(dx) < 1e-6) break;
    t -= x / dx;
  }
  let lo = 0;
  let hi = 1;
  t = p;
  while (hi - lo > 1e-5) {
    if (sampleX(t) < p) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return sampleY(t);
}
function bezierAxis(t, a1, a2) {
  return (1 - 3 * a2 + 3 * a1) * t * t * t + (3 * a2 - 6 * a1) * t * t + 3 * a1 * t;
}
function bezierAxisDerivative(t, a1, a2) {
  return 3 * (1 - 3 * a2 + 3 * a1) * t * t + 2 * (3 * a2 - 6 * a1) * t + 3 * a1;
}
function resolveClipTransition(raw, clipDuration) {
  const safeDuration = Math.max(0.05, clipDuration);
  if (raw.type === "easing") {
    return {
      transition: { ...raw, duration: safeDuration },
      duration: safeDuration,
      isPhysics: false
    };
  }
  if (isPhysicsSpring(raw)) {
    return {
      transition: raw,
      duration: springSettleDuration(springParams(raw)),
      isPhysics: true
    };
  }
  return {
    transition: { type: "spring", bounce: raw.bounce ?? 0.2, visualDuration: safeDuration },
    duration: safeDuration,
    isPhysics: false
  };
}

// src/timeline-core.ts
var CLIP_VALUE_STEP = 0.01;
var TIMELINE_MIN_CLIP_DURATION = 0.05;
var DEFAULT_STEP_DURATION = 0.3;
var DEFAULT_CLIP_TRANSITION = { type: "spring", bounce: 0.2 };
var RESERVED_KEYS = /* @__PURE__ */ new Set(["time", "playing", "duration", "play", "pause", "replay", "seek"]);
function isClipConfig(value) {
  return isPlainObject(value) && Number.isFinite(value.at);
}
function isGroupConfig(value) {
  if (!isPlainObject(value) || "at" in value) return false;
  const entries = Object.values(value);
  return entries.length > 0 && entries.some(isClipConfig);
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function nonNegativeFinite(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;
}
function animatedDuration(value, fallback = DEFAULT_STEP_DURATION) {
  return Math.max(TIMELINE_MIN_CLIP_DURATION, nonNegativeFinite(value, fallback));
}
function transitionDefaultDuration(transition) {
  if (transition.type === "easing") return animatedDuration(transition.duration);
  if (isPhysicsSpring(transition)) {
    return animatedDuration(springSettleDuration(springParams(transition)));
  }
  if (transition.visualDuration !== void 0) return animatedDuration(transition.visualDuration);
  return animatedDuration(springSettleDuration(springParams(transition)));
}
function defaultStepDuration(step, inheritedTransition) {
  const curve = step.transition ?? inheritedTransition;
  if (curve && isPhysicsSpring(curve)) return transitionDefaultDuration(curve);
  if (step.duration !== void 0) return animatedDuration(step.duration);
  if (step.transition) return transitionDefaultDuration(step.transition);
  return DEFAULT_STEP_DURATION;
}
function defaultTrackDuration(track, inheritedTransition) {
  const curve = track.transition ?? inheritedTransition;
  if (track.steps?.length) {
    return track.steps.reduce((sum, step) => sum + defaultStepDuration(step, curve), 0);
  }
  if (curve && isPhysicsSpring(curve)) return transitionDefaultDuration(curve);
  if (track.duration !== void 0) return animatedDuration(track.duration);
  if (track.transition) return transitionDefaultDuration(track.transition);
  return DEFAULT_STEP_DURATION;
}
function defaultClipDuration(clip) {
  const defaultCurve = isTransitionConfig(clip.transition) ? clip.transition : DEFAULT_CLIP_TRANSITION;
  if (clip.props) {
    return Object.values(clip.props).reduce(
      (max, track) => Math.max(
        max,
        nonNegativeFinite(track.delay) + defaultTrackDuration(track, defaultCurve)
      ),
      0
    );
  }
  if (clip.steps?.length) {
    return clip.steps.reduce((sum, step) => sum + defaultStepDuration(step, defaultCurve), 0);
  }
  const animating = Boolean(clip.transition || clip.from || clip.to);
  if (!animating) return nonNegativeFinite(clip.duration);
  if (isPhysicsSpring(defaultCurve)) return transitionDefaultDuration(defaultCurve);
  if (clip.duration !== void 0) return animatedDuration(clip.duration);
  if (isTransitionConfig(clip.transition)) return transitionDefaultDuration(clip.transition);
  return clip.from || clip.to ? transitionDefaultDuration(DEFAULT_CLIP_TRANSITION) : 0;
}
function normalizeLoopMode(value) {
  if (value === true || value === "mirror" || value === "repeat") return "repeat";
  return "off";
}
function normalizeStoredTransition(transition, clipDuration) {
  if (transition.type === "easing") {
    return { ...transition, duration: clipDuration };
  }
  if (isPhysicsSpring(transition)) {
    return transition;
  }
  return { type: "spring", bounce: transition.bounce ?? 0.2 };
}
function collectClipEntries(config) {
  const entries = [];
  for (const [key, value] of Object.entries(config)) {
    if (key === "duration") continue;
    if (RESERVED_KEYS.has(key)) {
      console.warn(`[dialkit] Timeline key "${key}" collides with a reserved key and was skipped.`);
      continue;
    }
    if (isClipConfig(value)) {
      entries.push({ path: key, childKey: key, clip: value });
    } else if (isGroupConfig(value)) {
      for (const [childKey, childClip] of Object.entries(value)) {
        if (isClipConfig(childClip)) {
          entries.push({ path: `${key}.${childKey}`, childKey, group: key, clip: childClip });
        } else {
          console.warn(
            `[dialkit] Timeline clip "${key}.${childKey}" is missing a numeric "at" and was skipped.`
          );
        }
      }
    } else {
      console.warn(
        `[dialkit] Timeline entry "${key}" is neither a clip (needs a numeric "at") nor a group of clips and was skipped.`
      );
    }
  }
  return entries;
}
function definedValues(values) {
  if (!values) return void 0;
  const result = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== void 0) result[key] = value;
  }
  return result;
}
function setDialPath(dialConfig, path, value) {
  const segments = path.split(".");
  let node = dialConfig;
  for (const segment of segments.slice(0, -1)) {
    node = node[segment] ?? (node[segment] = {});
  }
  node[segments[segments.length - 1]] = value;
}
function parseTimelineConfig(config) {
  const entries = collectClipEntries(config);
  let maxEnd = 0;
  for (const { clip } of entries) {
    maxEnd = Math.max(maxEnd, nonNegativeFinite(clip.at) + defaultClipDuration(clip));
  }
  const duration = typeof config.duration === "number" && Number.isFinite(config.duration) && config.duration > 0 ? config.duration : maxEnd > 0 ? Math.ceil(maxEnd * 100 - 1e-4) / 100 : 1;
  const dialConfig = {};
  const clips = [];
  entries.forEach(({ path, childKey, group, clip }, index) => {
    const raw = clip;
    if (raw.props && (raw.steps?.length || raw.from || raw.to)) {
      console.warn(
        `[dialkit] Timeline clip "${path}": "props" is mutually exclusive with from/to/steps \u2014 using "props".`
      );
    } else if (raw.steps?.length && raw.to) {
      console.warn(
        `[dialkit] Timeline clip "${path}": "to" is ignored when "steps" is present \u2014 each leg's "to" defines its targets.`
      );
    }
    const hasSteps = Boolean(clip.steps?.length) && !clip.props;
    const hasProps = Boolean(clip.props);
    const single = isTransitionConfig(clip.transition) ? clip.transition : void 0;
    const total = defaultClipDuration(clip);
    const defaultCurve = single ?? DEFAULT_CLIP_TRANSITION;
    const clipAt = nonNegativeFinite(clip.at);
    const clipDial = {
      at: [clipAt, 0, duration, CLIP_VALUE_STEP]
    };
    if (!hasSteps && !hasProps) {
      clipDial.duration = [total, 0, duration, CLIP_VALUE_STEP];
    }
    if (!hasSteps && !hasProps && (clip.transition || clip.from || clip.to)) {
      clipDial.transition = normalizeStoredTransition(defaultCurve, total);
    }
    let tracks;
    if (clip.props) {
      tracks = [];
      for (const [prop, track] of Object.entries(clip.props)) {
        if (TRACK_RESERVED.has(prop) || /^step\d+$/.test(prop)) {
          console.warn(`[dialkit] Timeline property "${prop}" collides with a clip field and was skipped.`);
          continue;
        }
        const trackDuration = defaultTrackDuration(track, defaultCurve);
        const trackCurve = track.transition ?? defaultCurve;
        const hasTrackSteps = Boolean(track.steps?.length);
        const trackDial = {
          delay: [nonNegativeFinite(track.delay), 0, duration, CLIP_VALUE_STEP]
        };
        if (!hasTrackSteps) {
          trackDial.duration = [trackDuration, 0, duration, CLIP_VALUE_STEP];
          trackDial.transition = normalizeStoredTransition(trackCurve, trackDuration);
        }
        const fromValue = track.from ?? (hasTrackSteps ? void 0 : track.to);
        if (hasTrackSteps && fromValue === void 0) {
          console.warn(
            `[dialkit] Timeline clip "${path}": track "${prop}" has steps but no "from" \u2014 declare its starting value.`
          );
        }
        if (fromValue !== void 0) {
          trackDial.from = scalarDial(prop, fromValue, hasTrackSteps ? track.steps[0]?.to : track.to);
        }
        if (!hasTrackSteps && track.to !== void 0) {
          trackDial.to = scalarDial(prop, track.to, fromValue);
        }
        let trackStepKeys;
        if (hasTrackSteps) {
          trackStepKeys = [];
          let previous = fromValue;
          track.steps.forEach((step, stepIndex) => {
            const stepKey = `step${stepIndex + 1}`;
            trackStepKeys.push(stepKey);
            const stepDuration = defaultStepDuration(step, trackCurve);
            const stepDial = {
              duration: [stepDuration, 0, duration, CLIP_VALUE_STEP],
              transition: normalizeStoredTransition(step.transition ?? trackCurve, stepDuration)
            };
            if (step.to !== void 0) {
              stepDial.to = scalarDial(prop, step.to, previous);
              previous = step.to;
            }
            trackDial[stepKey] = stepDial;
          });
        }
        clipDial[prop] = trackDial;
        tracks.push({ prop, stepKeys: trackStepKeys });
      }
    }
    if (clip.from && !hasProps) {
      clipDial.from = withFromToRanges(
        clip.from,
        hasSteps ? definedValues(clip.steps[0]?.to) : clip.to
      );
    }
    if (!hasSteps && !hasProps && clip.to) {
      clipDial.to = withFromToRanges(clip.to, clip.from);
    }
    let stepKeys;
    if (hasSteps) {
      stepKeys = [];
      let running = clip.from;
      clip.steps.forEach((step, stepIndex) => {
        const stepKey = `step${stepIndex + 1}`;
        stepKeys.push(stepKey);
        const stepDuration = defaultStepDuration(step, defaultCurve);
        const stepDial = {
          duration: [stepDuration, 0, duration, CLIP_VALUE_STEP],
          transition: normalizeStoredTransition(step.transition ?? defaultCurve, stepDuration)
        };
        const stepTo = definedValues(step.to);
        if (stepTo) {
          for (const prop of Object.keys(stepTo)) {
            if (!running || !(prop in running)) {
              console.warn(
                `[dialkit] Timeline clip "${path}": property "${prop}" first animates in step ${stepIndex + 1} with no starting value \u2014 declare it in "from".`
              );
            }
          }
          stepDial.to = withFromToRanges(stepTo, running);
        }
        clipDial[stepKey] = stepDial;
        running = { ...running ?? {}, ...stepTo ?? {} };
      });
    }
    setDialPath(dialConfig, path, clipDial);
    clips.push({
      key: path,
      label: formatLabel(childKey),
      color: TIMELINE_CLIP_COLORS[index % TIMELINE_CLIP_COLORS.length],
      loop: normalizeLoopMode(clip.loop),
      group,
      stepKeys,
      tracks
    });
  });
  return { duration, dialConfig, clips };
}
var TRACK_RESERVED = /* @__PURE__ */ new Set(["at", "duration", "loop", "from", "to", "transition", "delay"]);
function scalarDial(prop, value, counterpart) {
  const record = withFromToRanges(
    { [prop]: value },
    counterpart === void 0 ? void 0 : { [prop]: counterpart }
  );
  return record[prop];
}
var FROM_TO_RANGE_PRESETS = [
  [/^(x|y|z|tx|ty|offsetx|offsety|translatex|translatey)$/i, { min: -100, max: 100, step: 1 }],
  [/rotat|angle|skew/i, { min: -180, max: 180, step: 1 }],
  [/^scale/i, { min: 0, max: 2, step: 0.01 }],
  [/opacity|alpha/i, { min: 0, max: 1, step: 0.01 }],
  [/blur|radius|spread/i, { min: 0, max: 100, step: 1 }]
];
function inferFromToRange(key, value, counterpart) {
  const lo = Math.min(value, counterpart ?? value);
  const hi = Math.max(value, counterpart ?? value);
  const preset = FROM_TO_RANGE_PRESETS.find(([pattern]) => pattern.test(key))?.[1];
  if (preset) {
    return [value, Math.min(preset.min, lo), Math.max(preset.max, hi), preset.step];
  }
  if (lo >= 0 && hi <= 1) {
    return [value, 0, 1, 0.01];
  }
  const extent = Math.max(Math.abs(lo), Math.abs(hi), 1);
  const min = lo < 0 ? -extent * 2 : 0;
  const max = Math.max(extent * 2, hi);
  return [value, min, max, inferStep(min, max)];
}
function withFromToRanges(config, counterpart) {
  const result = {};
  for (const [key, value] of Object.entries(config)) {
    const other = counterpart?.[key];
    if (typeof value === "number") {
      result[key] = inferFromToRange(key, value, typeof other === "number" ? other : void 0);
    } else if (isPlainObject(value) && !("type" in value)) {
      result[key] = withFromToRanges(
        value,
        isPlainObject(other) && !("type" in other) ? other : void 0
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}
function curveStatic(transition, duration) {
  if (!transition) return { duration };
  if (transition.type === "easing") return { duration, ease: transition.ease };
  const spring = springParams(transition);
  return { duration, spring, settle: springSettleDuration(spring) };
}
function sampleCurve(curve, elapsed) {
  if (elapsed <= 0) return 0;
  if (curve.spring) {
    if (curve.settle !== void 0 && elapsed >= curve.settle) return 1;
    return springProgress(elapsed, curve.spring);
  }
  if (curve.ease) {
    return cubicBezierProgress(clamp5(curve.duration > 0 ? elapsed / curve.duration : 1, 0, 1), curve.ease);
  }
  return curve.duration > 0 ? Math.min(1, elapsed / curve.duration) : 1;
}
function resolvedAtPath(resolved, path) {
  let node = resolved;
  for (const segment of path.split(".")) {
    node = isPlainObject(node) ? node[segment] : void 0;
  }
  return isPlainObject(node) ? node : {};
}
function computeStaticClips(parsed, flatValues) {
  const resolved = resolveDialValues(parsed.dialConfig, flatValues);
  return parsed.clips.map(
    (clip) => buildClipStatic(resolvedAtPath(resolved, clip.key), clip, parsed.duration)
  );
}
function computeStaticTimeline(parsed, flatValues) {
  let clips = computeStaticClips(parsed, flatValues);
  const maxEnd = clips.reduce(
    (end, clip) => Math.max(end, clip.at + clip.duration),
    parsed.duration
  );
  const duration = maxEnd > parsed.duration ? Math.ceil(maxEnd * 100 - 1e-4) / 100 : parsed.duration;
  if (duration !== parsed.duration) {
    clips = clips.map(
      (clip) => clip.loop === "repeat" ? { ...clip, end: duration } : clip
    );
  }
  return { duration, clips };
}
function computeClipStaticFromValues(values, clip, timelineDuration) {
  return buildClipStatic(unflattenClipValues(values, clip.key), clip, timelineDuration);
}
function buildClipStatic(clipResolved, clip, timelineDuration) {
  {
    const at = typeof clipResolved.at === "number" ? clipResolved.at : 0;
    const from = isPlainObject(clipResolved.from) ? clipResolved.from : void 0;
    const single = isTransitionConfig(clipResolved.transition) ? clipResolved.transition : void 0;
    const staticClip = {
      key: clip.key,
      childKey: clip.group ? clip.key.slice(clip.group.length + 1) : clip.key,
      group: clip.group,
      at,
      duration: 0,
      loop: "off",
      end: 0,
      isPhysics: false,
      from,
      tracks: [],
      explicitSteps: Boolean(clip.stepKeys?.length)
    };
    if (clip.tracks?.length) {
      const tracks = clip.tracks.map(({ prop, stepKeys }) => {
        const trackResolved = isPlainObject(clipResolved[prop]) ? clipResolved[prop] : {};
        const delay = typeof trackResolved.delay === "number" ? trackResolved.delay : 0;
        const fromValue = trackResolved.from;
        let steps;
        let trackDuration = 0;
        if (stepKeys?.length) {
          let running = fromValue;
          steps = stepKeys.map((stepKey) => {
            const stepResolved = isPlainObject(trackResolved[stepKey]) ? trackResolved[stepKey] : {};
            const storedDuration = typeof stepResolved.duration === "number" ? stepResolved.duration : 0;
            const raw = isTransitionConfig(stepResolved.transition) ? stepResolved.transition : void 0;
            const effective = raw ? resolveClipTransition(raw, storedDuration) : { transition: void 0, duration: storedDuration, isPhysics: false };
            const toValue = stepResolved.to;
            const step = {
              key: stepKey,
              offset: trackDuration,
              duration: effective.duration,
              isPhysics: effective.isPhysics,
              start: running === void 0 ? {} : { [prop]: running },
              to: toValue === void 0 ? {} : { [prop]: toValue },
              curve: curveStatic(effective.transition, effective.duration)
            };
            if (toValue !== void 0) running = toValue;
            trackDuration += effective.duration;
            return step;
          });
        } else {
          const storedDuration = typeof trackResolved.duration === "number" ? trackResolved.duration : 0;
          const raw = isTransitionConfig(trackResolved.transition) ? trackResolved.transition : void 0;
          const effective = raw ? resolveClipTransition(raw, storedDuration) : { transition: void 0, duration: storedDuration, isPhysics: false };
          const toValue = trackResolved.to;
          trackDuration = effective.duration;
          steps = [
            {
              key: null,
              offset: 0,
              duration: effective.duration,
              isPhysics: effective.isPhysics,
              start: fromValue === void 0 ? {} : { [prop]: fromValue },
              to: toValue === void 0 ? {} : { [prop]: toValue },
              curve: curveStatic(effective.transition, effective.duration)
            }
          ];
        }
        return { prop, delay, duration: trackDuration, steps };
      });
      staticClip.tracks = tracks;
      staticClip.props = tracks.map((track) => track.prop);
      staticClip.duration = tracks.reduce((max, track) => Math.max(max, track.delay + track.duration), 0);
      staticClip.from = Object.fromEntries(
        tracks.map((track) => [track.prop, track.steps[0].start[track.prop]])
      );
      staticClip.to = Object.fromEntries(
        tracks.map((track) => {
          const last = track.steps[track.steps.length - 1];
          return [track.prop, last.to[track.prop] ?? last.start[track.prop]];
        })
      );
      staticClip.loop = staticClip.duration > 0 ? clip.loop : "off";
      staticClip.end = staticClip.loop === "off" ? staticClip.at + staticClip.duration : timelineDuration;
      return staticClip;
    }
    if (clip.stepKeys?.length) {
      let running = { ...from ?? {} };
      let offset = 0;
      const steps = clip.stepKeys.map((stepKey) => {
        const stepResolved = isPlainObject(clipResolved[stepKey]) ? clipResolved[stepKey] : {};
        const storedDuration = typeof stepResolved.duration === "number" ? stepResolved.duration : 0;
        const raw = isTransitionConfig(stepResolved.transition) ? stepResolved.transition : void 0;
        const effective = raw ? resolveClipTransition(raw, storedDuration) : { transition: void 0, duration: storedDuration, isPhysics: false };
        const to = isPlainObject(stepResolved.to) ? stepResolved.to : {};
        const step = {
          key: stepKey,
          offset,
          duration: effective.duration,
          isPhysics: effective.isPhysics,
          start: running,
          to,
          curve: curveStatic(effective.transition, effective.duration)
        };
        running = { ...running, ...to };
        offset += effective.duration;
        return step;
      });
      staticClip.tracks = [{ delay: 0, duration: offset, steps }];
      staticClip.duration = offset;
      staticClip.to = running;
    } else {
      const storedDuration = typeof clipResolved.duration === "number" ? clipResolved.duration : 0;
      const to = isPlainObject(clipResolved.to) ? clipResolved.to : void 0;
      if (single) {
        const effective = resolveClipTransition(single, storedDuration);
        staticClip.duration = effective.duration;
        staticClip.isPhysics = effective.isPhysics;
        staticClip.transition = effective.transition;
        staticClip.css = transitionToCss(effective.transition);
        staticClip.to = to;
        if (from && to) {
          staticClip.tracks = [
            {
              delay: 0,
              duration: effective.duration,
              steps: [
                {
                  key: null,
                  offset: 0,
                  duration: effective.duration,
                  isPhysics: effective.isPhysics,
                  start: from,
                  to,
                  curve: curveStatic(effective.transition, effective.duration)
                }
              ]
            }
          ];
        }
      } else {
        staticClip.duration = storedDuration;
        staticClip.to = to;
        if (from && to) {
          const base = resolveClipTransition(DEFAULT_CLIP_TRANSITION, storedDuration);
          staticClip.duration = base.duration;
          staticClip.tracks = [
            {
              delay: 0,
              duration: base.duration,
              steps: [
                {
                  key: null,
                  offset: 0,
                  duration: base.duration,
                  isPhysics: false,
                  start: from,
                  to,
                  curve: curveStatic(base.transition, base.duration)
                }
              ]
            }
          ];
        }
      }
    }
    if (staticClip.tracks.length) {
      const props = new Set(Object.keys(from ?? {}));
      for (const track of staticClip.tracks) {
        for (const step of track.steps) {
          for (const prop of Object.keys(step.to)) props.add(prop);
        }
      }
      staticClip.props = Array.from(props);
    }
    staticClip.loop = staticClip.duration > 0 ? clip.loop : "off";
    staticClip.end = staticClip.loop === "off" ? staticClip.at + staticClip.duration : timelineDuration;
    return staticClip;
  }
}
function stepAtPosition(steps, pos) {
  for (const step of steps) {
    if (pos < step.offset + step.duration) return step;
  }
  return steps[steps.length - 1];
}
function evalPropAtPos(steps, prop, pos) {
  const step = stepAtPosition(steps, pos);
  const within = Math.max(0, pos - step.offset);
  if (prop in step.to) {
    const eased = sampleCurve(step.curve, within);
    return interpolateResolved(step.start[prop], step.to[prop], eased);
  }
  return step.start[prop];
}
function computeClipState(clip, time, cycleTime = time) {
  const total = clip.duration;
  const looping = clip.loop === "repeat" && total > 0;
  const started = time >= clip.at || looping && cycleTime > time;
  const done = time >= clip.end;
  const elapsed = time - clip.at;
  const phaseElapsed = looping ? cycleTime - clip.at : elapsed;
  const fold = (e) => looping ? e % total : e;
  const basePos = started ? fold(Math.max(0, phaseElapsed)) : 0;
  const progress = total > 0 ? clamp5(basePos / total, 0, 1) : started ? 1 : 0;
  let current;
  let stepIndex = 0;
  if (clip.tracks.length && clip.props?.length) {
    current = {};
    for (const track of clip.tracks) {
      const props = track.prop !== void 0 ? [track.prop] : clip.props;
      for (const prop of props) {
        const startValue = track.steps[0]?.start[prop];
        if (!started) {
          if (startValue !== void 0) current[prop] = startValue;
          continue;
        }
        const phase = phaseElapsed - track.delay;
        if (phase <= 0) {
          if (startValue !== void 0) current[prop] = startValue;
          continue;
        }
        const pos = looping && track.duration > 0 ? phase % track.duration : phase;
        const value = evalPropAtPos(track.steps, prop, pos);
        if (value !== void 0) current[prop] = value;
      }
    }
    const shared = clip.tracks[0];
    if (started && clip.explicitSteps && shared.prop === void 0) {
      stepIndex = shared.steps.indexOf(stepAtPosition(shared.steps, basePos));
    }
  }
  return {
    at: clip.at,
    duration: clip.duration,
    loop: clip.loop,
    started,
    active: started && !done,
    done,
    progress,
    step: clip.explicitSteps ? stepIndex : void 0,
    from: clip.from,
    to: clip.to,
    animate: started ? clip.to : clip.from,
    transition: clip.transition,
    css: clip.css,
    current
  };
}
function interpolateResolved(from, to, p) {
  if (typeof from === "number" && typeof to === "number") {
    return from + (to - from) * p;
  }
  if (typeof from === "string" && typeof to === "string") {
    const mixed = mixHexColors(from, to, p);
    if (mixed) return mixed;
  }
  if (isPlainObject(from) && isPlainObject(to)) {
    const result = {};
    for (const key of Object.keys(from)) {
      result[key] = key in to ? interpolateResolved(from[key], to[key], p) : from[key];
    }
    for (const key of Object.keys(to)) {
      if (!(key in from)) result[key] = to[key];
    }
    return result;
  }
  return p < 0.5 ? from : to;
}
function parseHex2(hex) {
  if (!isHexColor(hex)) return null;
  let h35 = hex.slice(1);
  if (h35.length === 3) h35 = h35.split("").map((c) => c + c).join("");
  return [
    parseInt(h35.slice(0, 2), 16),
    parseInt(h35.slice(2, 4), 16),
    parseInt(h35.slice(4, 6), 16),
    h35.length === 8 ? parseInt(h35.slice(6, 8), 16) : 255
  ];
}
function mixHexColors(a, b, p) {
  const ca = parseHex2(a);
  const cb = parseHex2(b);
  if (!ca || !cb) return null;
  const t = clamp5(p, 0, 1);
  const mixed = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  const hex = (n) => n.toString(16).padStart(2, "0");
  const rgb = `#${hex(mixed[0])}${hex(mixed[1])}${hex(mixed[2])}`;
  return mixed[3] === 255 ? rgb : `${rgb}${hex(mixed[3])}`;
}
function transitionToCss(transition) {
  if (!transition) return void 0;
  if (transition.type === "easing") {
    return {
      transitionDuration: `${round22(transition.duration)}s`,
      transitionTimingFunction: `cubic-bezier(${transition.ease.map((v) => round22(v)).join(", ")})`
    };
  }
  const params = springParams(transition);
  const dampingRatio = params.damping / (2 * Math.sqrt(params.stiffness * params.mass));
  const duration = transition.visualDuration ?? springSettleDuration(params);
  const bounce = transition.bounce ?? Math.max(0, round22(1 - dampingRatio));
  return {
    transitionDuration: `${round22(duration)}s`,
    transitionTimingFunction: bounce > 0.05 ? `cubic-bezier(0.34, ${round22(1.2 + bounce)}, 0.64, 1)` : "cubic-bezier(0.25, 0.6, 0.35, 1)"
  };
}
function timelinePopoverDisplayValues(values, clipKey, stepKeys, stepKey) {
  const display = { ...values };
  const swap = (path, duration) => {
    const raw = display[path];
    if (isTransitionConfig(raw)) display[path] = resolveClipTransition(raw, duration).transition;
  };
  if (stepKey) {
    swap(`${clipKey}.${stepKey}.transition`, numberValue(values[`${clipKey}.${stepKey}.duration`]));
    return display;
  }
  const cycle = stepKeys?.length ? stepKeys.reduce((sum, sk) => sum + numberValue(values[`${clipKey}.${sk}.duration`]), 0) : numberValue(values[`${clipKey}.duration`]);
  swap(`${clipKey}.transition`, cycle);
  return display;
}
function numberValue(value) {
  return typeof value === "number" ? value : 0;
}
function unflattenClipValues(values, clipKey) {
  const prefix = `${clipKey}.`;
  const result = {};
  const entries = Object.entries(values).filter(([path]) => path.startsWith(prefix)).map(([path, value]) => ({ segments: path.slice(prefix.length).split("."), value })).sort((a, b) => a.segments.length - b.segments.length);
  for (const { segments, value } of entries) {
    let node = result;
    for (let i = 0; i < segments.length - 1; i++) {
      const existing = node[segments[i]];
      node = isPlainObject(existing) ? existing : node[segments[i]] = {};
    }
    node[segments[segments.length - 1]] = cloneTimelineValue(value);
  }
  return result;
}
function cloneTimelineValue(value) {
  if (Array.isArray(value)) return value.map(cloneTimelineValue);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key, cloneTimelineValue(nested)])
  );
}
function clampTrackDelay(delay, at, trackDuration, timelineDuration) {
  return clamp5(round22(delay), 0, Math.max(0, round22(timelineDuration - at - trackDuration)));
}
function clampClipMove(at, duration, timelineDuration) {
  return clamp5(round22(at), 0, Math.max(0, timelineDuration - duration));
}
function clampClipResizeEnd(duration, at, timelineDuration) {
  return clamp5(round22(duration), TIMELINE_MIN_CLIP_DURATION, timelineDuration - at);
}
function clampClipResizeStart(newAt, at, duration) {
  const clampedAt = clamp5(round22(newAt), 0, at + duration - TIMELINE_MIN_CLIP_DURATION);
  return { at: clampedAt, duration: round22(at + duration - clampedAt) };
}
function clampStepResize(duration, at, otherStepsTotal, timelineDuration) {
  const max = Math.max(TIMELINE_MIN_CLIP_DURATION, timelineDuration - at - otherStepsTotal);
  return clamp5(round22(duration), TIMELINE_MIN_CLIP_DURATION, max);
}
function normalizeTimelineValuesForCopy(values, clips) {
  const normalized = { ...values };
  for (const path of Object.keys(normalized)) {
    if (path.endsWith(".__mode")) delete normalized[path];
  }
  const normalizeTransitionAt = (transitionPath, durationPath) => {
    const raw = normalized[transitionPath];
    if (!isTransitionConfig(raw)) return;
    if (isPhysicsSpring(raw)) {
      normalized[durationPath] = transitionDefaultDuration(raw);
    }
    normalized[transitionPath] = normalizeStoredTransition(
      raw,
      numberValue(normalized[durationPath])
    );
  };
  for (const clip of clips) {
    for (const stepKey of clip.stepKeys ?? []) {
      normalizeTransitionAt(
        `${clip.key}.${stepKey}.transition`,
        `${clip.key}.${stepKey}.duration`
      );
    }
    normalizeTransitionAt(`${clip.key}.transition`, `${clip.key}.duration`);
    for (const track of clip.tracks ?? []) {
      const trackKey = `${clip.key}.${track.prop}`;
      for (const stepKey of track.stepKeys ?? []) {
        normalizeTransitionAt(
          `${trackKey}.${stepKey}.transition`,
          `${trackKey}.${stepKey}.duration`
        );
      }
      normalizeTransitionAt(`${trackKey}.transition`, `${trackKey}.duration`);
      if (normalized[`${trackKey}.delay`] === 0) {
        delete normalized[`${trackKey}.delay`];
      }
    }
    delete normalized[`${clip.key}.loop`];
  }
  return normalized;
}
function formatClock(time, tenths = false) {
  const safe = Math.max(0, time);
  const minutes = Math.floor(safe / 60);
  const seconds = safe - minutes * 60;
  const secondsText = tenths ? seconds.toFixed(1).padStart(4, "0") : String(Math.floor(seconds)).padStart(2, "0");
  return `${String(minutes).padStart(2, "0")}:${secondsText}`;
}
function formatSeconds(value) {
  return `${round22(value)}s`;
}
function formatStepLabel(stepKey) {
  const match = /^step(\d+)$/.exec(stepKey);
  return match ? `Step ${match[1]}` : formatLabel(stepKey);
}

// src/timeline/adapter.ts
function resolveTimelineLoop(loop) {
  if (typeof loop === "object" && loop !== null) {
    return {
      enabled: true,
      start: Number.isFinite(loop.from) ? Math.max(0, loop.from) : 0
    };
  }
  return { enabled: Boolean(loop), start: 0 };
}
function buildTimelineMeta(id, name, duration, parsed, loop) {
  const resolvedLoop = resolveTimelineLoop(loop);
  return {
    id,
    name,
    duration,
    loop: resolvedLoop.enabled,
    loopStart: resolvedLoop.start,
    clips: parsed.clips
  };
}
function buildTimelineValues(staticClips, transport, timelineDuration, loopStart, loopEnd, actions) {
  var _a;
  const result = {
    time: transport.time,
    playing: transport.playing,
    duration: timelineDuration,
    ...actions
  };
  const span = loopSpan(transport.duration, loopStart, loopEnd);
  const cycleTime = (span > 0 ? transport.wraps * span : 0) + transport.time;
  for (const clip of staticClips) {
    const state = computeClipState(clip, transport.time, cycleTime);
    if (clip.group) {
      const bucket = result[_a = clip.group] ?? (result[_a] = {});
      bucket[clip.childKey] = state;
    } else {
      result[clip.key] = state;
    }
  }
  return result;
}

// src/copy-instruction.ts
function buildCopyInstruction(hookName, panelName, values) {
  const jsonStr = JSON.stringify(values, null, 2);
  if (hookName === "useDialTimeline" || hookName === "createDialTimeline") {
    return `Update the ${hookName} configuration for "${panelName}" with these values:

\`\`\`json
${jsonStr}
\`\`\`

Apply these values as the new defaults in the ${hookName} call. Keep the existing \`clip.current\` bindings while this timeline is being authored; do not convert the animation or remove DialKit yet.

Add this comment immediately above the ${hookName} call as a production handoff note:

\`\`\`tsx
// TODO(production): DialKit's clip.current values are the scrubbable authoring preview.
// Replace them with equivalent real Motion animations using the tuned timeline
// timings and transitions, then remove ${hookName} and <DialTimeline />.
\`\`\``;
  }
  return `Update the ${hookName} configuration for "${panelName}" with these values:

\`\`\`json
${jsonStr}
\`\`\`

Apply these values as the new defaults in the ${hookName} call.`;
}

// src/env.ts
var isDevDefault2 = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import.meta !== "undefined" && import.meta.env?.MODE ? import.meta.env.MODE !== "production" : true;

// src/vue/useDialTimeline.ts
var timelineInstance = 0;
function useDialTimeline(name, config, options) {
  const hasStableId = options?.id !== void 0;
  const panelId = options?.id ?? `${name}-${++timelineInstance}`;
  const serializedConfig = computed10(() => JSON.stringify(config));
  const serializedPersist = computed10(() => JSON.stringify(options?.persist));
  const serializedLoop = computed10(() => JSON.stringify(options?.loop));
  const parsed = computed10(() => {
    serializedConfig.value;
    return parseTimelineConfig(config);
  });
  const flatValues = shallowRef3(DialStore.getValues(panelId));
  const transport = shallowRef3(TimelineStore.getTransport(panelId));
  const loopRegion = shallowRef3(TimelineStore.getLoopRegion(panelId));
  const staticTimeline = computed10(() => computeStaticTimeline(parsed.value, flatValues.value));
  const meta = computed10(() => {
    serializedLoop.value;
    return buildTimelineMeta(
      panelId,
      name,
      staticTimeline.value.duration,
      parsed.value,
      options?.loop
    );
  });
  let mounted = false;
  let unsubscribeValues;
  let unsubscribeTransport;
  const play = () => TimelineStore.play(panelId);
  const pause = () => TimelineStore.pause(panelId);
  const replay = () => TimelineStore.replay(panelId);
  const seek = (time) => TimelineStore.seek(panelId, time);
  watch11([serializedConfig, serializedPersist], () => {
    if (!mounted) return;
    DialStore.updatePanel(panelId, name, parsed.value.dialConfig, void 0, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: "timeline"
    });
    flatValues.value = DialStore.getValues(panelId);
  });
  watch11(meta, (nextMeta) => {
    if (mounted) TimelineStore.update(nextMeta);
  });
  onMounted18(() => {
    unsubscribeValues = DialStore.subscribe(panelId, () => {
      flatValues.value = DialStore.getValues(panelId);
    });
    unsubscribeTransport = TimelineStore.subscribe(panelId, () => {
      transport.value = TimelineStore.getTransport(panelId);
      loopRegion.value = TimelineStore.getLoopRegion(panelId);
    });
    DialStore.registerPanel(panelId, name, parsed.value.dialConfig, void 0, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: "timeline"
    });
    flatValues.value = DialStore.getValues(panelId);
    TimelineStore.register(meta.value, { autoplay: options?.autoplay ?? true, persist: options?.persist });
    transport.value = TimelineStore.getTransport(panelId);
    loopRegion.value = TimelineStore.getLoopRegion(panelId);
    mounted = true;
  });
  onUnmounted12(() => {
    mounted = false;
    unsubscribeValues?.();
    unsubscribeTransport?.();
    TimelineStore.unregister(panelId);
    DialStore.unregisterPanel(panelId);
  });
  return computed10(() => {
    const currentStatic = staticTimeline.value;
    const region = loopRegion.value;
    const loopStart = region ? region.start : 0;
    const loopEnd = region ? region.end : currentStatic.duration;
    return buildTimelineValues(
      currentStatic.clips,
      transport.value,
      currentStatic.duration,
      loopStart,
      loopEnd,
      { play, pause, replay, seek }
    );
  });
}

// src/vue/components/Timeline/DialTimeline.ts
import {
  Teleport as Teleport7,
  computed as computed11,
  defineComponent as defineComponent28,
  h as h28,
  nextTick as nextTick5,
  onMounted as onMounted19,
  onUnmounted as onUnmounted13,
  ref as ref23,
  watch as watch12
} from "vue";
var DRAG_THRESHOLD_PX = 3;
var LOOP_DRAG_THRESHOLD_PX = 4;
var MAJOR_TICK_TARGET_PX = 140;
var MILLISECOND_STEP = 1e-3;
var SECOND_TICK_STEPS = [
  1e-3,
  2e-3,
  5e-3,
  0.01,
  0.02,
  0.05,
  0.1,
  0.2,
  0.5,
  1,
  2,
  5,
  10,
  15,
  30,
  60,
  120,
  300,
  600
];
var MIN_TIMELINE_MAX_ZOOM = 8;
var PLAYHEAD_FLAG_WIDTH = 52;
var PLAYHEAD_FLAG_EDGE_OVERHANG = 1;
var POPOVER_WIDTH = 280;
var ZOOM_DRAG_DISTANCE = 180;
var DEFAULT_DOCK_MAX_HEIGHT = 400;
var MIN_DOCK_MAX_HEIGHT = 120;
var DialTimeline = defineComponent28({
  name: "DialKitTimeline",
  props: {
    theme: { type: String, default: "system" },
    defaultVisible: { type: Boolean, default: true },
    visible: {
      type: Boolean,
      default: void 0
    },
    onVisibilityChange: Function,
    defaultOpen: { type: Boolean, default: true },
    productionEnabled: { type: Boolean, default: isDevDefault2 }
  },
  setup(props) {
    const timelines = ref23(TimelineStore.getTimelines());
    const dockVisible = ref23(TimelineUiStore.getVisible());
    const mounted = ref23(false);
    const dockMaxHeight = ref23(DEFAULT_DOCK_MAX_HEIGHT);
    const dockRef = ref23(null);
    const controllerId = /* @__PURE__ */ Symbol("dialkit-timeline-visibility");
    let unsubscribeTimelines;
    let unsubscribeVisibility;
    let unregisterController;
    let resizeCleanup = null;
    const handleResizePointerDown = (event) => {
      if (!dockRef.value) return;
      event.preventDefault();
      event.stopPropagation();
      resizeCleanup?.();
      const pointerY = event.clientY;
      const startHeight = dockRef.value.getBoundingClientRect().height;
      const move = (next) => {
        next.preventDefault();
        const viewportMax = Math.max(MIN_DOCK_MAX_HEIGHT, window.innerHeight - 24);
        dockMaxHeight.value = clamp5(startHeight + pointerY - next.clientY, MIN_DOCK_MAX_HEIGHT, viewportMax);
      };
      const finish = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", finish);
        window.removeEventListener("pointercancel", finish);
        resizeCleanup = null;
      };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", finish);
      window.addEventListener("pointercancel", finish);
      resizeCleanup = finish;
    };
    onMounted19(() => {
      mounted.value = true;
      unsubscribeVisibility = TimelineUiStore.subscribe(() => {
        dockVisible.value = TimelineUiStore.getVisible();
      });
      unregisterController = TimelineUiStore.registerController(controllerId, {
        visible: props.visible,
        defaultVisible: props.defaultVisible,
        onVisibilityChange: props.onVisibilityChange
      });
      dockVisible.value = TimelineUiStore.getVisible();
      unsubscribeTimelines = TimelineStore.subscribeGlobal(() => {
        timelines.value = TimelineStore.getTimelines();
      });
    });
    watch12(() => [props.visible, props.defaultVisible, props.onVisibilityChange], () => {
      TimelineUiStore.updateController(controllerId, {
        visible: props.visible,
        defaultVisible: props.defaultVisible,
        onVisibilityChange: props.onVisibilityChange
      });
    });
    onUnmounted13(() => {
      unregisterController?.();
      unsubscribeTimelines?.();
      unsubscribeVisibility?.();
      resizeCleanup?.();
    });
    return () => {
      if (!props.productionEnabled || !mounted.value || timelines.value.length === 0) return null;
      return h28(Teleport7, { to: "body" }, [
        h28("div", {
          class: "dialkit-root dialkit-timeline",
          "data-theme": props.theme,
          hidden: !dockVisible.value
        }, [
          h28("div", {
            class: "dialkit-timeline-resize-handle",
            role: "separator",
            "aria-label": "Resize timeline height",
            "aria-orientation": "horizontal",
            title: "Drag to resize timeline",
            onPointerdown: handleResizePointerDown
          }),
          h28("div", {
            ref: dockRef,
            class: "dialkit-timeline-dock",
            style: { maxHeight: `min(${dockMaxHeight.value}px, calc(100vh - 24px))` }
          }, timelines.value.map((meta) => h28(TimelineSection, {
            key: meta.id,
            meta,
            defaultOpen: props.defaultOpen,
            theme: props.theme,
            dockVisible: dockVisible.value
          })))
        ])
      ]);
    };
  }
});
var PlayPauseButton = defineComponent28({
  props: { id: { type: String, required: true } },
  setup(props) {
    const playing = ref23(TimelineStore.getTransport(props.id).playing);
    let unsubscribe;
    onMounted19(() => {
      unsubscribe = TimelineStore.subscribe(props.id, () => {
        playing.value = TimelineStore.getTransport(props.id).playing;
      });
    });
    onUnmounted13(() => unsubscribe?.());
    return () => {
      const label = playing.value ? "Pause" : "Play";
      const icon = playing.value ? h28(
        "svg",
        { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style: iconStyle },
        ICON_PAUSE.map((path) => h28("path", { d: path, fill: "currentColor" }))
      ) : h28("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style: iconStyle }, [
        h28("path", { d: ICON_PLAY, fill: "currentColor" })
      ]);
      return h28("button", {
        class: "dialkit-toolbar-add",
        title: label,
        "aria-label": label,
        onClick: () => playing.value ? TimelineStore.pause(props.id) : TimelineStore.play(props.id)
      }, [h28("span", { style: { position: "relative", width: "16px", height: "16px" } }, [icon])]);
    };
  }
});
var ReplayButton = defineComponent28({
  props: { onReplay: { type: Function, required: true } },
  setup(props) {
    return () => h28("button", {
      class: "dialkit-toolbar-add",
      title: "Replay",
      "aria-label": "Replay",
      onClick: props.onReplay
    }, [
      h28(
        "svg",
        { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
        ICON_REPLAY.map((path) => h28("path", { d: path, fill: "currentColor" }))
      )
    ]);
  }
});
var iconStyle = {
  position: "absolute",
  inset: 0,
  width: "16px",
  height: "16px",
  color: "var(--dial-text-label)"
};
var TimelineOverview = defineComponent28({
  props: {
    id: { type: String, required: true },
    duration: { type: Number, required: true },
    viewStart: { type: Number, required: true },
    viewEnd: { type: Number, required: true },
    onNavigate: { type: Function, required: true }
  },
  setup(props) {
    const time = ref23(TimelineStore.getTransport(props.id).time);
    let scrub = null;
    let unsubscribe;
    onMounted19(() => {
      unsubscribe = TimelineStore.subscribe(props.id, () => {
        time.value = TimelineStore.getTransport(props.id).time;
      });
    });
    onUnmounted13(() => unsubscribe?.());
    const seek = (clientX) => {
      if (!scrub || scrub.rect.width <= 0 || props.duration <= 0) return;
      const next = clamp5((clientX - scrub.rect.left) / scrub.rect.width * props.duration, 0, props.duration);
      TimelineStore.seek(props.id, next);
      props.onNavigate(next);
    };
    const finish = () => {
      if (scrub?.wasPlaying) TimelineStore.play(props.id);
      scrub = null;
    };
    return () => {
      const viewportWidth = props.duration > 0 ? (props.viewEnd - props.viewStart) / props.duration * 100 : 100;
      const playhead = props.duration > 0 ? time.value / props.duration * 100 : 0;
      return h28("div", {
        class: "dialkit-timeline-overview",
        title: "Drag to scrub the full timeline",
        onPointerdown: (event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          scrub = {
            wasPlaying: TimelineStore.getTransport(props.id).playing,
            rect: event.currentTarget.getBoundingClientRect()
          };
          TimelineStore.pause(props.id);
          seek(event.clientX);
        },
        onPointermove: (event) => scrub && seek(event.clientX),
        onPointerup: finish,
        onPointercancel: finish,
        onLostpointercapture: finish
      }, [
        h28("div", {
          class: "dialkit-timeline-overview-viewport",
          "data-zoomed": viewportWidth < 99.999 || void 0,
          style: { left: `${props.duration > 0 ? props.viewStart / props.duration * 100 : 0}%`, width: `${viewportWidth}%` }
        }),
        h28("div", { class: "dialkit-timeline-overview-progress", style: { width: `${playhead}%` } }),
        h28("div", { class: "dialkit-timeline-overview-playhead", style: { left: `${playhead}%` } })
      ]);
    };
  }
});
var TimelinePlayheadFlag = defineComponent28({
  props: {
    id: { type: String, required: true },
    duration: { type: Number, required: true },
    pxPerSecond: { type: Number, required: true },
    viewStart: { type: Number, required: true },
    viewEnd: { type: Number, required: true },
    laneWidth: { type: Number, required: true },
    ruler: Object,
    onResetView: { type: Function, required: true }
  },
  setup(props) {
    const time = ref23(TimelineStore.getTransport(props.id).time);
    let unsubscribe;
    let scrub = null;
    let cleanup = null;
    onMounted19(() => {
      unsubscribe = TimelineStore.subscribe(props.id, () => {
        time.value = TimelineStore.getTransport(props.id).time;
      });
    });
    onUnmounted13(() => {
      unsubscribe?.();
      cleanup?.();
    });
    const seek = (clientX) => {
      if (!scrub || scrub.rect.width <= 0) return;
      TimelineStore.seek(props.id, clamp5(
        scrub.viewStart + (clientX - scrub.rect.left) / scrub.rect.width * (scrub.viewEnd - scrub.viewStart),
        scrub.viewStart,
        scrub.viewEnd
      ));
    };
    return () => {
      if (time.value < props.viewStart || time.value > props.viewEnd || props.laneWidth <= 0) return null;
      const x = clamp5((time.value - props.viewStart) * props.pxPerSecond, 0, props.laneWidth);
      const flagCenter = clamp5(
        x,
        PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG,
        props.laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG
      );
      const flagOffset = flagCenter - x;
      const edge = flagOffset > 0.5 ? "start" : flagOffset < -0.5 ? "end" : "center";
      return h28("div", {
        class: "dialkit-timeline-playhead-control",
        "data-edge": edge,
        style: {
          left: `calc(var(--dial-timeline-label-w) + ${x}px)`,
          "--dial-timeline-playhead-flag-offset": `${flagOffset}px`
        },
        role: "slider",
        "aria-label": "Timeline current time",
        "aria-valuemin": 0,
        "aria-valuemax": props.duration,
        "aria-valuenow": time.value,
        title: "Drag to scrub the timeline",
        onPointerdown: (event) => {
          const rect = props.ruler?.getBoundingClientRect();
          if (!rect) return;
          event.preventDefault();
          event.stopPropagation();
          cleanup?.();
          const reset = event.shiftKey;
          scrub = {
            wasPlaying: TimelineStore.getTransport(props.id).playing,
            rect,
            viewStart: reset ? 0 : props.viewStart,
            viewEnd: reset ? props.duration : props.viewEnd
          };
          if (reset) props.onResetView();
          TimelineStore.pause(props.id);
          seek(event.clientX);
          const move = (next) => {
            next.preventDefault();
            seek(next.clientX);
          };
          const finish = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", finish);
            window.removeEventListener("pointercancel", finish);
            if (scrub?.wasPlaying) TimelineStore.play(props.id);
            scrub = null;
            cleanup = null;
          };
          window.addEventListener("pointermove", move, { passive: false });
          window.addEventListener("pointerup", finish);
          window.addEventListener("pointercancel", finish);
          cleanup = finish;
        }
      }, [
        h28("div", { class: "dialkit-timeline-playhead-stem" }),
        h28("div", { class: "dialkit-timeline-playhead-anchor" }, [
          h28("div", { class: "dialkit-timeline-playhead-flag" }, time.value.toFixed(2))
        ])
      ]);
    };
  }
});
function clampViewStart(start, duration, visibleDuration) {
  return clamp5(start, 0, Math.max(0, duration - visibleDuration));
}
function formatRulerSeconds(time, step) {
  if (step >= 1 && Number.isInteger(time)) return formatClock(time);
  const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
  return `${time.toFixed(decimals)}s`;
}
var TimelineSection = defineComponent28({
  props: {
    meta: { type: Object, required: true },
    defaultOpen: { type: Boolean, required: true },
    theme: { type: String, required: true },
    dockVisible: { type: Boolean, required: true }
  },
  setup(props) {
    const open = ref23(props.defaultOpen);
    const copied = ref23(false);
    const popover = ref23(null);
    const collapsedGroups = ref23(/* @__PURE__ */ new Set());
    const expandedTracks = ref23(/* @__PURE__ */ new Set());
    const zoom = ref23(1);
    const viewStart = ref23(0);
    const values = ref23(DialStore.getValues(props.meta.id));
    const presets = ref23(DialStore.getPresets(props.meta.id));
    const activePresetId = ref23(DialStore.getActivePresetId(props.meta.id));
    const loopRegion = ref23(TimelineStore.getLoopRegion(props.meta.id));
    const loopDrag = ref23(null);
    const laneAreaRef = ref23(null);
    const horizontalScrollRef = ref23(null);
    const laneWidth = ref23(0);
    let unsubscribeValues;
    let unsubscribeLoop;
    let resizeObserver;
    const measure = () => {
      if (laneAreaRef.value) laneWidth.value = laneAreaRef.value.getBoundingClientRect().width;
    };
    const connectMeasure = async () => {
      resizeObserver?.disconnect();
      if (!open.value) return;
      await nextTick5();
      if (!laneAreaRef.value) return;
      measure();
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(laneAreaRef.value);
    };
    onMounted19(() => {
      unsubscribeValues = DialStore.subscribe(props.meta.id, () => {
        values.value = DialStore.getValues(props.meta.id);
        presets.value = DialStore.getPresets(props.meta.id);
        activePresetId.value = DialStore.getActivePresetId(props.meta.id);
      });
      unsubscribeLoop = TimelineStore.subscribe(props.meta.id, () => {
        loopRegion.value = TimelineStore.getLoopRegion(props.meta.id);
      });
      loopRegion.value = TimelineStore.getLoopRegion(props.meta.id);
      void connectMeasure();
    });
    onUnmounted13(() => {
      unsubscribeValues?.();
      unsubscribeLoop?.();
      resizeObserver?.disconnect();
    });
    watch12(open, connectMeasure);
    watch12(() => props.dockVisible, (visible) => {
      if (!visible) popover.value = null;
    });
    const visibleDuration = computed11(() => props.meta.duration > 0 ? props.meta.duration / zoom.value : props.meta.duration);
    const safeViewStart = computed11(() => clampViewStart(viewStart.value, props.meta.duration, visibleDuration.value));
    const viewEnd = computed11(() => safeViewStart.value + visibleDuration.value);
    const pxPerSecond = computed11(() => visibleDuration.value > 0 && laneWidth.value > 0 ? laneWidth.value / visibleDuration.value : 0);
    const maxZoom = computed11(() => Math.max(
      MIN_TIMELINE_MAX_ZOOM,
      laneWidth.value > 0 && props.meta.duration > 0 ? MAJOR_TICK_TARGET_PX * props.meta.duration / (MILLISECOND_STEP * 10 * laneWidth.value) : MIN_TIMELINE_MAX_ZOOM
    ));
    watch12(maxZoom, (next) => {
      zoom.value = clamp5(zoom.value, 1, next);
    }, { immediate: true });
    watch12([() => props.meta.duration, zoom], () => {
      viewStart.value = clampViewStart(viewStart.value, props.meta.duration, props.meta.duration / zoom.value);
    });
    watch12([open, pxPerSecond, safeViewStart], async () => {
      await nextTick5();
      const scroller = horizontalScrollRef.value;
      if (!scroller || pxPerSecond.value <= 0) return;
      const next = safeViewStart.value * pxPerSecond.value;
      if (Math.abs(scroller.scrollLeft - next) > 0.5) scroller.scrollLeft = next;
    });
    const centerViewAt = (time) => {
      if (zoom.value <= 1 || props.meta.duration <= 0) return;
      const duration = props.meta.duration / zoom.value;
      viewStart.value = clampViewStart(time - duration / 2, props.meta.duration, duration);
    };
    const resetView = () => {
      zoom.value = 1;
      viewStart.value = 0;
    };
    const handleReplay = () => {
      viewStart.value = 0;
      TimelineStore.replay(props.meta.id);
    };
    const handleHorizontalScroll = (event) => {
      if (pxPerSecond.value <= 0) return;
      viewStart.value = clampViewStart(
        event.currentTarget.scrollLeft / pxPerSecond.value,
        props.meta.duration,
        visibleDuration.value
      );
    };
    const handleTimelineWheel = (event) => {
      const scroller = horizontalScrollRef.value;
      if (!scroller || zoom.value <= 1) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (delta === 0) return;
      event.preventDefault();
      scroller.scrollLeft += delta;
    };
    let zoomDrag = null;
    let rulerGesture = null;
    let trackScrub = null;
    const rulerTimeFromClientX = (clientX, rect, viewStartAt, visibleAt) => clamp5(
      viewStartAt + (clientX - rect.left) / rect.width * visibleAt,
      viewStartAt,
      viewStartAt + visibleAt
    );
    const seekTrack = (clientX) => {
      if (!trackScrub || trackScrub.rect.width <= 0) return;
      TimelineStore.seek(props.meta.id, clamp5(
        trackScrub.viewStart + (clientX - trackScrub.rect.left) / trackScrub.rect.width * trackScrub.visibleDuration,
        trackScrub.viewStart,
        trackScrub.viewStart + trackScrub.visibleDuration
      ));
    };
    const finishRuler = () => {
      const gesture = rulerGesture;
      rulerGesture = null;
      zoomDrag = null;
      if (gesture) {
        if (gesture.moved && loopDrag.value) {
          TimelineStore.setLoopRegion(props.meta.id, loopDrag.value.start, loopDrag.value.end);
        } else {
          TimelineStore.seek(props.meta.id, gesture.downTime);
        }
        loopDrag.value = null;
      }
    };
    const cancelRuler = () => {
      rulerGesture = null;
      zoomDrag = null;
      loopDrag.value = null;
    };
    const handleClearLoopRegion = () => TimelineStore.clearLoopRegion(props.meta.id);
    const finishTrack = () => {
      if (trackScrub?.wasPlaying) TimelineStore.play(props.meta.id);
      trackScrub = null;
    };
    const handleCopy = () => {
      const normalized = normalizeTimelineValuesForCopy(DialStore.getValues(props.meta.id), props.meta.clips);
      void navigator.clipboard.writeText(buildCopyInstruction("useDialTimeline", props.meta.name, normalized));
      copied.value = true;
      window.setTimeout(() => {
        copied.value = false;
      }, 1500);
    };
    const handleAddPreset = () => DialStore.savePreset(props.meta.id, `Version ${presets.value.length + 2}`);
    const closePopover = () => {
      popover.value = null;
    };
    const openClipPopover = (clip, rect, stepKey) => {
      const target = stepKey ? `${clip.key}.${stepKey}` : clip.key;
      if (getClipControls(props.meta.id, target, stepKey ? void 0 : clipPopoverExclusions(clip)).length === 0) return;
      popover.value = popover.value?.clip.key === clip.key && popover.value.stepKey === stepKey ? null : {
        clip,
        stepKey,
        anchor: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
      };
    };
    const toggleSet = (state, key) => {
      const next = new Set(state.value);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      state.value = next;
    };
    const toggleTracks = (key) => toggleSet(expandedTracks, key);
    const toggleGroup = (key) => toggleSet(collapsedGroups, key);
    const handleBarClick = (clip, rect, stepKey) => {
      if (!stepKey && clip.tracks?.length) toggleTracks(clip.key);
      else openClipPopover(clip, rect, stepKey);
    };
    const ticks = computed11(() => {
      const raw = pxPerSecond.value > 0 ? MAJOR_TICK_TARGET_PX / pxPerSecond.value : 1;
      const adaptive = SECOND_TICK_STEPS.find((step) => step >= raw) ?? SECOND_TICK_STEPS[SECOND_TICK_STEPS.length - 1];
      const majorStep = zoom.value < 1.5 && props.meta.duration >= 1 ? Math.max(1, adaptive) : adaptive;
      const fineStep = majorStep / 10;
      const major = [];
      const medium = [];
      const fine = [];
      for (let time = Math.ceil((safeViewStart.value - 1e-6) / majorStep) * majorStep; time <= viewEnd.value + 1e-6; time += majorStep) {
        major.push(Number(time.toFixed(4)));
      }
      const first = Math.ceil((safeViewStart.value - 1e-6) / fineStep);
      const last = Math.floor((viewEnd.value + 1e-6) / fineStep);
      for (let index = first; index <= last; index++) {
        if (index % 10 === 0) continue;
        const tick = Number((index * fineStep).toFixed(6));
        if (index % 5 === 0) medium.push(tick);
        else fine.push(tick);
      }
      return { major, medium, fine, majorStep };
    });
    const renderRows = () => {
      const rows = [];
      let lastGroup;
      for (const clip of props.meta.clips) {
        if (clip.group !== lastGroup) {
          lastGroup = clip.group;
          if (clip.group) {
            const group = clip.group;
            const collapsed = collapsedGroups.value.has(group);
            rows.push(h28("div", { key: `group:${group}`, class: "dialkit-timeline-row dialkit-timeline-group-row" }, [
              h28("div", { class: "dialkit-timeline-label" }, [
                h28("button", {
                  class: "dialkit-timeline-group-toggle",
                  "data-open": !collapsed,
                  title: collapsed ? "Expand layer" : "Collapse layer",
                  onClick: () => toggleGroup(group)
                }, [chevronIcon()]),
                h28("span", formatLabel(group))
              ]),
              h28("div", { class: "dialkit-timeline-lane" })
            ]));
          }
        }
        if (clip.group && collapsedGroups.value.has(clip.group)) continue;
        const isProps = Boolean(clip.tracks?.length);
        const tracksOpen = isProps && expandedTracks.value.has(clip.key);
        const stat = computeClipStaticFromValues(values.value, clip, props.meta.duration);
        const selected = popover.value?.clip.key === clip.key;
        rows.push(h28("div", { key: clip.key, class: "dialkit-timeline-row", "data-grouped": clip.group ? "" : void 0 }, [
          h28("div", { class: "dialkit-timeline-label" }, [
            isProps ? h28("button", {
              class: "dialkit-timeline-group-toggle",
              "data-open": tracksOpen,
              title: tracksOpen ? "Collapse properties" : "Expand properties",
              onClick: (event) => {
                event.stopPropagation();
                toggleTracks(clip.key);
              }
            }, [chevronIcon()]) : null,
            clip.label
          ]),
          h28("div", { class: "dialkit-timeline-lane" }, [h28(TimelineClip, {
            timelineId: props.meta.id,
            clip,
            at: stat.at,
            duration: stat.duration,
            loop: stat.loop,
            steps: clip.stepKeys?.length ? stat.tracks[0]?.steps : void 0,
            fixedDuration: isProps ? true : stat.isPhysics,
            composite: isProps,
            pxPerSecond: pxPerSecond.value,
            viewStart: safeViewStart.value,
            timelineDuration: props.meta.duration,
            selected,
            selectedStepKey: selected ? popover.value?.stepKey : void 0,
            onClick: handleBarClick,
            onDrag: closePopover
          })])
        ]));
        if (!tracksOpen) continue;
        for (const trackRef of clip.tracks ?? []) {
          const track = stat.tracks.find((candidate) => candidate.prop === trackRef.prop);
          if (!track) continue;
          const trackKey = `${clip.key}.${trackRef.prop}`;
          const trackMeta = {
            key: trackKey,
            label: `${clip.label} \xB7 ${formatLabel(trackRef.prop)}`,
            color: clip.color,
            loop: clip.loop,
            group: clip.group,
            stepKeys: trackRef.stepKeys
          };
          const trackSelected = popover.value?.clip.key === trackKey;
          rows.push(h28("div", { key: trackKey, class: "dialkit-timeline-row dialkit-timeline-track-row", "data-grouped": clip.group ? "" : void 0 }, [
            h28("div", { class: "dialkit-timeline-label" }, formatLabel(trackRef.prop)),
            h28("div", { class: "dialkit-timeline-lane" }, [h28(TimelineClip, {
              timelineId: props.meta.id,
              clip: trackMeta,
              at: stat.at + track.delay,
              duration: track.duration,
              loop: stat.loop,
              steps: trackRef.stepKeys?.length ? track.steps : void 0,
              fixedDuration: !trackRef.stepKeys?.length && track.steps[0]?.isPhysics === true,
              baseAt: stat.at,
              delayMode: true,
              pxPerSecond: pxPerSecond.value,
              viewStart: safeViewStart.value,
              timelineDuration: props.meta.duration,
              selected: trackSelected,
              selectedStepKey: trackSelected ? popover.value?.stepKey : void 0,
              onClick: openClipPopover,
              onDrag: closePopover
            })])
          ]));
        }
      }
      return rows;
    };
    return () => h28("div", { class: "dialkit-timeline-section" }, [
      h28("div", { class: "dialkit-timeline-header", "data-open": open.value || void 0 }, [
        h28("div", { class: "dialkit-timeline-identity" }, [
          h28("span", { class: "dialkit-timeline-title" }, props.meta.name)
        ]),
        !open.value ? h28(TimelineOverview, {
          id: props.meta.id,
          duration: props.meta.duration,
          viewStart: safeViewStart.value,
          viewEnd: viewEnd.value,
          onNavigate: centerViewAt
        }) : null,
        h28("div", { class: "dialkit-timeline-actions" }, [
          h28("button", {
            class: "dialkit-timeline-loop-toggle",
            "data-active": loopRegion.value ? "true" : void 0,
            disabled: !loopRegion.value,
            title: loopRegion.value ? "Looping a region \xB7 click to loop the whole timeline" : "Looping the whole timeline \xB7 drag the ruler to set a loop region",
            "aria-label": loopRegion.value ? "Clear loop region" : "Looping whole timeline",
            "aria-pressed": loopRegion.value ? "true" : "false",
            onClick: handleClearLoopRegion
          }, [
            h28(
              "svg",
              { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" },
              ICON_LOOP.map((d) => h28("path", { d }))
            )
          ]),
          h28(PlayPauseButton, { id: props.meta.id }),
          h28(ReplayButton, { onReplay: handleReplay }),
          h28("button", { class: "dialkit-toolbar-add", title: "Add timeline version", "aria-label": "Add timeline version", onClick: handleAddPreset }, [
            h28(
              "svg",
              { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" },
              ICON_ADD_PRESET.map((path) => h28("path", { d: path }))
            )
          ]),
          h28(PresetManager, { panelId: props.meta.id, presets: presets.value, activePresetId: activePresetId.value }),
          h28("button", {
            class: "dialkit-toolbar-add",
            title: "Copy parameters",
            "aria-label": copied.value ? "Copied parameters" : "Copy parameters",
            onClick: handleCopy
          }, [h28("span", { style: { position: "relative", width: "16px", height: "16px" } }, [
            copied.value ? h28("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", style: iconStyle }, [h28("path", { d: ICON_CHECK })]) : h28("svg", { viewBox: "0 0 24 24", fill: "none", style: iconStyle }, [
              h28("path", { d: ICON_CLIPBOARD.board, stroke: "currentColor", "stroke-width": "2", "stroke-linejoin": "round" }),
              h28("path", { d: ICON_CLIPBOARD.sparkle, fill: "currentColor" }),
              h28("path", { d: ICON_CLIPBOARD.body, stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" })
            ])
          ])]),
          h28("button", {
            class: "dialkit-timeline-chevron",
            "data-open": open.value,
            "aria-expanded": open.value,
            title: open.value ? "Collapse timeline" : "Expand timeline",
            onClick: () => {
              open.value = !open.value;
            }
          }, [chevronIcon()])
        ])
      ]),
      open.value ? h28("div", {
        class: "dialkit-timeline-body",
        onWheel: handleTimelineWheel,
        onPointerdown: (event) => {
          const target = event.target;
          if (target.closest(".dialkit-timeline-label, button")) return;
          if (!event.shiftKey && target.closest(".dialkit-timeline-clip")) return;
          const rect = laneAreaRef.value?.getBoundingClientRect();
          if (!rect) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          const reset = event.shiftKey;
          trackScrub = {
            wasPlaying: TimelineStore.getTransport(props.meta.id).playing,
            rect,
            viewStart: reset ? 0 : safeViewStart.value,
            visibleDuration: reset ? props.meta.duration : visibleDuration.value
          };
          if (reset) resetView();
          popover.value = null;
          TimelineStore.pause(props.meta.id);
          seekTrack(event.clientX);
        },
        onPointermove: (event) => trackScrub && seekTrack(event.clientX),
        onPointerup: finishTrack,
        onPointercancel: finishTrack,
        onLostpointercapture: finishTrack
      }, [h28("div", { class: "dialkit-timeline-grid" }, [
        h28("div", { class: "dialkit-timeline-row dialkit-timeline-ruler-row" }, [
          h28("div", { class: "dialkit-timeline-label" }),
          h28("div", {
            ref: laneAreaRef,
            class: "dialkit-timeline-ruler",
            title: "Click to seek \xB7 drag to set a loop region \xB7 Option-drag to zoom \xB7 Shift-drag to reset zoom",
            onPointerdown: (event) => {
              event.preventDefault();
              event.stopPropagation();
              const rect = event.currentTarget.getBoundingClientRect();
              if (rect.width <= 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              if (!event.altKey) {
                const reset = event.shiftKey;
                const gestureViewStart = reset ? 0 : safeViewStart.value;
                const gestureVisible = reset ? props.meta.duration : visibleDuration.value;
                if (reset) resetView();
                rulerGesture = {
                  downClientX: event.clientX,
                  downTime: rulerTimeFromClientX(event.clientX, rect, gestureViewStart, gestureVisible),
                  rect,
                  viewStart: gestureViewStart,
                  visibleDuration: gestureVisible,
                  moved: false
                };
                return;
              }
              const ratio = clamp5((event.clientX - rect.left) / rect.width, 0, 1);
              zoomDrag = {
                pointerX: event.clientX,
                zoom: zoom.value,
                anchorRatio: ratio,
                anchorTime: safeViewStart.value + ratio * visibleDuration.value,
                moved: false
              };
            },
            onPointermove: (event) => {
              const gesture = rulerGesture;
              if (gesture) {
                const dx2 = event.clientX - gesture.downClientX;
                if (!gesture.moved && Math.abs(dx2) <= LOOP_DRAG_THRESHOLD_PX) return;
                gesture.moved = true;
                const current = rulerTimeFromClientX(event.clientX, gesture.rect, gesture.viewStart, gesture.visibleDuration);
                loopDrag.value = {
                  start: Math.min(gesture.downTime, current),
                  end: Math.max(gesture.downTime, current)
                };
                return;
              }
              if (!zoomDrag || props.meta.duration <= 0) return;
              const dx = event.clientX - zoomDrag.pointerX;
              if (!zoomDrag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
              zoomDrag.moved = true;
              const nextZoom = clamp5(zoomDrag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom.value);
              const duration = props.meta.duration / nextZoom;
              zoom.value = nextZoom;
              viewStart.value = clampViewStart(zoomDrag.anchorTime - zoomDrag.anchorRatio * duration, props.meta.duration, duration);
            },
            onPointerup: finishRuler,
            onPointercancel: cancelRuler,
            onLostpointercapture: cancelRuler
          }, [
            ...(() => {
              const activeLoop = loopDrag.value ?? loopRegion.value;
              if (!activeLoop || pxPerSecond.value <= 0) return [];
              const left = (activeLoop.start - safeViewStart.value) * pxPerSecond.value;
              const width = Math.max(0, (activeLoop.end - activeLoop.start) * pxPerSecond.value);
              return [
                h28("div", { key: "loop-dim-before", class: "dialkit-timeline-loop-dim", style: { left: "0px", width: `${Math.max(0, left)}px` } }),
                h28("div", { key: "loop-dim-after", class: "dialkit-timeline-loop-dim", style: { left: `${left + width}px`, right: "0px" } }),
                h28("div", { key: "loop-band", class: "dialkit-timeline-loop-band", "data-live": loopDrag.value ? "true" : void 0, style: { left: `${left}px`, width: `${width}px` } })
              ];
            })(),
            ...ticks.value.fine.map((time) => h28("div", { key: `fine:${time}`, class: "dialkit-timeline-tick dialkit-timeline-tick-fine", style: { left: `${(time - safeViewStart.value) * pxPerSecond.value}px` } })),
            ...ticks.value.medium.map((time) => h28("div", { key: `medium:${time}`, class: "dialkit-timeline-tick dialkit-timeline-tick-medium", style: { left: `${(time - safeViewStart.value) * pxPerSecond.value}px` } })),
            ...ticks.value.major.map((time) => h28("div", { key: time, class: "dialkit-timeline-tick", style: { left: `${(time - safeViewStart.value) * pxPerSecond.value}px` } }, [
              h28("span", { class: "dialkit-timeline-tick-label" }, formatRulerSeconds(time, ticks.value.majorStep))
            ]))
          ])
        ]),
        ...renderRows(),
        pxPerSecond.value > 0 ? h28(TimelinePlayheadFlag, {
          id: props.meta.id,
          duration: props.meta.duration,
          pxPerSecond: pxPerSecond.value,
          viewStart: safeViewStart.value,
          viewEnd: viewEnd.value,
          laneWidth: laneWidth.value,
          ruler: laneAreaRef.value ?? void 0,
          onResetView: resetView
        }) : null
      ]), zoom.value > 1 ? h28("div", { class: "dialkit-timeline-scroll-row" }, [
        h28("div", { class: "dialkit-timeline-label" }),
        h28("div", {
          ref: horizontalScrollRef,
          class: "dialkit-timeline-horizontal-scroll",
          "aria-label": "Timeline horizontal scroll",
          onScroll: handleHorizontalScroll
        }, [h28("div", { style: { width: `${laneWidth.value * zoom.value}px` } })])
      ]) : null]) : null,
      popover.value ? h28(ClipPopover, {
        panelId: props.meta.id,
        popover: popover.value,
        values: values.value,
        theme: props.theme,
        onClose: closePopover
      }) : null
    ]);
  }
});
function chevronIcon() {
  return h28("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round" }, [
    h28("path", { d: ICON_CHEVRON })
  ]);
}
var ClipPopover = defineComponent28({
  props: {
    panelId: { type: String, required: true },
    popover: { type: Object, required: true },
    values: { type: Object, required: true },
    theme: { type: String, required: true },
    onClose: { type: Function, required: true }
  },
  setup(props) {
    const element = ref23(null);
    const naturalHeight = ref23(0);
    const viewport = ref23(readViewport());
    let observer;
    const measure = () => {
      if (element.value) naturalHeight.value = element.value.scrollHeight + 2;
    };
    const updateViewport = () => {
      viewport.value = readViewport();
    };
    const outside = (event) => {
      const target = event.target;
      if (element.value?.contains(target) || target.closest?.(".dialkit-timeline-clip") || target.closest?.(".dialkit-timeline-label")) return;
      props.onClose();
    };
    const keydown = (event) => {
      if (event.key === "Escape") props.onClose();
    };
    onMounted19(() => {
      measure();
      observer = new ResizeObserver(measure);
      if (element.value) observer.observe(element.value.querySelector(".dialkit-timeline-popover-body") ?? element.value);
      window.addEventListener("resize", updateViewport);
      window.visualViewport?.addEventListener("resize", updateViewport);
      window.visualViewport?.addEventListener("scroll", updateViewport);
      document.addEventListener("pointerdown", outside, true);
      document.addEventListener("keydown", keydown);
    });
    onUnmounted13(() => {
      observer?.disconnect();
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keydown);
    });
    return () => {
      const { clip, stepKey } = props.popover;
      let controls;
      let title;
      if (stepKey) {
        controls = getClipControls(props.panelId, `${clip.key}.${stepKey}`);
        if (stepKey === clip.stepKeys?.[0]) {
          const from = getControlAt(props.panelId, `${clip.key}.from`);
          if (from) {
            const index = controls.findIndex((control) => control.path === `${clip.key}.${stepKey}.to`);
            controls = index >= 0 ? [...controls.slice(0, index), from, ...controls.slice(index)] : [...controls, from];
          }
        }
        title = `${clip.label} \xB7 ${formatStepLabel(stepKey)}`;
      } else {
        controls = getClipControls(props.panelId, clip.key, clipPopoverExclusions(clip));
        title = clip.label;
      }
      if (controls.length === 0) return null;
      const target = stepKey ? `${clip.key}.${stepKey}` : clip.key;
      const durationMeta = getControlAt(props.panelId, `${target}.duration`);
      const durationValue = durationMeta ? props.values[durationMeta.path] : void 0;
      const transitionDuration = durationMeta?.type === "slider" && typeof durationValue === "number" ? {
        value: durationValue,
        onChange: (next) => DialStore.updateValue(props.panelId, durationMeta.path, next),
        min: Math.max(TIMELINE_MIN_CLIP_DURATION, durationMeta.min ?? 0),
        max: durationMeta.max,
        step: durationMeta.step
      } : void 0;
      const current = viewport.value;
      const right = current.offsetLeft + current.width;
      const bottom = current.offsetTop + current.height;
      const width = Math.min(POPOVER_WIDTH, Math.max(220, current.width - 24));
      const left = clamp5(props.popover.anchor.left + props.popover.anchor.width / 2 - width / 2, current.offsetLeft + 12, Math.max(current.offsetLeft + 12, right - width - 12));
      const above = Math.max(0, props.popover.anchor.top - current.offsetTop - 22);
      const below = Math.max(0, bottom - props.popover.anchor.bottom - 22);
      const placeAbove = naturalHeight.value === 0 ? above >= below : naturalHeight.value <= above || naturalHeight.value > below && above >= below;
      const availableHeight = placeAbove ? above : below;
      const renderedHeight = Math.min(naturalHeight.value || availableHeight, availableHeight);
      const rawTop = placeAbove ? props.popover.anchor.top - 10 - renderedHeight : props.popover.anchor.bottom + 10;
      const top = clamp5(rawTop, current.offsetTop + 12, Math.max(current.offsetTop + 12, bottom - renderedHeight - 12));
      return h28(Teleport7, { to: "body" }, [h28("div", { class: "dialkit-root", "data-theme": props.theme }, [
        h28("div", {
          ref: element,
          class: "dialkit-timeline-popover",
          "data-placement": placeAbove ? "above" : "below",
          style: { left: `${left}px`, top: `${top}px`, width: `${width}px`, maxHeight: `${availableHeight}px`, visibility: naturalHeight.value > 0 ? "visible" : "hidden" },
          role: "dialog",
          "aria-label": `Edit ${title}`
        }, [
          h28("div", { class: "dialkit-timeline-popover-header" }, [
            h28("span", { class: "dialkit-timeline-popover-title" }, title),
            h28("button", { class: "dialkit-timeline-popover-close", title: "Close editor", "aria-label": "Close editor", onClick: props.onClose }, [
              h28("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round" }, [h28("path", { d: "M6 6L18 18M18 6L6 18" })])
            ])
          ]),
          h28("div", { class: "dialkit-timeline-popover-body" }, [h28(ControlRenderer, {
            panelId: props.panelId,
            controls,
            values: timelinePopoverDisplayValues(props.values, clip.key, clip.stepKeys, stepKey),
            transitionDuration
          })])
        ])
      ])]);
    };
  }
});
function readViewport() {
  return {
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
    offsetLeft: window.visualViewport?.offsetLeft ?? 0,
    offsetTop: window.visualViewport?.offsetTop ?? 0
  };
}
function clipPopoverExclusions(clip) {
  return /* @__PURE__ */ new Set([...clip.stepKeys ?? [], ...clip.tracks?.map((track) => track.prop) ?? []]);
}
function getClipControls(panelId, path, exclusions) {
  const panel = DialStore.getPanel(panelId);
  const folder = panel ? findControl(panel.controls, path) : null;
  if (!folder?.children) return [];
  return folder.children.filter((control) => {
    const key = control.path.slice(path.length + 1);
    return key !== "at" && key !== "duration" && !exclusions?.has(key);
  });
}
function getControlAt(panelId, path) {
  const panel = DialStore.getPanel(panelId);
  return panel ? findControl(panel.controls, path) : null;
}
var TimelineClip = defineComponent28({
  props: {
    timelineId: { type: String, required: true },
    clip: { type: Object, required: true },
    at: { type: Number, required: true },
    duration: { type: Number, required: true },
    loop: { type: String, required: true },
    steps: Array,
    fixedDuration: { type: Boolean, required: true },
    composite: Boolean,
    baseAt: { type: Number, default: 0 },
    delayMode: Boolean,
    pxPerSecond: { type: Number, required: true },
    viewStart: { type: Number, required: true },
    timelineDuration: { type: Number, required: true },
    selected: { type: Boolean, required: true },
    selectedStepKey: String,
    onClick: { type: Function, required: true },
    onDrag: { type: Function, required: true }
  },
  setup(props) {
    const dragging = ref23(false);
    let drag = null;
    const finish = (event) => {
      const previous = drag;
      drag = null;
      dragging.value = false;
      if (previous && !previous.moved && event) {
        const anchor = previous.clickEl ?? event.currentTarget;
        props.onClick(props.clip, anchor.getBoundingClientRect(), previous.clickEl?.dataset.step);
      }
    };
    return () => {
      const width = Math.max(props.duration * props.pxPerSecond, 14);
      const isSteps = Boolean(props.steps?.length);
      const looping = props.loop === "repeat" && props.duration > 0;
      const resizable = props.duration > 0 && !props.fixedDuration && !props.composite;
      const durationText = `${props.fixedDuration && !props.composite ? "~" : ""}${formatSeconds(props.duration)}`;
      const ghosts = [];
      if (looping) {
        const first = Math.max(1, Math.floor((props.viewStart - props.at) / props.duration));
        for (let offset = 0; offset < 256; offset++) {
          const index = first + offset;
          const start = props.at + props.duration * index;
          if (start >= props.timelineDuration - 1e-6) break;
          const duration = Math.min(props.duration, props.timelineDuration - start);
          ghosts.push(h28("div", {
            key: `ghost:${index}`,
            class: "dialkit-timeline-clip-ghost",
            "data-steps": isSteps || void 0,
            "aria-hidden": "true",
            style: { left: `${(start - props.viewStart) * props.pxPerSecond + 1}px`, width: `${Math.max(1, duration * props.pxPerSecond - 2)}px`, background: props.clip.color }
          }, props.steps?.map((step) => h28("span", { class: "dialkit-timeline-clip-ghost-segment", style: { width: `${step.duration * props.pxPerSecond}px` } }))));
        }
      }
      let cumulative = 0;
      const boundaries2 = props.steps?.map((step) => cumulative += step.duration) ?? [];
      const children = [];
      if (props.composite) {
        if (width > 56) children.push(h28("span", { class: "dialkit-timeline-clip-duration" }, durationText));
      } else if (isSteps) {
        for (const step of props.steps ?? []) {
          const segmentWidth = step.duration * props.pxPerSecond;
          children.push(h28("div", {
            key: step.key ?? "step",
            class: "dialkit-timeline-clip-segment",
            "data-step": step.key,
            "data-selected": props.selectedStepKey === step.key || void 0,
            style: { width: `${segmentWidth}px` }
          }, segmentWidth > 52 ? [h28("span", { class: "dialkit-timeline-clip-duration" }, formatSeconds(step.duration))] : []));
        }
        (props.steps ?? []).forEach((step, index) => {
          if (!step.isPhysics) children.push(h28("div", { key: `boundary:${step.key}`, class: "dialkit-timeline-clip-handle", "data-boundary": index, style: { left: `${boundaries2[index] * props.pxPerSecond - 4}px` } }));
        });
        if (!props.steps?.[0]?.isPhysics) children.push(h28("div", { class: "dialkit-timeline-clip-handle", "data-edge": "start" }));
      } else {
        if (resizable) children.push(h28("div", { class: "dialkit-timeline-clip-handle", "data-edge": "start" }));
        if (width > 56) children.push(h28("span", { class: "dialkit-timeline-clip-duration" }, durationText));
        if (resizable) children.push(h28("div", { class: "dialkit-timeline-clip-handle", "data-edge": "end" }));
      }
      const title = props.composite ? `${props.clip.label} \u2014 composite of its property tracks${looping ? " \xB7 repeats through timeline" : ""} \xB7 click to expand` : `${props.clip.label} \u2014 ${formatSeconds(props.at)} for ${durationText}${props.fixedDuration ? " (duration set by spring physics)" : ""}${looping ? " \xB7 repeats through timeline" : ""}${props.delayMode ? " \xB7 drag to phase-shift" : ""}`;
      return [...ghosts, h28("div", {
        class: "dialkit-timeline-clip",
        "data-steps": isSteps || void 0,
        "data-composite": props.composite || void 0,
        "data-selected": props.selected || void 0,
        "data-dragging": dragging.value || void 0,
        style: { left: `${(props.at - props.viewStart) * props.pxPerSecond}px`, width: `${width}px`, background: props.composite ? `${props.clip.color}80` : props.clip.color },
        title,
        onPointerdown: (event) => {
          if (event.shiftKey) return;
          event.stopPropagation();
          const target = event.target;
          let mode = "move";
          let boundaryIndex;
          if (target.dataset.boundary !== void 0) {
            mode = "boundary";
            boundaryIndex = Number(target.dataset.boundary);
          } else if (!props.fixedDuration) {
            const edge = target.dataset.edge;
            if (edge) mode = edge;
          }
          drag = {
            mode,
            boundaryIndex,
            pointerX: event.clientX,
            at: props.at,
            duration: props.duration,
            stepDurations: props.steps?.map((step) => step.duration),
            clickEl: target.closest?.("[data-step]"),
            moved: false
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        },
        onPointermove: (event) => {
          if (!drag || props.pxPerSecond <= 0) return;
          const dx = event.clientX - drag.pointerX;
          if (!drag.moved) {
            if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
            drag.moved = true;
            dragging.value = true;
            props.onDrag();
          }
          const dt = dx / props.pxPerSecond;
          if (drag.mode === "boundary" && props.steps && drag.stepDurations) {
            const index = drag.boundaryIndex ?? 0;
            const others = drag.stepDurations.reduce((sum, duration, stepIndex) => stepIndex === index ? sum : sum + duration, 0);
            DialStore.updateValue(props.timelineId, `${props.clip.key}.${props.steps[index].key ?? ""}.duration`, clampStepResize(drag.stepDurations[index] + dt, drag.at, others, props.timelineDuration));
          } else if (drag.mode === "move") {
            if (props.delayMode) DialStore.updateValue(props.timelineId, `${props.clip.key}.delay`, clampTrackDelay(drag.at + dt - props.baseAt, props.baseAt, drag.duration, props.timelineDuration));
            else DialStore.updateValue(props.timelineId, `${props.clip.key}.at`, clampClipMove(drag.at + dt, drag.duration, props.timelineDuration));
          } else if (drag.mode === "end") {
            DialStore.updateValue(props.timelineId, `${props.clip.key}.duration`, clampClipResizeEnd(drag.duration + dt, drag.at, props.timelineDuration));
          } else if (props.steps && drag.stepDurations) {
            const next = clampClipResizeStart(Math.max(drag.at + dt, Math.max(props.baseAt, 0)), drag.at, drag.stepDurations[0]);
            DialStore.updateValues(props.timelineId, {
              [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - props.baseAt) : next.at,
              [`${props.clip.key}.${props.steps[0].key ?? ""}.duration`]: next.duration
            });
          } else {
            const next = clampClipResizeStart(Math.max(drag.at + dt, Math.max(props.baseAt, 0)), drag.at, drag.duration);
            DialStore.updateValues(props.timelineId, {
              [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - props.baseAt) : next.at,
              [`${props.clip.key}.duration`]: next.duration
            });
          }
        },
        onPointerup: finish,
        onPointercancel: () => finish(),
        onLostpointercapture: () => finish()
      }, children), looping ? h28("span", { class: "dialkit-timeline-loop-infinity", "aria-hidden": "true", title: "Repeats indefinitely" }, "\u221E") : null];
    };
  }
});

// src/vue/components/ShortcutsMenu.ts
import { defineComponent as defineComponent29, h as h29, onUnmounted as onUnmounted14, ref as ref24, Teleport as Teleport8 } from "vue";
function formatShortcutKey(sc) {
  if (!sc.key) return "\u2014";
  const mod = sc.modifier === "alt" ? "\u2325" : sc.modifier === "shift" ? "\u21E7" : sc.modifier === "meta" ? "\u2318" : "";
  return `${mod}${sc.key.toUpperCase()}`;
}
function formatInteraction(sc) {
  const interaction = sc.interaction ?? "scroll";
  switch (interaction) {
    case "scroll":
      return sc.key ? "key+scroll" : "scroll";
    case "drag":
      return "key+drag";
    case "move":
      return "key+move";
    case "scroll-only":
      return "scroll";
  }
}
var ShortcutsMenu = defineComponent29({
  name: "DialKitShortcutsMenu",
  props: {
    panelId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isOpen = ref24(false);
    const triggerRef = ref24(null);
    const dropdownRef = ref24(null);
    const pos = ref24({ top: 0, right: 0 });
    const open = () => {
      const rect = triggerRef.value?.getBoundingClientRect();
      if (rect) {
        pos.value = { top: rect.bottom + 4, right: window.innerWidth - rect.right };
      }
      isOpen.value = true;
    };
    const close = () => {
      isOpen.value = false;
    };
    const toggle = () => {
      if (isOpen.value) close();
      else open();
    };
    let mousedownHandler = null;
    const addOutsideClickListener = () => {
      mousedownHandler = (e) => {
        const target = e.target;
        if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
        close();
      };
      document.addEventListener("mousedown", mousedownHandler);
    };
    const removeOutsideClickListener = () => {
      if (mousedownHandler) {
        document.removeEventListener("mousedown", mousedownHandler);
        mousedownHandler = null;
      }
    };
    onUnmounted14(() => {
      removeOutsideClickListener();
    });
    return () => {
      const panel = DialStore.getPanel(props.panelId);
      if (!panel) return null;
      const shortcuts = Object.entries(panel.shortcuts);
      if (shortcuts.length === 0) return null;
      const findLabel = (controls, path) => {
        for (const c of controls) {
          if (c.path === path) return c.label;
          if (c.type === "folder" && c.children) {
            const found = findLabel(c.children, path);
            if (found) return found;
          }
        }
        return path;
      };
      const rows = shortcuts.map(([path, shortcut]) => ({
        path,
        shortcut,
        label: findLabel(panel.controls, path)
      }));
      if (isOpen.value) {
        if (!mousedownHandler) addOutsideClickListener();
      } else {
        removeOutsideClickListener();
      }
      return [
        h29("button", {
          ref: triggerRef,
          class: "dialkit-shortcuts-trigger",
          onClick: toggle,
          title: "Keyboard shortcuts"
        }, [
          h29("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            h29("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
            h29("path", { d: "M6 10H6.01" }),
            h29("path", { d: "M10 10H10.01" }),
            h29("path", { d: "M14 10H14.01" }),
            h29("path", { d: "M18 10H18.01" }),
            h29("path", { d: "M8 14H16" })
          ])
        ]),
        isOpen.value ? h29(Teleport8, { to: "body" }, [
          h29("div", {
            ref: dropdownRef,
            class: "dialkit-root dialkit-shortcuts-dropdown",
            style: {
              position: "fixed",
              top: `${pos.value.top}px`,
              right: `${pos.value.right}px`
            }
          }, [
            h29("div", { class: "dialkit-shortcuts-title" }, "Keyboard Shortcuts"),
            h29(
              "div",
              { class: "dialkit-shortcuts-list" },
              rows.map(
                (row) => h29("div", { key: row.path, class: "dialkit-shortcuts-row" }, [
                  h29("span", { class: "dialkit-shortcuts-row-key" }, formatShortcutKey(row.shortcut)),
                  h29("span", { class: "dialkit-shortcuts-row-label" }, row.label),
                  h29("span", { class: "dialkit-shortcuts-row-mode" }, formatInteraction(row.shortcut))
                ])
              )
            ),
            h29("div", { class: "dialkit-shortcuts-hint" }, "See pill badges on controls for keys")
          ])
        ]) : null
      ];
    };
  }
});

// src/vue/components/Module.ts
import { defineComponent as defineComponent30, h as h30 } from "vue";
var Module = defineComponent30({
  name: "DialKitModule",
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    onEnabledChange: { type: Function, default: void 0 }
  },
  emits: ["enabledChange"],
  setup(props, { emit, slots }) {
    const setEnabled = (enabled) => {
      props.onEnabledChange?.(enabled);
      emit("enabledChange", enabled);
    };
    return () => h30("div", { class: "dialkit-module" }, [
      h30("div", { class: "dialkit-module-header" }, [
        h30("span", { class: "dialkit-module-title" }, props.title),
        h30("div", { class: "dialkit-module-switch" }, [
          h30(SegmentedControl, {
            options: [
              { value: "off", label: "Off" },
              { value: "on", label: "On" }
            ],
            value: props.enabled ? "on" : "off",
            onChange: (value) => setEnabled(value === "on")
          })
        ])
      ]),
      h30("div", { class: "dialkit-module-collapse", "data-open": props.enabled }, [
        h30("div", { class: "dialkit-module-collapse-clip" }, [
          h30("div", { class: "dialkit-module-inner" }, slots.default ? slots.default() : [])
        ])
      ])
    ]);
  }
});

// src/vue/components/ButtonGroup.ts
import { defineComponent as defineComponent31, h as h31 } from "vue";
var ButtonGroup = defineComponent31({
  name: "DialKitButtonGroup",
  props: {
    buttons: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    return () => h31(
      "div",
      { class: "dialkit-button-group" },
      props.buttons.map(
        (button) => h31("button", { class: "dialkit-button", onClick: button.onClick }, button.label)
      )
    );
  }
});

// src/vue/components/WaveformVisualization.ts
import { defineComponent as defineComponent32, h as h32, ref as ref25, onMounted as onMounted21, onBeforeUnmount as onBeforeUnmount5 } from "vue";

// src/waveform-dsp.ts
function mixToMono(buffer) {
  if (buffer.numberOfChannels === 1) return buffer.getChannelData(0);
  const len = buffer.length;
  const out = new Float32Array(len);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < len; i++) out[i] += data[i] / buffer.numberOfChannels;
  }
  return out;
}
function fillPeaks(data, cols, min, max) {
  const step = data.length / cols;
  for (let x = 0; x < cols; x++) {
    const start = Math.floor(x * step);
    const end = Math.max(start + 1, Math.min(data.length, Math.floor((x + 1) * step)));
    let mn = 1;
    let mx = -1;
    for (let i = start; i < end; i++) {
      const v = data[i];
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
    min[x] = mn;
    max[x] = mx;
  }
}
function envelope(p, cols, n) {
  const out = new Array(n);
  const seg = cols / n;
  for (let k = 0; k < n; k++) {
    const start = Math.floor(k * seg);
    const end = Math.max(start + 1, Math.min(cols, Math.floor((k + 1) * seg)));
    let a = 0;
    for (let x = start; x < end; x++) {
      const m = Math.max(Math.abs(p.min[x]), Math.abs(p.max[x]));
      if (m > a) a = m;
    }
    out[k] = a;
  }
  return out;
}

// src/waveform-engine.ts
var WAVEFORM_MAX_ZOOM = 8;
var BANDS = [
  { type: "lowpass", freq: 250 },
  { type: "bandpass", freq: 1100, q: 0.6 },
  { type: "highpass", freq: 4200 }
];
var BAND_COLORS = ["#a855f7", "#22d3ee", "#a3e635"];
var SIMPLE_POINTS = 46;
var BORDER_FILL_ALPHA = 0.2;
var DRAG_THRESHOLD = 3;
var EDGE_HIT = 6;
var MIN_LOOP = 1e-3;
function smoothThrough(ctx, pts) {
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    ctx.bezierCurveTo(
      p1.x + (p2.x - p0.x) / 6,
      p1.y + (p2.y - p0.y) / 6,
      p2.x - (p3.x - p1.x) / 6,
      p2.y - (p3.y - p1.y) / 6,
      p2.x,
      p2.y
    );
  }
}
async function filterBuffer(buffer, band) {
  const off = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const src = off.createBufferSource();
  src.buffer = buffer;
  const filter = off.createBiquadFilter();
  filter.type = band.type;
  filter.frequency.value = band.freq;
  if (band.q != null) filter.Q.value = band.q;
  src.connect(filter);
  filter.connect(off.destination);
  src.start();
  return off.startRendering();
}
function createWaveformEngine(canvas, get) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {
  } };
  const readDpr = () => Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
  let dpr = readDpr();
  let W = 0;
  let H = 0;
  let cy = 0;
  let amp = 0;
  let pk = { min: new Float32Array(1), max: new Float32Array(1) };
  const syncSize = (width, height) => {
    dpr = readDpr();
    const nw = Math.round(width * dpr);
    const nh = Math.round(height * dpr);
    if (nw === W && nh === H) return;
    W = canvas.width = nw;
    H = canvas.height = nh;
    cy = H / 2;
    amp = H * 0.42;
    pk = { min: new Float32Array(W), max: new Float32Array(W) };
  };
  let monos = [];
  let monoToken = 0;
  let lastBuffer;
  let lastBands = false;
  const syncMonos = (buffer, bands) => {
    if (buffer === lastBuffer && bands === lastBands) return;
    lastBuffer = buffer;
    lastBands = bands;
    const token = ++monoToken;
    if (!buffer) {
      monos = [];
      return;
    }
    if (!bands) {
      monos = [mixToMono(buffer)];
      return;
    }
    (async () => {
      try {
        const bufs = await Promise.all(BANDS.map((b) => filterBuffer(buffer, b)));
        if (token !== monoToken) return;
        monos = bufs.map((b) => mixToMono(b));
      } catch {
      }
    })();
  };
  const columnWidth2 = (pixelSize) => Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSize)));
  const windowState = { start: 0, win: 1 };
  let drag = null;
  const drawColumns = (p, color, pixelSize) => {
    const colW = columnWidth2(pixelSize);
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    for (let x = 0; x < W; x += colW) {
      let mn = 1;
      let mx = -1;
      for (let i = x; i < x + colW && i < W; i++) {
        if (p.min[i] < mn) mn = p.min[i];
        if (p.max[i] > mx) mx = p.max[i];
      }
      const yTop = Math.round(cy - mx * amp);
      const yBot = Math.round(cy - mn * amp);
      ctx.fillRect(x, yTop, colW, Math.max(1, yBot - yTop));
    }
  };
  const drawSimplified = (env, color, outline) => {
    const n = env.length;
    if (n < 2) return;
    const px = (k) => k / (n - 1) * W;
    const top = env.map((a, k) => ({ x: px(k), y: cy - a * amp }));
    const bot = [];
    for (let k = n - 1; k >= 0; k--) bot.push({ x: px(k), y: cy + env[k] * amp });
    ctx.beginPath();
    ctx.moveTo(top[0].x, top[0].y);
    smoothThrough(ctx, top);
    ctx.lineTo(bot[0].x, bot[0].y);
    smoothThrough(ctx, bot);
    ctx.closePath();
    ctx.fillStyle = color;
    if (outline) {
      ctx.globalAlpha = BORDER_FILL_ALPHA;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6 * dpr;
      ctx.lineJoin = "round";
      ctx.stroke();
    } else {
      ctx.globalAlpha = 1;
      ctx.fill();
    }
  };
  const drawGrid = (base, subs) => {
    const n = Math.max(1, Math.round(subs));
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
      const x = Math.round(i / n * W) + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const drawRegion = (a, b, start, win, color) => {
    const x0 = (a - start) / win * W;
    const x1 = (b - start) / win * W;
    const cx0 = Math.max(0, x0);
    const cx1 = Math.min(W, x1);
    if (cx1 <= cx0) return;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.14;
    ctx.fillRect(cx0, 0, cx1 - cx0, H);
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = dpr;
    ctx.strokeStyle = color;
    ctx.beginPath();
    if (x0 >= 0 && x0 <= W) {
      const xe = Math.round(x0) + 0.5;
      ctx.moveTo(xe, 0);
      ctx.lineTo(xe, H);
    }
    if (x1 >= 0 && x1 <= W) {
      const xe = Math.round(x1) + 0.5;
      ctx.moveTo(xe, 0);
      ctx.lineTo(xe, H);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  let raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const rt = get();
    syncSize(rt.width, rt.height);
    syncMonos(rt.buffer, rt.bands);
    const base = getComputedStyle(canvas).color || "rgb(255,255,255)";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = rt.mode === "smooth";
    if (rt.grid) drawGrid(base, rt.gridSubdivisions);
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(cy) + 0.5);
    ctx.lineTo(W, Math.round(cy) + 0.5);
    ctx.stroke();
    ctx.globalAlpha = 1;
    const wave = rt.waveColor || base;
    const ph = rt.playheadColor || base;
    const prog = Math.max(0, Math.min(1, (rt.getProgress ? rt.getProgress() : rt.progress) || 0));
    let win;
    let start;
    const activeLoop = rt.autoZoomOnLoop ? rt.loop : null;
    if (activeLoop) {
      const span = Math.max(1e-4, activeLoop.end - activeLoop.start);
      win = Math.min(1, Math.max(1 / WAVEFORM_MAX_ZOOM, span * 1.2));
      start = (activeLoop.start + activeLoop.end) / 2 - win / 2;
    } else {
      win = 1 / Math.max(1, rt.zoom);
      start = prog - win / 2;
    }
    if (start < 0) start = 0;
    else if (start > 1 - win) start = 1 - win;
    const end = start + win;
    windowState.start = start;
    windowState.win = win;
    const count = monos.length;
    if (count) {
      for (let i = 0; i < count; i++) {
        const mono = monos[i];
        const s0 = Math.max(0, Math.floor(start * mono.length));
        const s1 = Math.min(mono.length, Math.ceil(end * mono.length));
        const slice = s1 > s0 ? mono.subarray(s0, s1) : mono;
        fillPeaks(slice, W, pk.min, pk.max);
        const color = count === 3 ? BAND_COLORS[i] : wave;
        if (rt.mode === "pixelated") drawColumns(pk, color, rt.pixelSize);
        else drawSimplified(envelope(pk, W, SIMPLE_POINTS), color, rt.border);
      }
    }
    if (drag && drag.moved) {
      drawRegion(Math.min(drag.anchor, drag.curProg), Math.max(drag.anchor, drag.curProg), start, win, ph);
    } else if (rt.loop) {
      drawRegion(rt.loop.start, rt.loop.end, start, win, ph);
    }
    if (count) {
      const playX = (prog - start) / win * W;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ph;
      ctx.lineWidth = 1.5 * dpr;
      const cxp = Math.round(Math.max(0, Math.min(W, playX))) + 0.5;
      ctx.beginPath();
      ctx.moveTo(cxp, 0);
      ctx.lineTo(cxp, H);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
  const xToProgress = (clientX) => {
    const rect = canvas.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const { start, win } = windowState;
    return Math.min(1, Math.max(0, start + fx * win));
  };
  const edgeAt = (clientX) => {
    const rt = get();
    const loop = rt.loop;
    if (!loop || !rt.onLoopChange) return null;
    const rect = canvas.getBoundingClientRect();
    const { start, win } = windowState;
    const xOf = (t) => (t - start) / win * rect.width;
    const px = clientX - rect.left;
    const sx = xOf(loop.start);
    const ex = xOf(loop.end);
    const dS = Math.abs(px - sx);
    const dE = Math.abs(px - ex);
    if (dS <= EDGE_HIT && dS <= dE && sx >= 0 && sx <= rect.width) return "start";
    if (dE <= EDGE_HIT && ex >= 0 && ex <= rect.width) return "end";
    return null;
  };
  const setCursor = (c) => {
    canvas.style.cursor = c;
  };
  const onPointerDown = (e) => {
    const rt = get();
    if (!rt.onSeek && !rt.onLoopChange) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
    }
    const p = xToProgress(e.clientX);
    const edge = edgeAt(e.clientX);
    if (edge && rt.loop) {
      const anchor = edge === "start" ? rt.loop.end : rt.loop.start;
      drag = { mode: "resize", anchor, curProg: p, startX: e.clientX, moved: false };
      setCursor("ew-resize");
    } else {
      drag = { mode: "create", anchor: p, curProg: p, startX: e.clientX, moved: false };
    }
  };
  const onPointerMove = (e) => {
    if (drag) {
      drag.curProg = xToProgress(e.clientX);
      if (Math.abs(e.clientX - drag.startX) > DRAG_THRESHOLD) drag.moved = true;
      return;
    }
    const rt = get();
    if (!rt.onSeek && !rt.onLoopChange) return;
    setCursor(edgeAt(e.clientX) ? "ew-resize" : "crosshair");
  };
  const onPointerUp = (e) => {
    const d = drag;
    drag = null;
    if (!d) return;
    try {
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    } catch {
    }
    setCursor("crosshair");
    const rt = get();
    const a = Math.min(d.anchor, d.curProg);
    const b = Math.max(d.anchor, d.curProg);
    const wide = b - a >= MIN_LOOP;
    if (d.mode === "resize") {
      if (d.moved && wide) rt.onLoopChange?.({ start: a, end: b });
    } else if (d.moved && wide) {
      if (rt.onLoopChange) rt.onLoopChange({ start: a, end: b });
      else rt.onSeek?.(d.curProg);
    } else {
      rt.onSeek?.(d.anchor);
      if (rt.loop && rt.onLoopChange) rt.onLoopChange(null);
    }
  };
  const onPointerCancel = () => {
    drag = null;
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("lostpointercapture", onPointerCancel);
  const rt0 = get();
  if (rt0.onSeek || rt0.onLoopChange) {
    canvas.style.cursor = "crosshair";
    canvas.style.touchAction = "none";
  }
  frame();
  return {
    destroy() {
      cancelAnimationFrame(raf);
      monoToken++;
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("lostpointercapture", onPointerCancel);
    }
  };
}

// src/vue/components/WaveformVisualization.ts
var WaveformVisualization = defineComponent32({
  name: "DialKitWaveformVisualization",
  props: {
    buffer: { type: Object, default: null },
    progress: { type: Number, default: 0 },
    getProgress: { type: Function, default: void 0 },
    mode: { type: String, default: "smooth" },
    border: { type: Boolean, default: false },
    bands: { type: Boolean, default: false },
    pixelSize: { type: Number, default: 1 },
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    onSeek: { type: Function, default: void 0 },
    loop: { type: Object, default: null },
    onLoopChange: { type: Function, default: void 0 },
    waveColor: { type: String, default: void 0 },
    playheadColor: { type: String, default: void 0 },
    autoZoomOnLoop: { type: Boolean, default: false },
    width: { type: Number, default: 256 },
    height: { type: Number, default: 140 }
  },
  setup(props) {
    const canvasRef = ref25(null);
    const zoom = ref25(1);
    let engine = null;
    onMounted21(() => {
      if (!canvasRef.value) return;
      engine = createWaveformEngine(
        canvasRef.value,
        () => ({
          buffer: props.buffer,
          progress: props.progress,
          getProgress: props.getProgress,
          mode: props.mode,
          border: props.border,
          bands: props.bands,
          pixelSize: props.pixelSize,
          grid: props.grid,
          gridSubdivisions: props.gridSubdivisions,
          waveColor: props.waveColor,
          playheadColor: props.playheadColor,
          autoZoomOnLoop: props.autoZoomOnLoop,
          loop: props.loop,
          zoom: zoom.value,
          width: props.width,
          height: props.height,
          onSeek: props.onSeek,
          onLoopChange: props.onLoopChange
        })
      );
    });
    onBeforeUnmount5(() => engine?.destroy());
    const minusIcon = () => h32("svg", { viewBox: "0 0 16 16", fill: "none" }, [
      h32("path", { d: "M3.5 8h9", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" })
    ]);
    const plusIcon = () => h32("svg", { viewBox: "0 0 16 16", fill: "none" }, [
      h32("path", { d: "M8 3.5v9M3.5 8h9", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" })
    ]);
    return () => {
      const framingLoop = props.autoZoomOnLoop && !!props.loop;
      const children = [
        h32("canvas", {
          ref: canvasRef,
          class: "dialkit-waveform-viz",
          style: { width: `${props.width}px`, height: `${props.height}px` }
        })
      ];
      if (!framingLoop) {
        const buttons = [];
        if (zoom.value > 1) {
          buttons.push(
            h32(
              "button",
              {
                type: "button",
                "aria-label": "Zoom out",
                onClick: () => {
                  zoom.value = Math.max(1, zoom.value / 2);
                }
              },
              [minusIcon()]
            )
          );
        }
        buttons.push(
          h32(
            "button",
            {
              type: "button",
              "aria-label": "Zoom in",
              disabled: zoom.value >= WAVEFORM_MAX_ZOOM,
              onClick: () => {
                zoom.value = Math.min(WAVEFORM_MAX_ZOOM, zoom.value * 2);
              }
            },
            [plusIcon()]
          )
        );
        children.push(h32("div", { class: "dialkit-waveform-zoom" }, buttons));
      }
      return h32("div", { class: "dialkit-waveform-viz-wrap", style: { width: `${props.width}px` } }, children);
    };
  }
});

// src/vue/components/AnalyserVisualization.ts
import { defineComponent as defineComponent33, h as h33, ref as ref26, onMounted as onMounted22, onBeforeUnmount as onBeforeUnmount6 } from "vue";

// src/analyser-core.ts
function byteFreqToUnit(v) {
  return v / 255;
}
function byteTimeToUnit(v) {
  return (v - 128) / 128;
}
function binRange(point, points, bins, scale) {
  if (bins <= 2) return { start: Math.max(0, bins - 1), end: Math.max(1, bins) };
  const lo = 1;
  const at = (t) => scale === "log" ? Math.pow(bins, t) * lo : lo + (bins - lo) * t;
  let start = Math.floor(at(point / points));
  start = Math.max(lo, Math.min(bins - 1, start));
  const end = Math.max(start + 1, Math.min(bins, Math.floor(at((point + 1) / points))));
  return { start, end };
}
function fillFrequencyTargets(data, out, scale) {
  const points = out.length;
  for (let i = 0; i < points; i++) {
    const { start, end } = binRange(i, points, data.length, scale);
    let mx = 0;
    for (let b = start; b < end; b++) {
      if (data[b] > mx) mx = data[b];
    }
    out[i] = byteFreqToUnit(mx);
  }
}
function fillWaveformMinMax(data, cols, min, max) {
  const step = data.length / cols;
  for (let x = 0; x < cols; x++) {
    const start = Math.floor(x * step);
    const end = Math.max(start + 1, Math.min(data.length, Math.floor((x + 1) * step)));
    let mn = 1;
    let mx = -1;
    for (let i = start; i < end; i++) {
      const v = byteTimeToUnit(data[i]);
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
    min[x] = mn;
    max[x] = mx;
  }
}
function resampleWaveform(data, out) {
  const n = out.length;
  if (!n) return;
  if (!data.length) {
    out.fill(0);
    return;
  }
  if (n === 1 || data.length === 1) {
    out.fill(byteTimeToUnit(data[0]));
    return;
  }
  const step = (data.length - 1) / (n - 1);
  for (let i = 0; i < n; i++) {
    const x = i * step;
    const j = Math.floor(x);
    const a = byteTimeToUnit(data[j]);
    const b = byteTimeToUnit(data[Math.min(data.length - 1, j + 1)]);
    out[i] = a + (b - a) * (x - j);
  }
}
var SPRING_MAX_STEP = 1 / 240;
function stepSprings(pos, vel, targets, stiffness, damping, dt) {
  let remaining = dt;
  while (remaining > 0) {
    const h35 = Math.min(remaining, SPRING_MAX_STEP);
    remaining -= h35;
    for (let i = 0; i < pos.length; i++) {
      const accel = -stiffness * (pos[i] - targets[i]) - damping * vel[i];
      vel[i] += accel * h35;
      pos[i] += vel[i] * h35;
    }
  }
}
var SPRING_DEFAULT_STIFFNESS = 120;
var SPRING_DEFAULT_DAMPING = 14;
function normalizeSpring(spring) {
  if (!spring) return null;
  const raw = spring === true ? {} : spring;
  return {
    stiffness: Math.min(1e3, Math.max(1, raw.stiffness ?? SPRING_DEFAULT_STIFFNESS)),
    damping: Math.min(100, Math.max(1, raw.damping ?? SPRING_DEFAULT_DAMPING))
  };
}
function columnWidth(dpr, pixelSize) {
  return Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSize)));
}
function quantizeToGrid(v, colW) {
  return Math.round(v / colW) * colW;
}

// src/analyser-engine.ts
var SMOOTH_POINTS = 64;
var AREA_FILL_ALPHA = 0.2;
var MUTED_ALPHA = 0.35;
var FREQ_AMP = 0.92;
var WAVE_AMP = 0.42;
var MAX_DT = 0.05;
function smoothThrough2(ctx, pts) {
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    ctx.bezierCurveTo(
      p1.x + (p2.x - p0.x) / 6,
      p1.y + (p2.y - p0.y) / 6,
      p2.x - (p3.x - p1.x) / 6,
      p2.y - (p3.y - p1.y) / 6,
      p2.x,
      p2.y
    );
  }
}
function createAnalyserEngine(canvas, get) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {
  } };
  const readDpr = () => Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
  let dpr = readDpr();
  let W = 0;
  let H = 0;
  let cy = 0;
  const syncSize = (width, height) => {
    dpr = readDpr();
    const nw = Math.round(width * dpr);
    const nh = Math.round(height * dpr);
    if (nw === W && nh === H) return;
    W = canvas.width = nw;
    H = canvas.height = nh;
    cy = H / 2;
  };
  const columnWidth2 = (pixelSize) => columnWidth(dpr, pixelSize);
  let bytes = new Uint8Array(0);
  let targetsA = new Float32Array(0);
  let targetsB = new Float32Array(0);
  let posA = new Float32Array(0);
  let posB = new Float32Array(0);
  let velA = new Float32Array(0);
  let velB = new Float32Array(0);
  let springSeeded = false;
  const syncPoints = (n) => {
    if (targetsA.length === n) return;
    targetsA = new Float32Array(n);
    targetsB = new Float32Array(n);
    posA = new Float32Array(n);
    posB = new Float32Array(n);
    velA = new Float32Array(n);
    velB = new Float32Array(n);
    springSeeded = false;
  };
  const drawGrid = (base, subs) => {
    const n = Math.max(1, Math.round(subs));
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
      const x = Math.round(i / n * W) + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const baselineY = (source) => source === "frequency" ? H - Math.round(dpr) : cy;
  const drawBaseline = (base, source, alpha) => {
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.15 * alpha;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    const y = Math.round(baselineY(source)) + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const drawBand = (top, bottom, wave, fill, alpha) => {
    const n = top.length;
    if (n < 2) return;
    const px = (k) => k / (n - 1) * W;
    const toY = (v) => cy - v * (H * WAVE_AMP);
    const topPts = new Array(n);
    for (let k = 0; k < n; k++) topPts[k] = { x: px(k), y: toY(top[k]) };
    const botPts = new Array(n);
    for (let k = 0; k < n; k++) botPts[k] = { x: px(n - 1 - k), y: toY(bottom[n - 1 - k]) };
    ctx.beginPath();
    ctx.moveTo(topPts[0].x, topPts[0].y);
    smoothThrough2(ctx, topPts);
    ctx.lineTo(botPts[0].x, botPts[0].y);
    smoothThrough2(ctx, botPts);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.globalAlpha = AREA_FILL_ALPHA * alpha;
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const drawSmooth = (values, toY, baseY, area, wave, fill, alpha) => {
    const n = values.length;
    if (n < 2) return;
    const pts = new Array(n);
    for (let k = 0; k < n; k++) pts[k] = { x: k / (n - 1) * W, y: toY(values[k]) };
    if (area) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      smoothThrough2(ctx, pts);
      ctx.lineTo(W, baseY);
      ctx.lineTo(0, baseY);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.globalAlpha = AREA_FILL_ALPHA * alpha;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    smoothThrough2(ctx, pts);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const drawColumns = (source, variant, pixelSize, wave, alpha) => {
    const colW = columnWidth2(pixelSize);
    ctx.fillStyle = wave;
    ctx.globalAlpha = alpha;
    const n = targetsA.length;
    const src = springActive ? posA : targetsA;
    const srcB = springActive ? posB : targetsB;
    for (let k = 0; k < n; k++) {
      const x = k * colW;
      if (x >= W) break;
      if (source === "frequency") {
        const yTop = Math.max(0, Math.min(H - colW, quantizeToGrid(H - src[k] * (H * FREQ_AMP), colW)));
        if (variant === "area") ctx.fillRect(x, yTop, colW, H - yTop);
        else ctx.fillRect(x, yTop, colW, colW);
      } else {
        const yTop = Math.round(cy - src[k] * (H * WAVE_AMP));
        const yBot = Math.round(cy - srcB[k] * (H * WAVE_AMP));
        if (variant === "area") {
          const t = Math.max(0, Math.min(H - 1, yTop));
          ctx.fillRect(x, t, colW, Math.max(1, yBot - t));
        } else {
          const block = (yEdge) => {
            const y = Math.max(0, Math.min(H - colW, quantizeToGrid(yEdge - colW / 2, colW)));
            ctx.fillRect(x, y, colW, colW);
          };
          block(yTop);
          block(yBot);
        }
      }
    }
    ctx.globalAlpha = 1;
  };
  let springActive = false;
  let prevNow = null;
  let raf = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const rt = get();
    syncSize(rt.width, rt.height);
    const dt = prevNow == null ? 0 : Math.min((now - prevNow) / 1e3, MAX_DT);
    prevNow = now;
    const base = getComputedStyle(canvas).color || "rgb(255,255,255)";
    const alpha = rt.muted ? MUTED_ALPHA : 1;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = rt.mode === "smooth";
    if (rt.grid) drawGrid(base, rt.gridSubdivisions);
    drawBaseline(base, rt.source, alpha);
    const an = rt.analyser;
    if (!an) return;
    const needed = rt.source === "frequency" ? an.frequencyBinCount : an.fftSize;
    if (bytes.length !== needed) bytes = new Uint8Array(needed);
    if (rt.source === "frequency") an.getByteFrequencyData(bytes);
    else an.getByteTimeDomainData(bytes);
    const pixelated = rt.mode === "pixelated";
    const n = pixelated ? Math.max(2, Math.ceil(W / columnWidth2(rt.pixelSize))) : SMOOTH_POINTS;
    syncPoints(n);
    const twoSeries = rt.source === "waveform" && (pixelated || rt.variant === "area");
    if (rt.source === "frequency") {
      fillFrequencyTargets(bytes, targetsA, rt.scale);
    } else if (twoSeries) {
      fillWaveformMinMax(bytes, n, targetsB, targetsA);
    } else {
      resampleWaveform(bytes, targetsA);
    }
    const spring = normalizeSpring(rt.spring);
    springActive = !!spring;
    if (spring) {
      if (!springSeeded) {
        posA.set(targetsA);
        posB.set(targetsB);
        velA.fill(0);
        velB.fill(0);
        springSeeded = true;
      }
      stepSprings(posA, velA, targetsA, spring.stiffness, spring.damping, dt);
      if (twoSeries) stepSprings(posB, velB, targetsB, spring.stiffness, spring.damping, dt);
    } else {
      springSeeded = false;
    }
    const wave = rt.waveColor || base;
    const fill = rt.fillColor || wave;
    if (pixelated) {
      drawColumns(rt.source, rt.variant, rt.pixelSize, wave, alpha);
    } else {
      const values = springActive ? posA : targetsA;
      if (rt.source === "frequency") {
        drawSmooth(values, (v) => H - v * (H * FREQ_AMP), baselineY("frequency"), rt.variant === "area", wave, fill, alpha);
      } else if (rt.variant === "area") {
        drawBand(values, springActive ? posB : targetsB, wave, fill, alpha);
      } else {
        drawSmooth(values, (v) => cy - v * (H * WAVE_AMP), cy, false, wave, fill, alpha);
      }
    }
  };
  raf = requestAnimationFrame(frame);
  return {
    destroy() {
      cancelAnimationFrame(raf);
    }
  };
}

// src/vue/components/AnalyserVisualization.ts
var AnalyserVisualization = defineComponent33({
  name: "DialKitAnalyserVisualization",
  props: {
    analyser: { type: Object, default: null },
    source: { type: String, default: "frequency" },
    variant: { type: String, default: "area" },
    mode: { type: String, default: "smooth" },
    pixelSize: { type: Number, default: 1 },
    scale: { type: String, default: "log" },
    spring: { type: [Boolean, Object], default: false },
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    waveColor: { type: String, default: void 0 },
    fillColor: { type: String, default: void 0 },
    muted: { type: Boolean, default: false },
    onMuteChange: { type: Function, default: void 0 },
    soloed: { type: Boolean, default: false },
    onSoloChange: { type: Function, default: void 0 },
    width: { type: Number, default: 256 },
    height: { type: Number, default: 140 }
  },
  setup(props) {
    const canvasRef = ref26(null);
    let engine = null;
    onMounted22(() => {
      if (!canvasRef.value) return;
      engine = createAnalyserEngine(
        canvasRef.value,
        () => ({
          analyser: props.analyser,
          source: props.source,
          variant: props.variant,
          mode: props.mode,
          pixelSize: props.pixelSize,
          scale: props.scale,
          spring: props.spring,
          grid: props.grid,
          gridSubdivisions: props.gridSubdivisions,
          waveColor: props.waveColor,
          fillColor: props.fillColor,
          muted: props.muted,
          width: props.width,
          height: props.height
        })
      );
    });
    onBeforeUnmount6(() => engine?.destroy());
    return () => {
      const children = [
        h33("canvas", {
          ref: canvasRef,
          class: "dialkit-analyser-viz",
          style: { width: `${props.width}px`, height: `${props.height}px` }
        })
      ];
      if (props.onMuteChange || props.onSoloChange) {
        const buttons = [];
        if (props.onMuteChange) {
          buttons.push(
            h33(
              "button",
              {
                type: "button",
                "aria-label": "Mute",
                "aria-pressed": props.muted,
                onClick: () => props.onMuteChange?.(!props.muted)
              },
              "M"
            )
          );
        }
        if (props.onSoloChange) {
          buttons.push(
            h33(
              "button",
              {
                type: "button",
                "aria-label": "Solo",
                "aria-pressed": props.soloed,
                onClick: () => props.onSoloChange?.(!props.soloed)
              },
              "S"
            )
          );
        }
        children.push(h33("div", { class: "dialkit-analyser-actions" }, buttons));
      }
      return h33("div", { class: "dialkit-analyser-viz-wrap", style: { width: `${props.width}px` } }, children);
    };
  }
});

// src/vue/components/CurveComposer.ts
import {
  defineComponent as defineComponent34,
  h as h34,
  ref as ref27,
  computed as computed12,
  onMounted as onMounted23,
  onBeforeUnmount as onBeforeUnmount7
} from "vue";

// src/curve-composer-core.ts
var CURVE_CYCLE = ["linear", "easeIn", "easeOut", "easeInOut", "spring"];
var easingPresets = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1]
};
var DRAG_THRESHOLD2 = 3;
var EDGE_HIT2 = 6;
var CURVE_MIN_WEIGHT_FRAC = 0.06;
var lerp = (a, b, t) => a + (b - a) * t;
var clamp013 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
var clampBipolar = (v) => v < -1 ? -1 : v > 1 ? 1 : v;
var SKEW_MAX = 0.45;
var BACK_MAX = 0.8;
var easingExtremes = {
  linear: [0, 0, 1, 1],
  easeIn: [0.7, 0, 0.84, 0],
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.87, 0, 0.13, 1]
};
var lerp4 = (a, b, t) => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
  lerp(a[3], b[3], t)
];
function deriveEase(type, curvature, steepness = 0, overshoot = 0, anticipate = 0) {
  const key = type === "spring" ? "linear" : type;
  const base = easingPresets[key];
  const s = clampBipolar(steepness);
  const pts = s >= 0 ? lerp4(base, easingExtremes[key], s) : lerp4(easingPresets.linear, base, s + 1);
  let [x1, y1, x2, y2] = pts;
  const shift = clampBipolar(curvature) * SKEW_MAX;
  x1 = clamp013(x1 + shift);
  x2 = clamp013(x2 + shift);
  y2 += clamp013(overshoot) * BACK_MAX;
  y1 -= clamp013(anticipate) * BACK_MAX;
  return [x1, y1, x2, y2];
}
function bezierAxis2(p1, p2, s) {
  const u = 1 - s;
  return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s;
}
function bezierAxisDeriv(p1, p2, s) {
  const u = 1 - s;
  return 3 * u * u * p1 + 6 * u * s * (p2 - p1) + 3 * s * s * (1 - p2);
}
function bezierY(ease, x) {
  const tx = clamp013(x);
  let s = tx;
  for (let i = 0; i < 6; i++) {
    const xs = bezierAxis2(ease[0], ease[2], s) - tx;
    if (Math.abs(xs) < 1e-5) break;
    const d = bezierAxisDeriv(ease[0], ease[2], s);
    if (Math.abs(d) < 1e-6) break;
    s = clamp013(s - xs / d);
  }
  return bezierAxis2(ease[1], ease[3], s);
}
var SPRING_SAMPLES = 72;
function springPoints(curvature, steepness = 0) {
  const visualDuration = 1;
  const bounce = clamp013((clampBipolar(curvature) + 1) / 2) * 0.6;
  const mass = 1;
  let stiffness = 2 * Math.PI / visualDuration;
  stiffness = stiffness * stiffness;
  stiffness *= Math.max(0.2, 1 + clampBipolar(steepness) * 0.9);
  const dampingRatio = 1 - bounce;
  const damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
  const raw = [];
  const steps = SPRING_SAMPLES;
  const dt = visualDuration / steps;
  let position = 0;
  let velocity = 0;
  for (let i = 0; i <= steps; i++) {
    raw.push(position);
    const acceleration = (-stiffness * (position - 1) - damping * velocity) / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
  }
  return raw;
}
function interp(points, t) {
  const x = clamp013(t) * (points.length - 1);
  const i = Math.floor(x);
  if (i >= points.length - 1) return points[points.length - 1];
  return lerp(points[i], points[i + 1], x - i);
}
function buildSampler(curve) {
  let base;
  if (curve.type === "spring") {
    const pts = springPoints(curve.curvature, curve.steepness);
    base = (t) => interp(pts, t);
  } else {
    const ease = deriveEase(curve.type, curve.curvature, curve.steepness, curve.overshoot, curve.anticipate);
    base = (t) => bezierY(ease, t);
  }
  const { flipX, flipY } = curve;
  if (!flipX && !flipY) return base;
  return (t) => {
    const v = base(flipX ? 1 - t : t);
    return flipY ? 1 - v : v;
  };
}
function totalWeight(segments) {
  let t = 0;
  for (const s of segments) t += Math.max(0, s.weight);
  return t || 1;
}
function timelineSlots(segments, gap = 0) {
  const n = segments.length;
  const g = n > 1 ? clamp013(gap) : 0;
  const total = totalWeight(segments);
  const content = 1 - g;
  const gapW = n > 1 ? g / (n - 1) : 0;
  const slots = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const sw = Math.max(0, segments[i].weight) / total * content;
    slots.push({ kind: "segment", index: i, a: acc, b: acc + sw });
    acc += sw;
    if (i < n - 1) {
      slots.push({ kind: "gap", index: i, a: acc, b: acc + gapW });
      acc += gapW;
    }
  }
  return slots;
}
function boundaries(segments, gap = 0) {
  if (gap > 0 && segments.length > 1) return [];
  const total = totalWeight(segments);
  const out = [];
  let acc = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    acc += segments[i].weight;
    out.push(acc / total);
  }
  return out;
}
function segmentSpan(segments, index, gap = 0) {
  if (gap > 0) {
    const slot = timelineSlots(segments, gap).find((s) => s.kind === "segment" && s.index === index);
    if (slot) return [slot.a, slot.b];
  }
  const total = totalWeight(segments);
  let acc = 0;
  for (let i = 0; i < index; i++) acc += segments[i].weight;
  return [acc / total, (acc + segments[index].weight) / total];
}
function segmentIndexAt(xNorm, segments, gap = 0) {
  if (gap > 0) {
    const x2 = clamp013(xNorm);
    const slots = timelineSlots(segments, gap);
    for (const s of slots) if (x2 < s.b) return s.index;
    return segments.length - 1;
  }
  const total = totalWeight(segments);
  const x = clamp013(xNorm) * total;
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].weight;
    if (x <= acc) return i;
  }
  return segments.length - 1;
}
function boundaryAt(xNorm, segments, edgeHitNorm, gap = 0) {
  if (segments.length < 2) return null;
  const bs = boundaries(segments, gap);
  let best = null;
  let bestDist = edgeHitNorm;
  for (let i = 0; i < bs.length; i++) {
    const d = Math.abs(xNorm - bs[i]);
    if (d <= bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}
function smootherstep(t) {
  const x = clamp013(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
}
function cloneSegments(comp, segments) {
  return { ...comp, segments };
}
function splitSegment(comp, index) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next.splice(index + 1, 0, { ...src });
  return cloneSegments(comp, next.map((s) => ({ ...s, weight: 1 })));
}
function cycleSegmentType(comp, index) {
  const src = comp.segments[index];
  if (!src) return comp;
  const type = CURVE_CYCLE[(CURVE_CYCLE.indexOf(src.type) + 1) % CURVE_CYCLE.length];
  const next = comp.segments.slice();
  next[index] = { ...src, type, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 };
  return cloneSegments(comp, next);
}
function setSegmentCurvature(comp, index, curvature) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, curvature: clampBipolar(curvature) };
  return cloneSegments(comp, next);
}
function setSegmentSteepness(comp, index, steepness) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, steepness: clampBipolar(steepness) };
  return cloneSegments(comp, next);
}
function redistributeWeight(comp, boundaryIndex, deltaFrac) {
  const segs = comp.segments;
  const i = boundaryIndex;
  if (i < 0 || i >= segs.length - 1) return comp;
  const total = totalWeight(segs);
  const span = segs[i].weight + segs[i + 1].weight;
  const minW = CURVE_MIN_WEIGHT_FRAC * total;
  let wi = segs[i].weight + deltaFrac * total;
  wi = Math.max(minW, Math.min(span - minW, wi));
  const next = segs.slice();
  next[i] = { ...segs[i], weight: wi };
  next[i + 1] = { ...segs[i + 1], weight: span - wi };
  return cloneSegments(comp, next);
}
function cycleDriverType(comp) {
  if (!comp.driver) return comp;
  const type = CURVE_CYCLE[(CURVE_CYCLE.indexOf(comp.driver.type) + 1) % CURVE_CYCLE.length];
  return { ...comp, driver: { ...comp.driver, type, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 } };
}
function setDriverCurvature(comp, curvature) {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, curvature: clampBipolar(curvature) } };
}
function setDriverSteepness(comp, steepness) {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, steepness: clampBipolar(steepness) } };
}
var DRAG_ENERGY_GAIN = 0.6;
var DRAG_STEEP_GAIN = 0.6;
var COMPOSER_HEADER_H = 16;
function headerHit(xN, py, segments, layout) {
  if (py >= 0 && py < COMPOSER_HEADER_H) return segmentIndexAt(xN, segments, layout.gap ?? 0);
  if (layout.driverY != null && py >= layout.driverY && py < layout.driverY + COMPOSER_HEADER_H) return "driver";
  return null;
}
function toLocalCoords(clientX, clientY, rect, totalH) {
  const xN = clamp013((clientX - rect.left) / (rect.width || 1));
  const py = (clientY - rect.top) / (rect.height || 1) * totalH;
  return { xN, py };
}
function pointerTarget(xN, py, segments, layout, edgeHitNorm) {
  const gap = layout.gap ?? 0;
  if (layout.driverY != null && py >= layout.driverY) return { kind: "driver" };
  const b = boundaryAt(xN, segments, edgeHitNorm, gap);
  if (b != null) return { kind: "boundary", index: b };
  return { kind: "segment", index: segmentIndexAt(xN, segments, gap) };
}
function applySegmentBodyDrag(comp, index, baseCurvature, baseSteepness, dxFrac, dyFrac) {
  const next = setSegmentCurvature(comp, index, baseCurvature + dxFrac / DRAG_ENERGY_GAIN);
  return setSegmentSteepness(next, index, baseSteepness - dyFrac / DRAG_STEEP_GAIN);
}
function applyDriverBodyDrag(comp, baseCurvature, baseSteepness, dxFrac, dyFrac) {
  const next = setDriverCurvature(comp, baseCurvature + dxFrac / DRAG_ENERGY_GAIN);
  return setDriverSteepness(next, baseSteepness - dyFrac / DRAG_STEEP_GAIN);
}
function buildSamplers(comp) {
  return {
    segments: comp.segments.map(buildSampler),
    driver: comp.driver ? buildSampler(comp.driver) : null
  };
}
function directionPhase(u, dir) {
  const x = clamp013(u);
  if (dir === "reverse") return 1 - x;
  if (dir === "mirror") return 1 - Math.abs(1 - 2 * x);
  return x;
}
function readComposition(comp, u, s) {
  const inputPhase = directionPhase(u, comp.direction);
  const warpedPhase = s.driver ? clamp013(s.driver(inputPhase)) : inputPhase;
  const gap = comp.gap ?? 0;
  if (gap > 0 && comp.segments.length > 1) {
    const slots = timelineSlots(comp.segments, gap);
    const slot = slots.find((sl) => warpedPhase < sl.b) ?? slots[slots.length - 1];
    const localT2 = slot.b > slot.a ? (warpedPhase - slot.a) / (slot.b - slot.a) : 0;
    if (slot.kind === "segment") {
      const value3 = s.segments[slot.index] ? s.segments[slot.index](localT2) : 0;
      return { inputPhase, warpedPhase, value: value3, segIndex: slot.index, localT: localT2 };
    }
    const n = comp.segments.length;
    const endVal = s.segments[slot.index] ? s.segments[slot.index](1) : 0;
    const startVal = s.segments[(slot.index + 1) % n] ? s.segments[(slot.index + 1) % n](0) : 0;
    const value2 = lerp(endVal, startVal, smootherstep(localT2));
    return { inputPhase, warpedPhase, value: value2, segIndex: slot.index, localT: localT2 };
  }
  const segIndex = segmentIndexAt(warpedPhase, comp.segments);
  const [a, b] = segmentSpan(comp.segments, segIndex);
  const localT = b > a ? (warpedPhase - a) / (b - a) : 0;
  const value = s.segments[segIndex] ? s.segments[segIndex](localT) : 0;
  return { inputPhase, warpedPhase, value, segIndex, localT };
}
var COMPOSER_GAP = 10;
var COMPOSER_PAD_FRAC = 0.18;
var COMPOSER_DRIVER_FRAC = 0.55;
function composerLayout(width, height, hasDriver) {
  const driverH = hasDriver ? Math.round(height * COMPOSER_DRIVER_FRAC) : 0;
  const totalH = height + (hasDriver ? COMPOSER_GAP + driverH : 0);
  return {
    W: width,
    totalH,
    mainRect: { x: 0, y: 0, w: width, h: height },
    driverRect: hasDriver ? { x: 0, y: height + COMPOSER_GAP, w: width, h: driverH } : null
  };
}
function mapY(rect, ny) {
  const pad = rect.h * COMPOSER_PAD_FRAC;
  const top = rect.y + pad;
  const bot = rect.y + rect.h - pad;
  return bot - ny * (bot - top);
}
function spanX(span, nx, W) {
  return (span[0] + nx * (span[1] - span[0])) * W;
}
function curvePath(curve, rect, span, W, samples = 40) {
  const x = (nx) => spanX(span, nx, W);
  const y = (ny) => mapY(rect, ny);
  if (curve.type === "spring") {
    const sampler = buildSampler(curve);
    let d = `M ${x(0)} ${y(sampler(0))}`;
    for (let i = 1; i <= samples; i++) {
      const t = i / samples;
      d += ` L ${x(t)} ${y(sampler(t))}`;
    }
    return d;
  }
  const e = deriveEase(curve.type, curve.curvature, curve.steepness, curve.overshoot, curve.anticipate);
  let pts = [
    [0, 0],
    [e[0], e[1]],
    [e[2], e[3]],
    [1, 1]
  ];
  if (curve.flipX) pts = pts.map(([px, py]) => [1 - px, py]).reverse();
  if (curve.flipY) pts = pts.map(([px, py]) => [px, 1 - py]);
  return `M ${x(pts[0][0])} ${y(pts[0][1])} C ${x(pts[1][0])} ${y(pts[1][1])}, ${x(pts[2][0])} ${y(pts[2][1])}, ${x(pts[3][0])} ${y(pts[3][1])}`;
}
function connectorPath(slot, samplers, segCount, rect, W, samples = 24) {
  const endVal = samplers.segments[slot.index] ? samplers.segments[slot.index](1) : 0;
  const next = (slot.index + 1) % segCount;
  const startVal = samplers.segments[next] ? samplers.segments[next](0) : 0;
  let d = `M ${slot.a * W} ${mapY(rect, endVal)}`;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const v = lerp(endVal, startVal, smootherstep(t));
    d += ` L ${(slot.a + (slot.b - slot.a) * t) * W} ${mapY(rect, v)}`;
  }
  return d;
}
function diagonalLine(rect, span, W) {
  return { x1: span[0] * W, y1: mapY(rect, 0), x2: span[1] * W, y2: mapY(rect, 1) };
}
function playheadGeometry(read, layout) {
  const seriesX = read.warpedPhase * layout.W;
  return {
    seriesX,
    dotX: seriesX,
    dotY: mapY(layout.mainRect, read.value),
    driverX: read.inputPhase * layout.W
  };
}
var DEFAULT_TRIGGER_STEPS = 5;
var TRIGGER_FLYBACK = 0.5;
function triggersCrossed(prevValue, curValue, steps) {
  const n = Math.max(2, Math.floor(steps));
  const seg = 1 / (n - 1);
  const p = clamp013(prevValue);
  const c = clamp013(curValue);
  const delta = c - p;
  const fired = [];
  if (Math.abs(delta) > TRIGGER_FLYBACK) {
    fired.push(delta < 0 ? n - 1 : 0);
  } else if (delta > 0) {
    for (let k = 1; k <= n - 2; k++) {
      const level = k * seg;
      if (p < level && level <= c) fired.push(k);
    }
  } else if (delta < 0) {
    for (let k = n - 2; k >= 1; k--) {
      const level = k * seg;
      if (c <= level && level < p) fired.push(k);
    }
  }
  return fired;
}

// src/vue/components/CurveComposer.ts
var CurveComposer = defineComponent34({
  name: "DialKitCurveComposer",
  props: {
    /** The curve series (controlled). */
    segments: { type: Array, required: true },
    /** The stacked driver curve, or null for none (adds a second lane below). */
    driver: { type: Object, default: null },
    /** Playback direction for the demo playhead (forward / mirror / reverse). */
    direction: { type: String, default: "forward" },
    /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
    onSegmentsChange: { type: Function, default: void 0 },
    /** Commit a changed driver — fired live during driver drags and on click-cycle. */
    onDriverChange: { type: Function, default: void 0 },
    /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
    getPhase: { type: Function, default: void 0 },
    /** Static transport phase 0..1 (used when `getPhase` is absent). */
    phase: { type: Number, default: 0 },
    /** Output mode. 'continuous' reads the composed value each frame; 'trigger' emits via onTrigger. */
    mode: { type: String, default: "continuous" },
    /** Number of trigger levels in trigger mode. */
    triggerSteps: { type: Number, default: DEFAULT_TRIGGER_STEPS },
    /** Fired in trigger mode when the value crosses a trigger level. */
    onTrigger: { type: Function, default: void 0 },
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex: { type: Number, default: null },
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect: { type: Function, default: void 0 },
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor: { type: String, default: void 0 },
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor: { type: String, default: void 0 },
    /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
    gap: { type: Number, default: 0 },
    /** Faint vertical reference grid behind each lane. */
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    width: { type: Number, default: 256 },
    /** Height of the main lane; the driver lane adds height below it. */
    height: { type: Number, default: 140 }
  },
  setup(props) {
    const svgRef = ref27(null);
    const seriesPlayheadRef = ref27(null);
    const seriesDotRef = ref27(null);
    const driverPlayheadRef = ref27(null);
    const drag = ref27(null);
    const hover = ref27(null);
    const layout = computed12(() => composerLayout(props.width, props.height, props.driver != null));
    const W = computed12(() => layout.value.W);
    const totalH = computed12(() => layout.value.totalH);
    const mainRect = computed12(() => layout.value.mainRect);
    const driverRect = computed12(() => layout.value.driverRect);
    const composition = computed12(() => ({
      segments: props.segments,
      driver: props.driver,
      direction: props.direction,
      gap: props.gap
    }));
    const samplers = computed12(() => buildSamplers(composition.value));
    let raf = 0;
    let prevTrigValue = Number.NaN;
    let armW = Number.NaN;
    let armTotalH = Number.NaN;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (W.value !== armW || totalH.value !== armTotalH) {
        prevTrigValue = Number.NaN;
        armW = W.value;
        armTotalH = totalH.value;
      }
      const c = composition.value;
      const s = samplers.value;
      const u = props.getPhase ? props.getPhase() : props.phase;
      const read = readComposition(c, u, s);
      const geo = playheadGeometry(read, layout.value);
      if (seriesPlayheadRef.value) {
        seriesPlayheadRef.value.setAttribute("x1", String(geo.seriesX));
        seriesPlayheadRef.value.setAttribute("x2", String(geo.seriesX));
      }
      if (seriesDotRef.value) {
        seriesDotRef.value.setAttribute("cx", String(geo.dotX));
        seriesDotRef.value.setAttribute("cy", String(geo.dotY));
      }
      if (driverPlayheadRef.value) {
        driverPlayheadRef.value.setAttribute("x1", String(geo.driverX));
        driverPlayheadRef.value.setAttribute("x2", String(geo.driverX));
      }
      if (props.mode === "trigger") {
        const prev = prevTrigValue;
        if (!Number.isNaN(prev)) {
          for (const idx of triggersCrossed(prev, read.value, props.triggerSteps)) props.onTrigger?.(idx);
        }
        prevTrigValue = read.value;
      } else {
        prevTrigValue = Number.NaN;
      }
    };
    onMounted23(() => {
      raf = requestAnimationFrame(tick);
    });
    onBeforeUnmount7(() => cancelAnimationFrame(raf));
    const hitLayout = () => ({ totalH: totalH.value, driverY: driverRect.value ? driverRect.value.y : null, gap: props.gap });
    const localCoords = (clientX, clientY) => {
      const rect = svgRef.value.getBoundingClientRect();
      return { ...toLocalCoords(clientX, clientY, rect, totalH.value), rectW: rect.width };
    };
    const onPointerDown = (e) => {
      const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
      try {
        svgRef.value?.setPointerCapture(e.pointerId);
      } catch {
      }
      const header = headerHit(xN, py, props.segments, hitLayout());
      if (typeof header === "number") {
        drag.value = { kind: "select", index: header, startX: e.clientX, startY: e.clientY, moved: false };
        return;
      }
      const target = pointerTarget(xN, py, props.segments, hitLayout(), EDGE_HIT2 / rectW);
      if (target.kind === "driver") {
        drag.value = {
          kind: "driver",
          startX: e.clientX,
          startY: e.clientY,
          baseCurvature: props.driver.curvature,
          baseSteepness: props.driver.steepness,
          moved: false
        };
      } else if (target.kind === "boundary") {
        drag.value = {
          kind: "boundary",
          index: target.index,
          startX: e.clientX,
          startY: e.clientY,
          base: composition.value,
          moved: false
        };
      } else {
        const seg = props.segments[target.index];
        drag.value = {
          kind: "segment",
          index: target.index,
          startX: e.clientX,
          startY: e.clientY,
          baseCurvature: seg?.curvature ?? 0,
          baseSteepness: seg?.steepness ?? 0,
          moved: false
        };
      }
    };
    const onPointerMove = (e) => {
      const d = drag.value;
      if (!d) {
        const { xN, py, rectW: rectW2 } = localCoords(e.clientX, e.clientY);
        if (typeof headerHit(xN, py, props.segments, hitLayout()) === "number") {
          hover.value = { kind: "header", index: 0 };
          return;
        }
        const t = pointerTarget(xN, py, props.segments, hitLayout(), EDGE_HIT2 / rectW2);
        hover.value = t.kind === "driver" ? { kind: "driver", index: 0 } : { kind: t.kind, index: t.index };
        return;
      }
      const svgRect = svgRef.value.getBoundingClientRect();
      const rectW = svgRect.width;
      const rectH = svgRect.height;
      const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD2;
      if (!moved) return;
      if (d.kind === "boundary") {
        const deltaFrac = (e.clientX - d.startX) / rectW;
        const next = redistributeWeight(d.base, d.index, deltaFrac);
        props.onSegmentsChange?.(next.segments);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else if (d.kind === "segment") {
        const dxFrac = (e.clientX - d.startX) / rectW;
        const dyFrac = (e.clientY - d.startY) / rectH;
        const next = applySegmentBodyDrag(composition.value, d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
        props.onSegmentsChange?.(next.segments);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else if (d.kind === "driver") {
        const dxFrac = (e.clientX - d.startX) / rectW;
        const dyFrac = (e.clientY - d.startY) / rectH;
        const next = applyDriverBodyDrag(composition.value, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
        if (next.driver) props.onDriverChange?.(next.driver);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else {
        if (!d.moved) drag.value = { ...d, moved: true };
      }
    };
    const onPointerUp = (e) => {
      const d = drag.value;
      drag.value = null;
      try {
        svgRef.value?.releasePointerCapture(e.pointerId);
      } catch {
      }
      if (!d || d.moved) return;
      if (d.kind === "select") {
        props.onSelect?.(d.index);
      } else if (d.kind === "driver") {
        const next = cycleDriverType(composition.value);
        if (next.driver) props.onDriverChange?.(next.driver);
      } else if (d.kind === "segment") {
        props.onSegmentsChange?.(cycleSegmentType(composition.value, d.index).segments);
      }
    };
    const onPointerCancel = (e) => {
      drag.value = null;
      try {
        svgRef.value?.releasePointerCapture(e.pointerId);
      } catch {
      }
    };
    const onPointerLeave = () => {
      if (!drag.value) hover.value = null;
    };
    const onDoubleClick = (e) => {
      const { xN, py } = localCoords(e.clientX, e.clientY);
      if (driverRect.value && py >= driverRect.value.y) return;
      props.onSegmentsChange?.(splitSegment(composition.value, segmentIndexAt(xN, props.segments, props.gap)).segments);
    };
    const renderLaneGrid = (rect) => {
      if (!props.grid) return [];
      const n = Math.max(1, Math.round(props.gridSubdivisions));
      const lines = [];
      for (let i = 1; i < n; i++) {
        const gx = i / n * W.value;
        lines.push(
          h34("line", { key: `g-${rect.y}-${i}`, class: "dialkit-cc-grid", x1: gx, y1: rect.y, x2: gx, y2: rect.y + rect.h })
        );
      }
      return lines;
    };
    const renderLaneBg = (rect, key) => h34("rect", { key, class: "dialkit-cc-lane", x: rect.x, y: rect.y, width: rect.w, height: rect.h, rx: 8 });
    const diagonal = (rect, span, key) => {
      const d = diagonalLine(rect, span, W.value);
      return h34("line", { key, class: "dialkit-cc-diagonal", x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2 });
    };
    return () => {
      const main = mainRect.value;
      const dr = driverRect.value;
      const interior = boundaries(props.segments, props.gap);
      const activeKind = drag.value?.kind ?? hover.value?.kind;
      const cursor = activeKind === "boundary" ? "ew-resize" : activeKind === "segment" || activeKind === "driver" ? "move" : activeKind === "select" || activeKind === "header" ? "pointer" : "default";
      const children = [];
      children.push(renderLaneBg(main, "main-bg"));
      children.push(renderLaneGrid(main));
      if (props.selectedIndex != null && props.selectedIndex >= 0 && props.selectedIndex < props.segments.length) {
        const span = segmentSpan(props.segments, props.selectedIndex, props.gap);
        children.push(
          h34("rect", {
            class: "dialkit-cc-seg-selected",
            x: span[0] * W.value,
            y: main.y,
            width: (span[1] - span[0]) * W.value,
            height: main.h,
            rx: 8
          })
        );
      }
      if (hover.value?.kind === "segment" && !drag.value) {
        const span = segmentSpan(props.segments, hover.value.index, props.gap);
        children.push(
          h34("rect", {
            class: "dialkit-cc-seg-hover",
            x: span[0] * W.value,
            y: main.y,
            width: (span[1] - span[0]) * W.value,
            height: main.h,
            rx: 8
          })
        );
      }
      children.push(
        props.segments.map((seg, i) => {
          const span = segmentSpan(props.segments, i, props.gap);
          return h34("g", { key: `seg-${i}` }, [
            diagonal(main, span, `diag-${i}`),
            h34("path", { class: "dialkit-cc-curve", d: curvePath(seg, main, span, W.value) }),
            h34(
              "text",
              { class: "dialkit-cc-label", x: (span[0] + span[1]) * 0.5 * W.value, y: main.y + 13 },
              seg.type
            )
          ]);
        })
      );
      if (props.gap > 0) {
        children.push(
          timelineSlots(props.segments, props.gap).filter((slot) => slot.kind === "gap" && slot.b > slot.a).map(
            (slot) => h34("path", {
              key: `conn-${slot.index}`,
              class: "dialkit-cc-connector",
              d: connectorPath(slot, samplers.value, props.segments.length, main, W.value)
            })
          )
        );
      }
      children.push(
        interior.map(
          (bx, i) => h34("line", {
            key: `b-${i}`,
            class: "dialkit-cc-boundary",
            "data-active": String(
              hover.value?.kind === "boundary" && hover.value.index === i || drag.value?.kind === "boundary" && drag.value.index === i
            ),
            x1: bx * W.value,
            y1: main.y,
            x2: bx * W.value,
            y2: main.y + main.h
          })
        )
      );
      children.push(
        h34("line", {
          ref: seriesPlayheadRef,
          class: "dialkit-cc-playhead",
          x1: 0,
          y1: main.y,
          x2: 0,
          y2: main.y + main.h,
          style: { stroke: props.playheadColor }
        })
      );
      children.push(
        h34("circle", {
          ref: seriesDotRef,
          class: "dialkit-cc-dot",
          cx: 0,
          cy: mapY(main, 0),
          r: 3,
          style: { fill: props.playheadColor }
        })
      );
      if (dr) {
        children.push(renderLaneBg(dr, "driver-bg"));
        children.push(renderLaneGrid(dr));
        if (hover.value?.kind === "driver" && !drag.value) {
          children.push(
            h34("rect", { class: "dialkit-cc-seg-hover", x: 0, y: dr.y, width: W.value, height: dr.h, rx: 8 })
          );
        }
        children.push(diagonal(dr, [0, 1], "driver-diag"));
        children.push(
          h34("path", { class: "dialkit-cc-curve dialkit-cc-curve-driver", d: curvePath(props.driver, dr, [0, 1], W.value) })
        );
        children.push(
          h34("text", { class: "dialkit-cc-label", x: W.value * 0.5, y: dr.y + 13 }, `driver \xB7 ${props.driver.type}`)
        );
        children.push(
          h34("line", {
            ref: driverPlayheadRef,
            class: "dialkit-cc-playhead",
            x1: 0,
            y1: dr.y,
            x2: 0,
            y2: dr.y + dr.h,
            style: { stroke: props.playheadColor }
          })
        );
      }
      return h34("div", { class: "dialkit-cc-wrap", style: { width: `${W.value}px` } }, [
        h34(
          "svg",
          {
            ref: svgRef,
            class: "dialkit-cc",
            viewBox: `0 0 ${W.value} ${totalH.value}`,
            width: W.value,
            height: totalH.value,
            style: { width: `${W.value}px`, height: `${totalH.value}px`, cursor, color: props.curveColor },
            onPointerdown: onPointerDown,
            onPointermove: onPointerMove,
            onPointerup: onPointerUp,
            onPointercancel: onPointerCancel,
            onPointerleave: onPointerLeave,
            onDblclick: onDoubleClick
          },
          children
        )
      ]);
    };
  }
});
export {
  AnalyserVisualization,
  ButtonGroup,
  ColorControl,
  ColorPickerPanel,
  ControlRenderer,
  ControlShell,
  CurveComposer,
  DEFAULT_GRADIENT,
  DialRoot,
  DialStore,
  DialTimeline,
  EasingVisualization,
  Folder,
  GradientControl,
  GradientPanel,
  MIN_STOPS,
  Module,
  PresetManager,
  RangeSlider,
  SegmentedControl,
  SelectControl,
  ShortcutKey,
  ShortcutListener,
  ShortcutsMenu,
  Slider,
  SpringControl,
  SpringVisualization,
  TextControl,
  TimelineStore,
  TimelineToggleButton,
  Toggle,
  TransitionControl,
  WaveformVisualization,
  XYControl,
  XYPad,
  addStop,
  colorAtPosition,
  gradientToCss,
  moveStop,
  normalizeGradient,
  removeStop,
  setGradientAngle,
  setGradientType,
  setStopColor,
  useDialKit,
  useDialTimeline,
  useShortcutContext,
  vDialKit
};
//# sourceMappingURL=index.js.map