/**
 * color-core — DOM-free color math shared by every framework port of the
 * color picker (React, Solid, Vue, Svelte). Pure functions only; anything
 * that touches the DOM or storage lives in the component layer or
 * color-palette-store.
 *
 * Canonical value shape: hex string. `#rrggbb` normally, `#rrggbbaa` always
 * (even at full opacity) when a control opts into alpha — deterministic
 * round-tripping keeps store reconciliation trivial.
 */

// ── Types ───────────────────────────────────────────────────────────

/** r/g/b 0–255, a 0–1. */
export type RGBA = { r: number; g: number; b: number; a: number };
/** h 0–360, s/v 0–1, a 0–1. The picker's working space. */
export type HSVA = { h: number; s: number; v: number; a: number };
/** h 0–360, s/l 0–1, a 0–1. */
export type HSLA = { h: number; s: number; l: number; a: number };
/** OKLCH: l 0–1, c ≥ 0 (sRGB tops out ≈0.37), h 0–360, a 0–1. */
export type OKLCH = { l: number; c: number; h: number; a: number };

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';
export const COLOR_FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch'];

// ── Interaction constants ───────────────────────────────────────────

/** Hold duration that clears a filled palette slot. */
export const LONG_PRESS_MS = 500;
/** Pointer travel that cancels a pending long-press (matches Slider's CLICK_THRESHOLD). */
export const PALETTE_DRAG_CANCEL_PX = 3;

// ── Hex ─────────────────────────────────────────────────────────────

export const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const clamp01 = (n: number) => clamp(n, 0, 1);
const byte = (n: number) => clamp(Math.round(n), 0, 255);

