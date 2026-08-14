// src/solid/createDialKit.ts
import { createSignal, createMemo, createEffect, onMount, onCleanup, createUniqueId } from "solid-js";

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
  let h = s.slice(1);
  if (h.length <= 4) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
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
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (g - b) / d % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max, a: rgba.a };
}
function hsvToRgb(hsva) {
  const h = (hsva.h % 360 + 360) % 360;
  const s = clamp01(hsva.s), v = clamp01(hsva.v);
  const c = v * s;
  const x = c * (1 - Math.abs(h / 60 % 2 - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: byte((r + m) * 255), g: byte((g + m) * 255), b: byte((b + m) * 255), a: hsva.a };
}
function rgbToHsl(rgba) {
  const { h, s, v, a } = rgbToHsv(rgba);
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s: sl, l, a };
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
  let h = Math.atan2(B, A) * 180 / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h: c < 1e-6 ? 0 : h, a: rgba.a };
}
var GAMUT_EPS = 1e-4;
function inSrgbGamut(l, c, h) {
  const rad = h * Math.PI / 180;
  const { r, g, b } = oklabToLinearRgb(l, c * Math.cos(rad), c * Math.sin(rad));
  return r >= -GAMUT_EPS && r <= 1 + GAMUT_EPS && g >= -GAMUT_EPS && g <= 1 + GAMUT_EPS && b >= -GAMUT_EPS && b <= 1 + GAMUT_EPS;
}
function clampOklchToSrgb(oklch) {
  const l = clamp01(oklch.l);
  const h = (oklch.h % 360 + 360) % 360;
  const c = Math.max(0, oklch.c);
  if (inSrgbGamut(l, c, h)) return { l, c, h, a: clamp01(oklch.a) };
  let lo = 0, hi = c;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inSrgbGamut(l, mid, h)) lo = mid;
    else hi = mid;
  }
  return { l, c: lo, h, a: clamp01(oklch.a) };
}
function oklchToRgb(oklch) {
  const { l, c, h, a } = clampOklchToSrgb(oklch);
  const rad = h * Math.PI / 180;
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
    const { h, s, l } = rgbToHsl(rgba);
    values = [round(h, 0), round(s * 100, 0), round(l * 100, 0)];
  } else {
    const { l, c, h } = rgbToOklch(rgba);
    values = [round(l, 2), round(c, 3), round(h, 0)];
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
var TAB_PATH = "_tab";
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
    if (key === "_collapsed" || key === "_collapsible" || key === "_tabs") continue;
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
    this.initTabValue(controls, values);
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
    this.initTabValue(controls, defaultValues);
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
        if (key === "_collapsed" || key === "_collapsible" || key === "_tabs") continue;
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
    this.replaceValues(panel, preset.values);
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
      this.replaceValues(panel, base);
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
        deletable: !!provider.onDelete && !p.readonly,
        renamable: !!provider.onRename && !p.readonly
      }));
    }
    return this.getPresets(panelId).map((p) => ({ id: p.id, name: p.name, deletable: true, renamable: true }));
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
  /** Rename a preset (toolbar inline edit). Provider mode hands the new name
   * to the host; stock mode edits the store's own snapshot list. */
  renamePreset(panelId, presetId, name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      void provider.onRename?.(presetId, trimmed);
      return;
    }
    const preset = (this.presets.get(panelId) ?? []).find((p) => p.id === presetId);
    if (!preset) return;
    preset.name = trimmed;
    const panel = this.panels.get(panelId);
    if (panel) this.snapshots.set(panelId, { ...panel.values });
    this.notify(panelId);
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
      if (key === "_collapsed" || key === "_collapsible" || key === "_tabs") continue;
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
      if (key === "_collapsed" || key === "_collapsible" || key === "_tabs" || key === "_enabled") continue;
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
        controls.push({ type: "select", path, label, options: value.options, display: value.display });
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
    if (prefix === "" && config._tabs === true) {
      const isFolder = (control) => control.type === "folder";
      const tabs = controls.filter((control) => isFolder(control) && (control.children?.length ?? 0) > 0);
      if (tabs.length > 0) {
        for (const tab of tabs) tab.tab = true;
        return [
          {
            type: "select",
            path: TAB_PATH,
            label: "Tab",
            display: "segmented",
            tabBar: true,
            options: tabs.map((tab) => tab.path)
          },
          ...controls.filter((control) => !isFolder(control)),
          ...tabs
        ];
      }
    }
    return controls;
  }
  /**
   * Swaps a panel's whole value map, keeping the open tab. Which tab you are
   * reading is a place, not a parameter: a preset should change the sound, not
   * move you to another page of the panel.
   */
  replaceValues(panel, values) {
    const openTab = panel.values[TAB_PATH];
    panel.values = { ...values };
    if (openTab !== void 0) panel.values[TAB_PATH] = openTab;
  }
  /**
   * Seeds the active tab. It is a real value, not component state, so a config
   * rebuild preserves the reader's place — and `normalizePreservedValue` resets
   * it through the select's options when the tab it named is gone.
   */
  initTabValue(controls, values) {
    const tabBar = controls.find((control) => control.tabBar);
    if (!tabBar) return;
    values[TAB_PATH] = tabBar.options?.[0] ?? "";
  }
  flattenValues(config, prefix) {
    const values = {};
    for (const [key, value] of Object.entries(config)) {
      if (key === "_collapsed" || key === "_collapsible" || key === "_tabs") continue;
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

// src/solid/createDialKit.ts
function createDialKit(name, config, options) {
  const id = createUniqueId();
  const panelId = `${name}-${id}`;
  const [values, setValues] = createSignal(
    DialStore.getValues(panelId)
  );
  onMount(() => {
    DialStore.registerPanel(panelId, name, config, options?.shortcuts, {
      hints: options?.hints,
      affordances: options?.affordances,
      labels: options?.labels
    });
    setValues(DialStore.getValues(panelId));
    const unsubValues = DialStore.subscribe(panelId, () => {
      setValues(DialStore.getValues(panelId));
    });
    const unsubActions = options?.onAction ? DialStore.subscribeActions(panelId, options.onAction) : void 0;
    onCleanup(() => {
      unsubValues();
      unsubActions?.();
      DialStore.unregisterPanel(panelId);
    });
  });
  createEffect(() => {
    const provider = options?.presets ?? null;
    if (provider) JSON.stringify(provider);
    DialStore.setPresetProvider(panelId, provider);
  });
  return createMemo(() => buildResolvedValues(config, values(), ""));
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
    } else if (isSpringConfig(configValue)) {
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

// src/solid/createDialTimeline.ts
import { createEffect as createEffect2, createMemo as createMemo2, createSignal as createSignal2, createUniqueId as createUniqueId2, onCleanup as onCleanup2, onMount as onMount2 } from "solid-js";
import { isServer } from "solid-js/web";

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

// src/transition-math.ts
function round22(value) {
  return Math.round(value * 100) / 100;
}
function clamp4(value, min, max) {
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
  return round22(clamp4(duration, 0.05, 10));
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
    return cubicBezierProgress(clamp4(curve.duration > 0 ? elapsed / curve.duration : 1, 0, 1), curve.ease);
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
    const from2 = isPlainObject(clipResolved.from) ? clipResolved.from : void 0;
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
      from: from2,
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
      let running = { ...from2 ?? {} };
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
        if (from2 && to) {
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
                  start: from2,
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
        if (from2 && to) {
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
                  start: from2,
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
      const props = new Set(Object.keys(from2 ?? {}));
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
  const progress = total > 0 ? clamp4(basePos / total, 0, 1) : started ? 1 : 0;
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
function interpolateResolved(from2, to, p) {
  if (typeof from2 === "number" && typeof to === "number") {
    return from2 + (to - from2) * p;
  }
  if (typeof from2 === "string" && typeof to === "string") {
    const mixed = mixHexColors(from2, to, p);
    if (mixed) return mixed;
  }
  if (isPlainObject(from2) && isPlainObject(to)) {
    const result = {};
    for (const key of Object.keys(from2)) {
      result[key] = key in to ? interpolateResolved(from2[key], to[key], p) : from2[key];
    }
    for (const key of Object.keys(to)) {
      if (!(key in from2)) result[key] = to[key];
    }
    return result;
  }
  return p < 0.5 ? from2 : to;
}
function parseHex2(hex) {
  if (!isHexColor(hex)) return null;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
    h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255
  ];
}
function mixHexColors(a, b, p) {
  const ca = parseHex2(a);
  const cb = parseHex2(b);
  if (!ca || !cb) return null;
  const t = clamp4(p, 0, 1);
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
  return clamp4(round22(delay), 0, Math.max(0, round22(timelineDuration - at - trackDuration)));
}
function clampClipMove(at, duration, timelineDuration) {
  return clamp4(round22(at), 0, Math.max(0, timelineDuration - duration));
}
function clampClipResizeEnd(duration, at, timelineDuration) {
  return clamp4(round22(duration), TIMELINE_MIN_CLIP_DURATION, timelineDuration - at);
}
function clampClipResizeStart(newAt, at, duration) {
  const clampedAt = clamp4(round22(newAt), 0, at + duration - TIMELINE_MIN_CLIP_DURATION);
  return { at: clampedAt, duration: round22(at + duration - clampedAt) };
}
function clampStepResize(duration, at, otherStepsTotal, timelineDuration) {
  const max = Math.max(TIMELINE_MIN_CLIP_DURATION, timelineDuration - at - otherStepsTotal);
  return clamp4(round22(duration), TIMELINE_MIN_CLIP_DURATION, max);
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

// src/copy-instruction.ts
function buildCopyInstruction(hookName, panelName, values) {
  const { [TAB_PATH]: _activeTab, ...parameters } = values;
  const jsonStr = JSON.stringify(parameters, null, 2);
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
var isDevDefault = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import.meta !== "undefined" && import.meta.env?.MODE ? import.meta.env.MODE !== "production" : true;

// src/solid/createDialTimeline.ts
function createDialTimeline(name, config, options) {
  const instanceId = createUniqueId2();
  const hasStableId = options?.id !== void 0;
  const panelId = options?.id ?? `${name}-${instanceId}`;
  const parsed = createMemo2(() => parseTimelineConfig(config));
  const [flatValues, setFlatValues] = createSignal2(DialStore.getValues(panelId));
  const [transport, setTransport] = createSignal2(TimelineStore.getTransport(panelId));
  const [loopRegion, setLoopRegion] = createSignal2(
    TimelineStore.getLoopRegion(panelId)
  );
  const staticTimeline = createMemo2(() => computeStaticTimeline(parsed(), flatValues()));
  let mounted = false;
  const play = () => TimelineStore.play(panelId);
  const pause = () => TimelineStore.pause(panelId);
  const replay = () => TimelineStore.replay(panelId);
  const seek = (time) => TimelineStore.seek(panelId, time);
  if (!isServer) {
    const unsubscribeValues = DialStore.subscribe(panelId, () => {
      setFlatValues(DialStore.getValues(panelId));
    });
    const unsubscribeTransport = TimelineStore.subscribe(panelId, () => {
      setTransport(TimelineStore.getTransport(panelId));
      setLoopRegion(TimelineStore.getLoopRegion(panelId));
    });
    onCleanup2(() => {
      unsubscribeValues();
      unsubscribeTransport();
    });
  }
  onMount2(() => {
    DialStore.registerPanel(panelId, name, parsed().dialConfig, void 0, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: "timeline"
    });
    setFlatValues(DialStore.getValues(panelId));
    const currentStatic = staticTimeline();
    TimelineStore.register(
      buildTimelineMeta(panelId, name, currentStatic.duration, parsed(), options?.loop),
      { autoplay: options?.autoplay ?? true, persist: options?.persist }
    );
    setTransport(TimelineStore.getTransport(panelId));
    setLoopRegion(TimelineStore.getLoopRegion(panelId));
    mounted = true;
    onCleanup2(() => {
      mounted = false;
      TimelineStore.unregister(panelId);
      DialStore.unregisterPanel(panelId);
    });
  });
  createEffect2(() => {
    const currentParsed = parsed();
    const currentStatic = staticTimeline();
    if (!mounted) return;
    TimelineStore.update(
      buildTimelineMeta(panelId, name, currentStatic.duration, currentParsed, options?.loop)
    );
  });
  return createMemo2(() => {
    const currentStatic = staticTimeline();
    const region = loopRegion();
    const loopStart = region ? region.start : 0;
    const loopEnd = region ? region.end : currentStatic.duration;
    return buildTimelineValues(
      currentStatic.clips,
      transport(),
      currentStatic.duration,
      loopStart,
      loopEnd,
      { play, pause, replay, seek }
    );
  });
}

// src/solid/components/DialRoot.tsx
import { template as _$template24 } from "solid-js/web";
import { memo as _$memo16 } from "solid-js/web";
import { setAttribute as _$setAttribute18 } from "solid-js/web";
import { effect as _$effect23 } from "solid-js/web";
import { insert as _$insert23 } from "solid-js/web";
import { createComponent as _$createComponent23 } from "solid-js/web";
import { createSignal as createSignal22, onMount as onMount13, onCleanup as onCleanup18, Show as Show17, For as For8 } from "solid-js";
import { Portal as Portal6 } from "solid-js/web";

// src/solid/components/ShortcutListener.tsx
import { createComponent as _$createComponent } from "solid-js/web";
import { createContext, useContext, createSignal as createSignal3, onMount as onMount3, onCleanup as onCleanup3 } from "solid-js";

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

// src/solid/components/ShortcutListener.tsx
var defaultState = {
  activePanelId: null,
  activePath: null
};
var ShortcutContext = createContext(() => defaultState);
function useShortcutContext() {
  return useContext(ShortcutContext);
}
function ShortcutListener(props) {
  const [activeShortcut, setActiveShortcut] = createSignal3(defaultState);
  const activeKeys = /* @__PURE__ */ new Set();
  let isDragging = false;
  let lastMouseX = null;
  let dragAccumulator = 0;
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
            return {
              panelId: panel.id,
              path,
              control,
              shortcut
            };
          }
        }
      }
    }
    return null;
  };
  onMount3(() => {
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
        setActiveShortcut({
          activePanelId: target.panelId,
          activePath: target.path
        });
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
        setActiveShortcut({
          activePanelId: null,
          activePath: null
        });
      } else {
        let found = false;
        for (const remainingKey of activeKeys) {
          const modifier = getActiveModifier(e);
          const target = DialStore.resolveShortcutTarget(remainingKey, modifier);
          if (target) {
            setActiveShortcut({
              activePanelId: target.panelId,
              activePath: target.path
            });
            found = true;
            break;
          }
        }
        if (!found) {
          setActiveShortcut({
            activePanelId: null,
            activePath: null
          });
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
          const {
            panelId,
            path,
            control
          } = target;
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
      for (const {
        panelId,
        path,
        control,
        shortcut
      } of scrollOnlyTargets) {
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
      setActiveShortcut({
        activePanelId: null,
        activePath: null
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, {
      passive: false
    });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", handleWindowBlur);
    onCleanup3(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    });
  });
  return _$createComponent(ShortcutContext.Provider, {
    value: activeShortcut,
    get children() {
      return props.children;
    }
  });
}

// src/solid/components/Panel.tsx
import { template as _$template22 } from "solid-js/web";
import { delegateEvents as _$delegateEvents18 } from "solid-js/web";
import { insert as _$insert21 } from "solid-js/web";
import { memo as _$memo15 } from "solid-js/web";
import { setAttribute as _$setAttribute16 } from "solid-js/web";
import { effect as _$effect21 } from "solid-js/web";
import { use as _$use14 } from "solid-js/web";
import { createComponent as _$createComponent21 } from "solid-js/web";
import { createSignal as createSignal21, createEffect as createEffect14, onMount as onMount12, onCleanup as onCleanup17 } from "solid-js";
import { animate as animate8 } from "motion";

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

// src/solid/components/Folder.tsx
import { template as _$template } from "solid-js/web";
import { delegateEvents as _$delegateEvents } from "solid-js/web";
import { className as _$className } from "solid-js/web";
import { style as _$style } from "solid-js/web";
import { setAttribute as _$setAttribute } from "solid-js/web";
import { effect as _$effect } from "solid-js/web";
import { createComponent as _$createComponent2 } from "solid-js/web";
import { insert as _$insert } from "solid-js/web";
import { memo as _$memo } from "solid-js/web";
import { addEventListener as _$addEventListener } from "solid-js/web";
import { use as _$use } from "solid-js/web";
import { createSignal as createSignal4, createEffect as createEffect3, onCleanup as onCleanup4, Show } from "solid-js";
import { animate } from "motion";
var _tmpl$ = /* @__PURE__ */ _$template(`<div class=dialkit-panel-toolbar>`);
var _tmpl$2 = /* @__PURE__ */ _$template(`<span class=dialkit-hint role=tooltip>`);
var _tmpl$3 = /* @__PURE__ */ _$template(`<div class=dialkit-folder-content><div class=dialkit-folder-inner>`);
var _tmpl$4 = /* @__PURE__ */ _$template(`<div><div><div class=dialkit-folder-header-top>`);
var _tmpl$5 = /* @__PURE__ */ _$template(`<div class=dialkit-folder-title-row><span class="dialkit-folder-title dialkit-folder-title-root">`);
var _tmpl$6 = /* @__PURE__ */ _$template(`<div class=dialkit-folder-title-row><span class=dialkit-folder-title>`);
var _tmpl$7 = /* @__PURE__ */ _$template(`<svg class=dialkit-panel-icon viewBox="0 0 16 16"fill=none><path opacity=0.5 fill=currentColor></path><circle fill=currentColor stroke=currentColor stroke-width=1.25></circle><circle fill=currentColor stroke=currentColor stroke-width=1.25></circle><circle fill=currentColor stroke=currentColor stroke-width=1.25>`);
var _tmpl$8 = /* @__PURE__ */ _$template(`<svg class=dialkit-folder-icon viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$9 = /* @__PURE__ */ _$template(`<div class="dialkit-panel-inner dialkit-panel-inline">`);
var _tmpl$0 = /* @__PURE__ */ _$template(`<div class=dialkit-panel-inner>`);
function Folder(props) {
  const [isOpen, setIsOpen] = createSignal4(props.defaultOpen ?? true);
  const [isCollapsed, setIsCollapsed] = createSignal4(!(props.defaultOpen ?? true));
  const [contentHeight, setContentHeight] = createSignal4(void 0);
  const [windowHeight, setWindowHeight] = createSignal4(typeof window !== "undefined" ? window.innerHeight : 800);
  if (props.isRoot) {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    onCleanup4(() => window.removeEventListener("resize", onResize));
  }
  const [contentMounted, setContentMounted] = createSignal4(props.defaultOpen ?? true);
  let skipFirstAnim = props.defaultOpen ?? true;
  let sectionContentRef;
  let sectionAnim = null;
  let folderChevronRef;
  let chevronAnim = null;
  let chevronInitialized = false;
  let panelTapAnim = null;
  let contentRef;
  createEffect3(() => {
    if (!props.isRoot || !isOpen()) return;
    const el = contentRef;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      setContentHeight((prev) => prev === h ? prev : h);
    });
    ro.observe(el);
    onCleanup4(() => ro.disconnect());
  });
  createEffect3(() => {
    if (props.isRoot || !folderChevronRef) return;
    const open = isOpen();
    chevronAnim?.stop();
    if (!chevronInitialized) {
      folderChevronRef.style.transform = `rotate(${open ? 0 : 180}deg)`;
      chevronInitialized = true;
      return;
    }
    chevronAnim = animate(folderChevronRef, {
      rotate: open ? 0 : 180
    }, {
      type: "spring",
      visualDuration: 0.35,
      bounce: 0.15
    });
    onCleanup4(() => chevronAnim?.stop());
  });
  const handleToggle = () => {
    if (props.collapsible === false) return;
    if (props.inline && props.isRoot) return;
    const next = !isOpen();
    setIsOpen(next);
    if (next) {
      setIsCollapsed(false);
      if (!props.isRoot) {
        sectionAnim?.stop();
        sectionAnim = null;
        if (sectionContentRef) {
          sectionAnim = animate(sectionContentRef, {
            height: "auto",
            opacity: 1
          }, {
            type: "spring",
            visualDuration: 0.35,
            bounce: 0.1,
            onComplete: () => {
              sectionAnim = null;
            }
          });
        } else {
          setContentMounted(true);
        }
      }
    } else {
      setIsCollapsed(true);
      if (!props.isRoot) {
        if (sectionContentRef) {
          const currentHeight = sectionContentRef.getBoundingClientRect().height;
          sectionContentRef.style.height = `${currentHeight}px`;
          sectionAnim?.stop();
          sectionAnim = animate(sectionContentRef, {
            height: 0,
            opacity: 0
          }, {
            type: "spring",
            visualDuration: 0.35,
            bounce: 0.1,
            onComplete: () => {
              setContentMounted(false);
              sectionAnim = null;
              sectionContentRef = void 0;
            }
          });
        } else {
          setContentMounted(false);
        }
      }
    }
    props.onOpenChange?.(next);
  };
  const folderContent = () => (() => {
    var _el$ = _tmpl$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
    _$use((el) => {
      if (props.isRoot) contentRef = el;
    }, _el$);
    _$addEventListener(_el$2, "click", props.collapsible === false ? void 0 : handleToggle, true);
    _$insert(_el$3, (() => {
      var _c$ = _$memo(() => !!props.isRoot);
      return () => _c$() ? _$createComponent2(Show, {
        get when() {
          return isOpen();
        },
        get children() {
          var _el$8 = _tmpl$5(), _el$9 = _el$8.firstChild;
          _$insert(_el$9, () => props.title);
          return _el$8;
        }
      }) : (() => {
        var _el$0 = _tmpl$6(), _el$1 = _el$0.firstChild;
        _$insert(_el$1, () => props.title);
        return _el$0;
      })();
    })(), null);
    _$insert(_el$3, (() => {
      var _c$2 = _$memo(() => !!(props.isRoot && !props.inline));
      return () => _c$2() && (() => {
        var _el$10 = _tmpl$7(), _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling;
        _$effect((_p$) => {
          var _v$5 = ICON_PANEL.path, _v$6 = ICON_PANEL.circles[0].cx, _v$7 = ICON_PANEL.circles[0].cy, _v$8 = ICON_PANEL.circles[0].r, _v$9 = ICON_PANEL.circles[1].cx, _v$0 = ICON_PANEL.circles[1].cy, _v$1 = ICON_PANEL.circles[1].r, _v$10 = ICON_PANEL.circles[2].cx, _v$11 = ICON_PANEL.circles[2].cy, _v$12 = ICON_PANEL.circles[2].r;
          _v$5 !== _p$.e && _$setAttribute(_el$11, "d", _p$.e = _v$5);
          _v$6 !== _p$.t && _$setAttribute(_el$12, "cx", _p$.t = _v$6);
          _v$7 !== _p$.a && _$setAttribute(_el$12, "cy", _p$.a = _v$7);
          _v$8 !== _p$.o && _$setAttribute(_el$12, "r", _p$.o = _v$8);
          _v$9 !== _p$.i && _$setAttribute(_el$13, "cx", _p$.i = _v$9);
          _v$0 !== _p$.n && _$setAttribute(_el$13, "cy", _p$.n = _v$0);
          _v$1 !== _p$.s && _$setAttribute(_el$13, "r", _p$.s = _v$1);
          _v$10 !== _p$.h && _$setAttribute(_el$14, "cx", _p$.h = _v$10);
          _v$11 !== _p$.r && _$setAttribute(_el$14, "cy", _p$.r = _v$11);
          _v$12 !== _p$.d && _$setAttribute(_el$14, "r", _p$.d = _v$12);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0,
          h: void 0,
          r: void 0,
          d: void 0
        });
        return _el$10;
      })();
    })(), null);
    _$insert(_el$3, (() => {
      var _c$3 = _$memo(() => !!(!props.isRoot && props.collapsible !== false));
      return () => _c$3() && (() => {
        var _el$15 = _tmpl$8(), _el$16 = _el$15.firstChild;
        var _ref$ = folderChevronRef;
        typeof _ref$ === "function" ? _$use(_ref$, _el$15) : folderChevronRef = _el$15;
        _$setAttribute(_el$16, "d", ICON_CHEVRON);
        return _el$15;
      })();
    })(), null);
    _$insert(_el$2, _$createComponent2(Show, {
      get when() {
        return _$memo(() => !!(props.isRoot && props.toolbar))() && isOpen();
      },
      get children() {
        var _el$4 = _tmpl$();
        _el$4.$$click = (e) => e.stopPropagation();
        _$insert(_el$4, () => props.toolbar);
        return _el$4;
      }
    }), null);
    _$insert(_el$2, _$createComponent2(Show, {
      get when() {
        return props.hint;
      },
      get children() {
        var _el$5 = _tmpl$2();
        _$insert(_el$5, () => props.hint);
        _$effect(() => _$setAttribute(_el$5, "id", props.hintId));
        return _el$5;
      }
    }), null);
    _$insert(_el$, _$createComponent2(Show, {
      get when() {
        return _$memo(() => !!props.isRoot)() ? isOpen() : contentMounted();
      },
      get children() {
        var _el$6 = _tmpl$3(), _el$7 = _el$6.firstChild;
        _$use((el) => {
          if (props.isRoot) return;
          sectionContentRef = el;
          if (skipFirstAnim) {
            skipFirstAnim = false;
            return;
          }
          sectionAnim?.stop();
          el.style.height = "0px";
          el.style.opacity = "0";
          sectionAnim = animate(el, {
            height: "auto",
            opacity: 1
          }, {
            type: "spring",
            visualDuration: 0.35,
            bounce: 0.1,
            onComplete: () => {
              sectionAnim = null;
            }
          });
        }, _el$6);
        _$insert(_el$7, () => props.children);
        _$effect((_$p) => _$style(_el$6, !props.isRoot ? {
          "clip-path": "inset(0 -20px)"
        } : void 0, _$p));
        return _el$6;
      }
    }), null);
    _$effect((_p$) => {
      var _v$ = `dialkit-folder ${props.isRoot ? "dialkit-folder-root" : ""}`, _v$2 = `dialkit-folder-header ${props.isRoot ? "dialkit-panel-header" : ""} ${props.collapsible === false ? "dialkit-folder-header-static" : ""}`, _v$3 = props.hint ? "true" : void 0, _v$4 = props.hint ? props.hintId : void 0;
      _v$ !== _p$.e && _$className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && _$className(_el$2, _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute(_el$2, "data-hint", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute(_el$2, "aria-describedby", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
  if (props.isRoot) {
    if (props.inline) {
      return (() => {
        var _el$17 = _tmpl$9();
        _$insert(_el$17, folderContent);
        return _el$17;
      })();
    }
    let panelRef;
    let rootPanelAnim = null;
    let rootPanelInitialized = false;
    let lastRootOpen = isOpen();
    createEffect3(() => {
      if (!panelRef || isOpen()) return;
      const handler = (e) => {
        e.stopPropagation();
        handleToggle();
      };
      panelRef.addEventListener("click", handler);
      onCleanup4(() => panelRef.removeEventListener("click", handler));
    });
    createEffect3(() => {
      if (!panelRef) return;
      const open = isOpen();
      const measuredOpenHeight = contentHeight() !== void 0 ? Math.min(contentHeight() + 10, windowHeight() - 32) : panelRef.getBoundingClientRect().height;
      const target = {
        width: open ? 280 : 42,
        height: open ? measuredOpenHeight : 42,
        borderRadius: open ? 14 : 21,
        boxShadow: open ? "var(--dial-shadow)" : "var(--dial-shadow-collapsed)"
      };
      panelRef.style.cursor = open ? "" : "pointer";
      panelRef.style.overflow = open ? "hidden auto" : "hidden";
      if (!rootPanelInitialized) {
        rootPanelInitialized = true;
        panelRef.style.width = `${target.width}px`;
        panelRef.style.height = `${target.height}px`;
        panelRef.style.borderRadius = `${target.borderRadius}px`;
        panelRef.style.boxShadow = target.boxShadow;
        lastRootOpen = open;
        return;
      }
      if (open !== lastRootOpen) {
        rootPanelAnim?.stop();
        rootPanelAnim = animate(panelRef, target, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3,
          onComplete: () => {
            rootPanelAnim = null;
          }
        });
        lastRootOpen = open;
        return;
      }
      if (open) {
        panelRef.style.height = `${target.height}px`;
      }
    });
    onCleanup4(() => {
      rootPanelAnim?.stop();
      panelTapAnim?.stop();
    });
    return (() => {
      var _el$18 = _tmpl$0();
      _el$18.addEventListener("pointerleave", () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = animate(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      });
      _el$18.addEventListener("pointercancel", () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = animate(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      });
      _el$18.$$pointerup = () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = animate(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      };
      _el$18.$$pointerdown = () => {
        if (isOpen()) return;
        document.activeElement?.blur?.();
        panelTapAnim?.stop();
        panelTapAnim = animate(panelRef, {
          scale: 0.9
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      };
      var _ref$2 = panelRef;
      typeof _ref$2 === "function" ? _$use(_ref$2, _el$18) : panelRef = _el$18;
      _$insert(_el$18, folderContent);
      _$effect(() => _$setAttribute(_el$18, "data-collapsed", String(isCollapsed())));
      return _el$18;
    })();
  }
  return folderContent();
}
_$delegateEvents(["click", "pointerdown", "pointerup"]);

// src/solid/components/ControlRenderer.tsx
import { template as _$template20 } from "solid-js/web";
import { delegateEvents as _$delegateEvents16 } from "solid-js/web";
import { effect as _$effect19 } from "solid-js/web";
import { insert as _$insert19 } from "solid-js/web";
import { memo as _$memo13 } from "solid-js/web";
import { createComponent as _$createComponent19 } from "solid-js/web";
import { For as For5 } from "solid-js";

// src/solid/components/ModuleFolder.tsx
import { template as _$template3 } from "solid-js/web";
import { delegateEvents as _$delegateEvents3 } from "solid-js/web";
import { setAttribute as _$setAttribute3 } from "solid-js/web";
import { effect as _$effect3 } from "solid-js/web";
import { createComponent as _$createComponent4 } from "solid-js/web";
import { memo as _$memo2 } from "solid-js/web";
import { insert as _$insert3 } from "solid-js/web";
import { createSignal as createSignal6, Show as Show3 } from "solid-js";

// src/solid/components/SegmentedControl.tsx
import { template as _$template2 } from "solid-js/web";
import { delegateEvents as _$delegateEvents2 } from "solid-js/web";
import { setAttribute as _$setAttribute2 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty } from "solid-js/web";
import { effect as _$effect2 } from "solid-js/web";
import { insert as _$insert2 } from "solid-js/web";
import { createComponent as _$createComponent3 } from "solid-js/web";
import { use as _$use2 } from "solid-js/web";
import { createSignal as createSignal5, createEffect as createEffect4, For, Show as Show2 } from "solid-js";
var _tmpl$10 = /* @__PURE__ */ _$template2(`<div class=dialkit-segmented>`);
var _tmpl$22 = /* @__PURE__ */ _$template2(`<div class=dialkit-segmented-pill>`);
var _tmpl$32 = /* @__PURE__ */ _$template2(`<button class=dialkit-segmented-button>`);
function SegmentedControl(props) {
  let containerRef;
  let hasAnimated = false;
  const [pillStyle, setPillStyle] = createSignal5(null);
  const measure = () => {
    if (!containerRef) return;
    const activeButton = containerRef.querySelector('[data-active="true"]');
    if (!activeButton) return;
    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth
    });
  };
  createEffect4(() => {
    void props.value;
    void props.options.length;
    measure();
  });
  const transition = () => {
    void props.value;
    if (!hasAnimated) {
      hasAnimated = true;
      return "none";
    }
    return "left 0.2s cubic-bezier(0.25, 1, 0.5, 1), width 0.2s cubic-bezier(0.25, 1, 0.5, 1)";
  };
  return (() => {
    var _el$ = _tmpl$10();
    var _ref$ = containerRef;
    typeof _ref$ === "function" ? _$use2(_ref$, _el$) : containerRef = _el$;
    _$insert2(_el$, _$createComponent3(Show2, {
      get when() {
        return pillStyle();
      },
      children: (style) => (() => {
        var _el$2 = _tmpl$22();
        _$effect2((_p$) => {
          var _v$ = `${style().left}px`, _v$2 = `${style().width}px`, _v$3 = transition();
          _v$ !== _p$.e && _$setStyleProperty(_el$2, "left", _p$.e = _v$);
          _v$2 !== _p$.t && _$setStyleProperty(_el$2, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && _$setStyleProperty(_el$2, "transition", _p$.a = _v$3);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$2;
      })()
    }), null);
    _$insert2(_el$, _$createComponent3(For, {
      get each() {
        return props.options;
      },
      children: (option) => (() => {
        var _el$3 = _tmpl$32();
        _el$3.$$click = () => props.onChange(option.value);
        _$insert2(_el$3, () => option.label);
        _$effect2(() => _$setAttribute2(_el$3, "data-active", String(props.value === option.value)));
        return _el$3;
      })()
    }), null);
    return _el$;
  })();
}
_$delegateEvents2(["click"]);

// src/solid/components/ModuleFolder.tsx
var _tmpl$11 = /* @__PURE__ */ _$template3(`<span class=dialkit-hint role=tooltip>`);
var _tmpl$23 = /* @__PURE__ */ _$template3(`<div class="dialkit-module dialkit-module-folder"><div class="dialkit-module-header dialkit-module-header-toggle"><span class=dialkit-module-title></span><div class=dialkit-module-switch></div></div><div class=dialkit-module-collapse><div class=dialkit-module-collapse-clip><div class=dialkit-module-inner>`);
var ENABLE_OPTIONS = [{
  value: "off",
  label: "Off"
}, {
  value: "on",
  label: "On"
}];
function ModuleFolder(props) {
  const [isOpen, setIsOpen] = createSignal6(props.defaultOpen ?? true);
  const handleEnabledChange = (next) => {
    props.onEnabledChange(next);
    if (next) setIsOpen(true);
  };
  return (() => {
    var _el$ = _tmpl$23(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$6 = _el$2.nextSibling, _el$7 = _el$6.firstChild, _el$8 = _el$7.firstChild;
    _el$2.$$click = () => {
      if (props.enabled) setIsOpen((open) => !open);
    };
    _$insert3(_el$3, () => props.title);
    _el$4.$$click = (e) => e.stopPropagation();
    _$insert3(_el$4, _$createComponent4(SegmentedControl, {
      options: ENABLE_OPTIONS,
      get value() {
        return props.enabled ? "on" : "off";
      },
      onChange: (v) => handleEnabledChange(v === "on")
    }));
    _$insert3(_el$2, _$createComponent4(Show3, {
      get when() {
        return props.hint;
      },
      get children() {
        var _el$5 = _tmpl$11();
        _$insert3(_el$5, () => props.hint);
        _$effect3(() => _$setAttribute3(_el$5, "id", props.hintId));
        return _el$5;
      }
    }), null);
    _$insert3(_el$8, () => props.children);
    _$effect3((_p$) => {
      var _v$ = props.enabled && isOpen() ? "true" : "false", _v$2 = props.hint ? "true" : void 0, _v$3 = props.hint ? props.hintId : void 0, _v$4 = props.enabled && isOpen();
      _v$ !== _p$.e && _$setAttribute3(_el$, "data-open", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute3(_el$2, "data-hint", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute3(_el$2, "aria-describedby", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute3(_el$6, "data-open", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
_$delegateEvents3(["click"]);

// src/solid/components/ControlShell.tsx
import { template as _$template4 } from "solid-js/web";
import { delegateEvents as _$delegateEvents4 } from "solid-js/web";
import { mergeProps as _$mergeProps } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty2 } from "solid-js/web";
import { memo as _$memo3 } from "solid-js/web";
import { use as _$use3 } from "solid-js/web";
import { createComponent as _$createComponent5 } from "solid-js/web";
import { setAttribute as _$setAttribute4 } from "solid-js/web";
import { effect as _$effect4 } from "solid-js/web";
import { insert as _$insert4 } from "solid-js/web";
import { createEffect as createEffect5, createSignal as createSignal7, onCleanup as onCleanup5, Show as Show4 } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";

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

// src/solid/components/ControlShell.tsx
var _tmpl$12 = /* @__PURE__ */ _$template4(`<span class=dialkit-hint role=tooltip>`);
var _tmpl$24 = /* @__PURE__ */ _$template4(`<button type=button class=dialkit-affordance-dot>`);
var _tmpl$33 = /* @__PURE__ */ _$template4(`<div class=dialkit-control-tip>`);
var _tmpl$42 = /* @__PURE__ */ _$template4(`<div class=dialkit-affordance-popover role=dialog tabindex=-1><span class=dialkit-affordance-popover-title>`);
function ControlShell(props) {
  const hasAffordance = () => Boolean(props.affordance && props.panelId && props.path);
  const label = () => props.affordance?.label ?? "Options";
  const [open, setOpen] = createSignal7(false);
  const [status, setStatus] = createSignal7("off");
  const [disabled, setDisabled] = createSignal7(false);
  const [pos, setPos] = createSignal7(null);
  const [portalTarget, setPortalTarget] = createSignal7(null);
  let dotEl;
  let popoverEl;
  createEffect5(() => {
    const panelId = props.panelId;
    const path = props.path;
    if (!panelId || !path) return;
    const read = () => {
      setStatus(DialStore.getAffordanceStatus(panelId, path));
      setDisabled(DialStore.isDisabled(panelId, path));
    };
    read();
    onCleanup5(DialStore.subscribeControlState(panelId, read));
  });
  createEffect5(() => {
    if (!dotEl) return;
    setPortalTarget(dotEl.closest(".dialkit-root") ?? document.body);
  });
  const place = () => {
    const rect = dotEl?.getBoundingClientRect();
    if (!rect) return;
    const next = placePopover(rect, popoverEl?.offsetHeight ?? 0, window.innerHeight);
    setPos((cur) => cur && cur.top === next.top && cur.left === next.left ? cur : next);
  };
  createEffect5(() => {
    if (!open()) {
      setPos(null);
      return;
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    const onPointerDown = (e) => {
      const target = e.target;
      if (dotEl?.contains(target) || popoverEl?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      dotEl?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    onCleanup5(() => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
  });
  createEffect5(() => {
    if (open() && pos() && popoverEl) place();
  });
  createEffect5(() => {
    if (!open() || !popoverEl) return;
    const first = popoverEl.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
    (first ?? popoverEl).focus();
  });
  const ctx = () => ({
    panelId: props.panelId,
    path: props.path,
    status: status(),
    setStatus: (next) => DialStore.setAffordanceStatus(props.panelId, props.path, next)
  });
  return [(() => {
    var _el$ = _tmpl$33();
    _$insert4(_el$, () => props.children, null);
    _$insert4(_el$, _$createComponent5(Show4, {
      get when() {
        return props.hint;
      },
      get children() {
        var _el$2 = _tmpl$12();
        _$insert4(_el$2, () => props.hint);
        _$effect4(() => _$setAttribute4(_el$2, "id", props.id));
        return _el$2;
      }
    }), null);
    _$insert4(_el$, _$createComponent5(Show4, {
      get when() {
        return hasAffordance();
      },
      get children() {
        var _el$3 = _tmpl$24();
        _el$3.$$click = () => setOpen(!open());
        var _ref$ = dotEl;
        typeof _ref$ === "function" ? _$use3(_ref$, _el$3) : dotEl = _el$3;
        _$effect4((_p$) => {
          var _v$ = status(), _v$2 = String(open()), _v$3 = label(), _v$4 = open();
          _v$ !== _p$.e && _$setAttribute4(_el$3, "data-status", _p$.e = _v$);
          _v$2 !== _p$.t && _$setAttribute4(_el$3, "data-open", _p$.t = _v$2);
          _v$3 !== _p$.a && _$setAttribute4(_el$3, "aria-label", _p$.a = _v$3);
          _v$4 !== _p$.o && _$setAttribute4(_el$3, "aria-expanded", _p$.o = _v$4);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$3;
      }
    }), null);
    _$effect4((_p$) => {
      var _v$5 = props.hint ? "true" : void 0, _v$6 = hasAffordance() ? "true" : void 0, _v$7 = open() ? "true" : void 0, _v$8 = disabled() ? "true" : void 0, _v$9 = disabled() ? "true" : void 0, _v$0 = props.hint ? "group" : void 0, _v$1 = props.hint ? props.id : void 0, _v$10 = props.hint ? void 0 : props.title;
      _v$5 !== _p$.e && _$setAttribute4(_el$, "data-hint", _p$.e = _v$5);
      _v$6 !== _p$.t && _$setAttribute4(_el$, "data-affordance", _p$.t = _v$6);
      _v$7 !== _p$.a && _$setAttribute4(_el$, "data-affordance-open", _p$.a = _v$7);
      _v$8 !== _p$.o && _$setAttribute4(_el$, "data-disabled", _p$.o = _v$8);
      _v$9 !== _p$.i && _$setAttribute4(_el$, "aria-disabled", _p$.i = _v$9);
      _v$0 !== _p$.n && _$setAttribute4(_el$, "role", _p$.n = _v$0);
      _v$1 !== _p$.s && _$setAttribute4(_el$, "aria-describedby", _p$.s = _v$1);
      _v$10 !== _p$.h && _$setAttribute4(_el$, "title", _p$.h = _v$10);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0
    });
    return _el$;
  })(), _$createComponent5(Show4, {
    get when() {
      return _$memo3(() => !!(open() && hasAffordance()))() && portalTarget();
    },
    get children() {
      return _$createComponent5(Portal, {
        get mount() {
          return portalTarget();
        },
        get children() {
          var _el$4 = _tmpl$42(), _el$5 = _el$4.firstChild;
          var _ref$2 = popoverEl;
          typeof _ref$2 === "function" ? _$use3(_ref$2, _el$4) : popoverEl = _el$4;
          _$setStyleProperty2(_el$4, "width", `${AFFORDANCE_POPOVER_WIDTH}px`);
          _$insert4(_el$5, label);
          _$insert4(_el$4, _$createComponent5(Dynamic, _$mergeProps({
            get component() {
              return props.affordance.content;
            }
          }, ctx)), null);
          _$effect4((_p$) => {
            var _v$11 = label(), _v$12 = `${pos()?.left ?? 0}px`, _v$13 = `${pos()?.top ?? 0}px`, _v$14 = pos() ? void 0 : "hidden";
            _v$11 !== _p$.e && _$setAttribute4(_el$4, "aria-label", _p$.e = _v$11);
            _v$12 !== _p$.t && _$setStyleProperty2(_el$4, "left", _p$.t = _v$12);
            _v$13 !== _p$.a && _$setStyleProperty2(_el$4, "top", _p$.a = _v$13);
            _v$14 !== _p$.o && _$setStyleProperty2(_el$4, "visibility", _p$.o = _v$14);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$4;
        }
      });
    }
  })];
}
_$delegateEvents4(["click"]);

// src/solid/components/Slider.tsx
import { template as _$template5 } from "solid-js/web";
import { delegateEvents as _$delegateEvents5 } from "solid-js/web";
import { memo as _$memo4 } from "solid-js/web";
import { createComponent as _$createComponent6 } from "solid-js/web";
import { className as _$className2 } from "solid-js/web";
import { effect as _$effect5 } from "solid-js/web";
import { insert as _$insert5 } from "solid-js/web";
import { use as _$use4 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty3 } from "solid-js/web";
import { createSignal as createSignal8, createEffect as createEffect6, onMount as onMount4, onCleanup as onCleanup6, Show as Show5 } from "solid-js";
import { animate as animate2, motionValue } from "motion";
var _tmpl$13 = /* @__PURE__ */ _$template5(`<div class=dialkit-slider-hashmark>`);
var _tmpl$25 = /* @__PURE__ */ _$template5(`<span>`);
var _tmpl$34 = /* @__PURE__ */ _$template5(`<div class=dialkit-slider-wrapper><div><div class=dialkit-slider-hashmarks></div><div class=dialkit-slider-fill></div><div class=dialkit-slider-handle style="transform:translateY(-50%) scaleX(0.25) scaleY(1);opacity:0"></div><span class=dialkit-slider-label>`);
var _tmpl$43 = /* @__PURE__ */ _$template5(`<input type=text class=dialkit-slider-input>`);
var CLICK_THRESHOLD = 3;
var DEAD_ZONE = 32;
var MAX_CURSOR_RANGE = 200;
var MAX_STRETCH = 8;
var DETENT_PX = 6;
function Slider(props) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 1;
  const step = () => props.step ?? 0.01;
  const resolvedOrigin = () => Math.min(max(), Math.max(min(), props.origin ?? (props.bipolar ? 0 : min())));
  const hasOrigin = () => resolvedOrigin() > min();
  const originPercent = () => (resolvedOrigin() - min()) / (max() - min()) * 100;
  let wrapperRef;
  let trackRef;
  let fillRef;
  let handleRef;
  let labelRef;
  let valueSpanRef;
  let inputRef;
  const [isInteracting, setIsInteracting] = createSignal8(false);
  const [isDragging, setIsDragging] = createSignal8(false);
  const [isHovered, setIsHovered] = createSignal8(false);
  const [isValueHovered, setIsValueHovered] = createSignal8(false);
  const [isValueEditable, setIsValueEditable] = createSignal8(false);
  const [showInput, setShowInput] = createSignal8(false);
  const [inputValue, setInputValue] = createSignal8("");
  const fillPercent = motionValue((props.value - min()) / (max() - min()) * 100);
  const rubberStretchPx = motionValue(0);
  const handleOpacityMv = motionValue(0);
  const handleScaleXMv = motionValue(0.25);
  const handleScaleYMv = motionValue(1);
  const applyFillStyles = (pct) => {
    if (fillRef) {
      fillRef.style.left = hasOrigin() ? `${Math.min(pct, originPercent())}%` : "0%";
      fillRef.style.width = hasOrigin() ? `${Math.abs(pct - originPercent())}%` : `${pct}%`;
    }
    if (handleRef) handleRef.style.left = `max(5px, calc(${pct}% - 9px))`;
  };
  const applyDetent = (v) => {
    if (!hasOrigin() || !wrapperRef) return v;
    const trackWidth = wrapperRef.offsetWidth;
    if (trackWidth <= 0) return v;
    const detentValue = DETENT_PX / trackWidth * (max() - min());
    return Math.abs(v - resolvedOrigin()) <= detentValue ? resolvedOrigin() : v;
  };
  const applyRubberStyles = (stretch) => {
    if (!trackRef) return;
    trackRef.style.width = `calc(100% + ${Math.abs(stretch)}px)`;
    trackRef.style.transform = `translateX(${stretch < 0 ? stretch : 0}px)`;
  };
  const applyHandleVisualStyles = () => {
    if (!handleRef) return;
    handleRef.style.opacity = String(handleOpacityMv.get());
    handleRef.style.transform = `translateY(-50%) scaleX(${handleScaleXMv.get()}) scaleY(${handleScaleYMv.get()})`;
  };
  createEffect6(() => {
    if (!isInteracting() && !snapAnim) {
      fillPercent.jump((props.value - min()) / (max() - min()) * 100);
    }
  });
  const percentage = () => (props.value - min()) / (max() - min()) * 100;
  const isActive = () => isInteracting() || isHovered();
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
  const positionToValue = (clientX) => {
    if (!wrapperRect) return props.value;
    const screenX = clientX - wrapperRect.left;
    const sceneX = screenX / scaleVal;
    const nativeWidth = wrapperRef ? wrapperRef.offsetWidth : wrapperRect.width;
    const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
    const rawValue = min() + percent * (max() - min());
    return Math.max(min(), Math.min(max(), rawValue));
  };
  const percentFromValue = (v) => (v - min()) / (max() - min()) * 100;
  const computeRubberStretch = (clientX, sign) => {
    if (!wrapperRect) return 0;
    const distancePast = sign < 0 ? wrapperRect.left - clientX : clientX - wrapperRect.right;
    const overflow = Math.max(0, distancePast - DEAD_ZONE);
    return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
  };
  const cancelInteraction = () => {
    if (!isInteracting()) return;
    setIsInteracting(false);
    setIsDragging(false);
    rubberStretchPx.jump(0);
    pointerDownPos = null;
  };
  const handlePointerDown = (e) => {
    if (showInput()) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerDownPos = {
      x: e.clientX,
      y: e.clientY
    };
    isClickFlag = true;
    setIsInteracting(true);
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      scaleVal = wrapperRect.width / wrapperRef.offsetWidth;
    }
  };
  const handlePointerMove = (e) => {
    if (!isInteracting() || !pointerDownPos) return;
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (isClickFlag && distance > CLICK_THRESHOLD) {
      isClickFlag = false;
      setIsDragging(true);
    }
    if (!isClickFlag) {
      if (wrapperRect) {
        if (e.clientX < wrapperRect.left) {
          rubberStretchPx.jump(computeRubberStretch(e.clientX, -1));
        } else if (e.clientX > wrapperRect.right) {
          rubberStretchPx.jump(computeRubberStretch(e.clientX, 1));
        } else {
          rubberStretchPx.jump(0);
        }
      }
      const newValue = applyDetent(positionToValue(e.clientX));
      const newPct = percentFromValue(newValue);
      if (snapAnim) {
        snapAnim.stop();
        snapAnim = null;
      }
      fillPercent.jump(newPct);
      props.onChange(roundValue(newValue, step()));
    }
  };
  const handlePointerUp = (e) => {
    if (!isInteracting()) return;
    if (isClickFlag) {
      const rawValue = positionToValue(e.clientX);
      const discreteSteps2 = (max() - min()) / step();
      const snappedValue = discreteSteps2 <= 10 ? Math.max(min(), Math.min(max(), min() + Math.round((rawValue - min()) / step()) * step())) : snapToDecile(rawValue, min(), max());
      const newPct = percentFromValue(snappedValue);
      if (snapAnim) snapAnim.stop();
      snapAnim = animate2(fillPercent, newPct, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          snapAnim = null;
        }
      });
      props.onChange(roundValue(snappedValue, step()));
    }
    if (rubberStretchPx.get() !== 0) {
      if (rubberAnim) rubberAnim.stop();
      rubberAnim = animate2(rubberStretchPx, 0, {
        type: "spring",
        visualDuration: 0.35,
        bounce: 0.15
      });
    }
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
  };
  const handlePointerCancel = () => {
    cancelInteraction();
  };
  createEffect6(() => {
    const hovered = isValueHovered();
    const editing = showInput();
    const editable = isValueEditable();
    onCleanup6(() => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    });
    if (hovered && !editing && !editable) {
      hoverTimeout = setTimeout(() => setIsValueEditable(true), 800);
    } else if (!hovered && !editing) {
      setIsValueEditable(false);
    }
  });
  onCleanup6(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    snapAnim?.stop();
    rubberAnim?.stop();
    handleOpacityAnim?.stop();
    handleScaleXAnim?.stop();
    handleScaleYAnim?.stop();
  });
  onMount4(() => {
    const unsubFill = fillPercent.on("change", applyFillStyles);
    const unsubRubber = rubberStretchPx.on("change", applyRubberStyles);
    const unsubHandleOpacity = handleOpacityMv.on("change", applyHandleVisualStyles);
    const unsubHandleScaleX = handleScaleXMv.on("change", applyHandleVisualStyles);
    const unsubHandleScaleY = handleScaleYMv.on("change", applyHandleVisualStyles);
    applyFillStyles(fillPercent.get());
    applyRubberStyles(rubberStretchPx.get());
    applyHandleVisualStyles();
    onCleanup6(() => {
      unsubFill();
      unsubRubber();
      unsubHandleOpacity();
      unsubHandleScaleX();
      unsubHandleScaleY();
    });
  });
  createEffect6(() => {
    if (showInput() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue());
    if (!isNaN(parsed)) {
      const clamped = Math.max(min(), Math.min(max(), parsed));
      props.onChange(roundValue(clamped, step()));
    }
    setShowInput(false);
    setIsValueHovered(false);
    setIsValueEditable(false);
  };
  const handleValueClick = (e) => {
    if (isValueEditable()) {
      e.stopPropagation();
      e.preventDefault();
      setShowInput(true);
      setInputValue(props.value.toFixed(decimalsForStep2(step())));
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleInputSubmit();
    else if (e.key === "Escape") {
      setShowInput(false);
      setIsValueHovered(false);
    }
  };
  const displayValue = () => props.value.toFixed(decimalsForStep2(step()));
  const HANDLE_BUFFER = 8;
  const LABEL_CSS_LEFT = 10;
  const VALUE_CSS_RIGHT = 10;
  const leftThreshold = () => {
    const trackWidth = wrapperRef?.offsetWidth;
    if (trackWidth && labelRef) {
      return (LABEL_CSS_LEFT + labelRef.offsetWidth + HANDLE_BUFFER) / trackWidth * 100;
    }
    return 30;
  };
  const rightThreshold = () => {
    const trackWidth = wrapperRef?.offsetWidth;
    if (trackWidth && valueSpanRef) {
      return (trackWidth - VALUE_CSS_RIGHT - valueSpanRef.offsetWidth - HANDLE_BUFFER) / trackWidth * 100;
    }
    return 78;
  };
  const valueDodge = () => percentage() < leftThreshold() || percentage() > rightThreshold();
  const handleOpacity = () => {
    if (!isActive()) return 0;
    if (valueDodge()) return 0.1;
    if (isDragging()) return 0.9;
    return 0.5;
  };
  createEffect6(() => {
    const targetOpacity = handleOpacity();
    const targetScaleX = isActive() ? 1 : 0.25;
    const targetScaleY = isActive() && valueDodge() ? 0.75 : 1;
    handleOpacityAnim?.stop();
    handleScaleXAnim?.stop();
    handleScaleYAnim?.stop();
    handleOpacityAnim = animate2(handleOpacityMv, targetOpacity, {
      duration: 0.15
    });
    handleScaleXAnim = animate2(handleScaleXMv, targetScaleX, {
      type: "spring",
      visualDuration: 0.25,
      bounce: 0.15
    });
    handleScaleYAnim = animate2(handleScaleYMv, targetScaleY, {
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.1
    });
  });
  const discreteSteps = () => (max() - min()) / step();
  const hashMarks = () => {
    const ds = discreteSteps();
    if (ds <= 10) {
      return Array.from({
        length: ds - 1
      }, (_, i) => {
        const pct = (i + 1) * step() / (max() - min()) * 100;
        return (() => {
          var _el$ = _tmpl$13();
          _$setStyleProperty3(_el$, "left", `${pct}%`);
          return _el$;
        })();
      });
    }
    return Array.from({
      length: 9
    }, (_, i) => {
      const pct = (i + 1) * 10;
      return (() => {
        var _el$2 = _tmpl$13();
        _$setStyleProperty3(_el$2, "left", `${pct}%`);
        return _el$2;
      })();
    });
  };
  return (() => {
    var _el$3 = _tmpl$34(), _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling;
    var _ref$ = wrapperRef;
    typeof _ref$ === "function" ? _$use4(_ref$, _el$3) : wrapperRef = _el$3;
    _el$4.addEventListener("mouseleave", () => setIsHovered(false));
    _el$4.addEventListener("mouseenter", () => setIsHovered(true));
    _el$4.addEventListener("pointercancel", handlePointerCancel);
    _el$4.$$pointerup = handlePointerUp;
    _el$4.$$pointermove = handlePointerMove;
    _el$4.$$pointerdown = handlePointerDown;
    var _ref$2 = trackRef;
    typeof _ref$2 === "function" ? _$use4(_ref$2, _el$4) : trackRef = _el$4;
    _$insert5(_el$5, hashMarks);
    var _ref$3 = fillRef;
    typeof _ref$3 === "function" ? _$use4(_ref$3, _el$6) : fillRef = _el$6;
    var _ref$4 = handleRef;
    typeof _ref$4 === "function" ? _$use4(_ref$4, _el$7) : handleRef = _el$7;
    var _ref$5 = labelRef;
    typeof _ref$5 === "function" ? _$use4(_ref$5, _el$8) : labelRef = _el$8;
    _$insert5(_el$8, () => props.label, null);
    _$insert5(_el$8, _$createComponent6(Show5, {
      get when() {
        return props.shortcut;
      },
      get children() {
        var _el$9 = _tmpl$25();
        _$insert5(_el$9, () => formatSliderShortcut(props.shortcut));
        _$effect5(() => _$className2(_el$9, `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`));
        return _el$9;
      }
    }), null);
    _$insert5(_el$4, (() => {
      var _c$ = _$memo4(() => !!showInput());
      return () => _c$() ? (() => {
        var _el$0 = _tmpl$43();
        _el$0.$$mousedown = (e) => e.stopPropagation();
        _el$0.$$click = (e) => e.stopPropagation();
        _el$0.addEventListener("blur", handleInputSubmit);
        _el$0.$$keydown = handleInputKeyDown;
        _el$0.$$input = (e) => setInputValue(e.currentTarget.value);
        var _ref$6 = inputRef;
        typeof _ref$6 === "function" ? _$use4(_ref$6, _el$0) : inputRef = _el$0;
        _$effect5(() => _el$0.value = inputValue());
        return _el$0;
      })() : (() => {
        var _el$1 = _tmpl$25();
        _el$1.$$mousedown = (e) => isValueEditable() && e.stopPropagation();
        _el$1.$$click = handleValueClick;
        _el$1.addEventListener("mouseleave", () => setIsValueHovered(false));
        _el$1.addEventListener("mouseenter", () => setIsValueHovered(true));
        var _ref$7 = valueSpanRef;
        typeof _ref$7 === "function" ? _$use4(_ref$7, _el$1) : valueSpanRef = _el$1;
        _$insert5(_el$1, displayValue);
        _$effect5((_p$) => {
          var _v$5 = `dialkit-slider-value ${isValueEditable() ? "dialkit-slider-value-editable" : ""}`, _v$6 = isValueEditable() ? "text" : "default";
          _v$5 !== _p$.e && _$className2(_el$1, _p$.e = _v$5);
          _v$6 !== _p$.t && _$setStyleProperty3(_el$1, "cursor", _p$.t = _v$6);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$1;
      })();
    })(), null);
    _$effect5((_p$) => {
      var _v$ = `dialkit-slider ${isActive() ? "dialkit-slider-active" : ""}`, _v$2 = hasOrigin() ? `${Math.min(fillPercent.get(), originPercent())}%` : "0%", _v$3 = hasOrigin() ? `${Math.abs(fillPercent.get() - originPercent())}%` : `${fillPercent.get()}%`, _v$4 = `max(5px, calc(${fillPercent.get()}% - 9px))`;
      _v$ !== _p$.e && _$className2(_el$4, _p$.e = _v$);
      _v$2 !== _p$.t && _$setStyleProperty3(_el$6, "left", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setStyleProperty3(_el$6, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setStyleProperty3(_el$7, "left", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$3;
  })();
}
_$delegateEvents5(["pointerdown", "pointermove", "pointerup", "input", "keydown", "click", "mousedown"]);

// src/solid/components/RangeSlider.tsx
import { template as _$template6 } from "solid-js/web";
import { delegateEvents as _$delegateEvents6 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty4 } from "solid-js/web";
import { className as _$className3 } from "solid-js/web";
import { createComponent as _$createComponent7 } from "solid-js/web";
import { effect as _$effect6 } from "solid-js/web";
import { insert as _$insert6 } from "solid-js/web";
import { use as _$use5 } from "solid-js/web";
import { createSignal as createSignal9, createEffect as createEffect7, onMount as onMount5, onCleanup as onCleanup7, Show as Show6 } from "solid-js";
import { animate as animate3, motionValue as motionValue2 } from "motion";
var _tmpl$14 = /* @__PURE__ */ _$template6(`<input type=text class=dialkit-range-slider-input>`);
var _tmpl$26 = /* @__PURE__ */ _$template6(`<div class=dialkit-range-slider-wrapper><div><div class=dialkit-range-slider-fill></div><div class=dialkit-range-slider-handle style=transform:translateY(-50%);opacity:0.35></div><div class=dialkit-range-slider-handle style=transform:translateY(-50%);opacity:0.35></div><span class=dialkit-range-slider-label>`);
var _tmpl$35 = /* @__PURE__ */ _$template6(`<span class=dialkit-range-slider-value><span class=dialkit-range-slider-bound></span><span class=dialkit-range-slider-dash>\u2013</span><span class=dialkit-range-slider-bound>`);
var CLICK_THRESHOLD2 = 3;
var HANDLE_HIT_PX = 12;
function RangeSlider(props) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 1;
  const step = () => props.step ?? 0.01;
  let wrapperRef;
  let trackRef;
  let fillRef;
  let lowHandleRef;
  let highHandleRef;
  let inputRef;
  const [isInteracting, setIsInteracting] = createSignal9(false);
  const [isDragging, setIsDragging] = createSignal9(false);
  const [isHovered, setIsHovered] = createSignal9(false);
  const [editing, setEditing] = createSignal9(null);
  const [inputValue, setInputValue] = createSignal9("");
  const [dragTarget, setDragTarget] = createSignal9(null);
  const value = () => isInteracting() ? props.value : clampRange(props.value, min(), max());
  const span = () => max() - min();
  const lowPercent = () => span() === 0 ? 0 : (value().min - min()) / span() * 100;
  const highPercent = () => span() === 0 ? 0 : (value().max - min()) / span() * 100;
  const isActive = () => isInteracting() || isHovered();
  const lowMotion = motionValue2(lowPercent());
  const highMotion = motionValue2(highPercent());
  const applyFillStyles = () => {
    const lo = lowMotion.get();
    const hi = highMotion.get();
    if (fillRef) {
      fillRef.style.left = `${lo}%`;
      fillRef.style.width = `${Math.max(0, hi - lo)}%`;
    }
    const handles = handleLeftStyles(lo, hi);
    if (lowHandleRef) lowHandleRef.style.left = handles.low;
    if (highHandleRef) highHandleRef.style.left = handles.high;
  };
  let pointerDownPos = null;
  let isClickFlag = true;
  let clickMoves = false;
  let wrapperRect = null;
  let scaleVal = 1;
  let dragStartValue = props.value;
  let dragStartValueAt = 0;
  let lowSnapAnim = null;
  let highSnapAnim = null;
  const stopSnaps = () => {
    lowSnapAnim?.stop();
    highSnapAnim?.stop();
    lowSnapAnim = null;
    highSnapAnim = null;
  };
  let lowOpacityAnim = null;
  let highOpacityAnim = null;
  const positionToValue = (clientX) => {
    if (!wrapperRect) return value().min;
    const screenX = clientX - wrapperRect.left;
    const sceneX = screenX / scaleVal;
    const nativeWidth = wrapperRef ? wrapperRef.offsetWidth : wrapperRect.width;
    const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
    const rawValue = min() + percent * (max() - min());
    return Math.max(min(), Math.min(max(), rawValue));
  };
  const percentFromValue = (v) => span() === 0 ? 0 : (v - min()) / span() * 100;
  const syncMotion = (next) => {
    lowMotion.jump(percentFromValue(next.min));
    highMotion.jump(percentFromValue(next.max));
  };
  createEffect7(() => {
    if (!isInteracting() && !lowSnapAnim && !highSnapAnim) {
      lowMotion.jump(lowPercent());
      highMotion.jump(highPercent());
    }
  });
  const handlePointerDown = (e) => {
    if (editing()) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerDownPos = {
      x: e.clientX,
      y: e.clientY
    };
    isClickFlag = true;
    setIsInteracting(true);
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      scaleVal = wrapperRect.width / wrapperRef.offsetWidth;
    }
    const current = clampRange(props.value, min(), max());
    const atValue = positionToValue(e.clientX);
    const trackW = wrapperRef?.offsetWidth ?? 1;
    const hitV = HANDLE_HIT_PX / trackW * (max() - min());
    const target = pickDragTarget(atValue, current, hitV);
    setDragTarget(target);
    clickMoves = target !== "span" && isOutsideSpan(atValue, current);
    dragStartValue = current;
    dragStartValueAt = atValue;
  };
  const handlePointerMove = (e) => {
    if (!isInteracting() || !pointerDownPos) return;
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (isClickFlag && distance > CLICK_THRESHOLD2) {
      isClickFlag = false;
      setIsDragging(true);
    }
    if (isClickFlag) return;
    const raw = roundValue(positionToValue(e.clientX), step());
    const target = dragTarget();
    const current = value();
    let next;
    if (target === "span") {
      const delta = raw - roundValue(dragStartValueAt, step());
      next = shiftSpan(delta, dragStartValue, min(), max());
    } else if (target === "min") {
      next = setLow(raw, current, min());
    } else {
      next = setHigh(raw, current, max());
    }
    stopSnaps();
    syncMotion(next);
    props.onChange(next);
  };
  const handlePointerUp = (e) => {
    if (!isInteracting()) return;
    if (isClickFlag && clickMoves) {
      const raw = roundValue(positionToValue(e.clientX), step());
      const current = value();
      const which = dragTarget() ?? nearestHandle(raw, current);
      const next = which === "min" ? setLow(raw, current, min()) : setHigh(raw, current, max());
      const handleMotion = which === "min" ? lowMotion : highMotion;
      const targetPct = percentFromValue(which === "min" ? next.min : next.max);
      stopSnaps();
      const anim = animate3(handleMotion, targetPct, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          if (which === "min") lowSnapAnim = null;
          else highSnapAnim = null;
        }
      });
      if (which === "min") lowSnapAnim = anim;
      else highSnapAnim = anim;
      props.onChange(next);
    }
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
    setDragTarget(null);
  };
  const handlePointerCancel = () => {
    if (!isInteracting()) return;
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
    setDragTarget(null);
  };
  const handleDoubleClick = () => {
    if (editing() !== null) return;
    const d = clampRange(props.defaultValue ?? {
      min: min(),
      max: max()
    }, min(), max());
    stopSnaps();
    lowSnapAnim = animate3(lowMotion, percentFromValue(d.min), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        lowSnapAnim = null;
      }
    });
    highSnapAnim = animate3(highMotion, percentFromValue(d.max), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        highSnapAnim = null;
      }
    });
    props.onChange(d);
  };
  const restOpacity = 0.35;
  const lowOpacityMv = motionValue2(restOpacity);
  const highOpacityMv = motionValue2(restOpacity);
  const applyLowHandleOpacity = () => {
    if (lowHandleRef) lowHandleRef.style.opacity = String(lowOpacityMv.get());
  };
  const applyHighHandleOpacity = () => {
    if (highHandleRef) highHandleRef.style.opacity = String(highOpacityMv.get());
  };
  createEffect7(() => {
    const active = isActive();
    const dragging = isDragging();
    const target = dragTarget();
    const lowTarget = !active ? restOpacity : dragging && target === "min" ? 0.95 : 0.7;
    const highTarget = !active ? restOpacity : dragging && target === "max" ? 0.95 : 0.7;
    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
    lowOpacityAnim = animate3(lowOpacityMv, lowTarget, {
      duration: 0.15
    });
    highOpacityAnim = animate3(highOpacityMv, highTarget, {
      duration: 0.15
    });
  });
  onMount5(() => {
    const unsubLow = lowMotion.on("change", applyFillStyles);
    const unsubHigh = highMotion.on("change", applyFillStyles);
    const unsubLowOpacity = lowOpacityMv.on("change", applyLowHandleOpacity);
    const unsubHighOpacity = highOpacityMv.on("change", applyHighHandleOpacity);
    applyFillStyles();
    applyLowHandleOpacity();
    applyHighHandleOpacity();
    onCleanup7(() => {
      unsubLow();
      unsubHigh();
      unsubLowOpacity();
      unsubHighOpacity();
    });
  });
  onCleanup7(() => {
    stopSnaps();
    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
  });
  createEffect7(() => {
    if (editing() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });
  const decimals = () => decimalsForStep2(step());
  const openEditor = (which) => {
    setEditing(which);
    setInputValue((which === "min" ? value().min : value().max).toFixed(decimals()));
  };
  const commitEditor = () => {
    const which = editing();
    if (!which) return;
    const parsed = parseFloat(inputValue());
    if (!isNaN(parsed)) {
      const rounded = roundValue(parsed, step());
      const current = value();
      const next = which === "min" ? setLow(rounded, current, min()) : setHigh(rounded, current, max());
      props.onChange(next);
    }
    setEditing(null);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") commitEditor();
    else if (e.key === "Escape") setEditing(null);
  };
  const lowText = () => value().min.toFixed(decimals());
  const highText = () => value().max.toFixed(decimals());
  return (() => {
    var _el$ = _tmpl$26(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling;
    var _ref$ = wrapperRef;
    typeof _ref$ === "function" ? _$use5(_ref$, _el$) : wrapperRef = _el$;
    _el$2.addEventListener("mouseleave", () => setIsHovered(false));
    _el$2.addEventListener("mouseenter", () => setIsHovered(true));
    _el$2.$$dblclick = handleDoubleClick;
    _el$2.addEventListener("pointercancel", handlePointerCancel);
    _el$2.$$pointerup = handlePointerUp;
    _el$2.$$pointermove = handlePointerMove;
    _el$2.$$pointerdown = handlePointerDown;
    var _ref$2 = trackRef;
    typeof _ref$2 === "function" ? _$use5(_ref$2, _el$2) : trackRef = _el$2;
    var _ref$3 = fillRef;
    typeof _ref$3 === "function" ? _$use5(_ref$3, _el$3) : fillRef = _el$3;
    var _ref$4 = lowHandleRef;
    typeof _ref$4 === "function" ? _$use5(_ref$4, _el$4) : lowHandleRef = _el$4;
    var _ref$5 = highHandleRef;
    typeof _ref$5 === "function" ? _$use5(_ref$5, _el$5) : highHandleRef = _el$5;
    _$insert6(_el$6, () => props.label);
    _$insert6(_el$2, _$createComponent7(Show6, {
      get when() {
        return editing() !== null;
      },
      get fallback() {
        return (() => {
          var _el$8 = _tmpl$35(), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling;
          _el$9.$$pointerdown = (e) => e.stopPropagation();
          _el$9.$$click = (e) => {
            e.stopPropagation();
            openEditor("min");
          };
          _$insert6(_el$9, lowText);
          _el$1.$$pointerdown = (e) => e.stopPropagation();
          _el$1.$$click = (e) => {
            e.stopPropagation();
            openEditor("max");
          };
          _$insert6(_el$1, highText);
          return _el$8;
        })();
      },
      get children() {
        var _el$7 = _tmpl$14();
        _el$7.$$pointerdown = (e) => e.stopPropagation();
        _el$7.$$click = (e) => e.stopPropagation();
        _el$7.addEventListener("blur", commitEditor);
        _el$7.$$keydown = handleInputKeyDown;
        _el$7.$$input = (e) => setInputValue(e.currentTarget.value);
        var _ref$6 = inputRef;
        typeof _ref$6 === "function" ? _$use5(_ref$6, _el$7) : inputRef = _el$7;
        _$effect6(() => _el$7.value = inputValue());
        return _el$7;
      }
    }), null);
    _$effect6((_p$) => {
      var _v$ = `dialkit-range-slider ${isActive() ? "dialkit-range-slider-active" : ""}`, _v$2 = `${lowPercent()}%`, _v$3 = `${Math.max(0, highPercent() - lowPercent())}%`, _v$4 = handleLeftStyles(lowPercent(), highPercent()).low, _v$5 = handleLeftStyles(lowPercent(), highPercent()).high;
      _v$ !== _p$.e && _$className3(_el$2, _p$.e = _v$);
      _v$2 !== _p$.t && _$setStyleProperty4(_el$3, "left", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setStyleProperty4(_el$3, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setStyleProperty4(_el$4, "left", _p$.o = _v$4);
      _v$5 !== _p$.i && _$setStyleProperty4(_el$5, "left", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })();
}
_$delegateEvents6(["pointerdown", "pointermove", "pointerup", "dblclick", "input", "keydown", "click"]);

// src/solid/components/Toggle.tsx
import { template as _$template7 } from "solid-js/web";
import { memo as _$memo5 } from "solid-js/web";
import { createComponent as _$createComponent8 } from "solid-js/web";
import { className as _$className4 } from "solid-js/web";
import { effect as _$effect7 } from "solid-js/web";
import { insert as _$insert7 } from "solid-js/web";
import { Show as Show7 } from "solid-js";
var _tmpl$15 = /* @__PURE__ */ _$template7(`<span>`);
var _tmpl$27 = /* @__PURE__ */ _$template7(`<div class=dialkit-labeled-control><span class=dialkit-labeled-control-label>`);
function Toggle(props) {
  return (() => {
    var _el$ = _tmpl$27(), _el$2 = _el$.firstChild;
    _$insert7(_el$2, () => props.label, null);
    _$insert7(_el$2, _$createComponent8(Show7, {
      get when() {
        return props.shortcut;
      },
      get children() {
        var _el$3 = _tmpl$15();
        _$insert7(_el$3, () => formatToggleShortcut(props.shortcut));
        _$effect7(() => _$className4(_el$3, `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`));
        return _el$3;
      }
    }), null);
    _$insert7(_el$, _$createComponent8(SegmentedControl, {
      options: [{
        value: "off",
        label: "Off"
      }, {
        value: "on",
        label: "On"
      }],
      get value() {
        return props.checked ? "on" : "off";
      },
      onChange: (val) => props.onChange(val === "on")
    }), null);
    return _el$;
  })();
}

// src/solid/components/SpringControl.tsx
import { template as _$template9 } from "solid-js/web";
import { memo as _$memo6 } from "solid-js/web";
import { insert as _$insert9 } from "solid-js/web";
import { createComponent as _$createComponent9 } from "solid-js/web";
import { createSignal as createSignal10, onMount as onMount6, onCleanup as onCleanup8 } from "solid-js";

// src/solid/components/SpringVisualization.tsx
import { template as _$template8 } from "solid-js/web";
import { effect as _$effect8 } from "solid-js/web";
import { insert as _$insert8 } from "solid-js/web";
import { setAttribute as _$setAttribute5 } from "solid-js/web";
var _tmpl$16 = /* @__PURE__ */ _$template8(`<svg><line y1=0 y2=140 stroke="rgba(255, 255, 255, 0.08)"stroke-width=1></svg>`, false, true, false);
var _tmpl$28 = /* @__PURE__ */ _$template8(`<svg><line x1=0 x2=256 stroke="rgba(255, 255, 255, 0.08)"stroke-width=1></svg>`, false, true, false);
var _tmpl$36 = /* @__PURE__ */ _$template8(`<svg viewBox="0 0 256 140"class=dialkit-spring-viz><line x1=0 y1=70 x2=256 y2=70 stroke="rgba(255, 255, 255, 0.15)"stroke-width=1 stroke-dasharray=4,4></line><path fill=none stroke="rgba(255, 255, 255, 0.6)"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`);
function generateSpringCurve(stiffness, damping, mass, duration) {
  const points = [];
  const steps = 100;
  const dt = duration / steps;
  let position = 0;
  let velocity = 0;
  const target = 1;
  for (let i = 0; i <= steps; i++) {
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
function SpringVisualization(props) {
  const width = 256;
  const height = 140;
  const params = () => {
    let stiffness;
    let damping;
    let mass;
    if (props.isSimpleMode) {
      const visualDuration = props.spring.visualDuration ?? 0.3;
      const bounce = props.spring.bounce ?? 0.2;
      mass = 1;
      stiffness = Math.pow(2 * Math.PI / visualDuration, 2);
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
    const pathData = points.map(([time, value], i) => {
      const x = time / duration * width;
      const normalizedValue = (value - minValue) / (valueRange || 1);
      const y = height - (normalizedValue * height * 0.6 + height * 0.2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    return pathData;
  };
  const gridLines = () => {
    const lines = [];
    for (let i = 1; i < 4; i++) {
      const x = width / 4 * i;
      const y = height / 4 * i;
      lines.push((() => {
        var _el$ = _tmpl$16();
        _$setAttribute5(_el$, "x1", x);
        _$setAttribute5(_el$, "x2", x);
        return _el$;
      })(), (() => {
        var _el$2 = _tmpl$28();
        _$setAttribute5(_el$2, "y1", y);
        _$setAttribute5(_el$2, "y2", y);
        return _el$2;
      })());
    }
    return lines;
  };
  return (() => {
    var _el$3 = _tmpl$36(), _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling;
    _$insert8(_el$3, gridLines, _el$4);
    _$effect8(() => _$setAttribute5(_el$5, "d", params()));
    return _el$3;
  })();
}

// src/solid/components/SpringControl.tsx
var _tmpl$17 = /* @__PURE__ */ _$template9(`<div style=display:flex;flex-direction:column;gap:6px><div class=dialkit-labeled-control><span class=dialkit-labeled-control-label>Type`);
function SpringControl(props) {
  const [mode, setMode] = createSignal10(DialStore.getSpringMode(props.panelId, props.path));
  onMount6(() => {
    const unsub = DialStore.subscribe(props.panelId, () => {
      setMode(DialStore.getSpringMode(props.panelId, props.path));
    });
    onCleanup8(unsub);
  });
  const isSimpleMode = () => mode() === "simple";
  const cache2 = {
    simple: props.spring.visualDuration !== void 0 ? props.spring : {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.2
    },
    advanced: props.spring.stiffness !== void 0 ? props.spring : {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 1
    }
  };
  const handleModeChange = (newMode) => {
    if (isSimpleMode()) {
      cache2.simple = props.spring;
    } else {
      cache2.advanced = props.spring;
    }
    DialStore.updateSpringMode(props.panelId, props.path, newMode);
    if (newMode === "simple") {
      props.onChange(cache2.simple);
    } else {
      props.onChange(cache2.advanced);
    }
  };
  const handleUpdate = (key, value) => {
    if (isSimpleMode()) {
      const {
        stiffness,
        damping,
        mass,
        ...rest
      } = props.spring;
      props.onChange({
        ...rest,
        [key]: value
      });
    } else {
      const {
        visualDuration,
        bounce,
        ...rest
      } = props.spring;
      props.onChange({
        ...rest,
        [key]: value
      });
    }
  };
  return _$createComponent9(Folder, {
    get title() {
      return props.label;
    },
    defaultOpen: true,
    get children() {
      var _el$ = _tmpl$17(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      _$insert9(_el$, _$createComponent9(SpringVisualization, {
        get spring() {
          return props.spring;
        },
        get isSimpleMode() {
          return isSimpleMode();
        }
      }), _el$2);
      _$insert9(_el$2, _$createComponent9(SegmentedControl, {
        options: [{
          value: "simple",
          label: "Time"
        }, {
          value: "advanced",
          label: "Physics"
        }],
        get value() {
          return mode();
        },
        onChange: handleModeChange
      }), null);
      _$insert9(_el$, (() => {
        var _c$ = _$memo6(() => !!isSimpleMode());
        return () => _c$() ? [_$createComponent9(Slider, {
          label: "Duration",
          get value() {
            return props.spring.visualDuration ?? 0.3;
          },
          onChange: (v) => handleUpdate("visualDuration", v),
          min: 0.1,
          max: 1,
          step: 0.05,
          unit: "s"
        }), _$createComponent9(Slider, {
          label: "Bounce",
          get value() {
            return props.spring.bounce ?? 0.2;
          },
          onChange: (v) => handleUpdate("bounce", v),
          min: 0,
          max: 1,
          step: 0.05
        })] : [_$createComponent9(Slider, {
          label: "Stiffness",
          get value() {
            return props.spring.stiffness ?? 400;
          },
          onChange: (v) => handleUpdate("stiffness", v),
          min: 1,
          max: 1e3,
          step: 10
        }), _$createComponent9(Slider, {
          label: "Damping",
          get value() {
            return props.spring.damping ?? 17;
          },
          onChange: (v) => handleUpdate("damping", v),
          min: 1,
          max: 100,
          step: 1
        }), _$createComponent9(Slider, {
          label: "Mass",
          get value() {
            return props.spring.mass ?? 1;
          },
          onChange: (v) => handleUpdate("mass", v),
          min: 0.1,
          max: 10,
          step: 0.1
        })];
      })(), null);
      return _el$;
    }
  });
}

// src/solid/components/TransitionControl.tsx
import { template as _$template11 } from "solid-js/web";
import { delegateEvents as _$delegateEvents7 } from "solid-js/web";
import { setAttribute as _$setAttribute7 } from "solid-js/web";
import { effect as _$effect10 } from "solid-js/web";
import { insert as _$insert10 } from "solid-js/web";
import { createComponent as _$createComponent10 } from "solid-js/web";
import { memo as _$memo7 } from "solid-js/web";
import { createSignal as createSignal12, Show as Show8 } from "solid-js";

// src/solid/primitives.ts
import { createEffect as createEffect8, createSignal as createSignal11, from, onCleanup as onCleanup9 } from "solid-js";
import { isServer as isServer2 } from "solid-js/web";
function fromStore(read, subscribe) {
  if (isServer2) return read;
  const value = from((set) => {
    set(() => read());
    return subscribe(() => set(() => read()));
  });
  return value;
}

// src/solid/components/EasingVisualization.tsx
import { template as _$template10 } from "solid-js/web";
import { setAttribute as _$setAttribute6 } from "solid-js/web";
import { effect as _$effect9 } from "solid-js/web";
var _tmpl$18 = /* @__PURE__ */ _$template10(`<svg viewBox="0 0 200 200"preserveAspectRatio="xMidYMid slice"class="dialkit-spring-viz dialkit-easing-viz"><line stroke="rgba(255, 255, 255, 0.15)"stroke-width=1 stroke-dasharray=4,4></line><path fill=none stroke="rgba(255, 255, 255, 0.6)"stroke-width=2 stroke-linecap=round>`);
function EasingVisualization(props) {
  const size = 200;
  const pad = 10;
  const unit = (size - pad * 2) / 2;
  const toSvg = (x, y) => ({
    x: pad + (x + 0.5) * unit,
    y: pad + (1.5 - y) * unit
  });
  const start = toSvg(0, 0);
  const end = toSvg(1, 1);
  const curvePath2 = () => {
    const [x1, y1, x2, y2] = props.easing.ease;
    const first = toSvg(x1, y1);
    const second = toSvg(x2, y2);
    return `M ${start.x} ${start.y} C ${first.x} ${first.y}, ${second.x} ${second.y}, ${end.x} ${end.y}`;
  };
  return (() => {
    var _el$ = _tmpl$18(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    _$effect9((_p$) => {
      var _v$ = start.x, _v$2 = start.y, _v$3 = end.x, _v$4 = end.y, _v$5 = curvePath2();
      _v$ !== _p$.e && _$setAttribute6(_el$2, "x1", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute6(_el$2, "y1", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute6(_el$2, "x2", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute6(_el$2, "y2", _p$.o = _v$4);
      _v$5 !== _p$.i && _$setAttribute6(_el$3, "d", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })();
}

// src/solid/components/TransitionControl.tsx
var _tmpl$19 = /* @__PURE__ */ _$template11(`<div class=dialkit-labeled-control><span class=dialkit-labeled-control-label>Ease</span><input type=text class=dialkit-text-input>`);
var _tmpl$29 = /* @__PURE__ */ _$template11(`<div style=display:flex;flex-direction:column;gap:6px><div class=dialkit-labeled-control><span class=dialkit-labeled-control-label>Type`);
function TransitionControl(props) {
  const mode = fromStore(() => DialStore.getTransitionMode(props.panelId, props.path), (notify2) => DialStore.subscribe(props.panelId, notify2));
  const [editingEase, setEditingEase] = createSignal12(false);
  const [easeDraft, setEaseDraft] = createSignal12("");
  const cache2 = {
    easing: props.value.type === "easing" ? props.value : {
      type: "easing",
      duration: 0.3,
      ease: [1, -0.4, 0.5, 1]
    },
    simple: props.value.type === "spring" && props.value.visualDuration !== void 0 ? props.value : {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.2
    },
    advanced: props.value.type === "spring" && props.value.stiffness !== void 0 ? props.value : {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 1
    }
  };
  const isEasing = () => mode() === "easing";
  const isSimple = () => mode() === "simple";
  const spring = () => {
    if (props.value.type === "spring") {
      if (isSimple()) cache2.simple = props.value;
      else if (mode() === "advanced") cache2.advanced = props.value;
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
  const handleModeChange = (next) => {
    DialStore.updateTransitionMode(props.panelId, props.path, next);
    props.onChange(next === "easing" ? cache2.easing : next === "simple" ? cache2.simple : cache2.advanced);
  };
  const handleSpringUpdate = (key, value) => {
    const current = spring();
    if (isSimple()) {
      const {
        stiffness,
        damping,
        mass,
        ...rest
      } = current;
      props.onChange({
        ...rest,
        [key]: value
      });
    } else {
      const {
        visualDuration,
        bounce,
        ...rest
      } = current;
      props.onChange({
        ...rest,
        [key]: value
      });
    }
  };
  const updateEase = (index, value) => {
    const current = easing();
    const next = [...current.ease];
    next[index] = value;
    props.onChange({
      ...current,
      ease: next
    });
  };
  const formatEase = (value) => value.map((part) => Number(part.toFixed(2))).join(", ");
  const commitEase = () => {
    const parts = easeDraft().split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      props.onChange({
        ...easing(),
        ease: parts
      });
    }
    setEditingEase(false);
  };
  const durationSlider = () => {
    if (props.hideDuration || !isEasing() && !isSimple()) return null;
    const external = props.durationControl;
    return _$createComponent10(Slider, {
      label: "Duration",
      get value() {
        return external?.value ?? (isEasing() ? easing().duration : spring().visualDuration ?? 0.3);
      },
      get onChange() {
        return external?.onChange ?? ((value) => {
          if (isEasing()) props.onChange({
            ...easing(),
            duration: value
          });
          else handleSpringUpdate("visualDuration", value);
        });
      },
      get min() {
        return external?.min ?? 0.1;
      },
      get max() {
        return external?.max ?? (isEasing() ? 2 : 1);
      },
      get step() {
        return external?.step ?? 0.05;
      },
      unit: "s"
    });
  };
  return _$createComponent10(Folder, {
    get title() {
      return props.label;
    },
    defaultOpen: true,
    get children() {
      var _el$ = _tmpl$29(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      _$insert10(_el$, _$createComponent10(Show8, {
        get when() {
          return isEasing();
        },
        get fallback() {
          return _$createComponent10(SpringVisualization, {
            get spring() {
              return spring();
            },
            get isSimpleMode() {
              return isSimple();
            }
          });
        },
        get children() {
          return _$createComponent10(EasingVisualization, {
            get easing() {
              return easing();
            }
          });
        }
      }), _el$2);
      _$insert10(_el$2, _$createComponent10(SegmentedControl, {
        options: [{
          value: "easing",
          label: "Easing"
        }, {
          value: "simple",
          label: "Time"
        }, {
          value: "advanced",
          label: "Physics"
        }],
        get value() {
          return mode();
        },
        onChange: handleModeChange
      }), null);
      _$insert10(_el$, _$createComponent10(Show8, {
        get when() {
          return isEasing();
        },
        get children() {
          return [_$createComponent10(Slider, {
            label: "x1",
            get value() {
              return easing().ease[0];
            },
            onChange: (value) => updateEase(0, value),
            min: 0,
            max: 1,
            step: 0.01
          }), _$createComponent10(Slider, {
            label: "y1",
            get value() {
              return easing().ease[1];
            },
            onChange: (value) => updateEase(1, value),
            min: -1,
            max: 2,
            step: 0.01
          }), _$createComponent10(Slider, {
            label: "x2",
            get value() {
              return easing().ease[2];
            },
            onChange: (value) => updateEase(2, value),
            min: 0,
            max: 1,
            step: 0.01
          }), _$createComponent10(Slider, {
            label: "y2",
            get value() {
              return easing().ease[3];
            },
            onChange: (value) => updateEase(3, value),
            min: -1,
            max: 2,
            step: 0.01
          }), (() => {
            var _el$4 = _tmpl$19(), _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling;
            _el$6.$$keydown = (event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            };
            _el$6.addEventListener("blur", commitEase);
            _el$6.addEventListener("focus", () => {
              setEaseDraft(formatEase(easing().ease));
              setEditingEase(true);
            });
            _el$6.$$input = (event) => setEaseDraft(event.currentTarget.value);
            _$setAttribute7(_el$6, "spellcheck", false);
            _$effect10(() => _el$6.value = editingEase() ? easeDraft() : formatEase(easing().ease));
            return _el$4;
          })()];
        }
      }), null);
      _$insert10(_el$, _$createComponent10(Show8, {
        get when() {
          return isSimple();
        },
        get children() {
          return _$createComponent10(Slider, {
            label: "Bounce",
            get value() {
              return spring().bounce ?? 0.2;
            },
            onChange: (value) => handleSpringUpdate("bounce", value),
            min: 0,
            max: 1,
            step: 0.05
          });
        }
      }), null);
      _$insert10(_el$, _$createComponent10(Show8, {
        get when() {
          return _$memo7(() => !!!isEasing())() && !isSimple();
        },
        get children() {
          return [_$createComponent10(Slider, {
            label: "Stiffness",
            get value() {
              return spring().stiffness ?? 400;
            },
            onChange: (value) => handleSpringUpdate("stiffness", value),
            min: 1,
            max: 1e3,
            step: 10
          }), _$createComponent10(Slider, {
            label: "Damping",
            get value() {
              return spring().damping ?? 17;
            },
            onChange: (value) => handleSpringUpdate("damping", value),
            min: 1,
            max: 100,
            step: 1
          }), _$createComponent10(Slider, {
            label: "Mass",
            get value() {
              return spring().mass ?? 1;
            },
            onChange: (value) => handleSpringUpdate("mass", value),
            min: 0.1,
            max: 10,
            step: 0.1
          })];
        }
      }), null);
      _$insert10(_el$, durationSlider, null);
      return _el$;
    }
  });
}
_$delegateEvents7(["input", "keydown"]);

// src/solid/components/TextControl.tsx
import { template as _$template12 } from "solid-js/web";
import { delegateEvents as _$delegateEvents8 } from "solid-js/web";
import { effect as _$effect11 } from "solid-js/web";
import { insert as _$insert11 } from "solid-js/web";
import { setAttribute as _$setAttribute8 } from "solid-js/web";
import { createUniqueId as createUniqueId3 } from "solid-js";
var _tmpl$20 = /* @__PURE__ */ _$template12(`<div class=dialkit-text-control><label class=dialkit-text-label></label><input type=text class=dialkit-text-input>`);
function TextControl(props) {
  const inputId = createUniqueId3();
  return (() => {
    var _el$ = _tmpl$20(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    _$setAttribute8(_el$2, "for", inputId);
    _$insert11(_el$2, () => props.label);
    _el$3.$$input = (e) => props.onChange(e.currentTarget.value);
    _$setAttribute8(_el$3, "id", inputId);
    _$effect11(() => _$setAttribute8(_el$3, "placeholder", props.placeholder));
    _$effect11(() => _el$3.value = props.value);
    return _el$;
  })();
}
_$delegateEvents8(["input"]);

// src/solid/components/SelectControl.tsx
import { template as _$template13 } from "solid-js/web";
import { delegateEvents as _$delegateEvents9 } from "solid-js/web";
import { style as _$style2 } from "solid-js/web";
import { effect as _$effect12 } from "solid-js/web";
import { createComponent as _$createComponent11 } from "solid-js/web";
import { setAttribute as _$setAttribute9 } from "solid-js/web";
import { memo as _$memo8 } from "solid-js/web";
import { insert as _$insert12 } from "solid-js/web";
import { use as _$use6 } from "solid-js/web";
import { createSignal as createSignal13, createEffect as createEffect9, onMount as onMount7, onCleanup as onCleanup10, Show as Show9, For as For2 } from "solid-js";
import { Portal as Portal2 } from "solid-js/web";
import { animate as animate4 } from "motion";
var _tmpl$21 = /* @__PURE__ */ _$template13(`<div class=dialkit-select-dropdown>`);
var _tmpl$210 = /* @__PURE__ */ _$template13(`<div class=dialkit-select-row><button class=dialkit-select-trigger><span class=dialkit-select-label></span><div class=dialkit-select-right><span class=dialkit-select-value></span><svg class=dialkit-select-chevron viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$37 = /* @__PURE__ */ _$template13(`<button class=dialkit-select-option>`);
function toTitleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
function normalizeOptions(options) {
  return options.map((opt) => typeof opt === "string" ? {
    value: opt,
    label: toTitleCase(opt)
  } : opt);
}
function SelectControl(props) {
  const [isOpen, setIsOpen] = createSignal13(false);
  const [mounted, setMounted] = createSignal13(false);
  const [pos, setPos] = createSignal13(null);
  const [portalTarget, setPortalTarget] = createSignal13(null);
  let triggerRef;
  let dropdownRef;
  let chevronRef;
  let closeAnim = null;
  let chevronAnim = null;
  const normalized = () => normalizeOptions(props.options);
  const selectedOption = () => normalized().find((o) => o.value === props.value);
  onMount7(() => {
    const root = triggerRef?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
    if (chevronRef) {
      chevronRef.style.transform = `rotate(${isOpen() ? 180 : 0}deg)`;
    }
    onCleanup10(() => {
      closeAnim?.stop();
      chevronAnim?.stop();
    });
  });
  createEffect9(() => {
    if (!chevronRef) return;
    const open = isOpen();
    chevronAnim?.stop();
    chevronAnim = animate4(chevronRef, {
      rotate: open ? 180 : 0
    }, {
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.15
    });
  });
  const updatePos = () => {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const dropdownHeight = 8 + normalized().length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      above
    });
  };
  const openDropdown = () => {
    closeAnim?.stop();
    closeAnim = null;
    updatePos();
    setMounted(true);
    setIsOpen(true);
  };
  const closeDropdown = () => {
    setIsOpen(false);
    if (!dropdownRef) {
      setMounted(false);
      return;
    }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = animate4(dropdownRef, {
      opacity: 0,
      y: above ? 8 : -8,
      scale: 0.95
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
      }
    });
  };
  createEffect9(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();
    const handleClick = (e) => {
      const target = e.target;
      if (triggerRef && !triggerRef.contains(target) && dropdownRef && !dropdownRef.contains(target)) {
        closeDropdown();
      }
    };
    updatePos();
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    onCleanup10(() => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const dropdownStyle = () => {
    const p = pos();
    if (!p) return {};
    return {
      position: "fixed",
      left: `${p.left}px`,
      width: `${p.width}px`,
      ...p.above ? {
        bottom: `${window.innerHeight - p.top}px`,
        "transform-origin": "bottom"
      } : {
        top: `${p.top}px`,
        "transform-origin": "top"
      }
    };
  };
  return (() => {
    var _el$ = _tmpl$210(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.firstChild;
    _el$2.$$click = () => isOpen() ? closeDropdown() : openDropdown();
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? _$use6(_ref$, _el$2) : triggerRef = _el$2;
    _$insert12(_el$3, () => props.label);
    _$insert12(_el$5, () => selectedOption()?.label ?? props.value);
    var _ref$2 = chevronRef;
    typeof _ref$2 === "function" ? _$use6(_ref$2, _el$6) : chevronRef = _el$6;
    _$setAttribute9(_el$7, "d", ICON_CHEVRON);
    _$insert12(_el$, _$createComponent11(Show9, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return _$createComponent11(Portal2, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return _$createComponent11(Show9, {
              get when() {
                return _$memo8(() => !!mounted())() && pos();
              },
              get children() {
                var _el$8 = _tmpl$21();
                _$use6((el) => {
                  dropdownRef = el;
                  const above = pos()?.above ?? false;
                  animate4(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$8);
                _$insert12(_el$8, _$createComponent11(For2, {
                  get each() {
                    return normalized();
                  },
                  children: (option) => (() => {
                    var _el$9 = _tmpl$37();
                    _el$9.$$click = () => {
                      props.onChange(option.value);
                      closeDropdown();
                    };
                    _$insert12(_el$9, () => option.label);
                    _$effect12(() => _$setAttribute9(_el$9, "data-selected", String(option.value === props.value)));
                    return _el$9;
                  })()
                }));
                _$effect12((_$p) => _$style2(_el$8, dropdownStyle(), _$p));
                return _el$8;
              }
            });
          }
        });
      }
    }), null);
    _$effect12(() => _$setAttribute9(_el$2, "data-open", String(isOpen())));
    return _el$;
  })();
}
_$delegateEvents9(["click"]);

// src/solid/components/ColorControl.tsx
import { template as _$template15 } from "solid-js/web";
import { delegateEvents as _$delegateEvents11 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty6 } from "solid-js/web";
import { style as _$style4 } from "solid-js/web";
import { memo as _$memo10 } from "solid-js/web";
import { createComponent as _$createComponent13 } from "solid-js/web";
import { setAttribute as _$setAttribute11 } from "solid-js/web";
import { effect as _$effect14 } from "solid-js/web";
import { use as _$use8 } from "solid-js/web";
import { insert as _$insert14 } from "solid-js/web";
import { createSignal as createSignal15, createEffect as createEffect11, onMount as onMount8, onCleanup as onCleanup12, Show as Show11 } from "solid-js";
import { Portal as Portal3 } from "solid-js/web";
import { animate as animate5 } from "motion";

// src/solid/components/ColorPickerPanel.tsx
import { template as _$template14 } from "solid-js/web";
import { delegateEvents as _$delegateEvents10 } from "solid-js/web";
import { memo as _$memo9 } from "solid-js/web";
import { createComponent as _$createComponent12 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty5 } from "solid-js/web";
import { addEventListener as _$addEventListener2 } from "solid-js/web";
import { use as _$use7 } from "solid-js/web";
import { style as _$style3 } from "solid-js/web";
import { setAttribute as _$setAttribute10 } from "solid-js/web";
import { insert as _$insert13 } from "solid-js/web";
import { effect as _$effect13 } from "solid-js/web";
import { createSignal as createSignal14, createEffect as createEffect10, onCleanup as onCleanup11, Show as Show10, For as For3 } from "solid-js";

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

// src/solid/components/ColorPickerPanel.tsx
var _tmpl$30 = /* @__PURE__ */ _$template14(`<label class=dialkit-color-field><input type=text inputmode=decimal><span class=dialkit-color-field-label>`);
var _tmpl$211 = /* @__PURE__ */ _$template14(`<label class="dialkit-color-field dialkit-color-field-hex"><input type=text><span class=dialkit-color-field-label>HEX`);
var _tmpl$38 = /* @__PURE__ */ _$template14(`<button class=dialkit-color-palette-slot>`);
var _tmpl$44 = /* @__PURE__ */ _$template14(`<div class="dialkit-color-slider dialkit-color-alpha dialkit-checker"><div class=dialkit-color-alpha-gradient></div><div class=dialkit-color-slider-thumb>`);
var _tmpl$52 = /* @__PURE__ */ _$template14(`<div class=dialkit-color-palette>`);
var _tmpl$62 = /* @__PURE__ */ _$template14(`<div class=dialkit-color-picker><div class=dialkit-color-sv><div class=dialkit-color-sv-thumb></div></div><div class="dialkit-color-slider dialkit-color-hue"><div class=dialkit-color-slider-thumb></div></div><div class=dialkit-color-fields>`);
var FORMAT_OPTIONS = [{
  value: "hex",
  label: "HEX"
}, {
  value: "rgb",
  label: "RGB"
}, {
  value: "hsl",
  label: "HSL"
}, {
  value: "oklch",
  label: "OKLCH"
}];
var stickyFormat = "hex";
var BLACK = {
  h: 0,
  s: 0,
  v: 0,
  a: 1
};
function createAreaDrag(onPoint) {
  let el;
  let dragging = false;
  const readPoint = (e) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    onPoint(x, y);
  };
  return {
    ref: (node) => {
      el = node;
    },
    onPointerDown: (e) => {
      e.preventDefault();
      el?.setPointerCapture(e.pointerId);
      dragging = true;
      readPoint(e);
    },
    onPointerMove: (e) => {
      if (dragging && e.buttons === 0) {
        dragging = false;
        return;
      }
      if (dragging) readPoint(e);
    },
    onPointerUp: () => {
      dragging = false;
    },
    onPointerCancel: () => {
      dragging = false;
    }
  };
}
function ChannelField(props) {
  const [draft, setDraft] = createSignal14(null);
  const display = () => draft() ?? String(props.value);
  const commit = () => {
    const d = draft();
    if (d !== null) props.onCommit(Number(d));
    setDraft(null);
  };
  return (() => {
    var _el$ = _tmpl$30(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    _el$2.$$keydown = (e) => {
      if (e.key === "Enter") {
        commit();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        e.stopPropagation();
        setDraft(null);
        e.currentTarget.blur();
      }
    };
    _el$2.addEventListener("blur", commit);
    _el$2.$$input = (e) => setDraft(e.currentTarget.value);
    _el$2.addEventListener("focus", (e) => {
      setDraft(String(props.value));
      e.currentTarget.select();
    });
    _$insert13(_el$3, () => props.spec.label);
    _$effect13(() => _el$2.value = display());
    return _el$;
  })();
}
function HexField(props) {
  const [draft, setDraft] = createSignal14(null);
  const commit = () => {
    const d = draft();
    if (d !== null) {
      const normalized = normalizeHex(d, props.alpha);
      if (normalized) props.onCommit(normalized);
    }
    setDraft(null);
  };
  return (() => {
    var _el$4 = _tmpl$211(), _el$5 = _el$4.firstChild;
    _el$5.$$keydown = (e) => {
      if (e.key === "Enter") {
        commit();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        e.stopPropagation();
        setDraft(null);
        e.currentTarget.blur();
      }
    };
    _el$5.addEventListener("blur", commit);
    _el$5.$$input = (e) => setDraft(e.currentTarget.value);
    _el$5.addEventListener("focus", (e) => {
      setDraft(props.value);
      e.currentTarget.select();
    });
    _$setAttribute10(_el$5, "spellcheck", false);
    _$effect13(() => _el$5.value = (draft() ?? props.value).toUpperCase());
    return _el$4;
  })();
}
function PaletteSlot(props) {
  const [holding, setHolding] = createSignal14(false);
  let timer = null;
  let origin = null;
  let fired = false;
  const cancelHold = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    origin = null;
    setHolding(false);
  };
  onCleanup11(cancelHold);
  return (() => {
    var _el$6 = _tmpl$38();
    _el$6.$$click = () => {
      if (fired) {
        fired = false;
        return;
      }
      if (props.color) props.onApply();
      else props.onSave();
    };
    _el$6.addEventListener("pointercancel", cancelHold);
    _el$6.addEventListener("pointerleave", cancelHold);
    _el$6.$$pointerup = cancelHold;
    _el$6.$$pointermove = (e) => {
      if (!origin) return;
      if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > PALETTE_DRAG_CANCEL_PX) {
        cancelHold();
      }
    };
    _el$6.$$pointerdown = (e) => {
      fired = false;
      if (!props.color) return;
      origin = {
        x: e.clientX,
        y: e.clientY
      };
      setHolding(true);
      timer = setTimeout(() => {
        fired = true;
        cancelHold();
        props.onClear();
      }, LONG_PRESS_MS);
    };
    _el$6.$$contextmenu = (e) => e.preventDefault();
    _$effect13((_p$) => {
      var _v$ = String(props.color !== null), _v$2 = String(holding()), _v$3 = props.color ? {
        "--swatch-color": props.color
      } : void 0, _v$4 = props.color ? `${props.color.toUpperCase()} \u2014 click to apply, hold to clear` : "Save current color";
      _v$ !== _p$.e && _$setAttribute10(_el$6, "data-filled", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute10(_el$6, "data-holding", _p$.t = _v$2);
      _p$.a = _$style3(_el$6, _v$3, _p$.a);
      _v$4 !== _p$.o && _$setAttribute10(_el$6, "title", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$6;
  })();
}
function ColorPickerPanel(props) {
  const alpha = () => props.alpha ?? false;
  const palette = () => props.palette ?? false;
  const initialRgba = parseHex(props.value);
  const [hsva, setHsva] = createSignal14(initialRgba ? rgbToHsv(initialRgba) : BLACK);
  const [format, setFormat] = createSignal14(stickyFormat);
  const [slots, setSlots] = createSignal14(props.palette ? loadPalette() : emptyPalette());
  let lastEmitted = props.value;
  createEffect10(() => {
    const value = props.value;
    if (value === lastEmitted) return;
    lastEmitted = value;
    const rgba2 = parseHex(value);
    if (rgba2) setHsva(rgbToHsv(rgba2));
  });
  createEffect10(() => {
    if (!palette()) return;
    onCleanup11(subscribePalette((s) => setSlots(s)));
  });
  const emit = (next) => {
    setHsva(next);
    const hex = formatHex(hsvToRgb(next), alpha());
    lastEmitted = hex;
    props.onChange(hex);
  };
  const applyHex = (hex) => {
    const rgba2 = parseHex(hex);
    if (!rgba2) return;
    const normalized = formatHex(rgba2, alpha());
    setHsva(rgbToHsv(rgba2));
    lastEmitted = normalized;
    props.onChange(normalized);
  };
  const svDrag = createAreaDrag((x, y) => emit({
    ...hsva(),
    s: x,
    v: 1 - y
  }));
  const hueDrag = createAreaDrag((x) => emit({
    ...hsva(),
    h: Math.min(x * 360, 359.999)
  }));
  const alphaDrag = createAreaDrag((x) => emit({
    ...hsva(),
    a: x
  }));
  const rgba = () => hsvToRgb(hsva());
  const opaqueHex = () => formatHex(rgba(), false);
  const currentHex = () => formatHex(rgba(), alpha());
  const channelSpecs = () => format() === "hex" ? [] : getChannels(format(), alpha());
  const channelValues = () => format() === "hex" ? [] : rgbaToChannels(rgba(), format(), alpha());
  const commitChannel = (index, n) => {
    const next = [...channelValues()];
    next[index] = n;
    const committed = channelsToRgba(next, format(), alpha());
    const nextHsva = rgbToHsv(committed);
    if (nextHsva.s === 0) nextHsva.h = hsva().h;
    if (nextHsva.v === 0) nextHsva.s = hsva().s;
    emit(nextHsva);
  };
  return (() => {
    var _el$7 = _tmpl$62(), _el$8 = _el$7.firstChild, _el$9 = _el$8.firstChild, _el$0 = _el$8.nextSibling, _el$1 = _el$0.firstChild, _el$13 = _el$0.nextSibling;
    _$addEventListener2(_el$8, "pointercancel", svDrag.onPointerCancel);
    _$addEventListener2(_el$8, "pointerup", svDrag.onPointerUp, true);
    _$addEventListener2(_el$8, "pointermove", svDrag.onPointerMove, true);
    _$addEventListener2(_el$8, "pointerdown", svDrag.onPointerDown, true);
    var _ref$ = svDrag.ref;
    typeof _ref$ === "function" ? _$use7(_ref$, _el$8) : svDrag.ref = _el$8;
    _$addEventListener2(_el$0, "pointercancel", hueDrag.onPointerCancel);
    _$addEventListener2(_el$0, "pointerup", hueDrag.onPointerUp, true);
    _$addEventListener2(_el$0, "pointermove", hueDrag.onPointerMove, true);
    _$addEventListener2(_el$0, "pointerdown", hueDrag.onPointerDown, true);
    var _ref$2 = hueDrag.ref;
    typeof _ref$2 === "function" ? _$use7(_ref$2, _el$0) : hueDrag.ref = _el$0;
    _$insert13(_el$7, _$createComponent12(Show10, {
      get when() {
        return alpha();
      },
      get children() {
        var _el$10 = _tmpl$44(), _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling;
        _$addEventListener2(_el$10, "pointercancel", alphaDrag.onPointerCancel);
        _$addEventListener2(_el$10, "pointerup", alphaDrag.onPointerUp, true);
        _$addEventListener2(_el$10, "pointermove", alphaDrag.onPointerMove, true);
        _$addEventListener2(_el$10, "pointerdown", alphaDrag.onPointerDown, true);
        var _ref$3 = alphaDrag.ref;
        typeof _ref$3 === "function" ? _$use7(_ref$3, _el$10) : alphaDrag.ref = _el$10;
        _$effect13((_p$) => {
          var _v$5 = `linear-gradient(to right, transparent, ${opaqueHex()})`, _v$6 = `${hsva().a * 100}%`, _v$7 = opaqueHex(), _v$8 = Math.max(hsva().a, 0.15);
          _v$5 !== _p$.e && _$setStyleProperty5(_el$11, "background", _p$.e = _v$5);
          _v$6 !== _p$.t && _$setStyleProperty5(_el$12, "left", _p$.t = _v$6);
          _v$7 !== _p$.a && _$setStyleProperty5(_el$12, "background", _p$.a = _v$7);
          _v$8 !== _p$.o && _$setStyleProperty5(_el$12, "opacity", _p$.o = _v$8);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$10;
      }
    }), _el$13);
    _$insert13(_el$7, _$createComponent12(SegmentedControl, {
      options: FORMAT_OPTIONS,
      get value() {
        return format();
      },
      onChange: (f) => {
        stickyFormat = f;
        setFormat(f);
      }
    }), _el$13);
    _$insert13(_el$13, _$createComponent12(Show10, {
      get when() {
        return format() === "hex";
      },
      get fallback() {
        return _$createComponent12(For3, {
          get each() {
            return channelSpecs();
          },
          children: (spec, i) => _$createComponent12(ChannelField, {
            spec,
            get value() {
              return channelValues()[i()];
            },
            onCommit: (n) => commitChannel(i(), n)
          })
        });
      },
      get children() {
        return [_$createComponent12(HexField, {
          get value() {
            return currentHex();
          },
          get alpha() {
            return alpha();
          },
          onCommit: applyHex
        }), _$createComponent12(Show10, {
          get when() {
            return alpha();
          },
          get children() {
            return _$createComponent12(ChannelField, {
              spec: {
                key: "a",
                label: "A",
                min: 0,
                max: 100,
                step: 1,
                precision: 0
              },
              get value() {
                return opacityPercent(rgba());
              },
              onCommit: (n) => emit({
                ...hsva(),
                a: Math.min(1, Math.max(0, n / 100))
              })
            });
          }
        })];
      }
    }));
    _$insert13(_el$7, _$createComponent12(Show10, {
      get when() {
        return palette();
      },
      get children() {
        var _el$14 = _tmpl$52();
        _$insert13(_el$14, _$createComponent12(For3, {
          get each() {
            return Array.from({
              length: PALETTE_SIZE
            }, (_, i) => i);
          },
          children: (i) => _$createComponent12(PaletteSlot, {
            get color() {
              return slots()[i] ?? null;
            },
            onSave: () => savePalette(loadPalette().map((s, j) => j === i ? currentHex() : s)),
            onApply: () => {
              const saved = slots()[i];
              if (saved) applyHex(saved);
            },
            onClear: () => savePalette(loadPalette().map((s, j) => j === i ? null : s))
          })
        }));
        return _el$14;
      }
    }), null);
    _$effect13((_p$) => {
      var _v$9 = String(hsva().h), _v$0 = `${hsva().s * 100}%`, _v$1 = `${(1 - hsva().v) * 100}%`, _v$10 = opaqueHex(), _v$11 = `${hsva().h / 360 * 100}%`, _v$12 = `hsl(${hsva().h} 100% 50%)`, _v$13 = format();
      _v$9 !== _p$.e && _$setStyleProperty5(_el$7, "--picker-hue", _p$.e = _v$9);
      _v$0 !== _p$.t && _$setStyleProperty5(_el$9, "left", _p$.t = _v$0);
      _v$1 !== _p$.a && _$setStyleProperty5(_el$9, "top", _p$.a = _v$1);
      _v$10 !== _p$.o && _$setStyleProperty5(_el$9, "background", _p$.o = _v$10);
      _v$11 !== _p$.i && _$setStyleProperty5(_el$1, "left", _p$.i = _v$11);
      _v$12 !== _p$.n && _$setStyleProperty5(_el$1, "background", _p$.n = _v$12);
      _v$13 !== _p$.s && _$setAttribute10(_el$13, "data-format", _p$.s = _v$13);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    });
    return _el$7;
  })();
}
_$delegateEvents10(["input", "keydown", "contextmenu", "pointerdown", "pointermove", "pointerup", "click"]);

// src/solid/components/ColorControl.tsx
var _tmpl$31 = /* @__PURE__ */ _$template15(`<input type=text class=dialkit-color-hex-input>`);
var _tmpl$212 = /* @__PURE__ */ _$template15(`<div class=dialkit-color-picker-popover>`);
var _tmpl$39 = /* @__PURE__ */ _$template15(`<div class=dialkit-color-control><span class=dialkit-color-label></span><div class=dialkit-color-inputs><span class=dialkit-color-hex-wrap><span class=dialkit-color-hash aria-hidden=true>#</span></span><button class=dialkit-color-swatch title="Pick color">`);
var _tmpl$45 = /* @__PURE__ */ _$template15(`<span class=dialkit-color-hex>`);
var _tmpl$53 = /* @__PURE__ */ _$template15(`<span class=dialkit-color-divider aria-hidden=true>`);
var _tmpl$63 = /* @__PURE__ */ _$template15(`<span class=dialkit-color-opacity> <span class=dialkit-color-opacity-unit>%`);
var PICKER_WIDTH = 240;
var PICKER_BASE_HEIGHT = 270;
var PICKER_ALPHA_HEIGHT = 22;
var PICKER_PALETTE_HEIGHT = 30;
function ColorControl(props) {
  const alpha = () => props.alpha ?? false;
  const palette = () => props.palette ?? false;
  const [isEditing, setIsEditing] = createSignal15(false);
  const [editValue, setEditValue] = createSignal15(bareHex(props.value));
  const [isOpen, setIsOpen] = createSignal15(false);
  const [mounted, setMounted] = createSignal15(false);
  const [pos, setPos] = createSignal15(null);
  const [portalTarget, setPortalTarget] = createSignal15(null);
  let swatchRef;
  let pickerRef;
  let closeAnim = null;
  const rgba = () => parseHex(props.value);
  createEffect11(() => {
    const value = props.value;
    if (!isEditing()) {
      setEditValue(bareHex(value));
    }
  });
  onMount8(() => {
    const root = swatchRef?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
    onCleanup12(() => {
      closeAnim?.stop();
    });
  });
  const updatePos = () => {
    if (!swatchRef) return;
    const rect = swatchRef.getBoundingClientRect();
    const pickerHeight = PICKER_BASE_HEIGHT + (alpha() ? PICKER_ALPHA_HEIGHT : 0) + (palette() ? PICKER_PALETTE_HEIGHT : 0);
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PICKER_WIDTH);
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left,
      above
    });
  };
  const openPopover = () => {
    closeAnim?.stop();
    closeAnim = null;
    updatePos();
    if (pickerRef) {
      animate5(pickerRef, {
        opacity: 1,
        y: 0,
        scale: 1
      }, {
        type: "spring",
        visualDuration: 0.15,
        bounce: 0
      });
    }
    setMounted(true);
    setIsOpen(true);
  };
  const closePopover = () => {
    setIsOpen(false);
    if (!pickerRef) {
      setMounted(false);
      return;
    }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = animate5(pickerRef, {
      opacity: 0,
      y: above ? 8 : -8,
      scale: 0.95
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
        pickerRef = void 0;
      }
    });
  };
  createEffect11(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();
    const handleMouseDown = (e) => {
      const target = e.target;
      if (swatchRef?.contains(target) || pickerRef?.contains(target)) return;
      closePopover();
    };
    const handleKeyDown2 = (e) => {
      if (e.key === "Escape") {
        closePopover();
        swatchRef?.focus();
      }
    };
    updatePos();
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown2);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    onCleanup12(() => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown2);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const handleTextSubmit = () => {
    setIsEditing(false);
    const normalized = normalizeHexEdit(editValue(), alpha(), rgba()?.a ?? 1);
    if (normalized) {
      props.onChange(normalized);
    } else {
      setEditValue(bareHex(props.value));
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleTextSubmit();
    else if (e.key === "Escape") {
      e.stopPropagation();
      setIsEditing(false);
      setEditValue(bareHex(props.value));
    }
  };
  const popoverStyle = () => {
    const p = pos();
    if (!p) return {};
    return {
      position: "fixed",
      left: `${p.left}px`,
      width: `${PICKER_WIDTH}px`,
      ...p.above ? {
        bottom: `${window.innerHeight - p.top}px`,
        "transform-origin": "bottom right"
      } : {
        top: `${p.top}px`,
        "transform-origin": "top right"
      }
    };
  };
  return (() => {
    var _el$ = _tmpl$39(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$7 = _el$4.nextSibling;
    _$insert14(_el$2, () => props.label);
    _el$4.$$click = () => setIsEditing(true);
    _$insert14(_el$4, _$createComponent13(Show11, {
      get when() {
        return isEditing();
      },
      get fallback() {
        return (() => {
          var _el$9 = _tmpl$45();
          _$insert14(_el$9, () => bareHex(props.value));
          _$effect14(() => _$setAttribute11(_el$9, "aria-label", `Hex color for ${props.label}`));
          return _el$9;
        })();
      },
      get children() {
        var _el$6 = _tmpl$31();
        _el$6.$$keydown = handleKeyDown;
        _el$6.addEventListener("blur", handleTextSubmit);
        _el$6.$$input = (e) => setEditValue(e.currentTarget.value);
        _$use8((el) => queueMicrotask(() => {
          el.focus();
          el.select();
        }), _el$6);
        _$effect14(() => _$setAttribute11(_el$6, "aria-label", `Hex color for ${props.label}`));
        _$effect14(() => _el$6.value = editValue());
        return _el$6;
      }
    }), null);
    _$insert14(_el$3, _$createComponent13(Show11, {
      get when() {
        return _$memo10(() => !!alpha())() && rgba();
      },
      children: (r) => [_tmpl$53(), (() => {
        var _el$1 = _tmpl$63(), _el$10 = _el$1.firstChild;
        _$insert14(_el$1, () => opacityPercent(r()), _el$10);
        return _el$1;
      })()]
    }), _el$7);
    _el$7.$$click = () => isOpen() ? closePopover() : openPopover();
    var _ref$ = swatchRef;
    typeof _ref$ === "function" ? _$use8(_ref$, _el$7) : swatchRef = _el$7;
    _$insert14(_el$, _$createComponent13(Show11, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return _$createComponent13(Portal3, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return _$createComponent13(Show11, {
              get when() {
                return _$memo10(() => !!mounted())() && pos();
              },
              get children() {
                var _el$8 = _tmpl$212();
                _$use8((el) => {
                  pickerRef = el;
                  const above = pos()?.above ?? false;
                  animate5(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$8);
                _$insert14(_el$8, _$createComponent13(ColorPickerPanel, {
                  get value() {
                    return props.value;
                  },
                  onChange: (v) => props.onChange(v),
                  get alpha() {
                    return alpha();
                  },
                  get palette() {
                    return palette();
                  }
                }));
                _$effect14((_$p) => _$style4(_el$8, popoverStyle(), _$p));
                return _el$8;
              }
            });
          }
        });
      }
    }), null);
    _$effect14((_p$) => {
      var _v$ = props.value, _v$2 = String(isOpen()), _v$3 = `Pick color for ${props.label}`, _v$4 = isOpen();
      _v$ !== _p$.e && _$setStyleProperty6(_el$7, "--swatch-color", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute11(_el$7, "data-open", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute11(_el$7, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute11(_el$7, "aria-expanded", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
_$delegateEvents11(["click", "input", "keydown"]);

// src/solid/components/GradientControl.tsx
import { template as _$template18 } from "solid-js/web";
import { delegateEvents as _$delegateEvents14 } from "solid-js/web";
import { setAttribute as _$setAttribute13 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty9 } from "solid-js/web";
import { style as _$style5 } from "solid-js/web";
import { effect as _$effect17 } from "solid-js/web";
import { createComponent as _$createComponent16 } from "solid-js/web";
import { memo as _$memo12 } from "solid-js/web";
import { use as _$use11 } from "solid-js/web";
import { insert as _$insert17 } from "solid-js/web";
import { createSignal as createSignal18, createEffect as createEffect12, onMount as onMount10, onCleanup as onCleanup15, Show as Show14 } from "solid-js";
import { Portal as Portal4 } from "solid-js/web";
import { animate as animate6 } from "motion";

// src/solid/components/GradientPanel.tsx
import { template as _$template17 } from "solid-js/web";
import { delegateEvents as _$delegateEvents13 } from "solid-js/web";
import { setAttribute as _$setAttribute12 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty8 } from "solid-js/web";
import { effect as _$effect16 } from "solid-js/web";
import { insert as _$insert16 } from "solid-js/web";
import { createComponent as _$createComponent15 } from "solid-js/web";
import { use as _$use10 } from "solid-js/web";
import { createSignal as createSignal17, For as For4, Show as Show13, onCleanup as onCleanup14 } from "solid-js";

// src/solid/components/GradientTransformPad.tsx
import { template as _$template16 } from "solid-js/web";
import { delegateEvents as _$delegateEvents12 } from "solid-js/web";
import { insert as _$insert15 } from "solid-js/web";
import { memo as _$memo11 } from "solid-js/web";
import { createComponent as _$createComponent14 } from "solid-js/web";
import { addEventListener as _$addEventListener3 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty7 } from "solid-js/web";
import { effect as _$effect15 } from "solid-js/web";
import { use as _$use9 } from "solid-js/web";
import { createSignal as createSignal16, onCleanup as onCleanup13, onMount as onMount9, Show as Show12 } from "solid-js";
var _tmpl$40 = /* @__PURE__ */ _$template16(`<div class=dialkit-gradient-pad-line>`);
var _tmpl$213 = /* @__PURE__ */ _$template16(`<button type=button class=dialkit-gradient-pad-handle data-kind=major aria-label="Gradient size and rotation">`);
var _tmpl$310 = /* @__PURE__ */ _$template16(`<button type=button class=dialkit-gradient-pad-handle data-kind=minor aria-label="Gradient squash">`);
var _tmpl$46 = /* @__PURE__ */ _$template16(`<button type=button class=dialkit-gradient-pad-handle data-kind=angle aria-label="Gradient angle">`);
var _tmpl$54 = /* @__PURE__ */ _$template16(`<button type=button class=dialkit-gradient-pad-handle data-kind=center aria-label="Gradient center">`);
var _tmpl$64 = /* @__PURE__ */ _$template16(`<div class="dialkit-gradient-pad dialkit-checker"><div class=dialkit-gradient-pad-fill>`);
var clamp5 = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var wrap360 = (deg) => (deg % 360 + 360) % 360;
var RAD = Math.PI / 180;
var vectorToAngle = (dx, dy) => wrap360(Math.atan2(dx, -dy) / RAD);
function GradientTransformPad(props) {
  let padRef;
  let drag = null;
  const [size, setSize] = createSignal16({
    w: 0,
    h: 0
  });
  onMount9(() => {
    const measure = () => setSize({
      w: padRef.clientWidth,
      h: padRef.clientHeight
    });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(padRef);
    onCleanup13(() => ro.disconnect());
  });
  const radial = () => props.value.type === "radial";
  const conic = () => props.value.type === "conic";
  const cx = () => props.value.centerX ?? 50;
  const cy = () => props.value.centerY ?? 50;
  const scale = () => props.value.scale ?? 100;
  const rotation = () => props.value.rotation ?? 0;
  const cxPx = () => cx() / 100 * size().w;
  const cyPx = () => cy() / 100 * size().h;
  const rxPx = () => scale() / 100 * size().w;
  const ryPx = () => Math.max(10, (props.value.squash ?? scale()) / 100 * size().h);
  const theta = () => rotation() * RAD;
  const pin = (x, y) => ({
    x: clamp5(x, 5, size().w - 5),
    y: clamp5(y, 5, size().h - 5)
  });
  const major = () => pin(cxPx() + Math.cos(theta()) * rxPx(), cyPx() + Math.sin(theta()) * rxPx());
  const minor = () => pin(cxPx() - Math.sin(theta()) * ryPx(), cyPx() + Math.cos(theta()) * ryPx());
  const majorLineLen = () => Math.hypot(major().x - cxPx(), major().y - cyPx());
  const majorLineAngle = () => Math.atan2(major().y - cyPx(), major().x - cxPx()) / RAD;
  const angleOx = () => conic() ? cxPx() : size().w / 2;
  const angleOy = () => conic() ? cyPx() : size().h / 2;
  const spokeR = () => Math.max(10, Math.min(size().w, size().h) / 2 - 8);
  const aTheta = () => props.value.angle * RAD;
  const angleHandle = () => pin(angleOx() + Math.sin(aTheta()) * spokeR(), angleOy() - Math.cos(aTheta()) * spokeR());
  const angleLineLen = () => Math.hypot(angleHandle().x - angleOx(), angleHandle().y - angleOy());
  const angleLineAngle = () => Math.atan2(angleHandle().y - angleOy(), angleHandle().x - angleOx()) / RAD;
  const onHandleDown = (kind) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
    }
    drag = {
      kind,
      pointerId: e.pointerId
    };
  };
  const onHandleMove = (e) => {
    if (!drag || drag.pointerId !== e.pointerId || !padRef) return;
    const kind = drag.kind;
    if (e.buttons === 0) {
      drag = null;
      return;
    }
    const rect = padRef.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (kind === "center") {
      props.onChange(setGradientCenter(props.value, px / rect.width * 100, py / rect.height * 100));
      return;
    }
    if (kind === "angle") {
      const ox = conic() ? cx() / 100 * rect.width : rect.width / 2;
      const oy = conic() ? cy() / 100 * rect.height : rect.height / 2;
      props.onChange(setGradientAngle(props.value, vectorToAngle(px - ox, py - oy)));
      return;
    }
    const dx = px - cx() / 100 * rect.width;
    const dy = py - cy() / 100 * rect.height;
    const dist = Math.hypot(dx, dy);
    const deg = Math.atan2(dy, dx) / RAD;
    if (kind === "major") {
      const nextScale = dist / rect.width * 100;
      props.onChange(setGradientScale(setGradientRotation(props.value, deg), nextScale));
      return;
    }
    const nextSquash = dist / rect.height * 100;
    props.onChange(setGradientRotation(setGradientSquash(props.value, nextSquash), deg - 90));
  };
  const onHandleUp = (e) => {
    if (drag?.pointerId === e.pointerId) drag = null;
  };
  const fill = () => gradientFillBox(props.value, size().w, size().h);
  return (() => {
    var _el$ = _tmpl$64(), _el$2 = _el$.firstChild;
    var _ref$ = padRef;
    typeof _ref$ === "function" ? _$use9(_ref$, _el$) : padRef = _el$;
    _$insert15(_el$, _$createComponent14(Show12, {
      get when() {
        return radial();
      },
      get children() {
        return [(() => {
          var _el$3 = _tmpl$40();
          _$effect15((_p$) => {
            var _v$ = `${cxPx()}px`, _v$2 = `${cyPx()}px`, _v$3 = `${majorLineLen()}px`, _v$4 = `rotate(${majorLineAngle()}deg)`;
            _v$ !== _p$.e && _$setStyleProperty7(_el$3, "left", _p$.e = _v$);
            _v$2 !== _p$.t && _$setStyleProperty7(_el$3, "top", _p$.t = _v$2);
            _v$3 !== _p$.a && _$setStyleProperty7(_el$3, "width", _p$.a = _v$3);
            _v$4 !== _p$.o && _$setStyleProperty7(_el$3, "transform", _p$.o = _v$4);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$3;
        })(), (() => {
          var _el$4 = _tmpl$213();
          _el$4.addEventListener("lostpointercapture", onHandleUp);
          _el$4.addEventListener("pointercancel", onHandleUp);
          _el$4.$$pointerup = onHandleUp;
          _el$4.$$pointermove = onHandleMove;
          _$addEventListener3(_el$4, "pointerdown", onHandleDown("major"), true);
          _$effect15((_p$) => {
            var _v$5 = `${major().x}px`, _v$6 = `${major().y}px`;
            _v$5 !== _p$.e && _$setStyleProperty7(_el$4, "left", _p$.e = _v$5);
            _v$6 !== _p$.t && _$setStyleProperty7(_el$4, "top", _p$.t = _v$6);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$4;
        })(), (() => {
          var _el$5 = _tmpl$310();
          _el$5.addEventListener("lostpointercapture", onHandleUp);
          _el$5.addEventListener("pointercancel", onHandleUp);
          _el$5.$$pointerup = onHandleUp;
          _el$5.$$pointermove = onHandleMove;
          _$addEventListener3(_el$5, "pointerdown", onHandleDown("minor"), true);
          _$effect15((_p$) => {
            var _v$7 = `${minor().x}px`, _v$8 = `${minor().y}px`;
            _v$7 !== _p$.e && _$setStyleProperty7(_el$5, "left", _p$.e = _v$7);
            _v$8 !== _p$.t && _$setStyleProperty7(_el$5, "top", _p$.t = _v$8);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$5;
        })()];
      }
    }), null);
    _$insert15(_el$, _$createComponent14(Show12, {
      get when() {
        return !radial();
      },
      get children() {
        return [(() => {
          var _el$6 = _tmpl$40();
          _$effect15((_p$) => {
            var _v$9 = `${angleOx()}px`, _v$0 = `${angleOy()}px`, _v$1 = `${angleLineLen()}px`, _v$10 = `rotate(${angleLineAngle()}deg)`;
            _v$9 !== _p$.e && _$setStyleProperty7(_el$6, "left", _p$.e = _v$9);
            _v$0 !== _p$.t && _$setStyleProperty7(_el$6, "top", _p$.t = _v$0);
            _v$1 !== _p$.a && _$setStyleProperty7(_el$6, "width", _p$.a = _v$1);
            _v$10 !== _p$.o && _$setStyleProperty7(_el$6, "transform", _p$.o = _v$10);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$6;
        })(), (() => {
          var _el$7 = _tmpl$46();
          _el$7.addEventListener("lostpointercapture", onHandleUp);
          _el$7.addEventListener("pointercancel", onHandleUp);
          _el$7.$$pointerup = onHandleUp;
          _el$7.$$pointermove = onHandleMove;
          _$addEventListener3(_el$7, "pointerdown", onHandleDown("angle"), true);
          _$effect15((_p$) => {
            var _v$11 = `${angleHandle().x}px`, _v$12 = `${angleHandle().y}px`;
            _v$11 !== _p$.e && _$setStyleProperty7(_el$7, "left", _p$.e = _v$11);
            _v$12 !== _p$.t && _$setStyleProperty7(_el$7, "top", _p$.t = _v$12);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$7;
        })()];
      }
    }), null);
    _$insert15(_el$, _$createComponent14(Show12, {
      get when() {
        return radial() || conic();
      },
      get children() {
        var _el$8 = _tmpl$54();
        _el$8.addEventListener("lostpointercapture", onHandleUp);
        _el$8.addEventListener("pointercancel", onHandleUp);
        _el$8.$$pointerup = onHandleUp;
        _el$8.$$pointermove = onHandleMove;
        _$addEventListener3(_el$8, "pointerdown", onHandleDown("center"), true);
        _$effect15((_p$) => {
          var _v$13 = `${clamp5(cxPx(), 5, size().w - 5)}px`, _v$14 = `${clamp5(cyPx(), 5, size().h - 5)}px`;
          _v$13 !== _p$.e && _$setStyleProperty7(_el$8, "left", _p$.e = _v$13);
          _v$14 !== _p$.t && _$setStyleProperty7(_el$8, "top", _p$.t = _v$14);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$8;
      }
    }), null);
    _$effect15((_p$) => {
      var _v$15 = fill().background, _v$16 = fill().transform, _v$17 = fill().transformOrigin, _v$18 = `${fill().left}px`, _v$19 = `${fill().top}px`, _v$20 = `${fill().width}px`, _v$21 = `${fill().height}px`;
      _v$15 !== _p$.e && _$setStyleProperty7(_el$2, "background", _p$.e = _v$15);
      _v$16 !== _p$.t && _$setStyleProperty7(_el$2, "transform", _p$.t = _v$16);
      _v$17 !== _p$.a && _$setStyleProperty7(_el$2, "transform-origin", _p$.a = _v$17);
      _v$18 !== _p$.o && _$setStyleProperty7(_el$2, "left", _p$.o = _v$18);
      _v$19 !== _p$.i && _$setStyleProperty7(_el$2, "top", _p$.i = _v$19);
      _v$20 !== _p$.n && _$setStyleProperty7(_el$2, "width", _p$.n = _v$20);
      _v$21 !== _p$.s && _$setStyleProperty7(_el$2, "height", _p$.s = _v$21);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    });
    return _el$;
  })();
}
_$delegateEvents12(["pointerdown", "pointermove", "pointerup"]);

// src/solid/components/GradientPanel.tsx
var _tmpl$41 = /* @__PURE__ */ _$template17(`<div class=dialkit-gradient-panel><div class=dialkit-gradient-toolbar><button type=button class=dialkit-gradient-grip aria-label="Drag to move"title="Drag to move"><svg viewBox="0 0 24 24"fill=currentColor aria-hidden=true></svg></button></div><div class=dialkit-gradient-strip></div><span class=dialkit-gradient-divider aria-hidden=true>`);
var _tmpl$214 = /* @__PURE__ */ _$template17(`<svg><circle r=1.5></svg>`, false, true, false);
var _tmpl$311 = /* @__PURE__ */ _$template17(`<button type=button class=dialkit-gradient-stop>`);
var TYPE_OPTIONS = [{
  value: "linear",
  label: "Linear"
}, {
  value: "radial",
  label: "Radial"
}, {
  value: "conic",
  label: "Conic"
}];
function rampCss(stops) {
  return gradientToCss({
    type: "linear",
    angle: 90,
    stops
  });
}
function GradientPanel(props) {
  const [selectedIndex, setSelectedIndex] = createSignal17(0);
  const [holdingIndex, setHoldingIndex] = createSignal17(-1);
  const [detach, setDetach] = createSignal17(null);
  let stripRef;
  let gripRef;
  let gripOrigin = null;
  const onGripDown = (e) => {
    e.preventDefault();
    try {
      gripRef.setPointerCapture(e.pointerId);
    } catch {
    }
    gripOrigin = {
      x: e.clientX,
      y: e.clientY
    };
  };
  const onGripMove = (e) => {
    if (!gripOrigin || e.buttons === 0) return;
    props.onDrag?.(e.clientX - gripOrigin.x, e.clientY - gripOrigin.y);
    gripOrigin = {
      x: e.clientX,
      y: e.clientY
    };
  };
  const onGripUp = () => {
    gripOrigin = null;
  };
  const drag = {
    mode: "idle",
    activeIndex: -1,
    originX: 0,
    originY: 0,
    timer: null,
    working: props.value
  };
  const safeIndex = () => Math.min(selectedIndex(), props.value.stops.length - 1);
  const stripPos = (clientX) => {
    const rect = stripRef.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const stripCenterY = () => {
    const rect = stripRef.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };
  const clearTimer = () => {
    if (drag.timer) clearTimeout(drag.timer);
    drag.timer = null;
  };
  onCleanup14(clearTimer);
  const resetDrag = () => {
    clearTimer();
    drag.mode = "idle";
    setHoldingIndex(-1);
  };
  const commitMove = (clientX) => {
    const r = moveStop(drag.working, drag.activeIndex, stripPos(clientX));
    drag.working = r.value;
    drag.activeIndex = r.index;
    setSelectedIndex(r.index);
    props.onChange(r.value);
  };
  const onPointerDown = (e) => {
    e.preventDefault();
    try {
      stripRef.setPointerCapture(e.pointerId);
    } catch {
    }
    drag.originX = e.clientX;
    drag.originY = e.clientY;
    drag.working = props.value;
    const handle = e.target.closest(".dialkit-gradient-stop");
    if (handle) {
      const index2 = Number(handle.dataset.index);
      setSelectedIndex(index2);
      drag.activeIndex = index2;
      drag.mode = "pending";
      if (props.value.stops.length > MIN_STOPS) {
        setHoldingIndex(index2);
        drag.timer = setTimeout(() => {
          drag.timer = null;
          drag.mode = "idle";
          setHoldingIndex(-1);
          const next2 = removeStop(props.value, index2);
          props.onChange(next2);
          setSelectedIndex(Math.min(index2, next2.stops.length - 1));
        }, LONG_PRESS_MS);
      }
      return;
    }
    const {
      value: next,
      index
    } = addStop(props.value, stripPos(e.clientX));
    drag.working = next;
    drag.activeIndex = index;
    drag.mode = "dragging";
    setSelectedIndex(index);
    props.onChange(next);
  };
  const onPointerMove = (e) => {
    if (drag.mode === "idle") return;
    if (e.buttons === 0) {
      setDetach(null);
      resetDrag();
      return;
    }
    if (drag.mode === "pending") {
      if (Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY) <= PALETTE_DRAG_CANCEL_PX) return;
      clearTimer();
      setHoldingIndex(-1);
      drag.mode = "dragging";
    }
    if (drag.mode === "dragging") {
      const offV = e.clientY - stripCenterY();
      if (drag.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
        drag.mode = "detached";
        setDetach({
          index: drag.activeIndex,
          y: offV
        });
        return;
      }
      commitMove(e.clientX);
      return;
    }
    if (drag.mode === "detached") {
      const offV = e.clientY - stripCenterY();
      if (Math.abs(offV) <= STOP_DETACH_PX) {
        drag.mode = "dragging";
        setDetach(null);
        commitMove(e.clientX);
      } else {
        setDetach({
          index: drag.activeIndex,
          y: offV
        });
      }
    }
  };
  const onPointerUp = () => {
    if (drag.mode === "detached") {
      const next = removeStop(drag.working, drag.activeIndex);
      props.onChange(next);
      setSelectedIndex(Math.min(drag.activeIndex, next.stops.length - 1));
    }
    setDetach(null);
    resetDrag();
  };
  const previewStops = () => {
    const d = detach();
    return d ? props.value.stops.filter((_, i) => i !== d.index) : props.value.stops;
  };
  return (() => {
    var _el$ = _tmpl$41(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$2.nextSibling, _el$6 = _el$5.nextSibling;
    _el$3.addEventListener("lostpointercapture", onGripUp);
    _el$3.addEventListener("pointercancel", onGripUp);
    _el$3.$$pointerup = onGripUp;
    _el$3.$$pointermove = onGripMove;
    _el$3.$$pointerdown = onGripDown;
    var _ref$ = gripRef;
    typeof _ref$ === "function" ? _$use10(_ref$, _el$3) : gripRef = _el$3;
    _$insert16(_el$4, _$createComponent15(For4, {
      each: ICON_GRIP,
      children: (c) => (() => {
        var _el$7 = _tmpl$214();
        _$effect16((_p$) => {
          var _v$ = c.cx, _v$2 = c.cy;
          _v$ !== _p$.e && _$setAttribute12(_el$7, "cx", _p$.e = _v$);
          _v$2 !== _p$.t && _$setAttribute12(_el$7, "cy", _p$.t = _v$2);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$7;
      })()
    }));
    _$insert16(_el$2, _$createComponent15(SegmentedControl, {
      options: TYPE_OPTIONS,
      get value() {
        return props.value.type;
      },
      onChange: (t) => props.onChange(setGradientType(props.value, t))
    }), null);
    _$insert16(_el$, _$createComponent15(GradientTransformPad, {
      get value() {
        return props.value;
      },
      get onChange() {
        return props.onChange;
      }
    }), _el$5);
    _el$5.addEventListener("pointercancel", onPointerUp);
    _el$5.$$pointerup = onPointerUp;
    _el$5.$$pointermove = onPointerMove;
    _el$5.$$pointerdown = onPointerDown;
    var _ref$2 = stripRef;
    typeof _ref$2 === "function" ? _$use10(_ref$2, _el$5) : stripRef = _el$5;
    _$insert16(_el$5, _$createComponent15(For4, {
      get each() {
        return props.value.stops;
      },
      children: (stop, i) => {
        const detaching = () => detach()?.index === i();
        return (() => {
          var _el$8 = _tmpl$311();
          _$effect16((_p$) => {
            var _v$3 = i(), _v$4 = String(i() === safeIndex()), _v$5 = String(i() === holdingIndex()), _v$6 = String(detaching()), _v$7 = `${stop.position * 100}%`, _v$8 = i() === safeIndex() ? 99 : i() + 1, _v$9 = stop.color, _v$0 = detaching() ? `${detach().y}px` : "0px", _v$1 = `Gradient stop ${i() + 1}`;
            _v$3 !== _p$.e && _$setAttribute12(_el$8, "data-index", _p$.e = _v$3);
            _v$4 !== _p$.t && _$setAttribute12(_el$8, "data-selected", _p$.t = _v$4);
            _v$5 !== _p$.a && _$setAttribute12(_el$8, "data-holding", _p$.a = _v$5);
            _v$6 !== _p$.o && _$setAttribute12(_el$8, "data-detaching", _p$.o = _v$6);
            _v$7 !== _p$.i && _$setStyleProperty8(_el$8, "left", _p$.i = _v$7);
            _v$8 !== _p$.n && _$setStyleProperty8(_el$8, "z-index", _p$.n = _v$8);
            _v$9 !== _p$.s && _$setStyleProperty8(_el$8, "--swatch-color", _p$.s = _v$9);
            _v$0 !== _p$.h && _$setStyleProperty8(_el$8, "--detach-y", _p$.h = _v$0);
            _v$1 !== _p$.r && _$setAttribute12(_el$8, "aria-label", _p$.r = _v$1);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0,
            h: void 0,
            r: void 0
          });
          return _el$8;
        })();
      }
    }));
    _$insert16(_el$, _$createComponent15(Show13, {
      get when() {
        return safeIndex() + 1;
      },
      keyed: true,
      children: (keyed) => {
        const index = keyed - 1;
        return _$createComponent15(ColorPickerPanel, {
          get value() {
            return props.value.stops[index].color;
          },
          alpha: true,
          palette: false,
          onChange: (hex) => props.onChange(setStopColor(props.value, index, hex))
        });
      }
    }), null);
    _$effect16((_$p) => _$setStyleProperty8(_el$5, "--gradient-ramp", rampCss(previewStops())));
    return _el$;
  })();
}
_$delegateEvents13(["pointerdown", "pointermove", "pointerup"]);

// src/solid/components/GradientControl.tsx
var _tmpl$47 = /* @__PURE__ */ _$template18(`<div class=dialkit-gradient-popover>`);
var _tmpl$215 = /* @__PURE__ */ _$template18(`<div class=dialkit-gradient-control><span class=dialkit-gradient-label></span><button class="dialkit-gradient-preview dialkit-checker"title="Edit gradient">`);
var PANEL_WIDTH = 240;
var PANEL_HEIGHT_ANGLED = 470;
var PANEL_HEIGHT_RADIAL = 430;
function GradientControl(props) {
  const [isOpen, setIsOpen] = createSignal18(false);
  const [mounted, setMounted] = createSignal18(false);
  const [pos, setPos] = createSignal18(null);
  const [dragPos, setDragPos] = createSignal18(null);
  const [portalTarget, setPortalTarget] = createSignal18(null);
  let triggerRef;
  let panelRef;
  let closeAnim = null;
  onMount10(() => {
    const root = triggerRef?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
    onCleanup15(() => {
      closeAnim?.stop();
    });
  });
  const updatePos = () => {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const panelHeight = props.value.type === "radial" ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < panelHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PANEL_WIDTH);
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left,
      above
    });
  };
  const onPanelDrag = (dx, dy) => {
    setDragPos((prev) => {
      let base = prev;
      if (!base) {
        const p = pos();
        if (!p || !panelRef) return prev;
        base = {
          left: p.left,
          top: p.above ? p.top - panelRef.offsetHeight : p.top
        };
      }
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      return {
        left,
        top
      };
    });
  };
  const openPopover = () => {
    closeAnim?.stop();
    closeAnim = null;
    setDragPos(null);
    updatePos();
    if (panelRef) {
      animate6(panelRef, {
        opacity: 1,
        y: 0,
        scale: 1
      }, {
        type: "spring",
        visualDuration: 0.15,
        bounce: 0
      });
    }
    setMounted(true);
    setIsOpen(true);
  };
  const closePopover = () => {
    setIsOpen(false);
    if (!panelRef) {
      setMounted(false);
      return;
    }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = animate6(panelRef, {
      opacity: 0,
      y: above ? 8 : -8,
      scale: 0.95
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
        panelRef = void 0;
      }
    });
  };
  createEffect12(() => {
    if (!isOpen()) return;
    void props.value.type;
    const handleViewportChange = () => updatePos();
    const handleMouseDown = (e) => {
      const target = e.target;
      if (triggerRef?.contains(target) || panelRef?.contains(target)) return;
      closePopover();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closePopover();
        triggerRef?.focus();
      }
    };
    updatePos();
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    onCleanup15(() => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const popoverStyle = () => {
    const p = pos();
    if (!p) return {};
    const dp = dragPos();
    return {
      position: "fixed",
      width: `${PANEL_WIDTH}px`,
      ...dp ? {
        left: `${dp.left}px`,
        top: `${dp.top}px`,
        "transform-origin": "top left"
      } : p.above ? {
        left: `${p.left}px`,
        bottom: `${window.innerHeight - p.top}px`,
        "transform-origin": "bottom right"
      } : {
        left: `${p.left}px`,
        top: `${p.top}px`,
        "transform-origin": "top right"
      }
    };
  };
  return (() => {
    var _el$ = _tmpl$215(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    _$insert17(_el$2, () => props.label);
    _el$3.$$click = () => isOpen() ? closePopover() : openPopover();
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? _$use11(_ref$, _el$3) : triggerRef = _el$3;
    _$insert17(_el$, _$createComponent16(Show14, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return _$createComponent16(Portal4, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return _$createComponent16(Show14, {
              get when() {
                return _$memo12(() => !!mounted())() && pos();
              },
              get children() {
                var _el$4 = _tmpl$47();
                _$use11((el) => {
                  panelRef = el;
                  const above = pos()?.above ?? false;
                  animate6(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$4);
                _$insert17(_el$4, _$createComponent16(GradientPanel, {
                  get value() {
                    return props.value;
                  },
                  onChange: (v) => props.onChange(v),
                  onDrag: onPanelDrag
                }));
                _$effect17((_$p) => _$style5(_el$4, popoverStyle(), _$p));
                return _el$4;
              }
            });
          }
        });
      }
    }), null);
    _$effect17((_p$) => {
      var _v$ = gradientToCss(props.value), _v$2 = String(isOpen()), _v$3 = `Edit gradient for ${props.label}`, _v$4 = isOpen();
      _v$ !== _p$.e && _$setStyleProperty9(_el$3, "--gradient-preview", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute13(_el$3, "data-open", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute13(_el$3, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute13(_el$3, "aria-expanded", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
_$delegateEvents14(["click"]);

// src/solid/components/XYControl.tsx
import { createComponent as _$createComponent18 } from "solid-js/web";

// src/solid/components/XYPad.tsx
import { template as _$template19 } from "solid-js/web";
import { delegateEvents as _$delegateEvents15 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty10 } from "solid-js/web";
import { setAttribute as _$setAttribute14 } from "solid-js/web";
import { style as _$style6 } from "solid-js/web";
import { use as _$use12 } from "solid-js/web";
import { createComponent as _$createComponent17 } from "solid-js/web";
import { className as _$className5 } from "solid-js/web";
import { effect as _$effect18 } from "solid-js/web";
import { insert as _$insert18 } from "solid-js/web";
import { createSignal as createSignal19, Show as Show15 } from "solid-js";
var _tmpl$48 = /* @__PURE__ */ _$template19(`<span>`);
var _tmpl$216 = /* @__PURE__ */ _$template19(`<div class=dialkit-xy-grid aria-hidden=true>`);
var _tmpl$312 = /* @__PURE__ */ _$template19(`<div class=dialkit-xy><div class=dialkit-xy-header><span class=dialkit-xy-label></span></div><div class=dialkit-xy-area role=application aria-roledescription="2D pad"><div class="dialkit-xy-axis dialkit-xy-axis-x"aria-hidden=true></div><div class="dialkit-xy-axis dialkit-xy-axis-y"aria-hidden=true></div><div class="dialkit-xy-guide dialkit-xy-guide-v"aria-hidden=true></div><div class="dialkit-xy-guide dialkit-xy-guide-h"aria-hidden=true></div><div class=dialkit-xy-thumb aria-hidden=true>`);
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
function XYPad(props) {
  const size = () => props.size ?? 160;
  const snap = () => props.snap ?? false;
  const disabled = () => props.disabled ?? false;
  const returnToCenter = () => props.returnToCenter ?? false;
  const showValues = () => props.showValues ?? false;
  const density = () => props.density ?? 1;
  const xAxis = () => resolveAxis(props.x);
  const yAxis = () => resolveAxis(props.y);
  let areaRef;
  let dragging = false;
  const [active, setActive] = createSignal19(false);
  const [draggingState, setDraggingState] = createSignal19(false);
  const pointToValue = (clientX, clientY, fine) => {
    const el = areaRef;
    if (!el) return props.value;
    const rect = el.getBoundingClientRect();
    const xs = xAxis();
    const ys = yAxis();
    let px = (clientX - rect.left) / rect.width;
    let py = (clientY - rect.top) / rect.height;
    if (fine) {
      const cur = pointFromValue(props.value, xs, ys);
      px = cur.x + (px - cur.x) * FINE_DRAG;
      py = cur.y + (py - cur.y) * FINE_DRAG;
    }
    px = Math.min(1, Math.max(0, px));
    py = Math.min(1, Math.max(0, py));
    const next = valueFromPoint({
      x: px,
      y: py
    }, xs, ys, snap());
    const originPoint = pointFromValue({
      x: xs.origin,
      y: ys.origin
    }, xs, ys);
    const dxPx = Math.abs(px - originPoint.x) * rect.width;
    const dyPx = Math.abs(py - originPoint.y) * rect.height;
    return {
      x: applyDetentAxis(next.x, xs, dxPx),
      y: applyDetentAxis(next.y, ys, dyPx)
    };
  };
  const emit = (next) => {
    props.onChange(next);
  };
  const handlePointerDown = (e) => {
    if (disabled()) return;
    if (e.button !== 0 || !e.isPrimary) return;
    if (e.altKey) return;
    e.preventDefault();
    try {
      areaRef?.setPointerCapture(e.pointerId);
    } catch {
    }
    areaRef?.focus();
    dragging = true;
    setActive(true);
    setDraggingState(true);
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const handlePointerMove = (e) => {
    if (!dragging) return;
    if (e.buttons === 0) {
      finishDrag(e);
      return;
    }
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const finishDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    setDraggingState(false);
    try {
      areaRef?.releasePointerCapture(e.pointerId);
    } catch {
    }
    const el = areaRef;
    const stillActive = (el?.matches(":hover") ?? false) || el === (el?.ownerDocument ?? document).activeElement;
    if (!stillActive) setActive(false);
    if (returnToCenter()) emit(normalizeValue(centerValue(xAxis(), yAxis()), xAxis(), yAxis(), snap()));
  };
  const handleKeyDown = (e) => {
    if (disabled()) return;
    const mode = e.shiftKey ? "coarse" : e.altKey ? "fine" : "normal";
    const cur = props.value;
    const xs = xAxis();
    const ys = yAxis();
    const ctrl = e.ctrlKey || e.metaKey;
    let next = null;
    switch (e.key) {
      case "ArrowUp":
        next = nudge(cur, "y", 1, xs, ys, mode);
        break;
      case "ArrowDown":
        next = nudge(cur, "y", -1, xs, ys, mode);
        break;
      case "ArrowRight":
        next = nudge(cur, "x", 1, xs, ys, mode);
        break;
      case "ArrowLeft":
        next = nudge(cur, "x", -1, xs, ys, mode);
        break;
      case "PageUp":
        next = nudge(cur, "y", 1, xs, ys, "coarse");
        break;
      case "PageDown":
        next = nudge(cur, "y", -1, xs, ys, "coarse");
        break;
      case "Home":
        next = ctrl ? {
          x: xs.min,
          y: ys.min
        } : {
          x: xs.min,
          y: cur.y
        };
        break;
      case "End":
        next = ctrl ? {
          x: xs.max,
          y: ys.max
        } : {
          x: xs.max,
          y: cur.y
        };
        break;
      default:
        return;
    }
    e.preventDefault();
    emit(next);
  };
  const reset = () => {
    if (disabled()) return;
    emit(normalizeValue(centerValue(xAxis(), yAxis()), xAxis(), yAxis(), snap()));
  };
  const xLabel = () => props.x?.label ?? "X";
  const yLabel = () => props.y?.label ?? "Y";
  const xText = () => `${xLabel()} ${formatComponent(props.value.x, xAxis())}`;
  const yText = () => `${yLabel()} ${formatComponent(props.value.y, yAxis())}`;
  const xVisual = () => showValues() ? xText() : xLabel();
  const yVisual = () => showValues() ? yText() : yLabel();
  const readout = () => props.formatValue ? props.formatValue(props.value) : `${xText()}  ${yText()}`;
  const dens = () => typeof density() === "number" && density() > 0 ? density() : 1;
  const baseX = () => props.grid === false ? 0 : typeof props.grid === "number" ? props.grid : DEFAULT_GRID_X;
  const baseY = () => props.grid === false ? 0 : typeof props.grid === "number" ? props.grid : DEFAULT_GRID_Y;
  const gridX = () => baseX() > 0 ? Math.round(baseX() * dens()) : 0;
  const gridY = () => baseY() > 0 ? Math.round(baseY() * dens()) : 0;
  const showGrid = () => gridX() > 0 && gridY() > 0;
  const point = () => pointFromValue(props.value, xAxis(), yAxis());
  const leftPct = () => `${point().x * 100}%`;
  const topPct = () => `${point().y * 100}%`;
  return (() => {
    var _el$ = _tmpl$312(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$5 = _el$2.nextSibling, _el$7 = _el$5.firstChild, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling;
    _$insert18(_el$3, () => props.label, null);
    _$insert18(_el$3, _$createComponent17(Show15, {
      get when() {
        return props.shortcut;
      },
      get children() {
        var _el$4 = _tmpl$48();
        _$insert18(_el$4, () => formatSliderShortcut(props.shortcut));
        _$effect18(() => _$className5(_el$4, `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`));
        return _el$4;
      }
    }), null);
    _el$5.addEventListener("pointerleave", () => {
      if (!dragging) setActive(false);
    });
    _el$5.addEventListener("pointerenter", () => setActive(true));
    _el$5.addEventListener("blur", () => setActive(false));
    _el$5.addEventListener("focus", () => setActive(true));
    _el$5.$$keydown = handleKeyDown;
    _el$5.$$click = (e) => {
      if (e.altKey) reset();
    };
    _el$5.$$dblclick = reset;
    _el$5.addEventListener("pointercancel", finishDrag);
    _el$5.$$pointerup = finishDrag;
    _el$5.$$pointermove = handlePointerMove;
    _el$5.$$pointerdown = handlePointerDown;
    var _ref$ = areaRef;
    typeof _ref$ === "function" ? _$use12(_ref$, _el$5) : areaRef = _el$5;
    _$insert18(_el$5, _$createComponent17(Show15, {
      get when() {
        return showGrid();
      },
      get children() {
        var _el$6 = _tmpl$216();
        _$effect18((_$p) => _$style6(_el$6, {
          "--dial-xy-grid-step-x": `${100 / gridX()}%`,
          "--dial-xy-grid-step-y": `${100 / gridY()}%`
        }, _$p));
        return _el$6;
      }
    }), _el$7);
    _$insert18(_el$7, xVisual);
    _$insert18(_el$8, yVisual);
    _$effect18((_p$) => {
      var _v$ = String(active()), _v$2 = String(disabled()), _v$3 = `${size()}px`, _v$4 = props.label, _v$5 = readout(), _v$6 = xAxis().min, _v$7 = xAxis().max, _v$8 = props.value.x, _v$9 = disabled() || void 0, _v$0 = disabled() ? -1 : 0, _v$1 = String(active()), _v$10 = String(draggingState()), _v$11 = String(disabled()), _v$12 = leftPct(), _v$13 = topPct(), _v$14 = leftPct(), _v$15 = topPct();
      _v$ !== _p$.e && _$setAttribute14(_el$, "data-active", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute14(_el$, "data-disabled", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setStyleProperty10(_el$5, "height", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute14(_el$5, "aria-label", _p$.o = _v$4);
      _v$5 !== _p$.i && _$setAttribute14(_el$5, "aria-valuetext", _p$.i = _v$5);
      _v$6 !== _p$.n && _$setAttribute14(_el$5, "aria-valuemin", _p$.n = _v$6);
      _v$7 !== _p$.s && _$setAttribute14(_el$5, "aria-valuemax", _p$.s = _v$7);
      _v$8 !== _p$.h && _$setAttribute14(_el$5, "aria-valuenow", _p$.h = _v$8);
      _v$9 !== _p$.r && _$setAttribute14(_el$5, "aria-disabled", _p$.r = _v$9);
      _v$0 !== _p$.d && _$setAttribute14(_el$5, "tabindex", _p$.d = _v$0);
      _v$1 !== _p$.l && _$setAttribute14(_el$5, "data-active", _p$.l = _v$1);
      _v$10 !== _p$.u && _$setAttribute14(_el$5, "data-dragging", _p$.u = _v$10);
      _v$11 !== _p$.c && _$setAttribute14(_el$5, "data-disabled", _p$.c = _v$11);
      _v$12 !== _p$.w && _$setStyleProperty10(_el$9, "left", _p$.w = _v$12);
      _v$13 !== _p$.m && _$setStyleProperty10(_el$0, "top", _p$.m = _v$13);
      _v$14 !== _p$.f && _$setStyleProperty10(_el$1, "left", _p$.f = _v$14);
      _v$15 !== _p$.y && _$setStyleProperty10(_el$1, "top", _p$.y = _v$15);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0,
      m: void 0,
      f: void 0,
      y: void 0
    });
    return _el$;
  })();
}
_$delegateEvents15(["pointerdown", "pointermove", "pointerup", "dblclick", "click", "keydown"]);

// src/solid/components/XYControl.tsx
function XYControl(props) {
  return _$createComponent18(XYPad, {
    get label() {
      return props.label;
    },
    get value() {
      return props.value;
    },
    get onChange() {
      return props.onChange;
    },
    get x() {
      return props.x;
    },
    get y() {
      return props.y;
    },
    get grid() {
      return props.grid;
    },
    get density() {
      return props.density;
    },
    get snap() {
      return props.snap;
    },
    get returnToCenter() {
      return props.returnToCenter;
    },
    get showValues() {
      return props.showValues;
    },
    get shortcut() {
      return props.shortcut;
    },
    get shortcutActive() {
      return props.shortcutActive;
    }
  });
}

// src/solid/components/ControlRenderer.tsx
var _tmpl$49 = /* @__PURE__ */ _$template20(`<button class=dialkit-button>`);
function ControlRenderer(props) {
  const shortcut = useShortcutContext();
  const hintId = (control) => hintDomId(props.panelId, control.path);
  const renderControlNode = (control) => {
    const value = () => props.values[control.path];
    const active = () => shortcut().activePanelId === props.panelId && shortcut().activePath === control.path;
    switch (control.type) {
      case "slider":
        return _$createComponent19(Slider, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next),
          get min() {
            return control.min;
          },
          get max() {
            return control.max;
          },
          get step() {
            return control.step;
          },
          get shortcut() {
            return control.shortcut;
          },
          get shortcutActive() {
            return active();
          }
        });
      case "range":
        return _$createComponent19(RangeSlider, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          get min() {
            return control.min ?? 0;
          },
          get max() {
            return control.max ?? 1;
          },
          get step() {
            return control.step;
          },
          get defaultValue() {
            return control.rangeDefault;
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
        });
      case "toggle":
        return _$createComponent19(Toggle, {
          get label() {
            return control.label;
          },
          get checked() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next),
          get shortcut() {
            return control.shortcut;
          },
          get shortcutActive() {
            return active();
          }
        });
      case "spring":
        return _$createComponent19(SpringControl, {
          get panelId() {
            return props.panelId;
          },
          get path() {
            return control.path;
          },
          get label() {
            return control.label;
          },
          get spring() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
        });
      case "transition":
        return _$createComponent19(TransitionControl, {
          get panelId() {
            return props.panelId;
          },
          get path() {
            return control.path;
          },
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next),
          get durationControl() {
            return props.transitionDuration;
          }
        });
      case "folder":
        if (control.module) {
          const enabledPath = `${control.path}._enabled`;
          return _$createComponent19(ModuleFolder, {
            get title() {
              return control.label;
            },
            get enabled() {
              return props.values[enabledPath];
            },
            onEnabledChange: (next) => DialStore.updateValue(props.panelId, enabledPath, next),
            get defaultOpen() {
              return control.defaultOpen ?? true;
            },
            get hint() {
              return control.hint;
            },
            get hintId() {
              return hintId(control);
            },
            get children() {
              return _$createComponent19(For5, {
                get each() {
                  return control.children ?? [];
                },
                children: renderControl
              });
            }
          });
        }
        return _$createComponent19(Folder, {
          get title() {
            return control.label;
          },
          get defaultOpen() {
            return control.defaultOpen ?? true;
          },
          get collapsible() {
            return control.collapsible ?? true;
          },
          get hint() {
            return control.hint;
          },
          get hintId() {
            return hintId(control);
          },
          get children() {
            return _$createComponent19(For5, {
              get each() {
                return control.children ?? [];
              },
              children: renderControl
            });
          }
        });
      case "text":
        return _$createComponent19(TextControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next),
          get placeholder() {
            return control.placeholder;
          }
        });
      case "select":
        return _$createComponent19(SelectControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          get options() {
            return control.options ?? [];
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
        });
      case "color":
        return _$createComponent19(ColorControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next),
          get alpha() {
            return control.alpha;
          },
          get palette() {
            return control.palette;
          }
        });
      case "gradient":
        return _$createComponent19(GradientControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next)
        });
      case "xy":
        return _$createComponent19(XYControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (next) => DialStore.updateValue(props.panelId, control.path, next),
          get x() {
            return control.xAxis;
          },
          get y() {
            return control.yAxis;
          },
          get grid() {
            return control.grid;
          },
          get density() {
            return control.density;
          },
          get snap() {
            return control.snap;
          },
          get returnToCenter() {
            return control.returnToCenter;
          },
          get showValues() {
            return control.showValues;
          },
          get shortcut() {
            return control.shortcut;
          },
          get shortcutActive() {
            return active();
          }
        });
      case "action":
        return (() => {
          var _el$ = _tmpl$49();
          _el$.$$click = () => DialStore.triggerAction(props.panelId, control.path);
          _$insert19(_el$, () => control.label);
          _$effect19(() => _el$.disabled = DialStore.isDisabled(props.panelId, control.path));
          return _el$;
        })();
      default:
        return null;
    }
  };
  const renderControl = (control) => {
    const node = renderControlNode(control);
    if (control.type === "folder") return node;
    return _$createComponent19(ControlShell, {
      get hint() {
        return control.hint;
      },
      get title() {
        return control.path;
      },
      get id() {
        return hintId(control);
      },
      get affordance() {
        return control.affordance;
      },
      get panelId() {
        return props.panelId;
      },
      get path() {
        return control.path;
      },
      children: node
    });
  };
  return _$createComponent19(For5, {
    get each() {
      return props.controls;
    },
    children: renderControl
  });
}
_$delegateEvents16(["click"]);

// src/solid/components/PresetManager.tsx
import { template as _$template21 } from "solid-js/web";
import { delegateEvents as _$delegateEvents17 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty11 } from "solid-js/web";
import { createComponent as _$createComponent20 } from "solid-js/web";
import { effect as _$effect20 } from "solid-js/web";
import { setAttribute as _$setAttribute15 } from "solid-js/web";
import { insert as _$insert20 } from "solid-js/web";
import { memo as _$memo14 } from "solid-js/web";
import { use as _$use13 } from "solid-js/web";
import { createSignal as createSignal20, createEffect as createEffect13, onMount as onMount11, onCleanup as onCleanup16, Show as Show16, For as For6 } from "solid-js";
import { Portal as Portal5 } from "solid-js/web";
import { animate as animate7 } from "motion";
var _tmpl$50 = /* @__PURE__ */ _$template21(`<div class=dialkit-preset-item><span class=dialkit-preset-name>Version 1`);
var _tmpl$217 = /* @__PURE__ */ _$template21(`<div class="dialkit-root dialkit-preset-dropdown"style=position:fixed>`);
var _tmpl$313 = /* @__PURE__ */ _$template21(`<div class=dialkit-preset-manager><button class=dialkit-preset-trigger><span class=dialkit-preset-label></span><svg class=dialkit-select-chevron viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$410 = /* @__PURE__ */ _$template21(`<button class=dialkit-preset-delete title="Delete preset"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path></path><path></path><path></path><path></path><path>`);
var _tmpl$55 = /* @__PURE__ */ _$template21(`<div class=dialkit-preset-item><span class=dialkit-preset-name>`);
function PresetManager(props) {
  const [isOpen, setIsOpen] = createSignal20(false);
  const [mounted, setMounted] = createSignal20(false);
  const [pos, setPos] = createSignal20({
    top: 0,
    left: 0,
    width: 0
  });
  const [portalTarget, setPortalTarget] = createSignal20(null);
  let triggerRef;
  let dropdownRef;
  let chevronRef;
  let closeAnim = null;
  let chevronAnim = null;
  const hasPresets = () => props.presets.length > 0;
  const activePreset = () => props.presets.find((p) => p.id === props.activePresetId);
  onMount11(() => {
    const root = triggerRef?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
    if (chevronRef) {
      chevronRef.style.transform = `rotate(${isOpen() ? 180 : 0}deg)`;
      chevronRef.style.opacity = String(hasPresets() ? 0.6 : 0.25);
    }
    onCleanup16(() => {
      closeAnim?.stop();
      chevronAnim?.stop();
    });
  });
  createEffect13(() => {
    if (!chevronRef) return;
    const open = isOpen();
    const has = hasPresets();
    chevronAnim?.stop();
    chevronAnim = animate7(chevronRef, {
      rotate: open ? 180 : 0,
      opacity: has ? 0.6 : 0.25
    }, {
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.15
    });
  });
  const updatePos = () => {
    const rect = triggerRef?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    });
  };
  const openDropdown = () => {
    if (!hasPresets()) return;
    updatePos();
    closeAnim?.stop();
    closeAnim = null;
    setMounted(true);
    setIsOpen(true);
  };
  const closeDropdown = () => {
    setIsOpen(false);
    if (!dropdownRef) {
      setMounted(false);
      return;
    }
    closeAnim?.stop();
    closeAnim = animate7(dropdownRef, {
      opacity: 0,
      y: 4,
      scale: 0.97
    }, {
      type: "spring",
      visualDuration: 0.15,
      bounce: 0,
      onComplete: () => {
        setMounted(false);
        closeAnim = null;
      }
    });
  };
  const toggle = () => {
    if (isOpen()) closeDropdown();
    else openDropdown();
  };
  createEffect13(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();
    const handler = (e) => {
      const target = e.target;
      if (triggerRef?.contains(target) || dropdownRef?.contains(target)) return;
      closeDropdown();
    };
    updatePos();
    document.addEventListener("mousedown", handler);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    onCleanup16(() => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const handleSelect = (presetId) => {
    DialStore.selectPreset(props.panelId, presetId);
    closeDropdown();
  };
  const handleDelete = (e, presetId) => {
    e.stopPropagation();
    DialStore.removePreset(props.panelId, presetId);
  };
  return (() => {
    var _el$ = _tmpl$313(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild;
    _el$2.$$click = toggle;
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? _$use13(_ref$, _el$2) : triggerRef = _el$2;
    _$insert20(_el$3, (() => {
      var _c$ = _$memo14(() => !!activePreset());
      return () => _c$() ? activePreset().name : props.providerMode ? "Presets" : "Version 1";
    })());
    var _ref$2 = chevronRef;
    typeof _ref$2 === "function" ? _$use13(_ref$2, _el$4) : chevronRef = _el$4;
    _$setAttribute15(_el$5, "d", ICON_CHEVRON);
    _$insert20(_el$, _$createComponent20(Show16, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return _$createComponent20(Portal5, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return _$createComponent20(Show16, {
              get when() {
                return mounted();
              },
              get children() {
                var _el$6 = _tmpl$217();
                _$use13((el) => {
                  dropdownRef = el;
                  animate7(el, {
                    opacity: [0, 1],
                    y: [4, 0],
                    scale: [0.97, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$6);
                _$insert20(_el$6, _$createComponent20(Show16, {
                  get when() {
                    return !props.providerMode;
                  },
                  get children() {
                    var _el$7 = _tmpl$50();
                    _el$7.$$click = () => handleSelect(null);
                    _$effect20(() => _$setAttribute15(_el$7, "data-active", String(!props.activePresetId)));
                    return _el$7;
                  }
                }), null);
                _$insert20(_el$6, _$createComponent20(For6, {
                  get each() {
                    return props.presets;
                  },
                  children: (preset) => (() => {
                    var _el$8 = _tmpl$55(), _el$9 = _el$8.firstChild;
                    _el$8.$$click = () => handleSelect(preset.id);
                    _$insert20(_el$9, () => preset.name);
                    _$insert20(_el$8, _$createComponent20(Show16, {
                      get when() {
                        return preset.deletable ?? true;
                      },
                      get children() {
                        var _el$0 = _tmpl$410(), _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling;
                        _el$0.$$click = (e) => handleDelete(e, preset.id);
                        _$effect20((_p$) => {
                          var _v$7 = ICON_TRASH[0], _v$8 = ICON_TRASH[1], _v$9 = ICON_TRASH[2], _v$0 = ICON_TRASH[3], _v$1 = ICON_TRASH[4];
                          _v$7 !== _p$.e && _$setAttribute15(_el$10, "d", _p$.e = _v$7);
                          _v$8 !== _p$.t && _$setAttribute15(_el$11, "d", _p$.t = _v$8);
                          _v$9 !== _p$.a && _$setAttribute15(_el$12, "d", _p$.a = _v$9);
                          _v$0 !== _p$.o && _$setAttribute15(_el$13, "d", _p$.o = _v$0);
                          _v$1 !== _p$.i && _$setAttribute15(_el$14, "d", _p$.i = _v$1);
                          return _p$;
                        }, {
                          e: void 0,
                          t: void 0,
                          a: void 0,
                          o: void 0,
                          i: void 0
                        });
                        return _el$0;
                      }
                    }), null);
                    _$effect20(() => _$setAttribute15(_el$8, "data-active", String(preset.id === props.activePresetId)));
                    return _el$8;
                  })()
                }), null);
                _$effect20((_p$) => {
                  var _v$ = `${pos().top}px`, _v$2 = `${pos().left}px`, _v$3 = `${pos().width}px`;
                  _v$ !== _p$.e && _$setStyleProperty11(_el$6, "top", _p$.e = _v$);
                  _v$2 !== _p$.t && _$setStyleProperty11(_el$6, "left", _p$.t = _v$2);
                  _v$3 !== _p$.a && _$setStyleProperty11(_el$6, "min-width", _p$.a = _v$3);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                });
                return _el$6;
              }
            });
          }
        });
      }
    }), null);
    _$effect20((_p$) => {
      var _v$4 = String(isOpen()), _v$5 = String(!!activePreset()), _v$6 = String(!hasPresets());
      _v$4 !== _p$.e && _$setAttribute15(_el$2, "data-open", _p$.e = _v$4);
      _v$5 !== _p$.t && _$setAttribute15(_el$2, "data-has-preset", _p$.t = _v$5);
      _v$6 !== _p$.a && _$setAttribute15(_el$2, "data-disabled", _p$.a = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
_$delegateEvents17(["click"]);

// src/solid/components/Panel.tsx
var _tmpl$51 = /* @__PURE__ */ _$template22(`<button class=dialkit-toolbar-add title="Add preset"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path></path><path></path><path></path><path></path><path>`);
var _tmpl$218 = /* @__PURE__ */ _$template22(`<button class=dialkit-toolbar-copy title="Copy parameters"><span class=dialkit-toolbar-copy-icon-wrap><span class=dialkit-toolbar-copy-icon style=opacity:1;transform:scale(1);filter:blur(0px)><svg viewBox="0 0 24 24"fill=none width=16 height=16><path stroke=currentColor stroke-width=2 stroke-linejoin=round></path><path fill=currentColor></path><path stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path></svg></span><span class=dialkit-toolbar-copy-icon style=opacity:0;transform:scale(0.5);filter:blur(4px)><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round width=16 height=16><path></path></svg></span></span>Copy`);
var _tmpl$314 = /* @__PURE__ */ _$template22(`<div class=dialkit-panel-wrapper>`);
function Panel(props) {
  const [copied, setCopied] = createSignal21(false);
  const [isPanelOpen, setIsPanelOpen] = createSignal21(props.defaultOpen ?? true);
  const [values, setValues] = createSignal21(DialStore.getValues(props.panel.id));
  const [presets, setPresets] = createSignal21(DialStore.getPresetItems(props.panel.id));
  const [activePresetId, setActivePresetId] = createSignal21(DialStore.getActivePresetId(props.panel.id));
  const [providerMode, setProviderMode] = createSignal21(DialStore.hasPresetProvider(props.panel.id));
  let addButtonRef;
  let copyButtonRef;
  let copyClipboardIconRef;
  let copyCheckIconRef;
  let addTapAnim = null;
  let copyTapAnim = null;
  let copyClipboardAnim = null;
  let copyCheckAnim = null;
  let didInitCopyIcons = false;
  const tapTransition = {
    type: "spring",
    visualDuration: 0.15,
    bounce: 0.3
  };
  onMount12(() => {
    const unsub = DialStore.subscribe(props.panel.id, () => {
      setValues(DialStore.getValues(props.panel.id));
      setPresets(DialStore.getPresetItems(props.panel.id));
      setActivePresetId(DialStore.getActivePresetId(props.panel.id));
      setProviderMode(DialStore.hasPresetProvider(props.panel.id));
    });
    if (copyClipboardIconRef && copyCheckIconRef) {
      copyClipboardIconRef.style.transformOrigin = "50% 50%";
      copyClipboardIconRef.style.opacity = "1";
      copyClipboardIconRef.style.transform = "scale(1)";
      copyClipboardIconRef.style.filter = "blur(0px)";
      copyCheckIconRef.style.transformOrigin = "50% 50%";
      copyCheckIconRef.style.opacity = "0";
      copyCheckIconRef.style.transform = "scale(0.5)";
      copyCheckIconRef.style.filter = "blur(4px)";
      didInitCopyIcons = true;
    }
    onCleanup17(unsub);
  });
  const handleAddPreset = () => DialStore.createPreset(props.panel.id);
  const handleCopy = () => {
    const jsonStr = JSON.stringify(values(), null, 2);
    const instruction = `Update the createDialKit configuration for "${props.panel.name}" with these values:

\`\`\`json
${jsonStr}
\`\`\`

Apply these values as the new defaults in the createDialKit call.`;
    navigator.clipboard.writeText(instruction);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  createEffect14(() => {
    const isCopied = copied();
    if (!copyClipboardIconRef || !copyCheckIconRef) return;
    copyClipboardAnim?.stop();
    copyCheckAnim?.stop();
    if (!didInitCopyIcons) return;
    const transition = {
      type: "spring",
      visualDuration: 0.3,
      bounce: 0.2
    };
    copyClipboardAnim = animate8(copyClipboardIconRef, {
      opacity: isCopied ? 0 : 1,
      scale: isCopied ? 0.5 : 1,
      filter: isCopied ? "blur(4px)" : "blur(0px)"
    }, transition);
    copyCheckAnim = animate8(copyCheckIconRef, {
      opacity: isCopied ? 1 : 0,
      scale: isCopied ? 1 : 0.5,
      filter: isCopied ? "blur(0px)" : "blur(4px)"
    }, transition);
  });
  onCleanup17(() => {
    addTapAnim?.stop();
    copyTapAnim?.stop();
    copyClipboardAnim?.stop();
    copyCheckAnim?.stop();
  });
  const handleAddTapStart = () => {
    if (!addButtonRef) return;
    addTapAnim?.stop();
    addTapAnim = animate8(addButtonRef, {
      scale: 0.9
    }, tapTransition);
  };
  const handleAddTapEnd = () => {
    if (!addButtonRef) return;
    addTapAnim?.stop();
    addTapAnim = animate8(addButtonRef, {
      scale: 1
    }, tapTransition);
  };
  const handleCopyTapStart = () => {
    if (!copyButtonRef) return;
    copyTapAnim?.stop();
    copyTapAnim = animate8(copyButtonRef, {
      scale: 0.95
    }, tapTransition);
  };
  const handleCopyTapEnd = () => {
    if (!copyButtonRef) return;
    copyTapAnim?.stop();
    copyTapAnim = animate8(copyButtonRef, {
      scale: 1
    }, tapTransition);
  };
  const renderControls = () => _$createComponent21(ControlRenderer, {
    get panelId() {
      return props.panel.id;
    },
    get controls() {
      return props.panel.controls;
    },
    get values() {
      return values();
    }
  });
  const toolbar = [(() => {
    var _el$ = _tmpl$51(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling;
    _el$.addEventListener("pointerleave", handleAddTapEnd);
    _el$.addEventListener("pointercancel", handleAddTapEnd);
    _el$.$$pointerup = handleAddTapEnd;
    _el$.$$pointerdown = handleAddTapStart;
    _el$.$$click = handleAddPreset;
    var _ref$ = addButtonRef;
    typeof _ref$ === "function" ? _$use14(_ref$, _el$) : addButtonRef = _el$;
    _$effect21((_p$) => {
      var _v$ = ICON_ADD_PRESET[0], _v$2 = ICON_ADD_PRESET[1], _v$3 = ICON_ADD_PRESET[2], _v$4 = ICON_ADD_PRESET[3], _v$5 = ICON_ADD_PRESET[4];
      _v$ !== _p$.e && _$setAttribute16(_el$3, "d", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute16(_el$4, "d", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute16(_el$5, "d", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute16(_el$6, "d", _p$.o = _v$4);
      _v$5 !== _p$.i && _$setAttribute16(_el$7, "d", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })(), _$createComponent21(PresetManager, {
    get panelId() {
      return props.panel.id;
    },
    get presets() {
      return presets();
    },
    get activePresetId() {
      return activePresetId();
    },
    onAdd: handleAddPreset,
    get providerMode() {
      return providerMode();
    }
  }), (() => {
    var _el$8 = _tmpl$218(), _el$9 = _el$8.firstChild, _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$0.nextSibling, _el$14 = _el$13.firstChild, _el$15 = _el$14.firstChild;
    _el$8.addEventListener("pointerleave", handleCopyTapEnd);
    _el$8.addEventListener("pointercancel", handleCopyTapEnd);
    _el$8.$$pointerup = handleCopyTapEnd;
    _el$8.$$pointerdown = handleCopyTapStart;
    _el$8.$$click = handleCopy;
    var _ref$2 = copyButtonRef;
    typeof _ref$2 === "function" ? _$use14(_ref$2, _el$8) : copyButtonRef = _el$8;
    var _ref$3 = copyClipboardIconRef;
    typeof _ref$3 === "function" ? _$use14(_ref$3, _el$0) : copyClipboardIconRef = _el$0;
    var _ref$4 = copyCheckIconRef;
    typeof _ref$4 === "function" ? _$use14(_ref$4, _el$13) : copyCheckIconRef = _el$13;
    _$setAttribute16(_el$15, "d", ICON_CHECK);
    _$effect21((_p$) => {
      var _v$6 = ICON_CLIPBOARD.board, _v$7 = ICON_CLIPBOARD.sparkle, _v$8 = ICON_CLIPBOARD.body;
      _v$6 !== _p$.e && _$setAttribute16(_el$10, "d", _p$.e = _v$6);
      _v$7 !== _p$.t && _$setAttribute16(_el$11, "d", _p$.t = _v$7);
      _v$8 !== _p$.a && _$setAttribute16(_el$12, "d", _p$.a = _v$8);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$8;
  })(), _$memo15(() => props.toolbarExtra)];
  return (() => {
    var _el$16 = _tmpl$314();
    _$insert21(_el$16, _$createComponent21(Folder, {
      get title() {
        return props.panel.name;
      },
      get defaultOpen() {
        return props.defaultOpen ?? true;
      },
      isRoot: true,
      get inline() {
        return props.inline ?? false;
      },
      onOpenChange: setIsPanelOpen,
      toolbar,
      get children() {
        return renderControls();
      }
    }));
    return _el$16;
  })();
}
_$delegateEvents18(["click", "pointerdown", "pointerup"]);

// src/solid/components/Timeline/TimelineToggleButton.tsx
import { template as _$template23 } from "solid-js/web";
import { delegateEvents as _$delegateEvents19 } from "solid-js/web";
import { setAttribute as _$setAttribute17 } from "solid-js/web";
import { effect as _$effect22 } from "solid-js/web";
import { insert as _$insert22 } from "solid-js/web";
import { createComponent as _$createComponent22 } from "solid-js/web";
import { For as For7 } from "solid-js";
var _tmpl$56 = /* @__PURE__ */ _$template23(`<button class="dialkit-toolbar-add dialkit-timeline-toolbar-toggle"><svg viewBox="0 0 24 24"fill=none aria-hidden=true>`);
var _tmpl$219 = /* @__PURE__ */ _$template23(`<svg><path fill=currentColor></svg>`, false, true, false);
function TimelineToggleButton() {
  const visible = fromStore(() => TimelineUiStore.getVisible(), (notify2) => TimelineUiStore.subscribe(notify2));
  const label = () => visible() ? "Hide timeline" : "Show timeline";
  return (() => {
    var _el$ = _tmpl$56(), _el$2 = _el$.firstChild;
    _el$.$$click = () => TimelineUiStore.toggle();
    _$insert22(_el$2, _$createComponent22(For7, {
      each: ICON_TIMELINE,
      children: (path) => (() => {
        var _el$3 = _tmpl$219();
        _$setAttribute17(_el$3, "d", path);
        return _el$3;
      })()
    }));
    _$effect22((_p$) => {
      var _v$ = visible() || void 0, _v$2 = visible(), _v$3 = label(), _v$4 = label();
      _v$ !== _p$.e && _$setAttribute17(_el$, "data-active", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute17(_el$, "aria-pressed", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute17(_el$, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute17(_el$, "title", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
_$delegateEvents19(["click"]);

// src/solid/components/DialRoot.tsx
var _tmpl$57 = /* @__PURE__ */ _$template24(`<div class=dialkit-root><div class=dialkit-panel>`);
var _tmpl$220 = /* @__PURE__ */ _$template24(`<div class=dialkit-timeline-toolkit-only>Timeline`);
var _tmpl$315 = /* @__PURE__ */ _$template24(`<div class=dialkit-panel-wrapper>`);
var isDevDefault2 = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import.meta !== "undefined" && import.meta.env?.MODE ? import.meta.env.MODE !== "production" : true;
function DialRoot(props) {
  if ((props.productionEnabled ?? isDevDefault2) === false) return null;
  const [panels, setPanels] = createSignal22([]);
  const [timelineCount, setTimelineCount] = createSignal22(0);
  const [mounted, setMounted] = createSignal22(false);
  const inline = () => (props.mode ?? "popover") === "inline";
  onMount13(() => {
    setMounted(true);
    setPanels(DialStore.getPanels("panel"));
    setTimelineCount(TimelineStore.getTimelines().length);
    const unsubPanels = DialStore.subscribeGlobal(() => {
      setPanels(DialStore.getPanels("panel"));
    });
    const unsubTimelines = TimelineStore.subscribeGlobal(() => {
      setTimelineCount(TimelineStore.getTimelines().length);
    });
    onCleanup18(() => {
      unsubPanels();
      unsubTimelines();
    });
  });
  const timelineToggle = () => timelineCount() > 0 ? _$createComponent23(TimelineToggleButton, {}) : null;
  const content = () => _$createComponent23(ShortcutListener, {
    get children() {
      var _el$ = _tmpl$57(), _el$2 = _el$.firstChild;
      _$insert23(_el$2, _$createComponent23(Show17, {
        get when() {
          return panels().length > 0;
        },
        get fallback() {
          return (() => {
            var _el$3 = _tmpl$315();
            _$insert23(_el$3, _$createComponent23(Folder, {
              title: "DialKit",
              get defaultOpen() {
                return inline() || (props.defaultOpen ?? true);
              },
              isRoot: true,
              get inline() {
                return inline();
              },
              get toolbar() {
                return timelineToggle();
              },
              get children() {
                return _tmpl$220();
              }
            }));
            return _el$3;
          })();
        },
        get children() {
          return _$createComponent23(For8, {
            get each() {
              return panels();
            },
            children: (panel) => _$createComponent23(Panel, {
              panel,
              get defaultOpen() {
                return inline() || (props.defaultOpen ?? true);
              },
              get inline() {
                return inline();
              },
              get toolbarExtra() {
                return timelineToggle();
              }
            })
          });
        }
      }));
      _$effect23((_p$) => {
        var _v$ = props.mode ?? "popover", _v$2 = props.theme ?? "system", _v$3 = inline() ? void 0 : props.position ?? "top-right", _v$4 = props.mode ?? "popover";
        _v$ !== _p$.e && _$setAttribute18(_el$, "data-mode", _p$.e = _v$);
        _v$2 !== _p$.t && _$setAttribute18(_el$, "data-theme", _p$.t = _v$2);
        _v$3 !== _p$.a && _$setAttribute18(_el$2, "data-position", _p$.a = _v$3);
        _v$4 !== _p$.o && _$setAttribute18(_el$2, "data-mode", _p$.o = _v$4);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      });
      return _el$;
    }
  });
  return _$createComponent23(Show17, {
    get when() {
      return _$memo16(() => !!(mounted() && typeof window !== "undefined"))() && (panels().length > 0 || timelineCount() > 0);
    },
    get children() {
      return _$createComponent23(Show17, {
        get when() {
          return !inline();
        },
        get fallback() {
          return content();
        },
        get children() {
          return _$createComponent23(Portal6, {
            get mount() {
              return document.body;
            },
            get children() {
              return content();
            }
          });
        }
      });
    }
  });
}

// src/solid/components/Timeline/DialTimeline.tsx
import { template as _$template25 } from "solid-js/web";
import { delegateEvents as _$delegateEvents20 } from "solid-js/web";
import { addEventListener as _$addEventListener4 } from "solid-js/web";
import { style as _$style7 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty12 } from "solid-js/web";
import { setAttribute as _$setAttribute19 } from "solid-js/web";
import { effect as _$effect24 } from "solid-js/web";
import { insert as _$insert24 } from "solid-js/web";
import { use as _$use15 } from "solid-js/web";
import { memo as _$memo17 } from "solid-js/web";
import { createComponent as _$createComponent24 } from "solid-js/web";
import { For as For9, Show as Show18, createEffect as createEffect15, createMemo as createMemo3, createSignal as createSignal23, onCleanup as onCleanup19, onMount as onMount14 } from "solid-js";
import { Portal as Portal7 } from "solid-js/web";
var _tmpl$58 = /* @__PURE__ */ _$template25(`<div class="dialkit-root dialkit-timeline"><div class=dialkit-timeline-resize-handle role=separator aria-label="Resize timeline height"aria-orientation=horizontal title="Drag to resize timeline"></div><div class=dialkit-timeline-dock>`);
var _tmpl$221 = /* @__PURE__ */ _$template25(`<svg viewBox="0 0 24 24"fill=none aria-hidden=true>`);
var _tmpl$316 = /* @__PURE__ */ _$template25(`<button class=dialkit-toolbar-add><span style=position:relative;width:16px;height:16px>`);
var _tmpl$411 = /* @__PURE__ */ _$template25(`<svg viewBox="0 0 24 24"fill=none aria-hidden=true><path fill=currentColor>`);
var _tmpl$59 = /* @__PURE__ */ _$template25(`<svg><path fill=currentColor></svg>`, false, true, false);
var _tmpl$65 = /* @__PURE__ */ _$template25(`<button class=dialkit-toolbar-add title=Replay aria-label=Replay><svg viewBox="0 0 24 24"fill=none aria-hidden=true>`);
var _tmpl$72 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-overview title="Drag to scrub the full timeline"><div class=dialkit-timeline-overview-viewport></div><div class=dialkit-timeline-overview-progress></div><div class=dialkit-timeline-overview-playhead>`);
var _tmpl$82 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-playhead-control role=slider aria-label="Timeline current time"aria-valuemin=0 title="Drag to scrub the timeline"><div class=dialkit-timeline-playhead-stem></div><div class=dialkit-timeline-playhead-anchor><div class=dialkit-timeline-playhead-flag>`);
var _tmpl$92 = /* @__PURE__ */ _$template25(`<div class="dialkit-timeline-row dialkit-timeline-group-row"><div class=dialkit-timeline-label><button class=dialkit-timeline-group-toggle></button><span></span></div><div class=dialkit-timeline-lane>`);
var _tmpl$02 = /* @__PURE__ */ _$template25(`<button class=dialkit-timeline-group-toggle>`);
var _tmpl$1 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-row><div class=dialkit-timeline-label></div><div class=dialkit-timeline-lane>`);
var _tmpl$102 = /* @__PURE__ */ _$template25(`<div class="dialkit-timeline-row dialkit-timeline-track-row"><div class=dialkit-timeline-label></div><div class=dialkit-timeline-lane>`);
var _tmpl$112 = /* @__PURE__ */ _$template25(`<svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path>`);
var _tmpl$122 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-scroll-row><div class=dialkit-timeline-label></div><div class=dialkit-timeline-horizontal-scroll aria-label="Timeline horizontal scroll"><div>`);
var _tmpl$132 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-body><div class=dialkit-timeline-grid><div class="dialkit-timeline-row dialkit-timeline-ruler-row"><div class=dialkit-timeline-label></div><div class=dialkit-timeline-ruler title="Click to seek \xB7 drag to set a loop region \xB7 Option-drag to zoom \xB7 Shift-drag to reset zoom">`);
var _tmpl$142 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-section><div class=dialkit-timeline-header><div class=dialkit-timeline-identity><span class=dialkit-timeline-title></span></div><div class=dialkit-timeline-actions><button class=dialkit-timeline-loop-toggle><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true></svg></button><button class=dialkit-toolbar-add title="Add timeline version"aria-label="Add timeline version"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round aria-hidden=true></svg></button><button class=dialkit-toolbar-add title="Copy parameters"><span style=position:relative;width:16px;height:16px></span></button><button class=dialkit-timeline-chevron>`);
var _tmpl$152 = /* @__PURE__ */ _$template25(`<svg><path></svg>`, false, true, false);
var _tmpl$162 = /* @__PURE__ */ _$template25(`<svg viewBox="0 0 24 24"fill=none aria-hidden=true><path stroke=currentColor stroke-width=2 stroke-linejoin=round></path><path fill=currentColor></path><path stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>`);
var _tmpl$172 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-loop-dim style=left:0px>`);
var _tmpl$182 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-loop-dim style=right:0px>`);
var _tmpl$192 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-loop-band>`);
var _tmpl$202 = /* @__PURE__ */ _$template25(`<div class="dialkit-timeline-tick dialkit-timeline-tick-fine">`);
var _tmpl$2110 = /* @__PURE__ */ _$template25(`<div class="dialkit-timeline-tick dialkit-timeline-tick-medium">`);
var _tmpl$222 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-tick><span class=dialkit-timeline-tick-label>`);
var _tmpl$232 = /* @__PURE__ */ _$template25(`<svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$242 = /* @__PURE__ */ _$template25(`<div class=dialkit-root><div class=dialkit-timeline-popover role=dialog><div class=dialkit-timeline-popover-header><span class=dialkit-timeline-popover-title></span><button class=dialkit-timeline-popover-close title="Close editor"aria-label="Close editor"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round><path d="M6 6L18 18M18 6L6 18"></path></svg></button></div><div class=dialkit-timeline-popover-body>`);
var _tmpl$252 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-clip-handle data-edge=start>`);
var _tmpl$262 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-clip>`);
var _tmpl$272 = /* @__PURE__ */ _$template25(`<span class=dialkit-timeline-loop-infinity aria-hidden=true title="Repeats indefinitely">\u221E`);
var _tmpl$282 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-clip-ghost aria-hidden=true>`);
var _tmpl$292 = /* @__PURE__ */ _$template25(`<span class=dialkit-timeline-clip-ghost-segment>`);
var _tmpl$302 = /* @__PURE__ */ _$template25(`<span class=dialkit-timeline-clip-duration>`);
var _tmpl$317 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-clip-handle data-edge=end>`);
var _tmpl$322 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-clip-segment>`);
var _tmpl$332 = /* @__PURE__ */ _$template25(`<div class=dialkit-timeline-clip-handle>`);
var DRAG_THRESHOLD_PX = 3;
var LOOP_DRAG_THRESHOLD_PX = 4;
var MAJOR_TICK_TARGET_PX = 140;
var MILLISECOND_STEP = 1e-3;
var SECOND_TICK_STEPS = [1e-3, 2e-3, 5e-3, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600];
var MIN_TIMELINE_MAX_ZOOM = 8;
var PLAYHEAD_FLAG_WIDTH = 52;
var PLAYHEAD_FLAG_EDGE_OVERHANG = 1;
var POPOVER_WIDTH = 280;
var ZOOM_DRAG_DISTANCE = 180;
var DEFAULT_DOCK_MAX_HEIGHT = 400;
var MIN_DOCK_MAX_HEIGHT = 120;
function DialTimeline(props) {
  const enabled = () => (props.productionEnabled ?? isDevDefault) !== false;
  return _$createComponent24(Show18, {
    get when() {
      return enabled();
    },
    get children() {
      return _$createComponent24(DialTimelineDock, props);
    }
  });
}
function DialTimelineDock(props) {
  const timelines = fromStore(() => TimelineStore.getTimelines(), (notify2) => TimelineStore.subscribeGlobal(notify2));
  const visible = fromStore(() => TimelineUiStore.getVisible(), (notify2) => TimelineUiStore.subscribe(notify2));
  const [mounted, setMounted] = createSignal23(false);
  const [dockMaxHeight, setDockMaxHeight] = createSignal23(DEFAULT_DOCK_MAX_HEIGHT);
  const controllerId = /* @__PURE__ */ Symbol("dialkit-timeline-visibility");
  let dockRef;
  let resizeCleanup = null;
  onMount14(() => {
    setMounted(true);
    const unregister = TimelineUiStore.registerController(controllerId, {
      visible: props.visible,
      defaultVisible: props.defaultVisible ?? true,
      onVisibilityChange: props.onVisibilityChange
    });
    onCleanup19(unregister);
  });
  createEffect15(() => {
    TimelineUiStore.updateController(controllerId, {
      visible: props.visible,
      defaultVisible: props.defaultVisible ?? true,
      onVisibilityChange: props.onVisibilityChange
    });
  });
  onCleanup19(() => resizeCleanup?.());
  const handleResizePointerDown = (event) => {
    if (!dockRef) return;
    event.preventDefault();
    event.stopPropagation();
    resizeCleanup?.();
    const pointerY = event.clientY;
    const startHeight = dockRef.getBoundingClientRect().height;
    const move = (next) => {
      next.preventDefault();
      const viewportMax = Math.max(MIN_DOCK_MAX_HEIGHT, window.innerHeight - 24);
      setDockMaxHeight(clamp4(startHeight + pointerY - next.clientY, MIN_DOCK_MAX_HEIGHT, viewportMax));
    };
    const finish = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      resizeCleanup = null;
    };
    window.addEventListener("pointermove", move, {
      passive: false
    });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    resizeCleanup = finish;
  };
  return _$createComponent24(Show18, {
    get when() {
      return _$memo17(() => !!mounted())() && timelines().length > 0;
    },
    get children() {
      return _$createComponent24(Portal7, {
        get mount() {
          return document.body;
        },
        get children() {
          var _el$ = _tmpl$58(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
          _el$2.$$pointerdown = handleResizePointerDown;
          var _ref$ = dockRef;
          typeof _ref$ === "function" ? _$use15(_ref$, _el$3) : dockRef = _el$3;
          _$insert24(_el$3, _$createComponent24(For9, {
            get each() {
              return timelines();
            },
            children: (timeline) => _$createComponent24(TimelineSection, {
              meta: timeline,
              get defaultOpen() {
                return props.defaultOpen ?? true;
              },
              get theme() {
                return props.theme ?? "system";
              },
              get dockVisible() {
                return visible();
              }
            })
          }));
          _$effect24((_p$) => {
            var _v$ = props.theme ?? "system", _v$2 = !visible(), _v$3 = `min(${dockMaxHeight()}px, calc(100vh - 24px))`;
            _v$ !== _p$.e && _$setAttribute19(_el$, "data-theme", _p$.e = _v$);
            _v$2 !== _p$.t && (_el$.hidden = _p$.t = _v$2);
            _v$3 !== _p$.a && _$setStyleProperty12(_el$3, "max-height", _p$.a = _v$3);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          });
          return _el$;
        }
      });
    }
  });
}
function PlayPauseButton(props) {
  const playing = fromStore(() => TimelineStore.getTransport(props.id).playing, (notify2) => TimelineStore.subscribe(props.id, notify2));
  const label = () => playing() ? "Pause" : "Play";
  return (() => {
    var _el$4 = _tmpl$316(), _el$5 = _el$4.firstChild;
    _el$4.$$click = () => playing() ? TimelineStore.pause(props.id) : TimelineStore.play(props.id);
    _$insert24(_el$5, _$createComponent24(Show18, {
      get when() {
        return playing();
      },
      get fallback() {
        return (() => {
          var _el$7 = _tmpl$411(), _el$8 = _el$7.firstChild;
          _$setAttribute19(_el$8, "d", ICON_PLAY);
          _$effect24((_$p) => _$style7(_el$7, iconStyle, _$p));
          return _el$7;
        })();
      },
      get children() {
        var _el$6 = _tmpl$221();
        _$insert24(_el$6, _$createComponent24(For9, {
          each: ICON_PAUSE,
          children: (path) => (() => {
            var _el$9 = _tmpl$59();
            _$setAttribute19(_el$9, "d", path);
            return _el$9;
          })()
        }));
        _$effect24((_$p) => _$style7(_el$6, iconStyle, _$p));
        return _el$6;
      }
    }));
    _$effect24((_p$) => {
      var _v$4 = label(), _v$5 = label();
      _v$4 !== _p$.e && _$setAttribute19(_el$4, "title", _p$.e = _v$4);
      _v$5 !== _p$.t && _$setAttribute19(_el$4, "aria-label", _p$.t = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$4;
  })();
}
function ReplayButton(props) {
  return (() => {
    var _el$0 = _tmpl$65(), _el$1 = _el$0.firstChild;
    _$addEventListener4(_el$0, "click", props.onReplay, true);
    _$insert24(_el$1, _$createComponent24(For9, {
      each: ICON_REPLAY,
      children: (path) => (() => {
        var _el$10 = _tmpl$59();
        _$setAttribute19(_el$10, "d", path);
        return _el$10;
      })()
    }));
    return _el$0;
  })();
}
var iconStyle = {
  position: "absolute",
  inset: "0",
  width: "16px",
  height: "16px",
  color: "var(--dial-text-label)"
};
function TimelineOverview(props) {
  const time = fromStore(() => TimelineStore.getTransport(props.id).time, (notify2) => TimelineStore.subscribe(props.id, notify2));
  let scrub = null;
  const seekFromClientX = (clientX) => {
    if (!scrub || scrub.rect.width <= 0 || props.duration <= 0) return;
    const next = clamp4((clientX - scrub.rect.left) / scrub.rect.width * props.duration, 0, props.duration);
    TimelineStore.seek(props.id, next);
    props.onNavigate(next);
  };
  const finish = () => {
    if (scrub?.wasPlaying) TimelineStore.play(props.id);
    scrub = null;
  };
  return (() => {
    var _el$11 = _tmpl$72(), _el$12 = _el$11.firstChild, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling;
    _el$11.addEventListener("lostpointercapture", finish);
    _el$11.addEventListener("pointercancel", finish);
    _el$11.$$pointerup = finish;
    _el$11.$$pointermove = (event) => scrub && seekFromClientX(event.clientX);
    _el$11.$$pointerdown = (event) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      scrub = {
        wasPlaying: TimelineStore.getTransport(props.id).playing,
        rect: event.currentTarget.getBoundingClientRect()
      };
      TimelineStore.pause(props.id);
      seekFromClientX(event.clientX);
    };
    _$effect24((_p$) => {
      var _v$6 = (props.duration > 0 ? (props.viewEnd - props.viewStart) / props.duration * 100 : 100) < 99.999 || void 0, _v$7 = `${props.duration > 0 ? props.viewStart / props.duration * 100 : 0}%`, _v$8 = `${props.duration > 0 ? (props.viewEnd - props.viewStart) / props.duration * 100 : 100}%`, _v$9 = `${props.duration > 0 ? time() / props.duration * 100 : 0}%`, _v$0 = `${props.duration > 0 ? time() / props.duration * 100 : 0}%`;
      _v$6 !== _p$.e && _$setAttribute19(_el$12, "data-zoomed", _p$.e = _v$6);
      _v$7 !== _p$.t && _$setStyleProperty12(_el$12, "left", _p$.t = _v$7);
      _v$8 !== _p$.a && _$setStyleProperty12(_el$12, "width", _p$.a = _v$8);
      _v$9 !== _p$.o && _$setStyleProperty12(_el$13, "width", _p$.o = _v$9);
      _v$0 !== _p$.i && _$setStyleProperty12(_el$14, "left", _p$.i = _v$0);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$11;
  })();
}
function TimelinePlayheadFlag(props) {
  const time = fromStore(() => TimelineStore.getTransport(props.id).time, (notify2) => TimelineStore.subscribe(props.id, notify2));
  let scrub = null;
  let cleanup = null;
  const seek = (clientX) => {
    if (!scrub || scrub.rect.width <= 0) return;
    TimelineStore.seek(props.id, clamp4(scrub.viewStart + (clientX - scrub.rect.left) / scrub.rect.width * (scrub.viewEnd - scrub.viewStart), scrub.viewStart, scrub.viewEnd));
  };
  onCleanup19(() => cleanup?.());
  const x = () => clamp4((time() - props.viewStart) * props.pxPerSecond, 0, props.laneWidth);
  const flagCenter = () => clamp4(x(), PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG, props.laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG);
  const flagOffset = () => flagCenter() - x();
  const edge = () => flagOffset() > 0.5 ? "start" : flagOffset() < -0.5 ? "end" : "center";
  return _$createComponent24(Show18, {
    get when() {
      return _$memo17(() => !!(time() >= props.viewStart && time() <= props.viewEnd))() && props.laneWidth > 0;
    },
    get children() {
      var _el$15 = _tmpl$82(), _el$16 = _el$15.firstChild, _el$17 = _el$16.nextSibling, _el$18 = _el$17.firstChild;
      _el$15.$$pointerdown = (event) => {
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
        window.addEventListener("pointermove", move, {
          passive: false
        });
        window.addEventListener("pointerup", finish);
        window.addEventListener("pointercancel", finish);
        cleanup = finish;
      };
      _$insert24(_el$18, () => time().toFixed(2));
      _$effect24((_p$) => {
        var _v$1 = edge(), _v$10 = `calc(var(--dial-timeline-label-w) + ${x()}px)`, _v$11 = `${flagOffset()}px`, _v$12 = props.duration, _v$13 = time();
        _v$1 !== _p$.e && _$setAttribute19(_el$15, "data-edge", _p$.e = _v$1);
        _v$10 !== _p$.t && _$setStyleProperty12(_el$15, "left", _p$.t = _v$10);
        _v$11 !== _p$.a && _$setStyleProperty12(_el$15, "--dial-timeline-playhead-flag-offset", _p$.a = _v$11);
        _v$12 !== _p$.o && _$setAttribute19(_el$15, "aria-valuemax", _p$.o = _v$12);
        _v$13 !== _p$.i && _$setAttribute19(_el$15, "aria-valuenow", _p$.i = _v$13);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      });
      return _el$15;
    }
  });
}
function clampViewStart(start, duration, visibleDuration) {
  return clamp4(start, 0, Math.max(0, duration - visibleDuration));
}
function formatRulerSeconds(time, step) {
  if (step >= 1 && Number.isInteger(time)) return formatClock(time);
  const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
  return `${time.toFixed(decimals)}s`;
}
function TimelineSection(props) {
  const [open, setOpen] = createSignal23(props.defaultOpen);
  const [copied, setCopied] = createSignal23(false);
  const [popover, setPopover] = createSignal23(null);
  const [collapsedGroups, setCollapsedGroups] = createSignal23(/* @__PURE__ */ new Set());
  const [expandedTracks, setExpandedTracks] = createSignal23(/* @__PURE__ */ new Set());
  const [zoom, setZoom] = createSignal23(1);
  const [viewStart, setViewStart] = createSignal23(0);
  const values = fromStore(() => DialStore.getValues(props.meta.id), (notify2) => DialStore.subscribe(props.meta.id, notify2));
  const presets = () => {
    values();
    return DialStore.getPresets(props.meta.id);
  };
  const activePresetId = () => {
    values();
    return DialStore.getActivePresetId(props.meta.id);
  };
  const loopRegion = fromStore(() => TimelineStore.getLoopRegion(props.meta.id), (notify2) => TimelineStore.subscribe(props.meta.id, notify2));
  const [loopDrag, setLoopDrag] = createSignal23(null);
  let laneAreaRef;
  let horizontalScrollRef;
  const [laneWidth, setLaneWidth] = createSignal23(0);
  createEffect15(() => {
    if (!open() || !laneAreaRef) return;
    const measure = () => {
      if (laneAreaRef) setLaneWidth(laneAreaRef.getBoundingClientRect().width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(laneAreaRef);
    onCleanup19(() => observer.disconnect());
  });
  const visibleDuration = () => props.meta.duration > 0 ? props.meta.duration / zoom() : props.meta.duration;
  const safeViewStart = () => clampViewStart(viewStart(), props.meta.duration, visibleDuration());
  const viewEnd = () => safeViewStart() + visibleDuration();
  const pxPerSecond = () => visibleDuration() > 0 && laneWidth() > 0 ? laneWidth() / visibleDuration() : 0;
  const maxZoom = () => Math.max(MIN_TIMELINE_MAX_ZOOM, laneWidth() > 0 && props.meta.duration > 0 ? MAJOR_TICK_TARGET_PX * props.meta.duration / (MILLISECOND_STEP * 10 * laneWidth()) : MIN_TIMELINE_MAX_ZOOM);
  createEffect15(() => setZoom((current) => clamp4(current, 1, maxZoom())));
  createEffect15(() => setViewStart((current) => clampViewStart(current, props.meta.duration, props.meta.duration / zoom())));
  createEffect15(() => {
    const scroller = horizontalScrollRef;
    const next = safeViewStart() * pxPerSecond();
    if (!scroller || pxPerSecond() <= 0) return;
    if (Math.abs(scroller.scrollLeft - next) > 0.5) scroller.scrollLeft = next;
  });
  createEffect15(() => {
    if (!props.dockVisible) setPopover(null);
  });
  const centerViewAt = (time) => {
    if (zoom() <= 1 || props.meta.duration <= 0) return;
    const duration = props.meta.duration / zoom();
    setViewStart(clampViewStart(time - duration / 2, props.meta.duration, duration));
  };
  const resetView = () => {
    setZoom(1);
    setViewStart(0);
  };
  const handleReplay = () => {
    setViewStart(0);
    TimelineStore.replay(props.meta.id);
  };
  const handleClearLoopRegion = () => TimelineStore.clearLoopRegion(props.meta.id);
  const handleHorizontalScroll = (event) => {
    if (pxPerSecond() <= 0) return;
    setViewStart(clampViewStart(event.currentTarget.scrollLeft / pxPerSecond(), props.meta.duration, visibleDuration()));
  };
  const handleTimelineWheel = (event) => {
    if (!horizontalScrollRef || zoom() <= 1) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
    if (delta === 0) return;
    event.preventDefault();
    horizontalScrollRef.scrollLeft += delta;
  };
  let zoomDrag = null;
  let rulerGesture = null;
  let trackScrub = null;
  const rulerTimeFromClientX = (clientX, rect, viewStartAt, visibleAt) => clamp4(viewStartAt + (clientX - rect.left) / rect.width * visibleAt, viewStartAt, viewStartAt + visibleAt);
  const seekTrack = (clientX) => {
    if (!trackScrub || trackScrub.rect.width <= 0) return;
    TimelineStore.seek(props.meta.id, clamp4(trackScrub.viewStart + (clientX - trackScrub.rect.left) / trackScrub.rect.width * trackScrub.visibleDuration, trackScrub.viewStart, trackScrub.viewStart + trackScrub.visibleDuration));
  };
  const handleRulerPointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (!event.altKey) {
      const reset = event.shiftKey;
      const gestureViewStart = reset ? 0 : safeViewStart();
      const gestureVisible = reset ? props.meta.duration : visibleDuration();
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
    const ratio = clamp4((event.clientX - rect.left) / rect.width, 0, 1);
    zoomDrag = {
      pointerX: event.clientX,
      rect,
      zoom: zoom(),
      viewStart: safeViewStart(),
      anchorRatio: ratio,
      anchorTime: safeViewStart() + ratio * visibleDuration(),
      moved: false
    };
  };
  const handleRulerPointerMove = (event) => {
    if (rulerGesture) {
      const dx2 = event.clientX - rulerGesture.downClientX;
      if (!rulerGesture.moved && Math.abs(dx2) <= LOOP_DRAG_THRESHOLD_PX) return;
      rulerGesture.moved = true;
      const current = rulerTimeFromClientX(event.clientX, rulerGesture.rect, rulerGesture.viewStart, rulerGesture.visibleDuration);
      setLoopDrag({
        start: Math.min(rulerGesture.downTime, current),
        end: Math.max(rulerGesture.downTime, current)
      });
      return;
    }
    if (!zoomDrag || props.meta.duration <= 0) return;
    const dx = event.clientX - zoomDrag.pointerX;
    if (!zoomDrag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
    zoomDrag.moved = true;
    const nextZoom = clamp4(zoomDrag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom());
    const nextDuration = props.meta.duration / nextZoom;
    setZoom(nextZoom);
    setViewStart(clampViewStart(zoomDrag.anchorTime - zoomDrag.anchorRatio * nextDuration, props.meta.duration, nextDuration));
  };
  const finishRuler = () => {
    const gesture = rulerGesture;
    rulerGesture = null;
    zoomDrag = null;
    if (!gesture) return;
    const drag = loopDrag();
    if (gesture.moved && drag) {
      TimelineStore.setLoopRegion(props.meta.id, drag.start, drag.end);
    } else {
      TimelineStore.seek(props.meta.id, gesture.downTime);
    }
    setLoopDrag(null);
  };
  const cancelRuler = () => {
    rulerGesture = null;
    zoomDrag = null;
    setLoopDrag(null);
  };
  const handleTrackPointerDown = (event) => {
    const target = event.target;
    if (target.closest(".dialkit-timeline-label, button")) return;
    if (!event.shiftKey && target.closest(".dialkit-timeline-clip")) return;
    const rect = laneAreaRef?.getBoundingClientRect();
    if (!rect) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const reset = event.shiftKey;
    trackScrub = {
      wasPlaying: TimelineStore.getTransport(props.meta.id).playing,
      rect,
      viewStart: reset ? 0 : safeViewStart(),
      visibleDuration: reset ? props.meta.duration : visibleDuration()
    };
    if (reset) resetView();
    setPopover(null);
    TimelineStore.pause(props.meta.id);
    seekTrack(event.clientX);
  };
  const finishTrack = () => {
    if (trackScrub?.wasPlaying) TimelineStore.play(props.meta.id);
    trackScrub = null;
  };
  const handleCopy = () => {
    const normalized = normalizeTimelineValuesForCopy(DialStore.getValues(props.meta.id), props.meta.clips);
    void navigator.clipboard.writeText(buildCopyInstruction("createDialTimeline", props.meta.name, normalized));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const handleAddPreset = () => {
    DialStore.savePreset(props.meta.id, `Version ${presets().length + 2}`);
  };
  const closePopover = () => setPopover(null);
  const openClipPopover = (clip, rect, stepKey) => {
    const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
    if (getClipControls(props.meta.id, targetPath, stepKey ? void 0 : clipPopoverExclusions(clip)).length === 0) return;
    setPopover((previous) => previous?.clip.key === clip.key && previous.stepKey === stepKey ? null : {
      clip,
      stepKey,
      anchor: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      }
    });
  };
  const toggleSet = (setter, key) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const toggleTracks = (key) => toggleSet(setExpandedTracks, key);
  const toggleGroup = (key) => toggleSet(setCollapsedGroups, key);
  const handleBarClick = (clip, rect, stepKey) => {
    if (!stepKey && clip.tracks?.length) toggleTracks(clip.key);
    else openClipPopover(clip, rect, stepKey);
  };
  const ticks = createMemo3(() => {
    const rawStep = pxPerSecond() > 0 ? MAJOR_TICK_TARGET_PX / pxPerSecond() : 1;
    const adaptive = SECOND_TICK_STEPS.find((step) => step >= rawStep) ?? SECOND_TICK_STEPS[SECOND_TICK_STEPS.length - 1];
    const majorStep = zoom() < 1.5 && props.meta.duration >= 1 ? Math.max(1, adaptive) : adaptive;
    const fineStep = majorStep / 10;
    const major = [];
    const medium = [];
    const fine = [];
    const firstMajor = Math.ceil((safeViewStart() - 1e-6) / majorStep) * majorStep;
    for (let time = firstMajor; time <= viewEnd() + 1e-6; time += majorStep) {
      major.push(Number(time.toFixed(4)));
    }
    const firstFine = Math.ceil((safeViewStart() - 1e-6) / fineStep);
    const lastFine = Math.floor((viewEnd() + 1e-6) / fineStep);
    for (let index = firstFine; index <= lastFine; index++) {
      if (index % 10 === 0) continue;
      const tick = Number((index * fineStep).toFixed(6));
      if (index % 5 === 0) medium.push(tick);
      else fine.push(tick);
    }
    return {
      major,
      medium,
      fine,
      majorStep
    };
  });
  const rows = createMemo3(() => {
    const result = [];
    let lastGroup;
    const currentValues = values();
    for (const clip of props.meta.clips) {
      if (clip.group !== lastGroup) {
        lastGroup = clip.group;
        if (clip.group) {
          const group = clip.group;
          const collapsed = collapsedGroups().has(group);
          result.push((() => {
            var _el$19 = _tmpl$92(), _el$20 = _el$19.firstChild, _el$21 = _el$20.firstChild, _el$22 = _el$21.nextSibling;
            _el$21.$$click = () => toggleGroup(group);
            _$setAttribute19(_el$21, "data-open", !collapsed);
            _$setAttribute19(_el$21, "title", collapsed ? "Expand layer" : "Collapse layer");
            _$insert24(_el$21, _$createComponent24(ChevronIcon, {}));
            _$insert24(_el$22, () => formatLabel(group));
            return _el$19;
          })());
        }
      }
      if (clip.group && collapsedGroups().has(clip.group)) continue;
      const isProps = Boolean(clip.tracks?.length);
      const tracksOpen = isProps && expandedTracks().has(clip.key);
      const stat = computeClipStaticFromValues(currentValues, clip, props.meta.duration);
      const selected = popover()?.clip.key === clip.key;
      result.push((() => {
        var _el$23 = _tmpl$1(), _el$24 = _el$23.firstChild, _el$26 = _el$24.nextSibling;
        _$insert24(_el$24, _$createComponent24(Show18, {
          when: isProps,
          get children() {
            var _el$25 = _tmpl$02();
            _el$25.$$click = (event) => {
              event.stopPropagation();
              toggleTracks(clip.key);
            };
            _$setAttribute19(_el$25, "data-open", tracksOpen);
            _$setAttribute19(_el$25, "title", tracksOpen ? "Collapse properties" : "Expand properties");
            _$insert24(_el$25, _$createComponent24(ChevronIcon, {}));
            return _el$25;
          }
        }), null);
        _$insert24(_el$24, () => clip.label, null);
        _$insert24(_el$26, _$createComponent24(TimelineClip, {
          get timelineId() {
            return props.meta.id;
          },
          clip,
          get at() {
            return stat.at;
          },
          get duration() {
            return stat.duration;
          },
          get loop() {
            return stat.loop;
          },
          get steps() {
            return _$memo17(() => !!clip.stepKeys?.length)() ? stat.tracks[0]?.steps : void 0;
          },
          get fixedDuration() {
            return isProps ? true : stat.isPhysics;
          },
          composite: isProps,
          get pxPerSecond() {
            return pxPerSecond();
          },
          get viewStart() {
            return safeViewStart();
          },
          get timelineDuration() {
            return props.meta.duration;
          },
          selected,
          get selectedStepKey() {
            return selected ? popover()?.stepKey : void 0;
          },
          onClick: handleBarClick,
          onDrag: closePopover
        }));
        _$effect24(() => _$setAttribute19(_el$23, "data-grouped", clip.group ? "" : void 0));
        return _el$23;
      })());
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
        const trackSelected = popover()?.clip.key === trackKey;
        result.push((() => {
          var _el$27 = _tmpl$102(), _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling;
          _$insert24(_el$28, () => formatLabel(trackRef.prop));
          _$insert24(_el$29, _$createComponent24(TimelineClip, {
            get timelineId() {
              return props.meta.id;
            },
            clip: trackMeta,
            get at() {
              return stat.at + track.delay;
            },
            get duration() {
              return track.duration;
            },
            get loop() {
              return stat.loop;
            },
            get steps() {
              return _$memo17(() => !!trackRef.stepKeys?.length)() ? track.steps : void 0;
            },
            get fixedDuration() {
              return _$memo17(() => !!!trackRef.stepKeys?.length)() && track.steps[0]?.isPhysics === true;
            },
            get baseAt() {
              return stat.at;
            },
            delayMode: true,
            get pxPerSecond() {
              return pxPerSecond();
            },
            get viewStart() {
              return safeViewStart();
            },
            get timelineDuration() {
              return props.meta.duration;
            },
            selected: trackSelected,
            get selectedStepKey() {
              return trackSelected ? popover()?.stepKey : void 0;
            },
            onClick: openClipPopover,
            onDrag: closePopover
          }));
          _$effect24(() => _$setAttribute19(_el$27, "data-grouped", clip.group ? "" : void 0));
          return _el$27;
        })());
      }
    }
    return result;
  });
  return (() => {
    var _el$30 = _tmpl$142(), _el$31 = _el$30.firstChild, _el$32 = _el$31.firstChild, _el$33 = _el$32.firstChild, _el$34 = _el$32.nextSibling, _el$35 = _el$34.firstChild, _el$36 = _el$35.firstChild, _el$37 = _el$35.nextSibling, _el$38 = _el$37.firstChild, _el$39 = _el$37.nextSibling, _el$40 = _el$39.firstChild, _el$43 = _el$39.nextSibling;
    _$insert24(_el$33, () => props.meta.name);
    _$insert24(_el$31, _$createComponent24(Show18, {
      get when() {
        return !open();
      },
      get children() {
        return _$createComponent24(TimelineOverview, {
          get id() {
            return props.meta.id;
          },
          get duration() {
            return props.meta.duration;
          },
          get viewStart() {
            return safeViewStart();
          },
          get viewEnd() {
            return viewEnd();
          },
          onNavigate: centerViewAt
        });
      }
    }), _el$34);
    _el$35.$$click = handleClearLoopRegion;
    _$insert24(_el$36, _$createComponent24(For9, {
      each: ICON_LOOP,
      children: (path) => (() => {
        var _el$53 = _tmpl$152();
        _$setAttribute19(_el$53, "d", path);
        return _el$53;
      })()
    }));
    _$insert24(_el$34, _$createComponent24(PlayPauseButton, {
      get id() {
        return props.meta.id;
      }
    }), _el$37);
    _$insert24(_el$34, _$createComponent24(ReplayButton, {
      onReplay: handleReplay
    }), _el$37);
    _el$37.$$click = handleAddPreset;
    _$insert24(_el$38, _$createComponent24(For9, {
      each: ICON_ADD_PRESET,
      children: (path) => (() => {
        var _el$54 = _tmpl$152();
        _$setAttribute19(_el$54, "d", path);
        return _el$54;
      })()
    }));
    _$insert24(_el$34, _$createComponent24(PresetManager, {
      get panelId() {
        return props.meta.id;
      },
      get presets() {
        return presets();
      },
      get activePresetId() {
        return activePresetId();
      },
      onAdd: handleAddPreset
    }), _el$39);
    _el$39.$$click = handleCopy;
    _$insert24(_el$40, _$createComponent24(Show18, {
      get when() {
        return copied();
      },
      get fallback() {
        return (() => {
          var _el$55 = _tmpl$162(), _el$56 = _el$55.firstChild, _el$57 = _el$56.nextSibling, _el$58 = _el$57.nextSibling;
          _$effect24((_p$) => {
            var _v$24 = iconStyle, _v$25 = ICON_CLIPBOARD.board, _v$26 = ICON_CLIPBOARD.sparkle, _v$27 = ICON_CLIPBOARD.body;
            _p$.e = _$style7(_el$55, _v$24, _p$.e);
            _v$25 !== _p$.t && _$setAttribute19(_el$56, "d", _p$.t = _v$25);
            _v$26 !== _p$.a && _$setAttribute19(_el$57, "d", _p$.a = _v$26);
            _v$27 !== _p$.o && _$setAttribute19(_el$58, "d", _p$.o = _v$27);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$55;
        })();
      },
      get children() {
        var _el$41 = _tmpl$112(), _el$42 = _el$41.firstChild;
        _$setAttribute19(_el$42, "d", ICON_CHECK);
        _$effect24((_$p) => _$style7(_el$41, iconStyle, _$p));
        return _el$41;
      }
    }));
    _el$43.$$click = () => setOpen((current) => !current);
    _$insert24(_el$43, _$createComponent24(ChevronIcon, {}));
    _$insert24(_el$30, _$createComponent24(Show18, {
      get when() {
        return open();
      },
      get children() {
        var _el$44 = _tmpl$132(), _el$45 = _el$44.firstChild, _el$46 = _el$45.firstChild, _el$47 = _el$46.firstChild, _el$48 = _el$47.nextSibling;
        _el$44.addEventListener("lostpointercapture", finishTrack);
        _el$44.addEventListener("pointercancel", finishTrack);
        _el$44.$$pointerup = finishTrack;
        _el$44.$$pointermove = (event) => trackScrub && seekTrack(event.clientX);
        _el$44.$$pointerdown = handleTrackPointerDown;
        _el$44.addEventListener("wheel", handleTimelineWheel);
        _el$48.addEventListener("lostpointercapture", cancelRuler);
        _el$48.addEventListener("pointercancel", cancelRuler);
        _el$48.$$pointerup = finishRuler;
        _el$48.$$pointermove = handleRulerPointerMove;
        _el$48.$$pointerdown = handleRulerPointerDown;
        var _ref$2 = laneAreaRef;
        typeof _ref$2 === "function" ? _$use15(_ref$2, _el$48) : laneAreaRef = _el$48;
        _$insert24(_el$48, _$createComponent24(Show18, {
          get when() {
            return _$memo17(() => pxPerSecond() > 0)() && (loopDrag() ?? loopRegion());
          },
          children: (region) => {
            const left = () => (region().start - safeViewStart()) * pxPerSecond();
            const width = () => Math.max(0, (region().end - region().start) * pxPerSecond());
            return [(() => {
              var _el$59 = _tmpl$172();
              _$effect24((_$p) => _$setStyleProperty12(_el$59, "width", `${Math.max(0, left())}px`));
              return _el$59;
            })(), (() => {
              var _el$60 = _tmpl$182();
              _$effect24((_$p) => _$setStyleProperty12(_el$60, "left", `${left() + width()}px`));
              return _el$60;
            })(), (() => {
              var _el$61 = _tmpl$192();
              _$effect24((_p$) => {
                var _v$28 = loopDrag() ? "true" : void 0, _v$29 = `${left()}px`, _v$30 = `${width()}px`;
                _v$28 !== _p$.e && _$setAttribute19(_el$61, "data-live", _p$.e = _v$28);
                _v$29 !== _p$.t && _$setStyleProperty12(_el$61, "left", _p$.t = _v$29);
                _v$30 !== _p$.a && _$setStyleProperty12(_el$61, "width", _p$.a = _v$30);
                return _p$;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              });
              return _el$61;
            })()];
          }
        }), null);
        _$insert24(_el$48, _$createComponent24(For9, {
          get each() {
            return ticks().fine;
          },
          children: (time) => (() => {
            var _el$62 = _tmpl$202();
            _$effect24((_$p) => _$setStyleProperty12(_el$62, "left", `${(time - safeViewStart()) * pxPerSecond()}px`));
            return _el$62;
          })()
        }), null);
        _$insert24(_el$48, _$createComponent24(For9, {
          get each() {
            return ticks().medium;
          },
          children: (time) => (() => {
            var _el$63 = _tmpl$2110();
            _$effect24((_$p) => _$setStyleProperty12(_el$63, "left", `${(time - safeViewStart()) * pxPerSecond()}px`));
            return _el$63;
          })()
        }), null);
        _$insert24(_el$48, _$createComponent24(For9, {
          get each() {
            return ticks().major;
          },
          children: (time) => (() => {
            var _el$64 = _tmpl$222(), _el$65 = _el$64.firstChild;
            _$insert24(_el$65, () => formatRulerSeconds(time, ticks().majorStep));
            _$effect24((_$p) => _$setStyleProperty12(_el$64, "left", `${(time - safeViewStart()) * pxPerSecond()}px`));
            return _el$64;
          })()
        }), null);
        _$insert24(_el$45, rows, null);
        _$insert24(_el$45, _$createComponent24(Show18, {
          get when() {
            return pxPerSecond() > 0;
          },
          get children() {
            return _$createComponent24(TimelinePlayheadFlag, {
              get id() {
                return props.meta.id;
              },
              get duration() {
                return props.meta.duration;
              },
              get pxPerSecond() {
                return pxPerSecond();
              },
              get viewStart() {
                return safeViewStart();
              },
              get viewEnd() {
                return viewEnd();
              },
              get laneWidth() {
                return laneWidth();
              },
              ruler: laneAreaRef,
              onResetView: resetView
            });
          }
        }), null);
        _$insert24(_el$44, _$createComponent24(Show18, {
          get when() {
            return zoom() > 1;
          },
          get children() {
            var _el$49 = _tmpl$122(), _el$50 = _el$49.firstChild, _el$51 = _el$50.nextSibling, _el$52 = _el$51.firstChild;
            _el$51.addEventListener("scroll", handleHorizontalScroll);
            var _ref$3 = horizontalScrollRef;
            typeof _ref$3 === "function" ? _$use15(_ref$3, _el$51) : horizontalScrollRef = _el$51;
            _$effect24((_$p) => _$setStyleProperty12(_el$52, "width", `${laneWidth() * zoom()}px`));
            return _el$49;
          }
        }), null);
        return _el$44;
      }
    }), null);
    _$insert24(_el$30, _$createComponent24(Show18, {
      get when() {
        return popover();
      },
      children: (current) => _$createComponent24(ClipPopover, {
        get panelId() {
          return props.meta.id;
        },
        get popover() {
          return current();
        },
        get values() {
          return values();
        },
        get theme() {
          return props.theme;
        },
        onClose: closePopover
      })
    }), null);
    _$effect24((_p$) => {
      var _v$14 = open() || void 0, _v$15 = loopRegion() ? "true" : void 0, _v$16 = !loopRegion(), _v$17 = loopRegion() ? "Looping a region \xB7 click to loop the whole timeline" : "Looping the whole timeline \xB7 drag the ruler to set a loop region", _v$18 = loopRegion() ? "Clear loop region" : "Looping whole timeline", _v$19 = loopRegion() ? true : false, _v$20 = copied() ? "Copied parameters" : "Copy parameters", _v$21 = open(), _v$22 = open(), _v$23 = open() ? "Collapse timeline" : "Expand timeline";
      _v$14 !== _p$.e && _$setAttribute19(_el$31, "data-open", _p$.e = _v$14);
      _v$15 !== _p$.t && _$setAttribute19(_el$35, "data-active", _p$.t = _v$15);
      _v$16 !== _p$.a && (_el$35.disabled = _p$.a = _v$16);
      _v$17 !== _p$.o && _$setAttribute19(_el$35, "title", _p$.o = _v$17);
      _v$18 !== _p$.i && _$setAttribute19(_el$35, "aria-label", _p$.i = _v$18);
      _v$19 !== _p$.n && _$setAttribute19(_el$35, "aria-pressed", _p$.n = _v$19);
      _v$20 !== _p$.s && _$setAttribute19(_el$39, "aria-label", _p$.s = _v$20);
      _v$21 !== _p$.h && _$setAttribute19(_el$43, "data-open", _p$.h = _v$21);
      _v$22 !== _p$.r && _$setAttribute19(_el$43, "aria-expanded", _p$.r = _v$22);
      _v$23 !== _p$.d && _$setAttribute19(_el$43, "title", _p$.d = _v$23);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0
    });
    return _el$30;
  })();
}
function ChevronIcon() {
  return (() => {
    var _el$66 = _tmpl$232(), _el$67 = _el$66.firstChild;
    _$setAttribute19(_el$67, "d", ICON_CHEVRON);
    return _el$66;
  })();
}
function ClipPopover(props) {
  let ref;
  const [naturalHeight, setNaturalHeight] = createSignal23(0);
  const [viewport, setViewport] = createSignal23(readViewport());
  onMount14(() => {
    const measure = () => ref && setNaturalHeight(ref.scrollHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    if (ref) observer.observe(ref.querySelector(".dialkit-timeline-popover-body") ?? ref);
    const updateViewport = () => setViewport(readViewport());
    const outside = (event) => {
      const target = event.target;
      if (ref?.contains(target) || target.closest?.(".dialkit-timeline-clip") || target.closest?.(".dialkit-timeline-label")) return;
      props.onClose();
    };
    const keydown = (event) => {
      if (event.key === "Escape") props.onClose();
    };
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keydown);
    onCleanup19(() => {
      observer.disconnect();
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keydown);
    });
  });
  const presentation = createMemo3(() => {
    const {
      clip,
      stepKey
    } = props.popover;
    let controls;
    let title;
    if (stepKey) {
      controls = getClipControls(props.panelId, `${clip.key}.${stepKey}`);
      if (stepKey === clip.stepKeys?.[0]) {
        const from2 = getControlAt(props.panelId, `${clip.key}.from`);
        if (from2) {
          const target = `${clip.key}.${stepKey}.to`;
          const index = controls.findIndex((control) => control.path === target);
          controls = index >= 0 ? [...controls.slice(0, index), from2, ...controls.slice(index)] : [...controls, from2];
        }
      }
      title = `${clip.label} \xB7 ${formatStepLabel(stepKey)}`;
    } else {
      controls = getClipControls(props.panelId, clip.key, clipPopoverExclusions(clip));
      title = clip.label;
    }
    const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
    const durationMeta = getControlAt(props.panelId, `${targetPath}.duration`);
    const durationValue = durationMeta ? props.values[durationMeta.path] : void 0;
    const transitionDuration = durationMeta?.type === "slider" && typeof durationValue === "number" ? {
      value: durationValue,
      onChange: (next) => DialStore.updateValue(props.panelId, durationMeta.path, next),
      min: Math.max(TIMELINE_MIN_CLIP_DURATION, durationMeta.min ?? 0),
      max: durationMeta.max,
      step: durationMeta.step
    } : void 0;
    return {
      controls,
      title,
      transitionDuration,
      displayValues: timelinePopoverDisplayValues(props.values, clip.key, clip.stepKeys, stepKey)
    };
  });
  const position = createMemo3(() => {
    const current = viewport();
    const right = current.offsetLeft + current.width;
    const bottom = current.offsetTop + current.height;
    const width = Math.min(POPOVER_WIDTH, Math.max(220, current.width - 24));
    const left = clamp4(props.popover.anchor.left + props.popover.anchor.width / 2 - width / 2, current.offsetLeft + 12, Math.max(current.offsetLeft + 12, right - width - 12));
    const above = Math.max(0, props.popover.anchor.top - current.offsetTop - 22);
    const below = Math.max(0, bottom - props.popover.anchor.bottom - 22);
    const placeAbove = naturalHeight() === 0 ? above >= below : naturalHeight() <= above || naturalHeight() > below && above >= below;
    const availableHeight = placeAbove ? above : below;
    const renderedHeight = Math.min(naturalHeight() || availableHeight, availableHeight);
    const rawTop = placeAbove ? props.popover.anchor.top - 10 - renderedHeight : props.popover.anchor.bottom + 10;
    return {
      width,
      left,
      top: clamp4(rawTop, current.offsetTop + 12, Math.max(current.offsetTop + 12, bottom - renderedHeight - 12)),
      availableHeight,
      placeAbove
    };
  });
  return _$createComponent24(Show18, {
    get when() {
      return presentation().controls.length > 0;
    },
    get children() {
      return _$createComponent24(Portal7, {
        get mount() {
          return document.body;
        },
        get children() {
          var _el$68 = _tmpl$242(), _el$69 = _el$68.firstChild, _el$70 = _el$69.firstChild, _el$71 = _el$70.firstChild, _el$72 = _el$71.nextSibling, _el$73 = _el$70.nextSibling;
          var _ref$4 = ref;
          typeof _ref$4 === "function" ? _$use15(_ref$4, _el$69) : ref = _el$69;
          _$insert24(_el$71, () => presentation().title);
          _$addEventListener4(_el$72, "click", props.onClose, true);
          _$insert24(_el$73, _$createComponent24(ControlRenderer, {
            get panelId() {
              return props.panelId;
            },
            get controls() {
              return presentation().controls;
            },
            get values() {
              return presentation().displayValues;
            },
            get transitionDuration() {
              return presentation().transitionDuration;
            }
          }));
          _$effect24((_p$) => {
            var _v$31 = props.theme, _v$32 = position().placeAbove ? "above" : "below", _v$33 = `${position().left}px`, _v$34 = `${position().top}px`, _v$35 = `${position().width}px`, _v$36 = `${position().availableHeight}px`, _v$37 = naturalHeight() > 0 ? "visible" : "hidden", _v$38 = `Edit ${presentation().title}`;
            _v$31 !== _p$.e && _$setAttribute19(_el$68, "data-theme", _p$.e = _v$31);
            _v$32 !== _p$.t && _$setAttribute19(_el$69, "data-placement", _p$.t = _v$32);
            _v$33 !== _p$.a && _$setStyleProperty12(_el$69, "left", _p$.a = _v$33);
            _v$34 !== _p$.o && _$setStyleProperty12(_el$69, "top", _p$.o = _v$34);
            _v$35 !== _p$.i && _$setStyleProperty12(_el$69, "width", _p$.i = _v$35);
            _v$36 !== _p$.n && _$setStyleProperty12(_el$69, "max-height", _p$.n = _v$36);
            _v$37 !== _p$.s && _$setStyleProperty12(_el$69, "visibility", _p$.s = _v$37);
            _v$38 !== _p$.h && _$setAttribute19(_el$69, "aria-label", _p$.h = _v$38);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0,
            h: void 0
          });
          return _el$68;
        }
      });
    }
  });
}
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
function TimelineClip(props) {
  let drag = null;
  const [dragging, setDragging] = createSignal23(false);
  const isSteps = () => Boolean(props.steps?.length);
  const handlePointerDown = (event) => {
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
  };
  const handlePointerMove = (event) => {
    if (!drag || props.pxPerSecond <= 0) return;
    const dx = event.clientX - drag.pointerX;
    if (!drag.moved) {
      if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
      drag.moved = true;
      setDragging(true);
      props.onDrag();
    }
    const dt = dx / props.pxPerSecond;
    const baseAt = props.baseAt ?? 0;
    if (drag.mode === "boundary" && props.steps && drag.stepDurations) {
      const index = drag.boundaryIndex ?? 0;
      const others = drag.stepDurations.reduce((sum, duration, stepIndex) => stepIndex === index ? sum : sum + duration, 0);
      DialStore.updateValue(props.timelineId, `${props.clip.key}.${props.steps[index].key ?? ""}.duration`, clampStepResize(drag.stepDurations[index] + dt, drag.at, others, props.timelineDuration));
    } else if (drag.mode === "move") {
      if (props.delayMode) {
        DialStore.updateValue(props.timelineId, `${props.clip.key}.delay`, clampTrackDelay(drag.at + dt - baseAt, baseAt, drag.duration, props.timelineDuration));
      } else {
        DialStore.updateValue(props.timelineId, `${props.clip.key}.at`, clampClipMove(drag.at + dt, drag.duration, props.timelineDuration));
      }
    } else if (drag.mode === "end") {
      DialStore.updateValue(props.timelineId, `${props.clip.key}.duration`, clampClipResizeEnd(drag.duration + dt, drag.at, props.timelineDuration));
    } else if (props.steps && drag.stepDurations) {
      const next = clampClipResizeStart(Math.max(drag.at + dt, Math.max(baseAt, 0)), drag.at, drag.stepDurations[0]);
      DialStore.updateValues(props.timelineId, {
        [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - baseAt) : next.at,
        [`${props.clip.key}.${props.steps[0].key ?? ""}.duration`]: next.duration
      });
    } else {
      const next = clampClipResizeStart(Math.max(drag.at + dt, Math.max(baseAt, 0)), drag.at, drag.duration);
      DialStore.updateValues(props.timelineId, {
        [props.delayMode ? `${props.clip.key}.delay` : `${props.clip.key}.at`]: props.delayMode ? Math.max(0, next.at - baseAt) : next.at,
        [`${props.clip.key}.duration`]: next.duration
      });
    }
  };
  const finish = (event) => {
    const previous = drag;
    drag = null;
    setDragging(false);
    if (previous && !previous.moved && event) {
      const anchor = previous.clickEl ?? event.currentTarget;
      props.onClick(props.clip, anchor.getBoundingClientRect(), previous.clickEl?.dataset.step);
    }
  };
  const ghostCycles = createMemo3(() => {
    const cycles = [];
    if (props.loop !== "repeat" || props.duration <= 0) return cycles;
    const first = Math.max(1, Math.floor((props.viewStart - props.at) / props.duration));
    for (let offset = 0; offset < 256; offset++) {
      const index = first + offset;
      const start = props.at + props.duration * index;
      if (start >= props.timelineDuration - 1e-6) break;
      cycles.push({
        start,
        duration: Math.min(props.duration, props.timelineDuration - start),
        index
      });
    }
    return cycles;
  });
  const boundaries2 = createMemo3(() => {
    let total = 0;
    return props.steps?.map((step) => total += step.duration) ?? [];
  });
  const width = () => Math.max(props.duration * props.pxPerSecond, 14);
  const resizable = () => props.duration > 0 && !props.fixedDuration && !props.composite;
  const durationText = () => `${props.fixedDuration && !props.composite ? "~" : ""}${formatSeconds(props.duration)}`;
  const looping = () => props.loop === "repeat" && props.duration > 0;
  const title = () => props.composite ? `${props.clip.label} \u2014 composite of its property tracks${looping() ? " \xB7 repeats through timeline" : ""} \xB7 click to expand` : `${props.clip.label} \u2014 ${formatSeconds(props.at)} for ${durationText()}${props.fixedDuration ? " (duration set by spring physics)" : ""}${looping() ? " \xB7 repeats through timeline" : ""}${props.delayMode ? " \xB7 drag to phase-shift" : ""}`;
  return [_$createComponent24(For9, {
    get each() {
      return ghostCycles();
    },
    children: (cycle) => (() => {
      var _el$77 = _tmpl$282();
      _$insert24(_el$77, _$createComponent24(For9, {
        get each() {
          return props.steps;
        },
        children: (step) => (() => {
          var _el$78 = _tmpl$292();
          _$effect24((_$p) => _$setStyleProperty12(_el$78, "width", `${step.duration * props.pxPerSecond}px`));
          return _el$78;
        })()
      }));
      _$effect24((_p$) => {
        var _v$47 = isSteps() || void 0, _v$48 = `${(cycle.start - props.viewStart) * props.pxPerSecond + 1}px`, _v$49 = `${Math.max(1, cycle.duration * props.pxPerSecond - 2)}px`, _v$50 = props.clip.color;
        _v$47 !== _p$.e && _$setAttribute19(_el$77, "data-steps", _p$.e = _v$47);
        _v$48 !== _p$.t && _$setStyleProperty12(_el$77, "left", _p$.t = _v$48);
        _v$49 !== _p$.a && _$setStyleProperty12(_el$77, "width", _p$.a = _v$49);
        _v$50 !== _p$.o && _$setStyleProperty12(_el$77, "background", _p$.o = _v$50);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      });
      return _el$77;
    })()
  }), (() => {
    var _el$74 = _tmpl$262();
    _el$74.addEventListener("lostpointercapture", () => finish());
    _el$74.addEventListener("pointercancel", () => finish());
    _el$74.$$pointerup = (event) => finish(event);
    _el$74.$$pointermove = handlePointerMove;
    _el$74.$$pointerdown = handlePointerDown;
    _$insert24(_el$74, _$createComponent24(Show18, {
      get when() {
        return !props.composite;
      },
      get fallback() {
        return _$createComponent24(Show18, {
          get when() {
            return width() > 56;
          },
          get children() {
            var _el$79 = _tmpl$302();
            _$insert24(_el$79, durationText);
            return _el$79;
          }
        });
      },
      get children() {
        return _$createComponent24(Show18, {
          get when() {
            return isSteps();
          },
          get fallback() {
            return [_$createComponent24(Show18, {
              get when() {
                return resizable();
              },
              get children() {
                return _tmpl$252();
              }
            }), _$createComponent24(Show18, {
              get when() {
                return width() > 56;
              },
              get children() {
                var _el$81 = _tmpl$302();
                _$insert24(_el$81, durationText);
                return _el$81;
              }
            }), _$createComponent24(Show18, {
              get when() {
                return resizable();
              },
              get children() {
                return _tmpl$317();
              }
            })];
          },
          get children() {
            return [_$createComponent24(For9, {
              get each() {
                return props.steps;
              },
              children: (step) => {
                const segmentWidth = () => step.duration * props.pxPerSecond;
                return (() => {
                  var _el$83 = _tmpl$322();
                  _$insert24(_el$83, _$createComponent24(Show18, {
                    get when() {
                      return segmentWidth() > 52;
                    },
                    get children() {
                      var _el$84 = _tmpl$302();
                      _$insert24(_el$84, () => formatSeconds(step.duration));
                      return _el$84;
                    }
                  }));
                  _$effect24((_p$) => {
                    var _v$51 = step.key ?? void 0, _v$52 = props.selectedStepKey === step.key || void 0, _v$53 = `${segmentWidth()}px`;
                    _v$51 !== _p$.e && _$setAttribute19(_el$83, "data-step", _p$.e = _v$51);
                    _v$52 !== _p$.t && _$setAttribute19(_el$83, "data-selected", _p$.t = _v$52);
                    _v$53 !== _p$.a && _$setStyleProperty12(_el$83, "width", _p$.a = _v$53);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0,
                    a: void 0
                  });
                  return _el$83;
                })();
              }
            }), _$createComponent24(For9, {
              get each() {
                return props.steps;
              },
              children: (step, index) => _$createComponent24(Show18, {
                get when() {
                  return !step.isPhysics;
                },
                get children() {
                  var _el$85 = _tmpl$332();
                  _$effect24((_p$) => {
                    var _v$54 = index(), _v$55 = `${boundaries2()[index()] * props.pxPerSecond - 4}px`;
                    _v$54 !== _p$.e && _$setAttribute19(_el$85, "data-boundary", _p$.e = _v$54);
                    _v$55 !== _p$.t && _$setStyleProperty12(_el$85, "left", _p$.t = _v$55);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0
                  });
                  return _el$85;
                }
              })
            }), _$createComponent24(Show18, {
              get when() {
                return !props.steps?.[0]?.isPhysics;
              },
              get children() {
                return _tmpl$252();
              }
            })];
          }
        });
      }
    }));
    _$effect24((_p$) => {
      var _v$39 = isSteps() || void 0, _v$40 = props.composite || void 0, _v$41 = props.selected || void 0, _v$42 = dragging() || void 0, _v$43 = `${(props.at - props.viewStart) * props.pxPerSecond}px`, _v$44 = `${width()}px`, _v$45 = props.composite ? `${props.clip.color}80` : props.clip.color, _v$46 = title();
      _v$39 !== _p$.e && _$setAttribute19(_el$74, "data-steps", _p$.e = _v$39);
      _v$40 !== _p$.t && _$setAttribute19(_el$74, "data-composite", _p$.t = _v$40);
      _v$41 !== _p$.a && _$setAttribute19(_el$74, "data-selected", _p$.a = _v$41);
      _v$42 !== _p$.o && _$setAttribute19(_el$74, "data-dragging", _p$.o = _v$42);
      _v$43 !== _p$.i && _$setStyleProperty12(_el$74, "left", _p$.i = _v$43);
      _v$44 !== _p$.n && _$setStyleProperty12(_el$74, "width", _p$.n = _v$44);
      _v$45 !== _p$.s && _$setStyleProperty12(_el$74, "background", _p$.s = _v$45);
      _v$46 !== _p$.h && _$setAttribute19(_el$74, "title", _p$.h = _v$46);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0
    });
    return _el$74;
  })(), _$createComponent24(Show18, {
    get when() {
      return looping();
    },
    get children() {
      return _tmpl$272();
    }
  })];
}
_$delegateEvents20(["pointerdown", "click", "pointermove", "pointerup"]);

// src/solid/components/Module.tsx
import { template as _$template26 } from "solid-js/web";
import { setAttribute as _$setAttribute20 } from "solid-js/web";
import { effect as _$effect25 } from "solid-js/web";
import { createComponent as _$createComponent25 } from "solid-js/web";
import { memo as _$memo18 } from "solid-js/web";
import { insert as _$insert25 } from "solid-js/web";
var _tmpl$60 = /* @__PURE__ */ _$template26(`<div class=dialkit-module><div class=dialkit-module-header><span class=dialkit-module-title></span><div class=dialkit-module-switch></div></div><div class=dialkit-module-collapse><div class=dialkit-module-collapse-clip><div class=dialkit-module-inner>`);
var ENABLE_OPTIONS2 = [{
  value: "off",
  label: "Off"
}, {
  value: "on",
  label: "On"
}];
function Module(props) {
  return (() => {
    var _el$ = _tmpl$60(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$2.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild;
    _$insert25(_el$3, () => props.title);
    _$insert25(_el$4, _$createComponent25(SegmentedControl, {
      options: ENABLE_OPTIONS2,
      get value() {
        return props.enabled ? "on" : "off";
      },
      onChange: (v) => props.onEnabledChange(v === "on")
    }));
    _$insert25(_el$7, () => props.children);
    _$effect25(() => _$setAttribute20(_el$5, "data-open", props.enabled));
    return _el$;
  })();
}

// src/solid/components/ButtonGroup.tsx
import { template as _$template27 } from "solid-js/web";
import { delegateEvents as _$delegateEvents21 } from "solid-js/web";
import { addEventListener as _$addEventListener5 } from "solid-js/web";
import { insert as _$insert26 } from "solid-js/web";
import { createComponent as _$createComponent26 } from "solid-js/web";
import { For as For10 } from "solid-js";
var _tmpl$61 = /* @__PURE__ */ _$template27(`<div class=dialkit-button-group>`);
var _tmpl$223 = /* @__PURE__ */ _$template27(`<button class=dialkit-button>`);
function ButtonGroup(props) {
  return (() => {
    var _el$ = _tmpl$61();
    _$insert26(_el$, _$createComponent26(For10, {
      get each() {
        return props.buttons;
      },
      children: (button) => (() => {
        var _el$2 = _tmpl$223();
        _$addEventListener5(_el$2, "click", button.onClick, true);
        _$insert26(_el$2, () => button.label);
        return _el$2;
      })()
    }));
    return _el$;
  })();
}
_$delegateEvents21(["click"]);

// src/solid/components/WaveformVisualization.tsx
import { template as _$template28 } from "solid-js/web";
import { delegateEvents as _$delegateEvents22 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty13 } from "solid-js/web";
import { effect as _$effect26 } from "solid-js/web";
import { insert as _$insert27 } from "solid-js/web";
import { createComponent as _$createComponent27 } from "solid-js/web";
import { use as _$use16 } from "solid-js/web";
import { createSignal as createSignal24, mergeProps, onCleanup as onCleanup20, onMount as onMount15, Show as Show19 } from "solid-js";

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

// src/solid/components/WaveformVisualization.tsx
var _tmpl$66 = /* @__PURE__ */ _$template28(`<button type=button aria-label="Zoom out"><svg viewBox="0 0 16 16"fill=none><path d="M3.5 8h9"stroke=currentColor stroke-width=1.6 stroke-linecap=round>`);
var _tmpl$224 = /* @__PURE__ */ _$template28(`<div class=dialkit-waveform-zoom><button type=button aria-label="Zoom in"><svg viewBox="0 0 16 16"fill=none><path d="M8 3.5v9M3.5 8h9"stroke=currentColor stroke-width=1.6 stroke-linecap=round>`);
var _tmpl$318 = /* @__PURE__ */ _$template28(`<div class=dialkit-waveform-viz-wrap><canvas class=dialkit-waveform-viz>`);
function WaveformVisualization(props) {
  const p = mergeProps({
    buffer: null,
    progress: 0,
    mode: "smooth",
    border: false,
    bands: false,
    pixelSize: 1,
    grid: false,
    gridSubdivisions: 8,
    loop: null,
    autoZoomOnLoop: false,
    width: 256,
    height: 140
  }, props);
  const [zoom, setZoom] = createSignal24(1);
  let canvasEl;
  onMount15(() => {
    if (!canvasEl) return;
    const engine = createWaveformEngine(canvasEl, () => ({
      buffer: p.buffer,
      progress: p.progress,
      getProgress: p.getProgress,
      mode: p.mode,
      border: p.border,
      bands: p.bands,
      pixelSize: p.pixelSize,
      grid: p.grid,
      gridSubdivisions: p.gridSubdivisions,
      waveColor: p.waveColor,
      playheadColor: p.playheadColor,
      autoZoomOnLoop: p.autoZoomOnLoop,
      loop: p.loop,
      zoom: zoom(),
      width: p.width,
      height: p.height,
      onSeek: p.onSeek,
      onLoopChange: p.onLoopChange
    }));
    onCleanup20(() => engine.destroy());
  });
  const framingLoop = () => p.autoZoomOnLoop && !!p.loop;
  return (() => {
    var _el$ = _tmpl$318(), _el$2 = _el$.firstChild;
    var _ref$ = canvasEl;
    typeof _ref$ === "function" ? _$use16(_ref$, _el$2) : canvasEl = _el$2;
    _$insert27(_el$, _$createComponent27(Show19, {
      get when() {
        return !framingLoop();
      },
      get children() {
        var _el$3 = _tmpl$224(), _el$5 = _el$3.firstChild;
        _$insert27(_el$3, _$createComponent27(Show19, {
          get when() {
            return zoom() > 1;
          },
          get children() {
            var _el$4 = _tmpl$66();
            _el$4.$$click = () => setZoom((z) => Math.max(1, z / 2));
            return _el$4;
          }
        }), _el$5);
        _el$5.$$click = () => setZoom((z) => Math.min(WAVEFORM_MAX_ZOOM, z * 2));
        _$effect26(() => _el$5.disabled = zoom() >= WAVEFORM_MAX_ZOOM);
        return _el$3;
      }
    }), null);
    _$effect26((_p$) => {
      var _v$ = `${p.width}px`, _v$2 = `${p.width}px`, _v$3 = `${p.height}px`;
      _v$ !== _p$.e && _$setStyleProperty13(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && _$setStyleProperty13(_el$2, "width", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setStyleProperty13(_el$2, "height", _p$.a = _v$3);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
_$delegateEvents22(["click"]);

// src/solid/components/AnalyserVisualization.tsx
import { template as _$template29 } from "solid-js/web";
import { delegateEvents as _$delegateEvents23 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty14 } from "solid-js/web";
import { insert as _$insert28 } from "solid-js/web";
import { createComponent as _$createComponent28 } from "solid-js/web";
import { setAttribute as _$setAttribute21 } from "solid-js/web";
import { effect as _$effect27 } from "solid-js/web";
import { memo as _$memo19 } from "solid-js/web";
import { use as _$use17 } from "solid-js/web";
import { mergeProps as mergeProps2, onCleanup as onCleanup21, onMount as onMount16, Show as Show20 } from "solid-js";

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
    const h = Math.min(remaining, SPRING_MAX_STEP);
    remaining -= h;
    for (let i = 0; i < pos.length; i++) {
      const accel = -stiffness * (pos[i] - targets[i]) - damping * vel[i];
      vel[i] += accel * h;
      pos[i] += vel[i] * h;
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

// src/solid/components/AnalyserVisualization.tsx
var _tmpl$67 = /* @__PURE__ */ _$template29(`<button type=button aria-label=Mute>M`);
var _tmpl$225 = /* @__PURE__ */ _$template29(`<button type=button aria-label=Solo>S`);
var _tmpl$319 = /* @__PURE__ */ _$template29(`<div class=dialkit-analyser-actions>`);
var _tmpl$412 = /* @__PURE__ */ _$template29(`<div class=dialkit-analyser-viz-wrap><canvas class=dialkit-analyser-viz>`);
function AnalyserVisualization(props) {
  const p = mergeProps2({
    analyser: null,
    source: "frequency",
    variant: "area",
    mode: "smooth",
    pixelSize: 1,
    scale: "log",
    spring: false,
    grid: false,
    gridSubdivisions: 8,
    muted: false,
    soloed: false,
    width: 256,
    height: 140
  }, props);
  let canvasEl;
  onMount16(() => {
    if (!canvasEl) return;
    const engine = createAnalyserEngine(canvasEl, () => ({
      analyser: p.analyser,
      source: p.source,
      variant: p.variant,
      mode: p.mode,
      pixelSize: p.pixelSize,
      scale: p.scale,
      spring: p.spring,
      grid: p.grid,
      gridSubdivisions: p.gridSubdivisions,
      waveColor: p.waveColor,
      fillColor: p.fillColor,
      muted: p.muted,
      width: p.width,
      height: p.height
    }));
    onCleanup21(() => engine.destroy());
  });
  return (() => {
    var _el$ = _tmpl$412(), _el$2 = _el$.firstChild;
    var _ref$ = canvasEl;
    typeof _ref$ === "function" ? _$use17(_ref$, _el$2) : canvasEl = _el$2;
    _$insert28(_el$, _$createComponent28(Show20, {
      get when() {
        return p.onMuteChange || p.onSoloChange;
      },
      get children() {
        var _el$3 = _tmpl$319();
        _$insert28(_el$3, _$createComponent28(Show20, {
          get when() {
            return p.onMuteChange;
          },
          get children() {
            var _el$4 = _tmpl$67();
            _el$4.$$click = () => p.onMuteChange?.(!p.muted);
            _$effect27(() => _$setAttribute21(_el$4, "aria-pressed", p.muted));
            return _el$4;
          }
        }), null);
        _$insert28(_el$3, _$createComponent28(Show20, {
          get when() {
            return p.onSoloChange;
          },
          get children() {
            var _el$5 = _tmpl$225();
            _el$5.$$click = () => p.onSoloChange?.(!p.soloed);
            _$effect27(() => _$setAttribute21(_el$5, "aria-pressed", p.soloed));
            return _el$5;
          }
        }), null);
        return _el$3;
      }
    }), null);
    _$effect27((_p$) => {
      var _v$ = `${p.width}px`, _v$2 = `${p.width}px`, _v$3 = `${p.height}px`;
      _v$ !== _p$.e && _$setStyleProperty14(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && _$setStyleProperty14(_el$2, "width", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setStyleProperty14(_el$2, "height", _p$.a = _v$3);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
_$delegateEvents23(["click"]);

// src/solid/components/CurveComposer.tsx
import { template as _$template30 } from "solid-js/web";
import { delegateEvents as _$delegateEvents24 } from "solid-js/web";
import { setAttribute as _$setAttribute22 } from "solid-js/web";
import { setStyleProperty as _$setStyleProperty15 } from "solid-js/web";
import { effect as _$effect28 } from "solid-js/web";
import { insert as _$insert29 } from "solid-js/web";
import { memo as _$memo20 } from "solid-js/web";
import { createComponent as _$createComponent29 } from "solid-js/web";
import { use as _$use18 } from "solid-js/web";
import { createMemo as createMemo4, createSignal as createSignal25, For as For11, mergeProps as mergeProps3, onCleanup as onCleanup22, onMount as onMount17, Show as Show21 } from "solid-js";

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

// src/solid/components/CurveComposer.tsx
var _tmpl$68 = /* @__PURE__ */ _$template30(`<div class=dialkit-cc-wrap><svg class=dialkit-cc><rect class=dialkit-cc-lane rx=8></rect><line class=dialkit-cc-playhead x1=0 x2=0></line><circle class=dialkit-cc-dot cx=0 r=3>`);
var _tmpl$226 = /* @__PURE__ */ _$template30(`<svg><line class=dialkit-cc-grid></svg>`, false, true, false);
var _tmpl$320 = /* @__PURE__ */ _$template30(`<svg><rect class=dialkit-cc-seg-selected rx=8></svg>`, false, true, false);
var _tmpl$413 = /* @__PURE__ */ _$template30(`<svg><rect class=dialkit-cc-seg-hover rx=8></svg>`, false, true, false);
var _tmpl$510 = /* @__PURE__ */ _$template30(`<svg><g><line class=dialkit-cc-diagonal></line><path class=dialkit-cc-curve></path><text class=dialkit-cc-label></svg>`, false, true, false);
var _tmpl$69 = /* @__PURE__ */ _$template30(`<svg><path class=dialkit-cc-connector></svg>`, false, true, false);
var _tmpl$73 = /* @__PURE__ */ _$template30(`<svg><line class=dialkit-cc-boundary></svg>`, false, true, false);
var _tmpl$83 = /* @__PURE__ */ _$template30(`<svg><rect class=dialkit-cc-lane rx=8></svg>`, false, true, false);
var _tmpl$93 = /* @__PURE__ */ _$template30(`<svg><rect class=dialkit-cc-seg-hover x=0 rx=8></svg>`, false, true, false);
var _tmpl$03 = /* @__PURE__ */ _$template30(`<svg><path class="dialkit-cc-curve dialkit-cc-curve-driver"></svg>`, false, true, false);
var _tmpl$110 = /* @__PURE__ */ _$template30(`<svg><text class=dialkit-cc-label>driver \xB7 </svg>`, false, true, false);
var _tmpl$103 = /* @__PURE__ */ _$template30(`<svg><line class=dialkit-cc-playhead x1=0 x2=0></svg>`, false, true, false);
var _tmpl$113 = /* @__PURE__ */ _$template30(`<svg><line class=dialkit-cc-diagonal></svg>`, false, true, false);
function CurveComposer(props) {
  const p = mergeProps3({
    driver: null,
    direction: "forward",
    phase: 0,
    mode: "continuous",
    triggerSteps: DEFAULT_TRIGGER_STEPS,
    selectedIndex: null,
    gap: 0,
    grid: false,
    gridSubdivisions: 8,
    width: 256,
    height: 140
  }, props);
  const layout = createMemo4(() => composerLayout(p.width, p.height, p.driver != null));
  const W = () => layout().W;
  const totalH = () => layout().totalH;
  const mainRect = () => layout().mainRect;
  const driverRect = () => layout().driverRect;
  const composition = createMemo4(() => ({
    segments: p.segments,
    driver: p.driver,
    direction: p.direction,
    gap: p.gap
  }));
  const samplers = createMemo4(() => buildSamplers(composition()));
  let svgEl;
  let seriesPlayheadEl;
  let seriesDotEl;
  let driverPlayheadEl;
  let drag = null;
  const [hover, setHover] = createSignal25(null);
  onMount17(() => {
    let raf = 0;
    let prevTrigValue = Number.NaN;
    let armKey = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const lo = layout();
      const key = `${lo.W}|${lo.totalH}`;
      if (key !== armKey) {
        prevTrigValue = Number.NaN;
        armKey = key;
      }
      const u = p.getPhase ? p.getPhase() : p.phase;
      const read = readComposition(composition(), u, samplers());
      const geo = playheadGeometry(read, lo);
      if (seriesPlayheadEl) {
        seriesPlayheadEl.setAttribute("x1", String(geo.seriesX));
        seriesPlayheadEl.setAttribute("x2", String(geo.seriesX));
      }
      if (seriesDotEl) {
        seriesDotEl.setAttribute("cx", String(geo.dotX));
        seriesDotEl.setAttribute("cy", String(geo.dotY));
      }
      if (driverPlayheadEl) {
        driverPlayheadEl.setAttribute("x1", String(geo.driverX));
        driverPlayheadEl.setAttribute("x2", String(geo.driverX));
      }
      if (p.mode === "trigger") {
        if (!Number.isNaN(prevTrigValue)) {
          for (const idx of triggersCrossed(prevTrigValue, read.value, p.triggerSteps)) p.onTrigger?.(idx);
        }
        prevTrigValue = read.value;
      } else {
        prevTrigValue = Number.NaN;
      }
    };
    raf = requestAnimationFrame(tick);
    onCleanup22(() => cancelAnimationFrame(raf));
  });
  const hitLayout = () => {
    const dr = driverRect();
    return {
      totalH: totalH(),
      driverY: dr ? dr.y : null,
      gap: p.gap
    };
  };
  const localCoords = (clientX, clientY) => {
    const rect = svgEl.getBoundingClientRect();
    return {
      ...toLocalCoords(clientX, clientY, rect, totalH()),
      rectW: rect.width
    };
  };
  const onPointerDown = (e) => {
    const {
      xN,
      py,
      rectW
    } = localCoords(e.clientX, e.clientY);
    try {
      svgEl?.setPointerCapture(e.pointerId);
    } catch {
    }
    const header = headerHit(xN, py, p.segments, hitLayout());
    if (typeof header === "number") {
      drag = {
        kind: "select",
        index: header,
        startX: e.clientX,
        startY: e.clientY,
        moved: false
      };
      return;
    }
    const target = pointerTarget(xN, py, p.segments, hitLayout(), EDGE_HIT2 / rectW);
    if (target.kind === "driver") {
      drag = {
        kind: "driver",
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: p.driver.curvature,
        baseSteepness: p.driver.steepness,
        moved: false
      };
    } else if (target.kind === "boundary") {
      drag = {
        kind: "boundary",
        index: target.index,
        startX: e.clientX,
        startY: e.clientY,
        base: composition(),
        moved: false
      };
    } else {
      const seg = p.segments[target.index];
      drag = {
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
    const d = drag;
    if (!d) {
      const {
        xN,
        py,
        rectW: rectW2
      } = localCoords(e.clientX, e.clientY);
      if (typeof headerHit(xN, py, p.segments, hitLayout()) === "number") {
        setHover({
          kind: "header",
          index: 0
        });
        return;
      }
      const t = pointerTarget(xN, py, p.segments, hitLayout(), EDGE_HIT2 / rectW2);
      setHover(t.kind === "driver" ? {
        kind: "driver",
        index: 0
      } : {
        kind: t.kind,
        index: t.index
      });
      return;
    }
    const svgRect = svgEl.getBoundingClientRect();
    const rectW = svgRect.width;
    const rectH = svgRect.height;
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD2;
    if (!moved) return;
    if (d.kind === "boundary") {
      const deltaFrac = (e.clientX - d.startX) / rectW;
      const next = redistributeWeight(d.base, d.index, deltaFrac);
      p.onSegmentsChange?.(next.segments);
      d.moved = true;
    } else if (d.kind === "segment") {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applySegmentBodyDrag(composition(), d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      p.onSegmentsChange?.(next.segments);
      d.moved = true;
    } else if (d.kind === "driver") {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applyDriverBodyDrag(composition(), d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      if (next.driver) p.onDriverChange?.(next.driver);
      d.moved = true;
    } else {
      d.moved = true;
    }
  };
  const onPointerUp = (e) => {
    const d = drag;
    drag = null;
    try {
      svgEl?.releasePointerCapture(e.pointerId);
    } catch {
    }
    if (!d || d.moved) return;
    if (d.kind === "select") {
      p.onSelect?.(d.index);
    } else if (d.kind === "driver") {
      const next = cycleDriverType(composition());
      if (next.driver) p.onDriverChange?.(next.driver);
    } else if (d.kind === "segment") {
      p.onSegmentsChange?.(cycleSegmentType(composition(), d.index).segments);
    }
  };
  const onPointerCancel = (e) => {
    drag = null;
    try {
      svgEl?.releasePointerCapture(e.pointerId);
    } catch {
    }
  };
  const onDoubleClick = (e) => {
    const {
      xN,
      py
    } = localCoords(e.clientX, e.clientY);
    const dr = driverRect();
    if (dr && py >= dr.y) return;
    p.onSegmentsChange?.(splitSegment(composition(), segmentIndexAt(xN, p.segments, p.gap)).segments);
  };
  const cursor = () => {
    const h = hover();
    const activeKind = drag?.kind ?? h?.kind;
    return activeKind === "boundary" ? "ew-resize" : activeKind === "segment" || activeKind === "driver" ? "move" : activeKind === "select" || activeKind === "header" ? "pointer" : "default";
  };
  const interior = () => boundaries(p.segments, p.gap);
  const laneGridLines = (rect) => {
    if (!p.grid) return [];
    const n = Math.max(1, Math.round(p.gridSubdivisions));
    const lines = [];
    for (let i = 1; i < n; i++) {
      lines.push({
        gx: i / n * W(),
        y1: rect.y,
        y2: rect.y + rect.h
      });
    }
    return lines;
  };
  return (() => {
    var _el$ = _tmpl$68(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling;
    _el$2.$$dblclick = onDoubleClick;
    _el$2.addEventListener("pointerleave", () => !drag && setHover(null));
    _el$2.addEventListener("pointercancel", onPointerCancel);
    _el$2.$$pointerup = onPointerUp;
    _el$2.$$pointermove = onPointerMove;
    _el$2.$$pointerdown = onPointerDown;
    var _ref$ = svgEl;
    typeof _ref$ === "function" ? _$use18(_ref$, _el$2) : svgEl = _el$2;
    _$insert29(_el$2, _$createComponent29(For11, {
      get each() {
        return laneGridLines(mainRect());
      },
      children: (g) => (() => {
        var _el$6 = _tmpl$226();
        _$effect28((_p$) => {
          var _v$16 = g.gx, _v$17 = g.y1, _v$18 = g.gx, _v$19 = g.y2;
          _v$16 !== _p$.e && _$setAttribute22(_el$6, "x1", _p$.e = _v$16);
          _v$17 !== _p$.t && _$setAttribute22(_el$6, "y1", _p$.t = _v$17);
          _v$18 !== _p$.a && _$setAttribute22(_el$6, "x2", _p$.a = _v$18);
          _v$19 !== _p$.o && _$setAttribute22(_el$6, "y2", _p$.o = _v$19);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$6;
      })()
    }), _el$4);
    _$insert29(_el$2, _$createComponent29(Show21, {
      get when() {
        return _$memo20(() => !!(p.selectedIndex != null && p.selectedIndex >= 0))() && p.selectedIndex < p.segments.length;
      },
      get children() {
        return (() => {
          const span = segmentSpan(p.segments, p.selectedIndex, p.gap);
          const mr = mainRect();
          return (() => {
            var _el$7 = _tmpl$320();
            _$effect28((_p$) => {
              var _v$20 = span[0] * W(), _v$21 = mr.y, _v$22 = (span[1] - span[0]) * W(), _v$23 = mr.h;
              _v$20 !== _p$.e && _$setAttribute22(_el$7, "x", _p$.e = _v$20);
              _v$21 !== _p$.t && _$setAttribute22(_el$7, "y", _p$.t = _v$21);
              _v$22 !== _p$.a && _$setAttribute22(_el$7, "width", _p$.a = _v$22);
              _v$23 !== _p$.o && _$setAttribute22(_el$7, "height", _p$.o = _v$23);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            });
            return _el$7;
          })();
        })();
      }
    }), _el$4);
    _$insert29(_el$2, _$createComponent29(Show21, {
      get when() {
        return hover()?.kind === "segment" && !drag;
      },
      get children() {
        return (() => {
          const span = segmentSpan(p.segments, hover().index, p.gap);
          const mr = mainRect();
          return (() => {
            var _el$8 = _tmpl$413();
            _$effect28((_p$) => {
              var _v$24 = span[0] * W(), _v$25 = mr.y, _v$26 = (span[1] - span[0]) * W(), _v$27 = mr.h;
              _v$24 !== _p$.e && _$setAttribute22(_el$8, "x", _p$.e = _v$24);
              _v$25 !== _p$.t && _$setAttribute22(_el$8, "y", _p$.t = _v$25);
              _v$26 !== _p$.a && _$setAttribute22(_el$8, "width", _p$.a = _v$26);
              _v$27 !== _p$.o && _$setAttribute22(_el$8, "height", _p$.o = _v$27);
              return _p$;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            });
            return _el$8;
          })();
        })();
      }
    }), _el$4);
    _$insert29(_el$2, _$createComponent29(For11, {
      get each() {
        return p.segments;
      },
      children: (seg, i) => {
        const span = () => segmentSpan(p.segments, i(), p.gap);
        const mr = () => mainRect();
        const diag = () => diagonalLine(mr(), span(), W());
        return (() => {
          var _el$9 = _tmpl$510(), _el$0 = _el$9.firstChild, _el$1 = _el$0.nextSibling, _el$10 = _el$1.nextSibling;
          _$insert29(_el$10, () => seg.type);
          _$effect28((_p$) => {
            var _v$28 = diag().x1, _v$29 = diag().y1, _v$30 = diag().x2, _v$31 = diag().y2, _v$32 = curvePath(seg, mr(), span(), W()), _v$33 = (span()[0] + span()[1]) * 0.5 * W(), _v$34 = mr().y + 13;
            _v$28 !== _p$.e && _$setAttribute22(_el$0, "x1", _p$.e = _v$28);
            _v$29 !== _p$.t && _$setAttribute22(_el$0, "y1", _p$.t = _v$29);
            _v$30 !== _p$.a && _$setAttribute22(_el$0, "x2", _p$.a = _v$30);
            _v$31 !== _p$.o && _$setAttribute22(_el$0, "y2", _p$.o = _v$31);
            _v$32 !== _p$.i && _$setAttribute22(_el$1, "d", _p$.i = _v$32);
            _v$33 !== _p$.n && _$setAttribute22(_el$10, "x", _p$.n = _v$33);
            _v$34 !== _p$.s && _$setAttribute22(_el$10, "y", _p$.s = _v$34);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0,
            s: void 0
          });
          return _el$9;
        })();
      }
    }), _el$4);
    _$insert29(_el$2, _$createComponent29(Show21, {
      get when() {
        return p.gap > 0;
      },
      get children() {
        return _$createComponent29(For11, {
          get each() {
            return timelineSlots(p.segments, p.gap).filter((slot) => slot.kind === "gap" && slot.b > slot.a);
          },
          children: (slot) => (() => {
            var _el$11 = _tmpl$69();
            _$effect28(() => _$setAttribute22(_el$11, "d", connectorPath(slot, samplers(), p.segments.length, mainRect(), W())));
            return _el$11;
          })()
        });
      }
    }), _el$4);
    _$insert29(_el$2, _$createComponent29(For11, {
      get each() {
        return interior();
      },
      children: (bx, i) => {
        const mr = mainRect();
        const active = () => {
          const h = hover();
          return h?.kind === "boundary" && h.index === i() || drag?.kind === "boundary" && drag.index === i();
        };
        return (() => {
          var _el$12 = _tmpl$73();
          _$effect28((_p$) => {
            var _v$35 = String(active()), _v$36 = bx * W(), _v$37 = mr.y, _v$38 = bx * W(), _v$39 = mr.y + mr.h;
            _v$35 !== _p$.e && _$setAttribute22(_el$12, "data-active", _p$.e = _v$35);
            _v$36 !== _p$.t && _$setAttribute22(_el$12, "x1", _p$.t = _v$36);
            _v$37 !== _p$.a && _$setAttribute22(_el$12, "y1", _p$.a = _v$37);
            _v$38 !== _p$.o && _$setAttribute22(_el$12, "x2", _p$.o = _v$38);
            _v$39 !== _p$.i && _$setAttribute22(_el$12, "y2", _p$.i = _v$39);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          });
          return _el$12;
        })();
      }
    }), _el$4);
    var _ref$2 = seriesPlayheadEl;
    typeof _ref$2 === "function" ? _$use18(_ref$2, _el$4) : seriesPlayheadEl = _el$4;
    var _ref$3 = seriesDotEl;
    typeof _ref$3 === "function" ? _$use18(_ref$3, _el$5) : seriesDotEl = _el$5;
    _$insert29(_el$2, _$createComponent29(Show21, {
      get when() {
        return driverRect();
      },
      children: (dr) => [(() => {
        var _el$13 = _tmpl$83();
        _$effect28((_p$) => {
          var _v$40 = dr().x, _v$41 = dr().y, _v$42 = dr().w, _v$43 = dr().h;
          _v$40 !== _p$.e && _$setAttribute22(_el$13, "x", _p$.e = _v$40);
          _v$41 !== _p$.t && _$setAttribute22(_el$13, "y", _p$.t = _v$41);
          _v$42 !== _p$.a && _$setAttribute22(_el$13, "width", _p$.a = _v$42);
          _v$43 !== _p$.o && _$setAttribute22(_el$13, "height", _p$.o = _v$43);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$13;
      })(), _$createComponent29(For11, {
        get each() {
          return laneGridLines(dr());
        },
        children: (g) => (() => {
          var _el$19 = _tmpl$226();
          _$effect28((_p$) => {
            var _v$52 = g.gx, _v$53 = g.y1, _v$54 = g.gx, _v$55 = g.y2;
            _v$52 !== _p$.e && _$setAttribute22(_el$19, "x1", _p$.e = _v$52);
            _v$53 !== _p$.t && _$setAttribute22(_el$19, "y1", _p$.t = _v$53);
            _v$54 !== _p$.a && _$setAttribute22(_el$19, "x2", _p$.a = _v$54);
            _v$55 !== _p$.o && _$setAttribute22(_el$19, "y2", _p$.o = _v$55);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$19;
        })()
      }), _$createComponent29(Show21, {
        get when() {
          return hover()?.kind === "driver" && !drag;
        },
        get children() {
          var _el$14 = _tmpl$93();
          _$effect28((_p$) => {
            var _v$44 = dr().y, _v$45 = W(), _v$46 = dr().h;
            _v$44 !== _p$.e && _$setAttribute22(_el$14, "y", _p$.e = _v$44);
            _v$45 !== _p$.t && _$setAttribute22(_el$14, "width", _p$.t = _v$45);
            _v$46 !== _p$.a && _$setAttribute22(_el$14, "height", _p$.a = _v$46);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          });
          return _el$14;
        }
      }), _$memo20(() => {
        const diag = diagonalLine(dr(), [0, 1], W());
        return (() => {
          var _el$20 = _tmpl$113();
          _$effect28((_p$) => {
            var _v$56 = diag.x1, _v$57 = diag.y1, _v$58 = diag.x2, _v$59 = diag.y2;
            _v$56 !== _p$.e && _$setAttribute22(_el$20, "x1", _p$.e = _v$56);
            _v$57 !== _p$.t && _$setAttribute22(_el$20, "y1", _p$.t = _v$57);
            _v$58 !== _p$.a && _$setAttribute22(_el$20, "x2", _p$.a = _v$58);
            _v$59 !== _p$.o && _$setAttribute22(_el$20, "y2", _p$.o = _v$59);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$20;
        })();
      }), (() => {
        var _el$15 = _tmpl$03();
        _$effect28(() => _$setAttribute22(_el$15, "d", curvePath(p.driver, dr(), [0, 1], W())));
        return _el$15;
      })(), (() => {
        var _el$16 = _tmpl$110(), _el$17 = _el$16.firstChild;
        _$insert29(_el$16, () => p.driver.type, null);
        _$effect28((_p$) => {
          var _v$47 = W() * 0.5, _v$48 = dr().y + 13;
          _v$47 !== _p$.e && _$setAttribute22(_el$16, "x", _p$.e = _v$47);
          _v$48 !== _p$.t && _$setAttribute22(_el$16, "y", _p$.t = _v$48);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$16;
      })(), (() => {
        var _el$18 = _tmpl$103();
        var _ref$4 = driverPlayheadEl;
        typeof _ref$4 === "function" ? _$use18(_ref$4, _el$18) : driverPlayheadEl = _el$18;
        _$effect28((_p$) => {
          var _v$49 = dr().y, _v$50 = dr().y + dr().h, _v$51 = p.playheadColor;
          _v$49 !== _p$.e && _$setAttribute22(_el$18, "y1", _p$.e = _v$49);
          _v$50 !== _p$.t && _$setAttribute22(_el$18, "y2", _p$.t = _v$50);
          _v$51 !== _p$.a && _$setStyleProperty15(_el$18, "stroke", _p$.a = _v$51);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$18;
      })()]
    }), null);
    _$effect28((_p$) => {
      var _v$ = `${W()}px`, _v$2 = `0 0 ${W()} ${totalH()}`, _v$3 = W(), _v$4 = totalH(), _v$5 = `${W()}px`, _v$6 = `${totalH()}px`, _v$7 = cursor(), _v$8 = p.curveColor, _v$9 = mainRect().x, _v$0 = mainRect().y, _v$1 = mainRect().w, _v$10 = mainRect().h, _v$11 = mainRect().y, _v$12 = mainRect().y + mainRect().h, _v$13 = p.playheadColor, _v$14 = mapY(mainRect(), 0), _v$15 = p.playheadColor;
      _v$ !== _p$.e && _$setStyleProperty15(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && _$setAttribute22(_el$2, "viewBox", _p$.t = _v$2);
      _v$3 !== _p$.a && _$setAttribute22(_el$2, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && _$setAttribute22(_el$2, "height", _p$.o = _v$4);
      _v$5 !== _p$.i && _$setStyleProperty15(_el$2, "width", _p$.i = _v$5);
      _v$6 !== _p$.n && _$setStyleProperty15(_el$2, "height", _p$.n = _v$6);
      _v$7 !== _p$.s && _$setStyleProperty15(_el$2, "cursor", _p$.s = _v$7);
      _v$8 !== _p$.h && _$setStyleProperty15(_el$2, "color", _p$.h = _v$8);
      _v$9 !== _p$.r && _$setAttribute22(_el$3, "x", _p$.r = _v$9);
      _v$0 !== _p$.d && _$setAttribute22(_el$3, "y", _p$.d = _v$0);
      _v$1 !== _p$.l && _$setAttribute22(_el$3, "width", _p$.l = _v$1);
      _v$10 !== _p$.u && _$setAttribute22(_el$3, "height", _p$.u = _v$10);
      _v$11 !== _p$.c && _$setAttribute22(_el$4, "y1", _p$.c = _v$11);
      _v$12 !== _p$.w && _$setAttribute22(_el$4, "y2", _p$.w = _v$12);
      _v$13 !== _p$.m && _$setStyleProperty15(_el$4, "stroke", _p$.m = _v$13);
      _v$14 !== _p$.f && _$setAttribute22(_el$5, "cy", _p$.f = _v$14);
      _v$15 !== _p$.y && _$setStyleProperty15(_el$5, "fill", _p$.y = _v$15);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0,
      m: void 0,
      f: void 0,
      y: void 0
    });
    return _el$;
  })();
}
_$delegateEvents24(["pointerdown", "pointermove", "pointerup", "dblclick"]);
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
  Module,
  PresetManager,
  RangeSlider,
  SegmentedControl,
  SelectControl,
  Slider,
  SpringControl,
  SpringVisualization,
  TextControl,
  TimelineToggleButton,
  Toggle,
  TransitionControl,
  WaveformVisualization,
  XYControl,
  XYPad,
  XY_DEFAULT_STEP,
  XY_DETENT_PX,
  applyDetentAxis,
  centerValue,
  clamp2 as clamp,
  createDialKit,
  createDialTimeline,
  gradientToCss,
  invertY,
  normToValue,
  normalizeValue,
  nudge,
  pointFromValue,
  resolveAxis,
  snapToStep,
  valueFromPoint,
  valueToNorm
};
//# sourceMappingURL=index.js.map