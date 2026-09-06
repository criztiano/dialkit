// src/store/ModulationStore.ts
import { TweakStore } from "tweakers/store";

// src/store/persist.ts
var STORAGE_VERSION = "v1";
function resolvePersistTarget(kind, id, persist) {
  if (!persist) return null;
  const config = persist === true ? {} : persist;
  const base = config.key ?? id;
  if (!base) return null;
  return {
    key: `tweakers:${STORAGE_VERSION}:${kind}:${base}`,
    storage: config.storage ?? "localStorage"
  };
}
function getStorage(name) {
  try {
    if (typeof window === "undefined") return null;
    return name === "sessionStorage" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}
function loadPersisted(target) {
  if (!target) return null;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return null;
    const raw = storage.getItem(target.key);
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function savePersisted(target, value) {
  if (!target) return;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return;
    storage.setItem(target.key, JSON.stringify(value));
  } catch {
  }
}
function clearPersisted(target) {
  if (!target) return;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return;
    storage.removeItem(target.key);
  } catch {
  }
}

// src/curve-composer-core.ts
var CURVE_CYCLE = ["linear", "easeIn", "easeOut", "easeInOut", "spring"];
var easingPresets = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1]
};
var lerp = (a, b, t) => a + (b - a) * t;
var clamp01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
var clampBipolar = (v) => v < -1 ? -1 : v > 1 ? 1 : v;
var SKEW_MAX = 0.45;
var BACK_MAX = 0.8;
var easingExtremes = {
  linear: [0, 0, 1, 1],
  easeIn: [0.7, 0, 0.84, 0],
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.87, 0, 0.13, 1]
};
var lerp4 = (a, b, t) => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
  lerp(a[3], b[3], t)
];
function deriveEase(type, curvature, steepness = 0, overshoot = 0, anticipate = 0) {
  const key = type === "spring" ? "linear" : type;
  const base = easingPresets[key];
  const s = clampBipolar(steepness);
  const pts = s >= 0 ? lerp4(base, easingExtremes[key], s) : lerp4(easingPresets.linear, base, s + 1);
  let [x1, y1, x2, y2] = pts;
  const shift = clampBipolar(curvature) * SKEW_MAX;
  x1 = clamp01(x1 + shift);
  x2 = clamp01(x2 + shift);
  y2 += clamp01(overshoot) * BACK_MAX;
  y1 -= clamp01(anticipate) * BACK_MAX;
  return [x1, y1, x2, y2];
}
function bezierAxis(p1, p2, s) {
  const u = 1 - s;
  return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s;
}
function bezierAxisDeriv(p1, p2, s) {
  const u = 1 - s;
  return 3 * u * u * p1 + 6 * u * s * (p2 - p1) + 3 * s * s * (1 - p2);
}
function bezierY(ease, x) {
  const tx = clamp01(x);
  let s = tx;
  for (let i = 0; i < 6; i++) {
    const xs = bezierAxis(ease[0], ease[2], s) - tx;
    if (Math.abs(xs) < 1e-5) break;
    const d = bezierAxisDeriv(ease[0], ease[2], s);
    if (Math.abs(d) < 1e-6) break;
    s = clamp01(s - xs / d);
  }
  return bezierAxis(ease[1], ease[3], s);
}
var SPRING_SAMPLES = 72;
function integrateSpringTrace(targets, stiffness, damping, mass, initial, collect = true) {
  const points = collect ? [initial.position] : [];
  const steps = Math.max(1, targets.length - 1);
  const dt = 1 / steps;
  let { position, velocity } = initial;
  for (let i = 1; i <= steps; i++) {
    const target = targets[i] ?? targets[targets.length - 1] ?? 0;
    const acceleration = (-stiffness * (position - target) - damping * velocity) / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
    if (collect) points.push(position);
  }
  return { points, state: { position, velocity } };
}
function springPoints(curvature, steepness = 0) {
  const visualDuration = 1;
  const bounce = clamp01((clampBipolar(curvature) + 1) / 2) * 0.6;
  const mass = 1;
  let stiffness = 2 * Math.PI / visualDuration;
  stiffness = stiffness * stiffness;
  stiffness *= Math.max(0.2, 1 + clampBipolar(steepness) * 0.9);
  const dampingRatio = 1 - bounce;
  const damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
  return integrateSpringTrace(new Array(SPRING_SAMPLES + 1).fill(1), stiffness, damping, mass, {
    position: 0,
    velocity: 0
  }).points;
}
function interp(points, t) {
  const x = clamp01(t) * (points.length - 1);
  const i = Math.floor(x);
  if (i >= points.length - 1) return points[points.length - 1];
  return lerp(points[i], points[i + 1], x - i);
}
function buildSampler(curve) {
  let base;
  if (curve.type === "spring") {
    const pts = springPoints(curve.curvature, curve.steepness);
    base = (t) => interp(pts, t);
  } else {
    const ease = deriveEase(curve.type, curve.curvature, curve.steepness, curve.overshoot, curve.anticipate);
    base = (t) => bezierY(ease, t);
  }
  const { flipX, flipY } = curve;
  if (!flipX && !flipY) return base;
  return (t) => {
    const v = base(flipX ? 1 - t : t);
    return flipY ? 1 - v : v;
  };
}
function totalWeight(segments) {
  let t = 0;
  for (const s of segments) t += Math.max(0, s.weight);
  return t || 1;
}
function timelineSlots(segments, gap = 0) {
  const n = segments.length;
  const g = n > 1 ? clamp01(gap) : 0;
  const total = totalWeight(segments);
  const content = 1 - g;
  const gapW = n > 1 ? g / (n - 1) : 0;
  const slots = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const sw = Math.max(0, segments[i].weight) / total * content;
    slots.push({ kind: "segment", index: i, a: acc, b: acc + sw });
    acc += sw;
    if (i < n - 1) {
      slots.push({ kind: "gap", index: i, a: acc, b: acc + gapW });
      acc += gapW;
    }
  }
  return slots;
}
function segmentSpan(segments, index, gap = 0) {
  if (gap > 0) {
    const slot = timelineSlots(segments, gap).find((s) => s.kind === "segment" && s.index === index);
    if (slot) return [slot.a, slot.b];
  }
  const total = totalWeight(segments);
  let acc = 0;
  for (let i = 0; i < index; i++) acc += segments[i].weight;
  return [acc / total, (acc + segments[index].weight) / total];
}
function segmentIndexAt(xNorm, segments, gap = 0) {
  if (gap > 0) {
    const x2 = clamp01(xNorm);
    const slots = timelineSlots(segments, gap);
    for (const s of slots) if (x2 < s.b) return s.index;
    return segments.length - 1;
  }
  const total = totalWeight(segments);
  const x = clamp01(xNorm) * total;
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].weight;
    if (x <= acc) return i;
  }
  return segments.length - 1;
}
function smootherstep(t) {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
}
function cloneSegments(comp, segments) {
  return { ...comp, segments };
}
function cycleSegmentType(comp, index) {
  const src = comp.segments[index];
  if (!src) return comp;
  const type = CURVE_CYCLE[(CURVE_CYCLE.indexOf(src.type) + 1) % CURVE_CYCLE.length];
  const next = comp.segments.slice();
  next[index] = { ...src, type, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 };
  return cloneSegments(comp, next);
}
function buildSamplers(comp) {
  return {
    segments: comp.segments.map(buildSampler),
    driver: comp.driver ? buildSampler(comp.driver) : null
  };
}
function directionPhase(u, dir) {
  const x = clamp01(u);
  if (dir === "reverse") return 1 - x;
  if (dir === "mirror") return 1 - Math.abs(1 - 2 * x);
  return x;
}
function readComposition(comp, u, s) {
  const inputPhase = directionPhase(u, comp.direction);
  const warpedPhase = s.driver ? clamp01(s.driver(inputPhase)) : inputPhase;
  const gap = comp.gap ?? 0;
  if (gap > 0 && comp.segments.length > 1) {
    const slots = timelineSlots(comp.segments, gap);
    const slot = slots.find((sl) => warpedPhase < sl.b) ?? slots[slots.length - 1];
    const localT2 = slot.b > slot.a ? (warpedPhase - slot.a) / (slot.b - slot.a) : 0;
    if (slot.kind === "segment") {
      const value3 = s.segments[slot.index] ? s.segments[slot.index](localT2) : 0;
      return { inputPhase, warpedPhase, value: value3, segIndex: slot.index, localT: localT2 };
    }
    const n = comp.segments.length;
    const endVal = s.segments[slot.index] ? s.segments[slot.index](1) : 0;
    const startVal = s.segments[(slot.index + 1) % n] ? s.segments[(slot.index + 1) % n](0) : 0;
    const value2 = lerp(endVal, startVal, smootherstep(localT2));
    return { inputPhase, warpedPhase, value: value2, segIndex: slot.index, localT: localT2 };
  }
  const segIndex = segmentIndexAt(warpedPhase, comp.segments);
  const [a, b] = segmentSpan(comp.segments, segIndex);
  const localT = b > a ? (warpedPhase - a) / (b - a) : 0;
  const value = s.segments[segIndex] ? s.segments[segIndex](localT) : 0;
  return { inputPhase, warpedPhase, value, segIndex, localT };
}
var DEFAULT_TRIGGER_STEPS = 5;
var TRIGGER_FLYBACK = 0.5;
function triggersCrossed(prevValue, curValue, steps) {
  const n = Math.max(2, Math.floor(steps));
  const seg = 1 / (n - 1);
  const p = clamp01(prevValue);
  const c = clamp01(curValue);
  const delta = c - p;
  const fired = [];
  if (Math.abs(delta) > TRIGGER_FLYBACK) {
    fired.push(delta < 0 ? n - 1 : 0);
  } else if (delta > 0) {
    for (let k = 1; k <= n - 2; k++) {
      const level = k * seg;
      if (p < level && level <= c) fired.push(k);
    }
  } else if (delta < 0) {
    for (let k = n - 2; k >= 1; k--) {
      const level = k * seg;
      if (c <= level && level < p) fired.push(k);
    }
  }
  return fired;
}

