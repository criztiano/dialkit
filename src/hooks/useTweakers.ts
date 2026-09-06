import { useEffect, useRef } from 'react';
import { TweakStore, TweakConfig, TweakValue, TweakEvent, ResolvedValues, SpringConfig, EasingConfig, SelectConfig, SliderConfig, ColorConfig, GradientConfig, TextConfig, GalleryConfig, FileConfig, SwatchConfig, ChipsConfig, MultiSelectConfig, ListConfig, CurveConfig, AnalyserConfig, XYConfig, RangeConfig, FilterConfig, TransferConfig, ActionConfig, ShortcutConfig, AffordanceConfig, PresetProvider, normalizeListItems } from '../store/TweakStore';
import { useTweakStorePanel } from './useTweakStorePanel';
import { normalizeGradient, DEFAULT_GRADIENT } from '../gradient-core';
import { resolveAxis, normalizeValue as normalizeXYValue } from '../xy-pad-core';
import { resolveFilterAxis, normalizeFilterValue } from '../filter-core';
import { normalizeTransfer, DEFAULT_TRANSFER } from '../transfer-core';

export interface UseTweakersOptions {
  onAction?: (action: string) => void;
  /** Non-value events: file picked, chip removed, list mutated. */
  onEvent?: (path: string, event: TweakEvent) => void;
  shortcuts?: Record<string, ShortcutConfig>;
  /** One line of help per control path, revealed on hover or keyboard focus. */
  hints?: Record<string, string>;
  /** Companion controls per control path, opened from a dot in the corner. */
  affordances?: Record<string, AffordanceConfig>;
  /** Display label by control path, overriding the key-derived name. */
  labels?: Record<string, string>;
  /**
   * Which Move pad column each pad control sits in, by control path (0-7) —
   * the page's hand-authored hardware layout, so a pad sits under the dial it
   * belongs to instead of packing left.
   */
  movePads?: Record<string, number>;
  /**
   * Host-owned backing for the toolbar's preset UI. The toolbar renders this
   * list instead of the built-in localStorage snapshots; the host applies
   * values in `onSelect` and owns persistence (see PresetProvider).
   *
   * `false` leaves this panel's header bare of the toolbar altogether — for
   * the secondary panels of a multi-panel app, where a snapshot means the
   * whole instrument and so belongs to one panel only.
   */
  presets?: PresetProvider | false;
}

export function useTweakers<T extends TweakConfig>(
  name: string,
  config: T,
  options?: UseTweakersOptions
): ResolvedValues<T> {
  const onActionRef = useRef(options?.onAction);
  onActionRef.current = options?.onAction;
  const onEventRef = useRef(options?.onEvent);
  onEventRef.current = options?.onEvent;

  // Shared panel lifecycle: stable id, register/update, and the flat value
  // snapshot subscription. Keeps useTweakers and useTweakTimeline in lockstep.
  const { panelId, flatValues } = useTweakStorePanel(name, config, {
    shortcuts: options?.shortcuts,
    hints: options?.hints,
    affordances: options?.affordances,
      labels: options?.labels,
    movePads: options?.movePads,
    presets: options?.presets,
  });

  // Subscribe to action events
  useEffect(() => {
    return TweakStore.subscribeActions(panelId, (action) => {
      onActionRef.current?.(action);
    });
  }, [panelId]);

  // Subscribe to non-value events (file/chip/list)
  useEffect(() => {
    return TweakStore.subscribeEvents(panelId, (path, event) => {
      onEventRef.current?.(path, event);
    });
  }, [panelId]);

  // Build resolved values object
  return buildResolvedValues(config, flatValues, '') as ResolvedValues<T>;
}

