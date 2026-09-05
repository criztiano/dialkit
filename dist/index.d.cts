import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { ReactNode, CSSProperties, ReactElement } from 'react';

/**
 * color-core — DOM-free color math shared by every framework port of the
 * color picker (React, Solid, Vue, Svelte). Pure functions only; anything
 * that touches the DOM or storage lives in the component layer or
 * color-palette-store.
 *
 * Canonical value shape: hex string. `#rrggbb` normally, `#rrggbbaa` always
 * (even at full opacity) when a control opts into alpha — deterministic
 * round-tripping keeps store reconciliation trivial.
 */
/** r/g/b 0–255, a 0–1. */
type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
};
/** h 0–360, s/v 0–1, a 0–1. The picker's working space. */
type HSVA = {
    h: number;
    s: number;
    v: number;
    a: number;
};
/** h 0–360, s/l 0–1, a 0–1. */
type HSLA = {
    h: number;
    s: number;
    l: number;
    a: number;
};
/** OKLCH: l 0–1, c ≥ 0 (sRGB tops out ≈0.37), h 0–360, a 0–1. */
type OKLCH = {
    l: number;
    c: number;
    h: number;
    a: number;
};
type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';
declare const COLOR_FORMATS: ColorFormat[];
/** Parses #RGB / #RGBA / #RRGGBB / #RRGGBBAA; tolerates a missing '#' and whitespace. */
declare function parseHex(input: string): RGBA | null;
/** Lowercase `#rrggbb`, or `#rrggbbaa` (always, even at a=1) when alpha is enabled. */
declare function formatHex(rgba: RGBA, alphaEnabled: boolean): string;
/** Parse + reformat; strips the alpha channel when alpha is off. Null when unparseable. */
declare function normalizeHex(input: string, alphaEnabled: boolean): string | null;
/** Trigger-row presentation: uppercased, alpha digits hidden (opacity has its own readout). */
declare function displayHex(value: string): string;
/** 0–100 readout for the trigger row ("60 %"). */
declare function opacityPercent(rgba: RGBA): number;
declare function rgbToHsv(rgba: RGBA): HSVA;
declare function hsvToRgb(hsva: HSVA): RGBA;
declare function rgbToHsl(rgba: RGBA): HSLA;
declare function hslToRgb(hsla: HSLA): RGBA;
declare function rgbToOklch(rgba: RGBA): OKLCH;
/**
 * Maps an out-of-gamut OKLCH into sRGB by binary-searching the chroma down,
 * preserving lightness and hue (channel-clipping would shift the hue).
 */
declare function clampOklchToSrgb(oklch: OKLCH): OKLCH;
declare function oklchToRgb(oklch: OKLCH): RGBA;

/**
 * gradient-core — DOM-free gradient math shared by every framework port of the
 * gradient editor. Pure functions only; anything touching the DOM lives in the
 * component layer. Reuses color-core for all color math (no duplication).
 *
 * Canonical value shape and invariants (enforced by normalizeGradient and
 * preserved by every helper below):
 *   - stops sorted ascending by position
 *   - positions clamped to 0–1
 *   - stop colors always 8-digit lowercase hex (#rrggbbaa) — alpha always on
 *   - angle wrapped to [0, 360)
 *   - stops.length >= MIN_STOPS
 * `angle` is kept even for radial gradients so switching type round-trips
 * without losing the value.
 */

type GradientType = 'linear' | 'radial' | 'conic';
/** color is always #rrggbbaa; position is 0–1. */
type GradientStop = {
    color: string;
    position: number;
};
type GradientValue = {
    type: GradientType;
    angle: number;
    stops: GradientStop[];
    /** Radial/conic origin as 0–100 (%). Absent = centered (50). */
    centerX?: number;
    centerY?: number;
    /** Radial horizontal radius as % of the box, 10–200. Absent = 100. */
    scale?: number;
    /** Radial vertical radius as % of the box, 1–200. Absent = matches `scale`
     *  (round). Independent of `scale`, so &lt; scale is a wide ellipse and
     *  &gt; scale is a tall one. */
    squash?: number;
    /** Radial ellipse tilt in degrees. Renders via the companion transform, since
     *  CSS radial gradients are axis-aligned. Absent = 0. */
    rotation?: number;
};
/** Transform + origin that renders a radial gradient's rotation (see gradientToTransform). */
type GradientTransform = {
    transform: string;
    transformOrigin: string;
};
declare const MIN_STOPS = 2;
declare const DEFAULT_GRADIENT: GradientValue;
/** Ready CSS gradient string for any of the three types. #rrggbbaa is valid CSS. */
declare function gradientToCss(value: GradientValue): string;
/**
 * The CSS transform that rotates a radial gradient's ellipse — CSS radial
 * gradients are axis-aligned, so tilt has to ride the element (or a background
 * layer) that shows the gradient. Identity (`none`) for a round radial, a
 * non-radial type, or zero rotation. Apply alongside gradientToCss:
 *   `<div style={{ background: gradientToCss(v), ...gradientToTransform(v) }} />`
 * (on a clipping layer, since a rotated fill overflows its box).
 */
declare function gradientToTransform(value: GradientValue): GradientTransform;
/**
 * A positioned fill layer that paints a gradient covering a `boxW × boxH` area
 * with no clipped corners — even a rotated radial. A CSS radial gradient's final
 * color already extends to infinity, so the only thing that clips is the layer's
 * own box: rotating a box the size of the pad pulls its corners inward and
 * exposes the area behind it. So for radial we size the layer to an oversized
 * square centered on the gradient origin and spin it around its own center
 * (half-side ≥ the box diagonal → no rotation angle can uncover a corner), with
 * the ellipse expressed in pixels so it matches the box exactly. Linear and
 * conic gradients already fill their box, so the layer just matches it.
 *
 * Place a div with `overflow: hidden` around it and spread this onto an
 * absolutely-positioned child (left/top/width/height are pixels):
 *   `<div style={{ position:'absolute', ...gradientFillBox(v, w, h) }} />`
 */
type GradientFillBox = {
    background: string;
    transform: string;
    transformOrigin: string;
    left: number;
    top: number;
    width: number;
    height: number;
};
declare function gradientFillBox(value: GradientValue, boxW: number, boxH: number): GradientFillBox;
/**
 * The color the gradient shows at `position` (0–1), as #rrggbbaa. Interpolated
 * in sRGB with premultiplied alpha so a stop seeded here equals the pixel the
 * user clicked on the ramp (OKLab would visibly mismatch the strip).
 */
declare function colorAtPosition(value: GradientValue, position: number): string;
/**
 * Fail-soft validator for store reconciliation. Anything malformed degrades
 * gracefully: bad object → default; unknown type → linear; non-finite angle →
 * default angle; invalid stops dropped; fewer than MIN_STOPS survivors → the
 * default ramp. Always returns a fresh object safe for store snapshots.
 */
declare function normalizeGradient(input: unknown): GradientValue;
/** Insert a stop at `position`, seeded with the ramp color there. */
declare function addStop(value: GradientValue, position: number): {
    value: GradientValue;
    index: number;
};
/** Reposition a stop; re-sorts (stable), so dragging past a neighbor swaps live. */
declare function moveStop(value: GradientValue, index: number, position: number): {
    value: GradientValue;
    index: number;
};
/** Remove a stop — no-op (same reference) at MIN_STOPS or out of range. */
declare function removeStop(value: GradientValue, index: number): GradientValue;
declare function setStopColor(value: GradientValue, index: number, hex: string): GradientValue;
declare function setGradientType(value: GradientValue, type: GradientType): GradientValue;
declare function setGradientAngle(value: GradientValue, angle: number): GradientValue;
/** Set the radial/conic origin (each 0–100 %). */
declare function setGradientCenter(value: GradientValue, centerX: number, centerY: number): GradientValue;
/** Set the radial extent (10–200 % of the box). */
declare function setGradientScale(value: GradientValue, scale: number): GradientValue;
/** Set the radial ovality (0 = round, up to 100). */
declare function setGradientSquash(value: GradientValue, squash: number): GradientValue;
/** Set the radial ellipse tilt (degrees). Renders via gradientToTransform. */
declare function setGradientRotation(value: GradientValue, rotation: number): GradientValue;

type XYValue = {
    x: number;
    y: number;
};
/** A fully-resolved axis — every field required (see `resolveAxis` for defaults). */
type AxisSpec = {
    min: number;
    max: number;
    step: number;
    /** Value the escapable centre detent snaps to (midpoint for bipolar, else min). */
    origin: number;
    /** When true, the axis has a meaningful centre → enables the centre detent. */
    bipolar: boolean;
};
/**
 * Screen-normalized position: each component in [0,1]. y=0 is the TOP, y=1 is the
 * BOTTOM, so it drops straight into CSS `left: x*100%` / `top: y*100%`.
 */
type Point = {
    x: number;
    y: number;
};
/** Pixel radius of the centre detent's capture band (see `applyDetentAxis`). */
declare const XY_DETENT_PX = 6;
/** Fallback step when an axis omits one. */
declare const XY_DEFAULT_STEP = 0.01;
/**
 * Resolve a partial axis into a fully-specified one. Defaults: min=0, max=1,
 * step=XY_DEFAULT_STEP, bipolar=false. `origin` falls back to the axis midpoint for a
 * bipolar axis (its natural rest/centre) or to `min` otherwise. Never mutates the input.
 */
declare function resolveAxis(axis?: Partial<{
    min: number;
    max: number;
    step: number;
    origin: number;
    bipolar: boolean;
}>): AxisSpec;
/**
 * Snap `v` to the nearest multiple of `step` measured from `min`, then round to the
 * step's precision to kill float dust. A non-positive step means "no grid" → passthrough.
 */
declare function snapToStep(v: number, step: number, min: number): number;
/**
 * Map a value to [0,1] along the axis (0 at min, 1 at max), clamped. A degenerate axis
 * (max===min) has no extent to map into, so it collapses to 0.
 */
declare function valueToNorm(v: number, axis: AxisSpec): number;
/** Inverse of `valueToNorm` (no snapping). `n` is clamped to [0,1] first. */
declare function normToValue(n: number, axis: AxisSpec): number;
/**
 * Flip between screen-y (down) and Cartesian-y (up). This is the ONE place the two
 * y conventions meet — value→point and point→value both route through it.
 */
declare function invertY(n: number): number;
/**
 * Screen point (y-down) → Cartesian value. x maps directly; y is inverted so the top of
 * the pad reads as the axis maximum. Each result is clamped into its axis range, and
 * optionally snapped to the axis step.
 *
 * Corner contract: {x:0,y:1} (bottom-left) → {x:xMin, y:yMin};
 *                  {x:1,y:0} (top-right)   → {x:xMax, y:yMax}.
 */
declare function valueFromPoint(point: Point, xAxis: AxisSpec, yAxis: AxisSpec, snap?: boolean): XYValue;
/**
 * Cartesian value → screen point (inverse of `valueFromPoint`, for CSS positioning).
 * y is inverted so a value at yMax yields point.y=0 (the top of the pad).
 */
declare function pointFromValue(value: XYValue, xAxis: AxisSpec, yAxis: AxisSpec): Point;
/**
 * Escapable centre detent for one axis. While the pointer is within `XY_DETENT_PX` of the
 * origin position, the value sticks to `axis.origin`; move further and the live `value`
 * passes through untouched. Only bipolar axes have a centre to snap to. The component
 * supplies the pixel distance from the origin's screen position.
 */
declare function applyDetentAxis(value: number, axis: AxisSpec, pxFromOrigin: number): number;
/**
 * Nudge one axis by a keyboard step and return a NEW value (the other axis is copied
 * untouched). Cartesian: direction +1 is UP/right → larger value; -1 is down/left. The
 * result is clamped into range and rounded to the step's precision.
 */
declare function nudge(value: XYValue, axis: 'x' | 'y', direction: -1 | 1, xAxis: AxisSpec, yAxis: AxisSpec, mode?: 'fine' | 'normal' | 'coarse'): XYValue;
/**
 * Return-to-centre / joystick rest target: each axis's origin. For a bipolar (or
 * explicit-origin) axis this is the visual centre; a plain non-bipolar 0..1 axis rests
 * at its min, which is the intended behaviour for that case.
 */
declare function centerValue(xAxis: AxisSpec, yAxis: AxisSpec): XYValue;
/**
 * Defensively normalize a possibly-partial/garbage value into a clean in-range XYValue.
 * Missing or non-finite (NaN/±Infinity) components fall back to the axis origin; each is
 * clamped into range and optionally snapped. Negative zero is normalized to 0. The input
 * is never mutated.
 */
declare function normalizeValue(value: Partial<XYValue> | undefined, xAxis: AxisSpec, yAxis: AxisSpec, snap?: boolean): XYValue;

/**
 * The filter control's core — the kit's first 2-slot control. One control,
 * two hands: cutoff on the left, resonance on the right. On the Move it
 * claims two dial slots and draws its magnitude response across both; on
 * the hardware the left column's knob turns cutoff and the right column's
 * knob turns resonance, each an ordinary one-column dial to the bridge.
 *
 * Everything here is framework-free so every surface (the inline panel row,
 * the Move slot, the hardware mapping) answers "what does this filter look
 * like" through one door.
 */
interface FilterAxis {
    min: number;
    max: number;
    step: number;
    /** The small readout's name for this hand. */
    label: string;
    formatValue?: (value: number) => string;
}
interface FilterAxisConfig {
    min?: number;
    max?: number;
    step?: number;
    default?: number;
    label?: string;
    formatValue?: (value: number) => string;
}
interface FilterValue {
    cutoff: number;
    resonance: number;
}
/** A frequency-response sampler: t sweeps the spectrum 0..1, y is 0..1 gain. */
type FilterResponse = (t: number) => number;
declare function resolveFilterAxis(axis: FilterAxisConfig | undefined, hand: 'cutoff' | 'resonance'): FilterAxis;
/**
 * A stored/config value clamped into both axes. Missing hands fall back to
 * a wide-open filter — cutoff at max, resonance at min — the setting that
 * changes the sound least.
 */
declare function normalizeFilterValue(value: unknown, cutoffAxis: FilterAxis, resonanceAxis: FilterAxis): FilterValue;
/** One hand's position 0..1 along its axis. */
declare const filterHand01: (v: number, axis: FilterAxis) => number;
/** A hand position 0..1 back to the axis's real value. */
declare const filterHandValue: (v01: number, axis: FilterAxis) => number;
/** The filter shapes the built-in response can draw — the biquad family. */
type FilterShapeType = 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'peak';
/**
 * The built-in response — a true 2-pole biquad magnitude over a log
 * frequency sweep, on a dB ruler with headroom above unity: the biggest
 * peak Q allows (+20 dB) still fits under the ceiling, so a rising
 * resonance grows the bump instead of flattening it against the top of the
 * band; only the stopband tail meets a hard edge — the floor, where a
 * rolloff belongs. Every shape is its analog prototype's own magnitude,
 * not a lowpass mirrored or averaged into an approximation. Apps with a
 * real DSP engine pass their own `response` so the drawing tells no lies;
 * this one is for configs that just want an honest picture.
 */
declare function filterShapeResponse(type: FilterShapeType, cutoff01: number, resonance01: number): FilterResponse;
/** The lowpass face of `filterShapeResponse` — the shape a bare config gets. */
declare function defaultFilterResponse(cutoff01: number, resonance01: number): FilterResponse;
/** The default response's dB window: floor 36 below unity, ceiling 24 above. */
declare const FILTER_DB_FLOOR = 36;
declare const FILTER_DB_CEIL = 24;
/**
 * The response drawn as an SVG path across a 100×100 box, y pointing up —
 * the 2-slot picture. The sampler's 0..1 gain is taken at its word, never
 * refitted: the window is the sampler's own calibration, so an open filter
 * draws as a line near the top, a rising resonance grows its peak into real
 * headroom, and a rolloff keeps falling past the box's bottom (the display
 * clips the overshoot) instead of bending flat into a kink at the floor.
 * The top holds at the box edge so a peak never escapes upward.
 */
declare function filterResponsePath(response: FilterResponse, samples?: number): string | null;

/** A resolved range value. Invariant (upheld by the helpers): min <= max. */
type RangeValue = {
    min: number;
    max: number;
};
/** Clamp `v` into the inclusive `[lo, hi]` interval. */
declare function clamp(v: number, lo: number, hi: number): number;
/**
 * Position of `v` within `[min, max]` as a 0..100 percentage. When the bounds are
 * degenerate (`max === min`) there is no span to map onto, so return 0 rather than
 * dividing by zero (which would yield NaN/Infinity).
 */
declare function valueToPercent(v: number, min: number, max: number): number;
/** Inverse of {@link valueToPercent}: a 0..1 fraction back to a value in `[min, max]`. */
declare function percentToValue(pct01: number, min: number, max: number): number;
/** Order a pair so `min <= max`, swapping a reversed pair. */
declare function orderRange(v: RangeValue): RangeValue;
/** Clamp both ends into `[min, max]`, then order so `min <= max`. */
declare function clampRange(v: RangeValue, min: number, max: number): RangeValue;
/**
 * Move the low handle to `nextLow`, clamped to `[min, current.max]` so it cannot
 * cross the high handle. Equal handles (zero-width) are allowed.
 */
declare function setLow(nextLow: number, current: RangeValue, min: number): RangeValue;
/**
 * Move the high handle to `nextHigh`, clamped to `[current.min, max]` so it cannot
 * cross the low handle. Equal handles (zero-width) are allowed.
 */
declare function setHigh(nextHigh: number, current: RangeValue, max: number): RangeValue;
/**
 * Shift the whole span by `deltaValue`, preserving its width. When the shift would
 * push the span past an edge, the desired low is clamped to `[min, max - width]`
 * so the entire span parks flush at that edge instead of shrinking.
 */
declare function shiftSpan(deltaValue: number, current: RangeValue, min: number, max: number): RangeValue;
/**
 * Pick the handle nearer to `atValue`. On a tie (or when the handles overlap and
 * distance can't disambiguate) fall back to side: a value below the low handle
 * grabs 'min', otherwise 'max' — so a press to the left of an overlapped pair drags
 * low and a press to the right drags high.
 */
declare function nearestHandle(atValue: number, current: RangeValue): 'min' | 'max';
/**
 * Decide what a pointer-down grabs. A handle gets a grab radius (`hitValue`, in
 * VALUE units) that reaches INTO the span, so a handle parked at its bound — with
 * no empty track outside to press — is still grabbable from just inside the fill.
 * Priority: a press within the grab radius of a handle grabs that handle even
 * inside the span; overlapping zones pick the nearer handle (tie broken by side
 * via nearestHandle); a strictly-interior press outside both zones drags the
 * span; anything else targets the nearer handle.
 */
declare function pickDragTarget(atValue: number, current: RangeValue, hitValue: number): 'min' | 'max' | 'span';
/**
 * True when the press landed on empty track (at or beyond either handle). This is
 * the only case where a plain click (no drag) may jump the nearest handle to the
 * click point; a press inside the span stays a no-op so it can't shrink the range.
 */
declare function isOutsideSpan(atValue: number, current: RangeValue): boolean;
/**
 * CSS `left` strings for the two 2px handle ticks. Each tick is centered on its own
 * value, so a bound at the extreme sits flush with the track edge (the clamps keep the
 * 2px body inside, never half off it). `gap` is the fill width, resolved to px at
 * layout: wide apart the `ramp` is 0, and as the fill shrinks below ~6px the `clamp`
 * ramp grows to 2px, easing the ticks apart so a collapsed range still reads as two
 * handles (± 2px around the point) instead of one thick mark. The ticks never cross.
 * Pure string math — no DOM; CSS min()/max()/clamp() resolve the px/%% mix at layout.
 */
declare function handleLeftStyles(lowPercent: number, highPercent: number): {
    low: string;
    high: string;
};

