import { TweakStore } from 'tweakers/store';
import { TimelineStore, buildTimelineMeta, buildTimelineValues, computeStaticTimeline, parseTimelineConfig, } from 'tweakers/timeline';
let timelineInstance = 0;
export function createTweakTimeline(name, config, options) {
    const hasStableId = options?.id !== undefined;
    const panelId = options?.id ?? `${name}-${++timelineInstance}`;
    const parsed = $derived(parseTimelineConfig(config));
    let flatValues = $state(TweakStore.getValues(panelId));
    let transport = $state(TimelineStore.getTransport(panelId));
    // The active loop window drives phase continuity for looping/sequence clips.
    // Shares the transport notify channel (set/clear region notifies too); the
    // stored region reference is stable so this snapshot never churns.
    let loopRegion = $state(TimelineStore.getLoopRegion(panelId));
    const staticTimeline = $derived(computeStaticTimeline(parsed, flatValues));
    const actions = {
        play: () => TimelineStore.play(panelId),
        pause: () => TimelineStore.pause(panelId),
        replay: () => TimelineStore.replay(panelId),
        seek: (time) => TimelineStore.seek(panelId, time),
    };
    const resolved = $derived.by(() => {
        // No region → loop the whole timeline [0, duration] (the default).
        const loopStart = loopRegion ? loopRegion.start : 0;
        const loopEnd = loopRegion ? loopRegion.end : staticTimeline.duration;
        return buildTimelineValues(staticTimeline.clips, transport, staticTimeline.duration, loopStart, loopEnd, actions);
    });
    $effect(() => {
        const currentParsed = parsed;
        TweakStore.registerPanel(panelId, name, currentParsed.tweakConfig, undefined, {
            retainOnUnmount: hasStableId,
            persist: options?.persist,
            kind: 'timeline',
        });
        flatValues = TweakStore.getValues(panelId);
        const initialStatic = computeStaticTimeline(currentParsed, flatValues);
        TimelineStore.register(buildTimelineMeta(panelId, name, initialStatic.duration, currentParsed, options?.loop), { autoplay: options?.autoplay ?? true, persist: options?.persist });
        transport = TimelineStore.getTransport(panelId);
        loopRegion = TimelineStore.getLoopRegion(panelId);
        const unsubscribeValues = TweakStore.subscribe(panelId, () => {
            flatValues = TweakStore.getValues(panelId);
        });
        const unsubscribeTransport = TimelineStore.subscribe(panelId, () => {
            transport = TimelineStore.getTransport(panelId);
            loopRegion = TimelineStore.getLoopRegion(panelId);
        });
        return () => {
            unsubscribeValues();
            unsubscribeTransport();
            TimelineStore.unregister(panelId);
            TweakStore.unregisterPanel(panelId);
        };
    });
    $effect(() => {
        TimelineStore.update(buildTimelineMeta(panelId, name, staticTimeline.duration, parsed, options?.loop));
    });
    return reactiveProxy(() => resolved);
}
function reactiveProxy(read, path = []) {
    const nested = new Map();
    return new Proxy({}, {
        get(_target, key) {
            const value = readPath(read(), [...path, key]);
            if (typeof value !== 'object' || value === null)
                return value;
            if (!nested.has(key))
                nested.set(key, reactiveProxy(read, [...path, key]));
            return nested.get(key);
        },
        ownKeys() {
            const value = readPath(read(), path);
            return typeof value === 'object' && value !== null ? Reflect.ownKeys(value) : [];
        },
        getOwnPropertyDescriptor() {
            return { enumerable: true, configurable: true };
        },
    });
}
function readPath(source, path) {
    return path.reduce((value, key) => {
        if (typeof value !== 'object' || value === null)
            return undefined;
        return Reflect.get(value, key);
    }, source);
}
