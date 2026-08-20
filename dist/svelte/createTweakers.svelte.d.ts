import type { TweakConfig, TweakEvent, TweakersPersistOptions, ResolvedValues, ShortcutConfig, AffordanceConfig, PresetProvider } from 'tweakers/store';
export interface CreateTweakersOptions {
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
     * Host-owned backing for the toolbar's preset UI (see PresetProvider).
     * Back `presets`/`activeId` with $state-read getters to keep the list live.
     */
    presets?: PresetProvider;
    /** Stable id shares one panel/persistence target across mounts. */
    id?: string;
    /** Persist values per machine (see TweakersPersistOptions). */
    persist?: TweakersPersistOptions;
}
export type TweakersValues<T> = T;
export declare function createTweakers<T extends TweakConfig>(name: string, config: T, options?: CreateTweakersOptions): TweakersValues<ResolvedValues<T>>;
//# sourceMappingURL=createTweakers.svelte.d.ts.map