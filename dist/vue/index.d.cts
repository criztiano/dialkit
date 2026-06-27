import * as vue from 'vue';
import { ComputedRef, ObjectDirective, InjectionKey, Ref, PropType, h, VNode } from 'vue';

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
type DialValue = number | boolean | string | SpringConfig | EasingConfig | ActionConfig | SelectConfig | ColorConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | ListConfig | ListItemValue[];
type DialConfig = {
    [key: string]: DialValue | [number, number, number, number?] | DialConfig;
};
type ResolvedValues<T extends DialConfig> = {
    [K in keyof T]: T[K] extends [number, number, number, number?] ? number : T[K] extends SpringConfig ? TransitionConfig : T[K] extends EasingConfig ? TransitionConfig : T[K] extends SelectConfig ? string : T[K] extends ColorConfig ? string : T[K] extends TextConfig ? string : T[K] extends GalleryConfig ? string : T[K] extends FileConfig ? string : T[K] extends SwatchConfig ? string : T[K] extends ChipsConfig ? string : T[K] extends ListConfig ? ListItemValue[] : T[K] extends DialConfig ? ResolvedValues<T[K]> : T[K];
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
    type: 'slider' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'text' | 'gallery' | 'file' | 'swatch' | 'chips' | 'list';
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

interface UseDialOptions {
    onAction?: (action: string) => void;
    shortcuts?: Record<string, ShortcutConfig>;
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
    mode: DialMode;
    defaultOpen: boolean;
    position: DialPosition;
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
    shortcut: ShortcutConfig;
    origin: number;
    bipolar: boolean;
    shortcutActive: boolean;
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
}>> & Readonly<{
    onOpenChange?: ((...args: any[]) => any) | undefined;
}>, {
    defaultOpen: boolean;
    isRoot: boolean;
    inline: boolean;
    toolbar: (() => ReturnType<typeof h>) | null;
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
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

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
    buffer: AudioBuffer | null;
    getProgress: () => number;
    bands: boolean;
    pixelSize: number;
    gridSubdivisions: number;
    onSeek: (progress: number) => void;
    loop: WaveformLoop | null;
    onLoopChange: (loop: WaveformLoop | null) => void;
    waveColor: string;
    playheadColor: string;
    autoZoomOnLoop: boolean;
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
    height: number;
    width: number;
    direction: DriverDirection;
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
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

declare const PresetManager: vue.DefineComponent<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    presets: {
        type: PropType<Preset[]>;
        required: true;
    };
    activePresetId: {
        type: PropType<string | null>;
        required: false;
        default: null;
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    panelId: {
        type: StringConstructor;
        required: true;
    };
    presets: {
        type: PropType<Preset[]>;
        required: true;
    };
    activePresetId: {
        type: PropType<string | null>;
        required: false;
        default: null;
    };
}>> & Readonly<{}>, {
    activePresetId: string | null;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

export { type ActionConfig, ButtonGroup, type ColorConfig, ColorControl, type ControlMeta, CurveComposer, type CurveComposition, type CurveDriver, type CurveSegment, type CurveType, type DialConfig, type DialKitDirectiveOptions, type DialKitDirectiveValue, type DialMode, type DialPosition, DialRoot, DialStore, type DialTheme, type DialValue, type DriverDirection, type EasingConfig, EasingVisualization, Folder, Module, type PanelConfig, type Preset, PresetManager, type ResolvedValues, SegmentedControl, type SelectConfig, SelectControl, type ShortcutConfig, ShortcutKey, ShortcutListener, type ShortcutState, ShortcutsMenu, Slider, type SpringConfig, SpringControl, SpringVisualization, type TextConfig, TextControl, Toggle, type TransitionConfig, TransitionControl, type UseDialOptions, type WaveformLoop, type WaveformMode, WaveformVisualization, useDialKit, useShortcutContext, vDialKit };
