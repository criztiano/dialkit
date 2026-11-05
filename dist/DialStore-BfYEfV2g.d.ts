import { DialPadValue, DialPadConfig } from './dial-pad.js';
import { AnchorConfig, AnchorValue } from './anchor.js';
import { BackgroundConfig, BackgroundValue } from './background.js';

/** One axis of an `xy` config. Missing fields default to 0 to 1 in steps of 0.01. */
type DialXYAxis = {
    min?: number;
    max?: number;
    step?: number;
    /** Where the axis rests. Defaults to the middle of a bipolar axis, else `min`. */
    origin?: number;
    /** The axis has a meaningful middle: it rests there. */
    bipolar?: boolean;
    /** The axis field's name. Defaults to X or Y. */
    label?: string;
};
/**
 * The object form of a pad: `{ type: 'xy', x: { min, max, step }, y: ... }`.
 * It shows as a {@link DialPadConfig} pad and has the same `{ x, y }` value.
 */
type DialXYConfig = {
    type: 'xy';
    /** Starting point. A missing or invalid axis starts at its origin. */
    default?: Partial<DialPadValue>;
    x?: DialXYAxis;
    y?: DialXYAxis;
    /** Hides the label box; the fields fill the row. */
    hideLabel?: boolean;
    /** Drag an axis label left or right to change its value. */
    dragLabels?: boolean;
};

/**
 * A filter: one value, two hands, cutoff and resonance, drawn as the
 * magnitude response they make. `response` draws the app's own filter;
 * without one the control draws a lowpass.
 */
type DialFilterConfig = {
    type: 'filter';
    /** Starting point. A missing hand opens the filter: cutoff at max, resonance at min. */
    default?: Partial<DialFilterValue>;
    cutoff?: DialFilterAxisConfig;
    resonance?: DialFilterAxisConfig;
    /** The drawn response, from each hand's 0 to 1 position: t sweeps the spectrum, y is the gain from 0 to 1. */
    response?: (cutoff01: number, resonance01: number) => (t: number) => number;
    /** `false` draws the response dimmed, as a bypassed filter. Default on. */
    enabled?: boolean;
};
type DialFilterAxisConfig = {
    min?: number;
    max?: number;
    /** 0 or none: continuous. */
    step?: number;
    default?: number;
    /** The hand's slider label. Defaults to Freq and Res. */
    label?: string;
    unit?: string;
};
type DialFilterValue = {
    cutoff: number;
    resonance: number;
};

/**
 * A transfer curve maps input to output (a gamma, a falloff, an edge ramp),
 * both from 0 to 1. Between points the curve is monotone cubic
 * (Fritsch–Carlson), so it never overshoots the values you placed.
 */
type DialTransferConfig = {
    type: 'transfer';
    /** Starting shape. Defaults to straight through. */
    default?: DialTransferValue;
    /** Plot height in px, from 64 to 200. Default 104. */
    height?: number;
    /** Grid divisions behind the curve. Default 4; 0 hides it. */
    grid?: number;
    /** Names for the two axes. */
    axisLabels?: {
        x?: string;
        y?: string;
    };
};
type TransferPoint = {
    x: number;
    y: number;
};
type DialTransferValue = {
    points: TransferPoint[];
};

/**
 * A read-only curve row: draws a shape the app's own values make (a pitch
 * arc, a falloff). It holds no value, so nothing lands in the resolved
 * values, versions, or storage. `sample` may close over the app's state; the
 * React hook keeps it fresh on every render (see `syncLiveConfigs`).
 */
type DialCurveConfig = {
    type: 'curve';
    /** t from 0 to 1 → y. Non-finite results break the stroke there. */
    sample: (t: number) => number;
    /** Fixed y-range. Default: fits each draw with a little headroom. */
    domain?: [number, number];
    /** Vertical reference lines at these x positions from 0 to 1; others are skipped. */
    markers?: readonly number[];
    /** Plot height in px, from 32 to 160. Default 64. Ignored when `aspect` is set. */
    height?: number;
    /** Width ÷ height: the plot keeps its proportions at any panel width. */
    aspect?: number;
    /** `false` hides the label line; a string replaces the key's label. */
    label?: false | string;
};

