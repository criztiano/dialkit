import { useEffect, useRef } from 'react';
import { TweakStore } from '../store/TweakStore';
import { ModulationStore } from '../store/ModulationStore';
import {
  modColor,
  modRingArc,
  MOD_RING_RADIUS,
  MOD_RING_CIRCUMFERENCE,
  type ModulationAssignment,
} from '../modulation-core';

/**
 * The modulation ring: a control wired to a slot wears a small dial in the
 * slot's palette colour, and an arc running from the control's own value to
 * where the modulation is holding it right now. The arc dances at the
 * modulator's rate — the value the app reads, shown where it is edited,
 * while the control itself keeps the base the user set.
 *
 * One ring for every surface the kit draws a control on — the dock's rows and
 * the Move panel's slots — so "this one is wired" reads the same wherever you
 * meet it. `className` is what each surface uses to place it.
 *
 * Drawn straight to the arc's dash attributes per frame, the MovePanel
 * circle's pattern, so the panel never re-renders for it. Under reduced
 * motion it holds still at the modulation's full reach instead, which says
 * the same thing about depth without the movement.
 */
export function ModRing({
  panelId,
  path,
  assignment,
  className,
}: {
  panelId: string;
  path: string;
  assignment: ModulationAssignment;
  className?: string;
}) {
  const arcRef = useRef<SVGCircleElement>(null);
  const color = modColor(assignment.slot);

  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;

    // Anchored on the base and the live value, both as fractions of the
    // control's span — the arc is the gap between them.
    const draw = (from: number, to: number) => {
      const { length, offset } = modRingArc(from, to);
      el.setAttribute('stroke-dasharray', `${length.toFixed(2)} ${MOD_RING_CIRCUMFERENCE.toFixed(2)}`);
      el.setAttribute('stroke-dashoffset', offset.toFixed(2));
    };

    const bounds = ModulationStore.getBounds(panelId, path);
    const span = bounds ? bounds.max - bounds.min : 0;
    const base01 = () =>
      span ? (Number(TweakStore.getValue(panelId, path)) - bounds!.min) / span : 0;

    if (!span) return;

    const still =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (still) {
      // The reach: half the span each way at full amount, the same geometry
      // applyModulation sweeps through. It follows the base the user drags,
      // just not the signal.
      const reach = assignment.amount / 2;
      const drawReach = () => draw(base01() - reach, base01() + reach);
      drawReach();
      return TweakStore.subscribe(panelId, drawReach);
    }

    return ModulationStore.subscribeFrames(() => {
      const b = base01();
      draw(b, b + (ModulationStore.getOffset(panelId, path) / span));
    });
  }, [panelId, path, assignment.slot, assignment.amount]);

  return (
    <svg
      className={['tweakers-mod-ring', className].filter(Boolean).join(' ')}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <circle className="tweakers-mod-ring-track" cx="8" cy="8" r={MOD_RING_RADIUS} />
      <circle
        ref={arcRef}
        className="tweakers-mod-ring-arc"
        cx="8"
        cy="8"
        r={MOD_RING_RADIUS}
        stroke={color}
        strokeDasharray={`0 ${MOD_RING_CIRCUMFERENCE}`}
      />
    </svg>
  );
}
