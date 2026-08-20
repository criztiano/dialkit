import type { RangeValue } from '../../store/TweakStore';
type $$ComponentProps = {
    label: string;
    value: RangeValue;
    onChange: (value: RangeValue) => void;
    /** Lower bound of the track. */
    min?: number;
    /** Upper bound of the track. */
    max?: number;
    step?: number;
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue?: RangeValue;
};
declare const RangeSlider: import("svelte").Component<$$ComponentProps, {}, "">;
type RangeSlider = ReturnType<typeof RangeSlider>;
export default RangeSlider;
//# sourceMappingURL=RangeSlider.svelte.d.ts.map