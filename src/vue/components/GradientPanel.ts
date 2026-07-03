import { computed, defineComponent, h, ref, onBeforeUnmount, type PropType } from 'vue';
import { SegmentedControl } from './SegmentedControl';
import { Slider } from './Slider';
import { ColorPickerPanel } from './ColorPickerPanel';
import { ICON_GRIP, ICON_PANEL } from '../../icons';
import {
  gradientToCss,
  addStop,
  moveStop,
  removeStop,
  setStopColor,
  setGradientType,
  setGradientAngle,
  setGradientCenter,
  setGradientShape,
  MIN_STOPS,
  STOP_DETACH_PX,
  LONG_PRESS_MS,
  PALETTE_DRAG_CANCEL_PX,
  type GradientValue,
  type GradientType,
  type RadialShape,
} from '../../gradient-core';

const TYPE_OPTIONS: { value: GradientType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
  { value: 'conic', label: 'Conic' },
];

const SHAPE_OPTIONS: { value: RadialShape; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'ellipse', label: 'Ellipse' },
];

type DragMode = 'idle' | 'pending' | 'dragging' | 'detached';

/** The editor strip is always the linear ramp (position ↔ x), whatever the type. */
function rampCss(stops: GradientValue['stops']): string {
  return gradientToCss({ type: 'linear', angle: 90, stops });
}

