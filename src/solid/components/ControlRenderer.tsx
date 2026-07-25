import { For } from 'solid-js';
import { DialStore } from '../../store/DialStore';
import type {
  ControlMeta,
  DialValue,
  RangeValue,
  SpringConfig,
  TransitionConfig,
  XYValue,
} from '../../store/DialStore';
import type { GradientValue } from '../../gradient-core';
import { useShortcutContext } from './ShortcutListener';
import { Folder } from './Folder';
import { Slider } from './Slider';
import { RangeSlider } from './RangeSlider';
import { Toggle } from './Toggle';
import { SpringControl } from './SpringControl';
import { TransitionControl, type TransitionDurationControl } from './TransitionControl';
import { TextControl } from './TextControl';
import { SelectControl } from './SelectControl';
import { ColorControl } from './ColorControl';
import { GradientControl } from './GradientControl';
import { XYControl } from './XYControl';

interface ControlRendererProps {
  panelId: string;
  controls: ControlMeta[];
  values: Record<string, DialValue>;
  /** Optional timeline-owned duration rendered inside the transition editor. */
  transitionDuration?: TransitionDurationControl;
}

// Renders a ControlMeta tree with the Solid adapter's full control set.
// Shared by the panel dock (Panel) and the timeline clip popover so every
// control type renders identically in both surfaces.
export function ControlRenderer(props: ControlRendererProps) {
  const shortcut = useShortcutContext();

  const renderControl = (control: ControlMeta) => {
    const value = () => props.values[control.path];
    const active = () =>
      shortcut().activePanelId === props.panelId && shortcut().activePath === control.path;

    switch (control.type) {
      case 'slider':
        return (
          <Slider
            label={control.label}
            value={value() as number}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
            min={control.min}
            max={control.max}
            step={control.step}
            shortcut={control.shortcut}
            shortcutActive={active()}
          />
        );

      case 'range':
        return (
          <RangeSlider
            label={control.label}
            value={value() as RangeValue}
            min={control.min ?? 0}
            max={control.max ?? 1}
            step={control.step}
            defaultValue={control.rangeDefault}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
          />
        );

      case 'toggle':
        return (
          <Toggle
            label={control.label}
            checked={value() as boolean}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
            shortcut={control.shortcut}
            shortcutActive={active()}
          />
        );

      case 'spring':
        return (
          <SpringControl
            panelId={props.panelId}
            path={control.path}
            label={control.label}
            spring={value() as SpringConfig}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
          />
        );

      case 'transition':
        return (
          <TransitionControl
            panelId={props.panelId}
            path={control.path}
            label={control.label}
            value={value() as TransitionConfig}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
            durationControl={props.transitionDuration}
          />
        );

      case 'folder':
        return (
          <Folder title={control.label} defaultOpen={control.defaultOpen ?? true}>
            <For each={control.children ?? []}>{renderControl}</For>
          </Folder>
        );

      case 'text':
        return (
          <TextControl
            label={control.label}
            value={value() as string}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
            placeholder={control.placeholder}
          />
        );

      case 'select':
        return (
          <SelectControl
            label={control.label}
            value={value() as string}
            options={control.options ?? []}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
          />
        );

      case 'color':
        return (
          <ColorControl
            label={control.label}
            value={value() as string}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
            alpha={control.alpha}
            palette={control.palette}
          />
        );

      case 'gradient':
        return (
          <GradientControl
            label={control.label}
            value={value() as GradientValue}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
          />
        );

      case 'xy':
        return (
          <XYControl
            label={control.label}
            value={value() as XYValue}
            onChange={(next) => DialStore.updateValue(props.panelId, control.path, next)}
            x={control.xAxis}
            y={control.yAxis}
            grid={control.grid}
            density={control.density}
            snap={control.snap}
            returnToCenter={control.returnToCenter}
            showValues={control.showValues}
            shortcut={control.shortcut}
            shortcutActive={active()}
          />
        );

      case 'action':
        return (
          <button
            class="dialkit-button"
            onClick={() => DialStore.triggerAction(props.panelId, control.path)}
          >
            {control.label}
          </button>
        );

      default:
        return null;
    }
  };

  return <For each={props.controls}>{renderControl}</For>;
}
