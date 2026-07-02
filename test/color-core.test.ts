import { describe, it, expect } from 'vitest';
import {
  parseHex,
  formatHex,
  normalizeHex,
  displayHex,
  opacityPercent,
  rgbToHsv,
  hsvToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  clampOklchToSrgb,
  getChannels,
  rgbaToChannels,
  channelsToRgba,
  serializePalette,
  deserializePalette,
  emptyPalette,
  PALETTE_SIZE,
  type RGBA,
} from '../src/color-core';

const rgba = (r: number, g: number, b: number, a = 1): RGBA => ({ r, g, b, a });

describe('parseHex', () => {
  it('parses 6-digit hex', () => {
    expect(parseHex('#310b02')).toEqual(rgba(0x31, 0x0b, 0x02));
  });

  it('expands 3-digit shorthand', () => {
    expect(parseHex('#abc')).toEqual(rgba(0xaa, 0xbb, 0xcc));
  });

  it('expands 4-digit shorthand with alpha', () => {
    expect(parseHex('#abcf')).toEqual(rgba(0xaa, 0xbb, 0xcc, 1));
    expect(parseHex('#f008')?.a).toBeCloseTo(0x88 / 255, 5);
  });

  it('parses 8-digit hex alpha', () => {
    expect(parseHex('#310b0299')?.a).toBeCloseTo(0x99 / 255, 5);
  });

  it('tolerates a missing hash and whitespace', () => {
    expect(parseHex(' 310b02 ')).toEqual(rgba(0x31, 0x0b, 0x02));
  });

  it('rejects garbage', () => {
    expect(parseHex('')).toBeNull();
    expect(parseHex('#31')).toBeNull();
    expect(parseHex('#12345')).toBeNull();
    expect(parseHex('#zzzzzz')).toBeNull();
    expect(parseHex('red')).toBeNull();
  });
});

describe('formatHex', () => {
  it('emits lowercase #rrggbb when alpha is off', () => {
    expect(formatHex(rgba(0x31, 0x0b, 0x02, 0.5), false)).toBe('#310b02');
  });

  it('always emits 8 digits when alpha is on, even at a=1', () => {
    expect(formatHex(rgba(0x31, 0x0b, 0x02, 1), true)).toBe('#310b02ff');
    expect(formatHex(rgba(0x31, 0x0b, 0x02, 0.6), true)).toBe('#310b0299');
  });

  it('clamps out-of-range channels', () => {
    expect(formatHex(rgba(300, -5, 12.4), false)).toBe('#ff000c');
  });
});

describe('normalizeHex', () => {
  it('normalizes shorthand to full form', () => {
    expect(normalizeHex('#abc', false)).toBe('#aabbcc');
  });

  it('strips alpha digits when alpha is off', () => {
    expect(normalizeHex('#310b0299', false)).toBe('#310b02');
  });

  it('adds alpha digits when alpha is on', () => {
    expect(normalizeHex('#310b02', true)).toBe('#310b02ff');
  });

  it('returns null on invalid input', () => {
    expect(normalizeHex('nope', true)).toBeNull();
  });
});

describe('displayHex / opacityPercent', () => {
  it('uppercases and hides alpha digits for the trigger row', () => {
    expect(displayHex('#310b0299')).toBe('#310B02');
  });

  it('rounds opacity to whole percent', () => {
    expect(opacityPercent(rgba(0, 0, 0, 0.6))).toBe(60);
    expect(opacityPercent(rgba(0, 0, 0, 1))).toBe(100);
    expect(opacityPercent(rgba(0, 0, 0, 0))).toBe(0);
  });
});

