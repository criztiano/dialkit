type AnalyserScale = 'log' | 'linear';
/** `true` enables the default spring; an object overrides stiffness/damping. */
type AnalyserSpring = boolean | {
    stiffness?: number;
    damping?: number;
};

type AnalyserSource = 'frequency' | 'waveform' | 'ekg' | 'transfer' | 'overlay';
type AnalyserVariant = 'line' | 'area';
type AnalyserMode = 'smooth' | 'pixelated';
/** Transfer view: connect the samples ('segments') or plot isolated dots ('scatter'). */
type AnalyserTransferDraw = 'segments' | 'scatter';
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
    /**
     * Spectrum only: confine the display to this frequency window in Hz — a
     * zoomed-in analyser (a low-end monitor, a presence band). Null / absent is
     * the full range. Nyquist comes from the analyser's own context.
     */
    rangeHz?: readonly [number, number] | null;
    /**
     * Spectrum only: a live vertical reference in Hz, read every frame — the
     * host points it at whatever its own parameter says (a filter corner, a
     * tracking focus). Null (or out of the window) draws nothing.
     */
    marker?: (() => number | null) | null;
    /**
     * Transfer / overlay only: the second signal tap (the processed output the
     * first signal is compared against). Same read-only contract as `analyser`.
     */
    analyserB?: AnalyserNode | null;
    /** Second trace / Y-axis color for transfer and overlay. Defaults to `waveColor`. */
    waveColorB?: string;
    /** Transfer only: 'segments' (default) connects samples, 'scatter' plots dots. */
    transferDraw?: AnalyserTransferDraw;
    /**
     * Overlay only: how many time-domain samples the window shows after the
     * zero-cross sync point. Null / absent shows the whole buffer.
     */
    windowSize?: number | null;
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

export { type AnalyserEngine, type AnalyserMode, type AnalyserRuntime, type AnalyserScale, type AnalyserSource, type AnalyserSpring, type AnalyserTransferDraw, type AnalyserVariant, createAnalyserEngine };
