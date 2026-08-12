import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PresenceMotionDiv } from './PresenceMotionDiv';
import { DialStore } from '../store/DialStore';
import { ICON_CHEVRON, ICON_TRASH } from '../icons';

interface PresetManagerProps {
  panelId: string;
  // Structural on purpose: stock Preset[] and provider-derived PresetItem[]
  // both fit. `deletable` defaults to true so stock callers stay unchanged.
  presets: { id: string; name: string; deletable?: boolean }[];
  activePresetId: string | null;
  onAdd: () => void;
  /** Host-provider mode: the implicit "Version 1" base row is hidden. */
  providerMode?: boolean;
}

export function PresetManager({ panelId, presets, activePresetId, onAdd, providerMode = false }: PresetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const hasPresets = presets.length > 0;
  const activePreset = presets.find((p) => p.id === activePresetId);

  const open = useCallback(() => {
    if (!hasPresets) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  }, [hasPresets]);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Close on any mousedown outside trigger + dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      close();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  const handleSelect = (presetId: string | null) => {
    DialStore.selectPreset(panelId, presetId);
    close();
  };

  const handleDelete = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    DialStore.removePreset(panelId, presetId);
  };

  return (
    <div className="dialkit-preset-manager">
      <button
        ref={triggerRef}
        className="dialkit-preset-trigger"
        onClick={toggle}
        data-open={String(isOpen)}
        data-has-preset={String(!!activePreset)}
        data-disabled={String(!hasPresets)}
      >
        <span className="dialkit-preset-label">
          {activePreset ? activePreset.name : providerMode ? 'Presets' : 'Version 1'}
        </span>
        <motion.svg
          className="dialkit-select-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0, opacity: hasPresets ? 0.6 : 0.25 }}
          transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
        >
          <path d={ICON_CHEVRON} />
        </motion.svg>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <PresenceMotionDiv
              divRef={dropdownRef}
              className="dialkit-root dialkit-preset-dropdown"
              style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width }}
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97, pointerEvents: 'none' as any }}
              transition={{ type: 'spring', visualDuration: 0.15, bounce: 0 }}
            >
              {!providerMode && (
                <div
                  className="dialkit-preset-item"
                  data-active={String(!activePresetId)}
                  onClick={() => handleSelect(null)}
                >
                  <span className="dialkit-preset-name">Version 1</span>
                </div>
              )}

              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="dialkit-preset-item"
                  data-active={String(preset.id === activePresetId)}
                  onClick={() => handleSelect(preset.id)}
                >
                  <span className="dialkit-preset-name">{preset.name}</span>
                  {(preset.deletable ?? true) && (
                    <button
                      className="dialkit-preset-delete"
                      onClick={(e) => handleDelete(e, preset.id)}
                      title="Delete preset"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {ICON_TRASH.map((d, i) => (
                          <path key={i} d={d} />
                        ))}
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </PresenceMotionDiv>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
