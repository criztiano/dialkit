import { afterEach, describe, expect, it } from 'vitest';
import { TweakStore, type ControlMeta, type MoveVisual } from '../src/store/TweakStore';
import { buildMovePages, denormalizeDial, normalizeDial } from '../src/move-layout';
import { moveKeyboardValue, moveNumericDrawing, movePlaybackMode, moveVisualReading } from '../src/move-visual-core';

const numeric = (moveVisual: MoveVisual, min = 0, max = 1): ControlMeta => ({
  type: 'slider', path: 'value', label: 'Unrelated label', min, max, step: 0.01, moveVisual,
});
afterEach(() => TweakStore.unregisterPanel('visual-test'));

describe('semantic Move metadata', () => {
  it('survives parsing and panel updates without altering values or hardware normalization', () => {
    const config = {
      value: { type: 'slider' as const, default: 0.4, min: 0, max: 1, moveVisual: { kind: 'opacity' as const } },
      mode: { type: 'select' as const, options: ['fwd', 'rev'], moveVisual: { kind: 'playback' as const, modes: { fwd: 'forward' as const, rev: 'reverse' as const } } },
    };
    TweakStore.registerPanel('visual-test', 'Visual', config);
    const panel = TweakStore.getPanel('visual-test')!;
    const [page] = buildMovePages([panel]);
    expect(page.dials[0].moveVisual).toEqual({ kind: 'opacity' });
    expect(movePlaybackMode(page.dials[1], 'rev')).toBe('reverse');
    expect(denormalizeDial(page.dials[0], normalizeDial(page.dials[0], 0.4))).toBe(0.4);
    TweakStore.updateValue('visual-test', 'value', 0.8);
    TweakStore.updatePanel('visual-test', 'Visual', { ...config, value: { ...config.value, moveVisual: { kind: 'blur' } } });
    expect(TweakStore.getValues('visual-test').value).toBe(0.8);
    expect(TweakStore.getPanel('visual-test')!.controls[0].moveVisual).toEqual({ kind: 'blur' });
  });

  it('never derives a drawing from a label', () => {
    expect(moveNumericDrawing({ type: 'slider', path: 'opacity', label: 'Opacity', min: 0, max: 1 }, 0.5)).toBeNull();
  });
});

