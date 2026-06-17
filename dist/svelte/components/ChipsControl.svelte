<script lang="ts">
  import { ICON_CLOSE } from '../../icons';
  import type { ChipOption } from 'dialkit/store';

  let { label, value, options, onChange, onRemove } = $props<{
    label: string;
    value: string;
    options: ChipOption[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
  }>();
</script>

<div class="dialkit-chips">
  {#if label}
    <span class="dialkit-chips-label">{label}</span>
  {/if}
  <div class="dialkit-chips-grid" role="listbox" aria-label={label}>
    {#each options as option (option.value)}
      <div class="dialkit-chip" data-active={String(option.value === value)}>
        <button
          type="button"
          class="dialkit-chip-select"
          role="option"
          aria-selected={option.value === value}
          onclick={() => onChange(option.value)}
        >
          {option.label}
        </button>
        {#if option.removable}
          <button
            type="button"
            class="dialkit-chip-remove"
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
