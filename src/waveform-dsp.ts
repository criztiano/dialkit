// Pure, DOM-free DSP helpers for the waveform visualizer: down-mixing a buffer to
// mono, reducing samples to per-column min/max peaks, and simplifying those peaks
// to a symmetric envelope. Kept in their own module (rather than inline in the
// engine) so they can be unit-tested without a canvas or an AudioContext — the
// only "DOM" touch is the AudioBuffer *type*, which is duck-typed at runtime.

/** Per-column minimum and maximum sample amplitudes, packed into parallel arrays. */
export type Peaks = { min: Float32Array; max: Float32Array };

/** Down-mix every channel to a single mono track (channel average). Mono passes through. */
export function mixToMono(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) return buffer.getChannelData(0);
  const len = buffer.length;
  const out = new Float32Array(len);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < len; i++) out[i] += data[i] / buffer.numberOfChannels;
  }
  return out;
}

// Fill min/max amplitude for `cols` columns spanning `data` into the given arrays
// (reused every frame, so no per-frame allocation).
export function fillPeaks(data: Float32Array, cols: number, min: Float32Array, max: Float32Array) {
  const step = data.length / cols;
  for (let x = 0; x < cols; x++) {
    const start = Math.floor(x * step);
    const end = Math.max(start + 1, Math.min(data.length, Math.floor((x + 1) * step)));
    let mn = 1;
    let mx = -1;
    for (let i = start; i < end; i++) {
      const v = data[i];
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
    min[x] = mn;
    max[x] = mx;
  }
}

// Simplified symmetric envelope: peak amplitude over each of `n` evenly-spaced segments.
export function envelope(p: Peaks, cols: number, n: number): number[] {
  const out = new Array<number>(n);
  const seg = cols / n;
  for (let k = 0; k < n; k++) {
    const start = Math.floor(k * seg);
    const end = Math.max(start + 1, Math.min(cols, Math.floor((k + 1) * seg)));
    let a = 0;
    for (let x = start; x < end; x++) {
      const m = Math.max(Math.abs(p.min[x]), Math.abs(p.max[x]));
      if (m > a) a = m;
    }
    out[k] = a;
  }
  return out;
}