/**
 * One axis of an XY pad control. Partial — every field falls back through
 * `resolveAxis` (min 0, max 1, step 0.01). `origin`/`bipolar` mirror the
 * Slider's names/semantics, resolved independently per axis.
 */
type XYAxis = {
    min?: number;
    max?: number;
    step?: number;
    origin?: number;
    bipolar?: boolean;
    label?: string;
};
type SpringConfig = {
    type: 'spring';
    stiffness?: number;
    damping?: number;
    mass?: number;
    visualDuration?: number;
    bounce?: number;
};
type EasingConfig = {
    type: 'easing';
    duration: number;
    ease: [number, number, number, number];
};
type TransitionConfig = SpringConfig | EasingConfig;
type ActionConfig = {
    type: 'action';
    /** The button's own text. */
    label?: string;
    /**
     * Text at the left of the row, with the button pushed to the right — the
     * same shape as every other control row. Use it when the button acts ON
     * something the row should name ("kick … [Load]"). Without it the button
     * fills the row and carries the meaning alone.
     */
    caption?: string;
};
type SelectConfig = {
    type: 'select';
    /**
     * An option may name an `icon` from `LUCIDE_ICONS` — the Move slot draws it
     * instead of making you read the mode name off a controller.
     */
    options: (string | {
        value: string;
        label: string;
        icon?: string;
    })[];
    default?: string;
    /** 'segmented' renders the options as an inline segmented control instead of a dropdown. Suits 2–4 short options. */
    display?: 'dropdown' | 'segmented';
    /**
     * The shape an option stands for: `t` in [0,1] → y, auto-fitted and drawn
     * in the Move slot in place of the option's name, which moves to a small
     * tag at the top. Return `null` for options that have no shape.
     *
     * A closure, so — like a curve row's `sample` — it is invisible to the
     * serialized config diff and is refreshed through `syncCurveConfigs`. That
     * is what lets the drawing follow the app's other controls: a pitch arc's
     * preview tracks its bell and flip while the picker stays a picker.
     */
    preview?: (value: string) => ((t: number) => number) | null | undefined;
};
type ColorConfig = {
    type: 'color';
    default?: string;
    /** Enables the alpha slider; the emitted value becomes #rrggbbaa. Default false. */
    alpha?: boolean;
    /** Shows the shared saved-swatches row (persisted per machine). Default false. */
    palette?: boolean;
};
type GradientConfig = {
    type: 'gradient';
    default?: GradientValue;
};
type XYConfig = {
    type: 'xy';
    /** Starting point. Missing/out-of-range components clamp to each axis's origin. */
    default?: XYValue;
    /** Per-axis range/step/origin. Each resolves through `resolveAxis`. */
    x?: XYAxis;
    y?: XYAxis;
    /** Grid overlay — on by default as a 5×5 grid (faint at rest, stronger on interaction). `false` to hide, or a number for a uniform N×N count. */
    grid?: boolean | number;
    /** Multiplies both grid axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density?: number;
    /** Snap the emitted value to each axis's step (default continuous). */
    snap?: boolean;
    /** Spring the thumb back to centre on release (joystick feel). Default hold. */
    returnToCenter?: boolean;
    /** Show the live value next to each axis label (default false = label only). */
    showValues?: boolean;
};
type TextConfig = {
    type: 'text';
    default?: string;
    placeholder?: string;
};
/**
 * The 2-slot filter control: one value, two hands — cutoff on the left,
 * resonance on the right. On the Move it claims two dial slots and draws
 * its magnitude response across both; inline it is one row for the same
 * pair. `response` is a closure like a curve row's `sample` (refreshed
 * through `syncCurveConfigs`); without one the kit draws its own lowpass.
 */
type FilterConfig = {
    type: 'filter';
    /** Starting point. Missing hands open the filter: cutoff max, resonance min. */
    default?: Partial<FilterValue>;
    cutoff?: FilterAxisConfig;
    resonance?: FilterAxisConfig;
    /** The drawn magnitude response, from each hand's 0..1 position. */
    response?: (cutoff01: number, resonance01: number) => (t: number) => number;
    /**
     * `false` draws the control bypassed — the curve still shows (so the slot
     * reads as a filter, not an empty display) but greyed out, the way a
     * disabled module dims. Defaults to on.
     */
    enabled?: boolean;
};
type RangeConfig = {
    type: 'range';
    min: number;
    max: number;
    /** Falls back to the full span { min, max } when omitted. */
    default?: RangeValue;
    /** Falls back to inferStep(min, max) when omitted. */
    step?: number;
};
/**
 * Explicit slider form for what the `[default, min, max, step?]` tuple can't
 * express: a display unit, a custom value formatter, or a bipolar fill.
 */
type SliderConfig = {
    type: 'slider';
    default: number;
    min: number;
    max: number;
    /** Falls back to inferStep(min, max) when omitted. */
    step?: number;
    /** Appended to the displayed value, e.g. ' dB', ' ms', '×'. */
    unit?: string;
    /**
     * Override the displayed value text entirely; `unit` is not auto-appended.
     * A function, so it is invisible to the JSON structure diff — changing only
     * the formatter does not re-register the panel.
     */
    formatValue?: (value: number) => string;
    /** Anchor the fill at this value instead of `min` (see Slider). */
    origin?: number;
    /** Convenience for `origin: 0` on a symmetric range. */
    bipolar?: boolean;
    /** `vertical` renders the column card (fill grows bottom-up, label at base). */
    orientation?: 'horizontal' | 'vertical';
};
/**
 * Scrub-anywhere numeric readout. Unlike a slider it has no track — drag the
 * card to nudge the value, click to type — and bounds are optional, so it is
 * the control for open-ended quantities (dB trims, sample offsets, seeds).
 */
type NumberConfig = {
    type: 'number';
    default: number;
    min?: number;
    max?: number;
    /** Falls back to a step inferred from `default`'s precision when omitted. */
    step?: number;
    /** Appended to the displayed value, e.g. ' dB', ' ms', '×'. */
    unit?: string;
    /** Override the displayed value text entirely; `unit` is not auto-appended. */
    formatValue?: (value: number) => string;
    /** `vertical` stacks the label above a centered value (column card). */
    orientation?: 'horizontal' | 'vertical';
};
/**
 * A read-only curve preview row. Draws the shape the host's own parameters
 * produce (e.g. a pitch arc from a shape select plus modifier sliders); it
 * holds no value of its own, so nothing lands in ResolvedValues, presets, or
 * persistence. `sample` is a function and therefore invisible to the
 * serialized config diff (like `formatValue`); adapters push replacements
 * through `TweakStore.syncCurveConfigs` so the drawing tracks the host.
 */
type CurveConfig = {
    type: 'curve';
    /** t in [0,1] → y. Non-finite results are skipped (the stroke breaks there). */
    sample: (t: number) => number;
    /** Fixed y-range to fit. Default: auto-fit each draw with a little headroom. */
    domain?: [number, number];
    /** Vertical reference lines at these x positions in [0,1]; invalid entries are skipped. */
    markers?: readonly number[];
    /** Surface height in px, clamped to 32–160. Default 64. Ignored when `aspect` is set. */
    height?: number;
    /**
     * Width ÷ height. Sizes the surface from its own width instead of `height`,
     * so the plot holds its proportions at any column width — what a transfer
     * curve wants, since its two axes share a scale. `1` is square, `4 / 3` a
     * little wider than tall.
     */
    aspect?: number;
    /** `false` = full-bleed row without the label line; a string overrides the key-derived label. */
    label?: false | string;
};
/**
 * A read-only live-analyser row: the panel-embedded form of the standalone
 * `AnalyserVisualization`. Like the curve row it holds no value — nothing
 * lands in ResolvedValues, presets, or persistence — and its function-valued
 * fields (`analyser`, `marker`) are invisible to the serialized config diff,
 * so adapters keep them fresh through `TweakStore.syncCurveConfigs`.
 */
type AnalyserConfig = {
    type: 'analyser';
    /** The live AnalyserNode, read at render — a getter so the host can hand it over late (audio contexts start on gesture). */
    analyser: () => AnalyserNode | null;
    /** 'frequency' (default) — live spectrum. 'waveform' — oscilloscope. */
    source?: 'frequency' | 'waveform';
    variant?: 'line' | 'area';
    /** 'pixelated' (default here — the panel's block language) or 'smooth'. */
    mode?: 'smooth' | 'pixelated';
    pixelSize?: number;
    scale?: 'log' | 'linear';
    spring?: boolean | {
        stiffness?: number;
        damping?: number;
    };
    /** Spectrum only: confine the display to this frequency window in Hz. */
    rangeHz?: readonly [number, number];
    /** Spectrum only: a live vertical reference in Hz, read every frame. */
    marker?: () => number | null;
    /** Surface height in px, clamped like the curve row's. Default 56. */
    height?: number;
    /** `false` = full-bleed row without the label line; a string overrides the key-derived label. */
    label?: false | string;
};
type FileConfig = {
    type: 'file';
    /** Native input `accept` filter, e.g. 'image/*' or '.svg,image/svg+xml'. */
    accept?: string;
    multiple?: boolean;
};
type SwatchOption = {
    value: string;
    label: string;
    /** One color renders a chip; many render a thin strip preview. */
    colors: string[];
};
type SwatchConfig = {
    type: 'swatch';
    options: SwatchOption[];
    default?: string;
};
type ChipOption = {
    value: string;
    label: string;
    /** Removable chips show an ✕ and emit a `remove` event (curated stay; saved go). */
    removable?: boolean;
};
type ChipsConfig = {
    type: 'chips';
    options: ChipOption[];
    default?: string;
};
type MultiSelectOption = {
    value: string;
    label: string;
    /** One quiet line under the label — e.g. what the option contains. */
    hint?: string;
    /** Tiny uppercase badge next to the label — e.g. 'local' / 'cloud'. */
    tag?: string;
};
/** Checkbox rows resolving to the checked values, in option order. */
type MultiSelectConfig = {
    type: 'multiselect';
    options: MultiSelectOption[];
    default?: string[];
};
type GalleryItem = {
    id: string;
    src?: string;
    alt?: string;
    /** Width / height hint used to size custom (non-image) content in the masonry. */
    aspect?: number;
    render?: () => unknown;
};
type GalleryConfig = {
    type: 'gallery';
    items: GalleryItem[];
    default?: string;
    columns?: number;
};
/**
 * One row in a list control — a chosen item type plus its sub-control values.
 * Stays JSON-serializable: `params` holds only scalars, never live objects.
 */
type ListItemValue = {
    type: string;
    params: Record<string, number | boolean | string>;
    /**
     * Row-level name, shown in place of the item type's label and renamable in
     * place. Absent (never empty) when the row has no name of its own.
     */
    title?: string;
};
/**
 * A sub-control field inside a list item type's schema. Uses the same shorthand
 * as a panel config, but scalar-only (no nested folders or non-value controls).
 */
type ListItemField = [number, number, number, number?] | number | boolean | string | SelectConfig | ColorConfig | SwatchConfig | TextConfig;
type ListItemType = {
    /** Shown in the add menu, and as a row's title when the row has none of its own. */
    label: string;
    /** Sub-controls for this item type, keyed by param name. */
    schema: Record<string, ListItemField>;
    /**
     * Help text per field, keyed by the same param name. Keyed rather than inline
     * because a schema field is often bare shorthand (`mass: [1, 0, 10]`) with
     * nowhere to hang a property.
     */
    hints?: Record<string, string>;
    /**
     * Section per field, keyed by param name, for rows too deep to read flat.
     * Ungrouped fields stay at the top of the row; each named section becomes a
     * collapsible folder below them, in the order its first field is declared.
     * Keyed for the same reason as `hints`.
     */
    groups?: Record<string, string>;
};
type ListConfig = {
    type: 'list';
    /** The palette of item types a user can add. */
    itemTypes: Record<string, ListItemType>;
    /** Initial rows. Each item's params backfill from its type's schema defaults. */
    default?: ListItemValue[];
    /** Optional cap on the number of rows. */
    max?: number;
    /** Label for the add affordance. Defaults to 'Add'. */
    addLabel?: string;
};
/** A resolved sub-control descriptor for one list-item field. */
type ListFieldKind = 'slider' | 'toggle' | 'select' | 'color' | 'swatch' | 'text';
type ListField = {
    key: string;
    label: string;
    kind: ListFieldKind;
    hint?: string;
    /** Section this field belongs to, or absent for the row's flat top area. */
    group?: string;
    /** Colour fields only: show the shared saved-swatches row, as at top level. */
    palette?: boolean;
    /** Swatch fields only: the named palettes to choose between. */
    swatchOptions?: SwatchOption[];
    min?: number;
    max?: number;
    step?: number;
    options?: (string | {
        value: string;
        label: string;
    })[];
    placeholder?: string;
    defaultValue: number | boolean | string;
};
type TweakValue = number | boolean | string | string[] | XYValue | SpringConfig | EasingConfig | ActionConfig | SelectConfig | SliderConfig | NumberConfig | ColorConfig | GradientConfig | GradientValue | XYConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | MultiSelectConfig | ListConfig | ListItemValue[] | RangeConfig | RangeValue | FilterConfig | FilterValue;
type TweakConfig = {
    [key: string]: TweakValue | [number, number, number, number?] | CurveConfig | AnalyserConfig | TweakConfig;
};
/** UI-only reserved keys: they shape the panel, never resolve to a value. */
type ReservedKey = '_collapsed' | '_collapsible' | '_tabs';
type ResolvedValues<T extends TweakConfig> = {
    [K in keyof T as T[K] extends CurveConfig ? never : K extends ReservedKey ? never : K]: T[K] extends [number, number, number, number?] ? number : T[K] extends SliderConfig ? number : T[K] extends NumberConfig ? number : T[K] extends MultiSelectConfig ? string[] : T[K] extends SpringConfig ? TransitionConfig : T[K] extends EasingConfig ? TransitionConfig : T[K] extends SelectConfig ? string : T[K] extends ColorConfig ? string : T[K] extends GradientConfig ? GradientValue : T[K] extends XYConfig ? XYValue : T[K] extends TextConfig ? string : T[K] extends RangeConfig ? RangeValue : T[K] extends FilterConfig ? FilterValue : T[K] extends GalleryConfig ? string : T[K] extends FileConfig ? string : T[K] extends SwatchConfig ? string : T[K] extends ChipsConfig ? string : T[K] extends ListConfig ? ListItemValue[] : T[K] extends TweakConfig ? ResolvedValues<T[K]> : T[K];
};
type ShortcutMode = 'fine' | 'normal' | 'coarse';
type ShortcutInteraction = 'scroll' | 'drag' | 'move' | 'scroll-only';
type ShortcutConfig = {
    key?: string;
    modifier?: 'alt' | 'shift' | 'meta';
    mode?: ShortcutMode;
    interaction?: ShortcutInteraction;
};
/**
 * How lit the affordance dot is. The app pushes this — tweakers owns only how
 * each state looks, never when it applies.
 */
type AffordanceStatus = 'off' | 'armed' | 'active';
/** What tweakers hands a popover so it doesn't have to resolve any of it itself. */
type AffordanceContext = {
    panelId: string;
    path: string;
    status: AffordanceStatus;
    /** Shorthand for `TweakStore.setAffordanceStatus(panelId, path, …)`. */
    setStatus: (status: AffordanceStatus) => void;
};
/**
 * A companion control hung off a control's corner: a barely-there dot that opens
 * a popover the host app fills.
 *
 * `content` is a component — a React/Solid/Vue component or a Svelte snippet —
 * receiving the context as its props/argument. Not a pre-built node: it is
 * captured once at registration and would never see current state. Not called
 * directly by the renderer either, so a stateful popover keeps its own identity
 * and its own hooks. This is also why affordances travel as a panel option
 * rather than in the config: the config is JSON-serialized on every render to
 * detect structure changes, and view code would not survive that.
 */
type AffordanceConfig = {
    content: (ctx: AffordanceContext) => unknown;
    /** Accessible name for the dot and its popover. Defaults to 'Options'. */
    label?: string;
};
type ControlMeta = {
    type: 'slider' | 'number' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'gradient' | 'xy' | 'text' | 'range' | 'gallery' | 'file' | 'swatch' | 'chips' | 'multiselect' | 'list' | 'curve' | 'analyser' | 'filter';
    path: string;
    label: string;
    /** One line of help, revealed on hover or when focus lands inside the control. */
    hint?: string;
    /** Companion control reachable from a dot in the control's bottom-right corner. */
    affordance?: AffordanceConfig;
    min?: number;
    max?: number;
    step?: number;
    /** Range control's configured reset target — its `default`, else the full {min,max} span. */
    rangeDefault?: RangeValue;
    children?: ControlMeta[];
    defaultOpen?: boolean;
    /** Folder declared `_enabled` — renders as a module whose header switch drives `<path>._enabled`. */
    module?: boolean;
    /** Folder declared `_collapsible: false` — plain section header, no caret, body always open. */
    collapsible?: boolean;
    /** Action declared a `caption` — the row names what the button acts on. */
    caption?: string;
    /** Top-level folder under a `_tabs` root — it is a tab, and its children are that tab's page. */
    tab?: boolean;
    /** The synthetic segmented select driving `_tab` — it renders as the panel's tab bar, never as a row. */
    tabBar?: boolean;
    options?: (string | {
        value: string;
        label: string;
        icon?: string;
    })[];
    /** Select's per-option shape sampler — swapped in place by syncCurveConfigs. */
    preview?: (value: string) => ((t: number) => number) | null | undefined;
    /** Select's rendering mode, from the SelectConfig form. */
    display?: 'dropdown' | 'segmented';
    placeholder?: string;
    items?: GalleryItem[];
    columns?: number;
    accept?: string;
    multiple?: boolean;
    swatchOptions?: SwatchOption[];
    chipOptions?: ChipOption[];
    multiSelectOptions?: MultiSelectOption[];
    /** Slider display unit, from the explicit SliderConfig form. */
    unit?: string;
    /** Slider display formatter, from the explicit SliderConfig form. */
    formatValue?: (value: number) => string;
    /** Slider fill anchor, from the explicit SliderConfig form. */
    origin?: number;
    bipolar?: boolean;
    /** Slider/number layout, from the explicit config forms. */
    orientation?: 'horizontal' | 'vertical';
    itemTypes?: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    alpha?: boolean;
    palette?: boolean;
    /** XY pad axes/options — carried through to the XYControl. */
    xAxis?: XYAxis;
    yAxis?: XYAxis;
    grid?: boolean | number;
    density?: number;
    snap?: boolean;
    returnToCenter?: boolean;
    showValues?: boolean;
    /** Filter control's per-hand range/step/label/format. */
    cutoffAxis?: FilterAxisConfig;
    resonanceAxis?: FilterAxisConfig;
    /** Filter control's drawn magnitude response — swapped in place by syncCurveConfigs. */
    response?: (cutoff01: number, resonance01: number) => (t: number) => number;
    /** Filter control declared `enabled: false` — the slot draws bypassed (dimmed). */
    filterEnabled?: boolean;
    /** Curve preview's host-supplied sampler — swapped in place by syncCurveConfigs. */
    sample?: (t: number) => number;
    /** Curve preview's fixed y-range; absent = auto-fit per draw. */
    domain?: [number, number];
    /** Curve preview's vertical reference marker positions — kept fresh by syncCurveConfigs. */
    markers?: readonly number[];
    /** Curve preview's surface height in px (renderers clamp via clampCurveHeight). */
    height?: number;
    /** Curve preview's width ÷ height — the surface follows its own width. */
    aspect?: number;
    /** Curve preview declared `label: false` — full-bleed row without the label line. */
    hideLabel?: boolean;
    /** Analyser row's whole config — swapped in place by syncCurveConfigs, like `sample`. */
    analyserRow?: AnalyserConfig;
    shortcut?: ShortcutConfig;
};
/** Flat-value path holding a `_tabs` panel's active tab — the key of that tab's folder. */
declare const TAB_PATH = "_tab";
type PanelConfig = {
    id: string;
    name: string;
    controls: ControlMeta[];
    values: Record<string, TweakValue>;
    shortcuts: Record<string, ShortcutConfig>;
    /** Help text by control path, retained so a later updatePanel can restate it. */
    hints?: Record<string, string>;
    /** Affordances by control path, retained on the same terms as `hints`. */
    affordances?: Record<string, AffordanceConfig>;
    /** Label overrides by control path, retained on the same terms as `hints`. */
    labels?: Record<string, string>;
    /** Move pad columns by control path, retained on the same terms as `hints`. */
    movePads?: Record<string, number>;
    /**
     * Config declared `_enabled` at its root — the whole panel is a module, and
     * its title carries the switch. Same idiom as a module folder, one level up.
     */
    module?: boolean;
    kind?: 'timeline' | 'modulation';
};
type Listener$4 = () => void;
type ActionListener = (action: string) => void;
/**
 * Non-value events emitted by controls (file picked, chip removed, list mutated).
 * Delivered through the generic `onEvent(path, event)` channel so the value layer
 * stays JSON-serializable (a File is never stored — it rides on a file event).
 */
