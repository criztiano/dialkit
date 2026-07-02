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

// src/solid/index.ts
var solid_exports = {};
__export(solid_exports, {
  ButtonGroup: () => ButtonGroup,
  ColorControl: () => ColorControl,
  ColorPickerPanel: () => ColorPickerPanel,
  CurveComposer: () => CurveComposer,
  DialRoot: () => DialRoot,
  DialStore: () => DialStore,
  Folder: () => Folder,
  Module: () => Module,
  PresetManager: () => PresetManager,
  RangeSlider: () => RangeSlider,
  SegmentedControl: () => SegmentedControl,
  SelectControl: () => SelectControl,
  Slider: () => Slider,
  SpringControl: () => SpringControl,
  SpringVisualization: () => SpringVisualization,
  TextControl: () => TextControl,
  Toggle: () => Toggle,
  WaveformVisualization: () => WaveformVisualization,
  createDialKit: () => createDialKit
});
module.exports = __toCommonJS(solid_exports);

// src/solid/createDialKit.ts
var import_solid_js = require("solid-js");

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

// src/range-slider-core.ts
function clamp2(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
function orderRange(v) {
  return v.min <= v.max ? v : { min: v.max, max: v.min };
}
function clampRange(v, min, max) {
  return orderRange({ min: clamp2(v.min, min, max), max: clamp2(v.max, min, max) });
}
function setLow(nextLow, current, min) {
  return { min: clamp2(nextLow, min, current.max), max: current.max };
}
function setHigh(nextHigh, current, max) {
  return { min: current.min, max: clamp2(nextHigh, current.min, max) };
}
function shiftSpan(deltaValue, current, min, max) {
  const width = current.max - current.min;
  const desiredMin = clamp2(current.min + deltaValue, min, max - width);
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

// src/store/DialStore.ts
var EMPTY_VALUES = Object.freeze({});
var DialStoreClass = class {
  constructor() {
    this.panels = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
    this.globalListeners = /* @__PURE__ */ new Set();
    this.snapshots = /* @__PURE__ */ new Map();
    this.actionListeners = /* @__PURE__ */ new Map();
    this.eventListeners = /* @__PURE__ */ new Map();
    this.presets = /* @__PURE__ */ new Map();
    this.activePreset = /* @__PURE__ */ new Map();
    this.baseValues = /* @__PURE__ */ new Map();
  }
  registerPanel(id, name, config, shortcuts) {
    const controls = this.parseConfig(config, "", shortcuts);
    const values = this.flattenValues(config, "");
    this.initTransitionModes(config, "", values);
    this.panels.set(id, { id, name, controls, values, shortcuts: shortcuts ?? {} });
    this.snapshots.set(id, { ...values });
    this.baseValues.set(id, { ...values });
    this.notifyGlobal();
  }
  updatePanel(id, name, config, shortcuts) {
    const existing = this.panels.get(id);
    if (!existing) {
      this.registerPanel(id, name, config, shortcuts);
      return;
    }
    const controls = this.parseConfig(config, "", shortcuts);
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
    const nextPanel = { id, name, controls, values: nextValues, shortcuts: shortcuts ?? existing.shortcuts };
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
    this.notify(id);
    this.notifyGlobal();
  }
  unregisterPanel(id) {
    this.panels.delete(id);
    this.listeners.delete(id);
    this.snapshots.delete(id);
    this.actionListeners.delete(id);
    this.eventListeners.delete(id);
    this.baseValues.delete(id);
    this.notifyGlobal();
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
  getPanels() {
    return Array.from(this.panels.values());
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
      this.listeners.get(panelId)?.delete(listener);
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
      this.actionListeners.get(panelId)?.delete(listener);
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
      this.eventListeners.get(panelId)?.delete(listener);
    };
  }
  emitEvent(panelId, path, event) {
    this.eventListeners.get(panelId)?.forEach((fn) => fn(path, event));
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
      if (key === "_collapsed") continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (this.isEasingConfig(value)) {
        values[`${path}.__mode`] = "easing";
      } else if (this.isSpringConfig(value)) {
        const hasPhysics = value.stiffness !== void 0 || value.damping !== void 0 || value.mass !== void 0;
        const hasTime = value.visualDuration !== void 0 || value.bounce !== void 0;
        values[`${path}.__mode`] = hasPhysics && !hasTime ? "advanced" : "simple";
      } else if (typeof value === "object" && value !== null && !Array.isArray(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isColorConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isListConfig(value)) {
        this.initTransitionModes(value, path, values);
      }
    }
  }
  parseConfig(config, prefix, shortcuts) {
    const controls = [];
    for (const [key, value] of Object.entries(config)) {
      if (key === "_collapsed") continue;
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
      } else if (this.isListConfig(value)) {
        controls.push({ type: "list", path, label, itemTypes: value.itemTypes, addLabel: value.addLabel, maxItems: value.max });
      } else if (typeof value === "string") {
        if (this.isHexColor(value)) {
          const hasAlpha = value.length === 5 || value.length === 9;
          controls.push({ type: "color", path, label, alpha: hasAlpha || void 0 });
        } else {
          controls.push({ type: "text", path, label });
        }
      } else if (typeof value === "object" && value !== null) {
        const folderConfig = value;
        const defaultOpen = "_collapsed" in folderConfig ? !folderConfig._collapsed : true;
        controls.push({
          type: "folder",
          path,
          label,
          defaultOpen,
          children: this.parseConfig(folderConfig, path, shortcuts)
        });
      }
    }
    return controls;
  }
  flattenValues(config, prefix) {
    const values = {};
    for (const [key, value] of Object.entries(config)) {
      if (key === "_collapsed") continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(value) && value.length <= 4 && typeof value[0] === "number") {
        values[path] = value[0];
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
      } else if (this.isListConfig(value)) {
        values[path] = normalizeListItems(value);
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
  mapControlsByPath(controls) {
    const map = /* @__PURE__ */ new Map();
    const visit = (nodes) => {
      for (const node of nodes) {
        if (node.type === "folder" && node.children) {
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
function parseListItemSchema(schema) {
  const fields = [];
  for (const [key, def] of Object.entries(schema)) {
    const label = listFormatLabel(key);
    if (Array.isArray(def) && def.length <= 4 && typeof def[0] === "number") {
      const [d, min, max, step] = def;
      fields.push({ key, label, kind: "slider", min, max, step: step ?? listInferStep(min, max), defaultValue: d });
    } else if (typeof def === "number") {
      const { min, max, step } = listInferRange(def);
      fields.push({ key, label, kind: "slider", min, max, step, defaultValue: def });
    } else if (typeof def === "boolean") {
      fields.push({ key, label, kind: "toggle", defaultValue: def });
    } else if (listHasType(def, "select") && Array.isArray(def.options)) {
      const select = def;
      const first = select.options[0];
      const firstValue = typeof first === "string" ? first : first?.value ?? "";
      fields.push({ key, label, kind: "select", options: select.options, defaultValue: select.default ?? firstValue });
    } else if (listHasType(def, "color")) {
      fields.push({ key, label, kind: "color", defaultValue: def.default ?? "#000000" });
    } else if (listHasType(def, "text")) {
      const text = def;
      fields.push({ key, label, kind: "text", placeholder: text.placeholder, defaultValue: text.default ?? "" });
    } else if (typeof def === "string") {
      fields.push({ key, label, kind: listIsHexColor(def) ? "color" : "text", defaultValue: def });
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
  return items.filter((item) => item && typeof item.type === "string" && config.itemTypes[item.type]).map((item) => ({
    type: item.type,
    params: { ...defaultListItemParams(config.itemTypes[item.type].schema), ...item.params ?? {} }
  }));
}
var DialStore = new DialStoreClass();

// src/solid/createDialKit.ts
function createDialKit(name, config, options) {
  const id = (0, import_solid_js.createUniqueId)();
  const panelId = `${name}-${id}`;
  const [values, setValues] = (0, import_solid_js.createSignal)(
    DialStore.getValues(panelId)
  );
  (0, import_solid_js.onMount)(() => {
    DialStore.registerPanel(panelId, name, config, options?.shortcuts);
    setValues(DialStore.getValues(panelId));
    const unsubValues = DialStore.subscribe(panelId, () => {
      setValues(DialStore.getValues(panelId));
    });
    const unsubActions = options?.onAction ? DialStore.subscribeActions(panelId, options.onAction) : void 0;
    (0, import_solid_js.onCleanup)(() => {
      unsubValues();
      unsubActions?.();
      DialStore.unregisterPanel(panelId);
    });
  });
  return (0, import_solid_js.createMemo)(() => buildResolvedValues(config, values(), ""));
}
function buildResolvedValues(config, flatValues, prefix) {
  const result = {};
  for (const [key, configValue] of Object.entries(config)) {
    if (key === "_collapsed") continue;
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
function isTextConfig(value) {
  return hasType(value, "text");
}
function getFirstOptionValue(options) {
  const first = options[0];
  return typeof first === "string" ? first : first.value;
}

// src/solid/components/DialRoot.tsx
var import_web106 = require("solid-js/web");
var import_web107 = require("solid-js/web");
var import_web108 = require("solid-js/web");
var import_web109 = require("solid-js/web");
var import_web110 = require("solid-js/web");
var import_web111 = require("solid-js/web");
var import_solid_js15 = require("solid-js");
var import_web112 = require("solid-js/web");

// src/solid/components/ShortcutListener.tsx
var import_web = require("solid-js/web");
var import_solid_js2 = require("solid-js");

// src/shortcut-utils.ts
function decimalsForStep(step) {
  const s = step.toString();
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}
function roundValue(val, step) {
  const raw = Math.round(val / step) * step;
  return parseFloat(raw.toFixed(decimalsForStep(step)));
}
function getEffectiveStep(control, shortcut) {
  const min = control.min ?? 0;
  const max = control.max ?? 1;
  const range = max - min;
  const mode = shortcut.mode ?? "normal";
  return mode === "fine" ? range * 0.01 : mode === "coarse" ? range * 0.1 : control.step ?? 1;
}
function applySliderDelta(panelId, path, control, effectiveStep, direction) {
  const currentValue = DialStore.getValue(panelId, path);
  const min = control.min ?? 0;
  const max = control.max ?? 1;
  const newValue = Math.max(min, Math.min(max, currentValue + direction * effectiveStep));
  DialStore.updateValue(panelId, path, roundValue(newValue, effectiveStep));
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
var ShortcutContext = (0, import_solid_js2.createContext)(() => defaultState);
function useShortcutContext() {
  return (0, import_solid_js2.useContext)(ShortcutContext);
}
function ShortcutListener(props) {
  const [activeShortcut, setActiveShortcut] = (0, import_solid_js2.createSignal)(defaultState);
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
  (0, import_solid_js2.onMount)(() => {
    const handleKeyDown = (e) => {
      if (isInputFocused()) return;
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
        if (activeKeys.size > 0) {
          const target2 = resolveActiveTarget("scroll") || resolveActiveTarget("drag") || resolveActiveTarget("move");
          if (target2 && target2.control.type === "slider") {
            e.preventDefault();
            const direction = key === "arrowright" || key === "arrowup" ? 1 : -1;
            const effectiveStep = getEffectiveStep(target2.control, target2.shortcut);
            applySliderDelta(target2.panelId, target2.path, target2.control, effectiveStep, direction);
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
          const effectiveStep = getEffectiveStep(control, control.shortcut);
          const direction = e.deltaY > 0 ? -1 : 1;
          applySliderDelta(panelId, path, control, effectiveStep, direction);
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
        const effectiveStep = getEffectiveStep(control, shortcut);
        const direction = e.deltaY > 0 ? -1 : 1;
        applySliderDelta(panelId, path, control, effectiveStep, direction);
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
          const effectiveStep = getEffectiveStep(target.control, target.shortcut);
          const steps = Math.trunc(dragAccumulator / DRAG_SENSITIVITY);
          if (steps !== 0) {
            dragAccumulator -= steps * DRAG_SENSITIVITY;
            applySliderDelta(target.panelId, target.path, target.control, effectiveStep, steps);
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
        const effectiveStep = getEffectiveStep(moveTarget.control, moveTarget.shortcut);
        const steps = Math.trunc(dragAccumulator / DRAG_SENSITIVITY);
        if (steps !== 0) {
          dragAccumulator -= steps * DRAG_SENSITIVITY;
          applySliderDelta(moveTarget.panelId, moveTarget.path, moveTarget.control, effectiveStep, steps);
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
    (0, import_solid_js2.onCleanup)(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    });
  });
  return (0, import_web.createComponent)(ShortcutContext.Provider, {
    value: activeShortcut,
    get children() {
      return props.children;
    }
  });
}

// src/solid/components/Panel.tsx
var import_web98 = require("solid-js/web");
var import_web99 = require("solid-js/web");
var import_web100 = require("solid-js/web");
var import_web101 = require("solid-js/web");
var import_web102 = require("solid-js/web");
var import_web103 = require("solid-js/web");
var import_web104 = require("solid-js/web");
var import_web105 = require("solid-js/web");
var import_solid_js14 = require("solid-js");
var import_motion7 = require("motion");

// src/icons.ts
var ICON_CHEVRON = "M6 9.5L12 15.5L18 9.5";
var ICON_CHECK = "M5 12.75L10 19L19 5";
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
var import_web2 = require("solid-js/web");
var import_web3 = require("solid-js/web");
var import_web4 = require("solid-js/web");
var import_web5 = require("solid-js/web");
var import_web6 = require("solid-js/web");
var import_web7 = require("solid-js/web");
var import_web8 = require("solid-js/web");
var import_web9 = require("solid-js/web");
var import_web10 = require("solid-js/web");
var import_web11 = require("solid-js/web");
var import_solid_js3 = require("solid-js");
var import_motion = require("motion");
var _tmpl$ = /* @__PURE__ */ (0, import_web2.template)(`<div class=dialkit-panel-toolbar>`);
var _tmpl$2 = /* @__PURE__ */ (0, import_web2.template)(`<div class=dialkit-folder-content><div class=dialkit-folder-inner>`);
var _tmpl$3 = /* @__PURE__ */ (0, import_web2.template)(`<div><div><div class=dialkit-folder-header-top>`);
var _tmpl$4 = /* @__PURE__ */ (0, import_web2.template)(`<div class=dialkit-folder-title-row><span class="dialkit-folder-title dialkit-folder-title-root">`);
var _tmpl$5 = /* @__PURE__ */ (0, import_web2.template)(`<div class=dialkit-folder-title-row><span class=dialkit-folder-title>`);
var _tmpl$6 = /* @__PURE__ */ (0, import_web2.template)(`<svg class=dialkit-panel-icon viewBox="0 0 16 16"fill=none><path opacity=0.5 fill=currentColor></path><circle fill=currentColor stroke=currentColor stroke-width=1.25></circle><circle fill=currentColor stroke=currentColor stroke-width=1.25></circle><circle fill=currentColor stroke=currentColor stroke-width=1.25>`);
var _tmpl$7 = /* @__PURE__ */ (0, import_web2.template)(`<svg class=dialkit-folder-icon viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$8 = /* @__PURE__ */ (0, import_web2.template)(`<div class="dialkit-panel-inner dialkit-panel-inline">`);
var _tmpl$9 = /* @__PURE__ */ (0, import_web2.template)(`<div class=dialkit-panel-inner>`);
function Folder(props) {
  const [isOpen, setIsOpen] = (0, import_solid_js3.createSignal)(props.defaultOpen ?? true);
  const [isCollapsed, setIsCollapsed] = (0, import_solid_js3.createSignal)(!(props.defaultOpen ?? true));
  const [contentHeight, setContentHeight] = (0, import_solid_js3.createSignal)(void 0);
  const [windowHeight, setWindowHeight] = (0, import_solid_js3.createSignal)(typeof window !== "undefined" ? window.innerHeight : 800);
  if (props.isRoot) {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    (0, import_solid_js3.onCleanup)(() => window.removeEventListener("resize", onResize));
  }
  const [contentMounted, setContentMounted] = (0, import_solid_js3.createSignal)(props.defaultOpen ?? true);
  let skipFirstAnim = props.defaultOpen ?? true;
  let sectionContentRef;
  let sectionAnim = null;
  let folderChevronRef;
  let chevronAnim = null;
  let chevronInitialized = false;
  let panelTapAnim = null;
  let contentRef;
  (0, import_solid_js3.createEffect)(() => {
    if (!props.isRoot || !isOpen()) return;
    const el = contentRef;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      setContentHeight((prev) => prev === h ? prev : h);
    });
    ro.observe(el);
    (0, import_solid_js3.onCleanup)(() => ro.disconnect());
  });
  (0, import_solid_js3.createEffect)(() => {
    if (props.isRoot || !folderChevronRef) return;
    const open = isOpen();
    chevronAnim?.stop();
    if (!chevronInitialized) {
      folderChevronRef.style.transform = `rotate(${open ? 0 : 180}deg)`;
      chevronInitialized = true;
      return;
    }
    chevronAnim = (0, import_motion.animate)(folderChevronRef, {
      rotate: open ? 0 : 180
    }, {
      type: "spring",
      visualDuration: 0.35,
      bounce: 0.15
    });
    (0, import_solid_js3.onCleanup)(() => chevronAnim?.stop());
  });
  const handleToggle = () => {
    if (props.inline && props.isRoot) return;
    const next = !isOpen();
    setIsOpen(next);
    if (next) {
      setIsCollapsed(false);
      if (!props.isRoot) {
        sectionAnim?.stop();
        sectionAnim = null;
        if (sectionContentRef) {
          sectionAnim = (0, import_motion.animate)(sectionContentRef, {
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
          sectionAnim = (0, import_motion.animate)(sectionContentRef, {
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
    var _el$ = _tmpl$3(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
    (0, import_web11.use)((el) => {
      if (props.isRoot) contentRef = el;
    }, _el$);
    _el$2.$$click = handleToggle;
    (0, import_web9.insert)(_el$3, (() => {
      var _c$ = (0, import_web10.memo)(() => !!props.isRoot);
      return () => _c$() ? (0, import_web8.createComponent)(import_solid_js3.Show, {
        get when() {
          return isOpen();
        },
        get children() {
          var _el$7 = _tmpl$4(), _el$8 = _el$7.firstChild;
          (0, import_web9.insert)(_el$8, () => props.title);
          return _el$7;
        }
      }) : (() => {
        var _el$9 = _tmpl$5(), _el$0 = _el$9.firstChild;
        (0, import_web9.insert)(_el$0, () => props.title);
        return _el$9;
      })();
    })(), null);
    (0, import_web9.insert)(_el$3, (() => {
      var _c$2 = (0, import_web10.memo)(() => !!(props.isRoot && !props.inline));
      return () => _c$2() && (() => {
        var _el$1 = _tmpl$6(), _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling;
        (0, import_web7.effect)((_p$) => {
          var _v$3 = ICON_PANEL.path, _v$4 = ICON_PANEL.circles[0].cx, _v$5 = ICON_PANEL.circles[0].cy, _v$6 = ICON_PANEL.circles[0].r, _v$7 = ICON_PANEL.circles[1].cx, _v$8 = ICON_PANEL.circles[1].cy, _v$9 = ICON_PANEL.circles[1].r, _v$0 = ICON_PANEL.circles[2].cx, _v$1 = ICON_PANEL.circles[2].cy, _v$10 = ICON_PANEL.circles[2].r;
          _v$3 !== _p$.e && (0, import_web4.setAttribute)(_el$10, "d", _p$.e = _v$3);
          _v$4 !== _p$.t && (0, import_web4.setAttribute)(_el$11, "cx", _p$.t = _v$4);
          _v$5 !== _p$.a && (0, import_web4.setAttribute)(_el$11, "cy", _p$.a = _v$5);
          _v$6 !== _p$.o && (0, import_web4.setAttribute)(_el$11, "r", _p$.o = _v$6);
          _v$7 !== _p$.i && (0, import_web4.setAttribute)(_el$12, "cx", _p$.i = _v$7);
          _v$8 !== _p$.n && (0, import_web4.setAttribute)(_el$12, "cy", _p$.n = _v$8);
          _v$9 !== _p$.s && (0, import_web4.setAttribute)(_el$12, "r", _p$.s = _v$9);
          _v$0 !== _p$.h && (0, import_web4.setAttribute)(_el$13, "cx", _p$.h = _v$0);
          _v$1 !== _p$.r && (0, import_web4.setAttribute)(_el$13, "cy", _p$.r = _v$1);
          _v$10 !== _p$.d && (0, import_web4.setAttribute)(_el$13, "r", _p$.d = _v$10);
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
        return _el$1;
      })();
    })(), null);
    (0, import_web9.insert)(_el$3, (() => {
      var _c$3 = (0, import_web10.memo)(() => !!!props.isRoot);
      return () => _c$3() && (() => {
        var _el$14 = _tmpl$7(), _el$15 = _el$14.firstChild;
        var _ref$ = folderChevronRef;
        typeof _ref$ === "function" ? (0, import_web11.use)(_ref$, _el$14) : folderChevronRef = _el$14;
        (0, import_web4.setAttribute)(_el$15, "d", ICON_CHEVRON);
        return _el$14;
      })();
    })(), null);
    (0, import_web9.insert)(_el$2, (0, import_web8.createComponent)(import_solid_js3.Show, {
      get when() {
        return (0, import_web10.memo)(() => !!(props.isRoot && props.toolbar))() && isOpen();
      },
      get children() {
        var _el$4 = _tmpl$();
        _el$4.$$click = (e) => e.stopPropagation();
        (0, import_web9.insert)(_el$4, () => props.toolbar);
        return _el$4;
      }
    }), null);
    (0, import_web9.insert)(_el$, (0, import_web8.createComponent)(import_solid_js3.Show, {
      get when() {
        return (0, import_web10.memo)(() => !!props.isRoot)() ? isOpen() : contentMounted();
      },
      get children() {
        var _el$5 = _tmpl$2(), _el$6 = _el$5.firstChild;
        (0, import_web11.use)((el) => {
          if (props.isRoot) return;
          sectionContentRef = el;
          if (skipFirstAnim) {
            skipFirstAnim = false;
            return;
          }
          sectionAnim?.stop();
          el.style.height = "0px";
          el.style.opacity = "0";
          sectionAnim = (0, import_motion.animate)(el, {
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
        }, _el$5);
        (0, import_web9.insert)(_el$6, () => props.children);
        (0, import_web7.effect)((_$p) => (0, import_web6.style)(_el$5, !props.isRoot ? {
          "clip-path": "inset(0 -20px)"
        } : void 0, _$p));
        return _el$5;
      }
    }), null);
    (0, import_web7.effect)((_p$) => {
      var _v$ = `dialkit-folder ${props.isRoot ? "dialkit-folder-root" : ""}`, _v$2 = `dialkit-folder-header ${props.isRoot ? "dialkit-panel-header" : ""}`;
      _v$ !== _p$.e && (0, import_web5.className)(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web5.className)(_el$2, _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
  if (props.isRoot) {
    if (props.inline) {
      return (() => {
        var _el$16 = _tmpl$8();
        (0, import_web9.insert)(_el$16, folderContent);
        return _el$16;
      })();
    }
    let panelRef;
    let rootPanelAnim = null;
    let rootPanelInitialized = false;
    let lastRootOpen = isOpen();
    (0, import_solid_js3.createEffect)(() => {
      if (!panelRef || isOpen()) return;
      const handler = (e) => {
        e.stopPropagation();
        handleToggle();
      };
      panelRef.addEventListener("click", handler);
      (0, import_solid_js3.onCleanup)(() => panelRef.removeEventListener("click", handler));
    });
    (0, import_solid_js3.createEffect)(() => {
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
        rootPanelAnim = (0, import_motion.animate)(panelRef, target, {
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
    (0, import_solid_js3.onCleanup)(() => {
      rootPanelAnim?.stop();
      panelTapAnim?.stop();
    });
    return (() => {
      var _el$17 = _tmpl$9();
      _el$17.addEventListener("pointerleave", () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      });
      _el$17.addEventListener("pointercancel", () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      });
      _el$17.$$pointerup = () => {
        if (isOpen()) return;
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 1
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      };
      _el$17.$$pointerdown = () => {
        if (isOpen()) return;
        document.activeElement?.blur?.();
        panelTapAnim?.stop();
        panelTapAnim = (0, import_motion.animate)(panelRef, {
          scale: 0.9
        }, {
          type: "spring",
          visualDuration: 0.15,
          bounce: 0.3
        });
      };
      var _ref$2 = panelRef;
      typeof _ref$2 === "function" ? (0, import_web11.use)(_ref$2, _el$17) : panelRef = _el$17;
      (0, import_web9.insert)(_el$17, folderContent);
      (0, import_web7.effect)(() => (0, import_web4.setAttribute)(_el$17, "data-collapsed", String(isCollapsed())));
      return _el$17;
    })();
  }
  return folderContent();
}
(0, import_web3.delegateEvents)(["click", "pointerdown", "pointerup"]);

// src/solid/components/Slider.tsx
var import_web12 = require("solid-js/web");
var import_web13 = require("solid-js/web");
var import_web14 = require("solid-js/web");
var import_web15 = require("solid-js/web");
var import_web16 = require("solid-js/web");
var import_web17 = require("solid-js/web");
var import_web18 = require("solid-js/web");
var import_web19 = require("solid-js/web");
var import_web20 = require("solid-js/web");
var import_solid_js4 = require("solid-js");
var import_motion2 = require("motion");
var _tmpl$10 = /* @__PURE__ */ (0, import_web12.template)(`<div class=dialkit-slider-hashmark>`);
var _tmpl$22 = /* @__PURE__ */ (0, import_web12.template)(`<span>`);
var _tmpl$32 = /* @__PURE__ */ (0, import_web12.template)(`<div class=dialkit-slider-wrapper><div><div class=dialkit-slider-hashmarks></div><div class=dialkit-slider-fill></div><div class=dialkit-slider-handle style="transform:translateY(-50%) scaleX(0.25) scaleY(1);opacity:0"></div><span class=dialkit-slider-label>`);
var _tmpl$42 = /* @__PURE__ */ (0, import_web12.template)(`<input type=text class=dialkit-slider-input>`);
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
  const [isInteracting, setIsInteracting] = (0, import_solid_js4.createSignal)(false);
  const [isDragging, setIsDragging] = (0, import_solid_js4.createSignal)(false);
  const [isHovered, setIsHovered] = (0, import_solid_js4.createSignal)(false);
  const [isValueHovered, setIsValueHovered] = (0, import_solid_js4.createSignal)(false);
  const [isValueEditable, setIsValueEditable] = (0, import_solid_js4.createSignal)(false);
  const [showInput, setShowInput] = (0, import_solid_js4.createSignal)(false);
  const [inputValue, setInputValue] = (0, import_solid_js4.createSignal)("");
  const fillPercent = (0, import_motion2.motionValue)((props.value - min()) / (max() - min()) * 100);
  const rubberStretchPx = (0, import_motion2.motionValue)(0);
  const handleOpacityMv = (0, import_motion2.motionValue)(0);
  const handleScaleXMv = (0, import_motion2.motionValue)(0.25);
  const handleScaleYMv = (0, import_motion2.motionValue)(1);
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
  (0, import_solid_js4.createEffect)(() => {
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
      snapAnim = (0, import_motion2.animate)(fillPercent, newPct, {
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
      rubberAnim = (0, import_motion2.animate)(rubberStretchPx, 0, {
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
  (0, import_solid_js4.createEffect)(() => {
    const hovered = isValueHovered();
    const editing = showInput();
    const editable = isValueEditable();
    (0, import_solid_js4.onCleanup)(() => {
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
  (0, import_solid_js4.onCleanup)(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    snapAnim?.stop();
    rubberAnim?.stop();
    handleOpacityAnim?.stop();
    handleScaleXAnim?.stop();
    handleScaleYAnim?.stop();
  });
  (0, import_solid_js4.onMount)(() => {
    const unsubFill = fillPercent.on("change", applyFillStyles);
    const unsubRubber = rubberStretchPx.on("change", applyRubberStyles);
    const unsubHandleOpacity = handleOpacityMv.on("change", applyHandleVisualStyles);
    const unsubHandleScaleX = handleScaleXMv.on("change", applyHandleVisualStyles);
    const unsubHandleScaleY = handleScaleYMv.on("change", applyHandleVisualStyles);
    applyFillStyles(fillPercent.get());
    applyRubberStyles(rubberStretchPx.get());
    applyHandleVisualStyles();
    (0, import_solid_js4.onCleanup)(() => {
      unsubFill();
      unsubRubber();
      unsubHandleOpacity();
      unsubHandleScaleX();
      unsubHandleScaleY();
    });
  });
  (0, import_solid_js4.createEffect)(() => {
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
      setInputValue(props.value.toFixed(decimalsForStep(step())));
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleInputSubmit();
    else if (e.key === "Escape") {
      setShowInput(false);
      setIsValueHovered(false);
    }
  };
  const displayValue = () => props.value.toFixed(decimalsForStep(step()));
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
  (0, import_solid_js4.createEffect)(() => {
    const targetOpacity = handleOpacity();
    const targetScaleX = isActive() ? 1 : 0.25;
    const targetScaleY = isActive() && valueDodge() ? 0.75 : 1;
    handleOpacityAnim?.stop();
    handleScaleXAnim?.stop();
    handleScaleYAnim?.stop();
    handleOpacityAnim = (0, import_motion2.animate)(handleOpacityMv, targetOpacity, {
      duration: 0.15
    });
    handleScaleXAnim = (0, import_motion2.animate)(handleScaleXMv, targetScaleX, {
      type: "spring",
      visualDuration: 0.25,
      bounce: 0.15
    });
    handleScaleYAnim = (0, import_motion2.animate)(handleScaleYMv, targetScaleY, {
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
          var _el$ = _tmpl$10();
          (0, import_web20.setStyleProperty)(_el$, "left", `${pct}%`);
          return _el$;
        })();
      });
    }
    return Array.from({
      length: 9
    }, (_, i) => {
      const pct = (i + 1) * 10;
      return (() => {
        var _el$2 = _tmpl$10();
        (0, import_web20.setStyleProperty)(_el$2, "left", `${pct}%`);
        return _el$2;
      })();
    });
  };
  return (() => {
    var _el$3 = _tmpl$32(), _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling;
    var _ref$ = wrapperRef;
    typeof _ref$ === "function" ? (0, import_web19.use)(_ref$, _el$3) : wrapperRef = _el$3;
    _el$4.addEventListener("mouseleave", () => setIsHovered(false));
    _el$4.addEventListener("mouseenter", () => setIsHovered(true));
    _el$4.addEventListener("pointercancel", handlePointerCancel);
    _el$4.$$pointerup = handlePointerUp;
    _el$4.$$pointermove = handlePointerMove;
    _el$4.$$pointerdown = handlePointerDown;
    var _ref$2 = trackRef;
    typeof _ref$2 === "function" ? (0, import_web19.use)(_ref$2, _el$4) : trackRef = _el$4;
    (0, import_web18.insert)(_el$5, hashMarks);
    var _ref$3 = fillRef;
    typeof _ref$3 === "function" ? (0, import_web19.use)(_ref$3, _el$6) : fillRef = _el$6;
    var _ref$4 = handleRef;
    typeof _ref$4 === "function" ? (0, import_web19.use)(_ref$4, _el$7) : handleRef = _el$7;
    var _ref$5 = labelRef;
    typeof _ref$5 === "function" ? (0, import_web19.use)(_ref$5, _el$8) : labelRef = _el$8;
    (0, import_web18.insert)(_el$8, () => props.label, null);
    (0, import_web18.insert)(_el$8, (0, import_web15.createComponent)(import_solid_js4.Show, {
      get when() {
        return props.shortcut;
      },
      get children() {
        var _el$9 = _tmpl$22();
        (0, import_web18.insert)(_el$9, () => formatSliderShortcut(props.shortcut));
        (0, import_web17.effect)(() => (0, import_web16.className)(_el$9, `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`));
        return _el$9;
      }
    }), null);
    (0, import_web18.insert)(_el$4, (() => {
      var _c$ = (0, import_web14.memo)(() => !!showInput());
      return () => _c$() ? (() => {
        var _el$0 = _tmpl$42();
        _el$0.$$mousedown = (e) => e.stopPropagation();
        _el$0.$$click = (e) => e.stopPropagation();
        _el$0.addEventListener("blur", handleInputSubmit);
        _el$0.$$keydown = handleInputKeyDown;
        _el$0.$$input = (e) => setInputValue(e.currentTarget.value);
        var _ref$6 = inputRef;
        typeof _ref$6 === "function" ? (0, import_web19.use)(_ref$6, _el$0) : inputRef = _el$0;
        (0, import_web17.effect)(() => _el$0.value = inputValue());
        return _el$0;
      })() : (() => {
        var _el$1 = _tmpl$22();
        _el$1.$$mousedown = (e) => isValueEditable() && e.stopPropagation();
        _el$1.$$click = handleValueClick;
        _el$1.addEventListener("mouseleave", () => setIsValueHovered(false));
        _el$1.addEventListener("mouseenter", () => setIsValueHovered(true));
        var _ref$7 = valueSpanRef;
        typeof _ref$7 === "function" ? (0, import_web19.use)(_ref$7, _el$1) : valueSpanRef = _el$1;
        (0, import_web18.insert)(_el$1, displayValue);
        (0, import_web17.effect)((_p$) => {
          var _v$5 = `dialkit-slider-value ${isValueEditable() ? "dialkit-slider-value-editable" : ""}`, _v$6 = isValueEditable() ? "text" : "default";
          _v$5 !== _p$.e && (0, import_web16.className)(_el$1, _p$.e = _v$5);
          _v$6 !== _p$.t && (0, import_web20.setStyleProperty)(_el$1, "cursor", _p$.t = _v$6);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$1;
      })();
    })(), null);
    (0, import_web17.effect)((_p$) => {
      var _v$ = `dialkit-slider ${isActive() ? "dialkit-slider-active" : ""}`, _v$2 = hasOrigin() ? `${Math.min(fillPercent.get(), originPercent())}%` : "0%", _v$3 = hasOrigin() ? `${Math.abs(fillPercent.get() - originPercent())}%` : `${fillPercent.get()}%`, _v$4 = `max(5px, calc(${fillPercent.get()}% - 9px))`;
      _v$ !== _p$.e && (0, import_web16.className)(_el$4, _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web20.setStyleProperty)(_el$6, "left", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web20.setStyleProperty)(_el$6, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web20.setStyleProperty)(_el$7, "left", _p$.o = _v$4);
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
(0, import_web13.delegateEvents)(["pointerdown", "pointermove", "pointerup", "input", "keydown", "click", "mousedown"]);

// src/solid/components/RangeSlider.tsx
var import_web21 = require("solid-js/web");
var import_web22 = require("solid-js/web");
var import_web23 = require("solid-js/web");
var import_web24 = require("solid-js/web");
var import_web25 = require("solid-js/web");
var import_web26 = require("solid-js/web");
var import_web27 = require("solid-js/web");
var import_web28 = require("solid-js/web");
var import_solid_js5 = require("solid-js");
var import_motion3 = require("motion");
var _tmpl$11 = /* @__PURE__ */ (0, import_web21.template)(`<input type=text class=dialkit-range-slider-input>`);
var _tmpl$23 = /* @__PURE__ */ (0, import_web21.template)(`<div class=dialkit-range-slider-wrapper><div><div class=dialkit-range-slider-fill></div><div class=dialkit-range-slider-handle style=transform:translateY(-50%);opacity:0.35></div><div class=dialkit-range-slider-handle style=transform:translateY(-50%);opacity:0.35></div><span class=dialkit-range-slider-label>`);
var _tmpl$33 = /* @__PURE__ */ (0, import_web21.template)(`<span class=dialkit-range-slider-value><span class=dialkit-range-slider-bound></span><span class=dialkit-range-slider-dash>\u2013</span><span class=dialkit-range-slider-bound>`);
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
  const [isInteracting, setIsInteracting] = (0, import_solid_js5.createSignal)(false);
  const [isDragging, setIsDragging] = (0, import_solid_js5.createSignal)(false);
  const [isHovered, setIsHovered] = (0, import_solid_js5.createSignal)(false);
  const [editing, setEditing] = (0, import_solid_js5.createSignal)(null);
  const [inputValue, setInputValue] = (0, import_solid_js5.createSignal)("");
  const [dragTarget, setDragTarget] = (0, import_solid_js5.createSignal)(null);
  const value = () => isInteracting() ? props.value : clampRange(props.value, min(), max());
  const span = () => max() - min();
  const lowPercent = () => span() === 0 ? 0 : (value().min - min()) / span() * 100;
  const highPercent = () => span() === 0 ? 0 : (value().max - min()) / span() * 100;
  const isActive = () => isInteracting() || isHovered();
  const lowMotion = (0, import_motion3.motionValue)(lowPercent());
  const highMotion = (0, import_motion3.motionValue)(highPercent());
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
  (0, import_solid_js5.createEffect)(() => {
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
      const anim = (0, import_motion3.animate)(handleMotion, targetPct, {
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
    lowSnapAnim = (0, import_motion3.animate)(lowMotion, percentFromValue(d.min), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        lowSnapAnim = null;
      }
    });
    highSnapAnim = (0, import_motion3.animate)(highMotion, percentFromValue(d.max), {
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
  const lowOpacityMv = (0, import_motion3.motionValue)(restOpacity);
  const highOpacityMv = (0, import_motion3.motionValue)(restOpacity);
  const applyLowHandleOpacity = () => {
    if (lowHandleRef) lowHandleRef.style.opacity = String(lowOpacityMv.get());
  };
  const applyHighHandleOpacity = () => {
    if (highHandleRef) highHandleRef.style.opacity = String(highOpacityMv.get());
  };
  (0, import_solid_js5.createEffect)(() => {
    const active = isActive();
    const dragging = isDragging();
    const target = dragTarget();
    const lowTarget = !active ? restOpacity : dragging && target === "min" ? 0.95 : 0.7;
    const highTarget = !active ? restOpacity : dragging && target === "max" ? 0.95 : 0.7;
    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
    lowOpacityAnim = (0, import_motion3.animate)(lowOpacityMv, lowTarget, {
      duration: 0.15
    });
    highOpacityAnim = (0, import_motion3.animate)(highOpacityMv, highTarget, {
      duration: 0.15
    });
  });
  (0, import_solid_js5.onMount)(() => {
    const unsubLow = lowMotion.on("change", applyFillStyles);
    const unsubHigh = highMotion.on("change", applyFillStyles);
    const unsubLowOpacity = lowOpacityMv.on("change", applyLowHandleOpacity);
    const unsubHighOpacity = highOpacityMv.on("change", applyHighHandleOpacity);
    applyFillStyles();
    applyLowHandleOpacity();
    applyHighHandleOpacity();
    (0, import_solid_js5.onCleanup)(() => {
      unsubLow();
      unsubHigh();
      unsubLowOpacity();
      unsubHighOpacity();
    });
  });
  (0, import_solid_js5.onCleanup)(() => {
    stopSnaps();
    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
  });
  (0, import_solid_js5.createEffect)(() => {
    if (editing() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });
  const decimals = () => decimalsForStep(step());
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
    var _el$ = _tmpl$23(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling;
    var _ref$ = wrapperRef;
    typeof _ref$ === "function" ? (0, import_web28.use)(_ref$, _el$) : wrapperRef = _el$;
    _el$2.addEventListener("mouseleave", () => setIsHovered(false));
    _el$2.addEventListener("mouseenter", () => setIsHovered(true));
    _el$2.$$dblclick = handleDoubleClick;
    _el$2.addEventListener("pointercancel", handlePointerCancel);
    _el$2.$$pointerup = handlePointerUp;
    _el$2.$$pointermove = handlePointerMove;
    _el$2.$$pointerdown = handlePointerDown;
    var _ref$2 = trackRef;
    typeof _ref$2 === "function" ? (0, import_web28.use)(_ref$2, _el$2) : trackRef = _el$2;
    var _ref$3 = fillRef;
    typeof _ref$3 === "function" ? (0, import_web28.use)(_ref$3, _el$3) : fillRef = _el$3;
    var _ref$4 = lowHandleRef;
    typeof _ref$4 === "function" ? (0, import_web28.use)(_ref$4, _el$4) : lowHandleRef = _el$4;
    var _ref$5 = highHandleRef;
    typeof _ref$5 === "function" ? (0, import_web28.use)(_ref$5, _el$5) : highHandleRef = _el$5;
    (0, import_web27.insert)(_el$6, () => props.label);
    (0, import_web27.insert)(_el$2, (0, import_web25.createComponent)(import_solid_js5.Show, {
      get when() {
        return editing() !== null;
      },
      get fallback() {
        return (() => {
          var _el$8 = _tmpl$33(), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling;
          _el$9.$$pointerdown = (e) => e.stopPropagation();
          _el$9.$$click = (e) => {
            e.stopPropagation();
            openEditor("min");
          };
          (0, import_web27.insert)(_el$9, lowText);
          _el$1.$$pointerdown = (e) => e.stopPropagation();
          _el$1.$$click = (e) => {
            e.stopPropagation();
            openEditor("max");
          };
          (0, import_web27.insert)(_el$1, highText);
          return _el$8;
        })();
      },
      get children() {
        var _el$7 = _tmpl$11();
        _el$7.$$pointerdown = (e) => e.stopPropagation();
        _el$7.$$click = (e) => e.stopPropagation();
        _el$7.addEventListener("blur", commitEditor);
        _el$7.$$keydown = handleInputKeyDown;
        _el$7.$$input = (e) => setInputValue(e.currentTarget.value);
        var _ref$6 = inputRef;
        typeof _ref$6 === "function" ? (0, import_web28.use)(_ref$6, _el$7) : inputRef = _el$7;
        (0, import_web26.effect)(() => _el$7.value = inputValue());
        return _el$7;
      }
    }), null);
    (0, import_web26.effect)((_p$) => {
      var _v$ = `dialkit-range-slider ${isActive() ? "dialkit-range-slider-active" : ""}`, _v$2 = `${lowPercent()}%`, _v$3 = `${Math.max(0, highPercent() - lowPercent())}%`, _v$4 = handleLeftStyles(lowPercent(), highPercent()).low, _v$5 = handleLeftStyles(lowPercent(), highPercent()).high;
      _v$ !== _p$.e && (0, import_web24.className)(_el$2, _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web23.setStyleProperty)(_el$3, "left", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web23.setStyleProperty)(_el$3, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web23.setStyleProperty)(_el$4, "left", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web23.setStyleProperty)(_el$5, "left", _p$.i = _v$5);
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
(0, import_web22.delegateEvents)(["pointerdown", "pointermove", "pointerup", "dblclick", "input", "keydown", "click"]);

// src/solid/components/Toggle.tsx
var import_web37 = require("solid-js/web");
var import_web38 = require("solid-js/web");
var import_web39 = require("solid-js/web");
var import_web40 = require("solid-js/web");
var import_web41 = require("solid-js/web");
var import_web42 = require("solid-js/web");
var import_solid_js7 = require("solid-js");

// src/solid/components/SegmentedControl.tsx
var import_web29 = require("solid-js/web");
var import_web30 = require("solid-js/web");
var import_web31 = require("solid-js/web");
var import_web32 = require("solid-js/web");
var import_web33 = require("solid-js/web");
var import_web34 = require("solid-js/web");
var import_web35 = require("solid-js/web");
var import_web36 = require("solid-js/web");
var import_solid_js6 = require("solid-js");
var _tmpl$12 = /* @__PURE__ */ (0, import_web29.template)(`<div class=dialkit-segmented>`);
var _tmpl$24 = /* @__PURE__ */ (0, import_web29.template)(`<div class=dialkit-segmented-pill>`);
var _tmpl$34 = /* @__PURE__ */ (0, import_web29.template)(`<button class=dialkit-segmented-button>`);
function SegmentedControl(props) {
  let containerRef;
  let hasAnimated = false;
  const [pillStyle, setPillStyle] = (0, import_solid_js6.createSignal)(null);
  const measure = () => {
    if (!containerRef) return;
    const activeButton = containerRef.querySelector('[data-active="true"]');
    if (!activeButton) return;
    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth
    });
  };
  (0, import_solid_js6.createEffect)(() => {
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
    var _el$ = _tmpl$12();
    var _ref$ = containerRef;
    typeof _ref$ === "function" ? (0, import_web36.use)(_ref$, _el$) : containerRef = _el$;
    (0, import_web34.insert)(_el$, (0, import_web35.createComponent)(import_solid_js6.Show, {
      get when() {
        return pillStyle();
      },
      children: (style) => (() => {
        var _el$2 = _tmpl$24();
        (0, import_web33.effect)((_p$) => {
          var _v$ = `${style().left}px`, _v$2 = `${style().width}px`, _v$3 = transition();
          _v$ !== _p$.e && (0, import_web32.setStyleProperty)(_el$2, "left", _p$.e = _v$);
          _v$2 !== _p$.t && (0, import_web32.setStyleProperty)(_el$2, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && (0, import_web32.setStyleProperty)(_el$2, "transition", _p$.a = _v$3);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$2;
      })()
    }), null);
    (0, import_web34.insert)(_el$, (0, import_web35.createComponent)(import_solid_js6.For, {
      get each() {
        return props.options;
      },
      children: (option) => (() => {
        var _el$3 = _tmpl$34();
        _el$3.$$click = () => props.onChange(option.value);
        (0, import_web34.insert)(_el$3, () => option.label);
        (0, import_web33.effect)(() => (0, import_web31.setAttribute)(_el$3, "data-active", String(props.value === option.value)));
        return _el$3;
      })()
    }), null);
    return _el$;
  })();
}
(0, import_web30.delegateEvents)(["click"]);

// src/solid/components/Toggle.tsx
var _tmpl$13 = /* @__PURE__ */ (0, import_web37.template)(`<span>`);
var _tmpl$25 = /* @__PURE__ */ (0, import_web37.template)(`<div class=dialkit-labeled-control><span class=dialkit-labeled-control-label>`);
function Toggle(props) {
  return (() => {
    var _el$ = _tmpl$25(), _el$2 = _el$.firstChild;
    (0, import_web42.insert)(_el$2, () => props.label, null);
    (0, import_web42.insert)(_el$2, (0, import_web39.createComponent)(import_solid_js7.Show, {
      get when() {
        return props.shortcut;
      },
      get children() {
        var _el$3 = _tmpl$13();
        (0, import_web42.insert)(_el$3, () => formatToggleShortcut(props.shortcut));
        (0, import_web41.effect)(() => (0, import_web40.className)(_el$3, `dialkit-shortcut-pill${props.shortcutActive ? " dialkit-shortcut-pill-active" : ""}`));
        return _el$3;
      }
    }), null);
    (0, import_web42.insert)(_el$, (0, import_web39.createComponent)(SegmentedControl, {
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
var import_web47 = require("solid-js/web");
var import_web48 = require("solid-js/web");
var import_web49 = require("solid-js/web");
var import_web50 = require("solid-js/web");
var import_solid_js8 = require("solid-js");

// src/solid/components/SpringVisualization.tsx
var import_web43 = require("solid-js/web");
var import_web44 = require("solid-js/web");
var import_web45 = require("solid-js/web");
var import_web46 = require("solid-js/web");
var _tmpl$14 = /* @__PURE__ */ (0, import_web43.template)(`<svg><line y1=0 y2=140 stroke="rgba(255, 255, 255, 0.08)"stroke-width=1></svg>`, false, true, false);
var _tmpl$26 = /* @__PURE__ */ (0, import_web43.template)(`<svg><line x1=0 x2=256 stroke="rgba(255, 255, 255, 0.08)"stroke-width=1></svg>`, false, true, false);
var _tmpl$35 = /* @__PURE__ */ (0, import_web43.template)(`<svg viewBox="0 0 256 140"class=dialkit-spring-viz><line x1=0 y1=70 x2=256 y2=70 stroke="rgba(255, 255, 255, 0.15)"stroke-width=1 stroke-dasharray=4,4></line><path fill=none stroke="rgba(255, 255, 255, 0.6)"stroke-width=2 stroke-linecap=round stroke-linejoin=round>`);
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
        var _el$ = _tmpl$14();
        (0, import_web46.setAttribute)(_el$, "x1", x);
        (0, import_web46.setAttribute)(_el$, "x2", x);
        return _el$;
      })(), (() => {
        var _el$2 = _tmpl$26();
        (0, import_web46.setAttribute)(_el$2, "y1", y);
        (0, import_web46.setAttribute)(_el$2, "y2", y);
        return _el$2;
      })());
    }
    return lines;
  };
  return (() => {
    var _el$3 = _tmpl$35(), _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling;
    (0, import_web45.insert)(_el$3, gridLines, _el$4);
    (0, import_web44.effect)(() => (0, import_web46.setAttribute)(_el$5, "d", params()));
    return _el$3;
  })();
}

// src/solid/components/SpringControl.tsx
var _tmpl$15 = /* @__PURE__ */ (0, import_web47.template)(`<div style=display:flex;flex-direction:column;gap:6px><div class=dialkit-labeled-control><span class=dialkit-labeled-control-label>Type`);
function SpringControl(props) {
  const [mode, setMode] = (0, import_solid_js8.createSignal)(DialStore.getSpringMode(props.panelId, props.path));
  (0, import_solid_js8.onMount)(() => {
    const unsub = DialStore.subscribe(props.panelId, () => {
      setMode(DialStore.getSpringMode(props.panelId, props.path));
    });
    (0, import_solid_js8.onCleanup)(unsub);
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
  return (0, import_web50.createComponent)(Folder, {
    get title() {
      return props.label;
    },
    defaultOpen: true,
    get children() {
      var _el$ = _tmpl$15(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
      (0, import_web49.insert)(_el$, (0, import_web50.createComponent)(SpringVisualization, {
        get spring() {
          return props.spring;
        },
        get isSimpleMode() {
          return isSimpleMode();
        }
      }), _el$2);
      (0, import_web49.insert)(_el$2, (0, import_web50.createComponent)(SegmentedControl, {
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
      (0, import_web49.insert)(_el$, (() => {
        var _c$ = (0, import_web48.memo)(() => !!isSimpleMode());
        return () => _c$() ? [(0, import_web50.createComponent)(Slider, {
          label: "Duration",
          get value() {
            return props.spring.visualDuration ?? 0.3;
          },
          onChange: (v) => handleUpdate("visualDuration", v),
          min: 0.1,
          max: 1,
          step: 0.05,
          unit: "s"
        }), (0, import_web50.createComponent)(Slider, {
          label: "Bounce",
          get value() {
            return props.spring.bounce ?? 0.2;
          },
          onChange: (v) => handleUpdate("bounce", v),
          min: 0,
          max: 1,
          step: 0.05
        })] : [(0, import_web50.createComponent)(Slider, {
          label: "Stiffness",
          get value() {
            return props.spring.stiffness ?? 400;
          },
          onChange: (v) => handleUpdate("stiffness", v),
          min: 1,
          max: 1e3,
          step: 10
        }), (0, import_web50.createComponent)(Slider, {
          label: "Damping",
          get value() {
            return props.spring.damping ?? 17;
          },
          onChange: (v) => handleUpdate("damping", v),
          min: 1,
          max: 100,
          step: 1
        }), (0, import_web50.createComponent)(Slider, {
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

// src/solid/components/TextControl.tsx
var import_web51 = require("solid-js/web");
var import_web52 = require("solid-js/web");
var import_web53 = require("solid-js/web");
var import_web54 = require("solid-js/web");
var import_web55 = require("solid-js/web");
var import_solid_js9 = require("solid-js");
var _tmpl$16 = /* @__PURE__ */ (0, import_web51.template)(`<div class=dialkit-text-control><label class=dialkit-text-label></label><input type=text class=dialkit-text-input>`);
function TextControl(props) {
  const inputId = (0, import_solid_js9.createUniqueId)();
  return (() => {
    var _el$ = _tmpl$16(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    (0, import_web55.setAttribute)(_el$2, "for", inputId);
    (0, import_web54.insert)(_el$2, () => props.label);
    _el$3.$$input = (e) => props.onChange(e.currentTarget.value);
    (0, import_web55.setAttribute)(_el$3, "id", inputId);
    (0, import_web53.effect)(() => (0, import_web55.setAttribute)(_el$3, "placeholder", props.placeholder));
    (0, import_web53.effect)(() => _el$3.value = props.value);
    return _el$;
  })();
}
(0, import_web52.delegateEvents)(["input"]);

// src/solid/components/SelectControl.tsx
var import_web56 = require("solid-js/web");
var import_web57 = require("solid-js/web");
var import_web58 = require("solid-js/web");
var import_web59 = require("solid-js/web");
var import_web60 = require("solid-js/web");
var import_web61 = require("solid-js/web");
var import_web62 = require("solid-js/web");
var import_web63 = require("solid-js/web");
var import_web64 = require("solid-js/web");
var import_solid_js10 = require("solid-js");
var import_web65 = require("solid-js/web");
var import_motion4 = require("motion");
var _tmpl$17 = /* @__PURE__ */ (0, import_web56.template)(`<div class=dialkit-select-dropdown>`);
var _tmpl$27 = /* @__PURE__ */ (0, import_web56.template)(`<div class=dialkit-select-row><button class=dialkit-select-trigger><span class=dialkit-select-label></span><div class=dialkit-select-right><span class=dialkit-select-value></span><svg class=dialkit-select-chevron viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$36 = /* @__PURE__ */ (0, import_web56.template)(`<button class=dialkit-select-option>`);
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
  const [isOpen, setIsOpen] = (0, import_solid_js10.createSignal)(false);
  const [mounted, setMounted] = (0, import_solid_js10.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js10.createSignal)(null);
  const [portalTarget, setPortalTarget] = (0, import_solid_js10.createSignal)(null);
  let triggerRef;
  let dropdownRef;
  let chevronRef;
  let closeAnim = null;
  let chevronAnim = null;
  const normalized = () => normalizeOptions(props.options);
  const selectedOption = () => normalized().find((o) => o.value === props.value);
  (0, import_solid_js10.onMount)(() => {
    const root = triggerRef?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
    if (chevronRef) {
      chevronRef.style.transform = `rotate(${isOpen() ? 180 : 0}deg)`;
    }
    (0, import_solid_js10.onCleanup)(() => {
      closeAnim?.stop();
      chevronAnim?.stop();
    });
  });
  (0, import_solid_js10.createEffect)(() => {
    if (!chevronRef) return;
    const open = isOpen();
    chevronAnim?.stop();
    chevronAnim = (0, import_motion4.animate)(chevronRef, {
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
    closeAnim = (0, import_motion4.animate)(dropdownRef, {
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
  (0, import_solid_js10.createEffect)(() => {
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
    (0, import_solid_js10.onCleanup)(() => {
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
    var _el$ = _tmpl$27(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.firstChild;
    _el$2.$$click = () => isOpen() ? closeDropdown() : openDropdown();
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? (0, import_web64.use)(_ref$, _el$2) : triggerRef = _el$2;
    (0, import_web63.insert)(_el$3, () => props.label);
    (0, import_web63.insert)(_el$5, () => selectedOption()?.label ?? props.value);
    var _ref$2 = chevronRef;
    typeof _ref$2 === "function" ? (0, import_web64.use)(_ref$2, _el$6) : chevronRef = _el$6;
    (0, import_web61.setAttribute)(_el$7, "d", ICON_CHEVRON);
    (0, import_web63.insert)(_el$, (0, import_web60.createComponent)(import_solid_js10.Show, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return (0, import_web60.createComponent)(import_web65.Portal, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return (0, import_web60.createComponent)(import_solid_js10.Show, {
              get when() {
                return (0, import_web62.memo)(() => !!mounted())() && pos();
              },
              get children() {
                var _el$8 = _tmpl$17();
                (0, import_web64.use)((el) => {
                  dropdownRef = el;
                  const above = pos()?.above ?? false;
                  (0, import_motion4.animate)(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$8);
                (0, import_web63.insert)(_el$8, (0, import_web60.createComponent)(import_solid_js10.For, {
                  get each() {
                    return normalized();
                  },
                  children: (option) => (() => {
                    var _el$9 = _tmpl$36();
                    _el$9.$$click = () => {
                      props.onChange(option.value);
                      closeDropdown();
                    };
                    (0, import_web63.insert)(_el$9, () => option.label);
                    (0, import_web59.effect)(() => (0, import_web61.setAttribute)(_el$9, "data-selected", String(option.value === props.value)));
                    return _el$9;
                  })()
                }));
                (0, import_web59.effect)((_$p) => (0, import_web58.style)(_el$8, dropdownStyle(), _$p));
                return _el$8;
              }
            });
          }
        });
      }
    }), null);
    (0, import_web59.effect)(() => (0, import_web61.setAttribute)(_el$2, "data-open", String(isOpen())));
    return _el$;
  })();
}
(0, import_web57.delegateEvents)(["click"]);

// src/solid/components/ColorControl.tsx
var import_web77 = require("solid-js/web");
var import_web78 = require("solid-js/web");
var import_web79 = require("solid-js/web");
var import_web80 = require("solid-js/web");
var import_web81 = require("solid-js/web");
var import_web82 = require("solid-js/web");
var import_web83 = require("solid-js/web");
var import_web84 = require("solid-js/web");
var import_web85 = require("solid-js/web");
var import_web86 = require("solid-js/web");
var import_solid_js12 = require("solid-js");
var import_web87 = require("solid-js/web");
var import_motion5 = require("motion");

// src/solid/components/ColorPickerPanel.tsx
var import_web66 = require("solid-js/web");
var import_web67 = require("solid-js/web");
var import_web68 = require("solid-js/web");
var import_web69 = require("solid-js/web");
var import_web70 = require("solid-js/web");
var import_web71 = require("solid-js/web");
var import_web72 = require("solid-js/web");
var import_web73 = require("solid-js/web");
var import_web74 = require("solid-js/web");
var import_web75 = require("solid-js/web");
var import_web76 = require("solid-js/web");
var import_solid_js11 = require("solid-js");

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
var _tmpl$18 = /* @__PURE__ */ (0, import_web66.template)(`<label class=dialkit-color-field><input type=text inputmode=decimal><span class=dialkit-color-field-label>`);
var _tmpl$28 = /* @__PURE__ */ (0, import_web66.template)(`<label class="dialkit-color-field dialkit-color-field-hex"><input type=text><span class=dialkit-color-field-label>HEX`);
var _tmpl$37 = /* @__PURE__ */ (0, import_web66.template)(`<button class=dialkit-color-palette-slot>`);
var _tmpl$43 = /* @__PURE__ */ (0, import_web66.template)(`<div class="dialkit-color-slider dialkit-color-alpha dialkit-checker"><div class=dialkit-color-alpha-gradient></div><div class=dialkit-color-slider-thumb>`);
var _tmpl$52 = /* @__PURE__ */ (0, import_web66.template)(`<div class=dialkit-color-palette>`);
var _tmpl$62 = /* @__PURE__ */ (0, import_web66.template)(`<div class=dialkit-color-picker><div class=dialkit-color-sv><div class=dialkit-color-sv-thumb></div></div><div class="dialkit-color-slider dialkit-color-hue"><div class=dialkit-color-slider-thumb></div></div><div class=dialkit-color-fields>`);
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
  const [draft, setDraft] = (0, import_solid_js11.createSignal)(null);
  const display = () => draft() ?? String(props.value);
  const commit = () => {
    const d = draft();
    if (d !== null) props.onCommit(Number(d));
    setDraft(null);
  };
  return (() => {
    var _el$ = _tmpl$18(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
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
    (0, import_web75.insert)(_el$3, () => props.spec.label);
    (0, import_web76.effect)(() => _el$2.value = display());
    return _el$;
  })();
}
function HexField(props) {
  const [draft, setDraft] = (0, import_solid_js11.createSignal)(null);
  const commit = () => {
    const d = draft();
    if (d !== null) {
      const normalized = normalizeHex(d, props.alpha);
      if (normalized) props.onCommit(normalized);
    }
    setDraft(null);
  };
  return (() => {
    var _el$4 = _tmpl$28(), _el$5 = _el$4.firstChild;
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
    (0, import_web74.setAttribute)(_el$5, "spellcheck", false);
    (0, import_web76.effect)(() => _el$5.value = (draft() ?? props.value).toUpperCase());
    return _el$4;
  })();
}
function PaletteSlot(props) {
  const [holding, setHolding] = (0, import_solid_js11.createSignal)(false);
  let timer = null;
  let origin = null;
  let fired = false;
  const cancelHold = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    origin = null;
    setHolding(false);
  };
  (0, import_solid_js11.onCleanup)(cancelHold);
  return (() => {
    var _el$6 = _tmpl$37();
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
    (0, import_web76.effect)((_p$) => {
      var _v$ = String(props.color !== null), _v$2 = String(holding()), _v$3 = props.color ? {
        "--swatch-color": props.color
      } : void 0, _v$4 = props.color ? `${props.color.toUpperCase()} \u2014 click to apply, hold to clear` : "Save current color";
      _v$ !== _p$.e && (0, import_web74.setAttribute)(_el$6, "data-filled", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web74.setAttribute)(_el$6, "data-holding", _p$.t = _v$2);
      _p$.a = (0, import_web73.style)(_el$6, _v$3, _p$.a);
      _v$4 !== _p$.o && (0, import_web74.setAttribute)(_el$6, "title", _p$.o = _v$4);
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
  const [hsva, setHsva] = (0, import_solid_js11.createSignal)(initialRgba ? rgbToHsv(initialRgba) : BLACK);
  const [format, setFormat] = (0, import_solid_js11.createSignal)(stickyFormat);
  const [slots, setSlots] = (0, import_solid_js11.createSignal)(props.palette ? loadPalette() : emptyPalette());
  let lastEmitted = props.value;
  (0, import_solid_js11.createEffect)(() => {
    const value = props.value;
    if (value === lastEmitted) return;
    lastEmitted = value;
    const rgba2 = parseHex(value);
    if (rgba2) setHsva(rgbToHsv(rgba2));
  });
  (0, import_solid_js11.createEffect)(() => {
    if (!palette()) return;
    (0, import_solid_js11.onCleanup)(subscribePalette((s) => setSlots(s)));
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
    (0, import_web71.addEventListener)(_el$8, "pointercancel", svDrag.onPointerCancel);
    (0, import_web71.addEventListener)(_el$8, "pointerup", svDrag.onPointerUp, true);
    (0, import_web71.addEventListener)(_el$8, "pointermove", svDrag.onPointerMove, true);
    (0, import_web71.addEventListener)(_el$8, "pointerdown", svDrag.onPointerDown, true);
    var _ref$ = svDrag.ref;
    typeof _ref$ === "function" ? (0, import_web72.use)(_ref$, _el$8) : svDrag.ref = _el$8;
    (0, import_web71.addEventListener)(_el$0, "pointercancel", hueDrag.onPointerCancel);
    (0, import_web71.addEventListener)(_el$0, "pointerup", hueDrag.onPointerUp, true);
    (0, import_web71.addEventListener)(_el$0, "pointermove", hueDrag.onPointerMove, true);
    (0, import_web71.addEventListener)(_el$0, "pointerdown", hueDrag.onPointerDown, true);
    var _ref$2 = hueDrag.ref;
    typeof _ref$2 === "function" ? (0, import_web72.use)(_ref$2, _el$0) : hueDrag.ref = _el$0;
    (0, import_web75.insert)(_el$7, (0, import_web69.createComponent)(import_solid_js11.Show, {
      get when() {
        return alpha();
      },
      get children() {
        var _el$10 = _tmpl$43(), _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling;
        (0, import_web71.addEventListener)(_el$10, "pointercancel", alphaDrag.onPointerCancel);
        (0, import_web71.addEventListener)(_el$10, "pointerup", alphaDrag.onPointerUp, true);
        (0, import_web71.addEventListener)(_el$10, "pointermove", alphaDrag.onPointerMove, true);
        (0, import_web71.addEventListener)(_el$10, "pointerdown", alphaDrag.onPointerDown, true);
        var _ref$3 = alphaDrag.ref;
        typeof _ref$3 === "function" ? (0, import_web72.use)(_ref$3, _el$10) : alphaDrag.ref = _el$10;
        (0, import_web76.effect)((_p$) => {
          var _v$5 = `linear-gradient(to right, transparent, ${opaqueHex()})`, _v$6 = `${hsva().a * 100}%`, _v$7 = opaqueHex(), _v$8 = Math.max(hsva().a, 0.15);
          _v$5 !== _p$.e && (0, import_web70.setStyleProperty)(_el$11, "background", _p$.e = _v$5);
          _v$6 !== _p$.t && (0, import_web70.setStyleProperty)(_el$12, "left", _p$.t = _v$6);
          _v$7 !== _p$.a && (0, import_web70.setStyleProperty)(_el$12, "background", _p$.a = _v$7);
          _v$8 !== _p$.o && (0, import_web70.setStyleProperty)(_el$12, "opacity", _p$.o = _v$8);
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
    (0, import_web75.insert)(_el$7, (0, import_web69.createComponent)(SegmentedControl, {
      options: FORMAT_OPTIONS,
      get value() {
        return format();
      },
      onChange: (f) => {
        stickyFormat = f;
        setFormat(f);
      }
    }), _el$13);
    (0, import_web75.insert)(_el$13, (0, import_web69.createComponent)(import_solid_js11.Show, {
      get when() {
        return format() === "hex";
      },
      get fallback() {
        return (0, import_web69.createComponent)(import_solid_js11.For, {
          get each() {
            return channelSpecs();
          },
          children: (spec, i) => (0, import_web69.createComponent)(ChannelField, {
            spec,
            get value() {
              return channelValues()[i()];
            },
            onCommit: (n) => commitChannel(i(), n)
          })
        });
      },
      get children() {
        return [(0, import_web69.createComponent)(HexField, {
          get value() {
            return currentHex();
          },
          get alpha() {
            return alpha();
          },
          onCommit: applyHex
        }), (0, import_web69.createComponent)(import_solid_js11.Show, {
          get when() {
            return alpha();
          },
          get children() {
            return (0, import_web69.createComponent)(ChannelField, {
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
    (0, import_web75.insert)(_el$7, (0, import_web69.createComponent)(import_solid_js11.Show, {
      get when() {
        return palette();
      },
      get children() {
        var _el$14 = _tmpl$52();
        (0, import_web75.insert)(_el$14, (0, import_web69.createComponent)(import_solid_js11.For, {
          get each() {
            return Array.from({
              length: PALETTE_SIZE
            }, (_, i) => i);
          },
          children: (i) => (0, import_web69.createComponent)(PaletteSlot, {
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
    (0, import_web76.effect)((_p$) => {
      var _v$9 = String(hsva().h), _v$0 = `${hsva().s * 100}%`, _v$1 = `${(1 - hsva().v) * 100}%`, _v$10 = opaqueHex(), _v$11 = `${hsva().h / 360 * 100}%`, _v$12 = `hsl(${hsva().h} 100% 50%)`, _v$13 = format();
      _v$9 !== _p$.e && (0, import_web70.setStyleProperty)(_el$7, "--picker-hue", _p$.e = _v$9);
      _v$0 !== _p$.t && (0, import_web70.setStyleProperty)(_el$9, "left", _p$.t = _v$0);
      _v$1 !== _p$.a && (0, import_web70.setStyleProperty)(_el$9, "top", _p$.a = _v$1);
      _v$10 !== _p$.o && (0, import_web70.setStyleProperty)(_el$9, "background", _p$.o = _v$10);
      _v$11 !== _p$.i && (0, import_web70.setStyleProperty)(_el$1, "left", _p$.i = _v$11);
      _v$12 !== _p$.n && (0, import_web70.setStyleProperty)(_el$1, "background", _p$.n = _v$12);
      _v$13 !== _p$.s && (0, import_web74.setAttribute)(_el$13, "data-format", _p$.s = _v$13);
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
(0, import_web67.delegateEvents)(["input", "keydown", "contextmenu", "pointerdown", "pointermove", "pointerup", "click"]);

// src/solid/components/ColorControl.tsx
var _tmpl$19 = /* @__PURE__ */ (0, import_web77.template)(`<input type=text class=dialkit-color-hex-input>`);
var _tmpl$29 = /* @__PURE__ */ (0, import_web77.template)(`<div class=dialkit-color-picker-popover>`);
var _tmpl$38 = /* @__PURE__ */ (0, import_web77.template)(`<div class=dialkit-color-control><span class=dialkit-color-label></span><div class=dialkit-color-inputs><span class=dialkit-color-hex-wrap><span class=dialkit-color-hash aria-hidden=true>#</span></span><button class=dialkit-color-swatch title="Pick color">`);
var _tmpl$44 = /* @__PURE__ */ (0, import_web77.template)(`<span class=dialkit-color-hex>`);
var _tmpl$53 = /* @__PURE__ */ (0, import_web77.template)(`<span class=dialkit-color-divider aria-hidden=true>`);
var _tmpl$63 = /* @__PURE__ */ (0, import_web77.template)(`<span class=dialkit-color-opacity> <span class=dialkit-color-opacity-unit>%`);
var PICKER_WIDTH = 240;
var PICKER_BASE_HEIGHT = 270;
var PICKER_ALPHA_HEIGHT = 22;
var PICKER_PALETTE_HEIGHT = 30;
function ColorControl(props) {
  const alpha = () => props.alpha ?? false;
  const palette = () => props.palette ?? false;
  const [isEditing, setIsEditing] = (0, import_solid_js12.createSignal)(false);
  const [editValue, setEditValue] = (0, import_solid_js12.createSignal)(bareHex(props.value));
  const [isOpen, setIsOpen] = (0, import_solid_js12.createSignal)(false);
  const [mounted, setMounted] = (0, import_solid_js12.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js12.createSignal)(null);
  const [portalTarget, setPortalTarget] = (0, import_solid_js12.createSignal)(null);
  let swatchRef;
  let pickerRef;
  let closeAnim = null;
  const rgba = () => parseHex(props.value);
  (0, import_solid_js12.createEffect)(() => {
    const value = props.value;
    if (!isEditing()) {
      setEditValue(bareHex(value));
    }
  });
  (0, import_solid_js12.onMount)(() => {
    const root = swatchRef?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
    (0, import_solid_js12.onCleanup)(() => {
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
      (0, import_motion5.animate)(pickerRef, {
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
    closeAnim = (0, import_motion5.animate)(pickerRef, {
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
  (0, import_solid_js12.createEffect)(() => {
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
    (0, import_solid_js12.onCleanup)(() => {
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
    var _el$ = _tmpl$38(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$7 = _el$4.nextSibling;
    (0, import_web86.insert)(_el$2, () => props.label);
    _el$4.$$click = () => setIsEditing(true);
    (0, import_web86.insert)(_el$4, (0, import_web82.createComponent)(import_solid_js12.Show, {
      get when() {
        return isEditing();
      },
      get fallback() {
        return (() => {
          var _el$9 = _tmpl$44();
          (0, import_web86.insert)(_el$9, () => bareHex(props.value));
          (0, import_web84.effect)(() => (0, import_web83.setAttribute)(_el$9, "aria-label", `Hex color for ${props.label}`));
          return _el$9;
        })();
      },
      get children() {
        var _el$6 = _tmpl$19();
        _el$6.$$keydown = handleKeyDown;
        _el$6.addEventListener("blur", handleTextSubmit);
        _el$6.$$input = (e) => setEditValue(e.currentTarget.value);
        (0, import_web85.use)((el) => queueMicrotask(() => {
          el.focus();
          el.select();
        }), _el$6);
        (0, import_web84.effect)(() => (0, import_web83.setAttribute)(_el$6, "aria-label", `Hex color for ${props.label}`));
        (0, import_web84.effect)(() => _el$6.value = editValue());
        return _el$6;
      }
    }), null);
    (0, import_web86.insert)(_el$3, (0, import_web82.createComponent)(import_solid_js12.Show, {
      get when() {
        return (0, import_web81.memo)(() => !!alpha())() && rgba();
      },
      children: (r) => [_tmpl$53(), (() => {
        var _el$1 = _tmpl$63(), _el$10 = _el$1.firstChild;
        (0, import_web86.insert)(_el$1, () => opacityPercent(r()), _el$10);
        return _el$1;
      })()]
    }), _el$7);
    _el$7.$$click = () => isOpen() ? closePopover() : openPopover();
    var _ref$ = swatchRef;
    typeof _ref$ === "function" ? (0, import_web85.use)(_ref$, _el$7) : swatchRef = _el$7;
    (0, import_web86.insert)(_el$, (0, import_web82.createComponent)(import_solid_js12.Show, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return (0, import_web82.createComponent)(import_web87.Portal, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return (0, import_web82.createComponent)(import_solid_js12.Show, {
              get when() {
                return (0, import_web81.memo)(() => !!mounted())() && pos();
              },
              get children() {
                var _el$8 = _tmpl$29();
                (0, import_web85.use)((el) => {
                  pickerRef = el;
                  const above = pos()?.above ?? false;
                  (0, import_motion5.animate)(el, {
                    opacity: [0, 1],
                    y: [above ? 8 : -8, 0],
                    scale: [0.95, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$8);
                (0, import_web86.insert)(_el$8, (0, import_web82.createComponent)(ColorPickerPanel, {
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
                (0, import_web84.effect)((_$p) => (0, import_web80.style)(_el$8, popoverStyle(), _$p));
                return _el$8;
              }
            });
          }
        });
      }
    }), null);
    (0, import_web84.effect)((_p$) => {
      var _v$ = props.value, _v$2 = String(isOpen()), _v$3 = `Pick color for ${props.label}`, _v$4 = isOpen();
      _v$ !== _p$.e && (0, import_web79.setStyleProperty)(_el$7, "--swatch-color", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web83.setAttribute)(_el$7, "data-open", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web83.setAttribute)(_el$7, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web83.setAttribute)(_el$7, "aria-expanded", _p$.o = _v$4);
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
(0, import_web78.delegateEvents)(["click", "input", "keydown"]);

// src/solid/components/PresetManager.tsx
var import_web88 = require("solid-js/web");
var import_web89 = require("solid-js/web");
var import_web90 = require("solid-js/web");
var import_web91 = require("solid-js/web");
var import_web92 = require("solid-js/web");
var import_web93 = require("solid-js/web");
var import_web94 = require("solid-js/web");
var import_web95 = require("solid-js/web");
var import_web96 = require("solid-js/web");
var import_solid_js13 = require("solid-js");
var import_web97 = require("solid-js/web");
var import_motion6 = require("motion");
var _tmpl$20 = /* @__PURE__ */ (0, import_web88.template)(`<div class="dialkit-root dialkit-preset-dropdown"style=position:fixed><div class=dialkit-preset-item><span class=dialkit-preset-name>Version 1`);
var _tmpl$210 = /* @__PURE__ */ (0, import_web88.template)(`<div class=dialkit-preset-manager><button class=dialkit-preset-trigger><span class=dialkit-preset-label></span><svg class=dialkit-select-chevron viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path>`);
var _tmpl$39 = /* @__PURE__ */ (0, import_web88.template)(`<div class=dialkit-preset-item><span class=dialkit-preset-name></span><button class=dialkit-preset-delete title="Delete preset"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path></path><path></path><path></path><path></path><path>`);
function PresetManager(props) {
  const [isOpen, setIsOpen] = (0, import_solid_js13.createSignal)(false);
  const [mounted, setMounted] = (0, import_solid_js13.createSignal)(false);
  const [pos, setPos] = (0, import_solid_js13.createSignal)({
    top: 0,
    left: 0,
    width: 0
  });
  const [portalTarget, setPortalTarget] = (0, import_solid_js13.createSignal)(null);
  let triggerRef;
  let dropdownRef;
  let chevronRef;
  let closeAnim = null;
  let chevronAnim = null;
  const hasPresets = () => props.presets.length > 0;
  const activePreset = () => props.presets.find((p) => p.id === props.activePresetId);
  (0, import_solid_js13.onMount)(() => {
    const root = triggerRef?.closest(".dialkit-root");
    setPortalTarget(root ?? document.body);
    if (chevronRef) {
      chevronRef.style.transform = `rotate(${isOpen() ? 180 : 0}deg)`;
      chevronRef.style.opacity = String(hasPresets() ? 0.6 : 0.25);
    }
    (0, import_solid_js13.onCleanup)(() => {
      closeAnim?.stop();
      chevronAnim?.stop();
    });
  });
  (0, import_solid_js13.createEffect)(() => {
    if (!chevronRef) return;
    const open = isOpen();
    const has = hasPresets();
    chevronAnim?.stop();
    chevronAnim = (0, import_motion6.animate)(chevronRef, {
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
    closeAnim = (0, import_motion6.animate)(dropdownRef, {
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
  (0, import_solid_js13.createEffect)(() => {
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
    (0, import_solid_js13.onCleanup)(() => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    });
  });
  const handleSelect = (presetId) => {
    if (presetId) DialStore.loadPreset(props.panelId, presetId);
    else DialStore.clearActivePreset(props.panelId);
    closeDropdown();
  };
  const handleDelete = (e, presetId) => {
    e.stopPropagation();
    DialStore.deletePreset(props.panelId, presetId);
  };
  return (() => {
    var _el$ = _tmpl$210(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.firstChild;
    _el$2.$$click = toggle;
    var _ref$ = triggerRef;
    typeof _ref$ === "function" ? (0, import_web96.use)(_ref$, _el$2) : triggerRef = _el$2;
    (0, import_web94.insert)(_el$3, (() => {
      var _c$ = (0, import_web95.memo)(() => !!activePreset());
      return () => _c$() ? activePreset().name : "Version 1";
    })());
    var _ref$2 = chevronRef;
    typeof _ref$2 === "function" ? (0, import_web96.use)(_ref$2, _el$4) : chevronRef = _el$4;
    (0, import_web93.setAttribute)(_el$5, "d", ICON_CHEVRON);
    (0, import_web94.insert)(_el$, (0, import_web92.createComponent)(import_solid_js13.Show, {
      get when() {
        return !!portalTarget();
      },
      get children() {
        return (0, import_web92.createComponent)(import_web97.Portal, {
          get mount() {
            return portalTarget();
          },
          get children() {
            return (0, import_web92.createComponent)(import_solid_js13.Show, {
              get when() {
                return mounted();
              },
              get children() {
                var _el$6 = _tmpl$20(), _el$7 = _el$6.firstChild;
                (0, import_web96.use)((el) => {
                  dropdownRef = el;
                  (0, import_motion6.animate)(el, {
                    opacity: [0, 1],
                    y: [4, 0],
                    scale: [0.97, 1]
                  }, {
                    type: "spring",
                    visualDuration: 0.15,
                    bounce: 0
                  });
                }, _el$6);
                _el$7.$$click = () => handleSelect(null);
                (0, import_web94.insert)(_el$6, (0, import_web92.createComponent)(import_solid_js13.For, {
                  get each() {
                    return props.presets;
                  },
                  children: (preset) => (() => {
                    var _el$8 = _tmpl$39(), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling;
                    _el$8.$$click = () => handleSelect(preset.id);
                    (0, import_web94.insert)(_el$9, () => preset.name);
                    _el$0.$$click = (e) => handleDelete(e, preset.id);
                    (0, import_web91.effect)((_p$) => {
                      var _v$8 = String(preset.id === props.activePresetId), _v$9 = ICON_TRASH[0], _v$0 = ICON_TRASH[1], _v$1 = ICON_TRASH[2], _v$10 = ICON_TRASH[3], _v$11 = ICON_TRASH[4];
                      _v$8 !== _p$.e && (0, import_web93.setAttribute)(_el$8, "data-active", _p$.e = _v$8);
                      _v$9 !== _p$.t && (0, import_web93.setAttribute)(_el$10, "d", _p$.t = _v$9);
                      _v$0 !== _p$.a && (0, import_web93.setAttribute)(_el$11, "d", _p$.a = _v$0);
                      _v$1 !== _p$.o && (0, import_web93.setAttribute)(_el$12, "d", _p$.o = _v$1);
                      _v$10 !== _p$.i && (0, import_web93.setAttribute)(_el$13, "d", _p$.i = _v$10);
                      _v$11 !== _p$.n && (0, import_web93.setAttribute)(_el$14, "d", _p$.n = _v$11);
                      return _p$;
                    }, {
                      e: void 0,
                      t: void 0,
                      a: void 0,
                      o: void 0,
                      i: void 0,
                      n: void 0
                    });
                    return _el$8;
                  })()
                }), null);
                (0, import_web91.effect)((_p$) => {
                  var _v$ = `${pos().top}px`, _v$2 = `${pos().left}px`, _v$3 = `${pos().width}px`, _v$4 = String(!props.activePresetId);
                  _v$ !== _p$.e && (0, import_web90.setStyleProperty)(_el$6, "top", _p$.e = _v$);
                  _v$2 !== _p$.t && (0, import_web90.setStyleProperty)(_el$6, "left", _p$.t = _v$2);
                  _v$3 !== _p$.a && (0, import_web90.setStyleProperty)(_el$6, "min-width", _p$.a = _v$3);
                  _v$4 !== _p$.o && (0, import_web93.setAttribute)(_el$7, "data-active", _p$.o = _v$4);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0,
                  o: void 0
                });
                return _el$6;
              }
            });
          }
        });
      }
    }), null);
    (0, import_web91.effect)((_p$) => {
      var _v$5 = String(isOpen()), _v$6 = String(!!activePreset()), _v$7 = String(!hasPresets());
      _v$5 !== _p$.e && (0, import_web93.setAttribute)(_el$2, "data-open", _p$.e = _v$5);
      _v$6 !== _p$.t && (0, import_web93.setAttribute)(_el$2, "data-has-preset", _p$.t = _v$6);
      _v$7 !== _p$.a && (0, import_web93.setAttribute)(_el$2, "data-disabled", _p$.a = _v$7);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
(0, import_web89.delegateEvents)(["click"]);

// src/solid/components/Panel.tsx
var _tmpl$21 = /* @__PURE__ */ (0, import_web98.template)(`<button class=dialkit-button>`);
var _tmpl$211 = /* @__PURE__ */ (0, import_web98.template)(`<button class=dialkit-toolbar-add title="Add preset"><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 stroke-linecap=round stroke-linejoin=round><path></path><path></path><path></path><path></path><path>`);
var _tmpl$310 = /* @__PURE__ */ (0, import_web98.template)(`<button class=dialkit-toolbar-copy title="Copy parameters"><span class=dialkit-toolbar-copy-icon-wrap><span class=dialkit-toolbar-copy-icon style=opacity:1;transform:scale(1);filter:blur(0px)><svg viewBox="0 0 24 24"fill=none width=16 height=16><path stroke=currentColor stroke-width=2 stroke-linejoin=round></path><path fill=currentColor></path><path stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path></svg></span><span class=dialkit-toolbar-copy-icon style=opacity:0;transform:scale(0.5);filter:blur(4px)><svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round width=16 height=16><path></path></svg></span></span>Copy`);
var _tmpl$45 = /* @__PURE__ */ (0, import_web98.template)(`<div class=dialkit-panel-wrapper>`);
function Panel(props) {
  const [copied, setCopied] = (0, import_solid_js14.createSignal)(false);
  const [isPanelOpen, setIsPanelOpen] = (0, import_solid_js14.createSignal)(props.defaultOpen ?? true);
  const shortcutCtx = useShortcutContext();
  const hasShortcuts = () => Object.keys(props.panel.shortcuts).length > 0;
  const [values, setValues] = (0, import_solid_js14.createSignal)(DialStore.getValues(props.panel.id));
  const [presets, setPresets] = (0, import_solid_js14.createSignal)(DialStore.getPresets(props.panel.id));
  const [activePresetId, setActivePresetId] = (0, import_solid_js14.createSignal)(DialStore.getActivePresetId(props.panel.id));
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
  (0, import_solid_js14.onMount)(() => {
    const unsub = DialStore.subscribe(props.panel.id, () => {
      setValues(DialStore.getValues(props.panel.id));
      setPresets(DialStore.getPresets(props.panel.id));
      setActivePresetId(DialStore.getActivePresetId(props.panel.id));
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
    (0, import_solid_js14.onCleanup)(unsub);
  });
  const handleAddPreset = () => {
    const nextNum = presets().length + 2;
    DialStore.savePreset(props.panel.id, `Version ${nextNum}`);
  };
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
  (0, import_solid_js14.createEffect)(() => {
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
    copyClipboardAnim = (0, import_motion7.animate)(copyClipboardIconRef, {
      opacity: isCopied ? 0 : 1,
      scale: isCopied ? 0.5 : 1,
      filter: isCopied ? "blur(4px)" : "blur(0px)"
    }, transition);
    copyCheckAnim = (0, import_motion7.animate)(copyCheckIconRef, {
      opacity: isCopied ? 1 : 0,
      scale: isCopied ? 1 : 0.5,
      filter: isCopied ? "blur(0px)" : "blur(4px)"
    }, transition);
  });
  (0, import_solid_js14.onCleanup)(() => {
    addTapAnim?.stop();
    copyTapAnim?.stop();
    copyClipboardAnim?.stop();
    copyCheckAnim?.stop();
  });
  const handleAddTapStart = () => {
    if (!addButtonRef) return;
    addTapAnim?.stop();
    addTapAnim = (0, import_motion7.animate)(addButtonRef, {
      scale: 0.9
    }, tapTransition);
  };
  const handleAddTapEnd = () => {
    if (!addButtonRef) return;
    addTapAnim?.stop();
    addTapAnim = (0, import_motion7.animate)(addButtonRef, {
      scale: 1
    }, tapTransition);
  };
  const handleCopyTapStart = () => {
    if (!copyButtonRef) return;
    copyTapAnim?.stop();
    copyTapAnim = (0, import_motion7.animate)(copyButtonRef, {
      scale: 0.95
    }, tapTransition);
  };
  const handleCopyTapEnd = () => {
    if (!copyButtonRef) return;
    copyTapAnim?.stop();
    copyTapAnim = (0, import_motion7.animate)(copyButtonRef, {
      scale: 1
    }, tapTransition);
  };
  const renderControl = (control) => {
    const value = () => values()[control.path];
    switch (control.type) {
      case "slider":
        return (0, import_web104.createComponent)(Slider, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (v) => DialStore.updateValue(props.panel.id, control.path, v),
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
            return (0, import_web105.memo)(() => shortcutCtx().activePanelId === props.panel.id)() && shortcutCtx().activePath === control.path;
          }
        });
      case "toggle":
        return (0, import_web104.createComponent)(Toggle, {
          get label() {
            return control.label;
          },
          get checked() {
            return value();
          },
          onChange: (v) => DialStore.updateValue(props.panel.id, control.path, v),
          get shortcut() {
            return control.shortcut;
          },
          get shortcutActive() {
            return (0, import_web105.memo)(() => shortcutCtx().activePanelId === props.panel.id)() && shortcutCtx().activePath === control.path;
          }
        });
      case "spring":
        return (0, import_web104.createComponent)(SpringControl, {
          get panelId() {
            return props.panel.id;
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
          onChange: (v) => DialStore.updateValue(props.panel.id, control.path, v)
        });
      case "folder":
        return (0, import_web104.createComponent)(Folder, {
          get title() {
            return control.label;
          },
          get defaultOpen() {
            return control.defaultOpen ?? true;
          },
          get children() {
            return (0, import_web104.createComponent)(import_solid_js14.For, {
              get each() {
                return control.children ?? [];
              },
              children: (child) => (0, import_web105.memo)(() => renderControl(child))
            });
          }
        });
      case "text":
        return (0, import_web104.createComponent)(TextControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (v) => DialStore.updateValue(props.panel.id, control.path, v),
          get placeholder() {
            return control.placeholder;
          }
        });
      case "select":
        return (0, import_web104.createComponent)(SelectControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          get options() {
            return control.options ?? [];
          },
          onChange: (v) => DialStore.updateValue(props.panel.id, control.path, v)
        });
      case "color":
        return (0, import_web104.createComponent)(ColorControl, {
          get label() {
            return control.label;
          },
          get value() {
            return value();
          },
          onChange: (v) => DialStore.updateValue(props.panel.id, control.path, v),
          get alpha() {
            return control.alpha;
          },
          get palette() {
            return control.palette;
          }
        });
      case "range":
        return (0, import_web104.createComponent)(RangeSlider, {
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
          onChange: (v) => DialStore.updateValue(props.panel.id, control.path, v)
        });
      default:
        return null;
    }
  };
  const renderControls = () => {
    return (0, import_web104.createComponent)(import_solid_js14.For, {
      get each() {
        return props.panel.controls;
      },
      children: (control) => (0, import_web105.memo)(() => (0, import_web105.memo)(() => control.type === "action")() ? (() => {
        var _el$ = _tmpl$21();
        _el$.$$click = () => DialStore.triggerAction(props.panel.id, control.path);
        (0, import_web103.insert)(_el$, () => control.label);
        return _el$;
      })() : renderControl(control))
    });
  };
  const toolbar = [(() => {
    var _el$2 = _tmpl$211(), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling;
    _el$2.addEventListener("pointerleave", handleAddTapEnd);
    _el$2.addEventListener("pointercancel", handleAddTapEnd);
    _el$2.$$pointerup = handleAddTapEnd;
    _el$2.$$pointerdown = handleAddTapStart;
    _el$2.$$click = handleAddPreset;
    var _ref$ = addButtonRef;
    typeof _ref$ === "function" ? (0, import_web102.use)(_ref$, _el$2) : addButtonRef = _el$2;
    (0, import_web101.effect)((_p$) => {
      var _v$ = ICON_ADD_PRESET[0], _v$2 = ICON_ADD_PRESET[1], _v$3 = ICON_ADD_PRESET[2], _v$4 = ICON_ADD_PRESET[3], _v$5 = ICON_ADD_PRESET[4];
      _v$ !== _p$.e && (0, import_web100.setAttribute)(_el$4, "d", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web100.setAttribute)(_el$5, "d", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web100.setAttribute)(_el$6, "d", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web100.setAttribute)(_el$7, "d", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web100.setAttribute)(_el$8, "d", _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$2;
  })(), (0, import_web104.createComponent)(PresetManager, {
    get panelId() {
      return props.panel.id;
    },
    get presets() {
      return presets();
    },
    get activePresetId() {
      return activePresetId();
    },
    onAdd: handleAddPreset
  }), (() => {
    var _el$9 = _tmpl$310(), _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$1.nextSibling, _el$15 = _el$14.firstChild, _el$16 = _el$15.firstChild;
    _el$9.addEventListener("pointerleave", handleCopyTapEnd);
    _el$9.addEventListener("pointercancel", handleCopyTapEnd);
    _el$9.$$pointerup = handleCopyTapEnd;
    _el$9.$$pointerdown = handleCopyTapStart;
    _el$9.$$click = handleCopy;
    var _ref$2 = copyButtonRef;
    typeof _ref$2 === "function" ? (0, import_web102.use)(_ref$2, _el$9) : copyButtonRef = _el$9;
    var _ref$3 = copyClipboardIconRef;
    typeof _ref$3 === "function" ? (0, import_web102.use)(_ref$3, _el$1) : copyClipboardIconRef = _el$1;
    var _ref$4 = copyCheckIconRef;
    typeof _ref$4 === "function" ? (0, import_web102.use)(_ref$4, _el$14) : copyCheckIconRef = _el$14;
    (0, import_web100.setAttribute)(_el$16, "d", ICON_CHECK);
    (0, import_web101.effect)((_p$) => {
      var _v$6 = ICON_CLIPBOARD.board, _v$7 = ICON_CLIPBOARD.sparkle, _v$8 = ICON_CLIPBOARD.body;
      _v$6 !== _p$.e && (0, import_web100.setAttribute)(_el$11, "d", _p$.e = _v$6);
      _v$7 !== _p$.t && (0, import_web100.setAttribute)(_el$12, "d", _p$.t = _v$7);
      _v$8 !== _p$.a && (0, import_web100.setAttribute)(_el$13, "d", _p$.a = _v$8);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$9;
  })()];
  return (() => {
    var _el$17 = _tmpl$45();
    (0, import_web103.insert)(_el$17, (0, import_web104.createComponent)(Folder, {
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
    return _el$17;
  })();
}
(0, import_web99.delegateEvents)(["click", "pointerdown", "pointerup"]);

// src/solid/components/DialRoot.tsx
var import_meta = {};
var _tmpl$30 = /* @__PURE__ */ (0, import_web106.template)(`<div class=dialkit-root><div class=dialkit-panel>`);
var isDevDefault = typeof process !== "undefined" && process?.env?.NODE_ENV ? process.env.NODE_ENV !== "production" : typeof import_meta !== "undefined" && import_meta.env?.MODE ? import_meta.env.MODE !== "production" : true;
function DialRoot(props) {
  if ((props.productionEnabled ?? isDevDefault) === false) return null;
  const [panels, setPanels] = (0, import_solid_js15.createSignal)([]);
  const [mounted, setMounted] = (0, import_solid_js15.createSignal)(false);
  const inline = () => (props.mode ?? "popover") === "inline";
  (0, import_solid_js15.onMount)(() => {
    setMounted(true);
    setPanels(DialStore.getPanels());
    const unsub = DialStore.subscribeGlobal(() => {
      setPanels(DialStore.getPanels());
    });
    (0, import_solid_js15.onCleanup)(unsub);
  });
  const content = () => (0, import_web111.createComponent)(ShortcutListener, {
    get children() {
      var _el$ = _tmpl$30(), _el$2 = _el$.firstChild;
      (0, import_web110.insert)(_el$2, (0, import_web111.createComponent)(import_solid_js15.For, {
        get each() {
          return panels();
        },
        children: (panel) => (0, import_web111.createComponent)(Panel, {
          panel,
          get defaultOpen() {
            return inline() || (props.defaultOpen ?? true);
          },
          get inline() {
            return inline();
          }
        })
      }));
      (0, import_web109.effect)((_p$) => {
        var _v$ = props.mode ?? "popover", _v$2 = props.theme ?? "system", _v$3 = inline() ? void 0 : props.position ?? "top-right", _v$4 = props.mode ?? "popover";
        _v$ !== _p$.e && (0, import_web108.setAttribute)(_el$, "data-mode", _p$.e = _v$);
        _v$2 !== _p$.t && (0, import_web108.setAttribute)(_el$, "data-theme", _p$.t = _v$2);
        _v$3 !== _p$.a && (0, import_web108.setAttribute)(_el$2, "data-position", _p$.a = _v$3);
        _v$4 !== _p$.o && (0, import_web108.setAttribute)(_el$2, "data-mode", _p$.o = _v$4);
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
  return (0, import_web111.createComponent)(import_solid_js15.Show, {
    get when() {
      return (0, import_web107.memo)(() => !!(mounted() && typeof window !== "undefined"))() && panels().length > 0;
    },
    get children() {
      return (0, import_web111.createComponent)(import_solid_js15.Show, {
        get when() {
          return !inline();
        },
        get fallback() {
          return content();
        },
        get children() {
          return (0, import_web111.createComponent)(import_web112.Portal, {
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

// src/solid/components/Module.tsx
var import_web113 = require("solid-js/web");
var import_web114 = require("solid-js/web");
var import_web115 = require("solid-js/web");
var import_web116 = require("solid-js/web");
var import_web117 = require("solid-js/web");
var import_web118 = require("solid-js/web");
var _tmpl$31 = /* @__PURE__ */ (0, import_web113.template)(`<div class=dialkit-module><div class=dialkit-module-header><span class=dialkit-module-title></span><div class=dialkit-module-switch></div></div><div class=dialkit-module-collapse><div class=dialkit-module-collapse-clip><div class=dialkit-module-inner>`);
var ENABLE_OPTIONS = [{
  value: "off",
  label: "Off"
}, {
  value: "on",
  label: "On"
}];
function Module(props) {
  return (() => {
    var _el$ = _tmpl$31(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$2.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild;
    (0, import_web118.insert)(_el$3, () => props.title);
    (0, import_web118.insert)(_el$4, (0, import_web116.createComponent)(SegmentedControl, {
      options: ENABLE_OPTIONS,
      get value() {
        return props.enabled ? "on" : "off";
      },
      onChange: (v) => props.onEnabledChange(v === "on")
    }));
    (0, import_web118.insert)(_el$7, () => props.children);
    (0, import_web115.effect)(() => (0, import_web114.setAttribute)(_el$5, "data-open", props.enabled));
    return _el$;
  })();
}

// src/solid/components/ButtonGroup.tsx
var import_web119 = require("solid-js/web");
var import_web120 = require("solid-js/web");
var import_web121 = require("solid-js/web");
var import_web122 = require("solid-js/web");
var import_web123 = require("solid-js/web");
var import_solid_js16 = require("solid-js");
var _tmpl$40 = /* @__PURE__ */ (0, import_web119.template)(`<div class=dialkit-button-group>`);
var _tmpl$212 = /* @__PURE__ */ (0, import_web119.template)(`<button class=dialkit-button>`);
function ButtonGroup(props) {
  return (() => {
    var _el$ = _tmpl$40();
    (0, import_web122.insert)(_el$, (0, import_web123.createComponent)(import_solid_js16.For, {
      get each() {
        return props.buttons;
      },
      children: (button) => (() => {
        var _el$2 = _tmpl$212();
        (0, import_web121.addEventListener)(_el$2, "click", button.onClick, true);
        (0, import_web122.insert)(_el$2, () => button.label);
        return _el$2;
      })()
    }));
    return _el$;
  })();
}
(0, import_web120.delegateEvents)(["click"]);

// src/solid/components/WaveformVisualization.tsx
var import_web124 = require("solid-js/web");
var import_web125 = require("solid-js/web");
var import_web126 = require("solid-js/web");
var import_web127 = require("solid-js/web");
var import_web128 = require("solid-js/web");
var import_web129 = require("solid-js/web");
var import_web130 = require("solid-js/web");
var import_solid_js17 = require("solid-js");

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
  const columnWidth = (pixelSize) => Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSize)));
  const windowState = { start: 0, win: 1 };
  let drag = null;
  const drawColumns = (p, color, pixelSize) => {
    const colW = columnWidth(pixelSize);
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
var _tmpl$41 = /* @__PURE__ */ (0, import_web124.template)(`<button type=button aria-label="Zoom out"><svg viewBox="0 0 16 16"fill=none><path d="M3.5 8h9"stroke=currentColor stroke-width=1.6 stroke-linecap=round>`);
var _tmpl$213 = /* @__PURE__ */ (0, import_web124.template)(`<div class=dialkit-waveform-zoom><button type=button aria-label="Zoom in"><svg viewBox="0 0 16 16"fill=none><path d="M8 3.5v9M3.5 8h9"stroke=currentColor stroke-width=1.6 stroke-linecap=round>`);
var _tmpl$311 = /* @__PURE__ */ (0, import_web124.template)(`<div class=dialkit-waveform-viz-wrap><canvas class=dialkit-waveform-viz>`);
function WaveformVisualization(props) {
  const p = (0, import_solid_js17.mergeProps)({
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
  const [zoom, setZoom] = (0, import_solid_js17.createSignal)(1);
  let canvasEl;
  (0, import_solid_js17.onMount)(() => {
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
    (0, import_solid_js17.onCleanup)(() => engine.destroy());
  });
  const framingLoop = () => p.autoZoomOnLoop && !!p.loop;
  return (() => {
    var _el$ = _tmpl$311(), _el$2 = _el$.firstChild;
    var _ref$ = canvasEl;
    typeof _ref$ === "function" ? (0, import_web130.use)(_ref$, _el$2) : canvasEl = _el$2;
    (0, import_web128.insert)(_el$, (0, import_web129.createComponent)(import_solid_js17.Show, {
      get when() {
        return !framingLoop();
      },
      get children() {
        var _el$3 = _tmpl$213(), _el$5 = _el$3.firstChild;
        (0, import_web128.insert)(_el$3, (0, import_web129.createComponent)(import_solid_js17.Show, {
          get when() {
            return zoom() > 1;
          },
          get children() {
            var _el$4 = _tmpl$41();
            _el$4.$$click = () => setZoom((z) => Math.max(1, z / 2));
            return _el$4;
          }
        }), _el$5);
        _el$5.$$click = () => setZoom((z) => Math.min(WAVEFORM_MAX_ZOOM, z * 2));
        (0, import_web127.effect)(() => _el$5.disabled = zoom() >= WAVEFORM_MAX_ZOOM);
        return _el$3;
      }
    }), null);
    (0, import_web127.effect)((_p$) => {
      var _v$ = `${p.width}px`, _v$2 = `${p.width}px`, _v$3 = `${p.height}px`;
      _v$ !== _p$.e && (0, import_web126.setStyleProperty)(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web126.setStyleProperty)(_el$2, "width", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web126.setStyleProperty)(_el$2, "height", _p$.a = _v$3);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
(0, import_web125.delegateEvents)(["click"]);

// src/solid/components/CurveComposer.tsx
var import_web131 = require("solid-js/web");
var import_web132 = require("solid-js/web");
var import_web133 = require("solid-js/web");
var import_web134 = require("solid-js/web");
var import_web135 = require("solid-js/web");
var import_web136 = require("solid-js/web");
var import_web137 = require("solid-js/web");
var import_web138 = require("solid-js/web");
var import_web139 = require("solid-js/web");
var import_solid_js18 = require("solid-js");

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
var clamp012 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
var clampBipolar = (v) => v < -1 ? -1 : v > 1 ? 1 : v;
var SKEW_MAX = 0.45;
function steepnessGain(steepness) {
  const v = clampBipolar(steepness);
  return v >= 0 ? 1 + v * 1.3 : 1 + v;
}
function deriveEase(type, curvature, steepness = 0) {
  const base = type === "spring" ? easingPresets.linear : easingPresets[type];
  const k = steepnessGain(steepness);
  const x1 = base[0] * k;
  const x2 = 1 + (base[2] - 1) * k;
  const shift = clampBipolar(curvature) * SKEW_MAX;
  return [clamp012(x1 + shift), base[1], clamp012(x2 + shift), base[3]];
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
  const tx = clamp012(x);
  let s = tx;
  for (let i = 0; i < 6; i++) {
    const xs = bezierAxis(ease[0], ease[2], s) - tx;
    if (Math.abs(xs) < 1e-5) break;
    const d = bezierAxisDeriv(ease[0], ease[2], s);
    if (Math.abs(d) < 1e-6) break;
    s = clamp012(s - xs / d);
  }
  return bezierAxis(ease[1], ease[3], s);
}
var SPRING_SAMPLES = 72;
function springPoints(curvature, steepness = 0) {
  const visualDuration = 1;
  const bounce = clamp012((clampBipolar(curvature) + 1) / 2) * 0.6;
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
  const x = clamp012(t) * (points.length - 1);
  const i = Math.floor(x);
  if (i >= points.length - 1) return points[points.length - 1];
  return lerp(points[i], points[i + 1], x - i);
}
function buildSampler(curve) {
  if (curve.type === "spring") {
    const pts = springPoints(curve.curvature, curve.steepness);
    return (t) => interp(pts, t);
  }
  const ease = deriveEase(curve.type, curve.curvature, curve.steepness);
  return (t) => bezierY(ease, t);
}
function boundaries(segments) {
  const total = totalWeight(segments);
  const out = [];
  let acc = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    acc += segments[i].weight;
    out.push(acc / total);
  }
  return out;
}
function totalWeight(segments) {
  let t = 0;
  for (const s of segments) t += Math.max(0, s.weight);
  return t || 1;
}
function segmentSpan(segments, index) {
  const total = totalWeight(segments);
  let acc = 0;
  for (let i = 0; i < index; i++) acc += segments[i].weight;
  return [acc / total, (acc + segments[index].weight) / total];
}
function segmentIndexAt(xNorm, segments) {
  const total = totalWeight(segments);
  const x = clamp012(xNorm) * total;
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].weight;
    if (x <= acc) return i;
  }
  return segments.length - 1;
}
function boundaryAt(xNorm, segments, edgeHitNorm) {
  if (segments.length < 2) return null;
  const bs = boundaries(segments);
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
  next[index] = { ...src, type, curvature: 0, steepness: 0 };
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
  return { ...comp, driver: { ...comp.driver, type, curvature: 0, steepness: 0 } };
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
function toLocalCoords(clientX, clientY, rect, totalH) {
  const xN = clamp012((clientX - rect.left) / (rect.width || 1));
  const py = (clientY - rect.top) / (rect.height || 1) * totalH;
  return { xN, py };
}
function pointerTarget(xN, py, segments, layout, edgeHitNorm) {
  if (layout.driverY != null && py >= layout.driverY) return { kind: "driver" };
  const b = boundaryAt(xN, segments, edgeHitNorm);
  if (b != null) return { kind: "boundary", index: b };
  return { kind: "segment", index: segmentIndexAt(xN, segments) };
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
  const x = clamp012(u);
  if (dir === "reverse") return 1 - x;
  if (dir === "mirror") return 1 - Math.abs(1 - 2 * x);
  return x;
}
function readComposition(comp, u, s) {
  const inputPhase = directionPhase(u, comp.direction);
  const warpedPhase = s.driver ? clamp012(s.driver(inputPhase)) : inputPhase;
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
  const e = deriveEase(curve.type, curve.curvature, curve.steepness);
  return `M ${x(0)} ${y(0)} C ${x(e[0])} ${y(e[1])}, ${x(e[2])} ${y(e[3])}, ${x(1)} ${y(1)}`;
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
  const p = clamp012(prevValue);
  const c = clamp012(curValue);
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
var _tmpl$46 = /* @__PURE__ */ (0, import_web131.template)(`<div class=dialkit-cc-wrap><svg class=dialkit-cc><rect class=dialkit-cc-lane rx=8></rect><line class=dialkit-cc-playhead x1=0 x2=0></line><circle class=dialkit-cc-dot cx=0 r=3>`);
var _tmpl$214 = /* @__PURE__ */ (0, import_web131.template)(`<svg><line class=dialkit-cc-grid></svg>`, false, true, false);
var _tmpl$312 = /* @__PURE__ */ (0, import_web131.template)(`<svg><rect class=dialkit-cc-seg-hover rx=8></svg>`, false, true, false);
var _tmpl$47 = /* @__PURE__ */ (0, import_web131.template)(`<svg><g><line class=dialkit-cc-diagonal></line><path class=dialkit-cc-curve></path><text class=dialkit-cc-label></svg>`, false, true, false);
var _tmpl$54 = /* @__PURE__ */ (0, import_web131.template)(`<svg><line class=dialkit-cc-boundary></svg>`, false, true, false);
var _tmpl$64 = /* @__PURE__ */ (0, import_web131.template)(`<svg><rect class=dialkit-cc-lane rx=8></svg>`, false, true, false);
var _tmpl$72 = /* @__PURE__ */ (0, import_web131.template)(`<svg><rect class=dialkit-cc-seg-hover x=0 rx=8></svg>`, false, true, false);
var _tmpl$82 = /* @__PURE__ */ (0, import_web131.template)(`<svg><path class="dialkit-cc-curve dialkit-cc-curve-driver"></svg>`, false, true, false);
var _tmpl$92 = /* @__PURE__ */ (0, import_web131.template)(`<svg><text class=dialkit-cc-label>driver \xB7 </svg>`, false, true, false);
var _tmpl$0 = /* @__PURE__ */ (0, import_web131.template)(`<svg><line class=dialkit-cc-playhead x1=0 x2=0></svg>`, false, true, false);
var _tmpl$1 = /* @__PURE__ */ (0, import_web131.template)(`<svg><line class=dialkit-cc-diagonal></svg>`, false, true, false);
function CurveComposer(props) {
  const p = (0, import_solid_js18.mergeProps)({
    driver: null,
    direction: "forward",
    phase: 0,
    mode: "continuous",
    triggerSteps: DEFAULT_TRIGGER_STEPS,
    grid: false,
    gridSubdivisions: 8,
    width: 256,
    height: 140
  }, props);
  const layout = (0, import_solid_js18.createMemo)(() => composerLayout(p.width, p.height, p.driver != null));
  const W = () => layout().W;
  const totalH = () => layout().totalH;
  const mainRect = () => layout().mainRect;
  const driverRect = () => layout().driverRect;
  const composition = (0, import_solid_js18.createMemo)(() => ({
    segments: p.segments,
    driver: p.driver,
    direction: p.direction
  }));
  const samplers = (0, import_solid_js18.createMemo)(() => buildSamplers(composition()));
  let svgEl;
  let seriesPlayheadEl;
  let seriesDotEl;
  let driverPlayheadEl;
  let drag = null;
  const [hover, setHover] = (0, import_solid_js18.createSignal)(null);
  (0, import_solid_js18.onMount)(() => {
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
    (0, import_solid_js18.onCleanup)(() => cancelAnimationFrame(raf));
  });
  const hitLayout = () => {
    const dr = driverRect();
    return {
      totalH: totalH(),
      driverY: dr ? dr.y : null
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
    } else {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applyDriverBodyDrag(composition(), d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      if (next.driver) p.onDriverChange?.(next.driver);
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
    if (d.kind === "driver") {
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
    p.onSegmentsChange?.(splitSegment(composition(), segmentIndexAt(xN, p.segments)).segments);
  };
  const cursor = () => {
    const h = hover();
    const activeKind = drag?.kind ?? h?.kind;
    return activeKind === "boundary" ? "ew-resize" : activeKind === "segment" || activeKind === "driver" ? "move" : "default";
  };
  const interior = () => boundaries(p.segments);
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
    var _el$ = _tmpl$46(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling;
    _el$2.$$dblclick = onDoubleClick;
    _el$2.addEventListener("pointerleave", () => !drag && setHover(null));
    _el$2.addEventListener("pointercancel", onPointerCancel);
    _el$2.$$pointerup = onPointerUp;
    _el$2.$$pointermove = onPointerMove;
    _el$2.$$pointerdown = onPointerDown;
    var _ref$ = svgEl;
    typeof _ref$ === "function" ? (0, import_web139.use)(_ref$, _el$2) : svgEl = _el$2;
    (0, import_web136.insert)(_el$2, (0, import_web138.createComponent)(import_solid_js18.For, {
      get each() {
        return laneGridLines(mainRect());
      },
      children: (g) => (() => {
        var _el$6 = _tmpl$214();
        (0, import_web135.effect)((_p$) => {
          var _v$16 = g.gx, _v$17 = g.y1, _v$18 = g.gx, _v$19 = g.y2;
          _v$16 !== _p$.e && (0, import_web133.setAttribute)(_el$6, "x1", _p$.e = _v$16);
          _v$17 !== _p$.t && (0, import_web133.setAttribute)(_el$6, "y1", _p$.t = _v$17);
          _v$18 !== _p$.a && (0, import_web133.setAttribute)(_el$6, "x2", _p$.a = _v$18);
          _v$19 !== _p$.o && (0, import_web133.setAttribute)(_el$6, "y2", _p$.o = _v$19);
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
    (0, import_web136.insert)(_el$2, (0, import_web138.createComponent)(import_solid_js18.Show, {
      get when() {
        return hover()?.kind === "segment" && !drag;
      },
      get children() {
        return (() => {
          const span = segmentSpan(p.segments, hover().index);
          const mr = mainRect();
          return (() => {
            var _el$7 = _tmpl$312();
            (0, import_web135.effect)((_p$) => {
              var _v$20 = span[0] * W(), _v$21 = mr.y, _v$22 = (span[1] - span[0]) * W(), _v$23 = mr.h;
              _v$20 !== _p$.e && (0, import_web133.setAttribute)(_el$7, "x", _p$.e = _v$20);
              _v$21 !== _p$.t && (0, import_web133.setAttribute)(_el$7, "y", _p$.t = _v$21);
              _v$22 !== _p$.a && (0, import_web133.setAttribute)(_el$7, "width", _p$.a = _v$22);
              _v$23 !== _p$.o && (0, import_web133.setAttribute)(_el$7, "height", _p$.o = _v$23);
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
    (0, import_web136.insert)(_el$2, (0, import_web138.createComponent)(import_solid_js18.For, {
      get each() {
        return p.segments;
      },
      children: (seg, i) => {
        const span = () => segmentSpan(p.segments, i());
        const mr = () => mainRect();
        const diag = () => diagonalLine(mr(), span(), W());
        return (() => {
          var _el$8 = _tmpl$47(), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling;
          (0, import_web136.insert)(_el$1, () => seg.type);
          (0, import_web135.effect)((_p$) => {
            var _v$24 = diag().x1, _v$25 = diag().y1, _v$26 = diag().x2, _v$27 = diag().y2, _v$28 = curvePath(seg, mr(), span(), W()), _v$29 = (span()[0] + span()[1]) * 0.5 * W(), _v$30 = mr().y + 13;
            _v$24 !== _p$.e && (0, import_web133.setAttribute)(_el$9, "x1", _p$.e = _v$24);
            _v$25 !== _p$.t && (0, import_web133.setAttribute)(_el$9, "y1", _p$.t = _v$25);
            _v$26 !== _p$.a && (0, import_web133.setAttribute)(_el$9, "x2", _p$.a = _v$26);
            _v$27 !== _p$.o && (0, import_web133.setAttribute)(_el$9, "y2", _p$.o = _v$27);
            _v$28 !== _p$.i && (0, import_web133.setAttribute)(_el$0, "d", _p$.i = _v$28);
            _v$29 !== _p$.n && (0, import_web133.setAttribute)(_el$1, "x", _p$.n = _v$29);
            _v$30 !== _p$.s && (0, import_web133.setAttribute)(_el$1, "y", _p$.s = _v$30);
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
          return _el$8;
        })();
      }
    }), _el$4);
    (0, import_web136.insert)(_el$2, (0, import_web138.createComponent)(import_solid_js18.For, {
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
          var _el$10 = _tmpl$54();
          (0, import_web135.effect)((_p$) => {
            var _v$31 = String(active()), _v$32 = bx * W(), _v$33 = mr.y, _v$34 = bx * W(), _v$35 = mr.y + mr.h;
            _v$31 !== _p$.e && (0, import_web133.setAttribute)(_el$10, "data-active", _p$.e = _v$31);
            _v$32 !== _p$.t && (0, import_web133.setAttribute)(_el$10, "x1", _p$.t = _v$32);
            _v$33 !== _p$.a && (0, import_web133.setAttribute)(_el$10, "y1", _p$.a = _v$33);
            _v$34 !== _p$.o && (0, import_web133.setAttribute)(_el$10, "x2", _p$.o = _v$34);
            _v$35 !== _p$.i && (0, import_web133.setAttribute)(_el$10, "y2", _p$.i = _v$35);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0
          });
          return _el$10;
        })();
      }
    }), _el$4);
    var _ref$2 = seriesPlayheadEl;
    typeof _ref$2 === "function" ? (0, import_web139.use)(_ref$2, _el$4) : seriesPlayheadEl = _el$4;
    var _ref$3 = seriesDotEl;
    typeof _ref$3 === "function" ? (0, import_web139.use)(_ref$3, _el$5) : seriesDotEl = _el$5;
    (0, import_web136.insert)(_el$2, (0, import_web138.createComponent)(import_solid_js18.Show, {
      get when() {
        return driverRect();
      },
      children: (dr) => [(() => {
        var _el$11 = _tmpl$64();
        (0, import_web135.effect)((_p$) => {
          var _v$36 = dr().x, _v$37 = dr().y, _v$38 = dr().w, _v$39 = dr().h;
          _v$36 !== _p$.e && (0, import_web133.setAttribute)(_el$11, "x", _p$.e = _v$36);
          _v$37 !== _p$.t && (0, import_web133.setAttribute)(_el$11, "y", _p$.t = _v$37);
          _v$38 !== _p$.a && (0, import_web133.setAttribute)(_el$11, "width", _p$.a = _v$38);
          _v$39 !== _p$.o && (0, import_web133.setAttribute)(_el$11, "height", _p$.o = _v$39);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        });
        return _el$11;
      })(), (0, import_web138.createComponent)(import_solid_js18.For, {
        get each() {
          return laneGridLines(dr());
        },
        children: (g) => (() => {
          var _el$17 = _tmpl$214();
          (0, import_web135.effect)((_p$) => {
            var _v$48 = g.gx, _v$49 = g.y1, _v$50 = g.gx, _v$51 = g.y2;
            _v$48 !== _p$.e && (0, import_web133.setAttribute)(_el$17, "x1", _p$.e = _v$48);
            _v$49 !== _p$.t && (0, import_web133.setAttribute)(_el$17, "y1", _p$.t = _v$49);
            _v$50 !== _p$.a && (0, import_web133.setAttribute)(_el$17, "x2", _p$.a = _v$50);
            _v$51 !== _p$.o && (0, import_web133.setAttribute)(_el$17, "y2", _p$.o = _v$51);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$17;
        })()
      }), (0, import_web138.createComponent)(import_solid_js18.Show, {
        get when() {
          return hover()?.kind === "driver" && !drag;
        },
        get children() {
          var _el$12 = _tmpl$72();
          (0, import_web135.effect)((_p$) => {
            var _v$40 = dr().y, _v$41 = W(), _v$42 = dr().h;
            _v$40 !== _p$.e && (0, import_web133.setAttribute)(_el$12, "y", _p$.e = _v$40);
            _v$41 !== _p$.t && (0, import_web133.setAttribute)(_el$12, "width", _p$.t = _v$41);
            _v$42 !== _p$.a && (0, import_web133.setAttribute)(_el$12, "height", _p$.a = _v$42);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          });
          return _el$12;
        }
      }), (0, import_web137.memo)(() => {
        const diag = diagonalLine(dr(), [0, 1], W());
        return (() => {
          var _el$18 = _tmpl$1();
          (0, import_web135.effect)((_p$) => {
            var _v$52 = diag.x1, _v$53 = diag.y1, _v$54 = diag.x2, _v$55 = diag.y2;
            _v$52 !== _p$.e && (0, import_web133.setAttribute)(_el$18, "x1", _p$.e = _v$52);
            _v$53 !== _p$.t && (0, import_web133.setAttribute)(_el$18, "y1", _p$.t = _v$53);
            _v$54 !== _p$.a && (0, import_web133.setAttribute)(_el$18, "x2", _p$.a = _v$54);
            _v$55 !== _p$.o && (0, import_web133.setAttribute)(_el$18, "y2", _p$.o = _v$55);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          });
          return _el$18;
        })();
      }), (() => {
        var _el$13 = _tmpl$82();
        (0, import_web135.effect)(() => (0, import_web133.setAttribute)(_el$13, "d", curvePath(p.driver, dr(), [0, 1], W())));
        return _el$13;
      })(), (() => {
        var _el$14 = _tmpl$92(), _el$15 = _el$14.firstChild;
        (0, import_web136.insert)(_el$14, () => p.driver.type, null);
        (0, import_web135.effect)((_p$) => {
          var _v$43 = W() * 0.5, _v$44 = dr().y + 13;
          _v$43 !== _p$.e && (0, import_web133.setAttribute)(_el$14, "x", _p$.e = _v$43);
          _v$44 !== _p$.t && (0, import_web133.setAttribute)(_el$14, "y", _p$.t = _v$44);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$14;
      })(), (() => {
        var _el$16 = _tmpl$0();
        var _ref$4 = driverPlayheadEl;
        typeof _ref$4 === "function" ? (0, import_web139.use)(_ref$4, _el$16) : driverPlayheadEl = _el$16;
        (0, import_web135.effect)((_p$) => {
          var _v$45 = dr().y, _v$46 = dr().y + dr().h, _v$47 = p.playheadColor;
          _v$45 !== _p$.e && (0, import_web133.setAttribute)(_el$16, "y1", _p$.e = _v$45);
          _v$46 !== _p$.t && (0, import_web133.setAttribute)(_el$16, "y2", _p$.t = _v$46);
          _v$47 !== _p$.a && (0, import_web134.setStyleProperty)(_el$16, "stroke", _p$.a = _v$47);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        });
        return _el$16;
      })()]
    }), null);
    (0, import_web135.effect)((_p$) => {
      var _v$ = `${W()}px`, _v$2 = `0 0 ${W()} ${totalH()}`, _v$3 = W(), _v$4 = totalH(), _v$5 = `${W()}px`, _v$6 = `${totalH()}px`, _v$7 = cursor(), _v$8 = p.curveColor, _v$9 = mainRect().x, _v$0 = mainRect().y, _v$1 = mainRect().w, _v$10 = mainRect().h, _v$11 = mainRect().y, _v$12 = mainRect().y + mainRect().h, _v$13 = p.playheadColor, _v$14 = mapY(mainRect(), 0), _v$15 = p.playheadColor;
      _v$ !== _p$.e && (0, import_web134.setStyleProperty)(_el$, "width", _p$.e = _v$);
      _v$2 !== _p$.t && (0, import_web133.setAttribute)(_el$2, "viewBox", _p$.t = _v$2);
      _v$3 !== _p$.a && (0, import_web133.setAttribute)(_el$2, "width", _p$.a = _v$3);
      _v$4 !== _p$.o && (0, import_web133.setAttribute)(_el$2, "height", _p$.o = _v$4);
      _v$5 !== _p$.i && (0, import_web134.setStyleProperty)(_el$2, "width", _p$.i = _v$5);
      _v$6 !== _p$.n && (0, import_web134.setStyleProperty)(_el$2, "height", _p$.n = _v$6);
      _v$7 !== _p$.s && (0, import_web134.setStyleProperty)(_el$2, "cursor", _p$.s = _v$7);
      _v$8 !== _p$.h && (0, import_web134.setStyleProperty)(_el$2, "color", _p$.h = _v$8);
      _v$9 !== _p$.r && (0, import_web133.setAttribute)(_el$3, "x", _p$.r = _v$9);
      _v$0 !== _p$.d && (0, import_web133.setAttribute)(_el$3, "y", _p$.d = _v$0);
      _v$1 !== _p$.l && (0, import_web133.setAttribute)(_el$3, "width", _p$.l = _v$1);
      _v$10 !== _p$.u && (0, import_web133.setAttribute)(_el$3, "height", _p$.u = _v$10);
      _v$11 !== _p$.c && (0, import_web133.setAttribute)(_el$4, "y1", _p$.c = _v$11);
      _v$12 !== _p$.w && (0, import_web133.setAttribute)(_el$4, "y2", _p$.w = _v$12);
      _v$13 !== _p$.m && (0, import_web134.setStyleProperty)(_el$4, "stroke", _p$.m = _v$13);
      _v$14 !== _p$.f && (0, import_web133.setAttribute)(_el$5, "cy", _p$.f = _v$14);
      _v$15 !== _p$.y && (0, import_web134.setStyleProperty)(_el$5, "fill", _p$.y = _v$15);
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
(0, import_web132.delegateEvents)(["pointerdown", "pointermove", "pointerup", "dblclick"]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ButtonGroup,
  ColorControl,
  ColorPickerPanel,
  CurveComposer,
  DialRoot,
  DialStore,
  Folder,
  Module,
  PresetManager,
  RangeSlider,
  SegmentedControl,
  SelectControl,
  Slider,
  SpringControl,
  SpringVisualization,
  TextControl,
  Toggle,
  WaveformVisualization,
  createDialKit
});
//# sourceMappingURL=index.cjs.map