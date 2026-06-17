import { createSignal, Show, JSX } from 'solid-js';
import { ICON_CHEVRON } from '../../icons';
import { SegmentedControl } from './SegmentedControl';

interface SectionProps {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children?: JSX.Element;
  defaultOpen?: boolean;
  collapsible?: boolean;
  dimWhenDisabled?: boolean;
}

const ENABLE_OPTIONS = [
  { value: 'off' as const, label: 'Off' },
  { value: 'on' as const, label: 'On' },
];

/**
 * A titled, collapsible group whose header carries an enable switch — for
 * parameter blocks that can be turned on/off as a unit. The body stays
 * interactive while disabled (it only dims) so a muted layer can still be
 * tuned.
 */
export function Section(props: SectionProps) {
  const collapsible = () => props.collapsible ?? true;
  const dimWhenDisabled = () => props.dimWhenDisabled ?? true;
  const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? true);
  const open = () => (collapsible() ? isOpen() : true);
  const toggleOpen = () => {
    if (collapsible()) setIsOpen((o) => !o);
  };

  return (
    <div class="dialkit-section">
      <div class="dialkit-section-header">
        <div
          class="dialkit-section-title-row"
          onClick={toggleOpen}
          style={{ cursor: collapsible() ? 'pointer' : 'default' }}
        >
          <Show when={collapsible()}>
            <svg
              class={`dialkit-section-icon${open() ? '' : ' dialkit-section-icon-collapsed'}`}
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
          <span class="dialkit-section-title">{props.title}</span>
        </div>
        <div class="dialkit-section-switch" onClick={(e) => e.stopPropagation()}>
          <SegmentedControl
            options={ENABLE_OPTIONS}
            value={props.enabled ? 'on' : 'off'}
            onChange={(v) => props.onEnabledChange(v === 'on')}
          />
        </div>
      </div>

      <Show when={open()}>
        <div
          class={`dialkit-section-content${
            dimWhenDisabled() && !props.enabled ? ' dialkit-section-disabled' : ''
          }`}
        >
          <div class="dialkit-section-inner">{props.children}</div>
        </div>
      </Show>
    </div>
  );
}
