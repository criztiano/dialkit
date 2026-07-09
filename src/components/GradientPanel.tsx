import { useState, useRef, useEffect } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { ColorPickerPanel } from './ColorPickerPanel';
import { GradientTransformPad } from './GradientTransformPad';
import { ICON_GRIP } from '../icons';
import {
  gradientToCss,
  addStop,
  moveStop,
  removeStop,
  setStopColor,
  setGradientType,
  MIN_STOPS,
  STOP_DETACH_PX,
  LONG_PRESS_MS,
  PALETTE_DRAG_CANCEL_PX,
  type GradientValue,
  type GradientType,
} from '../gradient-core';

interface GradientPanelProps {
  value: GradientValue;
  onChange: (value: GradientValue) => void;
  /** Incremental pointer delta while the drag grip is held. */
  onDrag?: (dx: number, dy: number) => void;
}

const TYPE_OPTIONS: { value: GradientType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
  { value: 'conic', label: 'Conic' },
];

type DragMode = 'idle' | 'pending' | 'dragging' | 'detached';

/** The editor strip is always the linear ramp (position ↔ x), whatever the type. */
function rampCss(stops: GradientValue['stops']): string {
  return gradientToCss({ type: 'linear', angle: 90, stops });
}

export function GradientPanel({ value, onChange, onDrag }: GradientPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [holdingIndex, setHoldingIndex] = useState(-1);
  const [detach, setDetach] = useState<{ index: number; y: number } | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLButtonElement>(null);
  // Grip drag: emit incremental deltas so the parent can reposition the popover.
  const gripOrigin = useRef<{ x: number; y: number } | null>(null);

  const onGripDown = (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      gripRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // Non-fatal — drag still works without capture.
    }
    gripOrigin.current = { x: e.clientX, y: e.clientY };
  };
  const onGripMove = (e: React.PointerEvent) => {
    if (!gripOrigin.current || e.buttons === 0) return;
    onDrag?.(e.clientX - gripOrigin.current.x, e.clientY - gripOrigin.current.y);
    gripOrigin.current = { x: e.clientX, y: e.clientY };
  };
  const onGripUp = () => {
    gripOrigin.current = null;
  };

  // Per-gesture drag state. `working` threads the latest value through the
  // gesture so pointermove never reads a stale closure between emit + re-render.
  const drag = useRef<{
    mode: DragMode;
    activeIndex: number;
    originX: number;
    originY: number;
    timer: ReturnType<typeof setTimeout> | null;
    working: GradientValue;
  }>({ mode: 'idle', activeIndex: -1, originX: 0, originY: 0, timer: null, working: value });

  // Latest value for the long-press timer — it must remove from current state,
  // not the snapshot taken at pointerdown (an external write could land mid-hold).
  const valueRef = useRef(value);
  valueRef.current = value;

  // A held long-press timer must not outlive the panel: if the popover closes
  // mid-hold (Escape/outside-click), clear it so it can't emit a stray removal.
  useEffect(() => () => {
    if (drag.current.timer) clearTimeout(drag.current.timer);
  }, []);

  // Selection can outrun a shrinking stop list (external preset restore).
  const safeIndex = Math.min(selectedIndex, value.stops.length - 1);

  const stripPos = (clientX: number): number => {
    const rect = stripRef.current!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const stripCenterY = (): number => {
    const rect = stripRef.current!.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };

  const clearTimer = () => {
    if (drag.current.timer) clearTimeout(drag.current.timer);
    drag.current.timer = null;
  };
  const resetDrag = () => {
    clearTimer();
    drag.current.mode = 'idle';
    setHoldingIndex(-1);
  };

  const commitMove = (clientX: number) => {
    const r = moveStop(drag.current.working, drag.current.activeIndex, stripPos(clientX));
    drag.current.working = r.value;
    drag.current.activeIndex = r.index;
    setSelectedIndex(r.index);
    onChange(r.value);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    // Capture keeps the drag alive if the pointer leaves the strip; a failure
    // here (rare, e.g. an already-released pointer) must not abort the gesture.
    try {
      stripRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // Non-fatal — the drag still works without capture.
    }
    const d = drag.current;
    d.originX = e.clientX;
    d.originY = e.clientY;
    d.working = value;

    const handle = (e.target as HTMLElement).closest('.dialkit-gradient-stop') as HTMLElement | null;
    if (handle) {
      const index = Number(handle.dataset.index);
      setSelectedIndex(index);
      d.activeIndex = index;
      d.mode = 'pending';
      // Long-press removal only arms above the minimum; at MIN_STOPS the gesture
      // simply does nothing special.
      if (value.stops.length > MIN_STOPS) {
        setHoldingIndex(index);
        d.timer = setTimeout(() => {
          d.timer = null;
          d.mode = 'idle';
          setHoldingIndex(-1);
          const next = removeStop(valueRef.current, index);
          onChange(next);
          setSelectedIndex(Math.min(index, next.stops.length - 1));
        }, LONG_PRESS_MS);
      }
      return;
    }

    // Empty strip → add a stop seeded with the ramp color, flow into a drag.
    const { value: next, index } = addStop(value, stripPos(e.clientX));
    d.working = next;
    d.activeIndex = index;
    d.mode = 'dragging';
    setSelectedIndex(index);
    onChange(next);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.mode === 'idle') return;
    if (e.buttons === 0) {
      // Lost pointer capture — bail rather than drag on a released pointer.
      setDetach(null);
      resetDrag();
      return;
    }

    if (d.mode === 'pending') {
      if (Math.hypot(e.clientX - d.originX, e.clientY - d.originY) <= PALETTE_DRAG_CANCEL_PX) return;
      clearTimer();
      setHoldingIndex(-1);
      d.mode = 'dragging';
    }

    if (d.mode === 'dragging') {
      const offV = e.clientY - stripCenterY();
      if (d.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
        d.mode = 'detached';
        setDetach({ index: d.activeIndex, y: offV });
        return;
      }
      commitMove(e.clientX);
      return;
    }

    if (d.mode === 'detached') {
      const offV = e.clientY - stripCenterY();
      if (Math.abs(offV) <= STOP_DETACH_PX) {
        d.mode = 'dragging';
        setDetach(null);
        commitMove(e.clientX);
      } else {
        setDetach({ index: d.activeIndex, y: offV });
      }
    }
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (d.mode === 'detached') {
      const next = removeStop(d.working, d.activeIndex);
      onChange(next);
      setSelectedIndex(Math.min(d.activeIndex, next.stops.length - 1));
    }
    setDetach(null);
    resetDrag();
  };

  const previewStops = detach ? value.stops.filter((_, i) => i !== detach.index) : value.stops;

  return (
    <div className="dialkit-gradient-panel">
      <div className="dialkit-gradient-toolbar">
        <button
          ref={gripRef}
          type="button"
          className="dialkit-gradient-grip"
          aria-label="Drag to move"
          title="Drag to move"
          onPointerDown={onGripDown}
          onPointerMove={onGripMove}
          onPointerUp={onGripUp}
          onPointerCancel={onGripUp}
          onLostPointerCapture={onGripUp}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {ICON_GRIP.map((c, i) => (
              <circle key={i} cx={c.cx} cy={c.cy} r="1.5" />
            ))}
          </svg>
        </button>

        <SegmentedControl
          options={TYPE_OPTIONS}
          value={value.type}
          onChange={(t) => onChange(setGradientType(value, t))}
        />
      </div>

      <GradientTransformPad value={value} onChange={onChange} />

      <div
        ref={stripRef}
        className="dialkit-gradient-strip"
        style={{ '--gradient-ramp': rampCss(previewStops) } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {value.stops.map((stop, i) => {
          const detaching = detach?.index === i;
          return (
            <button
              key={i}
              type="button"
              className="dialkit-gradient-stop"
              data-index={i}
              data-selected={String(i === safeIndex)}
              data-holding={String(i === holdingIndex)}
              data-detaching={String(detaching)}
              style={{
                left: `${stop.position * 100}%`,
                zIndex: i === safeIndex ? 99 : i + 1,
                '--swatch-color': stop.color,
                '--detach-y': detaching ? `${detach!.y}px` : '0px',
              } as React.CSSProperties}
              aria-label={`Gradient stop ${i + 1}`}
            />
          );
        })}
      </div>

      <span className="dialkit-gradient-divider" aria-hidden="true" />

      <ColorPickerPanel
        key={safeIndex}
        value={value.stops[safeIndex].color}
        alpha
        palette={false}
        onChange={(hex) => onChange(setStopColor(value, safeIndex, hex))}
      />
    </div>
  );
}
