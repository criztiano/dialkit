import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  addDriver,
  buildSamplers,
  defaultComposition,
  flipSegmentX,
  flipSegmentY,
  readComposition,
  removeDriver,
  removeSegment,
  splitSegment,
  triggerLevels,
  triggersCrossed,
  type CurveComposition,
} from './curve-composer-core';
import { CurveComposer } from './components/CurveComposer';
import { Module, ModuleFolder } from './components/Module';
import { Slider } from './components/Slider';

const linear = (): CurveComposition => ({
  segments: [{ type: 'linear', weight: 1, curvature: 0, steepness: 0, overshoot: 0, anticipate: 0 }],
  driver: null,
  direction: 'forward',
});

describe('curve composition edits', () => {
  it('starts with two segments, no driver, playing forward', () => {
    const comp = defaultComposition();
    assert.equal(comp.segments.length, 2);
    assert.equal(comp.driver, null);
    assert.equal(comp.direction, 'forward');
  });

  it('splits a segment into a copy and re-divides every segment evenly', () => {
    const comp = defaultComposition();
    comp.segments[0].weight = 3;
    const next = splitSegment(comp, 0);
    assert.deepEqual(next.segments.map((s) => s.type), ['easeOut', 'easeOut', 'easeInOut']);
    assert.deepEqual(next.segments.map((s) => s.weight), [1, 1, 1]);
    assert.equal(comp.segments.length, 2, 'the input is not changed');
    assert.equal(splitSegment(comp, 9), comp, 'an index out of range changes nothing');
  });

  it('removes a segment but never the last one', () => {
    const comp = defaultComposition();
    const one = removeSegment(comp, 0);
    assert.deepEqual(one.segments.map((s) => s.type), ['easeInOut']);
    assert.equal(removeSegment(one, 0), one);
  });

  it('flips a segment in time and in value, and a second flip undoes it', () => {
    const comp = defaultComposition();
    const x = flipSegmentX(comp, 1);
    assert.equal(x.segments[1].flipX, true);
    assert.equal(x.segments[0].flipX, undefined);
    assert.equal(flipSegmentX(x, 1).segments[1].flipX, false);
    assert.equal(flipSegmentY(comp, 0).segments[0].flipY, true);
  });

  it('adds one driver and removes it', () => {
    const withDriver = addDriver(defaultComposition());
    assert.equal(withDriver.driver?.type, 'easeInOut');
    assert.equal(addDriver(withDriver), withDriver, 'a second add keeps the first driver');
    assert.equal(removeDriver(withDriver).driver, null);
  });
});

describe('reading a composition', () => {
  it('reads a linear segment as its phase', () => {
    const comp = linear();
    const s = buildSamplers(comp);
    for (const u of [0, 0.25, 0.5, 0.75]) {
      assert.ok(Math.abs(readComposition(comp, u, s).value - u) < 1e-6);
    }
  });

  it('walks each segment from 0 to 1 on its own', () => {
    const comp = splitSegment(linear(), 0);
    const s = buildSamplers(comp);
    const first = readComposition(comp, 0.25, s);
    const second = readComposition(comp, 0.75, s);
    assert.equal(first.segIndex, 0);
    assert.equal(second.segIndex, 1);
    assert.ok(Math.abs(first.value - 0.5) < 1e-6);
    assert.ok(Math.abs(second.value - 0.5) < 1e-6);
  });

  it('reads reverse back to front and mirror there and back', () => {
    const s = buildSamplers(linear());
    assert.ok(Math.abs(readComposition({ ...linear(), direction: 'reverse' }, 0.25, s).value - 0.75) < 1e-6);
    assert.ok(Math.abs(readComposition({ ...linear(), direction: 'mirror' }, 0.75, s).value - 0.5) < 1e-6);
  });

  it('lets a driver change the pace of the read', () => {
    const comp = addDriver(linear());
    const s = buildSamplers(comp);
    const early = readComposition(comp, 0.1, s);
    assert.ok(early.warpedPhase < early.inputPhase, 'an easeInOut driver starts slow');
  });
});

describe('trigger levels', () => {
  it('spaces the levels evenly from 0 to 1', () => {
    assert.deepEqual(triggerLevels(5), [0, 0.25, 0.5, 0.75, 1]);
    assert.deepEqual(triggerLevels(1), [0, 1]);
  });

  it('fires the inner levels a smooth move crosses, in the direction of travel', () => {
    assert.deepEqual(triggersCrossed(0.2, 0.55, 5), [1, 2]);
    assert.deepEqual(triggersCrossed(0.55, 0.2, 5), [2, 1]);
    assert.deepEqual(triggersCrossed(0.3, 0.3, 5), []);
  });

  it('fires the far end once on a jump back', () => {
    assert.deepEqual(triggersCrossed(0.98, 0.02, 5), [4]);
    assert.deepEqual(triggersCrossed(0.02, 0.98, 5), [0]);
  });

  it('fires each level once over a forward loop of a linear curve', () => {
    const comp = linear();
    const s = buildSamplers(comp);
    const fired: number[] = [];
    let prev = readComposition(comp, 0, s).value;
    for (let frame = 1; frame <= 120; frame++) {
      const cur = readComposition(comp, (frame % 100) / 100, s).value;
      fired.push(...triggersCrossed(prev, cur, 5));
      prev = cur;
    }
    assert.deepEqual(fired.slice(0, 4), [1, 2, 3, 4]);
  });
});

