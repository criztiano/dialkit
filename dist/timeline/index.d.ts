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
};
/**
 * A sub-control field inside a list item type's schema. Uses the same shorthand
 * as a panel config, but scalar-only (no nested folders or non-value controls).
 */
type ListItemField = [number, number, number, number?] | number | boolean | string | SelectConfig | ColorConfig | TextConfig;
type ListItemType = {
    /** Shown in the add menu and as the row's title. */
    label: string;
    /** Sub-controls for this item type, keyed by param name. */
    schema: Record<string, ListItemField>;
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
type DialValue = number | boolean | string | XYValue | SpringConfig | EasingConfig | ActionConfig | SelectConfig | ColorConfig | GradientConfig | GradientValue | XYConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | ListConfig | ListItemValue[] | RangeConfig | RangeValue;
type DialConfig = {
    [key: string]: DialValue | [number, number, number, number?] | DialConfig;
};
type ResolvedValues<T extends DialConfig> = {
    [K in keyof T]: T[K] extends [number, number, number, number?] ? number : T[K] extends SpringConfig ? TransitionConfig : T[K] extends EasingConfig ? TransitionConfig : T[K] extends SelectConfig ? string : T[K] extends ColorConfig ? string : T[K] extends GradientConfig ? GradientValue : T[K] extends XYConfig ? XYValue : T[K] extends TextConfig ? string : T[K] extends RangeConfig ? RangeValue : T[K] extends GalleryConfig ? string : T[K] extends FileConfig ? string : T[K] extends SwatchConfig ? string : T[K] extends ChipsConfig ? string : T[K] extends ListConfig ? ListItemValue[] : T[K] extends DialConfig ? ResolvedValues<T[K]> : T[K];
};
type DialKitPersistOptions = boolean | {
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
type Listener$1 = () => void;
/** Length of the repeating span — the whole timeline unless a loop region
 * narrows it. Degenerate regions (start ≥ duration) fall back to the whole
 * timeline so a bad `from` never stalls the clock. */
declare function loopSpan(duration: number, loopStart: number): number;
/** Folds an over-run playhead back into the loop region, reporting how many
 * spans were crossed so continuous time (wraps × span + time) never jumps. */
declare function foldLoopTime(time: number, duration: number, loopStart?: number): {
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
    private listCache;
    private rafId;
    private lastTick;
    register(meta: TimelineMeta, options: {
        autoplay: boolean;
    }): void;
    update(meta: TimelineMeta): void;
    unregister(id: string): void;
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
declare const TIMELINE_MIN_CLIP_DURATION = 0.05;
type ParsedTimeline = {
    duration: number;
    dialConfig: DialConfig;
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
declare function computeStaticClips(parsed: ParsedTimeline, flatValues: Record<string, DialValue>): TimelineClipStatic[];
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
declare function computeStaticTimeline(parsed: ParsedTimeline, flatValues: Record<string, DialValue>): TimelineStaticState;
/** The dock's resolver: the same static model the hook animates with,
 * rebuilt from flat stored values — bars, popovers, and playback can never
 * disagree about geometry. */
declare function computeClipStaticFromValues(values: Record<string, DialValue>, clip: TimelineClipMeta, timelineDuration: number): TimelineClipStatic;
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
declare function timelinePopoverDisplayValues(values: Record<string, DialValue>, clipKey: string, stepKeys?: string[], stepKey?: string): Record<string, DialValue>;
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
declare function normalizeTimelineValuesForCopy(values: Record<string, DialValue>, clips: TimelineClipMeta[]): Record<string, DialValue>;
declare function formatClock(time: number, tenths?: boolean): string;
declare function formatSeconds(value: number): string;
declare function formatStepLabel(stepKey: string): string;

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
type TimelineActions = {
    play: () => void;
    pause: () => void;
    replay: () => void;
    seek: (time: number) => void;
};
/** One resolution of the public loop option, shared by every adapter. */
declare function resolveTimelineLoop(loop: DialTimelineOptions['loop']): {
    enabled: boolean;
    start: number;
};
declare function buildTimelineMeta(id: string, name: string, duration: number, parsed: ParsedTimeline, loop: DialTimelineOptions['loop']): TimelineMeta;
/**
 * Framework-neutral frame pass. Adapters only own lifecycle and reactivity;
 * the value shape and loop-cycle math stay identical everywhere.
 */
declare function buildTimelineValues<T extends TimelineConfig>(staticClips: TimelineClipStatic[], transport: TimelineTransport, timelineDuration: number, loopStart: number, actions: TimelineActions): DialTimelineValues<T>;

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

declare function buildCopyInstruction(hookName: string, panelName: string, values: Record<string, DialValue>): string;

declare const isDevDefault: boolean;

export { type DialTimelineOptions, type DialTimelineValues, type ParsedTimeline, TIMELINE_CLIP_COLORS, TIMELINE_MIN_CLIP_DURATION, type TimelineActions, type TimelineClipConfig, type TimelineClipCss, type TimelineClipLoop, type TimelineClipMeta, type TimelineClipStatic, type TimelineClipTrackMeta, type TimelineClipValues, type TimelineConfig, type TimelineGroupConfig, type TimelineGroupValues, type TimelineMeta, type TimelinePropConfig, type TimelinePropStepConfig, type TimelineStaticState, type TimelineStepConfig, type TimelineStepStatic, type TimelineStepValues, TimelineStore, type TimelineTrackStatic, type TimelineTransport, TimelineUiStore, buildCopyInstruction, buildTimelineMeta, buildTimelineValues, clamp, clampClipMove, clampClipResizeEnd, clampClipResizeStart, clampStepResize, clampTrackDelay, computeClipState, computeClipStaticFromValues, computeStaticClips, computeStaticTimeline, foldLoopTime, formatClock, formatSeconds, formatStepLabel, isDevDefault, loopSpan, normalizeTimelineValuesForCopy, parseTimelineConfig, resolveTimelineLoop, timelinePopoverDisplayValues, transitionToCss };
