import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode } from 'react';

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
type FilterShapeType = 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'peak';
/**
 * A 2-pole biquad magnitude over a log frequency sweep, for a `response`:
 * `response: (c, r) => filterShapeResponse('highpass', c, r)`. The knee
 * sweeps 3 decades and Q runs from 0.7 (no bump) to about 10.
 */
declare function filterShapeResponse(type: FilterShapeType, cutoff01: number, resonance01: number): (t: number) => number;

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
/** The curve's output at `x` from 0 to 1. Outside the domain it holds the ends. */
declare function sampleTransfer(points: TransferPoint[], x: number): number;
/** The curve as `size` samples across the domain: a 1-D texture for a shader. */
declare function transferLut(points: TransferPoint[], size?: number): Float32Array;

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
/**
 * The action path a layer list sends: `<path>:add`, or
 * `<path>:duplicate:<id>` and `<path>:delete:<id>` for one row.
 */
declare function layerAction(path: string, kind: LayerActionKind, id?: string): string;
/** Reads an action path sent by the layer list at `path`, or null for any other action. */
declare function parseLayerAction(path: string, action: string): {
    kind: LayerActionKind;
    id?: string;
} | null;
/**
 * A complete, valid value: rows without a string id or label are dropped,
 * repeated ids keep their first row, and a selection that names no row
 * becomes null.
 */
declare function normalizeLayersValue(value: unknown, fallback?: LayersValue): LayersValue;

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
type ListFieldGroup = {
    label: string;
    fields: ListField[];
};
/** An item type's schema as fields, in declared order. Fields it cannot read are left out. */
declare function parseListItemSchema(schema: Record<string, ListItemField>, hints?: Record<string, string>, groups?: Record<string, string>): ListField[];
/** A row's fields split into its top area and its sections, in the order each section's first field is declared. */
declare function groupListFields(fields: ListField[]): {
    flat: ListField[];
    groups: ListFieldGroup[];
};
/** The params of a new row of a type. */
declare function defaultListItemParams(schema: Record<string, ListItemField>): Record<string, number | boolean | string>;
/**
 * Rows made valid against the item types: rows of an unknown type drop,
 * missing params take their type's defaults, and a blank title drops. A
 * value that is not a list becomes the fallback.
 */
declare function normalizeListItems(value: unknown, itemTypes: Record<string, ListItemType>, fallback?: ListItemValue[]): ListItemValue[];

type BezierPoints = EasingConfig['ease'];

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
declare const GRADIENT_SHAPES: readonly GradientShape[];
/** Black to white, top to bottom, each end 10% in from the edge. */
declare function defaultBackgroundValue(): BackgroundValue;
/** The default handles: a top to bottom linear gradient, each end 10% in from the edge. */
declare function defaultGradientHandles(): GradientHandles;
/**
 * The handles for a gradient saved before handles existed, which had a CSS
 * `angle` instead (0 points up, 90 right, 180 down). For a host that rewrites
 * its old data; `normalizeGradient` does not read `angle`.
 *
 * Linear: the line passes through the centre along d = (sin θ, -cos θ), half
 * as long as CSS's own gradient line, h = (|sin θ| + |cos θ|) / 2, so
 * start = centre - d·h, end = centre + d·h, and the width point sits a
 * quarter turn from the end: 180 gives start (0.5, 0), end (0.5, 1),
 * width (0, 0.5). Radial is centred, as `radial-gradient(circle at center)`.
 */
declare function legacyGradientHandles(shape: 'linear' | 'radial', angle: number): GradientHandles;
/**
 * A complete, valid value. Each missing or invalid field falls back to the
 * same field of `fallback` (the current value, or the default), so a partial
 * update such as `{ mode: 'gradient' }` keeps everything else.
 */
declare function normalizeBackgroundValue(value: unknown, fallback?: BackgroundValue): BackgroundValue;
/**
 * Switching between Linear and the centred shapes keeps the gradient in
 * place: the centre goes to the middle of the line, with the width point a
 * quarter turn from the end, and back again. Between the centred shapes the
 * handles stay as they are. The stops never change.
 *
 * `aspect` is the box's width / height. The quarter turn is taken in the
 * box's pixels, so a centred shape starts as a circle on screen, even in a
 * wide box. Without it the box is square.
 */
declare function switchGradientShape(gradient: BackgroundGradient, shape: GradientShape, aspect?: number): BackgroundGradient;
/** The gradient's axes in pixels for a box of `width` × `height`. */
type GradientFrame = {
    cx: number;
    cy: number;
    ax: number;
    ay: number;
    nx: number;
    ny: number;
    r1: number;
    r2: number;
};
declare function gradientFrame(handles: GradientHandles, width: number, height: number): GradientFrame;
/**
 * Where a pixel falls on the gradient: 0 at the first position, 1 at the
 * last. With u and v the pixel's distance from the centre along each axis,
 * in radii: linear t = u, radial √(u² + v²), diamond |u| + |v|, and angular
 * the turn from the end handle towards the width side.
 */
declare function gradientParamAt(shape: GradientShape, frame: GradientFrame, x: number, y: number): number;
/** Draws a gradient into a canvas at the canvas's own size, every shape exactly. */
declare function paintGradient(canvas: HTMLCanvasElement, gradient: BackgroundGradient): void;
/**
 * The gradient as a CSS image for a square box. Linear is exact; radial and
 * angular are exact while the handles keep to the box's axes, as the panel
 * keeps them. CSS has no diamond gradient, so a diamond is drawn as its
 * radial ellipse; use `paintGradient` to draw it exactly.
 */
declare function backgroundGradientCss(gradient: BackgroundGradient): string;
type MediaCssProperty = 'background-image' | 'background-position' | 'background-repeat' | 'background-size' | 'object-fit' | 'object-position' | 'transform' | 'transform-origin';
/**
 * The media as CSS properties, as the panel's preview draws it, keyed by CSS
 * property name. Give them to an element that fills a box with
 * `overflow: hidden`: any element for an image, which becomes its background,
 * or the `<video>` itself. Zoom scales the media around the part kept in view.
 * Tile repeats an image; a video fills its box instead. The ratio is the box's
 * shape, so set the box's `aspect-ratio` to it (or to the media's own for
 * `"source"`).
 */
