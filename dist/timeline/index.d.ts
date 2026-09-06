/** Opt-in meanings for numeric Move faces. Values keep the host's units. */
type MoveSliderVisual = {
    kind: 'opacity';
    opaqueValue?: number;
} | {
    kind: 'blur';
} | {
    kind: 'pan';
    left?: number;
    center?: number;
    right?: number;
} | {
    kind: 'stereo-width';
    mono?: number;
    unity?: number;
} | {
    kind: 'pitch';
    unit?: 'semitones' | 'cents';
};
type MovePlaybackMode = 'forward' | 'reverse' | 'ping-pong' | 'scissors';
type MoveSelectVisual = {
    kind: 'playback';
    /** Map host option values to drawings. Omit when values are mode names. */
    modes?: Record<string, MovePlaybackMode>;
};

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

type XYValue = {
    x: number;
    y: number;
};

interface FilterAxisConfig {
    min?: number;
    max?: number;
    step?: number;
    default?: number;
    label?: string;
    formatValue?: (value: number) => string;
}
interface FilterValue {
    cutoff: number;
    resonance: number;
}

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
    /** The button's own text. */
    label?: string;
    /**
     * Text at the left of the row, with the button pushed to the right — the
     * same shape as every other control row. Use it when the button acts ON
     * something the row should name ("kick … [Load]"). Without it the button
     * fills the row and carries the meaning alone.
     */
    caption?: string;
};
type SelectConfig = {
    type: 'select';
    /** Optional semantic drawing for the Move surface. */
    moveVisual?: MoveSelectVisual;
    /**
     * An option may name an `icon` from `LUCIDE_ICONS` — the Move slot draws it
     * instead of making you read the mode name off a controller.
     */
    options: (string | {
        value: string;
        label: string;
        icon?: string;
    })[];
    default?: string;
    /** 'segmented' renders the options as an inline segmented control instead of a dropdown. Suits 2–4 short options. */
    display?: 'dropdown' | 'segmented';
    /**
     * The shape an option stands for: `t` in [0,1] → y, auto-fitted and drawn
     * in the Move slot in place of the option's name, which moves to a small
     * tag at the top. Return `null` for options that have no shape.
     *
     * A closure, so — like a curve row's `sample` — it is invisible to the
     * serialized config diff and is refreshed through `syncCurveConfigs`. That
     * is what lets the drawing follow the app's other controls: a pitch arc's
     * preview tracks its bell and flip while the picker stays a picker.
     */
    preview?: (value: string) => ((t: number) => number) | null | undefined;
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
/**
 * The 2-slot filter control: one value, two hands — cutoff on the left,
 * resonance on the right. On the Move it claims two dial slots and draws
 * its magnitude response across both; inline it is one row for the same
 * pair. `response` is a closure like a curve row's `sample` (refreshed
 * through `syncCurveConfigs`); without one the kit draws its own lowpass.
 */
type FilterConfig = {
    type: 'filter';
    /** Starting point. Missing hands open the filter: cutoff max, resonance min. */
    default?: Partial<FilterValue>;
    cutoff?: FilterAxisConfig;
    resonance?: FilterAxisConfig;
    /** The drawn magnitude response, from each hand's 0..1 position. */
    response?: (cutoff01: number, resonance01: number) => (t: number) => number;
    /**
     * `false` draws the control bypassed — the curve still shows (so the slot
     * reads as a filter, not an empty display) but greyed out, the way a
     * disabled module dims. Defaults to on.
     */
    enabled?: boolean;
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
    /** Optional semantic drawing for the Move surface; never inferred from labels. */
    moveVisual?: MoveSliderVisual;
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
    /** `vertical` renders the column card (fill grows bottom-up, label at base). */
    orientation?: 'horizontal' | 'vertical';
};
/**
 * Scrub-anywhere numeric readout. Unlike a slider it has no track — drag the
 * card to nudge the value, click to type — and bounds are optional, so it is
 * the control for open-ended quantities (dB trims, sample offsets, seeds).
 */
type NumberConfig = {
    type: 'number';
    default: number;
    min?: number;
    max?: number;
    /** Falls back to a step inferred from `default`'s precision when omitted. */
    step?: number;
    /** Appended to the displayed value, e.g. ' dB', ' ms', '×'. */
    unit?: string;
    /** Override the displayed value text entirely; `unit` is not auto-appended. */
    formatValue?: (value: number) => string;
    /** `vertical` stacks the label above a centered value (column card). */
    orientation?: 'horizontal' | 'vertical';
};
/**
 * A read-only curve preview row. Draws the shape the host's own parameters
 * produce (e.g. a pitch arc from a shape select plus modifier sliders); it
 * holds no value of its own, so nothing lands in ResolvedValues, presets, or
 * persistence. `sample` is a function and therefore invisible to the
 * serialized config diff (like `formatValue`); adapters push replacements
 * through `TweakStore.syncCurveConfigs` so the drawing tracks the host.
 */
type CurveConfig = {
    type: 'curve';
    /** t in [0,1] → y. Non-finite results are skipped (the stroke breaks there). */
    sample: (t: number) => number;
    /** Fixed y-range to fit. Default: auto-fit each draw with a little headroom. */
    domain?: [number, number];
    /** Vertical reference lines at these x positions in [0,1]; invalid entries are skipped. */
    markers?: readonly number[];
    /** Surface height in px, clamped to 32–160. Default 64. Ignored when `aspect` is set. */
    height?: number;
    /**
     * Width ÷ height. Sizes the surface from its own width instead of `height`,
     * so the plot holds its proportions at any column width — what a transfer
     * curve wants, since its two axes share a scale. `1` is square, `4 / 3` a
     * little wider than tall.
     */
    aspect?: number;
    /** `false` = full-bleed row without the label line; a string overrides the key-derived label. */
    label?: false | string;
};
/**
 * A read-only live-analyser row: the panel-embedded form of the standalone
 * `AnalyserVisualization`. Like the curve row it holds no value — nothing
 * lands in ResolvedValues, presets, or persistence — and its function-valued
 * fields (`analyser`, `marker`) are invisible to the serialized config diff,
 * so adapters keep them fresh through `TweakStore.syncCurveConfigs`.
 */
type AnalyserConfig = {
    type: 'analyser';
    /** The live AnalyserNode, read at render — a getter so the host can hand it over late (audio contexts start on gesture). */
    analyser: () => AnalyserNode | null;
    /** 'frequency' (default) — live spectrum. 'waveform' — oscilloscope. */
    source?: 'frequency' | 'waveform';
    variant?: 'line' | 'area';
    /** 'pixelated' (default here — the panel's block language) or 'smooth'. */
    mode?: 'smooth' | 'pixelated';
    pixelSize?: number;
    scale?: 'log' | 'linear';
    spring?: boolean | {
        stiffness?: number;
        damping?: number;
    };
    /** Spectrum only: confine the display to this frequency window in Hz. */
    rangeHz?: readonly [number, number];
    /** Spectrum only: a live vertical reference in Hz, read every frame. */
    marker?: () => number | null;
    /** Surface height in px, clamped like the curve row's. Default 56. */
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
type TweakValue = number | boolean | string | string[] | XYValue | SpringConfig | EasingConfig | ActionConfig | SelectConfig | SliderConfig | NumberConfig | ColorConfig | GradientConfig | GradientValue | XYConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | MultiSelectConfig | ListConfig | ListItemValue[] | RangeConfig | RangeValue | FilterConfig | FilterValue;
type TweakConfig = {
    [key: string]: TweakValue | [number, number, number, number?] | CurveConfig | AnalyserConfig | TweakConfig;
};
/** UI-only reserved keys: they shape the panel, never resolve to a value. */
type ReservedKey = '_collapsed' | '_collapsible' | '_tabs';
type ResolvedValues<T extends TweakConfig> = {
    [K in keyof T as T[K] extends CurveConfig ? never : K extends ReservedKey ? never : K]: T[K] extends [number, number, number, number?] ? number : T[K] extends SliderConfig ? number : T[K] extends NumberConfig ? number : T[K] extends MultiSelectConfig ? string[] : T[K] extends SpringConfig ? TransitionConfig : T[K] extends EasingConfig ? TransitionConfig : T[K] extends SelectConfig ? string : T[K] extends ColorConfig ? string : T[K] extends GradientConfig ? GradientValue : T[K] extends XYConfig ? XYValue : T[K] extends TextConfig ? string : T[K] extends RangeConfig ? RangeValue : T[K] extends FilterConfig ? FilterValue : T[K] extends GalleryConfig ? string : T[K] extends FileConfig ? string : T[K] extends SwatchConfig ? string : T[K] extends ChipsConfig ? string : T[K] extends ListConfig ? ListItemValue[] : T[K] extends TweakConfig ? ResolvedValues<T[K]> : T[K];
};
type TweakersPersistOptions = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};

/**
 * Fail-soft browser persistence shared by TweakStore (panel values) and
 * TimelineStore (loop regions). Kept separate so the stores stay node-safe and
 * side-effect-free: nothing here touches `window` at import time, and every
 * storage access is guarded + try/caught. When storage is unavailable (SSR,
 * Safari private mode, blocked cookies) persistence silently degrades to
 * session-only — a broken shelf must never break the tool.
 *
 * Mirrors the style of color-palette-store.ts.
 */
/** Structural mirror of TweakersPersistOptions — duplicated here to keep this
 * module free of a TweakStore import (avoids a store ↔ persist cycle). */
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
    /** Code-defined playback behavior; intentionally not exposed as a control. */
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
type Listener$1 = () => void;
/** A user- or code-defined loop window `[start, end]` in seconds. Absent means
 * "loop the whole timeline" — the default for this preview tool. */
type TimelineLoopRegion = {
    start: number;
    end: number;
};
/** Length of the repeating span for a loop region `[start, end]` (end defaults
 * to the whole timeline). Degenerate regions (empty or inverted) fall back to
 * the whole timeline so a bad region never stalls the clock. */
declare function loopSpan(duration: number, loopStart: number, loopEnd?: number): number;
/** Folds an over-run playhead back into the loop region `[start, end]` (end
 * defaults to the timeline end), reporting how many spans were crossed so
 * continuous time (wraps × span + time) never jumps at the wrap. */
declare function foldLoopTime(time: number, duration: number, loopStart?: number, loopEnd?: number): {
    time: number;
    wraps: number;
};
declare const TIMELINE_CLIP_COLORS: string[];
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
    subscribe(id: string, listener: Listener$1): () => void;
    subscribeGlobal(listener: Listener$1): () => void;
    private applyMeta;
    private ensureLoop;
    private tick;
    private notify;
    private notifyGlobal;
}
declare const TimelineStore: TimelineStoreClass;

