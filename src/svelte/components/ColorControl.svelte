<script lang="ts">
  import Portal from '../Portal.svelte';
  import { dropdownTransition } from './transitions';
  import ColorPickerPanel from './ColorPickerPanel.svelte';
  import { parseHex, normalizeHexEdit, bareHex, opacityPercent } from '../../color-core';

  let { label, value, onChange, alpha = false, palette = false } = $props<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
    palette?: boolean;
  }>();

  const PICKER_WIDTH = 240;
  // Estimated open heights for the above/below flip (SV area + sliders + fields + padding).
  const PICKER_BASE_HEIGHT = 270;
  const PICKER_ALPHA_HEIGHT = 22;
  const PICKER_PALETTE_HEIGHT = 30;

  let isEditing = $state(false);
  let editValue = $state('');
  let isOpen = $state(false);
  let pos = $state<{ top: number; left: number; above: boolean } | null>(null);
  let portalTarget = $state<HTMLElement | null>(null);
  let swatchRef: HTMLButtonElement | undefined;
  let pickerRef = $state<HTMLDivElement | undefined>(undefined);

  const rgba = $derived(parseHex(value));

  // Sync editValue when value changes externally (edited without the '#' —
  // it renders as a fixed symbol; normalizeHex tolerates pasted '#…' anyway)
  $effect(() => {
    value;
    if (!isEditing) {
      editValue = bareHex(value);
    }
  });

  const updatePos = () => {
    if (!swatchRef || typeof window === 'undefined') return;
    const rect = swatchRef.getBoundingClientRect();
    const pickerHeight =
      PICKER_BASE_HEIGHT + (alpha ? PICKER_ALPHA_HEIGHT : 0) + (palette ? PICKER_PALETTE_HEIGHT : 0);
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const above = spaceBelow < pickerHeight && rect.top > spaceBelow;
    const left = Math.max(8, rect.right - PICKER_WIDTH);
    pos = { top: above ? rect.top - 4 : rect.bottom + 4, left, above };
  };

  const openPicker = () => {
    updatePos();
    isOpen = true;
  };

  const popoverStyle = $derived.by(() => {
    if (!pos || typeof window === 'undefined') return '';
    if (pos.above) {
      return `position:fixed;left:${pos.left}px;width:${PICKER_WIDTH}px;bottom:${window.innerHeight - pos.top}px;transform-origin:bottom right;`;
    }
    return `position:fixed;left:${pos.left}px;width:${PICKER_WIDTH}px;top:${pos.top}px;transform-origin:top right;`;
  });

  $effect(() => {
    if (typeof document === 'undefined' || !swatchRef) return;
    portalTarget = (swatchRef.closest('.tweakers-root') as HTMLElement | null) ?? document.body;
  });

  $effect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    updatePos();
    const onViewport = () => updatePos();
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (swatchRef?.contains(target) || pickerRef?.contains(target)) return;
      isOpen = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isOpen = false;
        swatchRef?.focus();
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onViewport);
    window.addEventListener('scroll', onViewport, true);

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onViewport);
      window.removeEventListener('scroll', onViewport, true);
    };
  });

  const handleTextSubmit = () => {
    isEditing = false;
    // A bare 6-digit entry keeps the current opacity — the alpha digits are
    // deliberately absent from the edit field (they have their own readout).
    const normalized = normalizeHexEdit(editValue, alpha, rgba?.a ?? 1);
    if (normalized) {
      onChange(normalized);
    } else {
      editValue = bareHex(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      // Cancel only the edit — don't let the document handler close the popover too.
      e.stopPropagation();
      isEditing = false;
      editValue = bareHex(value);
    }
  };

  // React's autoFocus equivalent — the input mounts only when editing starts.
  // Select-all so a paste replaces the value outright.
  const focusOnMount = (node: HTMLInputElement) => {
    node.focus();
    node.select();
  };
</script>

<div class="tweakers-color-control">
  <span class="tweakers-color-label">{label}</span>
  <div class="tweakers-color-inputs">
    <!-- The whole token (hash included) is the click target for editing. -->
    <span class="tweakers-color-hex-wrap" onclick={() => (isEditing = true)}>
      <span class="tweakers-color-hash" aria-hidden="true">#</span>
      {#if isEditing}
        <input
          type="text"
          class="tweakers-color-hex-input"
          aria-label={`Hex color for ${label}`}
          value={editValue}
          oninput={(e) => (editValue = (e.currentTarget as HTMLInputElement).value)}
          onblur={handleTextSubmit}
          onkeydown={handleKeyDown}
          use:focusOnMount
        />
      {:else}
        <span class="tweakers-color-hex" aria-label={`Hex color for ${label}`}>
          {bareHex(value)}
        </span>
      {/if}
    </span>
    {#if alpha && rgba}
      <span class="tweakers-color-divider" aria-hidden="true"></span>
      <span class="tweakers-color-opacity">
        {opacityPercent(rgba)} <span class="tweakers-color-opacity-unit">%</span>
      </span>
    {/if}
    <button
      bind:this={swatchRef}
      class="tweakers-color-swatch"
      style:--swatch-color={value}
      onclick={() => (isOpen ? (isOpen = false) : openPicker())}
      data-open={String(isOpen)}
      title="Pick color"
      aria-label={`Pick color for ${label}`}
      aria-expanded={isOpen}
    ></button>
  </div>

  {#if portalTarget}
    <Portal target={portalTarget}>
      {#if isOpen && pos}
        <div
          bind:this={pickerRef}
          class="tweakers-color-picker-popover"
          style={popoverStyle}
          transition:dropdownTransition={{ above: pos.above }}
        >
          <ColorPickerPanel {value} {onChange} {alpha} {palette} />
        </div>
      {/if}
    </Portal>
  {/if}
</div>
