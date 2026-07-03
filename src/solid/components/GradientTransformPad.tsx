import { createSignal, onCleanup, onMount, Show } from 'solid-js';
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

interface GradientTransformPadProps {
  value: GradientValue;
  onChange: (value: GradientValue) => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const RAD = Math.PI / 180;

export function GradientTransformPad(props: GradientTransformPadProps) {
  let padRef!: HTMLDivElement;
  // Keyed by pointerId so a second touch can't hijack or cancel a live drag.
  let drag: { kind: HandleKind; pointerId: number } | null = null;
  const [size, setSize] = createSignal({ w: 0, h: 0 });

  // The pad is fluid-width; handle math needs real pixels. Measure before
  // first paint (no zero-size flash), then track resizes.
  onMount(() => {
    const measure = () => setSize({ w: padRef.clientWidth, h: padRef.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(padRef);
    onCleanup(() => ro.disconnect());
  });

  const radial = () => props.value.type === 'radial';
  const cx = () => props.value.centerX ?? 50;
  const cy = () => props.value.centerY ?? 50;
  const scale = () => props.value.scale ?? 100;
  const squash = () => props.value.squash ?? 0;
  const rotation = () => props.value.rotation ?? 0;

  const cxPx = () => (cx() / 100) * size().w;
  const cyPx = () => (cy() / 100) * size().h;
  // CSS radial radii resolve against box dims: rx% of width, ry% of height.
  const rxPx = () => (scale() / 100) * size().w;
  // Floor the minor offset so full squash can't park this handle under the
  // center handle (which is on top and would make it unreachable).
  const ryPx = () => Math.max(10, ((scale() * (1 - squash() / 100)) / 100) * size().h);
  const theta = () => rotation() * RAD;

  // Large sizes put a handle outside the pad; pin it to the edge so it stays
  // grabbable (drags recompute from the pointer, so pinning never jumps).
  const pin = (x: number, y: number) => ({
    x: clamp(x, 5, size().w - 5),
    y: clamp(y, 5, size().h - 5),
  });
  const major = () => pin(cxPx() + Math.cos(theta()) * rxPx(), cyPx() + Math.sin(theta()) * rxPx());
  const minor = () => pin(cxPx() - Math.sin(theta()) * ryPx(), cyPx() + Math.cos(theta()) * ryPx());
  const lineLen = () => Math.hypot(major().x - cxPx(), major().y - cyPx());
  const lineAngle = () => Math.atan2(major().y - cyPx(), major().x - cxPx()) / RAD;

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
    if (!drag || drag.pointerId !== e.pointerId || !padRef) return;
    const kind = drag.kind;
    if (e.buttons === 0) {
      // Lost capture — don't drag on a released pointer.
      drag = null;
      return;
    }
    const rect = padRef.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (kind === 'center') {
      props.onChange(setGradientCenter(props.value, (px / rect.width) * 100, (py / rect.height) * 100));
      return;
    }

    const dx = px - (cx() / 100) * rect.width;
    const dy = py - (cy() / 100) * rect.height;
    const dist = Math.hypot(dx, dy);
    const deg = Math.atan2(dy, dx) / RAD;

    if (kind === 'major') {
      const nextScale = (dist / rect.width) * 100;
      props.onChange(setGradientScale(setGradientRotation(props.value, deg), nextScale));
      return;
    }

    // Minor handle: distance sets the ovality, angle keeps it under the pointer.
    const ryPct = (dist / rect.height) * 100;
    const nextSquash = (1 - ryPct / scale()) * 100;
    props.onChange(setGradientRotation(setGradientSquash(props.value, nextSquash), deg - 90));
  };

  const onHandleUp = (e: PointerEvent) => {
    if (drag?.pointerId === e.pointerId) drag = null;
  };

  return (
    <div ref={padRef} class="dialkit-gradient-pad dialkit-checker">
      <div
        class="dialkit-gradient-pad-fill"
        style={{
          background: gradientToCss(props.value),
          transform: gradientToTransform(props.value).transform,
          'transform-origin': gradientToTransform(props.value).transformOrigin,
        }}
      />
      <Show when={radial()}>
        <div
          class="dialkit-gradient-pad-line"
          style={{
            left: `${cxPx()}px`,
            top: `${cyPx()}px`,
            width: `${lineLen()}px`,
            transform: `rotate(${lineAngle()}deg)`,
          }}
        />
        <button
          type="button"
          class="dialkit-gradient-pad-handle"
          data-kind="major"
          aria-label="Gradient size and rotation"
          style={{ left: `${major().x}px`, top: `${major().y}px` }}
          onPointerDown={onHandleDown('major')}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          onLostPointerCapture={onHandleUp}
        />
        <button
          type="button"
          class="dialkit-gradient-pad-handle"
          data-kind="minor"
          aria-label="Gradient squash"
          style={{ left: `${minor().x}px`, top: `${minor().y}px` }}
          onPointerDown={onHandleDown('minor')}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          onLostPointerCapture={onHandleUp}
        />
      </Show>
      <button
        type="button"
        class="dialkit-gradient-pad-handle"
        data-kind="center"
        aria-label="Gradient center"
        style={{
          left: `${clamp(cxPx(), 5, size().w - 5)}px`,
          top: `${clamp(cyPx(), 5, size().h - 5)}px`,
        }}
        onPointerDown={onHandleDown('center')}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
        onPointerCancel={onHandleUp}
        onLostPointerCapture={onHandleUp}
      />
    </div>
  );
}
