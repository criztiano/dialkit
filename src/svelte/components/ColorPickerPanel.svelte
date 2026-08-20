<script module lang="ts">
  import type { ColorFormat } from '../../color-core';

  // The format choice follows the user across pickers within a session —
  // switching to OKLCH once shouldn't need repeating per control.
  let stickyFormat: ColorFormat = 'hex';
</script>

<script lang="ts">
  import { untrack } from 'svelte';
  import SegmentedControl from './SegmentedControl.svelte';
  import {
    parseHex,
    formatHex,
    normalizeHex,
    rgbToHsv,
    hsvToRgb,
    getChannels,
    rgbaToChannels,
    channelsToRgba,
    opacityPercent,
    emptyPalette,
    LONG_PRESS_MS,
    PALETTE_DRAG_CANCEL_PX,
    type HSVA,
    type ChannelSpec,
    type PaletteSlots,
  } from '../../color-core';
  import { loadPalette, savePalette, subscribePalette } from '../../color-palette-store';

  let { value, onChange, alpha = false, palette = false } = $props<{
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
  }>();

  const FORMAT_OPTIONS: { value: ColorFormat; label: string }[] = [
    { value: 'hex', label: 'HEX' },
    { value: 'rgb', label: 'RGB' },
    { value: 'hsl', label: 'HSL' },
    { value: 'oklch', label: 'OKLCH' },
  ];

  const BLACK: HSVA = { h: 0, s: 0, v: 0, a: 1 };
  const HEX_ALPHA_SPEC: ChannelSpec = { key: 'a', label: 'A', min: 0, max: 100, step: 1, precision: 0 };

  const initialRgba = parseHex(untrack(() => value));
  let hsva = $state<HSVA>(initialRgba ? rgbToHsv(initialRgba) : BLACK);
  let format = $state<ColorFormat>(stickyFormat);
  let slots = $state<PaletteSlots>(untrack(() => palette) ? loadPalette() : emptyPalette());
  let lastEmitted = untrack(() => value);

  // External value changes (preset restore, config edit) re-derive the working
  // state; our own emissions don't, so the SV thumb keeps hue/sat at black/white.
  $effect(() => {
    if (value === lastEmitted) return;
    lastEmitted = value;
    const rgba = parseHex(value);
    if (rgba) hsva = rgbToHsv(rgba);
  });

  $effect(() => {
    if (!palette) return;
    return subscribePalette((s) => {
      slots = s;
    });
  });

  function emit(next: HSVA) {
    hsva = next;
    const hex = formatHex(hsvToRgb(next), alpha);
    lastEmitted = hex;
    onChange(hex);
  }

  function applyHex(hex: string) {
    const rgba = parseHex(hex);
    if (!rgba) return;
    const normalized = formatHex(rgba, alpha);
    hsva = rgbToHsv(rgba);
    lastEmitted = normalized;
    onChange(normalized);
  }

  /** Shared drag surface: pointer-capture + normalized 0–1 coordinates. */
  function areaDrag(onPoint: (x: number, y: number) => void) {
    let dragging = false;
    let el: HTMLElement | null = null;
    const readPoint = (e: PointerEvent) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      onPoint(x, y);
    };
    return {
      onpointerdown: (e: PointerEvent) => {
        e.preventDefault();
        el = e.currentTarget as HTMLElement;
        el.setPointerCapture(e.pointerId);
        dragging = true;
        readPoint(e);
      },
      onpointermove: (e: PointerEvent) => {
        // Insurance against lost pointer capture: no buttons down means no drag.
        if (dragging && e.buttons === 0) {
          dragging = false;
          return;
        }
        if (dragging) readPoint(e);
      },
      onpointerup: () => {
        dragging = false;
      },
      onpointercancel: () => {
        dragging = false;
      },
    };
  }

  const svDrag = areaDrag((x, y) => emit({ ...hsva, s: x, v: 1 - y }));
  const hueDrag = areaDrag((x) => emit({ ...hsva, h: Math.min(x * 360, 359.999) }));
  const alphaDrag = areaDrag((x) => emit({ ...hsva, a: x }));

  const rgba = $derived(hsvToRgb(hsva));
  const opaqueHex = $derived(formatHex(rgba, false));
  const currentHex = $derived(formatHex(rgba, alpha));
  const channelSpecs = $derived(format === 'hex' ? [] : getChannels(format as Exclude<ColorFormat, 'hex'>, alpha));
  const channelValues = $derived(format === 'hex' ? [] : rgbaToChannels(rgba, format as Exclude<ColorFormat, 'hex'>, alpha));

  function commitChannel(index: number, n: number) {
    const next = [...channelValues];
    next[index] = n;
    const committed = channelsToRgba(next, format as Exclude<ColorFormat, 'hex'>, alpha);
    const nextHsva = rgbToHsv(committed);
    // Hue/saturation are meaningless on grays; keep the current ones so the
    // SV thumb doesn't jump when a channel edit lands on black/white.
    if (nextHsva.s === 0) nextHsva.h = hsva.h;
    if (nextHsva.v === 0) nextHsva.s = hsva.s;
    emit(nextHsva);
  }

  // One draft at a time (drafts are focus-bound); partial typing ("25" on the
  // way to "255") never round-trips through the color.
  let channelDraft = $state<{ id: string; text: string } | null>(null);
  let hexDraft = $state<string | null>(null);

  function commitChannelDraft(id: string, onCommit: (n: number) => void) {
    if (channelDraft?.id === id) onCommit(Number(channelDraft.text));
    channelDraft = null;
  }

  function commitHexDraft() {
    if (hexDraft !== null) {
      const normalized = normalizeHex(hexDraft, alpha);
      if (normalized) applyHex(normalized);
    }
    hexDraft = null;
  }

  // ── Palette long-press (only one slot can be held at a time) ──
  let holdingSlot = $state<number | null>(null);
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  let holdOrigin: { x: number; y: number } | null = null;
  let holdFired = false;

  function cancelHold() {
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = null;
    holdOrigin = null;
    holdingSlot = null;
  }

  function startHold(i: number, color: string | null, e: PointerEvent) {
    // Always reset first: a new press is never a stale long-press echo.
    holdFired = false;
    if (!color) return;
    holdOrigin = { x: e.clientX, y: e.clientY };
    holdingSlot = i;
    holdTimer = setTimeout(() => {
      holdFired = true;
      cancelHold();
      // Read the store at commit time — a 500ms hold is long enough for
      // another panel or tab to have rewritten the palette underneath.
      savePalette(loadPalette().map((s, j) => (j === i ? null : s)));
    }, LONG_PRESS_MS);
  }

  function moveHold(e: PointerEvent) {
    if (!holdOrigin) return;
    if (Math.hypot(e.clientX - holdOrigin.x, e.clientY - holdOrigin.y) > PALETTE_DRAG_CANCEL_PX) {
      cancelHold();
    }
  }

  function clickSlot(i: number, color: string | null) {
    // A completed long-press consumes the click that follows it.
    if (holdFired) {
      holdFired = false;
      return;
    }
    if (color) applyHex(color);
    else savePalette(loadPalette().map((s, j) => (j === i ? currentHex : s)));
  }

  $effect(() => {
    return () => cancelHold();
  });
