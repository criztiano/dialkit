<script lang="ts">
  import { ICON_GRIP, ICON_PLUS, ICON_TRASH } from '../../icons';
  import { parseListItemSchema, groupListFields, defaultListItemParams, hintDomId } from 'tweakers/store';
  import type { ListItemValue, ListItemType, ListField, TweakEvent } from 'tweakers/store';
  import Folder from './Folder.svelte';
  import ControlShell from './ControlShell.svelte';
  import Slider from './Slider.svelte';
  import Toggle from './Toggle.svelte';
  import SelectControl from './SelectControl.svelte';
  import ColorControl from './ColorControl.svelte';
  import SwatchControl from './SwatchControl.svelte';
  import TextControl from './TextControl.svelte';

  let { label, value, itemTypes, addLabel, maxItems, onChange, onEvent } = $props<{
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    onEvent: (event: TweakEvent) => void;
  }>();

  let picking = $state(false);
  // Index of the row whose title is being renamed in place, if any.
  let editing = $state<number | null>(null);

  // Drag-to-reorder. `armed` is set on handle mousedown and checked at dragstart
  // so dragging a slider never starts a reorder.
  let armed = -1;
  let dragIndex = $state<number | null>(null);
  let over = $state<{ index: number; after: boolean } | null>(null);

  const typeEntries = $derived(Object.entries(itemTypes) as [string, ListItemType][]);
  const atCapacity = $derived(maxItems != null && value.length >= maxItems);

  function addItem(type: string) {
    if (atCapacity || !itemTypes[type]) return;
    onChange([...value, { type, params: defaultListItemParams(itemTypes[type].schema) }]);
    onEvent({ kind: 'list', op: 'add', index: value.length, itemType: type });
  }

  function removeItem(index: number) {
    onChange(value.filter((_: ListItemValue, i: number) => i !== index));
    onEvent({ kind: 'list', op: 'remove', index });
  }

  function moveItem(from: number, to: number) {
    if (from === to || to < 0 || to >= value.length) return;
    const next = value.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    onEvent({ kind: 'list', op: 'move', from, to });
  }

  // A blank title is stored as absent, not as '', so clearing the field reverts
  // the row to its item type's label.
  function commitTitle(index: number, raw: string) {
    editing = null;
    const next = raw.trim();
    if ((value[index]?.title ?? '') === next) return;
    onChange(
      value.map((item: ListItemValue, i: number) => {
        if (i !== index) return item;
        const row: ListItemValue = { type: item.type, params: item.params };
        if (next) row.title = next;
        return row;
      })
    );
    onEvent({ kind: 'list', op: 'rename', index });
  }

  /** Focus and select a freshly-revealed title field. */
  function focusSelect(node: HTMLInputElement) {
    node.focus();
    node.select();
  }

  function setParam(index: number, key: string, v: number | boolean | string) {
    onChange(
      value.map((item: ListItemValue, i: number) =>
        i === index ? { ...item, params: { ...item.params, [key]: v } } : item
      )
    );
    onEvent({ kind: 'list', op: 'set', index });
  }

  function handleAdd() {
    if (typeEntries.length === 1) addItem(typeEntries[0][0]);
    else picking = !picking;
  }

  function onDragStart(e: DragEvent, index: number) {
    if (armed !== index) { e.preventDefault(); return; }
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
    dragIndex = index;
  }

  function onDragOver(e: DragEvent, index: number) {
    if (dragIndex === null) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    if (!(over?.index === index && over.after === after)) over = { index, after };
  }

  function onDrop() {
    if (dragIndex !== null && over !== null) {
      let to = over.after ? over.index + 1 : over.index;
      if (dragIndex < to) to -= 1;
      moveItem(dragIndex, to);
    }
    armed = -1;
    dragIndex = null;
    over = null;
  }

  function onDragEnd() {
    armed = -1;
    dragIndex = null;
    over = null;
  }
</script>

<svelte:window onmouseup={() => (armed = -1)} />

