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
  ADSR_DEF: () => ADSR_DEF,
  ADSR_STAGE_MAX: () => ADSR_STAGE_MAX,
  AnalyserRow: () => AnalyserRow,
  AnalyserVisualization: () => AnalyserVisualization,
  AudioLevelMeter: () => AudioLevelMeter,
  ButtonGroup: () => ButtonGroup,
  COLOR_FORMATS: () => COLOR_FORMATS,
  CURVE_CYCLE: () => CURVE_CYCLE,
  CURVE_DEF: () => CURVE_DEF,
  CURVE_DEFAULT_HEIGHT: () => CURVE_DEFAULT_HEIGHT,
  CURVE_FIT_PADDING: () => CURVE_FIT_PADDING,
  CURVE_LABELS: () => CURVE_LABELS,
  CURVE_MAX_CLIPS: () => CURVE_MAX_CLIPS,
  CURVE_MAX_DURATION: () => CURVE_MAX_DURATION,
  CURVE_MAX_HEIGHT: () => CURVE_MAX_HEIGHT,
  CURVE_MIN_DURATION: () => CURVE_MIN_DURATION,
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
  ENV_BEND_STAGES: () => ENV_BEND_STAGES,
  EasingVisualization: () => EasingVisualization,
  FILTER_DB_CEIL: () => FILTER_DB_CEIL,
  FILTER_DB_FLOOR: () => FILTER_DB_FLOOR,
  FileControl: () => FileControl,
  FilterControl: () => FilterControl,
  Folder: () => Folder,
  GalleryControl: () => GalleryControl,
  GradientControl: () => GradientControl,
  GradientPanel: () => GradientPanel,
  ICON_MOVE_CAPTURE: () => ICON_MOVE_CAPTURE,
  ICON_MOVE_ENTER: () => ICON_MOVE_ENTER,
  LFO_DEF: () => LFO_DEF,
  LFO_SYNC_DIVISIONS: () => LFO_SYNC_DIVISIONS,
  ListControl: () => ListControl,
  ListScreen: () => ListScreen,
  MIN_STOPS: () => MIN_STOPS,
  MOD_COLORS: () => MOD_COLORS,
  MOD_PAGE_DIALS: () => MOD_PAGE_DIALS,
  MOD_RING_CIRCUMFERENCE: () => MOD_RING_CIRCUMFERENCE,
  MOD_RING_RADIUS: () => MOD_RING_RADIUS,
  MOD_SETTINGS_PANEL: () => MOD_SETTINGS_PANEL,
  MOD_SLOTS: () => MOD_SLOTS,
  MOD_TOUCH_GRACE_MS: () => MOD_TOUCH_GRACE_MS,
  MOVE_DIALS: () => MOVE_DIALS,
  MOVE_FUNCTION_BUTTONS: () => MOVE_FUNCTION_BUTTONS,
  MOVE_FUNCTION_MANIFEST: () => MOVE_FUNCTION_MANIFEST,
  MOVE_PADS: () => MOVE_PADS,
  MOVE_SLOT_LIBRARY: () => MOVE_SLOT_LIBRARY,
  MOVE_SPECIAL_BUTTONS: () => MOVE_SPECIAL_BUTTONS,
  MOVE_TRACKS: () => MOVE_TRACKS,
  MOVE_WAVEFORM_STEPS: () => MOVE_WAVEFORM_STEPS,
  ModulationStore: () => ModulationStore,
  Module: () => Module,
  MoveActionButton: () => MoveActionButton,
  MoveFunctions: () => MoveFunctions,
  MovePanel: () => MovePanel,
  MoveSlotDefaultBody: () => MoveSlotDefaultBody,
  MoveSlotEnumBody: () => MoveSlotEnumBody,
  MoveSlotEnvBody: () => MoveSlotEnvBody,
  MoveSlotFilterBody: () => MoveSlotFilterBody,
  MoveSlotGlyph: () => MoveSlotGlyph,
  MoveSlotRangeBody: () => MoveSlotRangeBody,
  MoveSlotReadout: () => MoveSlotReadout,
  MoveSlotScopeBody: () => MoveSlotScopeBody,
  MoveSlotShape: () => MoveSlotShape,
  MoveSurfaceStore: () => MoveSurfaceStore,
  MoveVolumeDisplay: () => MoveVolumeDisplay,
  MoveWaveform: () => MoveWaveform,
  MoveWaveformStore: () => MoveWaveformStore,
  MultiSelectControl: () => MultiSelectControl,
  NumberControl: () => NumberControl,
  PresetManager: () => PresetManager,
  RangeSlider: () => RangeSlider,
  SH_DEF: () => SH_DEF,
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
  TweakRoot: () => TweakRoot,
  TweakStore: () => TweakStore,
  TweakTimeline: () => TweakTimeline,
  WaveformVisualization: () => WaveformVisualization,
  XYControl: () => XYControl,
  XYPad: () => XYPad,
  XY_DEFAULT_STEP: () => XY_DEFAULT_STEP,
  XY_DETENT_PX: () => XY_DETENT_PX,
  addDriver: () => addDriver,
  addStop: () => addStop,
  applyDetentAxis: () => applyDetentAxis,
  applyModulation: () => applyModulation,
  buildModMovePage: () => buildModMovePage,
  buildMovePages: () => buildMovePages,
  buildSamplers: () => buildSamplers,
  centerValue: () => centerValue,
  clamp: () => clamp3,
  clampCurveHeight: () => clampCurveHeight,
  clampOklchToSrgb: () => clampOklchToSrgb,
  clampRange: () => clampRange,
  colorAtPosition: () => colorAtPosition,
  curveComposition: () => curveComposition,
  curveDuration: () => curveDuration,
  curvePathData: () => curvePathData,
  curveY: () => curveY,
  cycleDriverType: () => cycleDriverType,
  cycleSegmentType: () => cycleSegmentType,
  defaultComposition: () => defaultComposition,
  defaultFilterResponse: () => defaultFilterResponse,
  defaultListItemParams: () => defaultListItemParams,
  denormalizeEnumDial: () => denormalizeEnumDial,
  denormalizeFilterDial: () => denormalizeFilterDial,
  denormalizeRangeDial: () => denormalizeRangeDial,
  dialOrigin: () => dialOrigin,
  dialSpan: () => dialSpan,
  displayHex: () => displayHex,
  enumOptionIcon: () => enumOptionIcon,
  envCurveParam: () => envCurveParam,
  envelopeJoints: () => envelopeJoints,
  envelopePoints: () => envelopePoints,
  filterHand01: () => filterHand01,
  filterHandValue: () => filterHandValue,
  filterResponsePath: () => filterResponsePath,
  filterShapePath: () => filterShapePath,
  filterShapeResponse: () => filterShapeResponse,
  flipDriver: () => flipDriver,
  flipDriverX: () => flipDriverX,
  flipDriverY: () => flipDriverY,
  flipSegment: () => flipSegment,
  flipSegmentX: () => flipSegmentX,
  flipSegmentY: () => flipSegmentY,
  formatClock: () => formatClock,
  formatHex: () => formatHex,
  getModType: () => getModType,
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
  isSpanContinuation: () => isSpanContinuation,
  lfoSyncedHz: () => lfoSyncedHz,
  listModTypes: () => listModTypes,
  loopFromStep: () => loopFromStep,
  loopSteps: () => loopSteps,
  modColor: () => modColor,
  modKey: () => modKey,
  modPageLayout: () => modPageLayout,
  modPageWidth: () => modPageWidth,
  modRingArc: () => modRingArc,
  moveAppPadRow: () => moveAppPadRow,
  movePadRows: () => movePadRows,
  moveSlotKind: () => moveSlotKind,
  moveStop: () => moveStop,
  moveWaveformDefaultView: () => defaultView,
  nearestHandle: () => nearestHandle,
  normToValue: () => normToValue,
  normalizeCurveMarkers: () => normalizeCurveMarkers,
  normalizeDial: () => normalizeDial,
  normalizeEnumDial: () => normalizeEnumDial,
  normalizeFilterDial: () => normalizeFilterDial,
  normalizeFilterValue: () => normalizeFilterValue,
  normalizeGradient: () => normalizeGradient,
  normalizeHex: () => normalizeHex,
  normalizeListItems: () => normalizeListItems,
  normalizeRangeDial: () => normalizeRangeDial,
  normalizeValue: () => normalizeValue,
  normalizeXYDial: () => normalizeXYDial,
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
  registerModType: () => registerModType,
  removeDriver: () => removeDriver,
  removeSegment: () => removeSegment,
  removeStop: () => removeStop,
  resolveAxis: () => resolveAxis,
  resolveFilterAxis: () => resolveFilterAxis,
  rgbToHsl: () => rgbToHsl,
  rgbToHsv: () => rgbToHsv,
  rgbToOklch: () => rgbToOklch,
  scrubBy: () => scrubBy,
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
  springify: () => springify,
  stepPosition: () => stepPosition,
  triggerLevels: () => triggerLevels,
  triggersCrossed: () => triggersCrossed,
  useTweakTimeline: () => useTweakTimeline,
  useTweakers: () => useTweakers,
  valueFromPoint: () => valueFromPoint,
  valueToNorm: () => valueToNorm,
  valueToPercent: () => valueToPercent,
  visibleColumns: () => visibleColumns,
  visibleModControls: () => visibleModControls,
  zoomBy: () => zoomBy
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useTweakers.ts
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
var PALETTE_STORAGE_KEY = "tweakers:color-palette";
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
function valueFromPoint(point, xAxis, yAxis, snap2 = false) {
  let x = clamp2(normToValue(point.x, xAxis), xAxis.min, xAxis.max);
  let y = clamp2(normToValue(invertY(point.y), yAxis), yAxis.min, yAxis.max);
  if (snap2) {
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
function normalizeValue(value, xAxis, yAxis, snap2 = false) {
  const resolve = (raw, axis) => {
    let v = clamp2(coerceComponent(raw, axis), axis.min, axis.max);
    if (snap2) v = snapToStep(v, axis.step, axis.min);
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
  const ramp = `clamp(0px, calc(6px - ${gap}), 2px)`;
  return {
    low: `max(0px, min(calc(100% - 2px), calc(${lowPercent}% - 1px - ${ramp})))`,
    high: `min(calc(100% - 2px), max(0px, calc(${highPercent}% - 1px + ${ramp})))`
  };
}

// src/filter-core.ts
var FILTER_AXIS_DEFAULTS = {
  cutoff: { min: 0, max: 1, step: 0, label: "Freq" },
  resonance: { min: 0, max: 1, step: 0, label: "Res" }
};
function resolveFilterAxis(axis, hand) {
  const base = FILTER_AXIS_DEFAULTS[hand];
  return {
    min: axis?.min ?? base.min,
    max: axis?.max ?? base.max,
    step: axis?.step ?? base.step,
    label: axis?.label ?? base.label,
    formatValue: axis?.formatValue
  };
}
var clamp4 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
var snap = (v, axis) => {
  let out = clamp4(Number.isFinite(v) ? v : axis.min, axis.min, axis.max);
  if (axis.step > 0) out = clamp4(axis.min + Math.round((out - axis.min) / axis.step) * axis.step, axis.min, axis.max);
  return Number(out.toFixed(6));
};
function normalizeFilterValue(value, cutoffAxis, resonanceAxis) {
  const v = typeof value === "object" && value !== null ? value : {};
  return {
    cutoff: snap(typeof v.cutoff === "number" ? v.cutoff : cutoffAxis.max, cutoffAxis),
    resonance: snap(typeof v.resonance === "number" ? v.resonance : resonanceAxis.min, resonanceAxis)
  };
}
var filterHand01 = (v, axis) => {
  const n = (v - axis.min) / (axis.max - axis.min || 1);
  return clamp4(Number.isFinite(n) ? n : 0, 0, 1);
};
var filterHandValue = (v01, axis) => snap(axis.min + clamp4(v01, 0, 1) * (axis.max - axis.min), axis);
function filterShapeResponse(type, cutoff01, resonance01) {
  const fc = Math.pow(10, -3 + 3 * clamp4(cutoff01, 0, 1));
  const q = 0.707 * Math.pow(14, clamp4(resonance01, 0, 1));
  const a = Math.pow(10, clamp4(resonance01, 0, 1) * 18 / 40);
  return (t) => {
    const f = Math.pow(10, -3 + 3 * clamp4(t, 0, 1));
    const w = f / fc;
    const w2 = w * w;
    const den = Math.sqrt(Math.pow(1 - w2, 2) + Math.pow(w / q, 2));
    let mag;
    switch (type) {
      case "highpass":
        mag = w2 / den;
        break;
      case "bandpass":
        mag = w / q / den;
        break;
      case "notch":
        mag = Math.abs(1 - w2) / den;
        break;
      case "peak":
        mag = Math.sqrt(Math.pow(1 - w2, 2) + Math.pow(w * a / q, 2)) / Math.sqrt(Math.pow(1 - w2, 2) + Math.pow(w / (a * q), 2));
        break;
      default:
        mag = 1 / den;
    }
    return Math.min((20 * Math.log10(Math.max(mag, 1e-6)) + FILTER_DB_FLOOR) / (FILTER_DB_FLOOR + FILTER_DB_CEIL), 1);
  };
}
function defaultFilterResponse(cutoff01, resonance01) {
  return filterShapeResponse("lowpass", cutoff01, resonance01);
}
var FILTER_DB_FLOOR = 36;
var FILTER_DB_CEIL = 24;
var FILTER_SHAPE_SAMPLES = 96;
function filterResponsePath(response, samples = FILTER_SHAPE_SAMPLES) {
  const pts = [];
  for (let i = 0; i < samples; i++) {
    let y;
    try {
      y = response(i / (samples - 1));
    } catch {
      return null;
    }
    if (!Number.isFinite(y)) return null;
    pts.push(Math.min(1, Math.max(-1, y)));
  }
  return pts.map((y, i) => `${i ? "L" : "M"} ${(i / (samples - 1) * 100).toFixed(2)} ${((1 - y) * 100).toFixed(2)}`).join(" ");
}

// src/store/persist.ts
var STORAGE_VERSION = "v1";
function resolvePersistTarget(kind, id, persist) {
  if (!persist) return null;
  const config = persist === true ? {} : persist;
  const base = config.key ?? id;
  if (!base) return null;
  return {
    key: `tweakers:${STORAGE_VERSION}:${kind}:${base}`,
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

// src/store/TweakStore.ts
var TAB_PATH = "_tab";
var EMPTY_VALUES = Object.freeze({});
function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
}
function hintDomId(scope, path) {
  return `tweakers-hint-${scope}-${path}`.replace(/\s+/g, "-");
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
function resolveTweakValues(config, flatValues) {
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
    } else if (resolveValueHasType(configValue, "curve") || resolveValueHasType(configValue, "analyser")) {
    } else if (typeof configValue === "object" && configValue !== null) {
      result[key] = resolveConfigValues(configValue, flatValues, path);
    }
  }
  return result;
}
var TweakStoreClass = class {
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
    /** Panels whose header carries no preset toolbar (see setPresetsHidden). */
    this.presetsHidden = /* @__PURE__ */ new Set();
    this.baseValues = /* @__PURE__ */ new Map();
    // Resolved storage target per panel (null = persistence off). Absent = not
    // yet registered.
    this.persistTargets = /* @__PURE__ */ new Map();
  }
  registerPanel(id, name, config, shortcuts, options = {}) {
    const existingPanel = this.panels.get(id);
    if (existingPanel && existingPanel.kind !== options.kind) {
      console.warn(
        `[tweakers] Panel id "${id}" cannot be shared by a timeline and a standard panel; the most recent registration controls where it renders.`
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
    this.panels.set(id, { id, name, controls, values, shortcuts: shortcuts ?? {}, hints: options.hints, affordances: options.affordances, labels: options.labels, movePads: options.movePads, module: "_enabled" in config ? true : void 0, kind: options.kind });
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
    const movePads = options.movePads ?? existing.movePads;
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
    const nextPanel = { id, name, controls, values: nextValues, shortcuts: shortcuts ?? existing.shortcuts, hints, affordances, labels, movePads, module: "_enabled" in config ? true : void 0, kind: options.kind ?? existing.kind };
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
    this.presetsHidden.delete(id);
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
    if (kind === "panel") return all.filter((panel) => panel.kind === void 0);
    if (kind === "timeline") return all.filter((panel) => panel.kind === "timeline");
    return all;
  }
  /**
   * The settings panels a root should draw, given its optional `panels` filter.
   * `undefined` means every panel — the single-surface default. A list means
   * exactly those names, in the order named, so two roots never fight over the
   * same panel and a panel that has not registered yet leaves a gap that fills
   * when it does.
   */
  selectPanels(only) {
    const registered = this.getPanels("panel");
    if (only === void 0) return registered;
    const names = typeof only === "string" ? [only] : only;
    return names.map((name) => registered.find((panel) => panel.name === name)).filter((panel) => panel !== void 0);
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
      const listeners3 = this.listeners.get(panelId);
      listeners3?.delete(listener);
      if (listeners3?.size === 0 && !this.panels.has(panelId)) {
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
      const listeners3 = this.actionListeners.get(panelId);
      listeners3?.delete(listener);
      if (listeners3?.size === 0 && !this.panels.has(panelId)) {
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
      const listeners3 = this.eventListeners.get(panelId);
      listeners3?.delete(listener);
      if (listeners3?.size === 0 && !this.panels.has(panelId)) {
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
      const listeners3 = this.controlStateListeners.get(panelId);
      listeners3?.delete(listener);
      if (listeners3?.size === 0 && !this.panels.has(panelId)) {
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
        } else if (this.isAnalyserConfig(value)) {
          const control = this.findControlByPath(panel.controls, path);
          if (control?.type === "analyser" && control.analyserRow !== void 0) {
            const prev = control.analyserRow;
            const sameRange = prev.rangeHz === value.rangeHz || !!prev.rangeHz && !!value.rangeHz && prev.rangeHz[0] === value.rangeHz[0] && prev.rangeHz[1] === value.rangeHz[1];
            const sameScalars = prev.source === value.source && prev.variant === value.variant && prev.mode === value.mode && prev.pixelSize === value.pixelSize && prev.scale === value.scale && prev.height === value.height && sameRange;
            if (prev.analyser !== value.analyser || prev.marker !== value.marker || !sameScalars) {
              control.analyserRow = value;
              changed = true;
            }
          }
        } else if (this.isFilterConfig(value) && value.response) {
          const control = this.findControlByPath(panel.controls, path);
          if (control?.type === "filter" && control.response !== value.response) {
            control.response = value.response;
            changed = true;
          }
        } else if (this.isSelectConfig(value) && value.preview) {
          const control = this.findControlByPath(panel.controls, path);
          if (control?.type === "select" && control.preview !== value.preview) {
            control.preview = value.preview;
            changed = true;
          }
        } else if (typeof value === "object" && value !== null && !Array.isArray(value) && !this.isSpringConfig(value) && !this.isEasingConfig(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isNumberConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isFilterConfig(value) && !this.isGalleryConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value) && !this.isFileConfig(value)) {
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
  /**
   * Hide (or restore) a panel's preset toolbar. For the secondary panels of a
   * multi-panel app — a rack of per-voice columns, say — where a snapshot
   * means the whole instrument and so belongs to one panel only. Hiding the
   * toolbar hides its add and copy buttons with it: the header of a panel that
   * does not own presets is bare.
   */
  setPresetsHidden(panelId, hidden) {
    const had = this.presetsHidden.has(panelId);
    if (hidden === had) return;
    if (hidden) this.presetsHidden.add(panelId);
    else this.presetsHidden.delete(panelId);
    this.notify(panelId);
  }
  arePresetsHidden(panelId) {
    return this.presetsHidden.has(panelId);
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
      } else if (typeof value === "object" && value !== null && !Array.isArray(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isNumberConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isFilterConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value) && !this.isCurveConfig(value)) {
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
        controls.push({ type: "select", path, label, options: value.options, display: value.display, preview: value.preview });
      } else if (this.isColorConfig(value)) {
        controls.push({ type: "color", path, label, alpha: value.alpha, palette: value.palette });
      } else if (this.isGradientConfig(value)) {
        controls.push({ type: "gradient", path, label });
      } else if (this.isXYConfig(value)) {
        controls.push({ type: "xy", path, label, xAxis: value.x, yAxis: value.y, grid: value.grid, density: value.density, snap: value.snap, returnToCenter: value.returnToCenter, showValues: value.showValues });
      } else if (this.isFilterConfig(value)) {
        controls.push({ type: "filter", path, label, cutoffAxis: value.cutoff, resonanceAxis: value.resonance, response: value.response, filterEnabled: value.enabled });
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
          height: value.height,
          aspect: value.aspect
        });
      } else if (this.isAnalyserConfig(value)) {
        controls.push({
          type: "analyser",
          path,
          label: typeof value.label === "string" ? value.label : label,
          hideLabel: value.label === false || void 0,
          height: value.height,
          analyserRow: value
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
      } else if (this.isFilterConfig(value)) {
        values[path] = normalizeFilterValue(
          value.default,
          resolveFilterAxis(value.cutoff, "cutoff"),
          resolveFilterAxis(value.resonance, "resonance")
        );
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
  isFilterConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "filter";
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
  isAnalyserConfig(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "analyser" && typeof value.analyser === "function";
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
      case "filter": {
        if (typeof existingValue !== "object" || existingValue === null || Array.isArray(existingValue)) {
          return defaultValue;
        }
        const candidate = existingValue;
        if (typeof candidate.cutoff !== "number" || typeof candidate.resonance !== "number") {
          return defaultValue;
        }
        return normalizeFilterValue(
          candidate,
          resolveFilterAxis(control.cutoffAxis, "cutoff"),
          resolveFilterAxis(control.resonanceAxis, "resonance")
        );
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
  const flat2 = [];
  const groups = [];
  const byLabel = /* @__PURE__ */ new Map();
  for (const field of fields) {
    if (!field.group) {
      flat2.push(field);
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
  return { flat: flat2, groups };
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
var TweakStore = new TweakStoreClass();

// src/hooks/useTweakStorePanel.ts
var import_react = require("react");
function useSerialized(value) {
  const ref = (0, import_react.useRef)();
  if (!ref.current || !Object.is(ref.current.value, value)) {
    ref.current = { value, text: JSON.stringify(value) };
  }
  return ref.current.text;
}
function useTweakStorePanel(name, config, options = {}) {
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
  const serializedMovePads = useSerialized(options.movePads);
  (0, import_react.useEffect)(() => {
    TweakStore.registerPanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      movePads: optionsRef.current.movePads,
      kind: optionsRef.current.kind
    });
    return () => TweakStore.unregisterPanel(panelId);
  }, [hasStableId, panelId, name]);
  const mountedRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    TweakStore.updatePanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      movePads: optionsRef.current.movePads,
      kind: optionsRef.current.kind
    });
  }, [hasStableId, panelId, name, serializedConfig, serializedShortcuts, serializedPersist, serializedHints, serializedLabels, serializedMovePads]);
  (0, import_react.useEffect)(() => {
    const presets = optionsRef.current.presets;
    TweakStore.setPresetsHidden(panelId, presets === false);
    TweakStore.setPresetProvider(panelId, presets === false ? null : presets ?? null);
  });
  (0, import_react.useEffect)(() => {
    TweakStore.syncCurveConfigs(panelId, configRef.current);
  });
  const subscribe = (0, import_react.useCallback)(
    (callback) => TweakStore.subscribe(panelId, callback),
    [panelId]
  );
  const getSnapshot = (0, import_react.useCallback)(() => TweakStore.getValues(panelId), [panelId]);
  const flatValues = (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
  return { panelId, flatValues, serializedConfig };
}

// src/hooks/useTweakers.ts
function useTweakers(name, config, options) {
  const onActionRef = (0, import_react2.useRef)(options?.onAction);
  onActionRef.current = options?.onAction;
  const onEventRef = (0, import_react2.useRef)(options?.onEvent);
  onEventRef.current = options?.onEvent;
  const { panelId, flatValues } = useTweakStorePanel(name, config, {
    shortcuts: options?.shortcuts,
    hints: options?.hints,
    affordances: options?.affordances,
    labels: options?.labels,
    movePads: options?.movePads,
    presets: options?.presets
  });
  (0, import_react2.useEffect)(() => {
    return TweakStore.subscribeActions(panelId, (action) => {
      onActionRef.current?.(action);
    });
  }, [panelId]);
  (0, import_react2.useEffect)(() => {
    return TweakStore.subscribeEvents(panelId, (path, event) => {
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

// src/components/TweakRoot.tsx
var import_react42 = require("react");
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
        `[tweakers] Timeline id "${meta.id}" is already registered by "${existing.name}"; "${meta.name}" will share and overwrite that transport.`
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
      const listeners3 = this.listeners.get(id);
      listeners3?.delete(listener);
      if (listeners3?.size === 0 && !this.timelines.has(id)) {
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
var ICON_MOVE_CAPTURE = {
  viewBox: "0 0 14 14",
  path: "M1 0H5V2H2V5H0V0H1ZM2 10V12H5V14H0V9H2V10ZM10 0H14V5H12V2H9V0H10ZM14 10V14H9V12H12V9H14V10Z"
};
var ICON_MOVE_ENTER = {
  viewBox: "0 0 12 12",
  circle: { cx: "6", cy: "6", r: "6" }
};
var ICON_PANEL = {
  path: "M6.84766 11.75C6.78583 11.9899 6.75 12.2408 6.75 12.5C6.75 12.7592 6.78583 13.0101 6.84766 13.25H2C1.58579 13.25 1.25 12.9142 1.25 12.5C1.25 12.0858 1.58579 11.75 2 11.75H6.84766ZM14 11.75C14.4142 11.75 14.75 12.0858 14.75 12.5C14.75 12.9142 14.4142 13.25 14 13.25H12.6523C12.7142 13.0101 12.75 12.7592 12.75 12.5C12.75 12.2408 12.7142 11.9899 12.6523 11.75H14ZM3.09766 7.25C3.03583 7.48994 3 7.74075 3 8C3 8.25925 3.03583 8.51006 3.09766 8.75H2C1.58579 8.75 1.25 8.41421 1.25 8C1.25 7.58579 1.58579 7.25 2 7.25H3.09766ZM14 7.25C14.4142 7.25 14.75 7.58579 14.75 8C14.75 8.41421 14.4142 8.75 14 8.75H8.90234C8.96417 8.51006 9 8.25925 9 8C9 7.74075 8.96417 7.48994 8.90234 7.25H14ZM7.59766 2.75C7.53583 2.98994 7.5 3.24075 7.5 3.5C7.5 3.75925 7.53583 4.01006 7.59766 4.25H2C1.58579 4.25 1.25 3.91421 1.25 3.5C1.25 3.08579 1.58579 2.75 2 2.75H7.59766ZM14 2.75C14.4142 2.75 14.75 3.08579 14.75 3.5C14.75 3.91421 14.4142 4.25 14 4.25H13.4023C13.4642 4.01006 13.5 3.75925 13.5 3.5C13.5 3.24075 13.4642 2.98994 13.4023 2.75H14Z",
  circles: [
    { cx: "6", cy: "8", r: "0.998596" },
    { cx: "10.4999", cy: "3.5", r: "0.998657" },
    { cx: "9.75015", cy: "12.5", r: "0.997986" }
  ]
};
var LUCIDE_ICONS = {
  /* directions and traversal */
  "arrow-right": ["M5 12h14", "m12 5 7 7-7 7"],
  "arrow-left": ["M19 12H5", "m12 19-7-7 7-7"],
  "arrow-left-right": ["M8 3 4 7l4 4", "M4 7h16", "m16 21 4-4-4-4", "M20 17H4"],
  "fold-horizontal": [
    "M2 12h6",
    "M22 12h-6",
    "M12 2v2",
    "M12 8v2",
    "M12 14v2",
    "M12 20v2",
    "m19 9-3 3 3 3",
    "m5 15 3-3-3-3"
  ],
  scissors: [
    "M20 4 8.12 15.88",
    "M14.47 14.48 20 20",
    "M8.12 8.12 12 12",
    "M6 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6",
    "M6 15a3 3 0 1 0 0 6 3 3 0 1 0 0-6"
  ],
  /* signal character */
  "grid-2x2": ["M12 3v18", "M3 12h18", "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  waves: [
    "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
    "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
    "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
  ],
  "audio-lines": ["M2 10v3", "M6 6v11", "M10 3v18", "M14 8v7", "M18 5v13", "M22 10v3"]
};

// src/components/Checkbox.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Checkbox({ checked, onChange, label, disabled = false, id }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      type: "button",
      id,
      role: "checkbox",
      "aria-checked": disabled ? "mixed" : checked,
      "aria-label": label,
      "aria-disabled": disabled || void 0,
      className: "tweakers-checkbox",
      "data-checked": checked && !disabled ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      onClick: (e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { viewBox: "0 0 22 22", width: "22", height: "22", "aria-hidden": "true", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { className: "tweakers-checkbox-slash", d: "M6 16 16 6", fill: "none" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { className: "tweakers-checkbox-chip", x: "5", y: "5", width: "12", height: "12", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { className: "tweakers-checkbox-dash", d: "M6 11h10", fill: "none" })
      ] })
    }
  );
}

// src/components/Folder.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Folder({ title, children, defaultOpen = true, collapsible = true, isRoot = false, inline = false, onOpenChange, toolbar, tabs, hint, hintId, enabled, onEnabledChange }) {
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
  const isModule = isRoot && enabled !== void 0 && onEnabledChange !== void 0;
  const bodyOpen = isOpen && (!isModule || enabled);
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
  const folderContent = /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { ref: isRoot ? contentRef : void 0, className: `tweakers-folder ${isRoot ? "tweakers-folder-root" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        className: `tweakers-folder-header ${isRoot ? "tweakers-panel-header" : ""} ${collapsible ? "" : "tweakers-folder-header-static"}`,
        onClick: collapsible ? handleToggle : void 0,
        "data-hint": hint ? "true" : void 0,
        "aria-describedby": hint ? hintId : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "tweakers-folder-header-top", children: [
            isRoot ? isOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "tweakers-folder-title-row", children: [
              isModule && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                Checkbox,
                {
                  checked: enabled,
                  onChange: onEnabledChange,
                  label: title
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "tweakers-folder-title tweakers-folder-title-root", children: title })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-folder-title-row", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "tweakers-folder-title", children: title }) }),
            !isRoot && toolbar && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-folder-toolbar", onClick: (e) => e.stopPropagation(), children: toolbar }),
            isRoot && !inline && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "svg",
              {
                className: "tweakers-panel-icon",
                viewBox: "0 0 16 16",
                fill: "none",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { opacity: "0.5", d: ICON_PANEL.path, fill: "currentColor" }),
                  ICON_PANEL.circles.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: c.cx, cy: c.cy, r: c.r, fill: "currentColor", stroke: "currentColor", strokeWidth: "1.25" }, i))
                ]
              }
            ),
            !isRoot && collapsible && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              import_react4.motion.svg,
              {
                className: "tweakers-folder-icon",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                initial: false,
                animate: { rotate: isOpen ? 0 : 180 },
                transition: { type: "spring", visualDuration: 0.35, bounce: 0.15 },
                children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: ICON_CHEVRON })
              }
            )
          ] }),
          isRoot && toolbar && isOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-panel-toolbar", onClick: (e) => e.stopPropagation(), children: toolbar }),
          isRoot && tabs && isOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-panel-tabs", onClick: (e) => e.stopPropagation(), children: tabs }),
          hint && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "tweakers-hint", id: hintId, role: "tooltip", children: hint })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react4.AnimatePresence, { initial: false, children: bodyOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react4.motion.div,
      {
        className: "tweakers-folder-content",
        initial: isRoot ? void 0 : { height: 0, opacity: 0 },
        animate: isRoot ? void 0 : { height: "auto", opacity: 1 },
        exit: isRoot ? void 0 : { height: 0, opacity: 0 },
        transition: isRoot ? void 0 : { type: "spring", visualDuration: 0.35, bounce: 0.1 },
        style: isRoot ? void 0 : { clipPath: "inset(0 -20px)" },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-folder-inner", children })
      }
    ) })
  ] });
  if (isRoot) {
    if (inline) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-panel-inner tweakers-panel-inline", children: folderContent });
    }
    const panelStyle = isOpen ? { width: 280, height: contentHeight !== void 0 ? Math.min(contentHeight + 10, windowHeight - 32) : "auto", borderRadius: 14, boxShadow: "var(--tweak-shadow)", cursor: void 0, overflowY: "auto" } : { width: 42, height: 42, borderRadius: "50%", boxSizing: "border-box", boxShadow: "var(--tweak-shadow-collapsed)", overflow: "hidden", cursor: "pointer" };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react4.motion.div,
      {
        className: "tweakers-panel-inner",
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
var import_react38 = require("react");
var import_react39 = require("motion/react");

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
  if (hookName === "useTweakTimeline" || hookName === "createTweakTimeline") {
    return `Update the ${hookName} configuration for "${panelName}" with these values:

\`\`\`json
${jsonStr}
\`\`\`

Apply these values as the new defaults in the ${hookName} call. Keep the existing \`clip.current\` bindings while this timeline is being authored; do not convert the animation or remove Tweakers yet.

Add this comment immediately above the ${hookName} call as a production handoff note:

\`\`\`tsx
// TODO(production): Tweakers's clip.current values are the scrubbable authoring preview.
// Replace them with equivalent real Motion animations using the tuned timeline
// timings and transitions, then remove ${hookName} and <TweakTimeline />.
\`\`\``;
  }
  return `Update the ${hookName} configuration for "${panelName}" with these values:

\`\`\`json
${jsonStr}
\`\`\`

Apply these values as the new defaults in the ${hookName} call.`;
}

// src/components/ControlRenderer.tsx
var import_react35 = require("react");

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
  const currentValue = TweakStore.getValue(panelId, path);
  const min = control.min ?? 0;
  const max = control.max ?? 1;
  const newValue = Math.max(min, Math.min(max, currentValue + direction * effectiveStep2));
  TweakStore.updateValue(panelId, path, roundValue(newValue, effectiveStep2));
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
function fineDragValue(opts) {
  const { startValue, startPos, pos, extentPx, min, max, factor = 0.1 } = opts;
  const delta = (pos - startPos) / (extentPx || 1) * (max - min) * factor;
  return Math.max(min, Math.min(max, startValue + delta));
}
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
var import_jsx_runtime3 = require("react/jsx-runtime");
var ShortcutContext = (0, import_react5.createContext)({ activePanelId: null, activePath: null });
function ShortcutListener({ children }) {
  const [activeShortcut, setActiveShortcut] = (0, import_react5.useState)({ activePanelId: null, activePath: null });
  const activeKeysRef = (0, import_react5.useRef)(/* @__PURE__ */ new Set());
  const isDraggingRef = (0, import_react5.useRef)(false);
  const lastMouseXRef = (0, import_react5.useRef)(null);
  const dragAccumulatorRef = (0, import_react5.useRef)(0);
  const resolveActiveTarget = (0, import_react5.useCallback)((interaction) => {
    for (const key of activeKeysRef.current) {
      const panels = TweakStore.getPanels();
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
      const target = TweakStore.resolveShortcutTarget(key, modifier);
      if (target) {
        setActiveShortcut({ activePanelId: target.panelId, activePath: target.path });
        if (!wasAlreadyHeld && target.control.type === "toggle") {
          const currentValue = TweakStore.getValue(target.panelId, target.path);
          TweakStore.updateValue(target.panelId, target.path, !currentValue);
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
          const target = TweakStore.resolveShortcutTarget(remainingKey, modifier);
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
          const target = TweakStore.resolveShortcutTarget(key, modifier);
          if (!target) continue;
          const { panelId, path, control } = target;
          const interaction = control.shortcut?.interaction ?? "scroll";
          if (interaction !== "scroll" || control.type !== "slider") continue;
          e.preventDefault();
          const effectiveStep2 = getEffectiveStep(control, control.shortcut);
          const direction = e.deltaY > 0 ? 1 : -1;
          applySliderDelta(panelId, path, control, effectiveStep2, direction);
          return;
        }
      }
      const scrollOnlyTargets = TweakStore.resolveScrollOnlyTargets();
      for (const { panelId, path, control, shortcut } of scrollOnlyTargets) {
        if (control.type !== "slider") continue;
        e.preventDefault();
        const effectiveStep2 = getEffectiveStep(control, shortcut);
        const direction = e.deltaY > 0 ? 1 : -1;
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ShortcutContext.Provider, { value: activeShortcut, children });
}

// src/components/ModuleFolder.tsx
var import_react6 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function ModuleFolder({ title, enabled, onEnabledChange, defaultOpen = true, hint, hintId, children }) {
  const [isOpen, setIsOpen] = (0, import_react6.useState)(defaultOpen);
  const headerOnly = children == null || Array.isArray(children) && children.length === 0;
  const handleEnabledChange = (next) => {
    onEnabledChange(next);
    if (next) setIsOpen(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "tweakers-module tweakers-module-folder", "data-open": !headerOnly && enabled && isOpen ? "true" : "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: `tweakers-module-header ${headerOnly ? "" : "tweakers-module-header-toggle"}`,
        onClick: () => {
          if (enabled && !headerOnly) setIsOpen((open) => !open);
        },
        "data-hint": hint ? "true" : void 0,
        "aria-describedby": hint ? hintId : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Checkbox, { checked: enabled, onChange: handleEnabledChange, label: title }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "tweakers-module-title", children: title }),
          hint && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "tweakers-hint", id: hintId, role: "tooltip", children: hint })
        ]
      }
    ),
    !headerOnly && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "tweakers-module-collapse", "data-open": enabled && isOpen, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "tweakers-module-collapse-clip", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "tweakers-module-inner", children }) }) })
  ] });
}

// src/components/ControlShell.tsx
var import_react7 = require("react");
var import_react_dom = require("react-dom");

// src/curve-composer-core.ts
var CURVE_CYCLE = ["linear", "easeIn", "easeOut", "easeInOut", "spring"];
var easingPresets = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1]
};
var DRAG_THRESHOLD = 3;
var EDGE_HIT = 6;
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
function bezierAxis(p1, p2, s) {
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
    const xs = bezierAxis(ease[0], ease[2], s) - tx;
    if (Math.abs(xs) < 1e-5) break;
    const d = bezierAxisDeriv(ease[0], ease[2], s);
    if (Math.abs(d) < 1e-6) break;
    s = clamp013(s - xs / d);
  }
  return bezierAxis(ease[1], ease[3], s);
}
var SPRING_SAMPLES = 72;
function sampleSpringTargets(sample, steps) {
  const targets = [];
  let target = sample(0);
  if (!Number.isFinite(target)) target = 0;
  targets.push(target);
  for (let i = 1; i <= steps; i++) {
    const nextTarget = sample(i / steps);
    if (Number.isFinite(nextTarget)) target = nextTarget;
    targets.push(target);
  }
  return targets;
}
function integrateSpringTrace(targets, stiffness, damping, mass, initial, collect = true) {
  const points = collect ? [initial.position] : [];
  const steps = Math.max(1, targets.length - 1);
  const dt = 1 / steps;
  let { position, velocity } = initial;
  for (let i = 1; i <= steps; i++) {
    const target = targets[i] ?? targets[targets.length - 1] ?? 0;
    const acceleration = (-stiffness * (position - target) - damping * velocity) / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
    if (collect) points.push(position);
  }
  return { points, state: { position, velocity } };
}
function springPoints(curvature, steepness = 0) {
  const visualDuration = 1;
  const bounce = clamp013((clampBipolar(curvature) + 1) / 2) * 0.6;
  const mass = 1;
  let stiffness = 2 * Math.PI / visualDuration;
  stiffness = stiffness * stiffness;
  stiffness *= Math.max(0.2, 1 + clampBipolar(steepness) * 0.9);
  const dampingRatio = 1 - bounce;
  const damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
  return integrateSpringTrace(new Array(SPRING_SAMPLES + 1).fill(1), stiffness, damping, mass, {
    position: 0,
    velocity: 0
  }).points;
}
function interp(points, t) {
  const x = clamp013(t) * (points.length - 1);
  const i = Math.floor(x);
  if (i >= points.length - 1) return points[points.length - 1];
  return lerp(points[i], points[i + 1], x - i);
}
var SPRINGIFY_DEFAULTS = { stiffness: 100, damping: 10, mass: 1 };
var SPRINGIFY_SAMPLES = 1200;
function finiteInRange(value, fallback, min, max) {
  return value !== void 0 && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
function periodicSpringState(targets, stiffness, damping, mass) {
  const advance = (initial) => integrateSpringTrace(targets, stiffness, damping, mass, initial, false).state;
  const offset = advance({ position: 0, velocity: 0 });
  const fromPosition = advance({ position: 1, velocity: 0 });
  const fromVelocity = advance({ position: 0, velocity: 1 });
  const a00 = fromPosition.position - offset.position;
  const a10 = fromPosition.velocity - offset.velocity;
  const a01 = fromVelocity.position - offset.position;
  const a11 = fromVelocity.velocity - offset.velocity;
  const m00 = 1 - a00;
  const m01 = -a01;
  const m10 = -a10;
  const m11 = 1 - a11;
  const determinant = m00 * m11 - m01 * m10;
  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-9) return null;
  return {
    position: (offset.position * m11 - m01 * offset.velocity) / determinant,
    velocity: (m00 * offset.velocity - offset.position * m10) / determinant
  };
}
function normalizeFollowerTrace(points) {
  let min = points[0] ?? 0;
  let max = min;
  for (const value of points) {
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  if (min >= 0 && max <= 1) return points;
  const range = max - min;
  if (range <= Number.EPSILON) return points.map(() => 0);
  return points.map((value) => (value - min) / range);
}
function springify(sample, options = {}) {
  const stiffness = finiteInRange(options.stiffness, SPRINGIFY_DEFAULTS.stiffness, 1, 1e3);
  const damping = finiteInRange(options.damping, SPRINGIFY_DEFAULTS.damping, 0, 100);
  const mass = finiteInRange(options.mass, SPRINGIFY_DEFAULTS.mass, 0.1, 10);
  const targets = sampleSpringTargets(sample, SPRINGIFY_SAMPLES);
  const atRest = { position: targets[0], velocity: 0 };
  const initial = options.loop ? periodicSpringState(targets, stiffness, damping, mass) ?? atRest : atRest;
  const raw = integrateSpringTrace(
    targets,
    stiffness,
    damping,
    mass,
    initial
  ).points;
  const points = options.normalize ? normalizeFollowerTrace(raw) : raw;
  return (t) => interp(points, t);
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

// src/modulation-core.ts
var MOD_SLOTS = 16;
var MOD_COLORS = [
  "#ff5f45",
  // 0  coral
  "#ff8a2b",
  // 1  orange
  "#ffb61e",
  // 2  amber
  "#f4d942",
  // 3  yellow
  "#b8e03c",
  // 4  lime
  "#6fd435",
  // 5  green
  "#3bcf6d",
  // 6  emerald
  "#2ed3ab",
  // 7  teal
  "#33c6e8",
  // 8  cyan
  "#3d9bff",
  // 9  azure
  "#5f7bff",
  // 10 blue
  "#8a6bff",
  // 11 violet
  "#b45cff",
  // 12 purple
  "#e04ef0",
  // 13 magenta
  "#ff4fb0",
  // 14 pink
  "#ff4f6e"
  // 15 rose
];
var modColor = (index) => MOD_COLORS[(index % MOD_SLOTS + MOD_SLOTS) % MOD_SLOTS];
var MOD_PAGE_DIALS = 8;
var isModDial = (c) => !c.chip && (c.scope || c.type === "select" || c.type === "slider" || c.type === "xy" || c.type === "range" || c.type === "number" && c.min != null && c.max != null);
var slotOf = (c) => ({
  path: c.path,
  ...c.drawsPreview ? { preview: true } : {},
  ...c.envStage ? { stage: c.envStage } : {},
  ...c.scope ? { scope: true } : {},
  ...c.cycle ? { cycle: true } : {}
});
function modPageLayout(controls, params = {}) {
  const dials = [];
  const toggles = [];
  const values = [];
  for (const c of controls) {
    if (c.when && !c.when(params)) continue;
    if (isModDial(c)) {
      if (dials.length < MOD_PAGE_DIALS) dials.push(slotOf(c));
      continue;
    }
    const col = Math.max(0, dials.length - 1);
    const row = c.type === "toggle" && !toggles[col] ? toggles : values;
    if (!row[col]) row[col] = slotOf(c);
  }
  const pad = (row) => Array.from({ length: row.length }, (_, i) => row[i] ?? null);
  return { dials, toggles: pad(toggles), values: pad(values) };
}
var visibleModControls = (def, params) => def.controls.filter((c) => !c.when || c.when(params));
var registry = /* @__PURE__ */ new Map();
function registerModType(def) {
  registry.set(def.type, def);
}
var getModType = (type) => registry.get(type);
var listModTypes = () => [...registry.values()];
var modPageWidth = () => Math.min(
  MOD_PAGE_DIALS,
  1 + listModTypes().reduce(
    (w, def) => Math.max(w, modPageLayout(def.controls, def.defaults).dials.length),
    0
  )
);
var MOD_SETTINGS_PANEL = "mod-settings";
var modKey = (panelId, path) => `${panelId}\0${path}`;
var clamp5 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
var clamp014 = (v) => clamp5(Number(v) || 0, 0, 1);
var clampSigned = (v) => clamp5(Number(v) || 0, -1, 1);
function applyModulation(base, signal, amount, min, max) {
  const offset = clamp5(signal, -1, 1) * clamp014(amount) * (max - min) / 2;
  return clamp5(base + offset, min, max);
}
var MOD_RING_RADIUS = 6;
var MOD_RING_CIRCUMFERENCE = 2 * Math.PI * MOD_RING_RADIUS;
var RING_SWEEP_START = 135 / 360;
var RING_SWEEP_LEN = 270 / 360;
function modRingArc(from01, to01) {
  const a = RING_SWEEP_START + clamp014(from01) * RING_SWEEP_LEN;
  const b = RING_SWEEP_START + clamp014(to01) * RING_SWEEP_LEN;
  return {
    length: Math.abs(b - a) * MOD_RING_CIRCUMFERENCE,
    offset: -Math.min(a, b) * MOD_RING_CIRCUMFERENCE
  };
}
var LFO_SYNC_DIVISIONS = [
  { label: "4", beats: 16 },
  { label: "2", beats: 8 },
  { label: "1", beats: 4 },
  { label: "1/2", beats: 2 },
  { label: "1/4", beats: 1 },
  { label: "1/8", beats: 0.5 },
  { label: "1/16", beats: 0.25 },
  { label: "1/32", beats: 0.125 }
];
function lfoSyncedHz(division, bpm) {
  const i = clamp5(Math.round(Number(division) || 0), 0, LFO_SYNC_DIVISIONS.length - 1);
  return (Number(bpm) || 120) / 60 / LFO_SYNC_DIVISIONS[i].beats;
}
var previewNoise = (i, salt = 0) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};
function previewSlew(values, smooth) {
  const s = clamp014(smooth);
  if (s <= 0 || values.length < 2) return values;
  const k = 1 - Math.exp(-(1 / values.length) / (s * s * 0.4 + 1e-6));
  let out = values[0];
  return values.map((v, i) => i === 0 ? out : out = out + (v - out) * k);
}
var LFO_DEF = {
  type: "lfo",
  label: "LFO",
  defaults: { rate: 1, division: 4, phase: 0, width: 0.5, jitter: 0, smooth: 0, sync: false },
  controls: [
    { type: "slider", path: "rate", label: "Rate", min: 0.02, max: 20, step: 0.01, unit: "Hz", scope: true },
    { type: "toggle", path: "sync", label: "Sync" },
    { type: "slider", path: "phase", label: "Phase", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "width", label: "Width", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "jitter", label: "Jitter", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "smooth", label: "Smooth", min: 0, max: 1, step: 0.01 }
  ],
  createState: () => ({ phase: 0, drift: 0, driftTarget: 0, out: null }),
  tick(state2, params, dt, bpm) {
    const s = state2;
    const hz = params.sync ? lfoSyncedHz(Number(params.division) || 0, bpm) : Math.max(0, Number(params.rate) || 0);
    const before = s.phase;
    s.phase = (s.phase + dt * hz) % 1;
    if (s.phase < before) s.driftTarget = (Math.random() * 2 - 1) * clamp014(params.jitter);
    if (!clamp014(params.jitter)) {
      s.drift = 0;
      s.driftTarget = 0;
    } else s.drift += (s.driftTarget - s.drift) * Math.min(1, dt * hz * 4);
    const w = clamp5(Number(params.width) || 0, 0.01, 0.99);
    const ph = (s.phase + clamp014(params.phase)) % 1;
    const tri = ph < w ? ph / w : 1 - (ph - w) / (1 - w);
    let v = clamp5(tri * 2 - 1 + s.drift, -1, 1);
    const smooth = clamp014(params.smooth);
    if (smooth > 0 && s.out !== null) {
      const k = 1 - Math.exp(-dt / (smooth * smooth * 0.4 + 1e-6));
      v = s.out + (v - s.out) * k;
    }
    s.out = v;
    return v;
  },
  /**
   * Two cycles of the wave the params describe: the width skew, the jitter
   * as a slow deterministic wobble, and the slew rounding it all. The
   * on-screen scope draws the live engine signal instead; this is the
   * scope's caption (the wave's name) and the small screens' drawing.
   */
  preview(params, count) {
    const n = Math.max(2, count);
    const w = clamp5(Number(params.width) || 0, 0.01, 0.99);
    const jitter = clamp014(params.jitter);
    const wobble = Math.max(2, Math.round(n / 8));
    const raw = Array.from({ length: n }, (_, i) => {
      const ph = (i / (n - 1) * 2 + clamp014(params.phase)) % 1;
      const tri = ph < w ? ph / w : 1 - (ph - w) / (1 - w);
      const drift = previewNoise(Math.floor(i / wobble)) * jitter * 0.5;
      return clamp5(tri * 2 - 1 + drift, -1, 1);
    });
    const shape = clamp014(params.smooth) > 0.55 ? "Sine" : w <= 0.25 ? "Saw" : w >= 0.75 ? "Ramp" : "Tri";
    return {
      points: previewSlew(raw, clamp014(params.smooth)).map((v) => (v + 1) / 2),
      label: jitter > 0.4 ? `${shape} \xB7 Jitter` : shape
    };
  }
};
registerModType(LFO_DEF);
var SH_DEF = {
  type: "sh",
  label: "S&H",
  defaults: { rate: 4, depth: 1, offset: 0, jitter: 0, smooth: 0 },
  controls: [
    { type: "slider", path: "rate", label: "Rate", min: 0.1, max: 30, step: 0.01, unit: "Hz", scope: true },
    { type: "slider", path: "depth", label: "Depth", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "offset", label: "Offset", min: -1, max: 1, step: 0.01 },
    { type: "slider", path: "jitter", label: "Jitter", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "smooth", label: "Smooth", min: 0, max: 1, step: 0.01 }
  ],
  createState: () => ({ wait: 0, held: 0, out: null }),
  tick(state2, params, dt) {
    const s = state2;
    s.wait -= dt;
    if (s.out === null || s.wait <= 0) {
      s.held = Math.random() * 2 - 1;
      const hz = Math.max(0.01, Number(params.rate) || 0);
      const len = 1 / hz * (1 + (Math.random() * 2 - 1) * clamp014(params.jitter) * 0.9);
      s.wait = Math.max(5e-3, len);
    }
    const offset = clamp5(Number(params.offset) || 0, -1, 1);
    let v = clamp5(s.held * clamp014(params.depth) + offset, -1, 1);
    const smooth = clamp014(params.smooth);
    if (smooth > 0 && s.out !== null) {
      const k = 1 - Math.exp(-dt / (smooth * smooth * 0.4 + 1e-6));
      v = s.out + (v - s.out) * k;
    }
    s.out = v;
    return v;
  },
  /**
   * A run of held values, deterministic so the picture holds still while
   * you shape it: depth scales the throw, offset lifts the whole run,
   * jitter stretches and shrinks the holds (the drunken clock), and the
   * slew turns the steps into a drift.
   */
  preview(params, count) {
    const n = Math.max(2, count);
    const depth = clamp014(params.depth);
    const offset = clamp5(Number(params.offset) || 0, -1, 1);
    const jitter = clamp014(params.jitter);
    const steps = 8;
    const lens = Array.from({ length: steps }, (_, i) => 1 + previewNoise(i, 1) * jitter * 0.9);
    const total = lens.reduce((a, b) => a + b, 0);
    const edges = [];
    let acc = 0;
    for (const len of lens) edges.push(acc += len / total);
    const raw = Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      const step = edges.findIndex((e) => t <= e);
      return clamp5(previewNoise(step < 0 ? steps - 1 : step) * depth + offset, -1, 1);
    });
    return {
      points: previewSlew(raw, clamp014(params.smooth)).map((v) => (v + 1) / 2),
      label: clamp014(params.smooth) > 0.55 ? "Drift" : "Steps"
    };
  }
};
registerModType(SH_DEF);
var secs = (ms) => Math.max(0, Number(ms) || 0) / 1e3;
var ADSR_STAGE_MAX = { attack: 2e3, decay: 2e3, release: 4e3 };
var ENV_BEND_STAGES = ["attack", "decay", "release"];
var envCurveParam = (stage) => `${stage}Curve`;
var adsrShape = (p, curve) => {
  const c = clamp5(Number(curve) || 0, -1, 1);
  return 1 - Math.pow(1 - p, Math.pow(4, c));
};
function envelopePoints(params, count) {
  const n = Math.max(2, count);
  const sustain = clamp014(params.sustain);
  const share = (key) => 0.04 + 0.24 * Math.min(1, secs(params[key]) * 1e3 / ADSR_STAGE_MAX[key]);
  const wA = share("attack");
  const wD = share("decay");
  const wR = share("release");
  const at = (t) => {
    if (t < wA) return adsrShape(t / wA, params.attackCurve);
    if (t < wA + wD) return 1 - (1 - sustain) * adsrShape((t - wA) / wD, params.decayCurve);
    if (t < 1 - wR) return sustain;
    return sustain * (1 - adsrShape((t - (1 - wR)) / wR, params.releaseCurve));
  };
  return Array.from({ length: n }, (_, i) => at(i / (n - 1)));
}
function envelopeJoints(params) {
  const sustain = clamp014(params.sustain);
  const share = (key) => 0.04 + 0.24 * Math.min(1, secs(params[key]) * 1e3 / ADSR_STAGE_MAX[key]);
  const wA = share("attack");
  return [
    { stage: "attack", x: wA, y: 1 },
    { stage: "decay", x: wA + share("decay"), y: sustain },
    { stage: "release", x: 1 - share("release"), y: sustain }
  ];
}
function adsrStageLength(stage, params) {
  if (stage === "attack") return secs(params.attack);
  if (stage === "decay") return secs(params.decay);
  if (stage === "release") return secs(params.release);
  return Infinity;
}
var ADSR_DEF = {
  type: "adsr",
  label: "ADSR",
  defaults: {
    attack: 10,
    decay: 300,
    sustain: 0.6,
    release: 600,
    loop: false,
    // The attack keeps its analog leap; decay and release start straight,
    // as the design draws them — every ramp bendable from its pad.
    attackCurve: 0.5,
    decayCurve: 0,
    releaseCurve: 0
  },
  controls: [
    { type: "slider", path: "attack", label: "Attack", min: 0, max: ADSR_STAGE_MAX.attack, step: 1, unit: "ms", envStage: "attack" },
    { type: "slider", path: "decay", label: "Decay", min: 0, max: ADSR_STAGE_MAX.decay, step: 1, unit: "ms", envStage: "decay" },
    { type: "slider", path: "sustain", label: "Sustain", min: 0, max: 1, step: 0.01, envStage: "sustain" },
    /* Declared after sustain so its pad sits under the sustain column —
       the attack, decay and release columns keep their pads for the
       hold-to-bend gesture. */
    { type: "toggle", path: "loop", label: "Loop" },
    { type: "slider", path: "release", label: "Release", min: 0, max: ADSR_STAGE_MAX.release, step: 1, unit: "ms", envStage: "release" }
  ],
  createState: () => ({ stage: "idle", t: 0, from: 0, env: 0, gate: false }),
  gate(state2, on) {
    const s = state2;
    s.gate = on;
    if (on) {
      s.stage = "attack";
      s.t = 0;
      s.from = s.env;
    } else if (s.stage !== "idle") {
      s.stage = "release";
      s.t = 0;
      s.from = s.env;
    }
  },
  tick(state2, params, dt) {
    const s = state2;
    const loop = !!params.loop;
    const sustain = clamp014(params.sustain);
    if (s.stage === "idle") {
      if (!loop) return s.env = 0;
      s.stage = "attack";
      s.t = 0;
      s.from = 0;
    }
    s.t += dt;
    for (let guard = 0; guard < 4; guard++) {
      const len2 = adsrStageLength(s.stage, params);
      if (s.t < len2) break;
      s.t -= len2;
      if (s.stage === "attack") {
        s.stage = "decay";
        s.from = 1;
      } else if (s.stage === "decay") {
        s.stage = s.gate ? "sustain" : "release";
        s.from = sustain;
      } else {
        s.stage = loop ? "attack" : "idle";
        s.from = 0;
      }
    }
    const len = adsrStageLength(s.stage, params);
    const p = len > 0 && Number.isFinite(len) ? Math.min(1, s.t / len) : 1;
    if (s.stage === "attack") s.env = s.from + (1 - s.from) * adsrShape(p, params.attackCurve);
    else if (s.stage === "decay") s.env = s.from + (sustain - s.from) * adsrShape(p, params.decayCurve);
    else if (s.stage === "sustain") s.env = sustain;
    else if (s.stage === "release") s.env = s.from * (1 - adsrShape(p, params.releaseCurve));
    else s.env = 0;
    return clamp014(s.env);
  }
};
registerModType(ADSR_DEF);
var CURVE_MAX_CLIPS = 8;
var CURVE_MIN_DURATION = 0.05;
var CURVE_MAX_DURATION = 60;
var CURVE_PULSE_DECAY = 0.04;
var CURVE_PREVIEW_BAND = { lo: -0.25, hi: 1.25 };
var DIRECTIONS = ["forward", "mirror", "reverse"];
var CURVE_LABELS = {
  linear: "Linear",
  easeIn: "Ease In",
  easeOut: "Ease Out",
  easeInOut: "Ease InOut",
  spring: "Spring"
};
var SHAPE_PARAMS = ["curvature", "steepness", "anticipate", "overshoot"];
var newClip = () => ({
  type: "easeInOut",
  weight: 1,
  curvature: 0,
  steepness: 0,
  overshoot: 0,
  anticipate: 0
});
function readClips(params) {
  const raw = Array.isArray(params.clips) ? params.clips : [];
  const list = raw.filter((c) => c && typeof c === "object").map((c) => ({ ...newClip(), ...c }));
  return list.length ? list.slice(0, CURVE_MAX_CLIPS) : [newClip()];
}
var writeClips = (list) => list;
var selectedClip = (params, count) => clamp5(Math.round(Number(params.selected) || 0), 0, Math.max(0, count - 1));
function curveComposition(params) {
  const i = DIRECTIONS.indexOf(params.direction);
  return {
    segments: readClips(params),
    driver: null,
    direction: DIRECTIONS[i < 0 ? 0 : i],
    gap: clamp014(params.gap)
  };
}
function curveDuration(params, bpm) {
  const want = clamp5(Number(params.duration) || 0, CURVE_MIN_DURATION, CURVE_MAX_DURATION);
  if (!params.sync) return want;
  const beat = 60 / (Number(bpm) || 120);
  let best = LFO_SYNC_DIVISIONS[0].beats * beat;
  for (const div of LFO_SYNC_DIVISIONS) {
    const secs2 = div.beats * beat;
    if (Math.abs(secs2 - want) < Math.abs(best - want)) best = secs2;
  }
  return Math.max(CURVE_MIN_DURATION, best);
}
var CURVE_DEF = {
  type: "curve",
  label: "Curve",
  defaults: {
    duration: 2,
    sync: false,
    signal: "continuous",
    triggers: DEFAULT_TRIGGER_STEPS,
    direction: "forward",
    flip: false,
    gap: 0,
    segments: 1,
    selected: 0,
    curvature: 0,
    steepness: 0,
    anticipate: 0,
    overshoot: 0,
    clips: writeClips([newClip()])
  },
  controls: [
    /* The selected clip's shape: the knob leans its energy one way or the
       other, the volume knob makes the ease gentle or explosive — the same
       two-axis drag the composer answers to on screen. A knob tap cycles
       the clip through the curve vocabulary. */
    {
      type: "xy",
      path: "curve",
      label: "Curve",
      xParam: "curvature",
      yParam: "steepness",
      xAxis: { min: -1, max: 1, bipolar: true, label: "Energy" },
      yAxis: { min: -1, max: 1, bipolar: true, label: "Steep" },
      drawsPreview: true,
      cycle: (params) => {
        const comp = curveComposition(params);
        const i = selectedClip(params, comp.segments.length);
        return { clips: writeClips(cycleSegmentType(comp, i).segments) };
      }
    },
    { type: "slider", path: "duration", label: "Duration", min: CURVE_MIN_DURATION, max: CURVE_MAX_DURATION, step: 0.01, unit: "s" },
    { type: "toggle", path: "sync", label: "Sync" },
    {
      type: "select",
      path: "signal",
      label: "Signal",
      chip: true,
      options: [{ value: "continuous", label: "Cont" }, { value: "trigger", label: "Trig" }]
    },
    /* The direction reads as a picture — an arrow says which way the pass
       runs faster than a word does. */
    {
      type: "select",
      path: "direction",
      label: "Direction",
      options: [
        { value: "forward", label: "Forward", icon: "arrow-right" },
        { value: "mirror", label: "Mirror", icon: "arrow-left-right" },
        { value: "reverse", label: "Reverse", icon: "arrow-left" }
      ]
    },
    { type: "toggle", path: "flip", label: "Flip" },
    /* The trigger count only means anything in trigger mode, so the chip
       only appears there — the column stays clear the rest of the time. */
    {
      type: "slider",
      path: "triggers",
      label: "Triggers",
      chip: true,
      min: 2,
      max: 16,
      step: 1,
      when: (params) => params.signal === "trigger"
    },
    { type: "slider", path: "gap", label: "Gap", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "anticipate", label: "Anticipate", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "overshoot", label: "Overshoot", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "segments", label: "Segments", min: 1, max: CURVE_MAX_CLIPS, step: 1 }
  ],
  createState: () => ({ phase: 0, signature: "", samplers: null, prev: null, pulse: 0 }),
  tick(state2, params, dt, bpm) {
    const s = state2;
    const comp = curveComposition(params);
    const signature = JSON.stringify(comp.segments) + `|${comp.gap}`;
    if (signature !== s.signature || !s.samplers) {
      s.signature = signature;
      s.samplers = buildSamplers(comp);
    }
    s.phase = (s.phase + dt / curveDuration(params, bpm)) % 1;
    let v = clamp014(readComposition(comp, s.phase, s.samplers).value);
    if (params.flip) v = 1 - v;
    if (params.signal !== "trigger") {
      s.prev = v;
      return v * 2 - 1;
    }
    const fired = triggersCrossed(s.prev ?? v, v, Number(params.triggers) || DEFAULT_TRIGGER_STEPS);
    s.prev = v;
    if (fired.length) s.pulse = 1;
    else s.pulse *= Math.exp(-dt / CURVE_PULSE_DECAY);
    return s.pulse;
  },
  /**
   * Keep the projection and the series in step. A shape dial writes into the
   * selected clip; anything else — a new selection, a deleted clip, a cycled
   * curve — reads that clip's shape back out, so the dials always show the
   * clip the composer is highlighting.
   */
  normalize(current, patch2) {
    const next = { ...current, ...patch2 };
    const changed = (key) => key in patch2 && patch2[key] !== current[key];
    let list = "clips" in patch2 ? readClips(patch2) : readClips(current);
    if (!("clips" in patch2) && changed("segments")) {
      const want = clamp5(Math.round(Number(patch2.segments) || 1), 1, CURVE_MAX_CLIPS);
      while (list.length > want) list.pop();
      while (list.length < want) list.push(newClip());
      list = list.map((c) => ({ ...c, weight: 1 }));
    }
    const sel = selectedClip(next, list.length);
    if (SHAPE_PARAMS.some(changed)) {
      list[sel] = {
        ...list[sel],
        curvature: clampSigned(next.curvature),
        steepness: clampSigned(next.steepness),
        anticipate: clamp014(next.anticipate),
        overshoot: clamp014(next.overshoot)
      };
    } else {
      const clip = list[sel];
      next.curvature = clip.curvature;
      next.steepness = clip.steepness;
      next.anticipate = clip.anticipate ?? 0;
      next.overshoot = clip.overshoot ?? 0;
    }
    next.selected = sel;
    next.segments = list.length;
    next.clips = writeClips(list);
    return next;
  },
  buttons: {
    /* The arrows walk the clips (wrapping), Delete drops the selected one —
       the last clip stays, since a pass with nothing in it plays nothing. */
    left: (params) => {
      const n = readClips(params).length;
      return { selected: (selectedClip(params, n) + n - 1) % n };
    },
    right: (params) => {
      const n = readClips(params).length;
      return { selected: (selectedClip(params, n) + 1) % n };
    },
    delete: (params) => {
      const list = readClips(params);
      if (list.length <= 1) return;
      const sel = selectedClip(params, list.length);
      list.splice(sel, 1);
      return { clips: writeClips(list), selected: Math.min(sel, list.length - 1) };
    }
  },
  phase: (state2) => state2.phase,
  preview(params, count) {
    const list = readClips(params);
    const sel = selectedClip(params, list.length);
    const sampler = buildSampler(list[sel]);
    const span = CURVE_PREVIEW_BAND.hi - CURVE_PREVIEW_BAND.lo;
    const n = Math.max(2, count);
    return {
      points: Array.from({ length: n }, (_, i) => clamp014((sampler(i / (n - 1)) - CURVE_PREVIEW_BAND.lo) / span)),
      label: `${CURVE_LABELS[list[sel].type]} ${sel + 1}/${list.length}`
    };
  }
};
registerModType(CURVE_DEF);

