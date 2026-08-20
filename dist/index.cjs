"use client";
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AnalyserVisualization: () => AnalyserVisualization,
  AudioLevelMeter: () => AudioLevelMeter,
  ButtonGroup: () => ButtonGroup,
  COLOR_FORMATS: () => COLOR_FORMATS,
  CURVE_CYCLE: () => CURVE_CYCLE,
  CURVE_DEFAULT_HEIGHT: () => CURVE_DEFAULT_HEIGHT,
  CURVE_FIT_PADDING: () => CURVE_FIT_PADDING,
  CURVE_MAX_HEIGHT: () => CURVE_MAX_HEIGHT,
  CURVE_MIN_HEIGHT: () => CURVE_MIN_HEIGHT,
  CURVE_SAMPLE_COUNT: () => CURVE_SAMPLE_COUNT,
  Checkbox: () => Checkbox,
  ChipsControl: () => ChipsControl,
  ColorControl: () => ColorControl,
  ColorPickerPanel: () => ColorPickerPanel,
  ControlRenderer: () => ControlRenderer,
  ControlShell: () => ControlShell,
  CurveComposer: () => CurveComposer,
  CurvePreview: () => CurvePreview,
  DEFAULT_GRADIENT: () => DEFAULT_GRADIENT,
  DEFAULT_TRIGGER_STEPS: () => DEFAULT_TRIGGER_STEPS,
  DialRoot: () => DialRoot,
  DialStore: () => DialStore,
  DialTimeline: () => DialTimeline,
  EasingVisualization: () => EasingVisualization,
  FileControl: () => FileControl,
  Folder: () => Folder,
  GalleryControl: () => GalleryControl,
  GradientControl: () => GradientControl,
  GradientPanel: () => GradientPanel,
  ListControl: () => ListControl,
  MIN_STOPS: () => MIN_STOPS,
  Module: () => Module,
  MultiSelectControl: () => MultiSelectControl,
  NumberControl: () => NumberControl,
  PresetManager: () => PresetManager,
  RangeSlider: () => RangeSlider,
  SegmentedControl: () => SegmentedControl,
  SelectControl: () => SelectControl,
  ShortcutsMenu: () => ShortcutsMenu,
  Slider: () => Slider,
  SpringControl: () => SpringControl,
  SpringVisualization: () => SpringVisualization,
  SwatchControl: () => SwatchControl,
  TAB_PATH: () => TAB_PATH,
  TextControl: () => TextControl,
  TimelineStore: () => TimelineStore,
  Toggle: () => Toggle,
  TransitionControl: () => TransitionControl,
  WaveformVisualization: () => WaveformVisualization,
  XYControl: () => XYControl,
  XYPad: () => XYPad,
  XY_DEFAULT_STEP: () => XY_DEFAULT_STEP,
  XY_DETENT_PX: () => XY_DETENT_PX,
  addDriver: () => addDriver,
  addStop: () => addStop,
  applyDetentAxis: () => applyDetentAxis,
  buildSamplers: () => buildSamplers,
  centerValue: () => centerValue,
  clamp: () => clamp3,
  clampCurveHeight: () => clampCurveHeight,
  clampOklchToSrgb: () => clampOklchToSrgb,
  clampRange: () => clampRange,
  colorAtPosition: () => colorAtPosition,
  curvePathData: () => curvePathData,
  curveY: () => curveY,
  cycleDriverType: () => cycleDriverType,
  cycleSegmentType: () => cycleSegmentType,
  defaultComposition: () => defaultComposition,
  defaultListItemParams: () => defaultListItemParams,
  displayHex: () => displayHex,
  flipDriver: () => flipDriver,
  flipDriverX: () => flipDriverX,
  flipDriverY: () => flipDriverY,
  flipSegment: () => flipSegment,
  flipSegmentX: () => flipSegmentX,
  flipSegmentY: () => flipSegmentY,
  formatClock: () => formatClock,
  formatHex: () => formatHex,
  gradientFillBox: () => gradientFillBox,
  gradientToCss: () => gradientToCss,
  gradientToTransform: () => gradientToTransform,
  groupListFields: () => groupListFields,
  handleLeftStyles: () => handleLeftStyles,
  hintDomId: () => hintDomId,
  hslToRgb: () => hslToRgb,
  hsvToRgb: () => hsvToRgb,
  invertY: () => invertY,
  isOutsideSpan: () => isOutsideSpan,
  moveStop: () => moveStop,
  nearestHandle: () => nearestHandle,
  normToValue: () => normToValue,
  normalizeCurveMarkers: () => normalizeCurveMarkers,
  normalizeGradient: () => normalizeGradient,
  normalizeHex: () => normalizeHex,
  normalizeListItems: () => normalizeListItems,
  normalizeValue: () => normalizeValue,
  nudge: () => nudge,
  oklchToRgb: () => oklchToRgb,
  opacityPercent: () => opacityPercent,
  orderRange: () => orderRange,
  parseHex: () => parseHex,
  parseListItemSchema: () => parseListItemSchema,
  percentToValue: () => percentToValue,
  pickDragTarget: () => pickDragTarget,
  plotCurve: () => plotCurve,
  pointFromValue: () => pointFromValue,
  readComposition: () => readComposition,
  redistributeWeight: () => redistributeWeight,
  removeDriver: () => removeDriver,
  removeSegment: () => removeSegment,
  removeStop: () => removeStop,
  resolveAxis: () => resolveAxis,
  rgbToHsl: () => rgbToHsl,
  rgbToHsv: () => rgbToHsv,
  rgbToOklch: () => rgbToOklch,
  setDriverAnticipate: () => setDriverAnticipate,
  setDriverCurvature: () => setDriverCurvature,
  setDriverOvershoot: () => setDriverOvershoot,
  setDriverSteepness: () => setDriverSteepness,
  setGradientAngle: () => setGradientAngle,
  setGradientCenter: () => setGradientCenter,
  setGradientRotation: () => setGradientRotation,
  setGradientScale: () => setGradientScale,
  setGradientSquash: () => setGradientSquash,
  setGradientType: () => setGradientType,
  setHigh: () => setHigh,
  setLow: () => setLow,
  setSegmentAnticipate: () => setSegmentAnticipate,
  setSegmentCurvature: () => setSegmentCurvature,
  setSegmentOvershoot: () => setSegmentOvershoot,
  setSegmentSteepness: () => setSegmentSteepness,
  setStopColor: () => setStopColor,
  shiftSpan: () => shiftSpan,
  snapToStep: () => snapToStep,
  splitSegment: () => splitSegment,
  triggerLevels: () => triggerLevels,
  triggersCrossed: () => triggersCrossed,
  useDialKit: () => useDialKit,
  useDialTimeline: () => useDialTimeline,
  valueFromPoint: () => valueFromPoint,
  valueToNorm: () => valueToNorm,
  valueToPercent: () => valueToPercent
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useDialKit.ts
var import_react2 = require("react");

// src/color-core.ts
var COLOR_FORMATS = ["hex", "rgb", "hsl", "oklch"];
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
function gradientToTransform(value) {
  const cx = round2(clampPct(value.centerX ?? 50), 2);
  const cy = round2(clampPct(value.centerY ?? 50), 2);
  const rotation = wrapAngle(value.rotation ?? 0);
  const rx = clampScale(value.scale ?? 100);
  const ry = value.squash === void 0 ? rx : clampSquash(value.squash);
  if (value.type !== "radial" || rotation === 0 || rx === ry) {
    return { transform: "none", transformOrigin: "50% 50%" };
  }
  return { transform: `rotate(${round2(rotation, 2)}deg)`, transformOrigin: `${cx}% ${cy}%` };
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
function valueToPercent(v, min, max) {
  if (max === min) return 0;
  return (v - min) / (max - min) * 100;
}
function percentToValue(pct01, min, max) {
  return min + clamp3(pct01, 0, 1) * (max - min);
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
        } else if (typeof value === "object" && value !== null && !Array.isArray(value) && !this.isSpringConfig(value) && !this.isEasingConfig(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isNumberConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value)) {
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
      } else if (typeof value === "object" && value !== null && !Array.isArray(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isNumberConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value) && !this.isCurveConfig(value)) {
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
          orientation: value.orientation,
          shortcut
        });
      } else if (this.isNumberConfig(value)) {
        controls.push({
          type: "number",
          path,
          label,
          min: value.min,
          max: value.max,
          step: value.step ?? this.inferRange(value.default).step,
          unit: value.unit,
          formatValue: value.formatValue,
          orientation: value.orientation,
          shortcut
        });
      } else if (typeof value === "boolean") {
        controls.push({ type: "toggle", path, label, shortcut });
      } else if (this.isSpringConfig(value) || this.isEasingConfig(value)) {
        controls.push({ type: "transition", path, label });
      } else if (this.isActionConfig(value)) {
        controls.push({ type: "action", path, label: value.label || label, caption: value.caption });
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
        const module2 = "_enabled" in folderConfig ? true : void 0;
        const collapsible = !module2 && folderConfig._collapsible === false ? false : void 0;
        const defaultOpen = collapsible === false ? true : "_collapsed" in folderConfig ? !folderConfig._collapsed : true;
        controls.push({
          type: "folder",
          path,
          label,
          defaultOpen,
          collapsible,
          module: module2,
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
      } else if (this.isSliderConfig(value) || this.isNumberConfig(value)) {
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
  isNumberConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "number" && typeof value.default === "number";
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
      case "slider":
      case "number": {
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
function groupListFields(fields) {
  const flat = [];
  const groups = [];
  const byLabel = /* @__PURE__ */ new Map();
  for (const field of fields) {
    if (!field.group) {
      flat.push(field);
      continue;
    }
    let group = byLabel.get(field.group);
    if (!group) {
      group = { label: field.group, fields: [] };
      byLabel.set(field.group, group);
      groups.push(group);
    }
    group.fields.push(field);
  }
  return { flat, groups };
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

// src/hooks/useDialStorePanel.ts
var import_react = require("react");
function useSerialized(value) {
  const ref = (0, import_react.useRef)();
  if (!ref.current || !Object.is(ref.current.value, value)) {
    ref.current = { value, text: JSON.stringify(value) };
  }
  return ref.current.text;
}
function useDialStorePanel(name, config, options = {}) {
  const instanceId = (0, import_react.useId)();
  const hasStableId = options.id !== void 0;
  const panelId = options.id ?? `${name}-${instanceId}`;
  const configRef = (0, import_react.useRef)(config);
  configRef.current = config;
  const optionsRef = (0, import_react.useRef)(options);
  optionsRef.current = options;
  const serializedConfig = useSerialized(config);
  const serializedShortcuts = useSerialized(options.shortcuts);
  const serializedPersist = useSerialized(options.persist);
  const serializedHints = useSerialized(options.hints);
  const serializedLabels = useSerialized(options.labels);
  (0, import_react.useEffect)(() => {
    DialStore.registerPanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      kind: optionsRef.current.kind
    });
    return () => DialStore.unregisterPanel(panelId);
  }, [hasStableId, panelId, name]);
  const mountedRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    DialStore.updatePanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      kind: optionsRef.current.kind
    });
  }, [hasStableId, panelId, name, serializedConfig, serializedShortcuts, serializedPersist, serializedHints, serializedLabels]);
  (0, import_react.useEffect)(() => {
    DialStore.setPresetProvider(panelId, optionsRef.current.presets ?? null);
  });
  (0, import_react.useEffect)(() => {
    DialStore.syncCurveConfigs(panelId, configRef.current);
  });
  const subscribe = (0, import_react.useCallback)(
    (callback) => DialStore.subscribe(panelId, callback),
    [panelId]
  );
  const getSnapshot = (0, import_react.useCallback)(() => DialStore.getValues(panelId), [panelId]);
  const flatValues = (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
  return { panelId, flatValues, serializedConfig };
}