{#snippet fieldList(fields: ListField[], params: Record<string, number | boolean | string>, rowId: string, index: number)}
  <div class="tweakers-list-item-fields">
    {#each fields as field (field.key)}
      <ControlShell hint={field.hint} id={hintDomId(rowId, field.key)}>
        {#if field.kind === 'slider'}
          <Slider
            label={field.label}
            value={params[field.key] as number}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(v) => setParam(index, field.key, v)}
          />
        {:else if field.kind === 'toggle'}
          <Toggle
            label={field.label}
            checked={params[field.key] as boolean}
            onChange={(v) => setParam(index, field.key, v)}
          />
        {:else if field.kind === 'select'}
          <SelectControl
            label={field.label}
            value={params[field.key] as string}
            options={field.options ?? []}
            onChange={(v) => setParam(index, field.key, v)}
          />
        {:else if field.kind === 'color'}
          <ColorControl
            label={field.label}
            value={params[field.key] as string}
            palette={field.palette}
            onChange={(v) => setParam(index, field.key, v)}
          />
        {:else if field.kind === 'swatch'}
          <SwatchControl
            label={field.label}
            value={params[field.key] as string}
            options={field.swatchOptions ?? []}
            onChange={(v) => setParam(index, field.key, v)}
          />
        {:else if field.kind === 'text'}
          <TextControl
            label={field.label}
            value={params[field.key] as string}
            placeholder={field.placeholder}
            onChange={(v) => setParam(index, field.key, v)}
          />
        {/if}
      </ControlShell>
    {/each}
  </div>
{/snippet}


<Folder title={label} defaultOpen>
  <div class="tweakers-list-items" ondragover={(e) => e.preventDefault()} ondrop={onDrop} role="list">
    {#each value as item, index (index)}
      {@const type = itemTypes[item.type]}
      {#if type}
        {@const grouped = groupListFields(parseListItemSchema(type.schema, type.hints, type.groups))}
        {@const flat = grouped.flat}
        {@const groups = grouped.groups}
        {@const rowTitle = item.title ?? type.label}
        <!-- A draggable ancestor swallows text selection, so the row stops being
             draggable while its title is being edited. -->
        <div
          class="tweakers-list-item"
          draggable={editing === index ? 'false' : 'true'}
          role="listitem"
          data-dragging={dragIndex === index ? 'true' : undefined}
          data-over={over?.index === index ? (over.after ? 'after' : 'before') : undefined}
          ondragstart={(e) => onDragStart(e, index)}
          ondragover={(e) => onDragOver(e, index)}
          ondragend={onDragEnd}
        >
          <div class="tweakers-list-item-head">
            <button
              type="button"
              class="tweakers-list-drag"
              aria-label="Drag to reorder"
              onmousedown={() => (armed = index)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {#each ICON_GRIP as c}
                  <circle cx={c.cx} cy={c.cy} r="1.5" />
                {/each}
              </svg>
            </button>
            {#if editing === index}
              <!-- Unbound: the field owns the draft, so Escape can restore the
                   original and let the shared blur path no-op it away. -->
              <input
                class="tweakers-list-item-title"
                value={item.title ?? ''}
                placeholder={type.label}
                use:focusSelect
                onblur={(e) => commitTitle(index, e.currentTarget.value)}
                onkeydown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                  else if (e.key === 'Escape') {
                    e.currentTarget.value = item.title ?? '';
                    e.currentTarget.blur();
                  }
                }}
              />
            {:else}
              <button
                type="button"
                class="tweakers-list-item-title"
                aria-label={`Rename ${rowTitle}`}
                onclick={() => (editing = index)}
              >
                {rowTitle}
              </button>
            {/if}
            <div class="tweakers-list-item-actions">
              <button
                type="button"
                class="tweakers-list-icon-btn tweakers-list-remove"
                onclick={() => removeItem(index)}
                aria-label={`Remove ${rowTitle}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  {#each ICON_TRASH as d}
                    <path {d} />
                  {/each}
                </svg>
              </button>
            </div>
          </div>

          {#if flat.length > 0}
            {@render fieldList(flat, item.params, `${label}-${index}`, index)}
          {/if}

          <!-- Only the first section starts open: the point of grouping is to
               stop a six-control row reading as a wall. -->
          {#each groups as group, groupIndex (group.label)}
            <Folder title={group.label} defaultOpen={groupIndex === 0}>
              {@render fieldList(group.fields, item.params, `${label}-${index}`, index)}
            </Folder>
          {/each}
        </div>
      {/if}
    {/each}

    {#if value.length === 0 && !picking}
      <div class="tweakers-list-empty">No items yet</div>
    {/if}
  </div>

  {#if !atCapacity}
    <div class="tweakers-list-add">
      <button type="button" class="tweakers-list-add-btn" data-open={String(picking)} onclick={handleAdd}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d={ICON_PLUS} />
        </svg>
        <span>{addLabel ?? 'Add'}</span>
      </button>

      {#if typeEntries.length > 1}
        <div class="tweakers-list-picker" data-open={String(picking)}>
          <div class="tweakers-list-picker-inner">
            {#each typeEntries as [key, type] (key)}
              <button
                type="button"
                class="tweakers-list-picker-chip"
                onclick={() => { addItem(key); picking = false; }}
              >
                {type.label}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</Folder>
