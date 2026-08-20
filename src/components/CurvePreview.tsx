import { useCallback, useSyncExternalStore } from 'react';
import { TweakStore, ControlMeta } from '../store/TweakStore';
import { plotCurve, curvePathData, curveY, clampCurveHeight, normalizeCurveMarkers } from '../curve-preview-core';

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
 * control surface. The sampler and markers live on the ControlMeta and are
 * swapped in place by TweakStore.syncCurveConfigs (functions are invisible to
 * the config diff; markers ride the same sync), with the swap announced on the
 * control-state channel — so this subscribes there and re-reads each snapshot.
 */
export function CurvePreview({ panelId, control }: CurvePreviewProps) {
  const subscribe = useCallback(
    (callback: () => void) => TweakStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const sample = useSyncExternalStore(subscribe, () => control.sample, () => control.sample);
  // syncCurveConfigs only replaces the array when the values changed, so this
  // snapshot is referentially stable between real updates.
  const markers = useSyncExternalStore(subscribe, () => control.markers, () => control.markers);

  const height = clampCurveHeight(control.height);
  const plot = plotCurve(sample ?? (() => NaN), { domain: control.domain });
  const pathData = curvePathData(plot.segments, VIEW_WIDTH, height, PAD_Y);
  const baselineY = plot.baseline !== null ? curveY(plot.baseline, height, PAD_Y) : null;
  const markerXs = normalizeCurveMarkers(markers);

  return (
    <div className="tweakers-curve">
      {!control.hideLabel && <span className="tweakers-curve-label">{control.label}</span>}
      <svg
        className="tweakers-curve-surface"
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
        role="img"
        aria-label={control.label}
      >
        {baselineY !== null && (
          <line
            className="tweakers-curve-baseline"
            x1={0}
            y1={baselineY}
            x2={VIEW_WIDTH}
            y2={baselineY}
            vectorEffect="non-scaling-stroke"
          />
        )}
        {markerXs.map((m, i) => (
          <line
            key={i}
            className="tweakers-curve-marker"
            x1={m * VIEW_WIDTH}
            y1={0}
            x2={m * VIEW_WIDTH}
            y2={height}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {pathData && (
          <path className="tweakers-curve-stroke" d={pathData} fill="none" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
    </div>
  );
}