/** Parses #RGB / #RGBA / #RRGGBB / #RRGGBBAA; tolerates a missing '#' and whitespace. */
export function parseHex(input: string): RGBA | null {
  if (typeof input !== 'string') return null;
  let s = input.trim();
  if (!s.startsWith('#')) s = `#${s}`;
  if (!HEX_COLOR_REGEX.test(s)) return null;
  let h = s.slice(1);
  if (h.length <= 4) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

/** Lowercase `#rrggbb`, or `#rrggbbaa` (always, even at a=1) when alpha is enabled. */
export function formatHex(rgba: RGBA, alphaEnabled: boolean): string {
  const hx = (n: number) => byte(n).toString(16).padStart(2, '0');
  const base = `#${hx(rgba.r)}${hx(rgba.g)}${hx(rgba.b)}`;
  return alphaEnabled ? `${base}${hx(clamp01(rgba.a) * 255)}` : base;
}

/** Parse + reformat; strips the alpha channel when alpha is off. Null when unparseable. */
export function normalizeHex(input: string, alphaEnabled: boolean): string | null {
  const rgba = parseHex(input);
  return rgba ? formatHex(rgba, alphaEnabled) : null;
}

/** Trigger-row presentation: uppercased, alpha digits hidden (opacity has its own readout). */
export function displayHex(value: string): string {
  const rgba = parseHex(value);
  if (!rgba) return (value ?? '').toUpperCase();
  return formatHex(rgba, false).toUpperCase();
}

/** displayHex without the leading '#' — the trigger row renders the hash as a fixed symbol. */
export function bareHex(value: string): string {
  return displayHex(value).replace(/^#/, '');
}

/**
 * Commits a typed hex edit. The edit field shows only the RGB digits (alpha
 * has its own readout), so a 3/6-digit entry inherits `currentAlpha` instead
 * of silently resetting to opaque; explicit 4/8-digit input overrides it.
 */
export function normalizeHexEdit(input: string, alphaEnabled: boolean, currentAlpha: number): string | null {
  const rgba = parseHex(input);
  if (!rgba) return null;
  const digits = input.trim().replace(/^#/, '').length;
  if (alphaEnabled && (digits === 3 || digits === 6)) rgba.a = clamp01(currentAlpha);
  return formatHex(rgba, alphaEnabled);
}

/** 0–100 readout for the trigger row ("60 %"). */
export function opacityPercent(rgba: RGBA): number {
  return Math.round(clamp01(rgba.a) * 100);
}

// ── RGB ↔ HSV ───────────────────────────────────────────────────────

export function rgbToHsv(rgba: RGBA): HSVA {
  const r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max, a: rgba.a };
}

export function hsvToRgb(hsva: HSVA): RGBA {
  const h = ((hsva.h % 360) + 360) % 360;
  const s = clamp01(hsva.s), v = clamp01(hsva.v);
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
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

// ── RGB ↔ HSL ───────────────────────────────────────────────────────

export function rgbToHsl(rgba: RGBA): HSLA {
  const { h, s, v, a } = rgbToHsv(rgba);
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s: sl, l, a };
}

export function hslToRgb(hsla: HSLA): RGBA {
  const l = clamp01(hsla.l), s = clamp01(hsla.s);
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);
  return hsvToRgb({ h: hsla.h, s: sv, v, a: hsla.a });
}

// ── RGB ↔ OKLCH (hand-rolled Ottosson OKLab; no dependency) ─────────

const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linearToSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function rgbToOklab(rgba: RGBA): { L: number; A: number; B: number } {
  const r = srgbToLinear(rgba.r / 255);
  const g = srgbToLinear(rgba.g / 255);
  const b = srgbToLinear(rgba.b / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    A: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    B: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** Linear-light sRGB channels (unclamped — used for the gamut test). */
function oklabToLinearRgb(L: number, A: number, B: number): { r: number; g: number; b: number } {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2307590544 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  };
}

export function rgbToOklch(rgba: RGBA): OKLCH {
  const { L, A, B } = rgbToOklab(rgba);
  const c = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h: c < 1e-6 ? 0 : h, a: rgba.a };
}

const GAMUT_EPS = 1e-4;

function inSrgbGamut(l: number, c: number, h: number): boolean {
  const rad = (h * Math.PI) / 180;
  const { r, g, b } = oklabToLinearRgb(l, c * Math.cos(rad), c * Math.sin(rad));
  return r >= -GAMUT_EPS && r <= 1 + GAMUT_EPS && g >= -GAMUT_EPS && g <= 1 + GAMUT_EPS && b >= -GAMUT_EPS && b <= 1 + GAMUT_EPS;
}

/**
 * Maps an out-of-gamut OKLCH into sRGB by binary-searching the chroma down,
 * preserving lightness and hue (channel-clipping would shift the hue).
 */
export function clampOklchToSrgb(oklch: OKLCH): OKLCH {
  const l = clamp01(oklch.l);
  const h = ((oklch.h % 360) + 360) % 360;
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

export function oklchToRgb(oklch: OKLCH): RGBA {
  const { l, c, h, a } = clampOklchToSrgb(oklch);
  const rad = (h * Math.PI) / 180;
  const lin = oklabToLinearRgb(l, c * Math.cos(rad), c * Math.sin(rad));
  return {
    r: byte(linearToSrgb(clamp01(lin.r)) * 255),
    g: byte(linearToSrgb(clamp01(lin.g)) * 255),
    b: byte(linearToSrgb(clamp01(lin.b)) * 255),
    a: clamp01(a),
  };
}

// ── Per-format channel model (drives the panel's numeric inputs) ────

export type ChannelSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  /** Decimal places shown in the input. */
  precision: number;
};

const ALPHA_CHANNEL: ChannelSpec = { key: 'a', label: 'A', min: 0, max: 100, step: 1, precision: 0 };

const CHANNELS: Record<Exclude<ColorFormat, 'hex'>, ChannelSpec[]> = {
  rgb: [
    { key: 'r', label: 'R', min: 0, max: 255, step: 1, precision: 0 },
    { key: 'g', label: 'G', min: 0, max: 255, step: 1, precision: 0 },
    { key: 'b', label: 'B', min: 0, max: 255, step: 1, precision: 0 },
  ],
  hsl: [
    { key: 'h', label: 'H', min: 0, max: 360, step: 1, precision: 0 },
    { key: 's', label: 'S', min: 0, max: 100, step: 1, precision: 0 },
    { key: 'l', label: 'L', min: 0, max: 100, step: 1, precision: 0 },
  ],
  oklch: [
    { key: 'l', label: 'L', min: 0, max: 1, step: 0.01, precision: 2 },
    { key: 'c', label: 'C', min: 0, max: 0.4, step: 0.005, precision: 3 },
    { key: 'h', label: 'H', min: 0, max: 360, step: 1, precision: 0 },
  ],
};

export function getChannels(format: Exclude<ColorFormat, 'hex'>, alphaEnabled: boolean): ChannelSpec[] {
  return alphaEnabled ? [...CHANNELS[format], ALPHA_CHANNEL] : CHANNELS[format];
}

const round = (n: number, precision: number) => {
  const f = 10 ** precision;
  return Math.round(n * f) / f;
};

/** Display values in channel order (alpha appended when enabled), rounded per spec. */
export function rgbaToChannels(rgba: RGBA, format: Exclude<ColorFormat, 'hex'>, alphaEnabled: boolean): number[] {
  let values: number[];
  if (format === 'rgb') {
    values = [rgba.r, rgba.g, rgba.b];
  } else if (format === 'hsl') {
    const { h, s, l } = rgbToHsl(rgba);
    values = [round(h, 0), round(s * 100, 0), round(l * 100, 0)];
  } else {
    const { l, c, h } = rgbToOklch(rgba);
    values = [round(l, 2), round(c, 3), round(h, 0)];
  }
  if (alphaEnabled) values.push(opacityPercent(rgba));
  return values;
}

/** Commits typed channel values: clamps every channel; the OKLCH path gamut-maps. */
export function channelsToRgba(values: number[], format: Exclude<ColorFormat, 'hex'>, alphaEnabled: boolean): RGBA {
  const specs = getChannels(format, alphaEnabled);
  const v = specs.map((spec, i) => {
    const n = Number(values[i]);
    // Garbage falls to the channel minimum — except alpha, where a silently
    // transparent color is worse than a silently opaque one.
    const fallback = spec.key === 'a' ? spec.max : spec.min;
    return clamp(Number.isFinite(n) ? n : fallback, spec.min, spec.max);
  });
  const a = alphaEnabled ? v[3] / 100 : 1;
  if (format === 'rgb') return { r: byte(v[0]), g: byte(v[1]), b: byte(v[2]), a };
  if (format === 'hsl') return hslToRgb({ h: v[0], s: v[1] / 100, l: v[2] / 100, a });
  return oklchToRgb({ l: v[0], c: v[1], h: v[2], a });
}

// ── Palette (pure (de)serialization; storage lives in color-palette-store) ──

export const PALETTE_SIZE = 8;
export const PALETTE_STORAGE_KEY = 'tweakers:color-palette';

/** Fixed-size row of saved hex strings (possibly 8-digit); null = empty slot. */
export type PaletteSlots = (string | null)[];

export function emptyPalette(): PaletteSlots {
  return Array(PALETTE_SIZE).fill(null);
}

export function serializePalette(slots: PaletteSlots): string {
  return JSON.stringify(slots.slice(0, PALETTE_SIZE));
}

/** Fail-soft: bad JSON, wrong shape, or non-hex entries become empty slots. */
export function deserializePalette(raw: string | null | undefined): PaletteSlots {
  const slots = emptyPalette();
  if (!raw) return slots;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupted storage is expected input (hand-edited, other-version writes) — treat as empty.
    return slots;
  }
  if (!Array.isArray(parsed)) return slots;
  for (let i = 0; i < PALETTE_SIZE; i++) {
    const entry = parsed[i];
    if (typeof entry === 'string' && HEX_COLOR_REGEX.test(entry)) slots[i] = entry;
  }
  return slots;
}
