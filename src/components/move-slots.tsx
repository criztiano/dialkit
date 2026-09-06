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
 * - `enum`    — a plain option picker as a list screen at slot size: every
 *   option on the display, dim, the current one bright on its highlight.
 * - `xy`      — a 2D pad filling the slot; on the hardware the column's
 *   knob turns X and the volume knob turns Y while touched.
 * - `range`   — two handles on one bar; column knob = low end, volume
 *   knob = high end while touched.
 * - `filter`  — the 2-slot control: cutoff and resonance as one picture,
 *   the magnitude response maximised across both columns, each hand's
 *   small label sitting where its own slot's label would have been.
 * - `env`     — the 4-slot control: the whole ADSR drawn as one shape on a
 *   single display spanning the four stage columns, one caption and drag
 *   zone per stage.
 * - `scope`   — a dial with the oscilloscope in it: the modulator's live
 *   signal fills the slot behind the dial's own readout and bar.
 *
 * Multi-slot controls (`filter` spans 2 columns, `env` spans 4) follow one
 * pattern: the container takes `grid-column: span N`, the display and its
 * drawing stretch across the whole span, and each hand or stage keeps a
 * small caption where its own single slot's label would have been — so the
 * hardware's one-knob-per-column rule still holds under the shared picture.
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
  | 'env'
  | 'scope'
  | 'toggle';

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

/** How many list rows an enum slot shows before it windows on the selection. */
export const MOVE_ENUM_LIST_ROWS = 4;

/** The option picker's three faces — a list of the options themselves, a
 *  glyph, or a drawn shape. A slot with a picture reads top down: what the
 *  knob is on the tag, the picture between, what it is set to underneath.
 *  The plain face is the list screen at slot size: every option on the
 *  display, dim, the current one bright on its highlight — you see where
 *  you are and where a turn takes you, no pagination cells to count. */
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
  if (shape || glyph) {
    return (
      <>
        <span className="tweakers-move-dial-tag">{label}</span>
        {shape && <MoveSlotShape d={shape} />}
        {glyph && <MoveSlotGlyph name={glyph} className="tweakers-move-dial-icon" />}
        <span className="tweakers-move-dial-option">{optionLabel}</span>
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
  // A window follows the selection when the list outgrows the slot, the
  // list screen's own rule at slot size.
  const start = Math.max(
    0,
    Math.min(activeIdx - (MOVE_ENUM_LIST_ROWS >> 1), options.length - MOVE_ENUM_LIST_ROWS)
  );
  const windowed = options.slice(start, start + MOVE_ENUM_LIST_ROWS);
  return (
    <>
      <span className="tweakers-move-dial-tag">{label}</span>
      <div className="tweakers-move-enum-list">
        {windowed.map((opt, j) => {
          const value = enumOptionValue(opt as never);
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <span
              key={value}
              className="tweakers-move-enum-row"
              data-selected={start + j === activeIdx || undefined}
            >
              {optLabel}
            </span>
          );
        })}
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
 * The 4-slot envelope's face, the filter's big sibling: the whole ADSR
 * drawn as one shape on a single display spanning all four stage columns,
 * with each stage's small label sitting where its own slot's label would
 * have been — attack, decay, sustain, release, left to right, each caption
 * over its own drag zone and hardware knob.
 */
export function MoveSlotEnvBody({
  points, stages, joints = [],
}: {
  /** The whole envelope's samples, each 0..1, left to right. */
  points: number[];
  /** One caption per stage column, in column order. */
  stages: { stage: string; label: string; value: ReactNode }[];
  /** The joint handles — small squares pinned where the ramps meet. */
  joints?: { stage: string; x: number; y: number; held?: boolean }[];
}) {
  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 100} ${100 - v * 100}`)
    .join(' ');
  return (
    <>
      <div className="tweakers-move-env-display">
        <MoveSlotShape d={d} className="tweakers-move-env-shape" />
        {/* The drawing keeps 6px of vertical air (the shape svg's inset), so
            a joint's y maps through the same band to land on the line. */}
        {joints.map((j) => (
          <span
            key={j.stage}
            className="tweakers-move-env-handle"
            data-held={j.held || undefined}
            style={{
              left: `${j.x * 100}%`,
              top: `calc(6px + (100% - 12px) * ${(1 - j.y).toFixed(4)})`,
            }}
          />
        ))}
      </div>
      {stages.map((s) => (
        <div key={s.stage} className="tweakers-move-env-readout" data-stage={s.stage}>
          <span className="tweakers-move-dial-label">{s.label}</span>
          <span className="tweakers-move-dial-value">{s.value}</span>
        </div>
      ))}
    </>
  );
}

/**
 * A dial with the oscilloscope living in it — the Rate slot's face. The
 * live wave (passed in as the drawing, so the body stays pure) fills the
 * whole slot above the bar, edge to edge with no title in its way; the
 * dial's own readout floats over it and the fill bar keeps the bottom.
 * The control stays a control — you turn the wave you're watching.
 */
export function MoveSlotScopeBody({
  label, value, pct, children,
}: {
  label: string;
  value: ReactNode;
  /** Fill extent, 0–100. */
  pct: number;
  /** The live wave — an svg the host keeps ticking. */
  children: ReactNode;
}) {
  return (
    <>
      <div className="tweakers-move-scope-display">{children}</div>
      <MoveSlotReadout label={label} value={value} />
      <div className="tweakers-move-dial-bar">
        <div className="tweakers-move-dial-fill" style={{ width: `${pct}%` }} />
      </div>
    </>
  );
}

/**
 * A toggle in a big slot of its own — the pad's language at slot size: the
 * indicator bar up top, the name centred, the whole slot inverting when it
 * is on. For the switches that deserve a column (the envelope's Loop, with
 * its pad row spent on the bend gesture).
 */
export function MoveSlotToggleBody({ label, on }: { label: string; on: boolean }) {
  return (
    <>
      <span className="tweakers-move-dial-toggle-indicator" data-on={on || undefined} />
      <span className="tweakers-move-dial-toggle-label">{label}</span>
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
  enum: { description: 'option picker as a list screen at slot size, selection bright', component: MoveSlotEnumBody },
  range: { description: 'two handles on one bar; volume knob is the second hand', component: MoveSlotRangeBody },
  filter: { description: '2 slots: cutoff + resonance as one response picture', component: MoveSlotFilterBody },
  env: { description: '4 slots: the whole ADSR as one shape, a caption per stage', component: MoveSlotEnvBody },
  scope: { description: 'a dial with the live signal filling it behind the readout', component: MoveSlotScopeBody },
  toggle: { description: 'a switch in a big slot — the pad’s language at slot size', component: MoveSlotToggleBody },
} as const;
