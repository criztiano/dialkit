import { createElement, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { TweakStore } from '../store/TweakStore';
import type { AffordanceConfig, AffordanceContext } from '../store/TweakStore';
import { ModulationStore } from '../store/ModulationStore';
import { AFFORDANCE_POPOVER_WIDTH, placePopover } from '../affordance-core';
import { ModRing } from './ModRing';

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
  children: ReactNode;
}

/**
 * The chrome around one leaf control: a hint tooltip and an affordance dot.
 * Both are optional, and a control with neither renders just the wrapper plus
 * the config-path tooltip.
 */
export function ControlShell({ hint, title, id, affordance, panelId, path, children }: ControlShellProps) {
  const [open, setOpen] = useState(false);

  // One subscription covers every app-pushed presentation change on the panel.
  const readDisabled = useCallback(
    () => (panelId && path ? TweakStore.isDisabled(panelId, path) : false),
    [panelId, path]
  );
  const disabled = useSyncExternalStore(
    useCallback((cb) => (panelId ? TweakStore.subscribeControlState(panelId, cb) : () => {}), [panelId]),
    readDisabled,
    readDisabled
  );

  // A control wired to a modulation slot wears the slot's colour as a dot;
  // pressing anywhere on the control arms it for the step-button gesture.
  const readMod = useCallback(
    () => (panelId && path ? ModulationStore.getAssignment(panelId, path) : undefined),
    [panelId, path]
  );
  const modAssignment = useSyncExternalStore(
    useCallback((cb) => ModulationStore.subscribe(cb), []),
    readMod,
    readMod
  );

  return (
    <div
      className="tweakers-control-tip"
      data-hint={hint ? 'true' : undefined}
      data-affordance={affordance ? 'true' : undefined}
      data-affordance-open={open ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      data-mod={modAssignment ? 'true' : undefined}
      aria-disabled={disabled ? true : undefined}
      role={hint ? 'group' : undefined}
      aria-describedby={hint ? id : undefined}
      title={hint ? undefined : title}
      onPointerDownCapture={
        panelId && path ? () => ModulationStore.noteTouch(panelId, path) : undefined
      }
    >
      {children}

      {modAssignment && panelId && path && (
        <ModRing panelId={panelId} path={path} assignment={modAssignment} />
      )}

      {/* Kept mounted rather than conditional on hover so the id
          `aria-describedby` points at always resolves. */}
      {hint && (
        <span className="tweakers-hint" id={id} role="tooltip">
          {hint}
        </span>
      )}

      {affordance && panelId && path && (
        <Affordance
          affordance={affordance}
          panelId={panelId}
          path={path}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
}

interface AffordanceProps {
  affordance: AffordanceConfig;
  panelId: string;
  path: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PopoverPos = { top: number; left: number };

function Affordance({ affordance, panelId, path, open, onOpenChange }: AffordanceProps) {
  const dotRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<PopoverPos | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const label = affordance.label ?? 'Options';

  // Status lives outside `values`, so it needs its own subscription — this way a
  // status change re-renders the dot alone, not the panel.
  const status = useSyncExternalStore(
    useCallback((cb) => TweakStore.subscribeControlState(panelId, cb), [panelId]),
    useCallback(() => TweakStore.getAffordanceStatus(panelId, path), [panelId, path]),
    useCallback(() => TweakStore.getAffordanceStatus(panelId, path), [panelId, path])
  );

  // Portal into the panel root so the popover escapes the panel body's scroll
  // clipping — the same escape hatch SelectControl's dropdown uses.
  useEffect(() => {
    const root = dotRef.current?.closest?.('.tweakers-root') as HTMLElement | null;
    const target = root ?? (typeof document === 'undefined' ? null : document.body);
    // react-dom throws on a non-element container; falling back to inline
    // rendering keeps the popover usable wherever there isn't a real one.
    setPortalTarget(target?.nodeType === 1 ? target : null);
  }, []);

  // Measure before paint so the popover never shows at a stale position. The
  // first pass runs with height 0 (the popover isn't mounted yet); the effect
  // below re-runs it once the real height exists.
  const place = useCallback(() => {
    const rect = dotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = placePopover(rect, popoverRef.current?.offsetHeight ?? 0, window.innerHeight);
    // Same values return the same object, so re-placing can't loop.
    setPos((cur) => (cur && cur.top === next.top && cur.left === next.left ? cur : next));
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }

    place();
    // The panel body scrolls under a fixed popover, so follow it.
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  // Second pass once the popover is in the tree and has a height to flip on.
  useLayoutEffect(() => {
    if (open && pos) place();
  }, [open, pos, place]);

  // Move focus in on open and back to the dot on close, so keyboard users don't
  // land at the top of the document.
  useEffect(() => {
    if (!open) return;
    const first = popoverRef.current?.querySelector<HTMLElement>(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (first ?? popoverRef.current)?.focus();
  }, [open, pos !== null]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dotRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onOpenChange(false);
      dotRef.current?.focus();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOpenChange]);

  const popover = open ? (
    <div
      ref={popoverRef}
      className="tweakers-affordance-popover"
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      style={{
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        width: AFFORDANCE_POPOVER_WIDTH,
        // Hidden until measured, so it never flashes at the wrong spot.
        visibility: pos ? undefined : 'hidden',
      }}
    >
      <span className="tweakers-affordance-popover-title">{label}</span>
      {/* createElement, not a direct call: the content is a component, and
          invoking it here would file its hooks under Affordance's. */}
      {createElement(affordance.content as ComponentType<AffordanceContext>, {
        panelId,
        path,
        status,
        setStatus: (next) => TweakStore.setAffordanceStatus(panelId, path, next),
      })}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={dotRef}
        type="button"
        className="tweakers-affordance-dot"
        data-status={status}
        data-open={String(open)}
        aria-label={label}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      />

      {popover && (portalTarget ? createPortal(popover, portalTarget) : popover)}
    </>
  );
}
