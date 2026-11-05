// The analyser row's canvas renderer. It owns the canvas and the animation
// frame loop and reads the current options through `get()` every frame, so an
// option change never restarts it. It reads the AnalyserNode and never
// changes it.

import {
  columnWidth as coreColumnWidth, fillFrequencyTargets, fillWaveformMinMax, hzWindowToBins, markerT,
  normalizeSpring, quantizeToGrid, resampleWaveform, stepSprings, type DialAnalyserConfig,
} from './analyser';

export type AnalyserRuntime = Required<Pick<DialAnalyserConfig, 'source' | 'variant' | 'mode' | 'pixelSize' | 'scale' | 'spring'>> &
  Pick<DialAnalyserConfig, 'rangeHz' | 'marker'> & {
    analyser: AnalyserNode | null;
    width: number;
    height: number;
  };

// Smooth mode: points the trace is simplified to.
const SMOOTH_POINTS = 64;
const AREA_FILL_ALPHA = 0.2;
// Headroom so full scale does not clip.
const FREQ_AMP = 0.92;
const WAVE_AMP = 0.42;
// A hidden tab pauses the frame loop; the first frame after can have a huge delta.
const MAX_DT = 0.05;

type Pt = { x: number; y: number };

// Catmull-Rom as cubic Béziers: a smooth curve through `pts` (the path is already at pts[0]).
function smoothThrough(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    ctx.bezierCurveTo(p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6, p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6, p2.x, p2.y);
  }
}

