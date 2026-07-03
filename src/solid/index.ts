// Core API
export { createDialKit } from './createDialKit';
export type { CreateDialOptions } from './createDialKit';

// Root component
export { DialRoot } from './components/DialRoot';
export type { DialPosition, DialMode, DialTheme } from './components/DialRoot';

// Component exports
export { Slider } from './components/Slider';
export { RangeSlider } from './components/RangeSlider';
export { Toggle } from './components/Toggle';
export { Folder } from './components/Folder';
export { Module } from './components/Module';
export { SegmentedControl } from './components/SegmentedControl';
export { ButtonGroup } from './components/ButtonGroup';
export { SpringControl } from './components/SpringControl';
export { SpringVisualization } from './components/SpringVisualization';
export { WaveformVisualization } from './components/WaveformVisualization';
export type { WaveformMode, WaveformLoop } from './components/WaveformVisualization';
export { CurveComposer } from './components/CurveComposer';
export type { CurveType, CurveSegment, CurveDriver, CurveComposition, DriverDirection } from './components/CurveComposer';
export { TextControl } from './components/TextControl';
export { SelectControl } from './components/SelectControl';
export { ColorControl } from './components/ColorControl';
export { ColorPickerPanel } from './components/ColorPickerPanel';
export { XYPad } from './components/XYPad';
export type { XYPadProps } from './components/XYPad';
export { XYControl } from './components/XYControl';
export {
  XY_DETENT_PX,
  XY_DEFAULT_STEP,
  resolveAxis,
  clamp,
  snapToStep,
  valueToNorm,
  normToValue,
  invertY,
  valueFromPoint,
  pointFromValue,
  applyDetentAxis,
  nudge,
  centerValue,
  normalizeValue,
} from '../xy-pad-core';
export type { XYValue, AxisSpec, Point } from '../xy-pad-core';
export { PresetManager } from './components/PresetManager';

// Store exports
export { DialStore } from '../store/DialStore';
export type {
  SpringConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  XYConfig,
  XYAxis,
  TextConfig,
  ShortcutConfig,
  Preset,
  DialValue,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from '../store/DialStore';
