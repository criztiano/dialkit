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

export { type ActionConfig, type ChipOption, type ChipsConfig, type ColorConfig, type ControlMeta, type DialConfig, type DialEvent, DialStore, type DialValue, type EasingConfig, type FileConfig, type GalleryConfig, type GalleryItem, type ListConfig, type ListField, type ListFieldKind, type ListItemField, type ListItemType, type ListItemValue, type PanelConfig, type Preset, type ResolvedValues, type SelectConfig, type ShortcutConfig, type ShortcutInteraction, type ShortcutMode, type SpringConfig, type SwatchConfig, type SwatchOption, type TextConfig, type TransitionConfig, defaultListItemParams, normalizeListItems, parseListItemSchema };
