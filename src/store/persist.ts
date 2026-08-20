/**
 * Fail-soft browser persistence shared by TweakStore (panel values) and
 * TimelineStore (loop regions). Kept separate so the stores stay node-safe and
 * side-effect-free: nothing here touches `window` at import time, and every
 * storage access is guarded + try/caught. When storage is unavailable (SSR,
 * Safari private mode, blocked cookies) persistence silently degrades to
 * session-only — a broken shelf must never break the tool.
 *
 * Mirrors the style of color-palette-store.ts.
 */

/** Structural mirror of TweakersPersistOptions — duplicated here to keep this
 * module free of a TweakStore import (avoids a store ↔ persist cycle). */
export type PersistConfig = boolean | {
  key?: string;
  storage?: 'localStorage' | 'sessionStorage';
  presets?: boolean;
};

export type PersistTarget = {
  key: string;
  storage: 'localStorage' | 'sessionStorage';
};

const STORAGE_VERSION = 'v1';

/**
 * Resolve a namespaced+versioned storage target, or `null` when persistence is
 * off or no stable base id is available. `kind` scopes the key ("panel",
 * "timeline-loop"); `id` (or an explicit `persist.key`) makes it stable across
 * reloads — a generated id would defeat the purpose.
 */
export function resolvePersistTarget(
  kind: string,
  id: string | undefined,
  persist: PersistConfig | undefined
): PersistTarget | null {
  if (!persist) return null;
  const config = persist === true ? {} : persist;
  const base = config.key ?? id;
  if (!base) return null;
  return {
    key: `tweakers:${STORAGE_VERSION}:${kind}:${base}`,
    storage: config.storage ?? 'localStorage',
  };
}

function getStorage(name: 'localStorage' | 'sessionStorage'): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return name === 'sessionStorage' ? window.sessionStorage : window.localStorage;
  } catch {
    // Property access itself can throw when storage is blocked.
    return null;
  }
}

export function loadPersisted<T>(target: PersistTarget | null): T | null {
  if (!target) return null;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return null;
    const raw = storage.getItem(target.key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    // Malformed JSON or blocked storage — behave as if nothing was saved.
    return null;
  }
}

export function savePersisted(target: PersistTarget | null, value: unknown): void {
  if (!target) return;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return;
    storage.setItem(target.key, JSON.stringify(value));
  } catch {
    // Quota / private mode — keep the in-memory state for this session.
  }
}

export function clearPersisted(target: PersistTarget | null): void {
  if (!target) return;
  try {
    const storage = getStorage(target.storage);
    if (!storage) return;
    storage.removeItem(target.key);
  } catch {
    // Nothing to do — storage is unavailable.
  }
}
