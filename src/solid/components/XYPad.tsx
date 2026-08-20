import { createSignal, Show } from 'solid-js';
import type { JSX } from 'solid-js';
import type { ShortcutConfig, XYAxis } from '../../store/TweakStore';
import { formatSliderShortcut } from '../../shortcut-utils';
import {
  resolveAxis,
  valueFromPoint,
  pointFromValue,
  applyDetentAxis,
  nudge,
  centerValue,
  normalizeValue,
  type XYValue,
  type AxisSpec,
} from '../../xy-pad-core';

export interface XYPadProps {
  label: string;
  value: XYValue;
  onChange: (value: XYValue) => void;
  /** Horizontal axis (defaults: min 0, max 1, step 0.01). */
  x?: XYAxis;
  /** Vertical axis, Cartesian (top = max). Same defaults as x. */
  y?: XYAxis;
  /** Height of the pad in px; the pad grows to fill the container width (it is not forced square). Default 160. */
  size?: number;
  /**
   * Grid overlay — on by default as a 5×5 grid (5 columns on X, 5 rows on Y),
   * faint at rest and stronger on interaction. Pass `false` to hide it, or a
   * number for a uniform N×N count. `density` multiplies whichever grid applies.
   */
  grid?: boolean | number;
  /** Multiplies both axis subdivision counts (default 1). E.g. 2 on the 5×5 default → 10×10. */
  density?: number;
  /** Snap the emitted value to each axis's step. Default false (continuous). */
  snap?: boolean;
  /** Spring back to centre on release (joystick). Default false = hold. */
  returnToCenter?: boolean;
  /** Show the live value next to each axis label (default false = label only). */
  showValues?: boolean;
  disabled?: boolean;
  /** Override the readout / aria-valuetext text. Owns the full string. */
  formatValue?: (value: XYValue) => string;
  shortcut?: ShortcutConfig;
  shortcutActive?: boolean;
}

/** Default grid subdivisions when `grid` is left default/true: 5 columns × 5 rows. */
const DEFAULT_GRID_X = 5;
const DEFAULT_GRID_Y = 5;
/** Pointer fine-drag multiplier (Shift): apply a fraction of the raw delta. */
const FINE_DRAG = 0.15;

