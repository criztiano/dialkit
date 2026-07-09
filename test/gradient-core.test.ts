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
  setGradientScale,
  setGradientSquash,
  setGradientRotation,
  gradientToTransform,
  gradientFillBox,
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

  it('keeps a round default radial as a circle even off-center', () => {
    expect(gradientToCss(grad({ type: 'radial', centerX: 30, centerY: 70 }))).toBe(
      'radial-gradient(circle at 30% 70%, #000000ff 0%, #ffffffff 100%)'
    );
  });

  it('renders explicit radii once squashed or resized', () => {
    expect(gradientToCss(grad({ type: 'radial', squash: 50 }))).toBe(
      'radial-gradient(100% 50% at 50% 50%, #000000ff 0%, #ffffffff 100%)'
    );
    expect(gradientToCss(grad({ type: 'radial', scale: 60 }))).toBe(
      'radial-gradient(60% 60% at 50% 50%, #000000ff 0%, #ffffffff 100%)'
    );
  });

  it('treats squash as an independent vertical radius (tall or wide, either way)', () => {
    // squash > scale → taller than wide.
    expect(gradientToCss(grad({ type: 'radial', squash: 150 }))).toBe(
      'radial-gradient(100% 150% at 50% 50%, #000000ff 0%, #ffffffff 100%)'
    );
    // squash === scale → round again (explicit, since scale isn't 100 here).
    expect(gradientToCss(grad({ type: 'radial', scale: 60, squash: 60 }))).toBe(
      'radial-gradient(60% 60% at 50% 50%, #000000ff 0%, #ffffffff 100%)'
    );
    // A 1% sliver is the flattest it goes (clamped, never 0 → never blank).
    expect(gradientToCss(grad({ type: 'radial', squash: 0 }))).toBe(
      'radial-gradient(100% 1% at 50% 50%, #000000ff 0%, #ffffffff 100%)'
    );
  });

  it('renders a conic origin offset', () => {
    expect(gradientToCss(grad({ type: 'conic', angle: 0, centerX: 25, centerY: 75 }))).toBe(
      'conic-gradient(from 0deg at 25% 75%, #000000ff 0%, #ffffffff 100%)'
    );
  });
});

describe('gradientToTransform', () => {
  it('is identity for linear/conic and for a round or unrotated radial', () => {
    expect(gradientToTransform(grad())).toEqual({ transform: 'none', transformOrigin: '50% 50%' });
    expect(gradientToTransform(grad({ type: 'radial', rotation: 45 }))).toEqual({ transform: 'none', transformOrigin: '50% 50%' });
    expect(gradientToTransform(grad({ type: 'conic', rotation: 45, squash: 50 }))).toEqual({ transform: 'none', transformOrigin: '50% 50%' });
  });

  it('tilts only a squashed radial, around its center', () => {
    expect(gradientToTransform(grad({ type: 'radial', squash: 40, rotation: 30, centerX: 20, centerY: 80 }))).toEqual({
      transform: 'rotate(30deg)',
      transformOrigin: '20% 80%',
    });
  });
});

const r2 = (n: number) => Math.round(n * 100) / 100;

describe('gradientFillBox', () => {
  it('matches the box exactly for linear and conic (no oversize, plain CSS)', () => {
    expect(gradientFillBox(grad(), 200, 100)).toEqual({
      background: gradientToCss(grad()),
      transform: 'none',
      transformOrigin: '50% 50%',
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    });
    const conic = grad({ type: 'conic', angle: 30 });
    expect(gradientFillBox(conic, 200, 100).width).toBe(200);
    expect(gradientFillBox(conic, 200, 100).background).toBe(gradientToCss(conic));
  });

  it('centers an oversized square on the origin with pixel radii for radial', () => {
    // 200x100 box, centered origin, scale 100, squash 50 → rx=200px, ry=50px.
    // side = 2*hypot(200,100) = 447.21; left/top = origin − side/2.
    const box = gradientFillBox(grad({ type: 'radial', squash: 50 }), 200, 100);
    expect(box.background).toBe('radial-gradient(200px 50px at 50% 50%, #000000ff 0%, #ffffffff 100%)');
    expect(box.width).toBe(447.21);
    expect(box.height).toBe(447.21);
    expect(box.left).toBe(r2(100 - 447.21 / 2));
    expect(box.top).toBe(r2(50 - 447.21 / 2));
    expect(box.transform).toBe('none');
  });

  it('rotates a squashed radial around the square center', () => {
    const box = gradientFillBox(grad({ type: 'radial', squash: 40, rotation: 30 }), 120, 120);
    expect(box.transform).toBe('rotate(30deg)');
    expect(box.transformOrigin).toBe('50% 50%');
  });

  it('offsets the square when the origin is off-center', () => {
    const box = gradientFillBox(grad({ type: 'radial', scale: 100, squash: 10, centerX: 25, centerY: 75 }), 200, 100);
    // origin px = (50, 75); side = 2*hypot(200,100) = 447.21.
    expect(box.left).toBe(r2(50 - box.width / 2));
    expect(box.top).toBe(r2(75 - box.height / 2));
  });

  it('falls back to a box-sized plain fill before measurement', () => {
    const box = gradientFillBox(grad({ type: 'radial', squash: 50 }), 0, 0);
    expect(box.width).toBe(0);
    expect(box.background).toBe(gradientToCss(grad({ type: 'radial', squash: 50 })));
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

  it('preserves and clamps geometry when present, omits when absent', () => {
    const withGeo = normalizeGradient({
      type: 'radial', angle: 0, stops: grad().stops,
      centerX: 150, centerY: -20, scale: 500, squash: 120, rotation: 400,
    });
    expect(withGeo.centerX).toBe(100);
    expect(withGeo.centerY).toBe(0);
    expect(withGeo.scale).toBe(200);
    expect(withGeo.squash).toBe(120);
    expect(withGeo.rotation).toBe(40);

    // Squash (vertical radius) clamps to [1, 200], independent of scale.
    expect(normalizeGradient({ type: 'radial', angle: 0, stops: grad().stops, squash: 300 }).squash).toBe(200);
    expect(normalizeGradient({ type: 'radial', angle: 0, stops: grad().stops, squash: 0 }).squash).toBe(1);

    const plain = normalizeGradient({ type: 'radial', angle: 0, stops: grad().stops });
    expect(plain.centerX).toBeUndefined();
    expect(plain.scale).toBeUndefined();
    expect(plain.squash).toBeUndefined();
    expect(plain.rotation).toBeUndefined();
  });

  it('drops non-finite geometry', () => {
    const out = normalizeGradient({ type: 'radial', angle: 0, stops: grad().stops, centerX: NaN, squash: Infinity });
    expect(out.centerX).toBeUndefined();
    expect(out.squash).toBeUndefined();
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

  it('sets and clamps scale, squash, and rotation', () => {
    expect(setGradientScale(grad(), 5).scale).toBe(10);
    expect(setGradientScale(grad(), 300).scale).toBe(200);
    expect(setGradientSquash(grad(), 150).squash).toBe(150);
    expect(setGradientSquash(grad(), 300).squash).toBe(200);
    expect(setGradientSquash(grad(), -10).squash).toBe(1);
    expect(setGradientRotation(grad(), 400).rotation).toBe(40);
  });
});
