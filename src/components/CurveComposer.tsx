import { useRef, useEffect, useMemo, useState } from 'react';
import {
  CurveComposition,
  CurveSegment,
  CurveDriver,
  DriverDirection,
  Rect,
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
  headerHit,
  applySegmentBodyDrag,
  applyDriverBodyDrag,
  composerLayout,
  mapY,
  curvePath,
  diagonalLine,
  playheadGeometry,
  timelineSlots,
  connectorPath,
  DEFAULT_TRIGGER_STEPS,
  DRAG_THRESHOLD,
  EDGE_HIT,
} from '../curve-composer-core';

export type {
  CurveType,
  CurveSegment,
  CurveDriver,
  CurveComposition,
  DriverDirection,
} from '../curve-composer-core';

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
  /** Index of the currently selected segment (highlighted); null/undefined for none. */
  selectedIndex?: number | null;
  /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
  onSelect?: (index: number) => void;
  /** Curve stroke color. Defaults to the theme text color. */
  curveColor?: string;
  /** Playhead / marker color. Defaults to the theme text color. */
  playheadColor?: string;
  /** 0..1 — space between segments; the value glides smoothly across each gap (faint connector). */
  gap?: number;
  /** Faint vertical reference grid behind each lane. */
  grid?: boolean;
  gridSubdivisions?: number;
  width?: number;
  /** Height of the main lane; the driver lane adds height below it. */
  height?: number;
}

// A drag in progress, captured against the composition state at press time so live
// commits compute from a stable baseline rather than compounding.
type Drag =
  | { kind: 'boundary'; index: number; startX: number; startY: number; base: CurveComposition; moved: boolean }
  | { kind: 'segment'; index: number; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean }
  | { kind: 'driver'; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean }
  | { kind: 'select'; index: number; startX: number; startY: number; moved: boolean };

