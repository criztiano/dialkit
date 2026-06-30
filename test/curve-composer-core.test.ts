import { describe, it, expect } from 'vitest';
import {
  deriveEase,
  buildSampler,
  buildSamplers,
  readComposition,
  directionPhase,
  triggerLevels,
  triggersCrossed,
  segmentSpan,
  segmentIndexAt,
  boundaries,
  totalWeight,
  redistributeWeight,
  splitSegment,
  removeSegment,
  cycleSegmentType,
  flipSegment,
  setSegmentCurvature,
  setSegmentSteepness,
  setSegmentOvershoot,
  setSegmentAnticipate,
  defaultComposition,
  composerLayout,
  mapY,
  curvePath,
  diagonalLine,
  playheadGeometry,
  COMPOSER_GAP,
  COMPOSER_PAD_FRAC,
  type CurveComposition,
  type CurveSegment,
} from '../src/curve-composer-core';

// A single-segment composition of `type` is the simplest way to sample one curve in
// isolation: its sampler covers the whole 0..1 span.
const oneSeg = (type: CurveSegment['type'], curvature = 0, steepness = 0): CurveComposition => ({
  segments: [{ type, weight: 1, curvature, steepness }],
  driver: null,
  direction: 'forward',
});

// Drive a value sequence through triggersCrossed frame-to-frame, returning the flat list
// of fired indices (NaN-primed like the component's first frame).
function fireSequence(values: number[], steps: number): number[] {
  let prev = Number.NaN;
  const out: number[] = [];
  for (const v of values) {
    if (!Number.isNaN(prev)) out.push(...triggersCrossed(prev, v, steps));
    prev = v;
  }
  return out;
}

// Sample readComposition across `loops` transport loops (u modulo 1, like the rAF
// transport which never reaches exactly 1) and tally trigger fires by level index. Two
// loops by default so a loop-wrap flyback is always included in the window.
function loopFires(comp: CurveComposition, perLoop = 240, loops = 2): Record<number, number> {
  const s = buildSamplers(comp);
  let prev = Number.NaN;
  const counts: Record<number, number> = {};
  for (let i = 0; i < perLoop * loops; i++) {
    const u = (i / perLoop) % 1;
    const v = readComposition(comp, u, s).value;
    if (!Number.isNaN(prev)) for (const idx of triggersCrossed(prev, v, 5)) counts[idx] = (counts[idx] ?? 0) + 1;
    prev = v;
  }
  return counts;
}

describe('triggerLevels', () => {
  it('spreads steps levels evenly from 0 to 1 inclusive', () => {
    expect(triggerLevels(5)).toEqual([0, 0.25, 0.5, 0.75, 1]);
    expect(triggerLevels(2)).toEqual([0, 1]);
    expect(triggerLevels(3)).toEqual([0, 0.5, 1]);
  });

  it('clamps a degenerate step count to at least 2', () => {
    expect(triggerLevels(1)).toEqual([0, 1]);
    expect(triggerLevels(0)).toEqual([0, 1]);
  });
});

describe('triggersCrossed — smooth crossings', () => {
  it('fires an interior level crossed while ascending', () => {
    expect(triggersCrossed(0.2, 0.3, 5)).toEqual([1]); // crossed 0.25
  });

  it('fires several interior levels in one ascending frame, low→high', () => {
    expect(triggersCrossed(0.2, 0.6, 5)).toEqual([1, 2]); // crossed 0.25 then 0.5
  });

  it('fires interior levels while descending, high→low (direction symmetry)', () => {
    expect(triggersCrossed(0.6, 0.2, 5)).toEqual([2, 1]); // crossed 0.5 then 0.25
  });

  it('locks the inclusive-endpoint convention: ascending includes a level it lands on, descending excludes the one it starts on', () => {
    // ascending (p, c]: landing exactly on 0.5 fires it
    expect(triggersCrossed(0.3, 0.5, 5)).toEqual([2]);
    // descending [c, p): starting exactly on 0.5 does NOT re-fire it (already fired on the way up)
    expect(triggersCrossed(0.5, 0.3, 5)).toEqual([]);
  });

  it('fires only the interior level when the first post-flyback frame jumps straight onto it', () => {
    expect(triggersCrossed(0.0, 0.3, 5)).toEqual([1]); // no residual endpoint double-fire
  });

  it('does not fire when the value is flat', () => {
    expect(triggersCrossed(0.5, 0.5, 5)).toEqual([]);
  });

  it('never fires the floor (0) or top (n-1) on a smooth move — those are endpoints', () => {
    // climbing the very top band crosses no interior level
    expect(triggersCrossed(0.8, 1.0, 5)).toEqual([]);
    // leaving the floor likewise
    expect(triggersCrossed(0.0, 0.2, 5)).toEqual([]);
  });
});

