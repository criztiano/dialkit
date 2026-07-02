import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

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
/** A resolved sub-control descriptor for one list-item field. */
type ListFieldKind = 'slider' | 'toggle' | 'select' | 'color' | 'text';
type ListField = {
    key: string;
    label: string;
    kind: ListFieldKind;
    min?: number;
    max?: number;
    step?: number;
    options?: (string | {
        value: string;
        label: string;
    })[];
    placeholder?: string;
    defaultValue: number | boolean | string;
};
type DialValue = number | boolean | string | XYValue | SpringConfig | EasingConfig | ActionConfig | SelectConfig | ColorConfig | XYConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | ListConfig | ListItemValue[];
type DialConfig = {
    [key: string]: DialValue | [number, number, number, number?] | DialConfig;
};
type ResolvedValues<T extends DialConfig> = {
    [K in keyof T]: T[K] extends [number, number, number, number?] ? number : T[K] extends SpringConfig ? TransitionConfig : T[K] extends EasingConfig ? TransitionConfig : T[K] extends SelectConfig ? string : T[K] extends ColorConfig ? string : T[K] extends XYConfig ? XYValue : T[K] extends TextConfig ? string : T[K] extends GalleryConfig ? string : T[K] extends FileConfig ? string : T[K] extends SwatchConfig ? string : T[K] extends ChipsConfig ? string : T[K] extends ListConfig ? ListItemValue[] : T[K] extends DialConfig ? ResolvedValues<T[K]> : T[K];
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
    type: 'slider' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'xy' | 'text' | 'gallery' | 'file' | 'swatch' | 'chips' | 'list';
    path: string;
    label: string;
    min?: number;
    max?: number;
    step?: number;
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
    private isXYConfig;
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
/** Resolve a list item type's schema shorthand into renderable field descriptors. */
declare function parseListItemSchema(schema: Record<string, ListItemField>): ListField[];
/** The default params object for a freshly-added item of the given schema. */
declare function defaultListItemParams(schema: Record<string, ListItemField>): Record<string, number | boolean | string>;
/** Materialize a list config's initial rows: drop unknown types, backfill params. */
declare function normalizeListItems(config: ListConfig): ListItemValue[];
declare const DialStore: DialStoreClass;

interface UseDialOptions {
    onAction?: (action: string) => void;
    /** Non-value events: file picked, chip removed, list mutated. */
    onEvent?: (path: string, event: DialEvent) => void;
    shortcuts?: Record<string, ShortcutConfig>;
}
declare function useDialKit<T extends DialConfig>(name: string, config: T, options?: UseDialOptions): ResolvedValues<T>;

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
declare function DialRoot({ position, defaultOpen, mode, theme, productionEnabled }: DialRootProps): react_jsx_runtime.JSX.Element | null;

interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /**
     * Override the displayed value text. When provided, the formatter owns the
     * full label and `unit` is not auto-appended. Inline editing still operates
     * on the raw numeric value.
     */
    formatValue?: (value: number) => string;
    /**
     * Render a custom node (e.g. an icon or gauge) in the value slot instead of
     * the editable numeric text. Sliders with a `valueIcon` are not editable.
     */
    valueIcon?: ReactNode;
    /**
     * Anchor the fill at this value instead of `min`. For bipolar parameters
     * (e.g. -1..1) the fill grows out from the origin toward the handle in
     * either direction, and a soft, escapable detent snaps the value to the
     * origin while dragging. Defaults to `min` (classic left-anchored fill,
     * no detent — fully backwards compatible).
     */
    origin?: number;
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar?: boolean;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Slider({ label, value, onChange, min, max, step, unit, formatValue, valueIcon, origin, bipolar, shortcut, shortcutActive, }: SliderProps): react_jsx_runtime.JSX.Element;

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Toggle({ label, checked, onChange, shortcut, shortcutActive }: ToggleProps): react_jsx_runtime.JSX.Element;

interface FolderProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    isRoot?: boolean;
    inline?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    toolbar?: ReactNode;
}
declare function Folder({ title, children, defaultOpen, isRoot, inline, onOpenChange, toolbar }: FolderProps): react_jsx_runtime.JSX.Element;

interface ModuleProps {
    title: string;
    /** Whether the module is on. The Off/On switch is the expand control:
     *  off collapses the body away, on reveals it. */
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    children: ReactNode;
}
/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit (synth layers, effect sends, optional
 * feature groups). The switch doubles as the expand control: disabling
 * collapses the body away with a smooth height transition.
 */
declare function Module({ title, enabled, onEnabledChange, children }: ModuleProps): react_jsx_runtime.JSX.Element;

