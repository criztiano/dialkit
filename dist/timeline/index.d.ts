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
type FolderMetaKey = (typeof FOLDER_META_KEYS)[number];
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
type DialKitPersistOptions = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};

type TimelineClipTrackMeta = {
    prop: string;
    /** Step folder keys when the track is a sequence. */
    stepKeys?: string[];
};
type TimelineClipMeta = {
    key: string;
    label: string;
    color: string;
    /** Code-defined playback behavior; intentionally not exposed as a dial. */
    loop: 'off' | 'repeat';
    /** Group key when the clip lives inside a nested layer, e.g. "circle". */
    group?: string;
    /** Step folder keys for sequence clips, e.g. ["step1", "step2"]. */
    stepKeys?: string[];
    /** Independent property tracks of a props clip — full rows when expanded. */
    tracks?: TimelineClipTrackMeta[];
    /** Seconds the clip keeps acting past its bar. Counted into the
     * timeline's end; a single track draws it as a fading tail. */
    tail?: number;
    /** Single track: the extra row this clip lives on (unset = main lane). */
    lane?: string;
    /** Single track: the row label of `lane`. */
    laneLabel?: string;
    /** Single track: fixed in and out parts (seconds); resizing edits only idle. */
    segments?: {
        in: number;
        out: number;
    };
    /** The bar's hint, shown while the hint key is held over it. */
    hint?: string;
    /** The registered panel the bar's popover shows (see the clip config). */
    panel?: string;
};
type TimelineMeta = {
    id: string;
    name: string;
    duration: number;
    loop: boolean;
    /** Loop wraps back to this time, not 0 — clips before it play once
     * (intro-then-idle). 0 loops the whole timeline. */
    loopStart: number;
    /** `rows` (the default) gives each clip a row; `single` lines every
     * clip up on one track, one after another. */
    track?: 'rows' | 'single';
    /** Single track: the bar that opens the main lane holds its start (see
     * the `pinStart` option). */
    pinStart?: boolean;
    clips: TimelineClipMeta[];
    /**
     * The key of the clip the host is editing, or null. Not the selection and
     * not the playhead: the clip a panel points at can differ from the one
     * under the playhead. Set it with `setHighlight`, not through the config,
     * since it changes while the timeline runs and the config is rebuilt when
     * the clips change. A single track marks that bar.
     */
    highlightedClip?: string | null;
    /** Called with a clip's key when its bar is clicked (the `onClipClick`
     * option). The React dock calls it. */
    onClipClick?: (key: string) => void;
};
type TimelineTransport = {
    time: number;
    playing: boolean;
    duration: number;
    /** Completed loop passes — keeps looping clips phase-continuous across
     * timeline wraps. Reset by seek/replay so scrubbing stays deterministic. */
    wraps: number;
};
type Listener$1 = () => void;
/** Length of the repeating span — the whole timeline unless a loop region
 * narrows it. Degenerate regions (start ≥ duration) fall back to the whole
 * timeline so a bad `from` never stalls the clock. */
declare function loopSpan(duration: number, loopStart: number): number;
/** Folds an over-run playhead back into the loop region, reporting how many
 * spans were crossed so continuous time (wraps × span + time) never jumps. */
declare function foldLoopTime(time: number, duration: number, loopStart?: number): {
    time: number;
    wraps: number;
};
declare const TIMELINE_CLIP_COLORS: string[];
declare class TimelineStoreClass {
    private timelines;
    private transports;
    private listeners;
    private globalListeners;
    private registrationCounts;
    private listCache;
    /** Loop toggled in the dock, kept across updates until the authored
     * option turns looping on or off. */
    private loopToggles;
    private rafId;
    private lastTick;
    register(meta: TimelineMeta, options: {
        autoplay: boolean;
    }): void;
    update(meta: TimelineMeta): void;
    unregister(id: string): void;
    play(id: string): void;
    pause(id: string): void;
    replay(id: string): void;
    /** Turns looping on or off. A `{ from }` loop keeps its start, so turning
     * it back on wraps to the same time. */
    setLoop(id: string, loop: boolean): void;
    /** Names the clip the host is editing, or clears it with null. Kept
     * across meta updates (see `TimelineMeta.highlightedClip`). */
    setHighlight(id: string, clipKey: string | null): void;
    seek(id: string, time: number): void;
    getTransport(id: string): TimelineTransport;
    getTimeline(id: string): TimelineMeta | undefined;
    getTimelines(): TimelineMeta[];
    subscribe(id: string, listener: Listener$1): () => void;
    subscribeGlobal(listener: Listener$1): () => void;
    private applyMeta;
    private ensureLoop;
    private tick;
    private notify;
    private notifyGlobal;
}
declare const TimelineStore: TimelineStoreClass;

