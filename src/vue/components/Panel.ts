import { Fragment, defineComponent, h, onMounted, onUnmounted, ref, type PropType, type VNodeChild } from 'vue';
import { AnimatePresence, motion } from 'motion-v';
import { ICON_ADD_PRESET, ICON_CHECK, ICON_CLIPBOARD } from '../../icons';
import { DialStore } from '../../store/DialStore';
import type { DialValue, PanelConfig } from '../../store/DialStore';
import { Folder } from './Folder';
import { ControlRenderer } from './ControlRenderer';
import { PresetManager } from './PresetManager';

export const Panel = defineComponent({
  name: 'DialKitPanel',
  props: {
    panel: {
      type: Object as PropType<PanelConfig>,
      required: true,
    },
    defaultOpen: {
      type: Boolean,
      default: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    // Extra toolbar node injected after the built-in preset/copy controls —
    // used to surface the timeline visibility toggle in the panel header.
    toolbarExtra: Function as PropType<() => VNodeChild>,
  },
  setup(props) {
    const values = ref<Record<string, DialValue>>(DialStore.getValues(props.panel.id));
    const presets = ref(DialStore.getPresetItems(props.panel.id));
    const activePresetId = ref<string | null>(DialStore.getActivePresetId(props.panel.id));
    const providerMode = ref(DialStore.hasPresetProvider(props.panel.id));
    const copied = ref(false);

    let unsubscribe: (() => void) | undefined;
    let copiedTimeout: ReturnType<typeof window.setTimeout> | null = null;

    onMounted(() => {
      unsubscribe = DialStore.subscribe(props.panel.id, () => {
        values.value = DialStore.getValues(props.panel.id);
        presets.value = DialStore.getPresetItems(props.panel.id);
        activePresetId.value = DialStore.getActivePresetId(props.panel.id);
        providerMode.value = DialStore.hasPresetProvider(props.panel.id);
      });
    });

    onUnmounted(() => {
      unsubscribe?.();
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
    });

    const handleAddPreset = () => DialStore.createPreset(props.panel.id);

    const handleCopy = () => {
      const json = JSON.stringify(values.value, null, 2);
      const instruction = `Update the useDialKit configuration for "${props.panel.name}" with these values:\n\n\`\`\`json\n${json}\n\`\`\`\n\nApply these values as the new defaults in the useDialKit call.`;

      try {
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(instruction).catch(() => undefined);
        }
      } catch {
        // Ignore clipboard errors; the UI confirmation should still run.
      }

      copied.value = true;
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
      copiedTimeout = window.setTimeout(() => {
        copied.value = false;
      }, 1500);
    };

    return () => {
      const toolbarNode = h(Fragment, null, [
        h(motion.button, {
          class: 'dialkit-toolbar-add',
          onClick: handleAddPreset,
          title: 'Add preset',
          whilePress: { scale: 0.9 },
          transition: { type: 'spring', visualDuration: 0.15, bounce: 0.3 },
        }, [
          h('svg', {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }, ICON_ADD_PRESET.map((d) => h('path', { d }))),
        ]),
        h(PresetManager, {
          panelId: props.panel.id,
          presets: presets.value,
          activePresetId: activePresetId.value,
          providerMode: providerMode.value,
        }),
        h(motion.button, {
          class: 'dialkit-toolbar-copy',
          onClick: handleCopy,
          title: 'Copy parameters',
          whilePress: { scale: 0.95 },
          transition: { type: 'spring', visualDuration: 0.15, bounce: 0.3 },
        }, [
          h('span', { class: 'dialkit-toolbar-copy-icon-wrap' }, [
            h('span', {
              class: 'dialkit-toolbar-copy-icon',
              style: { opacity: copied.value ? 0 : 1, transition: 'opacity 120ms ease' },
            }, [
              h('svg', {
                viewBox: '0 0 24 24',
                fill: 'none',
                width: 16,
                height: 16,
              }, [
                h('path', {
                  d: ICON_CLIPBOARD.board,
                  stroke: 'currentColor',
                  'stroke-width': 2,
                  'stroke-linejoin': 'round',
                }),
                h('path', {
                  d: ICON_CLIPBOARD.sparkle,
                  fill: 'currentColor',
                }),
                h('path', {
                  d: ICON_CLIPBOARD.body,
                  stroke: 'currentColor',
                  'stroke-width': 2,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                }),
              ]),
            ]),
            h(AnimatePresence, { initial: false, mode: 'popLayout' }, {
              default: () => copied.value
                ? [h(motion.span, {
                  key: 'check',
                  class: 'dialkit-toolbar-copy-icon',
                  initial: { scale: 0.5, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0.5, opacity: 0 },
                  transition: { type: 'spring', visualDuration: 0.3, bounce: 0.2 },
                }, [
                  h('svg', {
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 2,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    width: 16,
                    height: 16,
                  }, [h('path', { d: ICON_CHECK })]),
                ])]
                : [],
            }),
          ]),
        ]),
        props.toolbarExtra?.(),
      ]);

      return h('div', { class: 'dialkit-panel-wrapper' }, [
        h(Folder, {
          title: props.panel.name,
          defaultOpen: props.defaultOpen,
          isRoot: true,
          inline: props.inline,
          toolbar: () => toolbarNode,
        }, {
          default: () => [
            h(ControlRenderer, {
              panelId: props.panel.id,
              controls: props.panel.controls,
              values: values.value,
            }),
          ],
        }),
      ]);
    };
  },
});
