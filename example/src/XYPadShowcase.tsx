import { useState } from 'react';
import { XYPad, SegmentedControl } from 'dialkit';
import type { XYValue } from 'dialkit';

type DemoId = 'hold' | 'bipolar' | 'joystick' | 'grid' | 'range' | 'disabled';

const DEMOS: { id: DemoId; label: string; blurb: string; code: string }[] = [
  { id: 'hold', label: 'Hold', blurb: 'The default: a point you place and it stays. Both axes 0..1. Drag, click to jump, or focus and arrow around.', code: "<XYPad label='position' value={v} onChange={set} />" },
  { id: 'bipolar', label: 'Bipolar', blurb: 'Centered axes (−1..1, bipolar). Fill and detent center on the origin — drag near the middle and it snaps; drag past to release.', code: "x={{ min: -1, max: 1, bipolar: true }}" },
  { id: 'joystick', label: 'Joystick', blurb: 'returnToCenter springs the thumb home on release — a virtual joystick. Keyboard nudges still set-and-hold.', code: 'returnToCenter' },
  { id: 'grid', label: 'Density', blurb: 'The grid is a 5×5 by default. density multiplies it — density={2} makes a denser 10×10. grid={false} hides it, or pass a number for a uniform count.', code: 'density={2}' },
  { id: 'range', label: 'Range', blurb: 'Custom per-axis ranges with snap on — X is −100..100, Y is 0..10 stepped. showValues prints the live value next to each axis label (which otherwise shows the name only).', code: "x={{ min: -100, max: 100, step: 1 }} snap showValues" },
  { id: 'disabled', label: 'Disabled', blurb: 'Dimmed and inert: no pointer, not focusable, aria-disabled. The value still renders.', code: 'disabled' },
];

export function XYPadShowcase() {
  const [demo, setDemo] = useState<DemoId>('hold');

  const [hold, setHold] = useState<XYValue>({ x: 0.35, y: 0.7 });
  const [bipolar, setBipolar] = useState<XYValue>({ x: 0, y: 0 });
  const [joystick, setJoystick] = useState<XYValue>({ x: 0, y: 0 });
  const [gridVal, setGridVal] = useState<XYValue>({ x: 0.5, y: 0.5 });
  const [range, setRange] = useState<XYValue>({ x: 0, y: 5 });
  const [disabled, setDisabled] = useState<XYValue>({ x: 0.25, y: 0.8 });

  const active = DEMOS.find((d) => d.id === demo) ?? DEMOS[0];

  const pad = (() => {
    switch (demo) {
      case 'hold':
        return <XYPad label="position" value={hold} onChange={setHold} />;
      case 'bipolar':
        return (
          <XYPad
            label="balance"
            value={bipolar}
            onChange={setBipolar}
            x={{ min: -1, max: 1, bipolar: true, label: 'pan' }}
            y={{ min: -1, max: 1, bipolar: true, label: 'tilt' }}
          />
        );
      case 'joystick':
        return (
          <XYPad
            label="joystick"
            value={joystick}
            onChange={setJoystick}
            x={{ min: -1, max: 1, bipolar: true }}
            y={{ min: -1, max: 1, bipolar: true }}
            returnToCenter
          />
        );
      case 'grid':
        return <XYPad label="cell" value={gridVal} onChange={setGridVal} density={2} />;
      case 'range':
        return (
          <XYPad
            label="offset"
            value={range}
            onChange={setRange}
            x={{ min: -100, max: 100, step: 1 }}
            y={{ min: 0, max: 10, step: 1 }}
            snap
            showValues
          />
        );
      case 'disabled':
        return <XYPad label="locked" value={disabled} onChange={setDisabled} disabled />;
    }
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="dialkit-labeled-control">
        <span className="dialkit-labeled-control-label">Example</span>
        <SegmentedControl
          options={DEMOS.map((d) => ({ value: d.id, label: d.label }))}
          value={demo}
          onChange={(v) => setDemo(v as DemoId)}
        />
      </div>

      {/* The pad fills the container width (fluid, no longer forced square). */}
      <div>{pad}</div>

      <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)', lineHeight: 1.5 }}>{active.blurb}</div>
      <code
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11.5,
          color: 'var(--dial-text-label)',
          background: 'var(--dial-surface)',
          border: '1px solid var(--dial-border)',
          borderRadius: 8,
          padding: '8px 10px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {active.code}
      </code>
    </div>
  );
}