type TweakEvent = {
    kind: 'file';
    files: FileList;
} | {
    kind: 'remove';
    value: string;
} | {
    kind: 'list';
    op: 'add' | 'remove' | 'move' | 'set' | 'rename';
    index?: number;
    from?: number;
    to?: number;
    itemType?: string;
};
type EventListener = (path: string, event: TweakEvent) => void;
type Preset = {
    id: string;
    name: string;
    values: Record<string, TweakValue>;
};
type PresetProviderPreset = {
    id: string;
    label: string;
    /** Read-only rows (e.g. factory presets) show no delete affordance. */
    readonly?: boolean;
};
/**
 * Host-owned backing for the panel toolbar's preset UI. When a provider is set
 * the toolbar renders the host's list instead of the built-in snapshots: the
 * store never captures or restores values itself — the host applies them in
 * `onSelect` (e.g. via `TweakStore.updateValues`) and owns persistence. The
 * stock auto-save-to-active-preset behavior is off because the store's own
 * active-preset state is never engaged in provider mode.
 */
type PresetProvider = {
    presets: PresetProviderPreset[];
    activeId?: string | null;
    onSelect(id: string): void | Promise<void>;
    /** "+" pressed; receives a suggested label ("Preset N"). */
    onCreate(suggestedLabel: string): void | Promise<void>;
    /** Omit to hide the delete affordance entirely. */
    onDelete?(id: string): void | Promise<void>;
    /** Inline rename committed; omit to hide the rename affordance entirely. */
    onRename?(id: string, name: string): void | Promise<void>;
};
/**
 * What the toolbar renders per dropdown row — one shape for both modes, so the
 * framework components never branch on where a preset came from.
 */
type PresetItem = {
    id: string;
    name: string;
    deletable: boolean;
    renamable: boolean;
};
type TweakersPersistOptions = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};
type TweakStorePanelOptions = {
    retainOnUnmount?: boolean;
    persist?: TweakersPersistOptions;
    /**
     * Help text by control path — the same keying as `shortcuts`. Keyed rather
     * than declared inline because most controls are bare shorthand
     * (`gravity: [9.8, 0, 20]`) with nowhere to hang a property.
     */
    hints?: Record<string, string>;
    /**
     * Companion controls by control path. Holds framework view nodes, so — unlike
     * the config — this is never serialized.
     */
    affordances?: Record<string, AffordanceConfig>;
    /**
     * Display label by control path, overriding the name derived from the config
     * key. Keyed for the same reason as `hints`: the controls that most need a
     * label the key can't express are bare shorthand (`a: [0, 0, 1]` relabelled
     * per mode) with nowhere to hang a property. Applies to folders too.
     *
     * Without this, changing a control's visible text means changing its config
     * key — which silently changes its identity, so it loses its value, its
     * persisted entry and its shortcut binding.
     */
    labels?: Record<string, string>;
    /**
     * Which Move pad column a control sits in, by control path (0-7) — the
     * page's hand-authored hardware layout. Without it the surface packs pads
     * left to right, which is fine for a page whose pads happen to belong to
     * the leftmost dials and wrong for every other page. With it, a pad sits
     * under the dial it belongs to: toggles take the toggle row, bounded
     * numbers the value row (leaving the dial pool however few dials the page
     * has), actions the row under those.
     */
    movePads?: Record<string, number>;
    /** Timeline panels render in TweakTimeline; modulation panels are the Move's
     * modulator settings pages — both are filtered out of the panel dock. */
    kind?: 'timeline' | 'modulation';
};
/**
 * DOM id for a control's hint tooltip. `aria-describedby` holds a space-separated
 * list of ids, so any whitespace — panel names and list labels are free text —
 * would silently split one reference into two dangling ones.
 */
declare function hintDomId(scope: string, path: string): string;
declare class TweakStoreClass {
    private panels;
    private listeners;
    private globalListeners;
    private snapshots;
    private actionListeners;
    private eventListeners;
    private affordanceStatus;
    private disabledPaths;
    private controlStateListeners;
    private presets;
    private activePreset;
    private presetProviders;
    /** Panels whose header carries no preset toolbar (see setPresetsHidden). */
    private presetsHidden;
    private baseValues;
    private persistTargets;
    registerPanel(id: string, name: string, config: TweakConfig, shortcuts?: Record<string, ShortcutConfig>, options?: TweakStorePanelOptions): void;
    updatePanel(id: string, name: string, config: TweakConfig, shortcuts?: Record<string, ShortcutConfig>, options?: TweakStorePanelOptions): void;
    unregisterPanel(id: string): void;
    private overlayPersistedValues;
    private savePanelValues;
    updateValue(panelId: string, path: string, value: TweakValue): void;
    updateValues(panelId: string, updates: Record<string, TweakValue>): void;
    updateSpringMode(panelId: string, path: string, mode: 'simple' | 'advanced'): void;
    getSpringMode(panelId: string, path: string): 'simple' | 'advanced';
    updateTransitionMode(panelId: string, path: string, mode: 'easing' | 'simple' | 'advanced'): void;
    getTransitionMode(panelId: string, path: string): 'easing' | 'simple' | 'advanced';
    getValue(panelId: string, path: string): TweakValue | undefined;
    getValues(panelId: string): Record<string, TweakValue>;
    getPanels(kind?: 'panel' | 'timeline'): PanelConfig[];
    /**
     * The settings panels a root should draw, given its optional `panels` filter.
     * `undefined` means every panel — the single-surface default. A list means
     * exactly those names, in the order named, so two roots never fight over the
     * same panel and a panel that has not registered yet leaves a gap that fills
     * when it does.
     */
    selectPanels(only?: string | string[]): PanelConfig[];
    getPanel(id: string): PanelConfig | undefined;
    subscribe(panelId: string, listener: Listener$4): () => void;
    subscribeGlobal(listener: Listener$4): () => void;
    subscribeActions(panelId: string, listener: ActionListener): () => void;
    triggerAction(panelId: string, path: string): void;
    subscribeEvents(panelId: string, listener: EventListener): () => void;
    emitEvent(panelId: string, path: string, event: TweakEvent): void;
    /**
     * How lit a control's affordance dot is. Callers may push this as often as
     * they like — an unchanged status is dropped without notifying, so driving it
     * from an audio callback costs nothing.
     */
    setAffordanceStatus(panelId: string, path: string, status: AffordanceStatus): void;
    getAffordanceStatus(panelId: string, path: string): AffordanceStatus;
    /**
     * Greys a control out and stops it responding. Runtime-only by design: a
     * config default plus a runtime override would be two sources of truth, and
     * calling this once covers the static case.
     */
    setDisabled(panelId: string, path: string, disabled: boolean): void;
    isDisabled(panelId: string, path: string): boolean;
    /** One channel for every app-pushed presentation change on a panel. */
    subscribeControlState(panelId: string, listener: Listener$4): () => void;
    private notifyControlState;
    /**
     * Refresh curve rows' host-supplied presentation (sample function + markers)
     * in place. Functions drop out of the serialized config diff (the
     * `formatValue` precedent), so a host that rebuilds its config per render
     * would otherwise leave the preview drawing a stale closure; markers ride the
     * same sync so the whole curve row stays one coherent refresh. Adapters call
     * this after every render — the same contract as setPresetProvider — and only
     * an actual change (function identity, marker values) notifies, on the
     * control-state channel: curve rows are presentation, and the value snapshot
     * must not churn (a new snapshot would re-render the host, whose rebuilt
     * closure would notify again, forever). Markers are compared by value, not
     * identity, because a per-render rebuild remakes the array every time.
     */
    syncCurveConfigs(panelId: string, config: TweakConfig): void;
    savePreset(panelId: string, name: string): string;
    loadPreset(panelId: string, presetId: string): void;
    deletePreset(panelId: string, presetId: string): void;
    getPresets(panelId: string): Preset[];
    getActivePresetId(panelId: string): string | null;
    clearActivePreset(panelId: string): void;
    /**
     * Install (or clear) a host-owned preset provider. Safe to call on every
     * host render: the object is always swapped so `onSelect`/`onCreate`/
     * `onDelete` never close over stale host state, but listeners are only
     * notified when the visible data (list, active id) actually changed.
     */
    setPresetProvider(panelId: string, provider: PresetProvider | null | undefined): void;
    getPresetProvider(panelId: string): PresetProvider | null;
    /**
     * Hide (or restore) a panel's preset toolbar. For the secondary panels of a
     * multi-panel app — a rack of per-voice columns, say — where a snapshot
     * means the whole instrument and so belongs to one panel only. Hiding the
     * toolbar hides its add and copy buttons with it: the header of a panel that
     * does not own presets is bare.
     */
    setPresetsHidden(panelId: string, hidden: boolean): void;
    arePresetsHidden(panelId: string): boolean;
    /** Provider mode hides the implicit "Version 1" base row — the host owns the whole list. */
    hasPresetProvider(panelId: string): boolean;
    /** The dropdown rows in host order, from the provider when one is set. */
    getPresetItems(panelId: string): PresetItem[];
    /**
     * Row clicked. Stock mode loads the snapshot (null = back to base values);
     * provider mode hands the id to the host, which applies values itself.
     */
    selectPreset(panelId: string, presetId: string | null): void;
    /**
     * "+" pressed. Stock mode snapshots into "Version N" (N counts the implicit
     * base as version 1); provider mode suggests the matching "Preset N" label.
     */
    createPreset(panelId: string): void;
    /** Trash icon pressed on a row (only rendered when the item is deletable). */
    removePreset(panelId: string, presetId: string): void;
    /** Rename a preset (toolbar inline edit). Provider mode hands the new name
     * to the host; stock mode edits the store's own snapshot list. */
    renamePreset(panelId: string, presetId: string, name: string): void;
    resolveShortcutTarget(key: string, modifier?: 'alt' | 'shift' | 'meta'): {
        panelId: string;
        path: string;
        control: ControlMeta;
    } | null;
    resolveScrollOnlyTargets(): Array<{
        panelId: string;
        path: string;
        control: ControlMeta;
        shortcut: ShortcutConfig;
    }>;
    private findControlByPath;
    private notify;
    private notifyGlobal;
    private initTransitionModes;
    private parseConfig;
    /**
     * Swaps a panel's whole value map, keeping the open tab. Which tab you are
     * reading is a place, not a parameter: a preset should change the sound, not
     * move you to another page of the panel.
     */
    private replaceValues;
    /**
     * Seeds the active tab. It is a real value, not component state, so a config
     * rebuild preserves the reader's place — and `normalizePreservedValue` resets
     * it through the select's options when the tab it named is gone.
     */
    private initTabValue;
    private flattenValues;
    private isSpringConfig;
    private isEasingConfig;
    private isActionConfig;
    private isSelectConfig;
    private isColorConfig;
    private isGradientConfig;
    private isXYConfig;
    private isFilterConfig;
    private isRangeConfig;
    private isRangeValue;
    private isTextConfig;
    private isGalleryConfig;
    private isFileConfig;
    private isSwatchConfig;
    private isChipsConfig;
    private isMultiSelectConfig;
    private isSliderConfig;
    private isNumberConfig;
    private isAnalyserConfig;
    private isCurveConfig;
    private isListConfig;
    private isHexColor;
    private formatLabel;
    private inferRange;
    private inferStep;
    private normalizePreservedValue;
    private roundToStep;
    private stepPrecision;
    private applyControlExtras;
    private mapControlsByPath;
}
/** Resolve a list item type's schema shorthand into renderable field descriptors. */
declare function parseListItemSchema(schema: Record<string, ListItemField>, hints?: Record<string, string>, groups?: Record<string, string>): ListField[];
/** A named, collapsible section of a list row. */
type ListFieldGroup = {
    label: string;
    fields: ListField[];
};
/**
 * Split a row's fields into the flat top area and its named sections.
 *
 * Ungrouped fields stay flat so a row's primary control is always visible;
 * groups follow in the order their first field is declared, which is what the
 * renderer opens the first of and collapses the rest.
 */
declare function groupListFields(fields: ListField[]): {
    flat: ListField[];
    groups: ListFieldGroup[];
};
/** The default params object for a freshly-added item of the given schema. */
declare function defaultListItemParams(schema: Record<string, ListItemField>): Record<string, number | boolean | string>;
/** Materialize a list config's initial rows: drop unknown types, backfill params. */
declare function normalizeListItems(config: ListConfig): ListItemValue[];
declare const TweakStore: TweakStoreClass;

interface UseTweakersOptions {
    onAction?: (action: string) => void;
    /** Non-value events: file picked, chip removed, list mutated. */
    onEvent?: (path: string, event: TweakEvent) => void;
    shortcuts?: Record<string, ShortcutConfig>;
    /** One line of help per control path, revealed on hover or keyboard focus. */
    hints?: Record<string, string>;
    /** Companion controls per control path, opened from a dot in the corner. */
    affordances?: Record<string, AffordanceConfig>;
    /** Display label by control path, overriding the key-derived name. */
    labels?: Record<string, string>;
    /**
     * Which Move pad column each pad control sits in, by control path (0-7) —
     * the page's hand-authored hardware layout, so a pad sits under the dial it
     * belongs to instead of packing left.
     */
    movePads?: Record<string, number>;
    /**
     * Host-owned backing for the toolbar's preset UI. The toolbar renders this
     * list instead of the built-in localStorage snapshots; the host applies
     * values in `onSelect` and owns persistence (see PresetProvider).
     *
     * `false` leaves this panel's header bare of the toolbar altogether — for
     * the secondary panels of a multi-panel app, where a snapshot means the
     * whole instrument and so belongs to one panel only.
     */
    presets?: PresetProvider | false;
}
declare function useTweakers<T extends TweakConfig>(name: string, config: T, options?: UseTweakersOptions): ResolvedValues<T>;

type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type TweakMode = 'popover' | 'inline';
/** `card` is the panel's glass surface; `none` puts the rows straight on the host's ground. */
type TweakChrome = 'card' | 'none';
type TweakTheme = 'light' | 'dark' | 'system';
interface TweakRootProps {
    position?: TweakPosition;
    defaultOpen?: boolean;
    mode?: TweakMode;
    theme?: TweakTheme;
    productionEnabled?: boolean;
    /**
     * Render only the named panels, in the order given. For apps that place
     * more than one panel surface in more than one place — a rack of per-voice
     * columns beside a global panel, say. Omitted, a root renders every
     * registered panel, which is the single-surface default.
     */
    panels?: string | string[];
    /**
     * `none` drops the panel card — no glass, no border, no radius, no padding —
     * so the rows sit directly on the host's own surface. For app chrome that
     * already provides the ground the panel would otherwise float on.
     */
    chrome?: TweakChrome;
}
declare function TweakRoot({ position, defaultOpen, mode, theme, productionEnabled, panels: only, chrome }: TweakRootProps): react_jsx_runtime.JSX.Element | null;

interface MovePanelProps {
    theme?: TweakTheme;
    productionEnabled?: boolean;
    /** Mirror only the named panels, in the order given — same option the bridge kit takes. */
    panels?: string | string[];
    /**
     * Where the panel sits. `viewport` (the default) portals it to `<body>` and
     * pins it to the window's bottom edge — for apps whose content fills the
     * screen. `flow` renders it inline, in normal document flow, wherever the
     * host puts it — for sparse apps that want the content and the panel to
     * read as one group instead of leaving a dead gap between them.
     */
    dock?: 'viewport' | 'flow';
}
/**
 * The Move's control surface, laid out to Cri's Figma spec (file
 * USU9CW2vC3SrvKsnHVnYGi, node 802:319; slot components 802:756 and
 * 800:1737): a track row of coloured markers — one per page, so an app
 * with a single panel gets a single tick and name — 8 dial slots hosting
 * slider ports, and the pad grid — toggle chips on the first row, value
 * chips on the second, at the same columns as their hardware pads
 * (move-layout keeps both surfaces in agreement).
 *
 * `dock` decides where it lives: `viewport` portals it to `<body>` and pins
 * it to the window's bottom edge; `flow` leaves it inline where the host
 * placed it. Both wear the same surface, padding and slot geometry.
 *
 * Only occupied slots/columns are shown: a column renders when it holds a
 * dial, a toggle chip, or a value chip, at its full 8-wide slot size; the
 * visible cluster centres in the panel and the header row shares its width,
 * so the page name lines up with the first visible slot. Hidden columns
 * are skipped, never renumbered — column i is still hardware knob i.
 *
 * Value chips substitute the dial in their column: hold one to peek at
 * its value in the dial slot, tap to latch it in — the chip inverts and
 * pulses until tapped again. The same gestures on the physical pads
 * arrive through the kit's override event and read identically here.
 *
 * An xy control takes a dial slot as a 2D pad: the field draws behind the
 * label (no slider at the bottom) with crosshair lines meeting at the dot.
 * Dragging the slot sets both axes; on the hardware the column's knob
 * turns X, and the volume knob turns Y while that knob is touched.
 *
 * A range control takes a dial slot too: the bar fills between two handle
 * ticks, and a drag grabs the nearest handle. On the hardware the column's
 * knob edits the low handle and the volume knob edits the high one while
 * that knob is touched — the xy pad's two-handed concept on one axis.
 * Bipolar/origin sliders anchor their fill at the origin mark.
 *
 * A select with options takes a dial slot as a stepped enum dial: the bar
 * splits into one cell per option, the active cell filled, and the readout
 * shows the option's label. A drag picks the nearest cell.
 *
 * Holding Shift mid-drag switches any slot to fine mode: pointer travel
 * applies at 0.1× relative to where shift went down, and releasing shift
 * rebases at 1× so the value never jumps.
 *
 * Controls wired to a modulation slot wear that slot's colour as a dot, and
 * the track row carries one circle per slot — the on-screen step button.
 */
declare function MovePanel({ theme, productionEnabled, panels: only, dock }: MovePanelProps): react_jsx_runtime.JSX.Element | null;

interface MoveActionButtonProps {
    /**
     * The hardware button this action rides, which fixes the styling:
     * `enter` is the wheel's click — track 4's green with the dot glyph —
     * `capture` is the capture button — track 1's blue with the
     * four-corners glyph — and `shift` is the shift key — the surface's
     * light neutral, wearing the same dot in the pill's dark text colour.
     * The pairing matches the physical Move, so the on-screen button
     * always looks like the key that triggers it.
     * Shift is reserved on the hardware and never claimable, so
     * `kind="shift"` is purely visual: it runs no Move function, only its
     * own `onPress` — the app wires the hardware gesture (a shift tap)
     * itself.
     */
    kind: 'enter' | 'capture' | 'shift';
    /** The label. */
    children: React__default.ReactNode;
    /** Runs after the attached Move function, on a screen click. */
    onPress?: () => void;
    disabled?: boolean;
    className?: string;
}
/**
 * A free-standing Move action button, placed wherever the view wants it —
 * the same pill the panel header used to carry. Clicking it runs whatever
 * the app attached to the matching hardware button (`jog_click` for enter,
 * `capture` for capture) through MoveFunctions, and both screen clicks and
 * hardware presses flash it briefly. Disabled buttons dim to 40% and run
 * nothing. Every kind carries its hardware glyph — the shift pill wears the
 * enter dot in black, since a shift tap confirms the same way.
 */