declare function backgroundMediaCss(media: BackgroundMedia, display: BackgroundMediaDisplay): Partial<Record<MediaCssProperty, string>>;

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
type Listener$3 = () => void;
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
    subscribe(panelId: string, listener: Listener$3): () => void;
    subscribeGlobal(listener: Listener$3): () => void;
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
    subscribeTransitions(listener: Listener$3): () => void;
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

interface UseDialOptions {
    id?: string;
    defaultCollapsed?: boolean;
    persist?: DialKitPersistOptions;
    onAction?: (action: string) => void;
    /** Called with what a control tells the app that is not a value: files picked (`file`), a chip removed, a list changed. */
    onEvent?: (path: string, event: DialEvent) => void;
    /**
     * Called with a folder's path when its reset button (or `DialStore.resetFolder`)
     * resets it, before the reset writes the values back.
     */
    onReset?: (folderPath: string) => void;
    shortcuts?: Record<string, ShortcutConfig>;
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
}
interface DialKitController<T extends DialConfig> {
    values: ResolvedValues<T>;
    setValue: (path: string, value: DialValue) => void;
    setValues: (values: DialKitValueUpdates<T>) => void;
    resetValues: () => void;
    setOpen: (open: boolean) => void;
    getOpen: () => boolean | undefined;
    getValues: () => ResolvedValues<T>;
}
declare function useDialKit<T extends DialConfig>(name: string, config: T, options?: UseDialOptions): ResolvedValues<T>;
declare function useDialKitController<T extends DialConfig>(name: string, config: T, options?: UseDialOptions): DialKitController<T>;

/** Which panels a DialRoot draws: those without a group, those in the listed groups, or both. */
type PanelRootFilter = {
    groups?: string[];
    ungrouped?: boolean;
};

/** How a panel shows its versions: captured thumbnails (default), or a menu. */
type DialVersions = 'menu' | 'thumbnails';
interface VersionGalleryProps {
    panelId: string;
    theme?: 'light' | 'dark' | 'system';
}

type DialPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type DialMode = 'popover' | 'inline';
type DialTheme = 'light' | 'dark' | 'system';
interface DialRootProps {
    position?: DialPosition;
    defaultOpen?: boolean;
    mode?: DialMode;
    theme?: DialTheme;
    productionEnabled?: boolean;
    /** How saved versions appear: captured thumbnails (default), or a menu. */
    versions?: DialVersions;
    accordion?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Draws only some panels, so several roots can share one store:
     * `{ ungrouped: true }` the panels without a `group`, `{ groups: ['X'] }`
     * the panels in the listed groups, or both. Without it, every panel.
     */
    include?: PanelRootFilter;
}
declare function DialRoot({ position, defaultOpen, mode, theme, productionEnabled, versions, accordion, onOpenChange, include }: DialRootProps): react_jsx_runtime.JSX.Element | null;

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
type Listener$2 = () => void;
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
    subscribe(id: string, listener: Listener$2): () => void;
    subscribeGlobal(listener: Listener$2): () => void;
    private applyMeta;
    private ensureLoop;
    private tick;
    private notify;
    private notifyGlobal;
}
declare const TimelineStore: TimelineStoreClass;

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
declare function formatClock(time: number, tenths?: boolean): string;

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

type UseDialTimelineOptions = DialTimelineOptions;
declare function useDialTimeline<T extends TimelineConfig>(name: string, config: T, options?: UseDialTimelineOptions): DialTimelineValues<T>;

interface DialTimelineProps {
    theme?: DialTheme;
    /** Initial dock visibility. Expansion is controlled separately by defaultOpen. */
    defaultVisible?: boolean;
    /** Controlled dock visibility. */
    visible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
    defaultOpen?: boolean;
    productionEnabled?: boolean;
    /** Draws an Export button in the timeline bar; the host decides what
     * exporting means. */
    onExport?: () => void;
}
declare const DialTimeline: react.NamedExoticComponent<DialTimelineProps>;

interface ControlRendererProps {
    panelId: string;
    controls: ControlMeta[];
    values: Record<string, DialValue>;
    /** Optional timeline-owned duration rendered inside the transition editor. */
    transitionDuration?: {
        value: number;
        onChange: (value: number) => void;
        min?: number;
        max?: number;
        step?: number;
        /** Replaces the curve's own Duration hint. */
        hint?: string;
    };
    /** Longest settle a physics spring may reach. See TransitionControl. */
    physicsSettleCap?: number;
    /** Path of the one open top-level folder in accordion mode, or null when all are closed. */
    openFolder?: string | null;
    onOpenFolderChange?: (path: string | null) => void;
    /** Slide controls in and out as their visibility rules change. */
    animateControls?: boolean;
}
declare function ControlRenderer({ panelId, controls, values, transitionDuration, physicsSettleCap, openFolder, onOpenFolderChange, animateControls }: ControlRendererProps): react_jsx_runtime.JSX.Element;

interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /** Shows this text in place of the number and `unit`. Typing a value still edits the number. */
    formatValue?: (value: number) => string;
    /**
     * Fills from this value instead of from `min`, toward either side of it.
     * While dragging, the value catches at the origin for a few pixels.
     */
    origin?: number;
    /** The same as `origin={0}`. */
    bipolar?: boolean;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
    hint?: string;
}
declare function Slider({ label, value, onChange, min, max, step, unit, formatValue, origin, bipolar, shortcut, shortcutActive, hint, }: SliderProps): react_jsx_runtime.JSX.Element;

interface RangeSliderProps {
    label: string;
    value: RangeValue;
    onChange: (value: RangeValue) => void;
    /** Start of the track. */
    min?: number;
    /** End of the track. */
    max?: number;
    step?: number;
    /** What a double-click on the track restores. Defaults to the full track. */
    defaultValue?: RangeValue;
    hint?: string;
}
/**
 * Two handles on one track. Drag a handle to move one end, drag inside the
 * span to move both, or click the empty track to bring the nearer end there.
 * Shift while dragging moves at a tenth of the speed. Rest the pointer on
 * the numbers and a click on either one types it, as on a slider; a
 * double-click on the track restores the default.
 */
declare function RangeSlider({ label, value: rawValue, onChange, min, max, step, defaultValue, hint, }: RangeSliderProps): react_jsx_runtime.JSX.Element;

