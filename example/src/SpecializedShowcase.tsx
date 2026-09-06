import { Link } from 'react-router-dom';
import { MovePanel, TweakRoot, TweakStore, useTweakers } from 'tweakers';
import type { TweakConfig } from 'tweakers';

const PANEL = 'Specialized';
const CONFIG = {
  opacity: { type: 'slider', default: 0.65, min: 0, max: 1, step: 0.01, moveVisual: { kind: 'opacity' } },
  blur: { type: 'slider', default: 3, min: 0, max: 12, step: 0.1, unit: ' px', moveVisual: { kind: 'blur' } },
  pan: { type: 'slider', default: 0, min: -1, max: 1, step: 0.01, bipolar: true, moveVisual: { kind: 'pan' } },
  width: { type: 'slider', default: 1, min: 0, max: 2, step: 0.01, origin: 1, unit: '×', moveVisual: { kind: 'stereo-width' } },
  pitch: { type: 'slider', default: 0, min: -24, max: 24, step: 1, bipolar: true, unit: ' st', moveVisual: { kind: 'pitch' } },
  playback: {
    type: 'select', default: 'forward',
    options: [
      { value: 'forward', label: 'Forward' },
      { value: 'reverse', label: 'Reverse' },
      { value: 'ping-pong', label: 'Ping-pong' },
      { value: 'scissors', label: 'Scissors' },
    ],
    moveVisual: { kind: 'playback' },
  },
} satisfies TweakConfig;

const STATES = [
  { label: 'Minimum', values: { opacity: 0, blur: 0, pan: -1, width: 0, pitch: -24, playback: 'forward' } },
  { label: 'Neutral', values: { opacity: 1, blur: 0, pan: 0, width: 1, pitch: 0, playback: 'forward' } },
  { label: 'Maximum', values: { opacity: 1, blur: 12, pan: 1, width: 2, pitch: 24, playback: 'scissors' } },
];

export function SpecializedShowcase() {
  const values = useTweakers(PANEL, CONFIG, { presets: false });
  const apply = (next: typeof STATES[number]['values']) => {
    const panel = TweakStore.getPanels().find((item) => item.name === PANEL);
    if (!panel) return;
    for (const [path, value] of Object.entries(next)) TweakStore.updateValue(panel.id, path, value);
  };
  return (
    <main className="tweakers-root specialized-page" data-theme="dark">
      <style>{CSS}</style>
      <header className="specialized-header">
        <Link className="specialized-back" to="/library">← Component library</Link>
        <h1>Specialized controls</h1>
        <p>Opacity, blur, pan, width, pitch and playback. Each drawing follows the value, with its label and reading always visible.</p>
      </header>
      <section aria-label="Live controls" className="specialized-live">
        <div className="specialized-presets" role="group" aria-label="Compare reference values">
          {STATES.map((state) => (
            <button key={state.label} type="button"
              aria-pressed={Object.entries(state.values).every(([path, value]) => values[path as keyof typeof values] === value)}
              onClick={() => apply(state.values)}>{state.label}</button>
          ))}
        </div>
        <div className="specialized-surface-scroll"><MovePanel panels={PANEL} dock="flow" theme="dark" productionEnabled /></div>
        <p className="specialized-help">Drag across a slot. Shift-drag for precision. Focus a slot and use arrow keys; Home and End reach its limits.</p>
      </section>
      <div className="specialized-details">
        <section aria-labelledby="specialized-edit-title">
          <h2 id="specialized-edit-title">Exact values</h2>
          <p>Click a number to type a value. Both surfaces stay in sync.</p>
          <TweakRoot panels={PANEL} mode="inline" theme="dark" productionEnabled />
        </section>
        <section aria-labelledby="specialized-reading-title">
          <h2 id="specialized-reading-title">Reading the shapes</h2>
          <dl>
            <dt>Opacity & blur</dt><dd>Overlapping circles reveal transparency. A single filled dot softens at the selected blur radius.</dd>
            <dt>Pan & width</dt><dd>Pan moves between L and R. Width separates two channels from mono, with dashed outlines marking 1×.</dd>
            <dt>Pitch & playback</dt><dd>Pitch moves along a centred ruler; its marker turns amber away from zero. Icons show the selected playback mode.</dd>
          </dl>
          <p className="specialized-help">These are static parameter diagrams. No audio is generated.</p>
        </section>
      </div>
    </main>
  );
}

