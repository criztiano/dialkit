import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clampRange, isOutsideSpan, nearestHandle, normalizeRangeValue, pickDragTarget, rangeHandleLefts, setHigh, setLow, shiftSpan,
} from './range';
import { DialStore, flattenDialValueUpdates, resolveDialValues, withVisibility, type DialConfig, type RangeValue, type ResolvedValues } from './store/DialStore';

describe('range maths', () => {
  it('clamps both ends to the track and orders a reversed pair', () => {
    assert.deepEqual(clampRange({ min: -5, max: 20 }, 0, 10), { min: 0, max: 10 });
    assert.deepEqual(clampRange({ min: 8, max: 2 }, 0, 10), { min: 2, max: 8 });
  });

  it('stops a handle at the other handle and at the track', () => {
    const current = { min: 2, max: 6 };
    assert.deepEqual(setLow(9, current, 0), { min: 6, max: 6 });
    assert.deepEqual(setLow(-3, current, 0), { min: 0, max: 6 });
    assert.deepEqual(setHigh(1, current, 10), { min: 2, max: 2 });
    assert.deepEqual(setHigh(30, current, 10), { min: 2, max: 10 });
  });

  it('moves the span with its width, and parks it flush at an edge', () => {
    assert.deepEqual(shiftSpan(3, { min: 2, max: 4 }, 0, 10), { min: 5, max: 7 });
    assert.deepEqual(shiftSpan(30, { min: 2, max: 4 }, 0, 10), { min: 8, max: 10 });
    assert.deepEqual(shiftSpan(-30, { min: 2, max: 4 }, 0, 10), { min: 0, max: 2 });
  });

  it('grabs the nearer handle, the span inside it, and breaks a tie by side', () => {
    const current = { min: 2, max: 8 };
    assert.equal(pickDragTarget(2.3, current, 0.5), 'min');
    assert.equal(pickDragTarget(7.8, current, 0.5), 'max');
    assert.equal(pickDragTarget(5, current, 0.5), 'span');
    assert.equal(pickDragTarget(9.5, current, 0.5), 'max');
    const collapsed = { min: 5, max: 5 };
    assert.equal(nearestHandle(4, collapsed), 'min');
    assert.equal(nearestHandle(6, collapsed), 'max');
    assert.equal(isOutsideSpan(1, current), true);
    assert.equal(isOutsideSpan(5, current), false);
  });

  it('keeps two handles apart on a collapsed range', () => {
    assert.deepEqual(rangeHandleLefts(0, 0), {
      low: 'clamp(2px, min(calc(0% + 6px), calc(0% - 4px)), calc(100% - 10px))',
      high: 'clamp(7px, max(calc(0% - 9px), calc(0% + 1px)), calc(100% - 5px))',
    });
  });

  it('falls back to the default, then the full track, for a malformed value', () => {
    assert.deepEqual(normalizeRangeValue({ min: 3, max: 1 }, { min: 0, max: 10 }), { min: 1, max: 3 });
    assert.deepEqual(normalizeRangeValue('3-4', { min: 0, max: 10, default: { min: 2, max: 4 } }), { min: 2, max: 4 });
    assert.deepEqual(normalizeRangeValue({ min: NaN, max: 1 }, { min: 0, max: 10 }), { min: 0, max: 10 });
  });
});

describe('range controls', () => {
  it('parses the old syntax, types its value, and defaults to the full track', () => {
    const config = {
      band: { type: 'range', min: 20, max: 20000, default: { min: 200, max: 8000 }, step: 10 },
      window: { type: 'range', min: 0, max: 1 },
    } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    const band: RangeValue = values.band;
    assert.deepEqual(band, { min: 200, max: 8000 });
    assert.deepEqual(values.window, { min: 0, max: 1 });
    assert.deepEqual(flattenDialValueUpdates(config, { band: { min: 100, max: 200 } }), { band: { min: 100, max: 200 } });
    const id = 'range-parse';
    try {
      DialStore.registerPanel(id, 'Range', config);
      const [bandMeta, windowMeta] = DialStore.getPanel(id)!.controls;
      assert.equal(bandMeta.type, 'range');
      assert.deepEqual([bandMeta.min, bandMeta.max, bandMeta.step, bandMeta.rangeDefault], [20, 20000, 10, { min: 200, max: 8000 }]);
      assert.equal(windowMeta.step, 0.01);
      assert.deepEqual(DialStore.getValues(id), { band: { min: 200, max: 8000 }, window: { min: 0, max: 1 } });
    } finally { DialStore.unregisterPanel(id); }
  });

  it('clamps and orders written values, skips unchanged ones, resets, and keeps a value in a version', () => {
    const id = 'range-store';
    const config = { band: { type: 'range', min: 0, max: 10, default: { min: 2, max: 4 } } } satisfies DialConfig;
    try {
      DialStore.registerPanel(id, 'Range', config);
      let writes = 0;
      const unsubscribe = DialStore.subscribe(id, () => writes++);
      DialStore.updateValue(id, 'band', { min: 9, max: -1 });
      DialStore.updateValue(id, 'band', { min: 0, max: 9 });
      unsubscribe();
      assert.equal(writes, 1);
      assert.deepEqual(DialStore.getValue(id, 'band'), { min: 0, max: 9 });
      const version = DialStore.savePreset(id, 'Wide');
      DialStore.resetValues(id);
      assert.deepEqual(DialStore.getValue(id, 'band'), { min: 2, max: 4 });
      DialStore.loadPreset(id, version);
      assert.deepEqual(DialStore.getValue(id, 'band'), { min: 0, max: 9 });
      // A re-registration keeps a valid value, clamped to a narrower track.
      DialStore.updatePanel(id, 'Range', { band: { type: 'range', min: 1, max: 5 } });
      assert.deepEqual(DialStore.getValue(id, 'band'), { min: 1, max: 5 });
    } finally { DialStore.unregisterPanel(id); }
  });

  it('shows and hides with visibleWhen', () => {
    const id = 'range-visibility';
    const config = { on: true, band: withVisibility({ type: 'range', min: 0, max: 1 }, { field: 'on', is: true }) } satisfies DialConfig;
    try {
      DialStore.registerPanel(id, 'Range', config);
      const visible = () => DialStore.getPanel(id)!.controls.map(c => c.path);
      assert.deepEqual(visible(), ['on', 'band']);
      DialStore.updateValue(id, 'on', false);
      assert.deepEqual(visible(), ['on']);
      assert.deepEqual(resolveDialValues(config, DialStore.getValues(id)).band, { min: 0, max: 1 });
    } finally { DialStore.unregisterPanel(id); }
  });
});
