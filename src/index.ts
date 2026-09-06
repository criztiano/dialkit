// Main hook
export { useTweakers } from './hooks/useTweakers';
export type { UseTweakersOptions } from './hooks/useTweakers';

// Root component (user mounts once)
export { TweakRoot } from './components/TweakRoot';
export type { TweakPosition, TweakMode, TweakTheme } from './components/TweakRoot';

// Move surface mirror (docked bottom panel matching the bridge kit's mapping)
export { MovePanel } from './components/MovePanel';
export { MoveActionButton } from './components/MoveActionButton';
export type { MoveActionButtonProps } from './components/MoveActionButton';
export { buildMovePages, buildModMovePage, movePadRows, moveAppPadRow, visibleColumns, normalizeDial, normalizeXYDial, normalizeRangeDial, denormalizeRangeDial, normalizeEnumDial, denormalizeEnumDial, normalizeFilterDial, denormalizeFilterDial, filterShapePath, dialOrigin, dialSpan, isSpanContinuation, enumOptionIcon, MOVE_TRACKS, MOVE_DIALS, MOVE_PADS } from './move-layout';
export type { MovePage } from './move-layout';

// The big-slot library — the dictionary of what a Move dial slot can be
export { MOVE_SLOT_LIBRARY, moveSlotKind, MoveSlotDefaultBody, MoveSlotEnumBody, MoveSlotRangeBody, MoveSlotFilterBody, MoveSlotEnvBody, MoveSlotScopeBody, MoveSlotGlyph, MoveSlotReadout, MoveSlotShape } from './components/move-slots';
export type { MoveSlotKind } from './components/move-slots';

// The filter control — the kit's first 2-slot control (cutoff + resonance)
export { resolveFilterAxis, normalizeFilterValue, defaultFilterResponse, filterShapeResponse, filterResponsePath, filterHand01, filterHandValue, FILTER_DB_FLOOR, FILTER_DB_CEIL } from './filter-core';
export type { FilterAxis, FilterAxisConfig, FilterValue, FilterResponse, FilterShapeType } from './filter-core';
export { FilterControl } from './components/FilterControl';
export { MoveFunctions, MOVE_FUNCTION_BUTTONS, MOVE_FUNCTION_MANIFEST, MOVE_SPECIAL_BUTTONS } from './move-functions';
export type { MoveFunctionButton, MoveFunctionPress, MoveFunctionHandler, MoveFunctionOptions, MoveFunctionRunListener } from './move-functions';
export { MoveWaveform } from './components/MoveWaveform';
export type { MoveWaveformProps } from './components/MoveWaveform';
export {
  MoveWaveformStore,
  defaultView as moveWaveformDefaultView,
  scrubBy,
  zoomBy,
  stepPosition,
  loopFromStep,
  loopSteps,
  MOVE_WAVEFORM_STEPS,
} from './move-waveform';
export type { MoveWaveformVariant, MoveWaveformView } from './move-waveform';
export { MoveVolumeDisplay } from './move-volume';
export type { MoveVolumeDisplayState } from './move-volume';
export { ICON_MOVE_CAPTURE, ICON_MOVE_ENTER } from './icons';
// Raw hardware an app claims for itself — the bottom pad rows, the step
// buttons, the device screen — kept for the on-screen mirror.
export { MoveSurfaceStore } from './move-surface-store';
export type { MovePadCell, MoveStepCell, MoveScreenList, MoveSurfaceState } from './move-surface-store';

// List screen (the Move's dark display list, standalone)
export { ListScreen } from './components/ListScreen';
export type { ListScreenProps, ListScreenItem } from './components/ListScreen';

// Modulation layer — slots, assignments, the engine, and the type registry
export { ModulationStore, MOD_TOUCH_GRACE_MS } from './store/ModulationStore';
export type { ModulationSourceConfig, ModStepAction } from './store/ModulationStore';
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
} from './modulation-core';
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
} from './modulation-core';

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
export { WaveformVisualization } from './components/WaveformVisualization';
export type { WaveformMode, WaveformLoop } from './components/WaveformVisualization';
export { AnalyserVisualization } from './components/AnalyserVisualization';
export type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from './components/AnalyserVisualization';
export { AnalyserRow } from './components/AnalyserRow';
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
  springify,
  buildSamplers,
  readComposition,
  triggerLevels,
  triggersCrossed,
  DEFAULT_TRIGGER_STEPS,
} from './curve-composer-core';
export type { Sampler, SpringifyOptions, CompositionSamplers, CompositionRead } from './curve-composer-core';
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
} from './curve-preview-core';
export type { CurvePoint, CurvePlot } from './curve-preview-core';
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
export { TweakStore, TAB_PATH, parseListItemSchema, groupListFields, defaultListItemParams, normalizeListItems, hintDomId } from './store/TweakStore';
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
} from './store/TweakStore';