const CSS = `
.specialized-page {
  --specialized-bg: #161616;
  --specialized-surface-width: 760px;
  --specialized-space-sm: 8px;
  --specialized-space: 16px;
  --specialized-space-lg: 32px;
  --specialized-space-xl: 48px;
  --specialized-page-width: 1120px;
  --specialized-text-width: 620px;
  --specialized-font-body: 14px;
  --specialized-font-title: clamp(28px, 4vw, 40px);
  --specialized-font-section: 18px;
  --specialized-button-height: 36px;
  --specialized-focus: 2px;
  min-height: 100vh;
  padding: var(--specialized-space-xl) var(--specialized-space-lg);
  background: var(--specialized-bg);
  color: var(--tweak-text-primary);
  font-family: var(--tweak-font-label);
  font-size: var(--specialized-font-body);
  line-height: 1.6;
}
.specialized-page *, .specialized-page *::before, .specialized-page *::after { box-sizing: border-box; }
.specialized-header, .specialized-live, .specialized-details { max-width: var(--specialized-page-width); margin-inline: auto; }
.specialized-header { margin-bottom: var(--specialized-space-lg); }
.specialized-back { color: var(--tweak-text-secondary); text-decoration: none; }
.specialized-back:hover { color: var(--tweak-text-primary); }
.specialized-page h1 { font-family: var(--tweak-font-value); font-size: var(--specialized-font-title); font-weight: 400; line-height: 1.2; margin: var(--specialized-space-lg) 0 var(--specialized-space); }
.specialized-page h2 { font-size: var(--specialized-font-section); font-weight: 500; margin: 0 0 var(--specialized-space-sm); }
.specialized-page p { max-width: var(--specialized-text-width); margin: 0 0 var(--specialized-space); color: var(--tweak-text-secondary); }
.specialized-presets { display: flex; gap: var(--specialized-space-sm); margin-bottom: var(--specialized-space); }
.specialized-presets button { min-height: var(--specialized-button-height); padding: 0 var(--specialized-space); color: var(--tweak-text-primary); font: inherit; background: var(--tweak-surface); border: 1px solid var(--tweak-border); border-radius: var(--tweak-radius); cursor: pointer; }
.specialized-presets button:hover { background: var(--tweak-surface-hover); }
.specialized-presets button[aria-pressed="true"] { box-shadow: inset 0 0 0 1px currentColor; }
.specialized-page button:focus-visible, .specialized-page a:focus-visible { outline: var(--specialized-focus) solid currentColor; outline-offset: var(--specialized-focus); }
.specialized-live { margin-bottom: var(--specialized-space-xl); }
.specialized-surface-scroll { overflow-x: auto; }
.specialized-live .tweakers-move { min-width: var(--specialized-surface-width); border-radius: var(--move-radius); padding-inline: var(--specialized-space); }
.specialized-help { margin-top: var(--specialized-space) !important; }
.specialized-details { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--specialized-space-xl); }
.specialized-details > section { min-width: 0; }
.specialized-details dl { margin: 0; }
.specialized-details dt { font-weight: 500; margin-top: var(--specialized-space); }
.specialized-details dd { margin: var(--specialized-space-sm) 0 var(--specialized-space); color: var(--tweak-text-secondary); }
@media (max-width: 700px) {
  .specialized-page { padding: var(--specialized-space-lg) var(--specialized-space); }
  .specialized-details { grid-template-columns: minmax(0, 1fr); gap: var(--specialized-space-lg); }
  .specialized-live .tweakers-move { padding-inline: var(--specialized-space-sm); }
}
`;
