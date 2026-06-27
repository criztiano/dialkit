import { createMemo, createSignal, For, mergeProps, onCleanup, onMount, Show } from 'solid-js';
import {
  CurveComposition,
  CurveSegment,
  CurveDriver,
  DriverDirection,
  Sampler,
  deriveEase,
  buildSampler,
  buildSamplers,
  segmentSpan,
  segmentIndexAt,
  boundaries,
  splitSegment,
  cycleSegmentType,
  redistributeWeight,
  cycleDriverType,
  readComposition,
  triggersCrossed,
  toLocalCoords,
  pointerTarget,
  applySegmentBodyDrag,
  applyDriverBodyDrag,
  DEFAULT_TRIGGER_STEPS,
  DRAG_THRESHOLD,
  EDGE_HIT,
} from '../../curve-composer-core';

export type {
  CurveType,
  CurveSegment,
  CurveDriver,
  CurveComposition,
  DriverDirection,
} from '../../curve-composer-core';

interface CurveComposerProps {
  /** The curve series (controlled). */
  segments: CurveSegment[];
  /** The stacked driver curve, or null for none (adds a second lane below). */
  driver?: CurveDriver | null;
  /** Playback direction for the demo playhead (forward / mirror / reverse). */
  direction?: DriverDirection;
  /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
  onSegmentsChange?: (segments: CurveSegment[]) => void;
  /** Commit a changed driver — fired live during driver drags and on click-cycle. */
  onDriverChange?: (driver: CurveDriver) => void;
  /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
  getPhase?: () => number;
  /** Static transport phase 0..1 (used when `getPhase` is absent). */
  phase?: number;
  /**
   * Output mode. 'continuous' (default) reads the composed value each frame; 'trigger'
   * emits a discrete signal (via `onTrigger`) when the composed value crosses one of the
   * evenly-spaced trigger levels. The component itself draws no trigger UI — visualization
   * (e.g. markers on the output track) is the consumer's job; see `onTrigger`.
   *
   * Trigger firing is direction-symmetric: interior levels fire in whichever direction the
   * value travels, so it works under `direction: 'forward' | 'mirror' | 'reverse'`.
   */
  mode?: 'continuous' | 'trigger';
  /** Number of trigger levels in trigger mode (first at 0, last at 1, evenly spaced in value). Default 5. */
  triggerSteps?: number;
  /** Fired in trigger mode when the value crosses a trigger level; `index` is into `triggerLevels`. */
  onTrigger?: (index: number) => void;
  /** Curve stroke color. Defaults to the theme text color. */
  curveColor?: string;
  /** Playhead / marker color. Defaults to the theme text color. */
  playheadColor?: string;
  /** Faint vertical reference grid behind each lane. */
  grid?: boolean;
  gridSubdivisions?: number;
  width?: number;
  /** Height of the main lane; the driver lane adds height below it. */
  height?: number;
}

const GAP = 10; // px between the main lane and the driver lane
const PAD_FRAC = 0.18; // vertical headroom inside a lane (room for spring overshoot)
const DRIVER_FRAC = 0.55; // driver lane height relative to the main lane

type Rect = { x: number; y: number; w: number; h: number };

// A drag in progress, captured against the composition state at press time so live
// commits compute from a stable baseline rather than compounding.
type Drag =
  | { kind: 'boundary'; index: number; startX: number; startY: number; base: CurveComposition; moved: boolean }
  | { kind: 'segment'; index: number; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean }
  | { kind: 'driver'; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean };

