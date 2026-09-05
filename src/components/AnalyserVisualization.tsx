import { useRef, useEffect } from 'react';
import { createAnalyserEngine } from '../analyser-engine';
import type { AnalyserRuntime } from '../analyser-engine';

export type {
  AnalyserSource,
  AnalyserVariant,
  AnalyserMode,
  AnalyserScale,
  AnalyserSpring,
  AnalyserTransferDraw,
} from '../analyser-engine';
import type {
  AnalyserSource,
  AnalyserVariant,
  AnalyserMode,
  AnalyserScale,
  AnalyserSpring,
  AnalyserTransferDraw,
} from '../analyser-engine';

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
   * 'transfer' — an XY plot of `analyser` (horizontal) against `analyserB`
   * (vertical): a memoryless shaper draws its transfer curve, time-dependent
   * processing opens it into loops. 'overlay' — both signals as waveforms on one
   * axis (input behind, output in front), synced to a rising zero crossing so
   * periodic tones hold still.
   */
  source?: AnalyserSource;
  /**
   * Transfer / overlay only: the second signal tap — the processed output that
   * `analyser` (the input) is compared against. Same passive, never-mutated
   * contract as `analyser`.
   */
  analyserB?: AnalyserNode | null;
  /** Output-trace / Y-axis color for transfer and overlay. Defaults to `waveColor`. */
  waveColorB?: string;
  /**
   * Transfer only: 'segments' (default) connects successive samples into a
   * curve; 'scatter' plots isolated dots — steadier reading on noisy signals.
   */
  transferDraw?: AnalyserTransferDraw;
  /**
   * Overlay only: samples shown after the sync point — a horizontal zoom.
   * Null / absent shows the analyser's whole buffer.
   */
  windowSize?: number | null;
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
  /** Spectrum only: confine the display to this frequency window in Hz. */
  rangeHz?: readonly [number, number] | null;
  /** Spectrum only: a live vertical reference in Hz, read every frame. */
  marker?: (() => number | null) | null;
  width?: number;
  height?: number;
}

export function AnalyserVisualization({
  analyser = null,
  analyserB = null,
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
  waveColorB,
  transferDraw = 'segments',
  windowSize = null,
  muted = false,
  onMuteChange,
  soloed = false,
  onSoloChange,
  rangeHz = null,
  marker = null,
  width = 256,
  height = 140,
}: AnalyserVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Latest props, read by the engine each frame so a prop change never restarts it.
  const runtimeRef = useRef<AnalyserRuntime>(null as unknown as AnalyserRuntime);
  runtimeRef.current = {
    analyser,
    analyserB,
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
    waveColorB,
    transferDraw,
    windowSize,
    muted,
    rangeHz,
    marker,
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
