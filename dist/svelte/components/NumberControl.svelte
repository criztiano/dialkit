<script lang="ts">
  import { tick } from 'svelte';
  import { decimalsForStep, roundValue } from '../../shortcut-utils';

  /**
   * Numeric readout card. Drag anywhere on the card to scrub the value
   * (Shift = ×10, Alt = ×0.1); a plain click opens inline text entry.
   */
  let {
    label,
    value,
    onChange,
    min = undefined,
    max = undefined,
    step = 0.01,
    unit = undefined,
    formatValue = undefined,
    orientation = 'horizontal',
  } = $props<{
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
  }>();

  const CLICK_THRESHOLD = 3;

  const isVertical = $derived(orientation === 'vertical');

  let inputRef: HTMLInputElement | undefined;
  let isScrubbing = $state(false);
  let showInput = $state(false);
  let inputValue = $state('');

  let pointerDownPos: { x: number; y: number } | null = null;
  let isClickFlag = true;
  let scrubStartValue = 0;
  let isPointerHeld = false;

  const clamp = (v: number) => {
    let out = v;
    if (min != null) out = Math.max(min, out);
    if (max != null) out = Math.min(max, out);
    return out;
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (showInput) return;
    // ⌘ hands the card over to the text: skipping preventDefault lets the
    // browser select the label or value instead of scrubbing.
    if (e.metaKey) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerDownPos = { x: e.clientX, y: e.clientY };
    isClickFlag = true;
    isPointerHeld = true;
    scrubStartValue = value;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isPointerHeld || !pointerDownPos) return;

    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (isClickFlag && distance > CLICK_THRESHOLD) {
      isClickFlag = false;
      isScrubbing = true;
    }

    if (!isClickFlag) {
      // Horizontal card scrubs on X (right = up); vertical card on Y (up = up).
      const travel = isVertical ? -dy : dx;
      const perPixel = step * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);
      const next = clamp(scrubStartValue + travel * perPixel);
      onChange(roundValue(next, step));
    }
  };

  const handlePointerUp = () => {
    if (!isPointerHeld) return;
    if (isClickFlag) {
      showInput = true;
      inputValue = value.toFixed(decimalsForStep(step));
    }
    isPointerHeld = false;
    pointerDownPos = null;
    isScrubbing = false;
  };

  $effect(() => {
    if (showInput) {
      tick().then(() => {
        inputRef?.focus();
        inputRef?.select();
      });
    }
  });

  const handleInputSubmit = () => {
    const parsed = Number.parseFloat(inputValue);
    if (!Number.isNaN(parsed)) {
      onChange(roundValue(clamp(parsed), step));
    }
    showInput = false;
  };

  const handleInputKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleInputSubmit();
    else if (e.key === 'Escape') showInput = false;
  };

  const displayValue = $derived(
    formatValue ? formatValue(value) : value.toFixed(decimalsForStep(step))
  );

  const className = $derived(
    [
      'tweakers-number-control',
      isVertical ? 'tweakers-number-control-vertical' : '',
      isScrubbing ? 'tweakers-number-control-engaged' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );
</script>

<div
  class={className}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
>
  <span class="tweakers-number-label">{label}</span>
  {#if showInput}
    <input
      bind:this={inputRef}
      type="text"
      class="tweakers-number-input"
      value={inputValue}
      oninput={(e) => (inputValue = (e.currentTarget as HTMLInputElement).value)}
      onkeydown={handleInputKeydown}
      onblur={handleInputSubmit}
      onclick={(e) => e.stopPropagation()}
      onpointerdown={(e) => e.stopPropagation()}
    />
  {:else}
    <span class="tweakers-number-value">
      {displayValue}{#if unit}<span class="tweakers-number-unit">{unit}</span>{/if}
    </span>
  {/if}
</div>
