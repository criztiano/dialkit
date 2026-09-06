// Framework-agnostic logic for the angle dial — the rotary counterpart of the
// slider's track math. It owns no DOM: just the value↔bearing mapping, the
// pointer gesture, and step/wrap handling. Each framework wrapper draws the
// dial and wires events, calling into these helpers so the math is written once.
//
// BEARING CONTRACT. The dial reads like a compass, not like `Math.atan2`:
// 0 is straight up and the needle turns clockwise. Everything below converts
// between that bearing and the control's own `min..max` range, so a 0..360
// heading, a -180..180 tilt and a 0..1 phase all drive the same needle.

/** Half the pointer travel, in pixels from the centre, below which a drag is ignored. */
export const ANGLE_DEAD_ZONE_PX = 4;

/** Decimal places implied by a step (e.g. 0.5 → 1) — used to scrub float dust. */
function decimalsForStep(step: number): number {
  const s = String(step);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

/**
 * Snap to the step and round to its implied precision. `min` anchors the
 * lattice so a -180..180 range steps through 0, not through 0.5.
 */
export function snapAngle(value: number, min: number, step: number): number {
  if (!(step > 0)) return value;
  return parseFloat((min + Math.round((value - min) / step) * step).toFixed(decimalsForStep(step)));
}

/**
 * Bring a value into `min..max`. Wrapping ranges (a heading) come back around;
 * bounded ones (a cone width) clamp.
 */
export function normalizeAngle(value: number, min: number, max: number, wrap: boolean): number {
  const span = max - min;
  if (!wrap || span <= 0) return Math.min(max, Math.max(min, value));
  // The endpoints are the same bearing on a wrapping range, so max folds to min.
  const t = (((value - min) % span) + span) % span;
  return min + t;
}

/** Value → compass bearing in degrees (0 = up, clockwise). */
export function valueToBearing(value: number, min: number, max: number): number {
  const span = max - min || 1;
  return ((value - min) / span) * 360;
}

/** Compass bearing in degrees → value, before stepping. */
export function bearingToValue(bearing: number, min: number, max: number): number {
  const span = max - min || 1;
  return min + ((((bearing % 360) + 360) % 360) / 360) * span;
}

/**
 * The value a pointer at (dx, dy) from the dial's centre asks for, or null
 * inside the dead zone — where the bearing is noise, not intent. `dy` is in
 * screen space (down is positive), which is why the y term is negated.
 *
 * On a wrapping range the result is chosen in the turn nearest `current`, so
 * dragging past the top carries on instead of snapping a full turn back.
 */
export function angleFromPointer(
  dx: number,
  dy: number,
  current: number,
  min: number,
  max: number,
  step: number,
  wrap: boolean,
): number | null {
  if (Math.hypot(dx, dy) < ANGLE_DEAD_ZONE_PX) return null;
  const bearing = (Math.atan2(dx, -dy) * 180) / Math.PI;
  let value = bearingToValue(bearing, min, max);
  if (wrap) {
    // Pick the representative within half a span of where we are, so the
    // needle takes the short way round and long drags accumulate.
    const span = max - min;
    while (value - current > span / 2) value -= span;
    while (current - value > span / 2) value += span;
  }
  return normalizeAngle(snapAngle(value, min, step), min, max, wrap);
}

/** Keyboard nudge: arrows step, shift takes ten. */
export function nudgeAngle(
  value: number,
  delta: number,
  min: number,
  max: number,
  step: number,
  wrap: boolean,
): number {
  return normalizeAngle(snapAngle(value + delta * (step || 1), min, step), min, max, wrap);
}

/**
 * The needle's arc as an SVG path — from the origin bearing round to the
 * value's, the short way is not what we want here: the sweep shows how far
 * the dial has turned from its rest position, so it always follows the
 * direction of travel.
 */
export function arcPath(from: number, to: number, radius: number, cx = 0, cy = 0): string {
  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${(cx + radius * Math.cos(rad)).toFixed(3)} ${(cy + radius * Math.sin(rad)).toFixed(3)}`;
  };
  const delta = to - from;
  if (Math.abs(delta) < 0.01) return '';
  // A full turn can't be one arc — split it so the sweep still draws.
  if (Math.abs(delta) >= 359.99) {
    return `M ${point(from)} A ${radius} ${radius} 0 0 1 ${point(from + 180)} A ${radius} ${radius} 0 0 1 ${point(from + 359.99)}`;
  }
  return `M ${point(from)} A ${radius} ${radius} 0 ${Math.abs(delta) > 180 ? 1 : 0} ${delta > 0 ? 1 : 0} ${point(to)}`;
}
