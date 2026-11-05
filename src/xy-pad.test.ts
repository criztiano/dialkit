import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { xyPadConfig } from './xy-pad';
import { DialStore, resolveDialValues, type DialConfig, type DialPadValue, type ResolvedValues } from './store/DialStore';

describe('xy pad', () => {
  it('maps object axes onto pad tuples, resting bipolar axes in the middle', () => {
    assert.deepEqual(xyPadConfig({ type: 'xy' }), { type: 'pad', x: [0, 0, 1, 0.01], y: [0, 0, 1, 0.01] });
    assert.deepEqual(xyPadConfig({
      type: 'xy',
      x: { min: -180, max: 180, step: 1, bipolar: true, label: 'Yaw' },
      y: { min: 0, max: 3, origin: 1 },
      default: { y: 2 },
      dragLabels: true,
    }), { type: 'pad', x: [0, -180, 180, 1], y: [2, 0, 3, 0.01], labels: { x: 'Yaw', y: undefined }, dragLabels: true });
  });

  it('parses as a pad with a typed { x, y } value that resets and survives config edits', () => {
    const config = {
      tumble: { type: 'xy', x: { min: -180, max: 180, step: 1, bipolar: true }, y: { min: -90, max: 90, step: 1, bipolar: true } },
      flow: { type: 'xy', x: { min: 0, max: 1, label: 'Amount' }, y: { min: 0, max: 3, label: 'Speed' }, default: { x: 0.5, y: 9 } },
    } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    const tumble: DialPadValue = values.tumble;
    assert.deepEqual(tumble, { x: 0, y: 0 });
    // An out-of-range default clamps into its axis.
    assert.deepEqual(values.flow, { x: 0.5, y: 3 });
    const id = 'xy-pad';
    try {
      DialStore.registerPanel(id, 'XY', config);
      const control = DialStore.getPanel(id)!.controls[0];
      assert.equal(control.type, 'pad');
      assert.deepEqual(control.pad?.x, [0, -180, 180, 1]);
      DialStore.updateValue(id, 'tumble', { x: 45.4, y: 200 });
      assert.deepEqual(DialStore.getValues(id).tumble, { x: 45, y: 90 });
      DialStore.updatePanel(id, 'XY', { ...config, tumble: { ...config.tumble, x: { min: 0, max: 30, step: 1 } } });
      assert.deepEqual(DialStore.getValues(id).tumble, { x: 30, y: 90 });
      DialStore.resetValues(id);
      assert.deepEqual(DialStore.getValues(id).flow, { x: 0.5, y: 3 });
    } finally { DialStore.unregisterPanel(id); }
  });
});
