import { useState, useRef, useEffect } from 'react';
import { WaveformVisualization } from 'dialkit';
import type { WaveformMode } from 'dialkit';

const DURATION = 3; // seconds

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
    return (elapsedRef.current % DURATION) / DURATION;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <WaveformVisualization buffer={buffer} getProgress={getProgress} mode={mode} bands={bands} border={border} />
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
      </div>
    </div>
  );
}
