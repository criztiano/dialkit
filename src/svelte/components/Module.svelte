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

<div class="dialkit-module">
  <div class="dialkit-module-header">
    <Checkbox checked={enabled} onChange={onEnabledChange} label={title} />
    <span class="dialkit-module-title">{title}</span>
  </div>

  <div class="dialkit-module-collapse" data-open={enabled}>
    <div class="dialkit-module-collapse-clip">
      <div class="dialkit-module-inner">{@render children?.()}</div>
    </div>
  </div>
</div>
