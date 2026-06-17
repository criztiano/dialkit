import { createSignal, Show, JSX } from 'solid-js';
import { ICON_CHEVRON } from '../../icons';
import { SegmentedControl } from './SegmentedControl';

interface ModuleProps {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children?: JSX.Element;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

/**
 * A titled module whose header carries an enable switch — for parameter
 * blocks that turn on/off as a unit. When disabled the body collapses away
 * with a smooth height transition; the right-aligned chevron also collapses
 * it manually while enabled.
 */
export function Module(props: ModuleProps) {
  const collapsible = () => props.collapsible ?? true;
  const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? true);
  const expanded = () => (collapsible() ? isOpen() : true);
  const visible = () => props.enabled && expanded();
  const toggleOpen = () => {
    if (collapsible()) setIsOpen((o) => !o);
  };

  return (
    <div class="dialkit-module">
      <div
        class="dialkit-module-header"
        onClick={toggleOpen}
        style={{ cursor: collapsible() ? 'pointer' : 'default' }}
      >
        <span class="dialkit-module-title">{props.title}</span>
        <div class="dialkit-module-switch" onClick={(e) => e.stopPropagation()}>
          <SegmentedControl
            options={ENABLE_OPTIONS}
            value={props.enabled ? 'on' : 'off'}
            onChange={(v) => props.onEnabledChange(v === 'on')}
          />
        </div>
        <Show when={collapsible()}>
          <svg
            class={`dialkit-module-icon${visible() ? '' : ' dialkit-module-icon-collapsed'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d={ICON_CHEVRON} />
          </svg>
        </Show>
      </div>

      <div class="dialkit-module-collapse" data-open={visible()}>
        <div class="dialkit-module-collapse-clip">
          <div class="dialkit-module-inner">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
