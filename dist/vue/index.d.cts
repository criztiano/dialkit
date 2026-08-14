import * as vue from 'vue';
import { ComputedRef, ObjectDirective, PropType, InjectionKey, Ref, h, VNode } from 'vue';

/**
 * gradient-core — DOM-free gradient math shared by every framework port of the
 * gradient editor. Pure functions only; anything touching the DOM lives in the
 * component layer. Reuses color-core for all color math (no duplication).
 *
 * Canonical value shape and invariants (enforced by normalizeGradient and
 * preserved by every helper below):
 *   - stops sorted ascending by position
 *   - positions clamped to 0–1
 *   - stop colors always 8-digit lowercase hex (#rrggbbaa) — alpha always on
 *   - angle wrapped to [0, 360)
 *   - stops.length >= MIN_STOPS
 * `angle` is kept even for radial gradients so switching type round-trips
 * without losing the value.
 */

type GradientType = 'linear' | 'radial' | 'conic';
/** color is always #rrggbbaa; position is 0–1. */
type GradientStop = {
    color: string;
    position: number;
};
type GradientValue = {
    type: GradientType;
    angle: number;
    stops: GradientStop[];
    /** Radial/conic origin as 0–100 (%). Absent = centered (50). */
    centerX?: number;
    centerY?: number;
    /** Radial horizontal radius as % of the box, 10–200. Absent = 100. */
    scale?: number;
    /** Radial vertical radius as % of the box, 1–200. Absent = matches `scale`
     *  (round). Independent of `scale`, so &lt; scale is a wide ellipse and
     *  &gt; scale is a tall one. */
    squash?: number;
    /** Radial ellipse tilt in degrees. Renders via the companion transform, since
     *  CSS radial gradients are axis-aligned. Absent = 0. */
    rotation?: number;
};
declare const MIN_STOPS = 2;
declare const DEFAULT_GRADIENT: GradientValue;
/** Ready CSS gradient string for any of the three types. #rrggbbaa is valid CSS. */
declare function gradientToCss(value: GradientValue): string;
/**
 * The color the gradient shows at `position` (0–1), as #rrggbbaa. Interpolated
 * in sRGB with premultiplied alpha so a stop seeded here equals the pixel the
 * user clicked on the ramp (OKLab would visibly mismatch the strip).
 */
declare function colorAtPosition(value: GradientValue, position: number): string;
/**
 * Fail-soft validator for store reconciliation. Anything malformed degrades
 * gracefully: bad object → default; unknown type → linear; non-finite angle →
 * default angle; invalid stops dropped; fewer than MIN_STOPS survivors → the
 * default ramp. Always returns a fresh object safe for store snapshots.
 */
declare function normalizeGradient(input: unknown): GradientValue;
/** Insert a stop at `position`, seeded with the ramp color there. */
declare function addStop(value: GradientValue, position: number): {
    value: GradientValue;
    index: number;
};
/** Reposition a stop; re-sorts (stable), so dragging past a neighbor swaps live. */
declare function moveStop(value: GradientValue, index: number, position: number): {
    value: GradientValue;
    index: number;
};
/** Remove a stop — no-op (same reference) at MIN_STOPS or out of range. */
declare function removeStop(value: GradientValue, index: number): GradientValue;
declare function setStopColor(value: GradientValue, index: number, hex: string): GradientValue;
declare function setGradientType(value: GradientValue, type: GradientType): GradientValue;
declare function setGradientAngle(value: GradientValue, angle: number): GradientValue;

type XYValue = {
    x: number;
    y: number;
};

/** A resolved range value. Invariant (upheld by the helpers): min <= max. */
type RangeValue = {
    min: number;
    max: number;
};

/**
 * One axis of an XY pad control. Partial — every field falls back through
 * `resolveAxis` (min 0, max 1, step 0.01). `origin`/`bipolar` mirror the
 * Slider's names/semantics, resolved independently per axis.
 */
type XYAxis = {
    min?: number;
    max?: number;
    step?: number;
    origin?: number;
    bipolar?: boolean;
    label?: string;
};
type SpringConfig = {
    type: 'spring';
    stiffness?: number;
    damping?: number;
    mass?: number;
    visualDuration?: number;
    bounce?: number;
};
type EasingConfig = {
    type: 'easing';
    duration: number;
    ease: [number, number, number, number];
};
type TransitionConfig = SpringConfig | EasingConfig;
type ActionConfig = {
    type: 'action';
    label?: string;
};
type SelectConfig = {
    type: 'select';
    options: (string | {
        value: string;
        label: string;
    })[];
    default?: string;
    /** 'segmented' renders the options as an inline segmented control instead of a dropdown. Suits 2–4 short options. */
    display?: 'dropdown' | 'segmented';
};
type ColorConfig = {
    type: 'color';
    default?: string;
    /** Enables the alpha slider; the emitted value becomes #rrggbbaa. Default false. */
    alpha?: boolean;
    /** Shows the shared saved-swatches row (persisted per machine). Default false. */
    palette?: boolean;
};
type GradientConfig = {
    type: 'gradient';
    default?: GradientValue;
};
type XYConfig = {
    type: 'xy';
    /** Starting point. Missing/out-of-range components clamp to each axis's origin. */
    default?: XYValue;
    /** Per-axis range/step/origin. Each resolves through `resolveAxis`. */
    x?: XYAxis;
    y?: XYAxis;
    /** Grid overlay — on by default as a 5×5 grid (faint at rest, stronger on interaction). `false` to hide, or a number for a uniform N×N count. */
    grid?: boolean | number;
    /** Multiplies both grid axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density?: number;
    /** Snap the emitted value to each axis's step (default continuous). */
    snap?: boolean;
    /** Spring the thumb back to centre on release (joystick feel). Default hold. */
    returnToCenter?: boolean;
    /** Show the live value next to each axis label (default false = label only). */
    showValues?: boolean;
};
type TextConfig = {
    type: 'text';
    default?: string;
    placeholder?: string;
};
type RangeConfig = {
    type: 'range';
    min: number;
    max: number;
    /** Falls back to the full span { min, max } when omitted. */
    default?: RangeValue;
    /** Falls back to inferStep(min, max) when omitted. */
    step?: number;
};
/**
 * Explicit slider form for what the `[default, min, max, step?]` tuple can't
 * express: a display unit, a custom value formatter, or a bipolar fill.
 */
type SliderConfig = {
    type: 'slider';
    default: number;
    min: number;
    max: number;
    /** Falls back to inferStep(min, max) when omitted. */
    step?: number;
    /** Appended to the displayed value, e.g. ' dB', ' ms', '×'. */
    unit?: string;
    /**
     * Override the displayed value text entirely; `unit` is not auto-appended.
     * A function, so it is invisible to the JSON structure diff — changing only
     * the formatter does not re-register the panel.
     */
    formatValue?: (value: number) => string;
    /** Anchor the fill at this value instead of `min` (see Slider). */
    origin?: number;
    /** Convenience for `origin: 0` on a symmetric range. */
    bipolar?: boolean;
};
/**
 * A read-only curve preview row. Draws the shape the host's own parameters
 * produce (e.g. a pitch arc from a shape select plus modifier sliders); it
 * holds no value of its own, so nothing lands in ResolvedValues, presets, or
 * persistence. `sample` is a function and therefore invisible to the
 * serialized config diff (like `formatValue`); adapters push replacements
 * through `DialStore.syncCurveConfigs` so the drawing tracks the host.
 */
type CurveConfig = {
    type: 'curve';
    /** t in [0,1] → y. Non-finite results are skipped (the stroke breaks there). */
    sample: (t: number) => number;
    /** Fixed y-range to fit. Default: auto-fit each draw with a little headroom. */
    domain?: [number, number];
    /** Vertical reference lines at these x positions in [0,1]; invalid entries are skipped. */
    markers?: readonly number[];
    /** Surface height in px, clamped to 32–160. Default 64. */
    height?: number;
    /** `false` = full-bleed row without the label line; a string overrides the key-derived label. */
    label?: false | string;
};
type FileConfig = {
    type: 'file';
    /** Native input `accept` filter, e.g. 'image/*' or '.svg,image/svg+xml'. */
    accept?: string;
    multiple?: boolean;
};
type SwatchOption = {
    value: string;
    label: string;
    /** One color renders a chip; many render a thin strip preview. */
    colors: string[];
};
type SwatchConfig = {
    type: 'swatch';
    options: SwatchOption[];
    default?: string;
};
type ChipOption = {
    value: string;
    label: string;
    /** Removable chips show an ✕ and emit a `remove` event (curated stay; saved go). */
    removable?: boolean;
};
type ChipsConfig = {
    type: 'chips';
    options: ChipOption[];
    default?: string;
};
type MultiSelectOption = {
    value: string;
    label: string;
    /** One quiet line under the label — e.g. what the option contains. */
    hint?: string;
    /** Tiny uppercase badge next to the label — e.g. 'local' / 'cloud'. */
    tag?: string;
};
/** Checkbox rows resolving to the checked values, in option order. */
type MultiSelectConfig = {
    type: 'multiselect';
    options: MultiSelectOption[];
    default?: string[];
};
type GalleryItem = {
    id: string;
    src?: string;
    alt?: string;
    /** Width / height hint used to size custom (non-image) content in the masonry. */
    aspect?: number;
    render?: () => unknown;
};
type GalleryConfig = {
    type: 'gallery';
    items: GalleryItem[];
    default?: string;
    columns?: number;
};
/**
 * One row in a list control — a chosen item type plus its sub-control values.
 * Stays JSON-serializable: `params` holds only scalars, never live objects.
 */
