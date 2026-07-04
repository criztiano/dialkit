import { describe, it, expect } from 'vitest';
import {
  byteFreqToUnit,
  byteTimeToUnit,
  binRange,
  fillFrequencyTargets,
  fillWaveformMinMax,
  resampleWaveform,
  stepSprings,
  normalizeSpring,
  SPRING_DEFAULT_STIFFNESS,
  SPRING_DEFAULT_DAMPING,
  columnWidth,
  quantizeToGrid,
} from '../src/analyser-core';

describe('byte conversions', () => {
  it('maps frequency bytes 0..255 onto 0..1', () => {
    expect(byteFreqToUnit(0)).toBe(0);
    expect(byteFreqToUnit(255)).toBe(1);
    expect(byteFreqToUnit(51)).toBeCloseTo(0.2, 10);
  });

  it('maps time-domain bytes onto −1..1 with 128 as silence', () => {
    expect(byteTimeToUnit(128)).toBe(0);
    expect(byteTimeToUnit(0)).toBe(-1);
    // byte range is asymmetric around 128: 255 lands just below +1
    expect(byteTimeToUnit(255)).toBeCloseTo(127 / 128, 10);
    expect(byteTimeToUnit(192)).toBe(0.5);
  });
});

describe('binRange', () => {
  it('linear scale spreads points evenly across the bins, skipping DC', () => {
    // 4 points over 9 bins: bins 1..8 split into ~equal quarters
    expect(binRange(0, 4, 9, 'linear')).toEqual({ start: 1, end: 3 });
    expect(binRange(1, 4, 9, 'linear')).toEqual({ start: 3, end: 5 });
    expect(binRange(2, 4, 9, 'linear')).toEqual({ start: 5, end: 7 });
    expect(binRange(3, 4, 9, 'linear')).toEqual({ start: 7, end: 9 });
  });

  it('covers every bin without gaps (low-end log bands may overlap, never skip)', () => {
    for (const scale of ['linear', 'log'] as const) {
      let prevEnd = 1;
      for (let p = 0; p < 8; p++) {
        const { start, end } = binRange(p, 8, 64, scale);
        expect(start).toBeLessThanOrEqual(prevEnd); // no gap between bands
        expect(end).toBeGreaterThan(start);
        expect(end).toBeGreaterThanOrEqual(prevEnd);
        prevEnd = end;
      }
      expect(prevEnd).toBe(64); // last band reaches the final bin
    }
  });

  it('log scale gives the low end narrow bands and the high end wide ones', () => {
    const first = binRange(0, 8, 1024, 'log');
    const last = binRange(7, 8, 1024, 'log');
    expect(first.end - first.start).toBeLessThan(last.end - last.start);
    expect(first.start).toBe(1); // anchored past DC
    expect(last.end).toBe(1024);
  });

  it('always spans at least one bin when points outnumber bins', () => {
    for (let p = 0; p < 32; p++) {
      const { start, end } = binRange(p, 32, 8, 'log');
      expect(end).toBeGreaterThanOrEqual(start + 1);
      expect(start).toBeGreaterThanOrEqual(1);
      expect(end).toBeLessThanOrEqual(8);
    }
  });
});

describe('fillFrequencyTargets', () => {
  it('takes the loudest bin in each band (band max, not average)', () => {
    // 9 bins (DC + 8): one narrow spike at bin 2 must survive into point 0
    const data = new Uint8Array([255, 0, 204, 0, 0, 0, 0, 0, 51]);
    const out = new Float32Array(4);
    fillFrequencyTargets(data, out, 'linear');
    // bands: [1,3) [3,5) [5,7) [7,9) — values land float32-rounded
    expect(out[0]).toBeCloseTo(204 / 255, 6);
    expect(out[1]).toBe(0);
    expect(out[2]).toBe(0);
    expect(out[3]).toBeCloseTo(51 / 255, 6);
  });

  it('never reads the DC bin', () => {
    const data = new Uint8Array(16).fill(0);
    data[0] = 255; // DC only
    const out = new Float32Array(4);
    fillFrequencyTargets(data, out, 'log');
    expect(Array.from(out)).toEqual([0, 0, 0, 0]);
  });
});

describe('fillWaveformMinMax', () => {
  it('captures the signed min and max within each column', () => {
    // ramp: −1, −0.5, 0, 0.5 (bytes 0, 64, 128, 192)
    const data = new Uint8Array([0, 64, 128, 192]);
    const min = new Float32Array(2);
    const max = new Float32Array(2);
    fillWaveformMinMax(data, 2, min, max);
    expect(Array.from(min)).toEqual([-1, 0]);
    expect(Array.from(max)).toEqual([-0.5, 0.5]);
  });

  it('keeps at least one sample per column when columns outnumber samples', () => {
    const data = new Uint8Array([192, 64]);
    const min = new Float32Array(4);
    const max = new Float32Array(4);
    fillWaveformMinMax(data, 4, min, max);
    expect(Array.from(min)).toEqual([0.5, 0.5, -0.5, -0.5]);
    expect(Array.from(max)).toEqual([0.5, 0.5, -0.5, -0.5]);
  });
});

