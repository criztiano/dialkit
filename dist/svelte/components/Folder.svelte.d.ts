import type { Snippet } from 'svelte';
type $$ComponentProps = {
    title: string;
    defaultOpen?: boolean;
    isRoot?: boolean;
    inline?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    toolbar?: Snippet;
    children?: Snippet;
    /** One line of help for the section, revealed on hover over the header. */
    hint?: string;
    hintId?: string;
};
declare const Folder: import("svelte").Component<$$ComponentProps, {}, "">;
type Folder = ReturnType<typeof Folder>;
export default Folder;
//# sourceMappingURL=Folder.svelte.d.ts.map