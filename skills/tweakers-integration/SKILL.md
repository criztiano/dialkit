---
name: tweakers-integration
description: >-
  Guide for integrating the tweakers control set into an application UI and
  evolving that UI toward tweakers's design system. Use this whenever a task
  involves tweakers in a consuming app: wiring app parameters to tweakers
  controls, replacing a prototype or debug UI with tweakers panels, building a
  parameter sidebar / control surface with tweakers, choosing which tweakers
  component fits a parameter, or restyling an app to match the tweakers look.
  Load it BEFORE designing the layout or writing any integration code — the
  biggest mistakes (wrong component choice, flat ungrouped panels, rebuilding
  components that already exist) happen in the first ten minutes.
---

# Integrating tweakers into an app

Read the [current guidebook](../../docs/README.md) first. For Move apps, its
[Move integration standards](../../docs/integration.md) and
[design language](../../docs/design-language.md) supersede the sidebar-specific
layout guidance below. Use the bottom `MovePanel` as the main Move surface;
`TweakRoot mode="inline"` remains the general-panel option. Inspect the
[control dictionary](../../docs/controls.md) before creating a custom component.
Reusable slot bodies belong upstream, never in a consumer vendor directory.


tweakers is not just a tweak-panel library — it is a design system for
parameter-driven interfaces. Integrating it well means two things at once:
every app parameter lands on the *right* tweakers control, and the app's
overall design converges on tweakers's visual language rather than fighting it.

Work through the four phases in order. The first two produce no code; skipping
them is how integrations go wrong.

## Phase 1 — Inventory what this tweakers actually has

tweakers evolves fast and forks/branches differ widely: `main` may export only
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
   `XYPad`, `TweakTimeline`), read the component source's prop types — they are
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

Then write the mapping: each parameter or artifact → one tweakers control or
component from the Phase 1 inventory. Use this table as the default mapping,
adjusted to what the inventory actually contains:

| App concept | tweakers fit |
|---|---|
| Continuous number | Slider `[default, min, max, step]` — always give an explicit range and a sensible step; never rely on auto-inference for real app parameters |
| Bipolar number (pan, detune, ± amount) | Slider with `bipolar` / `origin` so the fill grows from center |
| Windowed range (start/end, low/high) | RangeSlider |
| On/off | Toggle (a checkbox, not a two-tab switch) — but see Module below when the toggle governs a whole group |
| One-of-N mode | Select (or SegmentedControl for 2–4 options that deserve to be always visible) |
| Two coupled numbers (position, tilt, vector) | XYPad — only when the two axes are one physical gesture in the user's head (a point, a direction). Two parameters that merely both affect the same curve are NOT a pair; give them their own sliders and show the curve instead |
| Any curve or shape parameter (easing, envelope, transfer curve, probability distribution) | CurveComposer / EasingVisualization / SpringVisualization — the visual editor, never a row of numeric sliders |
| Parameters that *indirectly* shape a curve (a shape enum plus width/offset/amount modifiers) | Keep the individual controls, and add a live curve-preview row sampling the resulting curve — the user must SEE what the combination produces |
| Animation feel | Spring control (visual editor) |
| Color / gradient | Color control (with `palette` where reuse matters) / Gradient control |
| Audio or signal level | AudioLevelMeter / AnalyserVisualization |
| Loaded sample or buffer | WaveformVisualization — interactive, in the main pane |
| Ordered variable-length collection (layers, effects chain, voices) | List control with item types |
| One-shot commands (reset, randomize, load) | Action buttons |

