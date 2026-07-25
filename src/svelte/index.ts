// Core API
export { createDialKit } from './createDialKit.svelte';
export type { CreateDialOptions, DialKitValues } from './createDialKit.svelte';

// Root component
export { default as DialRoot } from './components/DialRoot.svelte';
export type { DialPosition, DialMode, DialTheme } from './components/DialRoot.svelte';

// Timeline (prototype)
export { createDialTimeline } from './createDialTimeline.svelte';
export type { CreateDialTimelineOptions } from './createDialTimeline.svelte';
export { default as DialTimeline } from './components/Timeline/DialTimeline.svelte';
export { formatClock, TimelineStore } from 'dialkit/timeline';
export type {
  TimelineClipConfig,
  TimelineClipCss,
  TimelineClipLoop,
  TimelineConfig,
  TimelineClipValues,
  TimelineGroupConfig,
  TimelineGroupValues,
  TimelinePropConfig,
  TimelinePropStepConfig,
  TimelineStepConfig,
  TimelineStepValues,
  DialTimelineValues,
  TimelineMeta,
  TimelineClipMeta,
  TimelineClipTrackMeta,
  TimelineTransport,
} from 'dialkit/timeline';

// Shortcut components
export { default as ShortcutListener } from './components/ShortcutListener.svelte';
export { SHORTCUT_CTX } from './components/ShortcutListener.svelte';
export type { ShortcutContextValue } from './components/ShortcutListener.svelte';
export { default as ShortcutsMenu } from './components/ShortcutsMenu.svelte';

// Component exports
export { default as Slider } from './components/Slider.svelte';
export { default as RangeSlider } from './components/RangeSlider.svelte';
export { default as Toggle } from './components/Toggle.svelte';
export { default as Folder } from './components/Folder.svelte';
export { default as Module } from './components/Module.svelte';
export { default as SegmentedControl } from './components/SegmentedControl.svelte';
export { default as ButtonGroup } from './components/ButtonGroup.svelte';
export { default as SpringControl } from './components/SpringControl.svelte';
export { default as SpringVisualization } from './components/SpringVisualization.svelte';
export { default as TransitionControl } from './components/TransitionControl.svelte';
export { default as EasingVisualization } from './components/EasingVisualization.svelte';
export { default as WaveformVisualization } from './components/WaveformVisualization.svelte';
export type { WaveformMode, WaveformLoop } from '../waveform-engine';
export { default as AnalyserVisualization } from './components/AnalyserVisualization.svelte';
export type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from '../analyser-engine';
export { default as CurveComposer } from './components/CurveComposer.svelte';
export type { CurveType, CurveSegment, CurveDriver, CurveComposition, DriverDirection } from '../curve-composer-core';
export { default as TextControl } from './components/TextControl.svelte';
export { default as SelectControl } from './components/SelectControl.svelte';
export { default as ColorControl } from './components/ColorControl.svelte';
export { default as ColorPickerPanel } from './components/ColorPickerPanel.svelte';
export { default as GradientControl } from './components/GradientControl.svelte';
export { default as GradientPanel } from './components/GradientPanel.svelte';
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
export { default as XYPad } from './components/XYPad.svelte';
export { default as XYControl } from './components/XYControl.svelte';
export type { XYValue, AxisSpec, Point } from '../xy-pad-core';
export { default as FileControl } from './components/FileControl.svelte';
export { default as SwatchControl } from './components/SwatchControl.svelte';
export { default as ChipsControl } from './components/ChipsControl.svelte';
export { default as ListControl } from './components/ListControl.svelte';
export { default as PresetManager } from './components/PresetManager.svelte';

// Store exports (via dialkit/store subpath — svelte-package doesn't bundle, so relative paths to src/store would break in dist)
export { DialStore, parseListItemSchema, defaultListItemParams, normalizeListItems } from 'dialkit/store';
export type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  XYConfig,
  XYAxis,
  RangeConfig,
  RangeValue,
  TextConfig,
  FileConfig,
  SwatchConfig,
  SwatchOption,
  ChipsConfig,
  ChipOption,
  ListConfig,
  ListItemValue,
  ListItemField,
  ListItemType,
  ListField,
  ListFieldKind,
  ShortcutConfig,
  Preset,
  DialValue,
  DialEvent,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from 'dialkit/store';
