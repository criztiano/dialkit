import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer, ReactTestInstance } from 'react-test-renderer';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ControlRenderer } from './components/ControlRenderer';
import { TweakStore } from './store/TweakStore';

// Folder measures window height and Slider binds pointer handlers; node:test has
// no DOM.
const globals = globalThis as { window?: unknown };
globals.window ??= { innerHeight: 800, addEventListener() {}, removeEventListener() {} };

let panelSeq = 0;

function renderPanel(hints?: Record<string, string>) {
  const id = `hint-render-${++panelSeq}`;
  TweakStore.registerPanel(id, id, { gravity: [9.8, 0, 20], physics: { elastic: [0.5, 0, 1] } }, undefined, { hints });

  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      createElement(ControlRenderer, {
        panelId: id,
        controls: TweakStore.getPanel(id)?.controls ?? [],
        values: TweakStore.getValues(id),
      })
    );
  });

  return {
    id,
    root: renderer.root,
    dispose: () => TweakStore.unregisterPanel(id),
    // Index 0 is `gravity`; the nested `physics.elastic` gets a wrapper too.
    wrapper: (): ReactTestInstance => renderer.root.findAllByProps({ className: 'tweakers-control-tip' })[0],
    tooltips: () => renderer.root.findAllByProps({ className: 'tweakers-hint' }),
  };
}

// The reveal itself is CSS (:hover / :focus-within), so what's worth asserting
// is the contract that CSS and assistive tech both depend on: the data-hint
// host, an always-mounted tooltip, and an aria-describedby that resolves to it.
describe('control hint rendering (React)', () => {
  it('marks the wrapper and points aria-describedby at a mounted tooltip', () => {
    const panel = renderPanel({ gravity: 'Downward pull on every body.' });
    const wrapper = panel.wrapper();
    const tooltip = panel.tooltips()[0];

    assert.equal(wrapper.props['data-hint'], 'true');
    assert.equal(wrapper.props.role, 'group');
    assert.equal(wrapper.props['aria-describedby'], tooltip.props.id);
    assert.equal(tooltip.props.children, 'Downward pull on every body.');
    assert.equal(tooltip.props.role, 'tooltip');

    panel.dispose();
  });

  it('falls back to the config-path tooltip when a control has no hint', () => {
    const panel = renderPanel();
    const wrapper = panel.wrapper();

    assert.equal(wrapper.props.title, 'gravity');
    assert.equal(wrapper.props['data-hint'], undefined);
    assert.equal(panel.tooltips().length, 0);

    panel.dispose();
  });

  it('drops the path tooltip once a hint takes over, so only one shows', () => {
    const panel = renderPanel({ gravity: 'Downward pull on every body.' });

    assert.equal(panel.wrapper().props.title, undefined);

    panel.dispose();
  });

  it('hangs a folder hint on the header, not on a wrapper around its children', () => {
    const panel = renderPanel({ physics: 'How bodies respond to force.' });
    const header = panel.root.findByProps({ 'data-hint': 'true' });

    assert.ok(String(header.props.className).includes('tweakers-folder-header'));
    assert.equal(header.props['aria-describedby'], panel.tooltips()[0].props.id);

    panel.dispose();
  });
});
