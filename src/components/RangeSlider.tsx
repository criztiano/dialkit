import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { decimalsForStep, roundValue } from '../numeric';
import { sliderKeyValue } from '../control-keyboard';
import {
  clampRange, setLow, setHigh, shiftSpan, nearestHandle, pickDragTarget, isOutsideSpan,
  fineDragValue, rangeHandleLefts, type RangeValue,
} from '../range';
import { useHints } from '../hooks/useHints';

interface RangeSliderProps {
  label: string;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  /** Start of the track. */
  min?: number;
  /** End of the track. */
  max?: number;
  step?: number;
  /** What a double-click on the track restores. Defaults to the full track. */
  defaultValue?: RangeValue;
  hint?: string;
}

const CLICK_THRESHOLD = 3;
// A handle can be grabbed this far (px) inside the span, so a handle at the
// track's edge, with no empty track beyond it, can still be grabbed.
const HANDLE_HIT_PX = 12;
const SNAP_SPRING = { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 } as const;

type DragTarget = 'min' | 'max' | 'span';

/**
 * Two handles on one track. Drag a handle to move one end, drag inside the
 * span to move both, or click the empty track to bring the nearer end there.
 * Shift while dragging moves at a tenth of the speed. A click on either
 * number types it, and a double-click on the track restores the default.
 */
