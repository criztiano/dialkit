"use client";
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ADSR_DEF: () => import_modulation_core.ADSR_DEF,
  ADSR_STAGE_MAX: () => import_modulation_core.ADSR_STAGE_MAX,
  ANGLE_DEAD_ZONE_PX: () => import_angle_core2.ANGLE_DEAD_ZONE_PX,
  AnalyserRow: () => AnalyserRow,
  AnalyserVisualization: () => AnalyserVisualization,
  AngleDial: () => AngleDial,
  AudioLevelMeter: () => AudioLevelMeter,
  ButtonGroup: () => ButtonGroup,
  COLOR_FORMATS: () => import_color_core3.COLOR_FORMATS,
  CURVE_CYCLE: () => import_curve_composer_core.CURVE_CYCLE,
  CURVE_DEF: () => import_modulation_core.CURVE_DEF,
  CURVE_DEFAULT_HEIGHT: () => import_curve_preview_core3.CURVE_DEFAULT_HEIGHT,
  CURVE_FIT_PADDING: () => import_curve_preview_core3.CURVE_FIT_PADDING,
  CURVE_LABELS: () => import_modulation_core.CURVE_LABELS,
  CURVE_MAX_CLIPS: () => import_modulation_core.CURVE_MAX_CLIPS,
  CURVE_MAX_DURATION: () => import_modulation_core.CURVE_MAX_DURATION,
  CURVE_MAX_HEIGHT: () => import_curve_preview_core3.CURVE_MAX_HEIGHT,
  CURVE_MIN_DURATION: () => import_modulation_core.CURVE_MIN_DURATION,
  CURVE_MIN_HEIGHT: () => import_curve_preview_core3.CURVE_MIN_HEIGHT,
  CURVE_SAMPLE_COUNT: () => import_curve_preview_core3.CURVE_SAMPLE_COUNT,
  Checkbox: () => Checkbox,
  ChipsControl: () => ChipsControl,
  ColorControl: () => ColorControl,
  ColorPickerPanel: () => ColorPickerPanel,
  ControlRenderer: () => ControlRenderer,
  ControlShell: () => ControlShell,
  CurveComposer: () => import_tweakers3.CurveComposer,
  CurvePreview: () => CurvePreview,
  DEFAULT_GRADIENT: () => import_gradient_core5.DEFAULT_GRADIENT,
  DEFAULT_TRANSFER: () => import_transfer_core3.DEFAULT_TRANSFER,
  DEFAULT_TRIGGER_STEPS: () => import_curve_composer_core.DEFAULT_TRIGGER_STEPS,
  ENV_BEND_STAGES: () => import_modulation_core.ENV_BEND_STAGES,
  EasingVisualization: () => EasingVisualization,
  FILTER_DB_CEIL: () => import_filter_core3.FILTER_DB_CEIL,
  FILTER_DB_FLOOR: () => import_filter_core3.FILTER_DB_FLOOR,
  FileControl: () => FileControl,
  FilterControl: () => FilterControl,
  Folder: () => Folder,
  GalleryControl: () => GalleryControl,
  GradientControl: () => GradientControl,
  GradientPanel: () => GradientPanel,
  LFO_DEF: () => import_modulation_core.LFO_DEF,
  LFO_SYNC_DIVISIONS: () => import_modulation_core.LFO_SYNC_DIVISIONS,
  ListControl: () => ListControl,
  MIN_STOPS: () => import_gradient_core5.MIN_STOPS,
  MOD_COLORS: () => import_modulation_core.MOD_COLORS,
  MOD_PAGE_DIALS: () => import_modulation_core.MOD_PAGE_DIALS,
  MOD_RING_CIRCUMFERENCE: () => import_modulation_core.MOD_RING_CIRCUMFERENCE,
  MOD_RING_RADIUS: () => import_modulation_core.MOD_RING_RADIUS,
  MOD_SETTINGS_PANEL: () => import_modulation_core.MOD_SETTINGS_PANEL,
  MOD_SLOTS: () => import_modulation_core.MOD_SLOTS,
  MOD_TOUCH_GRACE_MS: () => import_modulation_store2.MOD_TOUCH_GRACE_MS,
  ModulationStore: () => import_modulation_store2.ModulationStore,
  Module: () => Module,
  MultiSelectControl: () => MultiSelectControl,
  NumberControl: () => NumberControl,
  PresetManager: () => PresetManager,
  RangeSlider: () => RangeSlider,
  SH_DEF: () => import_modulation_core.SH_DEF,
  SegmentedControl: () => SegmentedControl,
  SelectControl: () => SelectControl,
  ShortcutsMenu: () => ShortcutsMenu,
  Slider: () => Slider,
  SpringControl: () => SpringControl,
  SpringVisualization: () => SpringVisualization,
  SwatchControl: () => SwatchControl,
  TAB_PATH: () => import_store16.TAB_PATH,
  TRANSFER_MAX_POINTS: () => import_transfer_core3.TRANSFER_MAX_POINTS,
  TRANSFER_MIN_GAP: () => import_transfer_core3.TRANSFER_MIN_GAP,
  TextControl: () => TextControl,
  TimelineStore: () => import_timeline10.TimelineStore,
  Toggle: () => Toggle,
  TransferCurve: () => TransferCurve,
  TransitionControl: () => TransitionControl,
  TweakRoot: () => TweakRoot,
  TweakStore: () => import_store16.TweakStore,
  TweakTimeline: () => TweakTimeline,
  WaveformVisualization: () => import_tweakers2.WaveformVisualization,
  XYControl: () => XYControl,
  XYPad: () => XYPad,
  XY_DEFAULT_STEP: () => import_xy_pad_core3.XY_DEFAULT_STEP,
  XY_DETENT_PX: () => import_xy_pad_core3.XY_DETENT_PX,
  addDriver: () => import_curve_composer_core.addDriver,
  addStop: () => import_gradient_core5.addStop,
  angleFromPointer: () => import_angle_core2.angleFromPointer,
  applyDetentAxis: () => import_xy_pad_core3.applyDetentAxis,
  applyModulation: () => import_modulation_core.applyModulation,
  arcPath: () => import_angle_core2.arcPath,
  bearingToValue: () => import_angle_core2.bearingToValue,
  buildSamplers: () => import_curve_composer_core.buildSamplers,
  centerValue: () => import_xy_pad_core3.centerValue,
  clamp: () => import_range_slider_core2.clamp,
  clampCurveHeight: () => import_curve_preview_core3.clampCurveHeight,
  clampOklchToSrgb: () => import_color_core3.clampOklchToSrgb,
  clampRange: () => import_range_slider_core2.clampRange,
  colorAtPosition: () => import_gradient_core5.colorAtPosition,
  curveComposition: () => import_modulation_core.curveComposition,
  curveDuration: () => import_modulation_core.curveDuration,
  curvePathData: () => import_curve_preview_core3.curvePathData,
  curveY: () => import_curve_preview_core3.curveY,
  cycleDriverType: () => import_curve_composer_core.cycleDriverType,
  cycleSegmentType: () => import_curve_composer_core.cycleSegmentType,
  defaultComposition: () => import_curve_composer_core.defaultComposition,
  defaultFilterResponse: () => import_filter_core3.defaultFilterResponse,
  defaultListItemParams: () => import_store16.defaultListItemParams,
  displayHex: () => import_color_core3.displayHex,
  envCurveParam: () => import_modulation_core.envCurveParam,
  envelopeJoints: () => import_modulation_core.envelopeJoints,
  envelopePoints: () => import_modulation_core.envelopePoints,
  filterHand01: () => import_filter_core3.filterHand01,
  filterHandValue: () => import_filter_core3.filterHandValue,
  filterResponsePath: () => import_filter_core3.filterResponsePath,
  filterShapeResponse: () => import_filter_core3.filterShapeResponse,
  flipDriver: () => import_curve_composer_core.flipDriver,
  flipDriverX: () => import_curve_composer_core.flipDriverX,
  flipDriverY: () => import_curve_composer_core.flipDriverY,
  flipSegment: () => import_curve_composer_core.flipSegment,
  flipSegmentX: () => import_curve_composer_core.flipSegmentX,
  flipSegmentY: () => import_curve_composer_core.flipSegmentY,
  formatClock: () => import_timeline9.formatClock,
  formatHex: () => import_color_core3.formatHex,
  getModType: () => import_modulation_core.getModType,
  gradientFillBox: () => import_gradient_core5.gradientFillBox,
  gradientToCss: () => import_gradient_core5.gradientToCss,
  gradientToTransform: () => import_gradient_core5.gradientToTransform,
  groupListFields: () => import_store16.groupListFields,
  handleLeftStyles: () => import_range_slider_core2.handleLeftStyles,
  hintDomId: () => import_store16.hintDomId,
  hslToRgb: () => import_color_core3.hslToRgb,
  hsvToRgb: () => import_color_core3.hsvToRgb,
  insertPoint: () => import_transfer_core3.insertPoint,
  invertY: () => import_xy_pad_core3.invertY,
  isIdentityTransfer: () => import_transfer_core3.isIdentityTransfer,
  isOutsideSpan: () => import_range_slider_core2.isOutsideSpan,
  lfoSyncedHz: () => import_modulation_core.lfoSyncedHz,
  listModTypes: () => import_modulation_core.listModTypes,
  modColor: () => import_modulation_core.modColor,
  modKey: () => import_modulation_core.modKey,
  modPageLayout: () => import_modulation_core.modPageLayout,
  modPageWidth: () => import_modulation_core.modPageWidth,
  modRingArc: () => import_modulation_core.modRingArc,
  movePoint: () => import_transfer_core3.movePoint,
  moveStop: () => import_gradient_core5.moveStop,
  nearestHandle: () => import_range_slider_core2.nearestHandle,
  nearestPoint: () => import_transfer_core3.nearestPoint,
  normToValue: () => import_xy_pad_core3.normToValue,
  normalizeAngle: () => import_angle_core2.normalizeAngle,
  normalizeCurveMarkers: () => import_curve_preview_core3.normalizeCurveMarkers,
  normalizeFilterValue: () => import_filter_core3.normalizeFilterValue,
  normalizeGradient: () => import_gradient_core5.normalizeGradient,
  normalizeHex: () => import_color_core3.normalizeHex,
  normalizeListItems: () => import_store16.normalizeListItems,
  normalizeTransfer: () => import_transfer_core3.normalizeTransfer,
  normalizeValue: () => import_xy_pad_core3.normalizeValue,
  nudge: () => import_xy_pad_core3.nudge,
  nudgeAngle: () => import_angle_core2.nudgeAngle,
  oklchToRgb: () => import_color_core3.oklchToRgb,
  opacityPercent: () => import_color_core3.opacityPercent,
  orderRange: () => import_range_slider_core2.orderRange,
  parseHex: () => import_color_core3.parseHex,
  parseListItemSchema: () => import_store16.parseListItemSchema,
  percentToValue: () => import_range_slider_core2.percentToValue,
  pickDragTarget: () => import_range_slider_core2.pickDragTarget,
  plotCurve: () => import_curve_preview_core3.plotCurve,
  pointFromValue: () => import_xy_pad_core3.pointFromValue,
  rampCss: () => import_gradient_core5.rampCss,
  readComposition: () => import_curve_composer_core.readComposition,
  redistributeWeight: () => import_curve_composer_core.redistributeWeight,
  registerModType: () => import_modulation_core.registerModType,
  removeDriver: () => import_curve_composer_core.removeDriver,
  removePoint: () => import_transfer_core3.removePoint,
  removeSegment: () => import_curve_composer_core.removeSegment,
  removeStop: () => import_gradient_core5.removeStop,
  resolveAxis: () => import_xy_pad_core3.resolveAxis,
  resolveFilterAxis: () => import_filter_core3.resolveFilterAxis,
  rgbToHsl: () => import_color_core3.rgbToHsl,
  rgbToHsv: () => import_color_core3.rgbToHsv,
  rgbToOklch: () => import_color_core3.rgbToOklch,
  sampleTransfer: () => import_transfer_core3.sampleTransfer,
  setDriverAnticipate: () => import_curve_composer_core.setDriverAnticipate,
  setDriverCurvature: () => import_curve_composer_core.setDriverCurvature,
  setDriverOvershoot: () => import_curve_composer_core.setDriverOvershoot,
  setDriverSteepness: () => import_curve_composer_core.setDriverSteepness,
  setGradientAngle: () => import_gradient_core5.setGradientAngle,
  setGradientCenter: () => import_gradient_core5.setGradientCenter,
  setGradientRotation: () => import_gradient_core5.setGradientRotation,
  setGradientScale: () => import_gradient_core5.setGradientScale,
  setGradientSquash: () => import_gradient_core5.setGradientSquash,
  setGradientType: () => import_gradient_core5.setGradientType,
  setHigh: () => import_range_slider_core2.setHigh,
  setLow: () => import_range_slider_core2.setLow,
  setSegmentAnticipate: () => import_curve_composer_core.setSegmentAnticipate,
  setSegmentCurvature: () => import_curve_composer_core.setSegmentCurvature,
  setSegmentOvershoot: () => import_curve_composer_core.setSegmentOvershoot,
  setSegmentSteepness: () => import_curve_composer_core.setSegmentSteepness,
  setStopColor: () => import_gradient_core5.setStopColor,
  shiftSpan: () => import_range_slider_core2.shiftSpan,
  snapAngle: () => import_angle_core2.snapAngle,
  snapToStep: () => import_xy_pad_core3.snapToStep,
  splitSegment: () => import_curve_composer_core.splitSegment,
  springify: () => import_curve_composer_core.springify,
  transferLut: () => import_transfer_core3.transferLut,
  triggerLevels: () => import_curve_composer_core.triggerLevels,
  triggersCrossed: () => import_curve_composer_core.triggersCrossed,
  useTweakTimeline: () => useTweakTimeline,
  useTweakers: () => useTweakers,
  valueFromPoint: () => import_xy_pad_core3.valueFromPoint,
  valueToBearing: () => import_angle_core2.valueToBearing,
  valueToNorm: () => import_xy_pad_core3.valueToNorm,
  valueToPercent: () => import_range_slider_core2.valueToPercent,
  visibleModControls: () => import_modulation_core.visibleModControls
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useTweakers.ts
var import_react2 = require("react");
var import_store2 = require("tweakers/store");

// src/hooks/useTweakStorePanel.ts
var import_react = require("react");
var import_store = require("tweakers/store");
function useSerialized(value) {
  const ref = (0, import_react.useRef)();
  if (!ref.current || !Object.is(ref.current.value, value)) {
    ref.current = { value, text: JSON.stringify(value) };
  }
  return ref.current.text;
}
function useTweakStorePanel(name, config, options = {}) {
  const instanceId = (0, import_react.useId)();
  const hasStableId = options.id !== void 0;
  const panelId = options.id ?? `${name}-${instanceId}`;
  const configRef = (0, import_react.useRef)(config);
  configRef.current = config;
  const optionsRef = (0, import_react.useRef)(options);
  optionsRef.current = options;
  const serializedConfig = useSerialized(config);
  const serializedShortcuts = useSerialized(options.shortcuts);
  const serializedPersist = useSerialized(options.persist);
  const serializedHints = useSerialized(options.hints);
  const serializedLabels = useSerialized(options.labels);
  const serializedMovePads = useSerialized(options.movePads);
  (0, import_react.useEffect)(() => {
    import_store.TweakStore.registerPanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      movePads: optionsRef.current.movePads,
      kind: optionsRef.current.kind
    });
    return () => import_store.TweakStore.unregisterPanel(panelId);
  }, [hasStableId, panelId, name]);
  const mountedRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    import_store.TweakStore.updatePanel(panelId, name, configRef.current, optionsRef.current.shortcuts, {
      retainOnUnmount: hasStableId,
      persist: optionsRef.current.persist,
      hints: optionsRef.current.hints,
      affordances: optionsRef.current.affordances,
      labels: optionsRef.current.labels,
      movePads: optionsRef.current.movePads,
      kind: optionsRef.current.kind
    });
  }, [hasStableId, panelId, name, serializedConfig, serializedShortcuts, serializedPersist, serializedHints, serializedLabels, serializedMovePads]);
  (0, import_react.useEffect)(() => {
    const presets = optionsRef.current.presets;
    import_store.TweakStore.setPresetsHidden(panelId, presets === false);
    import_store.TweakStore.setPresetProvider(panelId, presets === false ? null : presets ?? null);
  });
  (0, import_react.useEffect)(() => {
    import_store.TweakStore.syncCurveConfigs(panelId, configRef.current);
  });
  const subscribe = (0, import_react.useCallback)(
    (callback) => import_store.TweakStore.subscribe(panelId, callback),
    [panelId]
  );
  const getSnapshot = (0, import_react.useCallback)(() => import_store.TweakStore.getValues(panelId), [panelId]);
  const flatValues = (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
  return { panelId, flatValues, serializedConfig };
}

// src/hooks/useTweakers.ts
var import_gradient_core = require("tweakers/gradient-core");
var import_xy_pad_core = require("tweakers/xy-pad-core");
var import_filter_core = require("tweakers/filter-core");
var import_transfer_core = require("tweakers/transfer-core");
function useTweakers(name, config, options) {
  const onActionRef = (0, import_react2.useRef)(options?.onAction);
  onActionRef.current = options?.onAction;
  const onEventRef = (0, import_react2.useRef)(options?.onEvent);
  onEventRef.current = options?.onEvent;
  const { panelId, flatValues } = useTweakStorePanel(name, config, {
    shortcuts: options?.shortcuts,
    hints: options?.hints,
    affordances: options?.affordances,
    labels: options?.labels,
    movePads: options?.movePads,
    presets: options?.presets
  });
  (0, import_react2.useEffect)(() => {
    return import_store2.TweakStore.subscribeActions(panelId, (action) => {
      onActionRef.current?.(action);
    });
  }, [panelId]);
  (0, import_react2.useEffect)(() => {
    return import_store2.TweakStore.subscribeEvents(panelId, (path, event) => {
      onEventRef.current?.(path, event);
    });
  }, [panelId]);
  return buildResolvedValues(config, flatValues, "");
}
function buildResolvedValues(config, flatValues, prefix) {
  const result = {};
  for (const [key, configValue] of Object.entries(config)) {
    if (key === "_collapsed" || key === "_collapsible" || key === "_tabs") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === "number") {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (isSliderConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default;
    } else if (typeof configValue === "number" || typeof configValue === "boolean" || typeof configValue === "string") {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSpringConfig(configValue) || isEasingConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? "#000000";
    } else if (isGradientConfig(configValue)) {
      result[key] = flatValues[path] ?? (0, import_gradient_core.normalizeGradient)(configValue.default ?? import_gradient_core.DEFAULT_GRADIENT);
    } else if (isTextConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? "";
    } else if (isGalleryConfig(configValue)) {
      const defaultValue = configValue.default ?? configValue.items[0]?.id ?? "";
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isFileConfig(configValue)) {
      result[key] = flatValues[path] ?? "";
    } else if (isSwatchConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? "";
    } else if (isChipsConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? configValue.options[0]?.value ?? "";
    } else if (isMultiSelectConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? [];
    } else if (isListConfig(configValue)) {
      result[key] = flatValues[path] ?? (0, import_store2.normalizeListItems)(configValue);
    } else if (isXYConfig(configValue)) {
      const cfg = configValue;
      result[key] = flatValues[path] ?? (0, import_xy_pad_core.normalizeValue)(
        cfg.default,
        (0, import_xy_pad_core.resolveAxis)(cfg.x),
        (0, import_xy_pad_core.resolveAxis)(cfg.y),
        cfg.snap ?? false
      );
    } else if (isRangeConfig(configValue)) {
      const cfg = configValue;
      result[key] = flatValues[path] ?? cfg.default ?? { min: cfg.min, max: cfg.max };
    } else if (isFilterConfig(configValue)) {
      const cfg = configValue;
      result[key] = flatValues[path] ?? (0, import_filter_core.normalizeFilterValue)(
        cfg.default,
        (0, import_filter_core.resolveFilterAxis)(cfg.cutoff, "cutoff"),
        (0, import_filter_core.resolveFilterAxis)(cfg.resonance, "resonance")
      );
    } else if (isTransferConfig(configValue)) {
      result[key] = flatValues[path] ?? (0, import_transfer_core.normalizeTransfer)(configValue.default ?? import_transfer_core.DEFAULT_TRANSFER);
    } else if (isCurveConfig(configValue) || isAnalyserConfig(configValue)) {
    } else if (typeof configValue === "object" && configValue !== null) {
      result[key] = buildResolvedValues(configValue, flatValues, path);
    }
  }
  return result;
}
function hasType(value, type) {
  return typeof value === "object" && value !== null && "type" in value && value.type === type;
}
function isSpringConfig(value) {
  return hasType(value, "spring");
}
function isEasingConfig(value) {
  return hasType(value, "easing");
}
function isActionConfig(value) {
  return hasType(value, "action");
}
function isSelectConfig(value) {
  return hasType(value, "select") && "options" in value && Array.isArray(value.options);
}
function isColorConfig(value) {
  return hasType(value, "color");
}
function isGradientConfig(value) {
  return hasType(value, "gradient");
}
function isTextConfig(value) {
  return hasType(value, "text");
}
function isGalleryConfig(value) {
  return hasType(value, "gallery") && "items" in value && Array.isArray(value.items);
}
function isFileConfig(value) {
  return hasType(value, "file");
}
function isSwatchConfig(value) {
  return hasType(value, "swatch") && "options" in value && Array.isArray(value.options);
}
function isChipsConfig(value) {
  return hasType(value, "chips") && "options" in value && Array.isArray(value.options);
}
function isMultiSelectConfig(value) {
  return hasType(value, "multiselect") && "options" in value && Array.isArray(value.options);
}
function isSliderConfig(value) {
  return hasType(value, "slider") && typeof value.min === "number" && typeof value.max === "number";
}
function isListConfig(value) {
  return hasType(value, "list") && "itemTypes" in value && typeof value.itemTypes === "object";
}
function isXYConfig(value) {
  return hasType(value, "xy");
}
function isRangeConfig(value) {
  return hasType(value, "range");
}
function isFilterConfig(value) {
  return hasType(value, "filter");
}
function isTransferConfig(value) {
  return hasType(value, "transfer");
}
function isAnalyserConfig(value) {
  return hasType(value, "analyser");
}
function isCurveConfig(value) {
  return hasType(value, "curve") && typeof value.sample === "function";
}
function getFirstOptionValue(options) {
  const first = options[0];
  return typeof first === "string" ? first : first.value;
}

// src/components/TweakRoot.tsx
var import_react44 = require("react");
var import_react_dom7 = require("react-dom");
var import_store13 = require("tweakers/store");
var import_timeline2 = require("tweakers/timeline");
var import_env = require("tweakers/env");

// src/components/Folder.tsx
var import_react3 = require("react");
var import_react4 = require("motion/react");
var import_icons = require("tweakers/icons");

// src/components/Checkbox.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Checkbox({ checked, onChange, label, disabled = false, id }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      type: "button",
      id,
      role: "checkbox",
      "aria-checked": disabled ? "mixed" : checked,
      "aria-label": label,
      "aria-disabled": disabled || void 0,
      className: "tweakers-checkbox",
      "data-checked": checked && !disabled ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      onClick: (e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { viewBox: "0 0 22 22", width: "22", height: "22", "aria-hidden": "true", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { className: "tweakers-checkbox-slash", d: "M6 16 16 6", fill: "none" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { className: "tweakers-checkbox-chip", x: "5", y: "5", width: "12", height: "12", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { className: "tweakers-checkbox-dash", d: "M6 11h10", fill: "none" })
      ] })
    }
  );
}