type AnalyserScale = 'log' | 'linear';
/** `true` uses the default spring; an object sets stiffness and damping. */
type AnalyserSpring = boolean | {
    stiffness?: number;
    damping?: number;
};
/**
 * A read-only live analyser row: a spectrum or an oscilloscope of the app's
 * AnalyserNode. It holds no value, so nothing lands in the resolved values,
 * versions, or storage. The node is only read, never changed: its fftSize,
 * smoothing, and dB window stay the app's.
 */
type DialAnalyserConfig = {
    type: 'analyser';
    /** The live node, read every frame: a getter, so the app can supply it after its audio context starts. */
    analyser: () => AnalyserNode | null;
    /** `'frequency'` (default): a spectrum. `'waveform'`: an oscilloscope. */
    source?: 'frequency' | 'waveform';
    /** `'area'` (default) fills under the trace; `'line'` draws the trace only. */
    variant?: 'line' | 'area';
    /** `'smooth'` (default) or `'pixelated'` blocks. */
    mode?: 'smooth' | 'pixelated';
    /** Pixelated only: the block size multiplier. Default 2. */
    pixelSize?: number;
    /** Spectrum spacing. Default `'log'`. */
    scale?: AnalyserScale;
    /** Spring the trace's movement on top of the node's own smoothing. Default off. */
    spring?: AnalyserSpring;
    /** Spectrum only: show only this frequency window, in Hz. */
    rangeHz?: readonly [number, number];
    /** Spectrum only: a vertical reference line in Hz, read every frame. */
    marker?: () => number | null;
    /** Plot height in px, from 32 to 160. Default 56. */
    height?: number;
    /** `false` hides the label line; a string replaces the key's label. */
    label?: false | string;
};

/**
 * The layer list control's value: the rows, top first, and the selected row.
 *
 * The app owns the layers. It writes the whole value (labels follow the
 * layers' own text), and the control writes back a new value for the three
 * things a user changes in place: the selection, a row's eye and the order.
 * Adding, duplicating and deleting create or remove layers, so the control
 * sends them as actions instead (`layerAction`), and the app writes the new
 * value.
 */
type LayerItem = {
    /** The layer's id: it stays with the row through reordering. */
    id: string;
    /** The row's name. */
    label: string;
    /** Hidden with its eye: the row shows its eye crossed out, and dims. */
    hidden?: boolean;
    /**
     * Not on the canvas right now for another reason the app knows (outside
     * its timing, for example), given as that reason. The row stays normal:
     * only its eye is less bright than on a row whose layer is on the canvas,
     * and the row's hint gives the reason.
     */
    offCanvas?: string;
};
type LayersValue = {
    items: LayerItem[];
    selected: string | null;
};
type LayersConfig = {
    type: 'layers';
    default?: LayersValue;
    /** The add button's text. Default "+ Add". */
    addLabel?: string;
    /** Turns the add button off; its text should say why. */
    addDisabled?: boolean;
    /** The text shown in place of the list when it has no rows. */
    empty?: string;
};

/** A range's value. The helpers keep `min <= max`. */
type RangeValue = {
    min: number;
    max: number;
};
/**
 * A range slider: two handles on one track. `default` falls back to the full
 * track `{ min, max }`, and `step` to the slider's step for the track.
 */
type RangeSliderConfig = {
    type: 'range';
    min: number;
    max: number;
    default?: RangeValue;
    step?: number;
};

