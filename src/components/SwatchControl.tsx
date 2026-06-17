import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ICON_CHEVRON } from '../icons';
import type { SwatchOption } from '../store/DialStore';

interface SwatchControlProps {
  label: string;
  value: string;
  options: SwatchOption[];
  onChange: (value: string) => void;
}

function Preview({ colors }: { colors: string[] }) {
  return (
    <span className="dialkit-swatch-preview" aria-hidden="true">
      {colors.map((c, i) => (
        <span key={i} className="dialkit-swatch-chip" style={{ background: c }} />
      ))}
    </span>
  );
}

export function SwatchControl({ label, value, options, onChange }: SwatchControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; above: boolean } | null>(null);

  const selectedOption = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dropdownHeight = 8 + options.length * 36;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < dropdownHeight && rect.top > spaceBelow;
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left: rect.left, width: rect.width, above });
  }, [options.length]);

  const open = () => {
    updatePos();
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const select = (v: string) => {
    onChange(v);
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlight >= 0 && highlight < options.length) select(options[highlight].value);
    }
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
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('resize', onViewport);
    window.addEventListener('scroll', onViewport, true);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('resize', onViewport);
      window.removeEventListener('scroll', onViewport, true);
    };
  }, [isOpen, updatePos]);

  return (
    <div className="dialkit-select-row">
      <button
        ref={triggerRef}
        className="dialkit-select-trigger"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={onKeyDown}
        data-open={String(isOpen)}
      >
        <span className="dialkit-select-label">{label}</span>
        <div className="dialkit-select-right">
          {selectedOption && <Preview colors={selectedOption.colors} />}
          <span className="dialkit-select-value">{selectedOption?.label ?? value}</span>
          <motion.svg
            className="dialkit-select-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
          >
            <path d={ICON_CHEVRON} />
          </motion.svg>
        </div>
      </button>

      {portalTarget && createPortal(
        <AnimatePresence>
          {isOpen && pos && (
            <motion.div
              ref={dropdownRef}
              className="dialkit-select-dropdown"
              initial={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 }}
              transition={{ type: 'spring', visualDuration: 0.15, bounce: 0 }}
              style={{
                position: 'fixed',
                left: pos.left,
                width: pos.width,
                ...(pos.above
                  ? { bottom: window.innerHeight - pos.top, transformOrigin: 'bottom' }
                  : { top: pos.top, transformOrigin: 'top' }),
              }}
            >
              {options.map((option, i) => (
                <button
                  key={option.value}
                  className="dialkit-select-option dialkit-swatch-option"
                  data-selected={String(option.value === value)}
                  data-highlight={String(i === highlight)}
                  onClick={() => select(option.value)}
                  onMouseEnter={() => setHighlight(i)}
                >
                  <Preview colors={option.colors} />
                  <span className="dialkit-swatch-option-label">{option.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        portalTarget
      )}
    </div>
  );
}
