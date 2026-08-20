type $$ComponentProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    /** Accessible name — the visible label is rendered by the caller. */
    label?: string;
    /** The control exists but cannot act right now: reads as a dash, not a
     *  blank box, so "unavailable" never looks like "off". */
    disabled?: boolean;
    id?: string;
};
declare const Checkbox: import("svelte").Component<$$ComponentProps, {}, "">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;
//# sourceMappingURL=Checkbox.svelte.d.ts.map