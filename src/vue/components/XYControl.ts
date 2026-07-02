import { defineComponent, h, type PropType } from 'vue';
import { XYPad } from './XYPad';
import type { ShortcutConfig, XYAxis, XYValue } from '../../store/DialStore';

/**
 * Config wrapper for the XY pad — the `{ type: 'xy' }` case. Reads the resolved
 * ControlMeta fields and forwards them to the standalone XYPad, mirroring how
 * ColorControl wraps ColorPickerPanel.
 */
export const XYControl = defineComponent({
  name: 'DialKitXYControl',
  props: {
    label: { type: String, required: true },
    value: { type: Object as PropType<XYValue>, required: true },
    x: { type: Object as PropType<XYAxis>, default: undefined },
    y: { type: Object as PropType<XYAxis>, default: undefined },
    grid: { type: [Boolean, Number] as PropType<boolean | number>, default: undefined },
    density: { type: Number, default: undefined },
    snap: { type: Boolean, default: undefined },
    returnToCenter: { type: Boolean, default: undefined },
    showValues: { type: Boolean, default: undefined },
    shortcut: { type: Object as PropType<ShortcutConfig>, default: undefined },
    shortcutActive: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () => h(XYPad, {
      label: props.label,
      value: props.value,
      x: props.x,
      y: props.y,
      grid: props.grid,
      density: props.density,
      snap: props.snap,
      returnToCenter: props.returnToCenter,
      showValues: props.showValues,
      shortcut: props.shortcut,
      shortcutActive: props.shortcutActive,
      onChange: (next: XYValue) => emit('change', next),
    });
  },
});