// src/store/ModulationStore.ts
var MOD_TOUCH_GRACE_MS = 4e3;
var PERSIST_TARGET = resolvePersistTarget("modulation", "global", true);
var clamp6 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
var freshParams = (def) => JSON.parse(JSON.stringify(def.defaults));
var ModulationStoreClass = class {
  constructor() {
    this.slots = Array(MOD_SLOTS).fill(null);
    this.assignments = /* @__PURE__ */ new Map();
    this.states = /* @__PURE__ */ new Map();
    this.signals = Array(MOD_SLOTS).fill(0);
    this.sources = /* @__PURE__ */ new Map();
    this.sourceValues = /* @__PURE__ */ new Map();
    this.metas = /* @__PURE__ */ new Map();
    this.bpm = 120;
    this.touched = null;
    this.settingsIndex = null;
    this.settingsUnsub = null;
    /** The control set the open page was built from — see `shapeOf`. */
    this.settingsShape = "";
    this.applyingSettings = false;
    this.structListeners = /* @__PURE__ */ new Set();
    this.frameListeners = /* @__PURE__ */ new Set();
    this.version = 0;
    this.rafId = null;
    this.lastTick = 0;
    this.loop = (now) => {
      this.tick(Math.max(0, (now - this.lastTick) / 1e3));
      this.lastTick = now;
      this.rafId = this.slots.some(Boolean) ? window.requestAnimationFrame(this.loop) : null;
    };
    const saved = loadPersisted(PERSIST_TARGET);
    if (saved) {
      for (const slot of saved.slots ?? []) {
        const i = Math.round(Number(slot?.index));
        if (i >= 0 && i < MOD_SLOTS && slot.type && slot.params) {
          this.slots[i] = { ...slot, index: i, params: { ...slot.params } };
        }
      }
      for (const a of saved.assignments ?? []) {
        if (a?.panelId && a.path && this.slots[a.slot]) {
          this.assignments.set(modKey(a.panelId, a.path), { ...a });
        }
      }
    }
    TweakStore.subscribeGlobal(() => this.metas.clear());
    this.ensureLoop();
  }
  /* ── slots ────────────────────────────────────────────────────────── */
  /** Create a modulation in a step's slot; an occupied slot is returned as-is. */
  createSlot(index, type = "lfo") {
    if (!Number.isInteger(index) || index < 0 || index >= MOD_SLOTS) return null;
    const existing = this.slots[index];
    if (existing) return existing;
    const def = getModType(type);
    if (!def) {
      console.warn(`[tweakers] modulator type "${type}" is not registered`);
      return null;
    }
    const slot = { index, type, params: freshParams(def) };
    this.slots[index] = slot;
    this.states.set(index, def.createState());
    this.changed();
    this.ensureLoop();
    return slot;
  }
  getSlot(index) {
    return this.slots[index] ?? null;
  }
  /** The occupied slots, index order — the track row's circles. */
  getSlots() {
    return this.slots.filter((s) => s !== null);
  }
  /**
   * Change a slot's settings. A modulator with its own structure folds the
   * patch in its own way (`normalize`) — the curve writes a shape dial into
   * the clip it belongs to — and the open settings page follows.
   */
  updateSlotParams(index, patch2) {
    const slot = this.slots[index];
    if (!slot) return;
    const def = getModType(slot.type);
    slot.params = def?.normalize ? def.normalize(slot.params, patch2) : { ...slot.params, ...patch2 };
    if (this.settingsIndex === index) this.refreshSettings();
    this.changed();
  }
  /** Switch a slot's modulator type — fresh defaults, fresh state. */
  setSlotType(index, type) {
    const slot = this.slots[index];
    const def = getModType(type);
    if (!slot || !def) return;
    slot.type = type;
    slot.params = freshParams(def);
    this.states.set(index, def.createState());
    this.changed();
  }
  /** Point a slot at an external source (null returns it to the engine). */
  setSlotSource(index, sourceId) {
    const slot = this.slots[index];
    if (!slot) return;
    slot.source = sourceId;
    this.changed();
  }
  /** Remove a slot's modulation and every assignment wired to it. */
  removeSlot(index) {
    if (!this.slots[index]) return;
    if (this.settingsIndex === index) this.closeSettings();
    this.slots[index] = null;
    this.states.delete(index);
    this.signals[index] = 0;
    for (const [key, a] of this.assignments) {
      if (a.slot === index) this.assignments.delete(key);
    }
    this.changed();
  }
  /* ── assignments ──────────────────────────────────────────────────── */
  /**
   * Wire a control to a slot. Only bounded numeric controls (slider, number
   * with min/max) can be modulated; anything else is refused. A control not
   * yet registered is accepted on trust and resolves when its panel appears.
   */
  assign(panelId, path, slot, amount = 0.5) {
    if (!this.slots[slot]) return false;
    if (panelId === MOD_SETTINGS_PANEL) return false;
    if (TweakStore.getPanel(panelId) && !this.resolveMeta(panelId, path)) {
      console.warn(`[tweakers] "${path}" is not a bounded numeric control; it cannot take a modulation`);
      return false;
    }
    this.assignments.set(modKey(panelId, path), {
      panelId,
      path,
      slot,
      amount: clamp6(Number(amount) || 0, 0, 1)
    });
    this.changed();
    return true;
  }
  unassign(panelId, path) {
    if (this.assignments.delete(modKey(panelId, path))) this.changed();
  }
  getAssignment(panelId, path) {
    return this.assignments.get(modKey(panelId, path));
  }
  getAssignments() {
    return [...this.assignments.values()];
  }
  assignmentsForSlot(index) {
    return this.getAssignments().filter((a) => a.slot === index);
  }
  setAmount(panelId, path, amount) {
    const a = this.assignments.get(modKey(panelId, path));
    if (!a) return;
    a.amount = clamp6(Number(amount) || 0, 0, 1);
    this.changed();
  }
  /* ── the assignment gesture ───────────────────────────────────────── */
  /** A finger on a control — panel pointer, hardware knob. Arms assignment. */
  noteTouch(panelId, path) {
    this.touched = { panelId, path, at: Date.now() };
  }
  /**
   * A step-button press (hardware step or on-screen circle): with a control
   * armed, create the slot's modulation if needed and toggle the control
   * onto it. Returns what happened, for lights and readouts.
   */
  assignFromStep(index) {
    const t = this.touched;
    const armed = t && Date.now() - t.at < MOD_TOUCH_GRACE_MS;
    if (!armed) return { action: "none", slot: this.getSlot(index) };
    const existing = this.assignments.get(modKey(t.panelId, t.path));
    if (this.slots[index] && existing?.slot === index) {
      this.unassign(t.panelId, t.path);
      return { action: "unassigned", slot: this.getSlot(index) };
    }
    const created = !this.slots[index];
    const slot = this.createSlot(index);
    if (!slot) return { action: "none", slot: null };
    if (!this.assign(t.panelId, t.path, index)) {
      if (created) this.removeSlot(index);
      return { action: "none", slot: this.getSlot(index) };
    }
    return { action: created ? "created" : "assigned", slot };
  }
  /* ── gates ────────────────────────────────────────────────────────── */
  /**
   * Note on / note off for a slot — what drives a gated modulator like the
   * ADSR:
   *
   *   ModulationStore.gate(0, true);    // key down
   *   ModulationStore.gate(0, false);   // key up — the release runs
   *
   * Free-running types (LFO, S&H) and slots on an external source ignore
   * it. The gate is live state, not a param: it is never persisted.
   */
  gate(index, on) {
    const slot = this.slots[index];
    const def = slot && getModType(slot.type);
    if (!slot || slot.source || !def?.gate) return;
    let state2 = this.states.get(index);
    if (state2 === void 0) {
      state2 = def.createState();
      this.states.set(index, state2);
    }
    def.gate(state2, on);
    this.ensureLoop();
  }
  /* ── the settings page ────────────────────────────────────────────── */
  /**
   * Open a slot's settings (hold its step button): registers one hidden
   * TweakStore panel (`mod-settings`, kind 'modulation') built from the
   * modulator's own control list, with the type enum ahead of it. Every
   * edit on that panel — screen or hardware, the kit syncs it like any
   * page — flows back into the slot's params. Returns the panel id.
   */
  openSettings(index) {
    const slot = this.slots[index];
    const def = slot && getModType(slot.type);
    if (!slot || !def) return null;
    this.closeSettings();
    this.settingsIndex = index;
    this.registerSettingsPanel(slot, def);
    this.settingsUnsub = TweakStore.subscribe(MOD_SETTINGS_PANEL, () => this.onSettingsChange());
    this.changed();
    return MOD_SETTINGS_PANEL;
  }
  closeSettings() {
    if (this.settingsIndex === null) return;
    this.settingsUnsub?.();
    this.settingsUnsub = null;
    this.settingsIndex = null;
    this.settingsShape = "";
    TweakStore.unregisterPanel(MOD_SETTINGS_PANEL);
    this.changed();
  }
  /** The open settings page, or null — the panel to render as the Move page. */
  getSettings() {
    return this.settingsIndex === null ? null : { index: this.settingsIndex, panelId: MOD_SETTINGS_PANEL };
  }
  /**
   * Where the open page's controls sit — the eight dial slots and the small
   * slots under them. Both surfaces lay the page out from this one list, so
   * they never disagree about which knob a pad belongs to.
   */
  getSettingsLayout() {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    if (!slot || !def) return null;
    const layout = modPageLayout(def.controls, slot.params);
    return {
      dials: [{ path: "type" }, ...layout.dials].slice(0, 8),
      toggles: [null, ...layout.toggles].slice(0, 8),
      values: [null, ...layout.values].slice(0, 8)
    };
  }
  /** The open page's curve, sampled 0..1, and its name — the preview dial. */
  getSettingsPreview(count = 32) {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    return slot && def?.preview ? def.preview(slot.params, count) : null;
  }
  /** Hardware buttons the open page claims (the curve's arrows and Delete). */
  getSettingsButtons() {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    return def?.buttons ? Object.keys(def.buttons) : [];
  }
  /** Run a claimed button. False when the page does not claim that name. */
  pressSettingsButton(name) {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const action = slot && getModType(slot.type)?.buttons?.[name];
    if (!slot || !action) return false;
    const patch2 = action(slot.params);
    if (patch2) this.updateSlotParams(slot.index, patch2);
    return true;
  }
  /** A knob tap on a page dial that cycles (the curve's clip vocabulary). */
  tapSettingsControl(path) {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    const cycle = def?.controls.find((c) => c.path === path)?.cycle;
    if (!slot || !cycle) return false;
    this.updateSlotParams(slot.index, cycle(slot.params));
    return true;
  }
  registerSettingsPanel(slot, def) {
    const config = {
      type: {
        type: "select",
        options: listModTypes().map((d) => ({ value: d.type, label: d.label })),
        default: slot.type
      }
    };
    this.settingsShape = this.shapeOf(slot, def);
    for (const c of visibleModControls(def, slot.params)) {
      if (c.type === "select") {
        config[c.path] = {
          type: "select",
          options: c.options ?? [],
          default: String(slot.params[c.path] ?? "")
        };
      } else if (c.type === "slider") {
        config[c.path] = {
          type: "slider",
          min: c.min ?? 0,
          max: c.max ?? 1,
          step: c.step,
          unit: c.unit,
          default: Number(slot.params[c.path]) || 0
        };
      } else if (c.type === "toggle") {
        config[c.path] = !!slot.params[c.path];
      } else if (c.type === "xy" && c.xParam && c.yParam) {
        config[c.path] = {
          type: "xy",
          x: c.xAxis,
          y: c.yAxis,
          default: { x: Number(slot.params[c.xParam]) || 0, y: Number(slot.params[c.yParam]) || 0 }
        };
      }
    }
    this.applyingSettings = true;
    TweakStore.registerPanel(
      MOD_SETTINGS_PANEL,
      `${def.label} ${slot.index + 1}`,
      config,
      void 0,
      { kind: "modulation" }
    );
    this.applyingSettings = false;
  }
  /** A settings-panel edit — screen or hardware — lands in the slot's params. */
  onSettingsChange() {
    if (this.applyingSettings || this.settingsIndex === null) return;
    const slot = this.slots[this.settingsIndex];
    if (!slot) return;
    const values = TweakStore.getValues(MOD_SETTINGS_PANEL);
    const nextType = values.type;
    if (nextType && nextType !== slot.type && getModType(nextType)) {
      this.setSlotType(slot.index, nextType);
      this.registerSettingsPanel(this.slots[slot.index], getModType(nextType));
      return;
    }
    const def = getModType(slot.type);
    if (!def) return;
    const patch2 = {};
    for (const c of visibleModControls(def, slot.params)) {
      const v = values[c.path];
      if (c.type === "xy" && c.xParam && c.yParam) {
        const xy = v;
        if (xy && typeof xy === "object") {
          patch2[c.xParam] = Number(xy.x) || 0;
          patch2[c.yParam] = Number(xy.y) || 0;
        }
      } else if (c.type === "toggle") {
        patch2[c.path] = !!v;
      } else if (c.type === "select") {
        if (typeof v === "string") patch2[c.path] = v;
      } else if (typeof v === "number" && Number.isFinite(v)) {
        patch2[c.path] = v;
      }
    }
    this.updateSlotParams(slot.index, patch2);
  }
  /**
   * The open page, after the params moved under it. A change that alters
   * which controls the page shows (the curve's trigger chip appearing) or
   * what they read (an arrow selecting another clip) has to reach the panel
   * — hardware edits arrive there, and the screen renders from it.
   */
  refreshSettings() {
    if (this.settingsIndex === null) return;
    const slot = this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    if (!slot || !def) return;
    if (this.shapeOf(slot, def) !== this.settingsShape) {
      this.registerSettingsPanel(slot, def);
      return;
    }
    const values = TweakStore.getValues(MOD_SETTINGS_PANEL);
    const guarded = this.applyingSettings;
    this.applyingSettings = true;
    for (const c of visibleModControls(def, slot.params)) {
      if (c.type === "xy" && c.xParam && c.yParam) {
        const xy = values[c.path] ?? {};
        const x = Number(slot.params[c.xParam]) || 0;
        const y = Number(slot.params[c.yParam]) || 0;
        if (xy.x !== x || xy.y !== y) TweakStore.updateValue(MOD_SETTINGS_PANEL, c.path, { x, y });
      } else if (values[c.path] !== slot.params[c.path]) {
        TweakStore.updateValue(MOD_SETTINGS_PANEL, c.path, slot.params[c.path]);
      }
    }
    this.applyingSettings = guarded;
  }
  /** Which controls the page is built from — a rebuild when this changes. */
  shapeOf(slot, def) {
    return `${slot.type}:${visibleModControls(def, slot.params).map((c) => c.path).join(",")}`;
  }
  /* ── external sources ─────────────────────────────────────────────── */
  /** Offer an app-side modulator to the slots; returns an unregister fn. */
  registerSource(id, config = {}) {
    this.sources.set(id, config);
    this.changed();
    return () => {
      if (this.sources.get(id) === config) {
        this.sources.delete(id);
        this.sourceValues.delete(id);
        this.changed();
      }
    };
  }
  /** Push a source's signal (-1..1) at any rate; the engine mirrors the latest. */
  setSourceValue(id, value) {
    this.sourceValues.set(id, clamp6(Number(value) || 0, -1, 1));
  }
  getSources() {
    return [...this.sources.keys()];
  }
  /* ── tempo ────────────────────────────────────────────────────────── */
  setTempo(bpm) {
    const next = clamp6(Number(bpm) || 0, 20, 999);
    if (next === this.bpm) return;
    this.bpm = next;
    this.changed();
  }
  getTempo() {
    return this.bpm;
  }
  /* ── reading the modulated layer ──────────────────────────────────── */
  /** A slot's live signal, -1..1. */
  getSignal(index) {
    return this.signals[index] ?? 0;
  }
  /** Where a slot sits in its cycle, 0..1 — a curve composer's playhead. */
  getSlotPhase(index) {
    const slot = this.slots[index];
    const def = slot && getModType(slot.type);
    const state2 = this.states.get(index);
    return slot && def?.phase && state2 !== void 0 ? def.phase(state2) : 0;
  }
  /** The modulation's contribution to one control, in the control's units. */
  getOffset(panelId, path) {
    const a = this.assignments.get(modKey(panelId, path));
    if (!a) return 0;
    const slot = this.slots[a.slot];
    if (!slot) return 0;
    if (slot.source && !this.sources.get(slot.source)?.applies) return 0;
    const meta = this.resolveMeta(panelId, path);
    if (!meta) return 0;
    const base = Number(TweakStore.getValue(panelId, path));
    if (!Number.isFinite(base)) return 0;
    return applyModulation(base, this.signals[a.slot], a.amount, meta.min, meta.max) - base;
  }
  /**
   * A modulatable control's bounds, or null when it has none (or its panel
   * has not registered yet) — what a display needs to draw the modulation
   * against the control's own span.
   */
  getBounds(panelId, path) {
    const meta = this.resolveMeta(panelId, path);
    return meta ? { min: meta.min, max: meta.max } : null;
  }
  /** One control's value with its modulation applied — the frame-time read. */
  getValue(panelId, path) {
    const base = Number(TweakStore.getValue(panelId, path));
    return base + this.getOffset(panelId, path);
  }
  /**
   * A panel's values with every modulation applied — a fresh snapshot per
   * call, meant to be pulled once per frame in place of `TweakStore.getValues`.
   */
  getValues(panelId) {
    const out = { ...TweakStore.getValues(panelId) };
    for (const a of this.assignments.values()) {
      if (a.panelId !== panelId) continue;
      const offset = this.getOffset(panelId, a.path);
      if (offset !== 0) out[a.path] = Number(out[a.path]) + offset;
    }
    return out;
  }
  /* ── subscriptions ────────────────────────────────────────────────── */
  /** Structural changes: slots, assignments, sources, tempo. */
  subscribe(listener) {
    this.structListeners.add(listener);
    return () => this.structListeners.delete(listener);
  }
  /** Every engine frame — for pulsing circles, dots, and step lights. */
  subscribeFrames(listener) {
    this.frameListeners.add(listener);
    return () => this.frameListeners.delete(listener);
  }
  /** Bumped on every structural change — a stable snapshot for UI stores. */
  getVersion() {
    return this.version;
  }
  /* ── the engine ───────────────────────────────────────────────────── */
  /**
   * Advance every slot by `dt` seconds and refresh the signals. The RAF
   * loop calls this per frame; headless hosts and tests may drive it
   * directly with their own clock.
   */
  tick(dt) {
    const step = clamp6(Number(dt) || 0, 0, 1);
    for (const slot of this.slots) {
      if (!slot) continue;
      if (slot.source) {
        const src = this.sources.get(slot.source);
        let v = this.sourceValues.get(slot.source) ?? 0;
        if (src?.sample) {
          try {
            v = clamp6(Number(src.sample(slot)) || 0, -1, 1);
          } catch {
            v = 0;
          }
        }
        this.signals[slot.index] = v;
        continue;
      }
      const def = getModType(slot.type);
      if (!def) continue;
      let state2 = this.states.get(slot.index);
      if (state2 === void 0) {
        state2 = def.createState();
        this.states.set(slot.index, state2);
      }
      this.signals[slot.index] = clamp6(def.tick(state2, slot.params, step, this.bpm), -1, 1);
    }
    this.frameListeners.forEach((fn) => fn());
  }
  /** Wipe every slot, assignment, and the persisted shelf. */
  clear() {
    this.closeSettings();
    this.slots.fill(null);
    this.assignments.clear();
    this.states.clear();
    this.signals.fill(0);
    this.touched = null;
    clearPersisted(PERSIST_TARGET);
    this.changed();
  }
  ensureLoop() {
    if (this.rafId !== null || typeof window === "undefined") return;
    if (!this.slots.some(Boolean)) return;
    this.lastTick = performance.now();
    this.rafId = window.requestAnimationFrame(this.loop);
  }
  resolveMeta(panelId, path) {
    const key = modKey(panelId, path);
    const cached = this.metas.get(key);
    if (cached !== void 0) return cached;
    const panel = TweakStore.getPanel(panelId);
    if (!panel) return null;
    const meta = findControl2(panel.controls, path);
    const numeric = meta && (meta.type === "slider" || meta.type === "number") && Number.isFinite(meta.min) && Number.isFinite(meta.max) ? { min: meta.min, max: meta.max } : null;
    this.metas.set(key, numeric);
    return numeric;
  }
  changed() {
    this.version++;
    savePersisted(PERSIST_TARGET, {
      slots: this.getSlots(),
      assignments: this.getAssignments()
    });
    this.structListeners.forEach((fn) => fn());
    this.ensureLoop();
  }
};
function findControl2(controls, path) {
  for (const c of controls) {
    if (c.children) {
      const hit = findControl2(c.children, path);
      if (hit) return hit;
    } else if (c.path === path) {
      return c;
    }
  }
  return null;
}
var ModulationStore = /* @__PURE__ */ new ModulationStoreClass();

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
  const [open, setOpen] = (0, import_react7.useState)(false);
  const readDisabled = (0, import_react7.useCallback)(
    () => panelId && path ? TweakStore.isDisabled(panelId, path) : false,
    [panelId, path]
  );
  const disabled = (0, import_react7.useSyncExternalStore)(
    (0, import_react7.useCallback)((cb) => panelId ? TweakStore.subscribeControlState(panelId, cb) : () => {
    }, [panelId]),
    readDisabled,
    readDisabled
  );
  const readMod = (0, import_react7.useCallback)(
    () => panelId && path ? ModulationStore.getAssignment(panelId, path) : void 0,
    [panelId, path]
  );
  const modAssignment = (0, import_react7.useSyncExternalStore)(
    (0, import_react7.useCallback)((cb) => ModulationStore.subscribe(cb), []),
    readMod,
    readMod
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: "tweakers-control-tip",
      "data-hint": hint ? "true" : void 0,
      "data-affordance": affordance ? "true" : void 0,
      "data-affordance-open": open ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      "data-mod": modAssignment ? "true" : void 0,
      "aria-disabled": disabled ? true : void 0,
      role: hint ? "group" : void 0,
      "aria-describedby": hint ? id : void 0,
      title: hint ? void 0 : title,
      onPointerDownCapture: panelId && path ? () => ModulationStore.noteTouch(panelId, path) : void 0,
      children: [
        children,
        modAssignment && panelId && path && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ModRing, { panelId, path, assignment: modAssignment }),
        hint && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "tweakers-hint", id, role: "tooltip", children: hint }),
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
function ModRing({
  panelId,
  path,
  assignment
}) {
  const arcRef = (0, import_react7.useRef)(null);
  const color = modColor(assignment.slot);
  (0, import_react7.useEffect)(() => {
    const el = arcRef.current;
    if (!el) return;
    const draw = (from, to) => {
      const { length, offset } = modRingArc(from, to);
      el.setAttribute("stroke-dasharray", `${length.toFixed(2)} ${MOD_RING_CIRCUMFERENCE.toFixed(2)}`);
      el.setAttribute("stroke-dashoffset", offset.toFixed(2));
    };
    const bounds = ModulationStore.getBounds(panelId, path);
    const span = bounds ? bounds.max - bounds.min : 0;
    const base01 = () => span ? (Number(TweakStore.getValue(panelId, path)) - bounds.min) / span : 0;
    if (!span) return;
    const still = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      const reach = assignment.amount / 2;
      const drawReach = () => draw(base01() - reach, base01() + reach);
      drawReach();
      return TweakStore.subscribe(panelId, drawReach);
    }
    return ModulationStore.subscribeFrames(() => {
      const b = base01();
      draw(b, b + ModulationStore.getOffset(panelId, path) / span);
    });
  }, [panelId, path, assignment.slot, assignment.amount]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { className: "tweakers-mod-ring", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { className: "tweakers-mod-ring-track", cx: "8", cy: "8", r: MOD_RING_RADIUS }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "circle",
      {
        ref: arcRef,
        className: "tweakers-mod-ring-arc",
        cx: "8",
        cy: "8",
        r: MOD_RING_RADIUS,
        stroke: color,
        strokeDasharray: `0 ${MOD_RING_CIRCUMFERENCE}`
      }
    )
  ] });
}
function Affordance({ affordance, panelId, path, open, onOpenChange }) {
  const dotRef = (0, import_react7.useRef)(null);
  const popoverRef = (0, import_react7.useRef)(null);
  const [pos, setPos] = (0, import_react7.useState)(null);
  const [portalTarget, setPortalTarget] = (0, import_react7.useState)(null);
  const label = affordance.label ?? "Options";
  const status = (0, import_react7.useSyncExternalStore)(
    (0, import_react7.useCallback)((cb) => TweakStore.subscribeControlState(panelId, cb), [panelId]),
    (0, import_react7.useCallback)(() => TweakStore.getAffordanceStatus(panelId, path), [panelId, path]),
    (0, import_react7.useCallback)(() => TweakStore.getAffordanceStatus(panelId, path), [panelId, path])
  );
  (0, import_react7.useEffect)(() => {
    const root = dotRef.current?.closest?.(".tweakers-root");
    const target = root ?? (typeof document === "undefined" ? null : document.body);
    setPortalTarget(target?.nodeType === 1 ? target : null);
  }, []);
  const place = (0, import_react7.useCallback)(() => {
    const rect = dotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = placePopover(rect, popoverRef.current?.offsetHeight ?? 0, window.innerHeight);
    setPos((cur) => cur && cur.top === next.top && cur.left === next.left ? cur : next);
  }, []);
  (0, import_react7.useLayoutEffect)(() => {
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
  (0, import_react7.useLayoutEffect)(() => {
    if (open && pos) place();
  }, [open, pos, place]);
  (0, import_react7.useEffect)(() => {
    if (!open) return;
    const first = popoverRef.current?.querySelector(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (first ?? popoverRef.current)?.focus();
  }, [open, pos !== null]);
  (0, import_react7.useEffect)(() => {
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
      className: "tweakers-affordance-popover",
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
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "tweakers-affordance-popover-title", children: label }),
        (0, import_react7.createElement)(affordance.content, {
          panelId,
          path,
          status,
          setStatus: (next) => TweakStore.setAffordanceStatus(panelId, path, next)
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
        className: "tweakers-affordance-dot",
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
var import_react8 = require("react");
var import_react9 = require("motion/react");
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
  const wrapperRef = (0, import_react8.useRef)(null);
  const inputRef = (0, import_react8.useRef)(null);
  const [isInteracting, setIsInteracting] = (0, import_react8.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react8.useState)(false);
  const [isHovered, setIsHovered] = (0, import_react8.useState)(false);
  const [isValueHovered, setIsValueHovered] = (0, import_react8.useState)(false);
  const [isMetaHeld, setIsMetaHeld] = (0, import_react8.useState)(false);
  const [isValueEditable, setIsValueEditable] = (0, import_react8.useState)(false);
  const [showInput, setShowInput] = (0, import_react8.useState)(false);
  const [inputValue, setInputValue] = (0, import_react8.useState)("");
  const hoverTimeoutRef = (0, import_react8.useRef)(null);
  const pointerDownPos = (0, import_react8.useRef)(null);
  const isClickRef = (0, import_react8.useRef)(true);
  const animRef = (0, import_react8.useRef)(null);
  const wrapperRectRef = (0, import_react8.useRef)(null);
  const scaleRef = (0, import_react8.useRef)(1);
  const wheelValueRef = (0, import_react8.useRef)(value);
  wheelValueRef.current = value;
  const fineRef = (0, import_react8.useRef)(null);
  const dragValueRef = (0, import_react8.useRef)(value);
  const percentage = (value - min) / (max - min) * 100;
  const isActive = isInteracting || isHovered;
  const fillPercent = (0, import_react9.useMotionValue)(percentage);
  const fillExtent = (0, import_react9.useTransform)(
    fillPercent,
    (pct) => hasOrigin ? `${Math.abs(pct - originPercent)}%` : `${pct}%`
  );
  const fillStart = (0, import_react9.useTransform)(
    fillPercent,
    (pct) => hasOrigin ? `${Math.min(pct, originPercent)}%` : "0%"
  );
  const handleLeft = (0, import_react9.useTransform)(
    fillPercent,
    (pct) => `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`
  );
  const rubberStretchPx = (0, import_react9.useMotionValue)(0);
  const rubberBandSize = (0, import_react9.useTransform)(
    rubberStretchPx,
    (stretch) => `calc(100% + ${Math.abs(stretch)}px)`
  );
  const rubberBandShift = (0, import_react9.useTransform)(
    rubberStretchPx,
    (stretch) => stretch < 0 ? stretch : 0
  );
  (0, import_react8.useEffect)(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage);
    }
  }, [percentage, isInteracting, fillPercent]);
  const trackExtent = (0, import_react8.useCallback)(() => {
    const el = wrapperRef.current;
    if (!el) return 0;
    return isVertical ? el.offsetHeight : el.offsetWidth;
  }, [isVertical]);
  const positionToValue = (0, import_react8.useCallback)(
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
  const percentFromValue = (0, import_react8.useCallback)(
    (v) => (v - min) / (max - min) * 100,
    [min, max]
  );
  const applyDetent = (0, import_react8.useCallback)(
    (v) => {
      if (!hasOrigin) return v;
      const extent = trackExtent();
      if (extent <= 0) return v;
      const detentValue = DETENT_PX / extent * (max - min);
      return Math.abs(v - resolvedOrigin) <= detentValue ? resolvedOrigin : v;
    },
    [hasOrigin, max, min, resolvedOrigin, trackExtent]
  );
  const computeRubberStretch = (0, import_react8.useCallback)(
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
  const handlePointerDown = (0, import_react8.useCallback)(
    (e) => {
      if (showInput) return;
      if (e.metaKey) return;
      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      fineRef.current = null;
      dragValueRef.current = value;
      setIsInteracting(true);
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        const nativeExtent = trackExtent();
        const rectExtent = isVertical ? wrapperRectRef.current.height : wrapperRectRef.current.width;
        scaleRef.current = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
      }
    },
    [showInput, isVertical, trackExtent, value]
  );
  const handlePointerMove = (0, import_react8.useCallback)(
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
        const pos = isVertical ? -e.clientY : e.clientX;
        if (e.shiftKey ? !fineRef.current?.shift : fineRef.current?.shift) {
          fineRef.current = { shift: e.shiftKey, anchorValue: dragValueRef.current, anchorPos: pos };
        }
        const newValue = fineRef.current ? fineDragValue({
          startValue: fineRef.current.anchorValue,
          startPos: fineRef.current.anchorPos,
          pos,
          extentPx: trackExtent() || 1,
          min,
          max,
          factor: fineRef.current.shift ? 0.1 : 1
        }) : applyDetent(positionToValue(e.clientX, e.clientY));
        const newPct = percentFromValue(newValue);
        if (animRef.current) {
          animRef.current.stop();
          animRef.current = null;
        }
        fillPercent.jump(newPct);
        const rounded = roundValue(newValue, step);
        dragValueRef.current = rounded;
        onChange(rounded);
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
      step,
      min,
      max,
      trackExtent
    ]
  );
  const handlePointerUp = (0, import_react8.useCallback)(
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
        animRef.current = (0, import_react9.animate)(fillPercent, newPct, {
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
        (0, import_react9.animate)(rubberStretchPx, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15
        });
      }
      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
      fineRef.current = null;
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
  (0, import_react8.useEffect)(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (showInput) return;
      e.preventDefault();
      e.stopPropagation();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (raw === 0) return;
      const stepMultiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const delta = (raw > 0 ? 1 : -1) * step * stepMultiplier;
      const next = roundValue(
        Math.max(min, Math.min(max, wheelValueRef.current + delta)),
        step
      );
      wheelValueRef.current = next;
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
      fillPercent.jump(percentFromValue(next));
      onChange(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [showInput, min, max, step, onChange, fillPercent, percentFromValue]);
  (0, import_react8.useEffect)(() => {
    if (!isHovered) {
      setIsMetaHeld(false);
      return;
    }
    const sync = (e) => setIsMetaHeld(e.metaKey);
    const clear = () => setIsMetaHeld(false);
    window.addEventListener("keydown", sync);
    window.addEventListener("keyup", sync);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", sync);
      window.removeEventListener("keyup", sync);
      window.removeEventListener("blur", clear);
    };
  }, [isHovered]);
  (0, import_react8.useEffect)(() => {
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
  (0, import_react8.useEffect)(() => {
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
    if (isValueEditable || e.metaKey) {
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
        className: "tweakers-slider-hashmark",
        style: { left: `${pct}%` }
      },
      i
    );
  }) : Array.from({ length: 9 }, (_, i) => {
    const pct = (i + 1) * 10;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        className: "tweakers-slider-hashmark",
        style: { left: `${pct}%` }
      },
      i
    );
  });
  const cardClassName = [
    "tweakers-slider",
    isVertical ? "tweakers-slider-vertical" : "",
    isActive ? "tweakers-slider-active" : "",
    isInteracting ? "tweakers-slider-engaged" : "",
    isMetaHeld ? "tweakers-slider-text-mode" : ""
  ].filter(Boolean).join(" ");
  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    // Read ⌘ on entry too: the key listeners only exist while hovered, so a
    // key already held before the pointer arrived would otherwise go unseen.
    onMouseEnter: (e) => {
      setIsHovered(true);
      setIsMetaHeld(e.metaKey);
    },
    onMouseLeave: () => setIsHovered(false)
  };
  if (isVertical) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        ref: wrapperRef,
        className: "tweakers-slider-wrapper tweakers-slider-wrapper-vertical",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          import_react9.motion.div,
          {
            className: cardClassName,
            "data-origin": hasOrigin ? "true" : void 0,
            ...pointerHandlers,
            style: { height: rubberBandSize, y: rubberBandShift },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "tweakers-slider-fill-area", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                import_react9.motion.div,
                {
                  className: "tweakers-slider-fill-vertical",
                  style: { bottom: fillStart, height: fillExtent }
                }
              ) }),
              showInput ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  className: "tweakers-slider-input tweakers-slider-input-vertical",
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
                  className: `tweakers-slider-value-vertical ${isValueEditable ? "tweakers-slider-value-editable" : ""}`,
                  onMouseEnter: () => setIsValueHovered(true),
                  onMouseLeave: () => setIsValueHovered(false),
                  onClick: handleValueClick,
                  onPointerDown: (e) => isValueEditable && e.stopPropagation(),
                  style: { cursor: isValueEditable || isMetaHeld ? "text" : "default" },
                  children: [
                    displayValue,
                    unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "tweakers-slider-unit", children: unit })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "tweakers-slider-label-vertical", children: [
                label,
                shortcut && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: formatSliderShortcut(shortcut) })
              ] })
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { ref: wrapperRef, className: "tweakers-slider-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    import_react9.motion.div,
    {
      className: cardClassName,
      "data-origin": hasOrigin ? "true" : void 0,
      ...pointerHandlers,
      style: { width: rubberBandSize, x: rubberBandShift },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "tweakers-slider-track", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            import_react9.motion.div,
            {
              className: "tweakers-slider-fill",
              style: {
                left: fillStart,
                width: fillExtent
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            import_react9.motion.div,
            {
              className: "tweakers-slider-handle",
              style: { left: handleLeft },
              animate: { opacity: isDragging ? 0.9 : 0 },
              transition: { opacity: { duration: 0.15 } }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "tweakers-slider-hashmarks", children: hashMarks }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "tweakers-slider-label", children: [
          label,
          shortcut && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: formatSliderShortcut(shortcut) })
        ] }),
        valueIcon != null ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "tweakers-slider-value tweakers-slider-value-icon", children: valueIcon }) : showInput ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "tweakers-slider-input",
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
            className: `tweakers-slider-value ${isValueEditable ? "tweakers-slider-value-editable" : ""}`,
            onMouseEnter: () => setIsValueHovered(true),
            onMouseLeave: () => setIsValueHovered(false),
            onClick: handleValueClick,
            onPointerDown: (e) => isValueEditable && e.stopPropagation(),
            style: { cursor: isValueEditable || isMetaHeld ? "text" : "default" },
            children: [
              displayValue,
              unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "tweakers-slider-unit", children: unit })
            ]
          }
        )
      ]
    }
  ) });
}

