import type { CSSProperties, ReactNode } from 'react';
import { moveNumericDrawing, movePlaybackMode, type MovePlaybackMode } from '../move-visual-core';
import { MoveSlotNumericBody, MoveSlotPlaybackDrawing } from './move-visuals';
export { MoveSlotNumericBody, MoveSlotPlaybackDrawing } from './move-visuals';
import type { ControlMeta } from '../store/TweakStore';
import { LUCIDE_ICONS } from '../icons';
import { enumOptionLabel, enumOptionValue } from '../move-layout';
import { arcPath } from '../angle-core';
import { resolveFilterAxis, type FilterValue } from '../filter-core';
import { ListScreen } from './ListScreen';

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
 * - `enum`    — a plain stepped option picker: every option on the Move's
 *   own list screen, which is the whole slot; a touch grows it to the run.
 * - `xy`      — a 2D pad filling the slot; on the hardware the column's
 *   knob turns X and the volume knob turns Y while touched.
 * - `range`   — two handles on one bar; column knob = low end, volume
 *   knob = high end while touched.
 * - `opacity`, `blur`, `pan`, `stereo-width`, `pitch` — explicit numeric
 *   meanings, drawn as specimens or positioned against domain references.
 * - `playback` — an explicitly mapped playback icon.
 * - `filter`  — the 2-slot control: cutoff and resonance as one picture,
 *   the magnitude response maximised across both columns, each hand's
 *   small label sitting where its own slot's label would have been.
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
  | 'transfer'
  | 'ramp'
  | 'dial'
  | 'opacity'
  | 'blur'
  | 'pan'
  | 'stereo-width'
  | 'pitch'
  | 'playback';

