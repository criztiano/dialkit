/**
 * A filter: one value, two hands, cutoff and resonance, drawn as the
 * magnitude response they make. `response` draws the app's own filter;
 * without one the control draws a lowpass.
 */
export type DialFilterConfig = {
  type: 'filter';
  /** Starting point. A missing hand opens the filter: cutoff at max, resonance at min. */
  default?: Partial<DialFilterValue>;
  cutoff?: DialFilterAxisConfig;
  resonance?: DialFilterAxisConfig;
  /** The drawn response, from each hand's 0 to 1 position: t sweeps the spectrum, y is the gain from 0 to 1. */
  response?: (cutoff01: number, resonance01: number) => (t: number) => number;
  /** `false` draws the response dimmed, as a bypassed filter. Default on. */
  enabled?: boolean;
};

export type DialFilterAxisConfig = {
  min?: number;
  max?: number;
  /** 0 or none: continuous. */
  step?: number;
  default?: number;
  /** The hand's slider label. Defaults to Freq and Res. */
  label?: string;
  unit?: string;
};

export type DialFilterValue = { cutoff: number; resonance: number };

export type FilterAxis = { min: number; max: number; step: number; label: string; unit?: string; default?: number };

const FILTER_AXIS_DEFAULTS = {
  cutoff: { min: 0, max: 1, step: 0, label: 'Freq' },
  resonance: { min: 0, max: 1, step: 0, label: 'Res' },
};

export function resolveFilterAxis(axis: DialFilterAxisConfig | undefined, hand: 'cutoff' | 'resonance'): FilterAxis {
  const base = FILTER_AXIS_DEFAULTS[hand];
  return {
    min: axis?.min ?? base.min,
    max: axis?.max ?? base.max,
    step: axis?.step ?? base.step,
    label: axis?.label ?? base.label,
    unit: axis?.unit,
    default: axis?.default,
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function snap(v: number, axis: FilterAxis): number {
  let out = clamp(Number.isFinite(v) ? v : axis.min, axis.min, axis.max);
  if (axis.step > 0) out = clamp(axis.min + Math.round((out - axis.min) / axis.step) * axis.step, axis.min, axis.max);
  return Number(out.toFixed(6));
}

/** A stored or config value clamped into both axes. A missing hand takes its axis default, else the open filter. */
export function normalizeFilterValue(value: unknown, config: Pick<DialFilterConfig, 'cutoff' | 'resonance'> = {}): DialFilterValue {
  const cutoff = resolveFilterAxis(config.cutoff, 'cutoff');
  const resonance = resolveFilterAxis(config.resonance, 'resonance');
  const v = (typeof value === 'object' && value !== null ? value : {}) as Partial<DialFilterValue>;
  return {
    cutoff: snap(typeof v.cutoff === 'number' ? v.cutoff : cutoff.default ?? cutoff.max, cutoff),
    resonance: snap(typeof v.resonance === 'number' ? v.resonance : resonance.default ?? resonance.min, resonance),
  };
}

/** One hand's position from 0 to 1 along its axis. */
export function filterHand01(v: number, axis: FilterAxis): number {
  const n = (v - axis.min) / (axis.max - axis.min || 1);
  return clamp(Number.isFinite(n) ? n : 0, 0, 1);
}

export type FilterShapeType = 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'peak';

/** The drawn dB window: 36 below unity to 24 above, so the biggest peak still fits. */
const FILTER_DB_FLOOR = 36;
const FILTER_DB_CEIL = 24;

/**
 * A 2-pole biquad magnitude over a log frequency sweep, for a `response`:
 * `response: (c, r) => filterShapeResponse('highpass', c, r)`. The knee
 * sweeps 3 decades and Q runs from 0.7 (no bump) to about 10.
 */
export function filterShapeResponse(type: FilterShapeType, cutoff01: number, resonance01: number): (t: number) => number {
  const fc = Math.pow(10, -3 + 3 * clamp(cutoff01, 0, 1));
  const q = 0.707 * Math.pow(14, clamp(resonance01, 0, 1));
  // The peak's boost follows resonance instead of Q: up to +18 dB.
  const a = Math.pow(10, (clamp(resonance01, 0, 1) * 18) / 40);
  return (t: number) => {
    const w = Math.pow(10, -3 + 3 * clamp(t, 0, 1)) / fc;
    const w2 = w * w;
    const den = Math.sqrt(Math.pow(1 - w2, 2) + Math.pow(w / q, 2));
    let mag: number;
    switch (type) {
      case 'highpass': mag = w2 / den; break;
      case 'bandpass': mag = (w / q) / den; break;
      case 'notch': mag = Math.abs(1 - w2) / den; break;
      case 'peak':
        mag = Math.sqrt(Math.pow(1 - w2, 2) + Math.pow((w * a) / q, 2)) / Math.sqrt(Math.pow(1 - w2, 2) + Math.pow(w / (a * q), 2));
        break;
      default: mag = 1 / den;
    }
    // Only the top is clamped: a rolloff keeps falling past the floor, and the plot clips it there.
    return Math.min((20 * Math.log10(Math.max(mag, 1e-6)) + FILTER_DB_FLOOR) / (FILTER_DB_FLOOR + FILTER_DB_CEIL), 1);
  };
}

const FILTER_SAMPLES = 96;

/**
 * The response as an SVG path in a 100 × 100 box, y up. The gain is drawn
 * as given, not refitted; the bottom may overshoot by one box so a steep
 * rolloff runs down to the plot's floor, which clips it. Null when the response throws or is not finite.
 */
export function filterResponsePath(config: Pick<DialFilterConfig, 'cutoff' | 'resonance' | 'response'>, value: DialFilterValue): string | null {
  const c = filterHand01(value.cutoff, resolveFilterAxis(config.cutoff, 'cutoff'));
  const r = filterHand01(value.resonance, resolveFilterAxis(config.resonance, 'resonance'));
  const points: string[] = [];
  try {
    const response = config.response ? config.response(c, r) : filterShapeResponse('lowpass', c, r);
    if (typeof response !== 'function') return null;
    for (let i = 0; i < FILTER_SAMPLES; i++) {
      const y = response(i / (FILTER_SAMPLES - 1));
      if (!Number.isFinite(y)) return null;
      points.push(`${i ? 'L' : 'M'} ${(i / (FILTER_SAMPLES - 1) * 100).toFixed(2)} ${((1 - clamp(y, -1, 1)) * 100).toFixed(2)}`);
    }
  } catch {
    return null;
  }
  return points.join(' ');
}
