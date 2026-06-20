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
   * 'smooth' — a simplified, SVG-like envelope: few points, Catmull-Rom
   * interpolation, solid fill (the gist of the sample's dynamics).
   * 'pixelated' — crisp, chunky per-column min/max bars.
   */
  mode?: WaveformMode;
  /**
   * Smooth mode only. When false (default) the shape is a solid fill; when true
   * it becomes a translucent fill with a crisp outline.
   */
  border?: boolean;
  /** Split the sample into low / mid / high bands (three color-coded shapes). */
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
// Low / mid / high — purple, cyan, lime.
const BAND_COLORS = ['#a855f7', '#22d3ee', '#a3e635'];

// Smooth mode: how many points the envelope is simplified to.
const SIMPLE_POINTS = 46;
// Fill opacity used only for the bordered (outlined) variant.
const BORDER_FILL_ALPHA = 0.2;

type Peaks = { min: Float32Array; max: Float32Array };
type Pt = { x: number; y: number };

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

// Simplified symmetric envelope: peak amplitude over each of `n` evenly-spaced segments.
function envelope(p: Peaks, cols: number, n: number): number[] {
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

// Catmull-Rom → cubic bezier: a smooth curve through `pts` (path already at pts[0]).
function smoothThrough(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    ctx.bezierCurveTo(
      p1.x + (p2.x - p0.x) / 6,
      p1.y + (p2.y - p0.y) / 6,
      p2.x - (p3.x - p1.x) / 6,
      p2.y - (p3.y - p1.y) / 6,
      p2.x,
      p2.y
    );
  }
}

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
  border = false,
  bands = false,
  width = 256,
  height = 140,
}: WaveformVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const borderRef = useRef(border);
  borderRef.current = border;
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
    // Pixel columns span ~one CSS pixel (two device pixels on retina) — chunkier.
    const colW = Math.max(1, Math.round(dpr));

    let cancelled = false;
    let peaks: Peaks[] = [];
    let envs: number[][] = [];

    // Compute peaks once per buffer/bands/size — the expensive part (EQ offline-filters).
    (async () => {
      if (!buffer) return;
      const bufs = bands ? await Promise.all(BANDS.map((b) => filterBuffer(buffer, b))) : [buffer];
      if (cancelled) return;
      peaks = bufs.map((b) => computePeaks(mixToMono(b), W));
      envs = peaks.map((p) => envelope(p, W, SIMPLE_POINTS));
    })();

    // Chunky, full-opacity min/max columns.
    const drawColumns = (p: Peaks, color: string) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = 1;
      for (let x = 0; x < W; x += colW) {
        let mn = 1;
        let mx = -1;
        for (let i = x; i < x + colW && i < W; i++) {
          if (p.min[i] < mn) mn = p.min[i];
          if (p.max[i] > mx) mx = p.max[i];
        }
        const yTop = Math.round(cy - mx * amp);
        const yBot = Math.round(cy - mn * amp);
        ctx.fillRect(x, yTop, colW, Math.max(1, yBot - yTop));
      }
    };

    // Simplified, smoothly-interpolated envelope: solid fill, or translucent + outline.
    const drawSimplified = (env: number[], color: string, outline: boolean) => {
      const n = env.length;
      if (n < 2) return;
      const px = (k: number) => (k / (n - 1)) * W;
      const top: Pt[] = env.map((a, k) => ({ x: px(k), y: cy - a * amp }));
      const bot: Pt[] = [];
      for (let k = n - 1; k >= 0; k--) bot.push({ x: px(k), y: cy + env[k] * amp });

      ctx.beginPath();
      ctx.moveTo(top[0].x, top[0].y);
      smoothThrough(ctx, top);
      ctx.lineTo(bot[0].x, bot[0].y);
      smoothThrough(ctx, bot);
      ctx.closePath();

      ctx.fillStyle = color;
      if (outline) {
        ctx.globalAlpha = BORDER_FILL_ALPHA;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6 * dpr;
        ctx.lineJoin = 'round';
        ctx.stroke();
      } else {
        ctx.globalAlpha = 1;
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

      // Bands drawn low → high so the spikier high band reads on top.
      const count = peaks.length;
      for (let i = 0; i < count; i++) {
        const color = count === 3 ? BAND_COLORS[i] : base;
        if (modeRef.current === 'pixelated') drawColumns(peaks[i], color);
        else drawSimplified(envs[i], color, borderRef.current);
      }

      // playhead
      if (count) {
        const prog = getProgressRef.current ? getProgressRef.current() : progressRef.current;
        const playX = Math.max(0, Math.min(1, prog || 0)) * W;
        ctx.globalAlpha = 1;
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
