// Pure, DOM-free helpers for the real-time analyser visualizer: byte→unit
// conversions, frequency-bin banding, per-column reductions, and the per-point
// spring stepper. Kept in their own module (rather than inline in the engine) so
// they can be unit-tested without a canvas or an AudioContext — the engine feeds
// them plain typed arrays read from an AnalyserNode.

export type AnalyserScale = 'log' | 'linear';
/** `true` enables the default spring; an object overrides stiffness/damping. */
export type AnalyserSpring = boolean | { stiffness?: number; damping?: number };

/** Byte frequency magnitude (0..255, the analyser's minDecibels..maxDecibels window) → 0..1. */
export function byteFreqToUnit(v: number): number {
  return v / 255;
}

/** Byte time-domain sample (0..255, 128 = silence) → signed amplitude −1..1. */
export function byteTimeToUnit(v: number): number {
  return (v - 128) / 128;
}

// The [start, end) frequency-bin span backing display point `point` of `points`.
// Bin 0 (DC) is skipped; log spacing is anchored at bin 1 so the low end gets the
// resolution a musical spectrum wants. Always spans at least one bin, and clamps
// into range whether points outnumber bins or vice versa.
export function binRange(point: number, points: number, bins: number, scale: AnalyserScale): { start: number; end: number } {
  if (bins <= 2) return { start: Math.max(0, bins - 1), end: Math.max(1, bins) };
  const lo = 1;
  const at = (t: number) => (scale === 'log' ? Math.pow(bins, t) * lo : lo + (bins - lo) * t);
  let start = Math.floor(at(point / points));
  start = Math.max(lo, Math.min(bins - 1, start));
  const end = Math.max(start + 1, Math.min(bins, Math.floor(at((point + 1) / points))));
  return { start, end };
}

// Fill one 0..1 magnitude per display point: the loudest bin in each point's band
// (band max, not average — narrow peaks must survive the reduction).
export function fillFrequencyTargets(data: Uint8Array, out: Float32Array, scale: AnalyserScale) {
  const points = out.length;
  for (let i = 0; i < points; i++) {
    const { start, end } = binRange(i, points, data.length, scale);
    let mx = 0;
    for (let b = start; b < end; b++) {
      if (data[b] > mx) mx = data[b];
    }
    out[i] = byteFreqToUnit(mx);
  }
}

// Per-column min/max signed amplitude over time-domain bytes (the fillPeaks
// algorithm from waveform-dsp, fed bytes). Arrays are reused every frame.
export function fillWaveformMinMax(data: Uint8Array, cols: number, min: Float32Array, max: Float32Array) {
  const step = data.length / cols;
  for (let x = 0; x < cols; x++) {
    const start = Math.floor(x * step);
    const end = Math.max(start + 1, Math.min(data.length, Math.floor((x + 1) * step)));
    let mn = 1;
    let mx = -1;
    for (let i = start; i < end; i++) {
      const v = byteTimeToUnit(data[i]);
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
    min[x] = mn;
    max[x] = mx;
  }
}

// Linearly resample time-domain bytes to `out.length` signed amplitudes — the
// smooth oscilloscope trace (min/max columns would double the line at high zoom).
export function resampleWaveform(data: Uint8Array, out: Float32Array) {
  const n = out.length;
  if (!n) return;
  if (!data.length) {
    out.fill(0);
    return;
  }
  if (n === 1 || data.length === 1) {
    out.fill(byteTimeToUnit(data[0]));
    return;
  }
  const step = (data.length - 1) / (n - 1);
  for (let i = 0; i < n; i++) {
    const x = i * step;
    const j = Math.floor(x);
    const a = byteTimeToUnit(data[j]);
    const b = byteTimeToUnit(data[Math.min(data.length - 1, j + 1)]);
    out[i] = a + (b - a) * (x - j);
  }
}

// The spring integrator (Hooke + damping, unit mass, semi-implicit Euler — the
// same scheme as curve-composer-core's springPoints) applied independently per
// display point. Substepped so a worst-case frame delta stays well inside the
// integrator's stability region for the whole allowed stiffness range.
const SPRING_MAX_STEP = 1 / 240;
export function stepSprings(
  pos: Float32Array,
  vel: Float32Array,
  targets: Float32Array,
  stiffness: number,
  damping: number,
  dt: number
) {
  let remaining = dt;
  while (remaining > 0) {
    const h = Math.min(remaining, SPRING_MAX_STEP);
    remaining -= h;
    for (let i = 0; i < pos.length; i++) {
      const accel = -stiffness * (pos[i] - targets[i]) - damping * vel[i];
      vel[i] += accel * h;
      pos[i] += vel[i] * h;
    }
  }
}

export const SPRING_DEFAULT_STIFFNESS = 120;
export const SPRING_DEFAULT_DAMPING = 14;

// Resolve the `spring` prop: null when off, otherwise stiffness/damping clamped to
// the range the substepped integrator is stable in.
export function normalizeSpring(spring: AnalyserSpring | undefined): { stiffness: number; damping: number } | null {
  if (!spring) return null;
  const raw = spring === true ? {} : spring;
  return {
    stiffness: Math.min(1000, Math.max(1, raw.stiffness ?? SPRING_DEFAULT_STIFFNESS)),
    damping: Math.min(100, Math.max(1, raw.damping ?? SPRING_DEFAULT_DAMPING)),
  };
}

// One CSS pixel per column times the pixelSize multiplier — identical to the
// waveform engine's column sizing so the two visualizers pixelate in lockstep.
export function columnWidth(dpr: number, pixelSize: number): number {
  return Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSize)));
}

/** Snap a device-pixel coordinate onto the pixel-mode block grid. */
export function quantizeToGrid(v: number, colW: number): number {
  return Math.round(v / colW) * colW;
}
