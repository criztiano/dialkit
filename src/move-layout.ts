import type { PanelConfig, ControlMeta } from './store/TweakStore';
import type { ModPageLayout } from './modulation-core';
import { resolveAxis, type XYValue } from './xy-pad-core';
import { plotCurve } from './curve-preview-core';
import { clampRange, type RangeValue } from './range-slider-core';
import { resolveFilterAxis, normalizeFilterValue, filterHand01, filterHandValue, defaultFilterResponse, filterResponsePath, type FilterValue } from './filter-core';

/**
 * The Move's control surface, as the bridge kit maps it (move-tweakers v0):
 * the first 4 panels become pages behind the track buttons, sliders and
 * bounded numbers become the 8 dials, toggles become pads. An xy control
 * takes a dial slot too — the pad draws behind the label, its knob turns
 * the X axis, and the volume knob turns Y while that knob is touched. A
 * range control claims a slot the same way: its knob moves the low end,
 * the volume knob the high end while touched. A select with real choices
 * claims one as a stepped enum dial — the knob's 0..1 position maps to an
 * option index, step 1/(count-1). Bounded params
 * beyond the 8 dials overflow into the pad grid as value chips — each one
 * related, by column, to the dial above it, which it can substitute (hold
 * to peek, tap to latch). The on-screen MovePanel mirrors this mapping so
 * screen and hardware always show the same layout.
 */
export const MOVE_TRACKS = 4;
export const MOVE_DIALS = 8;
export const MOVE_PADS = 8;

export interface MovePage {
  panel: PanelConfig;
  dials: ControlMeta[];
  /** Switch chips — the hardware's toggle pad row (y=3 on the device). */
  toggles: ControlMeta[];
  /** Overflow value chips — the hardware's value pad row (y=1). Value i sits
   *  at column i on both surfaces, pairing it with the dial in that column. */
  values: ControlMeta[];
  /** Action pads — the row under the values (the device's bottom pad row).
   *  Placed by hand only, through the panel's `movePads` map. */
  actions: ControlMeta[];
}

const flat = (controls: ControlMeta[], out: ControlMeta[] = []): ControlMeta[] => {
  for (const c of controls) {
    if (c.children) flat(c.children, out);
    else out.push(c);
  }
  return out;
};

/** A select with real choices becomes an enum dial — the kit's exact rule. */
export const isEnumDial = (c: ControlMeta) =>
  c.type === 'select' && Array.isArray(c.options) && c.options.length > 1;

const isDial = (c: ControlMeta) =>
  c.type === 'slider' || c.type === 'xy' || c.type === 'range' || c.type === 'filter' || isEnumDial(c) ||
  (c.type === 'number' && c.min != null && c.max != null);

/** Two-handed dials and enums need a slot of their own, never a value chip. */
const noChip = (c: ControlMeta) => c.type === 'xy' || c.type === 'range' || c.type === 'filter' || isEnumDial(c);

/**
 * How many dial columns a control claims. The filter is the kit's first
 * 2-slot control: its picture spans two columns, and on the hardware the
 * left column's knob turns cutoff while the right column's turns resonance.
 */
export const dialSpan = (c: ControlMeta | undefined): number =>
  c?.type === 'filter' ? 2 : 1;

/** True when column i only continues the span-2 dial sitting at i-1. */
export const isSpanContinuation = (page: MovePage, i: number): boolean =>
  i > 0 && page.dials[i] !== undefined && page.dials[i] === page.dials[i - 1];

/**
 * The modulator-settings page (hold a step button): the kind picker takes
 * the first big slot, the modulator's own controls follow, and everything
 * else drops into the column of the dial declared just before it — the
 * LFO's tempo-sync pad below its rate dial, the curve's sync and signal
 * below its duration dial.
 *
 * `layout` is the ModulationStore's own placement (`getSettingsLayout`), the
 * single list both surfaces read; without it the same rule is re-derived
 * from the panel, which is enough for a modulator with no small slots.
 */
export function buildModMovePage(panel: PanelConfig, layout?: ModPageLayout | null): MovePage {
  const controls = flat(panel.controls);
  if (layout) {
    const at = (slot: { path: string } | null) =>
      slot ? controls.find((c) => c.path === slot.path) : undefined;
    return {
      panel,
      dials: layout.dials.slice(0, MOVE_DIALS).map(at).filter((c): c is ControlMeta => !!c),
      toggles: layout.toggles.slice(0, MOVE_PADS).map(at) as ControlMeta[],
      values: layout.values.slice(0, MOVE_PADS).map(at) as ControlMeta[],
      actions: [],
    };
  }
  const dials: ControlMeta[] = [];
  const toggles: ControlMeta[] = [];
  for (const c of controls) {
    // The kind picker keeps its slot even while only one modulator type is
    // registered (a 1-option select is not an enum dial by the kit's rule).
    if (c.type === 'toggle') toggles[Math.max(0, dials.length - 1)] = c;
    else if (c.type === 'select' || isDial(c)) dials.push(c);
  }
  return { panel, dials: dials.slice(0, MOVE_DIALS), toggles: toggles.slice(0, MOVE_PADS), values: [], actions: [] };
}

