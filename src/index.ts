// Main hook
export { useTweakers } from './hooks/useTweakers';
export type { UseTweakersOptions } from './hooks/useTweakers';

// Root component (user mounts once)
export { TweakRoot } from './components/TweakRoot';
export type { TweakPosition, TweakMode, TweakTheme } from './components/TweakRoot';

// The filter control — the kit's first 2-slot control (cutoff + resonance)
export { resolveFilterAxis, normalizeFilterValue, defaultFilterResponse, filterShapeResponse, filterResponsePath, filterHand01, filterHandValue, FILTER_DB_FLOOR, FILTER_DB_CEIL } from 'tweakers/filter-core';
export type { FilterAxis, FilterAxisConfig, FilterValue, FilterResponse, FilterShapeType } from 'tweakers/filter-core';
export { FilterControl } from './components/FilterControl';

// Modulation layer — slots, assignments, the engine, and the type registry
export { ModulationStore, MOD_TOUCH_GRACE_MS } from 'tweakers/modulation-store';
export type { ModulationSourceConfig, ModStepAction } from 'tweakers/modulation-store';
export {
  MOD_SLOTS,
  MOD_COLORS,
  MOD_SETTINGS_PANEL,
  modColor,
  modKey,
  applyModulation,
  registerModType,
  getModType,
  listModTypes,
  LFO_DEF,
  SH_DEF,
  ADSR_DEF,
  CURVE_DEF,
  CURVE_LABELS,
  CURVE_MAX_CLIPS,
  CURVE_MIN_DURATION,
  CURVE_MAX_DURATION,
  curveComposition,
  curveDuration,
  modPageLayout,
  visibleModControls,
  MOD_PAGE_DIALS,
  modRingArc,
  MOD_RING_RADIUS,
  MOD_RING_CIRCUMFERENCE,
  LFO_SYNC_DIVISIONS,
  lfoSyncedHz,
  envelopePoints,
  envelopeJoints,
  envCurveParam,
  ENV_BEND_STAGES,
  modPageWidth,
  ADSR_STAGE_MAX,
} from 'tweakers/modulation-core';
export type {
  ModulationType,
  EnvStage,
  ModulationParams,
  ModulationParamValue,
  ModulationSlot,
  ModulationAssignment,
  ModTypeDef,
  ModControlMeta,
  ModPageLayout,
  ModPageSlot,
} from 'tweakers/modulation-core';

// Timeline (prototype)
export { useTweakTimeline } from './hooks/useTweakTimeline';
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
  TweakTimelineValues,
  UseTweakTimelineOptions,
} from './hooks/useTweakTimeline';
export { TweakTimeline } from './components/Timeline/TweakTimeline';
export type { TweakTimelineProps } from './components/Timeline/TweakTimeline';
export { formatClock } from 'tweakers/timeline';
export { TimelineStore } from 'tweakers/timeline';
export type {
  TimelineMeta,
  TimelineClipMeta,
  TimelineClipTrackMeta,
  TimelineTransport,
} from 'tweakers/timeline';