describe('RGB ↔ HSV', () => {
  it('handles primaries', () => {
    expect(rgbToHsv(rgba(255, 0, 0))).toMatchObject({ h: 0, s: 1, v: 1 });
    expect(rgbToHsv(rgba(0, 255, 0)).h).toBe(120);
    expect(rgbToHsv(rgba(0, 0, 255)).h).toBe(240);
  });

  it('handles degenerate grays (hue 0, saturation 0)', () => {
    expect(rgbToHsv(rgba(0, 0, 0))).toMatchObject({ h: 0, s: 0, v: 0 });
    expect(rgbToHsv(rgba(255, 255, 255))).toMatchObject({ h: 0, s: 0, v: 1 });
    expect(rgbToHsv(rgba(128, 128, 128)).s).toBe(0);
  });

  it('round-trips a color grid within 1/255', () => {
    for (let h = 0; h < 360; h += 30) {
      for (const s of [0, 0.25, 0.5, 1]) {
        for (const v of [0, 0.25, 0.5, 1]) {
          const start = hsvToRgb({ h, s, v, a: 1 });
          const back = hsvToRgb(rgbToHsv(start));
          expect(Math.abs(back.r - start.r)).toBeLessThanOrEqual(1);
          expect(Math.abs(back.g - start.g)).toBeLessThanOrEqual(1);
          expect(Math.abs(back.b - start.b)).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('preserves alpha', () => {
    expect(hsvToRgb(rgbToHsv(rgba(10, 20, 30, 0.4))).a).toBeCloseTo(0.4, 10);
  });
});

describe('RGB ↔ HSL', () => {
  it('matches known values', () => {
    expect(rgbToHsl(rgba(255, 0, 0))).toMatchObject({ h: 0, s: 1, l: 0.5 });
    const navy = rgbToHsl(rgba(0, 0, 128));
    expect(navy.h).toBe(240);
    expect(navy.l).toBeCloseTo(0.251, 2);
  });

  it('round-trips within 1/255', () => {
    for (const c of [rgba(255, 0, 0), rgba(12, 200, 99), rgba(1, 2, 3), rgba(254, 254, 200)]) {
      const back = hslToRgb(rgbToHsl(c));
      expect(Math.abs(back.r - c.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.g - c.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.b - c.b)).toBeLessThanOrEqual(1);
    }
  });
});

describe('RGB ↔ OKLCH', () => {
  it('white is L≈1 C≈0', () => {
    const w = rgbToOklch(rgba(255, 255, 255));
    expect(w.l).toBeCloseTo(1, 3);
    expect(w.c).toBeLessThan(0.001);
  });

  it('black is L≈0 C≈0', () => {
    const k = rgbToOklch(rgba(0, 0, 0));
    expect(k.l).toBeCloseTo(0, 3);
    expect(k.c).toBeLessThan(0.001);
  });

  it('sRGB red matches the published reference', () => {
    const red = rgbToOklch(rgba(255, 0, 0));
    expect(red.l).toBeCloseTo(0.628, 3);
    expect(red.c).toBeCloseTo(0.2577, 3);
    expect(red.h).toBeCloseTo(29.23, 1);
  });

  it('round-trips in-gamut colors within 1/255', () => {
    for (const c of [rgba(255, 0, 0), rgba(49, 11, 2), rgba(99, 102, 241), rgba(16, 185, 129), rgba(255, 255, 255)]) {
      const back = oklchToRgb(rgbToOklch(c));
      expect(Math.abs(back.r - c.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.g - c.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.b - c.b)).toBeLessThanOrEqual(1);
    }
  });

  it('clampOklchToSrgb leaves in-gamut colors untouched', () => {
    const inGamut = rgbToOklch(rgba(99, 102, 241));
    const clamped = clampOklchToSrgb(inGamut);
    expect(clamped.c).toBeCloseTo(inGamut.c, 6);
    expect(clamped.h).toBeCloseTo(inGamut.h, 6);
  });

  it('reduces chroma of out-of-gamut input while preserving hue', () => {
    const wild = { l: 0.7, c: 0.37, h: 150, a: 1 };
    const clamped = clampOklchToSrgb(wild);
    expect(clamped.c).toBeLessThan(wild.c);
    expect(clamped.l).toBe(wild.l);
    expect(clamped.h).toBe(wild.h);
    // The mapped color re-measures near the requested hue/lightness.
    const back = rgbToOklch(oklchToRgb(wild));
    expect(Math.abs(back.h - wild.h)).toBeLessThan(2);
    expect(Math.abs(back.l - wild.l)).toBeLessThan(0.02);
  });
});

describe('channel model', () => {
  it('appends the alpha channel only when enabled', () => {
    expect(getChannels('rgb', false).map((c) => c.key)).toEqual(['r', 'g', 'b']);
    expect(getChannels('rgb', true).map((c) => c.key)).toEqual(['r', 'g', 'b', 'a']);
  });

  it('maps rgba to display channels per format', () => {
    expect(rgbaToChannels(rgba(255, 0, 0, 0.6), 'rgb', true)).toEqual([255, 0, 0, 60]);
    expect(rgbaToChannels(rgba(255, 0, 0), 'hsl', false)).toEqual([0, 100, 50]);
    const [l, c, h] = rgbaToChannels(rgba(255, 0, 0), 'oklch', false);
    expect(l).toBeCloseTo(0.63, 2);
    expect(c).toBeCloseTo(0.258, 3);
    expect(h).toBe(29);
  });

  it('clamps typed values on commit', () => {
    expect(channelsToRgba([999, -4, 128], 'rgb', false)).toEqual(rgba(255, 0, 128));
    expect(channelsToRgba([0, 100, 50, 250], 'rgb', true).a).toBe(1);
  });

  it('treats non-numeric input as the channel minimum', () => {
    expect(channelsToRgba([NaN, 10, 20], 'rgb', false).r).toBe(0);
  });

  it('round-trips hsl channels', () => {
    const out = channelsToRgba([0, 100, 50], 'hsl', false);
    expect(out).toEqual(rgba(255, 0, 0));
  });

  it('gamut-maps oklch channel commits', () => {
    const out = channelsToRgba([0.7, 0.4, 150], 'oklch', false);
    expect(out.r).toBeGreaterThanOrEqual(0);
    expect(out.r).toBeLessThanOrEqual(255);
    const measured = rgbToOklch(out);
    expect(Math.abs(measured.h - 150)).toBeLessThan(2);
  });
});

describe('palette serialization', () => {
  it('round-trips', () => {
    const slots = emptyPalette();
    slots[0] = '#310b02';
    slots[3] = '#310b0299';
    expect(deserializePalette(serializePalette(slots))).toEqual(slots);
  });

  it('is fail-soft on corrupted JSON', () => {
    expect(deserializePalette('{oops')).toEqual(emptyPalette());
    expect(deserializePalette(null)).toEqual(emptyPalette());
    expect(deserializePalette(undefined)).toEqual(emptyPalette());
  });

  it('sanitizes wrong shapes and non-hex entries', () => {
    expect(deserializePalette('42')).toEqual(emptyPalette());
    expect(deserializePalette('{"a":1}')).toEqual(emptyPalette());
    const mixed = deserializePalette(JSON.stringify(['#ff0000', 'red', 7, null, '#abc']));
    expect(mixed[0]).toBe('#ff0000');
    expect(mixed[1]).toBeNull();
    expect(mixed[2]).toBeNull();
    expect(mixed[4]).toBe('#abc');
    expect(mixed).toHaveLength(PALETTE_SIZE);
  });

  it('truncates oversized arrays to the fixed size', () => {
    const big = JSON.stringify(Array(20).fill('#ffffff'));
    expect(deserializePalette(big)).toHaveLength(PALETTE_SIZE);
  });
});
