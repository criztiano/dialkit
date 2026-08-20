import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolvePersistTarget,
  loadPersisted,
  savePersisted,
  clearPersisted,
  type PersistTarget,
} from './store/persist';
import { TweakStore } from './store/TweakStore';

// Minimal in-memory Storage stand-in — only the methods persist.ts touches.
function mockStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => { map.set(k, String(v)); },
    removeItem: (k: string) => { map.delete(k); },
  };
}

type GlobalWithWindow = { window?: unknown };

function withMockWindow(run: () => void): void {
  const g = globalThis as GlobalWithWindow;
  const original = g.window;
  g.window = { localStorage: mockStorage() };
  try {
    run();
  } finally {
    if (original === undefined) delete g.window;
    else g.window = original;
  }
}

describe('persist helpers', () => {
  it('builds a namespaced+versioned key and honors persist.key / storage', () => {
    const on = resolvePersistTarget('panel', 'abc', true);
    assert.equal(on?.key, 'tweakers:v1:panel:abc');
    assert.equal(on?.storage, 'localStorage');

    const custom = resolvePersistTarget('panel', 'abc', { key: 'custom', storage: 'sessionStorage' });
    assert.equal(custom?.key, 'tweakers:v1:panel:custom');
    assert.equal(custom?.storage, 'sessionStorage');

    assert.equal(resolvePersistTarget('panel', 'abc', false), null);
    assert.equal(resolvePersistTarget('panel', 'abc', undefined), null);
    // Needs a stable base id (or explicit key) to be meaningful across reloads.
    assert.equal(resolvePersistTarget('panel', undefined, true), null);
  });

  it('is fail-soft and node-safe when window is undefined', () => {
    const target: PersistTarget = { key: 'tweakers:v1:panel:x', storage: 'localStorage' };
    assert.equal(loadPersisted(target), null);
    // Neither of these may throw when storage is unavailable.
    savePersisted(target, { a: 1 });
    clearPersisted(target);
    assert.equal(loadPersisted(null), null);
  });

  it('round-trips a value through storage', () => {
    withMockWindow(() => {
      const target = resolvePersistTarget('timeline-loop', 'rt', true);
      assert.equal(loadPersisted(target), null);
      savePersisted(target, { start: 1, end: 2 });
      assert.deepEqual(loadPersisted(target), { start: 1, end: 2 });
      clearPersisted(target);
      assert.equal(loadPersisted(target), null);
    });
  });
});

describe('TweakStore persistence', () => {
  it('restores persisted panel values on re-register (simulated reload)', () => {
    withMockWindow(() => {
      const id = 'persist-panel-roundtrip';
      TweakStore.registerPanel(id, 'P', { size: 10, on: false }, undefined, { persist: true });
      TweakStore.updateValue(id, 'size', 42);
      TweakStore.updateValue(id, 'on', true);
      TweakStore.unregisterPanel(id); // reload: tear down…

      TweakStore.registerPanel(id, 'P', { size: 10, on: false }, undefined, { persist: true }); // …and mount again
      const values = TweakStore.getValues(id);
      assert.equal(values.size, 42);
      assert.equal(values.on, true);
      TweakStore.unregisterPanel(id);
    });
  });

  it('does not persist without the persist option', () => {
    withMockWindow(() => {
      const id = 'persist-panel-off';
      TweakStore.registerPanel(id, 'P', { size: 10 }, undefined, {});
      TweakStore.updateValue(id, 'size', 99);
      TweakStore.unregisterPanel(id);

      TweakStore.registerPanel(id, 'P', { size: 10 }, undefined, {});
      assert.equal(TweakStore.getValues(id).size, 10); // back to the config default
      TweakStore.unregisterPanel(id);
    });
  });

  it('drops persisted keys the config no longer declares', () => {
    withMockWindow(() => {
      const id = 'persist-panel-drop';
      TweakStore.registerPanel(id, 'P', { a: 1, b: 2 }, undefined, { persist: true });
      TweakStore.updateValue(id, 'a', 9);
      TweakStore.updateValue(id, 'b', 8);
      TweakStore.unregisterPanel(id);

      // Re-register without `b`: its stale saved value must not resurrect.
      TweakStore.registerPanel(id, 'P', { a: 1 }, undefined, { persist: true });
      const values = TweakStore.getValues(id);
      assert.equal(values.a, 9);
      assert.equal('b' in values, false);
      TweakStore.unregisterPanel(id);
    });
  });
});
