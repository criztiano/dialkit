import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue';
import { SegmentedControl } from './SegmentedControl';
import {
  parseHex,
  formatHex,
  normalizeHex,
  rgbToHsv,
  hsvToRgb,
  getChannels,
  rgbaToChannels,
  channelsToRgba,
  opacityPercent,
  emptyPalette,
  LONG_PRESS_MS,
  PALETTE_DRAG_CANCEL_PX,
  PALETTE_SIZE,
  type ColorFormat,
  type HSVA,
  type ChannelSpec,
  type PaletteSlots,
} from '../../color-core';
import { loadPalette, savePalette, subscribePalette } from '../../color-palette-store';

const FORMAT_OPTIONS: { value: ColorFormat; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'oklch', label: 'OKLCH' },
];

// The format choice follows the user across pickers within a session —
// switching to OKLCH once shouldn't need repeating per control.
let stickyFormat: ColorFormat = 'hex';

const BLACK: HSVA = { h: 0, s: 0, v: 0, a: 1 };

const HEX_ALPHA_SPEC: ChannelSpec = { key: 'a', label: 'A', min: 0, max: 100, step: 1, precision: 0 };

/** Shared drag surface: pointer-capture + normalized 0–1 coordinates. */
function useAreaDrag(onPoint: (x: number, y: number) => void) {
  const elRef = ref<HTMLElement | null>(null);
  let dragging = false;

  const readPoint = (e: PointerEvent) => {
    const el = elRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    onPoint(x, y);
  };

  const endDrag = () => {
    dragging = false;
  };

  const handlers = {
    onPointerdown: (e: PointerEvent) => {
      e.preventDefault();
      elRef.value?.setPointerCapture(e.pointerId);
      dragging = true;
      readPoint(e);
    },
    onPointermove: (e: PointerEvent) => {
      // Insurance against lost pointer capture: no buttons down means no drag.
      if (dragging && e.buttons === 0) {
        dragging = false;
        return;
      }
      if (dragging) readPoint(e);
    },
    onPointerup: endDrag,
    onPointercancel: endDrag,
  };

  return { elRef, handlers };
}

/**
 * One numeric channel field. Holds a draft string while focused so partial
 * typing ("25" on the way to "255") never round-trips through the color.
 */
const ChannelField = defineComponent({
  name: 'DialKitColorChannelField',
  props: {
    spec: { type: Object as PropType<ChannelSpec>, required: true },
    value: { type: Number, required: true },
  },
  emits: ['commit'],
  setup(props, { emit }) {
    const draft = ref<string | null>(null);

    const commit = () => {
      if (draft.value !== null) emit('commit', Number(draft.value));
      draft.value = null;
    };

    return () => h('label', { class: 'dialkit-color-field' }, [
      h('input', {
        type: 'text',
        inputmode: 'decimal',
        value: draft.value ?? String(props.value),
        onFocus: (e: FocusEvent) => {
          draft.value = String(props.value);
          (e.target as HTMLInputElement).select();
        },
        onInput: (e: Event) => {
          draft.value = (e.target as HTMLInputElement).value;
        },
        onBlur: commit,
        onKeydown: (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            commit();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            e.stopPropagation();
            draft.value = null;
            (e.target as HTMLInputElement).blur();
          }
        },
      }),
      h('span', { class: 'dialkit-color-field-label' }, props.spec.label),
    ]);
  },
});

const HexField = defineComponent({
  name: 'DialKitColorHexField',
  props: {
    value: { type: String, required: true },
    alpha: { type: Boolean, required: true },
  },
  emits: ['commit'],
  setup(props, { emit }) {
    const draft = ref<string | null>(null);

    const commit = () => {
      if (draft.value !== null) {
        const normalized = normalizeHex(draft.value, props.alpha);
        if (normalized) emit('commit', normalized);
      }
      draft.value = null;
    };

    return () => h('label', { class: 'dialkit-color-field dialkit-color-field-hex' }, [
      h('input', {
        type: 'text',
        spellcheck: false,
        value: (draft.value ?? props.value).toUpperCase(),
        onFocus: (e: FocusEvent) => {
          draft.value = props.value;
          (e.target as HTMLInputElement).select();
        },
        onInput: (e: Event) => {
          draft.value = (e.target as HTMLInputElement).value;
        },
        onBlur: commit,
        onKeydown: (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            commit();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            e.stopPropagation();
            draft.value = null;
            (e.target as HTMLInputElement).blur();
          }
        },
      }),
      h('span', { class: 'dialkit-color-field-label' }, 'HEX'),
    ]);
  },
});

