// Playback transport + registry for Tweakers timelines.
// Clip values (at/duration/from/to) live in TweakStore under the timeline's
// panel id — this store only owns time: the clock, play state, and the
// track/clip structure the dock UI renders.

import {
  clearPersisted,
  loadPersisted,
  resolvePersistTarget,
  savePersisted,
  type PersistConfig,
  type PersistTarget,
} from './persist';

export type TimelineClipTrackMeta = {
  prop: string;
  /** Step folder keys when the track is a sequence. */
  stepKeys?: string[];
};

export type TimelineClipMeta = {
  key: string; // config path; also the TweakStore path prefix, e.g. "cardEnter" or "circle.path"
  label: string;
  color: string;
  /** Code-defined playback behavior; intentionally not exposed as a control. */
  loop: 'off' | 'repeat';
  /** Group key when the clip lives inside a nested layer, e.g. "circle". */
  group?: string;
  /** Step folder keys for sequence clips, e.g. ["step1", "step2"]. */
  stepKeys?: string[];
  /** Independent property tracks of a props clip — full rows when expanded. */
  tracks?: TimelineClipTrackMeta[];
};

export type TimelineMeta = {
  id: string; // same id as the TweakStore panel
  name: string;
  duration: number; // seconds
  loop: boolean;
  /** Loop wraps back to this time, not 0 — clips before it play once
   * (intro-then-idle). 0 loops the whole timeline. */
  loopStart: number;
  clips: TimelineClipMeta[]; // one row each
};

export type TimelineTransport = {
  time: number;
  playing: boolean;
  duration: number;
  /** Completed loop passes — keeps looping clips phase-continuous across
   * timeline wraps. Reset by seek/replay so scrubbing stays deterministic. */
  wraps: number;
};

type Listener = () => void;

/** A user- or code-defined loop window `[start, end]` in seconds. Absent means
 * "loop the whole timeline" — the default for this preview tool. */
export type TimelineLoopRegion = { start: number; end: number };

/** Regions narrower than this (in seconds) are treated as a click, not a loop. */
const MIN_LOOP_REGION = 0.02;

/** Length of the repeating span for a loop region `[start, end]` (end defaults
 * to the whole timeline). Degenerate regions (empty or inverted) fall back to
 * the whole timeline so a bad region never stalls the clock. */
export function loopSpan(duration: number, loopStart: number, loopEnd?: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  if (!Number.isFinite(loopStart)) loopStart = 0;
  const end = Number.isFinite(loopEnd as number)
    ? Math.min(Math.max(0, loopEnd as number), duration)
    : duration;
  const start = Math.min(Math.max(0, loopStart), duration);
  const span = end - start;
  return span > 0 ? span : duration;
}

/** Folds an over-run playhead back into the loop region `[start, end]` (end
 * defaults to the timeline end), reporting how many spans were crossed so
 * continuous time (wraps × span + time) never jumps at the wrap. */
export function foldLoopTime(
  time: number,
  duration: number,
  loopStart = 0,
  loopEnd?: number
): { time: number; wraps: number } {
  if (!Number.isFinite(time) || !Number.isFinite(duration) || duration <= 0) {
    return { time: 0, wraps: 0 };
  }
  const end = Number.isFinite(loopEnd as number)
    ? Math.min(Math.max(0, loopEnd as number), duration)
    : duration;
  if (time < end) return { time, wraps: 0 };
  const span = loopSpan(duration, loopStart, end);
  const base = end - span;
  const over = time - base;
  return { time: base + (over % span), wraps: Math.floor(over / span) };
}

export const TIMELINE_CLIP_COLORS = [
  '#E8E8E8', // neutral white — slightly off-white so the pure-white selection ring still reads
];

const EMPTY_TRANSPORT: TimelineTransport = Object.freeze({ time: 0, playing: false, duration: 0, wraps: 0 });

class TimelineStoreClass {
  private timelines: Map<string, TimelineMeta> = new Map();
  private transports: Map<string, TimelineTransport> = new Map();
  private listeners: Map<string, Set<Listener>> = new Map();
  private globalListeners: Set<Listener> = new Set();
  private registrationCounts: Map<string, number> = new Map();
  // User-defined loop windows. Absent = loop the whole timeline. The stored
  // object reference is stable until set/clear so useSyncExternalStore readers
  // don't churn.
  private loopRegions: Map<string, TimelineLoopRegion> = new Map();
  private persistTargets: Map<string, PersistTarget | null> = new Map();
  private listCache: TimelineMeta[] | null = null;
  private rafId: number | null = null;
  private lastTick = 0;

