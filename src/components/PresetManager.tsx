import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PresenceMotionDiv } from './PresenceMotionDiv';
import { DialStore } from '../store/DialStore';
import { ICON_CHEVRON, ICON_TRASH, ICON_PENCIL } from '../icons';

interface PresetManagerProps {
  panelId: string;
  // Structural on purpose: stock Preset[] and provider-derived PresetItem[]
  // both fit. `deletable`/`renamable` default to true so stock callers stay
  // unchanged.
  presets: { id: string; name: string; deletable?: boolean; renamable?: boolean }[];
  activePresetId: string | null;
  onAdd: () => void;
  /** Host-provider mode: the implicit "Version 1" base row is hidden. */
  providerMode?: boolean;
  /**
   * Bumped by the host after "+": the dropdown opens and the active preset's
   * name goes straight into inline edit, so a fresh preset gets its name in
   * the same gesture that created it.
   */
  editSignal?: number;
}

export function PresetManager({ panelId, presets, activePresetId, onAdd, providerMode = false, editSignal = 0 }: PresetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const lastEditSignal = useRef(editSignal);

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

  const startEditing = useCallback((presetId: string, name: string) => {
    setEditingId(presetId);
    setDraftName(name);
  }, []);

  const commitEdit = useCallback(() => {
    if (editingId && draftName.trim()) {
      DialStore.renamePreset(panelId, editingId, draftName);
    }
    setEditingId(null);
  }, [panelId, editingId, draftName]);

  // A bumped editSignal means "+" just fired: open the list and put the
  // now-active preset's name into edit. The active id can land a render
  // late (host providers update their state async), so keep watching it
  // until the signal is consumed.
  useEffect(() => {
    if (editSignal === lastEditSignal.current) return;
    const active = presets.find((p) => p.id === activePresetId);
    if (!active || !(active.renamable ?? true)) return;
    lastEditSignal.current = editSignal;
    open();
    startEditing(active.id, active.name);
  }, [editSignal, activePresetId, presets, open, startEditing]);

  // Focus and select the draft as soon as the input exists.
  useEffect(() => {
    if (editingId) editInputRef.current?.select();
  }, [editingId]);

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
                  onClick={editingId === preset.id ? undefined : () => handleSelect(preset.id)}
                >
                  {editingId === preset.id ? (
                    <input
                      ref={editInputRef}
                      className="dialkit-preset-name-input"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit();
                        if (e.key === 'Escape') setEditingId(null);
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <span className="dialkit-preset-name">{preset.name}</span>
                  )}
                  {editingId !== preset.id && (preset.renamable ?? true) && (
                    <button
                      className="dialkit-preset-rename"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(preset.id, preset.name);
                      }}
                      title="Rename preset"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {ICON_PENCIL.map((d, i) => (
                          <path key={i} d={d} />
                        ))}
                      </svg>
                    </button>
                  )}
                  {editingId !== preset.id && (preset.deletable ?? true) && (
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
