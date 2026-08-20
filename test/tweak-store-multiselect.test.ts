import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `multiselect-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof TweakStore.registerPanel>[2]) => {
  TweakStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

const models = (defaults?: string[]) => ({
  models: {
    type: 'multiselect' as const,
    options: [
      { value: 'a', label: 'Model A', tag: 'local' },
      { value: 'b', label: 'Model B', tag: 'cloud', hint: 'vocals, drums' },
      { value: 'c', label: 'Model C' },
    ],
    ...(defaults ? { default: defaults } : {}),
  },
});

describe('multiselect config', () => {
  it('resolves to its default selection', () => {
    const id = freshId();
    register(id, models(['a', 'c']));
    expect(TweakStore.getValues(id).models).toEqual(['a', 'c']);
  });

  it('defaults to the empty selection — a real state, not the first option', () => {
    const id = freshId();
    register(id, models());
    expect(TweakStore.getValues(id).models).toEqual([]);
  });

  it('parses to a multiselect control carrying its options', () => {
    const id = freshId();
    register(id, models());
    const control = TweakStore.getPanel(id)!.controls[0];
    expect(control.type).toBe('multiselect');
    expect(control.multiSelectOptions).toHaveLength(3);
    expect(control.multiSelectOptions![1]).toEqual({ value: 'b', label: 'Model B', tag: 'cloud', hint: 'vocals, drums' });
  });

  it('stores an updated selection', () => {
    const id = freshId();
    register(id, models());
    TweakStore.updateValue(id, 'models', ['b', 'c']);
    expect(TweakStore.getValues(id).models).toEqual(['b', 'c']);
  });
});

// Covers normalizePreservedValue's `case 'multiselect'`: selections survive a
// panel update, minus any options the new config no longer offers.
describe('multiselect reconciliation across config edits', () => {
  it('keeps a valid selection on a config update', () => {
    const id = freshId();
    register(id, models());
    TweakStore.updateValue(id, 'models', ['a', 'b']);
    TweakStore.updatePanel(id, id, models());
    expect(TweakStore.getValues(id).models).toEqual(['a', 'b']);
  });

  it('drops selections whose option vanished', () => {
    const id = freshId();
    register(id, models());
    TweakStore.updateValue(id, 'models', ['a', 'b', 'c']);
    const narrowed = {
      models: {
        type: 'multiselect' as const,
        options: [
          { value: 'a', label: 'Model A' },
          { value: 'c', label: 'Model C' },
        ],
      },
    };
    TweakStore.updatePanel(id, id, narrowed);
    expect(TweakStore.getValues(id).models).toEqual(['a', 'c']);
  });

  it('keeps an explicitly emptied selection instead of restoring the default', () => {
    const id = freshId();
    register(id, models(['a']));
    TweakStore.updateValue(id, 'models', []);
    TweakStore.updatePanel(id, id, models(['a']));
    expect(TweakStore.getValues(id).models).toEqual([]);
  });

  it('falls back to the default when the stored value is not a string array', () => {
    const id = freshId();
    register(id, models(['a']));
    TweakStore.updateValue(id, 'models', 'not-an-array');
    TweakStore.updatePanel(id, id, models(['a']));
    expect(TweakStore.getValues(id).models).toEqual(['a']);
  });
});

// Covers the explicit SliderConfig object form: default/min/max/step land in
// values and control meta, with unit carried through for the renderer.
describe('slider object config', () => {
  it('resolves to its default and carries unit through control meta', () => {
    const id = freshId();
    register(id, {
      threshold: { type: 'slider' as const, default: -24, min: -40, max: 0, step: 0.5, unit: ' dB' },
    });
    expect(TweakStore.getValues(id).threshold).toBe(-24);
    const control = TweakStore.getPanel(id)!.controls[0];
    expect(control.type).toBe('slider');
    expect(control.min).toBe(-40);
    expect(control.max).toBe(0);
    expect(control.step).toBe(0.5);
    expect(control.unit).toBe(' dB');
  });

  it('infers the step when omitted', () => {
    const id = freshId();
    register(id, { gain: { type: 'slider' as const, default: 1, min: 1, max: 20 } });
    // range 19 → inferStep yields 1
    expect(TweakStore.getPanel(id)!.controls[0].step).toBe(1);
  });

  it('is not mistaken for a folder', () => {
    const id = freshId();
    register(id, { gain: { type: 'slider' as const, default: 1, min: 0, max: 2 } });
    expect(TweakStore.getPanel(id)!.controls[0].type).toBe('slider');
    expect(TweakStore.getPanel(id)!.controls[0].children).toBeUndefined();
  });
});
