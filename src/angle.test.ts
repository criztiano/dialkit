import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { angleFromPointer, angleText, angleWraps, arcPath, bearingToValue, normalizeAngle, nudgeAngle, snapAngle, valueToBearing } from './angle';
import { DialStore, resolveDialValues, type DialConfig, type ResolvedValues } from './store/DialStore';

describe('angle maths', () => {
  it('reads a bearing like a compass: up is 0 and it turns clockwise', () => {
    assert.equal(angleFromPointer(0, -20, 0, 0, 360, 1, true), 0);
    assert.equal(angleFromPointer(20, 0, 0, 0, 360, 1, true), 90);
    assert.equal(angleFromPointer(0, 20, 0, 0, 360, 1, true), 180);
    assert.equal(angleFromPointer(-20, 0, 0, 0, 360, 1, true), 270);
    assert.equal(angleFromPointer(1, 1, 0, 0, 360, 1, true), null);
  });

  it('maps any range onto one turn', () => {
    assert.equal(valueToBearing(0, -180, 180), 180);
    assert.equal(bearingToValue(90, 0, 1), 0.25);
    assert.equal(angleFromPointer(20, 0, 0, -180, 180, 1, true), -90);
  });

  it('wraps a full turn and clamps a partial one', () => {
    assert.equal(angleWraps(0, 360), true);
    assert.equal(angleWraps(-180, 180), true);
    assert.equal(angleWraps(0, 90), false);
    assert.equal(angleWraps(0, 360, false), false);
    assert.equal(normalizeAngle(370, 0, 360, true), 10);
    assert.equal(normalizeAngle(360, 0, 360, true), 0);
    assert.equal(normalizeAngle(120, 0, 90, false), 90);
    assert.equal(nudgeAngle(359, 1, 0, 360, 1, true), 0);
    assert.equal(nudgeAngle(85, 10, 0, 90, 1, false), 90);
  });

  it('snaps from the minimum', () => {
    assert.equal(snapAngle(0.4, -180, 1), 0);
    assert.equal(snapAngle(17, 0, 15), 15);
    assert.equal(snapAngle(0.123, 0, 0.05), 0.1);
  });

  it('draws no sweep at the origin and two arcs for a full turn', () => {
    assert.equal(arcPath(0, 0, 8), '');
    assert.match(arcPath(0, 90, 8), /^M 0\.000 -8\.000 A 8 8 0 0 1 8\.000 0\.000$/);
    assert.equal(arcPath(0, 360, 8).split(' A ').length, 3);
  });

  it('shows ° over a half turn unless given a unit or a formatter', () => {
    assert.deepEqual(angleText(45, 0, 360, 1), { value: '45', unit: '°' });
    assert.deepEqual(angleText(0.25, 0, 1, 0.01), { value: '0.25', unit: '' });
    assert.deepEqual(angleText(3, 0, 12, 1, ' h'), { value: '3', unit: ' h' });
    assert.deepEqual(angleText(90, 0, 360, 1, '°', v => `${v / 90}×`), { value: '1×', unit: '' });
  });
});

describe('angle dial controls', () => {
  it("parses the old slider object syntax, display: 'dial' included, and stays a slider", () => {
    const config = {
      heading: { type: 'slider', display: 'dial', default: 90, min: 0, max: 360 },
      tilt: { type: 'slider', display: 'dial', default: 0, min: -45, max: 45, step: 0.5, origin: 0, wrap: false },
      level: { type: 'slider', default: 3, min: 0, max: 10, unit: ' dB' },
    } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    const heading: number = values.heading;
    assert.equal(heading, 90);
    const id = 'angle-parse';
    try {
      DialStore.registerPanel(id, 'Angle', config);
      const [headingMeta, tiltMeta, levelMeta] = DialStore.getPanel(id)!.controls;
      assert.deepEqual([headingMeta.type, headingMeta.dial, headingMeta.step], ['slider', true, 1]);
      assert.deepEqual([tiltMeta.dial, tiltMeta.origin, tiltMeta.wrap, tiltMeta.step], [true, 0, false, 0.5]);
      assert.deepEqual([levelMeta.dial, levelMeta.unit, levelMeta.step], [false, ' dB', 0.1]);
      DialStore.updateValue(id, 'tilt', 30);
      const version = DialStore.savePreset(id, 'Tilted');
      DialStore.resetValues(id);
      assert.deepEqual(DialStore.getValues(id), { heading: 90, tilt: 0, level: 3 });
      DialStore.loadPreset(id, version);
      assert.equal(DialStore.getValue(id, 'tilt'), 30);
    } finally { DialStore.unregisterPanel(id); }
  });
});
