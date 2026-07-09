// Framework-agnostic logic for the XY Pad — the 2D counterpart of the slider/curve
// helpers. It owns no DOM and imports nothing: just the axis model, the value↔screen
// mapping math, step snapping, keyboard nudging, and the escapable centre detent. Each
// framework wrapper (React/Solid/Vue/Svelte) renders the pad and wires pointer/keyboard
// events, calling into these pure helpers so the math is written once.
//
// COORDINATE CONTRACT. There are two spaces:
//   • Cartesian *value* space — what the app sees. y increases UP (yMax is the top).
//   • Screen-normalized *point* space — {x,y} each in [0,1], matching CSS left%/top%.
//     Here y=0 is the TOP and y=1 is the BOTTOM (the browser's y-down convention).
// The single source of the flip between them is `invertY`; every value→point and
// point→value path routes through it so the inversion lives in exactly one place.

export type XYValue = { x: number; y: number };

/** A fully-resolved axis — every field required (see `resolveAxis` for defaults). */
export type AxisSpec = {
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
export type Point = { x: number; y: number };

/** Pixel radius of the centre detent's capture band (see `applyDetentAxis`). */
export const XY_DETENT_PX = 6;

/** Fallback step when an axis omits one. */
export const XY_DEFAULT_STEP = 0.01;

/** Decimal places implied by a step (e.g. 0.01 → 2) — used to scrub float dust. */
function decimalsForStep(step: number): number {
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

/** Round to the step's implied precision so snapped values don't carry float noise. */
function roundToStep(val: number, step: number): number {
  return parseFloat(val.toFixed(decimalsForStep(step)));
}

/**
 * Resolve a partial axis into a fully-specified one. Defaults: min=0, max=1,
 * step=XY_DEFAULT_STEP, bipolar=false. `origin` falls back to the axis midpoint for a
 * bipolar axis (its natural rest/centre) or to `min` otherwise. Never mutates the input.
 */
export function resolveAxis(
  axis?: Partial<{ min: number; max: number; step: number; origin: number; bipolar: boolean }>,
): AxisSpec {
  const min = axis?.min ?? 0;
  const max = axis?.max ?? 1;
  const step = axis?.step ?? XY_DEFAULT_STEP;
  const bipolar = axis?.bipolar ?? false;
  const origin = axis?.origin ?? (bipolar ? (min + max) / 2 : min);
  return { min, max, step, origin, bipolar };
}

/** Clamp `v` into [min, max]. */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Snap `v` to the nearest multiple of `step` measured from `min`, then round to the
 * step's precision to kill float dust. A non-positive step means "no grid" → passthrough.
 */
export function snapToStep(v: number, step: number, min: number): number {
  if (step <= 0) return v;
  const snapped = min + Math.round((v - min) / step) * step;
  return roundToStep(snapped, step);
}

/**
 * Map a value to [0,1] along the axis (0 at min, 1 at max), clamped. A degenerate axis
 * (max===min) has no extent to map into, so it collapses to 0.
 */
export function valueToNorm(v: number, axis: AxisSpec): number {
  if (axis.max === axis.min) return 0;
  return clamp((v - axis.min) / (axis.max - axis.min), 0, 1);
}

/** Inverse of `valueToNorm` (no snapping). `n` is clamped to [0,1] first. */
export function normToValue(n: number, axis: AxisSpec): number {
  const t = clamp(n, 0, 1);
  return axis.min + t * (axis.max - axis.min);
}

/**
 * Flip between screen-y (down) and Cartesian-y (up). This is the ONE place the two
 * y conventions meet — value→point and point→value both route through it.
 */
export function invertY(n: number): number {
  return 1 - n;
}

/**
 * Screen point (y-down) → Cartesian value. x maps directly; y is inverted so the top of
 * the pad reads as the axis maximum. Each result is clamped into its axis range, and
 * optionally snapped to the axis step.
 *
 * Corner contract: {x:0,y:1} (bottom-left) → {x:xMin, y:yMin};
 *                  {x:1,y:0} (top-right)   → {x:xMax, y:yMax}.
 */
export function valueFromPoint(
  point: Point,
  xAxis: AxisSpec,
  yAxis: AxisSpec,
  snap = false,
): XYValue {
  let x = clamp(normToValue(point.x, xAxis), xAxis.min, xAxis.max);
  let y = clamp(normToValue(invertY(point.y), yAxis), yAxis.min, yAxis.max);
  if (snap) {
    x = snapToStep(x, xAxis.step, xAxis.min);
    y = snapToStep(y, yAxis.step, yAxis.min);
  }
  return { x, y };
}

/**
 * Cartesian value → screen point (inverse of `valueFromPoint`, for CSS positioning).
 * y is inverted so a value at yMax yields point.y=0 (the top of the pad).
 */
export function pointFromValue(value: XYValue, xAxis: AxisSpec, yAxis: AxisSpec): Point {
  return {
    x: valueToNorm(value.x, xAxis),
    y: invertY(valueToNorm(value.y, yAxis)),
  };
}

/**
 * Escapable centre detent for one axis. While the pointer is within `XY_DETENT_PX` of the
 * origin position, the value sticks to `axis.origin`; move further and the live `value`
 * passes through untouched. Only bipolar axes have a centre to snap to. The component
 * supplies the pixel distance from the origin's screen position.
 */
export function applyDetentAxis(value: number, axis: AxisSpec, pxFromOrigin: number): number {
  if (axis.bipolar && pxFromOrigin <= XY_DETENT_PX) return axis.origin;
  return value;
}

/** Keyboard step size for a nudge: fine = range×0.01, coarse = range×0.1, else the axis step. */
function effectiveStep(axis: AxisSpec, mode: 'fine' | 'normal' | 'coarse'): number {
  const range = axis.max - axis.min;
  if (mode === 'fine') return range * 0.01;
  if (mode === 'coarse') return range * 0.1;
  return axis.step;
}

/**
 * Nudge one axis by a keyboard step and return a NEW value (the other axis is copied
 * untouched). Cartesian: direction +1 is UP/right → larger value; -1 is down/left. The
 * result is clamped into range and rounded to the step's precision.
 */
export function nudge(
  value: XYValue,
  axis: 'x' | 'y',
  direction: -1 | 1,
  xAxis: AxisSpec,
  yAxis: AxisSpec,
  mode: 'fine' | 'normal' | 'coarse' = 'normal',
): XYValue {
  const spec = axis === 'x' ? xAxis : yAxis;
  const step = effectiveStep(spec, mode);
  const next = roundToStep(clamp(value[axis] + direction * step, spec.min, spec.max), step);
  return axis === 'x' ? { x: next, y: value.y } : { x: value.x, y: next };
}

/**
 * Return-to-centre / joystick rest target: each axis's origin. For a bipolar (or
 * explicit-origin) axis this is the visual centre; a plain non-bipolar 0..1 axis rests
 * at its min, which is the intended behaviour for that case.
 */
export function centerValue(xAxis: AxisSpec, yAxis: AxisSpec): XYValue {
  return { x: xAxis.origin, y: yAxis.origin };
}

/** Coerce a single component to a finite number, falling back to the axis origin. */
function coerceComponent(v: number | undefined, axis: AxisSpec): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : axis.origin;
}

/**
 * Defensively normalize a possibly-partial/garbage value into a clean in-range XYValue.
 * Missing or non-finite (NaN/±Infinity) components fall back to the axis origin; each is
 * clamped into range and optionally snapped. Negative zero is normalized to 0. The input
 * is never mutated.
 */
export function normalizeValue(
  value: Partial<XYValue> | undefined,
  xAxis: AxisSpec,
  yAxis: AxisSpec,
  snap = false,
): XYValue {
  const resolve = (raw: number | undefined, axis: AxisSpec): number => {
    let v = clamp(coerceComponent(raw, axis), axis.min, axis.max);
    if (snap) v = snapToStep(v, axis.step, axis.min);
    // `+ 0` collapses -0 to 0 so downstream equality/serialization is clean.
    return v + 0;
  };
  return {
    x: resolve(value?.x, xAxis),
    y: resolve(value?.y, yAxis),
  };
}
