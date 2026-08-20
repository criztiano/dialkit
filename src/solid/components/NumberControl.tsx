import { createSignal, createEffect } from 'solid-js';
import { decimalsForStep, roundValue } from '../../shortcut-utils';

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
export function NumberControl(props: NumberControlProps) {
  const step = () => props.step ?? 0.01;
  const isVertical = () => props.orientation === 'vertical';

  let inputRef!: HTMLInputElement;

  const [isScrubbing, setIsScrubbing] = createSignal(false);
  const [showInput, setShowInput] = createSignal(false);
  const [inputValue, setInputValue] = createSignal('');

  let pointerDownPos: { x: number; y: number } | null = null;
  let isClickFlag = true;
  let scrubStartValue = 0;
  let isPointerHeld = false;

  const clamp = (v: number) => {
    let out = v;
    if (props.min != null) out = Math.max(props.min, out);
    if (props.max != null) out = Math.min(props.max, out);
    return out;
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (showInput()) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointerDownPos = { x: e.clientX, y: e.clientY };
    isClickFlag = true;
    isPointerHeld = true;
    scrubStartValue = props.value;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isPointerHeld || !pointerDownPos) return;

    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (isClickFlag && distance > CLICK_THRESHOLD) {
      isClickFlag = false;
      setIsScrubbing(true);
    }

    if (!isClickFlag) {
      // Horizontal card scrubs on X (right = up); vertical card on Y (up = up).
      const travel = isVertical() ? -dy : dx;
      const perPixel = step() * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);
      const next = clamp(scrubStartValue + travel * perPixel);
      props.onChange(roundValue(next, step()));
    }
  };

  const handlePointerUp = () => {
    if (!isPointerHeld) return;
    if (isClickFlag) {
      setShowInput(true);
      setInputValue(props.value.toFixed(decimalsForStep(step())));
    }
    isPointerHeld = false;
    pointerDownPos = null;
    setIsScrubbing(false);
  };

  // Focus input when it appears
  createEffect(() => {
    if (showInput() && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });

  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue());
    if (!isNaN(parsed)) {
      props.onChange(roundValue(clamp(parsed), step()));
    }
    setShowInput(false);
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setShowInput(false);
    }
  };

  const displayValue = () =>
    props.formatValue
      ? props.formatValue(props.value)
      : props.value.toFixed(decimalsForStep(step()));

  const className = () =>
    [
      'dialkit-number-control',
      isVertical() ? 'dialkit-number-control-vertical' : '',
      isScrubbing() ? 'dialkit-number-control-engaged' : '',
    ]
      .filter(Boolean)
      .join(' ');

  return (
    <div
      class={className()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <span class="dialkit-number-label">{props.label}</span>
      {showInput() ? (
        <input
          ref={inputRef}
          type="text"
          class="dialkit-number-input"
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputSubmit}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span class="dialkit-number-value">
          {displayValue()}
          {props.unit && <span class="dialkit-number-unit">{props.unit}</span>}
        </span>
      )}
    </div>
  );
}
