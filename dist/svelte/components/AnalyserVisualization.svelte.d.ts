import type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from '../../analyser-engine';
type $$ComponentProps = {
    analyser?: AnalyserNode | null;
    source?: AnalyserSource;
    variant?: AnalyserVariant;
    mode?: AnalyserMode;
    pixelSize?: number;
    scale?: AnalyserScale;
    spring?: AnalyserSpring;
    grid?: boolean;
    gridSubdivisions?: number;
    waveColor?: string;
    fillColor?: string;
    muted?: boolean;
    onMuteChange?: (muted: boolean) => void;
    soloed?: boolean;
    onSoloChange?: (soloed: boolean) => void;
    width?: number;
    height?: number;
};
declare const AnalyserVisualization: import("svelte").Component<$$ComponentProps, {}, "">;
type AnalyserVisualization = ReturnType<typeof AnalyserVisualization>;
export default AnalyserVisualization;
//# sourceMappingURL=AnalyserVisualization.svelte.d.ts.map