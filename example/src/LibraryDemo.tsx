import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CurveComposer,
  Module,
  ModuleFolder,
  SegmentedControl,
  Slider,
  addDriver,
  defaultComposition,
  flipSegmentX,
  flipSegmentY,
  removeDriver,
  removeSegment,
  splitSegment,
  type CurveComposition,
  type DriverDirection,
} from 'dialkit';
import 'dialkit/styles.css';
import './library.css';

const DIRECTIONS: { value: DriverDirection; label: string }[] = [
  { value: 'forward', label: 'Forward' },
  { value: 'mirror', label: 'Mirror' },
  { value: 'reverse', label: 'Reverse' },
];

// One loop every two seconds, read by the composer each frame.
function useLoopPhase(seconds: number) {
  const start = useRef(performance.now());
  return () => ((performance.now() - start.current) / 1000 / seconds) % 1;
}

function Demo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [comp, setComp] = useState<CurveComposition>(defaultComposition);
  const [selected, setSelected] = useState(0);
  const [air, setAir] = useState({ enabled: true, density: 0.2, aperture: 0.6 });
  const [tension, setTension] = useState({ enabled: false, stiffness: 0.5 });
  const [delay, setDelay] = useState(120);
  const getPhase = useLoopPhase(2);
  const at = Math.min(selected, comp.segments.length - 1);
  const edit = (next: CurveComposition) => setComp(next);

  useEffect(() => { document.body.dataset.theme = theme; }, [theme]);

  return <main className="lib-demo">
    <nav className="lib-demo-nav">
      <span>DialKit <span>/ Component library</span></span>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Switch theme</button>
    </nav>
    <div className="lib-demo-layout dialkit-root" data-theme={theme}>
      <section className="lib-demo-card">
        <h2>CurveComposer</h2>
        <CurveComposer
          segments={comp.segments}
          driver={comp.driver}
          direction={comp.direction}
          selectedIndex={at}
          onSelect={setSelected}
          onSegmentsChange={(segments) => edit({ ...comp, segments })}
          onDriverChange={(driver) => edit({ ...comp, driver })}
          getPhase={getPhase}
          grid
          width={320}
          height={140}
        />
        <div className="lib-demo-row">
          <SegmentedControl options={DIRECTIONS} value={comp.direction} onChange={(direction) => edit({ ...comp, direction })} label="Direction" />
        </div>
        <div className="lib-demo-buttons">
          <button onClick={() => edit(splitSegment(comp, at))}>Split</button>
          <button onClick={() => edit(removeSegment(comp, at))}>Remove</button>
          <button onClick={() => edit(flipSegmentX(comp, at))}>Flip X</button>
          <button onClick={() => edit(flipSegmentY(comp, at))}>Flip Y</button>
          <button onClick={() => edit(comp.driver ? removeDriver(comp) : addDriver(comp))}>{comp.driver ? 'Remove driver' : 'Add driver'}</button>
        </div>
        <p>Click a curve to change its type. Drag it to bend it. Drag a divider to resize. Double-click to split. Click the top strip of a segment to select it.</p>
      </section>
      <section className="lib-demo-card">
        <h2>Module</h2>
        <Module title="Air" enabled={air.enabled} onEnabledChange={(enabled) => setAir({ ...air, enabled })}>
          <Slider label="Density" value={air.density} min={-1} max={1} step={0.01} bipolar onChange={(density) => setAir({ ...air, density })} />
          <Slider label="Aperture" value={air.aperture} min={0} max={1} step={0.01} onChange={(aperture) => setAir({ ...air, aperture })} />
        </Module>
        <ModuleFolder title="Tension" enabled={tension.enabled} onEnabledChange={(enabled) => setTension({ ...tension, enabled })} hint="Click the title to fold the module while it is on.">
          <Slider label="Stiffness" value={tension.stiffness} min={0} max={1} step={0.01} onChange={(stiffness) => setTension({ ...tension, stiffness })} />
          <Slider label="Delay" value={delay} min={-200} max={1000} step={1} origin={0} formatValue={(v) => `${v.toFixed(0)} ms`} onChange={setDelay} />
        </ModuleFolder>
      </section>
    </div>
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Demo /></StrictMode>);
