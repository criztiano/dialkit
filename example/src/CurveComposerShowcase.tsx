import { useState, useRef, useEffect, useMemo } from 'react';
import {
  CurveComposer,
  SegmentedControl,
  ColorControl,
  Slider,
  defaultComposition,
  splitSegment,
  removeSegment,
  setSegmentOvershoot,
  setSegmentAnticipate,
  addDriver,
  removeDriver,
  buildSamplers,
  readComposition,
  triggerLevels,
} from 'dialkit';
import type { CurveSegment, CurveDriver, DriverDirection, CurveComposition } from 'dialkit';

const PERIOD = 2.4; // seconds for one transport loop

export function CurveComposerShowcase() {
  const [comp, setComp] = useState<CurveComposition>(() => defaultComposition());
  const [playing, setPlaying] = useState(true);
  const [selected, setSelected] = useState(0);
  const [curveColor, setCurveColor] = useState('#ffffff');
  const [playheadColor, setPlayheadColor] = useState('#6366f1');
  const [mode, setMode] = useState<'continuous' | 'trigger'>('continuous');
  const [triggerSteps, setTriggerSteps] = useState(5);

  const { segments, driver, direction } = comp;

  // The continuous dot's travel along the demo track: left 6 + radius 8 = center start,
  // then value * TRACK_TRAVEL. Trigger markers sit at the same per-value positions, so the
  // dot visibly crosses them.
  const TRACK_TRAVEL = 220;
  const DOT_CENTER = 14;

  // Trigger mode: blink the crossed marker purple as the continuous dot passes over it.
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blinkTimers = useRef<number[]>([]);
  const handleTrigger = (index: number) => {
    const el = markerRefs.current[index];
    if (!el) return;
    el.style.background = playheadColor;
    el.style.transform = 'translate(-50%, -50%) scale(1.9)';
    window.clearTimeout(blinkTimers.current[index]);
    blinkTimers.current[index] = window.setTimeout(() => {
      el.style.background = 'var(--dial-text-tertiary)';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 130);
  };
  // Clear any pending blink timers on unmount so they can't write into a detached node.
  useEffect(() => {
    const timers = blinkTimers.current;
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  // Virtual transport: a clock-driven phase 0..1 (no parent re-render via getPhase).
  const elapsedRef = useRef(0);
  useEffect(() => {
    let raf = 0;
    let last: number | null = null;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!playing || reduce) {
        last = null;
        return;
      }
      if (last != null) elapsedRef.current += (now - last) / 1000;
      last = now;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const getPhase = () => (elapsedRef.current % PERIOD) / PERIOD;

  // Read the composed value each frame to drive the demo dot — each segment drives a
  // full min→max walk, so the dot walks the track once per segment (twice for two).
  const samplers = useMemo(() => buildSamplers(comp), [comp]);
  const demoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const { value } = readComposition(comp, getPhase(), samplers);
      if (demoRef.current) {
        const clamped = Math.max(-0.15, Math.min(1.15, value));
        demoRef.current.style.transform = `translateX(${clamped * 220}px)`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [comp, samplers]);

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
  const doReset = () => {
    setComp(defaultComposition());
    setSelected(0);
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

      <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)' }}>
        {segments.length} segment{segments.length > 1 ? 's' : ''} · click to change shape · drag the body — sideways
        for energy (onset ↔ fall), up/down for steepness (push it for expo) · divider to retime · double-click to split
      </div>

      {/* output track: the continuous dot travels along it (position = value). In trigger mode,
          evenly-spaced markers sit along the track and blink as the dot crosses each one. */}
      <div style={{ position: 'relative', height: 22, background: 'var(--dial-surface)', borderRadius: 8 }}>
        {/* moving continuous dot (behind), so the markers' flash always reads on top of it */}
        <div
          ref={demoRef}
          style={{
            position: 'absolute',
            top: 3,
            left: 6,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: mode === 'trigger' ? 'var(--dial-text-tertiary)' : playheadColor,
            willChange: 'transform',
          }}
        />
        {mode === 'trigger' &&
          triggerLevels(triggerSteps).map((lv, i) => (
            <div
              key={i}
              ref={(el) => {
                markerRefs.current[i] = el;
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: DOT_CENTER + lv * TRACK_TRAVEL,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--dial-text-tertiary)',
                transform: 'translate(-50%, -50%) scale(1)',
                transition: 'background 120ms ease, transform 120ms ease',
              }}
            />
          ))}
      </div>
      {mode === 'trigger' && (
        <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)' }}>
          {triggerSteps} triggers, evenly spaced along the signal · the dot crosses them unevenly when the curve isn't linear
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="lib-tab" data-active={String(playing)} onClick={() => setPlaying((p) => !p)}>
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button type="button" className="lib-tab" onClick={doSplit}>
          + Split
        </button>
        <button type="button" className="lib-tab" onClick={doRemove} disabled={segments.length <= 1}>
          − Remove
        </button>
        <button type="button" className="lib-tab" onClick={doReset}>
          ⟲ Reset
        </button>
        <button type="button" className="lib-tab" data-active={String(!!driver)} onClick={toggleDriver}>
          driver: {driver ? 'on' : 'off'}
        </button>
      </div>

      <div className="dialkit-labeled-control">
        <span className="dialkit-labeled-control-label">Signal</span>
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
        <div className="dialkit-labeled-control">
          <span className="dialkit-labeled-control-label">Triggers</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className="lib-tab" onClick={() => setTriggerSteps((s) => Math.max(2, s - 1))}>
              −
            </button>
            <span style={{ minWidth: 20, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{triggerSteps}</span>
            <button type="button" className="lib-tab" onClick={() => setTriggerSteps((s) => Math.min(16, s + 1))}>
              +
            </button>
          </div>
        </div>
      )}

      <div className="dialkit-labeled-control">
        <span className="dialkit-labeled-control-label">Direction</span>
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
