import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { TweakStore, ControlMeta } from 'tweakers/store';
import { clampCurveHeight } from 'tweakers/curve-preview-core';
import { AnalyserVisualization } from './AnalyserVisualization';

interface AnalyserRowProps {
  panelId: string;
  control: ControlMeta;
}

// The row's default surface height — shorter than the standalone component's
// 140: inside a panel column this is a monitor, not a hero visual.
const DEFAULT_HEIGHT = 56;

/**
 * The read-only `{ type: 'analyser' }` row: the standalone
 * `AnalyserVisualization` embedded on a control surface. The whole row config
 * (including its two closures — the AnalyserNode getter and the live marker)
 * lives on the ControlMeta and is swapped in place by
 * `TweakStore.syncCurveConfigs`, exactly like the curve row's sampler; this
 * subscribes on the control-state channel and re-reads each swap, which is
 * also what picks up an AnalyserNode that only exists after the host's audio
 * context starts.
 *
 * The canvas engine needs a pixel width, and a panel column's width is the
 * layout's business — so the row measures itself and follows.
 */
export function AnalyserRow({ panelId, control }: AnalyserRowProps) {
  const subscribe = useCallback(
    (callback: () => void) => TweakStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const row = useSyncExternalStore(subscribe, () => control.analyserRow, () => control.analyserRow);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = clampCurveHeight(row?.height ?? DEFAULT_HEIGHT);

  return (
    <div className="tweakers-analyser-row" ref={wrapRef}>
      {!control.hideLabel && <span className="tweakers-curve-label">{control.label}</span>}
      {row && width > 0 && (
        <AnalyserVisualization
          analyser={row.analyser() ?? null}
          source={row.source ?? 'frequency'}
          variant={row.variant ?? 'area'}
          // Pixelated by default: on a control surface the row speaks the
          // waveform visualizer's block language, not the hero smooth trace.
          mode={row.mode ?? 'pixelated'}
          pixelSize={row.pixelSize ?? 2}
          scale={row.scale ?? 'log'}
          spring={row.spring ?? false}
          rangeHz={row.rangeHz ?? null}
          marker={row.marker ?? null}
          width={width}
          height={height}
        />
      )}
    </div>
  );
}