interface NumberControlProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    /** Optional: unlike a slider's, a number's bounds may be left open. */
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /** Replaces the shown value; `unit` is then not added. */
    formatValue?: (value: number) => string;
    /** `vertical` puts the label above a centred value. */
    orientation?: 'horizontal' | 'vertical';
    hint?: string;
}
/**
 * A number with no track. Drag anywhere on the row to scrub it, a step per
 * pixel (Shift ten, Alt a tenth); click it to type. ⌘ while pressing selects
 * the text instead.
 */
declare function NumberControl({ label, value, onChange, min, max, step, unit, formatValue, orientation, hint, }: NumberControlProps): react_jsx_runtime.JSX.Element;

interface AngleDialProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /** Replaces the shown value; `unit` is then not added. */
    formatValue?: (value: number) => string;
    /** The value the sweep grows from, and the double-click reset. Defaults to `min`. */
    origin?: number;
    /** Past an end, come back around. Defaults to true for a full turn. */
    wrap?: boolean;
    hint?: string;
}
/**
 * A slider drawn as a rotary needle, for values whose two ends are the same
 * place: a heading, a hue, a tilt. The needle follows the pointer like a
 * compass, and on a wrapping range a drag past the top keeps turning. A drag
 * elsewhere on the row scrubs it like a slider.
 * Arrows step (Shift ten), and Home or a double-click returns to the origin.
 */
declare function AngleDial({ label, value, onChange, min, max, step, unit, formatValue, origin, wrap, hint, }: AngleDialProps): react_jsx_runtime.JSX.Element;

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
    hint?: string;
}
declare function Toggle({ label, checked, onChange, shortcut, shortcutActive, hint }: ToggleProps): react_jsx_runtime.JSX.Element;

interface FolderProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    isRoot?: boolean;
    inline?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    toolbar?: ReactNode;
    /** Short text at the end of a nested folder's title row, such as the preset in use. */
    meta?: string;
    /** Buttons beside the title of a nested folder, such as a transition's copy and paste. */
    actions?: ReactNode;
    panelHeightOffset?: number;
    /** Shows a reset button after the title, visible while `changed` is true. */
    onReset?: () => void;
    changed?: boolean;
    hint?: string;
    /** On a panel's own header: the X calls this instead of closing the panel to a small button. */
    onClose?: () => void;
}
declare function Folder({ title, children, open, defaultOpen, isRoot, inline, onOpenChange, toolbar, meta, actions, panelHeightOffset, onReset, changed, hint, onClose }: FolderProps): react_jsx_runtime.JSX.Element;

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
    /** Shows a reset button in the header. See Folder.onReset. */
    onReset?: () => void;
    changed?: boolean;
    hint?: string;
}
declare function SpringControl({ panelId, path, label, spring, onChange, onReset, changed, hint }: SpringControlProps): react_jsx_runtime.JSX.Element;

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
        /** Replaces the curve's own Duration hint. */
        hint?: string;
    };
    /**
     * Longest settle (seconds) the physics values may give the spring. Each
     * physics slider stops where the settle time meets it, worked out from
     * the other two values as they are, so moving one moves where the others
     * stop. A timeline clip passes the room before the next clip.
     */
    physicsSettleCap?: number;
    /** Shows a reset button in the header. See Folder.onReset. */
    onReset?: () => void;
    changed?: boolean;
    hint?: string;
    /**
     * Draw the editor without its own folder, for a section whose only row is
     * this transition: the section's header carries the reset and the copy menu.
     */
    bare?: boolean;
}
declare function TransitionControl({ panelId, path, label, value, onChange, hideDuration, durationControl, physicsSettleCap, onReset, changed, hint, bare, }: TransitionControlProps): react_jsx_runtime.JSX.Element;

interface TransitionCopyMenuProps {
    panelId: string;
    /** The transition's path in the panel. */
    path: string;
    value: TransitionConfig;
}
/**
 * A transition's copy and paste buttons, for a header the host draws itself,
 * such as a section whose only row is that transition. Copy keeps the value
 * and its tab (Easing, Time or Physics); paste writes both into the panel.
 */
declare function TransitionCopyMenu({ panelId, path, value }: TransitionCopyMenuProps): react_jsx_runtime.JSX.Element;

/** One row of a section: a control and the panel whose value it changes. */
interface SectionRow {
    panelId: string;
    control: ControlMeta;
}
interface SectionProps {
    /** The rows to draw, in order. They may come from several folders or panels. */
    rows: SectionRow[];
    title: string;
    hint?: string;
    defaultOpen?: boolean;
    /** Controls the open state, as on a folder. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Shows a reset button in the header, visible while `changed` is true. A
     * section whose only row is a transition has the transition's own reset
     * when this is not given.
     */
    onReset?: () => void;
    changed?: boolean;
    /** Buttons beside the title. */
    actions?: ReactNode;
    /** Slide rows in and out as they come and go. */
    animateControls?: boolean;
    /** Drawn after the rows, such as a note for a section with none. */
    children?: ReactNode;
}
/**
 * A folder of rows the host picks, possibly from several panels, drawn with
 * the rules of a panel's own folders: a section whose only row is a
 * transition shows one header, with the transition's reset and copy menu in
 * it. Each row keeps its panel, so it changes the same value wherever it
 * shows. The markup is a folder's: `.dialkit-folder > .dialkit-folder-content
 * > .dialkit-folder-inner`, with the rows inside.
 */
declare function Section({ rows, title, hint, defaultOpen, open, onOpenChange, onReset, changed, actions, animateControls, children, }: SectionProps): react_jsx_runtime.JSX.Element;

interface EasingVisualizationProps {
    easing: EasingConfig;
    /** Enables pointer and keyboard editing of the two control points. */
    onChange?: (ease: BezierPoints) => void;
}

declare function EasingVisualization(props: EasingVisualizationProps): react_jsx_runtime.JSX.Element;

interface TextControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    hint?: string;
}
declare function TextControl({ label, value, onChange, placeholder, hint }: TextControlProps): react_jsx_runtime.JSX.Element;

