import { defineComponent, h, type PropType } from 'vue';
import { Checkbox } from './Checkbox';

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. The switch doubles as the expand
 * control: disabling collapses the body away with a smooth height transition.
 */
export const Module = defineComponent({
  name: 'TweakersModule',
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
      h('div', { class: 'tweakers-module' }, [
        h('div', { class: 'tweakers-module-header' }, [
          h(Checkbox, {
            checked: props.enabled,
            label: props.title,
            onChange: (next: boolean) => setEnabled(next),
          }),
          h('span', { class: 'tweakers-module-title' }, props.title),
        ]),
        h('div', { class: 'tweakers-module-collapse', 'data-open': props.enabled }, [
          h('div', { class: 'tweakers-module-collapse-clip' }, [
            h('div', { class: 'tweakers-module-inner' }, slots.default ? slots.default() : []),
          ]),
        ]),
      ]);
  },
});
