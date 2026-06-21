import { useState, useRef, useEffect } from 'react';
import { WaveformVisualization, Slider, ColorControl } from 'dialkit';
import type { WaveformMode, WaveformLoop } from 'dialkit';

const DURATION = 3; // seconds
const PIXEL_SIZES = [1, 2, 4, 6]; // pixelated block-size multipliers

/**
 * Render a short sample offline: a low drone plus several enveloped "hits", so the
 * waveform has visible dynamics. OfflineAudioContext needs no user gesture.
 */
async function renderSample(): Promise<AudioBuffer> {
  const sr = 44100;
  const off = new OfflineAudioContext(1, Math.floor(sr * DURATION), sr);

  const drone = off.createOscillator();
  drone.type = 'sawtooth';
  drone.frequency.value = 55;
  const droneGain = off.createGain();
  droneGain.gain.value = 0.1;
  drone.connect(droneGain);
  droneGain.connect(off.destination);
  drone.start(0);
  drone.stop(DURATION);

  const freqs = [110, 220, 90, 330, 160, 70];
  freqs.forEach((f, i) => {
    const t = 0.15 + (i * (DURATION - 0.3)) / freqs.length;
    const o = off.createOscillator();
    o.type = i % 2 ? 'square' : 'sine';
    o.frequency.value = f;
    const g = off.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.9, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.35);
    o.connect(g);
    g.connect(off.destination);
    o.start(t);
    o.stop(t + 0.4);
  });

  return off.startRendering();
}

export function WaveformShowcase() {
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<WaveformMode>('smooth');
  const [bands, setBands] = useState(false);
  const [border, setBorder] = useState(false);
  const [grid, setGrid] = useState(false);
  const [pixelIdx, setPixelIdx] = useState(0);
  const [loop, setLoop] = useState<WaveformLoop | null>(null);
  const [waveColor, setWaveColor] = useState('#ffffff');
  const [playheadColor, setPlayheadColor] = useState('#6366f1');
  const [autoZoom, setAutoZoom] = useState(false);

  // Virtual transport: a clock-driven playhead (no audio output needed to demo it).
  const elapsedRef = useRef(0);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    renderSample().then(setBuffer).catch(() => {});
  }, []);

  const getProgress = () => {
    const now = performance.now();
    if (playing) {
      if (lastRef.current != null) elapsedRef.current += (now - lastRef.current) / 1000;
      lastRef.current = now;
    } else {
      lastRef.current = null;
    }
    // Inside a loop, wrap the transport within its bounds.
    if (loop) {
      const a = loop.start * DURATION;
      const span = Math.max(0.001, (loop.end - loop.start) * DURATION);
      const t = a + (((elapsedRef.current - a) % span) + span) % span;
      elapsedRef.current = t;
      return t / DURATION;
    }
    return (elapsedRef.current % DURATION) / DURATION;
  };

  // Click reports a new play position; drag reports a loop (jump the transport to its start).
  const handleSeek = (p: number) => {
    elapsedRef.current = p * DURATION;
  };
  const handleLoopChange = (l: WaveformLoop | null) => {
    setLoop(l);
    // Keep the transport inside the loop (created or resized) without yanking it to the start.
    if (l) {
      const a = l.start * DURATION;
      const b = l.end * DURATION;
      elapsedRef.current = Math.min(Math.max(elapsedRef.current, a), b);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <WaveformVisualization
        buffer={buffer}
        getProgress={getProgress}
        mode={mode}
        bands={bands}
        border={border}
        grid={grid}
        gridSubdivisions={16}
        pixelSize={PIXEL_SIZES[pixelIdx]}
        loop={loop}
        onSeek={handleSeek}
        onLoopChange={handleLoopChange}
        waveColor={waveColor}
        playheadColor={playheadColor}
        autoZoomOnLoop={autoZoom}
      />
      <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)' }}>
        {loop
          ? `loop ${Math.round(loop.start * 100)}–${Math.round(loop.end * 100)}% · drag edges to resize · click clears`
          : 'click to set playhead · drag to loop'}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="lib-tab" data-active={String(playing)} onClick={() => setPlaying((p) => !p)}>
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <div className="lib-tabs">
          {(['smooth', 'pixelated'] as const).map((m) => (
            <button key={m} type="button" className="lib-tab" data-active={String(mode === m)} onClick={() => setMode(m)}>
              {m}
            </button>
          ))}
        </div>
        <button type="button" className="lib-tab" data-active={String(bands)} onClick={() => setBands((b) => !b)}>
          EQ bands: {bands ? 'on' : 'off'}
        </button>
        <button type="button" className="lib-tab" data-active={String(border)} onClick={() => setBorder((b) => !b)}>
          border: {border ? 'on' : 'off'}
        </button>
        <button type="button" className="lib-tab" data-active={String(grid)} onClick={() => setGrid((g) => !g)}>
          grid: {grid ? 'on' : 'off'}
        </button>
        <button type="button" className="lib-tab" data-active={String(autoZoom)} onClick={() => setAutoZoom((a) => !a)}>
          auto-zoom: {autoZoom ? 'on' : 'off'}
        </button>
      </div>
      <Slider
        label="pixel res"
        value={pixelIdx}
        min={0}
        max={3}
        step={1}
        formatValue={(v) => (PIXEL_SIZES[v] === 1 ? 'default' : `${PIXEL_SIZES[v]}×`)}
        onChange={setPixelIdx}
      />
      <ColorControl label="wave color" value={waveColor} onChange={setWaveColor} />
      <ColorControl label="playhead" value={playheadColor} onChange={setPlayheadColor} />
    </div>
  );
}
