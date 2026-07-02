import { describe, it, expect } from 'vitest';
import {
  resolveAxis,
  clamp,
  snapToStep,
  valueToNorm,
  normToValue,
  invertY,
  valueFromPoint,
  pointFromValue,
  applyDetentAxis,
  nudge,
  centerValue,
  normalizeValue,
  XY_DETENT_PX,
  XY_DEFAULT_STEP,
  type AxisSpec,
} from '../src/xy-pad-core';

// A default resolved axis (0..1) and a symmetric bipolar axis (-1..1) cover the two
// shapes every mapping function has to handle. `neg` exercises the min<0<max case that
// a naive (v/max) normalizer would get wrong.
const unit = resolveAxis(); // 0..1, step 0.01, origin 0
const bip = resolveAxis({ min: -1, max: 1, step: 0.1, bipolar: true }); // origin 0 (midpoint)
const neg = resolveAxis({ min: -50, max: 50, step: 1, bipolar: true }); // origin 0

describe('resolveAxis', () => {
  it('fills defaults when nothing is given', () => {
    expect(resolveAxis()).toEqual({ min: 0, max: 1, step: XY_DEFAULT_STEP, origin: 0, bipolar: false });
  });

  it('defaults a bipolar origin to the axis midpoint', () => {
    expect(resolveAxis({ min: -1, max: 1, bipolar: true }).origin).toBe(0);
    expect(resolveAxis({ min: 0, max: 10, bipolar: true }).origin).toBe(5);
  });

  it('honours an explicit origin over the midpoint/min fallback', () => {
    expect(resolveAxis({ min: -1, max: 1, bipolar: true, origin: 0.25 }).origin).toBe(0.25);
    expect(resolveAxis({ min: 0, max: 10, origin: 3 }).origin).toBe(3);
  });

  it('a non-bipolar axis rests at min', () => {
    expect(resolveAxis({ min: 2, max: 8 }).origin).toBe(2);
  });

  it('does not mutate its input', () => {
    const input = { min: -1, max: 1, bipolar: true };
    const snapshot = { ...input };
    resolveAxis(input);
    expect(input).toEqual(snapshot);
  });
});

describe('clamp', () => {
  it('passes through in-range values and clamps out-of-range ones', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(-3, 0, 1)).toBe(0);
    expect(clamp(9, 0, 1)).toBe(1);
    expect(clamp(-5, -10, 10)).toBe(-5);
  });
});

describe('snapToStep', () => {
  it('snaps to the nearest multiple of step measured from min', () => {
    expect(snapToStep(0.234, 0.1, 0)).toBe(0.2);
    expect(snapToStep(0.271, 0.1, 0)).toBe(0.3);
    // measured from a non-zero min: grid is -1, -0.9, -0.8 …
    expect(snapToStep(-0.44, 0.1, -1)).toBe(-0.4);
  });

  it('rounds to the step precision (no float dust)', () => {
    // 0.1 + 0.2 style accumulation must not leak into the result
    expect(snapToStep(0.3, 0.1, 0)).toBe(0.3);
    expect(snapToStep(0.07, 0.01, 0)).toBe(0.07);
  });

  it('is a passthrough for a non-positive step', () => {
    expect(snapToStep(0.1234, 0, 0)).toBe(0.1234);
    expect(snapToStep(0.1234, -1, 0)).toBe(0.1234);
  });

  it('snapping then clamping composes as the caller expects', () => {
    const snapped = snapToStep(0.98, 0.25, 0); // → 1.0
    expect(snapped).toBe(1);
    expect(clamp(snapped, 0, 1)).toBe(1);
  });
});

