import { useState, useRef, useEffect, useMemo } from 'react';
import {
  CurveComposer,
  Toggle,
  SegmentedControl,
  ColorControl,
  Slider,
  defaultComposition,
  splitSegment,
  removeSegment,
  flipSegment,
  setSegmentOvershoot,
  setSegmentAnticipate,
  addDriver,
  removeDriver,
  buildSamplers,
  readComposition,
  triggerLevels,
  springify,
} from 'tweakers';
import type { CurveSegment, CurveDriver, DriverDirection, CurveComposition } from 'tweakers';

const SPRING_SCALE_MIN = -0.2;
const SPRING_SCALE_MAX = 1.5;
const OUTPUT_DOT_SIZE = 16;
const FOLLOWER_DEFAULTS = { stiffness: 100, damping: 5, mass: 1, normalize: true } as const;

function initialComposition(): CurveComposition {
  return { ...defaultComposition(), direction: 'mirror' };
}

function springScalePosition(value: number) {
  const clamped = Math.max(SPRING_SCALE_MIN, Math.min(SPRING_SCALE_MAX, value));
  return (clamped - SPRING_SCALE_MIN) / (SPRING_SCALE_MAX - SPRING_SCALE_MIN);
}

function positionOutputIndicator(indicator: HTMLDivElement | null, value: number, trackWidth: number) {
  if (!indicator || trackWidth <= 0) return;
  const x = springScalePosition(value) * trackWidth - OUTPUT_DOT_SIZE / 2;
  indicator.style.transform = `translateX(${x}px)`;
}

function positionElasticBand(band: HTMLDivElement | null, target: number, follower: number, trackWidth: number) {
  if (!band || trackWidth <= 0) return;
  const targetX = springScalePosition(target) * trackWidth;
  const followerX = springScalePosition(follower) * trackWidth;
  const start = Math.min(targetX, followerX);
  const length = Math.max(1, Math.abs(targetX - followerX));
  band.style.transform = `translateX(${start}px) scaleX(${length})`;
}

