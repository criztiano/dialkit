import type { DialConfig, DialEvent, DialKitPersistOptions, ResolvedValues, ShortcutConfig, AffordanceConfig, PresetProvider } from 'dialkit/store';
export interface CreateDialOptions {
    onAction?: (action: string) => void;
    /** Non-value events: file picked, chip removed, list mutated. */
    onEvent?: (path: string, event: DialEvent) => void;
    shortcuts?: Record<string, ShortcutConfig>;
    /** One line of help per control path, revealed on hover or keyboard focus. */
    hints?: Record<string, string>;
    /** Companion controls per control path, opened from a dot in the corner. */
    affordances?: Record<string, AffordanceConfig>;
    /** Display label by control path, overriding the key-derived name. */
    labels?: Record<string, string>;
    /**
     * Host-owned backing for the toolbar's preset UI (see PresetProvider).
     * Back `presets`/`activeId` with $state-read getters to keep the list live.
     */
    presets?: PresetProvider;
    /** Stable id shares one panel/persistence target across mounts. */
    id?: string;
    /** Persist values per machine (see DialKitPersistOptions). */
    persist?: DialKitPersistOptions;
}
export type DialKitValues<T> = T;
export declare function createDialKit<T extends DialConfig>(name: string, config: T, options?: CreateDialOptions): DialKitValues<ResolvedValues<T>>;
//# sourceMappingURL=createDialKit.svelte.d.ts.map