type NumberConfig = {
    type: 'number';
    default: number;
    min?: number;
    max?: number;
    /** Falls back to a step that fits `default`, as a bare number's slider does. */
    step?: number;
    /** Shown after the value, as a slider's unit is. */
    unit?: string;
    /** Replaces the shown value; `unit` is then not added. */
    formatValue?: (value: number) => string;
    /** `vertical` puts the label above a centred value, and a drag scrubs up and down. */
    orientation?: 'horizontal' | 'vertical';
};

/**
 * The object form of a slider, for what the `[default, min, max, step?, unit?]`
 * tuple cannot say. `display: 'dial'` draws it as an angle dial: for values
 * whose two ends are the same place (a heading, a hue, a tilt). To the store
 * it stays a slider, so presets, shortcuts and other frameworks see a slider.
 */
type SliderConfig = {
    type: 'slider';
    default: number;
    min: number;
    max: number;
    /** Falls back to the tuple's step for the range. */
    step?: number;
    /** Shown after the value. A dial over a half turn or more shows ° without it. */
    unit?: string;
    /** Replaces the shown value; `unit` is then not added. */
    formatValue?: (value: number) => string;
    display?: 'track' | 'dial';
    /** Dial only: the value the sweep grows from, and the double-click reset. Defaults to `min`. */
    origin?: number;
    /** Dial only: past an end, come back around. Defaults to true for a full turn (360 or more). */
    wrap?: boolean;
};

/**
 * The choice controls: chips, a multiselect, swatches, a file picker and a
 * gallery. Their values stay JSON: a picked file's name, never the file
 * (the files go out on the event channel, see {@link DialEvent}).
 */
type ChipOption = {
    value: string;
    label: string;
    /** Shows a remove button that sends a `remove` event. The app takes the chip out of its options. */
    removable?: boolean;
};
/** One of a set of chips that wrap onto more lines. The value is the chosen chip's value. */
type ChipsConfig = {
    type: 'chips';
    options: ChipOption[];
    default?: string;
};
type MultiSelectOption = {
    value: string;
    label: string;
    /** One quiet line under the label, such as what the option contains. */
    hint?: string;
    /** A small badge next to the label, such as 'local' or 'cloud'. */
    tag?: string;
};
/**
 * Checkbox rows. The value is the checked values, in option order. An
 * option is a `{ value, label }` row or a string (its own value and label).
 */
type MultiSelectConfig = {
    type: 'multiselect';
    options: (string | MultiSelectOption)[];
    default?: string[];
};
type SwatchOption = {
    value: string;
    label: string;
    /** One color shows a chip; more show a strip. */
    colors: string[];
};
/** A dropdown of named palettes. The value is the chosen palette's value. */
type SwatchConfig = {
    type: 'swatch';
    options: SwatchOption[];
    default?: string;
};
/**
 * A file picker. The value is the picked file's name ("3 files" for more
 * than one), or '' when none is picked; the files go out as a `file` event.
 */
type FileConfig = {
    type: 'file';
    /** The file input's `accept`, such as 'image/*' or '.svg,image/svg+xml'. */
    accept?: string;
    multiple?: boolean;
};
type GalleryItem = {
    id: string;
    src?: string;
    alt?: string;
    /** Kept so old configs still type-check. The image picker draws square thumbnails. */
    aspect?: number;
    /** Kept so old configs still type-check. Items without `src` do not show. */
    render?: () => unknown;
};
/** One image from a grid of thumbnails, shown in the image picker. The value is the chosen item's id. */
type GalleryConfig = {
    type: 'gallery';
    items: GalleryItem[];
    default?: string;
    /** Kept so old configs still type-check. The image picker sets its own columns. */
    columns?: number;
};

/**
 * The list control: rows the user adds, renames, reorders and removes. Each
 * row is one of the config's item types and holds that type's fields.
 */
/** One row: its item type and its field values. Plain JSON, so presets keep it. */
type ListItemValue = {
    type: string;
    params: Record<string, number | boolean | string>;
    /** The row's own name, shown in place of its type's label. Absent (never '') without one. */
    title?: string;
};
/**
 * A field of an item type, in the panel's shorthand, scalars only: a slider
 * tuple or number, a boolean, a string (a hex color or text), or a select,
 * color, swatch or text config.
 */
