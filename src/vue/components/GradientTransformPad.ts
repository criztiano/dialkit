import { defineComponent, h, onBeforeUnmount, onMounted, ref, type PropType } from 'vue';
import {
  gradientToCss,
  gradientToTransform,
  setGradientCenter,
  setGradientScale,
  setGradientSquash,
  setGradientRotation,
  type GradientValue,
} from '../../gradient-core';

/**
 * Figma-style on-canvas transform controls for a gradient: a live preview with
 * a draggable center handle, a major-axis handle (distance = size, angle =
 * rotation), and a minor-axis handle (distance = squash). Radial shows all
 * three; conic only the center.
 */

type HandleKind = 'center' | 'major' | 'minor';

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const RAD = Math.PI / 180;

export const GradientTransformPad = defineComponent({
  name: 'DialKitGradientTransformPad',
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
      const ryPct = (dist / rect.height) * 100;
      const nextSquash = (1 - ryPct / (props.value.scale ?? 100)) * 100;
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
      const cx = value.centerX ?? 50;
      const cy = value.centerY ?? 50;
      const scale = value.scale ?? 100;
      const squash = value.squash ?? 0;
      const rotation = value.rotation ?? 0;

      const { w, h: hh } = size.value;
      const cxPx = (cx / 100) * w;
      const cyPx = (cy / 100) * hh;
      // CSS radial radii resolve against box dims: rx% of width, ry% of height.
      const rxPx = (scale / 100) * w;
      // Floor the minor offset so full squash can't park this handle under the
      // center handle (which is on top and would make it unreachable).
      const ryPx = Math.max(10, ((scale * (1 - squash / 100)) / 100) * hh);
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
      const lineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
      const lineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;

      const transform = gradientToTransform(value);

      return h('div', { ref: padRef, class: 'dialkit-gradient-pad dialkit-checker' }, [
        h('div', {
          class: 'dialkit-gradient-pad-fill',
          style: {
            background: gradientToCss(value),
            transform: transform.transform,
            transformOrigin: transform.transformOrigin,
          },
        }),
        ...(radial
          ? [
            h('div', {
              class: 'dialkit-gradient-pad-line',
              style: {
                left: `${cxPx}px`,
                top: `${cyPx}px`,
                width: `${lineLen}px`,
                transform: `rotate(${lineAngle}deg)`,
              },
            }),
            h('button', {
              type: 'button',
              class: 'dialkit-gradient-pad-handle',
              'data-kind': 'major',
              'aria-label': 'Gradient size and rotation',
              style: { left: `${major.x}px`, top: `${major.y}px` },
              ...handleProps('major'),
            }),
            h('button', {
              type: 'button',
              class: 'dialkit-gradient-pad-handle',
              'data-kind': 'minor',
              'aria-label': 'Gradient squash',
              style: { left: `${minor.x}px`, top: `${minor.y}px` },
              ...handleProps('minor'),
            }),
          ]
          : []),
        h('button', {
          type: 'button',
          class: 'dialkit-gradient-pad-handle',
          'data-kind': 'center',
          'aria-label': 'Gradient center',
          style: { left: `${clamp(cxPx, 5, w - 5)}px`, top: `${clamp(cyPx, 5, hh - 5)}px` },
          ...handleProps('center'),
        }),
      ]);
    };
  },
});
