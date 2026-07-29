<script lang="ts">
  import { DialStore } from 'dialkit/store';
  import type { PanelConfig } from 'dialkit/store';
  import { TimelineStore, isDevDefault } from 'dialkit/timeline';
  import { themeCSS } from '../theme-css';
  import Portal from '../Portal.svelte';
  import Panel from './Panel.svelte';
  import Folder from './Folder.svelte';
  import ShortcutListener from './ShortcutListener.svelte';
  import TimelineToggleButton from './Timeline/TimelineToggleButton.svelte';

  export type DialPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  export type DialMode = 'popover' | 'inline';
  export type DialTheme = 'light' | 'dark' | 'system';

  let { position = 'top-right', defaultOpen = true, mode = 'popover', theme = 'system' as DialTheme, productionEnabled = isDevDefault } = $props<{
    position?: DialPosition;
    defaultOpen?: boolean;
    mode?: DialMode;
    theme?: DialTheme;
    productionEnabled?: boolean;
  }>();

  const inline = $derived(mode === 'inline');

  let panels = $state<PanelConfig[]>([]);
  let timelineCount = $state(0);
  let mounted = $state(false);

  $effect(() => {
    if (typeof document === 'undefined') return;
    const id = 'dialkit-theme';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = themeCSS;
      document.head.appendChild(style);
    }
  });

  $effect(() => {
    if (typeof window === 'undefined') return;

    mounted = true;
    panels = DialStore.getPanels('panel');
    timelineCount = TimelineStore.getTimelines().length;

    const unsubPanels = DialStore.subscribeGlobal(() => {
      panels = DialStore.getPanels('panel');
    });
    const unsubTimelines = TimelineStore.subscribeGlobal(() => {
      timelineCount = TimelineStore.getTimelines().length;
    });

    return () => {
      unsubPanels();
      unsubTimelines();
    };
  });
</script>

{#if productionEnabled && mounted && (panels.length > 0 || timelineCount > 0)}
  <!-- Timeline-backed panels render in DialTimeline; their presence only adds a
       visibility toggle to the dock toolbar here. -->
  {#snippet timelineToggle()}
    {#if timelineCount > 0}
      <TimelineToggleButton />
    {/if}
  {/snippet}

  {#snippet content()}
    <ShortcutListener>
      <div class="dialkit-root" data-mode={mode} data-theme={theme}>
        <div class="dialkit-panel" data-mode={mode} data-position={inline ? undefined : position}>
          {#if panels.length > 0}
            {#each panels as panel (panel.id)}
              <Panel {panel} defaultOpen={inline || defaultOpen} {inline} toolbarExtra={timelineToggle} />
            {/each}
          {:else}
            <div class="dialkit-panel-wrapper">
              <Folder title="DialKit" defaultOpen={inline || defaultOpen} isRoot={true} {inline} toolbar={timelineToggle}>
                <div class="dialkit-timeline-toolkit-only">Timeline</div>
              </Folder>
            </div>
          {/if}
        </div>
      </div>
    </ShortcutListener>
  {/snippet}

  {#if inline}
    {@render content()}
  {:else}
    <Portal target="body">
      {@render content()}
    </Portal>
  {/if}
{/if}
