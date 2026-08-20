<script lang="ts">
  import XYPad from './XYPad.svelte';
  import type { ShortcutConfig, XYAxis, XYValue } from 'tweakers/store';

  let { label, value, onChange, x, y, grid, density, snap, returnToCenter, showValues, shortcut, shortcutActive } = $props<{
    label: string;
    value: XYValue;
    onChange: (value: XYValue) => void;
    x?: XYAxis;
    y?: XYAxis;
    grid?: boolean | number;
    density?: number;
    snap?: boolean;
    returnToCenter?: boolean;
    showValues?: boolean;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
  }>();
</script>

<!--
  Config wrapper for the XY pad — the `{ type: 'xy' }` case. Reads the resolved
  ControlMeta fields and forwards them to the standalone XYPad, mirroring how
  ColorControl wraps ColorPickerPanel.
-->
<XYPad {label} {value} {onChange} {x} {y} {grid} {density} {snap} {returnToCenter} {showValues} {shortcut} {shortcutActive} />
