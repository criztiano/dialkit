type $$ComponentProps = {
    label: string;
    value: string;
    accept?: string;
    multiple?: boolean;
    onChange: (filename: string) => void;
    onPick: (files: FileList) => void;
};
declare const FileControl: import("svelte").Component<$$ComponentProps, {}, "">;
type FileControl = ReturnType<typeof FileControl>;
export default FileControl;
//# sourceMappingURL=FileControl.svelte.d.ts.map