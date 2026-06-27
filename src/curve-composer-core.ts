// Framework-agnostic logic for the Curve Composer — the SVG counterpart of
// `waveform-engine.ts`. It owns no DOM: just the data model, the curve math
// (cubic-bezier + spring sampling, lifted from EasingVisualization /
// SpringVisualization), hit-testing, and pure state transitions. Each framework
// wrapper renders the SVG and wires pointer events, calling into these helpers so
// the composition logic is written once.

/** The curve vocabulary a segment cycles through on quick-click. */
export type CurveType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';

/** Cycle order for quick-click (loops back to the start). */
export const CURVE_CYCLE: CurveType[] = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'spring'];

/** Cubic-bezier control points (P0=(0,0), P3=(1,1) implied) for each easing preset. */
export const easingPresets: Record<Exclude<CurveType, 'spring'>, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

/** One curve in the series. `weight` is a relative duration share (normalized by the sum). */
export interface CurveSegment {
  type: CurveType;
  weight: number;
  /**
   * Bipolar -1..1 "energy" bias. 0 = the type's canonical shape; bezier types skew
   * both x control points (−1 = energy to the onset, +1 = energy to the fall);
   * spring maps it to bounce (−1 = none → +1 = max).
   */
  curvature: number;
}

/** The stacked driver curve (a single curve, no internal splits). */
export interface CurveDriver {
  type: CurveType;
  /** Bipolar -1..1 energy bias — see CurveSegment.curvature. */
  curvature: number;
}

export type DriverDirection = 'forward' | 'mirror' | 'reverse';

export interface CurveComposition {
  segments: CurveSegment[];
  /** null → no driver lane (the component renders a single lane). */
  driver: CurveDriver | null;
  direction: DriverDirection;
}

// --- interaction constants (shared with the wrappers, mirroring the waveform) ---

/** Pointer travel (CSS px) past which a press becomes a drag rather than a click. */
export const DRAG_THRESHOLD = 3;
/** How close (CSS px) a press must be to a boundary to grab it for resizing. */
export const EDGE_HIT = 6;
/** Smallest normalized slice a segment may shrink to under a boundary drag. */
export const CURVE_MIN_WEIGHT_FRAC = 0.06;

// --- curve math ---

/** A pure `(t) -> value` sampler over local time, both in 0..1 (value may overshoot for springs). */
export type Sampler = (t: number) => number;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const clampBipolar = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);

/** How far (in x) a full ±1 bias shifts the control points. */
const SKEW_MAX = 0.45;

/**
 * Derive the bezier control points for a type at a given energy bias.
 * Every preset shares y=(0,1) and differs only in its x control points, so "moving
 * energy" is a tandem shift of both x's: bias>0 pushes the bend toward the fall
 * (slow start, late rush), bias<0 toward the onset (early rush, slow finish).
 */
export function deriveEase(type: CurveType, curvature: number): [number, number, number, number] {
  const base = type === 'spring' ? easingPresets.linear : easingPresets[type];
  const shift = clampBipolar(curvature) * SKEW_MAX;
  return [clamp01(base[0] + shift), base[1], clamp01(base[2] + shift), base[3]];
}

// Solve the cubic-bezier for `y` given `x`, with P0=(0,0), P3=(1,1).
function bezierAxis(p1: number, p2: number, s: number): number {
  const u = 1 - s;
  return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s;
}
function bezierAxisDeriv(p1: number, p2: number, s: number): number {
  const u = 1 - s;
  return 3 * u * u * p1 + 6 * u * s * (p2 - p1) + 3 * s * s * (1 - p2);
}
function bezierY(ease: [number, number, number, number], x: number): number {
  const tx = clamp01(x);
  let s = tx;
  for (let i = 0; i < 6; i++) {
    const xs = bezierAxis(ease[0], ease[2], s) - tx;
    if (Math.abs(xs) < 1e-5) break;
    const d = bezierAxisDeriv(ease[0], ease[2], s);
    if (Math.abs(d) < 1e-6) break;
    s = clamp01(s - xs / d);
  }
  return bezierAxis(ease[1], ease[3], s);
}

// Spring physics integrator (lifted from SpringVisualization). The raw position is
// kept (settles at 1, overshoots above it) so the bounce stays visible — a spring is
// only recognizable by its overshoot. Curvature maps to a tasteful bounce range.
const SPRING_SAMPLES = 72;
function springPoints(curvature: number): number[] {
  const visualDuration = 1;
  // Bipolar bias → bounce: −1 = none, 0 = moderate, +1 = max.
  const bounce = clamp01((clampBipolar(curvature) + 1) / 2) * 0.6;
  const mass = 1;
  let stiffness = (2 * Math.PI) / visualDuration;
  stiffness = stiffness * stiffness;
  const dampingRatio = 1 - bounce;
  const damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);

  const raw: number[] = [];
  const steps = SPRING_SAMPLES;
  const dt = visualDuration / steps;
  let position = 0;
  let velocity = 0;
  for (let i = 0; i <= steps; i++) {
    raw.push(position);
    const acceleration = (-stiffness * (position - 1) - damping * velocity) / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
  }
  return raw;
}

