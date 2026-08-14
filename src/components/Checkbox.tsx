import { motion } from 'motion/react';

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
 * A compact tri-state box: on (accent, ticked), off (empty), and disabled
 * (a dash).
 *
 * This replaces the Off/On segmented pair for boolean rows and module
 * headers. A two-tab switch spends ~84px and a whole row of attention on
 * one bit; a box spends 16px and reads instantly. The segmented control
 * stays where it belongs — three or more genuinely different modes.
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
      className="dialkit-checkbox"
      data-checked={checked && !disabled ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
    >
      <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
        {disabled ? (
          <motion.path
            d="M3.5 8h9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        ) : (
          <motion.path
            d="M2.5 8.5 6.5 12.5 13.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
        )}
      </svg>
    </button>
  );
}