type SpringParams = {
    stiffness: number;
    damping: number;
    mass: number;
};
declare function clamp(value: number, min: number, max: number): number;

type TimelineClipLoop = 'off' | 'repeat';
type TimelineStepValues = {
    [key: string]: DialConfig[string] | undefined;
};
type TimelineStepConfig = {
    duration?: number;
    to?: TimelineStepValues;
    transition?: TransitionConfig;
};
type TimelinePropStepConfig = {
    duration?: number;
    to?: number | string;
    transition?: TransitionConfig;
};
type TimelinePropConfig = {
    from?: number | string;
    to?: number | string;
    duration?: number;
    /** Offset from the clip's `at` in seconds. */
    delay?: number;
    transition?: TransitionConfig;
    steps?: TimelinePropStepConfig[];
};
type TimelineClipBase = {
    at: number;
    duration?: number;
    transition?: TransitionConfig;
    loop?: boolean | TimelineClipLoop;
    /**
     * Seconds the clip's motion keeps running past its bar, such as staggered
     * elements still settling. Read-only: no dial and no popover control. The
     * timeline's end covers `at + duration + tail`, and a single track draws
     * it as a fading tail behind the following bars.
     */
    tail?: number;
    /** The name shown in the dock. Defaults to the config key, formatted. */
    label?: string;
    /**
     * Single track: puts the clip on its own row below the main lane. Clips
     * with the same `lane` share that row, without overlap; rows follow the
     * order lanes first appear in the config. Lane clips never bound or snap
     * against clips on another lane, never take the `pinStart` pin, and count
     * toward the timeline's end like any clip. Ignored in rows mode, where
     * every clip has a row of its own.
     */
    lane?: string;
    /** The row label of the clip's `lane`. Falls back to the clip's `label`. */
    laneLabel?: string;
    /**
     * Single track: draws the bar in three parts, `in` and `out` (seconds) at
     * its ends and the idle part between them. Resizing either edge changes
     * only the idle part, so the bar is never shorter than `in + out`.
     */
    segments?: TimelineClipSegments;
    /**
     * Hints for the clip's editor controls, by key: `at`, `duration`,
     * `transition`, `from` or `to`. Each shows while the hint key (H) is held
     * over its control. `duration` replaces the curve's own Duration hint.
     */
    hints?: Record<string, string>;
    /** The clip bar's own hint, shown while the hint key (H) is held over it. */
    hint?: string;
    /**
     * The name of a registered panel. A click on the bar opens that panel in
     * the clip's popover, in place of the clip's own controls, and the panel
     * leaves its own place while the popover shows it. Closing the popover
     * closes the panel, as the panel's own close button does. React dock only
     * for now.
     */
    panel?: string;
};
/** The fixed parts at each end of a segmented clip, in seconds. */
type TimelineClipSegments = {
    in: number;
    out: number;
};
type TimelineClipConfig = TimelineClipBase & ({
    from?: DialConfig;
    to?: DialConfig;
    steps?: never;
    props?: never;
} | {
    from?: DialConfig;
    to?: never;
    /** Sequential legs on one row — a segmented bar; boundaries retime legs. */
    steps: TimelineStepConfig[];
    props?: never;
} | {
    from?: never;
    to?: never;
    steps?: never;
    /** Independent per-property tracks — mutually exclusive with from/to/steps. */
    props: {
        [prop: string]: TimelinePropConfig;
    };
});
/** Nested keys group clips into a collapsible layer — purely presentational. */
type TimelineGroupConfig = {
    [key: string]: TimelineClipConfig;
};
type TimelineConfig = {
    /** Total timeline length in seconds. Inferred from the last clip when omitted. */
    duration?: number;
} & {
    [key: string]: TimelineClipConfig | TimelineGroupConfig | number | undefined;
};
/** CSS-friendly output for consumers not using Motion — spread into a style. */
type TimelineClipCss = {
    transitionDuration: string;
    transitionTimingFunction: string;
};
type TimelineClipValues<C extends TimelineClipConfig = TimelineClipConfig> = {
    at: number;
    duration: number;
    /** Effective code-defined loop mode. */
    loop: TimelineClipLoop;
    /** Playhead is at or past the clip start. */
    started: boolean;
    /** Playhead is inside the clip — for looping clips, inside any cycle. */
    active: boolean;
    /** Playhead is past the clip end (for looping clips, past the timeline end). */
    done: boolean;
    /**
     * 0–1 position of the playhead within the clip — cycle progress (a
     * sawtooth) for looping clips, sequence progress for steps clips.
     */
    progress: number;
    /** Index of the leg under the playhead, for sequence clips. */
    step: C['steps'] extends TimelineStepConfig[] ? number : undefined;
    from: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['from'] extends DialConfig ? ResolvedValues<C['from']> : undefined;
    to: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends DialConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends DialConfig ? ResolvedValues<C['to']> : undefined;
    /** `to` once the clip has started, `from` before — hand it to Motion's animate.
     * For sequences this is the final merged state; for props clips, per-track
     * endpoint records. */
    animate: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends DialConfig ? ResolvedValues<C['from']> : Record<string, number | string> | undefined : C['to'] extends DialConfig ? C['from'] extends DialConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : ResolvedValues<C['to']> | undefined : undefined;
    /** The clip's editable curve — single-curve clips only. */
    transition: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: DialConfig;
    } | {
        to: DialConfig;
    } ? TransitionConfig : undefined;
    /** Duration + timing-function for native CSS transitions — single-curve clips only. */
    css: C['props'] extends Record<string, TimelinePropConfig> ? undefined : C['steps'] extends TimelineStepConfig[] ? undefined : C extends {
        transition: TransitionConfig;
    } | {
        from: DialConfig;
    } | {
        to: DialConfig;
    } ? TimelineClipCss : undefined;
    /**
     * Values interpolated through the clip's curves at the current playhead —
     * bind to style for true scrubbing: the element is exactly at this point
     * in time whether playing, paused, or scrubbing. Sequence clips report the
     * merged state of all legs (declare every animated property in `from`);
     * props clips report every track's value.
     */
    current: C['props'] extends Record<string, TimelinePropConfig> ? {
        [K in keyof C['props']]: number | string;
    } : C['steps'] extends TimelineStepConfig[] ? C['from'] extends DialConfig ? ResolvedValues<C['from']> : Record<string, number | string> : C['to'] extends DialConfig ? C['from'] extends DialConfig ? ResolvedValues<C['from']> | ResolvedValues<C['to']> : undefined : undefined;
};
type TimelineGroupValues<G extends TimelineGroupConfig> = {
    [K in keyof G as G[K] extends TimelineClipConfig ? K : never]: TimelineClipValues<Extract<G[K], TimelineClipConfig>>;
};
type DialTimelineValues<T extends TimelineConfig> = {
    time: number;
    playing: boolean;
    duration: number;
    play: () => void;
    pause: () => void;
    replay: () => void;
    seek: (time: number) => void;
} & {
    [K in keyof T as T[K] extends TimelineClipConfig ? K : never]: TimelineClipValues<Extract<T[K], TimelineClipConfig>>;
} & {
    [K in keyof T as T[K] extends TimelineClipConfig ? never : T[K] extends TimelineGroupConfig ? K : never]: TimelineGroupValues<Extract<T[K], TimelineGroupConfig>>;
};
declare const TIMELINE_MIN_CLIP_DURATION = 0.05;
type ParsedTimeline = {
    duration: number;
    dialConfig: DialConfig;
    clips: TimelineClipMeta[];
};
/** A clip's `segments`, both parts non-negative seconds. Undefined when
 * missing, malformed, or both parts are zero. */
