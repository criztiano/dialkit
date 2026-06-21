import type { WaveformMode, WaveformLoop } from '../../waveform-engine';
type $$ComponentProps = {
    buffer?: AudioBuffer | null;
    progress?: number;
    getProgress?: () => number;
    mode?: WaveformMode;
    border?: boolean;
    bands?: boolean;
    pixelSize?: number;
    grid?: boolean;
    gridSubdivisions?: number;
    onSeek?: (progress: number) => void;
    loop?: WaveformLoop | null;
    onLoopChange?: (loop: WaveformLoop | null) => void;
    waveColor?: string;
    playheadColor?: string;
    autoZoomOnLoop?: boolean;
    width?: number;
    height?: number;
};
declare const WaveformVisualization: import("svelte").Component<$$ComponentProps, {}, "">;
type WaveformVisualization = ReturnType<typeof WaveformVisualization>;
export default WaveformVisualization;
//# sourceMappingURL=WaveformVisualization.svelte.d.ts.map