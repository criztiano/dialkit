// Lightweight state store with subscriptions for dialkit

import { HEX_COLOR_REGEX } from '../color-core';
import { normalizeGradient, DEFAULT_GRADIENT, type GradientValue } from '../gradient-core';
import { resolveAxis, normalizeValue as normalizeXYValue, type XYValue } from '../xy-pad-core';
import { clampRange } from '../range-slider-core';
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
  label?: string;
};

export type SelectConfig = {
  type: 'select';
  options: (string | { value: string; label: string })[];
  default?: string;
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

export type DialValue = number | boolean | string | string[] | XYValue | SpringConfig | EasingConfig | ActionConfig | SelectConfig | SliderConfig | ColorConfig | GradientConfig | GradientValue | XYConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | MultiSelectConfig | ListConfig | ListItemValue[] | RangeConfig | RangeValue;

export type DialConfig = {
  [key: string]: DialValue | [number, number, number, number?] | DialConfig;
};

export type ResolvedValues<T extends DialConfig> = {
  [K in keyof T]: T[K] extends [number, number, number, number?]
    ? number
    : T[K] extends SliderConfig
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
                          : T[K] extends DialConfig
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
 * How lit the affordance dot is. The app pushes this — dialkit owns only how
 * each state looks, never when it applies.
 */
export type AffordanceStatus = 'off' | 'armed' | 'active';

/** What dialkit hands a popover so it doesn't have to resolve any of it itself. */
export type AffordanceContext = {
  panelId: string;
  path: string;
  status: AffordanceStatus;
  /** Shorthand for `DialStore.setAffordanceStatus(panelId, path, …)`. */
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
  type: 'slider' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'gradient' | 'xy' | 'text' | 'range' | 'gallery' | 'file' | 'swatch' | 'chips' | 'multiselect' | 'list';
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
  options?: (string | { value: string; label: string })[];
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
  shortcut?: ShortcutConfig;
};

export type PanelConfig = {
  id: string;
  name: string;
  controls: ControlMeta[];
  values: Record<string, DialValue>;
  shortcuts: Record<string, ShortcutConfig>;
  /** Help text by control path, retained so a later updatePanel can restate it. */
  hints?: Record<string, string>;
  /** Affordances by control path, retained on the same terms as `hints`. */
  affordances?: Record<string, AffordanceConfig>;
  /** Label overrides by control path, retained on the same terms as `hints`. */
  labels?: Record<string, string>;
  kind?: 'timeline';
};

type Listener = () => void;
type ActionListener = (action: string) => void;

/**
 * Non-value events emitted by controls (file picked, chip removed, list mutated).
 * Delivered through the generic `onEvent(path, event)` channel so the value layer
 * stays JSON-serializable (a File is never stored — it rides on a file event).
 */
export type DialEvent =
  | { kind: 'file'; files: FileList }
  | { kind: 'remove'; value: string }
  | { kind: 'list'; op: 'add' | 'remove' | 'move' | 'set' | 'rename'; index?: number; from?: number; to?: number; itemType?: string };

type EventListener = (path: string, event: DialEvent) => void;

export type Preset = {
  id: string;
  name: string;
  values: Record<string, DialValue>;
};

// Stable empty object for unregistered panels (React 19 useSyncExternalStore requirement)
const EMPTY_VALUES: Record<string, DialValue> = Object.freeze({});

// Persistence option shape shared with the timeline adapter. When truthy AND
// the panel has a stable `id`, the panel's flat values are saved to (and
// restored from) browser storage — fail-soft, node-safe (see ./persist).
// `retainOnUnmount` is still accepted for API parity but not acted on here.
export type DialKitPersistOptions = boolean | {
  key?: string;
  storage?: 'localStorage' | 'sessionStorage';
  presets?: boolean;
};

export type DialStorePanelOptions = {
  retainOnUnmount?: boolean;
  persist?: DialKitPersistOptions;
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
  /** Timeline panels render in DialTimeline and are filtered out of the panel dock. */
  kind?: 'timeline';
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
  return `dialkit-hint-${scope}-${path}`.replace(/\s+/g, '-');
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
export function resolveDialValues<T extends DialConfig>(
  config: T,
  flatValues: Record<string, DialValue>
): ResolvedValues<T> {
  return resolveConfigValues(config, flatValues, '') as ResolvedValues<T>;
}

function resolveConfigValues(
  config: DialConfig,
  flatValues: Record<string, DialValue>,
  prefix: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, configValue] of Object.entries(config)) {
    if (key === '_collapsed') continue;
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
    } else if (typeof configValue === 'object' && configValue !== null) {
      result[key] = resolveConfigValues(configValue as DialConfig, flatValues, path);
    }
  }

  return result;
}

