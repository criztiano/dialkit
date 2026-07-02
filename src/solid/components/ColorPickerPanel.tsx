import { createSignal, createEffect, onCleanup, Show, For } from 'solid-js';
import { SegmentedControl } from './SegmentedControl';
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
  PALETTE_SIZE,
  type ColorFormat,
  type HSVA,
  type ChannelSpec,
  type PaletteSlots,
} from '../../color-core';
import { loadPalette, savePalette, subscribePalette } from '../../color-palette-store';

interface ColorPickerPanelProps {
  value: string;
  onChange: (value: string) => void;
  alpha?: boolean;
  palette?: boolean;
}

const FORMAT_OPTIONS: { value: ColorFormat; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'oklch', label: 'OKLCH' },
];

// The format choice follows the user across pickers within a session —
// switching to OKLCH once shouldn't need repeating per control.
let stickyFormat: ColorFormat = 'hex';

const BLACK: HSVA = { h: 0, s: 0, v: 0, a: 1 };

/** Shared drag surface: pointer-capture + normalized 0–1 coordinates. */
function createAreaDrag(onPoint: (x: number, y: number) => void) {
  let el: HTMLDivElement | undefined;
  let dragging = false;

  const readPoint = (e: PointerEvent) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    onPoint(x, y);
  };

  return {
    ref: (node: HTMLDivElement) => {
      el = node;
    },
    onPointerDown: (e: PointerEvent) => {
      e.preventDefault();
      el?.setPointerCapture(e.pointerId);
      dragging = true;
      readPoint(e);
    },
    onPointerMove: (e: PointerEvent) => {
      // Insurance against lost pointer capture: no buttons down means no drag.
      if (dragging && e.buttons === 0) {
        dragging = false;
        return;
      }
      if (dragging) readPoint(e);
    },
    onPointerUp: () => {
      dragging = false;
    },
    onPointerCancel: () => {
      dragging = false;
    },
  };
}

/**
 * One numeric channel field. Holds a draft string while focused so partial
 * typing ("25" on the way to "255") never round-trips through the color.
 */
function ChannelField(props: { spec: ChannelSpec; value: number; onCommit: (n: number) => void }) {
  const [draft, setDraft] = createSignal<string | null>(null);
  const display = () => draft() ?? String(props.value);

  const commit = () => {
    const d = draft();
    if (d !== null) props.onCommit(Number(d));
    setDraft(null);
  };

  return (
    <label class="dialkit-color-field">
      <input
        type="text"
        inputmode="decimal"
        value={display()}
        onFocus={(e) => {
          setDraft(String(props.value));
          e.currentTarget.select();
        }}
        onInput={(e) => setDraft(e.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit();
            e.currentTarget.blur();
          } else if (e.key === 'Escape') {
            e.stopPropagation();
            setDraft(null);
            e.currentTarget.blur();
          }
        }}
      />
      <span class="dialkit-color-field-label">{props.spec.label}</span>
    </label>
  );
}

function HexField(props: { value: string; alpha: boolean; onCommit: (hex: string) => void }) {
  const [draft, setDraft] = createSignal<string | null>(null);

  const commit = () => {
    const d = draft();
    if (d !== null) {
      const normalized = normalizeHex(d, props.alpha);
      if (normalized) props.onCommit(normalized);
    }
    setDraft(null);
  };

  return (
    <label class="dialkit-color-field dialkit-color-field-hex">
      <input
        type="text"
        spellcheck={false}
        value={(draft() ?? props.value).toUpperCase()}
        onFocus={(e) => {
          setDraft(props.value);
          e.currentTarget.select();
        }}
        onInput={(e) => setDraft(e.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit();
            e.currentTarget.blur();
          } else if (e.key === 'Escape') {
            e.stopPropagation();
            setDraft(null);
            e.currentTarget.blur();
          }
        }}
      />
      <span class="dialkit-color-field-label">HEX</span>
    </label>
  );
}

