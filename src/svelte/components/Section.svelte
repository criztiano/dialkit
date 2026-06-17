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
    dimWhenDisabled = true,
  } = $props<{
    title: string;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    children?: Snippet;
    defaultOpen?: boolean;
    collapsible?: boolean;
    dimWhenDisabled?: boolean;
  }>();

  let isOpen = $state(defaultOpen);
  const open = $derived(collapsible ? isOpen : true);
  const toggleOpen = () => {
    if (collapsible) isOpen = !isOpen;
  };
</script>

<div class="dialkit-section">
  <div class="dialkit-section-header">
    <!-- Plain div + onclick mirrors the kit's existing Folder/Panel headers;
         keyboard a11y for collapsible headers is a library-wide follow-up. -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="dialkit-section-title-row"
      style={`cursor:${collapsible ? 'pointer' : 'default'};`}
      onclick={toggleOpen}
    >
      {#if collapsible}
        <svg
          class={`dialkit-section-icon${open ? '' : ' dialkit-section-icon-collapsed'}`}
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
      <span class="dialkit-section-title">{title}</span>
    </div>
    <div
      class="dialkit-section-switch"
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
  </div>

  {#if open}
    <div
      class={`dialkit-section-content${dimWhenDisabled && !enabled ? ' dialkit-section-disabled' : ''}`}
    >
      <div class="dialkit-section-inner">{@render children?.()}</div>
    </div>
  {/if}
</div>
