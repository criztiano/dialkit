import * as solid_js from 'solid-js';
import { Accessor, JSX } from 'solid-js';

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
declare const DEFAULT_GRADIENT: GradientValue;
/** Ready CSS gradient string for any of the three types. #rrggbbaa is valid CSS. */
declare function gradientToCss(value: GradientValue): string;

type XYValue = {
    x: number;
    y: number;
};
/** A fully-resolved axis — every field required (see `resolveAxis` for defaults). */
type AxisSpec = {
    min: number;
    max: number;
    step: number;
    /** Value the escapable centre detent snaps to (midpoint for bipolar, else min). */
    origin: number;
    /** When true, the axis has a meaningful centre → enables the centre detent. */
    bipolar: boolean;
};
/**
 * Screen-normalized position: each component in [0,1]. y=0 is the TOP, y=1 is the
 * BOTTOM, so it drops straight into CSS `left: x*100%` / `top: y*100%`.
 */
type Point = {
    x: number;
    y: number;
};
/** Pixel radius of the centre detent's capture band (see `applyDetentAxis`). */
declare const XY_DETENT_PX = 6;
/** Fallback step when an axis omits one. */
declare const XY_DEFAULT_STEP = 0.01;
/**
 * Resolve a partial axis into a fully-specified one. Defaults: min=0, max=1,
 * step=XY_DEFAULT_STEP, bipolar=false. `origin` falls back to the axis midpoint for a
 * bipolar axis (its natural rest/centre) or to `min` otherwise. Never mutates the input.
 */
declare function resolveAxis(axis?: Partial<{
    min: number;
    max: number;
    step: number;
    origin: number;
    bipolar: boolean;
}>): AxisSpec;
/** Clamp `v` into [min, max]. */
declare function clamp(v: number, min: number, max: number): number;
/**
 * Snap `v` to the nearest multiple of `step` measured from `min`, then round to the
 * step's precision to kill float dust. A non-positive step means "no grid" → passthrough.
 */
declare function snapToStep(v: number, step: number, min: number): number;
/**
 * Map a value to [0,1] along the axis (0 at min, 1 at max), clamped. A degenerate axis
 * (max===min) has no extent to map into, so it collapses to 0.
 */
declare function valueToNorm(v: number, axis: AxisSpec): number;
/** Inverse of `valueToNorm` (no snapping). `n` is clamped to [0,1] first. */
declare function normToValue(n: number, axis: AxisSpec): number;
/**
 * Flip between screen-y (down) and Cartesian-y (up). This is the ONE place the two
 * y conventions meet — value→point and point→value both route through it.
 */
declare function invertY(n: number): number;
/**
 * Screen point (y-down) → Cartesian value. x maps directly; y is inverted so the top of
 * the pad reads as the axis maximum. Each result is clamped into its axis range, and
 * optionally snapped to the axis step.
 *
 * Corner contract: {x:0,y:1} (bottom-left) → {x:xMin, y:yMin};
 *                  {x:1,y:0} (top-right)   → {x:xMax, y:yMax}.
 */
declare function valueFromPoint(point: Point, xAxis: AxisSpec, yAxis: AxisSpec, snap?: boolean): XYValue;
/**
 * Cartesian value → screen point (inverse of `valueFromPoint`, for CSS positioning).
 * y is inverted so a value at yMax yields point.y=0 (the top of the pad).
 */
declare function pointFromValue(value: XYValue, xAxis: AxisSpec, yAxis: AxisSpec): Point;
/**
 * Escapable centre detent for one axis. While the pointer is within `XY_DETENT_PX` of the
 * origin position, the value sticks to `axis.origin`; move further and the live `value`
 * passes through untouched. Only bipolar axes have a centre to snap to. The component
 * supplies the pixel distance from the origin's screen position.
 */
declare function applyDetentAxis(value: number, axis: AxisSpec, pxFromOrigin: number): number;
/**
 * Nudge one axis by a keyboard step and return a NEW value (the other axis is copied
 * untouched). Cartesian: direction +1 is UP/right → larger value; -1 is down/left. The
 * result is clamped into range and rounded to the step's precision.
 */
declare function nudge(value: XYValue, axis: 'x' | 'y', direction: -1 | 1, xAxis: AxisSpec, yAxis: AxisSpec, mode?: 'fine' | 'normal' | 'coarse'): XYValue;
/**
 * Return-to-centre / joystick rest target: each axis's origin. For a bipolar (or
 * explicit-origin) axis this is the visual centre; a plain non-bipolar 0..1 axis rests
 * at its min, which is the intended behaviour for that case.
 */
declare function centerValue(xAxis: AxisSpec, yAxis: AxisSpec): XYValue;
/**
 * Defensively normalize a possibly-partial/garbage value into a clean in-range XYValue.
 * Missing or non-finite (NaN/±Infinity) components fall back to the axis origin; each is
 * clamped into range and optionally snapped. Negative zero is normalized to 0. The input
 * is never mutated.
 */
