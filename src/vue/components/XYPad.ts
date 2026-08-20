import { computed, defineComponent, h, ref, type PropType } from 'vue';
import type { ShortcutConfig, XYAxis } from '../../store/TweakStore';
import { formatSliderShortcut } from '../../shortcut-utils';
import {
  resolveAxis,
  valueFromPoint,
  pointFromValue,
  applyDetentAxis,
  nudge,
  centerValue,
  normalizeValue,
  type XYValue,
  type AxisSpec,
} from '../../xy-pad-core';

/** Default grid subdivisions when `grid` is left default/true: 5 columns × 5 rows. */
const DEFAULT_GRID_X = 5;
const DEFAULT_GRID_Y = 5;
/** Pointer fine-drag multiplier (Shift): apply a fraction of the raw delta. */
const FINE_DRAG = 0.15;

/** Decimals implied by a step (0.01 → 2) — matches the core/slider convention. */
function decimalsForStep(step: number): number {
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

/** Format one component to its axis's step precision, collapsing -0 → 0. */
function formatComponent(v: number, axis: AxisSpec): string {
  return (v + 0).toFixed(decimalsForStep(axis.step));
}

/**
 * Standalone 2D value pad. A single focusable surface with an absolutely
 * positioned thumb; pointer press places-and-grabs, arrows nudge, and an
 * optional return-to-centre springs the thumb home on release. All value
 * math (mapping, clamping, snapping, nudging, detent) lives in xy-pad-core.
 *
 * The thumb/guides are positioned purely from the `value` prop via CSS
 * `left%`/`top%` (the ColorPickerPanel SV-thumb idiom), so the four ports render
 * identical markup with no animation library. Smooth motion for keyboard nudges
 * and return-to-centre comes from a CSS transition that is disabled during drag
 * (via `data-dragging`), keeping drags instant.
 */
export const XYPad = defineComponent({
  name: 'TweakersXYPad',
  props: {
    label: { type: String, required: true },
    value: { type: Object as PropType<XYValue>, required: true },
    /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
    x: { type: Object as PropType<XYAxis>, default: undefined },
    /** Vertical axis, Cartesian (top = max). Same defaults as x. */
    y: { type: Object as PropType<XYAxis>, default: undefined },
    /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
    size: { type: Number, default: 160 },
    /**
     * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
     * faint at rest and stronger on interaction. Pass `false` to hide it, or a
     * number for a uniform N×N count. `density` multiplies whichever grid applies.
     */
    grid: { type: [Boolean, Number] as PropType<boolean | number>, default: undefined },
    /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
    density: { type: Number, default: 1 },
    /** Snap the emitted value to each axis's step. Default false (continuous). */
    snap: { type: Boolean, default: false },
    /** Spring back to centre on release (joystick). Default false = hold. */
    returnToCenter: { type: Boolean, default: false },
    /** Show the live value next to each axis label (default false = label only). */
    showValues: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Override the readout / aria-valuetext text. Owns the full string. */
    formatValue: { type: Function as PropType<(value: XYValue) => string>, default: undefined },
    shortcut: { type: Object as PropType<ShortcutConfig>, default: undefined },
    shortcutActive: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const xAxis = computed(() => resolveAxis(props.x));
    const yAxis = computed(() => resolveAxis(props.y));

    const areaRef = ref<HTMLElement | null>(null);
    let dragging = false;
    const active = ref(false);
    const draggingState = ref(false);

    // Screen point (y-down) → Cartesian value, with the per-axis escapable centre
    // detent applied against the origin's on-screen distance (bipolar axes only).
    const pointToValue = (clientX: number, clientY: number, fine: boolean): XYValue => {
      const el = areaRef.value;
      if (!el) return props.value;
      const rect = el.getBoundingClientRect();
      const xa = xAxis.value;
      const ya = yAxis.value;

      let px = (clientX - rect.left) / rect.width;
      let py = (clientY - rect.top) / rect.height;

      if (fine) {
        // Fine drag: nudge from the current point by a fraction of the raw delta
        // so precision holds near the thumb rather than jumping to the cursor.
        const cur = pointFromValue(props.value, xa, ya);
        px = cur.x + (px - cur.x) * FINE_DRAG;
        py = cur.y + (py - cur.y) * FINE_DRAG;
      }

      px = Math.min(1, Math.max(0, px));
      py = Math.min(1, Math.max(0, py));

      const next = valueFromPoint({ x: px, y: py }, xa, ya, props.snap);

      // Detent: measure the pointer's pixel distance from each origin's screen
      // position along that axis and let the core decide whether it sticks.
      const originPoint = pointFromValue({ x: xa.origin, y: ya.origin }, xa, ya);
      const dxPx = Math.abs(px - originPoint.x) * rect.width;
      const dyPx = Math.abs(py - originPoint.y) * rect.height;
      return {
        x: applyDetentAxis(next.x, xa, dxPx),
        y: applyDetentAxis(next.y, ya, dyPx),
      };
    };

    const emitValue = (next: XYValue) => {
      emit('change', next);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (props.disabled) return;
      // Ignore non-primary/secondary pointers: a right-click or a second touch must not
      // start a drag, emit a value, or grab capture. (Alt+left-click reset still works —
      // it's button 0 + primary, then hits the altKey early-out just below.)
      if (e.button !== 0 || !e.isPrimary) return;
      // Alt+click resets: let the click→reset() path own it so we don't place-and-
      // emit an intermediate value here first (Alt+click would otherwise emit twice).
      if (e.altKey) return;
      e.preventDefault();
      // Guard: a lost/duplicate capture must not abort placing the point.
      try {
        areaRef.value?.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture is best-effort; the buttons===0 move guard covers loss.
      }
      areaRef.value?.focus();
      dragging = true;
      active.value = true;
      draggingState.value = true;
      emitValue(pointToValue(e.clientX, e.clientY, e.shiftKey));
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      // Lost-capture insurance: no buttons down means the drag is over. A fast release
      // delivers this buttons===0 move *before* pointerup, so finish the drag here (and
      // spring home / release capture) rather than bailing and losing the pointerup.
      if (e.buttons === 0) {
        finishDrag(e);
        return;
      }
      emitValue(pointToValue(e.clientX, e.clientY, e.shiftKey));
    };

    // Single idempotent drag-finish routine wired to BOTH pointerup and pointercancel,
    // and called from the buttons===0 bail in handlePointerMove. Idempotent so calling it
    // from the move-bail and a following pointerup is safe (the second call early-returns).
    const finishDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      draggingState.value = false;
      // Release the capture grabbed on pointerdown — otherwise it leaks (especially on the
      // buttons===0 bail path, which never reached the old pointerup).
      try {
        areaRef.value?.releasePointerCapture(e.pointerId);
      } catch {
        // Releasing a capture we never held (or already lost) is a no-op we can ignore.
      }
      // Reconcile `active`: a drag can end with the pointer off the pad (touch, flick), so
      // no leave/blur fires to clear it. Only clear active when the pad is neither hovered
      // nor focused, so a drag that ends over/on the pad keeps its hover/focus lit.
      const el = areaRef.value;
      const stillActive =
        (el?.matches(':hover') ?? false) || el === (el?.ownerDocument ?? document).activeElement;
      if (!stillActive) active.value = false;
      // Joystick: spring the thumb home on release. The transition is re-enabled the
      // moment data-dragging flips false, so emitting the origin here eases there.
      if (props.returnToCenter) {
        emitValue(normalizeValue(centerValue(xAxis.value, yAxis.value), xAxis.value, yAxis.value, props.snap));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (props.disabled) return;
      const mode = e.shiftKey ? 'coarse' : e.altKey ? 'fine' : 'normal';
      const cur = props.value;
      const xa = xAxis.value;
      const ya = yAxis.value;
      const ctrl = e.ctrlKey || e.metaKey;
      let next: XYValue | null = null;

      switch (e.key) {
        case 'ArrowUp':
          next = nudge(cur, 'y', 1, xa, ya, mode);
          break;
        case 'ArrowDown':
          next = nudge(cur, 'y', -1, xa, ya, mode);
          break;
        case 'ArrowRight':
          next = nudge(cur, 'x', 1, xa, ya, mode);
          break;
        case 'ArrowLeft':
          next = nudge(cur, 'x', -1, xa, ya, mode);
          break;
        case 'PageUp':
          next = nudge(cur, 'y', 1, xa, ya, 'coarse');
          break;
        case 'PageDown':
          next = nudge(cur, 'y', -1, xa, ya, 'coarse');
          break;
        case 'Home':
          // Ctrl/Cmd+Home → min corner; plain Home → X to min.
          next = ctrl ? { x: xa.min, y: ya.min } : { x: xa.min, y: cur.y };
          break;
        case 'End':
          next = ctrl ? { x: xa.max, y: ya.max } : { x: xa.max, y: cur.y };
          break;
        default:
          return;
      }

      e.preventDefault();
      // Keyboard sets and holds even in joystick mode; the return fires on pointer
      // release only. The thumb eases via CSS (data-dragging is false here).
      emitValue(next);
    };

    const reset = () => {
      if (props.disabled) return;
      // Reset target: the natural home is each axis's origin (midpoint for a bipolar
      // axis, min otherwise), normalized/snapped into range.
      emitValue(normalizeValue(centerValue(xAxis.value, yAxis.value), xAxis.value, yAxis.value, props.snap));
    };

    return () => {
      const xa = xAxis.value;
      const ya = yAxis.value;
      const value = props.value;

      // Per-axis label (falls back to X / Y) and value, formatted to the axis step.
      // These feed the decorative in-pad axis labels and stay byte-consistent with
      // the default aria-valuetext below.
      const xLabel = props.x?.label ?? 'X';
      const yLabel = props.y?.label ?? 'Y';
      const xText = `${xLabel} ${formatComponent(value.x, xa)}`;
      const yText = `${yLabel} ${formatComponent(value.y, ya)}`;

      // Visible in-pad axis text: label only by default, label+value when showValues.
      // aria-valuetext (below) always carries the numbers, so this stays cosmetic.
      const xVisual = props.showValues ? xText : xLabel;
      const yVisual = props.showValues ? yText : yLabel;

      // aria-valuetext string (the accessible source of truth). `formatValue`, when
      // given, owns it in full; otherwise it names both axes AND their values for
      // screen readers — independent of `showValues`, so accessibility never regresses.
      const readout = props.formatValue
        ? props.formatValue(value)
        : `${xText}  ${yText}`;

      // Grid subdivisions are 5×5 by default; `density` scales both.
      const dens = typeof props.density === 'number' && props.density > 0 ? props.density : 1;
      let baseX: number, baseY: number;
      if (props.grid === false) { baseX = 0; baseY = 0; }
      else if (typeof props.grid === 'number') { baseX = props.grid; baseY = props.grid; } // explicit number = uniform NxN
      else { baseX = DEFAULT_GRID_X; baseY = DEFAULT_GRID_Y; }                              // undefined/true = 5x5
      const gridX = baseX > 0 ? Math.round(baseX * dens) : 0;
      const gridY = baseY > 0 ? Math.round(baseY * dens) : 0;
      const showGrid = gridX > 0 && gridY > 0;

      // Thumb/guide position straight from the value — the single value→CSS mapping.
      const point = pointFromValue(value, xa, ya);
      const leftPct = `${point.x * 100}%`;
      const topPct = `${point.y * 100}%`;

      return h('div', {
        class: 'tweakers-xy',
        'data-active': String(active.value),
        'data-disabled': String(props.disabled),
      }, [
        h('div', { class: 'tweakers-xy-header' }, [
          h('span', { class: 'tweakers-xy-label' }, [
            props.label,
            props.shortcut
              ? h('span', {
                class: `tweakers-shortcut-pill${props.shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`,
              }, formatSliderShortcut(props.shortcut))
              : null,
          ]),
        ]),

        h('div', {
          ref: areaRef,
          class: 'tweakers-xy-area',
          // Only the height is fixed (from `size`); width is fluid (CSS width:100%),
          // so the pad grows to fill the container and is no longer forced square.
          style: { height: `${props.size}px` },
          role: 'application',
          'aria-roledescription': '2D pad',
          'aria-label': props.label,
          'aria-valuetext': readout,
          'aria-valuemin': xa.min,
          'aria-valuemax': xa.max,
          'aria-valuenow': value.x,
          'aria-disabled': props.disabled || undefined,
          tabindex: props.disabled ? -1 : 0,
          'data-active': String(active.value),
          'data-dragging': String(draggingState.value),
          'data-disabled': String(props.disabled),
          onPointerdown: handlePointerDown,
          onPointermove: handlePointerMove,
          onPointerup: finishDrag,
          onPointercancel: finishDrag,
          onDblclick: reset,
          onClick: (e: MouseEvent) => { if (e.altKey) reset(); },
          onKeydown: handleKeyDown,
          onFocus: () => { active.value = true; },
          onBlur: () => { active.value = false; },
          onPointerenter: () => { active.value = true; },
          onPointerleave: () => { if (!dragging) active.value = false; },
        }, [
          showGrid
            ? h('div', {
              class: 'tweakers-xy-grid',
              'aria-hidden': 'true',
              style: {
                '--tweak-xy-grid-step-x': `${100 / gridX}%`,
                '--tweak-xy-grid-step-y': `${100 / gridY}%`,
              },
            })
            : null,
          // Live axis labels, decorative (aria-valuetext owns the accessible string):
          // X along the bottom edge, Y up the left edge.
          h('div', { class: 'tweakers-xy-axis tweakers-xy-axis-x', 'aria-hidden': 'true' }, xVisual),
          h('div', { class: 'tweakers-xy-axis tweakers-xy-axis-y', 'aria-hidden': 'true' }, yVisual),
          // Crosshair guides tracking the thumb, revealed on data-active.
          h('div', { class: 'tweakers-xy-guide tweakers-xy-guide-v', 'aria-hidden': 'true', style: { left: leftPct } }),
          h('div', { class: 'tweakers-xy-guide tweakers-xy-guide-h', 'aria-hidden': 'true', style: { top: topPct } }),
          h('div', { class: 'tweakers-xy-thumb', 'aria-hidden': 'true', style: { left: leftPct, top: topPct } }),
        ]),
      ]);
    };
  },
});
