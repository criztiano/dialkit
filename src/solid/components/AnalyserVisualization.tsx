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
    <div class="dialkit-analyser-viz-wrap" style={{ width: `${p.width}px` }}>
      <canvas
        ref={canvasEl}
        class="dialkit-analyser-viz"
        style={{ width: `${p.width}px`, height: `${p.height}px` }}
      />
      <Show when={p.onMuteChange || p.onSoloChange}>
        <div class="dialkit-analyser-actions">
          <Show when={p.onMuteChange}>
            <button type="button" aria-label="Mute" aria-pressed={p.muted} onClick={() => p.onMuteChange?.(!p.muted)}>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 6 H5 L8.5 3 V13 L5 10 H3 Z" fill="currentColor" />
                <path d="M10.5 6 L13.5 10 M13.5 6 L10.5 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
          </Show>
          <Show when={p.onSoloChange}>
            <button type="button" aria-label="Solo" aria-pressed={p.soloed} onClick={() => p.onSoloChange?.(!p.soloed)}>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3.4 12 V8.8 a4.6 4.6 0 0 1 9.2 0 V12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <rect x="2.6" y="9.9" width="1.8" height="2.9" rx="0.9" fill="currentColor" />
                <rect x="11.6" y="9.9" width="1.8" height="2.9" rx="0.9" fill="currentColor" />
              </svg>
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
}
