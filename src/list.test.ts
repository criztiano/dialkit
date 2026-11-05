import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import {
  defaultListItemParams,
  groupListFields,
  listDropIndex,
  moveListItem,
  normalizeListItems,
  parseListItemSchema,
  renameListItem,
  type ListItemType,
  type ListItemValue,
} from './list';
import type { DialEvent } from './choice';
import { DialStore, resolveDialValues, type DialConfig } from './store/DialStore';

const itemTypes: Record<string, ListItemType> = {
  blur: { label: 'Blur', schema: { radius: [4, 0, 20], soft: true } },
  tint: {
    label: 'Tint',
    schema: {
      color: '#ff0000',
      mode: { type: 'select', options: ['multiply', 'screen'] },
      palette: { type: 'swatch', options: [{ value: 'dusk', label: 'Dusk', colors: ['#123'] }] },
      note: { type: 'text', placeholder: 'Why' },
      amount: 0.5,
    },
    hints: { amount: 'How strong the tint is.' },
    groups: { note: 'More', palette: 'Look' },
  },
};

describe('list item schema', () => {
  it('reads every field kind in declared order', () => {
    const fields = parseListItemSchema(itemTypes.tint.schema, itemTypes.tint.hints, itemTypes.tint.groups);
    assert.deepEqual(fields.map(f => [f.key, f.kind, f.defaultValue]), [
      ['color', 'color', '#ff0000'],
      ['mode', 'select', 'multiply'],
      ['palette', 'swatch', 'dusk'],
      ['note', 'text', ''],
      ['amount', 'slider', 0.5],
    ]);
    assert.equal(fields[4].hint, 'How strong the tint is.');
    assert.deepEqual([fields[4].min, fields[4].max, fields[4].step], [0, 1, 0.01]);
    assert.equal(parseListItemSchema(itemTypes.blur.schema)[0].step, 1);
  });

  it('groups fields into sections in the order their first field is declared', () => {
    const { flat, groups } = groupListFields(parseListItemSchema(itemTypes.tint.schema, undefined, itemTypes.tint.groups));
    assert.deepEqual(flat.map(f => f.key), ['color', 'mode', 'amount']);
    assert.deepEqual(groups.map(g => [g.label, g.fields.map(f => f.key)]), [['Look', ['palette']], ['More', ['note']]]);
  });

  it('gives a new row its defaults', () => {
    assert.deepEqual(defaultListItemParams(itemTypes.blur.schema), { radius: 4, soft: true });
  });
});

describe('list rows', () => {
  it('drops unknown types, fills missing params and drops a blank title', () => {
    const rows = normalizeListItems([
      { type: 'blur', params: { radius: 9 }, title: '  Soft  ' },
      { type: 'gone', params: {} },
      { type: 'blur', params: {}, title: '   ' },
      'junk',
    ], itemTypes);
    assert.deepEqual(rows, [
      { type: 'blur', params: { radius: 9, soft: true }, title: 'Soft' },
      { type: 'blur', params: { radius: 4, soft: true } },
    ]);
    assert.deepEqual(normalizeListItems('nope', itemTypes, [{ type: 'blur', params: { radius: 1 } }]), [{ type: 'blur', params: { radius: 1 } }]);
  });

  it('moves, renames and finds the drop slot', () => {
    assert.deepEqual(moveListItem(['a', 'b', 'c'], 0, 2), ['b', 'c', 'a']);
    const rows: ListItemValue[] = [{ type: 'blur', params: {}, title: 'Old' }];
    assert.deepEqual(renameListItem(rows, 0, ' New '), [{ type: 'blur', params: {}, title: 'New' }]);
    assert.deepEqual(renameListItem(rows, 0, ''), [{ type: 'blur', params: {} }]);
    // Row 0 dropped after row 2 lands at index 2, once row 0 has left its place.
    assert.equal(listDropIndex(0, 2, true), 2);
    assert.equal(listDropIndex(2, 0, false), 0);
    assert.equal(listDropIndex(1, 1, true), 1);
  });
});

