import { TweakEvent, ShortcutConfig, AffordanceConfig, PresetProvider, TweakConfig, ResolvedValues, ControlMeta, TweakValue, SpringConfig, TransitionConfig, EasingConfig, XYAxis, XYValue as XYValue$1, GalleryItem, SwatchOption, ChipOption, MultiSelectOption, ListItemValue, ListItemType } from 'tweakers/store';
export { ActionConfig, AffordanceConfig, AffordanceContext, AffordanceStatus, AnalyserConfig, ChipOption, ChipsConfig, ColorConfig, ControlMeta, CurveConfig, EasingConfig, FileConfig, FilterConfig, GalleryConfig, GalleryItem, GradientConfig, ListConfig, ListField, ListFieldGroup, ListFieldKind, ListItemField, ListItemType, ListItemValue, MultiSelectConfig, MultiSelectOption, NumberConfig, PanelConfig, Preset, PresetItem, PresetProvider, PresetProviderPreset, RangeConfig, RangeValue, ResolvedValues, SelectConfig, ShortcutConfig, ShortcutInteraction, ShortcutMode, SliderConfig, SpringConfig, SwatchConfig, SwatchOption, TAB_PATH, TextConfig, ToggleConfig, TransitionConfig, TweakConfig, TweakEvent, TweakStore, TweakValue, XYAxis, XYConfig, defaultListItemParams, groupListFields, hintDomId, normalizeListItems, parseListItemSchema } from 'tweakers/store';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { FilterValue } from 'tweakers/filter-core';
export { FILTER_DB_CEIL, FILTER_DB_FLOOR, FilterAxis, FilterAxisConfig, FilterResponse, FilterShapeType, FilterValue, defaultFilterResponse, filterHand01, filterHandValue, filterResponsePath, filterShapeResponse, normalizeFilterValue, resolveFilterAxis } from 'tweakers/filter-core';
export { MOD_TOUCH_GRACE_MS, ModStepAction, ModulationSourceConfig, ModulationStore } from 'tweakers/modulation-store';
export { ADSR_DEF, ADSR_STAGE_MAX, CURVE_DEF, CURVE_LABELS, CURVE_MAX_CLIPS, CURVE_MAX_DURATION, CURVE_MIN_DURATION, ENV_BEND_STAGES, EnvStage, LFO_DEF, LFO_SYNC_DIVISIONS, MOD_COLORS, MOD_PAGE_DIALS, MOD_RING_CIRCUMFERENCE, MOD_RING_RADIUS, MOD_SETTINGS_PANEL, MOD_SLOTS, ModControlMeta, ModPageLayout, ModPageSlot, ModTypeDef, ModulationAssignment, ModulationParamValue, ModulationParams, ModulationSlot, ModulationType, SH_DEF, applyModulation, curveComposition, curveDuration, envCurveParam, envelopeJoints, envelopePoints, getModType, lfoSyncedHz, listModTypes, modColor, modKey, modPageLayout, modPageWidth, modRingArc, registerModType, visibleModControls } from 'tweakers/modulation-core';
import { TweakTimelineOptions, TimelineConfig, TweakTimelineValues } from 'tweakers/timeline';
export { TimelineClipConfig, TimelineClipCss, TimelineClipLoop, TimelineClipMeta, TimelineClipTrackMeta, TimelineClipValues, TimelineConfig, TimelineGroupConfig, TimelineGroupValues, TimelineMeta, TimelinePropConfig, TimelinePropStepConfig, TimelineStepConfig, TimelineStepValues, TimelineStore, TimelineTransport, TweakTimelineValues, formatClock } from 'tweakers/timeline';
import * as react from 'react';
import { ReactNode, CSSProperties, ReactElement } from 'react';
import { TransferValue } from 'tweakers/transfer-core';
export { DEFAULT_TRANSFER, TRANSFER_MAX_POINTS, TRANSFER_MIN_GAP, TransferPoint, TransferValue, insertPoint, isIdentityTransfer, movePoint, nearestPoint, normalizeTransfer, removePoint, sampleTransfer, transferLut } from 'tweakers/transfer-core';
export { ANGLE_DEAD_ZONE_PX, angleFromPointer, arcPath, bearingToValue, normalizeAngle, nudgeAngle, snapAngle, valueToBearing } from 'tweakers/angle-core';
import { RangeValue } from 'tweakers/range-slider-core';
export { clamp, clampRange, handleLeftStyles, isOutsideSpan, nearestHandle, orderRange, percentToValue, pickDragTarget, setHigh, setLow, shiftSpan, valueToPercent } from 'tweakers/range-slider-core';
export { CurveComposer, CurveComposition, CurveDriver, CurveSegment, CurveType, DriverDirection, WaveformLoop, WaveformMode, WaveformVisualization } from 'tweakers';
import { AnalyserSource, AnalyserTransferDraw, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from 'tweakers/analyser-engine';
export { AnalyserMode, AnalyserScale, AnalyserSource, AnalyserSpring, AnalyserTransferDraw, AnalyserVariant } from 'tweakers/analyser-engine';
export { CURVE_CYCLE, CompositionRead, CompositionSamplers, DEFAULT_TRIGGER_STEPS, Sampler, SpringifyOptions, addDriver, buildSamplers, cycleDriverType, cycleSegmentType, defaultComposition, flipDriver, flipDriverX, flipDriverY, flipSegment, flipSegmentX, flipSegmentY, readComposition, redistributeWeight, removeDriver, removeSegment, setDriverAnticipate, setDriverCurvature, setDriverOvershoot, setDriverSteepness, setSegmentAnticipate, setSegmentCurvature, setSegmentOvershoot, setSegmentSteepness, splitSegment, springify, triggerLevels, triggersCrossed } from 'tweakers/curve-composer-core';
export { COLOR_FORMATS, ColorFormat, HSLA, HSVA, OKLCH, RGBA, clampOklchToSrgb, displayHex, formatHex, hslToRgb, hsvToRgb, normalizeHex, oklchToRgb, opacityPercent, parseHex, rgbToHsl, rgbToHsv, rgbToOklch } from 'tweakers/color-core';
import { GradientValue } from 'tweakers/gradient-core';
export { DEFAULT_GRADIENT, GradientStop, GradientTransform, GradientType, GradientValue, MIN_STOPS, addStop, colorAtPosition, gradientFillBox, gradientToCss, gradientToTransform, moveStop, normalizeGradient, rampCss, removeStop, setGradientAngle, setGradientCenter, setGradientRotation, setGradientScale, setGradientSquash, setGradientType, setStopColor } from 'tweakers/gradient-core';
import { XYValue } from 'tweakers/xy-pad-core';
export { AxisSpec, Point, XYValue, XY_DEFAULT_STEP, XY_DETENT_PX, applyDetentAxis, centerValue, invertY, normToValue, normalizeValue, nudge, pointFromValue, resolveAxis, snapToStep, valueFromPoint, valueToNorm } from 'tweakers/xy-pad-core';
export { CURVE_DEFAULT_HEIGHT, CURVE_FIT_PADDING, CURVE_MAX_HEIGHT, CURVE_MIN_HEIGHT, CURVE_SAMPLE_COUNT, CurvePlot, CurvePoint, clampCurveHeight, curvePathData, curveY, normalizeCurveMarkers, plotCurve } from 'tweakers/curve-preview-core';

interface UseTweakersOptions {
    onAction?: (action: string) => void;
    /** Non-value events: file picked, chip removed, list mutated. */
    onEvent?: (path: string, event: TweakEvent) => void;
    shortcuts?: Record<string, ShortcutConfig>;
    /** One line of help per control path, revealed on hover or keyboard focus. */
    hints?: Record<string, string>;
    /** Companion controls per control path, opened from a dot in the corner. */
    affordances?: Record<string, AffordanceConfig>;
    /** Display label by control path, overriding the key-derived name. */
    labels?: Record<string, string>;
    /**
     * Which Move pad column each pad control sits in, by control path (0-7) —
     * the page's hand-authored hardware layout, so a pad sits under the dial it
     * belongs to instead of packing left.
     */
    movePads?: Record<string, number>;
    /**
     * Host-owned backing for the toolbar's preset UI. The toolbar renders this
     * list instead of the built-in localStorage snapshots; the host applies
     * values in `onSelect` and owns persistence (see PresetProvider).
     *
     * `false` leaves this panel's header bare of the toolbar altogether — for
     * the secondary panels of a multi-panel app, where a snapshot means the
     * whole instrument and so belongs to one panel only.
     */
    presets?: PresetProvider | false;
}
declare function useTweakers<T extends TweakConfig>(name: string, config: T, options?: UseTweakersOptions): ResolvedValues<T>;

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
declare function TweakRoot({ position, defaultOpen, mode, theme, productionEnabled, panels: only, chrome }: TweakRootProps): react_jsx_runtime.JSX.Element | null;

interface FilterControlProps {
    control: ControlMeta;
    value: FilterValue | undefined;
    onChange: (value: FilterValue) => void;
}
/**
 * The filter control's inline face: the magnitude response drawn as a curve
 * row, with the two hands — cutoff and resonance — as sliders under it. One
 * control, one value; on the Move the same trio compresses into the 2-slot
 * picture.
 */
declare function FilterControl({ control, value, onChange }: FilterControlProps): react_jsx_runtime.JSX.Element;

type UseTweakTimelineOptions = TweakTimelineOptions;
declare function useTweakTimeline<T extends TimelineConfig>(name: string, config: T, options?: UseTweakTimelineOptions): TweakTimelineValues<T>;

interface TweakTimelineProps {
    theme?: TweakTheme;
    /** Initial dock visibility. Expansion is controlled separately by defaultOpen. */
    defaultVisible?: boolean;
    /** Controlled dock visibility. */
    visible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
    defaultOpen?: boolean;
    productionEnabled?: boolean;
}
declare const TweakTimeline: react.NamedExoticComponent<TweakTimelineProps>;

interface ControlRendererProps {
    panelId: string;
    controls: ControlMeta[];
    values: Record<string, TweakValue>;
    /** Optional timeline-owned duration rendered inside the transition editor. */
    transitionDuration?: {
        value: number;
        onChange: (value: number) => void;
        min?: number;
        max?: number;
        step?: number;
    };
}
declare function ControlRenderer({ panelId, controls, values, transitionDuration }: ControlRendererProps): react_jsx_runtime.JSX.Element;

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
    /**
     * `vertical` renders the 77px column card: fill grows bottom-up, label sits
     * at the base, and the value readout appears over the fill on hover/drag.
     * Vertical sliders flex to their container width — place them in a flex row.
     */
    orientation?: 'horizontal' | 'vertical';
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
}
declare function Slider({ label, value, onChange, min, max, step, unit, formatValue, valueIcon, origin, bipolar, orientation, shortcut, shortcutActive, }: SliderProps): react_jsx_runtime.JSX.Element;

