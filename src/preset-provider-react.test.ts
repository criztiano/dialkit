import { createElement, useState } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer, ReactTestInstance } from 'react-test-renderer';
import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { Panel } from './components/Panel';
import { useTweakers } from './hooks/useTweakers';
import { TweakStore } from './store/TweakStore';
import type { PresetProvider } from './store/TweakStore';

// Folder measures window height and the preset dropdown portals to body;
// node:test has no DOM, so both are stubbed just enough to render.
const globals = globalThis as { window?: unknown; document?: unknown; navigator?: unknown };
globals.window ??= { innerHeight: 800, addEventListener() {}, removeEventListener() {} };
// nodeType 1 satisfies react-dom's portal container check; `children` and
// `createNodeMock` make the body double as a react-test-renderer container,
// since refs inside a portal resolve against the portal's container.
const nodeMock = () => ({
  style: {},
  focus() {},
  select() {},
  addEventListener() {},
  removeEventListener() {},
  contains: () => false,
  getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 0, width: 0 }),
});
globals.document ??= {
  addEventListener() {},
  removeEventListener() {},
  body: { nodeType: 1, children: [], createNodeMock: nodeMock, tag: 'CONTAINER' },
};
// Folder observes its content height.
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

let panelSeq = 0;

const makeProvider = (overrides: Partial<PresetProvider> = {}): PresetProvider => ({
  presets: [
    { id: 'factory', label: '★ Factory', readonly: true },
    { id: 'warm', label: 'Warm' },
  ],
  activeId: 'warm',
  onSelect: mock.fn(),
  onCreate: mock.fn(),
  onDelete: mock.fn(),
  ...overrides,
});

/**
 * A host component wiring the provider through useTweakers options — the real
 * consumer path — plus the Panel that renders the toolbar for that panel.
 */
function Host({ name, initial }: { name: string; initial?: PresetProvider }) {
  const [provider, setProvider] = useState(initial);
  const values = useTweakers(name, { gravity: [9.8, 0, 20] }, provider ? { presets: provider } : undefined);
  const panel = TweakStore.getPanels().find((p) => p.name === name);
  return createElement(
    'div',
    { className: 'test-host', 'data-gravity': values.gravity, 'data-set-provider': setProvider },
    panel ? createElement(Panel, { panel }) : null
  );
}

function renderHost(initial?: PresetProvider) {
  const name = `preset-provider-${++panelSeq}`;
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(createElement(Host, { name, initial }), {
      // Refs on host elements (trigger button, dropdown div) need a stand-in.
      createNodeMock: nodeMock,
    });
  });
  // The panel registers in an effect, so the Panel mounts one render later.
  act(() => {});

  const root = renderer.root;
  const trigger = (): ReactTestInstance => root.findByProps({ className: 'tweakers-preset-trigger' });
  const rows = (): ReactTestInstance[] => root.findAllByProps({ className: 'tweakers-preset-item' });

  return {
    root,
    trigger,
    rows,
    rowNames: () => rows().map((r) => r.findByProps({ className: 'tweakers-preset-name' }).props.children),
    open: () => act(() => trigger().props.onClick()),
    // Both toolbar buttons share the class; the title disambiguates.
    addButton: (): ReactTestInstance => root.findByProps({ title: 'Add preset' }),
    setProvider: (next: PresetProvider) =>
      act(() => root.findByProps({ className: 'test-host' }).props['data-set-provider'](next)),
    panelId: () => TweakStore.getPanels().find((p) => p.name === name)!.id,
    unmount: () => act(() => renderer.unmount()),
  };
}

describe('preset provider (React)', () => {
  it('renders the host list in order, marks the active row, hides the base row', () => {
    const host = renderHost(makeProvider());

    assert.equal(host.trigger().findByProps({ className: 'tweakers-preset-label' }).props.children, 'Warm');
    host.open();

    // No implicit "Version 1" base row in provider mode.
    assert.deepEqual(host.rowNames(), ['★ Factory', 'Warm']);
    assert.equal(host.rows()[0].props['data-active'], 'false');
    assert.equal(host.rows()[1].props['data-active'], 'true');

    host.unmount();
  });

  it('hides the trash icon on readonly rows', () => {
    const host = renderHost(makeProvider());
    host.open();

    assert.equal(host.rows()[0].findAllByProps({ className: 'tweakers-preset-delete' }).length, 0);
    assert.equal(host.rows()[1].findAllByProps({ className: 'tweakers-preset-delete' }).length, 1);

    host.unmount();
  });

  it('hides every trash icon when onDelete is omitted', () => {
    const host = renderHost(makeProvider({ onDelete: undefined }));
    host.open();

    assert.equal(host.root.findAllByProps({ className: 'tweakers-preset-delete' }).length, 0);

    host.unmount();
  });

  it('routes select / create / delete to the provider with the right args', () => {
    const provider = makeProvider();
    const host = renderHost(provider);
    host.open();

    act(() => host.rows()[0].props.onClick());
    const onSelect = provider.onSelect as ReturnType<typeof mock.fn>;
    assert.deepEqual(onSelect.mock.calls[0].arguments, ['factory']);

    act(() => host.addButton().props.onClick());
    const onCreate = provider.onCreate as ReturnType<typeof mock.fn>;
    assert.deepEqual(onCreate.mock.calls[0].arguments, ['Preset 3']);

    host.open();
    act(() =>
      host.rows()[1]
        .findByProps({ className: 'tweakers-preset-delete' })
        .props.onClick({ stopPropagation() {} })
    );
    const onDelete = provider.onDelete as ReturnType<typeof mock.fn>;
    assert.deepEqual(onDelete.mock.calls[0].arguments, ['warm']);

    // The store never snapshotted anything of its own.
    assert.equal(TweakStore.getPresets(host.panelId()).length, 0);

    host.unmount();
  });

  it('reflects a re-rendered provider (new list, new active id)', () => {
    const host = renderHost(makeProvider());

    host.setProvider(
      makeProvider({
        presets: [
          { id: 'factory', label: '★ Factory', readonly: true },
          { id: 'warm', label: 'Warm' },
          { id: 'cold', label: 'Cold' },
        ],
        activeId: 'cold',
      })
    );

    assert.equal(host.trigger().findByProps({ className: 'tweakers-preset-label' }).props.children, 'Cold');
    host.open();
    assert.deepEqual(host.rowNames(), ['★ Factory', 'Warm', 'Cold']);

    host.unmount();
  });

  it('keeps stock mode unchanged without a provider', () => {
    const host = renderHost();

    assert.equal(host.trigger().findByProps({ className: 'tweakers-preset-label' }).props.children, 'Version 1');

    // "+" snapshots into the store, exactly as before.
    act(() => host.addButton().props.onClick());
    const presets = TweakStore.getPresets(host.panelId());
    assert.equal(presets.length, 1);
    assert.equal(presets[0].name, 'Version 2');

    // Quick-add now opens the list in rename mode; finish that edit before
    // checking the ordinary saved-row actions.
    const input = host.root.findByProps({ className: 'tweakers-preset-name-input' });
    assert.equal(input.props.value, 'Version 2');
    act(() => input.props.onBlur());
    // Base row plus the saved version, every saved row deletable.
    assert.deepEqual(host.rowNames(), ['Version 1', 'Version 2']);
    assert.equal(host.rows()[1].findAllByProps({ className: 'tweakers-preset-delete' }).length, 1);

    host.unmount();
  });
});
