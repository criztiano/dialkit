import { useState } from 'react';
import { DialRoot, useDialKit } from 'dialkit';

// Range, number and angle dial side by side, on both themes.
export function NumericDemo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const p = useDialKit('Numeric', {
    band: { type: 'range', min: 0, max: 100, default: { min: 20, max: 70 }, step: 1 },
    fade: { type: 'range', min: 0, max: 1 },
    heading: { type: 'slider', display: 'dial', default: 45, min: 0, max: 360, step: 1 },
    tilt: { type: 'slider', display: 'dial', default: 0, min: -45, max: 45, step: 0.5, origin: 0 },
    trim: { type: 'number', default: -6, step: 0.5, unit: 'dB' },
    seed: { type: 'number', default: 42, min: 0, step: 1 },
    level: { type: 'slider', default: 0.5, min: 0, max: 1, formatValue: (v: number) => `${Math.round(v * 100)}%` },
    _hints: {
      band: 'Drag a handle for one end, inside the span for both.',
      trim: 'Drag anywhere on the row to scrub; click to type.',
      heading: 'Turn the dial like a compass.',
    },
  });
  const light = theme === 'light';
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: light ? '#f4f4f4' : '#111', color: light ? '#111' : '#eee', fontFamily: 'system-ui' }}>
      <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
        <div style={{ position: 'relative', width: 320, height: 24, borderRadius: 12, background: light ? '#ddd' : '#222' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${p.band.min}%`, width: `${p.band.max - p.band.min}%`, borderRadius: 12, background: '#7aa', opacity: 0.4 + p.fade.max * 0.6 }} />
        </div>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: '#7aa', opacity: p.level, transform: `rotate(${p.heading}deg) skewX(${p.tilt}deg)` }} />
        <code>trim {p.trim} dB · seed {p.seed} · band {p.band.min}–{p.band.max}</code>
        <button onClick={() => setTheme(light ? 'dark' : 'light')}>Switch theme</button>
      </div>
      <DialRoot position="top-right" theme={theme} />
    </main>
  );
}