Only after the mapping is complete, look at what's left over. A leftover means
either a missing tweakers component (build it *in tweakers's idiom*, or flag it)
or an app concept that should be redesigned to fit the system.

### The fork every integration hits: config-driven panel vs standalone components

tweakers can be consumed two ways: the declarative `useTweakers` config +
`TweakRoot`, or hand-composing the exported standalone components. When the
app already owns its state (its own store, engine bridge, or preset system),
composing standalone components looks attractive because it avoids a second
store. Resist that reasoning for the main control surface. The config-driven
panel is where tweakers's compounding features live — hints, labels,
shortcuts, dynamic-config reconciliation, value persistence, copy-as-JSON —
and a hand-built rack forfeits all of them and drifts stylistically over
time. Instead, *bridge*: keep the app's state as the single source of truth,
diff the panel's returned values into it, and push app-side changes back with
`TweakStore.updateValue(s)`. When the app has its own preset storage, back
the panel toolbar's stock preset UI (top dropdown + quick-add) with a
preset *provider* (`options.presets`) — never hide the toolbar and rebuild
presets as a folder of select/action rows; presets belong at the top of the
panel in tweakers's own chrome. Standalone components are for the *center
pane* (visualizations, meters, editors) and for the rare control that must
live outside the panel.

## Phase 3 — Layout doctrine

**All controls live in panels.** Mount `TweakRoot mode="inline"` inside a
fixed-width sidebar (~300px, full height, `overflow: hidden`). The inline panel
keeps tweakers's card chrome — panel ground, cards, token-defined corners — so give the
sidebar container a little padding (~12px) and let the card float on the app
ground. The floating popover mode is for tweaking during development, not for a
real app surface. Don't scatter individual controls across the app: every
control belongs to a panel, and every panel is a place to look with one
consistent interaction grammar.

One panel is the default and the right answer for most apps. An app whose
domain is genuinely a *rack* — parallel voices, stages, channels the user
compares side by side — may give each one its own panel and place them across
the main pane. Two props make that work, and neither is for single-surface
apps:

- `TweakRoot panels={name | [names]}` draws only the panels it names, in the
  order named, so four panels can stand in four places without two roots
  fighting over the registry.
- `presets: false` in `useTweakers` options leaves a panel's header bare of the
  preset toolbar. A snapshot means the whole instrument, so the toolbar belongs
  to one panel — the rack's columns don't each get one.

Strip the card (`TweakRoot chrome="none"`) only when the host already owns the
ground the rows sit on — a rack laid out on the app body, where a card per
column would read as a second, competing frame. A panel floating on foreign app
ground keeps its chrome.

**The center pane is for domain artifacts, not controls.** Whatever the user
*works on* — the loaded sample as an interactive waveform, the anatomy or
signal-flow diagram below it, analysers, timelines — renders large in the
main pane using tweakers's visual components. The rule of thumb: the side panel
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
  `_enabled` at the **root** of a config does the same one level up: the whole
  panel is a module, and its title carries the switch — for a rack whose
  columns are each optional.
- If control *visibility* depends on a mode (e.g. a `mode` select that changes
  which parameters exist), use dynamic configs: rebuild the config object from
  app state and let tweakers reconcile — values on surviving paths persist.
- Reserve greyed-out (`TweakStore.setDisabled`) for the narrow case where the
  feature is on but a control is momentarily inapplicable, and the user
  benefits from seeing that it exists. Hidden beats disabled in almost every
  other case: a wall of grey controls reads as broken, not as off.

## Phase 4 — Converge the app on tweakers's design language

Evolve the app toward tweakers, never restyle tweakers toward the app. tweakers
is integrated into PoCs and prototypes — apps whose existing styling was
never a considered design decision, just whatever colors and chrome the
prototype accumulated while the real work was the engine underneath. That
styling is not a brand and deserves no loyalty: do not preserve the
prototype's accent color, palette, or visual quirks "for identity". Replace
them wholesale. The panel's theme is the design anchor for the whole window:

- Reuse the `--tweak-*` custom properties (surfaces, borders, text hierarchy,
  radius, row height, shadows) for app-owned chrome — the center pane, status
  bars, headers — so panel and stage read as one instrument, not a panel
  bolted onto a foreign app.
- Match the two typographic voices: every label and section title is uppercase
  mono (`--tweak-font-label`), every value is the reading face
  (`--tweak-font-value`) at `--tweak-value-opacity`. Labels name things, values
  report them; nothing in the app should speak in a third voice.
- Both faces are host-provided by licence: load System85 in the app, and keep
  the fallback stacks in the tokens intact.
- **No dividers, anywhere.** The set separates things with space and with the
  card each row already carries — never with a rule. If a layout looks like it
  needs a line between two things, the answer is spacing, a section, or an
  existing component. A hand-added divider is how a surface starts drifting
  away from the set.
- Dark instrument surfaces, component-owned radius tokens, uppercase mono labels against
  reading-face values: custom canvases (waveforms, diagrams) drawn in the
  center pane should sample the same palette so they look native to the set.

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
- A selectable curve shape (or its modifiers) with no drawn curve anywhere.
- An XY pad gluing together two parameters that aren't one gesture.
- Controls rendered outside the side panel, or a second ad-hoc panel.
- Visible-but-inert controls for a feature that is switched off.
- An "Enabled" toggle row inside a group instead of a `_enabled` module-folder
  header switch.
- A flat panel of 20+ ungrouped rows.
- Auto-inferred slider ranges on real app parameters.
- A hand-rolled divider, rule, or separator that no tweakers component drew.
- An "Enabled" row at the top of a panel that should have declared root
  `_enabled` and put the switch in its title.
- App chrome styled with its own colors/radii instead of `--tweak-*` tokens,
  or a prototype accent color kept alive "for brand identity".
- A hand-rolled component duplicating something the installed tweakers exports.
- Presets rebuilt as a folder of select/action rows instead of the toolbar's
  provider-backed preset UI.