type SpringParams = {
    stiffness: number;
    damping: number;
    mass: number;
};
declare function clamp(value: number, min: number, max: number): number;

type TimelineClipLoop = 'off' | 'repeat';
type TimelineStepValues = {
    [key: string]: TweakConfig[string] | undefined;
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
    from?: TweakConfig;
    to?: TweakConfig;
    steps?: never;
    props?: never;
} | {
    from?: TweakConfig;
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
    } : C['from'] extends TweakConfig ? ResolvedValues<C['from']> : undefined;
    to: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends TweakConfig ? ResolvedValues<C['to']> : undefined;
    /** `to` once the clip has started, `from` before — hand it to Motion's animate.
     * For sequences this is the final merged state; for props clips, per-track
     * endpoint records. */
    animate: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> : Record<string, number | string> | undefined : C['to'] extends TweakConfig ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : ResolvedValues<C['to']> | undefined : undefined;
    /** The clip's editable curve — single-curve clips only. */
    transition: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: TweakConfig;
    } | {
        to: TweakConfig;
    } ? TransitionConfig : undefined;
    /** Duration + timing-function for native CSS transitions — single-curve clips only. */
    css: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: TweakConfig;
    } | {
        to: TweakConfig;
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
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends TweakConfig ? C['from'] extends TweakConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : undefined : undefined;
};
type TimelineGroupValues<G extends TimelineGroupConfig> = {
    [K in keyof G as G[K] extends TimelineClipConfig ? K : never]: TimelineClipValues<Extract<G[K], TimelineClipConfig>>;
};
type TweakTimelineValues<T extends TimelineConfig> = {
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
declare const TIMELINE_MIN_CLIP_DURATION = 0.05;
type ParsedTimeline = {
    duration: number;
    tweakConfig: TweakConfig;
    clips: TimelineClipMeta[];
};
declare function parseTimelineConfig(config: TimelineConfig): ParsedTimeline;
type CurveStatic = {
    duration: number;
    spring?: SpringParams;
    settle?: number;
    ease?: [number, number, number, number];
};
type TimelineStepStatic = {
    key: string | null;
    offset: number;
    duration: number;
    isPhysics: boolean;
    /** Full property state at step start — the hold rule made concrete. */
    start: Record<string, unknown>;
    /** Targets this step animates; untouched properties hold `start`. */
    to: Record<string, unknown>;
    curve: CurveStatic;
};
/**
 * One track: a step chain with its own cycle length and phase offset from
 * the clip's `at`. This is the unified runtime model — a shared-timing clip
 * is exactly one track (prop unset, delay 0) whose steps carry the full
 * property record; a props clip is one single-property track per entry.
 */
type TimelineTrackStatic = {
    /** Set for a props clip's single-property tracks; unset for the shared track. */
    prop?: string;
    delay: number;
    duration: number;
    steps: TimelineStepStatic[];
};
type TimelineClipStatic = {
    key: string;
    childKey: string;
    group?: string;
    at: number;
    /** Effective total duration — the bar length (one cycle for looping clips;
     * the widest track extent for props clips). */
    duration: number;
    loop: TimelineClipLoop;
    /** Where the clip stops affecting values: at + duration, or the timeline end when looping. */
    end: number;
    isPhysics: boolean;
    /** Motion-ready transition, its duration injected from the bar — single-curve clips only. */
    transition?: TransitionConfig;
    css?: TimelineClipCss;
    from?: Record<string, unknown>;
    /** Final merged state (the last leg's landing values for sequences). */
    to?: Record<string, unknown>;
    /** Every animating clip is tracks; empty for markers. */
    tracks: TimelineTrackStatic[];
    explicitSteps: boolean;
    /** Union of every property the clip touches. */
    props?: string[];
};
declare function computeStaticClips(parsed: ParsedTimeline, flatValues: Record<string, TweakValue>): TimelineClipStatic[];
type TimelineStaticState = {
    duration: number;
    clips: TimelineClipStatic[];
};
/**
 * Resolves the editable clip model and grows the timeline when a live value
 * creates content beyond its authored window. This is most important for
 * physics springs: changing stiffness/damping changes their emergent length.
 * The parsed duration remains the minimum, so shortening a clip never removes
 * the original editing room.
 */
declare function computeStaticTimeline(parsed: ParsedTimeline, flatValues: Record<string, TweakValue>): TimelineStaticState;
/** The dock's resolver: the same static model the hook animates with,
 * rebuilt from flat stored values — bars, popovers, and playback can never
 * disagree about geometry. */
declare function computeClipStaticFromValues(values: Record<string, TweakValue>, clip: TimelineClipMeta, timelineDuration: number): TimelineClipStatic;
/**
 * `time` is the playhead (what the dock shows); `cycleTime` is continuous
 * time across timeline wraps (wraps × duration + time). Looping clips fold
 * against `cycleTime`, so a looping timeline never snaps their phase — the
 * window is a viewport onto animations that repeat forever. Scrubbing seeks
 * with cycleTime === time, which is the deterministic first-pass state.
 */
declare function computeClipState(clip: TimelineClipStatic, time: number, cycleTime?: number): Record<string, unknown>;
declare function transitionToCss(transition: TransitionConfig | undefined): TimelineClipCss | undefined;
/** Popover display values: swap stored shape-only transitions for their
 * effective configs (duration injected from the bar/segment) so the curve
 * editor shows the transition as it actually runs. */
declare function timelinePopoverDisplayValues(values: Record<string, TweakValue>, clipKey: string, stepKeys?: string[], stepKey?: string): Record<string, TweakValue>;
/** Dragging a track bar edits the property's phase offset. */
declare function clampTrackDelay(delay: number, at: number, trackDuration: number, timelineDuration: number): number;
declare function clampClipMove(at: number, duration: number, timelineDuration: number): number;
declare function clampClipResizeEnd(duration: number, at: number, timelineDuration: number): number;
declare function clampClipResizeStart(newAt: number, at: number, duration: number): {
    at: number;
    duration: number;
};
/** Resizing one leg of a sequence: the other legs keep their length, the
 * whole bar must still fit the timeline. */
declare function clampStepResize(duration: number, at: number, otherStepsTotal: number, timelineDuration: number): number;
/** Copy-for-agent export: strip editor-only state, normalize shape-only
 * transitions, resolve physics durations, and drop zero-value defaults. */
declare function normalizeTimelineValuesForCopy(values: Record<string, TweakValue>, clips: TimelineClipMeta[]): Record<string, TweakValue>;
declare function formatClock(time: number, tenths?: boolean): string;
declare function formatSeconds(value: number): string;
declare function formatStepLabel(stepKey: string): string;

interface TweakTimelineOptions {
    id?: string;
    persist?: TweakersPersistOptions;
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
type TimelineActions = {
    play: () => void;
    pause: () => void;
    replay: () => void;
    seek: (time: number) => void;
};
/** One resolution of the public loop option, shared by every adapter. */
declare function resolveTimelineLoop(loop: TweakTimelineOptions['loop']): {
    enabled: boolean;
    start: number;
};
declare function buildTimelineMeta(id: string, name: string, duration: number, parsed: ParsedTimeline, loop: TweakTimelineOptions['loop']): TimelineMeta;
/**
 * Framework-neutral frame pass. Adapters only own lifecycle and reactivity;
 * the value shape and loop-cycle math stay identical everywhere.
 */
declare function buildTimelineValues<T extends TimelineConfig>(staticClips: TimelineClipStatic[], transport: TimelineTransport, timelineDuration: number, loopStart: number, loopEnd: number, actions: TimelineActions): TweakTimelineValues<T>;

type Listener = () => void;
type VisibilityController = {
    visible?: boolean;
    defaultVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
};
/**
 * UI-only state shared by the toolkit root and the timeline portal.
 * Playback deliberately lives elsewhere: hiding the editor must never pause
 * or otherwise change the animation it is inspecting.
 */
declare class TimelineUiStoreClass {
    private visible;
    private initialized;
    private controllers;
    private listeners;
    getVisible(): boolean;
    registerController(id: symbol, controller: VisibilityController): () => void;
    updateController(id: symbol, controller: VisibilityController): void;
    requestVisible(visible: boolean): void;
    toggle(): void;
    subscribe(listener: Listener): () => void;
    private notify;
}
declare const TimelineUiStore: TimelineUiStoreClass;

declare function buildCopyInstruction(hookName: string, panelName: string, values: Record<string, TweakValue>): string;

declare const isDevDefault: boolean;

export { type ParsedTimeline, TIMELINE_CLIP_COLORS, TIMELINE_MIN_CLIP_DURATION, type TimelineActions, type TimelineClipConfig, type TimelineClipCss, type TimelineClipLoop, type TimelineClipMeta, type TimelineClipStatic, type TimelineClipTrackMeta, type TimelineClipValues, type TimelineConfig, type TimelineGroupConfig, type TimelineGroupValues, type TimelineMeta, type TimelinePropConfig, type TimelinePropStepConfig, type TimelineStaticState, type TimelineStepConfig, type TimelineStepStatic, type TimelineStepValues, TimelineStore, type TimelineTrackStatic, type TimelineTransport, TimelineUiStore, type TweakTimelineOptions, type TweakTimelineValues, buildCopyInstruction, buildTimelineMeta, buildTimelineValues, clamp, clampClipMove, clampClipResizeEnd, clampClipResizeStart, clampStepResize, clampTrackDelay, computeClipState, computeClipStaticFromValues, computeStaticClips, computeStaticTimeline, foldLoopTime, formatClock, formatSeconds, formatStepLabel, isDevDefault, loopSpan, normalizeTimelineValuesForCopy, parseTimelineConfig, resolveTimelineLoop, timelinePopoverDisplayValues, transitionToCss };
