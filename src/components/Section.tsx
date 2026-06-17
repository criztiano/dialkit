import { useState, ReactNode } from 'react';
import { ICON_CHEVRON } from '../icons';
import { SegmentedControl } from './SegmentedControl';

interface SectionProps {
  title: string;
  /** Whether the section's layer is on. Drives the header switch + dimming. */
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children: ReactNode;
  /** Start expanded. Default true. */
  defaultOpen?: boolean;
  /** Allow collapsing via the header chevron. Default true. */
  collapsible?: boolean;
  /**
   * Dim the body when disabled. The body stays interactive so you can tune a
   * layer while it's muted. Default true.
   */
  dimWhenDisabled?: boolean;
}

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

/**
 * A titled, collapsible group whose header carries an enable switch — for
 * parameter blocks that can be turned on/off as a unit (synth layers, effect
 * sends, optional feature groups).
 */
export function Section({
  title,
  enabled,
  onEnabledChange,
  children,
  defaultOpen = true,
  collapsible = true,
  dimWhenDisabled = true,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = collapsible ? isOpen : true;
  const toggleOpen = () => {
    if (collapsible) setIsOpen((o) => !o);
  };

  return (
    <div className="dialkit-section">
      <div className="dialkit-section-header">
        <div
          className="dialkit-section-title-row"
          onClick={toggleOpen}
          style={{ cursor: collapsible ? 'pointer' : 'default' }}
        >
          {collapsible && (
            <svg
              className={`dialkit-section-icon${open ? '' : ' dialkit-section-icon-collapsed'}`}
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
          <span className="dialkit-section-title">{title}</span>
        </div>
        <div className="dialkit-section-switch" onClick={(e) => e.stopPropagation()}>
          <SegmentedControl
            options={ENABLE_OPTIONS}
            value={enabled ? 'on' : 'off'}
            onChange={(v) => onEnabledChange(v === 'on')}
          />
        </div>
      </div>

      {open && (
        <div
          className={`dialkit-section-content${
            dimWhenDisabled && !enabled ? ' dialkit-section-disabled' : ''
          }`}
        >
          <div className="dialkit-section-inner">{children}</div>
        </div>
      )}
    </div>
  );
}
