import { C as ControlMeta } from './TweakStore-BUrrkY5L.js';
import { CurveType, CurveComposition } from './curve-composer-core.js';
import './range-slider-core.js';

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
declare const MOD_SLOTS = 16;
/**
 * The modulation palette, one colour per slot — sixteen hues around the
 * wheel, tuned to sit with the Move's track colours on the dark panel.
 */
declare const MOD_COLORS: string[];
/** A slot's palette colour — the one constant identity it keeps. */
declare const modColor: (index: number) => string;
type ModulationType = 'lfo' | 'adsr' | 'envelope' | 'curve' | 'sh' | 'sequencer';
/** The envelope's four stages — the four columns of its picture. */
type EnvStage = 'attack' | 'decay' | 'sustain' | 'release';
/**
 * A settings value: the scalars a dial or a pad edits, plus the structures a
 * richer modulator carries (the curve's clip list). JSON-safe throughout, so
 * a slot's whole setup still rides the persistence shelf as it is.
 */
type ModulationParamValue = number | boolean | string | ModulationParamValue[] | {
    [key: string]: ModulationParamValue;
};
/** Modulator settings — JSON-safe, like TweakStore values. */
type ModulationParams = Record<string, ModulationParamValue>;
interface ModulationSlot {
    /** 0..15 — the Move step button that created it, and its palette index. */
    index: number;
    type: ModulationType;
    params: ModulationParams;
    /** External source id (a DSP app's own modulator); null = internal engine. */
    source?: string | null;
}
interface ModulationAssignment {
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
type ModControlMeta = ControlMeta & {
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
interface ModTypeDef {
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
    preview?(params: ModulationParams, count: number): {
        points: number[];
        label: string;
    };
    /** Where the modulator sits in its cycle, 0..1 — a composer's playhead. */
    phase?(state: unknown): number;
    /**
     * Note on / note off, for the types that take a gate (the ADSR). The
     * store's `gate(slot, on)` lands here; free-running types (LFO, S&H)
     * leave it out and the store ignores the call.
     */
    gate?(state: unknown, on: boolean): void;
}
/** One control's place on the Move page, with the gestures it answers to. */
interface ModPageSlot {
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
interface ModPageLayout {
    dials: ModPageSlot[];
    toggles: (ModPageSlot | null)[];
    values: (ModPageSlot | null)[];
}
declare const MOD_PAGE_DIALS = 8;
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
declare function modPageLayout(controls: ModControlMeta[], params?: ModulationParams): ModPageLayout;
/** The controls a page actually shows — the mode-specific ones filtered out. */
declare const visibleModControls: (def: ModTypeDef, params: ModulationParams) => ModControlMeta[];
/** Plug a modulator type in; registering a type again replaces it. */
declare function registerModType(def: ModTypeDef): void;
declare const getModType: (type: ModulationType) => ModTypeDef | undefined;
/** The registered types, registration order — the settings page's type enum. */
declare const listModTypes: () => ModTypeDef[];
/**
 * Every settings page's width in dial slots: the type picker plus the
 * widest registered page. One number for all types, so switching the type
 * never reflows the page — the control under your finger stays where it is.
 */
declare const modPageWidth: () => number;
/** The one modulator-settings panel, registered by `ModulationStore.openSettings`. */
declare const MOD_SETTINGS_PANEL = "mod-settings";
/** Assignment map key — panel and path, joined on a character paths can't hold. */
declare const modKey: (panelId: string, path: string) => string;
/**
 * A signal applied to a control: a bipolar sweep around the base value in
 * the control's own units, clamped to its bounds — the control keeps its
 * base, the modulation dances around it.
 */
declare function applyModulation(base: number, signal: number, amount: number, min: number, max: number): number;
/**
 * The ring a modulated control wears: a dial drawn as an SVG circle of this
 * radius, sweeping a knob's 270° from the bottom-left so a value sits at the
 * angle the control's own dial would point.
 */
declare const MOD_RING_RADIUS = 6;
declare const MOD_RING_CIRCUMFERENCE: number;
/**
 * The arc between two values (each 0..1 of the control's span), as the dash
 * pattern that draws it: SVG lays a circle's path clockwise from 3 o'clock,
 * so a dash of `length` pushed to `offset` lands exactly on the arc.
 * Feed it base and modulated value and the ring shows where the modulation
 * is holding the control right now.
 */
declare function modRingArc(from01: number, to01: number): {
    length: number;
    offset: number;
};
/** Tempo-sync divisions, cycle length in beats (4/4 bars down to 1/32). */
declare const LFO_SYNC_DIVISIONS: {
    label: string;
    beats: number;
}[];
/** A synced LFO's frequency: the division's cycle length at this tempo. */
declare function lfoSyncedHz(division: number, bpm: number): number;
/**
 * The LFO: a width-skewed triangle (0.5 symmetric, toward 0/1 a saw either
 * way), phase-offset, with jitter (a random offset renewed each cycle) and
 * smooth (a slew that rounds corners toward sine and softens jitter steps).
 */
declare const LFO_DEF: ModTypeDef;
/**
 * Sample & hold: a new random value at every rate tick, held until the
 * next. Depth scales the throw, offset biases the whole signal, jitter
 * randomizes each hold's length (drunken clock), and smooth is the same
 * slew as the LFO's — at 0 hard steps, up high a wandering drift.
 */
declare const SH_DEF: ModTypeDef;
/** Each timed stage's dial span in ms — the picture normalises against it. */
declare const ADSR_STAGE_MAX: {
    readonly attack: 2000;
    readonly decay: 2000;
    readonly release: 4000;
};
/** The stages whose ramps can bend — sustain is a level, not a ramp. */
declare const ENV_BEND_STAGES: readonly EnvStage[];
/** A bendable stage's curve param name (`attackCurve`, ...). */
declare const envCurveParam: (stage: EnvStage) => string;
/**
 * The whole envelope as one drawing: `count` samples, each 0..1, across a
 * single display that spans the four stage columns. Each timed stage takes
 * a share of the width proportional to its own dial (floored so an instant
 * stage still shows its edge, capped so the sustain hold never vanishes),
 * and the sustain level runs flat through whatever width remains — turn any
 * dial and its part of the picture stretches or falls in place.
 */
declare function envelopePoints(params: ModulationParams, count: number): number[];
/**
 * Where the envelope's three joints sit in the picture, 0..1 both ways:
 * the attack's peak, the decay's landing on the sustain level, and the
 * sustain's edge into the release — the handles the design pins there.
 */
declare function envelopeJoints(params: ModulationParams): {
    stage: EnvStage;
    x: number;
    y: number;
}[];
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
declare const ADSR_DEF: ModTypeDef;
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
declare const CURVE_MAX_CLIPS = 8;
/** A pass lasts between these, in seconds. */
declare const CURVE_MIN_DURATION = 0.05;
declare const CURVE_MAX_DURATION = 60;
/** What each curve in the vocabulary is called on the two small screens. */
declare const CURVE_LABELS: Record<CurveType, string>;
/** The slot's params read as a composition the composer core can play. */
declare function curveComposition(params: ModulationParams): CurveComposition;
/**
 * One pass in seconds. Synced, the dial's duration snaps to the nearest
 * tempo division, so a pass locks to the Move's clock without a second dial.
 */
declare function curveDuration(params: ModulationParams, bpm: number): number;
declare const CURVE_DEF: ModTypeDef;

export { ADSR_DEF, ADSR_STAGE_MAX, CURVE_DEF, CURVE_LABELS, CURVE_MAX_CLIPS, CURVE_MAX_DURATION, CURVE_MIN_DURATION, ENV_BEND_STAGES, type EnvStage, LFO_DEF, LFO_SYNC_DIVISIONS, MOD_COLORS, MOD_PAGE_DIALS, MOD_RING_CIRCUMFERENCE, MOD_RING_RADIUS, MOD_SETTINGS_PANEL, MOD_SLOTS, type ModControlMeta, type ModPageLayout, type ModPageSlot, type ModTypeDef, type ModulationAssignment, type ModulationParamValue, type ModulationParams, type ModulationSlot, type ModulationType, SH_DEF, applyModulation, curveComposition, curveDuration, envCurveParam, envelopeJoints, envelopePoints, getModType, lfoSyncedHz, listModTypes, modColor, modKey, modPageLayout, modPageWidth, modRingArc, registerModType, visibleModControls };
