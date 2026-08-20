<script lang="ts">
  import { Spring } from 'svelte/motion';
  import Portal from '../Portal.svelte';
  import { TweakStore } from 'tweakers/store';
  import { dropdownTransition } from './transitions';
  import { ICON_CHEVRON, ICON_TRASH } from '../../icons';

  // Structural on purpose: stock Preset[] and provider-derived PresetItem[]
  // both fit. `deletable` defaults to true so stock callers stay unchanged.
  type PresetRow = { id: string; name: string; deletable?: boolean };

  let { panelId, presets, activePresetId, providerMode = false } = $props<{
    panelId: string;
    presets: PresetRow[];
    activePresetId: string | null;
    /** Host-provider mode: the implicit "Version 1" base row is hidden. */
    providerMode?: boolean;
  }>();

  let isOpen = $state(false);
  let pos = $state({ top: 0, left: 0, width: 0 });
  let portalTarget = $state<HTMLElement | null>(null);
  let triggerRef: HTMLButtonElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;

  const chevronRotation = new Spring(0, { stiffness: 0.2, damping: 0.6 });
  const chevronOpacity = new Spring(0.25, { stiffness: 0.2, damping: 0.6 });

  const hasPresets = $derived(presets.length > 0);
  const activePreset = $derived(presets.find((p: PresetRow) => p.id === activePresetId));

  const updatePos = () => {
    const rect = triggerRef?.getBoundingClientRect();
    if (!rect) return;
    pos = { top: rect.bottom + 4, left: rect.left, width: rect.width };
  };

  const openDropdown = () => {
    if (!hasPresets) return;
    updatePos();
    isOpen = true;
  };

  const closeDropdown = () => {
    isOpen = false;
  };

  $effect(() => {
    if (typeof document === 'undefined' || !triggerRef) return;
    portalTarget = (triggerRef.closest('.tweakers-root') as HTMLElement | null) ?? document.body;
  });

  $effect(() => {
    chevronRotation.set(isOpen ? 180 : 0);
    chevronOpacity.set(hasPresets ? 0.6 : 0.25);
  });

  $effect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const handleViewportChange = () => updatePos();
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef?.contains(target) || dropdownRef?.contains(target)) return;
      closeDropdown();
    };

    updatePos();
    document.addEventListener('mousedown', handler);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  });

  const handleSelect = (presetId: string | null) => {
    TweakStore.selectPreset(panelId, presetId);
    closeDropdown();
  };

  const handleDelete = (e: MouseEvent, presetId: string) => {
    e.stopPropagation();
    TweakStore.removePreset(panelId, presetId);
  };
</script>

<div class="tweakers-preset-manager">
  <button
    bind:this={triggerRef}
    class="tweakers-preset-trigger"
    onclick={() => (isOpen ? closeDropdown() : openDropdown())}
    data-open={String(isOpen)}
    data-has-preset={String(!!activePreset)}
    data-disabled={String(!hasPresets)}
  >
    <span class="tweakers-preset-label">
      {activePreset ? activePreset.name : providerMode ? 'Presets' : 'Version 1'}
    </span>
    <svg
      class="tweakers-select-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      style:transform={`rotate(${chevronRotation.current}deg)`}
      style:opacity={chevronOpacity.current}
    >
      <path d={ICON_CHEVRON} />
    </svg>
  </button>

  {#if portalTarget}
    <Portal target={portalTarget}>
      {#if isOpen}
        <div
          bind:this={dropdownRef}
          class="tweakers-root tweakers-preset-dropdown"
          style={`position:fixed;top:${pos.top}px;left:${pos.left}px;min-width:${pos.width}px;`}
          transition:dropdownTransition={{ above: false }}
        >
          {#if !providerMode}
            <div
              class="tweakers-preset-item"
              data-active={String(!activePresetId)}
              onclick={() => handleSelect(null)}
            >
              <span class="tweakers-preset-name">Version 1</span>
            </div>
          {/if}

          {#each presets as preset (preset.id)}
            <div
              class="tweakers-preset-item"
              data-active={String(preset.id === activePresetId)}
              onclick={() => handleSelect(preset.id)}
            >
              <span class="tweakers-preset-name">{preset.name}</span>
              {#if preset.deletable ?? true}
                <button
                  class="tweakers-preset-delete"
                  onclick={(e) => handleDelete(e, preset.id)}
                  title="Delete preset"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d={ICON_TRASH[0]} />
                    <path d={ICON_TRASH[1]} />
                    <path d={ICON_TRASH[2]} />
                    <path d={ICON_TRASH[3]} />
                    <path d={ICON_TRASH[4]} />
                  </svg>
                </button>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </Portal>
  {/if}
</div>
