<script lang="ts">
  import { TweakStore } from 'tweakers/store';
  import type { PanelConfig } from 'tweakers/store';
  import { TimelineStore, isDevDefault } from 'tweakers/timeline';
  import { themeCSS } from '../theme-css';
  import Portal from '../Portal.svelte';
  import Panel from './Panel.svelte';
  import Folder from './Folder.svelte';
  import ShortcutListener from './ShortcutListener.svelte';
  import TimelineToggleButton from './Timeline/TimelineToggleButton.svelte';

  export type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  export type TweakMode = 'popover' | 'inline';
  export type TweakTheme = 'light' | 'dark' | 'system';

  let { position = 'top-right', defaultOpen = true, mode = 'popover', theme = 'system' as TweakTheme, productionEnabled = isDevDefault } = $props<{
    position?: TweakPosition;
    defaultOpen?: boolean;
    mode?: TweakMode;
    theme?: TweakTheme;
    productionEnabled?: boolean;
  }>();

  const inline = $derived(mode === 'inline');

  let panels = $state<PanelConfig[]>([]);
  let timelineCount = $state(0);
  let mounted = $state(false);

  $effect(() => {
    if (typeof document === 'undefined') return;
    const id = 'tweakers-theme';
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
    panels = TweakStore.getPanels('panel');
    timelineCount = TimelineStore.getTimelines().length;

    const unsubPanels = TweakStore.subscribeGlobal(() => {
      panels = TweakStore.getPanels('panel');
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
  <!-- Timeline-backed panels render in TweakTimeline; their presence only adds a
       visibility toggle to the dock toolbar here. -->
  {#snippet timelineToggle()}
    {#if timelineCount > 0}
      <TimelineToggleButton />
    {/if}
  {/snippet}

  {#snippet content()}
    <ShortcutListener>
      <div class="tweakers-root" data-mode={mode} data-theme={theme}>
        <div class="tweakers-panel" data-mode={mode} data-position={inline ? undefined : position}>
          {#if panels.length > 0}
            {#each panels as panel (panel.id)}
              <Panel {panel} defaultOpen={inline || defaultOpen} {inline} toolbarExtra={timelineToggle} />
            {/each}
          {:else}
            <div class="tweakers-panel-wrapper">
              <Folder title="Tweakers" defaultOpen={inline || defaultOpen} isRoot={true} {inline} toolbar={timelineToggle}>
                <div class="tweakers-timeline-toolkit-only">Timeline</div>
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
