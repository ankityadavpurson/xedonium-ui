# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

Versions are bumped automatically on release from [Conventional Commit](https://www.conventionalcommits.org/)
messages (see [CONTRIBUTING.md](CONTRIBUTING.md#commit-messages)). Each release is also tagged `vX.Y.Z` on GitHub.

## [Unreleased]

### Changed

- The library source is now TypeScript (`.ts` / `.tsx`). The published `.d.ts` files describe every prop precisely:
  fixed choices are literal unions (`gap`, `variant`, `size`, `placement`, ...), optional props are optional, and
  callbacks, item shapes and the generic `Table` / `DataGrid` / `RadioGroup` are typed. Prop types are exported from
  `xedonium` (`import type { AccordionProps } from 'xedonium'`). TypeScript apps that relied on the old, looser types
  may see new errors where a prop was misused.

### Fixed

- `Card` header wraps on narrow screens, so `actions` drop below a long title / subtitle instead of squeezing the text
  into a narrow column (#37).
- `Button` / `ButtonLink` lay out as `inline-flex` with a gap, so an icon next to a label sits beside it instead of
  stacking above it (#23).

### Added

- `AppBar` accepts `embedded`, which drops its own sticky `<header>` frame so it can sit inside `AppShell`'s `header`
  without a double border or nested banners (#28).
- `AppShell` accepts `menuButtonVariant` and `menuButtonProps` (`className`, `aria-label`, ...) to customise the mobile
  menu button (#27).
- `AppShell` `sidebarCollapsedBelow="lg"` shows the inline sidebar as an icon rail between `md` and `lg`, and a
  `sidebar` render function now receives `(close, { inDrawer, collapsed })`. New `useMediaQuery` hook (#29).
- `DataGrid` `loading` shows skeleton rows in place of the data, sets `aria-busy` on the table and announces "Loading…"
  in the footer (#24).
- `DataGrid` columns accept `className`, `headerClassName`, `width`, `minWidth` and `hideBelow: 'sm' | 'md' | 'lg'`
  (hides the column on smaller screens) (#25).
- `DataGrid` `hideFooterWhenSinglePage` hides the footer (row count, page size select, pager) when every row fits on
  one page (#26).
- `Field`, `Select`, `TextArea` and `PasswordInput` accept `helperText`, shown under the field while there is no `error`
  and linked to the control with `aria-describedby` (#30).
- `Input` accepts `startAdornment` and `endAdornment` (an icon or a clear button) and pads the text to clear them (#31).
- `yarn typecheck` (also run in CI, on pre-push and before publishing) and compile-time type tests.
- Unit test suite (Vitest + Testing Library) with a 90% coverage gate enforced by a pre-push hook and CI.
- CI workflow that lints and tests every push to `dev`.
- Community files: contributing guide, code of conduct, security policy, and issue and pull request templates.
