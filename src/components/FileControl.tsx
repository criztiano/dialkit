import { useRef } from 'react';
import { ICON_CLOSE, ICON_FILE } from '../icons';

interface FileControlProps {
  label: string;
  value: string;
  accept?: string;
  multiple?: boolean;
  onChange: (filename: string) => void;
  onPick: (files: FileList) => void;
}

export function FileControl({ label, value, accept, multiple = false, onChange, onPick }: FileControlProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    onPick(files);
    onChange(files.length === 1 ? files[0].name : `${files.length} files`);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    onChange('');
  };

  return (
    <div className="tweakers-file-row">
      <button type="button" className="tweakers-file-trigger" onClick={() => inputRef.current?.click()}>
        <span className="tweakers-file-label">{label}</span>
        <span className="tweakers-file-right">
          <svg
            className="tweakers-file-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={ICON_FILE} />
          </svg>
          <span className="tweakers-file-name" data-empty={String(!value)}>{value || 'Choose file…'}</span>
        </span>
      </button>

      {value && (
        <button type="button" className="tweakers-file-clear" onClick={clear} aria-label="Clear file">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d={ICON_CLOSE} />
          </svg>
        </button>
      )}

      <input
        ref={inputRef}
        className="tweakers-file-input"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </div>
  );
}
