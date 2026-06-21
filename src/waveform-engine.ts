// Framework-agnostic rendering + interaction engine for the waveform visualizer.
// React / Svelte / Solid / Vue each wrap this with a thin component that owns the
// markup and reactive state; the engine owns the canvas, the rAF loop, and the
// pointer interaction, reading the current props through a `get()` callback so it
// never needs to be torn down when a prop changes.

export type WaveformMode = 'smooth' | 'pixelated';
/** A loop region over the sample, as normalized 0..1 positions. */
export type WaveformLoop = { start: number; end: number };

/** Everything the engine reads each frame. Wrappers supply a getter for the live values. */
export interface WaveformRuntime {
  buffer: AudioBuffer | null;
  progress: number;
  getProgress?: () => number;
  mode: WaveformMode;
  border: boolean;
  bands: boolean;
  pixelSize: number;
  grid: boolean;
  gridSubdivisions: number;
  waveColor?: string;
  playheadColor?: string;
  autoZoomOnLoop: boolean;
  loop: WaveformLoop | null;
  /** Manual zoom level (the wrapper owns the +/− buttons). */
  zoom: number;
  width: number;
  height: number;
  onSeek?: (progress: number) => void;
  onLoopChange?: (loop: WaveformLoop | null) => void;
}

export interface WaveformEngine {
  destroy(): void;
}

// Each "+" doubles magnification; window = 1 / zoom of the sample's duration.
export const WAVEFORM_MAX_ZOOM = 8;

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
// Pointer travel (CSS px) past which a press becomes a loop-drag rather than a click.
const DRAG_THRESHOLD = 3;
// How close (CSS px) a press must be to a loop edge to grab it for resizing.
const EDGE_HIT = 6;

type Peaks = { min: Float32Array; max: Float32Array };
type Pt = { x: number; y: number };
// A drag in progress: 'create' draws a fresh selection from `anchor`; 'resize'
// drags one loop edge while `anchor` holds the opposite (fixed) edge. In both,
// the region is [min(anchor,cur), max(anchor,cur)].
type Drag = { mode: 'create' | 'resize'; anchor: number; curProg: number; startX: number; moved: boolean };

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

/**
 * Mount the renderer on `canvas`, reading the current props from `get()` every
 * frame. Returns a handle whose `destroy()` stops the loop and detaches listeners.
 */