declare function parseClipSegments(value: unknown): TimelineClipSegments | undefined;
/** The shortest a bar may be: `in + out` for a segmented clip (rounded up to
 * the 2-decimal edit step, so idle never dips below zero), the standard
 * minimum otherwise. */
declare function segmentedMinDuration(segments: TimelineClipSegments | undefined): number;
/** How a bar of `duration` splits into in, idle and out. A bar shorter than
 * `in + out` (a stale stored value) shrinks both parts in proportion, with
 * no idle, so the parts never overflow the bar. */
declare function segmentWidths(duration: number, segments: TimelineClipSegments): {
    in: number;
    idle: number;
    out: number;
};
declare function parseTimelineConfig(config: TimelineConfig): ParsedTimeline;
type CurveStatic = {
    duration: number;
    spring?: SpringParams;
    settle?: number;
    ease?: [number, number, number, number];
};
type TimelineStepStatic = {
    key: string | null;
    offset: number;
    duration: number;
    isPhysics: boolean;
    /** Full property state at step start — the hold rule made concrete. */
    start: Record<string, unknown>;
    /** Targets this step animates; untouched properties hold `start`. */
    to: Record<string, unknown>;
    curve: CurveStatic;
};
/**
 * One track: a step chain with its own cycle length and phase offset from
 * the clip's `at`. This is the unified runtime model — a shared-timing clip
 * is exactly one track (prop unset, delay 0) whose steps carry the full
 * property record; a props clip is one single-property track per entry.
 */
