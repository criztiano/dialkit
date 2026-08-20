import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore, resolveTweakValues } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `action-caption-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof TweakStore.registerPanel>[2]) => {
  TweakStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

// A captioned action names what it acts on at the left of the row, so the
// button itself can stay short. Without a caption the button fills the row.
describe('captioned actions', () => {
  it('keeps the caption and the button text apart', () => {
    const id = freshId();
    register(id, { load: { type: 'action', label: 'Load', caption: 'kick' } });

    const action = TweakStore.getPanel(id)!.controls[0];
    expect(action.type).toBe('action');
    expect(action.label).toBe('Load');
    expect(action.caption).toBe('kick');
  });

  it('leaves a plain action uncaptioned', () => {
    const id = freshId();
    register(id, { load: { type: 'action', label: 'Load' } });

    expect(TweakStore.getPanel(id)!.controls[0].caption).toBeUndefined();
  });

  it('still falls back to the key for the button text', () => {
    const id = freshId();
    register(id, { loadSample: { type: 'action', caption: 'kick' } });

    expect(TweakStore.getPanel(id)!.controls[0].label).toBe('Load Sample');
  });

  it('is presentation, never a value', () => {
    const id = freshId();
    const config = { load: { type: 'action' as const, label: 'Load', caption: 'kick' } };
    register(id, config);

    expect(TweakStore.getValue(id, 'load.caption')).toBeUndefined();
    const resolved = resolveTweakValues(config, TweakStore.getValues(id));
    expect(Object.keys(resolved)).toEqual(['load']);
  });
});