describe('list control in the store', () => {
  const config = {
    effects: { type: 'list', itemTypes, default: [{ type: 'blur', params: {} }], max: 3, addLabel: 'Add effect' },
  } satisfies DialConfig;

  it('parses, resolves, keeps valid rows and resets', () => {
    const id = 'list-store-test';
    try {
      DialStore.registerPanel(id, 'List', config);
      const control = DialStore.getControl(id, 'effects')!;
      assert.equal(control.type, 'list');
      assert.equal(control.list?.max, 3);
      assert.deepEqual(control.list?.default, [{ type: 'blur', params: { radius: 4, soft: true } }]);
      const values: { effects: ListItemValue[] } = resolveDialValues(config, DialStore.getValues(id));
      assert.deepEqual(values, { effects: [{ type: 'blur', params: { radius: 4, soft: true } }] });

      DialStore.updateValue(id, 'effects', [{ type: 'tint', params: { amount: 1 } }, { type: 'gone', params: {} }]);
      const stored = DialStore.getValue(id, 'effects') as ListItemValue[];
      assert.equal(stored.length, 1);
      assert.equal(stored[0].params.amount, 1);
      assert.equal(stored[0].params.mode, 'multiply');

      DialStore.updatePanel(id, 'List', config);
      assert.equal((DialStore.getValue(id, 'effects') as ListItemValue[])[0].type, 'tint');

      DialStore.resetValues(id);
      assert.deepEqual(DialStore.getValue(id, 'effects'), [{ type: 'blur', params: { radius: 4, soft: true } }]);
    } finally { DialStore.unregisterPanel(id); }
  });
});

describe('ListControl (React)', () => {
  // Folder reads the window's height, which node:test has none of.
  const globals = globalThis as { window?: unknown };
  globals.window ??= { innerHeight: 800, addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) };

  async function renderList(value: ListItemValue[]) {
    const { ListControl } = await import('./components/ListControl');
    const changes: ListItemValue[][] = [];
    const events: DialEvent[] = [];
    let renderer!: ReactTestRenderer;
    act(() => {
      renderer = create(createElement(ListControl, {
        label: 'Effects', value, itemTypes, maxItems: 2,
        onChange: (next: ListItemValue[]) => changes.push(next),
        onEvent: (event: DialEvent) => events.push(event),
      }));
    });
    const byClass = (className: string) => renderer.root.findAll(node => typeof node.props.className === 'string' && node.props.className.split(' ').includes(className) && typeof node.type === 'string');
    return { renderer, changes, events, byClass };
  }

  it('renames a row and reports a rename', async () => {
    const { changes, events, byClass, renderer } = await renderList([{ type: 'blur', params: { radius: 4, soft: true } }]);
    act(() => byClass('dialkit-list-item-title')[0].props.onClick());
    act(() => byClass('dialkit-list-item-title')[0].props.onBlur({ currentTarget: { value: '  Soft  ' } }));
    assert.deepEqual(changes, [[{ type: 'blur', params: { radius: 4, soft: true }, title: 'Soft' }]]);
    assert.deepEqual(events, [{ kind: 'list', op: 'rename', index: 0 }]);
    act(() => renderer.unmount());
  });

  it('moves a row with Alt+Arrow and removes one', async () => {
    const rows: ListItemValue[] = [{ type: 'blur', params: { radius: 1, soft: true } }, { type: 'blur', params: { radius: 2, soft: true } }];
    const { changes, events, byClass, renderer } = await renderList(rows);
    act(() => byClass('dialkit-list-drag')[0].props.onKeyDown({ altKey: true, key: 'ArrowDown', preventDefault() {} }));
    assert.deepEqual(changes[0].map(r => r.params.radius), [2, 1]);
    act(() => byClass('dialkit-list-remove')[1].props.onClick());
    assert.deepEqual(changes[1].map(r => r.params.radius), [1]);
    assert.deepEqual(events, [{ kind: 'list', op: 'move', from: 0, to: 1 }, { kind: 'list', op: 'remove', index: 1 }]);
    // Two rows is the cap, so there is no add button.
    assert.equal(byClass('dialkit-list-add-button').length, 0);
    act(() => renderer.unmount());
  });
});
