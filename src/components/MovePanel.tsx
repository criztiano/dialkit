import { useEffect, useRef, useState, useSyncExternalStore, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TweakStore, PanelConfig, ControlMeta } from '../store/TweakStore';
import { ModulationStore } from '../store/ModulationStore';
import { modColor, curveComposition, envelopePoints, envelopeJoints, envCurveParam, ENV_BEND_STAGES, modPageWidth, MOD_SETTINGS_PANEL, type EnvStage, type ModulationSlot, type ModulationParams } from '../modulation-core';
import { CurveComposer } from './CurveComposer';
import type { CurveSegment } from '../curve-composer-core';
import { isDevDefault } from '../env';
import type { TweakTheme } from './TweakRoot';
import { buildMovePages, buildModMovePage, visibleColumns, movePadRows, moveAppPadRow, normalizeDial, denormalizeDial, normalizeRangeDial, denormalizeRangeDial, denormalizeEnumDial, normalizeFilterDial, denormalizeFilterDial, filterShapePath, dialOrigin, isEnumDial, isSpanContinuation, enumOptionLabel, enumOptionIcon, enumShapePath, enumIndex, MOVE_DIALS, MOVE_PADS } from '../move-layout';
import { resolveFilterAxis, normalizeFilterValue } from '../filter-core';
import { MoveSlotXYBody, MoveSlotDefaultBody, MoveSlotEnumBody, MoveSlotRangeBody, MoveSlotFilterBody, MoveSlotNumericBody, MoveSlotEnvBody, MoveSlotScopeBody, MoveSlotToggleBody, MoveSlotTransferBody, MoveSlotRampBody, MoveSlotDialBody } from './move-slots';
import { normalizeGradient, rampCss } from '../gradient-core';
import { valueToBearing, angleFromPointer } from '../angle-core';
import { normalizeTransfer, movePoint, nearestPoint, sampleTransfer, type TransferValue } from '../transfer-core';
import { moveNumericDrawing, movePlaybackMode, moveVisualReading, moveKeyboardValue } from '../move-visual-core';
import { ModRing } from './ModRing';
import { MoveSurfaceStore, type MovePadCell } from '../move-surface-store';
import { resolveAxis, valueFromPoint, pointFromValue, normalizeValue, centerValue, applyDetentAxis, type XYValue } from '../xy-pad-core';
import { nearestHandle, type RangeValue } from '../range-slider-core';
import { fineDragValue } from '../shortcut-utils';
import { MoveVolumeDisplay, type MoveVolumeDisplayState } from '../move-volume';

interface MovePanelProps {
  theme?: TweakTheme;
  productionEnabled?: boolean;
  /** Mirror only the named panels, in the order given — same option the bridge kit takes. */
  panels?: string | string[];
  /**
   * Where the panel sits. `viewport` (the default) portals it to `<body>` and
   * pins it to the window's bottom edge — for apps whose content fills the
   * screen. `flow` renders it inline, in normal document flow, wherever the
   * host puts it — for sparse apps that want the content and the panel to
   * read as one group instead of leaving a dead gap between them.
   */
  dock?: 'viewport' | 'flow';
}

/** The Move's four track colours, in track order (Figma node 802:321). */
export const MOVE_TRACK_COLORS = ['#4274f4', '#d83dff', '#ff4d07', '#52bd06'];

/** The on-screen pad grid mirrors the Move grid's 4 rows (Figma 802:319);
 *  columns follow the occupied set, never the full 8. */
const PAD_ROWS = 4;

/** The slider track's inset from the dial slot's edges (Figma 802:767). */
const DIAL_TRACK_INSET = 10;
/** The xy field's inset within its slot — must match .tweakers-move-xy. */
const XY_INSET = { left: 8, top: 8, right: 9, bottom: 8 };

/** Default grid when an xy control leaves `grid` on — the XYPad's 5×5. */
const XY_GRID_DEFAULT = 5;

/** Press shorter than this is a tap (latch); longer is a hold (peek). */
const TAP_MS = 300;

/**
 * A readout string with any `:` separators pulled out and rendered bold at
 * 14px — a `0:00:00` time reads as digit groups, not a colon soup. Strings
 * without colons pass through untouched.
 */
function boldColons(text: string) {
  if (!text.includes(':')) return text;
  return text.split(':').flatMap((part, i) =>
    i === 0 ? [part] : [<span key={`sep-${i}`} className="tweakers-move-volume-sep">:</span>, part]
  );
}

/**
 * A wired control's ring, on this surface: the dock panel's own ring — slot
 * colour, live arc — placed in a dial slot's corner, or inline on a pad chip.
 * Module scope, not a closure inside the panel: the arc subscribes per frame,
 * and a component re-declared on every render would tear that down and build
 * it again on every value the panel draws.
 */
function MoveModRing({ panelId, path, pad }: { panelId: string; path: string; pad?: boolean }) {
  const assignment = ModulationStore.getAssignment(panelId, path);
  if (!assignment || !ModulationStore.getSlot(assignment.slot)) return null;
  return (
    <ModRing
      panelId={panelId}
      path={path}
      assignment={assignment}
      className={pad ? 'tweakers-move-pad-mod' : 'tweakers-move-dial-mod'}
    />
  );
}

/**
 * The bridge kit's window events, keyed by control path:
 * - touch (in): `{ pageId, touched }` — a finger on a physical knob.
 * - override (in): `{ pageId, held, latched }` — hardware value-pad holds
 *   and latches, so the screen mirrors them.
 * - latch (out): `{ pageId, path, latched }` — a screen tap latching or
 *   releasing a value chip, for the kit to relay to the hardware.
 */
export const MOVE_TOUCH_EVENT = 'move-tweakers:touch';
export const MOVE_OVERRIDE_EVENT = 'move-tweakers:override';
export const MOVE_LATCH_EVENT = 'move-tweakers:latch';
/** In: `{ pageId }` — the page the hardware is showing; the panel follows. */
export const MOVE_PAGE_EVENT = 'move-tweakers:page';
/** Out: `{ pageId }` — a screen track tap, for the kit to switch the hardware. */
export const MOVE_PAGE_SELECT_EVENT = 'move-tweakers:page-select';

/**
 * The Move's control surface, laid out to Cri's Figma spec (file
 * USU9CW2vC3SrvKsnHVnYGi, node 802:319; slot components 802:756 and
 * 800:1737): a track row of coloured markers — one per page, so an app
 * with a single panel gets a single tick and name — 8 dial slots hosting
 * slider ports, and the pad grid — toggle chips on the first row, value
 * chips on the second, at the same columns as their hardware pads
 * (move-layout keeps both surfaces in agreement).
 *
 * `dock` decides where it lives: `viewport` portals it to `<body>` and pins
 * it to the window's bottom edge; `flow` leaves it inline where the host
 * placed it. Both wear the same surface, padding and slot geometry.
 *
 * Only occupied slots/columns are shown: a column renders when it holds a
 * dial, a toggle chip, or a value chip, at its full 8-wide slot size; the
 * visible cluster centres in the panel and the header row shares its width,
 * so the page name lines up with the first visible slot. Hidden columns
 * are skipped, never renumbered — column i is still hardware knob i.
 *
 * Value chips substitute the dial in their column: hold one to peek at
 * its value in the dial slot, tap to latch it in — the chip inverts and
 * pulses until tapped again. The same gestures on the physical pads
 * arrive through the kit's override event and read identically here.
 *
 * An xy control takes a dial slot as a 2D pad: the field draws behind the
 * label (no slider at the bottom) with crosshair lines meeting at the dot.
 * Dragging the slot sets both axes; on the hardware the column's knob
 * turns X, and the volume knob turns Y while that knob is touched.
 *
 * A range control takes a dial slot too: the bar fills between two handle
 * ticks, and a drag grabs the nearest handle. On the hardware the column's
 * knob edits the low handle and the volume knob edits the high one while
 * that knob is touched — the xy pad's two-handed concept on one axis.
 * Bipolar/origin sliders anchor their fill at the origin mark.
 *
 * A select with options takes a dial slot as a stepped enum dial: the bar
 * splits into one cell per option, the active cell filled, and the readout
 * shows the option's label. A drag picks the nearest cell.
 *
 * Holding Shift mid-drag switches any slot to fine mode: pointer travel
 * applies at 0.1× relative to where shift went down, and releasing shift
 * rebases at 1× so the value never jumps.
 *
 * Controls wired to a modulation slot wear the dock panel's own modulation
 * ring — the slot's colour, and an arc running from the control's value to
 * where the modulation is holding it — in the slot's corner, and
 * the track row carries one circle per slot — the on-screen step button.
 */
