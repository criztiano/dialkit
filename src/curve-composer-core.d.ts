/** The curve vocabulary a segment cycles through on quick-click. */
export type CurveType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
/** Cycle order for quick-click (loops back to the start). */
export declare const CURVE_CYCLE: CurveType[];
/** Cubic-bezier control points (P0=(0,0), P3=(1,1) implied) for each easing preset. */
export declare const easingPresets: Record<Exclude<CurveType, 'spring'>, [number, number, number, number]>;
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
/** Pointer travel (CSS px) past which a press becomes a drag rather than a click. */
export declare const DRAG_THRESHOLD = 3;
/** How close (CSS px) a press must be to a boundary to grab it for resizing. */
export declare const EDGE_HIT = 6;
/** Smallest normalized slice a segment may shrink to under a boundary drag. */
export declare const CURVE_MIN_WEIGHT_FRAC = 0.06;
/** A pure `(t) -> value` sampler over local time, both in 0..1 (value may overshoot for springs). */
export type Sampler = (t: number) => number;
/**
 * Derive the bezier control points for a type at a given energy bias + steepness.
 * Every preset shares y=(0,1) and differs only in its x control points. Steepness scales
 * each x's deviation from the linear diagonal (x1 from 0, x2 from 1) — intensifying or
 * relaxing the ease while keeping its character. Energy then shifts both x's in tandem:
 * bias>0 pushes the bend toward the fall (slow start, late rush), bias<0 toward the onset.
 */
export declare function deriveEase(type: CurveType, curvature: number, steepness?: number): [number, number, number, number];
/** Build a reusable sampler for a segment/driver (precomputes spring points once). */
export declare function buildSampler(curve: CurveSegment | CurveDriver): Sampler;
/** Interior cumulative split positions (0..1), excluding the 0 and 1 ends. */
export declare function boundaries(segments: CurveSegment[]): number[];
export declare function totalWeight(segments: CurveSegment[]): number;
/** [start, end] of a segment's horizontal slice in 0..1. */
export declare function segmentSpan(segments: CurveSegment[], index: number): [number, number];
/** Which segment slice an x (0..1) falls in. */
export declare function segmentIndexAt(xNorm: number, segments: CurveSegment[]): number;
/** Nearest interior boundary within `edgeHitNorm` of x, or null. Returns the boundary index (between i and i+1). */
export declare function boundaryAt(xNorm: number, segments: CurveSegment[], edgeHitNorm: number): number | null;
/**
 * Insert a copy of the segment at `index` after it, then re-divide ALL segments to
 * equal duration — split always yields evenly-spaced clips.
 */
export declare function splitSegment(comp: CurveComposition, index: number): CurveComposition;
/** Remove the segment at `index` (no-op when it's the only one). */
export declare function removeSegment(comp: CurveComposition, index: number): CurveComposition;
export declare function cycleSegmentType(comp: CurveComposition, index: number): CurveComposition;
export declare function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition;
export declare function setSegmentSteepness(comp: CurveComposition, index: number, steepness: number): CurveComposition;
/**
 * Move `deltaFrac` (0..1 of the whole series) across the boundary between segment
 * `boundaryIndex` and the next, keeping the rest untouched and the pair's combined
 * width constant. Each side is clamped to `CURVE_MIN_WEIGHT_FRAC`.
 */
export declare function redistributeWeight(comp: CurveComposition, boundaryIndex: number, deltaFrac: number): CurveComposition;
export declare function addDriver(comp: CurveComposition): CurveComposition;
export declare function removeDriver(comp: CurveComposition): CurveComposition;
export declare function cycleDriverType(comp: CurveComposition): CurveComposition;
export declare function setDriverCurvature(comp: CurveComposition, curvature: number): CurveComposition;
export declare function setDriverSteepness(comp: CurveComposition, steepness: number): CurveComposition;
export declare const DRAG_ENERGY_GAIN = 0.6;
export declare const DRAG_STEEP_GAIN = 0.6;
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
export type PointerTarget = {
    kind: 'driver';
} | {
    kind: 'boundary';
    index: number;
} | {
    kind: 'segment';
    index: number;
};
/** Normalize a client point to xN (0..1 across the width) + py (0..totalH down the height). */
export declare function toLocalCoords(clientX: number, clientY: number, rect: ClientRectLike, totalH: number): {
    xN: number;
    py: number;
};
/**
 * Resolve what a press at (xN, py) targets: the driver lane, an interior boundary (when
 * within `edgeHitNorm` of one — this takes priority over the body), else the segment body.
 */
