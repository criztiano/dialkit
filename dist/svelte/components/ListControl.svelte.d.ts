import type { ListItemValue, ListItemType, TweakEvent } from 'tweakers/store';
type $$ComponentProps = {
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    onEvent: (event: TweakEvent) => void;
};
declare const ListControl: import("svelte").Component<$$ComponentProps, {}, "">;
type ListControl = ReturnType<typeof ListControl>;
export default ListControl;
//# sourceMappingURL=ListControl.svelte.d.ts.map