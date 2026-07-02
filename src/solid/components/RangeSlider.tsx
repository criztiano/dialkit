import { createSignal, createEffect, onMount, onCleanup, Show } from 'solid-js';
import { animate, motionValue } from 'motion';
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

interface RangeSliderProps {
  label: string;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  /** Lower bound of the track. */
  min?: number;
  /** Upper bound of the track. */
  max?: number;
  step?: number;
  /** Reset target for a double-click on the track. Falls back to the full {min,max} span. */
  defaultValue?: RangeValue;
}

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

export function RangeSlider(props: RangeSliderProps) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 1;
  const step = () => props.step ?? 0.01;

  let wrapperRef!: HTMLDivElement;
  let trackRef!: HTMLDivElement;
  let fillRef!: HTMLDivElement;
  let lowHandleRef!: HTMLDivElement;
  let highHandleRef!: HTMLDivElement;
  let inputRef!: HTMLInputElement;

  const [isInteracting, setIsInteracting] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isHovered, setIsHovered] = createSignal(false);
  // Which bound the inline editor is currently editing (null = not editing).
  const [editing, setEditing] = createSignal<'min' | 'max' | null>(null);
  const [inputValue, setInputValue] = createSignal('');
  // The locked drag target, exposed as a signal because handle opacity (below)
  // reads it in a reactive effect — pointer-down writes it, the effect reacts.
  const [dragTarget, setDragTarget] = createSignal<DragTarget | null>(null);

  // Normalize the incoming pair through the core when idle so an out-of-bounds
  // or reversed prop from the parent is clamped + ordered before we render it.
  // While interacting we're the source of truth (helpers already keep it valid),
  // so pass the live pair straight through to avoid a normalize/echo round-trip.
  const value = (): RangeValue =>
    isInteracting() ? props.value : clampRange(props.value, min(), max());

  // Degenerate bounds (max === min) have no span to map onto: report 0% instead
  // of dividing by zero (which would feed NaN into the fill width and handles).
  const span = () => max() - min();
  const lowPercent = () => (span() === 0 ? 0 : ((value().min - min()) / span()) * 100);
  const highPercent = () => (span() === 0 ? 0 : ((value().max - min()) / span()) * 100);
  const isActive = () => isInteracting() || isHovered();

  // Motion values drive the fill + both handles imperatively during drag, so the
  // fill tracks the pointer without waiting for a render (as in Slider).
  const lowMotion = motionValue(lowPercent());
  const highMotion = motionValue(highPercent());

  // Fill spans BETWEEN the handles: left at the low handle, width to the high one.
  const applyFillStyles = () => {
    const lo = lowMotion.get();
    const hi = highMotion.get();
    if (fillRef) {
      fillRef.style.left = `${lo}%`;
      fillRef.style.width = `${Math.max(0, hi - lo)}%`;
    }
    // Both handle lines depend on BOTH percents so they can splay around the range
    // midpoint: far apart they sit ~inside their fill edge (unchanged look); as they
    // approach, the shared helper's min/max keeps them distinct and never crossing.
    const handles = handleLeftStyles(lo, hi);
    if (lowHandleRef) lowHandleRef.style.left = handles.low;
    if (highHandleRef) highHandleRef.style.left = handles.high;
  };

  // Click-vs-drag detection + stable geometry captured at pointer-down. Mirrors
  // Slider's plain-`let` gesture state (no reactivity needed for these).
  let pointerDownPos: { x: number; y: number } | null = null;
  let isClickFlag = true;
  // True only when a plain click may jump a handle: the press started on empty
  // track (outside the span). A press inside the span/grab-zone leaves this false
  // so the click stays a no-op and can't shrink the range the user set.
  let clickMoves = false;
  let wrapperRect: DOMRect | null = null;
  let scaleVal = 1;
  // Snapshot of the value at gesture start — span-drag shifts relative to this
  // so accumulated rounding can't make the span creep. Overwritten on every
  // pointer-down.
  let dragStartValue: RangeValue = props.value;
  let dragStartValueAt = 0;
  // A settle/reset can animate BOTH springs (double-click resets both handles),
  // so track them separately and stop BOTH before a drag or a new animation. An
  // untracked low reset spring would keep writing its motion value after the high
  // one was stopped, shuddering the handle.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // reason: motion's animate() returns an untyped playback controls object.
  let lowSnapAnim: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // reason: motion's animate() returns an untyped playback controls object.
  let highSnapAnim: any = null;
  // Stop every in-flight settle spring (click-move animates one, reset both).
  const stopSnaps = () => {
    lowSnapAnim?.stop();
    highSnapAnim?.stop();
    lowSnapAnim = null;
    highSnapAnim = null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // reason: motion's animate() returns an untyped playback controls object.
  let lowOpacityAnim: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // reason: motion's animate() returns an untyped playback controls object.
  let highOpacityAnim: any = null;

  // clientX -> value in bounds, using the rect/scale captured at pointer-down.
  // Identical scene-space math to Slider.positionToValue.
  const positionToValue = (clientX: number) => {
    if (!wrapperRect) return value().min;
    const screenX = clientX - wrapperRect.left;
    const sceneX = screenX / scaleVal;
    const nativeWidth = wrapperRef ? wrapperRef.offsetWidth : wrapperRect.width;
    const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
    const rawValue = min() + percent * (max() - min());
    return Math.max(min(), Math.min(max(), rawValue));
  };

  const percentFromValue = (v: number) => (span() === 0 ? 0 : ((v - min()) / span()) * 100);

  // Push both motion values from a range so the fill + handles update together.
  const syncMotion = (next: RangeValue) => {
    lowMotion.jump(percentFromValue(next.min));
    highMotion.jump(percentFromValue(next.max));
  };

  // Sync fill from props when idle (skip while a spring settle is mid-flight so
  // the animation isn't yanked back to the pre-animation value).
  createEffect(() => {
    if (!isInteracting() && !lowSnapAnim && !highSnapAnim) {
      lowMotion.jump(lowPercent());
      highMotion.jump(highPercent());
    }
  });

  const handlePointerDown = (e: PointerEvent) => {
    if (editing()) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerDownPos = { x: e.clientX, y: e.clientY };
    isClickFlag = true;
    setIsInteracting(true);

    // Capture wrapper rect + scale once, like Slider, for a stable reference
    // across the whole gesture (page could scroll/zoom mid-drag otherwise).
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      scaleVal = wrapperRect.width / wrapperRef.offsetWidth;
    }

    // reason: snapshot the CLAMPED, ordered pair explicitly — NOT value(), which
    // returns the raw (possibly out-of-bounds/reversed) prop while interacting
    // (isInteracting was just set true above). Mirrors Vue/React so a reversed or
    // out-of-bounds prop can't corrupt grab-target / clickMoves / span-drag.
    const current = clampRange(props.value, min(), max());
    const atValue = positionToValue(e.clientX);
    // Give each handle an inward grab zone (HANDLE_HIT_PX, in value units) so a
    // handle parked at its bound is still grabbable. pickDragTarget prioritizes
    // a handle press over span-drag; nearestHandle breaks overlap ties by side.
    const trackW = wrapperRef?.offsetWidth ?? 1;
    const hitV = (HANDLE_HIT_PX / trackW) * (max() - min());
    const target = pickDragTarget(atValue, current, hitV);
    setDragTarget(target);
    // Only an empty-track press may jump a handle on a plain click; a press
    // inside the span (mid-span OR inside a grab zone) stays a no-op.
    clickMoves = target !== 'span' && isOutsideSpan(atValue, current);
    dragStartValue = current;
    dragStartValueAt = atValue;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isInteracting() || !pointerDownPos) return;

    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (isClickFlag && distance > CLICK_THRESHOLD) {
      isClickFlag = false;
      setIsDragging(true);
    }

    if (isClickFlag) return;

    // Drag mode — instant update through the core helpers.
    const raw = roundValue(positionToValue(e.clientX), step());
    const target = dragTarget();
    const current = value();
    let next: RangeValue;
    if (target === 'span') {
      // Shift relative to the gesture's start snapshot so width is preserved
      // exactly and rounding can't accumulate drift.
      const delta = raw - roundValue(dragStartValueAt, step());
      next = shiftSpan(delta, dragStartValue, min(), max());
    } else if (target === 'min') {
      next = setLow(raw, current, min());
    } else {
      next = setHigh(raw, current, max());
    }

    stopSnaps();
    syncMotion(next);
    props.onChange(next);
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isInteracting()) return;

    // A click INSIDE the selected span (mid-span OR inside a handle's grab zone)
    // is a no-op: it must not shrink the range the user set. Only a click that
    // STARTED on the empty track moves the nearest handle to the point, with the
    // same spring-settle Slider uses. clickMoves captures that at pointer-down.
    if (isClickFlag && clickMoves) {
      const raw = roundValue(positionToValue(e.clientX), step());
      const current = value();
      const which = dragTarget() ?? nearestHandle(raw, current);
      const next = which === 'min' ? setLow(raw, current, min()) : setHigh(raw, current, max());

      const handleMotion = which === 'min' ? lowMotion : highMotion;
      const targetPct = percentFromValue(which === 'min' ? next.min : next.max);
      // Stop every spring (a prior reset may have both mid-flight) before the
      // single click-move settle; track it under the moved handle so the idle
      // guard and the next drag both see it.
      stopSnaps();
      const anim = animate(handleMotion, targetPct, {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          if (which === 'min') lowSnapAnim = null;
          else highSnapAnim = null;
        },
      });
      if (which === 'min') lowSnapAnim = anim;
      else highSnapAnim = anim;
      props.onChange(next);
    }

    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
    setDragTarget(null);
  };

  const handlePointerCancel = () => {
    if (!isInteracting()) return;
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
    setDragTarget(null);
  };

  // Double-click the track resets BOTH handles to the configured default (else
  // the full {min,max} span), spring-settling both to their target percent with
  // the same 300/25/0.8 spring as the click-move. Ignored mid-edit so a
  // double-click on a bound number opens/uses the editor instead. Bound spans
  // stopPropagation, so a double-click on a number never reaches here.
  const handleDoubleClick = () => {
    if (editing() !== null) return;
    const d = clampRange(props.defaultValue ?? { min: min(), max: max() }, min(), max());
    stopSnaps();
    // Track BOTH reset springs so an interrupting drag/click stops both — an
    // untracked low spring would keep writing the motion value and shudder.
    lowSnapAnim = animate(lowMotion, percentFromValue(d.min), {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => { lowSnapAnim = null; },
    });
    highSnapAnim = animate(highMotion, percentFromValue(d.max), {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => { highSnapAnim = null; },
    });
    props.onChange(d);
  };

  // Both handles stay subtly visible at rest (opacity 0.35) and lift on
  // hover/drag — the two visible handles are what read as "a range". The active
  // handle during a drag is the most prominent. Driven through motion values +
  // animate (as Slider drives its handle), so the transition is imperative.
  const restOpacity = 0.35;
  const lowOpacityMv = motionValue(restOpacity);
  const highOpacityMv = motionValue(restOpacity);

  const applyLowHandleOpacity = () => {
    if (lowHandleRef) lowHandleRef.style.opacity = String(lowOpacityMv.get());
  };
  const applyHighHandleOpacity = () => {
    if (highHandleRef) highHandleRef.style.opacity = String(highOpacityMv.get());
  };

  createEffect(() => {
    const active = isActive();
    const dragging = isDragging();
    const target = dragTarget();
    const lowTarget = !active ? restOpacity : dragging && target === 'min' ? 0.95 : 0.7;
    const highTarget = !active ? restOpacity : dragging && target === 'max' ? 0.95 : 0.7;

    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
    lowOpacityAnim = animate(lowOpacityMv, lowTarget, { duration: 0.15 });
    highOpacityAnim = animate(highOpacityMv, highTarget, { duration: 0.15 });
  });

  onMount(() => {
    const unsubLow = lowMotion.on('change', applyFillStyles);
    const unsubHigh = highMotion.on('change', applyFillStyles);
    const unsubLowOpacity = lowOpacityMv.on('change', applyLowHandleOpacity);
    const unsubHighOpacity = highOpacityMv.on('change', applyHighHandleOpacity);
    applyFillStyles();
    applyLowHandleOpacity();
    applyHighHandleOpacity();

    onCleanup(() => {
      unsubLow();
      unsubHigh();
      unsubLowOpacity();
      unsubHighOpacity();
    });
  });

  onCleanup(() => {
    stopSnaps();
    lowOpacityAnim?.stop();
    highOpacityAnim?.stop();
  });

  // Focus + select the inline input when it appears (matches Slider).
  createEffect(() => {
    if (editing() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });

  const decimals = () => decimalsForStep(step());

  const openEditor = (which: 'min' | 'max') => {
    setEditing(which);
    setInputValue((which === 'min' ? value().min : value().max).toFixed(decimals()));
  };

  const commitEditor = () => {
    const which = editing();
    if (!which) return;
    const parsed = parseFloat(inputValue());
    if (!isNaN(parsed)) {
      const rounded = roundValue(parsed, step());
      const current = value();
      // Commit through the core so the edited bound clamps to the track and
      // cannot cross the other handle (setLow caps at value.max, setHigh at value.min).
      const next = which === 'min' ? setLow(rounded, current, min()) : setHigh(rounded, current, max());
      props.onChange(next);
    }
    // A no-op / NaN entry just cancels — nothing to commit.
    setEditing(null);
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') commitEditor();
    else if (e.key === 'Escape') setEditing(null);
  };

  const lowText = () => value().min.toFixed(decimals());
  const highText = () => value().max.toFixed(decimals());

  return (
    <div ref={wrapperRef} class="dialkit-range-slider-wrapper">
      <div
        ref={trackRef}
        class={`dialkit-range-slider ${isActive() ? 'dialkit-range-slider-active' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDblClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={fillRef}
          class="dialkit-range-slider-fill"
          style={{ left: `${lowPercent()}%`, width: `${Math.max(0, highPercent() - lowPercent())}%` }}
        />

        <div
          ref={lowHandleRef}
          class="dialkit-range-slider-handle"
          style={{
            left: handleLeftStyles(lowPercent(), highPercent()).low,
            transform: 'translateY(-50%)',
            opacity: restOpacity,
          }}
        />
        <div
          ref={highHandleRef}
          class="dialkit-range-slider-handle"
          style={{
            left: handleLeftStyles(lowPercent(), highPercent()).high,
            transform: 'translateY(-50%)',
            opacity: restOpacity,
          }}
        />

        <span class="dialkit-range-slider-label">{props.label}</span>

        <Show
          when={editing() !== null}
          fallback={
            <span class="dialkit-range-slider-value">
              <span
                class="dialkit-range-slider-bound"
                onClick={(e) => { e.stopPropagation(); openEditor('min'); }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {lowText()}
              </span>
              <span class="dialkit-range-slider-dash">–</span>
              <span
                class="dialkit-range-slider-bound"
                onClick={(e) => { e.stopPropagation(); openEditor('max'); }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {highText()}
              </span>
            </span>
          }
        >
          <input
            ref={inputRef}
            type="text"
            class="dialkit-range-slider-input"
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={commitEditor}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </Show>
      </div>
    </div>
  );
}
