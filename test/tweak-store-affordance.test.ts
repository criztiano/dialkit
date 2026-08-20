import { describe, it, expect, afterEach, vi } from 'vitest';
import { TweakStore, type AffordanceConfig, type ControlMeta } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `affordance-test-${++panelSeq}`;

const registered: string[] = [];
const register = (
  id: string,
  config: Parameters<typeof TweakStore.registerPanel>[2],
  affordances?: Record<string, AffordanceConfig>
) => {
  TweakStore.registerPanel(id, id, config, undefined, { affordances });
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

const find = (id: string, path: string): ControlMeta | undefined => {
  const walk = (controls: ControlMeta[]): ControlMeta | undefined => {
    for (const control of controls) {
      if (control.path === path) return control;
      const hit = control.children && walk(control.children);
      if (hit) return hit;
    }
    return undefined;
  };
  return walk(TweakStore.getPanel(id)?.controls ?? []);
};

const config = {
  gravity: [9.8, 0, 20] as [number, number, number],
  physics: { elastic: [0.5, 0, 1] as [number, number, number] },
};

const bind: AffordanceConfig = { label: 'Bind to music', content: () => null };

// Affordances carry view code, so unlike hints they can never live in the config
// — it is JSON-serialized on every render to detect structure changes.
describe('affordance config', () => {
  it('reaches a bare-tuple slider and a nested control alike', () => {
    const id = freshId();
    register(id, config, { gravity: bind, 'physics.elastic': bind });

    expect(find(id, 'gravity')?.affordance).toBe(bind);
    expect(find(id, 'physics.elastic')?.affordance).toBe(bind);
  });

  it('leaves controls the map does not name untouched', () => {
    const id = freshId();
    register(id, config, { gravity: bind });

    expect(find(id, 'physics.elastic')?.affordance).toBeUndefined();
  });

  it('retains affordances across an updatePanel that does not restate them', () => {
    const id = freshId();
    register(id, config, { gravity: bind });

    TweakStore.updatePanel(id, id, config);

    expect(find(id, 'gravity')?.affordance).toBe(bind);
  });
});

describe('affordance status', () => {
  it('defaults to off and reports what was pushed', () => {
    const id = freshId();
    register(id, config, { gravity: bind });

    expect(TweakStore.getAffordanceStatus(id, 'gravity')).toBe('off');
    TweakStore.setAffordanceStatus(id, 'gravity', 'armed');
    expect(TweakStore.getAffordanceStatus(id, 'gravity')).toBe('armed');
  });

  // The status can be driven from an audio callback, so a repeat of the current
  // value must not wake every subscriber.
  it('notifies on a change and stays silent on a repeat', () => {
    const id = freshId();
    register(id, config, { gravity: bind });
    const listener = vi.fn();
    const unsubscribe = TweakStore.subscribeControlState(id, listener);

    TweakStore.setAffordanceStatus(id, 'gravity', 'active');
    expect(listener).toHaveBeenCalledTimes(1);

    TweakStore.setAffordanceStatus(id, 'gravity', 'active');
    expect(listener).toHaveBeenCalledTimes(1);

    TweakStore.setAffordanceStatus(id, 'gravity', 'armed');
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });

  it('treats a redundant reset to off as a no-op', () => {
    const id = freshId();
    register(id, config, { gravity: bind });
    const listener = vi.fn();
    const unsubscribe = TweakStore.subscribeControlState(id, listener);

    TweakStore.setAffordanceStatus(id, 'gravity', 'off');
    expect(listener).not.toHaveBeenCalled();

    TweakStore.setAffordanceStatus(id, 'gravity', 'armed');
    TweakStore.setAffordanceStatus(id, 'gravity', 'off');
    expect(listener).toHaveBeenCalledTimes(2);
    expect(TweakStore.getAffordanceStatus(id, 'gravity')).toBe('off');

    unsubscribe();
  });

  // Status is presentation the app pushes, not a control value: it must never
  // reach the value map that gets persisted and saved into presets.
  it('stays out of the panel values', () => {
    const id = freshId();
    register(id, config, { gravity: bind });

    TweakStore.setAffordanceStatus(id, 'gravity', 'active');

    expect(TweakStore.getValues(id)).toEqual({ gravity: 9.8, 'physics.elastic': 0.5 });
  });

  it('drops a panel\'s statuses when it unregisters', () => {
    const id = freshId();
    register(id, config, { gravity: bind });
    TweakStore.setAffordanceStatus(id, 'gravity', 'active');

    TweakStore.unregisterPanel(registered.pop()!);

    expect(TweakStore.getAffordanceStatus(id, 'gravity')).toBe('off');
  });
});
