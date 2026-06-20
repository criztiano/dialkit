import { useRef, useEffect } from 'react';

export type WaveformMode = 'smooth' | 'pixelated';

interface WaveformVisualizationProps {
  /** Decoded audio sample. Its full waveform is drawn once (fixed). */
  buffer?: AudioBuffer | null;
  /** Playhead position, 0..1. */
  progress?: number;
  /**
   * Polled every frame for a buttery playhead without re-rendering the parent.
   * Overrides `progress` when provided — return the current play position (0..1).
   */
  getProgress?: () => number;
  /**
   * 'smooth' — anti-aliased min/max envelope.
   * 'pixelated' — crisp, high-resolution per-pixel min/max columns (no AA).
   */
  mode?: WaveformMode;
  /** Split the sample into low / mid / high bands and draw three overlaid waveforms. */
  bands?: boolean;
  width?: number;
  height?: number;
}

// Crossover filters for the optional 3-band EQ split (applied offline to the sample).
const BANDS: { type: BiquadFilterType; freq: number; q?: number }[] = [
  { type: 'lowpass', freq: 250 },
  { type: 'bandpass', freq: 1100, q: 0.6 },
  { type: 'highpass', freq: 4200 },
];
const BAND_ALPHA = [0.6, 0.42, 0.28];

type Peaks = { min: Float32Array; max: Float32Array };

function mixToMono(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) return buffer.getChannelData(0);
  const len = buffer.length;
  const out = new Float32Array(len);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < len; i++) out[i] += data[i] / buffer.numberOfChannels;
  }
  return out;
}

// Min/max amplitude per pixel column — the whole sample condensed to the canvas width.
function computePeaks(data: Float32Array, cols: number): Peaks {
  const min = new Float32Array(cols);
  const max = new Float32Array(cols);
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
  return { min, max };
}

// Render the sample through one band filter offline, returning the filtered buffer.
async function filterBuffer(buffer: AudioBuffer, band: (typeof BANDS)[number]): Promise<AudioBuffer> {
  const off = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const src = off.createBufferSource();
  src.buffer = buffer;
  const filter = off.createBiquadFilter();
  filter.type = band.type;
  filter.frequency.value = band.freq;
  if (band.q != null) filter.Q.value = band.q;
  src.connect(filter);
  filter.connect(off.destination);
  src.start();
  return off.startRendering();
}

export function WaveformVisualization({
  buffer = null,
  progress = 0,
  getProgress,
  mode = 'smooth',
  bands = false,
  width = 256,
  height = 140,
}: WaveformVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mode/playhead change rendering only — keep them in refs so the loop reads the
  // latest values without recomputing the (expensive) peaks.
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const getProgressRef = useRef(getProgress);
  getProgressRef.current = getProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
    const W = (canvas.width = Math.round(width * dpr));
    const H = (canvas.height = Math.round(height * dpr));
    const cy = H / 2;
    const amp = H * 0.42;

    let cancelled = false;
    let peaks: Peaks[] = [];

    // Compute peaks once per buffer/bands/size — the expensive part (EQ offline-filters).
    (async () => {
      if (!buffer) return;
      if (bands) {
        const filtered = await Promise.all(BANDS.map((b) => filterBuffer(buffer, b)));
        if (cancelled) return;
        peaks = filtered.map((fb) => computePeaks(mixToMono(fb), W));
      } else {
        peaks = [computePeaks(mixToMono(buffer), W)];
      }
    })();

    // Draw one envelope between [x0, x1) at a given alpha, in the active mode.
    const drawRange = (p: Peaks, base: string, alpha: number, x0: number, x1: number) => {
      if (x1 <= x0) return;
      ctx.globalAlpha = alpha;
      if (modeRef.current === 'pixelated') {
        ctx.fillStyle = base;
        for (let x = x0; x < x1; x++) {
          const yTop = Math.round(cy - p.max[x] * amp);
          const yBot = Math.round(cy - p.min[x] * amp);
          ctx.fillRect(x, yTop, 1, Math.max(1, yBot - yTop));
        }
      } else {
        ctx.fillStyle = base;
        ctx.beginPath();
        ctx.moveTo(x0, cy - p.max[x0] * amp);
        for (let x = x0; x < x1; x++) ctx.lineTo(x, cy - p.max[x] * amp);
        for (let x = x1 - 1; x >= x0; x--) ctx.lineTo(x, cy - p.min[x] * amp);
        ctx.closePath();
        ctx.fill();
      }
    };

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const base = getComputedStyle(canvas).color || 'rgb(255,255,255)';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = modeRef.current === 'smooth';

      // center baseline
      ctx.strokeStyle = base;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.moveTo(0, Math.round(cy) + 0.5);
      ctx.lineTo(W, Math.round(cy) + 0.5);
      ctx.stroke();

      const prog = getProgressRef.current ? getProgressRef.current() : progressRef.current;
      const playX = Math.max(0, Math.min(1, prog || 0)) * W;
      const split = Math.max(0, Math.min(W, Math.floor(playX)));

      // Fixed waveform(s): played portion at full alpha, unplayed dimmer.
      for (let i = 0; i < peaks.length; i++) {
        const alpha = peaks.length === 3 ? BAND_ALPHA[i] : 0.6;
        drawRange(peaks[i], base, alpha, 0, split);
        drawRange(peaks[i], base, alpha * 0.45, split, W);
      }

      // Playhead
      if (peaks.length) {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = base;
        ctx.lineWidth = 1.5 * dpr;
        const px = Math.round(playX) + 0.5;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, H);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    frame();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [buffer, bands, width, height]);

  return <canvas ref={canvasRef} className="dialkit-waveform-viz" style={{ width, height }} />;
}
