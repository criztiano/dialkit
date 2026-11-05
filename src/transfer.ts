/**
 * A transfer curve maps input to output (a gamma, a falloff, an edge ramp),
 * both from 0 to 1. Between points the curve is monotone cubic
 * (Fritsch–Carlson), so it never overshoots the values you placed.
 */
export type DialTransferConfig = {
  type: 'transfer';
  /** Starting shape. Defaults to straight through. */
  default?: DialTransferValue;
  /** Plot height in px, from 64 to 200. Default 104. */
  height?: number;
  /** Grid divisions behind the curve. Default 4; 0 hides it. */
  grid?: number;
  /** Names for the two axes. */
  axisLabels?: { x?: string; y?: string };
};

export type TransferPoint = { x: number; y: number };
export type DialTransferValue = { points: TransferPoint[] };

/** Straight through: the curve that changes nothing. */
export const DEFAULT_TRANSFER: DialTransferValue = { points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] };

/** Closest two interior points may sit, so a curve stays editable by hand. */
export const TRANSFER_MIN_GAP = 0.02;

export const TRANSFER_MAX_POINTS = 12;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const finite = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

/**
 * Repairs anything into a usable curve: clamps to the unit square, sorts by
 * x, pins the ends to x = 0 and x = 1, drops points too close to grab, and
 * caps the count. Never mutates the input.
 */
export function normalizeTransfer(value: unknown): DialTransferValue {
  const raw = (value as DialTransferValue | undefined)?.points;
  if (!Array.isArray(raw) || raw.length < 2) return { points: DEFAULT_TRANSFER.points.map((p) => ({ ...p })) };

  const points = raw
    .map((p) => ({ x: clamp01(finite((p as TransferPoint)?.x, 0)), y: clamp01(finite((p as TransferPoint)?.y, 0)) }))
    .sort((a, b) => a.x - b.x);
  points[0].x = 0;
  points[points.length - 1].x = 1;

  const out: TransferPoint[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i].x - out[out.length - 1].x < TRANSFER_MIN_GAP) continue;
    if (1 - points[i].x < TRANSFER_MIN_GAP) continue;
    out.push(points[i]);
  }
  out.push(points[points.length - 1]);
  // Keep the last point: it anchors x = 1.
  return { points: out.length > TRANSFER_MAX_POINTS ? [...out.slice(0, TRANSFER_MAX_POINTS - 1), out[out.length - 1]] : out };
}

/** Fritsch–Carlson tangents: the slope at each point, limited so no segment overshoots. */
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

/** The curve's output at `x` from 0 to 1. Outside the domain it holds the ends. */
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

/** The curve as `size` samples across the domain: a 1-D texture for a shader. */
export function transferLut(points: TransferPoint[], size = 256): Float32Array {
  const out = new Float32Array(size);
  for (let i = 0; i < size; i++) out[i] = sampleTransfer(points, size === 1 ? 0 : i / (size - 1));
  return out;
}

/** The curve as an SVG path in a 100 × 100 box, y down. */
export function transferPath(points: TransferPoint[], samples = 96): string {
  let d = '';
  for (let i = 0; i < samples; i++) {
    const x = i / (samples - 1);
    d += `${i ? 'L' : 'M'} ${(x * 100).toFixed(2)} ${((1 - sampleTransfer(points, x)) * 100).toFixed(2)} `;
  }
  return d.trim();
}

/** Adds a point, keeping the curve sorted and legal. Returns the new points and where it landed. */
export function insertPoint(points: TransferPoint[], x: number, y: number): { points: TransferPoint[]; index: number } {
  const next = normalizeTransfer({ points: [...points, { x: clamp01(x), y: clamp01(y) }] }).points;
  const index = next.findIndex((p) => Math.abs(p.x - clamp01(x)) < 1e-9);
  return { points: next, index };
}

/** Drops an interior point. The two ends anchor the domain and never go. */
export function removePoint(points: TransferPoint[], index: number): TransferPoint[] {
  if (index <= 0 || index >= points.length - 1) return points;
  return points.filter((_, i) => i !== index);
}

/** Moves a point. The ends slide only in y; an interior point stays between its neighbours. */
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

/** The point within `tolerance` (in unit-square distance) of the pointer, or -1. */
export function nearestPoint(points: TransferPoint[], x: number, y: number, tolerance: number): number {
  let best = -1, bestD = tolerance;
  for (let i = 0; i < points.length; i++) {
    const d = Math.hypot(points[i].x - x, points[i].y - y);
    if (d <= bestD) { best = i; bestD = d; }
  }
  return best;
}

/** True for the straight-through curve. */
export function isIdentityTransfer(points: TransferPoint[]): boolean {
  return points.length === 2 && points[0].x === 0 && points[0].y === 0 && points[1].x === 1 && points[1].y === 1;
}
