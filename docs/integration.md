# Integrating and updating the kit

## Ownership and state

Use the public `tweakers` exports and `tweakers/styles.css`. Never import through
`src/`, bundle a second copy of the store, or patch generated `dist` files.
Register stable named configs with `useTweakers`; let `MovePanel` and the bridge
consume the same `TweakStore`. Keep engine state in the app, diff user edits into
it, and push external changes (preset, undo, engine restore) back through
`TweakStore.updateValues`. Read current values before applying changes so that
the two directions do not echo. Preserve identity paths when rebuilding config.

A minimal on-screen surface needs no running hardware server:

```tsx
import { MovePanel, useTweakers, type TweakConfig } from 'tweakers';
import 'tweakers/styles.css';

const PANELS = ['Instrument'];
const config = { gain: [0.5, 0, 1, 0.01], mute: false } satisfies TweakConfig;

export function InstrumentControls() {
  const values = useTweakers('Instrument', config, {
    movePads: { mute: 0 },
  });
  // The app's bridge applies values.gain / values.mute to its engine.
  return <MovePanel panels={PANELS} dock="flow" theme="dark" productionEnabled />;
}
```

`productionEnabled` is required for a product
surface: the development default otherwise hides the panel in production.

## Hardware connection

The separate Move server serves `bindMove` at `http://localhost:7787/kit.js`.
Bind once per active surface/profile. Supply exactly the same ordered panel
names to `MovePanel` and `bindMove`, and the registries for features the app uses:
`functions`, `waveform`, `modulation`. The bridge returns an unbind function;
call it on unmount and before rebinding. Cancel pending import/retry work on
unmount so a late import cannot create an orphan connection.

Keep hardware optional: expose connection status, allow the app to work offline,
and use bounded retry delays if the server may start later. Test reconnect and
profile changes. App actions attach through `MoveFunctions`; raw pads, steps or
master controls require explicit claims and `MoveSurfaceStore` mirroring.
Do not rebuild page/dial mapping or value synchronization in the app's raw client.
Do not give modulation and the app sequencer simultaneous ownership of steps.

Hardware has four tracks and eight dial columns. `buildMovePages`, `dialSpan`,
`visibleColumns` and `movePadRows` define the layout, not app CSS. Validate pages
for overflow, two-column filter boundaries, enums and small-pad placement.

## Dependency policy

Grasso and Tracker currently use `file:./vendor/tweakers`, a committed package
snapshot. This is portable and CI-friendly when the vendor directory and lockfile
are committed. It is not a live link. Their snapshots predate this audit and have
no upstream revision marker; do not infer their source commit from version 1.2.0.

Keep that strategy until deliberately changing distribution. Do not replace it
with an arbitrary registry version: this repository has historically diverged
from the published line. Do not put machine-specific absolute `file:` paths in
committed manifests. During local kit development the example's `file:..` is fine.

### Repeatable snapshot update

1. In the kit task worktree, run `npm run typecheck`, `npm test`,
   `npm run test:timeline` and `npm run build`. Review the source and generated diff.
2. Run `npm run snapshot -- /tmp/tweakers-review-UNIQUE` using a new directory.
   This packs the npm allowlist, skips lifecycle rebuilds, and writes a sibling
   `SOURCE.json` with source commit, dirty flag and archive SHA-256. A clean
   committed source is required before treating it as a release; a dirty snapshot
   is useful for review but is explicitly marked.
3. Extract that archive into a staging directory. Compare it with the consumer's
   existing vendor package before replacement, including exports used by the app.
   Preserve app-specific adapter code outside the vendor directory. Never merge
   generated bundles or refresh only one JS/CSS file.
4. In the consumer's isolated task worktree, replace `vendor/tweakers` with the
   complete extracted `package` directory, and copy `SOURCE.json` into it. Grasso's
   package root is `app/`; Tracker's is its repository root.
5. Run `pnpm install --force --ignore-scripts` in that package root, updating its
   lockfile. Restart Vite with `--force` to refresh prebundles. A `file:` dependency
   may be copied into pnpm's store; a kit rebuild alone is insufficient.
6. Run the consumer's typecheck, lint, tests and `pnpm exec vite build`. Test the
   panel in production, not just the dev server. Check presets/undo, pointer and
   hardware input, curve preview refresh, page changes and offline behavior.
7. Commit the complete vendor package, source marker and lockfile together.
   Verify `pnpm install --frozen-lockfile --ignore-scripts` in CI. Roll back by
   reverting that whole update commit, not by mixing files from two snapshots.

The snapshot tool refuses to overwrite an existing output directory and never
edits a consumer. Its SHA-256 describes the exact archive, including dirty builds;
it does not prove the build is current. The explicit build gate above does that.

## Integration review checklist

- Public imports, one resolved store instance, one stylesheet import.
- App shell token scope and explicit panel theme.
- Production surface enabled; viewport dock does not cover content.
- Panel and hardware names/order match; empty and overflowing layouts inspected.
- Stable ranges/steps, domain formatting, hints and intentional pad columns.
- Both directions of state sync verified after preset/undo.
- Binding, function listeners, timers and subscriptions cleaned up.
- Snapshot provenance, full vendor package and matching lockfile committed.