export const GradientPanel = defineComponent({
  name: 'DialKitGradientPanel',
  props: {
    value: { type: Object as PropType<GradientValue>, required: true },
  },
  emits: ['change', 'drag'],
  setup(props, { emit }) {
    const selectedIndex = ref(0);
    const holdingIndex = ref(-1);
    const detach = ref<{ index: number; y: number } | null>(null);
    const showAdvanced = ref(false);
    const stripRef = ref<HTMLDivElement | null>(null);
    const gripRef = ref<HTMLButtonElement | null>(null);
    // Grip drag: emit incremental deltas so the parent can reposition the popover.
    const gripOrigin = ref<{ x: number; y: number } | null>(null);

    const onGripDown = (e: PointerEvent) => {
      e.preventDefault();
      try {
        gripRef.value?.setPointerCapture(e.pointerId);
      } catch {
        // Non-fatal — drag still works without capture.
      }
      gripOrigin.value = { x: e.clientX, y: e.clientY };
    };
    const onGripMove = (e: PointerEvent) => {
      if (!gripOrigin.value || e.buttons === 0) return;
      emit('drag', e.clientX - gripOrigin.value.x, e.clientY - gripOrigin.value.y);
      gripOrigin.value = { x: e.clientX, y: e.clientY };
    };
    const onGripUp = () => {
      gripOrigin.value = null;
    };

    // Per-gesture drag state. `working` threads the latest value through the
    // gesture so pointermove never reads a stale value between emit + re-render.
    const drag = {
      mode: 'idle' as DragMode,
      activeIndex: -1,
      originX: 0,
      originY: 0,
      timer: null as ReturnType<typeof setTimeout> | null,
      working: props.value,
    };

    // Selection can outrun a shrinking stop list (external preset restore).
    const safeIndex = computed(() => Math.min(selectedIndex.value, props.value.stops.length - 1));

    const stripPos = (clientX: number): number => {
      const rect = stripRef.value!.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    };
    const stripCenterY = (): number => {
      const rect = stripRef.value!.getBoundingClientRect();
      return rect.top + rect.height / 2;
    };

    const clearTimer = () => {
      if (drag.timer) clearTimeout(drag.timer);
      drag.timer = null;
    };
    // A held long-press timer must not outlive the panel.
    onBeforeUnmount(clearTimer);
    const resetDrag = () => {
      clearTimer();
      drag.mode = 'idle';
      holdingIndex.value = -1;
    };

    const commitMove = (clientX: number) => {
      const r = moveStop(drag.working, drag.activeIndex, stripPos(clientX));
      drag.working = r.value;
      drag.activeIndex = r.index;
      selectedIndex.value = r.index;
      emit('change', r.value);
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      // Capture keeps the drag alive if the pointer leaves the strip; a failure
      // here (rare, e.g. an already-released pointer) must not abort the gesture.
      try {
        stripRef.value?.setPointerCapture(e.pointerId);
      } catch {
        // Non-fatal — the drag still works without capture.
      }
      drag.originX = e.clientX;
      drag.originY = e.clientY;
      drag.working = props.value;

      const handle = (e.target as HTMLElement).closest('.dialkit-gradient-stop') as HTMLElement | null;
      if (handle) {
        const index = Number(handle.dataset.index);
        selectedIndex.value = index;
        drag.activeIndex = index;
        drag.mode = 'pending';
        // Long-press removal only arms above the minimum; at MIN_STOPS the
        // gesture simply does nothing special.
        if (props.value.stops.length > MIN_STOPS) {
          holdingIndex.value = index;
          drag.timer = setTimeout(() => {
            drag.timer = null;
            drag.mode = 'idle';
            holdingIndex.value = -1;
            // Remove from current state, not the pointerdown snapshot.
            const next = removeStop(props.value, index);
            emit('change', next);
            selectedIndex.value = Math.min(index, next.stops.length - 1);
          }, LONG_PRESS_MS);
        }
        return;
      }

      // Empty strip → add a stop seeded with the ramp color, flow into a drag.
      const { value: next, index } = addStop(props.value, stripPos(e.clientX));
      drag.working = next;
      drag.activeIndex = index;
      drag.mode = 'dragging';
      selectedIndex.value = index;
      emit('change', next);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (drag.mode === 'idle') return;
      if (e.buttons === 0) {
        // Lost pointer capture — bail rather than drag on a released pointer.
        detach.value = null;
        resetDrag();
        return;
      }

      if (drag.mode === 'pending') {
        if (Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY) <= PALETTE_DRAG_CANCEL_PX) return;
        clearTimer();
        holdingIndex.value = -1;
        drag.mode = 'dragging';
      }

      if (drag.mode === 'dragging') {
        const offV = e.clientY - stripCenterY();
        if (drag.working.stops.length > MIN_STOPS && Math.abs(offV) > STOP_DETACH_PX) {
          drag.mode = 'detached';
          detach.value = { index: drag.activeIndex, y: offV };
          return;
        }
        commitMove(e.clientX);
        return;
      }

      if (drag.mode === 'detached') {
        const offV = e.clientY - stripCenterY();
        if (Math.abs(offV) <= STOP_DETACH_PX) {
          drag.mode = 'dragging';
          detach.value = null;
          commitMove(e.clientX);
        } else {
          detach.value = { index: drag.activeIndex, y: offV };
        }
      }
    };

    const onPointerUp = () => {
      if (drag.mode === 'detached') {
        const next = removeStop(drag.working, drag.activeIndex);
        emit('change', next);
        selectedIndex.value = Math.min(drag.activeIndex, next.stops.length - 1);
      }
      detach.value = null;
      resetDrag();
    };

    return () => {
      const value = props.value;
      const previewStops = detach.value
        ? value.stops.filter((_, i) => i !== detach.value!.index)
        : value.stops;

      const advanced = showAdvanced.value && value.type !== 'linear';

      return h('div', { class: 'dialkit-gradient-panel' }, [
        h('div', { class: 'dialkit-gradient-toolbar' }, [
          h('button', {
            ref: gripRef,
            type: 'button',
            class: 'dialkit-gradient-grip',
            'aria-label': 'Drag to move',
            title: 'Drag to move',
            onPointerdown: onGripDown,
            onPointermove: onGripMove,
            onPointerup: onGripUp,
            onPointercancel: onGripUp,
          }, [
            h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
              ICON_GRIP.map((c) => h('circle', { cx: c.cx, cy: c.cy, r: '1.5' }))),
          ]),

          h(SegmentedControl, {
            options: TYPE_OPTIONS,
            value: value.type,
            onChange: (t: GradientType) => emit('change', setGradientType(value, t)),
          }),

          value.type !== 'linear'
            ? h('button', {
              type: 'button',
              class: 'dialkit-gradient-advanced-toggle',
              'data-active': String(advanced),
              'aria-label': 'Advanced settings',
              'aria-pressed': advanced,
              title: 'Advanced settings',
              onClick: () => { showAdvanced.value = !showAdvanced.value; },
            }, [
              h('svg', { viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' }, [
                h('path', { opacity: '0.5', d: ICON_PANEL.path, fill: 'currentColor' }),
                ...ICON_PANEL.circles.map((c) => h('circle', {
                  cx: c.cx, cy: c.cy, r: c.r, fill: 'currentColor', stroke: 'currentColor', 'stroke-width': '1.25',
                })),
              ]),
            ])
            : null,
        ]),

        value.type !== 'radial'
          ? h(Slider, {
            label: 'Angle',
            value: value.angle,
            min: 0,
            max: 360,
            step: 1,
            unit: '°',
            onChange: (a: number) => emit('change', setGradientAngle(value, a)),
          })
          : null,

        advanced
          ? h('div', { class: 'dialkit-gradient-advanced' }, [
            h(Slider, {
              label: 'Center X',
              value: value.centerX ?? 50,
              min: 0,
              max: 100,
              step: 1,
              unit: '%',
              onChange: (x: number) => emit('change', setGradientCenter(value, x, value.centerY ?? 50)),
            }),
            h(Slider, {
              label: 'Center Y',
              value: value.centerY ?? 50,
              min: 0,
              max: 100,
              step: 1,
              unit: '%',
              onChange: (y: number) => emit('change', setGradientCenter(value, value.centerX ?? 50, y)),
            }),
            value.type === 'radial'
              ? h(SegmentedControl, {
                options: SHAPE_OPTIONS,
                value: value.shape ?? 'circle',
                onChange: (s: RadialShape) => emit('change', setGradientShape(value, s)),
              })
              : null,
          ])
          : null,

        h('div', {
          ref: stripRef,
          class: 'dialkit-gradient-strip',
          style: { '--gradient-ramp': rampCss(previewStops) },
          onPointerdown: onPointerDown,
          onPointermove: onPointerMove,
          onPointerup: onPointerUp,
          onPointercancel: onPointerUp,
        }, value.stops.map((stop, i) => {
          const detaching = detach.value?.index === i;
          return h('button', {
            key: i,
            type: 'button',
            class: 'dialkit-gradient-stop',
            'data-index': i,
            'data-selected': String(i === safeIndex.value),
            'data-holding': String(i === holdingIndex.value),
            'data-detaching': String(detaching),
            style: {
              left: `${stop.position * 100}%`,
              zIndex: i === safeIndex.value ? 99 : i + 1,
              '--swatch-color': stop.color,
              '--detach-y': detaching ? `${detach.value!.y}px` : '0px',
            },
            'aria-label': `Gradient stop ${i + 1}`,
          });
        })),

        h('span', { class: 'dialkit-gradient-divider', 'aria-hidden': 'true' }),

        h(ColorPickerPanel, {
          key: safeIndex.value,
          value: value.stops[safeIndex.value].color,
          alpha: true,
          palette: false,
          onChange: (hex: string) => emit('change', setStopColor(value, safeIndex.value, hex)),
        }),
      ]);
    };
  },
});
