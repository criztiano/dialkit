<script lang="ts">
  import { onMount } from 'svelte';
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

  let { value, onChange } = $props<{
    value: GradientValue;
    onChange: (value: GradientValue) => void;
  }>();

  const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
  const RAD = Math.PI / 180;

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
  const cx = $derived(value.centerX ?? 50);
  const cy = $derived(value.centerY ?? 50);
  const scale = $derived(value.scale ?? 100);
  const squash = $derived(value.squash ?? 0);
  const rotation = $derived(value.rotation ?? 0);

  const cxPx = $derived((cx / 100) * size.w);
  const cyPx = $derived((cy / 100) * size.h);
  // CSS radial radii resolve against box dims: rx% of width, ry% of height.
  const rxPx = $derived((scale / 100) * size.w);
  // Floor the minor offset so full squash can't park this handle under the
  // center handle (which is on top and would make it unreachable).
  const ryPx = $derived(Math.max(10, ((scale * (1 - squash / 100)) / 100) * size.h));
  const theta = $derived(rotation * RAD);

  // Large sizes put a handle outside the pad; pin it to the edge so it stays
  // grabbable (drags recompute from the pointer, so pinning never jumps).
  const pin = (x: number, y: number) => ({ x: clamp(x, 5, size.w - 5), y: clamp(y, 5, size.h - 5) });
  const major = $derived(pin(cxPx + Math.cos(theta) * rxPx, cyPx + Math.sin(theta) * rxPx));
  const minor = $derived(pin(cxPx - Math.sin(theta) * ryPx, cyPx + Math.cos(theta) * ryPx));
  const lineLen = $derived(Math.hypot(major.x - cxPx, major.y - cyPx));
  const lineAngle = $derived(Math.atan2(major.y - cyPx, major.x - cxPx) / RAD);

  const fillTransform = $derived(gradientToTransform(value));

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

  const onHandleUp = (e: PointerEvent) => {
    if (drag?.pointerId === e.pointerId) drag = null;
  };
</script>

<div bind:this={padRef} class="dialkit-gradient-pad dialkit-checker">
  <div
    class="dialkit-gradient-pad-fill"
    style:background={gradientToCss(value)}
    style:transform={fillTransform.transform}
    style:transform-origin={fillTransform.transformOrigin}
  ></div>
  {#if radial}
    <div
      class="dialkit-gradient-pad-line"
      style:left="{cxPx}px"
      style:top="{cyPx}px"
      style:width="{lineLen}px"
      style:transform="rotate({lineAngle}deg)"
    ></div>
    <button
      type="button"
      class="dialkit-gradient-pad-handle"
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
      class="dialkit-gradient-pad-handle"
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
  <button
    type="button"
    class="dialkit-gradient-pad-handle"
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
</div>