interface SelectControlProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    display?: SelectConfig['display'];
    hideLabel?: boolean;
    hint?: string;
    /** Dropdown only: the first row of the dropdown, which adds an option. See `SelectConfig.add`. */
    add?: {
        label: string;
        hint?: string;
        onClick: () => void;
    };
    /** Dropdown only: drawn before an option's label, in the trigger and in each row (a swatch's colors). */
    preview?: (value: string) => ReactNode;
}
declare function SelectControl(props: SelectControlProps): react_jsx_runtime.JSX.Element;

type ColorControlProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    hint?: string;
};

declare function ColorControl(props: ColorControlProps): react_jsx_runtime.JSX.Element;

type ImageControlProps = {
    label: string;
    value: string;
    options?: ImageOption[];
    onChange: (value: string) => void;
    hint?: string;
    /** `false` drops the upload button, for a fixed set of images (a gallery). Default `true`. */
    upload?: boolean;
    /** `false` drops the Remove button, so an image is always chosen. Default `true`. */
    clearable?: boolean;
};

declare function ImageControl(props: ImageControlProps): react_jsx_runtime.JSX.Element;

type DialPadProps = Omit<DialPadConfig, 'type'> & {
    label: string;
    value: DialPadValue;
    onChange: (value: DialPadValue) => void;
    hint?: string;
};

declare function DialPad(props: DialPadProps): react_jsx_runtime.JSX.Element;

type AnchorControlProps = {
    label: string;
    /** `null`: no cell is picked, and a click on any cell picks it. */
    value: AnchorValue | null;
    onChange: (value: AnchorValue) => void;
    /** A short sentence shown while H is held over the control. */
    hint?: string;
};

declare function AnchorControl(props: AnchorControlProps): react_jsx_runtime.JSX.Element;

type BackgroundControlProps = {
    /** Saved gradients belong to this panel, unless a background host is set (`setBackgroundHost`). */
    panelId: string;
    label: string;
    value: BackgroundValue;
    /**
     * Stores a dropped or picked file and returns its URL. Without it, the
     * background host's `upload` stores it; with no host set, files up to
     * 10 MB are read as data URLs.
     */
    upload?: (file: File) => Promise<string>;
    onChange: (value: BackgroundValue) => void;
};

declare function BackgroundControl(props: BackgroundControlProps): react_jsx_runtime.JSX.Element;

type LayerListControlProps = {
    label: string;
    value: LayersValue;
    onChange: (value: LayersValue) => void;
    /** Add, duplicate and delete: the app creates or removes the layer, then writes the new value. */
    onAction: (kind: LayerActionKind, id?: string) => void;
    addLabel?: string;
    addDisabled?: boolean;
    empty?: string;
    /** A short sentence about the list, shown while the hint key is held. Its parts have their own. */
    hint?: string;
};

/** The layer list: an add button, then rows with an eye, duplicate and delete. */
declare function LayerListControl(props: LayerListControlProps): react_jsx_runtime.JSX.Element;

interface FilterControlProps {
    panelId: string;
    control: ControlMeta;
    value: DialFilterValue | undefined;
    onChange: (value: DialFilterValue) => void;
}
/** The response the two hands make, with a slider for each hand under it. */
declare function FilterControl({ panelId, control, value, onChange }: FilterControlProps): react_jsx_runtime.JSX.Element;

interface TransferCurveProps extends Omit<DialTransferConfig, 'type' | 'default'> {
    label: string;
    value: DialTransferValue;
    onChange: (value: DialTransferValue) => void;
    hint?: string;
}
/**
 * A curve you draw instead of numbers you guess. Drag a point; click the
 * plot to add one; drag a point out of the plot, or press Delete, to remove
 * it; double-click to straighten the curve. Arrow keys move a focused point.
 */
declare function TransferCurve({ label, value, onChange, height, grid, axisLabels, hint }: TransferCurveProps): react_jsx_runtime.JSX.Element;

interface CurvePreviewProps {
    panelId: string;
    control: ControlMeta;
}
/** The read-only `{ type: 'curve' }` row: the app's sampler, drawn. */
declare function CurvePreview({ panelId, control }: CurvePreviewProps): react_jsx_runtime.JSX.Element;

interface AnalyserRowProps {
    panelId: string;
    control: ControlMeta;
}
/**
 * The read-only `{ type: 'analyser' }` row: a live spectrum or oscilloscope.
 * The canvas needs a pixel width, so the row measures itself.
 */
declare function AnalyserRow({ panelId, control }: AnalyserRowProps): react_jsx_runtime.JSX.Element;

interface ChipsControlProps {
    label: string;
    value: string;
    options: ChipOption[];
    onChange: (value: string) => void;
    /** A removable chip's remove: the app takes the chip out of its options. */
    onRemove: (value: string) => void;
    hint?: string;
}
/**
 * One of a set of chips that wrap onto more lines. The chips are one tab stop:
 * arrows move and pick, like a segmented control. A removable chip has a remove
 * button, and Delete or Backspace removes the focused chip.
 */
declare function ChipsControl({ label, value, options, onChange, onRemove, hint }: ChipsControlProps): react_jsx_runtime.JSX.Element;

interface MultiSelectControlProps {
    label: string;
    value: string[];
    options: MultiSelectOption[];
    onChange: (value: string[]) => void;
    hint?: string;
}
/** Checkbox rows. The value is the checked values in option order, not click order. */
declare function MultiSelectControl({ label, value, options, onChange, hint }: MultiSelectControlProps): react_jsx_runtime.JSX.Element;

interface SwatchControlProps {
    label: string;
    value: string;
    options: SwatchOption[];
    onChange: (value: string) => void;
    hint?: string;
}
/** A select dropdown of named palettes: each row and the trigger show the palette's colors before its name. */
declare function SwatchControl({ label, value, options, onChange, hint }: SwatchControlProps): react_jsx_runtime.JSX.Element;

interface FileControlProps {
    label: string;
    /** The picked file's name, or '' when none is picked. */
    value: string;
    accept?: string;
    multiple?: boolean;
    onChange: (value: string) => void;
    /** The picked files. They are not stored: only their name is the value. */
    onPick: (files: FileList) => void;
    hint?: string;
}
/** A row that opens the file picker, shows the picked file's name, and clears it. */
declare function FileControl({ label, value, accept, multiple, onChange, onPick, hint }: FileControlProps): react_jsx_runtime.JSX.Element;

