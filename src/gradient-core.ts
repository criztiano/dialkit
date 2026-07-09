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
import { parseHex, formatHex, LONG_PRESS_MS, PALETTE_DRAG_CANCEL_PX, type RGBA } from './color-core';

export { LONG_PRESS_MS, PALETTE_DRAG_CANCEL_PX };

// ── Types ───────────────────────────────────────────────────────────

export type GradientType = 'linear' | 'radial' | 'conic';
/** color is always #rrggbbaa; position is 0–1. */
export type GradientStop = { color: string; position: number };
export type GradientValue = {
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
export type GradientTransform = { transform: string; transformOrigin: string };

// ── Constants ───────────────────────────────────────────────────────

export const MIN_STOPS = 2;
/** Vertical travel off the strip that arms Photoshop-style stop removal. */
export const STOP_DETACH_PX = 24;

export const DEFAULT_GRADIENT: GradientValue = {
  type: 'linear',
  angle: 90,
  stops: [
    { color: '#6366f1ff', position: 0 },
    { color: '#ec4899ff', position: 1 },
  ],
};

// ── Small helpers ───────────────────────────────────────────────────

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const clampPct = (n: number) => Math.min(100, Math.max(0, n));
/** Radial horizontal radius bounds — below 10% is a dot, above 200% is off the box. */
const clampScale = (n: number) => Math.min(200, Math.max(10, n));
/** Radial vertical radius (squash) bounds. Independent of the horizontal radius
 *  so the on-canvas squash handle can travel to the box boundary regardless of
 *  the current size; 1% is a sliver, 200% is off the box. */
const clampSquash = (n: number) => Math.min(200, Math.max(1, n));
const wrapAngle = (a: number) => ((a % 360) + 360) % 360;
const round = (n: number, p: number) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};
const cloneDefaultStops = (): GradientStop[] => DEFAULT_GRADIENT.stops.map((s) => ({ ...s }));
const cloneDefault = (): GradientValue => ({
  type: DEFAULT_GRADIENT.type,
  angle: DEFAULT_GRADIENT.angle,
  stops: cloneDefaultStops(),
});
const sortedStops = (stops: GradientStop[]) => [...stops].sort((a, b) => a.position - b.position);
const stopString = (stops: GradientStop[]) =>
  sortedStops(stops)
    .map((s) => `${s.color} ${round(clamp01(s.position) * 100, 2)}%`)
    .join(', ');
const normColor = (color: string): string => {
  const rgba = parseHex(color);
  return rgba ? formatHex(rgba, true) : '#000000ff';
};

// ── CSS ─────────────────────────────────────────────────────────────

/** Ready CSS gradient string for any of the three types. #rrggbbaa is valid CSS. */
export function gradientToCss(value: GradientValue): string {
  const stopStr = stopString(value.stops);
  const angle = round(wrapAngle(value.angle), 2);
  const cx = round(clampPct(value.centerX ?? 50), 2);
  const cy = round(clampPct(value.centerY ?? 50), 2);
  switch (value.type) {
    case 'radial': {
      const rx = clampScale(value.scale ?? 100);
      // Vertical radius is independent; absent means it matches rx (round).
      const ry = value.squash === undefined ? rx : clampSquash(value.squash);
      // Round default stays a `circle` (farthest-corner) so untouched radials look
      // exactly as before; size/ovality switch to explicit box-relative radii.
      if (rx === 100 && ry === 100) {
        return `radial-gradient(circle at ${cx}% ${cy}%, ${stopStr})`;
      }
      return `radial-gradient(${round(rx, 2)}% ${round(ry, 2)}% at ${cx}% ${cy}%, ${stopStr})`;
    }
    case 'conic':
      return `conic-gradient(from ${angle}deg at ${cx}% ${cy}%, ${stopStr})`;
    case 'linear':
    default:
      return `linear-gradient(${angle}deg, ${stopStr})`;
  }
}

/**
 * The CSS transform that rotates a radial gradient's ellipse — CSS radial
 * gradients are axis-aligned, so tilt has to ride the element (or a background
 * layer) that shows the gradient. Identity (`none`) for a round radial, a
 * non-radial type, or zero rotation. Apply alongside gradientToCss:
 *   `<div style={{ background: gradientToCss(v), ...gradientToTransform(v) }} />`
 * (on a clipping layer, since a rotated fill overflows its box).
 */
