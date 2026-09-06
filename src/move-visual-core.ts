import type { ControlMeta } from './store/TweakStore';

/** Opt-in meanings for numeric Move faces. Values keep the host's units. */
export type MoveSliderVisual =
  | { kind: 'opacity'; opaqueValue?: number }
  | { kind: 'blur' }
  | { kind: 'pan'; left?: number; center?: number; right?: number }
  | { kind: 'stereo-width'; mono?: number; unity?: number }
  | { kind: 'pitch'; unit?: 'semitones' | 'cents' };

export type MovePlaybackMode = 'forward' | 'reverse' | 'ping-pong' | 'scissors';
export type MoveSelectVisual = {
  kind: 'playback';
  /** Map host option values to drawings. Omit when values are mode names. */
  modes?: Record<string, MovePlaybackMode>;
};

export type MoveVisual = MoveSliderVisual | MoveSelectVisual;

export type MoveNumericDrawing =
  | { kind: 'opacity'; alpha: number }
  | { kind: 'blur'; radius: number }
  | { kind: 'pan'; position: number }
  | { kind: 'stereo-width'; separation: number; unity: number | null }
  | { kind: 'pitch'; position: number; zero: number | null };

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const between = (value: number, min: number, max: number) => value >= min && value <= max;

/** Invalid or incompatible metadata falls back to the ordinary face. No label inference. */
export function moveNumericDrawing(meta: ControlMeta, value: unknown): MoveNumericDrawing | null {
  const visual = meta.moveVisual;
  const { min, max } = meta;
  if (meta.type !== 'slider' || !visual || typeof value !== 'number' || !Number.isFinite(value)
    || !Number.isFinite(min) || !Number.isFinite(max) || max! <= min!) return null;
  const lo = min!;
  const hi = max!;
  const v = Math.max(lo, Math.min(hi, value));
  switch (visual.kind) {
    case 'opacity': {
      const opaque = visual.opaqueValue ?? 1;
      if (!Number.isFinite(opaque) || opaque <= 0 || lo < 0 || hi > opaque) return null;
      return { kind: 'opacity', alpha: v / opaque };
    }
    case 'blur':
      return lo >= 0 ? { kind: 'blur', radius: v } : null;
    case 'pan': {
      const left = visual.left ?? -1;
      const center = visual.center ?? 0;
      const right = visual.right ?? 1;
      if (![left, center, right].every(Number.isFinite) || left >= center || center >= right
        || lo < left || hi > right) return null;
      // Centre stays at C even when the host's numeric sides are asymmetric.
      const position = v <= center
        ? (v - left) / (center - left) / 2
        : 0.5 + (v - center) / (right - center) / 2;
      return { kind: 'pan', position: clamp01(position) };
    }
    case 'stereo-width': {
      const mono = visual.mono ?? 0;
      const unity = visual.unity ?? 1;
      if (![mono, unity].every(Number.isFinite) || unity <= mono || lo < mono || hi <= mono) return null;
      return {
        kind: 'stereo-width', separation: (v - mono) / (hi - mono),
        unity: between(unity, lo, hi) ? (unity - mono) / (hi - mono) : null,
      };
    }
    case 'pitch':
      if (visual.unit !== undefined && visual.unit !== 'semitones' && visual.unit !== 'cents') return null;
      return { kind: 'pitch', position: (v - lo) / (hi - lo), zero: between(0, lo, hi) ? -lo / (hi - lo) : null };
    default:
      return null;
  }
}

export function movePlaybackMode(meta: ControlMeta, value: unknown): MovePlaybackMode | null {
  if (meta.type !== 'select' || meta.moveVisual?.kind !== 'playback' || typeof value !== 'string') return null;
  if (!meta.options?.some((option) => (typeof option === 'string' ? option : option.value) === value)) return null;
  const modes = meta.moveVisual.modes;
  if (modes !== undefined && (typeof modes !== 'object' || modes === null || Array.isArray(modes))) return null;
  const mode = modes ? (Object.prototype.hasOwnProperty.call(modes, value) ? modes[value] : undefined) : value;
  return mode === 'forward' || mode === 'reverse' || mode === 'ping-pong' || mode === 'scissors' ? mode : null;
}

/** Semantic formatting is a fallback; a host formatter or unit always wins. */
export function moveVisualReading(meta: ControlMeta, value: number): string {
  if (meta.formatValue) return meta.formatValue(value);
  const number = Number(value.toFixed(2)).toString();
  if (meta.unit) return `${number}${meta.unit}`;
  if (!moveNumericDrawing(meta, value)) return number;
  const visual = meta.moveVisual!;
  switch (visual.kind) {
    case 'opacity': return `${Number((value / (visual.opaqueValue ?? 1) * 100).toFixed(1))}%`;
    case 'blur': return `${number} px`;
    case 'pan': {
      const center = visual.center ?? 0;
      if (value === center) return 'C';
      const extent = value < center ? center - (visual.left ?? -1) : (visual.right ?? 1) - center;
      return `${value < center ? 'L' : 'R'} ${Number((Math.abs(value - center) / extent * 100).toFixed(1))}%`;
    }
    case 'stereo-width':
      return value === (visual.mono ?? 0) ? 'Mono' : `${Number(((value - (visual.mono ?? 0)) / ((visual.unity ?? 1) - (visual.mono ?? 0))).toFixed(2))}×`;
    case 'pitch': return `${value > 0 ? '+' : ''}${number} ${visual.unit === 'cents' ? 'ct' : 'st'}`;
    default: return number;
  }
}

/** Returns a new value only for editing keys. Shift uses the configured smallest step. */
export function moveKeyboardValue(meta: ControlMeta, value: unknown, key: string, fine = false): number | string | null {
  const direction = key === 'ArrowRight' || key === 'ArrowUp' || key === 'PageUp' ? 1
    : key === 'ArrowLeft' || key === 'ArrowDown' || key === 'PageDown' ? -1 : 0;
  if (!direction && key !== 'Home' && key !== 'End') return null;
  if (meta.type === 'select') {
    const options = meta.options ?? [];
    if (!options.length) return null;
    const optionValue = (option: typeof options[number]) => typeof option === 'string' ? option : option.value;
    const index = Math.max(0, options.findIndex((option) => optionValue(option) === value));
    const next = key === 'Home' ? 0 : key === 'End' ? options.length - 1
      : Math.max(0, Math.min(options.length - 1, index + direction));
    return optionValue(options[next]);
  }
  const { min, max } = meta;
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || max! <= min!) return null;
  if (key === 'Home') return min!;
  if (key === 'End') return max!;
  const range = max! - min!;
  if (meta.step === 0) {
    const delta = range / (fine ? 1000 : key.startsWith('Page') ? 10 : 100);
    return Math.max(min!, Math.min(max!, Number((value + direction * delta).toPrecision(12))));
  }
  const step = meta.step && Number.isFinite(meta.step) && meta.step > 0 ? meta.step : range / 100;
  const coarseSteps = Math.max(1, Math.round(range / 100 / step));
  const multiplier = fine ? 1 : key.startsWith('Page') ? coarseSteps * 10 : coarseSteps;
  const next = Math.round((value + direction * step * multiplier) / step) * step;
  return Math.max(min!, Math.min(max!, Number(next.toPrecision(12))));
}
