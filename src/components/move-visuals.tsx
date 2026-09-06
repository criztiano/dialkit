import { LUCIDE_ICONS } from '../icons';
import type { MoveNumericDrawing, MovePlaybackMode } from '../move-visual-core';

/** A static value specimen; labels and precise readouts never inherit its effects. */
export function MoveSlotNumericBody({ label, value, drawing }: {
  label: string;
  value: string;
  drawing: MoveNumericDrawing;
}) {
  return (
    <>
      <span className="tweakers-move-dial-tag">{label}</span>
      <svg className="tweakers-move-visual" viewBox="0 0 100 60" aria-hidden="true">
        {drawing.kind === 'opacity' && (
          <>
            <circle className="tweakers-move-visual-guide" cx="40" cy="30" r="18" />
            <circle className="tweakers-move-visual-guide" cx="60" cy="30" r="18" />
            <circle className="tweakers-move-visual-solid" cx="60" cy="30" r="18" opacity={drawing.alpha} />
          </>
        )}
        {drawing.kind === 'blur' && (
          <circle className="tweakers-move-visual-solid" cx="50" cy="30" r="14"
            style={{ filter: `blur(${drawing.radius}px)` }} />
        )}
        {drawing.kind === 'pan' && (
          <>
            <path className="tweakers-move-visual-guide" d="M16 30H84M50 12V48" />
            <path className="tweakers-move-visual-line" d={`M50 30H${16 + drawing.position * 68}`} />
            <circle className="tweakers-move-visual-point"
              data-offset={Math.abs(drawing.position - 0.5) > 1e-9 || undefined}
              cx={16 + drawing.position * 68} cy="30" r="5" />
            <text x="5" y="30" dominantBaseline="central">L</text><text x="95" y="30" dominantBaseline="central">R</text>
          </>
        )}
        {drawing.kind === 'stereo-width' && (
          <>
            <path className="tweakers-move-visual-guide" d="M50 13V47" />
            {drawing.unity !== null && (
              <g className="tweakers-move-visual-reference">
                <ellipse cx={50 - drawing.unity * 28} cy="30" rx="12" ry="17" />
                <ellipse cx={50 + drawing.unity * 28} cy="30" rx="12" ry="17" />
              </g>
            )}
            <g className="tweakers-move-visual-lobes">
              <ellipse cx={50 - drawing.separation * 28} cy="30" rx="12" ry="17" />
              <ellipse cx={50 + drawing.separation * 28} cy="30" rx="12" ry="17" />
            </g>
          </>
        )}
        {drawing.kind === 'pitch' && (
          <g>
            <path className="tweakers-move-visual-guide" d="M8 30H92M8 25V35M29 27V33M50 25V35M71 27V33M92 25V35" />
            {drawing.zero !== null && (
              <path className="tweakers-move-visual-reference" d={`M${8 + drawing.zero * 84} 12V48`} />
            )}
            <path className="tweakers-move-visual-line" d={`M${8 + (drawing.zero ?? 0) * 84} 30H${8 + drawing.position * 84}`} />
            <path className="tweakers-move-visual-pitch-marker"
              data-offset={drawing.zero === null || Math.abs(drawing.position - drawing.zero) > 1e-9 || undefined}
              d={`M${8 + drawing.position * 84} 22l-5 -7h10z`} />
          </g>
        )}
      </svg>
      <span className="tweakers-move-dial-option tweakers-move-visual-value">{value}</span>
    </>
  );
}

/** Reuse the bundled option icons for playback, mirroring forward for reverse. */
export function MoveSlotPlaybackDrawing({ mode }: { mode: MovePlaybackMode }) {
  const icon = mode === 'scissors' ? 'scissors' : mode === 'ping-pong' ? 'arrow-left-right' : 'arrow-right';
  return (
    <svg className="tweakers-move-dial-icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g transform={mode === 'reverse' ? 'translate(24 0) scale(-1 1)' : undefined}>
        {LUCIDE_ICONS[icon].map((d) => <path key={d} d={d} />)}
      </g>
    </svg>
  );
}
