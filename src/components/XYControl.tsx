import { XYPad } from './XYPad';
import type { ShortcutConfig, XYAxis, XYValue } from '../store/DialStore';

interface XYControlProps {
  label: string;
  value: XYValue;
  onChange: (value: XYValue) => void;
  x?: XYAxis;
  y?: XYAxis;
  grid?: boolean | number;
  density?: number;
  snap?: boolean;
  returnToCenter?: boolean;
  showValues?: boolean;
  shortcut?: ShortcutConfig;
  shortcutActive?: boolean;
}

/**
 * Config wrapper for the XY pad — the `{ type: 'xy' }` case. Reads the resolved
 * ControlMeta fields and forwards them to the standalone XYPad, mirroring how
 * ColorControl wraps ColorPickerPanel.
 */
export function XYControl({ label, value, onChange, x, y, grid, density, snap, returnToCenter, showValues, shortcut, shortcutActive }: XYControlProps) {
  return (
    <XYPad
      label={label}
      value={value}
      onChange={onChange}
      x={x}
      y={y}
      grid={grid}
      density={density}
      snap={snap}
      returnToCenter={returnToCenter}
      showValues={showValues}
      shortcut={shortcut}
      shortcutActive={shortcutActive}
    />
  );
}
