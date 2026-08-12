---
name: dialkit-integration
description: >-
  Guide for integrating the dialkit control set into an application UI and
  evolving that UI toward dialkit's design system. Use this whenever a task
  involves dialkit in a consuming app: wiring app parameters to dialkit
  controls, replacing a prototype or debug UI with dialkit panels, building a
  parameter sidebar / control surface with dialkit, choosing which dialkit
  component fits a parameter, or restyling an app to match the dialkit look.
  Load it BEFORE designing the layout or writing any integration code — the
  biggest mistakes (wrong component choice, flat ungrouped panels, rebuilding
  components that already exist) happen in the first ten minutes.
---

# Integrating dialkit into an app

dialkit is not just a tweak-panel library — it is a design system for
parameter-driven interfaces. Integrating it well means two things at once:
every app parameter lands on the *right* dialkit control, and the app's
overall design converges on dialkit's visual language rather than fighting it.

Work through the four phases in order. The first two produce no code; skipping
them is how integrations go wrong.

## Phase 1 — Inventory what this dialkit actually has

dialkit evolves fast and forks/branches differ widely: `main` may export only
the core controls (slider, toggle, text, color, select, spring, action,
folder), while feature branches carry a much larger set (waveform, analyser,
curve composer, XY pad, range slider, timeline, gradient editor, modules,
lists, chips, file/gallery controls, hints, labels, shortcuts, affordances,
inline mode). Never design against the README from memory or from another
version.

Do this first, in the installed/linked package:

1. Read `src/index.ts` (or `dist/index.d.ts`) — the export list is the ground
   truth of what exists.
2. Read the README of that same version for the config syntax of each control
   type.
3. For visual components that the README does not document (often the newer
   ones: `WaveformVisualization`, `AnalyserVisualization`, `CurveComposer`,
   `XYPad`, `DialTimeline`), read the component source's prop types — they are
   fully typed and self-describing.

Produce a short written inventory: control types available, standalone visual
components available, and panel features available (hints, labels, shortcuts,
disabled state, dynamic configs, inline mode, presets).

## Phase 2 — Map the app's control surface

Before touching layout, enumerate everything the app must expose:

- every parameter: type, unit, range, step, default, and whether it is
  bipolar (pan, detune, envelope amount — anything meaningfully centered on a
  value like 0)
- which parameters belong together conceptually (an engine section, an effect,
  an envelope) — groups should follow the app's mental model, not the order
  parameters happen to appear in code
- which groups can be switched off entirely (an effect with a bypass, an
  optional feature) — these have on/off state *as a group*
- the app's domain artifacts: things that are not parameters but objects the
  user looks at and manipulates — a loaded sample, a curve, a spectrum, a
  timeline, an envelope shape

Then write the mapping: each parameter or artifact → one dialkit control or
component from the Phase 1 inventory. Use this table as the default mapping,
adjusted to what the inventory actually contains:

| App concept | dialkit fit |
|---|---|
| Continuous number | Slider `[default, min, max, step]` — always give an explicit range and a sensible step; never rely on auto-inference for real app parameters |
| Bipolar number (pan, detune, ± amount) | Slider with `bipolar` / `origin` so the fill grows from center |
| Windowed range (start/end, low/high) | RangeSlider |
| On/off | Toggle — but see Module below when the toggle governs a whole group |
| One-of-N mode | Select (or SegmentedControl for 2–4 options that deserve to be always visible) |
| Two coupled numbers (position, tilt, vector) | XYPad |
| Any curve or shape parameter (easing, envelope, transfer curve, probability distribution) | CurveComposer / EasingVisualization / SpringVisualization — the visual editor, never a row of numeric sliders |
| Animation feel | Spring control (visual editor) |
| Color / gradient | Color control (with `palette` where reuse matters) / Gradient control |
| Audio or signal level | AudioLevelMeter / AnalyserVisualization |
| Loaded sample or buffer | WaveformVisualization — interactive, in the main pane |
| Ordered variable-length collection (layers, effects chain, voices) | List control with item types |
| One-shot commands (reset, randomize, load) | Action buttons |

