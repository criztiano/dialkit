import type { ShortcutConfig, XYAxis, XYValue } from 'tweakers/store';
type $$ComponentProps = {
    label: string;
    value: XYValue;
    onChange: (value: XYValue) => void;
    x?: XYAxis;
    y?: XYAxis;
    grid?: boolean | number;
    density?: number;
    snap?: boolean;
    returnToCenter?: boolean;
    showValues?: boolean;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
};
declare const XYControl: import("svelte").Component<$$ComponentProps, {}, "">;
type XYControl = ReturnType<typeof XYControl>;
export default XYControl;
//# sourceMappingURL=XYControl.svelte.d.ts.map