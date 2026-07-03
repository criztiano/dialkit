export { LONG_PRESS_MS, PALETTE_DRAG_CANCEL_PX } from './color-core.js';

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
    /** Radial extent as % of the box, 10–200. Absent = 100 (fills to a circle). */
    scale?: number;
    /** Radial ovality, 0–100. 0 = round; higher flattens one axis. Absent = 0. */
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
/** Vertical travel off the strip that arms Photoshop-style stop removal. */
declare const STOP_DETACH_PX = 24;
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

export { DEFAULT_GRADIENT, type GradientStop, type GradientTransform, type GradientType, type GradientValue, MIN_STOPS, STOP_DETACH_PX, addStop, colorAtPosition, gradientToCss, gradientToTransform, moveStop, normalizeGradient, removeStop, setGradientAngle, setGradientCenter, setGradientRotation, setGradientScale, setGradientSquash, setGradientType, setStopColor };
