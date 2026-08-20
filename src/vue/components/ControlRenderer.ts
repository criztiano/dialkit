import { Fragment, defineComponent, h, inject, type PropType } from 'vue';
import { DialStore, hintDomId } from '../../store/DialStore';
import type {
  ControlMeta,
  DialValue,
  RangeValue,
  SpringConfig,
  TransitionConfig,
  XYValue,
} from '../../store/DialStore';
import type { GradientValue } from '../../gradient-core';
import { ColorControl } from './ColorControl';
import { Folder } from './Folder';
import { ModuleFolder } from './ModuleFolder';
import { NumberControl } from './NumberControl';
import { ControlShell } from './ControlShell';
import { GradientControl } from './GradientControl';
import { RangeSlider } from './RangeSlider';
import { SelectControl } from './SelectControl';
import { ShortcutKey } from './ShortcutListener';
import { Slider } from './Slider';
import { SpringControl } from './SpringControl';
import { TextControl } from './TextControl';
import { Toggle } from './Toggle';
import { TransitionControl, type TransitionDurationControl } from './TransitionControl';
import { XYControl } from './XYControl';

// Single control switch shared by the settings Panel and the timeline clip
// popover, so every DialKit control type renders identically in both places.
export const ControlRenderer = defineComponent({
  name: 'DialKitControlRenderer',
  props: {
    panelId: { type: String, required: true },
    controls: { type: Array as PropType<ControlMeta[]>, required: true },
    values: { type: Object as PropType<Record<string, DialValue>>, required: true },
    transitionDuration: Object as PropType<TransitionDurationControl>,
  },
  setup(props) {
    const shortcut = inject(ShortcutKey, undefined);
    const isShortcutActive = (path: string) =>
      shortcut?.activePanelId.value === props.panelId && shortcut.activePath.value === path;
    // Panel id and path are both stable and unique, so no id generator is needed.
    const hintId = (control: ControlMeta) => hintDomId(props.panelId, control.path);
    const renderControlNode = (control: ControlMeta): ReturnType<typeof h> | null => {
      const value = props.values[control.path];
      switch (control.type) {
        case 'slider':
          return h(Slider, {
            key: control.path,
            label: control.label,
            value: value as number,
            min: control.min,
            max: control.max,
            step: control.step,
            orientation: control.orientation,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next: number) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'number':
          return h(NumberControl, {
            key: control.path,
            label: control.label,
            value: value as number,
            min: control.min,
            max: control.max,
            step: control.step,
            unit: control.unit,
            formatValue: control.formatValue,
            orientation: control.orientation,
            onChange: (next: number) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'range':
          return h(RangeSlider, {
            key: control.path,
            label: control.label,
            value: value as RangeValue,
            min: control.min ?? 0,
            max: control.max ?? 1,
            step: control.step,
            defaultValue: control.rangeDefault,
            onChange: (next: RangeValue) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'toggle':
          return h(Toggle, {
            key: control.path,
            label: control.label,
            checked: value as boolean,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next: boolean) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'spring':
          return h(SpringControl, {
            key: control.path,
            panelId: props.panelId,
            path: control.path,
            label: control.label,
            spring: value as SpringConfig,
            onChange: (next: SpringConfig) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'transition':
          return h(TransitionControl, {
            key: control.path,
            panelId: props.panelId,
            path: control.path,
            label: control.label,
            value: value as TransitionConfig,
            durationControl: props.transitionDuration,
            onChange: (next: TransitionConfig) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'folder':
          // A folder that declared `_enabled` renders as a module: the header
          // switch drives the `<path>._enabled` value through the store.
          if (control.module) {
            const enabledPath = `${control.path}._enabled`;
            return h(ModuleFolder, {
              key: control.path,
              title: control.label,
              enabled: props.values[enabledPath] as boolean,
              onEnabledChange: (next: boolean) => DialStore.updateValue(props.panelId, enabledPath, next),
              defaultOpen: control.defaultOpen ?? true,
              hint: control.hint,
              hintId: hintId(control),
            }, { default: () => (control.children ?? []).map(renderControl) });
          }
          return h(Folder, {
            key: control.path,
            title: control.label,
            defaultOpen: control.defaultOpen ?? true,
            collapsible: control.collapsible ?? true,
            hint: control.hint,
            hintId: hintId(control),
          }, { default: () => (control.children ?? []).map(renderControl) });
        case 'text':
          return h(TextControl, {
            key: control.path,
            label: control.label,
            value: value as string,
            placeholder: control.placeholder,
            onChange: (next: string) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'select':
          return h(SelectControl, {
            key: control.path,
            label: control.label,
            value: value as string,
            options: control.options ?? [],
            onChange: (next: string) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'color':
          return h(ColorControl, {
            key: control.path,
            label: control.label,
            value: value as string,
            alpha: control.alpha,
            palette: control.palette,
            onChange: (next: string) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'gradient':
          return h(GradientControl, {
            key: control.path,
            label: control.label,
            value: value as GradientValue,
            onChange: (next: GradientValue) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'xy':
          return h(XYControl, {
            key: control.path,
            label: control.label,
            value: value as XYValue,
            x: control.xAxis,
            y: control.yAxis,
            grid: control.grid,
            density: control.density,
            snap: control.snap,
            returnToCenter: control.returnToCenter,
            showValues: control.showValues,
            shortcut: control.shortcut,
            shortcutActive: isShortcutActive(control.path),
            onChange: (next: XYValue) => DialStore.updateValue(props.panelId, control.path, next),
          });
        case 'action':
          return h('button', {
            key: control.path,
            class: 'dialkit-button',
            // The wrapper greys every control out, but only a real `disabled`
            // takes a button out of the tab order too.
            disabled: DialStore.isDisabled(props.panelId, control.path),
            onClick: () => DialStore.triggerAction(props.panelId, control.path),
          }, control.label);
        default:
          return null;
      }
    };

    // Wrap leaf controls so they can carry a hint. Without one the wrapper falls
    // back to a native tooltip showing the config path — a quick dev reference
    // for which key a control maps to. Folders manage their own rows.
    const renderControl = (control: ControlMeta): ReturnType<typeof h> | null => {
      const node = renderControlNode(control);
      if (control.type === 'folder') return node;
      return h(ControlShell, {
        key: control.path,
        hint: control.hint,
        title: control.path,
        id: hintId(control),
        affordance: control.affordance,
        panelId: props.panelId,
        path: control.path,
      }, { default: () => node });
    };

    return () => h(Fragment, null, props.controls.map(renderControl));
  },
});
