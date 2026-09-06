import type { ControlMeta } from './store/TweakStore';
import {
  buildSampler,
  buildSamplers,
  cycleSegmentType,
  readComposition,
  triggersCrossed,
  DEFAULT_TRIGGER_STEPS,
  type CompositionSamplers,
  type CurveComposition,
  type CurveSegment,
  type CurveType,
  type DriverDirection,
} from './curve-composer-core';

/**
 * The modulation layer's shared ground — types, palette, math, and the
 * modulator-type registry, all framework-neutral.
 *
 * A modulation lives in one of 16 slots, one per Move sequencer step button:
 * touch a control and press a step to create the modulation there and wire
 * the control to it. Each slot carries a modulator (an LFO, an envelope
 * follower, a curve...) and a palette colour; the same colour marks the
 * slot's circle in the track row and a dot on every control it drives.
 *
 * The modulated value NEVER enters the TweakStore: a control keeps the
 * number the user set (the base), and the modulation is a live layer read
 * at frame time through the ModulationStore. That keeps presets, the
 * persistence shelf, and the bridge kit's diffing on the stored value —
 * nothing loops, nothing thrashes — the same shape Pixture's audio mods
 * proved out.
 *
 * Modulator types register through `registerModType`, so each type (LFO,
 * envelope, curve, S&H, sequencer) plugs in independently: defaults, the
 * settings-page controls, and a stateful `tick` that advances the signal.
 * A slot can instead point at an external source (a DSP app's own LFO or
 * follower) registered on the ModulationStore — same slot, same colours,
 * but the engine only mirrors the signal it is given.
 */

/** One slot per Move sequencer step button. */
export const MOD_SLOTS = 16;

/**
 * The modulation palette, one colour per slot — sixteen hues around the
 * wheel, tuned to sit with the Move's track colours on the dark panel.
 */
export const MOD_COLORS = [
  '#ff5f45', // 0  coral
  '#ff8a2b', // 1  orange
  '#ffb61e', // 2  amber
  '#f4d942', // 3  yellow
  '#b8e03c', // 4  lime
  '#6fd435', // 5  green
  '#3bcf6d', // 6  emerald
  '#2ed3ab', // 7  teal
  '#33c6e8', // 8  cyan
  '#3d9bff', // 9  azure
  '#5f7bff', // 10 blue
  '#8a6bff', // 11 violet
  '#b45cff', // 12 purple
  '#e04ef0', // 13 magenta
  '#ff4fb0', // 14 pink
  '#ff4f6e', // 15 rose
];

/** A slot's palette colour — the one constant identity it keeps. */
export const modColor = (index: number) =>
  MOD_COLORS[((index % MOD_SLOTS) + MOD_SLOTS) % MOD_SLOTS];

export type ModulationType = 'lfo' | 'adsr' | 'envelope' | 'curve' | 'sh' | 'sequencer';

/** The envelope's four stages — the four columns of its picture. */
export type EnvStage = 'attack' | 'decay' | 'sustain' | 'release';

/**
 * A settings value: the scalars a dial or a pad edits, plus the structures a
 * richer modulator carries (the curve's clip list). JSON-safe throughout, so
 * a slot's whole setup still rides the persistence shelf as it is.
 */
export type ModulationParamValue =
  | number
  | boolean
  | string
  | ModulationParamValue[]
  | { [key: string]: ModulationParamValue };

/** Modulator settings — JSON-safe, like TweakStore values. */
export type ModulationParams = Record<string, ModulationParamValue>;

export interface ModulationSlot {
  /** 0..15 — the Move step button that created it, and its palette index. */
  index: number;
  type: ModulationType;
  params: ModulationParams;
  /** External source id (a DSP app's own modulator); null = internal engine. */
  source?: string | null;
}

export interface ModulationAssignment {
  panelId: string;
  path: string;
  /** The slot driving this control. */
  slot: number;
  /** Sweep depth 0..1 — at 1 the signal swings the control's full span. */
  amount: number;
}

/**
 * Settings-page control metadata — ControlMeta plus what the Move page needs:
 * the xy mapping (an xy control edits two scalar params, xParam/yParam,
 * rather than storing an {x, y} object), and the placement and gestures the
 * two surfaces read through {@link modPageLayout}.
 */
export type ModControlMeta = ControlMeta & {
  xParam?: string;
  yParam?: string;
  /** Sits in a small slot under its dial's column instead of taking a big one. */
  chip?: boolean;
  /** A toggle that takes a big dial slot of its own instead of a pad. */
  big?: boolean;
  /** Shown only when this says so — a control that belongs to one mode. */
  when?: (params: ModulationParams) => boolean;
  /** This dial draws the modulator's own shape (the type's `preview`). */
  drawsPreview?: boolean;
  /**
   * This dial hosts the modulator's oscilloscope: the live signal off the
   * engine fills the slot behind the dial's own readout and bar — the
   * control keeps its drag and its knob, it just shows the wave it makes.
   */
  scope?: boolean;
  /**
   * This dial is one stage of the envelope: the four stage dials render as
   * one 4-column control — a single display drawing the whole shape, with
   * each stage's readout and drag zone in its own column.
   */
  envStage?: EnvStage;
  /** A knob tap on this dial runs this, returning the params it changes. */
  cycle?: (params: ModulationParams) => ModulationParams;
};