function interp(points: number[], t: number): number {
  const x = clamp01(t) * (points.length - 1);
  const i = Math.floor(x);
  if (i >= points.length - 1) return points[points.length - 1];
  return lerp(points[i], points[i + 1], x - i);
}

/** Build a reusable sampler for a segment/driver (precomputes spring points once). */
export function buildSampler(curve: CurveSegment | CurveDriver): Sampler {
  if (curve.type === 'spring') {
    const pts = springPoints(curve.curvature);
    return (t) => interp(pts, t);
  }
  const ease = deriveEase(curve.type, curve.curvature);
  return (t) => bezierY(ease, t);
}

// --- geometry / layout ---

/** Interior cumulative split positions (0..1), excluding the 0 and 1 ends. */
export function boundaries(segments: CurveSegment[]): number[] {
  const total = totalWeight(segments);
  const out: number[] = [];
  let acc = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    acc += segments[i].weight;
    out.push(acc / total);
  }
  return out;
}

export function totalWeight(segments: CurveSegment[]): number {
  let t = 0;
  for (const s of segments) t += Math.max(0, s.weight);
  return t || 1;
}

/** [start, end] of a segment's horizontal slice in 0..1. */
export function segmentSpan(segments: CurveSegment[], index: number): [number, number] {
  const total = totalWeight(segments);
  let acc = 0;
  for (let i = 0; i < index; i++) acc += segments[i].weight;
  return [acc / total, (acc + segments[index].weight) / total];
}

/** Which segment slice an x (0..1) falls in. */
export function segmentIndexAt(xNorm: number, segments: CurveSegment[]): number {
  const total = totalWeight(segments);
  const x = clamp01(xNorm) * total;
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].weight;
    if (x <= acc) return i;
  }
  return segments.length - 1;
}

/** Nearest interior boundary within `edgeHitNorm` of x, or null. Returns the boundary index (between i and i+1). */
export function boundaryAt(xNorm: number, segments: CurveSegment[], edgeHitNorm: number): number | null {
  if (segments.length < 2) return null;
  const bs = boundaries(segments);
  let best: number | null = null;
  let bestDist = edgeHitNorm;
  for (let i = 0; i < bs.length; i++) {
    const d = Math.abs(xNorm - bs[i]);
    if (d <= bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

// --- pure state transitions ---

function cloneSegments(comp: CurveComposition, segments: CurveSegment[]): CurveComposition {
  return { ...comp, segments };
}

/**
 * Insert a copy of the segment at `index` after it, then re-divide ALL segments to
 * equal duration — split always yields evenly-spaced clips.
 */
export function splitSegment(comp: CurveComposition, index: number): CurveComposition {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next.splice(index + 1, 0, { ...src });
  return cloneSegments(comp, next.map((s) => ({ ...s, weight: 1 })));
}

/** Remove the segment at `index` (no-op when it's the only one). */
export function removeSegment(comp: CurveComposition, index: number): CurveComposition {
  if (comp.segments.length <= 1) return comp;
  return cloneSegments(comp, comp.segments.filter((_, i) => i !== index));
}

export function cycleSegmentType(comp: CurveComposition, index: number): CurveComposition {
  const src = comp.segments[index];
  if (!src) return comp;
  const type = CURVE_CYCLE[(CURVE_CYCLE.indexOf(src.type) + 1) % CURVE_CYCLE.length];
  const next = comp.segments.slice();
  // Cycling picks a fresh curve, so drop the applied energy bias — show the canonical shape.
  next[index] = { ...src, type, curvature: 0 };
  return cloneSegments(comp, next);
}

export function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, curvature: clampBipolar(curvature) };
  return cloneSegments(comp, next);
}

/**
 * Move `deltaFrac` (0..1 of the whole series) across the boundary between segment
 * `boundaryIndex` and the next, keeping the rest untouched and the pair's combined
 * width constant. Each side is clamped to `CURVE_MIN_WEIGHT_FRAC`.
 */
export function redistributeWeight(comp: CurveComposition, boundaryIndex: number, deltaFrac: number): CurveComposition {
  const segs = comp.segments;
  const i = boundaryIndex;
  if (i < 0 || i >= segs.length - 1) return comp;
  const total = totalWeight(segs);
  const span = segs[i].weight + segs[i + 1].weight;
  const minW = CURVE_MIN_WEIGHT_FRAC * total;
  let wi = segs[i].weight + deltaFrac * total;
  wi = Math.max(minW, Math.min(span - minW, wi));
  const next = segs.slice();
  next[i] = { ...segs[i], weight: wi };
  next[i + 1] = { ...segs[i + 1], weight: span - wi };
  return cloneSegments(comp, next);
}

export function addDriver(comp: CurveComposition): CurveComposition {
  if (comp.driver) return comp;
  return { ...comp, driver: { type: 'easeInOut', curvature: 0 } };
}

export function removeDriver(comp: CurveComposition): CurveComposition {
  return { ...comp, driver: null };
}

export function cycleDriverType(comp: CurveComposition): CurveComposition {
  if (!comp.driver) return comp;
  const type = CURVE_CYCLE[(CURVE_CYCLE.indexOf(comp.driver.type) + 1) % CURVE_CYCLE.length];
  // Reset the energy bias on cycle so the new curve shows in its canonical form.
  return { ...comp, driver: { ...comp.driver, type, curvature: 0 } };
}

export function setDriverCurvature(comp: CurveComposition, curvature: number): CurveComposition {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, curvature: clampBipolar(curvature) } };
}