declare function MoveActionButton({ kind, children, onPress, disabled, className }: MoveActionButtonProps): react_jsx_runtime.JSX.Element;

/** The curve vocabulary a segment cycles through on quick-click. */
type CurveType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
/** Cycle order for quick-click (loops back to the start). */
declare const CURVE_CYCLE: CurveType[];
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
    /**
     * Mirror the curve in TIME (t → 1−t): the shape plays back to front, so a slow start
     * becomes a slow finish. Optional; false when absent.
     *
     * This is an orientation applied on top of the shape, not another preset, which is why it
     * works for every type. `easeInOut` and `spring` have no parameter that can express a
     * mirror — swapping the preset only ever gets you easeIn↔easeOut — so without this they
     * cannot be flipped at all.
     */
    flipX?: boolean;
    /**
     * Mirror the curve in VALUE (v → 1−v): the segment falls from its ceiling to its floor
     * instead of rising. Optional; false when absent.
     *
     * Set both flips together and the two mirrors cancel back to a rising curve — that
     * combination is the classic easing reverse, and is what {@link flipSegment} applies.
     */
    flipY?: boolean;
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
    /** Mirror in time — see CurveSegment.flipX. */
    flipX?: boolean;
    /** Mirror in value — see CurveSegment.flipY. */
    flipY?: boolean;
}
type DriverDirection = 'forward' | 'mirror' | 'reverse';
interface CurveComposition {
    segments: CurveSegment[];
    /** null → no driver lane (the component renders a single lane). */
    driver: CurveDriver | null;
    direction: DriverDirection;
    /**
     * 0..1 — fraction of the timeline given to gaps between segments (distributed equally,
     * one gap after each segment, the last wrapping to the first). In a gap the value glides
     * smoothly from the segment's end down to the next segment's start (a faint connector)
     * instead of snapping. 0 = contiguous (default). Optional.
     */
    gap?: number;
}
/** A pure `(t) -> value` sampler over local time, both in 0..1 (value may overshoot for springs). */
type Sampler = (t: number) => number;
/**
 * Physics used only by {@link springify}'s one-second driven follower.
 * This is deliberately distinct from timeline `SpringConfig`, whose defaults describe
 * a transition settling toward a fixed endpoint rather than tracking a moving signal.
 */
interface SpringifyOptions {
    /** Spring stiffness, constrained to 1..1000. Default 100. */
    stiffness?: number;
    /** Damping coefficient, constrained to 0..100. Default 10. */
    damping?: number;
    /** Attached mass, constrained to 0.1..10. Default 1. */
    mass?: number;
    /**
     * If the follower escapes 0..1, affinely fit its complete trace back into that range.
     * Unlike clipping, this preserves the shape and relative size of every bounce. Default false.
     */
    normalize?: boolean;
    /**
     * Solve for a periodic steady state so position and velocity join seamlessly at t=0/1.
     * Enable this when the source sampler repeats. Default false.
     */
    loop?: boolean;
}
/**
 * Attach a damped follower to any designed curve.
 *
 * The source value is the spring's moving target: at every step a second value is pulled
 * toward it by stiffness, retains momentum through mass, and loses energy through damping.
 * The trace is baked once so the returned sampler stays deterministic and scrubbable.
 *
 * Set `normalize` to fit an over-bouncing trace into 0..1. This is an affine rescale of
 * the complete trace, not a clamp, so every peak and damped return remains visible.
 */
declare function springify(sample: Sampler, options?: SpringifyOptions): Sampler;
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
/**
 * Mirror a curve in time — the shape plays back to front.
 *
 * Unlike {@link flipSegment}, which rewrites the preset and so can only ever turn easeIn
 * into easeOut, this is an orientation laid over whatever shape is there. It therefore does
 * something visible for every type, including `easeInOut` and `spring`, which have no
 * preset to swap to.
 */
declare function flipSegmentX(comp: CurveComposition, index: number): CurveComposition;
/** Mirror a curve in value — the segment falls from its ceiling instead of rising. */
declare function flipSegmentY(comp: CurveComposition, index: number): CurveComposition;
declare function flipDriverX(comp: CurveComposition): CurveComposition;
declare function flipDriverY(comp: CurveComposition): CurveComposition;
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
interface CompositionSamplers {
    segments: Sampler[];
    driver: Sampler | null;
}
declare function buildSamplers(comp: CurveComposition): CompositionSamplers;
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

/**
 * The modulation layer's shared ground — types, palette, math, and the
 * modulator-type registry, all framework-neutral.
 *
 * A modulation lives in one of 16 slots, one per Move sequencer step button:
 * touch a control and press a step to create the modulation there and wire
 * the control to it. Each slot carries a modulator (an LFO, an envelope
 * follower, a curve...) and a palette colour; the same colour marks the
 * slot's circle in the track row and a dot on every control it drives.
 *
 * The modulated value NEVER enters the TweakStore: a control keeps the
 * number the user set (the base), and the modulation is a live layer read
 * at frame time through the ModulationStore. That keeps presets, the
 * persistence shelf, and the bridge kit's diffing on the stored value —
 * nothing loops, nothing thrashes — the same shape Pixture's audio mods
 * proved out.
 *
 * Modulator types register through `registerModType`, so each type (LFO,
 * envelope, curve, S&H, sequencer) plugs in independently: defaults, the
 * settings-page controls, and a stateful `tick` that advances the signal.
 * A slot can instead point at an external source (a DSP app's own LFO or
 * follower) registered on the ModulationStore — same slot, same colours,
 * but the engine only mirrors the signal it is given.
 */
/** One slot per Move sequencer step button. */
declare const MOD_SLOTS = 16;
/**
 * The modulation palette, one colour per slot — sixteen hues around the
 * wheel, tuned to sit with the Move's track colours on the dark panel.
 */
declare const MOD_COLORS: string[];
/** A slot's palette colour — the one constant identity it keeps. */
declare const modColor: (index: number) => string;
type ModulationType = 'lfo' | 'adsr' | 'envelope' | 'curve' | 'sh' | 'sequencer';
/** The envelope's four stages — the four columns of its picture. */
type EnvStage = 'attack' | 'decay' | 'sustain' | 'release';
/**
 * A settings value: the scalars a dial or a pad edits, plus the structures a
 * richer modulator carries (the curve's clip list). JSON-safe throughout, so
 * a slot's whole setup still rides the persistence shelf as it is.
 */
type ModulationParamValue = number | boolean | string | ModulationParamValue[] | {
    [key: string]: ModulationParamValue;
};
/** Modulator settings — JSON-safe, like TweakStore values. */
type ModulationParams = Record<string, ModulationParamValue>;
interface ModulationSlot {
    /** 0..15 — the Move step button that created it, and its palette index. */
    index: number;
    type: ModulationType;
    params: ModulationParams;
    /** External source id (a DSP app's own modulator); null = internal engine. */
    source?: string | null;
}
interface ModulationAssignment {
    panelId: string;
    path: string;
    /** The slot driving this control. */
    slot: number;
    /** Sweep depth 0..1 — at 1 the signal swings the control's full span. */
    amount: number;
}
/**
 * Settings-page control metadata — ControlMeta plus what the Move page needs:
 * the xy mapping (an xy control edits two scalar params, xParam/yParam,
 * rather than storing an {x, y} object), and the placement and gestures the
 * two surfaces read through {@link modPageLayout}.
 */
type ModControlMeta = ControlMeta & {
    xParam?: string;
    yParam?: string;
    /** Sits in a small slot under its dial's column instead of taking a big one. */
    chip?: boolean;
    /** Shown only when this says so — a control that belongs to one mode. */
    when?: (params: ModulationParams) => boolean;
    /** This dial draws the modulator's own shape (the type's `preview`). */
    drawsPreview?: boolean;
    /**
     * This dial is one stage of the envelope: the four stage dials render as
     * one 4-column control — a single display drawing the whole shape, with
     * each stage's readout and drag zone in its own column.
     */
    envStage?: EnvStage;
    /** A knob tap on this dial runs this, returning the params it changes. */
    cycle?: (params: ModulationParams) => ModulationParams;
};
/**
 * One modulator type, pluggable: LFO ships with the kit, the others
 * (envelope, curve, S&H, sequencer) register through the same door.
 * `tick` advances the modulator by `dt` seconds and returns the signal,
 * always -1..1; `state` is whatever `createState` returned — the engine
 * never looks inside it.
 */
interface ModTypeDef {
    type: ModulationType;
    label: string;
    defaults: ModulationParams;
    /** The settings-page layout, in slot order: dials, toggles, the xy pad. */
    controls: ModControlMeta[];
    createState(): unknown;
    tick(state: unknown, params: ModulationParams, dt: number, bpm: number): number;
    /**
     * Fold an incoming patch into the type's own structure — the curve writes
     * the shape dials into the clip they belong to, and reads the next clip's
     * shape back out when the selection moves. Returns the params to store;
     * without it a patch is simply merged.
     */
    normalize?(current: ModulationParams, patch: ModulationParams): ModulationParams;
    /**
     * Hardware buttons this modulator's settings page claims (`left`, `right`,
     * `delete`...). A press runs the action, whose patch lands in the params.
     */
    buttons?: Record<string, (params: ModulationParams) => ModulationParams | void>;
    /**
     * What the modulator is shaped like right now: `count` samples, each 0..1,
     * and what that shape is called. Both small screens draw it.
     */
    preview?(params: ModulationParams, count: number): {
        points: number[];
        label: string;
    };
    /** Where the modulator sits in its cycle, 0..1 — a composer's playhead. */
    phase?(state: unknown): number;
    /**
     * Note on / note off, for the types that take a gate (the ADSR). The
     * store's `gate(slot, on)` lands here; free-running types (LFO, S&H)
     * leave it out and the store ignores the call.
     */
    gate?(state: unknown, on: boolean): void;
}
/** One control's place on the Move page, with the gestures it answers to. */
interface ModPageSlot {
    path: string;
    /** The dial draws the modulator's preview instead of a bar. */
    preview?: boolean;
    /** The dial draws this stage's segment of the envelope picture. */
    stage?: EnvStage;
    /** A knob tap on this dial cycles it. */
    cycle?: boolean;
}
/**
 * A modulator's page: the eight big dial slots, and the small slots under
 * them — a switch row and a chip row, both column-aligned with the dial
 * above. Empty slots ride as nulls so a column stays open.
 */
interface ModPageLayout {
    dials: ModPageSlot[];
    toggles: (ModPageSlot | null)[];
    values: (ModPageSlot | null)[];
}
declare const MOD_PAGE_DIALS = 8;
/**
 * Place a modulator's controls, in declaration order: each dial takes the
 * next big slot, and everything else drops into the column of the dial just
 * declared — a switch to the switch row, a chip (or a second switch) to the
 * chip row below it. That is what stacks the LFO's sync pad under its rate
 * dial, and the curve's sync and signal under its duration dial.
 *
 * Both surfaces read this one list, so the screen and the hardware never
 * disagree about which knob a pad belongs to.
 */
declare function modPageLayout(controls: ModControlMeta[], params?: ModulationParams): ModPageLayout;
/** The controls a page actually shows — the mode-specific ones filtered out. */
declare const visibleModControls: (def: ModTypeDef, params: ModulationParams) => ModControlMeta[];
/** Plug a modulator type in; registering a type again replaces it. */
declare function registerModType(def: ModTypeDef): void;
declare const getModType: (type: ModulationType) => ModTypeDef | undefined;
/** The registered types, registration order — the settings page's type enum. */
declare const listModTypes: () => ModTypeDef[];
/**
 * Every settings page's width in dial slots: the type picker plus the
 * widest registered page. One number for all types, so switching the type
 * never reflows the page — the control under your finger stays where it is.
 */
declare const modPageWidth: () => number;
/** The one modulator-settings panel, registered by `ModulationStore.openSettings`. */
declare const MOD_SETTINGS_PANEL = "mod-settings";
/** Assignment map key — panel and path, joined on a character paths can't hold. */
declare const modKey: (panelId: string, path: string) => string;
/**
 * A signal applied to a control: a bipolar sweep around the base value in
 * the control's own units, clamped to its bounds — the control keeps its
 * base, the modulation dances around it.
 */
declare function applyModulation(base: number, signal: number, amount: number, min: number, max: number): number;
/**
 * The ring a modulated control wears: a dial drawn as an SVG circle of this
 * radius, sweeping a knob's 270° from the bottom-left so a value sits at the
 * angle the control's own dial would point.
 */
declare const MOD_RING_RADIUS = 6;
declare const MOD_RING_CIRCUMFERENCE: number;
/**
 * The arc between two values (each 0..1 of the control's span), as the dash
 * pattern that draws it: SVG lays a circle's path clockwise from 3 o'clock,
 * so a dash of `length` pushed to `offset` lands exactly on the arc.
 * Feed it base and modulated value and the ring shows where the modulation
 * is holding the control right now.
 */
declare function modRingArc(from01: number, to01: number): {
    length: number;
    offset: number;
};
/** Tempo-sync divisions, cycle length in beats (4/4 bars down to 1/32). */
declare const LFO_SYNC_DIVISIONS: {
    label: string;
    beats: number;
}[];
/** A synced LFO's frequency: the division's cycle length at this tempo. */
declare function lfoSyncedHz(division: number, bpm: number): number;
/**
 * The LFO: a width-skewed triangle (0.5 symmetric, toward 0/1 a saw either
 * way), phase-offset, with jitter (a random offset renewed each cycle) and
 * smooth (a slew that rounds corners toward sine and softens jitter steps).
 */
declare const LFO_DEF: ModTypeDef;
/**
 * Sample & hold: a new random value at every rate tick, held until the
 * next. Depth scales the throw, offset biases the whole signal, jitter
 * randomizes each hold's length (drunken clock), and smooth is the same
 * slew as the LFO's — at 0 hard steps, up high a wandering drift.
 */
declare const SH_DEF: ModTypeDef;
/** Each timed stage's dial span in ms — the picture normalises against it. */
declare const ADSR_STAGE_MAX: {
    readonly attack: 2000;
    readonly decay: 2000;
    readonly release: 4000;
};
/**
 * The whole envelope as one drawing: `count` samples, each 0..1, across a
 * single display that spans the four stage columns. Each timed stage takes
 * a share of the width proportional to its own dial (floored so an instant
 * stage still shows its edge, capped so the sustain hold never vanishes),
 * and the sustain level runs flat through whatever width remains — turn any
 * dial and its part of the picture stretches or falls in place.
 */
declare function envelopePoints(params: ModulationParams, count: number): number[];
/**
 * The ADSR: attack up to full, decay down to the sustain level, sustain
 * held while the gate is on, release back to rest. The signal is unipolar
 * 0..1 — at rest the control sits on its base value, and the envelope
 * lifts it up to `amount` of the span.
 *
 * A gate drives it — `ModulationStore.gate(slot, on)`, from a note, a pad,
 * a hardware step — and a fresh slot rests at zero until the host sends
 * one. That is the shape an app integrates against; a DSP app whose own
 * envelope already runs at audio rate points the slot at a source instead
 * and the kit just shows the signal.
 *
 * Loop is the exception, for demos and for prototyping with no host: with
 * it on the envelope plays its own gate, running attack → decay → release
 * over and over.
 */
declare const ADSR_DEF: ModTypeDef;
/**
 * The curve modulator plays a composition from the Curve Composer: a series
 * of clips, each an eased or springy walk, read once per pass. The page is
 * the composer laid onto the Move — the arrows walk the clips, Delete drops
 * the selected one, and the shape dials edit whichever clip is selected, so
 * one page sculpts a whole series without ever leaving the hardware.
 *
 * The composition lives in the slot's params (`clips`), so it persists with
 * everything else; the shape dials are a live projection of the selected
 * clip, kept in step by `normalize`.
 */
/** How many clips one pass may hold — one per shape dial's worth of patience. */
declare const CURVE_MAX_CLIPS = 8;
/** A pass lasts between these, in seconds. */
declare const CURVE_MIN_DURATION = 0.05;
declare const CURVE_MAX_DURATION = 60;
/** What each curve in the vocabulary is called on the two small screens. */
declare const CURVE_LABELS: Record<CurveType, string>;
/** The slot's params read as a composition the composer core can play. */
declare function curveComposition(params: ModulationParams): CurveComposition;
/**
 * One pass in seconds. Synced, the dial's duration snaps to the nearest
 * tempo division, so a pass locks to the Move's clock without a second dial.
 */
declare function curveDuration(params: ModulationParams, bpm: number): number;
declare const CURVE_DEF: ModTypeDef;

/**
 * The Move's control surface, as the bridge kit maps it (move-tweakers v0):
 * the first 4 panels become pages behind the track buttons, sliders and
 * bounded numbers become the 8 dials, toggles become pads. An xy control
 * takes a dial slot too — the pad draws behind the label, its knob turns
 * the X axis, and the volume knob turns Y while that knob is touched. A
 * range control claims a slot the same way: its knob moves the low end,
 * the volume knob the high end while touched. A select with real choices
 * claims one as a stepped enum dial — the knob's 0..1 position maps to an
 * option index, step 1/(count-1). Bounded params
 * beyond the 8 dials overflow into the pad grid as value chips — each one
 * related, by column, to the dial above it, which it can substitute (hold
 * to peek, tap to latch). The on-screen MovePanel mirrors this mapping so
 * screen and hardware always show the same layout.
 */
declare const MOVE_TRACKS = 4;
declare const MOVE_DIALS = 8;
declare const MOVE_PADS = 8;
interface MovePage {
    panel: PanelConfig;
    dials: ControlMeta[];
    /** Switch chips — the hardware's toggle pad row (y=3 on the device). */
    toggles: ControlMeta[];
    /** Overflow value chips — the hardware's value pad row (y=1). Value i sits
     *  at column i on both surfaces, pairing it with the dial in that column. */
    values: ControlMeta[];
    /** Action pads — the row under the values (the device's bottom pad row).
     *  Placed by hand only, through the panel's `movePads` map. */
    actions: ControlMeta[];
}
/**
 * How many dial columns a control claims. The filter is the kit's first
 * 2-slot control: its picture spans two columns, and on the hardware the
 * left column's knob turns cutoff while the right column's turns resonance.
 */
declare const dialSpan: (c: ControlMeta | undefined) => number;
/** True when column i only continues the span-2 dial sitting at i-1. */
declare const isSpanContinuation: (page: MovePage, i: number) => boolean;
/**
 * The modulator-settings page (hold a step button): the kind picker takes
 * the first big slot, the modulator's own controls follow, and everything
 * else drops into the column of the dial declared just before it — the
 * LFO's tempo-sync pad below its rate dial, the curve's sync and signal
 * below its duration dial.
 *
 * `layout` is the ModulationStore's own placement (`getSettingsLayout`), the
 * single list both surfaces read; without it the same rule is re-derived
 * from the panel, which is enough for a modulator with no small slots.
 */
