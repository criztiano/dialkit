import { describe, it, expect, afterEach, vi } from 'vitest';
import { DialStore } from '../src/store/DialStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `disabled-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string) => {
  DialStore.registerPanel(id, id, { gravity: [9.8, 0, 20], reset: { type: 'action' } });
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
});

// Disabled is runtime-only by design: a config default plus a runtime override
// would be two sources of truth for the same question.
describe('disabled controls', () => {
  it('defaults to enabled and reports what was pushed', () => {
    const id = freshId();
    register(id);

    expect(DialStore.isDisabled(id, 'reset')).toBe(false);
    DialStore.setDisabled(id, 'reset', true);
    expect(DialStore.isDisabled(id, 'reset')).toBe(true);
    DialStore.setDisabled(id, 'reset', false);
    expect(DialStore.isDisabled(id, 'reset')).toBe(false);
  });

  it('applies to any control, not just action buttons', () => {
    const id = freshId();
    register(id);

    DialStore.setDisabled(id, 'gravity', true);

    expect(DialStore.isDisabled(id, 'gravity')).toBe(true);
  });

  it('notifies on a change and stays silent on a repeat', () => {
    const id = freshId();
    register(id);
    const listener = vi.fn();
    const unsubscribe = DialStore.subscribeControlState(id, listener);

    DialStore.setDisabled(id, 'reset', true);
    expect(listener).toHaveBeenCalledTimes(1);

    DialStore.setDisabled(id, 'reset', true);
    expect(listener).toHaveBeenCalledTimes(1);

    DialStore.setDisabled(id, 'reset', false);
    expect(listener).toHaveBeenCalledTimes(2);

    // Re-enabling something already enabled is equally a no-op.
    DialStore.setDisabled(id, 'reset', false);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });

  // Disabled is presentation the app pushes, not a control value: it must never
  // reach the value map that gets persisted and saved into presets.
  it('stays out of the panel values', () => {
    const id = freshId();
    register(id);

    const before = { ...DialStore.getValues(id) };
    DialStore.setDisabled(id, 'gravity', true);

    expect(DialStore.getValues(id)).toEqual(before);
  });

  it('drops a panel\'s disabled paths when it unregisters', () => {
    const id = freshId();
    register(id);
    DialStore.setDisabled(id, 'gravity', true);

    DialStore.unregisterPanel(registered.pop()!);

    expect(DialStore.isDisabled(id, 'gravity')).toBe(false);
  });

  // Both slices ride one channel so a control's shell needs a single listener.
  it('shares its notification channel with affordance status', () => {
    const id = freshId();
    register(id);
    const listener = vi.fn();
    const unsubscribe = DialStore.subscribeControlState(id, listener);

    DialStore.setDisabled(id, 'gravity', true);
    DialStore.setAffordanceStatus(id, 'gravity', 'armed');

    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });
});