/**
 * One modulator type, pluggable: LFO ships with the kit, the others
 * (envelope, curve, S&H, sequencer) register through the same door.
 * `tick` advances the modulator by `dt` seconds and returns the signal,
 * always -1..1; `state` is whatever `createState` returned — the engine
 * never looks inside it.
 */
export interface ModTypeDef {
  type: ModulationType;
  label: string;
  defaults: ModulationParams;
  /** The settings-page layout, in slot order: dials, toggles, the xy pad. */
  controls: ModControlMeta[];
  createState(): unknown;
  tick(state: unknown, params: ModulationParams, dt: number, bpm: number): number;
  /**
   * Fold an incoming patch into the type's own structure — the curve writes
   * the shape dials into the clip they belong to, and reads the next clip's
   * shape back out when the selection moves. Returns the params to store;
   * without it a patch is simply merged.
   */
  normalize?(current: ModulationParams, patch: ModulationParams): ModulationParams;
  /**
   * Hardware buttons this modulator's settings page claims (`left`, `right`,
   * `delete`...). A press runs the action, whose patch lands in the params.
   */
  buttons?: Record<string, (params: ModulationParams) => ModulationParams | void>;
  /**
   * What the modulator is shaped like right now: `count` samples, each 0..1,
   * and what that shape is called. Both small screens draw it.
   */
  preview?(params: ModulationParams, count: number): { points: number[]; label: string };
  /** Where the modulator sits in its cycle, 0..1 — a composer's playhead. */
  phase?(state: unknown): number;
  /**
   * Note on / note off, for the types that take a gate (the ADSR). The
   * store's `gate(slot, on)` lands here; free-running types (LFO, S&H)
   * leave it out and the store ignores the call.
   */
  gate?(state: unknown, on: boolean): void;
}

/* ── the settings page's layout ───────────────────────────────────────── */

/** One control's place on the Move page, with the gestures it answers to. */
export interface ModPageSlot {
  path: string;
  /** The dial draws the modulator's preview instead of a bar. */
  preview?: boolean;
  /** The dial draws this stage's segment of the envelope picture. */
  stage?: EnvStage;
  /** The dial hosts the modulator's oscilloscope behind its readout. */
  scope?: boolean;
  /** A knob tap on this dial cycles it. */
  cycle?: boolean;
}

/**
 * A modulator's page: the eight big dial slots, and the small slots under
 * them — a switch row and a chip row, both column-aligned with the dial
 * above. Empty slots ride as nulls so a column stays open.
 */
export interface ModPageLayout {
  dials: ModPageSlot[];
  toggles: (ModPageSlot | null)[];
  values: (ModPageSlot | null)[];
}

export const MOD_PAGE_DIALS = 8;

const isModDial = (c: ModControlMeta) =>
  !c.chip &&
  (c.scope || (c.type === 'toggle' && c.big) ||
    c.type === 'select' || c.type === 'slider' || c.type === 'xy' || c.type === 'range' ||
    (c.type === 'number' && c.min != null && c.max != null));

const slotOf = (c: ModControlMeta): ModPageSlot => ({
  path: c.path,
  ...(c.drawsPreview ? { preview: true } : {}),
  ...(c.envStage ? { stage: c.envStage } : {}),
  ...(c.scope ? { scope: true } : {}),
  ...(c.cycle ? { cycle: true } : {}),
});

/**
 * Place a modulator's controls, in declaration order: each dial takes the
 * next big slot, and everything else drops into the column of the dial just
 * declared — a switch to the switch row, a chip (or a second switch) to the
 * chip row below it. That is what stacks the LFO's sync pad under its rate
 * dial, and the curve's sync and signal under its duration dial.
 *
 * Both surfaces read this one list, so the screen and the hardware never
 * disagree about which knob a pad belongs to.
 */
export function modPageLayout(controls: ModControlMeta[], params: ModulationParams = {}): ModPageLayout {
  const dials: ModPageSlot[] = [];
  const toggles: (ModPageSlot | null)[] = [];
  const values: (ModPageSlot | null)[] = [];
  for (const c of controls) {
    if (c.when && !c.when(params)) continue;
    if (isModDial(c)) {
      if (dials.length < MOD_PAGE_DIALS) dials.push(slotOf(c));
      continue;
    }
    const col = Math.max(0, dials.length - 1);
    const row = c.type === 'toggle' && !toggles[col] ? toggles : values;
    if (!row[col]) row[col] = slotOf(c);
  }
  const pad = (row: (ModPageSlot | null)[]) =>
    Array.from({ length: row.length }, (_, i) => row[i] ?? null);
  return { dials, toggles: pad(toggles), values: pad(values) };
}

