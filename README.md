<div align="center">

![Xedonium logo](.github/readme-logo.svg)

# Xedonium

### Minimal, theme-aware React UI

Forms, charts, overlays and 160+ icons with light and dark themes,</br>
each one a separate module you can import on its own.

[Live docs](https://ankityadavpurson.github.io/xedonium-ui/)

</div>

Minimal, theme-aware React UI components styled with Tailwind CSS. Light/dark themes, TypeScript types included.
Square corners, semantic `app-*` color tokens, light/dark via `<html data-theme>`.

## Install

```bash
npm install xedonium
# or: yarn add xedonium
# or: pnpm add xedonium

# peers: react, react-dom (18+), tailwindcss ^3.4
```

## Setup

1. Tailwind config: use the preset and scan the library's files.

```js
// tailwind.config.js
import xedonium from 'xedonium/tailwind-preset'

export default {
	presets: [xedonium],
	content: ['./index.html', './src/**/*.{js,jsx}', './node_modules/xedonium/dist/**/*.js'],
}
```

2. Import the theme tokens + base styles once (before your Tailwind CSS):

```js
import 'xedonium/styles.css'
```

3. Wrap your app:

```jsx
import { ThemeProvider, AppBar, PageLayout, Button } from 'xedonium'

;<ThemeProvider storageKey="my-app-theme">
	<div className="flex min-h-screen flex-col">
		<AppBar brand="My App" />
		<PageLayout>
			<Button>Hello</Button>
		</PageLayout>
	</div>
</ThemeProvider>
```

`PageLayout` fills the space left in its parent (`flex-1`), so give the parent a full-height flex column (`min-h-screen flex flex-col`), as above. Without it the page sits at the top and content, such as the theme toggle, can overlap.

4. Import only what you use. Every component is its own module, so subpaths load just that module (default exports; in CommonJS use `.default`):

```js
import Button from 'xedonium/Button'
import CheckIcon from 'xedonium/icons/Check'
import useTimedToast from 'xedonium/hooks/useTimedToast'
import { ThemeProvider, useTheme } from 'xedonium/theme'
```

`import { Button } from 'xedonium'` keeps working and is tree-shaken.

## TypeScript

The library is written in TypeScript and ships its own types, so props autocomplete and are checked (for example
`<Accordion gap="" />` suggests `none | sm | md | lg`). Prop types are exported next to the components:

```tsx
import { Accordion, type AccordionProps, type SelectOption } from 'xedonium'
```

`yarn typecheck` checks the source and `test/types.check.tsx`, which asserts that valid props compile and invalid ones do not.

## What's included

- Layout: `AppShell`, `AppBar`, `Navbar`, `Sidebar`, `PageLayout`, `PageHeader`, `NotFoundPage`, `Container`, `Flex`, `Stack`, `Grid`, `Card`, `Dashboard`, `Divider`, `Tabs`, `Breadcrumb`, `BackToTop`, `ScrollProgress`
- Typography: `PageTitle`, `BodyText`, `HelperText`, `Label`, `TextLink`, `Markdown`
- Forms: `Button`, `ButtonGroup`, `ButtonLink`, `FloatingActionButton`, `ToggleButton`, `ToggleButtonGroup`, `Field`, `Input`, `NumberField`, `PasswordInput`, `PasswordStrengthInfo`, `TextArea`, `Select`, `MultiSelect`, `SearchSelect`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `Rating`, `TransferList`, `DatePicker`, `DateRangePicker`, `TimePicker`, `FileUpload`
- Data: `Accordion`, `Badge`, `Chip`, `CodeDisplay`, `Table`, `DataGrid`, `List`, `SortableList`, `VirtualList`, `Tree`, `Pagination`, `Calendar`, `Carousel`, `Timeline`, `Stepper`, `StatCard`, `NestedTable`, `LogViewer`, `FileExplorer`, and charts (`LineChart`, `AreaChart`, `BarChart`, `PieChart`)
- Feedback and overlays: `Alert`, `Toast`, `Tooltip`, `Modal`, `ConfirmDialog`, `Drawer`, `Popover`, `Menu`, `ActionMenu`, `SpeedDial`, `Backdrop`, `CommandPalette`, `NotificationCenter`, `NetworkConnection`, `Progress`, `Skeleton`, `Loader`, `FanFavicon`, `LoadingScreen`, `RackServer`
- Media and utilities: `Avatar`, `Image`, `Video`, `Sound`, `Portal`, `FocusTrap`, `ThemeToggle`, plus 213 outline icons (see the Icons page; each is also importable as `xedonium/icons/<Name>`)
- Hooks: `useTimedToast`, `useEscapeKey`, `useDialogFocus`, `useDismissable`, `useFlipAlign`, `useKeyboardShortcuts`, `useLeaveWarning`, `useUnsavedChanges`, `useDocumentTitle(title, suffix)`, `useDebouncedValue(value, delay, options)`, `useNetworkStatus`, `useMediaQuery(query)`, `useScrollProgress(target)`.
- Theme: `ThemeProvider`, `useTheme`, `useAppTheme`, `buildFaviconHref`.

`AppBar` has no router dependency. For react-router pass `linkComponent={Link} linkProp="to"`.

Overlay z-indexes can be overridden with `--xd-z-modal`, `--xd-z-popover`, `--xd-z-toast`, `--xd-z-tooltip`.

## Develop

```bash
yarn docs    # docs site + playground at http://localhost:3100
yarn build   # dist/ (ESM, CJS, .d.ts, styles.css)
```

## Docs

The docs site in `docs/` is a small Vite + React app built with the library itself (imported from `src/`, no build step needed).

- Pages: `docs/src/content/<category>.js` lists each component's page; its demos live in `docs/src/examples/<category>/<slug>-<n>.jsx` and the code shown is exactly the file that is rendered.
- Playground: `/playground` is a landing page with ten basic components to try first and a link to every category; each docs category is a page and tab (`/playground/<category>`) and each component is a collapsible section that opens to the same examples as its docs page, live and editable with `react-live`. There is nothing extra to write: a component's examples are the ones listed in its page. Every component page links to its section ("Open in Playground"), and `yarn docs:check` fails if a page has no example.
- Props tables: `docs/src/content/props.js`. `yarn docs:check` fails if a component's props and its table drift apart.

```bash
yarn docs:build     # static site in docs/dist (+ 404.html for GitHub Pages deep links)
yarn docs:preview   # serve the production build
yarn docs:check     # verify props tables and example files
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first; it covers setup, commit conventions and the 90% test coverage requirement. Please follow the [Code of Conduct](CODE_OF_CONDUCT.md), and report security issues privately as described in [SECURITY.md](SECURITY.md). Release notes are in [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © Ankit Yadav