describe('triggersCrossed — flyback (segment / loop boundary)', () => {
  it('fires the TOP on a downward flyback (a forward walk that peaked)', () => {
    expect(triggersCrossed(0.99, 0.0, 5)).toEqual([4]);
  });

  it('fires the FLOOR on an upward flyback (a reverse walk that bottomed)', () => {
    expect(triggersCrossed(0.01, 1.0, 5)).toEqual([0]);
  });

  it('does not double-fire right after a flyback', () => {
    // top fires on the reset…
    expect(triggersCrossed(0.99, 0.0, 5)).toEqual([4]);
    // …and the next small step off the floor fires nothing
    expect(triggersCrossed(0.0, 0.05, 5)).toEqual([]);
  });
});

describe('triggersCrossed — robustness', () => {
  it('clamps spring overshoot so values above 1 cannot perturb the top', () => {
    expect(triggersCrossed(0.9, 1.2, 5)).toEqual([]); // 1.2 clamps to 1.0, no interior between
  });

  it('treats a fast-but-smooth steep move as crossings, not a flyback (fine step grid)', () => {
    // steps=12 → seg≈0.0909; a 0.15 jump exceeds one level but is well under the flyback
    // threshold, so it must fire the crossed levels rather than a phantom endpoint.
    const fired = triggersCrossed(0.2, 0.35, 12);
    expect(fired.length).toBeGreaterThan(0);
    expect(fired).not.toContain(0);
    expect(fired).not.toContain(11);
  });
});

