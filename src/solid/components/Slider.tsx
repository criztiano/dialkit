import { createSignal, createEffect, onMount, onCleanup, Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { animate, motionValue } from 'motion';
import type { ShortcutConfig } from '../../store/TweakStore';
import {
  decimalsForStep,
  roundValue,
  snapToDecile,
  formatSliderShortcut,
} from '../../shortcut-utils';

interface SliderProps {
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
   * Render a custom node (e.g. an icon or gauge) in the value slot instead of
   * the editable numeric text. Sliders with a `valueIcon` are not editable.
   */
  valueIcon?: JSX.Element;
  /**
   * Anchor the fill at this value instead of `min`. Bipolar parameters fill
   * out from the origin in either direction and gain an escapable detent at
   * the origin while dragging. Defaults to `min` (classic left-anchored
   * fill, no detent).
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
}

const CLICK_THRESHOLD = 3;
const DEAD_ZONE = 32;
const MAX_CURSOR_RANGE = 200;
const MAX_STRETCH = 8;
/** Half-width of the origin snap zone, in pixels of track travel. */
const DETENT_PX = 6;

export function Slider(props: SliderProps) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 1;
  const step = () => props.step ?? 0.01;
  const isVertical = () => props.orientation === 'vertical';
  const resolvedOrigin = () =>
    Math.min(max(), Math.max(min(), props.origin ?? (props.bipolar ? 0 : min())));
  const hasOrigin = () => resolvedOrigin() > min();
  const originPercent = () => ((resolvedOrigin() - min()) / (max() - min())) * 100;

  let wrapperRef!: HTMLDivElement;
  let cardRef!: HTMLDivElement;
  let fillRef!: HTMLDivElement;
  let handleRef!: HTMLDivElement;
  let inputRef!: HTMLInputElement;

  const [isInteracting, setIsInteracting] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isHovered, setIsHovered] = createSignal(false);
  const [isValueHovered, setIsValueHovered] = createSignal(false);
  const [isMetaHeld, setIsMetaHeld] = createSignal(false);
  const [isValueEditable, setIsValueEditable] = createSignal(false);
  const [showInput, setShowInput] = createSignal(false);
  const [inputValue, setInputValue] = createSignal('');

  const fillPercent = motionValue(((props.value - min()) / (max() - min())) * 100);
  const rubberStretchPx = motionValue(0);
  const handleOpacityMv = motionValue(0);

  // Origin-anchored fill spans between the origin and the handle; without an
  // origin it reduces to the classic min-anchored fill. Horizontal grows the
  // fill from the left edge; vertical grows it bottom-up.
  const fillStart = (pct: number) =>
    hasOrigin() ? `${Math.min(pct, originPercent())}%` : '0%';
  const fillExtent = (pct: number) =>
    hasOrigin() ? `${Math.abs(pct - originPercent())}%` : `${pct}%`;
  const handleLeft = (pct: number) =>
    `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`;

  const applyFillStyles = (pct: number) => {
    if (fillRef) {
      if (isVertical()) {
        fillRef.style.bottom = fillStart(pct);
        fillRef.style.height = fillExtent(pct);
      } else {
        fillRef.style.left = fillStart(pct);
        fillRef.style.width = fillExtent(pct);
      }
    }
    if (!isVertical() && handleRef) handleRef.style.left = handleLeft(pct);
  };

  // Rubber band: horizontal maps stretch to width/x; vertical to height/y
  // (negative stretch = overshoot past the max end: left or top).
  const applyRubberStyles = (stretch: number) => {
    if (!cardRef) return;
    const size = `calc(100% + ${Math.abs(stretch)}px)`;
    const shift = stretch < 0 ? stretch : 0;
    if (isVertical()) {
      cardRef.style.height = size;
      cardRef.style.transform = `translateY(${shift}px)`;
    } else {
      cardRef.style.width = size;
      cardRef.style.transform = `translateX(${shift}px)`;
    }
  };

  const applyHandleOpacity = (opacity: number) => {
    if (handleRef) handleRef.style.opacity = String(opacity);
  };

  // Sync fill from props when not interacting
  createEffect(() => {
    if (!isInteracting() && !snapAnim) {
      fillPercent.jump(((props.value - min()) / (max() - min())) * 100);
    }
  });

  const isActive = () => isInteracting() || isHovered();

  let pointerDownPos: { x: number; y: number } | null = null;
  let isClickFlag = true;
  let wrapperRect: DOMRect | null = null;
  let scaleVal = 1;
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let snapAnim: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rubberAnim: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let handleOpacityAnim: any = null;

  const trackExtent = () => {
    if (!wrapperRef) return 0;
    return isVertical() ? wrapperRef.offsetHeight : wrapperRef.offsetWidth;
  };

  const positionToValue = (clientX: number, clientY: number) => {
    if (!wrapperRect) return props.value;
    const screenPos = isVertical() ? clientY - wrapperRect.top : clientX - wrapperRect.left;
    const scenePos = screenPos / scaleVal;
    const nativeExtent = trackExtent() || (isVertical() ? wrapperRect.height : wrapperRect.width);
    let percent = Math.max(0, Math.min(1, scenePos / nativeExtent));
    // Vertical: top of the card is max, bottom is min.
    if (isVertical()) percent = 1 - percent;
    const rawValue = min() + percent * (max() - min());
    return Math.max(min(), Math.min(max(), rawValue));
  };

  const percentFromValue = (v: number) => ((v - min()) / (max() - min())) * 100;

  // Escapable magnetic snap to the origin while dragging.
  const applyDetent = (v: number) => {
    if (!hasOrigin()) return v;
    const extent = trackExtent();
    if (extent <= 0) return v;
    const detentValue = (DETENT_PX / extent) * (max() - min());
    return Math.abs(v - resolvedOrigin()) <= detentValue ? resolvedOrigin() : v;
  };

  const computeRubberStretch = (clientPos: number, sign: number) => {
    if (!wrapperRect) return 0;
    const nearEdge = isVertical() ? wrapperRect.top : wrapperRect.left;
    const farEdge = isVertical() ? wrapperRect.bottom : wrapperRect.right;
    const distancePast = sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
    const overflow = Math.max(0, distancePast - DEAD_ZONE);
    return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1.0));
  };

  const cancelInteraction = () => {
    if (!isInteracting()) return;
    setIsInteracting(false);
    setIsDragging(false);
    rubberStretchPx.jump(0);
    pointerDownPos = null;
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (showInput()) return;
    // ⌘ hands the card over to the text: no drag, no preventDefault, so the
    // browser's own selection starts and a click reaches the value span.
    if (e.metaKey) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerDownPos = { x: e.clientX, y: e.clientY };
    isClickFlag = true;
    setIsInteracting(true);

    // Capture wrapper rect at pointer down for stable reference
    if (wrapperRef) {
      wrapperRect = wrapperRef.getBoundingClientRect();
      const nativeExtent = trackExtent();
      const rectExtent = isVertical() ? wrapperRect.height : wrapperRect.width;
      scaleVal = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
    }
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

    if (!isClickFlag) {
      // Drag mode — instant update
      if (wrapperRect) {
        const clientPos = isVertical() ? e.clientY : e.clientX;
        const nearEdge = isVertical() ? wrapperRect.top : wrapperRect.left;
        const farEdge = isVertical() ? wrapperRect.bottom : wrapperRect.right;
        if (clientPos < nearEdge) {
          rubberStretchPx.jump(computeRubberStretch(clientPos, -1));
        } else if (clientPos > farEdge) {
          rubberStretchPx.jump(computeRubberStretch(clientPos, 1));
        } else {
          rubberStretchPx.jump(0);
        }
      }

      const newValue = applyDetent(positionToValue(e.clientX, e.clientY));
      const newPct = percentFromValue(newValue);
      if (snapAnim) { snapAnim.stop(); snapAnim = null; }
      fillPercent.jump(newPct);
      props.onChange(roundValue(newValue, step()));
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isInteracting()) return;

    if (isClickFlag) {
      // When steps are coarse (≤10 positions), click snaps to the nearest step.
      // Otherwise, the original decile-magnetic behavior is preserved
      const rawValue = positionToValue(e.clientX, e.clientY);
      const discreteSteps = (max() - min()) / step();
      const snappedValue = discreteSteps <= 10
        ? Math.max(min(), Math.min(max(), min() + Math.round((rawValue - min()) / step()) * step()))
        : snapToDecile(rawValue, min(), max());

      const newPct = percentFromValue(snappedValue);

      if (snapAnim) snapAnim.stop();
      snapAnim = animate(fillPercent, newPct, {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          snapAnim = null;
        },
      });

      props.onChange(roundValue(snappedValue, step()));
    }

    // Spring rubber band back
    if (rubberStretchPx.get() !== 0) {
      if (rubberAnim) rubberAnim.stop();
      rubberAnim = animate(rubberStretchPx, 0, {
        type: 'spring',
        visualDuration: 0.35,
        bounce: 0.15,
      });
    }

    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos = null;
  };

  const handlePointerCancel = () => {
    cancelInteraction();
  };

  /** Running value for wheel notches, which arrive faster than props settle. */
  let wheelValue = props.value;
  createEffect(() => {
    wheelValue = props.value;
  });

  // Wheel over the card adjusts the value — the pointer is already on the
  // control, so the scroll belongs to it, not to the page behind it. Bound
  // natively because the listener needs { passive: false } to preventDefault;
  // stopPropagation keeps the window-level scroll shortcuts from firing twice.
  onMount(() => {
    const onWheel = (e: WheelEvent) => {
      if (showInput()) return;
      e.preventDefault();
      e.stopPropagation();

      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (raw === 0) return;

      const stepMultiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const delta = (raw > 0 ? 1 : -1) * step() * stepMultiplier;
      // A trackpad fires several wheel events per frame, all before the prop
      // comes back — so each notch reads the running value, not the stale one.
      const next = roundValue(
        Math.max(min(), Math.min(max(), wheelValue + delta)),
        step()
      );
      wheelValue = next;

      if (snapAnim) { snapAnim.stop(); snapAnim = null; }
      fillPercent.jump(percentFromValue(next));
      props.onChange(next);
    };

    wrapperRef.addEventListener('wheel', onWheel, { passive: false });
    onCleanup(() => wrapperRef.removeEventListener('wheel', onWheel));
  });

  // ⌘ turns the card into text for as long as it is held. Only listened for
  // while hovered, so an idle panel adds no key handlers.
  createEffect(() => {
    if (!isHovered()) {
      setIsMetaHeld(false);
      return;
    }
    const sync = (e: KeyboardEvent) => setIsMetaHeld(e.metaKey);
    const clear = () => setIsMetaHeld(false);
    window.addEventListener('keydown', sync);
    window.addEventListener('keyup', sync);
    window.addEventListener('blur', clear);
    onCleanup(() => {
      window.removeEventListener('keydown', sync);
      window.removeEventListener('keyup', sync);
      window.removeEventListener('blur', clear);
    });
  });

  // Handle value hover delay — clear pending timer on each re-run
  createEffect(() => {
    const hovered = isValueHovered();
    const editing = showInput();
    const editable = isValueEditable();

    onCleanup(() => {
      if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
    });

    if (hovered && !editing && !editable) {
      hoverTimeout = setTimeout(() => setIsValueEditable(true), 800);
    } else if (!hovered && !editing) {
      setIsValueEditable(false);
    }
  });

  onCleanup(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    snapAnim?.stop();
    rubberAnim?.stop();
    handleOpacityAnim?.stop();
  });

  onMount(() => {
    const unsubFill = fillPercent.on('change', applyFillStyles);
    const unsubRubber = rubberStretchPx.on('change', applyRubberStyles);
    const unsubHandleOpacity = handleOpacityMv.on('change', applyHandleOpacity);
    applyFillStyles(fillPercent.get());
    applyRubberStyles(rubberStretchPx.get());
    applyHandleOpacity(handleOpacityMv.get());

    onCleanup(() => {
      unsubFill();
      unsubRubber();
      unsubHandleOpacity();
    });
  });

  // Handle only shows while dragging
  createEffect(() => {
    const targetOpacity = isDragging() ? 0.9 : 0;
    handleOpacityAnim?.stop();
    handleOpacityAnim = animate(handleOpacityMv, targetOpacity, { duration: 0.15 });
  });

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
      const clamped = Math.max(min(), Math.min(max(), parsed));
      props.onChange(roundValue(clamped, step()));
    }
    setShowInput(false);
    setIsValueHovered(false);
    setIsValueEditable(false);
  };

  const handleValueClick = (e: MouseEvent) => {
    if (isValueEditable() || e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      setShowInput(true);
      setInputValue(props.value.toFixed(decimalsForStep(step())));
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleInputSubmit();
    else if (e.key === 'Escape') {
      setShowInput(false);
      setIsValueHovered(false);
    }
  };

  const displayValue = () =>
    props.formatValue
      ? props.formatValue(props.value)
      : props.value.toFixed(decimalsForStep(step()));

  // The ≤ 10 threshold separates discrete sliders
  // (like step=2 on a 0–10 range → 5 steps) from continuous ones.
  const discreteSteps = () => (max() - min()) / step();

  const hashMarks = () => {
    const ds = discreteSteps();
    if (ds <= 10) {
      return Array.from({ length: ds - 1 }, (_, i) => {
        const pct = ((i + 1) * step()) / (max() - min()) * 100;
        return <div class="tweakers-slider-hashmark" style={{ left: `${pct}%` }} />;
      });
    }
    return Array.from({ length: 9 }, (_, i) => {
      const pct = (i + 1) * 10;
      return <div class="tweakers-slider-hashmark" style={{ left: `${pct}%` }} />;
    });
  };

  const cardClass = () =>
    [
      'tweakers-slider',
      isVertical() ? 'tweakers-slider-vertical' : '',
      isActive() ? 'tweakers-slider-active' : '',
      isInteracting() ? 'tweakers-slider-engaged' : '',
      isMetaHeld() ? 'tweakers-slider-text-mode' : '',
    ]
      .filter(Boolean)
      .join(' ');

  const shortcutPill = () => (
    <Show when={props.shortcut}>
      <span class={`tweakers-shortcut-pill${props.shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`}>
        {formatSliderShortcut(props.shortcut!)}
      </span>
    </Show>
  );

  return (
    <div
      ref={wrapperRef}
      class={`tweakers-slider-wrapper${isVertical() ? ' tweakers-slider-wrapper-vertical' : ''}`}
    >
      <div
        ref={cardRef}
        class={cardClass()}
        data-origin={hasOrigin() ? 'true' : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onMouseEnter={(e) => {
          setIsHovered(true);
          // Read ⌘ on entry too: the key listeners only exist while hovered, so
          // a key already held before the pointer arrived would go unseen.
          setIsMetaHeld(e.metaKey);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Show
          when={isVertical()}
          fallback={
            <>
              <div class="tweakers-slider-track">
                <div
                  ref={fillRef}
                  class="tweakers-slider-fill"
                  style={{
                    left: fillStart(fillPercent.get()),
                    width: fillExtent(fillPercent.get()),
                  }}
                />
                <div
                  ref={handleRef}
                  class="tweakers-slider-handle"
                  style={{ left: handleLeft(fillPercent.get()), opacity: 0 }}
                />
              </div>

              <div class="tweakers-slider-hashmarks">{hashMarks()}</div>

              <span class="tweakers-slider-label">
                {props.label}
                {shortcutPill()}
              </span>

              {props.valueIcon != null ? (
                <span class="tweakers-slider-value tweakers-slider-value-icon">
                  {props.valueIcon}
                </span>
              ) : showInput() ? (
                <input
                  ref={inputRef}
                  type="text"
                  class="tweakers-slider-input"
                  value={inputValue()}
                  onInput={(e) => setInputValue(e.currentTarget.value)}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleInputSubmit}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  class={`tweakers-slider-value ${isValueEditable() ? 'tweakers-slider-value-editable' : ''}`}
                  onMouseEnter={() => setIsValueHovered(true)}
                  onMouseLeave={() => setIsValueHovered(false)}
                  onClick={handleValueClick}
                  onPointerDown={(e) => isValueEditable() && e.stopPropagation()}
                  style={{ cursor: isValueEditable() || isMetaHeld() ? 'text' : 'default' }}
                >
                  {displayValue()}
                  <Show when={props.unit}>
                    <span class="tweakers-slider-unit">{props.unit}</span>
                  </Show>
                </span>
              )}
            </>
          }
        >
          <div class="tweakers-slider-fill-area">
            <div
              ref={fillRef}
              class="tweakers-slider-fill-vertical"
              style={{
                bottom: fillStart(fillPercent.get()),
                height: fillExtent(fillPercent.get()),
              }}
            />
          </div>

          {showInput() ? (
            <input
              ref={inputRef}
              type="text"
              class="tweakers-slider-input tweakers-slider-input-vertical"
              value={inputValue()}
              onInput={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputSubmit}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              class={`tweakers-slider-value-vertical ${isValueEditable() ? 'tweakers-slider-value-editable' : ''}`}
              onMouseEnter={() => setIsValueHovered(true)}
              onMouseLeave={() => setIsValueHovered(false)}
              onClick={handleValueClick}
              onPointerDown={(e) => isValueEditable() && e.stopPropagation()}
              style={{ cursor: isValueEditable() || isMetaHeld() ? 'text' : 'default' }}
            >
              {displayValue()}
              <Show when={props.unit}>
                <span class="tweakers-slider-unit">{props.unit}</span>
              </Show>
            </span>
          )}

          <span class="tweakers-slider-label-vertical">
            {props.label}
            {shortcutPill()}
          </span>
        </Show>
      </div>
    </div>
  );
}
