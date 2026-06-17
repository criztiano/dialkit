import { ICON_CLOSE } from '../icons';
import type { ChipOption } from '../store/DialStore';

interface ChipsControlProps {
  label: string;
  value: string;
  options: ChipOption[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export function ChipsControl({ label, value, options, onChange, onRemove }: ChipsControlProps) {
  return (
    <div className="dialkit-chips">
      {label && <span className="dialkit-chips-label">{label}</span>}
      <div className="dialkit-chips-grid" role="listbox" aria-label={label}>
        {options.map((option) => (
          <div key={option.value} className="dialkit-chip" data-active={String(option.value === value)}>
            <button
              type="button"
              className="dialkit-chip-select"
              role="option"
              aria-selected={option.value === value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
            {option.removable && (
              <button
                type="button"
                className="dialkit-chip-remove"
                aria-label={`Remove ${option.label}`}
                onClick={() => onRemove(option.value)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d={ICON_CLOSE} />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