interface ListControlProps {
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    /** What changed, for apps that apply list changes one at a time. Sent after each `onChange`. */
    onEvent: (event: Extract<DialEvent, {
        kind: 'list';
    }>) => void;
    hint?: string;
}
/**
 * Rows the user adds, renames, drags into order and removes. Each row is one
 * of the item types and shows that type's fields; fields in a section show
 * in a folder under the row's own fields, the first section open.
 */
declare function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent, hint }: ListControlProps): react_jsx_runtime.JSX.Element;

/**
 * Draws a background value into a canvas at the canvas's own size: the solid
 * color, or the gradient exactly, every shape (`paintGradient`). For a host
 * that previews the background without drawing it itself. Media is not
 * drawn; the canvas is cleared and the host shows its own.
 */
declare function paintBackgroundPreview(canvas: HTMLCanvasElement, value: BackgroundValue): void;

/**
 * The on-canvas gradient gizmo, as in Figma: handle dots that move, scale and
 * rotate the gradient, the stops as swatches on its line (or around its rim
 * for Angular) that slide along it, and a click on the line that adds a stop.
 * The maths below is pure (no DOM) so it is tested on its own; the gizmo
 * itself is plain DOM, mounted over the host's canvas.
 */
/** The canvas box in CSS pixels. */
interface GizmoBox {
    width: number;
    height: number;
}
interface Vec {
    x: number;
    y: number;
}
/** The three handles as drawn, in pixels. The width handle is shown on the cross axis, at its radius. */
declare function gizmoPoints(handles: GradientHandles, box: GizmoBox): {
    start: Vec;
    end: Vec;
    width: Vec;
};
/**
 * Turns the end and width handles around `start` by `radians` (positive is
 * clockwise on screen). Lengths and the ellipse's shape do not change.
 */
declare function rotateGradientHandles(handles: GradientHandles, radians: number, box: GizmoBox): GradientHandles;
/**
 * The end handle follows the pointer; the centre stays. The main radius and
 * the direction change together, and the cross radius scales with the main
 * one, so the ellipse keeps its shape. The end stays at least 1px from the
 * centre: on the centre both radii would be 0, the shape's ratio would be
 * lost, and the next move would rebuild it as a circle.
 */
declare function dragGradientEnd(handles: GradientHandles, pointer: Vec, box: GizmoBox): GradientHandles;
/** The centre (start) follows the pointer; the end handle stays, and the ellipse keeps its shape. */
declare function dragGradientCentre(handles: GradientHandles, pointer: Vec, box: GizmoBox): GradientHandles;
/**
 * The width handle sets the cross radius only: the pointer's distance from
 * the main axis. Crossing the axis moves the handle to the other side.
 */
declare function dragGradientWidth(handles: GradientHandles, pointer: Vec, box: GizmoBox): GradientHandles;
/**
 * The stop position (0..100) under a pointer: its projection on the line from
 * the centre to the end handle, or for Angular its angle around the centre
 * from the end handle's direction.
 */
declare function stopPositionAt(shape: GradientShape, handles: GradientHandles, pointer: Vec, box: GizmoBox): number;
/**
 * Where a stop's swatch goes. `x, y` is the stop's point on the line (or on
 * the ellipse's rim for Angular); `ox, oy` the unit direction the swatch
 * stands off in (one side of the line, or outward from the rim); `rotation`
 * turns the swatch so its pointer points back at the line.
 */
declare function stopPlacement(shape: GradientShape, handles: GradientHandles, at: number, box: GizmoBox): {
    x: number;
    y: number;
    ox: number;
    oy: number;
    rotation: number;
};
/**
 * The angle the tooltip shows: the main axis's direction (centre to end
 * handle), in whole degrees, 0 when it points down, -90 right, 90 left,
 * 180 up, as Figma shows it. Any handle's rotate ring shows this same value.
 */
declare function gizmoAngle(handles: GradientHandles, box: GizmoBox): number;
declare const formatGizmoAngle: (degrees: number) => string;
interface GradientGizmoProps {
    gradient: BackgroundGradient;
    /** The selected stop's index. */
    selected: number;
    /**
     * The panel's DialKit root: the gizmo copies its `--dial-*` tokens, so it
     * draws with the panel's theme. The gizmo is not a `.dialkit-root` itself:
     * hosts style those as panels (a host may make every `.dialkit-root` a fixed,
     * full-screen layer whose children take the pointer), and the gizmo must
     * take presses only on its own parts.
     */
    themeSource?: HTMLElement | null;
    /** Its stacking order: under the DialKit panel, above the host's canvas. */
    zIndex?: number;
}
interface GradientGizmoCallbacks {
    onHandles: (handles: GradientHandles) => void;
    onSelect: (index: number) => void;
    /** Moves the selected stop (it is selected while it is dragged). */
    onStopMove: (index: number, at: number) => void;
    /** Adds a stop at `at`; the new stop becomes the selected one. */
    onStopAdd: (at: number) => void;
}
/**
 * Mounts the gizmo over `target`: a fixed overlay sized to the target's box,
 * in document.body, above the host's canvas and under the DialKit panel.
 * Presses on the gizmo stop there, so a colour picker open in the panel stays
 * open; everything else passes through to the canvas.
 */
declare function mountGradientGizmo(target: HTMLElement, initial: GradientGizmoProps, callbacks: GradientGizmoCallbacks): {
    element: HTMLDivElement;
    update(next: GradientGizmoProps): void;
    destroy(): void;
};

/**
 * What a host gives every background control: where uploads go, how a
 * stored file is shown, where saved gradients live, and the canvas the
 * gradient gizmo draws over.
 *
 * Once a host sets any of these, it owns the media and the saved gradients:
 * - Uploads go to a control's own `upload`, else to the host's. With
 *   neither, the Media tab says uploads are not available here; files are
 *   never read into data URLs.
 * - Saved gradients are only the list given to `setSavedGradients`. The
 *   control saves and deletes through `saveGradient` and `deleteGradient`,
 *   and hides each button the host leaves out. Nothing is kept in the panel
 *   or in browser storage.
 * Without a host (or after `setBackgroundHost({})`), a control keeps its
 * saved gradients in its panel and reads files up to 10 MB as data URLs.
 */
