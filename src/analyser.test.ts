import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  binRange, byteTimeToUnit, columnWidth, fillFrequencyTargets, fillWaveformMinMax, hzWindowToBins, markerT,
  normalizeSpring, quantizeToGrid, resampleWaveform, stepSprings,
} from './analyser';
import { DialStore, resolveDialValues, type DialConfig, type ResolvedValues } from './store/DialStore';

describe('analyser', () => {
  it('bands frequency bins, skipping DC, log-spaced by default', () => {
    assert.deepEqual(binRange(0, 4, 1024, 'linear'), { start: 1, end: 256 });
    const log = Array.from({ length: 8 }, (_, i) => binRange(i, 8, 1024, 'log'));
    assert.equal(log[0].start, 1);
    assert.ok(log[7].end - log[7].start > log[0].end - log[0].start);
    for (const range of log) assert.ok(range.end > range.start);
    // Band max, not average: a narrow peak survives.
    const data = new Uint8Array(16);
    data[5] = 255;
    const out = new Float32Array(2);
    fillFrequencyTargets(data, out, 'linear');
    assert.deepEqual(Array.from(out), [1, 0]);
  });

  it('maps a Hz window and a marker onto the same spacing', () => {
    assert.deepEqual(hzWindowToBins([0, 12000], 24000, 1024), { loBin: 1, hiBin: 512 });
    assert.equal(hzWindowToBins([500, 100], 24000, 1024), null);
    assert.equal(markerT(32, 'log', 1, 1024), 0.5);
    assert.equal(markerT(2000, 'log', 1, 1024), null);
  });

  it('reduces time-domain bytes to traces and envelopes', () => {
    assert.equal(byteTimeToUnit(128), 0);
    const data = Uint8Array.from([128, 255, 0, 128]);
    const min = new Float32Array(2);
    const max = new Float32Array(2);
    fillWaveformMinMax(data, 2, min, max);
    assert.deepEqual(Array.from(max).map((v) => +v.toFixed(3)), [0.992, 0]);
    assert.deepEqual(Array.from(min), [0, -1]);
    const trace = new Float32Array(7);
    resampleWaveform(data, trace);
    assert.equal(trace[0], 0);
    assert.equal(trace[6], 0);
  });

  it('springs toward targets and sizes blocks on the device grid', () => {
    const pos = new Float32Array([0]);
    const vel = new Float32Array([0]);
    for (let i = 0; i < 120; i++) stepSprings(pos, vel, new Float32Array([1]), 120, 14, 1 / 60);
    assert.ok(Math.abs(pos[0] - 1) < 0.01);
    assert.equal(normalizeSpring(false), null);
    assert.deepEqual(normalizeSpring({ stiffness: 5000 }), { stiffness: 1000, damping: 14 });
    assert.equal(columnWidth(2, 2), 4);
    assert.equal(quantizeToGrid(9, 4), 8);
  });

  it('holds no value and needs a node getter', () => {
    const config = {
      level: [0.5, 0, 1] as [number, number, number],
      spectrum: { type: 'analyser', analyser: () => null, rangeHz: [20, 2000] as const },
    } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    assert.deepEqual(values, { level: 0.5 });
    const id = 'analyser-store';
    try {
      DialStore.registerPanel(id, 'Analyser', config);
      assert.deepEqual(DialStore.getPanel(id)!.controls.map((c) => c.type), ['slider', 'analyser']);
      assert.deepEqual(Object.keys(DialStore.getValues(id)), ['level']);
    } finally { DialStore.unregisterPanel(id); }
  });
});
