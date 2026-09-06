import { ModulationSlot, ModulationType, ModulationParams, ModulationAssignment, ModPageLayout } from './modulation-core.js';
import './TweakStore-ChWM8M9D.js';
import './range-slider-core.js';
import './curve-composer-core.js';

/**
 * The modulation layer's runtime — a singleton beside the TweakStore.
 *
 * It owns the 16 slots, the control assignments, and the engine: one
 * self-halting requestAnimationFrame loop (the TimelineStore's pattern)
 * that advances every internal modulator and mirrors every external
 * source once per frame. Modulated values NEVER enter the TweakStore —
 * consumers pull them at frame time:
 *
 *   const speed = ModulationStore.getValue('fx', 'blob.speed');   // one path
 *   const params = ModulationStore.getValues('fx');               // whole panel
 *
 * Both return the stored base values with the live modulation applied on
 * top, clamped to each control's own bounds. Reading per frame is the
 * contract — nothing is pushed, so frame ordering stays in the app's hands.
 *
 * DSP apps whose modulators live on the audio side register them instead:
 *
 *   ModulationStore.registerSource('lfo-1', { sample: () => native.lfo1 });
 *   // or push at any rate: ModulationStore.setSourceValue('lfo-1', v);
 *
 * A slot pointing at a source shows its signal (circle, dots, step light)
 * but applies nothing to values unless the source says `applies: true` —
 * the app's own engine already did, at audio rate.
 *
 * The assignment gesture: touching a control (`noteTouch`, wired into the
 * panel and the bridge kit) arms it for a few seconds; a step-button press
 * (`assignFromStep`) then creates the slot's modulation if needed and
 * toggles the control onto it.
 *
 * Slots and assignments persist to localStorage (fail-soft, like panel
 * values), so a prototype's modulation setup survives a reload.
 */
