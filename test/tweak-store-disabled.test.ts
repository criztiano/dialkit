import { describe, it, expect, afterEach, vi } from 'vitest';
import { TweakStore } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `disabled-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string) => {
  TweakStore.registerPanel(id, id, { gravity: [9.8, 0, 20], reset: { type: 'action' } });
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

// Disabled is runtime-only by design: a config default plus a runtime override
// would be two sources of truth for the same question.
describe('disabled controls', () => {
  it('defaults to enabled and reports what was pushed', () => {
    const id = freshId();
    register(id);

    expect(TweakStore.isDisabled(id, 'reset')).toBe(false);
    TweakStore.setDisabled(id, 'reset', true);
    expect(TweakStore.isDisabled(id, 'reset')).toBe(true);
    TweakStore.setDisabled(id, 'reset', false);
    expect(TweakStore.isDisabled(id, 'reset')).toBe(false);
  });

  it('applies to any control, not just action buttons', () => {
    const id = freshId();
    register(id);

    TweakStore.setDisabled(id, 'gravity', true);

    expect(TweakStore.isDisabled(id, 'gravity')).toBe(true);
  });

  it('notifies on a change and stays silent on a repeat', () => {
    const id = freshId();
    register(id);
    const listener = vi.fn();
    const unsubscribe = TweakStore.subscribeControlState(id, listener);

    TweakStore.setDisabled(id, 'reset', true);
    expect(listener).toHaveBeenCalledTimes(1);

    TweakStore.setDisabled(id, 'reset', true);
    expect(listener).toHaveBeenCalledTimes(1);

    TweakStore.setDisabled(id, 'reset', false);
    expect(listener).toHaveBeenCalledTimes(2);

    // Re-enabling something already enabled is equally a no-op.
    TweakStore.setDisabled(id, 'reset', false);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });

  // Disabled is presentation the app pushes, not a control value: it must never
  // reach the value map that gets persisted and saved into presets.
  it('stays out of the panel values', () => {
    const id = freshId();
    register(id);

    const before = { ...TweakStore.getValues(id) };
    TweakStore.setDisabled(id, 'gravity', true);

    expect(TweakStore.getValues(id)).toEqual(before);
  });

  it('drops a panel\'s disabled paths when it unregisters', () => {
    const id = freshId();
    register(id);
    TweakStore.setDisabled(id, 'gravity', true);

    TweakStore.unregisterPanel(registered.pop()!);

    expect(TweakStore.isDisabled(id, 'gravity')).toBe(false);
  });

  // Both slices ride one channel so a control's shell needs a single listener.
  it('shares its notification channel with affordance status', () => {
    const id = freshId();
    register(id);
    const listener = vi.fn();
    const unsubscribe = TweakStore.subscribeControlState(id, listener);

    TweakStore.setDisabled(id, 'gravity', true);
    TweakStore.setAffordanceStatus(id, 'gravity', 'armed');

    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });
});