interface SegmentedControlOption<T extends string> {
    value: T;
    label: string;
}
interface SegmentedControlProps<T extends string> {
    options: SegmentedControlOption<T>[];
    value: T;
    onChange: (value: T) => void;
}
declare function SegmentedControl<T extends string>({ options, value, onChange, }: SegmentedControlProps<T>): react_jsx_runtime.JSX.Element;

interface ButtonGroupProps {
    buttons: Array<{
        label: string;
        onClick: () => void;
    }>;
}
declare function ButtonGroup({ buttons }: ButtonGroupProps): react_jsx_runtime.JSX.Element;

interface SpringControlProps {
    panelId: string;
    path: string;
    label: string;
    spring: SpringConfig;
    onChange: (spring: SpringConfig) => void;
}
declare function SpringControl({ panelId, path, label, spring, onChange }: SpringControlProps): react_jsx_runtime.JSX.Element;

interface SpringVisualizationProps {
    spring: SpringConfig;
    isSimpleMode: boolean;
}
declare function SpringVisualization({ spring, isSimpleMode }: SpringVisualizationProps): react_jsx_runtime.JSX.Element;

interface TransitionControlProps {
    panelId: string;
    path: string;
    label: string;
    value: TransitionConfig;
    onChange: (value: TransitionConfig) => void;
}
declare function TransitionControl({ panelId, path, label, value, onChange }: TransitionControlProps): react_jsx_runtime.JSX.Element;

interface EasingVisualizationProps {
    easing: EasingConfig;
}
declare function EasingVisualization({ easing }: EasingVisualizationProps): react_jsx_runtime.JSX.Element;

type WaveformMode = 'smooth' | 'pixelated';
/** A loop region over the sample, as normalized 0..1 positions. */
type WaveformLoop = {
    start: number;
    end: number;
};

interface WaveformVisualizationProps {
    /** Decoded audio sample. Its full waveform is drawn once (fixed). */
    buffer?: AudioBuffer | null;
    /** Playhead position, 0..1. */
    progress?: number;
    /**
     * Polled every frame for a buttery playhead without re-rendering the parent.
     * Overrides `progress` when provided — return the current play position (0..1).
     */
    getProgress?: () => number;
    /**
     * 'smooth' — a simplified, SVG-like envelope: few points, Catmull-Rom
     * interpolation, solid fill (the gist of the sample's dynamics).
     * 'pixelated' — crisp, chunky per-column min/max bars.
     */
    mode?: WaveformMode;
    /**
     * Smooth mode only. When false (default) the shape is a solid fill; when true
     * it becomes a translucent fill with a crisp outline.
     */
    border?: boolean;
    /** Split the sample into low / mid / high bands (three color-coded shapes). */
    bands?: boolean;
    /**
     * Pixelated mode only: block-size multiplier. 1 (default) ≈ one CSS pixel per
     * column; 2 / 4 / 6 make progressively chunkier, lower-resolution columns.
     */
    pixelSize?: number;
    /** Overlay a faint reference grid (vertical time-divisions) behind the waveform. */
    grid?: boolean;
    /** Vertical time-divisions in the grid when `grid` is on (default 8). */
    gridSubdivisions?: number;
    /**
     * Click-to-seek. When provided, clicking the waveform reports the new play
     * position (0..1); a click also clears any active loop.
     */
    onSeek?: (progress: number) => void;
    /** The active loop region to render (controlled), or null for none. */
    loop?: WaveformLoop | null;
    /**
     * Drag-to-loop. When provided, dragging across the waveform reports a loop
     * region; drag either edge to resize it; clicking reports null (loop cleared).
     */
    onLoopChange?: (loop: WaveformLoop | null) => void;
    /** Waveform color (single waveform only; bands keep their fixed colors). Defaults to the theme color. */
    waveColor?: string;
    /** Playhead color; the loop band derives from it at a lower opacity. Defaults to the theme color. */
    playheadColor?: string;
    /** When true, selecting a loop auto-zooms to frame it (manual zoom resumes once the loop is cleared). */
    autoZoomOnLoop?: boolean;
    width?: number;
    height?: number;
}
declare function WaveformVisualization({ buffer, progress, getProgress, mode, border, bands, pixelSize, grid, gridSubdivisions, onSeek, loop, onLoopChange, waveColor, playheadColor, autoZoomOnLoop, width, height, }: WaveformVisualizationProps): react_jsx_runtime.JSX.Element;

