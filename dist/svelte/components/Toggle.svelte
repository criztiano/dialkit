<script lang="ts">
  import Checkbox from './Checkbox.svelte';
  import type { ShortcutConfig } from 'tweakers/store';
  import { formatToggleShortcut } from '../../shortcut-utils';

  let { label, checked, onChange, shortcut, shortcutActive = false } = $props<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
  }>();
</script>

<div class="tweakers-labeled-control tweakers-labeled-control-check">
  <Checkbox {checked} {onChange} {label} />
  <span class="tweakers-labeled-control-label">
    {label}
    {#if shortcut}
      <span class={`tweakers-shortcut-pill${shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`}>
        {formatToggleShortcut(shortcut)}
      </span>
    {/if}
  </span>
</div>