const PaletteSlot = defineComponent({
  name: 'DialKitColorPaletteSlot',
  props: {
    color: { type: String as PropType<string | null>, default: null },
  },
  emits: ['save', 'apply', 'clear'],
  setup(props, { emit }) {
    const holding = ref(false);
    let timer: ReturnType<typeof setTimeout> | null = null;
    let origin: { x: number; y: number } | null = null;
    let fired = false;

    const cancelHold = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      origin = null;
      holding.value = false;
    };

    onBeforeUnmount(cancelHold);

    return () => h('button', {
      class: 'dialkit-color-palette-slot',
      'data-filled': String(props.color !== null),
      'data-holding': String(holding.value),
      style: props.color ? { '--swatch-color': props.color } : undefined,
      title: props.color ? `${props.color.toUpperCase()} — click to apply, hold to clear` : 'Save current color',
      onContextmenu: (e: MouseEvent) => e.preventDefault(),
      onPointerdown: (e: PointerEvent) => {
        // Always reset first: a new press is never a stale long-press echo.
        fired = false;
        if (!props.color) return;
        origin = { x: e.clientX, y: e.clientY };
        holding.value = true;
        timer = setTimeout(() => {
          fired = true;
          cancelHold();
          emit('clear');
        }, LONG_PRESS_MS);
      },
      onPointermove: (e: PointerEvent) => {
        if (!origin) return;
        if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > PALETTE_DRAG_CANCEL_PX) {
          cancelHold();
        }
      },
      onPointerup: cancelHold,
      onPointerleave: cancelHold,
      onPointercancel: cancelHold,
      onClick: () => {
        // A completed long-press consumes the click that follows it.
        if (fired) {
          fired = false;
          return;
        }
        if (props.color) emit('apply');
        else emit('save');
      },
    });
  },
});

