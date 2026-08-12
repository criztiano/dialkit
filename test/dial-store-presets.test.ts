import { describe, it, expect, afterEach, vi } from 'vitest';
import { DialStore, type PresetProvider } from '../src/store/DialStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `presets-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, persist?: boolean) => {
  DialStore.registerPanel(id, id, { gravity: [9.8, 0, 20] as [number, number, number] }, undefined, { persist });
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
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

    DialStore.createPreset(id);
    const presets = DialStore.getPresets(id);
    expect(presets).toHaveLength(1);
    expect(presets[0].name).toBe('Version 2');
    expect(DialStore.getActivePresetId(id)).toBe(presets[0].id);

    DialStore.createPreset(id);
    expect(DialStore.getPresets(id)[1].name).toBe('Version 3');
  });

  it('getPresetItems mirrors the snapshots, all deletable', () => {
    const id = freshId();
    register(id);
    DialStore.createPreset(id);

    const items = DialStore.getPresetItems(id);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ name: 'Version 2', deletable: true });
  });

  it('selectPreset loads a snapshot and null restores base values', () => {
    const id = freshId();
    register(id);
    DialStore.createPreset(id);
    const presetId = DialStore.getPresets(id)[0].id;

    DialStore.updateValue(id, 'gravity', 15);
    DialStore.selectPreset(id, null);
    expect(DialStore.getValue(id, 'gravity')).toBe(9.8);
    expect(DialStore.getActivePresetId(id)).toBeNull();

    DialStore.selectPreset(id, presetId);
    expect(DialStore.getActivePresetId(id)).toBe(presetId);
  });

  it('removePreset deletes the snapshot and clears active', () => {
    const id = freshId();
    register(id);
    DialStore.createPreset(id);
    const presetId = DialStore.getPresets(id)[0].id;

    DialStore.removePreset(id, presetId);
    expect(DialStore.getPresets(id)).toHaveLength(0);
    expect(DialStore.getActivePresetId(id)).toBeNull();
  });
});

describe('preset provider mode', () => {
  it('renders the host list in order with provider labels and active id', () => {
    const id = freshId();
    register(id);
    DialStore.setPresetProvider(id, makeProvider());

    const items = DialStore.getPresetItems(id);
    expect(items.map((i) => i.id)).toEqual(['factory', 'warm']);
    expect(items.map((i) => i.name)).toEqual(['★ Factory', 'Warm']);
    expect(DialStore.getActivePresetId(id)).toBe('warm');
    expect(DialStore.hasPresetProvider(id)).toBe(true);
  });

  it('readonly rows are not deletable; omitting onDelete disables delete everywhere', () => {
    const id = freshId();
    register(id);

    DialStore.setPresetProvider(id, makeProvider());
    expect(DialStore.getPresetItems(id).map((i) => i.deletable)).toEqual([false, true]);

    DialStore.setPresetProvider(id, makeProvider({ onDelete: undefined }));
    expect(DialStore.getPresetItems(id).map((i) => i.deletable)).toEqual([false, false]);
  });

  it('selectPreset defers to onSelect and never touches panel values', () => {
    const id = freshId();
    register(id);
    const provider = makeProvider();
    DialStore.setPresetProvider(id, provider);

    DialStore.updateValue(id, 'gravity', 15);
    DialStore.selectPreset(id, 'factory');

    expect(provider.onSelect).toHaveBeenCalledWith('factory');
    // No snapshot/restore in provider mode: the host applies values itself.
    expect(DialStore.getValue(id, 'gravity')).toBe(15);
    expect(DialStore.getPresets(id)).toHaveLength(0);
  });

  it('createPreset suggests "Preset N" from the host list length', () => {
    const id = freshId();
    register(id);
    const provider = makeProvider();
    DialStore.setPresetProvider(id, provider);

    DialStore.createPreset(id);
    expect(provider.onCreate).toHaveBeenCalledWith('Preset 3');
    // No built-in snapshot was taken.
    expect(DialStore.getPresets(id)).toHaveLength(0);
  });

  it('removePreset defers to onDelete and tolerates its absence', () => {
    const id = freshId();
    register(id);
    const provider = makeProvider();
    DialStore.setPresetProvider(id, provider);

    DialStore.removePreset(id, 'warm');
    expect(provider.onDelete).toHaveBeenCalledWith('warm');

    DialStore.setPresetProvider(id, makeProvider({ onDelete: undefined }));
    expect(() => DialStore.removePreset(id, 'warm')).not.toThrow();
  });

  it('notifies on data changes but swaps callbacks silently', () => {
    const id = freshId();
    register(id);
    const listener = vi.fn();
    const unsub = DialStore.subscribe(id, listener);

    DialStore.setPresetProvider(id, makeProvider());
    expect(listener).toHaveBeenCalledTimes(1);

    // Same data, fresh object + fresh callbacks: no notify, but the new
    // callbacks are the ones the store now routes to.
    const refreshed = makeProvider();
    DialStore.setPresetProvider(id, refreshed);
    expect(listener).toHaveBeenCalledTimes(1);
    DialStore.selectPreset(id, 'warm');
    expect(refreshed.onSelect).toHaveBeenCalledWith('warm');

    // New active id is a visible change.
    DialStore.setPresetProvider(id, makeProvider({ activeId: 'factory' }));
    expect(listener).toHaveBeenCalledTimes(2);

    // Clearing the provider is a visible change too.
    DialStore.setPresetProvider(id, null);
    expect(listener).toHaveBeenCalledTimes(3);
    expect(DialStore.hasPresetProvider(id)).toBe(false);
    DialStore.setPresetProvider(id, null);
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
      DialStore.setPresetProvider(id, makeProvider());

      DialStore.updateValue(id, 'gravity', 12);
      DialStore.selectPreset(id, 'factory');
      DialStore.createPreset(id);
      DialStore.removePreset(id, 'warm');

      expect(setItem).not.toHaveBeenCalled();
    } finally {
      if (original === undefined) delete g.window;
      else g.window = original;
    }
  });
});
