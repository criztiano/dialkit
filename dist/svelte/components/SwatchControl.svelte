<script lang="ts">
  import { Spring } from 'svelte/motion';
  import Portal from '../Portal.svelte';
  import { dropdownTransition } from './transitions';
  import { ICON_CHEVRON } from '../../icons';
  import type { SwatchOption } from 'dialkit/store';

  let { label, value, options, onChange } = $props<{
    label: string;
    value: string;
    options: SwatchOption[];
    onChange: (value: string) => void;
  }>();

  let isOpen = $state(false);
  let highlight = $state(-1);
  let pos = $state<{ top: number; left: number; width: number; above: boolean } | null>(null);
  let portalTarget = $state<HTMLElement | null>(null);
  let triggerRef: HTMLButtonElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;

  const chevronRotation = new Spring(0, { stiffness: 0.2, damping: 0.6 });

  const selectedOption = $derived(options.find((o: SwatchOption) => o.value === value));
  const selectedIndex = $derived(options.findIndex((o: SwatchOption) => o.value === value));

  const updatePos = () => {
    if (!triggerRef || typeof window === 'undefined') return;
    const rect = triggerRef.getBoundingClientRect();
    const dropdownHeight = 8 + options.length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;

    pos = {
      top: above ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      above,
    };
  };

  const openDropdown = () => {
    updatePos();
    highlight = selectedIndex >= 0 ? selectedIndex : 0;
    isOpen = true;
  };

  const closeDropdown = () => {
    isOpen = false;
  };

  const select = (v: string) => {
    onChange(v);
    closeDropdown();
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlight = (highlight + 1) % options.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlight = (highlight - 1 + options.length) % options.length;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlight >= 0 && highlight < options.length) select(options[highlight].value);
    }
  };

  const dropdownStyle = $derived.by(() => {
    if (!pos || typeof window === 'undefined') return '';
    if (pos.above) {
      return `position:fixed;left:${pos.left}px;width:${pos.width}px;bottom:${window.innerHeight - pos.top}px;transform-origin:bottom;`;
    }
    return `position:fixed;left:${pos.left}px;width:${pos.width}px;top:${pos.top}px;transform-origin:top;`;
  });

  $effect(() => {
    if (typeof document === 'undefined' || !triggerRef) return;
    portalTarget = (triggerRef.closest('.dialkit-root') as HTMLElement | null) ?? document.body;
  });

  $effect(() => {
    chevronRotation.set(isOpen ? 180 : 0);
  });

  $effect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const handleViewportChange = () => updatePos();
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef?.contains(target) || dropdownRef?.contains(target)) return;
      closeDropdown();
    };

    updatePos();
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  });
</script>

{#snippet preview(colors: string[])}
  <span class="dialkit-swatch-preview" aria-hidden="true">
    {#each colors as c (c)}
      <span class="dialkit-swatch-chip" style:background={c}></span>
    {/each}
  </span>
{/snippet}

<div class="dialkit-select-row">
  <button
    bind:this={triggerRef}
    class="dialkit-select-trigger"
    onclick={() => (isOpen ? closeDropdown() : openDropdown())}
    onkeydown={onKeydown}
    data-open={String(isOpen)}
  >
    <span class="dialkit-select-label">{label}</span>
    <div class="dialkit-select-right">
      {#if selectedOption}
        {@render preview(selectedOption.colors)}
      {/if}
      <span class="dialkit-select-value">{selectedOption?.label ?? value}</span>
      <svg
        class="dialkit-select-chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        style:transform={`rotate(${chevronRotation.current}deg)`}
      >
        <path d={ICON_CHEVRON} />
      </svg>
    </div>
  </button>

  {#if portalTarget}
    <Portal target={portalTarget}>
      {#if isOpen && pos}
        <div
          bind:this={dropdownRef}
          class="dialkit-select-dropdown"
          style={dropdownStyle}
          transition:dropdownTransition={{ above: pos.above }}
        >
          {#each options as option, i (option.value)}
            <button
              class="dialkit-select-option dialkit-swatch-option"
              data-selected={String(option.value === value)}
              data-highlight={String(i === highlight)}
              onclick={() => select(option.value)}
              onmouseenter={() => (highlight = i)}
            >
              {@render preview(option.colors)}
              <span class="dialkit-swatch-option-label">{option.label}</span>
            </button>
          {/each}
        </div>
      {/if}
    </Portal>
  {/if}
</div>