// src/hooks/useDialKit.ts
function useDialKit(name, config, options) {
  const onActionRef = (0, import_react2.useRef)(options?.onAction);
  onActionRef.current = options?.onAction;
  const onEventRef = (0, import_react2.useRef)(options?.onEvent);
  onEventRef.current = options?.onEvent;
  const { panelId, flatValues } = useDialStorePanel(name, config, {
    shortcuts: options?.shortcuts,
    hints: options?.hints,
    affordances: options?.affordances,
    labels: options?.labels,
    presets: options?.presets
  });
  (0, import_react2.useEffect)(() => {
    return DialStore.subscribeActions(panelId, (action) => {
      onActionRef.current?.(action);
    });
  }, [panelId]);
  (0, import_react2.useEffect)(() => {
    return DialStore.subscribeEvents(panelId, (path, event) => {
      onEventRef.current?.(path, event);
    });
  }, [panelId]);
  return buildResolvedValues(config, flatValues, "");
}
function buildResolvedValues(config, flatValues, prefix) {
  const result = {};
  for (const [key, configValue] of Object.entries(config)) {
    if (key === "_collapsed" || key === "_collapsible" || key === "_tabs") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === "number") {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (isSliderConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default;
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
    } else if (isGalleryConfig(configValue)) {
      const defaultValue = configValue.default ?? configValue.items[0]?.id ?? "";
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isFileConfig(configValue)) {
      result[key] = flatValues[path] ?? "";
    } else if (isSwatchConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? "";
    } else if (isChipsConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? "";
    } else if (isMultiSelectConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? [];
    } else if (isListConfig(configValue)) {
      result[key] = flatValues[path] ?? normalizeListItems(configValue);
    } else if (isCurveConfig(configValue)) {
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
function isGalleryConfig(value) {
  return hasType(value, "gallery") && "items" in value && Array.isArray(value.items);
}
function isFileConfig(value) {
  return hasType(value, "file");
}
function isSwatchConfig(value) {
  return hasType(value, "swatch") && "options" in value && Array.isArray(value.options);
}
function isChipsConfig(value) {
  return hasType(value, "chips") && "options" in value && Array.isArray(value.options);
}
function isMultiSelectConfig(value) {
  return hasType(value, "multiselect") && "options" in value && Array.isArray(value.options);
}
function isSliderConfig(value) {
  return hasType(value, "slider") && typeof value.min === "number" && typeof value.max === "number";
}
function isListConfig(value) {
  return hasType(value, "list") && "itemTypes" in value && typeof value.itemTypes === "object";
}
function isCurveConfig(value) {
  return hasType(value, "curve") && typeof value.sample === "function";
}
function getFirstOptionValue(options) {
  const first = options[0];
  return typeof first === "string" ? first : first.value;
}

// src/components/DialRoot.tsx
var import_react41 = require("react");
var import_react_dom7 = require("react-dom");

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

// src/env.ts
var import_meta = {};
var isDevDefault = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import_meta !== "undefined" && import_meta.env?.MODE ? import_meta.env.MODE !== "production" : true;

// src/components/Folder.tsx
var import_react3 = require("react");
var import_react4 = require("motion/react");

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
var ICON_CLOSE = "M6 6L18 18M6 18L18 6";
var ICON_PLUS = "M12 5V19M5 12H19";
var ICON_PENCIL = [
  "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
];
var ICON_GRIP = [
  { cx: "9", cy: "6" },
  { cx: "9", cy: "12" },
  { cx: "9", cy: "18" },
  { cx: "15", cy: "6" },
  { cx: "15", cy: "12" },
  { cx: "15", cy: "18" }
];
var ICON_FILE = "M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19";
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

// src/components/Folder.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Folder({ title, children, defaultOpen = true, collapsible = true, isRoot = false, inline = false, onOpenChange, toolbar, tabs, hint, hintId }) {
  const [isOpen, setIsOpen] = (0, import_react3.useState)(collapsible ? defaultOpen : true);
  const [isCollapsed, setIsCollapsed] = (0, import_react3.useState)(collapsible ? !defaultOpen : false);
  const contentRef = (0, import_react3.useRef)(null);
  const [contentHeight, setContentHeight] = (0, import_react3.useState)(void 0);
  const [windowHeight, setWindowHeight] = (0, import_react3.useState)(typeof window !== "undefined" ? window.innerHeight : 800);
  (0, import_react3.useEffect)(() => {
    if (!isRoot) return;
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isRoot]);
  (0, import_react3.useEffect)(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (isOpen) {
        const h = el.offsetHeight;
        setContentHeight((prev) => prev === h ? prev : h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);
  const handleToggle = () => {
    if (!collapsible) return;
    if (inline && isRoot) return;
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
    onOpenChange?.(next);
  };
  const folderContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: isRoot ? contentRef : void 0, className: `dialkit-folder ${isRoot ? "dialkit-folder-root" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: `dialkit-folder-header ${isRoot ? "dialkit-panel-header" : ""} ${collapsible ? "" : "dialkit-folder-header-static"}`,
        onClick: collapsible ? handleToggle : void 0,
        "data-hint": hint ? "true" : void 0,
        "aria-describedby": hint ? hintId : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dialkit-folder-header-top", children: [
            isRoot ? isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialkit-folder-title-row", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dialkit-folder-title dialkit-folder-title-root", children: title }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialkit-folder-title-row", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dialkit-folder-title", children: title }) }),
            !isRoot && toolbar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialkit-folder-toolbar", onClick: (e) => e.stopPropagation(), children: toolbar }),
            isRoot && !inline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "svg",
              {
                className: "dialkit-panel-icon",
                viewBox: "0 0 16 16",
                fill: "none",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { opacity: "0.5", d: ICON_PANEL.path, fill: "currentColor" }),
                  ICON_PANEL.circles.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: c.cx, cy: c.cy, r: c.r, fill: "currentColor", stroke: "currentColor", strokeWidth: "1.25" }, i))
                ]
              }
            ),
            !isRoot && collapsible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_react4.motion.svg,
              {
                className: "dialkit-folder-icon",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                initial: false,
                animate: { rotate: isOpen ? 0 : 180 },
                transition: { type: "spring", visualDuration: 0.35, bounce: 0.15 },
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: ICON_CHEVRON })
              }
            )
          ] }),
          isRoot && toolbar && isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialkit-panel-toolbar", onClick: (e) => e.stopPropagation(), children: toolbar }),
          isRoot && tabs && isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialkit-panel-tabs", onClick: (e) => e.stopPropagation(), children: tabs }),
          hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dialkit-hint", id: hintId, role: "tooltip", children: hint })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react4.AnimatePresence, { initial: false, children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react4.motion.div,
      {
        className: "dialkit-folder-content",
        initial: isRoot ? void 0 : { height: 0, opacity: 0 },
        animate: isRoot ? void 0 : { height: "auto", opacity: 1 },
        exit: isRoot ? void 0 : { height: 0, opacity: 0 },
        transition: isRoot ? void 0 : { type: "spring", visualDuration: 0.35, bounce: 0.1 },
        style: isRoot ? void 0 : { clipPath: "inset(0 -20px)" },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialkit-folder-inner", children })
      }
    ) })
  ] });
  if (isRoot) {
    if (inline) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dialkit-panel-inner dialkit-panel-inline", children: folderContent });
    }
    const panelStyle = isOpen ? { width: 280, height: contentHeight !== void 0 ? Math.min(contentHeight + 10, windowHeight - 32) : "auto", borderRadius: 14, boxShadow: "var(--dial-shadow)", cursor: void 0, overflowY: "auto" } : { width: 42, height: 42, borderRadius: "50%", boxSizing: "border-box", boxShadow: "var(--dial-shadow-collapsed)", overflow: "hidden", cursor: "pointer" };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react4.motion.div,
      {
        className: "dialkit-panel-inner",
        style: panelStyle,
        onClick: !isOpen ? handleToggle : void 0,
        "data-collapsed": isCollapsed,
        whileTap: !isOpen ? { scale: 0.9 } : void 0,
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: folderContent
      }
    );
  }
  return folderContent;
}

// src/components/Panel.tsx
var import_react37 = require("react");
var import_react38 = require("motion/react");

// src/panel-tabs.ts
function splitPanelTabs(controls, activeValue) {
  const tabs = controls.filter((control) => control.tab);
  if (!controls.some((control) => control.tabBar) || tabs.length === 0) {
    return { tabs: [], looseControls: [], pageControls: controls };
  }
  const activeTab = tabs.find((tab) => tab.path === activeValue) ?? tabs[0];
  return {
    tabs,
    activeTab,
    looseControls: controls.filter((control) => !control.tab && !control.tabBar),
    pageControls: activeTab.children ?? []
  };
}

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

// src/components/ControlRenderer.tsx
var import_react34 = require("react");

// src/components/ShortcutListener.tsx
var import_react5 = require("react");

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

// src/components/ShortcutListener.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ShortcutContext = (0, import_react5.createContext)({ activePanelId: null, activePath: null });
function ShortcutListener({ children }) {
  const [activeShortcut, setActiveShortcut] = (0, import_react5.useState)({ activePanelId: null, activePath: null });
  const activeKeysRef = (0, import_react5.useRef)(/* @__PURE__ */ new Set());
  const isDraggingRef = (0, import_react5.useRef)(false);
  const lastMouseXRef = (0, import_react5.useRef)(null);
  const dragAccumulatorRef = (0, import_react5.useRef)(0);
  const resolveActiveTarget = (0, import_react5.useCallback)((interaction) => {
    for (const key of activeKeysRef.current) {
      const panels = DialStore.getPanels();
      for (const panel of panels) {
        for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
          if (!shortcut.key) continue;
          if (shortcut.key.toLowerCase() !== key) continue;
          if ((shortcut.interaction ?? "scroll") !== interaction) continue;
          const control = findControl(panel.controls, path);
          if (control && control.type === "slider") {
            return { panelId: panel.id, path, control, shortcut };
          }
        }
      }
    }
    return null;
  }, []);
  (0, import_react5.useEffect)(() => {
    const handleKeyDown = (e) => {
      if (isInputFocused()) return;
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
        if (activeKeysRef.current.size > 0) {
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
      const wasAlreadyHeld = activeKeysRef.current.has(key);
      activeKeysRef.current.add(key);
      const modifier = getActiveModifier(e);
      const target = DialStore.resolveShortcutTarget(key, modifier);
      if (target) {
        setActiveShortcut({ activePanelId: target.panelId, activePath: target.path });
        if (!wasAlreadyHeld && target.control.type === "toggle") {
          const currentValue = DialStore.getValue(target.panelId, target.path);
          DialStore.updateValue(target.panelId, target.path, !currentValue);
        }
      }
      if (!wasAlreadyHeld) {
        lastMouseXRef.current = null;
        dragAccumulatorRef.current = 0;
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      activeKeysRef.current.delete(key);
      isDraggingRef.current = false;
      lastMouseXRef.current = null;
      dragAccumulatorRef.current = 0;
      if (activeKeysRef.current.size === 0) {
        setActiveShortcut({ activePanelId: null, activePath: null });
      } else {
        let found = false;
        for (const remainingKey of activeKeysRef.current) {
          const modifier = getActiveModifier(e);
          const target = DialStore.resolveShortcutTarget(remainingKey, modifier);
          if (target) {
            setActiveShortcut({ activePanelId: target.panelId, activePath: target.path });
            found = true;
            break;
          }
        }
        if (!found) {
          setActiveShortcut({ activePanelId: null, activePath: null });
        }
      }
    };
    const handleWheel = (e) => {
      if (isInputFocused()) return;
      const modifier = getActiveModifier(e);
      if (activeKeysRef.current.size > 0) {
        for (const key of activeKeysRef.current) {
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
      if (activeKeysRef.current.size === 0) return;
      const target = resolveActiveTarget("drag");
      if (target) {
        isDraggingRef.current = true;
        lastMouseXRef.current = e.clientX;
        dragAccumulatorRef.current = 0;
        e.preventDefault();
      }
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      lastMouseXRef.current = null;
      dragAccumulatorRef.current = 0;
    };
    const handleMouseMove = (e) => {
      if (isInputFocused()) return;
      if (activeKeysRef.current.size === 0) return;
      if (isDraggingRef.current) {
        const target = resolveActiveTarget("drag");
        if (target && lastMouseXRef.current !== null) {
          const deltaX = e.clientX - lastMouseXRef.current;
          lastMouseXRef.current = e.clientX;
          dragAccumulatorRef.current += deltaX;
          const effectiveStep2 = getEffectiveStep(target.control, target.shortcut);
          const steps = Math.trunc(dragAccumulatorRef.current / DRAG_SENSITIVITY);
          if (steps !== 0) {
            dragAccumulatorRef.current -= steps * DRAG_SENSITIVITY;
            applySliderDelta(target.panelId, target.path, target.control, effectiveStep2, steps);
          }
        }
        return;
      }
      const moveTarget = resolveActiveTarget("move");
      if (moveTarget) {
        if (lastMouseXRef.current === null) {
          lastMouseXRef.current = e.clientX;
          return;
        }
        const deltaX = e.clientX - lastMouseXRef.current;
        lastMouseXRef.current = e.clientX;
        dragAccumulatorRef.current += deltaX;
        const effectiveStep2 = getEffectiveStep(moveTarget.control, moveTarget.shortcut);
        const steps = Math.trunc(dragAccumulatorRef.current / DRAG_SENSITIVITY);
        if (steps !== 0) {
          dragAccumulatorRef.current -= steps * DRAG_SENSITIVITY;
          applySliderDelta(moveTarget.panelId, moveTarget.path, moveTarget.control, effectiveStep2, steps);
        }
      }
    };
    const handleWindowBlur = () => {
      activeKeysRef.current.clear();
      isDraggingRef.current = false;
      lastMouseXRef.current = null;
      dragAccumulatorRef.current = 0;
      setActiveShortcut({ activePanelId: null, activePath: null });
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [resolveActiveTarget]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ShortcutContext.Provider, { value: activeShortcut, children });
}

// src/components/ModuleFolder.tsx
var import_react7 = require("react");

// src/components/Checkbox.tsx
var import_react6 = require("motion/react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function Checkbox({ checked, onChange, label, disabled = false, id }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "button",
    {
      type: "button",
      id,
      role: "checkbox",
      "aria-checked": disabled ? "mixed" : checked,
      "aria-label": label,
      "aria-disabled": disabled || void 0,
      className: "dialkit-checkbox",
      "data-checked": checked && !disabled ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      onClick: (e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { viewBox: "0 0 16 16", width: "10", height: "10", "aria-hidden": "true", children: disabled ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_react6.motion.path,
        {
          d: "M3.5 8h9",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_react6.motion.path,
        {
          d: "M2.5 8.5 6.5 12.5 13.5 3.5",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2.2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          initial: false,
          animate: { pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 },
          transition: { duration: 0.15, ease: "easeOut" }
        }
      ) })
    }
  );
}

// src/components/ModuleFolder.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ModuleFolder({ title, enabled, onEnabledChange, defaultOpen = true, hint, hintId, children }) {
  const [isOpen, setIsOpen] = (0, import_react7.useState)(defaultOpen);
  const headerOnly = children == null || Array.isArray(children) && children.length === 0;
  const handleEnabledChange = (next) => {
    onEnabledChange(next);
    if (next) setIsOpen(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dialkit-module dialkit-module-folder", "data-open": !headerOnly && enabled && isOpen ? "true" : "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: `dialkit-module-header ${headerOnly ? "" : "dialkit-module-header-toggle"}`,
        onClick: () => {
          if (enabled && !headerOnly) setIsOpen((open) => !open);
        },
        "data-hint": hint ? "true" : void 0,
        "aria-describedby": hint ? hintId : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Checkbox, { checked: enabled, onChange: handleEnabledChange, label: title }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dialkit-module-title", children: title }),
          hint && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dialkit-hint", id: hintId, role: "tooltip", children: hint })
        ]
      }
    ),
    !headerOnly && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dialkit-module-collapse", "data-open": enabled && isOpen, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dialkit-module-collapse-clip", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dialkit-module-inner", children }) }) })
  ] });
}

// src/components/ControlShell.tsx
var import_react8 = require("react");
var import_react_dom = require("react-dom");

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

// src/components/ControlShell.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function ControlShell({ hint, title, id, affordance, panelId, path, children }) {
  const [open, setOpen] = (0, import_react8.useState)(false);
  const readDisabled = (0, import_react8.useCallback)(
    () => panelId && path ? DialStore.isDisabled(panelId, path) : false,
    [panelId, path]
  );
  const disabled = (0, import_react8.useSyncExternalStore)(
    (0, import_react8.useCallback)((cb) => panelId ? DialStore.subscribeControlState(panelId, cb) : () => {
    }, [panelId]),
    readDisabled,
    readDisabled
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: "dialkit-control-tip",
      "data-hint": hint ? "true" : void 0,
      "data-affordance": affordance ? "true" : void 0,
      "data-affordance-open": open ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      "aria-disabled": disabled ? true : void 0,
      role: hint ? "group" : void 0,
      "aria-describedby": hint ? id : void 0,
      title: hint ? void 0 : title,
      children: [
        children,
        hint && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dialkit-hint", id, role: "tooltip", children: hint }),
        affordance && panelId && path && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          Affordance,
          {
            affordance,
            panelId,
            path,
            open,
            onOpenChange: setOpen
          }
        )
      ]
    }
  );
}
function Affordance({ affordance, panelId, path, open, onOpenChange }) {
  const dotRef = (0, import_react8.useRef)(null);
  const popoverRef = (0, import_react8.useRef)(null);
  const [pos, setPos] = (0, import_react8.useState)(null);
  const [portalTarget, setPortalTarget] = (0, import_react8.useState)(null);
  const label = affordance.label ?? "Options";
  const status = (0, import_react8.useSyncExternalStore)(
    (0, import_react8.useCallback)((cb) => DialStore.subscribeControlState(panelId, cb), [panelId]),
    (0, import_react8.useCallback)(() => DialStore.getAffordanceStatus(panelId, path), [panelId, path]),
    (0, import_react8.useCallback)(() => DialStore.getAffordanceStatus(panelId, path), [panelId, path])
  );
  (0, import_react8.useEffect)(() => {
    const root = dotRef.current?.closest?.(".dialkit-root");
    const target = root ?? (typeof document === "undefined" ? null : document.body);
    setPortalTarget(target?.nodeType === 1 ? target : null);
  }, []);
  const place = (0, import_react8.useCallback)(() => {
    const rect = dotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = placePopover(rect, popoverRef.current?.offsetHeight ?? 0, window.innerHeight);
    setPos((cur) => cur && cur.top === next.top && cur.left === next.left ? cur : next);
  }, []);
  (0, import_react8.useLayoutEffect)(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);
  (0, import_react8.useLayoutEffect)(() => {
    if (open && pos) place();
  }, [open, pos, place]);
  (0, import_react8.useEffect)(() => {
    if (!open) return;
    const first = popoverRef.current?.querySelector(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (first ?? popoverRef.current)?.focus();
  }, [open, pos !== null]);
  (0, import_react8.useEffect)(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      const target = e.target;
      if (dotRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      onOpenChange(false);
      dotRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);
  const popover = open ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      ref: popoverRef,
      className: "dialkit-affordance-popover",
      role: "dialog",
      "aria-label": label,
      tabIndex: -1,
      style: {
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        width: AFFORDANCE_POPOVER_WIDTH,
        // Hidden until measured, so it never flashes at the wrong spot.
        visibility: pos ? void 0 : "hidden"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dialkit-affordance-popover-title", children: label }),
        (0, import_react8.createElement)(affordance.content, {
          panelId,
          path,
          status,
          setStatus: (next) => DialStore.setAffordanceStatus(panelId, path, next)
        })
      ]
    }
  ) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        ref: dotRef,
        type: "button",
        className: "dialkit-affordance-dot",
        "data-status": status,
        "data-open": String(open),
        "aria-label": label,
        "aria-expanded": open,
        onClick: () => onOpenChange(!open)
      }
    ),
    popover && (portalTarget ? (0, import_react_dom.createPortal)(popover, portalTarget) : popover)
  ] });
}

// src/components/Slider.tsx
var import_react9 = require("react");
var import_react10 = require("motion/react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var CLICK_THRESHOLD = 3;
var DEAD_ZONE = 32;
var MAX_CURSOR_RANGE = 200;
var MAX_STRETCH = 8;
var DETENT_PX = 6;
function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  unit,
  formatValue,
  valueIcon,
  origin,
  bipolar,
  orientation = "horizontal",
  shortcut,
  shortcutActive
}) {
  const isVertical = orientation === "vertical";
  const resolvedOrigin = Math.min(max, Math.max(min, origin ?? (bipolar ? 0 : min)));
  const hasOrigin = resolvedOrigin > min;
  const originPercent = (resolvedOrigin - min) / (max - min) * 100;
  const wrapperRef = (0, import_react9.useRef)(null);
  const inputRef = (0, import_react9.useRef)(null);
  const [isInteracting, setIsInteracting] = (0, import_react9.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react9.useState)(false);
  const [isHovered, setIsHovered] = (0, import_react9.useState)(false);
  const [isValueHovered, setIsValueHovered] = (0, import_react9.useState)(false);
  const [isValueEditable, setIsValueEditable] = (0, import_react9.useState)(false);
  const [showInput, setShowInput] = (0, import_react9.useState)(false);
  const [inputValue, setInputValue] = (0, import_react9.useState)("");
  const hoverTimeoutRef = (0, import_react9.useRef)(null);
  const pointerDownPos = (0, import_react9.useRef)(null);
  const isClickRef = (0, import_react9.useRef)(true);
  const animRef = (0, import_react9.useRef)(null);
  const wrapperRectRef = (0, import_react9.useRef)(null);
  const scaleRef = (0, import_react9.useRef)(1);
  const percentage = (value - min) / (max - min) * 100;
  const isActive = isInteracting || isHovered;
  const fillPercent = (0, import_react10.useMotionValue)(percentage);
  const fillExtent = (0, import_react10.useTransform)(
    fillPercent,
    (pct) => hasOrigin ? `${Math.abs(pct - originPercent)}%` : `${pct}%`
  );
  const fillStart = (0, import_react10.useTransform)(
    fillPercent,
    (pct) => hasOrigin ? `${Math.min(pct, originPercent)}%` : "0%"
  );
  const handleLeft = (0, import_react10.useTransform)(
    fillPercent,
    (pct) => `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`
  );
  const rubberStretchPx = (0, import_react10.useMotionValue)(0);
  const rubberBandSize = (0, import_react10.useTransform)(
    rubberStretchPx,
    (stretch) => `calc(100% + ${Math.abs(stretch)}px)`
  );
  const rubberBandShift = (0, import_react10.useTransform)(
    rubberStretchPx,
    (stretch) => stretch < 0 ? stretch : 0
  );
  (0, import_react9.useEffect)(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage);
    }
  }, [percentage, isInteracting, fillPercent]);
  const trackExtent = (0, import_react9.useCallback)(() => {
    const el = wrapperRef.current;
    if (!el) return 0;
    return isVertical ? el.offsetHeight : el.offsetWidth;
  }, [isVertical]);
  const positionToValue = (0, import_react9.useCallback)(
    (clientX, clientY) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value;
      const screenPos = isVertical ? clientY - rect.top : clientX - rect.left;
      const scenePos = screenPos / scaleRef.current;
      const nativeExtent = trackExtent() || (isVertical ? rect.height : rect.width);
      let percent = Math.max(0, Math.min(1, scenePos / nativeExtent));
      if (isVertical) percent = 1 - percent;
      const rawValue = min + percent * (max - min);
      return Math.max(min, Math.min(max, rawValue));
    },
    [min, max, value, isVertical, trackExtent]
  );
  const percentFromValue = (0, import_react9.useCallback)(
    (v) => (v - min) / (max - min) * 100,
    [min, max]
  );
  const applyDetent = (0, import_react9.useCallback)(
    (v) => {
      if (!hasOrigin) return v;
      const extent = trackExtent();
      if (extent <= 0) return v;
      const detentValue = DETENT_PX / extent * (max - min);
      return Math.abs(v - resolvedOrigin) <= detentValue ? resolvedOrigin : v;
    },
    [hasOrigin, max, min, resolvedOrigin, trackExtent]
  );
  const computeRubberStretch = (0, import_react9.useCallback)(
    (clientPos, sign) => {
      const rect = wrapperRectRef.current;
      if (!rect) return 0;
      const nearEdge = isVertical ? rect.top : rect.left;
      const farEdge = isVertical ? rect.bottom : rect.right;
      const distancePast = sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
      const overflow = Math.max(0, distancePast - DEAD_ZONE);
      return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
    },
    [isVertical]
  );
  const handlePointerDown = (0, import_react9.useCallback)(
    (e) => {
      if (showInput) return;
      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      setIsInteracting(true);
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        const nativeExtent = trackExtent();
        const rectExtent = isVertical ? wrapperRectRef.current.height : wrapperRectRef.current.width;
        scaleRef.current = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
      }
    },
    [showInput, isVertical, trackExtent]
  );
  const handlePointerMove = (0, import_react9.useCallback)(
    (e) => {
      if (!isInteracting || !pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickRef.current && distance > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsDragging(true);
      }
      if (!isClickRef.current) {
        const rect = wrapperRectRef.current;
        if (rect) {
          const clientPos = isVertical ? e.clientY : e.clientX;
          const nearEdge = isVertical ? rect.top : rect.left;
          const farEdge = isVertical ? rect.bottom : rect.right;
          if (clientPos < nearEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, -1));
          } else if (clientPos > farEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, 1));
          } else {
            rubberStretchPx.jump(0);
          }
        }
        const newValue = applyDetent(positionToValue(e.clientX, e.clientY));
        const newPct = percentFromValue(newValue);
        if (animRef.current) {
          animRef.current.stop();
          animRef.current = null;
        }
        fillPercent.jump(newPct);
        onChange(roundValue(newValue, step));
      }
    },
    [
      isInteracting,
      isVertical,
      positionToValue,
      percentFromValue,
      applyDetent,
      onChange,
      fillPercent,
      rubberStretchPx,
      computeRubberStretch,
      step
    ]
  );
  const handlePointerUp = (0, import_react9.useCallback)(
    (e) => {
      if (!isInteracting) return;
      if (isClickRef.current) {
        const rawValue = positionToValue(e.clientX, e.clientY);
        const discreteSteps2 = (max - min) / step;
        const snappedValue = discreteSteps2 <= 10 ? Math.max(min, Math.min(max, min + Math.round((rawValue - min) / step) * step)) : snapToDecile(rawValue, min, max);
        const newPct = percentFromValue(snappedValue);
        if (animRef.current) {
          animRef.current.stop();
        }
        animRef.current = (0, import_react10.animate)(fillPercent, newPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            animRef.current = null;
          }
        });
        onChange(roundValue(snappedValue, step));
      }
      if (rubberStretchPx.get() !== 0) {
        (0, import_react10.animate)(rubberStretchPx, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15
        });
      }
      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
    },
    [
      isInteracting,
      positionToValue,
      percentFromValue,
      onChange,
      min,
      max,
      step,
      fillPercent,
      rubberStretchPx
    ]
  );
  (0, import_react9.useEffect)(() => {
    if (isValueHovered && !showInput && !isValueEditable) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsValueEditable(true);
      }, 800);
    } else if (!isValueHovered && !showInput) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsValueEditable(false);
    }
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isValueHovered, showInput, isValueEditable]);
  (0, import_react9.useEffect)(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(roundValue(clamped, step));
    }
    setShowInput(false);
    setIsValueHovered(false);
    setIsValueEditable(false);
  };
  const handleValueClick = (e) => {
    if (isValueEditable) {
      e.stopPropagation();
      e.preventDefault();
      setShowInput(true);
      setInputValue(value.toFixed(decimalsForStep2(step)));
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setIsValueHovered(false);
    }
  };
  const handleInputBlur = () => {
    handleInputSubmit();
  };
  const displayValue = formatValue ? formatValue(value) : value.toFixed(decimalsForStep2(step));
  const discreteSteps = (max - min) / step;
  const hashMarks = discreteSteps <= 10 ? Array.from({ length: discreteSteps - 1 }, (_, i) => {
    const pct = (i + 1) * step / (max - min) * 100;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        className: "dialkit-slider-hashmark",
        style: { left: `${pct}%` }
      },
      i
    );
  }) : Array.from({ length: 9 }, (_, i) => {
    const pct = (i + 1) * 10;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        className: "dialkit-slider-hashmark",
        style: { left: `${pct}%` }
      },
      i
    );
  });
  const cardClassName = [
    "dialkit-slider",
    isVertical ? "dialkit-slider-vertical" : "",
    isActive ? "dialkit-slider-active" : "",
    isInteracting ? "dialkit-slider-engaged" : ""
  ].filter(Boolean).join(" ");
  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  };
  if (isVertical) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        ref: wrapperRef,
        className: "dialkit-slider-wrapper dialkit-slider-wrapper-vertical",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          import_react10.motion.div,
          {
            className: cardClassName,
            "data-origin": hasOrigin ? "true" : void 0,
            ...pointerHandlers,
            style: { height: rubberBandSize, y: rubberBandShift },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dialkit-slider-fill-area", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                import_react10.motion.div,
                {
                  className: "dialkit-slider-fill-vertical",
                  style: { bottom: fillStart, height: fillExtent }
                }
              ) }),
              showInput ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  className: "dialkit-slider-input dialkit-slider-input-vertical",
                  value: inputValue,
                  onChange: handleInputChange,
                  onKeyDown: handleInputKeyDown,
                  onBlur: handleInputBlur,
                  onClick: (e) => e.stopPropagation(),
                  onMouseDown: (e) => e.stopPropagation()
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                "span",
                {
                  className: `dialkit-slider-value-vertical ${isValueEditable ? "dialkit-slider-value-editable" : ""}`,
                  onMouseEnter: () => setIsValueHovered(true),
                  onMouseLeave: () => setIsValueHovered(false),
                  onClick: handleValueClick,
                  onPointerDown: (e) => isValueEditable && e.stopPropagation(),
                  style: { cursor: isValueEditable ? "text" : "default" },
                  children: [
                    displayValue,
                    unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dialkit-slider-unit", children: unit })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dialkit-slider-label-vertical", children: [
                label,
                shortcut && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `dialkit-shortcut-pill${shortcutActive ? " dialkit-shortcut-pill-active" : ""}`, children: formatSliderShortcut(shortcut) })
              ] })
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { ref: wrapperRef, className: "dialkit-slider-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    import_react10.motion.div,
    {
      className: cardClassName,
      "data-origin": hasOrigin ? "true" : void 0,
      ...pointerHandlers,
      style: { width: rubberBandSize, x: rubberBandShift },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dialkit-slider-track", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            import_react10.motion.div,
            {
              className: "dialkit-slider-fill",
              style: {
                left: fillStart,
                width: fillExtent
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            import_react10.motion.div,
            {
              className: "dialkit-slider-handle",
              style: { left: handleLeft },
              animate: { opacity: isDragging ? 0.9 : 0 },
              transition: { opacity: { duration: 0.15 } }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "dialkit-slider-hashmarks", children: hashMarks }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "dialkit-slider-label", children: [
          label,
          shortcut && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `dialkit-shortcut-pill${shortcutActive ? " dialkit-shortcut-pill-active" : ""}`, children: formatSliderShortcut(shortcut) })
        ] }),
        valueIcon != null ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dialkit-slider-value dialkit-slider-value-icon", children: valueIcon }) : showInput ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "dialkit-slider-input",
            value: inputValue,
            onChange: handleInputChange,
            onKeyDown: handleInputKeyDown,
            onBlur: handleInputBlur,
            onClick: (e) => e.stopPropagation(),
            onMouseDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "span",
          {
            className: `dialkit-slider-value ${isValueEditable ? "dialkit-slider-value-editable" : ""}`,
            onMouseEnter: () => setIsValueHovered(true),
            onMouseLeave: () => setIsValueHovered(false),
            onClick: handleValueClick,
            onPointerDown: (e) => isValueEditable && e.stopPropagation(),
            style: { cursor: isValueEditable ? "text" : "default" },
            children: [
              displayValue,
              unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dialkit-slider-unit", children: unit })
            ]
          }
        )
      ]
    }
  ) });
}

// src/components/NumberControl.tsx
var import_react11 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
var CLICK_THRESHOLD2 = 3;
function NumberControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  unit,
  formatValue,
  orientation = "horizontal"
}) {
  const isVertical = orientation === "vertical";
  const inputRef = (0, import_react11.useRef)(null);
  const [isScrubbing, setIsScrubbing] = (0, import_react11.useState)(false);
  const [showInput, setShowInput] = (0, import_react11.useState)(false);
  const [inputValue, setInputValue] = (0, import_react11.useState)("");
  const pointerDownPos = (0, import_react11.useRef)(null);
  const isClickRef = (0, import_react11.useRef)(true);
  const scrubStartValue = (0, import_react11.useRef)(0);
  const isPointerHeld = (0, import_react11.useRef)(false);
  const clamp6 = (0, import_react11.useCallback)(
    (v) => {
      let out = v;
      if (min != null) out = Math.max(min, out);
      if (max != null) out = Math.min(max, out);
      return out;
    },
    [min, max]
  );
  const handlePointerDown = (0, import_react11.useCallback)(
    (e) => {
      if (showInput) return;
      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      isPointerHeld.current = true;
      scrubStartValue.current = value;
    },
    [showInput, value]
  );
  const handlePointerMove = (0, import_react11.useCallback)(
    (e) => {
      if (!isPointerHeld.current || !pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickRef.current && distance > CLICK_THRESHOLD2) {
        isClickRef.current = false;
        setIsScrubbing(true);
      }
      if (!isClickRef.current) {
        const travel = isVertical ? -dy : dx;
        const perPixel = step * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);
        const next = clamp6(scrubStartValue.current + travel * perPixel);
        onChange(roundValue(next, step));
      }
    },
    [isVertical, step, clamp6, onChange]
  );
  const handlePointerUp = (0, import_react11.useCallback)(() => {
    if (!isPointerHeld.current) return;
    if (isClickRef.current) {
      setShowInput(true);
      setInputValue(value.toFixed(decimalsForStep2(step)));
    }
    isPointerHeld.current = false;
    pointerDownPos.current = null;
    setIsScrubbing(false);
  }, [value, step]);
  (0, import_react11.useEffect)(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onChange(roundValue(clamp6(parsed), step));
    }
    setShowInput(false);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setShowInput(false);
    }
  };
  const displayValue = formatValue ? formatValue(value) : value.toFixed(decimalsForStep2(step));
  const className = [
    "dialkit-number-control",
    isVertical ? "dialkit-number-control-vertical" : "",
    isScrubbing ? "dialkit-number-control-engaged" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dialkit-number-label", children: label }),
        showInput ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "dialkit-number-input",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyDown: handleInputKeyDown,
            onBlur: handleInputSubmit,
            onClick: (e) => e.stopPropagation(),
            onPointerDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "dialkit-number-value", children: [
          displayValue,
          unit && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dialkit-number-unit", children: unit })
        ] })
      ]
    }
  );
}

// src/components/RangeSlider.tsx
var import_react12 = require("react");
var import_react13 = require("motion/react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var CLICK_THRESHOLD3 = 3;
var HANDLE_HIT_PX = 12;
function RangeSlider({
  label,
  value: rawValue,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  defaultValue
}) {
  const wrapperRef = (0, import_react12.useRef)(null);
  const trackRef = (0, import_react12.useRef)(null);
  const inputRef = (0, import_react12.useRef)(null);
  const [isInteracting, setIsInteracting] = (0, import_react12.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react12.useState)(false);
  const [isHovered, setIsHovered] = (0, import_react12.useState)(false);
  const [editing, setEditing] = (0, import_react12.useState)(null);
  const [inputValue, setInputValue] = (0, import_react12.useState)("");
  const pointerDownPos = (0, import_react12.useRef)(null);
  const isClickRef = (0, import_react12.useRef)(true);
  const dragTargetRef = (0, import_react12.useRef)(null);
  const clickMovesRef = (0, import_react12.useRef)(false);
  const dragStartValueRef = (0, import_react12.useRef)(rawValue);
  const dragStartValueAtRef = (0, import_react12.useRef)(0);
  const lowAnimRef = (0, import_react12.useRef)(null);
  const highAnimRef = (0, import_react12.useRef)(null);
  const stopAnims = (0, import_react12.useCallback)(() => {
    lowAnimRef.current?.stop();
    highAnimRef.current?.stop();
    lowAnimRef.current = null;
    highAnimRef.current = null;
  }, []);
  const wrapperRectRef = (0, import_react12.useRef)(null);
  const scaleRef = (0, import_react12.useRef)(1);
  const value = isInteracting ? rawValue : clampRange(rawValue, min, max);
  const span = max - min;
  const lowPercent = span === 0 ? 0 : (value.min - min) / span * 100;
  const highPercent = span === 0 ? 0 : (value.max - min) / span * 100;
  const isActive = isInteracting || isHovered;
  const lowMotion = (0, import_react13.useMotionValue)(lowPercent);
  const highMotion = (0, import_react13.useMotionValue)(highPercent);
  const fillLeft = (0, import_react13.useTransform)(lowMotion, (pct) => `${pct}%`);
  const fillWidth = (0, import_react13.useTransform)(
    [lowMotion, highMotion],
    ([lo, hi]) => `${Math.max(0, hi - lo)}%`
  );
  const lowHandleLeft = (0, import_react13.useTransform)([lowMotion, highMotion], ([lo, hi]) => handleLeftStyles(lo, hi).low);
  const highHandleLeft = (0, import_react13.useTransform)([lowMotion, highMotion], ([lo, hi]) => handleLeftStyles(lo, hi).high);
  (0, import_react12.useEffect)(() => {
    if (!isInteracting && !lowAnimRef.current && !highAnimRef.current) {
      lowMotion.jump(lowPercent);
      highMotion.jump(highPercent);
    }
  }, [lowPercent, highPercent, isInteracting, lowMotion, highMotion]);
  const positionToValue = (0, import_react12.useCallback)(
    (clientX) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value.min;
      const screenX = clientX - rect.left;
      const sceneX = screenX / scaleRef.current;
      const nativeWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : rect.width;
      const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
      const rawValue2 = min + percent * (max - min);
      return Math.max(min, Math.min(max, rawValue2));
    },
    [min, max, value.min]
  );
  const percentFromValue = (0, import_react12.useCallback)(
    (v) => span === 0 ? 0 : (v - min) / span * 100,
    [min, span]
  );
  const syncMotion = (0, import_react12.useCallback)(
    (next) => {
      lowMotion.jump(percentFromValue(next.min));
      highMotion.jump(percentFromValue(next.max));
    },
    [lowMotion, highMotion, percentFromValue]
  );
  const handlePointerDown = (0, import_react12.useCallback)(
    (e) => {
      if (editing) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      setIsInteracting(true);
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        const nativeWidth = wrapperRef.current.offsetWidth;
        scaleRef.current = wrapperRectRef.current.width / nativeWidth;
      }
      const atValue = positionToValue(e.clientX);
      const trackW = wrapperRef.current?.offsetWidth ?? 1;
      const hitV = HANDLE_HIT_PX / trackW * (max - min);
      const target = pickDragTarget(atValue, value, hitV);
      dragTargetRef.current = target;
      clickMovesRef.current = target !== "span" && isOutsideSpan(atValue, value);
      dragStartValueRef.current = value;
      dragStartValueAtRef.current = atValue;
    },
    [editing, positionToValue, value, min, max]
  );
  const handlePointerMove = (0, import_react12.useCallback)(
    (e) => {
      if (!isInteracting || !pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickRef.current && distance > CLICK_THRESHOLD3) {
        isClickRef.current = false;
        setIsDragging(true);
      }
      if (isClickRef.current) return;
      const raw = roundValue(positionToValue(e.clientX), step);
      const target = dragTargetRef.current;
      let next;
      if (target === "span") {
        const delta = raw - roundValue(dragStartValueAtRef.current, step);
        next = shiftSpan(delta, dragStartValueRef.current, min, max);
      } else if (target === "min") {
        next = setLow(raw, value, min);
      } else {
        next = setHigh(raw, value, max);
      }
      stopAnims();
      syncMotion(next);
      onChange(next);
    },
    [isInteracting, positionToValue, step, min, max, value, syncMotion, onChange, stopAnims]
  );
  const handlePointerUp = (0, import_react12.useCallback)(
    (e) => {
      if (!isInteracting) return;
      if (isClickRef.current && clickMovesRef.current) {
        const raw = roundValue(positionToValue(e.clientX), step);
        const which = dragTargetRef.current ?? nearestHandle(raw, value);
        const next = which === "min" ? setLow(raw, value, min) : setHigh(raw, value, max);
        const motion15 = which === "min" ? lowMotion : highMotion;
        const targetPct = percentFromValue(which === "min" ? next.min : next.max);
        stopAnims();
        const anim = (0, import_react13.animate)(motion15, targetPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            if (which === "min") lowAnimRef.current = null;
            else highAnimRef.current = null;
          }
        });
        if (which === "min") lowAnimRef.current = anim;
        else highAnimRef.current = anim;
        onChange(next);
      }
      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
      dragTargetRef.current = null;
    },
    [isInteracting, positionToValue, step, value, min, max, lowMotion, highMotion, percentFromValue, onChange, stopAnims]
  );
  const handlePointerCancel = (0, import_react12.useCallback)(() => {
    if (!isInteracting) return;
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos.current = null;
    dragTargetRef.current = null;
  }, [isInteracting]);
  const handleDoubleClick = (0, import_react12.useCallback)(() => {
    if (editing !== null) return;
    const d = clampRange(defaultValue ?? { min, max }, min, max);
    stopAnims();
    lowAnimRef.current = (0, import_react13.animate)(lowMotion, percentFromValue(d.min), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        lowAnimRef.current = null;
      }
    });
    highAnimRef.current = (0, import_react13.animate)(highMotion, percentFromValue(d.max), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        highAnimRef.current = null;
      }
    });
    onChange(d);
  }, [editing, defaultValue, min, max, lowMotion, highMotion, percentFromValue, onChange, stopAnims]);
  (0, import_react12.useEffect)(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);
  const decimals = decimalsForStep2(step);
  const openEditor = (0, import_react12.useCallback)(
    (which) => {
      setEditing(which);
      setInputValue((which === "min" ? value.min : value.max).toFixed(decimals));
    },
    [value.min, value.max, decimals]
  );
  const commitEditor = (0, import_react12.useCallback)(() => {
    if (!editing) return;
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const rounded = roundValue(parsed, step);
      const next = editing === "min" ? setLow(rounded, value, min) : setHigh(rounded, value, max);
      onChange(next);
    }
    setEditing(null);
  }, [editing, inputValue, step, value, min, max, onChange]);
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      commitEditor();
    } else if (e.key === "Escape") {
      setEditing(null);
    }
  };
  const lowText = value.min.toFixed(decimals);
  const highText = value.max.toFixed(decimals);
  const restOpacity = 0.35;
  const lowOpacity = !isActive ? restOpacity : isDragging && dragTargetRef.current === "min" ? 0.95 : 0.7;
  const highOpacity = !isActive ? restOpacity : isDragging && dragTargetRef.current === "max" ? 0.95 : 0.7;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { ref: wrapperRef, className: "dialkit-range-slider-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    import_react13.motion.div,
    {
      ref: trackRef,
      className: `dialkit-range-slider ${isActive ? "dialkit-range-slider-active" : ""}`,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onDoubleClick: handleDoubleClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_react13.motion.div,
          {
            className: "dialkit-range-slider-fill",
            style: { left: fillLeft, width: fillWidth }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_react13.motion.div,
          {
            className: "dialkit-range-slider-handle",
            style: { left: lowHandleLeft, y: "-50%" },
            animate: { opacity: lowOpacity },
            transition: { opacity: { duration: 0.15 } }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_react13.motion.div,
          {
            className: "dialkit-range-slider-handle",
            style: { left: highHandleLeft, y: "-50%" },
            animate: { opacity: highOpacity },
            transition: { opacity: { duration: 0.15 } }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "dialkit-range-slider-label", children: label }),
        editing !== null ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "dialkit-range-slider-input",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyDown: handleInputKeyDown,
            onBlur: commitEditor,
            onClick: (e) => e.stopPropagation(),
            onPointerDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "dialkit-range-slider-value", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "span",
            {
              className: "dialkit-range-slider-bound",
              onClick: (e) => {
                e.stopPropagation();
                openEditor("min");
              },
              onPointerDown: (e) => e.stopPropagation(),
              children: lowText
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "dialkit-range-slider-dash", children: "\u2013" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "span",
            {
              className: "dialkit-range-slider-bound",
              onClick: (e) => {
                e.stopPropagation();
                openEditor("max");
              },
              onPointerDown: (e) => e.stopPropagation(),
              children: highText
            }
          )
        ] })
      ]
    }
  ) });
}

// src/components/Toggle.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function Toggle({ label, checked, onChange, shortcut, shortcutActive }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dialkit-labeled-control dialkit-labeled-control-check", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Checkbox, { checked, onChange, label }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "dialkit-labeled-control-label", children: [
      label,
      shortcut && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: `dialkit-shortcut-pill${shortcutActive ? " dialkit-shortcut-pill-active" : ""}`, children: formatToggleShortcut(shortcut) })
    ] })
  ] });
}

// src/components/SegmentedControl.tsx
var import_react14 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function SegmentedControl({
  options,
  value,
  onChange
}) {
  const containerRef = (0, import_react14.useRef)(null);
  const hasAnimated = (0, import_react14.useRef)(false);
  const [pillStyle, setPillStyle] = (0, import_react14.useState)(null);
  const measure = (0, import_react14.useCallback)(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeButton = container.querySelector('[data-active="true"]');
    if (!activeButton || activeButton.offsetWidth === 0) return;
    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
      top: activeButton.offsetTop,
      height: activeButton.offsetHeight
    });
  }, []);
  (0, import_react14.useLayoutEffect)(() => {
    measure();
  }, [value, options.length, measure]);
  (0, import_react14.useLayoutEffect)(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);
  const shouldAnimate = hasAnimated.current;
  hasAnimated.current = true;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "dialkit-segmented", ref: containerRef, children: [
    pillStyle && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "div",
      {
        className: "dialkit-segmented-pill",
        style: {
          left: pillStyle.left,
          width: pillStyle.width,
          top: pillStyle.top,
          height: pillStyle.height,
          bottom: "auto",
          transition: shouldAnimate ? "left 0.2s cubic-bezier(0.25, 1, 0.5, 1), width 0.2s cubic-bezier(0.25, 1, 0.5, 1), top 0.2s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
        }
      }
    ),
    options.map((option) => {
      const isActive = value === option.value;
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "button",
        {
          onClick: () => onChange(option.value),
          className: "dialkit-segmented-button",
          "data-active": String(isActive),
          children: option.label
        },
        option.value
      );
    })
  ] });
}

// src/components/SpringVisualization.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
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
function SpringVisualization({ spring, isSimpleMode }) {
  const width = 256;
  const height = 140;
  let stiffness;
  let damping;
  let mass;
  if (isSimpleMode) {
    const visualDuration = spring.visualDuration ?? 0.3;
    const bounce = spring.bounce ?? 0.2;
    mass = 1;
    stiffness = 2 * Math.PI / visualDuration;
    stiffness = Math.pow(stiffness, 2);
    const dampingRatio = 1 - bounce;
    damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
  } else {
    stiffness = spring.stiffness ?? 400;
    damping = spring.damping ?? 17;
    mass = spring.mass ?? 1;
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
  const gridLines = [];
  for (let i = 1; i < 4; i++) {
    const x = width / 4 * i;
    const y = height / 4 * i;
    gridLines.push(
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { x1: x, y1: 0, x2: x, y2: height, stroke: "rgba(255, 255, 255, 0.08)", strokeWidth: "1" }, `v-${i}`),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { x1: 0, y1: y, x2: width, y2: y, stroke: "rgba(255, 255, 255, 0.08)", strokeWidth: "1" }, `h-${i}`)
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("svg", { viewBox: `0 0 ${width} ${height}`, className: "dialkit-spring-viz", children: [
    gridLines,
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "line",
      {
        x1: 0,
        y1: height / 2,
        x2: width,
        y2: height / 2,
        stroke: "rgba(255, 255, 255, 0.15)",
        strokeWidth: "1",
        strokeDasharray: "4,4"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "path",
      {
        d: pathData,
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] });
}

// src/components/SpringControl.tsx
var import_react15 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
function SpringControl({ panelId, path, label, spring, onChange }) {
  const mode = (0, import_react15.useSyncExternalStore)(
    (cb) => DialStore.subscribe(panelId, cb),
    () => DialStore.getSpringMode(panelId, path),
    () => DialStore.getSpringMode(panelId, path)
  );
  const isSimpleMode = mode === "simple";
  const cache2 = (0, import_react15.useRef)({
    simple: spring.visualDuration !== void 0 ? spring : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
    advanced: spring.stiffness !== void 0 ? spring : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
  });
  if (isSimpleMode) {
    cache2.current.simple = spring;
  } else {
    cache2.current.advanced = spring;
  }
  const handleModeChange = (newMode) => {
    DialStore.updateSpringMode(panelId, path, newMode);
    if (newMode === "simple") {
      onChange(cache2.current.simple);
    } else {
      onChange(cache2.current.advanced);
    }
  };
  const handleUpdate = (key, value) => {
    if (isSimpleMode) {
      const { stiffness, damping, mass, ...rest } = spring;
      onChange({ ...rest, [key]: value });
    } else {
      const { visualDuration, bounce, ...rest } = spring;
      onChange({ ...rest, [key]: value });
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Folder, { title: label, defaultOpen: true, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SpringVisualization, { spring, isSimpleMode }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "dialkit-labeled-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "dialkit-labeled-control-label", children: "Type" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        SegmentedControl,
        {
          options: [
            { value: "simple", label: "Time" },
            { value: "advanced", label: "Physics" }
          ],
          value: mode,
          onChange: handleModeChange
        }
      )
    ] }),
    isSimpleMode ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Slider,
        {
          label: "Duration",
          value: spring.visualDuration ?? 0.3,
          onChange: (v) => handleUpdate("visualDuration", v),
          min: 0.1,
          max: 1,
          step: 0.05,
          unit: "s"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Slider,
        {
          label: "Bounce",
          value: spring.bounce ?? 0.2,
          onChange: (v) => handleUpdate("bounce", v),
          min: 0,
          max: 1,
          step: 0.05
        }
      )
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Slider,
        {
          label: "Stiffness",
          value: spring.stiffness ?? 400,
          onChange: (v) => handleUpdate("stiffness", v),
          min: 1,
          max: 1e3,
          step: 10
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Slider,
        {
          label: "Damping",
          value: spring.damping ?? 17,
          onChange: (v) => handleUpdate("damping", v),
          min: 1,
          max: 100,
          step: 1
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Slider,
        {
          label: "Mass",
          value: spring.mass ?? 1,
          onChange: (v) => handleUpdate("mass", v),
          min: 0.1,
          max: 10,
          step: 0.1
        }
      )
    ] })
  ] }) });
}

// src/components/EasingVisualization.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function EasingVisualization({ easing }) {
  const ease = easing.ease;
  const s = 200;
  const pad = 10;
  const inner = s - pad * 2;
  const unit = inner / 2;
  const toSvg = (nx, ny) => ({
    x: pad + (nx + 0.5) * unit,
    y: pad + (1.5 - ny) * unit
  });
  const start = toSvg(0, 0);
  const end = toSvg(1, 1);
  const p1 = toSvg(ease[0], ease[1]);
  const p2 = toSvg(ease[2], ease[3]);
  const curvePath2 = `M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "svg",
    {
      viewBox: `0 0 ${s} ${s}`,
      preserveAspectRatio: "xMidYMid slice",
      className: "dialkit-spring-viz dialkit-easing-viz",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          "line",
          {
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
            stroke: "rgba(255, 255, 255, 0.15)",
            strokeWidth: "1",
            strokeDasharray: "4,4"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("path", { d: curvePath2, fill: "none", stroke: "rgba(255, 255, 255, 0.6)", strokeWidth: "2", strokeLinecap: "round" })
      ]
    }
  );
}

// src/components/TransitionControl.tsx
var import_react16 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
function TransitionControl({
  panelId,
  path,
  label,
  value,
  onChange,
  hideDuration = false,
  durationControl
}) {
  const mode = (0, import_react16.useSyncExternalStore)(
    (cb) => DialStore.subscribe(panelId, cb),
    () => DialStore.getTransitionMode(panelId, path),
    () => DialStore.getTransitionMode(panelId, path)
  );
  const isEasing = mode === "easing";
  const isSimpleSpring = mode === "simple";
  const cache2 = (0, import_react16.useRef)({
    easing: value.type === "easing" ? value : { type: "easing", duration: 0.3, ease: [1, -0.4, 0.5, 1] },
    simple: value.type === "spring" && value.visualDuration !== void 0 ? value : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
    advanced: value.type === "spring" && value.stiffness !== void 0 ? value : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
  });
  if (isEasing && value.type === "easing") {
    cache2.current.easing = value;
  } else if (isSimpleSpring && value.type === "spring") {
    cache2.current.simple = value;
  } else if (mode === "advanced" && value.type === "spring") {
    cache2.current.advanced = value;
  }
  const spring = value.type === "spring" ? value : cache2.current.simple;
  const easing = value.type === "easing" ? value : cache2.current.easing;
  const handleModeChange = (newMode) => {
    DialStore.updateTransitionMode(panelId, path, newMode);
    if (newMode === "easing") {
      onChange(cache2.current.easing);
    } else if (newMode === "simple") {
      onChange(cache2.current.simple);
    } else {
      onChange(cache2.current.advanced);
    }
  };
  const handleSpringUpdate = (key, val) => {
    if (isSimpleSpring) {
      const { stiffness, damping, mass, ...rest } = spring;
      onChange({ ...rest, [key]: val });
    } else {
      const { visualDuration, bounce, ...rest } = spring;
      onChange({ ...rest, [key]: val });
    }
  };
  const updateEase = (index, val) => {
    const newEase = [...easing.ease];
    newEase[index] = val;
    onChange({ ...easing, ease: newEase });
  };
  const durationSlider = !hideDuration && (isEasing || isSimpleSpring) ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    Slider,
    {
      label: "Duration",
      value: durationControl?.value ?? (isEasing ? easing.duration : spring.visualDuration ?? 0.3),
      onChange: durationControl?.onChange ?? ((next) => {
        if (isEasing) onChange({ ...easing, duration: next });
        else handleSpringUpdate("visualDuration", next);
      }),
      min: durationControl?.min ?? 0.1,
      max: durationControl?.max ?? (isEasing ? 2 : 1),
      step: durationControl?.step ?? 0.05,
      unit: "s"
    }
  ) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Folder, { title: label, defaultOpen: true, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
    isEasing ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(EasingVisualization, { easing }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SpringVisualization, { spring, isSimpleMode: isSimpleSpring }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "dialkit-labeled-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "dialkit-labeled-control-label", children: "Type" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        SegmentedControl,
        {
          options: [
            { value: "easing", label: "Easing" },
            { value: "simple", label: "Time" },
            { value: "advanced", label: "Physics" }
          ],
          value: mode,
          onChange: handleModeChange
        }
      )
    ] }),
    isEasing ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "x1", value: easing.ease[0], onChange: (v) => updateEase(0, v), min: 0, max: 1, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "y1", value: easing.ease[1], onChange: (v) => updateEase(1, v), min: -1, max: 2, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "x2", value: easing.ease[2], onChange: (v) => updateEase(2, v), min: 0, max: 1, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "y2", value: easing.ease[3], onChange: (v) => updateEase(3, v), min: -1, max: 2, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(EaseTextInput, { ease: easing.ease, onChange: (newEase) => onChange({ ...easing, ease: newEase }) })
    ] }) : isSimpleSpring ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "Bounce", value: spring.bounce ?? 0.2, onChange: (v) => handleSpringUpdate("bounce", v), min: 0, max: 1, step: 0.05 }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "Stiffness", value: spring.stiffness ?? 400, onChange: (v) => handleSpringUpdate("stiffness", v), min: 1, max: 1e3, step: 10 }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "Damping", value: spring.damping ?? 17, onChange: (v) => handleSpringUpdate("damping", v), min: 1, max: 100, step: 1 }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Slider, { label: "Mass", value: spring.mass ?? 1, onChange: (v) => handleSpringUpdate("mass", v), min: 0.1, max: 10, step: 0.1 })
    ] }),
    durationSlider
  ] }) });
}
function formatEase(ease) {
  return ease.map((v) => parseFloat(v.toFixed(2))).join(", ");
}
function parseEase(str) {
  const parts = str.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
    return parts;
  }
  return null;
}
function EaseTextInput({ ease, onChange }) {
  const [editing, setEditing] = (0, import_react16.useState)(false);
  const [draft, setDraft] = (0, import_react16.useState)("");
  const handleFocus = () => {
    setDraft(formatEase(ease));
    setEditing(true);
  };
  const handleBlur = () => {
    const parsed = parseEase(draft);
    if (parsed) onChange(parsed);
    setEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "dialkit-labeled-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "dialkit-labeled-control-label", children: "Ease" }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "input",
      {
        type: "text",
        className: "dialkit-text-input",
        value: editing ? draft : formatEase(ease),
        onChange: (e) => setDraft(e.target.value),
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        spellCheck: false
      }
    )
  ] });
}

