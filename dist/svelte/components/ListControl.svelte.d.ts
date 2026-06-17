import type { ListItemValue, ListItemType, DialEvent } from 'dialkit/store';
type $$ComponentProps = {
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    onEvent: (event: DialEvent) => void;
};
declare const ListControl: import("svelte").Component<$$ComponentProps, {}, "">;
type ListControl = ReturnType<typeof ListControl>;
export default ListControl;
//# sourceMappingURL=ListControl.svelte.d.ts.map