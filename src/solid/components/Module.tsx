import { JSX } from 'solid-js';
import { SegmentedControl } from './SegmentedControl';

interface ModuleProps {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children?: JSX.Element;
}

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. The switch doubles as the expand
 * control: disabling collapses the body away with a smooth height transition.
 */
export function Module(props: ModuleProps) {
  return (
    <div class="dialkit-module">
      <div class="dialkit-module-header">
        <span class="dialkit-module-title">{props.title}</span>
        <div class="dialkit-module-switch">
          <SegmentedControl
            options={ENABLE_OPTIONS}
            value={props.enabled ? 'on' : 'off'}
            onChange={(v) => props.onEnabledChange(v === 'on')}
          />
        </div>
      </div>

      <div class="dialkit-module-collapse" data-open={props.enabled}>
        <div class="dialkit-module-collapse-clip">
          <div class="dialkit-module-inner">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