type ListItemValue = {
    type: string;
    params: Record<string, number | boolean | string>;
    /**
     * Row-level name, shown in place of the item type's label and renamable in
     * place. Absent (never empty) when the row has no name of its own.
     */
    title?: string;
};
/**
 * A sub-control field inside a list item type's schema. Uses the same shorthand
 * as a panel config, but scalar-only (no nested folders or non-value controls).
 */
type ListItemField = [number, number, number, number?] | number | boolean | string | SelectConfig | ColorConfig | SwatchConfig | TextConfig;
type ListItemType = {
    /** Shown in the add menu, and as a row's title when the row has none of its own. */
    label: string;
    /** Sub-controls for this item type, keyed by param name. */
    schema: Record<string, ListItemField>;
    /**
     * Help text per field, keyed by the same param name. Keyed rather than inline
     * because a schema field is often bare shorthand (`mass: [1, 0, 10]`) with
     * nowhere to hang a property.
     */
    hints?: Record<string, string>;
    /**
     * Section per field, keyed by param name, for rows too deep to read flat.
     * Ungrouped fields stay at the top of the row; each named section becomes a
     * collapsible folder below them, in the order its first field is declared.
     * Keyed for the same reason as `hints`.
     */
    groups?: Record<string, string>;
};
type ListConfig = {
    type: 'list';
    /** The palette of item types a user can add. */
    itemTypes: Record<string, ListItemType>;
    /** Initial rows. Each item's params backfill from its type's schema defaults. */
    default?: ListItemValue[];
    /** Optional cap on the number of rows. */
    max?: number;
    /** Label for the add affordance. Defaults to 'Add'. */
    addLabel?: string;
};
type DialValue = number | boolean | string | string[] | XYValue | SpringConfig | EasingConfig | ActionConfig | SelectConfig | SliderConfig | ColorConfig | GradientConfig | GradientValue | XYConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | MultiSelectConfig | ListConfig | ListItemValue[] | RangeConfig | RangeValue;
type DialConfig = {
    [key: string]: DialValue | [number, number, number, number?] | CurveConfig | DialConfig;
};
/** UI-only reserved keys: they shape the panel, never resolve to a value. */
type ReservedKey = '_collapsed' | '_collapsible' | '_tabs';
type ResolvedValues<T extends DialConfig> = {
    [K in keyof T as T[K] extends CurveConfig ? never : K extends ReservedKey ? never : K]: T[K] extends [number, number, number, number?] ? number : T[K] extends SliderConfig ? number : T[K] extends MultiSelectConfig ? string[] : T[K] extends SpringConfig ? TransitionConfig : T[K] extends EasingConfig ? TransitionConfig : T[K] extends SelectConfig ? string : T[K] extends ColorConfig ? string : T[K] extends GradientConfig ? GradientValue : T[K] extends XYConfig ? XYValue : T[K] extends TextConfig ? string : T[K] extends RangeConfig ? RangeValue : T[K] extends GalleryConfig ? string : T[K] extends FileConfig ? string : T[K] extends SwatchConfig ? string : T[K] extends ChipsConfig ? string : T[K] extends ListConfig ? ListItemValue[] : T[K] extends DialConfig ? ResolvedValues<T[K]> : T[K];
};
type ShortcutMode = 'fine' | 'normal' | 'coarse';
type ShortcutInteraction = 'scroll' | 'drag' | 'move' | 'scroll-only';
type ShortcutConfig = {
    key?: string;
    modifier?: 'alt' | 'shift' | 'meta';
    mode?: ShortcutMode;
    interaction?: ShortcutInteraction;
};
/**
 * How lit the affordance dot is. The app pushes this — dialkit owns only how
 * each state looks, never when it applies.
 */
type AffordanceStatus = 'off' | 'armed' | 'active';
/** What dialkit hands a popover so it doesn't have to resolve any of it itself. */
type AffordanceContext = {
    panelId: string;
    path: string;
    status: AffordanceStatus;
    /** Shorthand for `DialStore.setAffordanceStatus(panelId, path, …)`. */
    setStatus: (status: AffordanceStatus) => void;
};
/**
 * A companion control hung off a control's corner: a barely-there dot that opens
 * a popover the host app fills.
 *
 * `content` is a component — a React/Solid/Vue component or a Svelte snippet —
 * receiving the context as its props/argument. Not a pre-built node: it is
 * captured once at registration and would never see current state. Not called
 * directly by the renderer either, so a stateful popover keeps its own identity
 * and its own hooks. This is also why affordances travel as a panel option
 * rather than in the config: the config is JSON-serialized on every render to
 * detect structure changes, and view code would not survive that.
 */
type AffordanceConfig = {
    content: (ctx: AffordanceContext) => unknown;
    /** Accessible name for the dot and its popover. Defaults to 'Options'. */
    label?: string;
};
type ControlMeta = {
    type: 'slider' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'gradient' | 'xy' | 'text' | 'range' | 'gallery' | 'file' | 'swatch' | 'chips' | 'multiselect' | 'list' | 'curve';
    path: string;
    label: string;
    /** One line of help, revealed on hover or when focus lands inside the control. */
    hint?: string;
    /** Companion control reachable from a dot in the control's bottom-right corner. */
    affordance?: AffordanceConfig;
    min?: number;
    max?: number;
    step?: number;
    /** Range control's configured reset target — its `default`, else the full {min,max} span. */
    rangeDefault?: RangeValue;
    children?: ControlMeta[];
    defaultOpen?: boolean;
    /** Folder declared `_enabled` — renders as a module whose header switch drives `<path>._enabled`. */
    module?: boolean;
    /** Folder declared `_collapsible: false` — plain section header, no caret, body always open. */
    collapsible?: boolean;
    /** Top-level folder under a `_tabs` root — it is a tab, and its children are that tab's page. */
    tab?: boolean;
    /** The synthetic segmented select driving `_tab` — it renders as the panel's tab bar, never as a row. */
    tabBar?: boolean;
    options?: (string | {
        value: string;
        label: string;
    })[];
    /** Select's rendering mode, from the SelectConfig form. */
    display?: 'dropdown' | 'segmented';
    placeholder?: string;
    items?: GalleryItem[];
    columns?: number;
    accept?: string;
    multiple?: boolean;
    swatchOptions?: SwatchOption[];
    chipOptions?: ChipOption[];
    multiSelectOptions?: MultiSelectOption[];
    /** Slider display unit, from the explicit SliderConfig form. */
    unit?: string;
    /** Slider display formatter, from the explicit SliderConfig form. */
    formatValue?: (value: number) => string;
    /** Slider fill anchor, from the explicit SliderConfig form. */
    origin?: number;
    bipolar?: boolean;
    itemTypes?: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    alpha?: boolean;
    palette?: boolean;
    /** XY pad axes/options — carried through to the XYControl. */
    xAxis?: XYAxis;
    yAxis?: XYAxis;
    grid?: boolean | number;
    density?: number;
    snap?: boolean;
    returnToCenter?: boolean;
    showValues?: boolean;
    /** Curve preview's host-supplied sampler — swapped in place by syncCurveConfigs. */
    sample?: (t: number) => number;
    /** Curve preview's fixed y-range; absent = auto-fit per draw. */
    domain?: [number, number];
    /** Curve preview's vertical reference marker positions — kept fresh by syncCurveConfigs. */
    markers?: readonly number[];
    /** Curve preview's surface height in px (renderers clamp via clampCurveHeight). */
    height?: number;
    /** Curve preview declared `label: false` — full-bleed row without the label line. */
    hideLabel?: boolean;
    shortcut?: ShortcutConfig;
};
type PanelConfig = {
    id: string;
    name: string;
    controls: ControlMeta[];
    values: Record<string, DialValue>;
    shortcuts: Record<string, ShortcutConfig>;
    /** Help text by control path, retained so a later updatePanel can restate it. */
    hints?: Record<string, string>;
    /** Affordances by control path, retained on the same terms as `hints`. */
    affordances?: Record<string, AffordanceConfig>;
    /** Label overrides by control path, retained on the same terms as `hints`. */
    labels?: Record<string, string>;
    kind?: 'timeline';
};
type Listener$1 = () => void;
type ActionListener = (action: string) => void;
/**
 * Non-value events emitted by controls (file picked, chip removed, list mutated).
 * Delivered through the generic `onEvent(path, event)` channel so the value layer
 * stays JSON-serializable (a File is never stored — it rides on a file event).
 */