// src/components/Folder.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Folder({ title, children, defaultOpen = true, collapsible = true, isRoot = false, inline = false, onOpenChange, toolbar, tabs, hint, hintId, enabled, onEnabledChange }) {
  const [isOpen, setIsOpen] = (0, import_react3.useState)(collapsible ? defaultOpen : true);
  const [isCollapsed, setIsCollapsed] = (0, import_react3.useState)(collapsible ? !defaultOpen : false);
  const contentRef = (0, import_react3.useRef)(null);
  const [contentHeight, setContentHeight] = (0, import_react3.useState)(void 0);
  const [windowHeight, setWindowHeight] = (0, import_react3.useState)(typeof window !== "undefined" ? window.innerHeight : 800);
  (0, import_react3.useEffect)(() => {
    if (!isRoot) return;
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isRoot]);
  (0, import_react3.useEffect)(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (isOpen) {
        const h = el.offsetHeight;
        setContentHeight((prev) => prev === h ? prev : h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);
  const isModule = isRoot && enabled !== void 0 && onEnabledChange !== void 0;
  const bodyOpen = isOpen && (!isModule || enabled);
  const handleToggle = () => {
    if (!collapsible) return;
    if (inline && isRoot) return;
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
    onOpenChange?.(next);
  };
  const folderContent = /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { ref: isRoot ? contentRef : void 0, className: `tweakers-folder ${isRoot ? "tweakers-folder-root" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        className: `tweakers-folder-header ${isRoot ? "tweakers-panel-header" : ""} ${collapsible ? "" : "tweakers-folder-header-static"}`,
        onClick: collapsible ? handleToggle : void 0,
        "data-hint": hint ? "true" : void 0,
        "aria-describedby": hint ? hintId : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "tweakers-folder-header-top", children: [
            isRoot ? isOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "tweakers-folder-title-row", children: [
              isModule && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                Checkbox,
                {
                  checked: enabled,
                  onChange: onEnabledChange,
                  label: title
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "tweakers-folder-title tweakers-folder-title-root", children: title })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-folder-title-row", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "tweakers-folder-title", children: title }) }),
            !isRoot && toolbar && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-folder-toolbar", onClick: (e) => e.stopPropagation(), children: toolbar }),
            isRoot && !inline && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "svg",
              {
                className: "tweakers-panel-icon",
                viewBox: "0 0 16 16",
                fill: "none",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { opacity: "0.5", d: import_icons.ICON_PANEL.path, fill: "currentColor" }),
                  import_icons.ICON_PANEL.circles.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: c.cx, cy: c.cy, r: c.r, fill: "currentColor", stroke: "currentColor", strokeWidth: "1.25" }, i))
                ]
              }
            ),
            !isRoot && collapsible && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              import_react4.motion.svg,
              {
                className: "tweakers-folder-icon",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                initial: false,
                animate: { rotate: isOpen ? 0 : 180 },
                transition: { type: "spring", visualDuration: 0.35, bounce: 0.15 },
                children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: import_icons.ICON_CHEVRON })
              }
            )
          ] }),
          isRoot && toolbar && isOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-panel-toolbar", onClick: (e) => e.stopPropagation(), children: toolbar }),
          isRoot && tabs && isOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-panel-tabs", onClick: (e) => e.stopPropagation(), children: tabs }),
          hint && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "tweakers-hint", id: hintId, role: "tooltip", children: hint })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react4.AnimatePresence, { initial: false, children: bodyOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react4.motion.div,
      {
        className: "tweakers-folder-content",
        initial: isRoot ? void 0 : { height: 0, opacity: 0 },
        animate: isRoot ? void 0 : { height: "auto", opacity: 1 },
        exit: isRoot ? void 0 : { height: 0, opacity: 0 },
        transition: isRoot ? void 0 : { type: "spring", visualDuration: 0.35, bounce: 0.1 },
        style: isRoot ? void 0 : { clipPath: "inset(0 -20px)" },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-folder-inner", children })
      }
    ) })
  ] });
  if (isRoot) {
    if (inline) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tweakers-panel-inner tweakers-panel-inline", children: folderContent });
    }
    const panelStyle = isOpen ? { width: 280, height: contentHeight !== void 0 ? Math.min(contentHeight + 10, windowHeight - 32) : "auto", borderRadius: 14, boxShadow: "var(--tweak-shadow)", cursor: void 0, overflowY: "auto" } : { width: 42, height: 42, borderRadius: "50%", boxSizing: "border-box", boxShadow: "var(--tweak-shadow-collapsed)", overflow: "hidden", cursor: "pointer" };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react4.motion.div,
      {
        className: "tweakers-panel-inner",
        style: panelStyle,
        onClick: !isOpen ? handleToggle : void 0,
        "data-collapsed": isCollapsed,
        whileTap: !isOpen ? { scale: 0.9 } : void 0,
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: folderContent
      }
    );
  }
  return folderContent;
}

// src/components/Panel.tsx
var import_react40 = require("react");
var import_react41 = require("motion/react");
var import_store12 = require("tweakers/store");

// src/panel-tabs.ts
function splitPanelTabs(controls, activeValue) {
  const tabs = controls.filter((control) => control.tab);
  if (!controls.some((control) => control.tabBar) || tabs.length === 0) {
    return { tabs: [], looseControls: [], pageControls: controls };
  }
  const activeTab = tabs.find((tab) => tab.path === activeValue) ?? tabs[0];
  return {
    tabs,
    activeTab,
    looseControls: controls.filter((control) => !control.tab && !control.tabBar),
    pageControls: activeTab.children ?? []
  };
}

// src/components/Panel.tsx
var import_copy_instruction = require("tweakers/copy-instruction");
var import_icons11 = require("tweakers/icons");

// src/components/ControlRenderer.tsx
var import_react37 = require("react");
var import_store10 = require("tweakers/store");

// src/components/ShortcutListener.tsx
var import_react5 = require("react");
var import_store3 = require("tweakers/store");
var import_shortcut_utils = require("tweakers/shortcut-utils");
var import_jsx_runtime3 = require("react/jsx-runtime");
var ShortcutContext = (0, import_react5.createContext)({ activePanelId: null, activePath: null });
function ShortcutListener({ children }) {
  const [activeShortcut, setActiveShortcut] = (0, import_react5.useState)({ activePanelId: null, activePath: null });
  const activeKeysRef = (0, import_react5.useRef)(/* @__PURE__ */ new Set());
  const isDraggingRef = (0, import_react5.useRef)(false);
  const lastMouseXRef = (0, import_react5.useRef)(null);
  const dragAccumulatorRef = (0, import_react5.useRef)(0);
  const resolveActiveTarget = (0, import_react5.useCallback)((interaction) => {
    for (const key of activeKeysRef.current) {
      const panels = import_store3.TweakStore.getPanels();
      for (const panel of panels) {
        for (const [path, shortcut] of Object.entries(panel.shortcuts)) {
          if (!shortcut.key) continue;
          if (shortcut.key.toLowerCase() !== key) continue;
          if ((shortcut.interaction ?? "scroll") !== interaction) continue;
          const control = (0, import_shortcut_utils.findControl)(panel.controls, path);
          if (control && control.type === "slider") {
            return { panelId: panel.id, path, control, shortcut };
          }
        }
      }
    }
    return null;
  }, []);
  (0, import_react5.useEffect)(() => {
    const handleKeyDown = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
        if (activeKeysRef.current.size > 0) {
          const target2 = resolveActiveTarget("scroll") || resolveActiveTarget("drag") || resolveActiveTarget("move");
          if (target2 && target2.control.type === "slider") {
            e.preventDefault();
            const direction = key === "arrowright" || key === "arrowup" ? 1 : -1;
            const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(target2.control, target2.shortcut);
            (0, import_shortcut_utils.applySliderDelta)(target2.panelId, target2.path, target2.control, effectiveStep, direction);
            return;
          }
        }
      }
      const wasAlreadyHeld = activeKeysRef.current.has(key);
      activeKeysRef.current.add(key);
      const modifier = (0, import_shortcut_utils.getActiveModifier)(e);
      const target = import_store3.TweakStore.resolveShortcutTarget(key, modifier);
      if (target) {
        setActiveShortcut({ activePanelId: target.panelId, activePath: target.path });
        if (!wasAlreadyHeld && target.control.type === "toggle") {
          const currentValue = import_store3.TweakStore.getValue(target.panelId, target.path);
          import_store3.TweakStore.updateValue(target.panelId, target.path, !currentValue);
        }
      }
      if (!wasAlreadyHeld) {
        lastMouseXRef.current = null;
        dragAccumulatorRef.current = 0;
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      activeKeysRef.current.delete(key);
      isDraggingRef.current = false;
      lastMouseXRef.current = null;
      dragAccumulatorRef.current = 0;
      if (activeKeysRef.current.size === 0) {
        setActiveShortcut({ activePanelId: null, activePath: null });
      } else {
        let found = false;
        for (const remainingKey of activeKeysRef.current) {
          const modifier = (0, import_shortcut_utils.getActiveModifier)(e);
          const target = import_store3.TweakStore.resolveShortcutTarget(remainingKey, modifier);
          if (target) {
            setActiveShortcut({ activePanelId: target.panelId, activePath: target.path });
            found = true;
            break;
          }
        }
        if (!found) {
          setActiveShortcut({ activePanelId: null, activePath: null });
        }
      }
    };
    const handleWheel = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      const modifier = (0, import_shortcut_utils.getActiveModifier)(e);
      if (activeKeysRef.current.size > 0) {
        for (const key of activeKeysRef.current) {
          const target = import_store3.TweakStore.resolveShortcutTarget(key, modifier);
          if (!target) continue;
          const { panelId, path, control } = target;
          const interaction = control.shortcut?.interaction ?? "scroll";
          if (interaction !== "scroll" || control.type !== "slider") continue;
          e.preventDefault();
          const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(control, control.shortcut);
          const direction = e.deltaY > 0 ? 1 : -1;
          (0, import_shortcut_utils.applySliderDelta)(panelId, path, control, effectiveStep, direction);
          return;
        }
      }
      const scrollOnlyTargets = import_store3.TweakStore.resolveScrollOnlyTargets();
      for (const { panelId, path, control, shortcut } of scrollOnlyTargets) {
        if (control.type !== "slider") continue;
        e.preventDefault();
        const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(control, shortcut);
        const direction = e.deltaY > 0 ? 1 : -1;
        (0, import_shortcut_utils.applySliderDelta)(panelId, path, control, effectiveStep, direction);
        return;
      }
    };
    const handleMouseDown = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      if (activeKeysRef.current.size === 0) return;
      const target = resolveActiveTarget("drag");
      if (target) {
        isDraggingRef.current = true;
        lastMouseXRef.current = e.clientX;
        dragAccumulatorRef.current = 0;
        e.preventDefault();
      }
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      lastMouseXRef.current = null;
      dragAccumulatorRef.current = 0;
    };
    const handleMouseMove = (e) => {
      if ((0, import_shortcut_utils.isInputFocused)()) return;
      if (activeKeysRef.current.size === 0) return;
      if (isDraggingRef.current) {
        const target = resolveActiveTarget("drag");
        if (target && lastMouseXRef.current !== null) {
          const deltaX = e.clientX - lastMouseXRef.current;
          lastMouseXRef.current = e.clientX;
          dragAccumulatorRef.current += deltaX;
          const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(target.control, target.shortcut);
          const steps = Math.trunc(dragAccumulatorRef.current / import_shortcut_utils.DRAG_SENSITIVITY);
          if (steps !== 0) {
            dragAccumulatorRef.current -= steps * import_shortcut_utils.DRAG_SENSITIVITY;
            (0, import_shortcut_utils.applySliderDelta)(target.panelId, target.path, target.control, effectiveStep, steps);
          }
        }
        return;
      }
      const moveTarget = resolveActiveTarget("move");
      if (moveTarget) {
        if (lastMouseXRef.current === null) {
          lastMouseXRef.current = e.clientX;
          return;
        }
        const deltaX = e.clientX - lastMouseXRef.current;
        lastMouseXRef.current = e.clientX;
        dragAccumulatorRef.current += deltaX;
        const effectiveStep = (0, import_shortcut_utils.getEffectiveStep)(moveTarget.control, moveTarget.shortcut);
        const steps = Math.trunc(dragAccumulatorRef.current / import_shortcut_utils.DRAG_SENSITIVITY);
        if (steps !== 0) {
          dragAccumulatorRef.current -= steps * import_shortcut_utils.DRAG_SENSITIVITY;
          (0, import_shortcut_utils.applySliderDelta)(moveTarget.panelId, moveTarget.path, moveTarget.control, effectiveStep, steps);
        }
      }
    };
    const handleWindowBlur = () => {
      activeKeysRef.current.clear();
      isDraggingRef.current = false;
      lastMouseXRef.current = null;
      dragAccumulatorRef.current = 0;
      setActiveShortcut({ activePanelId: null, activePath: null });
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [resolveActiveTarget]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ShortcutContext.Provider, { value: activeShortcut, children });
}

// src/components/ModuleFolder.tsx
var import_react6 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function ModuleFolder({ title, enabled, onEnabledChange, defaultOpen = true, hint, hintId, children }) {
  const [isOpen, setIsOpen] = (0, import_react6.useState)(defaultOpen);
  const headerOnly = children == null || Array.isArray(children) && children.length === 0;
  const handleEnabledChange = (next) => {
    onEnabledChange(next);
    if (next) setIsOpen(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "tweakers-module tweakers-module-folder", "data-open": !headerOnly && enabled && isOpen ? "true" : "false", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: `tweakers-module-header ${headerOnly ? "" : "tweakers-module-header-toggle"}`,
        onClick: () => {
          if (enabled && !headerOnly) setIsOpen((open) => !open);
        },
        "data-hint": hint ? "true" : void 0,
        "aria-describedby": hint ? hintId : void 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Checkbox, { checked: enabled, onChange: handleEnabledChange, label: title }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "tweakers-module-title", children: title }),
          hint && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "tweakers-hint", id: hintId, role: "tooltip", children: hint })
        ]
      }
    ),
    !headerOnly && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "tweakers-module-collapse", "data-open": enabled && isOpen, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "tweakers-module-collapse-clip", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "tweakers-module-inner", children }) }) })
  ] });
}

// src/components/ControlShell.tsx
var import_react7 = require("react");
var import_react_dom = require("react-dom");
var import_store4 = require("tweakers/store");
var import_modulation_store = require("tweakers/modulation-store");
var import_affordance_core = require("tweakers/affordance-core");
var import_tweakers = require("tweakers");
var import_jsx_runtime5 = require("react/jsx-runtime");
function ControlShell({ hint, title, id, affordance, panelId, path, children }) {
  const [open, setOpen] = (0, import_react7.useState)(false);
  const readDisabled = (0, import_react7.useCallback)(
    () => panelId && path ? import_store4.TweakStore.isDisabled(panelId, path) : false,
    [panelId, path]
  );
  const disabled = (0, import_react7.useSyncExternalStore)(
    (0, import_react7.useCallback)((cb) => panelId ? import_store4.TweakStore.subscribeControlState(panelId, cb) : () => {
    }, [panelId]),
    readDisabled,
    readDisabled
  );
  const readMod = (0, import_react7.useCallback)(
    () => panelId && path ? import_modulation_store.ModulationStore.getAssignment(panelId, path) : void 0,
    [panelId, path]
  );
  const modAssignment = (0, import_react7.useSyncExternalStore)(
    (0, import_react7.useCallback)((cb) => import_modulation_store.ModulationStore.subscribe(cb), []),
    readMod,
    readMod
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: "tweakers-control-tip",
      "data-hint": hint ? "true" : void 0,
      "data-affordance": affordance ? "true" : void 0,
      "data-affordance-open": open ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      "data-mod": modAssignment ? "true" : void 0,
      "aria-disabled": disabled ? true : void 0,
      role: hint ? "group" : void 0,
      "aria-describedby": hint ? id : void 0,
      title: hint ? void 0 : title,
      onPointerDownCapture: panelId && path ? () => import_modulation_store.ModulationStore.noteTouch(panelId, path) : void 0,
      children: [
        children,
        modAssignment && panelId && path && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_tweakers.ModRing, { panelId, path, assignment: modAssignment }),
        hint && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "tweakers-hint", id, role: "tooltip", children: hint }),
        affordance && panelId && path && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          Affordance,
          {
            affordance,
            panelId,
            path,
            open,
            onOpenChange: setOpen
          }
        )
      ]
    }
  );
}
function Affordance({ affordance, panelId, path, open, onOpenChange }) {
  const dotRef = (0, import_react7.useRef)(null);
  const popoverRef = (0, import_react7.useRef)(null);
  const [pos, setPos] = (0, import_react7.useState)(null);
  const [portalTarget, setPortalTarget] = (0, import_react7.useState)(null);
  const label = affordance.label ?? "Options";
  const status = (0, import_react7.useSyncExternalStore)(
    (0, import_react7.useCallback)((cb) => import_store4.TweakStore.subscribeControlState(panelId, cb), [panelId]),
    (0, import_react7.useCallback)(() => import_store4.TweakStore.getAffordanceStatus(panelId, path), [panelId, path]),
    (0, import_react7.useCallback)(() => import_store4.TweakStore.getAffordanceStatus(panelId, path), [panelId, path])
  );
  (0, import_react7.useEffect)(() => {
    const root = dotRef.current?.closest?.(".tweakers-root");
    const target = root ?? (typeof document === "undefined" ? null : document.body);
    setPortalTarget(target?.nodeType === 1 ? target : null);
  }, []);
  const place = (0, import_react7.useCallback)(() => {
    const rect = dotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = (0, import_affordance_core.placePopover)(rect, popoverRef.current?.offsetHeight ?? 0, window.innerHeight);
    setPos((cur) => cur && cur.top === next.top && cur.left === next.left ? cur : next);
  }, []);
  (0, import_react7.useLayoutEffect)(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);
  (0, import_react7.useLayoutEffect)(() => {
    if (open && pos) place();
  }, [open, pos, place]);
  (0, import_react7.useEffect)(() => {
    if (!open) return;
    const first = popoverRef.current?.querySelector(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (first ?? popoverRef.current)?.focus();
  }, [open, pos !== null]);
  (0, import_react7.useEffect)(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      const target = e.target;
      if (dotRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      onOpenChange(false);
      dotRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);
  const popover = open ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      ref: popoverRef,
      className: "tweakers-affordance-popover",
      role: "dialog",
      "aria-label": label,
      tabIndex: -1,
      style: {
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        width: import_affordance_core.AFFORDANCE_POPOVER_WIDTH,
        // Hidden until measured, so it never flashes at the wrong spot.
        visibility: pos ? void 0 : "hidden"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "tweakers-affordance-popover-title", children: label }),
        (0, import_react7.createElement)(affordance.content, {
          panelId,
          path,
          status,
          setStatus: (next) => import_store4.TweakStore.setAffordanceStatus(panelId, path, next)
        })
      ]
    }
  ) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        ref: dotRef,
        type: "button",
        className: "tweakers-affordance-dot",
        "data-status": status,
        "data-open": String(open),
        "aria-label": label,
        "aria-expanded": open,
        onClick: () => onOpenChange(!open)
      }
    ),
    popover && (portalTarget ? (0, import_react_dom.createPortal)(popover, portalTarget) : popover)
  ] });
}

// src/components/Slider.tsx
var import_react8 = require("react");
var import_react9 = require("motion/react");
var import_shortcut_utils2 = require("tweakers/shortcut-utils");
var import_jsx_runtime6 = require("react/jsx-runtime");
var CLICK_THRESHOLD = 3;
var DEAD_ZONE = 32;
var MAX_CURSOR_RANGE = 200;
var MAX_STRETCH = 8;
var DETENT_PX = 6;
function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  unit,
  formatValue,
  valueIcon,
  origin,
  bipolar,
  orientation = "horizontal",
  shortcut,
  shortcutActive
}) {
  const isVertical = orientation === "vertical";
  const resolvedOrigin = Math.min(max, Math.max(min, origin ?? (bipolar ? 0 : min)));
  const hasOrigin = resolvedOrigin > min;
  const originPercent = (resolvedOrigin - min) / (max - min) * 100;
  const wrapperRef = (0, import_react8.useRef)(null);
  const inputRef = (0, import_react8.useRef)(null);
  const [isInteracting, setIsInteracting] = (0, import_react8.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react8.useState)(false);
  const [isHovered, setIsHovered] = (0, import_react8.useState)(false);
  const [isValueHovered, setIsValueHovered] = (0, import_react8.useState)(false);
  const [isMetaHeld, setIsMetaHeld] = (0, import_react8.useState)(false);
  const [isValueEditable, setIsValueEditable] = (0, import_react8.useState)(false);
  const [showInput, setShowInput] = (0, import_react8.useState)(false);
  const [inputValue, setInputValue] = (0, import_react8.useState)("");
  const hoverTimeoutRef = (0, import_react8.useRef)(null);
  const pointerDownPos = (0, import_react8.useRef)(null);
  const isClickRef = (0, import_react8.useRef)(true);
  const animRef = (0, import_react8.useRef)(null);
  const wrapperRectRef = (0, import_react8.useRef)(null);
  const scaleRef = (0, import_react8.useRef)(1);
  const wheelValueRef = (0, import_react8.useRef)(value);
  wheelValueRef.current = value;
  const fineRef = (0, import_react8.useRef)(null);
  const dragValueRef = (0, import_react8.useRef)(value);
  const percentage = (value - min) / (max - min) * 100;
  const isActive = isInteracting || isHovered;
  const fillPercent = (0, import_react9.useMotionValue)(percentage);
  const fillExtent = (0, import_react9.useTransform)(
    fillPercent,
    (pct) => hasOrigin ? `${Math.abs(pct - originPercent)}%` : `${pct}%`
  );
  const fillStart = (0, import_react9.useTransform)(
    fillPercent,
    (pct) => hasOrigin ? `${Math.min(pct, originPercent)}%` : "0%"
  );
  const handleLeft = (0, import_react9.useTransform)(
    fillPercent,
    (pct) => `min(calc(100% - 1px), max(0px, calc(${pct}% - 0.5px)))`
  );
  const rubberStretchPx = (0, import_react9.useMotionValue)(0);
  const rubberBandSize = (0, import_react9.useTransform)(
    rubberStretchPx,
    (stretch) => `calc(100% + ${Math.abs(stretch)}px)`
  );
  const rubberBandShift = (0, import_react9.useTransform)(
    rubberStretchPx,
    (stretch) => stretch < 0 ? stretch : 0
  );
  (0, import_react8.useEffect)(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage);
    }
  }, [percentage, isInteracting, fillPercent]);
  const trackExtent = (0, import_react8.useCallback)(() => {
    const el = wrapperRef.current;
    if (!el) return 0;
    return isVertical ? el.offsetHeight : el.offsetWidth;
  }, [isVertical]);
  const positionToValue = (0, import_react8.useCallback)(
    (clientX, clientY) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value;
      const screenPos = isVertical ? clientY - rect.top : clientX - rect.left;
      const scenePos = screenPos / scaleRef.current;
      const nativeExtent = trackExtent() || (isVertical ? rect.height : rect.width);
      let percent = Math.max(0, Math.min(1, scenePos / nativeExtent));
      if (isVertical) percent = 1 - percent;
      const rawValue = min + percent * (max - min);
      return Math.max(min, Math.min(max, rawValue));
    },
    [min, max, value, isVertical, trackExtent]
  );
  const percentFromValue = (0, import_react8.useCallback)(
    (v) => (v - min) / (max - min) * 100,
    [min, max]
  );
  const applyDetent = (0, import_react8.useCallback)(
    (v) => {
      if (!hasOrigin) return v;
      const extent = trackExtent();
      if (extent <= 0) return v;
      const detentValue = DETENT_PX / extent * (max - min);
      return Math.abs(v - resolvedOrigin) <= detentValue ? resolvedOrigin : v;
    },
    [hasOrigin, max, min, resolvedOrigin, trackExtent]
  );
  const computeRubberStretch = (0, import_react8.useCallback)(
    (clientPos, sign) => {
      const rect = wrapperRectRef.current;
      if (!rect) return 0;
      const nearEdge = isVertical ? rect.top : rect.left;
      const farEdge = isVertical ? rect.bottom : rect.right;
      const distancePast = sign < 0 ? nearEdge - clientPos : clientPos - farEdge;
      const overflow = Math.max(0, distancePast - DEAD_ZONE);
      return sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1));
    },
    [isVertical]
  );
  const handlePointerDown = (0, import_react8.useCallback)(
    (e) => {
      if (showInput) return;
      if (e.metaKey) return;
      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      fineRef.current = null;
      dragValueRef.current = value;
      setIsInteracting(true);
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        const nativeExtent = trackExtent();
        const rectExtent = isVertical ? wrapperRectRef.current.height : wrapperRectRef.current.width;
        scaleRef.current = nativeExtent > 0 ? rectExtent / nativeExtent : 1;
      }
    },
    [showInput, isVertical, trackExtent, value]
  );
  const handlePointerMove = (0, import_react8.useCallback)(
    (e) => {
      if (!isInteracting || !pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickRef.current && distance > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsDragging(true);
      }
      if (!isClickRef.current) {
        const rect = wrapperRectRef.current;
        if (rect) {
          const clientPos = isVertical ? e.clientY : e.clientX;
          const nearEdge = isVertical ? rect.top : rect.left;
          const farEdge = isVertical ? rect.bottom : rect.right;
          if (clientPos < nearEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, -1));
          } else if (clientPos > farEdge) {
            rubberStretchPx.jump(computeRubberStretch(clientPos, 1));
          } else {
            rubberStretchPx.jump(0);
          }
        }
        const pos = isVertical ? -e.clientY : e.clientX;
        if (e.shiftKey ? !fineRef.current?.shift : fineRef.current?.shift) {
          fineRef.current = { shift: e.shiftKey, anchorValue: dragValueRef.current, anchorPos: pos };
        }
        const newValue = fineRef.current ? (0, import_shortcut_utils2.fineDragValue)({
          startValue: fineRef.current.anchorValue,
          startPos: fineRef.current.anchorPos,
          pos,
          extentPx: trackExtent() || 1,
          min,
          max,
          factor: fineRef.current.shift ? 0.1 : 1
        }) : applyDetent(positionToValue(e.clientX, e.clientY));
        const newPct = percentFromValue(newValue);
        if (animRef.current) {
          animRef.current.stop();
          animRef.current = null;
        }
        fillPercent.jump(newPct);
        const rounded = (0, import_shortcut_utils2.roundValue)(newValue, step);
        dragValueRef.current = rounded;
        onChange(rounded);
      }
    },
    [
      isInteracting,
      isVertical,
      positionToValue,
      percentFromValue,
      applyDetent,
      onChange,
      fillPercent,
      rubberStretchPx,
      computeRubberStretch,
      step,
      min,
      max,
      trackExtent
    ]
  );
  const handlePointerUp = (0, import_react8.useCallback)(
    (e) => {
      if (!isInteracting) return;
      if (isClickRef.current) {
        const rawValue = positionToValue(e.clientX, e.clientY);
        const discreteSteps2 = (max - min) / step;
        const snappedValue = discreteSteps2 <= 10 ? Math.max(min, Math.min(max, min + Math.round((rawValue - min) / step) * step)) : (0, import_shortcut_utils2.snapToDecile)(rawValue, min, max);
        const newPct = percentFromValue(snappedValue);
        if (animRef.current) {
          animRef.current.stop();
        }
        animRef.current = (0, import_react9.animate)(fillPercent, newPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            animRef.current = null;
          }
        });
        onChange((0, import_shortcut_utils2.roundValue)(snappedValue, step));
      }
      if (rubberStretchPx.get() !== 0) {
        (0, import_react9.animate)(rubberStretchPx, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15
        });
      }
      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
      fineRef.current = null;
    },
    [
      isInteracting,
      positionToValue,
      percentFromValue,
      onChange,
      min,
      max,
      step,
      fillPercent,
      rubberStretchPx
    ]
  );
  (0, import_react8.useEffect)(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (showInput) return;
      e.preventDefault();
      e.stopPropagation();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (raw === 0) return;
      const stepMultiplier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const delta = (raw > 0 ? 1 : -1) * step * stepMultiplier;
      const next = (0, import_shortcut_utils2.roundValue)(
        Math.max(min, Math.min(max, wheelValueRef.current + delta)),
        step
      );
      wheelValueRef.current = next;
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
      fillPercent.jump(percentFromValue(next));
      onChange(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [showInput, min, max, step, onChange, fillPercent, percentFromValue]);
  (0, import_react8.useEffect)(() => {
    if (!isHovered) {
      setIsMetaHeld(false);
      return;
    }
    const sync = (e) => setIsMetaHeld(e.metaKey);
    const clear = () => setIsMetaHeld(false);
    window.addEventListener("keydown", sync);
    window.addEventListener("keyup", sync);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", sync);
      window.removeEventListener("keyup", sync);
      window.removeEventListener("blur", clear);
    };
  }, [isHovered]);
  (0, import_react8.useEffect)(() => {
    if (isValueHovered && !showInput && !isValueEditable) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsValueEditable(true);
      }, 800);
    } else if (!isValueHovered && !showInput) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsValueEditable(false);
    }
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isValueHovered, showInput, isValueEditable]);
  (0, import_react8.useEffect)(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange((0, import_shortcut_utils2.roundValue)(clamped, step));
    }
    setShowInput(false);
    setIsValueHovered(false);
    setIsValueEditable(false);
  };
  const handleValueClick = (e) => {
    if (isValueEditable || e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      setShowInput(true);
      setInputValue(value.toFixed((0, import_shortcut_utils2.decimalsForStep)(step)));
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setIsValueHovered(false);
    }
  };
  const handleInputBlur = () => {
    handleInputSubmit();
  };
  const displayValue = formatValue ? formatValue(value) : value.toFixed((0, import_shortcut_utils2.decimalsForStep)(step));
  const discreteSteps = (max - min) / step;
  const hashMarks = discreteSteps <= 10 ? Array.from({ length: discreteSteps - 1 }, (_, i) => {
    const pct = (i + 1) * step / (max - min) * 100;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        className: "tweakers-slider-hashmark",
        style: { left: `${pct}%` }
      },
      i
    );
  }) : Array.from({ length: 9 }, (_, i) => {
    const pct = (i + 1) * 10;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        className: "tweakers-slider-hashmark",
        style: { left: `${pct}%` }
      },
      i
    );
  });
  const cardClassName = [
    "tweakers-slider",
    isVertical ? "tweakers-slider-vertical" : "",
    isActive ? "tweakers-slider-active" : "",
    isInteracting ? "tweakers-slider-engaged" : "",
    isMetaHeld ? "tweakers-slider-text-mode" : ""
  ].filter(Boolean).join(" ");
  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    // Read ⌘ on entry too: the key listeners only exist while hovered, so a
    // key already held before the pointer arrived would otherwise go unseen.
    onMouseEnter: (e) => {
      setIsHovered(true);
      setIsMetaHeld(e.metaKey);
    },
    onMouseLeave: () => setIsHovered(false)
  };
  if (isVertical) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        ref: wrapperRef,
        className: "tweakers-slider-wrapper tweakers-slider-wrapper-vertical",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          import_react9.motion.div,
          {
            className: cardClassName,
            "data-origin": hasOrigin ? "true" : void 0,
            ...pointerHandlers,
            style: { height: rubberBandSize, y: rubberBandShift },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "tweakers-slider-fill-area", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                import_react9.motion.div,
                {
                  className: "tweakers-slider-fill-vertical",
                  style: { bottom: fillStart, height: fillExtent }
                }
              ) }),
              showInput ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  className: "tweakers-slider-input tweakers-slider-input-vertical",
                  value: inputValue,
                  onChange: handleInputChange,
                  onKeyDown: handleInputKeyDown,
                  onBlur: handleInputBlur,
                  onClick: (e) => e.stopPropagation(),
                  onMouseDown: (e) => e.stopPropagation()
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                "span",
                {
                  className: `tweakers-slider-value-vertical ${isValueEditable ? "tweakers-slider-value-editable" : ""}`,
                  onMouseEnter: () => setIsValueHovered(true),
                  onMouseLeave: () => setIsValueHovered(false),
                  onClick: handleValueClick,
                  onPointerDown: (e) => isValueEditable && e.stopPropagation(),
                  style: { cursor: isValueEditable || isMetaHeld ? "text" : "default" },
                  children: [
                    displayValue,
                    unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "tweakers-slider-unit", children: unit })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "tweakers-slider-label-vertical", children: [
                label,
                shortcut && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: (0, import_shortcut_utils2.formatSliderShortcut)(shortcut) })
              ] })
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { ref: wrapperRef, className: "tweakers-slider-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    import_react9.motion.div,
    {
      className: cardClassName,
      "data-origin": hasOrigin ? "true" : void 0,
      ...pointerHandlers,
      style: { width: rubberBandSize, x: rubberBandShift },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "tweakers-slider-track", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            import_react9.motion.div,
            {
              className: "tweakers-slider-fill",
              style: {
                left: fillStart,
                width: fillExtent
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            import_react9.motion.div,
            {
              className: "tweakers-slider-handle",
              style: { left: handleLeft },
              animate: { opacity: isDragging ? 0.9 : 0 },
              transition: { opacity: { duration: 0.15 } }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "tweakers-slider-hashmarks", children: hashMarks }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "tweakers-slider-label", children: [
          label,
          shortcut && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: (0, import_shortcut_utils2.formatSliderShortcut)(shortcut) })
        ] }),
        valueIcon != null ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "tweakers-slider-value tweakers-slider-value-icon", children: valueIcon }) : showInput ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "tweakers-slider-input",
            value: inputValue,
            onChange: handleInputChange,
            onKeyDown: handleInputKeyDown,
            onBlur: handleInputBlur,
            onClick: (e) => e.stopPropagation(),
            onMouseDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "span",
          {
            className: `tweakers-slider-value ${isValueEditable ? "tweakers-slider-value-editable" : ""}`,
            onMouseEnter: () => setIsValueHovered(true),
            onMouseLeave: () => setIsValueHovered(false),
            onClick: handleValueClick,
            onPointerDown: (e) => isValueEditable && e.stopPropagation(),
            style: { cursor: isValueEditable || isMetaHeld ? "text" : "default" },
            children: [
              displayValue,
              unit && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "tweakers-slider-unit", children: unit })
            ]
          }
        )
      ]
    }
  ) });
}

// src/components/AngleDial.tsx
var import_react10 = require("react");
var import_angle_core = require("tweakers/angle-core");
var import_jsx_runtime7 = require("react/jsx-runtime");
var RADIUS = 8.5;
var DEG = "\xB0";
function AngleDial({
  label,
  value,
  onChange,
  min = 0,
  max = 360,
  step = 1,
  unit,
  formatValue,
  origin,
  wrap
}) {
  const dialRef = (0, import_react10.useRef)(null);
  const [isDragging, setIsDragging] = (0, import_react10.useState)(false);
  const wraps = wrap ?? Math.abs(max - min) >= 360;
  const resolvedOrigin = Math.min(max, Math.max(min, origin ?? min));
  const bearing = (0, import_angle_core.valueToBearing)(value, min, max);
  const originBearing = (0, import_angle_core.valueToBearing)(resolvedOrigin, min, max);
  const needle = (bearing - 90) * Math.PI / 180;
  const applyFromPointer = (0, import_react10.useCallback)((clientX, clientY) => {
    const el = dialRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = (0, import_angle_core.angleFromPointer)(
      clientX - (r.left + r.width / 2),
      clientY - (r.top + r.height / 2),
      value,
      min,
      max,
      step,
      wraps
    );
    if (next !== null && next !== value) onChange(next);
  }, [value, min, max, step, wraps, onChange]);
  const onPointerDown = (e) => {
    e.preventDefault();
    e.target.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    applyFromPointer(e.clientX, e.clientY);
  };
  (0, import_react10.useEffect)(() => {
    if (!isDragging) return;
    const move = (e) => applyFromPointer(e.clientX, e.clientY);
    const up = () => setIsDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [isDragging, applyFromPointer]);
  const onKeyDown = (e) => {
    const dir = e.key === "ArrowUp" || e.key === "ArrowRight" ? 1 : e.key === "ArrowDown" || e.key === "ArrowLeft" ? -1 : 0;
    if (dir) {
      e.preventDefault();
      onChange((0, import_angle_core.nudgeAngle)(value, dir * (e.shiftKey ? 10 : 1), min, max, step, wraps));
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange((0, import_angle_core.snapAngle)(resolvedOrigin, min, step));
    }
  };
  const text = formatValue ? formatValue(value) : `${Number(value.toFixed(2))}${unit ?? (Math.abs(max - min) >= 180 ? DEG : "")}`;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "tweakers-angle-control", "data-dragging": isDragging || void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        ref: dialRef,
        className: "tweakers-angle-dial",
        role: "slider",
        tabIndex: 0,
        "aria-label": label,
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": value,
        "aria-valuetext": text,
        onPointerDown,
        onKeyDown,
        onDoubleClick: () => onChange((0, import_angle_core.snapAngle)(resolvedOrigin, min, step)),
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("svg", { viewBox: "-12 -12 24 24", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("circle", { className: "tweakers-angle-face", cx: "0", cy: "0", r: RADIUS }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { className: "tweakers-angle-sweep", d: (0, import_angle_core.arcPath)(originBearing, bearing, RADIUS) }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "line",
            {
              className: "tweakers-angle-needle",
              x1: "0",
              y1: "0",
              x2: (RADIUS * Math.cos(needle)).toFixed(3),
              y2: (RADIUS * Math.sin(needle)).toFixed(3)
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "tweakers-angle-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "tweakers-angle-value", children: text })
  ] });
}

// src/components/TransferCurve.tsx
var import_react11 = require("react");
var import_transfer_core2 = require("tweakers/transfer-core");
var import_jsx_runtime8 = require("react/jsx-runtime");
var PLOT = 100;
var GRAB_PX = 9;
var DROP_PX = 26;
var SAMPLES = 96;
function TransferCurve({ label, value, onChange, height = 104, grid = 4, axisLabels }) {
  const boxRef = (0, import_react11.useRef)(null);
  const [dragIndex, setDragIndex] = (0, import_react11.useState)(null);
  const [hoverIndex, setHoverIndex] = (0, import_react11.useState)(null);
  const [dropping, setDropping] = (0, import_react11.useState)(false);
  const points = (0, import_transfer_core2.normalizeTransfer)(value).points;
  const h = Math.min(200, Math.max(64, height));
  const path = (0, import_react11.useMemo)(() => {
    let d = "";
    for (let i = 0; i < SAMPLES; i++) {
      const x = i / (SAMPLES - 1);
      const y = (0, import_transfer_core2.sampleTransfer)(points, x);
      d += `${i ? "L" : "M"} ${(x * PLOT).toFixed(2)} ${((1 - y) * PLOT).toFixed(2)} `;
    }
    return d.trim();
  }, [points]);
  const toCurve = (0, import_react11.useCallback)((clientX, clientY) => {
    const r = boxRef.current.getBoundingClientRect();
    return {
      x: (clientX - r.left) / r.width,
      y: 1 - (clientY - r.top) / r.height,
      outside: Math.max(
        r.left - clientX,
        clientX - r.right,
        r.top - clientY,
        clientY - r.bottom
      ) > DROP_PX,
      rect: r
    };
  }, []);
  const onPointerDown = (e) => {
    e.preventDefault();
    const { x, y, rect } = toCurve(e.clientX, e.clientY);
    const hit = (0, import_transfer_core2.nearestPoint)(points, x, y, GRAB_PX / Math.min(rect.width, rect.height));
    if (hit >= 0) {
      setDragIndex(hit);
      return;
    }
    if (points.length >= import_transfer_core2.TRANSFER_MAX_POINTS) return;
    const { points: next, index } = (0, import_transfer_core2.insertPoint)(points, x, y);
    onChange({ points: next });
    setDragIndex(index);
  };
  (0, import_react11.useEffect)(() => {
    if (dragIndex === null) return;
    const move = (e) => {
      const { x, y, outside } = toCurve(e.clientX, e.clientY);
      const removable = dragIndex > 0 && dragIndex < points.length - 1;
      setDropping(outside && removable);
      onChange({ points: (0, import_transfer_core2.movePoint)(points, dragIndex, x, y) });
    };
    const up = (e) => {
      const { outside } = toCurve(e.clientX, e.clientY);
      if (outside && dragIndex > 0 && dragIndex < points.length - 1) {
        onChange({ points: (0, import_transfer_core2.removePoint)(points, dragIndex) });
      }
      setDragIndex(null);
      setDropping(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragIndex, points, onChange, toCurve]);
  const onHover = (e) => {
    if (dragIndex !== null) return;
    const { x, y, rect } = toCurve(e.clientX, e.clientY);
    setHoverIndex((0, import_transfer_core2.nearestPoint)(points, x, y, GRAB_PX / Math.min(rect.width, rect.height)));
  };
  const reset = () => onChange({ points: import_transfer_core2.DEFAULT_TRANSFER.points.map((p) => ({ ...p })) });
  const lines = grid > 0 ? Array.from({ length: grid - 1 }, (_, i) => (i + 1) * PLOT / grid) : [];
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "tweakers-transfer-control", "data-idle": (0, import_transfer_core2.isIdentityTransfer)(points) || void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "tweakers-transfer-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "tweakers-transfer-label", children: label }),
      axisLabels?.y ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "tweakers-transfer-axis", children: axisLabels.y }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "div",
      {
        ref: boxRef,
        className: "tweakers-transfer-box",
        "data-dropping": dropping || void 0,
        style: { height: h },
        role: "application",
        "aria-label": `${label} curve, ${points.length} points`,
        onPointerDown,
        onPointerMove: onHover,
        onPointerLeave: () => setHoverIndex(null),
        onDoubleClick: reset,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("svg", { viewBox: `0 0 ${PLOT} ${PLOT}`, preserveAspectRatio: "none", "aria-hidden": "true", children: [
            lines.map((p) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { className: "tweakers-transfer-grid", x1: p, y1: "0", x2: p, y2: PLOT }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { className: "tweakers-transfer-grid", x1: "0", y1: p, x2: PLOT, y2: p })
            ] }, p)),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { className: "tweakers-transfer-unity", x1: "0", y1: PLOT, x2: PLOT, y2: "0" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { className: "tweakers-transfer-stroke", d: path, vectorEffect: "non-scaling-stroke" })
          ] }),
          points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "span",
            {
              className: "tweakers-transfer-point",
              "data-active": dragIndex === i || hoverIndex === i || void 0,
              "data-end": i === 0 || i === points.length - 1 || void 0,
              style: { left: `${p.x * 100}%`, top: `${(1 - p.y) * 100}%` }
            },
            i
          ))
        ]
      }
    ),
    axisLabels?.x ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "tweakers-transfer-axis-x", children: axisLabels.x }) : null
  ] });
}

// src/components/NumberControl.tsx
var import_react12 = require("react");
var import_shortcut_utils3 = require("tweakers/shortcut-utils");
var import_jsx_runtime9 = require("react/jsx-runtime");
var CLICK_THRESHOLD2 = 3;
function NumberControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  unit,
  formatValue,
  orientation = "horizontal"
}) {
  const isVertical = orientation === "vertical";
  const inputRef = (0, import_react12.useRef)(null);
  const [isScrubbing, setIsScrubbing] = (0, import_react12.useState)(false);
  const [showInput, setShowInput] = (0, import_react12.useState)(false);
  const [inputValue, setInputValue] = (0, import_react12.useState)("");
  const pointerDownPos = (0, import_react12.useRef)(null);
  const isClickRef = (0, import_react12.useRef)(true);
  const scrubStartValue = (0, import_react12.useRef)(0);
  const isPointerHeld = (0, import_react12.useRef)(false);
  const clamp4 = (0, import_react12.useCallback)(
    (v) => {
      let out = v;
      if (min != null) out = Math.max(min, out);
      if (max != null) out = Math.min(max, out);
      return out;
    },
    [min, max]
  );
  const handlePointerDown = (0, import_react12.useCallback)(
    (e) => {
      if (showInput) return;
      if (e.metaKey) return;
      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      isPointerHeld.current = true;
      scrubStartValue.current = value;
    },
    [showInput, value]
  );
  const handlePointerMove = (0, import_react12.useCallback)(
    (e) => {
      if (!isPointerHeld.current || !pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickRef.current && distance > CLICK_THRESHOLD2) {
        isClickRef.current = false;
        setIsScrubbing(true);
      }
      if (!isClickRef.current) {
        const travel = isVertical ? -dy : dx;
        const perPixel = step * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);
        const next = clamp4(scrubStartValue.current + travel * perPixel);
        onChange((0, import_shortcut_utils3.roundValue)(next, step));
      }
    },
    [isVertical, step, clamp4, onChange]
  );
  const handlePointerUp = (0, import_react12.useCallback)(() => {
    if (!isPointerHeld.current) return;
    if (isClickRef.current) {
      setShowInput(true);
      setInputValue(value.toFixed((0, import_shortcut_utils3.decimalsForStep)(step)));
    }
    isPointerHeld.current = false;
    pointerDownPos.current = null;
    setIsScrubbing(false);
  }, [value, step]);
  (0, import_react12.useEffect)(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);
  const handleInputSubmit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onChange((0, import_shortcut_utils3.roundValue)(clamp4(parsed), step));
    }
    setShowInput(false);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "Escape") {
      setShowInput(false);
    }
  };
  const displayValue = formatValue ? formatValue(value) : value.toFixed((0, import_shortcut_utils3.decimalsForStep)(step));
  const className = [
    "tweakers-number-control",
    isVertical ? "tweakers-number-control-vertical" : "",
    isScrubbing ? "tweakers-number-control-engaged" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "div",
    {
      className,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "tweakers-number-label", children: label }),
        showInput ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "tweakers-number-input",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyDown: handleInputKeyDown,
            onBlur: handleInputSubmit,
            onClick: (e) => e.stopPropagation(),
            onPointerDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "tweakers-number-value", children: [
          displayValue,
          unit && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "tweakers-number-unit", children: unit })
        ] })
      ]
    }
  );
}

// src/components/RangeSlider.tsx
var import_react13 = require("react");
var import_react14 = require("motion/react");
var import_range_slider_core = require("tweakers/range-slider-core");
var import_shortcut_utils4 = require("tweakers/shortcut-utils");
var import_jsx_runtime10 = require("react/jsx-runtime");
var CLICK_THRESHOLD3 = 3;
var HANDLE_HIT_PX = 12;
function RangeSlider({
  label,
  value: rawValue,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  defaultValue
}) {
  const wrapperRef = (0, import_react13.useRef)(null);
  const trackRef = (0, import_react13.useRef)(null);
  const inputRef = (0, import_react13.useRef)(null);
  const [isInteracting, setIsInteracting] = (0, import_react13.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react13.useState)(false);
  const [isHovered, setIsHovered] = (0, import_react13.useState)(false);
  const [editing, setEditing] = (0, import_react13.useState)(null);
  const [inputValue, setInputValue] = (0, import_react13.useState)("");
  const pointerDownPos = (0, import_react13.useRef)(null);
  const isClickRef = (0, import_react13.useRef)(true);
  const dragTargetRef = (0, import_react13.useRef)(null);
  const clickMovesRef = (0, import_react13.useRef)(false);
  const dragStartValueRef = (0, import_react13.useRef)(rawValue);
  const dragStartValueAtRef = (0, import_react13.useRef)(0);
  const fineRef = (0, import_react13.useRef)(null);
  const dragValueRef = (0, import_react13.useRef)(rawValue);
  const lowAnimRef = (0, import_react13.useRef)(null);
  const highAnimRef = (0, import_react13.useRef)(null);
  const stopAnims = (0, import_react13.useCallback)(() => {
    lowAnimRef.current?.stop();
    highAnimRef.current?.stop();
    lowAnimRef.current = null;
    highAnimRef.current = null;
  }, []);
  const wrapperRectRef = (0, import_react13.useRef)(null);
  const scaleRef = (0, import_react13.useRef)(1);
  const value = isInteracting ? rawValue : (0, import_range_slider_core.clampRange)(rawValue, min, max);
  const span = max - min;
  const lowPercent = span === 0 ? 0 : (value.min - min) / span * 100;
  const highPercent = span === 0 ? 0 : (value.max - min) / span * 100;
  const isActive = isInteracting || isHovered;
  const lowMotion = (0, import_react14.useMotionValue)(lowPercent);
  const highMotion = (0, import_react14.useMotionValue)(highPercent);
  const fillLeft = (0, import_react14.useTransform)(lowMotion, (pct) => `${pct}%`);
  const fillWidth = (0, import_react14.useTransform)(
    [lowMotion, highMotion],
    ([lo, hi]) => `${Math.max(0, hi - lo)}%`
  );
  const lowHandleLeft = (0, import_react14.useTransform)([lowMotion, highMotion], ([lo, hi]) => (0, import_range_slider_core.handleLeftStyles)(lo, hi).low);
  const highHandleLeft = (0, import_react14.useTransform)([lowMotion, highMotion], ([lo, hi]) => (0, import_range_slider_core.handleLeftStyles)(lo, hi).high);
  (0, import_react13.useEffect)(() => {
    if (!isInteracting && !lowAnimRef.current && !highAnimRef.current) {
      lowMotion.jump(lowPercent);
      highMotion.jump(highPercent);
    }
  }, [lowPercent, highPercent, isInteracting, lowMotion, highMotion]);
  const positionToValue = (0, import_react13.useCallback)(
    (clientX) => {
      const rect = wrapperRectRef.current;
      if (!rect) return value.min;
      const screenX = clientX - rect.left;
      const sceneX = screenX / scaleRef.current;
      const nativeWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : rect.width;
      const percent = Math.max(0, Math.min(1, sceneX / nativeWidth));
      const rawValue2 = min + percent * (max - min);
      return Math.max(min, Math.min(max, rawValue2));
    },
    [min, max, value.min]
  );
  const percentFromValue = (0, import_react13.useCallback)(
    (v) => span === 0 ? 0 : (v - min) / span * 100,
    [min, span]
  );
  const syncMotion = (0, import_react13.useCallback)(
    (next) => {
      lowMotion.jump(percentFromValue(next.min));
      highMotion.jump(percentFromValue(next.max));
    },
    [lowMotion, highMotion, percentFromValue]
  );
  const handlePointerDown = (0, import_react13.useCallback)(
    (e) => {
      if (editing) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      pointerDownPos.current = { x: e.clientX, y: e.clientY };
      isClickRef.current = true;
      setIsInteracting(true);
      if (wrapperRef.current) {
        wrapperRectRef.current = wrapperRef.current.getBoundingClientRect();
        const nativeWidth = wrapperRef.current.offsetWidth;
        scaleRef.current = wrapperRectRef.current.width / nativeWidth;
      }
      const atValue = positionToValue(e.clientX);
      const trackW = wrapperRef.current?.offsetWidth ?? 1;
      const hitV = HANDLE_HIT_PX / trackW * (max - min);
      const target = (0, import_range_slider_core.pickDragTarget)(atValue, value, hitV);
      dragTargetRef.current = target;
      clickMovesRef.current = target !== "span" && (0, import_range_slider_core.isOutsideSpan)(atValue, value);
      dragStartValueRef.current = value;
      dragStartValueAtRef.current = atValue;
      fineRef.current = null;
      dragValueRef.current = value;
    },
    [editing, positionToValue, value, min, max]
  );
  const handlePointerMove = (0, import_react13.useCallback)(
    (e) => {
      if (!isInteracting || !pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (isClickRef.current && distance > CLICK_THRESHOLD3) {
        isClickRef.current = false;
        setIsDragging(true);
      }
      if (isClickRef.current) return;
      if (e.shiftKey ? !fineRef.current?.shift : fineRef.current?.shift) {
        fineRef.current = { shift: e.shiftKey, anchorRange: dragValueRef.current, anchorPos: e.clientX };
      }
      const target = dragTargetRef.current;
      let next;
      if (fineRef.current) {
        const f = fineRef.current;
        const extent = wrapperRef.current?.offsetWidth ?? 1;
        const fineAt = (start) => (0, import_shortcut_utils4.roundValue)(
          (0, import_shortcut_utils4.fineDragValue)({
            startValue: start,
            startPos: f.anchorPos,
            pos: e.clientX,
            extentPx: extent,
            min,
            max,
            factor: f.shift ? 0.1 : 1
          }),
          step
        );
        if (target === "span") {
          next = (0, import_range_slider_core.shiftSpan)(fineAt(f.anchorRange.min) - f.anchorRange.min, f.anchorRange, min, max);
        } else if (target === "min") {
          next = (0, import_range_slider_core.setLow)(fineAt(f.anchorRange.min), value, min);
        } else {
          next = (0, import_range_slider_core.setHigh)(fineAt(f.anchorRange.max), value, max);
        }
      } else {
        const raw = (0, import_shortcut_utils4.roundValue)(positionToValue(e.clientX), step);
        if (target === "span") {
          const delta = raw - (0, import_shortcut_utils4.roundValue)(dragStartValueAtRef.current, step);
          next = (0, import_range_slider_core.shiftSpan)(delta, dragStartValueRef.current, min, max);
        } else if (target === "min") {
          next = (0, import_range_slider_core.setLow)(raw, value, min);
        } else {
          next = (0, import_range_slider_core.setHigh)(raw, value, max);
        }
      }
      stopAnims();
      syncMotion(next);
      dragValueRef.current = next;
      onChange(next);
    },
    [isInteracting, positionToValue, step, min, max, value, syncMotion, onChange, stopAnims]
  );
  const handlePointerUp = (0, import_react13.useCallback)(
    (e) => {
      if (!isInteracting) return;
      if (isClickRef.current && clickMovesRef.current) {
        const raw = (0, import_shortcut_utils4.roundValue)(positionToValue(e.clientX), step);
        const which = dragTargetRef.current ?? (0, import_range_slider_core.nearestHandle)(raw, value);
        const next = which === "min" ? (0, import_range_slider_core.setLow)(raw, value, min) : (0, import_range_slider_core.setHigh)(raw, value, max);
        const motion14 = which === "min" ? lowMotion : highMotion;
        const targetPct = percentFromValue(which === "min" ? next.min : next.max);
        stopAnims();
        const anim = (0, import_react14.animate)(motion14, targetPct, {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          onComplete: () => {
            if (which === "min") lowAnimRef.current = null;
            else highAnimRef.current = null;
          }
        });
        if (which === "min") lowAnimRef.current = anim;
        else highAnimRef.current = anim;
        onChange(next);
      }
      setIsInteracting(false);
      setIsDragging(false);
      pointerDownPos.current = null;
      dragTargetRef.current = null;
      fineRef.current = null;
    },
    [isInteracting, positionToValue, step, value, min, max, lowMotion, highMotion, percentFromValue, onChange, stopAnims]
  );
  const handlePointerCancel = (0, import_react13.useCallback)(() => {
    if (!isInteracting) return;
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPos.current = null;
    dragTargetRef.current = null;
    fineRef.current = null;
  }, [isInteracting]);
  const handleDoubleClick = (0, import_react13.useCallback)(() => {
    if (editing !== null) return;
    const d = (0, import_range_slider_core.clampRange)(defaultValue ?? { min, max }, min, max);
    stopAnims();
    lowAnimRef.current = (0, import_react14.animate)(lowMotion, percentFromValue(d.min), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        lowAnimRef.current = null;
      }
    });
    highAnimRef.current = (0, import_react14.animate)(highMotion, percentFromValue(d.max), {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      onComplete: () => {
        highAnimRef.current = null;
      }
    });
    onChange(d);
  }, [editing, defaultValue, min, max, lowMotion, highMotion, percentFromValue, onChange, stopAnims]);
  (0, import_react13.useEffect)(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);
  const decimals = (0, import_shortcut_utils4.decimalsForStep)(step);
  const openEditor = (0, import_react13.useCallback)(
    (which) => {
      setEditing(which);
      setInputValue((which === "min" ? value.min : value.max).toFixed(decimals));
    },
    [value.min, value.max, decimals]
  );
  const commitEditor = (0, import_react13.useCallback)(() => {
    if (!editing) return;
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const rounded = (0, import_shortcut_utils4.roundValue)(parsed, step);
      const next = editing === "min" ? (0, import_range_slider_core.setLow)(rounded, value, min) : (0, import_range_slider_core.setHigh)(rounded, value, max);
      onChange(next);
    }
    setEditing(null);
  }, [editing, inputValue, step, value, min, max, onChange]);
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      commitEditor();
    } else if (e.key === "Escape") {
      setEditing(null);
    }
  };
  const lowText = value.min.toFixed(decimals);
  const highText = value.max.toFixed(decimals);
  const restOpacity = 0.35;
  const lowOpacity = !isActive ? restOpacity : isDragging && dragTargetRef.current === "min" ? 0.95 : 0.7;
  const highOpacity = !isActive ? restOpacity : isDragging && dragTargetRef.current === "max" ? 0.95 : 0.7;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { ref: wrapperRef, className: "tweakers-range-slider-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    import_react14.motion.div,
    {
      ref: trackRef,
      className: `tweakers-range-slider ${isActive ? "tweakers-range-slider-active" : ""}`,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onDoubleClick: handleDoubleClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          import_react14.motion.div,
          {
            className: "tweakers-range-slider-fill",
            style: { left: fillLeft, width: fillWidth }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          import_react14.motion.div,
          {
            className: "tweakers-range-slider-handle",
            style: { left: lowHandleLeft, y: "-50%" },
            animate: { opacity: lowOpacity },
            transition: { opacity: { duration: 0.15 } }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          import_react14.motion.div,
          {
            className: "tweakers-range-slider-handle",
            style: { left: highHandleLeft, y: "-50%" },
            animate: { opacity: highOpacity },
            transition: { opacity: { duration: 0.15 } }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "tweakers-range-slider-label", children: label }),
        editing !== null ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: "tweakers-range-slider-input",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyDown: handleInputKeyDown,
            onBlur: commitEditor,
            onClick: (e) => e.stopPropagation(),
            onPointerDown: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: "tweakers-range-slider-value", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "span",
            {
              className: "tweakers-range-slider-bound",
              onClick: (e) => {
                e.stopPropagation();
                openEditor("min");
              },
              onPointerDown: (e) => e.stopPropagation(),
              children: lowText
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "tweakers-range-slider-dash", children: "\u2013" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "span",
            {
              className: "tweakers-range-slider-bound",
              onClick: (e) => {
                e.stopPropagation();
                openEditor("max");
              },
              onPointerDown: (e) => e.stopPropagation(),
              children: highText
            }
          )
        ] })
      ]
    }
  ) });
}

// src/components/Toggle.tsx
var import_shortcut_utils5 = require("tweakers/shortcut-utils");
var import_jsx_runtime11 = require("react/jsx-runtime");
function Toggle({ label, checked, onChange, shortcut, shortcutActive }) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "tweakers-labeled-control tweakers-labeled-control-check", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Checkbox, { checked, onChange, label }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: "tweakers-labeled-control-label", children: [
      label,
      shortcut && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: (0, import_shortcut_utils5.formatToggleShortcut)(shortcut) })
    ] })
  ] });
}

// src/components/SegmentedControl.tsx
var import_react15 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
function SegmentedControl({
  options,
  value,
  onChange
}) {
  const containerRef = (0, import_react15.useRef)(null);
  const hasAnimated = (0, import_react15.useRef)(false);
  const [pillStyle, setPillStyle] = (0, import_react15.useState)(null);
  const measure = (0, import_react15.useCallback)(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeButton = container.querySelector('[data-active="true"]');
    if (!activeButton || activeButton.offsetWidth === 0) return;
    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
      top: activeButton.offsetTop,
      height: activeButton.offsetHeight
    });
  }, []);
  (0, import_react15.useLayoutEffect)(() => {
    measure();
  }, [value, options.length, measure]);
  (0, import_react15.useLayoutEffect)(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);
  const shouldAnimate = hasAnimated.current;
  hasAnimated.current = true;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "tweakers-segmented", ref: containerRef, children: [
    pillStyle && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "div",
      {
        className: "tweakers-segmented-pill",
        style: {
          left: pillStyle.left,
          width: pillStyle.width,
          top: pillStyle.top,
          height: pillStyle.height,
          bottom: "auto",
          transition: shouldAnimate ? "left 0.2s cubic-bezier(0.25, 1, 0.5, 1), width 0.2s cubic-bezier(0.25, 1, 0.5, 1), top 0.2s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
        }
      }
    ),
    options.map((option) => {
      const isActive = value === option.value;
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "button",
        {
          onClick: () => onChange(option.value),
          className: "tweakers-segmented-button",
          "data-active": String(isActive),
          children: option.label
        },
        option.value
      );
    })
  ] });
}

// src/components/SpringControl.tsx
var import_store5 = require("tweakers/store");

// src/components/SpringVisualization.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function generateSpringCurve(stiffness, damping, mass, duration) {
  const points = [];
  const steps = 100;
  const dt = duration / steps;
  let position = 0;
  let velocity = 0;
  const target = 1;
  for (let i = 0; i <= steps; i++) {
    const time = i * dt;
    points.push([time, position]);
    const springForce = -stiffness * (position - target);
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;
    velocity += acceleration * dt;
    position += velocity * dt;
  }
  return points;
}
function SpringVisualization({ spring, isSimpleMode }) {
  const width = 256;
  const height = 140;
  let stiffness;
  let damping;
  let mass;
  if (isSimpleMode) {
    const visualDuration = spring.visualDuration ?? 0.3;
    const bounce = spring.bounce ?? 0.2;
    mass = 1;
    stiffness = 2 * Math.PI / visualDuration;
    stiffness = Math.pow(stiffness, 2);
    const dampingRatio = 1 - bounce;
    damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);
  } else {
    stiffness = spring.stiffness ?? 400;
    damping = spring.damping ?? 17;
    mass = spring.mass ?? 1;
  }
  const duration = 2;
  const points = generateSpringCurve(stiffness, damping, mass, duration);
  const values = points.map(([, value]) => value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  const pathData = points.map(([time, value], i) => {
    const x = time / duration * width;
    const normalizedValue = (value - minValue) / (valueRange || 1);
    const y = height - (normalizedValue * height * 0.6 + height * 0.2);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  const gridLines = [];
  for (let i = 1; i < 4; i++) {
    const x = width / 4 * i;
    const y = height / 4 * i;
    gridLines.push(
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("line", { x1: x, y1: 0, x2: x, y2: height, stroke: "rgba(255, 255, 255, 0.08)", strokeWidth: "1" }, `v-${i}`),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("line", { x1: 0, y1: y, x2: width, y2: y, stroke: "rgba(255, 255, 255, 0.08)", strokeWidth: "1" }, `h-${i}`)
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("svg", { viewBox: `0 0 ${width} ${height}`, className: "tweakers-spring-viz", children: [
    gridLines,
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "line",
      {
        x1: 0,
        y1: height / 2,
        x2: width,
        y2: height / 2,
        stroke: "rgba(255, 255, 255, 0.15)",
        strokeWidth: "1",
        strokeDasharray: "4,4"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "path",
      {
        d: pathData,
        fill: "none",
        stroke: "rgba(255, 255, 255, 0.6)",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] });
}

// src/components/SpringControl.tsx
var import_react16 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
function SpringControl({ panelId, path, label, spring, onChange }) {
  const mode = (0, import_react16.useSyncExternalStore)(
    (cb) => import_store5.TweakStore.subscribe(panelId, cb),
    () => import_store5.TweakStore.getSpringMode(panelId, path),
    () => import_store5.TweakStore.getSpringMode(panelId, path)
  );
  const isSimpleMode = mode === "simple";
  const cache = (0, import_react16.useRef)({
    simple: spring.visualDuration !== void 0 ? spring : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
    advanced: spring.stiffness !== void 0 ? spring : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
  });
  if (isSimpleMode) {
    cache.current.simple = spring;
  } else {
    cache.current.advanced = spring;
  }
  const handleModeChange = (newMode) => {
    import_store5.TweakStore.updateSpringMode(panelId, path, newMode);
    if (newMode === "simple") {
      onChange(cache.current.simple);
    } else {
      onChange(cache.current.advanced);
    }
  };
  const handleUpdate = (key, value) => {
    if (isSimpleMode) {
      const { stiffness, damping, mass, ...rest } = spring;
      onChange({ ...rest, [key]: value });
    } else {
      const { visualDuration, bounce, ...rest } = spring;
      onChange({ ...rest, [key]: value });
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Folder, { title: label, defaultOpen: true, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SpringVisualization, { spring, isSimpleMode }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "tweakers-labeled-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "tweakers-labeled-control-label", children: "Type" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        SegmentedControl,
        {
          options: [
            { value: "simple", label: "Time" },
            { value: "advanced", label: "Physics" }
          ],
          value: mode,
          onChange: handleModeChange
        }
      )
    ] }),
    isSimpleMode ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        Slider,
        {
          label: "Duration",
          value: spring.visualDuration ?? 0.3,
          onChange: (v) => handleUpdate("visualDuration", v),
          min: 0.1,
          max: 1,
          step: 0.05,
          unit: "s"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        Slider,
        {
          label: "Bounce",
          value: spring.bounce ?? 0.2,
          onChange: (v) => handleUpdate("bounce", v),
          min: 0,
          max: 1,
          step: 0.05
        }
      )
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        Slider,
        {
          label: "Stiffness",
          value: spring.stiffness ?? 400,
          onChange: (v) => handleUpdate("stiffness", v),
          min: 1,
          max: 1e3,
          step: 10
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        Slider,
        {
          label: "Damping",
          value: spring.damping ?? 17,
          onChange: (v) => handleUpdate("damping", v),
          min: 1,
          max: 100,
          step: 1
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        Slider,
        {
          label: "Mass",
          value: spring.mass ?? 1,
          onChange: (v) => handleUpdate("mass", v),
          min: 0.1,
          max: 10,
          step: 0.1
        }
      )
    ] })
  ] }) });
}

// src/components/TransitionControl.tsx
var import_store6 = require("tweakers/store");

// src/components/EasingVisualization.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
function EasingVisualization({ easing }) {
  const ease = easing.ease;
  const s = 200;
  const pad = 10;
  const inner = s - pad * 2;
  const unit = inner / 2;
  const toSvg = (nx, ny) => ({
    x: pad + (nx + 0.5) * unit,
    y: pad + (1.5 - ny) * unit
  });
  const start = toSvg(0, 0);
  const end = toSvg(1, 1);
  const p1 = toSvg(ease[0], ease[1]);
  const p2 = toSvg(ease[2], ease[3]);
  const curvePath = `M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    "svg",
    {
      viewBox: `0 0 ${s} ${s}`,
      preserveAspectRatio: "xMidYMid slice",
      className: "tweakers-spring-viz tweakers-easing-viz",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "line",
          {
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
            stroke: "rgba(255, 255, 255, 0.15)",
            strokeWidth: "1",
            strokeDasharray: "4,4"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: curvePath, fill: "none", stroke: "rgba(255, 255, 255, 0.6)", strokeWidth: "2", strokeLinecap: "round" })
      ]
    }
  );
}

