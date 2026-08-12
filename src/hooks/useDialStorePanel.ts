import { useCallback, useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { DialStore } from '../store/DialStore';
import type { AffordanceConfig, DialConfig, DialKitPersistOptions, DialValue, PresetProvider, ShortcutConfig } from '../store/DialStore';

export interface UseDialStorePanelOptions {
  id?: string;
  persist?: DialKitPersistOptions;
  shortcuts?: Record<string, ShortcutConfig>;
  hints?: Record<string, string>;
  affordances?: Record<string, AffordanceConfig>;
  /** Display label by control path, overriding the key-derived name. */
  labels?: Record<string, string>;
  /** Host-owned backing for the toolbar's preset UI (see PresetProvider). */
  presets?: PresetProvider;
  kind?: 'timeline';
}

// Serialize with a referential short-circuit: consumers can re-render at 60Hz
// during timeline playback, and re-stringifying an unchanged config every
// frame is wasted work whenever the object is memoized or module-stable.
export function useSerialized(value: unknown): string {
  const ref = useRef<{ value: unknown; text: string }>();
  if (!ref.current || !Object.is(ref.current.value, value)) {
    ref.current = { value, text: JSON.stringify(value) };
  }
  return ref.current.text;
}

// The DialStore panel lifecycle shared by useDialKit and useDialTimeline:
// stable panel id, register on mount / unregister on unmount, push structure
// changes on config edits, and subscribe to the flat value snapshot.
// Fixes to StrictMode/HMR behavior belong here so every panel-backed hook
// gets them.
export function useDialStorePanel(
  name: string,
  config: DialConfig,
  options: UseDialStorePanelOptions = {}
): { panelId: string; flatValues: Record<string, DialValue>; serializedConfig: string } {
  const instanceId = useId();
  const hasStableId = options.id !== undefined;
  const panelId = options.id ?? `${name}-${instanceId}`;

  const configRef = useRef(config);
  configRef.current = config;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const serializedConfig = useSerialized(config);
  const serializedShortcuts = useSerialized(options.shortcuts);
  const serializedPersist = useSerialized(options.persist);
  const serializedHints = useSerialized(options.hints);
  const serializedLabels = useSerialized(options.labels);

  // Register on mount
  useEffect(() => {
    DialStore.registerPanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      kind: optionsRef.current.kind,
    });
    return () => DialStore.unregisterPanel(panelId);
  }, [hasStableId, panelId, name]);

  // Push structure changes without re-registering
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    DialStore.updatePanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      kind: optionsRef.current.kind,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStableId, panelId, name, serializedConfig, serializedShortcuts, serializedPersist, serializedHints, serializedLabels]);

  // Swap the preset provider after every render on purpose: its callbacks
  // close over host state and must never go stale. setPresetProvider only
  // notifies when the visible data (list, active id) changed, so this is the
  // same reconciliation cost profile as the serialized config path above.
  useEffect(() => {
    DialStore.setPresetProvider(panelId, optionsRef.current.presets ?? null);
  });

  const subscribe = useCallback(
    (callback: () => void) => DialStore.subscribe(panelId, callback),
    [panelId]
  );
  const getSnapshot = useCallback(() => DialStore.getValues(panelId), [panelId]);

  // DialStore.getValues returns a stable empty object when panel is not registered.
  const flatValues = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return { panelId, flatValues, serializedConfig };
}
