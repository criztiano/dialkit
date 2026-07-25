import { useDialTimeline, DialTimeline } from 'dialkit';
import type { UseDialTimelineOptions } from 'dialkit';

// Stable options identity (the hook keys effects off options), plus a stable
// `id` and `persist` so the timing edits and any loop region survive a reload.
// No `loop` option: the timeline loops the whole thing by default — drag the
// ruler to set a loop region, and the loop button clears it.
const TIMELINE_OPTIONS: UseDialTimelineOptions = { id: 'timeline-demo', persist: true };

// A small but representative timeline: an entrance clip (transform + fade with a
// spring), a looping float that adds a second row and keeps cycling, and a glow
// clip on an easing curve. Binding each clip's `current` to the card below means
// scrubbing or playing the dock visibly drives the UI.
export function TimelineShowcase() {
  const tl = useDialTimeline(
    'Timeline',
    {
      duration: 3,
      card: {
        at: 0,
        duration: 0.7,
        from: { y: 40, scale: 0.9, opacity: 0 },
        to: { y: 0, scale: 1, opacity: 1 },
        transition: { type: 'spring', bounce: 0.25 },
      },
      float: {
        at: 0.8,
        loop: true,
        from: { y: 0 },
        steps: [
          { duration: 0.9, to: { y: -10 } },
          { duration: 0.9, to: { y: 0 } },
        ],
      },
      glow: {
        at: 0.9,
        duration: 0.6,
        from: { opacity: 0 },
        to: { opacity: 0.55 },
        transition: { type: 'easing', duration: 0.6, ease: [0.4, 0, 0.2, 1] },
      },
    },
    TIMELINE_OPTIONS
  );

  const card = tl.card.current;
  const float = tl.float.current;
  const glow = tl.glow.current;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          position: 'relative',
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          background: 'var(--dial-surface-subtle, rgba(127,127,127,0.08))',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 150,
            height: 96,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            opacity: card.opacity,
            transform: `translateY(${card.y + float.y}px) scale(${card.scale})`,
          }}
        >
          Card
          {/* Glow overlay driven by the easing clip. */}
          <div
            style={{
              position: 'absolute',
              inset: -2,
              borderRadius: 14,
              pointerEvents: 'none',
              boxShadow: '0 0 32px 8px #8b5cf6',
              opacity: glow.opacity,
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="lib-tab" data-active={String(tl.playing)} onClick={() => (tl.playing ? tl.pause() : tl.play())}>
          {tl.playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button type="button" className="lib-tab" onClick={() => tl.replay()}>
          ↻ Replay
        </button>
        <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)' }}>
          {tl.time.toFixed(2)}s / {tl.duration.toFixed(2)}s
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--dial-text-secondary)' }}>
        Scrub or play the timeline dock below — every clip drives the card above. Open a clip to tune its values, timing, and curve.
      </div>

      <DialTimeline defaultVisible />
    </div>
  );
}
