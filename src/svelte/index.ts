// Core API
export { createDialKit } from './createDialKit.svelte';
export type { CreateDialOptions, DialKitValues } from './createDialKit.svelte';

// Root component
export { default as DialRoot } from './components/DialRoot.svelte';
export type { DialPosition, DialMode, DialTheme } from './components/DialRoot.svelte';

// Shortcut components
export { default as ShortcutListener } from './components/ShortcutListener.svelte';
export { SHORTCUT_CTX } from './components/ShortcutListener.svelte';
export type { ShortcutContextValue } from './components/ShortcutListener.svelte';
export { default as ShortcutsMenu } from './components/ShortcutsMenu.svelte';

// Component exports
export { default as Slider } from './components/Slider.svelte';
export { default as Toggle } from './components/Toggle.svelte';
export { default as Folder } from './components/Folder.svelte';
export { default as Module } from './components/Module.svelte';
export { default as ButtonGroup } from './components/ButtonGroup.svelte';
export { default as SpringControl } from './components/SpringControl.svelte';
export { default as SpringVisualization } from './components/SpringVisualization.svelte';
export { default as TransitionControl } from './components/TransitionControl.svelte';
export { default as EasingVisualization } from './components/EasingVisualization.svelte';
export { default as TextControl } from './components/TextControl.svelte';
export { default as SelectControl } from './components/SelectControl.svelte';
export { default as ColorControl } from './components/ColorControl.svelte';
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