describe('triggersCrossed — over a transport loop', () => {
  it('forward easeIn fires interior levels later than a linear curve (curve drives timing)', () => {
    const s = buildSamplers(oneSeg('easeIn'));
    const sLin = buildSamplers(oneSeg('linear'));
    const phaseOf = (samplers: ReturnType<typeof buildSamplers>, comp: CurveComposition) => {
      let prev = Number.NaN;
      const at: Record<number, number> = {};
      for (let i = 0; i <= 1000; i++) {
        const u = i / 1000;
        const v = readComposition(comp, u, samplers).value;
        if (!Number.isNaN(prev)) for (const idx of triggersCrossed(prev, v, 5)) if (!(idx in at)) at[idx] = u;
        prev = v;
      }
      return at;
    };
    const easeIn = phaseOf(s, oneSeg('easeIn'));
    const linear = phaseOf(sLin, oneSeg('linear'));
    // level 1 (value 0.25) is reached much later by easeIn's slow start
    expect(easeIn[1]).toBeGreaterThan(linear[1] + 0.1);
  });

  it('forward: each interior level fires once per segment, the top once per walk', () => {
    const two: CurveComposition = {
      segments: [
        { type: 'easeOut', weight: 1, curvature: 0, steepness: 0 },
        { type: 'easeInOut', weight: 1, curvature: 0, steepness: 0 },
      ],
      driver: null,
      direction: 'forward',
    };
    const counts = loopFires(two);
    expect(counts[1]).toBe(counts[2]); // interior levels each fire once per segment…
    expect(counts[2]).toBe(counts[3]); // …so all three fire equally often
    expect(counts[1]).toBeGreaterThan(0);
    expect(counts[4] ?? 0).toBeGreaterThan(0); // top fires on each walk's flyback
    expect(counts[0] ?? 0).toBe(0); // floor never fires going forward
  });

  it('reverse: interior levels fire equally (descending) and the floor fires on flyback', () => {
    const counts = loopFires({ ...oneSeg('linear'), direction: 'reverse' });
    expect(counts[1]).toBe(counts[2]); // a per-segment double-fire on descent would break equality
    expect(counts[2]).toBe(counts[3]);
    expect(counts[1]).toBeGreaterThan(0);
    expect(counts[0] ?? 0).toBeGreaterThan(0); // reverse walks bottom out → floor fires
    expect(counts[4] ?? 0).toBe(0); // top never fires going in reverse
  });

  it('mirror: interior levels fire on BOTH legs and the smooth peak/trough fires no endpoint', () => {
    const counts = loopFires({ ...oneSeg('linear'), direction: 'mirror' });
    expect(counts[1]).toBe(counts[3]); // symmetric up-leg + down-leg
    expect(counts[1]).toBeGreaterThan(0);
    expect(counts[2]).toBeGreaterThan(0);
    // the turnaround is a smooth peak (value 0→1→0), NOT a flyback → no endpoint must fire
    expect(counts[0] ?? 0).toBe(0);
    expect(counts[4] ?? 0).toBe(0);
  });

  it('spring through the loop: overshoot/settle never phantom-fires; top fires once per walk', () => {
    const counts = loopFires(oneSeg('spring', 1)); // max bounce → overshoots past 1
    expect(counts[1]).toBe(counts[2]); // interior levels fire once per walk, equally
    expect(counts[2]).toBe(counts[3]);
    expect(counts[4]).toBeGreaterThan(0); // top fires on the flyback (clamped overshoot, no extra)
    expect(counts[0] ?? 0).toBe(0);
  });

  it('a non-linear driver re-paces trigger timing (the driver warp is exercised)', () => {
    const firstFire = (comp: CurveComposition): number => {
      const s = buildSamplers(comp);
      let prev = Number.NaN;
      for (let i = 0; i <= 1000; i++) {
        const u = i / 1000;
        const v = readComposition(comp, u, s).value;
        if (!Number.isNaN(prev) && triggersCrossed(prev, v, 5).includes(1)) return u;
        prev = v;
      }
      return Infinity;
    };
    const plain = firstFire(oneSeg('linear'));
    const driven = firstFire({ ...oneSeg('linear'), driver: { type: 'easeIn', curvature: 0, steepness: 0 } });
    // an easeIn driver dwells near 0 early, so level 1 (value 0.25) is reached later
    expect(driven).toBeGreaterThan(plain + 0.1);
  });
});

describe('directionPhase', () => {
  it('forward is identity, reverse mirrors, mirror ping-pongs 0→1→0', () => {
    expect(directionPhase(0.3, 'forward')).toBeCloseTo(0.3);
    expect(directionPhase(0.3, 'reverse')).toBeCloseTo(0.7);
    expect(directionPhase(0, 'mirror')).toBeCloseTo(0);
    expect(directionPhase(0.5, 'mirror')).toBeCloseTo(1);
    expect(directionPhase(1, 'mirror')).toBeCloseTo(0);
  });
});

describe('deriveEase', () => {
  it('always keeps the implied endpoints (y from 0 to 1) and clamps x into [0,1]', () => {
    const e = deriveEase('easeInOut', 0.9, 0.8);
    expect(e[1]).toBe(0);
    expect(e[3]).toBe(1);
    expect(e[0]).toBeGreaterThanOrEqual(0);
    expect(e[0]).toBeLessThanOrEqual(1);
    expect(e[2]).toBeGreaterThanOrEqual(0);
    expect(e[2]).toBeLessThanOrEqual(1);
  });

  it('steepness slows both ends of easeInOut (x1 up, x2 down)', () => {
    const flat = deriveEase('easeInOut', 0, 0);
    const steep = deriveEase('easeInOut', 0, 1);
    expect(steep[0]).toBeGreaterThan(flat[0]);
    expect(steep[2]).toBeLessThan(flat[2]);
  });

  it('leaves linear linear regardless of steepness (no deviation to scale)', () => {
    expect(deriveEase('linear', 0, 0)).toEqual([0, 0, 1, 1]);
    expect(deriveEase('linear', 0, 1)).toEqual([0, 0, 1, 1]);
  });

  it('energy bias shifts both x control points in tandem', () => {
    const base = deriveEase('easeInOut', 0, 0);
    const biased = deriveEase('easeInOut', 0.5, 0);
    expect(biased[0]).toBeGreaterThan(base[0]);
    expect(biased[2]).toBeGreaterThan(base[2]);
  });
});