// src/components/TransitionControl.tsx
var import_react17 = require("react");
var import_jsx_runtime16 = require("react/jsx-runtime");
function TransitionControl({
  panelId,
  path,
  label,
  value,
  onChange,
  hideDuration = false,
  durationControl
}) {
  const mode = (0, import_react17.useSyncExternalStore)(
    (cb) => import_store6.TweakStore.subscribe(panelId, cb),
    () => import_store6.TweakStore.getTransitionMode(panelId, path),
    () => import_store6.TweakStore.getTransitionMode(panelId, path)
  );
  const isEasing = mode === "easing";
  const isSimpleSpring = mode === "simple";
  const cache = (0, import_react17.useRef)({
    easing: value.type === "easing" ? value : { type: "easing", duration: 0.3, ease: [1, -0.4, 0.5, 1] },
    simple: value.type === "spring" && value.visualDuration !== void 0 ? value : { type: "spring", visualDuration: 0.3, bounce: 0.2 },
    advanced: value.type === "spring" && value.stiffness !== void 0 ? value : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
  });
  if (isEasing && value.type === "easing") {
    cache.current.easing = value;
  } else if (isSimpleSpring && value.type === "spring") {
    cache.current.simple = value;
  } else if (mode === "advanced" && value.type === "spring") {
    cache.current.advanced = value;
  }
  const spring = value.type === "spring" ? value : cache.current.simple;
  const easing = value.type === "easing" ? value : cache.current.easing;
  const handleModeChange = (newMode) => {
    import_store6.TweakStore.updateTransitionMode(panelId, path, newMode);
    if (newMode === "easing") {
      onChange(cache.current.easing);
    } else if (newMode === "simple") {
      onChange(cache.current.simple);
    } else {
      onChange(cache.current.advanced);
    }
  };
  const handleSpringUpdate = (key, val) => {
    if (isSimpleSpring) {
      const { stiffness, damping, mass, ...rest } = spring;
      onChange({ ...rest, [key]: val });
    } else {
      const { visualDuration, bounce, ...rest } = spring;
      onChange({ ...rest, [key]: val });
    }
  };
  const updateEase = (index, val) => {
    const newEase = [...easing.ease];
    newEase[index] = val;
    onChange({ ...easing, ease: newEase });
  };
  const durationSlider = !hideDuration && (isEasing || isSimpleSpring) ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    Slider,
    {
      label: "Duration",
      value: durationControl?.value ?? (isEasing ? easing.duration : spring.visualDuration ?? 0.3),
      onChange: durationControl?.onChange ?? ((next) => {
        if (isEasing) onChange({ ...easing, duration: next });
        else handleSpringUpdate("visualDuration", next);
      }),
      min: durationControl?.min ?? 0.1,
      max: durationControl?.max ?? (isEasing ? 2 : 1),
      step: durationControl?.step ?? 0.05,
      unit: "s"
    }
  ) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Folder, { title: label, defaultOpen: true, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
    isEasing ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(EasingVisualization, { easing }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(SpringVisualization, { spring, isSimpleMode: isSimpleSpring }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "tweakers-labeled-control", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "tweakers-labeled-control-label", children: "Type" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        SegmentedControl,
        {
          options: [
            { value: "easing", label: "Easing" },
            { value: "simple", label: "Time" },
            { value: "advanced", label: "Physics" }
          ],
          value: mode,
          onChange: handleModeChange
        }
      )
    ] }),
    isEasing ? /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "x1", value: easing.ease[0], onChange: (v) => updateEase(0, v), min: 0, max: 1, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "y1", value: easing.ease[1], onChange: (v) => updateEase(1, v), min: -1, max: 2, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "x2", value: easing.ease[2], onChange: (v) => updateEase(2, v), min: 0, max: 1, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "y2", value: easing.ease[3], onChange: (v) => updateEase(3, v), min: -1, max: 2, step: 0.01 }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(EaseTextInput, { ease: easing.ease, onChange: (newEase) => onChange({ ...easing, ease: newEase }) })
    ] }) : isSimpleSpring ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "Bounce", value: spring.bounce ?? 0.2, onChange: (v) => handleSpringUpdate("bounce", v), min: 0, max: 1, step: 0.05 }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "Stiffness", value: spring.stiffness ?? 400, onChange: (v) => handleSpringUpdate("stiffness", v), min: 1, max: 1e3, step: 10 }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "Damping", value: spring.damping ?? 17, onChange: (v) => handleSpringUpdate("damping", v), min: 1, max: 100, step: 1 }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Slider, { label: "Mass", value: spring.mass ?? 1, onChange: (v) => handleSpringUpdate("mass", v), min: 0.1, max: 10, step: 0.1 })
    ] }),
    durationSlider
  ] }) });
}
function formatEase(ease) {
  return ease.map((v) => parseFloat(v.toFixed(2))).join(", ");
}
function parseEase(str) {
  const parts = str.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
    return parts;
  }
  return null;
}
function EaseTextInput({ ease, onChange }) {
  const [editing, setEditing] = (0, import_react17.useState)(false);
  const [draft, setDraft] = (0, import_react17.useState)("");
  const handleFocus = () => {
    setDraft(formatEase(ease));
    setEditing(true);
  };
  const handleBlur = () => {
    const parsed = parseEase(draft);
    if (parsed) onChange(parsed);
    setEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "tweakers-labeled-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "tweakers-labeled-control-label", children: "Ease" }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "input",
      {
        type: "text",
        className: "tweakers-text-input",
        value: editing ? draft : formatEase(ease),
        onChange: (e) => setDraft(e.target.value),
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        spellCheck: false
      }
    )
  ] });
}

// src/components/TextControl.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
function TextControl({ label, value, onChange, placeholder }) {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "tweakers-text-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("label", { className: "tweakers-text-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      "input",
      {
        type: "text",
        className: "tweakers-text-input",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder
      }
    )
  ] });
}

// src/components/SelectControl.tsx
var import_react19 = require("react");
var import_react_dom2 = require("react-dom");
var import_react20 = require("motion/react");

// src/components/PresenceMotionDiv.tsx
var import_react18 = require("motion/react");
var import_jsx_runtime18 = require("react/jsx-runtime");
function PresenceMotionDiv({ divRef, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_react18.motion.div, { ref: divRef, ...props });
}

// src/components/SelectControl.tsx
var import_icons2 = require("tweakers/icons");
var import_jsx_runtime19 = require("react/jsx-runtime");
function toTitleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
function normalizeOptions(options) {
  return options.map(
    (opt) => typeof opt === "string" ? { value: opt, label: toTitleCase(opt) } : opt
  );
}
function SelectControl({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = (0, import_react19.useState)(false);
  const triggerRef = (0, import_react19.useRef)(null);
  const dropdownRef = (0, import_react19.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react19.useState)(null);
  const [pos, setPos] = (0, import_react19.useState)(null);
  const normalized = normalizeOptions(options);
  const selectedOption = normalized.find((o) => o.value === value);
  const updatePos = (0, import_react19.useCallback)(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dropdownHeight = 8 + normalized.length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    setPos({
      top: above ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      above
    });
  }, [normalized.length]);
  (0, import_react19.useEffect)(() => {
    const root = triggerRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react19.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
  }, [isOpen, updatePos]);
  (0, import_react19.useEffect)(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      const target = e.target;
      if (triggerRef.current && !triggerRef.current.contains(target) && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "tweakers-select-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-select-trigger",
        onClick: () => setIsOpen(!isOpen),
        "data-open": String(isOpen),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "tweakers-select-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "tweakers-select-right", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "tweakers-select-value", children: selectedOption?.label ?? value }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              import_react20.motion.svg,
              {
                className: "tweakers-select-chevron",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                animate: { rotate: isOpen ? 180 : 0 },
                transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
                children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: import_icons2.ICON_CHEVRON })
              }
            )
          ] })
        ]
      }
    ),
    portalTarget && (0, import_react_dom2.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_react20.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-select-dropdown",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            left: pos.left,
            width: pos.width,
            ...pos.above ? { bottom: window.innerHeight - pos.top, transformOrigin: "bottom" } : { top: pos.top, transformOrigin: "top" }
          },
          children: normalized.map((option) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            "button",
            {
              className: "tweakers-select-option",
              "data-selected": String(option.value === value),
              onClick: () => {
                onChange(option.value);
                setIsOpen(false);
              },
              children: option.label
            },
            option.value
          ))
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/ColorControl.tsx
var import_react22 = require("react");
var import_react_dom3 = require("react-dom");
var import_react23 = require("motion/react");