function buildResolvedValues(
  config: TweakConfig,
  flatValues: Record<string, TweakValue>,
  prefix: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, configValue] of Object.entries(config)) {
    if (key === '_collapsed' || key === '_collapsible' || key === '_tabs') continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === 'number') {
      // Range tuple
      result[key] = flatValues[path] ?? configValue[0];
    } else if (isSliderConfig(configValue)) {
      // Explicit slider form resolves to its number
      result[key] = flatValues[path] ?? configValue.default;
    } else if (typeof configValue === 'number' || typeof configValue === 'boolean' || typeof configValue === 'string') {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSpringConfig(configValue) || isEasingConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      // Select config resolves to string value
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      // Color config resolves to string value
      result[key] = flatValues[path] ?? configValue.default ?? '#000000';
    } else if (isGradientConfig(configValue)) {
      // Gradient config resolves to a normalized GradientValue object
      result[key] = flatValues[path] ?? normalizeGradient(configValue.default ?? DEFAULT_GRADIENT);
    } else if (isTextConfig(configValue)) {
      // Text config resolves to string value
      result[key] = flatValues[path] ?? configValue.default ?? '';
    } else if (isGalleryConfig(configValue)) {
      // Gallery config resolves to the selected item id
      const defaultValue = configValue.default ?? configValue.items[0]?.id ?? '';
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isFileConfig(configValue)) {
      // File config resolves to the chosen filename (the File rides the event channel)
      result[key] = flatValues[path] ?? '';
    } else if (isSwatchConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? '';
    } else if (isChipsConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? '';
    } else if (isMultiSelectConfig(configValue)) {
      // Resolves to the checked values; empty selection is a real state
      result[key] = flatValues[path] ?? configValue.default ?? [];
    } else if (isListConfig(configValue)) {
      // List resolves to its array of {type, params} rows.
      result[key] = flatValues[path] ?? normalizeListItems(configValue);
    } else if (isXYConfig(configValue)) {
      // XY resolves to its {x,y} point — a leaf, not a folder of axes.
      const cfg = configValue as XYConfig;
      result[key] = flatValues[path] ?? normalizeXYValue(
        cfg.default, resolveAxis(cfg.x), resolveAxis(cfg.y), cfg.snap ?? false);
    } else if (isRangeConfig(configValue)) {
      const cfg = configValue as RangeConfig;
      result[key] = flatValues[path] ?? cfg.default ?? { min: cfg.min, max: cfg.max };
    } else if (isFilterConfig(configValue)) {
      const cfg = configValue as FilterConfig;
      result[key] = flatValues[path] ?? normalizeFilterValue(
        cfg.default, resolveFilterAxis(cfg.cutoff, 'cutoff'), resolveFilterAxis(cfg.resonance, 'resonance'));
    } else if (isTransferConfig(configValue)) {
      result[key] = flatValues[path] ?? normalizeTransfer((configValue as TransferConfig).default ?? DEFAULT_TRANSFER);
    } else if (isCurveConfig(configValue) || isAnalyserConfig(configValue)) {
      // Display-only rows: no value, so no key in the resolved shape.
    } else if (typeof configValue === 'object' && configValue !== null) {
      // Nested object
      result[key] = buildResolvedValues(configValue as TweakConfig, flatValues, path);
    }
  }

  return result;
}

function hasType(value: unknown, type: string): boolean {
  return typeof value === 'object' && value !== null && 'type' in value && (value as { type: string }).type === type;
}

function isSpringConfig(value: unknown): value is SpringConfig {
  return hasType(value, 'spring');
}

function isEasingConfig(value: unknown): value is EasingConfig {
  return hasType(value, 'easing');
}

function isActionConfig(value: unknown): value is ActionConfig {
  return hasType(value, 'action');
}

function isSelectConfig(value: unknown): value is SelectConfig {
  return hasType(value, 'select') && 'options' in (value as object) && Array.isArray((value as SelectConfig).options);
}

function isColorConfig(value: unknown): value is ColorConfig {
  return hasType(value, 'color');
}

function isGradientConfig(value: unknown): value is GradientConfig {
  return hasType(value, 'gradient');
}

function isTextConfig(value: unknown): value is TextConfig {
  return hasType(value, 'text');
}

function isGalleryConfig(value: unknown): value is GalleryConfig {
  return hasType(value, 'gallery') && 'items' in (value as object) && Array.isArray((value as GalleryConfig).items);
}

function isFileConfig(value: unknown): value is FileConfig {
  return hasType(value, 'file');
}

function isSwatchConfig(value: unknown): value is SwatchConfig {
  return hasType(value, 'swatch') && 'options' in (value as object) && Array.isArray((value as SwatchConfig).options);
}

function isChipsConfig(value: unknown): value is ChipsConfig {
  return hasType(value, 'chips') && 'options' in (value as object) && Array.isArray((value as ChipsConfig).options);
}

function isMultiSelectConfig(value: unknown): value is MultiSelectConfig {
  return hasType(value, 'multiselect') && 'options' in (value as object) && Array.isArray((value as MultiSelectConfig).options);
}

function isSliderConfig(value: unknown): value is SliderConfig {
  return hasType(value, 'slider') && typeof (value as SliderConfig).min === 'number' && typeof (value as SliderConfig).max === 'number';
}

function isListConfig(value: unknown): value is ListConfig {
  return hasType(value, 'list') && 'itemTypes' in (value as object) && typeof (value as ListConfig).itemTypes === 'object';
}

function isXYConfig(value: unknown): value is XYConfig {
  return hasType(value, 'xy');
}

function isRangeConfig(value: unknown): value is RangeConfig {
  return hasType(value, 'range');
}

function isFilterConfig(value: unknown): value is FilterConfig {
  return hasType(value, 'filter');
}

function isTransferConfig(value: unknown): value is TransferConfig {
  return hasType(value, 'transfer');
}

function isAnalyserConfig(value: unknown): value is AnalyserConfig {
  return hasType(value, 'analyser');
}

function isCurveConfig(value: unknown): value is CurveConfig {
  return hasType(value, 'curve') && typeof (value as CurveConfig).sample === 'function';
}

function getFirstOptionValue(options: (string | { value: string; label: string })[]): string {
  const first = options[0];
  return typeof first === 'string' ? first : first.value;
}
