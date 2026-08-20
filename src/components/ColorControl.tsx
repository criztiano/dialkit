import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ColorPickerPanel } from './ColorPickerPanel';
import { parseHex, normalizeHexEdit, bareHex, opacityPercent } from '../color-core';

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
  const [editValue, setEditValue] = useState(() => bareHex(value));
  const [isOpen, setIsOpen] = useState(false);
  const swatchRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);

  const hexInputRef = useRef<HTMLInputElement>(null);
  const rgba = parseHex(value);

  // Sync editValue when value changes externally (edited without the '#' —
  // it renders as a fixed symbol; a pasted '#…' still parses on commit)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(bareHex(value));
    }
  }, [value, isEditing]);

  // Focus + select-all on edit start so a paste replaces the value outright.
  useEffect(() => {
    if (isEditing) {
      hexInputRef.current?.focus();
      hexInputRef.current?.select();
    }
  }, [isEditing]);

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
    const root = swatchRef.current?.closest('.tweakers-root') as HTMLElement | null;
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
    // A bare 6-digit entry keeps the current opacity — the alpha digits are
    // deliberately absent from the edit field (they have their own readout).
    const normalized = normalizeHexEdit(editValue, alpha, rgba?.a ?? 1);
    if (normalized) {
      onChange(normalized);
    } else {
      setEditValue(bareHex(value));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      // Cancel only the edit — don't let the document handler close the popover too.
      e.stopPropagation();
      setIsEditing(false);
      setEditValue(bareHex(value));
    }
  }

  return (
    <div className="tweakers-color-control">
      <span className="tweakers-color-label">{label}</span>
      <div className="tweakers-color-inputs">
        {/* The whole token (hash included) is the click target for editing. */}
        <span className="tweakers-color-hex-wrap" onClick={() => setIsEditing(true)}>
          <span className="tweakers-color-hash" aria-hidden="true">#</span>
          {isEditing ? (
            <input
              ref={hexInputRef}
              type="text"
              className="tweakers-color-hex-input"
              aria-label={`Hex color for ${label}`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleTextSubmit}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span className="tweakers-color-hex" aria-label={`Hex color for ${label}`}>
              {bareHex(value)}
            </span>
          )}
        </span>
        {alpha && rgba && (
          <>
            <span className="tweakers-color-divider" aria-hidden="true" />
            <span className="tweakers-color-opacity">
              {opacityPercent(rgba)} <span className="tweakers-color-opacity-unit">%</span>
            </span>
          </>
        )}
        <button
          ref={swatchRef}
          className="tweakers-color-swatch"
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
              className="tweakers-color-picker-popover"
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