export function RangeSlider({
  label,
  value: rawValue,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  defaultValue,
  hint,
}: RangeSliderProps) {
  useHints(!!hint);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editingEnded = useRef(false);
  const handleRefs = { min: useRef<HTMLDivElement>(null), max: useRef<HTMLDivElement>(null) };
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const valueSpanRef = useRef<HTMLSpanElement>(null);
  const [editing, setEditing] = useState<'min' | 'max' | null>(null);
  const [inputValue, setInputValue] = useState('');

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const isClickRef = useRef(true);
  const dragTargetRef = useRef<DragTarget | null>(null);
  // Only a press on the empty track may move a handle on a plain click.
  const clickMovesRef = useRef(false);
  // The value and pointer at the gesture's start: a span drag moves from
  // them, so rounding cannot make the span creep.
  const dragStartRef = useRef<{ value: RangeValue; at: number }>({ value: rawValue, at: 0 });
  // Shift mid-drag: travel counts at 0.1× from where Shift went down, and
  // releasing it starts again at 1× from there, so no handle jumps.
  const fineRef = useRef<{ shift: boolean; range: RangeValue; x: number } | null>(null);
  const dragValueRef = useRef<RangeValue>(rawValue);
  const lowAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const highAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const wrapperRectRef = useRef<DOMRect | null>(null);
  const scaleRef = useRef(1);

  const stopAnims = useCallback(() => {
    lowAnimRef.current?.stop();
    highAnimRef.current?.stop();
    lowAnimRef.current = null;
    highAnimRef.current = null;
  }, []);

  // While a panel rebuilds, its controls and values can disagree for one
  // render: a range with no value shows the full track.
  const safe = rawValue && Number.isFinite(rawValue.min) && Number.isFinite(rawValue.max) ? rawValue : { min, max };
  const value = isInteracting ? safe : clampRange(safe, min, max);

  const span = max - min;
  const percentFromValue = useCallback((v: number) => (span === 0 ? 0 : ((v - min) / span) * 100), [min, span]);
  const lowPercent = percentFromValue(value.min);
  const highPercent = percentFromValue(value.max);
  const isActive = isInteracting || isHovered || isFocused;

  const lowMotion = useMotionValue(lowPercent);
  const highMotion = useMotionValue(highPercent);
  const fillLeft = useTransform(lowMotion, (pct) => `${pct}%`);
  const fillWidth = useTransform<number, string>([lowMotion, highMotion], ([lo, hi]) => `${Math.max(0, hi - lo)}%`);
  const lowHandleLeft = useTransform<number, string>([lowMotion, highMotion], ([lo, hi]) => rangeHandleLefts(lo, hi).low);
  const highHandleLeft = useTransform<number, string>([lowMotion, highMotion], ([lo, hi]) => rangeHandleLefts(lo, hi).high);

  // Follow outside changes while idle, unless a spring is still settling.
  useEffect(() => {
    if (!isInteracting && !lowAnimRef.current && !highAnimRef.current) {
      lowMotion.jump(lowPercent);
      highMotion.jump(highPercent);
    }
  }, [lowPercent, highPercent, isInteracting, lowMotion, highMotion]);

  useEffect(() => stopAnims, [stopAnims]);

  const positionToValue = useCallback(
    (clientX: number) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value.min;
      const sceneX = (clientX - rect.left) / scaleRef.current;
      const nativeWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : rect.width;
      const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
      return min + percent * (max - min);
    },
    [min, max, value.min]
  );

  const syncMotion = useCallback((next: RangeValue) => {
    lowMotion.jump(percentFromValue(next.min));
    highMotion.jump(percentFromValue(next.max));
  }, [lowMotion, highMotion, percentFromValue]);

  const settle = useCallback((which: 'min' | 'max', pct: number) => {
    const motionValue = which === 'min' ? lowMotion : highMotion;
    const ref = which === 'min' ? lowAnimRef : highAnimRef;
    ref.current = animate(motionValue, pct, { ...SNAP_SPRING, onComplete: () => { ref.current = null; } });
  }, [lowMotion, highMotion]);

  const round = useCallback((v: number) => roundValue(v, step, min, max), [step, min, max]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (editing || e.button !== 0) return;
      e.preventDefault();
      // Capture on the track, not the child pressed: a child that redraws would drop the drag.
      e.currentTarget.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      setIsInteracting(true);
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        scaleRef.current = wrapperRectRef.current.width / wrapperRef.current.offsetWidth;
      }
      const at = positionToValue(e.clientX);
      const width = wrapperRef.current?.offsetWidth || 1;
      const target = pickDragTarget(at, value, (HANDLE_HIT_PX / width) * (max - min));
      dragTargetRef.current = target;
      clickMovesRef.current = target !== 'span' && isOutsideSpan(at, value);
      dragStartRef.current = { value, at };
      fineRef.current = null;
      dragValueRef.current = value;
    },
    [editing, positionToValue, value, min, max]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || !pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      if (isClickRef.current && Math.sqrt(dx * dx + dy * dy) > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsDragging(true);
      }
      if (isClickRef.current) return;

      if (e.shiftKey ? !fineRef.current?.shift : fineRef.current?.shift) {
        fineRef.current = { shift: e.shiftKey, range: dragValueRef.current, x: e.clientX };
      }
      const target = dragTargetRef.current;
      let next: RangeValue;
      if (fineRef.current) {
        const fine = fineRef.current;
        const width = wrapperRef.current?.offsetWidth ?? 1;
        const at = (start: number) => round(fineDragValue(start, fine.x, e.clientX, width, min, max, fine.shift ? 0.1 : 1));
        next = target === 'span' ? shiftSpan(at(fine.range.min) - fine.range.min, fine.range, min, max)
          : target === 'min' ? setLow(at(fine.range.min), value, min)
          : setHigh(at(fine.range.max), value, max);
      } else {
        const raw = round(positionToValue(e.clientX));
        const start = dragStartRef.current;
        next = target === 'span' ? shiftSpan(raw - round(start.at), start.value, min, max)
          : target === 'min' ? setLow(raw, value, min)
          : setHigh(raw, value, max);
      }
      stopAnims();
      syncMotion(next);
      dragValueRef.current = next;
      onChange(next);
    },
    [isInteracting, positionToValue, round, min, max, value, syncMotion, onChange, stopAnims]
  );

  const endGesture = () => {
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos.current = null;
    dragTargetRef.current = null;
    fineRef.current = null;
  };

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting) return;
      // A click inside the span changes nothing, so it cannot shrink the range.
      if (isClickRef.current && clickMovesRef.current) {
        const raw = round(positionToValue(e.clientX));
        const which = dragTargetRef.current === 'span' || !dragTargetRef.current ? nearestHandle(raw, value) : dragTargetRef.current;
        const next = which === 'min' ? setLow(raw, value, min) : setHigh(raw, value, max);
        stopAnims();
        settle(which, percentFromValue(which === 'min' ? next.min : next.max));
        onChange(next);
      }
      endGesture();
    },
    [isInteracting, positionToValue, round, value, min, max, percentFromValue, onChange, stopAnims, settle]
  );

  const handlePointerCancel = () => {
    if (!pointerDownPos.current) return;
    endGesture();
  };

  const handleDoubleClick = () => {
    if (editing) return;
    const next = clampRange(defaultValue ?? { min, max }, min, max);
    stopAnims();
    settle('min', percentFromValue(next.min));
    settle('max', percentFromValue(next.max));
    onChange(next);
  };

  const decimals = decimalsForStep(step, min, max);

  const openEditor = (which: 'min' | 'max') => {
    editingEnded.current = false;
    setEditing(which);
    setInputValue(value[which].toFixed(decimals));
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitEditor = () => {
    if (editingEnded.current || !editing) return;
    editingEnded.current = true;
    const parsed = parseFloat(inputValue);
    // The typed end stops at the track and at the other handle.
    if (!isNaN(parsed)) onChange(editing === 'min' ? setLow(round(parsed), value, min) : setHigh(round(parsed), value, max));
    setEditing(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key !== 'Enter' && e.key !== 'Escape') return;
    e.preventDefault();
    const which = editing;
    if (e.key === 'Enter') commitEditor();
    else {
      editingEnded.current = true;
      setEditing(null);
    }
    if (which) queueMicrotask(() => handleRefs[which].current?.focus({ preventScroll: true }));
  };

  // Each handle is a slider of its own for the keyboard: arrows move it,
  // Shift by ten steps, and Enter types it.
  const handleKeyDown = (which: 'min' | 'max') => (e: React.KeyboardEvent) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      openEditor(which);
      return;
    }
    const lo = which === 'min' ? min : value.min;
    const hi = which === 'min' ? value.max : max;
    const next = sliderKeyValue(e.key, value[which], lo, hi, step, e.shiftKey);
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    const nextRange = which === 'min' ? setLow(next, value, min) : setHigh(next, value, max);
    stopAnims();
    syncMotion(nextRange);
    onChange(nextRange);
  };

  // A handle over the label or the numbers fades, as the slider's does.
  const HANDLE_BUFFER = 8;
  let leftThreshold = 30;
  let rightThreshold = 70;
  const trackWidth = wrapperRef.current?.offsetWidth;
  if (trackWidth) {
    if (labelRef.current) leftThreshold = ((10 + labelRef.current.offsetWidth + HANDLE_BUFFER) / trackWidth) * 100;
    if (valueSpanRef.current) rightThreshold = ((trackWidth - 12 - valueSpanRef.current.offsetWidth - HANDLE_BUFFER) / trackWidth) * 100;
  }
  const dodges = (pct: number) => pct < leftThreshold || pct > rightThreshold;
  const handleOpacity = (which: 'min' | 'max') => !isActive ? 0
    : dodges(which === 'min' ? lowPercent : highPercent) ? 0.1
    : isDragging && (dragTargetRef.current === which || dragTargetRef.current === 'span') ? 0.9 : 0.5;

  const discreteSteps = span / step;
  const hashMarks = discreteSteps <= 10
    ? Array.from({ length: Math.max(0, Math.round(discreteSteps) - 1) }, (_, i) => ((i + 1) * step) / span * 100)
    : Array.from({ length: 9 }, (_, i) => (i + 1) * 10);

  const renderHandle = (which: 'min' | 'max', left: typeof lowHandleLeft) => (
    <motion.div
      ref={handleRefs[which]}
      className="dialkit-slider-handle dialkit-range-handle"
      role="slider"
      tabIndex={editing ? -1 : 0}
      aria-label={`${label} ${which === 'min' ? 'start' : 'end'}`}
      aria-valuemin={which === 'min' ? min : value.min}
      aria-valuemax={which === 'min' ? value.max : max}
      aria-valuenow={value[which]}
      onKeyDown={handleKeyDown(which)}
      style={{ left, y: '-50%' }}
      animate={{ opacity: handleOpacity(which), scaleX: isActive ? 1 : 0.25 }}
      transition={{ scaleX: { type: 'spring', visualDuration: 0.25, bounce: 0.15 }, opacity: { duration: 0.15 } }}
    />
  );

  return (
    <div ref={wrapperRef} className="dialkit-slider-wrapper" data-hint={hint}>
      <motion.div
        className={`dialkit-slider dialkit-range ${isActive ? 'dialkit-slider-active' : ''}`}
        role="group"
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerCancel}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={(e) => setIsFocused(e.target.classList.contains('dialkit-range-handle'))}
        onBlur={() => setIsFocused(false)}
      >
        <div className="dialkit-slider-hashmarks">
          {hashMarks.map((pct) => <div key={pct} className="dialkit-slider-hashmark" style={{ left: `${pct}%` }} />)}
        </div>
        <motion.div className="dialkit-slider-fill" style={{ left: fillLeft, width: fillWidth }} />
        {renderHandle('min', lowHandleLeft)}
        {renderHandle('max', highHandleLeft)}

        <span ref={labelRef} className="dialkit-slider-label">{label}</span>

        {editing ? (
          <input
            ref={inputRef}
            type="text"
            className="dialkit-slider-input"
            aria-label={`${label} ${editing === 'min' ? 'start' : 'end'} value`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={commitEditor}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span ref={valueSpanRef} className="dialkit-slider-value dialkit-range-value">
            {(['min', 'max'] as const).map((which, i) => (
              <span key={which} className="dialkit-range-bound-group">
                {i === 1 && <span className="dialkit-range-dash">–</span>}
                <span
                  className="dialkit-range-bound"
                  onClick={(e) => { e.stopPropagation(); openEditor(which); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  {value[which].toFixed(decimals)}
                </span>
              </span>
            ))}
          </span>
        )}
      </motion.div>
    </div>
  );
}
