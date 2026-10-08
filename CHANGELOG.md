# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

Versions are bumped automatically on release from [Conventional Commit](https://www.conventionalcommits.org/)
messages (see [CONTRIBUTING.md](CONTRIBUTING.md#commit-messages)). Each release is also tagged `vX.Y.Z` on GitHub.

## [Unreleased]

### Added

- `Markdown` component: GitHub-style Markdown (tables, task lists, nested lists, fenced code with highlighting, images, router-aware links) with no dependencies. HTML in the source stays text and unsafe URLs are not rendered as links or images.

### Changed

- The library source is now TypeScript (`.ts` / `.tsx`). The published `.d.ts` files describe every prop precisely:
  fixed choices are literal unions (`gap`, `variant`, `size`, `placement`, ...), optional props are optional, and
  callbacks, item shapes and the generic `Table` / `DataGrid` / `RadioGroup` are typed. Prop types are exported from
  `xedonium` (`import type { AccordionProps } from 'xedonium'`). TypeScript apps that relied on the old, looser types
  may see new errors where a prop was misused.

### Fixed

- Docs: the Badge page points to `Chip` (with `tone`) for status labels, and the Chip page says when to use `Badge`
  instead (#36).
- Docs: `PageLayout` needs a full-height flex column as its parent (`min-h-screen flex flex-col`); the README, the Getting
  Started page and the component docs now say so and show it (#45).
- `Card` header wraps on narrow screens, so `actions` drop below a long title / subtitle instead of squeezing the text
  into a narrow column (#37).
- `Button` / `ButtonLink` lay out as `inline-flex` with a gap, so an icon next to a label sits beside it instead of
  stacking above it (#23).
- `Pagination` buttons are 38px tall, matching the per-page `Select`, and Prev / Next share one minimum width (#34).

### Added

- `ThemeProvider` / `useAppTheme` accept `allowSystem`: a third `system` mode that follows the device theme and is the
  default. `useTheme()` now also returns `themeMode`, `setThemeMode` and `allowSystem`; `toggleTheme` and `ThemeToggle`
  cycle system, light, dark (a monitor icon shows while following the device). New `ThemeMode` type. Without the option
  nothing changes.
- Switching the theme now crossfades the whole page (View Transitions API) instead of fading elements one by one;
  browsers without it, and users who prefer reduced motion, keep the plain colour transitions.
- `Modal`, `Drawer` and `useDialogFocus` accept `initialFocusRef` to choose the element focused on open; the
  `data-autofocus` attribute is now documented (#46).
- Icons `BanIcon`, `ArrowUpRightIcon`, `DevicesIcon`, `LayoutGridIcon` (same drawing as `GridIcon`), `BookOpenIcon` and
  `UserBadgeIcon` (#48).
- `DateTimePicker`: a date and a time picker side by side with one `Date` value, replacing `<input type="datetime-local">`
  (#47).
- `Sidebar` items accept `section: true` for a group caption (a divider when collapsed), and labels that are cut off
  by the width show a tooltip. `Tooltip` gains `onlyIfTruncated` (#33).
- `Sidebar` accepts `bordered` (turn the separators off), `density` (`dense` | `default` | `comfortable`),
  `headerClassName` and `listClassName` (#32).
- `ActionMenu` items accept `icon`, shown before the label (#44).
- `CommandPalette` accepts `onQueryChange`, `loading` and `filter` for async results (with grouped `commands`), and
  `highlight` to mark matched text with `<mark>` (#43).
- `StatCard` accepts `icon`, `status` / `statusTone` (a Chip), `href` (with `linkComponent` / `linkProp`) or `onClick` to
  make the tile clickable, `disabled`, and `loading` (value placeholder with `aria-busy`) (#42).
- `Modal` accepts `fullScreenBelow` (`'sm'` | `'md'`) to fill the screen on small viewports, and its props now include
  `noValidate`, `autoComplete`, `action`, `method`, `encType`, `target` and `acceptCharset` for `as="form"` (#41).
- `Drawer` accepts `busy` (ignores Escape, backdrop and close while an action is in flight, like `Modal`) and
  `busyOverlay` (covers the body with a spinner) (#40).
- `AccordionSection`: a standalone single collapsible section (controlled with `open`, or `defaultOpen`), for pages that
  put other content between sections instead of one `Accordion` per section (#39).
- `Checkbox` accepts `description`, a muted line under the label that is linked to the input with `aria-describedby`
  (#38).
- `Chip` accepts `tone` (`default` | `success` | `warning` | `danger` | `info`) and `filled`, so it works as a coloured
  status pill (#35).
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
