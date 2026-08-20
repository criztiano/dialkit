import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore, normalizeListItems, type ListConfig, type ListItemValue } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `list-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof TweakStore.registerPanel>[2]) => {
  TweakStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

const itemTypes = {
  body: { label: 'Body', schema: { mass: [1, 0, 10] as [number, number, number] } },
};

const listConfig = (rows: ListItemValue[]): ListConfig => ({
  type: 'list',
  itemTypes,
  default: rows,
});

// A row's `title` is what lets a caller put its own name (a model's filename,
// say) on the row instead of inventing one item type per row. It must survive
// materialization, and must be absent — never '' — when there is no name, so
// the renderer falls back to the item type's label.
describe('list row titles', () => {
  it('keeps a non-blank title and trims it', () => {
    const [row] = normalizeListItems(listConfig([{ type: 'body', params: {}, title: '  chair.glb  ' }]));
    expect(row.title).toBe('chair.glb');
  });

  it('omits the key entirely for a blank title', () => {
    const [row] = normalizeListItems(listConfig([{ type: 'body', params: {}, title: '   ' }]));
    expect('title' in row).toBe(false);
  });

  it('omits the key for a non-string title from a hand-edited preset', () => {
    const rows = [{ type: 'body', params: {}, title: 42 } as unknown as ListItemValue];
    const [row] = normalizeListItems(listConfig(rows));
    expect('title' in row).toBe(false);
  });

  it('backfills schema params without disturbing the title', () => {
    const [row] = normalizeListItems(listConfig([{ type: 'body', params: {}, title: 'chair.glb' }]));
    expect(row).toEqual({ type: 'body', params: { mass: 1 }, title: 'chair.glb' });
  });

  it('preserves a renamed row across a panel config update', () => {
    const id = freshId();
    register(id, { bodies: listConfig([{ type: 'body', params: { mass: 1 } }]) });
    // What an inline rename writes back.
    TweakStore.updateValue(id, 'bodies', [{ type: 'body', params: { mass: 1 }, title: 'chair.glb' }]);
    TweakStore.updatePanel(id, id, { bodies: listConfig([{ type: 'body', params: { mass: 1 } }]) });
    expect(TweakStore.getValues(id).bodies).toEqual([
      { type: 'body', params: { mass: 1 }, title: 'chair.glb' },
    ]);
  });
});
