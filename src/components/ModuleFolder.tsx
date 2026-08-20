import { useState, ReactNode } from 'react';
import { Checkbox } from './Checkbox';

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

/**
 * A config-level module: a folder that declared `_enabled`. Same idiom as the
 * standalone Module — the header switch doubles as the expand control and the
 * body collapses away with the grid-rows height transition when off (see
 * theme.css). On top of that, clicking the header toggles the open state while
 * enabled, so `_collapsed` still controls how the section starts.
 */
export function ModuleFolder({ title, enabled, onEnabledChange, defaultOpen = true, hint, hintId, children }: ModuleFolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // A module can be nothing but its switch (the header IS the control).
  // Rendering an empty collapse region would promise content that never
  // comes, so header-only modules skip the body and the open toggle.
  const headerOnly = children == null || (Array.isArray(children) && children.length === 0);

  const handleEnabledChange = (next: boolean) => {
    onEnabledChange(next);
    // Turning on always reveals the body — a switch that lands on a still-
    // collapsed section would read as broken.
    if (next) setIsOpen(true);
  };

  return (
    <div className="tweakers-module tweakers-module-folder" data-open={!headerOnly && enabled && isOpen ? 'true' : 'false'}>
      <div
        className={`tweakers-module-header ${headerOnly ? '' : 'tweakers-module-header-toggle'}`}
        onClick={() => { if (enabled && !headerOnly) setIsOpen(open => !open); }}
        data-hint={hint ? 'true' : undefined}
        aria-describedby={hint ? hintId : undefined}
      >
        <Checkbox checked={enabled} onChange={handleEnabledChange} label={title} />
        <span className="tweakers-module-title">{title}</span>
        {hint && (
          <span className="tweakers-hint" id={hintId} role="tooltip">
            {hint}
          </span>
        )}
      </div>

      {!headerOnly && (
        <div className="tweakers-module-collapse" data-open={enabled && isOpen}>
          <div className="tweakers-module-collapse-clip">
            <div className="tweakers-module-inner">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
