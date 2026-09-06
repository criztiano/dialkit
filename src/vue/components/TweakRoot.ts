import { defineComponent, h, onMounted, onUnmounted, ref, Teleport, type VNodeChild } from 'vue';
import { TweakStore } from 'tweakers/store';
import type { PanelConfig } from 'tweakers/store';
import { TimelineStore } from 'tweakers/timeline';
import type { TimelineMeta } from 'tweakers/timeline';
import { Panel } from './Panel';
import { Folder } from './Folder';
import { ShortcutListener } from './ShortcutListener';
import { TimelineToggleButton } from './Timeline/TimelineToggleButton';

export type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type TweakMode = 'popover' | 'inline';
/** `card` is the panel's glass surface; `none` puts the rows straight on the host's ground. */
export type TweakChrome = 'card' | 'none';
export type TweakTheme = 'light' | 'dark' | 'system';

declare const process: { env?: { NODE_ENV?: string } } | undefined;

const isDevDefault = typeof process !== 'undefined' && process?.env?.NODE_ENV
  ? process.env.NODE_ENV !== 'production'
  : typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE
    ? (import.meta as any).env.MODE !== 'production'
    : true;

export const TweakRoot = defineComponent({
  name: 'TweakersRoot',
  props: {
    position: {
      type: String as () => TweakPosition,
      default: 'top-right',
    },
    defaultOpen: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String as () => TweakMode,
      default: 'popover',
    },
    theme: {
      type: String as () => TweakTheme,
      default: 'system',
    },
    productionEnabled: {
      type: Boolean,
      default: isDevDefault,
    },
    /**
     * Render only the named panels, in the order given. For apps that place
     * more than one panel surface in more than one place — a rack of per-voice
     * columns beside a global panel, say. Omitted, a root renders every
     * registered panel, which is the single-surface default.
     */
    panels: {
      type: [String, Array] as unknown as () => string | string[] | undefined,
      default: undefined,
    },
    /**
     * `none` drops the panel card — no glass, no border, no radius, no padding —
     * so the rows sit directly on the host's own surface. For app chrome that
     * already provides the ground the panel would otherwise float on.
     */
    chrome: {
      type: String as () => TweakChrome,
      default: 'card',
    },
  },
  setup(props) {
    const panels = ref<PanelConfig[]>([]);
    const timelines = ref<TimelineMeta[]>([]);
    const mounted = ref(false);
    let unsubscribePanels: (() => void) | undefined;
    let unsubscribeTimelines: (() => void) | undefined;

    onMounted(() => {
      mounted.value = true;
      // Timeline panels are their own dock (TweakTimeline); exclude them here so
      // only real settings panels render, but track their presence to decide
      // whether to surface the visibility toggle.
      panels.value = TweakStore.selectPanels(props.panels);
      timelines.value = TimelineStore.getTimelines();
      unsubscribePanels = TweakStore.subscribeGlobal(() => {
        panels.value = TweakStore.selectPanels(props.panels);
      });
      unsubscribeTimelines = TimelineStore.subscribeGlobal(() => {
        timelines.value = TimelineStore.getTimelines();
      });
    });

    onUnmounted(() => {
      unsubscribePanels?.();
      unsubscribeTimelines?.();
    });

    const timelineToggle = (): VNodeChild =>
      timelines.value.length > 0 && props.panels === undefined ? h(TimelineToggleButton) : null;

    const renderPanels = () => {
      // No settings panels but timelines exist: render a minimal shell whose
      // only job is to host the timeline visibility toggle.
      if (panels.value.length === 0) {
        return [h('div', { class: 'tweakers-panel-wrapper' }, [
          h(Folder, {
            title: 'Tweakers',
            defaultOpen: props.mode === 'inline' || props.defaultOpen,
            isRoot: true,
            inline: props.mode === 'inline',
            toolbar: () => h(TimelineToggleButton),
          }, { default: () => [h('div', { class: 'tweakers-timeline-toolkit-only' }, 'Timeline')] }),
        ])];
      }
      return panels.value.map((panel) => h(Panel, {
        key: panel.id,
        panel,
        defaultOpen: props.mode === 'inline' || props.defaultOpen,
        inline: props.mode === 'inline',
        toolbarExtra: timelineToggle,
      }));
    };

    const renderContent = () => h(ShortcutListener, null, {
      default: () => h('div', { class: 'tweakers-root', 'data-mode': props.mode, 'data-theme': props.theme, 'data-chrome': props.chrome }, [
        h('div', {
          class: 'tweakers-panel',
          'data-position': props.mode === 'inline' ? undefined : props.position,
          'data-mode': props.mode,
        }, renderPanels()),
      ]),
    });

    return () => {
      const empty =
        panels.value.length === 0 &&
        (props.panels !== undefined || timelines.value.length === 0);
      if (!props.productionEnabled || !mounted.value || typeof window === 'undefined' || empty) {
        return null;
      }

      if (props.mode === 'inline') {
        return renderContent();
      }

      return h(Teleport, { to: 'body' }, renderContent());
    };
  },
});
