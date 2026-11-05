import { useCallback, useSyncExternalStore } from 'react';
import { liveConfigOf, subscribeLiveConfigs, type LiveControlType } from '../live-config';
import type { ControlMeta } from '../store/DialStore';

/** The latest config of a control that draws the app's functions. See `syncLiveConfigs`. */
export function useLiveConfig<K extends LiveControlType>(panelId: string, control: ControlMeta, type: K): ControlMeta[K] {
  const subscribe = useCallback((listener: () => void) => subscribeLiveConfigs(panelId, listener), [panelId]);
  const get = () => liveConfigOf(panelId, control, type);
  return useSyncExternalStore(subscribe, get, get);
}