describe('valueToNorm ↔ normToValue', () => {
  it('maps endpoints and midpoint on a unit axis', () => {
    expect(valueToNorm(0, unit)).toBe(0);
    expect(valueToNorm(1, unit)).toBe(1);
    expect(valueToNorm(0.5, unit)).toBe(0.5);
  });

  it('clamps out-of-range values to [0,1]', () => {
    expect(valueToNorm(-2, unit)).toBe(0);
    expect(valueToNorm(2, unit)).toBe(1);
  });

  it('handles a negative range (min<0<max) — origin sits at norm 0.5', () => {
    expect(valueToNorm(0, neg)).toBe(0.5);
    expect(valueToNorm(-50, neg)).toBe(0);
    expect(valueToNorm(50, neg)).toBe(1);
    expect(normToValue(0.5, neg)).toBe(0);
    expect(normToValue(0, neg)).toBe(-50);
    expect(normToValue(1, neg)).toBe(50);
  });

  it('round-trips value → norm → value across several points', () => {
    for (const v of [-50, -12.5, 0, 7, 50]) {
      expect(normToValue(valueToNorm(v, neg), neg)).toBeCloseTo(v, 10);
    }
  });

  it('guards a degenerate axis (max===min) by collapsing to 0', () => {
    const flat: AxisSpec = { min: 5, max: 5, step: 1, origin: 5, bipolar: false };
    expect(valueToNorm(5, flat)).toBe(0);
    expect(valueToNorm(9, flat)).toBe(0);
  });

  it('normToValue clamps its input to [0,1] first', () => {
    expect(normToValue(-1, unit)).toBe(0);
    expect(normToValue(2, unit)).toBe(1);
  });
});

describe('invertY', () => {
  it('flips the [0,1] axis', () => {
    expect(invertY(0)).toBe(1);
    expect(invertY(1)).toBe(0);
    expect(invertY(0.25)).toBe(0.75);
  });
});

describe('valueFromPoint', () => {
  it('honours the Cartesian corner contract', () => {
    // bottom-left of the pad → axis minimums
    expect(valueFromPoint({ x: 0, y: 1 }, neg, neg)).toEqual({ x: -50, y: -50 });
    // top-right of the pad → axis maximums
    expect(valueFromPoint({ x: 1, y: 0 }, neg, neg)).toEqual({ x: 50, y: 50 });
  });

  it('maps the two axes independently', () => {
    const xA = resolveAxis({ min: 0, max: 100 });
    const yA = resolveAxis({ min: -10, max: 10, bipolar: true });
    // point.y=0 is the TOP → yMax; x maps directly
    expect(valueFromPoint({ x: 0.25, y: 0 }, xA, yA)).toEqual({ x: 25, y: 10 });
    // centre of the pad
    expect(valueFromPoint({ x: 0.5, y: 0.5 }, xA, yA)).toEqual({ x: 50, y: 0 });
  });

  it('snaps to each axis step when snap=true', () => {
    const a = resolveAxis({ min: 0, max: 1, step: 0.25 });
    const noSnap = valueFromPoint({ x: 0.6, y: 0.6 }, a, a, false);
    expect(noSnap.x).toBeCloseTo(0.6);
    const snapped = valueFromPoint({ x: 0.6, y: 0.6 }, a, a, true);
    expect(snapped.x).toBe(0.5); // 0.6 → nearest 0.25 grid point
    expect(snapped.y).toBe(0.5); // invertY(0.6)=0.4 → 0.5
  });

  it('clamps an out-of-range point into the axis range', () => {
    expect(valueFromPoint({ x: 1.5, y: -0.5 }, neg, neg)).toEqual({ x: 50, y: 50 });
    expect(valueFromPoint({ x: -0.5, y: 1.5 }, neg, neg)).toEqual({ x: -50, y: -50 });
  });
});

describe('pointFromValue', () => {
  it('is the inverse of valueFromPoint (round-trip)', () => {
    const xA = resolveAxis({ min: 0, max: 100 });
    const yA = resolveAxis({ min: -10, max: 10, bipolar: true });
    for (const value of [
      { x: 0, y: -10 },
      { x: 100, y: 10 },
      { x: 50, y: 0 },
      { x: 25, y: 5 },
    ]) {
      const point = pointFromValue(value, xA, yA);
      expect(valueFromPoint(point, xA, yA)).toEqual(value);
    }
  });

  it('puts yMax at the top of the pad (point.y=0)', () => {
    const yA = resolveAxis({ min: -1, max: 1, bipolar: true });
    expect(pointFromValue({ x: 0.5, y: 1 }, unit, yA).y).toBe(0);
    expect(pointFromValue({ x: 0.5, y: -1 }, unit, yA).y).toBe(1);
    expect(pointFromValue({ x: 0.5, y: 0 }, unit, yA).y).toBe(0.5);
  });
});

