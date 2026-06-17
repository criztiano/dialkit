import { defineComponent, h, ref, type PropType } from 'vue';
import { ICON_CHEVRON } from '../../icons';
import { SegmentedControl } from './SegmentedControl';

/**
 * A titled, collapsible group whose header carries an enable switch — for
 * parameter blocks that can be turned on/off as a unit. The body stays
 * interactive while disabled (it only dims).
 */
export const Section = defineComponent({
  name: 'DialKitSection',
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    defaultOpen: { type: Boolean, default: true },
    collapsible: { type: Boolean, default: true },
    dimWhenDisabled: { type: Boolean, default: true },
    onEnabledChange: { type: Function as PropType<(enabled: boolean) => void>, default: undefined },
  },
  emits: ['enabledChange'],
  setup(props, { emit, slots }) {
    const isOpen = ref(props.defaultOpen);
    const open = () => (props.collapsible ? isOpen.value : true);
    const toggleOpen = () => {
      if (props.collapsible) isOpen.value = !isOpen.value;
    };
    const setEnabled = (enabled: boolean) => {
      props.onEnabledChange?.(enabled);
      emit('enabledChange', enabled);
    };

    return () =>
      h('div', { class: 'dialkit-section' }, [
        h('div', { class: 'dialkit-section-header' }, [
          h(
            'div',
            {
              class: 'dialkit-section-title-row',
              style: { cursor: props.collapsible ? 'pointer' : 'default' },
              onClick: toggleOpen,
            },
            [
              props.collapsible
                ? h(
                    'svg',
                    {
                      class: `dialkit-section-icon${open() ? '' : ' dialkit-section-icon-collapsed'}`,
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
              h('span', { class: 'dialkit-section-title' }, props.title),
            ]
          ),
          h(
            'div',
            {
              class: 'dialkit-section-switch',
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
        ]),
        open()
          ? h(
              'div',
              {
                class: `dialkit-section-content${
                  props.dimWhenDisabled && !props.enabled ? ' dialkit-section-disabled' : ''
                }`,
              },
              [h('div', { class: 'dialkit-section-inner' }, slots.default ? slots.default() : [])]
            )
          : null,
      ]);
  },
});
