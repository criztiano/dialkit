import { defineComponent, h, ref, type PropType } from 'vue';
import { Checkbox } from './Checkbox';

/**
 * A config-level module: a folder that declared `_enabled`. Same idiom as the
 * standalone Module — the header switch doubles as the expand control and the
 * body collapses away with the grid-rows height transition when off (see
 * theme.css). On top of that, clicking the header toggles the open state while
 * enabled, so `_collapsed` still controls how the section starts.
 */
export const ModuleFolder = defineComponent({
  name: 'DialKitModuleFolder',
  props: {
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    onEnabledChange: { type: Function as PropType<(enabled: boolean) => void>, default: undefined },
    defaultOpen: { type: Boolean, default: true },
    hint: { type: String, default: undefined },
    hintId: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const isOpen = ref(props.defaultOpen);

    const setEnabled = (enabled: boolean) => {
      props.onEnabledChange?.(enabled);
      // Turning on always reveals the body — a switch that lands on a still-
      // collapsed section would read as broken.
      if (enabled) isOpen.value = true;
    };

    return () =>
      h('div', { class: 'dialkit-module dialkit-module-folder', 'data-open': props.enabled && isOpen.value ? 'true' : 'false' }, [
        h(
          'div',
          {
            class: 'dialkit-module-header dialkit-module-header-toggle',
            onClick: () => { if (props.enabled) isOpen.value = !isOpen.value; },
            'data-hint': props.hint ? 'true' : undefined,
            'aria-describedby': props.hint ? props.hintId : undefined,
          },
          [
            h(Checkbox, {
              checked: props.enabled,
              label: props.title,
              onChange: (next: boolean) => setEnabled(next),
            }),
            h('span', { class: 'dialkit-module-title' }, props.title),
            ...(props.hint
              ? [h('span', { class: 'dialkit-hint', id: props.hintId, role: 'tooltip' }, props.hint)]
              : []),
          ]
        ),
        h('div', { class: 'dialkit-module-collapse', 'data-open': props.enabled && isOpen.value }, [
          h('div', { class: 'dialkit-module-collapse-clip' }, [
            h('div', { class: 'dialkit-module-inner' }, slots.default ? slots.default() : []),
          ]),
        ]),
      ]);
  },
});
