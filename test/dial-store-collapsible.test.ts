import { describe, it, expect, afterEach } from 'vitest';
import { DialStore, resolveDialValues } from '../src/store/DialStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `collapsible-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof DialStore.registerPanel>[2]) => {
  DialStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
});

// `_collapsible: false` is UI-only metadata, like `_collapsed`: the folder
// renders a plain always-open section header, and the key never becomes a value.
describe('non-collapsible folders (_collapsible: false)', () => {
  it('marks the folder meta as non-collapsible', () => {
    const id = freshId();
    register(id, { shadow: { _collapsible: false, blur: [10, 0, 50] } });

    const folder = DialStore.getPanel(id)!.controls[0];
    expect(folder.type).toBe('folder');
    expect(folder.collapsible).toBe(false);
  });

  it('leaves a plain folder unmarked', () => {
    const id = freshId();
    register(id, { shadow: { blur: [10, 0, 50] } });

    expect(DialStore.getPanel(id)!.controls[0].collapsible).toBeUndefined();
  });

  it('never becomes a value or a child control row', () => {
    const id = freshId();
    register(id, { shadow: { _collapsible: false, blur: [10, 0, 50] } });

    expect(DialStore.getValue(id, 'shadow._collapsible')).toBeUndefined();
    expect('shadow._collapsible' in DialStore.getValues(id)).toBe(false);
    const children = DialStore.getPanel(id)!.controls[0].children ?? [];
    expect(children.map((c) => c.path)).toEqual(['shadow.blur']);
  });

  it('never leaks into resolved values', () => {
    const id = freshId();
    const config = { shadow: { _collapsible: false, blur: [10, 0, 50] as [number, number, number] } };
    register(id, config);

    const resolved = resolveDialValues(config, DialStore.getValues(id));
    expect(Object.keys(resolved.shadow)).toEqual(['blur']);
  });

  it('forces the body open, ignoring _collapsed', () => {
    const id = freshId();
    register(id, { shadow: { _collapsible: false, _collapsed: true, blur: [10, 0, 50] } });

    const folder = DialStore.getPanel(id)!.controls[0];
    expect(folder.collapsible).toBe(false);
    expect(folder.defaultOpen).toBe(true);
  });

  it('is ignored on module folders — module collapse is functional', () => {
    const id = freshId();
    register(id, { fx: { _enabled: true, _collapsible: false, _collapsed: true, mix: [0.5, 0, 1] } });

    const folder = DialStore.getPanel(id)!.controls[0];
    expect(folder.module).toBe(true);
    expect(folder.collapsible).toBeUndefined();
    expect(folder.defaultOpen).toBe(false);
  });
});
