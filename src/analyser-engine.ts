// Framework-agnostic rendering engine for the real-time analyser visualizer.
// React / Svelte / Solid / Vue each wrap this with a thin component that owns the
// markup and reactive state; the engine owns the canvas and the rAF loop, reading
// the current props through a `get()` callback so it never needs to be torn down
// when a prop changes. Display-only: it reads the AnalyserNode every frame and
// never mutates it (fftSize, smoothing, and the dB window stay the host's).

import {
  fillFrequencyTargets,
  fillWaveformMinMax,
  resampleWaveform,
  stepSprings,
  normalizeSpring,
  columnWidth as coreColumnWidth,
  quantizeToGrid,
  type AnalyserScale,
  type AnalyserSpring,
} from './analyser-core';

export type { AnalyserScale, AnalyserSpring } from './analyser-core';

export type AnalyserSource = 'frequency' | 'waveform';
export type AnalyserVariant = 'line' | 'area';
export type AnalyserMode = 'smooth' | 'pixelated';

/** Everything the engine reads each frame. Wrappers supply a getter for the live values. */
export interface AnalyserRuntime {
  analyser: AnalyserNode | null;
  source: AnalyserSource;
  variant: AnalyserVariant;
  mode: AnalyserMode;
  pixelSize: number;
  scale: AnalyserScale;
  spring: AnalyserSpring;
  grid: boolean;
  gridSubdivisions: number;
  waveColor?: string;
  fillColor?: string;
  /** Dims the trace as feedback — the host owns the actual gain routing. */
  muted: boolean;
  width: number;
  height: number;
}

export interface AnalyserEngine {
  destroy(): void;
}

// Smooth mode: how many points the trace is simplified to.
const SMOOTH_POINTS = 64;
// Fill opacity for the area variant (matches the waveform's bordered fill).
const AREA_FILL_ALPHA = 0.2;
// Muted trace opacity multiplier.
const MUTED_ALPHA = 0.35;
// Frequency trace amplitude as a fraction of height (headroom so full scale doesn't clip).
const FREQ_AMP = 0.92;
// Waveform trace amplitude (same proportion as the waveform visualizer).
const WAVE_AMP = 0.42;
// Cap on the spring frame delta: rAF pauses while the tab is hidden, so the first
// delta after resume can be huge — clamping it keeps the springs from exploding.
const MAX_DT = 0.05;

type Pt = { x: number; y: number };

// Catmull-Rom → cubic bezier: a smooth curve through `pts` (path already at pts[0]).
// Same recipe as the waveform engine's.
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

/**
 * Mount the renderer on `canvas`, reading the current props from `get()` every
 * frame. Returns a handle whose `destroy()` stops the loop.
 *
 * Smoothing layers compose rather than compete: the analyser's own
 * `smoothingTimeConstant` smooths the *data* (and is left untouched here), while
 * the `spring` option smooths the *rendering* on top — it can overshoot, the
 * analyser's smoothing never does.
 */