class DialStoreClass {
  private panels: Map<string, PanelConfig> = new Map();
  private listeners: Map<string, Set<Listener>> = new Map();
  private globalListeners: Set<Listener> = new Set();
  private snapshots: Map<string, Record<string, DialValue>> = new Map();
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
  private baseValues: Map<string, Record<string, DialValue>> = new Map();
  // Resolved storage target per panel (null = persistence off). Absent = not
  // yet registered.
  private persistTargets: Map<string, PersistTarget | null> = new Map();

  registerPanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>, options: DialStorePanelOptions = {}): void {
    const existingPanel = this.panels.get(id);
    if (existingPanel && existingPanel.kind !== options.kind) {
      console.warn(
        `[dialkit] Panel id "${id}" cannot be shared by a timeline and a standard panel; ` +
        `the most recent registration controls where it renders.`
      );
    }

    const target = resolvePersistTarget('panel', id, options.persist);
    this.persistTargets.set(id, target);

    const controls = this.parseConfig(config, '', shortcuts);
    this.applyControlExtras(controls, options.hints, options.affordances, options.labels);
    const values = this.flattenValues(config, '');

    // Set initial transition modes based on config types
    this.initTransitionModes(config, '', values);

    // Overlay persisted values onto the config defaults, but only for keys the
    // current config still declares — a renamed/removed control drops its
    // stale saved value instead of resurrecting it.
    this.overlayPersistedValues(target, values);

    this.panels.set(id, { id, name, controls, values, shortcuts: shortcuts ?? {}, hints: options.hints, affordances: options.affordances, labels: options.labels, kind: options.kind });
    this.snapshots.set(id, { ...values });
    this.baseValues.set(id, { ...values });
    this.notifyGlobal();
  }

  updatePanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>, options: DialStorePanelOptions = {}): void {
    const existing = this.panels.get(id);
    if (!existing) {
      this.registerPanel(id, name, config, shortcuts, options);
      return;
    }

    const hints = options.hints ?? existing.hints;
    const affordances = options.affordances ?? existing.affordances;
    const labels = options.labels ?? existing.labels;
    const controls = this.parseConfig(config, '', shortcuts);
    this.applyControlExtras(controls, hints, affordances, labels);
    const controlsByPath = this.mapControlsByPath(controls);
    const defaultValues = this.flattenValues(config, '');
    const nextValues: Record<string, DialValue> = {};

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

    const nextPanel: PanelConfig = { id, name, controls, values: nextValues, shortcuts: shortcuts ?? existing.shortcuts, hints, affordances, labels, kind: options.kind ?? existing.kind };
    this.panels.set(id, nextPanel);
    this.snapshots.set(id, { ...nextValues });

    const previousBaseValues = this.baseValues.get(id) ?? {};
    const nextBaseValues: Record<string, DialValue> = {};
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
    this.notifyGlobal();
  }

  // Overlay saved values onto freshly-computed defaults, in place. Only keys
  // that still exist in `values` (i.e. the current config) are restored.
  private overlayPersistedValues(target: PersistTarget | null, values: Record<string, DialValue>): void {
    const persisted = loadPersisted<Record<string, DialValue>>(target);
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

  updateValue(panelId: string, path: string, value: DialValue): void {
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
  updateValues(panelId: string, updates: Record<string, DialValue>): void {
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

  getValue(panelId: string, path: string): DialValue | undefined {
    const panel = this.panels.get(panelId);
    return panel?.values[path];
  }

  getValues(panelId: string): Record<string, DialValue> {
    // Return the snapshot for useSyncExternalStore compatibility
    // Use stable EMPTY_VALUES to avoid infinite loop in React 19
    return this.snapshots.get(panelId) ?? EMPTY_VALUES;
  }

  getPanels(kind?: 'panel' | 'timeline'): PanelConfig[] {
    const all = Array.from(this.panels.values());
    if (kind === 'panel') return all.filter((panel) => panel.kind !== 'timeline');
    if (kind === 'timeline') return all.filter((panel) => panel.kind === 'timeline');
    return all;
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

  emitEvent(panelId: string, path: string, event: DialEvent): void {
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
    panel.values = { ...preset.values };
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
    return this.activePreset.get(panelId) ?? null;
  }

  clearActivePreset(panelId: string): void {
    const panel = this.panels.get(panelId);
    const base = this.baseValues.get(panelId);
    if (panel && base) {
      panel.values = { ...base };
      this.snapshots.set(panelId, { ...panel.values });
    }
    this.activePreset.set(panelId, null);
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

  private initTransitionModes(config: DialConfig, prefix: string, values: Record<string, DialValue>): void {
    for (const [key, value] of Object.entries(config)) {
      if (key === '_collapsed') continue;
      const path = prefix ? `${prefix}.${key}` : key;

      if (this.isEasingConfig(value)) {
        values[`${path}.__mode`] = 'easing';
      } else if (this.isSpringConfig(value)) {
        // Detect physics mode from config
        const hasPhysics = value.stiffness !== undefined || value.damping !== undefined || value.mass !== undefined;
        const hasTime = value.visualDuration !== undefined || value.bounce !== undefined;
        values[`${path}.__mode`] = hasPhysics && !hasTime ? 'advanced' : 'simple';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isSliderConfig(value) && !this.isColorConfig(value) && !this.isGradientConfig(value) && !this.isXYConfig(value) && !this.isTextConfig(value) && !this.isRangeConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isMultiSelectConfig(value) && !this.isListConfig(value)) {
        this.initTransitionModes(value as DialConfig, path, values);
      }
    }
  }

  private parseConfig(config: DialConfig, prefix: string, shortcuts?: Record<string, ShortcutConfig>): ControlMeta[] {
    const controls: ControlMeta[] = [];

    for (const [key, value] of Object.entries(config)) {
      if (key === '_collapsed') continue;
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
          step: value.step ?? this.inferStep(value.min, value.max),
          unit: value.unit,
          formatValue: value.formatValue,
          origin: value.origin,
          bipolar: value.bipolar,
          shortcut,
        });
      } else if (typeof value === 'boolean') {
        controls.push({ type: 'toggle', path, label, shortcut });
      } else if (this.isSpringConfig(value) || this.isEasingConfig(value)) {
        controls.push({ type: 'transition', path, label });
      } else if (this.isActionConfig(value)) {
        controls.push({ type: 'action', path, label: (value as ActionConfig).label || label });
      } else if (this.isSelectConfig(value)) {
        controls.push({ type: 'select', path, label, options: value.options });
      } else if (this.isColorConfig(value)) {
        controls.push({ type: 'color', path, label, alpha: value.alpha, palette: value.palette });
      } else if (this.isGradientConfig(value)) {
        controls.push({ type: 'gradient', path, label });
      } else if (this.isXYConfig(value)) {
        controls.push({ type: 'xy', path, label, xAxis: value.x, yAxis: value.y, grid: value.grid, density: value.density, snap: value.snap, returnToCenter: value.returnToCenter, showValues: value.showValues });
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
        const folderConfig = value as DialConfig;
        const defaultOpen = '_collapsed' in folderConfig ? !(folderConfig._collapsed as boolean) : true;
        controls.push({
          type: 'folder',
          path,
          label,
          defaultOpen,
          children: this.parseConfig(folderConfig, path, shortcuts),
        });
      }
    }

    return controls;
  }

  private flattenValues(config: DialConfig, prefix: string): Record<string, DialValue> {
    const values: Record<string, DialValue> = {};

    for (const [key, value] of Object.entries(config)) {
      if (key === '_collapsed') continue;
      const path = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value) && value.length <= 4 && typeof value[0] === 'number') {
        values[path] = value[0]; // Default value
      } else if (this.isSliderConfig(value)) {
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
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(values, this.flattenValues(value as DialConfig, path));
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
    existingValue: DialValue | undefined,
    defaultValue: DialValue,
    control: ControlMeta | undefined
  ): DialValue {
    if (existingValue === undefined || !control) {
      return defaultValue;
    }

    switch (control.type) {
      case 'slider': {
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
// in DialStoreClass, scoped to the scalar field kinds a list item can hold.

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
export const DialStore = new DialStoreClass();
