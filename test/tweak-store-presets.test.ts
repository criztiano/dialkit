import { describe, it, expect, afterEach, vi } from 'vitest';
import { TweakStore, type PresetProvider } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `presets-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, persist?: boolean) => {
  TweakStore.registerPanel(id, id, { gravity: [9.8, 0, 20] as [number, number, number] }, undefined, { persist });
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

const makeProvider = (overrides: Partial<PresetProvider> = {}): PresetProvider => ({
  presets: [
    { id: 'factory', label: '★ Factory', readonly: true },
    { id: 'warm', label: 'Warm' },
  ],
  activeId: 'warm',
  onSelect: vi.fn(),
  onCreate: vi.fn(),
  onDelete: vi.fn(),
  ...overrides,
});

describe('stock preset mode (no provider)', () => {
  it('createPreset snapshots into "Version N" and marks it active', () => {
    const id = freshId();
    register(id);

    TweakStore.createPreset(id);
    const presets = TweakStore.getPresets(id);
    expect(presets).toHaveLength(1);
    expect(presets[0].name).toBe('Version 2');
    expect(TweakStore.getActivePresetId(id)).toBe(presets[0].id);

    TweakStore.createPreset(id);
    expect(TweakStore.getPresets(id)[1].name).toBe('Version 3');
  });

  it('getPresetItems mirrors the snapshots, all deletable', () => {
    const id = freshId();
    register(id);
    TweakStore.createPreset(id);

    const items = TweakStore.getPresetItems(id);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ name: 'Version 2', deletable: true });
  });

  it('selectPreset loads a snapshot and null restores base values', () => {
    const id = freshId();
    register(id);
    TweakStore.createPreset(id);
    const presetId = TweakStore.getPresets(id)[0].id;

    TweakStore.updateValue(id, 'gravity', 15);
    TweakStore.selectPreset(id, null);
    expect(TweakStore.getValue(id, 'gravity')).toBe(9.8);
    expect(TweakStore.getActivePresetId(id)).toBeNull();

    TweakStore.selectPreset(id, presetId);
    expect(TweakStore.getActivePresetId(id)).toBe(presetId);
  });

  it('removePreset deletes the snapshot and clears active', () => {
    const id = freshId();
    register(id);
    TweakStore.createPreset(id);
    const presetId = TweakStore.getPresets(id)[0].id;

    TweakStore.removePreset(id, presetId);
    expect(TweakStore.getPresets(id)).toHaveLength(0);
    expect(TweakStore.getActivePresetId(id)).toBeNull();
  });
});

describe('preset provider mode', () => {
  it('renders the host list in order with provider labels and active id', () => {
    const id = freshId();
    register(id);
    TweakStore.setPresetProvider(id, makeProvider());

    const items = TweakStore.getPresetItems(id);
    expect(items.map((i) => i.id)).toEqual(['factory', 'warm']);
    expect(items.map((i) => i.name)).toEqual(['★ Factory', 'Warm']);
    expect(TweakStore.getActivePresetId(id)).toBe('warm');
    expect(TweakStore.hasPresetProvider(id)).toBe(true);
  });

  it('readonly rows are not deletable; omitting onDelete disables delete everywhere', () => {
    const id = freshId();
    register(id);

    TweakStore.setPresetProvider(id, makeProvider());
    expect(TweakStore.getPresetItems(id).map((i) => i.deletable)).toEqual([false, true]);

    TweakStore.setPresetProvider(id, makeProvider({ onDelete: undefined }));
    expect(TweakStore.getPresetItems(id).map((i) => i.deletable)).toEqual([false, false]);
  });

  it('selectPreset defers to onSelect and never touches panel values', () => {
    const id = freshId();
    register(id);
    const provider = makeProvider();
    TweakStore.setPresetProvider(id, provider);

    TweakStore.updateValue(id, 'gravity', 15);
    TweakStore.selectPreset(id, 'factory');

    expect(provider.onSelect).toHaveBeenCalledWith('factory');
    // No snapshot/restore in provider mode: the host applies values itself.
    expect(TweakStore.getValue(id, 'gravity')).toBe(15);
    expect(TweakStore.getPresets(id)).toHaveLength(0);
  });

  it('createPreset suggests "Preset N" from the host list length', () => {
    const id = freshId();
    register(id);
    const provider = makeProvider();
    TweakStore.setPresetProvider(id, provider);

    TweakStore.createPreset(id);
    expect(provider.onCreate).toHaveBeenCalledWith('Preset 3');
    // No built-in snapshot was taken.
    expect(TweakStore.getPresets(id)).toHaveLength(0);
  });

  it('removePreset defers to onDelete and tolerates its absence', () => {
    const id = freshId();
    register(id);
    const provider = makeProvider();
    TweakStore.setPresetProvider(id, provider);

    TweakStore.removePreset(id, 'warm');
    expect(provider.onDelete).toHaveBeenCalledWith('warm');

    TweakStore.setPresetProvider(id, makeProvider({ onDelete: undefined }));
    expect(() => TweakStore.removePreset(id, 'warm')).not.toThrow();
  });

  it('notifies on data changes but swaps callbacks silently', () => {
    const id = freshId();
    register(id);
    const listener = vi.fn();
    const unsub = TweakStore.subscribe(id, listener);

    TweakStore.setPresetProvider(id, makeProvider());
    expect(listener).toHaveBeenCalledTimes(1);

    // Same data, fresh object + fresh callbacks: no notify, but the new
    // callbacks are the ones the store now routes to.
    const refreshed = makeProvider();
    TweakStore.setPresetProvider(id, refreshed);
    expect(listener).toHaveBeenCalledTimes(1);
    TweakStore.selectPreset(id, 'warm');
    expect(refreshed.onSelect).toHaveBeenCalledWith('warm');

    // New active id is a visible change.
    TweakStore.setPresetProvider(id, makeProvider({ activeId: 'factory' }));
    expect(listener).toHaveBeenCalledTimes(2);

    // Clearing the provider is a visible change too.
    TweakStore.setPresetProvider(id, null);
    expect(listener).toHaveBeenCalledTimes(3);
    expect(TweakStore.hasPresetProvider(id)).toBe(false);
    TweakStore.setPresetProvider(id, null);
    expect(listener).toHaveBeenCalledTimes(3);

    unsub();
  });

  it('writes nothing to browser storage', () => {
    const setItem = vi.fn();
    const g = globalThis as { window?: unknown };
    const original = g.window;
    g.window = {
      localStorage: { getItem: () => null, setItem, removeItem: () => {} },
      sessionStorage: { getItem: () => null, setItem, removeItem: () => {} },
    };

    try {
      const id = freshId();
      register(id);
      TweakStore.setPresetProvider(id, makeProvider());

      TweakStore.updateValue(id, 'gravity', 12);
      TweakStore.selectPreset(id, 'factory');
      TweakStore.createPreset(id);
      TweakStore.removePreset(id, 'warm');

      expect(setItem).not.toHaveBeenCalled();
    } finally {
      if (original === undefined) delete g.window;
      else g.window = original;
    }
  });
});