export const ColorPickerPanel = defineComponent({
  name: 'DialKitColorPickerPanel',
  props: {
    value: { type: String, required: true },
    alpha: { type: Boolean, default: false },
    palette: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const initialRgba = parseHex(props.value);
    const hsva = ref<HSVA>(initialRgba ? rgbToHsv(initialRgba) : { ...BLACK });
    const format = ref<ColorFormat>(stickyFormat);
    const slots = ref<PaletteSlots>(props.palette ? loadPalette() : emptyPalette());
    let lastEmitted = props.value;

    // External value changes (preset restore, config edit) re-derive the working
    // state; our own emissions don't, so the SV thumb keeps hue/sat at black/white.
    watch(() => props.value, (value) => {
      if (value === lastEmitted) return;
      lastEmitted = value;
      const rgba = parseHex(value);
      if (rgba) hsva.value = rgbToHsv(rgba);
    });

    let unsubscribePalette: (() => void) | undefined;
    onMounted(() => {
      if (props.palette) {
        unsubscribePalette = subscribePalette((next) => {
          slots.value = next;
        });
      }
    });
    onBeforeUnmount(() => unsubscribePalette?.());

    const emitColor = (next: HSVA) => {
      hsva.value = next;
      const hex = formatHex(hsvToRgb(next), props.alpha);
      lastEmitted = hex;
      emit('change', hex);
    };

    const applyHex = (hex: string) => {
      const rgba = parseHex(hex);
      if (!rgba) return;
      const normalized = formatHex(rgba, props.alpha);
      hsva.value = rgbToHsv(rgba);
      lastEmitted = normalized;
      emit('change', normalized);
    };

    const svDrag = useAreaDrag((x, y) => emitColor({ ...hsva.value, s: x, v: 1 - y }));
    const hueDrag = useAreaDrag((x) => emitColor({ ...hsva.value, h: Math.min(x * 360, 359.999) }));
    const alphaDrag = useAreaDrag((x) => emitColor({ ...hsva.value, a: x }));

    const rgba = computed(() => hsvToRgb(hsva.value));
    const opaqueHex = computed(() => formatHex(rgba.value, false));
    const currentHex = computed(() => formatHex(rgba.value, props.alpha));
    const channelSpecs = computed(() => (format.value === 'hex' ? [] : getChannels(format.value, props.alpha)));
    const channelValues = computed(() => (format.value === 'hex' ? [] : rgbaToChannels(rgba.value, format.value, props.alpha)));

    const commitChannel = (index: number, n: number) => {
      const next = [...channelValues.value];
      next[index] = n;
      const committed = channelsToRgba(next, format.value as Exclude<ColorFormat, 'hex'>, props.alpha);
      const nextHsva = rgbToHsv(committed);
      // Hue/saturation are meaningless on grays; keep the current ones so the
      // SV thumb doesn't jump when a channel edit lands on black/white.
      if (nextHsva.s === 0) nextHsva.h = hsva.value.h;
      if (nextHsva.v === 0) nextHsva.s = hsva.value.s;
      emitColor(nextHsva);
    };

    return () => h('div', {
      class: 'dialkit-color-picker',
      style: { '--picker-hue': String(hsva.value.h) },
    }, [
      h('div', {
        class: 'dialkit-color-sv',
        ref: svDrag.elRef,
        ...svDrag.handlers,
      }, [
        h('div', {
          class: 'dialkit-color-sv-thumb',
          style: {
            left: `${hsva.value.s * 100}%`,
            top: `${(1 - hsva.value.v) * 100}%`,
            background: opaqueHex.value,
          },
        }),
      ]),

      h('div', {
        class: 'dialkit-color-slider dialkit-color-hue',
        ref: hueDrag.elRef,
        ...hueDrag.handlers,
      }, [
        h('div', {
          class: 'dialkit-color-slider-thumb',
          style: {
            left: `${(hsva.value.h / 360) * 100}%`,
            background: `hsl(${hsva.value.h} 100% 50%)`,
          },
        }),
      ]),

      props.alpha
        ? h('div', {
          class: 'dialkit-color-slider dialkit-color-alpha dialkit-checker',
          ref: alphaDrag.elRef,
          ...alphaDrag.handlers,
        }, [
          h('div', {
            class: 'dialkit-color-alpha-gradient',
            style: { background: `linear-gradient(to right, transparent, ${opaqueHex.value})` },
          }),
          h('div', {
            class: 'dialkit-color-slider-thumb',
            style: {
              left: `${hsva.value.a * 100}%`,
              background: opaqueHex.value,
              opacity: String(Math.max(hsva.value.a, 0.15)),
            },
          }),
        ])
        : null,

      h(SegmentedControl, {
        options: FORMAT_OPTIONS,
        value: format.value,
        onChange: (f: ColorFormat) => {
          stickyFormat = f;
          format.value = f;
        },
      }),

      h('div', { class: 'dialkit-color-fields', 'data-format': format.value }, format.value === 'hex'
        ? [
          h(HexField, {
            value: currentHex.value,
            alpha: props.alpha,
            onCommit: (hex: string) => applyHex(hex),
          }),
          props.alpha
            ? h(ChannelField, {
              spec: HEX_ALPHA_SPEC,
              value: opacityPercent(rgba.value),
              onCommit: (n: number) => emitColor({ ...hsva.value, a: Math.min(1, Math.max(0, n / 100)) }),
            })
            : null,
        ]
        : channelSpecs.value.map((spec, i) => h(ChannelField, {
          key: `${format.value}-${spec.key}`,
          spec,
          value: channelValues.value[i],
          onCommit: (n: number) => commitChannel(i, n),
        }))),

      props.palette
        ? h('div', { class: 'dialkit-color-palette' }, Array.from({ length: PALETTE_SIZE }, (_, i) => h(PaletteSlot, {
          key: i,
          color: slots.value[i] ?? null,
          // Read the store at commit time — a 500ms hold is long enough for
          // another panel or tab to have rewritten the palette underneath.
          onSave: () => savePalette(loadPalette().map((s, j) => (j === i ? currentHex.value : s))),
          onApply: () => {
            const saved = slots.value[i];
            if (saved) applyHex(saved);
          },
          onClear: () => savePalette(loadPalette().map((s, j) => (j === i ? null : s))),
        })))
        : null,
    ]);
  },
});
