<script lang="ts">
  import { getContext } from 'svelte';
  import { DialStore, hintDomId } from 'dialkit/store';
  import type { ControlMeta, DialValue, SpringConfig, TransitionConfig, ListItemValue, XYValue, RangeValue } from 'dialkit/store';
  import type { GradientValue } from '../../gradient-core';
  import Slider from './Slider.svelte';
  import RangeSlider from './RangeSlider.svelte';
  import Toggle from './Toggle.svelte';
  import Folder from './Folder.svelte';
  import ModuleFolder from './ModuleFolder.svelte';
  import ControlShell from './ControlShell.svelte';
  import SpringControl from './SpringControl.svelte';
  import TransitionControl from './TransitionControl.svelte';
  import type { TransitionDurationControl } from './TransitionControl.svelte';
  import TextControl from './TextControl.svelte';
  import SelectControl from './SelectControl.svelte';
  import ColorControl from './ColorControl.svelte';
  import GradientControl from './GradientControl.svelte';
  import XYControl from './XYControl.svelte';
  import FileControl from './FileControl.svelte';
  import SwatchControl from './SwatchControl.svelte';
  import ChipsControl from './ChipsControl.svelte';
  import ListControl from './ListControl.svelte';
  import ControlRenderer from './ControlRenderer.svelte';
  import { SHORTCUT_CTX } from './ShortcutListener.svelte';
  import type { ShortcutContextValue } from './ShortcutListener.svelte';

  let { panelId, control, values, transitionDuration } = $props<{
    panelId: string;
    control: ControlMeta;
    values: Record<string, DialValue>;
    transitionDuration?: TransitionDurationControl;
  }>();

  const shortcutCtx = getContext<ShortcutContextValue | undefined>(SHORTCUT_CTX);

  // Panel id and path are both stable and unique, so no id generator is needed.
  const hintId = $derived(hintDomId(panelId, control.path));
  const controlValue = $derived(values[control.path]);
  const isShortcutActive = $derived(
    shortcutCtx ? shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path : false
  );
</script>

{#if control.type === 'folder' && control.module}
  <!-- A folder that declared `_enabled` renders as a module: the header
       switch drives the `<path>._enabled` value through the store. -->
  <ModuleFolder
    title={control.label}
    enabled={values[`${control.path}._enabled`] as boolean}
    onEnabledChange={(next) => DialStore.updateValue(panelId, `${control.path}._enabled`, next)}
    defaultOpen={control.defaultOpen ?? true}
    hint={control.hint}
    hintId={hintId}
  >
    {#each control.children ?? [] as child (child.path)}
      <ControlRenderer {panelId} control={child} {values} {transitionDuration} />
    {/each}
  </ModuleFolder>
{:else if control.type === 'folder'}
  <Folder
    title={control.label}
    defaultOpen={control.defaultOpen ?? true}
    collapsible={control.collapsible ?? true}
    hint={control.hint}
    hintId={hintId}
  >
    {#each control.children ?? [] as child (child.path)}
      <ControlRenderer {panelId} control={child} {values} {transitionDuration} />
    {/each}
  </Folder>
{:else}
  <ControlShell
    hint={control.hint}
    title={control.path}
    id={hintId}
    affordance={control.affordance}
    {panelId}
    path={control.path}
  >
    {#if control.type === 'slider'}
      <Slider
        label={control.label}
        value={controlValue as number}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        min={control.min}
        max={control.max}
        step={control.step}
        shortcut={control.shortcut}
        shortcutActive={isShortcutActive}
      />
    {:else if control.type === 'range'}
      <RangeSlider
        label={control.label}
        value={controlValue as RangeValue}
        min={control.min ?? 0}
        max={control.max ?? 1}
        step={control.step}
        defaultValue={control.rangeDefault}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
      />
    {:else if control.type === 'toggle'}
      <Toggle
        label={control.label}
        checked={controlValue as boolean}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        shortcut={control.shortcut}
        shortcutActive={isShortcutActive}
      />
    {:else if control.type === 'spring'}
      <SpringControl
        {panelId}
        path={control.path}
        label={control.label}
        spring={controlValue as SpringConfig}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
      />
    {:else if control.type === 'transition'}
      <TransitionControl
        {panelId}
        path={control.path}
        label={control.label}
        value={controlValue as TransitionConfig}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        durationControl={transitionDuration}
      />
    {:else if control.type === 'text'}
      <TextControl
        label={control.label}
        value={controlValue as string}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        placeholder={control.placeholder}
      />
    {:else if control.type === 'select'}
      <SelectControl
        label={control.label}
        value={controlValue as string}
        options={control.options ?? []}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
      />
    {:else if control.type === 'color'}
      <ColorControl
        label={control.label}
        value={controlValue as string}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        alpha={control.alpha}
        palette={control.palette}
      />
    {:else if control.type === 'gradient'}
      <GradientControl
        label={control.label}
        value={controlValue as GradientValue}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
      />
    {:else if control.type === 'xy'}
      <XYControl
        label={control.label}
        value={controlValue as XYValue}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        x={control.xAxis}
        y={control.yAxis}
        grid={control.grid}
        density={control.density}
        snap={control.snap}
        returnToCenter={control.returnToCenter}
        showValues={control.showValues}
        shortcut={control.shortcut}
        shortcutActive={isShortcutActive}
      />
    {:else if control.type === 'file'}
      <FileControl
        label={control.label}
        value={controlValue as string}
        accept={control.accept}
        multiple={control.multiple}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        onPick={(files) => DialStore.emitEvent(panelId, control.path, { kind: 'file', files })}
      />
    {:else if control.type === 'swatch'}
      <SwatchControl
        label={control.label}
        value={controlValue as string}
        options={control.swatchOptions ?? []}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
      />
    {:else if control.type === 'chips'}
      <ChipsControl
        label={control.label}
        value={controlValue as string}
        options={control.chipOptions ?? []}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        onRemove={(v) => DialStore.emitEvent(panelId, control.path, { kind: 'remove', value: v })}
      />
    {:else if control.type === 'list'}
      <ListControl
        label={control.label}
        value={controlValue as ListItemValue[]}
        itemTypes={control.itemTypes ?? {}}
        addLabel={control.addLabel}
        maxItems={control.maxItems}
        onChange={(v) => DialStore.updateValue(panelId, control.path, v)}
        onEvent={(event) => DialStore.emitEvent(panelId, control.path, event)}
      />
    {:else if control.type === 'action'}
      <!-- The wrapper greys every control out, but only a real `disabled` takes
           a button out of the tab order too. -->
      <button
        class="dialkit-button"
        disabled={DialStore.isDisabled(panelId, control.path)}
        onclick={() => DialStore.triggerAction(panelId, control.path)}
      >
        {control.label}
      </button>
    {/if}
  </ControlShell>
{/if}
