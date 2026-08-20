<script lang="ts">
  import { untrack } from 'svelte';
  import { TweakStore, formatLabel } from 'tweakers/store';
  import type { TweakValue } from 'tweakers/store';
  import {
    TimelineStore,
    buildCopyInstruction,
    clamp,
    computeClipStaticFromValues,
    formatClock,
    normalizeTimelineValuesForCopy,
  } from 'tweakers/timeline';
  import type {
    TimelineClipMeta,
    TimelineClipStatic,
    TimelineMeta,
    TimelineTrackStatic,
    TimelineTransport,
  } from 'tweakers/timeline';
  import {
    ICON_ADD_PRESET,
    ICON_CHEVRON,
    ICON_CHECK,
    ICON_CLIPBOARD,
    ICON_LOOP,
    ICON_PAUSE,
    ICON_PLAY,
    ICON_REPLAY,
  } from '../../../icons';
  import { findControl } from '../../../shortcut-utils';
  import PresetManager from '../PresetManager.svelte';
  import type { TweakTheme } from '../TweakRoot.svelte';
  import ClipPopover from './ClipPopover.svelte';
  import type { PopoverState } from './ClipPopover.svelte';
  import TimelineClip from './TimelineClip.svelte';

  const DRAG_THRESHOLD_PX = 3;
  // Pointer travel that turns a ruler click (seek) into a loop-region drag.
  const LOOP_DRAG_THRESHOLD_PX = 4;
  const MAJOR_TICK_TARGET_PX = 140;
  const MILLISECOND_STEP = 0.001;
  const SECOND_TICK_STEPS = [
    0.001, 0.002, 0.005,
    0.01, 0.02, 0.05,
    0.1, 0.2, 0.5,
    1, 2, 5, 10, 15, 30, 60, 120, 300, 600,
  ];
  const MIN_TIMELINE_MAX_ZOOM = 8;
  const PLAYHEAD_FLAG_WIDTH = 52;
  const PLAYHEAD_FLAG_EDGE_OVERHANG = 1;
  const ZOOM_DRAG_DISTANCE = 180;

  type ZoomDragState = {
    pointerX: number;
    rect: DOMRect;
    zoom: number;
    viewStart: number;
    anchorRatio: number;
    anchorTime: number;
    moved: boolean;
  };

  type ScrubState = {
    wasPlaying: boolean;
    rect: DOMRect;
    viewStart: number;
    visibleDuration: number;
  };

  // Ruler gesture: a click seeks the playhead; a drag past the threshold draws
  // a loop region instead. Option-drag still zooms; Shift first resets zoom.
  type RulerGesture = {
    downClientX: number;
    downTime: number;
    rect: DOMRect;
    viewStart: number;
    visibleDuration: number;
    moved: boolean;
  };

  // The barrel doesn't re-export the region type; recover it from the store API.
  type TimelineLoopRegion = NonNullable<ReturnType<typeof TimelineStore.getLoopRegion>>;

  type GroupRow = {
    kind: 'group';
    key: string;
    group: string;
    collapsed: boolean;
  };

  type ClipRow = {
    kind: 'clip';
    key: string;
    clip: TimelineClipMeta;
    stat: TimelineClipStatic;
    tracksOpen: boolean;
    selected: boolean;
  };

  type TrackRow = {
    kind: 'track';
    key: string;
    parent: TimelineClipMeta;
    clip: TimelineClipMeta;
    stat: TimelineClipStatic;
    track: TimelineTrackStatic;
    selected: boolean;
  };

  let { meta, defaultOpen, theme, dockVisible } = $props<{
    meta: TimelineMeta;
    defaultOpen: boolean;
    theme: TweakTheme;
    dockVisible: boolean;
  }>();

  let open = $state(untrack(() => defaultOpen));
  let copied = $state(false);
  let popover = $state<PopoverState | null>(null);
  let collapsedGroups = $state(new Set<string>());
  let expandedTracks = $state(new Set<string>());
  let zoom = $state(1);
  let viewStart = $state(0);
  let values = $state<Record<string, TweakValue>>(TweakStore.getValues(untrack(() => meta.id)));
  let transport = $state<TimelineTransport>(TimelineStore.getTransport(untrack(() => meta.id)));
  // Committed loop region (undefined = looping the whole timeline). Shares the
  // transport notify channel; the stored reference is stable between changes.
  let loopRegion = $state<TimelineLoopRegion | undefined>(
    TimelineStore.getLoopRegion(untrack(() => meta.id))
  );
  // Live region while the user drags a new one on the ruler.
  let loopDrag = $state<TimelineLoopRegion | null>(null);
  let laneArea = $state<HTMLDivElement>();
  let horizontalScrollElement = $state<HTMLDivElement>();
  let laneWidth = $state(0);

  let zoomDrag: ZoomDragState | null = null;
  let rulerGesture: RulerGesture | null = null;
  let trackScrub: ScrubState | null = null;
  let overviewScrub: { wasPlaying: boolean; rect: DOMRect } | null = null;
  let playheadScrub: ScrubState | null = null;

  const presets = $derived.by(() => {
    values;
    return TweakStore.getPresets(meta.id);
  });
  const activePresetId = $derived.by(() => {
    values;
    return TweakStore.getActivePresetId(meta.id);
  });
  const visibleDuration = $derived(meta.duration > 0 ? meta.duration / zoom : meta.duration);
  const safeViewStart = $derived(clampViewStart(viewStart, meta.duration, visibleDuration));
  const viewEnd = $derived(safeViewStart + visibleDuration);
  const pxPerSecond = $derived(visibleDuration > 0 && laneWidth > 0 ? laneWidth / visibleDuration : 0);
  const maxZoom = $derived(Math.max(
    MIN_TIMELINE_MAX_ZOOM,
    laneWidth > 0 && meta.duration > 0
      ? (MAJOR_TICK_TARGET_PX * meta.duration) / (MILLISECOND_STEP * 10 * laneWidth)
      : MIN_TIMELINE_MAX_ZOOM
  ));
  const playheadX = $derived(clamp((transport.time - safeViewStart) * pxPerSecond, 0, laneWidth));
  const playheadVisible = $derived(
    transport.time >= safeViewStart && transport.time <= viewEnd && laneWidth > 0
  );
  const playheadFlagCenter = $derived(clamp(
    playheadX,
    PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG,
    laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG
  ));
  const playheadFlagOffset = $derived(playheadFlagCenter - playheadX);
  const playheadEdge = $derived(
    playheadFlagOffset > 0.5 ? 'start' : playheadFlagOffset < -0.5 ? 'end' : 'center'
  );
  const overviewViewportWidth = $derived(
    meta.duration > 0 ? ((viewEnd - safeViewStart) / meta.duration) * 100 : 100
  );
  const overviewPlayheadPercent = $derived(
    meta.duration > 0 ? (transport.time / meta.duration) * 100 : 0
  );

  const ticks = $derived.by(() => {
    const rawStep = pxPerSecond > 0 ? MAJOR_TICK_TARGET_PX / pxPerSecond : 1;
    const adaptive = SECOND_TICK_STEPS.find((step) => step >= rawStep)
      ?? SECOND_TICK_STEPS[SECOND_TICK_STEPS.length - 1];
    const majorStep = zoom < 1.5 && meta.duration >= 1 ? Math.max(1, adaptive) : adaptive;
    const fineStep = majorStep / 10;
    const major: number[] = [];
    const medium: number[] = [];
    const fine: number[] = [];
    const firstMajor = Math.ceil((safeViewStart - 1e-6) / majorStep) * majorStep;
    for (let time = firstMajor; time <= viewEnd + 1e-6; time += majorStep) {
      major.push(Number(time.toFixed(4)));
    }
    const firstFine = Math.ceil((safeViewStart - 1e-6) / fineStep);
    const lastFine = Math.floor((viewEnd + 1e-6) / fineStep);
    for (let index = firstFine; index <= lastFine; index++) {
      if (index % 10 === 0) continue;
      const tick = Number((index * fineStep).toFixed(6));
      if (index % 5 === 0) medium.push(tick);
      else fine.push(tick);
    }
    return { major, medium, fine, majorStep };
  });

  const rows = $derived.by(() => {
    const result: Array<GroupRow | ClipRow | TrackRow> = [];
    let lastGroup: string | undefined;
    for (const clip of meta.clips) {
      if (clip.group !== lastGroup) {
        lastGroup = clip.group;
        if (clip.group) {
          result.push({
            kind: 'group',
            key: `group:${clip.group}`,
            group: clip.group,
            collapsed: collapsedGroups.has(clip.group),
          });
        }
      }
      if (clip.group && collapsedGroups.has(clip.group)) continue;
      const tracksOpen = Boolean(clip.tracks?.length) && expandedTracks.has(clip.key);
      const stat = computeClipStaticFromValues(values, clip, meta.duration);
      result.push({
        kind: 'clip',
        key: clip.key,
        clip,
        stat,
        tracksOpen,
        selected: popover?.clip.key === clip.key,
      });
      if (!tracksOpen) continue;
      for (const trackRef of clip.tracks ?? []) {
        const track = stat.tracks.find((candidate) => candidate.prop === trackRef.prop);
        if (!track) continue;
        const key = `${clip.key}.${trackRef.prop}`;
        result.push({
          kind: 'track',
          key,
          parent: clip,
          clip: {
            key,
            label: `${clip.label} · ${formatLabel(trackRef.prop)}`,
            color: clip.color,
            loop: clip.loop,
            group: clip.group,
            stepKeys: trackRef.stepKeys,
          },
          stat,
          track,
          selected: popover?.clip.key === key,
        });
      }
    }
    return result;
  });

  $effect(() => {
    values = TweakStore.getValues(meta.id);
    transport = TimelineStore.getTransport(meta.id);
    loopRegion = TimelineStore.getLoopRegion(meta.id);
    const unsubscribeValues = TweakStore.subscribe(meta.id, () => {
      values = TweakStore.getValues(meta.id);
    });
    const unsubscribeTransport = TimelineStore.subscribe(meta.id, () => {
      transport = TimelineStore.getTransport(meta.id);
      loopRegion = TimelineStore.getLoopRegion(meta.id);
    });
    return () => {
      unsubscribeValues();
      unsubscribeTransport();
    };
  });

  $effect(() => {
    if (!open || !laneArea) return;
    const measure = () => {
      if (laneArea) laneWidth = laneArea.getBoundingClientRect().width;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(laneArea);
    return () => observer.disconnect();
  });

  $effect(() => {
    const nextZoom = clamp(zoom, 1, maxZoom);
    if (nextZoom !== zoom) zoom = nextZoom;
    const nextStart = clampViewStart(viewStart, meta.duration, meta.duration / zoom);
    if (nextStart !== viewStart) viewStart = nextStart;
  });

  $effect(() => {
    if (!open || !horizontalScrollElement || pxPerSecond <= 0) return;
    const next = safeViewStart * pxPerSecond;
    if (Math.abs(horizontalScrollElement.scrollLeft - next) > 0.5) {
      horizontalScrollElement.scrollLeft = next;
    }
  });

  $effect(() => {
    if (!dockVisible) popover = null;
  });

  function centerViewAt(time: number) {
    if (zoom <= 1 || meta.duration <= 0) return;
    const duration = meta.duration / zoom;
    viewStart = clampViewStart(time - duration / 2, meta.duration, duration);
  }

  function resetView() {
    zoom = 1;
    viewStart = 0;
  }

  function handleReplay() {
    viewStart = 0;
    TimelineStore.replay(meta.id);
  }

  function handleHorizontalScroll(event: Event) {
    if (pxPerSecond <= 0) return;
    viewStart = clampViewStart(
      (event.currentTarget as HTMLDivElement).scrollLeft / pxPerSecond,
      meta.duration,
      visibleDuration
    );
  }

  function handleTimelineWheel(event: WheelEvent) {
    if (!horizontalScrollElement || zoom <= 1) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.shiftKey
        ? event.deltaY
        : 0;
    if (delta === 0) return;
    event.preventDefault();
    horizontalScrollElement.scrollLeft += delta;
  }

  function seek(scrub: ScrubState | null, clientX: number) {
    if (!scrub || scrub.rect.width <= 0) return;
    TimelineStore.seek(meta.id, clamp(
      scrub.viewStart + ((clientX - scrub.rect.left) / scrub.rect.width) * scrub.visibleDuration,
      scrub.viewStart,
      scrub.viewStart + scrub.visibleDuration
    ));
  }

  function rulerTimeFromClientX(clientX: number, rect: DOMRect, viewStartAt: number, visibleAt: number) {
    return clamp(
      viewStartAt + ((clientX - rect.left) / rect.width) * visibleAt,
      viewStartAt,
      viewStartAt + visibleAt
    );
  }

  function handleRulerPointerDown(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0) return;
    target.setPointerCapture(event.pointerId);
    if (!event.altKey) {
      const reset = event.shiftKey;
      const gestureViewStart = reset ? 0 : safeViewStart;
      const gestureVisible = reset ? meta.duration : visibleDuration;
      if (reset) resetView();
      rulerGesture = {
        downClientX: event.clientX,
        downTime: rulerTimeFromClientX(event.clientX, rect, gestureViewStart, gestureVisible),
        rect,
        viewStart: gestureViewStart,
        visibleDuration: gestureVisible,
        moved: false,
      };
      return;
    }
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    zoomDrag = {
      pointerX: event.clientX,
      rect,
      zoom,
      viewStart: safeViewStart,
      anchorRatio: ratio,
      anchorTime: safeViewStart + ratio * visibleDuration,
      moved: false,
    };
  }

  function handleRulerPointerMove(event: PointerEvent) {
    if (rulerGesture) {
      const dx = event.clientX - rulerGesture.downClientX;
      if (!rulerGesture.moved && Math.abs(dx) <= LOOP_DRAG_THRESHOLD_PX) return;
      rulerGesture.moved = true;
      const current = rulerTimeFromClientX(
        event.clientX,
        rulerGesture.rect,
        rulerGesture.viewStart,
        rulerGesture.visibleDuration
      );
      loopDrag = {
        start: Math.min(rulerGesture.downTime, current),
        end: Math.max(rulerGesture.downTime, current),
      };
      return;
    }
    if (!zoomDrag || meta.duration <= 0) return;
    const dx = event.clientX - zoomDrag.pointerX;
    if (!zoomDrag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
    zoomDrag.moved = true;
    const nextZoom = clamp(zoomDrag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom);
    const nextDuration = meta.duration / nextZoom;
    zoom = nextZoom;
    viewStart = clampViewStart(
      zoomDrag.anchorTime - zoomDrag.anchorRatio * nextDuration,
      meta.duration,
      nextDuration
    );
  }

  function finishRuler() {
    const gesture = rulerGesture;
    rulerGesture = null;
    zoomDrag = null;
    if (!gesture) return;
    const drag = loopDrag;
    if (gesture.moved && drag) {
      // A real drag commits a loop region (store normalizes / rejects tiny widths).
      TimelineStore.setLoopRegion(meta.id, drag.start, drag.end);
    } else {
      // Negligible movement = a click: seek the playhead.
      TimelineStore.seek(meta.id, gesture.downTime);
    }
    loopDrag = null;
  }

  function cancelRuler() {
    rulerGesture = null;
    zoomDrag = null;
    loopDrag = null;
  }

  function handleClearLoopRegion() {
    TimelineStore.clearLoopRegion(meta.id);
  }

  function handleTrackPointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.tweakers-timeline-label, button')) return;
    if (!event.shiftKey && target.closest('.tweakers-timeline-clip')) return;
    const rect = laneArea?.getBoundingClientRect();
    if (!rect) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const reset = event.shiftKey;
    trackScrub = {
      wasPlaying: TimelineStore.getTransport(meta.id).playing,
      rect,
      viewStart: reset ? 0 : safeViewStart,
      visibleDuration: reset ? meta.duration : visibleDuration,
    };
    if (reset) resetView();
    popover = null;
    TimelineStore.pause(meta.id);
    seek(trackScrub, event.clientX);
  }

  function finishTrack() {
    if (trackScrub?.wasPlaying) TimelineStore.play(meta.id);
    trackScrub = null;
  }

  function handleOverviewPointerDown(event: PointerEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);
    overviewScrub = {
      wasPlaying: TimelineStore.getTransport(meta.id).playing,
      rect: target.getBoundingClientRect(),
    };
    TimelineStore.pause(meta.id);
    seekOverview(event.clientX);
  }

  function seekOverview(clientX: number) {
    if (!overviewScrub || overviewScrub.rect.width <= 0 || meta.duration <= 0) return;
    const next = clamp(
      ((clientX - overviewScrub.rect.left) / overviewScrub.rect.width) * meta.duration,
      0,
      meta.duration
    );
    TimelineStore.seek(meta.id, next);
    centerViewAt(next);
  }

  function finishOverview() {
    if (overviewScrub?.wasPlaying) TimelineStore.play(meta.id);
    overviewScrub = null;
  }

  function handlePlayheadPointerDown(event: PointerEvent) {
    const rect = laneArea?.getBoundingClientRect();
    if (!rect) return;
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const reset = event.shiftKey;
    playheadScrub = {
      wasPlaying: TimelineStore.getTransport(meta.id).playing,
      rect,
      viewStart: reset ? 0 : safeViewStart,
      visibleDuration: reset ? meta.duration : visibleDuration,
    };
    if (reset) resetView();
    TimelineStore.pause(meta.id);
    seek(playheadScrub, event.clientX);
  }

  function finishPlayhead() {
    if (playheadScrub?.wasPlaying) TimelineStore.play(meta.id);
    playheadScrub = null;
  }

  function handleCopy() {
    const normalized = normalizeTimelineValuesForCopy(TweakStore.getValues(meta.id), meta.clips);
    void navigator.clipboard.writeText(buildCopyInstruction('createTweakTimeline', meta.name, normalized));
    copied = true;
    window.setTimeout(() => { copied = false; }, 1500);
  }

  function handleAddPreset() {
    TweakStore.savePreset(meta.id, `Version ${presets.length + 2}`);
  }

  function toggleSet(current: Set<string>, key: string): Set<string> {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  }

  function toggleTracks(key: string) {
    expandedTracks = toggleSet(expandedTracks, key);
  }

  function toggleGroup(key: string) {
    collapsedGroups = toggleSet(collapsedGroups, key);
  }

  function clipPopoverExclusions(clip: TimelineClipMeta): Set<string> {
    return new Set([...(clip.stepKeys ?? []), ...(clip.tracks?.map((track) => track.prop) ?? [])]);
  }

  function getClipControls(path: string, exclusions?: Set<string>) {
    const panel = TweakStore.getPanel(meta.id);
    const folder = panel ? findControl(panel.controls, path) : null;
    if (!folder?.children) return [];
    return folder.children.filter((control) => {
      const key = control.path.slice(path.length + 1);
      return key !== 'at' && key !== 'duration' && !exclusions?.has(key);
    });
  }

  function openClipPopover(clip: TimelineClipMeta, rect: DOMRect, stepKey?: string) {
    const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
    if (getClipControls(targetPath, stepKey ? undefined : clipPopoverExclusions(clip)).length === 0) return;
    popover = popover?.clip.key === clip.key && popover.stepKey === stepKey
      ? null
      : {
          clip,
          stepKey,
          anchor: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          },
        };
  }

  function handleBarClick(clip: TimelineClipMeta, rect: DOMRect, stepKey?: string) {
    if (!stepKey && clip.tracks?.length) toggleTracks(clip.key);
    else openClipPopover(clip, rect, stepKey);
  }

  function formatRulerSeconds(time: number, step: number): string {
    if (step >= 1 && Number.isInteger(time)) return formatClock(time);
    const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
    return `${time.toFixed(decimals)}s`;
  }

  function clampViewStart(start: number, duration: number, shownDuration: number): number {
    return clamp(start, 0, Math.max(0, duration - shownDuration));
  }
