import { useRef, useState, useCallback, useEffect } from 'react';
import { decimalsForStep, roundValue } from '../shortcut-utils';

interface NumberControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Override the displayed value text; `unit` is not auto-appended. */
  formatValue?: (value: number) => string;
  /** `vertical` stacks the label above a centered value (column card). */
  orientation?: 'horizontal' | 'vertical';
}

const CLICK_THRESHOLD = 3;

/**
 * Numeric readout card. Drag anywhere on the card to scrub the value
 * (Shift = ×10, Alt = ×0.1); a plain click opens inline text entry.
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
}: NumberControlProps) {
  const isVertical = orientation === 'vertical';
  const inputRef = useRef<HTMLInputElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const isClickRef = useRef(true);
  const scrubStartValue = useRef(0);
  const isPointerHeld = useRef(false);

  const clamp = useCallback(
    (v: number) => {
      let out = v;
      if (min != null) out = Math.max(min, out);
      if (max != null) out = Math.min(max, out);
      return out;
    },
    [min, max]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (showInput) return;
      // ⌘ hands the card over to the text: skipping preventDefault lets the
      // browser select the label or value instead of scrubbing.
      if (e.metaKey) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      isPointerHeld.current = true;
      scrubStartValue.current = value;
    },
    [showInput, value]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerHeld.current || !pointerDownPos.current) return;

      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (isClickRef.current && distance > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsScrubbing(true);
      }

      if (!isClickRef.current) {
        // Horizontal card scrubs on X (right = up); vertical card on Y (up = up).
        const travel = isVertical ? -dy : dx;
        const perPixel = step * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);
        const next = clamp(scrubStartValue.current + travel * perPixel);
        onChange(roundValue(next, step));
      }
    },
    [isVertical, step, clamp, onChange]
  );

  const handlePointerUp = useCallback(() => {
    if (!isPointerHeld.current) return;
    if (isClickRef.current) {
      setShowInput(true);
      setInputValue(value.toFixed(decimalsForStep(step)));
    }
    isPointerHeld.current = false;
    pointerDownPos.current = null;
    setIsScrubbing(false);
  }, [value, step]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);

  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onChange(roundValue(clamp(parsed), step));
    }
    setShowInput(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setShowInput(false);
    }
  };

  const displayValue = formatValue
    ? formatValue(value)
    : value.toFixed(decimalsForStep(step));

  const className = [
    'dialkit-number-control',
    isVertical ? 'dialkit-number-control-vertical' : '',
    isScrubbing ? 'dialkit-number-control-engaged' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <span className="dialkit-number-label">{label}</span>
      {showInput ? (
        <input
          ref={inputRef}
          type="text"
          className="dialkit-number-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputSubmit}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="dialkit-number-value">
          {displayValue}
          {unit && <span className="dialkit-number-unit">{unit}</span>}
        </span>
      )}
    </div>
  );
}