// src/components/NumberControl.tsx
var import_react10 = require("react");
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
  const inputRef = (0, import_react10.useRef)(null);
  const [isScrubbing, setIsScrubbing] = (0, import_react10.useState)(false);
  const [showInput, setShowInput] = (0, import_react10.useState)(false);
  const [inputValue, setInputValue] = (0, import_react10.useState)("");
  const pointerDownPos = (0, import_react10.useRef)(null);
  const isClickRef = (0, import_react10.useRef)(true);
  const scrubStartValue = (0, import_react10.useRef)(0);
  const isPointerHeld = (0, import_react10.useRef)(false);
  const clamp9 = (0, import_react10.useCallback)(
    (v) => {
      let out = v;
      if (min != null) out = Math.max(min, out);
      if (max != null) out = Math.min(max, out);
      return out;
    },
    [min, max]
  );
  const handlePointerDown = (0, import_react10.useCallback)(
    (e) => {
      if (showInput) return;
      if (e.metaKey) return;
      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      isPointerHeld.current = true;
      scrubStartValue.current = value;
    },
    [showInput, value]
  );
  const handlePointerMove = (0, import_react10.useCallback)(
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
        const next = clamp9(scrubStartValue.current + travel * perPixel);
        onChange(roundValue(next, step));
      }
    },
    [isVertical, step, clamp9, onChange]
  );
  const handlePointerUp = (0, import_react10.useCallback)(() => {
    if (!isPointerHeld.current) return;
    if (isClickRef.current) {
      setShowInput(true);
      setInputValue(value.toFixed(decimalsForStep2(step)));
    }
    isPointerHeld.current = false;
    pointerDownPos.current = null;
    setIsScrubbing(false);
  }, [value, step]);
  (0, import_react10.useEffect)(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onChange(roundValue(clamp9(parsed), step));
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
    "tweakers-number-control",
    isVertical ? "tweakers-number-control-vertical" : "",
    isScrubbing ? "tweakers-number-control-engaged" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "tweakers-number-label", children: label }),
        showInput ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "tweakers-number-input",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyDown: handleInputKeyDown,
            onBlur: handleInputSubmit,
            onClick: (e) => e.stopPropagation(),
            onPointerDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "tweakers-number-value", children: [
          displayValue,
          unit && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "tweakers-number-unit", children: unit })
        ] })
      ]
    }
  );
}

