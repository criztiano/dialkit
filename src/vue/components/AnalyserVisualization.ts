import { defineComponent, h, ref, onMounted, onBeforeUnmount, type PropType } from 'vue';
import { createAnalyserEngine } from '../../analyser-engine';
import type {
  AnalyserRuntime,
  AnalyserEngine,
  AnalyserSource,
  AnalyserVariant,
  AnalyserMode,
  AnalyserScale,
  AnalyserSpring,
} from '../../analyser-engine';

export type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale, AnalyserSpring } from '../../analyser-engine';

export const AnalyserVisualization = defineComponent({
  name: 'DialKitAnalyserVisualization',
  props: {
    analyser: { type: Object as PropType<AnalyserNode | null>, default: null },
    source: { type: String as PropType<AnalyserSource>, default: 'frequency' },
    variant: { type: String as PropType<AnalyserVariant>, default: 'area' },
    mode: { type: String as PropType<AnalyserMode>, default: 'smooth' },
    pixelSize: { type: Number, default: 1 },
    scale: { type: String as PropType<AnalyserScale>, default: 'log' },
    spring: { type: [Boolean, Object] as PropType<AnalyserSpring>, default: false },
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    waveColor: { type: String, default: undefined },
    fillColor: { type: String, default: undefined },
    muted: { type: Boolean, default: false },
    onMuteChange: { type: Function as PropType<(muted: boolean) => void>, default: undefined },
    soloed: { type: Boolean, default: false },
    onSoloChange: { type: Function as PropType<(soloed: boolean) => void>, default: undefined },
    width: { type: Number, default: 256 },
    height: { type: Number, default: 140 },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let engine: AnalyserEngine | null = null;

    onMounted(() => {
      if (!canvasRef.value) return;
      engine = createAnalyserEngine(
        canvasRef.value,
        (): AnalyserRuntime => ({
          analyser: props.analyser,
          source: props.source,
          variant: props.variant,
          mode: props.mode,
          pixelSize: props.pixelSize,
          scale: props.scale,
          spring: props.spring,
          grid: props.grid,
          gridSubdivisions: props.gridSubdivisions,
          waveColor: props.waveColor,
          fillColor: props.fillColor,
          muted: props.muted,
          width: props.width,
          height: props.height,
        })
      );
    });

    onBeforeUnmount(() => engine?.destroy());

    const muteIcon = () =>
      h('svg', { viewBox: '0 0 16 16', fill: 'none' }, [
        h('path', { d: 'M3 6 H5 L8.5 3 V13 L5 10 H3 Z', fill: 'currentColor' }),
        h('path', {
          d: 'M10.5 6 L13.5 10 M13.5 6 L10.5 10',
          stroke: 'currentColor',
          'stroke-width': '1.6',
          'stroke-linecap': 'round',
        }),
      ]);
    const soloIcon = () =>
      h('svg', { viewBox: '0 0 16 16', fill: 'none' }, [
        h('path', {
          d: 'M3.4 12 V8.8 a4.6 4.6 0 0 1 9.2 0 V12',
          stroke: 'currentColor',
          'stroke-width': '1.6',
          'stroke-linecap': 'round',
        }),
        h('rect', { x: '2.6', y: '9.9', width: '1.8', height: '2.9', rx: '0.9', fill: 'currentColor' }),
        h('rect', { x: '11.6', y: '9.9', width: '1.8', height: '2.9', rx: '0.9', fill: 'currentColor' }),
      ]);

    return () => {
      const children = [
        h('canvas', {
          ref: canvasRef,
          class: 'dialkit-analyser-viz',
          style: { width: `${props.width}px`, height: `${props.height}px` },
        }),
      ];
      if (props.onMuteChange || props.onSoloChange) {
        const buttons = [];
        if (props.onMuteChange) {
          buttons.push(
            h(
              'button',
              {
                type: 'button',
                'aria-label': 'Mute',
                'aria-pressed': props.muted,
                onClick: () => props.onMuteChange?.(!props.muted),
              },
              [muteIcon()]
            )
          );
        }
        if (props.onSoloChange) {
          buttons.push(
            h(
              'button',
              {
                type: 'button',
                'aria-label': 'Solo',
                'aria-pressed': props.soloed,
                onClick: () => props.onSoloChange?.(!props.soloed),
              },
              [soloIcon()]
            )
          );
        }
        children.push(h('div', { class: 'dialkit-analyser-actions' }, buttons));
      }
      return h('div', { class: 'dialkit-analyser-viz-wrap', style: { width: `${props.width}px` } }, children);
    };
  },
});
