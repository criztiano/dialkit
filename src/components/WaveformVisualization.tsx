import { useRef, useEffect, useState } from 'react';

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
  /**
   * Pixelated mode only: block-size multiplier. 1 (default) ≈ one CSS pixel per
   * column; 2 / 4 / 6 make progressively chunkier, lower-resolution columns.
   */
  pixelSize?: number;
  /** Overlay a faint reference grid behind the waveform. */
  grid?: boolean;
  /** Vertical time-divisions in the grid when `grid` is on (default 8). */
  gridSubdivisions?: number;
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
// Each "+" doubles magnification; window = 1 / zoom of the sample's duration.
const MAX_ZOOM = 8;
// Horizontal (amplitude) divisions of the grid; vertical count is `gridSubdivisions`.
const GRID_ROWS = 4;

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

// Fill min/max amplitude for `cols` columns spanning `data` into the given arrays
// (reused every frame, so no per-frame allocation).
function fillPeaks(data: Float32Array, cols: number, min: Float32Array, max: Float32Array) {
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
  pixelSize = 1,
  grid = false,
  gridSubdivisions = 8,
  width = 256,
  height = 140,
}: WaveformVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);

  // Live values read inside the rAF loop, so changing them never restarts the effect.
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const borderRef = useRef(border);
  borderRef.current = border;
  const pixelSizeRef = useRef(pixelSize);
  pixelSizeRef.current = pixelSize;
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const gridSubsRef = useRef(gridSubdivisions);
  gridSubsRef.current = gridSubdivisions;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
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
    // One CSS pixel per column (two device pixels on retina), times the pixelSize
    // multiplier — chunkier blocks at 2/4/6. Read per call so the slider is live.
    const columnWidth = () => Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSizeRef.current)));

    let cancelled = false;
    // Mono sample data per band (or one entry, bands off). Peaks are recomputed per
    // frame from the visible window so zoom reveals real detail, not stretched pixels.
    let monos: Float32Array[] = [];

    (async () => {
      if (!buffer) return;
      const bufs = bands ? await Promise.all(BANDS.map((b) => filterBuffer(buffer, b))) : [buffer];
      if (cancelled) return;
      monos = bufs.map((b) => mixToMono(b));
    })();

    // Scratch peak arrays reused every frame/band — no per-frame allocation.
    const pk: Peaks = { min: new Float32Array(W), max: new Float32Array(W) };

    // Chunky, full-opacity min/max columns.
    const drawColumns = (p: Peaks, color: string) => {
      const colW = columnWidth();
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

    // Faint reference grid: `gridSubdivisions` vertical lines + GRID_ROWS horizontal.
    const drawGrid = (base: string) => {
      const subs = Math.max(1, Math.round(gridSubsRef.current));
      ctx.strokeStyle = base;
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = dpr;
      ctx.beginPath();
      for (let i = 1; i < subs; i++) {
        const x = Math.round((i / subs) * W) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let r = 1; r < GRID_ROWS; r++) {
        const y = Math.round((r / GRID_ROWS) * H) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const base = getComputedStyle(canvas).color || 'rgb(255,255,255)';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = modeRef.current === 'smooth';

      if (gridRef.current) drawGrid(base);

      // center baseline
      ctx.strokeStyle = base;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.moveTo(0, Math.round(cy) + 0.5);
      ctx.lineTo(W, Math.round(cy) + 0.5);
      ctx.stroke();
      ctx.globalAlpha = 1;

      const count = monos.length;
      if (count) {
        const prog = Math.max(0, Math.min(1, (getProgressRef.current ? getProgressRef.current() : progressRef.current) || 0));
        // Zoomed window centered on the playhead, clamped to the sample edges so the
        // playhead is always on screen.
        const zoomLvl = Math.max(1, zoomRef.current);
        const win = 1 / zoomLvl;
        let start = prog - win / 2;
        if (start < 0) start = 0;
        else if (start > 1 - win) start = 1 - win;
        const end = start + win;

        // Bands drawn low → high so the spikier high band reads on top.
        for (let i = 0; i < count; i++) {
          const mono = monos[i];
          const s0 = Math.max(0, Math.floor(start * mono.length));
          const s1 = Math.min(mono.length, Math.ceil(end * mono.length));
          const slice = s1 > s0 ? mono.subarray(s0, s1) : mono;
          fillPeaks(slice, W, pk.min, pk.max);
          const color = count === 3 ? BAND_COLORS[i] : base;
          if (modeRef.current === 'pixelated') drawColumns(pk, color);
          else drawSimplified(envelope(pk, W, SIMPLE_POINTS), color, borderRef.current);
        }

        // playhead — mapped into the (possibly zoomed) window so it stays visible
        const playX = ((prog - start) / win) * W;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = base;
        ctx.lineWidth = 1.5 * dpr;
        const px = Math.round(Math.max(0, Math.min(W, playX))) + 0.5;
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

  return (
    <div className="dialkit-waveform-viz-wrap" style={{ width }}>
      <canvas ref={canvasRef} className="dialkit-waveform-viz" style={{ width, height }} />
      <div className="dialkit-waveform-zoom">
        {zoom > 1 && (
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z / 2))}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {zoom < MAX_ZOOM && (
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z * 2))}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
