import { describe, it, expect } from 'vitest';
import { splitPanelTabs } from '../src/panel-tabs';
import type { ControlMeta } from '../src/store/DialStore';

const row = (path: string): ControlMeta => ({ type: 'slider', path, label: path, min: 0, max: 1 });

const tab = (path: string, children: ControlMeta[]): ControlMeta => ({
  type: 'folder',
  path,
  label: path,
  tab: true,
  children,
});

const bar = (...paths: string[]): ControlMeta => ({
  type: 'select',
  path: '_tab',
  label: 'Tab',
  display: 'segmented',
  tabBar: true,
  options: paths,
});

const tabbed = [
  bar('pattern', 'master'),
  tab('pattern', [row('pattern.steps')]),
  tab('master', [row('master.volume')]),
];

// The panel shows one tab's rows at a time, and is never left on a blank page.
describe('splitPanelTabs', () => {
  it('opens the tab the stored value names', () => {
    const split = splitPanelTabs(tabbed, 'master');

    expect(split.activeTab?.path).toBe('master');
    expect(split.pageControls.map((c) => c.path)).toEqual(['master.volume']);
  });

  it('lists every tab in declared order', () => {
    expect(splitPanelTabs(tabbed, 'master').tabs.map((c) => c.path)).toEqual(['pattern', 'master']);
  });

  it('falls back to the first tab when the value names none', () => {
    for (const value of [undefined, 'midi', 42]) {
      expect(splitPanelTabs(tabbed, value).activeTab?.path).toBe('pattern');
    }
  });

  it('keeps a loose row out of the page, in view from every tab', () => {
    const split = splitPanelTabs([bar('pattern'), row('bpm'), tab('pattern', [row('pattern.steps')])], 'pattern');

    expect(split.looseControls.map((c) => c.path)).toEqual(['bpm']);
    expect(split.pageControls.map((c) => c.path)).toEqual(['pattern.steps']);
  });

  it('leaves an untabbed panel whole', () => {
    const controls = [row('bpm'), tab('pattern', [row('pattern.steps')])];
    const split = splitPanelTabs(controls, undefined);

    expect(split.activeTab).toBeUndefined();
    expect(split.tabs).toEqual([]);
    expect(split.looseControls).toEqual([]);
    expect(split.pageControls).toEqual(controls);
  });

  it('leaves the panel whole when the bar lost every tab', () => {
    const controls = [bar(), row('bpm')];
    const split = splitPanelTabs(controls, 'pattern');

    expect(split.activeTab).toBeUndefined();
    expect(split.pageControls).toEqual(controls);
  });
});