declare function buildModMovePage(panel: PanelConfig, layout?: ModPageLayout | null): MovePage;
declare function buildMovePages(panels: PanelConfig[]): MovePage[];
/**
 * The pad grid's four rows, top to bottom, exactly as the hardware stacks
 * them — screen row 0 is the row nearest the knobs.
 *
 * Plain: y=3 is the dial-slot indicator (the dials draw it, so it is not a
 * row here), y=2 the switches, y=1 the value chips, y=0 the ALT pad. An app
 * that claims both bottom rows takes y=1 and y=0, and the chips move up above
 * the switches — the same shuffle the surface makes, so a dial column keeps
 * its chip AND its switch underneath it (see PROTOCOL.md).
 *
 * Hand-placed action pads take the row under the values. A single-row claim
 * is the bottom row alone, so the actions keep theirs; a two-row claim takes
 * both bottom rows, and the actions have nowhere left to sit.
 */
declare function movePadRows(page: MovePage, claimedRows: number): ControlMeta[][];
/**
 * Which claimed hardware row a screen row shows, or null when it is a control
 * row. Two claimed rows fill screen rows 2 and 3 (y=1 then y=0); one claimed
 * row is the bottom row alone, and lands on screen row 3 — below the action
 * pads, exactly where the hardware puts it.
 */
declare function moveAppPadRow(row: number, claimedRows: number): 0 | 1 | null;
/**
 * The columns the on-screen panel actually shows: a column is occupied when
 * it has a dial, a toggle chip, or a value chip at that index. The indices
 * stay the hardware knob numbers — callers hide the unoccupied columns,
 * never renumber them, so the latch/substitution logic and the physical
 * knobs keep agreeing on what column i means.
 */
declare function visibleColumns(page: MovePage): number[];
/** Dial position 0..1, the same normalization the kit puts on the wire. */
declare function normalizeDial(meta: ControlMeta, value: unknown): number;
/** An xy pad's position, each axis 0..1 — the two numbers on the wire. */
declare function normalizeXYDial(meta: ControlMeta, value: unknown): {
    x: number;
    y: number;
};
/** The option's glyph name, or null — a bare string option never has one. */
declare const enumOptionIcon: (o: string | {
    icon?: string;
}) => string | null;
/** A range dial's two ends, each 0..1 — the two numbers on the wire. */
declare function normalizeRangeDial(meta: ControlMeta, value: unknown): {
    lo: number;
    hi: number;
};
/** End positions 0..1 back to the control's real {min, max}, kit-identical —
 *  clamped into the bounds and ordered, so crossed ends never come back reversed. */
declare function denormalizeRangeDial(meta: ControlMeta, lo01: number, hi01: number): RangeValue;
/** An enum dial's position 0..1 — the option's index over the last index.
 *  An unknown (or missing) value reads as the first option, position 0. */
declare function normalizeEnumDial(meta: ControlMeta, value: unknown): number;
/** Dial position 0..1 back to the option at that step, kit-identical:
 *  round(v01 * (count-1)), clamped into the options list. */
declare function denormalizeEnumDial(meta: ControlMeta, v01: number): string;
/** A filter dial's two hands, each 0..1 — the two numbers on the wire.
 *  The left column's knob is cutoff, the right column's is resonance. */
declare function normalizeFilterDial(meta: ControlMeta, value: unknown): {
    cutoff: number;
    resonance: number;
};
/** Hand positions 0..1 back to the control's real pair, kit-identical. */
declare function denormalizeFilterDial(meta: ControlMeta, cutoff01: number, resonance01: number): FilterValue;
/**
 * The 2-slot picture: the filter's magnitude response as an SVG path filling
 * a 100×100 box, y pointing up — through the app's own `response` when the
 * config brought one, else the kit's lowpass. One answer both surfaces can
 * be tested against, like `enumShapePath`.
 */
declare function filterShapePath(meta: ControlMeta, value: unknown): string | null;
/** Where the fill anchors for a bipolar/origin slider, 0..1 (else 0). */
declare function dialOrigin(meta: ControlMeta): number;

/**
 * The big-slot library — the dictionary of what a Move dial slot can be.
 *
 * A slot is one column of the Move's dial row (two for the filter). The
 * gestures — pointer capture, fine drag, modulation arming — stay with the
 * MovePanel; what lives here is the slot's face: every body is a pure
 * drawing of computed props, so each case can be read, reused, and tested
 * on its own. `moveSlotKind` names which face a control wears.
 *
 * The cases:
 * - `default` — the basic slot: name centred, value in its place on touch,
 *   fill bar at the bottom (an origin tick when the dial is bipolar).
 * - `value`   — the same slot the other way round: the value is the
 *   headline, the name shrinks to a tag on top. For dials whose value
 *   already says what it is (two seconds, three clips), and for a value
 *   chip substituted into the slot.
 * - `icon`    — an option picker whose current option shows as a glyph:
 *   at arm's length you read a picture, not a word.
 * - `curve`   — an option picker whose current option draws its shape (the
 *   select's `preview` sampler) — the curve-selection slot.
 * - `enum`    — a plain stepped option picker: option name centred, one
 *   pagination cell per option.
 * - `xy`      — a 2D pad filling the slot; on the hardware the column's
 *   knob turns X and the volume knob turns Y while touched.
 * - `range`   — two handles on one bar; column knob = low end, volume
 *   knob = high end while touched.
 * - `filter`  — the 2-slot control: cutoff and resonance as one picture,
 *   the magnitude response maximised across both columns, each hand's
 *   small label sitting where its own slot's label would have been.
 * - `env`     — the 4-slot control: the whole ADSR drawn as one shape on a
 *   single display spanning the four stage columns, one caption and drag
 *   zone per stage.
 *
 * Multi-slot controls (`filter` spans 2 columns, `env` spans 4) follow one
 * pattern: the container takes `grid-column: span N`, the display and its
 * drawing stretch across the whole span, and each hand or stage keeps a
 * small caption where its own single slot's label would have been — so the
 * hardware's one-knob-per-column rule still holds under the shared picture.
 */
type MoveSlotKind = 'default' | 'value' | 'icon' | 'curve' | 'enum' | 'xy' | 'range' | 'filter' | 'env';
/** Which face a control wears in its slot, from its meta and moment. */
declare function moveSlotKind(meta: ControlMeta, opts?: {
    enum?: boolean;
    shape?: string | null;
    glyph?: string | null;
    valueFirst?: boolean;
    stage?: string | null;
}): MoveSlotKind;
/** One glyph from the bundled lucide subset; an unknown name draws nothing. */
declare function MoveSlotGlyph({ name, className }: {
    name: string;
    className: string;
}): react_jsx_runtime.JSX.Element | null;
/** The slot's centred name, and the value that takes its place on touch. */
declare function MoveSlotReadout({ label, value }: {
    label: string;
    value: ReactNode;
}): react_jsx_runtime.JSX.Element;
/** A path drawn edge to edge in the slot's picture band. */
declare function MoveSlotShape({ d, className }: {
    d: string;
    className?: string;
}): react_jsx_runtime.JSX.Element;
/** The basic slot and its value-first twin — readout plus fill bar. A
 *  bipolar dial parked exactly on its origin states the zero outright
 *  (the marker) instead of leaving a stub to read against a tick. */
declare function MoveSlotDefaultBody({ label, value, pct, originPct, atOrigin, }: {
    label: string;
    value: ReactNode;
    /** Fill extent, 0–100. */
    pct: number;
    /** Bipolar/origin anchor position, 0–100 — null for a plain fill. */
    originPct: number | null;
    /** Parked on the origin exactly — the dial's zero. */
    atOrigin?: boolean;
}): react_jsx_runtime.JSX.Element;
/** The option picker's three faces — name, glyph, or drawn shape — plus the
 *  pagination cells. A slot with a picture reads top down: what the knob is
 *  on the tag, the picture between, what it is set to underneath. */
declare function MoveSlotEnumBody({ label, optionLabel, options, activeIdx, shape, glyph, }: {
    label: string;
    optionLabel: string;
    options: NonNullable<ControlMeta['options']>;
    activeIdx: number;
    shape: string | null;
    glyph: string | null;
}): react_jsx_runtime.JSX.Element;
/** The range slot — readout plus the two-handled span bar. */
declare function MoveSlotRangeBody({ label, value, lo, hi, }: {
    label: string;
    value: ReactNode;
    /** Handle positions, each 0..1. */
    lo: number;
    hi: number;
}): react_jsx_runtime.JSX.Element;
/**
 * The 2-slot filter's face: the response maximised across both columns, and
 * a small label per hand — each sitting inline where its own single slot's
 * label would have been, cutoff on the left half, resonance on the right.
 * Each label gives way to its hand's value on touch, like any slot.
 */
declare function MoveSlotFilterBody({ meta, value, shape, }: {
    meta: ControlMeta;
    value: FilterValue;
    shape: string | null;
}): react_jsx_runtime.JSX.Element;
/**
 * The 4-slot envelope's face, the filter's big sibling: the whole ADSR
 * drawn as one shape on a single display spanning all four stage columns,
 * with each stage's small label sitting where its own slot's label would
 * have been — attack, decay, sustain, release, left to right, each caption
 * over its own drag zone and hardware knob.
 */
declare function MoveSlotEnvBody({ points, stages, }: {
    /** The whole envelope's samples, each 0..1, left to right. */
    points: number[];
    /** One caption per stage column, in column order. */
    stages: {
        stage: string;
        label: string;
        value: ReactNode;
    }[];
}): react_jsx_runtime.JSX.Element;
/**
 * The dictionary itself — every big-slot case the kit knows, named, with
 * the component that draws it. `value`, `icon`, `curve` and `enum` are
 * faces of shared bodies (the same markup, chosen by `moveSlotKind`);
 * `xy` stays inline in the MovePanel for now, its face being nothing but
 * its gesture surface.
 */
declare const MOVE_SLOT_LIBRARY: {
    readonly default: {
        readonly description: "name centred, value on touch, fill bar";
        readonly component: typeof MoveSlotDefaultBody;
    };
    readonly value: {
        readonly description: "value-first: the value is the headline, the name a tag on top";
        readonly component: typeof MoveSlotDefaultBody;
    };
    readonly icon: {
        readonly description: "option picker showing the current option as a glyph";
        readonly component: typeof MoveSlotEnumBody;
    };
    readonly curve: {
        readonly description: "option picker drawing the current option’s shape — curve selection";
        readonly component: typeof MoveSlotEnumBody;
    };
    readonly enum: {
        readonly description: "stepped option picker, one pagination cell per option";
        readonly component: typeof MoveSlotEnumBody;
    };
    readonly range: {
        readonly description: "two handles on one bar; volume knob is the second hand";
        readonly component: typeof MoveSlotRangeBody;
    };
    readonly filter: {
        readonly description: "2 slots: cutoff + resonance as one response picture";
        readonly component: typeof MoveSlotFilterBody;
    };
    readonly env: {
        readonly description: "4 slots: the whole ADSR as one shape, a caption per stage";
        readonly component: typeof MoveSlotEnvBody;
    };
};

interface FilterControlProps {
    control: ControlMeta;
    value: FilterValue | undefined;
    onChange: (value: FilterValue) => void;
}
/**
 * The filter control's inline face: the magnitude response drawn as a curve
 * row, with the two hands — cutoff and resonance — as sliders under it. One
 * control, one value; on the Move the same trio compresses into the 2-slot
 * picture.
 */
declare function FilterControl({ control, value, onChange }: FilterControlProps): react_jsx_runtime.JSX.Element;

/**
 * The Move's function buttons, offered to the app as a function library.
 *
 * The hardware carries a row of named buttons — Undo, Copy, Delete, Mute,
 * the arrows and friends. The app attaches its own actions to them:
 *
 *   import { MoveFunctions } from 'tweakers';
 *
 *   MoveFunctions.attach('undo', () => history.undo());
 *   MoveFunctions.attach('copy', ({ shift }) => shift ? copyAll() : copySelection());
 *   MoveFunctions.attach('sample', () => confirmSelection());
 *
 * and hands the registry to the bridge kit when binding:
 *
 *   import('http://localhost:7787/kit.js')
 *     .then(m => m.bindMove(TweakStore, { functions: MoveFunctions }))
 *     .catch(() => {});
 *
 * The kit tells the Move which buttons are attached (they light up on the
 * hardware) and relays every press back here; `attach` returns a detach
 * function. Buttons left unattached keep the surface's built-in behavior
 * (Undo resets the page's dials, Delete clears the sequencer, Play runs it).
 * Shift never appears here — it rides along as a flag on every press — and
 * the four track buttons always switch pages.
 */
/**
 * The manifest of attachable buttons — each named exactly as printed on the
 * hardware, so integration talk stays unambiguous ("wire the sample button").
 * `special` marks the Move-specific buttons that carry no fixed meaning —
 * each app decides what they do (sample often acts as the confirm key). The
 * rest should do what their printed label says (Undo undoes, Copy copies),
 * so every app feels the same in the hand.
 */
declare const MOVE_FUNCTION_MANIFEST: readonly [{
    readonly name: "play";
}, {
    readonly name: "rec";
}, {
    readonly name: "mute";
}, {
    readonly name: "undo";
}, {
    readonly name: "copy";
}, {
    readonly name: "delete";
}, {
    readonly name: "up";
}, {
    readonly name: "down";
}, {
    readonly name: "left";
}, {
    readonly name: "right";
}, {
    readonly name: "sample";
    readonly special: true;
}, {
    readonly name: "loop";
    readonly special: true;
}, {
    readonly name: "capture";
    readonly special: true;
}, {
    readonly name: "menu";
    readonly special: true;
}, {
    readonly name: "back";
    readonly special: true;
}, {
    readonly name: "jog_click";
    readonly special: true;
}];
/** The attachable function names, manifest order. */
declare const MOVE_FUNCTION_BUTTONS: ("sample" | "menu" | "copy" | "play" | "left" | "right" | "loop" | "delete" | "capture" | "rec" | "mute" | "undo" | "up" | "down" | "back" | "jog_click")[];
/** The special buttons — free for app-specific meanings. */
declare const MOVE_SPECIAL_BUTTONS: ("sample" | "menu" | "copy" | "play" | "left" | "right" | "loop" | "delete" | "capture" | "rec" | "mute" | "undo" | "up" | "down" | "back" | "jog_click")[];
type MoveFunctionButton = (typeof MOVE_FUNCTION_MANIFEST)[number]['name'];
interface MoveFunctionPress {
    name: MoveFunctionButton;
    /** True when Shift was held on the hardware — a second-function layer. */
    shift: boolean;
}
type MoveFunctionHandler = (press: MoveFunctionPress) => void;
interface MoveFunctionOptions {
    /**
     * A screen name for the action, readable back via `label(name)`. The
     * screen-side pills are MoveActionButtons now, which carry their own
     * labels — this stays for kits and views that want a registry name.
     */
    label?: string;
}
type MoveFunctionRunListener = (name: MoveFunctionButton, press: MoveFunctionPress) => void;
declare class MoveFunctionsClass {
    private handlers;
    private labels;
    private listeners;
    private runListeners;
    /**
     * Attach an action to a function button; returns a detach function.
     * One action per button — attaching again replaces the previous one.
     */
    attach(name: MoveFunctionButton, handler: MoveFunctionHandler, options?: MoveFunctionOptions): () => void;
    /** The attached button names — what the kit claims on the hardware. */
    list(): MoveFunctionButton[];
    /** The screen name an attachment carries, if any. */
    label(name: MoveFunctionButton): string | undefined;
    /** Run the action attached to a button, if any. Called by the kit per press. */
    run(name: MoveFunctionButton, press?: Partial<MoveFunctionPress>): void;
    /** Notified when attachments change, so the kit can reconfigure the Move. */
    subscribe(listener: () => void): () => void;
    /** Notified on every run — the MovePanel flashes its pills on hardware presses. */
    subscribeRuns(listener: MoveFunctionRunListener): () => void;
    private notify;
}
declare const MoveFunctions: MoveFunctionsClass;

type WaveformMode = 'smooth' | 'pixelated';
/** A loop region over the sample, as normalized 0..1 positions. */
type WaveformLoop = {
    start: number;
    end: number;
};

/**
 * A waveform on the Move surface.
 *
 * The panel gives an app its knobs; this gives it the sample they are acting
 * on. The hardware split follows the shape of the gesture rather than the
 * shape of the API: the big wheel is a scrub-and-zoom wheel on every deck ever
 * built, so it zooms; the volume knob is the one continuous control a hand
 * finds without looking, so it scrubs; and the step row is sixteen positions
 * along a bar, so it marks the loop.
 *
 * Everything here is pure but for the registry — the maths is what decides how
 * the instrument feels, so it is testable on its own.
 */
/** Placements. All three draw the same waveform; they differ in where it sits. */
type MoveWaveformVariant = 
/** In the page, wherever the app puts it — a card on the app's own surface. */
'page'
/** Slot-sized, playhead pinned at the centre and the wave running past it. */
 | 'slot'
/** Floating above the Move panel, the width of the surface it belongs to. */
 | 'dock';
/** The view state the hardware drives, shared by every surface showing it. */
type MoveWaveformView = {
    /** Play position, 0..1. */
    position: number;
    /** 1 = whole sample. */
    zoom: number;
    loop: WaveformLoop | null;
    /** The step a pending loop started from, or null when no loop is being drawn. */
    loopAnchor: number | null;
};
declare const MOVE_WAVEFORM_STEPS = 16;
declare function defaultView(): MoveWaveformView;
/** The volume knob scrubs: a signed detent count moves the play position. */
declare function scrubBy(position: number, delta: number, fine?: boolean): number;
/**
 * The wheel zooms, proportionally — each detent is a percentage of where you
 * already are, so ten clicks out undo ten clicks in.
 */
declare function zoomBy(zoom: number, delta: number): number;
/** Where step `index` sits along the sample, 0..1. */
declare const stepPosition: (index: number, steps?: number) => number;
/**
 * The step row as a loop bar: the first press drops the in point, the second
 * the out point, and a press with a loop already set starts a new one. Pressing
 * the anchor twice cancels rather than making a zero-length loop — a loop you
 * cannot hear is never what the second press meant.
 */
declare function loopFromStep(view: MoveWaveformView, index: number, steps?: number): Pick<MoveWaveformView, 'loop' | 'loopAnchor'>;
/** Which steps light: the loop's span, or the lone anchor while one is pending. */
declare function loopSteps(view: MoveWaveformView, steps?: number): number[];
type Listener$3 = () => void;
declare class MoveWaveformStoreClass {
    private view;
    private registered;
    private listeners;
    private version;
    /** Claim the wheel, the volume knob and the step row. Returns the release. */
    register(): () => void;
    isRegistered(): boolean;
    getView(): MoveWaveformView;
    getVersion(): number;
    /** Patch the view. A patch that changes nothing notifies nobody. */
    setView(patch: Partial<MoveWaveformView>): void;
    scrub(delta: number, fine?: boolean): void;
    zoom(delta: number): void;
    pressStep(index: number): void;
    clearLoop(): void;
    /** The steps the loop covers — what the hardware lights. */
    loopSteps(): number[];
    subscribe(fn: Listener$3): () => void;
    private notify;
}
declare const MoveWaveformStore: MoveWaveformStoreClass;

interface MoveWaveformProps {
    /** Decoded sample. */
    buffer?: AudioBuffer | null;
    /**
     * Where it sits. `page` is a card on the app's own surface, `slot` is
     * dial-sized with the playhead pinned at the centre, `dock` floats above
     * the Move panel.
     */
    variant?: MoveWaveformVariant;
    /** Read every frame for the playhead, exactly as WaveformVisualization takes it. */
    getProgress?: () => number;
    progress?: number;
    /** Reports a new play position — from a click, the volume knob, or the wheel. */
    onSeek?: (position: number) => void;
    /** Reports the loop the step row (or a drag) set, or null when it is cleared. */
    onLoopChange?: (loop: WaveformLoop | null) => void;
    mode?: WaveformMode;
    pixelSize?: number;
    grid?: boolean;
    bands?: boolean;
    waveColor?: string;
    playheadColor?: string;
    height?: number;
    /** Anything the app draws over the waveform — grain ticks, markers. */
    children?: React.ReactNode;
    theme?: TweakTheme;
    productionEnabled?: boolean;
    className?: string;
}
/**
 * The sample the Move's knobs are acting on, drawn on the same surface as the
 * panel and driven by the same hardware: the wheel zooms, the volume knob
 * scrubs, the step row marks the loop.
 *
 * Rendering one claims those controls for as long as it is mounted — there is
 * one wheel, so there is one waveform. The app keeps its own state; this
 * reports moves through `onSeek` / `onLoopChange` like any control.
 */
