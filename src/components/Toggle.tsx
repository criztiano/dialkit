import { Checkbox } from './Checkbox';
import type { ShortcutConfig } from '../store/TweakStore';
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
    <div className="tweakers-labeled-control tweakers-labeled-control-check">
      <Checkbox checked={checked} onChange={onChange} label={label} />
      <span className="tweakers-labeled-control-label">
        {label}
        {shortcut && (
          <span className={`tweakers-shortcut-pill${shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`}>
            {formatToggleShortcut(shortcut)}
          </span>
        )}
      </span>
    </div>
  );
}
