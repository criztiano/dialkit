/** The curve vocabulary a segment cycles through on quick-click. */
type CurveType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
/** Cycle order for quick-click (loops back to the start). */
declare const CURVE_CYCLE: CurveType[];
/** Cubic-bezier control points (P0=(0,0), P3=(1,1) implied) for each easing preset. */
declare const easingPresets: Record<Exclude<CurveType, 'spring'>, [number, number, number, number]>;
/** One curve in the series. `weight` is a relative duration share (normalized by the sum). */
interface CurveSegment {
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
interface CurveDriver {
    type: CurveType;
    /** Bipolar -1..1 energy bias — see CurveSegment.curvature. */
    curvature: number;
    /** Bipolar -1..1 steepness — see CurveSegment.steepness. */
    steepness: number;
}
type DriverDirection = 'forward' | 'mirror' | 'reverse';
interface CurveComposition {
    segments: CurveSegment[];
    /** null → no driver lane (the component renders a single lane). */
    driver: CurveDriver | null;
    direction: DriverDirection;
}
/** Pointer travel (CSS px) past which a press becomes a drag rather than a click. */
declare const DRAG_THRESHOLD = 3;
/** How close (CSS px) a press must be to a boundary to grab it for resizing. */
declare const EDGE_HIT = 6;
/** Smallest normalized slice a segment may shrink to under a boundary drag. */
declare const CURVE_MIN_WEIGHT_FRAC = 0.06;
/** A pure `(t) -> value` sampler over local time, both in 0..1 (value may overshoot for springs). */
type Sampler = (t: number) => number;
/**
 * Derive the bezier control points for a type at a given energy bias + steepness.
 * Every preset shares y=(0,1) and differs only in its x control points. Steepness scales
 * each x's deviation from the linear diagonal (x1 from 0, x2 from 1) — intensifying or
 * relaxing the ease while keeping its character. Energy then shifts both x's in tandem:
 * bias>0 pushes the bend toward the fall (slow start, late rush), bias<0 toward the onset.
 */
declare function deriveEase(type: CurveType, curvature: number, steepness?: number): [number, number, number, number];
/** Build a reusable sampler for a segment/driver (precomputes spring points once). */
declare function buildSampler(curve: CurveSegment | CurveDriver): Sampler;
/** Interior cumulative split positions (0..1), excluding the 0 and 1 ends. */
declare function boundaries(segments: CurveSegment[]): number[];
declare function totalWeight(segments: CurveSegment[]): number;
/** [start, end] of a segment's horizontal slice in 0..1. */
declare function segmentSpan(segments: CurveSegment[], index: number): [number, number];
/** Which segment slice an x (0..1) falls in. */
declare function segmentIndexAt(xNorm: number, segments: CurveSegment[]): number;
/** Nearest interior boundary within `edgeHitNorm` of x, or null. Returns the boundary index (between i and i+1). */
declare function boundaryAt(xNorm: number, segments: CurveSegment[], edgeHitNorm: number): number | null;
/**
 * Insert a copy of the segment at `index` after it, then re-divide ALL segments to
 * equal duration — split always yields evenly-spaced clips.
 */
declare function splitSegment(comp: CurveComposition, index: number): CurveComposition;
/** Remove the segment at `index` (no-op when it's the only one). */
declare function removeSegment(comp: CurveComposition, index: number): CurveComposition;
declare function cycleSegmentType(comp: CurveComposition, index: number): CurveComposition;
declare function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition;
declare function setSegmentSteepness(comp: CurveComposition, index: number, steepness: number): CurveComposition;
/**
 * Move `deltaFrac` (0..1 of the whole series) across the boundary between segment
 * `boundaryIndex` and the next, keeping the rest untouched and the pair's combined
 * width constant. Each side is clamped to `CURVE_MIN_WEIGHT_FRAC`.
 */
declare function redistributeWeight(comp: CurveComposition, boundaryIndex: number, deltaFrac: number): CurveComposition;
declare function addDriver(comp: CurveComposition): CurveComposition;
declare function removeDriver(comp: CurveComposition): CurveComposition;
declare function cycleDriverType(comp: CurveComposition): CurveComposition;
declare function setDriverCurvature(comp: CurveComposition, curvature: number): CurveComposition;
declare function setDriverSteepness(comp: CurveComposition, steepness: number): CurveComposition;
declare const DRAG_ENERGY_GAIN = 0.6;
declare const DRAG_STEEP_GAIN = 0.6;
/** The minimal rectangle a wrapper reads from `getBoundingClientRect()`. */
interface ClientRectLike {
    left: number;
    top: number;
    width: number;
    height: number;
}
/** Which lane regions exist, for hit-testing in viewBox (`py`) units. */
interface ComposerHitLayout {
    /** Total composite height (the viewBox height). */
    totalH: number;
    /** y where the driver lane begins, or null when there is no driver lane. */
    driverY: number | null;
}
/** A resolved press target inside the composer. */
type PointerTarget = {
    kind: 'driver';
} | {
    kind: 'boundary';
    index: number;
} | {
    kind: 'segment';
    index: number;
};
/** Normalize a client point to xN (0..1 across the width) + py (0..totalH down the height). */
declare function toLocalCoords(clientX: number, clientY: number, rect: ClientRectLike, totalH: number): {
    xN: number;
    py: number;
};
/**
 * Resolve what a press at (xN, py) targets: the driver lane, an interior boundary (when
 * within `edgeHitNorm` of one — this takes priority over the body), else the segment body.
 */
declare function pointerTarget(xN: number, py: number, segments: CurveSegment[], layout: ComposerHitLayout, edgeHitNorm: number): PointerTarget;
/**
 * Apply a segment body drag from its press-time baseline: horizontal fraction → energy
 * bias, vertical fraction (up = more) → steepness. `dxFrac`/`dyFrac` are pixel deltas
 * divided by the lane width/height.
 */
declare function applySegmentBodyDrag(comp: CurveComposition, index: number, baseCurvature: number, baseSteepness: number, dxFrac: number, dyFrac: number): CurveComposition;
/** Driver-lane equivalent of {@link applySegmentBodyDrag}. */
declare function applyDriverBodyDrag(comp: CurveComposition, baseCurvature: number, baseSteepness: number, dxFrac: number, dyFrac: number): CurveComposition;
interface CompositionSamplers {
    segments: Sampler[];
    driver: Sampler | null;
}
declare function buildSamplers(comp: CurveComposition): CompositionSamplers;
/** Apply playback direction to the raw loop phase u (0..1). */
declare function directionPhase(u: number, dir: DriverDirection): number;
interface CompositionRead {
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
declare function readComposition(comp: CurveComposition, u: number, s: CompositionSamplers): CompositionRead;
/** Default trigger count for a trigger series. */
declare const DEFAULT_TRIGGER_STEPS = 5;
/**
 * The evenly-spaced trigger levels in VALUE (signal) space — not time. The first sits at
 * 0 and the last at 1, e.g. steps=5 → [0, .25, .5, .75, 1]. Triggers fire when the composed
 * value crosses these levels, so a non-linear curve (which reaches each level at an uneven
 * pace) fires them unevenly in time — that pacing is the whole point. Use these to draw the
 * horizontal level lines a trigger series rides.
 */
declare function triggerLevels(steps: number): number[];
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
declare function triggersCrossed(prevValue: number, curValue: number, steps: number): number[];
/** A reasonable starting composition for demos / uncontrolled mounts. */
declare function defaultComposition(): CurveComposition;

export { CURVE_CYCLE, CURVE_MIN_WEIGHT_FRAC, type ClientRectLike, type ComposerHitLayout, type CompositionRead, type CompositionSamplers, type CurveComposition, type CurveDriver, type CurveSegment, type CurveType, DEFAULT_TRIGGER_STEPS, DRAG_ENERGY_GAIN, DRAG_STEEP_GAIN, DRAG_THRESHOLD, type DriverDirection, EDGE_HIT, type PointerTarget, type Sampler, addDriver, applyDriverBodyDrag, applySegmentBodyDrag, boundaries, boundaryAt, buildSampler, buildSamplers, cycleDriverType, cycleSegmentType, defaultComposition, deriveEase, directionPhase, easingPresets, pointerTarget, readComposition, redistributeWeight, removeDriver, removeSegment, segmentIndexAt, segmentSpan, setDriverCurvature, setDriverSteepness, setSegmentCurvature, setSegmentSteepness, splitSegment, toLocalCoords, totalWeight, triggerLevels, triggersCrossed };
