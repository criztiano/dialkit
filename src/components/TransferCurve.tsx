import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import {
  DEFAULT_TRANSFER, TRANSFER_MAX_POINTS, insertPoint, isIdentityTransfer, movePoint,
  nearestPoint, normalizeTransfer, removePoint, sampleTransfer,
  type TransferPoint, type TransferValue,
} from '../transfer-core';

interface TransferCurveProps {
  label: string;
  value: TransferValue;
  onChange: (value: TransferValue) => void;
  /** Surface height in px, clamped 64–200. Default 104. */
  height?: number;
  /** Grid divisions behind the curve. Default 4 (quarters). Pass 0 to hide. */
  grid?: number;
  /** Names for the two axes, shown small at the edges. */
  axisLabels?: { x?: string; y?: string };
}

const PLOT = 100;          // the SVG works in a 100×100 unit square
const GRAB_PX = 9;         // pointer slack for grabbing a handle
const DROP_PX = 26;        // drag this far outside the box to delete a point
const SAMPLES = 96;

/**
 * A curve you draw instead of a number you guess. Points are dragged, added
 * with a click on the curve and removed by dragging one out of the box; the
 * shape between them is monotone cubic, so the output never overshoots the
 * values you placed.
 */
export function TransferCurve({ label, value, onChange, height = 104, grid = 4, axisLabels }: TransferCurveProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [dropping, setDropping] = useState(false);
  const points = normalizeTransfer(value).points;
  const h = Math.min(200, Math.max(64, height));

  // The stroke, in the SVG's y-down space.
  const path = useMemo(() => {
    let d = '';
    for (let i = 0; i < SAMPLES; i++) {
      const x = i / (SAMPLES - 1);
      const y = sampleTransfer(points, x);
      d += `${i ? 'L' : 'M'} ${(x * PLOT).toFixed(2)} ${((1 - y) * PLOT).toFixed(2)} `;
    }
    return d.trim();
  }, [points]);

  // Pointer → curve space. y is inverted: the box is y-down, a curve is y-up.
  const toCurve = useCallback((clientX: number, clientY: number) => {
    const r = boxRef.current!.getBoundingClientRect();
    return {
      x: (clientX - r.left) / r.width,
      y: 1 - (clientY - r.top) / r.height,
      outside: Math.max(
        r.left - clientX, clientX - r.right, r.top - clientY, clientY - r.bottom,
      ) > DROP_PX,
      rect: r,
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const { x, y, rect } = toCurve(e.clientX, e.clientY);
    const hit = nearestPoint(points, x, y, GRAB_PX / Math.min(rect.width, rect.height));
    if (hit >= 0) {
      setDragIndex(hit);
      return;
    }
    if (points.length >= TRANSFER_MAX_POINTS) return;
    // A click on empty space adds a point there and grabs it, so one gesture
    // both creates and places it.
    const { points: next, index } = insertPoint(points, x, y);
    onChange({ points: next });
    setDragIndex(index);
  };

  useEffect(() => {
    if (dragIndex === null) return;
    const move = (e: PointerEvent) => {
      const { x, y, outside } = toCurve(e.clientX, e.clientY);
      const removable = dragIndex > 0 && dragIndex < points.length - 1;
      setDropping(outside && removable);
      onChange({ points: movePoint(points, dragIndex, x, y) });
    };
    const up = (e: PointerEvent) => {
      const { outside } = toCurve(e.clientX, e.clientY);
      if (outside && dragIndex > 0 && dragIndex < points.length - 1) {
        onChange({ points: removePoint(points, dragIndex) });
      }
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

  const onHover = (e: React.PointerEvent) => {
    if (dragIndex !== null) return;
    const { x, y, rect } = toCurve(e.clientX, e.clientY);
    setHoverIndex(nearestPoint(points, x, y, GRAB_PX / Math.min(rect.width, rect.height)));
  };

  const reset = () => onChange({ points: DEFAULT_TRANSFER.points.map((p) => ({ ...p })) });

  const lines = grid > 0 ? Array.from({ length: grid - 1 }, (_, i) => ((i + 1) * PLOT) / grid) : [];

  return (
    <div className="tweakers-transfer-control" data-idle={isIdentityTransfer(points) || undefined}>
      <div className="tweakers-transfer-head">
        <span className="tweakers-transfer-label">{label}</span>
        {axisLabels?.y ? <span className="tweakers-transfer-axis">{axisLabels.y}</span> : null}
      </div>
      <div
        ref={boxRef}
        className="tweakers-transfer-box"
        data-dropping={dropping || undefined}
        style={{ height: h }}
        role="application"
        aria-label={`${label} curve, ${points.length} points`}
        onPointerDown={onPointerDown}
        onPointerMove={onHover}
        onPointerLeave={() => setHoverIndex(null)}
        onDoubleClick={reset}
      >
        <svg viewBox={`0 0 ${PLOT} ${PLOT}`} preserveAspectRatio="none" aria-hidden="true">
          {lines.map((p) => (
            <g key={p}>
              <line className="tweakers-transfer-grid" x1={p} y1="0" x2={p} y2={PLOT} />
              <line className="tweakers-transfer-grid" x1="0" y1={p} x2={PLOT} y2={p} />
            </g>
          ))}
          <line className="tweakers-transfer-unity" x1="0" y1={PLOT} x2={PLOT} y2="0" />
          <path className="tweakers-transfer-stroke" d={path} vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Handles sit outside the stretched SVG so they stay round in a
            non-square box. */}
        {points.map((p: TransferPoint, i: number) => (
          <span
            key={i}
            className="tweakers-transfer-point"
            data-active={dragIndex === i || hoverIndex === i || undefined}
            data-end={i === 0 || i === points.length - 1 || undefined}
            style={{ left: `${p.x * 100}%`, top: `${(1 - p.y) * 100}%` }}
          />
        ))}
      </div>
      {axisLabels?.x ? <span className="tweakers-transfer-axis-x">{axisLabels.x}</span> : null}
    </div>
  );
}