// src/components/RangeSlider.tsx
var import_react11 = require("react");
var import_react12 = require("motion/react");
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
  const wrapperRef = (0, import_react11.useRef)(null);
  const trackRef = (0, import_react11.useRef)(null);
  const inputRef = (0, import_react11.useRef)(null);
  const [isInteracting, setIsInteracting] = (0, import_react11.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react11.useState)(false);
  const [isHovered, setIsHovered] = (0, import_react11.useState)(false);
  const [editing, setEditing] = (0, import_react11.useState)(null);
  const [inputValue, setInputValue] = (0, import_react11.useState)("");
  const pointerDownPos = (0, import_react11.useRef)(null);
  const isClickRef = (0, import_react11.useRef)(true);
  const dragTargetRef = (0, import_react11.useRef)(null);
  const clickMovesRef = (0, import_react11.useRef)(false);
  const dragStartValueRef = (0, import_react11.useRef)(rawValue);
  const dragStartValueAtRef = (0, import_react11.useRef)(0);
  const fineRef = (0, import_react11.useRef)(null);
  const dragValueRef = (0, import_react11.useRef)(rawValue);
  const lowAnimRef = (0, import_react11.useRef)(null);
  const highAnimRef = (0, import_react11.useRef)(null);
  const stopAnims = (0, import_react11.useCallback)(() => {
    lowAnimRef.current?.stop();
    highAnimRef.current?.stop();
    lowAnimRef.current = null;
    highAnimRef.current = null;
  }, []);
  const wrapperRectRef = (0, import_react11.useRef)(null);
  const scaleRef = (0, import_react11.useRef)(1);
  const value = isInteracting ? rawValue : clampRange(rawValue, min, max);
  const span = max - min;
  const lowPercent = span === 0 ? 0 : (value.min - min) / span * 100;
  const highPercent = span === 0 ? 0 : (value.max - min) / span * 100;
  const isActive = isInteracting || isHovered;
  const lowMotion = (0, import_react12.useMotionValue)(lowPercent);
  const highMotion = (0, import_react12.useMotionValue)(highPercent);
  const fillLeft = (0, import_react12.useTransform)(lowMotion, (pct) => `${pct}%`);
  const fillWidth = (0, import_react12.useTransform)(
    [lowMotion, highMotion],
    ([lo, hi]) => `${Math.max(0, hi - lo)}%`
  );
  const lowHandleLeft = (0, import_react12.useTransform)([lowMotion, highMotion], ([lo, hi]) => handleLeftStyles(lo, hi).low);
  const highHandleLeft = (0, import_react12.useTransform)([lowMotion, highMotion], ([lo, hi]) => handleLeftStyles(lo, hi).high);
  (0, import_react11.useEffect)(() => {
    if (!isInteracting && !lowAnimRef.current && !highAnimRef.current) {
      lowMotion.jump(lowPercent);
      highMotion.jump(highPercent);
    }
  }, [lowPercent, highPercent, isInteracting, lowMotion, highMotion]);
  const positionToValue = (0, import_react11.useCallback)(
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
  const percentFromValue = (0, import_react11.useCallback)(
    (v) => span === 0 ? 0 : (v - min) / span * 100,
    [min, span]
  );
  const syncMotion = (0, import_react11.useCallback)(
    (next) => {
      lowMotion.jump(percentFromValue(next.min));
      highMotion.jump(percentFromValue(next.max));
    },
    [lowMotion, highMotion, percentFromValue]
  );
  const handlePointerDown = (0, import_react11.useCallback)(
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
      fineRef.current = null;
      dragValueRef.current = value;
    },
    [editing, positionToValue, value, min, max]
  );
  const handlePointerMove = (0, import_react11.useCallback)(
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
      if (e.shiftKey ? !fineRef.current?.shift : fineRef.current?.shift) {
        fineRef.current = { shift: e.shiftKey, anchorRange: dragValueRef.current, anchorPos: e.clientX };
      }
      const target = dragTargetRef.current;
      let next;
      if (fineRef.current) {
        const f = fineRef.current;
        const extent = wrapperRef.current?.offsetWidth ?? 1;
        const fineAt = (start) => roundValue(
          fineDragValue({
            startValue: start,
            startPos: f.anchorPos,
            pos: e.clientX,
            extentPx: extent,
            min,
            max,
            factor: f.shift ? 0.1 : 1
          }),
          step
        );
        if (target === "span") {
          next = shiftSpan(fineAt(f.anchorRange.min) - f.anchorRange.min, f.anchorRange, min, max);
        } else if (target === "min") {
          next = setLow(fineAt(f.anchorRange.min), value, min);
        } else {
          next = setHigh(fineAt(f.anchorRange.max), value, max);
        }
      } else {
        const raw = roundValue(positionToValue(e.clientX), step);
        if (target === "span") {
          const delta = raw - roundValue(dragStartValueAtRef.current, step);
          next = shiftSpan(delta, dragStartValueRef.current, min, max);
        } else if (target === "min") {
          next = setLow(raw, value, min);
        } else {
          next = setHigh(raw, value, max);
        }
      }
      stopAnims();
      syncMotion(next);
      dragValueRef.current = next;
      onChange(next);
    },
    [isInteracting, positionToValue, step, min, max, value, syncMotion, onChange, stopAnims]
  );
  const handlePointerUp = (0, import_react11.useCallback)(
    (e) => {
      if (!isInteracting) return;
      if (isClickRef.current && clickMovesRef.current) {
        const raw = roundValue(positionToValue(e.clientX), step);
        const which = dragTargetRef.current ?? nearestHandle(raw, value);
        const next = which === "min" ? setLow(raw, value, min) : setHigh(raw, value, max);
        const motion14 = which === "min" ? lowMotion : highMotion;
        const targetPct = percentFromValue(which === "min" ? next.min : next.max);
        stopAnims();
        const anim = (0, import_react12.animate)(motion14, targetPct, {
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
      fineRef.current = null;
    },
    [isInteracting, positionToValue, step, value, min, max, lowMotion, highMotion, percentFromValue, onChange, stopAnims]
  );
  const handlePointerCancel = (0, import_react11.useCallback)(() => {
    if (!isInteracting) return;
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos.current = null;
    dragTargetRef.current = null;
    fineRef.current = null;
  }, [isInteracting]);
  const handleDoubleClick = (0, import_react11.useCallback)(() => {
    if (editing !== null) return;
    const d = clampRange(defaultValue ?? { min, max }, min, max);
    stopAnims();
    lowAnimRef.current = (0, import_react12.animate)(lowMotion, percentFromValue(d.min), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        lowAnimRef.current = null;
      }
    });
    highAnimRef.current = (0, import_react12.animate)(highMotion, percentFromValue(d.max), {
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
  (0, import_react11.useEffect)(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);
  const decimals = decimalsForStep2(step);
  const openEditor = (0, import_react11.useCallback)(
    (which) => {
      setEditing(which);
      setInputValue((which === "min" ? value.min : value.max).toFixed(decimals));
    },
    [value.min, value.max, decimals]
  );
  const commitEditor = (0, import_react11.useCallback)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { ref: wrapperRef, className: "tweakers-range-slider-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    import_react12.motion.div,
    {
      ref: trackRef,
      className: `tweakers-range-slider ${isActive ? "tweakers-range-slider-active" : ""}`,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onDoubleClick: handleDoubleClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_react12.motion.div,
          {
            className: "tweakers-range-slider-fill",
            style: { left: fillLeft, width: fillWidth }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_react12.motion.div,
          {
            className: "tweakers-range-slider-handle",
            style: { left: lowHandleLeft, y: "-50%" },
            animate: { opacity: lowOpacity },
            transition: { opacity: { duration: 0.15 } }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          import_react12.motion.div,
          {
            className: "tweakers-range-slider-handle",
            style: { left: highHandleLeft, y: "-50%" },
            animate: { opacity: highOpacity },
            transition: { opacity: { duration: 0.15 } }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "tweakers-range-slider-label", children: label }),
        editing !== null ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "tweakers-range-slider-input",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyDown: handleInputKeyDown,
            onBlur: commitEditor,
            onClick: (e) => e.stopPropagation(),
            onPointerDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "tweakers-range-slider-value", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "span",
            {
              className: "tweakers-range-slider-bound",
              onClick: (e) => {
                e.stopPropagation();
                openEditor("min");
              },
              onPointerDown: (e) => e.stopPropagation(),
              children: lowText
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "tweakers-range-slider-dash", children: "\u2013" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "span",
            {
              className: "tweakers-range-slider-bound",
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
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "tweakers-labeled-control tweakers-labeled-control-check", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Checkbox, { checked, onChange, label }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "tweakers-labeled-control-label", children: [
      label,
      shortcut && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: formatToggleShortcut(shortcut) })
    ] })
  ] });
}

// src/components/SegmentedControl.tsx
var import_react13 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function SegmentedControl({
  options,
  value,
  onChange
}) {
  const containerRef = (0, import_react13.useRef)(null);
  const hasAnimated = (0, import_react13.useRef)(false);
  const [pillStyle, setPillStyle] = (0, import_react13.useState)(null);
  const measure = (0, import_react13.useCallback)(() => {
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
  (0, import_react13.useLayoutEffect)(() => {
    measure();
  }, [value, options.length, measure]);
  (0, import_react13.useLayoutEffect)(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);
  const shouldAnimate = hasAnimated.current;
  hasAnimated.current = true;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "tweakers-segmented", ref: containerRef, children: [
    pillStyle && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "div",
      {
        className: "tweakers-segmented-pill",
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
          className: "tweakers-segmented-button",
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("svg", { viewBox: `0 0 ${width} ${height}`, className: "tweakers-spring-viz", children: [
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
var import_react14 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
function SpringControl({ panelId, path, label, spring, onChange }) {
  const mode = (0, import_react14.useSyncExternalStore)(
    (cb) => TweakStore.subscribe(panelId, cb),
    () => TweakStore.getSpringMode(panelId, path),
    () => TweakStore.getSpringMode(panelId, path)
  );
  const isSimpleMode = mode === "simple";
  const cache2 = (0, import_react14.useRef)({
    simple: spring.visualDuration !== void 0 ? spring : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
    advanced: spring.stiffness !== void 0 ? spring : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
  });
  if (isSimpleMode) {
    cache2.current.simple = spring;
  } else {
    cache2.current.advanced = spring;
  }
  const handleModeChange = (newMode) => {
    TweakStore.updateSpringMode(panelId, path, newMode);
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
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "tweakers-labeled-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "tweakers-labeled-control-label", children: "Type" }),
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
      className: "tweakers-spring-viz tweakers-easing-viz",
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
var import_react15 = require("react");
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
  const mode = (0, import_react15.useSyncExternalStore)(
    (cb) => TweakStore.subscribe(panelId, cb),
    () => TweakStore.getTransitionMode(panelId, path),
    () => TweakStore.getTransitionMode(panelId, path)
  );
  const isEasing = mode === "easing";
  const isSimpleSpring = mode === "simple";
  const cache2 = (0, import_react15.useRef)({
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
    TweakStore.updateTransitionMode(panelId, path, newMode);
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
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "tweakers-labeled-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tweakers-labeled-control-label", children: "Type" }),
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
  const [editing, setEditing] = (0, import_react15.useState)(false);
  const [draft, setDraft] = (0, import_react15.useState)("");
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
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "tweakers-labeled-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tweakers-labeled-control-label", children: "Ease" }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "input",
      {
        type: "text",
        className: "tweakers-text-input",
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
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "tweakers-text-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("label", { className: "tweakers-text-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      "input",
      {
        type: "text",
        className: "tweakers-text-input",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder
      }
    )
  ] });
}

// src/components/SelectControl.tsx
var import_react17 = require("react");
var import_react_dom2 = require("react-dom");
var import_react18 = require("motion/react");

// src/components/PresenceMotionDiv.tsx
var import_react16 = require("motion/react");
var import_jsx_runtime16 = require("react/jsx-runtime");
function PresenceMotionDiv({ divRef, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_react16.motion.div, { ref: divRef, ...props });
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
  const [isOpen, setIsOpen] = (0, import_react17.useState)(false);
  const triggerRef = (0, import_react17.useRef)(null);
  const dropdownRef = (0, import_react17.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react17.useState)(null);
  const [pos, setPos] = (0, import_react17.useState)(null);
  const normalized = normalizeOptions(options);
  const selectedOption = normalized.find((o) => o.value === value);
  const updatePos = (0, import_react17.useCallback)(() => {
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
  (0, import_react17.useEffect)(() => {
    const root = triggerRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react17.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
  }, [isOpen, updatePos]);
  (0, import_react17.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "tweakers-select-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-select-trigger",
        onClick: () => setIsOpen(!isOpen),
        "data-open": String(isOpen),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "tweakers-select-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "tweakers-select-right", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "tweakers-select-value", children: selectedOption?.label ?? value }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
              import_react18.motion.svg,
              {
                className: "tweakers-select-chevron",
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
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_react18.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-select-dropdown",
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
              className: "tweakers-select-option",
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
var import_react20 = require("react");
var import_react_dom3 = require("react-dom");
var import_react21 = require("motion/react");

// src/components/ColorPickerPanel.tsx
var import_react19 = require("react");

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
  const ref = (0, import_react19.useRef)(null);
  const draggingRef = (0, import_react19.useRef)(false);
  const readPoint = (0, import_react19.useCallback)(
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
  const [draft, setDraft] = (0, import_react19.useState)(null);
  const display = draft ?? String(value);
  const commit = () => {
    if (draft !== null) onCommit(Number(draft));
    setDraft(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { className: "tweakers-color-field", children: [
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
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "tweakers-color-field-label", children: spec.label })
  ] });
}
function HexField({ value, alpha, onCommit }) {
  const [draft, setDraft] = (0, import_react19.useState)(null);
  const commit = () => {
    if (draft !== null) {
      const normalized = normalizeHex(draft, alpha);
      if (normalized) onCommit(normalized);
    }
    setDraft(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { className: "tweakers-color-field tweakers-color-field-hex", children: [
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
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "tweakers-color-field-label", children: "HEX" })
  ] });
}
function PaletteSlot({
  color,
  onSave,
  onApply,
  onClear
}) {
  const [holding, setHolding] = (0, import_react19.useState)(false);
  const timerRef = (0, import_react19.useRef)(null);
  const originRef = (0, import_react19.useRef)(null);
  const firedRef = (0, import_react19.useRef)(false);
  const cancelHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    originRef.current = null;
    setHolding(false);
  };
  (0, import_react19.useEffect)(() => () => cancelHold(), []);
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    "button",
    {
      className: "tweakers-color-palette-slot",
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
  const [hsva, setHsva] = (0, import_react19.useState)(() => {
    const rgba2 = parseHex(value);
    return rgba2 ? rgbToHsv(rgba2) : BLACK;
  });
  const [format, setFormat] = (0, import_react19.useState)(stickyFormat);
  const [slots, setSlots] = (0, import_react19.useState)(() => palette ? loadPalette() : emptyPalette());
  const lastEmittedRef = (0, import_react19.useRef)(value);
  (0, import_react19.useEffect)(() => {
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    const rgba2 = parseHex(value);
    if (rgba2) setHsva(rgbToHsv(rgba2));
  }, [value]);
  (0, import_react19.useEffect)(() => {
    if (!palette) return;
    return subscribePalette(setSlots);
  }, [palette]);
  const emit2 = (0, import_react19.useCallback)(
    (next) => {
      setHsva(next);
      const hex = formatHex(hsvToRgb(next), alpha);
      lastEmittedRef.current = hex;
      onChange(hex);
    },
    [alpha, onChange]
  );
  const applyHex = (0, import_react19.useCallback)(
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
  const hsvaRef = (0, import_react19.useRef)(hsva);
  hsvaRef.current = hsva;
  const svDrag = useAreaDrag(
    (0, import_react19.useCallback)((x, y) => emit2({ ...hsvaRef.current, s: x, v: 1 - y }), [emit2])
  );
  const hueDrag = useAreaDrag(
    (0, import_react19.useCallback)((x) => emit2({ ...hsvaRef.current, h: Math.min(x * 360, 359.999) }), [emit2])
  );
  const alphaDrag = useAreaDrag(
    (0, import_react19.useCallback)((x) => emit2({ ...hsvaRef.current, a: x }), [emit2])
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
    emit2(nextHsva);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "tweakers-color-picker", style: { "--picker-hue": hsva.h }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "div",
      {
        className: "tweakers-color-sv",
        ref: svDrag.ref,
        onPointerDown: svDrag.onPointerDown,
        onPointerMove: svDrag.onPointerMove,
        onPointerUp: svDrag.onPointerUp,
        onPointerCancel: svDrag.onPointerCancel,
        children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "div",
          {
            className: "tweakers-color-sv-thumb",
            style: { left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: opaqueHex }
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "div",
      {
        className: "tweakers-color-slider tweakers-color-hue",
        ref: hueDrag.ref,
        onPointerDown: hueDrag.onPointerDown,
        onPointerMove: hueDrag.onPointerMove,
        onPointerUp: hueDrag.onPointerUp,
        onPointerCancel: hueDrag.onPointerCancel,
        children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "div",
          {
            className: "tweakers-color-slider-thumb",
            style: { left: `${hsva.h / 360 * 100}%`, background: `hsl(${hsva.h} 100% 50%)` }
          }
        )
      }
    ),
    alpha && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
      "div",
      {
        className: "tweakers-color-slider tweakers-color-alpha tweakers-checker",
        ref: alphaDrag.ref,
        onPointerDown: alphaDrag.onPointerDown,
        onPointerMove: alphaDrag.onPointerMove,
        onPointerUp: alphaDrag.onPointerUp,
        onPointerCancel: alphaDrag.onPointerCancel,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "div",
            {
              className: "tweakers-color-alpha-gradient",
              style: { background: `linear-gradient(to right, transparent, ${opaqueHex})` }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            "div",
            {
              className: "tweakers-color-slider-thumb",
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
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "tweakers-color-fields", "data-format": format, children: format === "hex" ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(import_jsx_runtime18.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(HexField, { value: currentHex, alpha, onCommit: applyHex }),
      alpha && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        ChannelField,
        {
          spec: { key: "a", label: "A", min: 0, max: 100, step: 1, precision: 0 },
          value: opacityPercent(rgba),
          onCommit: (n) => emit2({ ...hsva, a: Math.min(1, Math.max(0, n / 100)) })
        }
      )
    ] }) : channelSpecs.map((spec, i) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ChannelField, { spec, value: channelValues[i], onCommit: (n) => commitChannel(i, n) }, `${format}-${spec.key}`)) }),
    palette && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "tweakers-color-palette", children: Array.from({ length: PALETTE_SIZE }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
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
  const [isEditing, setIsEditing] = (0, import_react20.useState)(false);
  const [editValue, setEditValue] = (0, import_react20.useState)(() => bareHex(value));
  const [isOpen, setIsOpen] = (0, import_react20.useState)(false);
  const swatchRef = (0, import_react20.useRef)(null);
  const pickerRef = (0, import_react20.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react20.useState)(null);
  const [pos, setPos] = (0, import_react20.useState)(null);
  const hexInputRef = (0, import_react20.useRef)(null);
  const rgba = parseHex(value);
  (0, import_react20.useEffect)(() => {
    if (!isEditing) {
      setEditValue(bareHex(value));
    }
  }, [value, isEditing]);
  (0, import_react20.useEffect)(() => {
    if (isEditing) {
      hexInputRef.current?.focus();
      hexInputRef.current?.select();
    }
  }, [isEditing]);
  const updatePos = (0, import_react20.useCallback)(() => {
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
  (0, import_react20.useEffect)(() => {
    const root = swatchRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react20.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "tweakers-color-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "tweakers-color-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "tweakers-color-inputs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: "tweakers-color-hex-wrap", onClick: () => setIsEditing(true), children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "tweakers-color-hash", "aria-hidden": "true", children: "#" }),
        isEditing ? /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          "input",
          {
            ref: hexInputRef,
            type: "text",
            className: "tweakers-color-hex-input",
            "aria-label": `Hex color for ${label}`,
            value: editValue,
            onChange: (e) => setEditValue(e.target.value),
            onBlur: handleTextSubmit,
            onKeyDown: handleKeyDown
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "tweakers-color-hex", "aria-label": `Hex color for ${label}`, children: bareHex(value) })
      ] }),
      alpha && rgba && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "tweakers-color-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: "tweakers-color-opacity", children: [
          opacityPercent(rgba),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "tweakers-color-opacity-unit", children: "%" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        "button",
        {
          ref: swatchRef,
          className: "tweakers-color-swatch",
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
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_react21.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        import_react21.motion.div,
        {
          ref: pickerRef,
          className: "tweakers-color-picker-popover",
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
var import_react24 = require("react");
var import_react_dom4 = require("react-dom");
var import_react25 = require("motion/react");

// src/components/GradientPanel.tsx
var import_react23 = require("react");

// src/components/GradientTransformPad.tsx
var import_react22 = require("react");
var import_jsx_runtime20 = require("react/jsx-runtime");
var clamp7 = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var wrap360 = (deg) => (deg % 360 + 360) % 360;
var RAD = Math.PI / 180;
var vectorToAngle = (dx, dy) => wrap360(Math.atan2(dx, -dy) / RAD);
function GradientTransformPad({ value, onChange }) {
  const padRef = (0, import_react22.useRef)(null);
  const drag = (0, import_react22.useRef)(null);
  const [size, setSize] = (0, import_react22.useState)({ w: 0, h: 0 });
  (0, import_react22.useLayoutEffect)(() => {
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
  const pin = (x, y) => ({ x: clamp7(x, 5, w - 5), y: clamp7(y, 5, h - 5) });
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
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { ref: padRef, className: "tweakers-gradient-pad tweakers-checker", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "div",
      {
        className: "tweakers-gradient-pad-fill",
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
          className: "tweakers-gradient-pad-line",
          style: { left: cxPx, top: cyPx, width: majorLineLen, transform: `rotate(${majorLineAngle}deg)` }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-gradient-pad-handle",
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
          className: "tweakers-gradient-pad-handle",
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
          className: "tweakers-gradient-pad-line",
          style: { left: angleOx, top: angleOy, width: angleLineLen, transform: `rotate(${angleLineAngle}deg)` }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-gradient-pad-handle",
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
        className: "tweakers-gradient-pad-handle",
        "data-kind": "center",
        "aria-label": "Gradient center",
        style: { left: clamp7(cxPx, 5, w - 5), top: clamp7(cyPx, 5, h - 5) },
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
  const [selectedIndex, setSelectedIndex] = (0, import_react23.useState)(0);
  const [holdingIndex, setHoldingIndex] = (0, import_react23.useState)(-1);
  const [detach, setDetach] = (0, import_react23.useState)(null);
  const stripRef = (0, import_react23.useRef)(null);
  const gripRef = (0, import_react23.useRef)(null);
  const gripOrigin = (0, import_react23.useRef)(null);
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
  const drag = (0, import_react23.useRef)({ mode: "idle", activeIndex: -1, originX: 0, originY: 0, timer: null, working: value });
  const valueRef = (0, import_react23.useRef)(value);
  valueRef.current = value;
  (0, import_react23.useEffect)(() => () => {
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
    const handle = e.target.closest(".tweakers-gradient-stop");
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
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "tweakers-gradient-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "tweakers-gradient-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        "button",
        {
          ref: gripRef,
          type: "button",
          className: "tweakers-gradient-grip",
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
        className: "tweakers-gradient-strip",
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
              className: "tweakers-gradient-stop",
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
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "tweakers-gradient-divider", "aria-hidden": "true" }),
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
  const [isOpen, setIsOpen] = (0, import_react24.useState)(false);
  const triggerRef = (0, import_react24.useRef)(null);
  const panelRef = (0, import_react24.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react24.useState)(null);
  const [pos, setPos] = (0, import_react24.useState)(null);
  const [dragPos, setDragPos] = (0, import_react24.useState)(null);
  const onPanelDrag = (0, import_react24.useCallback)((dx, dy) => {
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
  const updatePos = (0, import_react24.useCallback)(() => {
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
  (0, import_react24.useEffect)(() => {
    const root = triggerRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react24.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "tweakers-gradient-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "tweakers-gradient-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-gradient-preview tweakers-checker",
        style: { "--gradient-preview": gradientToCss(value) },
        onClick: () => isOpen ? setIsOpen(false) : open(),
        "data-open": String(isOpen),
        title: "Edit gradient",
        "aria-label": `Edit gradient for ${label}`,
        "aria-expanded": isOpen
      }
    ),
    portalTarget && (0, import_react_dom4.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_react25.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        import_react25.motion.div,
        {
          ref: panelRef,
          className: "tweakers-gradient-popover",
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
var import_react26 = require("react");
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
  snap: snap2 = false,
  returnToCenter = false,
  showValues = false,
  disabled = false,
  formatValue,
  shortcut,
  shortcutActive
}) {
  const xAxis = resolveAxis(x);
  const yAxis = resolveAxis(y);
  const areaRef = (0, import_react26.useRef)(null);
  const draggingRef = (0, import_react26.useRef)(false);
  const [active, setActive] = (0, import_react26.useState)(false);
  const [dragging, setDragging] = (0, import_react26.useState)(false);
  const valueRef = (0, import_react26.useRef)(value);
  valueRef.current = value;
  const pointToValue = (0, import_react26.useCallback)(
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
      const next = valueFromPoint({ x: px, y: py }, xAxis, yAxis, snap2);
      const originPoint = pointFromValue({ x: xAxis.origin, y: yAxis.origin }, xAxis, yAxis);
      const dxPx = Math.abs(px - originPoint.x) * rect.width;
      const dyPx = Math.abs(py - originPoint.y) * rect.height;
      return {
        x: applyDetentAxis(next.x, xAxis, dxPx),
        y: applyDetentAxis(next.y, yAxis, dyPx)
      };
    },
    [xAxis, yAxis, snap2]
  );
  const emit2 = (0, import_react26.useCallback)(
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
    emit2(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    if (e.buttons === 0) {
      finishDrag(e);
      return;
    }
    emit2(pointToValue(e.clientX, e.clientY, e.shiftKey));
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
    if (returnToCenter) emit2(normalizeValue(centerValue(xAxis, yAxis), xAxis, yAxis, snap2));
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
    emit2(next);
  };
  const reset = () => {
    if (disabled) return;
    emit2(normalizeValue(centerValue(xAxis, yAxis), xAxis, yAxis, snap2));
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "tweakers-xy", "data-active": String(active), "data-disabled": String(disabled), children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "tweakers-xy-header", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("span", { className: "tweakers-xy-label", children: [
      label,
      shortcut && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: formatSliderShortcut(shortcut) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
      "div",
      {
        ref: areaRef,
        className: "tweakers-xy-area",
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
              className: "tweakers-xy-grid",
              "aria-hidden": "true",
              style: {
                "--tweak-xy-grid-step-x": `${100 / gridX}%`,
                "--tweak-xy-grid-step-y": `${100 / gridY}%`
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "tweakers-xy-axis tweakers-xy-axis-x", "aria-hidden": "true", children: xVisual }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "tweakers-xy-axis tweakers-xy-axis-y", "aria-hidden": "true", children: yVisual }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "tweakers-xy-guide tweakers-xy-guide-v", "aria-hidden": "true", style: { left: leftPct } }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "tweakers-xy-guide tweakers-xy-guide-h", "aria-hidden": "true", style: { top: topPct } }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "tweakers-xy-thumb", "aria-hidden": "true", style: { left: leftPct, top: topPct } })
        ]
      }
    )
  ] });
}

// src/components/XYControl.tsx
var import_jsx_runtime24 = require("react/jsx-runtime");
function XYControl({ label, value, onChange, x, y, grid, density, snap: snap2, returnToCenter, showValues, shortcut, shortcutActive }) {
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
      snap: snap2,
      returnToCenter,
      showValues,
      shortcut,
      shortcutActive
    }
  );
}

// src/components/GalleryControl.tsx
var import_react27 = require("react");
var import_jsx_runtime25 = require("react/jsx-runtime");
function itemContent(item, skeleton) {
  if (item.render) return item.render();
  if (!item.src) return null;
  return skeleton ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(GalleryImage, { item }) : /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("img", { src: item.src, alt: "", draggable: false });
}
function GalleryImage({ item }) {
  const [loaded, setLoaded] = (0, import_react27.useState)(false);
  const imgRef = (0, import_react27.useRef)(null);
  (0, import_react27.useEffect)(() => {
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
      className: "tweakers-gallery-media",
      "data-fixed": item.aspect ? "true" : "false",
      style: item.aspect ? { aspectRatio: String(item.aspect) } : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "tweakers-gallery-skeleton", "data-done": String(loaded), "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          "img",
          {
            ref: imgRef,
            className: "tweakers-gallery-img",
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
  const [isOpen, setIsOpen] = (0, import_react27.useState)(false);
  const selected = items.find((it) => it.id === value) ?? items[0];
  const preview = selected ? itemContent(selected, false) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "tweakers-gallery", "data-open": String(isOpen), children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
      "button",
      {
        type: "button",
        className: "tweakers-gallery-trigger",
        "aria-expanded": isOpen,
        onClick: () => setIsOpen((o) => !o),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "tweakers-gallery-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { className: "tweakers-gallery-right", children: [
            preview && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "tweakers-gallery-preview", "aria-hidden": "true", children: preview }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              "svg",
              {
                className: "tweakers-gallery-chevron",
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
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-gallery-reveal", "aria-hidden": !isOpen, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-gallery-reveal-inner", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-gallery-box", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-gallery-masonry", style: { columnCount: columns }, children: items.map((item) => {
      const isSelected = item.id === value;
      return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
        "button",
        {
          type: "button",
          className: "tweakers-gallery-item",
          "data-selected": String(isSelected),
          "aria-pressed": isSelected,
          tabIndex: isOpen ? 0 : -1,
          style: item.aspect && !item.src ? { aspectRatio: String(item.aspect) } : void 0,
          onClick: () => onChange(item.id),
          children: [
            itemContent(item, true),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "tweakers-gallery-check", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("path", { d: ICON_CHECK }) }) })
          ]
        },
        item.id
      );
    }) }) }) }) })
  ] });
}

// src/components/FileControl.tsx
var import_react28 = require("react");
var import_jsx_runtime26 = require("react/jsx-runtime");
function FileControl({ label, value, accept, multiple = false, onChange, onPick }) {
  const inputRef = (0, import_react28.useRef)(null);
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
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "tweakers-file-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("button", { type: "button", className: "tweakers-file-trigger", onClick: () => inputRef.current?.click(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "tweakers-file-label", children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("span", { className: "tweakers-file-right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          "svg",
          {
            className: "tweakers-file-icon",
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
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "tweakers-file-name", "data-empty": String(!value), children: value || "Choose file\u2026" })
      ] })
    ] }),
    value && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("button", { type: "button", className: "tweakers-file-clear", onClick: clear, "aria-label": "Clear file", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("path", { d: ICON_CLOSE }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
      "input",
      {
        ref: inputRef,
        className: "tweakers-file-input",
        type: "file",
        accept,
        multiple,
        onChange: handleChange
      }
    )
  ] });
}

// src/components/SwatchControl.tsx
var import_react29 = require("react");
var import_react_dom5 = require("react-dom");
var import_react30 = require("motion/react");
var import_jsx_runtime27 = require("react/jsx-runtime");
function Preview({ colors }) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-swatch-preview", "aria-hidden": "true", children: colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-swatch-chip", style: { background: c } }, i)) });
}
function SwatchControl({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = (0, import_react29.useState)(false);
  const [highlight, setHighlight] = (0, import_react29.useState)(-1);
  const triggerRef = (0, import_react29.useRef)(null);
  const dropdownRef = (0, import_react29.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react29.useState)(null);
  const [pos, setPos] = (0, import_react29.useState)(null);
  const selectedOption = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const updatePos = (0, import_react29.useCallback)(() => {
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
  (0, import_react29.useEffect)(() => {
    const root = triggerRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react29.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "tweakers-select-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-select-trigger",
        onClick: () => isOpen ? setIsOpen(false) : open(),
        onKeyDown,
        "data-open": String(isOpen),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-select-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "tweakers-select-right", children: [
            selectedOption && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Preview, { colors: selectedOption.colors }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-select-value", children: selectedOption?.label ?? value }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              import_react30.motion.svg,
              {
                className: "tweakers-select-chevron",
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
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_react30.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-select-dropdown",
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
              className: "tweakers-select-option tweakers-swatch-option",
              "data-selected": String(option.value === value),
              "data-highlight": String(i === highlight),
              onClick: () => select(option.value),
              onMouseEnter: () => setHighlight(i),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Preview, { colors: option.colors }),
                /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-swatch-option-label", children: option.label })
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
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "tweakers-chips", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "tweakers-chips-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "tweakers-chips-grid", role: "listbox", "aria-label": label, children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "tweakers-chip", "data-active": String(option.value === value), children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-chip-select",
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
          className: "tweakers-chip-remove",
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
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "tweakers-multiselect", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-multiselect-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "tweakers-multiselect-list", role: "listbox", "aria-label": label, "aria-multiselectable": "true", children: options.map((option) => {
      const checked = value.includes(option.value);
      return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
        "button",
        {
          type: "button",
          className: "tweakers-multiselect-row",
          role: "option",
          "aria-selected": checked,
          "data-checked": String(checked),
          onClick: () => onChange(toggle(value, options, option.value)),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-multiselect-box", "aria-hidden": "true", children: checked && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: ICON_CHECK }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("span", { className: "tweakers-multiselect-text", children: [
              /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("span", { className: "tweakers-multiselect-line", children: [
                option.label,
                option.tag && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-multiselect-tag", children: option.tag })
              ] }),
              option.hint && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-multiselect-hint", children: option.hint })
            ] })
          ]
        },
        option.value
      );
    }) })
  ] });
}

// src/components/ListControl.tsx
var import_react31 = require("react");
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
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "tweakers-list-item-fields", children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(ControlShell, { hint: field.hint, id: hintDomId(rowId, field.key), children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
    FieldControl,
    {
      field,
      value: params[field.key],
      onChange: (v) => onChange(field.key, v)
    }
  ) }, field.key)) });
}
function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent }) {
  const idCounter = (0, import_react31.useRef)(0);
  const mkId = () => `li-${idCounter.current++}`;
  const [ids, setIds] = (0, import_react31.useState)(() => value.map(mkId));
  const [picking, setPicking] = (0, import_react31.useState)(false);
  const [editing, setEditing] = (0, import_react31.useState)(null);
  const armedRef = (0, import_react31.useRef)(null);
  const [dragIndex, setDragIndex] = (0, import_react31.useState)(null);
  const [over, setOver] = (0, import_react31.useState)(null);
  if (ids.length !== value.length) {
    setIds((cur) => value.map((_, i) => cur[i] ?? mkId()));
  }
  (0, import_react31.useEffect)(() => {
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
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "tweakers-list-items", onDragOver: (e) => e.preventDefault(), onDrop, children: [
      value.map((item, index) => {
        const type = itemTypes[item.type];
        if (!type) return null;
        const { flat: flat2, groups } = groupListFields(parseListItemSchema(type.schema, type.hints, type.groups));
        const overState = over?.index === index ? over.after ? "after" : "before" : void 0;
        const rowTitle = item.title ?? type.label;
        return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
          "div",
          {
            className: "tweakers-list-item",
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
              /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "tweakers-list-item-head", children: [
                /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "tweakers-list-drag",
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
                      className: "tweakers-list-item-title",
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
                    className: "tweakers-list-item-title",
                    "aria-label": `Rename ${rowTitle}`,
                    onClick: () => setEditing(index),
                    children: rowTitle
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "tweakers-list-item-actions", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "tweakers-list-icon-btn tweakers-list-remove",
                    onClick: () => removeItem(index),
                    "aria-label": `Remove ${rowTitle}`,
                    children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_TRASH.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("path", { d }, i)) })
                  }
                ) })
              ] }),
              flat2.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
                FieldList,
                {
                  fields: flat2,
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
      value.length === 0 && !picking && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "tweakers-list-empty", children: "No items yet" })
    ] }),
    !atCapacity && /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "tweakers-list-add", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("button", { type: "button", className: "tweakers-list-add-btn", "data-open": String(picking), onClick: handleAdd, children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("path", { d: ICON_PLUS }) }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { children: addLabel ?? "Add" })
      ] }),
      typeEntries.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "tweakers-list-picker", "data-open": String(picking), children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "tweakers-list-picker-inner", children: typeEntries.map(([key, type]) => /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-list-picker-chip",
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
var import_react32 = require("react");

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
  const subscribe = (0, import_react32.useCallback)(
    (callback) => TweakStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const sample = (0, import_react32.useSyncExternalStore)(subscribe, () => control.sample, () => control.sample);
  const markers = (0, import_react32.useSyncExternalStore)(subscribe, () => control.markers, () => control.markers);
  const height = clampCurveHeight(control.height);
  const plot = plotCurve(sample ?? (() => NaN), { domain: control.domain });
  const pathData = curvePathData(plot.segments, VIEW_WIDTH, height, PAD_Y);
  const baselineY = plot.baseline !== null ? curveY(plot.baseline, height, PAD_Y) : null;
  const markerXs = normalizeCurveMarkers(markers);
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "tweakers-curve", children: [
    !control.hideLabel && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "tweakers-curve-label", children: control.label }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
      "svg",
      {
        className: "tweakers-curve-surface",
        viewBox: `0 0 ${VIEW_WIDTH} ${height}`,
        preserveAspectRatio: "none",
        "data-aspect": control.aspect !== void 0 ? "" : void 0,
        style: control.aspect !== void 0 ? { aspectRatio: control.aspect } : { height },
        role: "img",
        "aria-label": control.label,
        children: [
          baselineY !== null && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
            "line",
            {
              className: "tweakers-curve-baseline",
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
              className: "tweakers-curve-marker",
              x1: m * VIEW_WIDTH,
              y1: 0,
              x2: m * VIEW_WIDTH,
              y2: height,
              vectorEffect: "non-scaling-stroke"
            },
            i
          )),
          pathData && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { className: "tweakers-curve-stroke", d: pathData, fill: "none", vectorEffect: "non-scaling-stroke" })
        ]
      }
    )
  ] });
}