// src/components/TextControl.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
function TextControl({ label, value, onChange, placeholder }) {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "dialkit-text-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("label", { className: "dialkit-text-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "input",
      {
        type: "text",
        className: "dialkit-text-input",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder
      }
    )
  ] });
}

// src/components/SelectControl.tsx
var import_react18 = require("react");
var import_react_dom2 = require("react-dom");
var import_react19 = require("motion/react");

// src/components/PresenceMotionDiv.tsx
var import_react17 = require("motion/react");
var import_jsx_runtime16 = require("react/jsx-runtime");
function PresenceMotionDiv({ divRef, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_react17.motion.div, { ref: divRef, ...props });
}

// src/components/SelectControl.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
function toTitleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
function normalizeOptions(options) {
  return options.map(
    (opt) => typeof opt === "string" ? { value: opt, label: toTitleCase(opt) } : opt
  );
}
function SelectControl({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = (0, import_react18.useState)(false);
  const triggerRef = (0, import_react18.useRef)(null);
  const dropdownRef = (0, import_react18.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react18.useState)(null);
  const [pos, setPos] = (0, import_react18.useState)(null);
  const normalized = normalizeOptions(options);
  const selectedOption = normalized.find((o) => o.value === value);
  const updatePos = (0, import_react18.useCallback)(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dropdownHeight = 8 + normalized.length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      above
    });
  }, [normalized.length]);
  (0, import_react18.useEffect)(() => {
    const root = triggerRef.current?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react18.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
  }, [isOpen, updatePos]);
  (0, import_react18.useEffect)(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      const target = e.target;
      if (triggerRef.current && !triggerRef.current.contains(target) && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "dialkit-select-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "dialkit-select-trigger",
        onClick: () => setIsOpen(!isOpen),
        "data-open": String(isOpen),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "dialkit-select-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "dialkit-select-right", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "dialkit-select-value", children: selectedOption?.label ?? value }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              import_react19.motion.svg,
              {
                className: "dialkit-select-chevron",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                animate: { rotate: isOpen ? 180 : 0 },
                transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
                children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("path", { d: ICON_CHEVRON })
              }
            )
          ] })
        ]
      }
    ),
    portalTarget && (0, import_react_dom2.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_react19.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "dialkit-select-dropdown",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            left: pos.left,
            width: pos.width,
            ...pos.above ? { bottom: window.innerHeight - pos.top, transformOrigin: "bottom" } : { top: pos.top, transformOrigin: "top" }
          },
          children: normalized.map((option) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "button",
            {
              className: "dialkit-select-option",
              "data-selected": String(option.value === value),
              onClick: () => {
                onChange(option.value);
                setIsOpen(false);
              },
              children: option.label
            },
            option.value
          ))
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/ColorControl.tsx
var import_react21 = require("react");
var import_react_dom3 = require("react-dom");
var import_react22 = require("motion/react");

// src/components/ColorPickerPanel.tsx
var import_react20 = require("react");

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

// src/components/ColorPickerPanel.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var FORMAT_OPTIONS = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" }
];
var stickyFormat = "hex";
var BLACK = { h: 0, s: 0, v: 0, a: 1 };
function useAreaDrag(onPoint) {
  const ref = (0, import_react20.useRef)(null);
  const draggingRef = (0, import_react20.useRef)(false);
  const readPoint = (0, import_react20.useCallback)(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      onPoint(x, y);
    },
    [onPoint]
  );
  const onPointerDown = (e) => {
    e.preventDefault();
    ref.current?.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    readPoint(e);
  };
  const onPointerMove = (e) => {
    if (draggingRef.current && e.buttons === 0) {
      draggingRef.current = false;
      return;
    }
    if (draggingRef.current) readPoint(e);
  };
  const endDrag = () => {
    draggingRef.current = false;
  };
  return { ref, onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag };
}
function ChannelField({ spec, value, onCommit }) {
  const [draft, setDraft] = (0, import_react20.useState)(null);
  const display = draft ?? String(value);
  const commit = () => {
    if (draft !== null) onCommit(Number(draft));
    setDraft(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { className: "dialkit-color-field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "input",
      {
        type: "text",
        inputMode: "decimal",
        value: display,
        onFocus: (e) => {
          setDraft(String(value));
          e.target.select();
        },
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            setDraft(null);
            e.target.blur();
          }
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "dialkit-color-field-label", children: spec.label })
  ] });
}
function HexField({ value, alpha, onCommit }) {
  const [draft, setDraft] = (0, import_react20.useState)(null);
  const commit = () => {
    if (draft !== null) {
      const normalized = normalizeHex(draft, alpha);
      if (normalized) onCommit(normalized);
    }
    setDraft(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { className: "dialkit-color-field dialkit-color-field-hex", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "input",
      {
        type: "text",
        spellCheck: false,
        value: (draft ?? value).toUpperCase(),
        onFocus: (e) => {
          setDraft(value);
          e.target.select();
        },
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            setDraft(null);
            e.target.blur();
          }
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "dialkit-color-field-label", children: "HEX" })
  ] });
}
function PaletteSlot({
  color,
  onSave,
  onApply,
  onClear
}) {
  const [holding, setHolding] = (0, import_react20.useState)(false);
  const timerRef = (0, import_react20.useRef)(null);
  const originRef = (0, import_react20.useRef)(null);
  const firedRef = (0, import_react20.useRef)(false);
  const cancelHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    originRef.current = null;
    setHolding(false);
  };
  (0, import_react20.useEffect)(() => () => cancelHold(), []);
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    "button",
    {
      className: "dialkit-color-palette-slot",
      "data-filled": String(color !== null),
      "data-holding": String(holding),
      style: color ? { "--swatch-color": color } : void 0,
      title: color ? `${color.toUpperCase()} \u2014 click to apply, hold to clear` : "Save current color",
      onContextMenu: (e) => e.preventDefault(),
      onPointerDown: (e) => {
        firedRef.current = false;
        if (!color) return;
        originRef.current = { x: e.clientX, y: e.clientY };
        setHolding(true);
        timerRef.current = setTimeout(() => {
          firedRef.current = true;
          cancelHold();
          onClear();
        }, LONG_PRESS_MS);
      },
      onPointerMove: (e) => {
        const origin = originRef.current;
        if (!origin) return;
        if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > PALETTE_DRAG_CANCEL_PX) {
          cancelHold();
        }
      },
      onPointerUp: cancelHold,
      onPointerLeave: cancelHold,
      onPointerCancel: cancelHold,
      onClick: () => {
        if (firedRef.current) {
          firedRef.current = false;
          return;
        }
        if (color) onApply();
        else onSave();
      }
    }
  );
}
function ColorPickerPanel({ value, onChange, alpha = false, palette = false }) {
  const [hsva, setHsva] = (0, import_react20.useState)(() => {
    const rgba2 = parseHex(value);
    return rgba2 ? rgbToHsv(rgba2) : BLACK;
  });
  const [format, setFormat] = (0, import_react20.useState)(stickyFormat);
  const [slots, setSlots] = (0, import_react20.useState)(() => palette ? loadPalette() : emptyPalette());
  const lastEmittedRef = (0, import_react20.useRef)(value);
  (0, import_react20.useEffect)(() => {
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    const rgba2 = parseHex(value);
    if (rgba2) setHsva(rgbToHsv(rgba2));
  }, [value]);
  (0, import_react20.useEffect)(() => {
    if (!palette) return;
    return subscribePalette(setSlots);
  }, [palette]);
  const emit = (0, import_react20.useCallback)(
    (next) => {
      setHsva(next);
      const hex = formatHex(hsvToRgb(next), alpha);
      lastEmittedRef.current = hex;
      onChange(hex);
    },
    [alpha, onChange]
  );
  const applyHex = (0, import_react20.useCallback)(
    (hex) => {
      const rgba2 = parseHex(hex);
      if (!rgba2) return;
      const normalized = formatHex(rgba2, alpha);
      setHsva(rgbToHsv(rgba2));
      lastEmittedRef.current = normalized;
      onChange(normalized);
    },
    [alpha, onChange]
  );
  const hsvaRef = (0, import_react20.useRef)(hsva);
  hsvaRef.current = hsva;
  const svDrag = useAreaDrag(
    (0, import_react20.useCallback)((x, y) => emit({ ...hsvaRef.current, s: x, v: 1 - y }), [emit])
  );
  const hueDrag = useAreaDrag(
    (0, import_react20.useCallback)((x) => emit({ ...hsvaRef.current, h: Math.min(x * 360, 359.999) }), [emit])
  );
  const alphaDrag = useAreaDrag(
    (0, import_react20.useCallback)((x) => emit({ ...hsvaRef.current, a: x }), [emit])
  );
  const rgba = hsvToRgb(hsva);
  const opaqueHex = formatHex(rgba, false);
  const currentHex = formatHex(rgba, alpha);
  const channelSpecs = format === "hex" ? [] : getChannels(format, alpha);
  const channelValues = format === "hex" ? [] : rgbaToChannels(rgba, format, alpha);
  const commitChannel = (index, n) => {
    const next = [...channelValues];
    next[index] = n;
    const committed = channelsToRgba(next, format, alpha);
    const nextHsva = rgbToHsv(committed);
    if (nextHsva.s === 0) nextHsva.h = hsva.h;
    if (nextHsva.v === 0) nextHsva.s = hsva.s;
    emit(nextHsva);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "dialkit-color-picker", style: { "--picker-hue": hsva.h }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "div",
      {
        className: "dialkit-color-sv",
        ref: svDrag.ref,
        onPointerDown: svDrag.onPointerDown,
        onPointerMove: svDrag.onPointerMove,
        onPointerUp: svDrag.onPointerUp,
        onPointerCancel: svDrag.onPointerCancel,
        children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "div",
          {
            className: "dialkit-color-sv-thumb",
            style: { left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: opaqueHex }
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "div",
      {
        className: "dialkit-color-slider dialkit-color-hue",
        ref: hueDrag.ref,
        onPointerDown: hueDrag.onPointerDown,
        onPointerMove: hueDrag.onPointerMove,
        onPointerUp: hueDrag.onPointerUp,
        onPointerCancel: hueDrag.onPointerCancel,
        children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "div",
          {
            className: "dialkit-color-slider-thumb",
            style: { left: `${hsva.h / 360 * 100}%`, background: `hsl(${hsva.h} 100% 50%)` }
          }
        )
      }
    ),
    alpha && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
      "div",
      {
        className: "dialkit-color-slider dialkit-color-alpha dialkit-checker",
        ref: alphaDrag.ref,
        onPointerDown: alphaDrag.onPointerDown,
        onPointerMove: alphaDrag.onPointerMove,
        onPointerUp: alphaDrag.onPointerUp,
        onPointerCancel: alphaDrag.onPointerCancel,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "div",
            {
              className: "dialkit-color-alpha-gradient",
              style: { background: `linear-gradient(to right, transparent, ${opaqueHex})` }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "div",
            {
              className: "dialkit-color-slider-thumb",
              style: { left: `${hsva.a * 100}%`, background: opaqueHex, opacity: Math.max(hsva.a, 0.15) }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      SegmentedControl,
      {
        options: FORMAT_OPTIONS,
        value: format,
        onChange: (f) => {
          stickyFormat = f;
          setFormat(f);
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "dialkit-color-fields", "data-format": format, children: format === "hex" ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(HexField, { value: currentHex, alpha, onCommit: applyHex }),
      alpha && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        ChannelField,
        {
          spec: { key: "a", label: "A", min: 0, max: 100, step: 1, precision: 0 },
          value: opacityPercent(rgba),
          onCommit: (n) => emit({ ...hsva, a: Math.min(1, Math.max(0, n / 100)) })
        }
      )
    ] }) : channelSpecs.map((spec, i) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ChannelField, { spec, value: channelValues[i], onCommit: (n) => commitChannel(i, n) }, `${format}-${spec.key}`)) }),
    palette && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "dialkit-color-palette", children: Array.from({ length: PALETTE_SIZE }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      PaletteSlot,
      {
        color: slots[i] ?? null,
        onSave: () => savePalette(loadPalette().map((s, j) => j === i ? currentHex : s)),
        onApply: () => {
          const saved = slots[i];
          if (saved) applyHex(saved);
        },
        onClear: () => savePalette(loadPalette().map((s, j) => j === i ? null : s))
      },
      i
    )) })
  ] });
}

// src/components/ColorControl.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
var PICKER_WIDTH = 240;
var PICKER_BASE_HEIGHT = 270;
var PICKER_ALPHA_HEIGHT = 22;
var PICKER_PALETTE_HEIGHT = 30;
function ColorControl({ label, value, onChange, alpha = false, palette = false }) {
  const [isEditing, setIsEditing] = (0, import_react21.useState)(false);
  const [editValue, setEditValue] = (0, import_react21.useState)(() => bareHex(value));
  const [isOpen, setIsOpen] = (0, import_react21.useState)(false);
  const swatchRef = (0, import_react21.useRef)(null);
  const pickerRef = (0, import_react21.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react21.useState)(null);
  const [pos, setPos] = (0, import_react21.useState)(null);
  const hexInputRef = (0, import_react21.useRef)(null);
  const rgba = parseHex(value);
  (0, import_react21.useEffect)(() => {
    if (!isEditing) {
      setEditValue(bareHex(value));
    }
  }, [value, isEditing]);
  (0, import_react21.useEffect)(() => {
    if (isEditing) {
      hexInputRef.current?.focus();
      hexInputRef.current?.select();
    }
  }, [isEditing]);
  const updatePos = (0, import_react21.useCallback)(() => {
    const el = swatchRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pickerHeight = PICKER_BASE_HEIGHT + (alpha ? PICKER_ALPHA_HEIGHT : 0) + (palette ? PICKER_PALETTE_HEIGHT : 0);
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PICKER_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  }, [alpha, palette]);
  const open = () => {
    updatePos();
    setIsOpen(true);
  };
  (0, import_react21.useEffect)(() => {
    const root = swatchRef.current?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react21.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e) => {
      const target = e.target;
      if (swatchRef.current?.contains(target) || pickerRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        swatchRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewport);
    window.addEventListener("scroll", onViewport, true);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("scroll", onViewport, true);
    };
  }, [isOpen, updatePos]);
  function handleTextSubmit() {
    setIsEditing(false);
    const normalized = normalizeHexEdit(editValue, alpha, rgba?.a ?? 1);
    if (normalized) {
      onChange(normalized);
    } else {
      setEditValue(bareHex(value));
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleTextSubmit();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setIsEditing(false);
      setEditValue(bareHex(value));
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "dialkit-color-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "dialkit-color-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "dialkit-color-inputs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: "dialkit-color-hex-wrap", onClick: () => setIsEditing(true), children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "dialkit-color-hash", "aria-hidden": "true", children: "#" }),
        isEditing ? /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          "input",
          {
            ref: hexInputRef,
            type: "text",
            className: "dialkit-color-hex-input",
            "aria-label": `Hex color for ${label}`,
            value: editValue,
            onChange: (e) => setEditValue(e.target.value),
            onBlur: handleTextSubmit,
            onKeyDown: handleKeyDown
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "dialkit-color-hex", "aria-label": `Hex color for ${label}`, children: bareHex(value) })
      ] }),
      alpha && rgba && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "dialkit-color-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: "dialkit-color-opacity", children: [
          opacityPercent(rgba),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "dialkit-color-opacity-unit", children: "%" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        "button",
        {
          ref: swatchRef,
          className: "dialkit-color-swatch",
          style: { "--swatch-color": value },
          onClick: () => isOpen ? setIsOpen(false) : open(),
          "data-open": String(isOpen),
          title: "Pick color",
          "aria-label": `Pick color for ${label}`,
          "aria-expanded": isOpen
        }
      )
    ] }),
    portalTarget && (0, import_react_dom3.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_react22.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        import_react22.motion.div,
        {
          ref: pickerRef,
          className: "dialkit-color-picker-popover",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            left: pos.left,
            width: PICKER_WIDTH,
            ...pos.above ? { bottom: window.innerHeight - pos.top, transformOrigin: "bottom right" } : { top: pos.top, transformOrigin: "top right" }
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(ColorPickerPanel, { value, onChange, alpha, palette })
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/GradientControl.tsx
var import_react25 = require("react");
var import_react_dom4 = require("react-dom");
var import_react26 = require("motion/react");

// src/components/GradientPanel.tsx
var import_react24 = require("react");

// src/components/GradientTransformPad.tsx
var import_react23 = require("react");
var import_jsx_runtime20 = require("react/jsx-runtime");
var clamp4 = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var wrap360 = (deg) => (deg % 360 + 360) % 360;
var RAD = Math.PI / 180;
var vectorToAngle = (dx, dy) => wrap360(Math.atan2(dx, -dy) / RAD);
function GradientTransformPad({ value, onChange }) {
  const padRef = (0, import_react23.useRef)(null);
  const drag = (0, import_react23.useRef)(null);
  const [size, setSize] = (0, import_react23.useState)({ w: 0, h: 0 });
  (0, import_react23.useLayoutEffect)(() => {
    const el = padRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { w, h } = size;
  const radial = value.type === "radial";
  const conic = value.type === "conic";
  const cx = value.centerX ?? 50;
  const cy = value.centerY ?? 50;
  const scale = value.scale ?? 100;
  const rotation = value.rotation ?? 0;
  const cxPx = cx / 100 * w;
  const cyPx = cy / 100 * h;
  const rxPx = scale / 100 * w;
  const ryPx = Math.max(10, (value.squash ?? scale) / 100 * h);
  const theta = rotation * RAD;
  const pin = (x, y) => ({ x: clamp4(x, 5, w - 5), y: clamp4(y, 5, h - 5) });
  const major = pin(cxPx + Math.cos(theta) * rxPx, cyPx + Math.sin(theta) * rxPx);
  const minor = pin(cxPx - Math.sin(theta) * ryPx, cyPx + Math.cos(theta) * ryPx);
  const majorLineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
  const majorLineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;
  const angleOx = conic ? cxPx : w / 2;
  const angleOy = conic ? cyPx : h / 2;
  const spokeR = Math.max(10, Math.min(w, h) / 2 - 8);
  const aTheta = value.angle * RAD;
  const angleHandle = pin(angleOx + Math.sin(aTheta) * spokeR, angleOy - Math.cos(aTheta) * spokeR);
  const angleLineLen = Math.hypot(angleHandle.x - angleOx, angleHandle.y - angleOy);
  const angleLineAngle = Math.atan2(angleHandle.y - angleOy, angleHandle.x - angleOx) / RAD;
  const onHandleDown = (kind) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
    }
    drag.current = { kind, pointerId: e.pointerId };
  };
  const onHandleMove = (e) => {
    if (!drag.current || drag.current.pointerId !== e.pointerId || !padRef.current) return;
    const kind = drag.current.kind;
    if (e.buttons === 0) {
      drag.current = null;
      return;
    }
    const rect = padRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (kind === "center") {
      onChange(setGradientCenter(value, px / rect.width * 100, py / rect.height * 100));
      return;
    }
    if (kind === "angle") {
      const ox = conic ? cx / 100 * rect.width : rect.width / 2;
      const oy = conic ? cy / 100 * rect.height : rect.height / 2;
      onChange(setGradientAngle(value, vectorToAngle(px - ox, py - oy)));
      return;
    }
    const dx = px - cx / 100 * rect.width;
    const dy = py - cy / 100 * rect.height;
    const dist = Math.hypot(dx, dy);
    const deg = Math.atan2(dy, dx) / RAD;
    if (kind === "major") {
      const nextScale = dist / rect.width * 100;
      onChange(setGradientScale(setGradientRotation(value, deg), nextScale));
      return;
    }
    const nextSquash = dist / rect.height * 100;
    onChange(setGradientRotation(setGradientSquash(value, nextSquash), deg - 90));
  };
  const onHandleUp = (e) => {
    if (drag.current?.pointerId === e.pointerId) drag.current = null;
  };
  const handleProps = (kind) => ({
    onPointerDown: onHandleDown(kind),
    onPointerMove: onHandleMove,
    onPointerUp: onHandleUp,
    onPointerCancel: onHandleUp,
    onLostPointerCapture: onHandleUp
  });
  const fill = gradientFillBox(value, w, h);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { ref: padRef, className: "dialkit-gradient-pad dialkit-checker", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "div",
      {
        className: "dialkit-gradient-pad-fill",
        style: {
          background: fill.background,
          transform: fill.transform,
          transformOrigin: fill.transformOrigin,
          left: fill.left,
          top: fill.top,
          width: fill.width,
          height: fill.height
        }
      }
    ),
    radial && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "div",
        {
          className: "dialkit-gradient-pad-line",
          style: { left: cxPx, top: cyPx, width: majorLineLen, transform: `rotate(${majorLineAngle}deg)` }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "button",
        {
          type: "button",
          className: "dialkit-gradient-pad-handle",
          "data-kind": "major",
          "aria-label": "Gradient size and rotation",
          style: { left: major.x, top: major.y },
          ...handleProps("major")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "button",
        {
          type: "button",
          className: "dialkit-gradient-pad-handle",
          "data-kind": "minor",
          "aria-label": "Gradient squash",
          style: { left: minor.x, top: minor.y },
          ...handleProps("minor")
        }
      )
    ] }),
    !radial && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "div",
        {
          className: "dialkit-gradient-pad-line",
          style: { left: angleOx, top: angleOy, width: angleLineLen, transform: `rotate(${angleLineAngle}deg)` }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "button",
        {
          type: "button",
          className: "dialkit-gradient-pad-handle",
          "data-kind": "angle",
          "aria-label": "Gradient angle",
          style: { left: angleHandle.x, top: angleHandle.y },
          ...handleProps("angle")
        }
      )
    ] }),
    (radial || conic) && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "button",
      {
        type: "button",
        className: "dialkit-gradient-pad-handle",
        "data-kind": "center",
        "aria-label": "Gradient center",
        style: { left: clamp4(cxPx, 5, w - 5), top: clamp4(cyPx, 5, h - 5) },
        ...handleProps("center")
      }
    )
  ] });
}

