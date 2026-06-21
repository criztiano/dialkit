import { useRef, useEffect, useState } from 'react';
import { createWaveformEngine, WAVEFORM_MAX_ZOOM } from '../waveform-engine';
import type { WaveformRuntime } from '../waveform-engine';

export type { WaveformMode, WaveformLoop } from '../waveform-engine';
import type { WaveformMode, WaveformLoop } from '../waveform-engine';

interface WaveformVisualizationProps {
  /** Decoded audio sample. Its full waveform is drawn once (fixed). */
  buffer?: AudioBuffer | null;
  /** Playhead position, 0..1. */
  progress?: number;
  /**
   * Polled every frame for a buttery playhead without re-rendering the parent.
   * Overrides `progress` when provided — return the current play position (0..1).
   */
  getProgress?: () => number;
  /**
   * 'smooth' — a simplified, SVG-like envelope: few points, Catmull-Rom
   * interpolation, solid fill (the gist of the sample's dynamics).
   * 'pixelated' — crisp, chunky per-column min/max bars.
   */
  mode?: WaveformMode;
  /**
   * Smooth mode only. When false (default) the shape is a solid fill; when true
   * it becomes a translucent fill with a crisp outline.
   */
  border?: boolean;
  /** Split the sample into low / mid / high bands (three color-coded shapes). */
  bands?: boolean;
  /**
   * Pixelated mode only: block-size multiplier. 1 (default) ≈ one CSS pixel per
   * column; 2 / 4 / 6 make progressively chunkier, lower-resolution columns.
   */
  pixelSize?: number;
  /** Overlay a faint reference grid (vertical time-divisions) behind the waveform. */
  grid?: boolean;
  /** Vertical time-divisions in the grid when `grid` is on (default 8). */
  gridSubdivisions?: number;
  /**
   * Click-to-seek. When provided, clicking the waveform reports the new play
   * position (0..1); a click also clears any active loop.
   */
  onSeek?: (progress: number) => void;
  /** The active loop region to render (controlled), or null for none. */
  loop?: WaveformLoop | null;
  /**
   * Drag-to-loop. When provided, dragging across the waveform reports a loop
   * region; drag either edge to resize it; clicking reports null (loop cleared).
   */
  onLoopChange?: (loop: WaveformLoop | null) => void;
  /** Waveform color (single waveform only; bands keep their fixed colors). Defaults to the theme color. */
  waveColor?: string;
  /** Playhead color; the loop band derives from it at a lower opacity. Defaults to the theme color. */
  playheadColor?: string;
  /** When true, selecting a loop auto-zooms to frame it (manual zoom resumes once the loop is cleared). */
  autoZoomOnLoop?: boolean;
  width?: number;
  height?: number;
}

export function WaveformVisualization({
  buffer = null,
  progress = 0,
  getProgress,
  mode = 'smooth',
  border = false,
  bands = false,
  pixelSize = 1,
  grid = false,
  gridSubdivisions = 8,
  onSeek,
  loop = null,
  onLoopChange,
  waveColor,
  playheadColor,
  autoZoomOnLoop = false,
  width = 256,
  height = 140,
}: WaveformVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);

  // Latest props, read by the engine each frame so a prop change never restarts it.
  const runtimeRef = useRef<WaveformRuntime>(null as unknown as WaveformRuntime);
  runtimeRef.current = {
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
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = createWaveformEngine(canvasRef.current, () => runtimeRef.current);
    return () => engine.destroy();
  }, []);

  const atMaxZoom = zoom >= WAVEFORM_MAX_ZOOM;
  // While auto-zoom frames a loop, manual zoom is suspended — hide its controls.
  const framingLoop = autoZoomOnLoop && !!loop;

  return (
    <div className="dialkit-waveform-viz-wrap" style={{ width }}>
      <canvas ref={canvasRef} className="dialkit-waveform-viz" style={{ width, height }} />
      {!framingLoop && (
        <div className="dialkit-waveform-zoom">
          {zoom > 1 && (
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z / 2))}>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button
            type="button"
            aria-label="Zoom in"
            disabled={atMaxZoom}
            onClick={() => setZoom((z) => Math.min(WAVEFORM_MAX_ZOOM, z * 2))}
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
