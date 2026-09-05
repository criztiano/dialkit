import type { ReactNode } from 'react';
import type { ControlMeta } from '../store/TweakStore';
import { LUCIDE_ICONS } from '../icons';
import { enumOptionValue } from '../move-layout';
import { resolveFilterAxis, type FilterValue } from '../filter-core';

/**
 * The big-slot library — the dictionary of what a Move dial slot can be.
 *
 * A slot is one column of the Move's dial row (two for the filter). The
 * gestures — pointer capture, fine drag, modulation arming — stay with the
 * MovePanel; what lives here is the slot's face: every body is a pure
 * drawing of computed props, so each case can be read, reused, and tested
 * on its own. `moveSlotKind` names which face a control wears.
 *
 * The cases:
 * - `default` — the basic slot: name centred, value in its place on touch,
 *   fill bar at the bottom (an origin tick when the dial is bipolar).
 * - `value`   — the same slot the other way round: the value is the
 *   headline, the name shrinks to a tag on top. For dials whose value
 *   already says what it is (two seconds, three clips), and for a value
 *   chip substituted into the slot.
 * - `icon`    — an option picker whose current option shows as a glyph:
 *   at arm's length you read a picture, not a word.
 * - `curve`   — an option picker whose current option draws its shape (the
 *   select's `preview` sampler) — the curve-selection slot.
 * - `enum`    — a plain stepped option picker: option name centred, one
 *   pagination cell per option.
 * - `xy`      — a 2D pad filling the slot; on the hardware the column's
 *   knob turns X and the volume knob turns Y while touched.
 * - `range`   — two handles on one bar; column knob = low end, volume
 *   knob = high end while touched.
 * - `filter`  — the 2-slot control: cutoff and resonance as one picture,
 *   the magnitude response maximised across both columns, each hand's
 *   small label sitting where its own slot's label would have been.
 * - `env`     — one stage of the ADSR: the slot draws its stage's segment,
 *   and the four side-by-side slots read as one envelope across the row.
 */
export type MoveSlotKind =
  | 'default'
  | 'value'
  | 'icon'
  | 'curve'
  | 'enum'
  | 'xy'
  | 'range'
  | 'filter'
  | 'env';

/** Which face a control wears in its slot, from its meta and moment. */
export function moveSlotKind(
  meta: ControlMeta,
  opts: { enum?: boolean; shape?: string | null; glyph?: string | null; valueFirst?: boolean; stage?: string | null } = {}
): MoveSlotKind {
  if (meta.type === 'filter') return 'filter';
  if (opts.stage) return 'env';
  if (meta.type === 'xy') return 'xy';
  if (meta.type === 'range') return 'range';
  if (opts.enum) {
    if (opts.shape) return 'curve';
    if (opts.glyph) return 'icon';
    return 'enum';
  }
  return opts.valueFirst ? 'value' : 'default';
}

