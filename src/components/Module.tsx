import { ReactNode } from 'react';
import { SegmentedControl } from './SegmentedControl';

interface ModuleProps {
  title: string;
  /** Whether the module is on. The Off/On switch is the expand control:
   *  off collapses the body away, on reveals it. */
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children: ReactNode;
}

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit (synth layers, effect sends, optional
 * feature groups). The switch doubles as the expand control: disabling
 * collapses the body away with a smooth height transition.
 */
export function Module({ title, enabled, onEnabledChange, children }: ModuleProps) {
  return (
    <div className="dialkit-module">
      <div className="dialkit-module-header">
        <span className="dialkit-module-title">{title}</span>
        <div className="dialkit-module-switch">
          <SegmentedControl
            options={ENABLE_OPTIONS}
            value={enabled ? 'on' : 'off'}
            onChange={(v) => onEnabledChange(v === 'on')}
          />
        </div>
      </div>

      <div className="dialkit-module-collapse" data-open={enabled}>
        <div className="dialkit-module-collapse-clip">
          <div className="dialkit-module-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