  register(meta: TimelineMeta, options: { autoplay: boolean; persist?: PersistConfig }): void {
    const existing = this.timelines.get(meta.id);
    if (existing && existing.name !== meta.name) {
      console.warn(
        `[tweakers] Timeline id "${meta.id}" is already registered by "${existing.name}"; ` +
        `"${meta.name}" will share and overwrite that transport.`
      );
    }
    const firstRegistration = !this.registrationCounts.has(meta.id);
    this.registrationCounts.set(meta.id, (this.registrationCounts.get(meta.id) ?? 0) + 1);
    if (firstRegistration) {
      this.persistTargets.set(meta.id, resolvePersistTarget('timeline-loop', meta.id, options.persist));
      this.hydrateLoopRegion(meta);
    }
    this.applyMeta(meta, options.autoplay);
  }

  update(meta: TimelineMeta): void {
    if (!this.timelines.has(meta.id)) return;
    this.applyMeta(meta, false);
  }

  unregister(id: string): void {
    const nextCount = (this.registrationCounts.get(id) ?? 1) - 1;
    if (nextCount > 0) {
      this.registrationCounts.set(id, nextCount);
      return;
    }

    this.registrationCounts.delete(id);
    this.timelines.delete(id);
    this.transports.delete(id);
    this.loopRegions.delete(id);
    this.persistTargets.delete(id);
    // Keep listener sets: subscribers (e.g. a mounted dock) may outlive the
    // registration — HMR tears down and re-registers the same id, and their
    // subscriptions must survive it. Cleanup happens via unsubscribe closures.
    if (this.listeners.get(id)?.size === 0) this.listeners.delete(id);
    this.listCache = null;
    this.notifyGlobal();
  }

  /** Restore a persisted loop region, or seed one from a code-defined
   * `options.loop`. No region at all = loop the whole timeline (the default). */
  private hydrateLoopRegion(meta: TimelineMeta): void {
    const duration = Number.isFinite(meta.duration) ? Math.max(0, meta.duration) : 0;
    const persisted = loadPersisted<TimelineLoopRegion>(this.persistTargets.get(meta.id) ?? null);
    if (persisted && Number.isFinite(persisted.start) && Number.isFinite(persisted.end)) {
      const region = this.normalizeRegion(persisted.start, persisted.end, duration);
      if (region) this.loopRegions.set(meta.id, region);
      return;
    }
    // Code-seeded region (e.g. options.loop = { from }). Ephemeral — not
    // persisted — so "deactivate" always returns to full-timeline looping.
    if (meta.loop) {
      const region = this.normalizeRegion(meta.loopStart, duration, duration);
      if (region) this.loopRegions.set(meta.id, region);
    }
  }

  /** Clamp to [0,duration], order min/max, and reject degenerate widths. */
  private normalizeRegion(start: number, end: number, duration: number): TimelineLoopRegion | null {
    if (!Number.isFinite(start) || !Number.isFinite(end) || duration <= 0) return null;
    const lo = Math.min(Math.max(0, Math.min(start, end)), duration);
    const hi = Math.min(Math.max(0, Math.max(start, end)), duration);
    if (hi - lo < MIN_LOOP_REGION) return null;
    return { start: lo, end: hi };
  }

  setLoopRegion(id: string, start: number, end: number): void {
    const transport = this.transports.get(id);
    const duration = transport?.duration ?? this.timelines.get(id)?.duration ?? 0;
    const region = this.normalizeRegion(start, end, duration);
    if (!region) return;
    this.loopRegions.set(id, region);
    savePersisted(this.persistTargets.get(id) ?? null, region);
    this.notify(id);
  }

  clearLoopRegion(id: string): void {
    if (!this.loopRegions.has(id)) return;
    this.loopRegions.delete(id);
    clearPersisted(this.persistTargets.get(id) ?? null);
    this.notify(id);
  }

  /** The raw user/code region, or undefined when looping the whole timeline.
   * The reference is stable between changes (safe for useSyncExternalStore). */
  getLoopRegion(id: string): TimelineLoopRegion | undefined {
    return this.loopRegions.get(id);
  }

  /** The region the clock actually loops within: the user/code region, or the
   * whole timeline `[0, duration]` when none is set. Playback always wraps. */
  private effectiveRegion(id: string, duration: number): TimelineLoopRegion {
    const region = this.loopRegions.get(id);
    if (region) return region;
    return { start: 0, end: Math.max(0, duration) };
  }

  play(id: string): void {
    const transport = this.transports.get(id);
    if (!transport || transport.duration <= 0 || transport.playing) return;
    // Play from the loop start when the playhead is parked at (or past) the
    // loop end — for the default full-timeline loop that means restart from 0.
    const region = this.effectiveRegion(id, transport.duration);
    const restart = transport.time >= region.end;
    this.transports.set(id, {
      ...transport,
      time: restart ? region.start : transport.time,
      wraps: restart ? 0 : transport.wraps,
      playing: true,
    });
    this.notify(id);
    this.ensureLoop();
  }

