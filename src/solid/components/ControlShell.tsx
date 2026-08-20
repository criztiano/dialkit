import { createEffect, createSignal, onCleanup, Show, type JSX } from 'solid-js';
import { Dynamic, Portal } from 'solid-js/web';
import { TweakStore } from '../../store/TweakStore';
import type { AffordanceConfig, AffordanceContext, AffordanceStatus } from '../../store/TweakStore';
import { AFFORDANCE_POPOVER_WIDTH, placePopover } from '../../affordance-core';

interface ControlShellProps {
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
  children: JSX.Element;
}

/**
 * The chrome around one leaf control: a hint tooltip and an affordance dot.
 * Both are optional, and a control with neither renders just the wrapper plus
 * the config-path tooltip.
 */
export function ControlShell(props: ControlShellProps) {
  const hasAffordance = () => Boolean(props.affordance && props.panelId && props.path);
  const label = () => props.affordance?.label ?? 'Options';

  const [open, setOpen] = createSignal(false);
  const [status, setStatus] = createSignal<AffordanceStatus>('off');
  const [disabled, setDisabled] = createSignal(false);
  const [pos, setPos] = createSignal<{ top: number; left: number } | null>(null);
  const [portalTarget, setPortalTarget] = createSignal<HTMLElement | null>(null);

  let dotEl: HTMLButtonElement | undefined;
  let popoverEl: HTMLDivElement | undefined;

  // Status and disabled live outside `values`, so they need their own
  // subscription — one channel covers both.
  createEffect(() => {
    const panelId = props.panelId;
    const path = props.path;
    if (!panelId || !path) return;
    const read = () => {
      setStatus(TweakStore.getAffordanceStatus(panelId, path));
      setDisabled(TweakStore.isDisabled(panelId, path));
    };
    read();
    onCleanup(TweakStore.subscribeControlState(panelId, read));
  });

  // Resolve the panel root, so the popover escapes the panel body's scroll
  // clipping — the same escape hatch SelectControl's dropdown uses.
  createEffect(() => {
    if (!dotEl) return;
    setPortalTarget((dotEl.closest('.tweakers-root') as HTMLElement | null) ?? document.body);
  });

  // The first pass runs with height 0 (the popover isn't mounted yet); the
  // effect below re-runs it once the real height exists.
  const place = () => {
    const rect = dotEl?.getBoundingClientRect();
    if (!rect) return;
    const next = placePopover(rect, popoverEl?.offsetHeight ?? 0, window.innerHeight);
    // Same values keep the same object, so re-placing can't loop.
    setPos((cur) => (cur && cur.top === next.top && cur.left === next.left ? cur : next));
  };

  createEffect(() => {
    if (!open()) {
      setPos(null);
      return;
    }

    place();
    // The panel body scrolls under a fixed popover, so follow it.
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dotEl?.contains(target) || popoverEl?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      dotEl?.focus();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    onCleanup(() => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    });
  });

  // Second pass once the popover is in the tree and has a height to flip on.
  createEffect(() => {
    if (open() && pos() && popoverEl) place();
  });

  // Move focus in on open so keyboard users don't land at the top of the document.
  createEffect(() => {
    if (!open() || !popoverEl) return;
    const first = popoverEl.querySelector<HTMLElement>(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (first ?? popoverEl).focus();
  });

  const ctx = (): AffordanceContext => ({
    panelId: props.panelId!,
    path: props.path!,
    status: status(),
    setStatus: (next) => TweakStore.setAffordanceStatus(props.panelId!, props.path!, next),
  });

  return (
    <>
      <div
        class="tweakers-control-tip"
        data-hint={props.hint ? 'true' : undefined}
        data-affordance={hasAffordance() ? 'true' : undefined}
        data-affordance-open={open() ? 'true' : undefined}
        data-disabled={disabled() ? 'true' : undefined}
        aria-disabled={disabled() ? 'true' : undefined}
        role={props.hint ? 'group' : undefined}
        aria-describedby={props.hint ? props.id : undefined}
        title={props.hint ? undefined : props.title}
      >
        {props.children}

        {/* Kept mounted rather than conditional on hover so the id
            `aria-describedby` points at always resolves. */}
        <Show when={props.hint}>
          <span class="tweakers-hint" id={props.id} role="tooltip">
            {props.hint}
          </span>
        </Show>

        <Show when={hasAffordance()}>
          <button
            ref={dotEl}
            type="button"
            class="tweakers-affordance-dot"
            data-status={status()}
            data-open={String(open())}
            aria-label={label()}
            aria-expanded={open()}
            onClick={() => setOpen(!open())}
          />
        </Show>
      </div>

      <Show when={open() && hasAffordance() && portalTarget()}>
        <Portal mount={portalTarget()!}>
          <div
            ref={popoverEl}
            class="tweakers-affordance-popover"
            role="dialog"
            aria-label={label()}
            tabindex={-1}
            style={{
              left: `${pos()?.left ?? 0}px`,
              top: `${pos()?.top ?? 0}px`,
              width: `${AFFORDANCE_POPOVER_WIDTH}px`,
              // Hidden until measured, so it never flashes at the wrong spot.
              visibility: pos() ? undefined : 'hidden',
            }}
          >
            <span class="tweakers-affordance-popover-title">{label()}</span>
            {/* Dynamic, not a direct call: the content is a component and needs
                its own reactive owner. */}
            <Dynamic component={props.affordance!.content as (ctx: AffordanceContext) => JSX.Element} {...ctx()} />
          </div>
        </Portal>
      </Show>
    </>
  );
}
