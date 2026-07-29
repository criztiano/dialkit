/** Popover width, and the width its right edge aligns to the dot at. */
export const AFFORDANCE_POPOVER_WIDTH = 200;

/** Gap between the dot and the popover, and the minimum inset from the viewport. */
const GAP = 6;
const EDGE = 8;

export type PopoverAnchor = { top: number; bottom: number; right: number };
export type PopoverPlacement = { top: number; left: number };

/**
 * Where an affordance popover sits: right-aligned to its dot and directly below
 * it, flipping above when it would otherwise run off the bottom.
 *
 * Pure and viewport-relative so it can be unit-tested without a DOM, and so all
 * four framework adapters place the popover identically. `popoverHeight` is 0
 * before the popover has mounted; that first pass simply renders below and the
 * caller re-runs once the real height is known.
 */
export function placePopover(
  anchor: PopoverAnchor,
  popoverHeight: number,
  viewportHeight: number,
  width: number = AFFORDANCE_POPOVER_WIDTH
): PopoverPlacement {
  const below = anchor.bottom + GAP;
  const overflowsBelow = popoverHeight > 0 && below + popoverHeight > viewportHeight - EDGE;
  const above = anchor.top - GAP - popoverHeight;

  return {
    // Only flip when there is actually more room above, or a short viewport
    // would trade one clipped edge for the other.
    top: overflowsBelow && above >= EDGE ? above : below,
    left: Math.max(EDGE, anchor.right - width),
  };
}
