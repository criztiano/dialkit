# Adding a specialized component

A component belongs in the kit when its contract can be described without an app's
engine types, sample IDs, native commands or project-specific state. A second use
case is strong evidence, but a broadly useful control (such as range or filter)
can belong upstream from its first use. Domain adapters remain in the app.

## Repository map

| Location | Responsibility |
| --- | --- |
| `src/components/` | React controls and panel composition |
| `src/components/move-slots.tsx` | Shared presentational Move faces and dictionary |
| `src/move-layout.ts` | Hardware column allocation, spans and normalization |
| `src/*-core.ts` | Pure domain math, normalization and geometry |
| `src/store/` and Move stores | Shared state and subscriptions |
| `src/styles/theme.css` | Canonical design tokens and component styles |
| `src/solid`, `src/svelte`, `src/vue` | Framework adapters; declare coverage explicitly |
| `src/index.ts`, `package.json` | Public exports and distribution boundaries |
| `example/src/Library.tsx`, showcases | Executable component examples |
| `test/`, `src/*.test.ts` | Vitest suite and Node test suite, respectively |
| `docs/` | Catalog, design language, integration and ownership decisions |
| `dist/` | Generated package output; never hand-edit |

## Acceptance checklist

1. Search the catalog and source exports before inventing a control. Write its
   reuse rationale and identify what stays app-specific.
2. Define value shape, default, bounds, units, formatting and external update
   behavior. Put pure math in a core module.
3. Add config/store reconciliation where needed. Preserve callback refresh for
   live previews; serialized config comparison does not capture closures.
4. For Move, define slot span, hardware gestures, normalization and pad placement.
   Extend the bridge in the Move repository if the wire contract changes. Prove
   screen and hardware agree; a React-only drawing is not hardware support.
5. Put the drawing in the shared slot library; keep pointer capture, focus,
   cancellation, fine drag and modulation orchestration in the panel. Extend
   `MoveSlotKind` and `MOVE_SLOT_LIBRARY` together when adding a new kind.
6. Reuse tokens and visual grammar. Add public exports, catalog guidance and a
   runnable example. State supported frameworks and any deliberate limitations.
7. Test meaningful boundaries: out-of-range values, two-handed axes, slot overflow,
   external updates, disabled/bypass behavior, and pointer cancellation where
   relevant. Run `npm run typecheck`, `npm test`, `npm run test:timeline`,
   `npm run build`. Inspect rendered changes when altering visual behavior.
8. Update a consuming app through a complete package snapshot and validate it with
   the [integration checklist](integration.md). Fix reusable defects upstream.
