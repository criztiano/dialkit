import { defineComponent, h, computed, nextTick, onMounted, onUnmounted, ref, watch, type PropType } from 'vue';
import { animate, motionValue } from 'motion-v';
import {
  clampRange,
  setLow,
  setHigh,
  shiftSpan,
  nearestHandle,
  pickDragTarget,
  isOutsideSpan,
  handleLeftStyles,
} from '../../range-slider-core';
import type { RangeValue } from '../../store/DialStore';
import { decimalsForStep, roundValue } from '../../shortcut-utils';

// Shared with the single Slider: 3px of travel separates a click from a drag.
const CLICK_THRESHOLD = 3;

// Grab radius (px) reaching inward from each handle, so a handle parked at its
// bound — with no empty track outside to press — is still grabbable from just
// inside the fill. Converted to value units at pointer-down against track width.
const HANDLE_HIT_PX = 12;

/**
 * Which part of the control a pointer grabbed. `min`/`max` drag one handle;
 * `span` drags both (preserving width). Decided on pointer-down and locked for
 * the gesture so a fast drag can't hand off mid-stroke.
 */
type DragTarget = 'min' | 'max' | 'span';

export const RangeSlider = defineComponent({
  name: 'DialKitRangeSlider',
  props: {
    label: { type: String, required: true },
    value: { type: Object as PropType<RangeValue>, required: true },
    /** Lower bound of the track. */
    min: { type: Number, required: false },
    /** Upper bound of the track. */
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
    defaultValue: { type: Object as PropType<RangeValue>, required: false, default: undefined },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const min = computed(() => props.min ?? 0);
    const max = computed(() => props.max ?? 1);
    const step = computed(() => props.step ?? 0.01);

    const wrapperRef = ref<HTMLElement | null>(null);
    const fillRef = ref<HTMLElement | null>(null);
    const lowHandleRef = ref<HTMLElement | null>(null);
    const highHandleRef = ref<HTMLElement | null>(null);
    const inputRef = ref<HTMLInputElement | null>(null);

    // Reactive UI state (drives class toggles + handle opacity via watchers).
    const isInteracting = ref(false);
    const isDragging = ref(false);
    const isHovered = ref(false);
    // Which bound the inline editor is currently editing (null = not editing).
    const editing = ref<'min' | 'max' | null>(null);
    const inputValue = ref('');

    // Normalize the incoming pair through the core when idle so an out-of-bounds
    // or reversed prop from the parent is clamped + ordered before we render it.
    // While interacting we're the source of truth (helpers already keep it valid),
    // so pass the live pair straight through to avoid a normalize/echo round-trip.
    const value = computed<RangeValue>(() =>
      isInteracting.value ? props.value : clampRange(props.value, min.value, max.value)
    );

    // Degenerate bounds (max === min) have no span to map onto: report 0% instead
    // of dividing by zero (which would feed NaN into the fill width and handles).
    const span = computed(() => max.value - min.value);
    const percentFromValue = (v: number) =>
      span.value === 0 ? 0 : ((v - min.value) / span.value) * 100;
    const lowPercent = computed(() => percentFromValue(value.value.min));
    const highPercent = computed(() => percentFromValue(value.value.max));
    const isActive = computed(() => isInteracting.value || isHovered.value);

    // Motion values drive the fill + both handles imperatively during drag, so
    // the fill tracks the pointer without waiting for a Vue render (as in Slider).
    const lowMotion = motionValue(lowPercent.value);
    const highMotion = motionValue(highPercent.value);

    // Non-reactive gesture scratch (refs, not Vue state): mutating these mid-drag
    // must NOT trigger re-render — the motion values already paint the DOM.
    let pointerDownPos: { x: number; y: number } | null = null;
    let isClickFlag = true;
    let dragTarget: DragTarget | null = null;
    // True only when a plain click may jump a handle: the press started on empty
    // track (outside the span). A press inside the span/grab-zone leaves this false
    // so the click stays a no-op and can't shrink the range the user set.
    let clickMoves = false;
    // Snapshot of the value at gesture start — span-drag shifts relative to this
    // so accumulated rounding can't make the span creep. Seeded on pointer-down.
    let dragStartValue: RangeValue = props.value;
    let dragStartValueAt = 0;
    let wrapperRect: DOMRect | null = null;
    let scaleVal = 1;
    // A settle/reset can animate BOTH springs (double-click resets both handles),
    // so track them separately and stop BOTH before a drag or a new animation. An
    // untracked low reset spring would keep writing its motion value after the high
    // one was stopped, shuddering the handle.
    let lowAnim: ReturnType<typeof animate> | null = null;
    let highAnim: ReturnType<typeof animate> | null = null;
    // Stop every in-flight settle spring (click-move animates one, reset both).
    const stopAnims = () => {
      lowAnim?.stop();
      highAnim?.stop();
      lowAnim = null;
      highAnim = null;
    };

    // Fill spans BETWEEN the handles: left at the low handle, width to the high one.
    const applyFillStyles = () => {
      const lo = lowMotion.get();
      const hi = highMotion.get();
      if (fillRef.value) {
        fillRef.value.style.left = `${lo}%`;
        fillRef.value.style.width = `${Math.max(0, hi - lo)}%`;
      }
      // Both handle lines depend on BOTH percents so they can splay around the range
      // midpoint: far apart they sit ~inside their fill edge (unchanged look); as they
      // approach, the shared helper's min/max keeps them distinct and never crossing.
      const handles = handleLeftStyles(lo, hi);
      if (lowHandleRef.value) lowHandleRef.value.style.left = handles.low;
      if (highHandleRef.value) highHandleRef.value.style.left = handles.high;
    };

    // Both handles stay subtly visible at rest (opacity 0.35) and lift on
    // hover/drag — the two visible handles are what read as "a range". The active
    // handle during a drag is the most prominent.
    const REST_OPACITY = 0.35;
    const handleOpacityFor = (which: 'min' | 'max') => {
      if (!isActive.value) return REST_OPACITY;
      if (isDragging.value && dragTarget === which) return 0.95;
      return 0.7;
    };
    const applyHandleOpacity = () => {
      if (lowHandleRef.value) lowHandleRef.value.style.opacity = String(handleOpacityFor('min'));
      if (highHandleRef.value) highHandleRef.value.style.opacity = String(handleOpacityFor('max'));
    };

    // clientX -> value in bounds, using the rect/scale captured at pointer-down.
    // Identical scene-space math to Slider.positionToValue.
    const positionToValue = (clientX: number) => {
      if (!wrapperRect) return value.value.min;
      const screenX = clientX - wrapperRect.left;
      const sceneX = screenX / scaleVal;
      const nativeWidth = wrapperRef.value ? wrapperRef.value.offsetWidth : wrapperRect.width;
      const pct = Math.max(0, Math.min(1, sceneX / nativeWidth));
      const rawValue = min.value + pct * (max.value - min.value);
      return Math.max(min.value, Math.min(max.value, rawValue));
    };

    // Push both motion values from a range so the fill + handles update together.
    const syncMotion = (next: RangeValue) => {
      lowMotion.jump(percentFromValue(next.min));
      highMotion.jump(percentFromValue(next.max));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (editing.value) return;
      event.preventDefault();
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isInteracting.value = true;

      // Capture wrapper rect + scale once, like Slider, for a stable reference
      // across the whole gesture (page could scroll/zoom mid-drag otherwise).
      if (wrapperRef.value) {
        wrapperRect = wrapperRef.value.getBoundingClientRect();
        scaleVal = wrapperRect.width / wrapperRef.value.offsetWidth;
      }

      // Snapshot the CLAMPED, ordered pair explicitly — independent of the
      // `value` computed, which returns the raw (possibly out-of-bounds/reversed)
      // prop while interacting (isInteracting was just set true above). Mirrors
      // the React reference, which closes over the clamped value at pointer-down.
      const current = clampRange(props.value, min.value, max.value);
      const atValue = positionToValue(event.clientX);
      // Give each handle an inward grab zone (HANDLE_HIT_PX, in value units) so a
      // handle parked at its bound is still grabbable. pickDragTarget prioritizes
      // a handle press over span-drag; nearestHandle breaks overlap ties by side.
      const trackW = wrapperRef.value?.offsetWidth ?? 1;
      const hitV = (HANDLE_HIT_PX / trackW) * (max.value - min.value);
      dragTarget = pickDragTarget(atValue, current, hitV);
      // Only an empty-track press may jump a handle on a plain click; a press
      // inside the span (mid-span OR inside a grab zone) stays a no-op.
      clickMoves = dragTarget !== 'span' && isOutsideSpan(atValue, current);
      dragStartValue = current;
      dragStartValueAt = atValue;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isInteracting.value || !pointerDownPos) return;

      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (isClickFlag && distance > CLICK_THRESHOLD) {
        isClickFlag = false;
        isDragging.value = true;
      }

      if (isClickFlag) return;

      // Drag mode — instant update through the core helpers.
      const raw = roundValue(positionToValue(event.clientX), step.value);
      const current = value.value;
      let next: RangeValue;
      if (dragTarget === 'span') {
        // Shift relative to the gesture's start snapshot so width is preserved
        // exactly and rounding can't accumulate drift.
        const delta = raw - roundValue(dragStartValueAt, step.value);
        next = shiftSpan(delta, dragStartValue, min.value, max.value);
      } else if (dragTarget === 'min') {
        next = setLow(raw, current, min.value);
      } else {
        next = setHigh(raw, current, max.value);
      }

      stopAnims();
      syncMotion(next);
      emit('change', next);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isInteracting.value) return;

      // A click INSIDE the selected span (mid-span OR inside a handle's grab zone)
      // is a no-op: it must not shrink the range the user set. Only a click that
      // STARTED on the empty track moves the nearest handle to the point, with the
      // same spring-settle Slider uses. clickMoves captures that at pointer-down.
      if (isClickFlag && clickMoves) {
        const current = value.value;
        const raw = roundValue(positionToValue(event.clientX), step.value);
        const which = dragTarget ?? nearestHandle(raw, current);
        const next = which === 'min' ? setLow(raw, current, min.value) : setHigh(raw, current, max.value);

        const targetMotion = which === 'min' ? lowMotion : highMotion;
        const targetPct = percentFromValue(which === 'min' ? next.min : next.max);
        // Stop every spring (a prior reset may have both mid-flight) before the
        // single click-move settle; track it under the moved handle so the idle
        // guard and the next drag both see it.
        stopAnims();
        const active = animate(targetMotion, targetPct, {
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            if (which === 'min') lowAnim = null;
            else highAnim = null;
          },
        });
        if (which === 'min') lowAnim = active;
        else highAnim = active;
        emit('change', next);
      }

      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
      dragTarget = null;
    };

    const handlePointerCancel = () => {
      if (!isInteracting.value) return;
      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
      dragTarget = null;
    };

    // Double-click the track resets BOTH handles to the configured default (else
    // the full {min,max} span), spring-settling both to their target percent with
    // the same 300/25/0.8 spring as the click-move. Ignored mid-edit so a
    // double-click on a bound number opens/uses the editor instead. Bound spans
    // stopPropagation, so a double-click on a number never reaches here.
    const handleDoubleClick = () => {
      if (editing.value !== null) return;
      const d = clampRange(props.defaultValue ?? { min: min.value, max: max.value }, min.value, max.value);
      stopAnims();
      // Track BOTH reset springs so an interrupting drag/click stops both — an
      // untracked low spring would keep writing the motion value and shudder.
      lowAnim = animate(lowMotion, percentFromValue(d.min), {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => { lowAnim = null; },
      });
      highAnim = animate(highMotion, percentFromValue(d.max), {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => { highAnim = null; },
      });
      emit('change', d);
    };

    const decimals = computed(() => decimalsForStep(step.value));

    const openEditor = (which: 'min' | 'max', event: MouseEvent) => {
      event.stopPropagation();
      editing.value = which;
      inputValue.value = (which === 'min' ? value.value.min : value.value.max).toFixed(decimals.value);
    };

    const commitEditor = () => {
      if (!editing.value) return;
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        const rounded = roundValue(parsed, step.value);
        // Commit through the core so the edited bound clamps to the track and
        // cannot cross the other handle (setLow caps at value.max, setHigh at value.min).
        const current = value.value;
        const next = editing.value === 'min'
          ? setLow(rounded, current, min.value)
          : setHigh(rounded, current, max.value);
        emit('change', next);
      }
      // A no-op / NaN entry just cancels — nothing to commit.
      editing.value = null;
    };

    const handleInputKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        commitEditor();
      } else if (event.key === 'Escape') {
        editing.value = null;
      }
    };

    // Sync motion from props when idle (skip while a spring settle is mid-flight
    // so the animation isn't yanked back to the pre-animation value).
    watch([lowPercent, highPercent], ([lo, hi]) => {
      if (!isInteracting.value && !lowAnim && !highAnim) {
        lowMotion.jump(lo);
        highMotion.jump(hi);
      }
    });

    // Repaint handle opacity whenever the active/drag/target state changes.
    watch([isActive, isDragging], () => {
      applyHandleOpacity();
    });

    // Focus + select the inline input when it appears (matches Slider).
    watch(editing, async (which) => {
      if (which === null) return;
      await nextTick();
      inputRef.value?.focus();
      inputRef.value?.select();
    });

    let unsubLow: (() => void) | null = null;
    let unsubHigh: (() => void) | null = null;

    onMounted(() => {
      unsubLow = lowMotion.on('change', applyFillStyles);
      unsubHigh = highMotion.on('change', applyFillStyles);
      applyFillStyles();
      applyHandleOpacity();
    });

    onUnmounted(() => {
      stopAnims();
      unsubLow?.();
      unsubHigh?.();
    });

    return () => {
      const current = value.value;
      const lowText = current.min.toFixed(decimals.value);
      const highText = current.max.toFixed(decimals.value);
      // Both handle lefts derive from BOTH percents (for the shared midpoint splay).
      const handles = handleLeftStyles(lowPercent.value, highPercent.value);

      return h('div', { ref: wrapperRef, class: 'dialkit-range-slider-wrapper' }, [
        h('div', {
          class: `dialkit-range-slider ${isActive.value ? 'dialkit-range-slider-active' : ''}`,
          onPointerdown: handlePointerDown,
          onPointermove: handlePointerMove,
          onPointerup: handlePointerUp,
          onPointercancel: handlePointerCancel,
          onDblclick: handleDoubleClick,
          onMouseenter: () => { isHovered.value = true; },
          onMouseleave: () => { isHovered.value = false; },
        }, [
          h('div', {
            ref: fillRef,
            class: 'dialkit-range-slider-fill',
            style: {
              left: `${lowPercent.value}%`,
              width: `${Math.max(0, highPercent.value - lowPercent.value)}%`,
            },
          }),
          h('div', {
            ref: lowHandleRef,
            class: 'dialkit-range-slider-handle',
            style: {
              left: handles.low,
              transform: 'translateY(-50%)',
              opacity: handleOpacityFor('min'),
            },
          }),
          h('div', {
            ref: highHandleRef,
            class: 'dialkit-range-slider-handle',
            style: {
              left: handles.high,
              transform: 'translateY(-50%)',
              opacity: handleOpacityFor('max'),
            },
          }),
          h('span', { class: 'dialkit-range-slider-label' }, props.label),
          editing.value !== null
            ? h('input', {
              ref: inputRef,
              type: 'text',
              class: 'dialkit-range-slider-input',
              value: inputValue.value,
              onInput: (event: Event) => {
                inputValue.value = (event.target as HTMLInputElement).value;
              },
              onKeydown: handleInputKeydown,
              onBlur: commitEditor,
              onClick: (event: MouseEvent) => event.stopPropagation(),
              onPointerdown: (event: PointerEvent) => event.stopPropagation(),
            })
            : h('span', { class: 'dialkit-range-slider-value' }, [
              h('span', {
                class: 'dialkit-range-slider-bound',
                onClick: (event: MouseEvent) => openEditor('min', event),
                onPointerdown: (event: PointerEvent) => event.stopPropagation(),
              }, lowText),
              h('span', { class: 'dialkit-range-slider-dash' }, '–'),
              h('span', {
                class: 'dialkit-range-slider-bound',
                onClick: (event: MouseEvent) => openEditor('max', event),
                onPointerdown: (event: PointerEvent) => event.stopPropagation(),
              }, highText),
            ]),
        ]),
      ]);
    };
  },
});
