<script lang="ts">
  import type { Snippet } from 'svelte';
  import SegmentedControl from './SegmentedControl.svelte';

  let {
    title,
    enabled,
    onEnabledChange,
    defaultOpen = true,
    hint,
    hintId,
    children,
  } = $props<{
    title: string;
    /** Whether the module is on — the value at the folder's `_enabled` path. */
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    /** Initial open state while enabled (`_collapsed: true` starts closed). */
    defaultOpen?: boolean;
    /** One line of help for the section, revealed on hover over the header. */
    hint?: string;
    hintId?: string;
    children?: Snippet;
  }>();

  // A config-level module: a folder that declared `_enabled`. Same idiom as
  // the standalone Module — the header switch doubles as the expand control
  // and the body collapses away with the grid-rows height transition when off
  // (see theme.css). On top of that, clicking the header toggles the open
  // state while enabled, so `_collapsed` still controls how the section starts.
  let isOpen = $state(defaultOpen);

  const handleEnabledChange = (next: boolean) => {
    onEnabledChange(next);
    // Turning on always reveals the body — a switch that lands on a still-
    // collapsed section would read as broken.
    if (next) isOpen = true;
  };
</script>

<div class="dialkit-module">
  <div
    class="dialkit-module-header dialkit-module-header-toggle"
    onclick={() => { if (enabled) isOpen = !isOpen; }}
    data-hint={hint ? 'true' : undefined}
    aria-describedby={hint ? hintId : undefined}
  >
    <span class="dialkit-module-title">{title}</span>
    <div class="dialkit-module-switch" onclick={(e) => e.stopPropagation()}>
      <SegmentedControl
        options={[
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ]}
        value={enabled ? 'on' : 'off'}
        onChange={(val) => handleEnabledChange(val === 'on')}
      />
    </div>
    {#if hint}
      <span class="dialkit-hint" id={hintId} role="tooltip">{hint}</span>
    {/if}
  </div>

  <div class="dialkit-module-collapse" data-open={enabled && isOpen}>
    <div class="dialkit-module-collapse-clip">
      <div class="dialkit-module-inner">{@render children?.()}</div>
    </div>
  </div>
</div>
