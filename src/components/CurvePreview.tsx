import { useHints } from '../hooks/useHints';
import { useLiveConfig } from '../hooks/useLiveConfig';
import { clampCurveHeight, curvePathData, curveY, normalizeCurveMarkers, plotCurve } from '../curve-preview';
import type { ControlMeta } from '../store/DialStore';

interface CurvePreviewProps {
  panelId: string;
  control: ControlMeta;
}

// The SVG stretches to the row; non-scaling strokes keep the line weight.
const VIEW_WIDTH = 232;
// Inset so the stroke never clips at the domain's ends.
const PAD_Y = 4;

/** The read-only `{ type: 'curve' }` row: the app's sampler, drawn. */
export function CurvePreview({ panelId, control }: CurvePreviewProps) {
  useHints(!!control.hint);
  const config = useLiveConfig(panelId, control, 'curve');
  const height = clampCurveHeight(config?.height);
  const plot = plotCurve(config?.sample ?? (() => NaN), { domain: config?.domain });
  const pathData = curvePathData(plot.segments, VIEW_WIDTH, height, PAD_Y);
  const baselineY = plot.baseline !== null ? curveY(plot.baseline, height, PAD_Y) : null;
  const label = typeof config?.label === 'string' ? config.label : control.label;
  const aspect = config?.aspect;

  return (
    <div className="dialkit-graph" data-hint={control.hint}>
      <div className="dialkit-graph-surface dialkit-curve" data-bare={config?.label === false || undefined}>
        {config?.label !== false && <span className="dialkit-graph-label">{label}</span>}
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
          preserveAspectRatio="none"
          style={aspect !== undefined ? { height: 'auto', aspectRatio: aspect } : { height }}
          role="img"
          aria-label={label}
        >
          {baselineY !== null && (
            <line className="dialkit-easing-reference" x1={0} y1={baselineY} x2={VIEW_WIDTH} y2={baselineY} vectorEffect="non-scaling-stroke" />
          )}
          {normalizeCurveMarkers(config?.markers).map((m, i) => (
            <line key={i} className="dialkit-curve-marker" x1={m * VIEW_WIDTH} y1={0} x2={m * VIEW_WIDTH} y2={height} vectorEffect="non-scaling-stroke" />
          ))}
          {pathData && <path className="dialkit-graph-stroke" d={pathData} vectorEffect="non-scaling-stroke" />}
        </svg>
      </div>
    </div>
  );
}
