import { DialStore, isFolderMetaKey, unwrapVisibility, type ControlMeta, type DialConfig } from './store/DialStore';

/** Controls whose config holds functions the drawing reads: a filter's `response`, a curve's `sample`, an analyser's getters. */
export type LiveControlType = 'filter';

const LIVE_TYPES: readonly string[] = ['filter'] satisfies LiveControlType[];

const listeners = new Map<string, Set<() => void>>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Swaps in the latest function-holding configs without a rebuild. A panel
 * rebuilds only when its config's JSON changes, and JSON drops functions,
 * so a `sample` that closes over the app's state would keep drawing the
 * first render's state. The React hook calls this on every host render.
 */
export function syncLiveConfigs(panelId: string, config: DialConfig): void {
  let changed = false;
  const visit = (config: DialConfig, prefix: string) => {
    for (const [key, raw] of Object.entries(config)) {
      if (isFolderMetaKey(key)) continue;
      const value: unknown = unwrapVisibility(raw);
      const path = prefix ? `${prefix}.${key}` : key;
      if (!isRecord(value)) continue;
      if (typeof value.type === 'string' && LIVE_TYPES.includes(value.type)) {
        const control = DialStore.getControl(panelId, path) as Record<string, unknown> | undefined;
        if (control?.type === value.type && control[value.type] !== value) {
          control[value.type] = value;
          changed = true;
        }
      } else if (!('type' in value)) {
        visit(value as DialConfig, path);
      }
    }
  };
  visit(config, '');
  if (changed) listeners.get(panelId)?.forEach(fn => fn());
}

export function subscribeLiveConfigs(panelId: string, listener: () => void): () => void {
  let set = listeners.get(panelId);
  if (!set) listeners.set(panelId, set = new Set());
  set.add(listener);
  return () => {
    set!.delete(listener);
    if (set!.size === 0) listeners.delete(panelId);
  };
}

/** The latest config a live control draws: the store's control, else the one rendered. */
export function liveConfigOf<K extends LiveControlType>(panelId: string, control: ControlMeta, type: K): ControlMeta[K] {
  return (DialStore.getControl(panelId, control.path) ?? control)[type];
}
