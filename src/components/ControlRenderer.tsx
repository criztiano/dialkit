import { useContext } from 'react';
import { DialStore, hintDomId, ControlMeta, DialValue, SpringConfig, TransitionConfig, ListItemValue, XYValue } from '../store/DialStore';
import type { RangeValue } from '../store/DialStore';
import type { GradientValue } from '../gradient-core';
import { ShortcutContext } from './ShortcutListener';
import { Folder } from './Folder';
import { ControlShell } from './ControlShell';
import { Slider } from './Slider';
import { RangeSlider } from './RangeSlider';
import { Toggle } from './Toggle';
import { SpringControl } from './SpringControl';
import { TransitionControl } from './TransitionControl';
import { TextControl } from './TextControl';
import { SelectControl } from './SelectControl';
import { ColorControl } from './ColorControl';
import { GradientControl } from './GradientControl';
import { XYControl } from './XYControl';
import { GalleryControl } from './GalleryControl';
import { FileControl } from './FileControl';
import { SwatchControl } from './SwatchControl';
import { ChipsControl } from './ChipsControl';
import { ListControl } from './ListControl';

interface ControlRendererProps {
  panelId: string;
  controls: ControlMeta[];
  values: Record<string, DialValue>;
  /** Optional timeline-owned duration rendered inside the transition editor. */
  transitionDuration?: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  };
}

// Renders a ControlMeta tree with the full DialKit control set.
// Shared by the panel dock and the timeline clip popover so every control type
// (including this fork's extras: range, gradient, xy, gallery, file, swatch,
// chips, list) renders identically in both surfaces.
export function ControlRenderer({ panelId, controls, values, transitionDuration }: ControlRendererProps) {
  const shortcutCtx = useContext(ShortcutContext);

  const renderControlNode = (control: ControlMeta) => {
    const value = values[control.path];

    switch (control.type) {
      case 'slider':
        return (
          <Slider
            key={control.path}
            label={control.label}
            value={value as number}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
            min={control.min}
            max={control.max}
            step={control.step}
            shortcut={control.shortcut}
            shortcutActive={shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path}
          />
        );

      case 'range':
        return (
          <RangeSlider
            key={control.path}
            label={control.label}
            value={value as RangeValue}
            min={control.min ?? 0}
            max={control.max ?? 1}
            step={control.step}
            defaultValue={control.rangeDefault}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'toggle':
        return (
          <Toggle
            key={control.path}
            label={control.label}
            checked={value as boolean}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
            shortcut={control.shortcut}
            shortcutActive={shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path}
          />
        );

      case 'spring':
        return (
          <SpringControl
            key={control.path}
            panelId={panelId}
            path={control.path}
            label={control.label}
            spring={value as SpringConfig}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'transition':
        return (
          <TransitionControl
            key={control.path}
            panelId={panelId}
            path={control.path}
            label={control.label}
            value={value as TransitionConfig}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
            durationControl={transitionDuration}
          />
        );

      case 'folder':
        return (
          <Folder
            key={control.path}
            title={control.label}
            defaultOpen={control.defaultOpen ?? true}
            hint={control.hint}
            hintId={hintDomId(panelId, control.path)}
          >
            {control.children?.map(renderControl)}
          </Folder>
        );

      case 'text':
        return (
          <TextControl
            key={control.path}
            label={control.label}
            value={value as string}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
            placeholder={control.placeholder}
          />
        );

      case 'select':
        return (
          <SelectControl
            key={control.path}
            label={control.label}
            value={value as string}
            options={control.options ?? []}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'color':
        return (
          <ColorControl
            key={control.path}
            label={control.label}
            value={value as string}
            alpha={control.alpha}
            palette={control.palette}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'gradient':
        return (
          <GradientControl
            key={control.path}
            label={control.label}
            value={value as GradientValue}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'xy':
        return (
          <XYControl
            key={control.path}
            label={control.label}
            value={value as XYValue}
            x={control.xAxis}
            y={control.yAxis}
            grid={control.grid}
            density={control.density}
            snap={control.snap}
            returnToCenter={control.returnToCenter}
            showValues={control.showValues}
            shortcut={control.shortcut}
            shortcutActive={shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'gallery':
        return (
          <GalleryControl
            key={control.path}
            label={control.label}
            value={value as string}
            items={control.items ?? []}
            columns={control.columns}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'file':
        return (
          <FileControl
            key={control.path}
            label={control.label}
            value={value as string}
            accept={control.accept}
            multiple={control.multiple}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
            onPick={(files) => DialStore.emitEvent(panelId, control.path, { kind: 'file', files })}
          />
        );

      case 'swatch':
        return (
          <SwatchControl
            key={control.path}
            label={control.label}
            value={value as string}
            options={control.swatchOptions ?? []}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
          />
        );

      case 'chips':
        return (
          <ChipsControl
            key={control.path}
            label={control.label}
            value={value as string}
            options={control.chipOptions ?? []}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
            onRemove={(v) => DialStore.emitEvent(panelId, control.path, { kind: 'remove', value: v })}
          />
        );

      case 'list':
        return (
          <ListControl
            key={control.path}
            label={control.label}
            value={value as ListItemValue[]}
            itemTypes={control.itemTypes ?? {}}
            addLabel={control.addLabel}
            maxItems={control.maxItems}
            onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
            onEvent={(event) => DialStore.emitEvent(panelId, control.path, event)}
          />
        );

      case 'action':
        return (
          <button
            key={control.path}
            className="dialkit-button"
            // The wrapper greys every control out, but only a real `disabled`
            // takes a button out of the tab order too.
            disabled={DialStore.isDisabled(panelId, control.path)}
            onClick={() => DialStore.triggerAction(panelId, control.path)}
          >
            {control.label}
          </button>
        );

      default:
        return null;
    }
  };

  // Wrap leaf controls so they can carry a hint. Without one the wrapper falls
  // back to a native tooltip showing the config path — a quick dev reference for
  // which key a control maps to. Folders manage their own rows.
  const renderControl = (control: ControlMeta) => {
    const node = renderControlNode(control);
    if (control.type === 'folder') return node;
    return (
      <ControlShell
        key={control.path}
        hint={control.hint}
        title={control.path}
        id={hintDomId(panelId, control.path)}
        affordance={control.affordance}
        panelId={panelId}
        path={control.path}
      >
        {node}
      </ControlShell>
    );
  };

  return <>{controls.map(renderControl)}</>;
}
