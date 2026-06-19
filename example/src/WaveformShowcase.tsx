import { useState, useRef, useEffect } from 'react';
import { WaveformVisualization } from 'dialkit';
import type { WaveformMode } from 'dialkit';

/**
 * Synthesize a lively, evolving signal: two oscillators + filtered noise, with
 * LFOs nudging amplitude and pitch so the trace keeps moving. Never connected to
 * the destination, so it's silent — the visualizer just taps it.
 */
function createSynth(ctx: AudioContext): AudioNode {
  const out = ctx.createGain();
  out.gain.value = 0.9;

  const o1 = ctx.createOscillator();
  o1.type = 'sawtooth';
  o1.frequency.value = 110;
  const o2 = ctx.createOscillator();
  o2.type = 'square';
  o2.frequency.value = 165;
  o2.detune.value = 7;

  const len = Math.floor(ctx.sampleRate * 2);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.13;

  const amp = ctx.createOscillator();
  amp.frequency.value = 0.35;
  const ampGain = ctx.createGain();
  ampGain.gain.value = 0.35;
  amp.connect(ampGain);
  ampGain.connect(out.gain);

  const drift = ctx.createOscillator();
  drift.frequency.value = 0.13;
  const driftGain = ctx.createGain();
  driftGain.gain.value = 35;
  drift.connect(driftGain);
  driftGain.connect(o1.frequency);

  o1.connect(out);
  o2.connect(out);
  noise.connect(noiseGain);
  noiseGain.connect(out);

  o1.start();
  o2.start();
  noise.start();
  amp.start();
  drift.start();
  return out;
}

export function WaveformShowcase() {
  const [source, setSource] = useState<AudioNode | null>(null);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<WaveformMode>('smooth');
  const [bands, setBands] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const toggleRun = async () => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      setSource(createSynth(ctx));
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'running') {
      await ctx.suspend();
      setRunning(false);
    } else {
      await ctx.resume();
      setRunning(true);
    }
  };

  useEffect(() => () => { ctxRef.current?.close().catch(() => {}); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <WaveformVisualization source={source} mode={mode} bands={bands} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="lib-tab" data-active={String(running)} onClick={toggleRun}>
          {running ? '❚❚ Pause' : '▶ Play'}
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
      </div>
    </div>
  );
}