type ListItemField = [number, number, number, number?] | number | boolean | string | {
    type: 'select';
    options: (string | {
        value: string;
        label: string;
    })[];
    default?: string;
} | {
    type: 'color';
    default?: string;
} | SwatchConfig | {
    type: 'text';
    default?: string;
    placeholder?: string;
};
type ListItemType = {
    /** Shown in the add menu, and as a row's title when the row has none of its own. */
    label: string;
    /** The type's fields, by param name. */
    schema: Record<string, ListItemField>;
    /** A hint per field, by param name. */
    hints?: Record<string, string>;
    /**
     * A section per field, by param name. Fields without one stay at the top
     * of the row; each section is a folder below them, the first one open.
     */
    groups?: Record<string, string>;
};
type ListConfig = {
    type: 'list';
    /** The item types a user can add. */
    itemTypes: Record<string, ListItemType>;
    /** The first rows. Each row's missing params take its type's defaults. */
    default?: ListItemValue[];
    /** The most rows the list takes. */
    max?: number;
    /** The add button's text. Default 'Add'. */
    addLabel?: string;
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
/**
 * `icon` is SVG path data in a 24 × 24 box, or a 16 × 16 box with
 * `iconSize: 16`. Segmented controls show it in place of the label.
 */
type SelectOption = string | {
    value: string;
    label: string;
    icon?: string | string[];
    iconSize?: 16 | 24;
};
type SelectConfig = {
    type: 'select';
    options: SelectOption[];
    default?: string;
    /** `'segmented'` shows every option in one row instead of a dropdown. */
    display?: 'dropdown' | 'segmented';
    /** Segmented only: the options fill the row, and the label becomes the group's accessible name. */
    hideLabel?: boolean;
    /**
     * Dropdown only: a first row in the dropdown that adds an option, such as
     * an upload. `label` names it and `hint` is its hint. A click runs the
     * action `<path>.add`.
     */
    add?: SelectAddConfig;
};
type SelectAddConfig = {
    label: string;
    hint?: string;
};
type ColorConfig = {
    type: 'color';
    default?: string;
};
type ImageOption = string | {
    value: string;
    label: string;
};
type ImageConfig = {
    type: 'image';
    /** Image URLs, optionally paired with display labels. */
    options?: ImageOption[];
    /** Defaults to the first option, or an empty string for upload-only controls. */
    default?: string;
};
type TextConfig = {
    type: 'text';
    default?: string;
    placeholder?: string;
};
type DialValue = number | boolean | string | SpringConfig | EasingConfig | ActionConfig | SelectConfig | ColorConfig | ImageConfig | TextConfig | DialPadConfig | DialPadValue | DialXYConfig | DialFilterConfig | DialFilterValue | DialTransferConfig | DialTransferValue | DialCurveConfig | DialAnalyserConfig | BackgroundConfig | BackgroundValue | AnchorConfig | AnchorValue | LayersConfig | LayersValue | ChoiceConfig | string[] | ListItemValue[] | SliderConfig | NumberConfig | RangeSliderConfig | RangeValue | null;
/** The choice controls' configs (see choice.ts and list.ts). */
type ChoiceConfig = ChipsConfig | MultiSelectConfig | SwatchConfig | FileConfig | GalleryConfig | ListConfig;
/**
 * A row: set `_row: true` on a folder with two controls. The folder shows
 * no header; its two controls sit side by side, each with its label above
 * it, like Weight and Size in a type tool. Each value keeps its own path.
 */
type RowConfig = Record<string, never>;
/**
 * The names a row's controls show when its labels sit inside the controls
 * (`--dial-row-label-style: 2`): set `_inlineLabels` on the `_row` folder,
 * from a child key to a shorter name, or `''` to show only the value. The
 * title above each control keeps the full name.
 */
type InlineLabelsConfig = Record<string, string>;
/**
 * A pad group: set `_pad: true` (or these options) on a folder whose first
 * two number children are a pair. The folder shows as one pad: X drives the
 * first value, Y the second, and each value keeps its own path.
 */
type PadGroupConfig = Pick<DialPadConfig, 'labels' | 'mapping' | 'hideLabel' | 'dragLabels'>;
type VisibleWhenValue = string | number | boolean;
/** Shows a control only while another control in the same panel has (`is`) or lacks (`not`) one of the given values. */
type VisibleWhen = {
    /** Path of the watched control, dot-separated inside folders (`'style.outline'`). */
    field: string;
} & ({
    is: VisibleWhenValue | VisibleWhenValue[];
    not?: never;
} | {
    not: VisibleWhenValue | VisibleWhenValue[];
    is?: never;
});
type ShortcutMode = 'fine' | 'normal' | 'coarse';
type ShortcutInteraction = 'scroll' | 'drag' | 'move' | 'scroll-only';
type ShortcutConfig = {
    key?: string;
    modifier?: 'alt' | 'shift' | 'meta';
    mode?: ShortcutMode;
    interaction?: ShortcutInteraction;
};
type ControlMeta = {
    type: 'slider' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'image' | 'text' | 'pad' | 'background' | 'anchor' | 'layers' | 'number' | 'range' | 'chips' | 'multiselect' | 'swatch' | 'file' | 'gallery' | 'list' | 'filter' | 'transfer' | 'curve' | 'analyser';
    path: string;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    children?: ControlMeta[];
    defaultOpen?: boolean;
    /** The folder drawn for this control shows a reset button: `_reset` folders, springs, transitions, and backgrounds. */
    reset?: boolean;
    /** Folder only: `_fields` (`true` or {@link FieldsConfig}) shows its numbers as one row of fields. */
    fields?: boolean;
    /** Fields only: the most decimals a field shows, from `_fields: { decimals }`. See {@link FieldsConfig}. */
    decimals?: number;
    /** Fields only: values show without trailing zeros, from `_fields: { trim: true }`. See {@link FieldsConfig}. */
    trim?: boolean;
    /** Folder only: `_row` shows the folder's two controls side by side. See {@link RowConfig}. */
    row?: RowConfig;
    /** Row only: the names its controls show inside. See {@link InlineLabelsConfig}. */
    inlineLabels?: InlineLabelsConfig;
    /** Folder only: `_pad` shows the folder's first two numbers as one pad. See {@link PadGroupConfig}. */
    padGroup?: PadGroupConfig;
    options?: SelectOption[];
    display?: SelectConfig['display'];
    hideLabel?: boolean;
    /** Select only: the dropdown's add row. See `SelectConfig.add`. */
    add?: SelectAddConfig;
    placeholder?: string;
    pad?: DialPadConfig;
    /** Filter only: the config as written; its `response` is kept fresh by `syncLiveConfigs`. */
    filter?: DialFilterConfig;
    transfer?: DialTransferConfig;
    /** Curve only: the config as written; its `sample` is kept fresh by `syncLiveConfigs`. */
    curve?: DialCurveConfig;
    /** Analyser only: the config as written; its getters are kept fresh by `syncLiveConfigs`. */
    analyser?: DialAnalyserConfig;
    anchor?: AnchorConfig;
    background?: BackgroundConfig;
    /** Layers only: the config, with its default made valid. Its add, duplicate and delete send `layerAction` paths. */
    layers?: LayersConfig & {
        default: LayersValue;
    };
    /** Slider and number: replaces the shown value. */
    formatValue?: (value: number) => string;
    /** Slider only: drawn as an angle dial, from `display: 'dial'`. See {@link SliderConfig}. */
    dial?: boolean;
    /** Angle dial only: where the sweep starts and a double-click returns. See {@link SliderConfig}. */
    origin?: number;
    /** Angle dial only: past an end, come back around. */
    wrap?: boolean;
    /** Number only: the label above a centred value. See {@link NumberConfig}. */
    orientation?: NumberConfig['orientation'];
    /** Range only: the value a double-click on the track restores. */
    rangeDefault?: RangeValue;
    /** Chips only. A removable chip's remove sends a `remove` event. */
    chips?: ChipOption[];
    /** Multiselect only: its options, string options made into rows. */
    multiSelect?: MultiSelectOption[];
    /** Swatch only: the palettes. */
    swatches?: SwatchOption[];
    /** File only. A pick sends a `file` event with the files. */
    file?: FileConfig;
    /** Gallery only: the items. */
    gallery?: GalleryItem[];
    /** List only: the config, with its default made valid. Each change also sends a `list` event. */
    list?: ListConfig & {
        default: ListItemValue[];
    };
    shortcut?: ShortcutConfig;
    visibleWhen?: VisibleWhen;
    /** A short sentence about the control, from its folder's `_hints`. */
    hint?: string;
};
/** How a panel's top-level folders open. See `PanelConfig.folderMode`. */
type FolderMode = 'independent' | 'accordion';
type PanelConfig = {
    id: string;
    name: string;
    controls: ControlMeta[];
    values: Record<string, DialValue>;
    shortcuts: Record<string, ShortcutConfig>;
    kind?: 'timeline';
    /**
     * `false` makes the version menu switch versions only: no rename, lock,
     * delete or reorder (for example a viewer of a shared page). Default `true`.
     */
    presetsEditable?: boolean;
    /** `false` drops the lock button from the version menu. Default `true`. */
    presetsLockable?: boolean;
    /** A short sentence about the panel, shown on its header while the hint key is held. */
    hint?: string;
    /**
     * How the panel's top-level folders open: `'accordion'` keeps one open at
     * a time, `'independent'` lets each open on its own. Without it, the panel
     * follows its DialRoot's `accordion`.
     */
    folderMode?: FolderMode;
    /**
     * Called by the X in the panel's header, instead of closing the panel to
     * a small button: the host removes the panel (a selection panel clears
     * the selection).
     */
    onClose?: () => void;
    /**
     * `false` drops the toolbar (versions and copy) from the panel's header.
     * Default `true`.
     */
    toolbar?: boolean;
    /**
     * A group name. Panels that share one draw as sections of their own shell,
     * titled by the group, apart from the shell of the panels without a group.
     */
    group?: string;
    /**
     * In a group, `true` puts this panel's toolbar (versions and copy) in the
     * group shell's header, and drops its section.
     */
    groupHeader?: boolean;
    /**
     * The name of a group, or of the one panel without a group, that this
     * panel opens next to: out of the column, on the side toward the middle of
     * the screen, level with that shell's top edge. Without that shell, or in
     * an inline root, the panel shows as a shell of its own. A panel in a
     * group stays in its group.
     */
    beside?: string;
    /**
     * The word saved versions are named with: the base version is
     * "<prefix> 1" and each new one the next number ("Version 2"). Without it,
     * versions are "V1", "V2"…
     */
    versionPrefix?: string;
};
type TransitionMode = 'easing' | 'simple' | 'advanced';
/** A curve or spring the user saved, shared by every transition control. */
type TransitionPreset = {
    id: string;
    name: string;
    mode: TransitionMode;
    value: TransitionConfig;
};
/** The transition a transition control copied, with the mode it was in. */
type CopiedTransition = {
    value: TransitionConfig;
    mode: TransitionMode;
};

export type { ControlMeta as C, DialValue as D, EasingConfig as E, ImageOption as I, PanelConfig as P, SpringConfig as S, TransitionConfig as T, TransitionMode as a, TransitionPreset as b, CopiedTransition as c, ShortcutConfig as d };
