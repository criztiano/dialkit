import type { MoveSliderVisual, MoveSelectVisual, MoveVisual } from '../move-visual-core';
export type { MoveSliderVisual, MoveSelectVisual, MoveVisual, MovePlaybackMode } from '../move-visual-core';
// Lightweight state store with subscriptions for tweakers

import { HEX_COLOR_REGEX } from '../color-core';
import { normalizeGradient, DEFAULT_GRADIENT, type GradientValue } from '../gradient-core';
import { resolveAxis, normalizeValue as normalizeXYValue, type XYValue } from '../xy-pad-core';
import { clampRange } from '../range-slider-core';
import { resolveFilterAxis, normalizeFilterValue, type FilterAxisConfig, type FilterValue } from '../filter-core';
import { resolvePersistTarget, loadPersisted, savePersisted, type PersistTarget } from './persist';
// Type-only (erased in JS): lets consumers import `RangeValue` from the package types.
import type { RangeValue } from '../range-slider-core';

export type { XYValue };
export type { RangeValue };

/**
 * One axis of an XY pad control. Partial — every field falls back through
 * `resolveAxis` (min 0, max 1, step 0.01). `origin`/`bipolar` mirror the
 * Slider's names/semantics, resolved independently per axis.
 */
export type XYAxis = {
  min?: number;
  max?: number;
  step?: number;
  origin?: number;
  bipolar?: boolean;
  label?: string;
};

export type SpringConfig = {
  type: 'spring';
  stiffness?: number;
  damping?: number;
  mass?: number;
  visualDuration?: number;
  bounce?: number;
};

export type EasingConfig = {
  type: 'easing';
  duration: number;
  ease: [number, number, number, number];
};

export type TransitionConfig = SpringConfig | EasingConfig;

export type ActionConfig = {
  type: 'action';
  /** The button's own text. */
  label?: string;
  /**
   * Text at the left of the row, with the button pushed to the right — the
   * same shape as every other control row. Use it when the button acts ON
   * something the row should name ("kick … [Load]"). Without it the button
   * fills the row and carries the meaning alone.
   */
  caption?: string;
};

export type SelectConfig = {
  type: 'select';
  /** Optional semantic drawing for the Move surface. */
  moveVisual?: MoveSelectVisual;
  /**
   * An option may name an `icon` from `LUCIDE_ICONS` — the Move slot draws it
   * instead of making you read the mode name off a controller.
   */
  options: (string | { value: string; label: string; icon?: string })[];
  default?: string;
  /** 'segmented' renders the options as an inline segmented control instead of a dropdown. Suits 2–4 short options. */
  display?: 'dropdown' | 'segmented';
  /**
   * The shape an option stands for: `t` in [0,1] → y, auto-fitted and drawn
   * in the Move slot in place of the option's name, which moves to a small
   * tag at the top. Return `null` for options that have no shape.
   *
   * A closure, so — like a curve row's `sample` — it is invisible to the
   * serialized config diff and is refreshed through `syncCurveConfigs`. That
   * is what lets the drawing follow the app's other controls: a pitch arc's
   * preview tracks its bell and flip while the picker stays a picker.
   */
  preview?: (value: string) => ((t: number) => number) | null | undefined;
};

export type ColorConfig = {
  type: 'color';
  default?: string;
  /** Enables the alpha slider; the emitted value becomes #rrggbbaa. Default false. */
  alpha?: boolean;
  /** Shows the shared saved-swatches row (persisted per machine). Default false. */
  palette?: boolean;
};

export type GradientConfig = {
  type: 'gradient';
  default?: GradientValue;
};

export type XYConfig = {
  type: 'xy';
  /** Starting point. Missing/out-of-range components clamp to each axis's origin. */
  default?: XYValue;
  /** Per-axis range/step/origin. Each resolves through `resolveAxis`. */
  x?: XYAxis;
  y?: XYAxis;
  /** Grid overlay — on by default as a 5×5 grid (faint at rest, stronger on interaction). `false` to hide, or a number for a uniform N×N count. */
  grid?: boolean | number;
  /** Multiplies both grid axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
  density?: number;
  /** Snap the emitted value to each axis's step (default continuous). */
  snap?: boolean;
  /** Spring the thumb back to centre on release (joystick feel). Default hold. */
  returnToCenter?: boolean;
  /** Show the live value next to each axis label (default false = label only). */
  showValues?: boolean;
};

export type TextConfig = {
  type: 'text';
  default?: string;
  placeholder?: string;
};

/**
 * The 2-slot filter control: one value, two hands — cutoff on the left,
 * resonance on the right. On the Move it claims two dial slots and draws
 * its magnitude response across both; inline it is one row for the same
 * pair. `response` is a closure like a curve row's `sample` (refreshed
 * through `syncCurveConfigs`); without one the kit draws its own lowpass.
 */
export type FilterConfig = {
  type: 'filter';
  /** Starting point. Missing hands open the filter: cutoff max, resonance min. */
  default?: Partial<FilterValue>;
  cutoff?: FilterAxisConfig;
  resonance?: FilterAxisConfig;
  /** The drawn magnitude response, from each hand's 0..1 position. */
  response?: (cutoff01: number, resonance01: number) => (t: number) => number;
  /**
   * `false` draws the control bypassed — the curve still shows (so the slot
   * reads as a filter, not an empty display) but greyed out, the way a
   * disabled module dims. Defaults to on.
   */
  enabled?: boolean;
};

export type RangeConfig = {
  type: 'range';
  min: number;
  max: number;
  /** Falls back to the full span { min, max } when omitted. */
  default?: RangeValue;
  /** Falls back to inferStep(min, max) when omitted. */
  step?: number;
};

/**
 * Explicit slider form for what the `[default, min, max, step?]` tuple can't
 * express: a display unit, a custom value formatter, or a bipolar fill.
 */
