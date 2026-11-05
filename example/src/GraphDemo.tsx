import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DialRoot, filterShapeResponse, useDialKit, type FilterShapeType } from 'dialkit';
import 'dialkit/styles.css';

// The graph family: xy, filter, transfer, curve, and analyser rows.
function Demo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // A second panel's functions close over these values, so its drawings follow them.
  const inputs = useDialKit('Graph inputs', {
    shape: { type: 'select', options: ['lowpass', 'highpass', 'bandpass', 'notch', 'peak'], default: 'lowpass' },
  }, { id: 'graph-inputs' });
  const values = useDialKit('Graphs', {
    tumble: { type: 'xy', x: { min: -180, max: 180, step: 1, bipolar: true, label: 'Yaw' }, y: { min: -90, max: 90, step: 1, bipolar: true, label: 'Pitch' } },
    flow: { type: 'xy', x: { min: 0, max: 1, label: 'Amount' }, y: { min: 0, max: 3, label: 'Speed' }, default: { x: 0.4, y: 1 } },
    tone: {
      type: 'filter',
      cutoff: { min: 20, max: 20000, step: 1, unit: ' Hz', default: 2000 },
      resonance: { min: 0, max: 1, step: 0.01 },
      response: (c: number, r: number) => filterShapeResponse(inputs.shape as FilterShapeType, c, r),
    },
    gamma: { type: 'transfer', default: { points: [{ x: 0, y: 0 }, { x: 0.4, y: 0.6 }, { x: 1, y: 1 }] }, axisLabels: { x: 'In', y: 'Out' } },
    _hints: { tone: 'Cutoff and resonance of the tone filter.', gamma: 'Click to add a point. Drag one out to remove it.' },
  }, { id: 'graph-demo' });
  return <main style={{ minHeight: '100vh', padding: 32, background: theme === 'dark' ? '#151515' : '#f4f3f1', color: theme === 'dark' ? '#ededed' : '#222', font: '13px system-ui' }}>
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Switch theme</button>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 48, marginTop: 24 }}>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(values, null, 2)}</pre>
      <aside><DialRoot mode="inline" theme={theme} /></aside>
    </div>
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Demo /></StrictMode>);
