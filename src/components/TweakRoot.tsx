import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TweakStore, PanelConfig } from 'tweakers/store';
import { TimelineStore } from 'tweakers/timeline';
import { isDevDefault } from 'tweakers/env';
import { Folder } from './Folder';
import { Panel } from './Panel';
import { ShortcutListener } from './ShortcutListener';
import { TimelineToggleButton } from './Timeline/TimelineToggleButton';

export type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type TweakMode = 'popover' | 'inline';
/** `card` is the panel's glass surface; `none` puts the rows straight on the host's ground. */
export type TweakChrome = 'card' | 'none';
export type TweakTheme = 'light' | 'dark' | 'system';

interface TweakRootProps {
  position?: TweakPosition;
  defaultOpen?: boolean;
  mode?: TweakMode;
  theme?: TweakTheme;
  productionEnabled?: boolean;
  /**
   * Render only the named panels, in the order given. For apps that place
   * more than one panel surface in more than one place — a rack of per-voice
   * columns beside a global panel, say. Omitted, a root renders every
   * registered panel, which is the single-surface default.
   */
  panels?: string | string[];
  /**
   * `none` drops the panel card — no glass, no border, no radius, no padding —
   * so the rows sit directly on the host's own surface. For app chrome that
   * already provides the ground the panel would otherwise float on.
   */
  chrome?: TweakChrome;
}

export function TweakRoot({ position = 'top-right', defaultOpen = true, mode = 'popover', theme = 'system', productionEnabled = isDevDefault, panels: only, chrome = 'card' }: TweakRootProps) {
  if (!productionEnabled) return null;
  const [panels, setPanels] = useState<PanelConfig[]>([]);
  const [timelineCount, setTimelineCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inline = mode === 'inline';

  // Drag state
  const panelRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [activePosition, setActivePosition] = useState(position);
  const lastDragOffset = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; elX: number; elY: number } | null>(null);
  const didDragRef = useRef(false);

  // Subscribe to registered editing surfaces. Timeline-backed panels render
  // in TweakTimeline, but their presence adds a visibility toggle here.
  // Joined to a scalar so the effect below re-runs on a changed filter but not
  // on a new array with the same names.
  const onlyKey = Array.isArray(only) ? only.join('\u0000') : only;
  const read = useCallback(
    () => TweakStore.selectPanels(onlyKey === undefined ? undefined : onlyKey.split('\u0000')),
    [onlyKey]
  );

  useEffect(() => {
    setMounted(true);
    setPanels(read());
    setTimelineCount(TimelineStore.getTimelines().length);

    const unsubscribePanels = TweakStore.subscribeGlobal(() => {
      setPanels(read());
    });
    const unsubscribeTimelines = TimelineStore.subscribeGlobal(() => {
      setTimelineCount(TimelineStore.getTimelines().length);
    });

    return () => {
      unsubscribePanels();
      unsubscribeTimelines();
    };
  }, []);

  // Watch for panel open/close — snap to corner on open, restore drag position on close
  useEffect(() => {
    if (!panelRef.current || inline) return;
    const observer = new MutationObserver(() => {
      const inner = panelRef.current?.querySelector('.tweakers-panel-inner');
      if (!inner) return;
      const collapsed = inner.getAttribute('data-collapsed') === 'true';

      if (!collapsed) {
        // Opening — save drag position, determine corner, snap
        if (dragOffset) {
          lastDragOffset.current = dragOffset;
          const bubbleCenterX = dragOffset.x + 21;
          const midX = window.innerWidth / 2;
          setActivePosition(bubbleCenterX < midX ? 'top-left' : 'top-right');
        } else {
          setActivePosition(position);
        }
        setDragOffset(null);
      } else if (lastDragOffset.current) {
        // Closing — restore the dragged position
        setDragOffset(lastDragOffset.current);
      }
    });
    observer.observe(panelRef.current, { subtree: true, attributes: true, attributeFilter: ['data-collapsed'] });
    return () => observer.disconnect();
  }, [inline, dragOffset, position]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only drag the collapsed bubble
    const inner = panelRef.current?.querySelector('.tweakers-panel-inner');
    if (!inner || inner.getAttribute('data-collapsed') !== 'true') return;

    const rect = panelRef.current!.getBoundingClientRect();
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      elX: rect.left,
      elY: rect.top,
    };
    didDragRef.current = false;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;

    if (!didDragRef.current && Math.abs(dx) + Math.abs(dy) < 4) return;
    didDragRef.current = true;

    setDragOffset({
      x: dragStartRef.current.elX + dx,
      y: dragStartRef.current.elY + dy,
    });
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    dragStartRef.current = null;

    // If we actually dragged, prevent the click from opening the panel
    if (didDragRef.current) {
      e.stopPropagation();
      const inner = panelRef.current?.querySelector('.tweakers-panel-inner');
      if (inner) {
        const blocker = (ev: Event) => { ev.stopPropagation(); };
        inner.addEventListener('click', blocker, { capture: true, once: true });
      }
    }
  }, []);

  // Don't render on server
  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  // Don't render if no editing surfaces are registered. A filtered root owns
  // named panels only: with none of them present there is nothing to draw, and
  // the timeline belongs to whichever root was left unfiltered.
  if (panels.length === 0 && (onlyKey !== undefined || timelineCount === 0)) {
    return null;
  }

  const dragStyle = dragOffset ? {
    top: dragOffset.y,
    left: dragOffset.x,
    right: 'auto' as const,
    bottom: 'auto' as const,
  } : undefined;

  const timelineToggle = timelineCount > 0 && onlyKey === undefined ? <TimelineToggleButton /> : null;

  const content = (
  <ShortcutListener>
    <div className="tweakers-root" data-mode={mode} data-theme={theme} data-chrome={chrome}>
      <div
        ref={panelRef}
        className="tweakers-panel"
        data-position={inline ? undefined : (dragOffset ? undefined : activePosition)}
        data-mode={mode}
        style={dragStyle}
        onPointerDown={!inline ? handlePointerDown : undefined}
        onPointerMove={!inline ? handlePointerMove : undefined}
        onPointerUp={!inline ? handlePointerUp : undefined}
      >
        {panels.length === 0 ? (
          <div className="tweakers-panel-wrapper">
            <Folder
              title="Tweakers"
              defaultOpen={inline || defaultOpen}
              isRoot={true}
              inline={inline}
              toolbar={timelineToggle}
            >
              <div className="tweakers-timeline-toolkit-only">Timeline</div>
            </Folder>
          </div>
        ) : (
          panels.map((panel) => (
            <Panel key={panel.id} panel={panel} defaultOpen={inline || defaultOpen} inline={inline} toolbarExtra={timelineToggle} />
          ))
        )}
      </div>
    </div>
  </ShortcutListener>
  );

  if (inline) {
    return content;
  }

  return createPortal(content, document.body);
}
