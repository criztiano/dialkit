/**
 * Fail-soft browser persistence shared by DialStore (panel values) and
 * TimelineStore (loop regions). Kept separate so the stores stay node-safe and
 * side-effect-free: nothing here touches `window` at import time, and every
 * storage access is guarded + try/caught. When storage is unavailable (SSR,
 * Safari private mode, blocked cookies) persistence silently degrades to
 * session-only — a broken shelf must never break the tool.
 *
 * Mirrors the style of color-palette-store.ts.
 */
/** Structural mirror of DialKitPersistOptions — duplicated here to keep this
 * module free of a DialStore import (avoids a store ↔ persist cycle). */
export type PersistConfig = boolean | {
    key?: string;
    storage?: 'localStorage' | 'sessionStorage';
    presets?: boolean;
};
export type PersistTarget = {
    key: string;
    storage: 'localStorage' | 'sessionStorage';
};
/**
 * Resolve a namespaced+versioned storage target, or `null` when persistence is
 * off or no stable base id is available. `kind` scopes the key ("panel",
 * "timeline-loop"); `id` (or an explicit `persist.key`) makes it stable across
 * reloads — a generated id would defeat the purpose.
 */
export declare function resolvePersistTarget(kind: string, id: string | undefined, persist: PersistConfig | undefined): PersistTarget | null;
export declare function loadPersisted<T>(target: PersistTarget | null): T | null;
export declare function savePersisted(target: PersistTarget | null, value: unknown): void;
export declare function clearPersisted(target: PersistTarget | null): void;
//# sourceMappingURL=persist.d.ts.map