describe('full easing coverage (steepness → expo, overshoot → back)', () => {
  const TS = Array.from({ length: 101 }, (_, i) => i / 100);
  const maxErr = (f: (t: number) => number, g: (t: number) => number) =>
    Math.max(...TS.map((t) => Math.abs(f(t) - g(t))));
  const easeIn = (c: number, s: number, o = 0) =>
    buildSampler({ type: 'easeIn', weight: 1, curvature: c, steepness: s, overshoot: o });

  it('steepness at max reaches expo (which the pinned-y model could not)', () => {
    const expo = (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10));
    expect(maxErr(easeIn(0, 1), expo)).toBeLessThan(0.03); // ~1% in practice
  });

  it('circ is reachable mid-steepness with a touch of energy', () => {
    const circ = (t: number) => 1 - Math.sqrt(1 - t * t);
    let best = 1;
    for (let s = 0; s <= 1.0001; s += 0.05)
      for (let e = -0.5; e <= 0.5001; e += 0.1) best = Math.min(best, maxErr(easeIn(e, s), circ));
    expect(best).toBeLessThan(0.03);
  });

  it('overshoot pushes the END above 1 (easeOutBack); the start stays put', () => {
    const f = buildSampler({ type: 'easeOut', weight: 1, curvature: 0, steepness: 0, overshoot: 1 });
    expect(Math.max(...TS.map(f))).toBeGreaterThan(1.1);
    expect(Math.min(...TS.map(f))).toBeGreaterThanOrEqual(-0.0001); // no dip
    expect(f(1)).toBeCloseTo(1, 5); // still settles exactly at 1
  });

  it('anticipate dips the START below 0 (easeInBack); the end stays put', () => {
    const f = buildSampler({ type: 'easeIn', weight: 1, curvature: 0, steepness: 0, anticipate: 1 });
    expect(Math.min(...TS.map(f))).toBeLessThan(-0.1);
    expect(Math.max(...TS.map(f))).toBeLessThanOrEqual(1.0001); // no overshoot
    expect(f(0)).toBeCloseTo(0, 5);
  });

  it('overshoot and anticipate combine independently (easeInOutBack: dip then overshoot)', () => {
    const f = buildSampler({ type: 'easeInOut', weight: 1, curvature: 0, steepness: 0, overshoot: 1, anticipate: 1 });
    expect(Math.min(...TS.map(f))).toBeLessThan(-0.05); // anticipation dip at the start
    expect(Math.max(...TS.map(f))).toBeGreaterThan(1.05); // overshoot at the end
    expect(f(0)).toBeCloseTo(0, 5);
    expect(f(1)).toBeCloseTo(1, 5);
  });

  it('both absent behave as 0 (stays within the band)', () => {
    const f = buildSampler({ type: 'easeOut', weight: 1, curvature: 0, steepness: 0 });
    expect(Math.max(...TS.map(f))).toBeLessThanOrEqual(1.0001);
    expect(Math.min(...TS.map(f))).toBeGreaterThanOrEqual(-0.0001);
  });

  it('overshoot/anticipate setters clamp to [0, 1]; cycle resets both', () => {
    let comp = defaultComposition();
    expect(setSegmentOvershoot(comp, 0, 5).segments[0].overshoot).toBe(1);
    expect(setSegmentOvershoot(comp, 0, -3).segments[0].overshoot).toBe(0);
    expect(setSegmentAnticipate(comp, 0, 5).segments[0].anticipate).toBe(1);
    comp = setSegmentOvershoot(setSegmentAnticipate(comp, 0, 0.6), 0, 0.6);
    const cycled = cycleSegmentType(comp, 0).segments[0];
    expect(cycled.overshoot).toBe(0);
    expect(cycled.anticipate).toBe(0);
  });
});

