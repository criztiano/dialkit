import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GradientPanel } from './GradientPanel';
import { gradientToCss, type GradientValue } from '../gradient-core';

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

export function GradientControl({ label, value, onChange }: GradientControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);
  // Manual position once the user drags the panel by its grip; overrides `pos`.
  const [dragPos, setDragPos] = useState<{ left: number; top: number } | null>(null);

  const onPanelDrag = useCallback((dx: number, dy: number) => {
    setDragPos((prev) => {
      const rect = panelRef.current?.getBoundingClientRect();
      const base = prev ?? (rect ? { left: rect.left, top: rect.top } : null);
      if (!base) return prev;
      const left = Math.min(window.innerWidth - 40, Math.max(8 - PANEL_WIDTH + 40, base.left + dx));
      const top = Math.min(window.innerHeight - 40, Math.max(8, base.top + dy));
      return { left, top };
    });
  }, []);

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const panelHeight = value.type === 'radial' ? PANEL_HEIGHT_RADIAL : PANEL_HEIGHT_ANGLED;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < panelHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PANEL_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  }, [value.type]);

  const open = () => {
    setDragPos(null);
    updatePos();
    setIsOpen(true);
  };

  useEffect(() => {
    const root = triggerRef.current?.closest('.dialkit-root') as HTMLElement | null;
    setPortalTarget(root ?? document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
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
  }, [isOpen, updatePos]);

  return (
    <div className="dialkit-gradient-control">
      <span className="dialkit-gradient-label">{label}</span>
      <button
        ref={triggerRef}
        className="dialkit-gradient-preview dialkit-checker"
        style={{ '--gradient-preview': gradientToCss(value) } as React.CSSProperties}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        data-open={String(isOpen)}
        title="Edit gradient"
        aria-label={`Edit gradient for ${label}`}
        aria-expanded={isOpen}
      />

      {portalTarget && createPortal(
        <AnimatePresence>
          {isOpen && pos && (
            <motion.div
              ref={panelRef}
              className="dialkit-gradient-popover"
              initial={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 }}
              transition={{ type: 'spring', visualDuration: 0.15, bounce: 0 }}
              style={{
                position: 'fixed',
                width: PANEL_WIDTH,
                ...(dragPos
                  ? { left: dragPos.left, top: dragPos.top, transformOrigin: 'top left' }
                  : pos.above
                    ? { left: pos.left, bottom: window.innerHeight - pos.top, transformOrigin: 'bottom right' }
                    : { left: pos.left, top: pos.top, transformOrigin: 'top right' }),
              }}
            >
              <GradientPanel value={value} onChange={onChange} onDrag={onPanelDrag} />
            </motion.div>
          )}
        </AnimatePresence>,
        portalTarget
      )}
    </div>
  );
}
