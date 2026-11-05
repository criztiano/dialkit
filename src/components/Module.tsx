import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { useHints } from '../hooks/useHints';

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

interface ModuleProps {
  title: string;
  /** Whether the module is on. The Off/On switch is the expand control:
   *  off collapses the body away, on reveals it. */
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  /** One line of help, shown while H is held over the header. */
  hint?: string;
  children?: ReactNode;
}

interface ModuleFolderProps extends ModuleProps {
  /** Whether the body starts open while the module is on. */
  defaultOpen?: boolean;
}

function ModuleHeader({ title, enabled, onEnabledChange, hint, onToggle }: Omit<ModuleProps, 'children'> & { onToggle?: () => void }) {
  return (
    <div
      className="dialkit-module-header"
      data-toggle={onToggle ? 'true' : undefined}
      data-hint={hint}
      onClick={onToggle}
    >
      <span className="dialkit-module-title">{title}</span>
      {/* The switch sits inside the header, but a press on it must not also fold the body. */}
      <div className="dialkit-module-switch" onClick={(e) => e.stopPropagation()}>
        <SegmentedControl
          options={ENABLE_OPTIONS}
          value={enabled ? 'on' : 'off'}
          onChange={(v) => onEnabledChange(v === 'on')}
          label={title}
        />
      </div>
    </div>
  );
}

function ModuleBody({ open, children }: { open: boolean; children: ReactNode }) {
  // A folded body keeps its controls mounted; inert keeps Tab and screen readers out of them.
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (ref.current) ref.current.inert = !open; }, [open]);
  return (
    <div ref={ref} className="dialkit-module-collapse" data-open={String(open)}>
      <div className="dialkit-module-collapse-clip">
        <div className="dialkit-module-inner">{children}</div>
      </div>
    </div>
  );
}

const isEmpty = (children: ReactNode) => children == null || (Array.isArray(children) && children.length === 0);

/**
 * A titled block of controls that turns on and off as a unit (a synth layer,
 * an effect send, an optional feature). The header's Off/On switch is also
 * the expand control: off folds the body away.
 */
export function Module({ title, enabled, onEnabledChange, hint, children }: ModuleProps) {
  useHints(!!hint);
  return (
    <div className="dialkit-module" data-enabled={String(enabled)}>
      <ModuleHeader title={title} enabled={enabled} onEnabledChange={onEnabledChange} hint={hint} />
      {!isEmpty(children) && <ModuleBody open={enabled}>{children}</ModuleBody>}
    </div>
  );
}

/**
 * A Module whose header also folds the body while the module is on, like a
 * folder. Turning the module on always opens the body.
 */
export function ModuleFolder({ title, enabled, onEnabledChange, defaultOpen = true, hint, children }: ModuleFolderProps) {
  useHints(!!hint);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // A module can be only its switch; then there is no body to fold.
  const headerOnly = isEmpty(children);
  const handleEnabledChange = (next: boolean) => {
    onEnabledChange(next);
    if (next) setIsOpen(true);
  };
  return (
    <div className="dialkit-module dialkit-module-folder" data-enabled={String(enabled)}>
      <ModuleHeader
        title={title}
        enabled={enabled}
        onEnabledChange={handleEnabledChange}
        hint={hint}
        onToggle={enabled && !headerOnly ? () => setIsOpen((open) => !open) : undefined}
      />
      {!headerOnly && <ModuleBody open={enabled && isOpen}>{children}</ModuleBody>}
    </div>
  );
}
