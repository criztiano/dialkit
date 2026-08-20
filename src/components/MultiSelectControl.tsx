import { ICON_CHECK } from '../icons';
import type { MultiSelectOption } from '../store/TweakStore';

interface MultiSelectControlProps {
  label: string;
  value: string[];
  options: MultiSelectOption[];
  onChange: (value: string[]) => void;
}

// Emits the checked values in option order, not click order, so consumers can
// treat the array as a stable subset of the option list.
function toggle(value: string[], options: MultiSelectOption[], toggled: string): string[] {
  const next = new Set(value);
  if (next.has(toggled)) next.delete(toggled);
  else next.add(toggled);
  return options.filter((o) => next.has(o.value)).map((o) => o.value);
}

export function MultiSelectControl({ label, value, options, onChange }: MultiSelectControlProps) {
  return (
    <div className="tweakers-multiselect">
      {label && <span className="tweakers-multiselect-label">{label}</span>}
      <div className="tweakers-multiselect-list" role="listbox" aria-label={label} aria-multiselectable="true">
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className="tweakers-multiselect-row"
              role="option"
              aria-selected={checked}
              data-checked={String(checked)}
              onClick={() => onChange(toggle(value, options, option.value))}
            >
              <span className="tweakers-multiselect-box" aria-hidden="true">
                {checked && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICON_CHECK} />
                  </svg>
                )}
              </span>
              <span className="tweakers-multiselect-text">
                <span className="tweakers-multiselect-line">
                  {option.label}
                  {option.tag && <span className="tweakers-multiselect-tag">{option.tag}</span>}
                </span>
                {option.hint && <span className="tweakers-multiselect-hint">{option.hint}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
