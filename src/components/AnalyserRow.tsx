import { useEffect, useRef, useState } from 'react';
import { useHints } from '../hooks/useHints';
import { useLiveConfig } from '../hooks/useLiveConfig';
import { clampCurveHeight } from '../curve-preview';
import { createAnalyserEngine, type AnalyserRuntime } from '../analyser-engine';
import type { ControlMeta } from '../store/DialStore';

interface AnalyserRowProps {
  panelId: string;
  control: ControlMeta;
}

/**
 * The read-only `{ type: 'analyser' }` row: a live spectrum or oscilloscope.
 * The canvas needs a pixel width, so the row measures itself.
 */
export function AnalyserRow({ panelId, control }: AnalyserRowProps) {
  useHints(!!control.hint);
  const config = useLiveConfig(panelId, control, 'analyser');
  const plotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);
  const [live, setLive] = useState(false);
  const height = clampCurveHeight(config?.height ?? 56);
  const label = typeof config?.label === 'string' ? config.label : control.label;

  // The engine reads the latest options every frame, so a change never restarts it.
  // The node getter is called each frame too: a node that arrives once the
  // app's audio context starts shows up without a rebuild.
  const latest = useRef({ config, width, height });
  latest.current = { config, width, height };

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = createAnalyserEngine(canvasRef.current, (): AnalyserRuntime => {
      const { config, width, height } = latest.current;
      return {
        analyser: config?.analyser() ?? null,
        source: config?.source ?? 'frequency',
        variant: config?.variant ?? 'area',
        mode: config?.mode ?? 'smooth',
        pixelSize: config?.pixelSize ?? 2,
        scale: config?.scale ?? 'log',
        spring: config?.spring ?? false,
        rangeHz: config?.rangeHz,
        marker: config?.marker,
        width,
        height,
      };
    }, setLive);
    return () => engine.destroy();
  }, []);

  return (
    <div className="dialkit-graph" data-hint={control.hint}>
      {config?.label !== false && <div className="dialkit-graph-caption"><span className="dialkit-graph-label">{label}</span></div>}
      <div className="dialkit-graph-surface dialkit-curve">
        <div ref={plotRef} className="dialkit-analyser-plot" data-live={live || undefined} style={{ height }}>
          <canvas ref={canvasRef} className="dialkit-analyser-canvas" style={{ width, height }} role="img" aria-label={label} />
          {!live && <span className="dialkit-analyser-empty">Start audio to see the signal</span>}
        </div>
      </div>
    </div>
  );
}