  pause(id: string): void {
    const transport = this.transports.get(id);
    if (!transport || !transport.playing) return;
    this.transports.set(id, { ...transport, playing: false });
    this.notify(id);
  }

  replay(id: string): void {
    const transport = this.transports.get(id);
    if (!transport || transport.duration <= 0) return;
    // Replay = jump to the loop's beginning (0 for a full-timeline loop).
    const region = this.effectiveRegion(id, transport.duration);
    this.transports.set(id, { ...transport, time: region.start, wraps: 0, playing: true });
    this.notify(id);
    this.ensureLoop();
  }

  seek(id: string, time: number): void {
    const transport = this.transports.get(id);
    if (!transport || !Number.isFinite(time)) return;
    const clamped = Math.min(transport.duration, Math.max(0, time));
    // Scrubbing pins the deterministic first-pass state
    this.transports.set(id, { ...transport, time: clamped, wraps: 0 });
    this.notify(id);
  }

  getTransport(id: string): TimelineTransport {
    return this.transports.get(id) ?? EMPTY_TRANSPORT;
  }

  getTimeline(id: string): TimelineMeta | undefined {
    return this.timelines.get(id);
  }

  getTimelines(): TimelineMeta[] {
    if (!this.listCache) {
      this.listCache = Array.from(this.timelines.values());
    }
    return this.listCache;
  }

  subscribe(id: string, listener: Listener): () => void {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }
    this.listeners.get(id)!.add(listener);
    return () => {
      const listeners = this.listeners.get(id);
      listeners?.delete(listener);
      if (listeners?.size === 0 && !this.timelines.has(id)) {
        this.listeners.delete(id);
      }
    };
  }

  subscribeGlobal(listener: Listener): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  private applyMeta(meta: TimelineMeta, autoplay: boolean): void {
    const duration = Number.isFinite(meta.duration) ? Math.max(0, meta.duration) : 0;
    const loopStart = Number.isFinite(meta.loopStart)
      ? Math.min(duration, Math.max(0, meta.loopStart))
      : 0;
    const safeMeta = { ...meta, duration, loopStart };
    this.timelines.set(meta.id, safeMeta);

    // Re-clamp any loop region to the new length; drop it if it no longer fits.
    const region = this.loopRegions.get(meta.id);
    if (region) {
      const reclamped = this.normalizeRegion(region.start, region.end, duration);
      if (reclamped) this.loopRegions.set(meta.id, reclamped);
      else this.loopRegions.delete(meta.id);
    }

    const existing = this.transports.get(meta.id);
    if (existing) {
      // Structure changed or remounted — keep the playhead, clamp to the new length
      this.transports.set(meta.id, {
        time: Math.min(existing.time, duration),
        playing: duration > 0 && existing.playing,
        duration,
        wraps: existing.wraps,
      });
    } else {
      const playing = duration > 0 && autoplay;
      this.transports.set(meta.id, { time: 0, playing, duration, wraps: 0 });
      if (playing) this.ensureLoop();
    }

    this.listCache = null;
    this.notify(meta.id);
    this.notifyGlobal();
  }

  private ensureLoop(): void {
    if (this.rafId !== null || typeof window === 'undefined') return;
    this.lastTick = performance.now();
    this.rafId = window.requestAnimationFrame(this.tick);
  }

  private tick = (now: number): void => {
    // Advance by wall time. A backgrounded tab lands at the state it would
    // have reached, rather than silently slowing the animation on return.
    const dt = Math.max(0, (now - this.lastTick) / 1000);
    this.lastTick = now;

    let anyPlaying = false;
    for (const [id, transport] of this.transports) {
      if (!transport.playing) continue;

      const meta = this.timelines.get(id);
      const duration = meta?.duration ?? transport.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        this.transports.set(id, { time: 0, playing: false, duration: 0, wraps: 0 });
        this.notify(id);
        continue;
      }
      let time = transport.time + dt;
      let wraps = transport.wraps;

      // This preview tool always loops: no user region loops the whole
      // timeline (restart from 0), a region loops within [start, end].
      const region = this.effectiveRegion(id, duration);
      if (time >= region.end) {
        const folded = foldLoopTime(time, duration, region.start, region.end);
        time = folded.time;
        wraps += folded.wraps;
      }

      this.transports.set(id, { time, playing: true, duration, wraps });
      anyPlaying = true;
      this.notify(id);
    }

    this.rafId = anyPlaying ? window.requestAnimationFrame(this.tick) : null;
  };

  private notify(id: string): void {
    this.listeners.get(id)?.forEach((fn) => fn());
  }

  private notifyGlobal(): void {
    this.globalListeners.forEach((fn) => fn());
  }
}

// PURE lets bundlers drop the timeline entirely for panel-only users.
export const TimelineStore = /* @__PURE__ */ new TimelineStoreClass();