// src/modulation-core.ts
var MOD_SLOTS = 16;
var MOD_PAGE_DIALS = 8;
var isModDial = (c) => !c.chip && (c.scope || c.type === "toggle" && c.big || c.type === "select" || c.type === "slider" || c.type === "xy" || c.type === "range" || c.type === "number" && c.min != null && c.max != null);
var slotOf = (c) => ({
  path: c.path,
  ...c.drawsPreview ? { preview: true } : {},
  ...c.envStage ? { stage: c.envStage } : {},
  ...c.scope ? { scope: true } : {},
  ...c.cycle ? { cycle: true } : {}
});
function modPageLayout(controls, params = {}) {
  const dials = [];
  const toggles = [];
  const values = [];
  for (const c of controls) {
    if (c.when && !c.when(params)) continue;
    if (isModDial(c)) {
      if (dials.length < MOD_PAGE_DIALS) dials.push(slotOf(c));
      continue;
    }
    const col = Math.max(0, dials.length - 1);
    const row = c.type === "toggle" && !toggles[col] ? toggles : values;
    if (!row[col]) row[col] = slotOf(c);
  }
  const pad = (row) => Array.from({ length: row.length }, (_, i) => row[i] ?? null);
  return { dials, toggles: pad(toggles), values: pad(values) };
}
var visibleModControls = (def, params) => def.controls.filter((c) => !c.when || c.when(params));
var registry = /* @__PURE__ */ new Map();
function registerModType(def) {
  registry.set(def.type, def);
}
var getModType = (type) => registry.get(type);
var listModTypes = () => [...registry.values()];
var MOD_SETTINGS_PANEL = "mod-settings";
var modKey = (panelId, path) => `${panelId}\0${path}`;
var clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
var clamp012 = (v) => clamp(Number(v) || 0, 0, 1);
var clampSigned = (v) => clamp(Number(v) || 0, -1, 1);
function applyModulation(base, signal, amount, min, max) {
  const offset = clamp(signal, -1, 1) * clamp012(amount) * (max - min) / 2;
  return clamp(base + offset, min, max);
}
var MOD_RING_RADIUS = 6;
var MOD_RING_CIRCUMFERENCE = 2 * Math.PI * MOD_RING_RADIUS;
var RING_SWEEP_START = 135 / 360;
var RING_SWEEP_LEN = 270 / 360;
var LFO_SYNC_DIVISIONS = [
  { label: "4", beats: 16 },
  { label: "2", beats: 8 },
  { label: "1", beats: 4 },
  { label: "1/2", beats: 2 },
  { label: "1/4", beats: 1 },
  { label: "1/8", beats: 0.5 },
  { label: "1/16", beats: 0.25 },
  { label: "1/32", beats: 0.125 }
];
function lfoSyncedHz(division, bpm) {
  const i = clamp(Math.round(Number(division) || 0), 0, LFO_SYNC_DIVISIONS.length - 1);
  return (Number(bpm) || 120) / 60 / LFO_SYNC_DIVISIONS[i].beats;
}
var previewNoise = (i, salt = 0) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};
function previewSlew(values, smooth) {
  const s = clamp012(smooth);
  if (s <= 0 || values.length < 2) return values;
  const k = 1 - Math.exp(-(1 / values.length) / (s * s * 0.4 + 1e-6));
  let out = values[0];
  return values.map((v, i) => i === 0 ? out : out = out + (v - out) * k);
}
var LFO_DEF = {
  type: "lfo",
  label: "LFO",
  defaults: { rate: 1, division: 4, phase: 0, width: 0.5, jitter: 0, smooth: 0, sync: false },
  controls: [
    { type: "slider", path: "rate", label: "Rate", min: 0.02, max: 20, step: 0.01, unit: "Hz", scope: true },
    { type: "toggle", path: "sync", label: "Sync" },
    { type: "slider", path: "phase", label: "Phase", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "width", label: "Width", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "jitter", label: "Jitter", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "smooth", label: "Smooth", min: 0, max: 1, step: 0.01 }
  ],
  createState: () => ({ phase: 0, drift: 0, driftTarget: 0, out: null }),
  tick(state, params, dt, bpm) {
    const s = state;
    const hz = params.sync ? lfoSyncedHz(Number(params.division) || 0, bpm) : Math.max(0, Number(params.rate) || 0);
    const before = s.phase;
    s.phase = (s.phase + dt * hz) % 1;
    if (s.phase < before) s.driftTarget = (Math.random() * 2 - 1) * clamp012(params.jitter);
    if (!clamp012(params.jitter)) {
      s.drift = 0;
      s.driftTarget = 0;
    } else s.drift += (s.driftTarget - s.drift) * Math.min(1, dt * hz * 4);
    const w = clamp(Number(params.width) || 0, 0.01, 0.99);
    const ph = (s.phase + clamp012(params.phase)) % 1;
    const tri = ph < w ? ph / w : 1 - (ph - w) / (1 - w);
    let v = clamp(tri * 2 - 1 + s.drift, -1, 1);
    const smooth = clamp012(params.smooth);
    if (smooth > 0 && s.out !== null) {
      const k = 1 - Math.exp(-dt / (smooth * smooth * 0.4 + 1e-6));
      v = s.out + (v - s.out) * k;
    }
    s.out = v;
    return v;
  },
  /**
   * Two cycles of the wave the params describe: the width skew, the jitter
   * as a slow deterministic wobble, and the slew rounding it all. The
   * on-screen scope draws the live engine signal instead; this is the
   * scope's caption (the wave's name) and the small screens' drawing.
   */
  preview(params, count) {
    const n = Math.max(2, count);
    const w = clamp(Number(params.width) || 0, 0.01, 0.99);
    const jitter = clamp012(params.jitter);
    const wobble = Math.max(2, Math.round(n / 8));
    const raw = Array.from({ length: n }, (_, i) => {
      const ph = (i / (n - 1) * 2 + clamp012(params.phase)) % 1;
      const tri = ph < w ? ph / w : 1 - (ph - w) / (1 - w);
      const drift = previewNoise(Math.floor(i / wobble)) * jitter * 0.5;
      return clamp(tri * 2 - 1 + drift, -1, 1);
    });
    const shape = clamp012(params.smooth) > 0.55 ? "Sine" : w <= 0.25 ? "Saw" : w >= 0.75 ? "Ramp" : "Tri";
    return {
      points: previewSlew(raw, clamp012(params.smooth)).map((v) => (v + 1) / 2),
      label: jitter > 0.4 ? `${shape} \xB7 Jitter` : shape
    };
  }
};
registerModType(LFO_DEF);
var SH_DEF = {
  type: "sh",
  label: "S&H",
  defaults: { rate: 4, depth: 1, offset: 0, jitter: 0, smooth: 0 },
  controls: [
    { type: "slider", path: "rate", label: "Rate", min: 0.1, max: 30, step: 0.01, unit: "Hz", scope: true },
    { type: "slider", path: "depth", label: "Depth", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "offset", label: "Offset", min: -1, max: 1, step: 0.01 },
    { type: "slider", path: "jitter", label: "Jitter", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "smooth", label: "Smooth", min: 0, max: 1, step: 0.01 }
  ],
  createState: () => ({ wait: 0, held: 0, out: null }),
  tick(state, params, dt) {
    const s = state;
    s.wait -= dt;
    if (s.out === null || s.wait <= 0) {
      s.held = Math.random() * 2 - 1;
      const hz = Math.max(0.01, Number(params.rate) || 0);
      const len = 1 / hz * (1 + (Math.random() * 2 - 1) * clamp012(params.jitter) * 0.9);
      s.wait = Math.max(5e-3, len);
    }
    const offset = clamp(Number(params.offset) || 0, -1, 1);
    let v = clamp(s.held * clamp012(params.depth) + offset, -1, 1);
    const smooth = clamp012(params.smooth);
    if (smooth > 0 && s.out !== null) {
      const k = 1 - Math.exp(-dt / (smooth * smooth * 0.4 + 1e-6));
      v = s.out + (v - s.out) * k;
    }
    s.out = v;
    return v;
  },
  /**
   * A run of held values, deterministic so the picture holds still while
   * you shape it: depth scales the throw, offset lifts the whole run,
   * jitter stretches and shrinks the holds (the drunken clock), and the
   * slew turns the steps into a drift.
   */
  preview(params, count) {
    const n = Math.max(2, count);
    const depth = clamp012(params.depth);
    const offset = clamp(Number(params.offset) || 0, -1, 1);
    const jitter = clamp012(params.jitter);
    const steps = 8;
    const lens = Array.from({ length: steps }, (_, i) => 1 + previewNoise(i, 1) * jitter * 0.9);
    const total = lens.reduce((a, b) => a + b, 0);
    const edges = [];
    let acc = 0;
    for (const len of lens) edges.push(acc += len / total);
    const raw = Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      const step = edges.findIndex((e) => t <= e);
      return clamp(previewNoise(step < 0 ? steps - 1 : step) * depth + offset, -1, 1);
    });
    return {
      points: previewSlew(raw, clamp012(params.smooth)).map((v) => (v + 1) / 2),
      label: clamp012(params.smooth) > 0.55 ? "Drift" : "Steps"
    };
  }
};
registerModType(SH_DEF);
var secs = (ms) => Math.max(0, Number(ms) || 0) / 1e3;
var ADSR_STAGE_MAX = { attack: 2e3, decay: 2e3, release: 4e3 };
var adsrShape = (p, curve) => {
  const c = clamp(Number(curve) || 0, -1, 1);
  return 1 - Math.pow(1 - p, Math.pow(4, c));
};
function adsrStageLength(stage, params) {
  if (stage === "attack") return secs(params.attack);
  if (stage === "decay") return secs(params.decay);
  if (stage === "release") return secs(params.release);
  return Infinity;
}
var ADSR_DEF = {
  type: "adsr",
  label: "ADSR",
  defaults: {
    attack: 10,
    decay: 300,
    sustain: 0.6,
    release: 600,
    loop: false,
    // The attack keeps its analog leap; decay and release start straight,
    // as the design draws them — every ramp bendable from its pad.
    attackCurve: 0.5,
    decayCurve: 0,
    releaseCurve: 0
  },
  controls: [
    { type: "slider", path: "attack", label: "Attack", min: 0, max: ADSR_STAGE_MAX.attack, step: 1, unit: "ms", envStage: "attack" },
    { type: "slider", path: "decay", label: "Decay", min: 0, max: ADSR_STAGE_MAX.decay, step: 1, unit: "ms", envStage: "decay" },
    { type: "slider", path: "sustain", label: "Sustain", min: 0, max: 1, step: 0.01, envStage: "sustain" },
    { type: "slider", path: "release", label: "Release", min: 0, max: ADSR_STAGE_MAX.release, step: 1, unit: "ms", envStage: "release" },
    /* A big slot of its own, beside the envelope — the pad row under the
       ramps belongs to the hold-to-bend gesture. */
    { type: "toggle", path: "loop", label: "Loop", big: true }
  ],
  createState: () => ({ stage: "idle", t: 0, from: 0, env: 0, gate: false }),
  gate(state, on) {
    const s = state;
    s.gate = on;
    if (on) {
      s.stage = "attack";
      s.t = 0;
      s.from = s.env;
    } else if (s.stage !== "idle") {
      s.stage = "release";
      s.t = 0;
      s.from = s.env;
    }
  },
  tick(state, params, dt) {
    const s = state;
    const loop = !!params.loop;
    const sustain = clamp012(params.sustain);
    if (s.stage === "idle") {
      if (!loop) return s.env = 0;
      s.stage = "attack";
      s.t = 0;
      s.from = 0;
    }
    s.t += dt;
    for (let guard = 0; guard < 4; guard++) {
      const len2 = adsrStageLength(s.stage, params);
      if (s.t < len2) break;
      s.t -= len2;
      if (s.stage === "attack") {
        s.stage = "decay";
        s.from = 1;
      } else if (s.stage === "decay") {
        s.stage = s.gate ? "sustain" : "release";
        s.from = sustain;
      } else {
        s.stage = loop ? "attack" : "idle";
        s.from = 0;
      }
    }
    const len = adsrStageLength(s.stage, params);
    const p = len > 0 && Number.isFinite(len) ? Math.min(1, s.t / len) : 1;
    if (s.stage === "attack") s.env = s.from + (1 - s.from) * adsrShape(p, params.attackCurve);
    else if (s.stage === "decay") s.env = s.from + (sustain - s.from) * adsrShape(p, params.decayCurve);
    else if (s.stage === "sustain") s.env = sustain;
    else if (s.stage === "release") s.env = s.from * (1 - adsrShape(p, params.releaseCurve));
    else s.env = 0;
    return clamp012(s.env);
  }
};
registerModType(ADSR_DEF);
var CURVE_MAX_CLIPS = 8;
var CURVE_MIN_DURATION = 0.05;
var CURVE_MAX_DURATION = 60;
var CURVE_PULSE_DECAY = 0.04;
var CURVE_PREVIEW_BAND = { lo: -0.25, hi: 1.25 };
var DIRECTIONS = ["forward", "mirror", "reverse"];
var CURVE_LABELS = {
  linear: "Linear",
  easeIn: "Ease In",
  easeOut: "Ease Out",
  easeInOut: "Ease InOut",
  spring: "Spring"
};
var SHAPE_PARAMS = ["curvature", "steepness", "anticipate", "overshoot"];
var newClip = () => ({
  type: "easeInOut",
  weight: 1,
  curvature: 0,
  steepness: 0,
  overshoot: 0,
  anticipate: 0
});
function readClips(params) {
  const raw = Array.isArray(params.clips) ? params.clips : [];
  const list = raw.filter((c) => c && typeof c === "object").map((c) => ({ ...newClip(), ...c }));
  return list.length ? list.slice(0, CURVE_MAX_CLIPS) : [newClip()];
}
var writeClips = (list) => list;
var selectedClip = (params, count) => clamp(Math.round(Number(params.selected) || 0), 0, Math.max(0, count - 1));
function curveComposition(params) {
  const i = DIRECTIONS.indexOf(params.direction);
  return {
    segments: readClips(params),
    driver: null,
    direction: DIRECTIONS[i < 0 ? 0 : i],
    gap: clamp012(params.gap)
  };
}
function curveDuration(params, bpm) {
  const want = clamp(Number(params.duration) || 0, CURVE_MIN_DURATION, CURVE_MAX_DURATION);
  if (!params.sync) return want;
  const beat = 60 / (Number(bpm) || 120);
  let best = LFO_SYNC_DIVISIONS[0].beats * beat;
  for (const div of LFO_SYNC_DIVISIONS) {
    const secs2 = div.beats * beat;
    if (Math.abs(secs2 - want) < Math.abs(best - want)) best = secs2;
  }
  return Math.max(CURVE_MIN_DURATION, best);
}
var CURVE_DEF = {
  type: "curve",
  label: "Curve",
  defaults: {
    duration: 2,
    sync: false,
    signal: "continuous",
    triggers: DEFAULT_TRIGGER_STEPS,
    direction: "forward",
    flip: false,
    gap: 0,
    segments: 1,
    selected: 0,
    curvature: 0,
    steepness: 0,
    anticipate: 0,
    overshoot: 0,
    clips: writeClips([newClip()])
  },
  controls: [
    /* The selected clip's shape: the knob leans its energy one way or the
       other, the volume knob makes the ease gentle or explosive — the same
       two-axis drag the composer answers to on screen. A knob tap cycles
       the clip through the curve vocabulary. */
    {
      type: "xy",
      path: "curve",
      label: "Curve",
      xParam: "curvature",
      yParam: "steepness",
      xAxis: { min: -1, max: 1, bipolar: true, label: "Energy" },
      yAxis: { min: -1, max: 1, bipolar: true, label: "Steep" },
      drawsPreview: true,
      cycle: (params) => {
        const comp = curveComposition(params);
        const i = selectedClip(params, comp.segments.length);
        return { clips: writeClips(cycleSegmentType(comp, i).segments) };
      }
    },
    { type: "slider", path: "duration", label: "Duration", min: CURVE_MIN_DURATION, max: CURVE_MAX_DURATION, step: 0.01, unit: "s" },
    { type: "toggle", path: "sync", label: "Sync" },
    {
      type: "select",
      path: "signal",
      label: "Signal",
      chip: true,
      options: [{ value: "continuous", label: "Cont" }, { value: "trigger", label: "Trig" }]
    },
    /* The direction reads as a picture — an arrow says which way the pass
       runs faster than a word does. */
    {
      type: "select",
      path: "direction",
      label: "Direction",
      options: [
        { value: "forward", label: "Forward", icon: "arrow-right" },
        { value: "mirror", label: "Mirror", icon: "arrow-left-right" },
        { value: "reverse", label: "Reverse", icon: "arrow-left" }
      ]
    },
    { type: "toggle", path: "flip", label: "Flip" },
    /* The trigger count only means anything in trigger mode, so the chip
       only appears there — the column stays clear the rest of the time. */
    {
      type: "slider",
      path: "triggers",
      label: "Triggers",
      chip: true,
      min: 2,
      max: 16,
      step: 1,
      when: (params) => params.signal === "trigger"
    },
    { type: "slider", path: "gap", label: "Gap", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "anticipate", label: "Anticipate", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "overshoot", label: "Overshoot", min: 0, max: 1, step: 0.01 },
    { type: "slider", path: "segments", label: "Segments", min: 1, max: CURVE_MAX_CLIPS, step: 1 }
  ],
  createState: () => ({ phase: 0, signature: "", samplers: null, prev: null, pulse: 0 }),
  tick(state, params, dt, bpm) {
    const s = state;
    const comp = curveComposition(params);
    const signature = JSON.stringify(comp.segments) + `|${comp.gap}`;
    if (signature !== s.signature || !s.samplers) {
      s.signature = signature;
      s.samplers = buildSamplers(comp);
    }
    s.phase = (s.phase + dt / curveDuration(params, bpm)) % 1;
    let v = clamp012(readComposition(comp, s.phase, s.samplers).value);
    if (params.flip) v = 1 - v;
    if (params.signal !== "trigger") {
      s.prev = v;
      return v * 2 - 1;
    }
    const fired = triggersCrossed(s.prev ?? v, v, Number(params.triggers) || DEFAULT_TRIGGER_STEPS);
    s.prev = v;
    if (fired.length) s.pulse = 1;
    else s.pulse *= Math.exp(-dt / CURVE_PULSE_DECAY);
    return s.pulse;
  },
  /**
   * Keep the projection and the series in step. A shape dial writes into the
   * selected clip; anything else — a new selection, a deleted clip, a cycled
   * curve — reads that clip's shape back out, so the dials always show the
   * clip the composer is highlighting.
   */
  normalize(current, patch) {
    const next = { ...current, ...patch };
    const changed = (key) => key in patch && patch[key] !== current[key];
    let list = "clips" in patch ? readClips(patch) : readClips(current);
    if (!("clips" in patch) && changed("segments")) {
      const want = clamp(Math.round(Number(patch.segments) || 1), 1, CURVE_MAX_CLIPS);
      while (list.length > want) list.pop();
      while (list.length < want) list.push(newClip());
      list = list.map((c) => ({ ...c, weight: 1 }));
    }
    const sel = selectedClip(next, list.length);
    if (SHAPE_PARAMS.some(changed)) {
      list[sel] = {
        ...list[sel],
        curvature: clampSigned(next.curvature),
        steepness: clampSigned(next.steepness),
        anticipate: clamp012(next.anticipate),
        overshoot: clamp012(next.overshoot)
      };
    } else {
      const clip = list[sel];
      next.curvature = clip.curvature;
      next.steepness = clip.steepness;
      next.anticipate = clip.anticipate ?? 0;
      next.overshoot = clip.overshoot ?? 0;
    }
    next.selected = sel;
    next.segments = list.length;
    next.clips = writeClips(list);
    return next;
  },
  buttons: {
    /* The arrows walk the clips (wrapping), Delete drops the selected one —
       the last clip stays, since a pass with nothing in it plays nothing. */
    left: (params) => {
      const n = readClips(params).length;
      return { selected: (selectedClip(params, n) + n - 1) % n };
    },
    right: (params) => {
      const n = readClips(params).length;
      return { selected: (selectedClip(params, n) + 1) % n };
    },
    delete: (params) => {
      const list = readClips(params);
      if (list.length <= 1) return;
      const sel = selectedClip(params, list.length);
      list.splice(sel, 1);
      return { clips: writeClips(list), selected: Math.min(sel, list.length - 1) };
    }
  },
  phase: (state) => state.phase,
  preview(params, count) {
    const list = readClips(params);
    const sel = selectedClip(params, list.length);
    const sampler = buildSampler(list[sel]);
    const span = CURVE_PREVIEW_BAND.hi - CURVE_PREVIEW_BAND.lo;
    const n = Math.max(2, count);
    return {
      points: Array.from({ length: n }, (_, i) => clamp012((sampler(i / (n - 1)) - CURVE_PREVIEW_BAND.lo) / span)),
      label: `${CURVE_LABELS[list[sel].type]} ${sel + 1}/${list.length}`
    };
  }
};
registerModType(CURVE_DEF);

