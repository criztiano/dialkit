import type { SwatchOption } from '../choice';
import { SelectControl } from './SelectControl';

interface SwatchControlProps {
  label: string;
  value: string;
  options: SwatchOption[];
  onChange: (value: string) => void;
  hint?: string;
}

function SwatchPreview({ colors }: { colors: string[] }) {
  return (
    <span className="dialkit-swatch-preview" aria-hidden="true">
      {colors.map((color, i) => <span key={i} className="dialkit-swatch-chip" style={{ background: color }} />)}
    </span>
  );
}

/** A select dropdown of named palettes: each row and the trigger show the palette's colors before its name. */
export function SwatchControl({ label, value, options, onChange, hint }: SwatchControlProps) {
  const colorsOf = (v: string) => options.find((option) => option.value === v)?.colors ?? [];
  return (
    <SelectControl
      label={label}
      hint={hint}
      value={value}
      options={options.map(({ value, label }) => ({ value, label }))}
      onChange={onChange}
      preview={(v) => <SwatchPreview colors={colorsOf(v)} />}
    />
  );
}
