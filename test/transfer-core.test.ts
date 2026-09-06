import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TRANSFER, TRANSFER_MAX_POINTS, TRANSFER_MIN_GAP, insertPoint, isIdentityTransfer,
  movePoint, nearestPoint, normalizeTransfer, removePoint, sampleTransfer, transferLut,
} from '../src/transfer-core';

const pts = (...xy: [number, number][]) => xy.map(([x, y]) => ({ x, y }));

describe('normalizeTransfer', () => {
  it('repairs anything into a usable curve', () => {
    expect(normalizeTransfer(undefined)).toEqual(DEFAULT_TRANSFER);
    expect(normalizeTransfer({ points: [] })).toEqual(DEFAULT_TRANSFER);
    expect(normalizeTransfer({ points: [{ x: 0, y: 0 }] })).toEqual(DEFAULT_TRANSFER);
  });

  it('does not hand back the shared default object', () => {
    const a = normalizeTransfer(undefined);
    a.points[0].y = 0.5;
    expect(normalizeTransfer(undefined).points[0].y).toBe(0);
  });

  it('clamps to the unit square and sorts by x', () => {
    const out = normalizeTransfer({ points: pts([0.6, 2], [0.2, -1], [0, 0], [1, 1]) });
    expect(out.points.map((p) => p.x)).toEqual([0, 0.2, 0.6, 1]);
    expect(out.points[1].y).toBe(0);
    expect(out.points[2].y).toBe(1);
  });

  it('pins the ends to the domain but leaves their heights alone', () => {
    const out = normalizeTransfer({ points: pts([0.1, 0.3], [0.9, 0.8]) });
    expect(out.points[0]).toEqual({ x: 0, y: 0.3 });
    expect(out.points[1]).toEqual({ x: 1, y: 0.8 });
  });

  it('drops points too close to grab, and caps the count', () => {
    const crowded = normalizeTransfer({ points: pts([0, 0], [0.5, 0.5], [0.5 + TRANSFER_MIN_GAP / 4, 0.9], [1, 1]) });
    expect(crowded.points).toHaveLength(3);
    const many = normalizeTransfer({
      points: [{ x: 0, y: 0 }, ...Array.from({ length: 30 }, (_, i) => ({ x: (i + 1) / 32, y: 0.5 })), { x: 1, y: 1 }],
    });
    expect(many.points.length).toBeLessThanOrEqual(TRANSFER_MAX_POINTS);
  });

  it('survives non-finite junk', () => {
    const out = normalizeTransfer({ points: [{ x: NaN, y: 0.5 }, { x: 1, y: Infinity }] as never });
    expect(out.points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
  });
});

describe('sampleTransfer', () => {
  it('passes straight through by default', () => {
    for (const x of [0, 0.25, 0.5, 0.75, 1]) {
      expect(sampleTransfer(DEFAULT_TRANSFER.points, x)).toBeCloseTo(x, 6);
    }
  });

  it('hits every control point exactly', () => {
    const p = pts([0, 0.2], [0.4, 0.9], [1, 0.1]);
    expect(sampleTransfer(p, 0)).toBeCloseTo(0.2, 6);
    expect(sampleTransfer(p, 0.4)).toBeCloseTo(0.9, 6);
    expect(sampleTransfer(p, 1)).toBeCloseTo(0.1, 6);
  });

  it('holds the ends outside the domain', () => {
    const p = pts([0, 0.3], [1, 0.7]);
    expect(sampleTransfer(p, -5)).toBeCloseTo(0.3, 6);
    expect(sampleTransfer(p, 5)).toBeCloseTo(0.7, 6);
  });

  it('never overshoots the values you placed — the point of monotone cubic', () => {
    // A step-like shape is what makes a natural spline ring above 1 / below 0.
    const p = pts([0, 0], [0.45, 0.02], [0.55, 0.98], [1, 1]);
    for (let i = 0; i <= 200; i++) {
      const y = sampleTransfer(p, i / 200);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
    }
  });

  it('stays monotone where the points are monotone', () => {
    const p = pts([0, 0], [0.3, 0.1], [0.7, 0.85], [1, 1]);
    let prev = -1;
    for (let i = 0; i <= 200; i++) {
      const y = sampleTransfer(p, i / 200);
      expect(y).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = y;
    }
  });

  it('flattens at a local extreme instead of ringing past it', () => {
    const p = pts([0, 0], [0.5, 1], [1, 0]);
    expect(sampleTransfer(p, 0.5)).toBeCloseTo(1, 6);
    expect(sampleTransfer(p, 0.45)).toBeLessThanOrEqual(1);
    expect(sampleTransfer(p, 0.55)).toBeLessThanOrEqual(1);
  });
});

describe('transferLut', () => {
  it('samples the domain end to end', () => {
    const lut = transferLut(DEFAULT_TRANSFER.points, 5);
    expect(Array.from(lut)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('handles a single-sample table without dividing by zero', () => {
    expect(Array.from(transferLut(DEFAULT_TRANSFER.points, 1))).toEqual([0]);
  });
});

describe('edits', () => {
  it('adds a point in order and reports where it landed', () => {
    const { points, index } = insertPoint(DEFAULT_TRANSFER.points, 0.5, 0.8);
    expect(points).toHaveLength(3);
    expect(index).toBe(1);
    expect(points[1]).toEqual({ x: 0.5, y: 0.8 });
  });

  it('keeps the ends, which anchor the domain', () => {
    const p = pts([0, 0], [0.5, 0.5], [1, 1]);
    expect(removePoint(p, 0)).toBe(p);
    expect(removePoint(p, 2)).toBe(p);
    expect(removePoint(p, 1)).toHaveLength(2);
  });

  it('slides the ends in y only', () => {
    const out = movePoint(DEFAULT_TRANSFER.points, 0, 0.7, 0.4);
    expect(out[0]).toEqual({ x: 0, y: 0.4 });
  });

  it('holds an interior point between its neighbours, so the curve cannot fold', () => {
    const p = pts([0, 0], [0.3, 0.3], [0.6, 0.6], [1, 1]);
    const pushedLeft = movePoint(p, 2, 0, 0.6);
    expect(pushedLeft[2].x).toBeCloseTo(0.3 + TRANSFER_MIN_GAP, 6);
    const pushedRight = movePoint(p, 1, 1, 0.3);
    expect(pushedRight[1].x).toBeCloseTo(0.6 - TRANSFER_MIN_GAP, 6);
    // x stays strictly increasing whatever the drag asked for.
    expect(pushedLeft.every((q, i, a) => i === 0 || q.x > a[i - 1].x)).toBe(true);
  });

  it('does not mutate the input', () => {
    const p = pts([0, 0], [0.5, 0.5], [1, 1]);
    movePoint(p, 1, 0.4, 0.9);
    expect(p[1]).toEqual({ x: 0.5, y: 0.5 });
  });
});

describe('nearestPoint', () => {
  const p = pts([0, 0], [0.5, 0.5], [1, 1]);
  it('finds a point within the tolerance and nothing outside it', () => {
    expect(nearestPoint(p, 0.52, 0.48, 0.05)).toBe(1);
    expect(nearestPoint(p, 0.3, 0.8, 0.05)).toBe(-1);
  });
});

describe('isIdentityTransfer', () => {
  it('recognises the curve that does nothing', () => {
    expect(isIdentityTransfer(DEFAULT_TRANSFER.points)).toBe(true);
    expect(isIdentityTransfer(pts([0, 0], [0.5, 0.7], [1, 1]))).toBe(false);
    expect(isIdentityTransfer(pts([0, 0.2], [1, 1]))).toBe(false);
  });
});
