type $$ComponentProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /** Override the displayed value text; `unit` is not auto-appended. */
    formatValue?: (value: number) => string;
    /** `vertical` stacks the label above a centered value (column card). */
    orientation?: 'horizontal' | 'vertical';
};
declare const NumberControl: import("svelte").Component<$$ComponentProps, {}, "">;
type NumberControl = ReturnType<typeof NumberControl>;
export default NumberControl;
//# sourceMappingURL=NumberControl.svelte.d.ts.map