// src/store/ModulationStore.ts
var MOD_TOUCH_GRACE_MS = 4e3;
var PERSIST_TARGET = resolvePersistTarget("modulation", "global", true);
var clamp2 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
var freshParams = (def) => JSON.parse(JSON.stringify(def.defaults));
var ModulationStoreClass = class {
  constructor() {
    this.slots = Array(MOD_SLOTS).fill(null);
    this.assignments = /* @__PURE__ */ new Map();
    this.states = /* @__PURE__ */ new Map();
    this.signals = Array(MOD_SLOTS).fill(0);
    this.sources = /* @__PURE__ */ new Map();
    this.sourceValues = /* @__PURE__ */ new Map();
    this.metas = /* @__PURE__ */ new Map();
    this.bpm = 120;
    this.touched = null;
    this.settingsIndex = null;
    this.settingsUnsub = null;
    /** The control set the open page was built from — see `shapeOf`. */
    this.settingsShape = "";
    this.applyingSettings = false;
    this.structListeners = /* @__PURE__ */ new Set();
    this.frameListeners = /* @__PURE__ */ new Set();
    this.version = 0;
    this.rafId = null;
    this.lastTick = 0;
    this.loop = (now) => {
      this.tick(Math.max(0, (now - this.lastTick) / 1e3));
      this.lastTick = now;
      this.rafId = this.slots.some(Boolean) ? window.requestAnimationFrame(this.loop) : null;
    };
    const saved = loadPersisted(PERSIST_TARGET);
    if (saved) {
      for (const slot of saved.slots ?? []) {
        const i = Math.round(Number(slot?.index));
        if (i >= 0 && i < MOD_SLOTS && slot.type && slot.params) {
          this.slots[i] = { ...slot, index: i, params: { ...slot.params } };
        }
      }
      for (const a of saved.assignments ?? []) {
        if (a?.panelId && a.path && this.slots[a.slot]) {
          this.assignments.set(modKey(a.panelId, a.path), { ...a });
        }
      }
    }
    TweakStore.subscribeGlobal(() => this.metas.clear());
    this.ensureLoop();
  }
  /* ── slots ────────────────────────────────────────────────────────── */
  /** Create a modulation in a step's slot; an occupied slot is returned as-is. */
  createSlot(index, type = "lfo") {
    if (!Number.isInteger(index) || index < 0 || index >= MOD_SLOTS) return null;
    const existing = this.slots[index];
    if (existing) return existing;
    const def = getModType(type);
    if (!def) {
      console.warn(`[tweakers] modulator type "${type}" is not registered`);
      return null;
    }
    const slot = { index, type, params: freshParams(def) };
    this.slots[index] = slot;
    this.states.set(index, def.createState());
    this.changed();
    this.ensureLoop();
    return slot;
  }
  getSlot(index) {
    return this.slots[index] ?? null;
  }
  /** The occupied slots, index order — the track row's circles. */
  getSlots() {
    return this.slots.filter((s) => s !== null);
  }
  /**
   * Change a slot's settings. A modulator with its own structure folds the
   * patch in its own way (`normalize`) — the curve writes a shape dial into
   * the clip it belongs to — and the open settings page follows.
   */
  updateSlotParams(index, patch) {
    const slot = this.slots[index];
    if (!slot) return;
    const def = getModType(slot.type);
    slot.params = def?.normalize ? def.normalize(slot.params, patch) : { ...slot.params, ...patch };
    if (this.settingsIndex === index) this.refreshSettings();
    this.changed();
  }
  /** Switch a slot's modulator type — fresh defaults, fresh state. */
  setSlotType(index, type) {
    const slot = this.slots[index];
    const def = getModType(type);
    if (!slot || !def) return;
    slot.type = type;
    slot.params = freshParams(def);
    this.states.set(index, def.createState());
    this.changed();
  }
  /** Point a slot at an external source (null returns it to the engine). */
  setSlotSource(index, sourceId) {
    const slot = this.slots[index];
    if (!slot) return;
    slot.source = sourceId;
    this.changed();
  }
  /** Remove a slot's modulation and every assignment wired to it. */
  removeSlot(index) {
    if (!this.slots[index]) return;
    if (this.settingsIndex === index) this.closeSettings();
    this.slots[index] = null;
    this.states.delete(index);
    this.signals[index] = 0;
    for (const [key, a] of this.assignments) {
      if (a.slot === index) this.assignments.delete(key);
    }
    this.changed();
  }
  /* ── assignments ──────────────────────────────────────────────────── */
  /**
   * Wire a control to a slot. Only bounded numeric controls (slider, number
   * with min/max) can be modulated; anything else is refused. A control not
   * yet registered is accepted on trust and resolves when its panel appears.
   */
  assign(panelId, path, slot, amount = 0.5) {
    if (!this.slots[slot]) return false;
    if (panelId === MOD_SETTINGS_PANEL) return false;
    if (TweakStore.getPanel(panelId) && !this.resolveMeta(panelId, path)) {
      console.warn(`[tweakers] "${path}" is not a bounded numeric control; it cannot take a modulation`);
      return false;
    }
    this.assignments.set(modKey(panelId, path), {
      panelId,
      path,
      slot,
      amount: clamp2(Number(amount) || 0, 0, 1)
    });
    this.changed();
    return true;
  }
  unassign(panelId, path) {
    if (this.assignments.delete(modKey(panelId, path))) this.changed();
  }
  getAssignment(panelId, path) {
    return this.assignments.get(modKey(panelId, path));
  }
  getAssignments() {
    return [...this.assignments.values()];
  }
  assignmentsForSlot(index) {
    return this.getAssignments().filter((a) => a.slot === index);
  }
  setAmount(panelId, path, amount) {
    const a = this.assignments.get(modKey(panelId, path));
    if (!a) return;
    a.amount = clamp2(Number(amount) || 0, 0, 1);
    this.changed();
  }
  /* ── the assignment gesture ───────────────────────────────────────── */
  /** A finger on a control — panel pointer, hardware knob. Arms assignment. */
  noteTouch(panelId, path) {
    this.touched = { panelId, path, at: Date.now() };
  }
  /**
   * A step-button press (hardware step or on-screen circle): with a control
   * armed, create the slot's modulation if needed and toggle the control
   * onto it. Returns what happened, for lights and readouts.
   */
  assignFromStep(index) {
    const t = this.touched;
    const armed = t && Date.now() - t.at < MOD_TOUCH_GRACE_MS;
    if (!armed) return { action: "none", slot: this.getSlot(index) };
    const existing = this.assignments.get(modKey(t.panelId, t.path));
    if (this.slots[index] && existing?.slot === index) {
      this.unassign(t.panelId, t.path);
      return { action: "unassigned", slot: this.getSlot(index) };
    }
    const created = !this.slots[index];
    const slot = this.createSlot(index);
    if (!slot) return { action: "none", slot: null };
    if (!this.assign(t.panelId, t.path, index)) {
      if (created) this.removeSlot(index);
      return { action: "none", slot: this.getSlot(index) };
    }
    return { action: created ? "created" : "assigned", slot };
  }
  /* ── gates ────────────────────────────────────────────────────────── */
  /**
   * Note on / note off for a slot — what drives a gated modulator like the
   * ADSR:
   *
   *   ModulationStore.gate(0, true);    // key down
   *   ModulationStore.gate(0, false);   // key up — the release runs
   *
   * Free-running types (LFO, S&H) and slots on an external source ignore
   * it. The gate is live state, not a param: it is never persisted.
   */
  gate(index, on) {
    const slot = this.slots[index];
    const def = slot && getModType(slot.type);
    if (!slot || slot.source || !def?.gate) return;
    let state = this.states.get(index);
    if (state === void 0) {
      state = def.createState();
      this.states.set(index, state);
    }
    def.gate(state, on);
    this.ensureLoop();
  }
  /* ── the settings page ────────────────────────────────────────────── */
  /**
   * Open a slot's settings (hold its step button): registers one hidden
   * TweakStore panel (`mod-settings`, kind 'modulation') built from the
   * modulator's own control list, with the type enum ahead of it. Every
   * edit on that panel — screen or hardware, the kit syncs it like any
   * page — flows back into the slot's params. Returns the panel id.
   */
  openSettings(index) {
    const slot = this.slots[index];
    const def = slot && getModType(slot.type);
    if (!slot || !def) return null;
    this.closeSettings();
    this.settingsIndex = index;
    this.registerSettingsPanel(slot, def);
    this.settingsUnsub = TweakStore.subscribe(MOD_SETTINGS_PANEL, () => this.onSettingsChange());
    this.changed();
    return MOD_SETTINGS_PANEL;
  }
  closeSettings() {
    if (this.settingsIndex === null) return;
    this.settingsUnsub?.();
    this.settingsUnsub = null;
    this.settingsIndex = null;
    this.settingsShape = "";
    TweakStore.unregisterPanel(MOD_SETTINGS_PANEL);
    this.changed();
  }
  /** The open settings page, or null — the panel to render as the Move page. */
  getSettings() {
    return this.settingsIndex === null ? null : { index: this.settingsIndex, panelId: MOD_SETTINGS_PANEL };
  }
  /**
   * Where the open page's controls sit — the eight dial slots and the small
   * slots under them. Both surfaces lay the page out from this one list, so
   * they never disagree about which knob a pad belongs to.
   */
  getSettingsLayout() {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    if (!slot || !def) return null;
    const layout = modPageLayout(def.controls, slot.params);
    return {
      dials: [{ path: "type" }, ...layout.dials].slice(0, 8),
      toggles: [null, ...layout.toggles].slice(0, 8),
      values: [null, ...layout.values].slice(0, 8)
    };
  }
  /** The open page's curve, sampled 0..1, and its name — the preview dial. */
  getSettingsPreview(count = 32) {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    return slot && def?.preview ? def.preview(slot.params, count) : null;
  }
  /** Hardware buttons the open page claims (the curve's arrows and Delete). */
  getSettingsButtons() {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    return def?.buttons ? Object.keys(def.buttons) : [];
  }
  /** Run a claimed button. False when the page does not claim that name. */
  pressSettingsButton(name) {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const action = slot && getModType(slot.type)?.buttons?.[name];
    if (!slot || !action) return false;
    const patch = action(slot.params);
    if (patch) this.updateSlotParams(slot.index, patch);
    return true;
  }
  /** A knob tap on a page dial that cycles (the curve's clip vocabulary). */
  tapSettingsControl(path) {
    const slot = this.settingsIndex === null ? null : this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    const cycle = def?.controls.find((c) => c.path === path)?.cycle;
    if (!slot || !cycle) return false;
    this.updateSlotParams(slot.index, cycle(slot.params));
    return true;
  }
  registerSettingsPanel(slot, def) {
    const config = {
      type: {
        type: "select",
        options: listModTypes().map((d) => ({ value: d.type, label: d.label })),
        default: slot.type
      }
    };
    this.settingsShape = this.shapeOf(slot, def);
    for (const c of visibleModControls(def, slot.params)) {
      if (c.type === "select") {
        config[c.path] = {
          type: "select",
          options: c.options ?? [],
          default: String(slot.params[c.path] ?? "")
        };
      } else if (c.type === "slider") {
        config[c.path] = {
          type: "slider",
          min: c.min ?? 0,
          max: c.max ?? 1,
          step: c.step,
          unit: c.unit,
          default: Number(slot.params[c.path]) || 0
        };
      } else if (c.type === "toggle") {
        config[c.path] = !!slot.params[c.path];
      } else if (c.type === "xy" && c.xParam && c.yParam) {
        config[c.path] = {
          type: "xy",
          x: c.xAxis,
          y: c.yAxis,
          default: { x: Number(slot.params[c.xParam]) || 0, y: Number(slot.params[c.yParam]) || 0 }
        };
      }
    }
    this.applyingSettings = true;
    TweakStore.registerPanel(
      MOD_SETTINGS_PANEL,
      `${def.label} ${slot.index + 1}`,
      config,
      void 0,
      { kind: "modulation" }
    );
    this.applyingSettings = false;
  }
  /** A settings-panel edit — screen or hardware — lands in the slot's params. */
  onSettingsChange() {
    if (this.applyingSettings || this.settingsIndex === null) return;
    const slot = this.slots[this.settingsIndex];
    if (!slot) return;
    const values = TweakStore.getValues(MOD_SETTINGS_PANEL);
    const nextType = values.type;
    if (nextType && nextType !== slot.type && getModType(nextType)) {
      this.setSlotType(slot.index, nextType);
      this.registerSettingsPanel(this.slots[slot.index], getModType(nextType));
      return;
    }
    const def = getModType(slot.type);
    if (!def) return;
    const patch = {};
    for (const c of visibleModControls(def, slot.params)) {
      const v = values[c.path];
      if (c.type === "xy" && c.xParam && c.yParam) {
        const xy = v;
        if (xy && typeof xy === "object") {
          patch[c.xParam] = Number(xy.x) || 0;
          patch[c.yParam] = Number(xy.y) || 0;
        }
      } else if (c.type === "toggle") {
        patch[c.path] = !!v;
      } else if (c.type === "select") {
        if (typeof v === "string") patch[c.path] = v;
      } else if (typeof v === "number" && Number.isFinite(v)) {
        patch[c.path] = v;
      }
    }
    this.updateSlotParams(slot.index, patch);
  }
  /**
   * The open page, after the params moved under it. A change that alters
   * which controls the page shows (the curve's trigger chip appearing) or
   * what they read (an arrow selecting another clip) has to reach the panel
   * — hardware edits arrive there, and the screen renders from it.
   */
  refreshSettings() {
    if (this.settingsIndex === null) return;
    const slot = this.slots[this.settingsIndex];
    const def = slot && getModType(slot.type);
    if (!slot || !def) return;
    if (this.shapeOf(slot, def) !== this.settingsShape) {
      this.registerSettingsPanel(slot, def);
      return;
    }
    const values = TweakStore.getValues(MOD_SETTINGS_PANEL);
    const guarded = this.applyingSettings;
    this.applyingSettings = true;
    for (const c of visibleModControls(def, slot.params)) {
      if (c.type === "xy" && c.xParam && c.yParam) {
        const xy = values[c.path] ?? {};
        const x = Number(slot.params[c.xParam]) || 0;
        const y = Number(slot.params[c.yParam]) || 0;
        if (xy.x !== x || xy.y !== y) TweakStore.updateValue(MOD_SETTINGS_PANEL, c.path, { x, y });
      } else if (values[c.path] !== slot.params[c.path]) {
        TweakStore.updateValue(MOD_SETTINGS_PANEL, c.path, slot.params[c.path]);
      }
    }
    this.applyingSettings = guarded;
  }
  /** Which controls the page is built from — a rebuild when this changes. */
  shapeOf(slot, def) {
    return `${slot.type}:${visibleModControls(def, slot.params).map((c) => c.path).join(",")}`;
  }
  /* ── external sources ─────────────────────────────────────────────── */
  /** Offer an app-side modulator to the slots; returns an unregister fn. */
  registerSource(id, config = {}) {
    this.sources.set(id, config);
    this.changed();
    return () => {
      if (this.sources.get(id) === config) {
        this.sources.delete(id);
        this.sourceValues.delete(id);
        this.changed();
      }
    };
  }
  /** Push a source's signal (-1..1) at any rate; the engine mirrors the latest. */
  setSourceValue(id, value) {
    this.sourceValues.set(id, clamp2(Number(value) || 0, -1, 1));
  }
  getSources() {
    return [...this.sources.keys()];
  }
  /* ── tempo ────────────────────────────────────────────────────────── */
  setTempo(bpm) {
    const next = clamp2(Number(bpm) || 0, 20, 999);
    if (next === this.bpm) return;
    this.bpm = next;
    this.changed();
  }
  getTempo() {
    return this.bpm;
  }
  /* ── reading the modulated layer ──────────────────────────────────── */
  /** A slot's live signal, -1..1. */
  getSignal(index) {
    return this.signals[index] ?? 0;
  }
  /** Where a slot sits in its cycle, 0..1 — a curve composer's playhead. */
  getSlotPhase(index) {
    const slot = this.slots[index];
    const def = slot && getModType(slot.type);
    const state = this.states.get(index);
    return slot && def?.phase && state !== void 0 ? def.phase(state) : 0;
  }
  /** The modulation's contribution to one control, in the control's units. */
  getOffset(panelId, path) {
    const a = this.assignments.get(modKey(panelId, path));
    if (!a) return 0;
    const slot = this.slots[a.slot];
    if (!slot) return 0;
    if (slot.source && !this.sources.get(slot.source)?.applies) return 0;
    const meta = this.resolveMeta(panelId, path);
    if (!meta) return 0;
    const base = Number(TweakStore.getValue(panelId, path));
    if (!Number.isFinite(base)) return 0;
    return applyModulation(base, this.signals[a.slot], a.amount, meta.min, meta.max) - base;
  }
  /**
   * A modulatable control's bounds, or null when it has none (or its panel
   * has not registered yet) — what a display needs to draw the modulation
   * against the control's own span.
   */
  getBounds(panelId, path) {
    const meta = this.resolveMeta(panelId, path);
    return meta ? { min: meta.min, max: meta.max } : null;
  }
  /** One control's value with its modulation applied — the frame-time read. */
  getValue(panelId, path) {
    const base = Number(TweakStore.getValue(panelId, path));
    return base + this.getOffset(panelId, path);
  }
  /**
   * A panel's values with every modulation applied — a fresh snapshot per
   * call, meant to be pulled once per frame in place of `TweakStore.getValues`.
   */
  getValues(panelId) {
    const out = { ...TweakStore.getValues(panelId) };
    for (const a of this.assignments.values()) {
      if (a.panelId !== panelId) continue;
      const offset = this.getOffset(panelId, a.path);
      if (offset !== 0) out[a.path] = Number(out[a.path]) + offset;
    }
    return out;
  }
  /* ── subscriptions ────────────────────────────────────────────────── */
  /** Structural changes: slots, assignments, sources, tempo. */
  subscribe(listener) {
    this.structListeners.add(listener);
    return () => this.structListeners.delete(listener);
  }
  /** Every engine frame — for pulsing circles, dots, and step lights. */
  subscribeFrames(listener) {
    this.frameListeners.add(listener);
    return () => this.frameListeners.delete(listener);
  }
  /** Bumped on every structural change — a stable snapshot for UI stores. */
  getVersion() {
    return this.version;
  }
  /* ── the engine ───────────────────────────────────────────────────── */
  /**
   * Advance every slot by `dt` seconds and refresh the signals. The RAF
   * loop calls this per frame; headless hosts and tests may drive it
   * directly with their own clock.
   */
  tick(dt) {
    const step = clamp2(Number(dt) || 0, 0, 1);
    for (const slot of this.slots) {
      if (!slot) continue;
      if (slot.source) {
        const src = this.sources.get(slot.source);
        let v = this.sourceValues.get(slot.source) ?? 0;
        if (src?.sample) {
          try {
            v = clamp2(Number(src.sample(slot)) || 0, -1, 1);
          } catch {
            v = 0;
          }
        }
        this.signals[slot.index] = v;
        continue;
      }
      const def = getModType(slot.type);
      if (!def) continue;
      let state = this.states.get(slot.index);
      if (state === void 0) {
        state = def.createState();
        this.states.set(slot.index, state);
      }
      this.signals[slot.index] = clamp2(def.tick(state, slot.params, step, this.bpm), -1, 1);
    }
    this.frameListeners.forEach((fn) => fn());
  }
  /** Wipe every slot, assignment, and the persisted shelf. */
  clear() {
    this.closeSettings();
    this.slots.fill(null);
    this.assignments.clear();
    this.states.clear();
    this.signals.fill(0);
    this.touched = null;
    clearPersisted(PERSIST_TARGET);
    this.changed();
  }
  ensureLoop() {
    if (this.rafId !== null || typeof window === "undefined") return;
    if (!this.slots.some(Boolean)) return;
    this.lastTick = performance.now();
    this.rafId = window.requestAnimationFrame(this.loop);
  }
  resolveMeta(panelId, path) {
    const key = modKey(panelId, path);
    const cached = this.metas.get(key);
    if (cached !== void 0) return cached;
    const panel = TweakStore.getPanel(panelId);
    if (!panel) return null;
    const meta = findControl(panel.controls, path);
    const numeric = meta && (meta.type === "slider" || meta.type === "number") && Number.isFinite(meta.min) && Number.isFinite(meta.max) ? { min: meta.min, max: meta.max } : null;
    this.metas.set(key, numeric);
    return numeric;
  }
  changed() {
    this.version++;
    savePersisted(PERSIST_TARGET, {
      slots: this.getSlots(),
      assignments: this.getAssignments()
    });
    this.structListeners.forEach((fn) => fn());
    this.ensureLoop();
  }
};
function findControl(controls, path) {
  for (const c of controls) {
    if (c.children) {
      const hit = findControl(c.children, path);
      if (hit) return hit;
    } else if (c.path === path) {
      return c;
    }
  }
  return null;
}
var ModulationStore = /* @__PURE__ */ new ModulationStoreClass();
export {
  MOD_TOUCH_GRACE_MS,
  ModulationStore
};
//# sourceMappingURL=modulation-store.js.map