// src/components/ColorPickerPanel.tsx
var import_react21 = require("react");
var import_color_core = require("tweakers/color-core");
var import_color_palette_store = require("tweakers/color-palette-store");
var import_jsx_runtime20 = require("react/jsx-runtime");
var FORMAT_OPTIONS = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" }
];
var stickyFormat = "hex";
var BLACK = { h: 0, s: 0, v: 0, a: 1 };
function useAreaDrag(onPoint) {
  const ref = (0, import_react21.useRef)(null);
  const draggingRef = (0, import_react21.useRef)(false);
  const readPoint = (0, import_react21.useCallback)(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      onPoint(x, y);
    },
    [onPoint]
  );
  const onPointerDown = (e) => {
    e.preventDefault();
    ref.current?.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    readPoint(e);
  };
  const onPointerMove = (e) => {
    if (draggingRef.current && e.buttons === 0) {
      draggingRef.current = false;
      return;
    }
    if (draggingRef.current) readPoint(e);
  };
  const endDrag = () => {
    draggingRef.current = false;
  };
  return { ref, onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag };
}
function ChannelField({ spec, value, onCommit }) {
  const [draft, setDraft] = (0, import_react21.useState)(null);
  const display = draft ?? String(value);
  const commit = () => {
    if (draft !== null) onCommit(Number(draft));
    setDraft(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("label", { className: "tweakers-color-field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "input",
      {
        type: "text",
        inputMode: "decimal",
        value: display,
        onFocus: (e) => {
          setDraft(String(value));
          e.target.select();
        },
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            setDraft(null);
            e.target.blur();
          }
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "tweakers-color-field-label", children: spec.label })
  ] });
}
function HexField({ value, alpha, onCommit }) {
  const [draft, setDraft] = (0, import_react21.useState)(null);
  const commit = () => {
    if (draft !== null) {
      const normalized = (0, import_color_core.normalizeHex)(draft, alpha);
      if (normalized) onCommit(normalized);
    }
    setDraft(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("label", { className: "tweakers-color-field tweakers-color-field-hex", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "input",
      {
        type: "text",
        spellCheck: false,
        value: (draft ?? value).toUpperCase(),
        onFocus: (e) => {
          setDraft(value);
          e.target.select();
        },
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            setDraft(null);
            e.target.blur();
          }
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "tweakers-color-field-label", children: "HEX" })
  ] });
}
function PaletteSlot({
  color,
  onSave,
  onApply,
  onClear
}) {
  const [holding, setHolding] = (0, import_react21.useState)(false);
  const timerRef = (0, import_react21.useRef)(null);
  const originRef = (0, import_react21.useRef)(null);
  const firedRef = (0, import_react21.useRef)(false);
  const cancelHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    originRef.current = null;
    setHolding(false);
  };
  (0, import_react21.useEffect)(() => () => cancelHold(), []);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    "button",
    {
      className: "tweakers-color-palette-slot",
      "data-filled": String(color !== null),
      "data-holding": String(holding),
      style: color ? { "--swatch-color": color } : void 0,
      title: color ? `${color.toUpperCase()} \u2014 click to apply, hold to clear` : "Save current color",
      onContextMenu: (e) => e.preventDefault(),
      onPointerDown: (e) => {
        firedRef.current = false;
        if (!color) return;
        originRef.current = { x: e.clientX, y: e.clientY };
        setHolding(true);
        timerRef.current = setTimeout(() => {
          firedRef.current = true;
          cancelHold();
          onClear();
        }, import_color_core.LONG_PRESS_MS);
      },
      onPointerMove: (e) => {
        const origin = originRef.current;
        if (!origin) return;
        if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > import_color_core.PALETTE_DRAG_CANCEL_PX) {
          cancelHold();
        }
      },
      onPointerUp: cancelHold,
      onPointerLeave: cancelHold,
      onPointerCancel: cancelHold,
      onClick: () => {
        if (firedRef.current) {
          firedRef.current = false;
          return;
        }
        if (color) onApply();
        else onSave();
      }
    }
  );
}
function ColorPickerPanel({ value, onChange, alpha = false, palette = false }) {
  const [hsva, setHsva] = (0, import_react21.useState)(() => {
    const rgba2 = (0, import_color_core.parseHex)(value);
    return rgba2 ? (0, import_color_core.rgbToHsv)(rgba2) : BLACK;
  });
  const [format, setFormat] = (0, import_react21.useState)(stickyFormat);
  const [slots, setSlots] = (0, import_react21.useState)(() => palette ? (0, import_color_palette_store.loadPalette)() : (0, import_color_core.emptyPalette)());
  const lastEmittedRef = (0, import_react21.useRef)(value);
  (0, import_react21.useEffect)(() => {
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    const rgba2 = (0, import_color_core.parseHex)(value);
    if (rgba2) setHsva((0, import_color_core.rgbToHsv)(rgba2));
  }, [value]);
  (0, import_react21.useEffect)(() => {
    if (!palette) return;
    return (0, import_color_palette_store.subscribePalette)(setSlots);
  }, [palette]);
  const emit = (0, import_react21.useCallback)(
    (next) => {
      setHsva(next);
      const hex = (0, import_color_core.formatHex)((0, import_color_core.hsvToRgb)(next), alpha);
      lastEmittedRef.current = hex;
      onChange(hex);
    },
    [alpha, onChange]
  );
  const applyHex = (0, import_react21.useCallback)(
    (hex) => {
      const rgba2 = (0, import_color_core.parseHex)(hex);
      if (!rgba2) return;
      const normalized = (0, import_color_core.formatHex)(rgba2, alpha);
      setHsva((0, import_color_core.rgbToHsv)(rgba2));
      lastEmittedRef.current = normalized;
      onChange(normalized);
    },
    [alpha, onChange]
  );
  const hsvaRef = (0, import_react21.useRef)(hsva);
  hsvaRef.current = hsva;
  const svDrag = useAreaDrag(
    (0, import_react21.useCallback)((x, y) => emit({ ...hsvaRef.current, s: x, v: 1 - y }), [emit])
  );
  const hueDrag = useAreaDrag(
    (0, import_react21.useCallback)((x) => emit({ ...hsvaRef.current, h: Math.min(x * 360, 359.999) }), [emit])
  );
  const alphaDrag = useAreaDrag(
    (0, import_react21.useCallback)((x) => emit({ ...hsvaRef.current, a: x }), [emit])
  );
  const rgba = (0, import_color_core.hsvToRgb)(hsva);
  const opaqueHex = (0, import_color_core.formatHex)(rgba, false);
  const currentHex = (0, import_color_core.formatHex)(rgba, alpha);
  const channelSpecs = format === "hex" ? [] : (0, import_color_core.getChannels)(format, alpha);
  const channelValues = format === "hex" ? [] : (0, import_color_core.rgbaToChannels)(rgba, format, alpha);
  const commitChannel = (index, n) => {
    const next = [...channelValues];
    next[index] = n;
    const committed = (0, import_color_core.channelsToRgba)(next, format, alpha);
    const nextHsva = (0, import_color_core.rgbToHsv)(committed);
    if (nextHsva.s === 0) nextHsva.h = hsva.h;
    if (nextHsva.v === 0) nextHsva.s = hsva.s;
    emit(nextHsva);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "tweakers-color-picker", style: { "--picker-hue": hsva.h }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "div",
      {
        className: "tweakers-color-sv",
        ref: svDrag.ref,
        onPointerDown: svDrag.onPointerDown,
        onPointerMove: svDrag.onPointerMove,
        onPointerUp: svDrag.onPointerUp,
        onPointerCancel: svDrag.onPointerCancel,
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          "div",
          {
            className: "tweakers-color-sv-thumb",
            style: { left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: opaqueHex }
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "div",
      {
        className: "tweakers-color-slider tweakers-color-hue",
        ref: hueDrag.ref,
        onPointerDown: hueDrag.onPointerDown,
        onPointerMove: hueDrag.onPointerMove,
        onPointerUp: hueDrag.onPointerUp,
        onPointerCancel: hueDrag.onPointerCancel,
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          "div",
          {
            className: "tweakers-color-slider-thumb",
            style: { left: `${hsva.h / 360 * 100}%`, background: `hsl(${hsva.h} 100% 50%)` }
          }
        )
      }
    ),
    alpha && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
      "div",
      {
        className: "tweakers-color-slider tweakers-color-alpha tweakers-checker",
        ref: alphaDrag.ref,
        onPointerDown: alphaDrag.onPointerDown,
        onPointerMove: alphaDrag.onPointerMove,
        onPointerUp: alphaDrag.onPointerUp,
        onPointerCancel: alphaDrag.onPointerCancel,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            "div",
            {
              className: "tweakers-color-alpha-gradient",
              style: { background: `linear-gradient(to right, transparent, ${opaqueHex})` }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            "div",
            {
              className: "tweakers-color-slider-thumb",
              style: { left: `${hsva.a * 100}%`, background: opaqueHex, opacity: Math.max(hsva.a, 0.15) }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      SegmentedControl,
      {
        options: FORMAT_OPTIONS,
        value: format,
        onChange: (f) => {
          stickyFormat = f;
          setFormat(f);
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "tweakers-color-fields", "data-format": format, children: format === "hex" ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(HexField, { value: currentHex, alpha, onCommit: applyHex }),
      alpha && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        ChannelField,
        {
          spec: { key: "a", label: "A", min: 0, max: 100, step: 1, precision: 0 },
          value: (0, import_color_core.opacityPercent)(rgba),
          onCommit: (n) => emit({ ...hsva, a: Math.min(1, Math.max(0, n / 100)) })
        }
      )
    ] }) : channelSpecs.map((spec, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ChannelField, { spec, value: channelValues[i], onCommit: (n) => commitChannel(i, n) }, `${format}-${spec.key}`)) }),
    palette && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "tweakers-color-palette", children: Array.from({ length: import_color_core.PALETTE_SIZE }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      PaletteSlot,
      {
        color: slots[i] ?? null,
        onSave: () => (0, import_color_palette_store.savePalette)((0, import_color_palette_store.loadPalette)().map((s, j) => j === i ? currentHex : s)),
        onApply: () => {
          const saved = slots[i];
          if (saved) applyHex(saved);
        },
        onClear: () => (0, import_color_palette_store.savePalette)((0, import_color_palette_store.loadPalette)().map((s, j) => j === i ? null : s))
      },
      i
    )) })
  ] });
}

// src/components/ColorControl.tsx
var import_color_core2 = require("tweakers/color-core");
var import_jsx_runtime21 = require("react/jsx-runtime");
var PICKER_WIDTH = 240;
var PICKER_BASE_HEIGHT = 270;
var PICKER_ALPHA_HEIGHT = 22;
var PICKER_PALETTE_HEIGHT = 30;
function ColorControl({ label, value, onChange, alpha = false, palette = false }) {
  const [isEditing, setIsEditing] = (0, import_react22.useState)(false);
  const [editValue, setEditValue] = (0, import_react22.useState)(() => (0, import_color_core2.bareHex)(value));
  const [isOpen, setIsOpen] = (0, import_react22.useState)(false);
  const swatchRef = (0, import_react22.useRef)(null);
  const pickerRef = (0, import_react22.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react22.useState)(null);
  const [pos, setPos] = (0, import_react22.useState)(null);
  const hexInputRef = (0, import_react22.useRef)(null);
  const rgba = (0, import_color_core2.parseHex)(value);
  (0, import_react22.useEffect)(() => {
    if (!isEditing) {
      setEditValue((0, import_color_core2.bareHex)(value));
    }
  }, [value, isEditing]);
  (0, import_react22.useEffect)(() => {
    if (isEditing) {
      hexInputRef.current?.focus();
      hexInputRef.current?.select();
    }
  }, [isEditing]);
  const updatePos = (0, import_react22.useCallback)(() => {
    const el = swatchRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pickerHeight = PICKER_BASE_HEIGHT + (alpha ? PICKER_ALPHA_HEIGHT : 0) + (palette ? PICKER_PALETTE_HEIGHT : 0);
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PICKER_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  }, [alpha, palette]);
  const open = () => {
    updatePos();
    setIsOpen(true);
  };
  (0, import_react22.useEffect)(() => {
    const root = swatchRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react22.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e) => {
      const target = e.target;
      if (swatchRef.current?.contains(target) || pickerRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        swatchRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewport);
    window.addEventListener("scroll", onViewport, true);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("scroll", onViewport, true);
    };
  }, [isOpen, updatePos]);
  function handleTextSubmit() {
    setIsEditing(false);
    const normalized = (0, import_color_core2.normalizeHexEdit)(editValue, alpha, rgba?.a ?? 1);
    if (normalized) {
      onChange(normalized);
    } else {
      setEditValue((0, import_color_core2.bareHex)(value));
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleTextSubmit();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setIsEditing(false);
      setEditValue((0, import_color_core2.bareHex)(value));
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "tweakers-color-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "tweakers-color-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "tweakers-color-inputs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { className: "tweakers-color-hex-wrap", onClick: () => setIsEditing(true), children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "tweakers-color-hash", "aria-hidden": "true", children: "#" }),
        isEditing ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
          "input",
          {
            ref: hexInputRef,
            type: "text",
            className: "tweakers-color-hex-input",
            "aria-label": `Hex color for ${label}`,
            value: editValue,
            onChange: (e) => setEditValue(e.target.value),
            onBlur: handleTextSubmit,
            onKeyDown: handleKeyDown
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "tweakers-color-hex", "aria-label": `Hex color for ${label}`, children: (0, import_color_core2.bareHex)(value) })
      ] }),
      alpha && rgba && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "tweakers-color-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { className: "tweakers-color-opacity", children: [
          (0, import_color_core2.opacityPercent)(rgba),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "tweakers-color-opacity-unit", children: "%" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        "button",
        {
          ref: swatchRef,
          className: "tweakers-color-swatch",
          style: { "--swatch-color": value },
          onClick: () => isOpen ? setIsOpen(false) : open(),
          "data-open": String(isOpen),
          title: "Pick color",
          "aria-label": `Pick color for ${label}`,
          "aria-expanded": isOpen
        }
      )
    ] }),
    portalTarget && (0, import_react_dom3.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react23.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        import_react23.motion.div,
        {
          ref: pickerRef,
          className: "tweakers-color-picker-popover",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            left: pos.left,
            width: PICKER_WIDTH,
            ...pos.above ? { bottom: window.innerHeight - pos.top, transformOrigin: "bottom right" } : { top: pos.top, transformOrigin: "top right" }
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ColorPickerPanel, { value, onChange, alpha, palette })
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/GradientControl.tsx
var import_react26 = require("react");
var import_react_dom4 = require("react-dom");
var import_react27 = require("motion/react");

// src/components/GradientPanel.tsx
var import_react25 = require("react");

// src/components/GradientTransformPad.tsx
var import_react24 = require("react");
var import_gradient_core2 = require("tweakers/gradient-core");
var import_jsx_runtime22 = require("react/jsx-runtime");
var clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
var wrap360 = (deg) => (deg % 360 + 360) % 360;
var RAD = Math.PI / 180;
var vectorToAngle = (dx, dy) => wrap360(Math.atan2(dx, -dy) / RAD);
function GradientTransformPad({ value, onChange }) {
  const padRef = (0, import_react24.useRef)(null);
  const drag = (0, import_react24.useRef)(null);
  const [size, setSize] = (0, import_react24.useState)({ w: 0, h: 0 });
  (0, import_react24.useLayoutEffect)(() => {
    const el = padRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { w, h } = size;
  const radial = value.type === "radial";
  const conic = value.type === "conic";
  const cx = value.centerX ?? 50;
  const cy = value.centerY ?? 50;
  const scale = value.scale ?? 100;
  const rotation = value.rotation ?? 0;
  const cxPx = cx / 100 * w;
  const cyPx = cy / 100 * h;
  const rxPx = scale / 100 * w;
  const ryPx = Math.max(10, (value.squash ?? scale) / 100 * h);
  const theta = rotation * RAD;
  const pin = (x, y) => ({ x: clamp(x, 5, w - 5), y: clamp(y, 5, h - 5) });
  const major = pin(cxPx + Math.cos(theta) * rxPx, cyPx + Math.sin(theta) * rxPx);
  const minor = pin(cxPx - Math.sin(theta) * ryPx, cyPx + Math.cos(theta) * ryPx);
  const majorLineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
  const majorLineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;
  const angleOx = conic ? cxPx : w / 2;
  const angleOy = conic ? cyPx : h / 2;
  const spokeR = Math.max(10, Math.min(w, h) / 2 - 8);
  const aTheta = value.angle * RAD;
  const angleHandle = pin(angleOx + Math.sin(aTheta) * spokeR, angleOy - Math.cos(aTheta) * spokeR);
  const angleLineLen = Math.hypot(angleHandle.x - angleOx, angleHandle.y - angleOy);
  const angleLineAngle = Math.atan2(angleHandle.y - angleOy, angleHandle.x - angleOx) / RAD;
  const onHandleDown = (kind) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
    }
    drag.current = { kind, pointerId: e.pointerId };
  };
  const onHandleMove = (e) => {
    if (!drag.current || drag.current.pointerId !== e.pointerId || !padRef.current) return;
    const kind = drag.current.kind;
    if (e.buttons === 0) {
      drag.current = null;
      return;
    }
    const rect = padRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (kind === "center") {
      onChange((0, import_gradient_core2.setGradientCenter)(value, px / rect.width * 100, py / rect.height * 100));
      return;
    }
    if (kind === "angle") {
      const ox = conic ? cx / 100 * rect.width : rect.width / 2;
      const oy = conic ? cy / 100 * rect.height : rect.height / 2;
      onChange((0, import_gradient_core2.setGradientAngle)(value, vectorToAngle(px - ox, py - oy)));
      return;
    }
    const dx = px - cx / 100 * rect.width;
    const dy = py - cy / 100 * rect.height;
    const dist = Math.hypot(dx, dy);
    const deg = Math.atan2(dy, dx) / RAD;
    if (kind === "major") {
      const nextScale = dist / rect.width * 100;
      onChange((0, import_gradient_core2.setGradientScale)((0, import_gradient_core2.setGradientRotation)(value, deg), nextScale));
      return;
    }
    const nextSquash = dist / rect.height * 100;
    onChange((0, import_gradient_core2.setGradientRotation)((0, import_gradient_core2.setGradientSquash)(value, nextSquash), deg - 90));
  };
  const onHandleUp = (e) => {
    if (drag.current?.pointerId === e.pointerId) drag.current = null;
  };
  const handleProps = (kind) => ({
    onPointerDown: onHandleDown(kind),
    onPointerMove: onHandleMove,
    onPointerUp: onHandleUp,
    onPointerCancel: onHandleUp,
    onLostPointerCapture: onHandleUp
  });
  const fill = (0, import_gradient_core2.gradientFillBox)(value, w, h);
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { ref: padRef, className: "tweakers-gradient-pad tweakers-checker", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      "div",
      {
        className: "tweakers-gradient-pad-fill",
        style: {
          background: fill.background,
          transform: fill.transform,
          transformOrigin: fill.transformOrigin,
          left: fill.left,
          top: fill.top,
          width: fill.width,
          height: fill.height
        }
      }
    ),
    radial && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(import_jsx_runtime22.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        "div",
        {
          className: "tweakers-gradient-pad-line",
          style: { left: cxPx, top: cyPx, width: majorLineLen, transform: `rotate(${majorLineAngle}deg)` }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-gradient-pad-handle",
          "data-kind": "major",
          "aria-label": "Gradient size and rotation",
          style: { left: major.x, top: major.y },
          ...handleProps("major")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-gradient-pad-handle",
          "data-kind": "minor",
          "aria-label": "Gradient squash",
          style: { left: minor.x, top: minor.y },
          ...handleProps("minor")
        }
      )
    ] }),
    !radial && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(import_jsx_runtime22.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        "div",
        {
          className: "tweakers-gradient-pad-line",
          style: { left: angleOx, top: angleOy, width: angleLineLen, transform: `rotate(${angleLineAngle}deg)` }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-gradient-pad-handle",
          "data-kind": "angle",
          "aria-label": "Gradient angle",
          style: { left: angleHandle.x, top: angleHandle.y },
          ...handleProps("angle")
        }
      )
    ] }),
    (radial || conic) && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      "button",
      {
        type: "button",
        className: "tweakers-gradient-pad-handle",
        "data-kind": "center",
        "aria-label": "Gradient center",
        style: { left: clamp(cxPx, 5, w - 5), top: clamp(cyPx, 5, h - 5) },
        ...handleProps("center")
      }
    )
  ] });
}

// src/components/GradientPanel.tsx
var import_icons3 = require("tweakers/icons");
var import_gradient_core3 = require("tweakers/gradient-core");
var import_jsx_runtime23 = require("react/jsx-runtime");
var TYPE_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
  { value: "conic", label: "Conic" }
];
function GradientPanel({ value, onChange, onDrag, form = "fill" }) {
  const [selectedIndex, setSelectedIndex] = (0, import_react25.useState)(0);
  const [holdingIndex, setHoldingIndex] = (0, import_react25.useState)(-1);
  const [detach, setDetach] = (0, import_react25.useState)(null);
  const stripRef = (0, import_react25.useRef)(null);
  const gripRef = (0, import_react25.useRef)(null);
  const gripOrigin = (0, import_react25.useRef)(null);
  const onGripDown = (e) => {
    e.preventDefault();
    try {
      gripRef.current?.setPointerCapture(e.pointerId);
    } catch {
    }
    gripOrigin.current = { x: e.clientX, y: e.clientY };
  };
  const onGripMove = (e) => {
    if (!gripOrigin.current || e.buttons === 0) return;
    onDrag?.(e.clientX - gripOrigin.current.x, e.clientY - gripOrigin.current.y);
    gripOrigin.current = { x: e.clientX, y: e.clientY };
  };
  const onGripUp = () => {
    gripOrigin.current = null;
  };
  const drag = (0, import_react25.useRef)({ mode: "idle", activeIndex: -1, originX: 0, originY: 0, timer: null, working: value });
  const valueRef = (0, import_react25.useRef)(value);
  valueRef.current = value;
  (0, import_react25.useEffect)(() => () => {
    if (drag.current.timer) clearTimeout(drag.current.timer);
  }, []);
  const safeIndex = Math.min(selectedIndex, value.stops.length - 1);
  const stripPos = (clientX) => {
    const rect = stripRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };
  const stripCenterY = () => {
    const rect = stripRef.current.getBoundingClientRect();
    return rect.top + rect.height / 2;
  };
  const clearTimer = () => {
    if (drag.current.timer) clearTimeout(drag.current.timer);
    drag.current.timer = null;
  };
  const resetDrag = () => {
    clearTimer();
    drag.current.mode = "idle";
    setHoldingIndex(-1);
  };
  const commitMove = (clientX) => {
    const r = (0, import_gradient_core3.moveStop)(drag.current.working, drag.current.activeIndex, stripPos(clientX));
    drag.current.working = r.value;
    drag.current.activeIndex = r.index;
    setSelectedIndex(r.index);
    onChange(r.value);
  };
  const onPointerDown = (e) => {
    e.preventDefault();
    try {
      stripRef.current?.setPointerCapture(e.pointerId);
    } catch {
    }
    const d = drag.current;
    d.originX = e.clientX;
    d.originY = e.clientY;
    d.working = value;
    const handle = e.target.closest(".tweakers-gradient-stop");
    if (handle) {
      const index2 = Number(handle.dataset.index);
      setSelectedIndex(index2);
      d.activeIndex = index2;
      d.mode = "pending";
      if (value.stops.length > import_gradient_core3.MIN_STOPS) {
        setHoldingIndex(index2);
        d.timer = setTimeout(() => {
          d.timer = null;
          d.mode = "idle";
          setHoldingIndex(-1);
          const next2 = (0, import_gradient_core3.removeStop)(valueRef.current, index2);
          onChange(next2);
          setSelectedIndex(Math.min(index2, next2.stops.length - 1));
        }, import_gradient_core3.LONG_PRESS_MS);
      }
      return;
    }
    const { value: next, index } = (0, import_gradient_core3.addStop)(value, stripPos(e.clientX));
    d.working = next;
    d.activeIndex = index;
    d.mode = "dragging";
    setSelectedIndex(index);
    onChange(next);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (d.mode === "idle") return;
    if (e.buttons === 0) {
      setDetach(null);
      resetDrag();
      return;
    }
    if (d.mode === "pending") {
      if (Math.hypot(e.clientX - d.originX, e.clientY - d.originY) <= import_gradient_core3.PALETTE_DRAG_CANCEL_PX) return;
      clearTimer();
      setHoldingIndex(-1);
      d.mode = "dragging";
    }
    if (d.mode === "dragging") {
      const offV = e.clientY - stripCenterY();
      if (d.working.stops.length > import_gradient_core3.MIN_STOPS && Math.abs(offV) > import_gradient_core3.STOP_DETACH_PX) {
        d.mode = "detached";
        setDetach({ index: d.activeIndex, y: offV });
        return;
      }
      commitMove(e.clientX);
      return;
    }
    if (d.mode === "detached") {
      const offV = e.clientY - stripCenterY();
      if (Math.abs(offV) <= import_gradient_core3.STOP_DETACH_PX) {
        d.mode = "dragging";
        setDetach(null);
        commitMove(e.clientX);
      } else {
        setDetach({ index: d.activeIndex, y: offV });
      }
    }
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (d.mode === "detached") {
      const next = (0, import_gradient_core3.removeStop)(d.working, d.activeIndex);
      onChange(next);
      setSelectedIndex(Math.min(d.activeIndex, next.stops.length - 1));
    }
    setDetach(null);
    resetDrag();
  };
  const previewStops = detach ? value.stops.filter((_, i) => i !== detach.index) : value.stops;
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "tweakers-gradient-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "tweakers-gradient-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        "button",
        {
          ref: gripRef,
          type: "button",
          className: "tweakers-gradient-grip",
          "aria-label": "Drag to move",
          title: "Drag to move",
          onPointerDown: onGripDown,
          onPointerMove: onGripMove,
          onPointerUp: onGripUp,
          onPointerCancel: onGripUp,
          onLostPointerCapture: onGripUp,
          children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: import_icons3.ICON_GRIP.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("circle", { cx: c.cx, cy: c.cy, r: "1.5" }, i)) })
        }
      ),
      form === "fill" ? /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        SegmentedControl,
        {
          options: TYPE_OPTIONS,
          value: value.type,
          onChange: (t) => onChange((0, import_gradient_core3.setGradientType)(value, t))
        }
      ) : null
    ] }),
    form === "fill" ? /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(GradientTransformPad, { value, onChange }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      "div",
      {
        ref: stripRef,
        className: "tweakers-gradient-strip",
        style: { "--gradient-ramp": (0, import_gradient_core3.rampCss)(previewStops) },
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        children: value.stops.map((stop, i) => {
          const detaching = detach?.index === i;
          return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            "button",
            {
              type: "button",
              className: "tweakers-gradient-stop",
              "data-index": i,
              "data-selected": String(i === safeIndex),
              "data-holding": String(i === holdingIndex),
              "data-detaching": String(detaching),
              style: {
                left: `${stop.position * 100}%`,
                zIndex: i === safeIndex ? 99 : i + 1,
                "--swatch-color": stop.color,
                "--detach-y": detaching ? `${detach.y}px` : "0px"
              },
              "aria-label": `Gradient stop ${i + 1}`
            },
            i
          );
        })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "tweakers-gradient-divider", "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      ColorPickerPanel,
      {
        value: value.stops[safeIndex].color,
        alpha: true,
        palette: false,
        onChange: (hex) => onChange((0, import_gradient_core3.setStopColor)(value, safeIndex, hex))
      },
      safeIndex
    )
  ] });
}

