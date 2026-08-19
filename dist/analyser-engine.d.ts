type AnalyserScale = 'log' | 'linear';
/** `true` enables the default spring; an object overrides stiffness/damping. */
type AnalyserSpring = boolean | {
    stiffness?: number;
    damping?: number;
};

type AnalyserSource = 'frequency' | 'waveform' | 'ekg';
type AnalyserVariant = 'line' | 'area';
type AnalyserMode = 'smooth' | 'pixelated';
/** Everything the engine reads each frame. Wrappers supply a getter for the live values. */
interface AnalyserRuntime {
    analyser: AnalyserNode | null;
    source: AnalyserSource;
    variant: AnalyserVariant;
    mode: AnalyserMode;
    pixelSize: number;
    scale: AnalyserScale;
    spring: AnalyserSpring;
    grid: boolean;
    gridSubdivisions: number;
    waveColor?: string;
    fillColor?: string;
    /** Dims the trace as feedback — the host owns the actual gain routing. */
    muted: boolean;
    width: number;
    height: number;
}
interface AnalyserEngine {
    destroy(): void;
}
/**
 * Mount the renderer on `canvas`, reading the current props from `get()` every
 * frame. Returns a handle whose `destroy()` stops the loop.
 *
 * Smoothing layers compose rather than compete: the analyser's own
 * `smoothingTimeConstant` smooths the *data* (and is left untouched here), while
 * the `spring` option smooths the *rendering* on top — it can overshoot, the
 * analyser's smoothing never does.
 */
declare function createAnalyserEngine(canvas: HTMLCanvasElement, get: () => AnalyserRuntime): AnalyserEngine;

export { type AnalyserEngine, type AnalyserMode, type AnalyserRuntime, type AnalyserScale, type AnalyserSource, type AnalyserSpring, type AnalyserVariant, createAnalyserEngine };
