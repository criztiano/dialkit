import type { Snippet } from 'svelte';
import type { PanelConfig } from 'tweakers/store';
type $$ComponentProps = {
    panel: PanelConfig;
    defaultOpen?: boolean;
    inline?: boolean;
    toolbarExtra?: Snippet;
};
declare const Panel: import("svelte").Component<$$ComponentProps, {}, "">;
type Panel = ReturnType<typeof Panel>;
export default Panel;
//# sourceMappingURL=Panel.svelte.d.ts.map