export function CurveComposerShowcase() {
  const [comp, setComp] = useState<CurveComposition>(initialComposition);
  const [playing, setPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
  const [selected, setSelected] = useState(0);
  const [duration, setDuration] = useState(2.4); // seconds for one transport loop
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const [curveColor, setCurveColor] = useState('#ffffff');
  const [playheadColor, setPlayheadColor] = useState('#6366f1');
  const [mode, setMode] = useState<'continuous' | 'trigger'>('continuous');
  const [triggerSteps, setTriggerSteps] = useState(5);
  const [normalize, setNormalize] = useState<boolean>(FOLLOWER_DEFAULTS.normalize);
  const [springStiffness, setSpringStiffness] = useState<number>(FOLLOWER_DEFAULTS.stiffness);
  const [springDamping, setSpringDamping] = useState<number>(FOLLOWER_DEFAULTS.damping);
  const [springMass, setSpringMass] = useState<number>(FOLLOWER_DEFAULTS.mass);

  const { segments, driver, direction } = comp;
  const gap = comp.gap ?? 0;

  // The shared extended domain leaves room to see the follower escape 0..1 when
  // normalization is off. Trigger markers belong to the designed target signal.
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blinkTimers = useRef<number[]>([]);
  const handleTrigger = (index: number) => {
    const marker = markerRefs.current[index];
    if (!marker) return;
    marker.style.background = playheadColor;
    marker.style.transform = 'translate(-50%, -50%) scale(1.9)';
    window.clearTimeout(blinkTimers.current[index]);
    blinkTimers.current[index] = window.setTimeout(() => {
      marker.style.background = 'var(--tweak-text-tertiary)';
      marker.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 130);
  };
  // Clear any pending blink timers on unmount so they can't write into a detached node.
  useEffect(() => {
    const timers = blinkTimers.current;
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  // Virtual transport: accumulate the phase 0..1 directly at rate 1/duration, so changing
  // duration changes the loop's velocity rather than jumping/resetting the playhead.
  const phaseRef = useRef(0);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const update = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    setReduceMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!playing || reduceMotion) return;

    let raf = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (last != null) {
        phaseRef.current = (phaseRef.current + (now - last) / 1000 / durationRef.current) % 1;
      }
      last = now;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduceMotion]);

  const getPhase = () => phaseRef.current;

  // Read the composed value each frame to drive the demo dot — each segment drives a
  // full min→max walk, so the dot walks the track once per segment (twice for two).
  const samplers = useMemo(() => buildSamplers(comp), [comp]);
  const composedSampler = useMemo(() => (phase: number) => readComposition(comp, phase, samplers).value, [comp, samplers]);
  const springSampler = useMemo(
    () => springify(composedSampler, {
      stiffness: springStiffness,
      damping: springDamping,
      mass: springMass,
      normalize,
      loop: true,
    }),
    [composedSampler, normalize, springDamping, springMass, springStiffness]
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bandRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLOutputElement | null)[]>([]);
  const trackWidthRef = useRef(0);
  const outputValuesRef = useRef([0, 0]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      trackWidthRef.current = width;
      positionOutputIndicator(indicatorRefs.current[0], outputValuesRef.current[0], width);
      positionOutputIndicator(indicatorRefs.current[1], outputValuesRef.current[1], width);
      positionElasticBand(bandRef.current, outputValuesRef.current[0], outputValuesRef.current[1], width);
    });
    const track = trackRef.current;
    if (!track) return;
    trackWidthRef.current = track.clientWidth;
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const renderOutput = () => {
      const phase = getPhase();
      const values = [composedSampler(phase), springSampler(phase)];
      outputValuesRef.current = values;
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        positionOutputIndicator(indicatorRefs.current[i], value, trackWidthRef.current);
        if (valueRefs.current[i]) valueRefs.current[i]!.textContent = Number.isFinite(value) ? value.toFixed(4) : '—';
      }
      positionElasticBand(bandRef.current, values[0], values[1], trackWidthRef.current);
    };
    renderOutput();

    if (!playing || reduceMotion) return;
    const tick = () => {
      renderOutput();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [composedSampler, playing, reduceMotion, springSampler]);

  const onSegments = (next: CurveSegment[]) => setComp((c) => ({ ...c, segments: next }));
  const onDriver = (next: CurveDriver) => setComp((c) => ({ ...c, driver: next }));
  const setDirection = (d: DriverDirection) => setComp((c) => ({ ...c, direction: d }));

  const doSplit = () => {
    setComp((c) => splitSegment(c, Math.min(selected, c.segments.length - 1)));
  };
  const doRemove = () => {
    setComp((c) => removeSegment(c, Math.min(selected, c.segments.length - 1)));
    setSelected((s) => Math.max(0, s - 1));
  };
  const doFlip = () => {
    setComp((c) => flipSegment(c, Math.min(selected, c.segments.length - 1)));
  };
  const doReset = () => {
    setComp(initialComposition());
    setSelected(0);
    phaseRef.current = 0;
    setSpringStiffness(FOLLOWER_DEFAULTS.stiffness);
    setSpringDamping(FOLLOWER_DEFAULTS.damping);
    setSpringMass(FOLLOWER_DEFAULTS.mass);
    setNormalize(FOLLOWER_DEFAULTS.normalize);
  };
  const toggleDriver = () => setComp((c) => (c.driver ? removeDriver(c) : addDriver(c)));
  // Overshoot (end, easeOutBack) and anticipate (start, easeInBack) are independent per-segment
  // params; the demo applies each across all segments for a clear, visible sweep. Set both → easeInOutBack.
  const overshoot = segments[0]?.overshoot ?? 0;
  const anticipate = segments[0]?.anticipate ?? 0;
  const setOvershoot = (v: number) =>
    setComp((c) => c.segments.reduce((acc, _s, i) => setSegmentOvershoot(acc, i, v), c));
  const setAnticipate = (v: number) =>
    setComp((c) => c.segments.reduce((acc, _s, i) => setSegmentAnticipate(acc, i, v), c));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CurveComposer
        segments={segments}
        driver={driver}
        direction={direction}
        gap={gap}
        selectedIndex={selected}
        onSelect={setSelected}
        onSegmentsChange={onSegments}
        onDriverChange={onDriver}
        getPhase={getPhase}
        mode={mode}
        triggerSteps={triggerSteps}
        onTrigger={handleTrigger}
        curveColor={curveColor === '#ffffff' ? undefined : curveColor}
        playheadColor={playheadColor}
        grid
        width={260}
        height={150}
      />

      <div style={{ fontSize: 12, color: 'var(--tweak-text-secondary)' }}>
        {segments.length} segment{segments.length > 1 ? 's' : ''} · click a curve's header to select it (Split / Flip /
        Remove act on it) · click the body to change shape · drag — sideways for energy, up/down for steepness (→ expo) ·
        divider to retime · double-click to split
      </div>

      <div className="curve-output-comparison">
        <div className="curve-output-readouts">
          <div className="curve-output-readout">
            <span
              className="curve-output-key curve-output-key-target"
              style={{ background: curveColor === '#ffffff' ? 'var(--tweak-text-primary)' : curveColor }}
              aria-hidden="true"
            />
            <span className="curve-output-label">Designed target</span>
            <output
              ref={(el) => { valueRefs.current[0] = el; }}
              className="curve-output-value"
              aria-label="Designed target value"
            >
              0.0000
            </output>
          </div>
          <div className="curve-output-readout">
            <span className="curve-output-key curve-output-key-follower" style={{ background: playheadColor }} aria-hidden="true" />
            <span className="curve-output-label">Elastic follower</span>
            <output
              ref={(el) => { valueRefs.current[1] = el; }}
              className="curve-output-value"
              aria-label="Elastic follower value"
            >
              0.0000
            </output>
          </div>
        </div>
        <div ref={trackRef} className="curve-output-track">
          <span className="curve-output-bound" style={{ left: `${springScalePosition(0) * 100}%` }}>0</span>
          <span className="curve-output-bound" style={{ left: `${springScalePosition(1) * 100}%` }}>1</span>
          <div ref={bandRef} className="curve-output-band" aria-hidden="true" />
          <div
            ref={(el) => { indicatorRefs.current[0] = el; }}
            className="curve-output-indicator curve-output-target"
            style={{ background: curveColor === '#ffffff' ? 'var(--tweak-text-primary)' : curveColor }}
            aria-hidden="true"
          />
          <div
            ref={(el) => { indicatorRefs.current[1] = el; }}
            className="curve-output-indicator curve-output-follower"
            style={{ background: playheadColor }}
            aria-hidden="true"
          />
          {mode === 'trigger' && triggerLevels(triggerSteps).map((level, index) => (
            <div
              key={index}
              ref={(el) => { markerRefs.current[index] = el; }}
              className="curve-output-marker"
              style={{ left: `${springScalePosition(level) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <div className="curve-spring-toggle">
        <Toggle label="Normalize 0–1" checked={normalize} onChange={setNormalize} />
      </div>
      <div className="curve-spring-controls" role="group" aria-label="Elastic follower physics">
        <Slider
          label="stiffness"
          value={springStiffness}
          onChange={setSpringStiffness}
          min={10}
          max={400}
          step={5}
        />
        <Slider
          label="damping"
          value={springDamping}
          onChange={setSpringDamping}
          min={0}
          max={40}
          step={1}
        />
        <Slider
          label="mass"
          value={springMass}
          onChange={setSpringMass}
          min={0.1}
          max={5}
          step={0.1}
          formatValue={(value) => value.toFixed(1)}
        />
      </div>
      {mode === 'trigger' && (
        <div style={{ fontSize: 12, color: 'var(--tweak-text-secondary)' }}>
          {triggerSteps} triggers, evenly spaced along the signal · the dot crosses them unevenly when the curve isn't linear
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="lib-tab curve-pressable" data-active={String(playing)} onClick={() => setPlaying((p) => !p)}>
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button type="button" className="lib-tab curve-pressable" onClick={doSplit}>
          + Split
        </button>
        <button type="button" className="lib-tab curve-pressable" onClick={doFlip}>
          ⇄ Flip
        </button>
        <button type="button" className="lib-tab curve-pressable" onClick={doRemove} disabled={segments.length <= 1}>
          − Remove
        </button>
        <button type="button" className="lib-tab curve-pressable" onClick={doReset}>
          ⟲ Reset
        </button>
        <button type="button" className="lib-tab curve-pressable" data-active={String(!!driver)} onClick={toggleDriver}>
          driver: {driver ? 'on' : 'off'}
        </button>
      </div>

      <div className="tweakers-labeled-control">
        <span className="tweakers-labeled-control-label">Signal</span>
        <SegmentedControl
          options={[
            { value: 'continuous' as const, label: 'Continuous' },
            { value: 'trigger' as const, label: 'Trigger' },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>

      {mode === 'trigger' && (
        <div className="tweakers-labeled-control">
          <span className="tweakers-labeled-control-label">Triggers</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className="lib-tab curve-pressable" onClick={() => setTriggerSteps((s) => Math.max(2, s - 1))}>
              −
            </button>
            <span style={{ minWidth: 20, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{triggerSteps}</span>
            <button type="button" className="lib-tab curve-pressable" onClick={() => setTriggerSteps((s) => Math.min(16, s + 1))}>
              +
            </button>
          </div>
        </div>
      )}

      <div className="tweakers-labeled-control">
        <span className="tweakers-labeled-control-label">Direction</span>
        <SegmentedControl
          options={[
            { value: 'forward' as const, label: 'Forward' },
            { value: 'mirror' as const, label: 'Mirror' },
            { value: 'reverse' as const, label: 'Reverse' },
          ]}
          value={direction}
          onChange={setDirection}
        />
      </div>

      <Slider
        label="duration"
        value={duration}
        onChange={setDuration}
        min={0.4}
        max={6}
        step={0.1}
        formatValue={(v) => `${v.toFixed(1)}s`}
      />
      <Slider
        label="gap"
        value={gap}
        onChange={(v) => setComp((c) => ({ ...c, gap: v }))}
        min={0}
        max={0.6}
        step={0.01}
        formatValue={(v) => (v > 0.005 ? v.toFixed(2) : 'none')}
      />
      <Slider
        label="anticipate"
        value={anticipate}
        onChange={setAnticipate}
        min={0}
        max={1}
        step={0.01}
        formatValue={(v) => (v > 0.02 ? `easeInBack ${v.toFixed(2)}` : 'none')}
      />
      <Slider
        label="overshoot"
        value={overshoot}
        onChange={setOvershoot}
        min={0}
        max={1}
        step={0.01}
        formatValue={(v) => (v > 0.02 ? `easeOutBack ${v.toFixed(2)}` : 'none')}
      />

      <ColorControl label="curve color" value={curveColor} onChange={setCurveColor} />
      <ColorControl label="playhead" value={playheadColor} onChange={setPlayheadColor} />
    </div>
  );
}
