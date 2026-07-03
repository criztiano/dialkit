import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  gradientToCss,
  gradientToTransform,
  setGradientCenter,
  setGradientScale,
  setGradientSquash,
  setGradientRotation,
  type GradientValue,
} from '../gradient-core';

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

  const radial = value.type === 'radial';
  const cx = value.centerX ?? 50;
  const cy = value.centerY ?? 50;
  const scale = value.scale ?? 100;
  const squash = value.squash ?? 0;
  const rotation = value.rotation ?? 0;

  const { w, h } = size;
  const cxPx = (cx / 100) * w;
  const cyPx = (cy / 100) * h;
  // CSS radial radii resolve against box dims: rx% of width, ry% of height.
  const rxPx = (scale / 100) * w;
  // Floor the minor offset so full squash can't park this handle under the
  // center handle (which is on top and would make it unreachable).
  const ryPx = Math.max(10, ((scale * (1 - squash / 100)) / 100) * h);
  const theta = rotation * RAD;
  const majorX = cxPx + Math.cos(theta) * rxPx;
  const majorY = cyPx + Math.sin(theta) * rxPx;
  const minorX = cxPx - Math.sin(theta) * ryPx;
  const minorY = cyPx + Math.cos(theta) * ryPx;

  // Large sizes put a handle outside the pad; pin it to the edge so it stays
  // grabbable (drags recompute from the pointer, so pinning never jumps).
  const pin = (x: number, y: number) => ({ x: clamp(x, 5, w - 5), y: clamp(y, 5, h - 5) });
  const major = pin(majorX, majorY);
  const minor = pin(minorX, minorY);
  const lineLen = Math.hypot(major.x - cxPx, major.y - cyPx);
  const lineAngle = Math.atan2(major.y - cyPx, major.x - cxPx) / RAD;

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

    const dx = px - (cx / 100) * rect.width;
    const dy = py - (cy / 100) * rect.height;
    const dist = Math.hypot(dx, dy);
    const deg = Math.atan2(dy, dx) / RAD;

    if (kind === 'major') {
      const nextScale = (dist / rect.width) * 100;
      onChange(setGradientScale(setGradientRotation(value, deg), nextScale));
      return;
    }

    // Minor handle: distance sets the ovality, angle keeps it under the pointer.
    const ryPct = (dist / rect.height) * 100;
    const nextSquash = (1 - ryPct / scale) * 100;
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

  return (
    <div ref={padRef} className="dialkit-gradient-pad dialkit-checker">
      <div
        className="dialkit-gradient-pad-fill"
        style={{ background: gradientToCss(value), ...gradientToTransform(value) }}
      />
      {radial && (
        <>
          <div
            className="dialkit-gradient-pad-line"
            style={{
              left: cxPx,
              top: cyPx,
              width: lineLen,
              transform: `rotate(${lineAngle}deg)`,
            }}
          />
          <button
            type="button"
            className="dialkit-gradient-pad-handle"
            data-kind="major"
            aria-label="Gradient size and rotation"
            style={{ left: major.x, top: major.y }}
            {...handleProps('major')}
          />
          <button
            type="button"
            className="dialkit-gradient-pad-handle"
            data-kind="minor"
            aria-label="Gradient squash"
            style={{ left: minor.x, top: minor.y }}
            {...handleProps('minor')}
          />
        </>
      )}
      <button
        type="button"
        className="dialkit-gradient-pad-handle"
        data-kind="center"
        aria-label="Gradient center"
        style={{ left: clamp(cxPx, 5, w - 5), top: clamp(cyPx, 5, h - 5) }}
        {...handleProps('center')}
      />
    </div>
  );
}
