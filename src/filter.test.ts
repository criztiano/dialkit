import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterHand01, filterResponsePath, filterShapeResponse, normalizeFilterValue, resolveFilterAxis } from './filter';
import { liveConfigOf, subscribeLiveConfigs, syncLiveConfigs } from './live-config';
import { DialStore, resolveDialValues, type DialConfig, type DialFilterValue, type ResolvedValues } from './store/DialStore';

describe('filter', () => {
  it('opens the filter by default and clamps hands into their axes', () => {
    assert.deepEqual(normalizeFilterValue(undefined), { cutoff: 1, resonance: 0 });
    const axes = { cutoff: { min: 20, max: 20000, step: 1 }, resonance: { min: 0.1, max: 10, default: 0.7 } };
    assert.deepEqual(normalizeFilterValue(undefined, axes), { cutoff: 20000, resonance: 0.7 });
    assert.deepEqual(normalizeFilterValue({ cutoff: 440.4, resonance: 99 }, axes), { cutoff: 440, resonance: 10 });
    assert.equal(filterHand01(5.05, resolveFilterAxis(axes.resonance, 'resonance')), 0.5);
    assert.equal(resolveFilterAxis(undefined, 'cutoff').label, 'Freq');
  });

  it('draws a lowpass that passes the lows and falls off past the knee', () => {
    const lowpass = filterShapeResponse('lowpass', 0.5, 0);
    assert.ok(lowpass(0) > 0.55 && lowpass(0) < 0.65);
    assert.ok(lowpass(1) < lowpass(0.5));
    assert.ok(filterShapeResponse('highpass', 0.5, 0)(0) < filterShapeResponse('highpass', 0.5, 0)(1));
    // Resonance grows a peak at the knee.
    assert.ok(filterShapeResponse('lowpass', 0.5, 1)(0.5) > lowpass(0.5));
    const path = filterResponsePath({}, { cutoff: 1, resonance: 0 })!;
    assert.match(path, /^M 0\.00 \d/);
    assert.equal(path.split('L').length, 96);
    assert.equal(filterResponsePath({ response: () => () => NaN }, { cutoff: 1, resonance: 0 }), null);
    assert.equal(filterResponsePath({ response: () => { throw new Error('no'); } }, { cutoff: 1, resonance: 0 }), null);
  });

  it('stores a typed { cutoff, resonance } value that resets and survives config edits', () => {
    const config = {
      tone: { type: 'filter', cutoff: { min: 20, max: 20000, step: 1, unit: ' Hz' }, default: { cutoff: 800 } },
    } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    const tone: DialFilterValue = values.tone;
    assert.deepEqual(tone, { cutoff: 800, resonance: 0 });
    const id = 'filter-store';
    try {
      DialStore.registerPanel(id, 'Filter', config);
      assert.equal(DialStore.getPanel(id)!.controls[0].type, 'filter');
      DialStore.updateValue(id, 'tone', { cutoff: 50000, resonance: 0.5 });
      assert.deepEqual(DialStore.getValues(id).tone, { cutoff: 20000, resonance: 0.5 });
      DialStore.updatePanel(id, 'Filter', { tone: { ...config.tone, cutoff: { min: 20, max: 2000, step: 1 } } });
      assert.deepEqual(DialStore.getValues(id).tone, { cutoff: 2000, resonance: 0.5 });
      DialStore.resetValues(id);
      assert.deepEqual(DialStore.getValues(id).tone, { cutoff: 800, resonance: 0 });
    } finally { DialStore.unregisterPanel(id); }
  });

  it('swaps in a fresh response without rebuilding the panel', () => {
    const first = () => () => 0.25;
    const config = { group: { tone: { type: 'filter', response: first } } } satisfies DialConfig;
    const id = 'filter-live';
    let calls = 0;
    const off = subscribeLiveConfigs(id, () => calls++);
    try {
      DialStore.registerPanel(id, 'Filter', config);
      const control = DialStore.getControl(id, 'group.tone')!;
      syncLiveConfigs(id, config);
      assert.equal(calls, 0);
      const second = () => () => 0.75;
      syncLiveConfigs(id, { group: { tone: { type: 'filter', response: second } } });
      assert.equal(calls, 1);
      assert.equal(liveConfigOf(id, control, 'filter')?.response, second);
    } finally { off(); DialStore.unregisterPanel(id); }
  });
});