// src/move-layout.ts
var MOVE_TRACKS = 4;
var MOVE_DIALS = 8;
var MOVE_PADS = 8;
var flat = (controls, out = []) => {
  for (const c of controls) {
    if (c.children) flat(c.children, out);
    else out.push(c);
  }
  return out;
};
var isEnumDial = (c) => c.type === "select" && Array.isArray(c.options) && c.options.length > 1;
var isDial = (c) => c.type === "slider" || c.type === "xy" || c.type === "range" || c.type === "filter" || isEnumDial(c) || c.type === "number" && c.min != null && c.max != null;
var noChip = (c) => c.type === "xy" || c.type === "range" || c.type === "filter" || isEnumDial(c);
var dialSpan = (c) => c?.type === "filter" ? 2 : 1;
var isSpanContinuation = (page, i) => i > 0 && page.dials[i] !== void 0 && page.dials[i] === page.dials[i - 1];
function buildModMovePage(panel, layout) {
  const controls = flat(panel.controls);
  if (layout) {
    const at = (slot) => slot ? controls.find((c) => c.path === slot.path) : void 0;
    return {
      panel,
      dials: layout.dials.slice(0, MOVE_DIALS).map(at).filter((c) => !!c),
      toggles: layout.toggles.slice(0, MOVE_PADS).map(at),
      values: layout.values.slice(0, MOVE_PADS).map(at),
      actions: []
    };
  }
  const dials = [];
  const toggles = [];
  for (const c of controls) {
    if (c.type === "toggle") toggles[Math.max(0, dials.length - 1)] = c;
    else if (c.type === "select" || isDial(c)) dials.push(c);
  }
  return { panel, dials: dials.slice(0, MOVE_DIALS), toggles: toggles.slice(0, MOVE_PADS), values: [], actions: [] };
}
var padColumn = (panel, c) => {
  const col = panel.movePads?.[c.path];
  return typeof col === "number" && Number.isInteger(col) && col >= 0 && col < MOVE_PADS ? col : null;
};
function buildMovePages(panels) {
  return panels.filter((p) => p.kind === void 0).slice(0, MOVE_TRACKS).map((panel) => {
    const controls = flat(panel.controls);
    const chipPlaced = (c) => padColumn(panel, c) !== null && !noChip(c);
    const dials = [];
    let nextCol = 0;
    for (const c of controls) {
      if (!isDial(c) || chipPlaced(c)) continue;
      const span = dialSpan(c);
      if (nextCol + span > MOVE_DIALS) {
        if (nextCol >= MOVE_DIALS) break;
        continue;
      }
      for (let s = 0; s < span; s++) dials[nextCol + s] = c;
      nextCol += span;
    }
    const toggles = [];
    const values = [];
    const actions = [];
    const place = (row, c, col) => {
      if (col !== null && row[col] === void 0) {
        row[col] = c;
        return;
      }
      for (let i = 0; i < MOVE_PADS; i++) {
        if (row[i] === void 0) {
          row[i] = c;
          return;
        }
      }
    };
    for (const c of controls) {
      const col = padColumn(panel, c);
      if (c.type === "toggle") place(toggles, c, col);
      else if (c.type === "action") {
        if (col !== null) place(actions, c, col);
      } else if (isDial(c) && !noChip(c) && !dials.includes(c)) place(values, c, col);
    }
    return {
      panel,
      dials,
      toggles: toggles.slice(0, MOVE_PADS),
      values: values.slice(0, MOVE_PADS),
      actions: actions.slice(0, MOVE_PADS)
    };
  });
}
function movePadRows(page, claimedRows) {
  if (claimedRows >= 2) return [page.values, page.toggles, [], []];
  return [page.toggles, page.values, page.actions, []];
}
function moveAppPadRow(row, claimedRows) {
  if (claimedRows >= 2) return row === 2 ? 1 : row === 3 ? 0 : null;
  return claimedRows === 1 && row === 3 ? 0 : null;
}
function visibleColumns(page) {
  const cols = [];
  for (let i = 0; i < MOVE_DIALS; i++) {
    if (page.dials[i] || page.toggles[i] || page.values[i] || page.actions[i]) cols.push(i);
  }
  return cols;
}
function denormalizeDial(meta, v01) {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  let v = min + Math.min(1, Math.max(0, v01)) * (max - min);
  if (meta.step) v = Math.round(v / meta.step) * meta.step;
  return Number(v.toFixed(6));
}
function normalizeDial(meta, value) {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  const v = (Number(value) - min) / (max - min || 1);
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
}
var norm01 = (v, min, max) => {
  const n = (Number(v) - min) / (max - min || 1);
  return Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));
};
var denorm01 = (v01, min, max, step) => {
  let v = min + Math.min(1, Math.max(0, v01)) * (max - min);
  if (step) v = Math.round(v / step) * step;
  return Number(v.toFixed(6));
};
function normalizeXYDial(meta, value) {
  const xAxis = resolveAxis(meta.xAxis);
  const yAxis = resolveAxis(meta.yAxis);
  const v = value ?? {};
  return { x: norm01(v.x, xAxis.min, xAxis.max), y: norm01(v.y, yAxis.min, yAxis.max) };
}
var enumOptionValue = (o) => typeof o === "string" ? o : o.value;
var enumOptionLabel = (o) => typeof o === "string" ? o : o.label ?? o.value;
var enumOptionIcon = (o) => typeof o === "string" ? null : o.icon ?? null;
var ENUM_SHAPE_SAMPLES = 64;
function enumShapePath(meta, value) {
  if (!meta.preview) return null;
  let sample;
  try {
    sample = meta.preview(String(value ?? ""));
  } catch {
    return null;
  }
  if (typeof sample !== "function") return null;
  const segments = plotCurve(sample, { count: ENUM_SHAPE_SAMPLES }).segments;
  let lo = Infinity;
  let hi = -Infinity;
  for (const seg of segments) {
    for (const pt of seg) {
      if (pt.v < lo) lo = pt.v;
      if (pt.v > hi) hi = pt.v;
    }
  }
  if (lo > hi) return null;
  const span = hi - lo;
  const fill = (v) => span > 0 ? (v - lo) / span : 0.5;
  const d = segments.map((seg) => seg.map((pt, i) => `${i ? "L" : "M"} ${(pt.t * 100).toFixed(2)} ${((1 - fill(pt.v)) * 100).toFixed(2)}`).join(" ")).join(" ");
  return d || null;
}
function enumIndex(meta, value) {
  const i = (meta.options ?? []).findIndex((o) => enumOptionValue(o) === value);
  return Math.max(0, i);
}
function normalizeRangeDial(meta, value) {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  const v = value ?? {};
  return { lo: norm01(v.min, min, max), hi: norm01(v.max, min, max) };
}
function denormalizeRangeDial(meta, lo01, hi01) {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  const step = meta.step ?? 0;
  return clampRange(
    { min: denorm01(lo01, min, max, step), max: denorm01(hi01, min, max, step) },
    min,
    max
  );
}
function normalizeEnumDial(meta, value) {
  const opts = (meta.options ?? []).map((o) => enumOptionValue(o));
  if (opts.length < 2) return 0;
  const i = opts.indexOf(String(value));
  return i <= 0 ? 0 : i / (opts.length - 1);
}
function denormalizeEnumDial(meta, v01) {
  const opts = (meta.options ?? []).map((o) => enumOptionValue(o));
  if (opts.length === 0) return "";
  const i = Math.round(Math.min(1, Math.max(0, v01)) * (opts.length - 1));
  return opts[i];
}
function normalizeFilterDial(meta, value) {
  const ca = resolveFilterAxis(meta.cutoffAxis, "cutoff");
  const ra = resolveFilterAxis(meta.resonanceAxis, "resonance");
  const v = normalizeFilterValue(value, ca, ra);
  return { cutoff: filterHand01(v.cutoff, ca), resonance: filterHand01(v.resonance, ra) };
}
function denormalizeFilterDial(meta, cutoff01, resonance01) {
  const ca = resolveFilterAxis(meta.cutoffAxis, "cutoff");
  const ra = resolveFilterAxis(meta.resonanceAxis, "resonance");
  return { cutoff: filterHandValue(cutoff01, ca), resonance: filterHandValue(resonance01, ra) };
}
function filterShapePath(meta, value) {
  const pos = normalizeFilterDial(meta, value);
  let response;
  try {
    response = (meta.response ?? defaultFilterResponse)(pos.cutoff, pos.resonance);
  } catch {
    return null;
  }
  if (typeof response !== "function") return null;
  return filterResponsePath(response);
}
function dialOrigin(meta) {
  const origin = meta.origin ?? (meta.bipolar ? 0 : void 0);
  return origin === void 0 ? 0 : normalizeDial(meta, origin);
}

// src/components/FilterControl.tsx
var import_jsx_runtime32 = require("react/jsx-runtime");
var FILTER_SURFACE_HEIGHT = 56;
function FilterControl({ control, value, onChange }) {
  const ca = resolveFilterAxis(control.cutoffAxis, "cutoff");
  const ra = resolveFilterAxis(control.resonanceAxis, "resonance");
  const v = normalizeFilterValue(value, ca, ra);
  const shape = filterShapePath(control, v);
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "tweakers-filter", children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "tweakers-curve", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "tweakers-curve-label", children: control.label }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "tweakers-curve-surface", style: { height: FILTER_SURFACE_HEIGHT }, children: shape && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", style: { display: "block", width: "100%", height: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("path", { className: "tweakers-curve-stroke", d: shape, fill: "none", vectorEffect: "non-scaling-stroke" }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
      Slider,
      {
        label: ca.label,
        value: v.cutoff,
        min: ca.min,
        max: ca.max,
        step: ca.step || void 0,
        formatValue: ca.formatValue,
        onChange: (cutoff) => onChange({ ...v, cutoff })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
      Slider,
      {
        label: ra.label,
        value: v.resonance,
        min: ra.min,
        max: ra.max,
        step: ra.step || void 0,
        formatValue: ra.formatValue,
        onChange: (resonance) => onChange({ ...v, resonance })
      }
    )
  ] });
}

// src/components/AnalyserRow.tsx
var import_react34 = require("react");

// src/components/AnalyserVisualization.tsx
var import_react33 = require("react");

// src/analyser-core.ts
function byteFreqToUnit(v) {
  return v / 255;
}
function byteTimeToUnit(v) {
  return (v - 128) / 128;
}
function binRange(point, points, bins, scale, loBin = 1, hiBin = bins) {
  if (bins <= 2) return { start: Math.max(0, bins - 1), end: Math.max(1, bins) };
  const lo = Math.max(1, Math.min(bins - 1, loBin));
  const hi = Math.max(lo + 1, Math.min(bins, hiBin));
  const at = (t) => scale === "log" ? lo * Math.pow(hi / lo, t) : lo + (hi - lo) * t;
  let start = Math.floor(at(point / points));
  start = Math.max(lo, Math.min(hi - 1, start));
  const end = Math.max(start + 1, Math.min(hi, Math.floor(at((point + 1) / points))));
  return { start, end };
}
function hzWindowToBins(rangeHz, nyquistHz, bins) {
  const [loHz, hiHz] = rangeHz;
  if (!Number.isFinite(loHz) || !Number.isFinite(hiHz) || !(nyquistHz > 0) || bins <= 2) return null;
  if (!(hiHz > loHz) || hiHz <= 0) return null;
  const toBin = (hz) => hz / nyquistHz * bins;
  const loBin = Math.max(1, Math.min(bins - 1, toBin(Math.max(0, loHz))));
  const hiBin = Math.max(loBin + 1, Math.min(bins, toBin(hiHz)));
  return { loBin, hiBin };
}
function markerT(bin, scale, loBin, hiBin) {
  if (!Number.isFinite(bin) || !(hiBin > loBin) || loBin <= 0) return null;
  const t = scale === "log" ? Math.log(bin / loBin) / Math.log(hiBin / loBin) : (bin - loBin) / (hiBin - loBin);
  return t >= 0 && t <= 1 && Number.isFinite(t) ? t : null;
}
function fillFrequencyTargets(data, out, scale, loBin = 1, hiBin = data.length) {
  const points = out.length;
  for (let i = 0; i < points; i++) {
    const { start, end } = binRange(i, points, data.length, scale, loBin, hiBin);
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
    smoothThrough(ctx, topPts);
    ctx.lineTo(botPts[0].x, botPts[0].y);
    smoothThrough(ctx, botPts);
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
      smoothThrough(ctx, pts);
      ctx.lineTo(W, baseY);
      ctx.lineTo(0, baseY);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.globalAlpha = AREA_FILL_ALPHA * alpha;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    smoothThrough(ctx, pts);
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
    const win = rt.source === "frequency" && rt.rangeHz ? hzWindowToBins(rt.rangeHz, an.context.sampleRate / 2, bytes.length) : null;
    const twoSeries = rt.source === "waveform" && (pixelated || rt.variant === "area");
    if (rt.source === "frequency") {
      fillFrequencyTargets(bytes, targetsA, rt.scale, win?.loBin ?? 1, win?.hiBin ?? bytes.length);
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
    if (rt.source === "frequency" && rt.marker) {
      const hz = rt.marker();
      if (hz != null && Number.isFinite(hz)) {
        const bins = bytes.length;
        const bin = hz / (an.context.sampleRate / 2) * bins;
        const t = markerT(bin, rt.scale, win?.loBin ?? 1, win?.hiBin ?? bins);
        if (t !== null) {
          let x = t * W;
          if (pixelated) x = quantizeToGrid(x, columnWidth2(rt.pixelSize));
          ctx.strokeStyle = wave;
          ctx.globalAlpha = 0.4 * alpha;
          ctx.lineWidth = dpr;
          ctx.beginPath();
          ctx.moveTo(Math.round(x) + 0.5, 0);
          ctx.lineTo(Math.round(x) + 0.5, H);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
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
var import_jsx_runtime33 = require("react/jsx-runtime");
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
  rangeHz = null,
  marker = null,
  width = 256,
  height = 140
}) {
  const canvasRef = (0, import_react33.useRef)(null);
  const runtimeRef = (0, import_react33.useRef)(null);
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
    rangeHz,
    marker,
    width,
    height
  };
  (0, import_react33.useEffect)(() => {
    if (!canvasRef.current) return;
    const engine = createAnalyserEngine(canvasRef.current, () => runtimeRef.current);
    return () => engine.destroy();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "tweakers-analyser-viz-wrap", style: { width }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("canvas", { ref: canvasRef, className: "tweakers-analyser-viz", style: { width, height } }),
    (onMuteChange || onSoloChange) && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "tweakers-analyser-actions", children: [
      onMuteChange && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", "aria-label": "Mute", "aria-pressed": muted, onClick: () => onMuteChange(!muted), children: "M" }),
      onSoloChange && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", "aria-label": "Solo", "aria-pressed": soloed, onClick: () => onSoloChange(!soloed), children: "S" })
    ] })
  ] });
}

// src/components/AnalyserRow.tsx
var import_jsx_runtime34 = require("react/jsx-runtime");
var DEFAULT_HEIGHT = 56;
function AnalyserRow({ panelId, control }) {
  const subscribe = (0, import_react34.useCallback)(
    (callback) => TweakStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const row = (0, import_react34.useSyncExternalStore)(subscribe, () => control.analyserRow, () => control.analyserRow);
  const wrapRef = (0, import_react34.useRef)(null);
  const [width, setWidth] = (0, import_react34.useState)(0);
  (0, import_react34.useLayoutEffect)(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const height = clampCurveHeight(row?.height ?? DEFAULT_HEIGHT);
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "tweakers-analyser-row", ref: wrapRef, children: [
    !control.hideLabel && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: "tweakers-curve-label", children: control.label }),
    row && width > 0 && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      AnalyserVisualization,
      {
        analyser: row.analyser() ?? null,
        source: row.source ?? "frequency",
        variant: row.variant ?? "area",
        mode: row.mode ?? "pixelated",
        pixelSize: row.pixelSize ?? 2,
        scale: row.scale ?? "log",
        spring: row.spring ?? false,
        rangeHz: row.rangeHz ?? null,
        marker: row.marker ?? null,
        width,
        height
      }
    )
  ] });
}

// src/components/ControlRenderer.tsx
var import_jsx_runtime35 = require("react/jsx-runtime");
function ControlRenderer({ panelId, controls, values, transitionDuration }) {
  const shortcutCtx = (0, import_react35.useContext)(ShortcutContext);
  const renderControlNode = (control) => {
    const value = values[control.path];
    if (value === void 0 && control.type !== "folder" && control.type !== "action" && control.type !== "curve" && control.type !== "analyser") {
      return null;
    }
    switch (control.type) {
      case "slider":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          Slider,
          {
            label: control.label,
            value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
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
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          NumberControl,
          {
            label: control.label,
            value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
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
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          RangeSlider,
          {
            label: control.label,
            value,
            min: control.min ?? 0,
            max: control.max ?? 1,
            step: control.step,
            defaultValue: control.rangeDefault,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "toggle":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          Toggle,
          {
            label: control.label,
            checked: value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path
          },
          control.path
        );
      case "spring":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          SpringControl,
          {
            panelId,
            path: control.path,
            label: control.label,
            spring: value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "transition":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          TransitionControl,
          {
            panelId,
            path: control.path,
            label: control.label,
            value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
            durationControl: transitionDuration
          },
          control.path
        );
      case "folder": {
        if (control.module) {
          const enabledPath = `${control.path}._enabled`;
          return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
            ModuleFolder,
            {
              title: control.label,
              enabled: values[enabledPath],
              onEnabledChange: (v) => TweakStore.updateValue(panelId, enabledPath, v),
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
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          Folder,
          {
            title: control.label,
            defaultOpen: control.defaultOpen ?? true,
            collapsible: control.collapsible ?? true,
            hint: control.hint,
            hintId: hintDomId(panelId, control.path),
            toolbar: headerTabs ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              SegmentedControl,
              {
                options: (headerTabs.options ?? []).map(
                  (o) => typeof o === "string" ? { value: o, label: o } : o
                ),
                value: values[headerTabs.path],
                onChange: (v) => TweakStore.updateValue(panelId, headerTabs.path, v)
              }
            ) : void 0,
            children: (headerTabs ? rest : control.children)?.map(renderControl)
          },
          control.path
        );
      }
      case "text":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          TextControl,
          {
            label: control.label,
            value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
            placeholder: control.placeholder
          },
          control.path
        );
      case "select":
        if (control.display === "segmented") {
          return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tweakers-labeled-control", children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "tweakers-labeled-control-label", children: control.label }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              SegmentedControl,
              {
                options: (control.options ?? []).map(
                  (o) => typeof o === "string" ? { value: o, label: o } : o
                ),
                value,
                onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
              }
            )
          ] }, control.path);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          SelectControl,
          {
            label: control.label,
            value,
            options: control.options ?? [],
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "color":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          ColorControl,
          {
            label: control.label,
            value,
            alpha: control.alpha,
            palette: control.palette,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "gradient":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          GradientControl,
          {
            label: control.label,
            value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "xy":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "gallery":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          GalleryControl,
          {
            label: control.label,
            value,
            items: control.items ?? [],
            columns: control.columns,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "file":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          FileControl,
          {
            label: control.label,
            value,
            accept: control.accept,
            multiple: control.multiple,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
            onPick: (files) => TweakStore.emitEvent(panelId, control.path, { kind: "file", files })
          },
          control.path
        );
      case "swatch":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          SwatchControl,
          {
            label: control.label,
            value,
            options: control.swatchOptions ?? [],
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "chips":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          ChipsControl,
          {
            label: control.label,
            value,
            options: control.chipOptions ?? [],
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
            onRemove: (v) => TweakStore.emitEvent(panelId, control.path, { kind: "remove", value: v })
          },
          control.path
        );
      case "multiselect":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          MultiSelectControl,
          {
            label: control.label,
            value: value ?? [],
            options: control.multiSelectOptions ?? [],
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "list":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          ListControl,
          {
            label: control.label,
            value,
            itemTypes: control.itemTypes ?? {},
            addLabel: control.addLabel,
            maxItems: control.maxItems,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v),
            onEvent: (event) => TweakStore.emitEvent(panelId, control.path, event)
          },
          control.path
        );
      case "filter":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          FilterControl,
          {
            control,
            value,
            onChange: (v) => TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "curve":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CurvePreview, { panelId, control }, control.path);
      case "analyser":
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(AnalyserRow, { panelId, control }, control.path);
      case "action": {
        const button = /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          "button",
          {
            className: "tweakers-button",
            disabled: TweakStore.isDisabled(panelId, control.path),
            onClick: () => TweakStore.triggerAction(panelId, control.path),
            children: control.label
          },
          control.path
        );
        if (control.caption === void 0) return button;
        return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tweakers-labeled-control tweakers-captioned-action", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "tweakers-labeled-control-label", children: control.caption }),
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
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_jsx_runtime35.Fragment, { children: controls.map(renderControl) });
}

// src/components/PresetManager.tsx
var import_react36 = require("react");
var import_react_dom6 = require("react-dom");
var import_react37 = require("motion/react");
var import_jsx_runtime36 = require("react/jsx-runtime");
function PresetManager({ panelId, presets, activePresetId, onAdd, providerMode = false, editSignal = 0 }) {
  const [isOpen, setIsOpen] = (0, import_react36.useState)(false);
  const triggerRef = (0, import_react36.useRef)(null);
  const dropdownRef = (0, import_react36.useRef)(null);
  const [pos, setPos] = (0, import_react36.useState)({ top: 0, left: 0, width: 0 });
  const [editingId, setEditingId] = (0, import_react36.useState)(null);
  const [draftName, setDraftName] = (0, import_react36.useState)("");
  const editInputRef = (0, import_react36.useRef)(null);
  const lastEditSignal = (0, import_react36.useRef)(editSignal);
  const hasPresets = presets.length > 0;
  const activePreset = presets.find((p) => p.id === activePresetId);
  const open = (0, import_react36.useCallback)(() => {
    if (!hasPresets) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  }, [hasPresets]);
  const close = (0, import_react36.useCallback)(() => setIsOpen(false), []);
  const toggle2 = (0, import_react36.useCallback)(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);
  (0, import_react36.useEffect)(() => {
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
    TweakStore.selectPreset(panelId, presetId);
    close();
  };
  const handleDelete = (e, presetId) => {
    e.stopPropagation();
    TweakStore.removePreset(panelId, presetId);
  };
  const startEditing = (0, import_react36.useCallback)((presetId, name) => {
    setEditingId(presetId);
    setDraftName(name);
  }, []);
  const commitEdit = (0, import_react36.useCallback)(() => {
    if (editingId && draftName.trim()) {
      TweakStore.renamePreset(panelId, editingId, draftName);
    }
    setEditingId(null);
  }, [panelId, editingId, draftName]);
  (0, import_react36.useEffect)(() => {
    if (editSignal === lastEditSignal.current) return;
    const active = presets.find((p) => p.id === activePresetId);
    if (!active || !(active.renamable ?? true)) return;
    lastEditSignal.current = editSignal;
    open();
    startEditing(active.id, active.name);
  }, [editSignal, activePresetId, presets, open, startEditing]);
  (0, import_react36.useEffect)(() => {
    if (editingId) editInputRef.current?.select();
  }, [editingId]);
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "tweakers-preset-manager", children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-preset-trigger",
        onClick: toggle2,
        "data-open": String(isOpen),
        "data-has-preset": String(!!activePreset),
        "data-disabled": String(!hasPresets),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "tweakers-preset-label", children: activePreset ? activePreset.name : providerMode ? "Presets" : "Version 1" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            import_react37.motion.svg,
            {
              className: "tweakers-select-chevron",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.5",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              animate: { rotate: isOpen ? 180 : 0, opacity: hasPresets ? 0.6 : 0.25 },
              transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
              children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { d: ICON_CHEVRON })
            }
          )
        ]
      }
    ),
    (0, import_react_dom6.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_react37.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-root tweakers-preset-dropdown",
          style: { position: "fixed", top: pos.top, left: pos.left, minWidth: pos.width },
          initial: { opacity: 0, y: 4, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          children: [
            !providerMode && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
              "div",
              {
                className: "tweakers-preset-item",
                "data-active": String(!activePresetId),
                onClick: () => handleSelect(null),
                children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "tweakers-preset-name", children: "Version 1" })
              }
            ),
            presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
              "div",
              {
                className: "tweakers-preset-item",
                "data-active": String(preset.id === activePresetId),
                onClick: editingId === preset.id ? void 0 : () => handleSelect(preset.id),
                children: [
                  editingId === preset.id ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                    "input",
                    {
                      ref: editInputRef,
                      className: "tweakers-preset-name-input",
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
                  ) : /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "tweakers-preset-name", children: preset.name }),
                  editingId !== preset.id && (preset.renamable ?? true) && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                    "button",
                    {
                      className: "tweakers-preset-rename",
                      onClick: (e) => {
                        e.stopPropagation();
                        startEditing(preset.id, preset.name);
                      },
                      title: "Rename preset",
                      children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_PENCIL.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { d }, i)) })
                    }
                  ),
                  editingId !== preset.id && (preset.deletable ?? true) && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                    "button",
                    {
                      className: "tweakers-preset-delete",
                      onClick: (e) => handleDelete(e, preset.id),
                      title: "Delete preset",
                      children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_TRASH.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { d }, i)) })
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
var import_jsx_runtime37 = require("react/jsx-runtime");
function Panel({ panel, defaultOpen = true, inline = false, toolbarExtra }) {
  const [copied, setCopied] = (0, import_react38.useState)(false);
  const [, setIsPanelOpen] = (0, import_react38.useState)(defaultOpen);
  const values = (0, import_react38.useSyncExternalStore)(
    (cb) => TweakStore.subscribe(panel.id, cb),
    () => TweakStore.getValues(panel.id),
    () => TweakStore.getValues(panel.id)
  );
  const presets = TweakStore.getPresetItems(panel.id);
  const activePresetId = TweakStore.getActivePresetId(panel.id);
  const providerMode = TweakStore.hasPresetProvider(panel.id);
  const [presetEditSignal, setPresetEditSignal] = (0, import_react38.useState)(0);
  const handleAddPreset = () => {
    TweakStore.createPreset(panel.id);
    setPresetEditSignal((n) => n + 1);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopyInstruction("useTweakers", panel.name, values));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const { tabs, activeTab, looseControls, pageControls } = splitPanelTabs(panel.controls, values[TAB_PATH]);
  const tabBar = activeTab ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    SegmentedControl,
    {
      options: tabs.map((tab) => ({ value: tab.path, label: tab.label })),
      value: activeTab.path,
      onChange: (v) => TweakStore.updateValue(panel.id, TAB_PATH, v)
    }
  ) : void 0;
  const renderRows = (controls) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(ControlRenderer, { panelId: panel.id, controls, values });
  const renderControls = () => activeTab ? /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
    renderRows(looseControls),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "tweakers-panel-tab-page", children: renderRows(pageControls) }, activeTab.path)
  ] }) : renderRows(pageControls);
  const presetsHidden = TweakStore.arePresetsHidden(panel.id);
  const toolbar = presetsHidden ? toolbarExtra : /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      import_react39.motion.button,
      {
        className: "tweakers-toolbar-add",
        onClick: handleAddPreset,
        title: "Add preset",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: ICON_ADD_PRESET.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d }, i)) })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      import_react39.motion.button,
      {
        className: "tweakers-toolbar-add",
        onClick: handleCopy,
        title: "Copy parameters",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { style: { position: "relative", width: 14, height: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_react39.AnimatePresence, { initial: false, mode: "wait", children: copied ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          import_react39.motion.svg,
          {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: { position: "absolute", inset: 0, width: 14, height: 14, color: "var(--tweak-text-label)" },
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.08 },
            children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: ICON_CHECK })
          },
          "check"
        ) : /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
          import_react39.motion.svg,
          {
            viewBox: "0 0 24 24",
            fill: "none",
            style: { position: "absolute", inset: 0, width: 14, height: 14, color: "var(--tweak-text-label)" },
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
    toolbarExtra
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "tweakers-panel-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    Folder,
    {
      title: panel.name,
      defaultOpen,
      isRoot: true,
      inline,
      onOpenChange: setIsPanelOpen,
      toolbar,
      tabs: tabBar,
      enabled: panel.module ? values["_enabled"] : void 0,
      onEnabledChange: panel.module ? (v) => TweakStore.updateValue(panel.id, "_enabled", v) : void 0,
      children: renderControls()
    }
  ) });
}

// src/components/Timeline/TimelineToggleButton.tsx
var import_react40 = require("react");
var import_react41 = require("motion/react");

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
var import_jsx_runtime38 = require("react/jsx-runtime");
function TimelineToggleButton() {
  const subscribe = (0, import_react40.useCallback)(
    (listener) => TimelineUiStore.subscribe(listener),
    []
  );
  const getVisible = (0, import_react40.useCallback)(() => TimelineUiStore.getVisible(), []);
  const visible = (0, import_react40.useSyncExternalStore)(subscribe, getVisible, getVisible);
  const label = visible ? "Hide timeline" : "Show timeline";
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
    import_react41.motion.button,
    {
      className: "tweakers-toolbar-add tweakers-timeline-toolbar-toggle",
      "data-active": visible || void 0,
      "aria-pressed": visible,
      "aria-label": label,
      title: label,
      onClick: () => TimelineUiStore.toggle(),
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: ICON_TIMELINE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d, fill: "currentColor" }, i)) })
    }
  );
}

// src/components/TweakRoot.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
function TweakRoot({ position = "top-right", defaultOpen = true, mode = "popover", theme = "system", productionEnabled = isDevDefault, panels: only, chrome = "card" }) {
  if (!productionEnabled) return null;
  const [panels, setPanels] = (0, import_react42.useState)([]);
  const [timelineCount, setTimelineCount] = (0, import_react42.useState)(0);
  const [mounted, setMounted] = (0, import_react42.useState)(false);
  const inline = mode === "inline";
  const panelRef = (0, import_react42.useRef)(null);
  const [dragOffset, setDragOffset] = (0, import_react42.useState)(null);
  const [activePosition, setActivePosition] = (0, import_react42.useState)(position);
  const lastDragOffset = (0, import_react42.useRef)(null);
  const draggingRef = (0, import_react42.useRef)(false);
  const dragStartRef = (0, import_react42.useRef)(null);
  const didDragRef = (0, import_react42.useRef)(false);
  const onlyKey = Array.isArray(only) ? only.join("\0") : only;
  const read = (0, import_react42.useCallback)(
    () => TweakStore.selectPanels(onlyKey === void 0 ? void 0 : onlyKey.split("\0")),
    [onlyKey]
  );
  (0, import_react42.useEffect)(() => {
    setMounted(true);
    setPanels(read());
    setTimelineCount(TimelineStore.getTimelines().length);
    const unsubscribePanels = TweakStore.subscribeGlobal(() => {
      setPanels(read());
    });
    const unsubscribeTimelines = TimelineStore.subscribeGlobal(() => {
      setTimelineCount(TimelineStore.getTimelines().length);
    });
    return () => {
      unsubscribePanels();
      unsubscribeTimelines();
    };
  }, []);
  (0, import_react42.useEffect)(() => {
    if (!panelRef.current || inline) return;
    const observer = new MutationObserver(() => {
      const inner = panelRef.current?.querySelector(".tweakers-panel-inner");
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
  const handlePointerDown = (0, import_react42.useCallback)((e) => {
    const inner = panelRef.current?.querySelector(".tweakers-panel-inner");
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
  const handlePointerMove = (0, import_react42.useCallback)((e) => {
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
  const handlePointerUp = (0, import_react42.useCallback)((e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    dragStartRef.current = null;
    if (didDragRef.current) {
      e.stopPropagation();
      const inner = panelRef.current?.querySelector(".tweakers-panel-inner");
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
  if (panels.length === 0 && (onlyKey !== void 0 || timelineCount === 0)) {
    return null;
  }
  const dragStyle = dragOffset ? {
    top: dragOffset.y,
    left: dragOffset.x,
    right: "auto",
    bottom: "auto"
  } : void 0;
  const timelineToggle = timelineCount > 0 && onlyKey === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(TimelineToggleButton, {}) : null;
  const content = /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(ShortcutListener, { children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "tweakers-root", "data-mode": mode, "data-theme": theme, "data-chrome": chrome, children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    "div",
    {
      ref: panelRef,
      className: "tweakers-panel",
      "data-position": inline ? void 0 : dragOffset ? void 0 : activePosition,
      "data-mode": mode,
      style: dragStyle,
      onPointerDown: !inline ? handlePointerDown : void 0,
      onPointerMove: !inline ? handlePointerMove : void 0,
      onPointerUp: !inline ? handlePointerUp : void 0,
      children: panels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "tweakers-panel-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
        Folder,
        {
          title: "Tweakers",
          defaultOpen: inline || defaultOpen,
          isRoot: true,
          inline,
          toolbar: timelineToggle,
          children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "tweakers-timeline-toolkit-only", children: "Timeline" })
        }
      ) }) : panels.map((panel) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(Panel, { panel, defaultOpen: inline || defaultOpen, inline, toolbarExtra: timelineToggle }, panel.id))
    }
  ) }) });
  if (inline) {
    return content;
  }
  return (0, import_react_dom7.createPortal)(content, document.body);
}

// src/components/MovePanel.tsx
var import_react44 = require("react");
var import_react_dom8 = require("react-dom");

// src/components/CurveComposer.tsx
var import_react43 = require("react");
var import_jsx_runtime40 = require("react/jsx-runtime");
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
  const composition = (0, import_react43.useMemo)(
    () => ({ segments, driver, direction, gap }),
    [segments, driver, direction, gap]
  );
  const samplers = (0, import_react43.useMemo)(() => buildSamplers(composition), [composition]);
  const liveRef = (0, import_react43.useRef)({ composition, samplers, getPhase, phase, mode, triggerSteps });
  liveRef.current = { composition, samplers, getPhase, phase, mode, triggerSteps };
  const onTriggerRef = (0, import_react43.useRef)(onTrigger);
  onTriggerRef.current = onTrigger;
  const svgRef = (0, import_react43.useRef)(null);
  const seriesPlayheadRef = (0, import_react43.useRef)(null);
  const seriesDotRef = (0, import_react43.useRef)(null);
  const driverPlayheadRef = (0, import_react43.useRef)(null);
  const prevTrigValue = (0, import_react43.useRef)(Number.NaN);
  const [drag, setDrag] = (0, import_react43.useState)(null);
  const [hover, setHover] = (0, import_react43.useState)(null);
  const dragRef = (0, import_react43.useRef)(null);
  dragRef.current = drag;
  (0, import_react43.useEffect)(() => {
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
    const target = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT / rectW);
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
      const t = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT / rectW2);
      setHover(t.kind === "driver" ? { kind: "driver", index: 0 } : { kind: t.kind, index: t.index });
      return;
    }
    const svgRect = svgRef.current.getBoundingClientRect();
    const rectW = svgRect.width;
    const rectH = svgRect.height;
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
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
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("line", { x1: gx, y1: rect.y, x2: gx, y2: rect.y + rect.h, className: "tweakers-cc-grid" }, `g-${rect.y}-${i}`)
      );
    }
    return lines;
  };
  const renderLaneBg = (rect, key) => /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("rect", { className: "tweakers-cc-lane", x: rect.x, y: rect.y, width: rect.w, height: rect.h, rx: 8 }, key);
  const diagonal = (rect, span, key) => {
    const d = diagonalLine(rect, span, W);
    return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("line", { className: "tweakers-cc-diagonal", x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2 }, key);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("div", { className: "tweakers-cc-wrap", style: { width: W }, children: /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(
    "svg",
    {
      ref: svgRef,
      className: "tweakers-cc",
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
          return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
            "rect",
            {
              className: "tweakers-cc-seg-selected",
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
          return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
            "rect",
            {
              className: "tweakers-cc-seg-hover",
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
          return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("g", { children: [
            diagonal(mainRect, span, `diag-${i}`),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("path", { className: "tweakers-cc-curve", d: curvePath(seg, mainRect, span, W) }),
            /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("text", { className: "tweakers-cc-label", x: (span[0] + span[1]) * 0.5 * W, y: mainRect.y + 13, children: seg.type })
          ] }, `seg-${i}`);
        }),
        gap > 0 && timelineSlots(segments, gap).filter((slot) => slot.kind === "gap" && slot.b > slot.a).map((slot) => /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
          "path",
          {
            className: "tweakers-cc-connector",
            d: connectorPath(slot, samplers, segments.length, mainRect, W)
          },
          `conn-${slot.index}`
        )),
        interior.map((bx, i) => /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
          "line",
          {
            className: "tweakers-cc-boundary",
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
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("line", { ref: seriesPlayheadRef, className: "tweakers-cc-playhead", x1: 0, y1: mainRect.y, x2: 0, y2: mainRect.y + mainRect.h, style: { stroke: playheadColor } }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("circle", { ref: seriesDotRef, className: "tweakers-cc-dot", cx: 0, cy: mapY(mainRect, 0), r: 3, style: { fill: playheadColor } }),
        driverRect && /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(import_jsx_runtime40.Fragment, { children: [
          renderLaneBg(driverRect, "driver-bg"),
          renderLaneGrid(driverRect),
          hover?.kind === "driver" && !drag && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("rect", { className: "tweakers-cc-seg-hover", x: 0, y: driverRect.y, width: W, height: driverRect.h, rx: 8 }),
          diagonal(driverRect, [0, 1], "driver-diag"),
          /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("path", { className: "tweakers-cc-curve tweakers-cc-curve-driver", d: curvePath(driver, driverRect, [0, 1], W) }),
          /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("text", { className: "tweakers-cc-label", x: W * 0.5, y: driverRect.y + 13, children: [
            "driver \xB7 ",
            driver.type
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("line", { ref: driverPlayheadRef, className: "tweakers-cc-playhead", x1: 0, y1: driverRect.y, x2: 0, y2: driverRect.y + driverRect.h, style: { stroke: playheadColor } })
        ] })
      ]
    }
  ) });
}

// src/components/move-slots.tsx
var import_jsx_runtime41 = require("react/jsx-runtime");
function moveSlotKind(meta, opts = {}) {
  if (meta.type === "filter") return "filter";
  if (opts.stage) return "env";
  if (meta.type === "xy") return "xy";
  if (meta.type === "range") return "range";
  if (opts.enum) {
    if (opts.shape) return "curve";
    if (opts.glyph) return "icon";
    return "enum";
  }
  return opts.valueFirst ? "value" : "default";
}
function MoveSlotGlyph({ name, className }) {
  const paths = LUCIDE_ICONS[name];
  if (!paths) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
    "svg",
    {
      className,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: paths.map((d) => /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("path", { d }, d))
    }
  );
}
function MoveSlotReadout({ label, value }) {
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "tweakers-move-dial-readout", children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-label", "data-long": label.length > 9 || void 0, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-value", children: value })
  ] });
}
function MoveSlotShape({ d, className = "tweakers-move-dial-shape" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("svg", { className, viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("path", { d }) });
}
function MoveSlotDefaultBody({
  label,
  value,
  pct,
  originPct,
  atOrigin
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(import_jsx_runtime41.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(MoveSlotReadout, { label, value }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "tweakers-move-dial-bar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
        "div",
        {
          className: "tweakers-move-dial-fill",
          "data-zero": atOrigin || void 0,
          style: originPct != null ? { marginLeft: `${Math.min(pct, originPct)}%`, width: `${Math.abs(pct - originPct)}%` } : { width: `${pct}%` }
        }
      ),
      atOrigin && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-zero", style: { left: `${originPct}%` } })
    ] })
  ] });
}
var MOVE_ENUM_LIST_ROWS = 4;
function MoveSlotEnumBody({
  label,
  optionLabel,
  options,
  activeIdx,
  shape,
  glyph
}) {
  if (shape || glyph) {
    return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(import_jsx_runtime41.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-tag", children: label }),
      shape && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(MoveSlotShape, { d: shape }),
      glyph && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(MoveSlotGlyph, { name: glyph, className: "tweakers-move-dial-icon" }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-option", children: optionLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-dial-bar", children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-dial-enum", children: options.map((opt, j) => /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
        "span",
        {
          className: "tweakers-move-dial-enum-cell",
          "data-on": j === activeIdx || void 0
        },
        enumOptionValue(opt)
      )) }) })
    ] });
  }
  const start = Math.max(
    0,
    Math.min(activeIdx - (MOVE_ENUM_LIST_ROWS >> 1), options.length - MOVE_ENUM_LIST_ROWS)
  );
  const windowed = options.slice(start, start + MOVE_ENUM_LIST_ROWS);
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(import_jsx_runtime41.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-tag", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-enum-list", children: windowed.map((opt, j) => {
      const value = enumOptionValue(opt);
      const optLabel = typeof opt === "string" ? opt : opt.label;
      return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
        "span",
        {
          className: "tweakers-move-enum-row",
          "data-selected": start + j === activeIdx || void 0,
          children: optLabel
        },
        value
      );
    }) })
  ] });
}
function MoveSlotRangeBody({
  label,
  value,
  lo,
  hi
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(import_jsx_runtime41.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(MoveSlotReadout, { label, value }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-dial-bar", children: /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "tweakers-move-dial-range", children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
        "div",
        {
          className: "tweakers-move-dial-span",
          style: { left: `${lo * 100}%`, width: `${(hi - lo) * 100}%` }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-handle", style: { left: `${lo * 100}%` } }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-handle", style: { left: `${hi * 100}%` } })
    ] }) })
  ] });
}
function MoveSlotFilterBody({
  meta,
  value,
  shape
}) {
  const ca = resolveFilterAxis(meta.cutoffAxis, "cutoff");
  const ra = resolveFilterAxis(meta.resonanceAxis, "resonance");
  const fmt = (v, f) => f ? f(v) : Math.abs(v) >= 100 ? Math.round(v).toString() : Number(v.toFixed(2)).toString();
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(import_jsx_runtime41.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-filter-display", children: shape && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(MoveSlotShape, { d: shape, className: "tweakers-move-filter-shape" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "tweakers-move-filter-readout", "data-side": "cutoff", children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-label", children: ca.label }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-value", children: fmt(value.cutoff, ca.formatValue) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "tweakers-move-filter-readout", "data-side": "resonance", children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-label", children: ra.label }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-value", children: fmt(value.resonance, ra.formatValue) })
    ] })
  ] });
}
function MoveSlotEnvBody({
  points,
  stages,
  joints = []
}) {
  const d = points.map((v, i) => `${i === 0 ? "M" : "L"} ${i / (points.length - 1) * 100} ${100 - v * 100}`).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(import_jsx_runtime41.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "tweakers-move-env-display", children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(MoveSlotShape, { d, className: "tweakers-move-env-shape" }),
      joints.map((j) => /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
        "span",
        {
          className: "tweakers-move-env-handle",
          "data-held": j.held || void 0,
          style: {
            left: `${j.x * 100}%`,
            top: `calc(6px + (100% - 12px) * ${(1 - j.y).toFixed(4)})`
          }
        },
        j.stage
      ))
    ] }),
    stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("div", { className: "tweakers-move-env-readout", "data-stage": s.stage, children: [
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-label", children: s.label }),
      /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("span", { className: "tweakers-move-dial-value", children: s.value })
    ] }, s.stage))
  ] });
}
function MoveSlotScopeBody({
  label,
  value,
  pct,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(import_jsx_runtime41.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-scope-display", children }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(MoveSlotReadout, { label, value }),
    /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-dial-bar", children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-move-dial-fill", style: { width: `${pct}%` } }) })
  ] });
}
var MOVE_SLOT_LIBRARY = {
  default: { description: "name centred, value on touch, fill bar", component: MoveSlotDefaultBody },
  value: { description: "value-first: the value is the headline, the name a tag on top", component: MoveSlotDefaultBody },
  icon: { description: "option picker showing the current option as a glyph", component: MoveSlotEnumBody },
  curve: { description: "option picker drawing the current option\u2019s shape \u2014 curve selection", component: MoveSlotEnumBody },
  enum: { description: "option picker as a list screen at slot size, selection bright", component: MoveSlotEnumBody },
  range: { description: "two handles on one bar; volume knob is the second hand", component: MoveSlotRangeBody },
  filter: { description: "2 slots: cutoff + resonance as one response picture", component: MoveSlotFilterBody },
  env: { description: "4 slots: the whole ADSR as one shape, a caption per stage", component: MoveSlotEnvBody },
  scope: { description: "a dial with the live signal filling it behind the readout", component: MoveSlotScopeBody }
};

