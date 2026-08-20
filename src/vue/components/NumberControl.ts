import { defineComponent, h, computed, nextTick, ref, watch, type PropType } from 'vue';
import { decimalsForStep, roundValue } from '../../shortcut-utils';

const CLICK_THRESHOLD = 3;

/**
 * Numeric readout card. Drag anywhere on the card to scrub the value
 * (Shift = ×10, Alt = ×0.1); a plain click opens inline text entry.
 */
export const NumberControl = defineComponent({
  name: 'DialKitNumberControl',
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    /** Optional bounds. Unlike Slider, an unbounded number is a first-class use. */
    min: { type: Number, required: false, default: undefined },
    max: { type: Number, required: false, default: undefined },
    step: { type: Number, required: false },
    unit: { type: String, required: false },
    /** Override the displayed value text; `unit` is not auto-appended. */
    formatValue: { type: Function as PropType<(value: number) => string>, default: undefined },
    /** `vertical` stacks the label above a centered value (column card). */
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const step = computed(() => props.step ?? 0.01);
    const isVertical = computed(() => props.orientation === 'vertical');

    const inputRef = ref<HTMLInputElement | null>(null);
    const isScrubbing = ref(false);
    const showInput = ref(false);
    const inputValue = ref('');

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

    const handlePointerDown = (event: PointerEvent) => {
      if (showInput.value) return;
      event.preventDefault();
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      pointerDownPos = { x: event.clientX, y: event.clientY };
      isClickFlag = true;
      isPointerHeld = true;
      scrubStartValue = props.value;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isPointerHeld || !pointerDownPos) return;

      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (isClickFlag && distance > CLICK_THRESHOLD) {
        isClickFlag = false;
        isScrubbing.value = true;
      }

      if (!isClickFlag) {
        // Horizontal card scrubs on X (right = up); vertical card on Y (up = up).
        const travel = isVertical.value ? -dy : dx;
        const perPixel = step.value * (event.shiftKey ? 10 : event.altKey ? 0.1 : 1);
        const next = clamp(scrubStartValue + travel * perPixel);
        emit('change', roundValue(next, step.value));
      }
    };

    const handlePointerUp = () => {
      if (!isPointerHeld) return;
      if (isClickFlag) {
        showInput.value = true;
        inputValue.value = props.value.toFixed(decimalsForStep(step.value));
      }
      isPointerHeld = false;
      pointerDownPos = null;
      isScrubbing.value = false;
    };

    watch(showInput, async (visible) => {
      if (!visible) return;
      await nextTick();
      inputRef.value?.focus();
      inputRef.value?.select();
    });

    const handleInputSubmit = () => {
      const parsed = parseFloat(inputValue.value);
      if (!Number.isNaN(parsed)) {
        emit('change', roundValue(clamp(parsed), step.value));
      }
      showInput.value = false;
    };

    const handleInputKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleInputSubmit();
      } else if (event.key === 'Escape') {
        showInput.value = false;
      }
    };

    const displayValue = computed(() =>
      props.formatValue
        ? props.formatValue(props.value)
        : props.value.toFixed(decimalsForStep(step.value))
    );

    const className = computed(() =>
      [
        'dialkit-number-control',
        isVertical.value ? 'dialkit-number-control-vertical' : '',
        isScrubbing.value ? 'dialkit-number-control-engaged' : '',
      ]
        .filter(Boolean)
        .join(' ')
    );

    return () => h('div', {
      class: className.value,
      onPointerdown: handlePointerDown,
      onPointermove: handlePointerMove,
      onPointerup: handlePointerUp,
    }, [
      h('span', { class: 'dialkit-number-label' }, props.label),
      showInput.value
        ? h('input', {
            ref: inputRef,
            type: 'text',
            class: 'dialkit-number-input',
            value: inputValue.value,
            onInput: (event: Event) => {
              inputValue.value = (event.target as HTMLInputElement).value;
            },
            onKeydown: handleInputKeydown,
            onBlur: handleInputSubmit,
            onClick: (event: MouseEvent) => event.stopPropagation(),
            onPointerdown: (event: PointerEvent) => event.stopPropagation(),
          })
        : h('span', { class: 'dialkit-number-value' }, [
            displayValue.value,
            props.unit ? h('span', { class: 'dialkit-number-unit' }, props.unit) : null,
          ]),
    ]);
  },
});
