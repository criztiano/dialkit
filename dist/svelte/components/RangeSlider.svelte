<script lang="ts">
  import { tick } from 'svelte';
  import { Spring } from 'svelte/motion';
  import type { RangeValue } from '../../store/TweakStore';
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
  import { decimalsForStep, roundValue } from '../../shortcut-utils';

  let {
    label,
    value,
    onChange,
    min = 0,
    max = 1,
    step = 0.01,
    defaultValue,
  } = $props<{
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
  }>();

  // Shared with the single Slider: 3px of travel separates a click from a drag.
  const CLICK_THRESHOLD = 3;

  // Grab radius (px) reaching inward from each handle, so a handle parked at its
  // bound — with no empty track outside to press — is still grabbable from just
  // inside the fill. Converted to value units at pointer-down against track width.
  const HANDLE_HIT_PX = 12;

  let wrapperRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  let isInteracting = $state(false);
  let isDragging = $state(false);
  let isHovered = $state(false);
  // Which bound the inline editor is currently editing (null = not editing).
  let editing = $state<'min' | 'max' | null>(null);
  let inputValue = $state('');

  // Gesture-scoped refs. These deliberately stay OUTSIDE `$state`: mutating them
  // mid-drag must not schedule a re-render (they mirror React's `useRef`). Which
  // part was grabbed is decided on pointer-down and locked for the whole stroke
  // so a fast drag can't hand off mid-gesture.
  let pointerDownPos: { x: number; y: number } | null = null;
  let isClickFlag = true;
  // 'min'/'max' drag one handle; 'span' drags both (preserving width).
  let dragTarget: 'min' | 'max' | 'span' | null = null;
  // True only when a plain click may jump a handle: the press started on empty
  // track (outside the span). A press inside the span/grab-zone leaves this false
  // so the click stays a no-op and can't shrink the range the user set.
  let clickMoves = false;
  // Frozen snapshot of the value at gesture start. Span-drag shifts relative to
  // THIS (not the live value) so accumulated rounding can't make the span creep.
  // Overwritten on every pointer-down before it's ever read, so the initializer
  // is a throwaway placeholder (a constant, to avoid capturing reactive props).
  let dragStartValue: RangeValue = { min: 0, max: 0 };
  let dragStartValueAt = 0;
  let wrapperRect: DOMRect | null = null;
  let scaleVal = 1;
  // True while a click-settle spring is mid-flight, so the idle prop-sync effect
  // doesn't yank the animation back to its pre-animation position.
  let isSettling = false;

  // Normalize the incoming pair through the core when idle so an out-of-bounds or
  // reversed prop from the parent is clamped + ordered before we render it. While
  // interacting we're the source of truth (helpers already keep it valid), so pass
  // the live pair straight through to avoid a normalize/echo round-trip.
  const displayValue = $derived(isInteracting ? value : clampRange(value, min, max));

  // Degenerate bounds (max === min) have no span to map onto: report 0% instead of
  // dividing by zero (which would feed NaN into the fill width and handle offsets).
  const span = $derived(max - min);
  const lowPercentTarget = $derived(
    span === 0 ? 0 : ((displayValue.min - min) / span) * 100
  );
  const highPercentTarget = $derived(
    span === 0 ? 0 : ((displayValue.max - min) / span) * 100
  );
  const isActive = $derived(isInteracting || isHovered);

  // Springs drive the fill + both handles. Instant during drag (fill tracks the
  // pointer), animated on click for the same spring-settle the single Slider uses.
  // Seeded at 0; the idle $effect below runs on mount and immediately (instant)
  // snaps them to the resolved percentages, so there's no visible 0 -> value jump.
  const lowPercent = new Spring(0, { stiffness: 0.3, damping: 0.7 });
  const highPercent = new Spring(0, { stiffness: 0.3, damping: 0.7 });

  const percentFromValue = (v: number) => (span === 0 ? 0 : ((v - min) / span) * 100);

  // clientX -> value in bounds, using the rect/scale captured at pointer-down.
  // Identical scene-space math to the single Slider's positionToValue.
  const positionToValue = (clientX: number) => {
    if (!wrapperRect || !wrapperRef) return displayValue.min;
    const screenX = clientX - wrapperRect.left;
    const sceneX = screenX / scaleVal;
    const nativeWidth = wrapperRef.offsetWidth || wrapperRect.width;
    const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
    const rawValue = min + percent * (max - min);
    return Math.max(min, Math.min(max, rawValue));
  };

  // Push both springs from a range so the fill + handles update together.
  const syncMotion = (next: RangeValue, instant = true) => {
    lowPercent.set(percentFromValue(next.min), { instant });
    highPercent.set(percentFromValue(next.max), { instant });
  };

  // Sync springs from props when idle (skip while a click-settle is mid-flight so
  // the animation isn't yanked back to the pre-animation value).
  $effect(() => {
    // Touch the targets so the effect re-runs when the resolved value changes.
    const lo = lowPercentTarget;
    const hi = highPercentTarget;
    if (!isInteracting && !isSettling) {
      lowPercent.set(lo, { instant: true });
      highPercent.set(hi, { instant: true });
    }
  });

  // Focus + select the inline input when it appears (matches the single Slider).
  $effect(() => {
    if (editing !== null) {
      tick().then(() => {
        inputRef?.focus();
        inputRef?.select();
      });
    }
  });

  const handlePointerDown = (e: PointerEvent) => {
    if (editing !== null) return;
    e.preventDefault();

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerDownPos = { x: e.clientX, y: e.clientY };
    isClickFlag = true;
    isInteracting = true;

    // Capture wrapper rect + scale once, like the single Slider, for a stable
    // reference across the whole gesture (page could scroll/zoom mid-drag).
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      scaleVal = wrapperRect.width / wrapperRef.offsetWidth;
    }

    // reason: snapshot the CLAMPED, ordered pair explicitly — NOT displayValue,
    // which returns the raw (possibly out-of-bounds/reversed) prop while
    // interacting (isInteracting was just set true above). Mirrors Vue/React so a
    // reversed or out-of-bounds prop can't corrupt grab-target / clickMoves /
    // span-drag.
    const current = clampRange(value, min, max);
    const atValue = positionToValue(e.clientX);
    // Give each handle an inward grab zone (HANDLE_HIT_PX, in value units) so a
    // handle parked at its bound is still grabbable. pickDragTarget prioritizes
    // a handle press over span-drag; nearestHandle breaks overlap ties by side.
    const trackW = wrapperRef?.offsetWidth ?? 1;
    const hitV = (HANDLE_HIT_PX / trackW) * (max - min);
    dragTarget = pickDragTarget(atValue, current, hitV);
    // Only an empty-track press may jump a handle on a plain click; a press inside
    // the span (mid-span OR inside a grab zone) stays a no-op.
    clickMoves = dragTarget !== 'span' && isOutsideSpan(atValue, current);
    // Freeze the gesture-start snapshot for span-drag drift-free shifting.
    dragStartValue = current;
    dragStartValueAt = atValue;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isInteracting || !pointerDownPos) return;

    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (isClickFlag && distance > CLICK_THRESHOLD) {
      isClickFlag = false;
      isDragging = true;
    }

    if (isClickFlag) return;

    // Drag mode — instant update through the core helpers.
    const raw = roundValue(positionToValue(e.clientX), step);
    let next: RangeValue;
    if (dragTarget === 'span') {
      // Shift relative to the gesture's start snapshot so width is preserved
      // exactly and rounding can't accumulate drift.
      const delta = raw - roundValue(dragStartValueAt, step);
      next = shiftSpan(delta, dragStartValue, min, max);
    } else if (dragTarget === 'min') {
      next = setLow(raw, displayValue, min);
    } else {
      next = setHigh(raw, displayValue, max);
    }

    // A live drag owns the springs — cancel any in-flight click-settle.
    isSettling = false;
    syncMotion(next, true);
    onChange(next);
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isInteracting) return;

    // A click INSIDE the selected span (mid-span OR inside a handle's grab zone)
    // is a no-op: it must not shrink the range the user set. Only a click that
    // STARTED on the empty track moves the nearest handle to the point, with the
    // same spring-settle Slider uses. clickMoves captures that at pointer-down.
    if (isClickFlag && clickMoves) {
      const raw = roundValue(positionToValue(e.clientX), step);
      const which = dragTarget ?? nearestHandle(raw, displayValue);
      const next = which === 'min' ? setLow(raw, displayValue, min) : setHigh(raw, displayValue, max);

      // Animate only the handle that moved; leave the other where it rests.
      isSettling = true;
      // Spring.set(...) resolves once the spring actually SETTLES. Clearing the
      // guard on that promise (not a microtask via tick()) keeps the idle $effect
      // from snapping the still-gliding spring to the echoed prop mid-flight.
      const settled =
        which === 'min'
          ? lowPercent.set(percentFromValue(next.min))
          : highPercent.set(percentFromValue(next.max));
      settled.then(() => {
        isSettling = false;
      });
      onChange(next);
    }

    isInteracting = false;
    isDragging = false;
    pointerDownPos = null;
    dragTarget = null;
  };

  const handlePointerCancel = () => {
    if (!isInteracting) return;
    isInteracting = false;
    isDragging = false;
    pointerDownPos = null;
    dragTarget = null;
  };

  // Double-click the track resets BOTH handles to the configured default (else the
  // full {min,max} span), spring-settling both to their target percent with the
  // same settle the click-move uses. Ignored mid-edit so a double-click on a bound
  // number opens/uses the editor instead. Bound spans stopPropagation, so a
  // double-click on a number never reaches here.
  const handleDoubleClick = () => {
    if (editing !== null) return;
    const d = clampRange(defaultValue ?? { min, max }, min, max);
    // Settle both springs (animated, not instant) and guard the idle prop-sync so
    // it doesn't yank the animation back to the pre-animation value. Each Spring.set
    // resolves on settle; clear the guard only once BOTH have finished gliding, so
    // the idle $effect can't snap either spring to the echoed prop mid-flight.
    isSettling = true;
    const settledLow = lowPercent.set(percentFromValue(d.min));
    const settledHigh = highPercent.set(percentFromValue(d.max));
    Promise.all([settledLow, settledHigh]).then(() => {
      isSettling = false;
    });
    onChange(d);
  };

  const decimals = $derived(decimalsForStep(step));

  const openEditor = (which: 'min' | 'max') => {
    editing = which;
    inputValue = (which === 'min' ? displayValue.min : displayValue.max).toFixed(decimals);
  };

  const commitEditor = () => {
    if (editing === null) return;
    const parsed = Number.parseFloat(inputValue);
    if (!Number.isNaN(parsed)) {
      const rounded = roundValue(parsed, step);
      // Commit through the core so the edited bound clamps to the track and cannot
      // cross the other handle (setLow caps at value.max, setHigh at value.min).
      const next = editing === 'min' ? setLow(rounded, displayValue, min) : setHigh(rounded, displayValue, max);
      onChange(next);
    }
    // A no-op / NaN entry just cancels — nothing to commit.
    editing = null;
  };

  const lowText = $derived(displayValue.min.toFixed(decimals));
  const highText = $derived(displayValue.max.toFixed(decimals));

  // Both handles stay subtly visible at rest (opacity 0.35) and lift on hover/drag
  // — the two visible handles are what read as "a range". The active handle during
  // a drag is the most prominent.
  const REST_OPACITY = 0.35;
  const lowOpacity = $derived(
    !isActive ? REST_OPACITY : isDragging && dragTarget === 'min' ? 0.95 : 0.7
  );
  const highOpacity = $derived(
    !isActive ? REST_OPACITY : isDragging && dragTarget === 'max' ? 0.95 : 0.7
  );

  // Fill spans BETWEEN the handles: left at the low handle, width to the high one.
  const fillStyle = $derived(
    `left:${lowPercent.current}%;width:${Math.max(0, highPercent.current - lowPercent.current)}%;`
  );
  // Both handle lines depend on BOTH percents so they can splay around the range
  // midpoint: far apart they sit ~inside their fill edge (unchanged look); as they
  // approach, the shared helper's min/max keeps them distinct and never crossing.
  // The other ports fade handle opacity over 0.15s via JS motion; Svelte writes
  // opacity straight into the inline style, so add a local CSS transition here to
  // match. Kept inline (not in the shared .tweakers-range-slider-handle rule) so it
  // doesn't conflict with the JS-driven opacity animation in React/Solid/Vue.
  const lowHandleStyle = $derived(
    `left:${handleLeftStyles(lowPercent.current, highPercent.current).low};opacity:${lowOpacity};transform:translateY(-50%);transition:opacity 0.15s ease;`
  );
  const highHandleStyle = $derived(
    `left:${handleLeftStyles(lowPercent.current, highPercent.current).high};opacity:${highOpacity};transform:translateY(-50%);transition:opacity 0.15s ease;`
  );