interface AngleDialProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    formatValue?: (value: number) => string;
    /** The bearing the sweep grows out of. Defaults to `min`. */
    origin?: number;
    /** Past the end, come back around instead of stopping. Default for a full turn. */
    wrap?: boolean;
}
/**
 * A rotary control for the parameters a track gets wrong: headings, tilts,
 * sun positions — anything where the two ends of the range are the same place.
 * The needle follows the pointer directly (a compass gesture, not a fader
 * one), and on a wrapping range a drag past the top carries on turning.
 *
 * It is a `slider` to the store, and so to a hardware knob: only the drawing
 * differs, which is exactly what `display: 'dial'` says.
 */
declare function AngleDial({ label, value, onChange, min, max, step, unit, formatValue, origin, wrap, }: AngleDialProps): react_jsx_runtime.JSX.Element;

interface TransferCurveProps {
    label: string;
    value: TransferValue;
    onChange: (value: TransferValue) => void;
    /** Surface height in px, clamped 64–200. Default 104. */
    height?: number;
    /** Grid divisions behind the curve. Default 4 (quarters). Pass 0 to hide. */
    grid?: number;
    /** Names for the two axes, shown small at the edges. */
    axisLabels?: {
        x?: string;
        y?: string;
    };
}
/**
 * A curve you draw instead of a number you guess. Points are dragged, added
 * with a click on the curve and removed by dragging one out of the box; the
 * shape between them is monotone cubic, so the output never overshoots the
 * values you placed.
 */
