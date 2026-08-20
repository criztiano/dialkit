import { Teleport, defineComponent, h, ref, watch, type PropType } from 'vue';
import { AnimatePresence, motion } from 'motion-v';
import { ICON_CHEVRON, ICON_TRASH } from '../../icons';
import { TweakStore } from '../../store/TweakStore';

// Structural on purpose: stock Preset[] and provider-derived PresetItem[]
// both fit. `deletable` defaults to true so stock callers stay unchanged.
type PresetRow = { id: string; name: string; deletable?: boolean };

export const PresetManager = defineComponent({
  name: 'TweakersPresetManager',
  props: {
    panelId: { type: String, required: true },
    presets: {
      type: Array as PropType<PresetRow[]>,
      required: true,
    },
    activePresetId: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode: { type: Boolean, default: false },
  },
  setup(props) {
    const isOpen = ref(false);
    const pos = ref({ top: 0, left: 0, width: 0 });

    const triggerRef = ref<HTMLElement | null>(null);
    const dropdownRef = ref<HTMLElement | null>(null);

    const hasPresets = () => props.presets.length > 0;
    const activePreset = () => props.presets.find((preset) => preset.id === props.activePresetId);

    const open = () => {
      if (!hasPresets()) return;
      const rect = triggerRef.value?.getBoundingClientRect();
      if (rect) {
        pos.value = { top: rect.bottom + 4, left: rect.left, width: rect.width };
      }
      isOpen.value = true;
    };

    const close = () => {
      isOpen.value = false;
    };

    const setDropdownRef = (node: unknown) => {
      if (node instanceof HTMLElement) {
        dropdownRef.value = node;
        return;
      }

      if (node && typeof node === 'object' && '$el' in node) {
        const el = (node as { $el?: unknown }).$el;
        dropdownRef.value = el instanceof HTMLElement ? el : null;
        return;
      }

      dropdownRef.value = null;
    };

    const toggle = () => {
      if (isOpen.value) close();
      else open();
    };

    watch(isOpen, (open, _, onCleanup) => {
      if (!open) return;

      const handler = (event: MouseEvent) => {
        const target = event.target as Node;
        if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
        close();
      };

      document.addEventListener('mousedown', handler);
      onCleanup(() => {
        document.removeEventListener('mousedown', handler);
      });
    });

    const handleSelect = (presetId: string | null) => {
      TweakStore.selectPreset(props.panelId, presetId);
      close();
    };

    const handleDelete = (event: MouseEvent, presetId: string) => {
      event.stopPropagation();
      TweakStore.removePreset(props.panelId, presetId);
    };

    return () => h('div', { class: 'tweakers-preset-manager' }, [
      h('button', {
        ref: triggerRef,
        class: 'tweakers-preset-trigger',
        onClick: toggle,
        'data-open': String(isOpen.value),
        'data-has-preset': String(!!activePreset()),
        'data-disabled': String(!hasPresets()),
      }, [
        h('span', { class: 'tweakers-preset-label' }, activePreset()?.name ?? (props.providerMode ? 'Presets' : 'Version 1')),
        h(motion.svg, {
          class: 'tweakers-select-chevron',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2.5',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          animate: { rotate: isOpen.value ? 180 : 0, opacity: hasPresets() ? 0.6 : 0.25 },
          transition: { type: 'spring', visualDuration: 0.2, bounce: 0.15 },
        }, [h('path', { d: ICON_CHEVRON })]),
      ]),

      h(Teleport, { to: 'body' }, [
        h(AnimatePresence, null, {
          default: () => isOpen.value
            ? [h(motion.div, {
              key: 'tweakers-preset-dropdown',
              ref: setDropdownRef,
              class: 'tweakers-root tweakers-preset-dropdown',
              style: {
                position: 'fixed',
                top: `${pos.value.top}px`,
                left: `${pos.value.left}px`,
                minWidth: `${pos.value.width}px`,
              },
              initial: { opacity: 0, y: 4, scale: 0.97 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: 'none' },
              transition: { type: 'spring', visualDuration: 0.15, bounce: 0 },
            }, [
              ...(props.providerMode ? [] : [h('div', {
                class: 'tweakers-preset-item',
                'data-active': String(!props.activePresetId),
                onClick: () => handleSelect(null),
              }, [h('span', { class: 'tweakers-preset-name' }, 'Version 1')])]),

              ...props.presets.map((preset) => h('div', {
                key: preset.id,
                class: 'tweakers-preset-item',
                'data-active': String(preset.id === props.activePresetId),
                onClick: () => handleSelect(preset.id),
              }, [
                h('span', { class: 'tweakers-preset-name' }, preset.name),
                ...((preset.deletable ?? true) ? [h('button', {
                  class: 'tweakers-preset-delete',
                  onClick: (event: MouseEvent) => handleDelete(event, preset.id),
                  title: 'Delete preset',
                }, [
                  h('svg', {
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  }, ICON_TRASH.map((d) => h('path', { d }))),
                ])] : []),
              ])),
            ])]
            : [],
        }),
      ]),
    ]);
  },
});
