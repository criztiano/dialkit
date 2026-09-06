import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MOVE_SLOT_LIBRARY, MoveSlotXYBody } from '../src/components/move-slots';

describe('shared XY slot face', () => {
  const props = { label: 'Position', value: '25·75', position: { x: 0.25, y: 0.25 }, gridN: 5 };

  it('exposes the same face used by the panel and renders normalized screen coordinates', () => {
    expect(MOVE_SLOT_LIBRARY.xy.component).toBe(MoveSlotXYBody);
    const html = renderToStaticMarkup(createElement(MoveSlotXYBody, props));
    expect(html).toContain('--tweak-xy-grid-step-x:20%');
    expect(html).toContain('left:25%;top:25%');
    expect(html).toContain('25·75');
    expect(html).not.toContain('tweakers-move-xy-curve');
  });

  it('replaces the grid and crosshair with the supplied live preview', () => {
    const html = renderToStaticMarkup(createElement(MoveSlotXYBody, {
      ...props, shape: 'M0 100L100 0', value: 'Rise',
    }));
    expect(html).toContain('d="M0 100L100 0"');
    expect(html).toContain('Rise');
    expect(html).not.toContain('tweakers-move-xy-grid');
    expect(html).not.toContain('tweakers-move-xy-dot');
  });
});