declare function TransferCurve({ label, value, onChange, height, grid, axisLabels }: TransferCurveProps): react_jsx_runtime.JSX.Element;

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
declare function NumberControl({ label, value, onChange, min, max, step, unit, formatValue, orientation, }: NumberControlProps): react_jsx_runtime.JSX.Element;

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
declare function RangeSlider({ label, value: rawValue, onChange, min, max, step, defaultValue, }: RangeSliderProps): react_jsx_runtime.JSX.Element;

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
declare function Checkbox({ checked, onChange, label, disabled, id }: CheckboxProps): react_jsx_runtime.JSX.Element;

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
    /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
    collapsible?: boolean;
    isRoot?: boolean;
    inline?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    toolbar?: ReactNode;
    /** Root only — the tab bar, riding the panel header under the toolbar. */
    tabs?: ReactNode;
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
declare function Folder({ title, children, defaultOpen, collapsible, isRoot, inline, onOpenChange, toolbar, tabs, hint, hintId, enabled, onEnabledChange }: FolderProps): react_jsx_runtime.JSX.Element;

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
    children: ReactNode;
}
/**
 * The chrome around one leaf control: a hint tooltip and an affordance dot.
 * Both are optional, and a control with neither renders just the wrapper plus
 * the config-path tooltip.
 */