/** A touched control stays armed for assignment this long. */
declare const MOD_TOUCH_GRACE_MS = 4000;
interface ModulationSourceConfig {
    /** Pulled once per frame by the engine; omit it to push with `setSourceValue`. */
    sample?: (slot: ModulationSlot) => number;
    /**
     * When true the library applies this source's signal to assigned values.
     * DSP apps that modulate on their own side leave it false (display only).
     */
    applies?: boolean;
}
type ModStepAction = 'created' | 'assigned' | 'unassigned' | 'none';
type Listener = () => void;
declare class ModulationStoreClass {
    private slots;
    private assignments;
    private states;
    private signals;
    private sources;
    private sourceValues;
    private metas;
    private bpm;
    private touched;
    private settingsIndex;
    private settingsUnsub;
    /** The control set the open page was built from — see `shapeOf`. */
    private settingsShape;
    private applyingSettings;
    private structListeners;
    private frameListeners;
    private version;
    private rafId;
    private lastTick;
    constructor();
    /** Create a modulation in a step's slot; an occupied slot is returned as-is. */
    createSlot(index: number, type?: ModulationType): ModulationSlot | null;
    getSlot(index: number): ModulationSlot | null;
    /** The occupied slots, index order — the track row's circles. */
    getSlots(): ModulationSlot[];
    /**
     * Change a slot's settings. A modulator with its own structure folds the
     * patch in its own way (`normalize`) — the curve writes a shape dial into
     * the clip it belongs to — and the open settings page follows.
     */
    updateSlotParams(index: number, patch: ModulationParams): void;
    /** Switch a slot's modulator type — fresh defaults, fresh state. */
    setSlotType(index: number, type: ModulationType): void;
    /** Point a slot at an external source (null returns it to the engine). */
    setSlotSource(index: number, sourceId: string | null): void;
    /** Remove a slot's modulation and every assignment wired to it. */
    removeSlot(index: number): void;
    /**
     * Wire a control to a slot. Only bounded numeric controls (slider, number
     * with min/max) can be modulated; anything else is refused. A control not
     * yet registered is accepted on trust and resolves when its panel appears.
     */
    assign(panelId: string, path: string, slot: number, amount?: number): boolean;
    unassign(panelId: string, path: string): void;
    getAssignment(panelId: string, path: string): ModulationAssignment | undefined;
    getAssignments(): ModulationAssignment[];
    assignmentsForSlot(index: number): ModulationAssignment[];
    setAmount(panelId: string, path: string, amount: number): void;
    /** A finger on a control — panel pointer, hardware knob. Arms assignment. */
    noteTouch(panelId: string, path: string): void;
    /**
     * A step-button press (hardware step or on-screen circle): with a control
     * armed, create the slot's modulation if needed and toggle the control
     * onto it. Returns what happened, for lights and readouts.
     */
    assignFromStep(index: number): {
        action: ModStepAction;
        slot: ModulationSlot | null;
    };
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
    gate(index: number, on: boolean): void;
    /**
     * Open a slot's settings (hold its step button): registers one hidden
     * TweakStore panel (`mod-settings`, kind 'modulation') built from the
     * modulator's own control list, with the type enum ahead of it. Every
     * edit on that panel — screen or hardware, the kit syncs it like any
     * page — flows back into the slot's params. Returns the panel id.
     */
    openSettings(index: number): string | null;
    closeSettings(): void;
    /** The open settings page, or null — the panel to render as the Move page. */
    getSettings(): {
        index: number;
        panelId: string;
    } | null;
    /**
     * Where the open page's controls sit — the eight dial slots and the small
     * slots under them. Both surfaces lay the page out from this one list, so
     * they never disagree about which knob a pad belongs to.
     */
    getSettingsLayout(): ModPageLayout | null;
    /** The open page's curve, sampled 0..1, and its name — the preview dial. */
    getSettingsPreview(count?: number): {
        points: number[];
        label: string;
    } | null;
    /** Hardware buttons the open page claims (the curve's arrows and Delete). */
    getSettingsButtons(): string[];
    /** Run a claimed button. False when the page does not claim that name. */
    pressSettingsButton(name: string): boolean;
    /** A knob tap on a page dial that cycles (the curve's clip vocabulary). */
    tapSettingsControl(path: string): boolean;
    private registerSettingsPanel;
    /** A settings-panel edit — screen or hardware — lands in the slot's params. */
    private onSettingsChange;
    /**
     * The open page, after the params moved under it. A change that alters
     * which controls the page shows (the curve's trigger chip appearing) or
     * what they read (an arrow selecting another clip) has to reach the panel
     * — hardware edits arrive there, and the screen renders from it.
     */
    private refreshSettings;
    /** Which controls the page is built from — a rebuild when this changes. */
    private shapeOf;
    /** Offer an app-side modulator to the slots; returns an unregister fn. */
    registerSource(id: string, config?: ModulationSourceConfig): () => void;
    /** Push a source's signal (-1..1) at any rate; the engine mirrors the latest. */
    setSourceValue(id: string, value: number): void;
    getSources(): string[];
    setTempo(bpm: number): void;
    getTempo(): number;
    /** A slot's live signal, -1..1. */
    getSignal(index: number): number;
    /** Where a slot sits in its cycle, 0..1 — a curve composer's playhead. */
    getSlotPhase(index: number): number;
    /** The modulation's contribution to one control, in the control's units. */
    getOffset(panelId: string, path: string): number;
    /**
     * A modulatable control's bounds, or null when it has none (or its panel
     * has not registered yet) — what a display needs to draw the modulation
     * against the control's own span.
     */
    getBounds(panelId: string, path: string): {
        min: number;
        max: number;
    } | null;
    /** One control's value with its modulation applied — the frame-time read. */
    getValue(panelId: string, path: string): number;
    /**
     * A panel's values with every modulation applied — a fresh snapshot per
     * call, meant to be pulled once per frame in place of `TweakStore.getValues`.
     */
    getValues(panelId: string): Record<string, unknown>;
    /** Structural changes: slots, assignments, sources, tempo. */
    subscribe(listener: Listener): () => void;
    /** Every engine frame — for pulsing circles, dots, and step lights. */
    subscribeFrames(listener: Listener): () => void;
    /** Bumped on every structural change — a stable snapshot for UI stores. */
    getVersion(): number;
    /**
     * Advance every slot by `dt` seconds and refresh the signals. The RAF
     * loop calls this per frame; headless hosts and tests may drive it
     * directly with their own clock.
     */
    tick(dt: number): void;
    /** Wipe every slot, assignment, and the persisted shelf. */
    clear(): void;
    private ensureLoop;
    private loop;
    private resolveMeta;
    private changed;
}
declare const ModulationStore: ModulationStoreClass;

export { MOD_TOUCH_GRACE_MS, type ModStepAction, type ModulationSourceConfig, ModulationStore };