export type SliderConfig = {
  type: 'slider';
  /** Optional semantic drawing for the Move surface; never inferred from labels. */
  moveVisual?: MoveSliderVisual;
  default: number;
  min: number;
  max: number;
  /** Falls back to inferStep(min, max) when omitted. */
  step?: number;
  /** Appended to the displayed value, e.g. ' dB', ' ms', '×'. */
  unit?: string;
  /**
   * Override the displayed value text entirely; `unit` is not auto-appended.
   * A function, so it is invisible to the JSON structure diff — changing only
   * the formatter does not re-register the panel.
   */
  formatValue?: (value: number) => string;
  /** Anchor the fill at this value instead of `min` (see Slider). */
  origin?: number;
  /** Convenience for `origin: 0` on a symmetric range. */
  bipolar?: boolean;
  /** `vertical` renders the column card (fill grows bottom-up, label at base). */
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Scrub-anywhere numeric readout. Unlike a slider it has no track — drag the
 * card to nudge the value, click to type — and bounds are optional, so it is
 * the control for open-ended quantities (dB trims, sample offsets, seeds).
 */
export type NumberConfig = {
  type: 'number';
  default: number;
  min?: number;
  max?: number;
  /** Falls back to a step inferred from `default`'s precision when omitted. */
  step?: number;
  /** Appended to the displayed value, e.g. ' dB', ' ms', '×'. */
  unit?: string;
  /** Override the displayed value text entirely; `unit` is not auto-appended. */
  formatValue?: (value: number) => string;
  /** `vertical` stacks the label above a centered value (column card). */
  orientation?: 'horizontal' | 'vertical';
};

/**
 * A read-only curve preview row. Draws the shape the host's own parameters
 * produce (e.g. a pitch arc from a shape select plus modifier sliders); it
 * holds no value of its own, so nothing lands in ResolvedValues, presets, or
 * persistence. `sample` is a function and therefore invisible to the
 * serialized config diff (like `formatValue`); adapters push replacements
 * through `TweakStore.syncCurveConfigs` so the drawing tracks the host.
 */
export type CurveConfig = {
  type: 'curve';
  /** t in [0,1] → y. Non-finite results are skipped (the stroke breaks there). */
  sample: (t: number) => number;
  /** Fixed y-range to fit. Default: auto-fit each draw with a little headroom. */
  domain?: [number, number];
  /** Vertical reference lines at these x positions in [0,1]; invalid entries are skipped. */
  markers?: readonly number[];
  /** Surface height in px, clamped to 32–160. Default 64. Ignored when `aspect` is set. */
  height?: number;
  /**
   * Width ÷ height. Sizes the surface from its own width instead of `height`,
   * so the plot holds its proportions at any column width — what a transfer
   * curve wants, since its two axes share a scale. `1` is square, `4 / 3` a
   * little wider than tall.
   */
  aspect?: number;
  /** `false` = full-bleed row without the label line; a string overrides the key-derived label. */
  label?: false | string;
};

/**
 * A read-only live-analyser row: the panel-embedded form of the standalone
 * `AnalyserVisualization`. Like the curve row it holds no value — nothing
 * lands in ResolvedValues, presets, or persistence — and its function-valued
 * fields (`analyser`, `marker`) are invisible to the serialized config diff,
 * so adapters keep them fresh through `TweakStore.syncCurveConfigs`.
 */
export type AnalyserConfig = {
  type: 'analyser';
  /** The live AnalyserNode, read at render — a getter so the host can hand it over late (audio contexts start on gesture). */
  analyser: () => AnalyserNode | null;
  /** 'frequency' (default) — live spectrum. 'waveform' — oscilloscope. */
  source?: 'frequency' | 'waveform';
  variant?: 'line' | 'area';
  /** 'pixelated' (default here — the panel's block language) or 'smooth'. */
  mode?: 'smooth' | 'pixelated';
  pixelSize?: number;
  scale?: 'log' | 'linear';
  spring?: boolean | { stiffness?: number; damping?: number };
  /** Spectrum only: confine the display to this frequency window in Hz. */
  rangeHz?: readonly [number, number];
  /** Spectrum only: a live vertical reference in Hz, read every frame. */
  marker?: () => number | null;
  /** Surface height in px, clamped like the curve row's. Default 56. */
  height?: number;
  /** `false` = full-bleed row without the label line; a string overrides the key-derived label. */
  label?: false | string;
};

export type FileConfig = {
  type: 'file';
  /** Native input `accept` filter, e.g. 'image/*' or '.svg,image/svg+xml'. */
  accept?: string;
  multiple?: boolean;
};

export type SwatchOption = {
  value: string;
  label: string;
  /** One color renders a chip; many render a thin strip preview. */
  colors: string[];
};

export type SwatchConfig = {
  type: 'swatch';
  options: SwatchOption[];
  default?: string;
};

export type ChipOption = {
  value: string;
  label: string;
  /** Removable chips show an ✕ and emit a `remove` event (curated stay; saved go). */
  removable?: boolean;
};

export type ChipsConfig = {
  type: 'chips';
  options: ChipOption[];
  default?: string;
};

export type MultiSelectOption = {
  value: string;
  label: string;
  /** One quiet line under the label — e.g. what the option contains. */
  hint?: string;
  /** Tiny uppercase badge next to the label — e.g. 'local' / 'cloud'. */
  tag?: string;
};

/** Checkbox rows resolving to the checked values, in option order. */
export type MultiSelectConfig = {
  type: 'multiselect';
  options: MultiSelectOption[];
  default?: string[];
};

export type GalleryItem = {
  id: string;
  src?: string;
  alt?: string;
  /** Width / height hint used to size custom (non-image) content in the masonry. */
  aspect?: number;
  // reason: a framework-specific node (ReactNode, etc.) — the store carries it
  // through to the renderer but never invokes it, so it stays framework-agnostic.
  render?: () => unknown;
};

export type GalleryConfig = {
  type: 'gallery';
  items: GalleryItem[];
  default?: string;
  columns?: number;
};

/**
 * One row in a list control — a chosen item type plus its sub-control values.
 * Stays JSON-serializable: `params` holds only scalars, never live objects.
 */
export type ListItemValue = {
  type: string;
  params: Record<string, number | boolean | string>;
  /**
   * Row-level name, shown in place of the item type's label and renamable in
   * place. Absent (never empty) when the row has no name of its own.
   */
  title?: string;
};

/**
 * A sub-control field inside a list item type's schema. Uses the same shorthand
 * as a panel config, but scalar-only (no nested folders or non-value controls).
 */
export type ListItemField =
  | [number, number, number, number?]
  | number
  | boolean
  | string
  | SelectConfig
  | ColorConfig
  | SwatchConfig
  | TextConfig;

export type ListItemType = {
  /** Shown in the add menu, and as a row's title when the row has none of its own. */
  label: string;
  /** Sub-controls for this item type, keyed by param name. */
  schema: Record<string, ListItemField>;
  /**
   * Help text per field, keyed by the same param name. Keyed rather than inline
   * because a schema field is often bare shorthand (`mass: [1, 0, 10]`) with
   * nowhere to hang a property.
   */
  hints?: Record<string, string>;
  /**
   * Section per field, keyed by param name, for rows too deep to read flat.
   * Ungrouped fields stay at the top of the row; each named section becomes a
   * collapsible folder below them, in the order its first field is declared.
   * Keyed for the same reason as `hints`.
   */
  groups?: Record<string, string>;
};

export type ListConfig = {
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
export type ListFieldKind = 'slider' | 'toggle' | 'select' | 'color' | 'swatch' | 'text';
export type ListField = {
  key: string;
  label: string;
  kind: ListFieldKind;
  hint?: string;
  /** Section this field belongs to, or absent for the row's flat top area. */
  group?: string;
  /** Colour fields only: show the shared saved-swatches row, as at top level. */
  palette?: boolean;
  /** Swatch fields only: the named palettes to choose between. */
  swatchOptions?: SwatchOption[];
  min?: number;
  max?: number;
  step?: number;
  options?: (string | { value: string; label: string })[];
  placeholder?: string;
  defaultValue: number | boolean | string;
};

export type TweakValue = number | boolean | string | string[] | XYValue | SpringConfig | EasingConfig | ActionConfig | SelectConfig | SliderConfig | NumberConfig | ColorConfig | GradientConfig | GradientValue | XYConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | MultiSelectConfig | ListConfig | ListItemValue[] | RangeConfig | RangeValue | FilterConfig | FilterValue;

export type TweakConfig = {
  // CurveConfig and AnalyserConfig are not TweakValues: they never enter the
  // value layer, so they ride the config union directly instead.
  [key: string]: TweakValue | [number, number, number, number?] | CurveConfig | AnalyserConfig | TweakConfig;
};

/** UI-only reserved keys: they shape the panel, never resolve to a value. */
export type ReservedKey = '_collapsed' | '_collapsible' | '_tabs';

export type ResolvedValues<T extends TweakConfig> = {
  // Curve rows are display-only, and reserved keys are metadata; neither keeps
  // its key in the resolved shape.
  [K in keyof T as T[K] extends CurveConfig ? never : K extends ReservedKey ? never : K]: T[K] extends [number, number, number, number?]
    ? number
    : T[K] extends SliderConfig
    ? number
    : T[K] extends NumberConfig
    ? number
    : T[K] extends MultiSelectConfig
    ? string[]
    : T[K] extends SpringConfig
      ? TransitionConfig
      : T[K] extends EasingConfig
        ? TransitionConfig
        : T[K] extends SelectConfig
          ? string
          : T[K] extends ColorConfig
            ? string
            : T[K] extends GradientConfig
              ? GradientValue
            : T[K] extends XYConfig
              ? XYValue
              : T[K] extends TextConfig
                ? string
                : T[K] extends RangeConfig
                  ? RangeValue
                : T[K] extends FilterConfig
                  ? FilterValue
                : T[K] extends GalleryConfig
                  ? string
                  : T[K] extends FileConfig
                    ? string
                    : T[K] extends SwatchConfig
                      ? string
                      : T[K] extends ChipsConfig
                        ? string
                        : T[K] extends ListConfig
                          ? ListItemValue[]
                          : T[K] extends TweakConfig
                            ? ResolvedValues<T[K]>
                            : T[K];
};

export type ShortcutMode = 'fine' | 'normal' | 'coarse';
export type ShortcutInteraction = 'scroll' | 'drag' | 'move' | 'scroll-only';

export type ShortcutConfig = {
  key?: string;
  modifier?: 'alt' | 'shift' | 'meta';
  mode?: ShortcutMode;
  interaction?: ShortcutInteraction;
};

/**
 * How lit the affordance dot is. The app pushes this — tweakers owns only how
 * each state looks, never when it applies.
 */
export type AffordanceStatus = 'off' | 'armed' | 'active';

/** What tweakers hands a popover so it doesn't have to resolve any of it itself. */
export type AffordanceContext = {
  panelId: string;
  path: string;
  status: AffordanceStatus;
  /** Shorthand for `TweakStore.setAffordanceStatus(panelId, path, …)`. */
  setStatus: (status: AffordanceStatus) => void;
};

/**
 * A companion control hung off a control's corner: a barely-there dot that opens
 * a popover the host app fills.
 *
 * `content` is a component — a React/Solid/Vue component or a Svelte snippet —
 * receiving the context as its props/argument. Not a pre-built node: it is
 * captured once at registration and would never see current state. Not called
 * directly by the renderer either, so a stateful popover keeps its own identity
 * and its own hooks. This is also why affordances travel as a panel option
 * rather than in the config: the config is JSON-serialized on every render to
 * detect structure changes, and view code would not survive that.
 */
export type AffordanceConfig = {
  content: (ctx: AffordanceContext) => unknown;
  /** Accessible name for the dot and its popover. Defaults to 'Options'. */
  label?: string;
};

export type ControlMeta = {
  moveVisual?: MoveVisual;
  type: 'slider' | 'number' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'gradient' | 'xy' | 'text' | 'range' | 'gallery' | 'file' | 'swatch' | 'chips' | 'multiselect' | 'list' | 'curve' | 'analyser' | 'filter';
  path: string;
  label: string;
  /** One line of help, revealed on hover or when focus lands inside the control. */
  hint?: string;
  /** Companion control reachable from a dot in the control's bottom-right corner. */
  affordance?: AffordanceConfig;
  min?: number;
  max?: number;
  step?: number;
  /** Range control's configured reset target — its `default`, else the full {min,max} span. */
  rangeDefault?: RangeValue;
  children?: ControlMeta[];
  defaultOpen?: boolean;
  /** Folder declared `_enabled` — renders as a module whose header switch drives `<path>._enabled`. */
  module?: boolean;
  /** Folder declared `_collapsible: false` — plain section header, no caret, body always open. */
  collapsible?: boolean;
  /** Action declared a `caption` — the row names what the button acts on. */
  caption?: string;
  /** Top-level folder under a `_tabs` root — it is a tab, and its children are that tab's page. */
  tab?: boolean;
  /** The synthetic segmented select driving `_tab` — it renders as the panel's tab bar, never as a row. */
  tabBar?: boolean;
  options?: (string | { value: string; label: string; icon?: string })[];
  /** Select's per-option shape sampler — swapped in place by syncCurveConfigs. */
  preview?: (value: string) => ((t: number) => number) | null | undefined;
  /** Select's rendering mode, from the SelectConfig form. */
  display?: 'dropdown' | 'segmented';
  placeholder?: string;
  items?: GalleryItem[];
  columns?: number;
  accept?: string;
  multiple?: boolean;
  swatchOptions?: SwatchOption[];
  chipOptions?: ChipOption[];
  multiSelectOptions?: MultiSelectOption[];
  /** Slider display unit, from the explicit SliderConfig form. */
  unit?: string;
  /** Slider display formatter, from the explicit SliderConfig form. */
  formatValue?: (value: number) => string;
  /** Slider fill anchor, from the explicit SliderConfig form. */
  origin?: number;
  bipolar?: boolean;
  /** Slider/number layout, from the explicit config forms. */
  orientation?: 'horizontal' | 'vertical';
  itemTypes?: Record<string, ListItemType>;
  addLabel?: string;
  maxItems?: number;
  alpha?: boolean;
  palette?: boolean;
  /** XY pad axes/options — carried through to the XYControl. */
  xAxis?: XYAxis;
  yAxis?: XYAxis;
  grid?: boolean | number;
  density?: number;
  snap?: boolean;
  returnToCenter?: boolean;
  showValues?: boolean;
  /** Filter control's per-hand range/step/label/format. */
  cutoffAxis?: FilterAxisConfig;
  resonanceAxis?: FilterAxisConfig;
  /** Filter control's drawn magnitude response — swapped in place by syncCurveConfigs. */
  response?: (cutoff01: number, resonance01: number) => (t: number) => number;
  /** Filter control declared `enabled: false` — the slot draws bypassed (dimmed). */
  filterEnabled?: boolean;
  /** Curve preview's host-supplied sampler — swapped in place by syncCurveConfigs. */
  sample?: (t: number) => number;
  /** Curve preview's fixed y-range; absent = auto-fit per draw. */
  domain?: [number, number];
  /** Curve preview's vertical reference marker positions — kept fresh by syncCurveConfigs. */
  markers?: readonly number[];
  /** Curve preview's surface height in px (renderers clamp via clampCurveHeight). */
  height?: number;
  /** Curve preview's width ÷ height — the surface follows its own width. */
  aspect?: number;
  /** Curve preview declared `label: false` — full-bleed row without the label line. */
  hideLabel?: boolean;
  /** Analyser row's whole config — swapped in place by syncCurveConfigs, like `sample`. */
  analyserRow?: AnalyserConfig;
  shortcut?: ShortcutConfig;
};

/** Flat-value path holding a `_tabs` panel's active tab — the key of that tab's folder. */
export const TAB_PATH = '_tab';

export type PanelConfig = {
  id: string;
  name: string;
  controls: ControlMeta[];
  values: Record<string, TweakValue>;
  shortcuts: Record<string, ShortcutConfig>;
  /** Help text by control path, retained so a later updatePanel can restate it. */
  hints?: Record<string, string>;
  /** Affordances by control path, retained on the same terms as `hints`. */
  affordances?: Record<string, AffordanceConfig>;
  /** Label overrides by control path, retained on the same terms as `hints`. */
  labels?: Record<string, string>;
  /** Move pad columns by control path, retained on the same terms as `hints`. */
  movePads?: Record<string, number>;
  /**
   * Config declared `_enabled` at its root — the whole panel is a module, and
   * its title carries the switch. Same idiom as a module folder, one level up.
   */
  module?: boolean;
  kind?: 'timeline' | 'modulation';
};

type Listener = () => void;
type ActionListener = (action: string) => void;

/**
 * Non-value events emitted by controls (file picked, chip removed, list mutated).
 * Delivered through the generic `onEvent(path, event)` channel so the value layer
 * stays JSON-serializable (a File is never stored — it rides on a file event).
 */
export type TweakEvent =
  | { kind: 'file'; files: FileList }
  | { kind: 'remove'; value: string }
  | { kind: 'list'; op: 'add' | 'remove' | 'move' | 'set' | 'rename'; index?: number; from?: number; to?: number; itemType?: string };

type EventListener = (path: string, event: TweakEvent) => void;

export type Preset = {
  id: string;
  name: string;
  values: Record<string, TweakValue>;
};

export type PresetProviderPreset = {
  id: string;
  label: string;
  /** Read-only rows (e.g. factory presets) show no delete affordance. */
  readonly?: boolean;
};

/**
 * Host-owned backing for the panel toolbar's preset UI. When a provider is set
 * the toolbar renders the host's list instead of the built-in snapshots: the
 * store never captures or restores values itself — the host applies them in
 * `onSelect` (e.g. via `TweakStore.updateValues`) and owns persistence. The
 * stock auto-save-to-active-preset behavior is off because the store's own
 * active-preset state is never engaged in provider mode.
 */
export type PresetProvider = {
  presets: PresetProviderPreset[];
  activeId?: string | null;
  onSelect(id: string): void | Promise<void>;
  /** "+" pressed; receives a suggested label ("Preset N"). */
  onCreate(suggestedLabel: string): void | Promise<void>;
  /** Omit to hide the delete affordance entirely. */
  onDelete?(id: string): void | Promise<void>;
  /** Inline rename committed; omit to hide the rename affordance entirely. */
  onRename?(id: string, name: string): void | Promise<void>;
};

/**
 * What the toolbar renders per dropdown row — one shape for both modes, so the
 * framework components never branch on where a preset came from.
 */
export type PresetItem = {
  id: string;
  name: string;
  deletable: boolean;
  renamable: boolean;
};

// Stable empty object for unregistered panels (React 19 useSyncExternalStore requirement)
const EMPTY_VALUES: Record<string, TweakValue> = Object.freeze({});

// Persistence option shape shared with the timeline adapter. When truthy AND
// the panel has a stable `id`, the panel's flat values are saved to (and
// restored from) browser storage — fail-soft, node-safe (see ./persist).
// `retainOnUnmount` is still accepted for API parity but not acted on here.
export type TweakersPersistOptions = boolean | {
  key?: string;
  storage?: 'localStorage' | 'sessionStorage';
  presets?: boolean;
};

export type TweakStorePanelOptions = {
  retainOnUnmount?: boolean;
  persist?: TweakersPersistOptions;
  /**
   * Help text by control path — the same keying as `shortcuts`. Keyed rather
   * than declared inline because most controls are bare shorthand
   * (`gravity: [9.8, 0, 20]`) with nowhere to hang a property.
   */
  hints?: Record<string, string>;
  /**
   * Companion controls by control path. Holds framework view nodes, so — unlike
   * the config — this is never serialized.
   */
  affordances?: Record<string, AffordanceConfig>;
  /**
   * Display label by control path, overriding the name derived from the config
   * key. Keyed for the same reason as `hints`: the controls that most need a
   * label the key can't express are bare shorthand (`a: [0, 0, 1]` relabelled
   * per mode) with nowhere to hang a property. Applies to folders too.
   *
   * Without this, changing a control's visible text means changing its config
   * key — which silently changes its identity, so it loses its value, its
   * persisted entry and its shortcut binding.
   */
  labels?: Record<string, string>;
  /**
   * Which Move pad column a control sits in, by control path (0-7) — the
   * page's hand-authored hardware layout. Without it the surface packs pads
   * left to right, which is fine for a page whose pads happen to belong to
   * the leftmost dials and wrong for every other page. With it, a pad sits
   * under the dial it belongs to: toggles take the toggle row, bounded
   * numbers the value row (leaving the dial pool however few dials the page
   * has), actions the row under those.
   */
  movePads?: Record<string, number>;
  /** Timeline panels render in TweakTimeline; modulation panels are the Move's
   * modulator settings pages — both are filtered out of the panel dock. */
  kind?: 'timeline' | 'modulation';
};

/** camelCase → Title Case, the label rule used everywhere a key becomes UI text. */
export function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * DOM id for a control's hint tooltip. `aria-describedby` holds a space-separated
 * list of ids, so any whitespace — panel names and list labels are free text —
 * would silently split one reference into two dangling ones.
 */
export function hintDomId(scope: string, path: string): string {
  return `tweakers-hint-${scope}-${path}`.replace(/\s+/g, '-');
}

/** Default slider step for a numeric range. */
export function inferStep(min: number, max: number): number {
  const range = max - min;
  if (range <= 1) return 0.01;
  if (range <= 10) return 0.1;
  if (range <= 100) return 1;
  return 10;
}

export function isHexColor(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
}

/** Value equality for curve marker arrays (both absent counts as equal). */
function sameMarkers(a?: readonly number[], b?: readonly number[]): boolean {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((m, i) => Object.is(m, b[i]));
}

function resolveValueHasType(value: unknown, type: string): boolean {
  return typeof value === 'object' && value !== null && 'type' in value && (value as { type: string }).type === type;
}

export function isSpringConfigValue(value: unknown): value is SpringConfig {
  return resolveValueHasType(value, 'spring');
}

export function isEasingConfigValue(value: unknown): value is EasingConfig {
  return resolveValueHasType(value, 'easing');
}

/**
 * Resolve a flat value snapshot back into the nested shape declared by a config.
 * Shared by the timeline core (timing-only configs). Handles the primitive,
 * spring/easing, select, color, and text config kinds a timeline emits.
 */
export function resolveTweakValues<T extends TweakConfig>(
  config: T,
  flatValues: Record<string, TweakValue>
): ResolvedValues<T> {
  return resolveConfigValues(config, flatValues, '') as ResolvedValues<T>;
}

function resolveConfigValues(
  config: TweakConfig,
  flatValues: Record<string, TweakValue>,
  prefix: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, configValue] of Object.entries(config)) {
    if (key === '_collapsed' || key === '_collapsible' || key === '_tabs') continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === 'number') {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (typeof configValue === 'number' || typeof configValue === 'boolean' || typeof configValue === 'string') {
      result[key] = flatValues[path] ?? configValue;
    } else if (resolveValueHasType(configValue, 'spring') || resolveValueHasType(configValue, 'easing')) {
      result[key] = flatValues[path] ?? configValue;
    } else if (resolveValueHasType(configValue, 'action')) {
      result[key] = flatValues[path] ?? configValue;
    } else if (resolveValueHasType(configValue, 'select') && Array.isArray((configValue as SelectConfig).options)) {
      const select = configValue as SelectConfig;
      const defaultValue = select.default ?? (typeof select.options[0] === 'string' ? select.options[0] : select.options[0]?.value);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (resolveValueHasType(configValue, 'color')) {
      result[key] = flatValues[path] ?? (configValue as ColorConfig).default ?? '#000000';
    } else if (resolveValueHasType(configValue, 'text')) {
      result[key] = flatValues[path] ?? (configValue as TextConfig).default ?? '';
    } else if (resolveValueHasType(configValue, 'curve') || resolveValueHasType(configValue, 'analyser')) {
      // Display-only rows: no value to resolve.
    } else if (typeof configValue === 'object' && configValue !== null) {
      result[key] = resolveConfigValues(configValue as TweakConfig, flatValues, path);
    }
  }

  return result;
}

class TweakStoreClass {
  private panels: Map<string, PanelConfig> = new Map();
  private listeners: Map<string, Set<Listener>> = new Map();
  private globalListeners: Set<Listener> = new Set();
  private snapshots: Map<string, Record<string, TweakValue>> = new Map();
  private actionListeners: Map<string, Set<ActionListener>> = new Map();
  private eventListeners: Map<string, Set<EventListener>> = new Map();
  // Affordance status and disabled state are app-pushed presentation, not
  // control values: they stay out of `values` so they are never persisted, saved
  // into a preset, or diffed against the config. One listener set covers both, so
  // a control's shell needs a single subscription.
  private affordanceStatus: Map<string, Map<string, AffordanceStatus>> = new Map();
  private disabledPaths: Map<string, Set<string>> = new Map();
  private controlStateListeners: Map<string, Set<Listener>> = new Map();
  private presets: Map<string, Preset[]> = new Map();
  private activePreset: Map<string, string | null> = new Map();
  // Host-owned preset providers. The serialized form (functions drop out of
  // JSON, leaving list + activeId) decides whether a swap is visible: adapters
  // replace the object on every host render so callbacks never go stale, and
  // only a data change should notify.
  private presetProviders: Map<string, { provider: PresetProvider; serialized: string }> = new Map();
  /** Panels whose header carries no preset toolbar (see setPresetsHidden). */
  private presetsHidden: Set<string> = new Set();
  private baseValues: Map<string, Record<string, TweakValue>> = new Map();
  // Resolved storage target per panel (null = persistence off). Absent = not
  // yet registered.
  private persistTargets: Map<string, PersistTarget | null> = new Map();

  registerPanel(id: string, name: string, config: TweakConfig, shortcuts?: Record<string, ShortcutConfig>, options: TweakStorePanelOptions = {}): void {
    const existingPanel = this.panels.get(id);
    if (existingPanel && existingPanel.kind !== options.kind) {
      console.warn(
        `[tweakers] Panel id "${id}" cannot be shared by a timeline and a standard panel; ` +
        `the most recent registration controls where it renders.`
      );
    }

    const target = resolvePersistTarget('panel', id, options.persist);
    this.persistTargets.set(id, target);

    const controls = this.parseConfig(config, '', shortcuts);
    this.applyControlExtras(controls, options.hints, options.affordances, options.labels);
    const values = this.flattenValues(config, '');
    this.initTabValue(controls, values);

    // Set initial transition modes based on config types
    this.initTransitionModes(config, '', values);

    // Overlay persisted values onto the config defaults, but only for keys the
    // current config still declares — a renamed/removed control drops its
    // stale saved value instead of resurrecting it.
    this.overlayPersistedValues(target, values);

    this.panels.set(id, { id, name, controls, values, shortcuts: shortcuts ?? {}, hints: options.hints, affordances: options.affordances, labels: options.labels, movePads: options.movePads, module: '_enabled' in config ? true : undefined, kind: options.kind });
    this.snapshots.set(id, { ...values });
    this.baseValues.set(id, { ...values });
    this.notifyGlobal();
  }

  updatePanel(id: string, name: string, config: TweakConfig, shortcuts?: Record<string, ShortcutConfig>, options: TweakStorePanelOptions = {}): void {
    const existing = this.panels.get(id);
    if (!existing) {
      this.registerPanel(id, name, config, shortcuts, options);
      return;
    }

    const hints = options.hints ?? existing.hints;
    const affordances = options.affordances ?? existing.affordances;
    const labels = options.labels ?? existing.labels;
    const movePads = options.movePads ?? existing.movePads;
    const controls = this.parseConfig(config, '', shortcuts);
    this.applyControlExtras(controls, hints, affordances, labels);
    const controlsByPath = this.mapControlsByPath(controls);
    const defaultValues = this.flattenValues(config, '');
    this.initTabValue(controls, defaultValues);
    const nextValues: Record<string, TweakValue> = {};

    for (const [path, defaultValue] of Object.entries(defaultValues)) {
      nextValues[path] = this.normalizePreservedValue(
        existing.values[path],
        defaultValue,
        controlsByPath.get(path)
      );
    }

    // Set mode defaults for new transition controls first.
    this.initTransitionModes(config, '', nextValues);

    for (const [path, mode] of Object.entries(existing.values)) {
      if (!path.endsWith('.__mode')) {
        continue;
      }

      const transitionPath = path.slice(0, -'__mode'.length - 1);
      const transitionControl = controlsByPath.get(transitionPath);
      if (transitionControl?.type === 'transition') {
        nextValues[path] = mode;
      }
    }

    const nextPanel: PanelConfig = { id, name, controls, values: nextValues, shortcuts: shortcuts ?? existing.shortcuts, hints, affordances, labels, movePads, module: '_enabled' in config ? true : undefined, kind: options.kind ?? existing.kind };
    this.panels.set(id, nextPanel);
    this.snapshots.set(id, { ...nextValues });

    const previousBaseValues = this.baseValues.get(id) ?? {};
    const nextBaseValues: Record<string, TweakValue> = {};
    for (const [path, defaultValue] of Object.entries(defaultValues)) {
      nextBaseValues[path] = this.normalizePreservedValue(
        previousBaseValues[path],
        defaultValue,
        controlsByPath.get(path)
      );
    }

    for (const [path, value] of Object.entries(nextValues)) {
      if (path.endsWith('.__mode')) {
        nextBaseValues[path] = value;
      }
    }

    this.baseValues.set(id, nextBaseValues);

    this.savePanelValues(id);
    this.notify(id);
    this.notifyGlobal();
  }

  unregisterPanel(id: string): void {
    this.panels.delete(id);
    // Keep listener sets: subscribed components can outlive the registration
    // (HMR unregister/re-register of the same id) and must keep receiving
    // notifications. Cleanup happens via the unsubscribe closures below.
    if (this.listeners.get(id)?.size === 0) this.listeners.delete(id);
    if (this.actionListeners.get(id)?.size === 0) this.actionListeners.delete(id);
    if (this.eventListeners.get(id)?.size === 0) this.eventListeners.delete(id);
    if (this.controlStateListeners.get(id)?.size === 0) this.controlStateListeners.delete(id);
    this.affordanceStatus.delete(id);
    this.disabledPaths.delete(id);
    this.snapshots.delete(id);
    this.baseValues.delete(id);
    this.persistTargets.delete(id);
    this.presetProviders.delete(id);
    this.presetsHidden.delete(id);
    this.notifyGlobal();
  }

  // Overlay saved values onto freshly-computed defaults, in place. Only keys
  // that still exist in `values` (i.e. the current config) are restored.
  private overlayPersistedValues(target: PersistTarget | null, values: Record<string, TweakValue>): void {
    const persisted = loadPersisted<Record<string, TweakValue>>(target);
    if (!persisted) return;
    for (const key of Object.keys(values)) {
      if (Object.prototype.hasOwnProperty.call(persisted, key)) {
        values[key] = persisted[key];
      }
    }
  }

  // Save the panel's current flat values (fail-soft, no-op when persistence is
  // off). Called after every edit so timing/values survive a reload.
  private savePanelValues(panelId: string): void {
    const target = this.persistTargets.get(panelId);
    if (!target) return;
    const panel = this.panels.get(panelId);
    if (panel) savePersisted(target, panel.values);
  }

  updateValue(panelId: string, path: string, value: TweakValue): void {
    const panel = this.panels.get(panelId);
    if (!panel) return;

    panel.values[path] = value;

    // Auto-save to active preset or base values
    const activeId = this.activePreset.get(panelId);
    if (activeId) {
      const presets = this.presets.get(panelId) ?? [];
      const preset = presets.find(p => p.id === activeId);
      if (preset) preset.values[path] = value;
    } else {
      const base = this.baseValues.get(panelId);
      if (base) base[path] = value;
    }

    // Create a new snapshot reference so useSyncExternalStore detects the change
    this.snapshots.set(panelId, { ...panel.values });
    this.savePanelValues(panelId);
    this.notify(panelId);
  }

  // Apply several path/value edits atomically — one snapshot + one notify.
  // The timeline uses this when a single gesture trades time between fields
  // (e.g. resizing a clip's start edge shifts both its position and duration),
  // where an intermediate single-field state would be invalid.
  updateValues(panelId: string, updates: Record<string, TweakValue>): void {
    const panel = this.panels.get(panelId);
    if (!panel) return;

    const activeId = this.activePreset.get(panelId);
    const preset = activeId
      ? (this.presets.get(panelId) ?? []).find(p => p.id === activeId)
      : undefined;
    const base = this.baseValues.get(panelId);

    for (const [path, value] of Object.entries(updates)) {
      panel.values[path] = value;
      if (preset) preset.values[path] = value;
      else if (base) base[path] = value;
    }

    this.snapshots.set(panelId, { ...panel.values });
    this.savePanelValues(panelId);
    this.notify(panelId);
  }

  updateSpringMode(panelId: string, path: string, mode: 'simple' | 'advanced'): void {
    this.updateTransitionMode(panelId, path, mode);
  }

  getSpringMode(panelId: string, path: string): 'simple' | 'advanced' {
    const mode = this.getTransitionMode(panelId, path);
    if (mode === 'easing') return 'simple';
    return mode;
  }

  updateTransitionMode(panelId: string, path: string, mode: 'easing' | 'simple' | 'advanced'): void {
    const panel = this.panels.get(panelId);
    if (!panel) return;

    panel.values[`${path}.__mode`] = mode;
    this.snapshots.set(panelId, { ...panel.values });
    this.notify(panelId);
  }

  getTransitionMode(panelId: string, path: string): 'easing' | 'simple' | 'advanced' {
    const panel = this.panels.get(panelId);
    if (!panel) return 'simple';
    return (panel.values[`${path}.__mode`] as 'easing' | 'simple' | 'advanced') || 'simple';
  }

  getValue(panelId: string, path: string): TweakValue | undefined {
    const panel = this.panels.get(panelId);
    return panel?.values[path];
  }

  getValues(panelId: string): Record<string, TweakValue> {
    // Return the snapshot for useSyncExternalStore compatibility
    // Use stable EMPTY_VALUES to avoid infinite loop in React 19
    return this.snapshots.get(panelId) ?? EMPTY_VALUES;
  }

  getPanels(kind?: 'panel' | 'timeline'): PanelConfig[] {
    const all = Array.from(this.panels.values());
    if (kind === 'panel') return all.filter((panel) => panel.kind === undefined);
    if (kind === 'timeline') return all.filter((panel) => panel.kind === 'timeline');
    return all;
  }

  /**
   * The settings panels a root should draw, given its optional `panels` filter.
   * `undefined` means every panel — the single-surface default. A list means
   * exactly those names, in the order named, so two roots never fight over the
   * same panel and a panel that has not registered yet leaves a gap that fills
   * when it does.
   */
  selectPanels(only?: string | string[]): PanelConfig[] {
    const registered = this.getPanels('panel');
    if (only === undefined) return registered;
    const names = typeof only === 'string' ? [only] : only;
    return names
      .map((name) => registered.find((panel) => panel.name === name))
      .filter((panel): panel is PanelConfig => panel !== undefined);
  }

  getPanel(id: string): PanelConfig | undefined {
    return this.panels.get(id);
  }

  subscribe(panelId: string, listener: Listener): () => void {
    if (!this.listeners.has(panelId)) {
      this.listeners.set(panelId, new Set());
    }
    this.listeners.get(panelId)!.add(listener);

    return () => {
      const listeners = this.listeners.get(panelId);
      listeners?.delete(listener);
      if (listeners?.size === 0 && !this.panels.has(panelId)) {
        this.listeners.delete(panelId);
      }
    };
  }

  subscribeGlobal(listener: Listener): () => void {
    this.globalListeners.add(listener);
    return () => this.globalListeners.delete(listener);
  }

  subscribeActions(panelId: string, listener: ActionListener): () => void {
    if (!this.actionListeners.has(panelId)) {
      this.actionListeners.set(panelId, new Set());
    }
    this.actionListeners.get(panelId)!.add(listener);

    return () => {
      const listeners = this.actionListeners.get(panelId);
      listeners?.delete(listener);
      if (listeners?.size === 0 && !this.panels.has(panelId)) {
        this.actionListeners.delete(panelId);
      }
    };
  }

  triggerAction(panelId: string, path: string): void {
    this.actionListeners.get(panelId)?.forEach(fn => fn(path));
  }

  // Generic non-value event channel (file picked, chip removed, list mutated).
  subscribeEvents(panelId: string, listener: EventListener): () => void {
    if (!this.eventListeners.has(panelId)) {
      this.eventListeners.set(panelId, new Set());
    }
    this.eventListeners.get(panelId)!.add(listener);

    return () => {
      const listeners = this.eventListeners.get(panelId);
      listeners?.delete(listener);
      if (listeners?.size === 0 && !this.panels.has(panelId)) {
        this.eventListeners.delete(panelId);
      }
    };
  }

  emitEvent(panelId: string, path: string, event: TweakEvent): void {
    this.eventListeners.get(panelId)?.forEach(fn => fn(path, event));
  }

  /**
   * How lit a control's affordance dot is. Callers may push this as often as
   * they like — an unchanged status is dropped without notifying, so driving it
   * from an audio callback costs nothing.
   */
  setAffordanceStatus(panelId: string, path: string, status: AffordanceStatus): void {
    let byPath = this.affordanceStatus.get(panelId);

    if (status === 'off') {
      if (!byPath?.delete(path)) return;
    } else {
      if (byPath?.get(path) === status) return;
      if (!byPath) {
        byPath = new Map();
        this.affordanceStatus.set(panelId, byPath);
      }
      byPath.set(path, status);
    }

    this.notifyControlState(panelId);
  }

  getAffordanceStatus(panelId: string, path: string): AffordanceStatus {
    return this.affordanceStatus.get(panelId)?.get(path) ?? 'off';
  }

  /**
   * Greys a control out and stops it responding. Runtime-only by design: a
   * config default plus a runtime override would be two sources of truth, and
   * calling this once covers the static case.
   */
  setDisabled(panelId: string, path: string, disabled: boolean): void {
    let paths = this.disabledPaths.get(panelId);

    if (disabled) {
      if (paths?.has(path)) return;
      if (!paths) {
        paths = new Set();
        this.disabledPaths.set(panelId, paths);
      }
      paths.add(path);
    } else if (!paths?.delete(path)) {
      return;
    }

    this.notifyControlState(panelId);
  }

  isDisabled(panelId: string, path: string): boolean {
    return this.disabledPaths.get(panelId)?.has(path) ?? false;
  }

  /** One channel for every app-pushed presentation change on a panel. */
  subscribeControlState(panelId: string, listener: Listener): () => void {
    if (!this.controlStateListeners.has(panelId)) {
      this.controlStateListeners.set(panelId, new Set());
    }
    this.controlStateListeners.get(panelId)!.add(listener);

    return () => {
      const listeners = this.controlStateListeners.get(panelId);
      listeners?.delete(listener);
      if (listeners?.size === 0 && !this.panels.has(panelId)) {
        this.controlStateListeners.delete(panelId);
      }
    };
  }

  private notifyControlState(panelId: string): void {
    this.controlStateListeners.get(panelId)?.forEach(fn => fn());
  }

  /**
   * Refresh curve rows' host-supplied presentation (sample function + markers)
   * in place. Functions drop out of the serialized config diff (the
   * `formatValue` precedent), so a host that rebuilds its config per render
   * would otherwise leave the preview drawing a stale closure; markers ride the
   * same sync so the whole curve row stays one coherent refresh. Adapters call
   * this after every render — the same contract as setPresetProvider — and only
   * an actual change (function identity, marker values) notifies, on the
   * control-state channel: curve rows are presentation, and the value snapshot
   * must not churn (a new snapshot would re-render the host, whose rebuilt
   * closure would notify again, forever). Markers are compared by value, not
   * identity, because a per-render rebuild remakes the array every time.
   */
  syncCurveConfigs(panelId: string, config: TweakConfig): void {
    const panel = this.panels.get(panelId);
    if (!panel) return;

    let changed = false;
    const visit = (cfg: TweakConfig, prefix: string): void => {
      for (const [key, value] of Object.entries(cfg)) {
        if (key === '_collapsed' || key === '_collapsible' || key === '_tabs') continue;
        const path = prefix ? `${prefix}.${key}` : key;

        if (this.isCurveConfig(value)) {
          const control = this.findControlByPath(panel.controls, path);
          if (control?.type === 'curve') {
            if (control.sample !== value.sample) {
              control.sample = value.sample;
              changed = true;
            }
            if (!sameMarkers(control.markers, value.markers)) {
              control.markers = value.markers;
              changed = true;
            }
          }
        } else if (this.isAnalyserConfig(value)) {
          const control = this.findControlByPath(panel.controls, path);
          // The whole row config rides the sync as one object: its two
          // closures go stale exactly the way `sample` does, and the scalars
          // beside them are cheap to carry along rather than diff field by
          // field. Identity of the closures is the change signal — a host
          // that rebuilds its config per render notifies on the control-state
          // channel only, same as the curve row, so no value churn.
          if (control?.type === 'analyser' && control.analyserRow !== undefined) {
            const prev = control.analyserRow;
            const sameRange =
              prev.rangeHz === value.rangeHz ||
              (!!prev.rangeHz && !!value.rangeHz && prev.rangeHz[0] === value.rangeHz[0] && prev.rangeHz[1] === value.rangeHz[1]);
            const sameScalars =
              prev.source === value.source &&
              prev.variant === value.variant &&
              prev.mode === value.mode &&
              prev.pixelSize === value.pixelSize &&
              prev.scale === value.scale &&
              prev.height === value.height &&
              sameRange;
            if (prev.analyser !== value.analyser || prev.marker !== value.marker || !sameScalars) {
              control.analyserRow = value;
              changed = true;
            }
          }
        } else if (this.isFilterConfig(value) && value.response) {
          // The filter's response closes over the app's other controls exactly
          // as a curve row's sample does, so it goes stale the same way.
          const control = this.findControlByPath(panel.controls, path);
          if (control?.type === 'filter' && control.response !== value.response) {
            control.response = value.response;
            changed = true;
          }
        } else if (this.isSelectConfig(value) && value.preview) {
          // A select's preview closes over the app's other controls exactly
          // as a curve row's sample does, so it goes stale the same way.
          const control = this.findControlByPath(panel.controls, path);
          if (control?.type === 'select' && control.preview !== value.preview) {
            control.preview = value.preview;
            changed = true;
          }
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !this.isSpringConfig(value) && !this.isEasingConfig(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isNumberConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isFilterConfig(value) && !this.isGalleryConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value) && !this.isFileConfig(value)) {
          visit(value as TweakConfig, path);
        }
      }
    };

    visit(config, '');
    if (changed) this.notifyControlState(panelId);
  }

  savePreset(panelId: string, name: string): string {
    const panel = this.panels.get(panelId);
    if (!panel) throw new Error(`Panel ${panelId} not found`);

    const id = `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const preset: Preset = {
      id,
      name,
      values: { ...panel.values },
    };

    const existing = this.presets.get(panelId) ?? [];
    this.presets.set(panelId, [...existing, preset]);
    this.activePreset.set(panelId, id);

    // Force re-render by creating new snapshot reference
    this.snapshots.set(panelId, { ...panel.values });
    this.notify(panelId);

    return id;
  }

  loadPreset(panelId: string, presetId: string): void {
    const panel = this.panels.get(panelId);
    if (!panel) return;

    const presets = this.presets.get(panelId) ?? [];
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    // Apply preset values
    this.replaceValues(panel, preset.values);
    this.snapshots.set(panelId, { ...panel.values });
    this.activePreset.set(panelId, presetId);
    this.savePanelValues(panelId);
    this.notify(panelId);
  }

  deletePreset(panelId: string, presetId: string): void {
    const presets = this.presets.get(panelId) ?? [];
    this.presets.set(panelId, presets.filter(p => p.id !== presetId));

    // Clear active if deleted
    if (this.activePreset.get(panelId) === presetId) {
      this.activePreset.set(panelId, null);
    }

    // Force re-render by creating new snapshot reference
    const panel = this.panels.get(panelId);
    if (panel) {
      this.snapshots.set(panelId, { ...panel.values });
    }
    this.notify(panelId);
  }

  getPresets(panelId: string): Preset[] {
    return this.presets.get(panelId) ?? [];
  }

  getActivePresetId(panelId: string): string | null {
    const provider = this.getPresetProvider(panelId);
    if (provider) return provider.activeId ?? null;
    return this.activePreset.get(panelId) ?? null;
  }

  clearActivePreset(panelId: string): void {
    const panel = this.panels.get(panelId);
    const base = this.baseValues.get(panelId);
    if (panel && base) {
      this.replaceValues(panel, base);
      this.snapshots.set(panelId, { ...panel.values });
    }
    this.activePreset.set(panelId, null);
    this.notify(panelId);
  }

  /**
   * Install (or clear) a host-owned preset provider. Safe to call on every
   * host render: the object is always swapped so `onSelect`/`onCreate`/
   * `onDelete` never close over stale host state, but listeners are only
   * notified when the visible data (list, active id) actually changed.
   */
  setPresetProvider(panelId: string, provider: PresetProvider | null | undefined): void {
    const entry = this.presetProviders.get(panelId);

    if (!provider) {
      if (!entry) return;
      this.presetProviders.delete(panelId);
    } else {
      // No referential fast path: Solid hosts pass one stable object whose
      // getters yield fresh data, so content must always be re-serialized.
      const serialized = JSON.stringify(provider);
      this.presetProviders.set(panelId, { provider, serialized });
      if (entry?.serialized === serialized) return; // callbacks refreshed silently
    }

    // Force re-render by creating new snapshot reference
    const panel = this.panels.get(panelId);
    if (panel) {
      this.snapshots.set(panelId, { ...panel.values });
    }
    this.notify(panelId);
  }

  getPresetProvider(panelId: string): PresetProvider | null {
    return this.presetProviders.get(panelId)?.provider ?? null;
  }

  /**
   * Hide (or restore) a panel's preset toolbar. For the secondary panels of a
   * multi-panel app — a rack of per-voice columns, say — where a snapshot
   * means the whole instrument and so belongs to one panel only. Hiding the
   * toolbar hides its add and copy buttons with it: the header of a panel that
   * does not own presets is bare.
   */
  setPresetsHidden(panelId: string, hidden: boolean): void {
    const had = this.presetsHidden.has(panelId);
    if (hidden === had) return;
    if (hidden) this.presetsHidden.add(panelId);
    else this.presetsHidden.delete(panelId);
    this.notify(panelId);
  }

  arePresetsHidden(panelId: string): boolean {
    return this.presetsHidden.has(panelId);
  }

  /** Provider mode hides the implicit "Version 1" base row — the host owns the whole list. */
  hasPresetProvider(panelId: string): boolean {
    return this.presetProviders.has(panelId);
  }

  /** The dropdown rows in host order, from the provider when one is set. */
  getPresetItems(panelId: string): PresetItem[] {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      return provider.presets.map((p) => ({
        id: p.id,
        name: p.label,
        deletable: !!provider.onDelete && !p.readonly,
        renamable: !!provider.onRename && !p.readonly,
      }));
    }
    return this.getPresets(panelId).map((p) => ({ id: p.id, name: p.name, deletable: true, renamable: true }));
  }

  /**
   * Row clicked. Stock mode loads the snapshot (null = back to base values);
   * provider mode hands the id to the host, which applies values itself.
   */
  selectPreset(panelId: string, presetId: string | null): void {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      if (presetId) void provider.onSelect(presetId);
      return;
    }
    if (presetId) this.loadPreset(panelId, presetId);
    else this.clearActivePreset(panelId);
  }

  /**
   * "+" pressed. Stock mode snapshots into "Version N" (N counts the implicit
   * base as version 1); provider mode suggests the matching "Preset N" label.
   */
  createPreset(panelId: string): void {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      void provider.onCreate(`Preset ${provider.presets.length + 1}`);
      return;
    }
    this.savePreset(panelId, `Version ${this.getPresets(panelId).length + 2}`);
  }

  /** Trash icon pressed on a row (only rendered when the item is deletable). */
  removePreset(panelId: string, presetId: string): void {
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      void provider.onDelete?.(presetId);
      return;
    }
    this.deletePreset(panelId, presetId);
  }

  /** Rename a preset (toolbar inline edit). Provider mode hands the new name
   * to the host; stock mode edits the store's own snapshot list. */
  renamePreset(panelId: string, presetId: string, name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    const provider = this.getPresetProvider(panelId);
    if (provider) {
      void provider.onRename?.(presetId, trimmed);
      return;
    }
    const preset = (this.presets.get(panelId) ?? []).find((p) => p.id === presetId);
    if (!preset) return;
    preset.name = trimmed;
    const panel = this.panels.get(panelId);
    if (panel) this.snapshots.set(panelId, { ...panel.values });
    this.notify(panelId);
  }

  resolveShortcutTarget(key: string, modifier?: 'alt' | 'shift' | 'meta'): {
    panelId: string;
    path: string;
    control: ControlMeta;
  } | null {
    for (const panel of this.panels.values()) {
      for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
        if (!shortcut.key) continue; // skip keyless shortcuts
        if (shortcut.key.toLowerCase() !== key.toLowerCase()) continue;
        const scMod = shortcut.modifier ?? undefined;
        if (scMod !== modifier) continue;

        const control = this.findControlByPath(panel.controls, path);
        if (control) {
          return { panelId: panel.id, path, control };
        }
      }
    }
    return null;
  }

  resolveScrollOnlyTargets(): Array<{
    panelId: string;
    path: string;
    control: ControlMeta;
    shortcut: ShortcutConfig;
  }> {
    const results: Array<{ panelId: string; path: string; control: ControlMeta; shortcut: ShortcutConfig }> = [];
    for (const panel of this.panels.values()) {
      for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
        if ((shortcut.interaction ?? 'scroll') !== 'scroll-only') continue;
        const control = this.findControlByPath(panel.controls, path);
        if (control) {
          results.push({ panelId: panel.id, path, control, shortcut });
        }
      }
    }
    return results;
  }

  private findControlByPath(controls: ControlMeta[], path: string): ControlMeta | null {
    for (const control of controls) {
      if (control.path === path) return control;
      if (control.type === 'folder' && control.children) {
        const found = this.findControlByPath(control.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  private notify(panelId: string): void {
    this.listeners.get(panelId)?.forEach(fn => fn());
  }

  private notifyGlobal(): void {
    this.globalListeners.forEach(fn => fn());
  }

  private initTransitionModes(config: TweakConfig, prefix: string, values: Record<string, TweakValue>): void {
    for (const [key, value] of Object.entries(config)) {
      if (key === '_collapsed' || key === '_collapsible' || key === '_tabs') continue;
      const path = prefix ? `${prefix}.${key}` : key;

      if (this.isEasingConfig(value)) {
        values[`${path}.__mode`] = 'easing';
      } else if (this.isSpringConfig(value)) {
        // Detect physics mode from config
        const hasPhysics = value.stiffness !== undefined || value.damping !== undefined || value.mass !== undefined;
        const hasTime = value.visualDuration !== undefined || value.bounce !== undefined;
        values[`${path}.__mode`] = hasPhysics && !hasTime ? 'advanced' : 'simple';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isNumberConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isFilterConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value) && !this.isCurveConfig(value)) {
        this.initTransitionModes(value as TweakConfig, path, values);
      }
    }
  }

  private parseConfig(config: TweakConfig, prefix: string, shortcuts?: Record<string, ShortcutConfig>): ControlMeta[] {
    const controls: ControlMeta[] = [];

    for (const [key, value] of Object.entries(config)) {
      // `_collapsed` is UI-only metadata; `_enabled` IS a value (it lives in the
      // folder's flat values) but renders as the module header switch, never as
      // a child control row.
      if (key === '_collapsed' || key === '_collapsible' || key === '_tabs' || key === '_enabled') continue;
      const path = prefix ? `${prefix}.${key}` : key;
      const label = this.formatLabel(key);
      const shortcut = shortcuts?.[path];

      if (Array.isArray(value) && value.length <= 4 && typeof value[0] === 'number') {
        // Range tuple: [default, min, max]. The numeric-first guard rules out a
        // ListItemValue[] at runtime; assert the tuple shape so TS narrows too.
        const tuple = value as [number, number, number, number?];
        controls.push({
          type: 'slider',
          path,
          label,
          min: tuple[1],
          max: tuple[2],
          step: tuple[3] ?? this.inferStep(tuple[1], tuple[2]),
          shortcut,
        });
      } else if (typeof value === 'number') {
        // Single number - auto-infer range
        const { min, max, step } = this.inferRange(value);
        controls.push({ type: 'slider', path, label, min, max, step, shortcut });
      } else if (this.isSliderConfig(value)) {
        controls.push({
          type: 'slider',
          path,
          label,
          min: value.min,
          max: value.max,
          moveVisual: value.moveVisual,
          step: value.step ?? this.inferStep(value.min, value.max),
          unit: value.unit,
          formatValue: value.formatValue,
          origin: value.origin,
          bipolar: value.bipolar,
          orientation: value.orientation,
          shortcut,
        });
      } else if (this.isNumberConfig(value)) {
        controls.push({
          type: 'number',
          path,
          label,
          min: value.min,
          max: value.max,
          step: value.step ?? this.inferRange(value.default).step,
          unit: value.unit,
          formatValue: value.formatValue,
          orientation: value.orientation,
          shortcut,
        });
      } else if (typeof value === 'boolean') {
        controls.push({ type: 'toggle', path, label, shortcut });
      } else if (this.isSpringConfig(value) || this.isEasingConfig(value)) {
        controls.push({ type: 'transition', path, label });
      } else if (this.isActionConfig(value)) {
        controls.push({ type: 'action', path, label: (value as ActionConfig).label || label, caption: (value as ActionConfig).caption });
      } else if (this.isSelectConfig(value)) {
        controls.push({ type: 'select', path, label, options: value.options, display: value.display, preview: value.preview, moveVisual: value.moveVisual });
      } else if (this.isColorConfig(value)) {
        controls.push({ type: 'color', path, label, alpha: value.alpha, palette: value.palette });
      } else if (this.isGradientConfig(value)) {
        controls.push({ type: 'gradient', path, label });
      } else if (this.isXYConfig(value)) {
        controls.push({ type: 'xy', path, label, xAxis: value.x, yAxis: value.y, grid: value.grid, density: value.density, snap: value.snap, returnToCenter: value.returnToCenter, showValues: value.showValues });
      } else if (this.isFilterConfig(value)) {
        // No `shortcut`: a filter value is {cutoff,resonance}, which the
        // numeric-nudge shortcut path can't drive (the range precedent).
        controls.push({ type: 'filter', path, label, cutoffAxis: value.cutoff, resonanceAxis: value.resonance, response: value.response, filterEnabled: value.enabled });
      } else if (this.isTextConfig(value)) {
        controls.push({ type: 'text', path, label, placeholder: value.placeholder });
      } else if (this.isRangeConfig(value)) {
        // No `shortcut`: a range value is {min,max}, which the numeric-nudge
        // shortcut path can't drive, and RangeSlider has no shortcut prop.
        controls.push({ type: 'range', path, label, min: value.min, max: value.max,
          step: value.step ?? this.inferStep(value.min, value.max),
          rangeDefault: value.default ?? { min: value.min, max: value.max } });
      } else if (this.isGalleryConfig(value)) {
        controls.push({ type: 'gallery', path, label, items: value.items, columns: value.columns });
      } else if (this.isFileConfig(value)) {
        controls.push({ type: 'file', path, label, accept: value.accept, multiple: value.multiple });
      } else if (this.isSwatchConfig(value)) {
        controls.push({ type: 'swatch', path, label, swatchOptions: value.options });
      } else if (this.isChipsConfig(value)) {
        controls.push({ type: 'chips', path, label, chipOptions: value.options });
      } else if (this.isMultiSelectConfig(value)) {
        controls.push({ type: 'multiselect', path, label, multiSelectOptions: value.options });
      } else if (this.isListConfig(value)) {
        controls.push({ type: 'list', path, label, itemTypes: value.itemTypes, addLabel: value.addLabel, maxItems: value.max });
      } else if (this.isCurveConfig(value)) {
        controls.push({
          type: 'curve',
          path,
          label: typeof value.label === 'string' ? value.label : label,
          hideLabel: value.label === false || undefined,
          sample: value.sample,
          domain: value.domain,
          markers: value.markers,
          height: value.height,
          aspect: value.aspect,
        });
      } else if (this.isAnalyserConfig(value)) {
        controls.push({
          type: 'analyser',
          path,
          label: typeof value.label === 'string' ? value.label : label,
          hideLabel: value.label === false || undefined,
          height: value.height,
          analyserRow: value,
        });
      } else if (typeof value === 'string') {
        // Auto-detect: hex color vs text. Alpha digits in the default
        // (#rgba / #rrggbbaa) opt the control into the alpha slider.
        if (this.isHexColor(value)) {
          const hasAlpha = value.length === 5 || value.length === 9;
          controls.push({ type: 'color', path, label, alpha: hasAlpha || undefined });
        } else {
          controls.push({ type: 'text', path, label });
        }
      } else if (typeof value === 'object' && value !== null) {
        // Nested object becomes a folder
        const folderConfig = value as TweakConfig;
        const module = '_enabled' in folderConfig ? true : undefined;
        // `_collapsible: false` renders a plain always-open section header.
        // Module collapse is functional (the switch), so modules ignore it.
        const collapsible = !module && folderConfig._collapsible === false ? false : undefined;
        const defaultOpen = collapsible === false
          ? true
          : '_collapsed' in folderConfig ? !(folderConfig._collapsed as boolean) : true;
        controls.push({
          type: 'folder',
          path,
          label,
          defaultOpen,
          collapsible,
          module,
          children: this.parseConfig(folderConfig, path, shortcuts),
        });
      }
    }

    // `_tabs: true` at the panel root promotes every top-level folder to a tab:
    // the folder headers give way to one segmented bar in the panel header, and
    // only the active tab's rows render. Root-only — a nested `_tabs` is just
    // stripped. Any loose top-level control stays in the body above the tabs.
    if (prefix === '' && config._tabs === true) {
      // An empty tab must not exist, so a folder with no rows is dropped rather
      // than shown as a reachable, blank page.
      const isFolder = (control: ControlMeta) => control.type === 'folder';
      const tabs = controls.filter((control) => isFolder(control) && (control.children?.length ?? 0) > 0);

      if (tabs.length > 0) {
        for (const tab of tabs) tab.tab = true;
        return [
          {
            type: 'select',
            path: TAB_PATH,
            label: 'Tab',
            display: 'segmented',
            tabBar: true,
            options: tabs.map((tab) => tab.path),
          },
          ...controls.filter((control) => !isFolder(control)),
          ...tabs,
        ];
      }
    }

    return controls;
  }

  /**
   * Swaps a panel's whole value map, keeping the open tab. Which tab you are
   * reading is a place, not a parameter: a preset should change the sound, not
   * move you to another page of the panel.
   */
  private replaceValues(panel: PanelConfig, values: Record<string, TweakValue>): void {
    const openTab = panel.values[TAB_PATH];
    panel.values = { ...values };
    if (openTab !== undefined) panel.values[TAB_PATH] = openTab;
  }

  /**
   * Seeds the active tab. It is a real value, not component state, so a config
   * rebuild preserves the reader's place — and `normalizePreservedValue` resets
   * it through the select's options when the tab it named is gone.
   */
  private initTabValue(controls: ControlMeta[], values: Record<string, TweakValue>): void {
    const tabBar = controls.find((control) => control.tabBar);
    if (!tabBar) return;
    values[TAB_PATH] = (tabBar.options?.[0] as string) ?? '';
  }

  private flattenValues(config: TweakConfig, prefix: string): Record<string, TweakValue> {
    const values: Record<string, TweakValue> = {};

    for (const [key, value] of Object.entries(config)) {
      if (key === '_collapsed' || key === '_collapsible' || key === '_tabs') continue;
      const path = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value) && value.length <= 4 && typeof value[0] === 'number') {
        values[path] = value[0]; // Default value
      } else if (this.isSliderConfig(value) || this.isNumberConfig(value)) {
        values[path] = value.default;
      } else if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
        values[path] = value;
      } else if (this.isSpringConfig(value) || this.isEasingConfig(value)) {
        values[path] = value;
      } else if (this.isActionConfig(value)) {
        // Actions don't need stored values - they're just triggers
        values[path] = value;
      } else if (this.isSelectConfig(value)) {
        // Use default or first option's value
        const firstOption = value.options[0];
        const firstValue = typeof firstOption === 'string' ? firstOption : firstOption.value;
        values[path] = value.default ?? firstValue;
      } else if (this.isColorConfig(value)) {
        values[path] = value.default ?? '#000000';
      } else if (this.isGradientConfig(value)) {
        values[path] = normalizeGradient(value.default ?? DEFAULT_GRADIENT);
      } else if (this.isXYConfig(value)) {
        // Clamp/snap the config default into range up front (defaults might be
        // out of range or partial); missing components fall back to each axis origin.
        const xAxis = resolveAxis(value.x);
        const yAxis = resolveAxis(value.y);
        values[path] = normalizeXYValue(value.default, xAxis, yAxis, value.snap ?? false);
      } else if (this.isTextConfig(value)) {
        values[path] = value.default ?? '';
      } else if (this.isRangeConfig(value)) {
        values[path] = value.default ?? { min: value.min, max: value.max };
      } else if (this.isFilterConfig(value)) {
        // Clamp/snap the config default into both axes up front; missing hands
        // fall back to the open filter (cutoff max, resonance min).
        values[path] = normalizeFilterValue(
          value.default,
          resolveFilterAxis(value.cutoff, 'cutoff'),
          resolveFilterAxis(value.resonance, 'resonance')
        );
      } else if (this.isGalleryConfig(value)) {
        // Resolve to the selected item id — default, else the first item.
        values[path] = value.default ?? value.items[0]?.id ?? '';
      } else if (this.isFileConfig(value)) {
        // The File itself rides on the event channel; only the filename is stored.
        values[path] = '';
      } else if (this.isSwatchConfig(value)) {
        values[path] = value.default ?? value.options[0]?.value ?? '';
      } else if (this.isChipsConfig(value)) {
        values[path] = value.default ?? value.options[0]?.value ?? '';
      } else if (this.isMultiSelectConfig(value)) {
        // Unlike single-value pickers there is no natural first choice; the
        // empty selection is a legitimate state.
        values[path] = value.default ?? [];
      } else if (this.isListConfig(value)) {
        values[path] = normalizeListItems(value);
      } else if (this.isCurveConfig(value)) {
        // Display-only: no value, so nothing to persist, preset, or resolve.
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(values, this.flattenValues(value as TweakConfig, path));
      }
    }

    return values;
  }

  private isSpringConfig(value: unknown): value is SpringConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as SpringConfig).type === 'spring'
    );
  }

  private isEasingConfig(value: unknown): value is EasingConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as EasingConfig).type === 'easing'
    );
  }

  private isActionConfig(value: unknown): value is ActionConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as ActionConfig).type === 'action'
    );
  }

  private isSelectConfig(value: unknown): value is SelectConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as SelectConfig).type === 'select' &&
      'options' in value &&
      Array.isArray((value as SelectConfig).options)
    );
  }

  private isColorConfig(value: unknown): value is ColorConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as ColorConfig).type === 'color'
    );
  }

  private isGradientConfig(value: unknown): value is GradientConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as GradientConfig).type === 'gradient'
    );
  }

  // Explicit { type: 'xy' } only — a bare { x, y } object would collide with the
  // "nested object → folder" fallback, so the shorthand is deliberately unsupported.
  private isXYConfig(value: unknown): value is XYConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as XYConfig).type === 'xy'
    );
  }

  private isFilterConfig(value: unknown): value is FilterConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as FilterConfig).type === 'filter'
    );
  }

  private isRangeConfig(value: unknown): value is RangeConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as RangeConfig).type === 'range'
    );
  }

  // A stored range VALUE ({min,max} numbers), as opposed to a range config.
  // Used to preserve the leaf value by identity across a panel update.
  private isRangeValue(value: unknown): value is RangeValue {
    return (
      typeof value === 'object' &&
      value !== null &&
      typeof (value as RangeValue).min === 'number' &&
      typeof (value as RangeValue).max === 'number'
    );
  }

  private isTextConfig(value: unknown): value is TextConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as TextConfig).type === 'text'
    );
  }

  private isGalleryConfig(value: unknown): value is GalleryConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as GalleryConfig).type === 'gallery' &&
      'items' in value &&
      Array.isArray((value as GalleryConfig).items)
    );
  }

  private isFileConfig(value: unknown): value is FileConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as FileConfig).type === 'file'
    );
  }

  private isSwatchConfig(value: unknown): value is SwatchConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as SwatchConfig).type === 'swatch' &&
      'options' in value &&
      Array.isArray((value as SwatchConfig).options)
    );
  }

  private isChipsConfig(value: unknown): value is ChipsConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as ChipsConfig).type === 'chips' &&
      'options' in value &&
      Array.isArray((value as ChipsConfig).options)
    );
  }

  private isMultiSelectConfig(value: unknown): value is MultiSelectConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as MultiSelectConfig).type === 'multiselect' &&
      'options' in value &&
      Array.isArray((value as MultiSelectConfig).options)
    );
  }

  private isSliderConfig(value: unknown): value is SliderConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as SliderConfig).type === 'slider' &&
      typeof (value as SliderConfig).min === 'number' &&
      typeof (value as SliderConfig).max === 'number'
    );
  }

  private isNumberConfig(value: unknown): value is NumberConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as NumberConfig).type === 'number' &&
      typeof (value as NumberConfig).default === 'number'
    );
  }

  private isAnalyserConfig(value: unknown): value is AnalyserConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as AnalyserConfig).type === 'analyser' &&
      typeof (value as AnalyserConfig).analyser === 'function'
    );
  }

  private isCurveConfig(value: unknown): value is CurveConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as CurveConfig).type === 'curve' &&
      typeof (value as CurveConfig).sample === 'function'
    );
  }

  private isListConfig(value: unknown): value is ListConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      (value as ListConfig).type === 'list' &&
      'itemTypes' in value &&
      typeof (value as ListConfig).itemTypes === 'object'
    );
  }

  private isHexColor(value: string): boolean {
    return HEX_COLOR_REGEX.test(value);
  }

  private formatLabel(key: string): string {
    // Convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private inferRange(value: number): { min: number; max: number; step: number } {
    // Infer reasonable range based on value
    if (value >= 0 && value <= 1) {
      return { min: 0, max: 1, step: 0.01 };
    } else if (value >= 0 && value <= 10) {
      return { min: 0, max: value * 3 || 10, step: 0.1 };
    } else if (value >= 0 && value <= 100) {
      return { min: 0, max: value * 3 || 100, step: 1 };
    } else if (value >= 0) {
      return { min: 0, max: value * 3 || 1000, step: 10 };
    } else {
      return { min: value * 3, max: -value * 3, step: 1 };
    }
  }

  private inferStep(min: number, max: number): number {
    const range = max - min;
    if (range <= 1) return 0.01;
    if (range <= 10) return 0.1;
    if (range <= 100) return 1;
    return 10;
  }

  private normalizePreservedValue(
    existingValue: TweakValue | undefined,
    defaultValue: TweakValue,
    control: ControlMeta | undefined
  ): TweakValue {
    if (existingValue === undefined || !control) {
      return defaultValue;
    }

    switch (control.type) {
      case 'slider':
      case 'number': {
        if (typeof existingValue !== 'number' || typeof defaultValue !== 'number') {
          return defaultValue;
        }

        const min = control.min ?? Number.NEGATIVE_INFINITY;
        const max = control.max ?? Number.POSITIVE_INFINITY;
        const clamped = Math.min(max, Math.max(min, existingValue));

        if (typeof control.step !== 'number' || control.step <= 0) {
          return clamped;
        }

        return this.roundToStep(clamped, min, max, control.step);
      }
      case 'toggle':
        return typeof existingValue === 'boolean' ? existingValue : defaultValue;
      case 'select': {
        if (typeof existingValue !== 'string') {
          return defaultValue;
        }

        const options = control.options ?? [];
        const validValues = new Set(options.map((option) => (typeof option === 'string' ? option : option.value)));
        return validValues.has(existingValue) ? existingValue : defaultValue;
      }
      case 'swatch': {
        if (typeof existingValue !== 'string') {
          return defaultValue;
        }
        const validValues = new Set((control.swatchOptions ?? []).map((option) => option.value));
        return validValues.has(existingValue) ? existingValue : defaultValue;
      }
      case 'chips': {
        if (typeof existingValue !== 'string') {
          return defaultValue;
        }
        const validValues = new Set((control.chipOptions ?? []).map((option) => option.value));
        return validValues.has(existingValue) ? existingValue : defaultValue;
      }
      case 'multiselect': {
        // Drop selections whose option vanished from the config; a lost shape
        // falls back to the default. An empty result is kept — it's a real state.
        if (!Array.isArray(existingValue) || existingValue.some((v) => typeof v !== 'string')) {
          return defaultValue;
        }
        const validValues = new Set((control.multiSelectOptions ?? []).map((option) => option.value));
        return (existingValue as string[]).filter((v) => validValues.has(v));
      }
      case 'color': {
        if (typeof existingValue !== 'string' || !this.isHexColor(existingValue)) {
          return defaultValue;
        }
        // Config dropped alpha: reconcile stored 8-digit values back to opaque hex.
        if (!control.alpha && (existingValue.length === 5 || existingValue.length === 9)) {
          return existingValue.length === 9 ? existingValue.slice(0, 7) : existingValue.slice(0, 4);
        }
        // Config gained alpha: uphold the #rrggbbaa invariant from load, not first edit.
        if (control.alpha && (existingValue.length === 4 || existingValue.length === 7)) {
          return existingValue + (existingValue.length === 7 ? 'ff' : 'f');
        }
        return existingValue;
      }
      case 'gradient': {
        // Deep-normalize a preserved value (covers alpha/position/sort drift in
        // hand-edited presets); fall back to the default when the shape is lost.
        if (typeof existingValue !== 'object' || existingValue === null || !Array.isArray((existingValue as GradientValue).stops)) {
          return defaultValue;
        }
        return normalizeGradient(existingValue);
      }
      case 'xy': {
        // Re-clamp a preserved point against the (possibly edited) axes; a lost
        // shape falls back to the default. snap intentionally off here so a
        // continuous pad keeps sub-step precision across config edits.
        if (typeof existingValue !== 'object' || existingValue === null || Array.isArray(existingValue)) {
          return defaultValue;
        }
        const candidate = existingValue as Partial<XYValue>;
        if (typeof candidate.x !== 'number' || typeof candidate.y !== 'number') {
          return defaultValue;
        }
        const xAxis = resolveAxis(control.xAxis);
        const yAxis = resolveAxis(control.yAxis);
        return normalizeXYValue(candidate, xAxis, yAxis, false);
      }
      case 'filter': {
        // Re-clamp a preserved pair against the (possibly edited) axes; a lost
        // shape falls back to the default (the range/xy precedent).
        if (typeof existingValue !== 'object' || existingValue === null || Array.isArray(existingValue)) {
          return defaultValue;
        }
        const candidate = existingValue as Partial<FilterValue>;
        if (typeof candidate.cutoff !== 'number' || typeof candidate.resonance !== 'number') {
          return defaultValue;
        }
        return normalizeFilterValue(
          candidate,
          resolveFilterAxis(control.cutoffAxis, 'cutoff'),
          resolveFilterAxis(control.resonanceAxis, 'resonance')
        );
      }
      case 'text':
      case 'file':
        return typeof existingValue === 'string' ? existingValue : defaultValue;
      case 'list':
        // Items are self-validating ({type, params}); preserve the user's array
        // across config edits, falling back to the default when shape is lost.
        return Array.isArray(existingValue) ? existingValue : defaultValue;
      case 'range': {
        // A range value is a leaf {min,max} preserved by identity (like color),
        // not a folder — never let a panel update drop it. Reconcile the stored
        // pair against (possibly changed) bounds: clamp both ends and re-order.
        if (!this.isRangeValue(existingValue)) {
          return defaultValue;
        }
        // clampRange does exactly clamp-both-ends-then-order. Missing bounds fall
        // back to ±Infinity so the clamp is a no-op there.
        const lo = control.min ?? Number.NEGATIVE_INFINITY;
        const hi = control.max ?? Number.POSITIVE_INFINITY;
        return clampRange(existingValue, lo, hi);
      }
      case 'gallery': {
        if (typeof existingValue !== 'string') {
          return defaultValue;
        }
        const validIds = new Set((control.items ?? []).map((item) => item.id));
        return validIds.has(existingValue) ? existingValue : defaultValue;
      }
      case 'transition':
        if (this.isSpringConfig(defaultValue)) {
          return this.isSpringConfig(existingValue) ? existingValue : defaultValue;
        }
        if (this.isEasingConfig(defaultValue)) {
          return this.isEasingConfig(existingValue) ? existingValue : defaultValue;
        }
        return defaultValue;
      case 'action':
        return defaultValue;
      default:
        return defaultValue;
    }
  }

  private roundToStep(value: number, min: number, max: number, step: number): number {
    const snapped = min + Math.round((value - min) / step) * step;
    const clamped = Math.min(max, Math.max(min, snapped));
    const precision = this.stepPrecision(step);
    return Number(clamped.toFixed(precision));
  }

  private stepPrecision(step: number): number {
    const text = String(step);
    const decimalIndex = text.indexOf('.');
    return decimalIndex === -1 ? 0 : text.length - decimalIndex - 1;
  }

  // Stamp path-keyed extras onto the parsed tree. A post-pass rather than
  // parseConfig parameters: these are cross-cutting metadata like shortcuts, and
  // every control — including folders and bare-shorthand sliders — is reachable
  // by path once the tree exists.
  private applyControlExtras(
    controls: ControlMeta[],
    hints?: Record<string, string>,
    affordances?: Record<string, AffordanceConfig>,
    labels?: Record<string, string>
  ): void {
    if (!hints && !affordances && !labels) return;

    for (const control of controls) {
      const hint = hints?.[control.path];
      if (hint) control.hint = hint;

      const affordance = affordances?.[control.path];
      if (affordance) control.affordance = affordance;

      // Empty strings are ignored rather than blanking the label: a caller
      // building this map from optional data would otherwise erase the derived
      // name whenever its source was missing.
      const label = labels?.[control.path];
      if (label) control.label = label;

      if (control.children) this.applyControlExtras(control.children, hints, affordances, labels);
    }
  }

  private mapControlsByPath(controls: ControlMeta[]): Map<string, ControlMeta> {
    const map = new Map<string, ControlMeta>();

    const visit = (nodes: ControlMeta[]) => {
      for (const node of nodes) {
        if (node.type === 'folder' && node.children) {
          // A module folder's `_enabled` never parses to a child control, but it
          // IS a value — register a synthetic toggle so updatePanel reconciles
          // (preserves) it across dynamic config updates like any boolean.
          if (node.module) {
            const enabledPath = `${node.path}._enabled`;
            map.set(enabledPath, { type: 'toggle', path: enabledPath, label: 'Enabled' });
          }
          visit(node.children);
          continue;
        }

        map.set(node.path, node);
      }
    };

    visit(controls);
    return map;
  }

}

// ── List item helpers ──────────────────────────────────────────────────────
// Pure, framework-agnostic so every adapter (React/Svelte/…) renders list-item
// sub-controls identically. The inference below mirrors the panel-level parsing
// in TweakStoreClass, scoped to the scalar field kinds a list item can hold.

function listHasType(value: unknown, type: string): boolean {
  return typeof value === 'object' && value !== null && 'type' in value && (value as { type: string }).type === type;
}

function listFormatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function listIsHexColor(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
}

function listInferStep(min: number, max: number): number {
  const range = max - min;
  if (range <= 1) return 0.01;
  if (range <= 10) return 0.1;
  if (range <= 100) return 1;
  return 10;
}

function listInferRange(value: number): { min: number; max: number; step: number } {
  if (value >= 0 && value <= 1) return { min: 0, max: 1, step: 0.01 };
  if (value >= 0 && value <= 10) return { min: 0, max: value * 3 || 10, step: 0.1 };
  if (value >= 0 && value <= 100) return { min: 0, max: value * 3 || 100, step: 1 };
  if (value >= 0) return { min: 0, max: value * 3 || 1000, step: 10 };
  return { min: value * 3, max: -value * 3, step: 1 };
}

/** Resolve a list item type's schema shorthand into renderable field descriptors. */
export function parseListItemSchema(
  schema: Record<string, ListItemField>,
  hints?: Record<string, string>,
  groups?: Record<string, string>
): ListField[] {
  const fields: ListField[] = [];

  for (const [key, def] of Object.entries(schema)) {
    const label = listFormatLabel(key);
    const hint = hints?.[key];
    const group = groups?.[key];

    if (Array.isArray(def) && def.length <= 4 && typeof def[0] === 'number') {
      const [d, min, max, step] = def;
      fields.push({ key, label, hint, group, kind: 'slider', min, max, step: step ?? listInferStep(min, max), defaultValue: d });
    } else if (typeof def === 'number') {
      const { min, max, step } = listInferRange(def);
      fields.push({ key, label, hint, group, kind: 'slider', min, max, step, defaultValue: def });
    } else if (typeof def === 'boolean') {
      fields.push({ key, label, hint, group, kind: 'toggle', defaultValue: def });
    } else if (listHasType(def, 'select') && Array.isArray((def as SelectConfig).options)) {
      const select = def as SelectConfig;
      const first = select.options[0];
      const firstValue = typeof first === 'string' ? first : first?.value ?? '';
      fields.push({ key, label, hint, group, kind: 'select', options: select.options, defaultValue: select.default ?? firstValue });
    } else if (listHasType(def, 'color')) {
      const color = def as ColorConfig;
      fields.push({ key, label, hint, group, kind: 'color', palette: color.palette, defaultValue: color.default ?? '#000000' });
    } else if (listHasType(def, 'swatch') && Array.isArray((def as SwatchConfig).options)) {
      const swatch = def as SwatchConfig;
      fields.push({
        key,
        label,
        hint,
        group,
        kind: 'swatch',
        swatchOptions: swatch.options,
        defaultValue: swatch.default ?? swatch.options[0]?.value ?? '',
      });
    } else if (listHasType(def, 'text')) {
      const text = def as TextConfig;
      fields.push({ key, label, hint, group, kind: 'text', placeholder: text.placeholder, defaultValue: text.default ?? '' });
    } else if (typeof def === 'string') {
      fields.push({ key, label, hint, group, kind: listIsHexColor(def) ? 'color' : 'text', defaultValue: def });
    }
  }

  return fields;
}

/** A named, collapsible section of a list row. */
export type ListFieldGroup = { label: string; fields: ListField[] };

/**
 * Split a row's fields into the flat top area and its named sections.
 *
 * Ungrouped fields stay flat so a row's primary control is always visible;
 * groups follow in the order their first field is declared, which is what the
 * renderer opens the first of and collapses the rest.
 */
export function groupListFields(fields: ListField[]): { flat: ListField[]; groups: ListFieldGroup[] } {
  const flat: ListField[] = [];
  const groups: ListFieldGroup[] = [];
  const byLabel = new Map<string, ListFieldGroup>();

  for (const field of fields) {
    if (!field.group) {
      flat.push(field);
      continue;
    }

    let group = byLabel.get(field.group);
    if (!group) {
      group = { label: field.group, fields: [] };
      byLabel.set(field.group, group);
      groups.push(group);
    }
    group.fields.push(field);
  }

  return { flat, groups };
}

/** The default params object for a freshly-added item of the given schema. */
export function defaultListItemParams(schema: Record<string, ListItemField>): Record<string, number | boolean | string> {
  const params: Record<string, number | boolean | string> = {};
  for (const field of parseListItemSchema(schema)) {
    params[field.key] = field.defaultValue;
  }
  return params;
}

/** Materialize a list config's initial rows: drop unknown types, backfill params. */
export function normalizeListItems(config: ListConfig): ListItemValue[] {
  const items = config.default ?? [];
  return items
    .filter((item) => item && typeof item.type === 'string' && config.itemTypes[item.type])
    .map((item) => {
      const row: ListItemValue = {
        type: item.type,
        params: { ...defaultListItemParams(config.itemTypes[item.type].schema), ...(item.params ?? {}) },
      };
      // Titles are free-form, so only a non-blank one is kept — an untitled row
      // must stay absent so it falls back to its item type's label.
      const title = typeof item.title === 'string' ? item.title.trim() : '';
      if (title) row.title = title;
      return row;
    });
}

// Singleton instance
export const TweakStore = new TweakStoreClass();