declare function ControlShell({ hint, title, id, affordance, panelId, path, children }: ControlShellProps): react_jsx_runtime.JSX.Element;

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
    /** Hide duration sliders when something else owns the duration (e.g. a timeline clip bar). */
    hideDuration?: boolean;
    /** Route duration edits through an external owner while keeping this control's layout. */
    durationControl?: {
        value: number;
        onChange: (value: number) => void;
        min?: number;
        max?: number;
        step?: number;
    };
}
declare function TransitionControl({ panelId, path, label, value, onChange, hideDuration, durationControl, }: TransitionControlProps): react_jsx_runtime.JSX.Element;

interface EasingVisualizationProps {
    easing: EasingConfig;
}
declare function EasingVisualization({ easing }: EasingVisualizationProps): react_jsx_runtime.JSX.Element;

interface AnalyserVisualizationProps {
    /**
     * The Web Audio analyser to visualize. Purely observed — the component never
     * mutates it, so fftSize, smoothingTimeConstant, and the minDecibels..maxDecibels
     * window (which the byte data maps onto) stay under the host's control.
     */
    analyser?: AnalyserNode | null;
    /**
     * 'frequency' — live spectrum (EQ-style). 'waveform' — time-domain oscilloscope.
     * 'ekg' — a medical-monitor trace: a pen dot fixed at the right edge rides the
     * signal's level while the history it draws streams away to the left.
     * 'transfer' — an XY plot of `analyser` (horizontal) against `analyserB`
     * (vertical): a memoryless shaper draws its transfer curve, time-dependent
     * processing opens it into loops. 'overlay' — both signals as waveforms on one
     * axis (input behind, output in front), synced to a rising zero crossing so
     * periodic tones hold still.
     */
    source?: AnalyserSource;
    /**
     * Transfer / overlay only: the second signal tap — the processed output that
     * `analyser` (the input) is compared against. Same passive, never-mutated
     * contract as `analyser`.
     */
    analyserB?: AnalyserNode | null;
    /** Output-trace / Y-axis color for transfer and overlay. Defaults to `waveColor`. */
    waveColorB?: string;
    /**
     * Transfer only: 'segments' (default) connects successive samples into a
     * curve; 'scatter' plots isolated dots — steadier reading on noisy signals.
     */
    transferDraw?: AnalyserTransferDraw;
    /**
     * Overlay only: samples shown after the sync point — a horizontal zoom.
     * Null / absent shows the analyser's whole buffer.
     */
    windowSize?: number | null;
    /** 'area' — translucent fill under the trace plus a crisp outline. 'line' — outline only. */
    variant?: AnalyserVariant;
    /**
     * 'smooth' — a simplified, interpolated trace. 'pixelated' — crisp, chunky
     * per-column blocks (the waveform visualizer's pixel language).
     */
    mode?: AnalyserMode;
    /**
     * Pixelated mode only: block-size multiplier. 1 (default) ≈ one CSS pixel per
     * column; 2 / 4 / 6 make progressively chunkier, lower-resolution columns.
     */
    pixelSize?: number;
    /** Frequency-axis spacing for the spectrum: 'log' (default, musical) or 'linear'. */
    scale?: AnalyserScale;
    /**
     * Spring-smooth the trace's movement (render-side; composes with the analyser's
     * own data-side smoothingTimeConstant — the spring can overshoot, that never does).
     * `true` for the default feel, or `{ stiffness, damping }` to tune it.
     */
    spring?: AnalyserSpring;
    /** Overlay a faint reference grid (vertical divisions) behind the trace. */
    grid?: boolean;
    /** Vertical divisions in the grid when `grid` is on (default 8). */
    gridSubdivisions?: number;
    /** Trace color. Defaults to the theme color. */
    waveColor?: string;
    /** Area-fill color (drawn translucent). Defaults to `waveColor`. */
    fillColor?: string;
    /**
     * Controlled mute state: dims the trace as feedback. The analyser is a passive
     * tap, so actually silencing the channel is the host's job (gain routing).
     */
    muted?: boolean;
    /** Shows the mute button; called with the requested state on click. */
    onMuteChange?: (muted: boolean) => void;
    /** Controlled solo state (cross-channel — the host owns what "solo" silences). */
    soloed?: boolean;
    /** Shows the solo button; called with the requested state on click. */
    onSoloChange?: (soloed: boolean) => void;
    /** Spectrum only: confine the display to this frequency window in Hz. */
    rangeHz?: readonly [number, number] | null;
    /** Spectrum only: a live vertical reference in Hz, read every frame. */
    marker?: (() => number | null) | null;
    width?: number;
    height?: number;
}
declare function AnalyserVisualization({ analyser, analyserB, source, variant, mode, pixelSize, scale, spring, grid, gridSubdivisions, waveColor, fillColor, waveColorB, transferDraw, windowSize, muted, onMuteChange, soloed, onSoloChange, rangeHz, marker, width, height, }: AnalyserVisualizationProps): react_jsx_runtime.JSX.Element;