describe('buildSampler', () => {
  it('bezier eases pin the endpoints to 0 and 1', () => {
    for (const type of ['linear', 'easeIn', 'easeOut', 'easeInOut'] as const) {
      const f = buildSampler({ type, weight: 1, curvature: 0, steepness: 0 });
      expect(f(0)).toBeCloseTo(0, 5);
      expect(f(1)).toBeCloseTo(1, 5);
    }
  });

  it('easeIn starts slower than linear; easeOut starts faster', () => {
    const lin = buildSampler({ type: 'linear', weight: 1, curvature: 0, steepness: 0 });
    const easeIn = buildSampler({ type: 'easeIn', weight: 1, curvature: 0, steepness: 0 });
    const easeOut = buildSampler({ type: 'easeOut', weight: 1, curvature: 0, steepness: 0 });
    expect(easeIn(0.2)).toBeLessThan(lin(0.2));
    expect(easeOut(0.2)).toBeGreaterThan(lin(0.2));
  });

  it('spring overshoots above 1 and settles back near 1', () => {
    const spring = buildSampler({ type: 'spring', weight: 1, curvature: 1, steepness: 0 });
    let peak = 0;
    for (let i = 0; i <= 50; i++) peak = Math.max(peak, spring(i / 50));
    expect(peak).toBeGreaterThan(1); // visible bounce
    expect(spring(1)).toBeGreaterThan(0.85); // settled back near 1
    expect(spring(1)).toBeLessThan(1.15);
  });
});

describe('readComposition', () => {
  it('each segment drives its own 0→1 walk (value resets at the divider)', () => {
    const two: CurveComposition = {
      segments: [
        { type: 'linear', weight: 1, curvature: 0, steepness: 0 },
        { type: 'linear', weight: 1, curvature: 0, steepness: 0 },
      ],
      driver: null,
      direction: 'forward',
    };
    const s = buildSamplers(two);
    expect(readComposition(two, 0.25, s).value).toBeCloseTo(0.5, 5); // mid of segment 1
    expect(readComposition(two, 0.49, s).value).toBeCloseTo(0.98, 2); // near top of segment 1
    expect(readComposition(two, 0.51, s).value).toBeCloseTo(0.02, 2); // reset, start of segment 2
    expect(readComposition(two, 0.75, s).value).toBeCloseTo(0.5, 5); // mid of segment 2
  });

  it('reverse reads the mirror phase', () => {
    const comp = oneSeg('linear');
    const s = buildSamplers(comp);
    expect(readComposition({ ...comp, direction: 'reverse' }, 0.25, s).value).toBeCloseTo(0.75, 5);
  });
});

describe('segment geometry', () => {
  const segs = (...w: number[]): CurveSegment[] =>
    w.map((weight) => ({ type: 'linear', weight, curvature: 0, steepness: 0 }));

  it('totalWeight sums positive weights and never returns 0', () => {
    expect(totalWeight(segs(1, 3))).toBe(4);
    expect(totalWeight(segs(0))).toBe(1); // guarded against divide-by-zero
  });

  it('segmentSpan and boundaries are normalized by the total', () => {
    const s = segs(1, 3); // total 4 → boundary at 0.25
    expect(segmentSpan(s, 0)).toEqual([0, 0.25]);
    expect(segmentSpan(s, 1)).toEqual([0.25, 1]);
    expect(boundaries(s)).toEqual([0.25]);
  });

  it('segmentIndexAt maps an x to its slice', () => {
    const s = segs(1, 1, 2); // boundaries at 0.25, 0.5
    expect(segmentIndexAt(0.1, s)).toBe(0);
    expect(segmentIndexAt(0.4, s)).toBe(1);
    expect(segmentIndexAt(0.9, s)).toBe(2);
  });
});