type TimelineTrackStatic = {
    /** Set for a props clip's single-property tracks; unset for the shared track. */
    prop?: string;
    delay: number;
    duration: number;
    steps: TimelineStepStatic[];
};
type TimelineClipStatic = {
    key: string;
    childKey: string;
    group?: string;
    at: number;
    /** Effective total duration — the bar length (one cycle for looping clips;
     * the widest track extent for props clips). */
    duration: number;
    loop: TimelineClipLoop;
    /** Where the clip stops affecting values: at + duration, or the timeline end when looping. */
    end: number;
    isPhysics: boolean;
    /** Motion-ready transition, its duration injected from the bar — single-curve clips only. */
    transition?: TransitionConfig;
    css?: TimelineClipCss;
    from?: Record<string, unknown>;
    /** Final merged state (the last leg's landing values for sequences). */
    to?: Record<string, unknown>;
    /** Every animating clip is tracks; empty for markers. */
    tracks: TimelineTrackStatic[];
    explicitSteps: boolean;
    /** Union of every property the clip touches. */
    props?: string[];
};
declare function computeStaticClips(parsed: ParsedTimeline, flatValues: Record<string, DialValue>): TimelineClipStatic[];
type TimelineStaticState = {
    duration: number;
    clips: TimelineClipStatic[];
};
/**
 * Resolves the editable clip model and grows the timeline when a live value
 * creates content beyond its authored window. This is most important for
 * physics springs: changing stiffness/damping changes their emergent length.
 * The parsed duration remains the minimum, so shortening a clip never removes
 * the original editing room.
 */
declare function computeStaticTimeline(parsed: ParsedTimeline, flatValues: Record<string, DialValue>): TimelineStaticState;
/** The dock's resolver: the same static model the hook animates with,
 * rebuilt from flat stored values — bars, popovers, and playback can never
 * disagree about geometry. */
