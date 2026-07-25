import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TimelineStore } from './store/TimelineStore';
import { TimelineUiStore } from './store/TimelineUiStore';

const near = (actual: number, expected: number, eps = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= eps, `expected ${actual} ≈ ${expected}`);

const meta = (id: string, duration = 2) => ({
  id,
  name: id,
  duration,
  loop: false,
  loopStart: 0,
  clips: [],
});

describe('TimelineStore', () => {
  it('ignores non-finite seeks and sanitizes invalid durations', () => {
    const id = 'store-finite-values';
    TimelineStore.register(meta(id), { autoplay: false });
    TimelineStore.seek(id, 1.25);
    assert.equal(TimelineStore.getTransport(id).time, 1.25);

    TimelineStore.seek(id, Number.NaN);
    assert.equal(TimelineStore.getTransport(id).time, 1.25);

    TimelineStore.update(meta(id, Number.POSITIVE_INFINITY));
    assert.deepEqual(TimelineStore.getTransport(id), {
      time: 0,
      playing: false,
      duration: 0,
      wraps: 0,
    });
    TimelineStore.unregister(id);
  });

  it('normalizes, clears, and reads back a loop region', () => {
    const id = 'store-loop-region';
    TimelineStore.register(meta(id, 10), { autoplay: false });

    // Out of order + out of range → clamped to [0,10] and ordered.
    TimelineStore.setLoopRegion(id, 8, 2);
    assert.deepEqual(TimelineStore.getLoopRegion(id), { start: 2, end: 8 });
    TimelineStore.setLoopRegion(id, -5, 12);
    assert.deepEqual(TimelineStore.getLoopRegion(id), { start: 0, end: 10 });

    // Degenerate width is ignored (treated as a click, not a loop).
    TimelineStore.setLoopRegion(id, 3, 3.001);
    assert.deepEqual(TimelineStore.getLoopRegion(id), { start: 0, end: 10 });

    TimelineStore.clearLoopRegion(id);
    assert.equal(TimelineStore.getLoopRegion(id), undefined);
    TimelineStore.unregister(id);
  });

  it('loops the whole timeline by default (no play-once stop)', () => {
    const id = 'store-default-loop';
    const originalWindow = (globalThis as { window?: unknown }).window;
    let frame: ((now: number) => void) | undefined;
    (globalThis as { window?: unknown }).window = {
      requestAnimationFrame(callback: (now: number) => void) {
        frame = callback;
        return 1;
      },
    };
    try {
      const before = performance.now();
      // loop:false in meta — the store must still wrap, not stop at the end.
      TimelineStore.register(meta(id, 2), { autoplay: true });
      assert.ok(frame, 'autoplay schedules a frame');
      frame!(before + 2_500); // 2.5s into a 2s timeline
      const t = TimelineStore.getTransport(id);
      assert.equal(t.playing, true, 'still playing after passing the end');
      near(t.time, 0.5);
      assert.equal(t.wraps, 1);
      TimelineStore.unregister(id);
      frame!(before + 2_600);
    } finally {
      if (originalWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window?: unknown }).window = originalWindow;
      }
    }
  });

  it('advances by wall time after a delayed animation frame', () => {
    const id = 'store-wall-time';
    const originalWindow = (globalThis as { window?: unknown }).window;
    let frame: ((now: number) => void) | undefined;
    (globalThis as { window?: unknown }).window = {
      requestAnimationFrame(callback: (now: number) => void) {
        frame = callback;
        return 1;
      },
    };

    try {
      const before = performance.now();
      TimelineStore.register(meta(id, 5), { autoplay: true });
      assert.ok(frame, 'autoplay schedules a frame');
      frame!(before + 1_500);
      assert.ok(
        TimelineStore.getTransport(id).time > 1.4,
        `expected wall-clock progress, got ${TimelineStore.getTransport(id).time}`
      );
      TimelineStore.unregister(id);
      frame!(before + 1_600);
    } finally {
      if (originalWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window?: unknown }).window = originalWindow;
      }
    }
  });
});

describe('TimelineUiStore', () => {
  it('supports toolkit-driven uncontrolled visibility', () => {
    const controller = Symbol('uncontrolled');
    const changes: boolean[] = [];
    const unregister = TimelineUiStore.registerController(controller, {
      defaultVisible: false,
      onVisibilityChange: (visible) => changes.push(visible),
    });

    assert.equal(TimelineUiStore.getVisible(), false);
    TimelineUiStore.requestVisible(true);
    assert.equal(TimelineUiStore.getVisible(), true);
    assert.deepEqual(changes, [true]);
    unregister();
  });

  it('requests rather than mutates controlled visibility', () => {
    const controller = Symbol('controlled');
    const changes: boolean[] = [];
    const unregister = TimelineUiStore.registerController(controller, {
      visible: true,
      defaultVisible: true,
      onVisibilityChange: (visible) => changes.push(visible),
    });

    TimelineUiStore.requestVisible(false);
    assert.equal(TimelineUiStore.getVisible(), true);
    assert.deepEqual(changes, [false]);

    TimelineUiStore.updateController(controller, {
      visible: false,
      defaultVisible: true,
      onVisibilityChange: (visible) => changes.push(visible),
    });
    assert.equal(TimelineUiStore.getVisible(), false);
    unregister();
  });
});
