import { useState, useRef, useEffect, useCallback } from 'react';
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
} from '../color-core';
import { loadPalette, savePalette, subscribePalette } from '../color-palette-store';

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
function useAreaDrag(onPoint: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const readPoint = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      onPoint(x, y);
    },
    [onPoint]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    ref.current?.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    readPoint(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    // Insurance against lost pointer capture: no buttons down means no drag.
    if (draggingRef.current && e.buttons === 0) {
      draggingRef.current = false;
      return;
    }
    if (draggingRef.current) readPoint(e);
  };
  const endDrag = () => {
    draggingRef.current = false;
  };

  return { ref, onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag };
}

/**
 * One numeric channel field. Holds a draft string while focused so partial
 * typing ("25" on the way to "255") never round-trips through the color.
 */
function ChannelField({ spec, value, onCommit }: { spec: ChannelSpec; value: number; onCommit: (n: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? String(value);

  const commit = () => {
    if (draft !== null) onCommit(Number(draft));
    setDraft(null);
  };

  return (
    <label className="dialkit-color-field">
      <input
        type="text"
        inputMode="decimal"
        value={display}
        onFocus={(e) => {
          setDraft(String(value));
          e.target.select();
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            e.stopPropagation();
            setDraft(null);
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      <span className="dialkit-color-field-label">{spec.label}</span>
    </label>
  );
}

function HexField({ value, alpha, onCommit }: { value: string; alpha: boolean; onCommit: (hex: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft !== null) {
      const normalized = normalizeHex(draft, alpha);
      if (normalized) onCommit(normalized);
    }
    setDraft(null);
  };

  return (
    <label className="dialkit-color-field dialkit-color-field-hex">
      <input
        type="text"
        spellCheck={false}
        value={(draft ?? value).toUpperCase()}
        onFocus={(e) => {
          setDraft(value);
          e.target.select();
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            e.stopPropagation();
            setDraft(null);
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      <span className="dialkit-color-field-label">HEX</span>
    </label>
  );
}

function PaletteSlot({
  color,
  onSave,
  onApply,
  onClear,
}: {
  color: string | null;
  onSave: () => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const [holding, setHolding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const firedRef = useRef(false);

  const cancelHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    originRef.current = null;
    setHolding(false);
  };

  useEffect(() => () => cancelHold(), []);

  return (
    <button
      className="dialkit-color-palette-slot"
      data-filled={String(color !== null)}
      data-holding={String(holding)}
      style={color ? ({ '--swatch-color': color } as React.CSSProperties) : undefined}
      title={color ? `${color.toUpperCase()} — click to apply, hold to clear` : 'Save current color'}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        // Always reset first: a new press is never a stale long-press echo.
        firedRef.current = false;
        if (!color) return;
        originRef.current = { x: e.clientX, y: e.clientY };
        setHolding(true);
        timerRef.current = setTimeout(() => {
          firedRef.current = true;
          cancelHold();
          onClear();
        }, LONG_PRESS_MS);
      }}
      onPointerMove={(e) => {
        const origin = originRef.current;
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
        if (firedRef.current) {
          firedRef.current = false;
          return;
        }
        if (color) onApply();
        else onSave();
      }}
    />
  );
}

export function ColorPickerPanel({ value, onChange, alpha = false, palette = false }: ColorPickerPanelProps) {
  const [hsva, setHsva] = useState<HSVA>(() => {
    const rgba = parseHex(value);
    return rgba ? rgbToHsv(rgba) : BLACK;
  });
  const [format, setFormat] = useState<ColorFormat>(stickyFormat);
  const [slots, setSlots] = useState<PaletteSlots>(() => (palette ? loadPalette() : emptyPalette()));
  const lastEmittedRef = useRef(value);

  // External value changes (preset restore, config edit) re-derive the working
  // state; our own emissions don't, so the SV thumb keeps hue/sat at black/white.
  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    const rgba = parseHex(value);
    if (rgba) setHsva(rgbToHsv(rgba));
  }, [value]);

  useEffect(() => {
    if (!palette) return;
    return subscribePalette(setSlots);
  }, [palette]);

  const emit = useCallback(
    (next: HSVA) => {
      setHsva(next);
      const hex = formatHex(hsvToRgb(next), alpha);
      lastEmittedRef.current = hex;
      onChange(hex);
    },
    [alpha, onChange]
  );

  const applyHex = useCallback(
    (hex: string) => {
      const rgba = parseHex(hex);
      if (!rgba) return;
      const normalized = formatHex(rgba, alpha);
      setHsva(rgbToHsv(rgba));
      lastEmittedRef.current = normalized;
      onChange(normalized);
    },
    [alpha, onChange]
  );

  const hsvaRef = useRef(hsva);
  hsvaRef.current = hsva;

  const svDrag = useAreaDrag(
    useCallback((x, y) => emit({ ...hsvaRef.current, s: x, v: 1 - y }), [emit])
  );
  const hueDrag = useAreaDrag(
    useCallback((x) => emit({ ...hsvaRef.current, h: Math.min(x * 360, 359.999) }), [emit])
  );
  const alphaDrag = useAreaDrag(
    useCallback((x) => emit({ ...hsvaRef.current, a: x }), [emit])
  );

  const rgba = hsvToRgb(hsva);
  const opaqueHex = formatHex(rgba, false);
  const currentHex = formatHex(rgba, alpha);
  const channelSpecs = format === 'hex' ? [] : getChannels(format, alpha);
  const channelValues = format === 'hex' ? [] : rgbaToChannels(rgba, format, alpha);

  const commitChannel = (index: number, n: number) => {
    const next = [...channelValues];
    next[index] = n;
    const committed = channelsToRgba(next, format as Exclude<ColorFormat, 'hex'>, alpha);
    const nextHsva = rgbToHsv(committed);
    // Hue/saturation are meaningless on grays; keep the current ones so the
    // SV thumb doesn't jump when a channel edit lands on black/white.
    if (nextHsva.s === 0) nextHsva.h = hsva.h;
    if (nextHsva.v === 0) nextHsva.s = hsva.s;
    emit(nextHsva);
  };

  return (
    <div className="dialkit-color-picker" style={{ '--picker-hue': hsva.h } as React.CSSProperties}>
      <div
        className="dialkit-color-sv"
        ref={svDrag.ref}
        onPointerDown={svDrag.onPointerDown}
        onPointerMove={svDrag.onPointerMove}
        onPointerUp={svDrag.onPointerUp}
        onPointerCancel={svDrag.onPointerCancel}
      >
        <div
          className="dialkit-color-sv-thumb"
          style={{ left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: opaqueHex }}
        />
      </div>

      <div
        className="dialkit-color-slider dialkit-color-hue"
        ref={hueDrag.ref}
        onPointerDown={hueDrag.onPointerDown}
        onPointerMove={hueDrag.onPointerMove}
        onPointerUp={hueDrag.onPointerUp}
        onPointerCancel={hueDrag.onPointerCancel}
      >
        <div
          className="dialkit-color-slider-thumb"
          style={{ left: `${(hsva.h / 360) * 100}%`, background: `hsl(${hsva.h} 100% 50%)` }}
        />
      </div>

      {alpha && (
        <div
          className="dialkit-color-slider dialkit-color-alpha dialkit-checker"
          ref={alphaDrag.ref}
          onPointerDown={alphaDrag.onPointerDown}
          onPointerMove={alphaDrag.onPointerMove}
          onPointerUp={alphaDrag.onPointerUp}
          onPointerCancel={alphaDrag.onPointerCancel}
        >
          <div
            className="dialkit-color-alpha-gradient"
            style={{ background: `linear-gradient(to right, transparent, ${opaqueHex})` }}
          />
          <div
            className="dialkit-color-slider-thumb"
            style={{ left: `${hsva.a * 100}%`, background: opaqueHex, opacity: Math.max(hsva.a, 0.15) }}
          />
        </div>
      )}

      <SegmentedControl
        options={FORMAT_OPTIONS}
        value={format}
        onChange={(f) => {
          stickyFormat = f;
          setFormat(f);
        }}
      />

      <div className="dialkit-color-fields" data-format={format}>
        {format === 'hex' ? (
          <>
            <HexField value={currentHex} alpha={alpha} onCommit={applyHex} />
            {alpha && (
              <ChannelField
                spec={{ key: 'a', label: 'A', min: 0, max: 100, step: 1, precision: 0 }}
                value={opacityPercent(rgba)}
                onCommit={(n) => emit({ ...hsva, a: Math.min(1, Math.max(0, n / 100)) })}
              />
            )}
          </>
        ) : (
          channelSpecs.map((spec, i) => (
            <ChannelField key={`${format}-${spec.key}`} spec={spec} value={channelValues[i]} onCommit={(n) => commitChannel(i, n)} />
          ))
        )}
      </div>

      {palette && (
        <div className="dialkit-color-palette">
          {Array.from({ length: PALETTE_SIZE }, (_, i) => (
            <PaletteSlot
              key={i}
              color={slots[i] ?? null}
              // Read the store at commit time — a 500ms hold is long enough for
              // another panel or tab to have rewritten the palette underneath.
              onSave={() => savePalette(loadPalette().map((s, j) => (j === i ? currentHex : s)))}
              onApply={() => {
                const saved = slots[i];
                if (saved) applyHex(saved);
              }}
              onClear={() => savePalette(loadPalette().map((s, j) => (j === i ? null : s)))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
