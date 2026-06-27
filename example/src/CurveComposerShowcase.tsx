import { useState, useRef, useEffect, useMemo } from 'react';
import {
  CurveComposer,
  SegmentedControl,
  ColorControl,
  defaultComposition,
  splitSegment,
  removeSegment,
  addDriver,
  removeDriver,
  buildSamplers,
  readComposition,
} from 'dialkit';
import type { CurveSegment, CurveDriver, DriverDirection, CurveComposition } from 'dialkit';

const PERIOD = 2.4; // seconds for one transport loop

export function CurveComposerShowcase() {
  const [comp, setComp] = useState<CurveComposition>(() => defaultComposition());
  const [playing, setPlaying] = useState(true);
  const [selected, setSelected] = useState(0);
  const [curveColor, setCurveColor] = useState('#ffffff');
  const [playheadColor, setPlayheadColor] = useState('#6366f1');

  const { segments, driver, direction } = comp;

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

  // Read the composed value each frame to drive the demo dot — uses the same core
  // pipeline the component renders with, so the dot and the curve always agree.
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CurveComposer
        segments={segments}
        driver={driver}
        direction={direction}
        onSegmentsChange={onSegments}
        onDriverChange={onDriver}
        getPhase={getPhase}
        curveColor={curveColor === '#ffffff' ? undefined : curveColor}
        playheadColor={playheadColor}
        grid
        width={260}
        height={150}
      />

      <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)' }}>
        {segments.length} segment{segments.length > 1 ? 's' : ''} · click a curve to change its shape · drag its
        middle for curvature · drag a divider to retime · double-click to split
      </div>

      {/* demo track driven by the composed value */}
      <div style={{ position: 'relative', height: 22, background: 'var(--dial-surface)', borderRadius: 8 }}>
        <div
          ref={demoRef}
          style={{
            position: 'absolute',
            top: 3,
            left: 6,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: playheadColor,
            willChange: 'transform',
          }}
        />
      </div>

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

      <ColorControl label="curve color" value={curveColor} onChange={setCurveColor} />
      <ColorControl label="playhead" value={playheadColor} onChange={setPlayheadColor} />
    </div>
  );
}
