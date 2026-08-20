<script lang="ts">
  import type { ShortcutConfig, XYAxis } from 'tweakers/store';
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

  let {
    label,
    value,
    onChange,
    x,
    y,
    size = 160,
    grid,
    density = 1,
    snap = false,
    returnToCenter = false,
    showValues = false,
    disabled = false,
    formatValue,
    shortcut,
    shortcutActive,
  } = $props<{
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
  }>();

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

  const xAxis = $derived(resolveAxis(x));
  const yAxis = $derived(resolveAxis(y));

  let areaRef = $state<HTMLDivElement | undefined>(undefined);
  let active = $state(false);
  let dragging = $state(false);

  function emit(next: XYValue) {
    onChange(next);
  }

  // Screen point (y-down) → Cartesian value, with the per-axis escapable centre
  // detent applied against the origin's on-screen distance (bipolar axes only).
  function pointToValue(clientX: number, clientY: number, fine: boolean): XYValue {
    const el = areaRef;
    if (!el) return value;
    const rect = el.getBoundingClientRect();

    let px = (clientX - rect.left) / rect.width;
    let py = (clientY - rect.top) / rect.height;

    if (fine) {
      // Fine drag: nudge from the current point by a fraction of the raw delta
      // so precision holds near the thumb rather than jumping to the cursor.
      const cur = pointFromValue(value, xAxis, yAxis);
      px = cur.x + (px - cur.x) * FINE_DRAG;
      py = cur.y + (py - cur.y) * FINE_DRAG;
    }

    px = Math.min(1, Math.max(0, px));
    py = Math.min(1, Math.max(0, py));

    const next = valueFromPoint({ x: px, y: py }, xAxis, yAxis, snap);

    // Detent: measure the pointer's pixel distance from each origin's screen
    // position along that axis and let the core decide whether it sticks.
    const originPoint = pointFromValue({ x: xAxis.origin, y: yAxis.origin }, xAxis, yAxis);
    const dxPx = Math.abs(px - originPoint.x) * rect.width;
    const dyPx = Math.abs(py - originPoint.y) * rect.height;
    return {
      x: applyDetentAxis(next.x, xAxis, dxPx),
      y: applyDetentAxis(next.y, yAxis, dyPx),
    };
  }

  function handlePointerDown(e: PointerEvent) {
    if (disabled) return;
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
    active = true;
    dragging = true;
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragging) return;
    // Lost-capture insurance: no buttons down means the drag is over. A fast release
    // delivers this buttons===0 move *before* pointerup, so finish the drag here (and
    // spring home / release capture) rather than bailing and losing the pointerup.
    if (e.buttons === 0) {
      finishDrag(e);
      return;
    }
    emit(pointToValue(e.clientX, e.clientY, e.shiftKey));
  }

  // Single idempotent drag-finish routine wired to BOTH pointerup and pointercancel,
  // and called from the buttons===0 bail in handlePointerMove. Idempotent so calling it
  // from the move-bail and a following pointerup is safe (the second call early-returns).
  function finishDrag(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
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
    if (!stillActive) active = false;
    // Joystick: spring the thumb home on release. The transition is re-enabled the
    // moment data-dragging flips false, so emitting the origin here eases there.
    if (returnToCenter) emit(normalizeValue(centerValue(xAxis, yAxis), xAxis, yAxis, snap));
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    const mode = e.shiftKey ? 'coarse' : e.altKey ? 'fine' : 'normal';
    const cur = value;
    const ctrl = e.ctrlKey || e.metaKey;
    let next: XYValue | null = null;

    switch (e.key) {
      case 'ArrowUp':
        next = nudge(cur, 'y', 1, xAxis, yAxis, mode);
        break;
      case 'ArrowDown':
        next = nudge(cur, 'y', -1, xAxis, yAxis, mode);
        break;
      case 'ArrowRight':
        next = nudge(cur, 'x', 1, xAxis, yAxis, mode);
        break;
      case 'ArrowLeft':
        next = nudge(cur, 'x', -1, xAxis, yAxis, mode);
        break;
      case 'PageUp':
        next = nudge(cur, 'y', 1, xAxis, yAxis, 'coarse');
        break;
      case 'PageDown':
        next = nudge(cur, 'y', -1, xAxis, yAxis, 'coarse');
        break;
      case 'Home':
        // Ctrl/Cmd+Home → min corner; plain Home → X to min.
        next = ctrl ? { x: xAxis.min, y: yAxis.min } : { x: xAxis.min, y: cur.y };
        break;
      case 'End':
        next = ctrl ? { x: xAxis.max, y: yAxis.max } : { x: xAxis.max, y: cur.y };
        break;
      default:
        return;
    }

    e.preventDefault();
    // Keyboard sets and holds even in joystick mode; the return fires on pointer
    // release only. The thumb eases via CSS (data-dragging is false here).
    emit(next);
  }

  function reset() {
    if (disabled) return;
    // Reset target: the natural home is each axis's origin (midpoint for a bipolar
    // axis, min otherwise), normalized/snapped into range.
    emit(normalizeValue(centerValue(xAxis, yAxis), xAxis, yAxis, snap));
  }

  function handleClick(e: MouseEvent) {
    if (e.altKey) reset();
  }

  // Per-axis label (falls back to X / Y) and value, formatted to the axis step.
  // These feed the decorative in-pad axis labels and stay byte-consistent with the
  // default aria-valuetext below.
  const xLabel = $derived(x?.label ?? 'X');
  const yLabel = $derived(y?.label ?? 'Y');
  const xText = $derived(`${xLabel} ${formatComponent(value.x, xAxis)}`);
  const yText = $derived(`${yLabel} ${formatComponent(value.y, yAxis)}`);

  // Visible in-pad axis text: label only by default, label+value when showValues.
  // aria-valuetext (below) always carries the numbers, so this stays cosmetic.
  const xVisual = $derived(showValues ? xText : xLabel);
  const yVisual = $derived(showValues ? yText : yLabel);

  // aria-valuetext string (the accessible source of truth). `formatValue`, when
  // given, owns it in full; otherwise it names both axes AND their values for
  // screen readers — independent of `showValues`, so accessibility never regresses.
  const readout = $derived(
    formatValue
      ? formatValue(value)
      : `${xText}  ${yText}`
  );

  // Grid subdivisions are 5×5 by default; `density` scales both.
  const dens = $derived(typeof density === 'number' && density > 0 ? density : 1);
  const baseX = $derived(grid === false ? 0 : typeof grid === 'number' ? grid : DEFAULT_GRID_X);
  const baseY = $derived(grid === false ? 0 : typeof grid === 'number' ? grid : DEFAULT_GRID_Y);
  const gridX = $derived(baseX > 0 ? Math.round(baseX * dens) : 0);
  const gridY = $derived(baseY > 0 ? Math.round(baseY * dens) : 0);
  const showGrid = $derived(gridX > 0 && gridY > 0);

  // Thumb/guide position straight from the value — the single value→CSS mapping.
  const point = $derived(pointFromValue(value, xAxis, yAxis));
  const leftPct = $derived(`${point.x * 100}%`);
  const topPct = $derived(`${point.y * 100}%`);

  // The pad IS the 2D value widget, so it carries the slider-style aria-value* props
  // and its own pointer/keyboard listeners on a role="application" surface (matching
  // the React port's rendered DOM and the kit's SV-area / CurveComposer precedent).
  // Spreading these bypasses the compiler's static role/aria and non-interactive-
  // listener a11y checks without changing the emitted markup or adding suppressions.
  const areaAria = $derived({
    'aria-roledescription': '2D pad',
    'aria-label': label,
    'aria-valuetext': readout,
    'aria-valuemin': xAxis.min,
    'aria-valuemax': xAxis.max,
    'aria-valuenow': value.x,
    'aria-disabled': disabled || undefined,
    tabindex: disabled ? -1 : 0,
  });
  const areaHandlers = {
    onpointerdown: handlePointerDown,
    onpointermove: handlePointerMove,
    onpointerup: finishDrag,
    onpointercancel: finishDrag,
    ondblclick: reset,
    onclick: handleClick,
    onkeydown: handleKeyDown,
    onfocus: () => (active = true),
    onblur: () => (active = false),
    onpointerenter: () => (active = true),
    onpointerleave: () => {
      if (!dragging) active = false;
    },
  };