// src/components/GradientPanel.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
var TYPE_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
  { value: "conic", label: "Conic" }
];
function rampCss(stops) {
  return gradientToCss({ type: "linear", angle: 90, stops });
}
function GradientPanel({ value, onChange, onDrag }) {
  const [selectedIndex, setSelectedIndex] = (0, import_react24.useState)(0);
  const [holdingIndex, setHoldingIndex] = (0, import_react24.useState)(-1);
  const [detach, setDetach] = (0, import_react24.useState)(null);
  const stripRef = (0, import_react24.useRef)(null);
  const gripRef = (0, import_react24.useRef)(null);
  const gripOrigin = (0, import_react24.useRef)(null);
  const onGripDown = (e) => {
    e.preventDefault();
    try {
      gripRef.current?.setPointerCapture(e.pointerId);
    } catch {
    }
    gripOrigin.current = { x: e.clientX, y: e.clientY };
  };
  const onGripMove = (e) => {
    if (!gripOrigin.current || e.buttons === 0) return;
    onDrag?.(e.clientX - gripOrigin.current.x, e.clientY - gripOrigin.current.y);
    gripOrigin.current = { x: e.clientX, y: e.clientY };
  };
  const onGripUp = () => {
    gripOrigin.current = null;
  };
  const drag = (0, import_react24.useRef)({ mode: "idle", activeIndex: -1, originX: 0, originY: 0, timer: null, working: value });
  const valueRef = (0, import_react24.useRef)(value);
  valueRef.current = value;
  (0, import_react24.useEffect)(() => () => {
    if (drag.current.timer) clearTimeout(drag.current.timer);
  }, []);
  const safeIndex = Math.min(selectedIndex, value.stops.length - 1);
  const stripPos = (clientX) => {
    const rect = stripRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const stripCenterY = () => {
    const rect = stripRef.current.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };
  const clearTimer = () => {
    if (drag.current.timer) clearTimeout(drag.current.timer);
    drag.current.timer = null;
  };
  const resetDrag = () => {
    clearTimer();
    drag.current.mode = "idle";
    setHoldingIndex(-1);
  };
  const commitMove = (clientX) => {
    const r = moveStop(drag.current.working, drag.current.activeIndex, stripPos(clientX));
    drag.current.working = r.value;
    drag.current.activeIndex = r.index;
    setSelectedIndex(r.index);
    onChange(r.value);
  };
  const onPointerDown = (e) => {
    e.preventDefault();
    try {
      stripRef.current?.setPointerCapture(e.pointerId);
    } catch {
    }
    const d = drag.current;
    d.originX = e.clientX;
    d.originY = e.clientY;
    d.working = value;
    const handle = e.target.closest(".dialkit-gradient-stop");
    if (handle) {
      const index2 = Number(handle.dataset.index);
      setSelectedIndex(index2);
      d.activeIndex = index2;
      d.mode = "pending";
      if (value.stops.length > MIN_STOPS) {
        setHoldingIndex(index2);
        d.timer = setTimeout(() => {
          d.timer = null;
          d.mode = "idle";
          setHoldingIndex(-1);
          const next2 = removeStop(valueRef.current, index2);
          onChange(next2);
          setSelectedIndex(Math.min(index2, next2.stops.length - 1));
        }, LONG_PRESS_MS);
      }
      return;
    }
    const { value: next, index } = addStop(value, stripPos(e.clientX));
    d.working = next;
    d.activeIndex = index;
    d.mode = "dragging";
    setSelectedIndex(index);
    onChange(next);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (d.mode === "idle") return;
    if (e.buttons === 0) {
      setDetach(null);
      resetDrag();
      return;
    }
    if (d.mode === "pending") {
      if (Math.hypot(e.clientX - d.originX, e.clientY - d.originY) <= PALETTE_DRAG_CANCEL_PX) return;
      clearTimer();
      setHoldingIndex(-1);
      d.mode = "dragging";
    }
    if (d.mode === "dragging") {
      const offV = e.clientY - stripCenterY();
      if (d.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
        d.mode = "detached";
        setDetach({ index: d.activeIndex, y: offV });
        return;
      }
      commitMove(e.clientX);
      return;
    }
    if (d.mode === "detached") {
      const offV = e.clientY - stripCenterY();
      if (Math.abs(offV) <= STOP_DETACH_PX) {
        d.mode = "dragging";
        setDetach(null);
        commitMove(e.clientX);
      } else {
        setDetach({ index: d.activeIndex, y: offV });
      }
    }
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (d.mode === "detached") {
      const next = removeStop(d.working, d.activeIndex);
      onChange(next);
      setSelectedIndex(Math.min(d.activeIndex, next.stops.length - 1));
    }
    setDetach(null);
    resetDrag();
  };
  const previewStops = detach ? value.stops.filter((_, i) => i !== detach.index) : value.stops;
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "dialkit-gradient-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "dialkit-gradient-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        "button",
        {
          ref: gripRef,
          type: "button",
          className: "dialkit-gradient-grip",
          "aria-label": "Drag to move",
          title: "Drag to move",
          onPointerDown: onGripDown,
          onPointerMove: onGripMove,
          onPointerUp: onGripUp,
          onPointerCancel: onGripUp,
          onLostPointerCapture: onGripUp,
          children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: ICON_GRIP.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("circle", { cx: c.cx, cy: c.cy, r: "1.5" }, i)) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        SegmentedControl,
        {
          options: TYPE_OPTIONS,
          value: value.type,
          onChange: (t) => onChange(setGradientType(value, t))
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(GradientTransformPad, { value, onChange }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
      "div",
      {
        ref: stripRef,
        className: "dialkit-gradient-strip",
        style: { "--gradient-ramp": rampCss(previewStops) },
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        children: value.stops.map((stop, i) => {
          const detaching = detach?.index === i;
          return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
            "button",
            {
              type: "button",
              className: "dialkit-gradient-stop",
              "data-index": i,
              "data-selected": String(i === safeIndex),
              "data-holding": String(i === holdingIndex),
              "data-detaching": String(detaching),
              style: {
                left: `${stop.position * 100}%`,
                zIndex: i === safeIndex ? 99 : i + 1,
                "--swatch-color": stop.color,
                "--detach-y": detaching ? `${detach.y}px` : "0px"
              },
              "aria-label": `Gradient stop ${i + 1}`
            },
            i
          );
        })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "dialkit-gradient-divider", "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
      ColorPickerPanel,
      {
        value: value.stops[safeIndex].color,
        alpha: true,
        palette: false,
        onChange: (hex) => onChange(setStopColor(value, safeIndex, hex))
      },
      safeIndex
    )
  ] });
}

// src/components/GradientControl.tsx
var import_jsx_runtime22 = require("react/jsx-runtime");
var PANEL_WIDTH = 240;
var PANEL_HEIGHT_ANGLED = 470;
var PANEL_HEIGHT_RADIAL = 430;
function GradientControl({ label, value, onChange }) {
  const [isOpen, setIsOpen] = (0, import_react25.useState)(false);
  const triggerRef = (0, import_react25.useRef)(null);
  const panelRef = (0, import_react25.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react25.useState)(null);
  const [pos, setPos] = (0, import_react25.useState)(null);
  const [dragPos, setDragPos] = (0, import_react25.useState)(null);
  const onPanelDrag = (0, import_react25.useCallback)((dx, dy) => {
    setDragPos((prev) => {
      let base = prev;
      if (!base) {
        const el = panelRef.current;
        if (!pos || !el) return prev;
        base = { left: pos.left, top: pos.above ? pos.top - el.offsetHeight : pos.top };
      }
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      return { left, top };
    });
  }, [pos]);
  const updatePos = (0, import_react25.useCallback)(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const panelHeight = value.type === "radial" ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < panelHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PANEL_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  }, [value.type]);
  const open = () => {
    setDragPos(null);
    updatePos();
    setIsOpen(true);
  };
  (0, import_react25.useEffect)(() => {
    const root = triggerRef.current?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react25.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewport);
    window.addEventListener("scroll", onViewport, true);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("scroll", onViewport, true);
    };
  }, [isOpen, updatePos]);
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "dialkit-gradient-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "dialkit-gradient-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      "button",
      {
        ref: triggerRef,
        className: "dialkit-gradient-preview dialkit-checker",
        style: { "--gradient-preview": gradientToCss(value) },
        onClick: () => isOpen ? setIsOpen(false) : open(),
        "data-open": String(isOpen),
        title: "Edit gradient",
        "aria-label": `Edit gradient for ${label}`,
        "aria-expanded": isOpen
      }
    ),
    portalTarget && (0, import_react_dom4.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_react26.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        import_react26.motion.div,
        {
          ref: panelRef,
          className: "dialkit-gradient-popover",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            width: PANEL_WIDTH,
            ...dragPos ? { left: dragPos.left, top: dragPos.top, transformOrigin: "top left" } : pos.above ? { left: pos.left, bottom: window.innerHeight - pos.top, transformOrigin: "bottom right" } : { left: pos.left, top: pos.top, transformOrigin: "top right" }
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(GradientPanel, { value, onChange, onDrag: onPanelDrag })
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/XYPad.tsx
var import_react27 = require("react");
var import_jsx_runtime23 = require("react/jsx-runtime");
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
function XYPad({
  label,
  value,
  onChange,
  x,
  y,
  size = 160,
  grid,
  density = 1,
  snap = false,
  returnToCenter = false,
  showValues = false,
  disabled = false,
  formatValue,
  shortcut,
  shortcutActive
}) {
  const xAxis = resolveAxis(x);
  const yAxis = resolveAxis(y);
  const areaRef = (0, import_react27.useRef)(null);
  const draggingRef = (0, import_react27.useRef)(false);
  const [active, setActive] = (0, import_react27.useState)(false);
  const [dragging, setDragging] = (0, import_react27.useState)(false);
  const valueRef = (0, import_react27.useRef)(value);
  valueRef.current = value;
  const pointToValue = (0, import_react27.useCallback)(
    (clientX, clientY, fine) => {
      const el = areaRef.current;
      if (!el) return valueRef.current;
      const rect = el.getBoundingClientRect();
      let px = (clientX - rect.left) / rect.width;
      let py = (clientY - rect.top) / rect.height;
      if (fine) {
        const cur = pointFromValue(valueRef.current, xAxis, yAxis);
        px = cur.x + (px - cur.x) * FINE_DRAG;
        py = cur.y + (py - cur.y) * FINE_DRAG;
      }
      px = Math.min(1, Math.max(0, px));
      py = Math.min(1, Math.max(0, py));
      const next = valueFromPoint({ x: px, y: py }, xAxis, yAxis, snap);
      const originPoint = pointFromValue({ x: xAxis.origin, y: yAxis.origin }, xAxis, yAxis);
      const dxPx = Math.abs(px - originPoint.x) * rect.width;
      const dyPx = Math.abs(py - originPoint.y) * rect.height;
      return {
        x: applyDetentAxis(next.x, xAxis, dxPx),
        y: applyDetentAxis(next.y, yAxis, dyPx)
      };
    },
    [xAxis, yAxis, snap]
  );
  const emit = (0, import_react27.useCallback)(
    (next) => {
      valueRef.current = next;
      onChange(next);
    },
    [onChange]
  );
  const handlePointerDown = (e) => {
    if (disabled) return;
    if (e.button !== 0 || !e.isPrimary) return;
    if (e.altKey) return;
    e.preventDefault();
    try {
      areaRef.current?.setPointerCapture(e.pointerId);
    } catch {
    }
    areaRef.current?.focus();
    draggingRef.current = true;
    setActive(true);
    setDragging(true);
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    if (e.buttons === 0) {
      finishDrag(e);
      return;
    }
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const finishDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    try {
      areaRef.current?.releasePointerCapture(e.pointerId);
    } catch {
    }
    const el = areaRef.current;
    const stillActive = (el?.matches(":hover") ?? false) || el === (el?.ownerDocument ?? document).activeElement;
    if (!stillActive) setActive(false);
    if (returnToCenter) emit(normalizeValue(centerValue(xAxis, yAxis), xAxis, yAxis, snap));
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    const mode = e.shiftKey ? "coarse" : e.altKey ? "fine" : "normal";
    const cur = valueRef.current;
    const ctrl = e.ctrlKey || e.metaKey;
    let next = null;
    switch (e.key) {
      case "ArrowUp":
        next = nudge(cur, "y", 1, xAxis, yAxis, mode);
        break;
      case "ArrowDown":
        next = nudge(cur, "y", -1, xAxis, yAxis, mode);
        break;
      case "ArrowRight":
        next = nudge(cur, "x", 1, xAxis, yAxis, mode);
        break;
      case "ArrowLeft":
        next = nudge(cur, "x", -1, xAxis, yAxis, mode);
        break;
      case "PageUp":
        next = nudge(cur, "y", 1, xAxis, yAxis, "coarse");
        break;
      case "PageDown":
        next = nudge(cur, "y", -1, xAxis, yAxis, "coarse");
        break;
      case "Home":
        next = ctrl ? { x: xAxis.min, y: yAxis.min } : { x: xAxis.min, y: cur.y };
        break;
      case "End":
        next = ctrl ? { x: xAxis.max, y: yAxis.max } : { x: xAxis.max, y: cur.y };
        break;
      default:
        return;
    }
    e.preventDefault();
    emit(next);
  };
  const reset = () => {
    if (disabled) return;
    emit(normalizeValue(centerValue(xAxis, yAxis), xAxis, yAxis, snap));
  };
  const xLabel = x?.label ?? "X";
  const yLabel = y?.label ?? "Y";
  const xText = `${xLabel} ${formatComponent(value.x, xAxis)}`;
  const yText = `${yLabel} ${formatComponent(value.y, yAxis)}`;
  const xVisual = showValues ? xText : xLabel;
  const yVisual = showValues ? yText : yLabel;
  const readout = formatValue ? formatValue(value) : `${xText}  ${yText}`;
  const dens = typeof density === "number" && density > 0 ? density : 1;
  let baseX, baseY;
  if (grid === false) {
    baseX = 0;
    baseY = 0;
  } else if (typeof grid === "number") {
    baseX = grid;
    baseY = grid;
  } else {
    baseX = DEFAULT_GRID_X;
    baseY = DEFAULT_GRID_Y;
  }
  const gridX = baseX > 0 ? Math.round(baseX * dens) : 0;
  const gridY = baseY > 0 ? Math.round(baseY * dens) : 0;
  const showGrid = gridX > 0 && gridY > 0;
  const point = pointFromValue(value, xAxis, yAxis);
  const leftPct = `${point.x * 100}%`;
  const topPct = `${point.y * 100}%`;
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "dialkit-xy", "data-active": String(active), "data-disabled": String(disabled), children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "dialkit-xy-header", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("span", { className: "dialkit-xy-label", children: [
      label,
      shortcut && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: `dialkit-shortcut-pill${shortcutActive ? " dialkit-shortcut-pill-active" : ""}`, children: formatSliderShortcut(shortcut) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
      "div",
      {
        ref: areaRef,
        className: "dialkit-xy-area",
        style: { height: size },
        role: "application",
        "aria-roledescription": "2D pad",
        "aria-label": label,
        "aria-valuetext": readout,
        "aria-valuemin": xAxis.min,
        "aria-valuemax": xAxis.max,
        "aria-valuenow": value.x,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : 0,
        "data-active": String(active),
        "data-dragging": String(dragging),
        "data-disabled": String(disabled),
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: finishDrag,
        onPointerCancel: finishDrag,
        onDoubleClick: reset,
        onClick: (e) => {
          if (e.altKey) reset();
        },
        onKeyDown: handleKeyDown,
        onFocus: () => setActive(true),
        onBlur: () => setActive(false),
        onPointerEnter: () => setActive(true),
        onPointerLeave: () => {
          if (!draggingRef.current) setActive(false);
        },
        children: [
          showGrid && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            "div",
            {
              className: "dialkit-xy-grid",
              "aria-hidden": "true",
              style: {
                "--dial-xy-grid-step-x": `${100 / gridX}%`,
                "--dial-xy-grid-step-y": `${100 / gridY}%`
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "dialkit-xy-axis dialkit-xy-axis-x", "aria-hidden": "true", children: xVisual }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "dialkit-xy-axis dialkit-xy-axis-y", "aria-hidden": "true", children: yVisual }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "dialkit-xy-guide dialkit-xy-guide-v", "aria-hidden": "true", style: { left: leftPct } }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "dialkit-xy-guide dialkit-xy-guide-h", "aria-hidden": "true", style: { top: topPct } }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "dialkit-xy-thumb", "aria-hidden": "true", style: { left: leftPct, top: topPct } })
        ]
      }
    )
  ] });
}

// src/components/XYControl.tsx
var import_jsx_runtime24 = require("react/jsx-runtime");
function XYControl({ label, value, onChange, x, y, grid, density, snap, returnToCenter, showValues, shortcut, shortcutActive }) {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    XYPad,
    {
      label,
      value,
      onChange,
      x,
      y,
      grid,
      density,
      snap,
      returnToCenter,
      showValues,
      shortcut,
      shortcutActive
    }
  );
}

// src/components/GalleryControl.tsx
var import_react28 = require("react");
var import_jsx_runtime25 = require("react/jsx-runtime");
function itemContent(item, skeleton) {
  if (item.render) return item.render();
  if (!item.src) return null;
  return skeleton ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(GalleryImage, { item }) : /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("img", { src: item.src, alt: "", draggable: false });
}
function GalleryImage({ item }) {
  const [loaded, setLoaded] = (0, import_react28.useState)(false);
  const imgRef = (0, import_react28.useRef)(null);
  (0, import_react28.useEffect)(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    const done = () => setLoaded(true);
    img.addEventListener("load", done);
    img.addEventListener("error", done);
    return () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
    "span",
    {
      className: "dialkit-gallery-media",
      "data-fixed": item.aspect ? "true" : "false",
      style: item.aspect ? { aspectRatio: String(item.aspect) } : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "dialkit-gallery-skeleton", "data-done": String(loaded), "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          "img",
          {
            ref: imgRef,
            className: "dialkit-gallery-img",
            "data-loaded": String(loaded),
            src: item.src,
            alt: item.alt ?? "",
            loading: "lazy",
            decoding: "async",
            draggable: false
          }
        )
      ]
    }
  );
}
function GalleryControl({ label, value, items, onChange, columns = 2 }) {
  const [isOpen, setIsOpen] = (0, import_react28.useState)(false);
  const selected = items.find((it) => it.id === value) ?? items[0];
  const preview = selected ? itemContent(selected, false) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "dialkit-gallery", "data-open": String(isOpen), children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
      "button",
      {
        type: "button",
        className: "dialkit-gallery-trigger",
        "aria-expanded": isOpen,
        onClick: () => setIsOpen((o) => !o),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "dialkit-gallery-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { className: "dialkit-gallery-right", children: [
            preview && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "dialkit-gallery-preview", "aria-hidden": "true", children: preview }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              "svg",
              {
                className: "dialkit-gallery-chevron",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("path", { d: ICON_CHEVRON })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "dialkit-gallery-reveal", "aria-hidden": !isOpen, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "dialkit-gallery-reveal-inner", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "dialkit-gallery-box", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "dialkit-gallery-masonry", style: { columnCount: columns }, children: items.map((item) => {
      const isSelected = item.id === value;
      return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
        "button",
        {
          type: "button",
          className: "dialkit-gallery-item",
          "data-selected": String(isSelected),
          "aria-pressed": isSelected,
          tabIndex: isOpen ? 0 : -1,
          style: item.aspect && !item.src ? { aspectRatio: String(item.aspect) } : void 0,
          onClick: () => onChange(item.id),
          children: [
            itemContent(item, true),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "dialkit-gallery-check", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("path", { d: ICON_CHECK }) }) })
          ]
        },
        item.id
      );
    }) }) }) }) })
  ] });
}

// src/components/FileControl.tsx
var import_react29 = require("react");
var import_jsx_runtime26 = require("react/jsx-runtime");
function FileControl({ label, value, accept, multiple = false, onChange, onPick }) {
  const inputRef = (0, import_react29.useRef)(null);
  const handleChange = (e) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    onPick(files);
    onChange(files.length === 1 ? files[0].name : `${files.length} files`);
  };
  const clear = (e) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = "";
    onChange("");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "dialkit-file-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("button", { type: "button", className: "dialkit-file-trigger", onClick: () => inputRef.current?.click(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "dialkit-file-label", children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("span", { className: "dialkit-file-right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          "svg",
          {
            className: "dialkit-file-icon",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.6",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            "aria-hidden": "true",
            children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("path", { d: ICON_FILE })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "dialkit-file-name", "data-empty": String(!value), children: value || "Choose file\u2026" })
      ] })
    ] }),
    value && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("button", { type: "button", className: "dialkit-file-clear", onClick: clear, "aria-label": "Clear file", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("path", { d: ICON_CLOSE }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
      "input",
      {
        ref: inputRef,
        className: "dialkit-file-input",
        type: "file",
        accept,
        multiple,
        onChange: handleChange
      }
    )
  ] });
}

// src/components/SwatchControl.tsx
var import_react30 = require("react");
var import_react_dom5 = require("react-dom");
var import_react31 = require("motion/react");
var import_jsx_runtime27 = require("react/jsx-runtime");
function Preview({ colors }) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "dialkit-swatch-preview", "aria-hidden": "true", children: colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "dialkit-swatch-chip", style: { background: c } }, i)) });
}
function SwatchControl({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = (0, import_react30.useState)(false);
  const [highlight, setHighlight] = (0, import_react30.useState)(-1);
  const triggerRef = (0, import_react30.useRef)(null);
  const dropdownRef = (0, import_react30.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react30.useState)(null);
  const [pos, setPos] = (0, import_react30.useState)(null);
  const selectedOption = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const updatePos = (0, import_react30.useCallback)(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dropdownHeight = 8 + options.length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left: rect.left, width: rect.width, above });
  }, [options.length]);
  const open = () => {
    updatePos();
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };
  const select = (v) => {
    onChange(v);
    setIsOpen(false);
  };
  const onKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlight >= 0 && highlight < options.length) select(options[highlight].value);
    }
  };
  (0, import_react30.useEffect)(() => {
    const root = triggerRef.current?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react30.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onViewport);
    window.addEventListener("scroll", onViewport, true);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("scroll", onViewport, true);
    };
  }, [isOpen, updatePos]);
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "dialkit-select-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "dialkit-select-trigger",
        onClick: () => isOpen ? setIsOpen(false) : open(),
        onKeyDown,
        "data-open": String(isOpen),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "dialkit-select-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "dialkit-select-right", children: [
            selectedOption && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Preview, { colors: selectedOption.colors }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "dialkit-select-value", children: selectedOption?.label ?? value }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              import_react31.motion.svg,
              {
                className: "dialkit-select-chevron",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                animate: { rotate: isOpen ? 180 : 0 },
                transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
                children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: ICON_CHEVRON })
              }
            )
          ] })
        ]
      }
    ),
    portalTarget && (0, import_react_dom5.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_react31.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "dialkit-select-dropdown",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            left: pos.left,
            width: pos.width,
            ...pos.above ? { bottom: window.innerHeight - pos.top, transformOrigin: "bottom" } : { top: pos.top, transformOrigin: "top" }
          },
          children: options.map((option, i) => /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
            "button",
            {
              className: "dialkit-select-option dialkit-swatch-option",
              "data-selected": String(option.value === value),
              "data-highlight": String(i === highlight),
              onClick: () => select(option.value),
              onMouseEnter: () => setHighlight(i),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Preview, { colors: option.colors }),
                /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "dialkit-swatch-option-label", children: option.label })
              ]
            },
            option.value
          ))
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/ChipsControl.tsx
var import_jsx_runtime28 = require("react/jsx-runtime");
function ChipsControl({ label, value, options, onChange, onRemove }) {
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "dialkit-chips", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "dialkit-chips-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "dialkit-chips-grid", role: "listbox", "aria-label": label, children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "dialkit-chip", "data-active": String(option.value === value), children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
        "button",
        {
          type: "button",
          className: "dialkit-chip-select",
          role: "option",
          "aria-selected": option.value === value,
          onClick: () => onChange(option.value),
          children: option.label
        }
      ),
      option.removable && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
        "button",
        {
          type: "button",
          className: "dialkit-chip-remove",
          "aria-label": `Remove ${option.label}`,
          onClick: () => onRemove(option.value),
          children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("path", { d: ICON_CLOSE }) })
        }
      )
    ] }, option.value)) })
  ] });
}

// src/components/MultiSelectControl.tsx
var import_jsx_runtime29 = require("react/jsx-runtime");
function toggle(value, options, toggled) {
  const next = new Set(value);
  if (next.has(toggled)) next.delete(toggled);
  else next.add(toggled);
  return options.filter((o) => next.has(o.value)).map((o) => o.value);
}
function MultiSelectControl({ label, value, options, onChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "dialkit-multiselect", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "dialkit-multiselect-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "dialkit-multiselect-list", role: "listbox", "aria-label": label, "aria-multiselectable": "true", children: options.map((option) => {
      const checked = value.includes(option.value);
      return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
        "button",
        {
          type: "button",
          className: "dialkit-multiselect-row",
          role: "option",
          "aria-selected": checked,
          "data-checked": String(checked),
          onClick: () => onChange(toggle(value, options, option.value)),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "dialkit-multiselect-box", "aria-hidden": "true", children: checked && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: ICON_CHECK }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("span", { className: "dialkit-multiselect-text", children: [
              /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("span", { className: "dialkit-multiselect-line", children: [
                option.label,
                option.tag && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "dialkit-multiselect-tag", children: option.tag })
              ] }),
              option.hint && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "dialkit-multiselect-hint", children: option.hint })
            ] })
          ]
        },
        option.value
      );
    }) })
  ] });
}

