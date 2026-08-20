import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore } from '../src/store/TweakStore';
import { DEFAULT_GRADIENT, type GradientValue } from '../src/gradient-core';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `gradient-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof TweakStore.registerPanel>[2]) => {
  TweakStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

describe('gradient control parsing', () => {
  it('registers a gradient config as a gradient control', () => {
    const id = freshId();
    register(id, { bg: { type: 'gradient' as const } });
    const control = TweakStore.getPanels().find((p) => p.id === id)!.controls[0];
    expect(control.type).toBe('gradient');
  });

  it('flattens to the default gradient when no default is given', () => {
    const id = freshId();
    register(id, { bg: { type: 'gradient' as const } });
    expect(TweakStore.getValues(id).bg).toEqual(DEFAULT_GRADIENT);
  });

  it('normalizes an explicit default at registration (unsorted stops arrive sorted)', () => {
    const id = freshId();
    const unsorted: GradientValue = {
      type: 'linear',
      angle: 45,
      stops: [
        { color: '#ffffffff', position: 1 },
        { color: '#000000ff', position: 0 },
      ],
    };
    register(id, { bg: { type: 'gradient' as const, default: unsorted } });
    const stored = TweakStore.getValues(id).bg as GradientValue;
    expect(stored.stops.map((s) => s.position)).toEqual([0, 1]);
    expect(stored.angle).toBe(45);
  });

  it('does not treat a gradient config as a folder', () => {
    const id = freshId();
    register(id, { bg: { type: 'gradient' as const } });
    const panel = TweakStore.getPanels().find((p) => p.id === id)!;
    expect(panel.controls).toHaveLength(1);
    expect(panel.controls[0].children).toBeUndefined();
  });
});

describe('gradient value reconciliation across config edits', () => {
  it('preserves a valid user value across a config edit', () => {
    const id = freshId();
    register(id, { bg: { type: 'gradient' as const } });
    const custom: GradientValue = {
      type: 'radial',
      angle: 0,
      stops: [
        { color: '#11223344', position: 0 },
        { color: '#556677ff', position: 1 },
      ],
    };
    TweakStore.updateValue(id, 'bg', custom);
    TweakStore.updatePanel(id, id, { bg: { type: 'gradient' as const } });
    expect(TweakStore.getValues(id).bg).toEqual(custom);
  });

  it('deep-normalizes a corrupted stored value (bad stop color dropped → default ramp)', () => {
    const id = freshId();
    register(id, { bg: { type: 'gradient' as const } });
    // Only one valid stop survives → normalizeGradient falls back to default stops.
    TweakStore.updateValue(id, 'bg', {
      type: 'conic',
      angle: 30,
      stops: [
        { color: 'garbage', position: 0 },
        { color: '#ff0000', position: 1 },
      ],
    } as unknown as GradientValue);
    TweakStore.updatePanel(id, id, { bg: { type: 'gradient' as const } });
    const stored = TweakStore.getValues(id).bg as GradientValue;
    expect(stored.type).toBe('conic');
    expect(stored.stops).toEqual(DEFAULT_GRADIENT.stops);
  });

  it('falls back to the config default when the stored value loses its shape', () => {
    const id = freshId();
    register(id, { bg: { type: 'gradient' as const } });
    TweakStore.updateValue(id, 'bg', 'not-a-gradient' as unknown as GradientValue);
    TweakStore.updatePanel(id, id, { bg: { type: 'gradient' as const } });
    expect(TweakStore.getValues(id).bg).toEqual(DEFAULT_GRADIENT);
  });
});
