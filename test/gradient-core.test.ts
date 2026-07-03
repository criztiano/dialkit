import { describe, it, expect } from 'vitest';
import {
  gradientToCss,
  normalizeGradient,
  colorAtPosition,
  addStop,
  moveStop,
  removeStop,
  setStopColor,
  setGradientType,
  setGradientAngle,
  setGradientCenter,
  setGradientShape,
  DEFAULT_GRADIENT,
  MIN_STOPS,
  type GradientValue,
} from '../src/gradient-core';

const grad = (over: Partial<GradientValue> = {}): GradientValue => ({
  type: 'linear',
  angle: 90,
  stops: [
    { color: '#000000ff', position: 0 },
    { color: '#ffffffff', position: 1 },
  ],
  ...over,
});

describe('gradientToCss', () => {
  it('renders linear with angle', () => {
    expect(gradientToCss(grad())).toBe('linear-gradient(90deg, #000000ff 0%, #ffffffff 100%)');
  });

  it('renders radial centered (angle ignored)', () => {
    expect(gradientToCss(grad({ type: 'radial', angle: 45 }))).toBe(
      'radial-gradient(circle at 50% 50%, #000000ff 0%, #ffffffff 100%)'
    );
  });

  it('renders conic from angle', () => {
    expect(gradientToCss(grad({ type: 'conic', angle: 120 }))).toBe(
      'conic-gradient(from 120deg at 50% 50%, #000000ff 0%, #ffffffff 100%)'
    );
  });

  it('renders a radial ellipse with an off-center origin', () => {
    expect(gradientToCss(grad({ type: 'radial', shape: 'ellipse', centerX: 30, centerY: 70 }))).toBe(
      'radial-gradient(ellipse at 30% 70%, #000000ff 0%, #ffffffff 100%)'
    );
  });

  it('renders a conic origin offset', () => {
    expect(gradientToCss(grad({ type: 'conic', angle: 0, centerX: 25, centerY: 75 }))).toBe(
      'conic-gradient(from 0deg at 25% 75%, #000000ff 0%, #ffffffff 100%)'
    );
  });

  it('sorts stops defensively and rounds percentages', () => {
    const g = grad({
      stops: [
        { color: '#ff0000ff', position: 1 },
        { color: '#00ff00ff', position: 0.3333333 },
        { color: '#0000ffff', position: 0 },
      ],
    });
    expect(gradientToCss(g)).toBe('linear-gradient(90deg, #0000ffff 0%, #00ff00ff 33.33%, #ff0000ff 100%)');
  });

  it('wraps a negative angle', () => {
    expect(gradientToCss(grad({ angle: -90 }))).toContain('270deg');
  });
});

describe('normalizeGradient', () => {
  it('falls back to the default for garbage', () => {
    expect(normalizeGradient(undefined)).toEqual(DEFAULT_GRADIENT);
    expect(normalizeGradient(42)).toEqual(DEFAULT_GRADIENT);
    expect(normalizeGradient({})).toEqual(DEFAULT_GRADIENT);
    expect(normalizeGradient({ stops: 'nope' })).toEqual(DEFAULT_GRADIENT);
  });

  it('returns a fresh object (no shared reference with the default)', () => {
    const out = normalizeGradient(undefined);
    expect(out).not.toBe(DEFAULT_GRADIENT);
    expect(out.stops).not.toBe(DEFAULT_GRADIENT.stops);
  });

  it('coerces an unknown type to linear', () => {
    expect(normalizeGradient({ type: 'diamond', angle: 0, stops: grad().stops }).type).toBe('linear');
  });

  it('wraps angles and defaults non-finite ones', () => {
    expect(normalizeGradient({ type: 'linear', angle: -90, stops: grad().stops }).angle).toBe(270);
    expect(normalizeGradient({ type: 'linear', angle: 540, stops: grad().stops }).angle).toBe(180);
    expect(normalizeGradient({ type: 'linear', angle: NaN, stops: grad().stops }).angle).toBe(DEFAULT_GRADIENT.angle);
  });

  it('sorts, clamps positions, and normalizes stop colors to 8 digits', () => {
    const out = normalizeGradient({
      type: 'linear',
      angle: 0,
      stops: [
        { color: '#abc', position: 2 },
        { color: '#123456', position: -1 },
      ],
    });
    expect(out.stops).toEqual([
      { color: '#123456ff', position: 0 },
      { color: '#aabbccff', position: 1 },
    ]);
  });

  it('drops invalid stops and falls back to default stops below MIN_STOPS', () => {
    const out = normalizeGradient({
      type: 'conic',
      angle: 30,
      stops: [
        { color: 'not-a-color', position: 0 },
        { color: '#ff0000', position: 0.5 },
      ],
    });
    // Only one valid stop survives → default ramp, but type/angle preserved.
    expect(out.type).toBe('conic');
    expect(out.angle).toBe(30);
    expect(out.stops).toEqual(DEFAULT_GRADIENT.stops);
  });

  it('preserves and clamps center/shape when present, omits when absent', () => {
    const withGeo = normalizeGradient({ type: 'radial', angle: 0, stops: grad().stops, centerX: 150, centerY: -20, shape: 'ellipse' });
    expect(withGeo.centerX).toBe(100);
    expect(withGeo.centerY).toBe(0);
    expect(withGeo.shape).toBe('ellipse');

    const plain = normalizeGradient({ type: 'radial', angle: 0, stops: grad().stops });
    expect(plain.centerX).toBeUndefined();
    expect(plain.shape).toBeUndefined();
  });

  it('drops an invalid shape and non-finite center', () => {
    const out = normalizeGradient({ type: 'radial', angle: 0, stops: grad().stops, centerX: NaN, shape: 'square' });
    expect(out.centerX).toBeUndefined();
    expect(out.shape).toBeUndefined();
  });
});