export function CurveComposer({
  segments,
  driver = null,
  direction = 'forward',
  onSegmentsChange,
  onDriverChange,
  getPhase,
  phase = 0,
  mode = 'continuous',
  triggerSteps = DEFAULT_TRIGGER_STEPS,
  onTrigger,
  selectedIndex = null,
  onSelect,
  gap = 0,
  curveColor,
  playheadColor,
  grid = false,
  gridSubdivisions = 8,
  width = 256,
  height = 140,
}: CurveComposerProps) {
  const layout = composerLayout(width, height, driver != null);
  const { W, totalH, mainRect, driverRect } = layout;

  const composition: CurveComposition = useMemo(
    () => ({ segments, driver, direction, gap }),
    [segments, driver, direction, gap]
  );

  // Samplers + latest state for the rAF-driven playhead (read without re-rendering).
  const samplers = useMemo(() => buildSamplers(composition), [composition]);
  const liveRef = useRef({ composition, samplers, getPhase, phase, mode, triggerSteps });
  liveRef.current = { composition, samplers, getPhase, phase, mode, triggerSteps };
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  const svgRef = useRef<SVGSVGElement>(null);
  const seriesPlayheadRef = useRef<SVGLineElement>(null);
  const seriesDotRef = useRef<SVGCircleElement>(null);
  const driverPlayheadRef = useRef<SVGLineElement>(null);
  // Tracks the composed value across frames to detect upward trigger-level crossings.
  const prevTrigValue = useRef<number>(Number.NaN);

  const [drag, setDrag] = useState<Drag | null>(null);
  const [hover, setHover] = useState<{ kind: 'boundary' | 'segment' | 'driver' | 'header'; index: number } | null>(null);
  const dragRef = useRef<Drag | null>(null);
  dragRef.current = drag;

  // --- playhead loop (direct DOM writes, like the waveform's polled playhead) ---
  useEffect(() => {
    let raf = 0;
    // Re-prime crossing detection: a geometry-driven re-arm must not compare the first
    // frame against a value from the previous loop's composition (phantom trigger).
    prevTrigValue.current = Number.NaN;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const { composition: c, samplers: s, getPhase: gp, phase: p, mode: md, triggerSteps: ts } = liveRef.current;
      const u = gp ? gp() : p;
      const read = readComposition(c, u, s);
      const geo = playheadGeometry(read, layout);
      if (seriesPlayheadRef.current) {
        seriesPlayheadRef.current.setAttribute('x1', String(geo.seriesX));
        seriesPlayheadRef.current.setAttribute('x2', String(geo.seriesX));
      }
      if (seriesDotRef.current) {
        // The dot rides the active segment's own curve (a full min→max walk per segment).
        seriesDotRef.current.setAttribute('cx', String(geo.dotX));
        seriesDotRef.current.setAttribute('cy', String(geo.dotY));
      }
      if (driverPlayheadRef.current) {
        driverPlayheadRef.current.setAttribute('x1', String(geo.driverX));
        driverPlayheadRef.current.setAttribute('x2', String(geo.driverX));
      }
      // Trigger mode: emit when the composed VALUE crosses an evenly-spaced level. The
      // curve sets how fast the value reaches each level, so non-linear curves fire
      // unevenly in time. Visualization is the consumer's job (e.g. markers on the output
      // track the value dot travels) — the component only emits onTrigger.
      if (md === 'trigger') {
        const prev = prevTrigValue.current;
        if (!Number.isNaN(prev)) {
          for (const idx of triggersCrossed(prev, read.value, ts)) onTriggerRef.current?.(idx);
        }
        prevTrigValue.current = read.value;
      } else {
        prevTrigValue.current = Number.NaN;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // mapY/mainRect are derived from width/height which the loop reads via closure; only
    // the geometry inputs need to re-arm the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, totalH]);

  // --- pointer interaction ---

  const hitLayout = () => ({ totalH, driverY: driverRect ? driverRect.y : null, gap });

  const localCoords = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { ...toLocalCoords(clientX, clientY, rect, totalH), rectW: rect.width };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
    try {
      svgRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // No active pointer (e.g. a synthetic event) — capture is a nicety, not required.
    }

    // A press in a segment's header strip selects it (rather than cycling/dragging).
    const header = headerHit(xN, py, segments, hitLayout());
    if (typeof header === 'number') {
      setDrag({ kind: 'select', index: header, startX: e.clientX, startY: e.clientY, moved: false });
      return;
    }

    const target = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT / rectW);
    if (target.kind === 'driver') {
      setDrag({
        kind: 'driver',
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: driver!.curvature,
        baseSteepness: driver!.steepness,
        moved: false,
      });
    } else if (target.kind === 'boundary') {
      setDrag({ kind: 'boundary', index: target.index, startX: e.clientX, startY: e.clientY, base: composition, moved: false });
    } else {
      const seg = segments[target.index];
      setDrag({
        kind: 'segment',
        index: target.index,
        startX: e.clientX,
        startY: e.clientY,
        baseCurvature: seg?.curvature ?? 0,
        baseSteepness: seg?.steepness ?? 0,
        moved: false,
      });
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) {
      // Hover affordance only.
      const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
      if (typeof headerHit(xN, py, segments, hitLayout()) === 'number') {
        setHover({ kind: 'header', index: 0 });
        return;
      }
      const t = pointerTarget(xN, py, segments, hitLayout(), EDGE_HIT / rectW);
      setHover(t.kind === 'driver' ? { kind: 'driver', index: 0 } : { kind: t.kind, index: t.index });
      return;
    }

    const svgRect = svgRef.current!.getBoundingClientRect();
    const rectW = svgRect.width;
    const rectH = svgRect.height;
    // Either axis past the threshold counts as a drag (horizontal = energy, vertical = steepness).
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
    if (!moved) return;

    if (d.kind === 'boundary') {
      const deltaFrac = (e.clientX - d.startX) / rectW;
      const next = redistributeWeight(d.base, d.index, deltaFrac);
      onSegmentsChange?.(next.segments);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else if (d.kind === 'segment') {
      // Horizontal → energy bias; vertical (up = more) → steepness.
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applySegmentBodyDrag(composition, d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      onSegmentsChange?.(next.segments);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else if (d.kind === 'driver') {
      const dxFrac = (e.clientX - d.startX) / rectW;
      const dyFrac = (e.clientY - d.startY) / rectH;
      const next = applyDriverBodyDrag(composition, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
      if (next.driver) onDriverChange?.(next.driver);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else {
      // 'select': moving past the threshold cancels the click so it won't select on release.
      if (!d.moved) setDrag({ ...d, moved: true });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    setDrag(null);
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may not be held — ignore.
    }
    if (!d || d.moved) return;
    // An un-moved press is a click → select (header) or cycle the curve type (body).
    if (d.kind === 'select') {
      onSelect?.(d.index);
    } else if (d.kind === 'driver') {
      const next = cycleDriverType(composition);
      if (next.driver) onDriverChange?.(next.driver);
    } else if (d.kind === 'segment') {
      onSegmentsChange?.(cycleSegmentType(composition, d.index).segments);
    }
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    setDrag(null);
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may not be held — ignore (mirrors onPointerUp).
    }
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    const { xN, py } = localCoords(e.clientX, e.clientY);
    if (driverRect && py >= driverRect.y) return; // driver is a single curve
    onSegmentsChange?.(splitSegment(composition, segmentIndexAt(xN, segments, gap)).segments);
  };

  const activeKind = drag?.kind ?? hover?.kind;
  const cursor =
    activeKind === 'boundary'
      ? 'ew-resize'
      : activeKind === 'segment' || activeKind === 'driver'
        ? 'move'
        : activeKind === 'select' || activeKind === 'header'
          ? 'pointer'
          : 'default';

  // --- path builders (geometry + path strings come from the shared core) ---

  const interior = boundaries(segments, gap);

  const renderLaneGrid = (rect: Rect) => {
    if (!grid) return null;
    const n = Math.max(1, Math.round(gridSubdivisions));
    const lines = [];
    for (let i = 1; i < n; i++) {
      const gx = (i / n) * W;
      lines.push(
        <line key={`g-${rect.y}-${i}`} x1={gx} y1={rect.y} x2={gx} y2={rect.y + rect.h} className="dialkit-cc-grid" />
      );
    }
    return lines;
  };

  const renderLaneBg = (rect: Rect, key: string) => (
    <rect key={key} className="dialkit-cc-lane" x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={8} />
  );

  const diagonal = (rect: Rect, span: [number, number], key: string) => {
    const d = diagonalLine(rect, span, W);
    return <line key={key} className="dialkit-cc-diagonal" x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} />;
  };

  return (
    <div className="dialkit-cc-wrap" style={{ width: W }}>
      <svg
        ref={svgRef}
        className="dialkit-cc"
        viewBox={`0 0 ${W} ${totalH}`}
        width={W}
        height={totalH}
        style={{ width: W, height: totalH, cursor, color: curveColor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={() => !dragRef.current && setHover(null)}
        onDoubleClick={onDoubleClick}
      >
        {/* main lane */}
        {renderLaneBg(mainRect, 'main-bg')}
        {renderLaneGrid(mainRect)}

        {/* selected segment highlight */}
        {selectedIndex != null &&
          selectedIndex >= 0 &&
          selectedIndex < segments.length &&
          (() => {
            const span = segmentSpan(segments, selectedIndex, gap);
            return (
              <rect
                className="dialkit-cc-seg-selected"
                x={span[0] * W}
                y={mainRect.y}
                width={(span[1] - span[0]) * W}
                height={mainRect.h}
                rx={8}
              />
            );
          })()}

        {/* hovered segment highlight */}
        {hover?.kind === 'segment' &&
          !drag &&
          (() => {
            const span = segmentSpan(segments, hover.index, gap);
            return (
              <rect
                className="dialkit-cc-seg-hover"
                x={span[0] * W}
                y={mainRect.y}
                width={(span[1] - span[0]) * W}
                height={mainRect.h}
                rx={8}
              />
            );
          })()}

        {segments.map((seg, i) => {
          const span = segmentSpan(segments, i, gap);
          return (
            <g key={`seg-${i}`}>
              {diagonal(mainRect, span, `diag-${i}`)}
              <path className="dialkit-cc-curve" d={curvePath(seg, mainRect, span, W)} />
              <text className="dialkit-cc-label" x={(span[0] + span[1]) * 0.5 * W} y={mainRect.y + 13}>
                {seg.type}
              </text>
            </g>
          );
        })}

        {/* gap connectors: faint lines that glide each segment's end down to the next's start */}
        {gap > 0 &&
          timelineSlots(segments, gap)
            .filter((slot) => slot.kind === 'gap' && slot.b > slot.a)
            .map((slot) => (
              <path
                key={`conn-${slot.index}`}
                className="dialkit-cc-connector"
                d={connectorPath(slot, samplers, segments.length, mainRect, W)}
              />
            ))}

        {/* interior boundaries */}
        {interior.map((bx, i) => (
          <line
            key={`b-${i}`}
            className="dialkit-cc-boundary"
            data-active={String(
              hover?.kind === 'boundary' && hover.index === i || (drag?.kind === 'boundary' && drag.index === i)
            )}
            x1={bx * W}
            y1={mainRect.y}
            x2={bx * W}
            y2={mainRect.y + mainRect.h}
          />
        ))}

        {/* series playhead + value dot (rides the curve; this is the signal triggers read) */}
        <line ref={seriesPlayheadRef} className="dialkit-cc-playhead" x1={0} y1={mainRect.y} x2={0} y2={mainRect.y + mainRect.h} style={{ stroke: playheadColor }} />
        <circle ref={seriesDotRef} className="dialkit-cc-dot" cx={0} cy={mapY(mainRect, 0)} r={3} style={{ fill: playheadColor }} />

        {/* driver lane */}
        {driverRect && (
          <>
            {renderLaneBg(driverRect, 'driver-bg')}
            {renderLaneGrid(driverRect)}
            {hover?.kind === 'driver' && !drag && (
              <rect className="dialkit-cc-seg-hover" x={0} y={driverRect.y} width={W} height={driverRect.h} rx={8} />
            )}
            {diagonal(driverRect, [0, 1], 'driver-diag')}
            <path className="dialkit-cc-curve dialkit-cc-curve-driver" d={curvePath(driver!, driverRect, [0, 1], W)} />
            <text className="dialkit-cc-label" x={W * 0.5} y={driverRect.y + 13}>
              driver · {driver!.type}
            </text>
            <line ref={driverPlayheadRef} className="dialkit-cc-playhead" x1={0} y1={driverRect.y} x2={0} y2={driverRect.y + driverRect.h} style={{ stroke: playheadColor }} />
          </>
        )}
      </svg>
    </div>
  );
}
