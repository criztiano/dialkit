import { useEffect, useRef } from 'react';
import { ICON_CLOSE } from '../icons';
import { useHints } from '../hooks/useHints';
import { optionKeyIndex } from '../control-keyboard';
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

/**
 * One of a set of chips that wrap onto more lines. The chips are one tab stop:
 * arrows move and pick, like a segmented control. A removable chip has a remove
 * button, and Delete or Backspace removes the focused chip.
 */
export function ChipsControl({ label, value, options, onChange, onRemove, hint }: ChipsControlProps) {
  useHints(!!hint || options.some((option) => option.removable));
  const gridRef = useRef<HTMLDivElement>(null);
  // After a remove from the keyboard, focus goes to the chip that is now the tab stop.
  const focusAfterRemove = useRef(false);
  const tabStop = options.some((option) => option.value === value) ? value : options[0]?.value;

  useEffect(() => {
    if (!focusAfterRemove.current) return;
    focusAfterRemove.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('.dialkit-chip-select[tabindex="0"]')?.focus({ preventScroll: true });
  }, [options, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const option = options[index];
    if ((e.key === 'Delete' || e.key === 'Backspace') && option.removable) {
      e.preventDefault();
      e.stopPropagation();
      focusAfterRemove.current = true;
      onRemove(option.value);
      return;
    }
    const next = optionKeyIndex(e.key, index, options.length, true);
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    const chips = gridRef.current?.querySelectorAll<HTMLButtonElement>('.dialkit-chip-select');
    chips?.[next]?.focus({ preventScroll: true });
    onChange(options[next].value);
  };

  return (
    <div className="dialkit-chips" data-hint={hint}>
      {label && <span className="dialkit-chips-label">{label}</span>}
      <div ref={gridRef} className="dialkit-chips-grid" role="radiogroup" aria-label={label}>
        {options.map((option, index) => (
          <div key={option.value} className="dialkit-chip" data-active={String(option.value === value)} data-removable={option.removable ? 'true' : undefined}>
            <button
              type="button"
              className="dialkit-chip-select"
              role="radio"
              aria-checked={option.value === value}
              aria-keyshortcuts={option.removable ? 'Delete Backspace' : undefined}
              tabIndex={option.value === tabStop ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {option.label}
            </button>
            {option.removable && (
              <button
                type="button"
                className="dialkit-chip-remove"
                aria-label={`Remove ${option.label}`}
                data-hint={REMOVE_HINT}
                tabIndex={-1}
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