/**
 * A hand-placed pad's column, or null when the panel leaves the control to
 * the automatic packing. Out-of-range columns are ignored rather than
 * clamped: silently stacking two pads on column 7 would read as a layout
 * that works until you look at the hardware.
 */
const padColumn = (panel: PanelConfig, c: ControlMeta): number | null => {
  const col = panel.movePads?.[c.path];
  return typeof col === 'number' && Number.isInteger(col) && col >= 0 && col < MOVE_PADS
    ? col
    : null;
};

export function buildMovePages(panels: PanelConfig[]): MovePage[] {
  return panels
    .filter((p) => p.kind === undefined)
    .slice(0, MOVE_TRACKS)
    .map((panel) => {
      const controls = flat(panel.controls);
      // A bounded control sent to a pad is a value chip wherever it was
      // declared, so it must not eat a dial slot on the way past. Two-handed
      // dials and enums can't be chips at all, so a pad column on one of
      // those is ignored and it keeps its slot.
      const chipPlaced = (c: ControlMeta) => padColumn(panel, c) !== null && !noChip(c);
      // Dials pack left to right, each claiming its span of columns — a
      // span-2 control sits in both of its columns, so occupancy checks and
      // the knob-number rule need no second bookkeeping. A wide control that
      // no longer fits is passed over; a narrow one behind it may still land.
      const dials: ControlMeta[] = [];
      let nextCol = 0;
      for (const c of controls) {
        if (!isDial(c) || chipPlaced(c)) continue;
        const span = dialSpan(c);
        if (nextCol + span > MOVE_DIALS) {
          if (nextCol >= MOVE_DIALS) break;
          continue;
        }
        for (let s = 0; s < span; s++) dials[nextCol + s] = c;
        nextCol += span;
      }

      const toggles: ControlMeta[] = [];
      const values: ControlMeta[] = [];
      const actions: ControlMeta[] = [];
      // A named column is taken as read; everything else — and anything whose
      // column is already spoken for — packs into the leftmost free one, which
      // is the whole rule for a panel that names no columns at all.
      const place = (row: ControlMeta[], c: ControlMeta, col: number | null) => {
        if (col !== null && row[col] === undefined) {
          row[col] = c;
          return;
        }
        for (let i = 0; i < MOVE_PADS; i++) {
          if (row[i] === undefined) {
            row[i] = c;
            return;
          }
        }
      };
      for (const c of controls) {
        const col = padColumn(panel, c);
        if (c.type === 'toggle') place(toggles, c, col);
        // Actions reach the pads only when the page asks for them by column —
        // every app has buttons, and none of them expect a hardware pad.
        else if (c.type === 'action') { if (col !== null) place(actions, c, col); }
        /* xy pads and ranges need a dial slot — past the 8 dials they don't fit a chip */
        else if (isDial(c) && !noChip(c) && !dials.includes(c)) place(values, c, col);
      }
      return {
        panel,
        dials,
        toggles: toggles.slice(0, MOVE_PADS),
        values: values.slice(0, MOVE_PADS),
        actions: actions.slice(0, MOVE_PADS),
      };
    });
}

/**
 * The pad grid's four rows, top to bottom, exactly as the hardware stacks
 * them — screen row 0 is the row nearest the knobs.
 *
 * Plain: y=3 is the dial-slot indicator (the dials draw it, so it is not a
 * row here), y=2 the switches, y=1 the value chips, y=0 the ALT pad. An app
 * that claims both bottom rows takes y=1 and y=0, and the chips move up above
 * the switches — the same shuffle the surface makes, so a dial column keeps
 * its chip AND its switch underneath it (see PROTOCOL.md).
 *
 * Hand-placed action pads take the row under the values. A single-row claim
 * is the bottom row alone, so the actions keep theirs; a two-row claim takes
 * both bottom rows, and the actions have nowhere left to sit.
 */
export function movePadRows(page: MovePage, claimedRows: number): ControlMeta[][] {
  if (claimedRows >= 2) return [page.values, page.toggles, [], []];
  return [page.toggles, page.values, page.actions, []];
}

/**
 * Which claimed hardware row a screen row shows, or null when it is a control
 * row. Two claimed rows fill screen rows 2 and 3 (y=1 then y=0); one claimed
 * row is the bottom row alone, and lands on screen row 3 — below the action
 * pads, exactly where the hardware puts it.
 */
