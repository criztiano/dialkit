import { Teleport, defineComponent, h, nextTick, onMounted, ref, watch } from 'vue';
import { AnimatePresence, motion } from 'motion-v';
import { ColorPickerPanel } from './ColorPickerPanel';
import { parseHex, normalizeHex, bareHex, opacityPercent } from '../../color-core';

const PICKER_WIDTH = 240;
// Estimated open heights for the above/below flip (SV area + sliders + fields + padding).
const PICKER_BASE_HEIGHT = 270;
const PICKER_ALPHA_HEIGHT = 22;
const PICKER_PALETTE_HEIGHT = 30;

export const ColorControl = defineComponent({
  name: 'DialKitColorControl',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    alpha: { type: Boolean, default: false },
    palette: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const editValue = ref(bareHex(props.value));
    const isOpen = ref(false);
    const pos = ref<{ top: number; left: number; above: boolean } | null>(null);
    const portalTarget = ref<HTMLElement | null>(null);

    const swatchRef = ref<HTMLElement | null>(null);
    const pickerRef = ref<HTMLElement | null>(null);
    const hexInputRef = ref<HTMLInputElement | null>(null);

    // Sync editValue when value changes externally (edited without the '#' —
    // it renders as a fixed symbol; normalizeHex tolerates pasted '#…' anyway)
    watch(() => props.value, (value) => {
      if (!isEditing.value) editValue.value = bareHex(value);
    });

    // React's autoFocus focuses on mount; Vue's autofocus attribute doesn't
    // for dynamically inserted inputs, so focus explicitly once it renders.
    // Select-all so a paste replaces the value outright.
    watch(isEditing, async (editing) => {
      if (!editing) return;
      await nextTick();
      hexInputRef.value?.focus();
      hexInputRef.value?.select();
    });

    const updatePos = () => {
      const el = swatchRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pickerHeight =
        PICKER_BASE_HEIGHT + (props.alpha ? PICKER_ALPHA_HEIGHT : 0) + (props.palette ? PICKER_PALETTE_HEIGHT : 0);
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
      const left = Math.max(8, rect.right - PICKER_WIDTH);
      pos.value = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
    };

    const openPicker = () => {
      updatePos();
      isOpen.value = true;
    };

    const closePicker = () => {
      isOpen.value = false;
    };

    const togglePicker = () => {
      if (isOpen.value) closePicker();
      else openPicker();
    };

    const setPickerRef = (node: unknown) => {
      if (node instanceof HTMLElement) {
        pickerRef.value = node;
        return;
      }

      if (node && typeof node === 'object' && '$el' in node) {
        const el = (node as { $el?: unknown }).$el;
        pickerRef.value = el instanceof HTMLElement ? el : null;
        return;
      }

      pickerRef.value = null;
    };

    watch(isOpen, (open, _, onCleanup) => {
      if (!open) return;

      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (swatchRef.value?.contains(target) || pickerRef.value?.contains(target)) return;
        closePicker();
      };
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closePicker();
          swatchRef.value?.focus();
        }
      };

      updatePos();
      document.addEventListener('mousedown', handleDocumentClick);
      document.addEventListener('keydown', handleKeydown);
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('scroll', handleViewportChange, true);

      onCleanup(() => {
        document.removeEventListener('mousedown', handleDocumentClick);
        document.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('scroll', handleViewportChange, true);
      });
    });

    onMounted(() => {
      const root = swatchRef.value?.closest('.dialkit-root') as HTMLElement | null;
      portalTarget.value = root ?? document.body;
    });

    const submitText = () => {
      isEditing.value = false;
      const normalized = normalizeHex(editValue.value, props.alpha);
      if (normalized) {
        emit('change', normalized);
      } else {
        editValue.value = bareHex(props.value);
      }
    };

    return () => {
      const rgba = parseHex(props.value);

      return h('div', { class: 'dialkit-color-control' }, [
        h('span', { class: 'dialkit-color-label' }, props.label),
        h('div', { class: 'dialkit-color-inputs' }, [
          h('button', {
            ref: swatchRef,
            class: 'dialkit-color-swatch',
            style: { '--swatch-color': props.value },
            'data-open': String(isOpen.value),
            title: 'Pick color',
            'aria-label': `Pick color for ${props.label}`,
            'aria-expanded': isOpen.value,
            onClick: togglePicker,
          }),
          h('span', { class: 'dialkit-color-hex-wrap' }, [
            h('span', { class: 'dialkit-color-hash', 'aria-hidden': 'true' }, '#'),
            isEditing.value
              ? h('input', {
                ref: hexInputRef,
                type: 'text',
                class: 'dialkit-color-hex-input',
                value: editValue.value,
                onInput: (event: Event) => {
                  editValue.value = (event.target as HTMLInputElement).value;
                },
                onBlur: submitText,
                onKeydown: (event: KeyboardEvent) => {
                  if (event.key === 'Enter') {
                    submitText();
                  } else if (event.key === 'Escape') {
                    // Cancel only the edit — don't let the document handler close the popover too.
                    event.stopPropagation();
                    isEditing.value = false;
                    editValue.value = bareHex(props.value);
                  }
                },
              })
              : h('span', {
                class: 'dialkit-color-hex',
                onClick: () => {
                  isEditing.value = true;
                },
              }, bareHex(props.value)),
          ]),
          ...(props.alpha && rgba
            ? [
              h('span', { class: 'dialkit-color-divider', 'aria-hidden': 'true' }),
              h('span', { class: 'dialkit-color-opacity' }, [
                `${opacityPercent(rgba)} `,
                h('span', { class: 'dialkit-color-opacity-unit' }, '%'),
              ]),
            ]
            : []),
        ]),
        portalTarget.value
          ? h(Teleport, { to: portalTarget.value }, [
            h(AnimatePresence, null, {
              default: () => (isOpen.value && pos.value)
                ? [h(motion.div, {
                  key: 'dialkit-color-picker-popover',
                  ref: setPickerRef,
                  class: 'dialkit-color-picker-popover',
                  initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
                  transition: { type: 'spring', visualDuration: 0.15, bounce: 0 },
                  style: {
                    position: 'fixed',
                    left: `${pos.value.left}px`,
                    width: `${PICKER_WIDTH}px`,
                    ...(pos.value.above
                      ? {
                        bottom: `${window.innerHeight - pos.value.top}px`,
                        transformOrigin: 'bottom right',
                      }
                      : {
                        top: `${pos.value.top}px`,
                        transformOrigin: 'top right',
                      }),
                  },
                }, [
                  h(ColorPickerPanel, {
                    value: props.value,
                    alpha: props.alpha,
                    palette: props.palette,
                    onChange: (next: string) => emit('change', next),
                  }),
                ])]
                : [],
            }),
          ])
          : null,
      ]);
    };
  },
});