</script>

{#snippet channelField(id: string, spec: ChannelSpec, val: number, onCommit: (n: number) => void)}
  <label class="tweakers-color-field">
    <input
      type="text"
      inputmode="decimal"
      value={channelDraft?.id === id ? channelDraft.text : String(val)}
      onfocus={(e) => {
        channelDraft = { id, text: String(val) };
        (e.currentTarget as HTMLInputElement).select();
      }}
      oninput={(e) => {
        channelDraft = { id, text: (e.currentTarget as HTMLInputElement).value };
      }}
      onblur={() => commitChannelDraft(id, onCommit)}
      onkeydown={(e) => {
        if (e.key === 'Enter') {
          commitChannelDraft(id, onCommit);
          (e.currentTarget as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
          e.stopPropagation();
          channelDraft = null;
          (e.currentTarget as HTMLInputElement).blur();
        }
      }}
    />
    <span class="tweakers-color-field-label">{spec.label}</span>
  </label>
{/snippet}

<div class="tweakers-color-picker" style:--picker-hue={hsva.h}>
  <div
    class="tweakers-color-sv"
    role="application"
    aria-label="Saturation and brightness"
    onpointerdown={svDrag.onpointerdown}
    onpointermove={svDrag.onpointermove}
    onpointerup={svDrag.onpointerup}
    onpointercancel={svDrag.onpointercancel}
  >
    <div
      class="tweakers-color-sv-thumb"
      style:left="{hsva.s * 100}%"
      style:top="{(1 - hsva.v) * 100}%"
      style:background={opaqueHex}
    ></div>
  </div>

  <div
    class="tweakers-color-slider tweakers-color-hue"
    role="application"
    aria-label="Hue"
    onpointerdown={hueDrag.onpointerdown}
    onpointermove={hueDrag.onpointermove}
    onpointerup={hueDrag.onpointerup}
    onpointercancel={hueDrag.onpointercancel}
  >
    <div
      class="tweakers-color-slider-thumb"
      style:left="{(hsva.h / 360) * 100}%"
      style:background="hsl({hsva.h} 100% 50%)"
    ></div>
  </div>

  {#if alpha}
    <div
      class="tweakers-color-slider tweakers-color-alpha tweakers-checker"
      role="application"
      aria-label="Opacity"
      onpointerdown={alphaDrag.onpointerdown}
      onpointermove={alphaDrag.onpointermove}
      onpointerup={alphaDrag.onpointerup}
      onpointercancel={alphaDrag.onpointercancel}
    >
      <div
        class="tweakers-color-alpha-gradient"
        style:background="linear-gradient(to right, transparent, {opaqueHex})"
      ></div>
      <div
        class="tweakers-color-slider-thumb"
        style:left="{hsva.a * 100}%"
        style:background={opaqueHex}
        style:opacity={Math.max(hsva.a, 0.15)}
      ></div>
    </div>
  {/if}

  <SegmentedControl
    options={FORMAT_OPTIONS}
    value={format}
    onChange={(f: string) => {
      stickyFormat = f as ColorFormat;
      format = f as ColorFormat;
    }}
  />

  <div class="tweakers-color-fields" data-format={format}>
    {#if format === 'hex'}
      <label class="tweakers-color-field tweakers-color-field-hex">
        <input
          type="text"
          spellcheck="false"
          value={(hexDraft ?? currentHex).toUpperCase()}
          onfocus={(e) => {
            hexDraft = currentHex;
            (e.currentTarget as HTMLInputElement).select();
          }}
          oninput={(e) => {
            hexDraft = (e.currentTarget as HTMLInputElement).value;
          }}
          onblur={commitHexDraft}
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              commitHexDraft();
              (e.currentTarget as HTMLInputElement).blur();
            } else if (e.key === 'Escape') {
              e.stopPropagation();
              hexDraft = null;
              (e.currentTarget as HTMLInputElement).blur();
            }
          }}
        />
        <span class="tweakers-color-field-label">HEX</span>
      </label>
      {#if alpha}
        {@render channelField(
          'hex-a',
          HEX_ALPHA_SPEC,
          opacityPercent(rgba),
          (n) => emit({ ...hsva, a: Math.min(1, Math.max(0, n / 100)) })
        )}
      {/if}
    {:else}
      {#each channelSpecs as spec, i (`${format}-${spec.key}`)}
        {@render channelField(`${format}-${spec.key}`, spec, channelValues[i], (n) => commitChannel(i, n))}
      {/each}
    {/if}
  </div>

  {#if palette}
    <div class="tweakers-color-palette">
      {#each slots as slotColor, i (i)}
        {@const color = slotColor ?? null}
        <button
          class="tweakers-color-palette-slot"
          data-filled={String(color !== null)}
          data-holding={String(holdingSlot === i)}
          style:--swatch-color={color}
          title={color ? `${color.toUpperCase()} — click to apply, hold to clear` : 'Save current color'}
          oncontextmenu={(e) => e.preventDefault()}
          onpointerdown={(e) => startHold(i, color, e)}
          onpointermove={moveHold}
          onpointerup={cancelHold}
          onpointerleave={cancelHold}
          onpointercancel={cancelHold}
          onclick={() => clickSlot(i, color)}
        ></button>
      {/each}
    </div>
  {/if}
</div>