type BackgroundHost = {
    /** Stores a dropped or picked file and returns the media to keep: its `src` (a URL, or the host's own storage key) and kind. */
    upload?: (file: File) => Promise<BackgroundMedia>;
    /** The URL that shows a media in the control's preview, for a host that keeps a storage key in `src`. Without it, `src` is the URL. */
    mediaUrl?: (media: BackgroundMedia) => string;
    /** Saves a gradient and returns it with its id. Without it, the Save gradient button is hidden. */
    saveGradient?: (gradient: BackgroundGradient) => Promise<SavedGradient>;
    /** Deletes a saved gradient. Without it, saved gradients show no delete button. */
    deleteGradient?: (id: string) => Promise<void>;
    /**
     * The element the gradient gizmo draws over, usually the host's canvas.
     * The gradient's handles are fractions of its box. Opening a stop's color
     * picker shows the gizmo; without a target there is none.
     */
    gizmoTarget?: () => HTMLElement | null;
};
type Listener$1 = () => void;
/** Sets the host's hooks, replacing the previous host. `setBackgroundHost({})` removes it. */
declare function setBackgroundHost(host: BackgroundHost): void;
declare function getBackgroundHost(): BackgroundHost;
/** Whether a host is set: any of its hooks is given. */
declare function hasBackgroundHost(): boolean;
/** Sets the saved gradients every background control shows while a host is set. Each is made valid. */
declare function setSavedGradients(list: readonly SavedGradient[]): void;
declare function getSavedGradients(): SavedGradient[];
/** Calls `listener` when the host or the saved gradients change. Returns the unsubscribe. */
declare function subscribeBackgroundHost(listener: Listener$1): () => void;

interface PresetManagerProps {
    panelId: string;
    presets: Preset[];
    activePresetId: string | null;
    onAdd?: () => void;
    /** What a version is called in the menu: a version (default) or, in a timeline, a sequence. */
    noun?: 'version' | 'sequence';
}
declare function PresetManager({ panelId, presets, activePresetId, onAdd, noun }: PresetManagerProps): react_jsx_runtime.JSX.Element;

/** Mounts the shared version gallery (see versions/gallery.ts). */
declare function VersionGallery(props: VersionGalleryProps): react_jsx_runtime.JSX.Element;

interface ShortcutsMenuProps {
    panelId: string;
}
declare function ShortcutsMenu({ panelId }: ShortcutsMenuProps): react_jsx_runtime.JSX.Element | null;

interface SegmentedControlOption<T extends string> {
    value: T;
    label: string;
    /** SVG path data in a 24 × 24 box, shown in place of the label. */
    icon?: string | string[];
    /** The icon's box: 24 (the default) or 16, drawn with a 1.5 stroke. */
    iconSize?: 16 | 24;
}
interface SegmentedControlProps<T extends string> {
    options: SegmentedControlOption<T>[];
    value: T;
    onChange: (value: T) => void;
    /** Accessible name for the group. */
    label?: string;
}
declare function SegmentedControl<T extends string>({ options, value, onChange, label, }: SegmentedControlProps<T>): react_jsx_runtime.JSX.Element;

interface ModuleProps {
    title: string;
    /** Whether the module is on. The Off/On switch is the expand control:
     *  off collapses the body away, on reveals it. */
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    /** One line of help, shown while H is held over the header. */
    hint?: string;
    children?: ReactNode;
}
interface ModuleFolderProps extends ModuleProps {
    /** Whether the body starts open while the module is on. */
    defaultOpen?: boolean;
}
/**
 * A titled block of controls that turns on and off as a unit (a synth layer,
 * an effect send, an optional feature). The header's Off/On switch is also
 * the expand control: off folds the body away.
 */
declare function Module({ title, enabled, onEnabledChange, hint, children }: ModuleProps): react_jsx_runtime.JSX.Element;
/**
 * A Module whose header also folds the body while the module is on, like a
 * folder. Turning the module on always opens the body.
 */
declare function ModuleFolder({ title, enabled, onEnabledChange, defaultOpen, hint, children }: ModuleFolderProps): react_jsx_runtime.JSX.Element;

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
     * Sweeps linear (−1) ← canonical preset (0) → the explosive extreme (+1, expo-grade: the
     * eased side's far control point drops to the floor). So steepness is the continuous power
     * ladder (gentle → quad → … → expo), with circ reachable mid-range. Spring maps it to stiffness.
     */
    steepness: number;
    /**
     * 0..1 overshoot — pushes the curve above 1 at the END before settling (easeOutBack),
     * 0 = none. Independent of `anticipate`; set both for easeInOutBack. Beyond ~1 is
     * elastic/bounce — use spring. Optional; treated as 0 when absent. No-op for spring.
     */
    overshoot?: number;
    /**
     * 0..1 anticipation — dips the curve below 0 at the START before launching (easeInBack),
     * 0 = none. Independent of `overshoot`. Optional; treated as 0 when absent. No-op for spring.
     */
    anticipate?: number;
    /**
     * Mirror the curve in TIME (t → 1−t): the shape plays back to front, so a slow start
     * becomes a slow finish. Optional; false when absent.
     *
     * This is an orientation applied on top of the shape, not another preset, which is why it
     * works for every type. `easeInOut` and `spring` have no parameter that can express a
     * mirror — swapping the preset only ever gets you easeIn↔easeOut — so without this they
     * cannot be flipped at all.
     */
    flipX?: boolean;
    /**
     * Mirror the curve in VALUE (v → 1−v): the segment falls from its ceiling to its floor
     * instead of rising. Optional; false when absent.
     *
     * Set both flips together and the two mirrors cancel back to a rising curve — that
     * combination is the classic easing reverse, and is what {@link flipSegment} applies.
     */
    flipY?: boolean;
}
/** The stacked driver curve (a single curve, no internal splits). */
interface CurveDriver {
    type: CurveType;
    /** Bipolar -1..1 energy bias — see CurveSegment.curvature. */
    curvature: number;
    /** Bipolar -1..1 steepness — see CurveSegment.steepness. */
    steepness: number;
    /** 0..1 overshoot — see CurveSegment.overshoot. */
    overshoot?: number;
    /** 0..1 anticipation — see CurveSegment.anticipate. */
    anticipate?: number;
    /** Mirror in time — see CurveSegment.flipX. */
    flipX?: boolean;
    /** Mirror in value — see CurveSegment.flipY. */
    flipY?: boolean;
}
type DriverDirection = 'forward' | 'mirror' | 'reverse';
interface CurveComposition {
    segments: CurveSegment[];
    /** null → no driver lane (the component renders a single lane). */
    driver: CurveDriver | null;
    direction: DriverDirection;
    /**
     * 0..1 — fraction of the timeline given to gaps between segments (distributed equally,
     * one gap after each segment, the last wrapping to the first). In a gap the value glides
     * smoothly from the segment's end down to the next segment's start (a faint connector)
     * instead of snapping. 0 = contiguous (default). Optional.
     */
    gap?: number;
}
/** A pure `(t) -> value` sampler over local time, both in 0..1 (value may overshoot for springs). */
type Sampler = (t: number) => number;
/**
 * Physics used only by {@link springify}'s one-second driven follower.
 * This is deliberately distinct from timeline `SpringConfig`, whose defaults describe
 * a transition settling toward a fixed endpoint rather than tracking a moving signal.
 */
