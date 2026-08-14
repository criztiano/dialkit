import { Checkbox } from './Checkbox';
import type { ShortcutConfig } from '../store/DialStore';
import { formatToggleShortcut } from '../shortcut-utils';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  shortcut?: ShortcutConfig;
  shortcutActive?: boolean;
}

export function Toggle({ label, checked, onChange, shortcut, shortcutActive }: ToggleProps) {
  return (
    <div className="dialkit-labeled-control dialkit-labeled-control-check">
      <Checkbox checked={checked} onChange={onChange} label={label} />
      <span className="dialkit-labeled-control-label">
        {label}
        {shortcut && (
          <span className={`dialkit-shortcut-pill${shortcutActive ? ' dialkit-shortcut-pill-active' : ''}`}>
            {formatToggleShortcut(shortcut)}
          </span>
        )}
      </span>
    </div>
  );
}
