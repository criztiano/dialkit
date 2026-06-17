import { useState, ReactNode } from 'react';
import { ICON_CHEVRON } from '../icons';
import { SegmentedControl } from './SegmentedControl';

interface ModuleProps {
  title: string;
  /** Whether the module is on. When off, the body collapses away. */
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children: ReactNode;
  /** Start expanded. Default true. */
  defaultOpen?: boolean;
  /** Allow manual collapse via the header chevron. Default true. */
  collapsible?: boolean;
}

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit (synth layers, effect sends, optional
 * feature groups). When disabled the body collapses away with a smooth
 * height transition; the right-aligned chevron also collapses it manually
 * while enabled.
 */
export function Module({
  title,
  enabled,
  onEnabledChange,
  children,
  defaultOpen = true,
  collapsible = true,
}: ModuleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const expanded = collapsible ? isOpen : true;
  // Body shows only when enabled AND expanded; either being false collapses
  // it (animated via the grid-rows trick — see theme.css).
  const visible = enabled && expanded;
  const toggleOpen = () => {
    if (collapsible) setIsOpen((o) => !o);
  };

  return (
    <div className="dialkit-module">
      <div
        className="dialkit-module-header"
        onClick={toggleOpen}
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        <span className="dialkit-module-title">{title}</span>
        <div className="dialkit-module-switch" onClick={(e) => e.stopPropagation()}>
          <SegmentedControl
            options={ENABLE_OPTIONS}
            value={enabled ? 'on' : 'off'}
            onChange={(v) => onEnabledChange(v === 'on')}
          />
        </div>
        {collapsible && (
          <svg
            className={`dialkit-module-icon${visible ? '' : ' dialkit-module-icon-collapsed'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ICON_CHEVRON} />
          </svg>
        )}
      </div>

      <div className="dialkit-module-collapse" data-open={visible}>
        <div className="dialkit-module-collapse-clip">
          <div className="dialkit-module-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