export function CurveComposer(props: CurveComposerProps) {
  const p = mergeProps(
    {
      driver: null as CurveDriver | null,
      direction: 'forward' as DriverDirection,
      phase: 0,
      mode: 'continuous' as 'continuous' | 'trigger',
      triggerSteps: DEFAULT_TRIGGER_STEPS,
      grid: false,
      gridSubdivisions: 8,
      width: 256,
      height: 140,
    },
    props
  );

  const W = () => p.width;
  const laneH = () => p.height;
  const driverH = () => (p.driver ? Math.round(p.height * DRIVER_FRAC) : 0);
  const totalH = () => laneH() + (p.driver ? GAP + driverH() : 0);

  const mainRect = (): Rect => ({ x: 0, y: 0, w: W(), h: laneH() });
  const driverRect = (): Rect | null =>
    p.driver ? { x: 0, y: laneH() + GAP, w: W(), h: driverH() } : null;

  const composition = createMemo<CurveComposition>(() => ({
    segments: p.segments,
    driver: p.driver,
    direction: p.direction,
  }));
  // Samplers for the rAF-driven playhead, rebuilt reactively when the composition changes.
  const samplers = createMemo(() => buildSamplers(composition()));

  let svgEl: SVGSVGElement | undefined;
  let seriesPlayheadEl: SVGLineElement | undefined;
  let seriesDotEl: SVGCircleElement | undefined;
  let driverPlayheadEl: SVGLineElement | undefined;

  // In-progress drag (plain mutable — the rAF loop and pointer handlers read it directly).
  let drag: Drag | null = null;
  const [hover, setHover] = createSignal<{ kind: 'boundary' | 'segment' | 'driver'; index: number } | null>(null);

  // --- coordinate helpers ---

  const padY = (r: Rect) => r.h * PAD_FRAC;
  const mapY = (r: Rect, ny: number) => {
    const top = r.y + padY(r);
    const bot = r.y + r.h - padY(r);
    return bot - ny * (bot - top);
  };

  // --- playhead loop (direct DOM writes, like the waveform's polled playhead) ---
  onMount(() => {
    let raf = 0;
    // Tracks the composed value across frames to detect trigger-level crossings.
    let prevTrigValue = Number.NaN;
    // Re-prime crossing detection whenever the geometry inputs change so the first frame
    // after a re-arm never compares against a stale value (phantom trigger).
    let armKey = '';
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const w = W();
      const mr = mainRect();
      const key = `${w}|${laneH()}|${driverH()}`;
      if (key !== armKey) {
        prevTrigValue = Number.NaN;
        armKey = key;
      }
      const u = p.getPhase ? p.getPhase() : p.phase;
      const read = readComposition(composition(), u, samplers());
      const sx = read.warpedPhase * w;
      if (seriesPlayheadEl) {
        seriesPlayheadEl.setAttribute('x1', String(sx));
        seriesPlayheadEl.setAttribute('x2', String(sx));
      }
      if (seriesDotEl) {
        // The dot rides the active segment's own curve (a full min→max walk per segment).
        seriesDotEl.setAttribute('cx', String(sx));
        seriesDotEl.setAttribute('cy', String(mapY(mr, read.value)));
      }
      if (driverPlayheadEl) {
        const dx = read.inputPhase * w;
        driverPlayheadEl.setAttribute('x1', String(dx));
        driverPlayheadEl.setAttribute('x2', String(dx));
      }
      // Trigger mode: emit when the composed VALUE crosses an evenly-spaced level. The
      // curve sets how fast the value reaches each level, so non-linear curves fire
      // unevenly in time. Visualization is the consumer's job — the component only emits.
      if (p.mode === 'trigger') {
        if (!Number.isNaN(prevTrigValue)) {
          for (const idx of triggersCrossed(prevTrigValue, read.value, p.triggerSteps)) p.onTrigger?.(idx);
        }
        prevTrigValue = read.value;
      } else {
        prevTrigValue = Number.NaN;
      }
    };
    raf = requestAnimationFrame(tick);
    onCleanup(() => cancelAnimationFrame(raf));
  });

  // --- pointer interaction ---

  const hitLayout = () => {
    const dr = driverRect();
    return { totalH: totalH(), driverY: dr ? dr.y : null };
  };

  const localCoords = (clientX: number, clientY: number) => {
    const rect = svgEl!.getBoundingClientRect();
    return { ...toLocalCoords(clientX, clientY, rect, totalH()), rectW: rect.width };
  };

  const onPointerDown = (e: PointerEvent) => {
    const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
    try {
      svgEl?.setPointerCapture(e.pointerId);
    } catch {
      // No active pointer (e.g. a synthetic event) — capture is a nicety, not required.
    }

    const target = pointerTarget(xN, py, p.segments, hitLayout(), EDGE_HIT / rectW);
    if (target.kind === 'driver') {
      drag = {
        kind: 'driver',
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: p.driver!.curvature,
        baseSteepness: p.driver!.steepness,
        moved: false,
      };
    } else if (target.kind === 'boundary') {
      drag = { kind: 'boundary', index: target.index, startX: e.clientX, startY: e.clientY, base: composition(), moved: false };
    } else {
      const seg = p.segments[target.index];
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
  };

  const onPointerMove = (e: PointerEvent) => {
    const d = drag;
    if (!d) {
      // Hover affordance only.
      const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
      const t = pointerTarget(xN, py, p.segments, hitLayout(), EDGE_HIT / rectW);
      setHover(t.kind === 'driver' ? { kind: 'driver', index: 0 } : { kind: t.kind, index: t.index });
      return;
    }

    const svgRect = svgEl!.getBoundingClientRect();
    const rectW = svgRect.width;
    const rectH = svgRect.height;
    // Either axis past the threshold counts as a drag (horizontal = energy, vertical = steepness).
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
    if (!moved) return;

    if (d.kind === 'boundary') {
      const deltaFrac = (e.clientX - d.startX) / rectW;
      const next = redistributeWeight(d.base, d.index, deltaFrac);
      p.onSegmentsChange?.(next.segments);
      d.moved = true;
    } else if (d.kind === 'segment') {
      // Horizontal → energy bias; vertical (up = more) → steepness.
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applySegmentBodyDrag(composition(), d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      p.onSegmentsChange?.(next.segments);
      d.moved = true;
    } else {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applyDriverBodyDrag(composition(), d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      if (next.driver) p.onDriverChange?.(next.driver);
      d.moved = true;
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    const d = drag;
    drag = null;
    try {
      svgEl?.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may not be held — ignore.
    }
    if (!d || d.moved) return;
    // An un-moved press is a click → cycle the curve type.
    if (d.kind === 'driver') {
      const next = cycleDriverType(composition());
      if (next.driver) p.onDriverChange?.(next.driver);
    } else if (d.kind === 'segment') {
      p.onSegmentsChange?.(cycleSegmentType(composition(), d.index).segments);
    }
  };

  const onPointerCancel = (e: PointerEvent) => {
    drag = null;
    try {
      svgEl?.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may not be held — ignore (mirrors onPointerUp).
    }
  };

  const onDoubleClick = (e: MouseEvent) => {
    const { xN, py } = localCoords(e.clientX, e.clientY);
    const dr = driverRect();
    if (dr && py >= dr.y) return; // driver is a single curve
    p.onSegmentsChange?.(splitSegment(composition(), segmentIndexAt(xN, p.segments)).segments);
  };

  const cursor = () => {
    const h = hover();
    const activeKind = drag?.kind ?? h?.kind;
    return activeKind === 'boundary'
      ? 'ew-resize'
      : activeKind === 'segment' || activeKind === 'driver'
        ? 'move'
        : 'default';
  };

  // --- path builders ---

  const curvePath = (curve: CurveSegment | CurveDriver, rect: Rect, span: [number, number]): string => {
    const w = W();
    const x = (nx: number) => (span[0] + nx * (span[1] - span[0])) * w;
    const y = (ny: number) => mapY(rect, ny);
    if (curve.type === 'spring') {
      const sampler: Sampler = buildSampler(curve);
      const n = 40;
      let d = `M ${x(0)} ${y(sampler(0))}`;
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        d += ` L ${x(t)} ${y(sampler(t))}`;
      }
      return d;
    }
    const e = deriveEase(curve.type, curve.curvature, curve.steepness);
    return `M ${x(0)} ${y(0)} C ${x(e[0])} ${y(e[1])}, ${x(e[2])} ${y(e[3])}, ${x(1)} ${y(1)}`;
  };

  const interior = () => boundaries(p.segments);

  const laneGridLines = (rect: Rect) => {
    if (!p.grid) return [];
    const n = Math.max(1, Math.round(p.gridSubdivisions));
    const lines: { gx: number; y1: number; y2: number }[] = [];
    for (let i = 1; i < n; i++) {
      lines.push({ gx: (i / n) * W(), y1: rect.y, y2: rect.y + rect.h });
    }
    return lines;
  };

  return (
    <div class="dialkit-cc-wrap" style={{ width: `${W()}px` }}>
      <svg
        ref={svgEl}
        class="dialkit-cc"
        viewBox={`0 0 ${W()} ${totalH()}`}
        width={W()}
        height={totalH()}
        style={{ width: `${W()}px`, height: `${totalH()}px`, cursor: cursor(), color: p.curveColor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={() => !drag && setHover(null)}
        onDblClick={onDoubleClick}
      >
        {/* main lane */}
        <rect class="dialkit-cc-lane" x={mainRect().x} y={mainRect().y} width={mainRect().w} height={mainRect().h} rx={8} />
        <For each={laneGridLines(mainRect())}>
          {(g) => <line class="dialkit-cc-grid" x1={g.gx} y1={g.y1} x2={g.gx} y2={g.y2} />}
        </For>

        {/* hovered segment highlight */}
        <Show when={hover()?.kind === 'segment' && !drag}>
          {(() => {
            const span = segmentSpan(p.segments, hover()!.index);
            const mr = mainRect();
            return (
              <rect
                class="dialkit-cc-seg-hover"
                x={span[0] * W()}
                y={mr.y}
                width={(span[1] - span[0]) * W()}
                height={mr.h}
                rx={8}
              />
            );
          })()}
        </Show>

        <For each={p.segments}>
          {(seg, i) => {
            const span = () => segmentSpan(p.segments, i());
            const mr = () => mainRect();
            return (
              <g>
                <line
                  class="dialkit-cc-diagonal"
                  x1={span()[0] * W()}
                  y1={mapY(mr(), 0)}
                  x2={span()[1] * W()}
                  y2={mapY(mr(), 1)}
                />
                <path class="dialkit-cc-curve" d={curvePath(seg, mr(), span())} />
                <text class="dialkit-cc-label" x={(span()[0] + span()[1]) * 0.5 * W()} y={mr().y + 13}>
                  {seg.type}
                </text>
              </g>
            );
          }}
        </For>

        {/* interior boundaries */}
        <For each={interior()}>
          {(bx, i) => {
            const mr = mainRect();
            const active = () => {
              const h = hover();
              return (h?.kind === 'boundary' && h.index === i()) || (drag?.kind === 'boundary' && drag.index === i());
            };
            return (
              <line
                class="dialkit-cc-boundary"
                data-active={String(active())}
                x1={bx * W()}
                y1={mr.y}
                x2={bx * W()}
                y2={mr.y + mr.h}
              />
            );
          }}
        </For>

        {/* series playhead + value dot (rides the curve; this is the signal triggers read) */}
        <line
          ref={seriesPlayheadEl}
          class="dialkit-cc-playhead"
          x1={0}
          y1={mainRect().y}
          x2={0}
          y2={mainRect().y + mainRect().h}
          style={{ stroke: p.playheadColor }}
        />
        <circle
          ref={seriesDotEl}
          class="dialkit-cc-dot"
          cx={0}
          cy={mapY(mainRect(), 0)}
          r={3}
          style={{ fill: p.playheadColor }}
        />

        {/* driver lane */}
        <Show when={driverRect()}>
          {(dr) => (
            <>
              <rect class="dialkit-cc-lane" x={dr().x} y={dr().y} width={dr().w} height={dr().h} rx={8} />
              <For each={laneGridLines(dr())}>
                {(g) => <line class="dialkit-cc-grid" x1={g.gx} y1={g.y1} x2={g.gx} y2={g.y2} />}
              </For>
              <Show when={hover()?.kind === 'driver' && !drag}>
                <rect class="dialkit-cc-seg-hover" x={0} y={dr().y} width={W()} height={dr().h} rx={8} />
              </Show>
              <line
                class="dialkit-cc-diagonal"
                x1={0 * W()}
                y1={mapY(dr(), 0)}
                x2={1 * W()}
                y2={mapY(dr(), 1)}
              />
              <path class="dialkit-cc-curve dialkit-cc-curve-driver" d={curvePath(p.driver!, dr(), [0, 1])} />
              <text class="dialkit-cc-label" x={W() * 0.5} y={dr().y + 13}>
                driver · {p.driver!.type}
              </text>
              <line
                ref={driverPlayheadEl}
                class="dialkit-cc-playhead"
                x1={0}
                y1={dr().y}
                x2={0}
                y2={dr().y + dr().h}
                style={{ stroke: p.playheadColor }}
              />
            </>
          )}
        </Show>
      </svg>
    </div>
  );
}
