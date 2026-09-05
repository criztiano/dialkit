import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  LFO_DEF,
  SH_DEF,
  ADSR_DEF,
  envStagePoints,
  modPageLayout,
} from './modulation-core';

// The modulator pages draw themselves: the LFO and S&H texture pads show
// the wave their axes are shaping, and the ADSR's four dials each draw one
// stage of a single envelope picture whose segments meet at the slot edges.
// These tests pin the drawings' contracts, not their pixels.

describe('LFO preview', () => {
  it('returns the asked-for samples, each 0..1, and holds still', () => {
    const params = { ...LFO_DEF.defaults };
    const a = LFO_DEF.preview!(params, 32);
    const b = LFO_DEF.preview!(params, 32);
    assert.equal(a.points.length, 32);
    assert.ok(a.points.every((p) => p >= 0 && p <= 1));
    assert.deepEqual(a.points, b.points);
  });

  it('names the wave from its shape', () => {
    assert.equal(LFO_DEF.preview!({ ...LFO_DEF.defaults, width: 0.5 }, 16).label, 'Tri');
    assert.equal(LFO_DEF.preview!({ ...LFO_DEF.defaults, width: 0.1 }, 16).label, 'Saw');
    assert.equal(LFO_DEF.preview!({ ...LFO_DEF.defaults, width: 0.9 }, 16).label, 'Ramp');
    assert.equal(LFO_DEF.preview!({ ...LFO_DEF.defaults, smooth: 0.8 }, 16).label, 'Sine');
  });

  it('the width skew moves the wave, and smooth flattens its corners', () => {
    const tri = LFO_DEF.preview!({ ...LFO_DEF.defaults, width: 0.5 }, 64).points;
    const saw = LFO_DEF.preview!({ ...LFO_DEF.defaults, width: 0.05 }, 64).points;
    assert.notDeepEqual(tri, saw);
    const sharp = LFO_DEF.preview!({ ...LFO_DEF.defaults, smooth: 0 }, 64).points;
    const soft = LFO_DEF.preview!({ ...LFO_DEF.defaults, smooth: 1 }, 64).points;
    const swing = (pts: number[]) => Math.max(...pts) - Math.min(...pts);
    assert.ok(swing(soft) < swing(sharp));
  });

  it('the texture pad claims the preview', () => {
    const layout = modPageLayout(LFO_DEF.controls, LFO_DEF.defaults);
    assert.equal(layout.dials.find((d) => d.path === 'texture')?.preview, true);
  });
});

describe('S&H preview', () => {
  it('is deterministic and bounded', () => {
    const params = { ...SH_DEF.defaults };
    const a = SH_DEF.preview!(params, 48);
    const b = SH_DEF.preview!(params, 48);
    assert.deepEqual(a.points, b.points);
    assert.ok(a.points.every((p) => p >= 0 && p <= 1));
  });

  it('offset lifts the whole run, depth scales its throw', () => {
    const mean = (pts: number[]) => pts.reduce((s, p) => s + p, 0) / pts.length;
    const centred = SH_DEF.preview!({ ...SH_DEF.defaults, offset: 0 }, 48).points;
    const lifted = SH_DEF.preview!({ ...SH_DEF.defaults, offset: 0.8 }, 48).points;
    assert.ok(mean(lifted) > mean(centred));
    const flat = SH_DEF.preview!({ ...SH_DEF.defaults, depth: 0, offset: 0 }, 48).points;
    assert.ok(flat.every((p) => Math.abs(p - 0.5) < 1e-9));
  });

  it('smooth renames the steps to a drift', () => {
    assert.equal(SH_DEF.preview!({ ...SH_DEF.defaults, smooth: 0 }, 16).label, 'Steps');
    assert.equal(SH_DEF.preview!({ ...SH_DEF.defaults, smooth: 0.8 }, 16).label, 'Drift');
  });
});

describe('ADSR envelope picture', () => {
  const params = { attack: 200, decay: 500, sustain: 0.4, release: 1000 };

  it('the four segments meet at the slot edges', () => {
    const a = envStagePoints('attack', params, 33);
    const d = envStagePoints('decay', params, 33);
    const s = envStagePoints('sustain', params, 33);
    const r = envStagePoints('release', params, 33);
    assert.ok(Math.abs(a[a.length - 1] - 1) < 1e-9);          // attack ends at full
    assert.ok(Math.abs(d[0] - 1) < 1e-9);                     // decay starts there
    assert.ok(Math.abs(d[d.length - 1] - 0.4) < 1e-9);        // and lands on sustain
    assert.ok(s.every((p) => Math.abs(p - 0.4) < 1e-9));      // sustain runs flat
    assert.ok(Math.abs(r[0] - 0.4) < 1e-9);                   // release falls from it
    assert.ok(Math.abs(r[r.length - 1]) < 1e-9);              // to rest
  });

  it('an instant stage still draws its edge', () => {
    const a = envStagePoints('attack', { ...params, attack: 0 }, 33);
    assert.ok(a[0] < 0.5);
    assert.ok(a.slice(4).every((p) => Math.abs(p - 1) < 1e-9));
  });

  it('a longer stage takes more of its slot', () => {
    const ramp = (pts: number[]) => pts.filter((p) => p < 1 - 1e-9).length;
    const quick = envStagePoints('attack', { ...params, attack: 100 }, 65);
    const slow = envStagePoints('attack', { ...params, attack: 1800 }, 65);
    assert.ok(ramp(slow) > ramp(quick));
  });

  it('the page layout tags each dial with its stage', () => {
    const layout = modPageLayout(ADSR_DEF.controls, ADSR_DEF.defaults);
    const stageOf = (path: string) => layout.dials.find((d) => d.path === path)?.stage;
    assert.equal(stageOf('attack'), 'attack');
    assert.equal(stageOf('decay'), 'decay');
    assert.equal(stageOf('sustain'), 'sustain');
    assert.equal(stageOf('release'), 'release');
  });
});