Only after the mapping is complete, look at what's left over. A leftover means
either a missing dialkit component (build it *in dialkit's idiom*, or flag it)
or an app concept that should be redesigned to fit the system.

### The fork every integration hits: config-driven panel vs standalone components

dialkit can be consumed two ways: the declarative `useDialKit` config +
`DialRoot`, or hand-composing the exported standalone components. When the
app already owns its state (its own store, engine bridge, or preset system),
composing standalone components looks attractive because it avoids a second
store. Resist that reasoning for the main control surface. The config-driven
panel is where dialkit's compounding features live — hints, labels,
shortcuts, dynamic-config reconciliation, value persistence, copy-as-JSON —
and a hand-built rack forfeits all of them and drifts stylistically over
time. Instead, *bridge*: keep the app's state as the single source of truth,
diff the panel's returned values into it, and push app-side changes back with
`DialStore.updateValue(s)`. Suppress or ignore dialkit subsystems the app
genuinely supersedes (e.g. its localStorage presets when the app has real
preset storage) rather than abandoning the panel to avoid them. Standalone
components are for the *center pane* (visualizations, meters, editors) and
for the rare control that must live outside the panel.

## Phase 3 — Layout doctrine

**All controls live in the side panel.** Mount `DialRoot mode="inline"` inside
a fixed-width sidebar (~300px, full height, `overflow: hidden`). The floating
popover mode is for tweaking during development, not for a real app surface.
Don't scatter individual controls across the app: one panel, one place to
look, one consistent interaction grammar.

**The center pane is for domain artifacts, not controls.** Whatever the user
*works on* — the loaded sample as an interactive waveform, the anatomy or
signal-flow diagram below it, analysers, timelines — renders large in the
main pane using dialkit's visual components. The rule of thumb: the side panel
answers "what are the settings", the center pane answers "what is the thing
and what is it doing". A number that has a visual form should be *seen*, not
read.

**Group by meaning, in the user's vocabulary.** Use folders for related
parameters, named after the app's own concepts (Grain Engine, Filter,
Output — not "Params 1"). Order groups by importance: what the user touches
constantly at top, setup/rare at bottom, secondary groups `_collapsed: true`.
Within a group, the primary parameter comes first and stays visible.

**A feature that is off shows no controls.** This is the strongest rule:

- If a whole block turns on/off as a unit, make it a **module folder**: give
  the folder `_enabled: boolean` in the config and its header carries the
  switch itself — the body collapses away when off, so disabled features cost
  zero space and zero attention. Never add a separate "Enabled" toggle row
  inside a group; the switch belongs in the header. (The standalone `Module`
  component is the same idiom for hand-composed center-pane UI.)
- If control *visibility* depends on a mode (e.g. a `mode` select that changes
  which parameters exist), use dynamic configs: rebuild the config object from
  app state and let dialkit reconcile — values on surviving paths persist.
- Reserve greyed-out (`DialStore.setDisabled`) for the narrow case where the
  feature is on but a control is momentarily inapplicable, and the user
  benefits from seeing that it exists. Hidden beats disabled in almost every
  other case: a wall of grey controls reads as broken, not as off.

## Phase 4 — Converge the app on dialkit's design language

Evolve the app toward dialkit, never restyle dialkit toward the app. dialkit
is integrated into PoCs and prototypes — apps whose existing styling was
never a considered design decision, just whatever colors and chrome the
prototype accumulated while the real work was the engine underneath. That
styling is not a brand and deserves no loyalty: do not preserve the
prototype's accent color, palette, or visual quirks "for identity". Replace
them wholesale. The panel's theme is the design anchor for the whole window:

- Reuse the `--dial-*` custom properties (surfaces, borders, text hierarchy,
  radius, row height, shadows) for app-owned chrome — the center pane, status
  bars, headers — so panel and stage read as one instrument, not a panel
  bolted onto a foreign app.
- Match the text hierarchy: root title / section title / label are three
  deliberate levels; don't invent a fourth.
- Numeric readouts anywhere in the app use the same monospace treatment as
  panel values.
- Dark glassmorphic surfaces, 1px low-alpha borders, ~8px radius: custom
  canvases (waveforms, diagrams) drawn in the center pane should sample the
  same palette so they look native to the set.

## Refinement pass (do this once it works)

- **Hints** on every parameter whose effect isn't obvious from its name — one
  line, about the *effect*, not the implementation.
- **Labels** to give mode-dependent or shorthand params proper display names
  without changing their identity keys.
- **Shortcuts** on the three-to-five most-tweaked parameters.
- Verify every slider's **step and range** against the domain (a 0–1 mix
  wants 0.01; a Hz value wants log-ish sensible bounds, not 0–20000 linear
  by default).
- Wire **presets** so the whole surface snapshots meaningfully.

## Anti-patterns to catch in review

- A curve, envelope, or easing edited through bare numeric sliders while a
  curve component exists in the inventory.
- Controls rendered outside the side panel, or a second ad-hoc panel.
- Visible-but-inert controls for a feature that is switched off.
- An "Enabled" toggle row inside a group instead of a `_enabled` module-folder
  header switch.
- A flat panel of 20+ ungrouped rows.
- Auto-inferred slider ranges on real app parameters.
- App chrome styled with its own colors/radii instead of `--dial-*` tokens,
  or a prototype accent color kept alive "for brand identity".
- A hand-rolled component duplicating something the installed dialkit exports.