interface SpringifyOptions {
    /** Spring stiffness, constrained to 1..1000. Default 100. */
    stiffness?: number;
    /** Damping coefficient, constrained to 0..100. Default 10. */
    damping?: number;
    /** Attached mass, constrained to 0.1..10. Default 1. */
    mass?: number;
    /**
     * If the follower escapes 0..1, affinely fit its complete trace back into that range.
     * Unlike clipping, this preserves the shape and relative size of every bounce. Default false.
     */
    normalize?: boolean;
    /**
     * Solve for a periodic steady state so position and velocity join seamlessly at t=0/1.
     * Enable this when the source sampler repeats. Default false.
     */
    loop?: boolean;
}
/**
 * Attach a damped follower to any designed curve.
 *
 * The source value is the spring's moving target: at every step a second value is pulled
 * toward it by stiffness, retains momentum through mass, and loses energy through damping.
 * The trace is baked once so the returned sampler stays deterministic and scrubbable.
 *
 * Set `normalize` to fit an over-bouncing trace into 0..1. This is an affine rescale of
 * the complete trace, not a clamp, so every peak and damped return remains visible.
 */
declare function springify(sample: Sampler, options?: SpringifyOptions): Sampler;
/**
 * Insert a copy of the segment at `index` after it, then re-divide ALL segments to
 * equal duration — split always yields evenly-spaced clips.
 */
declare function splitSegment(comp: CurveComposition, index: number): CurveComposition;
/** Remove the segment at `index` (no-op when it's the only one). */
declare function removeSegment(comp: CurveComposition, index: number): CurveComposition;
declare function cycleSegmentType(comp: CurveComposition, index: number): CurveComposition;
declare function flipSegment(comp: CurveComposition, index: number): CurveComposition;
declare function flipDriver(comp: CurveComposition): CurveComposition;
/**
 * Mirror a curve in time — the shape plays back to front.
 *
 * Unlike {@link flipSegment}, which rewrites the preset and so can only ever turn easeIn
 * into easeOut, this is an orientation laid over whatever shape is there. It therefore does
 * something visible for every type, including `easeInOut` and `spring`, which have no
 * preset to swap to.
 */
declare function flipSegmentX(comp: CurveComposition, index: number): CurveComposition;
/** Mirror a curve in value — the segment falls from its ceiling instead of rising. */
declare function flipSegmentY(comp: CurveComposition, index: number): CurveComposition;
declare function flipDriverX(comp: CurveComposition): CurveComposition;
declare function flipDriverY(comp: CurveComposition): CurveComposition;
declare function setSegmentCurvature(comp: CurveComposition, index: number, curvature: number): CurveComposition;
declare function setSegmentSteepness(comp: CurveComposition, index: number, steepness: number): CurveComposition;
declare function setSegmentOvershoot(comp: CurveComposition, index: number, overshoot: number): CurveComposition;
declare function setSegmentAnticipate(comp: CurveComposition, index: number, anticipate: number): CurveComposition;
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
declare function setDriverOvershoot(comp: CurveComposition, overshoot: number): CurveComposition;
declare function setDriverAnticipate(comp: CurveComposition, anticipate: number): CurveComposition;
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
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex?: number | null;
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect?: (index: number) => void;
    /** Curve stroke color. Defaults to the theme's primary text color. */
    curveColor?: string;
    /** Playhead and value dot color. Defaults to the curve color. */
    playheadColor?: string;
    /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
    gap?: number;
    /** Faint vertical reference grid behind each lane. */
    grid?: boolean;
    gridSubdivisions?: number;
    width?: number;
    /** Height of the main lane; the driver lane adds height below it. */
    height?: number;
    /** One line of help, shown while H is held over the composer. */
    hint?: string;
}
declare function CurveComposer({ segments, driver, direction, onSegmentsChange, onDriverChange, getPhase, phase, mode, triggerSteps, onTrigger, selectedIndex, onSelect, gap, curveColor, playheadColor, grid, gridSubdivisions, width, height, hint, }: CurveComposerProps): react_jsx_runtime.JSX.Element;

type Listener = () => void;
/** How HintStore's `show` and `hide` reach the mounted hint listeners. */
type HintDisplay = {
    show(element: HTMLElement, text: string): void;
    hide(element?: HTMLElement): void;
};
/**
 * Whether this browser has seen a hint yet, shared by every panel. Until
 * then, every panel ends with a tip that points to the hint key.
 */
declare class HintStoreClass {
    private tipSeen;
    private key;
    private listeners;
    /** The mounted hint listeners' own show and hide, while they run. */
    private display;
    /** Keeps the listeners mounted while a host's hint shows. */
    private hostHint;
    /**
     * Shows `text` above `element` without the hint key, as a host does after
     * the pointer rests on an element for a moment (500ms in theca). The
     * element must sit inside a `.dialkit-root`. The hint stays until
     * `hide(element)`, a held key shows another, or the pointer leaves the
     * window.
     */
    show(text: string, element: HTMLElement): void;
    /** Hides the hint, if `element` is the one it shows for, or any hint without one. */
    hide(element?: HTMLElement): void;
    /** Called by the mounted listeners: how `show` and `hide` reach them. */
    attachDisplay(display: HintDisplay): () => void;
    /** The key held to show hints, H by default. */
    getKey(): string;
    /** Changes the key held to show hints, for a page that uses H itself. */
    setKey(key: string): void;
    /** True once a hint has shown in this browser, and on the server. */
    isTipSeen(): boolean;
    /** Called when the key is released after a hint: the tip has done its job. */
    markTipSeen(): void;
    subscribe(listener: Listener): () => void;
    private notify;
}
declare const HintStore: HintStoreClass;

