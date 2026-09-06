> Historical handoff (2026-08-14). Tabs are now documented in the README.
> Repository paths, dependency advice and design decisions below are historical;
> use the [current guidebook](docs/README.md) for integration work.

# Handoff — tabbed side-panel variant (tweakers)

Written 2026-08-14. Everything a fresh session needs; assume no prior context.

## The job

Add a **panel variant with tabs across the top**, so one inline panel can hold
several groups of sections instead of one long scroll. Today every top-level
folder stacks vertically; in a 300px sidebar a real instrument runs to a very
long column.

Nothing else in this handoff is outstanding — the rest of the batch it came
from (checkbox switches, section dividers, the divider rule, a partial hint-
clipping fix) is done and shipped.

## Repos and how they relate

| | Path | Role |
|---|---|---|
| Library | `/Users/cripto/Code/tweakers` | Where this work happens. Branch `main`. |
| Consumer | `/Users/cripto/Code/tracker/.claude/worktrees/sample-loading-ui-b08657` | Audioground tracker, branch `claude/poc-ui-tweakers-redesign-3f7160`. Real-world proof. |

The tracker consumes tweakers through `"tweakers": "file:/Users/cripto/Code/tweakers"`.

**Two traps, both cost time if you miss them:**

1. **npm `tweakers@1.4.3` is a DIVERGENT line, not an ancestor.** Local `main`
   is ~23 commits ahead of it on a different branch and carries everything
   that matters here (`_enabled` module folders, `_collapsible`, the audio
   level meter, the inline card-chrome fix). Never "upgrade" the tracker to
   the published package — it would silently lose all of it. The `file:` link
   also means the tracker's CI (`pnpm install --frozen-lockfile`) cannot pass
   until tweakers is published from current `main`. That is a known, accepted,
   still-open decision for Cri, not something to fix on your own.
2. **pnpm COPIES `file:` deps into its store; it does not live-link them.**
   After any tweakers change the tracker needs all three of:
   ```bash
   cd /Users/cripto/Code/tweakers && npm run build
   cd <tracker-worktree> && pnpm install --force --ignore-scripts
   rm -rf node_modules/.vite      # else Vite serves a stale pre-bundle
   ```
   Skipping the third step shows you the OLD ui and wastes a debugging cycle.
   `--ignore-scripts` avoids re-running tweakers's `prepare` build inside the
   consumer install.

## Start here — the idiom is already half-built

`src/components/ControlRenderer.tsx:150-176` already hoists tabs into a
**folder** header:

> A segmented select declared as the folder's FIRST row rides the header
> instead — the same idiom as the module switch, for folders whose body is
> viewed through a mode (tabs).

It reads `first.type === 'select' && first.display === 'segmented'`, renders a
`SegmentedControl` into `Folder`'s `toolbar` prop, and drops that child from
the body. **Extending that idiom to the panel root is the natural shape of
this feature** — do not invent a second mechanism.

## Files you will touch

| File | Why |
|---|---|
| `src/components/TweakRoot.tsx` | Renders panels; `mode: 'popover' \| 'inline'` lives here (`TweakRootProps`, ~line 15). Tabs are probably a third axis, not a third mode. |
| `src/components/Folder.tsx` | The root panel is a `Folder` with `isRoot`. Has `toolbar`, `collapsible`, `defaultOpen`. Root title row is `.tweakers-folder-title-root`. |
| `src/components/ControlRenderer.tsx` | The existing headerTabs hoist (150-176). |
| `src/store/TweakStore.ts` | 2000+ lines. `registerPanel` / `updatePanel` / `normalizePreservedValue` (~738-744) — **existing store values win over new config defaults**, which is why tab state must be a real value if it should persist. |
| `src/styles/theme.css` | ~4600 lines, all tokens on the `.tweakers-root` CLASS (not `:root`). Panel styles around `.tweakers-panel-inner`, `.tweakers-folder-*`, `.tweakers-module-*`. |
| `src/index.ts` | Barrel — export anything new. |
| `README.md` | The config syntax reference; document whatever key you choose. |

Framework parity: `src/solid/`, `src/vue/`, `src/svelte/` mirror the React
components. **Check whether Cri wants parity for this feature before building
it four times** — `curve` is React-only and `list` is React+Svelte only, so
partial coverage has precedent.

## The design decision to make first

How does a config declare tabs at the panel root? Two candidates:

- **A reserved key**, matching `_collapsed` / `_collapsible` / `_enabled`
  (e.g. `_tabs: true` on the root, or grouping folders under named tab keys).
  Consistent with everything else; reserved keys are stripped from resolved
  values in `useTweakers.ts:76`.
- **The existing hoist rule**, applied at root: a segmented select as the
  panel's first entry becomes the tab bar, and each option maps to a group of
  top-level folders. Zero new syntax, but needs a way to say which folders
  belong to which tab.

Ask Cri which he prefers before writing code — it is a syntax decision that is
expensive to change once the tracker depends on it.

Also settle: **does the active tab persist?** If yes it must be a store value
(and `normalizePreservedValue` will preserve it across config rebuilds); if
no, local component state is enough.

## House rules that constrain this work

From `skills/tweakers-integration/SKILL.md` (the doctrine doc; read it):

- **All controls live in one inline side panel.** Tabs must not become an
  excuse to scatter controls.
- **Hidden beats disabled.** An empty tab should not exist.
- **Never draw your own dividers.** Separation is a property components carry;
  collapsible sections rule themselves off and the LAST one carries none. A
  tab bar likewise should not gain a hand-drawn rule under it unless it is
  part of the component.
- **Booleans are checkboxes, not two-tab switches** (`src/components/Checkbox.tsx`,
  added in the same batch). Segmented controls are for 3+ genuinely different
  modes — which is exactly what a tab bar is, so `SegmentedControl` is the
  right primitive to reuse here.

## Verify

```bash
cd /Users/cripto/Code/tweakers && npm run build && npm test && npx tsc --noEmit
```

Baseline at handoff: **400 tests passing**, build clean. Tests live in `test/`
and `src/`, vitest.

Demo app for eyeballing (`example/` consumes `file:..`):

```bash
cd /Users/cripto/Code/tweakers/example && npm run dev
```

`http://localhost:3000/library` is the component catalogue and the only place
`mode="inline"` is currently exercised (`example/src/Library.tsx`, final
section) — that is where a tabs demo belongs.

Then prove it in the real consumer (tracker), whose panel is built in
`src/tweakers-panel/panelConfig.ts` — top-level folders today are `pattern`,
`instrument`, `playback`, `shape`, `fill`, `master`, `midi`. A sensible tab
split there is roughly **Pattern | Instrument | Master** and it is a good test
of whether the syntax feels right.

Tracker gate:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm exec vite build
```

Baseline: **273 tests passing**.

## Known-open, not your job unless asked

- tweakers is unpublished relative to this work → tracker CI is red. Cri's call.
- Tracker MIDI device selection is inert; the 9 diagnostic readouts were never
  built after the old panel was deleted.
- The hint/pop-up clipping fix is a `:last-child` CSS patch, not general. A
  proper fix measures on open and flips, or portals the hint the way
  `SelectControl` / `ColorControl` already portal their dropdowns.
