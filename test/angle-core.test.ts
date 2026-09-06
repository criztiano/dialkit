import { describe, it, expect } from 'vitest';
import {
  ANGLE_DEAD_ZONE_PX, angleFromPointer, arcPath, bearingToValue, normalizeAngle,
  nudgeAngle, snapAngle, valueToBearing,
} from '../src/angle-core';

describe('bearing mapping', () => {
  it('reads as a compass: min is up, and the range fills one turn clockwise', () => {
    expect(valueToBearing(0, 0, 360)).toBe(0);
    expect(valueToBearing(90, 0, 360)).toBe(90);
    expect(valueToBearing(270, 0, 360)).toBe(270);
  });

  it('maps any range onto the same turn', () => {
    expect(valueToBearing(-180, -180, 180)).toBe(0);
    expect(valueToBearing(0, -180, 180)).toBe(180);
    expect(valueToBearing(0.25, 0, 1)).toBe(90);
  });

  it('round-trips through the bearing', () => {
    for (const v of [0, 37, 180, 359]) {
      expect(bearingToValue(valueToBearing(v, 0, 360), 0, 360)).toBeCloseTo(v, 6);
    }
  });
});

describe('normalizeAngle', () => {
  it('wraps a full turn instead of stopping at the ends', () => {
    expect(normalizeAngle(370, 0, 360, true)).toBeCloseTo(10);
    expect(normalizeAngle(-10, 0, 360, true)).toBeCloseTo(350);
    // The endpoints are the same bearing, so the top folds onto the bottom.
    expect(normalizeAngle(360, 0, 360, true)).toBeCloseTo(0);
  });

  it('wraps a signed range across its own seam', () => {
    expect(normalizeAngle(190, -180, 180, true)).toBeCloseTo(-170);
    expect(normalizeAngle(-190, -180, 180, true)).toBeCloseTo(170);
  });

  it('clamps when the range is not a full turn (a cone width, not a heading)', () => {
    expect(normalizeAngle(200, 0, 90, false)).toBe(90);
    expect(normalizeAngle(-5, 0, 90, false)).toBe(0);
  });
});

describe('snapAngle', () => {
  it('snaps to the step and drops float dust', () => {
    expect(snapAngle(37.4, 0, 5)).toBe(35);
    expect(snapAngle(0.30000000000000004, 0, 0.1)).toBe(0.3);
  });

  it('anchors the lattice at min, so a signed range still steps through zero', () => {
    expect(snapAngle(0.4, -180, 1)).toBe(0);
    expect(snapAngle(2.6, -180, 1)).toBe(3);
  });

  it('leaves the value alone without a step', () => {
    expect(snapAngle(37.4, 0, 0)).toBe(37.4);
  });
});

describe('angleFromPointer', () => {
  const at = (dx: number, dy: number, current = 0) =>
    angleFromPointer(dx, dy, current, 0, 360, 1, true);

  it('ignores the centre, where a bearing is noise rather than intent', () => {
    expect(at(0, 0)).toBeNull();
    expect(at(ANGLE_DEAD_ZONE_PX - 1, 0)).toBeNull();
    expect(at(ANGLE_DEAD_ZONE_PX + 1, 0)).not.toBeNull();
  });

  it('puts the needle under the pointer (screen y is down)', () => {
    expect(at(0, -50)).toBe(0);     // straight up
    expect(at(50, 0)).toBe(90);     // right
    expect(at(0, 50)).toBe(180);    // down
    expect(at(-50, 0)).toBe(270);   // left
  });

  it('takes the short way round, so dragging past the top carries on', () => {
    // At 350°, a pointer 20° clockwise of up is 370 the short way — one more
    // step forward, not 330 backwards — and folds back into the range as 20.
    const next = angleFromPointer(50 * Math.sin(0.35), -50 * Math.cos(0.35), 350, 0, 360, 1, true);
    expect(next).toBeCloseTo(20, 0);
  });

  it('honours the step', () => {
    expect(angleFromPointer(50, 0, 0, 0, 360, 45, true)).toBe(90);
    expect(angleFromPointer(50, -12, 0, 0, 360, 45, true)).toBe(90);
  });

  it('spends the whole circle on the whole range, whatever the range is', () => {
    // A 0..90 range still sweeps a full turn: down is half way round, so 45.
    expect(angleFromPointer(0, 50, 45, 0, 90, 1, false)).toBe(45);
    expect(angleFromPointer(-50, 0, 45, 0, 90, 1, false)).toBe(68);
    // …and the pointer can never ask for a value off the range.
    for (const [dx, dy] of [[50, 0], [0, 50], [-50, -50], [30, -40]]) {
      const v = angleFromPointer(dx, dy, 45, 0, 90, 1, false)!;
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(90);
    }
  });
});

describe('nudgeAngle', () => {
  it('steps and wraps off the bottom of the range', () => {
    expect(nudgeAngle(359, 1, 0, 360, 1, true)).toBe(0);
    expect(nudgeAngle(0, -1, 0, 360, 1, true)).toBe(359);
  });

  it('stops at the ends of a partial range', () => {
    expect(nudgeAngle(90, 1, 0, 90, 1, false)).toBe(90);
  });
});

describe('arcPath', () => {
  it('draws nothing at rest', () => {
    expect(arcPath(0, 0, 10)).toBe('');
  });

  it('flags the large-arc and sweep the way the turn actually went', () => {
    expect(arcPath(0, 90, 10)).toContain('0 1 ');   // short, clockwise
    expect(arcPath(0, 270, 10)).toContain('1 1 ');  // long, clockwise
    expect(arcPath(0, -90, 10)).toContain('0 0 ');  // short, anticlockwise
  });

  it('splits a full turn, which one arc cannot draw', () => {
    expect(arcPath(0, 360, 10).match(/A /g)).toHaveLength(2);
  });
});