type DialEvent = {
    kind: 'file';
    files: FileList;
} | {
    kind: 'remove';
    value: string;
} | {
    kind: 'list';
    op: 'add' | 'remove' | 'move' | 'set' | 'rename';
    index?: number;
    from?: number;
    to?: number;
    itemType?: string;
};
type EventListener = (path: string, event: DialEvent) => void;
type Preset = {
    id: string;
    name: string;
    values: Record<string, DialValue>;
};
type PresetProviderPreset = {
    id: string;
    label: string;
    /** Read-only rows (e.g. factory presets) show no delete affordance. */
    readonly?: boolean;
};
/**
 * Host-owned backing for the panel toolbar's preset UI. When a provider is set
 * the toolbar renders the host's list instead of the built-in snapshots: the
 * store never captures or restores values itself — the host applies them in
 * `onSelect` (e.g. via `DialStore.updateValues`) and owns persistence. The
 * stock auto-save-to-active-preset behavior is off because the store's own
 * active-preset state is never engaged in provider mode.
 */
type PresetProvider = {
    presets: PresetProviderPreset[];
    activeId?: string | null;
    onSelect(id: string): void | Promise<void>;
    /** "+" pressed; receives a suggested label ("Preset N"). */
    onCreate(suggestedLabel: string): void | Promise<void>;
    /** Omit to hide the delete affordance entirely. */
    onDelete?(id: string): void | Promise<void>;
    /** Inline rename committed; omit to hide the rename affordance entirely. */
    onRename?(id: string, name: string): void | Promise<void>;
};
/**
 * What the toolbar renders per dropdown row — one shape for both modes, so the
 * framework components never branch on where a preset came from.
 */
type PresetItem = {
    id: string;
    name: string;
    deletable: boolean;
    renamable: boolean;
};
type DialKitPersistOptions = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};
type DialStorePanelOptions = {
    retainOnUnmount?: boolean;
    persist?: DialKitPersistOptions;
    /**
     * Help text by control path — the same keying as `shortcuts`. Keyed rather
     * than declared inline because most controls are bare shorthand
     * (`gravity: [9.8, 0, 20]`) with nowhere to hang a property.
     */
    hints?: Record<string, string>;
    /**
     * Companion controls by control path. Holds framework view nodes, so — unlike
     * the config — this is never serialized.
     */
    affordances?: Record<string, AffordanceConfig>;
    /**
     * Display label by control path, overriding the name derived from the config
     * key. Keyed for the same reason as `hints`: the controls that most need a
     * label the key can't express are bare shorthand (`a: [0, 0, 1]` relabelled
     * per mode) with nowhere to hang a property. Applies to folders too.
     *
     * Without this, changing a control's visible text means changing its config
     * key — which silently changes its identity, so it loses its value, its
     * persisted entry and its shortcut binding.
     */
    labels?: Record<string, string>;
    /** Timeline panels render in DialTimeline and are filtered out of the panel dock. */
    kind?: 'timeline';
};
declare class DialStoreClass {
    private panels;
    private listeners;
    private globalListeners;
    private snapshots;
    private actionListeners;
    private eventListeners;
    private affordanceStatus;
    private disabledPaths;
    private controlStateListeners;
    private presets;
    private activePreset;
    private presetProviders;
    private baseValues;
    private persistTargets;
    registerPanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>, options?: DialStorePanelOptions): void;
    updatePanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>, options?: DialStorePanelOptions): void;
    unregisterPanel(id: string): void;
    private overlayPersistedValues;
    private savePanelValues;
    updateValue(panelId: string, path: string, value: DialValue): void;
    updateValues(panelId: string, updates: Record<string, DialValue>): void;
    updateSpringMode(panelId: string, path: string, mode: 'simple' | 'advanced'): void;
    getSpringMode(panelId: string, path: string): 'simple' | 'advanced';
    updateTransitionMode(panelId: string, path: string, mode: 'easing' | 'simple' | 'advanced'): void;
    getTransitionMode(panelId: string, path: string): 'easing' | 'simple' | 'advanced';
    getValue(panelId: string, path: string): DialValue | undefined;
    getValues(panelId: string): Record<string, DialValue>;
    getPanels(kind?: 'panel' | 'timeline'): PanelConfig[];
    getPanel(id: string): PanelConfig | undefined;
    subscribe(panelId: string, listener: Listener$1): () => void;
    subscribeGlobal(listener: Listener$1): () => void;
    subscribeActions(panelId: string, listener: ActionListener): () => void;
    triggerAction(panelId: string, path: string): void;
    subscribeEvents(panelId: string, listener: EventListener): () => void;
    emitEvent(panelId: string, path: string, event: DialEvent): void;
    /**
     * How lit a control's affordance dot is. Callers may push this as often as
     * they like — an unchanged status is dropped without notifying, so driving it
     * from an audio callback costs nothing.
     */
    setAffordanceStatus(panelId: string, path: string, status: AffordanceStatus): void;
    getAffordanceStatus(panelId: string, path: string): AffordanceStatus;
    /**
     * Greys a control out and stops it responding. Runtime-only by design: a
     * config default plus a runtime override would be two sources of truth, and
     * calling this once covers the static case.
     */
    setDisabled(panelId: string, path: string, disabled: boolean): void;
    isDisabled(panelId: string, path: string): boolean;
    /** One channel for every app-pushed presentation change on a panel. */
    subscribeControlState(panelId: string, listener: Listener$1): () => void;
    private notifyControlState;
    /**
     * Refresh curve rows' host-supplied presentation (sample function + markers)
     * in place. Functions drop out of the serialized config diff (the
     * `formatValue` precedent), so a host that rebuilds its config per render
     * would otherwise leave the preview drawing a stale closure; markers ride the
     * same sync so the whole curve row stays one coherent refresh. Adapters call
     * this after every render — the same contract as setPresetProvider — and only
     * an actual change (function identity, marker values) notifies, on the
     * control-state channel: curve rows are presentation, and the value snapshot
     * must not churn (a new snapshot would re-render the host, whose rebuilt
     * closure would notify again, forever). Markers are compared by value, not
     * identity, because a per-render rebuild remakes the array every time.
     */
    syncCurveConfigs(panelId: string, config: DialConfig): void;
    savePreset(panelId: string, name: string): string;
    loadPreset(panelId: string, presetId: string): void;
    deletePreset(panelId: string, presetId: string): void;
    getPresets(panelId: string): Preset[];
    getActivePresetId(panelId: string): string | null;
    clearActivePreset(panelId: string): void;
    /**
     * Install (or clear) a host-owned preset provider. Safe to call on every
     * host render: the object is always swapped so `onSelect`/`onCreate`/
     * `onDelete` never close over stale host state, but listeners are only
     * notified when the visible data (list, active id) actually changed.
     */
    setPresetProvider(panelId: string, provider: PresetProvider | null | undefined): void;
    getPresetProvider(panelId: string): PresetProvider | null;
    /** Provider mode hides the implicit "Version 1" base row — the host owns the whole list. */
    hasPresetProvider(panelId: string): boolean;
    /** The dropdown rows in host order, from the provider when one is set. */
    getPresetItems(panelId: string): PresetItem[];
    /**
     * Row clicked. Stock mode loads the snapshot (null = back to base values);
     * provider mode hands the id to the host, which applies values itself.
     */
    selectPreset(panelId: string, presetId: string | null): void;
    /**
     * "+" pressed. Stock mode snapshots into "Version N" (N counts the implicit
     * base as version 1); provider mode suggests the matching "Preset N" label.
     */
    createPreset(panelId: string): void;
    /** Trash icon pressed on a row (only rendered when the item is deletable). */
    removePreset(panelId: string, presetId: string): void;
    /** Rename a preset (toolbar inline edit). Provider mode hands the new name
     * to the host; stock mode edits the store's own snapshot list. */
    renamePreset(panelId: string, presetId: string, name: string): void;
    resolveShortcutTarget(key: string, modifier?: 'alt' | 'shift' | 'meta'): {
        panelId: string;
        path: string;
        control: ControlMeta;
    } | null;
    resolveScrollOnlyTargets(): Array<{
        panelId: string;
        path: string;
        control: ControlMeta;
        shortcut: ShortcutConfig;
    }>;
    private findControlByPath;
    private notify;
    private notifyGlobal;
    private initTransitionModes;
    private parseConfig;
    /**
     * Swaps a panel's whole value map, keeping the open tab. Which tab you are
     * reading is a place, not a parameter: a preset should change the sound, not
     * move you to another page of the panel.
     */
    private replaceValues;
    /**
     * Seeds the active tab. It is a real value, not component state, so a config
     * rebuild preserves the reader's place — and `normalizePreservedValue` resets
     * it through the select's options when the tab it named is gone.
     */
    private initTabValue;
    private flattenValues;
    private isSpringConfig;
    private isEasingConfig;
    private isActionConfig;
    private isSelectConfig;
    private isColorConfig;
    private isGradientConfig;
    private isXYConfig;
    private isRangeConfig;
    private isRangeValue;
    private isTextConfig;
    private isGalleryConfig;
    private isFileConfig;
    private isSwatchConfig;
    private isChipsConfig;
    private isMultiSelectConfig;
    private isSliderConfig;
    private isCurveConfig;
    private isListConfig;
    private isHexColor;
    private formatLabel;
    private inferRange;
    private inferStep;
    private normalizePreservedValue;
    private roundToStep;
    private stepPrecision;
    private applyControlExtras;
    private mapControlsByPath;
}
declare const DialStore: DialStoreClass;

