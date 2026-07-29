/** Popover width, and the width its right edge aligns to the dot at. */
declare const AFFORDANCE_POPOVER_WIDTH = 200;
type PopoverAnchor = {
    top: number;
    bottom: number;
    right: number;
};
type PopoverPlacement = {
    top: number;
    left: number;
};
/**
 * Where an affordance popover sits: right-aligned to its dot and directly below
 * it, flipping above when it would otherwise run off the bottom.
 *
 * Pure and viewport-relative so it can be unit-tested without a DOM, and so all
 * four framework adapters place the popover identically. `popoverHeight` is 0
 * before the popover has mounted; that first pass simply renders below and the
 * caller re-runs once the real height is known.
 */
declare function placePopover(anchor: PopoverAnchor, popoverHeight: number, viewportHeight: number, width?: number): PopoverPlacement;

export { AFFORDANCE_POPOVER_WIDTH, type PopoverAnchor, type PopoverPlacement, placePopover };
