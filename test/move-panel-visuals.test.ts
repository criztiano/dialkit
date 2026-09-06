import { createElement } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MovePanel, MOVE_OVERRIDE_EVENT } from '../src/components/MovePanel';
import { TweakStore, type TweakConfig } from '../src/store/TweakStore';

let renderer: ReactTestRenderer | undefined;
const id = 'move-visual-interaction';

beforeEach(() => {
  vi.stubGlobal('window', new EventTarget());
});
afterEach(() => {
  act(() => renderer?.unmount());
  renderer = undefined;
  TweakStore.unregisterPanel(id);
  vi.unstubAllGlobals();
});

function mount(config: TweakConfig) {
  TweakStore.registerPanel(id, 'Visual', config);
  act(() => { renderer = create(createElement(MovePanel, { panels: 'Visual', dock: 'flow', productionEnabled: true })); });
}
const dial = (label: string) => renderer!.root.findByProps({ role: 'slider', 'aria-label': label });
const keyEvent = (key: string, shiftKey = false) => ({ key, shiftKey, preventDefault: vi.fn(), stopPropagation: vi.fn() });
const pointer = (clientX: number, shiftKey = false) => ({
  clientX, clientY: 0, pointerId: 1, shiftKey,
  currentTarget: { setPointerCapture: vi.fn(), getBoundingClientRect: () => ({ left: 0, top: 0, width: 120, height: 140 }) },
});
const opacity = { type: 'slider', min: 0, max: 1, default: 0.5, step: 0.01, moveVisual: { kind: 'opacity' } } as const;

describe('MovePanel semantic interactions', () => {
  it('exposes the current domain and commits keyboard edits to the shared store', () => {
    mount({ opacity });
    expect(dial('Opacity').props['aria-valuenow']).toBe(0.5);
    expect(dial('Opacity').props['aria-valuetext']).toBe('50%');
    const right = keyEvent('ArrowRight');
    act(() => dial('Opacity').props.onKeyDown(right));
    expect(TweakStore.getValues(id).opacity).toBe(0.51);
    expect(dial('Opacity').props['aria-valuetext']).toBe('51%');
    expect(right.preventDefault).toHaveBeenCalledOnce();
    act(() => dial('Opacity').props.onKeyDown(keyEvent('End')));
    expect(TweakStore.getValues(id).opacity).toBe(1);
    act(() => dial('Opacity').props.onKeyDown(keyEvent('Home')));
    expect(TweakStore.getValues(id).opacity).toBe(0);
  });

  it('updates the rendered specimens when shared values change', () => {
    mount({
      opacity,
      blur: { type: 'slider', min: 0, max: 12, default: 0, moveVisual: { kind: 'blur' } },
      pan: { type: 'slider', min: -1, max: 1, default: 0, moveVisual: { kind: 'pan' } },
      pitch: { type: 'slider', min: -12, max: 12, default: 0, moveVisual: { kind: 'pitch' } },
    });
    const solid = (label: string) => dial(label).findByProps({ className: 'tweakers-move-visual-solid' });
    const point = () => dial('Pan').findByProps({ className: 'tweakers-move-visual-point' });
    const triangle = () => dial('Pitch').findByProps({ className: 'tweakers-move-visual-pitch-marker' });
    expect(solid('Opacity').props.opacity).toBe(0.5);
    expect(solid('Blur').props.style.filter).toBe('blur(0px)');
    expect(point().props.cx).toBe(50);
    expect(triangle().props['data-offset']).toBeUndefined();
    act(() => {
      for (const label of ['Opacity', 'Blur', 'Pan', 'Pitch']) dial(label).props.onKeyDown(keyEvent('End'));
    });
    expect(solid('Opacity').props.opacity).toBe(1);
    expect(solid('Blur').props.style.filter).not.toBe('blur(0px)');
    expect(point().props.cx).toBe(84);
    expect(point().props['data-offset']).toBe(true);
    expect(triangle().props.d).toBe('M92 22l-5 -7h10z');
    expect(triangle().props['data-offset']).toBe(true);
  });

  it('keeps pointer dragging and shift fine dragging on the existing mapping', () => {
    mount({ opacity });
    act(() => dial('Opacity').props.onPointerDown(pointer(60)));
    expect(TweakStore.getValues(id).opacity).toBe(0.5);
    act(() => dial('Opacity').props.onPointerMove(pointer(70, true)));
    expect(TweakStore.getValues(id).opacity).toBe(0.5);
    act(() => dial('Opacity').props.onPointerMove(pointer(90, true)));
    expect(TweakStore.getValues(id).opacity).toBe(0.52);
    act(() => dial('Opacity').props.onPointerUp());
  });

  it('responds to runtime disabled state and blocks key, pointer and in-progress drag edits', () => {
    mount({ opacity });
    act(() => dial('Opacity').props.onPointerDown(pointer(60)));
    act(() => TweakStore.setDisabled(id, 'opacity', true));
    expect(dial('Opacity').props['aria-disabled']).toBe(true);
    expect(dial('Opacity').props.tabIndex).toBe(-1);
    act(() => {
      dial('Opacity').props.onKeyDown(keyEvent('End'));
      dial('Opacity').props.onPointerDown(pointer(110));
      dial('Opacity').props.onPointerMove(pointer(110));
    });
    expect(TweakStore.getValues(id).opacity).toBe(0.5);
    act(() => TweakStore.setDisabled(id, 'opacity', false));
    act(() => dial('Opacity').props.onKeyDown(keyEvent('End')));
    expect(TweakStore.getValues(id).opacity).toBe(1);
  });

  it('steps app playback values and names the selected mode to assistive technology', () => {
    mount({ direction: { type: 'select', options: [{ value: 'f', label: 'Forward' }, { value: 'r', label: 'Reverse' }], moveVisual: { kind: 'playback', modes: { f: 'forward', r: 'reverse' } } } });
    act(() => dial('Direction').props.onKeyDown(keyEvent('ArrowRight')));
    expect(TweakStore.getValues(id).direction).toBe('r');
    expect(dial('Direction').props['aria-valuetext']).toBe('Reverse');
    expect(dial('Direction').props['data-visual']).toBe('playback');
    act(() => TweakStore.setDisabled(id, 'direction', true));
    act(() => dial('Direction').props.onKeyDown(keyEvent('Home')));
    expect(TweakStore.getValues(id).direction).toBe('r');
  });

  it('draws and edits the substituted chip’s own metadata for screen holds and hardware latches', () => {
    const config: TweakConfig = { opacity };
    for (let index = 1; index < 8; index++) config[`dial${index}`] = [0.5, 0, 1];
    config.blur = { type: 'slider', min: 0, max: 12, default: 3, step: 0.1, moveVisual: { kind: 'blur' } };
    mount(config);
    const chip = renderer!.root.findByProps({ 'data-kind': 'value' });
    act(() => chip.props.onPointerDown(pointer(60)));
    expect(dial('Blur').props['data-visual']).toBe('blur');
    act(() => dial('Blur').props.onKeyDown(keyEvent('End')));
    expect(TweakStore.getValues(id).blur).toBe(12);
    expect(TweakStore.getValues(id).opacity).toBe(0.5);
    act(() => chip.props.onPointerCancel());
    expect(dial('Opacity').props['data-visual']).toBe('opacity');
    act(() => window.dispatchEvent(new CustomEvent(MOVE_OVERRIDE_EVENT, { detail: { pageId: id, latched: { blur: true } } })));
    expect(dial('Blur').props['data-visual']).toBe('blur');
  });
});
