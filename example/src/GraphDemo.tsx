import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';

// The graph family: xy, filter, transfer, curve, and analyser rows.
function Demo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const values = useDialKit('Graphs', {
    tumble: { type: 'xy', x: { min: -180, max: 180, step: 1, bipolar: true, label: 'Yaw' }, y: { min: -90, max: 90, step: 1, bipolar: true, label: 'Pitch' } },
    flow: { type: 'xy', x: { min: 0, max: 1, label: 'Amount' }, y: { min: 0, max: 3, label: 'Speed' }, default: { x: 0.4, y: 1 } },
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
