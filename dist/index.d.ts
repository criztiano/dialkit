import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

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
     * column; 2 / 4 / 8 make progressively chunkier, lower-resolution columns.
     */
    pixelSize?: number;
    width?: number;
    height?: number;
}
declare function WaveformVisualization({ buffer, progress, getProgress, mode, border, bands, pixelSize, width, height, }: WaveformVisualizationProps): react_jsx_runtime.JSX.Element;

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
}
declare function ColorControl({ label, value, onChange }: ColorControlProps): react_jsx_runtime.JSX.Element;

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

export { type ActionConfig, ButtonGroup, type ChipOption, type ChipsConfig, ChipsControl, type ColorConfig, ColorControl, type ControlMeta, type DialConfig, type DialEvent, type DialMode, type DialPosition, DialRoot, DialStore, type DialTheme, type DialValue, type EasingConfig, EasingVisualization, type FileConfig, FileControl, Folder, type GalleryConfig, GalleryControl, type GalleryItem, type ListConfig, ListControl, type ListField, type ListFieldKind, type ListItemField, type ListItemType, type ListItemValue, Module, type PanelConfig, type Preset, PresetManager, type ResolvedValues, SegmentedControl, type SelectConfig, SelectControl, type ShortcutConfig, type ShortcutInteraction, type ShortcutMode, ShortcutsMenu, Slider, type SpringConfig, SpringControl, SpringVisualization, type SwatchConfig, SwatchControl, type SwatchOption, type TextConfig, TextControl, Toggle, type TransitionConfig, TransitionControl, type UseDialOptions, type WaveformMode, WaveformVisualization, defaultListItemParams, normalizeListItems, parseListItemSchema, useDialKit };