/** The curve vocabulary a segment cycles through on quick-click. */
type CurveType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
/** Cycle order for quick-click (loops back to the start). */
declare const CURVE_CYCLE: CurveType[];
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
     * Scales each control point's deviation from the linear diagonal: 0 = canonical preset,
     * +1 = sharper (e.g. easeInOut gets much slower start/end), −1 = flatter toward linear.
     * Spring maps it to stiffness (snappier rise).
     */
    steepness: number;
}
/** The stacked driver curve (a single curve, no internal splits). */
interface CurveDriver {
    type: CurveType;
    /** Bipolar -1..1 energy bias — see CurveSegment.curvature. */
    curvature: number;
    /** Bipolar -1..1 steepness — see CurveSegment.steepness. */
    steepness: number;
}
type DriverDirection = 'forward' | 'mirror' | 'reverse';
interface CurveComposition {
    segments: CurveSegment[];
    /** null → no driver lane (the component renders a single lane). */
    driver: CurveDriver | null;
    direction: DriverDirection;
}
/** A pure `(t) -> value` sampler over local time, both in 0..1 (value may overshoot for springs). */
type Sampler = (t: number) => number;
/**
 * Insert a copy of the segment at `index` after it, then re-divide ALL segments to
 * equal duration — split always yields evenly-spaced clips.
 */
declare function splitSegment(comp: CurveComposition, index: number): CurveComposition;
/** Remove the segment at `index` (no-op when it's the only one). */
declare function removeSegment(comp: CurveComposition, index: number): CurveComposition;
declare function cycleSegmentType(comp: CurveComposition, index: number): CurveComposition;
declare function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition;
declare function setSegmentSteepness(comp: CurveComposition, index: number, steepness: number): CurveComposition;
/**
 * Move `deltaFrac` (0..1 of the whole series) across the boundary between segment
 * `boundaryIndex` and the next, keeping the rest untouched and the pair's combined
 * width constant. Each side is clamped to `CURVE_MIN_WEIGHT_FRAC`.
 */
declare function redistributeWeight(comp: CurveComposition, boundaryIndex: number, deltaFrac: number): CurveComposition;
declare function addDriver(comp: CurveComposition): CurveComposition;
declare function removeDriver(comp: CurveComposition): CurveComposition;
declare function cycleDriverType(comp: CurveComposition): CurveComposition;
declare function setDriverCurvature(comp: CurveComposition, curvature: number): CurveComposition;
declare function setDriverSteepness(comp: CurveComposition, steepness: number): CurveComposition;
interface CompositionSamplers {
    segments: Sampler[];
    driver: Sampler | null;
}
declare function buildSamplers(comp: CurveComposition): CompositionSamplers;
interface CompositionRead {
    /** Read position after direction, before the driver warps it (0..1) — the driver lane marker. */
    inputPhase: number;
    /** Read position after the driver warps it (0..1) — the series lane playhead (sweeps once). */
    warpedPhase: number;
    /**
     * Composed output, 0..1 — the ACTIVE segment's own full min→max walk, shaped by that
     * segment's curve. It resets and climbs again at each divider, so N segments make the
     * output walk min→max N times across one sweep (the segments are not summed into one path).
     */
    value: number;
    segIndex: number;
    localT: number;
}
/**
 * Read the composition at raw loop phase `u`. direction reverses/ping-pongs the
 * traversal of the whole composition; the driver then warps the reading pace. The
 * playhead sweeps left→right once, while `value` is each segment's own full 0→1 walk.
 */
declare function readComposition(comp: CurveComposition, u: number, s: CompositionSamplers): CompositionRead;
/** Default trigger count for a trigger series. */
declare const DEFAULT_TRIGGER_STEPS = 5;
/**
 * The evenly-spaced trigger levels in VALUE (signal) space — not time. The first sits at
 * 0 and the last at 1, e.g. steps=5 → [0, .25, .5, .75, 1]. Triggers fire when the composed
 * value crosses these levels, so a non-linear curve (which reaches each level at an uneven
 * pace) fires them unevenly in time — that pacing is the whole point. Use these to draw the
 * horizontal level lines a trigger series rides.
 */
