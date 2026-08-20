// Framework-agnostic logic for the dual-handle Range Slider — the `{min,max}`
// counterpart of the single-value slider. It owns no DOM: just the value model
// and the pure clamp / order / geometry / handle-selection / span math. Each
// framework wrapper renders the track and wires pointer events, calling into
// these helpers so the two-handle logic is written once.
//
// STANDALONE: no imports. Rounding to `step` is deliberately NOT done here — the
// component applies it via `roundValue` from `shortcut-utils`. This core is
// step-agnostic: clamp/order/geometry/selection only.

/** A resolved range value. Invariant (upheld by the helpers): min <= max. */
export type RangeValue = { min: number; max: number };

/** Clamp `v` into the inclusive `[lo, hi]` interval. */
export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Position of `v` within `[min, max]` as a 0..100 percentage. When the bounds are
 * degenerate (`max === min`) there is no span to map onto, so return 0 rather than
 * dividing by zero (which would yield NaN/Infinity).
 */
export function valueToPercent(v: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((v - min) / (max - min)) * 100;
}

/** Inverse of {@link valueToPercent}: a 0..1 fraction back to a value in `[min, max]`. */
export function percentToValue(pct01: number, min: number, max: number): number {
  return min + clamp(pct01, 0, 1) * (max - min);
}

/** Order a pair so `min <= max`, swapping a reversed pair. */
export function orderRange(v: RangeValue): RangeValue {
  return v.min <= v.max ? v : { min: v.max, max: v.min };
}

/** Clamp both ends into `[min, max]`, then order so `min <= max`. */
export function clampRange(v: RangeValue, min: number, max: number): RangeValue {
  return orderRange({ min: clamp(v.min, min, max), max: clamp(v.max, min, max) });
}

/**
 * Move the low handle to `nextLow`, clamped to `[min, current.max]` so it cannot
 * cross the high handle. Equal handles (zero-width) are allowed.
 */
export function setLow(nextLow: number, current: RangeValue, min: number): RangeValue {
  return { min: clamp(nextLow, min, current.max), max: current.max };
}

/**
 * Move the high handle to `nextHigh`, clamped to `[current.min, max]` so it cannot
 * cross the low handle. Equal handles (zero-width) are allowed.
 */
export function setHigh(nextHigh: number, current: RangeValue, max: number): RangeValue {
  return { min: current.min, max: clamp(nextHigh, current.min, max) };
}

/**
 * Shift the whole span by `deltaValue`, preserving its width. When the shift would
 * push the span past an edge, the desired low is clamped to `[min, max - width]`
 * so the entire span parks flush at that edge instead of shrinking.
 */
export function shiftSpan(deltaValue: number, current: RangeValue, min: number, max: number): RangeValue {
  const width = current.max - current.min;
  const desiredMin = clamp(current.min + deltaValue, min, max - width);
  return { min: desiredMin, max: desiredMin + width };
}

/**
 * Pick the handle nearer to `atValue`. On a tie (or when the handles overlap and
 * distance can't disambiguate) fall back to side: a value below the low handle
 * grabs 'min', otherwise 'max' — so a press to the left of an overlapped pair drags
 * low and a press to the right drags high.
 */
export function nearestHandle(atValue: number, current: RangeValue): 'min' | 'max' {
  const dMin = Math.abs(atValue - current.min);
  const dMax = Math.abs(atValue - current.max);
  if (dMin < dMax) return 'min';
  if (dMax < dMin) return 'max';
  return atValue < current.min ? 'min' : 'max';
}

/**
 * Decide what a pointer-down grabs. A handle gets a grab radius (`hitValue`, in
 * VALUE units) that reaches INTO the span, so a handle parked at its bound — with
 * no empty track outside to press — is still grabbable from just inside the fill.
 * Priority: a press within the grab radius of a handle grabs that handle even
 * inside the span; overlapping zones pick the nearer handle (tie broken by side
 * via nearestHandle); a strictly-interior press outside both zones drags the
 * span; anything else targets the nearer handle.
 */
export function pickDragTarget(atValue: number, current: RangeValue, hitValue: number): 'min' | 'max' | 'span' {
  const nearLow = Math.abs(atValue - current.min) <= hitValue;
  const nearHigh = Math.abs(atValue - current.max) <= hitValue;
  if (nearLow && nearHigh) return nearestHandle(atValue, current);
  if (nearLow) return 'min';
  if (nearHigh) return 'max';
  if (atValue > current.min && atValue < current.max) return 'span';
  return nearestHandle(atValue, current);
}

/**
 * True when the press landed on empty track (at or beyond either handle). This is
 * the only case where a plain click (no drag) may jump the nearest handle to the
 * click point; a press inside the span stays a no-op so it can't shrink the range.
 */
export function isOutsideSpan(atValue: number, current: RangeValue): boolean {
  return atValue <= current.min || atValue >= current.max;
}

/**
 * CSS `left` strings for the two 2px handle ticks. Each tick is centered on its own
 * value, so a bound at the extreme sits flush with the track edge (the clamps keep the
 * 2px body inside, never half off it). `gap` is the fill width, resolved to px at
 * layout: wide apart the `ramp` is 0, and as the fill shrinks below ~6px the `clamp`
 * ramp grows to 2px, easing the ticks apart so a collapsed range still reads as two
 * handles (± 2px around the point) instead of one thick mark. The ticks never cross.
 * Pure string math — no DOM; CSS min()/max()/clamp() resolve the px/%% mix at layout.
 */
export function handleLeftStyles(lowPercent: number, highPercent: number): { low: string; high: string } {
  const gap = `(${highPercent}% - ${lowPercent}%)`;
  const ramp = `clamp(0px, calc(6px - ${gap}), 2px)`;
  return {
    low: `max(0px, min(calc(100% - 2px), calc(${lowPercent}% - 1px - ${ramp})))`,
    high: `min(calc(100% - 2px), max(0px, calc(${highPercent}% - 1px + ${ramp})))`,
  };
}
