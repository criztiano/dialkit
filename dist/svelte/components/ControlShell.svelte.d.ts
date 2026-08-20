import type { Snippet } from 'svelte';
import type { AffordanceConfig } from 'tweakers/store';
type $$ComponentProps = {
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint?: string;
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title?: string;
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: string;
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance?: AffordanceConfig;
    /** Required alongside `affordance` — together they address the status slice. */
    panelId?: string;
    path?: string;
    children: Snippet;
};
declare const ControlShell: import("svelte").Component<$$ComponentProps, {}, "">;
type ControlShell = ReturnType<typeof ControlShell>;
export default ControlShell;
//# sourceMappingURL=ControlShell.svelte.d.ts.map