// The composer and the module draw on the next frame; node has no frames.
(globalThis as { requestAnimationFrame?: unknown }).requestAnimationFrame ??= () => 0;
(globalThis as { cancelAnimationFrame?: unknown }).cancelAnimationFrame ??= () => {};

describe('library components', () => {
  it('draws one curve per segment and a second lane for a driver', () => {
    const comp = addDriver(defaultComposition());
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(createElement(CurveComposer, { segments: comp.segments, driver: comp.driver, width: 200, height: 100, grid: true }));
    });
    const curves = renderer.root.findAll((n) => typeof n.type === 'string' && String(n.props.className ?? '').includes('dialkit-composer-curve'));
    assert.equal(curves.length, 3);
    assert.equal(renderer.root.findAll((n) => n.props.className === 'dialkit-composer-lane').length, 2);
    act(() => renderer.unmount());
  });

  it('folds a Module body while it is off', () => {
    const calls: boolean[] = [];
    let renderer!: ReturnType<typeof create>;
    const render = (enabled: boolean) => createElement(Module, { title: 'Air', enabled, onEnabledChange: (v: boolean) => calls.push(v) }, createElement('span', null, 'body'));
    act(() => { renderer = create(render(false)); });
    const body = () => renderer.root.find((n) => n.type === 'div' && n.props.className === 'dialkit-module-collapse');
    assert.equal(body().props['data-open'], 'false');
    const on = renderer.root.find((n) => n.type === 'button' && n.props.children === 'On');
    act(() => on.props.onClick());
    assert.deepEqual(calls, [true]);
    act(() => renderer.update(render(true)));
    assert.equal(body().props['data-open'], 'true');
    act(() => renderer.unmount());
  });

  it('folds a ModuleFolder body from its header while it is on', () => {
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(createElement(ModuleFolder, { title: 'Tension', enabled: true, onEnabledChange: () => {} }, createElement('span', null, 'body')));
    });
    const body = () => renderer.root.find((n) => n.type === 'div' && n.props.className === 'dialkit-module-collapse');
    assert.equal(body().props['data-open'], 'true');
    act(() => renderer.root.find((n) => n.props.className === 'dialkit-module-header').props.onClick());
    assert.equal(body().props['data-open'], 'false');
    act(() => renderer.unmount());
  });

  it('shows a formatted slider value in place of the number and unit', () => {
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(createElement(Slider, { label: 'Delay', value: 120, min: 0, max: 1000, step: 1, unit: 'ms', formatValue: (v: number) => `${v} ms!`, onChange: () => {} }));
    });
    const value = renderer.root.find((n) => n.type === 'span' && String(n.props.className ?? '').startsWith('dialkit-slider-value'));
    assert.deepEqual([value.props.children].flat().filter(Boolean), ['120 ms!']);
    act(() => renderer.unmount());
  });

  it('works from the keyboard: Enter cycles a segment, Delete removes it, arrows move a divider', () => {
    const comp = defaultComposition();
    let segments = comp.segments;
    let driverType: string | undefined;
    const withDriver = addDriver(comp);
    let renderer!: ReturnType<typeof create>;
    const render = () => createElement(CurveComposer, {
      segments,
      driver: withDriver.driver,
      width: 200,
      height: 100,
      onSegmentsChange: (next) => { segments = next; },
      onDriverChange: (next) => { driverType = next.type; },
    });
    act(() => { renderer = create(render()); });
    const keyEvent = (key: string, shiftKey = false) => ({ key, shiftKey, altKey: false, metaKey: false, ctrlKey: false, preventDefault() {}, stopPropagation() {} });
    const segmentKeys = () => renderer.root.findAll((n) => n.type === 'button' && String(n.props.className ?? '').includes('dialkit-composer-segment-key') && !String(n.props.className).includes('driver'));
    const divider = () => renderer.root.find((n) => n.props.role === 'slider');

    assert.equal(segmentKeys().length, 2);
    assert.equal(divider().props.tabIndex, 0);
    assert.equal(divider().props['aria-valuenow'], 50);

    const firstType = segments[0].type;
    act(() => segmentKeys()[0].props.onKeyDown(keyEvent('Enter')));
    assert.notEqual(segments[0].type, firstType);

    act(() => divider().props.onKeyDown(keyEvent('ArrowRight')));
    act(() => renderer.update(render()));
    assert.equal(divider().props['aria-valuenow'], 51);
    act(() => divider().props.onKeyDown(keyEvent('ArrowLeft', true)));
    act(() => renderer.update(render()));
    assert.equal(divider().props['aria-valuenow'], 41);

    const driverKey = renderer.root.find((n) => String(n.props.className ?? '').includes('dialkit-composer-driver-key'));
    act(() => driverKey.props.onKeyDown(keyEvent(' ')));
    assert.ok(driverType && driverType !== withDriver.driver!.type);

    act(() => segmentKeys()[1].props.onKeyDown(keyEvent('Delete')));
    act(() => renderer.update(render()));
    assert.equal(segments.length, 1);
    assert.equal(segmentKeys().length, 1);
    // The last segment stays.
    act(() => segmentKeys()[0].props.onKeyDown(keyEvent('Delete')));
    assert.equal(segments.length, 1);
    act(() => renderer.unmount());
  });
});
