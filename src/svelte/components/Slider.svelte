<script lang="ts">
  import { tick } from 'svelte';
  import { Spring } from 'svelte/motion';
  import type { Snippet } from 'svelte';
  import type { ShortcutConfig } from 'tweakers/store';
  import { decimalsForStep, roundValue, snapToDecile, formatSliderShortcut } from '../../shortcut-utils';

  let {
    label,
    value,
    onChange,
    min = 0,
    max = 1,
    step = 0.01,
    unit = undefined,
    formatValue = undefined,
    valueIcon = undefined,
    origin = undefined,
    bipolar = false,
    orientation = 'horizontal',
    shortcut,
    shortcutActive = false,
  } = $props<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    /**
     * Override the displayed value text. When provided, the formatter owns the
     * full label and `unit` is not auto-appended. Inline editing still operates
     * on the raw numeric value.
     */
    formatValue?: (value: number) => string;
    /**
     * Render a custom snippet (e.g. an icon or gauge) in the value slot instead
     * of the editable numeric text. Sliders with a `valueIcon` are not editable.
     */
    valueIcon?: Snippet;
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min`.
     */
    origin?: number;
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar?: boolean;
    /**
     * `vertical` renders the 77px column card: fill grows bottom-up, label sits
     * at the base, and the value readout appears over the fill on hover/drag.
     * Vertical sliders flex to their container width — place them in a flex row.
     */
    orientation?: 'horizontal' | 'vertical';
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
  }>();

  const CLICK_THRESHOLD = 3;
  const DEAD_ZONE = 32;
  const MAX_CURSOR_RANGE = 200;
  const MAX_STRETCH = 8;
  /** Half-width of the origin snap zone, in pixels of track travel. */
  const DETENT_PX = 6;
  const isVertical = $derived(orientation === 'vertical');
  const resolvedOrigin = $derived(
    Math.min(max, Math.max(min, origin ?? (bipolar ? 0 : min)))
  );
  const hasOrigin = $derived(resolvedOrigin > min);
  const originPercent = $derived(((resolvedOrigin - min) / (max - min)) * 100);

  let wrapperRef = $state<HTMLDivElement | undefined>(undefined);
  let inputRef: HTMLInputElement | undefined;

  let isInteracting = $state(false);
  let isDragging = $state(false);
  let isHovered = $state(false);
  let isValueHovered = $state(false);
  let isMetaHeld = $state(false);
  let isValueEditable = $state(false);
  let showInput = $state(false);
  let inputValue = $state('');

  const fillPercent = new Spring(((value - min) / (max - min)) * 100, { stiffness: 0.25, damping: 0.7 });
  const rubberStretchPx = new Spring(0, { stiffness: 0.2, damping: 0.65 });

  let pointerDownPos: { x: number; y: number } | null = null;
  let isClickFlag = true;
  let wrapperRect: DOMRect | null = null;
  let scaleVal = 1;
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  /** Running value for wheel notches, which arrive faster than a re-render. */
  let wheelValue = value;

  const percentFromValue = (nextValue: number) => ((nextValue - min) / (max - min)) * 100;

  const trackExtent = () => {
    if (!wrapperRef) return 0;
    return isVertical ? wrapperRef.offsetHeight : wrapperRef.offsetWidth;
  };

  // Escapable magnetic snap to the origin while dragging.
  const applyDetent = (v: number) => {
    if (!hasOrigin) return v;
    const extent = trackExtent();
    if (extent <= 0) return v;
    const detentValue = (DETENT_PX / extent) * (max - min);
    return Math.abs(v - resolvedOrigin) <= detentValue ? resolvedOrigin : v;
  };

  const positionToValue = (clientX: number, clientY: number) => {
    if (!wrapperRect) return value;
    const screenPos = isVertical ? clientY - wrapperRect.top : clientX - wrapperRect.left;
    const scenePos = screenPos / scaleVal;
    const nativeExtent = trackExtent() || (isVertical ? wrapperRect.height : wrapperRect.width);
    let percent = Math.max(0, Math.min(1, scenePos / nativeExtent));
    // Vertical: top of the card is max, bottom is min.
    if (isVertical) percent = 1 - percent;
    const rawValue = min + percent * (max - min);
    return Math.max(min, Math.min(max, rawValue));
  };

  const computeRubberStretch = (clientPos: number, sign: number) => {
    if (!wrapperRect) return 0;
    const nearEdge = isVertical ? wrapperRect.top : wrapperRect.left;
    const farEdge = isVertical ? wrapperRect.bottom : wrapperRect.right;
    const distancePast = sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
    const overflow = Math.max(0, distancePast - DEAD_ZONE);
    return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
  };

  $effect(() => {
    // Also re-seeds the wheel's running value: a burst runs ahead of the prop,
    // but every other move of the slider has to reset it.
    wheelValue = value;
    if (!isInteracting) {
      fillPercent.set(((value - min) / (max - min)) * 100, { instant: true });
    }
  });

  // Wheel over the card adjusts the value — the pointer is already on the
  // control, so the scroll belongs to it, not to the page behind it. Bound
  // natively because only a non-passive listener can preventDefault;
  // stopPropagation keeps the window-level scroll shortcuts from firing twice.
  $effect(() => {
    const el = wrapperRef;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (showInput) return;
      e.preventDefault();
      e.stopPropagation();

      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (raw === 0) return;

      const stepMultiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const delta = (raw > 0 ? 1 : -1) * step * stepMultiplier;
      // A trackpad fires several wheel events per frame, all before the new
      // value comes back — so each notch reads the running value, not the stale prop.
      const next = roundValue(Math.max(min, Math.min(max, wheelValue + delta)), step);
      wheelValue = next;

      fillPercent.set(percentFromValue(next), { instant: true });
      onChange(next);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });

  // ⌘ turns the card into text for as long as it is held. Only listened for
  // while hovered, so an idle panel adds no key handlers.
  $effect(() => {
    if (!isHovered) {
      isMetaHeld = false;
      return;
    }

    const sync = (e: KeyboardEvent) => (isMetaHeld = e.metaKey);
    const clear = () => (isMetaHeld = false);

    window.addEventListener('keydown', sync);
    window.addEventListener('keyup', sync);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', sync);
      window.removeEventListener('keyup', sync);
      window.removeEventListener('blur', clear);
    };
  });

  $effect(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }

    if (isValueHovered && !showInput && !isValueEditable) {
      hoverTimeout = setTimeout(() => {
        isValueEditable = true;
      }, 800);
    } else if (!isValueHovered && !showInput) {
      isValueEditable = false;
    }

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    };
  });

  $effect(() => {
    if (showInput) {
      tick().then(() => {
        inputRef?.focus();
        inputRef?.select();
      });
    }
  });

  const isActive = $derived(isInteracting || isHovered);

  const discreteSteps = $derived((max - min) / step);

  // The ≤ 10 threshold separates discrete sliders
  // (like step=2 on a 0–10 range → 5 steps) from continuous ones.
  const hashMarks = $derived.by(() => {
    if (discreteSteps <= 10) {
      return Array.from({ length: Math.max(discreteSteps - 1, 0) }, (_, i) => ({
        key: `d-${i + 1}`,
        left: (((i + 1) * step) / (max - min)) * 100,
      }));
    }

    return Array.from({ length: 9 }, (_, i) => ({
      key: `t-${i + 1}`,
      left: (i + 1) * 10,
    }));
  });

  const handlePointerDown = (e: PointerEvent) => {
    if (showInput) return;
    // ⌘ hands the card over to the text: no drag, no preventDefault, so the
    // browser's own selection starts and a click reaches the value span.
    if (e.metaKey) return;
    e.preventDefault();

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerDownPos = { x: e.clientX, y: e.clientY };
    isClickFlag = true;
    isInteracting = true;

    // Capture wrapper rect at pointer down for stable reference
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      const nativeExtent = trackExtent();
      const rectExtent = isVertical ? wrapperRect.height : wrapperRect.width;
      scaleVal = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
    }
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

    if (!isClickFlag) {
      if (wrapperRect) {
        const clientPos = isVertical ? e.clientY : e.clientX;
        const nearEdge = isVertical ? wrapperRect.top : wrapperRect.left;
        const farEdge = isVertical ? wrapperRect.bottom : wrapperRect.right;
        if (clientPos < nearEdge) {
          rubberStretchPx.set(computeRubberStretch(clientPos, -1), { instant: true });
        } else if (clientPos > farEdge) {
          rubberStretchPx.set(computeRubberStretch(clientPos, 1), { instant: true });
        } else {
          rubberStretchPx.set(0, { instant: true });
        }
      }

      const newValue = applyDetent(positionToValue(e.clientX, e.clientY));
      fillPercent.set(percentFromValue(newValue), { instant: true });
      onChange(roundValue(newValue, step));
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isInteracting) return;

    if (isClickFlag) {
      // When steps are coarse (≤10 positions), click snaps to the nearest step.
      // Otherwise, the original decile-magnetic behavior is preserved
      const rawValue = positionToValue(e.clientX, e.clientY);
      const steps = (max - min) / step;
      const snappedValue = steps <= 10
        ? Math.max(min, Math.min(max, min + Math.round((rawValue - min) / step) * step))
        : snapToDecile(rawValue, min, max);

      fillPercent.set(percentFromValue(snappedValue));
      onChange(roundValue(snappedValue, step));
    }

    if (rubberStretchPx.current !== 0) {
      rubberStretchPx.set(0);
    }

    isInteracting = false;
    isDragging = false;
    pointerDownPos = null;
  };

  const handlePointerCancel = () => {
    if (!isInteracting) return;
    isInteracting = false;
    isDragging = false;
    rubberStretchPx.set(0, { instant: true });
    pointerDownPos = null;
  };

  const handleInputSubmit = () => {
    const parsed = Number.parseFloat(inputValue);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(roundValue(clamped, step));
    }

    showInput = false;
    isValueHovered = false;
    isValueEditable = false;
  };

  const handleValueClick = (e: MouseEvent) => {
    if (!isValueEditable && !e.metaKey) return;
    e.stopPropagation();
    e.preventDefault();
    showInput = true;
    inputValue = value.toFixed(decimalsForStep(step));
  };

  const handleInputKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleInputSubmit();
    else if (e.key === 'Escape') {
      showInput = false;
      isValueHovered = false;
    }
  };

  const displayValue = $derived(
    formatValue ? formatValue(value) : value.toFixed(decimalsForStep(step))
  );

  const cardClassName = $derived(
    [
      'tweakers-slider',
      isVertical ? 'tweakers-slider-vertical' : '',
      isActive ? 'tweakers-slider-active' : '',
      isInteracting ? 'tweakers-slider-engaged' : '',
      isMetaHeld ? 'tweakers-slider-text-mode' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  // Rubber band maps stretch to width/x horizontally, height/y vertically
  // (negative stretch = overshoot past the max end: left or top).
  const cardStyle = $derived.by(() => {
    const size = `calc(100% + ${Math.abs(rubberStretchPx.current)}px)`;
    const shift = rubberStretchPx.current < 0 ? rubberStretchPx.current : 0;
    return isVertical
      ? `height:${size};transform:translateY(${shift}px);`
      : `width:${size};transform:translateX(${shift}px);`;
  });

  // Origin-anchored fill: the bar spans between the origin and the handle, so
  // a centered origin fills toward either side of it. Without an origin this
  // reduces exactly to the classic min-anchored fill.
  const fillStart = $derived(
    hasOrigin ? `${Math.min(fillPercent.current, originPercent)}%` : '0%'
  );
  const fillExtent = $derived(
    hasOrigin ? `${Math.abs(fillPercent.current - originPercent)}%` : `${fillPercent.current}%`
  );
  const handleStyle = $derived(
    `left:min(calc(100% - 1px), max(0px, calc(${fillPercent.current}% - 0.5px)));opacity:${isDragging ? 0.9 : 0};transition:opacity 0.15s;`
  );
</script>

{#if isVertical}
  <div bind:this={wrapperRef} class="tweakers-slider-wrapper tweakers-slider-wrapper-vertical">
    <div
      class={cardClassName}
      data-origin={hasOrigin ? 'true' : undefined}
      style={cardStyle}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerCancel}
      onmouseenter={(e) => {
        isHovered = true;
        // Read ⌘ on entry too: the key listeners only exist while hovered, so
        // a key already held before the pointer arrived would go unseen.
        isMetaHeld = e.metaKey;
      }}
      onmouseleave={() => (isHovered = false)}
    >
      <div class="tweakers-slider-fill-area">
        <div
          class="tweakers-slider-fill-vertical"
          style={`bottom:${fillStart};height:${fillExtent};`}
        />
      </div>

      {#if showInput}
        <input
          bind:this={inputRef}
          type="text"
          class="tweakers-slider-input tweakers-slider-input-vertical"
          value={inputValue}
          oninput={(e) => (inputValue = (e.currentTarget as HTMLInputElement).value)}
          onkeydown={handleInputKeydown}
          onblur={handleInputSubmit}
          onclick={(e) => e.stopPropagation()}
          onmousedown={(e) => e.stopPropagation()}
          onpointerdown={(e) => e.stopPropagation()}
        />
      {:else}
        <span
          class={`tweakers-slider-value-vertical ${isValueEditable ? 'tweakers-slider-value-editable' : ''}`}
          onmouseenter={() => (isValueHovered = true)}
          onmouseleave={() => (isValueHovered = false)}
          onclick={handleValueClick}
          onpointerdown={(e) => isValueEditable && e.stopPropagation()}
          style:cursor={isValueEditable || isMetaHeld ? 'text' : 'default'}
        >
          {displayValue}{#if unit}<span class="tweakers-slider-unit">{unit}</span>{/if}
        </span>
      {/if}

      <span class="tweakers-slider-label-vertical">
        {label}
        {#if shortcut}
          <span class={`tweakers-shortcut-pill${shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`}>
            {formatSliderShortcut(shortcut)}
          </span>
        {/if}
      </span>
    </div>
  </div>
{:else}
  <div bind:this={wrapperRef} class="tweakers-slider-wrapper">
    <div
      class={cardClassName}
      data-origin={hasOrigin ? 'true' : undefined}
      style={cardStyle}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerCancel}
      onmouseenter={(e) => {
        isHovered = true;
        // Read ⌘ on entry too: the key listeners only exist while hovered, so
        // a key already held before the pointer arrived would go unseen.
        isMetaHeld = e.metaKey;
      }}
      onmouseleave={() => (isHovered = false)}
    >
      <div class="tweakers-slider-track">
        <div class="tweakers-slider-fill" style={`left:${fillStart};width:${fillExtent};`} />
        <div class="tweakers-slider-handle" style={handleStyle} />
      </div>

      <div class="tweakers-slider-hashmarks">
        {#each hashMarks as mark (mark.key)}
          <div class="tweakers-slider-hashmark" style:left={`${mark.left}%`} />
        {/each}
      </div>

      <span class="tweakers-slider-label">
        {label}
        {#if shortcut}
          <span class={`tweakers-shortcut-pill${shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`}>
            {formatSliderShortcut(shortcut)}
          </span>
        {/if}
      </span>

      {#if valueIcon}
        <span class="tweakers-slider-value tweakers-slider-value-icon">
          {@render valueIcon()}
        </span>
      {:else if showInput}
        <input
          bind:this={inputRef}
          type="text"
          class="tweakers-slider-input"
          value={inputValue}
          oninput={(e) => (inputValue = (e.currentTarget as HTMLInputElement).value)}
          onkeydown={handleInputKeydown}
          onblur={handleInputSubmit}
          onclick={(e) => e.stopPropagation()}
          onmousedown={(e) => e.stopPropagation()}
          onpointerdown={(e) => e.stopPropagation()}
        />
      {:else}
        <span
          class={`tweakers-slider-value ${isValueEditable ? 'tweakers-slider-value-editable' : ''}`}
          onmouseenter={() => (isValueHovered = true)}
          onmouseleave={() => (isValueHovered = false)}
          onclick={handleValueClick}
          onpointerdown={(e) => isValueEditable && e.stopPropagation()}
          style:cursor={isValueEditable || isMetaHeld ? 'text' : 'default'}
        >
          {displayValue}{#if unit}<span class="tweakers-slider-unit">{unit}</span>{/if}
        </span>
      {/if}
    </div>
  </div>
{/if}
