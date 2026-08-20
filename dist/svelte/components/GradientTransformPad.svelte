<script lang="ts">
  import { onMount } from 'svelte';
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

  let { value, onChange } = $props<{
    value: GradientValue;
    onChange: (value: GradientValue) => void;
  }>();

  const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
  const wrap360 = (deg: number) => ((deg % 360) + 360) % 360;
  const RAD = Math.PI / 180;
  /** Screen vector (y-down) → CSS gradient angle (0 = up, clockwise). */
  const vectorToAngle = (dx: number, dy: number) => wrap360(Math.atan2(dx, -dy) / RAD);

  let padRef = $state<HTMLDivElement | undefined>(undefined);
  // Keyed by pointerId so a second touch can't hijack or cancel a live drag.
  let drag: { kind: HandleKind; pointerId: number } | null = null;
  let size = $state({ w: 0, h: 0 });

  // The pad is fluid-width; handle math needs real pixels. Measure before
  // first paint (no zero-size flash), then track resizes.
  onMount(() => {
    const el = padRef!;
    const measure = () => {
      size = { w: el.clientWidth, h: el.clientHeight };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  });

  const radial = $derived(value.type === 'radial');
  const conic = $derived(value.type === 'conic');
  const cx = $derived(value.centerX ?? 50);
  const cy = $derived(value.centerY ?? 50);
  const scale = $derived(value.scale ?? 100);
  const rotation = $derived(value.rotation ?? 0);

  const cxPx = $derived((cx / 100) * size.w);
  const cyPx = $derived((cy / 100) * size.h);
  // CSS radial radii resolve against box dims: rx% of width, ry% of height.
  const rxPx = $derived((scale / 100) * size.w);
  // The vertical radius is independent — absent squash means it matches scale.
  // Floor the minor offset so a tiny radius can't park this handle under the
  // center handle (which is on top and would make it unreachable).
  const ryPx = $derived(Math.max(10, ((value.squash ?? scale) / 100) * size.h));
  const theta = $derived(rotation * RAD);

  // Large sizes put a handle outside the pad; pin it to the edge so it stays
  // grabbable (drags recompute from the pointer, so pinning never jumps).
  const pin = (x: number, y: number) => ({ x: clamp(x, 5, size.w - 5), y: clamp(y, 5, size.h - 5) });
  const major = $derived(pin(cxPx + Math.cos(theta) * rxPx, cyPx + Math.sin(theta) * rxPx));
  const minor = $derived(pin(cxPx - Math.sin(theta) * ryPx, cyPx + Math.cos(theta) * ryPx));
  const majorLineLen = $derived(Math.hypot(major.x - cxPx, major.y - cyPx));
  const majorLineAngle = $derived(Math.atan2(major.y - cyPx, major.x - cxPx) / RAD);

  // Direction handle (linear + conic): a spoke from the origin at the angle.
  // Linear gradients have no CSS origin, so their spoke pivots on the pad center.
  const angleOx = $derived(conic ? cxPx : size.w / 2);
  const angleOy = $derived(conic ? cyPx : size.h / 2);
  const spokeR = $derived(Math.max(10, Math.min(size.w, size.h) / 2 - 8));
  const aTheta = $derived(value.angle * RAD);
  const angleHandle = $derived(pin(angleOx + Math.sin(aTheta) * spokeR, angleOy - Math.cos(aTheta) * spokeR));
  const angleLineLen = $derived(Math.hypot(angleHandle.x - angleOx, angleHandle.y - angleOy));
  const angleLineAngle = $derived(Math.atan2(angleHandle.y - angleOy, angleHandle.x - angleOx) / RAD);

  const fill = $derived(gradientFillBox(value, size.w, size.h));

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

    // Minor handle: distance sets the ovality, angle keeps it under the pointer.
    const nextSquash = (dist / rect.height) * 100;
    onChange(setGradientRotation(setGradientSquash(value, nextSquash), deg - 90));
  };

  const onHandleUp = (e: PointerEvent) => {
    if (drag?.pointerId === e.pointerId) drag = null;
  };
</script>

<div bind:this={padRef} class="tweakers-gradient-pad tweakers-checker">
  <div
    class="tweakers-gradient-pad-fill"
    style:background={fill.background}
    style:transform={fill.transform}
    style:transform-origin={fill.transformOrigin}
    style:left="{fill.left}px"
    style:top="{fill.top}px"
    style:width="{fill.width}px"
    style:height="{fill.height}px"
  ></div>
  {#if radial}
    <div
      class="tweakers-gradient-pad-line"
      style:left="{cxPx}px"
      style:top="{cyPx}px"
      style:width="{majorLineLen}px"
      style:transform="rotate({majorLineAngle}deg)"
    ></div>
    <button
      type="button"
      class="tweakers-gradient-pad-handle"
      data-kind="major"
      aria-label="Gradient size and rotation"
      style:left="{major.x}px"
      style:top="{major.y}px"
      onpointerdown={onHandleDown('major')}
      onpointermove={onHandleMove}
      onpointerup={onHandleUp}
      onpointercancel={onHandleUp}
      onlostpointercapture={onHandleUp}
    ></button>
    <button
      type="button"
      class="tweakers-gradient-pad-handle"
      data-kind="minor"
      aria-label="Gradient squash"
      style:left="{minor.x}px"
      style:top="{minor.y}px"
      onpointerdown={onHandleDown('minor')}
      onpointermove={onHandleMove}
      onpointerup={onHandleUp}
      onpointercancel={onHandleUp}
      onlostpointercapture={onHandleUp}
    ></button>
  {/if}
  {#if !radial}
    <div
      class="tweakers-gradient-pad-line"
      style:left="{angleOx}px"
      style:top="{angleOy}px"
      style:width="{angleLineLen}px"
      style:transform="rotate({angleLineAngle}deg)"
    ></div>
    <button
      type="button"
      class="tweakers-gradient-pad-handle"
      data-kind="angle"
      aria-label="Gradient angle"
      style:left="{angleHandle.x}px"
      style:top="{angleHandle.y}px"
      onpointerdown={onHandleDown('angle')}
      onpointermove={onHandleMove}
      onpointerup={onHandleUp}
      onpointercancel={onHandleUp}
      onlostpointercapture={onHandleUp}
    ></button>
  {/if}
  {#if radial || conic}
    <button
      type="button"
      class="tweakers-gradient-pad-handle"
      data-kind="center"
      aria-label="Gradient center"
      style:left="{clamp(cxPx, 5, size.w - 5)}px"
      style:top="{clamp(cyPx, 5, size.h - 5)}px"
      onpointerdown={onHandleDown('center')}
      onpointermove={onHandleMove}
      onpointerup={onHandleUp}
      onpointercancel={onHandleUp}
      onlostpointercapture={onHandleUp}
    ></button>
  {/if}
</div>