declare function MoveWaveform({ buffer, variant, getProgress, progress, onSeek, onLoopChange, mode, pixelSize, grid, bands, waveColor, playheadColor, height, children, theme, productionEnabled, className, }: MoveWaveformProps): react_jsx_runtime.JSX.Element | null;

/**
 * The Move's volume-dial readout, offered to the app as a tiny display slot.
 *
 * The MovePanel keeps a dark pill in its header for whatever the volume
 * dial currently means in the app — a playhead time, a zoom level, a gain.
 * The app fills it:
 *
 *   import { MoveVolumeDisplay } from 'tweakers';
 *
 *   MoveVolumeDisplay.set({ label: 'gain', value: '-6.0 dB' });        // static
 *   MoveVolumeDisplay.set({ getValue: () => formatTime(playhead) });   // live
 *   MoveVolumeDisplay.clear();
 *
 * A static `value` renders as-is; a `getValue` is polled every frame while
 * the panel is on screen, for readouts that move (a waveform playhead).
 * When nothing is set, the pill disappears.
 */
interface MoveVolumeDisplayState {
    /** A short name for what the dial edits — dimmed ahead of the value. */
    label?: string;
    /** A static readout string. */
    value?: string;
    /** A live readout, polled per animation frame while the panel is mounted. */
    getValue?: () => string;
}
declare class MoveVolumeDisplayClass {
    private state;
    private listeners;
    /** Show the pill with this readout — replaces any previous one. */
    set(state: MoveVolumeDisplayState): void;
    /** Hide the pill. */
    clear(): void;
    /** The current readout, or null when the pill is hidden. */
    get(): MoveVolumeDisplayState | null;
    /** Notified when the readout is set or cleared. */
    subscribe(listener: () => void): () => void;
    private notify;
}
declare const MoveVolumeDisplay: MoveVolumeDisplayClass;

declare const ICON_MOVE_CAPTURE: {
    viewBox: string;
    path: string;
};
declare const ICON_MOVE_ENTER: {
    viewBox: string;
    circle: {
        cx: string;
        cy: string;
        r: string;
    };
};

/**
 * What an app puts on the Move that its parameters cannot describe.
 *
 * The bridge kit builds pages out of the TweakStore, which covers every
 * control an app declares — dials, switches, value chips. An app that also
 * claims raw hardware (the two bottom pad rows, the sixteen step buttons)
 * owns that part itself and posts it to the surface directly, so the store
 * knows nothing about it. This is the same picture kept for the screen, so
 * the on-screen Move goes on mirroring what is in your hands.
 *
 * Set it from the same code that paints the hardware:
 *
 *   MoveSurfaceStore.claimRows(2);
 *   MoveSurfaceStore.setPads(steps.map((s, i) => ({
 *     x: i % 8, y: i < 8 ? 1 : 0, label: `${i + 17}`, lit: s.on,
 *   })));
 *
 * Leave it alone and the panel behaves exactly as it always has.
 */
/** One pad on a claimed row. `y` is 0 for the bottom row, 1 for the one above. */
interface MovePadCell {
    x: number;
    y: 0 | 1;
    /** What the pad is — a step number, a slice, a note name. */
    label?: string;
    /** CSS colour when lit. Omitted takes the panel's own accent. */
    color?: string;
    /** Lit right now. An unlit pad still shows it exists, dimmed. */
    lit?: boolean;
    /** Nothing here to press — the pad reads as empty rather than dim. */
    empty?: boolean;
}
/** One of the sixteen step buttons, when an app owns them. */
interface MoveStepCell {
    /** 0–15. */
    step: number;
    color?: string;
    lit?: boolean;
}
/** The app's list on the Move's own 128×64 screen. */
interface MoveScreenList {
    title?: string;
    items: string[];
    index: number;
}
interface MoveSurfaceState {
    /** Pad rows the app claimed: 0 (none), 1 (the bottom row), or 2. */
    rows: 0 | 1 | 2;
    pads: MovePadCell[];
    /** null hands the step circles back to the modulation slots. */
    steps: MoveStepCell[] | null;
    screen: MoveScreenList | null;
}
type Listener$2 = () => void;
type PressListener = (pad: {
    x: number;
    y: 0 | 1;
}) => void;
declare const MoveSurfaceStore: {
    getState: () => MoveSurfaceState;
    subscribe(fn: Listener$2): () => void;
    /** How many bottom pad rows the app took (matches `claims.pads` on the wire). */
    claimRows(rows: 0 | 1 | 2): void;
    setPads(pads: MovePadCell[]): void;
    setSteps(steps: MoveStepCell[] | null): void;
    setScreen(screen: MoveScreenList | null): void;
    /** A tap on an on-screen pad, for the host to treat like a hardware press. */
    onPress(fn: PressListener): () => void;
    press(x: number, y: 0 | 1): void;
    /** Hand the whole surface back — the panel returns to its plain layout. */
    reset(): void;
};

/** A row: a plain string, or a value with a separate display label and an
 * optional inline tag pinned to the row's right end. `muted` marks a row the
 * host has nothing to act on — it still walks and selects, it just never
 * brightens, so a list can carry information alongside its choices. */
type ListScreenItem = string | {
    value: string;
    label?: string;
    tag?: string;
    muted?: boolean;
};
interface ListScreenProps {
    /** Rows in display order. */
    items: ListScreenItem[];
    /** The selected item's value. */
    value?: string;
    /** Called with a row's value when it is clicked. */
    onSelect?: (value: string) => void;
    /** 400px with left-aligned rows, instead of the 200px centered default. */
    wide?: boolean;
    className?: string;
    style?: CSSProperties;
}
/**
 * The Move's dark list screen (Figma node "list screen"): a column of
 * single-line rows on the display surface. Unselected rows sit dim at 22%
 * text opacity; the selected row reads at full brightness on a soft
 * highlight. Ten and a half rows show before the screen scrolls — the cut
 * row is the hint that there's more below — and the view follows the
 * selection as it moves. A `muted` row stays dim even when it is the
 * selection: it is information the list carries, not a choice. Purely
 * presentational: the host owns the selection state and any wheel or
 * arrow-key stepping.
 */
declare function ListScreen({ items, value, onSelect, wide, className, style, }: ListScreenProps): ReactElement;

/**
 * The modulation layer's runtime — a singleton beside the TweakStore.
 *
 * It owns the 16 slots, the control assignments, and the engine: one
 * self-halting requestAnimationFrame loop (the TimelineStore's pattern)
 * that advances every internal modulator and mirrors every external
 * source once per frame. Modulated values NEVER enter the TweakStore —
 * consumers pull them at frame time:
 *
 *   const speed = ModulationStore.getValue('fx', 'blob.speed');   // one path
 *   const params = ModulationStore.getValues('fx');               // whole panel
 *
 * Both return the stored base values with the live modulation applied on
 * top, clamped to each control's own bounds. Reading per frame is the
 * contract — nothing is pushed, so frame ordering stays in the app's hands.
 *
 * DSP apps whose modulators live on the audio side register them instead:
 *
 *   ModulationStore.registerSource('lfo-1', { sample: () => native.lfo1 });
 *   // or push at any rate: ModulationStore.setSourceValue('lfo-1', v);
 *
 * A slot pointing at a source shows its signal (circle, dots, step light)
 * but applies nothing to values unless the source says `applies: true` —
 * the app's own engine already did, at audio rate.
 *
 * The assignment gesture: touching a control (`noteTouch`, wired into the
 * panel and the bridge kit) arms it for a few seconds; a step-button press
 * (`assignFromStep`) then creates the slot's modulation if needed and
 * toggles the control onto it.
 *
 * Slots and assignments persist to localStorage (fail-soft, like panel
 * values), so a prototype's modulation setup survives a reload.
 */
/** A touched control stays armed for assignment this long. */
declare const MOD_TOUCH_GRACE_MS = 4000;
interface ModulationSourceConfig {
    /** Pulled once per frame by the engine; omit it to push with `setSourceValue`. */
    sample?: (slot: ModulationSlot) => number;
    /**
     * When true the library applies this source's signal to assigned values.
     * DSP apps that modulate on their own side leave it false (display only).
     */
    applies?: boolean;
}
type ModStepAction = 'created' | 'assigned' | 'unassigned' | 'none';
type Listener$1 = () => void;
declare class ModulationStoreClass {
    private slots;
    private assignments;
    private states;
    private signals;
    private sources;
    private sourceValues;
    private metas;
    private bpm;
    private touched;
    private settingsIndex;
    private settingsUnsub;
    /** The control set the open page was built from — see `shapeOf`. */
    private settingsShape;
    private applyingSettings;
    private structListeners;
    private frameListeners;
    private version;
    private rafId;
    private lastTick;
    constructor();
    /** Create a modulation in a step's slot; an occupied slot is returned as-is. */
    createSlot(index: number, type?: ModulationType): ModulationSlot | null;
    getSlot(index: number): ModulationSlot | null;
    /** The occupied slots, index order — the track row's circles. */
    getSlots(): ModulationSlot[];
    /**
     * Change a slot's settings. A modulator with its own structure folds the
     * patch in its own way (`normalize`) — the curve writes a shape dial into
     * the clip it belongs to — and the open settings page follows.
     */
    updateSlotParams(index: number, patch: ModulationParams): void;
    /** Switch a slot's modulator type — fresh defaults, fresh state. */
    setSlotType(index: number, type: ModulationType): void;
    /** Point a slot at an external source (null returns it to the engine). */
    setSlotSource(index: number, sourceId: string | null): void;
    /** Remove a slot's modulation and every assignment wired to it. */
    removeSlot(index: number): void;
    /**
     * Wire a control to a slot. Only bounded numeric controls (slider, number
     * with min/max) can be modulated; anything else is refused. A control not
     * yet registered is accepted on trust and resolves when its panel appears.
     */
    assign(panelId: string, path: string, slot: number, amount?: number): boolean;
    unassign(panelId: string, path: string): void;
    getAssignment(panelId: string, path: string): ModulationAssignment | undefined;
    getAssignments(): ModulationAssignment[];
    assignmentsForSlot(index: number): ModulationAssignment[];
    setAmount(panelId: string, path: string, amount: number): void;
    /** A finger on a control — panel pointer, hardware knob. Arms assignment. */
    noteTouch(panelId: string, path: string): void;
    /**
     * A step-button press (hardware step or on-screen circle): with a control
     * armed, create the slot's modulation if needed and toggle the control
     * onto it. Returns what happened, for lights and readouts.
     */
    assignFromStep(index: number): {
        action: ModStepAction;
        slot: ModulationSlot | null;
    };
    /**
     * Note on / note off for a slot — what drives a gated modulator like the
     * ADSR:
     *
     *   ModulationStore.gate(0, true);    // key down
     *   ModulationStore.gate(0, false);   // key up — the release runs
     *
     * Free-running types (LFO, S&H) and slots on an external source ignore
     * it. The gate is live state, not a param: it is never persisted.
     */
    gate(index: number, on: boolean): void;
    /**
     * Open a slot's settings (hold its step button): registers one hidden
     * TweakStore panel (`mod-settings`, kind 'modulation') built from the
     * modulator's own control list, with the type enum ahead of it. Every
     * edit on that panel — screen or hardware, the kit syncs it like any
     * page — flows back into the slot's params. Returns the panel id.
     */
    openSettings(index: number): string | null;
    closeSettings(): void;
    /** The open settings page, or null — the panel to render as the Move page. */
    getSettings(): {
        index: number;
        panelId: string;
    } | null;
    /**
     * Where the open page's controls sit — the eight dial slots and the small
     * slots under them. Both surfaces lay the page out from this one list, so
     * they never disagree about which knob a pad belongs to.
     */
    getSettingsLayout(): ModPageLayout | null;
    /** The open page's curve, sampled 0..1, and its name — the preview dial. */
    getSettingsPreview(count?: number): {
        points: number[];
        label: string;
    } | null;
    /** Hardware buttons the open page claims (the curve's arrows and Delete). */
    getSettingsButtons(): string[];
    /** Run a claimed button. False when the page does not claim that name. */
    pressSettingsButton(name: string): boolean;
    /** A knob tap on a page dial that cycles (the curve's clip vocabulary). */
    tapSettingsControl(path: string): boolean;
    private registerSettingsPanel;
    /** A settings-panel edit — screen or hardware — lands in the slot's params. */
    private onSettingsChange;
    /**
     * The open page, after the params moved under it. A change that alters
     * which controls the page shows (the curve's trigger chip appearing) or
     * what they read (an arrow selecting another clip) has to reach the panel
     * — hardware edits arrive there, and the screen renders from it.
     */
    private refreshSettings;
    /** Which controls the page is built from — a rebuild when this changes. */
    private shapeOf;
    /** Offer an app-side modulator to the slots; returns an unregister fn. */
    registerSource(id: string, config?: ModulationSourceConfig): () => void;
    /** Push a source's signal (-1..1) at any rate; the engine mirrors the latest. */
    setSourceValue(id: string, value: number): void;
    getSources(): string[];
    setTempo(bpm: number): void;
    getTempo(): number;
    /** A slot's live signal, -1..1. */
    getSignal(index: number): number;
    /** Where a slot sits in its cycle, 0..1 — a curve composer's playhead. */
    getSlotPhase(index: number): number;
    /** The modulation's contribution to one control, in the control's units. */
    getOffset(panelId: string, path: string): number;
    /**
     * A modulatable control's bounds, or null when it has none (or its panel
     * has not registered yet) — what a display needs to draw the modulation
     * against the control's own span.
     */
    getBounds(panelId: string, path: string): {
        min: number;
        max: number;
    } | null;
    /** One control's value with its modulation applied — the frame-time read. */
    getValue(panelId: string, path: string): number;
    /**
     * A panel's values with every modulation applied — a fresh snapshot per
     * call, meant to be pulled once per frame in place of `TweakStore.getValues`.
     */
    getValues(panelId: string): Record<string, unknown>;
    /** Structural changes: slots, assignments, sources, tempo. */
    subscribe(listener: Listener$1): () => void;
    /** Every engine frame — for pulsing circles, dots, and step lights. */
    subscribeFrames(listener: Listener$1): () => void;
    /** Bumped on every structural change — a stable snapshot for UI stores. */
    getVersion(): number;
    /**
     * Advance every slot by `dt` seconds and refresh the signals. The RAF
     * loop calls this per frame; headless hosts and tests may drive it
     * directly with their own clock.
     */
    tick(dt: number): void;
    /** Wipe every slot, assignment, and the persisted shelf. */
    clear(): void;
    private ensureLoop;
    private loop;
    private resolveMeta;
    private changed;
}
declare const ModulationStore: ModulationStoreClass;

/**
 * Fail-soft browser persistence shared by TweakStore (panel values) and
 * TimelineStore (loop regions). Kept separate so the stores stay node-safe and
 * side-effect-free: nothing here touches `window` at import time, and every
 * storage access is guarded + try/caught. When storage is unavailable (SSR,
 * Safari private mode, blocked cookies) persistence silently degrades to
 * session-only — a broken shelf must never break the tool.
 *
 * Mirrors the style of color-palette-store.ts.
 */
/** Structural mirror of TweakersPersistOptions — duplicated here to keep this
 * module free of a TweakStore import (avoids a store ↔ persist cycle). */
type PersistConfig = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};

type TimelineClipTrackMeta = {
    prop: string;
    /** Step folder keys when the track is a sequence. */
    stepKeys?: string[];
};
type TimelineClipMeta = {
    key: string;
    label: string;
    color: string;
    /** Code-defined playback behavior; intentionally not exposed as a control. */
    loop: 'off' | 'repeat';
    /** Group key when the clip lives inside a nested layer, e.g. "circle". */
    group?: string;
    /** Step folder keys for sequence clips, e.g. ["step1", "step2"]. */
    stepKeys?: string[];
    /** Independent property tracks of a props clip — full rows when expanded. */
    tracks?: TimelineClipTrackMeta[];
};
type TimelineMeta = {
    id: string;
    name: string;
    duration: number;
    loop: boolean;
    /** Loop wraps back to this time, not 0 — clips before it play once
     * (intro-then-idle). 0 loops the whole timeline. */
    loopStart: number;
    clips: TimelineClipMeta[];
};
type TimelineTransport = {
    time: number;
    playing: boolean;
    duration: number;
    /** Completed loop passes — keeps looping clips phase-continuous across
     * timeline wraps. Reset by seek/replay so scrubbing stays deterministic. */
    wraps: number;
};
type Listener = () => void;
/** A user- or code-defined loop window `[start, end]` in seconds. Absent means
 * "loop the whole timeline" — the default for this preview tool. */
type TimelineLoopRegion = {
    start: number;
    end: number;
};
declare class TimelineStoreClass {
    private timelines;
    private transports;
    private listeners;
    private globalListeners;
    private registrationCounts;
    private loopRegions;
    private persistTargets;
    private listCache;
    private rafId;
    private lastTick;
    register(meta: TimelineMeta, options: {
        autoplay: boolean;
        persist?: PersistConfig;
    }): void;
    update(meta: TimelineMeta): void;
    unregister(id: string): void;
    /** Restore a persisted loop region, or seed one from a code-defined
     * `options.loop`. No region at all = loop the whole timeline (the default). */
    private hydrateLoopRegion;
    /** Clamp to [0,duration], order min/max, and reject degenerate widths. */
    private normalizeRegion;
    setLoopRegion(id: string, start: number, end: number): void;
    clearLoopRegion(id: string): void;
    /** The raw user/code region, or undefined when looping the whole timeline.
     * The reference is stable between changes (safe for useSyncExternalStore). */
    getLoopRegion(id: string): TimelineLoopRegion | undefined;
    /** The region the clock actually loops within: the user/code region, or the
     * whole timeline `[0, duration]` when none is set. Playback always wraps. */
    private effectiveRegion;
    play(id: string): void;
    pause(id: string): void;
    replay(id: string): void;
    seek(id: string, time: number): void;
    getTransport(id: string): TimelineTransport;
    getTimeline(id: string): TimelineMeta | undefined;
    getTimelines(): TimelineMeta[];
    subscribe(id: string, listener: Listener): () => void;
    subscribeGlobal(listener: Listener): () => void;
    private applyMeta;
    private ensureLoop;
    private tick;
    private notify;
    private notifyGlobal;
}
declare const TimelineStore: TimelineStoreClass;