export function createWaveformEngine(canvas: HTMLCanvasElement, get: () => WaveformRuntime): WaveformEngine {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {} };

  const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);

  // Size-dependent state, (re)allocated by syncSize when width/height change.
  let W = 0;
  let H = 0;
  let cy = 0;
  let amp = 0;
  let pk: Peaks = { min: new Float32Array(1), max: new Float32Array(1) };

  const syncSize = (width: number, height: number) => {
    const nw = Math.round(width * dpr);
    const nh = Math.round(height * dpr);
    if (nw === W && nh === H) return;
    W = canvas.width = nw;
    H = canvas.height = nh;
    cy = H / 2;
    amp = H * 0.42;
    pk = { min: new Float32Array(W), max: new Float32Array(W) };
  };

  // Mono sample data per band (or one entry, bands off). Peaks are recomputed per
  // frame from the visible window so zoom reveals real detail, not stretched pixels.
  let monos: Float32Array[] = [];
  let monoToken = 0;
  let lastBuffer: AudioBuffer | null | undefined; // undefined: not yet synced
  let lastBands = false;

  const syncMonos = (buffer: AudioBuffer | null, bands: boolean) => {
    if (buffer === lastBuffer && bands === lastBands) return;
    lastBuffer = buffer;
    lastBands = bands;
    const token = ++monoToken;
    monos = [];
    if (!buffer) return;
    (async () => {
      const bufs = bands ? await Promise.all(BANDS.map((b) => filterBuffer(buffer, b))) : [buffer];
      if (token !== monoToken) return;
      monos = bufs.map((b) => mixToMono(b));
    })();
  };

  // One CSS pixel per column (two device pixels on retina), times the pixelSize
  // multiplier — chunkier blocks at 2/4/6.
  const columnWidth = (pixelSize: number) => Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSize)));

  // The window currently shown (updated each frame) — used to map pointer x → progress.
  const windowState = { start: 0, win: 1 };
  // The in-progress loop drag, if any.
  let drag: Drag | null = null;

  // Chunky, full-opacity min/max columns.
  const drawColumns = (p: Peaks, color: string, pixelSize: number) => {
    const colW = columnWidth(pixelSize);
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

  // Faint reference grid: `subs` vertical (time) lines.
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

  // Translucent loop / selection band between two 0..1 positions, mapped into the
  // current window (`start`,`win`). Tinted with the playhead color at low opacity.
  const drawRegion = (a: number, b: number, start: number, win: number, color: string) => {
    const x0 = ((a - start) / win) * W;
    const x1 = ((b - start) / win) * W;
    const cx0 = Math.max(0, x0);
    const cx1 = Math.min(W, x1);
    if (cx1 <= cx0) return;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.14;
    ctx.fillRect(cx0, 0, cx1 - cx0, H);
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = dpr;
    ctx.strokeStyle = color;
    ctx.beginPath();
    if (x0 >= 0 && x0 <= W) {
      const xe = Math.round(x0) + 0.5;
      ctx.moveTo(xe, 0);
      ctx.lineTo(xe, H);
    }
    if (x1 >= 0 && x1 <= W) {
      const xe = Math.round(x1) + 0.5;
      ctx.moveTo(xe, 0);
      ctx.lineTo(xe, H);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  let raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const rt = get();
    syncSize(rt.width, rt.height);
    syncMonos(rt.buffer, rt.bands);

    const base = getComputedStyle(canvas).color || 'rgb(255,255,255)';
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = rt.mode === 'smooth';

    if (rt.grid) drawGrid(base, rt.gridSubdivisions);

    // center baseline
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(cy) + 0.5);
    ctx.lineTo(W, Math.round(cy) + 0.5);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const wave = rt.waveColor || base;
    const ph = rt.playheadColor || base;

    const prog = Math.max(0, Math.min(1, (rt.getProgress ? rt.getProgress() : rt.progress) || 0));
    // The visible window. With auto-zoom on and a loop set, frame the loop
    // (centered, capped at MAX_ZOOM); otherwise zoom by `zoom`, centered on the
    // playhead and clamped to the sample edges so it's always on screen.
    let win: number;
    let start: number;
    const activeLoop = rt.autoZoomOnLoop ? rt.loop : null;
    if (activeLoop) {
      const span = Math.max(0.0001, activeLoop.end - activeLoop.start);
      win = Math.min(1, Math.max(1 / WAVEFORM_MAX_ZOOM, span * 1.2));
      start = (activeLoop.start + activeLoop.end) / 2 - win / 2;
    } else {
      win = 1 / Math.max(1, rt.zoom);
      start = prog - win / 2;
    }
    if (start < 0) start = 0;
    else if (start > 1 - win) start = 1 - win;
    const end = start + win;
    windowState.start = start;
    windowState.win = win;

    const count = monos.length;
    if (count) {
      // Bands drawn low → high so the spikier high band reads on top.
      for (let i = 0; i < count; i++) {
        const mono = monos[i];
        const s0 = Math.max(0, Math.floor(start * mono.length));
        const s1 = Math.min(mono.length, Math.ceil(end * mono.length));
        const slice = s1 > s0 ? mono.subarray(s0, s1) : mono;
        fillPeaks(slice, W, pk.min, pk.max);
        const color = count === 3 ? BAND_COLORS[i] : wave;
        if (rt.mode === 'pixelated') drawColumns(pk, color, rt.pixelSize);
        else drawSimplified(envelope(pk, W, SIMPLE_POINTS), color, rt.border);
      }
    }

    // Loop / live drag selection on top of the waveform, derived from the playhead color.
    if (drag && drag.moved) {
      drawRegion(Math.min(drag.anchor, drag.curProg), Math.max(drag.anchor, drag.curProg), start, win, ph);
    } else if (rt.loop) {
      drawRegion(rt.loop.start, rt.loop.end, start, win, ph);
    }

    if (count) {
      // playhead — mapped into the (possibly zoomed) window so it stays visible
      const playX = ((prog - start) / win) * W;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ph;
      ctx.lineWidth = 1.5 * dpr;
      const cxp = Math.round(Math.max(0, Math.min(W, playX))) + 0.5;
      ctx.beginPath();
      ctx.moveTo(cxp, 0);
      ctx.lineTo(cxp, H);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  // --- pointer interaction ---

  // Map a clientX to a 0..1 sample position using the window currently displayed.
  const xToProgress = (clientX: number) => {
    const rect = canvas.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const { start, win } = windowState;
    return Math.min(1, Math.max(0, start + fx * win));
  };

  // Which loop edge (if any) a clientX is grabbing — only when a resizable loop is on screen.
  const edgeAt = (clientX: number): 'start' | 'end' | null => {
    const rt = get();
    const loop = rt.loop;
    if (!loop || !rt.onLoopChange) return null;
    const rect = canvas.getBoundingClientRect();
    const { start, win } = windowState;
    const xOf = (t: number) => ((t - start) / win) * rect.width;
    const px = clientX - rect.left;
    const sx = xOf(loop.start);
    const ex = xOf(loop.end);
    const dS = Math.abs(px - sx);
    const dE = Math.abs(px - ex);
    if (dS <= EDGE_HIT && dS <= dE && sx >= 0 && sx <= rect.width) return 'start';
    if (dE <= EDGE_HIT && ex >= 0 && ex <= rect.width) return 'end';
    return null;
  };

  const setCursor = (c: string) => {
    canvas.style.cursor = c;
  };

  const onPointerDown = (e: PointerEvent) => {
    const rt = get();
    if (!rt.onSeek && !rt.onLoopChange) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // No active pointer (e.g. synthetic event) — capture is a nicety, not required.
    }
    const p = xToProgress(e.clientX);
    const edge = edgeAt(e.clientX);
    if (edge && rt.loop) {
      // Grab the opposite edge as the fixed anchor; this edge follows the pointer.
      const anchor = edge === 'start' ? rt.loop.end : rt.loop.start;
      drag = { mode: 'resize', anchor, curProg: p, startX: e.clientX, moved: false };
      setCursor('ew-resize');
    } else {
      drag = { mode: 'create', anchor: p, curProg: p, startX: e.clientX, moved: false };
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (drag) {
      drag.curProg = xToProgress(e.clientX);
      if (Math.abs(e.clientX - drag.startX) > DRAG_THRESHOLD) drag.moved = true;
      return;
    }
    const rt = get();
    if (!rt.onSeek && !rt.onLoopChange) return;
    // Hover affordance: a resize cursor when over a loop edge.
    setCursor(edgeAt(e.clientX) ? 'ew-resize' : 'crosshair');
  };

  const onPointerUp = (e: PointerEvent) => {
    const d = drag;
    drag = null;
    if (!d) return;
    try {
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may not be held (e.g. synthetic event) — ignore.
    }
    setCursor('crosshair');

    const rt = get();
    const a = Math.min(d.anchor, d.curProg);
    const b = Math.max(d.anchor, d.curProg);
    if (d.mode === 'resize') {
      // Commit the resized loop; a press without a drag leaves it untouched.
      if (d.moved) rt.onLoopChange?.({ start: a, end: b });
    } else if (d.moved) {
      // Drag → define a loop (or scrub-seek to the release point if loops aren't wired).
      if (rt.onLoopChange) rt.onLoopChange({ start: a, end: b });
      else rt.onSeek?.(d.curProg);
    } else {
      // Click → seek, and clear any active loop (recreate it by dragging again).
      rt.onSeek?.(d.anchor);
      if (rt.loop && rt.onLoopChange) rt.onLoopChange(null);
    }
  };

  const onPointerCancel = () => {
    drag = null;
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);

  // Interactive affordances (base cursor + no touch-scroll) when seek/loop are wired.
  const rt0 = get();
  if (rt0.onSeek || rt0.onLoopChange) {
    canvas.style.cursor = 'crosshair';
    canvas.style.touchAction = 'none';
  }

  frame();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      monoToken++; // invalidate any in-flight band filtering
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
    },
  };
}
