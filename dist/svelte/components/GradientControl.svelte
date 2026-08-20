<script lang="ts">
  import Portal from '../Portal.svelte';
  import { dropdownTransition } from './transitions';
  import GradientPanel from './GradientPanel.svelte';
  import { gradientToCss, type GradientValue } from '../../gradient-core';

  let { label, value, onChange } = $props<{
    label: string;
    value: GradientValue;
    onChange: (value: GradientValue) => void;
  }>();

  const PANEL_WIDTH = 240;
  // Estimated open heights for the above/below flip. Linear/conic carry an angle
  // row that radial omits; the embedded color picker dominates the rest.
  const PANEL_HEIGHT_ANGLED = 470;
  const PANEL_HEIGHT_RADIAL = 430;

  let isOpen = $state(false);
  let pos = $state<{ top: number; left: number; above: boolean } | null>(null);
  // Manual position once the user drags the panel by its grip; overrides `pos`.
  let dragPos = $state<{ left: number; top: number } | null>(null);
  let portalTarget = $state<HTMLElement | null>(null);
  let triggerRef: HTMLButtonElement | undefined;
  let panelRef = $state<HTMLDivElement | undefined>(undefined);

  const onPanelDrag = (dx: number, dy: number) => {
    let base = dragPos;
    if (!base) {
      // Seed from the resting layout position, not a live getBoundingClientRect:
      // the panel may still be mid-entrance-spring, and offsetHeight ignores the
      // transform so the first drag doesn't lurch.
      if (!pos || !panelRef) return;
      base = { left: pos.left, top: pos.above ? pos.top - panelRef.offsetHeight : pos.top };
    }
    const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
    const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
    dragPos = { left, top };
  };

  const updatePos = () => {
    if (!triggerRef || typeof window === 'undefined') return;
    const rect = triggerRef.getBoundingClientRect();
    const panelHeight = value.type === 'radial' ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < panelHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PANEL_WIDTH);
    pos = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
  };

  const open = () => {
    dragPos = null;
    updatePos();
    isOpen = true;
  };

  const popoverStyle = $derived.by(() => {
    if (typeof window === 'undefined') return '';
    if (dragPos) {
      return `position:fixed;left:${dragPos.left}px;width:${PANEL_WIDTH}px;top:${dragPos.top}px;transform-origin:top left;`;
    }
    if (!pos) return '';
    if (pos.above) {
      return `position:fixed;left:${pos.left}px;width:${PANEL_WIDTH}px;bottom:${window.innerHeight - pos.top}px;transform-origin:bottom right;`;
    }
    return `position:fixed;left:${pos.left}px;width:${PANEL_WIDTH}px;top:${pos.top}px;transform-origin:top right;`;
  });

  $effect(() => {
    if (typeof document === 'undefined' || !triggerRef) return;
    portalTarget = (triggerRef.closest('.tweakers-root') as HTMLElement | null) ?? document.body;
  });

  // Reposition re-runs when value.type changes (the estimated height flips).
  $effect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    void value.type;

    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef?.contains(target) || panelRef?.contains(target)) return;
      isOpen = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isOpen = false;
        triggerRef?.focus();
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onViewport);
    window.addEventListener('scroll', onViewport, true);

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onViewport);
      window.removeEventListener('scroll', onViewport, true);
    };
  });
</script>

<div class="tweakers-gradient-control">
  <span class="tweakers-gradient-label">{label}</span>
  <button
    bind:this={triggerRef}
    class="tweakers-gradient-preview tweakers-checker"
    style:--gradient-preview={gradientToCss(value)}
    onclick={() => (isOpen ? (isOpen = false) : open())}
    data-open={String(isOpen)}
    title="Edit gradient"
    aria-label={`Edit gradient for ${label}`}
    aria-expanded={isOpen}
  ></button>

  {#if portalTarget}
    <Portal target={portalTarget}>
      {#if isOpen && pos}
        <div
          bind:this={panelRef}
          class="tweakers-gradient-popover"
          style={popoverStyle}
          transition:dropdownTransition={{ above: pos.above }}
        >
          <GradientPanel {value} {onChange} onDrag={onPanelDrag} />
        </div>
      {/if}
    </Portal>
  {/if}
</div>