</script>

<div bind:this={wrapperRef} class="tweakers-range-slider-wrapper">
  <div
    class={`tweakers-range-slider ${isActive ? 'tweakers-range-slider-active' : ''}`}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerCancel}
    ondblclick={handleDoubleClick}
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
  >
    <div class="tweakers-range-slider-fill" style={fillStyle}></div>

    <div class="tweakers-range-slider-handle" style={lowHandleStyle}></div>
    <div class="tweakers-range-slider-handle" style={highHandleStyle}></div>

    <span class="tweakers-range-slider-label">{label}</span>

    {#if editing !== null}
      <input
        bind:this={inputRef}
        type="text"
        class="tweakers-range-slider-input"
        value={inputValue}
        oninput={(e) => (inputValue = (e.currentTarget as HTMLInputElement).value)}
        onkeydown={(e) => {
          if (e.key === 'Enter') commitEditor();
          else if (e.key === 'Escape') (editing = null);
        }}
        onblur={commitEditor}
        onclick={(e) => e.stopPropagation()}
        onpointerdown={(e) => e.stopPropagation()}
      />
    {:else}
      <span class="tweakers-range-slider-value">
        <span
          class="tweakers-range-slider-bound"
          onclick={(e) => {
            e.stopPropagation();
            openEditor('min');
          }}
          onpointerdown={(e) => e.stopPropagation()}
          role="button"
          tabindex="-1"
        >
          {lowText}
        </span>
        <span class="tweakers-range-slider-dash">–</span>
        <span
          class="tweakers-range-slider-bound"
          onclick={(e) => {
            e.stopPropagation();
            openEditor('max');
          }}
          onpointerdown={(e) => e.stopPropagation()}
          role="button"
          tabindex="-1"
        >
          {highText}
        </span>
      </span>
    {/if}
  </div>
</div>