interface AnalyserRowProps {
    panelId: string;
    control: ControlMeta;
}
/**
 * The read-only `{ type: 'analyser' }` row: the standalone
 * `AnalyserVisualization` embedded on a control surface. The whole row config
 * (including its two closures — the AnalyserNode getter and the live marker)
 * lives on the ControlMeta and is swapped in place by
 * `TweakStore.syncCurveConfigs`, exactly like the curve row's sampler; this
 * subscribes on the control-state channel and re-reads each swap, which is
 * also what picks up an AnalyserNode that only exists after the host's audio
 * context starts.
 *
 * The canvas engine needs a pixel width, and a panel column's width is the
 * layout's business — so the row measures itself and follows.
 */
declare function AnalyserRow({ panelId, control }: AnalyserRowProps): react_jsx_runtime.JSX.Element;

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

interface GradientControlProps {
    label: string;
    value: GradientValue;
    onChange: (value: GradientValue) => void;
    /** `ramp` opens the editor without the fill-shape chrome (see GradientPanel). */
    form?: 'fill' | 'ramp';
}
declare function GradientControl({ label, value, onChange, form }: GradientControlProps): react_jsx_runtime.JSX.Element;

interface GradientPanelProps {
    value: GradientValue;
    onChange: (value: GradientValue) => void;
    /** Incremental pointer delta while the drag grip is held. */
    onDrag?: (dx: number, dy: number) => void;
    /**
     * `ramp` drops the fill-shape chrome — the linear/radial/conic switcher and
     * the transform pad — leaving the stops alone. For gradients read along one
     * axis (a colour scale, a shader lookup), where a shape would do nothing.
     */
    form?: 'fill' | 'ramp';
}
/** The editor strip is always the linear ramp (position ↔ x), whatever the type. */
declare function GradientPanel({ value, onChange, onDrag, form }: GradientPanelProps): react_jsx_runtime.JSX.Element;

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

interface MultiSelectControlProps {
    label: string;
    value: string[];
    options: MultiSelectOption[];
    onChange: (value: string[]) => void;
}
declare function MultiSelectControl({ label, value, options, onChange }: MultiSelectControlProps): react_jsx_runtime.JSX.Element;