/** The controls a page actually shows — the mode-specific ones filtered out. */
export const visibleModControls = (def: ModTypeDef, params: ModulationParams): ModControlMeta[] =>
  def.controls.filter((c) => !c.when || c.when(params));

const registry = new Map<ModulationType, ModTypeDef>();

/** Plug a modulator type in; registering a type again replaces it. */
export function registerModType(def: ModTypeDef): void {
  registry.set(def.type, def);
}

export const getModType = (type: ModulationType): ModTypeDef | undefined => registry.get(type);

/** The registered types, registration order — the settings page's type enum. */
export const listModTypes = (): ModTypeDef[] => [...registry.values()];

/**
 * Every settings page's width in dial slots: the type picker plus the
 * widest registered page. One number for all types, so switching the type
 * never reflows the page — the control under your finger stays where it is.
 */
export const modPageWidth = (): number =>
  Math.min(
    MOD_PAGE_DIALS,
    1 + listModTypes().reduce(
      (w, def) => Math.max(w, modPageLayout(def.controls, def.defaults).dials.length),
      0
    )
  );

/** The one modulator-settings panel, registered by `ModulationStore.openSettings`. */
export const MOD_SETTINGS_PANEL = 'mod-settings';

/** Assignment map key — panel and path, joined on a character paths can't hold. */
export const modKey = (panelId: string, path: string) => `${panelId}\u0000${path}`;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const clamp01 = (v: unknown) => clamp(Number(v) || 0, 0, 1);
const clampSigned = (v: unknown) => clamp(Number(v) || 0, -1, 1);

/**
 * A signal applied to a control: a bipolar sweep around the base value in
 * the control's own units, clamped to its bounds — the control keeps its
 * base, the modulation dances around it.
 */
export function applyModulation(
  base: number,
  signal: number,
  amount: number,
  min: number,
  max: number
): number {
  const offset = clamp(signal, -1, 1) * clamp01(amount) * (max - min) / 2;
  return clamp(base + offset, min, max);
}

/* ── the modulation ring ──────────────────────────────────────────────── */

/**
 * The ring a modulated control wears: a dial drawn as an SVG circle of this
 * radius, sweeping a knob's 270° from the bottom-left so a value sits at the
 * angle the control's own dial would point.
 */
export const MOD_RING_RADIUS = 6;
export const MOD_RING_CIRCUMFERENCE = 2 * Math.PI * MOD_RING_RADIUS;

const RING_SWEEP_START = 135 / 360;
const RING_SWEEP_LEN = 270 / 360;

/**
 * The arc between two values (each 0..1 of the control's span), as the dash
 * pattern that draws it: SVG lays a circle's path clockwise from 3 o'clock,
 * so a dash of `length` pushed to `offset` lands exactly on the arc.
 * Feed it base and modulated value and the ring shows where the modulation
 * is holding the control right now.
 */
export function modRingArc(from01: number, to01: number): { length: number; offset: number } {
  const a = RING_SWEEP_START + clamp01(from01) * RING_SWEEP_LEN;
  const b = RING_SWEEP_START + clamp01(to01) * RING_SWEEP_LEN;
  return {
    length: Math.abs(b - a) * MOD_RING_CIRCUMFERENCE,
    offset: -Math.min(a, b) * MOD_RING_CIRCUMFERENCE,
  };
}

/* ── LFO — the kit's built-in modulator type ──────────────────────────── */

/** Tempo-sync divisions, cycle length in beats (4/4 bars down to 1/32). */
export const LFO_SYNC_DIVISIONS = [
  { label: '4', beats: 16 },
  { label: '2', beats: 8 },
  { label: '1', beats: 4 },
  { label: '1/2', beats: 2 },
  { label: '1/4', beats: 1 },
  { label: '1/8', beats: 0.5 },
  { label: '1/16', beats: 0.25 },
  { label: '1/32', beats: 0.125 },
];

/** A synced LFO's frequency: the division's cycle length at this tempo. */
export function lfoSyncedHz(division: number, bpm: number): number {
  const i = clamp(Math.round(Number(division) || 0), 0, LFO_SYNC_DIVISIONS.length - 1);
  return (Number(bpm) || 120) / 60 / LFO_SYNC_DIVISIONS[i].beats;
}

interface LfoState {
  phase: number;
  /** The jitter layer: an offset easing toward a per-cycle random target. */
  drift: number;
  driftTarget: number;
  /** Last output, for the smooth (slew) filter; null until the first tick. */
  out: number | null;
}

/* ── preview helpers — the wave the settings page draws ───────────────── */