declare function computeClipStaticFromValues(values: Record<string, DialValue>, clip: TimelineClipMeta, timelineDuration: number): TimelineClipStatic;
/**
 * `time` is the playhead (what the dock shows); `cycleTime` is continuous
 * time across timeline wraps (wraps × duration + time). Looping clips fold
 * against `cycleTime`, so a looping timeline never snaps their phase — the
 * window is a viewport onto animations that repeat forever. Scrubbing seeks
 * with cycleTime === time, which is the deterministic first-pass state.
 */
declare function computeClipState(clip: TimelineClipStatic, time: number, cycleTime?: number): Record<string, unknown>;
declare function transitionToCss(transition: TransitionConfig | undefined): TimelineClipCss | undefined;
/** Popover display values: swap stored shape-only transitions for their
 * effective configs (duration injected from the bar/segment) so the curve
 * editor shows the transition as it actually runs. */
declare function timelinePopoverDisplayValues(values: Record<string, DialValue>, clipKey: string, stepKeys?: string[], stepKey?: string): Record<string, DialValue>;
/** Dragging a track bar edits the property's phase offset. */
declare function clampTrackDelay(delay: number, at: number, trackDuration: number, timelineDuration: number): number;
declare function clampClipMove(at: number, duration: number, timelineDuration: number): number;
declare function clampClipResizeEnd(duration: number, at: number, timelineDuration: number): number;
declare function clampClipResizeStart(newAt: number, at: number, duration: number): {
    at: number;
    duration: number;
};
/** Resizing one leg of a sequence: the other legs keep their length, the
 * whole bar must still fit the timeline. */
declare function clampStepResize(duration: number, at: number, otherStepsTotal: number, timelineDuration: number): number;
type TimelineClipSpan = {
    key: string;
    at: number;
    duration: number;
    /** Seconds the clip keeps acting past its bar (see the clip's `tail`). */
    tail?: number;
    /** The clip's `lane`; unset is the main lane. */
    lane?: string;
    /** The shortest the bar may be (see `segmentedMinDuration`). */
    minDuration?: number;
};
/** The `lane` values of a clip list, in config order. The main lane (unset)
 * is not one of them. */
declare function singleTrackLanes(clips: {
    lane?: string;
}[]): string[];
/** Every clip's place on the timeline, from flat stored values. */
declare function timelineClipSpans(values: Record<string, DialValue>, clips: TimelineClipMeta[], timelineDuration: number): TimelineClipSpan[];
/** Where a dragged clip may go, and what a snapping drag lands on. */
type TimelineClipDragBounds = {
    /** Earliest start: 0, or the end of the clip before it on a single track. */
    start: number;
    /** Latest end: the timeline end, or on a single track the start of the
     * clip after it on its lane. The last clip of a single-track lane has no
     * end (Infinity): dragging or resizing it past the end grows the timeline. */
    end: number;
    /** Single track: the start of the clip after it, when there is one. */
    next?: number;
    /** Every other clip's start and end, plus the playhead when given. On a
     * single track, also the end of each tail that reaches past its bar, and
     * only clips on the same lane count. */
    targets: number[];
};
declare function timelineClipDragBounds(spans: TimelineClipSpan[], key: string, timelineDuration: number, options?: {
    singleTrack?: boolean;
    playhead?: number;
}): TimelineClipDragBounds;
/**
 * Moving a clip or one of its edges by `delta` seconds, kept inside
 * `bounds`. With the whole timeline as bounds this is exactly
 * `clampClipMove`, `clampClipResizeEnd` and `clampClipResizeStart`. With
 * `snap` the clip's start or end lands only on a target — the reachable one
 * closest to the pointer — and moves freely when none is reachable. A clip
 * with a `tail` can also land its tail's end on a target, by a move or by
 * its end edge. `minDuration` floors a resize (`segmentedMinDuration` for a
 * segmented clip, so only its idle part shrinks).
 */
