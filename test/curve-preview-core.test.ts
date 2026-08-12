import { describe, it, expect } from 'vitest';
import {
  CURVE_DEFAULT_HEIGHT,
  CURVE_MIN_HEIGHT,
  CURVE_MAX_HEIGHT,
  CURVE_FIT_PADDING,
  clampCurveHeight,
  normalizeCurveMarkers,
  plotCurve,
  curveY,
  curvePathData,
} from '../src/curve-preview-core';

describe('clampCurveHeight', () => {
  it('defaults when absent or non-finite', () => {
    expect(clampCurveHeight()).toBe(CURVE_DEFAULT_HEIGHT);
    expect(clampCurveHeight(NaN)).toBe(CURVE_DEFAULT_HEIGHT);
    expect(clampCurveHeight(Infinity)).toBe(CURVE_DEFAULT_HEIGHT);
  });

  it('clamps into the sensible band', () => {
    expect(clampCurveHeight(4)).toBe(CURVE_MIN_HEIGHT);
    expect(clampCurveHeight(90)).toBe(90);
    expect(clampCurveHeight(4000)).toBe(CURVE_MAX_HEIGHT);
  });
});

describe('normalizeCurveMarkers', () => {
  it('is empty when markers are absent or empty', () => {
    expect(normalizeCurveMarkers()).toEqual([]);
    expect(normalizeCurveMarkers([])).toEqual([]);
  });

  it('keeps finite in-range positions, including the edges', () => {
    expect(normalizeCurveMarkers([0, 0.25, 1])).toEqual([0, 0.25, 1]);
  });

  it('skips out-of-range and non-finite entries without clamping', () => {
    expect(normalizeCurveMarkers([-0.1, 0.5, 1.5, NaN, Infinity, -Infinity])).toEqual([0.5]);
    expect(normalizeCurveMarkers(['0.5' as unknown as number, 0.75])).toEqual([0.75]);
  });
});

describe('plotCurve auto-fit', () => {
  it('fits the sampled span with headroom on both sides', () => {
    const { domain, segments } = plotCurve((t) => t, { count: 101 });
    const pad = 1 * CURVE_FIT_PADDING; // span is 1
    expect(domain[0]).toBeCloseTo(-pad);
    expect(domain[1]).toBeCloseTo(1 + pad);
    // One continuous segment covering every sample.
    expect(segments).toHaveLength(1);
    expect(segments[0]).toHaveLength(101);
    expect(segments[0][0].t).toBe(0);
    expect(segments[0][100].t).toBe(1);
  });

  it('centers a flat curve instead of collapsing the domain', () => {
    const { domain, segments } = plotCurve(() => 3);
    expect(domain[0]).toBeLessThan(3);
    expect(domain[1]).toBeGreaterThan(3);
    // Every normalized value sits mid-domain.
    for (const p of segments[0]) expect(p.v).toBeCloseTo(0.5);
  });

  it('spans [0,1] with no baseline when nothing is finite', () => {
    const plot = plotCurve(() => NaN);
    expect(plot.segments).toEqual([]);
    expect(plot.domain).toEqual([0, 1]);
    expect(plot.baseline).toBeNull();
  });
});

describe('plotCurve explicit domain', () => {
  it('uses the given range without headroom', () => {
    const { domain, segments } = plotCurve((t) => t, { domain: [-1, 1], count: 3 });
    expect(domain).toEqual([-1, 1]);
    // t=0 → y=0 → normalized 0.5 of [-1, 1].
    expect(segments[0][0].v).toBeCloseTo(0.5);
    expect(segments[0][2].v).toBeCloseTo(1);
  });

  it('falls back to auto-fit when the domain is degenerate or non-finite', () => {
    expect(plotCurve((t) => t, { domain: [2, 2] }).domain[0]).toBeCloseTo(-CURVE_FIT_PADDING);
    expect(plotCurve((t) => t, { domain: [NaN, 1] }).domain[1]).toBeCloseTo(1 + CURVE_FIT_PADDING);
  });
});

describe('plotCurve baseline', () => {
  it('marks y=0 when the domain spans negative values', () => {
    const { baseline } = plotCurve(() => 0, { domain: [-1, 1] });
    expect(baseline).toBeCloseTo(0.5);
  });

  it('omits the baseline for an all-positive domain', () => {
    expect(plotCurve((t) => t + 1).baseline).toBeNull();
    expect(plotCurve((t) => t, { domain: [0, 1] }).baseline).toBeNull();
  });
});

describe('plotCurve non-finite handling', () => {
  it('skips non-finite samples and splits the stroke there', () => {
    // Defined on the outer thirds, NaN in the middle third.
    const { segments } = plotCurve((t) => (t > 1 / 3 && t < 2 / 3 ? NaN : t), { count: 30 });
    expect(segments).toHaveLength(2);
    const total = segments[0].length + segments[1].length;
    expect(total).toBeLessThan(30);
    expect(total).toBeGreaterThan(15);
  });

  it('treats a throwing or non-number sample as a skipped point', () => {
    const throwing = plotCurve((t) => {
      if (t < 0.5) throw new Error('boom');
      return t;
    });
    expect(throwing.segments).toHaveLength(1);

    const wrongType = plotCurve((() => 'nope') as unknown as (t: number) => number);
    expect(wrongType.segments).toEqual([]);
  });
});

describe('curve path mapping', () => {
  it('maps normalized values to inset, y-flipped pixels', () => {
    expect(curveY(0, 64, 4)).toBe(60); // domain min → bottom inset
    expect(curveY(1, 64, 4)).toBe(4); // domain max → top inset
    expect(curveY(0.5, 64)).toBe(32);
  });

  it('emits one subpath per segment', () => {
    const d = curvePathData(
      [
        [{ t: 0, v: 0 }, { t: 0.5, v: 1 }],
        [{ t: 0.75, v: 0.5 }],
      ],
      100,
      50
    );
    expect(d).toBe('M 0 50 L 50 0 M 75 25');
  });

  it('is empty for an empty plot', () => {
    expect(curvePathData([], 100, 50)).toBe('');
  });
});
