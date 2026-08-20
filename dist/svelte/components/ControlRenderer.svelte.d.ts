import type { ControlMeta, TweakValue } from 'tweakers/store';
import type { TransitionDurationControl } from './TransitionControl.svelte';
import ControlRenderer from './ControlRenderer.svelte';
type $$ComponentProps = {
    panelId: string;
    control: ControlMeta;
    values: Record<string, TweakValue>;
    transitionDuration?: TransitionDurationControl;
};
declare const ControlRenderer: import("svelte").Component<$$ComponentProps, {}, "">;
type ControlRenderer = ReturnType<typeof ControlRenderer>;
export default ControlRenderer;
//# sourceMappingURL=ControlRenderer.svelte.d.ts.map