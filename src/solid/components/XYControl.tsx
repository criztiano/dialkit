import { XYPad } from './XYPad';
import type { ShortcutConfig, XYAxis, XYValue } from '../../store/TweakStore';

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
export function XYControl(props: XYControlProps) {
  return (
    <XYPad
      label={props.label}
      value={props.value}
      onChange={props.onChange}
      x={props.x}
      y={props.y}
      grid={props.grid}
      density={props.density}
      snap={props.snap}
      returnToCenter={props.returnToCenter}
      showValues={props.showValues}
      shortcut={props.shortcut}
      shortcutActive={props.shortcutActive}
    />
  );
}
