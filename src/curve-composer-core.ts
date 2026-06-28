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
  /**
   * Bipolar -1..1 steepness — how pronounced the ease is, independent of the energy bias.
   * Scales each control point's deviation from the linear diagonal: 0 = canonical preset,
   * +1 = sharper (e.g. easeInOut gets much slower start/end), −1 = flatter toward linear.
   * Spring maps it to stiffness (snappier rise).
   */
  steepness: number;
}

/** The stacked driver curve (a single curve, no internal splits). */
export interface CurveDriver {
  type: CurveType;
  /** Bipolar -1..1 energy bias — see CurveSegment.curvature. */
  curvature: number;
  /** Bipolar -1..1 steepness — see CurveSegment.steepness. */
  steepness: number;
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

/** Multiplier on a preset's deviation from linear at full ±1 steepness. */
function steepnessGain(steepness: number): number {
  const v = clampBipolar(steepness);
  // +1 → 2.3× deviation (sharper, slower ends); 0 → preset; −1 → 0× (linear/flat).
  return v >= 0 ? 1 + v * 1.3 : 1 + v;
}

/**
 * Derive the bezier control points for a type at a given energy bias + steepness.
 * Every preset shares y=(0,1) and differs only in its x control points. Steepness scales
 * each x's deviation from the linear diagonal (x1 from 0, x2 from 1) — intensifying or
 * relaxing the ease while keeping its character. Energy then shifts both x's in tandem:
 * bias>0 pushes the bend toward the fall (slow start, late rush), bias<0 toward the onset.
 */
export function deriveEase(
  type: CurveType,
  curvature: number,
  steepness = 0
): [number, number, number, number] {
  const base = type === 'spring' ? easingPresets.linear : easingPresets[type];
  const k = steepnessGain(steepness);
  const x1 = base[0] * k; // linear x1 is 0, so the deviation is base[0]
  const x2 = 1 + (base[2] - 1) * k; // linear x2 is 1
  const shift = clampBipolar(curvature) * SKEW_MAX;
  return [clamp01(x1 + shift), base[1], clamp01(x2 + shift), base[3]];
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
function springPoints(curvature: number, steepness = 0): number[] {
  const visualDuration = 1;
  // Bipolar bias → bounce: −1 = none, 0 = moderate, +1 = max.
  const bounce = clamp01((clampBipolar(curvature) + 1) / 2) * 0.6;
  const mass = 1;
  let stiffness = (2 * Math.PI) / visualDuration;
  stiffness = stiffness * stiffness;
  // Steepness scales stiffness → a snappier (steeper) rise; clamped to stay stable.
  stiffness *= Math.max(0.2, 1 + clampBipolar(steepness) * 0.9);
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
    const pts = springPoints(curve.curvature, curve.steepness);
    return (t) => interp(pts, t);
  }
  const ease = deriveEase(curve.type, curve.curvature, curve.steepness);
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
  // Cycling picks a fresh curve, so drop the applied energy + steepness — show the canonical shape.
  next[index] = { ...src, type, curvature: 0, steepness: 0 };
  return cloneSegments(comp, next);
}

export function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, curvature: clampBipolar(curvature) };
  return cloneSegments(comp, next);
}

export function setSegmentSteepness(comp: CurveComposition, index: number, steepness: number): CurveComposition {
  const src = comp.segments[index];
  if (!src) return comp;
  const next = comp.segments.slice();
  next[index] = { ...src, steepness: clampBipolar(steepness) };
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
  return { ...comp, driver: { type: 'easeInOut', curvature: 0, steepness: 0 } };
}

export function removeDriver(comp: CurveComposition): CurveComposition {
  return { ...comp, driver: null };
}

export function cycleDriverType(comp: CurveComposition): CurveComposition {
  if (!comp.driver) return comp;
  const type = CURVE_CYCLE[(CURVE_CYCLE.indexOf(comp.driver.type) + 1) % CURVE_CYCLE.length];
  // Reset the energy + steepness on cycle so the new curve shows in its canonical form.
  return { ...comp, driver: { ...comp.driver, type, curvature: 0, steepness: 0 } };
}

export function setDriverCurvature(comp: CurveComposition, curvature: number): CurveComposition {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, curvature: clampBipolar(curvature) } };
}

export function setDriverSteepness(comp: CurveComposition, steepness: number): CurveComposition {
  if (!comp.driver) return comp;
  return { ...comp, driver: { ...comp.driver, steepness: clampBipolar(steepness) } };
}

// --- pointer interaction (shared by every framework wrapper) ---
//
// The wrappers own only event binding, pointer capture, the in-progress drag state, and
// the SVG/DOM writes. The hit-testing and the drag→state math live here so all four ports
// behave identically. A full ±1 energy / steepness sweep spans this fraction of the lane.
export const DRAG_ENERGY_GAIN = 0.6;
export const DRAG_STEEP_GAIN = 0.6;

