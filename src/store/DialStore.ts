// Lightweight state store with subscriptions for dialkit

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
};

export type TextConfig = {
  type: 'text';
  default?: string;
  placeholder?: string;
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
  | TextConfig;

export type ListItemType = {
  /** Shown in the add menu and as the row's title. */
  label: string;
  /** Sub-controls for this item type, keyed by param name. */
  schema: Record<string, ListItemField>;
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
export type ListFieldKind = 'slider' | 'toggle' | 'select' | 'color' | 'text';
export type ListField = {
  key: string;
  label: string;
  kind: ListFieldKind;
  min?: number;
  max?: number;
  step?: number;
  options?: (string | { value: string; label: string })[];
  placeholder?: string;
  defaultValue: number | boolean | string;
};

export type DialValue = number | boolean | string | SpringConfig | EasingConfig | ActionConfig | SelectConfig | ColorConfig | TextConfig | GalleryConfig | FileConfig | SwatchConfig | ChipsConfig | ListConfig | ListItemValue[];

export type DialConfig = {
  [key: string]: DialValue | [number, number, number, number?] | DialConfig;
};

export type ResolvedValues<T extends DialConfig> = {
  [K in keyof T]: T[K] extends [number, number, number, number?]
    ? number
    : T[K] extends SpringConfig
      ? TransitionConfig
      : T[K] extends EasingConfig
        ? TransitionConfig
        : T[K] extends SelectConfig
          ? string
          : T[K] extends ColorConfig
            ? string
            : T[K] extends TextConfig
              ? string
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

export type ControlMeta = {
  type: 'slider' | 'toggle' | 'spring' | 'transition' | 'folder' | 'action' | 'select' | 'color' | 'text' | 'gallery' | 'file' | 'swatch' | 'chips' | 'list';
  path: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
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
  itemTypes?: Record<string, ListItemType>;
  addLabel?: string;
  maxItems?: number;
  shortcut?: ShortcutConfig;
};

export type PanelConfig = {
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
export type DialEvent =
  | { kind: 'file'; files: FileList }
  | { kind: 'remove'; value: string }
  | { kind: 'list'; op: 'add' | 'remove' | 'move' | 'set'; index?: number; from?: number; to?: number; itemType?: string };

type EventListener = (path: string, event: DialEvent) => void;

export type Preset = {
  id: string;
  name: string;
  values: Record<string, DialValue>;
};

// Stable empty object for unregistered panels (React 19 useSyncExternalStore requirement)
const EMPTY_VALUES: Record<string, DialValue> = Object.freeze({});

class DialStoreClass {
  private panels: Map<string, PanelConfig> = new Map();
  private listeners: Map<string, Set<Listener>> = new Map();
  private globalListeners: Set<Listener> = new Set();
  private snapshots: Map<string, Record<string, DialValue>> = new Map();
  private actionListeners: Map<string, Set<ActionListener>> = new Map();
  private eventListeners: Map<string, Set<EventListener>> = new Map();
  private presets: Map<string, Preset[]> = new Map();
  private activePreset: Map<string, string | null> = new Map();
  private baseValues: Map<string, Record<string, DialValue>> = new Map();

  registerPanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>): void {
    const controls = this.parseConfig(config, '', shortcuts);
    const values = this.flattenValues(config, '');

    // Set initial transition modes based on config types
    this.initTransitionModes(config, '', values);

    this.panels.set(id, { id, name, controls, values, shortcuts: shortcuts ?? {} });
    this.snapshots.set(id, { ...values });
    this.baseValues.set(id, { ...values });
    this.notifyGlobal();
  }

  updatePanel(id: string, name: string, config: DialConfig, shortcuts?: Record<string, ShortcutConfig>): void {
    const existing = this.panels.get(id);
    if (!existing) {
      this.registerPanel(id, name, config, shortcuts);
      return;
    }

    const controls = this.parseConfig(config, '', shortcuts);
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

    const nextPanel: PanelConfig = { id, name, controls, values: nextValues, shortcuts: shortcuts ?? existing.shortcuts };
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

    this.notify(id);
    this.notifyGlobal();
  }

  unregisterPanel(id: string): void {
    this.panels.delete(id);
    this.listeners.delete(id);
    this.snapshots.delete(id);
    this.actionListeners.delete(id);
    this.eventListeners.delete(id);
    this.baseValues.delete(id);
    this.notifyGlobal();
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

  getPanels(): PanelConfig[] {
    return Array.from(this.panels.values());
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
      this.listeners.get(panelId)?.delete(listener);
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
      this.actionListeners.get(panelId)?.delete(listener);
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
      this.eventListeners.get(panelId)?.delete(listener);
    };
  }

  emitEvent(panelId: string, path: string, event: DialEvent): void {
    this.eventListeners.get(panelId)?.forEach(fn => fn(path, event));
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
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !this.isActionConfig(value) && !this.isSelectConfig(value) && !this.isColorConfig(value) && !this.isTextConfig(value) && !this.isGalleryConfig(value) && !this.isFileConfig(value) && !this.isSwatchConfig(value) && !this.isChipsConfig(value) && !this.isListConfig(value)) {
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
      } else if (typeof value === 'boolean') {
        controls.push({ type: 'toggle', path, label, shortcut });
      } else if (this.isSpringConfig(value) || this.isEasingConfig(value)) {
        controls.push({ type: 'transition', path, label });
      } else if (this.isActionConfig(value)) {
        controls.push({ type: 'action', path, label: (value as ActionConfig).label || label });
      } else if (this.isSelectConfig(value)) {
        controls.push({ type: 'select', path, label, options: value.options });
      } else if (this.isColorConfig(value)) {
        controls.push({ type: 'color', path, label });
      } else if (this.isTextConfig(value)) {
        controls.push({ type: 'text', path, label, placeholder: value.placeholder });
      } else if (this.isGalleryConfig(value)) {
        controls.push({ type: 'gallery', path, label, items: value.items, columns: value.columns });
      } else if (this.isFileConfig(value)) {
        controls.push({ type: 'file', path, label, accept: value.accept, multiple: value.multiple });
      } else if (this.isSwatchConfig(value)) {
        controls.push({ type: 'swatch', path, label, swatchOptions: value.options });
      } else if (this.isChipsConfig(value)) {
        controls.push({ type: 'chips', path, label, chipOptions: value.options });
      } else if (this.isListConfig(value)) {
        controls.push({ type: 'list', path, label, itemTypes: value.itemTypes, addLabel: value.addLabel, maxItems: value.max });
      } else if (typeof value === 'string') {
        // Auto-detect: hex color vs text
        if (this.isHexColor(value)) {
          controls.push({ type: 'color', path, label });
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
      } else if (this.isTextConfig(value)) {
        values[path] = value.default ?? '';
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
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
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
      case 'color':
      case 'text':
      case 'file':
        return typeof existingValue === 'string' ? existingValue : defaultValue;
      case 'list':
        // Items are self-validating ({type, params}); preserve the user's array
        // across config edits, falling back to the default when shape is lost.
        return Array.isArray(existingValue) ? existingValue : defaultValue;
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
export function parseListItemSchema(schema: Record<string, ListItemField>): ListField[] {
  const fields: ListField[] = [];

  for (const [key, def] of Object.entries(schema)) {
    const label = listFormatLabel(key);

    if (Array.isArray(def) && def.length <= 4 && typeof def[0] === 'number') {
      const [d, min, max, step] = def;
      fields.push({ key, label, kind: 'slider', min, max, step: step ?? listInferStep(min, max), defaultValue: d });
    } else if (typeof def === 'number') {
      const { min, max, step } = listInferRange(def);
      fields.push({ key, label, kind: 'slider', min, max, step, defaultValue: def });
    } else if (typeof def === 'boolean') {
      fields.push({ key, label, kind: 'toggle', defaultValue: def });
    } else if (listHasType(def, 'select') && Array.isArray((def as SelectConfig).options)) {
      const select = def as SelectConfig;
      const first = select.options[0];
      const firstValue = typeof first === 'string' ? first : first?.value ?? '';
      fields.push({ key, label, kind: 'select', options: select.options, defaultValue: select.default ?? firstValue });
    } else if (listHasType(def, 'color')) {
      fields.push({ key, label, kind: 'color', defaultValue: (def as ColorConfig).default ?? '#000000' });
    } else if (listHasType(def, 'text')) {
      const text = def as TextConfig;
      fields.push({ key, label, kind: 'text', placeholder: text.placeholder, defaultValue: text.default ?? '' });
    } else if (typeof def === 'string') {
      fields.push({ key, label, kind: listIsHexColor(def) ? 'color' : 'text', defaultValue: def });
    }
  }

  return fields;
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
    .map((item) => ({
      type: item.type,
      params: { ...defaultListItemParams(config.itemTypes[item.type].schema), ...(item.params ?? {}) },
    }));
}

// Singleton instance
export const DialStore = new DialStoreClass();
