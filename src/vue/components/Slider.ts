import { defineComponent, h, computed, nextTick, onMounted, onUnmounted, ref, watch, type PropType } from 'vue';
import { animate, motionValue } from 'motion-v';
import type { ShortcutConfig } from '../../store/DialStore';
import { decimalsForStep, roundValue, snapToDecile, formatSliderShortcut } from '../../shortcut-utils';

const CLICK_THRESHOLD = 3;
const DEAD_ZONE = 32;
const MAX_CURSOR_RANGE = 200;
const MAX_STRETCH = 8;
/** Half-width of the origin snap zone, in pixels of track travel. */
const DETENT_PX = 6;

export const Slider = defineComponent({
  name: 'DialKitSlider',
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    unit: { type: String, required: false },
    /**
     * Anchor the fill at this value instead of `min`. Bipolar parameters fill
     * out from the origin in either direction and gain an escapable detent at
     * the origin while dragging. Defaults to `min`.
     */
    origin: { type: Number, required: false, default: undefined },
    /** Convenience for `origin={0}` on a symmetric range. */
    bipolar: { type: Boolean, default: false },
    /**
     * `vertical` renders the column card: fill grows bottom-up, label sits at
     * the base, and the value readout appears over the fill on hover/drag.
     */
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    shortcut: { type: Object as PropType<ShortcutConfig>, default: undefined },
    shortcutActive: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const min = computed(() => props.min ?? 0);
    const max = computed(() => props.max ?? 1);
    const step = computed(() => props.step ?? 0.01);
    const isVertical = computed(() => props.orientation === 'vertical');
    const resolvedOrigin = computed(() =>
      Math.min(max.value, Math.max(min.value, props.origin ?? (props.bipolar ? 0 : min.value)))
    );
    const hasOrigin = computed(() => resolvedOrigin.value > min.value);
    const originPercent = computed(
      () => ((resolvedOrigin.value - min.value) / (max.value - min.value)) * 100
    );

    const wrapperRef = ref<HTMLElement | null>(null);
    const cardRef = ref<HTMLElement | null>(null);
    const fillRef = ref<HTMLElement | null>(null);
    const handleRef = ref<HTMLElement | null>(null);
    const inputRef = ref<HTMLInputElement | null>(null);

    const isInteracting = ref(false);
    const isDragging = ref(false);
    const isHovered = ref(false);
    const isValueHovered = ref(false);
    const isValueEditable = ref(false);
    const showInput = ref(false);
    const inputValue = ref('');

    const fillPercent = motionValue(((props.value - min.value) / (max.value - min.value)) * 100);
    const rubberStretchPx = motionValue(0);
    const handleOpacityMv = motionValue(0);

    const percentage = computed(() => ((props.value - min.value) / (max.value - min.value)) * 100);
    const isActive = computed(() => isInteracting.value || isHovered.value);
    const displayValue = computed(() => props.value.toFixed(decimalsForStep(step.value)));
    let pointerDownPos: { x: number; y: number } | null = null;
    let isClickFlag = true;
    let wrapperRect: DOMRect | null = null;
    let scaleVal = 1;
    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

    let snapAnim: ReturnType<typeof animate> | null = null;
    let rubberAnim: ReturnType<typeof animate> | null = null;
    let handleOpacityAnim: ReturnType<typeof animate> | null = null;

    // Origin-anchored fill spans between origin and handle; without an origin
    // it reduces to the classic min-anchored fill.
    const fillStart = (pct: number) =>
      hasOrigin.value ? `${Math.min(pct, originPercent.value)}%` : '0%';
    const fillExtent = (pct: number) =>
      hasOrigin.value ? `${Math.abs(pct - originPercent.value)}%` : `${pct}%`;
    const handleLeft = (pct: number) =>
      `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`;

    const applyFillStyles = (pct: number) => {
      if (fillRef.value) {
        if (isVertical.value) {
          fillRef.value.style.bottom = fillStart(pct);
          fillRef.value.style.height = fillExtent(pct);
        } else {
          fillRef.value.style.left = fillStart(pct);
          fillRef.value.style.width = fillExtent(pct);
        }
      }
      if (handleRef.value) handleRef.value.style.left = handleLeft(pct);
    };

    const trackExtent = () => {
      const el = wrapperRef.value;
      if (!el) return 0;
      return isVertical.value ? el.offsetHeight : el.offsetWidth;
    };

    // Escapable magnetic snap to the origin while dragging.
    const applyDetent = (v: number) => {
      if (!hasOrigin.value) return v;
      const extent = trackExtent();
      if (extent <= 0) return v;
      const detentValue = (DETENT_PX / extent) * (max.value - min.value);
      return Math.abs(v - resolvedOrigin.value) <= detentValue ? resolvedOrigin.value : v;
    };

    // Rubber band maps stretch to width/x horizontally and height/y vertically
    // (negative stretch = overshoot past the max end: left or top).
    const applyRubberStyles = (stretch: number) => {
      if (!cardRef.value) return;
      const size = `calc(100% + ${Math.abs(stretch)}px)`;
      const shift = `${stretch < 0 ? stretch : 0}px`;
      if (isVertical.value) {
        cardRef.value.style.height = size;
        cardRef.value.style.transform = `translateY(${shift})`;
      } else {
        cardRef.value.style.width = size;
        cardRef.value.style.transform = `translateX(${shift})`;
      }
    };

    const applyHandleOpacity = (opacity: number) => {
      if (handleRef.value) handleRef.value.style.opacity = String(opacity);
    };

    const positionToValue = (clientX: number, clientY: number) => {
      if (!wrapperRect) return props.value;
      const screenPos = isVertical.value ? clientY - wrapperRect.top : clientX - wrapperRect.left;
      const scenePos = screenPos / scaleVal;
      const nativeExtent = trackExtent() || (isVertical.value ? wrapperRect.height : wrapperRect.width);
      let pct = Math.max(0, Math.min(1, scenePos / nativeExtent));
      // Vertical: top of the card is max, bottom is min.
      if (isVertical.value) pct = 1 - pct;
      const rawValue = min.value + pct * (max.value - min.value);
      return Math.max(min.value, Math.min(max.value, rawValue));
    };

    const percentFromValue = (value: number) => ((value - min.value) / (max.value - min.value)) * 100;

    const computeRubberStretch = (clientPos: number, sign: number) => {
      if (!wrapperRect) return 0;
      const nearEdge = isVertical.value ? wrapperRect.top : wrapperRect.left;
      const farEdge = isVertical.value ? wrapperRect.bottom : wrapperRect.right;
      const distancePast = sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
      const overflow = Math.max(0, distancePast - DEAD_ZONE);
      return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (showInput.value) return;
      event.preventDefault();
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isInteracting.value = true;

      if (wrapperRef.value) {
        wrapperRect = wrapperRef.value.getBoundingClientRect();
        const nativeExtent = trackExtent();
        const rectExtent = isVertical.value ? wrapperRect.height : wrapperRect.width;
        scaleVal = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isInteracting.value || !pointerDownPos) return;

      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (isClickFlag && distance > CLICK_THRESHOLD) {
        isClickFlag = false;
        isDragging.value = true;
      }

      if (!isClickFlag) {
        if (wrapperRect) {
          const clientPos = isVertical.value ? event.clientY : event.clientX;
          const nearEdge = isVertical.value ? wrapperRect.top : wrapperRect.left;
          const farEdge = isVertical.value ? wrapperRect.bottom : wrapperRect.right;
          if (clientPos < nearEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, -1));
          } else if (clientPos > farEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, 1));
          } else {
            rubberStretchPx.jump(0);
          }
        }

        const nextValue = applyDetent(positionToValue(event.clientX, event.clientY));
        const nextPct = percentFromValue(nextValue);
        if (snapAnim) {
          snapAnim.stop();
          snapAnim = null;
        }
        fillPercent.jump(nextPct);
        emit('change', roundValue(nextValue, step.value));
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isInteracting.value) return;

      if (isClickFlag) {
        // When steps are coarse (≤10 positions), click snaps to the nearest
        // step. Otherwise, the original decile-magnetic behavior is preserved.
        const rawValue = positionToValue(event.clientX, event.clientY);
        const discreteSteps = (max.value - min.value) / step.value;
        const snappedValue = discreteSteps <= 10
          ? Math.max(min.value, Math.min(max.value, min.value + Math.round((rawValue - min.value) / step.value) * step.value))
          : snapToDecile(rawValue, min.value, max.value);

        const nextPct = percentFromValue(snappedValue);

        snapAnim?.stop();
        snapAnim = animate(fillPercent, nextPct, {
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            snapAnim = null;
          },
        });

        emit('change', roundValue(snappedValue, step.value));
      }

      if (rubberStretchPx.get() !== 0) {
        rubberAnim?.stop();
        rubberAnim = animate(rubberStretchPx, 0, {
          type: 'spring',
          visualDuration: 0.35,
          bounce: 0.15,
        });
      }

      isInteracting.value = false;
      isDragging.value = false;
      pointerDownPos = null;
    };

    const handlePointerCancel = () => {
      if (!isInteracting.value) return;
      isInteracting.value = false;
      isDragging.value = false;
      rubberStretchPx.jump(0);
      pointerDownPos = null;
    };

    const handleInputSubmit = () => {
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        const clamped = Math.max(min.value, Math.min(max.value, parsed));
        emit('change', roundValue(clamped, step.value));
      }
      showInput.value = false;
      isValueHovered.value = false;
      isValueEditable.value = false;
    };

    const handleValueClick = (event: MouseEvent) => {
      if (!isValueEditable.value) return;
      event.stopPropagation();
      event.preventDefault();
      showInput.value = true;
      inputValue.value = props.value.toFixed(decimalsForStep(step.value));
    };

    const handleInputKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleInputSubmit();
      } else if (event.key === 'Escape') {
        showInput.value = false;
        isValueHovered.value = false;
      }
    };

    watch(() => props.value, () => {
      if (!isInteracting.value && !snapAnim) {
        fillPercent.jump(percentage.value);
      }
    });

    // The handle only shows while dragging: 0.9 while engaged, hidden at rest.
    watch(isDragging, (dragging) => {
      handleOpacityAnim?.stop();
      handleOpacityAnim = animate(handleOpacityMv, dragging ? 0.9 : 0, { duration: 0.15 });
    });

    watch([isValueHovered, showInput, isValueEditable], () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      if (isValueHovered.value && !showInput.value && !isValueEditable.value) {
        hoverTimeout = setTimeout(() => {
          isValueEditable.value = true;
        }, 800);
      } else if (!isValueHovered.value && !showInput.value) {
        isValueEditable.value = false;
      }
    });

    watch(showInput, async (visible) => {
      if (!visible) return;
      await nextTick();
      inputRef.value?.focus();
      inputRef.value?.select();
    });

    // The ≤ 10 threshold separates discrete sliders
    // (like step=2 on a 0–10 range → 5 steps) from continuous ones.
    const discreteSteps = computed(() => (max.value - min.value) / step.value);
    const hashMarks = computed(() => {
      const marks: ReturnType<typeof h>[] = [];
      if (discreteSteps.value <= 10) {
        const count = Math.max(0, Math.floor(discreteSteps.value) - 1);
        for (let i = 0; i < count; i += 1) {
          const pct = ((i + 1) * step.value) / (max.value - min.value) * 100;
          marks.push(h('div', { class: 'dialkit-slider-hashmark', style: { left: `${pct}%` } }));
        }
        return marks;
      }

      for (let i = 0; i < 9; i += 1) {
        const pct = (i + 1) * 10;
        marks.push(h('div', { class: 'dialkit-slider-hashmark', style: { left: `${pct}%` } }));
      }
      return marks;
    });

    let unsubFill: (() => void) | null = null;
    let unsubRubber: (() => void) | null = null;
    let unsubHandleOpacity: (() => void) | null = null;

    onMounted(() => {
      unsubFill = fillPercent.on('change', applyFillStyles);
      unsubRubber = rubberStretchPx.on('change', applyRubberStyles);
      unsubHandleOpacity = handleOpacityMv.on('change', applyHandleOpacity);

      applyFillStyles(fillPercent.get());
      applyRubberStyles(rubberStretchPx.get());
      applyHandleOpacity(handleOpacityMv.get());
    });

    onUnmounted(() => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      snapAnim?.stop();
      rubberAnim?.stop();
      handleOpacityAnim?.stop();

      unsubFill?.();
      unsubRubber?.();
      unsubHandleOpacity?.();
    });

    const cardClassName = computed(() =>
      [
        'dialkit-slider',
        isVertical.value ? 'dialkit-slider-vertical' : '',
        isActive.value ? 'dialkit-slider-active' : '',
        isInteracting.value ? 'dialkit-slider-engaged' : '',
      ]
        .filter(Boolean)
        .join(' ')
    );

    const cardProps = () => ({
      ref: cardRef,
      class: cardClassName.value,
      'data-origin': hasOrigin.value ? 'true' : undefined,
      onPointerdown: handlePointerDown,
      onPointermove: handlePointerMove,
      onPointerup: handlePointerUp,
      onPointercancel: handlePointerCancel,
      onMouseenter: () => {
        isHovered.value = true;
      },
      onMouseleave: () => {
        isHovered.value = false;
      },
    });

    const renderInput = (className: string) =>
      h('input', {
        ref: inputRef,
        type: 'text',
        class: className,
        value: inputValue.value,
        onInput: (event: Event) => {
          inputValue.value = (event.target as HTMLInputElement).value;
        },
        onKeydown: handleInputKeydown,
        onBlur: handleInputSubmit,
        onClick: (event: MouseEvent) => event.stopPropagation(),
        onPointerdown: (event: PointerEvent) => event.stopPropagation(),
      });

    const renderValueSpan = (className: string) =>
      h('span', {
        class: `${className} ${isValueEditable.value ? 'dialkit-slider-value-editable' : ''}`,
        onMouseenter: () => {
          isValueHovered.value = true;
        },
        onMouseleave: () => {
          isValueHovered.value = false;
        },
        onClick: handleValueClick,
        onPointerdown: (event: PointerEvent) => {
          if (isValueEditable.value) event.stopPropagation();
        },
        style: { cursor: isValueEditable.value ? 'text' : 'default' },
      }, [
        displayValue.value,
        props.unit ? h('span', { class: 'dialkit-slider-unit' }, props.unit) : null,
      ]);

    const renderLabel = (className: string) =>
      h('span', { class: className }, [
        props.label,
        props.shortcut
          ? h('span', {
              class: `dialkit-shortcut-pill${props.shortcutActive ? ' dialkit-shortcut-pill-active' : ''}`,
            }, formatSliderShortcut(props.shortcut))
          : null,
      ]);

    return () => {
      if (isVertical.value) {
        return h('div', { ref: wrapperRef, class: 'dialkit-slider-wrapper dialkit-slider-wrapper-vertical' }, [
          h('div', cardProps(), [
            h('div', { class: 'dialkit-slider-fill-area' }, [
              h('div', {
                ref: fillRef,
                class: 'dialkit-slider-fill-vertical',
                style: {
                  bottom: fillStart(fillPercent.get()),
                  height: fillExtent(fillPercent.get()),
                },
              }),
            ]),
            showInput.value
              ? renderInput('dialkit-slider-input dialkit-slider-input-vertical')
              : renderValueSpan('dialkit-slider-value-vertical'),
            renderLabel('dialkit-slider-label-vertical'),
          ]),
        ]);
      }

      return h('div', { ref: wrapperRef, class: 'dialkit-slider-wrapper' }, [
        h('div', cardProps(), [
          h('div', { class: 'dialkit-slider-track' }, [
            h('div', {
              ref: fillRef,
              class: 'dialkit-slider-fill',
              style: {
                left: fillStart(fillPercent.get()),
                width: fillExtent(fillPercent.get()),
              },
            }),
            h('div', {
              ref: handleRef,
              class: 'dialkit-slider-handle',
              style: {
                left: handleLeft(fillPercent.get()),
                opacity: handleOpacityMv.get(),
              },
            }),
          ]),
          h('div', { class: 'dialkit-slider-hashmarks' }, hashMarks.value),
          renderLabel('dialkit-slider-label'),
          showInput.value
            ? renderInput('dialkit-slider-input')
            : renderValueSpan('dialkit-slider-value'),
        ]),
      ]);
    };
  },
});