</script>

<div class="tweakers-timeline-section">
  <div class="tweakers-timeline-header" data-open={open || undefined}>
    <div class="tweakers-timeline-identity">
      <span class="tweakers-timeline-title">{meta.name}</span>
    </div>

    {#if !open}
      <div
        class="tweakers-timeline-overview"
        onpointerdown={handleOverviewPointerDown}
        onpointermove={(event) => overviewScrub && seekOverview(event.clientX)}
        onpointerup={finishOverview}
        onpointercancel={finishOverview}
        onlostpointercapture={finishOverview}
        title="Drag to scrub the full timeline"
        role="slider"
        tabindex="0"
        aria-label="Timeline overview"
        aria-valuemin={0}
        aria-valuemax={meta.duration}
        aria-valuenow={transport.time}
      >
        <div
          class="tweakers-timeline-overview-viewport"
          data-zoomed={overviewViewportWidth < 99.999 || undefined}
          style:left={`${meta.duration > 0 ? (safeViewStart / meta.duration) * 100 : 0}%`}
          style:width={`${overviewViewportWidth}%`}
        ></div>
        <div class="tweakers-timeline-overview-progress" style:width={`${overviewPlayheadPercent}%`}></div>
        <div class="tweakers-timeline-overview-playhead" style:left={`${overviewPlayheadPercent}%`}></div>
      </div>
    {/if}

    <div class="tweakers-timeline-actions">
      <button
        class="tweakers-timeline-loop-toggle"
        data-active={loopRegion ? 'true' : undefined}
        onclick={handleClearLoopRegion}
        disabled={!loopRegion}
        title={loopRegion
          ? 'Looping a region · click to loop the whole timeline'
          : 'Looping the whole timeline · drag the ruler to set a loop region'}
        aria-label={loopRegion ? 'Clear loop region' : 'Looping whole timeline'}
        aria-pressed={loopRegion ? true : false}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          {#each ICON_LOOP as path}<path d={path} />{/each}
        </svg>
      </button>
      <button
        class="tweakers-toolbar-add"
        onclick={() => transport.playing ? TimelineStore.pause(meta.id) : TimelineStore.play(meta.id)}
        title={transport.playing ? 'Pause' : 'Play'}
        aria-label={transport.playing ? 'Pause' : 'Play'}
      >
        <span style="position:relative;width:16px;height:16px;">
          {#if transport.playing}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="position:absolute;inset:0;width:16px;height:16px;color:var(--tweak-text-label);">
              {#each ICON_PAUSE as path}<path d={path} fill="currentColor" />{/each}
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="position:absolute;inset:0;width:16px;height:16px;color:var(--tweak-text-label);">
              <path d={ICON_PLAY} fill="currentColor" />
            </svg>
          {/if}
        </span>
      </button>
      <button class="tweakers-toolbar-add" onclick={handleReplay} title="Replay" aria-label="Replay">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="width:16px;height:16px;color:var(--tweak-text-label);">
          {#each ICON_REPLAY as path}<path d={path} fill="currentColor" />{/each}
        </svg>
      </button>
      <button class="tweakers-toolbar-add" onclick={handleAddPreset} title="Add timeline version" aria-label="Add timeline version">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          {#each ICON_ADD_PRESET as path}<path d={path} />{/each}
        </svg>
      </button>
      <PresetManager panelId={meta.id} {presets} {activePresetId} />
      <button
        class="tweakers-toolbar-add"
        onclick={handleCopy}
        title="Copy parameters"
        aria-label={copied ? 'Copied parameters' : 'Copy parameters'}
      >
        <span style="position:relative;width:16px;height:16px;">
          {#if copied}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="position:absolute;inset:0;width:16px;height:16px;color:var(--tweak-text-label);">
              <path d={ICON_CHECK} />
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="position:absolute;inset:0;width:16px;height:16px;color:var(--tweak-text-label);">
              <path d={ICON_CLIPBOARD.board} stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              <path d={ICON_CLIPBOARD.sparkle} fill="currentColor" />
              <path d={ICON_CLIPBOARD.body} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          {/if}
        </span>
      </button>
      <button
        class="tweakers-timeline-chevron"
        data-open={open}
        aria-expanded={open}
        onclick={() => { open = !open; }}
        title={open ? 'Collapse timeline' : 'Expand timeline'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d={ICON_CHEVRON} />
        </svg>
      </button>
    </div>
  </div>

  {#if open}
    <div
      class="tweakers-timeline-body"
      onwheel={handleTimelineWheel}
      onpointerdown={handleTrackPointerDown}
      onpointermove={(event) => trackScrub && seek(trackScrub, event.clientX)}
      onpointerup={finishTrack}
      onpointercancel={finishTrack}
      onlostpointercapture={finishTrack}
      role="presentation"
    >
      <div class="tweakers-timeline-grid">
        <div class="tweakers-timeline-row tweakers-timeline-ruler-row">
          <div class="tweakers-timeline-label"></div>
          <div
            bind:this={laneArea}
            class="tweakers-timeline-ruler"
            onpointerdown={handleRulerPointerDown}
            onpointermove={handleRulerPointerMove}
            onpointerup={finishRuler}
            onpointercancel={cancelRuler}
            onlostpointercapture={cancelRuler}
            title="Click to seek · drag to set a loop region · Option-drag to zoom · Shift-drag to reset zoom"
            role="slider"
            tabindex="0"
            aria-label="Timeline ruler"
            aria-valuemin={safeViewStart}
            aria-valuemax={viewEnd}
            aria-valuenow={transport.time}
          >
            {#if pxPerSecond > 0}
              {@const region = loopDrag ?? loopRegion}
              {#if region}
                {@const bandLeft = (region.start - safeViewStart) * pxPerSecond}
                {@const bandWidth = Math.max(0, (region.end - region.start) * pxPerSecond)}
                <div class="tweakers-timeline-loop-dim" style={`left:0px;width:${Math.max(0, bandLeft)}px;`}></div>
                <div class="tweakers-timeline-loop-dim" style={`left:${bandLeft + bandWidth}px;right:0px;`}></div>
                <div
                  class="tweakers-timeline-loop-band"
                  data-live={loopDrag ? 'true' : undefined}
                  style={`left:${bandLeft}px;width:${bandWidth}px;`}
                ></div>
              {/if}
            {/if}
            {#each ticks.fine as time}
              <div class="tweakers-timeline-tick tweakers-timeline-tick-fine" style:left={`${(time - safeViewStart) * pxPerSecond}px`}></div>
            {/each}
            {#each ticks.medium as time}
              <div class="tweakers-timeline-tick tweakers-timeline-tick-medium" style:left={`${(time - safeViewStart) * pxPerSecond}px`}></div>
            {/each}
            {#each ticks.major as time}
              <div class="tweakers-timeline-tick" style:left={`${(time - safeViewStart) * pxPerSecond}px`}>
                <span class="tweakers-timeline-tick-label">{formatRulerSeconds(time, ticks.majorStep)}</span>
              </div>
            {/each}
          </div>
        </div>

        {#each rows as row (row.key)}
          {#if row.kind === 'group'}
            <div class="tweakers-timeline-row tweakers-timeline-group-row">
              <div class="tweakers-timeline-label">
                <button
                  class="tweakers-timeline-group-toggle"
                  data-open={!row.collapsed}
                  onclick={() => toggleGroup(row.group)}
                  title={row.collapsed ? 'Expand layer' : 'Collapse layer'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d={ICON_CHEVRON} />
                  </svg>
                </button>
                <span>{formatLabel(row.group)}</span>
              </div>
              <div class="tweakers-timeline-lane"></div>
            </div>
          {:else if row.kind === 'clip'}
            <div class="tweakers-timeline-row" data-grouped={row.clip.group ? '' : undefined}>
              <div class="tweakers-timeline-label">
                {#if row.clip.tracks?.length}
                  <button
                    class="tweakers-timeline-group-toggle"
                    data-open={row.tracksOpen}
                    onclick={(event) => {
                      event.stopPropagation();
                      toggleTracks(row.clip.key);
                    }}
                    title={row.tracksOpen ? 'Collapse properties' : 'Expand properties'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d={ICON_CHEVRON} />
                    </svg>
                  </button>
                {/if}
                {row.clip.label}
              </div>
              <div class="tweakers-timeline-lane">
                <TimelineClip
                  timelineId={meta.id}
                  clip={row.clip}
                  at={row.stat.at}
                  duration={row.stat.duration}
                  loop={row.stat.loop}
                  steps={row.clip.stepKeys?.length ? row.stat.tracks[0]?.steps : undefined}
                  fixedDuration={row.clip.tracks?.length ? true : row.stat.isPhysics}
                  composite={Boolean(row.clip.tracks?.length)}
                  {pxPerSecond}
                  viewStart={safeViewStart}
                  timelineDuration={meta.duration}
                  selected={row.selected}
                  selectedStepKey={row.selected ? popover?.stepKey : undefined}
                  onClick={handleBarClick}
                  onDrag={() => { popover = null; }}
                />
              </div>
            </div>
          {:else}
            <div class="tweakers-timeline-row tweakers-timeline-track-row" data-grouped={row.parent.group ? '' : undefined}>
              <div class="tweakers-timeline-label">{formatLabel(row.track.prop ?? '')}</div>
              <div class="tweakers-timeline-lane">
                <TimelineClip
                  timelineId={meta.id}
                  clip={row.clip}
                  at={row.stat.at + row.track.delay}
                  duration={row.track.duration}
                  loop={row.stat.loop}
                  steps={row.clip.stepKeys?.length ? row.track.steps : undefined}
                  fixedDuration={!row.clip.stepKeys?.length && row.track.steps[0]?.isPhysics === true}
                  baseAt={row.stat.at}
                  delayMode={true}
                  {pxPerSecond}
                  viewStart={safeViewStart}
                  timelineDuration={meta.duration}
                  selected={row.selected}
                  selectedStepKey={row.selected ? popover?.stepKey : undefined}
                  onClick={openClipPopover}
                  onDrag={() => { popover = null; }}
                />
              </div>
            </div>
          {/if}
        {/each}

        {#if pxPerSecond > 0 && playheadVisible}
          <div
            class="tweakers-timeline-playhead-control"
            data-edge={playheadEdge}
            style={`left:calc(var(--tweak-timeline-label-w) + ${playheadX}px);--tweak-timeline-playhead-flag-offset:${playheadFlagOffset}px;`}
            onpointerdown={handlePlayheadPointerDown}
            onpointermove={(event) => playheadScrub && seek(playheadScrub, event.clientX)}
            onpointerup={finishPlayhead}
            onpointercancel={finishPlayhead}
            onlostpointercapture={finishPlayhead}
            role="slider"
            tabindex="0"
            aria-label="Timeline current time"
            aria-valuemin={0}
            aria-valuemax={meta.duration}
            aria-valuenow={transport.time}
            title="Drag to scrub the timeline"
          >
            <div class="tweakers-timeline-playhead-stem"></div>
            <div class="tweakers-timeline-playhead-anchor">
              <div class="tweakers-timeline-playhead-flag">{transport.time.toFixed(2)}</div>
            </div>
          </div>
        {/if}
      </div>
      {#if zoom > 1}
        <div class="tweakers-timeline-scroll-row">
          <div class="tweakers-timeline-label"></div>
          <div
            bind:this={horizontalScrollElement}
            class="tweakers-timeline-horizontal-scroll"
            onscroll={handleHorizontalScroll}
            aria-label="Timeline horizontal scroll"
          >
            <div style:width={`${laneWidth * zoom}px`}></div>
          </div>
        </div>
      {/if}
    </div>
  {/if}

  {#if popover}
    <ClipPopover panelId={meta.id} {popover} {values} {theme} onClose={() => { popover = null; }} />
  {/if}
</div>
