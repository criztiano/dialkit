import { defineComponent, h, type PropType } from 'vue';
import { Checkbox } from './Checkbox';
import type { ShortcutConfig } from '../../store/TweakStore';
import { formatToggleShortcut } from '../../shortcut-utils';

export const Toggle = defineComponent({
  name: 'TweakersToggle',
  props: {
    label: { type: String, required: true },
    checked: { type: Boolean, required: true },
    shortcut: { type: Object as PropType<ShortcutConfig>, default: undefined },
    shortcutActive: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () => h('div', { class: 'tweakers-labeled-control tweakers-labeled-control-check' }, [
      h(Checkbox, {
        checked: props.checked,
        label: props.label,
        onChange: (next: boolean) => emit('change', next),
      }),
      h('span', { class: 'tweakers-labeled-control-label' }, [
        props.label,
        props.shortcut
          ? h('span', {
              class: `tweakers-shortcut-pill${props.shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`,
            }, formatToggleShortcut(props.shortcut))
          : null,
      ]),
    ]);
  },
});
