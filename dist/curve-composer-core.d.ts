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
    /** 0..1 intensity — bezier: lerp linear↔preset; spring: bounce amount. */
    curvature: number;
}
/** The stacked driver curve (a single curve, no internal splits). */
interface CurveDriver {
    type: CurveType;
    curvature: number;
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
/** Derive the bezier control points for a type at a given curvature (linear↔preset). */
declare function deriveEase(type: CurveType, curvature: number): [number, number, number, number];
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
/** Halve the segment at `index` and insert a copy after it (inherits type + curvature). */
declare function splitSegment(comp: CurveComposition, index: number): CurveComposition;
/** Remove the segment at `index` (no-op when it's the only one). */
declare function removeSegment(comp: CurveComposition, index: number): CurveComposition;
declare function cycleSegmentType(comp: CurveComposition, index: number): CurveComposition;
declare function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition;
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
    /** Read position after the driver warps it (0..1) — the series lane playhead. */
    warpedPhase: number;
    /**
     * Composed output, 0..1 — a CONTINUOUS chain: each segment's shape plays within its
     * own time band [a,b], so the output advances monotonically across dividers instead
     * of resetting. Reduces to the identity diagonal when every segment is linear.
     */
    value: number;
    /** The active segment's local eased value, 0..1 — rides the per-box visible curve (the dot). */
    localValue: number;
    segIndex: number;
    localT: number;
}
/**
 * Read the composition at raw loop phase `u`. direction reverses/ping-pongs the
 * traversal of the whole composition; the driver then warps the reading pace. The
 * segments render as independent 0..1 boxes but read as one continuous chain.
 */
declare function readComposition(comp: CurveComposition, u: number, s: CompositionSamplers): CompositionRead;
/** A reasonable starting composition for demos / uncontrolled mounts. */
declare function defaultComposition(): CurveComposition;

export { CURVE_CYCLE, CURVE_MIN_WEIGHT_FRAC, type CompositionRead, type CompositionSamplers, type CurveComposition, type CurveDriver, type CurveSegment, type CurveType, DRAG_THRESHOLD, type DriverDirection, EDGE_HIT, type Sampler, addDriver, boundaries, boundaryAt, buildSampler, buildSamplers, cycleDriverType, cycleSegmentType, defaultComposition, deriveEase, directionPhase, easingPresets, readComposition, redistributeWeight, removeDriver, removeSegment, segmentIndexAt, segmentSpan, setDriverCurvature, setSegmentCurvature, splitSegment, totalWeight };
