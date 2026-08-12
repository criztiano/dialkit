type PresetRow = {
    id: string;
    name: string;
    deletable?: boolean;
};
type $$ComponentProps = {
    panelId: string;
    presets: PresetRow[];
    activePresetId: string | null;
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode?: boolean;
};
declare const PresetManager: import("svelte").Component<$$ComponentProps, {}, "">;
type PresetManager = ReturnType<typeof PresetManager>;
export default PresetManager;
//# sourceMappingURL=PresetManager.svelte.d.ts.map