// src/components/ListControl.tsx
var import_react32 = require("react");
var import_jsx_runtime30 = require("react/jsx-runtime");
function FieldControl({ field, value, onChange }) {
  switch (field.kind) {
    case "slider":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Slider, { label: field.label, value, min: field.min, max: field.max, step: field.step, onChange });
    case "toggle":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Toggle, { label: field.label, checked: value, onChange });
    case "select":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(SelectControl, { label: field.label, value, options: field.options ?? [], onChange });
    case "color":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(ColorControl, { label: field.label, value, palette: field.palette, onChange });
    case "swatch":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(SwatchControl, { label: field.label, value, options: field.swatchOptions ?? [], onChange });
    case "text":
      return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(TextControl, { label: field.label, value, onChange, placeholder: field.placeholder });
    default:
      return null;
  }
}
function FieldList({
  fields,
  params,
  rowId,
  onChange
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "dialkit-list-item-fields", children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(ControlShell, { hint: field.hint, id: hintDomId(rowId, field.key), children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
    FieldControl,
    {
      field,
      value: params[field.key],
      onChange: (v) => onChange(field.key, v)
    }
  ) }, field.key)) });
}
function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent }) {
  const idCounter = (0, import_react32.useRef)(0);
  const mkId = () => `li-${idCounter.current++}`;
  const [ids, setIds] = (0, import_react32.useState)(() => value.map(mkId));
  const [picking, setPicking] = (0, import_react32.useState)(false);
  const [editing, setEditing] = (0, import_react32.useState)(null);
  const armedRef = (0, import_react32.useRef)(null);
  const [dragIndex, setDragIndex] = (0, import_react32.useState)(null);
  const [over, setOver] = (0, import_react32.useState)(null);
  if (ids.length !== value.length) {
    setIds((cur) => value.map((_, i) => cur[i] ?? mkId()));
  }
  (0, import_react32.useEffect)(() => {
    const disarm = () => {
      armedRef.current = null;
    };
    window.addEventListener("mouseup", disarm);
    return () => window.removeEventListener("mouseup", disarm);
  }, []);
  const typeEntries = Object.entries(itemTypes);
  const atCapacity = maxItems != null && value.length >= maxItems;
  const addItem = (type) => {
    if (atCapacity || !itemTypes[type]) return;
    const next = [...value, { type, params: defaultListItemParams(itemTypes[type].schema) }];
    setIds((cur) => [...cur, mkId()]);
    onChange(next);
    onEvent({ kind: "list", op: "add", index: next.length - 1, itemType: type });
  };
  const removeItem = (index) => {
    setIds((cur) => cur.filter((_, i) => i !== index));
    onChange(value.filter((_, i) => i !== index));
    onEvent({ kind: "list", op: "remove", index });
  };
  const moveItem = (from, to) => {
    if (from === to || to < 0 || to >= value.length) return;
    const reorder = (arr) => {
      const out = arr.slice();
      const [moved] = out.splice(from, 1);
      out.splice(to, 0, moved);
      return out;
    };
    setIds(reorder);
    onChange(reorder(value));
    onEvent({ kind: "list", op: "move", from, to });
  };
  const commitTitle = (index, raw) => {
    setEditing(null);
    const next = raw.trim();
    if ((value[index]?.title ?? "") === next) return;
    onChange(
      value.map((item, i) => {
        if (i !== index) return item;
        const row = { type: item.type, params: item.params };
        if (next) row.title = next;
        return row;
      })
    );
    onEvent({ kind: "list", op: "rename", index });
  };
  const setParam = (index, key, v) => {
    onChange(value.map((item, i) => i === index ? { ...item, params: { ...item.params, [key]: v } } : item));
    onEvent({ kind: "list", op: "set", index });
  };
  const handleAdd = () => {
    if (typeEntries.length === 1) addItem(typeEntries[0][0]);
    else setPicking((p) => !p);
  };
  const onDrop = () => {
    if (dragIndex !== null && over !== null) {
      let to = over.after ? over.index + 1 : over.index;
      if (dragIndex < to) to -= 1;
      moveItem(dragIndex, to);
    }
    armedRef.current = null;
    setDragIndex(null);
    setOver(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(Folder, { title: label, defaultOpen: true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "dialkit-list-items", onDragOver: (e) => e.preventDefault(), onDrop, children: [
      value.map((item, index) => {
        const type = itemTypes[item.type];
        if (!type) return null;
        const { flat, groups } = groupListFields(parseListItemSchema(type.schema, type.hints, type.groups));
        const overState = over?.index === index ? over.after ? "after" : "before" : void 0;
        const rowTitle = item.title ?? type.label;
        return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
          "div",
          {
            className: "dialkit-list-item",
            draggable: editing !== index,
            "data-dragging": dragIndex === index ? "true" : void 0,
            "data-over": overState,
            onDragStart: (e) => {
              if (armedRef.current !== index) {
                e.preventDefault();
                return;
              }
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(index));
              setDragIndex(index);
            },
            onDragOver: (e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const after = e.clientY > rect.top + rect.height / 2;
              setOver((o) => o?.index === index && o.after === after ? o : { index, after });
            },
            onDragEnd: () => {
              armedRef.current = null;
              setDragIndex(null);
              setOver(null);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "dialkit-list-item-head", children: [
                /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "dialkit-list-drag",
                    "aria-label": "Drag to reorder",
                    onMouseDown: () => {
                      armedRef.current = index;
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: ICON_GRIP.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("circle", { cx: c.cx, cy: c.cy, r: "1.5" }, i)) })
                  }
                ),
                editing === index ? (
                  // Uncontrolled: the field owns the draft, so Escape can restore
                  // the original and let the shared blur path no-op it away.
                  /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                    "input",
                    {
                      className: "dialkit-list-item-title",
                      defaultValue: item.title ?? "",
                      placeholder: type.label,
                      autoFocus: true,
                      onFocus: (e) => e.currentTarget.select(),
                      onBlur: (e) => commitTitle(index, e.currentTarget.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        else if (e.key === "Escape") {
                          e.currentTarget.value = item.title ?? "";
                          e.currentTarget.blur();
                        }
                      }
                    }
                  )
                ) : /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "dialkit-list-item-title",
                    "aria-label": `Rename ${rowTitle}`,
                    onClick: () => setEditing(index),
                    children: rowTitle
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "dialkit-list-item-actions", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "dialkit-list-icon-btn dialkit-list-remove",
                    onClick: () => removeItem(index),
                    "aria-label": `Remove ${rowTitle}`,
                    children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_TRASH.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("path", { d }, i)) })
                  }
                ) })
              ] }),
              flat.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                FieldList,
                {
                  fields: flat,
                  params: item.params,
                  rowId: ids[index],
                  onChange: (key, v) => setParam(index, key, v)
                }
              ),
              groups.map((group, groupIndex) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Folder, { title: group.label, defaultOpen: groupIndex === 0, children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                FieldList,
                {
                  fields: group.fields,
                  params: item.params,
                  rowId: ids[index],
                  onChange: (key, v) => setParam(index, key, v)
                }
              ) }, group.label))
            ]
          },
          ids[index]
        );
      }),
      value.length === 0 && !picking && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "dialkit-list-empty", children: "No items yet" })
    ] }),
    !atCapacity && /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "dialkit-list-add", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("button", { type: "button", className: "dialkit-list-add-btn", "data-open": String(picking), onClick: handleAdd, children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("path", { d: ICON_PLUS }) }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { children: addLabel ?? "Add" })
      ] }),
      typeEntries.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "dialkit-list-picker", "data-open": String(picking), children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "dialkit-list-picker-inner", children: typeEntries.map(([key, type]) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        "button",
        {
          type: "button",
          className: "dialkit-list-picker-chip",
          onClick: () => {
            addItem(key);
            setPicking(false);
          },
          children: type.label
        },
        key
      )) }) })
    ] })
  ] });
}

// src/components/CurvePreview.tsx
var import_react33 = require("react");

// src/curve-preview-core.ts
var CURVE_SAMPLE_COUNT = 160;
var CURVE_MIN_HEIGHT = 32;
var CURVE_MAX_HEIGHT = 160;
var CURVE_DEFAULT_HEIGHT = 64;
var CURVE_FIT_PADDING = 0.05;
function clampCurveHeight(height) {
  if (typeof height !== "number" || !Number.isFinite(height)) return CURVE_DEFAULT_HEIGHT;
  return Math.min(CURVE_MAX_HEIGHT, Math.max(CURVE_MIN_HEIGHT, height));
}
function plotCurve(sample, options = {}) {
  const count = Math.max(2, Math.floor(options.count ?? CURVE_SAMPLE_COUNT));
  const ys = new Array(count);
  for (let i = 0; i < count; i++) {
    let y;
    try {
      y = sample(i / (count - 1));
    } catch {
      y = NaN;
    }
    ys[i] = typeof y === "number" ? y : NaN;
  }
  let domain;
  const explicit = options.domain;
  if (explicit && Number.isFinite(explicit[0]) && Number.isFinite(explicit[1]) && explicit[0] < explicit[1]) {
    domain = [explicit[0], explicit[1]];
  } else {
    const finite = ys.filter((y) => Number.isFinite(y));
    if (finite.length === 0) {
      domain = [0, 1];
    } else {
      let lo2 = Math.min(...finite);
      let hi2 = Math.max(...finite);
      if (lo2 === hi2) {
        lo2 -= 0.5;
        hi2 += 0.5;
      }
      const pad = (hi2 - lo2) * CURVE_FIT_PADDING;
      domain = [lo2 - pad, hi2 + pad];
    }
  }
  const [lo, hi] = domain;
  const span = hi - lo;
  const segments = [];
  let current = null;
  for (let i = 0; i < count; i++) {
    if (!Number.isFinite(ys[i])) {
      current = null;
      continue;
    }
    if (!current) {
      current = [];
      segments.push(current);
    }
    current.push({ t: i / (count - 1), v: (ys[i] - lo) / span });
  }
  const baseline = lo < 0 && hi > 0 ? (0 - lo) / span : null;
  return { segments, domain, baseline };
}
function normalizeCurveMarkers(markers) {
  if (!markers) return [];
  return markers.filter((m) => typeof m === "number" && Number.isFinite(m) && m >= 0 && m <= 1);
}
function curveY(v, height, pad = 0) {
  return pad + (1 - v) * (height - pad * 2);
}
function curvePathData(segments, width, height, pad = 0) {
  return segments.map(
    (segment) => segment.map((p, i) => `${i === 0 ? "M" : "L"} ${round3(p.t * width)} ${round3(curveY(p.v, height, pad))}`).join(" ")
  ).join(" ");
}
function round3(value) {
  return Math.round(value * 100) / 100;
}

// src/components/CurvePreview.tsx
var import_jsx_runtime31 = require("react/jsx-runtime");
var VIEW_WIDTH = 232;
var PAD_Y = 4;
function CurvePreview({ panelId, control }) {
  const subscribe = (0, import_react33.useCallback)(
    (callback) => DialStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const sample = (0, import_react33.useSyncExternalStore)(subscribe, () => control.sample, () => control.sample);
  const markers = (0, import_react33.useSyncExternalStore)(subscribe, () => control.markers, () => control.markers);
  const height = clampCurveHeight(control.height);
  const plot = plotCurve(sample ?? (() => NaN), { domain: control.domain });
  const pathData = curvePathData(plot.segments, VIEW_WIDTH, height, PAD_Y);
  const baselineY = plot.baseline !== null ? curveY(plot.baseline, height, PAD_Y) : null;
  const markerXs = normalizeCurveMarkers(markers);
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "dialkit-curve", children: [
    !control.hideLabel && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "dialkit-curve-label", children: control.label }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
      "svg",
      {
        className: "dialkit-curve-surface",
        viewBox: `0 0 ${VIEW_WIDTH} ${height}`,
        preserveAspectRatio: "none",
        style: { height },
        role: "img",
        "aria-label": control.label,
        children: [
          baselineY !== null && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
            "line",
            {
              className: "dialkit-curve-baseline",
              x1: 0,
              y1: baselineY,
              x2: VIEW_WIDTH,
              y2: baselineY,
              vectorEffect: "non-scaling-stroke"
            }
          ),
          markerXs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
            "line",
            {
              className: "dialkit-curve-marker",
              x1: m * VIEW_WIDTH,
              y1: 0,
              x2: m * VIEW_WIDTH,
              y2: height,
              vectorEffect: "non-scaling-stroke"
            },
            i
          )),
          pathData && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { className: "dialkit-curve-stroke", d: pathData, fill: "none", vectorEffect: "non-scaling-stroke" })
        ]
      }
    )
  ] });
}

// src/components/ControlRenderer.tsx
var import_jsx_runtime32 = require("react/jsx-runtime");
function ControlRenderer({ panelId, controls, values, transitionDuration }) {
  const shortcutCtx = (0, import_react34.useContext)(ShortcutContext);
  const renderControlNode = (control) => {
    const value = values[control.path];
    if (value === void 0 && control.type !== "folder" && control.type !== "action" && control.type !== "curve") {
      return null;
    }
    switch (control.type) {
      case "slider":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          Slider,
          {
            label: control.label,
            value,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            min: control.min,
            max: control.max,
            step: control.step,
            unit: control.unit,
            formatValue: control.formatValue,
            origin: control.origin,
            bipolar: control.bipolar,
            orientation: control.orientation,
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path
          },
          control.path
        );
      case "number":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          NumberControl,
          {
            label: control.label,
            value,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            min: control.min,
            max: control.max,
            step: control.step,
            unit: control.unit,
            formatValue: control.formatValue,
            orientation: control.orientation
          },
          control.path
        );
      case "range":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          RangeSlider,
          {
            label: control.label,
            value,
            min: control.min ?? 0,
            max: control.max ?? 1,
            step: control.step,
            defaultValue: control.rangeDefault,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "toggle":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          Toggle,
          {
            label: control.label,
            checked: value,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path
          },
          control.path
        );
      case "spring":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          SpringControl,
          {
            panelId,
            path: control.path,
            label: control.label,
            spring: value,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "transition":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          TransitionControl,
          {
            panelId,
            path: control.path,
            label: control.label,
            value,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            durationControl: transitionDuration
          },
          control.path
        );
      case "folder": {
        if (control.module) {
          const enabledPath = `${control.path}._enabled`;
          return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
            ModuleFolder,
            {
              title: control.label,
              enabled: values[enabledPath],
              onEnabledChange: (v) => DialStore.updateValue(panelId, enabledPath, v),
              defaultOpen: control.defaultOpen ?? true,
              hint: control.hint,
              hintId: hintDomId(panelId, control.path),
              children: control.children?.map(renderControl)
            },
            control.path
          );
        }
        const [first, ...rest] = control.children ?? [];
        const headerTabs = first && first.type === "select" && first.display === "segmented" ? first : null;
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          Folder,
          {
            title: control.label,
            defaultOpen: control.defaultOpen ?? true,
            collapsible: control.collapsible ?? true,
            hint: control.hint,
            hintId: hintDomId(panelId, control.path),
            toolbar: headerTabs ? /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
              SegmentedControl,
              {
                options: (headerTabs.options ?? []).map(
                  (o) => typeof o === "string" ? { value: o, label: o } : o
                ),
                value: values[headerTabs.path],
                onChange: (v) => DialStore.updateValue(panelId, headerTabs.path, v)
              }
            ) : void 0,
            children: (headerTabs ? rest : control.children)?.map(renderControl)
          },
          control.path
        );
      }
      case "text":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          TextControl,
          {
            label: control.label,
            value,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            placeholder: control.placeholder
          },
          control.path
        );
      case "select":
        if (control.display === "segmented") {
          return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dialkit-labeled-control", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dialkit-labeled-control-label", children: control.label }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
              SegmentedControl,
              {
                options: (control.options ?? []).map(
                  (o) => typeof o === "string" ? { value: o, label: o } : o
                ),
                value,
                onChange: (v) => DialStore.updateValue(panelId, control.path, v)
              }
            )
          ] }, control.path);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          SelectControl,
          {
            label: control.label,
            value,
            options: control.options ?? [],
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "color":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          ColorControl,
          {
            label: control.label,
            value,
            alpha: control.alpha,
            palette: control.palette,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "gradient":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          GradientControl,
          {
            label: control.label,
            value,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "xy":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          XYControl,
          {
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
            shortcutActive: shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "gallery":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          GalleryControl,
          {
            label: control.label,
            value,
            items: control.items ?? [],
            columns: control.columns,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "file":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          FileControl,
          {
            label: control.label,
            value,
            accept: control.accept,
            multiple: control.multiple,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            onPick: (files) => DialStore.emitEvent(panelId, control.path, { kind: "file", files })
          },
          control.path
        );
      case "swatch":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          SwatchControl,
          {
            label: control.label,
            value,
            options: control.swatchOptions ?? [],
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "chips":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          ChipsControl,
          {
            label: control.label,
            value,
            options: control.chipOptions ?? [],
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            onRemove: (v) => DialStore.emitEvent(panelId, control.path, { kind: "remove", value: v })
          },
          control.path
        );
      case "multiselect":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          MultiSelectControl,
          {
            label: control.label,
            value: value ?? [],
            options: control.multiSelectOptions ?? [],
            onChange: (v) => DialStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "list":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          ListControl,
          {
            label: control.label,
            value,
            itemTypes: control.itemTypes ?? {},
            addLabel: control.addLabel,
            maxItems: control.maxItems,
            onChange: (v) => DialStore.updateValue(panelId, control.path, v),
            onEvent: (event) => DialStore.emitEvent(panelId, control.path, event)
          },
          control.path
        );
      case "curve":
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(CurvePreview, { panelId, control }, control.path);
      case "action": {
        const button = /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          "button",
          {
            className: "dialkit-button",
            disabled: DialStore.isDisabled(panelId, control.path),
            onClick: () => DialStore.triggerAction(panelId, control.path),
            children: control.label
          },
          control.path
        );
        if (control.caption === void 0) return button;
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dialkit-labeled-control dialkit-captioned-action", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dialkit-labeled-control-label", children: control.caption }),
          button
        ] }, control.path);
      }
      default:
        return null;
    }
  };
  const renderControl = (control) => {
    const node = renderControlNode(control);
    if (control.type === "folder") return node;
    return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
      ControlShell,
      {
        hint: control.hint,
        title: control.path,
        id: hintDomId(panelId, control.path),
        affordance: control.affordance,
        panelId,
        path: control.path,
        children: node
      },
      control.path
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_jsx_runtime32.Fragment, { children: controls.map(renderControl) });
}

// src/components/PresetManager.tsx
var import_react35 = require("react");
var import_react_dom6 = require("react-dom");
var import_react36 = require("motion/react");
var import_jsx_runtime33 = require("react/jsx-runtime");
function PresetManager({ panelId, presets, activePresetId, onAdd, providerMode = false, editSignal = 0 }) {
  const [isOpen, setIsOpen] = (0, import_react35.useState)(false);
  const triggerRef = (0, import_react35.useRef)(null);
  const dropdownRef = (0, import_react35.useRef)(null);
  const [pos, setPos] = (0, import_react35.useState)({ top: 0, left: 0, width: 0 });
  const [editingId, setEditingId] = (0, import_react35.useState)(null);
  const [draftName, setDraftName] = (0, import_react35.useState)("");
  const editInputRef = (0, import_react35.useRef)(null);
  const lastEditSignal = (0, import_react35.useRef)(editSignal);
  const hasPresets = presets.length > 0;
  const activePreset = presets.find((p) => p.id === activePresetId);
  const open = (0, import_react35.useCallback)(() => {
    if (!hasPresets) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  }, [hasPresets]);
  const close = (0, import_react35.useCallback)(() => setIsOpen(false), []);
  const toggle2 = (0, import_react35.useCallback)(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);
  (0, import_react35.useEffect)(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);
  const handleSelect = (presetId) => {
    DialStore.selectPreset(panelId, presetId);
    close();
  };
  const handleDelete = (e, presetId) => {
    e.stopPropagation();
    DialStore.removePreset(panelId, presetId);
  };
  const startEditing = (0, import_react35.useCallback)((presetId, name) => {
    setEditingId(presetId);
    setDraftName(name);
  }, []);
  const commitEdit = (0, import_react35.useCallback)(() => {
    if (editingId && draftName.trim()) {
      DialStore.renamePreset(panelId, editingId, draftName);
    }
    setEditingId(null);
  }, [panelId, editingId, draftName]);
  (0, import_react35.useEffect)(() => {
    if (editSignal === lastEditSignal.current) return;
    const active = presets.find((p) => p.id === activePresetId);
    if (!active || !(active.renamable ?? true)) return;
    lastEditSignal.current = editSignal;
    open();
    startEditing(active.id, active.name);
  }, [editSignal, activePresetId, presets, open, startEditing]);
  (0, import_react35.useEffect)(() => {
    if (editingId) editInputRef.current?.select();
  }, [editingId]);
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "dialkit-preset-manager", children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "dialkit-preset-trigger",
        onClick: toggle2,
        "data-open": String(isOpen),
        "data-has-preset": String(!!activePreset),
        "data-disabled": String(!hasPresets),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "dialkit-preset-label", children: activePreset ? activePreset.name : providerMode ? "Presets" : "Version 1" }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
            import_react36.motion.svg,
            {
              className: "dialkit-select-chevron",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.5",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              animate: { rotate: isOpen ? 180 : 0, opacity: hasPresets ? 0.6 : 0.25 },
              transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
              children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: ICON_CHEVRON })
            }
          )
        ]
      }
    ),
    (0, import_react_dom6.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(import_react36.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "dialkit-root dialkit-preset-dropdown",
          style: { position: "fixed", top: pos.top, left: pos.left, minWidth: pos.width },
          initial: { opacity: 0, y: 4, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          children: [
            !providerMode && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
              "div",
              {
                className: "dialkit-preset-item",
                "data-active": String(!activePresetId),
                onClick: () => handleSelect(null),
                children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "dialkit-preset-name", children: "Version 1" })
              }
            ),
            presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
              "div",
              {
                className: "dialkit-preset-item",
                "data-active": String(preset.id === activePresetId),
                onClick: editingId === preset.id ? void 0 : () => handleSelect(preset.id),
                children: [
                  editingId === preset.id ? /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
                    "input",
                    {
                      ref: editInputRef,
                      className: "dialkit-preset-name-input",
                      value: draftName,
                      onChange: (e) => setDraftName(e.target.value),
                      onClick: (e) => e.stopPropagation(),
                      onBlur: commitEdit,
                      onKeyDown: (e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") setEditingId(null);
                        e.stopPropagation();
                      }
                    }
                  ) : /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "dialkit-preset-name", children: preset.name }),
                  editingId !== preset.id && (preset.renamable ?? true) && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
                    "button",
                    {
                      className: "dialkit-preset-rename",
                      onClick: (e) => {
                        e.stopPropagation();
                        startEditing(preset.id, preset.name);
                      },
                      title: "Rename preset",
                      children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_PENCIL.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d }, i)) })
                    }
                  ),
                  editingId !== preset.id && (preset.deletable ?? true) && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
                    "button",
                    {
                      className: "dialkit-preset-delete",
                      onClick: (e) => handleDelete(e, preset.id),
                      title: "Delete preset",
                      children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_TRASH.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d }, i)) })
                    }
                  )
                ]
              },
              preset.id
            ))
          ]
        }
      ) }),
      document.body
    )
  ] });
}

// src/components/Panel.tsx
var import_jsx_runtime34 = require("react/jsx-runtime");
function Panel({ panel, defaultOpen = true, inline = false, toolbarExtra }) {
  const [copied, setCopied] = (0, import_react37.useState)(false);
  const [isPanelOpen, setIsPanelOpen] = (0, import_react37.useState)(defaultOpen);
  const hasShortcuts = Object.keys(panel.shortcuts).length > 0;
  const values = (0, import_react37.useSyncExternalStore)(
    (cb) => DialStore.subscribe(panel.id, cb),
    () => DialStore.getValues(panel.id),
    () => DialStore.getValues(panel.id)
  );
  const presets = DialStore.getPresetItems(panel.id);
  const activePresetId = DialStore.getActivePresetId(panel.id);
  const providerMode = DialStore.hasPresetProvider(panel.id);
  const [presetEditSignal, setPresetEditSignal] = (0, import_react37.useState)(0);
  const handleAddPreset = () => {
    DialStore.createPreset(panel.id);
    setPresetEditSignal((n) => n + 1);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopyInstruction("useDialKit", panel.name, values));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const { tabs, activeTab, looseControls, pageControls } = splitPanelTabs(panel.controls, values[TAB_PATH]);
  const tabBar = activeTab ? /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
    SegmentedControl,
    {
      options: tabs.map((tab) => ({ value: tab.path, label: tab.label })),
      value: activeTab.path,
      onChange: (v) => DialStore.updateValue(panel.id, TAB_PATH, v)
    }
  ) : void 0;
  const renderRows = (controls) => /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(ControlRenderer, { panelId: panel.id, controls, values });
  const renderControls = () => activeTab ? /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(import_jsx_runtime34.Fragment, { children: [
    renderRows(looseControls),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "dialkit-panel-tab-page", children: renderRows(pageControls) }, activeTab.path)
  ] }) : renderRows(pageControls);
  const iconTransition = { type: "spring", visualDuration: 0.4, bounce: 0.1 };
  const toolbar = /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(import_jsx_runtime34.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      import_react38.motion.button,
      {
        className: "dialkit-toolbar-add",
        onClick: handleAddPreset,
        title: "Add preset",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_ADD_PRESET.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d }, i)) })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      PresetManager,
      {
        panelId: panel.id,
        presets,
        activePresetId,
        onAdd: handleAddPreset,
        providerMode,
        editSignal: presetEditSignal
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      import_react38.motion.button,
      {
        className: "dialkit-toolbar-add",
        onClick: handleCopy,
        title: "Copy parameters",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { style: { position: "relative", width: 16, height: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_react38.AnimatePresence, { initial: false, mode: "wait", children: copied ? /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
          import_react38.motion.svg,
          {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--dial-text-label)" },
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.08 },
            children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: ICON_CHECK })
          },
          "check"
        ) : /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
          import_react38.motion.svg,
          {
            viewBox: "0 0 24 24",
            fill: "none",
            style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--dial-text-label)" },
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.08 },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: ICON_CLIPBOARD.board, stroke: "currentColor", strokeWidth: "2", strokeLinejoin: "round" }),
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: ICON_CLIPBOARD.sparkle, fill: "currentColor" }),
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: ICON_CLIPBOARD.body, stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
            ]
          },
          "clipboard"
        ) }) })
      }
    ),
    toolbarExtra
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "dialkit-panel-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(Folder, { title: panel.name, defaultOpen, isRoot: true, inline, onOpenChange: setIsPanelOpen, toolbar, tabs: tabBar, children: renderControls() }) });
}

// src/components/Timeline/TimelineToggleButton.tsx
var import_react39 = require("react");
var import_react40 = require("motion/react");

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

// src/components/Timeline/TimelineToggleButton.tsx
var import_jsx_runtime35 = require("react/jsx-runtime");
function TimelineToggleButton() {
  const subscribe = (0, import_react39.useCallback)(
    (listener) => TimelineUiStore.subscribe(listener),
    []
  );
  const getVisible = (0, import_react39.useCallback)(() => TimelineUiStore.getVisible(), []);
  const visible = (0, import_react39.useSyncExternalStore)(subscribe, getVisible, getVisible);
  const label = visible ? "Hide timeline" : "Show timeline";
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
    import_react40.motion.button,
    {
      className: "dialkit-toolbar-add dialkit-timeline-toolbar-toggle",
      "data-active": visible || void 0,
      "aria-pressed": visible,
      "aria-label": label,
      title: label,
      onClick: () => TimelineUiStore.toggle(),
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: ICON_TIMELINE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d, fill: "currentColor" }, i)) })
    }
  );
}

// src/components/DialRoot.tsx
var import_jsx_runtime36 = require("react/jsx-runtime");
function DialRoot({ position = "top-right", defaultOpen = true, mode = "popover", theme = "system", productionEnabled = isDevDefault }) {
  if (!productionEnabled) return null;
  const [panels, setPanels] = (0, import_react41.useState)([]);
  const [timelineCount, setTimelineCount] = (0, import_react41.useState)(0);
  const [mounted, setMounted] = (0, import_react41.useState)(false);
  const inline = mode === "inline";
  const panelRef = (0, import_react41.useRef)(null);
  const [dragOffset, setDragOffset] = (0, import_react41.useState)(null);
  const [activePosition, setActivePosition] = (0, import_react41.useState)(position);
  const lastDragOffset = (0, import_react41.useRef)(null);
  const draggingRef = (0, import_react41.useRef)(false);
  const dragStartRef = (0, import_react41.useRef)(null);
  const didDragRef = (0, import_react41.useRef)(false);
  (0, import_react41.useEffect)(() => {
    setMounted(true);
    setPanels(DialStore.getPanels("panel"));
    setTimelineCount(TimelineStore.getTimelines().length);
    const unsubscribePanels = DialStore.subscribeGlobal(() => {
      setPanels(DialStore.getPanels("panel"));
    });
    const unsubscribeTimelines = TimelineStore.subscribeGlobal(() => {
      setTimelineCount(TimelineStore.getTimelines().length);
    });
    return () => {
      unsubscribePanels();
      unsubscribeTimelines();
    };
  }, []);
  (0, import_react41.useEffect)(() => {
    if (!panelRef.current || inline) return;
    const observer = new MutationObserver(() => {
      const inner = panelRef.current?.querySelector(".dialkit-panel-inner");
      if (!inner) return;
      const collapsed = inner.getAttribute("data-collapsed") === "true";
      if (!collapsed) {
        if (dragOffset) {
          lastDragOffset.current = dragOffset;
          const bubbleCenterX = dragOffset.x + 21;
          const midX = window.innerWidth / 2;
          setActivePosition(bubbleCenterX < midX ? "top-left" : "top-right");
        } else {
          setActivePosition(position);
        }
        setDragOffset(null);
      } else if (lastDragOffset.current) {
        setDragOffset(lastDragOffset.current);
      }
    });
    observer.observe(panelRef.current, { subtree: true, attributes: true, attributeFilter: ["data-collapsed"] });
    return () => observer.disconnect();
  }, [inline, dragOffset, position]);
  const handlePointerDown = (0, import_react41.useCallback)((e) => {
    const inner = panelRef.current?.querySelector(".dialkit-panel-inner");
    if (!inner || inner.getAttribute("data-collapsed") !== "true") return;
    const rect = panelRef.current.getBoundingClientRect();
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      elX: rect.left,
      elY: rect.top
    };
    didDragRef.current = false;
    draggingRef.current = true;
    e.target.setPointerCapture(e.pointerId);
  }, []);
  const handlePointerMove = (0, import_react41.useCallback)((e) => {
    if (!draggingRef.current || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;
    if (!didDragRef.current && Math.abs(dx) + Math.abs(dy) < 4) return;
    didDragRef.current = true;
    setDragOffset({
      x: dragStartRef.current.elX + dx,
      y: dragStartRef.current.elY + dy
    });
  }, []);
  const handlePointerUp = (0, import_react41.useCallback)((e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    dragStartRef.current = null;
    if (didDragRef.current) {
      e.stopPropagation();
      const inner = panelRef.current?.querySelector(".dialkit-panel-inner");
      if (inner) {
        const blocker = (ev) => {
          ev.stopPropagation();
        };
        inner.addEventListener("click", blocker, { capture: true, once: true });
      }
    }
  }, []);
  if (!mounted || typeof window === "undefined") {
    return null;
  }
  if (panels.length === 0 && timelineCount === 0) {
    return null;
  }
  const dragStyle = dragOffset ? {
    top: dragOffset.y,
    left: dragOffset.x,
    right: "auto",
    bottom: "auto"
  } : void 0;
  const timelineToggle = timelineCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(TimelineToggleButton, {}) : null;
  const content = /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(ShortcutListener, { children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "dialkit-root", "data-mode": mode, "data-theme": theme, children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
    "div",
    {
      ref: panelRef,
      className: "dialkit-panel",
      "data-position": inline ? void 0 : dragOffset ? void 0 : activePosition,
      "data-mode": mode,
      style: dragStyle,
      onPointerDown: !inline ? handlePointerDown : void 0,
      onPointerMove: !inline ? handlePointerMove : void 0,
      onPointerUp: !inline ? handlePointerUp : void 0,
      children: panels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "dialkit-panel-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
        Folder,
        {
          title: "DialKit",
          defaultOpen: inline || defaultOpen,
          isRoot: true,
          inline,
          toolbar: timelineToggle,
          children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "dialkit-timeline-toolkit-only", children: "Timeline" })
        }
      ) }) : panels.map((panel) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Panel, { panel, defaultOpen: inline || defaultOpen, inline, toolbarExtra: timelineToggle }, panel.id))
    }
  ) }) });
  if (inline) {
    return content;
  }
  return (0, import_react_dom7.createPortal)(content, document.body);
}

// src/hooks/useDialTimeline.ts
var import_react42 = require("react");

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

