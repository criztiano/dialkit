import { useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DialStore, PanelConfig } from '../store/DialStore';
import { buildCopyInstruction } from '../copy-instruction';
import { ShortcutsMenu } from './ShortcutsMenu';
import { ICON_CLIPBOARD, ICON_CHECK, ICON_ADD_PRESET } from '../icons';
import { Folder } from './Folder';
import { ControlRenderer } from './ControlRenderer';
import { PresetManager } from './PresetManager';

interface PanelProps {
  panel: PanelConfig;
  defaultOpen?: boolean;
  inline?: boolean;
  toolbarExtra?: ReactNode;
}

export function Panel({ panel, defaultOpen = true, inline = false, toolbarExtra }: PanelProps) {
  const [copied, setCopied] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(defaultOpen);
  const hasShortcuts = Object.keys(panel.shortcuts).length > 0;

  // Subscribe to panel value changes
  const values = useSyncExternalStore(
    (cb) => DialStore.subscribe(panel.id, cb),
    () => DialStore.getValues(panel.id),
    () => DialStore.getValues(panel.id)
  );

  const presets = DialStore.getPresetItems(panel.id);
  const activePresetId = DialStore.getActivePresetId(panel.id);
  const providerMode = DialStore.hasPresetProvider(panel.id);

  const handleAddPreset = () => DialStore.createPreset(panel.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCopyInstruction('useDialKit', panel.name, values));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderControls = () => (
    <ControlRenderer panelId={panel.id} controls={panel.controls} values={values} />
  );

  const iconTransition = { type: 'spring' as const, visualDuration: 0.4, bounce: 0.1 };

  const toolbar = (
    <>
      <motion.button
        className="dialkit-toolbar-add"
        onClick={handleAddPreset}
        title="Add preset"
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', visualDuration: 0.15, bounce: 0.3 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {ICON_ADD_PRESET.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </motion.button>

      <PresetManager
        panelId={panel.id}
        presets={presets}
        activePresetId={activePresetId}
        onAdd={handleAddPreset}
        providerMode={providerMode}
      />

      <motion.button
        className="dialkit-toolbar-add"
        onClick={handleCopy}
        title="Copy parameters"
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', visualDuration: 0.15, bounce: 0.3 }}
      >
        <span style={{ position: 'relative', width: 16, height: 16 }}>
          <AnimatePresence initial={false} mode="wait">
            {copied ? (
              <motion.svg
                key="check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute', inset: 0, width: 16, height: 16, color: 'var(--dial-text-label)' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.08 }}
              >
                <path d={ICON_CHECK} />
              </motion.svg>
            ) : (
              <motion.svg
                key="clipboard"
                viewBox="0 0 24 24"
                fill="none"
                style={{ position: 'absolute', inset: 0, width: 16, height: 16, color: 'var(--dial-text-label)' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.08 }}
              >
                <path d={ICON_CLIPBOARD.board} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d={ICON_CLIPBOARD.sparkle} fill="currentColor"/>
                <path d={ICON_CLIPBOARD.body} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {toolbarExtra}
    </>
  );

  return (
    <div className="dialkit-panel-wrapper">
      <Folder title={panel.name} defaultOpen={defaultOpen} isRoot={true} inline={inline} onOpenChange={setIsPanelOpen} toolbar={toolbar}>
        {renderControls()}
      </Folder>
    </div>
  );
}
