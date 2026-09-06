import * as solid_js from 'solid-js';
import { Accessor, JSX } from 'solid-js';
import { ShortcutConfig, AffordanceConfig, PresetProvider, TweakConfig, ResolvedValues, RangeValue, SpringConfig, XYAxis, XYValue as XYValue$1, TransitionConfig, ControlMeta, TweakValue, EasingConfig } from 'tweakers/store';
export { ActionConfig, AffordanceConfig, AffordanceContext, AffordanceStatus, ColorConfig, ControlMeta, EasingConfig, PanelConfig, Preset, PresetItem, PresetProvider, PresetProviderPreset, ResolvedValues, SelectConfig, ShortcutConfig, SpringConfig, TextConfig, TransitionConfig, TweakConfig, TweakStore, TweakValue, XYAxis, XYConfig } from 'tweakers/store';
import { TweakTimelineOptions, TimelineConfig, TweakTimelineValues } from 'tweakers/timeline';
export { TimelineClipConfig, TimelineClipCss, TimelineClipLoop, TimelineClipValues, TimelineConfig, TimelineGroupConfig, TimelineGroupValues, TimelinePropConfig, TimelinePropStepConfig, TimelineStepConfig, TimelineStepValues, TweakTimelineValues } from 'tweakers/timeline';
import { WaveformMode, WaveformLoop } from 'tweakers/waveform-engine';
export { WaveformLoop, WaveformMode } from 'tweakers/waveform-engine';
import { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from 'tweakers/analyser-engine';
export { AnalyserMode, AnalyserScale, AnalyserSource, AnalyserSpring, AnalyserVariant } from 'tweakers/analyser-engine';
import { CurveSegment, CurveDriver, DriverDirection } from 'tweakers/curve-composer-core';
export { CurveComposition, CurveDriver, CurveSegment, CurveType, DriverDirection, Sampler, SpringifyOptions, springify } from 'tweakers/curve-composer-core';
import { GradientValue } from 'tweakers/gradient-core';
export { DEFAULT_GRADIENT, GradientStop, GradientType, GradientValue, gradientToCss } from 'tweakers/gradient-core';
import { XYValue } from 'tweakers/xy-pad-core';
export { AxisSpec, Point, XYValue, XY_DEFAULT_STEP, XY_DETENT_PX, applyDetentAxis, centerValue, clamp, invertY, normToValue, normalizeValue, nudge, pointFromValue, resolveAxis, snapToStep, valueFromPoint, valueToNorm } from 'tweakers/xy-pad-core';

interface CreateTweakersOptions {
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
     * Back `presets`/`activeId` with signal-read getters to keep the list live.
     */
    presets?: PresetProvider | false;
}
declare function createTweakers<T extends TweakConfig>(name: string, config: T, options?: CreateTweakersOptions): Accessor<ResolvedValues<T>>;

type CreateTweakTimelineOptions = TweakTimelineOptions;
declare function createTweakTimeline<T extends TimelineConfig>(name: string, config: T, options?: CreateTweakTimelineOptions): Accessor<TweakTimelineValues<T>>;

type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type TweakMode = 'popover' | 'inline';
/** `card` is the panel's glass surface; `none` puts the rows straight on the host's ground. */
type TweakChrome = 'card' | 'none';
type TweakTheme = 'light' | 'dark' | 'system';
interface TweakRootProps {
    position?: TweakPosition;
    defaultOpen?: boolean;
    mode?: TweakMode;
    theme?: TweakTheme;
    productionEnabled?: boolean;
    /**
     * Render only the named panels, in the order given. For apps that place
     * more than one panel surface in more than one place — a rack of per-voice
     * columns beside a global panel, say. Omitted, a root renders every
     * registered panel, which is the single-surface default.
     */
    panels?: string | string[];
    /**
     * `none` drops the panel card — no glass, no border, no radius, no padding —
     * so the rows sit directly on the host's own surface. For app chrome that
     * already provides the ground the panel would otherwise float on.
     */
    chrome?: TweakChrome;
}
declare function TweakRoot(props: TweakRootProps): solid_js.JSX.Element;

interface TweakTimelineProps {
    theme?: TweakTheme;
    defaultVisible?: boolean;
    visible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
    defaultOpen?: boolean;
    productionEnabled?: boolean;
}
declare function TweakTimeline(props: TweakTimelineProps): JSX.Element;

declare function TimelineToggleButton(): solid_js.JSX.Element;

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
    valueIcon?: JSX.Element;
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min` (classic left-anchored
     * fill, no detent).
     */
    origin?: number;
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar?: boolean;
    /**
     * `vertical` renders the 77px column card: fill grows bottom-up, label sits
     * at the base, and the value readout appears over the fill on hover/drag.
     * Vertical sliders flex to their container width — place them in a flex row.
     */
    orientation?: 'horizontal' | 'vertical';
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Slider(props: SliderProps): JSX.Element;

interface NumberControlProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /** Override the displayed value text; `unit` is not auto-appended. */
    formatValue?: (value: number) => string;
    /** `vertical` stacks the label above a centered value (column card). */
    orientation?: 'horizontal' | 'vertical';
}
/**
 * Numeric readout card. Drag anywhere on the card to scrub the value
 * (Shift = ×10, Alt = ×0.1); a plain click opens inline text entry.
 */
declare function NumberControl(props: NumberControlProps): solid_js.JSX.Element;

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

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Accessible name — the visible label is rendered by the caller. */
    label?: string;
    /** The control exists but cannot act right now: reads as a dash, not a
     *  blank box, so "unavailable" never looks like "off". */
    disabled?: boolean;
    id?: string;
}
/**
 * A compact tri-state box: on (a filled chip), off (a slash), and disabled
 * (a dash).
 *
 * This replaces the Off/On segmented pair for boolean rows and module
 * headers. A two-tab switch spends ~84px and a whole row of attention on
 * one bit; a box spends 22px and reads instantly. The segmented control
 * stays where it belongs — three or more genuinely different modes.
 *
 * All three marks are always in the DOM; CSS reveals one from the data
 * attributes, so the state swap animates without any motion code.
 */
declare function Checkbox(props: CheckboxProps): solid_js.JSX.Element;

interface FolderProps {
    title: string;
    children: JSX.Element;
    defaultOpen?: boolean;
    /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
    collapsible?: boolean;
    isRoot?: boolean;
    inline?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    toolbar?: JSX.Element;
    /** One line of help for the section, revealed on hover over the header. */
    hint?: string;
    hintId?: string;
    /**
     * Root only — the panel declared `_enabled`, so the whole panel is a module:
     * the title carries the switch and the body goes away when it is off. Same
     * idiom as ModuleFolder, one level up.
     */
    enabled?: boolean;
    onEnabledChange?: (enabled: boolean) => void;
}
declare function Folder(props: FolderProps): JSX.Element;

interface ControlShellProps {
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint?: string;
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title?: string;
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: string;
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance?: AffordanceConfig;
    /** Required alongside `affordance` — together they address the status slice. */
    panelId?: string;
    path?: string;
    children: JSX.Element;
}
/**
 * The chrome around one leaf control: a hint tooltip and an affordance dot.
 * Both are optional, and a control with neither renders just the wrapper plus
 * the config-path tooltip.
 */
declare function ControlShell(props: ControlShellProps): JSX.Element;

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
    value: XYValue$1;
    onChange: (value: XYValue$1) => void;
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
    presets: {
        id: string;
        name: string;
        deletable?: boolean;
    }[];
    activePresetId: string | null;
    onAdd: () => void;
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode?: boolean;
}
declare function PresetManager(props: PresetManagerProps): solid_js.JSX.Element;

interface TransitionDurationControl {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}
interface TransitionControlProps {
    panelId: string;
    path: string;
    label: string;
    value: TransitionConfig;
    onChange: (value: TransitionConfig) => void;
    hideDuration?: boolean;
    durationControl?: TransitionDurationControl;
}
declare function TransitionControl(props: TransitionControlProps): solid_js.JSX.Element;

interface ControlRendererProps {
    panelId: string;
    controls: ControlMeta[];
    values: Record<string, TweakValue>;
    /** Optional timeline-owned duration rendered inside the transition editor. */
    transitionDuration?: TransitionDurationControl;
}
declare function ControlRenderer(props: ControlRendererProps): solid_js.JSX.Element;

declare function EasingVisualization(props: {
    easing: EasingConfig;
}): solid_js.JSX.Element;

export { AnalyserVisualization, ButtonGroup, Checkbox, ColorControl, ColorPickerPanel, ControlRenderer, ControlShell, type CreateTweakTimelineOptions, type CreateTweakersOptions, CurveComposer, EasingVisualization, Folder, GradientControl, GradientPanel, Module, NumberControl, PresetManager, RangeSlider, SegmentedControl, SelectControl, Slider, SpringControl, SpringVisualization, TextControl, TimelineToggleButton, Toggle, TransitionControl, type TweakMode, type TweakPosition, TweakRoot, type TweakTheme, TweakTimeline, type TweakTimelineProps, WaveformVisualization, XYControl, XYPad, type XYPadProps, createTweakTimeline, createTweakers };
