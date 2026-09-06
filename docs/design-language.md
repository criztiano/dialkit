# Design language

The interface is an instrument: stable control locations, quiet surfaces, and
pictures that show what parameters do. The canonical tokens and component styles
live in `src/styles/theme.css`, built as `tweakers/styles.css`. Do not maintain an
app copy of these styles.

## Ground and typography

Import the kit stylesheet before app CSS and place `tweakers-root` on the app
shell so app-owned chrome inherits `--tweak-*` tokens. Tokens are class-scoped,
not global. Portalled panels own their theme; pass their `theme` explicitly.

Use `--tweak-font-label` for labels and section names, and `--tweak-font-value`
for values. Labels are uppercase mono; values use the reading face and
`--tweak-value-opacity`. System85 fonts are host-provided under the host's
license; preserve the built-in fallback stacks. Use the actual surface, text,
radius and spacing tokens rather than copying numeric values from a screenshot.
Different components have different geometry; do not impose one radius on all.

Dark display wells carry waveforms and response curves. Neutral surfaces carry
controls. Track colors identify pages; modulation colors identify assignments.
Reserve color for those meanings and for actionable state.

## Panel composition

For Move apps, use the bottom `MovePanel` as the main parameter surface. Choose
`dock="flow"` when the content and controls should form one centered group;
choose the viewport dock for a full workspace and reserve bottom space for it.
The general `TweakRoot mode="inline"` sidebar remains appropriate for non-Move
apps and controls that need the general panel. A sidebar is not mandatory for a
Move app.

Group by the app's vocabulary. Keep page and parameter identity stable across
preset changes. Align small pads to their related dial with `movePads`. A filter
occupies two columns; XY and range each occupy one two-handed column. Hidden
columns keep their original hardware indices. Do not repack them visually.

The center pane shows domain artifacts: sample, sequence, curve, or signal flow.
Use the kit's artifact components where their interaction contract fits. App
engine adapters and domain overlays can remain local.

## Interaction grammar

- Basic slots show the name at rest and the value on touch. Picture slots read
  name, picture, caption. Value-first is an existing presentation, not a new control.
- Show a curve when the user is shaping a curve. A shape enum should provide a
  live `preview`; do not replace the picture with an unexplained number.
- Use XY only when both axes form one gesture. Use a range for interval endpoints.
- Booleans use checkbox/pad state. Segmented choices represent distinct modes.
- Hide irrelevant settings using dynamic config or module folders. A bypassed
  filter may retain its dim response via `enabled: false`; this is an intentional
  specialized state, not a reason to show an entire wall of inactive controls.
- Components own their separators, focus, hover and active treatment. Add space
  or meaningful grouping instead of app-injected divider lines.
- Preserve keyboard focus, pointer cancellation, fine adjustment and readable
  long labels when extending a component. Do not convey state through color alone.

## Do / don't

| Do | Don't |
| --- | --- |
| Use public props, config and theme tokens | Patch `.tweakers-*` internals to fork a control's appearance |
| Add reusable behavior upstream | Edit `vendor/tweakers/dist` or paste kit JSX into apps |
| Keep geometry aligned with hardware | Resize or reorder individual slots independently |
| Give numbers domain ranges, units and formatters | Use auto-inferred bounds for production parameters |
| Keep presets and engine operations app-owned | Bake sample IDs or engine commands into kit components |
| Use the existing panel/preset chrome where applicable | Rebuild a second competing panel toolbar |