/** One glyph from the bundled lucide subset; an unknown name draws nothing. */
export function MoveSlotGlyph({ name, className }: { name: string; className: string }) {
  const paths = LUCIDE_ICONS[name];
  if (!paths) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

/** The slot's centred name, and the value that takes its place on touch. */
export function MoveSlotReadout({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="tweakers-move-dial-readout">
      <span className="tweakers-move-dial-label" data-long={label.length > 9 || undefined}>
        {label}
      </span>
      <span className="tweakers-move-dial-value">{value}</span>
    </div>
  );
}

/** A path drawn edge to edge in the slot's picture band. */
export function MoveSlotShape({ d, className = 'tweakers-move-dial-shape' }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** The basic slot and its value-first twin — readout plus fill bar. A
 *  bipolar dial parked exactly on its origin states the zero outright
 *  (the marker) instead of leaving a stub to read against a tick. */
export function MoveSlotDefaultBody({
  label, value, pct, originPct, atOrigin,
}: {
  label: string;
  value: ReactNode;
  /** Fill extent, 0–100. */
  pct: number;
  /** Bipolar/origin anchor position, 0–100 — null for a plain fill. */
  originPct: number | null;
  /** Parked on the origin exactly — the dial's zero. */
  atOrigin?: boolean;
}) {
  return (
    <>
      <MoveSlotReadout label={label} value={value} />
      <div className="tweakers-move-dial-bar">
        <div
          className="tweakers-move-dial-fill"
          data-zero={atOrigin || undefined}
          style={originPct != null
            ? { marginLeft: `${Math.min(pct, originPct)}%`, width: `${Math.abs(pct - originPct)}%` }
            : { width: `${pct}%` }}
        />
        {atOrigin && (
          <span className="tweakers-move-dial-zero" style={{ left: `${originPct}%` }} />
        )}
      </div>
    </>
  );
}

/** The option picker's three faces — name, glyph, or drawn shape — plus the
 *  pagination cells. A slot with a picture reads top down: what the knob is
 *  on the tag, the picture between, what it is set to underneath. */
export function MoveSlotEnumBody({
  label, optionLabel, options, activeIdx, shape, glyph,
}: {
  label: string;
  optionLabel: string;
  options: NonNullable<ControlMeta['options']>;
  activeIdx: number;
  shape: string | null;
  glyph: string | null;
}) {
  return (
    <>
      {(shape || glyph) && <span className="tweakers-move-dial-tag">{label}</span>}
      {shape && <MoveSlotShape d={shape} />}
      {glyph && <MoveSlotGlyph name={glyph} className="tweakers-move-dial-icon" />}
      {shape || glyph ? (
        <span className="tweakers-move-dial-option">{optionLabel}</span>
      ) : (
        <MoveSlotReadout label={label} value={optionLabel} />
      )}
      <div className="tweakers-move-dial-bar">
        <div className="tweakers-move-dial-enum">
          {options.map((opt, j) => (
            <span
              key={enumOptionValue(opt as never)}
              className="tweakers-move-dial-enum-cell"
              data-on={j === activeIdx || undefined}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/** The range slot — readout plus the two-handled span bar. */
export function MoveSlotRangeBody({
  label, value, lo, hi,
}: {
  label: string;
  value: ReactNode;
  /** Handle positions, each 0..1. */
  lo: number;
  hi: number;
}) {
  return (
    <>
      <MoveSlotReadout label={label} value={value} />
      <div className="tweakers-move-dial-bar">
        <div className="tweakers-move-dial-range">
          <div
            className="tweakers-move-dial-span"
            style={{ left: `${lo * 100}%`, width: `${(hi - lo) * 100}%` }}
          />
          <span className="tweakers-move-dial-handle" style={{ left: `${lo * 100}%` }} />
          <span className="tweakers-move-dial-handle" style={{ left: `${hi * 100}%` }} />
        </div>
      </div>
    </>
  );
}

/**
 * The 2-slot filter's face: the response maximised across both columns, and
 * a small label per hand — each sitting inline where its own single slot's
 * label would have been, cutoff on the left half, resonance on the right.
 * Each label gives way to its hand's value on touch, like any slot.
 */
export function MoveSlotFilterBody({
  meta, value, shape,
}: {
  meta: ControlMeta;
  value: FilterValue;
  shape: string | null;
}) {
  const ca = resolveFilterAxis(meta.cutoffAxis, 'cutoff');
  const ra = resolveFilterAxis(meta.resonanceAxis, 'resonance');
  const fmt = (v: number, f?: (n: number) => string) =>
    f ? f(v) : Math.abs(v) >= 100 ? Math.round(v).toString() : Number(v.toFixed(2)).toString();
  return (
    <>
      {/* The drawing sits on a display — the same dark hole in the face the
          waveform is cut into — so the response reads as a screen, not a
          squiggle floating on the chip. */}
      <div className="tweakers-move-filter-display">
        {shape && <MoveSlotShape d={shape} className="tweakers-move-filter-shape" />}
      </div>
      <div className="tweakers-move-filter-readout" data-side="cutoff">
        <span className="tweakers-move-dial-label">{ca.label}</span>
        <span className="tweakers-move-dial-value">{fmt(value.cutoff, ca.formatValue)}</span>
      </div>
      <div className="tweakers-move-filter-readout" data-side="resonance">
        <span className="tweakers-move-dial-label">{ra.label}</span>
        <span className="tweakers-move-dial-value">{fmt(value.resonance, ra.formatValue)}</span>
      </div>
    </>
  );
}

/**
 * One stage of the ADSR's four-column picture: the name on its tag, the
 * stage's segment drawn on a display, the stage's value underneath. The
 * segments meet at the slot edges by construction — attack ends at full,
 * decay lands on the sustain level, sustain runs flat there, release falls
 * to rest — so the four slots read as one envelope across the row.
 */
export function MoveSlotEnvBody({
  label, value, stage, points,
}: {
  label: string;
  value: ReactNode;
  stage: string;
  /** The segment's samples, each 0..1, left to right. */
  points: number[];
}) {
  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 100} ${100 - v * 100}`)
    .join(' ');
  return (
    <>
      <span className="tweakers-move-dial-tag">{label}</span>
      <div className="tweakers-move-env-display" data-stage={stage}>
        <MoveSlotShape d={d} className="tweakers-move-env-shape" />
      </div>
      <span className="tweakers-move-dial-option">{value}</span>
    </>
  );
}

/**
 * The dictionary itself — every big-slot case the kit knows, named, with
 * the component that draws it. `value`, `icon`, `curve` and `enum` are
 * faces of shared bodies (the same markup, chosen by `moveSlotKind`);
 * `xy` stays inline in the MovePanel for now, its face being nothing but
 * its gesture surface.
 */
export const MOVE_SLOT_LIBRARY = {
  default: { description: 'name centred, value on touch, fill bar', component: MoveSlotDefaultBody },
  value: { description: 'value-first: the value is the headline, the name a tag on top', component: MoveSlotDefaultBody },
  icon: { description: 'option picker showing the current option as a glyph', component: MoveSlotEnumBody },
  curve: { description: 'option picker drawing the current option’s shape — curve selection', component: MoveSlotEnumBody },
  enum: { description: 'stepped option picker, one pagination cell per option', component: MoveSlotEnumBody },
  range: { description: 'two handles on one bar; volume knob is the second hand', component: MoveSlotRangeBody },
  filter: { description: '2 slots: cutoff + resonance as one response picture', component: MoveSlotFilterBody },
  env: { description: 'one ADSR stage; four side-by-side slots read as one envelope', component: MoveSlotEnvBody },
} as const;
