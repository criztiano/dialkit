import {
  defineComponent,
  h,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  type PropType,
  type VNode,
} from 'vue';
import {
  type CurveComposition,
  type CurveSegment,
  type CurveDriver,
  type DriverDirection,
  type CompositionSamplers,
  type Rect,
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

// A drag in progress, captured against the composition state at press time so live
// commits compute from a stable baseline rather than compounding.
type Drag =
  | { kind: 'boundary'; index: number; startX: number; startY: number; base: CurveComposition; moved: boolean }
  | { kind: 'segment'; index: number; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean }
  | { kind: 'driver'; startX: number; startY: number; baseCurvature: number; baseSteepness: number; moved: boolean }
  | { kind: 'select'; index: number; startX: number; startY: number; moved: boolean };

type Hover = { kind: 'boundary' | 'segment' | 'driver' | 'header'; index: number };

export const CurveComposer = defineComponent({
  name: 'DialKitCurveComposer',
  props: {
    /** The curve series (controlled). */
    segments: { type: Array as PropType<CurveSegment[]>, required: true },
    /** The stacked driver curve, or null for none (adds a second lane below). */
    driver: { type: Object as PropType<CurveDriver | null>, default: null },
    /** Playback direction for the demo playhead (forward / mirror / reverse). */
    direction: { type: String as PropType<DriverDirection>, default: 'forward' },
    /** Commit a changed series — fired live during boundary/curvature drags and on click-cycle. */
    onSegmentsChange: { type: Function as PropType<(segments: CurveSegment[]) => void>, default: undefined },
    /** Commit a changed driver — fired live during driver drags and on click-cycle. */
    onDriverChange: { type: Function as PropType<(driver: CurveDriver) => void>, default: undefined },
    /** Raw transport phase 0..1, polled every frame for a smooth playhead (no parent re-render). */
    getPhase: { type: Function as PropType<() => number>, default: undefined },
    /** Static transport phase 0..1 (used when `getPhase` is absent). */
    phase: { type: Number, default: 0 },
    /** Output mode. 'continuous' reads the composed value each frame; 'trigger' emits via onTrigger. */
    mode: { type: String as PropType<'continuous' | 'trigger'>, default: 'continuous' },
    /** Number of trigger levels in trigger mode. */
    triggerSteps: { type: Number, default: DEFAULT_TRIGGER_STEPS },
    /** Fired in trigger mode when the value crosses a trigger level. */
    onTrigger: { type: Function as PropType<(index: number) => void>, default: undefined },
    /** Index of the currently selected segment (highlighted); null/undefined for none. */
    selectedIndex: { type: Number as PropType<number | null>, default: null },
    /** Fired when a segment's header strip is clicked — lets the consumer target it (flip/remove/…). */
    onSelect: { type: Function as PropType<(index: number) => void>, default: undefined },
    /** Curve stroke color. Defaults to the theme text color. */
    curveColor: { type: String, default: undefined },
    /** Playhead / marker color. Defaults to the theme text color. */
    playheadColor: { type: String, default: undefined },
    /** Faint vertical reference grid behind each lane. */
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    width: { type: Number, default: 256 },
    /** Height of the main lane; the driver lane adds height below it. */
    height: { type: Number, default: 140 },
  },
  setup(props) {
    const svgRef = ref<SVGSVGElement | null>(null);
    const seriesPlayheadRef = ref<SVGLineElement | null>(null);
    const seriesDotRef = ref<SVGCircleElement | null>(null);
    const driverPlayheadRef = ref<SVGLineElement | null>(null);

    // In-progress drag + hover state.
    const drag = ref<Drag | null>(null);
    const hover = ref<Hover | null>(null);

    // --- geometry (reactive over width/height/driver presence; derived from the shared core) ---
    const layout = computed(() => composerLayout(props.width, props.height, props.driver != null));
    const W = computed(() => layout.value.W);
    const totalH = computed(() => layout.value.totalH);
    const mainRect = computed<Rect>(() => layout.value.mainRect);
    const driverRect = computed<Rect | null>(() => layout.value.driverRect);

    const composition = computed<CurveComposition>(() => ({
      segments: props.segments,
      driver: props.driver,
      direction: props.direction,
    }));

    // Samplers for the rAF-driven playhead, rebuilt when the composition changes.
    const samplers = computed<CompositionSamplers>(() => buildSamplers(composition.value));

    // --- playhead loop (direct DOM writes, like the waveform's polled playhead) ---
    let raf = 0;
    // Tracks the composed value across frames to detect trigger-level crossings.
    let prevTrigValue = Number.NaN;
    // Re-arm tracking: snapshot the geometry inside the tick so the reset is atomic with
    // the read. A separate async `watch` would flush a frame late and could let one tick
    // compare across two compositions (a phantom trigger). W + totalH together capture every
    // geometry change (width, height, driver presence).
    let armW = Number.NaN;
    let armTotalH = Number.NaN;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (W.value !== armW || totalH.value !== armTotalH) {
        prevTrigValue = Number.NaN;
        armW = W.value;
        armTotalH = totalH.value;
      }
      const c = composition.value;
      const s = samplers.value;
      const u = props.getPhase ? props.getPhase() : props.phase;
      const read = readComposition(c, u, s);
      const geo = playheadGeometry(read, layout.value);
      if (seriesPlayheadRef.value) {
        seriesPlayheadRef.value.setAttribute('x1', String(geo.seriesX));
        seriesPlayheadRef.value.setAttribute('x2', String(geo.seriesX));
      }
      if (seriesDotRef.value) {
        // The dot rides the active segment's own curve (a full min→max walk per segment).
        seriesDotRef.value.setAttribute('cx', String(geo.dotX));
        seriesDotRef.value.setAttribute('cy', String(geo.dotY));
      }
      if (driverPlayheadRef.value) {
        driverPlayheadRef.value.setAttribute('x1', String(geo.driverX));
        driverPlayheadRef.value.setAttribute('x2', String(geo.driverX));
      }
      // Trigger mode: emit when the composed VALUE crosses an evenly-spaced level.
      if (props.mode === 'trigger') {
        const prev = prevTrigValue;
        if (!Number.isNaN(prev)) {
          for (const idx of triggersCrossed(prev, read.value, props.triggerSteps)) props.onTrigger?.(idx);
        }
        prevTrigValue = read.value;
      } else {
        prevTrigValue = Number.NaN;
      }
    };

    onMounted(() => {
      raf = requestAnimationFrame(tick);
    });
    onBeforeUnmount(() => cancelAnimationFrame(raf));

    // --- pointer interaction ---
    const hitLayout = () => ({ totalH: totalH.value, driverY: driverRect.value ? driverRect.value.y : null });

    const localCoords = (clientX: number, clientY: number) => {
      const rect = svgRef.value!.getBoundingClientRect();
      return { ...toLocalCoords(clientX, clientY, rect, totalH.value), rectW: rect.width };
    };

    const onPointerDown = (e: PointerEvent) => {
      const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
      try {
        svgRef.value?.setPointerCapture(e.pointerId);
      } catch {
        // No active pointer (e.g. a synthetic event) — capture is a nicety, not required.
      }

      // A press in a segment's header strip selects it (rather than cycling/dragging).
      const header = headerHit(xN, py, props.segments, hitLayout());
      if (typeof header === 'number') {
        drag.value = { kind: 'select', index: header, startX: e.clientX, startY: e.clientY, moved: false };
        return;
      }

      const target = pointerTarget(xN, py, props.segments, hitLayout(), EDGE_HIT / rectW);
      if (target.kind === 'driver') {
        drag.value = {
          kind: 'driver',
          startX: e.clientX,
          startY: e.clientY,
          baseCurvature: props.driver!.curvature,
          baseSteepness: props.driver!.steepness,
          moved: false,
        };
      } else if (target.kind === 'boundary') {
        drag.value = {
          kind: 'boundary',
          index: target.index,
          startX: e.clientX,
          startY: e.clientY,
          base: composition.value,
          moved: false,
        };
      } else {
        const seg = props.segments[target.index];
        drag.value = {
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
      const d = drag.value;
      if (!d) {
        // Hover affordance only.
        const { xN, py, rectW } = localCoords(e.clientX, e.clientY);
        if (typeof headerHit(xN, py, props.segments, hitLayout()) === 'number') {
          hover.value = { kind: 'header', index: 0 };
          return;
        }
        const t = pointerTarget(xN, py, props.segments, hitLayout(), EDGE_HIT / rectW);
        hover.value = t.kind === 'driver' ? { kind: 'driver', index: 0 } : { kind: t.kind, index: t.index };
        return;
      }

      const svgRect = svgRef.value!.getBoundingClientRect();
      const rectW = svgRect.width;
      const rectH = svgRect.height;
      // Either axis past the threshold counts as a drag (horizontal = energy, vertical = steepness).
      const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
      if (!moved) return;

      if (d.kind === 'boundary') {
        const deltaFrac = (e.clientX - d.startX) / rectW;
        const next = redistributeWeight(d.base, d.index, deltaFrac);
        props.onSegmentsChange?.(next.segments);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else if (d.kind === 'segment') {
        const dxFrac = (e.clientX - d.startX) / rectW;
        const dyFrac = (e.clientY - d.startY) / rectH;
        const next = applySegmentBodyDrag(composition.value, d.index, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
        props.onSegmentsChange?.(next.segments);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else if (d.kind === 'driver') {
        const dxFrac = (e.clientX - d.startX) / rectW;
        const dyFrac = (e.clientY - d.startY) / rectH;
        const next = applyDriverBodyDrag(composition.value, d.baseCurvature, d.baseSteepness, dxFrac, dyFrac);
        if (next.driver) props.onDriverChange?.(next.driver);
        if (!d.moved) drag.value = { ...d, moved: true };
      } else {
        // 'select': moving past the threshold cancels the click so it won't select on release.
        if (!d.moved) drag.value = { ...d, moved: true };
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const d = drag.value;
      drag.value = null;
      try {
        svgRef.value?.releasePointerCapture(e.pointerId);
      } catch {
        // Capture may not be held — ignore.
      }
      if (!d || d.moved) return;
      // An un-moved press is a click → select (header) or cycle the curve type (body).
      if (d.kind === 'select') {
        props.onSelect?.(d.index);
      } else if (d.kind === 'driver') {
        const next = cycleDriverType(composition.value);
        if (next.driver) props.onDriverChange?.(next.driver);
      } else if (d.kind === 'segment') {
        props.onSegmentsChange?.(cycleSegmentType(composition.value, d.index).segments);
      }
    };

    const onPointerCancel = (e: PointerEvent) => {
      drag.value = null;
      try {
        svgRef.value?.releasePointerCapture(e.pointerId);
      } catch {
        // Capture may not be held — ignore (mirrors onPointerUp).
      }
    };

    const onPointerLeave = () => {
      if (!drag.value) hover.value = null;
    };

    const onDoubleClick = (e: MouseEvent) => {
      const { xN, py } = localCoords(e.clientX, e.clientY);
      if (driverRect.value && py >= driverRect.value.y) return; // driver is a single curve
      props.onSegmentsChange?.(splitSegment(composition.value, segmentIndexAt(xN, props.segments)).segments);
    };

    // --- path builders (geometry + path strings come from the shared core) ---
    const renderLaneGrid = (rect: Rect): VNode[] => {
      if (!props.grid) return [];
      const n = Math.max(1, Math.round(props.gridSubdivisions));
      const lines: VNode[] = [];
      for (let i = 1; i < n; i++) {
        const gx = (i / n) * W.value;
        lines.push(
          h('line', { key: `g-${rect.y}-${i}`, class: 'dialkit-cc-grid', x1: gx, y1: rect.y, x2: gx, y2: rect.y + rect.h })
        );
      }
      return lines;
    };

    const renderLaneBg = (rect: Rect, key: string): VNode =>
      h('rect', { key, class: 'dialkit-cc-lane', x: rect.x, y: rect.y, width: rect.w, height: rect.h, rx: 8 });

    const diagonal = (rect: Rect, span: [number, number], key: string): VNode => {
      const d = diagonalLine(rect, span, W.value);
      return h('line', { key, class: 'dialkit-cc-diagonal', x1: d.x1, y1: d.y1, x2: d.x2, y2: d.y2 });
    };

    return () => {
      const main = mainRect.value;
      const dr = driverRect.value;
      const interior = boundaries(props.segments);

      const activeKind = drag.value?.kind ?? hover.value?.kind;
      const cursor =
        activeKind === 'boundary'
          ? 'ew-resize'
          : activeKind === 'segment' || activeKind === 'driver'
            ? 'move'
            : activeKind === 'select' || activeKind === 'header'
              ? 'pointer'
              : 'default';

      const children: (VNode | VNode[] | null)[] = [];

      // main lane
      children.push(renderLaneBg(main, 'main-bg'));
      children.push(renderLaneGrid(main));

      // selected segment highlight
      if (
        props.selectedIndex != null &&
        props.selectedIndex >= 0 &&
        props.selectedIndex < props.segments.length
      ) {
        const span = segmentSpan(props.segments, props.selectedIndex);
        children.push(
          h('rect', {
            class: 'dialkit-cc-seg-selected',
            x: span[0] * W.value,
            y: main.y,
            width: (span[1] - span[0]) * W.value,
            height: main.h,
            rx: 8,
          })
        );
      }

      // hovered segment highlight
      if (hover.value?.kind === 'segment' && !drag.value) {
        const span = segmentSpan(props.segments, hover.value.index);
        children.push(
          h('rect', {
            class: 'dialkit-cc-seg-hover',
            x: span[0] * W.value,
            y: main.y,
            width: (span[1] - span[0]) * W.value,
            height: main.h,
            rx: 8,
          })
        );
      }

      // segments
      children.push(
        props.segments.map((seg, i) => {
          const span = segmentSpan(props.segments, i);
          return h('g', { key: `seg-${i}` }, [
            diagonal(main, span, `diag-${i}`),
            h('path', { class: 'dialkit-cc-curve', d: curvePath(seg, main, span, W.value) }),
            h(
              'text',
              { class: 'dialkit-cc-label', x: (span[0] + span[1]) * 0.5 * W.value, y: main.y + 13 },
              seg.type
            ),
          ]);
        })
      );

      // interior boundaries
      children.push(
        interior.map((bx, i) =>
          h('line', {
            key: `b-${i}`,
            class: 'dialkit-cc-boundary',
            'data-active': String(
              (hover.value?.kind === 'boundary' && hover.value.index === i) ||
                (drag.value?.kind === 'boundary' && drag.value.index === i)
            ),
            x1: bx * W.value,
            y1: main.y,
            x2: bx * W.value,
            y2: main.y + main.h,
          })
        )
      );

      // series playhead + value dot (rides the curve; this is the signal triggers read)
      children.push(
        h('line', {
          ref: seriesPlayheadRef,
          class: 'dialkit-cc-playhead',
          x1: 0,
          y1: main.y,
          x2: 0,
          y2: main.y + main.h,
          style: { stroke: props.playheadColor },
        })
      );
      children.push(
        h('circle', {
          ref: seriesDotRef,
          class: 'dialkit-cc-dot',
          cx: 0,
          cy: mapY(main, 0),
          r: 3,
          style: { fill: props.playheadColor },
        })
      );

      // driver lane
      if (dr) {
        children.push(renderLaneBg(dr, 'driver-bg'));
        children.push(renderLaneGrid(dr));
        if (hover.value?.kind === 'driver' && !drag.value) {
          children.push(
            h('rect', { class: 'dialkit-cc-seg-hover', x: 0, y: dr.y, width: W.value, height: dr.h, rx: 8 })
          );
        }
        children.push(diagonal(dr, [0, 1], 'driver-diag'));
        children.push(
          h('path', { class: 'dialkit-cc-curve dialkit-cc-curve-driver', d: curvePath(props.driver!, dr, [0, 1], W.value) })
        );
        children.push(
          h('text', { class: 'dialkit-cc-label', x: W.value * 0.5, y: dr.y + 13 }, `driver · ${props.driver!.type}`)
        );
        children.push(
          h('line', {
            ref: driverPlayheadRef,
            class: 'dialkit-cc-playhead',
            x1: 0,
            y1: dr.y,
            x2: 0,
            y2: dr.y + dr.h,
            style: { stroke: props.playheadColor },
          })
        );
      }

      return h('div', { class: 'dialkit-cc-wrap', style: { width: `${W.value}px` } }, [
        h(
          'svg',
          {
            ref: svgRef,
            class: 'dialkit-cc',
            viewBox: `0 0 ${W.value} ${totalH.value}`,
            width: W.value,
            height: totalH.value,
            style: { width: `${W.value}px`, height: `${totalH.value}px`, cursor, color: props.curveColor },
            onPointerdown: onPointerDown,
            onPointermove: onPointerMove,
            onPointerup: onPointerUp,
            onPointercancel: onPointerCancel,
            onPointerleave: onPointerLeave,
            onDblclick: onDoubleClick,
          },
          children
        ),
      ]);
    };
  },
});