/** A preview's own noise — deterministic, so the picture holds still. */
const previewNoise = (i: number, salt = 0) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

/**
 * The engine's one-pole slew, run over a preview's samples as if the whole
 * picture lasted one second — so the Smooth axis rounds the drawing the way
 * it rounds the signal.
 */
function previewSlew(values: number[], smooth: number): number[] {
  const s = clamp01(smooth);
  if (s <= 0 || values.length < 2) return values;
  const k = 1 - Math.exp(-(1 / values.length) / (s * s * 0.4 + 1e-6));
  let out = values[0];
  return values.map((v, i) => (i === 0 ? out : (out = out + (v - out) * k)));
}

/**
 * The LFO: a width-skewed triangle (0.5 symmetric, toward 0/1 a saw either
 * way), phase-offset, with jitter (a random offset renewed each cycle) and
 * smooth (a slew that rounds corners toward sine and softens jitter steps).
 */
export const LFO_DEF: ModTypeDef = {
  type: 'lfo',
  label: 'LFO',
  defaults: { rate: 1, division: 4, phase: 0, width: 0.5, jitter: 0, smooth: 0, sync: false },
  controls: [
    { type: 'slider', path: 'rate', label: 'Rate', min: 0.02, max: 20, step: 0.01, unit: 'Hz', scope: true },
    { type: 'toggle', path: 'sync', label: 'Sync' },
    { type: 'slider', path: 'phase', label: 'Phase', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'width', label: 'Width', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'jitter', label: 'Jitter', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'smooth', label: 'Smooth', min: 0, max: 1, step: 0.01 },
  ],
  createState: (): LfoState => ({ phase: 0, drift: 0, driftTarget: 0, out: null }),
  tick(state, params, dt, bpm) {
    const s = state as LfoState;
    const hz = params.sync
      ? lfoSyncedHz(Number(params.division) || 0, bpm)
      : Math.max(0, Number(params.rate) || 0);

    const before = s.phase;
    s.phase = (s.phase + dt * hz) % 1;
    // A wrapped cycle draws the next jitter target; drift eases toward it
    // over about a quarter cycle, so jitter reads as wobble, not steps.
    if (s.phase < before) s.driftTarget = (Math.random() * 2 - 1) * clamp01(params.jitter);
    if (!clamp01(params.jitter)) { s.drift = 0; s.driftTarget = 0; }
    else s.drift += (s.driftTarget - s.drift) * Math.min(1, dt * hz * 4);

    const w = clamp(Number(params.width) || 0, 0.01, 0.99);
    const ph = (s.phase + clamp01(params.phase)) % 1;
    const tri = ph < w ? ph / w : 1 - (ph - w) / (1 - w);
    let v = clamp(tri * 2 - 1 + s.drift, -1, 1);

    const smooth = clamp01(params.smooth);
    if (smooth > 0 && s.out !== null) {
      // One-pole slew; tau grows with the square so the low half stays subtle.
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
    const jitter = clamp01(params.jitter);
    const wobble = Math.max(2, Math.round(n / 8));
    const raw = Array.from({ length: n }, (_, i) => {
      const ph = ((i / (n - 1)) * 2 + clamp01(params.phase)) % 1;
      const tri = ph < w ? ph / w : 1 - (ph - w) / (1 - w);
      const drift = previewNoise(Math.floor(i / wobble)) * jitter * 0.5;
      return clamp(tri * 2 - 1 + drift, -1, 1);
    });
    const shape = clamp01(params.smooth) > 0.55 ? 'Sine' : w <= 0.25 ? 'Saw' : w >= 0.75 ? 'Ramp' : 'Tri';
    return {
      points: previewSlew(raw, clamp01(params.smooth)).map((v) => (v + 1) / 2),
      label: jitter > 0.4 ? `${shape} · Jitter` : shape,
    };
  },
};

registerModType(LFO_DEF);

/* ── S&H — stepped random, the second built-in type ───────────────────── */

interface ShState {
  /** Seconds left on the current hold; expiring draws the next sample. */
  wait: number;
  /** The held random value, -1..1 before depth. */
  held: number;
  /** Last output, for the smooth (slew) filter; null until the first tick. */
  out: number | null;
}

/**
 * Sample & hold: a new random value at every rate tick, held until the
 * next. Depth scales the throw, offset biases the whole signal, jitter
 * randomizes each hold's length (drunken clock), and smooth is the same
 * slew as the LFO's — at 0 hard steps, up high a wandering drift.
 */
export const SH_DEF: ModTypeDef = {
  type: 'sh',
  label: 'S&H',
  defaults: { rate: 4, depth: 1, offset: 0, jitter: 0, smooth: 0 },
  controls: [
    { type: 'slider', path: 'rate', label: 'Rate', min: 0.1, max: 30, step: 0.01, unit: 'Hz', scope: true },
    { type: 'slider', path: 'depth', label: 'Depth', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'offset', label: 'Offset', min: -1, max: 1, step: 0.01 },
    { type: 'slider', path: 'jitter', label: 'Jitter', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'smooth', label: 'Smooth', min: 0, max: 1, step: 0.01 },
  ],
  createState: (): ShState => ({ wait: 0, held: 0, out: null }),
  tick(state, params, dt) {
    const s = state as ShState;
    s.wait -= dt;
    if (s.out === null || s.wait <= 0) {
      s.held = Math.random() * 2 - 1;
      // Jitter stretches or shrinks each hold at random, up to ±90%.
      const hz = Math.max(0.01, Number(params.rate) || 0);
      const len = (1 / hz) * (1 + (Math.random() * 2 - 1) * clamp01(params.jitter) * 0.9);
      s.wait = Math.max(0.005, len);
    }

    const offset = clamp(Number(params.offset) || 0, -1, 1);
    let v = clamp(s.held * clamp01(params.depth) + offset, -1, 1);

    const smooth = clamp01(params.smooth);
    if (smooth > 0 && s.out !== null) {
      // One-pole slew; tau grows with the square so the low half stays subtle.
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
    const depth = clamp01(params.depth);
    const offset = clamp(Number(params.offset) || 0, -1, 1);
    const jitter = clamp01(params.jitter);
    const steps = 8;
    const lens = Array.from({ length: steps }, (_, i) => 1 + previewNoise(i, 1) * jitter * 0.9);
    const total = lens.reduce((a, b) => a + b, 0);
    const edges: number[] = [];
    let acc = 0;
    for (const len of lens) edges.push((acc += len / total));
    const raw = Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      const step = edges.findIndex((e) => t <= e);
      return clamp(previewNoise(step < 0 ? steps - 1 : step) * depth + offset, -1, 1);
    });
    return {
      points: previewSlew(raw, clamp01(params.smooth)).map((v) => (v + 1) / 2),
      label: clamp01(params.smooth) > 0.55 ? 'Drift' : 'Steps',
    };
  },
};

