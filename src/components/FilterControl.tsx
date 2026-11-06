import { Slider } from './Slider';
import { useHints } from '../hooks/useHints';
import { useLiveConfig } from '../hooks/useLiveConfig';
import { filterResponsePath, normalizeFilterValue, resolveFilterAxis, type DialFilterValue } from '../filter';
import { inferStep, type ControlMeta } from '../store/DialStore';

interface FilterControlProps {
  panelId: string;
  control: ControlMeta;
  value: DialFilterValue | undefined;
  onChange: (value: DialFilterValue) => void;
}

/** The response the two hands make, with a slider for each hand under it. */
export function FilterControl({ panelId, control, value, onChange }: FilterControlProps) {
  useHints(!!control.hint);
  const config = useLiveConfig(panelId, control, 'filter') ?? { type: 'filter' };
  const cutoff = resolveFilterAxis(config.cutoff, 'cutoff');
  const resonance = resolveFilterAxis(config.resonance, 'resonance');
  const v = normalizeFilterValue(value, config);
  const path = filterResponsePath(config, v);
  return (
    <div className="dialkit-graph" data-hint={control.hint}>
      <div className="dialkit-graph-caption"><span className="dialkit-graph-label">{control.label}</span></div>
      <div className="dialkit-graph-surface dialkit-filter" data-disabled={config.enabled === false || undefined} role="img" aria-label={`${control.label} response`}>
        {path && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="dialkit-graph-stroke" d={path} vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </div>
      <Slider
        label={cutoff.label}
        value={v.cutoff}
        min={cutoff.min}
        max={cutoff.max}
        step={cutoff.step || inferStep(cutoff.min, cutoff.max)}
        unit={cutoff.unit}
        onChange={(next) => onChange({ ...v, cutoff: next })}
      />
      <Slider
        label={resonance.label}
        value={v.resonance}
        min={resonance.min}
        max={resonance.max}
        step={resonance.step || inferStep(resonance.min, resonance.max)}
        unit={resonance.unit}
        onChange={(next) => onChange({ ...v, resonance: next })}
      />
    </div>
  );
}