declare function triggerLevels(steps: number): number[];
/**
 * Level indices (into `triggerLevels`) fired as the composed value moves `prevValue` →
 * `curValue`. Pass the composed `value` (post driver/direction) frame to frame; the
 * firing is direction-symmetric — it reads the value sequence, so it works for forward,
 * reverse, and mirror alike:
 *
 * - A smooth move fires the INTERIOR levels (strictly between 0 and 1) it crosses, in the
 *   travel direction — the curve sets how fast the value reaches each, so non-linear
 *   curves fire them unevenly.
 * - A flyback (a single-frame jump larger than {@link TRIGGER_FLYBACK}) is the per-segment /
 *   loop boundary. The walk reached the far endpoint it flew back from, so that endpoint
 *   fires: a downward flyback (a forward walk that peaked) fires the top (n−1); an upward
 *   flyback (a reverse walk that bottomed) fires the floor (0). The opposite endpoint is the
 *   start of the next walk, folded onto this one so the boundary never double-triggers.
 *
 * Values are clamped to [0, 1] so spring overshoot can't perturb the endpoints.
 */
declare function triggersCrossed(prevValue: number, curValue: number, steps: number): number[];
/** A reasonable starting composition for demos / uncontrolled mounts. */
declare function defaultComposition(): CurveComposition;

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
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor?: string;
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor?: string;
    /** Faint vertical reference grid behind each lane. */
    grid?: boolean;
    gridSubdivisions?: number;
    width?: number;
    /** Height of the main lane; the driver lane adds height below it. */
    height?: number;
}
declare function CurveComposer({ segments, driver, direction, onSegmentsChange, onDriverChange, getPhase, phase, mode, triggerSteps, onTrigger, curveColor, playheadColor, grid, gridSubdivisions, width, height, }: CurveComposerProps): react_jsx_runtime.JSX.Element;

interface TextControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
declare function TextControl({ label, value, onChange, placeholder }: TextControlProps): react_jsx_runtime.JSX.Element;

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
declare function SelectControl({ label, value, options, onChange }: SelectControlProps): react_jsx_runtime.JSX.Element;

interface ColorControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
}
declare function ColorControl({ label, value, onChange, alpha, palette }: ColorControlProps): react_jsx_runtime.JSX.Element;

interface ColorPickerPanelProps {
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
}
declare function ColorPickerPanel({ value, onChange, alpha, palette }: ColorPickerPanelProps): react_jsx_runtime.JSX.Element;

/**
 * color-core — DOM-free color math shared by every framework port of the
 * color picker (React, Solid, Vue, Svelte). Pure functions only; anything
 * that touches the DOM or storage lives in the component layer or
 * color-palette-store.
 *
 * Canonical value shape: hex string. `#rrggbb` normally, `#rrggbbaa` always
 * (even at full opacity) when a control opts into alpha — deterministic
 * round-tripping keeps store reconciliation trivial.
 */
/** r/g/b 0–255, a 0–1. */
type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
};
/** h 0–360, s/v 0–1, a 0–1. The picker's working space. */
type HSVA = {
    h: number;
    s: number;
    v: number;
    a: number;
};
/** h 0–360, s/l 0–1, a 0–1. */
type HSLA = {
    h: number;
    s: number;
    l: number;
    a: number;
};
/** OKLCH: l 0–1, c ≥ 0 (sRGB tops out ≈0.37), h 0–360, a 0–1. */
type OKLCH = {
    l: number;
    c: number;
    h: number;
    a: number;
};
type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';
declare const COLOR_FORMATS: ColorFormat[];
/** Parses #RGB / #RGBA / #RRGGBB / #RRGGBBAA; tolerates a missing '#' and whitespace. */
declare function parseHex(input: string): RGBA | null;
/** Lowercase `#rrggbb`, or `#rrggbbaa` (always, even at a=1) when alpha is enabled. */
declare function formatHex(rgba: RGBA, alphaEnabled: boolean): string;
/** Parse + reformat; strips the alpha channel when alpha is off. Null when unparseable. */
declare function normalizeHex(input: string, alphaEnabled: boolean): string | null;
/** Trigger-row presentation: uppercased, alpha digits hidden (opacity has its own readout). */
declare function displayHex(value: string): string;
/** 0–100 readout for the trigger row ("60 %"). */
declare function opacityPercent(rgba: RGBA): number;
declare function rgbToHsv(rgba: RGBA): HSVA;
declare function hsvToRgb(hsva: HSVA): RGBA;
declare function rgbToHsl(rgba: RGBA): HSLA;
declare function hslToRgb(hsla: HSLA): RGBA;
declare function rgbToOklch(rgba: RGBA): OKLCH;
/**
 * Maps an out-of-gamut OKLCH into sRGB by binary-searching the chroma down,
 * preserving lightness and hue (channel-clipping would shift the hue).
 */
