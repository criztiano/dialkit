/**
 * A read-only curve row: draws a shape the app's own values make (a pitch
 * arc, a falloff). It holds no value, so nothing lands in the resolved
 * values, versions, or storage. `sample` may close over the app's state; the
 * React hook keeps it fresh on every render (see `syncLiveConfigs`).
 */
export type DialCurveConfig = {
  type: 'curve';
  /** t from 0 to 1 → y. Non-finite results break the stroke there. */
  sample: (t: number) => number;
  /** Fixed y-range. Default: fits each draw with a little headroom. */
  domain?: [number, number];
  /** Vertical reference lines at these x positions from 0 to 1; others are skipped. */
  markers?: readonly number[];
  /** Plot height in px, from 32 to 160. Default 64. Ignored when `aspect` is set. */
  height?: number;
  /** Width ÷ height: the plot keeps its proportions at any panel width. */
  aspect?: number;
  /** `false` hides the label line; a string replaces the key's label. */
  label?: false | string;
};

/** A sample position `t` and its value `v`, both from 0 to 1 (v = 0 is the domain's min). */
export type CurvePoint = { t: number; v: number };

export type CurvePlot = {
  /** Finite runs of samples; a non-finite sample splits the stroke. */
  segments: CurvePoint[][];
  domain: [number, number];
  /** Where y = 0 sits when the domain spans it, else null. */
  baseline: number | null;
};

export const CURVE_SAMPLE_COUNT = 160;
const CURVE_FIT_PADDING = 0.05;

/** A curve's plot height: default 64, from 32 to 160. */
export function clampCurveHeight(height?: number): number {
  if (typeof height !== 'number' || !Number.isFinite(height)) return 64;
  return Math.min(160, Math.max(32, height));
}

/**
 * Samples `sample` across t from 0 to 1 and fits it into the unit square. A
 * throwing or non-finite sample is dropped. An invalid explicit domain falls
 * back to the fit.
 */
export function plotCurve(sample: (t: number) => number, options: { count?: number; domain?: [number, number] } = {}): CurvePlot {
  const count = Math.max(2, Math.floor(options.count ?? CURVE_SAMPLE_COUNT));
  const ys = new Array<number>(count);
  for (let i = 0; i < count; i++) {
    let y: number;
    try {
      y = sample(i / (count - 1));
    } catch {
      y = NaN;
    }
    ys[i] = typeof y === 'number' ? y : NaN;
  }

  let domain: [number, number];
  const explicit = options.domain;
  if (explicit && Number.isFinite(explicit[0]) && Number.isFinite(explicit[1]) && explicit[0] < explicit[1]) {
    domain = [explicit[0], explicit[1]];
  } else {
    const finite = ys.filter((y) => Number.isFinite(y));
    if (finite.length === 0) {
      domain = [0, 1];
    } else {
      let lo = Math.min(...finite);
      let hi = Math.max(...finite);
      // A flat curve has no span to fit: center it.
      if (lo === hi) { lo -= 0.5; hi += 0.5; }
      const pad = (hi - lo) * CURVE_FIT_PADDING;
      domain = [lo - pad, hi + pad];
    }
  }

  const [lo, hi] = domain;
  const span = hi - lo;
  const segments: CurvePoint[][] = [];
  let current: CurvePoint[] | null = null;
  for (let i = 0; i < count; i++) {
    if (!Number.isFinite(ys[i])) { current = null; continue; }
    if (!current) segments.push(current = []);
    current.push({ t: i / (count - 1), v: (ys[i] - lo) / span });
  }
  return { segments, domain, baseline: lo < 0 && hi > 0 ? -lo / span : null };
}

/** Markers that can be drawn: finite numbers from 0 to 1. Others are skipped, not clamped. */
export function normalizeCurveMarkers(markers?: readonly number[]): number[] {
  if (!markers) return [];
  return markers.filter((m) => typeof m === 'number' && Number.isFinite(m) && m >= 0 && m <= 1);
}

/** A unit value (0 = domain min) as a y pixel, inset by `pad`. */
export function curveY(v: number, height: number, pad = 0): number {
  return pad + (1 - v) * (height - pad * 2);
}

const round = (value: number) => Math.round(value * 100) / 100;

/** SVG path data for a plot's segments, each its own subpath. */
export function curvePathData(segments: CurvePoint[][], width: number, height: number, pad = 0): string {
  return segments
    .map((segment) => segment.map((p, i) => `${i === 0 ? 'M' : 'L'} ${round(p.t * width)} ${round(curveY(p.v, height, pad))}`).join(' '))
    .join(' ');
}
