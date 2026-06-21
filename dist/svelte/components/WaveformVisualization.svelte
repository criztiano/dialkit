<script lang="ts">
  import { onMount } from 'svelte';
  import { createWaveformEngine, WAVEFORM_MAX_ZOOM } from '../../waveform-engine';
  import type { WaveformRuntime, WaveformMode, WaveformLoop } from '../../waveform-engine';

  let {
    buffer = null,
    progress = 0,
    getProgress = undefined,
    mode = 'smooth',
    border = false,
    bands = false,
    pixelSize = 1,
    grid = false,
    gridSubdivisions = 8,
    onSeek = undefined,
    loop = null,
    onLoopChange = undefined,
    waveColor = undefined,
    playheadColor = undefined,
    autoZoomOnLoop = false,
    width = 256,
    height = 140,
  } = $props<{
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
  }>();

  let zoom = $state(1);
  let canvasEl: HTMLCanvasElement;

  onMount(() => {
    const engine = createWaveformEngine(
      canvasEl,
      (): WaveformRuntime => ({
        buffer,
        progress,
        getProgress,
        mode,
        border,
        bands,
        pixelSize,
        grid,
        gridSubdivisions,
        waveColor,
        playheadColor,
        autoZoomOnLoop,
        loop,
        zoom,
        width,
        height,
        onSeek,
        onLoopChange,
      })
    );
    return () => engine.destroy();
  });

  const framingLoop = $derived(autoZoomOnLoop && !!loop);
</script>

<div class="dialkit-waveform-viz-wrap" style={`width:${width}px`}>
  <canvas
    bind:this={canvasEl}
    class="dialkit-waveform-viz"
    style={`width:${width}px;height:${height}px`}
  ></canvas>
  {#if !framingLoop}
    <div class="dialkit-waveform-zoom">
      {#if zoom > 1}
        <button type="button" aria-label="Zoom out" onclick={() => (zoom = Math.max(1, zoom / 2))}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      {/if}
      <button
        type="button"
        aria-label="Zoom in"
        disabled={zoom >= WAVEFORM_MAX_ZOOM}
        onclick={() => (zoom = Math.min(WAVEFORM_MAX_ZOOM, zoom * 2))}
      >
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  {/if}
</div>
