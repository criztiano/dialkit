import { useRef, useEffect } from 'react';

export type WaveformMode = 'smooth' | 'pixelated';

interface WaveformVisualizationProps {
  /**
   * Audio node to visualize. The component taps it with its own analyser(s) and
   * never connects anything to the destination, so it stays silent. Pass `null`
   * to render an idle baseline.
   */
  source?: AudioNode | null;
  /**
   * 'smooth' — anti-aliased oscilloscope line.
   * 'pixelated' — crisp, high-resolution per-pixel min/max columns (no AA).
   */
  mode?: WaveformMode;
  /** Split the signal into low / mid / high bands and draw three traces. */
  bands?: boolean;
  /** Time-domain sample count (power of two). Higher = more horizontal detail. */
  fftSize?: number;
  width?: number;
  height?: number;
}

// Crossover filters for the optional 3-band EQ split.
const BANDS: { type: BiquadFilterType; freq: number; q?: number }[] = [
  { type: 'lowpass', freq: 250 },
  { type: 'bandpass', freq: 1100, q: 0.6 },
  { type: 'highpass', freq: 4200 },
];
// Low band most prominent → high band faintest, so the three traces read apart.
const BAND_ALPHA = [0.62, 0.42, 0.26];

export function WaveformVisualization({
  source = null,
  mode = 'smooth',
  bands = false,
  fftSize = 2048,
  width = 256,
  height = 140,
}: WaveformVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mode only changes how we draw, not the audio graph — keep it in a ref so the
  // render loop reads the latest value without tearing down the analysers.
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3);
    const W = (canvas.width = Math.round(width * dpr));
    const H = (canvas.height = Math.round(height * dpr));
    const cy = H / 2;
    const amp = H * 0.4; // trace fills the middle 80%

    // Tap the source with our own analyser(s). Nothing reaches the destination.
    const audioCtx = (source?.context ?? null) as AudioContext | null;
    const created: AudioNode[] = [];
    let analysers: AnalyserNode[] = [];
    // Float32Array<ArrayBuffer> (not ArrayBufferLike) — what getFloatTimeDomainData expects.
    let buffers: Float32Array<ArrayBuffer>[] = [];

    if (source && audioCtx) {
      if (bands) {
        analysers = BANDS.map(({ type, freq, q }) => {
          const filter = audioCtx.createBiquadFilter();
          filter.type = type;
          filter.frequency.value = freq;
          if (q != null) filter.Q.value = q;
          const a = audioCtx.createAnalyser();
          a.fftSize = fftSize;
          source.connect(filter);
          filter.connect(a);
          created.push(filter, a);
          return a;
        });
      } else {
        const a = audioCtx.createAnalyser();
        a.fftSize = fftSize;
        source.connect(a);
        created.push(a);
        analysers = [a];
      }
      buffers = analysers.map((a) => new Float32Array(a.fftSize));
    }

    const stroke = (base: string, alpha: number, lw: number, x1: number, y1: number, x2: number, y2: number) => {
      ctx.strokeStyle = base;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const drawSmooth = (buf: Float32Array, base: string, alpha: number) => {
      ctx.strokeStyle = base;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2 * dpr;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const n = buf.length;
      for (let x = 0; x <= W; x++) {
        const idx = Math.min(n - 1, Math.floor((x / W) * (n - 1)));
        const y = cy - buf[idx] * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const drawPixelated = (buf: Float32Array, base: string, alpha: number) => {
      ctx.fillStyle = base;
      ctx.globalAlpha = alpha;
      const n = buf.length;
      const step = n / W;
      for (let x = 0; x < W; x++) {
        const s = Math.floor(x * step);
        const e = Math.max(s + 1, Math.floor((x + 1) * step));
        let mn = 1;
        let mx = -1;
        for (let i = s; i < e && i < n; i++) {
          const v = buf[i];
          if (v < mn) mn = v;
          if (v > mx) mx = v;
        }
        const yTop = Math.round(cy - mx * amp);
        const yBot = Math.round(cy - mn * amp);
        ctx.fillRect(x, yTop, 1, Math.max(1, yBot - yTop));
      }
    };

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      // Read the trace color from CSS each frame so it tracks light/dark theme.
      const base = getComputedStyle(canvas).color || 'rgb(255,255,255)';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = modeRef.current === 'smooth';

      // Reference grid: faint vertical quarters + a center baseline.
      for (let i = 1; i < 4; i++) {
        const gx = Math.round((W / 4) * i) + 0.5;
        stroke(base, 0.06, dpr, gx, 0, gx, H);
      }
      stroke(base, 0.15, dpr, 0, Math.round(cy) + 0.5, W, Math.round(cy) + 0.5);

      const draw = modeRef.current === 'pixelated' ? drawPixelated : drawSmooth;
      for (let i = 0; i < analysers.length; i++) {
        analysers[i].getFloatTimeDomainData(buffers[i]);
        draw(buffers[i], base, analysers.length === 3 ? BAND_ALPHA[i] : 0.6);
      }
      ctx.globalAlpha = 1;
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      created.forEach((node) => {
        // A node may already be disconnected if the context was closed.
        try {
          node.disconnect();
        } catch {
          /* noop */
        }
      });
    };
  }, [source, bands, fftSize, width, height]);

  return <canvas ref={canvasRef} className="dialkit-waveform-viz" style={{ width, height }} />;
}
