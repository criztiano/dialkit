import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import {
  clampRange,
  setLow,
  setHigh,
  shiftSpan,
  nearestHandle,
  pickDragTarget,
  isOutsideSpan,
  handleLeftStyles,
  type RangeValue,
} from '../range-slider-core';
import { decimalsForStep, roundValue } from '../shortcut-utils';

export type { RangeValue };

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

export function RangeSlider({
  label,
  value: rawValue,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  defaultValue,
}: RangeSliderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Which bound the inline editor is currently editing (null = not editing).
  const [editing, setEditing] = useState<'min' | 'max' | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Click-vs-drag detection + stable geometry captured at pointer-down. Mirrors
  // Slider's approach so the two controls share the same rect/scale math.
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const isClickRef = useRef(true);
  const dragTargetRef = useRef<DragTarget | null>(null);
  // True only when a plain click may jump a handle: the press started on empty
  // track (outside the span). A press inside the span/grab-zone leaves this false
  // so the click stays a no-op and can't shrink the range the user set.
  const clickMovesRef = useRef(false);
  // Snapshot of the value at gesture start — span-drag shifts relative to this
  // so accumulated rounding can't make the span creep. Seeded from the raw prop;
  // overwritten on every pointer-down.
  const dragStartValueRef = useRef<RangeValue>(rawValue);
  const dragStartValueAtRef = useRef(0);
  // A settle/reset can animate BOTH springs (double-click resets both handles),
  // so track them separately and stop BOTH before a drag or a new animation.
  // Leaving the low reset spring untracked let it keep writing the motion value
  // after the tracked (high) one was stopped, shuddering the handle.
  const lowAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const highAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  // Stop every in-flight spring (click-move animates one, reset animates both).
  const stopAnims = useCallback(() => {
    lowAnimRef.current?.stop();
    highAnimRef.current?.stop();
    lowAnimRef.current = null;
    highAnimRef.current = null;
  }, []);
  const wrapperRectRef = useRef<DOMRect | null>(null);
  const scaleRef = useRef(1);

  // Normalize the incoming pair through the core when idle so an out-of-bounds
  // or reversed prop from the parent is clamped + ordered before we render it.
  // While interacting we're the source of truth (helpers already keep it valid),
  // so pass the live pair straight through to avoid a normalize/echo round-trip.
  const value = isInteracting ? rawValue : clampRange(rawValue, min, max);

  // Degenerate bounds (max === min) have no span to map onto: report 0% instead
  // of dividing by zero (which would feed NaN into the fill width and handles).
  const span = max - min;
  const lowPercent = span === 0 ? 0 : ((value.min - min) / span) * 100;
  const highPercent = span === 0 ? 0 : ((value.max - min) / span) * 100;
  const isActive = isInteracting || isHovered;

  // Motion values drive the fill + both handles imperatively during drag, so the
  // fill tracks the pointer without waiting for a React render (as in Slider).
  const lowMotion = useMotionValue(lowPercent);
  const highMotion = useMotionValue(highPercent);
  // Fill spans BETWEEN the handles: left at the low handle, width to the high one.
  const fillLeft = useTransform(lowMotion, (pct) => `${pct}%`);
  const fillWidth = useTransform<number, string>(
    [lowMotion, highMotion],
    ([lo, hi]) => `${Math.max(0, hi - lo)}%`
  );
  // Both handle lines depend on BOTH percents so they can splay around the range
  // midpoint: far apart they sit ~inside their fill edge (unchanged look); as they
  // approach, the shared helper's min/max keeps them distinct and never crossing.
  const lowHandleLeft = useTransform<number, string>([lowMotion, highMotion], ([lo, hi]) => handleLeftStyles(lo, hi).low);
  const highHandleLeft = useTransform<number, string>([lowMotion, highMotion], ([lo, hi]) => handleLeftStyles(lo, hi).high);

  // Sync from props when idle (skip while ANY spring settle is mid-flight so the
  // animation isn't yanked back to the pre-animation value — a reset drives both).
  useEffect(() => {
    if (!isInteracting && !lowAnimRef.current && !highAnimRef.current) {
      lowMotion.jump(lowPercent);
      highMotion.jump(highPercent);
    }
  }, [lowPercent, highPercent, isInteracting, lowMotion, highMotion]);

  // clientX -> value in bounds, using the rect/scale captured at pointer-down.
  // Identical scene-space math to Slider.positionToValue.
  const positionToValue = useCallback(
    (clientX: number) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value.min;
      const screenX = clientX - rect.left;
      const sceneX = screenX / scaleRef.current;
      const nativeWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : rect.width;
      const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
      const rawValue = min + percent * (max - min);
      return Math.max(min, Math.min(max, rawValue));
    },
    [min, max, value.min]
  );

  const percentFromValue = useCallback(
    (v: number) => (span === 0 ? 0 : ((v - min) / span) * 100),
    [min, span]
  );

  // Push both motion values from a range so the fill + handles update together.
  const syncMotion = useCallback(
    (next: RangeValue) => {
      lowMotion.jump(percentFromValue(next.min));
      highMotion.jump(percentFromValue(next.max));
    },
    [lowMotion, highMotion, percentFromValue]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (editing) return;
      e.preventDefault();
      // Capture on the track element itself (currentTarget), never e.target — a
      // press can land on a child (fill/handle/label/bound), and capturing there
      // detaches the drag when that child updates. Matches the other three ports.
      e.currentTarget.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      setIsInteracting(true);

      // Capture wrapper rect + scale once, like Slider, for a stable reference
      // across the whole gesture (page could scroll/zoom mid-drag otherwise).
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        const nativeWidth = wrapperRef.current.offsetWidth;
        scaleRef.current = wrapperRectRef.current.width / nativeWidth;
      }

      const atValue = positionToValue(e.clientX);
      // Give each handle an inward grab zone (HANDLE_HIT_PX, in value units) so a
      // handle parked at its bound is still grabbable. pickDragTarget prioritizes
      // a handle press over span-drag; nearestHandle breaks overlap ties by side.
      const trackW = wrapperRef.current?.offsetWidth ?? 1;
      const hitV = (HANDLE_HIT_PX / trackW) * (max - min);
      const target = pickDragTarget(atValue, value, hitV);
      dragTargetRef.current = target;
      // Only an empty-track press may jump a handle on a plain click; a press
      // inside the span (mid-span OR inside a grab zone) stays a no-op.
      clickMovesRef.current = target !== 'span' && isOutsideSpan(atValue, value);
      dragStartValueRef.current = value;
      dragStartValueAtRef.current = atValue;
    },
    [editing, positionToValue, value, min, max]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || !pointerDownPos.current) return;

      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (isClickRef.current && distance > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsDragging(true);
      }

      if (isClickRef.current) return;

      // Drag mode — instant update through the core helpers.
      const raw = roundValue(positionToValue(e.clientX), step);
      const target = dragTargetRef.current;
      let next: RangeValue;
      if (target === 'span') {
        // Shift relative to the gesture's start snapshot so width is preserved
        // exactly and rounding can't accumulate drift.
        const delta = raw - roundValue(dragStartValueAtRef.current, step);
        next = shiftSpan(delta, dragStartValueRef.current, min, max);
      } else if (target === 'min') {
        next = setLow(raw, value, min);
      } else {
        next = setHigh(raw, value, max);
      }

      stopAnims();
      syncMotion(next);
      onChange(next);
    },
    [isInteracting, positionToValue, step, min, max, value, syncMotion, onChange, stopAnims]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting) return;

      // A click INSIDE the selected span (mid-span OR inside a handle's grab zone)
      // is a no-op: it must not shrink the range the user set. Only a click that
      // STARTED on the empty track moves the nearest handle to the point, with the
      // same spring-settle Slider uses. clickMovesRef captures that at pointer-down.
      if (isClickRef.current && clickMovesRef.current) {
        const raw = roundValue(positionToValue(e.clientX), step);
        const which = dragTargetRef.current ?? nearestHandle(raw, value);
        const next = which === 'min' ? setLow(raw, value, min) : setHigh(raw, value, max);

        const motion = which === 'min' ? lowMotion : highMotion;
        const targetPct = percentFromValue(which === 'min' ? next.min : next.max);
        // Stop every spring (a prior reset may have both mid-flight) before the
        // single click-move settle; track it under the moved handle's ref so the
        // idle guard and the next drag both see it.
        stopAnims();
        const anim = animate(motion, targetPct, {
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            if (which === 'min') lowAnimRef.current = null;
            else highAnimRef.current = null;
          },
        });
        if (which === 'min') lowAnimRef.current = anim;
        else highAnimRef.current = anim;
        onChange(next);
      }

      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
      dragTargetRef.current = null;
    },
    [isInteracting, positionToValue, step, value, min, max, lowMotion, highMotion, percentFromValue, onChange, stopAnims]
  );

  // A cancelled gesture (OS/browser aborts the pointer) never fires pointer-up,
  // so without this the control wedges with isInteracting stuck true. Reset the
  // same gesture state as pointer-up, minus the click-commit — parity with the
  // Solid/Vue/Svelte cancel handlers.
  const handlePointerCancel = useCallback(() => {
    if (!isInteracting) return;
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos.current = null;
    dragTargetRef.current = null;
  }, [isInteracting]);

  // Double-click the track resets BOTH handles to the configured default (else the
  // full {min,max} span), spring-settling both to their target percent with the
  // same 300/25/0.8 spring as the click-move. Ignored mid-edit so a double-click on
  // a bound number opens/uses the editor instead. Bound spans stopPropagation, so a
  // double-click on a number never reaches here.
  const handleDoubleClick = useCallback(() => {
    if (editing !== null) return;
    const d = clampRange(defaultValue ?? { min, max }, min, max);
    stopAnims();
    // Track BOTH reset springs so an interrupting drag/click stops both — an
    // untracked low spring would keep writing the motion value and shudder.
    lowAnimRef.current = animate(lowMotion, percentFromValue(d.min), {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => { lowAnimRef.current = null; },
    });
    highAnimRef.current = animate(highMotion, percentFromValue(d.max), {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => { highAnimRef.current = null; },
    });
    onChange(d);
  }, [editing, defaultValue, min, max, lowMotion, highMotion, percentFromValue, onChange, stopAnims]);

  // Focus + select the inline input when it appears (matches Slider).
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const decimals = decimalsForStep(step);

  const openEditor = useCallback(
    (which: 'min' | 'max') => {
      setEditing(which);
      setInputValue((which === 'min' ? value.min : value.max).toFixed(decimals));
    },
    [value.min, value.max, decimals]
  );

  const commitEditor = useCallback(() => {
    if (!editing) return;
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const rounded = roundValue(parsed, step);
      // Commit through the core so the edited bound clamps to the track and
      // cannot cross the other handle (setLow caps at value.max, setHigh at value.min).
      const next = editing === 'min' ? setLow(rounded, value, min) : setHigh(rounded, value, max);
      onChange(next);
    }
    // A no-op / NaN entry just cancels — nothing to commit.
    setEditing(null);
  }, [editing, inputValue, step, value, min, max, onChange]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitEditor();
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  };

  const lowText = value.min.toFixed(decimals);
  const highText = value.max.toFixed(decimals);

  // Both handles stay subtly visible at rest (opacity 0.35) and lift on
  // hover/drag — the two visible handles are what read as "a range". The active
  // handle during a drag is the most prominent.
  const restOpacity = 0.35;
  const lowOpacity = !isActive
    ? restOpacity
    : isDragging && dragTargetRef.current === 'min'
      ? 0.95
      : 0.7;
  const highOpacity = !isActive
    ? restOpacity
    : isDragging && dragTargetRef.current === 'max'
      ? 0.95
      : 0.7;

  return (
    <div ref={wrapperRef} className="tweakers-range-slider-wrapper">
      <motion.div
        ref={trackRef}
        className={`tweakers-range-slider ${isActive ? 'tweakers-range-slider-active' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="tweakers-range-slider-fill"
          style={{ left: fillLeft, width: fillWidth }}
        />

        <motion.div
          className="tweakers-range-slider-handle"
          style={{ left: lowHandleLeft, y: '-50%' }}
          animate={{ opacity: lowOpacity }}
          transition={{ opacity: { duration: 0.15 } }}
        />
        <motion.div
          className="tweakers-range-slider-handle"
          style={{ left: highHandleLeft, y: '-50%' }}
          animate={{ opacity: highOpacity }}
          transition={{ opacity: { duration: 0.15 } }}
        />

        <span className="tweakers-range-slider-label">{label}</span>

        {editing !== null ? (
          <input
            ref={inputRef}
            type="text"
            className="tweakers-range-slider-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={commitEditor}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="tweakers-range-slider-value">
            <span
              className="tweakers-range-slider-bound"
              onClick={(e) => { e.stopPropagation(); openEditor('min'); }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {lowText}
            </span>
            <span className="tweakers-range-slider-dash">–</span>
            <span
              className="tweakers-range-slider-bound"
              onClick={(e) => { e.stopPropagation(); openEditor('max'); }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {highText}
            </span>
          </span>
        )}
      </motion.div>
    </div>
  );
}
