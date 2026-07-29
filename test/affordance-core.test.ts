import { describe, it, expect } from 'vitest';
import { placePopover, AFFORDANCE_POPOVER_WIDTH } from '../src/affordance-core';

// An 8px dot near the right edge of a panel, 600px down a 900px viewport.
const dot = { top: 600, bottom: 608, right: 500 };

describe('affordance popover placement', () => {
  it('sits below the dot and right-aligns to it', () => {
    const { top, left } = placePopover(dot, 90, 900);

    expect(top).toBe(614);
    expect(left + AFFORDANCE_POPOVER_WIDTH).toBe(dot.right);
  });

  // Before the popover mounts its height is 0, so the first pass can't know
  // whether it fits; it must place below rather than guess.
  it('places below when the height is not yet known', () => {
    expect(placePopover({ top: 880, bottom: 888, right: 500 }, 0, 900).top).toBe(894);
  });

  it('flips above when it would run off the bottom', () => {
    const { top } = placePopover({ top: 840, bottom: 848, right: 500 }, 90, 900);

    // 840 - 6 gap - 90 height.
    expect(top).toBe(744);
  });

  // Flipping a tall popover in a short viewport would clip the top instead —
  // no better, and it hides the dot the user just clicked.
  it('stays below when there is no room above either', () => {
    const { top } = placePopover({ top: 40, bottom: 48, right: 500 }, 300, 320);

    expect(top).toBe(54);
  });

  it('keeps the popover inside the left edge on a narrow viewport', () => {
    expect(placePopover({ top: 100, bottom: 108, right: 120 }, 90, 900).left).toBe(8);
  });
});
