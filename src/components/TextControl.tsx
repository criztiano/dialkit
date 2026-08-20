interface TextControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextControl({ label, value, onChange, placeholder }: TextControlProps) {
  return (
    <div className="tweakers-text-control">
      <label className="tweakers-text-label">{label}</label>
      <input
        type="text"
        className="tweakers-text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
