import { Teleport, defineComponent, h, onMounted, ref, watch, type PropType } from 'vue';
import { AnimatePresence, motion } from 'motion-v';
import { GradientPanel } from './GradientPanel';
import { gradientToCss, type GradientValue } from '../../gradient-core';

const PANEL_WIDTH = 240;
// Estimated open heights for the above/below flip. Linear/conic carry an angle
// row that radial omits; the embedded color picker dominates the rest.
const PANEL_HEIGHT_ANGLED = 470;
const PANEL_HEIGHT_RADIAL = 430;

export const GradientControl = defineComponent({
  name: 'TweakersGradientControl',
  props: {
    label: { type: String, required: true },
    value: { type: Object as PropType<GradientValue>, required: true },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const pos = ref<{ top: number; left: number; above: boolean } | null>(null);
    // Manual position once the user drags the panel by its grip; overrides `pos`.
    const dragPos = ref<{ left: number; top: number } | null>(null);
    const portalTarget = ref<HTMLElement | null>(null);

    const triggerRef = ref<HTMLElement | null>(null);
    const panelRef = ref<HTMLElement | null>(null);

    const onPanelDrag = (dx: number, dy: number) => {
      let base = dragPos.value;
      if (!base) {
        // Seed from the resting layout position, not a live getBoundingClientRect:
        // the panel may still be mid-entrance-spring, and offsetHeight ignores the
        // transform so the first drag doesn't lurch.
        const p = pos.value;
        const el = panelRef.value;
        if (!p || !el) return;
        base = { left: p.left, top: p.above ? p.top - el.offsetHeight : p.top };
      }
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      dragPos.value = { left, top };
    };

    const updatePos = () => {
      const el = triggerRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const panelHeight = props.value.type === 'radial' ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const above = spaceBelow < panelHeight && rect.top > spaceBelow;
      const left = Math.max(8, rect.right - PANEL_WIDTH);
      pos.value = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
    };

    const openPanel = () => {
      dragPos.value = null;
      updatePos();
      isOpen.value = true;
    };

    const closePanel = () => {
      isOpen.value = false;
    };

    const togglePanel = () => {
      if (isOpen.value) closePanel();
      else openPanel();
    };

    const setPanelRef = (node: unknown) => {
      if (node instanceof HTMLElement) {
        panelRef.value = node;
        return;
      }

      if (node && typeof node === 'object' && '$el' in node) {
        const el = (node as { $el?: unknown }).$el;
        panelRef.value = el instanceof HTMLElement ? el : null;
        return;
      }

      panelRef.value = null;
    };

    // Reposition when the popover opens and whenever the gradient type flips —
    // radial drops the angle row, shrinking the estimated height for the flip.
    watch(() => props.value.type, () => {
      if (isOpen.value) updatePos();
    });

    watch(isOpen, (open, _, onCleanup) => {
      if (!open) return;

      const handleViewportChange = () => updatePos();
      const handleDocumentClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return;
        closePanel();
      };
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closePanel();
          triggerRef.value?.focus();
        }
      };

      updatePos();
      document.addEventListener('mousedown', handleDocumentClick);
      document.addEventListener('keydown', handleKeydown);
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('scroll', handleViewportChange, true);

      onCleanup(() => {
        document.removeEventListener('mousedown', handleDocumentClick);
        document.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('scroll', handleViewportChange, true);
      });
    });

    onMounted(() => {
      const root = triggerRef.value?.closest('.tweakers-root') as HTMLElement | null;
      portalTarget.value = root ?? document.body;
    });

    return () => h('div', { class: 'tweakers-gradient-control' }, [
      h('span', { class: 'tweakers-gradient-label' }, props.label),
      h('button', {
        ref: triggerRef,
        class: 'tweakers-gradient-preview tweakers-checker',
        style: { '--gradient-preview': gradientToCss(props.value) },
        'data-open': String(isOpen.value),
        title: 'Edit gradient',
        'aria-label': `Edit gradient for ${props.label}`,
        'aria-expanded': isOpen.value,
        onClick: togglePanel,
      }),

      portalTarget.value
        ? h(Teleport, { to: portalTarget.value }, [
          h(AnimatePresence, null, {
            default: () => (isOpen.value && pos.value)
              ? [h(motion.div, {
                key: 'tweakers-gradient-popover',
                ref: setPanelRef,
                class: 'tweakers-gradient-popover',
                initial: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: pos.value.above ? 8 : -8, scale: 0.95 },
                transition: { type: 'spring', visualDuration: 0.15, bounce: 0 },
                style: {
                  position: 'fixed',
                  width: `${PANEL_WIDTH}px`,
                  ...(dragPos.value
                    ? {
                      left: `${dragPos.value.left}px`,
                      top: `${dragPos.value.top}px`,
                      transformOrigin: 'top left',
                    }
                    : pos.value.above
                      ? {
                        left: `${pos.value.left}px`,
                        bottom: `${window.innerHeight - pos.value.top}px`,
                        transformOrigin: 'bottom right',
                      }
                      : {
                        left: `${pos.value.left}px`,
                        top: `${pos.value.top}px`,
                        transformOrigin: 'top right',
                      }),
                },
              }, [
                h(GradientPanel, {
                  value: props.value,
                  onChange: (next: GradientValue) => emit('change', next),
                  onDrag: onPanelDrag,
                }),
              ])]
              : [],
          }),
        ])
        : null,
    ]);
  },
});
