import { defineComponent, h, ref, onMounted, onBeforeUnmount, type PropType } from 'vue';
import { createWaveformEngine, WAVEFORM_MAX_ZOOM } from '../../waveform-engine';
import type { WaveformRuntime, WaveformMode, WaveformLoop, WaveformEngine } from '../../waveform-engine';

export type { WaveformMode, WaveformLoop } from '../../waveform-engine';

export const WaveformVisualization = defineComponent({
  name: 'DialKitWaveformVisualization',
  props: {
    buffer: { type: Object as PropType<AudioBuffer | null>, default: null },
    progress: { type: Number, default: 0 },
    getProgress: { type: Function as PropType<() => number>, default: undefined },
    mode: { type: String as PropType<WaveformMode>, default: 'smooth' },
    border: { type: Boolean, default: false },
    bands: { type: Boolean, default: false },
    pixelSize: { type: Number, default: 1 },
    grid: { type: Boolean, default: false },
    gridSubdivisions: { type: Number, default: 8 },
    onSeek: { type: Function as PropType<(progress: number) => void>, default: undefined },
    loop: { type: Object as PropType<WaveformLoop | null>, default: null },
    onLoopChange: { type: Function as PropType<(loop: WaveformLoop | null) => void>, default: undefined },
    waveColor: { type: String, default: undefined },
    playheadColor: { type: String, default: undefined },
    autoZoomOnLoop: { type: Boolean, default: false },
    width: { type: Number, default: 256 },
    height: { type: Number, default: 140 },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const zoom = ref(1);
    let engine: WaveformEngine | null = null;

    onMounted(() => {
      if (!canvasRef.value) return;
      engine = createWaveformEngine(
        canvasRef.value,
        (): WaveformRuntime => ({
          buffer: props.buffer,
          progress: props.progress,
          getProgress: props.getProgress,
          mode: props.mode,
          border: props.border,
          bands: props.bands,
          pixelSize: props.pixelSize,
          grid: props.grid,
          gridSubdivisions: props.gridSubdivisions,
          waveColor: props.waveColor,
          playheadColor: props.playheadColor,
          autoZoomOnLoop: props.autoZoomOnLoop,
          loop: props.loop,
          zoom: zoom.value,
          width: props.width,
          height: props.height,
          onSeek: props.onSeek,
          onLoopChange: props.onLoopChange,
        })
      );
    });

    onBeforeUnmount(() => engine?.destroy());

    const minusIcon = () =>
      h('svg', { viewBox: '0 0 16 16', fill: 'none' }, [
        h('path', { d: 'M3.5 8h9', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round' }),
      ]);
    const plusIcon = () =>
      h('svg', { viewBox: '0 0 16 16', fill: 'none' }, [
        h('path', { d: 'M8 3.5v9M3.5 8h9', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round' }),
      ]);

    return () => {
      const framingLoop = props.autoZoomOnLoop && !!props.loop;
      const children = [
        h('canvas', {
          ref: canvasRef,
          class: 'dialkit-waveform-viz',
          style: { width: `${props.width}px`, height: `${props.height}px` },
        }),
      ];
      if (!framingLoop) {
        const buttons = [];
        if (zoom.value > 1) {
          buttons.push(
            h(
              'button',
              {
                type: 'button',
                'aria-label': 'Zoom out',
                onClick: () => {
                  zoom.value = Math.max(1, zoom.value / 2);
                },
              },
              [minusIcon()]
            )
          );
        }
        buttons.push(
          h(
            'button',
            {
              type: 'button',
              'aria-label': 'Zoom in',
              disabled: zoom.value >= WAVEFORM_MAX_ZOOM,
              onClick: () => {
                zoom.value = Math.min(WAVEFORM_MAX_ZOOM, zoom.value * 2);
              },
            },
            [plusIcon()]
          )
        );
        children.push(h('div', { class: 'dialkit-waveform-zoom' }, buttons));
      }
      return h('div', { class: 'dialkit-waveform-viz-wrap', style: { width: `${props.width}px` } }, children);
    };
  },
});
