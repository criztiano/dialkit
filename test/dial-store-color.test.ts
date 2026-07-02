import { describe, it, expect, afterEach } from 'vitest';
import { DialStore } from '../src/store/DialStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `color-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof DialStore.registerPanel>[2]) => {
  DialStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) DialStore.unregisterPanel(registered.pop()!);
});

describe('color control parsing', () => {
  it('auto-detects plain hex strings as opaque color controls', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    const control = DialStore.getPanels().find((p) => p.id === id)!.controls[0];
    expect(control.type).toBe('color');
    expect(control.alpha).toBeUndefined();
  });

  it('auto-enables alpha for 8-digit and 4-digit hex defaults', () => {
    const id = freshId();
    register(id, { tint: '#310b0299', glow: '#f008' });
    const controls = DialStore.getPanels().find((p) => p.id === id)!.controls;
    expect(controls.map((c) => [c.type, c.alpha])).toEqual([
      ['color', true],
      ['color', true],
    ]);
  });

  it('carries explicit alpha/palette flags through to control meta', () => {
    const id = freshId();
    register(id, { accent: { type: 'color' as const, default: '#10b981', alpha: true, palette: true } });
    const control = DialStore.getPanels().find((p) => p.id === id)!.controls[0];
    expect(control.alpha).toBe(true);
    expect(control.palette).toBe(true);
  });
});

describe('color value reconciliation across config edits', () => {
  it('keeps a valid stored hex value', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    DialStore.updateValue(id, 'tint', '#ff0000');
    DialStore.updatePanel(id, id, { tint: '#310b02' });
    expect(DialStore.getValues(id).tint).toBe('#ff0000');
  });

  it('truncates 8-digit values to opaque hex when the config drops alpha', () => {
    const id = freshId();
    register(id, { tint: { type: 'color' as const, default: '#310b02', alpha: true } });
    DialStore.updateValue(id, 'tint', '#310b0299');
    DialStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02' } });
    expect(DialStore.getValues(id).tint).toBe('#310b02');
  });

  it('truncates 4-digit shorthand to 3-digit when the config drops alpha', () => {
    const id = freshId();
    register(id, { tint: { type: 'color' as const, default: '#310b02', alpha: true } });
    DialStore.updateValue(id, 'tint', '#f008');
    DialStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02' } });
    expect(DialStore.getValues(id).tint).toBe('#f00');
  });

  it('appends alpha digits when the config gains alpha', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    DialStore.updateValue(id, 'tint', '#ff0000');
    DialStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02', alpha: true } });
    expect(DialStore.getValues(id).tint).toBe('#ff0000ff');
  });

  it('keeps 8-digit values when alpha stays on', () => {
    const id = freshId();
    register(id, { tint: { type: 'color' as const, default: '#310b02ff', alpha: true } });
    DialStore.updateValue(id, 'tint', '#310b0299');
    DialStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02ff', alpha: true } });
    expect(DialStore.getValues(id).tint).toBe('#310b0299');
  });

  it('falls back to the default when the stored value is not hex', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    DialStore.updateValue(id, 'tint', 'not-a-color');
    DialStore.updatePanel(id, id, { tint: '#310b02' });
    expect(DialStore.getValues(id).tint).toBe('#310b02');
  });
});
