import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useTweakers } from './hooks/useTweakers';
import { TweakStore } from './store/TweakStore';

// The hook only registers a panel and reads the store back — no DOM — but
// react-test-renderer still wants a window to exist.
const globals = globalThis as { window?: unknown };
globals.window ??= { innerHeight: 800, addEventListener() {}, removeEventListener() {} };

/** Render a config through useTweakers and hand back what the host receives. */
function resolve(config: Parameters<typeof useTweakers>[1]): Record<string, unknown> {
  let seen: Record<string, unknown> = {};
  function Probe() {
    seen = useTweakers('Resolved', config) as Record<string, unknown>;
    return null;
  }
  let tree: ReturnType<typeof create> | undefined;
  act(() => { tree = create(createElement(Probe)); });
  act(() => { tree?.unmount(); });
  return seen;
}

// Object-valued controls (xy, range, filter, transfer) have plain-object
// configs, so before this they fell through to the nested-folder branch and
// the host got the CONFIG back instead of the value — a pad handed the app
// `{type:'xy', x:{min,max}, …}`, and `value.x` was an axis, not a number.
describe('useTweakers resolves object-valued controls to their value', () => {
  it('gives an xy pad its point, not its axes', () => {
    const v = resolve({
      pad: { type: 'xy', default: { x: 0.25, y: 0.75 }, x: { min: 0, max: 1 }, y: { min: 0, max: 1 } },
    }) as { pad: { x: number; y: number } };
    assert.equal(typeof v.pad.x, 'number');
    assert.equal(typeof v.pad.y, 'number');
    assert.equal(v.pad.x, 0.25);
    assert.equal(v.pad.y, 0.75);
  });

  it('gives a range its two ends', () => {
    const v = resolve({ span: { type: 'range', min: 0, max: 1, default: { min: 0.2, max: 0.8 } } }) as
      { span: { min: number; max: number } };
    assert.deepEqual(v.span, { min: 0.2, max: 0.8 });
  });

  it('gives a range the full span when it declares no default', () => {
    const v = resolve({ span: { type: 'range', min: 2, max: 9 } }) as { span: { min: number; max: number } };
    assert.deepEqual(v.span, { min: 2, max: 9 });
  });

  it('gives a filter its two hands', () => {
    const v = resolve({ tone: { type: 'filter', default: { cutoff: 800, resonance: 0.4 } } }) as
      { tone: { cutoff: number; resonance: number } };
    assert.equal(typeof v.tone.cutoff, 'number');
    assert.equal(typeof v.tone.resonance, 'number');
  });

  it('gives a transfer curve its points', () => {
    const v = resolve({
      gamma: { type: 'transfer', default: { points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.8 }, { x: 1, y: 1 }] } },
    }) as { gamma: { points: { x: number; y: number }[] } };
    assert.equal(v.gamma.points.length, 3);
    assert.deepEqual(v.gamma.points[1], { x: 0.5, y: 0.8 });
  });

  it('keeps display-only rows out of the resolved shape', () => {
    const v = resolve({
      amount: [0.5, 0, 1],
      shape: { type: 'curve', sample: (t: number) => t },
      spectrum: { type: 'analyser', analyser: () => null },
    });
    assert.deepEqual(Object.keys(v), ['amount']);
  });

  it('still resolves a real nested folder as a folder', () => {
    const v = resolve({ shadow: { blur: [10, 0, 50], color: '#000000' } }) as
      { shadow: { blur: number; color: string } };
    assert.equal(v.shadow.blur, 10);
    assert.equal(v.shadow.color, '#000000');
  });

  it('follows the store after an edit', () => {
    let seen: Record<string, unknown> = {};
    const config = { pad: { type: 'xy' as const, default: { x: 0, y: 0 } } };
    function Probe() {
      seen = useTweakers('Edited', config) as Record<string, unknown>;
      return null;
    }
    let tree: ReturnType<typeof create> | undefined;
    act(() => { tree = create(createElement(Probe)); });
    const id = TweakStore.getPanels().find((p) => p.name === 'Edited')!.id;
    act(() => { TweakStore.updateValue(id, 'pad', { x: 0.6, y: 0.1 }); });
    assert.deepEqual(seen.pad, { x: 0.6, y: 0.1 });
    act(() => { tree?.unmount(); });
  });
});
