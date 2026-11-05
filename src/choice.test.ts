import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  fileValue,
  galleryIdOf,
  galleryImageOptions,
  gallerySrcOf,
  normalizeChoice,
  normalizeMultiSelectOptions,
  normalizeMultiSelectValue,
  toggleMultiSelect,
  type DialEvent,
} from './choice';
import { DialStore, resolveDialValues, type DialConfig } from './store/DialStore';

describe('multiselect values', () => {
  const options = normalizeMultiSelectOptions(['a', { value: 'b', label: 'B', tag: 'cloud' }, 'c']);

  it('makes string options into rows', () => {
    assert.deepEqual(options, [{ value: 'a', label: 'a' }, { value: 'b', label: 'B', tag: 'cloud' }, { value: 'c', label: 'c' }]);
  });

  it('keeps option order, not click order', () => {
    assert.deepEqual(toggleMultiSelect(['c'], options, 'a'), ['a', 'c']);
    assert.deepEqual(toggleMultiSelect(['a', 'c'], options, 'a'), ['c']);
  });

  it('drops values whose option is gone, and keeps an empty list', () => {
    assert.deepEqual(normalizeMultiSelectValue(['a', 'gone'], options), ['a']);
    assert.deepEqual(normalizeMultiSelectValue([], options, ['a']), []);
    assert.deepEqual(normalizeMultiSelectValue('a', options, ['b']), ['b']);
    assert.deepEqual(normalizeMultiSelectValue([1], options, ['b']), ['b']);
  });
});

describe('single choices, files and galleries', () => {
  it('falls back when a choice names no option', () => {
    assert.equal(normalizeChoice('b', ['a', 'b'], 'a'), 'b');
    assert.equal(normalizeChoice('x', ['a', 'b'], 'a'), 'a');
    assert.equal(normalizeChoice(3, ['a'], 'a'), 'a');
  });

  it('names a pick by its file, or counts the files', () => {
    assert.equal(fileValue([]), '');
    assert.equal(fileValue([{ name: 'logo.svg' }]), 'logo.svg');
    assert.equal(fileValue([{ name: 'a.png' }, { name: 'b.png' }]), '2 files');
  });

  it('maps gallery ids to images and back, leaving out items without an image', () => {
    const items = [{ id: 'one', src: '/1.png', alt: 'First' }, { id: 'two', render: () => null }, { id: 'three', src: '/3.png' }];
    assert.deepEqual(galleryImageOptions(items), [{ value: '/1.png', label: 'First' }, { value: '/3.png', label: 'three' }]);
    assert.equal(gallerySrcOf(items, 'three'), '/3.png');
    assert.equal(gallerySrcOf(items, 'two'), '');
    assert.equal(galleryIdOf(items, '/1.png'), 'one');
    assert.equal(galleryIdOf(items, 'data:image/png;base64,x'), undefined);
    assert.equal(galleryIdOf(items, ''), undefined);
  });
});

describe('choice controls in the store', () => {
  const config = {
    look: {
      chips: { type: 'chips', options: [{ value: 'warm', label: 'Warm' }, { value: 'mine', label: 'Mine', removable: true }] },
      tags: { type: 'multiselect', options: ['grain', 'blur', 'glow'], default: ['blur'] },
      palette: { type: 'swatch', options: [{ value: 'dusk', label: 'Dusk', colors: ['#123', '#456'] }, { value: 'sea', label: 'Sea', colors: ['#0af'] }], default: 'sea' },
      source: { type: 'file', accept: 'image/*' },
      cover: { type: 'gallery', items: [{ id: 'a', src: '/a.png' }, { id: 'b', src: '/b.png' }] },
    },
  } satisfies DialConfig;

  it('parses each control with its default', () => {
    const id = 'choice-store-defaults';
    try {
      DialStore.registerPanel(id, 'Choice', config);
      assert.equal(DialStore.getControl(id, 'look.chips')?.type, 'chips');
      assert.equal(DialStore.getControl(id, 'look.chips')?.chips?.[1].removable, true);
      assert.deepEqual(DialStore.getControl(id, 'look.tags')?.multiSelect?.map(o => o.value), ['grain', 'blur', 'glow']);
      assert.equal(DialStore.getControl(id, 'look.palette')?.swatches?.length, 2);
      assert.equal(DialStore.getControl(id, 'look.source')?.file?.accept, 'image/*');
      assert.equal(DialStore.getControl(id, 'look.cover')?.gallery?.length, 2);
      const values: { look: { chips: string; tags: string[]; palette: string; source: string; cover: string } } = resolveDialValues(config, DialStore.getValues(id));
      assert.deepEqual(values, { look: { chips: 'warm', tags: ['blur'], palette: 'sea', source: '', cover: 'a' } });
    } finally { DialStore.unregisterPanel(id); }
  });

  it('keeps valid stored values across a new registration, and resets them', () => {
    const id = 'choice-store-keep';
    try {
      DialStore.registerPanel(id, 'Choice', config);
      DialStore.updateValues(id, { 'look.chips': 'mine', 'look.tags': ['glow', 'nope', 'grain'], 'look.palette': 'dusk', 'look.source': 'photo.png', 'look.cover': 'b' });
      // A multiselect write is made valid, in option order.
      assert.deepEqual(DialStore.getValue(id, 'look.tags'), ['grain', 'glow']);

      const edited = { look: { ...config.look, chips: { type: 'chips', options: [{ value: 'warm', label: 'Warm' }] }, tags: { type: 'multiselect', options: ['grain', 'blur'] } } } satisfies DialConfig;
      DialStore.updatePanel(id, 'Choice', edited);
      assert.equal(DialStore.getValue(id, 'look.chips'), 'warm');
      assert.deepEqual(DialStore.getValue(id, 'look.tags'), ['grain']);
      assert.equal(DialStore.getValue(id, 'look.palette'), 'dusk');
      assert.equal(DialStore.getValue(id, 'look.source'), 'photo.png');
      assert.equal(DialStore.getValue(id, 'look.cover'), 'b');

      // The same list written again changes nothing.
      let notified = 0;
      const stop = DialStore.subscribe(id, () => { notified += 1; });
      DialStore.updateValue(id, 'look.tags', ['grain']);
      assert.equal(notified, 0);
      stop();

      DialStore.resetValues(id);
      assert.deepEqual(DialStore.getValue(id, 'look.tags'), []);
      assert.equal(DialStore.getValue(id, 'look.cover'), 'a');
    } finally { DialStore.unregisterPanel(id); }
  });

  it('sends events to the panel listeners only', () => {
    const id = 'choice-store-events';
    try {
      DialStore.registerPanel(id, 'Choice', config);
      const heard: [string, DialEvent][] = [];
      const stop = DialStore.subscribeEvents(id, (path, event) => heard.push([path, event]));
      DialStore.emitEvent(id, 'look.chips', { kind: 'remove', value: 'mine' });
      DialStore.emitEvent('other-panel', 'look.chips', { kind: 'remove', value: 'x' });
      stop();
      DialStore.emitEvent(id, 'look.chips', { kind: 'remove', value: 'late' });
      assert.deepEqual(heard, [['look.chips', { kind: 'remove', value: 'mine' }]]);
    } finally { DialStore.unregisterPanel(id); }
  });
});
