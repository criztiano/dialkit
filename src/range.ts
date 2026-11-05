// The dual-handle range slider: the `{ min, max }` counterpart of the slider.
// No DOM here, only the value model and the clamp, order, handle and span maths.

/** A range's value. The helpers keep `min <= max`. */
export type RangeValue = { min: number; max: number };

/**
 * A range slider: two handles on one track. `default` falls back to the full
 * track `{ min, max }`, and `step` to the slider's step for the track.
 */
export type RangeSliderConfig = {
  type: 'range';
  min: number;
  max: number;
  default?: RangeValue;
  step?: number;
};

export function clamp(value: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, value));
}

/** Swaps a reversed pair so `min <= max`. */
export function orderRange(value: RangeValue): RangeValue {
  return value.min <= value.max ? value : { min: value.max, max: value.min };
}

/** Clamps both ends to the track, then orders them. */
export function clampRange(value: RangeValue, min: number, max: number): RangeValue {
  return orderRange({ min: clamp(value.min, min, max), max: clamp(value.max, min, max) });
}

export function isRangeValue(value: unknown): value is RangeValue {
  return typeof value === 'object' && value !== null &&
    Number.isFinite((value as RangeValue).min) && Number.isFinite((value as RangeValue).max);
}

/** A valid value clamped and ordered on the track; anything else takes the default, then the full track. */
export function normalizeRangeValue(value: unknown, config: Pick<RangeSliderConfig, 'min' | 'max' | 'default'>): RangeValue {
  const fallback = isRangeValue(config.default) ? config.default : { min: config.min, max: config.max };
  return clampRange(isRangeValue(value) ? value : fallback, config.min, config.max);
}

/** Moves the low handle; it stops at the track start and at the high handle. */
export function setLow(next: number, current: RangeValue, min: number): RangeValue {
  return { min: clamp(next, min, current.max), max: current.max };
}

/** Moves the high handle; it stops at the low handle and at the track end. */
export function setHigh(next: number, current: RangeValue, max: number): RangeValue {
  return { min: current.min, max: clamp(next, current.min, max) };
}

/** Moves the whole span and keeps its width: at an edge the span stops flush instead of shrinking. */
export function shiftSpan(delta: number, current: RangeValue, min: number, max: number): RangeValue {
  const width = current.max - current.min;
  const low = clamp(current.min + delta, min, max - width);
  return { min: low, max: low + width };
}

/** The nearer handle. On a tie, a point below the low handle takes the low one. */
export function nearestHandle(at: number, current: RangeValue): 'min' | 'max' {
  const toMin = Math.abs(at - current.min);
  const toMax = Math.abs(at - current.max);
  if (toMin < toMax) return 'min';
  if (toMax < toMin) return 'max';
  return at < current.min ? 'min' : 'max';
}

/**
 * What a press grabs. Each handle has a grab radius (`hit`, in value units)
 * that also reaches into the span, so a handle at the track edge stays
 * grabbable. A press inside the span and outside both radii moves the span.
 */
export function pickDragTarget(at: number, current: RangeValue, hit: number): 'min' | 'max' | 'span' {
  const nearLow = Math.abs(at - current.min) <= hit;
  const nearHigh = Math.abs(at - current.max) <= hit;
  if (nearLow && nearHigh) return nearestHandle(at, current);
  if (nearLow) return 'min';
  if (nearHigh) return 'max';
  if (at > current.min && at < current.max) return 'span';
  return nearestHandle(at, current);
}

/** Only a click on the empty track moves a handle; a click inside the span changes nothing. */
export function isOutsideSpan(at: number, current: RangeValue): boolean {
  return at <= current.min || at >= current.max;
}

/** Fine drag (Shift): the pointer's travel counts at `factor` of the track. */
export function fineDragValue(start: number, startX: number, x: number, width: number, min: number, max: number, factor = 0.1): number {
  return clamp(start + ((x - startX) / (width || 1)) * (max - min) * factor, min, max);
}

/**
 * CSS `left` of the two 3px handles. Apart, each sits 6px inside its end of
 * the fill, as the slider's handle does. As the fill narrows, both stop at
 * the fill's middle, so a collapsed range still shows two handles, and both
 * stay inside the track.
 */
export function rangeHandleLefts(lowPercent: number, highPercent: number): { low: string; high: string } {
  const middle = (lowPercent + highPercent) / 2;
  return {
    low: `clamp(2px, min(calc(${lowPercent}% + 6px), calc(${middle}% - 4px)), calc(100% - 10px))`,
    high: `clamp(7px, max(calc(${highPercent}% - 9px), calc(${middle}% + 1px)), calc(100% - 5px))`,
  };
}
