/** Per-column minimum and maximum sample amplitudes, packed into parallel arrays. */
export type Peaks = {
    min: Float32Array;
    max: Float32Array;
};
/** Down-mix every channel to a single mono track (channel average). Mono passes through. */
export declare function mixToMono(buffer: AudioBuffer): Float32Array;
export declare function fillPeaks(data: Float32Array, cols: number, min: Float32Array, max: Float32Array): void;
export declare function envelope(p: Peaks, cols: number, n: number): number[];
//# sourceMappingURL=waveform-dsp.d.ts.map