// --- read pipeline (drives the demo transport + the playhead) ---

export interface CompositionSamplers {
  segments: Sampler[];
  driver: Sampler | null;
}

export function buildSamplers(comp: CurveComposition): CompositionSamplers {
  return {
    segments: comp.segments.map(buildSampler),
    driver: comp.driver ? buildSampler(comp.driver) : null,
  };
}

/** Apply playback direction to the raw loop phase u (0..1). */
export function directionPhase(u: number, dir: DriverDirection): number {
  const x = clamp01(u);
  if (dir === 'reverse') return 1 - x;
  if (dir === 'mirror') return 1 - Math.abs(1 - 2 * x); // ping-pong 0→1→0
  return x;
}

export interface CompositionRead {
  /** Read position after direction, before the driver warps it (0..1) — the driver lane marker. */
  inputPhase: number;
  /** Read position after the driver warps it (0..1) — the series lane playhead (sweeps once). */
  warpedPhase: number;
  /**
   * Composed output, 0..1 — the ACTIVE segment's own full min→max walk, shaped by that
   * segment's curve. It resets and climbs again at each divider, so N segments make the
   * output walk min→max N times across one sweep (the segments are not summed into one path).
   */
  value: number;
  segIndex: number;
  localT: number;
}

/**
 * Read the composition at raw loop phase `u`. direction reverses/ping-pongs the
 * traversal of the whole composition; the driver then warps the reading pace. The
 * playhead sweeps left→right once, while `value` is each segment's own full 0→1 walk.
 */
export function readComposition(comp: CurveComposition, u: number, s: CompositionSamplers): CompositionRead {
  const inputPhase = directionPhase(u, comp.direction);
  const warpedPhase = s.driver ? clamp01(s.driver(inputPhase)) : inputPhase;
  const segIndex = segmentIndexAt(warpedPhase, comp.segments);
  const [a, b] = segmentSpan(comp.segments, segIndex);
  const localT = b > a ? (warpedPhase - a) / (b - a) : 0;
  const value = s.segments[segIndex] ? s.segments[segIndex](localT) : 0;
  return { inputPhase, warpedPhase, value, segIndex, localT };
}

// --- trigger series (an alternative, discrete read of the transport) ---

/** Default trigger count for a trigger series. */
export const DEFAULT_TRIGGER_STEPS = 5;

/**
 * The distinct firing phases of a `steps`-trigger series. The first trigger sits at 0
 * and the conceptual last at 1, but on a loop 0 and 1 are the same instant, so they
 * fold into a single boundary trigger. A `steps`-series therefore has `steps - 1`
 * firing phases in [0, 1), spaced 1/(steps - 1) apart — e.g. steps=5 → [0, .25, .5, .75],
 * with the .75→0 wrap closing the loop. This fold is what prevents a double fire at the edge.
 */
export function triggerPhases(steps: number): number[] {
  const n = Math.max(2, Math.floor(steps));
  const out: number[] = [];
  for (let k = 0; k < n - 1; k++) out.push(k / (n - 1));
  return out;
}

/**
 * Indices (into `triggerPhases`) crossed as the loop phase advances `prev` → `cur`,
 * exclusive of `prev` and inclusive of `cur`. Handles the 0→1 wrap (so the boundary
 * trigger fires once per loop, not twice) and a frame that skips several triggers at once.
 * `cur`/`prev` are raw transport phases in 0..1; detection ignores the driver/direction
 * warp so the grid stays evenly timed.
 */
export function triggersCrossed(prev: number, cur: number, steps: number): number[] {
  const n = Math.max(2, Math.floor(steps));
  const distinct = n - 1; // firing phases at k/(n-1) for k = 0..n-2; k = n-1 folds onto 0
  const seg = 1 / distinct;
  const p = clamp01(prev);
  let c = clamp01(cur);
  if (c < p) c += 1; // unwrap a loop-boundary crossing into a monotonic interval
  const EPS = 1e-9;
  const startK = Math.floor(p / seg + EPS) + 1; // first trigger strictly past `prev`
  const endK = Math.floor(c / seg + EPS); // last trigger at or before `cur`
  const fired: number[] = [];
  for (let k = startK; k <= endK; k++) fired.push(((k % distinct) + distinct) % distinct);
  return fired;
}

/** A reasonable starting composition for demos / uncontrolled mounts. */
export function defaultComposition(): CurveComposition {
  return {
    segments: [
      { type: 'easeOut', weight: 1, curvature: 0 },
      { type: 'easeInOut', weight: 1, curvature: 0 },
    ],
    driver: null,
    direction: 'forward',
  };
}