declare function normalizeValue(value: Partial<XYValue> | undefined, xAxis: AxisSpec, yAxis: AxisSpec, snap?: boolean): XYValue;

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
type ShortcutMode = 'fine' | 'normal' | 'coarse';
type ShortcutInteraction = 'scroll' | 'drag' | 'move' | 'scroll-only';
type ShortcutConfig = {
    key?: string;
    modifier?: 'alt' | 'shift' | 'meta';
    mode?: ShortcutMode;
    interaction?: ShortcutInteraction;
};
type ControlMeta = {
    type: 'slider' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'gradient' | 'xy' | 'text' | 'range' | 'gallery' | 'file' | 'swatch' | 'chips' | 'list';
    path: string;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    /** Range control's configured reset target — its `default`, else the full {min,max} span. */
    rangeDefault?: RangeValue;
    children?: ControlMeta[];
    defaultOpen?: boolean;
    options?: (string | {
        value: string;
        label: string;
    })[];
    placeholder?: string;
    items?: GalleryItem[];
    columns?: number;
    accept?: string;
    multiple?: boolean;
    swatchOptions?: SwatchOption[];
    chipOptions?: ChipOption[];
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
    shortcut?: ShortcutConfig;
};
type PanelConfig = {
    id: string;
    name: string;
    controls: ControlMeta[];
    values: Record<string, DialValue>;
    shortcuts: Record<string, ShortcutConfig>;
};
type Listener = () => void;
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
    op: 'add' | 'remove' | 'move' | 'set';
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
declare class DialStoreClass {
    private panels;
    private listeners;
    private globalListeners;
    private snapshots;
    private actionListeners;
    private eventListeners;
    private presets;
    private activePreset;
    private baseValues;
    registerPanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>): void;
    updatePanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>): void;
    unregisterPanel(id: string): void;
    updateValue(panelId: string, path: string, value: DialValue): void;
    updateSpringMode(panelId: string, path: string, mode: 'simple' | 'advanced'): void;
    getSpringMode(panelId: string, path: string): 'simple' | 'advanced';
    updateTransitionMode(panelId: string, path: string, mode: 'easing' | 'simple' | 'advanced'): void;
    getTransitionMode(panelId: string, path: string): 'easing' | 'simple' | 'advanced';
    getValue(panelId: string, path: string): DialValue | undefined;
    getValues(panelId: string): Record<string, DialValue>;
    getPanels(): PanelConfig[];
    getPanel(id: string): PanelConfig | undefined;
    subscribe(panelId: string, listener: Listener): () => void;
    subscribeGlobal(listener: Listener): () => void;
    subscribeActions(panelId: string, listener: ActionListener): () => void;
    triggerAction(panelId: string, path: string): void;
    subscribeEvents(panelId: string, listener: EventListener): () => void;
    emitEvent(panelId: string, path: string, event: DialEvent): void;
    savePreset(panelId: string, name: string): string;
    loadPreset(panelId: string, presetId: string): void;
    deletePreset(panelId: string, presetId: string): void;
    getPresets(panelId: string): Preset[];
    getActivePresetId(panelId: string): string | null;
    clearActivePreset(panelId: string): void;
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
    private isListConfig;
    private isHexColor;
    private formatLabel;
    private inferRange;
    private inferStep;
    private normalizePreservedValue;
    private roundToStep;
    private stepPrecision;
    private mapControlsByPath;
}
declare const DialStore: DialStoreClass;

interface CreateDialOptions {
    onAction?: (action: string) => void;
    shortcuts?: Record<string, ShortcutConfig>;
}
declare function createDialKit<T extends DialConfig>(name: string, config: T, options?: CreateDialOptions): Accessor<ResolvedValues<T>>;

type DialPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type DialMode = 'popover' | 'inline';
type DialTheme = 'light' | 'dark' | 'system';
interface DialRootProps {
    position?: DialPosition;
    defaultOpen?: boolean;
    mode?: DialMode;
    theme?: DialTheme;
    productionEnabled?: boolean;
}
declare function DialRoot(props: DialRootProps): solid_js.JSX.Element;

interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min` (classic left-anchored
     * fill, no detent).
     */
    origin?: number;
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar?: boolean;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Slider(props: SliderProps): solid_js.JSX.Element;

interface RangeSliderProps {
    label: string;
    value: RangeValue;
    onChange: (value: RangeValue) => void;
    /** Lower bound of the track. */
    min?: number;
    /** Upper bound of the track. */
    max?: number;
    step?: number;
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue?: RangeValue;
}
declare function RangeSlider(props: RangeSliderProps): solid_js.JSX.Element;

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Toggle(props: ToggleProps): solid_js.JSX.Element;

interface FolderProps {
    title: string;
    children: JSX.Element;
    defaultOpen?: boolean;
    isRoot?: boolean;
    inline?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    toolbar?: JSX.Element;
}
declare function Folder(props: FolderProps): JSX.Element;

interface ModuleProps {
    title: string;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    children?: JSX.Element;
}
/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. The switch doubles as the expand
 * control: disabling collapses the body away with a smooth height transition.
 */
declare function Module(props: ModuleProps): JSX.Element;

interface SegmentedControlOption<T extends string> {
    value: T;
    label: string;
}
interface SegmentedControlProps<T extends string> {
    options: SegmentedControlOption<T>[];
    value: T;
    onChange: (value: T) => void;
}
declare function SegmentedControl<T extends string>(props: SegmentedControlProps<T>): solid_js.JSX.Element;

interface ButtonGroupProps {
    buttons: Array<{
        label: string;
        onClick: () => void;
    }>;
}
declare function ButtonGroup(props: ButtonGroupProps): solid_js.JSX.Element;

interface SpringControlProps {
    panelId: string;
    path: string;
    label: string;
    spring: SpringConfig;
    onChange: (spring: SpringConfig) => void;
}
declare function SpringControl(props: SpringControlProps): solid_js.JSX.Element;

interface SpringVisualizationProps {
    spring: SpringConfig;
    isSimpleMode: boolean;
}
declare function SpringVisualization(props: SpringVisualizationProps): solid_js.JSX.Element;

type WaveformMode = 'smooth' | 'pixelated';
/** A loop region over the sample, as normalized 0..1 positions. */
type WaveformLoop = {
    start: number;
    end: number;
};

interface WaveformVisualizationProps {
    buffer?: AudioBuffer | null;
    progress?: number;
    getProgress?: () => number;
    mode?: WaveformMode;
    border?: boolean;
    bands?: boolean;
    pixelSize?: number;
    grid?: boolean;
    gridSubdivisions?: number;
    onSeek?: (progress: number) => void;
    loop?: WaveformLoop | null;
    onLoopChange?: (loop: WaveformLoop | null) => void;
    waveColor?: string;
    playheadColor?: string;
    autoZoomOnLoop?: boolean;
    width?: number;
    height?: number;
}
declare function WaveformVisualization(props: WaveformVisualizationProps): solid_js.JSX.Element;

type AnalyserScale = 'log' | 'linear';
/** `true` enables the default spring; an object overrides stiffness/damping. */
type AnalyserSpring = boolean | {
    stiffness?: number;
    damping?: number;
};

type AnalyserSource = 'frequency' | 'waveform';
type AnalyserVariant = 'line' | 'area';
type AnalyserMode = 'smooth' | 'pixelated';

interface AnalyserVisualizationProps {
    analyser?: AnalyserNode | null;
    source?: AnalyserSource;
    variant?: AnalyserVariant;
    mode?: AnalyserMode;
    pixelSize?: number;
    scale?: AnalyserScale;
    spring?: AnalyserSpring;
    grid?: boolean;
    gridSubdivisions?: number;
    waveColor?: string;
    fillColor?: string;
    muted?: boolean;
    onMuteChange?: (muted: boolean) => void;
    soloed?: boolean;
    onSoloChange?: (soloed: boolean) => void;
    width?: number;
    height?: number;
}
declare function AnalyserVisualization(props: AnalyserVisualizationProps): solid_js.JSX.Element;

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

interface CurveComposerProps {
    /** The curve series (controlled). */
    segments: CurveSegment[];
    /** The stacked driver curve, or null for none (adds a second lane below). */
    driver?: CurveDriver | null;
    /** Playback direction for the demo playhead (forward / mirror / reverse). */
    direction?: DriverDirection;
    /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
    onSegmentsChange?: (segments: CurveSegment[]) => void;
    /** Commit a changed driver — fired live during driver drags and on click-cycle. */
    onDriverChange?: (driver: CurveDriver) => void;
    /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
    getPhase?: () => number;
    /** Static transport phase 0..1 (used when `getPhase` is absent). */
    phase?: number;
    /**
     * Output mode. 'continuous' (default) reads the composed value each frame; 'trigger'
     * emits a discrete signal (via `onTrigger`) when the composed value crosses one of the
     * evenly-spaced trigger levels. The component itself draws no trigger UI — visualization
     * (e.g. markers on the output track) is the consumer's job; see `onTrigger`.
     *
     * Trigger firing is direction-symmetric: interior levels fire in whichever direction the
     * value travels, so it works under `direction: 'forward' | 'mirror' | 'reverse'`.
     */
    mode?: 'continuous' | 'trigger';
    /** Number of trigger levels in trigger mode (first at 0, last at 1, evenly spaced in value). Default 5. */
    triggerSteps?: number;
    /** Fired in trigger mode when the value crosses a trigger level; `index` is into `triggerLevels`. */
    onTrigger?: (index: number) => void;
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex?: number | null;
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect?: (index: number) => void;
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor?: string;
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor?: string;
    /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
    gap?: number;
    /** Faint vertical reference grid behind each lane. */
    grid?: boolean;
    gridSubdivisions?: number;
    width?: number;
    /** Height of the main lane; the driver lane adds height below it. */
    height?: number;
}
declare function CurveComposer(props: CurveComposerProps): solid_js.JSX.Element;

interface TextControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
declare function TextControl(props: TextControlProps): solid_js.JSX.Element;

type SelectOption = string | {
    value: string;
    label: string;
};
interface SelectControlProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
}
declare function SelectControl(props: SelectControlProps): solid_js.JSX.Element;

interface ColorControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
}
declare function ColorControl(props: ColorControlProps): solid_js.JSX.Element;

interface ColorPickerPanelProps {
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
}
declare function ColorPickerPanel(props: ColorPickerPanelProps): solid_js.JSX.Element;

interface GradientControlProps {
    label: string;
    value: GradientValue;
    onChange: (value: GradientValue) => void;
}
declare function GradientControl(props: GradientControlProps): solid_js.JSX.Element;

interface GradientPanelProps {
    value: GradientValue;
    onChange: (value: GradientValue) => void;
    /** Incremental pointer delta while the drag grip is held. */
    onDrag?: (dx: number, dy: number) => void;
}
declare function GradientPanel(props: GradientPanelProps): solid_js.JSX.Element;

interface XYPadProps {
    label: string;
    value: XYValue;
    onChange: (value: XYValue) => void;
    /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
    x?: XYAxis;
    /** Vertical axis, Cartesian (top = max). Same defaults as x. */
    y?: XYAxis;
    /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
    size?: number;
    /**
     * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
     * faint at rest and stronger on interaction. Pass `false` to hide it, or a
     * number for a uniform N×N count. `density` multiplies whichever grid applies.
     */
    grid?: boolean | number;
    /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density?: number;
    /** Snap the emitted value to each axis's step. Default false (continuous). */
    snap?: boolean;
    /** Spring back to centre on release (joystick). Default false = hold. */
    returnToCenter?: boolean;
    /** Show the live value next to each axis label (default false = label only). */
    showValues?: boolean;
    disabled?: boolean;
    /** Override the readout / aria-valuetext text. Owns the full string. */
    formatValue?: (value: XYValue) => string;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
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
declare function XYPad(props: XYPadProps): JSX.Element;

interface XYControlProps {
    label: string;
    value: XYValue;
    onChange: (value: XYValue) => void;
    x?: XYAxis;
    y?: XYAxis;
    grid?: boolean | number;
    density?: number;
    snap?: boolean;
    returnToCenter?: boolean;
    showValues?: boolean;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
/**
 * Config wrapper for the XY pad — the `{ type: 'xy' }` case. Reads the resolved
 * ControlMeta fields and forwards them to the standalone XYPad, mirroring how
 * ColorControl wraps ColorPickerPanel.
 */
declare function XYControl(props: XYControlProps): solid_js.JSX.Element;

interface PresetManagerProps {
    panelId: string;
    presets: Preset[];
    activePresetId: string | null;
    onAdd: () => void;
}
declare function PresetManager(props: PresetManagerProps): solid_js.JSX.Element;

export { type ActionConfig, type AnalyserMode, type AnalyserScale, type AnalyserSource, type AnalyserSpring, type AnalyserVariant, AnalyserVisualization, type AxisSpec, ButtonGroup, type ColorConfig, ColorControl, ColorPickerPanel, type ControlMeta, type CreateDialOptions, CurveComposer, type CurveComposition, type CurveDriver, type CurveSegment, type CurveType, DEFAULT_GRADIENT, type DialConfig, type DialMode, type DialPosition, DialRoot, DialStore, type DialTheme, type DialValue, type DriverDirection, Folder, GradientControl, GradientPanel, type GradientStop, type GradientType, type GradientValue, Module, type PanelConfig, type Point, type Preset, PresetManager, RangeSlider, type ResolvedValues, SegmentedControl, type SelectConfig, SelectControl, type ShortcutConfig, Slider, type SpringConfig, SpringControl, SpringVisualization, type TextConfig, TextControl, Toggle, type WaveformLoop, type WaveformMode, WaveformVisualization, type XYAxis, type XYConfig, XYControl, XYPad, type XYPadProps, type XYValue, XY_DEFAULT_STEP, XY_DETENT_PX, applyDetentAxis, centerValue, clamp, createDialKit, gradientToCss, invertY, normToValue, normalizeValue, nudge, pointFromValue, resolveAxis, snapToStep, valueFromPoint, valueToNorm };
