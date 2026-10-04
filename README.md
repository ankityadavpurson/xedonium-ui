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

- Components: `Button`, `Tooltip`, `Modal`, `ConfirmDialog`, `Field`, `Toast`, `ActionMenu`, `AppBar`,
  `PageLayout`, `PageHeader`, `ThemeToggle`, `FanFavicon`, `LoadingScreen`, `RackServer`, plus 14 icons.
- Hooks: `useTimedToast`, `useEscapeKey`, `useDialogFocus`, `useLeaveWarning`, `useDocumentTitle(title, suffix)`.
- Theme: `ThemeProvider`, `useTheme`, `useAppTheme`, `buildFaviconHref`.

`AppBar` has no router dependency. For react-router pass `linkComponent={Link} linkProp="to"`.

Overlay z-indexes can be overridden with `--xd-z-modal`, `--xd-z-toast`, `--xd-z-tooltip`.

## Develop

```bash
yarn dev     # playground at http://localhost:3100
yarn build   # dist/ (ESM, CJS, .d.ts, styles.css)
```

## Docs

Docusaurus site in `docs/` (live examples, uses the built `dist/`). Install once with `yarn --cwd docs install`.

```bash
yarn docs         # builds the lib, then serves at http://localhost:3000
yarn docs:build   # static site in docs/build
```
