# Component ownership audit — 2026-09-05

Scope: this task's kit base `ef26dfb`, and the local Grasso, Tracker and Move
checkouts. This is a source audit, not a hardware acceptance test. Other apps
and unmerged feature branches were not treated as shipped integrations.

## Findings and decisions

| Area | Evidence | Decision |
| --- | --- | --- |
| Specialized dial faces | `src/components/move-slots.tsx`, `src/index.ts` | Default/value, enum/icon/curve, range and filter already live upstream and are exported |
| XY dial face | Was inline in `MovePanel`, absent from `MOVE_SLOT_LIBRARY` despite being a `MoveSlotKind` | Extracted to `MoveSlotXYBody`, exported and included in the exhaustive dictionary; gestures stay in the panel |
| Other reusable Move UI | `MoveWaveform`, `MoveActionButton`, `ListScreen`, surface/volume stores and modulation exports | Already upstream; reuse them from the package |
| Grasso parameter surface | `app/src/app-shell/MovePages.tsx`, `engine/move-pages.ts`, `AppShell.tsx` | Uses `useTweakers`, shared filter response helpers, production-enabled flow panel and official `bindMove` |
| Grasso waveform | `app/src/stage/WaveformStage.tsx` | Already composes `MoveWaveform`; grain overlay and sample adapter remain app-owned |
| Grasso anatomy | `app/src/anatomy/AnatomyPanel.tsx` | Engine-specific anatomy visualization; keep local |
| Tracker parameter surface | `src/dialkit-panel`, `src/app-shell/AppShell.tsx` | Uses public config/store API and production-enabled MovePanel with explicit panel names |
| Tracker hardware | `src/move-bridge/useMoveBridge.ts` | Uses official binder with cleanup and retry; app client owns sequencer/raw-pad behavior, not a duplicate dial mapper |
| Tracker waveform | `src/instrument-panel/WaveformEditor.tsx` | Depends on native peak mipmaps, frame-based loop points, slice overrides/audition and engine commits; keep as domain editor, not a copied MoveWaveform |
| Tracker slot pads | `src/instrument-panel/SlotPadStrip.tsx` | Instrument/sample slot selection is domain UI, distinct from generic Move dial slots |
| Move repository | `kit/move-tweakers.js`, `client/move-surface.mjs` | Hardware adapter/protocol belongs there; reusable React slot faces belong here |
| Consumer packaging | Both package manifests use `file:./vendor/tweakers`; vendor declaration files differ from this base | Portable snapshots, but revision provenance missing; adopt the recorded snapshot procedure for updates |
| Integration doctrine | Existing skill mandated a sidebar and mentioned fixed geometry that no longer matches tokens | Updated entry guidance to support the Move surface; canonical guidebook added |

No app-owned general-purpose Move slot implementation was found that needs copying
back into the kit. The concrete missing shared face was XY, already in the kit's
panel but unavailable as a library entry. Domain-specific views are explicitly
retained rather than generalized without a second use case.

## Update boundary

The consumer checkouts were clean at inspection and were read-only for this task.
Their existing vendor bundles were not silently replaced with this uncommitted
kit build. This audit establishes integration structure; it does not claim those
apps have adopted this task's new export. The guidebook provides the update and
verification gates, and the snapshot command produces a reviewable artifact.

Before the next specialized component, use the ownership checklist and add its
config, layout behavior, shared body, catalog entry and tests together.
