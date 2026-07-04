<script lang="ts">
  import { onMount } from 'svelte';
  import { createAnalyserEngine } from '../../analyser-engine';
  import type {
    AnalyserRuntime,
    AnalyserSource,
    AnalyserVariant,
    AnalyserMode,
    AnalyserScale,
    AnalyserSpring,
  } from '../../analyser-engine';

  let {
    analyser = null,
    source = 'frequency',
    variant = 'area',
    mode = 'smooth',
    pixelSize = 1,
    scale = 'log',
    spring = false,
    grid = false,
    gridSubdivisions = 8,
    waveColor = undefined,
    fillColor = undefined,
    muted = false,
    onMuteChange = undefined,
    soloed = false,
    onSoloChange = undefined,
    width = 256,
    height = 140,
  } = $props<{
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
  }>();

  let canvasEl: HTMLCanvasElement;

  onMount(() => {
    const engine = createAnalyserEngine(
      canvasEl,
      (): AnalyserRuntime => ({
        analyser,
        source,
        variant,
        mode,
        pixelSize,
        scale,
        spring,
        grid,
        gridSubdivisions,
        waveColor,
        fillColor,
        muted,
        width,
        height,
      })
    );
    return () => engine.destroy();
  });
</script>

<div class="dialkit-analyser-viz-wrap" style={`width:${width}px`}>
  <canvas
    bind:this={canvasEl}
    class="dialkit-analyser-viz"
    style={`width:${width}px;height:${height}px`}
  ></canvas>
  {#if onMuteChange || onSoloChange}
    <div class="dialkit-analyser-actions">
      {#if onMuteChange}
        <button type="button" aria-label="Mute" aria-pressed={muted} onclick={() => onMuteChange?.(!muted)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 6 H5 L8.5 3 V13 L5 10 H3 Z" fill="currentColor" />
            <path d="M10.5 6 L13.5 10 M13.5 6 L10.5 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      {/if}
      {#if onSoloChange}
        <button type="button" aria-label="Solo" aria-pressed={soloed} onclick={() => onSoloChange?.(!soloed)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3.4 12 V8.8 a4.6 4.6 0 0 1 9.2 0 V12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <rect x="2.6" y="9.9" width="1.8" height="2.9" rx="0.9" fill="currentColor" />
            <rect x="11.6" y="9.9" width="1.8" height="2.9" rx="0.9" fill="currentColor" />
          </svg>
        </button>
      {/if}
    </div>
  {/if}
</div>