interface UseDialOptions {
    onAction?: (action: string) => void;
    shortcuts?: Record<string, ShortcutConfig>;
    /** One line of help per control path, revealed on hover or keyboard focus. */
    hints?: Record<string, string>;
    /** Companion controls per control path, opened from a dot in the corner. */
    affordances?: Record<string, AffordanceConfig>;
    /** Display label by control path, overriding the key-derived name. */
    labels?: Record<string, string>;
    /**
     * Host-owned backing for the toolbar's preset UI (see PresetProvider).
     * Reactive `presets`/`activeId` sources are tracked through the watcher.
     */
    presets?: PresetProvider;
}
declare function useDialKit<T extends DialConfig>(name: string, config: T, options?: UseDialOptions): ComputedRef<ResolvedValues<T>>;

type DialPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type DialMode = 'popover' | 'inline';
type DialTheme = 'light' | 'dark' | 'system';
declare const DialRoot: vue.DefineComponent<vue.ExtractPropTypes<{
    position: {
        type: () => DialPosition;
        default: string;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: {
        type: () => DialMode;
        default: string;
    };
    theme: {
        type: () => DialTheme;
        default: string;
    };
    productionEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}> | null, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    position: {
        type: () => DialPosition;
        default: string;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: {
        type: () => DialMode;
        default: string;
    };
    theme: {
        type: () => DialTheme;
        default: string;
    };
    productionEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    position: DialPosition;
    mode: DialMode;
    defaultOpen: boolean;
    theme: DialTheme;
    productionEnabled: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

interface DialKitDirectiveOptions {
    position?: DialPosition;
    defaultOpen?: boolean;
    mode?: DialMode;
}
type DialKitDirectiveValue = DialMode | DialKitDirectiveOptions | undefined;
declare const vDialKit: ObjectDirective<HTMLElement, DialKitDirectiveValue>;

/**
 * Fail-soft browser persistence shared by DialStore (panel values) and
 * TimelineStore (loop regions). Kept separate so the stores stay node-safe and
 * side-effect-free: nothing here touches `window` at import time, and every
 * storage access is guarded + try/caught. When storage is unavailable (SSR,
 * Safari private mode, blocked cookies) persistence silently degrades to
 * session-only — a broken shelf must never break the tool.
 *
 * Mirrors the style of color-palette-store.ts.
 */
/** Structural mirror of DialKitPersistOptions — duplicated here to keep this
 * module free of a DialStore import (avoids a store ↔ persist cycle). */
type PersistConfig = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};

type TimelineClipTrackMeta = {
    prop: string;
    /** Step folder keys when the track is a sequence. */
    stepKeys?: string[];
};
type TimelineClipMeta = {
    key: string;
    label: string;
    color: string;
    /** Code-defined playback behavior; intentionally not exposed as a dial. */
    loop: 'off' | 'repeat';
    /** Group key when the clip lives inside a nested layer, e.g. "circle". */
    group?: string;
    /** Step folder keys for sequence clips, e.g. ["step1", "step2"]. */
    stepKeys?: string[];
    /** Independent property tracks of a props clip — full rows when expanded. */
    tracks?: TimelineClipTrackMeta[];
};
type TimelineMeta = {
    id: string;
    name: string;
    duration: number;
    loop: boolean;
    /** Loop wraps back to this time, not 0 — clips before it play once
     * (intro-then-idle). 0 loops the whole timeline. */
    loopStart: number;
    clips: TimelineClipMeta[];
};
type TimelineTransport = {
    time: number;
    playing: boolean;
    duration: number;
    /** Completed loop passes — keeps looping clips phase-continuous across
     * timeline wraps. Reset by seek/replay so scrubbing stays deterministic. */
    wraps: number;
};
type Listener = () => void;
/** A user- or code-defined loop window `[start, end]` in seconds. Absent means
 * "loop the whole timeline" — the default for this preview tool. */
type TimelineLoopRegion = {
    start: number;
    end: number;
};
declare class TimelineStoreClass {
    private timelines;
    private transports;
    private listeners;
    private globalListeners;
    private registrationCounts;
    private loopRegions;
    private persistTargets;
    private listCache;
    private rafId;
    private lastTick;
    register(meta: TimelineMeta, options: {
        autoplay: boolean;
        persist?: PersistConfig;
    }): void;
    update(meta: TimelineMeta): void;
    unregister(id: string): void;
    /** Restore a persisted loop region, or seed one from a code-defined
     * `options.loop`. No region at all = loop the whole timeline (the default). */
    private hydrateLoopRegion;
    /** Clamp to [0,duration], order min/max, and reject degenerate widths. */
    private normalizeRegion;
    setLoopRegion(id: string, start: number, end: number): void;
    clearLoopRegion(id: string): void;
    /** The raw user/code region, or undefined when looping the whole timeline.
     * The reference is stable between changes (safe for useSyncExternalStore). */
    getLoopRegion(id: string): TimelineLoopRegion | undefined;
    /** The region the clock actually loops within: the user/code region, or the
     * whole timeline `[0, duration]` when none is set. Playback always wraps. */
    private effectiveRegion;
    play(id: string): void;
    pause(id: string): void;
    replay(id: string): void;
    seek(id: string, time: number): void;
    getTransport(id: string): TimelineTransport;
    getTimeline(id: string): TimelineMeta | undefined;
    getTimelines(): TimelineMeta[];
    subscribe(id: string, listener: Listener): () => void;
    subscribeGlobal(listener: Listener): () => void;
    private applyMeta;
    private ensureLoop;
    private tick;
    private notify;
    private notifyGlobal;
}
declare const TimelineStore: TimelineStoreClass;

type TimelineClipLoop = 'off' | 'repeat';
type TimelineStepValues = {
    [key: string]: DialConfig[string] | undefined;
};
type TimelineStepConfig = {
    duration?: number;
    to?: TimelineStepValues;
    transition?: TransitionConfig;
};
type TimelinePropStepConfig = {
    duration?: number;
    to?: number | string;
    transition?: TransitionConfig;
};
type TimelinePropConfig = {
    from?: number | string;
    to?: number | string;
    duration?: number;
    /** Offset from the clip's `at` in seconds. */
    delay?: number;
    transition?: TransitionConfig;
    steps?: TimelinePropStepConfig[];
};
type TimelineClipBase = {
    at: number;
    duration?: number;
    transition?: TransitionConfig;
    loop?: boolean | TimelineClipLoop;
};
type TimelineClipConfig = TimelineClipBase & ({
    from?: DialConfig;
    to?: DialConfig;
    steps?: never;
    props?: never;
} | {
    from?: DialConfig;
    to?: never;
    /** Sequential legs on one row — a segmented bar; boundaries retime legs. */
    steps: TimelineStepConfig[];
    props?: never;
} | {
    from?: never;
    to?: never;
    steps?: never;
    /** Independent per-property tracks — mutually exclusive with from/to/steps. */
    props: {
        [prop: string]: TimelinePropConfig;
    };
});
/** Nested keys group clips into a collapsible layer — purely presentational. */
type TimelineGroupConfig = {
    [key: string]: TimelineClipConfig;
};
type TimelineConfig = {
    /** Total timeline length in seconds. Inferred from the last clip when omitted. */
    duration?: number;
} & {
    [key: string]: TimelineClipConfig | TimelineGroupConfig | number | undefined;
};
/** CSS-friendly output for consumers not using Motion — spread into a style. */
type TimelineClipCss = {
    transitionDuration: string;
    transitionTimingFunction: string;
};
type TimelineClipValues<C extends TimelineClipConfig = TimelineClipConfig> = {
    at: number;
    duration: number;
    /** Effective code-defined loop mode. */
    loop: TimelineClipLoop;
    /** Playhead is at or past the clip start. */
    started: boolean;
    /** Playhead is inside the clip — for looping clips, inside any cycle. */
    active: boolean;
    /** Playhead is past the clip end (for looping clips, past the timeline end). */
    done: boolean;
    /**
     * 0–1 position of the playhead within the clip — cycle progress (a
     * sawtooth) for looping clips, sequence progress for steps clips.
     */
    progress: number;
    /** Index of the leg under the playhead, for sequence clips. */
    step: C['steps'] extends TimelineStepConfig[] ? number : undefined;
    from: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['from'] extends DialConfig ? ResolvedValues<C['from']> : undefined;
    to: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends DialConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends DialConfig ? ResolvedValues<C['to']> : undefined;
    /** `to` once the clip has started, `from` before — hand it to Motion's animate.
     * For sequences this is the final merged state; for props clips, per-track
     * endpoint records. */
    animate: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends DialConfig ? ResolvedValues<C['from']> : Record<string, number | string> | undefined : C['to'] extends DialConfig ? C['from'] extends DialConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : ResolvedValues<C['to']> | undefined : undefined;
    /** The clip's editable curve — single-curve clips only. */
    transition: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: DialConfig;
    } | {
        to: DialConfig;
    } ? TransitionConfig : undefined;
    /** Duration + timing-function for native CSS transitions — single-curve clips only. */
    css: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: DialConfig;
    } | {
        to: DialConfig;
    } ? TimelineClipCss : undefined;
    /**
     * Values interpolated through the clip's curves at the current playhead —
     * bind to style for true scrubbing: the element is exactly at this point
     * in time whether playing, paused, or scrubbing. Sequence clips report the
     * merged state of all legs (declare every animated property in `from`);
     * props clips report every track's value.
     */
    current: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends DialConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends DialConfig ? C['from'] extends DialConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : undefined : undefined;
};
type TimelineGroupValues<G extends TimelineGroupConfig> = {
    [K in keyof G as G[K] extends TimelineClipConfig ? K : never]: TimelineClipValues<Extract<G[K], TimelineClipConfig>>;
};
type DialTimelineValues<T extends TimelineConfig> = {
    time: number;
    playing: boolean;
    duration: number;
    play: () => void;
    pause: () => void;
    replay: () => void;
    seek: (time: number) => void;
} & {
    [K in keyof T as T[K] extends TimelineClipConfig ? K : never]: TimelineClipValues<Extract<T[K], TimelineClipConfig>>;
} & {
    [K in keyof T as T[K] extends TimelineClipConfig ? never : T[K] extends TimelineGroupConfig ? K : never]: TimelineGroupValues<Extract<T[K], TimelineGroupConfig>>;
};