registerModType(SH_DEF);

/* ── ADSR — the shaped envelope, the third built-in type ──────────────── */

type AdsrStage = 'idle' | 'attack' | 'decay' | 'sustain' | 'release';

interface AdsrState {
  stage: AdsrStage;
  /** Seconds into the current stage. */
  t: number;
  /** The level the stage started from — a retrigger ramps from where it is. */
  from: number;
  /** The signal, 0..1. */
  env: number;
  /** Gate held (note on). Loop mode runs without one. */
  gate: boolean;
}

const secs = (ms: unknown) => Math.max(0, Number(ms) || 0) / 1000;

/** Each timed stage's dial span in ms — the picture normalises against it. */
export const ADSR_STAGE_MAX = { attack: 2000, decay: 2000, release: 4000 } as const;

/** The stages whose ramps can bend — sustain is a level, not a ramp. */
export const ENV_BEND_STAGES: readonly EnvStage[] = ['attack', 'decay', 'release'];

/** A bendable stage's curve param name (`attackCurve`, ...). */
export const envCurveParam = (stage: EnvStage) => `${stage}Curve`;

/**
 * A stage ramp's shape, bent by its curve: 0 is a straight line, positive
 * leaps off the mark and tapers into the target (+0.5 is the analog ease
 * the attack has always had), negative creeps first and arrives in a rush.
 * One number per stage, -1..1, mapped onto the ramp's exponent.
 */
const adsrShape = (p: number, curve: unknown) => {
  const c = clamp(Number(curve) || 0, -1, 1);
  return 1 - Math.pow(1 - p, Math.pow(4, c));
};

/**
 * The whole envelope as one drawing: `count` samples, each 0..1, across a
 * single display that spans the four stage columns. Each timed stage takes
 * a share of the width proportional to its own dial (floored so an instant
 * stage still shows its edge, capped so the sustain hold never vanishes),
 * and the sustain level runs flat through whatever width remains — turn any
 * dial and its part of the picture stretches or falls in place.
 */
export function envelopePoints(params: ModulationParams, count: number): number[] {
  const n = Math.max(2, count);
  const sustain = clamp01(params.sustain);
  const share = (key: keyof typeof ADSR_STAGE_MAX) =>
    0.04 + 0.24 * Math.min(1, (secs(params[key]) * 1000) / ADSR_STAGE_MAX[key]);
  const wA = share('attack');
  const wD = share('decay');
  const wR = share('release');
  const at = (t: number): number => {
    if (t < wA) return adsrShape(t / wA, params.attackCurve);
    if (t < wA + wD) return 1 - (1 - sustain) * adsrShape((t - wA) / wD, params.decayCurve);
    if (t < 1 - wR) return sustain;
    return sustain * (1 - adsrShape((t - (1 - wR)) / wR, params.releaseCurve));
  };
  return Array.from({ length: n }, (_, i) => at(i / (n - 1)));
}

