import { defineComponent, h, type PropType } from 'vue';
import { SegmentedControl } from './SegmentedControl';

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. The switch doubles as the expand
 * control: disabling collapses the body away with a smooth height transition.
 */
export const Module = defineComponent({
  name: 'DialKitModule',
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    onEnabledChange: { type: Function as PropType<(enabled: boolean) => void>, default: undefined },
  },
  emits: ['enabledChange'],
  setup(props, { emit, slots }) {
    const setEnabled = (enabled: boolean) => {
      props.onEnabledChange?.(enabled);
      emit('enabledChange', enabled);
    };

    return () =>
      h('div', { class: 'dialkit-module' }, [
        h('div', { class: 'dialkit-module-header' }, [
          h('span', { class: 'dialkit-module-title' }, props.title),
          h('div', { class: 'dialkit-module-switch' }, [
            h(SegmentedControl, {
              options: [
                { value: 'off', label: 'Off' },
                { value: 'on', label: 'On' },
              ],
              value: props.enabled ? 'on' : 'off',
              onChange: (value: string) => setEnabled(value === 'on'),
            }),
          ]),
        ]),
        h('div', { class: 'dialkit-module-collapse', 'data-open': props.enabled }, [
          h('div', { class: 'dialkit-module-collapse-clip' }, [
            h('div', { class: 'dialkit-module-inner' }, slots.default ? slots.default() : []),
          ]),
        ]),
      ]);
  },
});