describe('state transitions', () => {
  it('splitSegment adds one segment and re-divides all weights evenly', () => {
    const comp = defaultComposition(); // 2 segments
    const split = splitSegment(comp, 0);
    expect(split.segments).toHaveLength(3);
    const weights = split.segments.map((s) => s.weight);
    expect(new Set(weights).size).toBe(1); // all equal
  });

  it('cycleSegmentType advances the type and resets energy + steepness to canonical', () => {
    let comp = defaultComposition();
    comp = setSegmentCurvature(comp, 0, 0.8);
    comp = setSegmentSteepness(comp, 0, -0.6);
    const before = comp.segments[0].type;
    const after = cycleSegmentType(comp, 0).segments[0];
    expect(after.type).not.toBe(before);
    expect(after.curvature).toBe(0);
    expect(after.steepness).toBe(0);
  });

  it('flipSegment mirrors the curve (easeIn↔easeOut, energy negates, overshoot↔anticipate swap)', () => {
    const comp: CurveComposition = {
      segments: [{ type: 'easeIn', weight: 1, curvature: 0.4, steepness: 0.3, overshoot: 0.5, anticipate: 0 }],
      driver: null,
      direction: 'forward',
    };
    const f = flipSegment(comp, 0).segments[0];
    expect(f.type).toBe('easeOut');
    expect(f.curvature).toBe(-0.4);
    expect(f.steepness).toBe(0.3); // intensity preserved
    expect(f.overshoot).toBe(0); // was anticipate (0)
    expect(f.anticipate).toBe(0.5); // was overshoot
    // and the sampled curve is the left↔right mirror: flipped(t) ≈ 1 - original(1-t)
    const orig = buildSampler(comp.segments[0]);
    const flipped = buildSampler(f);
    for (const t of [0.2, 0.5, 0.8]) expect(flipped(t)).toBeCloseTo(1 - orig(1 - t), 5);
  });

  it('flipping twice returns to the original shape', () => {
    const comp: CurveComposition = {
      segments: [{ type: 'easeIn', weight: 1, curvature: 0.6, steepness: -0.2, overshoot: 0.3, anticipate: 0.1 }],
      driver: null,
      direction: 'forward',
    };
    const twice = flipSegment(flipSegment(comp, 0), 0).segments[0];
    expect(twice.type).toBe('easeIn');
    expect(twice.curvature).toBeCloseTo(0.6, 5);
    expect(twice.overshoot).toBe(0.3);
    expect(twice.anticipate).toBe(0.1);
  });

  it('removeSegment is a no-op on the last remaining segment', () => {
    const single: CurveComposition = oneSeg('linear');
    expect(removeSegment(single, 0).segments).toHaveLength(1);
  });

  it('setSegmentCurvature / setSegmentSteepness clamp to [-1, 1]', () => {
    const comp = defaultComposition();
    expect(setSegmentCurvature(comp, 0, 5).segments[0].curvature).toBe(1);
    expect(setSegmentSteepness(comp, 0, -5).segments[0].steepness).toBe(-1);
  });
});

