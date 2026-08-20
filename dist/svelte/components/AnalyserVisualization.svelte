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

<div class="tweakers-analyser-viz-wrap" style={`width:${width}px`}>
  <canvas
    bind:this={canvasEl}
    class="tweakers-analyser-viz"
    style={`width:${width}px;height:${height}px`}
  ></canvas>
  {#if onMuteChange || onSoloChange}
    <div class="tweakers-analyser-actions">
      {#if onMuteChange}
        <button type="button" aria-label="Mute" aria-pressed={muted} onclick={() => onMuteChange?.(!muted)}>M</button>
      {/if}
      {#if onSoloChange}
        <button type="button" aria-label="Solo" aria-pressed={soloed} onclick={() => onSoloChange?.(!soloed)}>S</button>
      {/if}
    </div>
  {/if}
</div>
