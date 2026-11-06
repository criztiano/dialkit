/** The same [default, min, max, step?] notation used by sliders. */
type DialPadAxis = [number, number, number, number?];
type DialPadValue = {
    x: number;
    y: number;
};
type DialPadConfig = {
    type: 'pad';
    /** Defaults to [0, -1, 1, 0.01]. */
    x?: DialPadAxis;
    /** Positive Y points upward. Defaults to [0, -1, 1, 0.01]. */
    y?: DialPadAxis;
    labels?: {
        x?: string;
        y?: string;
    };
    /**
     * How a value maps to the square. `'linear'` spreads the range evenly.
     * `'centered'` puts each axis's default in the middle: min to default fills
     * one half, default to max the other. Defaults to `'linear'`.
     */
    mapping?: 'linear' | 'centered';
    /** Hides the label box; the fields fill the row, and the label still names the pad. */
    hideLabel?: boolean;
    /** Drag an axis label left or right to change its value. */
    dragLabels?: boolean;
};

type AnchorValue = {
    x: 'left' | 'center' | 'right';
    y: 'top' | 'center' | 'bottom';
};
type AnchorConfig = {
    type: 'anchor';
    /**
     * Omitted axes default to 'center'. `null` starts with no cell picked: the
     * grid highlights none, and a click on any cell picks it.
     */
    default?: Partial<AnchorValue> | null;
};

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
type LayerActionKind = 'add' | 'duplicate' | 'delete';

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
 * What a control tells the app that is not a value: files picked, a chip
 * removed, a list changed. Hear them with `DialStore.subscribeEvents` or
 * the `onEvent` option of `useDialKit`.
 */
