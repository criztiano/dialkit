import { useRef } from 'react';
import { ICON_CLOSE, ICON_FILE } from '../icons';
import { useHints } from '../hooks/useHints';
import { fileValue } from '../choice';

interface FileControlProps {
  label: string;
  /** The picked file's name, or '' when none is picked. */
  value: string;
  accept?: string;
  multiple?: boolean;
  onChange: (value: string) => void;
  /** The picked files. They are not stored: only their name is the value. */
  onPick: (files: FileList) => void;
  hint?: string;
}

const CLEAR_HINT = 'Clears the file.';

/** A row that opens the file picker, shows the picked file's name, and clears it. */
export function FileControl({ label, value, accept, multiple = false, onChange, onPick, hint }: FileControlProps) {
  useHints(!!hint || !!value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    onPick(files);
    onChange(fileValue(files));
  };

  const clear = () => {
    if (inputRef.current) inputRef.current.value = '';
    onChange('');
  };

  return (
    <div className="dialkit-file-row" data-hint={hint}>
      <button type="button" className="dialkit-file-trigger" data-empty={value ? undefined : 'true'} onClick={() => inputRef.current?.click()}>
        <span className="dialkit-file-label">{label}</span>
        <span className="dialkit-file-right">
          <svg className="dialkit-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={ICON_FILE} />
          </svg>
          <span className="dialkit-file-name">{value || 'Choose file…'}</span>
        </span>
      </button>
      {value && (
        <button type="button" className="dialkit-file-clear" aria-label={`Clear ${label.toLowerCase()}`} data-hint={CLEAR_HINT} onClick={clear}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d={ICON_CLOSE} />
          </svg>
        </button>
      )}
      <input ref={inputRef} className="dialkit-file-input" type="file" accept={accept} multiple={multiple} tabIndex={-1} aria-hidden="true" onChange={handleChange} />
    </div>
  );
}