export function moveAppPadRow(row: number, claimedRows: number): 0 | 1 | null {
  if (claimedRows >= 2) return row === 2 ? 1 : row === 3 ? 0 : null;
  return claimedRows === 1 && row === 3 ? 0 : null;
}

/**
 * The columns the on-screen panel actually shows: a column is occupied when
 * it has a dial, a toggle chip, or a value chip at that index. The indices
 * stay the hardware knob numbers — callers hide the unoccupied columns,
 * never renumber them, so the latch/substitution logic and the physical
 * knobs keep agreeing on what column i means.
 */
export function visibleColumns(page: MovePage): number[] {
  const cols: number[] = [];
  for (let i = 0; i < MOVE_DIALS; i++) {
    if (page.dials[i] || page.toggles[i] || page.values[i] || page.actions[i]) cols.push(i);
  }
  return cols;
}

/** Dial position 0..1 back to the control's real value, kit-identical. */
export function denormalizeDial(meta: ControlMeta, v01: number): number {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  let v = min + Math.min(1, Math.max(0, v01)) * (max - min);
  if (meta.step) v = Math.round(v / meta.step) * meta.step;
  return Number(v.toFixed(6));
}

/** Dial position 0..1, the same normalization the kit puts on the wire. */
export function normalizeDial(meta: ControlMeta, value: unknown): number {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  const v = (Number(value) - min) / (max - min || 1);
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
}

const norm01 = (v: unknown, min: number, max: number) => {
  const n = (Number(v) - min) / (max - min || 1);
  return Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));
};

const denorm01 = (v01: number, min: number, max: number, step: number) => {
  let v = min + Math.min(1, Math.max(0, v01)) * (max - min);
  if (step) v = Math.round(v / step) * step;
  return Number(v.toFixed(6));
};

/** An xy pad's position, each axis 0..1 — the two numbers on the wire. */
export function normalizeXYDial(meta: ControlMeta, value: unknown): { x: number; y: number } {
  const xAxis = resolveAxis(meta.xAxis);
  const yAxis = resolveAxis(meta.yAxis);
  const v = (value ?? {}) as Partial<XYValue>;
  return { x: norm01(v.x, xAxis.min, xAxis.max), y: norm01(v.y, yAxis.min, yAxis.max) };
}

/** Enum dial helpers — options may be strings or { value, label, icon }. */
export const enumOptionValue = (o: string | { value: string; label?: string }) =>
  typeof o === 'string' ? o : o.value;
export const enumOptionLabel = (o: string | { value: string; label?: string }) =>
  typeof o === 'string' ? o : (o.label ?? o.value);
/** The option's glyph name, or null — a bare string option never has one. */
export const enumOptionIcon = (o: string | { icon?: string }): string | null =>
  typeof o === 'string' ? null : (o.icon ?? null);

/** Enough points to read a bell or a bounce at slot width, and no more. */
export const ENUM_SHAPE_SAMPLES = 64;

/**
 * The shape an enum option stands for, as an SVG path filling a 100×100 box
 * with y pointing up — or null when the select declares no `preview`, or that
 * option has no shape. Fitted through the curve row's own core, so a bipolar
 * arc and a 0..1 envelope both fill the box edge to edge.
 *
 * Lives here rather than in the panel so the "what does this slot draw"
 * question has one answer both surfaces can be tested against.
 */
export function enumShapePath(meta: ControlMeta, value: unknown): string | null {
  if (!meta.preview) return null;
  let sample: ((t: number) => number) | null | undefined;
  try {
    sample = meta.preview(String(value ?? ''));
  } catch {
    return null;                      /* a throwing preview draws nothing */
  }
  if (typeof sample !== 'function') return null;
  const segments = plotCurve(sample, { count: ENUM_SHAPE_SAMPLES }).segments;

  // The curve row fits with headroom so a thick stroke never clips at the
  // edge of a tall surface. A slot is not tall, and that headroom reads as a
  // gap the layout did not ask for — so the ink is re-fitted to fill the box
  // and the CSS band alone decides how much air the drawing gets.
  let lo = Infinity;
  let hi = -Infinity;
  for (const seg of segments) {
    for (const pt of seg) {
      if (pt.v < lo) lo = pt.v;
      if (pt.v > hi) hi = pt.v;
    }
  }
  if (lo > hi) return null;                        /* nothing was plotted */
  const span = hi - lo;
  const fill = (v: number) => (span > 0 ? (v - lo) / span : 0.5);

  const d = segments
    .map((seg) =>
      seg
        .map((pt, i) =>
          `${i ? 'L' : 'M'} ${(pt.t * 100).toFixed(2)} ${((1 - fill(pt.v)) * 100).toFixed(2)}`)
        .join(' '))
    .join(' ');
  return d || null;
}
export function enumIndex(meta: ControlMeta, value: unknown): number {
  const i = (meta.options ?? []).findIndex((o) => enumOptionValue(o as never) === value);
  return Math.max(0, i);
}

