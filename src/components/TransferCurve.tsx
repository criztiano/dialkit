import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { useHints } from '../hooks/useHints';
import {
  DEFAULT_TRANSFER, TRANSFER_MAX_POINTS, insertPoint, isIdentityTransfer, movePoint, nearestPoint,
  normalizeTransfer, removePoint, transferPath, type DialTransferConfig, type DialTransferValue,
} from '../transfer';

interface TransferCurveProps extends Omit<DialTransferConfig, 'type' | 'default'> {
  label: string;
  value: DialTransferValue;
  onChange: (value: DialTransferValue) => void;
  hint?: string;
}

const GRAB_PX = 9;   // pointer slack for grabbing a point
const DROP_PX = 26;  // drag a point this far outside the plot to delete it
const NUDGE = 0.01;

/**
 * A curve you draw instead of numbers you guess. Drag a point; click the
 * plot to add one; drag a point out of the plot, or press Delete, to remove
 * it; double-click to straighten the curve. Arrow keys move a focused point.
 */
export function TransferCurve({ label, value, onChange, height = 104, grid = 4, axisLabels, hint }: TransferCurveProps) {
  useHints(!!hint);
  const plotRef = useRef<HTMLDivElement>(null);
  const handleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropping, setDropping] = useState(false);
  const points = normalizeTransfer(value).points;
  const plotHeight = Math.min(200, Math.max(64, height));
  const path = useMemo(() => transferPath(points), [points]);

  // Pointer to curve space; the plot is y-down, the curve y-up.
  const toCurve = useCallback((clientX: number, clientY: number) => {
    const r = plotRef.current!.getBoundingClientRect();
    return {
      x: (clientX - r.left) / r.width,
      y: 1 - (clientY - r.top) / r.height,
      outside: Math.max(r.left - clientX, clientX - r.right, r.top - clientY, clientY - r.bottom) > DROP_PX,
      tolerance: GRAB_PX / Math.min(r.width, r.height),
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const { x, y, tolerance } = toCurve(e.clientX, e.clientY);
    const hit = nearestPoint(points, x, y, tolerance);
    if (hit >= 0) {
      setDragIndex(hit);
      handleRefs.current[hit]?.focus({ preventScroll: true });
      return;
    }
    if (points.length >= TRANSFER_MAX_POINTS) return;
    // One gesture adds a point and places it.
    const { points: next, index } = insertPoint(points, x, y);
    onChange({ points: next });
    if (index >= 0) setDragIndex(index);
  };

  useEffect(() => {
    if (dragIndex === null) return;
    const removable = dragIndex > 0 && dragIndex < points.length - 1;
    const move = (e: PointerEvent) => {
      const { x, y, outside } = toCurve(e.clientX, e.clientY);
      setDropping(outside && removable);
      onChange({ points: movePoint(points, dragIndex, x, y) });
    };
    const up = (e: PointerEvent) => {
      if (removable && toCurve(e.clientX, e.clientY).outside) onChange({ points: removePoint(points, dragIndex) });
      setDragIndex(null);
      setDropping(false);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [dragIndex, points, onChange, toCurve]);

  const onKeyDown = (index: number) => (e: KeyboardEvent) => {
    const step = e.shiftKey ? NUDGE * 10 : NUDGE;
    const p = points[index];
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[e.key]) {
      e.preventDefault();
      onChange({ points: movePoint(points, index, p.x + moves[e.key][0], p.y + moves[e.key][1]) });
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && index > 0 && index < points.length - 1) {
      e.preventDefault();
      onChange({ points: removePoint(points, index) });
      handleRefs.current[index - 1]?.focus();
    }
  };

  const lines = grid > 0 ? Array.from({ length: grid - 1 }, (_, i) => ((i + 1) * 100) / grid) : [];

  return (
    <div className="dialkit-graph" data-hint={hint}>
      <div className="dialkit-graph-surface dialkit-transfer" style={{ height: plotHeight + 40 }} data-idle={isIdentityTransfer(points) || undefined}>
        <span className="dialkit-graph-label">{label}</span>
        {axisLabels?.y && <span className="dialkit-transfer-axis">{axisLabels.y}</span>}
        <div
          ref={plotRef}
          className="dialkit-transfer-plot"
          data-dropping={dropping || undefined}
          onPointerDown={onPointerDown}
          onDoubleClick={() => onChange({ points: DEFAULT_TRANSFER.points.map((p) => ({ ...p })) })}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {lines.map((p) => (
              <g key={p}>
                <line className="dialkit-transfer-grid" x1={p} y1="0" x2={p} y2="100" vectorEffect="non-scaling-stroke" />
                <line className="dialkit-transfer-grid" x1="0" y1={p} x2="100" y2={p} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
            <line className="dialkit-easing-reference" x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" />
            <path className="dialkit-graph-stroke" d={path} vectorEffect="non-scaling-stroke" />
          </svg>
          {/* Points sit outside the stretched SVG, so they stay round. */}
          {points.map((p, i) => (
            <button
              key={i}
              ref={(el) => { handleRefs.current[i] = el; }}
              type="button"
              className="dialkit-easing-handle dialkit-transfer-point"
              data-dragging={dragIndex === i || undefined}
              aria-label={`${label} point ${i + 1}: in ${p.x.toFixed(2)}, out ${p.y.toFixed(2)}`}
              style={{ left: `${p.x * 100}%`, top: `${(1 - p.y) * 100}%` }}
              onKeyDown={onKeyDown(i)}
            />
          ))}
        </div>
        {axisLabels?.x && <span className="dialkit-transfer-axis dialkit-transfer-axis-x">{axisLabels.x}</span>}
      </div>
    </div>
  );
}
