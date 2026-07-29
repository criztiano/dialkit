import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, Teleport, watch, type PropType } from 'vue';
import { DialStore } from '../../store/DialStore';
import type { AffordanceConfig, AffordanceContext, AffordanceStatus } from '../../store/DialStore';
import { AFFORDANCE_POPOVER_WIDTH, placePopover } from '../../affordance-core';

/**
 * The chrome around one leaf control: a hint tooltip and an affordance dot.
 * Hint reveal is CSS-only (`:hover` / `:focus-within`); the tooltip stays
 * mounted so its id always resolves for assistive tech. `role="group"` is what
 * makes the description reachable — the wrapper can't reach the focusable
 * element inside the slot.
 */
export const ControlShell = defineComponent({
  name: 'DialKitControlShell',
  props: {
    /** Help text for this control. Without one the tooltip is not rendered. */
    hint: { type: String, default: undefined },
    /** Native-tooltip fallback used only when there's no hint (the config path). */
    title: { type: String, default: undefined },
    /** Stable, unique id for the tooltip so `aria-describedby` can point at it. */
    id: { type: String, required: true },
    /** Companion control reachable from a dot in the bottom-right corner. */
    affordance: { type: Object as PropType<AffordanceConfig>, default: undefined },
    /** Required alongside `affordance` — together they address the status slice. */
    panelId: { type: String, default: undefined },
    path: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const hasAffordance = computed(() => Boolean(props.affordance && props.panelId && props.path));
    const label = computed(() => props.affordance?.label ?? 'Options');

    const open = ref(false);
    const status = ref<AffordanceStatus>('off');
    const disabled = ref(false);
    const pos = ref<{ top: number; left: number } | null>(null);
    const portalTarget = ref<HTMLElement | null>(null);
    const dotEl = ref<HTMLButtonElement | null>(null);
    const popoverEl = ref<HTMLDivElement | null>(null);

    // Status and disabled live outside `values`, so they need their own
    // subscription — one channel covers both.
    let unsubscribe: (() => void) | undefined;
    const resubscribe = () => {
      unsubscribe?.();
      unsubscribe = undefined;
      const panelId = props.panelId;
      const path = props.path;
      if (!panelId || !path) return;
      const read = () => {
        status.value = DialStore.getAffordanceStatus(panelId, path);
        disabled.value = DialStore.isDisabled(panelId, path);
      };
      read();
      unsubscribe = DialStore.subscribeControlState(panelId, read);
    };

    // Called once before the popover mounts (height 0, so it places below) and
    // again after, when the real height can flip it.
    const place = () => {
      const rect = dotEl.value?.getBoundingClientRect();
      if (!rect) return;
      const next = placePopover(rect, popoverEl.value?.offsetHeight ?? 0, window.innerHeight);
      if (pos.value?.top !== next.top || pos.value?.left !== next.left) pos.value = next;
    };

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dotEl.value?.contains(target) || popoverEl.value?.contains(target)) return;
      open.value = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      open.value = false;
      dotEl.value?.focus();
    };

    onMounted(() => {
      resubscribe();
      // Resolve the panel root so the popover escapes the panel body's scroll
      // clipping — the same escape hatch SelectControl's dropdown uses.
      portalTarget.value = (dotEl.value?.closest('.dialkit-root') as HTMLElement | null) ?? document.body;
    });

    watch(() => [props.panelId, props.path, hasAffordance.value], resubscribe);

    watch(open, async (isOpen) => {
      if (!isOpen) {
        pos.value = null;
        window.removeEventListener('scroll', place, true);
        window.removeEventListener('resize', place);
        document.removeEventListener('mousedown', onPointerDown);
        document.removeEventListener('keydown', onKeyDown);
        return;
      }

      // The panel body scrolls under a fixed popover, so follow it.
      window.addEventListener('scroll', place, true);
      window.addEventListener('resize', place);
      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('keydown', onKeyDown);

      await Promise.resolve();
      place();
      // Re-place now the popover is in the DOM and has a height to flip on.
      await Promise.resolve();
      place();
      // Move focus in so keyboard users don't land at the top of the document.
      const first = popoverEl.value?.querySelector<HTMLElement>(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (first ?? popoverEl.value)?.focus();
    });

    onBeforeUnmount(() => {
      unsubscribe?.();
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    });

    return () => {
      const children = slots.default ? slots.default() : [];

      const wrapper = h('div', {
        class: 'dialkit-control-tip',
        'data-hint': props.hint ? 'true' : undefined,
        'data-affordance': hasAffordance.value ? 'true' : undefined,
        'data-affordance-open': open.value ? 'true' : undefined,
        'data-disabled': disabled.value ? 'true' : undefined,
        'aria-disabled': disabled.value ? 'true' : undefined,
        role: props.hint ? 'group' : undefined,
        'aria-describedby': props.hint ? props.id : undefined,
        title: props.hint ? undefined : props.title,
      }, [
        ...children,
        props.hint
          ? h('span', { class: 'dialkit-hint', id: props.id, role: 'tooltip' }, props.hint)
          : null,
        hasAffordance.value
          ? h('button', {
            ref: dotEl,
            type: 'button',
            class: 'dialkit-affordance-dot',
            'data-status': status.value,
            'data-open': String(open.value),
            'aria-label': label.value,
            'aria-expanded': open.value,
            onClick: () => { open.value = !open.value; },
          })
          : null,
      ]);

      if (!open.value || !hasAffordance.value || !portalTarget.value) return wrapper;

      return [
        wrapper,
        h(Teleport, { to: portalTarget.value }, [
          h('div', {
            ref: popoverEl,
            class: 'dialkit-affordance-popover',
            role: 'dialog',
            'aria-label': label.value,
            tabindex: -1,
            style: {
              left: `${pos.value?.left ?? 0}px`,
              top: `${pos.value?.top ?? 0}px`,
              width: `${AFFORDANCE_POPOVER_WIDTH}px`,
              // Hidden until measured, so it never flashes at the wrong spot.
              visibility: pos.value ? undefined : 'hidden',
            },
          }, [
            h('span', { class: 'dialkit-affordance-popover-title' }, label.value),
            // Rendered as a component, not called: a stateful popover needs its
            // own instance.
            h(props.affordance!.content as never, {
              panelId: props.panelId!,
              path: props.path!,
              status: status.value,
              setStatus: (next: AffordanceStatus) =>
                DialStore.setAffordanceStatus(props.panelId!, props.path!, next),
            } satisfies AffordanceContext),
          ]),
        ]),
      ];
    };
  },
});