/** Draws `get()`'s analyser on `canvas` every frame until `destroy()`. The trace takes the canvas's CSS color. */
export function createAnalyserEngine(canvas: HTMLCanvasElement, get: () => AnalyserRuntime): { destroy(): void } {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {} };

  const readDpr = () => Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
  let dpr = readDpr();
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

  // Buffers are reallocated only when their size changes: no allocation per frame.
  let bytes = new Uint8Array(0);
  // `A` is the trace (or the max envelope); `B` is the min envelope of a waveform band.
  let targetsA = new Float32Array(0);
  let targetsB = new Float32Array(0);
  let posA = new Float32Array(0);
  let posB = new Float32Array(0);
  let velA = new Float32Array(0);
  let velB = new Float32Array(0);
  let springSeeded = false;
  let springActive = false;
  const syncPoints = (n: number) => {
    if (targetsA.length === n) return;
    targetsA = new Float32Array(n);
    targetsB = new Float32Array(n);
    posA = new Float32Array(n);
    posB = new Float32Array(n);
    velA = new Float32Array(n);
    velB = new Float32Array(n);
    springSeeded = false;
  };

  // A spectrum rests on the bottom edge, a waveform on the middle.
  const baselineY = (source: AnalyserRuntime['source']) => (source === 'frequency' ? H - Math.round(dpr) : cy);

  const drawBaseline = (color: string, source: AnalyserRuntime['source']) => {
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    const y = Math.round(baselineY(source)) + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const stroke = (color: string) => {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  // The waveform's area: a band between its max and min envelopes.
  const drawBand = (top: Float32Array, bottom: Float32Array, color: string) => {
    const n = top.length;
    if (n < 2) return;
    const px = (k: number) => (k / (n - 1)) * W;
    const toY = (v: number) => cy - v * (H * WAVE_AMP);
    const topPts: Pt[] = Array.from({ length: n }, (_, k) => ({ x: px(k), y: toY(top[k]) }));
    const botPts: Pt[] = Array.from({ length: n }, (_, k) => ({ x: px(n - 1 - k), y: toY(bottom[n - 1 - k]) }));
    ctx.beginPath();
    ctx.moveTo(topPts[0].x, topPts[0].y);
    smoothThrough(ctx, topPts);
    ctx.lineTo(botPts[0].x, botPts[0].y);
    smoothThrough(ctx, botPts);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = AREA_FILL_ALPHA;
    ctx.fill();
    stroke(color);
  };

  // A smooth trace, optionally closed down to the baseline as an area.
  const drawSmooth = (values: Float32Array, toY: (v: number) => number, baseY: number, area: boolean, color: string) => {
    const n = values.length;
    if (n < 2) return;
    const pts: Pt[] = Array.from({ length: n }, (_, k) => ({ x: (k / (n - 1)) * W, y: toY(values[k]) }));
    if (area) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      smoothThrough(ctx, pts);
      ctx.lineTo(W, baseY);
      ctx.lineTo(0, baseY);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = AREA_FILL_ALPHA;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    smoothThrough(ctx, pts);
    stroke(color);
  };

  // Pixelated: one block column per point. A spectrum's area anchors bars to
  // the bottom; a waveform's area fills its min-to-max span. A line draws one
  // block per edge.
  const drawColumns = (rt: AnalyserRuntime, color: string) => {
    const colW = columnWidth(rt.pixelSize);
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    const src = springActive ? posA : targetsA;
    const srcB = springActive ? posB : targetsB;
    for (let k = 0; k < src.length; k++) {
      const x = k * colW;
      if (x >= W) break;
      if (rt.source === 'frequency') {
        const yTop = Math.max(0, Math.min(H - colW, quantizeToGrid(H - src[k] * (H * FREQ_AMP), colW)));
        ctx.fillRect(x, yTop, colW, rt.variant === 'area' ? H - yTop : colW);
      } else {
        const yTop = Math.round(cy - src[k] * (H * WAVE_AMP));
        const yBot = Math.round(cy - srcB[k] * (H * WAVE_AMP));
        if (rt.variant === 'area') {
          // An overshooting spring can push the top past the edge.
          const t = Math.max(0, Math.min(H - 1, yTop));
          ctx.fillRect(x, t, colW, Math.max(1, yBot - t));
        } else {
          for (const edge of [yTop, yBot]) ctx.fillRect(x, Math.max(0, Math.min(H - colW, quantizeToGrid(edge - colW / 2, colW))), colW, colW);
        }
      }
    }
  };

  let prevNow: number | null = null;
  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const rt = get();
    syncSize(rt.width, rt.height);
    const dt = prevNow == null ? 0 : Math.min((now - prevNow) / 1000, MAX_DT);
    prevNow = now;

    const color = getComputedStyle(canvas).color || 'rgb(255,255,255)';
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = rt.mode === 'smooth';
    drawBaseline(color, rt.source);

    const an = rt.analyser;
    if (!an) return; // No node yet: the baseline only.

    const frequency = rt.source === 'frequency';
    const needed = frequency ? an.frequencyBinCount : an.fftSize;
    if (bytes.length !== needed) bytes = new Uint8Array(needed);
    if (frequency) an.getByteFrequencyData(bytes);
    else an.getByteTimeDomainData(bytes);

    const pixelated = rt.mode === 'pixelated';
    const n = pixelated ? Math.max(2, Math.ceil(W / columnWidth(rt.pixelSize))) : SMOOTH_POINTS;
    syncPoints(n);
    // Recomputed per frame: the sample rate follows the app's audio context.
    const win = frequency && rt.rangeHz ? hzWindowToBins(rt.rangeHz, an.context.sampleRate / 2, bytes.length) : null;
    const twoSeries = !frequency && (pixelated || rt.variant === 'area');
    if (frequency) fillFrequencyTargets(bytes, targetsA, rt.scale, win?.loBin ?? 1, win?.hiBin ?? bytes.length);
    else if (twoSeries) fillWaveformMinMax(bytes, n, targetsB, targetsA);
    else resampleWaveform(bytes, targetsA);

    // The spring smooths the drawing; the node's own smoothing smooths the data.
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

    if (pixelated) {
      drawColumns(rt, color);
    } else {
      const values = springActive ? posA : targetsA;
      if (frequency) drawSmooth(values, (v) => H - v * (H * FREQ_AMP), baselineY('frequency'), rt.variant === 'area', color);
      else if (rt.variant === 'area') drawBand(values, springActive ? posB : targetsB, color);
      else drawSmooth(values, (v) => cy - v * (H * WAVE_AMP), cy, false, color);
    }

    // The marker: a hairline at a live frequency, between blocks when pixelated.
    if (frequency && rt.marker) {
      const hz = rt.marker();
      if (hz != null && Number.isFinite(hz)) {
        const t = markerT((hz / (an.context.sampleRate / 2)) * bytes.length, rt.scale, win?.loBin ?? 1, win?.hiBin ?? bytes.length);
        if (t !== null) {
          let x = t * W;
          if (pixelated) x = quantizeToGrid(x, columnWidth(rt.pixelSize));
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.4;
          ctx.lineWidth = dpr;
          ctx.beginPath();
          ctx.moveTo(Math.round(x) + 0.5, 0);
          ctx.lineTo(Math.round(x) + 0.5, H);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  };
  raf = requestAnimationFrame(frame);

  return { destroy() { cancelAnimationFrame(raf); } };
}