/**
 * Tells a first-time user what the hint key does: the line at the end of
 * every open panel, until a hint has shown once in that browser. A server
 * render shows nothing. `always` shows it whatever the user did, for a
 * specimen of the line.
 */
declare function HintTip({ always }: {
    always?: boolean;
}): react_jsx_runtime.JSX.Element | null;
/**
 * Shows hints in a host's own layout: while it is mounted, holding the hint
 * key over any element with a `data-hint` inside a `.dialkit-root` shows that
 * hint, even where no DialKit control with a hint is drawn. Mark a box the
 * hint should dim with `data-hint-area`. It draws nothing itself.
 */
declare function HintTooltip(): null;

export { type ActionConfig, AnalyserRow, type AnalyserScale, type AnalyserSpring, type AnchorConfig, AnchorControl, type AnchorControlProps, type AnchorValue, AngleDial, type BackgroundConfig, BackgroundControl, type BackgroundControlProps, type BackgroundGradient, type BackgroundHost, type BackgroundMedia, type BackgroundMediaDisplay, type BackgroundMediaFit, type BackgroundMediaRatio, type BackgroundMode, type BackgroundValue, type BackgroundValueUpdate, ButtonGroup, CURVE_CYCLE, type ChipOption, type ChipsConfig, ChipsControl, type ColorConfig, ColorControl, type CompositionRead, type CompositionSamplers, type ControlMeta, ControlRenderer, type ControlWithVisibility, type CopiedTransition, CurveComposer, type CurveComposerProps, type CurveComposition, type CurveDriver, CurvePreview, type CurveSegment, type CurveType, DEFAULT_TRIGGER_STEPS, type DialAnalyserConfig, type DialConfig, type DialCurveConfig, type DialEvent, type DialFilterAxisConfig, type DialFilterConfig, type DialFilterValue, type DialKitController, type DialKitPersistOptions, type DialKitValueUpdates, type DialMode, DialPad, type DialPadAxis, type DialPadConfig, type DialPadProps, type DialPadValue, type DialPosition, DialRoot, DialStore, type DialTheme, DialTimeline, type DialTimelineProps, type DialTimelineValues, type DialTransferConfig, type DialTransferValue, type DialValue, type DialVersions, type DialXYAxis, type DialXYConfig, type DriverDirection, type EasingConfig, EasingVisualization, type FieldsConfig, type FileConfig, FileControl, FilterControl, type FilterShapeType, Folder, type FolderMode, GRADIENT_SHAPES, type GalleryConfig, type GalleryItem, type GizmoBox, type GradientFrame, type GradientGizmoCallbacks, type GradientGizmoProps, type GradientHandles, type GradientPoint, type GradientShape, type GradientStop, HintStore, HintTip, HintTooltip, type ImageConfig, ImageControl, type ImageOption, type InlineLabelsConfig, type LayerActionKind, type LayerItem, LayerListControl, type LayerListControlProps, type LayersConfig, type LayersValue, type ListConfig, ListControl, type ListField, type ListFieldKind, type ListItemField, type ListItemType, type ListItemValue, Module, ModuleFolder, type MultiSelectConfig, MultiSelectControl, type MultiSelectOption, type NumberConfig, NumberControl, type PadGroupConfig, type PanelConfig, type Preset, PresetManager, type RangeConfig, RangeSlider, type RangeSliderConfig, type RangeValue, type ResolvedValues, type RowConfig, type Sampler, type SavedGradient, Section, type SectionProps, type SectionRow, SegmentedControl, type SelectAddConfig, type SelectConfig, SelectControl, type SelectOption, type ShortcutConfig, type ShortcutInteraction, type ShortcutMode, ShortcutsMenu, Slider, type SliderConfig, type SpringConfig, SpringControl, SpringVisualization, type SpringifyOptions, type SwatchConfig, SwatchControl, type SwatchOption, type TextConfig, TextControl, type TimelineClipConfig, type TimelineClipCss, type TimelineClipLoop, type TimelineClipMeta, type TimelineClipTrackMeta, type TimelineClipValues, type TimelineConfig, type TimelineGroupConfig, type TimelineGroupValues, type TimelineMeta, type TimelinePropConfig, type TimelinePropStepConfig, type TimelineStepConfig, type TimelineStepValues, TimelineStore, type TimelineTransport, Toggle, TransferCurve, type TransferPoint, type TransitionConfig, TransitionControl, TransitionCopyMenu, type TransitionCopyMenuProps, type TransitionMode, type TransitionPreset, type UseDialOptions, type UseDialTimelineOptions, VersionGallery, type VisibleWhen, type VisibleWhenValue, addDriver, backgroundGradientCss, backgroundMediaCss, buildSamplers, cycleDriverType, cycleSegmentType, defaultBackgroundValue, defaultComposition, defaultGradientHandles, defaultListItemParams, dragGradientCentre, dragGradientEnd, dragGradientWidth, filterShapeResponse, flipDriver, flipDriverX, flipDriverY, flipSegment, flipSegmentX, flipSegmentY, formatClock, formatGizmoAngle, getBackgroundHost, getSavedGradients, gizmoAngle, gizmoPoints, gradientFrame, gradientParamAt, groupListFields, hasBackgroundHost, layerAction, legacyGradientHandles, mountGradientGizmo, normalizeBackgroundValue, normalizeLayersValue, normalizeListItems, paintBackgroundPreview, paintGradient, parseLayerAction, parseListItemSchema, readComposition, redistributeWeight, removeDriver, removeSegment, rotateGradientHandles, sampleTransfer, setBackgroundHost, setDriverAnticipate, setDriverCurvature, setDriverOvershoot, setDriverSteepness, setSavedGradients, setSegmentAnticipate, setSegmentCurvature, setSegmentOvershoot, setSegmentSteepness, splitSegment, springify, stopPlacement, stopPositionAt, subscribeBackgroundHost, switchGradientShape, transferLut, triggerLevels, triggersCrossed, useDialKit, useDialKitController, useDialTimeline, withVisibility };
