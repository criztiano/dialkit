import { createSignal, onCleanup, onMount, Show } from 'solid-js';
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

interface GradientTransformPadProps {
  value: GradientValue;
  onChange: (value: GradientValue) => void;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const wrap360 = (deg: number) => ((deg % 360) + 360) % 360;
const RAD = Math.PI / 180;
/** Screen vector (y-down) → CSS gradient angle (0 = up, clockwise). */
const vectorToAngle = (dx: number, dy: number) => wrap360(Math.atan2(dx, -dy) / RAD);

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
  const conic = () => props.value.type === 'conic';
  const cx = () => props.value.centerX ?? 50;
  const cy = () => props.value.centerY ?? 50;
  const scale = () => props.value.scale ?? 100;
  const rotation = () => props.value.rotation ?? 0;

  const cxPx = () => (cx() / 100) * size().w;
  const cyPx = () => (cy() / 100) * size().h;
  // CSS radial radii resolve against box dims: rx% of width, ry% of height.
  const rxPx = () => (scale() / 100) * size().w;
  // The vertical radius is independent — absent squash means it matches scale.
  // Floor the minor offset so a tiny radius can't park this handle under the
  // center handle (which is on top and would make it unreachable).
  const ryPx = () => Math.max(10, ((props.value.squash ?? scale()) / 100) * size().h);
  const theta = () => rotation() * RAD;

  // Large sizes put a handle outside the pad; pin it to the edge so it stays
  // grabbable (drags recompute from the pointer, so pinning never jumps).
  const pin = (x: number, y: number) => ({
    x: clamp(x, 5, size().w - 5),
    y: clamp(y, 5, size().h - 5),
  });
  const major = () => pin(cxPx() + Math.cos(theta()) * rxPx(), cyPx() + Math.sin(theta()) * rxPx());
  const minor = () => pin(cxPx() - Math.sin(theta()) * ryPx(), cyPx() + Math.cos(theta()) * ryPx());
  const majorLineLen = () => Math.hypot(major().x - cxPx(), major().y - cyPx());
  const majorLineAngle = () => Math.atan2(major().y - cyPx(), major().x - cxPx()) / RAD;

  // Direction handle (linear + conic): a spoke from the origin at the angle.
  // Linear gradients have no CSS origin, so their spoke pivots on the pad center.
  const angleOx = () => (conic() ? cxPx() : size().w / 2);
  const angleOy = () => (conic() ? cyPx() : size().h / 2);
  const spokeR = () => Math.max(10, Math.min(size().w, size().h) / 2 - 8);
  const aTheta = () => props.value.angle * RAD;
  const angleHandle = () =>
    pin(angleOx() + Math.sin(aTheta()) * spokeR(), angleOy() - Math.cos(aTheta()) * spokeR());
  const angleLineLen = () => Math.hypot(angleHandle().x - angleOx(), angleHandle().y - angleOy());
  const angleLineAngle = () => Math.atan2(angleHandle().y - angleOy(), angleHandle().x - angleOx()) / RAD;

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

    if (kind === 'angle') {
      const ox = conic() ? (cx() / 100) * rect.width : rect.width / 2;
      const oy = conic() ? (cy() / 100) * rect.height : rect.height / 2;
      props.onChange(setGradientAngle(props.value, vectorToAngle(px - ox, py - oy)));
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
    const nextSquash = (dist / rect.height) * 100;
    props.onChange(setGradientRotation(setGradientSquash(props.value, nextSquash), deg - 90));
  };

  const onHandleUp = (e: PointerEvent) => {
    if (drag?.pointerId === e.pointerId) drag = null;
  };

  const fill = () => gradientFillBox(props.value, size().w, size().h);

  return (
    <div ref={padRef} class="tweakers-gradient-pad tweakers-checker">
      <div
        class="tweakers-gradient-pad-fill"
        style={{
          background: fill().background,
          transform: fill().transform,
          'transform-origin': fill().transformOrigin,
          left: `${fill().left}px`,
          top: `${fill().top}px`,
          width: `${fill().width}px`,
          height: `${fill().height}px`,
        }}
      />
      <Show when={radial()}>
        <div
          class="tweakers-gradient-pad-line"
          style={{
            left: `${cxPx()}px`,
            top: `${cyPx()}px`,
            width: `${majorLineLen()}px`,
            transform: `rotate(${majorLineAngle()}deg)`,
          }}
        />
        <button
          type="button"
          class="tweakers-gradient-pad-handle"
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
          class="tweakers-gradient-pad-handle"
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
      <Show when={!radial()}>
        <div
          class="tweakers-gradient-pad-line"
          style={{
            left: `${angleOx()}px`,
            top: `${angleOy()}px`,
            width: `${angleLineLen()}px`,
            transform: `rotate(${angleLineAngle()}deg)`,
          }}
        />
        <button
          type="button"
          class="tweakers-gradient-pad-handle"
          data-kind="angle"
          aria-label="Gradient angle"
          style={{ left: `${angleHandle().x}px`, top: `${angleHandle().y}px` }}
          onPointerDown={onHandleDown('angle')}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          onLostPointerCapture={onHandleUp}
        />
      </Show>
      <Show when={radial() || conic()}>
        <button
          type="button"
          class="tweakers-gradient-pad-handle"
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
      </Show>
    </div>
  );
}
