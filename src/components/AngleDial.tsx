import { useRef, useState, useCallback, useEffect } from 'react';
import {
  ANGLE_DEAD_ZONE_PX, angleFromPointer, arcPath, nudgeAngle, snapAngle, valueToBearing,
} from '../angle-core';

interface AngleDialProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  /** The bearing the sweep grows out of. Defaults to `min`. */
  origin?: number;
  /** Past the end, come back around instead of stopping. Default for a full turn. */
  wrap?: boolean;
}

const RADIUS = 8.5;
const DEG = '°';

/**
 * A rotary control for the parameters a track gets wrong: headings, tilts,
 * sun positions — anything where the two ends of the range are the same place.
 * The needle follows the pointer directly (a compass gesture, not a fader
 * one), and on a wrapping range a drag past the top carries on turning.
 *
 * It is a `slider` to the store, and so to a hardware knob: only the drawing
 * differs, which is exactly what `display: 'dial'` says.
 */
export function AngleDial({
  label, value, onChange, min = 0, max = 360, step = 1, unit, formatValue, origin, wrap,
}: AngleDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  // A full turn wraps unless told otherwise; a partial range (a cone width) stops.
  const wraps = wrap ?? Math.abs(max - min) >= 360;
  const resolvedOrigin = Math.min(max, Math.max(min, origin ?? min));

  const bearing = valueToBearing(value, min, max);
  const originBearing = valueToBearing(resolvedOrigin, min, max);
  const needle = ((bearing - 90) * Math.PI) / 180;

  const applyFromPointer = useCallback((clientX: number, clientY: number) => {
    const el = dialRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = angleFromPointer(
      clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2),
      value, min, max, step, wraps,
    );
    if (next !== null && next !== value) onChange(next);
  }, [value, min, max, step, wraps, onChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    applyFromPointer(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: PointerEvent) => applyFromPointer(e.clientX, e.clientY);
    const up = () => setIsDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [isDragging, applyFromPointer]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1
      : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : 0;
    if (dir) {
      e.preventDefault();
      onChange(nudgeAngle(value, dir * (e.shiftKey ? 10 : 1), min, max, step, wraps));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(snapAngle(resolvedOrigin, min, step));
    }
  };

  const text = formatValue ? formatValue(value)
    : `${Number(value.toFixed(2))}${unit ?? (Math.abs(max - min) >= 180 ? DEG : '')}`;

  return (
    <div className="tweakers-angle-control" data-dragging={isDragging || undefined}>
      <div
        ref={dialRef}
        className="tweakers-angle-dial"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={text}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        onDoubleClick={() => onChange(snapAngle(resolvedOrigin, min, step))}
      >
        <svg viewBox="-12 -12 24 24" aria-hidden="true">
          <circle className="tweakers-angle-face" cx="0" cy="0" r={RADIUS} />
          <path className="tweakers-angle-sweep" d={arcPath(originBearing, bearing, RADIUS)} />
          <line
            className="tweakers-angle-needle"
            x1="0" y1="0"
            x2={(RADIUS * Math.cos(needle)).toFixed(3)}
            y2={(RADIUS * Math.sin(needle)).toFixed(3)}
          />
        </svg>
      </div>
      <span className="tweakers-angle-label">{label}</span>
      <span className="tweakers-angle-value">{text}</span>
    </div>
  );
}

export { ANGLE_DEAD_ZONE_PX };