type DialEvent = {
    kind: 'file';
    files: FileList;
} | {
    kind: 'remove';
    value: string;
} | {
    kind: 'list';
    op: 'add' | 'remove' | 'move' | 'set' | 'rename';
    index?: number;
    from?: number;
    to?: number;
    itemType?: string;
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
type ListFieldKind = 'slider' | 'toggle' | 'select' | 'color' | 'swatch' | 'text';
/** One field of a row, ready to draw. */
type ListField = {
    key: string;
    label: string;
    kind: ListFieldKind;
    hint?: string;
    group?: string;
    swatchOptions?: SwatchOption[];
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

/** A named value a transition control can apply in one mode. */
interface TransitionPresetOption {
    name: string;
    /** A short description of how it moves; saved presets have none. */
    description?: string;
    value: TransitionConfig;
}

type BackgroundMode = 'solid' | 'gradient' | 'media';
type GradientShape = 'linear' | 'radial' | 'angular' | 'diamond';
type GradientStop = {
    /** Position along the gradient, 0–100. */
    at: number;
    /** Any CSS color the color control accepts, opacity included. */
    color: string;
};
/** A point as a fraction of the box: x 0 is the left edge, y 0 the top edge. */
type GradientPoint = {
    x: number;
    y: number;
};
/**
 * A linear gradient runs from `start` to `end`. The other shapes are centred
 * on `start`; `end` sets the main radius and its direction, and `width` the
 * radius across it.
 */
type GradientHandles = {
    start: GradientPoint;
    end: GradientPoint;
    width: GradientPoint;
};
type BackgroundGradient = {
    shape: GradientShape;
    handles: GradientHandles;
    /** 2–8 stops, sorted by position. */
    stops: GradientStop[];
};
type BackgroundMedia = {
    /** Any URL the browser can show, including data URLs. */
    src: string;
    kind: 'image' | 'video';
};
type BackgroundMediaFit = 'fill' | 'fit' | 'stretch' | 'tile';
type BackgroundMediaRatio = '16:9' | '4:3' | '1:1' | '4:5' | '3:4' | '9:16' | 'source';
type BackgroundMediaDisplay = {
    /** Fill covers the box, Fit shows all of the media, Stretch ignores its shape, Tile repeats it. */
    fit: BackgroundMediaFit;
    /** The shape the media is cropped to; 'source' keeps its own. */
    ratio: BackgroundMediaRatio;
    /** 1–3. */
    zoom: number;
    /** One tile's height as a share of the box's height, 0.05–1. */
    tileSize: number;
    /** The part of the media that stays in view when it is cropped. */
    position: {
        x: 'left' | 'center' | 'right';
        y: 'top' | 'center' | 'bottom';
    };
};
type BackgroundValue = {
    mode: BackgroundMode;
    color: string;
    gradient: BackgroundGradient;
    media: BackgroundMedia | null;
    /** Kept when the media is replaced or removed. */
    mediaDisplay: BackgroundMediaDisplay;
};
/** A value with any field left out; missing fields keep their current value or the default. */
type BackgroundValueUpdate = {
    mode?: BackgroundMode;
    color?: string;
    gradient?: Partial<BackgroundGradient>;
    media?: BackgroundMedia | null;
    mediaDisplay?: Partial<BackgroundMediaDisplay>;
};
type BackgroundConfig = {
    type: 'background';
    default?: BackgroundValueUpdate;
    /** Stores a dropped or picked file and returns its URL. Without it, files up to 10 MB are read as data URLs. */
    upload?: (file: File) => Promise<string>;
};
type SavedGradient = {
    id: string;
    gradient: BackgroundGradient;
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
 * Folder keys that configure the folder instead of adding a control:
 * `_collapsed`, `_fields`, `_reset`, `_hints` (a sentence per child key),
 * `_labels` (the text a child's row shows in place of its key's own words),
 * `_row` and `_inlineLabels` (see {@link RowConfig}), and `_pad` (see
 * {@link PadGroupConfig}).
 */
declare const FOLDER_META_KEYS: readonly ["_collapsed", "_fields", "_reset", "_hints", "_labels", "_row", "_inlineLabels", "_pad"];
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
/**
 * A field row: `_fields: true`, or these options. See {@link ControlMeta.fields}.
 */
type FieldsConfig = {
    /**
     * Most decimals a field shows. The value keeps its precision: only the
     * display rounds, and a click on the number shows the exact value.
     */
    decimals?: number;
    /**
     * Shows each value without trailing zeros: "1" for 1.00, "1.5" for 1.50,
     * and never "-0". With `decimals`, that still caps the count. Default off.
     */
    trim?: boolean;
};
type FolderMetaKey = (typeof FOLDER_META_KEYS)[number];
/**
 * A slider: `[default, min, max, step?, unit?]`. The unit shows after the
 * value: `[12, -180, 180, 1, '°']` shows "12°".
 */
type RangeConfig = [number, number, number, number?, string?];
type DialConfig = {
    [key: string]: DialValue | [number, number, number, number?, string?] | DialConfig | ControlWithVisibility;
};
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
type ControlWithVisibility<T = DialValue | [number, number, number, number?, string?] | DialConfig> = {
    value: T;
    visibleWhen: VisibleWhen;
};
/** Shows `control` (any control or folder) only while `rule` holds. Hidden controls keep their values. */
declare function withVisibility<T extends DialValue | [number, number, number, number?, string?] | DialConfig>(control: T, rule: VisibleWhen): ControlWithVisibility<T>;
/** The control inside a {@link withVisibility} wrapper; any other value as is. */
declare function unwrapVisibility(value: DialConfig[string]): DialConfig[string];
/** An anchor's value: a cell, or `null` (no cell picked) when its default is `null`. */
type AnchorConfigValue<C> = C extends {
    default: null;
} ? AnchorValue | null : AnchorValue;
/** Rows that draw but hold no value: they have no key in the resolved values. */
type DisplayConfig = DialCurveConfig | DialAnalyserConfig;
type ResolvedValues<T extends DialConfig> = {
    [K in keyof T as K extends FolderMetaKey ? never : T[K] extends DisplayConfig ? never : K]: T[K] extends ControlWithVisibility<infer U extends DialConfig[string]> ? ResolvedValues<{
        value: U;
    }> extends {
        value: infer V;
    } ? V : never : T[K] extends [number, number, number, number?, string?] ? number : T[K] extends SpringConfig ? TransitionConfig : T[K] extends EasingConfig ? TransitionConfig : T[K] extends SelectConfig ? string : T[K] extends ColorConfig | ImageConfig ? string : T[K] extends TextConfig ? string : T[K] extends DialPadConfig | DialXYConfig ? DialPadValue : T[K] extends DialFilterConfig ? DialFilterValue : T[K] extends DialTransferConfig ? DialTransferValue : T[K] extends BackgroundConfig ? BackgroundValue : T[K] extends AnchorConfig ? AnchorConfigValue<T[K]> : T[K] extends LayersConfig ? LayersValue : T[K] extends SliderConfig | NumberConfig ? number : T[K] extends RangeSliderConfig ? RangeValue : T[K] extends ChipsConfig | SwatchConfig | FileConfig | GalleryConfig ? string : T[K] extends MultiSelectConfig ? string[] : T[K] extends ListConfig ? ListItemValue[] : T[K] extends DialConfig ? ResolvedValues<T[K]> : T[K];
};
type DialKitValueUpdates<T extends DialConfig> = {
    [K in keyof T as K extends FolderMetaKey ? never : T[K] extends DisplayConfig ? never : K]?: T[K] extends ControlWithVisibility<infer U extends DialConfig[string]> ? DialKitValueUpdates<{
        value: U;
    }> extends {
        value: infer V;
    } ? V : never : T[K] extends [number, number, number, number?, string?] ? number : T[K] extends SpringConfig | EasingConfig ? TransitionConfig : T[K] extends ActionConfig ? never : T[K] extends SelectConfig | ColorConfig | ImageConfig | TextConfig ? string : T[K] extends DialPadConfig | DialXYConfig ? DialPadValue : T[K] extends DialFilterConfig ? DialFilterValue : T[K] extends DialTransferConfig ? DialTransferValue : T[K] extends BackgroundConfig ? BackgroundValueUpdate : T[K] extends AnchorConfig ? AnchorConfigValue<T[K]> : T[K] extends LayersConfig ? LayersValue : T[K] extends SliderConfig | NumberConfig ? number : T[K] extends RangeSliderConfig ? RangeValue : T[K] extends ChipsConfig | SwatchConfig | FileConfig | GalleryConfig ? string : T[K] extends MultiSelectConfig ? string[] : T[K] extends ListConfig ? ListItemValue[] : T[K] extends DialConfig ? DialKitValueUpdates<T[K]> : T[K];
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
type Listener = () => void;
type ActionListener = (action: string) => void;
type EventListener = (path: string, event: DialEvent) => void;
type ResetListener = (folderPath: string) => void;
type Preset = {
    id: string;
    name: string;
    values: Record<string, DialValue>;
    locked?: boolean;
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
type DialKitPersistOptions = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};
type DialStorePanelOptions = {
    defaultCollapsed?: boolean;
    retainOnUnmount?: boolean;
    persist?: DialKitPersistOptions;
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
declare function resolveDialValues<T extends DialConfig>(config: T, flatValues: Record<string, DialValue>): ResolvedValues<T>;
declare function flattenDialValueUpdates<T extends DialConfig>(config: T, updates: DialKitValueUpdates<T>): Record<string, DialValue>;
/** Folder metadata such as `_collapsed` configures the folder and is not a value. */
declare function isFolderMetaKey(key: string): boolean;
declare function isLeafConfigValue(value: unknown): boolean;
declare function isSpringConfigValue(value: unknown): value is SpringConfig;
declare function isEasingConfigValue(value: unknown): value is EasingConfig;
declare function isHexColor(value: string): boolean;
/** camelCase → Title Case, the label rule used everywhere a key becomes UI text. */
declare function formatLabel(key: string): string;
/** Default slider step for a numeric range. */
declare function inferStep(min: number, max: number): number;
declare class DialStoreClass {
    private panelOpenListeners;
    private panelOpenStates;
    private panels;
    private controlsByPanel;
    private resetKeysByPanel;
    private allControls;
    private panelsSnapshot;
    private standardPanelsSnapshot;
    private timelinePanelsSnapshot;
    private listeners;
    private globalListeners;
    /** Names of the panels a timeline clip popover shows. See setPanelInPopover. */
    private panelsInPopover;
    private snapshots;
    private actionListeners;
    private eventListeners;
    private resetListeners;
    private presets;
    private activePreset;
    private gradients;
    private baseValues;
    private baseNames;
    private defaultValues;
    /** Host values a reset returns to, over the defaults. See setResetValues. */
    private hostResetValues;
    /** How many resets ran: a slider that sees it change springs to its new value instead of jumping. */
    private resetCount;
    private lastResetAt;
    private registrationCounts;
    private retainedPanels;
    private persistConfigs;
    private transitionPresets;
    private transitionStorageLoaded;
    private copiedTransition;
    private transitionListeners;
    /**
     * Parsed configs per panel id, by `parsedConfigKey`. A host that swaps
     * between a few configs (layout presets) registers the same shapes again
     * and again; a parsed tree is never changed after its parse, so it can be
     * shared.
     */
    private parsedConfigs;
    /** The cache key of the config each registered panel holds. */
    private panelConfigKeys;
    registerPanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>, options?: DialStorePanelOptions): void;
    updatePanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>, options?: DialStorePanelOptions): void;
    unregisterPanel(id: string): void;
    /** Undefined delegates the initial state to DialRoot.defaultOpen. */
    getPanelOpen(panelId: string): boolean | undefined;
    isPanelOpen(panelId: string): boolean;
    togglePanelOpen(panelId: string): void;
    /** Applies a host component's own default; no-op once the panel has state. */
    initPanelOpen(panelId: string, open: boolean): void;
    /** Observe open requests so a containing toolkit can reveal its requested panel. */
    subscribePanelOpen(listener: (panelId: string, open: boolean) => void): () => void;
    setPanelOpen(panelId: string, open: boolean): void;
    updateValue(panelId: string, path: string, value: DialValue): void;
    updateValues(panelId: string, updates: Record<string, DialValue>): void;
    resetValues(panelId: string): void;
    /**
     * Restore the defaults behind a folder's reset button: every value inside a
     * `_reset` folder, nested folders included, or a spring, transition or
     * background's own value. Saves like any other edit.
     *
     * Reset listeners (see `subscribeResets`) hear the folder's path first,
     * before any value changes, so a host can start its own motion from the
     * values the reset is about to replace.
     */
    resetFolder(panelId: string, path: string): void;
    /** True when a value that `resetFolder` restores differs from its reset value, so the reset button shows. */
    isFolderChanged(panelId: string, path: string): boolean;
    /**
     * Put the given paths back to their reset values (see `setResetValues`),
     * for a host that draws rows from several folders or panels. A path with
     * no reset value is left as it is. With `folder`, reset listeners hear
     * that folder's path first, as they do for `resetFolder`.
     */
    resetPaths(panelId: string, paths: string[], options?: {
        folder?: string;
    }): void;
    /** True when a value at one of the paths differs from its reset value. */
    hasChanges(panelId: string, paths: string[]): boolean;
    /**
     * The values a reset returns to, by path, when they are not the config's
     * defaults: for example when the host passes saved values as defaults, so
     * a panel opens on them, but a reset goes back to its own defaults. Each
     * call replaces the last. Once set, `resetFolder` and `isFolderChanged`
     * use only these paths: a path left out is one no reset returns to a
     * default. List `<path>.__mode` to reset a transition's mode too.
     */
    setResetValues(panelId: string, values: Record<string, DialValue>): void;
    /** The value each path resets to: the values from `setResetValues`, else the defaults. */
    getResetValues(panelId: string): Record<string, DialValue>;
    /** The value a reset puts at `path`, or undefined when no reset changes it. */
    getResetValue(panelId: string, path: string): DialValue | undefined;
    /**
     * Counts the resets so far. A value that changes right after a new count
     * came from a reset, so a control can animate it; other outside changes,
     * like timeline playback, keep following the value at once.
     */
    getResetCount(): number;
    /** When the last reset ran, in `performance.now()` time. */
    getLastResetAt(): number;
    private resetTargets;
    /** Writes the reset value of each listed path that has one, and counts the reset. */
    private writeResetValues;
    updateSpringMode(panelId: string, path: string, mode: 'simple' | 'advanced'): void;
    getSpringMode(panelId: string, path: string): 'simple' | 'advanced';
    updateTransitionMode(panelId: string, path: string, mode: TransitionMode): void;
    getTransitionMode(panelId: string, path: string): TransitionMode;
    getValue(panelId: string, path: string): DialValue | undefined;
    getValues(panelId: string): Record<string, DialValue>;
    getDefaultValues(panelId: string): Record<string, DialValue>;
    getPanels(kind?: 'panel' | 'timeline'): PanelConfig[];
    getPanel(id: string): PanelConfig | undefined;
    /** Looks up a control by path, including one its visibility rule hides. */
    getControl(panelId: string, path: string): ControlMeta | undefined;
    subscribe(panelId: string, listener: Listener): () => void;
    subscribeGlobal(listener: Listener): () => void;
    /**
     * Shows or hides a panel, by name, in a timeline clip popover (`panel` on
     * a clip). DialRoot leaves the panel out while a popover shows it.
     */
    setPanelInPopover(name: string, shown: boolean): void;
    isPanelInPopover(name: string): boolean;
    subscribeActions(panelId: string, listener: ActionListener): () => void;
    triggerAction(panelId: string, path: string): void;
    /** Hear what a panel's controls tell the app that is not a value: files picked, chips removed, lists changed. */
    subscribeEvents(panelId: string, listener: EventListener): () => void;
    emitEvent(panelId: string, path: string, event: DialEvent): void;
    /**
     * Hear each folder reset of a panel, with the path of the folder (or the
     * spring, transition or background) being reset. The listener runs before
     * the reset writes its values, so the values it reads are still the old ones.
     */
    subscribeResets(panelId: string, listener: ResetListener): () => void;
    private notifyReset;
    /**
     * Saves the current values as the next numbered version: "V2", "V3"…, or under its own
     * `prefix` ("Sequence 2" in a timeline), else the panel's `versionPrefix` ("Version 2").
     * Older saves used "Version N"; both count toward the next V.
     */
    saveNewPreset(panelId: string, prefix?: string | undefined): string;
    savePreset(panelId: string, name: string): string;
    loadPreset(panelId: string, presetId: string): void;
    deletePreset(panelId: string, presetId: string): void;
    /** Rename a saved version. A null presetId renames the base version. */
    renamePreset(panelId: string, presetId: string | null, name: string): void;
    /** Where a panel's saved versions persist, if they do. */
    getPresetStorage(panelId: string): {
        key: string;
        storage: 'localStorage' | 'sessionStorage';
    } | null;
    /** Display name of the base version (the values before any saved preset): "V1", or "<versionPrefix> 1". */
    getBaseName(panelId: string): string;
    setPresetLocked(panelId: string, presetId: string, locked: boolean): void;
    reorderPresets(panelId: string, presetIds: string[]): void;
    getPresets(panelId: string): Preset[];
    /** Saved gradients belong to the panel, and persist with it when it opts in. */
    saveGradient(panelId: string, gradient: BackgroundGradient): string;
    deleteGradient(panelId: string, gradientId: string): void;
    getSavedGradients(panelId: string): SavedGradient[];
    /** Whether the version menu may rename, lock, delete and reorder versions. See `presetsEditable`. */
    isPresetsEditable(panelId: string): boolean;
    /** Whether the version menu shows lock buttons: only on an editable menu. See `presetsLockable`. */
    isPresetsLockable(panelId: string): boolean;
    getActivePresetId(panelId: string): string | null;
    clearActivePreset(panelId: string): void;
    /** Saved curves and springs, shared by every transition control. */
    getTransitionPresets(): TransitionPreset[];
    /** The built-in curves (Easing) or springs (Time and Physics) for a mode, each with a short description of how it moves. */
    getDefaultTransitionPresets(mode: TransitionMode): TransitionPresetOption[];
    /** Saves a transition for its mode as "Custom N" and returns the new preset's id. */
    saveTransitionPreset(value: TransitionConfig, mode: TransitionMode): string;
    deleteTransitionPreset(id: string): void;
    copyTransition(value: TransitionConfig, mode: TransitionMode): void;
    /** A copy of the copied transition, so applying it never changes what was copied. */
    getCopiedTransition(): CopiedTransition | null;
    clearCopiedTransition(): void;
    /** Notifies when saved transitions or the copied transition change. */
    subscribeTransitions(listener: Listener): () => void;
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
    private configurePanelRetention;
    private reconcileValues;
    private setPresets;
    private reconcilePresets;
    private normalizePersistConfig;
    private loadPersistedPanel;
    private persistPanel;
    private getStorage;
    private setTransitionPresets;
    /** Saved transitions follow panel persistence: they are stored wherever a panel persists its presets. */
    private transitionStorageKinds;
    /** Merges the transitions saved in a storage the first time a persisted panel uses it. */
    private loadTransitionPresets;
    private persistTransitionPresets;
    private notifyTransitions;
    /** Keeps the full tree aside and shows the controls whose rules hold. */
    private setVisibleControls;
    /** Re-applies visibility rules after a write. `getPanels()` snapshots are cached, so a changed tree refreshes them too. */
    private updateVisibility;
    /** Hidden controls ignore shortcuts. */
    private isShown;
    private notify;
    private notifyGlobal;
    /**
     * Parses through the panel's cache. The result is stored only after a
     * parse succeeds, so an invalid config still throws before the store
     * changes.
     */
    private parseCached;
    /** Compile controls, defaults, and the lookup index in one walk. */
    private parseConfig;
    private inferRange;
    private normalizePreservedValue;
}
declare const DialStore: DialStoreClass;

export { type ActionConfig, type AnalyserScale, type AnalyserSpring, type AnchorConfig, type AnchorValue, type BackgroundConfig, type BackgroundGradient, type BackgroundMedia, type BackgroundMediaDisplay, type BackgroundMediaFit, type BackgroundMediaRatio, type BackgroundMode, type BackgroundValue, type BackgroundValueUpdate, type ChipOption, type ChipsConfig, type ColorConfig, type ControlMeta, type ControlWithVisibility, type CopiedTransition, type DialAnalyserConfig, type DialConfig, type DialCurveConfig, type DialEvent, type DialFilterAxisConfig, type DialFilterConfig, type DialFilterValue, type DialKitPersistOptions, type DialKitValueUpdates, type DialPadAxis, type DialPadConfig, type DialPadValue, DialStore, type DialStorePanelOptions, type DialTransferConfig, type DialTransferValue, type DialValue, type DialXYAxis, type DialXYConfig, type EasingConfig, type FieldsConfig, type FileConfig, type FolderMode, type GalleryConfig, type GalleryItem, type GradientHandles, type GradientPoint, type GradientShape, type GradientStop, type ImageConfig, type ImageOption, type InlineLabelsConfig, type LayerActionKind, type LayerItem, type LayersConfig, type LayersValue, type ListConfig, type ListField, type ListFieldKind, type ListItemField, type ListItemType, type ListItemValue, type MultiSelectConfig, type MultiSelectOption, type NumberConfig, type PadGroupConfig, type PanelConfig, type Preset, type RangeConfig, type RangeSliderConfig, type RangeValue, type ResolvedValues, type RowConfig, type SavedGradient, type SelectAddConfig, type SelectConfig, type SelectOption, type ShortcutConfig, type ShortcutInteraction, type ShortcutMode, type SliderConfig, type SpringConfig, type SwatchConfig, type SwatchOption, type TextConfig, type TransferPoint, type TransitionConfig, type TransitionMode, type TransitionPreset, type VisibleWhen, type VisibleWhenValue, flattenDialValueUpdates, formatLabel, inferStep, isEasingConfigValue, isFolderMetaKey, isHexColor, isLeafConfigValue, isSpringConfigValue, resolveDialValues, unwrapVisibility, withVisibility };
