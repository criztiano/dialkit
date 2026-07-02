import { describe, it, expect, afterEach } from 'vitest';
import { DialStore } from '../src/store/DialStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `range-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof DialStore.registerPanel>[2]) => {
  DialStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
});

// Covers normalizePreservedValue's `case 'range'`: a stored {min,max} leaf is
// preserved (not dropped) across a panel update, reconciled against the — possibly
// changed — bounds via clampRange (clamp both ends, then order).
describe('range value reconciliation across config edits', () => {
  const rangeConfig = (min: number, max: number) =>
    ({ size: { type: 'range' as const, min, max } });

  it('keeps a valid in-bounds pair on a config update', () => {
    const id = freshId();
    register(id, rangeConfig(0, 100));
    DialStore.updateValue(id, 'size', { min: 20, max: 80 });
    DialStore.updatePanel(id, id, rangeConfig(0, 100));
    expect(DialStore.getValues(id).size).toEqual({ min: 20, max: 80 });
  });

  it('clamps an out-of-bounds pair to the new bounds', () => {
    const id = freshId();
    register(id, rangeConfig(0, 100));
    DialStore.updateValue(id, 'size', { min: -50, max: 200 });
    // Tighten the bounds; the stored pair must clamp into [10, 90].
    DialStore.updatePanel(id, id, rangeConfig(10, 90));
    expect(DialStore.getValues(id).size).toEqual({ min: 10, max: 90 });
  });

  it('re-orders a pair that reverses after clamping', () => {
    const id = freshId();
    register(id, rangeConfig(0, 100));
    // Into [30,40]: min 45 clamps down to 40, max 20 clamps up to 30 → the pair
    // reverses to {40,30}, then clampRange orders it back to min <= max.
    DialStore.updateValue(id, 'size', { min: 45, max: 20 });
    DialStore.updatePanel(id, id, rangeConfig(30, 40));
    const value = DialStore.getValues(id).size as { min: number; max: number };
    expect(value.min).toBeLessThanOrEqual(value.max);
    expect(value).toEqual({ min: 30, max: 40 });
  });

  it('falls back to the config default when the stored value is not {min,max}', () => {
    const id = freshId();
    register(id, { size: { type: 'range' as const, min: 0, max: 100, default: { min: 25, max: 75 } } });
    // Corrupt the leaf to a non-range value; reconcile must restore the default.
    DialStore.updateValue(id, 'size', 'not-a-range');
    DialStore.updatePanel(id, id, { size: { type: 'range' as const, min: 0, max: 100, default: { min: 25, max: 75 } } });
    expect(DialStore.getValues(id).size).toEqual({ min: 25, max: 75 });
  });
});

// A range config REQUIRES numeric min/max, so control.min/max are always present
// via the public API. This guards the ±Infinity fallbacks in the reconcile branch
// directly: a missing bound must leave that end unclamped (no NaN), not zero it.
describe('range reconciliation with missing bounds', () => {
  it('does not produce NaN when a bound is absent', () => {
    // reason: exercise the reconcile branch with a control meta whose bounds are
    // undefined — the shape the ±Infinity fallbacks defend against. This mirrors
    // the internal ControlMeta a range control produces, minus min/max.
    const store = DialStore as unknown as {
      normalizePreservedValue: (
        existing: unknown,
        fallback: unknown,
        control: unknown
      ) => { min: number; max: number };
    };
    const control = { type: 'range' as const, path: 'size', label: 'Size' };
    const out = store.normalizePreservedValue(
      { min: 20, max: 80 },
      { min: 0, max: 100 },
      control
    );
    expect(Number.isNaN(out.min)).toBe(false);
    expect(Number.isNaN(out.max)).toBe(false);
    // With no bounds to clamp against, the pair passes through unchanged.
    expect(out).toEqual({ min: 20, max: 80 });
  });
});
