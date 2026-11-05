// The live analyser row's DOM-free helpers: byte conversions, frequency-bin
// banding, per-column reductions, and the per-point spring. The engine
// (analyser-engine.ts) feeds them plain typed arrays read from an AnalyserNode.

export type AnalyserScale = 'log' | 'linear';
/** `true` uses the default spring; an object sets stiffness and damping. */
export type AnalyserSpring = boolean | { stiffness?: number; damping?: number };

/**
 * A read-only live analyser row: a spectrum or an oscilloscope of the app's
 * AnalyserNode. It holds no value, so nothing lands in the resolved values,
 * versions, or storage. The node is only read, never changed: its fftSize,
 * smoothing, and dB window stay the app's.
 */
export type DialAnalyserConfig = {
  type: 'analyser';
  /** The live node, read every frame: a getter, so the app can supply it after its audio context starts. */
  analyser: () => AnalyserNode | null;
  /** `'frequency'` (default): a spectrum. `'waveform'`: an oscilloscope. */
  source?: 'frequency' | 'waveform';
  /** `'area'` (default) fills under the trace; `'line'` draws the trace only. */
  variant?: 'line' | 'area';
  /** `'smooth'` (default) or `'pixelated'` blocks. */
  mode?: 'smooth' | 'pixelated';
  /** Pixelated only: the block size multiplier. Default 2. */
  pixelSize?: number;
  /** Spectrum spacing. Default `'log'`. */
  scale?: AnalyserScale;
  /** Spring the trace's movement on top of the node's own smoothing. Default off. */
  spring?: AnalyserSpring;
  /** Spectrum only: show only this frequency window, in Hz. */
  rangeHz?: readonly [number, number];
  /** Spectrum only: a vertical reference line in Hz, read every frame. */
  marker?: () => number | null;
  /** Plot height in px, from 32 to 160. Default 56. */
  height?: number;
  /** `false` hides the label line; a string replaces the key's label. */
  label?: false | string;
};

/** Byte frequency magnitude (0 to 255, the node's dB window) → 0 to 1. */
export function byteFreqToUnit(v: number): number {
  return v / 255;
}

/** Byte time-domain sample (0 to 255, 128 = silence) → −1 to 1. */
export function byteTimeToUnit(v: number): number {
  return (v - 128) / 128;
}

/**
 * The [start, end) frequency bins behind display point `point`. Bin 0 (DC) is
 * skipped; log spacing starts at bin 1 so the low end gets the resolution a
 * musical spectrum wants. `loBin` and `hiBin` confine it to a window.
 */
export function binRange(point: number, points: number, bins: number, scale: AnalyserScale, loBin = 1, hiBin = bins): { start: number; end: number } {
  if (bins <= 2) return { start: Math.max(0, bins - 1), end: Math.max(1, bins) };
  const lo = Math.max(1, Math.min(bins - 1, loBin));
  const hi = Math.max(lo + 1, Math.min(bins, hiBin));
  const at = (t: number) => (scale === 'log' ? lo * Math.pow(hi / lo, t) : lo + (hi - lo) * t);
  const start = Math.max(lo, Math.min(hi - 1, Math.floor(at(point / points))));
  const end = Math.max(start + 1, Math.min(hi, Math.floor(at((point + 1) / points))));
  return { start, end };
}

/** A window in Hz → bins. Null when it is unusable; the full range then shows. */
export function hzWindowToBins(rangeHz: readonly [number, number], nyquistHz: number, bins: number): { loBin: number; hiBin: number } | null {
  const [loHz, hiHz] = rangeHz;
  if (!Number.isFinite(loHz) || !Number.isFinite(hiHz) || !(nyquistHz > 0) || bins <= 2) return null;
  if (!(hiHz > loHz) || hiHz <= 0) return null;
  const toBin = (hz: number) => (hz / nyquistHz) * bins;
  const loBin = Math.max(1, Math.min(bins - 1, toBin(Math.max(0, loHz))));
  const hiBin = Math.max(loBin + 1, Math.min(bins, toBin(hiHz)));
  return { loBin, hiBin };
}

/** Where `bin` sits from 0 to 1 across the window, spaced like `binRange`. Null outside it. */
export function markerT(bin: number, scale: AnalyserScale, loBin: number, hiBin: number): number | null {
  if (!Number.isFinite(bin) || !(hiBin > loBin) || loBin <= 0) return null;
  const t = scale === 'log' ? Math.log(bin / loBin) / Math.log(hiBin / loBin) : (bin - loBin) / (hiBin - loBin);
  return t >= 0 && t <= 1 && Number.isFinite(t) ? t : null;
}

/** One 0 to 1 magnitude per display point: the loudest bin in its band, so narrow peaks survive. */
export function fillFrequencyTargets(data: Uint8Array, out: Float32Array, scale: AnalyserScale, loBin = 1, hiBin = data.length) {
  const points = out.length;
  for (let i = 0; i < points; i++) {
    const { start, end } = binRange(i, points, data.length, scale, loBin, hiBin);
    let mx = 0;
    for (let b = start; b < end; b++) if (data[b] > mx) mx = data[b];
    out[i] = byteFreqToUnit(mx);
  }
}

/** Per-column min and max amplitude of time-domain bytes. */
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

/** Time-domain bytes resampled linearly to `out.length` amplitudes: the smooth trace. */
export function resampleWaveform(data: Uint8Array, out: Float32Array) {
  const n = out.length;
  if (!n) return;
  if (!data.length) { out.fill(0); return; }
  if (n === 1 || data.length === 1) { out.fill(byteTimeToUnit(data[0])); return; }
  const step = (data.length - 1) / (n - 1);
  for (let i = 0; i < n; i++) {
    const x = i * step;
    const j = Math.floor(x);
    const a = byteTimeToUnit(data[j]);
    const b = byteTimeToUnit(data[Math.min(data.length - 1, j + 1)]);
    out[i] = a + (b - a) * (x - j);
  }
}

// Unit mass, semi-implicit Euler, substepped so a long frame stays stable.
const SPRING_MAX_STEP = 1 / 240;

/** Steps each point's spring toward its target by `dt` seconds. */
export function stepSprings(pos: Float32Array, vel: Float32Array, targets: Float32Array, stiffness: number, damping: number, dt: number) {
  let remaining = dt;
  while (remaining > 0) {
    const h = Math.min(remaining, SPRING_MAX_STEP);
    remaining -= h;
    for (let i = 0; i < pos.length; i++) {
      vel[i] += (-stiffness * (pos[i] - targets[i]) - damping * vel[i]) * h;
      pos[i] += vel[i] * h;
    }
  }
}

/** The `spring` option: null when off, else stiffness and damping clamped to the stable range. */
export function normalizeSpring(spring: AnalyserSpring | undefined): { stiffness: number; damping: number } | null {
  if (!spring) return null;
  const raw = spring === true ? {} : spring;
  return {
    stiffness: Math.min(1000, Math.max(1, raw.stiffness ?? 120)),
    damping: Math.min(100, Math.max(1, raw.damping ?? 14)),
  };
}

/** One device pixel column times the block size. */
export function columnWidth(dpr: number, pixelSize: number): number {
  return Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSize)));
}

/** Snaps a device-pixel coordinate onto the block grid. */
export function quantizeToGrid(v: number, colW: number): number {
  return Math.round(v / colW) * colW;
}
