// Pure sampling/scaling for the read-only curve preview row ({ type: 'curve' }).
// Framework-agnostic like the other *-core modules: the renderers only map the
// normalized output onto an SVG, so everything worth testing lives here.

export type CurvePoint = {
  /** Sample position, 0..1 across the row's width. */
  t: number;
  /** Normalized value, 0..1 within the fitted domain (0 = domain min). */
  v: number;
};

export type CurvePlot = {
  /**
   * Polyline segments in normalized [0,1]² space. Non-finite samples are
   * skipped and split the stroke, so a partially-defined curve still draws
   * its defined stretches.
   */
  segments: CurvePoint[][];
  /** The y-range the segments were fitted to (explicit, or auto-fit + padding). */
  domain: [number, number];
  /** Normalized position of y=0 when the domain spans it, else null. */
  baseline: number | null;
};

export const CURVE_SAMPLE_COUNT = 160;
export const CURVE_MIN_HEIGHT = 32;
export const CURVE_MAX_HEIGHT = 160;
export const CURVE_DEFAULT_HEIGHT = 64;
/** Auto-fit headroom on each side, as a fraction of the value span. */
export const CURVE_FIT_PADDING = 0.05;

/** Resolve a curve config's height: default 64, clamped to a sensible band. */
export function clampCurveHeight(height?: number): number {
  if (typeof height !== 'number' || !Number.isFinite(height)) return CURVE_DEFAULT_HEIGHT;
  return Math.min(CURVE_MAX_HEIGHT, Math.max(CURVE_MIN_HEIGHT, height));
}

/**
 * Sample a host-supplied curve across t ∈ [0,1] and normalize it into unit
 * space. A throwing or non-finite sample never poisons the plot: that point is
 * dropped and the stroke breaks around it. An invalid or degenerate explicit
 * domain (non-finite, or min ≥ max) falls back to auto-fit.
 */
export function plotCurve(
  sample: (t: number) => number,
  options: { count?: number; domain?: [number, number] } = {}
): CurvePlot {
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
      // A flat curve has no span to fit; center it instead of dividing by zero.
      if (lo === hi) {
        lo -= 0.5;
        hi += 0.5;
      }
      const pad = (hi - lo) * CURVE_FIT_PADDING;
      domain = [lo - pad, hi + pad];
    }
  }

  const [lo, hi] = domain;
  const span = hi - lo;

  const segments: CurvePoint[][] = [];
  let current: CurvePoint[] | null = null;
  for (let i = 0; i < count; i++) {
    if (!Number.isFinite(ys[i])) {
      current = null;
      continue;
    }
    if (!current) {
      current = [];
      segments.push(current);
    }
    current.push({ t: i / (count - 1), v: (ys[i] - lo) / span });
  }

  const baseline = lo < 0 && hi > 0 ? (0 - lo) / span : null;

  return { segments, domain, baseline };
}

/** Map a normalized value (0 = domain min) to a y pixel, inset by `pad`. */
export function curveY(v: number, height: number, pad = 0): number {
  return pad + (1 - v) * (height - pad * 2);
}

/** SVG path data for a plot's segments; each segment is its own subpath. */
export function curvePathData(segments: CurvePoint[][], width: number, height: number, pad = 0): string {
  return segments
    .map((segment) =>
      segment
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${round(p.t * width)} ${round(curveY(p.v, height, pad))}`)
        .join(' ')
    )
    .join(' ');
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