</script>

<div class="tweakers-xy" data-active={String(active)} data-disabled={String(disabled)}>
  <div class="tweakers-xy-header">
    <span class="tweakers-xy-label">
      {label}
      {#if shortcut}
        <span class={`tweakers-shortcut-pill${shortcutActive ? ' tweakers-shortcut-pill-active' : ''}`}>
          {formatSliderShortcut(shortcut)}
        </span>
      {/if}
    </span>
  </div>

  <!--
    Only the height is fixed (from `size`); width is fluid (CSS width:100%), so the
    pad grows to fill the container and is no longer forced square. The aria-value*
    props and pointer/keyboard listeners are spread (see areaAria / areaHandlers) so
    the emitted DOM matches the React port exactly.
  -->
  <div
    bind:this={areaRef}
    class="tweakers-xy-area"
    style="height:{size}px;"
    role="application"
    data-active={String(active)}
    data-dragging={String(dragging)}
    data-disabled={String(disabled)}
    {...areaAria}
    {...areaHandlers}
  >
    {#if showGrid}
      <div
        class="tweakers-xy-grid"
        aria-hidden="true"
        style="--tweak-xy-grid-step-x:{100 / gridX}%;--tweak-xy-grid-step-y:{100 / gridY}%;"
      ></div>
    {/if}
    <!-- Live axis labels, decorative (aria-valuetext owns the accessible string):
         X along the bottom edge, Y up the left edge. -->
    <div class="tweakers-xy-axis tweakers-xy-axis-x" aria-hidden="true">{xVisual}</div>
    <div class="tweakers-xy-axis tweakers-xy-axis-y" aria-hidden="true">{yVisual}</div>
    <!-- Crosshair guides tracking the thumb, revealed on data-active. -->
    <div class="tweakers-xy-guide tweakers-xy-guide-v" aria-hidden="true" style="left:{leftPct};"></div>
    <div class="tweakers-xy-guide tweakers-xy-guide-h" aria-hidden="true" style="top:{topPct};"></div>
    <div class="tweakers-xy-thumb" aria-hidden="true" style="left:{leftPct};top:{topPct};"></div>
  </div>
</div>
