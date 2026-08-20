<script lang="ts">
  import { untrack, onDestroy } from 'svelte';
  import SegmentedControl from './SegmentedControl.svelte';
  import ColorPickerPanel from './ColorPickerPanel.svelte';
  import GradientTransformPad from './GradientTransformPad.svelte';
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
  } from '../../gradient-core';

  let { value, onChange, onDrag } = $props<{
    value: GradientValue;
    onChange: (value: GradientValue) => void;
    /** Incremental pointer delta while the drag grip is held. */
    onDrag?: (dx: number, dy: number) => void;
  }>();

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

  let selectedIndex = $state(0);
  let holdingIndex = $state(-1);
  let detach = $state<{ index: number; y: number } | null>(null);
  let stripRef = $state<HTMLDivElement | undefined>(undefined);
  let gripRef = $state<HTMLButtonElement | undefined>(undefined);
  // Grip drag: emit incremental deltas so the parent can reposition the popover.
  let gripOrigin: { x: number; y: number } | null = null;

  const onGripDown = (e: PointerEvent) => {
    e.preventDefault();
    try {
      gripRef?.setPointerCapture(e.pointerId);
    } catch {
      // Non-fatal — drag still works without capture.
    }
    gripOrigin = { x: e.clientX, y: e.clientY };
  };
  const onGripMove = (e: PointerEvent) => {
    if (!gripOrigin || e.buttons === 0) return;
    onDrag?.(e.clientX - gripOrigin.x, e.clientY - gripOrigin.y);
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
    // `working` is re-seeded from `value` on every pointerdown; the initial
    // snapshot is read untracked so it doesn't register as a reactive dependency.
  } = { mode: 'idle', activeIndex: -1, originX: 0, originY: 0, timer: null, working: untrack(() => value) };

  // Selection can outrun a shrinking stop list (external preset restore).
  const safeIndex = $derived(Math.min(selectedIndex, value.stops.length - 1));

  const stripPos = (clientX: number): number => {
    const rect = stripRef!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const stripCenterY = (): number => {
    const rect = stripRef!.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };

  const clearTimer = () => {
    if (drag.timer) clearTimeout(drag.timer);
    drag.timer = null;
  };
  // A held long-press timer must not outlive the panel.
  onDestroy(clearTimer);
  const resetDrag = () => {
    clearTimer();
    drag.mode = 'idle';
    holdingIndex = -1;
  };

  const commitMove = (clientX: number) => {
    const r = moveStop(drag.working, drag.activeIndex, stripPos(clientX));
    drag.working = r.value;
    drag.activeIndex = r.index;
    selectedIndex = r.index;
    onChange(r.value);
  };

  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    // Capture keeps the drag alive if the pointer leaves the strip; a failure
    // here (rare, e.g. an already-released pointer) must not abort the gesture.
    try {
      stripRef?.setPointerCapture(e.pointerId);
    } catch {
      // Non-fatal — the drag still works without capture.
    }
    drag.originX = e.clientX;
    drag.originY = e.clientY;
    drag.working = value;

    const handle = (e.target as HTMLElement).closest('.tweakers-gradient-stop') as HTMLElement | null;
    if (handle) {
      const index = Number(handle.dataset.index);
      selectedIndex = index;
      drag.activeIndex = index;
      drag.mode = 'pending';
      // Long-press removal only arms above the minimum; at MIN_STOPS the gesture
      // simply does nothing special.
      if (value.stops.length > MIN_STOPS) {
        holdingIndex = index;
        drag.timer = setTimeout(() => {
          drag.timer = null;
          drag.mode = 'idle';
          holdingIndex = -1;
          // Remove from current state, not the pointerdown snapshot.
          const next = removeStop(value, index);
          onChange(next);
          selectedIndex = Math.min(index, next.stops.length - 1);
        }, LONG_PRESS_MS);
      }
      return;
    }

    // Empty strip → add a stop seeded with the ramp color, flow into a drag.
    const { value: next, index } = addStop(value, stripPos(e.clientX));
    drag.working = next;
    drag.activeIndex = index;
    drag.mode = 'dragging';
    selectedIndex = index;
    onChange(next);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (drag.mode === 'idle') return;
    if (e.buttons === 0) {
      // Lost pointer capture — bail rather than drag on a released pointer.
      detach = null;
      resetDrag();
      return;
    }

    if (drag.mode === 'pending') {
      if (Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY) <= PALETTE_DRAG_CANCEL_PX) return;
      clearTimer();
      holdingIndex = -1;
      drag.mode = 'dragging';
    }

    if (drag.mode === 'dragging') {
      const offV = e.clientY - stripCenterY();
      if (drag.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
        drag.mode = 'detached';
        detach = { index: drag.activeIndex, y: offV };
        return;
      }
      commitMove(e.clientX);
      return;
    }

    if (drag.mode === 'detached') {
      const offV = e.clientY - stripCenterY();
      if (Math.abs(offV) <= STOP_DETACH_PX) {
        drag.mode = 'dragging';
        detach = null;
        commitMove(e.clientX);
      } else {
        detach = { index: drag.activeIndex, y: offV };
      }
    }
  };

  const onPointerUp = () => {
    if (drag.mode === 'detached') {
      const next = removeStop(drag.working, drag.activeIndex);
      onChange(next);
      selectedIndex = Math.min(drag.activeIndex, next.stops.length - 1);
    }
    detach = null;
    resetDrag();
  };

  const previewStops = $derived(
    detach ? value.stops.filter((_: GradientValue['stops'][number], i: number) => i !== detach!.index) : value.stops
  );
</script>

<div class="tweakers-gradient-panel">
  <div class="tweakers-gradient-toolbar">
    <button
      bind:this={gripRef}
      type="button"
      class="tweakers-gradient-grip"
      aria-label="Drag to move"
      title="Drag to move"
      onpointerdown={onGripDown}
      onpointermove={onGripMove}
      onpointerup={onGripUp}
      onpointercancel={onGripUp}
      onlostpointercapture={onGripUp}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {#each ICON_GRIP as c}
          <circle cx={c.cx} cy={c.cy} r="1.5" />
        {/each}
      </svg>
    </button>

    <SegmentedControl
      options={TYPE_OPTIONS}
      value={value.type}
      onChange={(t: string) => onChange(setGradientType(value, t as GradientType))}
    />
  </div>

  <GradientTransformPad {value} {onChange} />

  <div
    bind:this={stripRef}
    class="tweakers-gradient-strip"
    role="application"
    aria-label="Gradient stops"
    style:--gradient-ramp={rampCss(previewStops)}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
  >
    {#each value.stops as stop, i (i)}
      {@const detaching = detach?.index === i}
      <button
        type="button"
        class="tweakers-gradient-stop"
        data-index={i}
        data-selected={String(i === safeIndex)}
        data-holding={String(i === holdingIndex)}
        data-detaching={String(detaching)}
        style:left="{stop.position * 100}%"
        style:z-index={i === safeIndex ? 99 : i + 1}
        style:--swatch-color={stop.color}
        style:--detach-y={detaching ? `${detach!.y}px` : '0px'}
        aria-label={`Gradient stop ${i + 1}`}
      ></button>
    {/each}
  </div>

  <span class="tweakers-gradient-divider" aria-hidden="true"></span>

  {#key safeIndex}
    <ColorPickerPanel
      value={value.stops[safeIndex].color}
      alpha
      palette={false}
      onChange={(hex: string) => onChange(setStopColor(value, safeIndex, hex))}
    />
  {/key}
</div>
