// Core API
export { createDialKit } from './createDialKit';
export type { CreateDialOptions } from './createDialKit';

// Timeline
export { createDialTimeline } from './createDialTimeline';
export type { CreateDialTimelineOptions } from './createDialTimeline';
export type {
  DialTimelineValues,
  TimelineClipConfig,
  TimelineClipCss,
  TimelineClipLoop,
  TimelineClipValues,
  TimelineConfig,
  TimelineGroupConfig,
  TimelineGroupValues,
  TimelinePropConfig,
  TimelinePropStepConfig,
  TimelineStepConfig,
  TimelineStepValues,
} from '../timeline';

// Root component
export { DialRoot } from './components/DialRoot';
export type { DialPosition, DialMode, DialTheme } from './components/DialRoot';
export { DialTimeline } from './components/Timeline/DialTimeline';
export type { DialTimelineProps } from './components/Timeline/DialTimeline';
export { TimelineToggleButton } from './components/Timeline/TimelineToggleButton';

// Component exports
export { Slider } from './components/Slider';
export { NumberControl } from './components/NumberControl';
export { RangeSlider } from './components/RangeSlider';
export { Toggle } from './components/Toggle';
export { Folder } from './components/Folder';
export { ControlShell } from './components/ControlShell';
export { Module } from './components/Module';
export { SegmentedControl } from './components/SegmentedControl';
export { ButtonGroup } from './components/ButtonGroup';
export { SpringControl } from './components/SpringControl';
export { SpringVisualization } from './components/SpringVisualization';
export { WaveformVisualization } from './components/WaveformVisualization';
export type { WaveformMode, WaveformLoop } from './components/WaveformVisualization';
export { AnalyserVisualization } from './components/AnalyserVisualization';
export type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from './components/AnalyserVisualization';
export { CurveComposer } from './components/CurveComposer';
export type { CurveType, CurveSegment, CurveDriver, CurveComposition, DriverDirection } from './components/CurveComposer';
export { TextControl } from './components/TextControl';
export { SelectControl } from './components/SelectControl';
export { ColorControl } from './components/ColorControl';
export { ColorPickerPanel } from './components/ColorPickerPanel';
export { GradientControl } from './components/GradientControl';
export { GradientPanel } from './components/GradientPanel';
export { gradientToCss, DEFAULT_GRADIENT } from '../gradient-core';
export type { GradientValue, GradientStop, GradientType } from '../gradient-core';
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
export { ControlRenderer } from './components/ControlRenderer';
export { TransitionControl } from './components/TransitionControl';
export { EasingVisualization } from './components/EasingVisualization';

// Store exports
export { DialStore } from '../store/DialStore';
export type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  XYConfig,
  XYAxis,
  TextConfig,
  AffordanceConfig,
  AffordanceContext,
  AffordanceStatus,
  ShortcutConfig,
  Preset,
  PresetProvider,
  PresetProviderPreset,
  PresetItem,
  DialValue,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from '../store/DialStore';
