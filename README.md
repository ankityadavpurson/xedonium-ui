# xedonium

Minimal, theme-aware React + Tailwind UI components, extracted from Boot Bridge.
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
	<AppBar brand="My App" />
	<PageLayout>
		<Button>Hello</Button>
	</PageLayout>
</ThemeProvider>
```

4. Import only what you use. Every component is its own module, so subpaths load just that module (default exports; in CommonJS use `.default`):

```js
import Button from 'xedonium/Button'
import CheckIcon from 'xedonium/icons/Check'
import useTimedToast from 'xedonium/hooks/useTimedToast'
import { ThemeProvider, useTheme } from 'xedonium/theme'
```

`import { Button } from 'xedonium'` keeps working and is tree-shaken.

## What's included

- Layout: `AppShell`, `AppBar`, `Navbar`, `Sidebar`, `PageLayout`, `PageHeader`, `NotFoundPage`, `Container`, `Flex`, `Stack`, `Grid`, `Card`, `Dashboard`, `Divider`, `Tabs`, `Breadcrumb`
- Typography: `PageTitle`, `BodyText`, `HelperText`, `Label`, `TextLink`
- Forms: `Button`, `ButtonLink`, `Field`, `Input`, `PasswordInput`, `TextArea`, `Select`, `MultiSelect`, `SearchSelect`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `DateRangePicker`, `TimePicker`, `FileUpload`
- Data: `Accordion`, `Badge`, `Chip`, `CodeDisplay`, `Table`, `DataGrid`, `List`, `SortableList`, `VirtualList`, `Tree`, `Pagination`, `Calendar`, `Carousel`, `Timeline`, `Stepper`, `StatCard`, and charts (`LineChart`, `AreaChart`, `BarChart`, `PieChart`)
- Feedback and overlays: `Alert`, `Toast`, `Tooltip`, `Modal`, `ConfirmDialog`, `Drawer`, `Popover`, `ActionMenu`, `CommandPalette`, `NotificationCenter`, `Progress`, `Skeleton`, `Loader`, `FanFavicon`, `LoadingScreen`, `RackServer`
- Media and utilities: `Avatar`, `Image`, `Video`, `Sound`, `Portal`, `FocusTrap`, `ThemeToggle`, plus 22 icons
- Hooks: `useTimedToast`, `useEscapeKey`, `useDialogFocus`, `useDismissable`, `useFlipAlign`, `useKeyboardShortcuts`, `useLeaveWarning`, `useDocumentTitle(title, suffix)`.
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
- Playground: every section on the Playground page is a snippet in `docs/src/playground/<tab>/<slug>.jsx`, shown with an editor and run live with `react-live`. To add one, create the file and list it in `docs/src/playground/registry.js`. Every component page links to the section that uses it ("Open in Playground"), and `yarn docs:check` fails if a component has no section.
- Props tables: `docs/src/content/props.js`. `yarn docs:check` fails if a component's props and its table drift apart.

```bash
yarn docs:build     # static site in docs/dist (+ 404.html for GitHub Pages deep links)
yarn docs:preview   # serve the production build
yarn docs:check     # verify props tables and example files
```
