import { defineComponent, h, onBeforeUnmount, onMounted, ref, type PropType } from 'vue';
import {
  gradientFillBox,
  setGradientAngle,
  setGradientCenter,
  setGradientScale,
  setGradientSquash,
  setGradientRotation,
  type GradientValue,
} from '../../gradient-core';

/**
 * Figma-style on-canvas transform controls for a gradient — a live preview with
 * draggable handles that replace the numeric sliders. Radial: center (move),
 * major-axis (size + rotation), and minor-axis (squash) handles. Conic: center
 * plus a direction handle for the start angle. Linear: a single direction handle
 * (no origin or size in CSS linear gradients).
 */

type HandleKind = 'center' | 'major' | 'minor' | 'angle';

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const wrap360 = (deg: number) => ((deg % 360) + 360) % 360;
const RAD = Math.PI / 180;
/** Screen vector (y-down) → CSS gradient angle (0 = up, clockwise). */
const vectorToAngle = (dx: number, dy: number) => wrap360(Math.atan2(dx, -dy) / RAD);

export const GradientTransformPad = defineComponent({
  name: 'TweakersGradientTransformPad',
  props: {
    value: { type: Object as PropType<GradientValue>, required: true },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const padRef = ref<HTMLDivElement | null>(null);
    // Keyed by pointerId so a second touch can't hijack or cancel a live drag.
    let drag: { kind: HandleKind; pointerId: number } | null = null;
    const size = ref({ w: 0, h: 0 });

    // The pad is fluid-width; handle math needs real pixels. Measure before
    // first paint (no zero-size flash), then track resizes.
    let ro: ResizeObserver | null = null;
    onMounted(() => {
      const el = padRef.value;
      if (!el) return;
      const measure = () => {
        size.value = { w: el.clientWidth, h: el.clientHeight };
      };
      measure();
      ro = new ResizeObserver(measure);
      ro.observe(el);
    });
    onBeforeUnmount(() => ro?.disconnect());

    const onHandleDown = (kind: HandleKind) => (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Capture keeps the drag alive outside the pad; failure is non-fatal.
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Non-fatal — the drag still works without capture.
      }
      drag = { kind, pointerId: e.pointerId };
    };

    const onHandleMove = (e: PointerEvent) => {
      if (!drag || drag.pointerId !== e.pointerId || !padRef.value) return;
      const kind = drag.kind;
      if (e.buttons === 0) {
        // Lost capture — don't drag on a released pointer.
        drag = null;
        return;
      }
      const rect = padRef.value.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (kind === 'center') {
        emit('change', setGradientCenter(props.value, (px / rect.width) * 100, (py / rect.height) * 100));
        return;
      }

      const cx = props.value.centerX ?? 50;
      const cy = props.value.centerY ?? 50;

      if (kind === 'angle') {
        const isConic = props.value.type === 'conic';
        const ox = isConic ? (cx / 100) * rect.width : rect.width / 2;
        const oy = isConic ? (cy / 100) * rect.height : rect.height / 2;
        emit('change', setGradientAngle(props.value, vectorToAngle(px - ox, py - oy)));
        return;
      }

      const dx = px - (cx / 100) * rect.width;
      const dy = py - (cy / 100) * rect.height;
      const dist = Math.hypot(dx, dy);
      const deg = Math.atan2(dy, dx) / RAD;

      if (kind === 'major') {
        const nextScale = (dist / rect.width) * 100;
        emit('change', setGradientScale(setGradientRotation(props.value, deg), nextScale));
        return;
      }

      // Minor handle: distance sets the ovality, angle keeps it under the pointer.
      const nextSquash = (dist / rect.height) * 100;
      emit('change', setGradientRotation(setGradientSquash(props.value, nextSquash), deg - 90));
    };

    const onHandleUp = (e: PointerEvent) => {
      if (drag?.pointerId === e.pointerId) drag = null;
    };

    const handleProps = (kind: HandleKind) => ({
      onPointerdown: onHandleDown(kind),
      onPointermove: onHandleMove,
      onPointerup: onHandleUp,
      onPointercancel: onHandleUp,
      onLostpointercapture: onHandleUp,
    });

    return () => {
      const value = props.value;
      const radial = value.type === 'radial';
      const conic = value.type === 'conic';
      const cx = value.centerX ?? 50;
      const cy = value.centerY ?? 50;
      const scale = value.scale ?? 100;
      const rotation = value.rotation ?? 0;

      const { w, h: hh } = size.value;
      const cxPx = (cx / 100) * w;
      const cyPx = (cy / 100) * hh;
      // CSS radial radii resolve against box dims: rx% of width, ry% of height.
      // The vertical radius is independent — absent squash means it matches scale.
      const rxPx = (scale / 100) * w;
      // Floor the minor offset so a tiny radius can't park this handle under the
      // center handle (which is on top and would make it unreachable).
      const ryPx = Math.max(10, ((value.squash ?? scale) / 100) * hh);
      const theta = rotation * RAD;
      const majorX = cxPx + Math.cos(theta) * rxPx;
      const majorY = cyPx + Math.sin(theta) * rxPx;
      const minorX = cxPx - Math.sin(theta) * ryPx;
      const minorY = cyPx + Math.cos(theta) * ryPx;

      // Large sizes put a handle outside the pad; pin it to the edge so it stays
      // grabbable (drags recompute from the pointer, so pinning never jumps).
      const pin = (x: number, y: number) => ({ x: clamp(x, 5, w - 5), y: clamp(y, 5, hh - 5) });
      const major = pin(majorX, majorY);
      const minor = pin(minorX, minorY);
      const majorLineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
      const majorLineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;

      // Direction handle (linear + conic): a spoke from the origin at the angle.
      // Linear gradients have no CSS origin, so their spoke pivots on the pad center.
      const angleOx = conic ? cxPx : w / 2;
      const angleOy = conic ? cyPx : hh / 2;
      const spokeR = Math.max(10, Math.min(w, hh) / 2 - 8);
      const aTheta = value.angle * RAD;
      const angleHandle = pin(angleOx + Math.sin(aTheta) * spokeR, angleOy - Math.cos(aTheta) * spokeR);
      const angleLineLen = Math.hypot(angleHandle.x - angleOx, angleHandle.y - angleOy);
      const angleLineAngle = Math.atan2(angleHandle.y - angleOy, angleHandle.x - angleOx) / RAD;

      const fill = gradientFillBox(value, w, hh);

      return h('div', { ref: padRef, class: 'tweakers-gradient-pad tweakers-checker' }, [
        h('div', {
          class: 'tweakers-gradient-pad-fill',
          style: {
            background: fill.background,
            transform: fill.transform,
            transformOrigin: fill.transformOrigin,
            left: `${fill.left}px`,
            top: `${fill.top}px`,
            width: `${fill.width}px`,
            height: `${fill.height}px`,
          },
        }),
        ...(radial
          ? [
            h('div', {
              class: 'tweakers-gradient-pad-line',
              style: {
                left: `${cxPx}px`,
                top: `${cyPx}px`,
                width: `${majorLineLen}px`,
                transform: `rotate(${majorLineAngle}deg)`,
              },
            }),
            h('button', {
              type: 'button',
              class: 'tweakers-gradient-pad-handle',
              'data-kind': 'major',
              'aria-label': 'Gradient size and rotation',
              style: { left: `${major.x}px`, top: `${major.y}px` },
              ...handleProps('major'),
            }),
            h('button', {
              type: 'button',
              class: 'tweakers-gradient-pad-handle',
              'data-kind': 'minor',
              'aria-label': 'Gradient squash',
              style: { left: `${minor.x}px`, top: `${minor.y}px` },
              ...handleProps('minor'),
            }),
          ]
          : [
            h('div', {
              class: 'tweakers-gradient-pad-line',
              style: {
                left: `${angleOx}px`,
                top: `${angleOy}px`,
                width: `${angleLineLen}px`,
                transform: `rotate(${angleLineAngle}deg)`,
              },
            }),
            h('button', {
              type: 'button',
              class: 'tweakers-gradient-pad-handle',
              'data-kind': 'angle',
              'aria-label': 'Gradient angle',
              style: { left: `${angleHandle.x}px`, top: `${angleHandle.y}px` },
              ...handleProps('angle'),
            }),
          ]),
        ...(radial || conic
          ? [
            h('button', {
              type: 'button',
              class: 'tweakers-gradient-pad-handle',
              'data-kind': 'center',
              'aria-label': 'Gradient center',
              style: { left: `${clamp(cxPx, 5, w - 5)}px`, top: `${clamp(cyPx, 5, hh - 5)}px` },
              ...handleProps('center'),
            }),
          ]
          : []),
      ]);
    };
  },
});