/** The minimal rectangle a wrapper reads from `getBoundingClientRect()`. */
export interface ClientRectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Which lane regions exist, for hit-testing in viewBox (`py`) units. */
export interface ComposerHitLayout {
  /** Total composite height (the viewBox height). */
  totalH: number;
  /** y where the driver lane begins, or null when there is no driver lane. */
  driverY: number | null;
}

/** A resolved press target inside the composer. */
export type PointerTarget =
  | { kind: 'driver' }
  | { kind: 'boundary'; index: number }
  | { kind: 'segment'; index: number };

/** Normalize a client point to xN (0..1 across the width) + py (0..totalH down the height). */
export function toLocalCoords(
  clientX: number,
  clientY: number,
  rect: ClientRectLike,
  totalH: number
): { xN: number; py: number } {
  const xN = clamp01((clientX - rect.left) / (rect.width || 1));
  const py = ((clientY - rect.top) / (rect.height || 1)) * totalH;
  return { xN, py };
}

/**
 * Resolve what a press at (xN, py) targets: the driver lane, an interior boundary (when
 * within `edgeHitNorm` of one — this takes priority over the body), else the segment body.
 */
export function pointerTarget(
  xN: number,
  py: number,
  segments: CurveSegment[],
  layout: ComposerHitLayout,
  edgeHitNorm: number
): PointerTarget {
  if (layout.driverY != null && py >= layout.driverY) return { kind: 'driver' };
  const b = boundaryAt(xN, segments, edgeHitNorm);
  if (b != null) return { kind: 'boundary', index: b };
  return { kind: 'segment', index: segmentIndexAt(xN, segments) };
}

/**
 * Apply a segment body drag from its press-time baseline: horizontal fraction → energy
 * bias, vertical fraction (up = more) → steepness. `dxFrac`/`dyFrac` are pixel deltas
 * divided by the lane width/height.
 */
export function applySegmentBodyDrag(
  comp: CurveComposition,
  index: number,
  baseCurvature: number,
  baseSteepness: number,
  dxFrac: number,
  dyFrac: number
): CurveComposition {
  const next = setSegmentCurvature(comp, index, baseCurvature + dxFrac / DRAG_ENERGY_GAIN);
  return setSegmentSteepness(next, index, baseSteepness - dyFrac / DRAG_STEEP_GAIN);
}

