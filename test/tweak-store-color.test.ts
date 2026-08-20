import { describe, it, expect, afterEach } from 'vitest';
import { TweakStore } from '../src/store/TweakStore';

// Each test gets its own panel id; unregister keeps the singleton clean.
let panelSeq = 0;
const freshId = () => `color-test-${++panelSeq}`;

const registered: string[] = [];
const register = (id: string, config: Parameters<typeof TweakStore.registerPanel>[2]) => {
  TweakStore.registerPanel(id, id, config);
  registered.push(id);
};

afterEach(() => {
  while (registered.length) TweakStore.unregisterPanel(registered.pop()!);
});

describe('color control parsing', () => {
  it('auto-detects plain hex strings as opaque color controls', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    const control = TweakStore.getPanels().find((p) => p.id === id)!.controls[0];
    expect(control.type).toBe('color');
    expect(control.alpha).toBeUndefined();
  });

  it('auto-enables alpha for 8-digit and 4-digit hex defaults', () => {
    const id = freshId();
    register(id, { tint: '#310b0299', glow: '#f008' });
    const controls = TweakStore.getPanels().find((p) => p.id === id)!.controls;
    expect(controls.map((c) => [c.type, c.alpha])).toEqual([
      ['color', true],
      ['color', true],
    ]);
  });

  it('carries explicit alpha/palette flags through to control meta', () => {
    const id = freshId();
    register(id, { accent: { type: 'color' as const, default: '#10b981', alpha: true, palette: true } });
    const control = TweakStore.getPanels().find((p) => p.id === id)!.controls[0];
    expect(control.alpha).toBe(true);
    expect(control.palette).toBe(true);
  });
});

describe('color value reconciliation across config edits', () => {
  it('keeps a valid stored hex value', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    TweakStore.updateValue(id, 'tint', '#ff0000');
    TweakStore.updatePanel(id, id, { tint: '#310b02' });
    expect(TweakStore.getValues(id).tint).toBe('#ff0000');
  });

  it('truncates 8-digit values to opaque hex when the config drops alpha', () => {
    const id = freshId();
    register(id, { tint: { type: 'color' as const, default: '#310b02', alpha: true } });
    TweakStore.updateValue(id, 'tint', '#310b0299');
    TweakStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02' } });
    expect(TweakStore.getValues(id).tint).toBe('#310b02');
  });

  it('truncates 4-digit shorthand to 3-digit when the config drops alpha', () => {
    const id = freshId();
    register(id, { tint: { type: 'color' as const, default: '#310b02', alpha: true } });
    TweakStore.updateValue(id, 'tint', '#f008');
    TweakStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02' } });
    expect(TweakStore.getValues(id).tint).toBe('#f00');
  });

  it('appends alpha digits when the config gains alpha', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    TweakStore.updateValue(id, 'tint', '#ff0000');
    TweakStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02', alpha: true } });
    expect(TweakStore.getValues(id).tint).toBe('#ff0000ff');
  });

  it('keeps 8-digit values when alpha stays on', () => {
    const id = freshId();
    register(id, { tint: { type: 'color' as const, default: '#310b02ff', alpha: true } });
    TweakStore.updateValue(id, 'tint', '#310b0299');
    TweakStore.updatePanel(id, id, { tint: { type: 'color' as const, default: '#310b02ff', alpha: true } });
    expect(TweakStore.getValues(id).tint).toBe('#310b0299');
  });

  it('falls back to the default when the stored value is not hex', () => {
    const id = freshId();
    register(id, { tint: '#310b02' });
    TweakStore.updateValue(id, 'tint', 'not-a-color');
    TweakStore.updatePanel(id, id, { tint: '#310b02' });
    expect(TweakStore.getValues(id).tint).toBe('#310b02');
  });
});
