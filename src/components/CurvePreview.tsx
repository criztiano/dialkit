import { useCallback, useSyncExternalStore } from 'react';
import { DialStore, ControlMeta } from '../store/DialStore';
import { plotCurve, curvePathData, curveY, clampCurveHeight } from '../curve-preview-core';

interface CurvePreviewProps {
  panelId: string;
  control: ControlMeta;
}

// Logical drawing width. The SVG stretches to the row (preserveAspectRatio
// "none"); non-scaling strokes keep the line weight honest under the stretch.
const VIEW_WIDTH = 232;
// Vertical inset so the stroke never clips at the domain extremes.
const PAD_Y = 4;

/**
 * The read-only `{ type: 'curve' }` row: draws the host-supplied sampler on a
 * dial surface. The sampler lives on the ControlMeta and is swapped in place
 * by DialStore.syncCurveSamples (functions are invisible to the config diff),
 * with the swap announced on the control-state channel — so this subscribes
 * there and re-reads the function each snapshot.
 */
export function CurvePreview({ panelId, control }: CurvePreviewProps) {
  const subscribe = useCallback(
    (callback: () => void) => DialStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const sample = useSyncExternalStore(subscribe, () => control.sample, () => control.sample);

  const height = clampCurveHeight(control.height);
  const plot = plotCurve(sample ?? (() => NaN), { domain: control.domain });
  const pathData = curvePathData(plot.segments, VIEW_WIDTH, height, PAD_Y);
  const baselineY = plot.baseline !== null ? curveY(plot.baseline, height, PAD_Y) : null;

  return (
    <div className="dialkit-curve">
      {!control.hideLabel && <span className="dialkit-curve-label">{control.label}</span>}
      <svg
        className="dialkit-curve-surface"
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
        role="img"
        aria-label={control.label}
      >
        {baselineY !== null && (
          <line
            className="dialkit-curve-baseline"
            x1={0}
            y1={baselineY}
            x2={VIEW_WIDTH}
            y2={baselineY}
            vectorEffect="non-scaling-stroke"
          />
        )}
        {pathData && (
          <path className="dialkit-curve-stroke" d={pathData} fill="none" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
    </div>
  );
}