// src/components/GradientControl.tsx
var import_gradient_core4 = require("tweakers/gradient-core");
var import_jsx_runtime24 = require("react/jsx-runtime");
var PANEL_WIDTH = 240;
var PANEL_HEIGHT_ANGLED = 470;
var PANEL_HEIGHT_RAMP = 300;
var PANEL_HEIGHT_RADIAL = 430;
function GradientControl({ label, value, onChange, form = "fill" }) {
  const [isOpen, setIsOpen] = (0, import_react26.useState)(false);
  const triggerRef = (0, import_react26.useRef)(null);
  const panelRef = (0, import_react26.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react26.useState)(null);
  const [pos, setPos] = (0, import_react26.useState)(null);
  const [dragPos, setDragPos] = (0, import_react26.useState)(null);
  const onPanelDrag = (0, import_react26.useCallback)((dx, dy) => {
    setDragPos((prev) => {
      let base = prev;
      if (!base) {
        const el = panelRef.current;
        if (!pos || !el) return prev;
        base = { left: pos.left, top: pos.above ? pos.top - el.offsetHeight : pos.top };
      }
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      return { left, top };
    });
  }, [pos]);
  const updatePos = (0, import_react26.useCallback)(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const panelHeight = form === "ramp" ? PANEL_HEIGHT_RAMP : value.type === "radial" ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < panelHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PANEL_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  }, [value.type]);
  const open = () => {
    setDragPos(null);
    updatePos();
    setIsOpen(true);
  };
  (0, import_react26.useEffect)(() => {
    const root = triggerRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react26.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewport);
    window.addEventListener("scroll", onViewport, true);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("scroll", onViewport, true);
    };
  }, [isOpen, updatePos]);
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "tweakers-gradient-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "tweakers-gradient-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-gradient-preview tweakers-checker",
        style: { "--gradient-preview": (0, import_gradient_core4.gradientToCss)(value) },
        onClick: () => isOpen ? setIsOpen(false) : open(),
        "data-open": String(isOpen),
        title: "Edit gradient",
        "aria-label": `Edit gradient for ${label}`,
        "aria-expanded": isOpen
      }
    ),
    portalTarget && (0, import_react_dom4.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_react27.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        import_react27.motion.div,
        {
          ref: panelRef,
          className: "tweakers-gradient-popover",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            width: PANEL_WIDTH,
            ...dragPos ? { left: dragPos.left, top: dragPos.top, transformOrigin: "top left" } : pos.above ? { left: pos.left, bottom: window.innerHeight - pos.top, transformOrigin: "bottom right" } : { left: pos.left, top: pos.top, transformOrigin: "top right" }
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(GradientPanel, { value, onChange, form, onDrag: onPanelDrag })
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/XYPad.tsx
var import_react28 = require("react");
var import_shortcut_utils6 = require("tweakers/shortcut-utils");
var import_xy_pad_core2 = require("tweakers/xy-pad-core");
var import_jsx_runtime25 = require("react/jsx-runtime");
var DEFAULT_GRID_X = 5;
var DEFAULT_GRID_Y = 5;
var FINE_DRAG = 0.15;
function decimalsForStep4(step) {
  const s = step.toString();
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}
function formatComponent(v, axis) {
  return (v + 0).toFixed(decimalsForStep4(axis.step));
}
function XYPad({
  label,
  value,
  onChange,
  x,
  y,
  size = 160,
  grid,
  density = 1,
  snap = false,
  returnToCenter = false,
  showValues = false,
  disabled = false,
  formatValue,
  shortcut,
  shortcutActive
}) {
  const xAxis = (0, import_xy_pad_core2.resolveAxis)(x);
  const yAxis = (0, import_xy_pad_core2.resolveAxis)(y);
  const areaRef = (0, import_react28.useRef)(null);
  const draggingRef = (0, import_react28.useRef)(false);
  const [active, setActive] = (0, import_react28.useState)(false);
  const [dragging, setDragging] = (0, import_react28.useState)(false);
  const valueRef = (0, import_react28.useRef)(value);
  valueRef.current = value;
  const pointToValue = (0, import_react28.useCallback)(
    (clientX, clientY, fine) => {
      const el = areaRef.current;
      if (!el) return valueRef.current;
      const rect = el.getBoundingClientRect();
      let px = (clientX - rect.left) / rect.width;
      let py = (clientY - rect.top) / rect.height;
      if (fine) {
        const cur = (0, import_xy_pad_core2.pointFromValue)(valueRef.current, xAxis, yAxis);
        px = cur.x + (px - cur.x) * FINE_DRAG;
        py = cur.y + (py - cur.y) * FINE_DRAG;
      }
      px = Math.min(1, Math.max(0, px));
      py = Math.min(1, Math.max(0, py));
      const next = (0, import_xy_pad_core2.valueFromPoint)({ x: px, y: py }, xAxis, yAxis, snap);
      const originPoint = (0, import_xy_pad_core2.pointFromValue)({ x: xAxis.origin, y: yAxis.origin }, xAxis, yAxis);
      const dxPx = Math.abs(px - originPoint.x) * rect.width;
      const dyPx = Math.abs(py - originPoint.y) * rect.height;
      return {
        x: (0, import_xy_pad_core2.applyDetentAxis)(next.x, xAxis, dxPx),
        y: (0, import_xy_pad_core2.applyDetentAxis)(next.y, yAxis, dyPx)
      };
    },
    [xAxis, yAxis, snap]
  );
  const emit = (0, import_react28.useCallback)(
    (next) => {
      valueRef.current = next;
      onChange(next);
    },
    [onChange]
  );
  const handlePointerDown = (e) => {
    if (disabled) return;
    if (e.button !== 0 || !e.isPrimary) return;
    if (e.altKey) return;
    e.preventDefault();
    try {
      areaRef.current?.setPointerCapture(e.pointerId);
    } catch {
    }
    areaRef.current?.focus();
    draggingRef.current = true;
    setActive(true);
    setDragging(true);
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    if (e.buttons === 0) {
      finishDrag(e);
      return;
    }
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };
  const finishDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    try {
      areaRef.current?.releasePointerCapture(e.pointerId);
    } catch {
    }
    const el = areaRef.current;
    const stillActive = (el?.matches(":hover") ?? false) || el === (el?.ownerDocument ?? document).activeElement;
    if (!stillActive) setActive(false);
    if (returnToCenter) emit((0, import_xy_pad_core2.normalizeValue)((0, import_xy_pad_core2.centerValue)(xAxis, yAxis), xAxis, yAxis, snap));
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    const mode = e.shiftKey ? "coarse" : e.altKey ? "fine" : "normal";
    const cur = valueRef.current;
    const ctrl = e.ctrlKey || e.metaKey;
    let next = null;
    switch (e.key) {
      case "ArrowUp":
        next = (0, import_xy_pad_core2.nudge)(cur, "y", 1, xAxis, yAxis, mode);
        break;
      case "ArrowDown":
        next = (0, import_xy_pad_core2.nudge)(cur, "y", -1, xAxis, yAxis, mode);
        break;
      case "ArrowRight":
        next = (0, import_xy_pad_core2.nudge)(cur, "x", 1, xAxis, yAxis, mode);
        break;
      case "ArrowLeft":
        next = (0, import_xy_pad_core2.nudge)(cur, "x", -1, xAxis, yAxis, mode);
        break;
      case "PageUp":
        next = (0, import_xy_pad_core2.nudge)(cur, "y", 1, xAxis, yAxis, "coarse");
        break;
      case "PageDown":
        next = (0, import_xy_pad_core2.nudge)(cur, "y", -1, xAxis, yAxis, "coarse");
        break;
      case "Home":
        next = ctrl ? { x: xAxis.min, y: yAxis.min } : { x: xAxis.min, y: cur.y };
        break;
      case "End":
        next = ctrl ? { x: xAxis.max, y: yAxis.max } : { x: xAxis.max, y: cur.y };
        break;
      default:
        return;
    }
    e.preventDefault();
    emit(next);
  };
  const reset = () => {
    if (disabled) return;
    emit((0, import_xy_pad_core2.normalizeValue)((0, import_xy_pad_core2.centerValue)(xAxis, yAxis), xAxis, yAxis, snap));
  };
  const xLabel = x?.label ?? "X";
  const yLabel = y?.label ?? "Y";
  const xText = `${xLabel} ${formatComponent(value.x, xAxis)}`;
  const yText = `${yLabel} ${formatComponent(value.y, yAxis)}`;
  const xVisual = showValues ? xText : xLabel;
  const yVisual = showValues ? yText : yLabel;
  const readout = formatValue ? formatValue(value) : `${xText}  ${yText}`;
  const dens = typeof density === "number" && density > 0 ? density : 1;
  let baseX, baseY;
  if (grid === false) {
    baseX = 0;
    baseY = 0;
  } else if (typeof grid === "number") {
    baseX = grid;
    baseY = grid;
  } else {
    baseX = DEFAULT_GRID_X;
    baseY = DEFAULT_GRID_Y;
  }
  const gridX = baseX > 0 ? Math.round(baseX * dens) : 0;
  const gridY = baseY > 0 ? Math.round(baseY * dens) : 0;
  const showGrid = gridX > 0 && gridY > 0;
  const point = (0, import_xy_pad_core2.pointFromValue)(value, xAxis, yAxis);
  const leftPct = `${point.x * 100}%`;
  const topPct = `${point.y * 100}%`;
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "tweakers-xy", "data-active": String(active), "data-disabled": String(disabled), children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-xy-header", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { className: "tweakers-xy-label", children: [
      label,
      shortcut && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: `tweakers-shortcut-pill${shortcutActive ? " tweakers-shortcut-pill-active" : ""}`, children: (0, import_shortcut_utils6.formatSliderShortcut)(shortcut) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
      "div",
      {
        ref: areaRef,
        className: "tweakers-xy-area",
        style: { height: size },
        role: "application",
        "aria-roledescription": "2D pad",
        "aria-label": label,
        "aria-valuetext": readout,
        "aria-valuemin": xAxis.min,
        "aria-valuemax": xAxis.max,
        "aria-valuenow": value.x,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : 0,
        "data-active": String(active),
        "data-dragging": String(dragging),
        "data-disabled": String(disabled),
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: finishDrag,
        onPointerCancel: finishDrag,
        onDoubleClick: reset,
        onClick: (e) => {
          if (e.altKey) reset();
        },
        onKeyDown: handleKeyDown,
        onFocus: () => setActive(true),
        onBlur: () => setActive(false),
        onPointerEnter: () => setActive(true),
        onPointerLeave: () => {
          if (!draggingRef.current) setActive(false);
        },
        children: [
          showGrid && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            "div",
            {
              className: "tweakers-xy-grid",
              "aria-hidden": "true",
              style: {
                "--tweak-xy-grid-step-x": `${100 / gridX}%`,
                "--tweak-xy-grid-step-y": `${100 / gridY}%`
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-xy-axis tweakers-xy-axis-x", "aria-hidden": "true", children: xVisual }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-xy-axis tweakers-xy-axis-y", "aria-hidden": "true", children: yVisual }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-xy-guide tweakers-xy-guide-v", "aria-hidden": "true", style: { left: leftPct } }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-xy-guide tweakers-xy-guide-h", "aria-hidden": "true", style: { top: topPct } }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "tweakers-xy-thumb", "aria-hidden": "true", style: { left: leftPct, top: topPct } })
        ]
      }
    )
  ] });
}

// src/components/XYControl.tsx
var import_jsx_runtime26 = require("react/jsx-runtime");
function XYControl({ label, value, onChange, x, y, grid, density, snap, returnToCenter, showValues, shortcut, shortcutActive }) {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
    XYPad,
    {
      label,
      value,
      onChange,
      x,
      y,
      grid,
      density,
      snap,
      returnToCenter,
      showValues,
      shortcut,
      shortcutActive
    }
  );
}

// src/components/GalleryControl.tsx
var import_react29 = require("react");
var import_icons4 = require("tweakers/icons");
var import_jsx_runtime27 = require("react/jsx-runtime");
function itemContent(item, skeleton) {
  if (item.render) return item.render();
  if (!item.src) return null;
  return skeleton ? /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(GalleryImage, { item }) : /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("img", { src: item.src, alt: "", draggable: false });
}
function GalleryImage({ item }) {
  const [loaded, setLoaded] = (0, import_react29.useState)(false);
  const imgRef = (0, import_react29.useRef)(null);
  (0, import_react29.useEffect)(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    const done = () => setLoaded(true);
    img.addEventListener("load", done);
    img.addEventListener("error", done);
    return () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
    "span",
    {
      className: "tweakers-gallery-media",
      "data-fixed": item.aspect ? "true" : "false",
      style: item.aspect ? { aspectRatio: String(item.aspect) } : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-gallery-skeleton", "data-done": String(loaded), "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "img",
          {
            ref: imgRef,
            className: "tweakers-gallery-img",
            "data-loaded": String(loaded),
            src: item.src,
            alt: item.alt ?? "",
            loading: "lazy",
            decoding: "async",
            draggable: false
          }
        )
      ]
    }
  );
}
function GalleryControl({ label, value, items, onChange, columns = 2 }) {
  const [isOpen, setIsOpen] = (0, import_react29.useState)(false);
  const selected = items.find((it) => it.id === value) ?? items[0];
  const preview = selected ? itemContent(selected, false) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "tweakers-gallery", "data-open": String(isOpen), children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
      "button",
      {
        type: "button",
        className: "tweakers-gallery-trigger",
        "aria-expanded": isOpen,
        onClick: () => setIsOpen((o) => !o),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-gallery-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("span", { className: "tweakers-gallery-right", children: [
            preview && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-gallery-preview", "aria-hidden": "true", children: preview }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              "svg",
              {
                className: "tweakers-gallery-chevron",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: import_icons4.ICON_CHEVRON })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "tweakers-gallery-reveal", "aria-hidden": !isOpen, children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "tweakers-gallery-reveal-inner", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "tweakers-gallery-box", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "tweakers-gallery-masonry", style: { columnCount: columns }, children: items.map((item) => {
      const isSelected = item.id === value;
      return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
        "button",
        {
          type: "button",
          className: "tweakers-gallery-item",
          "data-selected": String(isSelected),
          "aria-pressed": isSelected,
          tabIndex: isOpen ? 0 : -1,
          style: item.aspect && !item.src ? { aspectRatio: String(item.aspect) } : void 0,
          onClick: () => onChange(item.id),
          children: [
            itemContent(item, true),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: "tweakers-gallery-check", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("path", { d: import_icons4.ICON_CHECK }) }) })
          ]
        },
        item.id
      );
    }) }) }) }) })
  ] });
}

// src/components/FileControl.tsx
var import_react30 = require("react");
var import_icons5 = require("tweakers/icons");
var import_jsx_runtime28 = require("react/jsx-runtime");
function FileControl({ label, value, accept, multiple = false, onChange, onPick }) {
  const inputRef = (0, import_react30.useRef)(null);
  const handleChange = (e) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    onPick(files);
    onChange(files.length === 1 ? files[0].name : `${files.length} files`);
  };
  const clear = (e) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = "";
    onChange("");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "tweakers-file-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("button", { type: "button", className: "tweakers-file-trigger", onClick: () => inputRef.current?.click(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "tweakers-file-label", children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("span", { className: "tweakers-file-right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
          "svg",
          {
            className: "tweakers-file-icon",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.6",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            "aria-hidden": "true",
            children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("path", { d: import_icons5.ICON_FILE })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "tweakers-file-name", "data-empty": String(!value), children: value || "Choose file\u2026" })
      ] })
    ] }),
    value && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("button", { type: "button", className: "tweakers-file-clear", onClick: clear, "aria-label": "Clear file", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("path", { d: import_icons5.ICON_CLOSE }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      "input",
      {
        ref: inputRef,
        className: "tweakers-file-input",
        type: "file",
        accept,
        multiple,
        onChange: handleChange
      }
    )
  ] });
}

// src/components/SwatchControl.tsx
var import_react31 = require("react");
var import_react_dom5 = require("react-dom");
var import_react32 = require("motion/react");
var import_icons6 = require("tweakers/icons");
var import_jsx_runtime29 = require("react/jsx-runtime");
function Preview({ colors }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-swatch-preview", "aria-hidden": "true", children: colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-swatch-chip", style: { background: c } }, i)) });
}
function SwatchControl({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = (0, import_react31.useState)(false);
  const [highlight, setHighlight] = (0, import_react31.useState)(-1);
  const triggerRef = (0, import_react31.useRef)(null);
  const dropdownRef = (0, import_react31.useRef)(null);
  const [portalTarget, setPortalTarget] = (0, import_react31.useState)(null);
  const [pos, setPos] = (0, import_react31.useState)(null);
  const selectedOption = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const updatePos = (0, import_react31.useCallback)(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dropdownHeight = 8 + options.length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left: rect.left, width: rect.width, above });
  }, [options.length]);
  const open = () => {
    updatePos();
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };
  const select = (v) => {
    onChange(v);
    setIsOpen(false);
  };
  const onKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlight >= 0 && highlight < options.length) select(options[highlight].value);
    }
  };
  (0, import_react31.useEffect)(() => {
    const root = triggerRef.current?.closest(".tweakers-root");
    setPortalTarget(root ?? document.body);
  }, []);
  (0, import_react31.useEffect)(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onViewport);
    window.addEventListener("scroll", onViewport, true);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("scroll", onViewport, true);
    };
  }, [isOpen, updatePos]);
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "tweakers-select-row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-select-trigger",
        onClick: () => isOpen ? setIsOpen(false) : open(),
        onKeyDown,
        "data-open": String(isOpen),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-select-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "tweakers-select-right", children: [
            selectedOption && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Preview, { colors: selectedOption.colors }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-select-value", children: selectedOption?.label ?? value }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
              import_react32.motion.svg,
              {
                className: "tweakers-select-chevron",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                animate: { rotate: isOpen ? 180 : 0 },
                transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
                children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: import_icons6.ICON_CHEVRON })
              }
            )
          ] })
        ]
      }
    ),
    portalTarget && (0, import_react_dom5.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_react32.AnimatePresence, { children: isOpen && pos && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-select-dropdown",
          initial: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          style: {
            position: "fixed",
            left: pos.left,
            width: pos.width,
            ...pos.above ? { bottom: window.innerHeight - pos.top, transformOrigin: "bottom" } : { top: pos.top, transformOrigin: "top" }
          },
          children: options.map((option, i) => /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
            "button",
            {
              className: "tweakers-select-option tweakers-swatch-option",
              "data-selected": String(option.value === value),
              "data-highlight": String(i === highlight),
              onClick: () => select(option.value),
              onMouseEnter: () => setHighlight(i),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Preview, { colors: option.colors }),
                /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "tweakers-swatch-option-label", children: option.label })
              ]
            },
            option.value
          ))
        }
      ) }),
      portalTarget
    )
  ] });
}

// src/components/ChipsControl.tsx
var import_icons7 = require("tweakers/icons");
var import_jsx_runtime30 = require("react/jsx-runtime");
function ChipsControl({ label, value, options, onChange, onRemove }) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "tweakers-chips", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "tweakers-chips-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "tweakers-chips-grid", role: "listbox", "aria-label": label, children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "tweakers-chip", "data-active": String(option.value === value), children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-chip-select",
          role: "option",
          "aria-selected": option.value === value,
          onClick: () => onChange(option.value),
          children: option.label
        }
      ),
      option.removable && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-chip-remove",
          "aria-label": `Remove ${option.label}`,
          onClick: () => onRemove(option.value),
          children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("path", { d: import_icons7.ICON_CLOSE }) })
        }
      )
    ] }, option.value)) })
  ] });
}

// src/components/MultiSelectControl.tsx
var import_icons8 = require("tweakers/icons");
var import_jsx_runtime31 = require("react/jsx-runtime");
function toggle(value, options, toggled) {
  const next = new Set(value);
  if (next.has(toggled)) next.delete(toggled);
  else next.add(toggled);
  return options.filter((o) => next.has(o.value)).map((o) => o.value);
}
function MultiSelectControl({ label, value, options, onChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "tweakers-multiselect", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "tweakers-multiselect-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "tweakers-multiselect-list", role: "listbox", "aria-label": label, "aria-multiselectable": "true", children: options.map((option) => {
      const checked = value.includes(option.value);
      return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
        "button",
        {
          type: "button",
          className: "tweakers-multiselect-row",
          role: "option",
          "aria-selected": checked,
          "data-checked": String(checked),
          onClick: () => onChange(toggle(value, options, option.value)),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "tweakers-multiselect-box", "aria-hidden": "true", children: checked && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: import_icons8.ICON_CHECK }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("span", { className: "tweakers-multiselect-text", children: [
              /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("span", { className: "tweakers-multiselect-line", children: [
                option.label,
                option.tag && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "tweakers-multiselect-tag", children: option.tag })
              ] }),
              option.hint && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "tweakers-multiselect-hint", children: option.hint })
            ] })
          ]
        },
        option.value
      );
    }) })
  ] });
}

// src/components/ListControl.tsx
var import_react33 = require("react");
var import_icons9 = require("tweakers/icons");
var import_store7 = require("tweakers/store");
var import_jsx_runtime32 = require("react/jsx-runtime");
function FieldControl({ field, value, onChange }) {
  switch (field.kind) {
    case "slider":
      return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Slider, { label: field.label, value, min: field.min, max: field.max, step: field.step, onChange });
    case "toggle":
      return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Toggle, { label: field.label, checked: value, onChange });
    case "select":
      return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(SelectControl, { label: field.label, value, options: field.options ?? [], onChange });
    case "color":
      return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(ColorControl, { label: field.label, value, palette: field.palette, onChange });
    case "swatch":
      return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(SwatchControl, { label: field.label, value, options: field.swatchOptions ?? [], onChange });
    case "text":
      return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(TextControl, { label: field.label, value, onChange, placeholder: field.placeholder });
    default:
      return null;
  }
}
function FieldList({
  fields,
  params,
  rowId,
  onChange
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "tweakers-list-item-fields", children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(ControlShell, { hint: field.hint, id: (0, import_store7.hintDomId)(rowId, field.key), children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
    FieldControl,
    {
      field,
      value: params[field.key],
      onChange: (v) => onChange(field.key, v)
    }
  ) }, field.key)) });
}
function ListControl({ label, value, itemTypes, addLabel, maxItems, onChange, onEvent }) {
  const idCounter = (0, import_react33.useRef)(0);
  const mkId = () => `li-${idCounter.current++}`;
  const [ids, setIds] = (0, import_react33.useState)(() => value.map(mkId));
  const [picking, setPicking] = (0, import_react33.useState)(false);
  const [editing, setEditing] = (0, import_react33.useState)(null);
  const armedRef = (0, import_react33.useRef)(null);
  const [dragIndex, setDragIndex] = (0, import_react33.useState)(null);
  const [over, setOver] = (0, import_react33.useState)(null);
  if (ids.length !== value.length) {
    setIds((cur) => value.map((_, i) => cur[i] ?? mkId()));
  }
  (0, import_react33.useEffect)(() => {
    const disarm = () => {
      armedRef.current = null;
    };
    window.addEventListener("mouseup", disarm);
    return () => window.removeEventListener("mouseup", disarm);
  }, []);
  const typeEntries = Object.entries(itemTypes);
  const atCapacity = maxItems != null && value.length >= maxItems;
  const addItem = (type) => {
    if (atCapacity || !itemTypes[type]) return;
    const next = [...value, { type, params: (0, import_store7.defaultListItemParams)(itemTypes[type].schema) }];
    setIds((cur) => [...cur, mkId()]);
    onChange(next);
    onEvent({ kind: "list", op: "add", index: next.length - 1, itemType: type });
  };
  const removeItem = (index) => {
    setIds((cur) => cur.filter((_, i) => i !== index));
    onChange(value.filter((_, i) => i !== index));
    onEvent({ kind: "list", op: "remove", index });
  };
  const moveItem = (from, to) => {
    if (from === to || to < 0 || to >= value.length) return;
    const reorder = (arr) => {
      const out = arr.slice();
      const [moved] = out.splice(from, 1);
      out.splice(to, 0, moved);
      return out;
    };
    setIds(reorder);
    onChange(reorder(value));
    onEvent({ kind: "list", op: "move", from, to });
  };
  const commitTitle = (index, raw) => {
    setEditing(null);
    const next = raw.trim();
    if ((value[index]?.title ?? "") === next) return;
    onChange(
      value.map((item, i) => {
        if (i !== index) return item;
        const row = { type: item.type, params: item.params };
        if (next) row.title = next;
        return row;
      })
    );
    onEvent({ kind: "list", op: "rename", index });
  };
  const setParam = (index, key, v) => {
    onChange(value.map((item, i) => i === index ? { ...item, params: { ...item.params, [key]: v } } : item));
    onEvent({ kind: "list", op: "set", index });
  };
  const handleAdd = () => {
    if (typeEntries.length === 1) addItem(typeEntries[0][0]);
    else setPicking((p) => !p);
  };
  const onDrop = () => {
    if (dragIndex !== null && over !== null) {
      let to = over.after ? over.index + 1 : over.index;
      if (dragIndex < to) to -= 1;
      moveItem(dragIndex, to);
    }
    armedRef.current = null;
    setDragIndex(null);
    setOver(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(Folder, { title: label, defaultOpen: true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "tweakers-list-items", onDragOver: (e) => e.preventDefault(), onDrop, children: [
      value.map((item, index) => {
        const type = itemTypes[item.type];
        if (!type) return null;
        const { flat, groups } = (0, import_store7.groupListFields)((0, import_store7.parseListItemSchema)(type.schema, type.hints, type.groups));
        const overState = over?.index === index ? over.after ? "after" : "before" : void 0;
        const rowTitle = item.title ?? type.label;
        return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
          "div",
          {
            className: "tweakers-list-item",
            draggable: editing !== index,
            "data-dragging": dragIndex === index ? "true" : void 0,
            "data-over": overState,
            onDragStart: (e) => {
              if (armedRef.current !== index) {
                e.preventDefault();
                return;
              }
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(index));
              setDragIndex(index);
            },
            onDragOver: (e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const after = e.clientY > rect.top + rect.height / 2;
              setOver((o) => o?.index === index && o.after === after ? o : { index, after });
            },
            onDragEnd: () => {
              armedRef.current = null;
              setDragIndex(null);
              setOver(null);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "tweakers-list-item-head", children: [
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "tweakers-list-drag",
                    "aria-label": "Drag to reorder",
                    onMouseDown: () => {
                      armedRef.current = index;
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: import_icons9.ICON_GRIP.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("circle", { cx: c.cx, cy: c.cy, r: "1.5" }, i)) })
                  }
                ),
                editing === index ? (
                  // Uncontrolled: the field owns the draft, so Escape can restore
                  // the original and let the shared blur path no-op it away.
                  /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                    "input",
                    {
                      className: "tweakers-list-item-title",
                      defaultValue: item.title ?? "",
                      placeholder: type.label,
                      autoFocus: true,
                      onFocus: (e) => e.currentTarget.select(),
                      onBlur: (e) => commitTitle(index, e.currentTarget.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        else if (e.key === "Escape") {
                          e.currentTarget.value = item.title ?? "";
                          e.currentTarget.blur();
                        }
                      }
                    }
                  )
                ) : /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "tweakers-list-item-title",
                    "aria-label": `Rename ${rowTitle}`,
                    onClick: () => setEditing(index),
                    children: rowTitle
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "tweakers-list-item-actions", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "tweakers-list-icon-btn tweakers-list-remove",
                    onClick: () => removeItem(index),
                    "aria-label": `Remove ${rowTitle}`,
                    children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", children: import_icons9.ICON_TRASH.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("path", { d }, i)) })
                  }
                ) })
              ] }),
              flat.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                FieldList,
                {
                  fields: flat,
                  params: item.params,
                  rowId: ids[index],
                  onChange: (key, v) => setParam(index, key, v)
                }
              ),
              groups.map((group, groupIndex) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Folder, { title: group.label, defaultOpen: groupIndex === 0, children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                FieldList,
                {
                  fields: group.fields,
                  params: item.params,
                  rowId: ids[index],
                  onChange: (key, v) => setParam(index, key, v)
                }
              ) }, group.label))
            ]
          },
          ids[index]
        );
      }),
      value.length === 0 && !picking && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "tweakers-list-empty", children: "No items yet" })
    ] }),
    !atCapacity && /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "tweakers-list-add", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("button", { type: "button", className: "tweakers-list-add-btn", "data-open": String(picking), onClick: handleAdd, children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("path", { d: import_icons9.ICON_PLUS }) }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { children: addLabel ?? "Add" })
      ] }),
      typeEntries.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "tweakers-list-picker", "data-open": String(picking), children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "tweakers-list-picker-inner", children: typeEntries.map(([key, type]) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
        "button",
        {
          type: "button",
          className: "tweakers-list-picker-chip",
          onClick: () => {
            addItem(key);
            setPicking(false);
          },
          children: type.label
        },
        key
      )) }) })
    ] })
  ] });
}

// src/components/CurvePreview.tsx
var import_react34 = require("react");
var import_store8 = require("tweakers/store");
var import_curve_preview_core = require("tweakers/curve-preview-core");
var import_jsx_runtime33 = require("react/jsx-runtime");
var VIEW_WIDTH = 232;
var PAD_Y = 4;
function CurvePreview({ panelId, control }) {
  const subscribe = (0, import_react34.useCallback)(
    (callback) => import_store8.TweakStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const sample = (0, import_react34.useSyncExternalStore)(subscribe, () => control.sample, () => control.sample);
  const markers = (0, import_react34.useSyncExternalStore)(subscribe, () => control.markers, () => control.markers);
  const height = (0, import_curve_preview_core.clampCurveHeight)(control.height);
  const plot = (0, import_curve_preview_core.plotCurve)(sample ?? (() => NaN), { domain: control.domain });
  const pathData = (0, import_curve_preview_core.curvePathData)(plot.segments, VIEW_WIDTH, height, PAD_Y);
  const baselineY = plot.baseline !== null ? (0, import_curve_preview_core.curveY)(plot.baseline, height, PAD_Y) : null;
  const markerXs = (0, import_curve_preview_core.normalizeCurveMarkers)(markers);
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "tweakers-curve", children: [
    !control.hideLabel && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "tweakers-curve-label", children: control.label }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
      "svg",
      {
        className: "tweakers-curve-surface",
        viewBox: `0 0 ${VIEW_WIDTH} ${height}`,
        preserveAspectRatio: "none",
        "data-aspect": control.aspect !== void 0 ? "" : void 0,
        style: control.aspect !== void 0 ? { aspectRatio: control.aspect } : { height },
        role: "img",
        "aria-label": control.label,
        children: [
          baselineY !== null && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
            "line",
            {
              className: "tweakers-curve-baseline",
              x1: 0,
              y1: baselineY,
              x2: VIEW_WIDTH,
              y2: baselineY,
              vectorEffect: "non-scaling-stroke"
            }
          ),
          markerXs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
            "line",
            {
              className: "tweakers-curve-marker",
              x1: m * VIEW_WIDTH,
              y1: 0,
              x2: m * VIEW_WIDTH,
              y2: height,
              vectorEffect: "non-scaling-stroke"
            },
            i
          )),
          pathData && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { className: "tweakers-curve-stroke", d: pathData, fill: "none", vectorEffect: "non-scaling-stroke" })
        ]
      }
    )
  ] });
}

// src/components/FilterControl.tsx
var import_move_layout = require("tweakers/move-layout");
var import_filter_core2 = require("tweakers/filter-core");
var import_jsx_runtime34 = require("react/jsx-runtime");
var FILTER_SURFACE_HEIGHT = 56;
function FilterControl({ control, value, onChange }) {
  const ca = (0, import_filter_core2.resolveFilterAxis)(control.cutoffAxis, "cutoff");
  const ra = (0, import_filter_core2.resolveFilterAxis)(control.resonanceAxis, "resonance");
  const v = (0, import_filter_core2.normalizeFilterValue)(value, ca, ra);
  const shape = (0, import_move_layout.filterShapePath)(control, v);
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "tweakers-filter", children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "tweakers-curve", children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: "tweakers-curve-label", children: control.label }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "tweakers-curve-surface", style: { height: FILTER_SURFACE_HEIGHT }, children: shape && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", style: { display: "block", width: "100%", height: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { className: "tweakers-curve-stroke", d: shape, fill: "none", vectorEffect: "non-scaling-stroke" }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      Slider,
      {
        label: ca.label,
        value: v.cutoff,
        min: ca.min,
        max: ca.max,
        step: ca.step || void 0,
        formatValue: ca.formatValue,
        onChange: (cutoff) => onChange({ ...v, cutoff })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      Slider,
      {
        label: ra.label,
        value: v.resonance,
        min: ra.min,
        max: ra.max,
        step: ra.step || void 0,
        formatValue: ra.formatValue,
        onChange: (resonance) => onChange({ ...v, resonance })
      }
    )
  ] });
}

// src/components/AnalyserRow.tsx
var import_react36 = require("react");
var import_store9 = require("tweakers/store");
var import_curve_preview_core2 = require("tweakers/curve-preview-core");

// src/components/AnalyserVisualization.tsx
var import_react35 = require("react");
var import_analyser_engine = require("tweakers/analyser-engine");
var import_jsx_runtime35 = require("react/jsx-runtime");
function AnalyserVisualization({
  analyser = null,
  analyserB = null,
  source = "frequency",
  variant = "area",
  mode = "smooth",
  pixelSize = 1,
  scale = "log",
  spring = false,
  grid = false,
  gridSubdivisions = 8,
  waveColor,
  fillColor,
  waveColorB,
  transferDraw = "segments",
  windowSize = null,
  muted = false,
  onMuteChange,
  soloed = false,
  onSoloChange,
  rangeHz = null,
  marker = null,
  width = 256,
  height = 140
}) {
  const canvasRef = (0, import_react35.useRef)(null);
  const runtimeRef = (0, import_react35.useRef)(null);
  runtimeRef.current = {
    analyser,
    analyserB,
    source,
    variant,
    mode,
    pixelSize,
    scale,
    spring,
    grid,
    gridSubdivisions,
    waveColor,
    fillColor,
    waveColorB,
    transferDraw,
    windowSize,
    muted,
    rangeHz,
    marker,
    width,
    height
  };
  (0, import_react35.useEffect)(() => {
    if (!canvasRef.current) return;
    const engine = (0, import_analyser_engine.createAnalyserEngine)(canvasRef.current, () => runtimeRef.current);
    return () => engine.destroy();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tweakers-analyser-viz-wrap", style: { width }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("canvas", { ref: canvasRef, className: "tweakers-analyser-viz", style: { width, height } }),
    (onMuteChange || onSoloChange) && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tweakers-analyser-actions", children: [
      onMuteChange && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", "aria-label": "Mute", "aria-pressed": muted, onClick: () => onMuteChange(!muted), children: "M" }),
      onSoloChange && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", "aria-label": "Solo", "aria-pressed": soloed, onClick: () => onSoloChange(!soloed), children: "S" })
    ] })
  ] });
}

// src/components/AnalyserRow.tsx
var import_jsx_runtime36 = require("react/jsx-runtime");
var DEFAULT_HEIGHT = 56;
function AnalyserRow({ panelId, control }) {
  const subscribe = (0, import_react36.useCallback)(
    (callback) => import_store9.TweakStore.subscribeControlState(panelId, callback),
    [panelId]
  );
  const row = (0, import_react36.useSyncExternalStore)(subscribe, () => control.analyserRow, () => control.analyserRow);
  const wrapRef = (0, import_react36.useRef)(null);
  const [width, setWidth] = (0, import_react36.useState)(0);
  (0, import_react36.useLayoutEffect)(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const height = (0, import_curve_preview_core2.clampCurveHeight)(row?.height ?? DEFAULT_HEIGHT);
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "tweakers-analyser-row", ref: wrapRef, children: [
    !control.hideLabel && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "tweakers-curve-label", children: control.label }),
    row && width > 0 && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      AnalyserVisualization,
      {
        analyser: row.analyser() ?? null,
        source: row.source ?? "frequency",
        variant: row.variant ?? "area",
        mode: row.mode ?? "pixelated",
        pixelSize: row.pixelSize ?? 2,
        scale: row.scale ?? "log",
        spring: row.spring ?? false,
        rangeHz: row.rangeHz ?? null,
        marker: row.marker ?? null,
        width,
        height
      }
    )
  ] });
}

