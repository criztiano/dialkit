import * as vue from 'vue';
import { ComputedRef, ObjectDirective, PropType, InjectionKey, Ref, h, VNode } from 'vue';
import { ShortcutConfig, AffordanceConfig, PresetProvider, TweakConfig, ResolvedValues, TransitionConfig, ControlMeta, TweakValue, RangeValue, SpringConfig, EasingConfig, XYAxis, XYValue as XYValue$1 } from 'tweakers/store';
export { ActionConfig, AffordanceConfig, AffordanceContext, AffordanceStatus, ColorConfig, ControlMeta, EasingConfig, GradientConfig, PanelConfig, Preset, PresetItem, PresetProvider, PresetProviderPreset, ResolvedValues, SelectConfig, ShortcutConfig, SpringConfig, TextConfig, TransitionConfig, TweakConfig, TweakStore, TweakValue, XYAxis, XYConfig, XYValue } from 'tweakers/store';
import { TweakTimelineOptions, TimelineConfig, TweakTimelineValues } from 'tweakers/timeline';
export { TimelineClipConfig, TimelineClipCss, TimelineClipLoop, TimelineClipMeta, TimelineClipTrackMeta, TimelineClipValues, TimelineConfig, TimelineGroupConfig, TimelineGroupValues, TimelineMeta, TimelinePropConfig, TimelinePropStepConfig, TimelineStepConfig, TimelineStepValues, TimelineStore, TimelineTransport, TweakTimelineValues } from 'tweakers/timeline';
import { WaveformMode, WaveformLoop } from 'tweakers/waveform-engine';
export { WaveformLoop, WaveformMode } from 'tweakers/waveform-engine';
import { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from 'tweakers/analyser-engine';
export { AnalyserMode, AnalyserScale, AnalyserSource, AnalyserSpring, AnalyserVariant } from 'tweakers/analyser-engine';
import { CurveSegment, CurveDriver, DriverDirection } from 'tweakers/curve-composer-core';
export { CurveComposition, CurveDriver, CurveSegment, CurveType, DriverDirection, Sampler, SpringifyOptions, springify } from 'tweakers/curve-composer-core';
import { GradientValue } from 'tweakers/gradient-core';
export { DEFAULT_GRADIENT, GradientStop, GradientType, GradientValue, MIN_STOPS, addStop, colorAtPosition, gradientToCss, moveStop, normalizeGradient, removeStop, setGradientAngle, setGradientType, setStopColor } from 'tweakers/gradient-core';
import { XYValue } from 'tweakers/xy-pad-core';

interface UseTweakersOptions {
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
    presets?: PresetProvider | false;
}
declare function useTweakers<T extends TweakConfig>(name: string, config: T, options?: UseTweakersOptions): ComputedRef<ResolvedValues<T>>;

type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type TweakMode = 'popover' | 'inline';
/** `card` is the panel's glass surface; `none` puts the rows straight on the host's ground. */
type TweakChrome = 'card' | 'none';
type TweakTheme = 'light' | 'dark' | 'system';
declare const TweakRoot: vue.DefineComponent<vue.ExtractPropTypes<{
    position: {
        type: () => TweakPosition;
        default: string;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: {
        type: () => TweakMode;
        default: string;
    };
    theme: {
        type: () => TweakTheme;
        default: string;
    };
    productionEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Render only the named panels, in the order given. For apps that place
     * more than one panel surface in more than one place — a rack of per-voice
     * columns beside a global panel, say. Omitted, a root renders every
     * registered panel, which is the single-surface default.
     */
    panels: {
        type: () => string | string[] | undefined;
        default: undefined;
    };
    /**
     * `none` drops the panel card — no glass, no border, no radius, no padding —
     * so the rows sit directly on the host's own surface. For app chrome that
     * already provides the ground the panel would otherwise float on.
     */
    chrome: {
        type: () => TweakChrome;
        default: string;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}> | null, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    position: {
        type: () => TweakPosition;
        default: string;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: {
        type: () => TweakMode;
        default: string;
    };
    theme: {
        type: () => TweakTheme;
        default: string;
    };
    productionEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Render only the named panels, in the order given. For apps that place
     * more than one panel surface in more than one place — a rack of per-voice
     * columns beside a global panel, say. Omitted, a root renders every
     * registered panel, which is the single-surface default.
     */
    panels: {
        type: () => string | string[] | undefined;
        default: undefined;
    };
    /**
     * `none` drops the panel card — no glass, no border, no radius, no padding —
     * so the rows sit directly on the host's own surface. For app chrome that
     * already provides the ground the panel would otherwise float on.
     */
    chrome: {
        type: () => TweakChrome;
        default: string;
    };
}>> & Readonly<{}>, {
    mode: TweakMode;
    defaultOpen: boolean;
    position: TweakPosition;
    theme: TweakTheme;
    productionEnabled: boolean;
    panels: string | string[] | undefined;
    chrome: TweakChrome;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

interface TweakersDirectiveOptions {
    position?: TweakPosition;
    defaultOpen?: boolean;
    mode?: TweakMode;
}
type TweakersDirectiveValue = TweakMode | TweakersDirectiveOptions | undefined;
declare const vTweakers: ObjectDirective<HTMLElement, TweakersDirectiveValue>;

type UseTweakTimelineOptions = TweakTimelineOptions;
declare function useTweakTimeline<T extends TimelineConfig>(name: string, config: T, options?: UseTweakTimelineOptions): ComputedRef<TweakTimelineValues<T>>;

declare const TweakTimeline: vue.DefineComponent<vue.ExtractPropTypes<{
    theme: {
        type: PropType<TweakTheme>;
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
        type: PropType<TweakTheme>;
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
    theme: TweakTheme;
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
        type: PropType<Record<string, TweakValue>>;
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
        type: PropType<Record<string, TweakValue>>;
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
    /**
     * `vertical` renders the column card: fill grows bottom-up, label sits at
     * the base, and the value readout appears over the fill on hover/drag.
     */
    orientation: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
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
    /**
     * `vertical` renders the column card: fill grows bottom-up, label sits at
     * the base, and the value readout appears over the fill on hover/drag.
     */
    orientation: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
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
    orientation: "horizontal" | "vertical";
    origin: number;
    shortcut: ShortcutConfig;
    bipolar: boolean;
    shortcutActive: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

/**
 * Numeric readout card. Drag anywhere on the card to scrub the value
 * (Shift = ×10, Alt = ×0.1); a plain click opens inline text entry.
 */
declare const NumberControl: vue.DefineComponent<vue.ExtractPropTypes<{
    label: {
        type: StringConstructor;
        required: true;
    };
    value: {
        type: NumberConstructor;
        required: true;
    };
    /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
    min: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    max: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    step: {
        type: NumberConstructor;
        required: false;
    };
    unit: {
        type: StringConstructor;
        required: false;
    };
    /** Override the displayed value text; `unit` is not auto-appended. */
    formatValue: {
        type: PropType<(value: number) => string>;
        default: undefined;
    };
    /** `vertical` stacks the label above a centered value (column card). */
    orientation: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
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
    /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
    min: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    max: {
        type: NumberConstructor;
        required: false;
        default: undefined;
    };
    step: {
        type: NumberConstructor;
        required: false;
    };
    unit: {
        type: StringConstructor;
        required: false;
    };
    /** Override the displayed value text; `unit` is not auto-appended. */
    formatValue: {
        type: PropType<(value: number) => string>;
        default: undefined;
    };
    /** `vertical` stacks the label above a centered value (column card). */
    orientation: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    max: number;
    min: number;
    orientation: "horizontal" | "vertical";
    formatValue: (value: number) => string;
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
declare const Checkbox: vue.DefineComponent<vue.ExtractPropTypes<{
    checked: {
        type: BooleanConstructor;
        required: true;
    };
    /** Accessible name — the visible label is rendered by the caller. */
    label: {
        type: StringConstructor;
        default: undefined;
    };
    /** The control exists but cannot act right now: reads as a dash, not a
     *  blank box, so "unavailable" never looks like "off". */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    id: {
        type: StringConstructor;
        default: undefined;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, "change"[], "change", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    checked: {
        type: BooleanConstructor;
        required: true;
    };
    /** Accessible name — the visible label is rendered by the caller. */
    label: {
        type: StringConstructor;
        default: undefined;
    };
    /** The control exists but cannot act right now: reads as a dash, not a
     *  blank box, so "unavailable" never looks like "off". */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    id: {
        type: StringConstructor;
        default: undefined;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {
    label: string;
    disabled: boolean;
    id: string;
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
    /**
     * Root only — the panel declared `_enabled`, so the whole panel is a
     * module: the title carries the switch and the body goes away when it is
     * off. Same idiom as ModuleFolder, one level up.
     */
    enabled: {
        type: BooleanConstructor;
        default: undefined;
    };
    onEnabledChange: {
        type: PropType<(enabled: boolean) => void>;
        default: undefined;
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
    /**
     * Root only — the panel declared `_enabled`, so the whole panel is a
     * module: the title carries the switch and the body goes away when it is
     * off. Same idiom as ModuleFolder, one level up.
     */
    enabled: {
        type: BooleanConstructor;
        default: undefined;
    };
    onEnabledChange: {
        type: PropType<(enabled: boolean) => void>;
        default: undefined;
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
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
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
    title: string;
    path: string;
    hint: string;
    affordance: AffordanceConfig;
    panelId: string;
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
    width: number;
    height: number;
    border: boolean;
    grid: boolean;
    loop: WaveformLoop | null;
    pixelSize: number;
    buffer: AudioBuffer | null;
    getProgress: () => number;
    bands: boolean;
    gridSubdivisions: number;
    onSeek: (progress: number) => void;
    onLoopChange: (loop: WaveformLoop | null) => void;
    waveColor: string;
    playheadColor: string;
    autoZoomOnLoop: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

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
    spring: AnalyserSpring;
    analyser: AnalyserNode | null;
    mode: AnalyserMode;
    source: AnalyserSource;
    width: number;
    height: number;
    scale: AnalyserScale;
    grid: boolean;
    variant: AnalyserVariant;
    pixelSize: number;
    gridSubdivisions: number;
    waveColor: string;
    fillColor: string;
    muted: boolean;
    onMuteChange: (muted: boolean) => void;
    soloed: boolean;
    onSoloChange: (soloed: boolean) => void;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

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
    width: number;
    height: number;
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
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("change" | "drag")[], "change" | "drag", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    value: {
        type: PropType<GradientValue>;
        required: true;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    onDrag?: ((...args: any[]) => any) | undefined;
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
    disabled: boolean;
    x: XYAxis;
    y: XYAxis;
    size: number;
    grid: number | boolean;
    formatValue: (value: XYValue) => string;
    shortcut: ShortcutConfig;
    shortcutActive: boolean;
    density: number;
    snap: boolean;
    returnToCenter: boolean;
    showValues: boolean;
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
        type: PropType<XYValue$1>;
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
        type: PropType<XYValue$1>;
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
    grid: number | boolean;
    shortcut: ShortcutConfig;
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

export { AnalyserVisualization, ButtonGroup, Checkbox, ColorControl, ColorPickerPanel, ControlRenderer, ControlShell, CurveComposer, EasingVisualization, Folder, GradientControl, GradientPanel, Module, NumberControl, PresetManager, RangeSlider, SegmentedControl, SelectControl, ShortcutKey, ShortcutListener, type ShortcutState, ShortcutsMenu, Slider, SpringControl, SpringVisualization, TextControl, TimelineToggleButton, Toggle, TransitionControl, type TweakMode, type TweakPosition, TweakRoot, type TweakTheme, TweakTimeline, type TweakersDirectiveOptions, type TweakersDirectiveValue, type UseTweakTimelineOptions, type UseTweakersOptions, WaveformVisualization, XYControl, XYPad, useShortcutContext, useTweakTimeline, useTweakers, vTweakers };