export function createAnalyserEngine(canvas: HTMLCanvasElement, get: () => AnalyserRuntime): AnalyserEngine {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {} };

  const readDpr = () => Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
  // Re-read per frame so moving the window to a different-density display keeps
  // the backing-store resolution in sync.
  let dpr = readDpr();

  // Size-dependent state, kept in sync by syncSize when width/height/dpr change.
  let W = 0;
  let H = 0;
  let cy = 0;

  const syncSize = (width: number, height: number) => {
    dpr = readDpr();
    const nw = Math.round(width * dpr);
    const nh = Math.round(height * dpr);
    if (nw === W && nh === H) return;
    W = canvas.width = nw;
    H = canvas.height = nh;
    cy = H / 2;
  };

  const columnWidth = (pixelSize: number) => coreColumnWidth(dpr, pixelSize);

  // Byte buffer read from the analyser, reallocated only when the required size
  // changes (frequencyBinCount vs fftSize) — zero per-frame allocation.
  let bytes = new Uint8Array(0);

  // Display-point state: targets straight from the data, plus sprung positions and
  // velocities. `a` is the only set frequency/smooth-waveform use; `b` carries the
  // second (min) series for pixelated waveform columns.
  let targetsA = new Float32Array(0);
  let targetsB = new Float32Array(0);
  let posA = new Float32Array(0);
  let posB = new Float32Array(0);
  let velA = new Float32Array(0);
  let velB = new Float32Array(0);
  let springSeeded = false;

  const syncPoints = (n: number) => {
    if (targetsA.length === n) return;
    targetsA = new Float32Array(n);
    targetsB = new Float32Array(n);
    posA = new Float32Array(n);
    posB = new Float32Array(n);
    velA = new Float32Array(n);
    velB = new Float32Array(n);
    springSeeded = false; // re-seed on the next sprung frame (one-frame snap, deliberate)
  };

  // Faint reference grid: `subs` vertical lines (same recipe as the waveform engine).
  const drawGrid = (base: string, subs: number) => {
    const n = Math.max(1, Math.round(subs));
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
      const x = Math.round((i / n) * W) + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // Resting baseline: the bottom edge for a spectrum, the center for a waveform.
  const baselineY = (source: AnalyserSource) => (source === 'frequency' ? H - Math.round(dpr) : cy);

  const drawBaseline = (base: string, source: AnalyserSource, alpha: number) => {
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.15 * alpha;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    const y = Math.round(baselineY(source)) + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // Symmetric band between the signal's max (top) and min (bottom) envelopes —
  // the oscilloscope's area look, and the waveform's bordered-fill recipe.
  const drawBand = (top: Float32Array, bottom: Float32Array, wave: string, fill: string, alpha: number) => {
    const n = top.length;
    if (n < 2) return;
    const px = (k: number) => (k / (n - 1)) * W;
    const toY = (v: number) => cy - v * (H * WAVE_AMP);
    const topPts: Pt[] = new Array(n);
    for (let k = 0; k < n; k++) topPts[k] = { x: px(k), y: toY(top[k]) };
    const botPts: Pt[] = new Array(n);
    for (let k = 0; k < n; k++) botPts[k] = { x: px(n - 1 - k), y: toY(bottom[n - 1 - k]) };

    ctx.beginPath();
    ctx.moveTo(topPts[0].x, topPts[0].y);
    smoothThrough(ctx, topPts);
    ctx.lineTo(botPts[0].x, botPts[0].y);
    smoothThrough(ctx, botPts);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.globalAlpha = AREA_FILL_ALPHA * alpha;
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // Smooth trace through the display points: stroked line, optionally closed down
  // to the baseline as a translucent area (the spectrum's bordered-fill recipe).
  const drawSmooth = (
    values: Float32Array,
    toY: (v: number) => number,
    baseY: number,
    area: boolean,
    wave: string,
    fill: string,
    alpha: number
  ) => {
    const n = values.length;
    if (n < 2) return;
    const pts: Pt[] = new Array(n);
    for (let k = 0; k < n; k++) pts[k] = { x: (k / (n - 1)) * W, y: toY(values[k]) };

    if (area) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      smoothThrough(ctx, pts);
      ctx.lineTo(W, baseY);
      ctx.lineTo(0, baseY);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.globalAlpha = AREA_FILL_ALPHA * alpha;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    smoothThrough(ctx, pts);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // Chunky per-column blocks (the waveform's pixelated language). For a spectrum,
  // `area` anchors bars to the bottom while `line` floats one block-sized step per
  // column, snapped to the block grid. For a waveform, `area` fills the min→max
  // span while `line` traces its two edges as block steps (they merge into a
  // single center trace at silence).
  const drawColumns = (
    source: AnalyserSource,
    variant: AnalyserVariant,
    pixelSize: number,
    wave: string,
    alpha: number
  ) => {
    const colW = columnWidth(pixelSize);
    ctx.fillStyle = wave;
    ctx.globalAlpha = alpha;
    const n = targetsA.length;
    const src = springActive ? posA : targetsA;
    const srcB = springActive ? posB : targetsB;
    for (let k = 0; k < n; k++) {
      const x = k * colW;
      if (x >= W) break;
      if (source === 'frequency') {
        const yTop = Math.max(0, Math.min(H - colW, quantizeToGrid(H - src[k] * (H * FREQ_AMP), colW)));
        if (variant === 'area') ctx.fillRect(x, yTop, colW, H - yTop);
        else ctx.fillRect(x, yTop, colW, colW);
      } else {
        const yTop = Math.round(cy - src[k] * (H * WAVE_AMP));
        const yBot = Math.round(cy - srcB[k] * (H * WAVE_AMP));
        if (variant === 'area') {
          ctx.fillRect(x, Math.max(0, Math.min(H - 1, yTop)), colW, Math.max(1, yBot - yTop));
        } else {
          const block = (yEdge: number) => {
            const y = Math.max(0, Math.min(H - colW, quantizeToGrid(yEdge - colW / 2, colW)));
            ctx.fillRect(x, y, colW, colW);
          };
          block(yTop);
          block(yBot);
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  let springActive = false;
  let prevNow: number | null = null;

  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const rt = get();
    syncSize(rt.width, rt.height);

    const dt = prevNow == null ? 0 : Math.min((now - prevNow) / 1000, MAX_DT);
    prevNow = now;

    const base = getComputedStyle(canvas).color || 'rgb(255,255,255)';
    const alpha = rt.muted ? MUTED_ALPHA : 1;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = rt.mode === 'smooth';

    if (rt.grid) drawGrid(base, rt.gridSubdivisions);
    drawBaseline(base, rt.source, alpha);

    const an = rt.analyser;
    if (!an) return; // idle: baseline + grid only

    // --- read ---
    const needed = rt.source === 'frequency' ? an.frequencyBinCount : an.fftSize;
    if (bytes.length !== needed) bytes = new Uint8Array(needed);
    if (rt.source === 'frequency') an.getByteFrequencyData(bytes);
    else an.getByteTimeDomainData(bytes);

    // --- reduce to display targets ---
    const pixelated = rt.mode === 'pixelated';
    const n = pixelated ? Math.max(2, Math.ceil(W / columnWidth(rt.pixelSize))) : SMOOTH_POINTS;
    syncPoints(n);
    // The waveform's area (band) needs both envelopes; its smooth line is a single
    // resampled trace. `b` carries the min series whenever both are in play.
    const twoSeries = rt.source === 'waveform' && (pixelated || rt.variant === 'area');
    if (rt.source === 'frequency') {
      fillFrequencyTargets(bytes, targetsA, rt.scale);
    } else if (twoSeries) {
      fillWaveformMinMax(bytes, n, targetsB, targetsA); // A carries max, B min
    } else {
      resampleWaveform(bytes, targetsA);
    }

    // --- spring layer (render-side; the analyser's own smoothing is data-side) ---
    const spring = normalizeSpring(rt.spring);
    springActive = !!spring;
    if (spring) {
      if (!springSeeded) {
        posA.set(targetsA);
        posB.set(targetsB);
        velA.fill(0);
        velB.fill(0);
        springSeeded = true;
      }
      stepSprings(posA, velA, targetsA, spring.stiffness, spring.damping, dt);
      if (twoSeries) stepSprings(posB, velB, targetsB, spring.stiffness, spring.damping, dt);
    } else {
      springSeeded = false;
    }

    // --- draw ---
    const wave = rt.waveColor || base;
    const fill = rt.fillColor || wave;
    if (pixelated) {
      drawColumns(rt.source, rt.variant, rt.pixelSize, wave, alpha);
    } else {
      const values = springActive ? posA : targetsA;
      if (rt.source === 'frequency') {
        drawSmooth(values, (v) => H - v * (H * FREQ_AMP), baselineY('frequency'), rt.variant === 'area', wave, fill, alpha);
      } else if (rt.variant === 'area') {
        drawBand(values, springActive ? posB : targetsB, wave, fill, alpha);
      } else {
        drawSmooth(values, (v) => cy - v * (H * WAVE_AMP), cy, false, wave, fill, alpha);
      }
    }
  };

  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
    },
  };
}
