import type { ControlMeta, DialValue } from './store/DialStore';

/**
 * How a tabbed panel divides its controls. A `_tabs` root promotes every
 * top-level folder to a tab: the folders give up their own headers — the tab bar
 * names them — so the open tab's children read as the sections of one page.
 */
export type PanelTabs = {
  /** The tabs in declared order, empty when the panel is not tabbed. */
  tabs: ControlMeta[];
  /** The open tab. Absent only when the panel is not tabbed. */
  activeTab?: ControlMeta;
  /** Rows belonging to no tab: they sit above the page, in view from every tab. */
  looseControls: ControlMeta[];
  /** The open tab's rows — or every control, when the panel is not tabbed. */
  pageControls: ControlMeta[];
};

/**
 * Splits a panel's controls around its tab bar. `activeValue` is the stored
 * `_tab`; a value naming no live tab falls back to the first, so a panel is
 * never left on a blank page.
 */
export function splitPanelTabs(controls: ControlMeta[], activeValue: DialValue | undefined): PanelTabs {
  const tabs = controls.filter((control) => control.tab);

  if (!controls.some((control) => control.tabBar) || tabs.length === 0) {
    return { tabs: [], looseControls: [], pageControls: controls };
  }

  const activeTab = tabs.find((tab) => tab.path === activeValue) ?? tabs[0];

  return {
    tabs,
    activeTab,
    looseControls: controls.filter((control) => !control.tab && !control.tabBar),
    pageControls: activeTab.children ?? [],
  };
}
