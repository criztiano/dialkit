# Contributing to Tweakers

Thanks for contributing.

## Development setup

1. Fork and clone the repo.
2. Install dependencies with `npm i`.
3. Run `npm run typecheck` and `npm run build` before opening a PR.

## Project notes

- `src/styles/theme.css` is copied to `dist/styles.css` during build via `tsup` `onSuccess`.
- `example/photostack` imports `tweakers/styles.css`, which resolves to `dist/styles.css`.
- `ButtonGroup` actions should remain vertically stacked.

## Pull request guidelines

- Keep PRs single-responsibility and small.
- Include a short summary of what changed and why.
- Add validation notes (for example: `npm run typecheck`, `npm run build`).
- Update `README.md` when behavior or API docs change.

## Shared component standards

Follow the [component checklist](docs/contributing-components.md) and keep the
[control dictionary](docs/controls.md) current. Consumer updates follow the
[snapshot workflow](docs/integration.md); reusable fixes belong in source, not
in app-owned copies of `dist`. Run both `npm test` and `npm run test:timeline`.