describe('colorAtPosition', () => {
  it('returns endpoint colors past the ends', () => {
    expect(colorAtPosition(grad(), 0)).toBe('#000000ff');
    expect(colorAtPosition(grad(), -5)).toBe('#000000ff');
    expect(colorAtPosition(grad(), 1)).toBe('#ffffffff');
    expect(colorAtPosition(grad(), 9)).toBe('#ffffffff');
  });

  it('interpolates the midpoint of black→white', () => {
    // 0.5 of 0..255 = 127.5 → rounds to 128 = 0x80.
    expect(colorAtPosition(grad(), 0.5)).toBe('#808080ff');
  });

  it('does not muddy toward gray when one endpoint is transparent (premultiplied)', () => {
    const g = grad({
      stops: [
        { color: '#ff0000ff', position: 0 },
        { color: '#0000ff00', position: 1 },
      ],
    });
    const mid = colorAtPosition(g, 0.5);
    // Premultiplied: the transparent blue contributes no color, so the hue
    // stays red (not a muddy purple), only the alpha drops.
    expect(mid.slice(0, 7)).toBe('#ff0000');
    expect(mid).not.toBe('#ff0000ff');
  });

  it('handles equal-position stops without dividing by zero', () => {
    const g = grad({
      stops: [
        { color: '#000000ff', position: 0.5 },
        { color: '#ffffffff', position: 0.5 },
      ],
    });
    expect(() => colorAtPosition(g, 0.5)).not.toThrow();
  });
});

describe('addStop / moveStop / removeStop', () => {
  it('adds a stop seeded with the ramp color and returns its index', () => {
    const { value, index } = addStop(grad(), 0.5);
    expect(value.stops).toHaveLength(3);
    expect(value.stops[index]).toEqual({ color: '#808080ff', position: 0.5 });
  });

  it('does not mutate the input on add', () => {
    const g = grad();
    addStop(g, 0.5);
    expect(g.stops).toHaveLength(2);
  });

  it('moveStop past a neighbor re-sorts and tracks the moved stop', () => {
    const g = grad({
      stops: [
        { color: '#aaaaaaff', position: 0 },
        { color: '#bbbbbbff', position: 0.4 },
        { color: '#ccccccff', position: 0.8 },
      ],
    });
    const { value, index } = moveStop(g, 0, 0.9); // drag first stop past the others
    expect(value.stops.map((s) => s.position)).toEqual([0.4, 0.8, 0.9]);
    expect(value.stops[index].color).toBe('#aaaaaaff');
  });

  it('moveStop clamps to [0,1]', () => {
    const { value, index } = moveStop(grad(), 0, 5);
    expect(value.stops[index].position).toBe(1);
  });

  it('removeStop is a no-op returning the same reference at MIN_STOPS', () => {
    const g = grad();
    expect(g.stops).toHaveLength(MIN_STOPS);
    expect(removeStop(g, 0)).toBe(g);
  });

  it('removeStop drops the stop above MIN_STOPS', () => {
    const g = addStop(grad(), 0.5).value;
    const out = removeStop(g, 1);
    expect(out.stops).toHaveLength(2);
    expect(out).not.toBe(g);
  });
});

describe('setStopColor / setGradientType / setGradientAngle', () => {
  it('normalizes a set stop color to 8 digits', () => {
    expect(setStopColor(grad(), 0, '#f00').stops[0].color).toBe('#ff0000ff');
  });

  it('ignores an unparseable stop color', () => {
    const g = grad();
    expect(setStopColor(g, 0, 'nope')).toBe(g);
  });

  it('switches type while keeping angle and stops', () => {
    const out = setGradientType(grad({ angle: 42 }), 'radial');
    expect(out.type).toBe('radial');
    expect(out.angle).toBe(42);
    expect(out.stops).toHaveLength(2);
  });

  it('wraps a set angle', () => {
    expect(setGradientAngle(grad(), 400).angle).toBe(40);
    expect(setGradientAngle(grad(), -10).angle).toBe(350);
  });

  it('sets and clamps the center', () => {
    const out = setGradientCenter(grad(), 120, 40);
    expect(out.centerX).toBe(100);
    expect(out.centerY).toBe(40);
  });

  it('sets the radial shape', () => {
    expect(setGradientShape(grad(), 'ellipse').shape).toBe('ellipse');
  });
});