// src/move-surface-store.ts
var EMPTY = { rows: 0, pads: [], steps: null, screen: null };
var state = EMPTY;
var listeners2 = /* @__PURE__ */ new Set();
var pressListeners = /* @__PURE__ */ new Set();
var emit = () => {
  for (const fn of listeners2) fn();
};
function patch(key, value) {
  if (JSON.stringify(state[key]) === JSON.stringify(value)) return;
  state = { ...state, [key]: value };
  emit();
}
var MoveSurfaceStore = {
  getState: () => state,
  subscribe(fn) {
    listeners2.add(fn);
    return () => listeners2.delete(fn);
  },
  /** How many bottom pad rows the app took (matches `claims.pads` on the wire). */
  claimRows(rows) {
    patch("rows", rows);
  },
  setPads(pads) {
    patch("pads", pads.filter((p) => p.x >= 0 && p.x < 8 && (p.y === 0 || p.y === 1)));
  },
  setSteps(steps) {
    patch("steps", steps === null ? null : steps.filter((s) => s.step >= 0 && s.step < 16));
  },
  setScreen(screen) {
    patch("screen", screen);
  },
  /** A tap on an on-screen pad, for the host to treat like a hardware press. */
  onPress(fn) {
    pressListeners.add(fn);
    return () => pressListeners.delete(fn);
  },
  press(x, y) {
    for (const fn of pressListeners) fn({ x, y });
  },
  /** Hand the whole surface back — the panel returns to its plain layout. */
  reset() {
    if (state === EMPTY) return;
    state = EMPTY;
    emit();
  }
};

// src/move-volume.ts
var MoveVolumeDisplayClass = class {
  constructor() {
    this.state = null;
    this.listeners = /* @__PURE__ */ new Set();
  }
  /** Show the pill with this readout — replaces any previous one. */
  set(state2) {
    this.state = state2;
    this.notify();
  }
  /** Hide the pill. */
  clear() {
    this.state = null;
    this.notify();
  }
  /** The current readout, or null when the pill is hidden. */
  get() {
    return this.state;
  }
  /** Notified when the readout is set or cleared. */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  notify() {
    for (const l of this.listeners) l();
  }
};
var MoveVolumeDisplay = new MoveVolumeDisplayClass();

// src/components/MovePanel.tsx
var import_jsx_runtime42 = require("react/jsx-runtime");
var MOVE_TRACK_COLORS = ["#4274f4", "#d83dff", "#ff4d07", "#52bd06"];
var PAD_ROWS = 4;
var DIAL_TRACK_INSET = 10;
var ENUM_LIST_TOP = 26;
var ENUM_LIST_BOTTOM = 8;
var XY_INSET = { left: 8, top: 8, right: 9, bottom: 8 };
var XY_GRID_DEFAULT = 5;
var TAP_MS = 300;
function boldColons(text) {
  if (!text.includes(":")) return text;
  return text.split(":").flatMap(
    (part, i) => i === 0 ? [part] : [/* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-volume-sep", children: ":" }, `sep-${i}`), part]
  );
}
var MOVE_TOUCH_EVENT = "move-tweakers:touch";
var MOVE_OVERRIDE_EVENT = "move-tweakers:override";
var MOVE_LATCH_EVENT = "move-tweakers:latch";
var MOVE_PAGE_EVENT = "move-tweakers:page";
var MOVE_PAGE_SELECT_EVENT = "move-tweakers:page-select";
function MovePanel({ theme = "system", productionEnabled = isDevDefault, panels: only, dock = "viewport" }) {
  if (!productionEnabled) return null;
  const [panels, setPanels] = (0, import_react44.useState)([]);
  const [track, setTrack] = (0, import_react44.useState)(0);
  const [dragPath, setDragPath] = (0, import_react44.useState)(null);
  const [bendHeld, setBendHeld] = (0, import_react44.useState)(null);
  const bendRef = (0, import_react44.useRef)(null);
  const [handTouch, setHandTouch] = (0, import_react44.useState)({});
  const [hwHeld, setHwHeld] = (0, import_react44.useState)({});
  const [hwLatched, setHwLatched] = (0, import_react44.useState)({});
  const [held, setHeld] = (0, import_react44.useState)(null);
  const [latched, setLatched] = (0, import_react44.useState)({});
  const holdStart = (0, import_react44.useRef)(0);
  const [mounted, setMounted] = (0, import_react44.useState)(false);
  const fineRef = (0, import_react44.useRef)(null);
  const rangeHandleRef = (0, import_react44.useRef)("min");
  const filterHandRef = (0, import_react44.useRef)("cutoff");
  const [volume, setVolume] = (0, import_react44.useState)(() => MoveVolumeDisplay.get());
  const [liveValue, setLiveValue] = (0, import_react44.useState)(null);
  (0, import_react44.useEffect)(() => {
    setVolume(MoveVolumeDisplay.get());
    return MoveVolumeDisplay.subscribe(() => setVolume(MoveVolumeDisplay.get()));
  }, []);
  (0, import_react44.useEffect)(() => {
    const poll = volume?.getValue;
    if (!poll) {
      setLiveValue(null);
      return;
    }
    let raf = requestAnimationFrame(function tick() {
      setLiveValue(poll());
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [volume]);
  const onlyKey = Array.isArray(only) ? only.join(" ") : only;
  const read = (0, import_react44.useCallback)(
    () => TweakStore.selectPanels(onlyKey === void 0 ? void 0 : onlyKey.split(" ")),
    [onlyKey]
  );
  (0, import_react44.useEffect)(() => {
    setMounted(true);
    setPanels(read());
    return TweakStore.subscribeGlobal(() => setPanels(read()));
  }, [read]);
  const pages = buildMovePages(panels);
  const modSettings = ModulationStore.getSettings();
  const settingsPanel = modSettings ? TweakStore.getPanel(modSettings.panelId) : void 0;
  const modLayout = settingsPanel ? ModulationStore.getSettingsLayout() : null;
  const page = settingsPanel ? buildModMovePage(settingsPanel, modLayout) : pages[Math.min(track, Math.max(0, pages.length - 1))];
  const pageId = page?.panel.id;
  const modSlot = modSettings ? ModulationStore.getSlot(modSettings.index) : null;
  const composition = modSlot?.type === "curve" ? curveComposition(modSlot.params) : null;
  const clipIndex = composition ? Math.min(composition.segments.length - 1, Math.max(0, Math.round(Number(modSlot.params.selected) || 0))) : 0;
  const previewPath = modLayout?.dials.find((d) => d.preview)?.path ?? null;
  const values = (0, import_react44.useSyncExternalStore)(
    (0, import_react44.useCallback)((cb) => pageId ? TweakStore.subscribe(pageId, cb) : () => {
    }, [pageId]),
    () => pageId ? TweakStore.getValues(pageId) : void 0,
    () => void 0
  );
  const [, bumpControlState] = (0, import_react44.useState)(0);
  (0, import_react44.useEffect)(
    () => pageId ? TweakStore.subscribeControlState(pageId, () => bumpControlState((n) => n + 1)) : void 0,
    [pageId]
  );
  (0, import_react44.useSyncExternalStore)(
    (0, import_react44.useCallback)((cb) => ModulationStore.subscribe(cb), []),
    () => ModulationStore.getVersion(),
    () => 0
  );
  const surface = (0, import_react44.useSyncExternalStore)(
    (0, import_react44.useCallback)((cb) => MoveSurfaceStore.subscribe(cb), []),
    () => MoveSurfaceStore.getState(),
    () => MoveSurfaceStore.getState()
  );
  (0, import_react44.useEffect)(() => {
    const forPage = (detail, map) => detail && detail.pageId === pageId ? map ?? {} : {};
    const onTouch = (e) => {
      const d = e.detail;
      setHandTouch(forPage(d, d?.touched));
    };
    const onOverride = (e) => {
      const d = e.detail;
      setHwHeld(forPage(d, d?.held));
      setHwLatched(forPage(d, d?.latched));
    };
    window.addEventListener(MOVE_TOUCH_EVENT, onTouch);
    window.addEventListener(MOVE_OVERRIDE_EVENT, onOverride);
    return () => {
      window.removeEventListener(MOVE_TOUCH_EVENT, onTouch);
      window.removeEventListener(MOVE_OVERRIDE_EVENT, onOverride);
    };
  }, [pageId]);
  const pagesRef = (0, import_react44.useRef)(pages);
  pagesRef.current = pages;
  const sawSettings = (0, import_react44.useRef)(false);
  (0, import_react44.useEffect)(() => {
    const onPage = (e) => {
      const id = e.detail?.pageId;
      if (id === MOD_SETTINGS_PANEL) {
        sawSettings.current = true;
        return;
      }
      if (sawSettings.current) {
        sawSettings.current = false;
        ModulationStore.closeSettings();
      }
      const i = pagesRef.current.findIndex((pg) => pg.panel.id === id);
      if (i >= 0) setTrack(i);
    };
    window.addEventListener(MOVE_PAGE_EVENT, onPage);
    return () => window.removeEventListener(MOVE_PAGE_EVENT, onPage);
  }, []);
  (0, import_react44.useEffect)(() => {
    setHeld(null);
    setLatched({});
  }, [pageId]);
  if (!mounted || typeof window === "undefined" || pages.length === 0 || !page || !values) return null;
  const dialPercent = (meta) => Math.round(normalizeDial(meta, values[meta.path]) * 100);
  const chipValue = (meta) => {
    if (isEnumDial(meta)) {
      const options = meta.options ?? [];
      return { num: String(enumOptionLabel(options[enumIndex(meta, values[meta.path])])) };
    }
    const n = Number(values[meta.path]);
    if (!Number.isFinite(n)) return { num: "" };
    if (meta.formatValue) return { num: meta.formatValue(n) };
    const num = Math.abs(n) >= 100 ? Math.round(n).toString() : Number(n.toFixed(2)).toString();
    return { num, unit: meta.unit };
  };
  const fineAnchor = (e, snapshot) => {
    if (e.shiftKey ? !fineRef.current?.shift : fineRef.current?.shift) {
      fineRef.current = { shift: e.shiftKey, x: e.clientX, y: e.clientY, v: snapshot() };
    }
    return fineRef.current;
  };
  const dialFromPointer = (e, meta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const span = rect.width - DIAL_TRACK_INSET * 2;
    const fine = fineAnchor(e, () => normalizeDial(meta, values[meta.path]));
    const v01 = fine ? fineDragValue({ startValue: fine.v, startPos: fine.x, pos: e.clientX, extentPx: span || 1, min: 0, max: 1, factor: fine.shift ? 0.1 : 1 }) : Math.min(1, Math.max(0, (e.clientX - rect.left - DIAL_TRACK_INSET) / (span || 1)));
    TweakStore.updateValue(page.panel.id, meta.path, denormalizeDial(meta, v01));
  };
  const xyFromPointer = (e, meta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width - XY_INSET.left - XY_INSET.right;
    const h = rect.height - XY_INSET.top - XY_INSET.bottom;
    const xa = resolveAxis(meta.xAxis);
    const ya = resolveAxis(meta.yAxis);
    const fine = fineAnchor(
      e,
      () => pointFromValue(normalizeValue(values[meta.path], xa, ya), xa, ya)
    );
    let px, py;
    if (fine) {
      const a = fine.v;
      const factor = fine.shift ? 0.1 : 1;
      px = fineDragValue({ startValue: a.x, startPos: fine.x, pos: e.clientX, extentPx: w || 1, min: 0, max: 1, factor });
      py = fineDragValue({ startValue: a.y, startPos: fine.y, pos: e.clientY, extentPx: h || 1, min: 0, max: 1, factor });
    } else {
      px = Math.min(1, Math.max(0, (e.clientX - rect.left - XY_INSET.left) / (w || 1)));
      py = Math.min(1, Math.max(0, (e.clientY - rect.top - XY_INSET.top) / (h || 1)));
    }
    const raw = valueFromPoint({ x: px, y: py }, xa, ya, !!meta.snap);
    const origin = pointFromValue(centerValue(xa, ya), xa, ya);
    TweakStore.updateValue(page.panel.id, meta.path, {
      x: applyDetentAxis(raw.x, xa, Math.abs(px - origin.x) * (w || 1)),
      y: applyDetentAxis(raw.y, ya, Math.abs(py - origin.y) * (h || 1))
    });
  };
  const xyRelease = (meta) => {
    setDragPath(null);
    fineRef.current = null;
    if (!meta.returnToCenter) return;
    const xa = resolveAxis(meta.xAxis);
    const ya = resolveAxis(meta.yAxis);
    TweakStore.updateValue(page.panel.id, meta.path, normalizeValue(centerValue(xa, ya), xa, ya, !!meta.snap));
  };
  const rangeFromPointer = (e, meta, down) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const span = rect.width - DIAL_TRACK_INSET * 2;
    const cur = normalizeRangeDial(meta, values[meta.path]);
    let p01 = Math.min(1, Math.max(0, (e.clientX - rect.left - DIAL_TRACK_INSET) / (span || 1)));
    if (down) rangeHandleRef.current = nearestHandle(p01, { min: cur.lo, max: cur.hi });
    const fine = fineAnchor(e, () => cur);
    if (fine) {
      const a = fine.v;
      p01 = fineDragValue({
        startValue: rangeHandleRef.current === "min" ? a.lo : a.hi,
        startPos: fine.x,
        pos: e.clientX,
        extentPx: span || 1,
        min: 0,
        max: 1,
        factor: fine.shift ? 0.1 : 1
      });
    }
    const next = rangeHandleRef.current === "min" ? { lo: Math.min(p01, cur.hi), hi: cur.hi } : { lo: cur.lo, hi: Math.max(p01, cur.lo) };
    TweakStore.updateValue(page.panel.id, meta.path, denormalizeRangeDial(meta, next.lo, next.hi));
  };
  const filterFromPointer = (e, meta, down) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const half = rect.width / 2;
    if (down) filterHandRef.current = e.clientX - rect.left < half ? "cutoff" : "resonance";
    const hand = filterHandRef.current;
    const left = hand === "cutoff" ? rect.left + DIAL_TRACK_INSET : rect.left + half;
    const span = half - DIAL_TRACK_INSET;
    const cur = normalizeFilterDial(meta, values[meta.path]);
    const fine = fineAnchor(e, () => cur);
    let v01;
    if (fine) {
      const a = fine.v;
      v01 = fineDragValue({
        startValue: hand === "cutoff" ? a.cutoff : a.resonance,
        startPos: fine.x,
        pos: e.clientX,
        extentPx: span || 1,
        min: 0,
        max: 1,
        factor: fine.shift ? 0.1 : 1
      });
    } else {
      v01 = Math.min(1, Math.max(0, (e.clientX - left) / (span || 1)));
    }
    const next = hand === "cutoff" ? denormalizeFilterDial(meta, v01, cur.resonance) : denormalizeFilterDial(meta, cur.cutoff, v01);
    TweakStore.updateValue(page.panel.id, meta.path, next);
  };
  const enumFromPointer = (e, meta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const span = rect.width - DIAL_TRACK_INSET * 2;
    const v01 = Math.min(1, Math.max(0, (e.clientX - rect.left - DIAL_TRACK_INSET) / (span || 1)));
    TweakStore.updateValue(page.panel.id, meta.path, denormalizeEnumDial(meta, v01));
  };
  const enumListFromPointer = (e, meta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const top = rect.top + ENUM_LIST_TOP;
    const span = rect.height - ENUM_LIST_TOP - ENUM_LIST_BOTTOM;
    const v01 = Math.min(1, Math.max(0, (e.clientY - top) / (span || 1)));
    TweakStore.updateValue(page.panel.id, meta.path, denormalizeEnumDial(meta, v01));
  };
  const dialReading = (meta) => {
    if (dialOrigin(meta) <= 0) return `${dialPercent(meta)}%`;
    const n = Number(values[meta.path]);
    if (!Number.isFinite(n)) return "";
    if (meta.formatValue) return meta.formatValue(n);
    const num = Math.abs(n) >= 100 ? Math.round(n).toString() : Number(n.toFixed(2)).toString();
    return n > 0 ? `+${num}` : num;
  };
  const rangeReading = (meta) => {
    const v = values[meta.path] ?? {};
    const fmt = (n) => {
      if (n == null || !Number.isFinite(n)) return "";
      if (meta.formatValue) return meta.formatValue(n);
      return Math.abs(n) >= 100 ? Math.round(n).toString() : Number(n.toFixed(2)).toString();
    };
    return `${fmt(v.min)}\u2013${fmt(v.max)}`;
  };
  const chipLatched = (col, meta) => latched[col]?.path === meta.path || !!hwLatched[meta.path];
  const modColorFor = (path) => {
    const a = ModulationStore.getAssignment(page.panel.id, path);
    return a && ModulationStore.getSlot(a.slot) ? modColor(a.slot) : null;
  };
  const armMod = (path) => ModulationStore.noteTouch(page.panel.id, path);
  const ModDot = ({ path, pad }) => {
    const c = modColorFor(path);
    if (!c) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: pad ? "tweakers-move-pad-mod" : "tweakers-move-dial-mod", style: { background: c } });
  };
  const dialAt = (col) => {
    if (held && held.col === col) return held.meta;
    const hw = page.values[col];
    if (hw && hwHeld[hw.path]) return hw;
    if (latched[col]) return latched[col];
    if (hw && hwLatched[hw.path]) return hw;
    return page.dials[col];
  };
  const pressChip = (e, col, meta) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
    }
    holdStart.current = Date.now();
    armMod(meta.path);
    setHeld({ col, meta });
  };
  const releaseChip = (col, meta) => {
    setHeld(null);
    if (Date.now() - holdStart.current >= TAP_MS) return;
    const wasLatched = chipLatched(col, meta);
    setLatched((prev) => ({ ...prev, [col]: wasLatched ? void 0 : meta }));
    window.dispatchEvent(new CustomEvent(MOVE_LATCH_EVENT, {
      detail: { pageId: page.panel.id, path: meta.path, latched: !wasLatched }
    }));
  };
  const appRows = surface.rows;
  const padRows = movePadRows(page, appRows);
  const appRowAt = (row) => moveAppPadRow(row, appRows);
  const padAt = (x, y) => surface.pads.find((p) => p.x === x && p.y === y);
  const visibleCols = settingsPanel ? Array.from({ length: modPageWidth() }, (_, i) => i) : appRows > 0 ? Array.from({ length: MOVE_PADS }, (_, i) => i) : visibleColumns(page);
  const volumeReading = liveValue ?? volume?.value;
  const headerCluster = volume && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-actions", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-move-volume", children: [
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-volume-tick", style: { background: MOVE_TRACK_COLORS[0] } }),
    volume.label && volumeReading != null && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-volume-label", children: volume.label }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-volume-value", children: boldColons(volumeReading ?? volume.label ?? "") })
  ] }) });
  const content = /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-root tweakers-move-root", "data-theme": theme, "data-dock": dock, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-move", "data-dock": dock, "data-overlay": composition ? true : void 0, children: [
    composition && modSettings && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      MoveCurveComposer,
      {
        index: modSettings.index,
        segments: composition.segments,
        direction: composition.direction,
        gap: composition.gap ?? 0,
        selected: clipIndex
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-move-inner", style: { "--move-cols": visibleCols.length || MOVE_DIALS }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-move-tracks", children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-tracks-group", children: pages.map((pg, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
          "button",
          {
            className: "tweakers-move-track",
            "data-active": pg === page,
            onClick: () => {
              ModulationStore.closeSettings();
              setTrack(i);
              window.dispatchEvent(new CustomEvent(MOVE_PAGE_SELECT_EVENT, { detail: { pageId: pg.panel.id } }));
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-track-marker", style: { background: MOVE_TRACK_COLORS[i] } }),
              /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-track-label", children: pg.panel.name })
            ]
          },
          pg.panel.id
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-mods", children: surface.steps ? surface.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-mod", title: `step ${s.step + 1}`, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          "span",
          {
            className: "tweakers-move-mod-dot",
            style: { background: s.color ?? "var(--move-text)", opacity: s.lit ? 1 : 0.25 }
          }
        ) }, s.step)) : ModulationStore.getSlots().map((slot) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(MoveModCircle, { slot }, slot.index)) }),
        headerCluster
      ] }),
      visibleCols.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-move-grid", children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-dials", children: visibleCols.map((i) => {
          if (isSpanContinuation(page, i)) return null;
          const meta = page.dials[i]?.type === "filter" ? page.dials[i] : dialAt(i);
          if (!meta) return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-dial", "data-empty": "true" }, `empty-${i}`);
          const active = dragPath === meta.path || !!handTouch[meta.path] || !!hwHeld[meta.path] || held !== null && held.col === i;
          const valueFirst = !!settingsPanel && !(meta.min === 0 && meta.max === 1);
          if (meta.type === "filter") {
            const fv = normalizeFilterValue(
              values[meta.path],
              resolveFilterAxis(meta.cutoffAxis, "cutoff"),
              resolveFilterAxis(meta.resonanceAxis, "resonance")
            );
            const shape = filterShapePath(meta, values[meta.path]);
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "div",
              {
                className: "tweakers-move-dial",
                "data-kind": "filter",
                "data-active": active || void 0,
                "data-disabled": meta.filterEnabled === false || void 0,
                onPointerDown: (e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                  }
                  fineRef.current = null;
                  setDragPath(meta.path);
                  armMod(meta.path);
                  filterFromPointer(e, meta, true);
                },
                onPointerMove: (e) => {
                  if (dragPath === meta.path) filterFromPointer(e, meta, false);
                },
                onPointerUp: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                onPointerCancel: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: meta.path }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(MoveSlotFilterBody, { meta, value: fv, shape })
                ]
              },
              meta.path
            );
          }
          if (meta.type === "xy") {
            const xa = resolveAxis(meta.xAxis);
            const ya = resolveAxis(meta.yAxis);
            const pos = pointFromValue(
              normalizeValue(values[meta.path], xa, ya),
              xa,
              ya
            );
            const preview = meta.path === previewPath ? ModulationStore.getSettingsPreview() : null;
            const gridBase = meta.grid === false ? 0 : typeof meta.grid === "number" ? meta.grid : XY_GRID_DEFAULT;
            const gridN = gridBase > 0 ? Math.round(gridBase * Math.max(0, meta.density ?? 1)) : 0;
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "div",
              {
                className: "tweakers-move-dial",
                "data-kind": "xy",
                "data-preview": preview ? true : void 0,
                "data-sub": valueFirst || void 0,
                "data-active": active || void 0,
                onPointerDown: (e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                  }
                  fineRef.current = null;
                  setDragPath(meta.path);
                  armMod(meta.path);
                  xyFromPointer(e, meta);
                },
                onPointerMove: (e) => {
                  if (dragPath === meta.path) xyFromPointer(e, meta);
                },
                onPointerUp: () => xyRelease(meta),
                onPointerCancel: () => xyRelease(meta),
                children: [
                  valueFirst && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-dial-sub", children: meta.label }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: meta.path }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-xy", children: preview ? /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                    "svg",
                    {
                      className: "tweakers-move-xy-curve",
                      viewBox: "0 0 100 100",
                      preserveAspectRatio: "none",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: previewPathData(preview.points) })
                    }
                  ) : /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
                    gridN > 0 && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                      "span",
                      {
                        className: "tweakers-move-xy-grid",
                        style: {
                          "--tweak-xy-grid-step-x": `${100 / gridN}%`,
                          "--tweak-xy-grid-step-y": `${100 / gridN}%`
                        }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-xy-line", "data-axis": "x", style: { top: `${pos.y * 100}%` } }),
                    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-xy-line", "data-axis": "y", style: { left: `${pos.x * 100}%` } }),
                    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-xy-dot", style: { left: `${pos.x * 100}%`, top: `${pos.y * 100}%` } })
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-move-dial-readout", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-dial-label", "data-long": meta.label.length > 9 || void 0, children: meta.label }),
                    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-dial-value", children: preview ? preview.label : `${Math.round(pos.x * 100)}\xB7${Math.round((1 - pos.y) * 100)}` })
                  ] })
                ]
              },
              meta.path
            );
          }
          if (meta.type === "range") {
            const pos = normalizeRangeDial(meta, values[meta.path]);
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "div",
              {
                className: "tweakers-move-dial",
                "data-kind": "range",
                "data-active": active || void 0,
                onPointerDown: (e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                  }
                  fineRef.current = null;
                  setDragPath(meta.path);
                  armMod(meta.path);
                  rangeFromPointer(e, meta, true);
                },
                onPointerMove: (e) => {
                  if (dragPath === meta.path) rangeFromPointer(e, meta, false);
                },
                onPointerUp: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                onPointerCancel: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: meta.path }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(MoveSlotRangeBody, { label: meta.label, value: rangeReading(meta), lo: pos.lo, hi: pos.hi })
                ]
              },
              meta.path
            );
          }
          if (isEnumDial(meta)) {
            const options = meta.options ?? [];
            const activeIdx = enumIndex(meta, values[meta.path]);
            const option = options[activeIdx];
            const optionLabel = enumOptionLabel(option);
            const shape = enumShapePath(meta, values[meta.path]);
            const glyph = enumOptionIcon(option);
            const pickFromPointer = shape || glyph ? enumFromPointer : enumListFromPointer;
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "div",
              {
                className: "tweakers-move-dial",
                "data-kind": "enum",
                "data-shape": shape ? true : void 0,
                "data-list": !shape && !glyph ? true : void 0,
                "data-active": active || void 0,
                onPointerDown: (e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                  }
                  fineRef.current = null;
                  setDragPath(meta.path);
                  armMod(meta.path);
                  pickFromPointer(e, meta);
                },
                onPointerMove: (e) => {
                  if (dragPath === meta.path) pickFromPointer(e, meta);
                },
                onPointerUp: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                onPointerCancel: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: meta.path }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                    MoveSlotEnumBody,
                    {
                      label: meta.label,
                      optionLabel,
                      options,
                      activeIdx,
                      shape,
                      glyph
                    }
                  )
                ]
              },
              meta.path
            );
          }
          const scopeSlot = settingsPanel ? modLayout?.dials.find((d) => d.path === meta.path)?.scope : void 0;
          if (scopeSlot && modSettings) {
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "div",
              {
                className: "tweakers-move-dial",
                "data-kind": "scope",
                "data-active": active || void 0,
                onPointerDown: (e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                  }
                  fineRef.current = null;
                  setDragPath(meta.path);
                  armMod(meta.path);
                  dialFromPointer(e, meta);
                },
                onPointerMove: (e) => {
                  if (dragPath === meta.path) dialFromPointer(e, meta);
                },
                onPointerUp: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                onPointerCancel: () => {
                  setDragPath(null);
                  fineRef.current = null;
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: meta.path }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                    MoveSlotScopeBody,
                    {
                      label: meta.label,
                      value: chipValue(meta).num + (meta.unit ? ` ${meta.unit}` : ""),
                      pct: dialPercent(meta),
                      children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(MoveScope, { index: modSettings.index })
                    }
                  )
                ]
              },
              meta.path
            );
          }
          const envStage = settingsPanel ? modLayout?.dials.find((d) => d.path === meta.path)?.stage : void 0;
          if (envStage) {
            const stageDials = (modLayout?.dials ?? []).filter((d) => d.stage).flatMap((d) => {
              const m = page.dials.find((x) => x?.path === d.path);
              return m ? [{ stage: d.stage, meta: m }] : [];
            });
            if (stageDials[0]?.meta.path !== meta.path) return null;
            const envParams = {
              attack: Number(values.attack) || 0,
              decay: Number(values.decay) || 0,
              sustain: Number(values.sustain) || 0,
              release: Number(values.release) || 0,
              attackCurve: Number(modSlot?.params.attackCurve) || 0,
              decayCurve: Number(modSlot?.params.decayCurve) || 0,
              releaseCurve: Number(modSlot?.params.releaseCurve) || 0
            };
            const envActive = stageDials.some(
              (s) => dragPath === s.meta.path || !!handTouch[s.meta.path] || !!hwHeld[s.meta.path]
            );
            const reading = (m) => {
              const v = chipValue(m);
              return `${v.num}${v.unit ? ` ${v.unit}` : ""}`;
            };
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "div",
              {
                className: "tweakers-move-dial",
                "data-kind": "env",
                "data-active": envActive || void 0,
                style: { gridColumn: `span ${stageDials.length}` },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                    MoveSlotEnvBody,
                    {
                      points: envelopePoints(envParams, 129),
                      stages: stageDials.map((s) => ({ stage: s.stage, label: s.meta.label, value: reading(s.meta) })),
                      joints: envelopeJoints(envParams).map((j) => ({ ...j, held: bendHeld === j.stage }))
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-env-zones", children: stageDials.map(({ meta: m }) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                    "div",
                    {
                      className: "tweakers-move-env-zone",
                      onPointerDown: (e) => {
                        try {
                          e.currentTarget.setPointerCapture(e.pointerId);
                        } catch {
                        }
                        fineRef.current = null;
                        setDragPath(m.path);
                        armMod(m.path);
                        dialFromPointer(e, m);
                      },
                      onPointerMove: (e) => {
                        if (dragPath === m.path) dialFromPointer(e, m);
                      },
                      onPointerUp: () => {
                        setDragPath(null);
                        fineRef.current = null;
                      },
                      onPointerCancel: () => {
                        setDragPath(null);
                        fineRef.current = null;
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: m.path })
                    },
                    m.path
                  )) })
                ]
              },
              meta.path
            );
          }
          const latchedHere = latched[i]?.path === meta.path || page.values[i]?.path === meta.path && !!hwLatched[meta.path];
          const origin01 = dialOrigin(meta);
          const originPct = origin01 > 0 ? origin01 * 100 : null;
          const pct = dialPercent(meta);
          const atOrigin = originPct != null && Math.abs(normalizeDial(meta, values[meta.path]) - origin01) < 1e-6;
          const subbed = meta !== page.dials[i];
          const subValue = subbed || valueFirst ? chipValue(meta) : null;
          return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
            "div",
            {
              className: "tweakers-move-dial",
              "data-active": active || void 0,
              "data-latched": latchedHere || void 0,
              "data-sub": subbed || valueFirst || void 0,
              onPointerDown: (e) => {
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                }
                fineRef.current = null;
                setDragPath(meta.path);
                armMod(meta.path);
                dialFromPointer(e, meta);
              },
              onPointerMove: (e) => {
                if (dragPath === meta.path) dialFromPointer(e, meta);
              },
              onPointerUp: () => {
                setDragPath(null);
                fineRef.current = null;
              },
              onPointerCancel: () => {
                setDragPath(null);
                fineRef.current = null;
              },
              children: [
                (subbed || valueFirst) && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-dial-sub", children: meta.label }),
                /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: meta.path }),
                /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                  MoveSlotDefaultBody,
                  {
                    label: meta.label,
                    value: subValue ? `${subValue.num}${subValue.unit ? ` ${subValue.unit}` : ""}` : dialReading(meta),
                    pct,
                    originPct,
                    atOrigin
                  }
                )
              ]
            },
            meta.path
          );
        }) }),
        Array.from({ length: PAD_ROWS }, (_, row) => row).filter((row) => appRowAt(row) !== null || padRows.slice(row).some((r) => r.length > 0)).map((row) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-pads", children: visibleCols.map((col) => {
          const appRow = appRowAt(row);
          if (appRow !== null) {
            const cell = padAt(col, appRow);
            if (!cell || cell.empty) {
              return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-pad", "data-empty": "true" }, `app-${col}`);
            }
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "button",
              {
                className: "tweakers-move-pad",
                "data-kind": "app",
                "data-on": cell.lit || void 0,
                onClick: () => MoveSurfaceStore.press(col, appRow),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                    "span",
                    {
                      className: "tweakers-move-pad-indicator",
                      style: cell.color ? { background: cell.color } : void 0
                    }
                  ),
                  cell.label && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-title", children: cell.label })
                ]
              },
              `app-${col}`
            );
          }
          const meta = padRows[row][col];
          const bendStage = !meta && settingsPanel && padRows[row] === page.toggles && modSettings ? modLayout?.dials[col]?.stage : void 0;
          if (bendStage && ENV_BEND_STAGES.includes(bendStage)) {
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "button",
              {
                className: "tweakers-move-pad",
                "data-kind": "bend",
                "data-on": bendHeld === bendStage || void 0,
                onPointerDown: (e) => {
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                  }
                  setBendHeld(bendStage);
                  bendRef.current = {
                    y: e.clientY,
                    curve: Number(modSlot?.params[envCurveParam(bendStage)]) || 0
                  };
                },
                onPointerMove: (e) => {
                  if (bendHeld !== bendStage || !bendRef.current) return;
                  const v = Math.min(1, Math.max(
                    -1,
                    bendRef.current.curve + (bendRef.current.y - e.clientY) / 60
                  ));
                  ModulationStore.updateSlotParams(modSettings.index, { [envCurveParam(bendStage)]: v });
                },
                onPointerUp: () => {
                  setBendHeld(null);
                  bendRef.current = null;
                },
                onPointerCancel: () => {
                  setBendHeld(null);
                  bendRef.current = null;
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-indicator" }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-title", children: "Curve" })
                ]
              },
              `bend-${bendStage}`
            );
          }
          if (!meta) return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-pad", "data-empty": "true" }, `empty-${col}`);
          if (padRows[row] === page.toggles) {
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              "button",
              {
                className: "tweakers-move-pad",
                "data-kind": "toggle",
                "data-on": !!values[meta.path],
                onClick: () => TweakStore.updateValue(page.panel.id, meta.path, !values[meta.path]),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-indicator" }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-title", children: meta.label })
                ]
              },
              meta.path
            );
          }
          if (padRows[row] === page.actions) {
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
              "button",
              {
                className: "tweakers-move-pad",
                "data-kind": "action",
                onClick: () => TweakStore.triggerAction(page.panel.id, meta.path),
                children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-title", children: meta.label })
              },
              meta.path
            );
          }
          const value = chipValue(meta);
          return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
            "button",
            {
              className: "tweakers-move-pad",
              "data-kind": "value",
              "data-held": held !== null && held.meta.path === meta.path || hwHeld[meta.path] || void 0,
              "data-latched": chipLatched(col, meta) || void 0,
              onPointerDown: (e) => pressChip(e, col, meta),
              onPointerUp: () => releaseChip(col, meta),
              onPointerCancel: () => setHeld(null),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ModDot, { path: meta.path, pad: true }),
                /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-title", children: meta.label }),
                /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("span", { className: "tweakers-move-pad-reading", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-move-pad-number", children: value.num }),
                  value.unit && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { children: value.unit })
                ] })
              ]
            },
            meta.path
          );
        }) }, row))
      ] })
    ] })
  ] }) });
  return dock === "flow" ? content : (0, import_react_dom8.createPortal)(content, document.body);
}
function previewPathData(points) {
  if (points.length < 2) return "";
  return points.map((v, i) => `${i ? "L" : "M"} ${(i / (points.length - 1) * 100).toFixed(2)} ${((1 - v) * 100).toFixed(2)}`).join(" ");
}
var MOVE_CURVE_WIDTH = 320;
var MOVE_CURVE_HEIGHT = 84;
function MoveCurveComposer({
  index,
  segments,
  direction,
  gap,
  selected
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-move-curve", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
    CurveComposer,
    {
      segments,
      direction,
      gap,
      selectedIndex: selected,
      getPhase: () => ModulationStore.getSlotPhase(index),
      onSelect: (i) => ModulationStore.updateSlotParams(index, { selected: i }),
      onSegmentsChange: (next) => ModulationStore.updateSlotParams(index, { clips: next }),
      width: MOVE_CURVE_WIDTH,
      height: MOVE_CURVE_HEIGHT
    }
  ) });
}
var SCOPE_SAMPLES = 120;
function MoveScope({ index }) {
  const ref = (0, import_react44.useRef)(null);
  (0, import_react44.useEffect)(() => {
    const now = (ModulationStore.getSignal(index) + 1) / 2;
    const pts = Array(SCOPE_SAMPLES).fill(now);
    let raf = requestAnimationFrame(function tick() {
      pts.push((ModulationStore.getSignal(index) + 1) / 2);
      pts.shift();
      ref.current?.setAttribute("d", previewPathData(pts));
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [index]);
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
    "svg",
    {
      className: "tweakers-move-scope-wave",
      "data-scope": "true",
      viewBox: "0 0 100 100",
      preserveAspectRatio: "none",
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { ref })
    }
  );
}
function MoveModCircle({ slot }) {
  const dotRef = (0, import_react44.useRef)(null);
  const pressAt = (0, import_react44.useRef)(0);
  (0, import_react44.useEffect)(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    return ModulationStore.subscribeFrames(() => {
      const el = dotRef.current;
      if (!el) return;
      const level = (ModulationStore.getSignal(slot.index) + 1) / 2;
      el.style.transform = `scale(${(0.66 + 0.34 * level).toFixed(3)})`;
    });
  }, [slot.index]);
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
    "button",
    {
      type: "button",
      className: "tweakers-move-mod",
      title: `${slot.type.toUpperCase()} \xB7 step ${slot.index + 1}`,
      onPointerDown: () => {
        pressAt.current = Date.now();
      },
      onPointerUp: () => {
        const tapped = Date.now() - pressAt.current < TAP_MS;
        if (tapped && ModulationStore.assignFromStep(slot.index).action !== "none") return;
        const open = ModulationStore.getSettings();
        if (tapped && open && open.index === slot.index) ModulationStore.closeSettings();
        else ModulationStore.openSettings(slot.index);
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
        "span",
        {
          ref: dotRef,
          className: "tweakers-move-mod-dot",
          style: { background: modColor(slot.index) }
        }
      )
    }
  );
}

// src/components/MoveActionButton.tsx
var import_react45 = require("react");

// src/move-functions.ts
var MOVE_FUNCTION_MANIFEST = [
  { name: "play" },
  { name: "rec" },
  { name: "mute" },
  { name: "undo" },
  { name: "copy" },
  { name: "delete" },
  { name: "up" },
  { name: "down" },
  { name: "left" },
  { name: "right" },
  { name: "sample", special: true },
  { name: "loop", special: true },
  { name: "capture", special: true },
  { name: "menu", special: true },
  { name: "back", special: true },
  { name: "jog_click", special: true }
];
var MOVE_FUNCTION_BUTTONS = MOVE_FUNCTION_MANIFEST.map((b) => b.name);
var MOVE_SPECIAL_BUTTONS = MOVE_FUNCTION_MANIFEST.filter((b) => "special" in b && b.special).map((b) => b.name);
var MoveFunctionsClass = class {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
    this.labels = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.runListeners = /* @__PURE__ */ new Set();
  }
  /**
   * Attach an action to a function button; returns a detach function.
   * One action per button — attaching again replaces the previous one.
   */
  attach(name, handler, options) {
    if (!MOVE_FUNCTION_BUTTONS.includes(name)) {
      console.warn(`[tweakers] "${name}" is not a Move function button; expected one of: ${MOVE_FUNCTION_BUTTONS.join(", ")}`);
      return () => {
      };
    }
    this.handlers.set(name, handler);
    if (options?.label != null) this.labels.set(name, options.label);
    else this.labels.delete(name);
    this.notify();
    return () => {
      if (this.handlers.get(name) === handler) {
        this.handlers.delete(name);
        this.labels.delete(name);
        this.notify();
      }
    };
  }
  /** The attached button names — what the kit claims on the hardware. */
  list() {
    return [...this.handlers.keys()];
  }
  /** The screen name an attachment carries, if any. */
  label(name) {
    return this.labels.get(name);
  }
  /** Run the action attached to a button, if any. Called by the kit per press. */
  run(name, press) {
    const full = { name, shift: !!press?.shift };
    this.handlers.get(name)?.(full);
    for (const l of this.runListeners) l(name, full);
  }
  /** Notified when attachments change, so the kit can reconfigure the Move. */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /** Notified on every run — the MovePanel flashes its pills on hardware presses. */
  subscribeRuns(listener) {
    this.runListeners.add(listener);
    return () => this.runListeners.delete(listener);
  }
  notify() {
    for (const l of this.listeners) l();
  }
};
var MoveFunctions = new MoveFunctionsClass();

// src/components/MoveActionButton.tsx
var import_jsx_runtime43 = require("react/jsx-runtime");
var PRESS_FLASH_MS = 160;
var KIND_FUNCTION = {
  enter: "jog_click",
  capture: "capture"
};
function MoveActionButton({ kind, children, onPress, disabled, className }) {
  const name = kind === "shift" ? null : KIND_FUNCTION[kind];
  const [pressed, setPressed] = (0, import_react45.useState)(false);
  const flashTimer = (0, import_react45.useRef)(void 0);
  const flash = () => {
    setPressed(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setPressed(false), PRESS_FLASH_MS);
  };
  (0, import_react45.useEffect)(() => {
    if (!name) return () => clearTimeout(flashTimer.current);
    const unsubscribe = MoveFunctions.subscribeRuns((ran) => {
      if (ran === name) flash();
    });
    return () => {
      unsubscribe();
      clearTimeout(flashTimer.current);
    };
  }, [name]);
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)(
    "button",
    {
      className: className ? `tweakers-move-action ${className}` : "tweakers-move-action",
      "data-kind": kind,
      "data-pressed": pressed || void 0,
      disabled,
      onClick: () => {
        if (disabled) return;
        if (name) MoveFunctions.run(name, { name, shift: false });
        else flash();
        onPress?.();
      },
      children: [
        kind === "capture" ? /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("svg", { className: "tweakers-move-action-icon", width: "14", height: "14", viewBox: ICON_MOVE_CAPTURE.viewBox, fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("path", { d: ICON_MOVE_CAPTURE.path, fill: "currentColor" }) }) : (
          // Enter and shift share the dot: it is drawn with currentColor, so it
          // comes out light-on-green on the enter pill and black on the light
          // shift pill without a second asset.
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("svg", { className: "tweakers-move-action-icon", width: "12", height: "12", viewBox: ICON_MOVE_ENTER.viewBox, fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("circle", { ...ICON_MOVE_ENTER.circle, fill: "currentColor" }) })
        ),
        children
      ]
    }
  );
}

