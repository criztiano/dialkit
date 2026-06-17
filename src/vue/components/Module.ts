import { defineComponent, h, ref, type PropType } from 'vue';
import { ICON_CHEVRON } from '../../icons';
import { SegmentedControl } from './SegmentedControl';

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. When disabled the body collapses away
 * with a smooth height transition; the right-aligned chevron also collapses
 * it manually while enabled.
 */
export const Module = defineComponent({
  name: 'DialKitModule',
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    defaultOpen: { type: Boolean, default: true },
    collapsible: { type: Boolean, default: true },
    onEnabledChange: { type: Function as PropType<(enabled: boolean) => void>, default: undefined },
  },
  emits: ['enabledChange'],
  setup(props, { emit, slots }) {
    const isOpen = ref(props.defaultOpen);
    const expanded = () => (props.collapsible ? isOpen.value : true);
    const visible = () => props.enabled && expanded();
    const toggleOpen = () => {
      if (props.collapsible) isOpen.value = !isOpen.value;
    };
    const setEnabled = (enabled: boolean) => {
      props.onEnabledChange?.(enabled);
      emit('enabledChange', enabled);
    };

    return () =>
      h('div', { class: 'dialkit-module' }, [
        h(
          'div',
          {
            class: 'dialkit-module-header',
            style: { cursor: props.collapsible ? 'pointer' : 'default' },
            onClick: toggleOpen,
          },
          [
            h('span', { class: 'dialkit-module-title' }, props.title),
            h(
              'div',
              {
                class: 'dialkit-module-switch',
                onClick: (event: Event) => event.stopPropagation(),
              },
              [
                h(SegmentedControl, {
                  options: [
                    { value: 'off', label: 'Off' },
                    { value: 'on', label: 'On' },
                  ],
                  value: props.enabled ? 'on' : 'off',
                  onChange: (value: string) => setEnabled(value === 'on'),
                }),
              ]
            ),
            props.collapsible
              ? h(
                  'svg',
                  {
                    class: `dialkit-module-icon${visible() ? '' : ' dialkit-module-icon-collapsed'}`,
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2.5',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  [h('path', { d: ICON_CHEVRON })]
                )
              : null,
          ]
        ),
        h('div', { class: 'dialkit-module-collapse', 'data-open': visible() }, [
          h('div', { class: 'dialkit-module-collapse-clip' }, [
            h('div', { class: 'dialkit-module-inner' }, slots.default ? slots.default() : []),
          ]),
        ]),
      ]);
  },
});
