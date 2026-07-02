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
/** r/g/b 0–255, a 0–1. */
type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
};
/** h 0–360, s/v 0–1, a 0–1. The picker's working space. */
type HSVA = {
    h: number;
    s: number;
    v: number;
    a: number;
};
/** h 0–360, s/l 0–1, a 0–1. */
type HSLA = {
    h: number;
    s: number;
    l: number;
    a: number;
};
/** OKLCH: l 0–1, c ≥ 0 (sRGB tops out ≈0.37), h 0–360, a 0–1. */
type OKLCH = {
    l: number;
    c: number;
    h: number;
    a: number;
};
type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';
declare const COLOR_FORMATS: ColorFormat[];
/** Hold duration that clears a filled palette slot. */
declare const LONG_PRESS_MS = 500;
/** Pointer travel that cancels a pending long-press (matches Slider's CLICK_THRESHOLD). */
declare const PALETTE_DRAG_CANCEL_PX = 3;
declare const HEX_COLOR_REGEX: RegExp;
/** Parses #RGB / #RGBA / #RRGGBB / #RRGGBBAA; tolerates a missing '#' and whitespace. */
declare function parseHex(input: string): RGBA | null;
/** Lowercase `#rrggbb`, or `#rrggbbaa` (always, even at a=1) when alpha is enabled. */
declare function formatHex(rgba: RGBA, alphaEnabled: boolean): string;
/** Parse + reformat; strips the alpha channel when alpha is off. Null when unparseable. */
declare function normalizeHex(input: string, alphaEnabled: boolean): string | null;
/** Trigger-row presentation: uppercased, alpha digits hidden (opacity has its own readout). */
declare function displayHex(value: string): string;
/** displayHex without the leading '#' — the trigger row renders the hash as a fixed symbol. */
declare function bareHex(value: string): string;
/**
 * Commits a typed hex edit. The edit field shows only the RGB digits (alpha
 * has its own readout), so a 3/6-digit entry inherits `currentAlpha` instead
 * of silently resetting to opaque; explicit 4/8-digit input overrides it.
 */
declare function normalizeHexEdit(input: string, alphaEnabled: boolean, currentAlpha: number): string | null;
/** 0–100 readout for the trigger row ("60 %"). */
declare function opacityPercent(rgba: RGBA): number;
declare function rgbToHsv(rgba: RGBA): HSVA;
declare function hsvToRgb(hsva: HSVA): RGBA;
declare function rgbToHsl(rgba: RGBA): HSLA;
declare function hslToRgb(hsla: HSLA): RGBA;
declare function rgbToOklch(rgba: RGBA): OKLCH;
/**
 * Maps an out-of-gamut OKLCH into sRGB by binary-searching the chroma down,
 * preserving lightness and hue (channel-clipping would shift the hue).
 */
declare function clampOklchToSrgb(oklch: OKLCH): OKLCH;
declare function oklchToRgb(oklch: OKLCH): RGBA;
type ChannelSpec = {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    /** Decimal places shown in the input. */
    precision: number;
};
declare function getChannels(format: Exclude<ColorFormat, 'hex'>, alphaEnabled: boolean): ChannelSpec[];
/** Display values in channel order (alpha appended when enabled), rounded per spec. */
declare function rgbaToChannels(rgba: RGBA, format: Exclude<ColorFormat, 'hex'>, alphaEnabled: boolean): number[];
/** Commits typed channel values: clamps every channel; the OKLCH path gamut-maps. */
declare function channelsToRgba(values: number[], format: Exclude<ColorFormat, 'hex'>, alphaEnabled: boolean): RGBA;
declare const PALETTE_SIZE = 8;
declare const PALETTE_STORAGE_KEY = "dialkit:color-palette";
/** Fixed-size row of saved hex strings (possibly 8-digit); null = empty slot. */
type PaletteSlots = (string | null)[];
declare function emptyPalette(): PaletteSlots;
declare function serializePalette(slots: PaletteSlots): string;
/** Fail-soft: bad JSON, wrong shape, or non-hex entries become empty slots. */
declare function deserializePalette(raw: string | null | undefined): PaletteSlots;

export { COLOR_FORMATS, type ChannelSpec, type ColorFormat, HEX_COLOR_REGEX, type HSLA, type HSVA, LONG_PRESS_MS, type OKLCH, PALETTE_DRAG_CANCEL_PX, PALETTE_SIZE, PALETTE_STORAGE_KEY, type PaletteSlots, type RGBA, bareHex, channelsToRgba, clampOklchToSrgb, deserializePalette, displayHex, emptyPalette, formatHex, getChannels, hslToRgb, hsvToRgb, normalizeHex, normalizeHexEdit, oklchToRgb, opacityPercent, parseHex, rgbToHsl, rgbToHsv, rgbToOklch, rgbaToChannels, serializePalette };
