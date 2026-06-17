import { DialStore, normalizeListItems } from 'dialkit/store';
import type {
  ActionConfig,
  ChipsConfig,
  ColorConfig,
  DialConfig,
  DialEvent,
  DialValue,
  EasingConfig,
  FileConfig,
  ListConfig,
  ResolvedValues,
  SelectConfig,
  ShortcutConfig,
  SpringConfig,
  SwatchConfig,
  TextConfig,
} from 'dialkit/store';

export interface CreateDialOptions {
  onAction?: (action: string) => void;
  /** Non-value events: file picked, chip removed, list mutated. */
  onEvent?: (path: string, event: DialEvent) => void;
  shortcuts?: Record<string, ShortcutConfig>;
}

export type DialKitValues<T> = T;

let dialKitInstance = 0;

export function createDialKit<T extends DialConfig>(
  name: string,
  config: T,
  options?: CreateDialOptions
): DialKitValues<ResolvedValues<T>> {
  const panelId = `${name}-${++dialKitInstance}`;
  const resolve = () => buildResolvedValues(config, DialStore.getValues(panelId), '') as ResolvedValues<T>;

  let values = $state<ResolvedValues<T>>(resolve());

  $effect(() => {
    DialStore.registerPanel(panelId, name, config, options?.shortcuts);
    values = resolve();

    const unsubValues = DialStore.subscribe(panelId, () => {
      values = resolve();
    });

    const unsubActions = options?.onAction
      ? DialStore.subscribeActions(panelId, options.onAction)
      : undefined;

    const unsubEvents = options?.onEvent
      ? DialStore.subscribeEvents(panelId, options.onEvent)
      : undefined;

    return () => {
      unsubValues();
      unsubActions?.();
      unsubEvents?.();
      DialStore.unregisterPanel(panelId);
    };
  });

  return values;
}

function buildResolvedValues(
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
    } else if (isSpringConfig(configValue) || isEasingConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? '#000000';
    } else if (isTextConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? '';
    } else if (isFileConfig(configValue)) {
      result[key] = flatValues[path] ?? '';
    } else if (isSwatchConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? '';
    } else if (isChipsConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? '';
    } else if (isListConfig(configValue)) {
      result[key] = flatValues[path] ?? normalizeListItems(configValue);
    } else if (typeof configValue === 'object' && configValue !== null) {
      result[key] = buildResolvedValues(configValue as DialConfig, flatValues, path);
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

function isTextConfig(value: unknown): value is TextConfig {
  return hasType(value, 'text');
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

function isListConfig(value: unknown): value is ListConfig {
  return hasType(value, 'list') && 'itemTypes' in (value as object) && typeof (value as ListConfig).itemTypes === 'object';
}

function getFirstOptionValue(options: (string | { value: string; label: string })[]): string {
  const first = options[0];
  return typeof first === 'string' ? first : first.value;
}
