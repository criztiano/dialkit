# Kit guidebook

The repository is called `dialkit`; the package and public import are `tweakers`.
The Move hardware bridge lives in the separate `move` repository. Reusable UI
belongs here; transport and device protocol belong there; engine behavior belongs
in the consuming app.

- [Control dictionary](controls.md): choose a control and understand Move coverage.
- [Design language](design-language.md): surfaces, typography, layout and interaction.
- [Integration standards](integration.md): state, hardware lifecycle, packaging and updates.
- [Component ownership audit](ownership-audit.md): Grasso, Tracker and Move findings.
- [Adding a component](contributing-components.md): the upstream acceptance checklist.

The [README](../README.md) is the detailed API reference. The export barrels and
prop types in the installed version are authoritative; this guide does not imply
framework parity or a registry release newer than the local source.