/**
 * Where the envelope's three joints sit in the picture, 0..1 both ways:
 * the attack's peak, the decay's landing on the sustain level, and the
 * sustain's edge into the release — the handles the design pins there.
 */
export function envelopeJoints(
  params: ModulationParams
): { stage: EnvStage; x: number; y: number }[] {
  const sustain = clamp01(params.sustain);
  const share = (key: keyof typeof ADSR_STAGE_MAX) =>
    0.04 + 0.24 * Math.min(1, (secs(params[key]) * 1000) / ADSR_STAGE_MAX[key]);
  const wA = share('attack');
  return [
    { stage: 'attack', x: wA, y: 1 },
    { stage: 'decay', x: wA + share('decay'), y: sustain },
    { stage: 'release', x: 1 - share('release'), y: sustain },
  ];
}

/** A stage's length in seconds; a held sustain never ends on its own. */
function adsrStageLength(stage: AdsrStage, params: ModulationParams): number {
  if (stage === 'attack') return secs(params.attack);
  if (stage === 'decay') return secs(params.decay);
  if (stage === 'release') return secs(params.release);
  return Infinity;
}

/**
 * The ADSR: attack up to full, decay down to the sustain level, sustain
 * held while the gate is on, release back to rest. The signal is unipolar
 * 0..1 — at rest the control sits on its base value, and the envelope
 * lifts it up to `amount` of the span.
 *
 * A gate drives it — `ModulationStore.gate(slot, on)`, from a note, a pad,
 * a hardware step — and a fresh slot rests at zero until the host sends
 * one. That is the shape an app integrates against; a DSP app whose own
 * envelope already runs at audio rate points the slot at a source instead
 * and the kit just shows the signal.
 *
 * Loop is the exception, for demos and for prototyping with no host: with
 * it on the envelope plays its own gate, running attack → decay → release
 * over and over.
 */
export const ADSR_DEF: ModTypeDef = {
  type: 'adsr',
  label: 'ADSR',
  defaults: {
    attack: 10, decay: 300, sustain: 0.6, release: 600, loop: false,
    // The attack keeps its analog leap; decay and release start straight,
    // as the design draws them — every ramp bendable from its pad.
    attackCurve: 0.5, decayCurve: 0, releaseCurve: 0,
  },
  controls: [
    { type: 'slider', path: 'attack', label: 'Attack', min: 0, max: ADSR_STAGE_MAX.attack, step: 1, unit: 'ms', envStage: 'attack' },
    { type: 'slider', path: 'decay', label: 'Decay', min: 0, max: ADSR_STAGE_MAX.decay, step: 1, unit: 'ms', envStage: 'decay' },
    { type: 'slider', path: 'sustain', label: 'Sustain', min: 0, max: 1, step: 0.01, envStage: 'sustain' },
    { type: 'slider', path: 'release', label: 'Release', min: 0, max: ADSR_STAGE_MAX.release, step: 1, unit: 'ms', envStage: 'release' },
    /* A big slot of its own, beside the envelope — the pad row under the
       ramps belongs to the hold-to-bend gesture. */
    { type: 'toggle', path: 'loop', label: 'Loop', big: true },
  ],
  createState: (): AdsrState => ({ stage: 'idle', t: 0, from: 0, env: 0, gate: false }),
  gate(state, on) {
    const s = state as AdsrState;
    s.gate = on;
    if (on) {
      s.stage = 'attack';
      s.t = 0;
      s.from = s.env;                         // a retrigger climbs from here
    } else if (s.stage !== 'idle') {
      s.stage = 'release';
      s.t = 0;
      s.from = s.env;
    }
  },
  tick(state, params, dt) {
    const s = state as AdsrState;
    const loop = !!params.loop;
    const sustain = clamp01(params.sustain);

    if (s.stage === 'idle') {
      if (!loop) return (s.env = 0);
      s.stage = 'attack';                     // loop mode gates itself
      s.t = 0;
      s.from = 0;
    }

    s.t += dt;
    // Each stage hands its overflow to the next, so a stage shorter than a
    // frame still passes through instead of holding the envelope up.
    for (let guard = 0; guard < 4; guard++) {
      const len = adsrStageLength(s.stage, params);
      if (s.t < len) break;
      s.t -= len;
      if (s.stage === 'attack') {
        s.stage = 'decay';
        s.from = 1;
      } else if (s.stage === 'decay') {
        // The gate holds the sustain; without one, decay falls straight on
        // into the release — an AD shape, and the loop's whole cycle.
        s.stage = s.gate ? 'sustain' : 'release';
        s.from = sustain;
      } else {
        s.stage = loop ? 'attack' : 'idle';   // release ended
        s.from = 0;
      }
    }

    // Each ramp bends by its own curve param, so the signal IS the shape
    // the display draws — bend the picture and the modulation follows.
    const len = adsrStageLength(s.stage, params);
    const p = len > 0 && Number.isFinite(len) ? Math.min(1, s.t / len) : 1;
    if (s.stage === 'attack') s.env = s.from + (1 - s.from) * adsrShape(p, params.attackCurve);
    else if (s.stage === 'decay') s.env = s.from + (sustain - s.from) * adsrShape(p, params.decayCurve);
    else if (s.stage === 'sustain') s.env = sustain;
    else if (s.stage === 'release') s.env = s.from * (1 - adsrShape(p, params.releaseCurve));
    else s.env = 0;
    return clamp01(s.env);
  },
};

