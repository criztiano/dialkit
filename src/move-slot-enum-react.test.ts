import { createElement } from 'react';
import { create } from 'react-test-renderer';
import type { ReactTestInstance } from 'react-test-renderer';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MoveSlotEnumBody, MOVE_LIST_ROWS } from './components/move-slots';

const OPTIONS = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'square', label: 'Square' },
  { value: 'landscape', label: 'Landscape' },
];

/** One more option than the slot's list holds — the point it starts to run. */
const LONG = Array.from({ length: MOVE_LIST_ROWS + 1 }, (_, i) => ({
  value: `opt-${i}`,
  label: `Option ${i}`,
}));

function renderSlot(
  opts: {
    activeIdx?: number;
    shape?: string | null;
    glyph?: string | null;
    options?: typeof OPTIONS;
  } = {}
) {
  const options = opts.options ?? OPTIONS;
  const activeIdx = opts.activeIdx ?? 0;
  const renderer = create(
    createElement(MoveSlotEnumBody, {
      label: 'Shape',
      optionLabel: options[activeIdx].label,
      options,
      activeIdx,
      shape: opts.shape ?? null,
      glyph: opts.glyph ?? null,
    })
  );
  const byClass = (className: string): ReactTestInstance[] =>
    renderer.root.findAll((n) => n.props.className === className);
  return {
    screen: () => byClass('tweakers-move-dial-screen')[0],
    rows: () => byClass('tweakers-list-screen-row'),
    labels: () => byClass('tweakers-list-screen-label').map((n) => n.props.children),
    caption: () => byClass('tweakers-move-dial-option'),
    head: () => byClass('tweakers-move-dial-head')[0],
    tag: () => byClass('tweakers-move-dial-tag')[0],
    cells: () => byClass('tweakers-move-dial-enum-cell'),
  };
}

describe('the plain option slot (React)', () => {
  it('shows every option on the list screen, the current one selected', () => {
    const slot = renderSlot({ activeIdx: 1 });
    assert.deepEqual(slot.labels(), ['Portrait', 'Square', 'Landscape']);
    const selected = slot.rows().filter((row) => row.props['data-selected']);
    assert.equal(selected.length, 1);
    assert.equal(selected[0].props['aria-selected'], true);
  });

  it('gives the name a head of its own, and a picture the tag', () => {
    assert.equal(renderSlot().head().props.children, 'Shape');
    assert.equal(renderSlot().tag(), undefined);
    assert.equal(renderSlot({ glyph: 'arrow-right' }).tag().props.children, 'Shape');
    assert.equal(renderSlot({ glyph: 'arrow-right' }).head(), undefined);
  });

  it('names the option under the picture instead, when there is one', () => {
    const glyph = renderSlot({ activeIdx: 2, glyph: 'arrow-right' });
    assert.equal(glyph.rows().length, 0);
    assert.equal(glyph.caption()[0].props.children, 'Landscape');

    const curve = renderSlot({ activeIdx: 2, shape: 'M 0 0 L 100 100' });
    assert.equal(curve.rows().length, 0);
    assert.equal(curve.caption()[0].props.children, 'Landscape');
  });

  it('leaves the pagination cells to the faces that name one option', () => {
    // A list has the whole run on it; the cells would only repeat it.
    assert.equal(renderSlot().cells().length, 0);
    assert.equal(renderSlot({ options: LONG }).cells().length, 0);
    assert.equal(renderSlot({ glyph: 'arrow-right' }).cells().length, OPTIONS.length);
  });

  it('grows on touch only when the run is longer than the slot holds', () => {
    assert.equal(renderSlot().screen().props['data-grow'], undefined);
    assert.equal(renderSlot({ options: LONG }).screen().props['data-grow'], true);
    // The count is what the CSS measures the grown height from.
    assert.equal(
      renderSlot({ options: LONG }).screen().props.style['--move-list-count'],
      LONG.length
    );
  });
});
