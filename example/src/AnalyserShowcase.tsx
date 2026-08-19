import { useState, useRef, useEffect } from 'react';
import { AnalyserVisualization, Slider, ColorControl } from 'dialkit';
import type { AnalyserSource, AnalyserVariant, AnalyserMode, AnalyserScale } from 'dialkit';

const PIXEL_SIZES = [1, 2, 4, 6]; // pixelated block-size multipliers
const CHANNEL_NAMES = ['drone', 'blips'] as const;
const CHANNEL_GAINS = [0.3, 0.55]; // per-channel base levels

type Channel = { gain: GainNode; analyser: AnalyserNode };
type Rig = { ctx: AudioContext; channels: Channel[]; stop: () => void };

/**
 * Two live channels so mute/solo are meaningful: a filter-swept drone and a loop
 * of enveloped blips. Each routes source → channel gain → channel analyser →
 * master, so per-channel gain changes are visible on that channel's analyser.
 * Built lazily inside the Play click handler (a running AudioContext needs a
 * user gesture).
 */
function buildRig(): Rig {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);

  const makeChannel = (base: number): Channel => {
    const gain = ctx.createGain();
    gain.gain.value = base;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    gain.connect(analyser);
    analyser.connect(master);
    return { gain, analyser };
  };

  // drone: two detuned saws through a slowly swept lowpass
  const drone = makeChannel(CHANNEL_GAINS[0]);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1000;
  filter.Q.value = 6;
  filter.connect(drone.gain);
  const saws = [55, 55.6].map((f) => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.connect(filter);
    o.start();
    return o;
  });
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.13;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 800;
  lfo.connect(lfoDepth);
  lfoDepth.connect(filter.frequency);
  lfo.start();

  // blips: a rotating pattern of short enveloped hits (the waveform demo's recipe, live)
  const blips = makeChannel(CHANNEL_GAINS[1]);
  const freqs = [110, 220, 90, 330, 160, 70];
  let step = 0;
  const interval = window.setInterval(() => {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = step % 2 ? 'square' : 'sine';
    o.frequency.value = freqs[step % freqs.length];
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.9, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.35);
    o.connect(g);
    g.connect(blips.gain);
    o.start(t);
    o.stop(t + 0.4);
    step++;
  }, 420);

  return {
    ctx,
    channels: [drone, blips],
    stop: () => {
      window.clearInterval(interval);
      saws.forEach((o) => o.stop());
      lfo.stop();
      // close() rejects if the context is already closed — nothing left to clean up.
      ctx.close().catch(() => {});
    },
  };
}

