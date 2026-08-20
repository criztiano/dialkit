import { mergeProps, onCleanup, onMount, Show } from 'solid-js';
import { createAnalyserEngine } from '../../analyser-engine';
import type {
  AnalyserRuntime,
  AnalyserSource,
  AnalyserVariant,
  AnalyserMode,
  AnalyserScale,
  AnalyserSpring,
} from '../../analyser-engine';

export type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from '../../analyser-engine';

interface AnalyserVisualizationProps {
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
}

export function AnalyserVisualization(props: AnalyserVisualizationProps) {
  const p = mergeProps(
    {
      analyser: null as AnalyserNode | null,
      source: 'frequency' as AnalyserSource,
      variant: 'area' as AnalyserVariant,
      mode: 'smooth' as AnalyserMode,
      pixelSize: 1,
      scale: 'log' as AnalyserScale,
      spring: false as AnalyserSpring,
      grid: false,
      gridSubdivisions: 8,
      muted: false,
      soloed: false,
      width: 256,
      height: 140,
    },
    props
  );

  let canvasEl: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasEl) return;
    const engine = createAnalyserEngine(
      canvasEl,
      (): AnalyserRuntime => ({
        analyser: p.analyser,
        source: p.source,
        variant: p.variant,
        mode: p.mode,
        pixelSize: p.pixelSize,
        scale: p.scale,
        spring: p.spring,
        grid: p.grid,
        gridSubdivisions: p.gridSubdivisions,
        waveColor: p.waveColor,
        fillColor: p.fillColor,
        muted: p.muted,
        width: p.width,
        height: p.height,
      })
    );
    onCleanup(() => engine.destroy());
  });

  return (
    <div class="tweakers-analyser-viz-wrap" style={{ width: `${p.width}px` }}>
      <canvas
        ref={canvasEl}
        class="tweakers-analyser-viz"
        style={{ width: `${p.width}px`, height: `${p.height}px` }}
      />
      <Show when={p.onMuteChange || p.onSoloChange}>
        <div class="tweakers-analyser-actions">
          <Show when={p.onMuteChange}>
            <button type="button" aria-label="Mute" aria-pressed={p.muted} onClick={() => p.onMuteChange?.(!p.muted)}>
              M
            </button>
          </Show>
          <Show when={p.onSoloChange}>
            <button type="button" aria-label="Solo" aria-pressed={p.soloed} onClick={() => p.onSoloChange?.(!p.soloed)}>
              S
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
}
