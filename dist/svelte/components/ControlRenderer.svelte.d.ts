import type { ControlMeta, DialValue } from 'dialkit/store';
import type { TransitionDurationControl } from './TransitionControl.svelte';
import ControlRenderer from './ControlRenderer.svelte';
type $$ComponentProps = {
    panelId: string;
    control: ControlMeta;
    values: Record<string, DialValue>;
    transitionDuration?: TransitionDurationControl;
};
declare const ControlRenderer: import("svelte").Component<$$ComponentProps, {}, "">;
type ControlRenderer = ReturnType<typeof ControlRenderer>;
export default ControlRenderer;
//# sourceMappingURL=ControlRenderer.svelte.d.ts.map