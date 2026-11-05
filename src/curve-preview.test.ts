import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clampCurveHeight, curvePathData, curveY, normalizeCurveMarkers, plotCurve } from './curve-preview';
import { liveConfigOf, syncLiveConfigs } from './live-config';
import { DialStore, flattenDialValueUpdates, resolveDialValues, type DialConfig, type ResolvedValues } from './store/DialStore';

describe('curve preview', () => {
  it('fits the samples with headroom, or to an explicit domain', () => {
    const plot = plotCurve((t) => t * 2, { count: 3 });
    assert.deepEqual(plot.domain.map((v) => +v.toFixed(6)), [-0.1, 2.1]);
    assert.ok(Math.abs(plot.segments[0][0].v - 0.1 / 2.2) < 1e-9);
    assert.ok(plot.baseline !== null);
    assert.deepEqual(plotCurve(() => 5, { count: 2 }).domain.map((v) => +v.toFixed(6)), [4.45, 5.55]);
    assert.deepEqual(plotCurve((t) => t, { count: 2, domain: [0, 2] }).segments[0], [{ t: 0, v: 0 }, { t: 1, v: 0.5 }]);
    assert.deepEqual(plotCurve((t) => t, { count: 2, domain: [2, 0] }).domain.map((v) => +v.toFixed(6)), [-0.05, 1.05]);
  });

  it('breaks the stroke at non-finite or throwing samples', () => {
    const plot = plotCurve((t) => { if (t === 0.5) throw new Error('no'); return t === 0.25 ? NaN : t; }, { count: 5 });
    assert.deepEqual(plot.segments.map((s) => s.map((p) => p.t)), [[0], [0.75, 1]]);
    assert.equal(curvePathData(plot.segments, 100, 10).split('M').length, 3);
    assert.equal(curveY(1, 64, 4), 4);
    assert.deepEqual(normalizeCurveMarkers([0.5, -1, 2, NaN, 1]), [0.5, 1]);
    assert.equal(clampCurveHeight(), 64);
    assert.equal(clampCurveHeight(500), 160);
  });

  it('holds no value: it never reaches the resolved values or the store', () => {
    const config = {
      amount: [0.5, 0, 1] as [number, number, number],
      arc: { type: 'curve', sample: (t: number) => Math.sin(t * Math.PI), domain: [0, 1] as [number, number] },
    } satisfies DialConfig;
    const values: ResolvedValues<typeof config> = resolveDialValues(config, {});
    // @ts-expect-error a curve has no resolved value
    void values.arc;
    assert.deepEqual(values, { amount: 0.5 });
    assert.deepEqual(flattenDialValueUpdates(config, { amount: 0.2 }), { amount: 0.2 });
    const id = 'curve-store';
    try {
      DialStore.registerPanel(id, 'Curve', config);
      assert.deepEqual(DialStore.getPanel(id)!.controls.map((c) => c.type), ['slider', 'curve']);
      assert.deepEqual(Object.keys(DialStore.getValues(id)), ['amount']);
      const control = DialStore.getControl(id, 'arc')!;
      const sample = (t: number) => t;
      syncLiveConfigs(id, { ...config, arc: { type: 'curve', sample } });
      assert.equal(liveConfigOf(id, control, 'curve')?.sample, sample);
    } finally { DialStore.unregisterPanel(id); }
  });
});