// src/components/ControlRenderer.tsx
var import_jsx_runtime37 = require("react/jsx-runtime");
function ControlRenderer({ panelId, controls, values, transitionDuration }) {
  const shortcutCtx = (0, import_react37.useContext)(ShortcutContext);
  const renderControlNode = (control) => {
    const value = values[control.path];
    if (value === void 0 && control.type !== "folder" && control.type !== "action" && control.type !== "curve" && control.type !== "analyser") {
      return null;
    }
    switch (control.type) {
      case "slider":
        if (control.display === "dial") {
          return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            AngleDial,
            {
              label: control.label,
              value,
              onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
              min: control.min,
              max: control.max,
              step: control.step,
              unit: control.unit,
              formatValue: control.formatValue,
              origin: control.origin,
              wrap: control.wrap
            },
            control.path
          );
        }
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          Slider,
          {
            label: control.label,
            value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            min: control.min,
            max: control.max,
            step: control.step,
            unit: control.unit,
            formatValue: control.formatValue,
            origin: control.origin,
            bipolar: control.bipolar,
            orientation: control.orientation,
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path
          },
          control.path
        );
      case "number":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          NumberControl,
          {
            label: control.label,
            value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            min: control.min,
            max: control.max,
            step: control.step,
            unit: control.unit,
            formatValue: control.formatValue,
            orientation: control.orientation
          },
          control.path
        );
      case "transfer":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          TransferCurve,
          {
            label: control.label,
            value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            height: control.curveHeight,
            grid: control.gridDivisions,
            axisLabels: control.axisLabels
          },
          control.path
        );
      case "range":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          RangeSlider,
          {
            label: control.label,
            value,
            min: control.min ?? 0,
            max: control.max ?? 1,
            step: control.step,
            defaultValue: control.rangeDefault,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "toggle":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          Toggle,
          {
            label: control.label,
            checked: value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path
          },
          control.path
        );
      case "spring":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          SpringControl,
          {
            panelId,
            path: control.path,
            label: control.label,
            spring: value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "transition":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          TransitionControl,
          {
            panelId,
            path: control.path,
            label: control.label,
            value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            durationControl: transitionDuration
          },
          control.path
        );
      case "folder": {
        if (control.module) {
          const enabledPath = `${control.path}._enabled`;
          return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            ModuleFolder,
            {
              title: control.label,
              enabled: values[enabledPath],
              onEnabledChange: (v) => import_store10.TweakStore.updateValue(panelId, enabledPath, v),
              defaultOpen: control.defaultOpen ?? true,
              hint: control.hint,
              hintId: (0, import_store10.hintDomId)(panelId, control.path),
              children: control.children?.map(renderControl)
            },
            control.path
          );
        }
        const [first, ...rest] = control.children ?? [];
        const headerTabs = first && first.type === "select" && first.display === "segmented" ? first : null;
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          Folder,
          {
            title: control.label,
            defaultOpen: control.defaultOpen ?? true,
            collapsible: control.collapsible ?? true,
            hint: control.hint,
            hintId: (0, import_store10.hintDomId)(panelId, control.path),
            toolbar: headerTabs ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              SegmentedControl,
              {
                options: (headerTabs.options ?? []).map(
                  (o) => typeof o === "string" ? { value: o, label: o } : o
                ),
                value: values[headerTabs.path],
                onChange: (v) => import_store10.TweakStore.updateValue(panelId, headerTabs.path, v)
              }
            ) : void 0,
            children: (headerTabs ? rest : control.children)?.map(renderControl)
          },
          control.path
        );
      }
      case "text":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          TextControl,
          {
            label: control.label,
            value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            placeholder: control.placeholder
          },
          control.path
        );
      case "select":
        if (control.display === "segmented") {
          return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "tweakers-labeled-control", children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "tweakers-labeled-control-label", children: control.label }),
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              SegmentedControl,
              {
                options: (control.options ?? []).map(
                  (o) => typeof o === "string" ? { value: o, label: o } : o
                ),
                value,
                onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
              }
            )
          ] }, control.path);
        }
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          SelectControl,
          {
            label: control.label,
            value,
            options: control.options ?? [],
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "color":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          ColorControl,
          {
            label: control.label,
            value,
            alpha: control.alpha,
            palette: control.palette,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "gradient":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          GradientControl,
          {
            label: control.label,
            value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            form: control.gradientForm
          },
          control.path
        );
      case "xy":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          XYControl,
          {
            label: control.label,
            value,
            x: control.xAxis,
            y: control.yAxis,
            grid: control.grid,
            density: control.density,
            snap: control.snap,
            returnToCenter: control.returnToCenter,
            showValues: control.showValues,
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "gallery":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          GalleryControl,
          {
            label: control.label,
            value,
            items: control.items ?? [],
            columns: control.columns,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "file":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          FileControl,
          {
            label: control.label,
            value,
            accept: control.accept,
            multiple: control.multiple,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            onPick: (files) => import_store10.TweakStore.emitEvent(panelId, control.path, { kind: "file", files })
          },
          control.path
        );
      case "swatch":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          SwatchControl,
          {
            label: control.label,
            value,
            options: control.swatchOptions ?? [],
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "chips":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          ChipsControl,
          {
            label: control.label,
            value,
            options: control.chipOptions ?? [],
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            onRemove: (v) => import_store10.TweakStore.emitEvent(panelId, control.path, { kind: "remove", value: v })
          },
          control.path
        );
      case "multiselect":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          MultiSelectControl,
          {
            label: control.label,
            value: value ?? [],
            options: control.multiSelectOptions ?? [],
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "list":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          ListControl,
          {
            label: control.label,
            value,
            itemTypes: control.itemTypes ?? {},
            addLabel: control.addLabel,
            maxItems: control.maxItems,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v),
            onEvent: (event) => import_store10.TweakStore.emitEvent(panelId, control.path, event)
          },
          control.path
        );
      case "filter":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          FilterControl,
          {
            control,
            value,
            onChange: (v) => import_store10.TweakStore.updateValue(panelId, control.path, v)
          },
          control.path
        );
      case "curve":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(CurvePreview, { panelId, control }, control.path);
      case "analyser":
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(AnalyserRow, { panelId, control }, control.path);
      case "action": {
        const button = /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          "button",
          {
            className: "tweakers-button",
            disabled: import_store10.TweakStore.isDisabled(panelId, control.path),
            onClick: () => import_store10.TweakStore.triggerAction(panelId, control.path),
            children: control.label
          },
          control.path
        );
        if (control.caption === void 0) return button;
        return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "tweakers-labeled-control tweakers-captioned-action", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "tweakers-labeled-control-label", children: control.caption }),
          button
        ] }, control.path);
      }
      default:
        return null;
    }
  };
  const renderControl = (control) => {
    const node = renderControlNode(control);
    if (control.type === "folder") return node;
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
      ControlShell,
      {
        hint: control.hint,
        title: control.path,
        id: (0, import_store10.hintDomId)(panelId, control.path),
        affordance: control.affordance,
        panelId,
        path: control.path,
        children: node
      },
      control.path
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_jsx_runtime37.Fragment, { children: controls.map(renderControl) });
}

// src/components/PresetManager.tsx
var import_react38 = require("react");
var import_react_dom6 = require("react-dom");
var import_react39 = require("motion/react");
var import_store11 = require("tweakers/store");
var import_icons10 = require("tweakers/icons");
var import_jsx_runtime38 = require("react/jsx-runtime");
function PresetManager({ panelId, presets, activePresetId, onAdd, providerMode = false, editSignal = 0 }) {
  const [isOpen, setIsOpen] = (0, import_react38.useState)(false);
  const triggerRef = (0, import_react38.useRef)(null);
  const dropdownRef = (0, import_react38.useRef)(null);
  const [pos, setPos] = (0, import_react38.useState)({ top: 0, left: 0, width: 0 });
  const [editingId, setEditingId] = (0, import_react38.useState)(null);
  const [draftName, setDraftName] = (0, import_react38.useState)("");
  const editInputRef = (0, import_react38.useRef)(null);
  const lastEditSignal = (0, import_react38.useRef)(editSignal);
  const hasPresets = presets.length > 0;
  const activePreset = presets.find((p) => p.id === activePresetId);
  const open = (0, import_react38.useCallback)(() => {
    if (!hasPresets) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  }, [hasPresets]);
  const close = (0, import_react38.useCallback)(() => setIsOpen(false), []);
  const toggle2 = (0, import_react38.useCallback)(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);
  (0, import_react38.useEffect)(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);
  const handleSelect = (presetId) => {
    import_store11.TweakStore.selectPreset(panelId, presetId);
    close();
  };
  const handleDelete = (e, presetId) => {
    e.stopPropagation();
    import_store11.TweakStore.removePreset(panelId, presetId);
  };
  const startEditing = (0, import_react38.useCallback)((presetId, name) => {
    setEditingId(presetId);
    setDraftName(name);
  }, []);
  const commitEdit = (0, import_react38.useCallback)(() => {
    if (editingId && draftName.trim()) {
      import_store11.TweakStore.renamePreset(panelId, editingId, draftName);
    }
    setEditingId(null);
  }, [panelId, editingId, draftName]);
  (0, import_react38.useEffect)(() => {
    if (editSignal === lastEditSignal.current) return;
    const active = presets.find((p) => p.id === activePresetId);
    if (!active || !(active.renamable ?? true)) return;
    lastEditSignal.current = editSignal;
    open();
    startEditing(active.id, active.name);
  }, [editSignal, activePresetId, presets, open, startEditing]);
  (0, import_react38.useEffect)(() => {
    if (editingId) editInputRef.current?.select();
  }, [editingId]);
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "tweakers-preset-manager", children: [
    /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
      "button",
      {
        ref: triggerRef,
        className: "tweakers-preset-trigger",
        onClick: toggle2,
        "data-open": String(isOpen),
        "data-has-preset": String(!!activePreset),
        "data-disabled": String(!hasPresets),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "tweakers-preset-label", children: activePreset ? activePreset.name : providerMode ? "Presets" : "Version 1" }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
            import_react39.motion.svg,
            {
              className: "tweakers-select-chevron",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.5",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              animate: { rotate: isOpen ? 180 : 0, opacity: hasPresets ? 0.6 : 0.25 },
              transition: { type: "spring", visualDuration: 0.2, bounce: 0.15 },
              children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: import_icons10.ICON_CHEVRON })
            }
          )
        ]
      }
    ),
    (0, import_react_dom6.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(import_react39.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-root tweakers-preset-dropdown",
          style: { position: "fixed", top: pos.top, left: pos.left, minWidth: pos.width },
          initial: { opacity: 0, y: 4, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          children: [
            !providerMode && /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
              "div",
              {
                className: "tweakers-preset-item",
                "data-active": String(!activePresetId),
                onClick: () => handleSelect(null),
                children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "tweakers-preset-name", children: "Version 1" })
              }
            ),
            presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
              "div",
              {
                className: "tweakers-preset-item",
                "data-active": String(preset.id === activePresetId),
                onClick: editingId === preset.id ? void 0 : () => handleSelect(preset.id),
                children: [
                  editingId === preset.id ? /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                    "input",
                    {
                      ref: editInputRef,
                      className: "tweakers-preset-name-input",
                      value: draftName,
                      onChange: (e) => setDraftName(e.target.value),
                      onClick: (e) => e.stopPropagation(),
                      onBlur: commitEdit,
                      onKeyDown: (e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") setEditingId(null);
                        e.stopPropagation();
                      }
                    }
                  ) : /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "tweakers-preset-name", children: preset.name }),
                  editingId !== preset.id && (preset.renamable ?? true) && /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                    "button",
                    {
                      className: "tweakers-preset-rename",
                      onClick: (e) => {
                        e.stopPropagation();
                        startEditing(preset.id, preset.name);
                      },
                      title: "Rename preset",
                      children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: import_icons10.ICON_PENCIL.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d }, i)) })
                    }
                  ),
                  editingId !== preset.id && (preset.deletable ?? true) && /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
                    "button",
                    {
                      className: "tweakers-preset-delete",
                      onClick: (e) => handleDelete(e, preset.id),
                      title: "Delete preset",
                      children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: import_icons10.ICON_TRASH.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d }, i)) })
                    }
                  )
                ]
              },
              preset.id
            ))
          ]
        }
      ) }),
      document.body
    )
  ] });
}

// src/components/Panel.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
function Panel({ panel, defaultOpen = true, inline = false, toolbarExtra }) {
  const [copied, setCopied] = (0, import_react40.useState)(false);
  const [, setIsPanelOpen] = (0, import_react40.useState)(defaultOpen);
  const values = (0, import_react40.useSyncExternalStore)(
    (cb) => import_store12.TweakStore.subscribe(panel.id, cb),
    () => import_store12.TweakStore.getValues(panel.id),
    () => import_store12.TweakStore.getValues(panel.id)
  );
  const presets = import_store12.TweakStore.getPresetItems(panel.id);
  const activePresetId = import_store12.TweakStore.getActivePresetId(panel.id);
  const providerMode = import_store12.TweakStore.hasPresetProvider(panel.id);
  const [presetEditSignal, setPresetEditSignal] = (0, import_react40.useState)(0);
  const handleAddPreset = () => {
    import_store12.TweakStore.createPreset(panel.id);
    setPresetEditSignal((n) => n + 1);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText((0, import_copy_instruction.buildCopyInstruction)("useTweakers", panel.name, values));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const { tabs, activeTab, looseControls, pageControls } = splitPanelTabs(panel.controls, values[import_store12.TAB_PATH]);
  const tabBar = activeTab ? /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    SegmentedControl,
    {
      options: tabs.map((tab) => ({ value: tab.path, label: tab.label })),
      value: activeTab.path,
      onChange: (v) => import_store12.TweakStore.updateValue(panel.id, import_store12.TAB_PATH, v)
    }
  ) : void 0;
  const renderRows = (controls) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(ControlRenderer, { panelId: panel.id, controls, values });
  const renderControls = () => activeTab ? /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(import_jsx_runtime39.Fragment, { children: [
    renderRows(looseControls),
    /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "tweakers-panel-tab-page", children: renderRows(pageControls) }, activeTab.path)
  ] }) : renderRows(pageControls);
  const presetsHidden = import_store12.TweakStore.arePresetsHidden(panel.id);
  const toolbar = presetsHidden ? toolbarExtra : /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(import_jsx_runtime39.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
      import_react41.motion.button,
      {
        className: "tweakers-toolbar-add",
        onClick: handleAddPreset,
        title: "Add preset",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: import_icons11.ICON_ADD_PRESET.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("path", { d }, i)) })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
      PresetManager,
      {
        panelId: panel.id,
        presets,
        activePresetId,
        onAdd: handleAddPreset,
        providerMode,
        editSignal: presetEditSignal
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
      import_react41.motion.button,
      {
        className: "tweakers-toolbar-add",
        onClick: handleCopy,
        title: "Copy parameters",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("span", { style: { position: "relative", width: 14, height: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(import_react41.AnimatePresence, { initial: false, mode: "wait", children: copied ? /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
          import_react41.motion.svg,
          {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: { position: "absolute", inset: 0, width: 14, height: 14, color: "var(--tweak-text-label)" },
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.08 },
            children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("path", { d: import_icons11.ICON_CHECK })
          },
          "check"
        ) : /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(
          import_react41.motion.svg,
          {
            viewBox: "0 0 24 24",
            fill: "none",
            style: { position: "absolute", inset: 0, width: 14, height: 14, color: "var(--tweak-text-label)" },
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.08 },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("path", { d: import_icons11.ICON_CLIPBOARD.board, stroke: "currentColor", strokeWidth: "2", strokeLinejoin: "round" }),
              /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("path", { d: import_icons11.ICON_CLIPBOARD.sparkle, fill: "currentColor" }),
              /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("path", { d: import_icons11.ICON_CLIPBOARD.body, stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
            ]
          },
          "clipboard"
        ) }) })
      }
    ),
    toolbarExtra
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "tweakers-panel-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    Folder,
    {
      title: panel.name,
      defaultOpen,
      isRoot: true,
      inline,
      onOpenChange: setIsPanelOpen,
      toolbar,
      tabs: tabBar,
      enabled: panel.module ? values["_enabled"] : void 0,
      onEnabledChange: panel.module ? (v) => import_store12.TweakStore.updateValue(panel.id, "_enabled", v) : void 0,
      children: renderControls()
    }
  ) });
}

// src/components/Timeline/TimelineToggleButton.tsx
var import_react42 = require("react");
var import_react43 = require("motion/react");
var import_icons12 = require("tweakers/icons");
var import_timeline = require("tweakers/timeline");
var import_jsx_runtime40 = require("react/jsx-runtime");
function TimelineToggleButton() {
  const subscribe = (0, import_react42.useCallback)(
    (listener) => import_timeline.TimelineUiStore.subscribe(listener),
    []
  );
  const getVisible = (0, import_react42.useCallback)(() => import_timeline.TimelineUiStore.getVisible(), []);
  const visible = (0, import_react42.useSyncExternalStore)(subscribe, getVisible, getVisible);
  const label = visible ? "Hide timeline" : "Show timeline";
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
    import_react43.motion.button,
    {
      className: "tweakers-toolbar-add tweakers-timeline-toolbar-toggle",
      "data-active": visible || void 0,
      "aria-pressed": visible,
      "aria-label": label,
      title: label,
      onClick: () => import_timeline.TimelineUiStore.toggle(),
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: import_icons12.ICON_TIMELINE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("path", { d, fill: "currentColor" }, i)) })
    }
  );
}

// src/components/TweakRoot.tsx
var import_jsx_runtime41 = require("react/jsx-runtime");
function TweakRoot({ position = "top-right", defaultOpen = true, mode = "popover", theme = "system", productionEnabled = import_env.isDevDefault, panels: only, chrome = "card" }) {
  if (!productionEnabled) return null;
  const [panels, setPanels] = (0, import_react44.useState)([]);
  const [timelineCount, setTimelineCount] = (0, import_react44.useState)(0);
  const [mounted, setMounted] = (0, import_react44.useState)(false);
  const inline = mode === "inline";
  const panelRef = (0, import_react44.useRef)(null);
  const [dragOffset, setDragOffset] = (0, import_react44.useState)(null);
  const [activePosition, setActivePosition] = (0, import_react44.useState)(position);
  const lastDragOffset = (0, import_react44.useRef)(null);
  const draggingRef = (0, import_react44.useRef)(false);
  const dragStartRef = (0, import_react44.useRef)(null);
  const didDragRef = (0, import_react44.useRef)(false);
  const onlyKey = Array.isArray(only) ? only.join("\0") : only;
  const read = (0, import_react44.useCallback)(
    () => import_store13.TweakStore.selectPanels(onlyKey === void 0 ? void 0 : onlyKey.split("\0")),
    [onlyKey]
  );
  (0, import_react44.useEffect)(() => {
    setMounted(true);
    setPanels(read());
    setTimelineCount(import_timeline2.TimelineStore.getTimelines().length);
    const unsubscribePanels = import_store13.TweakStore.subscribeGlobal(() => {
      setPanels(read());
    });
    const unsubscribeTimelines = import_timeline2.TimelineStore.subscribeGlobal(() => {
      setTimelineCount(import_timeline2.TimelineStore.getTimelines().length);
    });
    return () => {
      unsubscribePanels();
      unsubscribeTimelines();
    };
  }, []);
  (0, import_react44.useEffect)(() => {
    if (!panelRef.current || inline) return;
    const observer = new MutationObserver(() => {
      const inner = panelRef.current?.querySelector(".tweakers-panel-inner");
      if (!inner) return;
      const collapsed = inner.getAttribute("data-collapsed") === "true";
      if (!collapsed) {
        if (dragOffset) {
          lastDragOffset.current = dragOffset;
          const bubbleCenterX = dragOffset.x + 21;
          const midX = window.innerWidth / 2;
          setActivePosition(bubbleCenterX < midX ? "top-left" : "top-right");
        } else {
          setActivePosition(position);
        }
        setDragOffset(null);
      } else if (lastDragOffset.current) {
        setDragOffset(lastDragOffset.current);
      }
    });
    observer.observe(panelRef.current, { subtree: true, attributes: true, attributeFilter: ["data-collapsed"] });
    return () => observer.disconnect();
  }, [inline, dragOffset, position]);
  const handlePointerDown = (0, import_react44.useCallback)((e) => {
    const inner = panelRef.current?.querySelector(".tweakers-panel-inner");
    if (!inner || inner.getAttribute("data-collapsed") !== "true") return;
    const rect = panelRef.current.getBoundingClientRect();
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      elX: rect.left,
      elY: rect.top
    };
    didDragRef.current = false;
    draggingRef.current = true;
    e.target.setPointerCapture(e.pointerId);
  }, []);
  const handlePointerMove = (0, import_react44.useCallback)((e) => {
    if (!draggingRef.current || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;
    if (!didDragRef.current && Math.abs(dx) + Math.abs(dy) < 4) return;
    didDragRef.current = true;
    setDragOffset({
      x: dragStartRef.current.elX + dx,
      y: dragStartRef.current.elY + dy
    });
  }, []);
  const handlePointerUp = (0, import_react44.useCallback)((e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    dragStartRef.current = null;
    if (didDragRef.current) {
      e.stopPropagation();
      const inner = panelRef.current?.querySelector(".tweakers-panel-inner");
      if (inner) {
        const blocker = (ev) => {
          ev.stopPropagation();
        };
        inner.addEventListener("click", blocker, { capture: true, once: true });
      }
    }
  }, []);
  if (!mounted || typeof window === "undefined") {
    return null;
  }
  if (panels.length === 0 && (onlyKey !== void 0 || timelineCount === 0)) {
    return null;
  }
  const dragStyle = dragOffset ? {
    top: dragOffset.y,
    left: dragOffset.x,
    right: "auto",
    bottom: "auto"
  } : void 0;
  const timelineToggle = timelineCount > 0 && onlyKey === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(TimelineToggleButton, {}) : null;
  const content = /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(ShortcutListener, { children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-root", "data-mode": mode, "data-theme": theme, "data-chrome": chrome, children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
    "div",
    {
      ref: panelRef,
      className: "tweakers-panel",
      "data-position": inline ? void 0 : dragOffset ? void 0 : activePosition,
      "data-mode": mode,
      style: dragStyle,
      onPointerDown: !inline ? handlePointerDown : void 0,
      onPointerMove: !inline ? handlePointerMove : void 0,
      onPointerUp: !inline ? handlePointerUp : void 0,
      children: panels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-panel-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
        Folder,
        {
          title: "Tweakers",
          defaultOpen: inline || defaultOpen,
          isRoot: true,
          inline,
          toolbar: timelineToggle,
          children: /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("div", { className: "tweakers-timeline-toolkit-only", children: "Timeline" })
        }
      ) }) : panels.map((panel) => /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(Panel, { panel, defaultOpen: inline || defaultOpen, inline, toolbarExtra: timelineToggle }, panel.id))
    }
  ) }) });
  if (inline) {
    return content;
  }
  return (0, import_react_dom7.createPortal)(content, document.body);
}

// src/index.ts
var import_filter_core3 = require("tweakers/filter-core");
var import_modulation_store2 = require("tweakers/modulation-store");
var import_modulation_core = require("tweakers/modulation-core");

// src/hooks/useTweakTimeline.ts
var import_react45 = require("react");
var import_timeline3 = require("tweakers/timeline");
var import_timeline4 = require("tweakers/timeline");
var import_timeline5 = require("tweakers/timeline");
function useTweakTimeline(name, config, options) {
  const serializedConfig = useSerialized(config);
  const parsed = (0, import_react45.useMemo)(() => (0, import_timeline4.parseTimelineConfig)(config), [serializedConfig]);
  const { panelId, flatValues } = useTweakStorePanel(name, parsed.tweakConfig, {
    id: options?.id,
    persist: options?.persist,
    kind: "timeline"
  });
  const staticTimeline = (0, import_react45.useMemo)(
    () => (0, import_timeline4.computeStaticTimeline)(parsed, flatValues),
    [parsed, flatValues]
  );
  const timelineDuration = staticTimeline.duration;
  const staticClips = staticTimeline.clips;
  const parsedRef = (0, import_react45.useRef)(parsed);
  parsedRef.current = parsed;
  const optionsRef = (0, import_react45.useRef)(options);
  optionsRef.current = options;
  const buildMeta = (0, import_react45.useCallback)(
    () => (0, import_timeline5.buildTimelineMeta)(panelId, name, timelineDuration, parsedRef.current, options?.loop),
    [panelId, name, timelineDuration, options?.loop]
  );
  const buildMetaRef = (0, import_react45.useRef)(buildMeta);
  buildMetaRef.current = buildMeta;
  (0, import_react45.useEffect)(() => {
    import_timeline3.TimelineStore.register(buildMetaRef.current(), {
      autoplay: optionsRef.current?.autoplay ?? true,
      persist: optionsRef.current?.persist
    });
    return () => import_timeline3.TimelineStore.unregister(panelId);
  }, [panelId, name]);
  const mountedRef = (0, import_react45.useRef)(false);
  (0, import_react45.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    import_timeline3.TimelineStore.update(buildMeta());
  }, [buildMeta, parsed]);
  const subscribeTransport = (0, import_react45.useCallback)(
    (callback) => import_timeline3.TimelineStore.subscribe(panelId, callback),
    [panelId]
  );
  const getTransport = (0, import_react45.useCallback)(() => import_timeline3.TimelineStore.getTransport(panelId), [panelId]);
  const transport = (0, import_react45.useSyncExternalStore)(subscribeTransport, getTransport, getTransport);
  const getLoopRegion = (0, import_react45.useCallback)(() => import_timeline3.TimelineStore.getLoopRegion(panelId), [panelId]);
  const loopRegion = (0, import_react45.useSyncExternalStore)(subscribeTransport, getLoopRegion, getLoopRegion);
  const loopStart = loopRegion ? loopRegion.start : 0;
  const loopEnd = loopRegion ? loopRegion.end : timelineDuration;
  const play = (0, import_react45.useCallback)(() => import_timeline3.TimelineStore.play(panelId), [panelId]);
  const pause = (0, import_react45.useCallback)(() => import_timeline3.TimelineStore.pause(panelId), [panelId]);
  const replay = (0, import_react45.useCallback)(() => import_timeline3.TimelineStore.replay(panelId), [panelId]);
  const seek = (0, import_react45.useCallback)((time) => import_timeline3.TimelineStore.seek(panelId, time), [panelId]);
  return (0, import_react45.useMemo)(
    () => (0, import_timeline5.buildTimelineValues)(staticClips, transport, timelineDuration, loopStart, loopEnd, {
      play,
      pause,
      replay,
      seek
    }),
    [staticClips, transport, timelineDuration, loopStart, loopEnd, play, pause, replay, seek]
  );
}

