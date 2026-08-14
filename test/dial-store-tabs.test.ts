import { describe, it, expect, afterEach } from 'vitest';
import { DialStore, resolveDialValues, TAB_PATH } from '../src/store/DialStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `tabs-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof DialStore.registerPanel>[2]) => {
  DialStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
});

const tabbed = {
  _tabs: true,
  pattern: { steps: [16, 1, 64] as [number, number, number] },
  master: { volume: [0.8, 0, 1] as [number, number, number] },
};

// `_tabs: true` at the panel root promotes every top-level folder to a tab. The
// key itself is UI-only metadata, like `_collapsed`; the ACTIVE tab is a real
// value, so a config rebuild keeps the reader's place.
describe('tabbed panels (_tabs: true)', () => {
  it('marks every top-level folder as a tab', () => {
    const id = freshId();
    register(id, tabbed);

    const tabs = DialStore.getPanel(id)!.controls.filter((c) => c.tab);
    expect(tabs.map((c) => c.path)).toEqual(['pattern', 'master']);
  });

  it('prepends a segmented tab bar naming every tab', () => {
    const id = freshId();
    register(id, tabbed);

    const bar = DialStore.getPanel(id)!.controls[0];
    expect(bar.tabBar).toBe(true);
    expect(bar.type).toBe('select');
    expect(bar.display).toBe('segmented');
    expect(bar.path).toBe(TAB_PATH);
    expect(bar.options).toEqual(['pattern', 'master']);
  });

  it('opens on the first tab', () => {
    const id = freshId();
    register(id, tabbed);

    expect(DialStore.getValue(id, TAB_PATH)).toBe('pattern');
  });

  it('never becomes a value or a control row of its own', () => {
    const id = freshId();
    register(id, tabbed);

    expect(DialStore.getValue(id, '_tabs')).toBeUndefined();
    expect('_tabs' in DialStore.getValues(id)).toBe(false);
    expect(DialStore.getPanel(id)!.controls.some((c) => c.path === '_tabs')).toBe(false);
  });

  it('never leaks into resolved values', () => {
    const id = freshId();
    register(id, tabbed);

    const resolved = resolveDialValues(tabbed, DialStore.getValues(id));
    expect(Object.keys(resolved)).toEqual(['pattern', 'master']);
  });

  it('drops an empty tab rather than showing a blank page', () => {
    const id = freshId();
    register(id, { _tabs: true, pattern: { steps: [16, 1, 64] }, midi: {} });

    const controls = DialStore.getPanel(id)!.controls;
    expect(controls.filter((c) => c.tab).map((c) => c.path)).toEqual(['pattern']);
    expect(controls.some((c) => c.path === 'midi')).toBe(false);
  });

  it('keeps a loose top-level control, outside the tabs', () => {
    const id = freshId();
    register(id, { _tabs: true, bpm: [120, 20, 300], pattern: { steps: [16, 1, 64] } });

    const bpm = DialStore.getPanel(id)!.controls.find((c) => c.path === 'bpm')!;
    expect(bpm.type).toBe('slider');
    expect(bpm.tab).toBeUndefined();
    expect(DialStore.getValue(id, 'bpm')).toBe(120);
  });

  it('does nothing without a folder to make a tab of', () => {
    const id = freshId();
    register(id, { _tabs: true, bpm: [120, 20, 300] });

    expect(DialStore.getPanel(id)!.controls.some((c) => c.tabBar)).toBe(false);
    expect(DialStore.getValue(id, TAB_PATH)).toBeUndefined();
  });

  it('is root-only — a nested _tabs is stripped, not honoured', () => {
    const id = freshId();
    register(id, { shape: { _tabs: true, curve: { attack: [0.1, 0, 1] } } });

    const folder = DialStore.getPanel(id)!.controls[0];
    expect(folder.tab).toBeUndefined();
    expect(folder.children!.some((c) => c.tabBar)).toBe(false);
    expect(folder.children!.map((c) => c.path)).toEqual(['shape.curve']);
  });

  it('keeps the reader on their tab across a config rebuild', () => {
    const id = freshId();
    register(id, tabbed);
    DialStore.updateValue(id, TAB_PATH, 'master');

    DialStore.updatePanel(id, id, { ...tabbed, master: { volume: [0.8, 0, 1], pan: [0, -1, 1] } });

    expect(DialStore.getValue(id, TAB_PATH)).toBe('master');
  });

  it('keeps the reader on their tab when a preset is loaded', () => {
    const id = freshId();
    register(id, tabbed);
    // Saved while reading Pattern, at the stock volume.
    const preset = DialStore.savePreset(id, 'Loud');
    // Detach first: edits made ON a preset are written back INTO it.
    DialStore.clearActivePreset(id);
    DialStore.updateValue(id, TAB_PATH, 'master');
    DialStore.updateValue(id, 'master.volume', 0.2);

    DialStore.loadPreset(id, preset);

    // The preset changed the sound without moving the reader off the page.
    expect(DialStore.getValue(id, 'master.volume')).toBe(0.8);
    expect(DialStore.getValue(id, TAB_PATH)).toBe('master');
  });

  it('keeps the reader on their tab when the panel is reset', () => {
    const id = freshId();
    register(id, tabbed);
    // The base values were captured while reading Pattern; moving tab now
    // writes to the preset, so the base still names the other one.
    DialStore.savePreset(id, 'Loud');
    DialStore.updateValue(id, TAB_PATH, 'master');

    DialStore.clearActivePreset(id);

    expect(DialStore.getValue(id, TAB_PATH)).toBe('master');
  });

  it('falls back to the first tab when the open one is gone', () => {
    const id = freshId();
    register(id, tabbed);
    DialStore.updateValue(id, TAB_PATH, 'master');

    DialStore.updatePanel(id, id, { _tabs: true, pattern: { steps: [16, 1, 64] } });

    expect(DialStore.getValue(id, TAB_PATH)).toBe('pattern');
  });
});
