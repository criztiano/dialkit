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
  name: 'TweakersAnalyserVisualization',
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

    return () => {
      const children = [
        h('canvas', {
          ref: canvasRef,
          class: 'tweakers-analyser-viz',
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
              'M'
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
              'S'
            )
          );
        }
        children.push(h('div', { class: 'tweakers-analyser-actions' }, buttons));
      }
      return h('div', { class: 'tweakers-analyser-viz-wrap', style: { width: `${props.width}px` } }, children);
    };
  },
});
