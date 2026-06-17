<script lang="ts">
  import { ICON_GRIP, ICON_PLUS, ICON_TRASH } from '../../icons';
  import { parseListItemSchema, defaultListItemParams } from 'dialkit/store';
  import type { ListItemValue, ListItemType, DialEvent } from 'dialkit/store';
  import Folder from './Folder.svelte';
  import Slider from './Slider.svelte';
  import Toggle from './Toggle.svelte';
  import SelectControl from './SelectControl.svelte';
  import ColorControl from './ColorControl.svelte';
  import TextControl from './TextControl.svelte';

  let { label, value, itemTypes, addLabel, maxItems, onChange, onEvent } = $props<{
    label: string;
    value: ListItemValue[];
    itemTypes: Record<string, ListItemType>;
    addLabel?: string;
    maxItems?: number;
    onChange: (value: ListItemValue[]) => void;
    onEvent: (event: DialEvent) => void;
  }>();

  let picking = $state(false);

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

<Folder title={label} defaultOpen>
  <div class="dialkit-list-items" ondragover={(e) => e.preventDefault()} ondrop={onDrop} role="list">
    {#each value as item, index (index)}
      {@const type = itemTypes[item.type]}
      {#if type}
        {@const fields = parseListItemSchema(type.schema)}
        <div
          class="dialkit-list-item"
          draggable="true"
          role="listitem"
          data-dragging={dragIndex === index ? 'true' : undefined}
          data-over={over?.index === index ? (over.after ? 'after' : 'before') : undefined}
          ondragstart={(e) => onDragStart(e, index)}
          ondragover={(e) => onDragOver(e, index)}
          ondragend={onDragEnd}
        >
          <div class="dialkit-list-item-head">
            <span class="dialkit-list-item-title">{type.label}</span>
            <div class="dialkit-list-item-actions">
              <button
                type="button"
                class="dialkit-list-drag"
                aria-label="Drag to reorder"
                onmousedown={() => (armed = index)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {#each ICON_GRIP as c}
                    <circle cx={c.cx} cy={c.cy} r="1.5" />
                  {/each}
                </svg>
              </button>
              <button
                type="button"
                class="dialkit-list-icon-btn dialkit-list-remove"
                onclick={() => removeItem(index)}
                aria-label={`Remove ${type.label}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  {#each ICON_TRASH as d}
                    <path {d} />
                  {/each}
                </svg>
              </button>
            </div>
          </div>

          {#if fields.length > 0}
            <div class="dialkit-list-item-fields">
              {#each fields as field (field.key)}
                {#if field.kind === 'slider'}
                  <Slider
                    label={field.label}
                    value={item.params[field.key] as number}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onChange={(v) => setParam(index, field.key, v)}
                  />
                {:else if field.kind === 'toggle'}
                  <Toggle
                    label={field.label}
                    checked={item.params[field.key] as boolean}
                    onChange={(v) => setParam(index, field.key, v)}
                  />
                {:else if field.kind === 'select'}
                  <SelectControl
                    label={field.label}
                    value={item.params[field.key] as string}
                    options={field.options ?? []}
                    onChange={(v) => setParam(index, field.key, v)}
                  />
                {:else if field.kind === 'color'}
                  <ColorControl
                    label={field.label}
                    value={item.params[field.key] as string}
                    onChange={(v) => setParam(index, field.key, v)}
                  />
                {:else if field.kind === 'text'}
                  <TextControl
                    label={field.label}
                    value={item.params[field.key] as string}
                    placeholder={field.placeholder}
                    onChange={(v) => setParam(index, field.key, v)}
                  />
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/each}

    {#if value.length === 0 && !picking}
      <div class="dialkit-list-empty">No items yet</div>
    {/if}
  </div>

  {#if !atCapacity}
    <div class="dialkit-list-add">
      <button type="button" class="dialkit-list-add-btn" data-open={String(picking)} onclick={handleAdd}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d={ICON_PLUS} />
        </svg>
        <span>{addLabel ?? 'Add'}</span>
      </button>

      {#if typeEntries.length > 1}
        <div class="dialkit-list-picker" data-open={String(picking)}>
          <div class="dialkit-list-picker-inner">
            {#each typeEntries as [key, type] (key)}
              <button
                type="button"
                class="dialkit-list-picker-chip"
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