function PaletteSlot(props: {
  color: string | null;
  onSave: () => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const [holding, setHolding] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | null = null;
  let origin: { x: number; y: number } | null = null;
  let fired = false;

  const cancelHold = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    origin = null;
    setHolding(false);
  };

  onCleanup(cancelHold);

  return (
    <button
      class="dialkit-color-palette-slot"
      data-filled={String(props.color !== null)}
      data-holding={String(holding())}
      style={props.color ? { '--swatch-color': props.color } : undefined}
      title={props.color ? `${props.color.toUpperCase()} — click to apply, hold to clear` : 'Save current color'}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        // Always reset first: a new press is never a stale long-press echo.
        fired = false;
        if (!props.color) return;
        origin = { x: e.clientX, y: e.clientY };
        setHolding(true);
        timer = setTimeout(() => {
          fired = true;
          cancelHold();
          props.onClear();
        }, LONG_PRESS_MS);
      }}
      onPointerMove={(e) => {
        if (!origin) return;
        if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > PALETTE_DRAG_CANCEL_PX) {
          cancelHold();
        }
      }}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onClick={() => {
        // A completed long-press consumes the click that follows it.
        if (fired) {
          fired = false;
          return;
        }
        if (props.color) props.onApply();
        else props.onSave();
      }}
    />
  );
}