type TimelineClipLoop = 'off' | 'repeat';
type TimelineStepValues = {
    [key: string]: TweakConfig[string] | undefined;
};
type TimelineStepConfig = {
    duration?: number;
    to?: TimelineStepValues;
    transition?: TransitionConfig;
};
type TimelinePropStepConfig = {
    duration?: number;
    to?: number | string;
    transition?: TransitionConfig;
};
type TimelinePropConfig = {
    from?: number | string;
    to?: number | string;
    duration?: number;
    /** Offset from the clip's `at` in seconds. */
    delay?: number;
    transition?: TransitionConfig;
    steps?: TimelinePropStepConfig[];
};
type TimelineClipBase = {
    at: number;
    duration?: number;
    transition?: TransitionConfig;
    loop?: boolean | TimelineClipLoop;
};
type TimelineClipConfig = TimelineClipBase & ({
    from?: TweakConfig;
    to?: TweakConfig;
    steps?: never;
    props?: never;
} | {
    from?: TweakConfig;
    to?: never;
    /** Sequential legs on one row — a segmented bar; boundaries retime legs. */
    steps: TimelineStepConfig[];
    props?: never;
} | {
    from?: never;
    to?: never;
    steps?: never;
    /** Independent per-property tracks — mutually exclusive with from/to/steps. */
    props: {
        [prop: string]: TimelinePropConfig;
    };
});
/** Nested keys group clips into a collapsible layer — purely presentational. */
type TimelineGroupConfig = {
    [key: string]: TimelineClipConfig;
};
type TimelineConfig = {
    /** Total timeline length in seconds. Inferred from the last clip when omitted. */
    duration?: number;
} & {
    [key: string]: TimelineClipConfig | TimelineGroupConfig | number | undefined;
};
/** CSS-friendly output for consumers not using Motion — spread into a style. */
type TimelineClipCss = {
    transitionDuration: string;
    transitionTimingFunction: string;
};
type TimelineClipValues<C extends TimelineClipConfig = TimelineClipConfig> = {
    at: number;
    duration: number;
    /** Effective code-defined loop mode. */
    loop: TimelineClipLoop;
    /** Playhead is at or past the clip start. */
    started: boolean;
    /** Playhead is inside the clip — for looping clips, inside any cycle. */
    active: boolean;
    /** Playhead is past the clip end (for looping clips, past the timeline end). */
    done: boolean;
    /**
     * 0–1 position of the playhead within the clip — cycle progress (a
     * sawtooth) for looping clips, sequence progress for steps clips.
     */
    progress: number;
    /** Index of the leg under the playhead, for sequence clips. */
    step: C['steps'] extends TimelineStepConfig[] ? number : undefined;
    from: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['from'] extends TweakConfig ? ResolvedValues<C['from']> : undefined;
    to: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends TweakConfig ? ResolvedValues<C['to']> : undefined;
    /** `to` once the clip has started, `from` before — hand it to Motion's animate.
     * For sequences this is the final merged state; for props clips, per-track
     * endpoint records. */
    animate: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> : Record<string, number | string> | undefined : C['to'] extends TweakConfig ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : ResolvedValues<C['to']> | undefined : undefined;
    /** The clip's editable curve — single-curve clips only. */
    transition: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: TweakConfig;
    } | {
        to: TweakConfig;
    } ? TransitionConfig : undefined;
    /** Duration + timing-function for native CSS transitions — single-curve clips only. */
    css: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: TweakConfig;
    } | {
        to: TweakConfig;
    } ? TimelineClipCss : undefined;
    /**
     * Values interpolated through the clip's curves at the current playhead —
     * bind to style for true scrubbing: the element is exactly at this point
     * in time whether playing, paused, or scrubbing. Sequence clips report the
     * merged state of all legs (declare every animated property in `from`);
     * props clips report every track's value.
     */
    current: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends TweakConfig ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : undefined : undefined;
};
type TimelineGroupValues<G extends TimelineGroupConfig> = {
    [K in keyof G as G[K] extends TimelineClipConfig ? K : never]: TimelineClipValues<Extract<G[K], TimelineClipConfig>>;
};
type TweakTimelineValues<T extends TimelineConfig> = {
    time: number;
    playing: boolean;
    duration: number;
    play: () => void;
    pause: () => void;
    replay: () => void;
    seek: (time: number) => void;
} & {
    [K in keyof T as T[K] extends TimelineClipConfig ? K : never]: TimelineClipValues<Extract<T[K], TimelineClipConfig>>;
} & {
    [K in keyof T as T[K] extends TimelineClipConfig ? never : T[K] extends TimelineGroupConfig ? K : never]: TimelineGroupValues<Extract<T[K], TimelineGroupConfig>>;
};
declare function formatClock(time: number, tenths?: boolean): string;

interface TweakTimelineOptions {
    id?: string;
    persist?: TweakersPersistOptions;
    /** Start playing on mount. Defaults to true. */
    autoplay?: boolean;
    /**
     * Loop when the playhead reaches the end. `true` restarts the whole
     * timeline; `{ from }` wraps back to that time instead, so clips before it
     * play once and looping clips keep cycling forever. Defaults to false.
     */
    loop?: boolean | {
        from: number;
    };
}

type UseTweakTimelineOptions = TweakTimelineOptions;
declare function useTweakTimeline<T extends TimelineConfig>(name: string, config: T, options?: UseTweakTimelineOptions): TweakTimelineValues<T>;

interface TweakTimelineProps {
    theme?: TweakTheme;
    /** Initial dock visibility. Expansion is controlled separately by defaultOpen. */
    defaultVisible?: boolean;
    /** Controlled dock visibility. */
    visible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
    defaultOpen?: boolean;
    productionEnabled?: boolean;
}
declare const TweakTimeline: React$1.NamedExoticComponent<TweakTimelineProps>;

interface ControlRendererProps {
    panelId: string;
    controls: ControlMeta[];
    values: Record<string, TweakValue>;
    /** Optional timeline-owned duration rendered inside the transition editor. */
    transitionDuration?: {
        value: number;
        onChange: (value: number) => void;
        min?: number;
        max?: number;
        step?: number;
    };
}
declare function ControlRenderer({ panelId, controls, values, transitionDuration }: ControlRendererProps): react_jsx_runtime.JSX.Element;

interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /**
     * Override the displayed value text. When provided, the formatter owns the
     * full label and `unit` is not auto-appended. Inline editing still operates
     * on the raw numeric value.
     */
    formatValue?: (value: number) => string;
    /**
     * Render a custom node (e.g. an icon or gauge) in the value slot instead of
     * the editable numeric text. Sliders with a `valueIcon` are not editable.
     */
    valueIcon?: ReactNode;
    /**
     * Anchor the fill at this value instead of `min`. For bipolar parameters
     * (e.g. -1..1) the fill grows out from the origin toward the handle in
     * either direction, and a soft, escapable detent snaps the value to the
     * origin while dragging. Defaults to `min` (classic left-anchored fill,
     * no detent — fully backwards compatible).
     */
    origin?: number;
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar?: boolean;
    /**
     * `vertical` renders the 77px column card: fill grows bottom-up, label sits
     * at the base, and the value readout appears over the fill on hover/drag.
     * Vertical sliders flex to their container width — place them in a flex row.
     */
    orientation?: 'horizontal' | 'vertical';
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Slider({ label, value, onChange, min, max, step, unit, formatValue, valueIcon, origin, bipolar, orientation, shortcut, shortcutActive, }: SliderProps): react_jsx_runtime.JSX.Element;

interface NumberControlProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /** Override the displayed value text; `unit` is not auto-appended. */
    formatValue?: (value: number) => string;
    /** `vertical` stacks the label above a centered value (column card). */
    orientation?: 'horizontal' | 'vertical';
}
/**
 * Numeric readout card. Drag anywhere on the card to scrub the value
 * (Shift = ×10, Alt = ×0.1); a plain click opens inline text entry.
 */
declare function NumberControl({ label, value, onChange, min, max, step, unit, formatValue, orientation, }: NumberControlProps): react_jsx_runtime.JSX.Element;

interface RangeSliderProps {
    label: string;
    value: RangeValue;
    onChange: (value: RangeValue) => void;
    /** Lower bound of the track. */
    min?: number;
    /** Upper bound of the track. */
    max?: number;
    step?: number;
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue?: RangeValue;
}
declare function RangeSlider({ label, value: rawValue, onChange, min, max, step, defaultValue, }: RangeSliderProps): react_jsx_runtime.JSX.Element;

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Accessible name — the visible label is rendered by the caller. */
    label?: string;
    /** The control exists but cannot act right now: reads as a dash, not a
     *  blank box, so "unavailable" never looks like "off". */
    disabled?: boolean;
    id?: string;
}
/**
 * A compact tri-state box: on (a filled chip), off (a slash), and disabled
 * (a dash).
 *
 * This replaces the Off/On segmented pair for boolean rows and module
 * headers. A two-tab switch spends ~84px and a whole row of attention on
 * one bit; a box spends 22px and reads instantly. The segmented control
 * stays where it belongs — three or more genuinely different modes.
 *
 * All three marks are always in the DOM; CSS reveals one from the data
 * attributes, so the state swap animates without any motion code.
 */
declare function Checkbox({ checked, onChange, label, disabled, id }: CheckboxProps): react_jsx_runtime.JSX.Element;

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Toggle({ label, checked, onChange, shortcut, shortcutActive }: ToggleProps): react_jsx_runtime.JSX.Element;

interface FolderProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
    collapsible?: boolean;
    isRoot?: boolean;
    inline?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    toolbar?: ReactNode;
    /** Root only — the tab bar, riding the panel header under the toolbar. */
    tabs?: ReactNode;
    /** One line of help for the section, revealed on hover over the header. */
    hint?: string;
    hintId?: string;
    /**
     * Root only — the panel declared `_enabled`, so the whole panel is a module:
     * the title carries the switch and the body goes away when it is off. Same
     * idiom as ModuleFolder, one level up.
     */
    enabled?: boolean;
    onEnabledChange?: (enabled: boolean) => void;
}
declare function Folder({ title, children, defaultOpen, collapsible, isRoot, inline, onOpenChange, toolbar, tabs, hint, hintId, enabled, onEnabledChange }: FolderProps): react_jsx_runtime.JSX.Element;

interface ControlShellProps {
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint?: string;
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title?: string;
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: string;
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance?: AffordanceConfig;
    /** Required alongside `affordance` — together they address the status slice. */
    panelId?: string;
    path?: string;
    children: ReactNode;
}
/**
 * The chrome around one leaf control: a hint tooltip and an affordance dot.
 * Both are optional, and a control with neither renders just the wrapper plus
 * the config-path tooltip.
 */
declare function ControlShell({ hint, title, id, affordance, panelId, path, children }: ControlShellProps): react_jsx_runtime.JSX.Element;

interface ModuleProps {
    title: string;
    /** Whether the module is on. The Off/On switch is the expand control:
     *  off collapses the body away, on reveals it. */
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    children: ReactNode;
}
/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit (synth layers, effect sends, optional
 * feature groups). The switch doubles as the expand control: disabling
 * collapses the body away with a smooth height transition.
 */
declare function Module({ title, enabled, onEnabledChange, children }: ModuleProps): react_jsx_runtime.JSX.Element;

interface SegmentedControlOption<T extends string> {
    value: T;
    label: string;
}
interface SegmentedControlProps<T extends string> {
    options: SegmentedControlOption<T>[];
    value: T;
    onChange: (value: T) => void;
}
declare function SegmentedControl<T extends string>({ options, value, onChange, }: SegmentedControlProps<T>): react_jsx_runtime.JSX.Element;

interface ButtonGroupProps {
    buttons: Array<{
        label: string;
        onClick: () => void;
    }>;
}
declare function ButtonGroup({ buttons }: ButtonGroupProps): react_jsx_runtime.JSX.Element;

interface SpringControlProps {
    panelId: string;
    path: string;
    label: string;
    spring: SpringConfig;
    onChange: (spring: SpringConfig) => void;
}
declare function SpringControl({ panelId, path, label, spring, onChange }: SpringControlProps): react_jsx_runtime.JSX.Element;

interface SpringVisualizationProps {
    spring: SpringConfig;
    isSimpleMode: boolean;
}
declare function SpringVisualization({ spring, isSimpleMode }: SpringVisualizationProps): react_jsx_runtime.JSX.Element;

interface TransitionControlProps {
    panelId: string;
    path: string;
    label: string;
    value: TransitionConfig;
    onChange: (value: TransitionConfig) => void;
    /** Hide duration sliders when something else owns the duration (e.g. a timeline clip bar). */
    hideDuration?: boolean;
    /** Route duration edits through an external owner while keeping this control's layout. */
    durationControl?: {
        value: number;
        onChange: (value: number) => void;
        min?: number;
        max?: number;
        step?: number;
    };
}
declare function TransitionControl({ panelId, path, label, value, onChange, hideDuration, durationControl, }: TransitionControlProps): react_jsx_runtime.JSX.Element;

interface EasingVisualizationProps {
    easing: EasingConfig;
}
declare function EasingVisualization({ easing }: EasingVisualizationProps): react_jsx_runtime.JSX.Element;

interface WaveformVisualizationProps {
    /** Decoded audio sample. Its full waveform is drawn once (fixed). */
    buffer?: AudioBuffer | null;
    /** Playhead position, 0..1. */
    progress?: number;
    /**
     * Polled every frame for a buttery playhead without re-rendering the parent.
     * Overrides `progress` when provided — return the current play position (0..1).
     */
    getProgress?: () => number;
    /**
     * 'smooth' — a simplified, SVG-like envelope: few points, Catmull-Rom
     * interpolation, solid fill (the gist of the sample's dynamics).
     * 'pixelated' — crisp, chunky per-column min/max bars.
     */
    mode?: WaveformMode;
    /**
     * Smooth mode only. When false (default) the shape is a solid fill; when true
     * it becomes a translucent fill with a crisp outline.
     */
    border?: boolean;
    /** Split the sample into low / mid / high bands (three color-coded shapes). */
    bands?: boolean;
    /**
     * Pixelated mode only: block-size multiplier. 1 (default) ≈ one CSS pixel per
     * column; 2 / 4 / 6 make progressively chunkier, lower-resolution columns.
     */
    pixelSize?: number;
    /** Overlay a faint reference grid (vertical time-divisions) behind the waveform. */
    grid?: boolean;
    /** Vertical time-divisions in the grid when `grid` is on (default 8). */
    gridSubdivisions?: number;
    /**
     * Click-to-seek. When provided, clicking the waveform reports the new play
     * position (0..1); a click also clears any active loop.
     */
    onSeek?: (progress: number) => void;
    /** The active loop region to render (controlled), or null for none. */
    loop?: WaveformLoop | null;
    /**
     * Drag-to-loop. When provided, dragging across the waveform reports a loop
     * region; drag either edge to resize it; clicking reports null (loop cleared).
     */
    onLoopChange?: (loop: WaveformLoop | null) => void;
    /** Waveform color (single waveform only; bands keep their fixed colors). Defaults to the theme color. */
    waveColor?: string;
    /** Playhead color; the loop band derives from it at a lower opacity. Defaults to the theme color. */
    playheadColor?: string;
    /** When true, selecting a loop auto-zooms to frame it (manual zoom resumes once the loop is cleared). */
    autoZoomOnLoop?: boolean;
    /**
     * Magnification, 1 = the whole sample. Passing it takes the zoom over — the
     * buttons stand down and the host drives it (the Move's wheel, say). Left
     * out, the component keeps its own zoom and its own buttons.
     */
    zoom?: number;
    width?: number;
    height?: number;
}
declare function WaveformVisualization({ buffer, progress, getProgress, mode, border, bands, pixelSize, grid, gridSubdivisions, onSeek, loop, onLoopChange, waveColor, playheadColor, autoZoomOnLoop, zoom: zoomProp, width, height, }: WaveformVisualizationProps): react_jsx_runtime.JSX.Element;

type AnalyserScale = 'log' | 'linear';
/** `true` enables the default spring; an object overrides stiffness/damping. */
type AnalyserSpring = boolean | {
    stiffness?: number;
    damping?: number;
};

type AnalyserSource = 'frequency' | 'waveform' | 'ekg';
type AnalyserVariant = 'line' | 'area';
type AnalyserMode = 'smooth' | 'pixelated';

interface AnalyserVisualizationProps {
    /**
     * The Web Audio analyser to visualize. Purely observed — the component never
     * mutates it, so fftSize, smoothingTimeConstant, and the minDecibels..maxDecibels
     * window (which the byte data maps onto) stay under the host's control.
     */
    analyser?: AnalyserNode | null;
    /**
     * 'frequency' — live spectrum (EQ-style). 'waveform' — time-domain oscilloscope.
     * 'ekg' — a medical-monitor trace: a pen dot fixed at the right edge rides the
     * signal's level while the history it draws streams away to the left.
     */
    source?: AnalyserSource;
    /** 'area' — translucent fill under the trace plus a crisp outline. 'line' — outline only. */
    variant?: AnalyserVariant;
    /**
     * 'smooth' — a simplified, interpolated trace. 'pixelated' — crisp, chunky
     * per-column blocks (the waveform visualizer's pixel language).
     */
    mode?: AnalyserMode;
    /**
     * Pixelated mode only: block-size multiplier. 1 (default) ≈ one CSS pixel per
     * column; 2 / 4 / 6 make progressively chunkier, lower-resolution columns.
     */
    pixelSize?: number;
    /** Frequency-axis spacing for the spectrum: 'log' (default, musical) or 'linear'. */
    scale?: AnalyserScale;
    /**
     * Spring-smooth the trace's movement (render-side; composes with the analyser's
     * own data-side smoothingTimeConstant — the spring can overshoot, that never does).
     * `true` for the default feel, or `{ stiffness, damping }` to tune it.
     */
    spring?: AnalyserSpring;
    /** Overlay a faint reference grid (vertical divisions) behind the trace. */
    grid?: boolean;
    /** Vertical divisions in the grid when `grid` is on (default 8). */
    gridSubdivisions?: number;
    /** Trace color. Defaults to the theme color. */
    waveColor?: string;
    /** Area-fill color (drawn translucent). Defaults to `waveColor`. */
    fillColor?: string;
    /**
     * Controlled mute state: dims the trace as feedback. The analyser is a passive
     * tap, so actually silencing the channel is the host's job (gain routing).
     */
    muted?: boolean;
    /** Shows the mute button; called with the requested state on click. */
    onMuteChange?: (muted: boolean) => void;
    /** Controlled solo state (cross-channel — the host owns what "solo" silences). */
    soloed?: boolean;
    /** Shows the solo button; called with the requested state on click. */
    onSoloChange?: (soloed: boolean) => void;
    /** Spectrum only: confine the display to this frequency window in Hz. */
    rangeHz?: readonly [number, number] | null;
    /** Spectrum only: a live vertical reference in Hz, read every frame. */
    marker?: (() => number | null) | null;
    width?: number;
    height?: number;
}
declare function AnalyserVisualization({ analyser, source, variant, mode, pixelSize, scale, spring, grid, gridSubdivisions, waveColor, fillColor, muted, onMuteChange, soloed, onSoloChange, rangeHz, marker, width, height, }: AnalyserVisualizationProps): react_jsx_runtime.JSX.Element;

interface AnalyserRowProps {
    panelId: string;
    control: ControlMeta;
}
/**
 * The read-only `{ type: 'analyser' }` row: the standalone
 * `AnalyserVisualization` embedded on a control surface. The whole row config
 * (including its two closures — the AnalyserNode getter and the live marker)
 * lives on the ControlMeta and is swapped in place by
 * `TweakStore.syncCurveConfigs`, exactly like the curve row's sampler; this
 * subscribes on the control-state channel and re-reads each swap, which is
 * also what picks up an AnalyserNode that only exists after the host's audio
 * context starts.
 *
 * The canvas engine needs a pixel width, and a panel column's width is the
 * layout's business — so the row measures itself and follows.
 */
declare function AnalyserRow({ panelId, control }: AnalyserRowProps): react_jsx_runtime.JSX.Element;

