import { createElement, useState } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer, ReactTestInstance } from 'react-test-renderer';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ControlRenderer } from './components/ControlRenderer';
import { DialStore } from './store/DialStore';
import type { AffordanceContext } from './store/DialStore';

// Folder measures window height and Slider binds pointer handlers; node:test has
// no DOM. document is stubbed only enough for the popover's listeners and portal.
const globals = globalThis as { window?: unknown; document?: unknown };
globals.window ??= { innerHeight: 800, addEventListener() {}, removeEventListener() {} };
globals.document ??= { addEventListener() {}, removeEventListener() {}, body: {} };

let panelSeq = 0;

/** A stateful popover: proves the content keeps its own hooks, not the shell's. */
function Bind({ setStatus }: AffordanceContext) {
  const [bound, setBound] = useState(false);
  return createElement(
    'button',
    {
      className: 'test-bind',
      onClick: () => {
        setBound(!bound);
        setStatus(!bound ? 'active' : 'off');
      },
    },
    bound ? 'bound' : 'unbound'
  );
}

function renderPanel(withAffordance = true) {
  const id = `affordance-render-${++panelSeq}`;
  DialStore.registerPanel(id, id, { gravity: [9.8, 0, 20] }, undefined, {
    affordances: withAffordance ? { gravity: { label: 'Bind to music', content: Bind } } : undefined,
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

  const dot = (): ReactTestInstance =>
    renderer.root.findByProps({ className: 'dialkit-affordance-dot' });

  return {
    id,
    root: renderer.root,
    dot,
    dots: () => renderer.root.findAllByProps({ className: 'dialkit-affordance-dot' }),
    popovers: () => renderer.root.findAllByProps({ className: 'dialkit-affordance-popover' }),
    toggle: () => act(() => dot().props.onClick()),
    dispose: () => DialStore.unregisterPanel(id),
  };
}

describe('affordance dot and popover (React)', () => {
  it('renders nothing extra for a control with no affordance', () => {
    const panel = renderPanel(false);

    assert.equal(panel.dots().length, 0);
    assert.equal(panel.root.findAllByProps({ 'data-affordance': 'true' }).length, 0);

    panel.dispose();
  });

  it('renders a labelled, collapsed dot and opens on click', () => {
    const panel = renderPanel();

    assert.equal(panel.dot().props['aria-label'], 'Bind to music');
    assert.equal(panel.dot().props['aria-expanded'], false);
    assert.equal(panel.dot().props['data-status'], 'off');
    assert.equal(panel.popovers().length, 0);

    panel.toggle();

    assert.equal(panel.dot().props['aria-expanded'], true);
    assert.equal(panel.popovers().length, 1);
    assert.equal(panel.popovers()[0].props['aria-label'], 'Bind to music');
    assert.equal(panel.popovers()[0].props.role, 'dialog');

    panel.dispose();
  });

  // The bug this guards: calling content() during render files its hooks under
  // the shell's, so opening the popover changes the shell's hook order.
  it('gives the popover content its own state', () => {
    const panel = renderPanel();
    panel.toggle();

    const button = panel.root.findByProps({ className: 'test-bind' });
    assert.equal(button.props.children, 'unbound');

    act(() => button.props.onClick());

    assert.equal(panel.root.findByProps({ className: 'test-bind' }).props.children, 'bound');

    panel.dispose();
  });

  it('lights the dot from whatever status the content pushes', () => {
    const panel = renderPanel();
    panel.toggle();

    act(() => panel.root.findByProps({ className: 'test-bind' }).props.onClick());
    assert.equal(panel.dot().props['data-status'], 'active');

    // Closing the popover leaves the binding — and the lit dot — in place.
    panel.toggle();
    assert.equal(panel.popovers().length, 0);
    assert.equal(panel.dot().props['data-status'], 'active');

    panel.dispose();
  });

  it('reflects a status pushed from outside the popover', () => {
    const panel = renderPanel();

    act(() => DialStore.setAffordanceStatus(panel.id, 'gravity', 'armed'));
    assert.equal(panel.dot().props['data-status'], 'armed');

    panel.dispose();
  });
});