// src/components/Timeline/TweakTimeline.tsx
var import_react46 = require("react");
var import_react_dom8 = require("react-dom");
var import_react47 = require("motion/react");
var import_store14 = require("tweakers/store");
var import_timeline6 = require("tweakers/timeline");
var import_timeline7 = require("tweakers/timeline");
var import_timeline8 = require("tweakers/timeline");
var import_transition_math = require("tweakers/transition-math");
var import_copy_instruction2 = require("tweakers/copy-instruction");
var import_env2 = require("tweakers/env");
var import_icons13 = require("tweakers/icons");
var import_shortcut_utils7 = require("tweakers/shortcut-utils");
var import_jsx_runtime42 = require("react/jsx-runtime");
var DRAG_THRESHOLD_PX = 3;
var LOOP_DRAG_THRESHOLD_PX = 4;
var MAJOR_TICK_TARGET_PX = 140;
var MILLISECOND_STEP = 1e-3;
var SECOND_TICK_STEPS = [
  1e-3,
  2e-3,
  5e-3,
  0.01,
  0.02,
  0.05,
  0.1,
  0.2,
  0.5,
  1,
  2,
  5,
  10,
  15,
  30,
  60,
  120,
  300,
  600
];
var MIN_TIMELINE_MAX_ZOOM = 8;
var PLAYHEAD_FLAG_WIDTH = 52;
var PLAYHEAD_FLAG_EDGE_OVERHANG = 1;
var POPOVER_WIDTH = 280;
var ZOOM_DRAG_DISTANCE = 180;
var DEFAULT_DOCK_MAX_HEIGHT = 400;
var MIN_DOCK_MAX_HEIGHT = 120;
var subscribeGlobalTimelines = (callback) => import_timeline6.TimelineStore.subscribeGlobal(callback);
var getTimelines = () => import_timeline6.TimelineStore.getTimelines();
var subscribeTimelineVisibility = (callback) => import_timeline7.TimelineUiStore.subscribe(callback);
var getTimelineVisibility = () => import_timeline7.TimelineUiStore.getVisible();
var TweakTimeline = (0, import_react46.memo)(function TweakTimeline2({
  theme = "system",
  defaultVisible = true,
  visible,
  onVisibilityChange,
  defaultOpen = true,
  productionEnabled = import_env2.isDevDefault
}) {
  if (!productionEnabled) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
    TweakTimelineDock,
    {
      theme,
      defaultVisible,
      visible,
      onVisibilityChange,
      defaultOpen
    }
  );
});
function TweakTimelineDock({
  theme,
  defaultVisible,
  visible,
  onVisibilityChange,
  defaultOpen
}) {
  const [mounted, setMounted] = (0, import_react46.useState)(false);
  const [dockMaxHeight, setDockMaxHeight] = (0, import_react46.useState)(DEFAULT_DOCK_MAX_HEIGHT);
  const visibilityControllerId = (0, import_react46.useRef)(/* @__PURE__ */ Symbol("tweakers-timeline-visibility"));
  const dockRef = (0, import_react46.useRef)(null);
  const resizeCleanupRef = (0, import_react46.useRef)(null);
  (0, import_react46.useEffect)(() => import_timeline7.TimelineUiStore.registerController(visibilityControllerId.current, {
    visible,
    defaultVisible,
    onVisibilityChange
  }), []);
  (0, import_react46.useEffect)(() => {
    import_timeline7.TimelineUiStore.updateController(visibilityControllerId.current, {
      visible,
      defaultVisible,
      onVisibilityChange
    });
  }, [defaultVisible, onVisibilityChange, visible]);
  (0, import_react46.useEffect)(() => {
    setMounted(true);
  }, []);
  (0, import_react46.useEffect)(() => () => resizeCleanupRef.current?.(), []);
  const handleResizePointerDown = (0, import_react46.useCallback)((e) => {
    const dock = dockRef.current;
    if (!dock) return;
    e.preventDefault();
    e.stopPropagation();
    resizeCleanupRef.current?.();
    const pointerY = e.clientY;
    const startHeight = dock.getBoundingClientRect().height;
    const handlePointerMove = (event) => {
      event.preventDefault();
      const viewportMax = Math.max(MIN_DOCK_MAX_HEIGHT, window.innerHeight - 24);
      setDockMaxHeight((0, import_transition_math.clamp)(startHeight + pointerY - event.clientY, MIN_DOCK_MAX_HEIGHT, viewportMax));
    };
    const finishResize = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishResize);
      window.removeEventListener("pointercancel", finishResize);
      resizeCleanupRef.current = null;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", finishResize);
    window.addEventListener("pointercancel", finishResize);
    resizeCleanupRef.current = finishResize;
  }, []);
  const timelines = (0, import_react46.useSyncExternalStore)(subscribeGlobalTimelines, getTimelines, getTimelines);
  const dockVisible = (0, import_react46.useSyncExternalStore)(
    subscribeTimelineVisibility,
    getTimelineVisibility,
    getTimelineVisibility
  );
  if (!mounted || typeof window === "undefined" || timelines.length === 0) {
    return null;
  }
  return (0, import_react_dom8.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-root tweakers-timeline", "data-theme": theme, hidden: !dockVisible, children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
        "div",
        {
          className: "tweakers-timeline-resize-handle",
          onPointerDown: handleResizePointerDown,
          role: "separator",
          "aria-label": "Resize timeline height",
          "aria-orientation": "horizontal",
          title: "Drag to resize timeline"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
        "div",
        {
          ref: dockRef,
          className: "tweakers-timeline-dock",
          style: { maxHeight: `min(${dockMaxHeight}px, calc(100vh - 24px))` },
          children: timelines.map((timeline) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
            TimelineSection,
            {
              meta: timeline,
              defaultOpen,
              theme,
              dockVisible
            },
            timeline.id
          ))
        }
      )
    ] }),
    document.body
  );
}
function useTransportSubscribe(id) {
  return (0, import_react46.useCallback)((callback) => import_timeline6.TimelineStore.subscribe(id, callback), [id]);
}
function PlayPauseButton({ id }) {
  const subscribe = useTransportSubscribe(id);
  const getPlaying = (0, import_react46.useCallback)(() => import_timeline6.TimelineStore.getTransport(id).playing, [id]);
  const playing = (0, import_react46.useSyncExternalStore)(subscribe, getPlaying, getPlaying);
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
    import_react47.motion.button,
    {
      className: "tweakers-toolbar-add",
      onClick: () => playing ? import_timeline6.TimelineStore.pause(id) : import_timeline6.TimelineStore.play(id),
      title: playing ? "Pause" : "Play",
      "aria-label": playing ? "Pause" : "Play",
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { style: { position: "relative", width: 16, height: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_react47.AnimatePresence, { initial: false, mode: "wait", children: playing ? /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
        import_react47.motion.svg,
        {
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.08 },
          children: import_icons13.ICON_PAUSE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d, fill: "currentColor" }, i))
        },
        "pause"
      ) : /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
        import_react47.motion.svg,
        {
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { duration: 0.08 },
          children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_PLAY, fill: "currentColor" })
        },
        "play"
      ) }) })
    }
  );
}
function ReplayButton({ onReplay }) {
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
    import_react47.motion.button,
    {
      className: "tweakers-toolbar-add",
      onClick: onReplay,
      title: "Replay",
      "aria-label": "Replay",
      whileTap: { scale: 0.9 },
      transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
      children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: import_icons13.ICON_REPLAY.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d, fill: "currentColor" }, i)) })
    }
  );
}
function TimelinePlayheadFlag({
  id,
  duration,
  pxPerSecond,
  viewStart,
  viewEnd,
  laneWidth,
  rulerRef,
  onResetView
}) {
  const subscribe = useTransportSubscribe(id);
  const getTime = (0, import_react46.useCallback)(() => import_timeline6.TimelineStore.getTransport(id).time, [id]);
  const time = (0, import_react46.useSyncExternalStore)(subscribe, getTime, getTime);
  const scrubRef = (0, import_react46.useRef)(null);
  const cleanupScrubRef = (0, import_react46.useRef)(null);
  const seekFromClientX = (0, import_react46.useCallback)((clientX) => {
    const rect = scrubRef.current?.rect;
    const scrub = scrubRef.current;
    const contentWidth = rect?.width ?? 0;
    if (!rect || !scrub || contentWidth <= 0) return;
    const nextTime = (0, import_transition_math.clamp)(
      scrub.viewStart + (clientX - rect.left) / contentWidth * (scrub.viewEnd - scrub.viewStart),
      scrub.viewStart,
      scrub.viewEnd
    );
    import_timeline6.TimelineStore.seek(id, nextTime);
  }, [id]);
  const handlePointerDown = (0, import_react46.useCallback)((e) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.stopPropagation();
    cleanupScrubRef.current?.();
    const resetView = e.shiftKey;
    scrubRef.current = {
      wasPlaying: import_timeline6.TimelineStore.getTransport(id).playing,
      rect,
      viewStart: resetView ? 0 : viewStart,
      viewEnd: resetView ? duration : viewEnd
    };
    if (resetView) onResetView();
    import_timeline6.TimelineStore.pause(id);
    seekFromClientX(e.clientX);
    const handleWindowPointerMove = (event) => {
      event.preventDefault();
      seekFromClientX(event.clientX);
    };
    const finishWindowScrub = () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", finishWindowScrub);
      window.removeEventListener("pointercancel", finishWindowScrub);
      if (scrubRef.current?.wasPlaying) import_timeline6.TimelineStore.play(id);
      scrubRef.current = null;
      cleanupScrubRef.current = null;
    };
    window.addEventListener("pointermove", handleWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", finishWindowScrub);
    window.addEventListener("pointercancel", finishWindowScrub);
    cleanupScrubRef.current = finishWindowScrub;
  }, [duration, id, onResetView, rulerRef, seekFromClientX, viewEnd, viewStart]);
  (0, import_react46.useEffect)(() => () => cleanupScrubRef.current?.(), []);
  if (time < viewStart || time > viewEnd || laneWidth <= 0) return null;
  const x = (0, import_transition_math.clamp)(
    (time - viewStart) * pxPerSecond,
    0,
    laneWidth
  );
  const flagCenter = (0, import_transition_math.clamp)(
    x,
    PLAYHEAD_FLAG_WIDTH / 2 - PLAYHEAD_FLAG_EDGE_OVERHANG,
    laneWidth - PLAYHEAD_FLAG_WIDTH / 2 + PLAYHEAD_FLAG_EDGE_OVERHANG
  );
  const flagOffset = flagCenter - x;
  const edge = flagOffset > 0.5 ? "start" : flagOffset < -0.5 ? "end" : "center";
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
    "div",
    {
      className: "tweakers-timeline-playhead-control",
      "data-edge": edge,
      style: {
        left: `calc(var(--tweak-timeline-label-w) + ${x}px)`,
        "--tweak-timeline-playhead-flag-offset": `${flagOffset}px`
      },
      onPointerDown: handlePointerDown,
      role: "slider",
      "aria-label": "Timeline current time",
      "aria-valuemin": 0,
      "aria-valuemax": duration,
      "aria-valuenow": time,
      title: "Drag to scrub the timeline",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-playhead-stem" }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-playhead-anchor", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-playhead-flag", children: time.toFixed(2) }) })
      ]
    }
  );
}
function TimelineOverview({
  id,
  duration,
  viewStart,
  viewEnd,
  onNavigate
}) {
  const subscribe = useTransportSubscribe(id);
  const getTime = (0, import_react46.useCallback)(() => import_timeline6.TimelineStore.getTransport(id).time, [id]);
  const time = (0, import_react46.useSyncExternalStore)(subscribe, getTime, getTime);
  const scrubRef = (0, import_react46.useRef)(null);
  const seekFromClientX = (0, import_react46.useCallback)((clientX) => {
    const rect = scrubRef.current?.rect;
    if (!rect || rect.width <= 0 || duration <= 0) return;
    const nextTime = (0, import_transition_math.clamp)((clientX - rect.left) / rect.width * duration, 0, duration);
    import_timeline6.TimelineStore.seek(id, nextTime);
    onNavigate(nextTime);
  }, [duration, id, onNavigate]);
  const handlePointerDown = (0, import_react46.useCallback)((e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubRef.current = {
      wasPlaying: import_timeline6.TimelineStore.getTransport(id).playing,
      rect: e.currentTarget.getBoundingClientRect()
    };
    import_timeline6.TimelineStore.pause(id);
    seekFromClientX(e.clientX);
  }, [id, seekFromClientX]);
  const handlePointerMove = (0, import_react46.useCallback)((e) => {
    if (scrubRef.current) seekFromClientX(e.clientX);
  }, [seekFromClientX]);
  const finishScrub = (0, import_react46.useCallback)(() => {
    if (scrubRef.current?.wasPlaying) import_timeline6.TimelineStore.play(id);
    scrubRef.current = null;
  }, [id]);
  const viewportLeft = duration > 0 ? viewStart / duration * 100 : 0;
  const viewportWidth = duration > 0 ? (viewEnd - viewStart) / duration * 100 : 100;
  const playheadLeft = duration > 0 ? time / duration * 100 : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
    "div",
    {
      className: "tweakers-timeline-overview",
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishScrub,
      onPointerCancel: finishScrub,
      onLostPointerCapture: finishScrub,
      title: "Drag to scrub the full timeline",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          "div",
          {
            className: "tweakers-timeline-overview-viewport",
            "data-zoomed": viewportWidth < 99.999 || void 0,
            style: { left: `${viewportLeft}%`, width: `${viewportWidth}%` }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-overview-progress", style: { width: `${playheadLeft}%` } }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-overview-playhead", style: { left: `${playheadLeft}%` } })
      ]
    }
  );
}
function clampViewStart(start, duration, visibleDuration) {
  return (0, import_transition_math.clamp)(start, 0, Math.max(0, duration - visibleDuration));
}
function formatRulerSeconds(time, step) {
  if (step >= 1 && Number.isInteger(time)) return (0, import_timeline8.formatClock)(time);
  const decimals = Math.min(3, Math.max(1, Math.ceil(-Math.log10(step))));
  return `${time.toFixed(decimals)}s`;
}
var TimelineSection = (0, import_react46.memo)(function TimelineSection2({
  meta,
  defaultOpen,
  theme,
  dockVisible
}) {
  const [open, setOpen] = (0, import_react46.useState)(defaultOpen);
  const [copied, setCopied] = (0, import_react46.useState)(false);
  const [popover, setPopover] = (0, import_react46.useState)(null);
  const [collapsedGroups, setCollapsedGroups] = (0, import_react46.useState)(() => /* @__PURE__ */ new Set());
  const [expandedTracks, setExpandedTracks] = (0, import_react46.useState)(() => /* @__PURE__ */ new Set());
  const [zoom, setZoom] = (0, import_react46.useState)(1);
  const [viewStart, setViewStart] = (0, import_react46.useState)(0);
  const subscribeValues = (0, import_react46.useCallback)(
    (callback) => import_store14.TweakStore.subscribe(meta.id, callback),
    [meta.id]
  );
  const getValues = (0, import_react46.useCallback)(() => import_store14.TweakStore.getValues(meta.id), [meta.id]);
  const values = (0, import_react46.useSyncExternalStore)(subscribeValues, getValues, getValues);
  const presets = import_store14.TweakStore.getPresets(meta.id);
  const activePresetId = import_store14.TweakStore.getActivePresetId(meta.id);
  const subscribeLoopRegion = (0, import_react46.useCallback)(
    (callback) => import_timeline6.TimelineStore.subscribe(meta.id, callback),
    [meta.id]
  );
  const getLoopRegion = (0, import_react46.useCallback)(() => import_timeline6.TimelineStore.getLoopRegion(meta.id), [meta.id]);
  const loopRegion = (0, import_react46.useSyncExternalStore)(subscribeLoopRegion, getLoopRegion, getLoopRegion);
  const [loopDrag, setLoopDrag] = (0, import_react46.useState)(null);
  const laneAreaRef = (0, import_react46.useRef)(null);
  const horizontalScrollRef = (0, import_react46.useRef)(null);
  const [laneWidth, setLaneWidth] = (0, import_react46.useState)(0);
  (0, import_react46.useLayoutEffect)(() => {
    if (!open) return;
    const ruler = laneAreaRef.current;
    if (!ruler) return;
    const measure = () => {
      setLaneWidth(ruler.getBoundingClientRect().width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ruler);
    return () => observer.disconnect();
  }, [open]);
  const visibleDuration = meta.duration > 0 ? meta.duration / zoom : meta.duration;
  const safeViewStart = clampViewStart(viewStart, meta.duration, visibleDuration);
  const viewEnd = safeViewStart + visibleDuration;
  const pxPerSecond = visibleDuration > 0 && laneWidth > 0 ? laneWidth / visibleDuration : 0;
  const millisecondReadableZoom = laneWidth > 0 && meta.duration > 0 ? MAJOR_TICK_TARGET_PX * meta.duration / (MILLISECOND_STEP * 10 * laneWidth) : MIN_TIMELINE_MAX_ZOOM;
  const maxZoom = Math.max(MIN_TIMELINE_MAX_ZOOM, millisecondReadableZoom);
  (0, import_react46.useEffect)(() => {
    setZoom((current) => (0, import_transition_math.clamp)(current, 1, maxZoom));
  }, [maxZoom]);
  (0, import_react46.useEffect)(() => {
    setViewStart((current) => clampViewStart(current, meta.duration, meta.duration / zoom));
  }, [meta.duration, zoom]);
  (0, import_react46.useLayoutEffect)(() => {
    const scroller = horizontalScrollRef.current;
    if (!scroller || pxPerSecond <= 0) return;
    const nextScrollLeft = safeViewStart * pxPerSecond;
    if (Math.abs(scroller.scrollLeft - nextScrollLeft) > 0.5) {
      scroller.scrollLeft = nextScrollLeft;
    }
  }, [open, pxPerSecond, safeViewStart]);
  (0, import_react46.useEffect)(() => {
    if (!dockVisible) setPopover(null);
  }, [dockVisible]);
  const centerViewAt = (0, import_react46.useCallback)((time) => {
    if (zoom <= 1 || meta.duration <= 0) return;
    const windowDuration = meta.duration / zoom;
    setViewStart(clampViewStart(time - windowDuration / 2, meta.duration, windowDuration));
  }, [meta.duration, zoom]);
  const resetView = (0, import_react46.useCallback)(() => {
    setZoom(1);
    setViewStart(0);
  }, []);
  const handleReplay = (0, import_react46.useCallback)(() => {
    setViewStart(0);
    import_timeline6.TimelineStore.replay(meta.id);
  }, [meta.id]);
  const handleClearLoopRegion = (0, import_react46.useCallback)(() => {
    import_timeline6.TimelineStore.clearLoopRegion(meta.id);
  }, [meta.id]);
  const handleHorizontalScroll = (0, import_react46.useCallback)((e) => {
    if (pxPerSecond <= 0) return;
    setViewStart(clampViewStart(
      e.currentTarget.scrollLeft / pxPerSecond,
      meta.duration,
      visibleDuration
    ));
  }, [meta.duration, pxPerSecond, visibleDuration]);
  const handleTimelineWheel = (0, import_react46.useCallback)((e) => {
    const scroller = horizontalScrollRef.current;
    if (!scroller || zoom <= 1) return;
    const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (horizontalDelta === 0) return;
    e.preventDefault();
    scroller.scrollLeft += horizontalDelta;
  }, [zoom]);
  const zoomDragRef = (0, import_react46.useRef)(null);
  const rulerGestureRef = (0, import_react46.useRef)(null);
  const rulerTimeFromClientX = (0, import_react46.useCallback)(
    (clientX, rect, viewStartAt, visibleAt) => (0, import_transition_math.clamp)(
      viewStartAt + (clientX - rect.left) / rect.width * visibleAt,
      viewStartAt,
      viewStartAt + visibleAt
    ),
    []
  );
  const handleRulerPointerDown = (0, import_react46.useCallback)((e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const contentWidth = rect.width;
    if (contentWidth <= 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!e.altKey) {
      const resetView2 = e.shiftKey;
      const gestureViewStart = resetView2 ? 0 : safeViewStart;
      const gestureVisible = resetView2 ? meta.duration : visibleDuration;
      if (resetView2) {
        setZoom(1);
        setViewStart(0);
      }
      rulerGestureRef.current = {
        downClientX: e.clientX,
        downTime: rulerTimeFromClientX(e.clientX, rect, gestureViewStart, gestureVisible),
        rect,
        viewStart: gestureViewStart,
        visibleDuration: gestureVisible,
        moved: false
      };
      return;
    }
    const anchorRatio = (0, import_transition_math.clamp)((e.clientX - rect.left) / contentWidth, 0, 1);
    zoomDragRef.current = {
      pointerX: e.clientX,
      rect,
      zoom,
      viewStart: safeViewStart,
      anchorRatio,
      anchorTime: safeViewStart + anchorRatio * visibleDuration,
      moved: false
    };
  }, [meta.duration, rulerTimeFromClientX, safeViewStart, visibleDuration, zoom]);
  const handleRulerPointerMove = (0, import_react46.useCallback)((e) => {
    const gesture = rulerGestureRef.current;
    if (gesture) {
      const dx2 = e.clientX - gesture.downClientX;
      if (!gesture.moved && Math.abs(dx2) <= LOOP_DRAG_THRESHOLD_PX) return;
      gesture.moved = true;
      const current = rulerTimeFromClientX(e.clientX, gesture.rect, gesture.viewStart, gesture.visibleDuration);
      setLoopDrag({
        start: Math.min(gesture.downTime, current),
        end: Math.max(gesture.downTime, current)
      });
      return;
    }
    const drag = zoomDragRef.current;
    if (!drag || meta.duration <= 0) return;
    const dx = e.clientX - drag.pointerX;
    if (!drag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
    drag.moved = true;
    const nextZoom = (0, import_transition_math.clamp)(drag.zoom * Math.exp(dx / ZOOM_DRAG_DISTANCE), 1, maxZoom);
    const nextVisibleDuration = meta.duration / nextZoom;
    const nextStart = clampViewStart(
      drag.anchorTime - drag.anchorRatio * nextVisibleDuration,
      meta.duration,
      nextVisibleDuration
    );
    setZoom(nextZoom);
    setViewStart(nextStart);
  }, [maxZoom, meta.duration, rulerTimeFromClientX]);
  const handleRulerPointerUp = (0, import_react46.useCallback)(() => {
    const gesture = rulerGestureRef.current;
    rulerGestureRef.current = null;
    zoomDragRef.current = null;
    if (gesture) {
      if (gesture.moved && loopDrag) {
        import_timeline6.TimelineStore.setLoopRegion(meta.id, loopDrag.start, loopDrag.end);
      } else {
        import_timeline6.TimelineStore.seek(meta.id, gesture.downTime);
      }
      setLoopDrag(null);
    }
  }, [loopDrag, meta.id]);
  const handleRulerPointerCancel = (0, import_react46.useCallback)(() => {
    rulerGestureRef.current = null;
    zoomDragRef.current = null;
    setLoopDrag(null);
  }, []);
  const trackScrubRef = (0, import_react46.useRef)(null);
  const seekTrackFromClientX = (0, import_react46.useCallback)((clientX) => {
    const scrub = trackScrubRef.current;
    const contentWidth = scrub?.rect.width ?? 0;
    if (!scrub || contentWidth <= 0) return;
    const nextTime = (0, import_transition_math.clamp)(
      scrub.viewStart + (clientX - scrub.rect.left) / contentWidth * scrub.visibleDuration,
      scrub.viewStart,
      scrub.viewStart + scrub.visibleDuration
    );
    import_timeline6.TimelineStore.seek(meta.id, nextTime);
  }, [meta.id]);
  const handleTrackPointerDown = (0, import_react46.useCallback)((e) => {
    const target = e.target;
    if (target.closest(".tweakers-timeline-label, button")) return;
    if (!e.shiftKey && target.closest(".tweakers-timeline-clip")) return;
    const rect = laneAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const resetView2 = e.shiftKey;
    trackScrubRef.current = {
      wasPlaying: import_timeline6.TimelineStore.getTransport(meta.id).playing,
      rect,
      viewStart: resetView2 ? 0 : safeViewStart,
      visibleDuration: resetView2 ? meta.duration : visibleDuration
    };
    if (resetView2) {
      setZoom(1);
      setViewStart(0);
    }
    setPopover(null);
    import_timeline6.TimelineStore.pause(meta.id);
    seekTrackFromClientX(e.clientX);
  }, [meta.duration, meta.id, safeViewStart, seekTrackFromClientX, visibleDuration]);
  const handleTrackPointerMove = (0, import_react46.useCallback)((e) => {
    if (trackScrubRef.current) seekTrackFromClientX(e.clientX);
  }, [seekTrackFromClientX]);
  const finishTrackScrub = (0, import_react46.useCallback)(() => {
    if (trackScrubRef.current?.wasPlaying) import_timeline6.TimelineStore.play(meta.id);
    trackScrubRef.current = null;
  }, [meta.id]);
  const handleCopy = (0, import_react46.useCallback)(() => {
    const normalized = (0, import_timeline8.normalizeTimelineValuesForCopy)(import_store14.TweakStore.getValues(meta.id), meta.clips);
    navigator.clipboard.writeText((0, import_copy_instruction2.buildCopyInstruction)("useTweakTimeline", meta.name, normalized));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [meta.clips, meta.id, meta.name]);
  const handleAddPreset = (0, import_react46.useCallback)(() => {
    import_store14.TweakStore.savePreset(meta.id, `Version ${presets.length + 2}`);
  }, [meta.id, presets.length]);
  const closePopover = (0, import_react46.useCallback)(() => setPopover(null), []);
  const openClipPopover = (0, import_react46.useCallback)(
    (clip, rect, stepKey) => {
      const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
      const exclude = stepKey ? void 0 : clipPopoverExclusions(clip);
      if (getClipControls(meta.id, targetPath, exclude).length === 0) return;
      setPopover(
        (prev) => prev?.clip.key === clip.key && prev?.stepKey === stepKey ? null : {
          clip,
          stepKey,
          anchor: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height
          }
        }
      );
    },
    [meta.id]
  );
  const toggleTracks = (0, import_react46.useCallback)((clipKey) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(clipKey)) next.delete(clipKey);
      else next.add(clipKey);
      return next;
    });
  }, []);
  const handleBarClick = (0, import_react46.useCallback)(
    (clip, rect, stepKey) => {
      if (!stepKey && clip.tracks?.length) {
        toggleTracks(clip.key);
        return;
      }
      openClipPopover(clip, rect, stepKey);
    },
    [openClipPopover, toggleTracks]
  );
  const toggleGroup = (0, import_react46.useCallback)((group) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);
  const rawStep = pxPerSecond > 0 ? MAJOR_TICK_TARGET_PX / pxPerSecond : 1;
  const adaptiveMajorStep = SECOND_TICK_STEPS.find((step) => step >= rawStep) ?? SECOND_TICK_STEPS[SECOND_TICK_STEPS.length - 1];
  const majorStep = zoom < 1.5 && meta.duration >= 1 ? Math.max(1, adaptiveMajorStep) : adaptiveMajorStep;
  const fineTickStep = majorStep / 10;
  const majorTicks = [];
  const mediumTicks = [];
  const fineTicks = [];
  const firstMajorTick = Math.ceil((safeViewStart - 1e-6) / majorStep) * majorStep;
  for (let t = firstMajorTick; t <= viewEnd + 1e-6; t += majorStep) {
    majorTicks.push(Number(t.toFixed(4)));
  }
  const firstFineIndex = Math.ceil((safeViewStart - 1e-6) / fineTickStep);
  const lastFineIndex = Math.floor((viewEnd + 1e-6) / fineTickStep);
  for (let index = firstFineIndex; index <= lastFineIndex; index++) {
    if (index % 10 === 0) continue;
    const tick = Number((index * fineTickStep).toFixed(6));
    if (index % 5 === 0) mediumTicks.push(tick);
    else fineTicks.push(tick);
  }
  const rows = [];
  let lastGroup;
  for (const clip of meta.clips) {
    if (clip.group !== lastGroup) {
      lastGroup = clip.group;
      if (clip.group) {
        const group = clip.group;
        const isCollapsed = collapsedGroups.has(group);
        rows.push(
          /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-row tweakers-timeline-group-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-label", children: [
              /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                "button",
                {
                  className: "tweakers-timeline-group-toggle",
                  "data-open": !isCollapsed,
                  onClick: () => toggleGroup(group),
                  title: isCollapsed ? "Expand layer" : "Collapse layer",
                  children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_CHEVRON }) })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { children: (0, import_store14.formatLabel)(group) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-lane" })
          ] }, `group:${group}`)
        );
      }
    }
    if (clip.group && collapsedGroups.has(clip.group)) continue;
    const isProps = Boolean(clip.tracks?.length);
    const tracksOpen = isProps && expandedTracks.has(clip.key);
    const stat = (0, import_timeline8.computeClipStaticFromValues)(values, clip, meta.duration);
    rows.push(
      /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-row", "data-grouped": clip.group ? "" : void 0, children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-label", children: [
          isProps ? /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
            "button",
            {
              className: "tweakers-timeline-group-toggle",
              "data-open": tracksOpen,
              onClick: (e) => {
                e.stopPropagation();
                toggleTracks(clip.key);
              },
              title: tracksOpen ? "Collapse properties" : "Expand properties",
              children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_CHEVRON }) })
            }
          ) : null,
          clip.label
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-lane", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          TimelineClip,
          {
            timelineId: meta.id,
            clip,
            at: stat.at,
            duration: stat.duration,
            loop: stat.loop,
            steps: clip.stepKeys?.length ? stat.tracks[0]?.steps : void 0,
            fixedDuration: isProps ? true : stat.isPhysics,
            composite: isProps,
            pxPerSecond,
            viewStart: safeViewStart,
            timelineDuration: meta.duration,
            selected: popover?.clip.key === clip.key,
            selectedStepKey: popover?.clip.key === clip.key ? popover.stepKey : void 0,
            onClick: handleBarClick,
            onDrag: closePopover
          }
        ) })
      ] }, clip.key)
    );
    if (tracksOpen) {
      for (const trackRef of clip.tracks ?? []) {
        const track = stat.tracks.find((candidate) => candidate.prop === trackRef.prop);
        if (!track) continue;
        const trackKey = `${clip.key}.${trackRef.prop}`;
        const trackMeta = {
          key: trackKey,
          label: `${clip.label} \xB7 ${(0, import_store14.formatLabel)(trackRef.prop)}`,
          color: clip.color,
          loop: clip.loop,
          group: clip.group,
          stepKeys: trackRef.stepKeys
        };
        rows.push(
          /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
            "div",
            {
              className: "tweakers-timeline-row tweakers-timeline-track-row",
              "data-grouped": clip.group ? "" : void 0,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-label", children: (0, import_store14.formatLabel)(trackRef.prop) }),
                /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-lane", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                  TimelineClip,
                  {
                    timelineId: meta.id,
                    clip: trackMeta,
                    at: stat.at + track.delay,
                    duration: track.duration,
                    loop: stat.loop,
                    steps: trackRef.stepKeys?.length ? track.steps : void 0,
                    fixedDuration: !trackRef.stepKeys?.length && track.steps[0]?.isPhysics === true,
                    baseAt: stat.at,
                    delayMode: true,
                    pxPerSecond,
                    viewStart: safeViewStart,
                    timelineDuration: meta.duration,
                    selected: popover?.clip.key === trackKey,
                    selectedStepKey: popover?.clip.key === trackKey ? popover.stepKey : void 0,
                    onClick: openClipPopover,
                    onDrag: closePopover
                  }
                ) })
              ]
            },
            trackKey
          )
        );
      }
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-header", "data-open": open || void 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-identity", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-timeline-title", children: meta.name }) }),
      !open && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
        TimelineOverview,
        {
          id: meta.id,
          duration: meta.duration,
          viewStart: safeViewStart,
          viewEnd,
          onNavigate: centerViewAt
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          import_react47.motion.button,
          {
            className: "tweakers-timeline-loop-toggle",
            "data-active": loopRegion ? "true" : void 0,
            onClick: handleClearLoopRegion,
            disabled: !loopRegion,
            title: loopRegion ? "Looping a region \xB7 click to loop the whole timeline" : "Looping the whole timeline \xB7 drag the ruler to set a loop region",
            "aria-label": loopRegion ? "Clear loop region" : "Looping whole timeline",
            "aria-pressed": loopRegion ? true : false,
            whileTap: loopRegion ? { scale: 0.9 } : void 0,
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: import_icons13.ICON_LOOP.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d }, i)) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(PlayPauseButton, { id: meta.id }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ReplayButton, { onReplay: handleReplay }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          import_react47.motion.button,
          {
            className: "tweakers-toolbar-add",
            onClick: handleAddPreset,
            title: "Add timeline version",
            "aria-label": "Add timeline version",
            whileTap: { scale: 0.9 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: import_icons13.ICON_ADD_PRESET.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d }, i)) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          PresetManager,
          {
            panelId: meta.id,
            presets,
            activePresetId,
            onAdd: handleAddPreset
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          import_react47.motion.button,
          {
            className: "tweakers-toolbar-add",
            onClick: handleCopy,
            title: "Copy parameters",
            "aria-label": copied ? "Copied parameters" : "Copy parameters",
            whileTap: { scale: 0.9 },
            transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
            children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { style: { position: "relative", width: 16, height: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_react47.AnimatePresence, { initial: false, mode: "wait", children: copied ? /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
              import_react47.motion.svg,
              {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true",
                style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                transition: { duration: 0.08 },
                children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_CHECK })
              },
              "check"
            ) : /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
              import_react47.motion.svg,
              {
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true",
                style: { position: "absolute", inset: 0, width: 16, height: 16, color: "var(--tweak-text-label)" },
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.8, opacity: 0 },
                transition: { duration: 0.08 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_CLIPBOARD.board, stroke: "currentColor", strokeWidth: "2", strokeLinejoin: "round" }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_CLIPBOARD.sparkle, fill: "currentColor" }),
                  /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_CLIPBOARD.body, stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
                ]
              },
              "clipboard"
            ) }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
          "button",
          {
            className: "tweakers-timeline-chevron",
            "data-open": open,
            "aria-expanded": open,
            onClick: () => setOpen(!open),
            title: open ? "Collapse timeline" : "Expand timeline",
            children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: import_icons13.ICON_CHEVRON }) })
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
      "div",
      {
        className: "tweakers-timeline-body",
        onWheel: handleTimelineWheel,
        onPointerDown: handleTrackPointerDown,
        onPointerMove: handleTrackPointerMove,
        onPointerUp: finishTrackScrub,
        onPointerCancel: finishTrackScrub,
        onLostPointerCapture: finishTrackScrub,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-grid", children: [
            /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-row tweakers-timeline-ruler-row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-label" }),
              /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
                "div",
                {
                  ref: laneAreaRef,
                  className: "tweakers-timeline-ruler",
                  onPointerDown: handleRulerPointerDown,
                  onPointerMove: handleRulerPointerMove,
                  onPointerUp: handleRulerPointerUp,
                  onPointerCancel: handleRulerPointerCancel,
                  onLostPointerCapture: handleRulerPointerCancel,
                  title: "Click to seek \xB7 drag to set a loop region \xB7 Option-drag to zoom \xB7 Shift-drag to reset zoom",
                  children: [
                    (() => {
                      const activeLoop = loopDrag ?? loopRegion;
                      if (!activeLoop || pxPerSecond <= 0) return null;
                      const left = (activeLoop.start - safeViewStart) * pxPerSecond;
                      const width = Math.max(0, (activeLoop.end - activeLoop.start) * pxPerSecond);
                      return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-loop-dim", style: { left: 0, width: Math.max(0, left) } }),
                        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-loop-dim", style: { left: left + width, right: 0 } }),
                        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
                          "div",
                          {
                            className: "tweakers-timeline-loop-band",
                            "data-live": loopDrag ? "true" : void 0,
                            style: { left, width }
                          }
                        )
                      ] });
                    })(),
                    fineTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-tick tweakers-timeline-tick-fine", style: { left: (t - safeViewStart) * pxPerSecond } }, `fine:${t}`)),
                    mediumTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-tick tweakers-timeline-tick-medium", style: { left: (t - safeViewStart) * pxPerSecond } }, `medium:${t}`)),
                    majorTicks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-tick", style: { left: (t - safeViewStart) * pxPerSecond }, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-timeline-tick-label", children: formatRulerSeconds(t, majorStep) }) }, t))
                  ]
                }
              )
            ] }),
            rows,
            pxPerSecond > 0 && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
              TimelinePlayheadFlag,
              {
                id: meta.id,
                duration: meta.duration,
                pxPerSecond,
                viewStart: safeViewStart,
                viewEnd,
                laneWidth,
                rulerRef: laneAreaRef,
                onResetView: resetView
              }
            )
          ] }),
          zoom > 1 && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-scroll-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-label" }),
            /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
              "div",
              {
                ref: horizontalScrollRef,
                className: "tweakers-timeline-horizontal-scroll",
                onScroll: handleHorizontalScroll,
                "aria-label": "Timeline horizontal scroll",
                children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { style: { width: laneWidth * zoom } })
              }
            )
          ] })
        ]
      }
    ),
    popover && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      ClipPopover,
      {
        panelId: meta.id,
        popover,
        values,
        theme,
        onClose: closePopover
      }
    )
  ] });
});
function ClipPopover({
  panelId,
  popover,
  values,
  theme,
  onClose
}) {
  const ref = (0, import_react46.useRef)(null);
  const [naturalHeight, setNaturalHeight] = (0, import_react46.useState)(0);
  const [viewport, setViewport] = (0, import_react46.useState)(() => ({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
    offsetLeft: window.visualViewport?.offsetLeft ?? 0,
    offsetTop: window.visualViewport?.offsetTop ?? 0
  }));
  (0, import_react46.useLayoutEffect)(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setNaturalHeight(element.scrollHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    const body = element.querySelector(".tweakers-timeline-popover-body");
    observer.observe(body ?? element);
    return () => observer.disconnect();
  }, [popover.clip.key, popover.stepKey]);
  (0, import_react46.useEffect)(() => {
    const updateViewport = () => setViewport({
      width: window.visualViewport?.width ?? window.innerWidth,
      height: window.visualViewport?.height ?? window.innerHeight,
      offsetLeft: window.visualViewport?.offsetLeft ?? 0,
      offsetTop: window.visualViewport?.offsetTop ?? 0
    });
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
    };
  }, []);
  (0, import_react46.useEffect)(() => {
    const handlePointerDown = (e) => {
      const target = e.target;
      if (ref.current?.contains(target)) return;
      if (target.closest?.(".tweakers-timeline-clip")) return;
      if (target.closest?.(".tweakers-timeline-label")) return;
      onClose();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  const { clip, stepKey } = popover;
  let controls;
  let title;
  if (stepKey) {
    controls = getClipControls(panelId, `${clip.key}.${stepKey}`);
    if (stepKey === clip.stepKeys?.[0]) {
      const from = getControlAt(panelId, `${clip.key}.from`);
      if (from) {
        const toIndex = controls.findIndex((control) => control.path === `${clip.key}.${stepKey}.to`);
        controls = toIndex >= 0 ? [...controls.slice(0, toIndex), from, ...controls.slice(toIndex)] : [...controls, from];
      }
    }
    title = `${clip.label} \xB7 ${(0, import_timeline8.formatStepLabel)(stepKey)}`;
  } else {
    controls = getClipControls(panelId, clip.key, clipPopoverExclusions(clip));
    title = clip.label;
  }
  if (controls.length === 0) return null;
  const targetPath = stepKey ? `${clip.key}.${stepKey}` : clip.key;
  const durationMeta = getControlAt(panelId, `${targetPath}.duration`);
  const durationValue = durationMeta ? values[durationMeta.path] : void 0;
  const transitionDuration = durationMeta?.type === "slider" && typeof durationValue === "number" ? {
    value: durationValue,
    onChange: (next) => import_store14.TweakStore.updateValue(panelId, durationMeta.path, next),
    min: Math.max(import_timeline8.TIMELINE_MIN_CLIP_DURATION, durationMeta.min ?? 0),
    max: durationMeta.max,
    step: durationMeta.step
  } : void 0;
  const displayValues = (0, import_timeline8.timelinePopoverDisplayValues)(values, clip.key, clip.stepKeys, stepKey);
  const viewportRight = viewport.offsetLeft + viewport.width;
  const viewportBottom = viewport.offsetTop + viewport.height;
  const popoverWidth = Math.min(POPOVER_WIDTH, Math.max(220, viewport.width - 24));
  const left = (0, import_transition_math.clamp)(
    popover.anchor.left + popover.anchor.width / 2 - popoverWidth / 2,
    viewport.offsetLeft + 12,
    Math.max(viewport.offsetLeft + 12, viewportRight - popoverWidth - 12)
  );
  const spaceAbove = Math.max(0, popover.anchor.top - viewport.offsetTop - 22);
  const spaceBelow = Math.max(0, viewportBottom - popover.anchor.bottom - 22);
  const placeAbove = naturalHeight === 0 ? spaceAbove >= spaceBelow : naturalHeight <= spaceAbove || naturalHeight > spaceBelow && spaceAbove >= spaceBelow;
  const availableHeight = placeAbove ? spaceAbove : spaceBelow;
  const renderedHeight = Math.min(naturalHeight || availableHeight, availableHeight);
  const unclampedTop = placeAbove ? popover.anchor.top - 10 - renderedHeight : popover.anchor.bottom + 10;
  const top = (0, import_transition_math.clamp)(
    unclampedTop,
    viewport.offsetTop + 12,
    Math.max(viewport.offsetTop + 12, viewportBottom - renderedHeight - 12)
  );
  return (0, import_react_dom8.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-root", "data-theme": theme, children: /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
      "div",
      {
        ref,
        className: "tweakers-timeline-popover",
        "data-placement": placeAbove ? "above" : "below",
        style: {
          left,
          top,
          width: popoverWidth,
          maxHeight: availableHeight,
          visibility: naturalHeight > 0 ? "visible" : "hidden"
        },
        role: "dialog",
        "aria-label": `Edit ${title}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)("div", { className: "tweakers-timeline-popover-header", children: [
            /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-timeline-popover-title", children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("button", { className: "tweakers-timeline-popover-close", onClick: onClose, title: "Close editor", "aria-label": "Close editor", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("path", { d: "M6 6L18 18M18 6L6 18" }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-popover-body", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
            ControlRenderer,
            {
              panelId,
              controls,
              values: displayValues,
              transitionDuration
            }
          ) })
        ]
      }
    ) }),
    document.body
  );
}
function clipPopoverExclusions(clip) {
  return /* @__PURE__ */ new Set([
    ...clip.stepKeys ?? [],
    ...clip.tracks?.map((track) => track.prop) ?? []
  ]);
}
function getClipControls(panelId, controlPath, excludeChildren) {
  const panel = import_store14.TweakStore.getPanel(panelId);
  const folder = panel ? (0, import_shortcut_utils7.findControl)(panel.controls, controlPath) : null;
  if (!folder?.children) return [];
  return folder.children.filter((control) => {
    const childKey = control.path.slice(controlPath.length + 1);
    if (childKey === "at" || childKey === "duration") return false;
    return !excludeChildren?.has(childKey);
  });
}
function getControlAt(panelId, path) {
  const panel = import_store14.TweakStore.getPanel(panelId);
  return panel ? (0, import_shortcut_utils7.findControl)(panel.controls, path) : null;
}
function TimelineClip({
  timelineId,
  clip,
  at,
  duration,
  loop,
  steps,
  fixedDuration,
  composite = false,
  baseAt = 0,
  delayMode = false,
  pxPerSecond,
  viewStart,
  timelineDuration,
  selected,
  selectedStepKey,
  onClick,
  onDrag
}) {
  const dragRef = (0, import_react46.useRef)(null);
  const [dragging, setDragging] = (0, import_react46.useState)(false);
  const isSteps = Boolean(steps?.length);
  const handlePointerDown = (0, import_react46.useCallback)(
    (e) => {
      if (e.shiftKey) return;
      e.stopPropagation();
      const target = e.target;
      let mode = "move";
      let boundaryIndex;
      const boundary = target.dataset?.boundary;
      if (boundary !== void 0) {
        mode = "boundary";
        boundaryIndex = Number(boundary);
      } else if (!fixedDuration) {
        const edge = target.dataset?.edge;
        if (edge) mode = edge;
      }
      dragRef.current = {
        mode,
        boundaryIndex,
        pointerX: e.clientX,
        at,
        duration,
        stepDurations: steps?.map((step) => step.duration),
        clickEl: target.closest?.("[data-step]") ?? null,
        moved: false
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [at, duration, fixedDuration, steps]
  );
  const handlePointerMove = (0, import_react46.useCallback)(
    (e) => {
      const drag = dragRef.current;
      if (!drag || pxPerSecond <= 0) return;
      const dx = e.clientX - drag.pointerX;
      if (!drag.moved) {
        if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return;
        drag.moved = true;
        setDragging(true);
        onDrag();
      }
      const dt = dx / pxPerSecond;
      if (drag.mode === "boundary" && steps && drag.stepDurations) {
        const index = drag.boundaryIndex ?? 0;
        const others = drag.stepDurations.reduce((sum, d, j) => j === index ? sum : sum + d, 0);
        import_store14.TweakStore.updateValue(
          timelineId,
          `${clip.key}.${steps[index].key ?? ""}.duration`,
          (0, import_timeline8.clampStepResize)(drag.stepDurations[index] + dt, drag.at, others, timelineDuration)
        );
      } else if (drag.mode === "move") {
        if (delayMode) {
          import_store14.TweakStore.updateValue(
            timelineId,
            `${clip.key}.delay`,
            (0, import_timeline8.clampTrackDelay)(drag.at + dt - baseAt, baseAt, drag.duration, timelineDuration)
          );
        } else {
          import_store14.TweakStore.updateValue(timelineId, `${clip.key}.at`, (0, import_timeline8.clampClipMove)(drag.at + dt, drag.duration, timelineDuration));
        }
      } else if (drag.mode === "end") {
        import_store14.TweakStore.updateValue(
          timelineId,
          `${clip.key}.duration`,
          (0, import_timeline8.clampClipResizeEnd)(drag.duration + dt, drag.at, timelineDuration)
        );
      } else if (steps && drag.stepDurations) {
        const limit = Math.max(baseAt, 0);
        const next = (0, import_timeline8.clampClipResizeStart)(Math.max(drag.at + dt, limit), drag.at, drag.stepDurations[0]);
        import_store14.TweakStore.updateValues(timelineId, {
          [delayMode ? `${clip.key}.delay` : `${clip.key}.at`]: delayMode ? Math.max(0, next.at - baseAt) : next.at,
          [`${clip.key}.${steps[0].key ?? ""}.duration`]: next.duration
        });
      } else {
        const limit = Math.max(baseAt, 0);
        const next = (0, import_timeline8.clampClipResizeStart)(Math.max(drag.at + dt, limit), drag.at, drag.duration);
        import_store14.TweakStore.updateValues(timelineId, {
          [delayMode ? `${clip.key}.delay` : `${clip.key}.at`]: delayMode ? Math.max(0, next.at - baseAt) : next.at,
          [`${clip.key}.duration`]: next.duration
        });
      }
    },
    [baseAt, clip.key, delayMode, onDrag, pxPerSecond, steps, timelineId, timelineDuration]
  );
  const handlePointerUp = (0, import_react46.useCallback)(
    (e) => {
      const drag = dragRef.current;
      dragRef.current = null;
      setDragging(false);
      if (drag && !drag.moved) {
        const stepKey = drag.clickEl?.dataset?.step;
        const anchorEl = drag.clickEl ?? e.currentTarget;
        onClick(clip, anchorEl.getBoundingClientRect(), stepKey);
      }
    },
    [clip, onClick]
  );
  const handlePointerCancel = (0, import_react46.useCallback)(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);
  const width = Math.max(duration * pxPerSecond, 14);
  const resizable = duration > 0 && !fixedDuration && !composite;
  const durationText = `${fixedDuration && !composite ? "~" : ""}${(0, import_timeline8.formatSeconds)(duration)}`;
  const looping = loop === "repeat" && duration > 0;
  const ghostCycles = [];
  if (looping) {
    const maxGhostCycles = 256;
    const firstGhostIndex = Math.max(1, Math.floor((viewStart - at) / duration));
    for (let offset = 0; offset < maxGhostCycles; offset++) {
      const index = firstGhostIndex + offset;
      const start = at + duration * index;
      if (start >= timelineDuration - 1e-6) break;
      ghostCycles.push({
        start,
        duration: Math.min(duration, timelineDuration - start),
        index
      });
    }
  }
  const boundaryOffsets = [];
  if (steps) {
    let cumulative = 0;
    for (const step of steps) {
      cumulative += step.duration;
      boundaryOffsets.push(cumulative);
    }
  }
  const barTitle = composite ? `${clip.label} \u2014 composite of its property tracks${looping ? " \xB7 repeats through timeline" : ""} \xB7 click to expand` : `${clip.label} \u2014 ${(0, import_timeline8.formatSeconds)(at)} for ${durationText}${fixedDuration ? " (duration set by spring physics)" : ""}${looping ? " \xB7 repeats through timeline" : ""}${delayMode ? " \xB7 drag to phase-shift" : ""}`;
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
    ghostCycles.map((cycle) => {
      const ghostWidth = Math.max(1, cycle.duration * pxPerSecond - 2);
      return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
        "div",
        {
          className: "tweakers-timeline-clip-ghost",
          "data-steps": isSteps || void 0,
          "aria-hidden": "true",
          style: {
            left: (cycle.start - viewStart) * pxPerSecond + 1,
            width: ghostWidth,
            background: clip.color
          },
          children: steps?.map((step, stepIndex) => /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
            "span",
            {
              className: "tweakers-timeline-clip-ghost-segment",
              style: { width: step.duration * pxPerSecond }
            },
            step.key ?? `step:${stepIndex}`
          ))
        },
        `ghost:${cycle.index}`
      );
    }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
      "div",
      {
        className: "tweakers-timeline-clip",
        "data-steps": isSteps || void 0,
        "data-composite": composite || void 0,
        "data-selected": selected || void 0,
        "data-dragging": dragging || void 0,
        style: {
          left: (at - viewStart) * pxPerSecond,
          width,
          background: composite ? `${clip.color}80` : clip.color
        },
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerCancel,
        onLostPointerCapture: handlePointerCancel,
        title: barTitle,
        children: composite ? /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_jsx_runtime42.Fragment, { children: width > 56 && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-timeline-clip-duration", children: durationText }) }) : isSteps ? /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
          steps.map((step) => {
            const segmentWidth = step.duration * pxPerSecond;
            return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
              "div",
              {
                className: "tweakers-timeline-clip-segment",
                "data-step": step.key ?? void 0,
                "data-selected": selectedStepKey === step.key || void 0,
                style: { width: segmentWidth },
                children: segmentWidth > 52 && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-timeline-clip-duration", children: (0, import_timeline8.formatSeconds)(step.duration) })
              },
              step.key ?? "step"
            );
          }),
          steps.map(
            (step, index) => step.isPhysics ? null : /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(
              "div",
              {
                className: "tweakers-timeline-clip-handle",
                "data-boundary": index,
                style: { left: boundaryOffsets[index] * pxPerSecond - 4 }
              },
              `boundary:${step.key}`
            )
          ),
          !steps[0].isPhysics && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-clip-handle", "data-edge": "start" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
          resizable && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-clip-handle", "data-edge": "start" }),
          width > 56 && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-timeline-clip-duration", children: durationText }),
          resizable && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("div", { className: "tweakers-timeline-clip-handle", "data-edge": "end" })
        ] })
      }
    ),
    looping && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("span", { className: "tweakers-timeline-loop-infinity", "aria-hidden": "true", title: "Repeats indefinitely", children: "\u221E" })
  ] });
}

// src/index.ts
var import_timeline9 = require("tweakers/timeline");
var import_timeline10 = require("tweakers/timeline");
var import_transfer_core3 = require("tweakers/transfer-core");
var import_angle_core2 = require("tweakers/angle-core");

// src/components/Module.tsx
var import_jsx_runtime43 = require("react/jsx-runtime");
function Module({ title, enabled, onEnabledChange, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "tweakers-module", children: [
    /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "tweakers-module-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(Checkbox, { checked: enabled, onChange: onEnabledChange, label: title }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("span", { className: "tweakers-module-title", children: title })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "tweakers-module-collapse", "data-open": enabled, children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "tweakers-module-collapse-clip", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "tweakers-module-inner", children }) }) })
  ] });
}

// src/components/ButtonGroup.tsx
var import_jsx_runtime44 = require("react/jsx-runtime");
function ButtonGroup({ buttons }) {
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { className: "tweakers-button-group", children: buttons.map((button, index) => /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(
    "button",
    {
      className: "tweakers-button",
      onClick: button.onClick,
      children: button.label
    },
    index
  )) });
}

// src/index.ts
var import_tweakers2 = require("tweakers");
var import_tweakers3 = require("tweakers");
var import_curve_composer_core = require("tweakers/curve-composer-core");
var import_range_slider_core2 = require("tweakers/range-slider-core");
var import_color_core3 = require("tweakers/color-core");
var import_gradient_core5 = require("tweakers/gradient-core");
var import_xy_pad_core3 = require("tweakers/xy-pad-core");
var import_curve_preview_core3 = require("tweakers/curve-preview-core");

// src/components/ShortcutsMenu.tsx
var import_react48 = require("react");
var import_react_dom9 = require("react-dom");
var import_react49 = require("motion/react");
var import_store15 = require("tweakers/store");
var import_jsx_runtime45 = require("react/jsx-runtime");
function formatShortcutKey(sc) {
  if (!sc.key) return "\u2014";
  const mod = sc.modifier === "alt" ? "\u2325" : sc.modifier === "shift" ? "\u21E7" : sc.modifier === "meta" ? "\u2318" : "";
  return `${mod}${sc.key.toUpperCase()}`;
}
function formatInteraction(sc) {
  const interaction = sc.interaction ?? "scroll";
  switch (interaction) {
    case "scroll":
      return sc.key ? "key+scroll" : "scroll";
    case "drag":
      return "key+drag";
    case "move":
      return "key+move";
    case "scroll-only":
      return "scroll";
  }
}
function ShortcutsMenu({ panelId }) {
  const [isOpen, setIsOpen] = (0, import_react48.useState)(false);
  const triggerRef = (0, import_react48.useRef)(null);
  const dropdownRef = (0, import_react48.useRef)(null);
  const [pos, setPos] = (0, import_react48.useState)({ top: 0, right: 0 });
  const open = (0, import_react48.useCallback)(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setIsOpen(true);
  }, []);
  const close = (0, import_react48.useCallback)(() => setIsOpen(false), []);
  const toggle2 = (0, import_react48.useCallback)(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);
  (0, import_react48.useEffect)(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);
  const panel = import_store15.TweakStore.getPanel(panelId);
  if (!panel) return null;
  const shortcuts = Object.entries(panel.shortcuts);
  if (shortcuts.length === 0) return null;
  const rows = shortcuts.map(([path, shortcut]) => {
    const findLabel = (controls) => {
      for (const c of controls) {
        if (c.path === path) return c.label;
        if (c.type === "folder" && c.children) {
          const found = findLabel(c.children);
          if (found) return found;
        }
      }
      return path;
    };
    return {
      path,
      shortcut,
      label: findLabel(panel.controls)
    };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(import_jsx_runtime45.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
      import_react49.motion.button,
      {
        ref: triggerRef,
        className: "tweakers-shortcuts-trigger",
        onClick: toggle2,
        title: "Keyboard shortcuts",
        whileTap: { scale: 0.9 },
        transition: { type: "spring", visualDuration: 0.15, bounce: 0.3 },
        children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("path", { d: "M6 10H6.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("path", { d: "M10 10H10.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("path", { d: "M14 10H14.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("path", { d: "M18 10H18.01" }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("path", { d: "M8 14H16" })
        ] })
      }
    ),
    (0, import_react_dom9.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_react49.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
        PresenceMotionDiv,
        {
          divRef: dropdownRef,
          className: "tweakers-root tweakers-shortcuts-dropdown",
          style: { position: "fixed", top: pos.top, right: pos.right },
          initial: { opacity: 0, y: 4, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 4, scale: 0.97, pointerEvents: "none" },
          transition: { type: "spring", visualDuration: 0.15, bounce: 0 },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "tweakers-shortcuts-title", children: "Keyboard Shortcuts" }),
            /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "tweakers-shortcuts-list", children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "tweakers-shortcuts-row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "tweakers-shortcuts-row-key", children: formatShortcutKey(row.shortcut) }),
              /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "tweakers-shortcuts-row-label", children: row.label }),
              /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "tweakers-shortcuts-row-mode", children: formatInteraction(row.shortcut) })
            ] }, row.path)) }),
            /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "tweakers-shortcuts-hint", children: "See pill badges on controls for keys" })
          ]
        }
      ) }),
      document.body
    )
  ] });
}

// src/components/AudioLevelMeter.tsx
var import_react50 = require("react");
var import_jsx_runtime46 = require("react/jsx-runtime");
var DEFAULT_CELL_COUNT = 10;
var MIN_CELL_COUNT = 8;
var MAX_CELL_COUNT = 12;
var MAX_SPECTRUM_BANDS = 12;
var PEAK_HOLD_MS = 560;
var PEAK_FALL_INTERVAL_MS = 120;
function clampLevel(value) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}
function normalizeCellCount(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_CELL_COUNT;
  return Math.min(MAX_CELL_COUNT, Math.max(MIN_CELL_COUNT, Math.round(value)));
}
function levelToCellCount(level, cellCount) {
  return level === 0 ? 0 : Math.ceil(level * cellCount);
}
function formatPercentage(level) {
  return `${Math.round(level * 100)}%`;
}
function getValueSummary(mode, levels) {
  if (mode === "mono") {
    return `Level ${formatPercentage(levels[0])}`;
  }
  if (mode === "stereo") {
    return `Left ${formatPercentage(levels[0])}, right ${formatPercentage(levels[1])}`;
  }
  return `Band levels ${levels.map(formatPercentage).join(", ")}`;
}
function getRawLevels(props) {
  if (props.mode === "stereo") {
    return props.levels.map((level) => Number.isFinite(level) ? level : 0);
  }
  if (props.mode === "spectrum") {
    const levels = props.levels.slice(0, MAX_SPECTRUM_BANDS).map((level) => Number.isFinite(level) ? level : 0);
    return levels.length > 0 ? levels : [0];
  }
  return [Number.isFinite(props.levels) ? props.levels : 0];
}
function getCellColor(colors, indexFromBottom, cellCount) {
  if (colors.length === 0) return void 0;
  const colorIndex = Math.min(
    colors.length - 1,
    Math.floor(indexFromBottom / cellCount * colors.length)
  );
  return colors[colorIndex];
}
function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = (0, import_react50.useState)(false);
  (0, import_react50.useEffect)(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);
  return reducedMotion;
}
function createPeakState(index, timestamp) {
  return { index, holdStartedAt: timestamp, lastDropAt: timestamp };
}
function remapPeakIndex(index, previousCellCount, cellCount) {
  if (index < 0) return -1;
  return Math.min(
    cellCount - 1,
    Math.ceil((index + 1) / previousCellCount * cellCount) - 1
  );
}
function getDefaultLabel(mode, bandCount) {
  if (mode === "mono") {
    return "Audio level meter, mono";
  }
  if (mode === "stereo") {
    return "Audio level meter, stereo";
  }
  return `Audio spectrum analyzer, ${bandCount} bands`;
}
function getBandName(mode, index) {
  if (mode === "mono") return "mono";
  if (mode === "stereo") return index === 0 ? "left" : "right";
  return `band ${index + 1}`;
}
function AudioLevelMeter(props) {
  const mode = props.mode ?? "mono";
  const cellCount = normalizeCellCount(props.cellCount);
  const rawLevels = getRawLevels(props);
  const levels = rawLevels.map(clampLevel);
  const clippedBands = rawLevels.map((level) => level > 1);
  const activeCellCounts = levels.map((level) => levelToCellCount(level, cellCount));
  const activeCellKey = activeCellCounts.join(":");
  const clippedBandKey = clippedBands.map(Number).join(":");
  const currentTopCellsRef = (0, import_react50.useRef)(activeCellCounts.map((count) => count - 1));
  const currentClippedBandsRef = (0, import_react50.useRef)(clippedBands);
  const cellCountRef = (0, import_react50.useRef)(cellCount);
  const peakStatesRef = (0, import_react50.useRef)([]);
  const clipHoldUntilRef = (0, import_react50.useRef)(clippedBands.map(() => 0));
  const animationFrameRef = (0, import_react50.useRef)(null);
  const reducedMotion = usePrefersReducedMotion();
  const [peakIndices, setPeakIndices] = (0, import_react50.useState)(
    () => activeCellCounts.map((count) => count - 1)
  );
  const [heldClippedBands, setHeldClippedBands] = (0, import_react50.useState)(clippedBands.map(() => false));
  const displayedClippedBands = heldClippedBands.map(
    (isHeld, index) => isHeld || clippedBands[index]
  );
  const displayedPeakIndices = peakIndices.map(
    (index) => remapPeakIndex(index, cellCountRef.current, cellCount)
  );
  const colors = (props.colors ?? []).slice(0, 3).filter(
    (color) => typeof color === "string" && color.trim().length > 0
  );
  (0, import_react50.useEffect)(() => {
    const timestamp = performance.now();
    const currentTopCells = activeCellKey.split(":").map(Number).map((count) => count - 1);
    const currentClippedBands = clippedBandKey.split(":").map((value) => value === "1");
    const previousCellCount = cellCountRef.current;
    const cellCountChanged = previousCellCount !== cellCount;
    const previousCurrentClippedBands = currentClippedBandsRef.current;
    let previousTopCells = currentTopCellsRef.current;
    if (cellCountChanged) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      previousTopCells = previousTopCells.map(
        (index) => remapPeakIndex(index, previousCellCount, cellCount)
      );
      peakStatesRef.current = peakStatesRef.current.map((peak) => ({
        ...peak,
        index: remapPeakIndex(peak.index, previousCellCount, cellCount)
      }));
      cellCountRef.current = cellCount;
    }
    currentTopCellsRef.current = currentTopCells;
    currentClippedBandsRef.current = currentClippedBands;
    const nextClipHoldUntil = currentClippedBands.map((isCurrentlyClipped, index) => {
      if (isCurrentlyClipped) return Number.POSITIVE_INFINITY;
      if (previousCurrentClippedBands[index]) return timestamp + PEAK_HOLD_MS;
      return clipHoldUntilRef.current[index] ?? 0;
    });
    clipHoldUntilRef.current = nextClipHoldUntil;
    if (reducedMotion) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      peakStatesRef.current = currentTopCells.map((index) => createPeakState(index, timestamp));
      clipHoldUntilRef.current = currentClippedBands.map(() => 0);
      setPeakIndices(currentTopCells);
      setHeldClippedBands(currentClippedBands.map(() => false));
      return;
    }
    const nextPeakStates = currentTopCells.map((currentTop, index) => {
      const previous = peakStatesRef.current[index];
      if (!previous || currentTop > previous.index) {
        return createPeakState(currentTop, timestamp);
      }
      if (currentTop === previous.index) {
        return createPeakState(currentTop, timestamp);
      }
      if ((previousTopCells[index] ?? -1) >= previous.index) {
        return {
          ...previous,
          holdStartedAt: timestamp,
          lastDropAt: timestamp
        };
      }
      return previous;
    });
    peakStatesRef.current = nextPeakStates;
    setPeakIndices(nextPeakStates.map((peak) => peak.index));
    setHeldClippedBands(
      nextClipHoldUntil.map(
        (holdUntil, index) => !currentClippedBands[index] && holdUntil > timestamp
      )
    );
    if (animationFrameRef.current !== null) return;
    const hasFallingPeak = nextPeakStates.some(
      (peak, index) => peak.index > currentTopCells[index]
    );
    const hasClipHold = nextClipHoldUntil.some(
      (holdUntil, index) => !currentClippedBands[index] && holdUntil > timestamp
    );
    if (!hasFallingPeak && !hasClipHold) return;
    const animatePeaks = (frameTimestamp) => {
      let peakChanged = false;
      let clipHoldChanged = false;
      let needsAnotherFrame = false;
      const next = peakStatesRef.current.map((peak, index) => {
        const currentTop = currentTopCellsRef.current[index] ?? -1;
        if (peak.index <= currentTop) {
          return createPeakState(currentTop, frameTimestamp);
        }
        const fallStartedAt = peak.holdStartedAt + PEAK_HOLD_MS;
        if (frameTimestamp >= fallStartedAt) {
          const dropFrom = Math.max(peak.lastDropAt, fallStartedAt);
          const dropCount = Math.floor((frameTimestamp - dropFrom) / PEAK_FALL_INTERVAL_MS);
          if (dropCount > 0) {
            const nextIndex = Math.max(currentTop, peak.index - dropCount);
            peakChanged = peakChanged || nextIndex !== peak.index;
            peak = {
              ...peak,
              index: nextIndex,
              lastDropAt: dropFrom + dropCount * PEAK_FALL_INTERVAL_MS
            };
          }
        }
        needsAnotherFrame = needsAnotherFrame || peak.index > currentTop;
        return peak;
      });
      const nextClipHolds = clipHoldUntilRef.current.map((holdUntil, index) => {
        const isCurrentlyClipped = currentClippedBandsRef.current[index] ?? false;
        if (isCurrentlyClipped || holdUntil === 0) return holdUntil;
        if (holdUntil <= frameTimestamp) {
          clipHoldChanged = true;
          return 0;
        }
        needsAnotherFrame = true;
        return holdUntil;
      });
      peakStatesRef.current = next;
      clipHoldUntilRef.current = nextClipHolds;
      if (peakChanged) setPeakIndices(next.map((peak) => peak.index));
      if (clipHoldChanged) {
        setHeldClippedBands(
          nextClipHolds.map(
            (holdUntil, index) => !currentClippedBandsRef.current[index] && holdUntil > frameTimestamp
          )
        );
      }
      if (needsAnotherFrame) {
        animationFrameRef.current = requestAnimationFrame(animatePeaks);
      } else {
        animationFrameRef.current = null;
      }
    };
    animationFrameRef.current = requestAnimationFrame(animatePeaks);
  }, [activeCellKey, cellCount, clippedBandKey, reducedMotion]);
  (0, import_react50.useEffect)(
    () => () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    },
    []
  );
  const defaultLabel = getDefaultLabel(mode, levels.length);
  const valueSummary = getValueSummary(mode, levels);
  const currentClippedBandNames = clippedBands.flatMap(
    (isClipped, index) => isClipped ? [getBandName(mode, index)] : []
  );
  const heldClippedBandNames = heldClippedBands.flatMap(
    (isHeld, index) => isHeld && !clippedBands[index] ? [getBandName(mode, index)] : []
  );
  const clippingSummary = [
    currentClippedBandNames.length > 0 ? `Clipping: ${currentClippedBandNames.join(", ")}` : void 0,
    heldClippedBandNames.length > 0 ? `Clipping held: ${heldClippedBandNames.join(", ")}` : void 0
  ].filter(Boolean).join(". ");
  const hasClipping = displayedClippedBands.some(Boolean);
  const accessibleSummary = [props.label, defaultLabel, valueSummary, clippingSummary].filter(Boolean).join(". ");
  const rootClassName = ["tweakers-root", "tweakers-audio-meter", props.className].filter(Boolean).join(" ");
  const rootStyle = {
    ...props.style,
    "--tweak-meter-band-count": levels.length,
    "--tweak-meter-cell-count": cellCount
  };
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(
    "div",
    {
      className: rootClassName,
      style: rootStyle,
      "data-mode": mode,
      "data-clipping": hasClipping || void 0,
      role: "img",
      "aria-label": accessibleSummary,
      children: /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("div", { className: "tweakers-audio-meter__bands", "aria-hidden": "true", children: activeCellCounts.map((activeCellCount, bandIndex) => /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("div", { className: "tweakers-audio-meter__band", children: Array.from({ length: cellCount }, (_, visualIndex) => {
        const indexFromBottom = cellCount - visualIndex - 1;
        const isActive = indexFromBottom < activeCellCount;
        const isPeak = indexFromBottom === displayedPeakIndices[bandIndex];
        const isClipped = displayedClippedBands[bandIndex] && indexFromBottom === cellCount - 1;
        const color = getCellColor(colors, indexFromBottom, cellCount);
        const cellStyle = color ? { "--tweak-meter-cell-color": color } : void 0;
        return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(
          "span",
          {
            className: "tweakers-audio-meter__cell",
            "data-active": isActive || void 0,
            "data-peak": isPeak || void 0,
            "data-clipped": isClipped || void 0,
            style: cellStyle
          },
          visualIndex
        );
      }) }, bandIndex)) })
    }
  );
}

// src/index.ts
var import_store16 = require("tweakers/store");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ADSR_DEF,
  ADSR_STAGE_MAX,
  ANGLE_DEAD_ZONE_PX,
  AnalyserRow,
  AnalyserVisualization,
  AngleDial,
  AudioLevelMeter,
  ButtonGroup,
  COLOR_FORMATS,
  CURVE_CYCLE,
  CURVE_DEF,
  CURVE_DEFAULT_HEIGHT,
  CURVE_FIT_PADDING,
  CURVE_LABELS,
  CURVE_MAX_CLIPS,
  CURVE_MAX_DURATION,
  CURVE_MAX_HEIGHT,
  CURVE_MIN_DURATION,
  CURVE_MIN_HEIGHT,
  CURVE_SAMPLE_COUNT,
  Checkbox,
  ChipsControl,
  ColorControl,
  ColorPickerPanel,
  ControlRenderer,
  ControlShell,
  CurveComposer,
  CurvePreview,
  DEFAULT_GRADIENT,
  DEFAULT_TRANSFER,
  DEFAULT_TRIGGER_STEPS,
  ENV_BEND_STAGES,
  EasingVisualization,
  FILTER_DB_CEIL,
  FILTER_DB_FLOOR,
  FileControl,
  FilterControl,
  Folder,
  GalleryControl,
  GradientControl,
  GradientPanel,
  LFO_DEF,
  LFO_SYNC_DIVISIONS,
  ListControl,
  MIN_STOPS,
  MOD_COLORS,
  MOD_PAGE_DIALS,
  MOD_RING_CIRCUMFERENCE,
  MOD_RING_RADIUS,
  MOD_SETTINGS_PANEL,
  MOD_SLOTS,
  MOD_TOUCH_GRACE_MS,
  ModulationStore,
  Module,
  MultiSelectControl,
  NumberControl,
  PresetManager,
  RangeSlider,
  SH_DEF,
  SegmentedControl,
  SelectControl,
  ShortcutsMenu,
  Slider,
  SpringControl,
  SpringVisualization,
  SwatchControl,
  TAB_PATH,
  TRANSFER_MAX_POINTS,
  TRANSFER_MIN_GAP,
  TextControl,
  TimelineStore,
  Toggle,
  TransferCurve,
  TransitionControl,
  TweakRoot,
  TweakStore,
  TweakTimeline,
  WaveformVisualization,
  XYControl,
  XYPad,
  XY_DEFAULT_STEP,
  XY_DETENT_PX,
  addDriver,
  addStop,
  angleFromPointer,
  applyDetentAxis,
  applyModulation,
  arcPath,
  bearingToValue,
  buildSamplers,
  centerValue,
  clamp,
  clampCurveHeight,
  clampOklchToSrgb,
  clampRange,
  colorAtPosition,
  curveComposition,
  curveDuration,
  curvePathData,
  curveY,
  cycleDriverType,
  cycleSegmentType,
  defaultComposition,
  defaultFilterResponse,
  defaultListItemParams,
  displayHex,
  envCurveParam,
  envelopeJoints,
  envelopePoints,
  filterHand01,
  filterHandValue,
  filterResponsePath,
  filterShapeResponse,
  flipDriver,
  flipDriverX,
  flipDriverY,
  flipSegment,
  flipSegmentX,
  flipSegmentY,
  formatClock,
  formatHex,
  getModType,
  gradientFillBox,
  gradientToCss,
  gradientToTransform,
  groupListFields,
  handleLeftStyles,
  hintDomId,
  hslToRgb,
  hsvToRgb,
  insertPoint,
  invertY,
  isIdentityTransfer,
  isOutsideSpan,
  lfoSyncedHz,
  listModTypes,
  modColor,
  modKey,
  modPageLayout,
  modPageWidth,
  modRingArc,
  movePoint,
  moveStop,
  nearestHandle,
  nearestPoint,
  normToValue,
  normalizeAngle,
  normalizeCurveMarkers,
  normalizeFilterValue,
  normalizeGradient,
  normalizeHex,
  normalizeListItems,
  normalizeTransfer,
  normalizeValue,
  nudge,
  nudgeAngle,
  oklchToRgb,
  opacityPercent,
  orderRange,
  parseHex,
  parseListItemSchema,
  percentToValue,
  pickDragTarget,
  plotCurve,
  pointFromValue,
  rampCss,
  readComposition,
  redistributeWeight,
  registerModType,
  removeDriver,
  removePoint,
  removeSegment,
  removeStop,
  resolveAxis,
  resolveFilterAxis,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  sampleTransfer,
  setDriverAnticipate,
  setDriverCurvature,
  setDriverOvershoot,
  setDriverSteepness,
  setGradientAngle,
  setGradientCenter,
  setGradientRotation,
  setGradientScale,
  setGradientSquash,
  setGradientType,
  setHigh,
  setLow,
  setSegmentAnticipate,
  setSegmentCurvature,
  setSegmentOvershoot,
  setSegmentSteepness,
  setStopColor,
  shiftSpan,
  snapAngle,
  snapToStep,
  splitSegment,
  springify,
  transferLut,
  triggerLevels,
  triggersCrossed,
  useTweakTimeline,
  useTweakers,
  valueFromPoint,
  valueToBearing,
  valueToNorm,
  valueToPercent,
  visibleModControls
});
//# sourceMappingURL=index.cjs.map