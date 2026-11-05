import { ICON_CHECK } from '../icons';
import { useHints } from '../hooks/useHints';
import { toggleMultiSelect, type MultiSelectOption } from '../choice';

interface MultiSelectControlProps {
  label: string;
  value: string[];
  options: MultiSelectOption[];
  onChange: (value: string[]) => void;
  hint?: string;
}

/** Checkbox rows. The value is the checked values in option order, not click order. */
export function MultiSelectControl({ label, value, options, onChange, hint }: MultiSelectControlProps) {
  useHints(!!hint);
  return (
    <div className="dialkit-multiselect" data-hint={hint}>
      {label && <span className="dialkit-multiselect-label">{label}</span>}
      <div className="dialkit-multiselect-list" role="listbox" aria-label={label} aria-multiselectable="true">
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className="dialkit-multiselect-row"
              role="option"
              aria-selected={checked}
              data-checked={String(checked)}
              onClick={() => onChange(toggleMultiSelect(value, options, option.value))}
            >
              <span className="dialkit-multiselect-box" aria-hidden="true">
                {checked && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICON_CHECK} />
                  </svg>
                )}
              </span>
              <span className="dialkit-multiselect-text">
                <span className="dialkit-multiselect-line">
                  <span className="dialkit-multiselect-name">{option.label}</span>
                  {option.tag && <span className="dialkit-multiselect-tag">{option.tag}</span>}
                </span>
                {option.hint && <span className="dialkit-multiselect-hint">{option.hint}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
