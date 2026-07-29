export { useDialKit } from './useDialKit';
export type { UseDialOptions } from './useDialKit';
export { vDialKit } from './directives/dialkit';
export type { DialKitDirectiveOptions, DialKitDirectiveValue } from './directives/dialkit';

// Timeline (prototype)
export { useDialTimeline } from './useDialTimeline';
export type { UseDialTimelineOptions } from './useDialTimeline';
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
export { DialTimeline } from './components/Timeline/DialTimeline';
export { TimelineToggleButton } from './components/Timeline/TimelineToggleButton';
export { ControlRenderer } from './components/ControlRenderer';
export { TimelineStore } from '../store/TimelineStore';
export type {
  TimelineMeta,
  TimelineClipMeta,
  TimelineClipTrackMeta,
  TimelineTransport,
} from '../store/TimelineStore';

export { DialRoot } from './components/DialRoot';
export type { DialPosition, DialMode, DialTheme } from './components/DialRoot';

export { ShortcutListener, useShortcutContext, ShortcutKey } from './components/ShortcutListener';
export type { ShortcutState } from './components/ShortcutListener';
export { ShortcutsMenu } from './components/ShortcutsMenu';

export { Slider } from './components/Slider';
export { RangeSlider } from './components/RangeSlider';
export { Toggle } from './components/Toggle';
export { Folder } from './components/Folder';
export { ControlShell } from './components/ControlShell';
export { Module } from './components/Module';
export { SegmentedControl } from './components/SegmentedControl';
export { ButtonGroup } from './components/ButtonGroup';
export { SpringControl } from './components/SpringControl';
export { SpringVisualization } from './components/SpringVisualization';
export { TransitionControl } from './components/TransitionControl';
export { EasingVisualization } from './components/EasingVisualization';
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
export {
  gradientToCss,
  normalizeGradient,
  colorAtPosition,
  addStop,
  removeStop,
  moveStop,
  setStopColor,
  setGradientType,
  setGradientAngle,
  DEFAULT_GRADIENT,
  MIN_STOPS,
} from '../gradient-core';
export type { GradientValue, GradientStop, GradientType } from '../gradient-core';
export { XYPad } from './components/XYPad';
export { XYControl } from './components/XYControl';
export { PresetManager } from './components/PresetManager';

export { DialStore } from '../store/DialStore';
export type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  GradientConfig,
  XYConfig,
  XYValue,
  XYAxis,
  TextConfig,
  Preset,
  DialValue,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
  AffordanceConfig,
  AffordanceContext,
  AffordanceStatus,
  ShortcutConfig,
} from '../store/DialStore';
