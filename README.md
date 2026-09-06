# tweakers v1.2.0

Real-time parameter tweaking for React, Solid, Svelte, and Vue.

## Guidebook

Start with the [control dictionary, design language and integration standards](docs/README.md).
For new Move controls, follow the [component contribution checklist](docs/contributing-components.md).

## Credit where it's due

Tweakers began as a fork of [dialkit](https://github.com/joshpuckett/dialkit) by
[Josh Puckett](https://joshpuckett.me) — the initial inspiration, and the
foundation everything here grew from. It has since gone its own way: a different
design language, its own controls, and its own API. The debt to dialkit stands.

## Contributing

- **Open an issue first.** All pull requests should reference an existing issue. PRs without a corresponding issue will be closed.
- **Keep PRs small and focused.** Each pull request should address a single change — one bug fix, one feature, or one refactor. Avoid bundling unrelated changes together.
- **No unnecessary dependencies.** If your change can be accomplished without adding a new dependency, it should be. Any new dependency needs justification in the PR description.

## Quick Start

```bash
npm install tweakers motion
```

```tsx
// layout.tsx
import { TweakRoot } from 'tweakers';
import 'tweakers/styles.css';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <TweakRoot />
      </body>
    </html>
  );
}
```

```tsx
// component.tsx
import { useTweakers } from 'tweakers';

function Card() {
  const p = useTweakers('Card', {
    blur: [24, 0, 100],
    scale: 1.2,
    color: '#ff5500',
    visible: true,
  });

  return (
    <div style={{
      filter: `blur(${p.blur}px)`,
      transform: `scale(${p.scale})`,
      color: p.color,
      opacity: p.visible ? 1 : 0,
    }}>
      ...
    </div>
  );
}
```

---

## useTweakers

```tsx
const params = useTweakers(name, config, options?)
```

| Param | Type | Description |
|-------|------|-------------|
| `name` | `string` | Panel title displayed in the UI |
| `config` | `TweakConfig` | Parameter definitions (see Control Types below) |
| `options.onAction` | `(path: string) => void` | Callback when action buttons are clicked |
| `options.shortcuts` | `Record<string, ShortcutConfig>` | Keyboard shortcuts for controls (see [Keyboard Shortcuts](#keyboard-shortcuts)) |
| `options.hints` | `Record<string, string>` | Help text for controls (see [Hints](#hints)) |
| `options.affordances` | `Record<string, AffordanceConfig>` | Companion controls (see [Affordances](#affordances)) |
| `options.labels` | `Record<string, string>` | Display labels overriding the key-derived name (see [Labels](#labels)) |

Returns a fully typed object matching your config shape with live values. Updating a control in the UI immediately updates the returned values.

---

## Hints

Any control or folder can carry one line of help, revealed on hover or when keyboard focus lands inside it. Hints are keyed by control path — the same keying as `shortcuts` — because most controls are bare shorthand (`gravity: [9.8, 0, 20]`) with nowhere to hang a property.

```tsx
const p = useTweakers('Plasticity', {
  gravity: [9.8, 0, 20],
  physics: {
    elastic: [0.5, 0, 1],
    frozen: false,
  },
}, {
  hints: {
    gravity: 'Downward pull on every body.',
    physics: 'How bodies respond to force.',
    'physics.elastic': 'Elastic bodies bounce back; clay bodies keep their dent.',
  },
});
```

A hint replaces the config-path tooltip that leaf controls otherwise show, so only one tooltip ever appears. The tooltip is always in the DOM and wired up with `aria-describedby`, so screen readers announce it when focus enters the control.

Fields inside [list](#list) rows take hints from their item type instead, keyed by param name:

```tsx
body: {
  label: 'Body',
  schema: { mass: [1, 0, 10], frozen: false },
  hints: { mass: 'Heavier bodies resist force.' },
}
```

Two limits worth knowing: a folder header isn't focusable, so folder hints reveal on hover only; and the tooltip is positioned inside the panel's scroll container, so a hint on the very last visible row can sit below the fold until you scroll.

---

## Labels

A control's label is derived from its config key (`maxBend` → "Max Bend"). Pass `labels` to override it, keyed by control path like `hints`:

```tsx
const p = useTweakers('Motion', {
  paramA: [0.5, 0, 1],
  paramB: [0.5, 0, 1],
}, {
  labels: mode === 'flow'
    ? { paramA: 'Flow Scale', paramB: 'Flow Speed' }
    : { paramA: 'Step Size', paramB: 'Turn Rate' },
});
```

Keyed rather than declared inline for the same reason as hints: the controls that most need a label their key can't express are bare shorthand, with nowhere to hang a property.

Without this, changing a control's visible text means changing its key — and the key **is** its identity, so it would lose its current value, its persisted entry and any shortcut bound to it. An override changes only the text.

Applies to folders as well as leaf controls. An empty string is ignored rather than blanking the label, so a map built from optional data can't erase the derived name. `ActionConfig.label` still works; a keyed label wins over it.

---

## Affordances

A control can carry a companion control: an 8px dot in its bottom-right corner, barely visible until something is bound to it, opening a popover your app fills. Like hints, affordances are keyed by control path.

```tsx
const p = useTweakers('Plasticity', {
  gravity: [9.8, 0, 20],
}, {
  affordances: {
    gravity: { label: 'Bind to music', content: MusicBind },
  },
});
```

`content` is a **component**, not a node — it's captured once when the panel registers, so a pre-built node could never see current state. tweakers renders it with its own instance, so it keeps its own state and hooks. It receives the context as props:

```tsx
function MusicBind({ setStatus }: AffordanceContext) {
  const [bound, setBound] = useState(false);
  return (
    <Toggle
      label="Bound"
      checked={bound}
      onChange={(next) => { setBound(next); setStatus(next ? 'active' : 'off'); }}
    />
  );
}
```

| Field | Type | Description |
|-------|------|-------------|
| `panelId` | `string` | The panel this control belongs to. |
| `path` | `string` | The control's config path. |
| `status` | `AffordanceStatus` | The dot's current state. |
| `setStatus` | `(status) => void` | Shorthand for `TweakStore.setAffordanceStatus`. |

Affordances travel as an option rather than in the config because the config is JSON-serialized on every render to detect structure changes, and view code would not survive that.

### Status

The dot's appearance is pushed by your app — tweakers owns only how each state looks:

| Status | Dot |
|--------|-----|
| `off` | Faint grey. The default. |
| `armed` | Solid accent — something is bound. |
| `active` | Accent, gently pulsing — the binding is currently driving the value. |

```tsx
TweakStore.setAffordanceStatus(panelId, 'gravity', 'active');
```

Pushing the status it already has is dropped without notifying anything, so driving this from an audio callback costs nothing. Status is presentation, not a value: it never reaches the value map, so it isn't persisted or saved into presets.

The popover is portalled out of the panel body — which scrolls — and flips above the dot when it would otherwise run off the bottom of the viewport. It closes on Escape or a click outside, moving focus into the popover on open and back to the dot on close.

Any control type can take an affordance; sliders are the intended case, and what the dot's corner placement is designed around.

---

## Disabled controls

Any control can be greyed out and made inert at runtime:

```tsx
TweakStore.setDisabled(panelId, 'reset', true);
```

Runtime-only by design: a `disabled` flag in the config plus a runtime override would be two sources of truth for the same question, and calling this once covers the static case. Availability is app state — it changes as modes turn on and off — so it belongs where that state lives.

A disabled control greys out and stops responding to the pointer, and gets `aria-disabled`. Action buttons additionally get the native `disabled` attribute, which takes them out of the tab order. Other control types stay focusable — a known limit of greying at the wrapper rather than reaching inside every control.

A disabled control still shows its [hint](#hints) on hover, which is usually exactly when the explanation matters.

Action button labels are set in the config and are independent of the key:

```tsx
reset: { type: 'action', label: 'Reset All' }
```

---

## Control Types

### Slider

Numbers create sliders. There are three ways to define them:

**Explicit range** — `[default, min, max]`:
```tsx
blur: [24, 0, 100]
```

**Explicit range + step** — `[default, min, max, step]`:
```tsx
blur: [24, 0, 100, 5]    // snaps in increments of 5
```
When `step` is omitted, it's inferred from the range (see table below).

**Auto-inferred** — bare number:
```tsx
scale: 1.2
```
A single number auto-infers a reasonable min, max, and step:

| Value range | Inferred min/max | Step |
|-------------|-----------------|------|
| 0–1 | 0 to 1 | 0.01 |
| 0–10 | 0 to value &times; 3 | 0.1 |
| 0–100 | 0 to value &times; 3 | 1 |
| 100+ | 0 to value &times; 3 | 10 |

**Returns:** `number`

Sliders support click-to-snap (with spring animation), drag with rubber-band overflow, and direct text editing (hover the value for 800ms, then click to type).

#### Bipolar sliders (`origin` / `bipolar`)

For bipolar parameters — an envelope amount, a detune, a pan — anchor the fill at a value other than `min` so it grows out from the center in either direction:

```tsx
import { Slider } from 'tweakers';

// fill grows left for negatives, right for positives, from 0
<Slider label="Amount" value={amount} min={-1} max={1} bipolar onChange={setAmount} />

// arbitrary anchor
<Slider label="Trim" value={trim} min={-12} max={12} origin={0} onChange={setTrim} />
```

| Prop | Type | Description |
|------|------|-------------|
| `origin` | `number` | Value the fill is anchored at (default `min`). The fill spans between the origin and the handle. |
| `bipolar` | `boolean` | Convenience for `origin={0}`. |

When an origin is set, dragging gains a soft, **escapable** detent at the origin — the value sticks to it within a few pixels of travel and releases when you drag past. Omit both props and the slider is unchanged (classic left-anchored fill, no detent). These props apply to the standalone `Slider` component (advanced usage).

### Specialized Move visuals

Add `moveVisual` to an explicit slider or select to give its on-screen Move slot
a diagram that follows its value. It remains the same numeric or enum control:
presets, modulation and hardware values keep their existing shape. Labels are
never used to guess a visual.

```tsx
const p = useTweakers('Specialized', {
  opacity: {
    type: 'slider', default: 0.7, min: 0, max: 1, step: 0.01,
    moveVisual: { kind: 'opacity' },
  },
  blur: {
    type: 'slider', default: 4, min: 0, max: 24, unit: 'px',
    moveVisual: { kind: 'blur' },
  },
  pan: {
    type: 'slider', default: 0, min: -1, max: 1, bipolar: true,
    moveVisual: { kind: 'pan' },
  },
  width: {
    type: 'slider', default: 1, min: 0, max: 2, origin: 1,
    moveVisual: { kind: 'stereo-width' },
  },
  pitch: {
    type: 'slider', default: 0, min: -24, max: 24, step: 1,
    bipolar: true, unit: 'st', moveVisual: { kind: 'pitch' },
  },
  direction: {
    type: 'select', default: 'forward',
    options: ['forward', 'reverse', 'ping-pong', 'scissors'],
    moveVisual: { kind: 'playback' },
  },
});
```

| Visual | Meaning and configuration |
| --- | --- |
| `opacity` | Overlapping circles reveal transparency. `opaqueValue` defaults to `1`; set it to `100` for a percentage domain. |
| `blur` | A single filled circle softens with blur; the numeric value means CSS pixels. The readout stays sharp. |
| `pan` | Position between left/centre/right references, defaulting to `-1`, `0`, `1`. Set `left`, `center`, `right` for another domain, such as `-100`, `0`, `100`. |
| `stereo-width` | Separation around mono and unity references, defaulting to `0` and `1`. Override `mono` and `unity` for another scale. |
| `pitch` | Signed pitch ruler. `unit` defaults to `'semitones'`; use `'cents'` for fine tuning. The slider's `unit`/`formatValue` still controls its text. |
| `playback` | Bundled direction and scissors icons. Map app values using `modes`, e.g. `{ fwd: 'forward', pingPong: 'ping-pong' }`. Options retain their original stored values and labels. |

Each visual uses one column. Graphics update immediately and remain informative
without animation or hover. Unsupported or invalid visual configuration falls
back to the ordinary slot. Other framework panels continue rendering their normal
slider/select; these presentations belong to the React `MovePanel`.

Try the example app's `/specialized` page. The remaining candidates and proposed
multi-column surfaces are recorded in [the control roadmap](docs/specialized-controls-roadmap.md).

### Toggle

```tsx
enabled: true
darkMode: false
```

Booleans create an Off/On segmented control.

**Returns:** `boolean`

### Text

```tsx
title: 'Hello'                                    // auto-detected from string
subtitle: { type: 'text', default: '', placeholder: 'Enter subtitle...' }
```

Non-hex strings are auto-detected as text inputs. Use the explicit form for a placeholder or to set a default.

**Returns:** `string`

### Color

```tsx
color: '#ff5500'                           // auto-detected from hex string
bg: { type: 'color', default: '#000' }     // explicit
tint: { type: 'color', default: '#310b0299', alpha: true, palette: true }
```

Hex strings (`#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`) are auto-detected as color pickers. Each color control has a text display (click to edit the hex value) and a swatch button that opens the picker panel: a saturation/value area, hue slider, and HEX / RGB / HSL / OKLCH input formats. Whatever format you edit in, the value your code receives is always hex.

- `alpha: true` adds an alpha slider and an opacity readout on the row; values become `#rrggbbaa`. An 8-digit (or `#RGBA`) default enables it automatically.
- `palette: true` adds a row of save slots shared by every picker on the machine (persisted in `localStorage`). Click an empty slot to save the current color, a filled one to apply it, and long-press to clear it.

**Returns:** `string` (hex color)

### Gradient

```tsx
bg: { type: 'gradient' }                                    // defaults to a linear ramp
hero: {
  type: 'gradient',
  default: {
    type: 'conic',                                          // 'linear' | 'radial' | 'conic'
    angle: 45,                                              // degrees (ignored for radial)
    stops: [
      { color: '#6366f1ff', position: 0 },                 // #rrggbbaa, position 0–1
      { color: '#ec4899ff', position: 1 },
    ],
    centerX: 30, centerY: 70,                               // optional radial/conic origin, 0–100 (%)
    scale: 120,                                             // optional radial horizontal radius, 10–200 (% of box)
    squash: 40,                                             // optional radial vertical radius, 1–200 (absent = round)
    rotation: 30,                                           // optional tilt in degrees (squashed radial only)
  },
}
```

The control shows a live gradient strip; clicking it opens the editor: a linear / radial / conic switcher, a Figma-style transform pad, and a ramp of draggable color stops. On the pad you edit the gradient directly — radial has a center handle (move the origin), an axis handle (resize + rotate), and a perpendicular handle (squash into an oval); conic has a center and a direction handle; linear has a direction handle. Click an empty spot on the ramp to add a stop (seeded with the color under the cursor), drag a stop to reposition it (stops swap past each other live), and drag a stop off the strip or long-press it to remove one (minimum two). Selecting a stop opens the full color picker below it — stops always carry alpha. Drag the panel by the grip in its top-left to reposition it.

Turn the value into CSS with the exported helper:

```tsx
import { gradientToCss } from 'tweakers';

<div style={{ background: gradientToCss(p.bg) }} />
```

A CSS radial gradient can't tilt its own axis, so a rotated/squashed radial needs a transform on a clipping layer — and a rotated box exposes its corners. `gradientFillBox(value, widthPx, heightPx)` returns a ready-to-spread style for a fill layer that covers the box with no clipped corners at any rotation (for linear/conic it just matches the box):

```tsx
import { gradientFillBox } from 'tweakers';

// parent: position: relative; overflow: hidden
<div style={{ position: 'absolute', ...gradientFillBox(p.bg, width, height) }} />
```

**Returns:** `GradientValue` — `{ type, angle, stops: { color, position }[], centerX?, centerY?, scale?, squash?, rotation? }`

### Select

```tsx
layout: {
  type: 'select',
  options: ['stack', 'fan', 'grid'],
  default: 'stack',
}
```

Options can be plain strings or `{ value, label }` objects for custom display text:

```tsx
shape: {
  type: 'select',
  options: [
    { value: 'portrait', label: 'Portrait' },
    { value: 'square', label: 'Square' },
    { value: 'landscape', label: 'Landscape' },
  ],
  default: 'portrait',
}
```

If `default` is omitted, the first option is selected.

**Returns:** `string` (the selected option's value)

### Spring

```tsx
// Time-based (simple mode)
spring: { type: 'spring', visualDuration: 0.3, bounce: 0.2 }

// Physics-based (advanced mode)
spring: { type: 'spring', stiffness: 200, damping: 25, mass: 1 }
```

Creates a visual spring editor with a live animation curve preview. The editor supports two modes, toggled in the UI:

- **Time** (simple) — `visualDuration` (0.1–1s) and `bounce` (0–1). Ideal for most animations.
- **Physics** (advanced) — `stiffness` (1–1000), `damping` (1–100), and `mass` (0.1–10). Full control over spring dynamics.

The returned config object is passed directly to Motion's `transition` prop:

```tsx
const p = useTweakers('Card', {
  spring: { type: 'spring', visualDuration: 0.5, bounce: 0.04 },
  x: [0, -200, 200],
});

<motion.div animate={{ x: p.x }} transition={p.spring} />
```

**Returns:** `SpringConfig` (pass directly to Motion)

### Action

```tsx
const p = useTweakers('Controls', {
  shuffle: { type: 'action' },
  reset: { type: 'action', label: 'Reset All' },
}, {
  onAction: (path) => {
    if (path === 'shuffle') shuffleItems();
    if (path === 'reset') resetToDefaults();
  },
});
```

Action buttons trigger callbacks without storing any value. The `label` defaults to the formatted key name (camelCase becomes Title Case). Multiple adjacent actions are grouped vertically.
Action buttons can be placed at the root or nested inside folders.

Add a `caption` and the action reads as a row like any other control — the caption at the left, a compact button at the right. Use it when the button acts on something the row should name:

```tsx
sample: { type: 'action', label: 'Load', caption: slotName ?? 'No sample' },
// renders:  kick                      [ Load ]
```

### Curve (read-only preview)

A display-only row that draws an arbitrary curve your own parameters produce — for parameters that shape a curve indirectly, like a pitch arc built from a shape select plus modifier sliders:

```tsx
const p = useTweakers('Grain', {
  arcShape: { type: 'select', options: ['semicircle', 'gaussian', 'ramp'] },
  bell: [0.5, 0, 1],
  offset: { type: 'slider', default: 0, min: -1, max: 1, bipolar: true },
  arcCurve: {
    type: 'curve',
    // Safe self-reference: the panel calls `sample` after this render returns.
    sample: (t) => pitchArc(t, p.arcShape, p.bell, p.offset),
    domain: [-1, 1],   // optional fixed y-range; omit to auto-fit with headroom
    markers: [0.5],    // optional vertical reference lines at x in [0,1]
    height: 64,        // optional px, clamped 32–160 (default 64)
    label: false,      // false = full-bleed row; a string overrides the derived label
  },
});
```

`sample` is called with `t` in `[0, 1]` and returns the y value at that position. tweakers samples it (~160 points) and strokes the result on a panel surface, with a dashed baseline at `y = 0` whenever the domain spans negative values. Non-finite results (`NaN`, `±Infinity`) are skipped and simply break the stroke. `markers` draws a thin grey reference line behind the curve at each x position — they are plain data, so rebuilding the config with new positions moves the lines live; out-of-range or non-finite entries are skipped.

The row holds no value: it never appears in the returned values, presets, or persistence. Because the host closes `sample` over its own state and rebuilds the config per render, the preview redraws whenever the function identity changes — turn a modifier slider and the curve follows live. Hints and label overrides apply to the row's path like any other control.

**Returns:** nothing — the key is omitted from the resolved values.

*(React only for now; the Solid/Svelte/Vue renderers skip the row.)*

### List

A reorderable list of rows. Each row picks one of the declared `itemTypes`, and that type's `schema` becomes the row's sub-controls. Schema fields use the same shorthand as a panel config, restricted to scalars: `[default, min, max, step?]`, a bare number, a boolean, a string, or a `select` / `color` / `text` config.

```tsx
effects: {
  type: 'list',
  addLabel: 'Add effect',
  max: 8,
  itemTypes: {
    brightness: { label: 'Brightness', schema: { amount: [1, 0, 2] } },
    saturate: { label: 'Saturate', schema: { amount: [1, 0, 3] } },
  },
  default: [
    { type: 'brightness', params: { amount: 1.1 }, title: 'Lift shadows' },
    { type: 'saturate', params: { amount: 1.5 } },
  ],
}
```

Rows can be dragged to reorder and removed. When more than one item type is declared, the add button opens a type picker. An item type can also carry `hints` for its fields (see [Hints](#hints)).

Colour fields work exactly as they do at top level, including palette mode and the named-palette `swatch` control, so a row's colour looks like colour everywhere else in the app:

```tsx
schema: {
  color: { type: 'color', default: '#ff5a3c', palette: true },
  scheme: { type: 'swatch', options: PALETTES, default: 'sunset' },
}
```

#### Sections

Rows more than a few controls deep can fold into named sections. Sections are keyed by param name — the same reason as `hints`, since most schema fields are bare shorthand with nowhere to hang a property:

```tsx
body: {
  label: 'Body',
  schema: {
    mass: [1, 0, 10],
    friction: [0.5, 0, 1],
    color: { type: 'color', palette: true },
  },
  groups: { mass: 'Physics', friction: 'Physics', color: 'Appearance' },
}
```

Ungrouped fields stay flat at the top of the row, so its primary control is always visible. Each named section follows as a collapsible folder, in the order its first field is declared. **Only the first section starts open** — the point of grouping is to stop a deep row reading as a wall.

#### Row titles

A row shows its item type's `label` unless it carries a `title` of its own — set one to name a row after its subject (a loaded file, a layer) rather than declaring a separate item type per row. Titles are editable in place: click the title, then **Enter** to commit or **Escape** to cancel. Clearing the field reverts the row to its type label, and a blank title is stored as absent rather than `''`.

Renaming reports through `onEvent` as `{ kind: 'list', op: 'rename', index }`, distinct from the `set` op a param change emits.

**Returns:** `ListItemValue[]` — `{ type, params, title? }` per row

> Available in React and Svelte. The `list` control is not yet implemented for Vue or Solid.

### Folder

Any nested plain object becomes a collapsible folder. Folders can nest arbitrarily deep.

```tsx
shadow: {
  blur: [10, 0, 50],
  opacity: [0.25, 0, 1],
  color: '#000000',
}

// Access nested values:
params.shadow.blur     // number
params.shadow.color    // string
```

Folders are open by default. Add `_collapsed: true` to start a folder closed. This is a reserved metadata key — it controls the UI only and won't appear in your returned values.

```tsx
shadow: {
  _collapsed: true,    // folder starts closed
  blur: [10, 0, 50],
  opacity: [0.25, 0, 1],
}
```

Add `_collapsible: false` to render the folder as a plain section header instead: no caret, no click-to-collapse, body always open. Like `_collapsed`, it is a reserved UI-only key and never appears in your returned values, presets, or persistence; `_collapsed` is ignored when the folder is not collapsible. Module folders (`_enabled`, below) ignore `_collapsible` — their collapse is functional, driven by the switch.

#### Module folders (`_enabled`)

Add the reserved `_enabled: boolean` key to a folder and it renders as a **module**: the header carries an Off/On switch (the same idiom as the standalone `Module` component below), and when off the body collapses away with a smooth height transition. Unlike `_collapsed`, `_enabled` **is a value** — it appears in your returned values at `<folder>._enabled`, participates in presets and persistence, and toggling the switch updates it through the store. Clicking the header still collapses/expands the section while it's on, and `_collapsed` still controls the initial open state.

```tsx
const params = useTweakers('Synth', {
  reverb: {
    _enabled: true,      // renders the header switch; starts on
    mix: [0.3, 0, 1],
    decay: [2.5, 0.1, 10],
  },
});

params.reverb._enabled   // boolean — gate your processing on it
params.reverb.mix        // number
```

#### Tabbed panels (`_tabs`)

A real instrument runs to a very long column in a 300px sidebar. Add the reserved `_tabs: true` key at the **panel root** and every top-level folder becomes a tab: the folders give up their own headers — a segmented bar in the panel header names them instead — and only the open tab's sections show.

```tsx
const params = useTweakers('Instrument', {
  _tabs: true,
  pattern: {
    playback: { swing: [0, 0, 1] },   // a section of the Pattern tab
    fill: { density: [0.5, 0, 1] },
  },
  instrument: {
    shape: { attack: [0.01, 0, 1] },
  },
  master: {
    output: { volume: [0.8, 0, 1] },
  },
});

// Tabs are folders, so the values nest exactly as the config reads:
params.pattern.playback.swing
params.master.output.volume
```

Notes:

- Root only. A `_tabs` inside a folder is stripped, not honoured.
- Like `_collapsed`, `_tabs` is UI-only — it never appears in your values, presets, or persistence.
- The **open** tab, however, is real state: it survives a config rebuild, and it is saved with the panel when `persist` is on. A tab that disappears from the config drops the panel back to the first one.
- An empty folder is not shown as a tab — an empty tab should not exist.
- A loose top-level control (not a folder) still renders, above the tabs, in view from every tab.

### Module

A standalone component (advanced usage): a titled group whose header carries an **enable switch**. Use it for parameter blocks that turn on or off as a unit — synth layers, effect sends, optional feature groups — where a plain folder doesn't capture the "this whole block is on/off" state. The switch doubles as the expand control: when off, the body collapses away with a smooth height transition (so off modules don't take up space) and reveals again when on.

```tsx
import { Module, Slider } from 'tweakers';

function ImpactControls({ layer, onChange }) {
  return (
    <Module
      title="Impact"
      enabled={layer.enabled}
      onEnabledChange={(enabled) => onChange({ ...layer, enabled })}
    >
      <Slider label="Hardness" value={layer.hardness} min={0} max={1} onChange={...} />
      <Slider label="Length" value={layer.length} min={0.5} max={10} onChange={...} />
    </Module>
  );
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Module heading. |
| `enabled` | `boolean` | — | Drives the header switch; when off, the body collapses away. |
| `onEnabledChange` | `(enabled: boolean) => void` | — | Fired when the switch is toggled. |

Available in all four frameworks. In Svelte the body is the default slot/snippet; in Vue, the default slot.

Tweakers also supports dynamic config updates. If your config shape, defaults, options, or labels change over time, the panel updates while preserving current values where paths still exist.

Dynamic configs work with both inline objects and memoized configs — no special consumer action needed:

```tsx
const values = useTweakers('Controls', {
  style: { type: 'select', options: dynamicOptions },
});
```

---

## TweakRoot

```tsx
<TweakRoot position="top-right" />
```

| Prop | Type | Default |
|------|------|---------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `defaultOpen` | `boolean` | `true` |
| `mode` | `'popover' \| 'inline'` | `'popover'` |
| `productionEnabled` | `boolean` | `false` in production, `true` otherwise |

Mount once at your app root. In the default `popover` mode, the panel renders via a portal on `document.body`. It collapses to a small icon button and expands to 280px wide on click.

Tweakers is automatically hidden in production builds. To enable it in production, pass `productionEnabled`:

```tsx
<TweakRoot productionEnabled />
```

### Draggable panel

In popover mode, the collapsed panel bubble can be dragged to any position on the screen. When you click to open the panel, it snaps to the nearest side — top-left if the bubble is on the left half of the screen, top-right if on the right half. When the panel is closed again, it returns to where you last dragged it.

### Inline mode

Use `mode="inline"` to render Tweakers directly in your layout instead of as a floating popover. The panel fills its container and scrolls internally, which is useful for embedding in a sidebar or resizable panel. Inline mode works across all frameworks:

**React:**
```tsx
<aside style={{ width: 300, height: '100vh', overflow: 'hidden' }}>
  <TweakRoot mode="inline" />
</aside>
```

**Solid:**
```tsx
<aside style={{ width: '300px', height: '100vh', overflow: 'hidden' }}>
  <TweakRoot mode="inline" />
</aside>
```

**Svelte:**
```svelte
<aside style:width="300px" style:height="100vh" style:overflow="hidden">
  <TweakRoot mode="inline" />
</aside>
```

In inline mode, the `position` prop is ignored and the collapse-to-icon behavior is disabled.

---

## Panel Toolbar

When the panel is open, the toolbar provides:

- **Presets** — A version dropdown for saving and loading parameter snapshots. Click "+" to save the current state as a new version. Select a version to load it. Changes auto-save to the active version. "Version 1" always represents the original defaults.
- **Copy** — Exports the current values as JSON to your clipboard.

### App-backed presets

Apps with their own preset store (files, engine IPC, a server) can back the same toolbar UI with a `PresetProvider` via the `presets` option. tweakers then renders your list in your order, hides its implicit "Version 1" row, and stops snapshotting values itself — you apply values in `onSelect` and own persistence:

```tsx
const p = useTweakers('Reverb', {
  size: [0.5, 0, 1],
  damping: [0.3, 0, 1],
}, {
  presets: {
    presets: myPresets.map((preset) => ({
      id: preset.id,
      label: preset.factory ? `★ ${preset.name}` : preset.name,
      readonly: preset.factory,             // no trash icon on factory presets
    })),
    activeId: myActivePresetId,
    onSelect: (id) => loadMyPreset(id),     // apply values yourself, e.g. via TweakStore.updateValues
    onCreate: (suggestedLabel) => saveMyPreset(suggestedLabel),  // "+" pressed
    onDelete: (id) => deleteMyPreset(id),   // omit to hide delete entirely
  },
});
```

The provider is plain host state: re-render with a new list or `activeId` and the dropdown follows. Without the option, the built-in version snapshots behave exactly as before. The same option exists on `createTweakers` (Solid and Svelte, where a live list needs signal/`$state`-backed `presets`/`activeId` getters) and Vue's `useTweakers`.

---

## Keyboard Shortcuts

Assign keyboard shortcuts to controls so you can adjust values without touching the panel. Pass a `shortcuts` map in the options object:

```tsx
const p = useTweakers('Card', {
  blur: [24, 0, 100],
  scale: 1.2,
  opacity: [1, 0, 1],
  borderRadius: [16, 0, 64],
  darkMode: true,
  shadow: {
    blur: [10, 0, 50],
  },
}, {
  shortcuts: {
    blur:          { key: 'b', mode: 'fine' },                          // B+Scroll
    scale:         { key: 's', interaction: 'drag', mode: 'coarse' },   // S+Drag
    opacity:       { key: 'o', interaction: 'move' },                   // O+Move
    borderRadius:  { interaction: 'scroll-only' },                      // Scroll (no key)
    darkMode:      { key: 'm' },                                        // press M
    'shadow.blur': { key: 'd', mode: 'fine' },                          // D+Scroll
  },
});
```

### ShortcutConfig

```tsx
type ShortcutConfig = {
  key?: string;                                       // trigger key (e.g. 'b', 's') — optional for scroll-only
  modifier?: 'alt' | 'shift' | 'meta';               // optional modifier key
  mode?: 'fine' | 'normal' | 'coarse';               // precision level (default: 'normal')
  interaction?: 'scroll' | 'drag' | 'move' | 'scroll-only'; // input method (default: 'scroll')
};
```

### Interaction types

| Interaction | Description | Example pill |
|-------------|-------------|-------------|
| `scroll` | Hold key + scroll wheel to adjust (default) | `B+Scroll` |
| `drag` | Hold key + click and drag horizontally | `S+Drag` |
| `move` | Hold key + move mouse (no click needed) | `O+Move` |
| `scroll-only` | Just scroll anywhere, no key needed | `Scroll` |

### Supported controls

| Control | Interactions | Description |
|---------|-------------|-------------|
| **Slider** | `scroll`, `drag`, `move`, `scroll-only` | Adjust value with chosen input method |
| **Toggle** | key press | Press the assigned key to flip on/off |

### Precision modes

For sliders, the `mode` controls how much each scroll tick or drag pixel changes the value:

| Mode | Step multiplier | Use case |
|------|----------------|----------|
| `fine` | step &divide; 10 | Precision tweaking |
| `normal` | step &times; 1 | Default behavior |
| `coarse` | step &times; 10 | Big sweeps |

Fine mode also works mid-drag, no shortcut config needed: while dragging any slider, range slider, or Move panel dial, hold **Shift** to switch pointer movement to 0.1&times; — the handle stops chasing the cursor and creeps relative to where Shift went down. Release Shift and tracking resumes at full rate from that point, with no value jump either way. (Scroll-wheel modifiers are unchanged: Shift is still coarse, Alt fine.)

### Nested paths

For controls inside folders, use dot notation:

```tsx
shortcuts: {
  'shadow.blur': { key: 'd' },
  'shadow.opacity': { key: 'a', interaction: 'drag', mode: 'fine' },
}
```

### UI indicators

Each control with a shortcut displays a pill badge next to its label showing the key and interaction (e.g. `B+Scroll`, `S+Drag`, `O+Move`, `Scroll`). The pill highlights when the shortcut key is actively held.

Shortcuts are automatically disabled when a text input is focused.

---

## AudioLevelMeter

`AudioLevelMeter` is a read-only, discrete-cell audio meter with a classic peak indicator. Each band has 10 cells by default and can be configured from 8 to 12 cells. Current levels update immediately; the brightest top cell holds briefly, then drops one cell at a time. The decay becomes instant when the user prefers reduced motion.

Values are normalized from `0` to `1`. Mono accepts a number, stereo accepts a left/right tuple, and a spectrum array creates one band per value (up to 12):

```tsx
import { AudioLevelMeter } from 'tweakers';

<AudioLevelMeter levels={0.62} label="Microphone input" />

<AudioLevelMeter mode="stereo" levels={[0.48, 0.71]} />

<AudioLevelMeter
  mode="spectrum"
  levels={[0.18, 0.3, 0.46, 0.72, 0.84, 0.67, 0.42, 0.25]}
  cellCount={12}
  colors={['#55d6be', '#f4d35e', '#ee6352']}
/>
```

| Prop | Type | Default |
|------|------|---------|
| `mode` | `'mono' \| 'stereo' \| 'spectrum'` | `'mono'` |
| `levels` | `number \| readonly [number, number] \| readonly number[]` | Required |
| `cellCount` | `number` (rounded and clamped to 8–12) | `10` |
| `colors` | One to three CSS colors, ordered low to high | Neutral |
| `label` | `string` | Mode-specific accessible label |
| `className` | `string` | — |
| `style` | `React.CSSProperties` | — |

Negative values are clamped, non-finite values render as silence, and spectrum entries beyond the twelfth are ignored. A finite value above `1` fills the band and turns its top cell rose to indicate clipping, overriding neutral or custom colors. Current clipping stays rose; after the signal returns to range, the rose indicator remains held for 560 ms independently of the falling peak.

The visual's accessible alternative includes its label, mode, current clamped percentages, and any band with current or held clipping. It is non-focusable and intentionally not an `aria-live` region, so audio-rate updates remain available to assistive technology without being proactively announced.

---

## ListScreen

`ListScreen` is the Move's dark display list: single-line rows on the screen surface, unselected rows dim, the selected row bright on a soft highlight. Ten and a half rows show before the list scrolls (the cut row hints there's more), and the view follows the selection as it moves. It is purely presentational — the host owns the selection state and any wheel or arrow-key stepping:

```tsx
import { ListScreen } from 'tweakers';

<ListScreen
  items={['Drums', 'Bass', 'Vocals', { value: 'other', label: 'Everything else' }]}
  value={selected}
  onSelect={setSelected}
/>
```

An item may also carry a `tag` — a short note pinned to the row's right end (a status, a category), rendered smaller and dimmer than the label, slightly brighter on the selected row. The centered default keeps the label centered regardless (the tag never shifts it), the wide variant puts the tag at the natural flex end, and both sides ellipsize before they can collide:

```tsx
<ListScreen
  wide
  items={rips.map(r => ({ value: r.id, label: r.title, tag: r.status }))}
  value={selected}
  onSelect={setSelected}
/>
```

The list marks its own scroll edges: `data-over-top` and `data-over-bottom` land on the root whenever rows are hidden that way, so a host can soften exactly the edge that is hiding something (the Move's option slot fades its rows there). They follow both the selection and the element's size, so a screen that grows under the list keeps them honest.

Mark an item `muted` when the row is information rather than a choice — a job still queued, a tag that produced nothing. It walks and selects like any row, so nothing disappears from the list, but it never comes up to full brightness; keep the actions beside the list disabled while such a row is the one reached.

| Prop | Type | Default |
|------|------|---------|
| `items` | `(string \| { value: string; label?: string; tag?: string; muted?: boolean })[]` | Required |
| `value` | `string` — the selected item's value | — |
| `onSelect` | `(value: string) => void` | — |
| `wide` | `boolean` — 400px with left-aligned rows, instead of the 200px centered default | `false` |
| `follow` | `'nearest' \| 'center'` — how the view follows the selection: scroll it just into view, or hold it in the middle of the screen | `'nearest'` |
| `className` | `string` | — |
| `style` | `React.CSSProperties` | — |

---

## Move controller

tweakers apps can be driven by an Ableton Move over the bridge kit (the `move` repo's app server). The app binds once and both surfaces stay in sync:

```tsx
import { TweakStore, MovePanel } from 'tweakers';

// Bind the hardware bridge when it's running (no-op otherwise).
import('http://localhost:7787/kit.js')
  .then(m => m.bindMove(TweakStore))
  .catch(() => {});

// Optional on-screen mirror of the Move surface, docked to the bottom edge.
<MovePanel />
```

Panels become pages behind the track buttons (max 4), sliders and bounded numbers become the 8 dials, toggles become pads, and overflow bounded params become value chips (hold to peek, tap to latch).

The on-screen panel shows only occupied slots: a column renders only when it has a dial, a toggle pad, or a value chip. Visible columns keep their full 8-wide slot size and centre in the panel, with the header aligned to the first one — an app with two dials gets a tight two-column cluster, not six empty sockets. Hidden columns are skipped, never renumbered, so each on-screen column still matches its hardware knob; an empty page shows the header alone. The track row follows the same rule: only tracks that carry a page get a tick and a name, so a one-panel app shows one label instead of three blank coloured lines. Each page keeps its own track colour whichever tracks are missing.

### Pad columns

By default pads pack left to right, which is right only when a page's pads happen to belong to its leftmost dials. `movePads` gives a page its own hardware layout — the column each pad sits in, by control path:

```tsx
useTweakers('Playback', config, {
  movePads: {
    'scan': 4, 'scanSpeed': 4,      // the scan switch and its rate, under the Speed dial
    'reverse': 6,                   // under Play Mode
    'sync': 7, 'rate': 7,           // under Tempo
    'comb': 0,                      // an action: the row under the values
  },
});
```

A toggle takes the toggle row, a bounded number the value row, an action the row below those. Naming a column for a bounded number makes it a chip wherever it was declared, so it stops competing for a dial slot — a page can spend all 8 dials on the controls it wants big, whatever else it carries. Controls with no column keep packing left around the named ones, and a column already spoken for falls back to packing rather than dropping the control.

Actions reach the pads **only** through `movePads` — every app has buttons, and none of them expect a hardware pad. Two-handed dials (`xy`, `range`) and enums can't be chips, so a column on one of those is ignored and it keeps its dial slot.

### Where the panel sits

`dock` decides how the panel joins the page:

| `dock` | Behaviour | Use it for |
|--------|-----------|------------|
| `viewport` (default) | Portals to `<body>` and pins to the window's bottom edge, over the page. | Apps whose content fills the screen — a tracker, a video tool. Leave room for it with your own bottom padding. |
| `flow` | Renders inline, in normal document flow, exactly where you put it. | Sparse apps. Make it the last child of your centred column and the content and the panel read as one instrument, with no dead gap between them. |

```tsx
// A sparse app: content and panel centre together as one group.
<div className="app-column">
  <MyContent />
  <MovePanel dock="flow" />
</div>
```

```css
.app-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}
```

Both variants wear the same surface, padding and slot geometry; only the placement differs. The panel carries `data-dock="viewport" | "flow"` if your own CSS needs to branch on it.

An `xy` control claims a dial slot as a 2D pad: the field draws behind the label (no slider at the bottom) and dragging it sets both axes. On the hardware, the column's knob turns the X axis — and while a finger rests on that knob, the volume knob turns Y. The pad honours the XYPad's options: `grid`/`density` draw the same grid overlay (on by default, 5×5), `snap` snaps drags to the grid, bipolar axes keep the escapable centre detent, and `returnToCenter` springs the pad back to its origin on release — on screen when the pointer lifts, and on the hardware when the finger leaves the knob.

A `range` control claims a dial slot too: the bar fills between two handle ticks, and dragging grabs the nearest handle. On the hardware it uses the same two-handed idea as the xy pad — the column's knob edits the low handle, and while a finger rests on that knob, the volume knob edits the high one (the ends never cross).

A `select` with options becomes a stepped enum dial. Dragging the slot — or turning the column's knob — steps through the options in order.

With no picture to stand for the option (see `icon` and `preview` below), the slot shows the choice itself and turns into screen: the [list screen](#listscreen) takes the whole slot, with the control's name on a small head across the top and five option rows under it — the current one lit, the rest dim around it. The list is a readout, not a second control: the slot's own drag and the column's knob are still what step the options.

Past those five rows the list runs behind a still selection: the selected row holds the middle of the screen and the options move past it, and only the two ends of the list push it off centre. **Touch the dial and the screen grows up out of the slot to the whole run**, so the choice can be seen while it is being made — up to half the window, scrolling past that — and drops back when the knob is let go. Rows dissolve at an edge that is hiding something and only there, so the first and last of a list read as its ends rather than as rows cut in half. A list carries no pagination cells: the whole run is on it already. A picture face keeps its cells, having only ever named one option at a time.

An option can name an `icon` from the bundled [lucide](https://lucide.dev) subset (`LUCIDE_ICONS`). The glyph takes the middle of the slot, in place of the name — at arm's length you read a picture, not a word.

```tsx
playMode: {
  type: 'select',
  options: [
    { value: 'forward', label: 'Forward', icon: 'arrow-right' },
    { value: 'pingPong', label: 'Ping-Pong', icon: 'arrow-left-right' },
  ],
  default: 'forward',
},
```

A select whose options *are* shapes takes `preview` instead: `t` in `[0, 1]` → y for the given option, or `null` for options with no shape. The slot draws that curve in place of the option's big name — the picture is the value. It is auto-fitted like a curve row, so a bipolar arc and a 0–1 envelope both fill the slot.

```tsx
pitchShape: {
  type: 'select',
  options: ARC_SHAPES,
  default: shape,
  preview: (name) => (t) => arcCurve(name, bell, t, flip),   // follows bell and flip
},
```

A picture slot reads top down and drops the label/value crossfade, which has nothing left to swap: the control's name sits on a small chip at the top, the picture fills every pixel of the band below it (8px clear of the chip, edge to edge across the slot), and the option's name captions it above the pagination cells. A list needs no caption — it names the option itself — so it spends that room on rows instead, and its name goes edge to edge as a head. Glyph weight is one knob, `--move-glyph-stroke` (1.25 by default) — lucide draws at 2, which reads heavy against this surface's chrome.

`preview` is a closure, so — like a curve row's `sample` — it is invisible to the serialized config diff and is refreshed through the same sync. That is what lets the drawing track the app's other controls while the picker stays a picker.

Bipolar sliders (`bipolar: true` or an `origin`) keep their character on the dial: the fill anchors at an origin tick and grows toward the handle on either side, and the readout shows the real signed value (`+12`, `-8`) instead of the 0–100 position.

### The big-slot library, and multi-slot controls

Every face a dial slot can wear lives in one dictionary, `MOVE_SLOT_LIBRARY` (`src/components/move-slots.tsx`): `default`, `value`, `icon`, `curve`, `enum`, `xy`, `range`, `filter`, `env`, `scope`. Each entry is a pure body — a drawing of computed props with no gestures of its own — so a new face is added by writing a body and dispatching to it from the MovePanel, and the gestures (pointer capture, fine drag, modulation arming) stay in one place.

Some controls are bigger than one column. A **multi-slot control** follows one pattern, whatever its width:

- The container takes `grid-column: span N` — it owns N consecutive columns, and occupancy checks treat it as sitting in all of them.
- One display (the dark screen cut into the face) stretches across the whole span, and the drawing is maximised across it.
- Each column keeps a small caption where its own single slot's label would have been, crossfading to its value on touch — so the hardware's one-knob-per-column rule still holds under the shared picture: every knob edits the hand or stage its column names.

Two ship today: `filter` (2 slots — cutoff and resonance as one magnitude response) and `env` (4 slots — the whole ADSR as one shape on the modulator's settings page, one caption and drag zone per stage).

### Waveform

The panel gives an app its knobs; `MoveWaveform` gives it the sample they are acting on, on the same surface and driven by the same hardware.

```tsx
import { MoveWaveform, MoveWaveformStore } from 'tweakers';

<MoveWaveform buffer={buffer} getProgress={() => playhead} onSeek={setPosition} onLoopChange={setLoop} />

import('http://localhost:7787/kit.js')
  .then(m => m.bindMove(TweakStore, { waveform: MoveWaveformStore }))
  .catch(() => {});
```

The hardware follows the shape of the gesture, not the shape of the API: the **big wheel zooms** (it is a scrub-and-zoom wheel on every deck ever built), the **volume knob scrubs** (the one continuous control a hand finds without looking, Shift for fine), and the **step row marks the loop** — first press the in point, second the out, the same step twice to cancel.

The steps are shared politely with [modulation](#modulation): a slot keeps any step it holds, and the loop takes only the gesture the modulation layer declines — an empty step tapped with nothing armed, which did nothing before. No modifier, and neither feature has to explain itself. The lit span shows on the row.

Rendering one claims the wheel, the volume knob and the steps for as long as it is mounted; unmount it and the volume knob goes back to being the tempo.

Three placements, one look — all of them on the hardware's own display surface (`#1e1e1e`, no border), like the list screen:

| `variant` | Where it sits |
|---|---|
| `page` (default) | A card in the app's own layout, wherever you put it. |
| `slot` | Dial-sized, the playhead pinned at the centre and the sample running past it — a tape head, not a cursor. |
| `dock` | Floating above the Move panel, the width of the surface it belongs to. |

`children` render over the waveform, so an app can lay its own markers on top without fighting the canvas's sizing. Every prop `WaveformVisualization` takes is passed through; `WaveformVisualization` itself now also accepts a controlled `zoom`, which is how the wheel drives it.

### Function buttons

The Move's named function buttons attach to your app's own actions through the function library. Names match the printed hardware labels, and the manifest (`MOVE_FUNCTION_MANIFEST`) splits them in two groups:

- **Standard** — `play`, `rec`, `mute`, `undo`, `copy`, `delete`, `up`, `down`, `left`, `right`. These should do what their printed label says (Undo undoes, Copy copies), so every app feels the same in the hand.
- **Special** — `sample`, `loop`, `capture`, `menu`, `back`, `jog_click` (also exported as `MOVE_SPECIAL_BUTTONS`). These carry no fixed meaning; each app decides what they do — `sample` often acts as the confirm key.

```tsx
import { TweakStore, MoveFunctions } from 'tweakers';

MoveFunctions.attach('undo', () => history.undo());
MoveFunctions.attach('copy', ({ shift }) => (shift ? copyAll() : copySelection()));
MoveFunctions.attach('sample', () => confirmSelection());

import('http://localhost:7787/kit.js')
  .then(m => m.bindMove(TweakStore, { functions: MoveFunctions }))
  .catch(() => {});
```

Attached buttons light up on the hardware and every press runs your action, with `shift: true` when Shift is held — a free second-function layer per button. `attach` returns a detach function, and attaching again replaces the previous action, so bindings can follow your app's modes. Buttons you leave unattached keep the surface's built-in behavior (Undo resets the page's dials, Delete clears the sequencer, Play runs it); Shift and the four track buttons are reserved.

### Action buttons & volume display

`MoveActionButton` is a free-standing pill your views place anywhere — next to a list, under a form, wherever the action lives. Its look is fixed to the hardware key it rides, so the on-screen button always matches the physical one: `kind="enter"` is the wheel's click (track 4's green, dot glyph), `kind="capture"` is the capture button (track 1's blue, four-corners glyph), and `kind="shift"` is the shift key (the surface's light neutral, wearing the same dot glyph in black). Clicking an enter or capture pill runs whatever you attached to that hardware button through `MoveFunctions` (`jog_click` for enter, `capture` for capture), plus an optional `onPress` of its own — and both screen clicks and hardware presses flash the pill. Shift is reserved on the hardware and never claimable, so a shift pill is purely visual: same geometry, no attached function, only its `onPress` — the app wires the hardware gesture itself:

```tsx
import { MoveActionButton, MoveFunctions } from 'tweakers';

MoveFunctions.attach('capture', () => addMarker());
MoveFunctions.attach('jog_click', () => confirm());

<MoveActionButton kind="capture">Add marker</MoveActionButton>
<MoveActionButton kind="enter" disabled={!canConfirm}>Confirm</MoveActionButton>
<MoveActionButton kind="shift" onPress={() => polish()}>Polish</MoveActionButton>
```

A disabled button dims to 40% and runs nothing. `MoveFunctions.subscribeRuns((name, press) => ...)` observes every run — that's the channel the button uses to flash on hardware presses.

The `MovePanel` header keeps one right-aligned pill: the dark volume-dial readout — whatever the volume dial currently means in your app:

```tsx
MoveVolumeDisplay.set({ label: 'gain', value: '-6.0 dB' });      // static
MoveVolumeDisplay.set({ getValue: () => formatTime(playhead) }); // polled per frame
MoveVolumeDisplay.clear();                                       // pill disappears
```

Time-style strings (`0:00:00`) render with bold separators so the digit groups read apart. When nothing is registered, the whole cluster stays hidden and the header looks as it always did.

## Modulation

Any bounded numeric control (slider, `number` with min/max) can be driven by a modulation — an LFO, a sample & hold, and an ADSR today; envelope follower, curve, and step sequencer plug into the same registry. Modulations live in 16 slots, one per Move sequencer step button: **touch a control, press a step** and the modulation is created there and wired to the control (press again to unwire). Each slot keeps a palette colour; the track row shows a circle per slot with a pulsing dot of that colour, and every control the slot drives wears a ring in it — a small dial whose arc runs from the control's own value to where the modulation is holding it, the same ring on the Move panel's slots and on the side panel's rows.

The modulated value **never enters the TweakStore.** The control keeps the value you set (the base); the modulation is a live layer your app pulls at frame time:

```tsx
import { ModulationStore } from 'tweakers';

// In your frame loop — base values with the live modulation applied on top,
// clamped to each control's own bounds:
const speed = ModulationStore.getValue('fx', 'blob.speed');   // one path
const params = ModulationStore.getValues('fx');               // whole panel
```

Because the stored value never moves, presets, persistence, and the bridge kit's diffing all stay quiet — no loops, no thrash. Slots and assignments persist to localStorage (fail-soft), so a prototype's modulation setup survives a reload.

**Settings.** Hold an occupied step (or hold its circle on-screen) and the modulator's settings page takes the surface over: the type enum in the first big slot, then the modulator's own controls — for the LFO: rate (its tempo-sync pad directly below), phase, width, and a jitter/smooth XY. A track button puts a regular page back. Under the hood the page is one hidden TweakStore panel (`MOD_SETTINGS_PANEL`, kind `'modulation'` — never in the dock, never on a track), so the bridge kit syncs it to the hardware like any page and every edit flows into the slot's params.

Everything the gesture does is also plain API — `createSlot(step, 'lfo')`, `assign(panelId, path, step, amount)`, `updateSlotParams`, `setSlotType`, `removeSlot`, `openSettings(step)` / `closeSettings()` — and `subscribe` / `subscribeFrames` cover structure and per-frame signals (`getSignal(step)` is the slot's raw −1..1).

### Envelopes and the gate

The ADSR (`createSlot(step, 'adsr')`) is a shaped envelope: attack up to full, decay down to the sustain level, sustain held while the gate is on, release back to rest. Its signal is unipolar 0..1 — at rest the control sits on its base value, and the envelope lifts it up to `amount` of the span.

A fresh envelope rests at zero and **waits for a trigger** — the host plays it:

```tsx
ModulationStore.gate(step, true);    // note on
ModulationStore.gate(step, false);   // note off — the release runs
```

That is what an app integrates against: your notes, pads, or hardware steps gate the slot, and the panel shows the shape they make. A DSP app whose envelope already runs at audio rate does the opposite — it points the slot at a [source](#external-modulation-sources), and the kit becomes a visual control passing values through, applying nothing of its own.

**Loop** is the exception, for demos and for prototyping with no host: with it on the envelope plays its own gate — attack, decay, release, over and over, no sustain hold. The example turns it on so the slot moves on its own; the library ships it off.

Free-running types (LFO, S&H) ignore the gate, and so do slots pointed at an external source. Gates are live state, never persisted.

### External modulation sources

DSP apps whose modulators run on the audio side (a native LFO, an envelope follower) register them instead of using the internal engine:

```tsx
// Pull: sampled once per frame by the engine…
ModulationStore.registerSource('env-follow', { sample: () => native.envelope });
// …or push at whatever rate the app has:
ModulationStore.setSourceValue('env-follow', v);   // -1..1

ModulationStore.setSlotSource(step, 'env-follow');
```

A slot on a source shows its signal (circle, dots, step light) but applies nothing to values — the app's own engine already did, at audio rate. A source that wants the library to apply for it passes `applies: true`. Tempo-synced modulators follow `ModulationStore.setTempo(bpm)` (the bridge kit feeds it the Move's tempo).

New modulator types register a `ModTypeDef` — defaults, the settings-page controls, a stateful `tick(state, params, dt, bpm)` returning −1..1, and an optional `gate(state, on)` for the types that take one — via `registerModType`; the LFO (`LFO_DEF`) is the reference implementation, with `SH_DEF` and `ADSR_DEF` beside it.

---

## Full Example

```tsx
import { useTweakers } from 'tweakers';
import { motion } from 'motion/react';

function PhotoStack() {
  const p = useTweakers('Photo Stack', {
    // Text inputs
    title: 'Japan',
    subtitle: { type: 'text', default: 'December 2025', placeholder: 'Enter subtitle...' },

    // Color pickers
    accentColor: '#c41e3a',
    shadowTint: { type: 'color', default: '#000000' },

    // Select dropdown
    layout: { type: 'select', options: ['stack', 'fan', 'grid'], default: 'stack' },

    // Grouped sliders in a folder
    backPhoto: {
      offsetX: [239, 0, 400],
      offsetY: [0, 0, 150],
      scale: [0.7, 0.5, 0.95],
      overlayOpacity: [0.6, 0, 1],
    },

    // Spring config for Motion
    transitionSpring: { type: 'spring', visualDuration: 0.5, bounce: 0.04 },

    // Toggle
    darkMode: false,

    // Action buttons
    next: { type: 'action' },
    previous: { type: 'action' },
  }, {
    shortcuts: {
      'backPhoto.offsetX': { key: 'x', interaction: 'drag', mode: 'coarse' },
      'backPhoto.scale': { key: 's', interaction: 'move', mode: 'fine' },
      darkMode: { key: 'm' },
    },
    onAction: (action) => {
      if (action === 'next') goNext();
      if (action === 'previous') goPrevious();
    },
  });

  return (
    <motion.div
      animate={{ x: p.backPhoto.offsetX }}
      transition={p.transitionSpring}
      style={{ color: p.accentColor }}
    >
      <h1>{p.title}</h1>
      <p>{p.subtitle}</p>
    </motion.div>
  );
}
```

---

## Solid

Tweakers also works with Solid. Import from `tweakers/solid` instead of `tweakers` — the API mirrors the React version, with `createTweakers` replacing `useTweakers` and `TweakRoot` as a Solid component.

```bash
npm install tweakers solid-js
```

```tsx
// App.tsx
import { TweakRoot } from 'tweakers/solid';
import 'tweakers/styles.css';

export default function App() {
  return (
    <>
      <MyComponent />
      <TweakRoot />
    </>
  );
}
```

```tsx
// component.tsx
import { createTweakers } from 'tweakers/solid';

function Card() {
  const params = createTweakers('Card', {
    blur: [24, 0, 100],
    scale: 1.2,
    color: '#ff5500',
    visible: true,
  });

  return (
    <div style={{
      filter: `blur(${params().blur}px)`,
      transform: `scale(${params().scale})`,
      color: params().color,
      opacity: params().visible ? 1 : 0,
    }}>
      ...
    </div>
  );
}
```

`createTweakers` returns an accessor — call `params()` to read the current values. All control types, config shapes, and panel features (presets, copy, folders) work identically to the React version.

---

## Svelte

Tweakers works with Svelte 5 (≥5.8.0). Import from `tweakers/svelte` — no extra dependencies needed.

```bash
npm install tweakers
```

```svelte
<!-- +layout.svelte -->
<script>
  import { TweakRoot } from 'tweakers/svelte';
  let { children } = $props();
</script>

{@render children()}
<TweakRoot />
```

```svelte
<!-- Card.svelte -->
<script>
  import { createTweakers } from 'tweakers/svelte';

  const params = createTweakers('Card', {
    blur: [24, 0, 100],
    scale: 1.2,
    color: '#ff5500',
    visible: true
  });
</script>

<div style:filter={`blur(${params.blur}px)`} style:color={params.color}>
  ...
</div>
```

`createTweakers` returns a reactive object — access values directly (e.g. `params.blur`). Styles are injected automatically by `TweakRoot` (no CSS import needed). Cleanup is automatic when the component unmounts. All control types, presets, folders, and transitions match the React/Solid entries.

---

## Vue

Tweakers works with Vue 3 (≥3.3.0). Import from `tweakers/vue`.

```bash
npm install tweakers motion-v vue
```

```ts
// main.ts
import { createApp } from 'vue';
import { TweakRoot } from 'tweakers/vue';
import 'tweakers/styles.css';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');
```

```vue
<!-- App.vue -->
<script setup>
import { TweakRoot } from 'tweakers/vue';
import Card from './Card.vue';
</script>

<template>
  <Card />
  <TweakRoot />
</template>
```

```vue
<!-- Card.vue -->
<script setup>
import { useTweakers } from 'tweakers/vue';

const params = useTweakers('Card', {
  blur: [24, 0, 100],
  scale: 1.2,
  color: '#ff5500',
  visible: true,
});
</script>

<template>
  <div :style="{
    filter: `blur(${params.blur}px)`,
    transform: `scale(${params.scale})`,
    color: params.color,
    opacity: params.visible ? 1 : 0,
  }">
    ...
  </div>
</template>
```

`useTweakers` returns a reactive object. All control types, presets, folders, keyboard shortcuts, and transitions work identically to the other frameworks.

---

## Types

All config and value types are exported:

```tsx
import type {
  SpringConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  CurveConfig,
  ListConfig,
  ListItemType,
  ListItemValue,
  ListField,
  ListFieldGroup,
  AffordanceConfig,
  AffordanceContext,
  AffordanceStatus,
  ShortcutConfig,
  ShortcutMode,
  TweakConfig,
  TweakValue,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
  Preset,
} from 'tweakers';
```

Return values are fully typed: `params.blur` infers as `number`, `params.color` as `string`, `params.spring` as `SpringConfig`, `params.shadow` as a nested object, etc.

---

## License

MIT