declare function dragTimelineClip(mode: 'move' | 'start' | 'end', clip: {
    at: number;
    duration: number;
    tail?: number;
    minDuration?: number;
}, delta: number, bounds: TimelineClipDragBounds, snap?: boolean): {
    at: number;
    duration: number;
};
/**
 * How a press on a single-track bar changes the selection. `toggle` (a
 * Shift-click) adds or removes the bar. `select` (a plain press on the bar
 * body) keeps a selection that holds the bar, so a drag moves all of it,
 * and otherwise selects the bar alone. `edge` (a press on a resize handle)
 * never changes it. Returns the same set when nothing changes.
 */
declare function pressTimelineSelection(selection: ReadonlySet<string>, key: string, press: 'toggle' | 'select' | 'edge'): ReadonlySet<string>;
/**
 * Moving the selected clips of one single-track lane together by `delta`
 * seconds. Each selected clip stops at its unselected neighbors (never at
 * its own current place, so clips that start out overlapping can still be
 * pulled apart) and at 0; the last clip of the lane has no end. With `snap`
 * the block lands its start, its bar end or its tail end on the reachable
 * target closest to the pointer: an unselected clip's start, end or tail
 * end, or the playhead when given. Returns the delta to apply to every
 * selected clip.
 */
declare function timelineBlockMove(spans: TimelineClipSpan[], keys: ReadonlySet<string>, delta: number, options?: {
    snap?: boolean;
    playhead?: number;
}): number;
/**
 * Reorder on a single track: the clips `keys` move, as a run in their
 * current order, to `slot`, an index among the OTHER clips (0 to their
 * count), which keep their order. The gaps stay where they were by
 * position, not with their clips: the n-th clip keeps the n-th gap. `spans`
 * is one lane, sorted by `at`. Returns the new `at` of every clip, by key.
 */
declare function timelineReorderAts(spans: TimelineClipSpan[], keys: readonly string[], slot: number): Record<string, number>;
/** Where lifted clips would land: the slot among the other clips of their
 * lane before the first one whose middle lies past `time`. */
declare function timelineReorderSlot(spans: TimelineClipSpan[], keys: readonly string[], time: number): number;
/** How much of a clip the playhead has crossed, 0 to 1. A clip with no
 * length counts as played once the playhead reaches it. */
declare function timelineClipProgress(time: number, at: number, duration: number): number;
/** Copy-for-agent export: strip editor-only state, normalize shape-only
 * transitions, resolve physics durations, and drop zero-value defaults. */
declare function normalizeTimelineValuesForCopy(values: Record<string, DialValue>, clips: TimelineClipMeta[]): Record<string, DialValue>;
declare function formatClock(time: number, tenths?: boolean): string;
declare function formatSeconds(value: number): string;
declare function formatStepLabel(stepKey: string): string;

interface DialTimelineOptions {
    id?: string;
    persist?: DialKitPersistOptions;
    /**
     * `false` makes the sequence menu switch sequences only: no rename, lock,
     * delete or reorder (for example a viewer of a shared page). Default `true`.
     */
    presetsEditable?: boolean;
    /** `false` drops the lock button from the sequence menu. Default `true`. */
    presetsLockable?: boolean;
    /** Start playing on mount. Defaults to true. */
    autoplay?: boolean;
    /**
     * Loop when the playhead reaches the end. `true` restarts the whole
     * timeline; `{ from }` wraps back to that time instead, so clips before it
     * play once and looping clips keep cycling forever. Defaults to false.
     */
    loop?: boolean | {
        from: number;
    };
    /**
     * `'single'` lines every clip up on one track: clips play one after
     * another, and dragging one stops at its neighbors. Holds plain clips
     * only — groups, steps, props and looping clips need `'rows'`, the
     * default.
     */
    track?: 'rows' | 'single';
    /**
     * Single track only: the bar that opens the timeline holds its start. It
     * cannot be dragged along the lane and has no start handle, so the
     * timeline never opens with a lead gap. Its end handle still sets its
     * length, and whichever bar ends up first holds the pin. Lane clips never
     * take it. Defaults to false. React dock only for now.
     */
    pinStart?: boolean;
    /**
     * Called with a clip's key when its bar is clicked (pressed and released
     * without a drag), before the dock opens the clip's popover. Fires for
     * every clip. To mark the clip the host is editing, name it with
     * `TimelineStore.setHighlight(id, key)`. React dock only for now.
     */
    onClipClick?: (key: string) => void;
}
/** Meta a host sets beside the config, for `buildTimelineMeta`. */
type TimelineMetaExtras = Pick<DialTimelineOptions, 'pinStart' | 'onClipClick'>;
type TimelineActions = {
    play: () => void;
    pause: () => void;
    replay: () => void;
    seek: (time: number) => void;
};
/** One resolution of the public loop option, shared by every adapter. */
declare function resolveTimelineLoop(loop: DialTimelineOptions['loop']): {
    enabled: boolean;
    start: number;
};
declare function buildTimelineMeta(id: string, name: string, duration: number, parsed: ParsedTimeline, loop: DialTimelineOptions['loop'], track?: DialTimelineOptions['track'], extras?: TimelineMetaExtras): TimelineMeta;
/**
 * Framework-neutral frame pass. Adapters only own lifecycle and reactivity;
 * the value shape and loop-cycle math stay identical everywhere.
 */
