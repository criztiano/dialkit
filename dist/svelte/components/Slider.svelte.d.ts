import type { Snippet } from 'svelte';
import type { ShortcutConfig } from 'tweakers/store';
type $$ComponentProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /**
     * Override the displayed value text. When provided, the formatter owns the
     * full label and `unit` is not auto-appended. Inline editing still operates
     * on the raw numeric value.
     */
    formatValue?: (value: number) => string;
    /**
     * Render a custom snippet (e.g. an icon or gauge) in the value slot instead
     * of the editable numeric text. Sliders with a `valueIcon` are not editable.
     */
    valueIcon?: Snippet;
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min`.
     */
    origin?: number;
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar?: boolean;
    /**
     * `vertical` renders the 77px column card: fill grows bottom-up, label sits
     * at the base, and the value readout appears over the fill on hover/drag.
     * Vertical sliders flex to their container width — place them in a flex row.
     */
    orientation?: 'horizontal' | 'vertical';
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
};
declare const Slider: import("svelte").Component<$$ComponentProps, {}, "">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
//# sourceMappingURL=Slider.svelte.d.ts.map