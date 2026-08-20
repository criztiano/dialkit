import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer, ReactTestInstance } from 'react-test-renderer';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ListControl } from './components/ListControl';
import type { TweakEvent, ListItemType, ListItemValue } from './store/TweakStore';

// ListControl disarms drag-to-reorder on a window listener, and Folder measures
// window height; neither exists under node:test.
const globals = globalThis as { window?: unknown };
globals.window ??= { innerHeight: 800, addEventListener() {}, removeEventListener() {} };

const itemTypes: Record<string, ListItemType> = {
  saturate: { label: 'Saturate', schema: { amount: [1, 0, 2] } },
};

function renderList(value: ListItemValue[]) {
  const changes: ListItemValue[][] = [];
  const events: TweakEvent[] = [];
  let renderer!: ReactTestRenderer;

  act(() => {
    renderer = create(
      createElement(ListControl, {
        label: 'Effects',
        value,
        itemTypes,
        onChange: (next: ListItemValue[]) => changes.push(next),
        onEvent: (event: TweakEvent) => events.push(event),
      })
    );
  });

  // Resolved fresh each time: the same class names the static button and the
  // editing input, and only one of the two is mounted.
  const title = (): ReactTestInstance =>
    renderer.root.findByProps({ className: 'tweakers-list-item-title' });

  const rename = (raw: string) => {
    act(() => title().props.onClick());
    act(() => title().props.onBlur({ currentTarget: { value: raw } }));
  };

  return { renderer, changes, events, title, rename };
}

// A row title is what lets a caller name a row after its own subject (a model's
// filename) instead of inventing one item type per row.
describe('list row rename (React)', () => {
  it('stores a trimmed title and reports a rename, not a param change', () => {
    const { changes, events, rename } = renderList([{ type: 'saturate', params: { amount: 1 } }]);

    rename('  chair.glb  ');

    assert.deepEqual(changes, [[{ type: 'saturate', params: { amount: 1 }, title: 'chair.glb' }]]);
    assert.deepEqual(events, [{ kind: 'list', op: 'rename', index: 0 }]);
  });

  it('drops the title when the field is cleared, so the row falls back to its type label', () => {
    const { changes, events, rename } = renderList([
      { type: 'saturate', params: { amount: 1 }, title: 'chair.glb' },
    ]);

    rename('   ');

    assert.deepEqual(changes, [[{ type: 'saturate', params: { amount: 1 } }]]);
    assert.equal(events.length, 1);
  });

  it('stays silent when the title comes back unchanged', () => {
    const { changes, events, rename } = renderList([
      { type: 'saturate', params: { amount: 1 }, title: 'chair.glb' },
    ]);

    rename('chair.glb');

    assert.deepEqual(changes, []);
    assert.deepEqual(events, []);
  });

  it('shows the item type label until the row has a title of its own', () => {
    const untitled = renderList([{ type: 'saturate', params: { amount: 1 } }]);
    assert.equal(untitled.title().props.children, 'Saturate');

    const titled = renderList([{ type: 'saturate', params: { amount: 1 }, title: 'chair.glb' }]);
    assert.equal(titled.title().props.children, 'chair.glb');
  });
});
