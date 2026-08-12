import { describe, it, expect, afterEach } from 'vitest';
import { DialStore, resolveDialValues, type ControlMeta } from '../src/store/DialStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `module-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof DialStore.registerPanel>[2]) => {
  DialStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
});

const flattenControls = (controls: ControlMeta[]): ControlMeta[] =>
  controls.flatMap((c) => [c, ...flattenControls(c.children ?? [])]);

// A folder carrying `_enabled` is a MODULE: the header switch drives the
// `<folder>._enabled` value. Unlike `_collapsed` (UI-only), `_enabled` IS a
// value — it flattens, resolves, persists, and reconciles like any boolean.
describe('module folders (_enabled)', () => {
  it('marks the folder meta as a module', () => {
    const id = freshId();
    register(id, { fx: { _enabled: true, mix: [0.5, 0, 1] } });

    const folder = DialStore.getPanel(id)!.controls[0];
    expect(folder.type).toBe('folder');
    expect(folder.module).toBe(true);
  });

  it('leaves a plain folder unmarked', () => {
    const id = freshId();
    register(id, { shadow: { blur: [10, 0, 50] } });

    const folder = DialStore.getPanel(id)!.controls[0];
    expect(folder.type).toBe('folder');
    expect(folder.module).toBeUndefined();
  });

  it('never renders _enabled as a child control row', () => {
    const id = freshId();
    register(id, { fx: { _enabled: true, mix: [0.5, 0, 1], deep: { _enabled: false, gain: [1, 0, 2] } } });

    const all = flattenControls(DialStore.getPanel(id)!.controls);
    expect(all.some((c) => c.path.endsWith('_enabled'))).toBe(false);
    // The real children are still there.
    expect(all.map((c) => c.path)).toEqual(['fx', 'fx.mix', 'fx.deep', 'fx.deep.gain']);
  });

  it('stores _enabled as a flat value and resolves it at <folder>._enabled', () => {
    const id = freshId();
    const config = { fx: { _enabled: false, mix: [0.5, 0, 1] as [number, number, number] } };
    register(id, config);

    expect(DialStore.getValue(id, 'fx._enabled')).toBe(false);

    const resolved = resolveDialValues(config, DialStore.getValues(id));
    expect(resolved.fx._enabled).toBe(false);
    expect(resolved.fx.mix).toBe(0.5);
  });

  it('updates through the store like any boolean', () => {
    const id = freshId();
    const config = { fx: { _enabled: false, mix: [0.5, 0, 1] as [number, number, number] } };
    register(id, config);

    DialStore.updateValue(id, 'fx._enabled', true);

    expect(DialStore.getValue(id, 'fx._enabled')).toBe(true);
    expect(resolveDialValues(config, DialStore.getValues(id)).fx._enabled).toBe(true);
  });

  it('survives a dynamic config update, preserving the current value', () => {
    const id = freshId();
    register(id, { fx: { _enabled: false, mix: [0.5, 0, 1] } });

    DialStore.updateValue(id, 'fx._enabled', true);
    // Config changes shape (new control, new default) — the toggled state stays.
    DialStore.updatePanel(id, id, { fx: { _enabled: false, mix: [0.5, 0, 1], depth: [0.2, 0, 1] } });

    expect(DialStore.getValue(id, 'fx._enabled')).toBe(true);
    expect(DialStore.getValue(id, 'fx.depth')).toBe(0.2);
  });

  it('drops the value when the folder stops being a module', () => {
    const id = freshId();
    register(id, { fx: { _enabled: true, mix: [0.5, 0, 1] } });

    DialStore.updatePanel(id, id, { fx: { mix: [0.5, 0, 1] } });

    expect(DialStore.getValue(id, 'fx._enabled')).toBeUndefined();
    expect(DialStore.getPanel(id)!.controls[0].module).toBeUndefined();
  });

  it('keeps _collapsed as UI-only initial-open state alongside _enabled', () => {
    const id = freshId();
    const config = { fx: { _enabled: true, _collapsed: true, mix: [0.5, 0, 1] as [number, number, number] } };
    register(id, config);

    const folder = DialStore.getPanel(id)!.controls[0];
    expect(folder.module).toBe(true);
    expect(folder.defaultOpen).toBe(false);
    // _collapsed never becomes a value; _enabled does.
    expect(DialStore.getValue(id, 'fx._collapsed')).toBeUndefined();
    expect('_collapsed' in DialStore.getValues(id)).toBe(false);
    expect(DialStore.getValue(id, 'fx._enabled')).toBe(true);
  });

  it('rides presets like any other value', () => {
    const id = freshId();
    register(id, { fx: { _enabled: true, mix: [0.5, 0, 1] } });

    const presetId = DialStore.savePreset(id, 'on');
    DialStore.clearActivePreset(id);
    DialStore.updateValue(id, 'fx._enabled', false);

    DialStore.loadPreset(id, presetId);
    expect(DialStore.getValue(id, 'fx._enabled')).toBe(true);
  });
});