/** Which face a control wears in its slot, from its meta and moment. */
export function moveSlotKind(
  meta: ControlMeta,
  opts: { enum?: boolean; shape?: string | null; glyph?: string | null; valueFirst?: boolean; value?: unknown } = {}
): MoveSlotKind {
  if (meta.type === 'filter') return 'filter';
  if (meta.type === 'transfer') return 'transfer';
  if (meta.type === 'gradient') return 'ramp';
  if (meta.type === 'slider' && meta.display === 'dial') return 'dial';
  if (meta.type === 'xy') return 'xy';
  if (meta.type === 'range') return 'range';
  const drawing = moveNumericDrawing(meta, opts.value ?? meta.min);
  if (drawing) return drawing.kind;
  if (movePlaybackMode(meta, opts.value)) return 'playback';
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

/** How many option rows a slot-sized list screen holds — the count the CSS
 *  band is cut for, and the point past which the list starts to run. */
export const MOVE_LIST_ROWS = 5;

/** The option picker's faces — a list, or a picture: a glyph, a drawn shape,
 *  or a playback drawing.
 *
 *  A face with a picture reads top down: what the knob is on the tag, the
 *  picture between, what it is set to underneath, and the pagination cells
 *  under that to say where the named option sits in the run.
 *
 *  With no picture to stand for the option, the slot shows the choice itself
 *  and becomes the screen: a small head keeps the control's name, and the
 *  list has everything under it — the current option lit, the rest dim
 *  around it. Naming only the selection spends a whole slot saying one word;
 *  the list spends it saying where that word sits among the others.
 *
 *  Past the five rows the slot holds, the list runs behind a still
 *  selection — and a touch grows the screen up out of the slot to the whole
 *  list, so the run can be seen while the knob is going through it. It is a
 *  readout, not a second control — the slot's own drag, and the column's
 *  knob, still step the options. */
export function MoveSlotEnumBody({
  label, optionLabel, options, activeIdx, shape, glyph, playback,
}: {
  label: string;
  optionLabel: string;
  options: NonNullable<ControlMeta['options']>;
  activeIdx: number;
  shape: string | null;
  glyph: string | null;
  playback?: MovePlaybackMode | null;
}) {
  const selected = options[activeIdx];

  // A picture names one option at a time, so it keeps the pagination cells
  // to say where that one sits. A list has the whole run on it already.
  if (playback || shape || glyph) {
    return (
      <>
        <span className="tweakers-move-dial-tag">{label}</span>
        {playback && <MoveSlotPlaybackDrawing mode={playback} />}
        {!playback && shape && <MoveSlotShape d={shape} />}
        {!playback && glyph && <MoveSlotGlyph name={glyph} className="tweakers-move-dial-icon" />}
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

  return (
    <div
      className="tweakers-move-dial-screen"
      // More options than the slot holds: the screen grows to the whole list
      // while the dial is touched. The count is what the CSS measures that
      // grown height from, so the row metrics stay in the stylesheet.
      data-grow={options.length > MOVE_LIST_ROWS || undefined}
      style={{ '--move-list-count': options.length } as CSSProperties}
    >
      <span className="tweakers-move-dial-head">{label}</span>
      <ListScreen
        className="tweakers-move-dial-list"
        items={options.map((opt) => ({
          value: enumOptionValue(opt as never),
          label: enumOptionLabel(opt as never),
        }))}
        value={selected ? enumOptionValue(selected as never) : undefined}
        follow="center"
      />
    </div>
  );
}

/** The XY slot face. Coordinates are normalized screen positions (Y down).
 * The panel owns gestures and normalization; a preview replaces the crosshair.
 */
export function MoveSlotXYBody({ label, value, position, gridN, shape = null }: {
  label: string;
  value: ReactNode;
  position: { x: number; y: number };
  gridN: number;
  shape?: string | null;
}) {
  return (
    <>
      <div className="tweakers-move-xy">
        {shape !== null ? (
          <MoveSlotShape d={shape} className="tweakers-move-xy-curve" />
        ) : (
          <>
            {gridN > 0 && (
              <span className="tweakers-move-xy-grid" style={{
                '--tweak-xy-grid-step-x': `${100 / gridN}%`,
                '--tweak-xy-grid-step-y': `${100 / gridN}%`,
              } as CSSProperties} />
            )}
            <span className="tweakers-move-xy-line" data-axis="x" style={{ top: `${position.y * 100}%` }} />
            <span className="tweakers-move-xy-line" data-axis="y" style={{ left: `${position.x * 100}%` }} />
            <span className="tweakers-move-xy-dot" style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }} />
          </>
        )}
      </div>
      <MoveSlotReadout label={label} value={value} />
    </>
  );
}

/**
 * A slot that draws instead of counting: the curve, the ramp and the needle
 * all sit on the same dark display the filter's response uses, with a small
 * label under it. A big centred name over a faint line — the first cut of
 * this — read as neither.
 */
function MoveSlotDisplay({ children }: { children: ReactNode }) {
  return <div className="tweakers-move-slot-display">{children}</div>;
}

function MoveSlotDisplayFoot({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="tweakers-move-slot-foot">
      <span className="tweakers-move-slot-foot-label">{label}</span>
      <span className="tweakers-move-slot-foot-value">{value}</span>
    </div>
  );
}

/**
 * The transfer-curve slot. The curve fills the display, with a dot on the
 * point the knob is holding — one knob shapes a whole curve, so the slot has
 * to say WHICH point it is shaping.
 */
export function MoveSlotTransferBody({ label, value, shape, point }: {
  label: string;
  value: ReactNode;
  /** The whole curve as an SVG path, in the slot's own y-down space. */
  shape: string;
  /** The held point's normalized screen position (y down), or null. */
  point: { x: number; y: number } | null;
}) {
  return (
    <>
      <MoveSlotDisplay>
        <MoveSlotShape d={shape} className="tweakers-move-slot-shape" />
        {point && (
          <span
            className="tweakers-move-slot-dot"
            style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
          />
        )}
      </MoveSlotDisplay>
      <MoveSlotDisplayFoot label={label} value={value} />
    </>
  );
}

/**
 * The colour-ramp slot: the ramp itself fills the display, because a list of
 * colours has nothing to say as a number. A tick marks the stop the knob is
 * holding.
 */
export function MoveSlotRampBody({ label, value, css, stop }: {
  label: string;
  value: ReactNode;
  /** The ramp as a CSS `linear-gradient(...)`. */
  css: string;
  /** The held stop's position 0..1, or null. */
  stop: number | null;
}) {
  return (
    <>
      <MoveSlotDisplay>
        <span className="tweakers-move-slot-ramp" style={{ background: css }} />
        {stop !== null && (
          // Inset a hair so a stop at either end still shows its whole tick —
          // the only thing saying which stop the knob is holding.
          <span
            className="tweakers-move-slot-tick"
            style={{ left: `calc(${stop * 100}% + ${(0.5 - stop) * 4}px)` }}
          />
        )}
      </MoveSlotDisplay>
      <MoveSlotDisplayFoot label={label} value={value} />
    </>
  );
}

/**
 * The dial slot — a needle, for the values whose two ends are the same place.
 * A bar would put 359° and 1° as far apart as a slot can show them.
 */
export function MoveSlotDialBody({ label, value, bearing, origin }: {
  label: string;
  value: ReactNode;
  /** Compass bearing in degrees, 0 = up, clockwise. */
  bearing: number;
  /** The bearing the sweep grows out of. */
  origin: number;
}) {
  const rad = ((bearing - 90) * Math.PI) / 180;
  return (
    <>
      <MoveSlotDisplay>
        <svg className="tweakers-move-slot-needle" viewBox="-12 -12 24 24" aria-hidden="true">
          <circle className="tweakers-move-needle-face" cx="0" cy="0" r="8.5" />
          <path className="tweakers-move-needle-sweep" d={arcPath(origin, bearing, 8.5)} />
          <line
            className="tweakers-move-needle-hand"
            x1="0" y1="0"
            x2={(8.5 * Math.cos(rad)).toFixed(3)}
            y2={(8.5 * Math.sin(rad)).toFixed(3)}
          />
        </svg>
      </MoveSlotDisplay>
      <MoveSlotDisplayFoot label={label} value={value} />
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
 * The dictionary itself — every big-slot case the kit knows, named, with
 * the component that draws it. `value`, `icon`, `curve` and `enum` are
 * faces of shared bodies (the same markup, chosen by `moveSlotKind`);
 * every face is reusable; gesture ownership stays in MovePanel.
 */
export const MOVE_SLOT_LIBRARY = {
  opacity: { description: 'overlapping circles showing transparency', component: MoveSlotNumericBody },
  blur: { description: 'pixel blur on a single filled circle', component: MoveSlotNumericBody },
  pan: { description: 'position between L, C and R references', component: MoveSlotNumericBody },
  'stereo-width': { description: 'stereo separation with a unity reference', component: MoveSlotNumericBody },
  pitch: { description: 'signed pitch ruler with a zero reference', component: MoveSlotNumericBody },
  playback: { description: 'explicit playback traversal with a named mode', component: MoveSlotEnumBody },
  default: { description: 'name centred, value on touch, fill bar', component: MoveSlotDefaultBody },
  value: { description: 'value-first: the value is the headline, the name a tag on top', component: MoveSlotDefaultBody },
  icon: { description: 'option picker showing the current option as a glyph', component: MoveSlotEnumBody },
  curve: { description: 'option picker drawing the current option’s shape — curve selection', component: MoveSlotEnumBody },
  enum: { description: 'stepped option picker showing every option on a list screen', component: MoveSlotEnumBody },
  xy: { description: 'two axes in one gesture field, or a live shape preview', component: MoveSlotXYBody },
  range: { description: 'two handles on one bar; volume knob is the second hand', component: MoveSlotRangeBody },
  filter: { description: '2 slots: cutoff + resonance as one response picture', component: MoveSlotFilterBody },
  transfer: { description: 'a response curve, one knob holding one of its points', component: MoveSlotTransferBody },
  ramp: { description: 'a colour ramp, one knob holding one of its stops', component: MoveSlotRampBody },
  dial: { description: 'a needle, for values whose two ends are the same place', component: MoveSlotDialBody },
} as const satisfies Record<MoveSlotKind, { description: string; component: unknown }>;
