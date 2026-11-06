// The number control: a value with no track. A drag anywhere on the row
// scrubs it and a click types it. Bounds are optional, so it suits open
// quantities: a trim in dB, a sample offset, a seed.
import { roundValue } from './numeric';

export type NumberConfig = {
  type: 'number';
  default: number;
  min?: number;
  max?: number;
  /** Falls back to a step that fits `default`, as a bare number's slider does. */
  step?: number;
  /** Shown after the value, as a slider's unit is. */
  unit?: string;
  /** Replaces the shown value; `unit` is then not added. */
  formatValue?: (value: number) => string;
  /** `vertical` puts the label above a centred value, and a drag scrubs up and down. */
  orientation?: 'horizontal' | 'vertical';
};

/** Clamps to whichever bounds are set. */
export function clampNumber(value: number, min?: number, max?: number): number {
  let out = value;
  if (min != null) out = Math.max(min, out);
  if (max != null) out = Math.min(max, out);
  return out;
}

/** One step per pixel of travel: Shift takes ten, Alt a tenth. */
export function scrubNumber(start: number, travel: number, step: number, min?: number, max?: number, modifier?: 'shift' | 'alt'): number {
  const perPixel = step * (modifier === 'shift' ? 10 : modifier === 'alt' ? 0.1 : 1);
  return roundValue(clampNumber(start + travel * perPixel, min, max), step, min, max);
}

/** Arrow keys: up and right add a step, down and left take one; Shift takes ten. */
export function numberKeyValue(key: string, value: number, step: number, min?: number, max?: number, shift = false): number | undefined {
  if (key === 'Home' && min != null) return min;
  if (key === 'End' && max != null) return max;
  const direction = ['ArrowRight', 'ArrowUp', 'PageUp'].includes(key) ? 1
    : ['ArrowLeft', 'ArrowDown', 'PageDown'].includes(key) ? -1 : 0;
  if (!direction) return undefined;
  const amount = key.startsWith('Page') || shift ? 10 : 1;
  return roundValue(clampNumber(value + direction * amount * step, min, max), step, min, max);
}

/** A stored value is kept when it is a finite number, clamped and stepped; anything else takes the default. */
export function normalizeNumberValue(value: unknown, fallback: number, step?: number, min?: number, max?: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const clamped = clampNumber(value, min, max);
  return typeof step === 'number' && step > 0 ? roundValue(clamped, step, min, max) : clamped;
}
