import { describe, it, expect } from 'vitest';
import {
  clamp,
  valueToPercent,
  percentToValue,
  orderRange,
  clampRange,
  setLow,
  setHigh,
  shiftSpan,
  nearestHandle,
  pickDragTarget,
  isOutsideSpan,
  handleLeftStyles,
  type RangeValue,
} from '../src/range-slider-core';

const r = (min: number, max: number): RangeValue => ({ min, max });

describe('clamp', () => {
  it('passes an in-range value through unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps below the low bound and above the high bound', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it('returns the bounds themselves at the edges', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe('valueToPercent / percentToValue', () => {
  it('maps the bounds to 0 and 100 and the midpoint to 50', () => {
    expect(valueToPercent(0, 0, 200)).toBe(0);
    expect(valueToPercent(200, 0, 200)).toBe(100);
    expect(valueToPercent(100, 0, 200)).toBe(50);
  });

  it('round-trips value → percent → value across the span', () => {
    const min = 10;
    const max = 90;
    for (const v of [10, 25, 50, 73.5, 90]) {
      const pct01 = valueToPercent(v, min, max) / 100;
      expect(percentToValue(pct01, min, max)).toBeCloseTo(v, 10);
    }
  });

  it('guards the degenerate max===min span: no NaN/Infinity', () => {
    const pct = valueToPercent(5, 5, 5);
    expect(pct).toBe(0);
    expect(Number.isFinite(pct)).toBe(true);
    // Inverse on a zero-width span collapses to the single bound value.
    const v = percentToValue(0.5, 5, 5);
    expect(v).toBe(5);
    expect(Number.isFinite(v)).toBe(true);
  });

  it('percentToValue clamps the incoming fraction into [0,1]', () => {
    expect(percentToValue(-1, 0, 100)).toBe(0); // under-range fraction parks at min
    expect(percentToValue(2, 0, 100)).toBe(100); // over-range fraction parks at max
  });
});

describe('orderRange', () => {
  it('leaves an already-ordered pair untouched', () => {
    const ordered = r(2, 8);
    expect(orderRange(ordered)).toEqual(r(2, 8));
  });

  it('swaps a reversed pair so min <= max', () => {
    expect(orderRange(r(8, 2))).toEqual(r(2, 8));
  });

  it('allows equal handles (zero-width)', () => {
    expect(orderRange(r(5, 5))).toEqual(r(5, 5));
  });
});

describe('clampRange', () => {
  it('clamps both ends into the bounds', () => {
    expect(clampRange(r(-10, 500), 0, 100)).toEqual(r(0, 100));
  });

  it('clamps first, then orders a reversed-after-clamp pair', () => {
    // Both ends land above max → both clamp to 100, order keeps min <= max.
    expect(clampRange(r(200, 150), 0, 100)).toEqual(r(100, 100));
    // Reversed but in-range: clamp is a no-op, order swaps.
    expect(clampRange(r(80, 20), 0, 100)).toEqual(r(20, 80));
  });
});

describe('setLow', () => {
  it('moves the low handle within [min, current.max]', () => {
    expect(setLow(30, r(20, 80), 0)).toEqual(r(30, 80));
  });

  it('cannot exceed current.max (handles do not cross)', () => {
    expect(setLow(95, r(20, 80), 0)).toEqual(r(80, 80));
  });

  it('clamps to the low bound', () => {
    expect(setLow(-50, r(20, 80), 0)).toEqual(r(0, 80));
  });

  it('leaves the high handle untouched', () => {
    expect(setLow(40, r(20, 80), 0).max).toBe(80);
  });
});

describe('setHigh', () => {
  it('moves the high handle within [current.min, max]', () => {
    expect(setHigh(60, r(20, 80), 100)).toEqual(r(20, 60));
  });

  it('cannot go below current.min (handles do not cross)', () => {
    expect(setHigh(5, r(20, 80), 100)).toEqual(r(20, 20));
  });

  it('clamps to the high bound', () => {
    expect(setHigh(150, r(20, 80), 100)).toEqual(r(20, 100));
  });

  it('leaves the low handle untouched', () => {
    expect(setHigh(50, r(20, 80), 100).min).toBe(20);
  });
});

describe('shiftSpan', () => {
  it('preserves width while sliding the span', () => {
    const next = shiftSpan(10, r(20, 50), 0, 100);
    expect(next).toEqual(r(30, 60));
    expect(next.max - next.min).toBe(30);
  });

  it('parks flush at the high edge without shrinking when pushed past it', () => {
    const next = shiftSpan(1000, r(20, 50), 0, 100); // width 30 → clamps to [70,100]
    expect(next).toEqual(r(70, 100));
    expect(next.max - next.min).toBe(30);
  });

  it('parks flush at the low edge without shrinking when pushed past it', () => {
    const next = shiftSpan(-1000, r(20, 50), 0, 100); // width 30 → clamps to [0,30]
    expect(next).toEqual(r(0, 30));
    expect(next.max - next.min).toBe(30);
  });

  it('a negative delta beyond the edge parks at the edge, not beyond', () => {
    const next = shiftSpan(-25, r(20, 50), 0, 100);
    expect(next).toEqual(r(0, 30)); // desiredMin -5 clamps to 0
  });
});

describe('nearestHandle', () => {
  it('picks the closer handle', () => {
    expect(nearestHandle(25, r(20, 80))).toBe('min'); // 5 vs 55
    expect(nearestHandle(75, r(20, 80))).toBe('max'); // 55 vs 5
  });

  it('disambiguates an exact tie by side', () => {
    // Midpoint is equidistant; 50 is not below min → 'max'.
    expect(nearestHandle(50, r(20, 80))).toBe('max');
  });

  it('disambiguates an overlapped pair by side of the press', () => {
    const overlap = r(40, 40);
    expect(nearestHandle(30, overlap)).toBe('min'); // press left of the pair grabs low
    expect(nearestHandle(50, overlap)).toBe('max'); // press right grabs high
    expect(nearestHandle(40, overlap)).toBe('max'); // exactly on the pair: not below min → high
  });
});

describe('pickDragTarget', () => {
  it('grabs a handle from inside the span when within the grab radius', () => {
    // Low at 20; a press at 25 is inside the span but within 10 of low → 'min'.
    expect(pickDragTarget(25, r(20, 80), 10)).toBe('min');
    // High at 80; a press at 74 is inside the span but within 10 of high → 'max'.
    expect(pickDragTarget(74, r(20, 80), 10)).toBe('max');
  });

  it('grabs a handle parked at a bound (no empty track outside)', () => {
    // High parked at max (100): pressing just inside at 95 still grabs it.
    expect(pickDragTarget(95, r(20, 100), 10)).toBe('max');
    // Low parked at min (0): pressing just inside at 5 still grabs it.
    expect(pickDragTarget(5, r(0, 80), 10)).toBe('min');
  });

  it('prefers the nearer handle when both grab zones overlap', () => {
    // Narrow span [40,50], wide radius 10 → both zones cover the press.
    expect(pickDragTarget(42, r(40, 50), 10)).toBe('min'); // nearer low
    expect(pickDragTarget(48, r(40, 50), 10)).toBe('max'); // nearer high
  });

  it("returns 'span' only for a mid-span press outside both grab zones", () => {
    // Press at 50, both handles > 10 away → span drag.
    expect(pickDragTarget(50, r(20, 80), 10)).toBe('span');
  });

  it('returns the nearer handle for a press outside the span', () => {
    expect(pickDragTarget(10, r(20, 80), 5)).toBe('min'); // left of low
    expect(pickDragTarget(90, r(20, 80), 5)).toBe('max'); // right of high
  });

  it('grabs a handle with a zero grab radius when pressed exactly on it', () => {
    // hitValue 0: only a press landing ON the handle is "near" it. Exactly on low
    // grabs 'min', exactly on high grabs 'max', and one unit interior is 'span'.
    // A '<' near-check would fail |atValue-handle| <= 0 on the exact press.
    expect(pickDragTarget(20, r(20, 80), 0)).toBe('min'); // exactly on low
    expect(pickDragTarget(80, r(20, 80), 0)).toBe('max'); // exactly on high
    expect(pickDragTarget(21, r(20, 80), 0)).toBe('span'); // one unit inside → span
  });

  it('treats distance exactly equal to the grab radius as a hit (inclusive)', () => {
    // Distance 5 to low with radius 5: the inclusive <= makes it 'min'. A '<'
    // near-check would push this to 'span' — this case kills that mutation.
    expect(pickDragTarget(25, r(20, 80), 5)).toBe('min');
  });
});

describe('isOutsideSpan', () => {
  it('is true at or beyond either bound', () => {
    expect(isOutsideSpan(20, r(20, 80))).toBe(true); // == min
    expect(isOutsideSpan(80, r(20, 80))).toBe(true); // == max
    expect(isOutsideSpan(10, r(20, 80))).toBe(true); // below min
    expect(isOutsideSpan(90, r(20, 80))).toBe(true); // above max
  });

  it('is false strictly inside the span', () => {
    expect(isOutsideSpan(50, r(20, 80))).toBe(false);
    expect(isOutsideSpan(21, r(20, 80))).toBe(false);
    expect(isOutsideSpan(79, r(20, 80))).toBe(false);
  });
});

describe('handleLeftStyles', () => {
  // Resolve the CSS `left` string (the min/max/clamp/calc grammar the helper emits) to a
  // pixel value against a track of width `W`, so the real geometry invariants are locked,
  // not just the string: the lines never cross, sit INSIDE the fill when wide, and slide
  // OUTSIDE the fill edges when the range is small.
  const balanced = (s: string): boolean => {
    let d = 0;
    for (const ch of s) {
      if (ch === '(') d++;
      else if (ch === ')') {
        d--;
        if (d < 0) return false;
      }
    }
    return d === 0;
  };
  const splitTop = (s: string): string[] => {
    const out: string[] = [];
    let depth = 0;
    let cur = '';
    for (const ch of s) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim() !== '') out.push(cur);
    return out;
  };
  const sum = (s: string, W: number): number => {
    const terms: { sign: number; t: string }[] = [];
    let depth = 0;
    let cur = '';
    let sign = 1;
    for (const ch of s) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (depth === 0 && (ch === '+' || ch === '-') && cur.trim() !== '') {
        terms.push({ sign, t: cur });
        cur = '';
        sign = ch === '+' ? 1 : -1;
      } else {
        cur += ch;
      }
    }
    if (cur.trim() !== '') terms.push({ sign, t: cur });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return terms.reduce((acc, { sign: sg, t }) => acc + sg * term(t, W), 0);
  };
  const resolve = (css: string, W: number): number => {
    const s = css.trim();
    const fn = s.match(/^(min|max|clamp|calc)\(([\s\S]*)\)$/);
    if (fn && balanced(fn[2])) {
      if (fn[1] === 'calc') return sum(fn[2], W);
      const args = splitTop(fn[2]).map((a) => resolve(a, W));
      if (fn[1] === 'min') return Math.min(...args);
      if (fn[1] === 'max') return Math.max(...args);
      return Math.min(Math.max(args[1], args[0]), args[2]); // clamp(min, val, max)
    }
    return sum(s, W);
  };
  const term = (s0: string, W: number): number => {
    const s = s0.trim();
    if (s.startsWith('(') && s.endsWith(')') && balanced(s.slice(1, -1))) return sum(s.slice(1, -1), W);
    const pct = s.match(/^(-?[\d.]+)%$/);
    if (pct) return (parseFloat(pct[1]) / 100) * W;
    const px = s.match(/^(-?[\d.]+)px$/);
    if (px) return parseFloat(px[1]);
    return resolve(s, W); // nested function
  };
  const geom = (low: number, high: number, W: number) => {
    const styles = handleLeftStyles(low, high);
    return {
      lowCenter: resolve(styles.low, W) + 1.5, // + half the 3px line width
      highCenter: resolve(styles.high, W) + 1.5,
      fillLeft: (low / 100) * W,
      fillRight: (high / 100) * W,
    };
  };

  it('resolver self-check: a wide pair resolves to the inside offsets', () => {
    // 20/80 at W=430: gap 258px -> ramp 0 -> low `20% + 6px`, high `80% - 9px`.
    const g = geom(20, 80, 430);
    expect(g.lowCenter).toBeCloseTo(0.2 * 430 + 6 + 1.5, 4); // 93.5
    expect(g.highCenter).toBeCloseTo(0.8 * 430 - 9 + 1.5, 4); // 336.5
  });

  it('never lets the low line cross the high line, across widths and ranges', () => {
    for (const W of [90, 120, 200, 300, 430, 700, 1000]) {
      for (let low = 0; low <= 100; low += 4) {
        for (let high = low; high <= 100; high += 4) {
          const g = geom(low, high, W);
          expect(g.highCenter).toBeGreaterThan(g.lowCenter - 1e-9);
        }
      }
    }
  });

  it('keeps both handles INSIDE the fill when the range is wide', () => {
    const g = geom(20, 80, 430);
    expect(g.lowCenter).toBeGreaterThan(g.fillLeft); // low line inside the left edge
    expect(g.highCenter).toBeLessThan(g.fillRight); // high line inside the right edge
  });

  it('moves both handles OUTSIDE the fill edges when the range is small', () => {
    // 200-240 on a 0..1000 range at W=430 -> 20%/24% (~17px fill).
    const g = geom(20, 24, 430);
    expect(g.lowCenter).toBeLessThan(g.fillLeft); // low line sits left of the fill
    expect(g.highCenter).toBeGreaterThan(g.fillRight); // high line sits right of the fill
  });

  it('frames a collapsed range with symmetric handles ~4.5px outside the point', () => {
    const W = 430;
    const g = geom(50, 50, W);
    const point = 0.5 * W;
    expect(point - g.lowCenter).toBeCloseTo(4.5, 6);
    expect(g.highCenter - point).toBeCloseTo(4.5, 6);
  });
});
