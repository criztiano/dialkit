# dialkit v1.2.0

<img src="https://joshpuckett.me/images/dialkit.png" width="100%" />

Real-time parameter tweaking for React, Solid, Svelte, and Vue, created by Josh Puckett.

To learn more about how I use DialKit, and approach design in general, feel free to check out [Interface Craft](http://interfacecraft.dev/).

## Contributing

- **Open an issue first.** All pull requests should reference an existing issue. PRs without a corresponding issue will be closed.
- **Keep PRs small and focused.** Each pull request should address a single change — one bug fix, one feature, or one refactor. Avoid bundling unrelated changes together.
- **No unnecessary dependencies.** If your change can be accomplished without adding a new dependency, it should be. Any new dependency needs justification in the PR description.

## Quick Start

```bash
npm install dialkit motion
```

```tsx
// layout.tsx
import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <DialRoot />
      </body>
    </html>
  );
}
```

```tsx
// component.tsx
import { useDialKit } from 'dialkit';

function Card() {
  const p = useDialKit('Card', {
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

## useDialKit

```tsx
const params = useDialKit(name, config, options?)
```

| Param | Type | Description |
|-------|------|-------------|
| `name` | `string` | Panel title displayed in the UI |
| `config` | `DialConfig` | Parameter definitions (see Control Types below) |
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
const p = useDialKit('Plasticity', {
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
const p = useDialKit('Motion', {
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
const p = useDialKit('Plasticity', {
  gravity: [9.8, 0, 20],
}, {
  affordances: {
    gravity: { label: 'Bind to music', content: MusicBind },
  },
});
```

`content` is a **component**, not a node — it's captured once when the panel registers, so a pre-built node could never see current state. dialkit renders it with its own instance, so it keeps its own state and hooks. It receives the context as props:

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
| `setStatus` | `(status) => void` | Shorthand for `DialStore.setAffordanceStatus`. |

Affordances travel as an option rather than in the config because the config is JSON-serialized on every render to detect structure changes, and view code would not survive that.

### Status

The dot's appearance is pushed by your app — dialkit owns only how each state looks:

| Status | Dot |
|--------|-----|
| `off` | Faint grey. The default. |
| `armed` | Solid accent — something is bound. |
| `active` | Accent, gently pulsing — the binding is currently driving the value. |

```tsx
DialStore.setAffordanceStatus(panelId, 'gravity', 'active');
```

Pushing the status it already has is dropped without notifying anything, so driving this from an audio callback costs nothing. Status is presentation, not a value: it never reaches the value map, so it isn't persisted or saved into presets.

The popover is portalled out of the panel body — which scrolls — and flips above the dot when it would otherwise run off the bottom of the viewport. It closes on Escape or a click outside, moving focus into the popover on open and back to the dot on close.

Any control type can take an affordance; sliders are the intended case, and what the dot's corner placement is designed around.

---

## Disabled controls

Any control can be greyed out and made inert at runtime:

```tsx
DialStore.setDisabled(panelId, 'reset', true);
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
import { Slider } from 'dialkit';

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
import { gradientToCss } from 'dialkit';

<div style={{ background: gradientToCss(p.bg) }} />
```

A CSS radial gradient can't tilt its own axis, so a rotated/squashed radial needs a transform on a clipping layer — and a rotated box exposes its corners. `gradientFillBox(value, widthPx, heightPx)` returns a ready-to-spread style for a fill layer that covers the box with no clipped corners at any rotation (for linear/conic it just matches the box):

```tsx
import { gradientFillBox } from 'dialkit';

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
const p = useDialKit('Card', {
  spring: { type: 'spring', visualDuration: 0.5, bounce: 0.04 },
  x: [0, -200, 200],
});

<motion.div animate={{ x: p.x }} transition={p.spring} />
```

**Returns:** `SpringConfig` (pass directly to Motion)

### Action

```tsx
const p = useDialKit('Controls', {
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

### Curve (read-only preview)

A display-only row that draws an arbitrary curve your own parameters produce — for parameters that shape a curve indirectly, like a pitch arc built from a shape select plus modifier sliders:

```tsx
const p = useDialKit('Grain', {
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

`sample` is called with `t` in `[0, 1]` and returns the y value at that position. dialkit samples it (~160 points) and strokes the result on a panel surface, with a dashed baseline at `y = 0` whenever the domain spans negative values. Non-finite results (`NaN`, `±Infinity`) are skipped and simply break the stroke. `markers` draws a thin grey reference line behind the curve at each x position — they are plain data, so rebuilding the config with new positions moves the lines live; out-of-range or non-finite entries are skipped.

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
const params = useDialKit('Synth', {
  reverb: {
    _enabled: true,      // renders the header switch; starts on
    mix: [0.3, 0, 1],
    decay: [2.5, 0.1, 10],
  },
});

params.reverb._enabled   // boolean — gate your processing on it
params.reverb.mix        // number
```

### Module

A standalone component (advanced usage): a titled group whose header carries an **enable switch**. Use it for parameter blocks that turn on or off as a unit — synth layers, effect sends, optional feature groups — where a plain folder doesn't capture the "this whole block is on/off" state. The switch doubles as the expand control: when off, the body collapses away with a smooth height transition (so off modules don't take up space) and reveals again when on.

```tsx
import { Module, Slider } from 'dialkit';

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

DialKit also supports dynamic config updates. If your config shape, defaults, options, or labels change over time, the panel updates while preserving current values where paths still exist.

Dynamic configs work with both inline objects and memoized configs — no special consumer action needed:

```tsx
const values = useDialKit('Controls', {
  style: { type: 'select', options: dynamicOptions },
});
```

---

## DialRoot

```tsx
<DialRoot position="top-right" />
```

| Prop | Type | Default |
|------|------|---------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `defaultOpen` | `boolean` | `true` |
| `mode` | `'popover' \| 'inline'` | `'popover'` |
| `productionEnabled` | `boolean` | `false` in production, `true` otherwise |

Mount once at your app root. In the default `popover` mode, the panel renders via a portal on `document.body`. It collapses to a small icon button and expands to 280px wide on click.

DialKit is automatically hidden in production builds. To enable it in production, pass `productionEnabled`:

```tsx
<DialRoot productionEnabled />
```

### Draggable panel

In popover mode, the collapsed panel bubble can be dragged to any position on the screen. When you click to open the panel, it snaps to the nearest side — top-left if the bubble is on the left half of the screen, top-right if on the right half. When the panel is closed again, it returns to where you last dragged it.

### Inline mode

Use `mode="inline"` to render DialKit directly in your layout instead of as a floating popover. The panel fills its container and scrolls internally, which is useful for embedding in a sidebar or resizable panel. Inline mode works across all frameworks:

**React:**
```tsx
<aside style={{ width: 300, height: '100vh', overflow: 'hidden' }}>
  <DialRoot mode="inline" />
</aside>
```

**Solid:**
```tsx
<aside style={{ width: '300px', height: '100vh', overflow: 'hidden' }}>
  <DialRoot mode="inline" />
</aside>
```

**Svelte:**
```svelte
<aside style:width="300px" style:height="100vh" style:overflow="hidden">
  <DialRoot mode="inline" />
</aside>
```

In inline mode, the `position` prop is ignored and the collapse-to-icon behavior is disabled.

---

## Panel Toolbar

When the panel is open, the toolbar provides:

- **Presets** — A version dropdown for saving and loading parameter snapshots. Click "+" to save the current state as a new version. Select a version to load it. Changes auto-save to the active version. "Version 1" always represents the original defaults.
- **Copy** — Exports the current values as JSON to your clipboard.

### App-backed presets

Apps with their own preset store (files, engine IPC, a server) can back the same toolbar UI with a `PresetProvider` via the `presets` option. dialkit then renders your list in your order, hides its implicit "Version 1" row, and stops snapshotting values itself — you apply values in `onSelect` and own persistence:

```tsx
const p = useDialKit('Reverb', {
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
    onSelect: (id) => loadMyPreset(id),     // apply values yourself, e.g. via DialStore.updateValues
    onCreate: (suggestedLabel) => saveMyPreset(suggestedLabel),  // "+" pressed
    onDelete: (id) => deleteMyPreset(id),   // omit to hide delete entirely
  },
});
```

The provider is plain host state: re-render with a new list or `activeId` and the dropdown follows. Without the option, the built-in version snapshots behave exactly as before. The same option exists on `createDialKit` (Solid and Svelte, where a live list needs signal/`$state`-backed `presets`/`activeId` getters) and Vue's `useDialKit`.

---

## Keyboard Shortcuts

Assign keyboard shortcuts to controls so you can adjust values without touching the panel. Pass a `shortcuts` map in the options object:

```tsx
const p = useDialKit('Card', {
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
import { AudioLevelMeter } from 'dialkit';

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

## Full Example

```tsx
import { useDialKit } from 'dialkit';
import { motion } from 'motion/react';

function PhotoStack() {
  const p = useDialKit('Photo Stack', {
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

DialKit also works with Solid. Import from `dialkit/solid` instead of `dialkit` — the API mirrors the React version, with `createDialKit` replacing `useDialKit` and `DialRoot` as a Solid component.

```bash
npm install dialkit solid-js
```

```tsx
// App.tsx
import { DialRoot } from 'dialkit/solid';
import 'dialkit/styles.css';

export default function App() {
  return (
    <>
      <MyComponent />
      <DialRoot />
    </>
  );
}
```

```tsx
// component.tsx
import { createDialKit } from 'dialkit/solid';

function Card() {
  const params = createDialKit('Card', {
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

`createDialKit` returns an accessor — call `params()` to read the current values. All control types, config shapes, and panel features (presets, copy, folders) work identically to the React version.

---

## Svelte

DialKit works with Svelte 5 (≥5.8.0). Import from `dialkit/svelte` — no extra dependencies needed.

```bash
npm install dialkit
```

```svelte
<!-- +layout.svelte -->
<script>
  import { DialRoot } from 'dialkit/svelte';
  let { children } = $props();
</script>

{@render children()}
<DialRoot />
```

```svelte
<!-- Card.svelte -->
<script>
  import { createDialKit } from 'dialkit/svelte';

  const params = createDialKit('Card', {
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

`createDialKit` returns a reactive object — access values directly (e.g. `params.blur`). Styles are injected automatically by `DialRoot` (no CSS import needed). Cleanup is automatic when the component unmounts. All control types, presets, folders, and transitions match the React/Solid entries.

---

## Vue

DialKit works with Vue 3 (≥3.3.0). Import from `dialkit/vue`.

```bash
npm install dialkit motion-v vue
```

```ts
// main.ts
import { createApp } from 'vue';
import { DialRoot } from 'dialkit/vue';
import 'dialkit/styles.css';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');
```

```vue
<!-- App.vue -->
<script setup>
import { DialRoot } from 'dialkit/vue';
import Card from './Card.vue';
</script>

<template>
  <Card />
  <DialRoot />
</template>
```

```vue
<!-- Card.vue -->
<script setup>
import { useDialKit } from 'dialkit/vue';

const params = useDialKit('Card', {
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

`useDialKit` returns a reactive object. All control types, presets, folders, keyboard shortcuts, and transitions work identically to the other frameworks.

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
  DialConfig,
  DialValue,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
  Preset,
} from 'dialkit';
```

Return values are fully typed: `params.blur` infers as `number`, `params.color` as `string`, `params.spring` as `SpringConfig`, `params.shadow` as a nested object, etc.

---

## License

MIT
