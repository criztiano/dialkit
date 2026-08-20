import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `xy-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof TweakStore.registerPanel>[2]) => {
  TweakStore.registerPanel(id, id, config);
  registered.push(id);
};

const controlsOf = (id: string) => TweakStore.getPanels().find((p) => p.id === id)!.controls;

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

describe('xy control parsing', () => {
  it('registers an explicit { type: "xy" } config as an xy control', () => {
    const id = freshId();
    register(id, {
      pos: { type: 'xy', x: { min: 0, max: 1 }, y: { min: 0, max: 1 }, default: { x: 0.25, y: 0.75 } },
    });
    const control = controlsOf(id)[0];
    expect(control.type).toBe('xy');
    expect(control.path).toBe('pos');
    expect(TweakStore.getValues(id).pos).toEqual({ x: 0.25, y: 0.75 });
  });

  it('carries the axis/grid/snap options through to control meta', () => {
    const id = freshId();
    register(id, {
      pos: {
        type: 'xy',
        x: { min: -1, max: 1, bipolar: true },
        y: { min: 0, max: 10 },
        grid: 8,
        snap: true,
        returnToCenter: true,
        showValues: true,
      },
    });
    const control = controlsOf(id)[0];
    expect(control.xAxis).toEqual({ min: -1, max: 1, bipolar: true });
    expect(control.yAxis).toEqual({ min: 0, max: 10 });
    expect(control.grid).toBe(8);
    expect(control.snap).toBe(true);
    expect(control.returnToCenter).toBe(true);
    expect(control.showValues).toBe(true);
  });

  it('treats a bare { x, y } object as a folder, not an xy pad', () => {
    const id = freshId();
    register(id, { grp: { x: 0.5, y: 0.5 } });
    const controls = controlsOf(id);
    // The deliberate contract: only explicit { type: 'xy' } becomes a pad;
    // a bare { x, y } falls through to the nested-object → folder branch.
    expect(controls.some((c) => c.type === 'xy')).toBe(false);
    const folder = controls.find((c) => c.path === 'grp')!;
    expect(folder.type).toBe('folder');
    // Its { x, y } become two nested sliders, not an xy value.
    expect(folder.children?.map((c) => [c.path, c.type])).toEqual([
      ['grp.x', 'slider'],
      ['grp.y', 'slider'],
    ]);
    expect(TweakStore.getValues(id)['grp.x']).toBe(0.5);
    expect(TweakStore.getValues(id)['grp.y']).toBe(0.5);
  });

  it('clamps an out-of-range default into each axis range on register', () => {
    const id = freshId();
    register(id, {
      pos: { type: 'xy', x: { min: 0, max: 1 }, y: { min: 0, max: 1 }, default: { x: 5, y: -3 } },
    });
    expect(TweakStore.getValues(id).pos).toEqual({ x: 1, y: 0 });
  });

  it('falls back missing default components to each axis origin', () => {
    const id = freshId();
    register(id, {
      // No default at all → both components resolve to their axis origin (min here).
      pos: { type: 'xy', x: { min: 2, max: 6 }, y: { min: -4, max: 4, bipolar: true } },
    });
    // x origin = min (2); y bipolar origin = midpoint (0).
    expect(TweakStore.getValues(id).pos).toEqual({ x: 2, y: 0 });
  });
});

describe('xy value reconciliation across config edits', () => {
  it('keeps an in-range preserved point when the config is re-registered', () => {
    const id = freshId();
    register(id, {
      pos: { type: 'xy', x: { min: 0, max: 1 }, y: { min: 0, max: 1 }, default: { x: 0.5, y: 0.5 } },
    });
    TweakStore.updateValue(id, 'pos', { x: 0.2, y: 0.8 });
    TweakStore.updatePanel(id, id, {
      pos: { type: 'xy', x: { min: 0, max: 1 }, y: { min: 0, max: 1 }, default: { x: 0.5, y: 0.5 } },
    });
    expect(TweakStore.getValues(id).pos).toEqual({ x: 0.2, y: 0.8 });
  });

  it('re-clamps a preserved point when the axis range shrinks', () => {
    const id = freshId();
    register(id, {
      pos: { type: 'xy', x: { min: 0, max: 10 }, y: { min: 0, max: 10 }, default: { x: 5, y: 5 } },
    });
    TweakStore.updateValue(id, 'pos', { x: 9, y: 8 });
    // Config edit narrows both axes to [0,1]; the preserved point is re-clamped.
    TweakStore.updatePanel(id, id, {
      pos: { type: 'xy', x: { min: 0, max: 1 }, y: { min: 0, max: 1 }, default: { x: 0.5, y: 0.5 } },
    });
    expect(TweakStore.getValues(id).pos).toEqual({ x: 1, y: 1 });
  });

  it('falls back to the default when the preserved value loses its shape', () => {
    const id = freshId();
    register(id, {
      pos: { type: 'xy', x: { min: 0, max: 1 }, y: { min: 0, max: 1 }, default: { x: 0.3, y: 0.6 } },
    });
    // A garbage stored value (no numeric x/y) cannot be re-clamped → default wins.
    TweakStore.updateValue(id, 'pos', 'not-a-point');
    TweakStore.updatePanel(id, id, {
      pos: { type: 'xy', x: { min: 0, max: 1 }, y: { min: 0, max: 1 }, default: { x: 0.3, y: 0.6 } },
    });
    expect(TweakStore.getValues(id).pos).toEqual({ x: 0.3, y: 0.6 });
  });
});