declare function clampOklchToSrgb(oklch: OKLCH): OKLCH;
declare function oklchToRgb(oklch: OKLCH): RGBA;

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
declare function XYPad({ label, value, onChange, x, y, size, grid, density, snap, returnToCenter, showValues, disabled, formatValue, shortcut, shortcutActive, }: XYPadProps): react_jsx_runtime.JSX.Element;

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
declare function XYControl({ label, value, onChange, x, y, grid, density, snap, returnToCenter, showValues, shortcut, shortcutActive }: XYControlProps): react_jsx_runtime.JSX.Element;

interface GalleryControlProps {
    label: string;
    value: string;
    items: GalleryItem[];
    onChange: (id: string) => void;
    /** Masonry column count for the open grid. Default 2. */
    columns?: number;
}
declare function GalleryControl({ label, value, items, onChange, columns }: GalleryControlProps): react_jsx_runtime.JSX.Element;

interface FileControlProps {
    label: string;
    value: string;
    accept?: string;
    multiple?: boolean;
    onChange: (filename: string) => void;
    onPick: (files: FileList) => void;
}
declare function FileControl({ label, value, accept, multiple, onChange, onPick }: FileControlProps): react_jsx_runtime.JSX.Element;

interface SwatchControlProps {
    label: string;
    value: string;
    options: SwatchOption[];
    onChange: (value: string) => void;
}
declare function SwatchControl({ label, value, options, onChange }: SwatchControlProps): react_jsx_runtime.JSX.Element;

interface ChipsControlProps {
    label: string;
    value: string;
    options: ChipOption[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}
declare function ChipsControl({ label, value, options, onChange, onRemove }: ChipsControlProps): react_jsx_runtime.JSX.Element;

interface ListControlProps {
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    /** Structural signal for engines that bridge list ops imperatively. */
    onEvent: (event: DialEvent) => void;
}
declare function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent }: ListControlProps): react_jsx_runtime.JSX.Element;

interface PresetManagerProps {
    panelId: string;
    presets: Preset[];
    activePresetId: string | null;
    onAdd: () => void;
}
declare function PresetManager({ panelId, presets, activePresetId, onAdd }: PresetManagerProps): react_jsx_runtime.JSX.Element;

interface ShortcutsMenuProps {
    panelId: string;
}
declare function ShortcutsMenu({ panelId }: ShortcutsMenuProps): react_jsx_runtime.JSX.Element | null;

export { type ActionConfig, type AxisSpec, ButtonGroup, COLOR_FORMATS, CURVE_CYCLE, type ChipOption, type ChipsConfig, ChipsControl, type ColorConfig, ColorControl, type ColorFormat, ColorPickerPanel, type CompositionRead, type CompositionSamplers, type ControlMeta, CurveComposer, type CurveComposition, type CurveDriver, type CurveSegment, type CurveType, DEFAULT_TRIGGER_STEPS, type DialConfig, type DialEvent, type DialMode, type DialPosition, DialRoot, DialStore, type DialTheme, type DialValue, type DriverDirection, type EasingConfig, EasingVisualization, type FileConfig, FileControl, Folder, type GalleryConfig, GalleryControl, type GalleryItem, type HSLA, type HSVA, type ListConfig, ListControl, type ListField, type ListFieldKind, type ListItemField, type ListItemType, type ListItemValue, Module, type OKLCH, type PanelConfig, type Point, type Preset, PresetManager, type RGBA, type ResolvedValues, type Sampler, SegmentedControl, type SelectConfig, SelectControl, type ShortcutConfig, type ShortcutInteraction, type ShortcutMode, ShortcutsMenu, Slider, type SpringConfig, SpringControl, SpringVisualization, type SwatchConfig, SwatchControl, type SwatchOption, type TextConfig, TextControl, Toggle, type TransitionConfig, TransitionControl, type UseDialOptions, type WaveformLoop, type WaveformMode, WaveformVisualization, type XYAxis, type XYConfig, XYControl, XYPad, type XYPadProps, type XYValue, XY_DEFAULT_STEP, XY_DETENT_PX, addDriver, applyDetentAxis, buildSamplers, centerValue, clamp, clampOklchToSrgb, cycleDriverType, cycleSegmentType, defaultComposition, defaultListItemParams, displayHex, formatHex, hslToRgb, hsvToRgb, invertY, normToValue, normalizeHex, normalizeListItems, normalizeValue, nudge, oklchToRgb, opacityPercent, parseHex, parseListItemSchema, pointFromValue, readComposition, redistributeWeight, removeDriver, removeSegment, resolveAxis, rgbToHsl, rgbToHsv, rgbToOklch, setDriverCurvature, setDriverSteepness, setSegmentCurvature, setSegmentSteepness, snapToStep, splitSegment, triggerLevels, triggersCrossed, useDialKit, valueFromPoint, valueToNorm };
