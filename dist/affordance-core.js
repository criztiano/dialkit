// src/affordance-core.ts
var AFFORDANCE_POPOVER_WIDTH = 200;
var GAP = 6;
var EDGE = 8;
function placePopover(anchor, popoverHeight, viewportHeight, width = AFFORDANCE_POPOVER_WIDTH) {
  const below = anchor.bottom + GAP;
  const overflowsBelow = popoverHeight > 0 && below + popoverHeight > viewportHeight - EDGE;
  const above = anchor.top - GAP - popoverHeight;
  return {
    // Only flip when there is actually more room above, or a short viewport
    // would trade one clipped edge for the other.
    top: overflowsBelow && above >= EDGE ? above : below,
    left: Math.max(EDGE, anchor.right - width)
  };
}
export {
  AFFORDANCE_POPOVER_WIDTH,
  placePopover
};
//# sourceMappingURL=affordance-core.js.map