export declare function pointerTarget(xN: number, py: number, segments: CurveSegment[], layout: ComposerHitLayout, edgeHitNorm: number): PointerTarget;
/**
 * Apply a segment body drag from its press-time baseline: horizontal fraction → energy
 * bias, vertical fraction (up = more) → steepness. `dxFrac`/`dyFrac` are pixel deltas
 * divided by the lane width/height.
 */
export declare function applySegmentBodyDrag(comp: CurveComposition, index: number, baseCurvature: number, baseSteepness: number, dxFrac: number, dyFrac: number): CurveComposition;
/** Driver-lane equivalent of {@link applySegmentBodyDrag}. */
export declare function applyDriverBodyDrag(comp: CurveComposition, baseCurvature: number, baseSteepness: number, dxFrac: number, dyFrac: number): CurveComposition;
export interface CompositionSamplers {
    segments: Sampler[];
    driver: Sampler | null;
}
export declare function buildSamplers(comp: CurveComposition): CompositionSamplers;
/** Apply playback direction to the raw loop phase u (0..1). */
export declare function directionPhase(u: number, dir: DriverDirection): number;
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
export declare function readComposition(comp: CurveComposition, u: number, s: CompositionSamplers): CompositionRead;
/** A lane rectangle in viewBox units. */
export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
/** px between the main lane and the driver lane. */
export declare const COMPOSER_GAP = 10;
/** Vertical headroom inside a lane (room for spring overshoot), as a fraction of its height. */
export declare const COMPOSER_PAD_FRAC = 0.18;
/** Driver lane height relative to the main lane. */
export declare const COMPOSER_DRIVER_FRAC = 0.55;
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
export declare function composerLayout(width: number, height: number, hasDriver: boolean): ComposerLayout;
/** Map a normalized value (0..1, may overshoot for springs) to a y inside a lane's padded band. */
export declare function mapY(rect: Rect, ny: number): number;
/**
 * Build the SVG path `d` for a curve within a lane + span: a single cubic-bezier for the
 * eased types, or a `samples`-point polyline for springs (whose overshoot a bezier can't
 * express). Pure string output — no DOM.
 */
export declare function curvePath(curve: CurveSegment | CurveDriver, rect: Rect, span: [number, number], W: number, samples?: number): string;
/** Endpoints of the faint linear-reference diagonal behind a segment (or the driver lane). */
export declare function diagonalLine(rect: Rect, span: [number, number], W: number): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
/** Per-frame playhead geometry from a read + layout: the series playhead/dot and driver marker. */
export declare function playheadGeometry(read: CompositionRead, layout: ComposerLayout): {
    seriesX: number;
    dotX: number;
    dotY: number;
    driverX: number;
};
/** Default trigger count for a trigger series. */
export declare const DEFAULT_TRIGGER_STEPS = 5;
/**
 * The evenly-spaced trigger levels in VALUE (signal) space — not time. The first sits at
 * 0 and the last at 1, e.g. steps=5 → [0, .25, .5, .75, 1]. Triggers fire when the composed
 * value crosses these levels, so a non-linear curve (which reaches each level at an uneven
 * pace) fires them unevenly in time — that pacing is the whole point. Use these to draw the
 * horizontal level lines a trigger series rides.
 */
export declare function triggerLevels(steps: number): number[];
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
export declare function triggersCrossed(prevValue: number, curValue: number, steps: number): number[];
/** A reasonable starting composition for demos / uncontrolled mounts. */
export declare function defaultComposition(): CurveComposition;
//# sourceMappingURL=curve-composer-core.d.ts.map