describe('resampleWaveform', () => {
  it('passes values through when sizes match', () => {
    const out = new Float32Array(3);
    resampleWaveform(new Uint8Array([0, 128, 192]), out);
    expect(Array.from(out)).toEqual([-1, 0, 0.5]);
  });

  it('interpolates midpoints when upsampling', () => {
    const out = new Float32Array(3);
    resampleWaveform(new Uint8Array([128, 192]), out);
    expect(Array.from(out)).toEqual([0, 0.25, 0.5]);
  });

  it('zero-fills on empty input and holds a single sample', () => {
    const out = new Float32Array(2);
    resampleWaveform(new Uint8Array(0), out);
    expect(Array.from(out)).toEqual([0, 0]);
    resampleWaveform(new Uint8Array([192]), out);
    expect(Array.from(out)).toEqual([0.5, 0.5]);
  });
});

describe('stepSprings', () => {
  const run = (opts: { stiffness: number; damping: number; dt: number; steps: number }) => {
    const pos = Float32Array.from([0]);
    const vel = Float32Array.from([0]);
    const targets = Float32Array.from([1]);
    let peak = 0;
    for (let i = 0; i < opts.steps; i++) {
      stepSprings(pos, vel, targets, opts.stiffness, opts.damping, opts.dt);
      if (pos[0] > peak) peak = pos[0];
    }
    return { pos: pos[0], vel: vel[0], peak };
  };

  it('converges onto the target', () => {
    const { pos, vel } = run({ stiffness: 120, damping: 14, dt: 1 / 60, steps: 600 });
    expect(pos).toBeCloseTo(1, 3);
    expect(vel).toBeCloseTo(0, 3);
  });

  it('is a no-op at dt 0', () => {
    const { pos, vel } = run({ stiffness: 120, damping: 14, dt: 0, steps: 10 });
    expect(pos).toBe(0);
    expect(vel).toBe(0);
  });

  it('underdamped overshoots, heavily damped does not', () => {
    const bouncy = run({ stiffness: 120, damping: 8, dt: 1 / 60, steps: 600 });
    expect(bouncy.peak).toBeGreaterThan(1.05);
    const heavy = run({ stiffness: 120, damping: 60, dt: 1 / 60, steps: 600 });
    expect(heavy.peak).toBeLessThanOrEqual(1.001);
  });

  it('steps each element independently', () => {
    const pos = Float32Array.from([0, 5]);
    const vel = new Float32Array(2);
    const targets = Float32Array.from([1, 5]);
    stepSprings(pos, vel, targets, 120, 14, 1 / 60);
    expect(pos[0]).toBeGreaterThan(0);
    expect(pos[1]).toBe(5); // already at target, untouched
  });

  it('stays stable at the clamped worst case (max stiffness, min damping, max frame delta)', () => {
    const { pos } = run({ stiffness: 1000, damping: 1, dt: 0.05, steps: 2000 });
    expect(Number.isFinite(pos)).toBe(true);
    expect(Math.abs(pos)).toBeLessThan(3);
  });
});

describe('normalizeSpring', () => {
  it('off for falsy, defaults for true, merged for partial objects', () => {
    expect(normalizeSpring(undefined)).toBeNull();
    expect(normalizeSpring(false)).toBeNull();
    expect(normalizeSpring(true)).toEqual({ stiffness: SPRING_DEFAULT_STIFFNESS, damping: SPRING_DEFAULT_DAMPING });
    expect(normalizeSpring({ stiffness: 300 })).toEqual({ stiffness: 300, damping: SPRING_DEFAULT_DAMPING });
    expect(normalizeSpring({ damping: 30 })).toEqual({ stiffness: SPRING_DEFAULT_STIFFNESS, damping: 30 });
  });

  it('clamps into the integrator-stable range', () => {
    expect(normalizeSpring({ stiffness: 1e6, damping: 1e6 })).toEqual({ stiffness: 1000, damping: 100 });
    expect(normalizeSpring({ stiffness: 0, damping: 0 })).toEqual({ stiffness: 1, damping: 1 });
  });
});

describe('columnWidth', () => {
  it('matches the waveform engine: round(dpr) × round(pixelSize), floor 1', () => {
    const table: [number, number, number][] = [
      [1, 1, 1],
      [1, 2, 2],
      [1, 4, 4],
      [1, 6, 6],
      [2, 1, 2],
      [2, 4, 8],
      [3, 6, 18],
      [1.5, 1, 2], // retina-ish dpr rounds
      [1, 0, 1], // degenerate pixelSize floors at one device pixel
    ];
    for (const [dpr, pixelSize, expected] of table) {
      expect(columnWidth(dpr, pixelSize)).toBe(expected);
    }
  });
});

describe('quantizeToGrid', () => {
  it('snaps to the nearest block-grid line', () => {
    expect(quantizeToGrid(0, 4)).toBe(0);
    expect(quantizeToGrid(5, 4)).toBe(4);
    expect(quantizeToGrid(6, 4)).toBe(8);
    expect(quantizeToGrid(13, 4)).toBe(12);
    expect(quantizeToGrid(7, 1)).toBe(7);
  });
});