// src/hooks/useDialTimeline.ts
function useDialTimeline(name, config, options) {
  const serializedConfig = useSerialized(config);
  const parsed = (0, import_react42.useMemo)(() => parseTimelineConfig(config), [serializedConfig]);
  const { panelId, flatValues } = useDialStorePanel(name, parsed.dialConfig, {
    id: options?.id,
    persist: options?.persist,
    kind: "timeline"
  });
  const staticTimeline = (0, import_react42.useMemo)(
    () => computeStaticTimeline(parsed, flatValues),
    [parsed, flatValues]
  );
  const timelineDuration = staticTimeline.duration;
  const staticClips = staticTimeline.clips;
  const parsedRef = (0, import_react42.useRef)(parsed);
  parsedRef.current = parsed;
  const optionsRef = (0, import_react42.useRef)(options);
  optionsRef.current = options;
  const buildMeta = (0, import_react42.useCallback)(
    () => buildTimelineMeta(panelId, name, timelineDuration, parsedRef.current, options?.loop),
    [panelId, name, timelineDuration, options?.loop]
  );
  const buildMetaRef = (0, import_react42.useRef)(buildMeta);
  buildMetaRef.current = buildMeta;
  (0, import_react42.useEffect)(() => {
    TimelineStore.register(buildMetaRef.current(), {
      autoplay: optionsRef.current?.autoplay ?? true,
      persist: optionsRef.current?.persist
    });
    return () => TimelineStore.unregister(panelId);
  }, [panelId, name]);
  const mountedRef = (0, import_react42.useRef)(false);
  (0, import_react42.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    TimelineStore.update(buildMeta());
  }, [buildMeta, parsed]);
  const subscribeTransport = (0, import_react42.useCallback)(
    (callback) => TimelineStore.subscribe(panelId, callback),
    [panelId]
  );
  const getTransport = (0, import_react42.useCallback)(() => TimelineStore.getTransport(panelId), [panelId]);
  const transport = (0, import_react42.useSyncExternalStore)(subscribeTransport, getTransport, getTransport);
  const getLoopRegion = (0, import_react42.useCallback)(() => TimelineStore.getLoopRegion(panelId), [panelId]);
  const loopRegion = (0, import_react42.useSyncExternalStore)(subscribeTransport, getLoopRegion, getLoopRegion);
  const loopStart = loopRegion ? loopRegion.start : 0;
  const loopEnd = loopRegion ? loopRegion.end : timelineDuration;
  const play = (0, import_react42.useCallback)(() => TimelineStore.play(panelId), [panelId]);
  const pause = (0, import_react42.useCallback)(() => TimelineStore.pause(panelId), [panelId]);
  const replay = (0, import_react42.useCallback)(() => TimelineStore.replay(panelId), [panelId]);
  const seek = (0, import_react42.useCallback)((time) => TimelineStore.seek(panelId, time), [panelId]);
  return (0, import_react42.useMemo)(
    () => buildTimelineValues(staticClips, transport, timelineDuration, loopStart, loopEnd, {
      play,
      pause,
      replay,
      seek
    }),
    [staticClips, transport, timelineDuration, loopStart, loopEnd, play, pause, replay, seek]
  );
}

