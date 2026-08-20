export type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type TweakMode = 'popover' | 'inline';
export type TweakTheme = 'light' | 'dark' | 'system';
type $$ComponentProps = {
    position?: TweakPosition;
    defaultOpen?: boolean;
    mode?: TweakMode;
    theme?: TweakTheme;
    productionEnabled?: boolean;
};
declare const TweakRoot: import("svelte").Component<$$ComponentProps, {}, "">;
type TweakRoot = ReturnType<typeof TweakRoot>;
export default TweakRoot;
//# sourceMappingURL=TweakRoot.svelte.d.ts.map