/** Driver-lane equivalent of {@link applySegmentBodyDrag}. */
export function applyDriverBodyDrag(
  comp: CurveComposition,
  baseCurvature: number,
  baseSteepness: number,
  dxFrac: number,
  dyFrac: number
): CurveComposition {
  const next = setDriverCurvature(comp, baseCurvature + dxFrac / DRAG_ENERGY_GAIN);
  return setDriverSteepness(next, baseSteepness - dyFrac / DRAG_STEEP_GAIN);
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

// --- geometry / SVG layout (pure; shared by every framework wrapper) ---
//
// These produce numbers and SVG path strings, never DOM, so the four wrappers render the
// identical composer by calling them instead of each re-deriving the layout and paths.

/** A lane rectangle in viewBox units. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** px between the main lane and the driver lane. */
export const COMPOSER_GAP = 10;
/** Vertical headroom inside a lane (room for spring overshoot), as a fraction of its height. */
export const COMPOSER_PAD_FRAC = 0.18;
/** Driver lane height relative to the main lane. */
export const COMPOSER_DRIVER_FRAC = 0.55;

/** Resolved lane geometry for a given size and driver presence. */
export interface ComposerLayout {
  /** Total width (the viewBox width). */
  W: number;
  /** Total height (the viewBox height): the main lane plus the driver lane when present. */
  totalH: number;
  mainRect: Rect;
  /** The driver lane rect, or null when there is no driver. */
  driverRect: Rect | null;
}

/** Compute the lane rectangles and total height for the composer. */
export function composerLayout(width: number, height: number, hasDriver: boolean): ComposerLayout {
  const driverH = hasDriver ? Math.round(height * COMPOSER_DRIVER_FRAC) : 0;
  const totalH = height + (hasDriver ? COMPOSER_GAP + driverH : 0);
  return {
    W: width,
    totalH,
    mainRect: { x: 0, y: 0, w: width, h: height },
    driverRect: hasDriver ? { x: 0, y: height + COMPOSER_GAP, w: width, h: driverH } : null,
  };
}

/** Map a normalized value (0..1, may overshoot for springs) to a y inside a lane's padded band. */
export function mapY(rect: Rect, ny: number): number {
  const pad = rect.h * COMPOSER_PAD_FRAC;
  const top = rect.y + pad;
  const bot = rect.y + rect.h - pad;
  return bot - ny * (bot - top);
}

/** The x (viewBox px) of normalized position `nx` within a segment's [start, end] span. */
function spanX(span: [number, number], nx: number, W: number): number {
  return (span[0] + nx * (span[1] - span[0])) * W;
}

/**
 * Build the SVG path `d` for a curve within a lane + span: a single cubic-bezier for the
 * eased types, or a `samples`-point polyline for springs (whose overshoot a bezier can't
 * express). Pure string output — no DOM.
 */
export function curvePath(
  curve: CurveSegment | CurveDriver,
  rect: Rect,
  span: [number, number],
  W: number,
  samples = 40
): string {
  const x = (nx: number) => spanX(span, nx, W);
  const y = (ny: number) => mapY(rect, ny);
  if (curve.type === 'spring') {
    const sampler = buildSampler(curve);
    let d = `M ${x(0)} ${y(sampler(0))}`;
    for (let i = 1; i <= samples; i++) {
      const t = i / samples;
      d += ` L ${x(t)} ${y(sampler(t))}`;
    }
    return d;
  }
  const e = deriveEase(curve.type, curve.curvature, curve.steepness);
  return `M ${x(0)} ${y(0)} C ${x(e[0])} ${y(e[1])}, ${x(e[2])} ${y(e[3])}, ${x(1)} ${y(1)}`;
}

/** Endpoints of the faint linear-reference diagonal behind a segment (or the driver lane). */
export function diagonalLine(
  rect: Rect,
  span: [number, number],
  W: number
): { x1: number; y1: number; x2: number; y2: number } {
  return { x1: span[0] * W, y1: mapY(rect, 0), x2: span[1] * W, y2: mapY(rect, 1) };
}

/** Per-frame playhead geometry from a read + layout: the series playhead/dot and driver marker. */
export function playheadGeometry(
  read: CompositionRead,
  layout: ComposerLayout
): { seriesX: number; dotX: number; dotY: number; driverX: number } {
  const seriesX = read.warpedPhase * layout.W;
  return {
    seriesX,
    dotX: seriesX,
    dotY: mapY(layout.mainRect, read.value),
    driverX: read.inputPhase * layout.W,
  };
}

// --- trigger series (an alternative, discrete read of the SIGNAL) ---

/** Default trigger count for a trigger series. */
export const DEFAULT_TRIGGER_STEPS = 5;

/**
 * The evenly-spaced trigger levels in VALUE (signal) space — not time. The first sits at
 * 0 and the last at 1, e.g. steps=5 → [0, .25, .5, .75, 1]. Triggers fire when the composed
 * value crosses these levels, so a non-linear curve (which reaches each level at an uneven
 * pace) fires them unevenly in time — that pacing is the whole point. Use these to draw the
 * horizontal level lines a trigger series rides.
 */
export function triggerLevels(steps: number): number[] {
  const n = Math.max(2, Math.floor(steps));
  const out: number[] = [];
  for (let k = 0; k < n; k++) out.push(k / (n - 1));
  return out;
}

/** A single-frame value change this large is a segment/loop flyback, not a smooth crossing. */
const TRIGGER_FLYBACK = 0.5;

/**
 * Level indices (into `triggerLevels`) fired as the composed value moves `prevValue` →
 * `curValue`. Pass the composed `value` (post driver/direction) frame to frame; the
 * firing is direction-symmetric — it reads the value sequence, so it works for forward,
 * reverse, and mirror alike:
 *
 * - A smooth move fires the INTERIOR levels (strictly between 0 and 1) it crosses, in the
 *   travel direction — the curve sets how fast the value reaches each, so non-linear
 *   curves fire them unevenly.
 * - A flyback (a single-frame jump larger than {@link TRIGGER_FLYBACK}) is the per-segment /
 *   loop boundary. The walk reached the far endpoint it flew back from, so that endpoint
 *   fires: a downward flyback (a forward walk that peaked) fires the top (n−1); an upward
 *   flyback (a reverse walk that bottomed) fires the floor (0). The opposite endpoint is the
 *   start of the next walk, folded onto this one so the boundary never double-triggers.
 *
 * Values are clamped to [0, 1] so spring overshoot can't perturb the endpoints.
 */
export function triggersCrossed(prevValue: number, curValue: number, steps: number): number[] {
  const n = Math.max(2, Math.floor(steps));
  const seg = 1 / (n - 1); // value spacing between adjacent levels
  const p = clamp01(prevValue);
  const c = clamp01(curValue);
  const delta = c - p;
  const fired: number[] = [];
  if (Math.abs(delta) > TRIGGER_FLYBACK) {
    fired.push(delta < 0 ? n - 1 : 0); // flyback: fire the far endpoint the walk flew back from
  } else if (delta > 0) {
    for (let k = 1; k <= n - 2; k++) {
      const level = k * seg;
      if (p < level && level <= c) fired.push(k); // ascending: interior levels in (p, c]
    }
  } else if (delta < 0) {
    for (let k = n - 2; k >= 1; k--) {
      const level = k * seg;
      if (c <= level && level < p) fired.push(k); // descending: interior levels in [c, p)
    }
  }
  return fired;
}

/** A reasonable starting composition for demos / uncontrolled mounts. */
export function defaultComposition(): CurveComposition {
  return {
    segments: [
      { type: 'easeOut', weight: 1, curvature: 0, steepness: 0 },
      { type: 'easeInOut', weight: 1, curvature: 0, steepness: 0 },
    ],
    driver: null,
    direction: 'forward',
  };
}
