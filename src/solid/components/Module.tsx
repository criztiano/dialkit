import { JSX } from 'solid-js';
import { Checkbox } from './Checkbox';

interface ModuleProps {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children?: JSX.Element;
}

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. The switch doubles as the expand
 * control: disabling collapses the body away with a smooth height transition.
 */
export function Module(props: ModuleProps) {
  return (
    <div class="tweakers-module">
      <div class="tweakers-module-header">
        <Checkbox checked={props.enabled} onChange={props.onEnabledChange} label={props.title} />
        <span class="tweakers-module-title">{props.title}</span>
      </div>

      <div class="tweakers-module-collapse" data-open={props.enabled}>
        <div class="tweakers-module-collapse-clip">
          <div class="tweakers-module-inner">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
