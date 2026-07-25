import { createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount, type Accessor } from 'solid-js';
import { isServer } from 'solid-js/web';
import { DialStore } from '../store/DialStore';
import { TimelineStore } from '../store/TimelineStore';
import type { TimelineLoopRegion } from '../store/TimelineStore';
import {
  buildTimelineMeta,
  buildTimelineValues,
  computeStaticTimeline,
  parseTimelineConfig,
  type DialTimelineOptions,
  type DialTimelineValues,
  type TimelineConfig,
} from '../timeline';

export type CreateDialTimelineOptions = DialTimelineOptions;

export function createDialTimeline<T extends TimelineConfig>(
  name: string,
  config: T,
  options?: CreateDialTimelineOptions
): Accessor<DialTimelineValues<T>> {
  const instanceId = createUniqueId();
  const hasStableId = options?.id !== undefined;
  const panelId = options?.id ?? `${name}-${instanceId}`;
  const parsed = createMemo(() => parseTimelineConfig(config));
  const [flatValues, setFlatValues] = createSignal(DialStore.getValues(panelId));
  const [transport, setTransport] = createSignal(TimelineStore.getTransport(panelId));
  // The active loop window drives phase continuity for looping/sequence clips.
  // Shares the transport notify channel (set/clear region notifies too); the
  // stored region reference is stable so this snapshot never churns.
  const [loopRegion, setLoopRegion] = createSignal<TimelineLoopRegion | undefined>(
    TimelineStore.getLoopRegion(panelId)
  );
  const staticTimeline = createMemo(() => computeStaticTimeline(parsed(), flatValues()));
  let mounted = false;

  const play = () => TimelineStore.play(panelId);
  const pause = () => TimelineStore.pause(panelId);
  const replay = () => TimelineStore.replay(panelId);
  const seek = (time: number) => TimelineStore.seek(panelId, time);

  if (!isServer) {
    const unsubscribeValues = DialStore.subscribe(panelId, () => {
      setFlatValues(DialStore.getValues(panelId));
    });
    const unsubscribeTransport = TimelineStore.subscribe(panelId, () => {
      setTransport(TimelineStore.getTransport(panelId));
      setLoopRegion(TimelineStore.getLoopRegion(panelId));
    });
    onCleanup(() => {
      unsubscribeValues();
      unsubscribeTransport();
    });
  }

  onMount(() => {
    DialStore.registerPanel(panelId, name, parsed().dialConfig, undefined, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: 'timeline',
    });
    setFlatValues(DialStore.getValues(panelId));

    const currentStatic = staticTimeline();
    TimelineStore.register(
      buildTimelineMeta(panelId, name, currentStatic.duration, parsed(), options?.loop),
      { autoplay: options?.autoplay ?? true, persist: options?.persist }
    );
    setTransport(TimelineStore.getTransport(panelId));
    setLoopRegion(TimelineStore.getLoopRegion(panelId));
    mounted = true;

    onCleanup(() => {
      mounted = false;
      TimelineStore.unregister(panelId);
      DialStore.unregisterPanel(panelId);
    });
  });

  createEffect(() => {
    const currentParsed = parsed();
    const currentStatic = staticTimeline();
    if (!mounted) return;
    TimelineStore.update(
      buildTimelineMeta(panelId, name, currentStatic.duration, currentParsed, options?.loop)
    );
  });

  return createMemo(() => {
    const currentStatic = staticTimeline();
    const region = loopRegion();
    const loopStart = region ? region.start : 0;
    const loopEnd = region ? region.end : currentStatic.duration;
    return buildTimelineValues<T>(
      currentStatic.clips,
      transport(),
      currentStatic.duration,
      loopStart,
      loopEnd,
      { play, pause, replay, seek }
    );
  });
}
