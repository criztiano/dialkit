import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clampNumber, normalizeNumberValue, numberKeyValue, scrubNumber } from './number';
import { DialStore, resolveDialValues, withVisibility, type DialConfig, type ResolvedValues } from './store/DialStore';

describe('number maths', () => {
  it('clamps only to the bounds that are set', () => {
    assert.equal(clampNumber(-50), -50);
    assert.equal(clampNumber(-50, 0), 0);
    assert.equal(clampNumber(50, undefined, 10), 10);
  });

  it('scrubs a step per pixel, ten with Shift and a tenth with Alt, and stops at a bound', () => {
    assert.equal(scrubNumber(1, 20, 0.1), 3);
    assert.equal(scrubNumber(1, 20, 0.1, undefined, undefined, 'shift'), 21);
    assert.equal(scrubNumber(1, 20, 0.1, undefined, undefined, 'alt'), 1.2);
    assert.equal(scrubNumber(1, -40, 0.1, 0), 0);
    assert.equal(scrubNumber(-6, -10, 1), -16);
  });

  it('steps with the arrow keys, ten with Shift, and goes to a set bound with Home and End', () => {
    assert.equal(numberKeyValue('ArrowUp', 2, 0.5), 2.5);
    assert.equal(numberKeyValue('ArrowLeft', 2, 0.5, undefined, undefined, true), -3);
    assert.equal(numberKeyValue('ArrowDown', 0, 1, 0), 0);
    assert.equal(numberKeyValue('Home', 4, 1, -10), -10);
    assert.equal(numberKeyValue('Home', 4, 1), undefined);
    assert.equal(numberKeyValue('Enter', 4, 1), undefined);
  });

  it('keeps a finite stored value, clamped and stepped, and drops anything else', () => {
    assert.equal(normalizeNumberValue(12.345, 0, 0.1, 0, 10), 10);
    assert.equal(normalizeNumberValue(3.14159, 0, 0.01), 3.14);
    assert.equal(normalizeNumberValue('3', 5, 1), 5);
    assert.equal(normalizeNumberValue(Infinity, 5, 1), 5);
  });
});

describe('number controls', () => {
  it('parses the old syntax with open bounds, types its value as a number, and infers a step', () => {
    const config = {
      trim: { type: 'number', default: -6, unit: ' dB', step: 0.5 },
      seed: { type: 'number', default: 42, min: 0 },
      gain: { type: 'number', default: 0.5, orientation: 'vertical' },
    } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    const trim: number = values.trim;
    assert.equal(trim, -6);
    const id = 'number-parse';
    try {
      DialStore.registerPanel(id, 'Number', config);
      const [trimMeta, seedMeta, gainMeta] = DialStore.getPanel(id)!.controls;
      assert.deepEqual([trimMeta.type, trimMeta.min, trimMeta.max, trimMeta.step, trimMeta.unit], ['number', undefined, undefined, 0.5, ' dB']);
      assert.deepEqual([seedMeta.min, seedMeta.step], [0, 1]);
      assert.deepEqual([gainMeta.step, gainMeta.orientation], [0.01, 'vertical']);
      assert.deepEqual(DialStore.getValues(id), { trim: -6, seed: 42, gain: 0.5 });
    } finally { DialStore.unregisterPanel(id); }
  });

  it('resets, keeps a value in a version, re-steps it on re-registration, and hides with visibleWhen', () => {
    const id = 'number-store';
    const config = { on: true, seed: withVisibility({ type: 'number', default: 1, min: 0, step: 1 }, { field: 'on', is: true }) } satisfies DialConfig;
    try {
      DialStore.registerPanel(id, 'Number', config);
      DialStore.updateValue(id, 'seed', 900);
      const version = DialStore.savePreset(id, 'Big');
      DialStore.resetValues(id);
      assert.equal(DialStore.getValue(id, 'seed'), 1);
      DialStore.loadPreset(id, version);
      assert.equal(DialStore.getValue(id, 'seed'), 900);
      DialStore.updatePanel(id, 'Number', { ...config, seed: withVisibility({ type: 'number', default: 1, min: 0, max: 100, step: 1 }, { field: 'on', is: true }) });
      assert.equal(DialStore.getValue(id, 'seed'), 100);
      DialStore.updateValue(id, 'on', false);
      assert.deepEqual(DialStore.getPanel(id)!.controls.map(c => c.path), ['on']);
    } finally { DialStore.unregisterPanel(id); }
  });
});
