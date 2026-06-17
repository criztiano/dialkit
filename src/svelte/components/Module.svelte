<script lang="ts">
  import type { Snippet } from 'svelte';
  import SegmentedControl from './SegmentedControl.svelte';

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

  // The Off/On switch is the expand control: disabling collapses the body
  // away (animated via the grid-rows trick — see theme.css).
</script>

<div class="dialkit-module">
  <div class="dialkit-module-header">
    <span class="dialkit-module-title">{title}</span>
    <div class="dialkit-module-switch">
      <SegmentedControl
        options={[
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ]}
        value={enabled ? 'on' : 'off'}
        onChange={(val) => onEnabledChange(val === 'on')}
      />
    </div>
  </div>

  <div class="dialkit-module-collapse" data-open={enabled}>
    <div class="dialkit-module-collapse-clip">
      <div class="dialkit-module-inner">{@render children?.()}</div>
    </div>
  </div>
</div>