declare function buildTimelineValues<T extends TimelineConfig>(staticClips: TimelineClipStatic[], transport: TimelineTransport, timelineDuration: number, loopStart: number, actions: TimelineActions): DialTimelineValues<T>;

type Listener = () => void;
type VisibilityController = {
    visible?: boolean;
    defaultVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
};
/**
 * UI-only state shared by the toolkit root and the timeline portal.
 * Playback deliberately lives elsewhere: hiding the editor must never pause
 * or otherwise change the animation it is inspecting.
 */
declare class TimelineUiStoreClass {
    private visible;
    private initialized;
    private controllers;
    private listeners;
    getVisible(): boolean;
    registerController(id: symbol, controller: VisibilityController): () => void;
    updateController(id: symbol, controller: VisibilityController): void;
    requestVisible(visible: boolean): void;
    toggle(): void;
    subscribe(listener: Listener): () => void;
    private notify;
}
declare const TimelineUiStore: TimelineUiStoreClass;

declare function buildCopyInstruction(hookName: string, panelName: string, values: Record<string, DialValue>): string;

declare const isDevDefault: boolean;

export { type DialTimelineOptions, type DialTimelineValues, type ParsedTimeline, TIMELINE_CLIP_COLORS, TIMELINE_MIN_CLIP_DURATION, type TimelineActions, type TimelineClipConfig, type TimelineClipCss, type TimelineClipDragBounds, type TimelineClipLoop, type TimelineClipMeta, type TimelineClipSegments, type TimelineClipSpan, type TimelineClipStatic, type TimelineClipTrackMeta, type TimelineClipValues, type TimelineConfig, type TimelineGroupConfig, type TimelineGroupValues, type TimelineMeta, type TimelineMetaExtras, type TimelinePropConfig, type TimelinePropStepConfig, type TimelineStaticState, type TimelineStepConfig, type TimelineStepStatic, type TimelineStepValues, TimelineStore, type TimelineTrackStatic, type TimelineTransport, TimelineUiStore, buildCopyInstruction, buildTimelineMeta, buildTimelineValues, clamp, clampClipMove, clampClipResizeEnd, clampClipResizeStart, clampStepResize, clampTrackDelay, computeClipState, computeClipStaticFromValues, computeStaticClips, computeStaticTimeline, dragTimelineClip, foldLoopTime, formatClock, formatSeconds, formatStepLabel, isDevDefault, loopSpan, normalizeTimelineValuesForCopy, parseClipSegments, parseTimelineConfig, pressTimelineSelection, resolveTimelineLoop, segmentWidths, segmentedMinDuration, singleTrackLanes, timelineBlockMove, timelineClipDragBounds, timelineClipProgress, timelineClipSpans, timelinePopoverDisplayValues, timelineReorderAts, timelineReorderSlot, transitionToCss };