// src/components/MoveWaveform.tsx
var import_react47 = require("react");
var import_react_dom9 = require("react-dom");

// src/components/WaveformVisualization.tsx
var import_react46 = require("react");

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
var DRAG_THRESHOLD2 = 3;
var EDGE_HIT2 = 6;
var MIN_LOOP = 1e-3;
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
    smoothThrough2(ctx, top);
    ctx.lineTo(bot[0].x, bot[0].y);
    smoothThrough2(ctx, bot);
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
    if (dS <= EDGE_HIT2 && dS <= dE && sx >= 0 && sx <= rect.width) return "start";
    if (dE <= EDGE_HIT2 && ex >= 0 && ex <= rect.width) return "end";
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
      if (Math.abs(e.clientX - drag.startX) > DRAG_THRESHOLD2) drag.moved = true;
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
var import_jsx_runtime44 = require("react/jsx-runtime");
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
  zoom: zoomProp,
  width = 256,
  height = 140
}) {
  const canvasRef = (0, import_react46.useRef)(null);
  const [ownZoom, setOwnZoom] = (0, import_react46.useState)(1);
  const controlled = zoomProp !== void 0;
  const zoom = controlled ? Math.max(1, zoomProp) : ownZoom;
  const setZoom = setOwnZoom;
  const runtimeRef = (0, import_react46.useRef)(null);
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
  (0, import_react46.useEffect)(() => {
    if (!canvasRef.current) return;
    const engine = createWaveformEngine(canvasRef.current, () => runtimeRef.current);
    return () => engine.destroy();
  }, []);
  const atMaxZoom = zoom >= WAVEFORM_MAX_ZOOM;
  const framingLoop = autoZoomOnLoop && !!loop || controlled;
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "tweakers-waveform-viz-wrap", style: { width }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("canvas", { ref: canvasRef, className: "tweakers-waveform-viz", style: { width, height } }),
    !framingLoop && /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)("div", { className: "tweakers-waveform-zoom", children: [
      zoom > 1 && /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("button", { type: "button", "aria-label": "Zoom out", onClick: () => setZoom((z) => Math.max(1, z / 2)), children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("svg", { viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("path", { d: "M3.5 8h9", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
        "button",
        {
          type: "button",
          "aria-label": "Zoom in",
          disabled: atMaxZoom,
          onClick: () => setZoom((z) => Math.min(WAVEFORM_MAX_ZOOM, z * 2)),
          children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("svg", { viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("path", { d: "M8 3.5v9M3.5 8h9", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) })
        }
      )
    ] })
  ] });
}

// src/move-waveform.ts
var MOVE_WAVEFORM_STEPS = 16;
var SCRUB_PER_DETENT = 0.01;
var SCRUB_FINE = 2e-3;
var ZOOM_PER_DETENT = 0.08;
var clamp015 = (v) => Math.min(1, Math.max(0, v));
function defaultView() {
  return { position: 0, zoom: 1, loop: null, loopAnchor: null };
}
function scrubBy(position, delta, fine = false) {
  const step = fine ? SCRUB_FINE : SCRUB_PER_DETENT;
  const next = clamp015(position + delta * step);
  return Number(next.toFixed(6));
}
function zoomBy(zoom, delta) {
  const next = zoom * Math.pow(1 + ZOOM_PER_DETENT, delta);
  return Number(Math.min(WAVEFORM_MAX_ZOOM, Math.max(1, next)).toFixed(6));
}
var stepPosition = (index, steps = MOVE_WAVEFORM_STEPS) => Math.min(1, Math.max(0, index / Math.max(1, steps)));
function loopFromStep(view, index, steps = MOVE_WAVEFORM_STEPS) {
  if (view.loopAnchor === null || view.loop) {
    return { loop: null, loopAnchor: index };
  }
  if (index === view.loopAnchor) {
    return { loop: null, loopAnchor: null };
  }
  const a = Math.min(view.loopAnchor, index);
  const b = Math.max(view.loopAnchor, index);
  return {
    loop: { start: stepPosition(a, steps), end: stepPosition(b + 1, steps) },
    loopAnchor: null
  };
}
function loopSteps(view, steps = MOVE_WAVEFORM_STEPS) {
  if (view.loop) {
    const from = Math.floor(view.loop.start * steps);
    const to = Math.ceil(view.loop.end * steps) - 1;
    const lit = [];
    for (let i = Math.max(0, from); i <= Math.min(steps - 1, to); i++) lit.push(i);
    return lit;
  }
  return view.loopAnchor === null ? [] : [view.loopAnchor];
}
var MoveWaveformStoreClass = class {
  constructor() {
    this.view = defaultView();
    this.registered = false;
    this.listeners = /* @__PURE__ */ new Set();
    this.version = 0;
  }
  /** Claim the wheel, the volume knob and the step row. Returns the release. */
  register() {
    this.registered = true;
    this.notify();
    return () => {
      this.registered = false;
      this.view = defaultView();
      this.notify();
    };
  }
  isRegistered() {
    return this.registered;
  }
  getView() {
    return this.view;
  }
  getVersion() {
    return this.version;
  }
  /** Patch the view. A patch that changes nothing notifies nobody. */
  setView(patch2) {
    const next = { ...this.view, ...patch2 };
    if (next.position === this.view.position && next.zoom === this.view.zoom && next.loopAnchor === this.view.loopAnchor && next.loop?.start === this.view.loop?.start && next.loop?.end === this.view.loop?.end) {
      return;
    }
    this.view = next;
    this.notify();
  }
  scrub(delta, fine = false) {
    this.setView({ position: scrubBy(this.view.position, delta, fine) });
  }
  zoom(delta) {
    this.setView({ zoom: zoomBy(this.view.zoom, delta) });
  }
  pressStep(index) {
    this.setView(loopFromStep(this.view, index));
  }
  clearLoop() {
    this.setView({ loop: null, loopAnchor: null });
  }
  /** The steps the loop covers — what the hardware lights. */
  loopSteps() {
    return loopSteps(this.view);
  }
  subscribe(fn) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  notify() {
    this.version += 1;
    for (const fn of this.listeners) fn();
  }
};
var MoveWaveformStore = new MoveWaveformStoreClass();

// src/components/MoveWaveform.tsx
var import_jsx_runtime45 = require("react/jsx-runtime");
var SLOT_HEIGHT = 140;
var SLOT_ZOOM = 4;
var DOCK_GAP = 10;
function MoveWaveform({
  buffer = null,
  variant = "page",
  getProgress,
  progress,
  onSeek,
  onLoopChange,
  mode = "pixelated",
  pixelSize = 2,
  grid = false,
  bands = false,
  waveColor,
  playheadColor,
  height,
  children,
  theme = "system",
  productionEnabled = isDevDefault,
  className
}) {
  const hostRef = (0, import_react47.useRef)(null);
  const [width, setWidth] = (0, import_react47.useState)(0);
  const [dockBottom, setDockBottom] = (0, import_react47.useState)(0);
  const [mounted, setMounted] = (0, import_react47.useState)(false);
  const seekRef = (0, import_react47.useRef)(onSeek);
  seekRef.current = onSeek;
  const loopRef = (0, import_react47.useRef)(onLoopChange);
  loopRef.current = onLoopChange;
  (0, import_react47.useEffect)(() => {
    if (!productionEnabled) return;
    setMounted(true);
    return MoveWaveformStore.register();
  }, [productionEnabled]);
  const view = (0, import_react47.useSyncExternalStore)(
    (0, import_react47.useCallback)((cb) => MoveWaveformStore.subscribe(cb), []),
    () => MoveWaveformStore.getVersion(),
    () => 0
  );
  const state2 = MoveWaveformStore.getView();
  const lastSent = (0, import_react47.useRef)({ position: state2.position, loop: state2.loop });
  (0, import_react47.useEffect)(() => {
    if (state2.position !== lastSent.current.position) {
      lastSent.current.position = state2.position;
      seekRef.current?.(state2.position);
    }
    if (state2.loop !== lastSent.current.loop) {
      lastSent.current.loop = state2.loop;
      loopRef.current?.(state2.loop);
    }
  }, [view, state2.position, state2.loop]);
  (0, import_react47.useEffect)(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0]?.contentRect.width ?? 0);
      setWidth((prev) => prev === w ? prev : w);
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [mounted, variant]);
  (0, import_react47.useEffect)(() => {
    if (variant !== "dock" || typeof window === "undefined") return;
    const measure = () => {
      const panel2 = document.querySelector(".tweakers-move-root .tweakers-move");
      const h = panel2 ? panel2.getBoundingClientRect().height : 0;
      setDockBottom(h > 0 ? h + DOCK_GAP : DOCK_GAP);
    };
    measure();
    const ro = new ResizeObserver(measure);
    const panel = document.querySelector(".tweakers-move-root .tweakers-move");
    if (panel) ro.observe(panel);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [variant, mounted]);
  if (!productionEnabled) return null;
  const boxHeight = height ?? (variant === "slot" ? SLOT_HEIGHT : 180);
  const wave = /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
    WaveformVisualization,
    {
      buffer,
      ...getProgress ? { getProgress } : { progress: progress ?? state2.position },
      mode,
      pixelSize,
      grid,
      bands,
      ...waveColor ? { waveColor } : {},
      ...playheadColor ? { playheadColor } : {},
      loop: state2.loop,
      zoom: variant === "slot" ? Math.max(SLOT_ZOOM, state2.zoom) : state2.zoom,
      onSeek: (p) => MoveWaveformStore.setView({ position: p }),
      onLoopChange: (l) => MoveWaveformStore.setView({ loop: l, loopAnchor: null }),
      width: Math.max(1, width),
      height: boxHeight
    }
  );
  const body = /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
    "div",
    {
      ref: hostRef,
      className: `tweakers-move-wave${className ? ` ${className}` : ""}`,
      "data-variant": variant,
      style: variant === "dock" ? { bottom: `${dockBottom}px` } : void 0,
      children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "tweakers-move-wave-canvas", style: { height: `${boxHeight}px` }, children: [
        width > 0 && wave,
        children
      ] })
    }
  );
  if (variant !== "dock") return body;
  if (!mounted || typeof document === "undefined") return null;
  return (0, import_react_dom9.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "tweakers-root tweakers-move-root", "data-theme": theme, "data-wave-dock": "true", children: body }),
    document.body
  );
}

// src/components/ListScreen.tsx
var import_react48 = require("react");
var import_jsx_runtime46 = require("react/jsx-runtime");
function itemValue(item) {
  return typeof item === "string" ? item : item.value;
}
function itemLabel(item) {
  return typeof item === "string" ? item : item.label ?? item.value;
}
function itemTag(item) {
  return typeof item === "string" ? void 0 : item.tag;
}
function itemMuted(item) {
  return typeof item === "string" ? false : Boolean(item.muted);
}
function ListScreen({
  items,
  value,
  onSelect,
  wide,
  className,
  style
}) {
  const rootRef = (0, import_react48.useRef)(null);
  (0, import_react48.useEffect)(() => {
    const row = rootRef.current?.querySelector("[data-selected]");
    row?.scrollIntoView?.({ block: "nearest" });
  }, [value]);
  const rootClassName = ["tweakers-list-screen", className].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(
    "div",
    {
      ref: rootRef,
      className: rootClassName,
      style,
      "data-wide": wide || void 0,
      role: "listbox",
      children: items.map((item) => {
        const rowValue = itemValue(item);
        const selected = rowValue === value;
        const tag = itemTag(item);
        return /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": selected,
            className: "tweakers-list-screen-row",
            "data-selected": selected || void 0,
            "data-tagged": tag ? true : void 0,
            "data-muted": itemMuted(item) || void 0,
            onClick: () => onSelect?.(rowValue),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("span", { className: "tweakers-list-screen-label", children: itemLabel(item) }),
              tag && /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("span", { className: "tweakers-list-screen-tag", children: tag })
            ]
          },
          rowValue
        );
      })
    }
  );
}

// src/hooks/useTweakTimeline.ts
var import_react49 = require("react");

