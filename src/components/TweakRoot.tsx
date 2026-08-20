import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TweakStore, PanelConfig } from '../store/TweakStore';
import { TimelineStore } from '../store/TimelineStore';
import { isDevDefault } from '../env';
import { Folder } from './Folder';
import { Panel } from './Panel';
import { ShortcutListener } from './ShortcutListener';
import { TimelineToggleButton } from './Timeline/TimelineToggleButton';

export type TweakPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type TweakMode = 'popover' | 'inline';
export type TweakTheme = 'light' | 'dark' | 'system';

interface TweakRootProps {
  position?: TweakPosition;
  defaultOpen?: boolean;
  mode?: TweakMode;
  theme?: TweakTheme;
  productionEnabled?: boolean;
}

export function TweakRoot({ position = 'top-right', defaultOpen = true, mode = 'popover', theme = 'system', productionEnabled = isDevDefault }: TweakRootProps) {
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
  useEffect(() => {
    setMounted(true);
    setPanels(TweakStore.getPanels('panel'));
    setTimelineCount(TimelineStore.getTimelines().length);

    const unsubscribePanels = TweakStore.subscribeGlobal(() => {
      setPanels(TweakStore.getPanels('panel'));
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

  // Don't render if no editing surfaces are registered.
  if (panels.length === 0 && timelineCount === 0) {
    return null;
  }

  const dragStyle = dragOffset ? {
    top: dragOffset.y,
    left: dragOffset.x,
    right: 'auto' as const,
    bottom: 'auto' as const,
  } : undefined;

  const timelineToggle = timelineCount > 0 ? <TimelineToggleButton /> : null;

  const content = (
  <ShortcutListener>
    <div className="tweakers-root" data-mode={mode} data-theme={theme}>
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
