import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { insertPoint, isIdentityTransfer, movePoint, nearestPoint, normalizeTransfer, removePoint, sampleTransfer, transferLut, transferPath } from './transfer';
import { DialStore, resolveDialValues, type DialConfig, type DialTransferValue, type ResolvedValues } from './store/DialStore';

describe('transfer curve', () => {
  it('repairs any value into a sorted curve pinned to both ends', () => {
    assert.deepEqual(normalizeTransfer(undefined).points, [{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    assert.deepEqual(normalizeTransfer({ points: [{ x: 0.9, y: 2 }, { x: 0.5, y: 0.5 }, { x: 0.51, y: 0.4 }, { x: 0.2, y: -1 }] }).points, [
      { x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 1, y: 1 },
    ]);
    const many = { points: Array.from({ length: 20 }, (_, i) => ({ x: i / 19, y: 0.5 })) };
    const capped = normalizeTransfer(many).points;
    assert.equal(capped.length, 12);
    assert.equal(capped[capped.length - 1].x, 1);
  });

  it('interpolates without overshooting the placed values', () => {
    const points = [{ x: 0, y: 0 }, { x: 0.4, y: 1 }, { x: 0.6, y: 1 }, { x: 1, y: 0 }];
    for (let i = 0; i <= 100; i++) assert.ok(sampleTransfer(points, i / 100) <= 1);
    assert.equal(sampleTransfer(points, 0.5), 1);
    assert.equal(sampleTransfer([{ x: 0, y: 0 }, { x: 1, y: 1 }], 0.25), 0.25);
    const lut = transferLut([{ x: 0, y: 0 }, { x: 1, y: 1 }], 5);
    assert.deepEqual(Array.from(lut), [0, 0.25, 0.5, 0.75, 1]);
    assert.match(transferPath([{ x: 0, y: 0 }, { x: 1, y: 1 }]), /^M 0\.00 100\.00 .* L 100\.00 0\.00$/);
  });

  it('adds, moves, finds and removes points; the ends only slide in y', () => {
    const identity = normalizeTransfer(undefined).points;
    const { points, index } = insertPoint(identity, 0.5, 0.8);
    assert.equal(index, 1);
    assert.equal(insertPoint(points, 0.505, 0.2).index, -1);
    assert.deepEqual(movePoint(points, 0, 0.5, 0.3)[0], { x: 0, y: 0.3 });
    // An interior point stays between its neighbours.
    assert.equal(movePoint(points, 1, 2, 0.5)[1].x, 0.98);
    assert.equal(nearestPoint(points, 0.51, 0.79, 0.05), 1);
    assert.equal(nearestPoint(points, 0.3, 0.3, 0.05), -1);
    assert.deepEqual(removePoint(points, 0), points);
    assert.ok(isIdentityTransfer(removePoint(points, 1)));
  });

  it('stores a typed point list that resets and survives config edits', () => {
    const config = { gamma: { type: 'transfer', default: { points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.7 }, { x: 1, y: 1 }] } } } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    const gamma: DialTransferValue = values.gamma;
    assert.equal(gamma.points.length, 3);
    const id = 'transfer-store';
    try {
      DialStore.registerPanel(id, 'Transfer', config);
      assert.equal(DialStore.getPanel(id)!.controls[0].type, 'transfer');
      DialStore.updateValue(id, 'gamma', { points: [{ x: 0.3, y: 1 }, { x: 0.9, y: 0 }] });
      assert.deepEqual(DialStore.getValues(id).gamma, { points: [{ x: 0, y: 1 }, { x: 1, y: 0 }] });
      DialStore.updatePanel(id, 'Transfer', { gamma: { ...config.gamma, height: 140 } });
      assert.deepEqual(DialStore.getValues(id).gamma, { points: [{ x: 0, y: 1 }, { x: 1, y: 0 }] });
      DialStore.resetValues(id);
      assert.deepEqual(DialStore.getValues(id).gamma, values.gamma);
    } finally { DialStore.unregisterPanel(id); }
  });
});
