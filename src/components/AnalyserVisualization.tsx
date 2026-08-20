import { useRef, useEffect } from 'react';
import { createAnalyserEngine } from '../analyser-engine';
import type { AnalyserRuntime } from '../analyser-engine';

export type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from '../analyser-engine';
import type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from '../analyser-engine';

interface AnalyserVisualizationProps {
  /**
   * The Web Audio analyser to visualize. Purely observed — the component never
   * mutates it, so fftSize, smoothingTimeConstant, and the minDecibels..maxDecibels
   * window (which the byte data maps onto) stay under the host's control.
   */
  analyser?: AnalyserNode | null;
  /**
   * 'frequency' — live spectrum (EQ-style). 'waveform' — time-domain oscilloscope.
   * 'ekg' — a medical-monitor trace: a pen dot fixed at the right edge rides the
   * signal's level while the history it draws streams away to the left.
   */
  source?: AnalyserSource;
  /** 'area' — translucent fill under the trace plus a crisp outline. 'line' — outline only. */
  variant?: AnalyserVariant;
  /**
   * 'smooth' — a simplified, interpolated trace. 'pixelated' — crisp, chunky
   * per-column blocks (the waveform visualizer's pixel language).
   */
  mode?: AnalyserMode;
  /**
   * Pixelated mode only: block-size multiplier. 1 (default) ≈ one CSS pixel per
   * column; 2 / 4 / 6 make progressively chunkier, lower-resolution columns.
   */
  pixelSize?: number;
  /** Frequency-axis spacing for the spectrum: 'log' (default, musical) or 'linear'. */
  scale?: AnalyserScale;
  /**
   * Spring-smooth the trace's movement (render-side; composes with the analyser's
   * own data-side smoothingTimeConstant — the spring can overshoot, that never does).
   * `true` for the default feel, or `{ stiffness, damping }` to tune it.
   */
  spring?: AnalyserSpring;
  /** Overlay a faint reference grid (vertical divisions) behind the trace. */
  grid?: boolean;
  /** Vertical divisions in the grid when `grid` is on (default 8). */
  gridSubdivisions?: number;
  /** Trace color. Defaults to the theme color. */
  waveColor?: string;
  /** Area-fill color (drawn translucent). Defaults to `waveColor`. */
  fillColor?: string;
  /**
   * Controlled mute state: dims the trace as feedback. The analyser is a passive
   * tap, so actually silencing the channel is the host's job (gain routing).
   */
  muted?: boolean;
  /** Shows the mute button; called with the requested state on click. */
  onMuteChange?: (muted: boolean) => void;
  /** Controlled solo state (cross-channel — the host owns what "solo" silences). */
  soloed?: boolean;
  /** Shows the solo button; called with the requested state on click. */
  onSoloChange?: (soloed: boolean) => void;
  width?: number;
  height?: number;
}

export function AnalyserVisualization({
  analyser = null,
  source = 'frequency',
  variant = 'area',
  mode = 'smooth',
  pixelSize = 1,
  scale = 'log',
  spring = false,
  grid = false,
  gridSubdivisions = 8,
  waveColor,
  fillColor,
  muted = false,
  onMuteChange,
  soloed = false,
  onSoloChange,
  width = 256,
  height = 140,
}: AnalyserVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Latest props, read by the engine each frame so a prop change never restarts it.
  const runtimeRef = useRef<AnalyserRuntime>(null as unknown as AnalyserRuntime);
  runtimeRef.current = {
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
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = createAnalyserEngine(canvasRef.current, () => runtimeRef.current);
    return () => engine.destroy();
  }, []);

  return (
    <div className="tweakers-analyser-viz-wrap" style={{ width }}>
      <canvas ref={canvasRef} className="tweakers-analyser-viz" style={{ width, height }} />
      {(onMuteChange || onSoloChange) && (
        <div className="tweakers-analyser-actions">
          {onMuteChange && (
            <button type="button" aria-label="Mute" aria-pressed={muted} onClick={() => onMuteChange(!muted)}>
              M
            </button>
          )}
          {onSoloChange && (
            <button type="button" aria-label="Solo" aria-pressed={soloed} onClick={() => onSoloChange(!soloed)}>
              S
            </button>
          )}
        </div>
      )}
    </div>
  );
}