registerModType(ADSR_DEF);
/* ── Curve — the composer's own shapes, as a modulator ────────────────── */

/**
 * The curve modulator plays a composition from the Curve Composer: a series
 * of clips, each an eased or springy walk, read once per pass. The page is
 * the composer laid onto the Move — the arrows walk the clips, Delete drops
 * the selected one, and the shape dials edit whichever clip is selected, so
 * one page sculpts a whole series without ever leaving the hardware.
 *
 * The composition lives in the slot's params (`clips`), so it persists with
 * everything else; the shape dials are a live projection of the selected
 * clip, kept in step by `normalize`.
 */

/** How many clips one pass may hold — one per shape dial's worth of patience. */
export const CURVE_MAX_CLIPS = 8;
/** A pass lasts between these, in seconds. */
export const CURVE_MIN_DURATION = 0.05;
export const CURVE_MAX_DURATION = 60;
/** A fired trigger decays over this many seconds — a pulse, not a step. */
const CURVE_PULSE_DECAY = 0.04;
/** The band the preview maps onto 0..1, so a spring's overshoot still shows. */
const CURVE_PREVIEW_BAND = { lo: -0.25, hi: 1.25 };

const DIRECTIONS: DriverDirection[] = ['forward', 'mirror', 'reverse'];

/** What each curve in the vocabulary is called on the two small screens. */
export const CURVE_LABELS: Record<CurveType, string> = {
  linear: 'Linear',
  easeIn: 'Ease In',
  easeOut: 'Ease Out',
  easeInOut: 'Ease InOut',
  spring: 'Spring',
};

/** The shape dials — the four that edit the selected clip, not the pass. */
const SHAPE_PARAMS = ['curvature', 'steepness', 'anticipate', 'overshoot'] as const;

const newClip = (): CurveSegment => ({
  type: 'easeInOut', weight: 1, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0,
});

/** The stored clip series — always at least one, cloned for safe editing. */
function readClips(params: ModulationParams): CurveSegment[] {
  const raw = Array.isArray(params.clips) ? (params.clips as unknown as CurveSegment[]) : [];
  const list = raw.filter((c) => c && typeof c === 'object').map((c) => ({ ...newClip(), ...c }));
  return list.length ? list.slice(0, CURVE_MAX_CLIPS) : [newClip()];
}

const writeClips = (list: CurveSegment[]) => list as unknown as ModulationParamValue;

/** Which clip the arrows landed on, always inside the series. */
const selectedClip = (params: ModulationParams, count: number) =>
  clamp(Math.round(Number(params.selected) || 0), 0, Math.max(0, count - 1));

/** The slot's params read as a composition the composer core can play. */
export function curveComposition(params: ModulationParams): CurveComposition {
  const i = DIRECTIONS.indexOf(params.direction as DriverDirection);
  return {
    segments: readClips(params),
    driver: null,
    direction: DIRECTIONS[i < 0 ? 0 : i],
    gap: clamp01(params.gap),
  };
}

/**
 * One pass in seconds. Synced, the dial's duration snaps to the nearest
 * tempo division, so a pass locks to the Move's clock without a second dial.
 */
export function curveDuration(params: ModulationParams, bpm: number): number {
  const want = clamp(Number(params.duration) || 0, CURVE_MIN_DURATION, CURVE_MAX_DURATION);
  if (!params.sync) return want;
  const beat = 60 / (Number(bpm) || 120);
  let best = LFO_SYNC_DIVISIONS[0].beats * beat;
  for (const div of LFO_SYNC_DIVISIONS) {
    const secs = div.beats * beat;
    if (Math.abs(secs - want) < Math.abs(best - want)) best = secs;
  }
  return Math.max(CURVE_MIN_DURATION, best);
}

interface CurveState {
  phase: number;
  /** Samplers, rebuilt only when the clips or the gap actually change. */
  signature: string;
  samplers: CompositionSamplers | null;
  /** Last composed value, for trigger crossings; null until the first tick. */
  prev: number | null;
  /** Trigger mode's decaying pulse. */
  pulse: number;
}