export function AnalyserShowcase() {
  const [rig, setRig] = useState<Rig | null>(null);
  // Mirrors the rig for gesture-time reads: togglePlay decides against the ref
  // (not the render closure) so two rapid clicks can't build two rigs — an
  // orphaned rig would keep sounding with no way to stop it.
  const rigRef = useRef<Rig | null>(null);

  const [source, setSource] = useState<AnalyserSource>('frequency');
  const [variant, setVariant] = useState<AnalyserVariant>('area');
  const [mode, setMode] = useState<AnalyserMode>('smooth');
  const [scale, setScale] = useState<AnalyserScale>('log');
  const [grid, setGrid] = useState(false);
  const [pixelIdx, setPixelIdx] = useState(0);
  const [springOn, setSpringOn] = useState(false);
  const [stiffness, setStiffness] = useState(120);
  const [damping, setDamping] = useState(14);
  const [smoothing, setSmoothing] = useState(0.8);
  const [waveColor, setWaveColor] = useState('#22d3ee');
  const [fillColor, setFillColor] = useState('#22d3ee');
  const [muted, setMuted] = useState<boolean[]>([false, false]);
  const [soloed, setSoloed] = useState<boolean[]>([false, false]);

  // Stop the audio graph when the showcase unmounts.
  useEffect(() => () => rigRef.current?.stop(), []);

  // The host-owns-gain contract: mute/solo from the visualizer's buttons drive
  // the channel gains here — the component itself never touches audio.
  useEffect(() => {
    if (!rig) return;
    const anySolo = soloed.some(Boolean);
    rig.channels.forEach((ch, i) => {
      const silenced = muted[i] || (anySolo && !soloed[i]);
      ch.gain.gain.setTargetAtTime(silenced ? 0 : CHANNEL_GAINS[i], rig.ctx.currentTime, 0.02);
    });
  }, [rig, muted, soloed]);

  // Data-side smoothing (the analyser's own) — contrast it with the render-side spring.
  useEffect(() => {
    rig?.channels.forEach((ch) => {
      ch.analyser.smoothingTimeConstant = smoothing;
    });
  }, [rig, smoothing]);

  const togglePlay = () => {
    if (rigRef.current) {
      rigRef.current.stop();
      rigRef.current = null;
      setRig(null);
    } else {
      const next = buildRig();
      rigRef.current = next; // claim immediately — don't wait for the commit
      setRig(next);
    }
  };

  const setFlag = (setter: typeof setMuted, index: number) => (value: boolean) =>
    setter((prev) => prev.map((v, i) => (i === index ? value : v)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {CHANNEL_NAMES.map((name, i) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AnalyserVisualization
              analyser={rig?.channels[i].analyser ?? null}
              source={source}
              variant={variant}
              mode={mode}
              pixelSize={PIXEL_SIZES[pixelIdx]}
              scale={scale}
              spring={springOn ? { stiffness, damping } : false}
              grid={grid}
              gridSubdivisions={16}
              waveColor={waveColor}
              fillColor={fillColor}
              muted={muted[i]}
              onMuteChange={setFlag(setMuted, i)}
              soloed={soloed[i]}
              onSoloChange={setFlag(setSoloed, i)}
            />
            <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)' }}>{name}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="lib-tab" data-active={String(!!rig)} onClick={togglePlay}>
          {rig ? '■ Stop' : '▶ Play'}
        </button>
        <div className="lib-tabs">
          {(['frequency', 'waveform', 'ekg'] as const).map((s) => (
            <button key={s} type="button" className="lib-tab" data-active={String(source === s)} onClick={() => setSource(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="lib-tabs">
          {(['area', 'line'] as const).map((v) => (
            <button key={v} type="button" className="lib-tab" data-active={String(variant === v)} onClick={() => setVariant(v)}>
              {v}
            </button>
          ))}
        </div>
        <div className="lib-tabs">
          {(['smooth', 'pixelated'] as const).map((m) => (
            <button key={m} type="button" className="lib-tab" data-active={String(mode === m)} onClick={() => setMode(m)}>
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="lib-tab"
          data-active={String(scale === 'log')}
          disabled={source !== 'frequency'}
          onClick={() => setScale((s) => (s === 'log' ? 'linear' : 'log'))}
        >
          scale: {scale}
        </button>
        <button type="button" className="lib-tab" data-active={String(grid)} onClick={() => setGrid((g) => !g)}>
          grid: {grid ? 'on' : 'off'}
        </button>
        <button type="button" className="lib-tab" data-active={String(springOn)} onClick={() => setSpringOn((s) => !s)}>
          spring: {springOn ? 'on' : 'off'}
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
      {springOn && (
        <>
          <Slider label="stiffness" value={stiffness} min={20} max={600} step={5} onChange={setStiffness} />
          <Slider label="damping" value={damping} min={2} max={60} step={1} onChange={setDamping} />
        </>
      )}
      <Slider
        label="analyser smoothing"
        value={smoothing}
        min={0}
        max={0.95}
        step={0.05}
        onChange={setSmoothing}
      />
      <ColorControl label="wave color" value={waveColor} onChange={setWaveColor} />
      <ColorControl label="fill color" value={fillColor} onChange={setFillColor} />
    </div>
  );
}
