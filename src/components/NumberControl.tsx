import { useRef, useState, useCallback, useEffect } from 'react';
import { decimalsForStep, isWordUnit, roundValue } from '../numeric';
import { clampNumber, numberKeyValue, scrubNumber } from '../number';
import { useHints } from '../hooks/useHints';

interface NumberControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Optional: unlike a slider's, a number's bounds may be left open. */
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Replaces the shown value; `unit` is then not added. */
  formatValue?: (value: number) => string;
  /** `vertical` puts the label above a centred value. */
  orientation?: 'horizontal' | 'vertical';
  hint?: string;
}

const CLICK_THRESHOLD = 3;

/**
 * A number with no track. Drag anywhere on the row to scrub it, a step per
 * pixel (Shift ten, Alt a tenth); click it to type. ⌘ while pressing selects
 * the text instead.
 */
export function NumberControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  unit,
  formatValue,
  orientation = 'horizontal',
  hint,
}: NumberControlProps) {
  // A number with no value yet (a panel mid-rebuild) shows its lower bound or 0.
  if (typeof value !== 'number' || !Number.isFinite(value)) value = min ?? 0;
  useHints(!!hint);
  const isVertical = orientation === 'vertical';
  const rowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editingEnded = useRef(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const isClickRef = useRef(true);
  const scrubStart = useRef(0);
  const isPointerHeld = useRef(false);

  const decimals = decimalsForStep(step, min ?? 0, max ?? 0);

  const openInput = useCallback(() => {
    editingEnded.current = false;
    setInputValue(value.toFixed(decimals));
    setShowInput(true);
  }, [value, decimals]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (showInput || e.button !== 0 || e.metaKey) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    isClickRef.current = true;
    isPointerHeld.current = true;
    scrubStart.current = value;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerHeld.current || !pointerDownPos.current) return;
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    if (isClickRef.current && Math.sqrt(dx * dx + dy * dy) > CLICK_THRESHOLD) {
      isClickRef.current = false;
      setIsScrubbing(true);
    }
    if (isClickRef.current) return;
    // A row scrubs on X, right to raise; a column on Y, up to raise.
    const next = scrubNumber(scrubStart.current, isVertical ? -dy : dx, step, min, max, e.shiftKey ? 'shift' : e.altKey ? 'alt' : undefined);
    if (next !== value) onChange(next);
  };

  const endGesture = () => {
    isPointerHeld.current = false;
    pointerDownPos.current = null;
    setIsScrubbing(false);
  };

  const handlePointerUp = () => {
    if (!isPointerHeld.current) return;
    if (isClickRef.current) openInput();
    endGesture();
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);

  const handleInputSubmit = () => {
    if (editingEnded.current) return;
    editingEnded.current = true;
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) onChange(roundValue(clampNumber(parsed, min, max), step, min, max));
    setShowInput(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key !== 'Enter' && e.key !== 'Escape') return;
    e.preventDefault();
    if (e.key === 'Enter') handleInputSubmit();
    else {
      editingEnded.current = true;
      setShowInput(false);
    }
    queueMicrotask(() => rowRef.current?.focus({ preventScroll: true }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      openInput();
      return;
    }
    const next = numberKeyValue(e.key, value, step, min, max, e.shiftKey);
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    onChange(next);
  };

  const displayValue = formatValue ? formatValue(value) : value.toFixed(decimals);
  const shownUnit = formatValue ? undefined : unit;

  return (
    <div className={`dialkit-slider-wrapper dialkit-number-wrapper${isVertical ? ' dialkit-number-vertical' : ''}`} data-hint={hint}>
      <div
        ref={rowRef}
        className="dialkit-slider dialkit-number"
        role="spinbutton"
        tabIndex={showInput ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${displayValue}${shownUnit ? ` ${shownUnit}` : ''}`}
        data-scrubbing={isScrubbing || undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={endGesture}
        onLostPointerCapture={endGesture}
      >
        <span className="dialkit-slider-label">{label}</span>
        {showInput ? (
          <input
            ref={inputRef}
            type="text"
            className="dialkit-slider-input"
            aria-label={`${label} value`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputSubmit}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="dialkit-slider-value">
            {displayValue}
            {shownUnit && (
              <span className="dialkit-slider-unit" data-spaced={isWordUnit(shownUnit) || undefined}>{shownUnit}</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