describe('geometry / layout', () => {
  it('composerLayout: main lane only when there is no driver', () => {
    const l = composerLayout(260, 150, false);
    expect(l.W).toBe(260);
    expect(l.totalH).toBe(150);
    expect(l.mainRect).toEqual({ x: 0, y: 0, w: 260, h: 150 });
    expect(l.driverRect).toBeNull();
  });

  it('composerLayout: driver lane stacks below the main lane with the gap', () => {
    const l = composerLayout(260, 150, true);
    const driverH = Math.round(150 * 0.55);
    expect(l.driverRect).toEqual({ x: 0, y: 150 + COMPOSER_GAP, w: 260, h: driverH });
    expect(l.totalH).toBe(150 + COMPOSER_GAP + driverH);
  });

  it('mapY maps 0→bottom and 1→top of the padded band', () => {
    const rect = { x: 0, y: 0, w: 100, h: 100 };
    const pad = 100 * COMPOSER_PAD_FRAC;
    expect(mapY(rect, 0)).toBeCloseTo(100 - pad); // value 0 sits at the bottom inset
    expect(mapY(rect, 1)).toBeCloseTo(pad); // value 1 at the top inset
    expect(mapY(rect, 0.5)).toBeCloseTo(50); // mid is the lane centre
  });

  it('curvePath: a bezier ease is one cubic segment with endpoints at the band corners', () => {
    const rect = { x: 0, y: 0, w: 100, h: 100 };
    const d = curvePath({ type: 'easeInOut', weight: 1, curvature: 0, steepness: 0 }, rect, [0, 1], 100);
    expect(d.startsWith('M ')).toBe(true);
    expect(d).toContain(' C '); // cubic
    expect((d.match(/C/g) ?? []).length).toBe(1);
  });

  it('curvePath: a spring is a multi-point polyline (overshoot a bezier cannot express)', () => {
    const rect = { x: 0, y: 0, w: 100, h: 100 };
    const d = curvePath({ type: 'spring', weight: 1, curvature: 1, steepness: 0 }, rect, [0, 1], 100, 40);
    expect(d).not.toContain(' C ');
    expect((d.match(/L/g) ?? []).length).toBe(40); // `samples` line segments after the move
  });

  it('curvePath: the span scales the x range (a half-width segment ends at half W)', () => {
    const rect = { x: 0, y: 0, w: 100, h: 100 };
    const d = curvePath({ type: 'linear', weight: 1, curvature: 0, steepness: 0 }, rect, [0, 0.5], 100);
    // last command's x should be span[1]*W = 50
    const lastX = Number(d.trim().split(/[\s,]+/).slice(-2)[0]);
    expect(lastX).toBeCloseTo(50);
  });

  it('diagonalLine spans the segment corner-to-corner', () => {
    const rect = { x: 0, y: 0, w: 100, h: 100 };
    const diag = diagonalLine(rect, [0.25, 0.75], 100);
    expect(diag.x1).toBe(25);
    expect(diag.x2).toBe(75);
    expect(diag.y1).toBeCloseTo(mapY(rect, 0));
    expect(diag.y2).toBeCloseTo(mapY(rect, 1));
  });

  it('playheadGeometry derives the series/dot/driver positions from a read', () => {
    const comp = defaultComposition();
    const layout = composerLayout(200, 100, false);
    const s = buildSamplers(comp);
    const read = readComposition(comp, 0.25, s);
    const g = playheadGeometry(read, layout);
    expect(g.seriesX).toBeCloseTo(read.warpedPhase * 200);
    expect(g.dotX).toBe(g.seriesX);
    expect(g.dotY).toBeCloseTo(mapY(layout.mainRect, read.value));
    expect(g.driverX).toBeCloseTo(read.inputPhase * 200);
  });
});

describe('redistributeWeight', () => {
  it('trades width across a boundary while conserving the pair total', () => {
    const comp: CurveComposition = {
      segments: [
        { type: 'linear', weight: 1, curvature: 0, steepness: 0 },
        { type: 'linear', weight: 1, curvature: 0, steepness: 0 },
      ],
      driver: null,
      direction: 'forward',
    };
    const next = redistributeWeight(comp, 0, 0.2); // push 0.2 of the whole into segment 0
    expect(next.segments[0].weight + next.segments[1].weight).toBeCloseTo(2, 5);
    expect(next.segments[0].weight).toBeGreaterThan(1);
  });

  it('clamps so neither side shrinks below the minimum slice', () => {
    const comp: CurveComposition = {
      segments: [
        { type: 'linear', weight: 1, curvature: 0, steepness: 0 },
        { type: 'linear', weight: 1, curvature: 0, steepness: 0 },
      ],
      driver: null,
      direction: 'forward',
    };
    const next = redistributeWeight(comp, 0, 5); // absurd push
    expect(next.segments[1].weight).toBeGreaterThan(0); // segment 1 not annihilated
  });
});