export function gradientToTransform(value: GradientValue): GradientTransform {
  const cx = round(clampPct(value.centerX ?? 50), 2);
  const cy = round(clampPct(value.centerY ?? 50), 2);
  const rotation = wrapAngle(value.rotation ?? 0);
  // Rotating a round gradient is a no-op; only an out-of-round ellipse tilts.
  const rx = clampScale(value.scale ?? 100);
  const ry = value.squash === undefined ? rx : clampSquash(value.squash);
  if (value.type !== 'radial' || rotation === 0 || rx === ry) {
    return { transform: 'none', transformOrigin: '50% 50%' };
  }
  return { transform: `rotate(${round(rotation, 2)}deg)`, transformOrigin: `${cx}% ${cy}%` };
}

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
export type GradientFillBox = {
  background: string;
  transform: string;
  transformOrigin: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function gradientFillBox(value: GradientValue, boxW: number, boxH: number): GradientFillBox {
  // Before the box is measured (or for the self-covering types), the plain CSS
  // string on a box-sized layer already covers everything.
  if (value.type !== 'radial' || boxW <= 0 || boxH <= 0) {
    return {
      background: gradientToCss(value),
      transform: 'none',
      transformOrigin: '50% 50%',
      left: 0,
      top: 0,
      width: boxW,
      height: boxH,
    };
  }
  const cxPx = (clampPct(value.centerX ?? 50) / 100) * boxW;
  const cyPx = (clampPct(value.centerY ?? 50) / 100) * boxH;
  const scaleX = clampScale(value.scale ?? 100) / 100;
  const scaleY = (value.squash === undefined ? clampScale(value.scale ?? 100) : clampSquash(value.squash)) / 100;
  const rx = round(scaleX * boxW, 2);
  const ry = round(scaleY * boxH, 2);
  const side = round(2 * Math.hypot(boxW, boxH), 2);
  const rotation = wrapAngle(value.rotation ?? 0);
  return {
    background: `radial-gradient(${rx}px ${ry}px at 50% 50%, ${stopString(value.stops)})`,
    transform: rotation === 0 ? 'none' : `rotate(${round(rotation, 2)}deg)`,
    transformOrigin: '50% 50%',
    left: round(cxPx - side / 2, 2),
    top: round(cyPx - side / 2, 2),
    width: side,
    height: side,
  };
}

// ── Interpolation ───────────────────────────────────────────────────

/** Premultiplied-alpha lerp — matches how CSS paints the ramp. */
function lerpPremult(a: RGBA, b: RGBA, t: number): RGBA {
  const pa = a.a + (b.a - a.a) * t;
  if (pa === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (ca: number, aa: number, cb: number, ba: number) => (ca * aa + (cb * ba - ca * aa) * t) / pa;
  return {
    r: mix(a.r, a.a, b.r, b.a),
    g: mix(a.g, a.a, b.g, b.a),
    b: mix(a.b, a.a, b.b, b.a),
    a: pa,
  };
}

/**
 * The color the gradient shows at `position` (0–1), as #rrggbbaa. Interpolated
 * in sRGB with premultiplied alpha so a stop seeded here equals the pixel the
 * user clicked on the ramp (OKLab would visibly mismatch the strip).
 */
export function colorAtPosition(value: GradientValue, position: number): string {
  const stops = sortedStops(value.stops);
  if (stops.length === 0) return '#000000ff';
  const p = clamp01(position);
  if (p <= stops[0].position) return normColor(stops[0].color);
  const last = stops[stops.length - 1];
  if (p >= last.position) return normColor(last.color);
  let i = 0;
  while (i < stops.length - 1 && stops[i + 1].position <= p) i++;
  const a = stops[i];
  const b = stops[i + 1];
  const span = b.position - a.position;
  const t = span === 0 ? 0 : (p - a.position) / span;
  const ca = parseHex(a.color) ?? { r: 0, g: 0, b: 0, a: 1 };
  const cb = parseHex(b.color) ?? { r: 0, g: 0, b: 0, a: 1 };
  return formatHex(lerpPremult(ca, cb, t), true);
}

// ── Reconciliation ──────────────────────────────────────────────────

/**
 * Fail-soft validator for store reconciliation. Anything malformed degrades
 * gracefully: bad object → default; unknown type → linear; non-finite angle →
 * default angle; invalid stops dropped; fewer than MIN_STOPS survivors → the
 * default ramp. Always returns a fresh object safe for store snapshots.
 */
export function normalizeGradient(input: unknown): GradientValue {
  if (!input || typeof input !== 'object') return cloneDefault();
  const obj = input as Record<string, unknown>;
  if (!Array.isArray(obj.stops)) return cloneDefault();

  const type: GradientType = obj.type === 'radial' || obj.type === 'conic' ? obj.type : 'linear';
  const rawAngle = Number(obj.angle);
  const angle = Number.isFinite(rawAngle) ? wrapAngle(rawAngle) : DEFAULT_GRADIENT.angle;

  // Optional radial geometry — preserved only when valid, so plain values stay
  // lean and the defaults live in gradientToCss / gradientToTransform.
  const extras: Pick<GradientValue, 'centerX' | 'centerY' | 'scale' | 'squash' | 'rotation'> = {};
  const cx = Number(obj.centerX);
  if (Number.isFinite(cx)) extras.centerX = clampPct(cx);
  const cy = Number(obj.centerY);
  if (Number.isFinite(cy)) extras.centerY = clampPct(cy);
  const scale = Number(obj.scale);
  if (Number.isFinite(scale)) extras.scale = clampScale(scale);
  const squash = Number(obj.squash);
  if (Number.isFinite(squash)) extras.squash = clampSquash(squash);
  const rotation = Number(obj.rotation);
  if (Number.isFinite(rotation)) extras.rotation = wrapAngle(rotation);

  const stops: GradientStop[] = [];
  for (const raw of obj.stops) {
    if (!raw || typeof raw !== 'object') continue;
    const s = raw as Record<string, unknown>;
    const rgba = typeof s.color === 'string' ? parseHex(s.color) : null;
    const pos = Number(s.position);
    if (!rgba || !Number.isFinite(pos)) continue;
    stops.push({ color: formatHex(rgba, true), position: clamp01(pos) });
  }

  if (stops.length < MIN_STOPS) return { type, angle, stops: cloneDefaultStops(), ...extras };
  stops.sort((a, b) => a.position - b.position);
  return { type, angle, stops, ...extras };
}

// ── Immutable stop/gradient edits ───────────────────────────────────
// Helpers that can reorder stops return the moved/added stop's new index so
// the panel's selection can follow it.

/** Insert a stop at `position`, seeded with the ramp color there. */
export function addStop(value: GradientValue, position: number): { value: GradientValue; index: number } {
  const stop: GradientStop = { color: colorAtPosition(value, position), position: clamp01(position) };
  const stops = [...value.stops, stop].sort((a, b) => a.position - b.position);
  return { value: { ...value, stops }, index: stops.indexOf(stop) };
}

/** Reposition a stop; re-sorts (stable), so dragging past a neighbor swaps live. */
export function moveStop(value: GradientValue, index: number, position: number): { value: GradientValue; index: number } {
  if (index < 0 || index >= value.stops.length) return { value, index };
  const moved: GradientStop = { ...value.stops[index], position: clamp01(position) };
  const stops = value.stops.map((s, i) => (i === index ? moved : s));
  stops.sort((a, b) => a.position - b.position);
  return { value: { ...value, stops }, index: stops.indexOf(moved) };
}

/** Remove a stop — no-op (same reference) at MIN_STOPS or out of range. */
export function removeStop(value: GradientValue, index: number): GradientValue {
  if (value.stops.length <= MIN_STOPS || index < 0 || index >= value.stops.length) return value;
  return { ...value, stops: value.stops.filter((_, i) => i !== index) };
}

export function setStopColor(value: GradientValue, index: number, hex: string): GradientValue {
  if (index < 0 || index >= value.stops.length) return value;
  const rgba = parseHex(hex);
  if (!rgba) return value;
  const color = formatHex(rgba, true);
  return { ...value, stops: value.stops.map((s, i) => (i === index ? { ...s, color } : s)) };
}

export function setGradientType(value: GradientValue, type: GradientType): GradientValue {
  return { ...value, type };
}

export function setGradientAngle(value: GradientValue, angle: number): GradientValue {
  return { ...value, angle: wrapAngle(angle) };
}

/** Set the radial/conic origin (each 0–100 %). */
export function setGradientCenter(value: GradientValue, centerX: number, centerY: number): GradientValue {
  return { ...value, centerX: clampPct(centerX), centerY: clampPct(centerY) };
}

/** Set the radial extent (10–200 % of the box). */
export function setGradientScale(value: GradientValue, scale: number): GradientValue {
  return { ...value, scale: clampScale(scale) };
}

/** Set the radial ovality (0 = round, up to 100). */
export function setGradientSquash(value: GradientValue, squash: number): GradientValue {
  return { ...value, squash: clampSquash(squash) };
}

/** Set the radial ellipse tilt (degrees). Renders via gradientToTransform. */
export function setGradientRotation(value: GradientValue, rotation: number): GradientValue {
  return { ...value, rotation: wrapAngle(rotation) };
}