// src/components/Timeline/DialTimeline.tsx
var import_react43 = require("react");
var import_react_dom8 = require("react-dom");
var import_react44 = require("motion/react");
var import_jsx_runtime37 = require("react/jsx-runtime");
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
var subscribeGlobalTimelines = (callback) => TimelineStore.subscribeGlobal(callback);
var getTimelines = () => TimelineStore.getTimelines();
var subscribeTimelineVisibility = (callback) => TimelineUiStore.subscribe(callback);
var getTimelineVisibility = () => TimelineUiStore.getVisible();
var DialTimeline = (0, import_react43.memo)(function DialTimeline2({
  theme = "system",
  defaultVisible = true,
  visible,
  onVisibilityChange,
  defaultOpen = true,
  productionEnabled = isDevDefault
}) {
  if (!productionEnabled) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    DialTimelineDock,
    {
      theme,
      defaultVisible,
      visible,
      onVisibilityChange,
      defaultOpen
    }
  );
});
function DialTimelineDock({
  theme,
  defaultVisible,
  visible,
  onVisibilityChange,
  defaultOpen
}) {
  const [mounted, setMounted] = (0, import_react43.useState)(false);
  const [dockMaxHeight, setDockMaxHeight] = (0, import_react43.useState)(DEFAULT_DOCK_MAX_HEIGHT);
  const visibilityControllerId = (0, import_react43.useRef)(/* @__PURE__ */ Symbol("dialkit-timeline-visibility"));
  const dockRef = (0, import_react43.useRef)(null);
  const resizeCleanupRef = (0, import_react43.useRef)(null);
  (0, import_react43.useEffect)(() => TimelineUiStore.registerController(visibilityControllerId.current, {
    visible,
    defaultVisible,
    onVisibilityChange
  }), []);
  (0, import_react43.useEffect)(() => {
    TimelineUiStore.updateController(visibilityControllerId.current, {
      visible,
      defaultVisible,
      onVisibilityChange
    });
  }, [defaultVisible, onVisibilityChange, visible]);
  (0, import_react43.useEffect)(() => {
    setMounted(true);
  }, []);
  (0, import_react43.useEffect)(() => () => resizeCleanupRef.current?.(), []);
  const handleResizePointerDown = (0, import_react43.useCallback)((e) => {
    const dock = dockRef.current;
    if (!dock) return;
    e.preventDefault();
    e.stopPropagation();
    resizeCleanupRef.current?.();
    const pointerY = e.clientY;
    const startHeight = dock.getBoundingClientRect().height;
    const handlePointerMove = (event) => {
      event.preventDefault();
      const viewportMax = Math.max(MIN_DOCK_MAX_HEIGHT, window.innerHeight - 24);
      setDockMaxHeight(clamp5(startHeight + pointerY - event.clientY, MIN_DOCK_MAX_HEIGHT, viewportMax));
    };
    const finishResize = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishResize);
      window.removeEventListener("pointercancel", finishResize);
      resizeCleanupRef.current = null;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", finishResize);
    window.addEventListener("pointercancel", finishResize);
    resizeCleanupRef.current = finishResize;
  }, []);
  const timelines = (0, import_react43.useSyncExternalStore)(subscribeGlobalTimelines, getTimelines, getTimelines);
  const dockVisible = (0, import_react43.useSyncExternalStore)(
    subscribeTimelineVisibility,
    getTimelineVisibility,
    getTimelineVisibility
  );
  if (!mounted || typeof window === "undefined" || timelines.length === 0) {
    return null;
  }
  return (0, import_react_dom8.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-root dialkit-timeline", "data-theme": theme, hidden: !dockVisible, children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "div",
        {
          className: "dialkit-timeline-resize-handle",
          onPointerDown: handleResizePointerDown,
          role: "separator",
          "aria-label": "Resize timeline height",
          "aria-orientation": "horizontal",
          title: "Drag to resize timeline"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "div",
        {
          ref: dockRef,
          className: "dialkit-timeline-dock",
          style: { maxHeight: `min(${dockMaxHeight}px, calc(100vh - 24px))` },
          children: timelines.map((timeline) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            TimelineSection,
            {
              meta: timeline,
              defaultOpen,
              theme,
              dockVisible
            },
            timeline.id
          ))
        }
      )
    ] }),
    document.body
  );
}
function useTransportSubscribe(id) {
  return (0, import_react43.useCallback)((callback) => TimelineStore.subscribe(id, callback), [id]);
}
function PlayPauseButton({ id }) {
  const subscribe = useTransportSubscribe(id);
  const getPlaying = (0, import_react43.useCallback)(() => TimelineStore.getTransport(id).playing, [id]);
  const playing = (0, import_react43.useSyncExternalStore)(subscribe, getPlaying, getPlaying);
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    import_react44.motion.button,
    {
      className: "dialkit-toolbar-add",
      onClick: () => playing ? TimelineStore.pause(id) : TimelineStore.play(id),
      title: playing ? "Pause" : "Play",
      "aria-label": playing ? "Pause" : "Play",
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { style: { position: "relative", width: 16, height: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_react44.AnimatePresence, { initial: false, mode: "wait", children: playing ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        import_react44.motion.svg,
        {
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--dial-text-label)" },
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.08 },
          children: ICON_PAUSE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d, fill: "currentColor" }, i))
        },
        "pause"
      ) : /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        import_react44.motion.svg,
        {
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--dial-text-label)" },
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.08 },
          children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_PLAY, fill: "currentColor" })
        },
        "play"
      ) }) })
    }
  );
}
function ReplayButton({ onReplay }) {
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    import_react44.motion.button,
    {
      className: "dialkit-toolbar-add",
      onClick: onReplay,
      title: "Replay",
      "aria-label": "Replay",
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: ICON_REPLAY.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d, fill: "currentColor" }, i)) })
    }
  );
}
function TimelinePlayheadFlag({
  id,
  duration,
  pxPerSecond,
  viewStart,
  viewEnd,
  laneWidth,
  rulerRef,
  onResetView
}) {
  const subscribe = useTransportSubscribe(id);
  const getTime = (0, import_react43.useCallback)(() => TimelineStore.getTransport(id).time, [id]);
  const time = (0, import_react43.useSyncExternalStore)(subscribe, getTime, getTime);
  const scrubRef = (0, import_react43.useRef)(null);
  const cleanupScrubRef = (0, import_react43.useRef)(null);
  const seekFromClientX = (0, import_react43.useCallback)((clientX) => {
    const rect = scrubRef.current?.rect;
    const scrub = scrubRef.current;
    const contentWidth = rect?.width ?? 0;
    if (!rect || !scrub || contentWidth <= 0) return;
    const nextTime = clamp5(
      scrub.viewStart + (clientX - rect.left) / contentWidth * (scrub.viewEnd - scrub.viewStart),
      scrub.viewStart,
      scrub.viewEnd
    );
    TimelineStore.seek(id, nextTime);
  }, [id]);
  const handlePointerDown = (0, import_react43.useCallback)((e) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.stopPropagation();
    cleanupScrubRef.current?.();
    const resetView = e.shiftKey;
    scrubRef.current = {
      wasPlaying: TimelineStore.getTransport(id).playing,
      rect,
      viewStart: resetView ? 0 : viewStart,
      viewEnd: resetView ? duration : viewEnd
    };
    if (resetView) onResetView();
    TimelineStore.pause(id);
    seekFromClientX(e.clientX);
    const handleWindowPointerMove = (event) => {
      event.preventDefault();
      seekFromClientX(event.clientX);
    };
    const finishWindowScrub = () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", finishWindowScrub);
      window.removeEventListener("pointercancel", finishWindowScrub);
      if (scrubRef.current?.wasPlaying) TimelineStore.play(id);
      scrubRef.current = null;
      cleanupScrubRef.current = null;
    };
    window.addEventListener("pointermove", handleWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", finishWindowScrub);
    window.addEventListener("pointercancel", finishWindowScrub);
    cleanupScrubRef.current = finishWindowScrub;
  }, [duration, id, onResetView, rulerRef, seekFromClientX, viewEnd, viewStart]);
  (0, import_react43.useEffect)(() => () => cleanupScrubRef.current?.(), []);
  if (time < viewStart || time > viewEnd || laneWidth <= 0) return null;
  const x = clamp5(
    (time - viewStart) * pxPerSecond,
    0,
    laneWidth
  );
  const flagCenter = clamp5(
    x,
    PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG,
    laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG
  );
  const flagOffset = flagCenter - x;
  const edge = flagOffset > 0.5 ? "start" : flagOffset < -0.5 ? "end" : "center";
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
    "div",
    {
      className: "dialkit-timeline-playhead-control",
      "data-edge": edge,
      style: {
        left: `calc(var(--dial-timeline-label-w) + ${x}px)`,
        "--dial-timeline-playhead-flag-offset": `${flagOffset}px`
      },
      onPointerDown: handlePointerDown,
      role: "slider",
      "aria-label": "Timeline current time",
      "aria-valuemin": 0,
      "aria-valuemax": duration,
      "aria-valuenow": time,
      title: "Drag to scrub the timeline",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-playhead-stem" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-playhead-anchor", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-playhead-flag", children: time.toFixed(2) }) })
      ]
    }
  );
}
function TimelineOverview({
  id,
  duration,
  viewStart,
  viewEnd,
  onNavigate
}) {
  const subscribe = useTransportSubscribe(id);
  const getTime = (0, import_react43.useCallback)(() => TimelineStore.getTransport(id).time, [id]);
  const time = (0, import_react43.useSyncExternalStore)(subscribe, getTime, getTime);
  const scrubRef = (0, import_react43.useRef)(null);
  const seekFromClientX = (0, import_react43.useCallback)((clientX) => {
    const rect = scrubRef.current?.rect;
    if (!rect || rect.width <= 0 || duration <= 0) return;
    const nextTime = clamp5((clientX - rect.left) / rect.width * duration, 0, duration);
    TimelineStore.seek(id, nextTime);
    onNavigate(nextTime);
  }, [duration, id, onNavigate]);
  const handlePointerDown = (0, import_react43.useCallback)((e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubRef.current = {
      wasPlaying: TimelineStore.getTransport(id).playing,
      rect: e.currentTarget.getBoundingClientRect()
    };
    TimelineStore.pause(id);
    seekFromClientX(e.clientX);
  }, [id, seekFromClientX]);
  const handlePointerMove = (0, import_react43.useCallback)((e) => {
    if (scrubRef.current) seekFromClientX(e.clientX);
  }, [seekFromClientX]);
  const finishScrub = (0, import_react43.useCallback)(() => {
    if (scrubRef.current?.wasPlaying) TimelineStore.play(id);
    scrubRef.current = null;
  }, [id]);
  const viewportLeft = duration > 0 ? viewStart / duration * 100 : 0;
  const viewportWidth = duration > 0 ? (viewEnd - viewStart) / duration * 100 : 100;
  const playheadLeft = duration > 0 ? time / duration * 100 : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
    "div",
    {
      className: "dialkit-timeline-overview",
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishScrub,
      onPointerCancel: finishScrub,
      onLostPointerCapture: finishScrub,
      title: "Drag to scrub the full timeline",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          "div",
          {
            className: "dialkit-timeline-overview-viewport",
            "data-zoomed": viewportWidth < 99.999 || void 0,
            style: { left: `${viewportLeft}%`, width: `${viewportWidth}%` }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-overview-progress", style: { width: `${playheadLeft}%` } }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-overview-playhead", style: { left: `${playheadLeft}%` } })
      ]
    }
  );
}
function clampViewStart(start, duration, visibleDuration) {
  return clamp5(start, 0, Math.max(0, duration - visibleDuration));
}
function formatRulerSeconds(time, step) {
  if (step >= 1 && Number.isInteger(time)) return formatClock(time);
  const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
  return `${time.toFixed(decimals)}s`;
}
var TimelineSection = (0, import_react43.memo)(function TimelineSection2({
  meta,
  defaultOpen,
  theme,
  dockVisible
}) {
  const [open, setOpen] = (0, import_react43.useState)(defaultOpen);
  const [copied, setCopied] = (0, import_react43.useState)(false);
  const [popover, setPopover] = (0, import_react43.useState)(null);
  const [collapsedGroups, setCollapsedGroups] = (0, import_react43.useState)(() => /* @__PURE__ */ new Set());
  const [expandedTracks, setExpandedTracks] = (0, import_react43.useState)(() => /* @__PURE__ */ new Set());
  const [zoom, setZoom] = (0, import_react43.useState)(1);
  const [viewStart, setViewStart] = (0, import_react43.useState)(0);
  const subscribeValues = (0, import_react43.useCallback)(
    (callback) => DialStore.subscribe(meta.id, callback),
    [meta.id]
  );
  const getValues = (0, import_react43.useCallback)(() => DialStore.getValues(meta.id), [meta.id]);
  const values = (0, import_react43.useSyncExternalStore)(subscribeValues, getValues, getValues);
  const presets = DialStore.getPresets(meta.id);
  const activePresetId = DialStore.getActivePresetId(meta.id);
  const subscribeLoopRegion = (0, import_react43.useCallback)(
    (callback) => TimelineStore.subscribe(meta.id, callback),
    [meta.id]
  );
  const getLoopRegion = (0, import_react43.useCallback)(() => TimelineStore.getLoopRegion(meta.id), [meta.id]);
  const loopRegion = (0, import_react43.useSyncExternalStore)(subscribeLoopRegion, getLoopRegion, getLoopRegion);
  const [loopDrag, setLoopDrag] = (0, import_react43.useState)(null);
  const laneAreaRef = (0, import_react43.useRef)(null);
  const horizontalScrollRef = (0, import_react43.useRef)(null);
  const [laneWidth, setLaneWidth] = (0, import_react43.useState)(0);
  (0, import_react43.useLayoutEffect)(() => {
    if (!open) return;
    const ruler = laneAreaRef.current;
    if (!ruler) return;
    const measure = () => {
      setLaneWidth(ruler.getBoundingClientRect().width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ruler);
    return () => observer.disconnect();
  }, [open]);
  const visibleDuration = meta.duration > 0 ? meta.duration / zoom : meta.duration;
  const safeViewStart = clampViewStart(viewStart, meta.duration, visibleDuration);
  const viewEnd = safeViewStart + visibleDuration;
  const pxPerSecond = visibleDuration > 0 && laneWidth > 0 ? laneWidth / visibleDuration : 0;
  const millisecondReadableZoom = laneWidth > 0 && meta.duration > 0 ? MAJOR_TICK_TARGET_PX * meta.duration / (MILLISECOND_STEP * 10 * laneWidth) : MIN_TIMELINE_MAX_ZOOM;
  const maxZoom = Math.max(MIN_TIMELINE_MAX_ZOOM, millisecondReadableZoom);
  (0, import_react43.useEffect)(() => {
    setZoom((current) => clamp5(current, 1, maxZoom));
  }, [maxZoom]);
  (0, import_react43.useEffect)(() => {
    setViewStart((current) => clampViewStart(current, meta.duration, meta.duration / zoom));
  }, [meta.duration, zoom]);
  (0, import_react43.useLayoutEffect)(() => {
    const scroller = horizontalScrollRef.current;
    if (!scroller || pxPerSecond <= 0) return;
    const nextScrollLeft = safeViewStart * pxPerSecond;
    if (Math.abs(scroller.scrollLeft - nextScrollLeft) > 0.5) {
      scroller.scrollLeft = nextScrollLeft;
    }
  }, [open, pxPerSecond, safeViewStart]);
  (0, import_react43.useEffect)(() => {
    if (!dockVisible) setPopover(null);
  }, [dockVisible]);
  const centerViewAt = (0, import_react43.useCallback)((time) => {
    if (zoom <= 1 || meta.duration <= 0) return;
    const windowDuration = meta.duration / zoom;
    setViewStart(clampViewStart(time - windowDuration / 2, meta.duration, windowDuration));
  }, [meta.duration, zoom]);
  const resetView = (0, import_react43.useCallback)(() => {
    setZoom(1);
    setViewStart(0);
  }, []);
  const handleReplay = (0, import_react43.useCallback)(() => {
    setViewStart(0);
    TimelineStore.replay(meta.id);
  }, [meta.id]);
  const handleClearLoopRegion = (0, import_react43.useCallback)(() => {
    TimelineStore.clearLoopRegion(meta.id);
  }, [meta.id]);
  const handleHorizontalScroll = (0, import_react43.useCallback)((e) => {
    if (pxPerSecond <= 0) return;
    setViewStart(clampViewStart(
      e.currentTarget.scrollLeft / pxPerSecond,
      meta.duration,
      visibleDuration
    ));
  }, [meta.duration, pxPerSecond, visibleDuration]);
  const handleTimelineWheel = (0, import_react43.useCallback)((e) => {
    const scroller = horizontalScrollRef.current;
    if (!scroller || zoom <= 1) return;
    const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (horizontalDelta === 0) return;
    e.preventDefault();
    scroller.scrollLeft += horizontalDelta;
  }, [zoom]);
  const zoomDragRef = (0, import_react43.useRef)(null);
  const rulerGestureRef = (0, import_react43.useRef)(null);
  const rulerTimeFromClientX = (0, import_react43.useCallback)(
    (clientX, rect, viewStartAt, visibleAt) => clamp5(
      viewStartAt + (clientX - rect.left) / rect.width * visibleAt,
      viewStartAt,
      viewStartAt + visibleAt
    ),
    []
  );
  const handleRulerPointerDown = (0, import_react43.useCallback)((e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const contentWidth = rect.width;
    if (contentWidth <= 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!e.altKey) {
      const resetView2 = e.shiftKey;
      const gestureViewStart = resetView2 ? 0 : safeViewStart;
      const gestureVisible = resetView2 ? meta.duration : visibleDuration;
      if (resetView2) {
        setZoom(1);
        setViewStart(0);
      }
      rulerGestureRef.current = {
        downClientX: e.clientX,
        downTime: rulerTimeFromClientX(e.clientX, rect, gestureViewStart, gestureVisible),
        rect,
        viewStart: gestureViewStart,
        visibleDuration: gestureVisible,
        moved: false
      };
      return;
    }
    const anchorRatio = clamp5((e.clientX - rect.left) / contentWidth, 0, 1);
    zoomDragRef.current = {
      pointerX: e.clientX,
      rect,
      zoom,
      viewStart: safeViewStart,
      anchorRatio,
      anchorTime: safeViewStart + anchorRatio * visibleDuration,
      moved: false
    };
  }, [meta.duration, rulerTimeFromClientX, safeViewStart, visibleDuration, zoom]);
  const handleRulerPointerMove = (0, import_react43.useCallback)((e) => {
    const gesture = rulerGestureRef.current;
    if (gesture) {
      const dx2 = e.clientX - gesture.downClientX;
      if (!gesture.moved && Math.abs(dx2) <= LOOP_DRAG_THRESHOLD_PX) return;
      gesture.moved = true;
      const current = rulerTimeFromClientX(e.clientX, gesture.rect, gesture.viewStart, gesture.visibleDuration);
      setLoopDrag({
        start: Math.min(gesture.downTime, current),
        end: Math.max(gesture.downTime, current)
      });
      return;
    }
    const drag = zoomDragRef.current;
    if (!drag || meta.duration <= 0) return;
    const dx = e.clientX - drag.pointerX;
    if (!drag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
    drag.moved = true;
    const nextZoom = clamp5(drag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom);
    const nextVisibleDuration = meta.duration / nextZoom;
    const nextStart = clampViewStart(
      drag.anchorTime - drag.anchorRatio * nextVisibleDuration,
      meta.duration,
      nextVisibleDuration
    );
    setZoom(nextZoom);
    setViewStart(nextStart);
  }, [maxZoom, meta.duration, rulerTimeFromClientX]);
  const handleRulerPointerUp = (0, import_react43.useCallback)(() => {
    const gesture = rulerGestureRef.current;
    rulerGestureRef.current = null;
    zoomDragRef.current = null;
    if (gesture) {
      if (gesture.moved && loopDrag) {
        TimelineStore.setLoopRegion(meta.id, loopDrag.start, loopDrag.end);
      } else {
        TimelineStore.seek(meta.id, gesture.downTime);
      }
      setLoopDrag(null);
    }
  }, [loopDrag, meta.id]);
  const handleRulerPointerCancel = (0, import_react43.useCallback)(() => {
    rulerGestureRef.current = null;
    zoomDragRef.current = null;
    setLoopDrag(null);
  }, []);
  const trackScrubRef = (0, import_react43.useRef)(null);
  const seekTrackFromClientX = (0, import_react43.useCallback)((clientX) => {
    const scrub = trackScrubRef.current;
    const contentWidth = scrub?.rect.width ?? 0;
    if (!scrub || contentWidth <= 0) return;
    const nextTime = clamp5(
      scrub.viewStart + (clientX - scrub.rect.left) / contentWidth * scrub.visibleDuration,
      scrub.viewStart,
      scrub.viewStart + scrub.visibleDuration
    );
    TimelineStore.seek(meta.id, nextTime);
  }, [meta.id]);
  const handleTrackPointerDown = (0, import_react43.useCallback)((e) => {
    const target = e.target;
    if (target.closest(".dialkit-timeline-label, button")) return;
    if (!e.shiftKey && target.closest(".dialkit-timeline-clip")) return;
    const rect = laneAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const resetView2 = e.shiftKey;
    trackScrubRef.current = {
      wasPlaying: TimelineStore.getTransport(meta.id).playing,
      rect,
      viewStart: resetView2 ? 0 : safeViewStart,
      visibleDuration: resetView2 ? meta.duration : visibleDuration
    };
    if (resetView2) {
      setZoom(1);
      setViewStart(0);
    }
    setPopover(null);
    TimelineStore.pause(meta.id);
    seekTrackFromClientX(e.clientX);
  }, [meta.duration, meta.id, safeViewStart, seekTrackFromClientX, visibleDuration]);
  const handleTrackPointerMove = (0, import_react43.useCallback)((e) => {
    if (trackScrubRef.current) seekTrackFromClientX(e.clientX);
  }, [seekTrackFromClientX]);
  const finishTrackScrub = (0, import_react43.useCallback)(() => {
    if (trackScrubRef.current?.wasPlaying) TimelineStore.play(meta.id);
    trackScrubRef.current = null;
  }, [meta.id]);
  const handleCopy = (0, import_react43.useCallback)(() => {
    const normalized = normalizeTimelineValuesForCopy(DialStore.getValues(meta.id), meta.clips);
    navigator.clipboard.writeText(buildCopyInstruction("useDialTimeline", meta.name, normalized));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [meta.clips, meta.id, meta.name]);
  const handleAddPreset = (0, import_react43.useCallback)(() => {
    DialStore.savePreset(meta.id, `Version ${presets.length + 2}`);
  }, [meta.id, presets.length]);
  const closePopover = (0, import_react43.useCallback)(() => setPopover(null), []);
  const openClipPopover = (0, import_react43.useCallback)(
    (clip, rect, stepKey) => {
      const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
      const exclude = stepKey ? void 0 : clipPopoverExclusions(clip);
      if (getClipControls(meta.id, targetPath, exclude).length === 0) return;
      setPopover(
        (prev) => prev?.clip.key === clip.key && prev?.stepKey === stepKey ? null : {
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
        }
      );
    },
    [meta.id]
  );
  const toggleTracks = (0, import_react43.useCallback)((clipKey) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(clipKey)) next.delete(clipKey);
      else next.add(clipKey);
      return next;
    });
  }, []);
  const handleBarClick = (0, import_react43.useCallback)(
    (clip, rect, stepKey) => {
      if (!stepKey && clip.tracks?.length) {
        toggleTracks(clip.key);
        return;
      }
      openClipPopover(clip, rect, stepKey);
    },
    [openClipPopover, toggleTracks]
  );
  const toggleGroup = (0, import_react43.useCallback)((group) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);
  const rawStep = pxPerSecond > 0 ? MAJOR_TICK_TARGET_PX / pxPerSecond : 1;
  const adaptiveMajorStep = SECOND_TICK_STEPS.find((step) => step >= rawStep) ?? SECOND_TICK_STEPS[SECOND_TICK_STEPS.length - 1];
  const majorStep = zoom < 1.5 && meta.duration >= 1 ? Math.max(1, adaptiveMajorStep) : adaptiveMajorStep;
  const fineTickStep = majorStep / 10;
  const majorTicks = [];
  const mediumTicks = [];
  const fineTicks = [];
  const firstMajorTick = Math.ceil((safeViewStart - 1e-6) / majorStep) * majorStep;
  for (let t = firstMajorTick; t <= viewEnd + 1e-6; t += majorStep) {
    majorTicks.push(Number(t.toFixed(4)));
  }
  const firstFineIndex = Math.ceil((safeViewStart - 1e-6) / fineTickStep);
  const lastFineIndex = Math.floor((viewEnd + 1e-6) / fineTickStep);
  for (let index = firstFineIndex; index <= lastFineIndex; index++) {
    if (index % 10 === 0) continue;
    const tick = Number((index * fineTickStep).toFixed(6));
    if (index % 5 === 0) mediumTicks.push(tick);
    else fineTicks.push(tick);
  }
  const rows = [];
  let lastGroup;
  for (const clip of meta.clips) {
    if (clip.group !== lastGroup) {
      lastGroup = clip.group;
      if (clip.group) {
        const group = clip.group;
        const isCollapsed = collapsedGroups.has(group);
        rows.push(
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-row dialkit-timeline-group-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-label", children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                "button",
                {
                  className: "dialkit-timeline-group-toggle",
                  "data-open": !isCollapsed,
                  onClick: () => toggleGroup(group),
                  title: isCollapsed ? "Expand layer" : "Collapse layer",
                  children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CHEVRON }) })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { children: formatLabel(group) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-lane" })
          ] }, `group:${group}`)
        );
      }
    }
    if (clip.group && collapsedGroups.has(clip.group)) continue;
    const isProps = Boolean(clip.tracks?.length);
    const tracksOpen = isProps && expandedTracks.has(clip.key);
    const stat = computeClipStaticFromValues(values, clip, meta.duration);
    rows.push(
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-row", "data-grouped": clip.group ? "" : void 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-label", children: [
          isProps ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            "button",
            {
              className: "dialkit-timeline-group-toggle",
              "data-open": tracksOpen,
              onClick: (e) => {
                e.stopPropagation();
                toggleTracks(clip.key);
              },
              title: tracksOpen ? "Collapse properties" : "Expand properties",
              children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CHEVRON }) })
            }
          ) : null,
          clip.label
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-lane", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          TimelineClip,
          {
            timelineId: meta.id,
            clip,
            at: stat.at,
            duration: stat.duration,
            loop: stat.loop,
            steps: clip.stepKeys?.length ? stat.tracks[0]?.steps : void 0,
            fixedDuration: isProps ? true : stat.isPhysics,
            composite: isProps,
            pxPerSecond,
            viewStart: safeViewStart,
            timelineDuration: meta.duration,
            selected: popover?.clip.key === clip.key,
            selectedStepKey: popover?.clip.key === clip.key ? popover.stepKey : void 0,
            onClick: handleBarClick,
            onDrag: closePopover
          }
        ) })
      ] }, clip.key)
    );
    if (tracksOpen) {
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
        rows.push(
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
            "div",
            {
              className: "dialkit-timeline-row dialkit-timeline-track-row",
              "data-grouped": clip.group ? "" : void 0,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-label", children: formatLabel(trackRef.prop) }),
                /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-lane", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                  TimelineClip,
                  {
                    timelineId: meta.id,
                    clip: trackMeta,
                    at: stat.at + track.delay,
                    duration: track.duration,
                    loop: stat.loop,
                    steps: trackRef.stepKeys?.length ? track.steps : void 0,
                    fixedDuration: !trackRef.stepKeys?.length && track.steps[0]?.isPhysics === true,
                    baseAt: stat.at,
                    delayMode: true,
                    pxPerSecond,
                    viewStart: safeViewStart,
                    timelineDuration: meta.duration,
                    selected: popover?.clip.key === trackKey,
                    selectedStepKey: popover?.clip.key === trackKey ? popover.stepKey : void 0,
                    onClick: openClipPopover,
                    onDrag: closePopover
                  }
                ) })
              ]
            },
            trackKey
          )
        );
      }
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-header", "data-open": open || void 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-identity", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "dialkit-timeline-title", children: meta.name }) }),
      !open && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        TimelineOverview,
        {
          id: meta.id,
          duration: meta.duration,
          viewStart: safeViewStart,
          viewEnd,
          onNavigate: centerViewAt
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          import_react44.motion.button,
          {
            className: "dialkit-timeline-loop-toggle",
            "data-active": loopRegion ? "true" : void 0,
            onClick: handleClearLoopRegion,
            disabled: !loopRegion,
            title: loopRegion ? "Looping a region \xB7 click to loop the whole timeline" : "Looping the whole timeline \xB7 drag the ruler to set a loop region",
            "aria-label": loopRegion ? "Clear loop region" : "Looping whole timeline",
            "aria-pressed": loopRegion ? true : false,
            whileTap: loopRegion ? { scale: 0.9 } : void 0,
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: ICON_LOOP.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d }, i)) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(PlayPauseButton, { id: meta.id }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(ReplayButton, { onReplay: handleReplay }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          import_react44.motion.button,
          {
            className: "dialkit-toolbar-add",
            onClick: handleAddPreset,
            title: "Add timeline version",
            "aria-label": "Add timeline version",
            whileTap: { scale: 0.9 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: ICON_ADD_PRESET.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d }, i)) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          PresetManager,
          {
            panelId: meta.id,
            presets,
            activePresetId,
            onAdd: handleAddPreset
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          import_react44.motion.button,
          {
            className: "dialkit-toolbar-add",
            onClick: handleCopy,
            title: "Copy parameters",
            "aria-label": copied ? "Copied parameters" : "Copy parameters",
            whileTap: { scale: 0.9 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { style: { position: "relative", width: 16, height: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_react44.AnimatePresence, { initial: false, mode: "wait", children: copied ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              import_react44.motion.svg,
              {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true",
                style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--dial-text-label)" },
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                transition: { duration: 0.08 },
                children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CHECK })
              },
              "check"
            ) : /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
              import_react44.motion.svg,
              {
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true",
                style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--dial-text-label)" },
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                transition: { duration: 0.08 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CLIPBOARD.board, stroke: "currentColor", strokeWidth: "2", strokeLinejoin: "round" }),
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CLIPBOARD.sparkle, fill: "currentColor" }),
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CLIPBOARD.body, stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
                ]
              },
              "clipboard"
            ) }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          "button",
          {
            className: "dialkit-timeline-chevron",
            "data-open": open,
            "aria-expanded": open,
            onClick: () => setOpen(!open),
            title: open ? "Collapse timeline" : "Expand timeline",
            children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CHEVRON }) })
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
      "div",
      {
        className: "dialkit-timeline-body",
        onWheel: handleTimelineWheel,
        onPointerDown: handleTrackPointerDown,
        onPointerMove: handleTrackPointerMove,
        onPointerUp: finishTrackScrub,
        onPointerCancel: finishTrackScrub,
        onLostPointerCapture: finishTrackScrub,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-grid", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-row dialkit-timeline-ruler-row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-label" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
                "div",
                {
                  ref: laneAreaRef,
                  className: "dialkit-timeline-ruler",
                  onPointerDown: handleRulerPointerDown,
                  onPointerMove: handleRulerPointerMove,
                  onPointerUp: handleRulerPointerUp,
                  onPointerCancel: handleRulerPointerCancel,
                  onLostPointerCapture: handleRulerPointerCancel,
                  title: "Click to seek \xB7 drag to set a loop region \xB7 Option-drag to zoom \xB7 Shift-drag to reset zoom",
                  children: [
                    (() => {
                      const activeLoop = loopDrag ?? loopRegion;
                      if (!activeLoop || pxPerSecond <= 0) return null;
                      const left = (activeLoop.start - safeViewStart) * pxPerSecond;
                      const width = Math.max(0, (activeLoop.end - activeLoop.start) * pxPerSecond);
                      return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-loop-dim", style: { left: 0, width: Math.max(0, left) } }),
                        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-loop-dim", style: { left: left + width, right: 0 } }),
                        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
                          "div",
                          {
                            className: "dialkit-timeline-loop-band",
                            "data-live": loopDrag ? "true" : void 0,
                            style: { left, width }
                          }
                        )
                      ] });
                    })(),
                    fineTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-tick dialkit-timeline-tick-fine", style: { left: (t - safeViewStart) * pxPerSecond } }, `fine:${t}`)),
                    mediumTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-tick dialkit-timeline-tick-medium", style: { left: (t - safeViewStart) * pxPerSecond } }, `medium:${t}`)),
                    majorTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-tick", style: { left: (t - safeViewStart) * pxPerSecond }, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "dialkit-timeline-tick-label", children: formatRulerSeconds(t, majorStep) }) }, t))
                  ]
                }
              )
            ] }),
            rows,
            pxPerSecond > 0 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              TimelinePlayheadFlag,
              {
                id: meta.id,
                duration: meta.duration,
                pxPerSecond,
                viewStart: safeViewStart,
                viewEnd,
                laneWidth,
                rulerRef: laneAreaRef,
                onResetView: resetView
              }
            )
          ] }),
          zoom > 1 && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-scroll-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-label" }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              "div",
              {
                ref: horizontalScrollRef,
                className: "dialkit-timeline-horizontal-scroll",
                onScroll: handleHorizontalScroll,
                "aria-label": "Timeline horizontal scroll",
                children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { style: { width: laneWidth * zoom } })
              }
            )
          ] })
        ]
      }
    ),
    popover && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      ClipPopover,
      {
        panelId: meta.id,
        popover,
        values,
        theme,
        onClose: closePopover
      }
    )
  ] });
});
function ClipPopover({
  panelId,
  popover,
  values,
  theme,
  onClose
}) {
  const ref = (0, import_react43.useRef)(null);
  const [naturalHeight, setNaturalHeight] = (0, import_react43.useState)(0);
  const [viewport, setViewport] = (0, import_react43.useState)(() => ({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
    offsetLeft: window.visualViewport?.offsetLeft ?? 0,
    offsetTop: window.visualViewport?.offsetTop ?? 0
  }));
  (0, import_react43.useLayoutEffect)(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setNaturalHeight(element.scrollHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    const body = element.querySelector(".dialkit-timeline-popover-body");
    observer.observe(body ?? element);
    return () => observer.disconnect();
  }, [popover.clip.key, popover.stepKey]);
  (0, import_react43.useEffect)(() => {
    const updateViewport = () => setViewport({
      width: window.visualViewport?.width ?? window.innerWidth,
      height: window.visualViewport?.height ?? window.innerHeight,
      offsetLeft: window.visualViewport?.offsetLeft ?? 0,
      offsetTop: window.visualViewport?.offsetTop ?? 0
    });
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
    };
  }, []);
  (0, import_react43.useEffect)(() => {
    const handlePointerDown = (e) => {
      const target = e.target;
      if (ref.current?.contains(target)) return;
      if (target.closest?.(".dialkit-timeline-clip")) return;
      if (target.closest?.(".dialkit-timeline-label")) return;
      onClose();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  const { clip, stepKey } = popover;
  let controls;
  let title;
  if (stepKey) {
    controls = getClipControls(panelId, `${clip.key}.${stepKey}`);
    if (stepKey === clip.stepKeys?.[0]) {
      const from = getControlAt(panelId, `${clip.key}.from`);
      if (from) {
        const toIndex = controls.findIndex((control) => control.path === `${clip.key}.${stepKey}.to`);
        controls = toIndex >= 0 ? [...controls.slice(0, toIndex), from, ...controls.slice(toIndex)] : [...controls, from];
      }
    }
    title = `${clip.label} \xB7 ${formatStepLabel(stepKey)}`;
  } else {
    controls = getClipControls(panelId, clip.key, clipPopoverExclusions(clip));
    title = clip.label;
  }
  if (controls.length === 0) return null;
  const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
  const durationMeta = getControlAt(panelId, `${targetPath}.duration`);
  const durationValue = durationMeta ? values[durationMeta.path] : void 0;
  const transitionDuration = durationMeta?.type === "slider" && typeof durationValue === "number" ? {
    value: durationValue,
    onChange: (next) => DialStore.updateValue(panelId, durationMeta.path, next),
    min: Math.max(TIMELINE_MIN_CLIP_DURATION, durationMeta.min ?? 0),
    max: durationMeta.max,
    step: durationMeta.step
  } : void 0;
  const displayValues = timelinePopoverDisplayValues(values, clip.key, clip.stepKeys, stepKey);
  const viewportRight = viewport.offsetLeft + viewport.width;
  const viewportBottom = viewport.offsetTop + viewport.height;
  const popoverWidth = Math.min(POPOVER_WIDTH, Math.max(220, viewport.width - 24));
  const left = clamp5(
    popover.anchor.left + popover.anchor.width / 2 - popoverWidth / 2,
    viewport.offsetLeft + 12,
    Math.max(viewport.offsetLeft + 12, viewportRight - popoverWidth - 12)
  );
  const spaceAbove = Math.max(0, popover.anchor.top - viewport.offsetTop - 22);
  const spaceBelow = Math.max(0, viewportBottom - popover.anchor.bottom - 22);
  const placeAbove = naturalHeight === 0 ? spaceAbove >= spaceBelow : naturalHeight <= spaceAbove || naturalHeight > spaceBelow && spaceAbove >= spaceBelow;
  const availableHeight = placeAbove ? spaceAbove : spaceBelow;
  const renderedHeight = Math.min(naturalHeight || availableHeight, availableHeight);
  const unclampedTop = placeAbove ? popover.anchor.top - 10 - renderedHeight : popover.anchor.bottom + 10;
  const top = clamp5(
    unclampedTop,
    viewport.offsetTop + 12,
    Math.max(viewport.offsetTop + 12, viewportBottom - renderedHeight - 12)
  );
  return (0, import_react_dom8.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-root", "data-theme": theme, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
      "div",
      {
        ref,
        className: "dialkit-timeline-popover",
        "data-placement": placeAbove ? "above" : "below",
        style: {
          left,
          top,
          width: popoverWidth,
          maxHeight: availableHeight,
          visibility: naturalHeight > 0 ? "visible" : "hidden"
        },
        role: "dialog",
        "aria-label": `Edit ${title}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "dialkit-timeline-popover-header", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "dialkit-timeline-popover-title", children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("button", { className: "dialkit-timeline-popover-close", onClick: onClose, title: "Close editor", "aria-label": "Close editor", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: "M6 6L18 18M18 6L6 18" }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-popover-body", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            ControlRenderer,
            {
              panelId,
              controls,
              values: displayValues,
              transitionDuration
            }
          ) })
        ]
      }
    ) }),
    document.body
  );
}
function clipPopoverExclusions(clip) {
  return /* @__PURE__ */ new Set([
    ...clip.stepKeys ?? [],
    ...clip.tracks?.map((track) => track.prop) ?? []
  ]);
}
function getClipControls(panelId, controlPath, excludeChildren) {
  const panel = DialStore.getPanel(panelId);
  const folder = panel ? findControl(panel.controls, controlPath) : null;
  if (!folder?.children) return [];
  return folder.children.filter((control) => {
    const childKey = control.path.slice(controlPath.length + 1);
    if (childKey === "at" || childKey === "duration") return false;
    return !excludeChildren?.has(childKey);
  });
}
function getControlAt(panelId, path) {
  const panel = DialStore.getPanel(panelId);
  return panel ? findControl(panel.controls, path) : null;
}
function TimelineClip({
  timelineId,
  clip,
  at,
  duration,
  loop,
  steps,
  fixedDuration,
  composite = false,
  baseAt = 0,
  delayMode = false,
  pxPerSecond,
  viewStart,
  timelineDuration,
  selected,
  selectedStepKey,
  onClick,
  onDrag
}) {
  const dragRef = (0, import_react43.useRef)(null);
  const [dragging, setDragging] = (0, import_react43.useState)(false);
  const isSteps = Boolean(steps?.length);
  const handlePointerDown = (0, import_react43.useCallback)(
    (e) => {
      if (e.shiftKey) return;
      e.stopPropagation();
      const target = e.target;
      let mode = "move";
      let boundaryIndex;
      const boundary = target.dataset?.boundary;
      if (boundary !== void 0) {
        mode = "boundary";
        boundaryIndex = Number(boundary);
      } else if (!fixedDuration) {
        const edge = target.dataset?.edge;
        if (edge) mode = edge;
      }
      dragRef.current = {
        mode,
        boundaryIndex,
        pointerX: e.clientX,
        at,
        duration,
        stepDurations: steps?.map((step) => step.duration),
        clickEl: target.closest?.("[data-step]") ?? null,
        moved: false
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [at, duration, fixedDuration, steps]
  );
  const handlePointerMove = (0, import_react43.useCallback)(
    (e) => {
      const drag = dragRef.current;
      if (!drag || pxPerSecond <= 0) return;
      const dx = e.clientX - drag.pointerX;
      if (!drag.moved) {
        if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
        drag.moved = true;
        setDragging(true);
        onDrag();
      }
      const dt = dx / pxPerSecond;
      if (drag.mode === "boundary" && steps && drag.stepDurations) {
        const index = drag.boundaryIndex ?? 0;
        const others = drag.stepDurations.reduce((sum, d, j) => j === index ? sum : sum + d, 0);
        DialStore.updateValue(
          timelineId,
          `${clip.key}.${steps[index].key ?? ""}.duration`,
          clampStepResize(drag.stepDurations[index] + dt, drag.at, others, timelineDuration)
        );
      } else if (drag.mode === "move") {
        if (delayMode) {
          DialStore.updateValue(
            timelineId,
            `${clip.key}.delay`,
            clampTrackDelay(drag.at + dt - baseAt, baseAt, drag.duration, timelineDuration)
          );
        } else {
          DialStore.updateValue(timelineId, `${clip.key}.at`, clampClipMove(drag.at + dt, drag.duration, timelineDuration));
        }
      } else if (drag.mode === "end") {
        DialStore.updateValue(
          timelineId,
          `${clip.key}.duration`,
          clampClipResizeEnd(drag.duration + dt, drag.at, timelineDuration)
        );
      } else if (steps && drag.stepDurations) {
        const limit = Math.max(baseAt, 0);
        const next = clampClipResizeStart(Math.max(drag.at + dt, limit), drag.at, drag.stepDurations[0]);
        DialStore.updateValues(timelineId, {
          [delayMode ? `${clip.key}.delay` : `${clip.key}.at`]: delayMode ? Math.max(0, next.at - baseAt) : next.at,
          [`${clip.key}.${steps[0].key ?? ""}.duration`]: next.duration
        });
      } else {
        const limit = Math.max(baseAt, 0);
        const next = clampClipResizeStart(Math.max(drag.at + dt, limit), drag.at, drag.duration);
        DialStore.updateValues(timelineId, {
          [delayMode ? `${clip.key}.delay` : `${clip.key}.at`]: delayMode ? Math.max(0, next.at - baseAt) : next.at,
          [`${clip.key}.duration`]: next.duration
        });
      }
    },
    [baseAt, clip.key, delayMode, onDrag, pxPerSecond, steps, timelineId, timelineDuration]
  );
  const handlePointerUp = (0, import_react43.useCallback)(
    (e) => {
      const drag = dragRef.current;
      dragRef.current = null;
      setDragging(false);
      if (drag && !drag.moved) {
        const stepKey = drag.clickEl?.dataset?.step;
        const anchorEl = drag.clickEl ?? e.currentTarget;
        onClick(clip, anchorEl.getBoundingClientRect(), stepKey);
      }
    },
    [clip, onClick]
  );
  const handlePointerCancel = (0, import_react43.useCallback)(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);
  const width = Math.max(duration * pxPerSecond, 14);
  const resizable = duration > 0 && !fixedDuration && !composite;
  const durationText = `${fixedDuration && !composite ? "~" : ""}${formatSeconds(duration)}`;
  const looping = loop === "repeat" && duration > 0;
  const ghostCycles = [];
  if (looping) {
    const maxGhostCycles = 256;
    const firstGhostIndex = Math.max(1, Math.floor((viewStart - at) / duration));
    for (let offset = 0; offset < maxGhostCycles; offset++) {
      const index = firstGhostIndex + offset;
      const start = at + duration * index;
      if (start >= timelineDuration - 1e-6) break;
      ghostCycles.push({
        start,
        duration: Math.min(duration, timelineDuration - start),
        index
      });
    }
  }
  const boundaryOffsets = [];
  if (steps) {
    let cumulative = 0;
    for (const step of steps) {
      cumulative += step.duration;
      boundaryOffsets.push(cumulative);
    }
  }
  const barTitle = composite ? `${clip.label} \u2014 composite of its property tracks${looping ? " \xB7 repeats through timeline" : ""} \xB7 click to expand` : `${clip.label} \u2014 ${formatSeconds(at)} for ${durationText}${fixedDuration ? " (duration set by spring physics)" : ""}${looping ? " \xB7 repeats through timeline" : ""}${delayMode ? " \xB7 drag to phase-shift" : ""}`;
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
    ghostCycles.map((cycle) => {
      const ghostWidth = Math.max(1, cycle.duration * pxPerSecond - 2);
      return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "div",
        {
          className: "dialkit-timeline-clip-ghost",
          "data-steps": isSteps || void 0,
          "aria-hidden": "true",
          style: {
            left: (cycle.start - viewStart) * pxPerSecond + 1,
            width: ghostWidth,
            background: clip.color
          },
          children: steps?.map((step, stepIndex) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            "span",
            {
              className: "dialkit-timeline-clip-ghost-segment",
              style: { width: step.duration * pxPerSecond }
            },
            step.key ?? `step:${stepIndex}`
          ))
        },
        `ghost:${cycle.index}`
      );
    }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      "div",
      {
        className: "dialkit-timeline-clip",
        "data-steps": isSteps || void 0,
        "data-composite": composite || void 0,
        "data-selected": selected || void 0,
        "data-dragging": dragging || void 0,
        style: {
          left: (at - viewStart) * pxPerSecond,
          width,
          background: composite ? `${clip.color}80` : clip.color
        },
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerCancel,
        onLostPointerCapture: handlePointerCancel,
        title: barTitle,
        children: composite ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_jsx_runtime37.Fragment, { children: width > 56 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "dialkit-timeline-clip-duration", children: durationText }) }) : isSteps ? /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
          steps.map((step) => {
            const segmentWidth = step.duration * pxPerSecond;
            return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              "div",
              {
                className: "dialkit-timeline-clip-segment",
                "data-step": step.key ?? void 0,
                "data-selected": selectedStepKey === step.key || void 0,
                style: { width: segmentWidth },
                children: segmentWidth > 52 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "dialkit-timeline-clip-duration", children: formatSeconds(step.duration) })
              },
              step.key ?? "step"
            );
          }),
          steps.map(
            (step, index) => step.isPhysics ? null : /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              "div",
              {
                className: "dialkit-timeline-clip-handle",
                "data-boundary": index,
                style: { left: boundaryOffsets[index] * pxPerSecond - 4 }
              },
              `boundary:${step.key}`
            )
          ),
          !steps[0].isPhysics && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-clip-handle", "data-edge": "start" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
          resizable && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-clip-handle", "data-edge": "start" }),
          width > 56 && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "dialkit-timeline-clip-duration", children: durationText }),
          resizable && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "dialkit-timeline-clip-handle", "data-edge": "end" })
        ] })
      }
    ),
    looping && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "dialkit-timeline-loop-infinity", "aria-hidden": "true", title: "Repeats indefinitely", children: "\u221E" })
  ] });
}

// src/components/Module.tsx
var import_jsx_runtime38 = require("react/jsx-runtime");
function Module({ title, enabled, onEnabledChange, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "dialkit-module", children: [
    /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "dialkit-module-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(Checkbox, { checked: enabled, onChange: onEnabledChange, label: title }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "dialkit-module-title", children: title })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "dialkit-module-collapse", "data-open": enabled, children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "dialkit-module-collapse-clip", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "dialkit-module-inner", children }) }) })
  ] });
}

// src/components/ButtonGroup.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
function ButtonGroup({ buttons }) {
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "dialkit-button-group", children: buttons.map((button, index) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    "button",
    {
      className: "dialkit-button",
      onClick: button.onClick,
      children: button.label
    },
    index
  )) });
}

// src/components/WaveformVisualization.tsx
var import_react45 = require("react");

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

// src/components/WaveformVisualization.tsx
var import_jsx_runtime40 = require("react/jsx-runtime");
function WaveformVisualization({
  buffer = null,
  progress = 0,
  getProgress,
  mode = "smooth",
  border = false,
  bands = false,
  pixelSize = 1,
  grid = false,
  gridSubdivisions = 8,
  onSeek,
  loop = null,
  onLoopChange,
  waveColor,
  playheadColor,
  autoZoomOnLoop = false,
  width = 256,
  height = 140
}) {
  const canvasRef = (0, import_react45.useRef)(null);
  const [zoom, setZoom] = (0, import_react45.useState)(1);
  const runtimeRef = (0, import_react45.useRef)(null);
  runtimeRef.current = {
    buffer,
    progress,
    getProgress,
    mode,
    border,
    bands,
    pixelSize,
    grid,
    gridSubdivisions,
    waveColor,
    playheadColor,
    autoZoomOnLoop,
    loop,
    zoom,
    width,
    height,
    onSeek,
    onLoopChange
  };
  (0, import_react45.useEffect)(() => {
    if (!canvasRef.current) return;
    const engine = createWaveformEngine(canvasRef.current, () => runtimeRef.current);
    return () => engine.destroy();
  }, []);
  const atMaxZoom = zoom >= WAVEFORM_MAX_ZOOM;
  const framingLoop = autoZoomOnLoop && !!loop;
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "dialkit-waveform-viz-wrap", style: { width }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("canvas", { ref: canvasRef, className: "dialkit-waveform-viz", style: { width, height } }),
    !framingLoop && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("div", { className: "dialkit-waveform-zoom", children: [
      zoom > 1 && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("button", { type: "button", "aria-label": "Zoom out", onClick: () => setZoom((z) => Math.max(1, z / 2)), children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("svg", { viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("path", { d: "M3.5 8h9", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
        "button",
        {
          type: "button",
          "aria-label": "Zoom in",
          disabled: atMaxZoom,
          onClick: () => setZoom((z) => Math.min(WAVEFORM_MAX_ZOOM, z * 2)),
          children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("svg", { viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("path", { d: "M8 3.5v9M3.5 8h9", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) })
        }
      )
    ] })
  ] });
}

// src/components/AnalyserVisualization.tsx
var import_react46 = require("react");

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
function peakLevel(data) {
  let mx = 0;
  for (let i = 0; i < data.length; i++) {
    const v = Math.abs(byteTimeToUnit(data[i]));
    if (v > mx) mx = v;
  }
  return mx;
}
function advanceSweep(history, head, prevLevel, level, dtCols) {
  const n = history.length;
  if (!n) return 0;
  const d = Math.min(dtCols, n);
  const next = head + d;
  for (let c = Math.floor(head) + 1; c <= Math.floor(next); c++) {
    const t = d > 0 ? (c - head) / d : 1;
    history[(c % n + n) % n] = prevLevel + (level - prevLevel) * t;
  }
  return (next % n + n) % n;
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
var EKG_SCROLL_SECONDS = 2.5;
var EKG_AMP = 0.85;
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
  const baselineY = (source) => source === "frequency" ? H - Math.round(dpr) : source === "ekg" ? H - Math.round(3 * dpr) : cy;
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
  let ekgHistory = new Float32Array(0);
  let ekgHead = 0;
  let ekgPrevLevel = 0;
  const ekgPos = new Float32Array(1);
  const ekgVel = new Float32Array(1);
  const ekgTarget = new Float32Array(1);
  let ekgSeeded = false;
  const syncEkg = (n) => {
    if (ekgHistory.length === n) return;
    ekgHistory = new Float32Array(n);
    ekgHead = 0;
    ekgSeeded = false;
  };
  const drawEkg = (rt, dt, base, alpha) => {
    const pixelated = rt.mode === "pixelated";
    const colW = columnWidth2(pixelated ? rt.pixelSize : 1);
    const n = Math.max(2, Math.floor(W / colW));
    syncEkg(n);
    const raw = peakLevel(bytes);
    const spring = normalizeSpring(rt.spring);
    let level = raw;
    if (spring) {
      if (!ekgSeeded) {
        ekgPos[0] = raw;
        ekgVel[0] = 0;
        ekgSeeded = true;
      }
      ekgTarget[0] = raw;
      stepSprings(ekgPos, ekgVel, ekgTarget, spring.stiffness, spring.damping, dt);
      level = ekgPos[0];
    } else {
      ekgSeeded = false;
    }
    ekgHead = advanceSweep(ekgHistory, ekgHead, ekgPrevLevel, level, dt / EKG_SCROLL_SECONDS * n);
    ekgPrevLevel = level;
    const baseY = baselineY("ekg");
    const toY = (v) => Math.max(0, Math.min(H, baseY - v * (H * EKG_AMP)));
    const headCol = Math.floor(ekgHead);
    const colBehind = (k) => ((headCol - k) % n + n) % n;
    const wave = rt.waveColor || base;
    const fill = rt.fillColor || wave;
    if (pixelated) {
      const penX2 = (n - 1) * colW;
      const blockY = (v) => Math.max(0, Math.min(H - colW, quantizeToGrid(toY(v) - colW / 2, colW)));
      ctx.fillStyle = wave;
      ctx.globalAlpha = alpha;
      for (let k = 1; k < n; k++) {
        const x = penX2 - k * colW;
        const y = blockY(ekgHistory[colBehind(k)]);
        if (rt.variant === "area") ctx.fillRect(x, y, colW, Math.max(colW, baseY - y));
        else ctx.fillRect(x, y, colW, colW);
      }
      ctx.fillRect(penX2, blockY(level), colW, colW);
      ctx.globalAlpha = 1;
      return;
    }
    const penX = W - Math.round(3 * dpr);
    const frac = ekgHead - headCol;
    const pts = [{ x: penX, y: toY(level) }];
    for (let k = 0; k < n; k++) {
      const x = penX - (k + frac) * colW;
      pts.push({ x, y: toY(ekgHistory[colBehind(k)]) });
      if (x <= 0) break;
    }
    if (rt.variant === "area") {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[pts.length - 1].x, baseY);
      ctx.lineTo(penX, baseY);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.globalAlpha = AREA_FILL_ALPHA * alpha;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.fillStyle = wave;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(penX, toY(level), 2.6 * dpr, 0, Math.PI * 2);
    ctx.fill();
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
    if (rt.source === "ekg") {
      drawEkg(rt, dt, base, alpha);
      return;
    }
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

// src/components/AnalyserVisualization.tsx
var import_jsx_runtime41 = require("react/jsx-runtime");
function AnalyserVisualization({
  analyser = null,
  source = "frequency",
  variant = "area",
  mode = "smooth",
  pixelSize = 1,
  scale = "log",
  spring = false,
  grid = false,
  gridSubdivisions = 8,
  waveColor,
  fillColor,
  muted = false,
  onMuteChange,
  soloed = false,
  onSoloChange,
  width = 256,
  height = 140
}) {
  const canvasRef = (0, import_react46.useRef)(null);
  const runtimeRef = (0, import_react46.useRef)(null);
  runtimeRef.current = {
    analyser,
    source,
    variant,
    mode,
    pixelSize,
    scale,
    spring,
    grid,
    gridSubdivisions,
    waveColor,
    fillColor,
    muted,
    width,
    height
  };
  (0, import_react46.useEffect)(() => {
    if (!canvasRef.current) return;
    const engine = createAnalyserEngine(canvasRef.current, () => runtimeRef.current);
    return () => engine.destroy();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "dialkit-analyser-viz-wrap", style: { width }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("canvas", { ref: canvasRef, className: "dialkit-analyser-viz", style: { width, height } }),
    (onMuteChange || onSoloChange) && /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "dialkit-analyser-actions", children: [
      onMuteChange && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("button", { type: "button", "aria-label": "Mute", "aria-pressed": muted, onClick: () => onMuteChange(!muted), children: "M" }),
      onSoloChange && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("button", { type: "button", "aria-label": "Solo", "aria-pressed": soloed, onClick: () => onSoloChange(!soloed), children: "S" })
    ] })
  ] });
}

// src/components/CurveComposer.tsx
var import_react47 = require("react");

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
function removeSegment(comp, index) {
  if (comp.segments.length <= 1) return comp;
  return cloneSegments(comp, comp.segments.filter((_, i) => i !== index));
}
function cycleSegmentType(comp, index) {
  const src = comp.segments[index];
  if (!src) return comp;
  const type = CURVE_CYCLE[(CURVE_CYCLE.indexOf(src.type) + 1) % CURVE_CYCLE.length];
  const next = comp.segments.slice();
  next[index] = { ...src, type, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 };
  return cloneSegments(comp, next);
}
function flipCurve(c) {
  const type = c.type === "easeIn" ? "easeOut" : c.type === "easeOut" ? "easeIn" : c.type;
  return { ...c, type, curvature: -c.curvature, overshoot: c.anticipate ?? 0, anticipate: c.overshoot ?? 0 };
}
function flipSegment(comp, index) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = flipCurve(src);
  return cloneSegments(comp, next);
}
function flipDriver(comp) {
  if (!comp.driver) return comp;
  return { ...comp, driver: flipCurve(comp.driver) };
}
function flipSegmentX(comp, index) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, flipX: !src.flipX };
  return cloneSegments(comp, next);
}
function flipSegmentY(comp, index) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, flipY: !src.flipY };
  return cloneSegments(comp, next);
}
function flipDriverX(comp) {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, flipX: !comp.driver.flipX } };
}
function flipDriverY(comp) {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, flipY: !comp.driver.flipY } };
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
function setSegmentOvershoot(comp, index, overshoot) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, overshoot: clamp013(overshoot) };
  return cloneSegments(comp, next);
}
function setSegmentAnticipate(comp, index, anticipate) {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, anticipate: clamp013(anticipate) };
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
function addDriver(comp) {
  if (comp.driver) return comp;
  return { ...comp, driver: { type: "easeInOut", curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 } };
}
function removeDriver(comp) {
  return { ...comp, driver: null };
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
function setDriverOvershoot(comp, overshoot) {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, overshoot: clamp013(overshoot) } };
}
function setDriverAnticipate(comp, anticipate) {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, anticipate: clamp013(anticipate) } };
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
function triggerLevels(steps) {
  const n = Math.max(2, Math.floor(steps));
  const out = [];
  for (let k = 0; k < n; k++) out.push(k / (n - 1));
  return out;
}
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
function defaultComposition() {
  return {
    segments: [
      { type: "easeOut", weight: 1, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 },
      { type: "easeInOut", weight: 1, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 }
    ],
    driver: null,
    direction: "forward"
  };
}

// src/components/CurveComposer.tsx
var import_jsx_runtime42 = require("react/jsx-runtime");
function CurveComposer({
  segments,
  driver = null,
  direction = "forward",
  onSegmentsChange,
  onDriverChange,
  getPhase,
  phase = 0,
  mode = "continuous",
  triggerSteps = DEFAULT_TRIGGER_STEPS,
  onTrigger,
  selectedIndex = null,
  onSelect,
  gap = 0,
  curveColor,
  playheadColor,
  grid = false,
  gridSubdivisions = 8,
  width = 256,
  height = 140
}) {
  const layout = composerLayout(width, height, driver != null);
  const { W, totalH, mainRect, driverRect } = layout;
  const composition = (0, import_react47.useMemo)(
    () => ({ segments, driver, direction, gap }),
    [segments, driver, direction, gap]
  );
  const samplers = (0, import_react47.useMemo)(() => buildSamplers(composition), [composition]);
  const liveRef = (0, import_react47.useRef)({ composition, samplers, getPhase, phase, mode, triggerSteps });
  liveRef.current = { composition, samplers, getPhase, phase, mode, triggerSteps };
  const onTriggerRef = (0, import_react47.useRef)(onTrigger);
  onTriggerRef.current = onTrigger;
  const svgRef = (0, import_react47.useRef)(null);
  const seriesPlayheadRef = (0, import_react47.useRef)(null);
  const seriesDotRef = (0, import_react47.useRef)(null);
  const driverPlayheadRef = (0, import_react47.useRef)(null);
  const prevTrigValue = (0, import_react47.useRef)(Number.NaN);
  const [drag, setDrag] = (0, import_react47.useState)(null);
  const [hover, setHover] = (0, import_react47.useState)(null);
  const dragRef = (0, import_react47.useRef)(null);
  dragRef.current = drag;
  (0, import_react47.useEffect)(() => {
    let raf = 0;
    prevTrigValue.current = Number.NaN;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const { composition: c, samplers: s, getPhase: gp, phase: p, mode: md, triggerSteps: ts } = liveRef.current;
      const u = gp ? gp() : p;
      const read = readComposition(c, u, s);
      const geo = playheadGeometry(read, layout);
      if (seriesPlayheadRef.current) {
        seriesPlayheadRef.current.setAttribute("x1", String(geo.seriesX));
        seriesPlayheadRef.current.setAttribute("x2", String(geo.seriesX));
      }
      if (seriesDotRef.current) {
        seriesDotRef.current.setAttribute("cx", String(geo.dotX));
        seriesDotRef.current.setAttribute("cy", String(geo.dotY));
      }
      if (driverPlayheadRef.current) {
        driverPlayheadRef.current.setAttribute("x1", String(geo.driverX));
        driverPlayheadRef.current.setAttribute("x2", String(geo.driverX));
      }
      if (md === "trigger") {
        const prev = prevTrigValue.current;
        if (!Number.isNaN(prev)) {
          for (const idx of triggersCrossed(prev, read.value, ts)) onTriggerRef.current?.(idx);
        }
        prevTrigValue.current = read.value;
      } else {
        prevTrigValue.current = Number.NaN;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [W, totalH]);
  const hitLayout = () => ({ totalH, driverY: driverRect ? driverRect.y : null, gap });
  const localCoords = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return { ...toLocalCoords(clientX, clientY, rect, totalH), rectW: rect.width };
  };
  const onPointerDown = (e) => {
    const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
    try {
      svgRef.current?.setPointerCapture(e.pointerId);
    } catch {
    }
    const header = headerHit(xN, py, segments, hitLayout());
    if (typeof header === "number") {
      setDrag({ kind: "select", index: header, startX: e.clientX, startY: e.clientY, moved: false });
      return;
    }
    const target = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT2 / rectW);
    if (target.kind === "driver") {
      setDrag({
        kind: "driver",
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: driver.curvature,
        baseSteepness: driver.steepness,
        moved: false
      });
    } else if (target.kind === "boundary") {
      setDrag({ kind: "boundary", index: target.index, startX: e.clientX, startY: e.clientY, base: composition, moved: false });
    } else {
      const seg = segments[target.index];
      setDrag({
        kind: "segment",
        index: target.index,
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: seg?.curvature ?? 0,
        baseSteepness: seg?.steepness ?? 0,
        moved: false
      });
    }
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) {
      const { xN, py, rectW: rectW2 } = localCoords(e.clientX, e.clientY);
      if (typeof headerHit(xN, py, segments, hitLayout()) === "number") {
        setHover({ kind: "header", index: 0 });
        return;
      }
      const t = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT2 / rectW2);
      setHover(t.kind === "driver" ? { kind: "driver", index: 0 } : { kind: t.kind, index: t.index });
      return;
    }
    const svgRect = svgRef.current.getBoundingClientRect();
    const rectW = svgRect.width;
    const rectH = svgRect.height;
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD2;
    if (!moved) return;
    if (d.kind === "boundary") {
      const deltaFrac = (e.clientX - d.startX) / rectW;
      const next = redistributeWeight(d.base, d.index, deltaFrac);
      onSegmentsChange?.(next.segments);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else if (d.kind === "segment") {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applySegmentBodyDrag(composition, d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      onSegmentsChange?.(next.segments);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else if (d.kind === "driver") {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applyDriverBodyDrag(composition, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      if (next.driver) onDriverChange?.(next.driver);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else {
      if (!d.moved) setDrag({ ...d, moved: true });
    }
  };
  const onPointerUp = (e) => {
    const d = dragRef.current;
    setDrag(null);
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
    }
    if (!d || d.moved) return;
    if (d.kind === "select") {
      onSelect?.(d.index);
    } else if (d.kind === "driver") {
      const next = cycleDriverType(composition);
      if (next.driver) onDriverChange?.(next.driver);
    } else if (d.kind === "segment") {
      onSegmentsChange?.(cycleSegmentType(composition, d.index).segments);
    }
  };
  const onPointerCancel = (e) => {
    setDrag(null);
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
    }
  };
  const onDoubleClick = (e) => {
    const { xN, py } = localCoords(e.clientX, e.clientY);
    if (driverRect && py >= driverRect.y) return;
    onSegmentsChange?.(splitSegment(composition, segmentIndexAt(xN, segments, gap)).segments);
  };
  const activeKind = drag?.kind ?? hover?.kind;
  const cursor = activeKind === "boundary" ? "ew-resize" : activeKind === "segment" || activeKind === "driver" ? "move" : activeKind === "select" || activeKind === "header" ? "pointer" : "default";
  const interior = boundaries(segments, gap);
  const renderLaneGrid = (rect) => {
    if (!grid) return null;
    const n = Math.max(1, Math.round(gridSubdivisions));
    const lines = [];
    for (let i = 1; i < n; i++) {
      const gx = i / n * W;
      lines.push(
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("line", { x1: gx, y1: rect.y, x2: gx, y2: rect.y + rect.h, className: "dialkit-cc-grid" }, `g-${rect.y}-${i}`)
      );
    }
    return lines;
  };
  const renderLaneBg = (rect, key) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("rect", { className: "dialkit-cc-lane", x: rect.x, y: rect.y, width: rect.w, height: rect.h, rx: 8 }, key);
  const diagonal = (rect, span, key) => {
    const d = diagonalLine(rect, span, W);
    return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("line", { className: "dialkit-cc-diagonal", x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2 }, key);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "dialkit-cc-wrap", style: { width: W }, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
    "svg",
    {
      ref: svgRef,
      className: "dialkit-cc",
      viewBox: `0 0 ${W} ${totalH}`,
      width: W,
      height: totalH,
      style: { width: W, height: totalH, cursor, color: curveColor },
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onPointerLeave: () => !dragRef.current && setHover(null),
      onDoubleClick,
      children: [
        renderLaneBg(mainRect, "main-bg"),
        renderLaneGrid(mainRect),
        selectedIndex != null && selectedIndex >= 0 && selectedIndex < segments.length && (() => {
          const span = segmentSpan(segments, selectedIndex, gap);
          return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
            "rect",
            {
              className: "dialkit-cc-seg-selected",
              x: span[0] * W,
              y: mainRect.y,
              width: (span[1] - span[0]) * W,
              height: mainRect.h,
              rx: 8
            }
          );
        })(),
        hover?.kind === "segment" && !drag && (() => {
          const span = segmentSpan(segments, hover.index, gap);
          return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
            "rect",
            {
              className: "dialkit-cc-seg-hover",
              x: span[0] * W,
              y: mainRect.y,
              width: (span[1] - span[0]) * W,
              height: mainRect.h,
              rx: 8
            }
          );
        })(),
        segments.map((seg, i) => {
          const span = segmentSpan(segments, i, gap);
          return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("g", { children: [
            diagonal(mainRect, span, `diag-${i}`),
            /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { className: "dialkit-cc-curve", d: curvePath(seg, mainRect, span, W) }),
            /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("text", { className: "dialkit-cc-label", x: (span[0] + span[1]) * 0.5 * W, y: mainRect.y + 13, children: seg.type })
          ] }, `seg-${i}`);
        }),
        gap > 0 && timelineSlots(segments, gap).filter((slot) => slot.kind === "gap" && slot.b > slot.a).map((slot) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          "path",
          {
            className: "dialkit-cc-connector",
            d: connectorPath(slot, samplers, segments.length, mainRect, W)
          },
          `conn-${slot.index}`
        )),
        interior.map((bx, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          "line",
          {
            className: "dialkit-cc-boundary",
            "data-active": String(
              hover?.kind === "boundary" && hover.index === i || drag?.kind === "boundary" && drag.index === i
            ),
            x1: bx * W,
            y1: mainRect.y,
            x2: bx * W,
            y2: mainRect.y + mainRect.h
          },
          `b-${i}`
        )),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("line", { ref: seriesPlayheadRef, className: "dialkit-cc-playhead", x1: 0, y1: mainRect.y, x2: 0, y2: mainRect.y + mainRect.h, style: { stroke: playheadColor } }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("circle", { ref: seriesDotRef, className: "dialkit-cc-dot", cx: 0, cy: mapY(mainRect, 0), r: 3, style: { fill: playheadColor } }),
        driverRect && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
          renderLaneBg(driverRect, "driver-bg"),
          renderLaneGrid(driverRect),
          hover?.kind === "driver" && !drag && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("rect", { className: "dialkit-cc-seg-hover", x: 0, y: driverRect.y, width: W, height: driverRect.h, rx: 8 }),
          diagonal(driverRect, [0, 1], "driver-diag"),
          /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { className: "dialkit-cc-curve dialkit-cc-curve-driver", d: curvePath(driver, driverRect, [0, 1], W) }),
          /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("text", { className: "dialkit-cc-label", x: W * 0.5, y: driverRect.y + 13, children: [
            "driver \xB7 ",
            driver.type
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("line", { ref: driverPlayheadRef, className: "dialkit-cc-playhead", x1: 0, y1: driverRect.y, x2: 0, y2: driverRect.y + driverRect.h, style: { stroke: playheadColor } })
        ] })
      ]
    }
  ) });
}

// src/components/ShortcutsMenu.tsx
var import_react48 = require("react");
var import_react_dom9 = require("react-dom");
var import_react49 = require("motion/react");
var import_jsx_runtime43 = require("react/jsx-runtime");
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
function ShortcutsMenu({ panelId }) {
  const [isOpen, setIsOpen] = (0, import_react48.useState)(false);
  const triggerRef = (0, import_react48.useRef)(null);
  const dropdownRef = (0, import_react48.useRef)(null);
  const [pos, setPos] = (0, import_react48.useState)({ top: 0, right: 0 });
  const open = (0, import_react48.useCallback)(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setIsOpen(true);
  }, []);
  const close = (0, import_react48.useCallback)(() => setIsOpen(false), []);
  const toggle2 = (0, import_react48.useCallback)(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);
  (0, import_react48.useEffect)(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);
  const panel = DialStore.getPanel(panelId);
  if (!panel) return null;
  const shortcuts = Object.entries(panel.shortcuts);
  if (shortcuts.length === 0) return null;
  const rows = shortcuts.map(([path, shortcut]) => {
    const findLabel = (controls) => {
      for (const c of controls) {
        if (c.path === path) return c.label;
        if (c.type === "folder" && c.children) {
          const found = findLabel(c.children);
          if (found) return found;
        }
      }
      return path;
    };
    return {
      path,
      shortcut,
      label: findLabel(panel.controls)
    };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(import_jsx_runtime43.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
      import_react49.motion.button,
      {
        ref: triggerRef,
        className: "dialkit-shortcuts-trigger",
        onClick: toggle2,
        title: "Keyboard shortcuts",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("path", { d: "M6 10H6.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("path", { d: "M10 10H10.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("path", { d: "M14 10H14.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("path", { d: "M18 10H18.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("path", { d: "M8 14H16" })
        ] })
      }
    ),
    (0, import_react_dom9.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_react49.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "dialkit-root dialkit-shortcuts-dropdown",
          style: { position: "fixed", top: pos.top, right: pos.right },
          initial: { opacity: 0, y: 4, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "dialkit-shortcuts-title", children: "Keyboard Shortcuts" }),
            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "dialkit-shortcuts-list", children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "dialkit-shortcuts-row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { className: "dialkit-shortcuts-row-key", children: formatShortcutKey(row.shortcut) }),
              /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { className: "dialkit-shortcuts-row-label", children: row.label }),
              /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { className: "dialkit-shortcuts-row-mode", children: formatInteraction(row.shortcut) })
            ] }, row.path)) }),
            /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "dialkit-shortcuts-hint", children: "See pill badges on controls for keys" })
          ]
        }
      ) }),
      document.body
    )
  ] });
}

// src/components/AudioLevelMeter.tsx
var import_react50 = require("react");
var import_jsx_runtime44 = require("react/jsx-runtime");
var DEFAULT_CELL_COUNT = 10;
var MIN_CELL_COUNT = 8;
var MAX_CELL_COUNT = 12;
var MAX_SPECTRUM_BANDS = 12;
var PEAK_HOLD_MS = 560;
var PEAK_FALL_INTERVAL_MS = 120;
function clampLevel(value) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}
function normalizeCellCount(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_CELL_COUNT;
  return Math.min(MAX_CELL_COUNT, Math.max(MIN_CELL_COUNT, Math.round(value)));
}
function levelToCellCount(level, cellCount) {
  return level === 0 ? 0 : Math.ceil(level * cellCount);
}
function formatPercentage(level) {
  return `${Math.round(level * 100)}%`;
}
function getValueSummary(mode, levels) {
  if (mode === "mono") {
    return `Level ${formatPercentage(levels[0])}`;
  }
  if (mode === "stereo") {
    return `Left ${formatPercentage(levels[0])}, right ${formatPercentage(levels[1])}`;
  }
  return `Band levels ${levels.map(formatPercentage).join(", ")}`;
}
function getRawLevels(props) {
  if (props.mode === "stereo") {
    return props.levels.map((level) => Number.isFinite(level) ? level : 0);
  }
  if (props.mode === "spectrum") {
    const levels = props.levels.slice(0, MAX_SPECTRUM_BANDS).map((level) => Number.isFinite(level) ? level : 0);
    return levels.length > 0 ? levels : [0];
  }
  return [Number.isFinite(props.levels) ? props.levels : 0];
}
function getCellColor(colors, indexFromBottom, cellCount) {
  if (colors.length === 0) return void 0;
  const colorIndex = Math.min(
    colors.length - 1,
    Math.floor(indexFromBottom / cellCount * colors.length)
  );
  return colors[colorIndex];
}
function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = (0, import_react50.useState)(false);
  (0, import_react50.useEffect)(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);
  return reducedMotion;
}
function createPeakState(index, timestamp) {
  return { index, holdStartedAt: timestamp, lastDropAt: timestamp };
}
function remapPeakIndex(index, previousCellCount, cellCount) {
  if (index < 0) return -1;
  return Math.min(
    cellCount - 1,
    Math.ceil((index + 1) / previousCellCount * cellCount) - 1
  );
}
function getDefaultLabel(mode, bandCount) {
  if (mode === "mono") {
    return "Audio level meter, mono";
  }
  if (mode === "stereo") {
    return "Audio level meter, stereo";
  }
  return `Audio spectrum analyzer, ${bandCount} bands`;
}
function getBandName(mode, index) {
  if (mode === "mono") return "mono";
  if (mode === "stereo") return index === 0 ? "left" : "right";
  return `band ${index + 1}`;
}
function AudioLevelMeter(props) {
  const mode = props.mode ?? "mono";
  const cellCount = normalizeCellCount(props.cellCount);
  const rawLevels = getRawLevels(props);
  const levels = rawLevels.map(clampLevel);
  const clippedBands = rawLevels.map((level) => level > 1);
  const activeCellCounts = levels.map((level) => levelToCellCount(level, cellCount));
  const activeCellKey = activeCellCounts.join(":");
  const clippedBandKey = clippedBands.map(Number).join(":");
  const currentTopCellsRef = (0, import_react50.useRef)(activeCellCounts.map((count) => count - 1));
  const currentClippedBandsRef = (0, import_react50.useRef)(clippedBands);
  const cellCountRef = (0, import_react50.useRef)(cellCount);
  const peakStatesRef = (0, import_react50.useRef)([]);
  const clipHoldUntilRef = (0, import_react50.useRef)(clippedBands.map(() => 0));
  const animationFrameRef = (0, import_react50.useRef)(null);
  const reducedMotion = usePrefersReducedMotion();
  const [peakIndices, setPeakIndices] = (0, import_react50.useState)(
    () => activeCellCounts.map((count) => count - 1)
  );
  const [heldClippedBands, setHeldClippedBands] = (0, import_react50.useState)(clippedBands.map(() => false));
  const displayedClippedBands = heldClippedBands.map(
    (isHeld, index) => isHeld || clippedBands[index]
  );
  const displayedPeakIndices = peakIndices.map(
    (index) => remapPeakIndex(index, cellCountRef.current, cellCount)
  );
  const colors = (props.colors ?? []).slice(0, 3).filter(
    (color) => typeof color === "string" && color.trim().length > 0
  );
  (0, import_react50.useEffect)(() => {
    const timestamp = performance.now();
    const currentTopCells = activeCellKey.split(":").map(Number).map((count) => count - 1);
    const currentClippedBands = clippedBandKey.split(":").map((value) => value === "1");
    const previousCellCount = cellCountRef.current;
    const cellCountChanged = previousCellCount !== cellCount;
    const previousCurrentClippedBands = currentClippedBandsRef.current;
    let previousTopCells = currentTopCellsRef.current;
    if (cellCountChanged) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      previousTopCells = previousTopCells.map(
        (index) => remapPeakIndex(index, previousCellCount, cellCount)
      );
      peakStatesRef.current = peakStatesRef.current.map((peak) => ({
        ...peak,
        index: remapPeakIndex(peak.index, previousCellCount, cellCount)
      }));
      cellCountRef.current = cellCount;
    }
    currentTopCellsRef.current = currentTopCells;
    currentClippedBandsRef.current = currentClippedBands;
    const nextClipHoldUntil = currentClippedBands.map((isCurrentlyClipped, index) => {
      if (isCurrentlyClipped) return Number.POSITIVE_INFINITY;
      if (previousCurrentClippedBands[index]) return timestamp + PEAK_HOLD_MS;
      return clipHoldUntilRef.current[index] ?? 0;
    });
    clipHoldUntilRef.current = nextClipHoldUntil;
    if (reducedMotion) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      peakStatesRef.current = currentTopCells.map((index) => createPeakState(index, timestamp));
      clipHoldUntilRef.current = currentClippedBands.map(() => 0);
      setPeakIndices(currentTopCells);
      setHeldClippedBands(currentClippedBands.map(() => false));
      return;
    }
    const nextPeakStates = currentTopCells.map((currentTop, index) => {
      const previous = peakStatesRef.current[index];
      if (!previous || currentTop > previous.index) {
        return createPeakState(currentTop, timestamp);
      }
      if (currentTop === previous.index) {
        return createPeakState(currentTop, timestamp);
      }
      if ((previousTopCells[index] ?? -1) >= previous.index) {
        return {
          ...previous,
          holdStartedAt: timestamp,
          lastDropAt: timestamp
        };
      }
      return previous;
    });
    peakStatesRef.current = nextPeakStates;
    setPeakIndices(nextPeakStates.map((peak) => peak.index));
    setHeldClippedBands(
      nextClipHoldUntil.map(
        (holdUntil, index) => !currentClippedBands[index] && holdUntil > timestamp
      )
    );
    if (animationFrameRef.current !== null) return;
    const hasFallingPeak = nextPeakStates.some(
      (peak, index) => peak.index > currentTopCells[index]
    );
    const hasClipHold = nextClipHoldUntil.some(
      (holdUntil, index) => !currentClippedBands[index] && holdUntil > timestamp
    );
    if (!hasFallingPeak && !hasClipHold) return;
    const animatePeaks = (frameTimestamp) => {
      let peakChanged = false;
      let clipHoldChanged = false;
      let needsAnotherFrame = false;
      const next = peakStatesRef.current.map((peak, index) => {
        const currentTop = currentTopCellsRef.current[index] ?? -1;
        if (peak.index <= currentTop) {
          return createPeakState(currentTop, frameTimestamp);
        }
        const fallStartedAt = peak.holdStartedAt + PEAK_HOLD_MS;
        if (frameTimestamp >= fallStartedAt) {
          const dropFrom = Math.max(peak.lastDropAt, fallStartedAt);
          const dropCount = Math.floor((frameTimestamp - dropFrom) / PEAK_FALL_INTERVAL_MS);
          if (dropCount > 0) {
            const nextIndex = Math.max(currentTop, peak.index - dropCount);
            peakChanged = peakChanged || nextIndex !== peak.index;
            peak = {
              ...peak,
              index: nextIndex,
              lastDropAt: dropFrom + dropCount * PEAK_FALL_INTERVAL_MS
            };
          }
        }
        needsAnotherFrame = needsAnotherFrame || peak.index > currentTop;
        return peak;
      });
      const nextClipHolds = clipHoldUntilRef.current.map((holdUntil, index) => {
        const isCurrentlyClipped = currentClippedBandsRef.current[index] ?? false;
        if (isCurrentlyClipped || holdUntil === 0) return holdUntil;
        if (holdUntil <= frameTimestamp) {
          clipHoldChanged = true;
          return 0;
        }
        needsAnotherFrame = true;
        return holdUntil;
      });
      peakStatesRef.current = next;
      clipHoldUntilRef.current = nextClipHolds;
      if (peakChanged) setPeakIndices(next.map((peak) => peak.index));
      if (clipHoldChanged) {
        setHeldClippedBands(
          nextClipHolds.map(
            (holdUntil, index) => !currentClippedBandsRef.current[index] && holdUntil > frameTimestamp
          )
        );
      }
      if (needsAnotherFrame) {
        animationFrameRef.current = requestAnimationFrame(animatePeaks);
      } else {
        animationFrameRef.current = null;
      }
    };
    animationFrameRef.current = requestAnimationFrame(animatePeaks);
  }, [activeCellKey, cellCount, clippedBandKey, reducedMotion]);
  (0, import_react50.useEffect)(
    () => () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    },
    []
  );
  const defaultLabel = getDefaultLabel(mode, levels.length);
  const valueSummary = getValueSummary(mode, levels);
  const currentClippedBandNames = clippedBands.flatMap(
    (isClipped, index) => isClipped ? [getBandName(mode, index)] : []
  );
  const heldClippedBandNames = heldClippedBands.flatMap(
    (isHeld, index) => isHeld && !clippedBands[index] ? [getBandName(mode, index)] : []
  );
  const clippingSummary = [
    currentClippedBandNames.length > 0 ? `Clipping: ${currentClippedBandNames.join(", ")}` : void 0,
    heldClippedBandNames.length > 0 ? `Clipping held: ${heldClippedBandNames.join(", ")}` : void 0
  ].filter(Boolean).join(". ");
  const hasClipping = displayedClippedBands.some(Boolean);
  const accessibleSummary = [props.label, defaultLabel, valueSummary, clippingSummary].filter(Boolean).join(". ");
  const rootClassName = ["dialkit-root", "dialkit-audio-meter", props.className].filter(Boolean).join(" ");
  const rootStyle = {
    ...props.style,
    "--dial-meter-band-count": levels.length,
    "--dial-meter-cell-count": cellCount
  };
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
    "div",
    {
      className: rootClassName,
      style: rootStyle,
      "data-mode": mode,
      "data-clipping": hasClipping || void 0,
      role: "img",
      "aria-label": accessibleSummary,
      children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: "dialkit-audio-meter__bands", "aria-hidden": "true", children: activeCellCounts.map((activeCellCount, bandIndex) => /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: "dialkit-audio-meter__band", children: Array.from({ length: cellCount }, (_, visualIndex) => {
        const indexFromBottom = cellCount - visualIndex - 1;
        const isActive = indexFromBottom < activeCellCount;
        const isPeak = indexFromBottom === displayedPeakIndices[bandIndex];
        const isClipped = displayedClippedBands[bandIndex] && indexFromBottom === cellCount - 1;
        const color = getCellColor(colors, indexFromBottom, cellCount);
        const cellStyle = color ? { "--dial-meter-cell-color": color } : void 0;
        return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
          "span",
          {
            className: "dialkit-audio-meter__cell",
            "data-active": isActive || void 0,
            "data-peak": isPeak || void 0,
            "data-clipped": isClipped || void 0,
            style: cellStyle
          },
          visualIndex
        );
      }) }, bandIndex)) })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnalyserVisualization,
  AudioLevelMeter,
  ButtonGroup,
  COLOR_FORMATS,
  CURVE_CYCLE,
  CURVE_DEFAULT_HEIGHT,
  CURVE_FIT_PADDING,
  CURVE_MAX_HEIGHT,
  CURVE_MIN_HEIGHT,
  CURVE_SAMPLE_COUNT,
  Checkbox,
  ChipsControl,
  ColorControl,
  ColorPickerPanel,
  ControlRenderer,
  ControlShell,
  CurveComposer,
  CurvePreview,
  DEFAULT_GRADIENT,
  DEFAULT_TRIGGER_STEPS,
  DialRoot,
  DialStore,
  DialTimeline,
  EasingVisualization,
  FileControl,
  Folder,
  GalleryControl,
  GradientControl,
  GradientPanel,
  ListControl,
  MIN_STOPS,
  Module,
  MultiSelectControl,
  NumberControl,
  PresetManager,
  RangeSlider,
  SegmentedControl,
  SelectControl,
  ShortcutsMenu,
  Slider,
  SpringControl,
  SpringVisualization,
  SwatchControl,
  TAB_PATH,
  TextControl,
  TimelineStore,
  Toggle,
  TransitionControl,
  WaveformVisualization,
  XYControl,
  XYPad,
  XY_DEFAULT_STEP,
  XY_DETENT_PX,
  addDriver,
  addStop,
  applyDetentAxis,
  buildSamplers,
  centerValue,
  clamp,
  clampCurveHeight,
  clampOklchToSrgb,
  clampRange,
  colorAtPosition,
  curvePathData,
  curveY,
  cycleDriverType,
  cycleSegmentType,
  defaultComposition,
  defaultListItemParams,
  displayHex,
  flipDriver,
  flipDriverX,
  flipDriverY,
  flipSegment,
  flipSegmentX,
  flipSegmentY,
  formatClock,
  formatHex,
  gradientFillBox,
  gradientToCss,
  gradientToTransform,
  groupListFields,
  handleLeftStyles,
  hintDomId,
  hslToRgb,
  hsvToRgb,
  invertY,
  isOutsideSpan,
  moveStop,
  nearestHandle,
  normToValue,
  normalizeCurveMarkers,
  normalizeGradient,
  normalizeHex,
  normalizeListItems,
  normalizeValue,
  nudge,
  oklchToRgb,
  opacityPercent,
  orderRange,
  parseHex,
  parseListItemSchema,
  percentToValue,
  pickDragTarget,
  plotCurve,
  pointFromValue,
  readComposition,
  redistributeWeight,
  removeDriver,
  removeSegment,
  removeStop,
  resolveAxis,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  setDriverAnticipate,
  setDriverCurvature,
  setDriverOvershoot,
  setDriverSteepness,
  setGradientAngle,
  setGradientCenter,
  setGradientRotation,
  setGradientScale,
  setGradientSquash,
  setGradientType,
  setHigh,
  setLow,
  setSegmentAnticipate,
  setSegmentCurvature,
  setSegmentOvershoot,
  setSegmentSteepness,
  setStopColor,
  shiftSpan,
  snapToStep,
  splitSegment,
  triggerLevels,
  triggersCrossed,
  useDialKit,
  useDialTimeline,
  valueFromPoint,
  valueToNorm,
  valueToPercent
});
//# sourceMappingURL=index.cjs.map