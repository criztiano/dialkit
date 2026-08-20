<script lang="ts">
  import type { Snippet } from 'svelte';
  import Checkbox from './Checkbox.svelte';

  let {
    title,
    enabled,
    onEnabledChange,
    children,
  } = $props<{
    title: string;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    children?: Snippet;
  }>();

  // The enable switch is the expand control: disabling collapses the body
  // away (animated via the grid-rows trick — see theme.css).
</script>

<div class="tweakers-module">
  <div class="tweakers-module-header">
    <Checkbox checked={enabled} onChange={onEnabledChange} label={title} />
    <span class="tweakers-module-title">{title}</span>
  </div>

  <div class="tweakers-module-collapse" data-open={enabled}>
    <div class="tweakers-module-collapse-clip">
      <div class="tweakers-module-inner">{@render children?.()}</div>
    </div>
  </div>
</div>
