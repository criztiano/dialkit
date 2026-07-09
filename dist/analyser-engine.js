// src/analyser-core.ts
function byteFreqToUnit(v) {
  return v / 255;
}
function byteTimeToUnit(v) {
  return (v - 128) / 128;
}
function binRange(point, points, bins, scale) {
  if (bins <= 2) return { start: Math.max(0, bins - 1), end: Math.max(1, bins) };
  const lo = 1;
  const at = (t) => scale === "log" ? Math.pow(bins, t) * lo : lo + (bins - lo) * t;
  let start = Math.floor(at(point / points));
  start = Math.max(lo, Math.min(bins - 1, start));
  const end = Math.max(start + 1, Math.min(bins, Math.floor(at((point + 1) / points))));
  return { start, end };
}
function fillFrequencyTargets(data, out, scale) {
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
function fillWaveformMinMax(data, cols, min, max) {
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
function resampleWaveform(data, out) {
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
var SPRING_MAX_STEP = 1 / 240;
function stepSprings(pos, vel, targets, stiffness, damping, dt) {
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
var SPRING_DEFAULT_STIFFNESS = 120;
var SPRING_DEFAULT_DAMPING = 14;
function normalizeSpring(spring) {
  if (!spring) return null;
  const raw = spring === true ? {} : spring;
  return {
    stiffness: Math.min(1e3, Math.max(1, raw.stiffness ?? SPRING_DEFAULT_STIFFNESS)),
    damping: Math.min(100, Math.max(1, raw.damping ?? SPRING_DEFAULT_DAMPING))
  };
}
function columnWidth(dpr, pixelSize) {
  return Math.max(1, Math.round(dpr) * Math.max(1, Math.round(pixelSize)));
}
function quantizeToGrid(v, colW) {
  return Math.round(v / colW) * colW;
}

// src/analyser-engine.ts
var SMOOTH_POINTS = 64;
var AREA_FILL_ALPHA = 0.2;
var MUTED_ALPHA = 0.35;
var FREQ_AMP = 0.92;
var WAVE_AMP = 0.42;
var MAX_DT = 0.05;
function smoothThrough(ctx, pts) {
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
function createAnalyserEngine(canvas, get) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {
  } };
  const readDpr = () => Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
  let dpr = readDpr();
  let W = 0;
  let H = 0;
  let cy = 0;
  const syncSize = (width, height) => {
    dpr = readDpr();
    const nw = Math.round(width * dpr);
    const nh = Math.round(height * dpr);
    if (nw === W && nh === H) return;
    W = canvas.width = nw;
    H = canvas.height = nh;
    cy = H / 2;
  };
  const columnWidth2 = (pixelSize) => columnWidth(dpr, pixelSize);
  let bytes = new Uint8Array(0);
  let targetsA = new Float32Array(0);
  let targetsB = new Float32Array(0);
  let posA = new Float32Array(0);
  let posB = new Float32Array(0);
  let velA = new Float32Array(0);
  let velB = new Float32Array(0);
  let springSeeded = false;
  const syncPoints = (n) => {
    if (targetsA.length === n) return;
    targetsA = new Float32Array(n);
    targetsB = new Float32Array(n);
    posA = new Float32Array(n);
    posB = new Float32Array(n);
    velA = new Float32Array(n);
    velB = new Float32Array(n);
    springSeeded = false;
  };
  const drawGrid = (base, subs) => {
    const n = Math.max(1, Math.round(subs));
    ctx.strokeStyle = base;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
      const x = Math.round(i / n * W) + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const baselineY = (source) => source === "frequency" ? H - Math.round(dpr) : cy;
  const drawBaseline = (base, source, alpha) => {
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
  const drawBand = (top, bottom, wave, fill, alpha) => {
    const n = top.length;
    if (n < 2) return;
    const px = (k) => k / (n - 1) * W;
    const toY = (v) => cy - v * (H * WAVE_AMP);
    const topPts = new Array(n);
    for (let k = 0; k < n; k++) topPts[k] = { x: px(k), y: toY(top[k]) };
    const botPts = new Array(n);
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
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const drawSmooth = (values, toY, baseY, area, wave, fill, alpha) => {
    const n = values.length;
    if (n < 2) return;
    const pts = new Array(n);
    for (let k = 0; k < n; k++) pts[k] = { x: k / (n - 1) * W, y: toY(values[k]) };
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
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const drawColumns = (source, variant, pixelSize, wave, alpha) => {
    const colW = columnWidth2(pixelSize);
    ctx.fillStyle = wave;
    ctx.globalAlpha = alpha;
    const n = targetsA.length;
    const src = springActive ? posA : targetsA;
    const srcB = springActive ? posB : targetsB;
    for (let k = 0; k < n; k++) {
      const x = k * colW;
      if (x >= W) break;
      if (source === "frequency") {
        const yTop = Math.max(0, Math.min(H - colW, quantizeToGrid(H - src[k] * (H * FREQ_AMP), colW)));
        if (variant === "area") ctx.fillRect(x, yTop, colW, H - yTop);
        else ctx.fillRect(x, yTop, colW, colW);
      } else {
        const yTop = Math.round(cy - src[k] * (H * WAVE_AMP));
        const yBot = Math.round(cy - srcB[k] * (H * WAVE_AMP));
        if (variant === "area") {
          const t = Math.max(0, Math.min(H - 1, yTop));
          ctx.fillRect(x, t, colW, Math.max(1, yBot - t));
        } else {
          const block = (yEdge) => {
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
  let prevNow = null;
  let raf = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const rt = get();
    syncSize(rt.width, rt.height);
    const dt = prevNow == null ? 0 : Math.min((now - prevNow) / 1e3, MAX_DT);
    prevNow = now;
    const base = getComputedStyle(canvas).color || "rgb(255,255,255)";
    const alpha = rt.muted ? MUTED_ALPHA : 1;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = rt.mode === "smooth";
    if (rt.grid) drawGrid(base, rt.gridSubdivisions);
    drawBaseline(base, rt.source, alpha);
    const an = rt.analyser;
    if (!an) return;
    const needed = rt.source === "frequency" ? an.frequencyBinCount : an.fftSize;
    if (bytes.length !== needed) bytes = new Uint8Array(needed);
    if (rt.source === "frequency") an.getByteFrequencyData(bytes);
    else an.getByteTimeDomainData(bytes);
    const pixelated = rt.mode === "pixelated";
    const n = pixelated ? Math.max(2, Math.ceil(W / columnWidth2(rt.pixelSize))) : SMOOTH_POINTS;
    syncPoints(n);
    const twoSeries = rt.source === "waveform" && (pixelated || rt.variant === "area");
    if (rt.source === "frequency") {
      fillFrequencyTargets(bytes, targetsA, rt.scale);
    } else if (twoSeries) {
      fillWaveformMinMax(bytes, n, targetsB, targetsA);
    } else {
      resampleWaveform(bytes, targetsA);
    }
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
    const wave = rt.waveColor || base;
    const fill = rt.fillColor || wave;
    if (pixelated) {
      drawColumns(rt.source, rt.variant, rt.pixelSize, wave, alpha);
    } else {
      const values = springActive ? posA : targetsA;
      if (rt.source === "frequency") {
        drawSmooth(values, (v) => H - v * (H * FREQ_AMP), baselineY("frequency"), rt.variant === "area", wave, fill, alpha);
      } else if (rt.variant === "area") {
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
    }
  };
}
export {
  createAnalyserEngine
};
//# sourceMappingURL=analyser-engine.js.map