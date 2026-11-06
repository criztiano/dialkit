import { useRef, useState, useCallback, useEffect } from 'react';
import { isWordUnit } from '../numeric';
import { angleFromPointer, angleText, angleWraps, arcPath, nudgeAngle, snapAngle, valueToBearing } from '../angle';
import { useHints } from '../hooks/useHints';

interface AngleDialProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Replaces the shown value; `unit` is then not added. */
  formatValue?: (value: number) => string;
  /** The value the sweep grows from, and the double-click reset. Defaults to `min`. */
  origin?: number;
  /** Past an end, come back around. Defaults to true for a full turn. */
  wrap?: boolean;
  hint?: string;
}

const RADIUS = 8;

/**
 * A slider drawn as a rotary needle, for values whose two ends are the same
 * place: a heading, a hue, a tilt. The needle follows the pointer like a
 * compass, and on a wrapping range a drag past the top keeps turning. A drag
 * elsewhere on the row scrubs it like a slider.
 * Arrows step (Shift ten), and Home or a double-click returns to the origin.
 */
export function AngleDial({
  label, value, onChange, min = 0, max = 360, step = 1, unit, formatValue, origin, wrap, hint,
}: AngleDialProps) {
  if (typeof value !== 'number' || !Number.isFinite(value)) value = min;
  useHints(!!hint);
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const wraps = angleWraps(min, max, wrap);
  const resolvedOrigin = Math.min(max, Math.max(min, origin ?? min));

  const bearing = valueToBearing(value, min, max);
  const originBearing = valueToBearing(resolvedOrigin, min, max);
  const needle = ((bearing - 90) * Math.PI) / 180;

  // A press on the dial turns the needle like a compass; a press elsewhere on the
  // row scrubs it like a slider, the row's width a full sweep.
  const scrub = useRef<{ x: number; value: number; width: number } | null>(null);

  const applyFromPointer = useCallback((clientX: number, clientY: number) => {
    let next: number | null;
    if (scrub.current) {
      const { x, value: start, width } = scrub.current;
      next = nudgeAngle(start, ((clientX - x) / width) * (max - min) / (step || 1), min, max, step, wraps);
    } else {
      const svg = dialRef.current?.querySelector('svg');
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      next = angleFromPointer(clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2), value, min, max, step, wraps);
    }
    if (next !== null && next !== value) onChange(next);
  }, [value, min, max, step, wraps, onChange]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dialRef.current?.focus({ preventScroll: true });
    setIsDragging(true);
    const onDial = dialRef.current?.contains(e.target as Node);
    scrub.current = onDial ? null : { x: e.clientX, value, width: e.currentTarget.getBoundingClientRect().width || 1 };
    if (onDial) applyFromPointer(e.clientX, e.clientY);
  };

  // The window follows the drag, so it keeps turning off the row.
  useEffect(() => {
    if (!isDragging) return;
    const move = (e: PointerEvent) => applyFromPointer(e.clientX, e.clientY);
    const up = () => { scrub.current = null; setIsDragging(false); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [isDragging, applyFromPointer]);

  const reset = () => onChange(snapAngle(resolvedOrigin, min, step));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const dir = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1
      : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir && e.key !== 'Home') return;
    e.preventDefault();
    e.stopPropagation();
    if (dir) onChange(nudgeAngle(value, dir * (e.shiftKey ? 10 : 1), min, max, step, wraps));
    else reset();
  };

  const text = angleText(value, min, max, step, unit, formatValue);

  return (
    <div
      className="dialkit-angle"
      data-dragging={isDragging || undefined}
      data-hint={hint}
      onPointerDown={onPointerDown}
      onDoubleClick={reset}
    >
      <span className="dialkit-slider-label">{label}</span>
      <span className="dialkit-slider-value dialkit-angle-value">
        {text.value}
        {text.unit && <span className="dialkit-slider-unit" data-spaced={isWordUnit(text.unit) || undefined}>{text.unit}</span>}
      </span>
      <div
        ref={dialRef}
        className="dialkit-angle-dial"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${text.value}${text.unit ? ` ${text.unit}` : ''}`}
        onKeyDown={onKeyDown}
      >
        <svg viewBox="-11 -11 22 22" aria-hidden="true">
          <circle className="dialkit-angle-face" cx="0" cy="0" r={RADIUS} />
          <path className="dialkit-angle-sweep" d={arcPath(originBearing, bearing, RADIUS)} />
          <line
            className="dialkit-angle-needle"
            x1="0" y1="0"
            x2={(RADIUS * Math.cos(needle)).toFixed(3)}
            y2={(RADIUS * Math.sin(needle)).toFixed(3)}
          />
        </svg>
      </div>
    </div>
  );
}
