# Contributing to xedonium

Thanks for your interest in improving xedonium. Bug reports, fixes, new components and docs improvements are all welcome.
By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug or request a feature:** [open an issue](https://github.com/ankityadavpurson/xedonium-ui/issues/new/choose). Search existing issues first.
- **Report a security problem:** do not open a public issue. See [SECURITY.md](SECURITY.md).
- **Send a pull request:** for anything larger than a small fix, open an issue first so we can agree on the approach.

## Development setup

Requirements: Node 22 (what CI uses) and [Yarn 1](https://classic.yarnpkg.com/).

```bash
git clone https://github.com/ankityadavpurson/xedonium-ui.git
cd xedonium-ui
yarn install        # also installs the Husky git hook
yarn docs           # run the docs site / component playground locally
```

| Command              | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `yarn docs`          | Start the docs site (Vite dev server)                |
| `yarn lint`          | ESLint                                               |
| `yarn format`        | Prettier                                             |
| `yarn test`          | Run the unit tests once                              |
| `yarn test:watch`    | Run the unit tests in watch mode                     |
| `yarn test:coverage` | Run the tests with coverage (fails below 90%)        |
| `yarn build`         | Build the library and type declarations into `dist/` |
| `yarn docs:check`    | Check that every component is documented             |
| `yarn docs:build`    | Build the static docs site                           |

## Branches

- Work on a branch off `dev` and open your pull request against `dev`.
- `main` is the release branch: every push to `main` publishes docs and, if the commits call for it, a new npm version.

## Commit messages

The release version is calculated from [Conventional Commit](https://www.conventionalcommits.org/) prefixes, so please use them:

| Prefix                                           | Release    |
| ------------------------------------------------ | ---------- |
| `type!:` or `BREAKING CHANGE` in the body        | major      |
| `feat:`                                          | minor      |
| `fix:` `bug:` `ui:` `style:` `perf:` `refactor:` | patch      |
| `docs:` `chore:` `ci:` `test:` `build:`          | no release |

Example: `feat: add loading variant to Progress`.

## Code guidelines

- Components live in `src/components/`, hooks in `src/hooks/`, theme code in `src/theme/`. Export new public API from `src/index.js`.
- Match the surrounding code: function components, Tailwind classes using the semantic `app-*` colour tokens, square corners, and support for both light and dark themes.
- Keep components accessible: real elements, labels, keyboard support, and ARIA only where needed.
- Every component needs docs: add an entry under `docs/src/content/` and an example under `docs/src/examples/`. `yarn docs:check` verifies this.
- Run `yarn format` before committing. Files are formatted with Prettier.
- Import paths are case sensitive on CI (Linux), so match file names exactly.

## Tests

Tests live in `test/` and use [Vitest](https://vitest.dev/) with Testing Library and happy-dom.

- Add or update tests for every change. A new component needs tests for its props, states, keyboard behaviour and edge cases.
- **Coverage must stay at 90% or higher** for statements, branches, functions and lines. The thresholds are in `vitest.config.js`.
- A Husky `pre-push` hook runs `yarn test:coverage`, and the CI workflow runs lint and the same check on every push to `dev`. A push or PR that drops below 90% will fail.

## Pull requests

Before opening a pull request, make sure that:

1. `yarn lint`, `yarn test:coverage` and `yarn build` pass locally.
2. New or changed behaviour has tests and docs.
3. The PR description explains what changed and why, and links the related issue.

A maintainer will review it as soon as possible. Please be patient and keep discussion constructive.

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
