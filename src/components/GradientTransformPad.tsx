import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  gradientFillBox,
  setGradientAngle,
  setGradientCenter,
  setGradientScale,
  setGradientSquash,
  setGradientRotation,
  type GradientValue,
} from '../gradient-core';

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

export function GradientTransformPad({ value, onChange }: GradientTransformPadProps) {
  const padRef = useRef<HTMLDivElement>(null);
  // Keyed by pointerId so a second touch can't hijack or cancel a live drag.
  const drag = useRef<{ kind: HandleKind; pointerId: number } | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // The pad is fluid-width; handle math needs real pixels. Measure before
  // first paint (no zero-size flash), then track resizes.
  useLayoutEffect(() => {
    const el = padRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const radial = value.type === 'radial';
  const conic = value.type === 'conic';
  const cx = value.centerX ?? 50;
  const cy = value.centerY ?? 50;
  const scale = value.scale ?? 100;
  const rotation = value.rotation ?? 0;

  const cxPx = (cx / 100) * w;
  const cyPx = (cy / 100) * h;
  // CSS radial radii resolve against box dims: rx% of width, ry% of height.
  // The vertical radius is independent — absent squash means it matches scale.
  const rxPx = (scale / 100) * w;
  // Floor the minor offset so a tiny radius can't park this handle under the
  // center handle (which is on top and would make it unreachable).
  const ryPx = Math.max(10, ((value.squash ?? scale) / 100) * h);
  const theta = rotation * RAD;

  // Large sizes push a handle off the pad; pin it to the edge so it stays
  // grabbable (drags recompute from the pointer, so pinning never jumps).
  const pin = (x: number, y: number) => ({ x: clamp(x, 5, w - 5), y: clamp(y, 5, h - 5) });
  const major = pin(cxPx + Math.cos(theta) * rxPx, cyPx + Math.sin(theta) * rxPx);
  const minor = pin(cxPx - Math.sin(theta) * ryPx, cyPx + Math.cos(theta) * ryPx);
  const majorLineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
  const majorLineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;

  // Direction handle (linear + conic): a spoke from the origin at the angle.
  // Linear gradients have no CSS origin, so their spoke pivots on the pad center.
  const angleOx = conic ? cxPx : w / 2;
  const angleOy = conic ? cyPx : h / 2;
  const spokeR = Math.max(10, Math.min(w, h) / 2 - 8);
  const aTheta = value.angle * RAD;
  const angleHandle = pin(angleOx + Math.sin(aTheta) * spokeR, angleOy - Math.cos(aTheta) * spokeR);
  const angleLineLen = Math.hypot(angleHandle.x - angleOx, angleHandle.y - angleOy);
  const angleLineAngle = Math.atan2(angleHandle.y - angleOy, angleHandle.x - angleOx) / RAD;

  const onHandleDown = (kind: HandleKind) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Capture keeps the drag alive outside the pad; failure is non-fatal.
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Non-fatal — the drag still works without capture.
    }
    drag.current = { kind, pointerId: e.pointerId };
  };

  const onHandleMove = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.pointerId !== e.pointerId || !padRef.current) return;
    const kind = drag.current.kind;
    if (e.buttons === 0) {
      // Lost capture — don't drag on a released pointer.
      drag.current = null;
      return;
    }
    const rect = padRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (kind === 'center') {
      onChange(setGradientCenter(value, (px / rect.width) * 100, (py / rect.height) * 100));
      return;
    }

    if (kind === 'angle') {
      const ox = conic ? (cx / 100) * rect.width : rect.width / 2;
      const oy = conic ? (cy / 100) * rect.height : rect.height / 2;
      onChange(setGradientAngle(value, vectorToAngle(px - ox, py - oy)));
      return;
    }

    const dx = px - (cx / 100) * rect.width;
    const dy = py - (cy / 100) * rect.height;
    const dist = Math.hypot(dx, dy);
    const deg = Math.atan2(dy, dx) / RAD;

    if (kind === 'major') {
      const nextScale = (dist / rect.width) * 100;
      onChange(setGradientScale(setGradientRotation(value, deg), nextScale));
      return;
    }

    // Minor handle: distance sets the vertical radius directly (independent of
    // the horizontal one), angle keeps the axis under the pointer.
    const nextSquash = (dist / rect.height) * 100;
    onChange(setGradientRotation(setGradientSquash(value, nextSquash), deg - 90));
  };

  const onHandleUp = (e: React.PointerEvent) => {
    if (drag.current?.pointerId === e.pointerId) drag.current = null;
  };

  const handleProps = (kind: HandleKind) => ({
    onPointerDown: onHandleDown(kind),
    onPointerMove: onHandleMove,
    onPointerUp: onHandleUp,
    onPointerCancel: onHandleUp,
    onLostPointerCapture: onHandleUp,
  });

  const fill = gradientFillBox(value, w, h);

  return (
    <div ref={padRef} className="tweakers-gradient-pad tweakers-checker">
      <div
        className="tweakers-gradient-pad-fill"
        style={{
          background: fill.background,
          transform: fill.transform,
          transformOrigin: fill.transformOrigin,
          left: fill.left,
          top: fill.top,
          width: fill.width,
          height: fill.height,
        }}
      />
      {radial && (
        <>
          <div
            className="tweakers-gradient-pad-line"
            style={{ left: cxPx, top: cyPx, width: majorLineLen, transform: `rotate(${majorLineAngle}deg)` }}
          />
          <button
            type="button"
            className="tweakers-gradient-pad-handle"
            data-kind="major"
            aria-label="Gradient size and rotation"
            style={{ left: major.x, top: major.y }}
            {...handleProps('major')}
          />
          <button
            type="button"
            className="tweakers-gradient-pad-handle"
            data-kind="minor"
            aria-label="Gradient squash"
            style={{ left: minor.x, top: minor.y }}
            {...handleProps('minor')}
          />
        </>
      )}
      {!radial && (
        <>
          <div
            className="tweakers-gradient-pad-line"
            style={{ left: angleOx, top: angleOy, width: angleLineLen, transform: `rotate(${angleLineAngle}deg)` }}
          />
          <button
            type="button"
            className="tweakers-gradient-pad-handle"
            data-kind="angle"
            aria-label="Gradient angle"
            style={{ left: angleHandle.x, top: angleHandle.y }}
            {...handleProps('angle')}
          />
        </>
      )}
      {(radial || conic) && (
        <button
          type="button"
          className="tweakers-gradient-pad-handle"
          data-kind="center"
          aria-label="Gradient center"
          style={{ left: clamp(cxPx, 5, w - 5), top: clamp(cyPx, 5, h - 5) }}
          {...handleProps('center')}
        />
      )}
    </div>
  );
}
