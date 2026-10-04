# xedonium

Minimal, theme-aware React + Tailwind UI components, extracted from Boot Bridge.
Square corners, semantic `app-*` color tokens, light/dark via `<html data-theme>`.

## Install

```bash
yarn add xedonium   # peers: react, react-dom, tailwindcss ^3.4
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

## What's included

- Layout: `AppShell`, `AppBar`, `Navbar`, `Sidebar`, `PageLayout`, `PageHeader`, `Container`, `Flex`, `Stack`, `Grid`, `Card`, `Dashboard`, `Divider`, `Tabs`, `Breadcrumb`
- Forms: `Button`, `Field`, `Input`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `DateRangePicker`, `TimePicker`, `FileUpload`
- Data: `Table`, `DataGrid`, `List`, `SortableList`, `VirtualList`, `Tree`, `Pagination`, `Calendar`, `Carousel`, `Timeline`, `Stepper`, `StatCard`, and charts (`LineChart`, `AreaChart`, `BarChart`, `PieChart`)
- Feedback and overlays: `Alert`, `Toast`, `Tooltip`, `Modal`, `ConfirmDialog`, `Drawer`, `Popover`, `ActionMenu`, `CommandPalette`, `NotificationCenter`, `Progress`, `Skeleton`, `FanFavicon`, `LoadingScreen`, `RackServer`
- Media and utilities: `Avatar`, `Image`, `Video`, `Portal`, `FocusTrap`, `ThemeToggle`, plus 14 icons
- Hooks: `useTimedToast`, `useEscapeKey`, `useDialogFocus`, `useDismissable`, `useFlipAlign`, `useKeyboardShortcuts`, `useLeaveWarning`, `useDocumentTitle(title, suffix)`.
- Theme: `ThemeProvider`, `useTheme`, `useAppTheme`, `buildFaviconHref`.

`AppBar` has no router dependency. For react-router pass `linkComponent={Link} linkProp="to"`.

Overlay z-indexes can be overridden with `--xd-z-modal`, `--xd-z-toast`, `--xd-z-tooltip`.

## Develop

```bash
yarn dev     # playground (every component, tabbed) at http://localhost:3100
yarn build   # dist/ (ESM, CJS, .d.ts, styles.css)
```

## Docs

Docusaurus site in `docs/` (live examples, uses the built `dist/`). Install once with `yarn --cwd docs install`.

```bash
yarn docs         # builds the lib, then serves at http://localhost:3000
yarn docs:build   # static site in docs/build
```
