<script lang="ts">
  import { onMount } from 'svelte';
  import {
    buildSamplers,
    readComposition,
    segmentSpan,
    segmentIndexAt,
    boundaries,
    splitSegment,
    cycleSegmentType,
    cycleDriverType,
    redistributeWeight,
    triggersCrossed,
    toLocalCoords,
    pointerTarget,
    applySegmentBodyDrag,
    applyDriverBodyDrag,
    composerLayout,
    mapY,
    curvePath,
    diagonalLine,
    playheadGeometry,
    DEFAULT_TRIGGER_STEPS,
    DRAG_THRESHOLD,
    EDGE_HIT,
  } from '../../curve-composer-core';
  import type {
    CurveSegment,
    CurveDriver,
    CurveComposition,
    DriverDirection,
    Rect,
  } from '../../curve-composer-core';

  let {
    segments,
    driver = null,
    direction = 'forward',
    onSegmentsChange = undefined,
    onDriverChange = undefined,
    getPhase = undefined,
    phase = 0,
    mode = 'continuous',
    triggerSteps = DEFAULT_TRIGGER_STEPS,
    onTrigger = undefined,
    curveColor = undefined,
    playheadColor = undefined,
    grid = false,
    gridSubdivisions = 8,
    width = 256,
    height = 140,
  } = $props<{
    segments: CurveSegment[];
    driver?: CurveDriver | null;
    direction?: DriverDirection;
    onSegmentsChange?: (segments: CurveSegment[]) => void;
    onDriverChange?: (driver: CurveDriver) => void;
    getPhase?: () => number;
    phase?: number;
    mode?: 'continuous' | 'trigger';
    triggerSteps?: number;
    onTrigger?: (index: number) => void;
    curveColor?: string;
    playheadColor?: string;
    grid?: boolean;
    gridSubdivisions?: number;
    width?: number;
    height?: number;
  }>();

  // A drag in progress, captured against the composition state at press time so live
  // commits compute from a stable baseline rather than compounding.
  type Drag =
    | { kind: 'boundary'; index: number; startX: number; startY: number; base: CurveComposition; moved: boolean }
    | { kind: 'segment'; index: number; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean }
    | { kind: 'driver'; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean };

  // --- derived geometry (shared layout from the core) ---
  const layout = $derived(composerLayout(width, height, driver != null));
  const W = $derived(layout.W);
  const totalH = $derived(layout.totalH);
  const mainRect = $derived(layout.mainRect);
  const driverRect = $derived(layout.driverRect);

  const composition = $derived<CurveComposition>({ segments, driver, direction });
  const samplers = $derived(buildSamplers(composition));
  const interior = $derived(boundaries(segments));

  // --- element refs for direct per-frame DOM writes ---
  let svgEl: SVGSVGElement;
  let seriesPlayheadEl: SVGLineElement | undefined;
  let seriesDotEl: SVGCircleElement | undefined;
  // Conditionally rendered (driver lane), so reassigned across renders — $state keeps the rAF read fresh.
  let driverPlayheadEl = $state<SVGLineElement | undefined>(undefined);

  let drag = $state<Drag | null>(null);
  let hover = $state<{ kind: 'boundary' | 'segment' | 'driver'; index: number } | null>(null);

  // --- playhead loop (direct DOM writes, like the waveform's polled playhead) ---
  onMount(() => {
    let raf = 0;
    // Tracks the composed value across frames to detect trigger-level crossings.
    let prevTrigValue = Number.NaN;
    // Re-prime crossing detection when the geometry inputs change so the first frame
    // after a re-arm doesn't compare against a value from the previous composition.
    let armW = W;
    let armTotalH = totalH;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      // A geometry-driven re-arm must not compare the first frame against a value from
      // the previous loop's composition (phantom trigger).
      if (W !== armW || totalH !== armTotalH) {
        prevTrigValue = Number.NaN;
        armW = W;
        armTotalH = totalH;
      }
      const u = getPhase ? getPhase() : phase;
      const read = readComposition(composition, u, samplers);
      const geo = playheadGeometry(read, layout);
      if (seriesPlayheadEl) {
        seriesPlayheadEl.setAttribute('x1', String(geo.seriesX));
        seriesPlayheadEl.setAttribute('x2', String(geo.seriesX));
      }
      if (seriesDotEl) {
        // The dot rides the active segment's own curve (a full min→max walk per segment).
        seriesDotEl.setAttribute('cx', String(geo.dotX));
        seriesDotEl.setAttribute('cy', String(geo.dotY));
      }
      if (driverPlayheadEl) {
        driverPlayheadEl.setAttribute('x1', String(geo.driverX));
        driverPlayheadEl.setAttribute('x2', String(geo.driverX));
      }
      // Trigger mode: emit when the composed VALUE crosses an evenly-spaced level. The
      // curve sets how fast the value reaches each level, so non-linear curves fire
      // unevenly in time. Visualization is the consumer's job — the component only emits.
      if (mode === 'trigger') {
        if (!Number.isNaN(prevTrigValue)) {
          for (const idx of triggersCrossed(prevTrigValue, read.value, triggerSteps)) onTrigger?.(idx);
        }
        prevTrigValue = read.value;
      } else {
        prevTrigValue = Number.NaN;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  // --- pointer interaction ---
  const hitLayout = () => ({ totalH, driverY: driverRect ? driverRect.y : null });

  const localCoords = (clientX: number, clientY: number) => {
    const rect = svgEl.getBoundingClientRect();
    return { ...toLocalCoords(clientX, clientY, rect, totalH), rectW: rect.width };
  };

  function onPointerDown(e: PointerEvent) {
    const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
    try {
      svgEl.setPointerCapture(e.pointerId);
    } catch {
      // No active pointer (e.g. a synthetic event) — capture is a nicety, not required.
    }

    const target = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT / rectW);
    if (target.kind === 'driver') {
      drag = {
        kind: 'driver',
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: driver!.curvature,
        baseSteepness: driver!.steepness,
        moved: false,
      };
    } else if (target.kind === 'boundary') {
      drag = { kind: 'boundary', index: target.index, startX: e.clientX, startY: e.clientY, base: composition, moved: false };
    } else {
      const seg = segments[target.index];
      drag = {
        kind: 'segment',
        index: target.index,
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: seg?.curvature ?? 0,
        baseSteepness: seg?.steepness ?? 0,
        moved: false,
      };
    }
  }

  function onPointerMove(e: PointerEvent) {
    const d = drag;
    if (!d) {
      // Hover affordance only.
      const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
      const t = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT / rectW);
      hover = t.kind === 'driver' ? { kind: 'driver', index: 0 } : { kind: t.kind, index: t.index };
      return;
    }

    const svgRect = svgEl.getBoundingClientRect();
    const rectW = svgRect.width;
    const rectH = svgRect.height;
    // Either axis past the threshold counts as a drag (horizontal = energy, vertical = steepness).
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
    if (!moved) return;

    if (d.kind === 'boundary') {
      const deltaFrac = (e.clientX - d.startX) / rectW;
      const next = redistributeWeight(d.base, d.index, deltaFrac);
      onSegmentsChange?.(next.segments);
      if (!d.moved) drag = { ...d, moved: true };
    } else if (d.kind === 'segment') {
      // Horizontal → energy bias; vertical (up = more) → steepness.
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applySegmentBodyDrag(composition, d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      onSegmentsChange?.(next.segments);
      if (!d.moved) drag = { ...d, moved: true };
    } else {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applyDriverBodyDrag(composition, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      if (next.driver) onDriverChange?.(next.driver);
      if (!d.moved) drag = { ...d, moved: true };
    }
  }

  function onPointerUp(e: PointerEvent) {
    const d = drag;
    drag = null;
    try {
      svgEl.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may not be held — ignore.
    }
    if (!d || d.moved) return;
    // An un-moved press is a click → cycle the curve type.
    if (d.kind === 'driver') {
      const next = cycleDriverType(composition);
      if (next.driver) onDriverChange?.(next.driver);
    } else if (d.kind === 'segment') {
      onSegmentsChange?.(cycleSegmentType(composition, d.index).segments);
    }
  }

  function onPointerCancel(e: PointerEvent) {
    drag = null;
    try {
      svgEl.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may not be held — ignore (mirrors onPointerUp).
    }
  }

  function onDoubleClick(e: MouseEvent) {
    const { xN, py } = localCoords(e.clientX, e.clientY);
    if (driverRect && py >= driverRect.y) return; // driver is a single curve
    onSegmentsChange?.(splitSegment(composition, segmentIndexAt(xN, segments)).segments);
  }

  function onPointerLeave() {
    if (!drag) hover = null;
  }

  const cursor = $derived.by(() => {
    const activeKind = drag?.kind ?? hover?.kind;
    return activeKind === 'boundary'
      ? 'ew-resize'
      : activeKind === 'segment' || activeKind === 'driver'
        ? 'move'
        : 'default';
  });

  // --- path builders (geometry + path strings come from the shared core) ---
  const laneGrid = (rect: Rect): number[] => {
    if (!grid) return [];
    const n = Math.max(1, Math.round(gridSubdivisions));
    const out: number[] = [];
    for (let i = 1; i < n; i++) out.push((i / n) * W);
    return out;
  };

  const segmentSpans = $derived(segments.map((_: CurveSegment, i: number) => segmentSpan(segments, i)));
</script>

<div class="dialkit-cc-wrap" style={`width:${W}px`}>
  <svg
    bind:this={svgEl}
    class="dialkit-cc"
    viewBox={`0 0 ${W} ${totalH}`}
    {width}
    height={totalH}
    style={`width:${W}px;height:${totalH}px;cursor:${cursor};${curveColor ? `color:${curveColor};` : ''}`}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerCancel}
    onpointerleave={onPointerLeave}
    ondblclick={onDoubleClick}
    role="application"
    aria-label="Curve composer"
  >
    <!-- main lane -->
    <rect class="dialkit-cc-lane" x={mainRect.x} y={mainRect.y} width={mainRect.w} height={mainRect.h} rx={8} />
    {#each laneGrid(mainRect) as gx}
      <line class="dialkit-cc-grid" x1={gx} y1={mainRect.y} x2={gx} y2={mainRect.y + mainRect.h} />
    {/each}

    <!-- hovered segment highlight -->
    {#if hover?.kind === 'segment' && !drag}
      {@const span = segmentSpan(segments, hover.index)}
      <rect
        class="dialkit-cc-seg-hover"
        x={span[0] * W}
        y={mainRect.y}
        width={(span[1] - span[0]) * W}
        height={mainRect.h}
        rx={8}
      />
    {/if}

    {#each segments as seg, i}
      {@const span = segmentSpans[i]}
      {@const diag = diagonalLine(mainRect, span, W)}
      <g>
        <line class="dialkit-cc-diagonal" x1={diag.x1} y1={diag.y1} x2={diag.x2} y2={diag.y2} />
        <path class="dialkit-cc-curve" d={curvePath(seg, mainRect, span, W)} />
        <text class="dialkit-cc-label" x={(span[0] + span[1]) * 0.5 * W} y={mainRect.y + 13}>{seg.type}</text>
      </g>
    {/each}

    <!-- interior boundaries -->
    {#each interior as bx, i}
      <line
        class="dialkit-cc-boundary"
        data-active={String(
          (hover?.kind === 'boundary' && hover.index === i) || (drag?.kind === 'boundary' && drag.index === i)
        )}
        x1={bx * W}
        y1={mainRect.y}
        x2={bx * W}
        y2={mainRect.y + mainRect.h}
      />
    {/each}

    <!-- series playhead + value dot (rides the curve; this is the signal triggers read) -->
    <line
      bind:this={seriesPlayheadEl}
      class="dialkit-cc-playhead"
      x1={0}
      y1={mainRect.y}
      x2={0}
      y2={mainRect.y + mainRect.h}
      style={playheadColor ? `stroke:${playheadColor}` : undefined}
    />
    <circle
      bind:this={seriesDotEl}
      class="dialkit-cc-dot"
      cx={0}
      cy={mapY(mainRect, 0)}
      r={3}
      style={playheadColor ? `fill:${playheadColor}` : undefined}
    />

    <!-- driver lane -->
    {#if driverRect}
      <rect class="dialkit-cc-lane" x={driverRect.x} y={driverRect.y} width={driverRect.w} height={driverRect.h} rx={8} />
      {#each laneGrid(driverRect) as gx}
        <line class="dialkit-cc-grid" x1={gx} y1={driverRect.y} x2={gx} y2={driverRect.y + driverRect.h} />
      {/each}
      {#if hover?.kind === 'driver' && !drag}
        <rect class="dialkit-cc-seg-hover" x={0} y={driverRect.y} width={W} height={driverRect.h} rx={8} />
      {/if}
      {@const driverDiag = diagonalLine(driverRect, [0, 1], W)}
      <line
        class="dialkit-cc-diagonal"
        x1={driverDiag.x1}
        y1={driverDiag.y1}
        x2={driverDiag.x2}
        y2={driverDiag.y2}
      />
      <path class="dialkit-cc-curve dialkit-cc-curve-driver" d={curvePath(driver!, driverRect, [0, 1], W)} />
      <text class="dialkit-cc-label" x={W * 0.5} y={driverRect.y + 13}>driver · {driver!.type}</text>
      <line
        bind:this={driverPlayheadEl}
        class="dialkit-cc-playhead"
        x1={0}
        y1={driverRect.y}
        x2={0}
        y2={driverRect.y + driverRect.h}
        style={playheadColor ? `stroke:${playheadColor}` : undefined}
      />
    {/if}
  </svg>
</div>
