// The angle dial: a slider drawn as a rotary needle. No DOM here, only the
// value ↔ bearing maths, the pointer gesture, and step and wrap handling.
//
// A bearing reads like a compass: 0 is straight up and it turns clockwise.
// Every helper maps between that bearing and the control's own `min..max`,
// so a 0..360 heading, a -180..180 tilt and a 0..1 phase turn the same needle.
import { decimalsForStep } from './numeric';

/**
 * The object form of a slider, for what the `[default, min, max, step?, unit?]`
 * tuple cannot say. `display: 'dial'` draws it as an angle dial: for values
 * whose two ends are the same place (a heading, a hue, a tilt). To the store
 * it stays a slider, so presets, shortcuts and other frameworks see a slider.
 */
export type SliderConfig = {
  type: 'slider';
  default: number;
  min: number;
  max: number;
  /** Falls back to the tuple's step for the range. */
  step?: number;
  /** Shown after the value. A dial over a half turn or more shows ° without it. */
  unit?: string;
  /** Replaces the shown value; `unit` is then not added. */
  formatValue?: (value: number) => string;
  display?: 'track' | 'dial';
  /** Dial only: the value the sweep grows from, and the double-click reset. Defaults to `min`. */
  origin?: number;
  /** Dial only: past an end, come back around. Defaults to true for a full turn (360 or more). */
  wrap?: boolean;
};

/** Pointer travel from the centre, in px, under which the bearing is noise. */
export const ANGLE_DEAD_ZONE_PX = 4;

/** A full turn wraps unless told otherwise; a partial range, such as a cone width, stops. */
export function angleWraps(min: number, max: number, wrap?: boolean): boolean {
  return wrap ?? Math.abs(max - min) >= 360;
}

/** Snaps to the step, anchored at `min`, so -180..180 in 1° steps passes through 0. */
export function snapAngle(value: number, min: number, step: number): number {
  if (!(step > 0)) return value;
  return parseFloat((min + Math.round((value - min) / step) * step).toFixed(decimalsForStep(step)));
}

/** Brings a value into `min..max`: a wrapping range comes back around, a bounded one clamps. */
export function normalizeAngle(value: number, min: number, max: number, wrap: boolean): number {
  const span = max - min;
  if (!wrap || span <= 0) return Math.min(max, Math.max(min, value));
  // On a wrapping range the two ends are one bearing, so `max` folds to `min`.
  return min + ((((value - min) % span) + span) % span);
}

/** Value → bearing in degrees. */
export function valueToBearing(value: number, min: number, max: number): number {
  return ((value - min) / (max - min || 1)) * 360;
}

/** Bearing in degrees → value, before the step. */
export function bearingToValue(bearing: number, min: number, max: number): number {
  return min + ((((bearing % 360) + 360) % 360) / 360) * (max - min || 1);
}

/**
 * The value a pointer at (dx, dy) from the centre asks for, or null in the
 * dead zone. `dy` is in screen space (down is positive). On a wrapping range
 * the value is taken in the turn nearest `current`, so a drag past the top
 * keeps turning instead of jumping a full turn back.
 */
export function angleFromPointer(dx: number, dy: number, current: number, min: number, max: number, step: number, wrap: boolean): number | null {
  if (Math.hypot(dx, dy) < ANGLE_DEAD_ZONE_PX) return null;
  let value = bearingToValue((Math.atan2(dx, -dy) * 180) / Math.PI, min, max);
  if (wrap) {
    const span = max - min;
    while (value - current > span / 2) value -= span;
    while (current - value > span / 2) value += span;
  }
  return normalizeAngle(snapAngle(value, min, step), min, max, wrap);
}

/** Keyboard step: an arrow is one step, Shift takes ten. */
export function nudgeAngle(value: number, delta: number, min: number, max: number, step: number, wrap: boolean): number {
  return normalizeAngle(snapAngle(value + delta * (step || 1), min, step), min, max, wrap);
}

/**
 * The sweep from the origin's bearing to the value's, as SVG path data. It
 * follows the direction of travel, not the short way round: it shows how far
 * the dial has turned from rest.
 */
export function arcPath(from: number, to: number, radius: number, cx = 0, cy = 0): string {
  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${(cx + radius * Math.cos(rad)).toFixed(3)} ${(cy + radius * Math.sin(rad)).toFixed(3)}`;
  };
  const delta = to - from;
  if (Math.abs(delta) < 0.01) return '';
  // One arc cannot draw a full turn, so it is drawn as two.
  if (Math.abs(delta) >= 359.99) {
    return `M ${point(from)} A ${radius} ${radius} 0 0 1 ${point(from + 180)} A ${radius} ${radius} 0 0 1 ${point(from + 359.99)}`;
  }
  return `M ${point(from)} A ${radius} ${radius} 0 ${Math.abs(delta) > 180 ? 1 : 0} ${delta > 0 ? 1 : 0} ${point(to)}`;
}

/** The dial's text: the formatter's, else the value with its unit, ° by default over a half turn or more. */
export function angleText(value: number, min: number, max: number, step: number, unit?: string, formatValue?: (value: number) => string): { value: string; unit: string } {
  if (formatValue) return { value: formatValue(value), unit: '' };
  return { value: value.toFixed(decimalsForStep(step, min, max)), unit: unit ?? (Math.abs(max - min) >= 180 ? '°' : '') };
}