export function MovePanel({ theme = 'system', productionEnabled = isDevDefault, panels: only, dock = 'viewport' }: MovePanelProps) {
  if (!productionEnabled) return null;
  const [panels, setPanels] = useState<PanelConfig[]>([]);
  const [track, setTrack] = useState(0);
  const [dragPath, setDragPath] = useState<string | null>(null);
  // A held bend pad: while down, its vertical drag bends the ramp above it
  // — the envelope's hold-to-curve gesture. The ref anchors the drag.
  const [bendHeld, setBendHeld] = useState<EnvStage | null>(null);
  const bendRef = useRef<{ y: number; curve: number } | null>(null);
  // Hardware presence, by control path — from the bridge kit's window events.
  const [handTouch, setHandTouch] = useState<Record<string, boolean>>({});
  // Which point of a transfer curve each knob is holding. One knob shapes a
  // whole curve, so the slot has to carry the choice; a knob tap (or a click
  // near another point) moves it on.
  const [curvePoint, setCurvePoint] = useState<Record<string, number>>({});
  // …and which stop of a ramp. Same idea: one knob, a list of things. */
  const [rampStop, setRampStop] = useState<Record<string, number>>({});
  const [hwHeld, setHwHeld] = useState<Record<string, boolean>>({});
  const [hwLatched, setHwLatched] = useState<Record<string, boolean>>({});
  // Screen-side value-chip substitution: a held chip peeks, a tapped chip latches.
  const [held, setHeld] = useState<{ col: number; meta: ControlMeta } | null>(null);
  const [latched, setLatched] = useState<Record<number, ControlMeta | undefined>>({});
  const holdStart = useRef(0);
  const [mounted, setMounted] = useState(false);
  // Shift mid-drag = fine mode: pointer travel applies at 0.1× relative to the
  // value snapshot where shift went down; releasing shift rebases at 1× so the
  // value never jumps back to the cursor's absolute position.
  const fineRef = useRef<{ shift: boolean; x: number; y: number; v: unknown } | null>(null);
  // Which range handle a gesture grabbed — locked at pointer-down.
  const rangeHandleRef = useRef<'min' | 'max'>('min');
  // Which filter hand a gesture grabbed (left half = cutoff, right half =
  // resonance) — locked at pointer-down, like the range handle.
  const filterHandRef = useRef<'cutoff' | 'resonance'>('cutoff');

  // Volume-dial readout: a static value renders as set; a getValue is polled
  // per animation frame while mounted, for readouts that move (a playhead).
  const [volume, setVolume] = useState<MoveVolumeDisplayState | null>(() => MoveVolumeDisplay.get());
  const [liveValue, setLiveValue] = useState<string | null>(null);
  useEffect(() => {
    setVolume(MoveVolumeDisplay.get());
    return MoveVolumeDisplay.subscribe(() => setVolume(MoveVolumeDisplay.get()));
  }, []);
  useEffect(() => {
    const poll = volume?.getValue;
    if (!poll) {
      setLiveValue(null);
      return;
    }
    let raf = requestAnimationFrame(function tick() {
      setLiveValue(poll());
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [volume]);

  const onlyKey = Array.isArray(only) ? only.join(' ') : only;
  const read = useCallback(
    () => TweakStore.selectPanels(onlyKey === undefined ? undefined : onlyKey.split(' ')),
    [onlyKey]
  );

  useEffect(() => {
    setMounted(true);
    setPanels(read());
    return TweakStore.subscribeGlobal(() => setPanels(read()));
  }, [read]);

  const pages = buildMovePages(panels);
  // An open modulator-settings page takes the surface over; the track
  // buttons put a regular page back (and close the settings with it).
  const modSettings = ModulationStore.getSettings();
  const settingsPanel = modSettings ? TweakStore.getPanel(modSettings.panelId) : undefined;
  const modLayout = settingsPanel ? ModulationStore.getSettingsLayout() : null;
  const page = settingsPanel
    ? buildModMovePage(settingsPanel, modLayout)
    : pages[Math.min(track, Math.max(0, pages.length - 1))];
  const pageId = page?.panel.id;

  // A curve modulator's page brings its composition with it: the composer
  // floats above the panel, and its selected clip is what the shape dials
  // are editing — the dial that draws the preview shows that same clip.
  const modSlot = modSettings ? ModulationStore.getSlot(modSettings.index) : null;
  const composition = modSlot?.type === 'curve' ? curveComposition(modSlot.params) : null;
  const clipIndex = composition
    ? Math.min(composition.segments.length - 1, Math.max(0, Math.round(Number(modSlot!.params.selected) || 0)))
    : 0;
  const previewPath = modLayout?.dials.find((d) => d.preview)?.path ?? null;

  // Subscribe to the active page's value changes (per-panel channel only).
  const values = useSyncExternalStore(
    useCallback((cb) => (pageId ? TweakStore.subscribe(pageId, cb) : () => {}), [pageId]),
    () => (pageId ? TweakStore.getValues(pageId) : undefined),
    () => undefined
  );

  // Presentation repoints — a curve sampler, a select's preview, the
  // filter's response — land on the control-state channel after the host's
  // own render, one beat behind the value change that caused them. The
  // inline rows subscribe there; the Move surface must too, or a type
  // switch keeps drawing the shape it had before the switch, forever.
  const [, bumpControlState] = useState(0);
  useEffect(
    () => (pageId ? TweakStore.subscribeControlState(pageId, () => bumpControlState((n) => n + 1)) : undefined),
    [pageId]
  );

  // Modulation structure (slots, assignments) — the circles and the dots.
  useSyncExternalStore(
    useCallback((cb) => ModulationStore.subscribe(cb), []),
    () => ModulationStore.getVersion(),
    () => 0
  );

  // The raw hardware an app claimed for itself: the bottom pad rows, the step
  // buttons, the device screen. Empty unless a host fills it in.
  const surface = useSyncExternalStore(
    useCallback((cb) => MoveSurfaceStore.subscribe(cb), []),
    () => MoveSurfaceStore.getState(),
    () => MoveSurfaceStore.getState()
  );

  // Hardware presence: a finger on a knob, a held or latched value pad.
  useEffect(() => {
    const forPage = (detail: { pageId?: string } | undefined, map: unknown) =>
      detail && detail.pageId === pageId ? (map as Record<string, boolean>) ?? {} : {};
    const onTouch = (e: Event) => {
      const d = (e as CustomEvent).detail;
      setHandTouch(forPage(d, d?.touched));
    };
    const onOverride = (e: Event) => {
      const d = (e as CustomEvent).detail;
      setHwHeld(forPage(d, d?.held));
      setHwLatched(forPage(d, d?.latched));
    };
    window.addEventListener(MOVE_TOUCH_EVENT, onTouch);
    window.addEventListener(MOVE_OVERRIDE_EVENT, onOverride);
    return () => {
      window.removeEventListener(MOVE_TOUCH_EVENT, onTouch);
      window.removeEventListener(MOVE_OVERRIDE_EVENT, onOverride);
    };
  }, [pageId]);

  // Hardware page switches steer the panel: the surfaces show one page.
  // A settings page counts only after it has actually shown — page events
  // stream continuously, so the old page's frames must not close a
  // just-opened settings view before the hardware gets there.
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const sawSettings = useRef(false);
  useEffect(() => {
    const onPage = (e: Event) => {
      const id = (e as CustomEvent).detail?.pageId;
      if (id === MOD_SETTINGS_PANEL) {
        sawSettings.current = true;
        return;
      }
      if (sawSettings.current) {
        sawSettings.current = false;
        ModulationStore.closeSettings();
      }
      const i = pagesRef.current.findIndex((pg) => pg.panel.id === id);
      if (i >= 0) setTrack(i);
    };
    window.addEventListener(MOVE_PAGE_EVENT, onPage);
    return () => window.removeEventListener(MOVE_PAGE_EVENT, onPage);
  }, []);

  // Substitutions belong to their page — switching tracks releases them.
  useEffect(() => {
    setHeld(null);
    setLatched({});
  }, [pageId]);

  if (!mounted || typeof window === 'undefined' || pages.length === 0 || !page || !values) return null;

  // The readout is the dial's position, 0–100 — the same normalized number
  // the Move itself works in.
  const dialPercent = (meta: ControlMeta) =>
    Math.round(normalizeDial(meta, values[meta.path]) * 100);

  // The value chip shows the real value: number in bold, unit trailing —
  // or, for a chip that picks between options, the option it is on.
  const chipValue = (meta: ControlMeta): { num: string; unit?: string } => {
    if (isEnumDial(meta)) {
      const options = meta.options ?? [];
      return { num: String(enumOptionLabel(options[enumIndex(meta, values[meta.path])] as never)) };
    }
    const n = Number(values[meta.path]);
    if (!Number.isFinite(n)) return { num: '' };
    if (meta.formatValue) return { num: meta.formatValue(n) };
    const num = Math.abs(n) >= 100 ? Math.round(n).toString() : Number(n.toFixed(2)).toString();
    return { num, unit: meta.unit };
  };

  // Rebase the fine anchor on every shift transition: press mid-drag snapshots
  // the value and pointer there; release snapshots again so tracking continues
  // at 1× from the release point instead of jumping to the cursor.
  const fineAnchor = (e: React.PointerEvent, snapshot: () => unknown) => {
    if (e.shiftKey ? !fineRef.current?.shift : fineRef.current?.shift) {
      fineRef.current = { shift: e.shiftKey, x: e.clientX, y: e.clientY, v: snapshot() };
    }
    return fineRef.current;
  };

  const dialFromKeyboard = (e: React.KeyboardEvent<HTMLElement>, meta: ControlMeta) => {
    if (e.altKey || e.ctrlKey || e.metaKey || TweakStore.isDisabled(page.panel.id, meta.path)) return;
    const next = moveKeyboardValue(meta, values[meta.path], e.key, e.shiftKey);
    if (next === null) return;
    e.preventDefault();
    e.stopPropagation();
    armMod(meta.path);
    TweakStore.updateValue(page.panel.id, meta.path, next);
  };

  // Whole-slot hotspot, position-on-the-track sets the value — the same feel
  // as the library Slider's card.
  const dialFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const span = rect.width - DIAL_TRACK_INSET * 2;
    const fine = fineAnchor(e, () => normalizeDial(meta, values[meta.path]));
    const v01 = fine
      ? fineDragValue({ startValue: fine.v as number, startPos: fine.x, pos: e.clientX, extentPx: span || 1, min: 0, max: 1, factor: fine.shift ? 0.1 : 1 })
      : Math.min(1, Math.max(0, (e.clientX - rect.left - DIAL_TRACK_INSET) / (span || 1)));
    TweakStore.updateValue(page.panel.id, meta.path, denormalizeDial(meta, v01));
  };

  // An xy slot maps the pointer through the same core as the library XYPad:
  // value mapping, snap-to-grid, and the escapable centre detent all included.
  // Fine mode only changes how the point is read off the pointer — the core
  // still maps it — so shift creeps at 0.1× on both axes.
  const xyFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width - XY_INSET.left - XY_INSET.right;
    const h = rect.height - XY_INSET.top - XY_INSET.bottom;
    const xa = resolveAxis(meta.xAxis);
    const ya = resolveAxis(meta.yAxis);
    const fine = fineAnchor(e, () =>
      pointFromValue(normalizeValue(values[meta.path] as Partial<XYValue>, xa, ya), xa, ya)
    );
    let px: number, py: number;
    if (fine) {
      const a = fine.v as { x: number; y: number };
      const factor = fine.shift ? 0.1 : 1;
      px = fineDragValue({ startValue: a.x, startPos: fine.x, pos: e.clientX, extentPx: w || 1, min: 0, max: 1, factor });
      py = fineDragValue({ startValue: a.y, startPos: fine.y, pos: e.clientY, extentPx: h || 1, min: 0, max: 1, factor });
    } else {
      px = Math.min(1, Math.max(0, (e.clientX - rect.left - XY_INSET.left) / (w || 1)));
      py = Math.min(1, Math.max(0, (e.clientY - rect.top - XY_INSET.top) / (h || 1)));
    }
    const raw = valueFromPoint({ x: px, y: py }, xa, ya, !!meta.snap);
    const origin = pointFromValue(centerValue(xa, ya), xa, ya);
    TweakStore.updateValue(page.panel.id, meta.path, {
      x: applyDetentAxis(raw.x, xa, Math.abs(px - origin.x) * (w || 1)),
      y: applyDetentAxis(raw.y, ya, Math.abs(py - origin.y) * (h || 1)),
    });
  };

  // A transfer slot's pointer picks the nearest point on press and drags it
  // after — the same gesture as the panel's own curve editor, in a slot.
  const transferFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta, down: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width - XY_INSET.left - XY_INSET.right;
    const h = rect.height - XY_INSET.top - XY_INSET.bottom;
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left - XY_INSET.left) / (w || 1)));
    const y = 1 - Math.min(1, Math.max(0, (e.clientY - rect.top - XY_INSET.top) / (h || 1)));
    const points = normalizeTransfer(values[meta.path]).points;
    let index = curvePoint[meta.path] ?? 0;
    if (down) {
      const hit = nearestPoint(points, x, y, 0.18);
      index = hit >= 0 ? hit : index;
      setCurvePoint((prev) => ({ ...prev, [meta.path]: Math.min(index, points.length - 1) }));
    }
    index = Math.min(index, points.length - 1);
    TweakStore.updateValue(page.panel.id, meta.path, { points: movePoint(points, index, x, y) });
  };

  // A needle follows the pointer round, the way the panel's own dial does —
  // dragging a bearing sideways along a track is the gesture a needle exists
  // to replace.
  const needleFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const min = meta.min ?? 0, max = meta.max ?? 1;
    const wraps = meta.wrap ?? Math.abs(max - min) >= 360;
    const next = angleFromPointer(
      e.clientX - (rect.left + rect.width / 2),
      e.clientY - (rect.top + rect.height / 2),
      Number(values[meta.path] ?? min), min, max, meta.step ?? 1, wraps,
    );
    if (next !== null) TweakStore.updateValue(page.panel.id, meta.path, next);
  };

  // A ramp slot's pointer picks the nearest stop on press and slides it after.
  const rampFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta, down: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width - XY_INSET.left - XY_INSET.right;
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left - XY_INSET.left) / (w || 1)));
    const g = normalizeGradient(values[meta.path] as never);
    let index = Math.min(rampStop[meta.path] ?? 0, g.stops.length - 1);
    if (down) {
      let best = 0;
      g.stops.forEach((st, i) => {
        if (Math.abs(st.position - x) < Math.abs(g.stops[best]!.position - x)) best = i;
      });
      index = best;
      setRampStop((prev) => ({ ...prev, [meta.path]: index }));
    }
    // Stops stay in order: dragging one past its neighbour would reorder the
    // ramp under the knob that is holding it.
    const lo = index > 0 ? g.stops[index - 1]!.position : 0;
    const hi = index < g.stops.length - 1 ? g.stops[index + 1]!.position : 1;
    const stops = g.stops.map((st, i) =>
      i === index ? { ...st, position: Math.min(hi, Math.max(lo, x)) } : st);
    TweakStore.updateValue(page.panel.id, meta.path, { ...g, stops });
  };

  // Joystick-style pads rest at their centre when the pointer lets go.
  const xyRelease = (meta: ControlMeta) => {
    setDragPath(null);
    fineRef.current = null;
    if (!meta.returnToCenter) return;
    const xa = resolveAxis(meta.xAxis);
    const ya = resolveAxis(meta.yAxis);
    TweakStore.updateValue(page.panel.id, meta.path, normalizeValue(centerValue(xa, ya), xa, ya, !!meta.snap));
  };

  // A range slot grabs the nearest handle at pointer-down (locked for the
  // gesture) and drags it; the untouched handle pins the other bound so the
  // pair stays ordered, exactly like the RangeSlider's setLow/setHigh.
  const rangeFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta, down: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const span = rect.width - DIAL_TRACK_INSET * 2;
    const cur = normalizeRangeDial(meta, values[meta.path]);
    let p01 = Math.min(1, Math.max(0, (e.clientX - rect.left - DIAL_TRACK_INSET) / (span || 1)));
    if (down) rangeHandleRef.current = nearestHandle(p01, { min: cur.lo, max: cur.hi });
    const fine = fineAnchor(e, () => cur);
    if (fine) {
      const a = fine.v as { lo: number; hi: number };
      p01 = fineDragValue({
        startValue: rangeHandleRef.current === 'min' ? a.lo : a.hi,
        startPos: fine.x,
        pos: e.clientX,
        extentPx: span || 1,
        min: 0,
        max: 1,
        factor: fine.shift ? 0.1 : 1,
      });
    }
    const next = rangeHandleRef.current === 'min'
      ? { lo: Math.min(p01, cur.hi), hi: cur.hi }
      : { lo: cur.lo, hi: Math.max(p01, cur.lo) };
    TweakStore.updateValue(page.panel.id, meta.path, denormalizeRangeDial(meta, next.lo, next.hi));
  };

  // A filter slot is two dials wearing one picture: the half the gesture
  // starts in picks the hand (left = cutoff, right = resonance, locked for
  // the drag), and the pointer's travel across that half turns it. On the
  // hardware the left column's knob is cutoff and the right column's is
  // resonance — two ordinary one-column dials to the bridge.
  const filterFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta, down: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const half = rect.width / 2;
    if (down) filterHandRef.current = e.clientX - rect.left < half ? 'cutoff' : 'resonance';
    const hand = filterHandRef.current;
    const left = hand === 'cutoff' ? rect.left + DIAL_TRACK_INSET : rect.left + half;
    const span = half - DIAL_TRACK_INSET;
    const cur = normalizeFilterDial(meta, values[meta.path]);
    const fine = fineAnchor(e, () => cur);
    let v01: number;
    if (fine) {
      const a = fine.v as { cutoff: number; resonance: number };
      v01 = fineDragValue({
        startValue: hand === 'cutoff' ? a.cutoff : a.resonance,
        startPos: fine.x,
        pos: e.clientX,
        extentPx: span || 1,
        min: 0,
        max: 1,
        factor: fine.shift ? 0.1 : 1,
      });
    } else {
      v01 = Math.min(1, Math.max(0, (e.clientX - left) / (span || 1)));
    }
    const next = hand === 'cutoff'
      ? denormalizeFilterDial(meta, v01, cur.resonance)
      : denormalizeFilterDial(meta, cur.cutoff, v01);
    TweakStore.updateValue(page.panel.id, meta.path, next);
  };

  // An enum slot steps between the options: the pointer's position on the
  // track maps to 0..1, and denormalizeEnumDial snaps it to the nearest option.
  const enumFromPointer = (e: React.PointerEvent<HTMLElement>, meta: ControlMeta) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const span = rect.width - DIAL_TRACK_INSET * 2;
    const v01 = Math.min(1, Math.max(0, (e.clientX - rect.left - DIAL_TRACK_INSET) / (span || 1)));
    TweakStore.updateValue(page.panel.id, meta.path, denormalizeEnumDial(meta, v01));
  };


  // A bipolar (origin-anchored) dial reads out its real signed value; plain
  // dials keep the 0–100 position the Move itself works in.
  const dialReading = (meta: ControlMeta): string => {
    if (dialOrigin(meta) <= 0) return `${dialPercent(meta)}%`;
    const n = Number(values[meta.path]);
    if (!Number.isFinite(n)) return '';
    if (meta.formatValue) return meta.formatValue(n);
    const num = Math.abs(n) >= 100 ? Math.round(n).toString() : Number(n.toFixed(2)).toString();
    return n > 0 ? `+${num}` : num;
  };

  // A range slot reads out `lo–hi`, each bound formatted like a value chip.
  const rangeReading = (meta: ControlMeta): string => {
    const v = (values[meta.path] ?? {}) as Partial<RangeValue>;
    const fmt = (n: number | undefined): string => {
      if (n == null || !Number.isFinite(n)) return '';
      if (meta.formatValue) return meta.formatValue(n);
      return Math.abs(n) >= 100 ? Math.round(n).toString() : Number(n.toFixed(2)).toString();
    };
    return `${fmt(v.min)}–${fmt(v.max)}`;
  };

  const chipLatched = (col: number, meta: ControlMeta) =>
    latched[col]?.path === meta.path || !!hwLatched[meta.path];

  // Touching a control arms it for the assignment gesture (step press).
  const armMod = (path: string) => ModulationStore.noteTouch(page.panel.id, path);

  // What a dial column actually edits: a held chip wins (screen or pad),
  // then a latched one, then the column's own dial.
  const dialAt = (col: number): ControlMeta | undefined => {
    if (held && held.col === col) return held.meta;
    const hw = page.values[col];
    if (hw && hwHeld[hw.path]) return hw;
    if (latched[col]) return latched[col];
    if (hw && hwLatched[hw.path]) return hw;
    return page.dials[col];
  };

  const pressChip = (e: React.PointerEvent<HTMLElement>, col: number, meta: ControlMeta) => {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
    holdStart.current = Date.now();
    armMod(meta.path);
    setHeld({ col, meta });
  };

  const releaseChip = (col: number, meta: ControlMeta) => {
    setHeld(null);
    if (Date.now() - holdStart.current >= TAP_MS) return;
    const wasLatched = chipLatched(col, meta);
    setLatched((prev) => ({ ...prev, [col]: wasLatched ? undefined : meta }));
    // Tell the hardware side; the kit relays it when the bridge is up.
    window.dispatchEvent(new CustomEvent(MOVE_LATCH_EVENT, {
      detail: { pageId: page.panel.id, path: meta.path, latched: !wasLatched },
    }));
  };

  // An app that claimed the bottom pad rows takes them over — movePadRows
  // shuffles the control rows around the claim, exactly as the hardware does.
  const appRows = surface.rows;
  const padRows = movePadRows(page, appRows);
  const appRowAt = (row: number) => moveAppPadRow(row, appRows);
  const padAt = (x: number, y: 0 | 1): MovePadCell | undefined =>
    surface.pads.find((p) => p.x === x && p.y === y);

  // Only occupied columns render — a column with a dial, a toggle chip, or a
  // value chip at its index. Indices stay the hardware knob numbers (hidden
  // columns are skipped, never renumbered), the visible cluster centres in
  // the panel, and each slot keeps the exact 8-wide grid's slot size. An
  // empty page shows the header alone.
  // With app rows claimed the app owns whole hardware rows, so all 8 columns
  // stay on screen — its pads sit at real hardware coordinates.
  // Every settings page renders at the widest type's width: switching the
  // type must never reflow the page — the Type dial under your finger, and
  // everything else, stays exactly where it was.
  const visibleCols = settingsPanel
    ? Array.from({ length: modPageWidth() }, (_, i) => i)
    : appRows > 0
      ? Array.from({ length: MOVE_PADS }, (_, i) => i)
      : visibleColumns(page);

  // The header cluster: the volume-dial readout, right-aligned. (Action
  // buttons live in the views now — see MoveActionButton.) Nothing
  // registered = no cluster, header unchanged.
  const volumeReading = liveValue ?? volume?.value;
  const headerCluster = volume && (
    <div className="tweakers-move-actions">
      <div className="tweakers-move-volume">
        <span className="tweakers-move-volume-tick" style={{ background: MOVE_TRACK_COLORS[0] }} />
        {volume.label && volumeReading != null && (
          <span className="tweakers-move-volume-label">{volume.label}</span>
        )}
        <span className="tweakers-move-volume-value">{boldColons(volumeReading ?? volume.label ?? '')}</span>
      </div>
    </div>
  );

  const content = (
    <div className="tweakers-root tweakers-move-root" data-theme={theme} data-dock={dock}>
      {/* While a composer floats above it the whole instrument comes forward,
          over the app's own panels — you are working in it. */}
      <div className="tweakers-move" data-dock={dock} data-overlay={composition ? true : undefined}>
        {composition && modSettings && (
          <MoveCurveComposer
            index={modSettings.index}
            segments={composition.segments}
            direction={composition.direction}
            gap={composition.gap ?? 0}
            selected={clipIndex}
          />
        )}
        <div className="tweakers-move-inner" style={{ '--move-cols': visibleCols.length || MOVE_DIALS } as React.CSSProperties}>
          {/* Only tracks that carry a page render — a bare coloured marker with
              no name says nothing. The index is still the real track index, so
              the colour never shifts with the visible position. */}
          <div className="tweakers-move-tracks">
            <div className="tweakers-move-tracks-group">
              {pages.map((pg, i) => (
                <button
                  key={pg.panel.id}
                  className="tweakers-move-track"
                  data-active={pg === page}
                  onClick={() => {
                    ModulationStore.closeSettings();
                    setTrack(i);
                    // Tell the hardware side; the kit relays it when the bridge is up.
                    window.dispatchEvent(new CustomEvent(MOVE_PAGE_SELECT_EVENT, { detail: { pageId: pg.panel.id } }));
                  }}
                >
                  <span className="tweakers-move-track-marker" style={{ background: MOVE_TRACK_COLORS[i] }} />
                  <span className="tweakers-move-track-label">{pg.panel.name}</span>
                </button>
              ))}
            </div>
            {/* The step buttons, centred between the track labels and the
                volume readout — one circle each. Normally the modulation
                slots; an app that claimed the row paints them itself, and
                its picture wins. */}
            <div className="tweakers-move-mods">
              {surface.steps
                ? surface.steps.map((s) => (
                    <span key={s.step} className="tweakers-move-mod" title={`step ${s.step + 1}`}>
                      <span
                        className="tweakers-move-mod-dot"
                        style={{ background: s.color ?? 'var(--move-text)', opacity: s.lit ? 1 : 0.25 }}
                      />
                    </span>
                  ))
                : ModulationStore.getSlots().map((slot) => (
                    <MoveModCircle key={slot.index} slot={slot} />
                  ))}
            </div>
            {headerCluster}
          </div>

          {visibleCols.length > 0 && <div className="tweakers-move-grid">
            <div className="tweakers-move-dials">
              {visibleCols.map((i) => {
                // A 2-slot dial's second column renders nothing of its own —
                // the base column's slot spans across it. And a 2-slot dial
                // keeps its slot against chip substitution: a chip landing in
                // half a picture would break the span.
                if (isSpanContinuation(page, i)) return null;
                const meta = page.dials[i]?.type === 'filter' ? page.dials[i] : dialAt(i);
                if (!meta) return <div key={`empty-${i}`} className="tweakers-move-dial" data-empty="true" />;
                const disabled = TweakStore.isDisabled(page.panel.id, meta.path);
                const active =
                  dragPath === meta.path ||
                  !!handTouch[meta.path] ||
                  !!hwHeld[meta.path] ||
                  (held !== null && held.col === i);
                // A modulator dial whose value already says what it is — two
                // seconds, three clips, Forward, the clip the curve is on —
                // reads the other way round: the name shrinks to the tag on
                // top and the value takes the slot. Plain 0..1 amounts keep
                // the big name, since "40%" on its own says nothing.
                const valueFirst = !!settingsPanel && !(meta.min === 0 && meta.max === 1);
                // The filter takes two slots as one picture: the magnitude
                // response maximised across both, each hand's small label
                // sitting where its own slot's label would have been.
                if (meta.type === 'filter') {
                  const fv = normalizeFilterValue(
                    values[meta.path],
                    resolveFilterAxis(meta.cutoffAxis, 'cutoff'),
                    resolveFilterAxis(meta.resonanceAxis, 'resonance')
                  );
                  const shape = filterShapePath(meta, values[meta.path]);
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="filter"
                      data-active={active || undefined}
                      data-disabled={meta.filterEnabled === false || undefined}
                      onPointerDown={(e) => {
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        filterFromPointer(e, meta, true);
                      }}
                      onPointerMove={(e) => {
                        if (dragPath === meta.path) filterFromPointer(e, meta, false);
                      }}
                      onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                      onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                    >
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotFilterBody meta={meta} value={fv} shape={shape} />
                    </div>
                  );
                }
                // A ramp fills its slot with the ramp — a list of colours has
                // nothing to say as a number.
                if (meta.type === 'gradient') {
                  const g = normalizeGradient(values[meta.path] as never);
                  const index = Math.min(rampStop[meta.path] ?? 0, g.stops.length - 1);
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="ramp"
                      data-active={active || undefined}
                      onPointerDown={(e) => {
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        rampFromPointer(e, meta, true);
                      }}
                      onPointerMove={(e) => {
                        if (dragPath === meta.path) rampFromPointer(e, meta, false);
                      }}
                      onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                      onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                    >
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotRampBody
                        label={meta.label}
                        value={`${index + 1}/${g.stops.length}`}
                        css={rampCss(g.stops)}
                        stop={g.stops[index]?.position ?? null}
                      />
                    </div>
                  );
                }
                // A bounded value whose two ends are the same place draws a
                // needle: on a bar, 359° and 1° sit as far apart as they can.
                if (meta.type === 'slider' && meta.display === 'dial') {
                  const min = meta.min ?? 0, max = meta.max ?? 1;
                  const v = Number(values[meta.path] ?? min);
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="dial"
                      data-active={active || undefined}
                      onPointerDown={(e) => {
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        needleFromPointer(e, meta);
                      }}
                      onPointerMove={(e) => {
                        if (dragPath === meta.path) needleFromPointer(e, meta);
                      }}
                      onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                      onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                    >
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotDialBody
                        label={meta.label}
                        value={`${Number(v.toFixed(2))}${meta.unit ?? (Math.abs(max - min) >= 180 ? '°' : '')}`}
                        bearing={valueToBearing(v, min, max)}
                        origin={valueToBearing(meta.origin ?? min, min, max)}
                      />
                    </div>
                  );
                }
                // A transfer curve fills its slot with the shape itself: the
                // whole curve drawn, and a dot on the point this knob holds.
                if (meta.type === 'transfer') {
                  const points = normalizeTransfer(values[meta.path] as TransferValue).points;
                  const index = Math.min(curvePoint[meta.path] ?? 0, points.length - 1);
                  const held = points[index]!;
                  const samples = Array.from({ length: 48 }, (_, k) => sampleTransfer(points, k / 47));
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="transfer"
                      data-active={active || undefined}
                      onPointerDown={(e) => {
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        transferFromPointer(e, meta, true);
                      }}
                      onPointerMove={(e) => {
                        if (dragPath === meta.path) transferFromPointer(e, meta, false);
                      }}
                      onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                      onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                    >
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotTransferBody
                        label={meta.label}
                        value={`${index + 1}/${points.length}`}
                        shape={previewPathData(samples)}
                        point={{ x: held.x, y: 1 - held.y }}
                      />
                    </div>
                  );
                }
                // An xy control fills its slot with the pad — the field draws
                // behind the label and there is no slider at the bottom.
                if (meta.type === 'xy') {
                  const xa = resolveAxis(meta.xAxis);
                  const ya = resolveAxis(meta.yAxis);
                  const pos = pointFromValue(
                    normalizeValue(values[meta.path] as Partial<XYValue>, xa, ya),
                    xa, ya
                  );
                  // A preview dial draws what the two axes are shaping —
                  // the curve modulator's selected clip — in place of the
                  // crosshair, and names it where the numbers would sit.
                  const preview = meta.path === previewPath ? ModulationStore.getSettingsPreview() : null;
                  // Grid semantics match the XYPad: on by default (5×5), a
                  // number for N×N, density multiplies, false hides.
                  const gridBase = meta.grid === false ? 0 : typeof meta.grid === 'number' ? meta.grid : XY_GRID_DEFAULT;
                  const gridN = gridBase > 0 ? Math.round(gridBase * Math.max(0, meta.density ?? 1)) : 0;
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="xy"
                      data-preview={preview ? true : undefined}
                      data-sub={valueFirst || undefined}
                      data-active={active || undefined}
                      onPointerDown={(e) => {
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        xyFromPointer(e, meta);
                      }}
                      onPointerMove={(e) => {
                        if (dragPath === meta.path) xyFromPointer(e, meta);
                      }}
                      onPointerUp={() => xyRelease(meta)}
                      onPointerCancel={() => xyRelease(meta)}
                    >
                      {valueFirst && <span className="tweakers-move-dial-sub">{meta.label}</span>}
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotXYBody
                        label={meta.label}
                        value={preview ? preview.label : `${Math.round(pos.x * 100)}·${Math.round((1 - pos.y) * 100)}`}
                        position={pos}
                        gridN={gridN}
                        shape={preview ? previewPathData(preview.points) : null}
                      />
                    </div>
                  );
                }
                // A range control keeps the dial bar but fills BETWEEN two
                // handles; on the hardware the column's knob edits the low
                // handle and the volume knob edits the high one while that
                // knob is touched — the xy pad's two-handed concept, one axis.
                if (meta.type === 'range') {
                  const pos = normalizeRangeDial(meta, values[meta.path]);
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="range"
                      data-active={active || undefined}
                      onPointerDown={(e) => {
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        rangeFromPointer(e, meta, true);
                      }}
                      onPointerMove={(e) => {
                        if (dragPath === meta.path) rangeFromPointer(e, meta, false);
                      }}
                      onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                      onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                    >
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotRangeBody label={meta.label} value={rangeReading(meta)} lo={pos.lo} hi={pos.hi} />
                    </div>
                  );
                }
                // A select with options is a stepped enum dial: the bar splits
                // into one cell per option, the active cell filled, and the
                // slot shows the option — as a picture where there is one, and
                // otherwise as the whole list, lit on the current row. A drag
                // picks the nearest cell; on the hardware the column's knob
                // steps the same way.
                if (isEnumDial(meta)) {
                  const options = meta.options ?? [];
                  const activeIdx = enumIndex(meta, values[meta.path]);
                  const option = options[activeIdx];
                  const optionLabel = enumOptionLabel(option as never);
                  // The option's own shape, drawn in the slot: the picture is
                  // the value, so its name steps back to a tag at the top.
                  const shape = enumShapePath(meta, values[meta.path]);
                  const glyph = enumOptionIcon(option as never);
                  const playback = movePlaybackMode(meta, values[meta.path]);
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="enum"
                      data-visual={playback ? 'playback' : undefined}
                      role="slider"
                      tabIndex={disabled ? -1 : 0}
                      aria-label={meta.label}
                      aria-valuemin={0}
                      aria-valuemax={Math.max(0, options.length - 1)}
                      aria-valuenow={activeIdx}
                      aria-valuetext={optionLabel}
                      aria-orientation="horizontal"
                      aria-disabled={disabled || undefined}
                      data-disabled={disabled || undefined}
                      onKeyDown={(e) => dialFromKeyboard(e, meta)}
                      data-shape={shape ? true : undefined}
                      data-active={active || undefined}
                      onPointerDown={(e) => {
                      if (TweakStore.isDisabled(page.panel.id, meta.path)) return;
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        enumFromPointer(e, meta);
                      }}
                      onPointerMove={(e) => {
                        if (!TweakStore.isDisabled(page.panel.id, meta.path) && dragPath === meta.path) enumFromPointer(e, meta);
                      }}
                      onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                      onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                    >
                      {/* An option slot reads top down: what the knob is on
                          the chip, the picture — curve, glyph or list —
                          between, what it is set to underneath. No crossfade:
                          with the name out of the way there is nothing left
                          for the value to replace. */}
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotEnumBody
                        label={meta.label}
                        optionLabel={optionLabel}
                        options={options}
                        activeIdx={activeIdx}
                        shape={shape}
                        glyph={glyph}
                        playback={playback}
                      />
                    </div>
                  );
                }
                // A big toggle — a switch that earned a whole slot (the
                // envelope's Loop): the pad's language at slot size, the
                // whole slot inverting when it is on.
                if (meta.type === 'toggle') {
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="toggle"
                      data-on={!!values[meta.path] || undefined}
                      onClick={() => TweakStore.updateValue(page.panel.id, meta.path, !values[meta.path])}
                    >
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotToggleBody label={meta.label} on={!!values[meta.path]} />
                    </div>
                  );
                }
                // A dial with the oscilloscope in it — the Rate slot: the
                // modulator's live signal fills the slot behind the dial's
                // own readout and bar, and the drag still turns the rate.
                // You turn the wave you're watching.
                const scopeSlot = settingsPanel ? modLayout?.dials.find((d) => d.path === meta.path)?.scope : undefined;
                if (scopeSlot && modSettings) {
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="scope"
                      data-active={active || undefined}
                      onPointerDown={(e) => {
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                        fineRef.current = null;
                        setDragPath(meta.path);
                        armMod(meta.path);
                        dialFromPointer(e, meta);
                      }}
                      onPointerMove={(e) => {
                        if (dragPath === meta.path) dialFromPointer(e, meta);
                      }}
                      onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                      onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                    >
                      <MoveModRing panelId={page.panel.id} path={meta.path} />
                      <MoveSlotScopeBody
                        label={meta.label}
                        value={chipValue(meta).num + (meta.unit ? ` ${meta.unit}` : '')}
                        pct={dialPercent(meta)}
                      >
                        <MoveScope index={modSettings.index} />
                      </MoveSlotScopeBody>
                    </div>
                  );
                }
                // The ADSR's four stage dials render as ONE 4-slot control,
                // the filter's big sibling: a single display drawing the
                // whole envelope, with each stage's caption and drag zone in
                // its own column — so every hardware knob still owns its
                // stage while the picture reads as one shape. The first
                // stage column carries the whole control; the rest yield to
                // its span, like the filter's second column does.
                const envStage = settingsPanel ? modLayout?.dials.find((d) => d.path === meta.path)?.stage : undefined;
                if (envStage) {
                  const stageDials = (modLayout?.dials ?? [])
                    .filter((d) => d.stage)
                    .flatMap((d) => {
                      const m = page.dials.find((x) => x?.path === d.path);
                      return m ? [{ stage: d.stage as string, meta: m }] : [];
                    });
                  if (stageDials[0]?.meta.path !== meta.path) return null;
                  // Times come off the panel's dials; the ramps' bends live
                  // only in the slot's params, written by the bend pads.
                  const envParams: ModulationParams = {
                    attack: Number(values.attack) || 0,
                    decay: Number(values.decay) || 0,
                    sustain: Number(values.sustain) || 0,
                    release: Number(values.release) || 0,
                    attackCurve: Number(modSlot?.params.attackCurve) || 0,
                    decayCurve: Number(modSlot?.params.decayCurve) || 0,
                    releaseCurve: Number(modSlot?.params.releaseCurve) || 0,
                  };
                  const envActive = stageDials.some(
                    (s) => dragPath === s.meta.path || !!handTouch[s.meta.path] || !!hwHeld[s.meta.path]
                  );
                  // Stage times read as their real numbers — 300 ms, not a
                  // percent of the dial.
                  const reading = (m: ControlMeta) => {
                    const v = chipValue(m);
                    return `${v.num}${v.unit ? ` ${v.unit}` : ''}`;
                  };
                  return (
                    <div
                      key={meta.path}
                      className="tweakers-move-dial"
                      data-kind="env"
                      data-active={envActive || undefined}
                      style={{ gridColumn: `span ${stageDials.length}` }}
                    >
                      <MoveSlotEnvBody
                        points={envelopePoints(envParams, 129)}
                        stages={stageDials.map((s) => ({ stage: s.stage, label: s.meta.label, value: reading(s.meta) }))}
                        joints={envelopeJoints(envParams).map((j) => ({ ...j, held: bendHeld === j.stage }))}
                      />
                      {/* One drag zone per stage column, over the display:
                          the pointer edits the stage whose column it is in,
                          the same one-knob-per-column rule the hardware
                          keeps. */}
                      <div className="tweakers-move-env-zones">
                        {stageDials.map(({ meta: m }) => (
                          <div
                            key={m.path}
                            className="tweakers-move-env-zone"
                            onPointerDown={(e) => {
                              try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                              fineRef.current = null;
                              setDragPath(m.path);
                              armMod(m.path);
                              dialFromPointer(e, m);
                            }}
                            onPointerMove={(e) => {
                              if (dragPath === m.path) dialFromPointer(e, m);
                            }}
                            onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                            onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                          >
                            <MoveModRing panelId={page.panel.id} path={m.path} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                // The slot pulses with its chip while a latched value sits in it.
                const latchedHere =
                  latched[i]?.path === meta.path || (page.values[i]?.path === meta.path && !!hwLatched[meta.path]);
                // A bipolar/origin dial anchors the fill at the origin mark and
                // grows toward the handle on either side, like the Slider.
                const origin01 = dialOrigin(meta);
                const originPct = origin01 > 0 ? origin01 * 100 : null;
                const pct = dialPercent(meta);
                // Parked on the origin exactly — the dial's zero, which the
                // ring states outright instead of leaving you to read a stub
                // against a tick.
                const atOrigin =
                  originPct != null &&
                  Math.abs(normalizeDial(meta, values[meta.path]) - origin01) < 1e-6;
                // A substituted chip (held or latched into the slot) reads as
                // its real value — the same number its chip shows below — and
                // a small tag names what the slot is controlling.
                const drawing = moveNumericDrawing(meta, values[meta.path]);
                const subbed = meta !== page.dials[i];
                const subValue = subbed || valueFirst ? chipValue(meta) : null;
                return (
                  <div
                    key={meta.path}
                    className="tweakers-move-dial"
                    data-active={active || undefined}
                    data-latched={latchedHere || undefined}
                    data-sub={(!drawing && (subbed || valueFirst)) || undefined}
                    data-visual={drawing?.kind}
                    role="slider"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={meta.label}
                    aria-valuemin={meta.min ?? 0}
                    aria-valuemax={meta.max ?? 1}
                    aria-valuenow={Number(values[meta.path])}
                    aria-valuetext={moveVisualReading(meta, Number(values[meta.path]))}
                    aria-orientation="horizontal"
                    aria-disabled={disabled || undefined}
                    data-disabled={disabled || undefined}
                    onKeyDown={(e) => dialFromKeyboard(e, meta)}
                    onPointerDown={(e) => {
                      if (TweakStore.isDisabled(page.panel.id, meta.path)) return;
                      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                      fineRef.current = null;
                      setDragPath(meta.path);
                      armMod(meta.path);
                      dialFromPointer(e, meta);
                    }}
                    onPointerMove={(e) => {
                      if (!TweakStore.isDisabled(page.panel.id, meta.path) && dragPath === meta.path) dialFromPointer(e, meta);
                    }}
                    onPointerUp={() => { setDragPath(null); fineRef.current = null; }}
                    onPointerCancel={() => { setDragPath(null); fineRef.current = null; }}
                  >
                    {!drawing && (subbed || valueFirst) && <span className="tweakers-move-dial-sub">{meta.label}</span>}
                    <MoveModRing panelId={page.panel.id} path={meta.path} />
                    {drawing ? (
                      <MoveSlotNumericBody label={meta.label} value={moveVisualReading(meta, Number(values[meta.path]))} drawing={drawing} />
                    ) : <MoveSlotDefaultBody
                      label={meta.label}
                      value={subValue
                        ? `${subValue.num}${subValue.unit ? ` ${subValue.unit}` : ''}`
                        : dialReading(meta)}
                      pct={pct}
                      originPct={originPct}
                      atOrigin={atOrigin}
                    />}

                  </div>
                );
              })}
            </div>

            {/* Trailing empty pad rows collapse: a row shows only if it, or any
                row after it, has something in it — so gaps inside the grid hold
                their place, but the panel never ends on dead rows. Columns
                collapse the same way: cells render only for visible columns,
                blank pads filling the gaps to keep the grid rectangular. */}
            {Array.from({ length: PAD_ROWS }, (_, row) => row)
              .filter((row) => appRowAt(row) !== null || padRows.slice(row).some((r) => r.length > 0))
              .map((row) => (
                <div key={row} className="tweakers-move-pads">
                  {visibleCols.map((col) => {
                    // A claimed row is the app's: it paints these, we only show them.
                    const appRow = appRowAt(row);
                    if (appRow !== null) {
                      const cell = padAt(col, appRow);
                      if (!cell || cell.empty) {
                        return <div key={`app-${col}`} className="tweakers-move-pad" data-empty="true" />;
                      }
                      return (
                        <button
                          key={`app-${col}`}
                          className="tweakers-move-pad"
                          data-kind="app"
                          data-on={cell.lit || undefined}
                          onClick={() => MoveSurfaceStore.press(col, appRow)}
                        >
                          {/* the colour is the app's own — a track, a slot, a
                              slice — so it rides inline, like a mod dot does */}
                          <span
                            className="tweakers-move-pad-indicator"
                            style={cell.color ? { background: cell.color } : undefined}
                          />
                          {cell.label && <span className="tweakers-move-pad-title">{cell.label}</span>}
                        </button>
                      );
                    }
                    const meta = padRows[row][col];
                    // The envelope's bend pads: the free toggle-row cell
                    // under each ramp column. Hold the pad and drag up or
                    // down to bend the ramp above it — the joint handle
                    // brightens, the shape and the signal follow together.
                    const bendStage =
                      !meta && settingsPanel && padRows[row] === page.toggles && modSettings
                        ? modLayout?.dials[col]?.stage
                        : undefined;
                    if (bendStage && ENV_BEND_STAGES.includes(bendStage)) {
                      return (
                        <button
                          key={`bend-${bendStage}`}
                          className="tweakers-move-pad"
                          data-kind="bend"
                          data-on={bendHeld === bendStage || undefined}
                          onPointerDown={(e) => {
                            try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
                            setBendHeld(bendStage);
                            bendRef.current = {
                              y: e.clientY,
                              curve: Number(modSlot?.params[envCurveParam(bendStage)]) || 0,
                            };
                          }}
                          onPointerMove={(e) => {
                            if (bendHeld !== bendStage || !bendRef.current) return;
                            const v = Math.min(1, Math.max(-1,
                              bendRef.current.curve + (bendRef.current.y - e.clientY) / 60));
                            ModulationStore.updateSlotParams(modSettings!.index, { [envCurveParam(bendStage)]: v });
                          }}
                          onPointerUp={() => { setBendHeld(null); bendRef.current = null; }}
                          onPointerCancel={() => { setBendHeld(null); bendRef.current = null; }}
                        >
                          <span className="tweakers-move-pad-indicator" />
                          <span className="tweakers-move-pad-title">Curve</span>
                        </button>
                      );
                    }
                    if (!meta) return <div key={`empty-${col}`} className="tweakers-move-pad" data-empty="true" />;
                    if (padRows[row] === page.toggles) {
                      return (
                        <button
                          key={meta.path}
                          className="tweakers-move-pad"
                          data-kind="toggle"
                          data-on={!!values[meta.path]}
                          onClick={() => TweakStore.updateValue(page.panel.id, meta.path, !values[meta.path])}
                        >
                          <span className="tweakers-move-pad-indicator" />
                          <span className="tweakers-move-pad-title">{meta.label}</span>
                        </button>
                      );
                    }
                    // Action pads carry no value — a press just runs the
                    // app's action, the same as the row's button on screen.
                    if (padRows[row] === page.actions) {
                      return (
                        <button
                          key={meta.path}
                          className="tweakers-move-pad"
                          data-kind="action"
                          onClick={() => TweakStore.triggerAction(page.panel.id, meta.path)}
                        >
                          <span className="tweakers-move-pad-title">{meta.label}</span>
                        </button>
                      );
                    }
                    const value = chipValue(meta);
                    return (
                      <button
                        key={meta.path}
                        className="tweakers-move-pad"
                        data-kind="value"
                        data-held={(held !== null && held.meta.path === meta.path) || hwHeld[meta.path] || undefined}
                        data-latched={chipLatched(col, meta) || undefined}
                        onPointerDown={(e) => pressChip(e, col, meta)}
                        onPointerUp={() => releaseChip(col, meta)}
                        onPointerCancel={() => setHeld(null)}
                      >
                        <MoveModRing panelId={page.panel.id} path={meta.path} pad />
                        <span className="tweakers-move-pad-title">{meta.label}</span>
                        <span className="tweakers-move-pad-reading">
                          <span className="tweakers-move-pad-number">{value.num}</span>
                          {value.unit && <span>{value.unit}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
          </div>}
        </div>
      </div>
    </div>
  );

  // Flow docking stays in the host's tree, so the app can centre content and
  // panel as one group; viewport docking portals out and pins to the edge.
  return dock === 'flow' ? content : createPortal(content, document.body);
}

/** A preview's samples as an SVG path across a 100×100 box, y pointing up. */
function previewPathData(points: number[]): string {
  if (points.length < 2) return '';
  return points
    .map((v, i) =>
      `${i ? 'L' : 'M'} ${((i / (points.length - 1)) * 100).toFixed(2)} ${((1 - v) * 100).toFixed(2)}`)
    .join(' ');
}

/** The floating composer's size — a Move-sized read of the whole pass. */
const MOVE_CURVE_WIDTH = 320;
const MOVE_CURVE_HEIGHT = 84;

/**
 * A curve modulator's composition, floating just above the panel while its
 * settings page is open — the same composer the app writes curves with, at
 * Move size and in the slot's own colour. Screen and hardware edit one
 * thing: the highlighted clip is the one the page's shape dials are on, and
 * the playhead runs on the modulator's own phase.
 */
function MoveCurveComposer({
  index, segments, direction, gap, selected,
}: {
  index: number;
  segments: CurveSegment[];
  direction: 'forward' | 'mirror' | 'reverse';
  gap: number;
  selected: number;
}) {
  // No colours passed: the composer strokes in currentColor, which the panel
  // sets to its own text colour — the shape reads as part of the instrument.
  return (
    <div className="tweakers-move-curve">
      <CurveComposer
        segments={segments}
        direction={direction}
        gap={gap}
        selectedIndex={selected}
        getPhase={() => ModulationStore.getSlotPhase(index)}
        onSelect={(i) => ModulationStore.updateSlotParams(index, { selected: i })}
        onSegmentsChange={(next) =>
          ModulationStore.updateSlotParams(index, { clips: next as never })}
        width={MOVE_CURVE_WIDTH}
        height={MOVE_CURVE_HEIGHT}
      />
    </div>
  );
}

/** The scope's rolling window, in samples — a couple of seconds at 60fps. */
const SCOPE_SAMPLES = 120;

/**
 * The preview pad's oscilloscope: the slot's real signal, sampled off the
 * engine every frame into a rolling window and written straight to the
 * path attribute — the panel never re-renders for it, the same discipline
 * as the modulation circles' breathing dots.
 */
function MoveScope({ index }: { index: number }) {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const now = (ModulationStore.getSignal(index) + 1) / 2;
    const pts: number[] = Array(SCOPE_SAMPLES).fill(now);
    let raf = requestAnimationFrame(function tick() {
      pts.push((ModulationStore.getSignal(index) + 1) / 2);
      pts.shift();
      ref.current?.setAttribute('d', previewPathData(pts));
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [index]);
  return (
    <svg
      className="tweakers-move-scope-wave"
      data-scope="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path ref={ref} />
    </svg>
  );
}

/**
 * One modulation circle (spec: a 24px ring holding a 12px dot in the slot's
 * palette colour). The dot breathes with the slot's live signal — the same
 * motion the hardware step light shows — written straight to style per
 * frame so the panel never re-renders for it. The circle is the on-screen
 * step button, with the hardware step's gestures: a tap with a control
 * armed (just touched) wires it on or off; a tap with nothing armed opens
 * the modulator's settings page (tap again to close); a hold opens it too.
 */
function MoveModCircle({ slot }: { slot: ModulationSlot }) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const pressAt = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    return ModulationStore.subscribeFrames(() => {
      const el = dotRef.current;
      if (!el) return;
      const level = (ModulationStore.getSignal(slot.index) + 1) / 2;
      el.style.transform = `scale(${(0.66 + 0.34 * level).toFixed(3)})`;
    });
  }, [slot.index]);

  return (
    <button
      type="button"
      className="tweakers-move-mod"
      title={`${slot.type.toUpperCase()} · step ${slot.index + 1}`}
      onPointerDown={() => {
        pressAt.current = Date.now();
      }}
      onPointerUp={() => {
        const tapped = Date.now() - pressAt.current < TAP_MS;
        if (tapped && ModulationStore.assignFromStep(slot.index).action !== 'none') return;
        const open = ModulationStore.getSettings();
        if (tapped && open && open.index === slot.index) ModulationStore.closeSettings();
        else ModulationStore.openSettings(slot.index);
      }}
    >
      <span
        ref={dotRef}
        className="tweakers-move-mod-dot"
        style={{ background: modColor(slot.index) }}
      />
    </button>
  );
}
