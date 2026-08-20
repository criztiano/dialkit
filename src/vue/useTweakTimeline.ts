import { computed, onMounted, onUnmounted, shallowRef, watch, type ComputedRef } from 'vue';
import { TweakStore } from '../store/TweakStore';
import { TimelineStore } from '../store/TimelineStore';
import type { TimelineLoopRegion } from '../store/TimelineStore';
import {
  buildTimelineMeta,
  buildTimelineValues,
  computeStaticTimeline,
  parseTimelineConfig,
  type TweakTimelineOptions,
  type TweakTimelineValues,
  type TimelineConfig,
} from '../timeline';

export type UseTweakTimelineOptions = TweakTimelineOptions;

let timelineInstance = 0;

export function useTweakTimeline<T extends TimelineConfig>(
  name: string,
  config: T,
  options?: UseTweakTimelineOptions
): ComputedRef<TweakTimelineValues<T>> {
  const hasStableId = options?.id !== undefined;
  const panelId = options?.id ?? `${name}-${++timelineInstance}`;
  const serializedConfig = computed(() => JSON.stringify(config));
  const serializedPersist = computed(() => JSON.stringify(options?.persist));
  const serializedLoop = computed(() => JSON.stringify(options?.loop));
  const parsed = computed(() => {
    serializedConfig.value;
    return parseTimelineConfig(config);
  });
  const flatValues = shallowRef(TweakStore.getValues(panelId));
  const transport = shallowRef(TimelineStore.getTransport(panelId));
  // The active loop window drives phase continuity for looping/sequence clips.
  // Shares the transport notify channel (set/clear region notifies too); the
  // stored region reference is stable so this snapshot never churns.
  const loopRegion = shallowRef<TimelineLoopRegion | undefined>(TimelineStore.getLoopRegion(panelId));
  const staticTimeline = computed(() => computeStaticTimeline(parsed.value, flatValues.value));
  const meta = computed(() => {
    serializedLoop.value;
    return buildTimelineMeta(
      panelId,
      name,
      staticTimeline.value.duration,
      parsed.value,
      options?.loop
    );
  });
  let mounted = false;
  let unsubscribeValues: (() => void) | undefined;
  let unsubscribeTransport: (() => void) | undefined;

  const play = () => TimelineStore.play(panelId);
  const pause = () => TimelineStore.pause(panelId);
  const replay = () => TimelineStore.replay(panelId);
  const seek = (time: number) => TimelineStore.seek(panelId, time);

  watch([serializedConfig, serializedPersist], () => {
    if (!mounted) return;
    TweakStore.updatePanel(panelId, name, parsed.value.tweakConfig, undefined, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: 'timeline',
    });
    flatValues.value = TweakStore.getValues(panelId);
  });

  watch(meta, (nextMeta) => {
    if (mounted) TimelineStore.update(nextMeta);
  });

  onMounted(() => {
    unsubscribeValues = TweakStore.subscribe(panelId, () => {
      flatValues.value = TweakStore.getValues(panelId);
    });
    unsubscribeTransport = TimelineStore.subscribe(panelId, () => {
      transport.value = TimelineStore.getTransport(panelId);
      loopRegion.value = TimelineStore.getLoopRegion(panelId);
    });

    TweakStore.registerPanel(panelId, name, parsed.value.tweakConfig, undefined, {
      retainOnUnmount: hasStableId,
      persist: options?.persist,
      kind: 'timeline',
    });
    flatValues.value = TweakStore.getValues(panelId);
    TimelineStore.register(meta.value, { autoplay: options?.autoplay ?? true, persist: options?.persist });
    transport.value = TimelineStore.getTransport(panelId);
    loopRegion.value = TimelineStore.getLoopRegion(panelId);
    mounted = true;
  });

  onUnmounted(() => {
    mounted = false;
    unsubscribeValues?.();
    unsubscribeTransport?.();
    TimelineStore.unregister(panelId);
    TweakStore.unregisterPanel(panelId);
  });

  return computed(() => {
    const currentStatic = staticTimeline.value;
    // No committed region means the whole timeline loops (restart from 0).
    const region = loopRegion.value;
    const loopStart = region ? region.start : 0;
    const loopEnd = region ? region.end : currentStatic.duration;
    return buildTimelineValues<T>(
      currentStatic.clips,
      transport.value,
      currentStatic.duration,
      loopStart,
      loopEnd,
      { play, pause, replay, seek }
    );
  });
}
