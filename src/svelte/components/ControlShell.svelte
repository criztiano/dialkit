<script lang="ts">
  import type { Snippet } from 'svelte';
  import { TweakStore } from 'tweakers/store';
  import type { AffordanceConfig, AffordanceStatus } from 'tweakers/store';
  import Portal from '../Portal.svelte';
  import { AFFORDANCE_POPOVER_WIDTH, placePopover } from '../../affordance-core';

  let { hint, title, id, affordance, panelId, path, children } = $props<{
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint?: string;
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title?: string;
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: string;
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance?: AffordanceConfig;
    /** Required alongside `affordance` — together they address the status slice. */
    panelId?: string;
    path?: string;
    children: Snippet;
  }>();

  const hasAffordance = $derived(Boolean(affordance && panelId && path));
  const label = $derived(affordance?.label ?? 'Options');

  let open = $state(false);
  let status = $state<AffordanceStatus>('off');
  let disabled = $state(false);
  let dotEl = $state<HTMLButtonElement | undefined>(undefined);
  let popoverEl = $state<HTMLDivElement | undefined>(undefined);
  let pos = $state<{ top: number; left: number } | null>(null);
  let portalTarget = $state<HTMLElement | null>(null);

  // Status and disabled live outside `values`, so they need their own
  // subscription — one channel covers both.
  $effect(() => {
    if (!panelId || !path) return;
    const read = () => {
      status = TweakStore.getAffordanceStatus(panelId, path);
      disabled = TweakStore.isDisabled(panelId, path);
    };
    read();
    return TweakStore.subscribeControlState(panelId, read);
  });

  // Resolve the panel root once the dot exists, mirroring SelectControl.
  $effect(() => {
    if (!dotEl) return;
    portalTarget = (dotEl.closest('.tweakers-root') as HTMLElement | null) ?? document.body;
  });

  // The first pass runs with height 0 (the popover isn't mounted yet); the
  // effect below re-runs it once the real height exists.
  function place() {
    const rect = dotEl?.getBoundingClientRect();
    if (!rect) return;
    const next = placePopover(rect, popoverEl?.offsetHeight ?? 0, window.innerHeight);
    // Same values keep the same object, so re-placing can't loop.
    if (pos?.top !== next.top || pos?.left !== next.left) pos = next;
  }

  $effect(() => {
    if (!open) { pos = null; return; }
    place();
    // The panel body scrolls under a fixed popover, so follow it.
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  });

  // Second pass once the popover is in the tree and has a height to flip on.
  $effect(() => {
    if (open && pos && popoverEl) place();
  });

  // Move focus in on open so keyboard users don't land at the top of the document.
  $effect(() => {
    if (!open || !popoverEl) return;
    const first = popoverEl.querySelector<HTMLElement>(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (first ?? popoverEl).focus();
  });

  $effect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dotEl?.contains(target) || popoverEl?.contains(target)) return;
      open = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      open = false;
      dotEl?.focus();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  const setStatus = (next: AffordanceStatus) => TweakStore.setAffordanceStatus(panelId!, path!, next);
</script>

<!--
  The chrome around one leaf control: a hint tooltip and an affordance dot. Hint
  reveal is CSS-only (:hover / :focus-within), and the tooltip stays mounted so
  the id `aria-describedby` points at always resolves. role="group" is what makes
  the description reachable — the wrapper can't reach the focusable element
  inside the children snippet.
-->
<div
  class="tweakers-control-tip"
  data-hint={hint ? 'true' : undefined}
  data-affordance={hasAffordance ? 'true' : undefined}
  data-affordance-open={open ? 'true' : undefined}
  data-disabled={disabled ? 'true' : undefined}
  aria-disabled={disabled ? 'true' : undefined}
  role={hint ? 'group' : undefined}
  aria-describedby={hint ? id : undefined}
  title={hint ? undefined : title}
>
  {@render children()}

  {#if hint}
    <span class="tweakers-hint" {id} role="tooltip">{hint}</span>
  {/if}

  {#if hasAffordance}
    <button
      bind:this={dotEl}
      type="button"
      class="tweakers-affordance-dot"
      data-status={status}
      data-open={String(open)}
      aria-label={label}
      aria-expanded={open}
      onclick={() => (open = !open)}
    ></button>
  {/if}
</div>

{#if open && hasAffordance && portalTarget}
  <!-- Portalled out of the panel body: it scrolls, and an interactive popover
       must not be clipped by it. -->
  <Portal target={portalTarget}>
    <div
      bind:this={popoverEl}
      class="tweakers-affordance-popover"
      role="dialog"
      aria-label={label}
      tabindex="-1"
      style:left={`${pos?.left ?? 0}px`}
      style:top={`${pos?.top ?? 0}px`}
      style:width={`${AFFORDANCE_POPOVER_WIDTH}px`}
      style:visibility={pos ? undefined : 'hidden'}
    >
      <span class="tweakers-affordance-popover-title">{label}</span>
      {@render affordance.content({ panelId, path, status, setStatus })}
    </div>
  </Portal>
{/if}
