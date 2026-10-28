# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

Versions are bumped automatically on release from [Conventional Commit](https://www.conventionalcommits.org/)
messages (see [CONTRIBUTING.md](CONTRIBUTING.md#commit-messages)). Each release is also tagged `vX.Y.Z` on GitHub.

## [Unreleased]

## [1.20.0] - 2026-10-28

## [1.18.0] - 2026-10-28

### Added

- `CodeDisplay` and `Markdown` fenced code now color `yaml` / `yml` (keys, quoted scalars, comments, booleans, numbers and GitHub Actions `${{ }}` expressions). The built-in `highlight` function is exported so a custom `highlighter` can fall back to the defaults.

## [1.16.0] - 2026-10-27

### Added

- `Table` accepts `rowProps(row)` (extra attributes such as `className` or `aria-selected` for a row) and `isRowHidden(row)`, which hides a row with the `hidden` attribute but keeps it mounted, so filtering does not reload images or reset inputs. The last visible row has no bottom border, and the empty message shows when no row is visible (#70).
- `Sidebar` accepts `divider: true` items (an unlabeled `section` renders the same), `textCase="none"`, `iconSize`, `itemClassName`, `width` and `borderRight` (independent of `bordered`); an item's `label` is optional for dividers. `AppShell` accepts `sidebarFullHeight`, which puts the header over the content column only (#77).
- `MultiSelect` accepts `creatable` (with `createLabel` and `onCreate`): Enter or a comma adds the typed text as a value even if it is not in `options`, an `Add "text"` row offers the same, and duplicates are never added (#79).
- `Markdown` accepts `inline`, which renders only the inline subset into a fragment (or a `span` with `className`), for short strings inside a heading or paragraph (#80).
- `ScrollProgress` accepts `barClassName`, and the bar fill and the ring stroke (also on `BackToTop`) read the `--xd-progress` CSS variable (#83).
- Primary colour tokens `--color-app-primary`, `--color-app-primary-hover` and `--color-app-primary-text` (and the `app-primary`, `app-primary-hover` and `app-primary-text` colours in the Tailwind preset and `tailwind-v4.css`): the default `Button` / `ButtonLink` and the keyboard focus ring read them. They default to the previous colours, so nothing changes until you override them on `:root` (#84).
- `ActionMenu` items accept `tone: 'danger'` (red text, icon, hover and focus background) next to `warning` (#75).
- `ConfirmDialog` accepts `maxWidth` (a `max-w-*` class), `confirmDisabled` and `confirmVariant` (#76).
- `Input` accepts `clearable` (and `clearLabel`): a clear button shows while there is a value, Escape clears too, and focus returns to the input (#78).
- `Badge` accepts `shape` (`square`, `rounded` or `pill`; default `square`) (#81).
- `StatCard` accepts `size="compact"`, which puts the value beside the label in a shorter tile (#82).

### Fixed

- `Field`: `required` now defaults to `false` (it was `true`, so every field was announced as required) and, when set, also
  puts the native `required` attribute on the input, so browser validation and `:invalid` styling work. **Note:** forms
  that relied on the old default should pass `required` explicitly (#73).
- `Image`: the fallback is cleared when `src` changes, and an image that failed before hydration now shows the fallback (#71).
- `FileUpload`: dropped files are filtered by `accept` like the picker (new `onReject` receives the rest), the input is reset
  so the same file can be chosen twice, and `clearOnSelect` forgets the selection after `onChange` (#72).
- `Tooltip`: a display utility in `className` (`flex`, `block`, ...) replaces the wrapper's default `inline-flex` (#74).

## [1.15.0] - 2026-10-18

### Added

- `DataGrid` accepts `virtualized` (with `rowHeight`, default 40, and `height`, default 400): only the rows in view are rendered,
  between spacer rows, with a sticky header and `aria-rowcount` / `aria-rowindex`. All rows scroll in one list unless
  `pageSize` is set; sorting, search and selection cover every row. Row heights must be fixed (#67).
- Brand logo icons: `WindowsIcon`, `AppleIcon`, `LinuxIcon`, `AndroidIcon`, `UbuntuIcon`, `DebianIcon`, `FedoraIcon`,
  `FreeBsdIcon` and database logos `MysqlIcon` (name and logo), `MysqlNameIcon` (name only), `MysqlLogoIcon` (dolphin only), `PostgresqlIcon`, `MongodbIcon`, `SupabaseIcon`, `FirebaseIcon`, `MariadbIcon`,
  `SqliteIcon`, `RedisIcon` (current "R" mark), `OldRedisIcon` (the classic layered logo), `ElasticsearchIcon`, `CassandraIcon`. They are filled one-colour marks (`currentColor`) from
  Simple Icons (CC0), except Windows, which is drawn here. Not included: Chrome OS, SQL Server and Oracle, which are not
  in a licensed icon set (#68).
- `ThemeProvider` / `useAppTheme` accept `defaultTheme` (`light`, `dark` or `system`, default `system`): the theme used until
  the user chooses one. The default is never stored; only a different choice is, and `system` is stored when it is not
  the default. New `getThemeInitScript({ storageKey, defaultTheme })` returns an inline script that sets `data-theme`
  before the first paint (#65).
- `Carousel` accepts `previousLabel`, `nextLabel` and `dotLabel(index)` to change the wording of the buttons and dots
  (aria-label and tooltip), for example "Previous order" or a translation (#66).

## [1.14.0] - 2026-10-15

### Added

- Icons `ArrowUpDownIcon`, `ArrowLeftRightIcon`, `ChevronsUpDownIcon`, `CpuIcon`, `LaptopIcon`, `KeyboardIcon`, `MouseIcon`, `MemoryStickIcon` and `TabletIcon` (#62).

### Fixed

- `Calendar` (and `DatePicker`, `DateTimePicker`, `DateRangePicker`): the month buttons are disabled when the previous or next month has no day within `min` / `max`, `PageUp` / `PageDown` and the arrow keys no longer move outside the range or onto a disabled day, and with nothing selected it opens on the nearest allowed month. A time on `min` / `max` no longer disables its own day (#63).

## [1.13.0] - 2026-10-13

### Added

- `PipelineGraph`: a left-to-right job dependency graph (like the workflow view on GitHub Actions) with status icons, per-node `icon`, `description`, `trailing`, `className` and `disabled`, elbow connectors, drag or touch to pan, `onNodeClick` / `selectedId` and `renderNode`. The grid layout is exported as `layoutPipeline`.

## [1.12.0] - 2026-10-13

### Added

- `CodeDisplay` and `Markdown` fenced code now color `html` (also `xml`, `svg`), `css` (also `scss`), `apache` (also `htaccess`) and `nginx`, and take a `highlighter` prop to plug in your own tokenizer for other languages. The `Highlighter` type is exported.

### Changed

- Tailwind v4 is supported: the `tailwindcss` peer range is now `^3.4.0 || ^4.0.0`, the README has a Tailwind v4 setup section and `xedonium/tailwind-v4.css` provides the dark variant, `app-*` colours and animations.

## [1.11.0] - 2026-10-10

### Added

- `RichTextEditor` (**beta**): a WYSIWYG editor with no dependencies (bold, italic, headings, lists, quotes, code, alignment, colors, links, images, tables, undo and redo). HTML is sanitized by an allowlist on the way in and out; `format="markdown"` edits Markdown. Images can be resized (corner handle, width presets) and table columns dragged by their borders. Also exports `sanitizeHtml`, `markdownToHtml` and `htmlToMarkdown`, and six icons (`ListOrderedIcon`, `QuoteIcon`, `TableIcon`, `PaletteIcon`, `HighlighterIcon`, `RemoveFormattingIcon`).

## [1.10.0] - 2026-10-10

### Added

- `NestedTable` (tree rows and master-detail rows with lazy loading, exclusive, row actions), `LogViewer` (level filter with counts, debounced search with highlights, follow-the-newest with "Jump to latest", full screen, `parseLogFile`), `FileExplorer` (grid, list and tree layouts, breadcrumbs, filter, lazy folders), `PasswordStrengthInfo` with custom rules (`rules`, `extraRules`, `passwordRules`, `onResult`) and `NetworkConnection` (detects online, offline and no internet; panel, badge and banner).
- `BackToTop` (appears after scrolling, smooth scroll to the top, optional progress ring) and `ScrollProgress` (a `bar` along the top of the page, or a `button` with a ring), with the `useScrollProgress` hook.
- `useDebouncedValue` (with `leading` and `maxWait`), `useNetworkStatus`, `useMediaQuery` and `useUnsavedChanges` (asks before leaving a form with unsaved changes: the browser prompt plus held-back link clicks) hooks.
- `NotificationCenter`: a "View all" footer (`onViewAll` or `viewAllHref`) and `maxItems`. `Modal`: `fullScreen`, `fullScreenToggle`, `defaultFullScreen` and `onFullScreenChange`.

## [1.9.0] - 2026-10-08

### Added

- `Markdown` component: GitHub-style Markdown (tables, task lists, nested lists, fenced code with highlighting, images, router-aware links) with no dependencies. HTML in the source stays text and unsafe URLs are not rendered as links or images.

## [1.8.0] - 2026-10-08

### Added

- `ThemeProvider` / `useAppTheme` accept `allowSystem`: a third `system` mode that follows the device theme and is the
  default. `useTheme()` now also returns `themeMode`, `setThemeMode` and `allowSystem`; `toggleTheme` and `ThemeToggle`
  cycle system, light, dark (a monitor icon shows while following the device). New `ThemeMode` type. Without the option
  nothing changes.
- Switching the theme now crossfades the whole page (View Transitions API) instead of fading elements one by one;
  browsers without it, and users who prefer reduced motion, keep the plain colour transitions.

## [1.7.1] - 2026-10-07

### Added

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

## [1.7.0] - 2026-10-07

### Added

- `yarn typecheck` (also run in CI, on pre-push and before publishing) and compile-time type tests.

### Changed

- The library source is now TypeScript (`.ts` / `.tsx`). The published `.d.ts` files describe every prop precisely:
  fixed choices are literal unions (`gap`, `variant`, `size`, `placement`, ...), optional props are optional, and
  callbacks, item shapes and the generic `Table` / `DataGrid` / `RadioGroup` are typed. Prop types are exported from
  `xedonium` (`import type { AccordionProps } from 'xedonium'`). TypeScript apps that relied on the old, looser types
  may see new errors where a prop was misused.

## [1.2.0] - 2026-10-06

### Added

- Unit test suite (Vitest + Testing Library) with a 90% coverage gate enforced by a pre-push hook and CI.
- CI workflow that lints and tests every push to `dev`.
- Community files: contributing guide, code of conduct, security policy, and issue and pull request templates.
