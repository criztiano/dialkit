import { useState, ReactNode } from 'react';
import { SegmentedControl } from './SegmentedControl';

interface ModuleFolderProps {
  title: string;
  /** Whether the module is on — the value at the folder's `_enabled` path. */
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  /** Initial open state while enabled (`_collapsed: true` starts closed). */
  defaultOpen?: boolean;
  /** One line of help for the section, revealed on hover over the header. */
  hint?: string;
  hintId?: string;
  children: ReactNode;
}

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

/**
 * A config-level module: a folder that declared `_enabled`. Same idiom as the
 * standalone Module — the header switch doubles as the expand control and the
 * body collapses away with the grid-rows height transition when off (see
 * theme.css). On top of that, clicking the header toggles the open state while
 * enabled, so `_collapsed` still controls how the section starts.
 */
export function ModuleFolder({ title, enabled, onEnabledChange, defaultOpen = true, hint, hintId, children }: ModuleFolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleEnabledChange = (next: boolean) => {
    onEnabledChange(next);
    // Turning on always reveals the body — a switch that lands on a still-
    // collapsed section would read as broken.
    if (next) setIsOpen(true);
  };

  return (
    <div className="dialkit-module dialkit-module-folder" data-open={enabled && isOpen ? 'true' : 'false'}>
      <div
        className="dialkit-module-header dialkit-module-header-toggle"
        onClick={() => { if (enabled) setIsOpen(open => !open); }}
        data-hint={hint ? 'true' : undefined}
        aria-describedby={hint ? hintId : undefined}
      >
        <span className="dialkit-module-title">{title}</span>
        <div className="dialkit-module-switch" onClick={(e) => e.stopPropagation()}>
          <SegmentedControl
            options={ENABLE_OPTIONS}
            value={enabled ? 'on' : 'off'}
            onChange={(v) => handleEnabledChange(v === 'on')}
          />
        </div>
        {hint && (
          <span className="dialkit-hint" id={hintId} role="tooltip">
            {hint}
          </span>
        )}
      </div>

      <div className="dialkit-module-collapse" data-open={enabled && isOpen}>
        <div className="dialkit-module-collapse-clip">
          <div className="dialkit-module-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
