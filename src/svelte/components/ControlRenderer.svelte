<script lang="ts">
  import { getContext } from 'svelte';
  import { DialStore } from 'dialkit/store';
  import type { ControlMeta, DialValue, SpringConfig, TransitionConfig, ListItemValue } from 'dialkit/store';
  import Slider from './Slider.svelte';
  import Toggle from './Toggle.svelte';
  import Folder from './Folder.svelte';
  import SpringControl from './SpringControl.svelte';
  import TransitionControl from './TransitionControl.svelte';
  import TextControl from './TextControl.svelte';
  import SelectControl from './SelectControl.svelte';
  import ColorControl from './ColorControl.svelte';
  import FileControl from './FileControl.svelte';
  import SwatchControl from './SwatchControl.svelte';
  import ChipsControl from './ChipsControl.svelte';
  import ListControl from './ListControl.svelte';
  import ControlRenderer from './ControlRenderer.svelte';
  import { SHORTCUT_CTX } from './ShortcutListener.svelte';
  import type { ShortcutContextValue } from './ShortcutListener.svelte';

  let { panelId, control, values } = $props<{
    panelId: string;
    control: ControlMeta;
    values: Record<string, DialValue>;
  }>();

  const shortcutCtx = getContext<ShortcutContextValue | undefined>(SHORTCUT_CTX);

  const controlValue = $derived(values[control.path]);
  const isShortcutActive = $derived(
    shortcutCtx ? shortcutCtx.activePanelId === panelId && shortcutCtx.activePath === control.path : false
  );
</script>

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
  />
{:else if control.type === 'folder'}
  <Folder title={control.label} defaultOpen={control.defaultOpen ?? true}>
    {#each control.children ?? [] as child (child.path)}
      <ControlRenderer {panelId} control={child} {values} />
    {/each}
  </Folder>
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
  <button class="dialkit-button" onclick={() => DialStore.triggerAction(panelId, control.path)}>
    {control.label}
  </button>
{/if}