export const CURVE_DEF: ModTypeDef = {
  type: 'curve',
  label: 'Curve',
  defaults: {
    duration: 2, sync: false, signal: 'continuous', triggers: DEFAULT_TRIGGER_STEPS,
    direction: 'forward', flip: false, gap: 0, segments: 1, selected: 0,
    curvature: 0, steepness: 0, anticipate: 0, overshoot: 0,
    clips: writeClips([newClip()]),
  },
  controls: [
    /* The selected clip's shape: the knob leans its energy one way or the
       other, the volume knob makes the ease gentle or explosive — the same
       two-axis drag the composer answers to on screen. A knob tap cycles
       the clip through the curve vocabulary. */
    {
      type: 'xy', path: 'curve', label: 'Curve',
      xParam: 'curvature', yParam: 'steepness',
      xAxis: { min: -1, max: 1, bipolar: true, label: 'Energy' },
      yAxis: { min: -1, max: 1, bipolar: true, label: 'Steep' },
      drawsPreview: true,
      cycle: (params) => {
        const comp = curveComposition(params);
        const i = selectedClip(params, comp.segments.length);
        return { clips: writeClips(cycleSegmentType(comp, i).segments) };
      },
    },
    { type: 'slider', path: 'duration', label: 'Duration', min: CURVE_MIN_DURATION, max: CURVE_MAX_DURATION, step: 0.01, unit: 's' },
    { type: 'toggle', path: 'sync', label: 'Sync' },
    {
      type: 'select', path: 'signal', label: 'Signal', chip: true,
      options: [{ value: 'continuous', label: 'Cont' }, { value: 'trigger', label: 'Trig' }],
    },
    /* The direction reads as a picture — an arrow says which way the pass
       runs faster than a word does. */
    {
      type: 'select', path: 'direction', label: 'Direction',
      options: [
        { value: 'forward', label: 'Forward', icon: 'arrow-right' },
        { value: 'mirror', label: 'Mirror', icon: 'arrow-left-right' },
        { value: 'reverse', label: 'Reverse', icon: 'arrow-left' },
      ],
    },
    { type: 'toggle', path: 'flip', label: 'Flip' },
    /* The trigger count only means anything in trigger mode, so the chip
       only appears there — the column stays clear the rest of the time. */
    {
      type: 'slider', path: 'triggers', label: 'Triggers', chip: true,
      min: 2, max: 16, step: 1,
      when: (params) => params.signal === 'trigger',
    },
    { type: 'slider', path: 'gap', label: 'Gap', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'anticipate', label: 'Anticipate', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'overshoot', label: 'Overshoot', min: 0, max: 1, step: 0.01 },
    { type: 'slider', path: 'segments', label: 'Segments', min: 1, max: CURVE_MAX_CLIPS, step: 1 },
  ],
  createState: (): CurveState => ({ phase: 0, signature: '', samplers: null, prev: null, pulse: 0 }),
  tick(state, params, dt, bpm) {
    const s = state as CurveState;
    const comp = curveComposition(params);
    // Springs integrate 72 steps to build a sampler, so rebuild only when
    // the shape behind them actually moved.
    const signature = JSON.stringify(comp.segments) + `|${comp.gap}`;
    if (signature !== s.signature || !s.samplers) {
      s.signature = signature;
      s.samplers = buildSamplers(comp);
    }
    s.phase = (s.phase + dt / curveDuration(params, bpm)) % 1;

    let v = clamp01(readComposition(comp, s.phase, s.samplers).value);
    if (params.flip) v = 1 - v;                 // the pass falls instead of rising

    if (params.signal !== 'trigger') {
      s.prev = v;
      return v * 2 - 1;                         // bipolar: the curve sweeps around the base
    }
    // Trigger: every level the value crosses fires a pulse that decays away,
    // so a non-linear curve fires unevenly in time — the pacing is the point.
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
    const changed = (key: string) => key in patch && patch[key] !== current[key];

    let list = 'clips' in patch ? readClips(patch) : readClips(current);
    if (!('clips' in patch) && changed('segments')) {
      // The count dial adds clips at the end and drops them from the end,
      // then re-divides the pass evenly — the composer's own split rule.
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
        anticipate: clamp01(next.anticipate),
        overshoot: clamp01(next.overshoot),
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
    },
  },
  phase: (state) => (state as CurveState).phase,
  preview(params, count) {
    const list = readClips(params);
    const sel = selectedClip(params, list.length);
    const sampler = buildSampler(list[sel]);
    const span = CURVE_PREVIEW_BAND.hi - CURVE_PREVIEW_BAND.lo;
    const n = Math.max(2, count);
    return {
      points: Array.from({ length: n }, (_, i) =>
        clamp01((sampler(i / (n - 1)) - CURVE_PREVIEW_BAND.lo) / span)),
      label: `${CURVE_LABELS[list[sel].type]} ${sel + 1}/${list.length}`,
    };
  },
};

registerModType(CURVE_DEF);
