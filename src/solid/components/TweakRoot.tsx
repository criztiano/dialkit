import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { TweakStore } from '../../store/TweakStore';
import type { PanelConfig } from '../../store/TweakStore';
import { TimelineStore } from '../../store/TimelineStore';
import { ShortcutListener } from './ShortcutListener';
import { Panel } from './Panel';
import { Folder } from './Folder';
import { TimelineToggleButton } from './Timeline/TimelineToggleButton';

export type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type TweakMode = 'popover' | 'inline';
export type TweakTheme = 'light' | 'dark' | 'system';

declare const process: { env?: { NODE_ENV?: string } } | undefined;

const isDevDefault = typeof process !== 'undefined' && process?.env?.NODE_ENV
  ? process.env.NODE_ENV !== 'production'
  : typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE
    ? (import.meta as any).env.MODE !== 'production'
    : true;

interface TweakRootProps {
  position?: TweakPosition;
  defaultOpen?: boolean;
  mode?: TweakMode;
  theme?: TweakTheme;
  productionEnabled?: boolean;
}

export function TweakRoot(props: TweakRootProps) {
  if ((props.productionEnabled ?? isDevDefault) === false) return null;
  const [panels, setPanels] = createSignal<PanelConfig[]>([]);
  const [timelineCount, setTimelineCount] = createSignal(0);
  const [mounted, setMounted] = createSignal(false);
  const inline = () => (props.mode ?? 'popover') === 'inline';

  onMount(() => {
    setMounted(true);
    setPanels(TweakStore.getPanels('panel'));
    setTimelineCount(TimelineStore.getTimelines().length);
    const unsubPanels = TweakStore.subscribeGlobal(() => {
      setPanels(TweakStore.getPanels('panel'));
    });
    const unsubTimelines = TimelineStore.subscribeGlobal(() => {
      setTimelineCount(TimelineStore.getTimelines().length);
    });
    onCleanup(() => {
      unsubPanels();
      unsubTimelines();
    });
  });

  // Timeline-backed panels render in TweakTimeline, but their presence adds a
  // visibility toggle to the dock toolbar here.
  const timelineToggle = () => (timelineCount() > 0 ? <TimelineToggleButton /> : null);

  const content = () => (
    <ShortcutListener>
      <div class="tweakers-root" data-mode={props.mode ?? 'popover'} data-theme={props.theme ?? 'system'}>
        <div class="tweakers-panel" data-position={inline() ? undefined : (props.position ?? 'top-right')} data-mode={props.mode ?? 'popover'}>
          <Show
            when={panels().length > 0}
            fallback={
              <div class="tweakers-panel-wrapper">
                <Folder
                  title="Tweakers"
                  defaultOpen={inline() || (props.defaultOpen ?? true)}
                  isRoot={true}
                  inline={inline()}
                  toolbar={timelineToggle()}
                >
                  <div class="tweakers-timeline-toolkit-only">Timeline</div>
                </Folder>
              </div>
            }
          >
            <For each={panels()}>
              {(panel) => (
                <Panel
                  panel={panel}
                  defaultOpen={inline() || (props.defaultOpen ?? true)}
                  inline={inline()}
                  toolbarExtra={timelineToggle()}
                />
              )}
            </For>
          </Show>
        </div>
      </div>
    </ShortcutListener>
  );

  return (
    <Show when={mounted() && typeof window !== 'undefined' && (panels().length > 0 || timelineCount() > 0)}>
      <Show when={!inline()} fallback={content()}>
        <Portal mount={document.body}>
          {content()}
        </Portal>
      </Show>
    </Show>
  );
}