describe('value geometry and references', () => {
  it('opacity uses actual alpha, including partial and percentage domains', () => {
    expect(moveNumericDrawing(numeric({ kind: 'opacity' }, 0.2, 0.8), 0.5)).toEqual({ kind: 'opacity', alpha: 0.5 });
    expect(moveNumericDrawing(numeric({ kind: 'opacity', opaqueValue: 100 }, 0, 100), 25)).toEqual({ kind: 'opacity', alpha: 0.25 });
    expect(moveNumericDrawing(numeric({ kind: 'opacity' }, 0, 100), 25)).toBeNull();
  });

  it('preserves pixel blur independently of configured maximum', () => {
    expect(moveNumericDrawing(numeric({ kind: 'blur' }, 0, 20), 3)).toEqual({ kind: 'blur', radius: 3 });
    expect(moveNumericDrawing(numeric({ kind: 'blur' }, 0, 100), 3)).toEqual({ kind: 'blur', radius: 3 });
  });

  it('keeps pan C at the specified centre in asymmetric and cropped domains', () => {
    const pan = numeric({ kind: 'pan', left: -100, center: 0, right: 50 }, -100, 50);
    expect(moveNumericDrawing(pan, -100)).toEqual({ kind: 'pan', position: 0 });
    expect(moveNumericDrawing(pan, 0)).toEqual({ kind: 'pan', position: 0.5 });
    expect(moveNumericDrawing(pan, 50)).toEqual({ kind: 'pan', position: 1 });
    expect(moveNumericDrawing({ ...pan, min: -50 }, -50)).toEqual({ kind: 'pan', position: 0.25 });
  });

  it('distinguishes mono, unity and wider stereo; omits out-of-range unity references', () => {
    const width = numeric({ kind: 'stereo-width' }, 0, 2);
    expect(moveNumericDrawing(width, 0)).toEqual({ kind: 'stereo-width', separation: 0, unity: 0.5 });
    expect(moveNumericDrawing(width, 1)).toEqual({ kind: 'stereo-width', separation: 0.5, unity: 0.5 });
    expect(moveNumericDrawing(width, 2)).toEqual({ kind: 'stereo-width', separation: 1, unity: 0.5 });
    expect(moveNumericDrawing({ ...width, max: 0.5 }, 0.25)).toEqual({ kind: 'stereo-width', separation: 0.5, unity: null });
  });

  it('places pitch zero correctly on asymmetric ranges and omits an unavailable zero', () => {
    expect(moveNumericDrawing(numeric({ kind: 'pitch' }, -12, 24), 0)).toEqual({ kind: 'pitch', position: 1 / 3, zero: 1 / 3 });
    expect(moveNumericDrawing(numeric({ kind: 'pitch' }, 12, 24), 18)).toEqual({ kind: 'pitch', position: 0.5, zero: null });
  });

  it('falls back for invalid runtime config or non-finite values', () => {
    for (const value of [NaN, Infinity, '0.5']) expect(moveNumericDrawing(numeric({ kind: 'opacity' }), value)).toBeNull();
    for (const visual of [{ kind: 'unknown' }, { kind: 'opacity', opaqueValue: 0 }, { kind: 'stereo-width', unity: 0 }, { kind: 'pan', center: -2 }]) {
      expect(moveNumericDrawing(numeric(visual as MoveVisual), 0.5)).toBeNull();
    }
    expect(moveNumericDrawing(numeric({ kind: 'blur' }, 0, 0), 0)).toBeNull();
  });

  it('keeps host formatting and units, otherwise gives semantic units', () => {
    expect(moveVisualReading(numeric({ kind: 'opacity' }), 0.25)).toBe('25%');
    expect(moveVisualReading(numeric({ kind: 'stereo-width' }, 0, 2), 0)).toBe('Mono');
    expect(moveVisualReading(numeric({ kind: 'pitch' }, -24, 24), 7)).toBe('+7 st');
    expect(moveVisualReading({ ...numeric({ kind: 'opacity' }), formatValue: () => 'Quarter' }, 0.25)).toBe('Quarter');
    expect(moveVisualReading({ ...numeric({ kind: 'opacity' }), unit: ' alpha' }, 0.25)).toBe('0.25 alpha');
  });
});

describe('playback mapping and editing', () => {
  it('only draws known modes for current, configured option values', () => {
    const meta: ControlMeta = { type: 'select', path: 'mode', label: 'Mode', options: ['f', 'r', 'x'], moveVisual: { kind: 'playback', modes: { f: 'forward', r: 'reverse' } } };
    expect(movePlaybackMode(meta, 'f')).toBe('forward');
    expect(movePlaybackMode(meta, 'r')).toBe('reverse');
    expect(movePlaybackMode(meta, 'x')).toBeNull();
    expect(movePlaybackMode(meta, 'forward')).toBeNull();
    expect(movePlaybackMode({ ...meta, moveVisual: { kind: 'playback', modes: 42 } as never }, 'f')).toBeNull();
  });

  it('uses bounds, stepped precision and continuous fine adjustment', () => {
    const meta = { ...numeric({ kind: 'blur' }, 0, 100), step: 0.1 };
    expect(moveKeyboardValue(meta, 50, 'ArrowRight')).toBe(51);
    expect(moveKeyboardValue(meta, 50, 'ArrowRight', true)).toBe(50.1);
    expect(moveKeyboardValue(meta, 99, 'PageUp')).toBe(100);
    expect(moveKeyboardValue(meta, 50, 'Home')).toBe(0);
    expect(moveKeyboardValue(meta, 50, 'End')).toBe(100);
    expect(moveKeyboardValue({ ...meta, step: 0 }, 50, 'ArrowRight', true)).toBe(50.1);
    expect(moveKeyboardValue(meta, 50, 'Tab')).toBeNull();
  });

  it('steps and clamps options without changing app values', () => {
    const meta: ControlMeta = { type: 'select', path: 'mode', label: 'Mode', options: [{ value: 'f', label: 'Forward' }, { value: 'r', label: 'Reverse' }] };
    expect(moveKeyboardValue(meta, 'f', 'ArrowRight')).toBe('r');
    expect(moveKeyboardValue(meta, 'r', 'ArrowRight')).toBe('r');
    expect(moveKeyboardValue(meta, 'r', 'Home')).toBe('f');
  });
});