interface DialTimelineOptions {
    id?: string;
    persist?: DialKitPersistOptions;
    /** Start playing on mount. Defaults to true. */
    autoplay?: boolean;
    /**
     * Loop when the playhead reaches the end. `true` restarts the whole
     * timeline; `{ from }` wraps back to that time instead, so clips before it
     * play once and looping clips keep cycling forever. Defaults to false.
     */
    loop?: boolean | {
        from: number;
    };
}

type UseDialTimelineOptions = DialTimelineOptions;
declare function useDialTimeline<T extends TimelineConfig>(name: string, config: T, options?: UseDialTimelineOptions): ComputedRef<DialTimelineValues<T>>;

declare const DialTimeline: vue.DefineComponent<vue.ExtractPropTypes<{
    theme: {
        type: PropType<DialTheme>;
        default: string;
    };
    defaultVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    visible: {
        type: PropType<boolean | undefined>;
        default: undefined;
    };
    onVisibilityChange: PropType<(visible: boolean) => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    productionEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}> | null, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    theme: {
        type: PropType<DialTheme>;
        default: string;
    };
    defaultVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    visible: {
        type: PropType<boolean | undefined>;
        default: undefined;
    };
    onVisibilityChange: PropType<(visible: boolean) => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    productionEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    defaultOpen: boolean;
    visible: boolean | undefined;
    theme: DialTheme;
    productionEnabled: boolean;
    defaultVisible: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const TimelineToggleButton: vue.DefineComponent<{}, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

interface TransitionDurationControl {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}
declare const TransitionControl: vue.DefineComponent<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    path: {
        type: StringConstructor;
        required: true;
    };
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<TransitionConfig>;
        required: true;
    };
    hideDuration: {
        type: BooleanConstructor;
        default: boolean;
    };
    durationControl: PropType<TransitionDurationControl>;
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    path: {
        type: StringConstructor;
        required: true;
    };
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<TransitionConfig>;
        required: true;
    };
    hideDuration: {
        type: BooleanConstructor;
        default: boolean;
    };
    durationControl: PropType<TransitionDurationControl>;
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    hideDuration: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const ControlRenderer: vue.DefineComponent<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    controls: {
        type: PropType<ControlMeta[]>;
        required: true;
    };
    values: {
        type: PropType<Record<string, DialValue>>;
        required: true;
    };
    transitionDuration: PropType<TransitionDurationControl>;
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    controls: {
        type: PropType<ControlMeta[]>;
        required: true;
    };
    values: {
        type: PropType<Record<string, DialValue>>;
        required: true;
    };
    transitionDuration: PropType<TransitionDurationControl>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

