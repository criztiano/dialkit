// Main hook
export { useDialKit } from './hooks/useDialKit';
export type { UseDialOptions } from './hooks/useDialKit';

// Root component (user mounts once)
export { DialRoot } from './components/DialRoot';
export type { DialPosition, DialMode, DialTheme } from './components/DialRoot';

// Timeline (prototype)
export { useDialTimeline } from './hooks/useDialTimeline';
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
  UseDialTimelineOptions,
} from './hooks/useDialTimeline';
export { DialTimeline } from './components/Timeline/DialTimeline';
export type { DialTimelineProps } from './components/Timeline/DialTimeline';
export { formatClock } from './timeline-core';
export { TimelineStore } from './store/TimelineStore';
export type {
  TimelineMeta,
  TimelineClipMeta,
  TimelineClipTrackMeta,
  TimelineTransport,
} from './store/TimelineStore';

// Individual components (for advanced usage)
export { ControlRenderer } from './components/ControlRenderer';
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
export {
  CURVE_CYCLE,
  defaultComposition,
  splitSegment,
  removeSegment,
  flipSegment,
  flipDriver,
  flipSegmentX,
  flipSegmentY,
  flipDriverX,
  flipDriverY,
  cycleSegmentType,
  setSegmentCurvature,
  setSegmentSteepness,
  setSegmentOvershoot,
  setSegmentAnticipate,
  redistributeWeight,
  addDriver,
  removeDriver,
  cycleDriverType,
  setDriverCurvature,
  setDriverSteepness,
  setDriverOvershoot,
  setDriverAnticipate,
  buildSamplers,
  readComposition,
  triggerLevels,
  triggersCrossed,
  DEFAULT_TRIGGER_STEPS,
} from './curve-composer-core';
export type { Sampler, CompositionSamplers, CompositionRead } from './curve-composer-core';
export {
  clamp,
  valueToPercent,
  percentToValue,
  orderRange,
  clampRange,
  setLow,
  setHigh,
  shiftSpan,
  nearestHandle,
  pickDragTarget,
  isOutsideSpan,
  handleLeftStyles,
} from './range-slider-core';
export { TextControl } from './components/TextControl';
export { SelectControl } from './components/SelectControl';
export { ColorControl } from './components/ColorControl';
export { ColorPickerPanel } from './components/ColorPickerPanel';
export {
  COLOR_FORMATS,
  parseHex,
  formatHex,
  normalizeHex,
  displayHex,
  opacityPercent,
  rgbToHsv,
  hsvToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  clampOklchToSrgb,
} from './color-core';
export type { RGBA, HSVA, HSLA, OKLCH, ColorFormat } from './color-core';
export { GradientControl } from './components/GradientControl';
export { GradientPanel } from './components/GradientPanel';
export {
  gradientToCss,
  gradientToTransform,
  gradientFillBox,
  normalizeGradient,
  colorAtPosition,
  addStop,
  removeStop,
  moveStop,
  setStopColor,
  setGradientType,
  setGradientAngle,
  setGradientCenter,
  setGradientScale,
  setGradientSquash,
  setGradientRotation,
  DEFAULT_GRADIENT,
  MIN_STOPS,
} from './gradient-core';
export type { GradientValue, GradientStop, GradientType, GradientTransform } from './gradient-core';
export { XYPad } from './components/XYPad';
export type { XYPadProps } from './components/XYPad';
export { XYControl } from './components/XYControl';
export {
  XY_DETENT_PX,
  XY_DEFAULT_STEP,
  resolveAxis,
  // `clamp` is re-exported once from './range-slider-core' above; xy-pad-core's
  // identical `clamp` is intentionally not re-exported here to avoid a duplicate.
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
} from './xy-pad-core';
export type { XYValue, AxisSpec, Point } from './xy-pad-core';
export { GalleryControl } from './components/GalleryControl';
export { FileControl } from './components/FileControl';
export { SwatchControl } from './components/SwatchControl';
export { ChipsControl } from './components/ChipsControl';
export { MultiSelectControl } from './components/MultiSelectControl';
export { ListControl } from './components/ListControl';
export { PresetManager } from './components/PresetManager';
export { ShortcutsMenu } from './components/ShortcutsMenu';

// Store (for advanced usage)
export { DialStore, parseListItemSchema, groupListFields, defaultListItemParams, normalizeListItems, hintDomId } from './store/DialStore';
export type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  GradientConfig,
  XYConfig,
  XYAxis,
  TextConfig,
  GalleryConfig,
  GalleryItem,
  FileConfig,
  SwatchConfig,
  SwatchOption,
  ChipsConfig,
  ChipOption,
  MultiSelectConfig,
  MultiSelectOption,
  SliderConfig,
  RangeConfig,
  RangeValue,
  ListConfig,
  ListItemValue,
  AffordanceConfig,
  AffordanceContext,
  AffordanceStatus,
  ListItemField,
  ListItemType,
  ListField,
  ListFieldKind,
  ListFieldGroup,
  ShortcutConfig,
  ShortcutMode,
  ShortcutInteraction,
  Preset,
  DialValue,
  DialEvent,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from './store/DialStore';
