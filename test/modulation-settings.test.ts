import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore } from '../src/store/TweakStore';
import { ModulationStore } from '../src/store/ModulationStore';
import { MOD_SETTINGS_PANEL, registerModType, type ModTypeDef } from '../src/modulation-core';
import { buildModMovePage } from '../src/move-layout';

afterEach(() => {
  ModulationStore.clear();
});

// A second registered type, so the type select is a real enum — the state
// every app is in once the other modulator types land.
const SH_DEF: ModTypeDef = {
  type: 'sh',
  label: 'S&H',
  defaults: { rate: 2 },
  controls: [{ type: 'slider', path: 'rate', label: 'Rate', min: 0.1, max: 10 }],
  createState: () => ({}),
  tick: () => 0.5,
};
registerModType(SH_DEF);

describe('the modulator settings page', () => {
  it('registers a hidden panel with the type enum ahead of the LFO controls', () => {
    ModulationStore.createSlot(3);
    const panelId = ModulationStore.openSettings(3);
    expect(panelId).toBe(MOD_SETTINGS_PANEL);

    const panel = TweakStore.getPanel(MOD_SETTINGS_PANEL)!;
    expect(panel.kind).toBe('modulation');
    expect(panel.name).toBe('LFO 4');
    // The scope is a display, not a control — it registers no panel value.
    expect(panel.controls.map((c) => c.path)).toEqual(['type', 'rate', 'sync', 'phase', 'width', 'jitter', 'smooth']);

    // Hidden: not a dock panel, not a Move track page.
    expect(TweakStore.getPanels('panel').some((p) => p.id === MOD_SETTINGS_PANEL)).toBe(false);
  });

  it('lays the page out with type in the first big slot and sync under rate', () => {
    ModulationStore.createSlot(0);
    ModulationStore.openSettings(0);
    const page = buildModMovePage(TweakStore.getPanel(MOD_SETTINGS_PANEL)!);
    expect(page.dials.map((c) => c.path)).toEqual(['type', 'rate', 'phase', 'width', 'jitter', 'smooth']);
    // Rate sits in dial column 1, so the sync pad sits in pad column 1.
    expect(page.toggles[0]).toBeUndefined();
    expect(page.toggles[1]?.path).toBe('sync');
  });

  it('flows panel edits into the slot params, jitter and smooth as their own dials', () => {
    ModulationStore.createSlot(0);
    ModulationStore.openSettings(0);
    TweakStore.updateValue(MOD_SETTINGS_PANEL, 'rate', 4);
    TweakStore.updateValue(MOD_SETTINGS_PANEL, 'sync', true);
    TweakStore.updateValue(MOD_SETTINGS_PANEL, 'jitter', 0.3);
    TweakStore.updateValue(MOD_SETTINGS_PANEL, 'smooth', 0.7);
    const params = ModulationStore.getSlot(0)!.params;
    expect(params.rate).toBe(4);
    expect(params.sync).toBe(true);
    expect(params.jitter).toBe(0.3);
    expect(params.smooth).toBe(0.7);
  });

  it('switches modulator type from the enum and rebuilds the page', () => {
    ModulationStore.createSlot(0);
    ModulationStore.openSettings(0);
    TweakStore.updateValue(MOD_SETTINGS_PANEL, 'type', 'sh');
    expect(ModulationStore.getSlot(0)!.type).toBe('sh');
    expect(ModulationStore.getSlot(0)!.params).toEqual({ rate: 2 });
    const panel = TweakStore.getPanel(MOD_SETTINGS_PANEL)!;
    expect(panel.name).toBe('S&H 1');
    expect(panel.controls.map((c) => c.path)).toEqual(['type', 'rate']);
  });

  it('closes cleanly: unregisters the panel and stops following edits', () => {
    ModulationStore.createSlot(0);
    ModulationStore.openSettings(0);
    ModulationStore.closeSettings();
    expect(TweakStore.getPanel(MOD_SETTINGS_PANEL)).toBeUndefined();
    expect(ModulationStore.getSettings()).toBeNull();
    // Removing the open slot also closes its settings.
    ModulationStore.createSlot(1);
    ModulationStore.openSettings(1);
    ModulationStore.removeSlot(1);
    expect(ModulationStore.getSettings()).toBeNull();
  });

  it('refuses to modulate the settings page itself', () => {
    ModulationStore.createSlot(0);
    ModulationStore.openSettings(0);
    expect(ModulationStore.assign(MOD_SETTINGS_PANEL, 'rate', 0)).toBe(false);
  });
});
