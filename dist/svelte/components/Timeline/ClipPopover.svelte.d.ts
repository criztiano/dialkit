import type { TweakValue } from 'tweakers/store';
import type { TimelineClipMeta } from 'tweakers/timeline';
import type { TweakTheme } from '../TweakRoot.svelte';
export type PopoverState = {
    clip: TimelineClipMeta;
    stepKey?: string;
    anchor: {
        left: number;
        top: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
    };
};
type $$ComponentProps = {
    panelId: string;
    popover: PopoverState;
    values: Record<string, TweakValue>;
    theme: TweakTheme;
    onClose: () => void;
};
declare const ClipPopover: import("svelte").Component<$$ComponentProps, {}, "">;
type ClipPopover = ReturnType<typeof ClipPopover>;
export default ClipPopover;
//# sourceMappingURL=ClipPopover.svelte.d.ts.map