interface ListControlProps {
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    /** Structural signal for engines that bridge list ops imperatively. */
    onEvent: (event: TweakEvent) => void;
}
declare function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent }: ListControlProps): react_jsx_runtime.JSX.Element;

interface CurvePreviewProps {
    panelId: string;
    control: ControlMeta;
}
/**
 * The read-only `{ type: 'curve' }` row: draws the host-supplied sampler on a
 * control surface. The sampler and markers live on the ControlMeta and are
 * swapped in place by TweakStore.syncCurveConfigs (functions are invisible to
 * the config diff; markers ride the same sync), with the swap announced on the
 * control-state channel — so this subscribes there and re-reads each snapshot.
 */
declare function CurvePreview({ panelId, control }: CurvePreviewProps): react_jsx_runtime.JSX.Element;

interface PresetManagerProps {
    panelId: string;
    presets: {
        id: string;
        name: string;
        deletable?: boolean;
        renamable?: boolean;
    }[];
    activePresetId: string | null;
    onAdd: () => void;
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode?: boolean;
    /**
     * Bumped by the host after "+": the dropdown opens and the active preset's
     * name goes straight into inline edit, so a fresh preset gets its name in
     * the same gesture that created it.
     */
    editSignal?: number;
}
declare function PresetManager({ panelId, presets, activePresetId, onAdd, providerMode, editSignal }: PresetManagerProps): react_jsx_runtime.JSX.Element;

interface ShortcutsMenuProps {
    panelId: string;
}
declare function ShortcutsMenu({ panelId }: ShortcutsMenuProps): react_jsx_runtime.JSX.Element | null;

type AudioLevelMeterMode = 'mono' | 'stereo' | 'spectrum';
type AudioLevelMeterColors = readonly [
    low: string,
    middle?: string,
    high?: string
];
interface AudioLevelMeterBaseProps {
    /** Accessible name for the read-only visualization. */
    label?: string;
    /** One to three colors, ordered from the lowest to the highest cells. */
    colors?: AudioLevelMeterColors;
    /** Number of cells in each band. Rounded and clamped to 8–12. */
    cellCount?: number;
    className?: string;
    style?: CSSProperties;
}
interface MonoAudioLevelMeterProps extends AudioLevelMeterBaseProps {
    mode?: 'mono';
    /** Current normalized audio level. Values above 1 trigger clipping. */
    levels: number;
}
interface StereoAudioLevelMeterProps extends AudioLevelMeterBaseProps {
    mode: 'stereo';
    /** Current normalized left and right audio levels. */
    levels: readonly [left: number, right: number];
}
interface SpectrumAudioLevelMeterProps extends AudioLevelMeterBaseProps {
    mode: 'spectrum';
    /** Current normalized spectrum levels. The first 1–12 entries become bands. */
    levels: readonly number[];
}
type AudioLevelMeterProps = MonoAudioLevelMeterProps | StereoAudioLevelMeterProps | SpectrumAudioLevelMeterProps;
declare function AudioLevelMeter(props: AudioLevelMeterProps): ReactElement;

export { AnalyserRow, AnalyserVisualization, AngleDial, AudioLevelMeter, type AudioLevelMeterColors, type AudioLevelMeterMode, type AudioLevelMeterProps, ButtonGroup, Checkbox, ChipsControl, ColorControl, ColorPickerPanel, ControlRenderer, ControlShell, CurvePreview, EasingVisualization, FileControl, FilterControl, Folder, GalleryControl, GradientControl, GradientPanel, ListControl, Module, type MonoAudioLevelMeterProps, MultiSelectControl, NumberControl, PresetManager, RangeSlider, SegmentedControl, SelectControl, ShortcutsMenu, Slider, type SpectrumAudioLevelMeterProps, SpringControl, SpringVisualization, type StereoAudioLevelMeterProps, SwatchControl, TextControl, Toggle, TransferCurve, TransitionControl, type TweakMode, type TweakPosition, TweakRoot, type TweakTheme, TweakTimeline, type TweakTimelineProps, type UseTweakTimelineOptions, type UseTweakersOptions, XYControl, XYPad, type XYPadProps, useTweakTimeline, useTweakers };
