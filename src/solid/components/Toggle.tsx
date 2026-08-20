import { Show } from 'solid-js';
import { Checkbox } from './Checkbox';
import type { ShortcutConfig } from '../../store/DialStore';
import { formatToggleShortcut } from '../../shortcut-utils';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  shortcut?: ShortcutConfig;
  shortcutActive?: boolean;
}

export function Toggle(props: ToggleProps) {
  return (
    <div class="dialkit-labeled-control dialkit-labeled-control-check">
      <Checkbox checked={props.checked} onChange={props.onChange} label={props.label} />
      <span class="dialkit-labeled-control-label">
        {props.label}
        <Show when={props.shortcut}>
          <span class={`dialkit-shortcut-pill${props.shortcutActive ? ' dialkit-shortcut-pill-active' : ''}`}>
            {formatToggleShortcut(props.shortcut!)}
          </span>
        </Show>
      </span>
    </div>
  );
}