/** Decimals implied by a step (0.01 → 2) — matches the core/slider convention. */
function decimalsForStep(step: number): number {
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

/** Format one component to its axis's step precision, collapsing -0 → 0. */
function formatComponent(v: number, axis: AxisSpec): string {
  return (v + 0).toFixed(decimalsForStep(axis.step));
}

/**
 * Standalone 2D value pad. A single focusable surface with an absolutely
 * positioned thumb; pointer press places-and-grabs, arrows nudge, and an
 * optional return-to-centre springs the thumb home on release. All value
 * math (mapping, clamping, snapping, nudging, detent) lives in xy-pad-core.
 *
 * The thumb/guides are positioned purely from the `value` prop via CSS
 * `left%`/`top%` (the ColorPickerPanel SV-thumb idiom), so the four ports render
 * identical markup with no animation library. Smooth motion for keyboard nudges
 * and return-to-centre comes from a CSS transition that is disabled during drag
 * (via `data-dragging`), keeping drags instant.
 */
export function XYPad(props: XYPadProps) {
  const size = () => props.size ?? 160;
  const snap = () => props.snap ?? false;
  const disabled = () => props.disabled ?? false;
  const returnToCenter = () => props.returnToCenter ?? false;
  const showValues = () => props.showValues ?? false;
  const density = () => props.density ?? 1;

  const xAxis = () => resolveAxis(props.x);
  const yAxis = () => resolveAxis(props.y);

  let areaRef: HTMLDivElement | undefined;
  let dragging = false;
  const [active, setActive] = createSignal(false);
  const [draggingState, setDraggingState] = createSignal(false);

  // Screen point (y-down) → Cartesian value, with the per-axis escapable centre
  // detent applied against the origin's on-screen distance (bipolar axes only).
  const pointToValue = (clientX: number, clientY: number, fine: boolean): XYValue => {
    const el = areaRef;
    if (!el) return props.value;
    const rect = el.getBoundingClientRect();
    const xs = xAxis();
    const ys = yAxis();

    let px = (clientX - rect.left) / rect.width;
    let py = (clientY - rect.top) / rect.height;

    if (fine) {
      // Fine drag: nudge from the current point by a fraction of the raw delta
      // so precision holds near the thumb rather than jumping to the cursor.
      const cur = pointFromValue(props.value, xs, ys);
      px = cur.x + (px - cur.x) * FINE_DRAG;
      py = cur.y + (py - cur.y) * FINE_DRAG;
    }

    px = Math.min(1, Math.max(0, px));
    py = Math.min(1, Math.max(0, py));

    const next = valueFromPoint({ x: px, y: py }, xs, ys, snap());

    // Detent: measure the pointer's pixel distance from each origin's screen
    // position along that axis and let the core decide whether it sticks.
    const originPoint = pointFromValue({ x: xs.origin, y: ys.origin }, xs, ys);
    const dxPx = Math.abs(px - originPoint.x) * rect.width;
    const dyPx = Math.abs(py - originPoint.y) * rect.height;
    return {
      x: applyDetentAxis(next.x, xs, dxPx),
      y: applyDetentAxis(next.y, ys, dyPx),
    };
  };

  const emit = (next: XYValue) => {
    props.onChange(next);
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (disabled()) return;
    // Ignore non-primary/secondary pointers: a right-click or a second touch must not
    // start a drag, emit a value, or grab capture. (Alt+left-click reset still works —
    // it's button 0 + primary, then hits the altKey early-out just below.)
    if (e.button !== 0 || !e.isPrimary) return;
    // Alt+click resets: let the click→reset() path own it so we don't place-and-
    // emit an intermediate value here first (Alt+click would otherwise emit twice).
    if (e.altKey) return;
    e.preventDefault();
    // Guard: a lost/duplicate capture must not abort placing the point.
    try {
      areaRef?.setPointerCapture(e.pointerId);
    } catch {
      // pointer capture is best-effort; the buttons===0 move guard covers loss.
    }
    areaRef?.focus();
    dragging = true;
    setActive(true);
    setDraggingState(true);
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    // Lost-capture insurance: no buttons down means the drag is over. A fast release
    // delivers this buttons===0 move *before* pointerup, so finish the drag here (and
    // spring home / release capture) rather than bailing and losing the pointerup.
    if (e.buttons === 0) {
      finishDrag(e);
      return;
    }
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  };

  // Single idempotent drag-finish routine wired to BOTH pointerup and pointercancel,
  // and called from the buttons===0 bail in handlePointerMove. Idempotent so calling it
  // from the move-bail and a following pointerup is safe (the second call early-returns).
  const finishDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    setDraggingState(false);
    // Release the capture grabbed on pointerdown — otherwise it leaks (especially on the
    // buttons===0 bail path, which never reached the old pointerup).
    try {
      areaRef?.releasePointerCapture(e.pointerId);
    } catch {
      // Releasing a capture we never held (or already lost) is a no-op we can ignore.
    }
    // Reconcile `active`: a drag can end with the pointer off the pad (touch, flick), so
    // no leave/blur fires to clear it. Only clear active when the pad is neither hovered
    // nor focused, so a drag that ends over/on the pad keeps its hover/focus lit.
    const el = areaRef;
    const stillActive =
      (el?.matches(':hover') ?? false) || el === (el?.ownerDocument ?? document).activeElement;
    if (!stillActive) setActive(false);
    // Joystick: spring the thumb home on release. The transition is re-enabled the
    // moment data-dragging flips false, so emitting the origin here eases there.
    if (returnToCenter()) emit(normalizeValue(centerValue(xAxis(), yAxis()), xAxis(), yAxis(), snap()));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled()) return;
    const mode = e.shiftKey ? 'coarse' : e.altKey ? 'fine' : 'normal';
    const cur = props.value;
    const xs = xAxis();
    const ys = yAxis();
    const ctrl = e.ctrlKey || e.metaKey;
    let next: XYValue | null = null;

    switch (e.key) {
      case 'ArrowUp':
        next = nudge(cur, 'y', 1, xs, ys, mode);
        break;
      case 'ArrowDown':
        next = nudge(cur, 'y', -1, xs, ys, mode);
        break;
      case 'ArrowRight':
        next = nudge(cur, 'x', 1, xs, ys, mode);
        break;
      case 'ArrowLeft':
        next = nudge(cur, 'x', -1, xs, ys, mode);
        break;
      case 'PageUp':
        next = nudge(cur, 'y', 1, xs, ys, 'coarse');
        break;
      case 'PageDown':
        next = nudge(cur, 'y', -1, xs, ys, 'coarse');
        break;
      case 'Home':
        // Ctrl/Cmd+Home → min corner; plain Home → X to min.
        next = ctrl ? { x: xs.min, y: ys.min } : { x: xs.min, y: cur.y };
        break;
      case 'End':
        next = ctrl ? { x: xs.max, y: ys.max } : { x: xs.max, y: cur.y };
        break;
      default:
        return;
    }

    e.preventDefault();
    // Keyboard sets and holds even in joystick mode; the return fires on pointer
    // release only. The thumb eases via CSS (data-dragging is false here).
    emit(next);
  };

  const reset = () => {
    if (disabled()) return;
    // Reset target: the natural home is each axis's origin (midpoint for a bipolar
    // axis, min otherwise), normalized/snapped into range.
    emit(normalizeValue(centerValue(xAxis(), yAxis()), xAxis(), yAxis(), snap()));
  };

  // Per-axis label (falls back to X / Y) and value, formatted to the axis step.
  // These feed the decorative in-pad axis labels and stay byte-consistent with the
  // default aria-valuetext below.
  const xLabel = () => props.x?.label ?? 'X';
  const yLabel = () => props.y?.label ?? 'Y';
  const xText = () => `${xLabel()} ${formatComponent(props.value.x, xAxis())}`;
  const yText = () => `${yLabel()} ${formatComponent(props.value.y, yAxis())}`;

  // Visible in-pad axis text: label only by default, label+value when showValues.
  // aria-valuetext (below) always carries the numbers, so this stays cosmetic.
  const xVisual = () => (showValues() ? xText() : xLabel());
  const yVisual = () => (showValues() ? yText() : yLabel());

  // aria-valuetext string (the accessible source of truth). `formatValue`, when
  // given, owns it in full; otherwise it names both axes AND their values for
  // screen readers — independent of `showValues`, so accessibility never regresses.
  const readout = () =>
    props.formatValue
      ? props.formatValue(props.value)
      : `${xText()}  ${yText()}`;

  // Grid subdivisions are 5×5 by default; `density` scales both.
  const dens = () => (typeof density() === 'number' && density() > 0 ? density() : 1);
  const baseX = () => (props.grid === false ? 0 : typeof props.grid === 'number' ? props.grid : DEFAULT_GRID_X);
  const baseY = () => (props.grid === false ? 0 : typeof props.grid === 'number' ? props.grid : DEFAULT_GRID_Y);
  const gridX = () => (baseX() > 0 ? Math.round(baseX() * dens()) : 0);
  const gridY = () => (baseY() > 0 ? Math.round(baseY() * dens()) : 0);
  const showGrid = () => gridX() > 0 && gridY() > 0;

  // Thumb/guide position straight from the value — the single value→CSS mapping.
  const point = () => pointFromValue(props.value, xAxis(), yAxis());
  const leftPct = () => `${point().x * 100}%`;
  const topPct = () => `${point().y * 100}%`;

  return (
    <div class="tweakers-xy" data-active={String(active())} data-disabled={String(disabled())}>
      <div class="tweakers-xy-header">
        <span class="tweakers-xy-label">
          {props.label}
          <Show when={props.shortcut}>
            <span class={`tweakers-shortcut-pill${props.shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`}>
              {formatSliderShortcut(props.shortcut!)}
            </span>
          </Show>
        </span>
      </div>

      <div
        ref={areaRef}
        class="tweakers-xy-area"
        // Only the height is fixed (from `size`); width is fluid (CSS width:100%),
        // so the pad grows to fill the container and is no longer forced square.
        style={{ height: `${size()}px` }}
        role="application"
        aria-roledescription="2D pad"
        aria-label={props.label}
        aria-valuetext={readout()}
        aria-valuemin={xAxis().min}
        aria-valuemax={xAxis().max}
        aria-valuenow={props.value.x}
        aria-disabled={disabled() || undefined}
        tabIndex={disabled() ? -1 : 0}
        data-active={String(active())}
        data-dragging={String(draggingState())}
        data-disabled={String(disabled())}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onDblClick={reset}
        onClick={(e) => { if (e.altKey) reset(); }}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => { if (!dragging) setActive(false); }}
      >
        <Show when={showGrid()}>
          <div
            class="tweakers-xy-grid"
            aria-hidden="true"
            style={{
              '--tweak-xy-grid-step-x': `${100 / gridX()}%`,
              '--tweak-xy-grid-step-y': `${100 / gridY()}%`,
            } as JSX.CSSProperties}
          />
        </Show>
        {/* Live axis labels, decorative (aria-valuetext owns the accessible string):
            X along the bottom edge, Y up the left edge. */}
        <div class="tweakers-xy-axis tweakers-xy-axis-x" aria-hidden="true">{xVisual()}</div>
        <div class="tweakers-xy-axis tweakers-xy-axis-y" aria-hidden="true">{yVisual()}</div>
        {/* Crosshair guides tracking the thumb, revealed on data-active. */}
        <div class="tweakers-xy-guide tweakers-xy-guide-v" aria-hidden="true" style={{ left: leftPct() }} />
        <div class="tweakers-xy-guide tweakers-xy-guide-h" aria-hidden="true" style={{ top: topPct() }} />
        <div class="tweakers-xy-thumb" aria-hidden="true" style={{ left: leftPct(), top: topPct() }} />
      </div>
    </div>
  );
}
