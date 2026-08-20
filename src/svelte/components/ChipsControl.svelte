<script lang="ts">
  import { ICON_CLOSE } from '../../icons';
  import type { ChipOption } from 'tweakers/store';

  let { label, value, options, onChange, onRemove } = $props<{
    label: string;
    value: string;
    options: ChipOption[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
  }>();
</script>

<div class="tweakers-chips">
  {#if label}
    <span class="tweakers-chips-label">{label}</span>
  {/if}
  <div class="tweakers-chips-grid" role="listbox" aria-label={label}>
    {#each options as option (option.value)}
      <div class="tweakers-chip" data-active={String(option.value === value)}>
        <button
          type="button"
          class="tweakers-chip-select"
          role="option"
          aria-selected={option.value === value}
          onclick={() => onChange(option.value)}
        >
          {option.label}
        </button>
        {#if option.removable}
          <button
            type="button"
            class="tweakers-chip-remove"
            aria-label={`Remove ${option.label}`}
            onclick={() => onRemove(option.value)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d={ICON_CLOSE} />
            </svg>
          </button>
        {/if}
      </div>
    {/each}
  </div>
</div>
