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
     * Sweeps linear (−1) ← canonical preset (0) → the explosive extreme (+1, expo-grade: the
     * eased side's far control point drops to the floor). So steepness is the continuous power
     * ladder (gentle → quad → … → expo), with circ reachable mid-range. Spring maps it to stiffness.
     */
    steepness: number;
    /**
     * 0..1 overshoot — pushes the curve above 1 at the END before settling (easeOutBack),
     * 0 = none. Independent of `anticipate`; set both for easeInOutBack. Beyond ~1 is
     * elastic/bounce — use spring. Optional; treated as 0 when absent. No-op for spring.
     */
    overshoot?: number;
    /**
     * 0..1 anticipation — dips the curve below 0 at the START before launching (easeInBack),
     * 0 = none. Independent of `overshoot`. Optional; treated as 0 when absent. No-op for spring.
     */
    anticipate?: number;
}
/** The stacked driver curve (a single curve, no internal splits). */
interface CurveDriver {
    type: CurveType;
    /** Bipolar -1..1 energy bias — see CurveSegment.curvature. */
    curvature: number;
    /** Bipolar -1..1 steepness — see CurveSegment.steepness. */
    steepness: number;
    /** 0..1 overshoot — see CurveSegment.overshoot. */
    overshoot?: number;
    /** 0..1 anticipation — see CurveSegment.anticipate. */
    anticipate?: number;
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
 * Derive the cubic-bezier control points [x1,y1,x2,y2] for a curve. Three knobs span the
 * whole easing space (P0=(0,0), P3=(1,1) implied):
 * - steepness sweeps linear (−1) ← preset (0) → the expo-grade extreme (+1); it's the
 *   continuous power ladder (quad→…→expo), with circ reachable mid-range.
 * - energy shifts both x control points in tandem (onset ↔ fall).
 * - overshoot (0..1) raises the end above 1 (easeOutBack); anticipate (0..1) drops the start
 *   below 0 (easeInBack). They are independent — set both for easeInOutBack. x stays clamped
 *   so time stays monotonic.
 */
declare function deriveEase(type: CurveType, curvature: number, steepness?: number, overshoot?: number, anticipate?: number): [number, number, number, number];
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
declare function flipSegment(comp: CurveComposition, index: number): CurveComposition;
declare function flipDriver(comp: CurveComposition): CurveComposition;
declare function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition;
declare function setSegmentSteepness(comp: CurveComposition, index: number, steepness: number): CurveComposition;
declare function setSegmentOvershoot(comp: CurveComposition, index: number, overshoot: number): CurveComposition;
declare function setSegmentAnticipate(comp: CurveComposition, index: number, anticipate: number): CurveComposition;
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
declare function setDriverOvershoot(comp: CurveComposition, overshoot: number): CurveComposition;
declare function setDriverAnticipate(comp: CurveComposition, anticipate: number): CurveComposition;
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
/** Height (viewBox px) of the header strip at the top of each lane — the curve's "select" zone. */
declare const COMPOSER_HEADER_H = 16;
/**
 * If (xN, py) lands in a lane's header strip (the top band where the type label sits), the
 * curve it selects: a segment index, or 'driver'. Else null. Check this before
 * `pointerTarget` so a header click selects rather than cycles/drags.
 */
declare function headerHit(xN: number, py: number, segments: CurveSegment[], layout: ComposerHitLayout): number | 'driver' | null;
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
/** A lane rectangle in viewBox units. */
interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
/** px between the main lane and the driver lane. */
declare const COMPOSER_GAP = 10;
/** Vertical headroom inside a lane (room for spring overshoot), as a fraction of its height. */
declare const COMPOSER_PAD_FRAC = 0.18;
/** Driver lane height relative to the main lane. */
declare const COMPOSER_DRIVER_FRAC = 0.55;
/** Resolved lane geometry for a given size and driver presence. */
interface ComposerLayout {
    /** Total width (the viewBox width). */
    W: number;
    /** Total height (the viewBox height): the main lane plus the driver lane when present. */
    totalH: number;
    mainRect: Rect;
    /** The driver lane rect, or null when there is no driver. */
    driverRect: Rect | null;
}
/** Compute the lane rectangles and total height for the composer. */
declare function composerLayout(width: number, height: number, hasDriver: boolean): ComposerLayout;
/** Map a normalized value (0..1, may overshoot for springs) to a y inside a lane's padded band. */
declare function mapY(rect: Rect, ny: number): number;
/**
 * Build the SVG path `d` for a curve within a lane + span: a single cubic-bezier for the
 * eased types, or a `samples`-point polyline for springs (whose overshoot a bezier can't
 * express). Pure string output — no DOM.
 */
declare function curvePath(curve: CurveSegment | CurveDriver, rect: Rect, span: [number, number], W: number, samples?: number): string;
/** Endpoints of the faint linear-reference diagonal behind a segment (or the driver lane). */
declare function diagonalLine(rect: Rect, span: [number, number], W: number): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
/** Per-frame playhead geometry from a read + layout: the series playhead/dot and driver marker. */
declare function playheadGeometry(read: CompositionRead, layout: ComposerLayout): {
    seriesX: number;
    dotX: number;
    dotY: number;
    driverX: number;
};
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

export { COMPOSER_DRIVER_FRAC, COMPOSER_GAP, COMPOSER_HEADER_H, COMPOSER_PAD_FRAC, CURVE_CYCLE, CURVE_MIN_WEIGHT_FRAC, type ClientRectLike, type ComposerHitLayout, type ComposerLayout, type CompositionRead, type CompositionSamplers, type CurveComposition, type CurveDriver, type CurveSegment, type CurveType, DEFAULT_TRIGGER_STEPS, DRAG_ENERGY_GAIN, DRAG_STEEP_GAIN, DRAG_THRESHOLD, type DriverDirection, EDGE_HIT, type PointerTarget, type Rect, type Sampler, addDriver, applyDriverBodyDrag, applySegmentBodyDrag, boundaries, boundaryAt, buildSampler, buildSamplers, composerLayout, curvePath, cycleDriverType, cycleSegmentType, defaultComposition, deriveEase, diagonalLine, directionPhase, easingPresets, flipDriver, flipSegment, headerHit, mapY, playheadGeometry, pointerTarget, readComposition, redistributeWeight, removeDriver, removeSegment, segmentIndexAt, segmentSpan, setDriverAnticipate, setDriverCurvature, setDriverOvershoot, setDriverSteepness, setSegmentAnticipate, setSegmentCurvature, setSegmentOvershoot, setSegmentSteepness, splitSegment, toLocalCoords, totalWeight, triggerLevels, triggersCrossed };
