import { createSignal, mergeProps, onCleanup, onMount, Show } from 'solid-js';
import { createWaveformEngine, WAVEFORM_MAX_ZOOM } from '../../waveform-engine';
import type { WaveformRuntime, WaveformMode, WaveformLoop } from '../../waveform-engine';

export type { WaveformMode, WaveformLoop } from '../../waveform-engine';

interface WaveformVisualizationProps {
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
}

export function WaveformVisualization(props: WaveformVisualizationProps) {
  const p = mergeProps(
    {
      buffer: null as AudioBuffer | null,
      progress: 0,
      mode: 'smooth' as WaveformMode,
      border: false,
      bands: false,
      pixelSize: 1,
      grid: false,
      gridSubdivisions: 8,
      loop: null as WaveformLoop | null,
      autoZoomOnLoop: false,
      width: 256,
      height: 140,
    },
    props
  );

  const [zoom, setZoom] = createSignal(1);
  let canvasEl: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasEl) return;
    const engine = createWaveformEngine(
      canvasEl,
      (): WaveformRuntime => ({
        buffer: p.buffer,
        progress: p.progress,
        getProgress: p.getProgress,
        mode: p.mode,
        border: p.border,
        bands: p.bands,
        pixelSize: p.pixelSize,
        grid: p.grid,
        gridSubdivisions: p.gridSubdivisions,
        waveColor: p.waveColor,
        playheadColor: p.playheadColor,
        autoZoomOnLoop: p.autoZoomOnLoop,
        loop: p.loop,
        zoom: zoom(),
        width: p.width,
        height: p.height,
        onSeek: p.onSeek,
        onLoopChange: p.onLoopChange,
      })
    );
    onCleanup(() => engine.destroy());
  });

  const framingLoop = () => p.autoZoomOnLoop && !!p.loop;

  return (
    <div class="dialkit-waveform-viz-wrap" style={{ width: `${p.width}px` }}>
      <canvas
        ref={canvasEl}
        class="dialkit-waveform-viz"
        style={{ width: `${p.width}px`, height: `${p.height}px` }}
      />
      <Show when={!framingLoop()}>
        <div class="dialkit-waveform-zoom">
          <Show when={zoom() > 1}>
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z / 2))}>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
          </Show>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoom() >= WAVEFORM_MAX_ZOOM}
            onClick={() => setZoom((z) => Math.min(WAVEFORM_MAX_ZOOM, z * 2))}
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </Show>
    </div>
  );
}
