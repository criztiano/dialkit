import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ColorPickerPanel } from './ColorPickerPanel';
import { parseHex, normalizeHex, displayHex, opacityPercent } from '../color-core';

interface ColorControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  alpha?: boolean;
  palette?: boolean;
}

const PICKER_WIDTH = 240;
// Estimated open heights for the above/below flip (SV area + sliders + fields + padding).
const PICKER_BASE_HEIGHT = 270;
const PICKER_ALPHA_HEIGHT = 22;
const PICKER_PALETTE_HEIGHT = 30;

export function ColorControl({ label, value, onChange, alpha = false, palette = false }: ColorControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const swatchRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);

  const rgba = parseHex(value);

  // Sync editValue when value changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const updatePos = useCallback(() => {
    const el = swatchRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pickerHeight =
      PICKER_BASE_HEIGHT + (alpha ? PICKER_ALPHA_HEIGHT : 0) + (palette ? PICKER_PALETTE_HEIGHT : 0);
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PICKER_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  }, [alpha, palette]);

  const open = () => {
    updatePos();
    setIsOpen(true);
  };

  useEffect(() => {
    const root = swatchRef.current?.closest('.dialkit-root') as HTMLElement | null;
    setPortalTarget(root ?? document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (swatchRef.current?.contains(target) || pickerRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        swatchRef.current?.focus();
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

  function handleTextSubmit() {
    setIsEditing(false);
    const normalized = normalizeHex(editValue, alpha);
    if (normalized) {
      onChange(normalized);
    } else {
      setEditValue(value);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      // Cancel only the edit — don't let the document handler close the popover too.
      e.stopPropagation();
      setIsEditing(false);
      setEditValue(value);
    }
  }

  return (
    <div className="dialkit-color-control">
      <span className="dialkit-color-label">{label}</span>
      <div className="dialkit-color-inputs">
        {alpha && rgba && (
          <span className="dialkit-color-opacity">
            {opacityPercent(rgba)} <span className="dialkit-color-opacity-unit">%</span>
          </span>
        )}
        {isEditing ? (
          <input
            type="text"
            className="dialkit-color-hex-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleTextSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span
            className="dialkit-color-hex"
            onClick={() => setIsEditing(true)}
          >
            {displayHex(value)}
          </span>
        )}
        <button
          ref={swatchRef}
          className="dialkit-color-swatch"
          style={{ '--swatch-color': value } as React.CSSProperties}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          data-open={String(isOpen)}
          title="Pick color"
          aria-label={`Pick color for ${label}`}
          aria-expanded={isOpen}
        />
      </div>

      {portalTarget && createPortal(
        <AnimatePresence>
          {isOpen && pos && (
            <motion.div
              ref={pickerRef}
              className="dialkit-color-picker-popover"
              initial={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.95 }}
              transition={{ type: 'spring', visualDuration: 0.15, bounce: 0 }}
              style={{
                position: 'fixed',
                left: pos.left,
                width: PICKER_WIDTH,
                ...(pos.above
                  ? { bottom: window.innerHeight - pos.top, transformOrigin: 'bottom right' }
                  : { top: pos.top, transformOrigin: 'top right' }),
              }}
            >
              <ColorPickerPanel value={value} onChange={onChange} alpha={alpha} palette={palette} />
            </motion.div>
          )}
        </AnimatePresence>,
        portalTarget
      )}
    </div>
  );
}
