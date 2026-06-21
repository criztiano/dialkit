type WaveformMode = 'smooth' | 'pixelated';
/** A loop region over the sample, as normalized 0..1 positions. */
type WaveformLoop = {
    start: number;
    end: number;
};
/** Everything the engine reads each frame. Wrappers supply a getter for the live values. */
interface WaveformRuntime {
    buffer: AudioBuffer | null;
    progress: number;
    getProgress?: () => number;
    mode: WaveformMode;
    border: boolean;
    bands: boolean;
    pixelSize: number;
    grid: boolean;
    gridSubdivisions: number;
    waveColor?: string;
    playheadColor?: string;
    autoZoomOnLoop: boolean;
    loop: WaveformLoop | null;
    /** Manual zoom level (the wrapper owns the +/− buttons). */
    zoom: number;
    width: number;
    height: number;
    onSeek?: (progress: number) => void;
    onLoopChange?: (loop: WaveformLoop | null) => void;
}
interface WaveformEngine {
    destroy(): void;
}
declare const WAVEFORM_MAX_ZOOM = 8;
/**
 * Mount the renderer on `canvas`, reading the current props from `get()` every
 * frame. Returns a handle whose `destroy()` stops the loop and detaches listeners.
 */
declare function createWaveformEngine(canvas: HTMLCanvasElement, get: () => WaveformRuntime): WaveformEngine;

export { WAVEFORM_MAX_ZOOM, type WaveformEngine, type WaveformLoop, type WaveformMode, type WaveformRuntime, createWaveformEngine };
