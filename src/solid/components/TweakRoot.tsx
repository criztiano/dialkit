import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { TweakStore } from 'tweakers/store';
import type { PanelConfig } from 'tweakers/store';
import { TimelineStore } from 'tweakers/timeline';
import { ShortcutListener } from './ShortcutListener';
import { Panel } from './Panel';
import { Folder } from './Folder';
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

interface TweakRootProps {
  position?: TweakPosition;
  defaultOpen?: boolean;
  mode?: TweakMode;
  theme?: TweakTheme;
  productionEnabled?: boolean;
  /**
   * Render only the named panels, in the order given. For apps that place
   * more than one panel surface in more than one place — a rack of per-voice
   * columns beside a global panel, say. Omitted, a root renders every
   * registered panel, which is the single-surface default.
   */
  panels?: string | string[];
  /**
   * `none` drops the panel card — no glass, no border, no radius, no padding —
   * so the rows sit directly on the host's own surface. For app chrome that
   * already provides the ground the panel would otherwise float on.
   */
  chrome?: TweakChrome;
}

export function TweakRoot(props: TweakRootProps) {
  if ((props.productionEnabled ?? isDevDefault) === false) return null;
  const [panels, setPanels] = createSignal<PanelConfig[]>([]);
  const [timelineCount, setTimelineCount] = createSignal(0);
  const [mounted, setMounted] = createSignal(false);
  const inline = () => (props.mode ?? 'popover') === 'inline';

  const read = () => TweakStore.selectPanels(props.panels);

  onMount(() => {
    setMounted(true);
    setPanels(read());
    setTimelineCount(TimelineStore.getTimelines().length);
    const unsubPanels = TweakStore.subscribeGlobal(() => {
      setPanels(read());
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
  const timelineToggle = () =>
    timelineCount() > 0 && props.panels === undefined ? <TimelineToggleButton /> : null;

  const content = () => (
    <ShortcutListener>
      <div class="tweakers-root" data-mode={props.mode ?? 'popover'} data-theme={props.theme ?? 'system'} data-chrome={props.chrome ?? 'card'}>
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
    <Show
      when={
        mounted() &&
        typeof window !== 'undefined' &&
        (panels().length > 0 || (props.panels === undefined && timelineCount() > 0))
      }
    >
      <Show when={!inline()} fallback={content()}>
        <Portal mount={document.body}>
          {content()}
        </Portal>
      </Show>
    </Show>
  );
}
