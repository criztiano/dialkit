import type { DialPadConfig, DialPadValue } from './dial-pad';

/** One axis of an `xy` config. Missing fields default to 0 to 1 in steps of 0.01. */
export type DialXYAxis = {
  min?: number;
  max?: number;
  step?: number;
  /** Where the axis rests. Defaults to the middle of a bipolar axis, else `min`. */
  origin?: number;
  /** The axis has a meaningful middle: it rests there. */
  bipolar?: boolean;
  /** The axis field's name. Defaults to X or Y. */
  label?: string;
};

/**
 * The object form of a pad: `{ type: 'xy', x: { min, max, step }, y: ... }`.
 * It shows as a {@link DialPadConfig} pad and has the same `{ x, y }` value.
 */
export type DialXYConfig = {
  type: 'xy';
  /** Starting point. A missing or invalid axis starts at its origin. */
  default?: Partial<DialPadValue>;
  x?: DialXYAxis;
  y?: DialXYAxis;
  /** Hides the label box; the fields fill the row. */
  hideLabel?: boolean;
  /** Drag an axis label left or right to change its value. */
  dragLabels?: boolean;
};

export const XY_DEFAULT_STEP = 0.01;

function padAxisOf(axis: DialXYAxis = {}, start: unknown): [number, number, number, number] {
  const min = axis.min ?? 0;
  const max = axis.max ?? 1;
  const origin = axis.origin ?? (axis.bipolar ? (min + max) / 2 : min);
  return [typeof start === 'number' && Number.isFinite(start) ? start : origin, min, max, axis.step ?? XY_DEFAULT_STEP];
}

/** The pad an `xy` config shows as. */
export function xyPadConfig(config: DialXYConfig): DialPadConfig {
  const labels = { x: config.x?.label, y: config.y?.label };
  return {
    type: 'pad',
    x: padAxisOf(config.x, config.default?.x),
    y: padAxisOf(config.y, config.default?.y),
    ...(labels.x || labels.y ? { labels } : {}),
    ...(config.hideLabel ? { hideLabel: true } : {}),
    ...(config.dragLabels ? { dragLabels: true } : {}),
  };
}
