// Auto-generated from src/styles/theme.css — do not edit
export const themeCSS = `/* No webfont import: numeric readouts use Geist Mono when the host app ships
   it, and fall back to the system monospace stack offline. A render-blocking
   Google Fonts request has no place in a library stylesheet. */

/* Dialkit Theme - Dark glassmorphic design */
.dialkit-root {
  /* Surfaces */
  --dial-surface: rgba(255, 255, 255, 0.05);
  --dial-surface-hover: rgba(255, 255, 255, 0.1);
  --dial-surface-active: rgba(255, 255, 255, 0.11);
  --dial-surface-subtle: rgba(255, 255, 255, 0.06);

  /* Text hierarchy - 3 levels */
  --dial-text-root: #FFFFFF;   /* Root title */
  --dial-text-section: rgba(255, 255, 255, 0.7); /* Section titles + carets */
  --dial-text-label: rgba(255, 255, 255, 0.7);   /* Input labels */
  --dial-text-focus: #ffffff;

  /* Legacy aliases */
  --dial-text-primary: rgba(255, 255, 255, 0.95);
  --dial-text-secondary: rgba(255, 255, 255, 0.6);
  --dial-text-tertiary: rgba(255, 255, 255, 0.4);

  /* Borders */
  --dial-border: rgba(255, 255, 255, 0.1);
  --dial-border-hover: rgba(255, 255, 255, 0.15);

  /* Timeline clips are light by default; light themes add a dark tint so
     their shape stays distinct from the lane without replacing custom hues. */
  --dial-timeline-clip-overlay: transparent;

  /* Timeline loop region (drag on the ruler). */
  --dial-timeline-loop-bg: rgba(129, 140, 248, 0.20);
  --dial-timeline-loop-border: rgba(129, 140, 248, 0.75);

  /* Affordance dot — barely there at rest, accent once something is bound. */
  --dial-affordance-idle: rgba(255, 255, 255, 0.22);
  --dial-affordance-armed: #818cf8;
  --dial-affordance-active: #a5b4fc;

  /* Glassmorphic panel */
  --dial-glass-bg: #212121;
  --dial-dropdown-bg: #2a2a2a;
  --dial-backdrop-blur: 20px;
  --dial-radius: 8px;
  --dial-row-height: 36px;
  --dial-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  --dial-shadow-collapsed: 0 4px 16px rgba(0, 0, 0, 0.25);
  --dial-shadow-dropdown: 0 8px 24px rgba(0, 0, 0, 0.4);

  /* Audio meter */
  --dial-meter-cell-gap: 8px;
  --dial-meter-band-gap: 6px;
  --dial-meter-padding: 6px;
  --dial-meter-cell-height: 2px;
  --dial-meter-cell-radius: 2px;
  --dial-meter-cell-idle: rgba(255, 255, 255, 0.04);
  --dial-meter-cell-neutral: rgba(255, 255, 255, 0.6);
  --dial-meter-cell-peak: rgba(255, 255, 255, 0.96);
  --dial-meter-cell-clipped: #fb7185;
  --dial-meter-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 1px 2px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.16);

  /* Fonts */
  font-family: system-ui, -apple-system, 'SF Pro Display', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Audio level meter */
.dialkit-audio-meter {
  container: dialkit-audio-meter / inline-size;
  inline-size: 100%;
  min-inline-size: 0;
}

.dialkit-audio-meter__bands {
  display: grid;
  grid-template-columns: repeat(var(--dial-meter-band-count), minmax(0, 1fr));
  gap: var(--dial-meter-cell-gap);
  box-sizing: border-box;
  padding: var(--dial-meter-padding);
  overflow: hidden;
  background: var(--dial-surface, rgba(255, 255, 255, 0.05));
  border-radius: var(--dial-radius, 8px);
  box-shadow: var(--dial-meter-shadow);
}

.dialkit-audio-meter[data-mode="mono"] .dialkit-audio-meter__bands,
.dialkit-audio-meter[data-mode="stereo"] .dialkit-audio-meter__bands {
  grid-template-columns: repeat(var(--dial-meter-band-count), minmax(12px, 24px));
  justify-content: center;
}

.dialkit-audio-meter__band {
  display: grid;
  grid-template-rows: repeat(var(--dial-meter-cell-count), var(--dial-meter-cell-height));
  gap: var(--dial-meter-cell-gap);
  min-inline-size: 0;
}

.dialkit-audio-meter__cell {
  display: block;
  block-size: var(--dial-meter-cell-height);
  min-block-size: 0;
  border-radius: var(--dial-meter-cell-radius);
  background: var(--dial-meter-cell-idle);
}

.dialkit-audio-meter__cell[data-active] {
  background: var(--dial-meter-cell-color, var(--dial-meter-cell-neutral));
  opacity: 0.72;
}

.dialkit-audio-meter__cell[data-peak] {
  background: var(--dial-meter-cell-color, var(--dial-meter-cell-peak));
  opacity: 1;
}

.dialkit-audio-meter__cell[data-clipped] {
  background: var(--dial-meter-cell-clipped);
  opacity: 1;
}

@container dialkit-audio-meter (min-width: 200px) {
  .dialkit-audio-meter__bands {
    gap: var(--dial-meter-band-gap);
    padding: var(--dial-meter-padding);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dialkit-audio-meter *,
  .dialkit-audio-meter *::before,
  .dialkit-audio-meter *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.dialkit-panel {
  position: fixed;
  z-index: 9999;
  max-height: calc(100vh - 32px);
  overflow: visible;
}

/* Inline mode */
.dialkit-root[data-mode="inline"] {
  height: 100%;
}

.dialkit-panel[data-mode="inline"] {
  position: static;
  z-index: auto;
  max-height: 100%;
  height: 100%;
  overflow: hidden;
}

.dialkit-panel-inner {
  background: var(--dial-glass-bg);
  border: 1px solid var(--dial-border);
  border-radius: 14px;
  backdrop-filter: blur(var(--dial-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--dial-backdrop-blur));
  padding: 10px 12px 0 12px;
  transform: translateZ(0);
  transform-origin: top right;
}

.dialkit-panel[data-position="top-left"] .dialkit-panel-inner {
  transform-origin: top left;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}


.dialkit-panel-inner[data-collapsed="true"] {
  border-radius: 50%;
  padding: 12px;
  box-sizing: border-box;
}

.dialkit-panel-inner[data-collapsed="true"] .dialkit-panel-header {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.dialkit-panel-inner[data-collapsed="true"] .dialkit-folder-title-row {
  display: none;
}

.dialkit-panel-inner[data-collapsed="true"] .dialkit-folder-header-top {
  justify-content: center;
  padding: 0;
}

.dialkit-panel-inner::-webkit-scrollbar {
  display: none;
}

.dialkit-panel-inner {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.dialkit-panel-inline {
  width: 100%;
  height: 100%;
  max-height: none;
  overflow-y: auto;
  box-shadow: none;
  border-radius: 0;
  border: none;
  box-sizing: border-box;
}

.dialkit-panel[data-mode="inline"] .dialkit-panel-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

/* Position variants */
.dialkit-panel[data-position="top-right"] {
  top: 16px;
  right: 16px;
}

.dialkit-panel[data-position="top-left"] {
  top: 16px;
  left: 16px;
}

.dialkit-panel[data-position="bottom-right"] {
  bottom: 16px;
  right: 16px;
}

.dialkit-panel[data-position="bottom-left"] {
  bottom: 16px;
  left: 16px;
}

/* Folder */
.dialkit-folder {
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--dial-surface-subtle);
}

.dialkit-folder:last-child:not(.dialkit-folder-root) {
  padding-bottom: 0;
  margin-bottom: 0;
}

.dialkit-folder-root {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.dialkit-panel-header {
  padding-bottom: 6px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--dial-surface-subtle);
}

.dialkit-folder-header {
  cursor: pointer;
  user-select: none;
}

/* \`_collapsible: false\` folder — plain section header, not a toggle */
.dialkit-folder-header-static {
  cursor: default;
}

.dialkit-folder-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 8px 0;
}


.dialkit-folder-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dial-text-section);
  letter-spacing: -0.01em;
  transform: translateY(-0.5px);
  transition: color 0.15s;
}

.dialkit-folder-title-root {
  font-size: 15px;
  font-weight: 600;
  color: var(--dial-text-root);
  transform: translateZ(0);
}

.dialkit-folder-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
}

/* Hint tooltip — one line of help for a control or folder. Reveal is pure CSS
   (:hover for pointer, :focus-within for keyboard) so all four frameworks get
   identical behaviour with no per-framework state. The tooltip is always in the
   DOM so \`aria-describedby\` on the host always resolves. */
.dialkit-control-tip[data-hint],
.dialkit-folder-header[data-hint],
.dialkit-module-header[data-hint] {
  position: relative;
}

.dialkit-hint {
  position: absolute;
  top: calc(100% + 4px);
  /* Panel-width, never wider: the panel body scrolls, so anything spilling
     sideways would be clipped or push a horizontal scrollbar. */
  left: 0;
  right: 0;
  z-index: 20;
  padding: 6px 8px;
  border: 1px solid var(--dial-border);
  border-radius: 7px;
  background: var(--dial-dropdown-bg);
  box-shadow: var(--dial-shadow-dropdown);
  color: var(--dial-text-secondary);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: 0;
  text-align: left;
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-2px);
  /* Longhand, not the shorthand: the reveal delay below has to survive the
     reduced-motion override, which only resets duration. */
  transition-property: opacity, transform, visibility;
  transition-duration: 0.12s;
  transition-timing-function: ease;
  pointer-events: none;
}

/* Dwell before revealing, so sweeping a pointer — or tabbing — across a dense
   panel doesn't flash a row of tooltips. Hiding stays immediate: the delay
   lives only here, so leaving falls back to the base rule's zero delay. */
.dialkit-control-tip[data-hint]:hover > .dialkit-hint,
.dialkit-control-tip[data-hint]:focus-within > .dialkit-hint,
.dialkit-folder-header[data-hint]:hover > .dialkit-hint,
.dialkit-module-header[data-hint]:hover > .dialkit-hint {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: 1.5s;
}

@media (prefers-reduced-motion: reduce) {
  .dialkit-hint {
    transition-duration: 0s;
    transform: none;
  }
}

/* An open popover owns the space under the row; a hint tooltip would land on
   top of it. */
.dialkit-control-tip[data-affordance-open] > .dialkit-hint {
  display: none;
}

/* ── Disabled ────────────────────────────────────────────────────────────
   Greyed and inert. Pointer events are blocked on the control itself but not
   the wrapper, so a disabled control's hint still reveals on hover — which is
   exactly when the explanation matters most. */
.dialkit-control-tip[data-disabled] > *:not(.dialkit-hint) {
  opacity: 0.4;
  pointer-events: none;
}

/* ── Affordance ──────────────────────────────────────────────────────────
   A 4px dot in the control's bottom-right corner opening a host-filled
   popover. Idle it is barely visible; the app pushes \`status\` to light it.

   The BUTTON is the hit area (16px, transparent) and the dot is drawn by its
   ::after. They have to be separate elements: a transparent box-shadow ring
   does not extend hit testing — shadows never take pointer events — so sizing
   the button to the visual would leave a 4px target, which is unclickable and
   fails the 24px minimum-target guidance by a mile. */
.dialkit-control-tip[data-affordance] {
  position: relative;
}

.dialkit-affordance-dot {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.dialkit-affordance-dot::after {
  content: '';
  position: absolute;
  /* Centred in the 16px hotspot, so growing on hover stays concentric. */
  right: 6px;
  bottom: 6px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--dial-affordance-idle);
  transition: background 0.15s ease, transform 0.15s ease;
}

/* Scales harder than the old 8px dot did: 1.35x of 4px is nearly invisible as
   a hover response, and the dot needs to acknowledge a pointer it can't move. */
.dialkit-affordance-dot:hover::after,
.dialkit-affordance-dot:focus-visible::after,
.dialkit-affordance-dot[data-open="true"]::after {
  transform: scale(1.75);
}

/* On the dot, not the button: outlining the 16px hotspot would read as a box
   floating in the control's corner. */
.dialkit-affordance-dot:focus-visible {
  outline: none;
}

.dialkit-affordance-dot:focus-visible::after {
  outline: 2px solid var(--dial-affordance-armed);
  outline-offset: 2px;
}

.dialkit-affordance-dot[data-status="armed"]::after {
  background: var(--dial-affordance-armed);
}

.dialkit-affordance-dot[data-status="active"]::after {
  background: var(--dial-affordance-active);
  animation: dialkit-affordance-pulse 1.4s ease-in-out infinite;
}

/* Fades rather than glows: a box-shadow pulse would need color-mix to derive a
   translucent ring from the theme token, and opacity reads the same at 8px. */
@keyframes dialkit-affordance-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Fixed + portalled into .dialkit-root, like the select dropdown: the panel
   body scrolls, and an interactive popover must not be clipped by it. */
.dialkit-affordance-popover {
  position: fixed;
  z-index: 10000;
  /* The measured width is the real width, so the popover's right edge lines up
     with the dot instead of overhanging the panel by its padding. */
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid var(--dial-border);
  border-radius: 10px;
  background: var(--dial-dropdown-bg);
  box-shadow: var(--dial-shadow-dropdown);
}

.dialkit-affordance-popover-title {
  display: block;
  margin-bottom: 6px;
  color: var(--dial-text-tertiary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) {
  .dialkit-affordance-dot {
    transition-duration: 0s;
  }

  .dialkit-affordance-dot[data-status="active"] {
    animation: none;
  }
}

.dialkit-folder-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

.dialkit-folder-copy svg {
  width: 14px;
  height: 14px;
  color: var(--dial-text-section);
}

.dialkit-folder-icon {
  width: 20px;
  height: 20px;
  padding: 2px;
  box-sizing: border-box;
  flex-shrink: 0;
  color: var(--dial-text-label);
  opacity: 0.6;
}

.dialkit-panel-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 16px;
  height: 16px;
  color: var(--dial-text-focus);
  z-index: 1;
}

.dialkit-folder-content {
  will-change: transform;
}

.dialkit-folder-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 10px;
}

/* Non-root folders - top & bottom HR dividers */
.dialkit-folder:not(.dialkit-folder-root) {
  border-top: 1px solid var(--dial-surface-subtle);
  border-bottom: 1px solid var(--dial-surface-subtle);
  margin-top: 4px;
  margin-bottom: 4px;
  padding-bottom: 0;
}

/* Adjacent non-root folders collapse gap and share a single divider */
.dialkit-folder:not(.dialkit-folder-root) + .dialkit-folder:not(.dialkit-folder-root) {
  margin-top: -10px;
  border-top: none;
}

/* Non-root folder header - match row height */
.dialkit-folder:not(.dialkit-folder-root) > .dialkit-folder-header {
  height: var(--dial-row-height);
  padding: 0;
}

.dialkit-folder:not(.dialkit-folder-root) > .dialkit-folder-header > .dialkit-folder-header-top {
  padding: 0;
  height: 100%;
}

/* Root folder inner needs no extra bottom padding */
.dialkit-folder-root > .dialkit-folder-content > .dialkit-folder-inner {
  padding-bottom: 0;
}

/* Content spacing handled by folder-inner gap */

/* Module — group with a header enable switch; body collapses when off */
.dialkit-module {
  border-top: 1px solid var(--dial-surface-subtle);
  border-bottom: 1px solid var(--dial-surface-subtle);
  margin: 4px 0;
}

.dialkit-module + .dialkit-module {
  margin-top: 0;
  border-top: none;
}

.dialkit-module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  user-select: none;
}

.dialkit-module-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--dial-text-section);
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialkit-module-switch {
  flex-shrink: 0;
  width: 84px;
}

/* Config-level module folders: the header doubles as the open/close toggle
   (the switch itself stops propagation). */
.dialkit-module-header-toggle {
  cursor: pointer;
}

/* Smooth height collapse via the grid-rows 0fr↔1fr trick — animates the
   real content height with no JS measurement, body stays in the DOM. */
.dialkit-module-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.dialkit-module-collapse[data-open='true'] {
  grid-template-rows: 1fr;
}

.dialkit-module-collapse-clip {
  overflow: hidden;
  min-height: 0;
}

.dialkit-module-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 10px;
}

/* In-panel module folder (a config folder that declared \`_enabled\`) — reuses
   the module idiom but sits inside the inset panel body, so it aligns to the
   control-row grid instead of running full bleed like the standalone Module:
   - the header matches --dial-row-height and takes the rows' 10px right inset,
     so the Off/On switch pill right-aligns with the row edge;
   - closed it is a single compact header row with a hairline under it, padded
     so the hairline sits optically centered between its text and the next
     row's text; the last module in a run draws no trailing hairline;
   - open it drops the divider and gets its breathing room back. */
.dialkit-module-folder {
  margin: 0;
  border-top: none;
  border-bottom: 1px solid var(--dial-border);
  /* The panel stacks children with a 6px gap below the hairline; mirror it
     above so the divider sits equidistant from both texts. */
  padding-bottom: 6px;
}

.dialkit-module-folder > .dialkit-module-header {
  box-sizing: border-box;
  height: var(--dial-row-height);
  padding: 0 10px 0 0;
}

.dialkit-module-folder[data-open='true'] {
  margin: 4px 0;
  border-bottom: none;
  padding-bottom: 0;
}

.dialkit-module-folder:last-child {
  border-bottom: none;
  padding-bottom: 0;
}


/* Slider */
.dialkit-slider-wrapper {
  position: relative;
  height: var(--dial-row-height);
}

.dialkit-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
  touch-action: none;
}

.dialkit-slider-hashmarks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dialkit-slider-hashmark {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 8px;
  border-radius: 999px;
  transform: translateX(-50%) translateY(-50%);
  background: rgba(255, 255, 255, 0);
  transition: background 200ms;
}

.dialkit-slider-active .dialkit-slider-hashmark {
  background: var(--dial-border-hover);
}

.dialkit-slider-active .dialkit-slider-value {
  color: var(--dial-text-focus);
}

.dialkit-slider-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: var(--dial-surface-active);
  transition: background 0.15s;
  pointer-events: none;
}

.dialkit-slider-active .dialkit-slider-fill {
  background: var(--dial-border-hover);
}

.dialkit-slider-handle {
  position: absolute;
  top: 50%;
  width: 3px;
  height: 20px;
  border-radius: 999px;
  background: var(--dial-text-primary);
  pointer-events: none;
}

.dialkit-slider-label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(calc(-50% - 0.5px));
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  pointer-events: none;
  transition: color 0.15s;
  display: inline-flex;
  align-items: center;
}

.dialkit-slider-value {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(calc(-50% + 0.5px));
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-label);
  pointer-events: auto;
  transition: color 0.15s, border-color 0.15s;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}

.dialkit-slider-value-editable {
  border-bottom-color: var(--dial-text-label);
}

.dialkit-slider-unit {
  margin-left: 2px;
  color: var(--dial-text-tertiary);
}

.dialkit-slider-value-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-bottom: none;
  padding-bottom: 0;
  pointer-events: none;
}

.dialkit-slider-value-icon svg {
  display: block;
}

.dialkit-slider-input {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4ch;
  min-width: 3ch;
  max-width: 6ch;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-label);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--dial-text-label);
  padding: 0 0 1px 0;
  outline: none;
  text-align: right;
}

.dialkit-slider-input:focus {
  color: var(--dial-text-focus);
}

/* Range Slider — dual-handle sibling of the slider. Track is identical; the fill
   spans BETWEEN the two handles and both handles stay subtly visible at rest. */
.dialkit-range-slider-wrapper {
  position: relative;
  height: var(--dial-row-height);
}

.dialkit-range-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
  touch-action: none;
}

.dialkit-range-slider-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: var(--dial-surface-active);
  transition: background 0.15s;
  pointer-events: none;
}

.dialkit-range-slider-active .dialkit-range-slider-fill {
  background: var(--dial-border-hover);
}

.dialkit-range-slider-active .dialkit-range-slider-value {
  color: var(--dial-text-focus);
}

.dialkit-range-slider-handle {
  position: absolute;
  top: 50%;
  width: 3px;
  height: 20px;
  border-radius: 999px;
  background: var(--dial-text-primary);
  pointer-events: none;
}

.dialkit-range-slider-label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(calc(-50% - 0.5px));
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  pointer-events: none;
  transition: color 0.15s;
  display: inline-flex;
  align-items: center;
}

.dialkit-range-slider-value {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(calc(-50% + 0.5px));
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-label);
  pointer-events: auto;
  transition: color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.dialkit-range-slider-dash {
  color: var(--dial-text-tertiary);
  pointer-events: none;
}

.dialkit-range-slider-bound {
  cursor: text;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
  transition: border-color 0.15s;
}

.dialkit-range-slider-active .dialkit-range-slider-bound:hover,
.dialkit-range-slider-bound:hover {
  border-bottom-color: var(--dial-text-label);
}

.dialkit-range-slider-input {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4ch;
  min-width: 3ch;
  max-width: 6ch;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-label);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--dial-text-label);
  padding: 0 0 1px 0;
  outline: none;
  text-align: right;
}

.dialkit-range-slider-input:focus {
  color: var(--dial-text-focus);
}

/* Segmented Control */
.dialkit-segmented {
  position: relative;
  display: flex;
  padding: 2px;
  background: transparent;
  border-radius: var(--dial-radius);
}

.dialkit-segmented-pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  background: var(--dial-surface-active);
  border-radius: 6px;
  z-index: 0;
  pointer-events: none;
}

.dialkit-segmented-button {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  padding: 6px 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
}

.dialkit-segmented-button[data-active="true"] {
  color: var(--dial-text-primary);
}

.dialkit-segmented-button[data-active="false"] {
  color: var(--dial-text-label);
}

/* Toggle */
.dialkit-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.dialkit-toggle:hover {
  background: var(--dial-surface-hover);
}

.dialkit-toggle-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  transition: color 0.15s;
}

.dialkit-toggle[data-checked="true"] .dialkit-toggle-label {
  color: var(--dial-text-primary);
}

.dialkit-toggle-track {
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: var(--dial-surface-active);
  transition: background 0.2s;
  position: relative;
}

.dialkit-toggle[data-checked="true"] .dialkit-toggle-track {
  background: var(--dial-border-hover);
}

.dialkit-toggle-thumb {
  position: absolute;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: var(--dial-text-primary);
}

/* Button Group */
.dialkit-button-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialkit-button {
  flex: 1;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-secondary);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dialkit-button:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-primary);
}

.dialkit-button:active {
  background: var(--dial-surface-active);
}

/* Labeled Control Row (label + control side by side) */
.dialkit-labeled-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: var(--dial-row-height);
  padding: 2px 10px 2px 12px;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
}

.dialkit-labeled-control-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  flex-shrink: 0;
  line-height: 17px;
}

.dialkit-labeled-control .dialkit-segmented {
  flex-shrink: 0;
  margin-right: -6px;
}

.dialkit-action-button {
  width: 160px;
  flex-shrink: 0;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-secondary);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dialkit-action-button:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-primary);
}

.dialkit-action-button:active {
  background: var(--dial-surface-active);
}

.dialkit-actions-group {
  align-items: flex-start;
}

.dialkit-actions-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 160px;
}

/* Spring Visualization */
.dialkit-spring-viz {
  width: 100%;
  border-radius: var(--dial-radius);
  background: var(--dial-surface);
  overflow: visible;
}

.dialkit-easing-viz {
  width: 100%;
  aspect-ratio: 256 / 140;
}

/* Curve preview — the read-only \`{ type: 'curve' }\` row. Token-driven strokes
   so light mode themes for free (no per-theme overrides like the spring viz). */
.dialkit-curve {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.dialkit-curve-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
}

.dialkit-curve-surface {
  display: block;
  width: 100%;
  border-radius: var(--dial-radius);
  background: var(--dial-surface);
  border: 1px solid var(--dial-border);
}

.dialkit-curve-baseline {
  stroke: var(--dial-border-hover, rgba(255, 255, 255, 0.15));
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

/* Vertical reference markers: quieter than the curve stroke, brighter than
   the dashed baseline where the two would collide. */
.dialkit-curve-marker {
  stroke: var(--dial-text-tertiary, rgba(255, 255, 255, 0.4));
  stroke-width: 1;
}

.dialkit-curve-stroke {
  stroke: var(--dial-affordance-armed, #818cf8);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Waveform Visualization — canvas trace, themed via \`color\` (read per frame) */
.dialkit-waveform-viz-wrap {
  position: relative;
  display: inline-block;
}

.dialkit-waveform-viz {
  display: block;
  width: 100%;
  border-radius: var(--dial-radius);
  background: var(--dial-surface);
  color: var(--dial-text-root);
}

/* Zoom controls — fixed to the canvas's top-right corner */
.dialkit-waveform-zoom {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
}

.dialkit-waveform-zoom button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid var(--dial-border);
  background: var(--dial-surface-active);
  color: var(--dial-text-root);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.dialkit-waveform-zoom button:hover:not(:disabled) {
  background: var(--dial-surface-hover);
  border-color: var(--dial-border-hover);
}

.dialkit-waveform-zoom button:disabled {
  opacity: 0.4;
  cursor: default;
}

.dialkit-waveform-zoom svg {
  display: block;
  width: 14px;
  height: 14px;
}

/* Analyser Visualization — real-time canvas trace, themed via \`color\` (read per frame) */
.dialkit-analyser-viz-wrap {
  position: relative;
  display: inline-block;
}

.dialkit-analyser-viz {
  display: block;
  width: 100%;
  border-radius: var(--dial-radius);
  background: var(--dial-surface);
  color: var(--dial-text-root);
}

/* Mute / solo actions — fixed to the canvas's top-right corner, matching the waveform's zoom buttons */
.dialkit-analyser-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
}

.dialkit-analyser-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  border-radius: 6px;
  border: 1px solid var(--dial-border);
  background: var(--dial-surface-active);
  color: var(--dial-text-root);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.dialkit-analyser-actions button:hover:not(:disabled) {
  background: var(--dial-surface-hover);
  border-color: var(--dial-border-hover);
}

.dialkit-analyser-actions button:disabled {
  opacity: 0.4;
  cursor: default;
}

/* Engaged states are color-coded: rose for mute, amber for solo. */
.dialkit-analyser-actions button[aria-label='Mute'][aria-pressed='true'] {
  background: rgba(244, 63, 94, 0.22);
  border-color: rgba(244, 63, 94, 0.55);
  color: #fb7185;
}

.dialkit-analyser-actions button[aria-label='Solo'][aria-pressed='true'] {
  background: rgba(245, 158, 11, 0.22);
  border-color: rgba(245, 158, 11, 0.55);
  color: #fbbf24;
}

/* Panel Wrapper (contains panel + toolbar) */
.dialkit-panel-wrapper {
  display: inline-flex;
  flex-direction: column;
}

/* Panel Toolbar */
.dialkit-panel-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--dial-row-height);
  margin-bottom: 6px;
  min-width: 0;
  overflow: hidden;
}

.dialkit-toolbar-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--dial-row-height);
  height: var(--dial-row-height);
  padding: 0;
  flex-shrink: 0;
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-toolbar-add:hover {
  background: var(--dial-surface-hover);
}

.dialkit-toolbar-add svg {
  width: 16px;
  height: 16px;
  color: var(--dial-text-label);
}

.dialkit-toolbar-copy {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--dial-row-height);
  padding: 0 12px;
  flex-shrink: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-toolbar-copy:hover {
  background: var(--dial-surface-hover);
}

.dialkit-toolbar-copy-icon-wrap {
  position: relative;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dialkit-toolbar-copy-icon {
  position: absolute;
  inset: 0;
  width: 16px;
  height: 16px;
}

/* Text Control */
.dialkit-text-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: var(--dial-row-height);
  padding: 0 12px;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
}

.dialkit-text-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  flex-shrink: 0;
}

.dialkit-text-input {
  flex: 1;
  min-width: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
  text-align: right;
  cursor: text;
}

.dialkit-text-input:focus {
  color: var(--dial-text-focus);
}

.dialkit-text-input::placeholder {
  color: var(--dial-text-tertiary);
}

/* Select Control - Full-width row */
.dialkit-select-row {
}

.dialkit-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: var(--dial-row-height);
  padding: 0 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-select-trigger:hover {
  background: var(--dial-surface-hover);
}

.dialkit-select-trigger[data-open="true"] {
  background: var(--dial-surface-active);
}

.dialkit-select-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  flex-shrink: 0;
  transform: translateY(-0.5px);
}

.dialkit-select-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialkit-select-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  transform: translateY(-0.5px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialkit-select-chevron {
  width: 20px;
  height: 20px;
  padding: 2px;
  box-sizing: border-box;
  flex-shrink: 0;
  opacity: 0.6;
}

/* Select Dropdown (portaled to body) */
.dialkit-select-dropdown {
  background: var(--dial-glass-bg);
  border: 1px solid var(--dial-border);
  border-radius: var(--dial-radius);
  padding: 4px;
  z-index: 10000;
  box-shadow: var(--dial-shadow-dropdown);
}

.dialkit-select-option {
  display: block;
  width: 100%;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}

.dialkit-select-option:hover {
  background: var(--dial-surface-hover);
}

.dialkit-select-option[data-selected="true"] {
  color: var(--dial-text-primary);
  background: var(--dial-surface-active);
}

/* File Control */
.dialkit-file-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dialkit-file-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
  height: var(--dial-row-height);
  padding: 0 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-file-trigger:hover {
  background: var(--dial-surface-hover);
}

.dialkit-file-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  flex-shrink: 0;
  transform: translateY(-0.5px);
}

.dialkit-file-right {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.dialkit-file-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.5;
}

.dialkit-file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: translateY(-0.5px);
}

.dialkit-file-name[data-empty="true"] {
  color: var(--dial-text-tertiary);
}

.dialkit-file-clear {
  flex-shrink: 0;
  width: var(--dial-row-height);
  height: var(--dial-row-height);
  display: grid;
  place-items: center;
  padding: 0;
  color: var(--dial-text-tertiary);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dialkit-file-clear:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-label);
}

.dialkit-file-clear svg {
  width: 13px;
  height: 13px;
}

/* Visually-hidden native input (still programmatically clickable) */
.dialkit-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* Swatch Control (reuses the .dialkit-select-* trigger/dropdown structure) */
.dialkit-swatch-preview {
  display: flex;
  flex-shrink: 0;
  width: 30px;
  height: 16px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--dial-border);
}

.dialkit-swatch-chip {
  flex: 1;
  min-width: 0;
}

.dialkit-swatch-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialkit-swatch-option-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialkit-select-option[data-highlight="true"] {
  background: var(--dial-surface-hover);
}

/* Chips Control — a wrapping grid of selectable (optionally removable) chips */
.dialkit-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialkit-chips-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--dial-text-label);
  padding-left: 2px;
}

.dialkit-chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dialkit-chip {
  display: inline-flex;
  align-items: stretch;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px transparent;
  transition: background 0.15s, box-shadow 0.15s;
}

.dialkit-chip[data-active="true"] {
  background: var(--dial-surface-active);
  box-shadow: inset 0 0 0 1px var(--dial-text-root);
}

.dialkit-chip-select {
  padding: 6px 11px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
}

.dialkit-chip-select:hover,
.dialkit-chip[data-active="true"] .dialkit-chip-select {
  color: var(--dial-text-root);
}

.dialkit-chip-remove {
  display: grid;
  place-items: center;
  width: 22px;
  padding: 0;
  color: var(--dial-text-tertiary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.dialkit-chip-remove:hover {
  color: var(--dial-text-root);
  background: var(--dial-surface-hover);
}

.dialkit-chip-remove svg {
  width: 11px;
  height: 11px;
}

/* MultiSelect Control — checkbox rows resolving to the checked values */
.dialkit-multiselect {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialkit-multiselect-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--dial-text-label);
  padding-left: 2px;
}

.dialkit-multiselect-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dialkit-multiselect-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 8px;
  font-family: inherit;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-multiselect-row:hover {
  background: var(--dial-surface-hover);
}

.dialkit-multiselect-box {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-top: 1px;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1.5px var(--dial-border-hover);
  color: var(--dial-glass-bg);
  transition: background 0.15s, box-shadow 0.15s;
}

.dialkit-multiselect-row[data-checked="true"] .dialkit-multiselect-box {
  background: var(--dial-text-root);
  box-shadow: inset 0 0 0 1.5px var(--dial-text-root);
}

.dialkit-multiselect-box svg {
  width: 9px;
  height: 9px;
}

.dialkit-multiselect-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.dialkit-multiselect-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--dial-text-label);
  transition: color 0.15s;
}

.dialkit-multiselect-row:hover .dialkit-multiselect-line,
.dialkit-multiselect-row[data-checked="true"] .dialkit-multiselect-line {
  color: var(--dial-text-root);
}

.dialkit-multiselect-tag {
  padding: 1px 5px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--dial-text-tertiary);
  background: var(--dial-surface);
  border-radius: 999px;
}

.dialkit-multiselect-hint {
  font-size: 11px;
  color: var(--dial-text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* List Control — a stack of reorderable item rows, each with its own sub-controls */
.dialkit-list-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialkit-list-item {
  position: relative;
  background: var(--dial-surface);
  border-radius: 10px;
  padding: 8px 8px 10px;
  /* Pure-CSS entrance — plays once per new row, no rAF dependency (robust where
     JS animation loops can stall, e.g. headless/background tabs). */
  animation: dialkit-list-in 0.2s ease;
}

.dialkit-list-item[data-dragging="true"] {
  opacity: 0.4;
}

/* Drop indicator — a line on the edge where the dragged row will land */
.dialkit-list-item[data-over="before"]::before,
.dialkit-list-item[data-over="after"]::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--dial-text-section);
}

.dialkit-list-item[data-over="before"]::before { top: -4px; }
.dialkit-list-item[data-over="after"]::after { bottom: -4px; }

@keyframes dialkit-list-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.dialkit-list-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}

/* Shared box for both title states so swapping button↔input doesn't shift the
   row. The 1px transparent border on the button matches the input's border. */
.dialkit-list-item-title {
  flex: 1;
  min-width: 0;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--dial-text-root);
  text-align: left;
  padding: 2px 4px;
  border: 1px solid transparent;
  border-radius: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

button.dialkit-list-item-title {
  background: transparent;
  cursor: text;
  transition: background 0.15s;
}

button.dialkit-list-item-title:hover,
button.dialkit-list-item-title:focus-visible {
  background: var(--dial-surface-hover);
}

input.dialkit-list-item-title {
  background: var(--dial-surface-active);
  border-color: var(--dial-border);
  outline: none;
}

input.dialkit-list-item-title:focus {
  border-color: var(--dial-border-hover);
}

.dialkit-list-item-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.dialkit-list-icon-btn {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  color: var(--dial-text-tertiary);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, opacity 0.15s;
}

.dialkit-list-icon-btn:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-root);
}

.dialkit-list-icon-btn svg {
  width: 13px;
  height: 13px;
}

.dialkit-list-remove svg {
  width: 14px;
  height: 14px;
}

/* Drag handle */
.dialkit-list-drag {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  color: var(--dial-text-tertiary);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: grab;
  touch-action: none;
  transition: background 0.15s, color 0.15s;
}

.dialkit-list-drag:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-label);
}

.dialkit-list-drag:active {
  cursor: grabbing;
}

.dialkit-list-drag svg {
  width: 15px;
  height: 15px;
}

.dialkit-list-item-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.dialkit-list-empty {
  padding: 14px;
  text-align: center;
  font-size: 12.5px;
  color: var(--dial-text-tertiary);
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
}

.dialkit-list-add {
  display: flex;
  flex-direction: column;
}

.dialkit-list-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 32px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dialkit-list-add-btn:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-root);
}

.dialkit-list-add-btn[data-open="true"] {
  background: var(--dial-surface-active);
  color: var(--dial-text-root);
}

.dialkit-list-add-btn svg {
  width: 14px;
  height: 14px;
}

/* Inline type picker — CSS grid reveal (no measurement, smooth in every context) */
.dialkit-list-picker {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.22s ease;
}

.dialkit-list-picker[data-open="true"] {
  grid-template-rows: 1fr;
}

.dialkit-list-picker-inner {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 6px;
}

.dialkit-list-picker-chip {
  padding: 6px 11px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dialkit-list-picker-chip:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-root);
}

/* Gallery Control */
.dialkit-gallery-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: var(--dial-row-height);
  padding: 0 10px 0 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-gallery-trigger:hover {
  background: var(--dial-surface-hover);
}

/* Open keeps the active surface so the trigger stays "lit" while the grid shows */
.dialkit-gallery[data-open="true"] .dialkit-gallery-trigger {
  background: var(--dial-surface-active);
}

.dialkit-gallery-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  transform: translateY(-0.5px);
}

.dialkit-gallery-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.dialkit-gallery-preview {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: block;
  overflow: hidden;
  border-radius: 5px;
  background: var(--dial-surface-active);
  box-shadow: inset 0 0 0 1px var(--dial-border);
}

.dialkit-gallery-preview > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dialkit-gallery-chevron {
  width: 20px;
  height: 20px;
  padding: 2px;
  box-sizing: border-box;
  flex-shrink: 0;
  opacity: 0.6;
  transition: transform 0.2s ease;
}

.dialkit-gallery[data-open="true"] .dialkit-gallery-chevron {
  transform: rotate(180deg);
}

/* Smooth height reveal via a grid 0fr → 1fr transition (no JS measurement) */
.dialkit-gallery-reveal {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}

.dialkit-gallery[data-open="true"] .dialkit-gallery-reveal {
  grid-template-rows: 1fr;
  opacity: 1;
}

.dialkit-gallery-reveal-inner {
  overflow: hidden;
  min-height: 0;
}

@media (prefers-reduced-motion: reduce) {
  .dialkit-gallery-reveal {
    transition: none;
  }
}

/* 3:4 box with the same surface as buttons, holding a scrollable masonry */
.dialkit-gallery-box {
  aspect-ratio: 3 / 4;
  width: 100%;
  margin-top: 6px;
  padding: 6px;
  box-sizing: border-box;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
  /* Native scroll: smooth on every device, and macOS provides the elastic
     rubber-band for free. \`contain\` keeps the bounce but stops it chaining
     out to the page. */
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.dialkit-gallery-box::-webkit-scrollbar {
  width: 6px;
}
.dialkit-gallery-box::-webkit-scrollbar-thumb {
  background: var(--dial-surface-active);
  border-radius: 3px;
}
.dialkit-gallery-box::-webkit-scrollbar-track {
  background: transparent;
}

.dialkit-gallery-masonry {
  column-gap: 6px;
}

.dialkit-gallery-item {
  position: relative;
  display: block;
  width: 100%;
  margin: 0 0 6px;
  padding: 0;
  border: none;
  background: var(--dial-surface-active);
  border-radius: 7px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.82;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  transition: opacity 0.18s ease, transform 0.18s ease;
  -webkit-tap-highlight-color: transparent;
}

.dialkit-gallery-item:last-child {
  margin-bottom: 0;
}

.dialkit-gallery-item:hover,
.dialkit-gallery-item[data-selected="true"] {
  opacity: 1;
}

.dialkit-gallery-item:hover {
  transform: translateY(-1px);
}

.dialkit-gallery-item:active {
  transform: scale(0.97);
}

/* Subtle image outline by default; a bright ring when selected */
.dialkit-gallery-item::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px var(--dial-border);
  transition: box-shadow 0.18s ease;
  pointer-events: none;
}

.dialkit-gallery-item[data-selected="true"]::after {
  box-shadow: inset 0 0 0 2px var(--dial-text-root);
}

/* Media wrapper reserves space (so the skeleton sits at the right size and the
   masonry doesn't reflow when images load) when an aspect ratio is provided. */
.dialkit-gallery-media {
  position: relative;
  display: block;
  width: 100%;
  border-radius: inherit;
  overflow: hidden;
}
.dialkit-gallery-media[data-fixed="true"] .dialkit-gallery-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dialkit-gallery-media[data-fixed="false"] .dialkit-gallery-img {
  position: relative;
  width: 100%;
  height: auto;
}

/* Shimmer skeleton shown until the image loads, then cross-faded out */
.dialkit-gallery-skeleton {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(100deg, var(--dial-surface-active) 25%, var(--dial-surface-hover) 50%, var(--dial-surface-active) 75%);
  background-size: 200% 100%;
  animation: dialkit-gallery-shimmer 1.4s ease-in-out infinite;
  opacity: 1;
  transition: opacity 0.45s ease;
  pointer-events: none;
}
.dialkit-gallery-skeleton[data-done="true"] {
  opacity: 0;
}
@keyframes dialkit-gallery-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* The image blur-fades + settles in once it has loaded */
.dialkit-gallery-img {
  display: block;
  border-radius: inherit;
  opacity: 0;
  filter: blur(12px);
  transform: scale(1.06);
  transition: opacity 0.5s ease, filter 0.55s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.dialkit-gallery-img[data-loaded="true"] {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .dialkit-gallery-skeleton {
    animation: none;
  }
  .dialkit-gallery-img {
    filter: none;
    transform: none;
    transition: opacity 0.25s ease;
  }
}

.dialkit-gallery-check {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--dial-glass-bg);
  background: var(--dial-text-root);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dialkit-gallery-item[data-selected="true"] .dialkit-gallery-check {
  opacity: 1;
  transform: scale(1);
}

.dialkit-gallery-check svg {
  width: 11px;
  height: 11px;
}

/* Color Control */
.dialkit-color-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: var(--dial-row-height);
  padding: 0 12px;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
}

.dialkit-color-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  flex-shrink: 0;
  transform: translateY(-0.5px);
}

.dialkit-color-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialkit-color-hex {
  /* Same fixed box as the edit input so the row doesn't shift on edit toggle. */
  display: inline-block;
  width: 6.5ch;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-label);
  cursor: text;
  transform: translateY(-0.5px);
}

.dialkit-color-hex-input {
  width: 6.5ch;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-label);
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
  text-transform: uppercase;
  transform: translateY(-0.5px);
}

.dialkit-color-hex-input:focus {
  color: var(--dial-text-focus);
}

.dialkit-color-swatch {
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid var(--dial-border-hover);
  cursor: pointer;
  transition: transform 0.15s;
  /* Current color layered over a checkerboard so translucent values read correctly. */
  background:
    linear-gradient(var(--swatch-color, transparent), var(--swatch-color, transparent)),
    conic-gradient(rgba(127, 127, 127, 0.35) 25%, transparent 0 50%, rgba(127, 127, 127, 0.35) 0 75%, transparent 0) 0 0 / 8px 8px;
}

.dialkit-color-swatch:hover {
  transform: scale(1.1);
}

.dialkit-color-swatch[data-open="true"] {
  transform: scale(1.1);
}

.dialkit-color-opacity {
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-label);
  transform: translateY(-0.5px);
  white-space: nowrap;
}

.dialkit-color-opacity-unit {
  color: var(--dial-text-tertiary);
}

.dialkit-color-hex-wrap {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: text;
}

/* Fixed hash symbol — the editable value carries only the hex digits. */
.dialkit-color-hash {
  font-size: 13px;
  font-weight: 500;
  font-family: 'Geist Mono', monospace;
  color: var(--dial-text-tertiary);
  transform: translateY(-0.5px);
  user-select: none;
}

.dialkit-color-divider {
  width: 1px;
  height: 14px;
  flex-shrink: 0;
  background: var(--dial-surface-active);
}

/* ── Color picker popover ── */

.dialkit-color-picker-popover {
  z-index: 10000;
}

.dialkit-color-picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: var(--dial-dropdown-bg);
  border: 1px solid var(--dial-border);
  border-radius: 12px;
  box-shadow: var(--dial-shadow-dropdown);
  box-sizing: border-box;
}

.dialkit-checker {
  background: conic-gradient(rgba(127, 127, 127, 0.35) 25%, transparent 0 50%, rgba(127, 127, 127, 0.35) 0 75%, transparent 0) 0 0 / 8px 8px;
}

.dialkit-color-sv {
  position: relative;
  aspect-ratio: 3 / 2;
  border-radius: 6px;
  cursor: crosshair;
  touch-action: none;
  background:
    linear-gradient(to top, #000, transparent),
    linear-gradient(to right, #fff, hsl(var(--picker-hue, 0) 100% 50%));
}

.dialkit-color-sv-thumb,
.dialkit-color-slider-thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35), 0 1px 4px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-sizing: border-box;
}

.dialkit-color-slider {
  position: relative;
  height: 12px;
  border-radius: 999px;
  cursor: pointer;
  touch-action: none;
}

.dialkit-color-slider .dialkit-color-slider-thumb {
  top: 50%;
}

.dialkit-color-hue {
  background: linear-gradient(to right,
    hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%),
    hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%));
}

.dialkit-color-alpha-gradient {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

/* ── Per-format value fields ── */

.dialkit-color-fields {
  display: flex;
  gap: 6px;
}

.dialkit-color-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
}

.dialkit-color-field input {
  width: 100%;
  height: 26px;
  padding: 0 4px;
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
}

.dialkit-color-field input:focus {
  color: var(--dial-text-focus);
  background: var(--dial-surface-hover);
}

.dialkit-color-field-hex {
  flex: 2.5;
}

.dialkit-color-field-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-align: center;
  color: var(--dial-text-tertiary);
  user-select: none;
}

/* ── Saved palette row ── */

.dialkit-color-palette {
  display: flex;
  gap: 6px;
}

.dialkit-color-palette-slot {
  flex: 1;
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition: transform 0.45s ease;
  touch-action: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}

.dialkit-color-palette-slot[data-filled="false"] {
  background: transparent;
  border: 1px dashed var(--dial-border-hover);
  transition: transform 0.15s ease, background 0.15s;
}

.dialkit-color-palette-slot[data-filled="false"]:hover {
  background: var(--dial-surface-hover);
}

.dialkit-color-palette-slot[data-filled="true"] {
  background:
    linear-gradient(var(--swatch-color, transparent), var(--swatch-color, transparent)),
    conic-gradient(rgba(127, 127, 127, 0.35) 25%, transparent 0 50%, rgba(127, 127, 127, 0.35) 0 75%, transparent 0) 0 0 / 8px 8px;
  box-shadow: inset 0 0 0 1px var(--dial-border);
}

/* Long-press telegraph: the slot sinks while the hold timer runs. */
.dialkit-color-palette-slot[data-holding="true"] {
  transform: scale(0.82);
}

/* ── Gradient control ── */

.dialkit-gradient-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: var(--dial-row-height);
  padding: 0 12px;
  background: var(--dial-surface);
  border-radius: var(--dial-radius);
}

.dialkit-gradient-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  flex-shrink: 0;
  transform: translateY(-0.5px);
}

/* The trigger shows the real gradient (incl. radial/conic) over a checkerboard
   so translucent stops read correctly — same two-layer technique as the swatch. */
.dialkit-gradient-preview {
  width: 96px;
  height: 20px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid var(--dial-border-hover);
  cursor: pointer;
  transition: transform 0.15s;
  background:
    var(--gradient-preview, transparent),
    conic-gradient(rgba(127, 127, 127, 0.35) 25%, transparent 0 50%, rgba(127, 127, 127, 0.35) 0 75%, transparent 0) 0 0 / 8px 8px;
}

.dialkit-gradient-preview:hover,
.dialkit-gradient-preview[data-open="true"] {
  transform: scale(1.05);
}

/* ── Gradient editor popover ── */

.dialkit-gradient-popover {
  z-index: 10000;
}

.dialkit-gradient-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: var(--dial-dropdown-bg);
  border: 1px solid var(--dial-border);
  border-radius: 12px;
  box-shadow: var(--dial-shadow-dropdown);
  box-sizing: border-box;
}

/* The embedded color picker sheds its own chrome inside the gradient panel. */
.dialkit-gradient-panel .dialkit-color-picker {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  border-radius: 0;
}

/* Top toolbar: drag grip · type tabs · advanced toggle. */
.dialkit-gradient-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dialkit-gradient-toolbar .dialkit-segmented {
  flex: 1;
  min-width: 0;
}

.dialkit-gradient-grip {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 20px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--dial-text-tertiary);
  cursor: grab;
  touch-action: none;
  transition: color 0.15s;
}

.dialkit-gradient-grip:hover {
  color: var(--dial-text-label);
}

.dialkit-gradient-grip:active {
  cursor: grabbing;
}

.dialkit-gradient-grip svg {
  width: 16px;
  height: 16px;
}

.dialkit-gradient-advanced-toggle {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dial-text-tertiary);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.dialkit-gradient-advanced-toggle:hover {
  color: var(--dial-text-label);
  background: var(--dial-surface-hover);
}

.dialkit-gradient-advanced-toggle[data-active="true"] {
  color: var(--dial-text-focus);
  background: var(--dial-surface-active);
}

.dialkit-gradient-advanced-toggle svg {
  width: 16px;
  height: 16px;
}

.dialkit-gradient-advanced {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialkit-gradient-pad {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  border: 1px solid var(--dial-border);
  overflow: hidden;
  touch-action: none;
}

.dialkit-gradient-pad-fill {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dialkit-gradient-pad-line {
  position: absolute;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.35);
  transform-origin: left center;
  pointer-events: none;
}

.dialkit-gradient-pad-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  padding: 0;
  margin: 0;
  transform: translate(-50%, -50%);
  border: 2px solid #fff;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.35);
  cursor: grab;
  touch-action: none;
}

.dialkit-gradient-pad-handle:active {
  cursor: grabbing;
}

.dialkit-gradient-pad-handle[data-kind="center"] {
  border-radius: 3px;
  width: 13px;
  height: 13px;
}

.dialkit-gradient-strip {
  position: relative;
  height: 28px;
  border-radius: 6px;
  cursor: crosshair;
  touch-action: none;
  background:
    var(--gradient-ramp, transparent),
    conic-gradient(rgba(127, 127, 127, 0.35) 25%, transparent 0 50%, rgba(127, 127, 127, 0.35) 0 75%, transparent 0) 0 0 / 8px 8px;
}

.dialkit-gradient-stop {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid #fff;
  box-sizing: border-box;
  cursor: grab;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35), 0 1px 4px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -50%) translateY(var(--detach-y, 0px));
  transition: transform 0.12s ease, opacity 0.12s ease;
  background:
    linear-gradient(var(--swatch-color, transparent), var(--swatch-color, transparent)),
    conic-gradient(rgba(127, 127, 127, 0.35) 25%, transparent 0 50%, rgba(127, 127, 127, 0.35) 0 75%, transparent 0) 0 0 / 6px 6px;
}

/* Active handle: same white border, a blue selection ring. */
.dialkit-gradient-stop[data-selected="true"] {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35), 0 0 0 3px #3b82f6, 0 1px 4px rgba(0, 0, 0, 0.4);
}

/* Long-press telegraph: the handle sinks while the hold timer runs. */
.dialkit-gradient-stop[data-holding="true"] {
  transform: translate(-50%, -50%) scale(0.82);
  transition: transform 0.45s ease;
}

/* Drag-off-the-strip telegraph: fade + shrink to preview removal. */
.dialkit-gradient-stop[data-detaching="true"] {
  opacity: 0.45;
  transform: translate(-50%, -50%) translateY(var(--detach-y, 0px)) scale(0.85);
}

.dialkit-gradient-divider {
  height: 1px;
  background: var(--dial-surface-active);
}

/* Preset Manager */
.dialkit-preset-manager {
  position: relative;
  flex: 1;
}

.dialkit-preset-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: var(--dial-row-height);
  padding: 0 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-preset-trigger:hover {
  background: var(--dial-surface-hover);
}

.dialkit-preset-trigger[data-disabled="true"] {
  cursor: default;
}

.dialkit-preset-trigger[data-disabled="true"]:hover {
  background: var(--dial-surface);
}

.dialkit-preset-trigger[data-open="true"] {
  background: var(--dial-surface-active);
}

.dialkit-preset-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.dialkit-preset-dropdown {
  width: max-content;
  background: var(--dial-dropdown-bg);
  border: 1px solid var(--dial-border);
  border-radius: 12px;
  padding: 4px;
  z-index: 10000;
  box-shadow: var(--dial-shadow-dropdown);
}

.dialkit-preset-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--dial-border);
}

.dialkit-preset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 8px 10px;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-preset-item:hover {
  background: var(--dial-surface-hover);
}

.dialkit-preset-item[data-active="true"] {
  background: var(--dial-surface-active);
}

.dialkit-preset-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialkit-preset-item[data-active="true"] .dialkit-preset-name {
  color: var(--dial-text-primary);
}

.dialkit-preset-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.dialkit-preset-item:hover .dialkit-preset-delete {
  opacity: 0.6;
}

.dialkit-preset-delete:hover {
  opacity: 1 !important;
}

.dialkit-preset-delete svg {
  width: 14px;
  height: 14px;
  color: var(--dial-text-focus);
  pointer-events: none;
}

.dialkit-preset-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dialkit-preset-save-btn:hover {
  background: var(--dial-surface-hover);
  color: var(--dial-text-primary);
}

.dialkit-preset-save-btn svg {
  width: 12px;
  height: 12px;
}

.dialkit-preset-save-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
}

.dialkit-preset-input {
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  font-family: inherit;
  font-size: 13px;
  color: var(--dial-text-primary);
  background: var(--dial-surface);
  border: 1px solid var(--dial-border);
  border-radius: 6px;
  outline: none;
}

.dialkit-preset-input:focus {
  border-color: var(--dial-text-label);
}

.dialkit-preset-input::placeholder {
  color: var(--dial-text-tertiary);
}

.dialkit-preset-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--dial-surface);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-preset-confirm:hover:not(:disabled) {
  background: var(--dial-surface-hover);
}

.dialkit-preset-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dialkit-preset-confirm svg {
  width: 14px;
  height: 14px;
  color: var(--dial-text-label);
}

/* Shortcut Pill */
.dialkit-shortcut-pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--dial-text-tertiary);
  background: var(--dial-surface-subtle);
  padding: 1px 5px;
  border-radius: 4px;
  margin-left: 6px;
  letter-spacing: 0.02em;
  line-height: 16px;
  white-space: nowrap;
  vertical-align: middle;
  transition: color 0.15s, background 0.15s;
}

.dialkit-shortcut-pill-active {
  color: var(--dial-text-primary);
  background: var(--dial-border-hover);
}

/* Shortcuts Menu Trigger */
.dialkit-shortcuts-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--dial-row-height);
  height: var(--dial-row-height);
  padding: 0;
  flex-shrink: 0;
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  transition: background 0.15s;
}

.dialkit-shortcuts-trigger:hover {
  background: var(--dial-surface-hover);
}

.dialkit-shortcuts-trigger svg {
  width: 16px;
  height: 16px;
  color: var(--dial-text-label);
}

/* Shortcuts Dropdown */
.dialkit-shortcuts-dropdown {
  background: var(--dial-dropdown-bg);
  border: 1px solid var(--dial-border);
  border-radius: 12px;
  padding: 8px;
  z-index: 10000;
  box-shadow: var(--dial-shadow-dropdown);
  min-width: 200px;
}

.dialkit-shortcuts-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--dial-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 8px 8px;
}

.dialkit-shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dialkit-shortcuts-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
}

.dialkit-shortcuts-row-key {
  font-size: 11px;
  font-weight: 600;
  font-family: ui-monospace, 'SF Mono', 'Courier New', monospace;
  color: var(--dial-text-secondary);
  background: var(--dial-surface-subtle);
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 28px;
  text-align: center;
}

.dialkit-shortcuts-row-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
}

.dialkit-shortcuts-row-mode {
  font-size: 11px;
  font-weight: 500;
  color: var(--dial-text-tertiary);
  font-style: italic;
}

.dialkit-shortcuts-hint {
  font-size: 11px;
  color: var(--dial-text-tertiary);
  padding: 6px 8px 2px;
  border-top: 1px solid var(--dial-border);
  margin-top: 4px;
}

/* ── Light Theme ── */
.dialkit-root[data-theme="light"] {
  --dial-surface: rgba(0, 0, 0, 0.04);
  --dial-surface-hover: rgba(0, 0, 0, 0.08);
  --dial-surface-active: rgba(0, 0, 0, 0.1);
  --dial-surface-subtle: rgba(0, 0, 0, 0.06);

  --dial-text-root: #000000;
  --dial-text-section: rgba(0, 0, 0, 0.65);
  --dial-text-label: rgba(0, 0, 0, 0.6);
  --dial-text-focus: #000000;

  --dial-text-primary: rgba(0, 0, 0, 0.9);
  --dial-text-secondary: rgba(0, 0, 0, 0.55);
  --dial-text-tertiary: rgba(0, 0, 0, 0.35);

  --dial-border: rgba(0, 0, 0, 0.1);
  --dial-border-hover: rgba(0, 0, 0, 0.15);

  --dial-timeline-clip-overlay: rgba(0, 0, 0, 0.28);
  --dial-timeline-loop-bg: rgba(79, 70, 229, 0.16);
  --dial-timeline-loop-border: rgba(79, 70, 229, 0.65);

  /* Affordance dot — barely there at rest, accent once something is bound. */
  --dial-affordance-idle: rgba(0, 0, 0, 0.2);
  --dial-affordance-armed: #4f46e5;
  --dial-affordance-active: #4338ca;

  --dial-glass-bg: #fafafa;
  --dial-dropdown-bg: #ffffff;
  --dial-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --dial-shadow-collapsed: 0 2px 10px rgba(0, 0, 0, 0.06);
  --dial-shadow-dropdown: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* Light mode: SVG visualization overrides */
.dialkit-root[data-theme="light"] .dialkit-spring-viz line {
  stroke: rgba(0, 0, 0, 0.08);
}

.dialkit-root[data-theme="light"] .dialkit-spring-viz line[stroke-dasharray] {
  stroke: rgba(0, 0, 0, 0.15);
}

.dialkit-root[data-theme="light"] .dialkit-spring-viz path {
  stroke: rgba(0, 0, 0, 0.5);
}

/* Light mode: toggle thumb needs shadow for definition */
.dialkit-root[data-theme="light"] .dialkit-toggle-thumb {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08);
}

/* ── System preference: light ── */
@media (prefers-color-scheme: light) {
  .dialkit-root[data-theme="system"] {
    --dial-surface: rgba(0, 0, 0, 0.04);
    --dial-surface-hover: rgba(0, 0, 0, 0.08);
    --dial-surface-active: rgba(0, 0, 0, 0.1);
    --dial-surface-subtle: rgba(0, 0, 0, 0.06);

    --dial-text-root: #000000;
    --dial-text-section: rgba(0, 0, 0, 0.65);
    --dial-text-label: rgba(0, 0, 0, 0.6);
    --dial-text-focus: #000000;

    --dial-text-primary: rgba(0, 0, 0, 0.9);
    --dial-text-secondary: rgba(0, 0, 0, 0.55);
    --dial-text-tertiary: rgba(0, 0, 0, 0.35);

    --dial-border: rgba(0, 0, 0, 0.1);
    --dial-border-hover: rgba(0, 0, 0, 0.15);

    --dial-timeline-clip-overlay: rgba(0, 0, 0, 0.28);
    --dial-timeline-loop-bg: rgba(79, 70, 229, 0.16);
    --dial-timeline-loop-border: rgba(79, 70, 229, 0.65);

    /* Affordance dot — barely there at rest, accent once something is bound. */
    --dial-affordance-idle: rgba(0, 0, 0, 0.2);
    --dial-affordance-armed: #4f46e5;
    --dial-affordance-active: #4338ca;

    --dial-glass-bg: #fafafa;
    --dial-dropdown-bg: #ffffff;
    --dial-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    --dial-shadow-collapsed: 0 2px 10px rgba(0, 0, 0, 0.06);
    --dial-shadow-dropdown: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .dialkit-root[data-theme="system"] .dialkit-spring-viz line {
    stroke: rgba(0, 0, 0, 0.08);
  }

  .dialkit-root[data-theme="system"] .dialkit-spring-viz line[stroke-dasharray] {
    stroke: rgba(0, 0, 0, 0.15);
  }

  .dialkit-root[data-theme="system"] .dialkit-spring-viz path {
    stroke: rgba(0, 0, 0, 0.5);
  }

  .dialkit-root[data-theme="system"] .dialkit-toggle-thumb {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08);
  }

}

/* Curve Composer — SVG curve series + optional driver lane.
   Strokes use currentColor + stroke-opacity so dark/light/system theme for free;
   only the lane fills reference --dial-* tokens. */
.dialkit-cc-wrap {
  position: relative;
  display: inline-block;
}

.dialkit-cc {
  display: block;
  color: var(--dial-text-root);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.dialkit-cc-lane {
  fill: var(--dial-surface);
}

.dialkit-cc-seg-hover {
  fill: var(--dial-surface-hover);
  pointer-events: none;
}

.dialkit-cc-seg-selected {
  fill: var(--dial-surface-hover);
  stroke: currentColor;
  stroke-opacity: 0.5;
  stroke-width: 1;
  pointer-events: none;
}

.dialkit-cc-grid {
  stroke: currentColor;
  stroke-opacity: 0.08;
  stroke-width: 1;
  pointer-events: none;
}

.dialkit-cc-diagonal {
  stroke: currentColor;
  stroke-opacity: 0.15;
  stroke-width: 1;
  stroke-dasharray: 4 4;
  pointer-events: none;
}

.dialkit-cc-curve {
  fill: none;
  stroke: currentColor;
  stroke-opacity: 0.85;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.dialkit-cc-connector {
  fill: none;
  stroke: currentColor;
  stroke-opacity: 0.3;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.dialkit-cc-curve-driver {
  stroke-opacity: 0.6;
}

.dialkit-cc-boundary {
  stroke: currentColor;
  stroke-opacity: 0.18;
  stroke-width: 1;
  transition: stroke-opacity 0.15s ease, stroke-width 0.15s ease;
}

.dialkit-cc-boundary[data-active="true"] {
  stroke-opacity: 0.7;
  stroke-width: 2;
}

.dialkit-cc-playhead {
  stroke: currentColor;
  stroke-width: 1.5;
  pointer-events: none;
}

.dialkit-cc-dot {
  fill: currentColor;
  pointer-events: none;
}

.dialkit-cc-label {
  fill: currentColor;
  fill-opacity: 0.4;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 9px;
  text-anchor: middle;
  pointer-events: none;
  text-transform: capitalize;
}

/* XY Pad — a 2D value control: a header label over a fluid landscape surface that
   fills the container width (height from the inline \`height\`, not forced square).
   The live values render inside the pad (X along the bottom, Y up the left). The
   grid stays faintly visible at rest and strengthens on data-active (hover / focus
   / drag); the crosshair guides stay hidden at rest and reveal on data-active,
   matching the kit's "affordance on interaction" pattern. */
.dialkit-xy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.dialkit-xy-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.dialkit-xy-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
}

.dialkit-xy-area {
  position: relative;
  /* Height comes from the inline \`height\`; width is fluid so the pad fills its
     container (landscape, not forced square). \`align-self: stretch\` keeps a flex
     parent from shrinking it below full width. */
  width: 100%;
  align-self: stretch;
  min-height: 80px;
  border-radius: var(--dial-radius);
  background: var(--dial-surface);
  border: 1px solid var(--dial-border);
  cursor: crosshair;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  overflow: hidden;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.dialkit-xy-area[data-active="true"] {
  border-color: var(--dial-border-hover);
  background: var(--dial-surface-hover);
}

.dialkit-xy-area:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--dial-text-focus);
}

/* Grid: even subdivisions via repeating gradients, at the curve-grid opacity so
   it themes for free (light/dark) off currentColor. */
.dialkit-xy-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.05;
  transition: opacity 0.15s ease;
  background-image:
    repeating-linear-gradient(to right, currentColor 0, currentColor 1px, transparent 1px, transparent var(--dial-xy-grid-step-x, 20%)),
    repeating-linear-gradient(to bottom, currentColor 0, currentColor 1px, transparent 1px, transparent var(--dial-xy-grid-step-y, 20%));
  color: var(--dial-text-root);
  mix-blend-mode: normal;
}

.dialkit-xy-area[data-active="true"] .dialkit-xy-grid {
  opacity: 0.1;
}

/* Live axis labels inside the pad: X centered along the bottom, Y up the left
   edge (vertical, reading bottom-to-top). Decorative (aria-hidden) — the pad's
   aria-valuetext remains the accessible source of truth. They brighten on
   interaction, matching the kit's readout pattern. */
.dialkit-xy-axis {
  position: absolute;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--dial-text-label);
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
  font-variant-numeric: tabular-nums;
}

.dialkit-xy-axis-x {
  left: 0;
  right: 0;
  bottom: 6px;
  text-align: center;
}

.dialkit-xy-axis-y {
  left: 6px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.dialkit-xy-area[data-active="true"] .dialkit-xy-axis {
  color: var(--dial-text-focus);
}

/* Crosshair guides from the thumb to the axes. Position eases with the thumb
   (keyboard / return); the reveal is opacity, gated by data-active. */
.dialkit-xy-guide {
  position: absolute;
  background: currentColor;
  color: var(--dial-text-root);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, left 0.12s ease, top 0.12s ease;
}

.dialkit-xy-guide-v {
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-0.5px);
}

.dialkit-xy-guide-h {
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-0.5px);
}

.dialkit-xy-area[data-active="true"] .dialkit-xy-guide {
  opacity: 0.15;
}

/* Thumb — derived from .dialkit-color-sv-thumb (12px, 2px white ring, layered
   shadow). Neutral fill via --dial-text-primary (same token as the slider
   handle) so it themes with the kit instead of baking in a brand hue.
   Positioned by left/top; those transition for keyboard nudges and the joystick
   return, and the transition is cut during drag so pointer tracking is instant. */
.dialkit-xy-thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: var(--dial-text-primary);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35), 0 1px 4px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-sizing: border-box;
  transition: left 0.12s ease, top 0.12s ease;
}

.dialkit-xy-area[data-dragging="true"] .dialkit-xy-thumb,
.dialkit-xy-area[data-dragging="true"] .dialkit-xy-guide {
  transition: opacity 0.15s ease;
}

.dialkit-xy[data-disabled="true"] .dialkit-xy-area,
.dialkit-xy-area[data-disabled="true"] {
  opacity: 0.4;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .dialkit-xy-area,
  .dialkit-xy-grid,
  .dialkit-xy-guide,
  .dialkit-xy-thumb {
    transition: none;
  }
}

.dialkit-timeline-toolbar-toggle[data-active] {
  background: var(--dial-surface-active);
  color: var(--dial-text-root);
}

.dialkit-timeline-toolkit-only {
  height: var(--dial-row-height);
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: var(--dial-radius);
  background: var(--dial-surface-subtle);
  color: var(--dial-text-secondary);
  font-size: 12px;
}

/* ── Timeline dock ── */
.dialkit-timeline {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 9998;
}

.dialkit-timeline[hidden] {
  display: none;
}

.dialkit-timeline-dock {
  position: relative;
  box-sizing: border-box;
  background: var(--dial-glass-bg);
  border: 1px solid var(--dial-border);
  border-radius: 14px;
  backdrop-filter: blur(var(--dial-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--dial-backdrop-blur));
  padding: 0 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--dial-text-tertiary) transparent;
}

.dialkit-timeline-resize-handle {
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  z-index: 9;
  height: 10px;
  cursor: ns-resize;
  touch-action: none;
}

.dialkit-timeline-dock::-webkit-scrollbar {
  width: 8px;
}

.dialkit-timeline-dock::-webkit-scrollbar-track {
  background: transparent;
}

.dialkit-timeline-dock::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--dial-text-tertiary);
}

.dialkit-timeline-section {
  --dial-timeline-label-w: 96px;
  --dial-timeline-actions-w: 284px;
  --dial-timeline-header-h: calc(var(--dial-row-height) + 4px);
}

.dialkit-timeline-section + .dialkit-timeline-section {
  border-top: 1px solid var(--dial-border);
  padding-top: 10px;
}

.dialkit-timeline-header {
  display: grid;
  grid-template-columns: auto minmax(100px, 1fr) auto;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 7;
  box-sizing: border-box;
  height: var(--dial-timeline-header-h);
  padding: 4px 0 0;
  margin: 0;
  background: var(--dial-glass-bg);
  backdrop-filter: blur(var(--dial-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--dial-backdrop-blur));
}

.dialkit-timeline-header[data-open] {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
}

.dialkit-timeline-header:not([data-open]) {
  grid-template-columns: var(--dial-timeline-label-w) minmax(0, 1fr) auto;
  gap: 0;
}

.dialkit-timeline-header:not([data-open]) .dialkit-timeline-identity {
  width: var(--dial-timeline-label-w);
  box-sizing: border-box;
  padding-right: 10px;
  overflow: hidden;
}

.dialkit-timeline-header:not([data-open]) .dialkit-timeline-title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialkit-timeline-header:not([data-open]) .dialkit-timeline-overview {
  margin-right: 12px;
}

.dialkit-timeline-identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialkit-timeline-title {
  display: block;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--dial-text-root);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.dialkit-timeline-header[data-open] .dialkit-timeline-identity {
  width: 100%;
  overflow: hidden;
}

.dialkit-timeline-header[data-open] .dialkit-timeline-title {
  display: inline-block;
  flex: 0 1 auto;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialkit-timeline-time {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 13px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--dial-text-label);
  white-space: nowrap;
}

.dialkit-timeline-overview {
  position: relative;
  min-width: 60px;
  height: 12px;
  border-radius: 999px;
  background: var(--dial-surface-subtle);
  overflow: hidden;
  cursor: col-resize;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.dialkit-timeline-overview-viewport {
  position: absolute;
  inset-block: 0;
  border-radius: inherit;
  pointer-events: none;
}

.dialkit-timeline-overview-viewport[data-zoomed] {
  background: color-mix(in srgb, var(--dial-text-tertiary) 18%, transparent);
  box-shadow: inset 0 0 0 1px var(--dial-border);
}

.dialkit-timeline-overview-progress {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 999px 0 0 999px;
  background: var(--dial-text-tertiary);
  opacity: 0.35;
  pointer-events: none;
}

.dialkit-timeline-overview-playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  border-radius: 2px;
  background: var(--dial-text-root);
  transform: translateX(-1px);
  pointer-events: none;
}

.dialkit-timeline-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dialkit-timeline-header[data-open] .dialkit-timeline-actions {
  width: auto;
  box-sizing: border-box;
  justify-content: flex-end;
  padding-left: 0;
}

.dialkit-timeline-actions .dialkit-preset-manager {
  flex: 0 0 120px;
  width: 120px;
}

.dialkit-timeline-chevron {
  background: none;
  border: none;
  width: 20px;
  height: var(--dial-row-height);
  padding: 2px;
  cursor: pointer;
  color: var(--dial-text-label);
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
}

.dialkit-timeline-chevron:hover {
  opacity: 1;
}

.dialkit-timeline-chevron svg {
  width: 16px;
  height: 16px;
  transition: transform 0.18s ease;
}

.dialkit-timeline-chevron[data-open="true"] svg {
  transform: rotate(180deg);
}

.dialkit-timeline-body {
  margin-top: 0;
  overflow: visible;
}

.dialkit-timeline-scroll-row {
  position: sticky;
  bottom: -10px;
  z-index: 6;
  display: grid;
  grid-template-columns: var(--dial-timeline-label-w) minmax(0, 1fr);
  margin-top: 6px;
  margin-bottom: -10px;
  padding: 4px 0 10px;
  background: var(--dial-glass-bg);
  backdrop-filter: blur(var(--dial-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--dial-backdrop-blur));
}

.dialkit-timeline-horizontal-scroll {
  min-width: 0;
  height: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--dial-text-tertiary) transparent;
  overscroll-behavior-x: contain;
}

.dialkit-timeline-horizontal-scroll > div {
  height: 1px;
}

.dialkit-timeline-horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.dialkit-timeline-horizontal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.dialkit-timeline-horizontal-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--dial-text-tertiary);
}

.dialkit-timeline-grid {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialkit-timeline-row {
  display: grid;
  grid-template-columns: var(--dial-timeline-label-w) minmax(0, 1fr);
  align-items: stretch;
}

.dialkit-timeline-label {
  flex: 0 0 var(--dial-timeline-label-w);
  box-sizing: border-box; /* indent padding must not widen the column — every lane starts at the same x */
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--dial-text-label);
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
}

.dialkit-timeline-ruler {
  position: relative;
  min-width: 0;
  height: 28px;
  cursor: col-resize;
  touch-action: none;
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
  z-index: 5;
}

.dialkit-timeline-ruler-row {
  position: sticky;
  top: var(--dial-timeline-header-h);
  z-index: 6;
  height: 28px;
  background: var(--dial-glass-bg);
  backdrop-filter: blur(var(--dial-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--dial-backdrop-blur));
}

.dialkit-timeline-tick {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 100%;
  background: var(--dial-text-tertiary);
  transform: translateY(-50%);
  pointer-events: none;
}

.dialkit-timeline-tick-medium {
  height: 16px;
  background: var(--dial-border-hover);
}

.dialkit-timeline-tick-fine {
  height: 8px;
  background: var(--dial-border);
}

.dialkit-timeline-tick-label {
  position: absolute;
  top: 50%;
  left: 4px;
  display: flex;
  align-items: center;
  height: 18px;
  transform: translateY(-50%);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 9.5px;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
  color: var(--dial-text-tertiary);
  white-space: nowrap;
}

.dialkit-timeline-row {
  height: 28px;
}

/* ── Layer groups ── */

.dialkit-timeline-group-row {
  height: 22px;
}

.dialkit-timeline-group-row .dialkit-timeline-label {
  gap: 4px;
  font-weight: 600;
  color: var(--dial-text-root);
}

.dialkit-timeline-group-row .dialkit-timeline-lane {
  background: none;
}

.dialkit-timeline-group-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin-left: -2px;
  cursor: pointer;
  color: var(--dial-text-tertiary);
}

.dialkit-timeline-group-toggle svg {
  width: 10px;
  height: 10px;
  transform: rotate(-90deg);
  transition: transform 0.15s ease;
}

.dialkit-timeline-group-toggle[data-open="true"] svg {
  transform: rotate(0deg);
}

.dialkit-timeline-row[data-grouped] .dialkit-timeline-label {
  padding-left: 14px;
}

.dialkit-timeline-lane {
  position: relative;
  flex: 1;
  background: var(--dial-surface-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.dialkit-timeline-clip {
  position: absolute;
  top: 3px;
  bottom: 3px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 9px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 1;
  box-shadow: inset 0 0 0 999px var(--dial-timeline-clip-overlay);
}

.dialkit-timeline-clip-ghost {
  position: absolute;
  top: 4px;
  bottom: 4px;
  display: flex;
  border-radius: 5px;
  box-sizing: border-box;
  overflow: hidden;
  opacity: 0.18;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.dialkit-timeline-clip-ghost-segment {
  height: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
}

.dialkit-timeline-clip-ghost-segment + .dialkit-timeline-clip-ghost-segment {
  box-shadow: inset 1px 0 0 rgba(0, 0, 0, 0.5);
}

.dialkit-timeline-loop-infinity {
  position: absolute;
  top: 50%;
  right: 7px;
  z-index: 2;
  color: var(--dial-text-tertiary);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(-50%);
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.dialkit-timeline-clip[data-dragging] {
  cursor: grabbing;
}

.dialkit-timeline-clip[data-selected] {
  box-shadow:
    0 0 0 2px var(--dial-text-root),
    inset 0 0 0 999px var(--dial-timeline-clip-overlay);
}

.dialkit-timeline-clip-duration {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 9.5px;
  font-variant-numeric: tabular-nums;
  color: rgba(0, 0, 0, 0.55);
  white-space: nowrap;
  pointer-events: none;
}

/* ── Sequence segments ──
   A steps clip is one bar sliced into legs; boundaries between legs are
   drag handles that retime the leg to their left. */

.dialkit-timeline-clip[data-steps] {
  padding: 0;
  justify-content: flex-start;
}

.dialkit-timeline-clip-segment {
  position: relative;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.dialkit-timeline-clip-segment + .dialkit-timeline-clip-segment {
  box-shadow: inset 1.5px 0 0 rgba(0, 0, 0, 0.25);
}

.dialkit-timeline-clip-segment:hover {
  background: rgba(0, 0, 0, 0.06);
}

.dialkit-timeline-clip-segment[data-selected] {
  background: rgba(0, 0, 0, 0.12);
}

/* ── Property tracks ──
   A props clip's row is a read-only composite — click to expand. Each
   property expands into a full track row: a complete clip bar whose
   position is the track's delay. */

.dialkit-timeline-clip[data-composite] {
  cursor: pointer;
}

.dialkit-timeline-track-row .dialkit-timeline-label {
  font-size: 13px;
  color: var(--dial-text-tertiary);
  padding-left: 26px;
}

.dialkit-timeline-track-row[data-grouped] .dialkit-timeline-label {
  padding-left: 32px;
}

.dialkit-timeline-clip-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
}

.dialkit-timeline-clip-handle[data-edge="start"] {
  left: 0;
}

.dialkit-timeline-clip-handle[data-edge="end"] {
  right: 0;
}

.dialkit-timeline-playhead-control {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12px;
  margin-left: -6px;
  cursor: ew-resize;
  touch-action: none;
}

.dialkit-timeline-playhead-anchor {
  position: sticky;
  top: calc(var(--dial-timeline-header-h) + 14px);
  z-index: 8;
  width: 0;
  height: 0;
  margin-left: 6px;
}

.dialkit-timeline-playhead-anchor::before {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  width: 2px;
  height: 15px;
  background: var(--dial-text-root);
  pointer-events: none;
}

.dialkit-timeline-playhead-flag {
  position: absolute;
  top: 0;
  left: calc(var(--dial-timeline-playhead-flag-offset, 0px) - 26px);
  z-index: 1;
  width: 52px;
  height: 18px;
  padding: 0 7px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 6px;
  background: #f3f3f3;
  color: #414141;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 9.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
  transform: translateY(-50%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.28);
  transition: top 0.12s ease;
}

.dialkit-timeline-playhead-stem {
  position: absolute;
  top: 27px;
  bottom: 0;
  left: 5px;
  z-index: 5;
  width: 2px;
  background: var(--dial-text-root);
  pointer-events: none;
}

/* ── Timeline clip popover ── */
.dialkit-timeline-popover {
  position: fixed;
  z-index: 10000;
  background: var(--dial-glass-bg);
  border: 1px solid var(--dial-border);
  border-radius: 14px;
  backdrop-filter: blur(var(--dial-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--dial-backdrop-blur));
  box-shadow: var(--dial-shadow);
  padding: 10px 12px;
  box-sizing: border-box;
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.dialkit-timeline-popover::-webkit-scrollbar {
  display: none;
}

.dialkit-timeline-popover-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 8px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--dial-border);
}

.dialkit-timeline-popover-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--dial-text-root);
  letter-spacing: -0.01em;
}

.dialkit-timeline-popover-close {
  width: 24px;
  height: 24px;
  margin-left: auto;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: none;
  color: var(--dial-text-tertiary);
  cursor: pointer;
}

.dialkit-timeline-popover-close:hover {
  color: var(--dial-text-root);
  background: var(--dial-surface-hover);
}

.dialkit-timeline-popover-close svg {
  width: 14px;
  height: 14px;
}

.dialkit-timeline-popover-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialkit-timeline-popover-body > .dialkit-folder:first-child {
  margin-top: 0;
  border-top: none;
}

@media (max-width: 720px) {
  .dialkit-timeline-dock {
    padding: 0 10px 10px;
  }

  .dialkit-timeline-header {
    grid-template-columns: auto minmax(40px, 1fr) auto;
    gap: 8px;
  }

  .dialkit-timeline-section {
    --dial-timeline-label-w: 76px;
    --dial-timeline-actions-w: 270px;
  }

  .dialkit-timeline-identity {
    overflow: hidden;
    gap: 7px;
  }

  .dialkit-timeline-title {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dialkit-timeline-time {
    font-size: 11px;
  }

  .dialkit-timeline-overview {
    height: 12px;
  }

  .dialkit-timeline-actions {
    min-width: 0;
  }

  .dialkit-timeline-actions .dialkit-preset-manager {
    flex-basis: 100px;
    width: 100px;
  }

  .dialkit-timeline-chevron {
    width: 26px;
    height: 28px;
    justify-content: center;
    padding: 0;
  }

  .dialkit-timeline-grid {
    min-width: 0;
  }
}

/* ── Timeline loop region ── */
.dialkit-timeline-loop-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--dial-row-height);
  height: var(--dial-row-height);
  padding: 0;
  flex-shrink: 0;
  background: var(--dial-surface);
  border: none;
  border-radius: var(--dial-radius);
  cursor: pointer;
  color: var(--dial-text-label);
  transition: background 0.15s, color 0.15s, opacity 0.15s;
}

.dialkit-timeline-loop-toggle:hover:not(:disabled) {
  background: var(--dial-surface-hover);
}

.dialkit-timeline-loop-toggle:disabled {
  cursor: default;
  opacity: 0.5;
}

.dialkit-timeline-loop-toggle[data-active] {
  background: var(--dial-timeline-loop-bg);
  color: var(--dial-timeline-loop-border);
  opacity: 1;
}

.dialkit-timeline-loop-toggle svg {
  width: 16px;
  height: 16px;
  display: block;
}

/* Highlighted region band + dimmed surroundings on the ruler. Rendered before
   the ticks so tick labels stay legible on top. */
.dialkit-timeline-loop-band {
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--dial-timeline-loop-bg);
  border-left: 1.5px solid var(--dial-timeline-loop-border);
  border-right: 1.5px solid var(--dial-timeline-loop-border);
  box-sizing: border-box;
  pointer-events: none;
}

.dialkit-timeline-loop-band[data-live] {
  opacity: 0.85;
}

.dialkit-timeline-loop-dim {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.16);
  pointer-events: none;
}
`;
