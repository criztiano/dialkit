// Framework-agnostic logic for the transfer curve — the editable counterpart
// of the read-only `curve` preview row. It owns no DOM: the data model, the
// interpolation, hit-testing, and the pure edit operations. Each framework
// wrapper draws the SVG and wires pointer events, calling into these helpers
// so the curve math is written once.
//
// WHAT IT IS. A transfer curve maps input to output — a gamma, a depth
// response, a falloff. Both axes are normalized 0..1 and the hosting control
// scales them, so the same curve reads as "0 stays 0, the midtones lift" for
// a picture and for a height field alike.
//
// WHY MONOTONE CUBIC. A Catmull-Rom or natural spline overshoots between
// points, which on a transfer curve means an output above the maximum from
// inputs that never asked for it — visible as a blown highlight nothing in
// the UI explains. Fritsch–Carlson limits the tangents so the curve stays
// inside the values you placed: what you draw is what comes out.

export type TransferPoint = { x: number; y: number };
export type TransferValue = { points: TransferPoint[] };

/** Straight through: the curve that changes nothing. */
export const DEFAULT_TRANSFER: TransferValue = { points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] };

/** Closest two interior points may sit, so a curve stays editable by hand. */
export const TRANSFER_MIN_GAP = 0.02;

/** Most points a curve carries — past this the shape is a texture, not a curve. */
export const TRANSFER_MAX_POINTS = 12;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const finite = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

/**
 * Repair anything into a usable curve: clamp to the unit square, sort by x,
 * pin the ends to x=0 and x=1 (their y stays yours), drop points too close to
 * their neighbour to grab, and cap the count. Never mutates the input.
 */
export function normalizeTransfer(value: unknown): TransferValue {
  const raw = (value as TransferValue | undefined)?.points;
  if (!Array.isArray(raw) || raw.length < 2) return { points: DEFAULT_TRANSFER.points.map((p) => ({ ...p })) };

  const points = raw
    .map((p) => ({ x: clamp01(finite((p as TransferPoint)?.x, 0)), y: clamp01(finite((p as TransferPoint)?.y, 0)) }))
    .sort((a, b) => a.x - b.x);

  // The ends anchor the domain; only their heights are the author's.
  points[0].x = 0;
  points[points.length - 1].x = 1;

  const out: TransferPoint[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i].x - out[out.length - 1].x < TRANSFER_MIN_GAP) continue;
    if (1 - points[i].x < TRANSFER_MIN_GAP) continue;
    out.push(points[i]);
  }
  out.push(points[points.length - 1]);
  return { points: out.slice(0, TRANSFER_MAX_POINTS) };
}

/**
 * Fritsch–Carlson tangents: the slope at each point, limited so no segment
 * can overshoot the two values it joins.
 */
function tangents(points: TransferPoint[]): number[] {
  const n = points.length;
  const secant = new Array<number>(n - 1);
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    secant[i] = dx > 0 ? (points[i + 1].y - points[i].y) / dx : 0;
  }
  const m = new Array<number>(n);
  m[0] = secant[0];
  m[n - 1] = secant[n - 2];
  for (let i = 1; i < n - 1; i++) {
    // A sign change is a local extreme: flatten there, or the curve rings.
    m[i] = secant[i - 1] * secant[i] <= 0 ? 0 : (secant[i - 1] + secant[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (secant[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / secant[i];
    const b = m[i + 1] / secant[i];
    const h = Math.hypot(a, b);
    if (h > 3) {
      m[i] = (3 / h) * a * secant[i];
      m[i + 1] = (3 / h) * b * secant[i];
    }
  }
  return m;
}

/** The curve's output at `x` in [0,1]. Outside the domain it holds the ends. */
export function sampleTransfer(points: TransferPoint[], x: number): number {
  if (!points.length) return clamp01(x);
  if (points.length === 1) return points[0].y;
  const t = clamp01(finite(x, 0));
  if (t <= points[0].x) return points[0].y;
  const last = points[points.length - 1];
  if (t >= last.x) return last.y;

  let i = 0;
  while (i < points.length - 2 && points[i + 1].x < t) i++;
  const p0 = points[i], p1 = points[i + 1];
  const h = p1.x - p0.x;
  if (h <= 0) return p1.y;
  const m = tangents(points);
  const s = (t - p0.x) / h;
  const s2 = s * s, s3 = s2 * s;
  // Hermite basis.
  return clamp01(
    (2 * s3 - 3 * s2 + 1) * p0.y +
    (s3 - 2 * s2 + s) * h * m[i] +
    (-2 * s3 + 3 * s2) * p1.y +
    (s3 - s2) * h * m[i + 1]
  );
}

/**
 * The curve as a lookup table of `size` samples across the domain — what a
 * shader wants (upload it as a 1-D texture and read it with one tap) and what
 * a preview strokes.
 */
export function transferLut(points: TransferPoint[], size = 256): Float32Array {
  const out = new Float32Array(size);
  // Tangents cost O(n) and don't change across the sweep; sampleTransfer
  // recomputes them per call, so bake through it only once per sample here.
  for (let i = 0; i < size; i++) out[i] = sampleTransfer(points, size === 1 ? 0 : i / (size - 1));
  return out;
}

/** Add a point, keeping the curve sorted and legal. Returns the new value and where it landed. */
export function insertPoint(points: TransferPoint[], x: number, y: number): { points: TransferPoint[]; index: number } {
  const next = normalizeTransfer({ points: [...points, { x: clamp01(x), y: clamp01(y) }] }).points;
  const index = next.findIndex((p) => Math.abs(p.x - clamp01(x)) < 1e-9);
  return { points: next, index: index < 0 ? 0 : index };
}

/** Drop an interior point. The two ends anchor the domain and never go. */
export function removePoint(points: TransferPoint[], index: number): TransferPoint[] {
  if (index <= 0 || index >= points.length - 1) return points;
  return points.filter((_, i) => i !== index);
}

/**
 * Move a point. The ends slide only in y; an interior point is held between
 * its neighbours so the curve can never fold back on itself.
 */
export function movePoint(points: TransferPoint[], index: number, x: number, y: number): TransferPoint[] {
  if (index < 0 || index >= points.length) return points;
  const out = points.map((p) => ({ ...p }));
  const ny = clamp01(finite(y, 0));
  if (index === 0 || index === points.length - 1) {
    out[index].y = ny;
    return out;
  }
  const lo = out[index - 1].x + TRANSFER_MIN_GAP;
  const hi = out[index + 1].x - TRANSFER_MIN_GAP;
  out[index] = { x: hi < lo ? out[index].x : Math.min(hi, Math.max(lo, clamp01(finite(x, 0)))), y: ny };
  return out;
}

/**
 * The point under the pointer, or -1. Distances are in the curve's own unit
 * square, so callers convert pixels with `tolerance = grabPx / boxPx`.
 */
export function nearestPoint(points: TransferPoint[], x: number, y: number, tolerance: number): number {
  let best = -1, bestD = tolerance;
  for (let i = 0; i < points.length; i++) {
    const d = Math.hypot(points[i].x - x, points[i].y - y);
    if (d <= bestD) { best = i; bestD = d; }
  }
  return best;
}

/** True when the curve does nothing — used to draw the rest state quietly. */
export function isIdentityTransfer(points: TransferPoint[]): boolean {
  return points.length === 2 && points[0].x === 0 && points[0].y === 0 && points[1].x === 1 && points[1].y === 1;
}
