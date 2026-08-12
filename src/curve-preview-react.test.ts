import { createElement, useState } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer, ReactTestInstance } from 'react-test-renderer';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ControlRenderer } from './components/ControlRenderer';
import { useDialKit } from './hooks/useDialKit';
import { DialStore } from './store/DialStore';

// node:test has no DOM; stub what the control tree touches.
const globals = globalThis as { window?: unknown };
globals.window ??= { innerHeight: 800, addEventListener() {}, removeEventListener() {} };

let panelSeq = 0;

const curvePath = (root: ReactTestInstance): string =>
  root.findAllByProps({ className: 'dialkit-curve-stroke' })[0]?.props.d ?? '';

const markerXs = (root: ReactTestInstance): number[] =>
  root.findAllByProps({ className: 'dialkit-curve-marker' }).map((line) => line.props.x1 as number);

describe('curve preview row (React)', () => {
  it('renders the sampled stroke on a dial surface, with and without a label', () => {
    const id = `curve-render-${++panelSeq}`;
    DialStore.registerPanel(id, id, {
      arc: { type: 'curve' as const, sample: (t: number) => t },
      bare: { type: 'curve' as const, sample: (t: number) => t, label: false as const },
    });

    let renderer!: ReactTestRenderer;
    act(() => {
      renderer = create(
        createElement(ControlRenderer, {
          panelId: id,
          controls: DialStore.getPanel(id)?.controls ?? [],
          values: DialStore.getValues(id),
        })
      );
    });

    assert.ok(curvePath(renderer.root).startsWith('M '));
    const labels = renderer.root.findAllByProps({ className: 'dialkit-curve-label' });
    assert.equal(labels.length, 1); // `bare` declared label: false
    assert.equal(labels[0].props.children, 'Arc');

    act(() => renderer.unmount());
    DialStore.unregisterPanel(id);
  });

  it('redraws when the host swaps in a new sample function', () => {
    // The real consumer path: the host rebuilds its config per render, closing
    // the sampler over its own state; only the function identity changes, so
    // the redraw must ride syncCurveConfigs, not the config structure diff.
    let bump!: () => void;
    let resolved: Record<string, unknown> = {};
    function Host() {
      const [gain, setGain] = useState(1);
      bump = () => setGain((g) => g + 1);
      resolved = useDialKit(`curve-host-${panelSeq}`, {
        arc: { type: 'curve' as const, sample: (t: number) => Math.sin(t * Math.PI * gain) },
      });
      const panel = DialStore.getPanels('panel').find((p) => p.name === `curve-host-${panelSeq}`);
      return panel
        ? createElement(ControlRenderer, { panelId: panel.id, controls: panel.controls, values: panel.values })
        : null;
    }

    panelSeq++;
    let renderer!: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Host));
    });

    // Display-only: the curve key must not leak into the resolved values.
    assert.deepEqual(Object.keys(resolved), []);

    const before = curvePath(renderer.root);
    assert.ok(before.startsWith('M '));

    act(() => bump());
    const after = curvePath(renderer.root);
    assert.ok(after.startsWith('M '));
    // gain 1 → half sine; gain 2 → full sine: a genuinely different shape even
    // after normalization, so the redraw is observable in the path data.
    assert.notEqual(after, before);

    act(() => renderer.unmount());
  });

  it('draws reference markers behind the stroke and tracks dynamic marker values', () => {
    // Markers are plain data, but they ride the same per-render sync as the
    // sampler, so a host that rebuilds its config with new positions must see
    // the lines move. Invalid entries never make it to the SVG.
    let bump!: () => void;
    function Host() {
      const [split, setSplit] = useState(0.25);
      bump = () => setSplit(0.75);
      useDialKit(`curve-markers-${panelSeq}`, {
        arc: {
          type: 'curve' as const,
          sample: (t: number) => t,
          markers: [split, 0.5, -1, NaN, 2],
        },
      });
      const panel = DialStore.getPanels('panel').find((p) => p.name === `curve-markers-${panelSeq}`);
      return panel
        ? createElement(ControlRenderer, { panelId: panel.id, controls: panel.controls, values: panel.values })
        : null;
    }

    panelSeq++;
    let renderer!: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(Host));
    });

    // Two valid markers survive; the out-of-range and NaN entries are skipped.
    assert.deepEqual(markerXs(renderer.root), [0.25 * 232, 0.5 * 232]);

    // Behind the curve: marker lines precede the stroke in document order.
    const svg = renderer.root.findAllByType('svg')[0];
    const classes = svg.children
      .map((c) => (typeof c === 'string' ? '' : (c.props as { className?: string }).className ?? ''))
      .filter((c) => c === 'dialkit-curve-marker' || c === 'dialkit-curve-stroke');
    assert.deepEqual(classes, ['dialkit-curve-marker', 'dialkit-curve-marker', 'dialkit-curve-stroke']);

    act(() => bump());
    assert.deepEqual(markerXs(renderer.root), [0.75 * 232, 0.5 * 232]);

    act(() => renderer.unmount());
  });
});