describe('applyDetentAxis', () => {
  it('snaps to origin within the pixel band on a bipolar axis', () => {
    expect(applyDetentAxis(0.03, bip, 0)).toBe(0); // dead centre
    expect(applyDetentAxis(0.03, bip, XY_DETENT_PX)).toBe(0); // at the band edge
  });

  it('releases the value once past the band', () => {
    expect(applyDetentAxis(0.03, bip, XY_DETENT_PX + 0.01)).toBe(0.03);
    expect(applyDetentAxis(0.5, bip, 20)).toBe(0.5);
  });

  it('is a no-op on a non-bipolar axis regardless of distance', () => {
    expect(applyDetentAxis(0.03, unit, 0)).toBe(0.03);
    expect(applyDetentAxis(0.03, unit, 100)).toBe(0.03);
  });
});

describe('nudge', () => {
  it('normal mode steps by the axis step, Cartesian up increases y', () => {
    const v = { x: 0, y: 0 };
    expect(nudge(v, 'y', 1, unit, unit).y).toBeCloseTo(0.01); // step 0.01
    expect(nudge(v, 'y', -1, neg, neg).y).toBe(-1); // step 1 down
    expect(nudge(v, 'x', 1, neg, neg).x).toBe(1);
  });

  it('fine and coarse scale by range×0.01 and range×0.1', () => {
    const v = { x: 0, y: 0 };
    // neg range is 100 → fine step 1, coarse step 10
    expect(nudge(v, 'x', 1, neg, neg, 'fine').x).toBe(1);
    expect(nudge(v, 'x', 1, neg, neg, 'coarse').x).toBe(10);
  });

  it('clamps at the axis bounds', () => {
    expect(nudge({ x: 50, y: 0 }, 'x', 1, neg, neg, 'coarse').x).toBe(50);
    expect(nudge({ x: -50, y: 0 }, 'x', -1, neg, neg, 'coarse').x).toBe(-50);
  });

  it('leaves the other axis untouched and returns a new object', () => {
    const v = { x: 3, y: 7 };
    const out = nudge(v, 'y', 1, neg, neg);
    expect(out.x).toBe(3); // untouched
    expect(out.y).toBe(8);
    expect(out).not.toBe(v); // new object
    expect(v).toEqual({ x: 3, y: 7 }); // input not mutated
  });

  it('rounds away float dust from a fractional step', () => {
    const a = resolveAxis({ min: 0, max: 1, step: 0.1 });
    // 0.3 - 0.1 must land exactly on 0.2, not 0.19999…
    expect(nudge({ x: 0.3, y: 0 }, 'x', -1, a, a).x).toBe(0.2);
  });
});

describe('centerValue', () => {
  it('returns each axis origin', () => {
    expect(centerValue(bip, bip)).toEqual({ x: 0, y: 0 });
    const xA = resolveAxis({ min: 0, max: 10, origin: 3 });
    const yA = resolveAxis({ min: -5, max: 5, bipolar: true });
    expect(centerValue(xA, yA)).toEqual({ x: 3, y: 0 });
  });

  it('a plain non-bipolar unit axis rests at min', () => {
    expect(centerValue(unit, unit)).toEqual({ x: 0, y: 0 });
  });
});

describe('normalizeValue', () => {
  it('falls back to origin for undefined / missing components', () => {
    expect(normalizeValue(undefined, neg, neg)).toEqual({ x: 0, y: 0 }); // both origins
    expect(normalizeValue({ x: 20 }, neg, neg)).toEqual({ x: 20, y: 0 }); // y → origin
  });

  it('falls back to origin for non-finite components', () => {
    expect(normalizeValue({ x: Number.NaN, y: 12 }, neg, neg)).toEqual({ x: 0, y: 12 });
    expect(normalizeValue({ x: Infinity, y: -Infinity }, neg, neg)).toEqual({ x: 0, y: 0 });
  });

  it('clamps into the axis range', () => {
    expect(normalizeValue({ x: 999, y: -999 }, neg, neg)).toEqual({ x: 50, y: -50 });
  });

  it('snaps to the step when snap=true', () => {
    const a = resolveAxis({ min: 0, max: 1, step: 0.25 });
    expect(normalizeValue({ x: 0.6, y: 0.6 }, a, a, true)).toEqual({ x: 0.5, y: 0.5 });
  });

  it('normalizes negative zero to positive zero', () => {
    const out = normalizeValue({ x: -0, y: -0 }, neg, neg);
    expect(Object.is(out.x, 0)).toBe(true); // not -0
    expect(Object.is(out.y, 0)).toBe(true);
  });

  it('does not mutate its input', () => {
    const input = { x: 999, y: 5 };
    const snapshot = { ...input };
    normalizeValue(input, neg, neg);
    expect(input).toEqual(snapshot);
  });
});