interface CurveComposerProps {
    /** The curve series (controlled). */
    segments: CurveSegment[];
    /** The stacked driver curve, or null for none (adds a second lane below). */
    driver?: CurveDriver | null;
    /** Playback direction for the demo playhead (forward / mirror / reverse). */
    direction?: DriverDirection;
    /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
    onSegmentsChange?: (segments: CurveSegment[]) => void;
    /** Commit a changed driver — fired live during driver drags and on click-cycle. */
    onDriverChange?: (driver: CurveDriver) => void;
    /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
    getPhase?: () => number;
    /** Static transport phase 0..1 (used when `getPhase` is absent). */
    phase?: number;
    /**
     * Output mode. 'continuous' (default) reads the composed value each frame; 'trigger'
     * emits a discrete signal (via `onTrigger`) when the composed value crosses one of the
     * evenly-spaced trigger levels. The component itself draws no trigger UI — visualization
     * (e.g. markers on the output track) is the consumer's job; see `onTrigger`.
     *
     * Trigger firing is direction-symmetric: interior levels fire in whichever direction the
     * value travels, so it works under `direction: 'forward' | 'mirror' | 'reverse'`.
     */
    mode?: 'continuous' | 'trigger';
    /** Number of trigger levels in trigger mode (first at 0, last at 1, evenly spaced in value). Default 5. */
    triggerSteps?: number;
    /** Fired in trigger mode when the value crosses a trigger level; `index` is into `triggerLevels`. */
    onTrigger?: (index: number) => void;
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex?: number | null;
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect?: (index: number) => void;
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor?: string;
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor?: string;
    /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
    gap?: number;
    /** Faint vertical reference grid behind each lane. */
    grid?: boolean;
    gridSubdivisions?: number;
    width?: number;
    /** Height of the main lane; the driver lane adds height below it. */
    height?: number;
}
declare function CurveComposer({ segments, driver, direction, onSegmentsChange, onDriverChange, getPhase, phase, mode, triggerSteps, onTrigger, selectedIndex, onSelect, gap, curveColor, playheadColor, grid, gridSubdivisions, width, height, }: CurveComposerProps): react_jsx_runtime.JSX.Element;

interface TextControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
declare function TextControl({ label, value, onChange, placeholder }: TextControlProps): react_jsx_runtime.JSX.Element;

type SelectOption = string | {
    value: string;
    label: string;
};
interface SelectControlProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
}
declare function SelectControl({ label, value, options, onChange }: SelectControlProps): react_jsx_runtime.JSX.Element;

interface ColorControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
}
declare function ColorControl({ label, value, onChange, alpha, palette }: ColorControlProps): react_jsx_runtime.JSX.Element;

interface ColorPickerPanelProps {
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
}
declare function ColorPickerPanel({ value, onChange, alpha, palette }: ColorPickerPanelProps): react_jsx_runtime.JSX.Element;

interface GradientControlProps {
    label: string;
    value: GradientValue;
    onChange: (value: GradientValue) => void;
}
declare function GradientControl({ label, value, onChange }: GradientControlProps): react_jsx_runtime.JSX.Element;

interface GradientPanelProps {
    value: GradientValue;
    onChange: (value: GradientValue) => void;
    /** Incremental pointer delta while the drag grip is held. */
    onDrag?: (dx: number, dy: number) => void;
}
declare function GradientPanel({ value, onChange, onDrag }: GradientPanelProps): react_jsx_runtime.JSX.Element;

interface XYPadProps {
    label: string;
    value: XYValue;
    onChange: (value: XYValue) => void;
    /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
    x?: XYAxis;
    /** Vertical axis, Cartesian (top = max). Same defaults as x. */
    y?: XYAxis;
    /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
    size?: number;
    /**
     * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
     * faint at rest and stronger on interaction. Pass `false` to hide it, or a
     * number for a uniform N×N count. `density` multiplies whichever grid applies.
     */
    grid?: boolean | number;
    /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density?: number;
    /** Snap the emitted value to each axis's step. Default false (continuous). */
    snap?: boolean;
    /** Spring back to centre on release (joystick). Default false = hold. */
    returnToCenter?: boolean;
    /** Show the live value next to each axis label (default false = label only). */
    showValues?: boolean;
    disabled?: boolean;
    /** Override the readout / aria-valuetext text. Owns the full string. */
    formatValue?: (value: XYValue) => string;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
/**
 * Standalone 2D value pad. A single focusable surface with an absolutely
 * positioned thumb; pointer press places-and-grabs, arrows nudge, and an
 * optional return-to-centre springs the thumb home on release. All value
 * math (mapping, clamping, snapping, nudging, detent) lives in xy-pad-core.
 *
 * The thumb/guides are positioned purely from the `value` prop via CSS
 * `left%`/`top%` (the ColorPickerPanel SV-thumb idiom), so the four ports render
 * identical markup with no animation library. Smooth motion for keyboard nudges
 * and return-to-centre comes from a CSS transition that is disabled during drag
 * (via `data-dragging`), keeping drags instant.
 */
declare function XYPad({ label, value, onChange, x, y, size, grid, density, snap, returnToCenter, showValues, disabled, formatValue, shortcut, shortcutActive, }: XYPadProps): react_jsx_runtime.JSX.Element;

interface XYControlProps {
    label: string;
    value: XYValue;
    onChange: (value: XYValue) => void;
    x?: XYAxis;
    y?: XYAxis;
    grid?: boolean | number;
    density?: number;
    snap?: boolean;
    returnToCenter?: boolean;
    showValues?: boolean;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
/**
 * Config wrapper for the XY pad — the `{ type: 'xy' }` case. Reads the resolved
 * ControlMeta fields and forwards them to the standalone XYPad, mirroring how
 * ColorControl wraps ColorPickerPanel.
 */
declare function XYControl({ label, value, onChange, x, y, grid, density, snap, returnToCenter, showValues, shortcut, shortcutActive }: XYControlProps): react_jsx_runtime.JSX.Element;

interface GalleryControlProps {
    label: string;
    value: string;
    items: GalleryItem[];
    onChange: (id: string) => void;
    /** Masonry column count for the open grid. Default 2. */
    columns?: number;
}
declare function GalleryControl({ label, value, items, onChange, columns }: GalleryControlProps): react_jsx_runtime.JSX.Element;

interface FileControlProps {
    label: string;
    value: string;
    accept?: string;
    multiple?: boolean;
    onChange: (filename: string) => void;
    onPick: (files: FileList) => void;
}
declare function FileControl({ label, value, accept, multiple, onChange, onPick }: FileControlProps): react_jsx_runtime.JSX.Element;

interface SwatchControlProps {
    label: string;
    value: string;
    options: SwatchOption[];
    onChange: (value: string) => void;
}
declare function SwatchControl({ label, value, options, onChange }: SwatchControlProps): react_jsx_runtime.JSX.Element;

interface ChipsControlProps {
    label: string;
    value: string;
    options: ChipOption[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}
declare function ChipsControl({ label, value, options, onChange, onRemove }: ChipsControlProps): react_jsx_runtime.JSX.Element;

interface MultiSelectControlProps {
    label: string;
    value: string[];
    options: MultiSelectOption[];
    onChange: (value: string[]) => void;
}
declare function MultiSelectControl({ label, value, options, onChange }: MultiSelectControlProps): react_jsx_runtime.JSX.Element;

interface ListControlProps {
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    /** Structural signal for engines that bridge list ops imperatively. */
    onEvent: (event: TweakEvent) => void;
}
declare function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent }: ListControlProps): react_jsx_runtime.JSX.Element;

interface CurvePreviewProps {
    panelId: string;
    control: ControlMeta;
}
/**
 * The read-only `{ type: 'curve' }` row: draws the host-supplied sampler on a
 * control surface. The sampler and markers live on the ControlMeta and are
 * swapped in place by TweakStore.syncCurveConfigs (functions are invisible to
 * the config diff; markers ride the same sync), with the swap announced on the
 * control-state channel — so this subscribes there and re-reads each snapshot.
 */
declare function CurvePreview({ panelId, control }: CurvePreviewProps): react_jsx_runtime.JSX.Element;

type CurvePoint = {
    /** Sample position, 0..1 across the row's width. */
    t: number;
    /** Normalized value, 0..1 within the fitted domain (0 = domain min). */
    v: number;
};
type CurvePlot = {
    /**
     * Polyline segments in normalized [0,1]² space. Non-finite samples are
     * skipped and split the stroke, so a partially-defined curve still draws
     * its defined stretches.
     */
    segments: CurvePoint[][];
    /** The y-range the segments were fitted to (explicit, or auto-fit + padding). */
    domain: [number, number];
    /** Normalized position of y=0 when the domain spans it, else null. */
    baseline: number | null;
};
declare const CURVE_SAMPLE_COUNT = 160;
declare const CURVE_MIN_HEIGHT = 32;
declare const CURVE_MAX_HEIGHT = 160;
declare const CURVE_DEFAULT_HEIGHT = 64;
/** Auto-fit headroom on each side, as a fraction of the value span. */
declare const CURVE_FIT_PADDING = 0.05;
/** Resolve a curve config's height: default 64, clamped to a sensible band. */
declare function clampCurveHeight(height?: number): number;
/**
 * Sample a host-supplied curve across t ∈ [0,1] and normalize it into unit
 * space. A throwing or non-finite sample never poisons the plot: that point is
 * dropped and the stroke breaks around it. An invalid or degenerate explicit
 * domain (non-finite, or min ≥ max) falls back to auto-fit.
 */
declare function plotCurve(sample: (t: number) => number, options?: {
    count?: number;
    domain?: [number, number];
}): CurvePlot;
/**
 * Filter reference markers down to drawable x positions: finite numbers in
 * [0, 1]. Out-of-range or non-finite entries are skipped, never clamped — a
 * marker is a reference line, and moving it would lie about where it sits.
 */
declare function normalizeCurveMarkers(markers?: readonly number[]): number[];
/** Map a normalized value (0 = domain min) to a y pixel, inset by `pad`. */
declare function curveY(v: number, height: number, pad?: number): number;
/** SVG path data for a plot's segments; each segment is its own subpath. */
declare function curvePathData(segments: CurvePoint[][], width: number, height: number, pad?: number): string;

interface PresetManagerProps {
    panelId: string;
    presets: {
        id: string;
        name: string;
        deletable?: boolean;
        renamable?: boolean;
    }[];
    activePresetId: string | null;
    onAdd: () => void;
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode?: boolean;
    /**
     * Bumped by the host after "+": the dropdown opens and the active preset's
     * name goes straight into inline edit, so a fresh preset gets its name in
     * the same gesture that created it.
     */
    editSignal?: number;
}
declare function PresetManager({ panelId, presets, activePresetId, onAdd, providerMode, editSignal }: PresetManagerProps): react_jsx_runtime.JSX.Element;

interface ShortcutsMenuProps {
    panelId: string;
}
declare function ShortcutsMenu({ panelId }: ShortcutsMenuProps): react_jsx_runtime.JSX.Element | null;

type AudioLevelMeterMode = 'mono' | 'stereo' | 'spectrum';
type AudioLevelMeterColors = readonly [
    low: string,
    middle?: string,
    high?: string
];
interface AudioLevelMeterBaseProps {
    /** Accessible name for the read-only visualization. */
    label?: string;
    /** One to three colors, ordered from the lowest to the highest cells. */
    colors?: AudioLevelMeterColors;
    /** Number of cells in each band. Rounded and clamped to 8–12. */
    cellCount?: number;
    className?: string;
    style?: CSSProperties;
}
interface MonoAudioLevelMeterProps extends AudioLevelMeterBaseProps {
    mode?: 'mono';
    /** Current normalized audio level. Values above 1 trigger clipping. */
    levels: number;
}
interface StereoAudioLevelMeterProps extends AudioLevelMeterBaseProps {
    mode: 'stereo';
    /** Current normalized left and right audio levels. */
    levels: readonly [left: number, right: number];
}
interface SpectrumAudioLevelMeterProps extends AudioLevelMeterBaseProps {
    mode: 'spectrum';
    /** Current normalized spectrum levels. The first 1–12 entries become bands. */
    levels: readonly number[];
}
type AudioLevelMeterProps = MonoAudioLevelMeterProps | StereoAudioLevelMeterProps | SpectrumAudioLevelMeterProps;
declare function AudioLevelMeter(props: AudioLevelMeterProps): ReactElement;

export { ADSR_DEF, ADSR_STAGE_MAX, type ActionConfig, type AffordanceConfig, type AffordanceContext, type AffordanceStatus, type AnalyserConfig, type AnalyserMode, AnalyserRow, type AnalyserScale, type AnalyserSource, type AnalyserSpring, type AnalyserVariant, AnalyserVisualization, AudioLevelMeter, type AudioLevelMeterColors, type AudioLevelMeterMode, type AudioLevelMeterProps, type AxisSpec, ButtonGroup, COLOR_FORMATS, CURVE_CYCLE, CURVE_DEF, CURVE_DEFAULT_HEIGHT, CURVE_FIT_PADDING, CURVE_LABELS, CURVE_MAX_CLIPS, CURVE_MAX_DURATION, CURVE_MAX_HEIGHT, CURVE_MIN_DURATION, CURVE_MIN_HEIGHT, CURVE_SAMPLE_COUNT, Checkbox, type ChipOption, type ChipsConfig, ChipsControl, type ColorConfig, ColorControl, type ColorFormat, ColorPickerPanel, type CompositionRead, type CompositionSamplers, type ControlMeta, ControlRenderer, ControlShell, CurveComposer, type CurveComposition, type CurveConfig, type CurveDriver, type CurvePlot, type CurvePoint, CurvePreview, type CurveSegment, type CurveType, DEFAULT_GRADIENT, DEFAULT_TRIGGER_STEPS, type DriverDirection, type EasingConfig, EasingVisualization, type EnvStage, FILTER_DB_CEIL, FILTER_DB_FLOOR, type FileConfig, FileControl, type FilterAxis, type FilterAxisConfig, type FilterConfig, FilterControl, type FilterResponse, type FilterShapeType, type FilterValue, Folder, type GalleryConfig, GalleryControl, type GalleryItem, type GradientConfig, GradientControl, GradientPanel, type GradientStop, type GradientTransform, type GradientType, type GradientValue, type HSLA, type HSVA, ICON_MOVE_CAPTURE, ICON_MOVE_ENTER, LFO_DEF, LFO_SYNC_DIVISIONS, type ListConfig, ListControl, type ListField, type ListFieldGroup, type ListFieldKind, type ListItemField, type ListItemType, type ListItemValue, ListScreen, type ListScreenItem, type ListScreenProps, MIN_STOPS, MOD_COLORS, MOD_PAGE_DIALS, MOD_RING_CIRCUMFERENCE, MOD_RING_RADIUS, MOD_SETTINGS_PANEL, MOD_SLOTS, MOD_TOUCH_GRACE_MS, MOVE_DIALS, MOVE_FUNCTION_BUTTONS, MOVE_FUNCTION_MANIFEST, MOVE_PADS, MOVE_SLOT_LIBRARY, MOVE_SPECIAL_BUTTONS, MOVE_TRACKS, MOVE_WAVEFORM_STEPS, type ModControlMeta, type ModPageLayout, type ModPageSlot, type ModStepAction, type ModTypeDef, type ModulationAssignment, type ModulationParamValue, type ModulationParams, type ModulationSlot, type ModulationSourceConfig, ModulationStore, type ModulationType, Module, type MonoAudioLevelMeterProps, MoveActionButton, type MoveActionButtonProps, type MoveFunctionButton, type MoveFunctionHandler, type MoveFunctionOptions, type MoveFunctionPress, type MoveFunctionRunListener, MoveFunctions, type MovePadCell, type MovePage, MovePanel, type MoveScreenList, MoveSlotDefaultBody, MoveSlotEnumBody, MoveSlotEnvBody, MoveSlotFilterBody, MoveSlotGlyph, type MoveSlotKind, MoveSlotRangeBody, MoveSlotReadout, MoveSlotShape, type MoveStepCell, type MoveSurfaceState, MoveSurfaceStore, MoveVolumeDisplay, type MoveVolumeDisplayState, MoveWaveform, type MoveWaveformProps, MoveWaveformStore, type MoveWaveformVariant, type MoveWaveformView, type MultiSelectConfig, MultiSelectControl, type MultiSelectOption, type NumberConfig, NumberControl, type OKLCH, type PanelConfig, type Point, type Preset, type PresetItem, PresetManager, type PresetProvider, type PresetProviderPreset, type RGBA, type RangeConfig, RangeSlider, type RangeValue, type ResolvedValues, SH_DEF, type Sampler, SegmentedControl, type SelectConfig, SelectControl, type ShortcutConfig, type ShortcutInteraction, type ShortcutMode, ShortcutsMenu, Slider, type SliderConfig, type SpectrumAudioLevelMeterProps, type SpringConfig, SpringControl, SpringVisualization, type SpringifyOptions, type StereoAudioLevelMeterProps, type SwatchConfig, SwatchControl, type SwatchOption, TAB_PATH, type TextConfig, TextControl, type TimelineClipConfig, type TimelineClipCss, type TimelineClipLoop, type TimelineClipMeta, type TimelineClipTrackMeta, type TimelineClipValues, type TimelineConfig, type TimelineGroupConfig, type TimelineGroupValues, type TimelineMeta, type TimelinePropConfig, type TimelinePropStepConfig, type TimelineStepConfig, type TimelineStepValues, TimelineStore, type TimelineTransport, Toggle, type TransitionConfig, TransitionControl, type TweakConfig, type TweakEvent, type TweakMode, type TweakPosition, TweakRoot, TweakStore, type TweakTheme, TweakTimeline, type TweakTimelineProps, type TweakTimelineValues, type TweakValue, type UseTweakTimelineOptions, type UseTweakersOptions, type WaveformLoop, type WaveformMode, WaveformVisualization, type XYAxis, type XYConfig, XYControl, XYPad, type XYPadProps, type XYValue, XY_DEFAULT_STEP, XY_DETENT_PX, addDriver, addStop, applyDetentAxis, applyModulation, buildModMovePage, buildMovePages, buildSamplers, centerValue, clamp, clampCurveHeight, clampOklchToSrgb, clampRange, colorAtPosition, curveComposition, curveDuration, curvePathData, curveY, cycleDriverType, cycleSegmentType, defaultComposition, defaultFilterResponse, defaultListItemParams, denormalizeEnumDial, denormalizeFilterDial, denormalizeRangeDial, dialOrigin, dialSpan, displayHex, enumOptionIcon, envelopePoints, filterHand01, filterHandValue, filterResponsePath, filterShapePath, filterShapeResponse, flipDriver, flipDriverX, flipDriverY, flipSegment, flipSegmentX, flipSegmentY, formatClock, formatHex, getModType, gradientFillBox, gradientToCss, gradientToTransform, groupListFields, handleLeftStyles, hintDomId, hslToRgb, hsvToRgb, invertY, isOutsideSpan, isSpanContinuation, lfoSyncedHz, listModTypes, loopFromStep, loopSteps, modColor, modKey, modPageLayout, modPageWidth, modRingArc, moveAppPadRow, movePadRows, moveSlotKind, moveStop, defaultView as moveWaveformDefaultView, nearestHandle, normToValue, normalizeCurveMarkers, normalizeDial, normalizeEnumDial, normalizeFilterDial, normalizeFilterValue, normalizeGradient, normalizeHex, normalizeListItems, normalizeRangeDial, normalizeValue, normalizeXYDial, nudge, oklchToRgb, opacityPercent, orderRange, parseHex, parseListItemSchema, percentToValue, pickDragTarget, plotCurve, pointFromValue, readComposition, redistributeWeight, registerModType, removeDriver, removeSegment, removeStop, resolveAxis, resolveFilterAxis, rgbToHsl, rgbToHsv, rgbToOklch, scrubBy, setDriverAnticipate, setDriverCurvature, setDriverOvershoot, setDriverSteepness, setGradientAngle, setGradientCenter, setGradientRotation, setGradientScale, setGradientSquash, setGradientType, setHigh, setLow, setSegmentAnticipate, setSegmentCurvature, setSegmentOvershoot, setSegmentSteepness, setStopColor, shiftSpan, snapToStep, splitSegment, springify, stepPosition, triggerLevels, triggersCrossed, useTweakTimeline, useTweakers, valueFromPoint, valueToNorm, valueToPercent, visibleColumns, visibleModControls, zoomBy };
