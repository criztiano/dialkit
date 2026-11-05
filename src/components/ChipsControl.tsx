import { ICON_CLOSE } from '../icons';
import { useHints } from '../hooks/useHints';
import type { ChipOption } from '../choice';

interface ChipsControlProps {
  label: string;
  value: string;
  options: ChipOption[];
  onChange: (value: string) => void;
  /** A removable chip's remove: the app takes the chip out of its options. */
  onRemove: (value: string) => void;
  hint?: string;
}

const REMOVE_HINT = 'Removes this choice.';

/** One of a set of chips that wrap onto more lines. A removable chip has a remove button. */
export function ChipsControl({ label, value, options, onChange, onRemove, hint }: ChipsControlProps) {
  useHints(!!hint || options.some((option) => option.removable));
  return (
    <div className="dialkit-chips" data-hint={hint}>
      {label && <span className="dialkit-chips-label">{label}</span>}
      <div className="dialkit-chips-grid" role="listbox" aria-label={label}>
        {options.map((option) => (
          <div key={option.value} className="dialkit-chip" data-active={String(option.value === value)} data-removable={option.removable ? 'true' : undefined}>
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
                data-hint={REMOVE_HINT}
                onClick={() => onRemove(option.value)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
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
