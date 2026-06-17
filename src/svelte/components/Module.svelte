<script lang="ts">
  import type { Snippet } from 'svelte';
  import SegmentedControl from './SegmentedControl.svelte';
  import { ICON_CHEVRON } from '../../icons';

  let {
    title,
    enabled,
    onEnabledChange,
    children,
    defaultOpen = true,
    collapsible = true,
  } = $props<{
    title: string;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    children?: Snippet;
    defaultOpen?: boolean;
    collapsible?: boolean;
  }>();

  let isOpen = $state(defaultOpen);
  const expanded = $derived(collapsible ? isOpen : true);
  // Body shows only when enabled AND expanded; either being false collapses
  // it (animated via the grid-rows trick — see theme.css).
  const visible = $derived(enabled && expanded);
  const toggleOpen = () => {
    if (collapsible) isOpen = !isOpen;
  };
</script>

<div class="dialkit-module">
  <!-- Plain div + onclick mirrors the kit's existing Folder/Panel headers;
       keyboard a11y for collapsible headers is a library-wide follow-up. -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="dialkit-module-header"
    style={`cursor:${collapsible ? 'pointer' : 'default'};`}
    onclick={toggleOpen}
  >
    <span class="dialkit-module-title">{title}</span>
    <div
      class="dialkit-module-switch"
      role="presentation"
      onclick={(e) => e.stopPropagation()}
    >
      <SegmentedControl
        options={[
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ]}
        value={enabled ? 'on' : 'off'}
        onChange={(val) => onEnabledChange(val === 'on')}
      />
    </div>
    {#if collapsible}
      <svg
        class={`dialkit-module-icon${visible ? '' : ' dialkit-module-icon-collapsed'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d={ICON_CHEVRON} />
      </svg>
    {/if}
  </div>

  <div class="dialkit-module-collapse" data-open={visible}>
    <div class="dialkit-module-collapse-clip">
      <div class="dialkit-module-inner">{@render children?.()}</div>
    </div>
  </div>
</div>
