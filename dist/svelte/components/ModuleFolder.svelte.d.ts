import type { Snippet } from 'svelte';
type $$ComponentProps = {
    title: string;
    /** Whether the module is on — the value at the folder's `_enabled` path. */
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    /** Initial open state while enabled (`_collapsed: true` starts closed). */
    defaultOpen?: boolean;
    /** One line of help for the section, revealed on hover over the header. */
    hint?: string;
    hintId?: string;
    children?: Snippet;
};
declare const ModuleFolder: import("svelte").Component<$$ComponentProps, {}, "">;
type ModuleFolder = ReturnType<typeof ModuleFolder>;
export default ModuleFolder;
//# sourceMappingURL=ModuleFolder.svelte.d.ts.map