export function ColorPickerPanel(props: ColorPickerPanelProps) {
  const alpha = () => props.alpha ?? false;
  const palette = () => props.palette ?? false;

  const initialRgba = parseHex(props.value);
  const [hsva, setHsva] = createSignal<HSVA>(initialRgba ? rgbToHsv(initialRgba) : BLACK);
  const [format, setFormat] = createSignal<ColorFormat>(stickyFormat);
  const [slots, setSlots] = createSignal<PaletteSlots>(props.palette ? loadPalette() : emptyPalette());
  let lastEmitted = props.value;

  // External value changes (preset restore, config edit) re-derive the working
  // state; our own emissions don't, so the SV thumb keeps hue/sat at black/white.
  createEffect(() => {
    const value = props.value;
    if (value === lastEmitted) return;
    lastEmitted = value;
    const rgba = parseHex(value);
    if (rgba) setHsva(rgbToHsv(rgba));
  });

  createEffect(() => {
    if (!palette()) return;
    onCleanup(subscribePalette((s) => setSlots(s)));
  });

  const emit = (next: HSVA) => {
    setHsva(next);
    const hex = formatHex(hsvToRgb(next), alpha());
    lastEmitted = hex;
    props.onChange(hex);
  };

  const applyHex = (hex: string) => {
    const rgba = parseHex(hex);
    if (!rgba) return;
    const normalized = formatHex(rgba, alpha());
    setHsva(rgbToHsv(rgba));
    lastEmitted = normalized;
    props.onChange(normalized);
  };

  const svDrag = createAreaDrag((x, y) => emit({ ...hsva(), s: x, v: 1 - y }));
  const hueDrag = createAreaDrag((x) => emit({ ...hsva(), h: Math.min(x * 360, 359.999) }));
  const alphaDrag = createAreaDrag((x) => emit({ ...hsva(), a: x }));

  const rgba = () => hsvToRgb(hsva());
  const opaqueHex = () => formatHex(rgba(), false);
  const currentHex = () => formatHex(rgba(), alpha());
  const channelSpecs = () =>
    format() === 'hex' ? [] : getChannels(format() as Exclude<ColorFormat, 'hex'>, alpha());
  const channelValues = () =>
    format() === 'hex' ? [] : rgbaToChannels(rgba(), format() as Exclude<ColorFormat, 'hex'>, alpha());

  const commitChannel = (index: number, n: number) => {
    const next = [...channelValues()];
    next[index] = n;
    const committed = channelsToRgba(next, format() as Exclude<ColorFormat, 'hex'>, alpha());
    const nextHsva = rgbToHsv(committed);
    // Hue/saturation are meaningless on grays; keep the current ones so the
    // SV thumb doesn't jump when a channel edit lands on black/white.
    if (nextHsva.s === 0) nextHsva.h = hsva().h;
    if (nextHsva.v === 0) nextHsva.s = hsva().s;
    emit(nextHsva);
  };

  return (
    <div class="dialkit-color-picker" style={{ '--picker-hue': String(hsva().h) }}>
      <div
        class="dialkit-color-sv"
        ref={svDrag.ref}
        onPointerDown={svDrag.onPointerDown}
        onPointerMove={svDrag.onPointerMove}
        onPointerUp={svDrag.onPointerUp}
        onPointerCancel={svDrag.onPointerCancel}
      >
        <div
          class="dialkit-color-sv-thumb"
          style={{ left: `${hsva().s * 100}%`, top: `${(1 - hsva().v) * 100}%`, background: opaqueHex() }}
        />
      </div>

      <div
        class="dialkit-color-slider dialkit-color-hue"
        ref={hueDrag.ref}
        onPointerDown={hueDrag.onPointerDown}
        onPointerMove={hueDrag.onPointerMove}
        onPointerUp={hueDrag.onPointerUp}
        onPointerCancel={hueDrag.onPointerCancel}
      >
        <div
          class="dialkit-color-slider-thumb"
          style={{ left: `${(hsva().h / 360) * 100}%`, background: `hsl(${hsva().h} 100% 50%)` }}
        />
      </div>

      <Show when={alpha()}>
        <div
          class="dialkit-color-slider dialkit-color-alpha dialkit-checker"
          ref={alphaDrag.ref}
          onPointerDown={alphaDrag.onPointerDown}
          onPointerMove={alphaDrag.onPointerMove}
          onPointerUp={alphaDrag.onPointerUp}
          onPointerCancel={alphaDrag.onPointerCancel}
        >
          <div
            class="dialkit-color-alpha-gradient"
            style={{ background: `linear-gradient(to right, transparent, ${opaqueHex()})` }}
          />
          <div
            class="dialkit-color-slider-thumb"
            style={{ left: `${hsva().a * 100}%`, background: opaqueHex(), opacity: Math.max(hsva().a, 0.15) }}
          />
        </div>
      </Show>

      <SegmentedControl
        options={FORMAT_OPTIONS}
        value={format()}
        onChange={(f) => {
          stickyFormat = f;
          setFormat(f);
        }}
      />

      <div class="dialkit-color-fields" data-format={format()}>
        <Show
          when={format() === 'hex'}
          fallback={
            <For each={channelSpecs()}>
              {(spec, i) => (
                <ChannelField spec={spec} value={channelValues()[i()]} onCommit={(n) => commitChannel(i(), n)} />
              )}
            </For>
          }
        >
          <HexField value={currentHex()} alpha={alpha()} onCommit={applyHex} />
          <Show when={alpha()}>
            <ChannelField
              spec={{ key: 'a', label: 'A', min: 0, max: 100, step: 1, precision: 0 }}
              value={opacityPercent(rgba())}
              onCommit={(n) => emit({ ...hsva(), a: Math.min(1, Math.max(0, n / 100)) })}
            />
          </Show>
        </Show>
      </div>

      <Show when={palette()}>
        <div class="dialkit-color-palette">
          <For each={Array.from({ length: PALETTE_SIZE }, (_, i) => i)}>
            {(i) => (
              <PaletteSlot
                color={slots()[i] ?? null}
                // Read the store at commit time — a 500ms hold is long enough for
                // another panel or tab to have rewritten the palette underneath.
                onSave={() => savePalette(loadPalette().map((s, j) => (j === i ? currentHex() : s)))}
                onApply={() => {
                  const saved = slots()[i];
                  if (saved) applyHex(saved);
                }}
                onClear={() => savePalette(loadPalette().map((s, j) => (j === i ? null : s)))}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
