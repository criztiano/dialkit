import { Slider } from './Slider';
import type { ControlMeta } from 'tweakers/store';
import { filterShapePath } from 'tweakers/move-layout';
import { resolveFilterAxis, normalizeFilterValue, type FilterValue } from 'tweakers/filter-core';

interface FilterControlProps {
  control: ControlMeta;
  value: FilterValue | undefined;
  onChange: (value: FilterValue) => void;
}

/** The filter's inline row height — the curve rows' 56px convention. */
const FILTER_SURFACE_HEIGHT = 56;

/**
 * The filter control's inline face: the magnitude response drawn as a curve
 * row, with the two hands — cutoff and resonance — as sliders under it. One
 * control, one value; on the Move the same trio compresses into the 2-slot
 * picture.
 */
export function FilterControl({ control, value, onChange }: FilterControlProps) {
  const ca = resolveFilterAxis(control.cutoffAxis, 'cutoff');
  const ra = resolveFilterAxis(control.resonanceAxis, 'resonance');
  const v = normalizeFilterValue(value, ca, ra);
  const shape = filterShapePath(control, v);
  return (
    <div className="tweakers-filter">
      <div className="tweakers-curve">
        <span className="tweakers-curve-label">{control.label}</span>
        <div className="tweakers-curve-surface" style={{ height: FILTER_SURFACE_HEIGHT }}>
          {shape && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%' }}>
              <path className="tweakers-curve-stroke" d={shape} fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
        </div>
      </div>
      <Slider
        label={ca.label}
        value={v.cutoff}
        min={ca.min}
        max={ca.max}
        step={ca.step || undefined}
        formatValue={ca.formatValue}
        onChange={(cutoff) => onChange({ ...v, cutoff })}
      />
      <Slider
        label={ra.label}
        value={v.resonance}
        min={ra.min}
        max={ra.max}
        step={ra.step || undefined}
        formatValue={ra.formatValue}
        onChange={(resonance) => onChange({ ...v, resonance })}
      />
    </div>
  );
}
