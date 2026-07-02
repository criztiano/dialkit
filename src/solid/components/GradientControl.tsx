import { createSignal, createEffect, onMount, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { animate } from 'motion';
import { GradientPanel } from './GradientPanel';
import { gradientToCss, type GradientValue } from '../../gradient-core';

interface GradientControlProps {
  label: string;
  value: GradientValue;
  onChange: (value: GradientValue) => void;
}

const PANEL_WIDTH = 240;
// Estimated open heights for the above/below flip. Linear/conic carry an angle
// row that radial omits; the embedded color picker dominates the rest.
const PANEL_HEIGHT_ANGLED = 470;
const PANEL_HEIGHT_RADIAL = 430;

export function GradientControl(props: GradientControlProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [pos, setPos] = createSignal<{ top: number; left: number; above: boolean } | null>(null);
  const [portalTarget, setPortalTarget] = createSignal<HTMLElement | null>(null);
  let triggerRef!: HTMLButtonElement;
  let panelRef: HTMLDivElement | undefined;
  let closeAnim: ReturnType<typeof animate> | null = null;

  onMount(() => {
    const root = triggerRef?.closest('.dialkit-root') as HTMLElement | null;
    setPortalTarget(root ?? document.body);

    onCleanup(() => {
      closeAnim?.stop();
    });
  });

  const updatePos = () => {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const panelHeight = props.value.type === 'radial' ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < panelHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PANEL_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  };

  const openPopover = () => {
    closeAnim?.stop();
    closeAnim = null;
    updatePos();
    if (panelRef) {
      // Interrupted a close: the node survives (mounted never flipped), so the
      // ref-callback entrance animation won't rerun — drive it home from here.
      animate(panelRef, { opacity: 1, y: 0, scale: 1 }, { type: 'spring', visualDuration: 0.15, bounce: 0 });
    }
    setMounted(true);
    setIsOpen(true);
  };

  const closePopover = () => {
    setIsOpen(false);
    if (!panelRef) { setMounted(false); return; }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = animate(
      panelRef,
      { opacity: 0, y: above ? 8 : -8, scale: 0.95 },
      { type: 'spring', visualDuration: 0.15, bounce: 0, onComplete: () => { setMounted(false); closeAnim = null; panelRef = undefined; } }
    );
  };

  // Reposition on viewport changes; close on outside mousedown / Escape.
  // Re-runs on value.type change so the above/below flip re-estimates when the
  // panel's height class shifts (angle row appears/disappears).
  createEffect(() => {
    if (!isOpen()) return;
    void props.value.type;
    const handleViewportChange = () => updatePos();

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef?.contains(target) || panelRef?.contains(target)) return;
      closePopover();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopover();
        triggerRef?.focus();
      }
    };

    updatePos();
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    onCleanup(() => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    });
  });

  const popoverStyle = () => {
    const p = pos();
    if (!p) return {};
    return {
      position: 'fixed' as const,
      left: `${p.left}px`,
      width: `${PANEL_WIDTH}px`,
      ...(p.above
        ? { bottom: `${window.innerHeight - p.top}px`, 'transform-origin': 'bottom right' }
        : { top: `${p.top}px`, 'transform-origin': 'top right' }),
    };
  };

  return (
    <div class="dialkit-gradient-control">
      <span class="dialkit-gradient-label">{props.label}</span>
      <button
        ref={triggerRef}
        class="dialkit-gradient-preview dialkit-checker"
        style={{ '--gradient-preview': gradientToCss(props.value) }}
        onClick={() => (isOpen() ? closePopover() : openPopover())}
        data-open={String(isOpen())}
        title="Edit gradient"
        aria-label={`Edit gradient for ${props.label}`}
        aria-expanded={isOpen()}
      />

      <Show when={!!portalTarget()}>
        <Portal mount={portalTarget()!}>
          <Show when={mounted() && pos()}>
            <div
              ref={(el) => {
                panelRef = el;
                const above = pos()?.above ?? false;
                animate(
                  el,
                  { opacity: [0, 1], y: [above ? 8 : -8, 0], scale: [0.95, 1] },
                  { type: 'spring', visualDuration: 0.15, bounce: 0 }
                );
              }}
              class="dialkit-gradient-popover"
              style={popoverStyle()}
            >
              <GradientPanel value={props.value} onChange={(v) => props.onChange(v)} />
            </div>
          </Show>
        </Portal>
      </Show>
    </div>
  );
}
