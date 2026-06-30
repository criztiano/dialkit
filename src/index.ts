// Main hook
export { useDialKit } from './hooks/useDialKit';
export type { UseDialOptions } from './hooks/useDialKit';

// Root component (user mounts once)
export { DialRoot } from './components/DialRoot';
export type { DialPosition, DialMode, DialTheme } from './components/DialRoot';

// Individual components (for advanced usage)
export { Slider } from './components/Slider';
export { Toggle } from './components/Toggle';
export { Folder } from './components/Folder';
export { Module } from './components/Module';
export { SegmentedControl } from './components/SegmentedControl';
export { ButtonGroup } from './components/ButtonGroup';
export { SpringControl } from './components/SpringControl';
export { SpringVisualization } from './components/SpringVisualization';
export { TransitionControl } from './components/TransitionControl';
export { EasingVisualization } from './components/EasingVisualization';
export { WaveformVisualization } from './components/WaveformVisualization';
export type { WaveformMode, WaveformLoop } from './components/WaveformVisualization';
export { CurveComposer } from './components/CurveComposer';
export type { CurveType, CurveSegment, CurveDriver, CurveComposition, DriverDirection } from './components/CurveComposer';
export {
  CURVE_CYCLE,
  defaultComposition,
  splitSegment,
  removeSegment,
  flipSegment,
  flipDriver,
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
export { TextControl } from './components/TextControl';
export { SelectControl } from './components/SelectControl';
export { ColorControl } from './components/ColorControl';
export { GalleryControl } from './components/GalleryControl';
export { FileControl } from './components/FileControl';
export { SwatchControl } from './components/SwatchControl';
export { ChipsControl } from './components/ChipsControl';
export { ListControl } from './components/ListControl';
export { PresetManager } from './components/PresetManager';
export { ShortcutsMenu } from './components/ShortcutsMenu';

// Store (for advanced usage)
export { DialStore, parseListItemSchema, defaultListItemParams, normalizeListItems } from './store/DialStore';
export type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  GalleryConfig,
  GalleryItem,
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