/** A range dial's two ends, each 0..1 — the two numbers on the wire. */
export function normalizeRangeDial(meta: ControlMeta, value: unknown): { lo: number; hi: number } {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  const v = (value ?? {}) as Partial<RangeValue>;
  return { lo: norm01(v.min, min, max), hi: norm01(v.max, min, max) };
}

/** End positions 0..1 back to the control's real {min, max}, kit-identical —
 *  clamped into the bounds and ordered, so crossed ends never come back reversed. */
export function denormalizeRangeDial(meta: ControlMeta, lo01: number, hi01: number): RangeValue {
  const min = meta.min ?? 0;
  const max = meta.max ?? 1;
  const step = meta.step ?? 0;
  return clampRange(
    { min: denorm01(lo01, min, max, step), max: denorm01(hi01, min, max, step) },
    min,
    max
  );
}

/** An enum dial's position 0..1 — the option's index over the last index.
 *  An unknown (or missing) value reads as the first option, position 0. */
export function normalizeEnumDial(meta: ControlMeta, value: unknown): number {
  const opts = (meta.options ?? []).map((o) => enumOptionValue(o as never));
  if (opts.length < 2) return 0;
  const i = opts.indexOf(String(value));
  return i <= 0 ? 0 : i / (opts.length - 1);
}

/** Dial position 0..1 back to the option at that step, kit-identical:
 *  round(v01 * (count-1)), clamped into the options list. */
export function denormalizeEnumDial(meta: ControlMeta, v01: number): string {
  const opts = (meta.options ?? []).map((o) => enumOptionValue(o as never));
  if (opts.length === 0) return '';
  const i = Math.round(Math.min(1, Math.max(0, v01)) * (opts.length - 1));
  return opts[i];
}

/** A filter dial's two hands, each 0..1 — the two numbers on the wire.
 *  The left column's knob is cutoff, the right column's is resonance. */
export function normalizeFilterDial(meta: ControlMeta, value: unknown): { cutoff: number; resonance: number } {
  const ca = resolveFilterAxis(meta.cutoffAxis, 'cutoff');
  const ra = resolveFilterAxis(meta.resonanceAxis, 'resonance');
  const v = normalizeFilterValue(value, ca, ra);
  return { cutoff: filterHand01(v.cutoff, ca), resonance: filterHand01(v.resonance, ra) };
}

/** Hand positions 0..1 back to the control's real pair, kit-identical. */
export function denormalizeFilterDial(meta: ControlMeta, cutoff01: number, resonance01: number): FilterValue {
  const ca = resolveFilterAxis(meta.cutoffAxis, 'cutoff');
  const ra = resolveFilterAxis(meta.resonanceAxis, 'resonance');
  return { cutoff: filterHandValue(cutoff01, ca), resonance: filterHandValue(resonance01, ra) };
}

/**
 * The 2-slot picture: the filter's magnitude response as an SVG path filling
 * a 100×100 box, y pointing up — through the app's own `response` when the
 * config brought one, else the kit's lowpass. One answer both surfaces can
 * be tested against, like `enumShapePath`.
 */
export function filterShapePath(meta: ControlMeta, value: unknown): string | null {
  const pos = normalizeFilterDial(meta, value);
  let response: ((t: number) => number) | null | undefined;
  try {
    response = (meta.response ?? defaultFilterResponse)(pos.cutoff, pos.resonance);
  } catch {
    return null;                      /* a throwing response draws nothing */
  }
  if (typeof response !== 'function') return null;
  return filterResponsePath(response);
}

/** Where the fill anchors for a bipolar/origin slider, 0..1 (else 0). */
export function dialOrigin(meta: ControlMeta): number {
  const origin = meta.origin ?? (meta.bipolar ? 0 : undefined);
  return origin === undefined ? 0 : normalizeDial(meta, origin);
}

/** Axis positions 0..1 back to the control's real {x, y}, kit-identical. */
export function denormalizeXYDial(meta: ControlMeta, x01: number, y01: number): XYValue {
  const xAxis = resolveAxis(meta.xAxis);
  const yAxis = resolveAxis(meta.yAxis);
  return {
    x: denorm01(x01, xAxis.min, xAxis.max, xAxis.step),
    y: denorm01(y01, yAxis.min, yAxis.max, yAxis.step),
  };
}
