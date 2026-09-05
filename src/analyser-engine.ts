// Framework-agnostic rendering engine for the real-time analyser visualizer.
// React / Svelte / Solid / Vue each wrap this with a thin component that owns the
// markup and reactive state; the engine owns the canvas and the rAF loop, reading
// the current props through a `get()` callback so it never needs to be torn down
// when a prop changes. Display-only: it reads the AnalyserNode every frame and
// never mutates it (fftSize, smoothing, and the dB window stay the host's).

import {
  byteTimeToUnit,
  fillFrequencyTargets,
  fillWaveformMinMax,
  hzWindowToBins,
  markerT,
  resampleWaveform,
  risingZeroCross,
  peakLevel,
  advanceSweep,
  stepSprings,
  normalizeSpring,
  columnWidth as coreColumnWidth,
  quantizeToGrid,
  type AnalyserScale,
  type AnalyserSpring,
} from './analyser-core';

export type { AnalyserScale, AnalyserSpring } from './analyser-core';

export type AnalyserSource = 'frequency' | 'waveform' | 'ekg' | 'transfer' | 'overlay';
export type AnalyserVariant = 'line' | 'area';
export type AnalyserMode = 'smooth' | 'pixelated';
/** Transfer view: connect the samples ('segments') or plot isolated dots ('scatter'). */
export type AnalyserTransferDraw = 'segments' | 'scatter';

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
  /**
   * Spectrum only: confine the display to this frequency window in Hz — a
   * zoomed-in analyser (a low-end monitor, a presence band). Null / absent is
   * the full range. Nyquist comes from the analyser's own context.
   */
  rangeHz?: readonly [number, number] | null;
  /**
   * Spectrum only: a live vertical reference in Hz, read every frame — the
   * host points it at whatever its own parameter says (a filter corner, a
   * tracking focus). Null (or out of the window) draws nothing.
   */
  marker?: (() => number | null) | null;
  /**
   * Transfer / overlay only: the second signal tap (the processed output the
   * first signal is compared against). Same read-only contract as `analyser`.
   */
  analyserB?: AnalyserNode | null;
  /** Second trace / Y-axis color for transfer and overlay. Defaults to `waveColor`. */
  waveColorB?: string;
  /** Transfer only: 'segments' (default) connects samples, 'scatter' plots dots. */
  transferDraw?: AnalyserTransferDraw;
  /**
   * Overlay only: how many time-domain samples the window shows after the
   * zero-cross sync point. Null / absent shows the whole buffer.
   */
  windowSize?: number | null;
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
// EKG scroll: seconds of signal history across the full width.
const EKG_SCROLL_SECONDS = 2.5;
// EKG trace amplitude as a fraction of height (rectified level, drawn upward).
const EKG_AMP = 0.85;
// Transfer (XY) plot amplitude as a fraction of the plot square's half-extent.
const TRANSFER_AMP = 0.85;
// Scatter dots accumulate visually; each one is drawn faint so density reads as tone.
const SCATTER_ALPHA = 0.35;
// Overlay view: opacity of the back (input) trace relative to the front (output).
const OVERLAY_BACK_ALPHA = 0.45;
// Overlay window clamp: never fewer samples than this after the sync point.
const OVERLAY_MIN_WINDOW = 32;

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

  // Resting baseline: the bottom edge for a spectrum, the center for a waveform,
  // and just above the bottom for the EKG (room for the resting pen dot).
  const baselineY = (source: AnalyserSource) =>
    source === 'frequency' ? H - Math.round(dpr) : source === 'ekg' ? H - Math.round(3 * dpr) : cy;

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
          // clamp before measuring: an overshooting spring can push yTop past the
          // canvas edge, and height must shrink with it or the band overdraws
          const t = Math.max(0, Math.min(H - 1, yTop));
          ctx.fillRect(x, t, colW, Math.max(1, yBot - t));
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

  // EKG state: a ring of level history (head = newest column), the previous pen
  // level, and a single render-side spring for the pen.
  let ekgHistory = new Float32Array(0);
  let ekgHead = 0;
  let ekgPrevLevel = 0;
  const ekgPos = new Float32Array(1);
  const ekgVel = new Float32Array(1);
  const ekgTarget = new Float32Array(1);
  let ekgSeeded = false;

  const syncEkg = (n: number) => {
    if (ekgHistory.length === n) return;
    ekgHistory = new Float32Array(n);
    ekgHead = 0;
    ekgSeeded = false; // blank restart on resize, same one-frame snap as syncPoints
  };

  // The EKG frame: sample the pen level (rectified peak of the window), record it
  // into the history ring, then draw the history streaming leftward from a pen
  // dot fixed at the right edge — the newest signal at the pen, the oldest
  // falling off the left. Smooth mode strokes one right-to-left path (sub-column
  // offset from the fractional head keeps the scroll butter-smooth); pixelated
  // mode is the house block language, one block (or bar, for `area`) per column.
  const drawEkg = (rt: AnalyserRuntime, dt: number, base: string, alpha: number) => {
    const pixelated = rt.mode === 'pixelated';
    const colW = columnWidth(pixelated ? rt.pixelSize : 1);
    const n = Math.max(2, Math.floor(W / colW));
    syncEkg(n);

    const raw = peakLevel(bytes);
    const spring = normalizeSpring(rt.spring);
    let level = raw;
    if (spring) {
      if (!ekgSeeded) {
        ekgPos[0] = raw;
        ekgVel[0] = 0;
        ekgSeeded = true;
      }
      ekgTarget[0] = raw;
      stepSprings(ekgPos, ekgVel, ekgTarget, spring.stiffness, spring.damping, dt);
      level = ekgPos[0]; // may overshoot below 0 — the dip below baseline is welcome
    } else {
      ekgSeeded = false;
    }

    ekgHead = advanceSweep(ekgHistory, ekgHead, ekgPrevLevel, level, (dt / EKG_SCROLL_SECONDS) * n);
    ekgPrevLevel = level;

    const baseY = baselineY('ekg');
    const toY = (v: number) => Math.max(0, Math.min(H, baseY - v * (H * EKG_AMP)));
    const headCol = Math.floor(ekgHead);
    // Ring column holding the sample written k columns before the pen.
    const colBehind = (k: number) => (((headCol - k) % n) + n) % n;

    const wave = rt.waveColor || base;
    const fill = rt.fillColor || wave;

    if (pixelated) {
      const penX = (n - 1) * colW;
      const blockY = (v: number) => Math.max(0, Math.min(H - colW, quantizeToGrid(toY(v) - colW / 2, colW)));
      ctx.fillStyle = wave;
      ctx.globalAlpha = alpha;
      for (let k = 1; k < n; k++) {
        const x = penX - k * colW;
        const y = blockY(ekgHistory[colBehind(k)]);
        if (rt.variant === 'area') ctx.fillRect(x, y, colW, Math.max(colW, baseY - y));
        else ctx.fillRect(x, y, colW, colW);
      }
      // The pen: one block pinned to the rightmost column.
      ctx.fillRect(penX, blockY(level), colW, colW);
      ctx.globalAlpha = 1;
      return;
    }

    // Pen anchor, inset so the dot stays fully visible at the right edge.
    const penX = W - Math.round(3 * dpr);
    const frac = ekgHead - headCol;
    const pts: Pt[] = [{ x: penX, y: toY(level) }];
    for (let k = 0; k < n; k++) {
      const x = penX - (k + frac) * colW;
      pts.push({ x, y: toY(ekgHistory[colBehind(k)]) });
      if (x <= 0) break;
    }

    if (rt.variant === 'area') {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[pts.length - 1].x, baseY);
      ctx.lineTo(penX, baseY);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.globalAlpha = AREA_FILL_ALPHA * alpha;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // The pen: a solid dot in the trace color, riding the live level.
    ctx.fillStyle = wave;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(penX, toY(level), 2.6 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  // Second-signal buffer for the transfer and overlay views, same reallocation
  // discipline as `bytes`.
  let bytesB = new Uint8Array(0);

  const readB = (anB: AnalyserNode) => {
    if (bytesB.length !== anB.fftSize) bytesB = new Uint8Array(anB.fftSize);
    anB.getByteTimeDomainData(bytesB);
  };

  // Transfer view: an XY oscilloscope — every sample lands at (input, output),
  // input on the horizontal axis, output on the vertical. A memoryless shaper
  // draws its transfer curve; latency or hysteresis opens the curve into loops.
  // The plot lives in a centered square so both axes share one scale. Without a
  // second analyser the input is plotted against itself: the identity diagonal,
  // a truthful "no processing" reading.
  const drawTransfer = (rt: AnalyserRuntime, base: string, alpha: number) => {
    const anB = rt.analyserB;
    if (anB) readB(anB);
    const yBytes = anB ? bytesB : bytes;
    const m = Math.min(bytes.length, yBytes.length);
    if (m < 2) return;

    const half = Math.min(W, H) / 2;
    const cx = W / 2;
    const toX = (v: number) => cx + v * half * TRANSFER_AMP;
    const toY = (v: number) => cy - v * half * TRANSFER_AMP;

    // Crosshair: the zero axes of the plot square (the baseline drew the horizontal).
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.15 * alpha;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    ctx.moveTo(Math.round(cx) + 0.5, Math.round(cy - half));
    ctx.lineTo(Math.round(cx) + 0.5, Math.round(cy + half));
    ctx.stroke();
    ctx.globalAlpha = 1;

    const wave = rt.waveColor || base;
    const pixelated = rt.mode === 'pixelated';
    const scatter = rt.transferDraw === 'scatter';

    if (scatter || pixelated) {
      // Isolated points — the manual's answer to noisy signals, where connecting
      // segments would scribble. Pixelated mode always scatters, in the house
      // block language; smooth mode uses faint round dots whose overlap builds density.
      ctx.fillStyle = wave;
      ctx.globalAlpha = (pixelated ? 0.8 : SCATTER_ALPHA) * alpha;
      const colW = columnWidth(rt.pixelSize);
      for (let i = 0; i < m; i++) {
        const x = toX(byteTimeToUnit(bytes[i]));
        const y = toY(byteTimeToUnit(yBytes[i]));
        if (pixelated) {
          ctx.fillRect(quantizeToGrid(x - colW / 2, colW), quantizeToGrid(y - colW / 2, colW), colW, colW);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 1.4 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      return;
    }

    ctx.beginPath();
    ctx.moveTo(toX(byteTimeToUnit(bytes[0])), toY(byteTimeToUnit(yBytes[0])));
    for (let i = 1; i < m; i++) {
      ctx.lineTo(toX(byteTimeToUnit(bytes[i])), toY(byteTimeToUnit(yBytes[i])));
    }
    ctx.globalAlpha = 0.9 * alpha;
    ctx.strokeStyle = wave;
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  // One overlay trace as pixelated block steps: a single block per column riding
  // the trace's level (the line-variant column language, one series).
  const drawBlockTrace = (values: Float32Array, pixelSize: number, color: string, alpha: number) => {
    const colW = columnWidth(pixelSize);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    for (let k = 0; k < values.length; k++) {
      const x = k * colW;
      if (x >= W) break;
      const y = Math.max(0, Math.min(H - colW, quantizeToGrid(cy - values[k] * (H * WAVE_AMP) - colW / 2, colW)));
      ctx.fillRect(x, y, colW, colW);
    }
    ctx.globalAlpha = 1;
  };

  // Overlay view: both signals as waveforms on one axis — the input behind at
  // reduced opacity, the output in front. The window starts at a rising zero
  // crossing of the front signal so a periodic test tone holds still, and
  // `windowSize` trims how many samples it spans (a horizontal zoom).
  const drawOverlay = (rt: AnalyserRuntime, dt: number, base: string, alpha: number) => {
    const anB = rt.analyserB;
    if (anB) readB(anB);
    const syncSrc = anB ? bytesB : bytes;

    const winLen = Math.max(
      OVERLAY_MIN_WINDOW,
      Math.min(bytes.length, Math.round(rt.windowSize ?? bytes.length))
    );
    let off = risingZeroCross(syncSrc);
    if (off + winLen > syncSrc.length) off = Math.max(0, syncSrc.length - winLen);

    const pixelated = rt.mode === 'pixelated';
    const n = pixelated ? Math.max(2, Math.ceil(W / columnWidth(rt.pixelSize))) : SMOOTH_POINTS;
    syncPoints(n);
    const sliceAt = (src: Uint8Array) => {
      const start = Math.min(off, Math.max(0, src.length - winLen));
      return src.subarray(start, Math.min(src.length, start + winLen));
    };
    resampleWaveform(sliceAt(bytes), targetsA);
    if (anB) resampleWaveform(sliceAt(bytesB), targetsB);
    else targetsB.set(targetsA);

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
      stepSprings(posB, velB, targetsB, spring.stiffness, spring.damping, dt);
    } else {
      springSeeded = false;
    }

    const wave = rt.waveColor || base;
    const front = rt.waveColorB || wave;
    const backA = springActive ? posA : targetsA;
    const frontB = springActive ? posB : targetsB;
    const toY = (v: number) => cy - v * (H * WAVE_AMP);
    if (pixelated) {
      drawBlockTrace(backA, rt.pixelSize, wave, OVERLAY_BACK_ALPHA * alpha);
      if (anB) drawBlockTrace(frontB, rt.pixelSize, front, alpha);
    } else {
      drawSmooth(backA, toY, cy, false, wave, wave, (anB ? OVERLAY_BACK_ALPHA : 1) * alpha);
      if (anB) drawSmooth(frontB, toY, cy, false, front, front, alpha);
    }
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

    // The EKG is its own pipeline: a sweeping level history, not per-point targets.
    if (rt.source === 'ekg') {
      drawEkg(rt, dt, base, alpha);
      return;
    }

    // Transfer and overlay are their own pipelines: two live signals, not the
    // single-trace reduce/spring path below.
    if (rt.source === 'transfer') {
      drawTransfer(rt, base, alpha);
      return;
    }
    if (rt.source === 'overlay') {
      drawOverlay(rt, dt, base, alpha);
      return;
    }

    // --- reduce to display targets ---
    const pixelated = rt.mode === 'pixelated';
    const n = pixelated ? Math.max(2, Math.ceil(W / columnWidth(rt.pixelSize))) : SMOOTH_POINTS;
    syncPoints(n);
    // The spectrum's optional frequency window, in bins. Recomputed per frame:
    // it depends on the analyser's sample rate, which can change with the host's
    // audio context, and the mapping is a handful of arithmetic ops.
    const win =
      rt.source === 'frequency' && rt.rangeHz
        ? hzWindowToBins(rt.rangeHz, an.context.sampleRate / 2, bytes.length)
        : null;
    // The waveform's area (band) needs both envelopes; its smooth line is a single
    // resampled trace. `b` carries the min series whenever both are in play.
    const twoSeries = rt.source === 'waveform' && (pixelated || rt.variant === 'area');
    if (rt.source === 'frequency') {
      fillFrequencyTargets(bytes, targetsA, rt.scale, win?.loBin ?? 1, win?.hiBin ?? bytes.length);
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

    // --- marker: a live vertical reference over the spectrum ---
    if (rt.source === 'frequency' && rt.marker) {
      const hz = rt.marker();
      if (hz != null && Number.isFinite(hz)) {
        const bins = bytes.length;
        const bin = (hz / (an.context.sampleRate / 2)) * bins;
        const t = markerT(bin, rt.scale, win?.loBin ?? 1, win?.hiBin ?? bins);
        if (t !== null) {
          // The curve preview's marker language: a hairline in the tertiary
          // text weight, snapped to the block grid in pixelated mode so it
          // lands between columns rather than through one.
          let x = t * W;
          if (pixelated) x = quantizeToGrid(x, columnWidth(rt.pixelSize));
          ctx.strokeStyle = wave;
          ctx.globalAlpha = 0.4 * alpha;
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

  return {
    destroy() {
      cancelAnimationFrame(raf);
    },
  };
}
