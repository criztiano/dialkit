import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
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
  boundaryAt,
  boundaries,
  splitSegment,
  cycleSegmentType,
  setSegmentCurvature,
  redistributeWeight,
  cycleDriverType,
  setDriverCurvature,
  readComposition,
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
  | { kind: 'boundary'; index: number; startX: number; base: CurveComposition; moved: boolean }
  | { kind: 'segment'; index: number; startX: number; baseCurvature: number; moved: boolean }
  | { kind: 'driver'; startX: number; baseCurvature: number; moved: boolean };

export function CurveComposer({
  segments,
  driver = null,
  direction = 'forward',
  onSegmentsChange,
  onDriverChange,
  getPhase,
  phase = 0,
  curveColor,
  playheadColor,
  grid = false,
  gridSubdivisions = 8,
  width = 256,
  height = 140,
}: CurveComposerProps) {
  const W = width;
  const laneH = height;
  const driverH = driver ? Math.round(height * DRIVER_FRAC) : 0;
  const totalH = laneH + (driver ? GAP + driverH : 0);

  const mainRect: Rect = { x: 0, y: 0, w: W, h: laneH };
  const driverRect: Rect | null = driver ? { x: 0, y: laneH + GAP, w: W, h: driverH } : null;

  const composition: CurveComposition = useMemo(
    () => ({ segments, driver, direction }),
    [segments, driver, direction]
  );

  // Samplers + latest state for the rAF-driven playhead (read without re-rendering).
  const samplers = useMemo(() => buildSamplers(composition), [composition]);
  const liveRef = useRef({ composition, samplers, getPhase, phase });
  liveRef.current = { composition, samplers, getPhase, phase };

  const svgRef = useRef<SVGSVGElement>(null);
  const seriesPlayheadRef = useRef<SVGLineElement>(null);
  const seriesDotRef = useRef<SVGCircleElement>(null);
  const driverPlayheadRef = useRef<SVGLineElement>(null);

  const [drag, setDrag] = useState<Drag | null>(null);
  const [hover, setHover] = useState<{ kind: 'boundary' | 'segment' | 'driver'; index: number } | null>(null);
  const dragRef = useRef<Drag | null>(null);
  dragRef.current = drag;

  // --- coordinate helpers ---

  const padY = (r: Rect) => r.h * PAD_FRAC;
  const mapY = (r: Rect, ny: number) => {
    const top = r.y + padY(r);
    const bot = r.y + r.h - padY(r);
    return bot - ny * (bot - top);
  };

  // --- playhead loop (direct DOM writes, like the waveform's polled playhead) ---
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const { composition: c, samplers: s, getPhase: gp, phase: p } = liveRef.current;
      const u = gp ? gp() : p;
      const read = readComposition(c, u, s);
      const sx = read.warpedPhase * W;
      if (seriesPlayheadRef.current) {
        seriesPlayheadRef.current.setAttribute('x1', String(sx));
        seriesPlayheadRef.current.setAttribute('x2', String(sx));
      }
      if (seriesDotRef.current) {
        // The dot rides the visible per-box curve, so it uses the segment-local value.
        seriesDotRef.current.setAttribute('cx', String(sx));
        seriesDotRef.current.setAttribute('cy', String(mapY(mainRect, read.localValue)));
      }
      if (driverPlayheadRef.current) {
        const dx = read.inputPhase * W;
        driverPlayheadRef.current.setAttribute('x1', String(dx));
        driverPlayheadRef.current.setAttribute('x2', String(dx));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // mapY/mainRect are derived from width/height which the loop reads via closure; only
    // the geometry inputs need to re-arm the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, laneH, driverH]);

  // --- pointer interaction ---

  const localCoords = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const xN = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const py = ((clientY - rect.top) / rect.height) * totalH;
    return { xN, py, rectW: rect.width };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
    svgRef.current?.setPointerCapture(e.pointerId);

    // Driver lane?
    if (driverRect && py >= driverRect.y) {
      setDrag({ kind: 'driver', startX: e.clientX, baseCurvature: driver!.curvature, moved: false });
      return;
    }
    // Main lane: boundary grab takes priority over the segment body.
    const edgeHitNorm = EDGE_HIT / rectW;
    const bIdx = boundaryAt(xN, segments, edgeHitNorm);
    if (bIdx != null) {
      setDrag({ kind: 'boundary', index: bIdx, startX: e.clientX, base: composition, moved: false });
      return;
    }
    const sIdx = segmentIndexAt(xN, segments);
    setDrag({
      kind: 'segment',
      index: sIdx,
      startX: e.clientX,
      baseCurvature: segments[sIdx]?.curvature ?? 1,
      moved: false,
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) {
      // Hover affordance only.
      const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
      if (driverRect && py >= driverRect.y) {
        setHover({ kind: 'driver', index: 0 });
      } else {
        const bIdx = boundaryAt(xN, segments, EDGE_HIT / rectW);
        if (bIdx != null) setHover({ kind: 'boundary', index: bIdx });
        else setHover({ kind: 'segment', index: segmentIndexAt(xN, segments) });
      }
      return;
    }

    const rectW = svgRef.current!.getBoundingClientRect().width;
    const moved = Math.abs(e.clientX - d.startX) > DRAG_THRESHOLD;
    if (!moved) return;

    if (d.kind === 'boundary') {
      const deltaFrac = (e.clientX - d.startX) / rectW;
      const next = redistributeWeight(d.base, d.index, deltaFrac);
      onSegmentsChange?.(next.segments);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else if (d.kind === 'segment') {
      const dCurv = (e.clientX - d.startX) / (rectW * 0.6);
      const next = setSegmentCurvature(composition, d.index, d.baseCurvature + dCurv);
      onSegmentsChange?.(next.segments);
      if (!d.moved) setDrag({ ...d, moved: true });
    } else {
      const dCurv = (e.clientX - d.startX) / (rectW * 0.6);
      const next = setDriverCurvature(composition, d.baseCurvature + dCurv);
      if (next.driver) onDriverChange?.(next.driver);
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
    // An un-moved press is a click → cycle the curve type.
    if (d.kind === 'driver') {
      const next = cycleDriverType(composition);
      if (next.driver) onDriverChange?.(next.driver);
    } else if (d.kind === 'segment') {
      onSegmentsChange?.(cycleSegmentType(composition, d.index).segments);
    }
  };

  const onPointerCancel = () => setDrag(null);

  const onDoubleClick = (e: React.MouseEvent) => {
    const { xN, py } = localCoords(e.clientX, e.clientY);
    if (driverRect && py >= driverRect.y) return; // driver is a single curve
    onSegmentsChange?.(splitSegment(composition, segmentIndexAt(xN, segments)).segments);
  };

  const cursor = drag
    ? drag.kind === 'boundary'
      ? 'ew-resize'
      : 'ew-resize'
    : hover
      ? 'ew-resize'
      : 'default';

  // --- path builders ---

  const curvePath = useCallback(
    (curve: CurveSegment | CurveDriver, rect: Rect, span: [number, number]): string => {
      const x = (nx: number) => (span[0] + nx * (span[1] - span[0])) * W;
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
      const e = deriveEase(curve.type, curve.curvature);
      return `M ${x(0)} ${y(0)} C ${x(e[0])} ${y(e[1])}, ${x(e[2])} ${y(e[3])}, ${x(1)} ${y(1)}`;
    },
    // mapY depends on the rect passed in; W is closed over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [W, laneH, driverH]
  );

  const interior = boundaries(segments);

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

  const diagonal = (rect: Rect, span: [number, number], key: string) => (
    <line
      key={key}
      className="dialkit-cc-diagonal"
      x1={span[0] * W}
      y1={mapY(rect, 0)}
      x2={span[1] * W}
      y2={mapY(rect, 1)}
    />
  );

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

        {/* hovered segment highlight */}
        {hover?.kind === 'segment' &&
          !drag &&
          (() => {
            const span = segmentSpan(segments, hover.index);
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
          const span = segmentSpan(segments, i);
          return (
            <g key={`seg-${i}`}>
              {diagonal(mainRect, span, `diag-${i}`)}
              <path className="dialkit-cc-curve" d={curvePath(seg, mainRect, span)} />
              <text className="dialkit-cc-label" x={(span[0] + span[1]) * 0.5 * W} y={mainRect.y + 13}>
                {seg.type}
              </text>
            </g>
          );
        })}

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

        {/* series playhead + dot */}
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
            <path className="dialkit-cc-curve dialkit-cc-curve-driver" d={curvePath(driver!, driverRect, [0, 1])} />
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
