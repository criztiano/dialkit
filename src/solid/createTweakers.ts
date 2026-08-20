import { createSignal, createMemo, createEffect, onMount, onCleanup, createUniqueId, type Accessor } from 'solid-js';
import { TweakStore } from '../store/TweakStore';
import type { TweakConfig, ResolvedValues, TweakValue, SpringConfig, SelectConfig, ColorConfig, GradientConfig, TextConfig, ActionConfig, ShortcutConfig, AffordanceConfig, PresetProvider } from '../store/TweakStore';
import { normalizeGradient, DEFAULT_GRADIENT } from '../gradient-core';

export interface CreateTweakersOptions {
  onAction?: (action: string) => void;
  shortcuts?: Record<string, ShortcutConfig>;
  /** One line of help per control path, revealed on hover or keyboard focus. */
  hints?: Record<string, string>;
  /** Companion controls per control path, opened from a dot in the corner. */
  affordances?: Record<string, AffordanceConfig>;
  /** Display label by control path, overriding the key-derived name. */
  labels?: Record<string, string>;
  /**
   * Host-owned backing for the toolbar's preset UI (see PresetProvider).
   * Back `presets`/`activeId` with signal-read getters to keep the list live.
   */
  presets?: PresetProvider;
}

export function createTweakers<T extends TweakConfig>(
  name: string,
  config: T,
  options?: CreateTweakersOptions
): Accessor<ResolvedValues<T>> {
  const id = createUniqueId();
  const panelId = `${name}-${id}`;

  const [values, setValues] = createSignal<Record<string, TweakValue>>(
    TweakStore.getValues(panelId)
  );

  onMount(() => {
    TweakStore.registerPanel(panelId, name, config, options?.shortcuts, { hints: options?.hints, affordances: options?.affordances,
      labels: options?.labels });
    setValues(TweakStore.getValues(panelId));

    const unsubValues = TweakStore.subscribe(panelId, () => {
      setValues(TweakStore.getValues(panelId));
    });

    const unsubActions = options?.onAction
      ? TweakStore.subscribeActions(panelId, options.onAction)
      : undefined;

    onCleanup(() => {
      unsubValues();
      unsubActions?.();
      TweakStore.unregisterPanel(panelId);
    });
  });

  // Track the provider's visible data (signal-backed getters register here via
  // the stringify read) and push swaps into the store; setPresetProvider only
  // notifies when that data changed.
  createEffect(() => {
    const provider = options?.presets ?? null;
    if (provider) JSON.stringify(provider);
    TweakStore.setPresetProvider(panelId, provider);
  });

  return createMemo(() => buildResolvedValues(config, values(), '') as ResolvedValues<T>);
}

function buildResolvedValues(
  config: TweakConfig,
  flatValues: Record<string, TweakValue>,
  prefix: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, configValue] of Object.entries(config)) {
    if (key === '_collapsed' || key === '_collapsible') continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === 'number') {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (typeof configValue === 'number' || typeof configValue === 'boolean' || typeof configValue === 'string') {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSpringConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? '#000000';
    } else if (isGradientConfig(configValue)) {
      // Gradient resolves to a normalized GradientValue object. Must precede the
      // generic nested-object branch below, or the config is walked as a folder
      // and the value resolves to the raw config (crashing gradientToCss).
      result[key] = flatValues[path] ?? normalizeGradient(configValue.default ?? DEFAULT_GRADIENT);
    } else if (isTextConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? '';
    } else if (typeof configValue === 'object' && configValue !== null) {
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

function getFirstOptionValue(options: (string | { value: string; label: string })[]): string {
  const first = options[0];
  return typeof first === 'string' ? first : first.value;
}