// Individual components (for advanced usage)
export { ControlRenderer } from './components/ControlRenderer';
export { Slider } from './components/Slider';
export { AngleDial } from './components/AngleDial';
export { TransferCurve } from './components/TransferCurve';
export { sampleTransfer, transferLut, normalizeTransfer, insertPoint, removePoint, movePoint, nearestPoint, isIdentityTransfer, DEFAULT_TRANSFER, TRANSFER_MIN_GAP, TRANSFER_MAX_POINTS } from 'tweakers/transfer-core';
export type { TransferPoint, TransferValue } from 'tweakers/transfer-core';
export { snapAngle, normalizeAngle, valueToBearing, bearingToValue, angleFromPointer, nudgeAngle, arcPath, ANGLE_DEAD_ZONE_PX } from 'tweakers/angle-core';
export { NumberControl } from './components/NumberControl';
export { RangeSlider } from './components/RangeSlider';
export { Checkbox } from './components/Checkbox';
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
export { WaveformVisualization } from 'tweakers';
export type { WaveformMode, WaveformLoop } from 'tweakers';
export { AnalyserVisualization } from './components/AnalyserVisualization';
export type {
  AnalyserSource,
  AnalyserVariant,
  AnalyserMode,
  AnalyserScale,
  AnalyserSpring,
  AnalyserTransferDraw,
} from './components/AnalyserVisualization';
export { AnalyserRow } from './components/AnalyserRow';
export { CurveComposer } from 'tweakers';
export type { CurveType, CurveSegment, CurveDriver, CurveComposition, DriverDirection } from 'tweakers';
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
  springify,
  buildSamplers,
  readComposition,
  triggerLevels,
  triggersCrossed,
  DEFAULT_TRIGGER_STEPS,
} from 'tweakers/curve-composer-core';
export type { Sampler, SpringifyOptions, CompositionSamplers, CompositionRead } from 'tweakers/curve-composer-core';
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
} from 'tweakers/range-slider-core';
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
} from 'tweakers/color-core';
export type { RGBA, HSVA, HSLA, OKLCH, ColorFormat } from 'tweakers/color-core';
export { GradientControl } from './components/GradientControl';
export { GradientPanel } from './components/GradientPanel';
export {
  gradientToCss,
  rampCss,
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
} from 'tweakers/gradient-core';
export type { GradientValue, GradientStop, GradientType, GradientTransform } from 'tweakers/gradient-core';
export { XYPad } from './components/XYPad';
export type { XYPadProps } from './components/XYPad';
export { XYControl } from './components/XYControl';
export {
  XY_DETENT_PX,
  XY_DEFAULT_STEP,
  resolveAxis,
  // `clamp` is re-exported once from 'tweakers/range-slider-core' above; xy-pad-core's
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
} from 'tweakers/xy-pad-core';
export type { XYValue, AxisSpec, Point } from 'tweakers/xy-pad-core';
export { GalleryControl } from './components/GalleryControl';
export { FileControl } from './components/FileControl';
export { SwatchControl } from './components/SwatchControl';
export { ChipsControl } from './components/ChipsControl';
export { MultiSelectControl } from './components/MultiSelectControl';
export { ListControl } from './components/ListControl';
export { CurvePreview } from './components/CurvePreview';
export {
  CURVE_SAMPLE_COUNT,
  CURVE_MIN_HEIGHT,
  CURVE_MAX_HEIGHT,
  CURVE_DEFAULT_HEIGHT,
  CURVE_FIT_PADDING,
  clampCurveHeight,
  normalizeCurveMarkers,
  plotCurve,
  curveY,
  curvePathData,
} from 'tweakers/curve-preview-core';
export type { CurvePoint, CurvePlot } from 'tweakers/curve-preview-core';
export { PresetManager } from './components/PresetManager';
export { ShortcutsMenu } from './components/ShortcutsMenu';
export { AudioLevelMeter } from './components/AudioLevelMeter';
export type {
  AudioLevelMeterMode,
  AudioLevelMeterColors,
  AudioLevelMeterProps,
  MonoAudioLevelMeterProps,
  StereoAudioLevelMeterProps,
  SpectrumAudioLevelMeterProps,
} from './components/AudioLevelMeter';

// Store (for advanced usage)
export { TweakStore, TAB_PATH, parseListItemSchema, groupListFields, defaultListItemParams, normalizeListItems, hintDomId } from 'tweakers/store';
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
  NumberConfig,
  RangeConfig,
  FilterConfig,
  RangeValue,
  ListConfig,
  ListItemValue,
  CurveConfig,
  AnalyserConfig,
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
  PresetProvider,
  PresetProviderPreset,
  PresetItem,
  TweakValue,
  TweakEvent,
  TweakConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from 'tweakers/store';