interface ShortcutState {
    activePanelId: Ref<string | null>;
    activePath: Ref<string | null>;
}
declare const ShortcutKey: InjectionKey<ShortcutState>;
declare function useShortcutContext(): ShortcutState;
declare const ShortcutListener: vue.DefineComponent<{}, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>[] | undefined, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const ShortcutsMenu: vue.DefineComponent<vue.ExtractPropTypes<{
    panelId: {
        type: PropType<string>;
        required: true;
    };
}>, () => (vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}> | null)[] | null, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    panelId: {
        type: PropType<string>;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const Slider: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: NumberConstructor;
        required: true;
    };
    min: {
        type: NumberConstructor;
        required: false;
    };
    max: {
        type: NumberConstructor;
        required: false;
    };
    step: {
        type: NumberConstructor;
        required: false;
    };
    unit: {
        type: StringConstructor;
        required: false;
    };
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min`.
     */
    origin: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar: {
        type: BooleanConstructor;
        default: boolean;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: NumberConstructor;
        required: true;
    };
    min: {
        type: NumberConstructor;
        required: false;
    };
    max: {
        type: NumberConstructor;
        required: false;
    };
    step: {
        type: NumberConstructor;
        required: false;
    };
    unit: {
        type: StringConstructor;
        required: false;
    };
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min`.
     */
    origin: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar: {
        type: BooleanConstructor;
        default: boolean;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    origin: number;
    bipolar: boolean;
    shortcut: ShortcutConfig;
    shortcutActive: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const RangeSlider: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<RangeValue>;
        required: true;
    };
    /** Lower bound of the track. */
    min: {
        type: NumberConstructor;
        required: false;
    };
    /** Upper bound of the track. */
    max: {
        type: NumberConstructor;
        required: false;
    };
    step: {
        type: NumberConstructor;
        required: false;
    };
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue: {
        type: PropType<RangeValue>;
        required: false;
        default: undefined;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<RangeValue>;
        required: true;
    };
    /** Lower bound of the track. */
    min: {
        type: NumberConstructor;
        required: false;
    };
    /** Upper bound of the track. */
    max: {
        type: NumberConstructor;
        required: false;
    };
    step: {
        type: NumberConstructor;
        required: false;
    };
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue: {
        type: PropType<RangeValue>;
        required: false;
        default: undefined;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    defaultValue: RangeValue;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const Toggle: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    checked: {
        type: BooleanConstructor;
        required: true;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    checked: {
        type: BooleanConstructor;
        required: true;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    shortcut: ShortcutConfig;
    shortcutActive: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const Folder: vue.DefineComponent<vue.ExtractPropTypes<{
    title: {
        type: StringConstructor;
        required: true;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
    collapsible: {
        type: BooleanConstructor;
        default: boolean;
    };
    isRoot: {
        type: BooleanConstructor;
        default: boolean;
    };
    inline: {
        type: BooleanConstructor;
        default: boolean;
    };
    toolbar: {
        type: PropType<(() => ReturnType<typeof h>) | null>;
        required: false;
        default: null;
    };
    /** One line of help for the section, revealed on hover over the header. */
    hint: {
        type: StringConstructor;
        default: undefined;
    };
    hintId: {
        type: StringConstructor;
        default: undefined;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "openChange"[], "openChange", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    title: {
        type: StringConstructor;
        required: true;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
    collapsible: {
        type: BooleanConstructor;
        default: boolean;
    };
    isRoot: {
        type: BooleanConstructor;
        default: boolean;
    };
    inline: {
        type: BooleanConstructor;
        default: boolean;
    };
    toolbar: {
        type: PropType<(() => ReturnType<typeof h>) | null>;
        required: false;
        default: null;
    };
    /** One line of help for the section, revealed on hover over the header. */
    hint: {
        type: StringConstructor;
        default: undefined;
    };
    hintId: {
        type: StringConstructor;
        default: undefined;
    };
}>> & Readonly<{
    onOpenChange?: ((...args: any[]) => any) | undefined;
}>, {
    defaultOpen: boolean;
    collapsible: boolean;
    isRoot: boolean;
    inline: boolean;
    toolbar: (() => ReturnType<typeof h>) | null;
    hint: string;
    hintId: string;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

/**
 * The chrome around one leaf control: a hint tooltip and an affordance dot.
 * Hint reveal is CSS-only (`:hover` / `:focus-within`); the tooltip stays
 * mounted so its id always resolves for assistive tech. `role="group"` is what
 * makes the description reachable — the wrapper can't reach the focusable
 * element inside the slot.
 */
declare const ControlShell: vue.DefineComponent<vue.ExtractPropTypes<{
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint: {
        type: StringConstructor;
        default: undefined;
    };
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title: {
        type: StringConstructor;
        default: undefined;
    };
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: {
        type: StringConstructor;
        required: true;
    };
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance: {
        type: PropType<AffordanceConfig>;
        default: undefined;
    };
    /** Required alongside `affordance` — together they address the status slice. */
    panelId: {
        type: StringConstructor;
        default: undefined;
    };
    path: {
        type: StringConstructor;
        default: undefined;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}> | vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint: {
        type: StringConstructor;
        default: undefined;
    };
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title: {
        type: StringConstructor;
        default: undefined;
    };
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: {
        type: StringConstructor;
        required: true;
    };
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance: {
        type: PropType<AffordanceConfig>;
        default: undefined;
    };
    /** Required alongside `affordance` — together they address the status slice. */
    panelId: {
        type: StringConstructor;
        default: undefined;
    };
    path: {
        type: StringConstructor;
        default: undefined;
    };
}>> & Readonly<{}>, {
    path: string;
    panelId: string;
    title: string;
    hint: string;
    affordance: AffordanceConfig;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. The switch doubles as the expand
 * control: disabling collapses the body away with a smooth height transition.
 */
declare const Module: vue.DefineComponent<vue.ExtractPropTypes<{
    title: {
        type: StringConstructor;
        required: true;
    };
    enabled: {
        type: BooleanConstructor;
        required: true;
    };
    onEnabledChange: {
        type: PropType<(enabled: boolean) => void>;
        default: undefined;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "enabledChange"[], "enabledChange", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    title: {
        type: StringConstructor;
        required: true;
    };
    enabled: {
        type: BooleanConstructor;
        required: true;
    };
    onEnabledChange: {
        type: PropType<(enabled: boolean) => void>;
        default: undefined;
    };
}>> & Readonly<{
    onEnabledChange?: ((...args: any[]) => any) | undefined;
}>, {
    onEnabledChange: (enabled: boolean) => void;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

type SegmentedControlOption<T extends string> = {
    value: T;
    label: string;
};
declare const SegmentedControl: vue.DefineComponent<vue.ExtractPropTypes<{
    options: {
        type: PropType<SegmentedControlOption<string>[]>;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    options: {
        type: PropType<SegmentedControlOption<string>[]>;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

type ButtonGroupButton = {
    label: string;
    onClick: () => void;
};
declare const ButtonGroup: vue.DefineComponent<vue.ExtractPropTypes<{
    buttons: {
        type: PropType<ButtonGroupButton[]>;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    buttons: {
        type: PropType<ButtonGroupButton[]>;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const SpringControl: vue.DefineComponent<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    path: {
        type: StringConstructor;
        required: true;
    };
    label: {
        type: StringConstructor;
        required: true;
    };
    spring: {
        type: PropType<SpringConfig>;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    path: {
        type: StringConstructor;
        required: true;
    };
    label: {
        type: StringConstructor;
        required: true;
    };
    spring: {
        type: PropType<SpringConfig>;
        required: true;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const SpringVisualization: vue.DefineComponent<vue.ExtractPropTypes<{
    spring: {
        type: PropType<SpringConfig>;
        required: true;
    };
    isSimpleMode: {
        type: BooleanConstructor;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    spring: {
        type: PropType<SpringConfig>;
        required: true;
    };
    isSimpleMode: {
        type: BooleanConstructor;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const EasingVisualization: vue.DefineComponent<vue.ExtractPropTypes<{
    easing: {
        type: PropType<EasingConfig>;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    easing: {
        type: PropType<EasingConfig>;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

type WaveformMode = 'smooth' | 'pixelated';
/** A loop region over the sample, as normalized 0..1 positions. */
type WaveformLoop = {
    start: number;
    end: number;
};

declare const WaveformVisualization: vue.DefineComponent<vue.ExtractPropTypes<{
    buffer: {
        type: PropType<AudioBuffer | null>;
        default: null;
    };
    progress: {
        type: NumberConstructor;
        default: number;
    };
    getProgress: {
        type: PropType<() => number>;
        default: undefined;
    };
    mode: {
        type: PropType<WaveformMode>;
        default: string;
    };
    border: {
        type: BooleanConstructor;
        default: boolean;
    };
    bands: {
        type: BooleanConstructor;
        default: boolean;
    };
    pixelSize: {
        type: NumberConstructor;
        default: number;
    };
    grid: {
        type: BooleanConstructor;
        default: boolean;
    };
    gridSubdivisions: {
        type: NumberConstructor;
        default: number;
    };
    onSeek: {
        type: PropType<(progress: number) => void>;
        default: undefined;
    };
    loop: {
        type: PropType<WaveformLoop | null>;
        default: null;
    };
    onLoopChange: {
        type: PropType<(loop: WaveformLoop | null) => void>;
        default: undefined;
    };
    waveColor: {
        type: StringConstructor;
        default: undefined;
    };
    playheadColor: {
        type: StringConstructor;
        default: undefined;
    };
    autoZoomOnLoop: {
        type: BooleanConstructor;
        default: boolean;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    buffer: {
        type: PropType<AudioBuffer | null>;
        default: null;
    };
    progress: {
        type: NumberConstructor;
        default: number;
    };
    getProgress: {
        type: PropType<() => number>;
        default: undefined;
    };
    mode: {
        type: PropType<WaveformMode>;
        default: string;
    };
    border: {
        type: BooleanConstructor;
        default: boolean;
    };
    bands: {
        type: BooleanConstructor;
        default: boolean;
    };
    pixelSize: {
        type: NumberConstructor;
        default: number;
    };
    grid: {
        type: BooleanConstructor;
        default: boolean;
    };
    gridSubdivisions: {
        type: NumberConstructor;
        default: number;
    };
    onSeek: {
        type: PropType<(progress: number) => void>;
        default: undefined;
    };
    loop: {
        type: PropType<WaveformLoop | null>;
        default: null;
    };
    onLoopChange: {
        type: PropType<(loop: WaveformLoop | null) => void>;
        default: undefined;
    };
    waveColor: {
        type: StringConstructor;
        default: undefined;
    };
    playheadColor: {
        type: StringConstructor;
        default: undefined;
    };
    autoZoomOnLoop: {
        type: BooleanConstructor;
        default: boolean;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    mode: WaveformMode;
    progress: number;
    height: number;
    width: number;
    border: boolean;
    grid: boolean;
    loop: WaveformLoop | null;
    buffer: AudioBuffer | null;
    getProgress: () => number;
    bands: boolean;
    pixelSize: number;
    gridSubdivisions: number;
    onSeek: (progress: number) => void;
    onLoopChange: (loop: WaveformLoop | null) => void;
    waveColor: string;
    playheadColor: string;
    autoZoomOnLoop: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

type AnalyserScale = 'log' | 'linear';
/** `true` enables the default spring; an object overrides stiffness/damping. */
type AnalyserSpring = boolean | {
    stiffness?: number;
    damping?: number;
};

type AnalyserSource = 'frequency' | 'waveform';
type AnalyserVariant = 'line' | 'area';
type AnalyserMode = 'smooth' | 'pixelated';

declare const AnalyserVisualization: vue.DefineComponent<vue.ExtractPropTypes<{
    analyser: {
        type: PropType<AnalyserNode | null>;
        default: null;
    };
    source: {
        type: PropType<AnalyserSource>;
        default: string;
    };
    variant: {
        type: PropType<AnalyserVariant>;
        default: string;
    };
    mode: {
        type: PropType<AnalyserMode>;
        default: string;
    };
    pixelSize: {
        type: NumberConstructor;
        default: number;
    };
    scale: {
        type: PropType<AnalyserScale>;
        default: string;
    };
    spring: {
        type: PropType<AnalyserSpring>;
        default: boolean;
    };
    grid: {
        type: BooleanConstructor;
        default: boolean;
    };
    gridSubdivisions: {
        type: NumberConstructor;
        default: number;
    };
    waveColor: {
        type: StringConstructor;
        default: undefined;
    };
    fillColor: {
        type: StringConstructor;
        default: undefined;
    };
    muted: {
        type: BooleanConstructor;
        default: boolean;
    };
    onMuteChange: {
        type: PropType<(muted: boolean) => void>;
        default: undefined;
    };
    soloed: {
        type: BooleanConstructor;
        default: boolean;
    };
    onSoloChange: {
        type: PropType<(soloed: boolean) => void>;
        default: undefined;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    analyser: {
        type: PropType<AnalyserNode | null>;
        default: null;
    };
    source: {
        type: PropType<AnalyserSource>;
        default: string;
    };
    variant: {
        type: PropType<AnalyserVariant>;
        default: string;
    };
    mode: {
        type: PropType<AnalyserMode>;
        default: string;
    };
    pixelSize: {
        type: NumberConstructor;
        default: number;
    };
    scale: {
        type: PropType<AnalyserScale>;
        default: string;
    };
    spring: {
        type: PropType<AnalyserSpring>;
        default: boolean;
    };
    grid: {
        type: BooleanConstructor;
        default: boolean;
    };
    gridSubdivisions: {
        type: NumberConstructor;
        default: number;
    };
    waveColor: {
        type: StringConstructor;
        default: undefined;
    };
    fillColor: {
        type: StringConstructor;
        default: undefined;
    };
    muted: {
        type: BooleanConstructor;
        default: boolean;
    };
    onMuteChange: {
        type: PropType<(muted: boolean) => void>;
        default: undefined;
    };
    soloed: {
        type: BooleanConstructor;
        default: boolean;
    };
    onSoloChange: {
        type: PropType<(soloed: boolean) => void>;
        default: undefined;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    scale: AnalyserScale;
    spring: AnalyserSpring;
    mode: AnalyserMode;
    source: AnalyserSource;
    height: number;
    width: number;
    grid: boolean;
    pixelSize: number;
    gridSubdivisions: number;
    waveColor: string;
    analyser: AnalyserNode | null;
    variant: AnalyserVariant;
    fillColor: string;
    muted: boolean;
    onMuteChange: (muted: boolean) => void;
    soloed: boolean;
    onSoloChange: (soloed: boolean) => void;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

/** The curve vocabulary a segment cycles through on quick-click. */
type CurveType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
/** One curve in the series. `weight` is a relative duration share (normalized by the sum). */
interface CurveSegment {
    type: CurveType;
    weight: number;
    /**
     * Bipolar -1..1 "energy" bias. 0 = the type's canonical shape; bezier types skew
     * both x control points (−1 = energy to the onset, +1 = energy to the fall);
     * spring maps it to bounce (−1 = none → +1 = max).
     */
    curvature: number;
    /**
     * Bipolar -1..1 steepness — how pronounced the ease is, independent of the energy bias.
     * Sweeps linear (−1) ← canonical preset (0) → the explosive extreme (+1, expo-grade: the
     * eased side's far control point drops to the floor). So steepness is the continuous power
     * ladder (gentle → quad → … → expo), with circ reachable mid-range. Spring maps it to stiffness.
     */
    steepness: number;
    /**
     * 0..1 overshoot — pushes the curve above 1 at the END before settling (easeOutBack),
     * 0 = none. Independent of `anticipate`; set both for easeInOutBack. Beyond ~1 is
     * elastic/bounce — use spring. Optional; treated as 0 when absent. No-op for spring.
     */
    overshoot?: number;
    /**
     * 0..1 anticipation — dips the curve below 0 at the START before launching (easeInBack),
     * 0 = none. Independent of `overshoot`. Optional; treated as 0 when absent. No-op for spring.
     */
    anticipate?: number;
    /**
     * Mirror the curve in TIME (t → 1−t): the shape plays back to front, so a slow start
     * becomes a slow finish. Optional; false when absent.
     *
     * This is an orientation applied on top of the shape, not another preset, which is why it
     * works for every type. `easeInOut` and `spring` have no parameter that can express a
     * mirror — swapping the preset only ever gets you easeIn↔easeOut — so without this they
     * cannot be flipped at all.
     */
    flipX?: boolean;
    /**
     * Mirror the curve in VALUE (v → 1−v): the segment falls from its ceiling to its floor
     * instead of rising. Optional; false when absent.
     *
     * Set both flips together and the two mirrors cancel back to a rising curve — that
     * combination is the classic easing reverse, and is what {@link flipSegment} applies.
     */
    flipY?: boolean;
}
/** The stacked driver curve (a single curve, no internal splits). */
interface CurveDriver {
    type: CurveType;
    /** Bipolar -1..1 energy bias — see CurveSegment.curvature. */
    curvature: number;
    /** Bipolar -1..1 steepness — see CurveSegment.steepness. */
    steepness: number;
    /** 0..1 overshoot — see CurveSegment.overshoot. */
    overshoot?: number;
    /** 0..1 anticipation — see CurveSegment.anticipate. */
    anticipate?: number;
    /** Mirror in time — see CurveSegment.flipX. */
    flipX?: boolean;
    /** Mirror in value — see CurveSegment.flipY. */
    flipY?: boolean;
}
type DriverDirection = 'forward' | 'mirror' | 'reverse';
interface CurveComposition {
    segments: CurveSegment[];
    /** null → no driver lane (the component renders a single lane). */
    driver: CurveDriver | null;
    direction: DriverDirection;
    /**
     * 0..1 — fraction of the timeline given to gaps between segments (distributed equally,
     * one gap after each segment, the last wrapping to the first). In a gap the value glides
     * smoothly from the segment's end down to the next segment's start (a faint connector)
     * instead of snapping. 0 = contiguous (default). Optional.
     */
    gap?: number;
}

declare const CurveComposer: vue.DefineComponent<vue.ExtractPropTypes<{
    /** The curve series (controlled). */
    segments: {
        type: PropType<CurveSegment[]>;
        required: true;
    };
    /** The stacked driver curve, or null for none (adds a second lane below). */
    driver: {
        type: PropType<CurveDriver | null>;
        default: null;
    };
    /** Playback direction for the demo playhead (forward / mirror / reverse). */
    direction: {
        type: PropType<DriverDirection>;
        default: string;
    };
    /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
    onSegmentsChange: {
        type: PropType<(segments: CurveSegment[]) => void>;
        default: undefined;
    };
    /** Commit a changed driver — fired live during driver drags and on click-cycle. */
    onDriverChange: {
        type: PropType<(driver: CurveDriver) => void>;
        default: undefined;
    };
    /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
    getPhase: {
        type: PropType<() => number>;
        default: undefined;
    };
    /** Static transport phase 0..1 (used when `getPhase` is absent). */
    phase: {
        type: NumberConstructor;
        default: number;
    };
    /** Output mode. 'continuous' reads the composed value each frame; 'trigger' emits via onTrigger. */
    mode: {
        type: PropType<"continuous" | "trigger">;
        default: string;
    };
    /** Number of trigger levels in trigger mode. */
    triggerSteps: {
        type: NumberConstructor;
        default: number;
    };
    /** Fired in trigger mode when the value crosses a trigger level. */
    onTrigger: {
        type: PropType<(index: number) => void>;
        default: undefined;
    };
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex: {
        type: PropType<number | null>;
        default: null;
    };
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect: {
        type: PropType<(index: number) => void>;
        default: undefined;
    };
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor: {
        type: StringConstructor;
        default: undefined;
    };
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor: {
        type: StringConstructor;
        default: undefined;
    };
    /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
    gap: {
        type: NumberConstructor;
        default: number;
    };
    /** Faint vertical reference grid behind each lane. */
    grid: {
        type: BooleanConstructor;
        default: boolean;
    };
    gridSubdivisions: {
        type: NumberConstructor;
        default: number;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    /** Height of the main lane; the driver lane adds height below it. */
    height: {
        type: NumberConstructor;
        default: number;
    };
}>, () => VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    /** The curve series (controlled). */
    segments: {
        type: PropType<CurveSegment[]>;
        required: true;
    };
    /** The stacked driver curve, or null for none (adds a second lane below). */
    driver: {
        type: PropType<CurveDriver | null>;
        default: null;
    };
    /** Playback direction for the demo playhead (forward / mirror / reverse). */
    direction: {
        type: PropType<DriverDirection>;
        default: string;
    };
    /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
    onSegmentsChange: {
        type: PropType<(segments: CurveSegment[]) => void>;
        default: undefined;
    };
    /** Commit a changed driver — fired live during driver drags and on click-cycle. */
    onDriverChange: {
        type: PropType<(driver: CurveDriver) => void>;
        default: undefined;
    };
    /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
    getPhase: {
        type: PropType<() => number>;
        default: undefined;
    };
    /** Static transport phase 0..1 (used when `getPhase` is absent). */
    phase: {
        type: NumberConstructor;
        default: number;
    };
    /** Output mode. 'continuous' reads the composed value each frame; 'trigger' emits via onTrigger. */
    mode: {
        type: PropType<"continuous" | "trigger">;
        default: string;
    };
    /** Number of trigger levels in trigger mode. */
    triggerSteps: {
        type: NumberConstructor;
        default: number;
    };
    /** Fired in trigger mode when the value crosses a trigger level. */
    onTrigger: {
        type: PropType<(index: number) => void>;
        default: undefined;
    };
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex: {
        type: PropType<number | null>;
        default: null;
    };
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect: {
        type: PropType<(index: number) => void>;
        default: undefined;
    };
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor: {
        type: StringConstructor;
        default: undefined;
    };
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor: {
        type: StringConstructor;
        default: undefined;
    };
    /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
    gap: {
        type: NumberConstructor;
        default: number;
    };
    /** Faint vertical reference grid behind each lane. */
    grid: {
        type: BooleanConstructor;
        default: boolean;
    };
    gridSubdivisions: {
        type: NumberConstructor;
        default: number;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    /** Height of the main lane; the driver lane adds height below it. */
    height: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    mode: "continuous" | "trigger";
    onSelect: (index: number) => void;
    height: number;
    width: number;
    direction: DriverDirection;
    gap: number;
    grid: boolean;
    driver: CurveDriver | null;
    gridSubdivisions: number;
    playheadColor: string;
    onSegmentsChange: (segments: CurveSegment[]) => void;
    onDriverChange: (driver: CurveDriver) => void;
    getPhase: () => number;
    phase: number;
    triggerSteps: number;
    onTrigger: (index: number) => void;
    selectedIndex: number | null;
    curveColor: string;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const TextControl: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
    placeholder: {
        type: StringConstructor;
        required: false;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
    placeholder: {
        type: StringConstructor;
        required: false;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

type SelectOption = string | {
    value: string;
    label: string;
};
declare const SelectControl: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
    options: {
        type: PropType<SelectOption[]>;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
    options: {
        type: PropType<SelectOption[]>;
        required: true;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const ColorControl: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
    alpha: {
        type: BooleanConstructor;
        default: boolean;
    };
    palette: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: StringConstructor;
        required: true;
    };
    alpha: {
        type: BooleanConstructor;
        default: boolean;
    };
    palette: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    alpha: boolean;
    palette: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const ColorPickerPanel: vue.DefineComponent<vue.ExtractPropTypes<{
    value: {
        type: StringConstructor;
        required: true;
    };
    alpha: {
        type: BooleanConstructor;
        default: boolean;
    };
    palette: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    value: {
        type: StringConstructor;
        required: true;
    };
    alpha: {
        type: BooleanConstructor;
        default: boolean;
    };
    palette: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    alpha: boolean;
    palette: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const GradientControl: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<GradientValue>;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<GradientValue>;
        required: true;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const GradientPanel: vue.DefineComponent<vue.ExtractPropTypes<{
    value: {
        type: PropType<GradientValue>;
        required: true;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("drag" | "change")[], "drag" | "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    value: {
        type: PropType<GradientValue>;
        required: true;
    };
}>> & Readonly<{
    onDrag?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

/**
 * Standalone 2D value pad. A single focusable surface with an absolutely
 * positioned thumb; pointer press places-and-grabs, arrows nudge, and an
 * optional return-to-centre springs the thumb home on release. All value
 * math (mapping, clamping, snapping, nudging, detent) lives in xy-pad-core.
 *
 * The thumb/guides are positioned purely from the `value` prop via CSS
 * `left%`/`top%` (the ColorPickerPanel SV-thumb idiom), so the four ports render
 * identical markup with no animation library. Smooth motion for keyboard nudges
 * and return-to-centre comes from a CSS transition that is disabled during drag
 * (via `data-dragging`), keeping drags instant.
 */
declare const XYPad: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<XYValue>;
        required: true;
    };
    /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
    x: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    /** Vertical axis, Cartesian (top = max). Same defaults as x. */
    y: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
    size: {
        type: NumberConstructor;
        default: number;
    };
    /**
     * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
     * faint at rest and stronger on interaction. Pass `false` to hide it, or a
     * number for a uniform N×N count. `density` multiplies whichever grid applies.
     */
    grid: {
        type: PropType<boolean | number>;
        default: undefined;
    };
    /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density: {
        type: NumberConstructor;
        default: number;
    };
    /** Snap the emitted value to each axis's step. Default false (continuous). */
    snap: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Spring back to centre on release (joystick). Default false = hold. */
    returnToCenter: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Show the live value next to each axis label (default false = label only). */
    showValues: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Override the readout / aria-valuetext text. Owns the full string. */
    formatValue: {
        type: PropType<(value: XYValue) => string>;
        default: undefined;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<XYValue>;
        required: true;
    };
    /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
    x: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    /** Vertical axis, Cartesian (top = max). Same defaults as x. */
    y: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
    size: {
        type: NumberConstructor;
        default: number;
    };
    /**
     * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
     * faint at rest and stronger on interaction. Pass `false` to hide it, or a
     * number for a uniform N×N count. `density` multiplies whichever grid applies.
     */
    grid: {
        type: PropType<boolean | number>;
        default: undefined;
    };
    /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density: {
        type: NumberConstructor;
        default: number;
    };
    /** Snap the emitted value to each axis's step. Default false (continuous). */
    snap: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Spring back to centre on release (joystick). Default false = hold. */
    returnToCenter: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Show the live value next to each axis label (default false = label only). */
    showValues: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Override the readout / aria-valuetext text. Owns the full string. */
    formatValue: {
        type: PropType<(value: XYValue) => string>;
        default: undefined;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    x: XYAxis;
    y: XYAxis;
    shortcut: ShortcutConfig;
    grid: number | boolean;
    size: number;
    shortcutActive: boolean;
    density: number;
    snap: boolean;
    returnToCenter: boolean;
    showValues: boolean;
    disabled: boolean;
    formatValue: (value: XYValue) => string;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

/**
 * Config wrapper for the XY pad — the `{ type: 'xy' }` case. Reads the resolved
 * ControlMeta fields and forwards them to the standalone XYPad, mirroring how
 * ColorControl wraps ColorPickerPanel.
 */
declare const XYControl: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<XYValue>;
        required: true;
    };
    x: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    y: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    grid: {
        type: PropType<boolean | number>;
        default: undefined;
    };
    density: {
        type: NumberConstructor;
        default: undefined;
    };
    snap: {
        type: BooleanConstructor;
        default: undefined;
    };
    returnToCenter: {
        type: BooleanConstructor;
        default: undefined;
    };
    showValues: {
        type: BooleanConstructor;
        default: undefined;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: PropType<XYValue>;
        required: true;
    };
    x: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    y: {
        type: PropType<XYAxis>;
        default: undefined;
    };
    grid: {
        type: PropType<boolean | number>;
        default: undefined;
    };
    density: {
        type: NumberConstructor;
        default: undefined;
    };
    snap: {
        type: BooleanConstructor;
        default: undefined;
    };
    returnToCenter: {
        type: BooleanConstructor;
        default: undefined;
    };
    showValues: {
        type: BooleanConstructor;
        default: undefined;
    };
    shortcut: {
        type: PropType<ShortcutConfig>;
        default: undefined;
    };
    shortcutActive: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    x: XYAxis;
    y: XYAxis;
    shortcut: ShortcutConfig;
    grid: number | boolean;
    shortcutActive: boolean;
    density: number;
    snap: boolean;
    returnToCenter: boolean;
    showValues: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

type PresetRow = {
    id: string;
    name: string;
    deletable?: boolean;
};
declare const PresetManager: vue.DefineComponent<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    presets: {
        type: PropType<PresetRow[]>;
        required: true;
    };
    activePresetId: {
        type: PropType<string | null>;
        required: false;
        default: null;
    };
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    presets: {
        type: PropType<PresetRow[]>;
        required: true;
    };
    activePresetId: {
        type: PropType<string | null>;
        required: false;
        default: null;
    };
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    activePresetId: string | null;
    providerMode: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

export { type ActionConfig, type AffordanceConfig, type AffordanceContext, type AffordanceStatus, type AnalyserMode, type AnalyserScale, type AnalyserSource, type AnalyserSpring, type AnalyserVariant, AnalyserVisualization, ButtonGroup, type ColorConfig, ColorControl, ColorPickerPanel, type ControlMeta, ControlRenderer, ControlShell, CurveComposer, type CurveComposition, type CurveDriver, type CurveSegment, type CurveType, DEFAULT_GRADIENT, type DialConfig, type DialKitDirectiveOptions, type DialKitDirectiveValue, type DialMode, type DialPosition, DialRoot, DialStore, type DialTheme, DialTimeline, type DialTimelineValues, type DialValue, type DriverDirection, type EasingConfig, EasingVisualization, Folder, type GradientConfig, GradientControl, GradientPanel, type GradientStop, type GradientType, type GradientValue, MIN_STOPS, Module, type PanelConfig, type Preset, type PresetItem, PresetManager, type PresetProvider, type PresetProviderPreset, RangeSlider, type ResolvedValues, SegmentedControl, type SelectConfig, SelectControl, type ShortcutConfig, ShortcutKey, ShortcutListener, type ShortcutState, ShortcutsMenu, Slider, type SpringConfig, SpringControl, SpringVisualization, type TextConfig, TextControl, type TimelineClipConfig, type TimelineClipCss, type TimelineClipLoop, type TimelineClipMeta, type TimelineClipTrackMeta, type TimelineClipValues, type TimelineConfig, type TimelineGroupConfig, type TimelineGroupValues, type TimelineMeta, type TimelinePropConfig, type TimelinePropStepConfig, type TimelineStepConfig, type TimelineStepValues, TimelineStore, TimelineToggleButton, type TimelineTransport, Toggle, type TransitionConfig, TransitionControl, type UseDialOptions, type UseDialTimelineOptions, type WaveformLoop, type WaveformMode, WaveformVisualization, type XYAxis, type XYConfig, XYControl, XYPad, type XYValue, addStop, colorAtPosition, gradientToCss, moveStop, normalizeGradient, removeStop, setGradientAngle, setGradientType, setStopColor, useDialKit, useDialTimeline, useShortcutContext, vDialKit };
