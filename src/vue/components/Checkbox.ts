import { defineComponent, h } from 'vue';

/**
 * A compact tri-state box: on (a filled chip), off (a slash), and disabled
 * (a dash).
 *
 * This replaces the Off/On segmented pair for boolean rows and module
 * headers. A two-tab switch spends ~84px and a whole row of attention on
 * one bit; a box spends 22px and reads instantly. The segmented control
 * stays where it belongs — three or more genuinely different modes.
 *
 * All three marks are always in the DOM; CSS reveals one from the data
 * attributes, so the state swap animates without any motion code.
 */
export const Checkbox = defineComponent({
  name: 'DialKitCheckbox',
  props: {
    checked: { type: Boolean, required: true },
    /** Accessible name — the visible label is rendered by the caller. */
    label: { type: String, default: undefined },
    /** The control exists but cannot act right now: reads as a dash, not a
     *  blank box, so "unavailable" never looks like "off". */
    disabled: { type: Boolean, default: false },
    id: { type: String, default: undefined },
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          id: props.id,
          role: 'checkbox',
          'aria-checked': props.disabled ? 'mixed' : String(props.checked),
          'aria-label': props.label,
          'aria-disabled': props.disabled || undefined,
          class: 'dialkit-checkbox',
          'data-checked': props.checked && !props.disabled ? 'true' : undefined,
          'data-disabled': props.disabled ? 'true' : undefined,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            if (!props.disabled) emit('change', !props.checked);
          },
        },
        [
          h('svg', { viewBox: '0 0 22 22', width: 22, height: 22, 'aria-hidden': 'true' }, [
            h('path', { class: 'dialkit-checkbox-slash', d: 'M6 16 16 6', fill: 'none' }),
            h('rect', {
              class: 'dialkit-checkbox-chip',
              x: 5,
              y: 5,
              width: 12,
              height: 12,
              rx: 2,
            }),
            h('path', { class: 'dialkit-checkbox-dash', d: 'M6 11h10', fill: 'none' }),
          ]),
        ]
      );
  },
});
