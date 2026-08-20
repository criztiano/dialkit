import { createSignal, For, Show, onCleanup } from 'solid-js';
import { SegmentedControl } from './SegmentedControl';
import { ColorPickerPanel } from './ColorPickerPanel';
import { GradientTransformPad } from './GradientTransformPad';
import { ICON_GRIP } from '../../icons';
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
  type GradientStop,
} from '../../gradient-core';

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
function rampCss(stops: GradientStop[]): string {
  return gradientToCss({ type: 'linear', angle: 90, stops });
}

export function GradientPanel(props: GradientPanelProps) {
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [holdingIndex, setHoldingIndex] = createSignal(-1);
  const [detach, setDetach] = createSignal<{ index: number; y: number } | null>(null);
  let stripRef!: HTMLDivElement;
  let gripRef!: HTMLButtonElement;
  // Grip drag: emit incremental deltas so the parent can reposition the popover.
  let gripOrigin: { x: number; y: number } | null = null;

  const onGripDown = (e: PointerEvent) => {
    e.preventDefault();
    try {
      gripRef.setPointerCapture(e.pointerId);
    } catch {
      // Non-fatal — drag still works without capture.
    }
    gripOrigin = { x: e.clientX, y: e.clientY };
  };
  const onGripMove = (e: PointerEvent) => {
    if (!gripOrigin || e.buttons === 0) return;
    props.onDrag?.(e.clientX - gripOrigin.x, e.clientY - gripOrigin.y);
    gripOrigin = { x: e.clientX, y: e.clientY };
  };
  const onGripUp = () => {
    gripOrigin = null;
  };

  // Per-gesture drag state. `working` threads the latest value through the
  // gesture so pointermove never reads a stale closure between emit + re-render.
  const drag: {
    mode: DragMode;
    activeIndex: number;
    originX: number;
    originY: number;
    timer: ReturnType<typeof setTimeout> | null;
    working: GradientValue;
  } = { mode: 'idle', activeIndex: -1, originX: 0, originY: 0, timer: null, working: props.value };

  // Selection can outrun a shrinking stop list (external preset restore).
  const safeIndex = () => Math.min(selectedIndex(), props.value.stops.length - 1);

  const stripPos = (clientX: number): number => {
    const rect = stripRef.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const stripCenterY = (): number => {
    const rect = stripRef.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };

  const clearTimer = () => {
    if (drag.timer) clearTimeout(drag.timer);
    drag.timer = null;
  };
  // A held long-press timer must not outlive the panel.
  onCleanup(clearTimer);
  const resetDrag = () => {
    clearTimer();
    drag.mode = 'idle';
    setHoldingIndex(-1);
  };

  const commitMove = (clientX: number) => {
    const r = moveStop(drag.working, drag.activeIndex, stripPos(clientX));
    drag.working = r.value;
    drag.activeIndex = r.index;
    setSelectedIndex(r.index);
    props.onChange(r.value);
  };

  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    // Capture keeps the drag alive if the pointer leaves the strip; a failure
    // here (rare, e.g. an already-released pointer) must not abort the gesture.
    try {
      stripRef.setPointerCapture(e.pointerId);
    } catch {
      // Non-fatal — the drag still works without capture.
    }
    drag.originX = e.clientX;
    drag.originY = e.clientY;
    drag.working = props.value;

    const handle = (e.target as HTMLElement).closest('.tweakers-gradient-stop') as HTMLElement | null;
    if (handle) {
      const index = Number(handle.dataset.index);
      setSelectedIndex(index);
      drag.activeIndex = index;
      drag.mode = 'pending';
      // Long-press removal only arms above the minimum; at MIN_STOPS the gesture
      // simply does nothing special.
      if (props.value.stops.length > MIN_STOPS) {
        setHoldingIndex(index);
        drag.timer = setTimeout(() => {
          drag.timer = null;
          drag.mode = 'idle';
          setHoldingIndex(-1);
          // Remove from current state, not the pointerdown snapshot.
          const next = removeStop(props.value, index);
          props.onChange(next);
          setSelectedIndex(Math.min(index, next.stops.length - 1));
        }, LONG_PRESS_MS);
      }
      return;
    }

    // Empty strip → add a stop seeded with the ramp color, flow into a drag.
    const { value: next, index } = addStop(props.value, stripPos(e.clientX));
    drag.working = next;
    drag.activeIndex = index;
    drag.mode = 'dragging';
    setSelectedIndex(index);
    props.onChange(next);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (drag.mode === 'idle') return;
    if (e.buttons === 0) {
      // Lost pointer capture — bail rather than drag on a released pointer.
      setDetach(null);
      resetDrag();
      return;
    }

    if (drag.mode === 'pending') {
      if (Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY) <= PALETTE_DRAG_CANCEL_PX) return;
      clearTimer();
      setHoldingIndex(-1);
      drag.mode = 'dragging';
    }

    if (drag.mode === 'dragging') {
      const offV = e.clientY - stripCenterY();
      if (drag.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
        drag.mode = 'detached';
        setDetach({ index: drag.activeIndex, y: offV });
        return;
      }
      commitMove(e.clientX);
      return;
    }

    if (drag.mode === 'detached') {
      const offV = e.clientY - stripCenterY();
      if (Math.abs(offV) <= STOP_DETACH_PX) {
        drag.mode = 'dragging';
        setDetach(null);
        commitMove(e.clientX);
      } else {
        setDetach({ index: drag.activeIndex, y: offV });
      }
    }
  };

  const onPointerUp = () => {
    if (drag.mode === 'detached') {
      const next = removeStop(drag.working, drag.activeIndex);
      props.onChange(next);
      setSelectedIndex(Math.min(drag.activeIndex, next.stops.length - 1));
    }
    setDetach(null);
    resetDrag();
  };

  const previewStops = () => {
    const d = detach();
    return d ? props.value.stops.filter((_, i) => i !== d.index) : props.value.stops;
  };

  return (
    <div class="tweakers-gradient-panel">
      <div class="tweakers-gradient-toolbar">
        <button
          ref={gripRef}
          type="button"
          class="tweakers-gradient-grip"
          aria-label="Drag to move"
          title="Drag to move"
          onPointerDown={onGripDown}
          onPointerMove={onGripMove}
          onPointerUp={onGripUp}
          onPointerCancel={onGripUp}
          onLostPointerCapture={onGripUp}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <For each={ICON_GRIP}>
              {(c) => <circle cx={c.cx} cy={c.cy} r="1.5" />}
            </For>
          </svg>
        </button>

        <SegmentedControl
          options={TYPE_OPTIONS}
          value={props.value.type}
          onChange={(t) => props.onChange(setGradientType(props.value, t))}
        />
      </div>

      <GradientTransformPad value={props.value} onChange={props.onChange} />

      <div
        ref={stripRef}
        class="tweakers-gradient-strip"
        style={{ '--gradient-ramp': rampCss(previewStops()) }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <For each={props.value.stops}>
          {(stop, i) => {
            const detaching = () => detach()?.index === i();
            return (
              <button
                type="button"
                class="tweakers-gradient-stop"
                data-index={i()}
                data-selected={String(i() === safeIndex())}
                data-holding={String(i() === holdingIndex())}
                data-detaching={String(detaching())}
                style={{
                  left: `${stop.position * 100}%`,
                  'z-index': i() === safeIndex() ? 99 : i() + 1,
                  '--swatch-color': stop.color,
                  '--detach-y': detaching() ? `${detach()!.y}px` : '0px',
                }}
                aria-label={`Gradient stop ${i() + 1}`}
              />
            );
          }}
        </For>
      </div>

      <span class="tweakers-gradient-divider" aria-hidden="true" />

      {/* Keyed Show mirrors React's key={selectedIndex}: the panel is torn down
          and rebuilt whenever the selected stop changes, resetting its internal
          HSVA state per stop. Keyed on a shifted index so 0 stays truthy. */}
      <Show when={safeIndex() + 1} keyed>
        {(keyed) => {
          const index = keyed - 1;
          return (
            <ColorPickerPanel
              value={props.value.stops[index].color}
              alpha
              palette={false}
              onChange={(hex) => props.onChange(setStopColor(props.value, index, hex))}
            />
          );
        }}
      </Show>
    </div>
  );
}