// src/transition-math.ts
function round22(value) {
  return Math.round(value * 100) / 100;
}
function clamp8(value, min, max) {
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
  return round22(clamp8(duration, 0.05, 10));
}
function cubicBezierProgress(p, [x1, y1, x2, y2]) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  const sampleX = (t2) => bezierAxis2(t2, x1, x2);
  const sampleY = (t2) => bezierAxis2(t2, y1, y2);
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
function bezierAxis2(t, a1, a2) {
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
      console.warn(`[tweakers] Timeline key "${key}" collides with a reserved key and was skipped.`);
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
            `[tweakers] Timeline clip "${key}.${childKey}" is missing a numeric "at" and was skipped.`
          );
        }
      }
    } else {
      console.warn(
        `[tweakers] Timeline entry "${key}" is neither a clip (needs a numeric "at") nor a group of clips and was skipped.`
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
function setTweakPath(tweakConfig, path, value) {
  const segments = path.split(".");
  let node = tweakConfig;
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
  const tweakConfig = {};
  const clips = [];
  entries.forEach(({ path, childKey, group, clip }, index) => {
    const raw = clip;
    if (raw.props && (raw.steps?.length || raw.from || raw.to)) {
      console.warn(
        `[tweakers] Timeline clip "${path}": "props" is mutually exclusive with from/to/steps \u2014 using "props".`
      );
    } else if (raw.steps?.length && raw.to) {
      console.warn(
        `[tweakers] Timeline clip "${path}": "to" is ignored when "steps" is present \u2014 each leg's "to" defines its targets.`
      );
    }
    const hasSteps = Boolean(clip.steps?.length) && !clip.props;
    const hasProps = Boolean(clip.props);
    const single = isTransitionConfig(clip.transition) ? clip.transition : void 0;
    const total = defaultClipDuration(clip);
    const defaultCurve = single ?? DEFAULT_CLIP_TRANSITION;
    const clipAt = nonNegativeFinite(clip.at);
    const clipTweak = {
      at: [clipAt, 0, duration, CLIP_VALUE_STEP]
    };
    if (!hasSteps && !hasProps) {
      clipTweak.duration = [total, 0, duration, CLIP_VALUE_STEP];
    }
    if (!hasSteps && !hasProps && (clip.transition || clip.from || clip.to)) {
      clipTweak.transition = normalizeStoredTransition(defaultCurve, total);
    }
    let tracks;
    if (clip.props) {
      tracks = [];
      for (const [prop, track] of Object.entries(clip.props)) {
        if (TRACK_RESERVED.has(prop) || /^step\d+$/.test(prop)) {
          console.warn(`[tweakers] Timeline property "${prop}" collides with a clip field and was skipped.`);
          continue;
        }
        const trackDuration = defaultTrackDuration(track, defaultCurve);
        const trackCurve = track.transition ?? defaultCurve;
        const hasTrackSteps = Boolean(track.steps?.length);
        const trackTweak = {
          delay: [nonNegativeFinite(track.delay), 0, duration, CLIP_VALUE_STEP]
        };
        if (!hasTrackSteps) {
          trackTweak.duration = [trackDuration, 0, duration, CLIP_VALUE_STEP];
          trackTweak.transition = normalizeStoredTransition(trackCurve, trackDuration);
        }
        const fromValue = track.from ?? (hasTrackSteps ? void 0 : track.to);
        if (hasTrackSteps && fromValue === void 0) {
          console.warn(
            `[tweakers] Timeline clip "${path}": track "${prop}" has steps but no "from" \u2014 declare its starting value.`
          );
        }
        if (fromValue !== void 0) {
          trackTweak.from = scalarTweak(prop, fromValue, hasTrackSteps ? track.steps[0]?.to : track.to);
        }
        if (!hasTrackSteps && track.to !== void 0) {
          trackTweak.to = scalarTweak(prop, track.to, fromValue);
        }
        let trackStepKeys;
        if (hasTrackSteps) {
          trackStepKeys = [];
          let previous = fromValue;
          track.steps.forEach((step, stepIndex) => {
            const stepKey = `step${stepIndex + 1}`;
            trackStepKeys.push(stepKey);
            const stepDuration = defaultStepDuration(step, trackCurve);
            const stepTweak = {
              duration: [stepDuration, 0, duration, CLIP_VALUE_STEP],
              transition: normalizeStoredTransition(step.transition ?? trackCurve, stepDuration)
            };
            if (step.to !== void 0) {
              stepTweak.to = scalarTweak(prop, step.to, previous);
              previous = step.to;
            }
            trackTweak[stepKey] = stepTweak;
          });
        }
        clipTweak[prop] = trackTweak;
        tracks.push({ prop, stepKeys: trackStepKeys });
      }
    }
    if (clip.from && !hasProps) {
      clipTweak.from = withFromToRanges(
        clip.from,
        hasSteps ? definedValues(clip.steps[0]?.to) : clip.to
      );
    }
    if (!hasSteps && !hasProps && clip.to) {
      clipTweak.to = withFromToRanges(clip.to, clip.from);
    }
    let stepKeys;
    if (hasSteps) {
      stepKeys = [];
      let running = clip.from;
      clip.steps.forEach((step, stepIndex) => {
        const stepKey = `step${stepIndex + 1}`;
        stepKeys.push(stepKey);
        const stepDuration = defaultStepDuration(step, defaultCurve);
        const stepTweak = {
          duration: [stepDuration, 0, duration, CLIP_VALUE_STEP],
          transition: normalizeStoredTransition(step.transition ?? defaultCurve, stepDuration)
        };
        const stepTo = definedValues(step.to);
        if (stepTo) {
          for (const prop of Object.keys(stepTo)) {
            if (!running || !(prop in running)) {
              console.warn(
                `[tweakers] Timeline clip "${path}": property "${prop}" first animates in step ${stepIndex + 1} with no starting value \u2014 declare it in "from".`
              );
            }
          }
          stepTweak.to = withFromToRanges(stepTo, running);
        }
        clipTweak[stepKey] = stepTweak;
        running = { ...running ?? {}, ...stepTo ?? {} };
      });
    }
    setTweakPath(tweakConfig, path, clipTweak);
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
  return { duration, tweakConfig, clips };
}
var TRACK_RESERVED = /* @__PURE__ */ new Set(["at", "duration", "loop", "from", "to", "transition", "delay"]);
function scalarTweak(prop, value, counterpart) {
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
    return cubicBezierProgress(clamp8(curve.duration > 0 ? elapsed / curve.duration : 1, 0, 1), curve.ease);
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
  const resolved = resolveTweakValues(parsed.tweakConfig, flatValues);
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
  const progress = total > 0 ? clamp8(basePos / total, 0, 1) : started ? 1 : 0;
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
  const t = clamp8(p, 0, 1);
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
  return clamp8(round22(delay), 0, Math.max(0, round22(timelineDuration - at - trackDuration)));
}
function clampClipMove(at, duration, timelineDuration) {
  return clamp8(round22(at), 0, Math.max(0, timelineDuration - duration));
}
function clampClipResizeEnd(duration, at, timelineDuration) {
  return clamp8(round22(duration), TIMELINE_MIN_CLIP_DURATION, timelineDuration - at);
}
function clampClipResizeStart(newAt, at, duration) {
  const clampedAt = clamp8(round22(newAt), 0, at + duration - TIMELINE_MIN_CLIP_DURATION);
  return { at: clampedAt, duration: round22(at + duration - clampedAt) };
}
function clampStepResize(duration, at, otherStepsTotal, timelineDuration) {
  const max = Math.max(TIMELINE_MIN_CLIP_DURATION, timelineDuration - at - otherStepsTotal);
  return clamp8(round22(duration), TIMELINE_MIN_CLIP_DURATION, max);
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
    const state2 = computeClipState(clip, transport.time, cycleTime);
    if (clip.group) {
      const bucket = result[_a = clip.group] ?? (result[_a] = {});
      bucket[clip.childKey] = state2;
    } else {
      result[clip.key] = state2;
    }
  }
  return result;
}

// src/hooks/useTweakTimeline.ts
function useTweakTimeline(name, config, options) {
  const serializedConfig = useSerialized(config);
  const parsed = (0, import_react49.useMemo)(() => parseTimelineConfig(config), [serializedConfig]);
  const { panelId, flatValues } = useTweakStorePanel(name, parsed.tweakConfig, {
    id: options?.id,
    persist: options?.persist,
    kind: "timeline"
  });
  const staticTimeline = (0, import_react49.useMemo)(
    () => computeStaticTimeline(parsed, flatValues),
    [parsed, flatValues]
  );
  const timelineDuration = staticTimeline.duration;
  const staticClips = staticTimeline.clips;
  const parsedRef = (0, import_react49.useRef)(parsed);
  parsedRef.current = parsed;
  const optionsRef = (0, import_react49.useRef)(options);
  optionsRef.current = options;
  const buildMeta = (0, import_react49.useCallback)(
    () => buildTimelineMeta(panelId, name, timelineDuration, parsedRef.current, options?.loop),
    [panelId, name, timelineDuration, options?.loop]
  );
  const buildMetaRef = (0, import_react49.useRef)(buildMeta);
  buildMetaRef.current = buildMeta;
  (0, import_react49.useEffect)(() => {
    TimelineStore.register(buildMetaRef.current(), {
      autoplay: optionsRef.current?.autoplay ?? true,
      persist: optionsRef.current?.persist
    });
    return () => TimelineStore.unregister(panelId);
  }, [panelId, name]);
  const mountedRef = (0, import_react49.useRef)(false);
  (0, import_react49.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    TimelineStore.update(buildMeta());
  }, [buildMeta, parsed]);
  const subscribeTransport = (0, import_react49.useCallback)(
    (callback) => TimelineStore.subscribe(panelId, callback),
    [panelId]
  );
  const getTransport = (0, import_react49.useCallback)(() => TimelineStore.getTransport(panelId), [panelId]);
  const transport = (0, import_react49.useSyncExternalStore)(subscribeTransport, getTransport, getTransport);
  const getLoopRegion = (0, import_react49.useCallback)(() => TimelineStore.getLoopRegion(panelId), [panelId]);
  const loopRegion = (0, import_react49.useSyncExternalStore)(subscribeTransport, getLoopRegion, getLoopRegion);
  const loopStart = loopRegion ? loopRegion.start : 0;
  const loopEnd = loopRegion ? loopRegion.end : timelineDuration;
  const play = (0, import_react49.useCallback)(() => TimelineStore.play(panelId), [panelId]);
  const pause = (0, import_react49.useCallback)(() => TimelineStore.pause(panelId), [panelId]);
  const replay = (0, import_react49.useCallback)(() => TimelineStore.replay(panelId), [panelId]);
  const seek = (0, import_react49.useCallback)((time) => TimelineStore.seek(panelId, time), [panelId]);
  return (0, import_react49.useMemo)(
    () => buildTimelineValues(staticClips, transport, timelineDuration, loopStart, loopEnd, {
      play,
      pause,
      replay,
      seek
    }),
    [staticClips, transport, timelineDuration, loopStart, loopEnd, play, pause, replay, seek]
  );
}

// src/components/Timeline/TweakTimeline.tsx
var import_react50 = require("react");
var import_react_dom10 = require("react-dom");
var import_react51 = require("motion/react");
var import_jsx_runtime47 = require("react/jsx-runtime");
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
var TweakTimeline = (0, import_react50.memo)(function TweakTimeline2({
  theme = "system",
  defaultVisible = true,
  visible,
  onVisibilityChange,
  defaultOpen = true,
  productionEnabled = isDevDefault
}) {
  if (!productionEnabled) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
    TweakTimelineDock,
    {
      theme,
      defaultVisible,
      visible,
      onVisibilityChange,
      defaultOpen
    }
  );
});
function TweakTimelineDock({
  theme,
  defaultVisible,
  visible,
  onVisibilityChange,
  defaultOpen
}) {
  const [mounted, setMounted] = (0, import_react50.useState)(false);
  const [dockMaxHeight, setDockMaxHeight] = (0, import_react50.useState)(DEFAULT_DOCK_MAX_HEIGHT);
  const visibilityControllerId = (0, import_react50.useRef)(/* @__PURE__ */ Symbol("tweakers-timeline-visibility"));
  const dockRef = (0, import_react50.useRef)(null);
  const resizeCleanupRef = (0, import_react50.useRef)(null);
  (0, import_react50.useEffect)(() => TimelineUiStore.registerController(visibilityControllerId.current, {
    visible,
    defaultVisible,
    onVisibilityChange
  }), []);
  (0, import_react50.useEffect)(() => {
    TimelineUiStore.updateController(visibilityControllerId.current, {
      visible,
      defaultVisible,
      onVisibilityChange
    });
  }, [defaultVisible, onVisibilityChange, visible]);
  (0, import_react50.useEffect)(() => {
    setMounted(true);
  }, []);
  (0, import_react50.useEffect)(() => () => resizeCleanupRef.current?.(), []);
  const handleResizePointerDown = (0, import_react50.useCallback)((e) => {
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
      setDockMaxHeight(clamp8(startHeight + pointerY - event.clientY, MIN_DOCK_MAX_HEIGHT, viewportMax));
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
  const timelines = (0, import_react50.useSyncExternalStore)(subscribeGlobalTimelines, getTimelines, getTimelines);
  const dockVisible = (0, import_react50.useSyncExternalStore)(
    subscribeTimelineVisibility,
    getTimelineVisibility,
    getTimelineVisibility
  );
  if (!mounted || typeof window === "undefined" || timelines.length === 0) {
    return null;
  }
  return (0, import_react_dom10.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-root tweakers-timeline", "data-theme": theme, hidden: !dockVisible, children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        "div",
        {
          className: "tweakers-timeline-resize-handle",
          onPointerDown: handleResizePointerDown,
          role: "separator",
          "aria-label": "Resize timeline height",
          "aria-orientation": "horizontal",
          title: "Drag to resize timeline"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        "div",
        {
          ref: dockRef,
          className: "tweakers-timeline-dock",
          style: { maxHeight: `min(${dockMaxHeight}px, calc(100vh - 24px))` },
          children: timelines.map((timeline) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
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
  return (0, import_react50.useCallback)((callback) => TimelineStore.subscribe(id, callback), [id]);
}
function PlayPauseButton({ id }) {
  const subscribe = useTransportSubscribe(id);
  const getPlaying = (0, import_react50.useCallback)(() => TimelineStore.getTransport(id).playing, [id]);
  const playing = (0, import_react50.useSyncExternalStore)(subscribe, getPlaying, getPlaying);
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
    import_react51.motion.button,
    {
      className: "tweakers-toolbar-add",
      onClick: () => playing ? TimelineStore.pause(id) : TimelineStore.play(id),
      title: playing ? "Pause" : "Play",
      "aria-label": playing ? "Pause" : "Play",
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { style: { position: "relative", width: 16, height: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(import_react51.AnimatePresence, { initial: false, mode: "wait", children: playing ? /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        import_react51.motion.svg,
        {
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.08 },
          children: ICON_PAUSE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d, fill: "currentColor" }, i))
        },
        "pause"
      ) : /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        import_react51.motion.svg,
        {
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.08 },
          children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_PLAY, fill: "currentColor" })
        },
        "play"
      ) }) })
    }
  );
}
function ReplayButton({ onReplay }) {
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
    import_react51.motion.button,
    {
      className: "tweakers-toolbar-add",
      onClick: onReplay,
      title: "Replay",
      "aria-label": "Replay",
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: ICON_REPLAY.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d, fill: "currentColor" }, i)) })
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
  const getTime = (0, import_react50.useCallback)(() => TimelineStore.getTransport(id).time, [id]);
  const time = (0, import_react50.useSyncExternalStore)(subscribe, getTime, getTime);
  const scrubRef = (0, import_react50.useRef)(null);
  const cleanupScrubRef = (0, import_react50.useRef)(null);
  const seekFromClientX = (0, import_react50.useCallback)((clientX) => {
    const rect = scrubRef.current?.rect;
    const scrub = scrubRef.current;
    const contentWidth = rect?.width ?? 0;
    if (!rect || !scrub || contentWidth <= 0) return;
    const nextTime = clamp8(
      scrub.viewStart + (clientX - rect.left) / contentWidth * (scrub.viewEnd - scrub.viewStart),
      scrub.viewStart,
      scrub.viewEnd
    );
    TimelineStore.seek(id, nextTime);
  }, [id]);
  const handlePointerDown = (0, import_react50.useCallback)((e) => {
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
  (0, import_react50.useEffect)(() => () => cleanupScrubRef.current?.(), []);
  if (time < viewStart || time > viewEnd || laneWidth <= 0) return null;
  const x = clamp8(
    (time - viewStart) * pxPerSecond,
    0,
    laneWidth
  );
  const flagCenter = clamp8(
    x,
    PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG,
    laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG
  );
  const flagOffset = flagCenter - x;
  const edge = flagOffset > 0.5 ? "start" : flagOffset < -0.5 ? "end" : "center";
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
    "div",
    {
      className: "tweakers-timeline-playhead-control",
      "data-edge": edge,
      style: {
        left: `calc(var(--tweak-timeline-label-w) + ${x}px)`,
        "--tweak-timeline-playhead-flag-offset": `${flagOffset}px`
      },
      onPointerDown: handlePointerDown,
      role: "slider",
      "aria-label": "Timeline current time",
      "aria-valuemin": 0,
      "aria-valuemax": duration,
      "aria-valuenow": time,
      title: "Drag to scrub the timeline",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-playhead-stem" }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-playhead-anchor", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-playhead-flag", children: time.toFixed(2) }) })
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
  const getTime = (0, import_react50.useCallback)(() => TimelineStore.getTransport(id).time, [id]);
  const time = (0, import_react50.useSyncExternalStore)(subscribe, getTime, getTime);
  const scrubRef = (0, import_react50.useRef)(null);
  const seekFromClientX = (0, import_react50.useCallback)((clientX) => {
    const rect = scrubRef.current?.rect;
    if (!rect || rect.width <= 0 || duration <= 0) return;
    const nextTime = clamp8((clientX - rect.left) / rect.width * duration, 0, duration);
    TimelineStore.seek(id, nextTime);
    onNavigate(nextTime);
  }, [duration, id, onNavigate]);
  const handlePointerDown = (0, import_react50.useCallback)((e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubRef.current = {
      wasPlaying: TimelineStore.getTransport(id).playing,
      rect: e.currentTarget.getBoundingClientRect()
    };
    TimelineStore.pause(id);
    seekFromClientX(e.clientX);
  }, [id, seekFromClientX]);
  const handlePointerMove = (0, import_react50.useCallback)((e) => {
    if (scrubRef.current) seekFromClientX(e.clientX);
  }, [seekFromClientX]);
  const finishScrub = (0, import_react50.useCallback)(() => {
    if (scrubRef.current?.wasPlaying) TimelineStore.play(id);
    scrubRef.current = null;
  }, [id]);
  const viewportLeft = duration > 0 ? viewStart / duration * 100 : 0;
  const viewportWidth = duration > 0 ? (viewEnd - viewStart) / duration * 100 : 100;
  const playheadLeft = duration > 0 ? time / duration * 100 : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
    "div",
    {
      className: "tweakers-timeline-overview",
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishScrub,
      onPointerCancel: finishScrub,
      onLostPointerCapture: finishScrub,
      title: "Drag to scrub the full timeline",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          "div",
          {
            className: "tweakers-timeline-overview-viewport",
            "data-zoomed": viewportWidth < 99.999 || void 0,
            style: { left: `${viewportLeft}%`, width: `${viewportWidth}%` }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-overview-progress", style: { width: `${playheadLeft}%` } }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-overview-playhead", style: { left: `${playheadLeft}%` } })
      ]
    }
  );
}
function clampViewStart(start, duration, visibleDuration) {
  return clamp8(start, 0, Math.max(0, duration - visibleDuration));
}
function formatRulerSeconds(time, step) {
  if (step >= 1 && Number.isInteger(time)) return formatClock(time);
  const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
  return `${time.toFixed(decimals)}s`;
}
var TimelineSection = (0, import_react50.memo)(function TimelineSection2({
  meta,
  defaultOpen,
  theme,
  dockVisible
}) {
  const [open, setOpen] = (0, import_react50.useState)(defaultOpen);
  const [copied, setCopied] = (0, import_react50.useState)(false);
  const [popover, setPopover] = (0, import_react50.useState)(null);
  const [collapsedGroups, setCollapsedGroups] = (0, import_react50.useState)(() => /* @__PURE__ */ new Set());
  const [expandedTracks, setExpandedTracks] = (0, import_react50.useState)(() => /* @__PURE__ */ new Set());
  const [zoom, setZoom] = (0, import_react50.useState)(1);
  const [viewStart, setViewStart] = (0, import_react50.useState)(0);
  const subscribeValues = (0, import_react50.useCallback)(
    (callback) => TweakStore.subscribe(meta.id, callback),
    [meta.id]
  );
  const getValues = (0, import_react50.useCallback)(() => TweakStore.getValues(meta.id), [meta.id]);
  const values = (0, import_react50.useSyncExternalStore)(subscribeValues, getValues, getValues);
  const presets = TweakStore.getPresets(meta.id);
  const activePresetId = TweakStore.getActivePresetId(meta.id);
  const subscribeLoopRegion = (0, import_react50.useCallback)(
    (callback) => TimelineStore.subscribe(meta.id, callback),
    [meta.id]
  );
  const getLoopRegion = (0, import_react50.useCallback)(() => TimelineStore.getLoopRegion(meta.id), [meta.id]);
  const loopRegion = (0, import_react50.useSyncExternalStore)(subscribeLoopRegion, getLoopRegion, getLoopRegion);
  const [loopDrag, setLoopDrag] = (0, import_react50.useState)(null);
  const laneAreaRef = (0, import_react50.useRef)(null);
  const horizontalScrollRef = (0, import_react50.useRef)(null);
  const [laneWidth, setLaneWidth] = (0, import_react50.useState)(0);
  (0, import_react50.useLayoutEffect)(() => {
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
  (0, import_react50.useEffect)(() => {
    setZoom((current) => clamp8(current, 1, maxZoom));
  }, [maxZoom]);
  (0, import_react50.useEffect)(() => {
    setViewStart((current) => clampViewStart(current, meta.duration, meta.duration / zoom));
  }, [meta.duration, zoom]);
  (0, import_react50.useLayoutEffect)(() => {
    const scroller = horizontalScrollRef.current;
    if (!scroller || pxPerSecond <= 0) return;
    const nextScrollLeft = safeViewStart * pxPerSecond;
    if (Math.abs(scroller.scrollLeft - nextScrollLeft) > 0.5) {
      scroller.scrollLeft = nextScrollLeft;
    }
  }, [open, pxPerSecond, safeViewStart]);
  (0, import_react50.useEffect)(() => {
    if (!dockVisible) setPopover(null);
  }, [dockVisible]);
  const centerViewAt = (0, import_react50.useCallback)((time) => {
    if (zoom <= 1 || meta.duration <= 0) return;
    const windowDuration = meta.duration / zoom;
    setViewStart(clampViewStart(time - windowDuration / 2, meta.duration, windowDuration));
  }, [meta.duration, zoom]);
  const resetView = (0, import_react50.useCallback)(() => {
    setZoom(1);
    setViewStart(0);
  }, []);
  const handleReplay = (0, import_react50.useCallback)(() => {
    setViewStart(0);
    TimelineStore.replay(meta.id);
  }, [meta.id]);
  const handleClearLoopRegion = (0, import_react50.useCallback)(() => {
    TimelineStore.clearLoopRegion(meta.id);
  }, [meta.id]);
  const handleHorizontalScroll = (0, import_react50.useCallback)((e) => {
    if (pxPerSecond <= 0) return;
    setViewStart(clampViewStart(
      e.currentTarget.scrollLeft / pxPerSecond,
      meta.duration,
      visibleDuration
    ));
  }, [meta.duration, pxPerSecond, visibleDuration]);
  const handleTimelineWheel = (0, import_react50.useCallback)((e) => {
    const scroller = horizontalScrollRef.current;
    if (!scroller || zoom <= 1) return;
    const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (horizontalDelta === 0) return;
    e.preventDefault();
    scroller.scrollLeft += horizontalDelta;
  }, [zoom]);
  const zoomDragRef = (0, import_react50.useRef)(null);
  const rulerGestureRef = (0, import_react50.useRef)(null);
  const rulerTimeFromClientX = (0, import_react50.useCallback)(
    (clientX, rect, viewStartAt, visibleAt) => clamp8(
      viewStartAt + (clientX - rect.left) / rect.width * visibleAt,
      viewStartAt,
      viewStartAt + visibleAt
    ),
    []
  );
  const handleRulerPointerDown = (0, import_react50.useCallback)((e) => {
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
    const anchorRatio = clamp8((e.clientX - rect.left) / contentWidth, 0, 1);
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
  const handleRulerPointerMove = (0, import_react50.useCallback)((e) => {
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
    const nextZoom = clamp8(drag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom);
    const nextVisibleDuration = meta.duration / nextZoom;
    const nextStart = clampViewStart(
      drag.anchorTime - drag.anchorRatio * nextVisibleDuration,
      meta.duration,
      nextVisibleDuration
    );
    setZoom(nextZoom);
    setViewStart(nextStart);
  }, [maxZoom, meta.duration, rulerTimeFromClientX]);
  const handleRulerPointerUp = (0, import_react50.useCallback)(() => {
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
  const handleRulerPointerCancel = (0, import_react50.useCallback)(() => {
    rulerGestureRef.current = null;
    zoomDragRef.current = null;
    setLoopDrag(null);
  }, []);
  const trackScrubRef = (0, import_react50.useRef)(null);
  const seekTrackFromClientX = (0, import_react50.useCallback)((clientX) => {
    const scrub = trackScrubRef.current;
    const contentWidth = scrub?.rect.width ?? 0;
    if (!scrub || contentWidth <= 0) return;
    const nextTime = clamp8(
      scrub.viewStart + (clientX - scrub.rect.left) / contentWidth * scrub.visibleDuration,
      scrub.viewStart,
      scrub.viewStart + scrub.visibleDuration
    );
    TimelineStore.seek(meta.id, nextTime);
  }, [meta.id]);
  const handleTrackPointerDown = (0, import_react50.useCallback)((e) => {
    const target = e.target;
    if (target.closest(".tweakers-timeline-label, button")) return;
    if (!e.shiftKey && target.closest(".tweakers-timeline-clip")) return;
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
  const handleTrackPointerMove = (0, import_react50.useCallback)((e) => {
    if (trackScrubRef.current) seekTrackFromClientX(e.clientX);
  }, [seekTrackFromClientX]);
  const finishTrackScrub = (0, import_react50.useCallback)(() => {
    if (trackScrubRef.current?.wasPlaying) TimelineStore.play(meta.id);
    trackScrubRef.current = null;
  }, [meta.id]);
  const handleCopy = (0, import_react50.useCallback)(() => {
    const normalized = normalizeTimelineValuesForCopy(TweakStore.getValues(meta.id), meta.clips);
    navigator.clipboard.writeText(buildCopyInstruction("useTweakTimeline", meta.name, normalized));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [meta.clips, meta.id, meta.name]);
  const handleAddPreset = (0, import_react50.useCallback)(() => {
    TweakStore.savePreset(meta.id, `Version ${presets.length + 2}`);
  }, [meta.id, presets.length]);
  const closePopover = (0, import_react50.useCallback)(() => setPopover(null), []);
  const openClipPopover = (0, import_react50.useCallback)(
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
  const toggleTracks = (0, import_react50.useCallback)((clipKey) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(clipKey)) next.delete(clipKey);
      else next.add(clipKey);
      return next;
    });
  }, []);
  const handleBarClick = (0, import_react50.useCallback)(
    (clip, rect, stepKey) => {
      if (!stepKey && clip.tracks?.length) {
        toggleTracks(clip.key);
        return;
      }
      openClipPopover(clip, rect, stepKey);
    },
    [openClipPopover, toggleTracks]
  );
  const toggleGroup = (0, import_react50.useCallback)((group) => {
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
          /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-row tweakers-timeline-group-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-label", children: [
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
                "button",
                {
                  className: "tweakers-timeline-group-toggle",
                  "data-open": !isCollapsed,
                  onClick: () => toggleGroup(group),
                  title: isCollapsed ? "Expand layer" : "Collapse layer",
                  children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_CHEVRON }) })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { children: formatLabel(group) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-lane" })
          ] }, `group:${group}`)
        );
      }
    }
    if (clip.group && collapsedGroups.has(clip.group)) continue;
    const isProps = Boolean(clip.tracks?.length);
    const tracksOpen = isProps && expandedTracks.has(clip.key);
    const stat = computeClipStaticFromValues(values, clip, meta.duration);
    rows.push(
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-row", "data-grouped": clip.group ? "" : void 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-label", children: [
          isProps ? /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
            "button",
            {
              className: "tweakers-timeline-group-toggle",
              "data-open": tracksOpen,
              onClick: (e) => {
                e.stopPropagation();
                toggleTracks(clip.key);
              },
              title: tracksOpen ? "Collapse properties" : "Expand properties",
              children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_CHEVRON }) })
            }
          ) : null,
          clip.label
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-lane", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
            "div",
            {
              className: "tweakers-timeline-row tweakers-timeline-track-row",
              "data-grouped": clip.group ? "" : void 0,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-label", children: formatLabel(trackRef.prop) }),
                /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-lane", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-header", "data-open": open || void 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-identity", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "tweakers-timeline-title", children: meta.name }) }),
      !open && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        TimelineOverview,
        {
          id: meta.id,
          duration: meta.duration,
          viewStart: safeViewStart,
          viewEnd,
          onNavigate: centerViewAt
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          import_react51.motion.button,
          {
            className: "tweakers-timeline-loop-toggle",
            "data-active": loopRegion ? "true" : void 0,
            onClick: handleClearLoopRegion,
            disabled: !loopRegion,
            title: loopRegion ? "Looping a region \xB7 click to loop the whole timeline" : "Looping the whole timeline \xB7 drag the ruler to set a loop region",
            "aria-label": loopRegion ? "Clear loop region" : "Looping whole timeline",
            "aria-pressed": loopRegion ? true : false,
            whileTap: loopRegion ? { scale: 0.9 } : void 0,
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: ICON_LOOP.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d }, i)) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(PlayPauseButton, { id: meta.id }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(ReplayButton, { onReplay: handleReplay }),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          import_react51.motion.button,
          {
            className: "tweakers-toolbar-add",
            onClick: handleAddPreset,
            title: "Add timeline version",
            "aria-label": "Add timeline version",
            whileTap: { scale: 0.9 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: ICON_ADD_PRESET.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d }, i)) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          PresetManager,
          {
            panelId: meta.id,
            presets,
            activePresetId,
            onAdd: handleAddPreset
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          import_react51.motion.button,
          {
            className: "tweakers-toolbar-add",
            onClick: handleCopy,
            title: "Copy parameters",
            "aria-label": copied ? "Copied parameters" : "Copy parameters",
            whileTap: { scale: 0.9 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { style: { position: "relative", width: 16, height: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(import_react51.AnimatePresence, { initial: false, mode: "wait", children: copied ? /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
              import_react51.motion.svg,
              {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true",
                style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                transition: { duration: 0.08 },
                children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_CHECK })
              },
              "check"
            ) : /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
              import_react51.motion.svg,
              {
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true",
                style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                transition: { duration: 0.08 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_CLIPBOARD.board, stroke: "currentColor", strokeWidth: "2", strokeLinejoin: "round" }),
                  /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_CLIPBOARD.sparkle, fill: "currentColor" }),
                  /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_CLIPBOARD.body, stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
                ]
              },
              "clipboard"
            ) }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
          "button",
          {
            className: "tweakers-timeline-chevron",
            "data-open": open,
            "aria-expanded": open,
            onClick: () => setOpen(!open),
            title: open ? "Collapse timeline" : "Expand timeline",
            children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: ICON_CHEVRON }) })
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
      "div",
      {
        className: "tweakers-timeline-body",
        onWheel: handleTimelineWheel,
        onPointerDown: handleTrackPointerDown,
        onPointerMove: handleTrackPointerMove,
        onPointerUp: finishTrackScrub,
        onPointerCancel: finishTrackScrub,
        onLostPointerCapture: finishTrackScrub,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-grid", children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-row tweakers-timeline-ruler-row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-label" }),
              /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
                "div",
                {
                  ref: laneAreaRef,
                  className: "tweakers-timeline-ruler",
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
                      return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(import_jsx_runtime47.Fragment, { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-loop-dim", style: { left: 0, width: Math.max(0, left) } }),
                        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-loop-dim", style: { left: left + width, right: 0 } }),
                        /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
                          "div",
                          {
                            className: "tweakers-timeline-loop-band",
                            "data-live": loopDrag ? "true" : void 0,
                            style: { left, width }
                          }
                        )
                      ] });
                    })(),
                    fineTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-tick tweakers-timeline-tick-fine", style: { left: (t - safeViewStart) * pxPerSecond } }, `fine:${t}`)),
                    mediumTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-tick tweakers-timeline-tick-medium", style: { left: (t - safeViewStart) * pxPerSecond } }, `medium:${t}`)),
                    majorTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-tick", style: { left: (t - safeViewStart) * pxPerSecond }, children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "tweakers-timeline-tick-label", children: formatRulerSeconds(t, majorStep) }) }, t))
                  ]
                }
              )
            ] }),
            rows,
            pxPerSecond > 0 && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
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
          zoom > 1 && /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-scroll-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-label" }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
              "div",
              {
                ref: horizontalScrollRef,
                className: "tweakers-timeline-horizontal-scroll",
                onScroll: handleHorizontalScroll,
                "aria-label": "Timeline horizontal scroll",
                children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { style: { width: laneWidth * zoom } })
              }
            )
          ] })
        ]
      }
    ),
    popover && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
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
  const ref = (0, import_react50.useRef)(null);
  const [naturalHeight, setNaturalHeight] = (0, import_react50.useState)(0);
  const [viewport, setViewport] = (0, import_react50.useState)(() => ({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
    offsetLeft: window.visualViewport?.offsetLeft ?? 0,
    offsetTop: window.visualViewport?.offsetTop ?? 0
  }));
  (0, import_react50.useLayoutEffect)(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setNaturalHeight(element.scrollHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    const body = element.querySelector(".tweakers-timeline-popover-body");
    observer.observe(body ?? element);
    return () => observer.disconnect();
  }, [popover.clip.key, popover.stepKey]);
  (0, import_react50.useEffect)(() => {
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
  (0, import_react50.useEffect)(() => {
    const handlePointerDown = (e) => {
      const target = e.target;
      if (ref.current?.contains(target)) return;
      if (target.closest?.(".tweakers-timeline-clip")) return;
      if (target.closest?.(".tweakers-timeline-label")) return;
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
    onChange: (next) => TweakStore.updateValue(panelId, durationMeta.path, next),
    min: Math.max(TIMELINE_MIN_CLIP_DURATION, durationMeta.min ?? 0),
    max: durationMeta.max,
    step: durationMeta.step
  } : void 0;
  const displayValues = timelinePopoverDisplayValues(values, clip.key, clip.stepKeys, stepKey);
  const viewportRight = viewport.offsetLeft + viewport.width;
  const viewportBottom = viewport.offsetTop + viewport.height;
  const popoverWidth = Math.min(POPOVER_WIDTH, Math.max(220, viewport.width - 24));
  const left = clamp8(
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
  const top = clamp8(
    unclampedTop,
    viewport.offsetTop + 12,
    Math.max(viewport.offsetTop + 12, viewportBottom - renderedHeight - 12)
  );
  return (0, import_react_dom10.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-root", "data-theme": theme, children: /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(
      "div",
      {
        ref,
        className: "tweakers-timeline-popover",
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
          /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "tweakers-timeline-popover-header", children: [
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "tweakers-timeline-popover-title", children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("button", { className: "tweakers-timeline-popover-close", onClick: onClose, title: "Close editor", "aria-label": "Close editor", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("path", { d: "M6 6L18 18M18 6L6 18" }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-popover-body", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
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
  const panel = TweakStore.getPanel(panelId);
  const folder = panel ? findControl(panel.controls, controlPath) : null;
  if (!folder?.children) return [];
  return folder.children.filter((control) => {
    const childKey = control.path.slice(controlPath.length + 1);
    if (childKey === "at" || childKey === "duration") return false;
    return !excludeChildren?.has(childKey);
  });
}
function getControlAt(panelId, path) {
  const panel = TweakStore.getPanel(panelId);
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
  const dragRef = (0, import_react50.useRef)(null);
  const [dragging, setDragging] = (0, import_react50.useState)(false);
  const isSteps = Boolean(steps?.length);
  const handlePointerDown = (0, import_react50.useCallback)(
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
  const handlePointerMove = (0, import_react50.useCallback)(
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
        TweakStore.updateValue(
          timelineId,
          `${clip.key}.${steps[index].key ?? ""}.duration`,
          clampStepResize(drag.stepDurations[index] + dt, drag.at, others, timelineDuration)
        );
      } else if (drag.mode === "move") {
        if (delayMode) {
          TweakStore.updateValue(
            timelineId,
            `${clip.key}.delay`,
            clampTrackDelay(drag.at + dt - baseAt, baseAt, drag.duration, timelineDuration)
          );
        } else {
          TweakStore.updateValue(timelineId, `${clip.key}.at`, clampClipMove(drag.at + dt, drag.duration, timelineDuration));
        }
      } else if (drag.mode === "end") {
        TweakStore.updateValue(
          timelineId,
          `${clip.key}.duration`,
          clampClipResizeEnd(drag.duration + dt, drag.at, timelineDuration)
        );
      } else if (steps && drag.stepDurations) {
        const limit = Math.max(baseAt, 0);
        const next = clampClipResizeStart(Math.max(drag.at + dt, limit), drag.at, drag.stepDurations[0]);
        TweakStore.updateValues(timelineId, {
          [delayMode ? `${clip.key}.delay` : `${clip.key}.at`]: delayMode ? Math.max(0, next.at - baseAt) : next.at,
          [`${clip.key}.${steps[0].key ?? ""}.duration`]: next.duration
        });
      } else {
        const limit = Math.max(baseAt, 0);
        const next = clampClipResizeStart(Math.max(drag.at + dt, limit), drag.at, drag.duration);
        TweakStore.updateValues(timelineId, {
          [delayMode ? `${clip.key}.delay` : `${clip.key}.at`]: delayMode ? Math.max(0, next.at - baseAt) : next.at,
          [`${clip.key}.duration`]: next.duration
        });
      }
    },
    [baseAt, clip.key, delayMode, onDrag, pxPerSecond, steps, timelineId, timelineDuration]
  );
  const handlePointerUp = (0, import_react50.useCallback)(
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
  const handlePointerCancel = (0, import_react50.useCallback)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(import_jsx_runtime47.Fragment, { children: [
    ghostCycles.map((cycle) => {
      const ghostWidth = Math.max(1, cycle.duration * pxPerSecond - 2);
      return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        "div",
        {
          className: "tweakers-timeline-clip-ghost",
          "data-steps": isSteps || void 0,
          "aria-hidden": "true",
          style: {
            left: (cycle.start - viewStart) * pxPerSecond + 1,
            width: ghostWidth,
            background: clip.color
          },
          children: steps?.map((step, stepIndex) => /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
            "span",
            {
              className: "tweakers-timeline-clip-ghost-segment",
              style: { width: step.duration * pxPerSecond }
            },
            step.key ?? `step:${stepIndex}`
          ))
        },
        `ghost:${cycle.index}`
      );
    }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
      "div",
      {
        className: "tweakers-timeline-clip",
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
        children: composite ? /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(import_jsx_runtime47.Fragment, { children: width > 56 && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "tweakers-timeline-clip-duration", children: durationText }) }) : isSteps ? /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(import_jsx_runtime47.Fragment, { children: [
          steps.map((step) => {
            const segmentWidth = step.duration * pxPerSecond;
            return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
              "div",
              {
                className: "tweakers-timeline-clip-segment",
                "data-step": step.key ?? void 0,
                "data-selected": selectedStepKey === step.key || void 0,
                style: { width: segmentWidth },
                children: segmentWidth > 52 && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "tweakers-timeline-clip-duration", children: formatSeconds(step.duration) })
              },
              step.key ?? "step"
            );
          }),
          steps.map(
            (step, index) => step.isPhysics ? null : /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
              "div",
              {
                className: "tweakers-timeline-clip-handle",
                "data-boundary": index,
                style: { left: boundaryOffsets[index] * pxPerSecond - 4 }
              },
              `boundary:${step.key}`
            )
          ),
          !steps[0].isPhysics && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-clip-handle", "data-edge": "start" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)(import_jsx_runtime47.Fragment, { children: [
          resizable && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-clip-handle", "data-edge": "start" }),
          width > 56 && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "tweakers-timeline-clip-duration", children: durationText }),
          resizable && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("div", { className: "tweakers-timeline-clip-handle", "data-edge": "end" })
        ] })
      }
    ),
    looping && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "tweakers-timeline-loop-infinity", "aria-hidden": "true", title: "Repeats indefinitely", children: "\u221E" })
  ] });
}

// src/components/Module.tsx
var import_jsx_runtime48 = require("react/jsx-runtime");
function Module({ title, enabled, onEnabledChange, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "tweakers-module", children: [
    /* @__PURE__ */ (0, import_jsx_runtime48.jsxs)("div", { className: "tweakers-module-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(Checkbox, { checked: enabled, onChange: onEnabledChange, label: title }),
      /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("span", { className: "tweakers-module-title", children: title })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "tweakers-module-collapse", "data-open": enabled, children: /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "tweakers-module-collapse-clip", children: /* @__PURE__ */ (0, import_jsx_runtime48.jsx)("div", { className: "tweakers-module-inner", children }) }) })
  ] });
}

// src/components/ButtonGroup.tsx
var import_jsx_runtime49 = require("react/jsx-runtime");
function ButtonGroup({ buttons }) {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)("div", { className: "tweakers-button-group", children: buttons.map((button, index) => /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    "button",
    {
      className: "tweakers-button",
      onClick: button.onClick,
      children: button.label
    },
    index
  )) });
}

// src/components/ShortcutsMenu.tsx
var import_react52 = require("react");
var import_react_dom11 = require("react-dom");
var import_react53 = require("motion/react");
var import_jsx_runtime50 = require("react/jsx-runtime");
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
  const [isOpen, setIsOpen] = (0, import_react52.useState)(false);
  const triggerRef = (0, import_react52.useRef)(null);
  const dropdownRef = (0, import_react52.useRef)(null);
  const [pos, setPos] = (0, import_react52.useState)({ top: 0, right: 0 });
  const open = (0, import_react52.useCallback)(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setIsOpen(true);
  }, []);
  const close = (0, import_react52.useCallback)(() => setIsOpen(false), []);
  const toggle2 = (0, import_react52.useCallback)(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);
  (0, import_react52.useEffect)(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);
  const panel = TweakStore.getPanel(panelId);
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
  return /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)(import_jsx_runtime50.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
      import_react53.motion.button,
      {
        ref: triggerRef,
        className: "tweakers-shortcuts-trigger",
        onClick: toggle2,
        title: "Keyboard shortcuts",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("path", { d: "M6 10H6.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("path", { d: "M10 10H10.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("path", { d: "M14 10H14.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("path", { d: "M18 10H18.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("path", { d: "M8 14H16" })
        ] })
      }
    ),
    (0, import_react_dom11.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(import_react53.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-root tweakers-shortcuts-dropdown",
          style: { position: "fixed", top: pos.top, right: pos.right },
          initial: { opacity: 0, y: 4, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "tweakers-shortcuts-title", children: "Keyboard Shortcuts" }),
            /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "tweakers-shortcuts-list", children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime50.jsxs)("div", { className: "tweakers-shortcuts-row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { className: "tweakers-shortcuts-row-key", children: formatShortcutKey(row.shortcut) }),
              /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { className: "tweakers-shortcuts-row-label", children: row.label }),
              /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("span", { className: "tweakers-shortcuts-row-mode", children: formatInteraction(row.shortcut) })
            ] }, row.path)) }),
            /* @__PURE__ */ (0, import_jsx_runtime50.jsx)("div", { className: "tweakers-shortcuts-hint", children: "See pill badges on controls for keys" })
          ]
        }
      ) }),
      document.body
    )
  ] });
}

// src/components/AudioLevelMeter.tsx
var import_react54 = require("react");
var import_jsx_runtime51 = require("react/jsx-runtime");
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
  const [reducedMotion, setReducedMotion] = (0, import_react54.useState)(false);
  (0, import_react54.useEffect)(() => {
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
  const currentTopCellsRef = (0, import_react54.useRef)(activeCellCounts.map((count) => count - 1));
  const currentClippedBandsRef = (0, import_react54.useRef)(clippedBands);
  const cellCountRef = (0, import_react54.useRef)(cellCount);
  const peakStatesRef = (0, import_react54.useRef)([]);
  const clipHoldUntilRef = (0, import_react54.useRef)(clippedBands.map(() => 0));
  const animationFrameRef = (0, import_react54.useRef)(null);
  const reducedMotion = usePrefersReducedMotion();
  const [peakIndices, setPeakIndices] = (0, import_react54.useState)(
    () => activeCellCounts.map((count) => count - 1)
  );
  const [heldClippedBands, setHeldClippedBands] = (0, import_react54.useState)(clippedBands.map(() => false));
  const displayedClippedBands = heldClippedBands.map(
    (isHeld, index) => isHeld || clippedBands[index]
  );
  const displayedPeakIndices = peakIndices.map(
    (index) => remapPeakIndex(index, cellCountRef.current, cellCount)
  );
  const colors = (props.colors ?? []).slice(0, 3).filter(
    (color) => typeof color === "string" && color.trim().length > 0
  );
  (0, import_react54.useEffect)(() => {
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
  (0, import_react54.useEffect)(
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
  const rootClassName = ["tweakers-root", "tweakers-audio-meter", props.className].filter(Boolean).join(" ");
  const rootStyle = {
    ...props.style,
    "--tweak-meter-band-count": levels.length,
    "--tweak-meter-cell-count": cellCount
  };
  return /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(
    "div",
    {
      className: rootClassName,
      style: rootStyle,
      "data-mode": mode,
      "data-clipping": hasClipping || void 0,
      role: "img",
      "aria-label": accessibleSummary,
      children: /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("div", { className: "tweakers-audio-meter__bands", "aria-hidden": "true", children: activeCellCounts.map((activeCellCount, bandIndex) => /* @__PURE__ */ (0, import_jsx_runtime51.jsx)("div", { className: "tweakers-audio-meter__band", children: Array.from({ length: cellCount }, (_, visualIndex) => {
        const indexFromBottom = cellCount - visualIndex - 1;
        const isActive = indexFromBottom < activeCellCount;
        const isPeak = indexFromBottom === displayedPeakIndices[bandIndex];
        const isClipped = displayedClippedBands[bandIndex] && indexFromBottom === cellCount - 1;
        const color = getCellColor(colors, indexFromBottom, cellCount);
        const cellStyle = color ? { "--tweak-meter-cell-color": color } : void 0;
        return /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(
          "span",
          {
            className: "tweakers-audio-meter__cell",
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
  ADSR_DEF,
  ADSR_STAGE_MAX,
  AnalyserRow,
  AnalyserVisualization,
  AudioLevelMeter,
  ButtonGroup,
  COLOR_FORMATS,
  CURVE_CYCLE,
  CURVE_DEF,
  CURVE_DEFAULT_HEIGHT,
  CURVE_FIT_PADDING,
  CURVE_LABELS,
  CURVE_MAX_CLIPS,
  CURVE_MAX_DURATION,
  CURVE_MAX_HEIGHT,
  CURVE_MIN_DURATION,
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
  ENV_BEND_STAGES,
  EasingVisualization,
  FILTER_DB_CEIL,
  FILTER_DB_FLOOR,
  FileControl,
  FilterControl,
  Folder,
  GalleryControl,
  GradientControl,
  GradientPanel,
  ICON_MOVE_CAPTURE,
  ICON_MOVE_ENTER,
  LFO_DEF,
  LFO_SYNC_DIVISIONS,
  ListControl,
  ListScreen,
  MIN_STOPS,
  MOD_COLORS,
  MOD_PAGE_DIALS,
  MOD_RING_CIRCUMFERENCE,
  MOD_RING_RADIUS,
  MOD_SETTINGS_PANEL,
  MOD_SLOTS,
  MOD_TOUCH_GRACE_MS,
  MOVE_DIALS,
  MOVE_FUNCTION_BUTTONS,
  MOVE_FUNCTION_MANIFEST,
  MOVE_PADS,
  MOVE_SLOT_LIBRARY,
  MOVE_SPECIAL_BUTTONS,
  MOVE_TRACKS,
  MOVE_WAVEFORM_STEPS,
  ModulationStore,
  Module,
  MoveActionButton,
  MoveFunctions,
  MovePanel,
  MoveSlotDefaultBody,
  MoveSlotEnumBody,
  MoveSlotEnvBody,
  MoveSlotFilterBody,
  MoveSlotGlyph,
  MoveSlotRangeBody,
  MoveSlotReadout,
  MoveSlotScopeBody,
  MoveSlotShape,
  MoveSurfaceStore,
  MoveVolumeDisplay,
  MoveWaveform,
  MoveWaveformStore,
  MultiSelectControl,
  NumberControl,
  PresetManager,
  RangeSlider,
  SH_DEF,
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
  TweakRoot,
  TweakStore,
  TweakTimeline,
  WaveformVisualization,
  XYControl,
  XYPad,
  XY_DEFAULT_STEP,
  XY_DETENT_PX,
  addDriver,
  addStop,
  applyDetentAxis,
  applyModulation,
  buildModMovePage,
  buildMovePages,
  buildSamplers,
  centerValue,
  clamp,
  clampCurveHeight,
  clampOklchToSrgb,
  clampRange,
  colorAtPosition,
  curveComposition,
  curveDuration,
  curvePathData,
  curveY,
  cycleDriverType,
  cycleSegmentType,
  defaultComposition,
  defaultFilterResponse,
  defaultListItemParams,
  denormalizeEnumDial,
  denormalizeFilterDial,
  denormalizeRangeDial,
  dialOrigin,
  dialSpan,
  displayHex,
  enumOptionIcon,
  envCurveParam,
  envelopeJoints,
  envelopePoints,
  filterHand01,
  filterHandValue,
  filterResponsePath,
  filterShapePath,
  filterShapeResponse,
  flipDriver,
  flipDriverX,
  flipDriverY,
  flipSegment,
  flipSegmentX,
  flipSegmentY,
  formatClock,
  formatHex,
  getModType,
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
  isSpanContinuation,
  lfoSyncedHz,
  listModTypes,
  loopFromStep,
  loopSteps,
  modColor,
  modKey,
  modPageLayout,
  modPageWidth,
  modRingArc,
  moveAppPadRow,
  movePadRows,
  moveSlotKind,
  moveStop,
  moveWaveformDefaultView,
  nearestHandle,
  normToValue,
  normalizeCurveMarkers,
  normalizeDial,
  normalizeEnumDial,
  normalizeFilterDial,
  normalizeFilterValue,
  normalizeGradient,
  normalizeHex,
  normalizeListItems,
  normalizeRangeDial,
  normalizeValue,
  normalizeXYDial,
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
  registerModType,
  removeDriver,
  removeSegment,
  removeStop,
  resolveAxis,
  resolveFilterAxis,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  scrubBy,
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
  springify,
  stepPosition,
  triggerLevels,
  triggersCrossed,
  useTweakTimeline,
  useTweakers,
  valueFromPoint,
  valueToNorm,
  valueToPercent,
  visibleColumns,
  visibleModControls,
  zoomBy
});
//# sourceMappingURL=index.cjs.map