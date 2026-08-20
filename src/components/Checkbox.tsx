interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name — the visible label is rendered by the caller. */
  label?: string;
  /** The control exists but cannot act right now: reads as a dash, not a
   *  blank box, so "unavailable" never looks like "off". */
  disabled?: boolean;
  id?: string;
}

/**
 * A compact tri-state box: on (a filled chip), off (a slash), and disabled
 * (a dash).
 *
 * This replaces the Off/On segmented pair for boolean rows and module
 * headers. A two-tab switch spends ~84px and a whole row of attention on
 * one bit; a box spends 22px and reads instantly. The segmented control
 * stays where it belongs — three or more genuinely different modes.
 *
 * All three marks are always in the DOM; CSS reveals one from the data
 * attributes, so the state swap animates without any motion code.
 */
export function Checkbox({ checked, onChange, label, disabled = false, id }: CheckboxProps) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={disabled ? 'mixed' : checked}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className="tweakers-checkbox"
      data-checked={checked && !disabled ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
    >
      <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">
        <path className="tweakers-checkbox-slash" d="M6 16 16 6" fill="none" />
        <rect className="tweakers-checkbox-chip" x="5" y="5" width="12" height="12" rx="2" />
        <path className="tweakers-checkbox-dash" d="M6 11h10" fill="none" />
      </svg>
    </button>
  );
}
