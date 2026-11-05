# Migrating apps from the old dialkit

Five apps import dialkit's components directly and place them in their own UI,
without the panel. This page lists what each app imports, and what changes at
each call site when the app moves to this kit.

Short answer: no call site changes. Every name these apps import exists here
with the same props. The only work is the dependency pin, and a look at the
app's own CSS where it targets dialkit's internal classes.

## What the apps use

| Name | Used by | Here |
| --- | --- | --- |
| `Slider` | audioground, itch, mixo-poc, spitter, dialet | Yes. `formatValue`, `origin` and `bipolar` were added for these apps. |
| `Toggle` | audioground, itch, mixo-poc, spitter | Yes, same props. |
| `SelectControl` | all five | Yes, same props. Options can still be strings or `{ value, label }`. |
| `TextControl` | audioground, itch, spitter | Yes, same props. |
| `SegmentedControl` | audioground, itch, mixo-poc, spitter, dialet | Yes. Now exported. Same props, plus optional `label` and option icons. |
| `ButtonGroup` | spitter | Yes, same props. |
| `Folder` | spitter | Yes. `title` and `defaultOpen` work as before. |
| `Module` | spitter | Yes. New here, same props (`title`, `enabled`, `onEnabledChange`, children). |
| `ModuleFolder` | none yet | Yes. A Module whose title also folds the body. |
| `CurveComposer` | dialet | Yes. New here, same props. |
| `defaultComposition`, `splitSegment`, `removeSegment`, `flipSegmentX`, `flipSegmentY`, `addDriver`, `removeDriver`, `readComposition`, `buildSamplers`, `triggersCrossed`, `triggerLevels` | dialet | Yes. Same functions, copied from the old curve-composer core. The rest of the old core exports (`flipSegment`, `cycleSegmentType`, `springify`, `DEFAULT_TRIGGER_STEPS`, the `set*` helpers and others) are exported too. |
| Types `CurveComposition`, `CurveSegment`, `CurveDriver`, `DriverDirection`, `CompositionSamplers` | dialet | Yes. Also `CurveType`, `Sampler`, `SpringifyOptions`, `CompositionRead`, `CurveComposerProps`. |

The theme still lives on `.dialkit-root`, and the stylesheet is still
`dialkit/styles.css`. Each app already wraps its controls in a `.dialkit-root`
element and imports that stylesheet, so this stays as it is.

## Per app

### audioground

Pinned to `github:criztiano/dialkit#2f42e227`.

- Imports: `SelectControl`, `Slider`, `TextControl`, `Toggle`, `SegmentedControl`.
- Props in use: `Slider` `label value min max step formatValue onChange`;
  `SelectControl` `label value options onChange`; `Toggle` `label checked onChange`;
  `TextControl` `label value onChange`; `SegmentedControl` `options value onChange`.
- Call sites: no change.
- CSS: only `.dialkit-root`. No change.

### itch

Pinned to `github:criztiano/dialkit#2f42e227`. The same files and the same use
as audioground.

- Call sites: no change.
- CSS: only `.dialkit-root`. No change.

### mixo-poc

Pinned to `github:criztiano/dialkit#2f42e227`.

- Imports: `Toggle`, `SelectControl`, `SegmentedControl`, `Slider`.
- Props in use: `Slider` `label value min max step origin formatValue onChange`;
  the others as in audioground.
- Call sites: no change.
- CSS: `src/styles.css` sets `--dial-row-height` on `.dialkit-root.dial-group`
  and styles `.dialkit-text-control` and `.dialkit-text-input`. These classes and
  the token exist here. No change.

### spitter

`github:criztiano/dialkit` without a commit; the lockfile resolves it to `2f42e227`.

- Imports: `Module`, `Folder`, `ButtonGroup`, `SegmentedControl`, `SelectControl`,
  `TextControl`, `Slider` (as `DialSlider`), `Toggle` (as `DialToggle`).
- Props in use: `Module` `title enabled onEnabledChange` with children;
  `Folder` `title defaultOpen`; `ButtonGroup` `buttons` (`{ label, onClick }`);
  `TextControl` `label value placeholder onChange`; `Slider` `label value min max
  step origin formatValue onChange`; the others as in audioground.
- Call sites: no change.
- CSS: `src/styles.css` overrides `--dial-radius` and `--dial-row-height` and
  styles `.dialkit-button-group`, `.dialkit-select-row`, `.dialkit-text-control`,
  `.dialkit-segmented` and `.dialkit-segmented-button`. These classes exist here.
  The rules on `.dialkit-action-button` match nothing, here or in the old kit;
  they can go.
- Look: `Module` keeps its Off/On switch at the right of the header, but it has
  this kit's look. There are no lines above and below each module now; the
  space between modules separates them. A nested `Folder` also has this kit's
  header and fold motion.

### dialet

`file:../dialkit`, so it uses the checkout in `~/Code/dialkit`. It used the old
`main`, where `CurveComposer` and its helpers came from the `tweakers` package.
Here they are part of dialkit, with no `tweakers` dependency.

- Imports: `CurveComposer`, the composition helpers and types in the table above,
  `SelectControl`, `Slider`, `SegmentedControl`.
- Props in use: `CurveComposer` `segments driver direction gap selectedIndex
  onSelect onSegmentsChange onDriverChange getPhase curveColor playheadColor grid
  width height`; `Slider` `label value min max step bipolar origin formatValue
  onChange`.
- Call sites: no change. `readComposition`, `triggersCrossed` and the other
  helpers give the same results; the core is a copy of the old one.
- CSS: dialet does not style composer classes. If it does later, the classes
  are `dialkit-composer-*` now (they were `tweakers-cc-*`).
- Look: when `curveColor` is not set, the curve uses the theme's primary text
  colour. When `playheadColor` is not set, the playhead and its dot use the
  curve colour.

## Behaviour that changed

These do not need code changes, but a user can see them.

- `Slider` also moves with the arrow keys and shows a `hint` when one is
  given. With `formatValue`, the `unit` is not added after
  the text (the old code comment said so, but the old code added it).
- `SegmentedControl` and `Toggle` move between options with the arrow keys.
- `CurveComposer` takes an optional `hint`.

## Moving an app

1. Change the `dialkit` pin in `package.json` to this kit's commit.
2. Install, then start the app and look at each panel in dark and light themes.
3. In spitter, remove the `.dialkit-action-button` rules if you want.
