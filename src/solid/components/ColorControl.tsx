import { createSignal, createEffect, onMount, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { animate } from 'motion';
import { ColorPickerPanel } from './ColorPickerPanel';
import { parseHex, normalizeHex, bareHex, opacityPercent } from '../../color-core';

interface ColorControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  alpha?: boolean;
  palette?: boolean;
}

const PICKER_WIDTH = 240;
// Estimated open heights for the above/below flip (SV area + sliders + fields + padding).
const PICKER_BASE_HEIGHT = 270;
const PICKER_ALPHA_HEIGHT = 22;
const PICKER_PALETTE_HEIGHT = 30;

export function ColorControl(props: ColorControlProps) {
  const alpha = () => props.alpha ?? false;
  const palette = () => props.palette ?? false;
  const [isEditing, setIsEditing] = createSignal(false);
  const [editValue, setEditValue] = createSignal(bareHex(props.value));
  const [isOpen, setIsOpen] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [pos, setPos] = createSignal<{ top: number; left: number; above: boolean } | null>(null);
  const [portalTarget, setPortalTarget] = createSignal<HTMLElement | null>(null);
  let swatchRef!: HTMLButtonElement;
  let pickerRef: HTMLDivElement | undefined;
  let closeAnim: ReturnType<typeof animate> | null = null;

  const rgba = () => parseHex(props.value);

  // Sync editValue when value changes externally (edited without the '#' —
  // it renders as a fixed symbol; normalizeHex tolerates pasted '#…' anyway)
  createEffect(() => {
    const value = props.value;
    if (!isEditing()) {
      setEditValue(bareHex(value));
    }
  });

  onMount(() => {
    const root = swatchRef?.closest('.dialkit-root') as HTMLElement | null;
    setPortalTarget(root ?? document.body);

    onCleanup(() => {
      closeAnim?.stop();
    });
  });

  const updatePos = () => {
    if (!swatchRef) return;
    const rect = swatchRef.getBoundingClientRect();
    const pickerHeight =
      PICKER_BASE_HEIGHT + (alpha() ? PICKER_ALPHA_HEIGHT : 0) + (palette() ? PICKER_PALETTE_HEIGHT : 0);
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PICKER_WIDTH);
    setPos({ top: above ? rect.top - 4 : rect.bottom + 4, left, above });
  };

  const openPopover = () => {
    closeAnim?.stop();
    closeAnim = null;
    updatePos();
    if (pickerRef) {
      // Interrupted a close: the node survives (mounted never flipped), so the
      // ref-callback entrance animation won't rerun — drive it home from here.
      animate(pickerRef, { opacity: 1, y: 0, scale: 1 }, { type: 'spring', visualDuration: 0.15, bounce: 0 });
    }
    setMounted(true);
    setIsOpen(true);
  };

  const closePopover = () => {
    setIsOpen(false);
    if (!pickerRef) { setMounted(false); return; }
    const above = pos()?.above ?? false;
    closeAnim?.stop();
    closeAnim = animate(
      pickerRef,
      { opacity: 0, y: above ? 8 : -8, scale: 0.95 },
      { type: 'spring', visualDuration: 0.15, bounce: 0, onComplete: () => { setMounted(false); closeAnim = null; pickerRef = undefined; } }
    );
  };

  // Reposition on viewport changes; close on outside mousedown / Escape.
  createEffect(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (swatchRef?.contains(target) || pickerRef?.contains(target)) return;
      closePopover();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopover();
        swatchRef?.focus();
      }
    };

    updatePos();
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    onCleanup(() => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    });
  });

  const handleTextSubmit = () => {
    setIsEditing(false);
    const normalized = normalizeHex(editValue(), alpha());
    if (normalized) {
      props.onChange(normalized);
    } else {
      setEditValue(bareHex(props.value));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleTextSubmit();
    else if (e.key === 'Escape') {
      // Cancel only the edit — don't let the document handler close the popover too.
      e.stopPropagation();
      setIsEditing(false);
      setEditValue(bareHex(props.value));
    }
  };

  const popoverStyle = () => {
    const p = pos();
    if (!p) return {};
    return {
      position: 'fixed' as const,
      left: `${p.left}px`,
      width: `${PICKER_WIDTH}px`,
      ...(p.above
        ? { bottom: `${window.innerHeight - p.top}px`, 'transform-origin': 'bottom right' }
        : { top: `${p.top}px`, 'transform-origin': 'top right' }),
    };
  };

  return (
    <div class="dialkit-color-control">
      <span class="dialkit-color-label">{props.label}</span>
      <div class="dialkit-color-inputs">
        <button
          ref={swatchRef}
          class="dialkit-color-swatch"
          style={{ '--swatch-color': props.value }}
          onClick={() => (isOpen() ? closePopover() : openPopover())}
          data-open={String(isOpen())}
          title="Pick color"
          aria-label={`Pick color for ${props.label}`}
          aria-expanded={isOpen()}
        />
        <span class="dialkit-color-hex-wrap">
          <span class="dialkit-color-hash" aria-hidden="true">#</span>
          <Show
            when={isEditing()}
            fallback={
              <span class="dialkit-color-hex" onClick={() => setIsEditing(true)}>
                {bareHex(props.value)}
              </span>
            }
          >
            <input
              // Focus + select-all on edit start so a paste replaces the value outright.
              ref={(el) => queueMicrotask(() => { el.focus(); el.select(); })}
              type="text"
              class="dialkit-color-hex-input"
              value={editValue()}
              onInput={(e) => setEditValue(e.currentTarget.value)}
              onBlur={handleTextSubmit}
              onKeyDown={handleKeyDown}
            />
          </Show>
        </span>
        <Show when={alpha() && rgba()}>
          {(r) => (
            <>
              <span class="dialkit-color-divider" aria-hidden="true" />
              <span class="dialkit-color-opacity">
                {opacityPercent(r())} <span class="dialkit-color-opacity-unit">%</span>
              </span>
            </>
          )}
        </Show>
      </div>

      <Show when={!!portalTarget()}>
        <Portal mount={portalTarget()!}>
          <Show when={mounted() && pos()}>
            <div
              ref={(el) => {
                pickerRef = el;
                const above = pos()?.above ?? false;
                animate(
                  el,
                  { opacity: [0, 1], y: [above ? 8 : -8, 0], scale: [0.95, 1] },
                  { type: 'spring', visualDuration: 0.15, bounce: 0 }
                );
              }}
              class="dialkit-color-picker-popover"
              style={popoverStyle()}
            >
              <ColorPickerPanel
                value={props.value}
                onChange={(v) => props.onChange(v)}
                alpha={alpha()}
                palette={palette()}
              />
            </div>
          </Show>
        </Portal>
      </Show>
    </div>
  );
}
