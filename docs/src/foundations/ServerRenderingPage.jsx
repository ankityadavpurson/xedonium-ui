import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import Markdown from '../components/Markdown'
import Page, { H2 } from '../views/Page'

// Every snippet uses the same storage key, so the init script and the provider agree (they must)
const KEY = 'gru-lair-theme'

const overview = `import { Alert, Modal } from 'xedonium'

// Renders on the server like any React component: no window or document is needed
export default function Lair({ open, onClose }) {
	return (
		<>
			<Alert tone="success" title="Banana secured">Kevin is on guard.</Alert>
			{/* an open Modal renders nothing in the server HTML, and appears right after hydration */}
			<Modal open={open} onClose={onClose} title="Gru's orders">Fetch more bananas.</Modal>
		</>
	)
}`

const initScript = `// a small inline script for <head>: sets <html data-theme> before the first paint
import { getThemeInitScript } from 'xedonium/theme/initScript'

const script = getThemeInitScript({ storageKey: '${KEY}', defaultTheme: 'system' })`

const tailwind3 = `// tailwind.config.js (Tailwind v3)
import xedonium from 'xedonium/tailwind-preset'

export default {
	presets: [xedonium],
	content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/xedonium/dist/**/*.js'],
}`

const tailwind4 = `/* app.css (Tailwind v4): the path is relative to this CSS file */
@import 'tailwindcss';
@import 'xedonium/styles.css' layer(base);
@import 'xedonium/tailwind-v4.css';
@source '../node_modules/xedonium/dist';`

const nextProviders = `// app/providers.tsx
'use client'

import { ThemeProvider } from 'xedonium/theme'

export default function Providers({ children }: { children: React.ReactNode }) {
	return <ThemeProvider storageKey="${KEY}">{children}</ThemeProvider>
}`

const nextLayout = `// app/layout.tsx (a Server Component)
import { getThemeInitScript } from 'xedonium/theme/initScript' // safe on the server, unlike 'xedonium/theme'
import 'xedonium/styles.css'
import './globals.css'
import Providers from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		// the init script sets data-theme before React hydrates, so React must not warn about it
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: getThemeInitScript({ storageKey: '${KEY}' }) }} />
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}`

const nextClient = `// app/minions/BananaCounter.tsx
'use client'

import { useState } from 'react'
import Button from 'xedonium/Button'
import Badge from 'xedonium/Badge'

export default function BananaCounter() {
	const [bananas, setBananas] = useState(3)
	return (
		<Button onClick={() => setBananas(n => n + 1)}>
			Give Kevin a banana <Badge>{bananas}</Badge>
		</Button>
	)
}`

const nextDocument = `// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'
import { getThemeInitScript } from 'xedonium/theme'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script dangerouslySetInnerHTML={{ __html: getThemeInitScript({ storageKey: '${KEY}' }) }} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}`

const nextApp = `// pages/_app.tsx
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'xedonium/theme'
import 'xedonium/styles.css'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider storageKey="${KEY}">
			<Component {...pageProps} />
		</ThemeProvider>
	)
}`

const reactRouter = `// app/root.tsx (React Router 7 framework mode; Remix 2 is the same with '@remix-run/react')
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { ThemeProvider, getThemeInitScript } from 'xedonium/theme'
import 'xedonium/styles.css'
import './app.css'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<script dangerouslySetInnerHTML={{ __html: getThemeInitScript({ storageKey: '${KEY}' }) }} />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return (
		<ThemeProvider storageKey="${KEY}">
			<Outlet />
		</ThemeProvider>
	)
}`

const gatsbyRoot = `// src/wrap-root.jsx: shared by gatsby-browser and gatsby-ssr, so both render the same tree
import { ThemeProvider } from 'xedonium/theme'

export const wrapRootElement = ({ element }) => <ThemeProvider storageKey="${KEY}">{element}</ThemeProvider>`

const gatsbyBrowser = `// gatsby-browser.jsx
import 'xedonium/styles.css'
import './src/styles/global.css'

export { wrapRootElement } from './src/wrap-root'`

const gatsbySsr = `// gatsby-ssr.jsx
import { getThemeInitScript } from 'xedonium/theme'

export { wrapRootElement } from './src/wrap-root'

export const onRenderBody = ({ setHeadComponents }) => {
	setHeadComponents([
		<script key="xedonium-theme" dangerouslySetInnerHTML={{ __html: getThemeInitScript({ storageKey: '${KEY}' }) }} />,
	])
}`

const astroPage = `---
// src/pages/index.astro
import { getThemeInitScript } from 'xedonium/theme/initScript'
import BackToTop from 'xedonium/BackToTop' // the island loads just this component
// import { BackToTop } from 'xedonium'     // the island would load the whole library
import Lair from '../components/Lair.tsx'
import '../styles/global.css'
---
<html lang="en">
	<head>
		<!-- sets <html data-theme> before the first paint, for the whole page -->
		<script is:inline set:html={getThemeInitScript({ storageKey: '${KEY}' })} />
	</head>
	<body>
		<Lair client:load />
		<BackToTop client:idle />
	</body>
</html>`

const astroIsland = `// src/components/Lair.tsx: props that take JSX, such as icon={...}, need a .tsx component
import { ThemeProvider } from 'xedonium/theme'
import ThemeToggle from 'xedonium/ThemeToggle'
import Alert from 'xedonium/Alert'
import StarIcon from 'xedonium/icons/Star'

export default function Lair() {
	return (
		// keep ThemeToggle in the same island as ThemeProvider: islands do not share React context
		<ThemeProvider storageKey="${KEY}">
			<ThemeToggle />
			<Alert tone="success" title="Banana secured" icon={<StarIcon />}>
				Kevin is on guard.
			</Alert>
		</ThemeProvider>
	)
}`

const viteHtml = `<!-- index.html -->
<html lang="en">
	<head>
		<script><!--theme-init--></script>
	</head>
	<body>
		<div id="root"><!--app-html--></div>
		<script type="module" src="/src/entry-client.tsx"></script>
	</body>
</html>`

const viteServer = `// src/entry-server.tsx
import { renderToString } from 'react-dom/server'
import { ThemeProvider, getThemeInitScript } from 'xedonium/theme'
import App from './App'

export const render = (template: string) =>
	template.replace('<!--theme-init-->', getThemeInitScript({ storageKey: '${KEY}' })).replace(
		'<!--app-html-->',
		renderToString(
			<ThemeProvider storageKey="${KEY}">
				<App />
			</ThemeProvider>
		)
	)`

const viteClient = `// src/entry-client.tsx
import { hydrateRoot } from 'react-dom/client'
import { ThemeProvider } from 'xedonium/theme'
import 'xedonium/styles.css'
import App from './App'

hydrateRoot(
	document.getElementById('root')!,
	<ThemeProvider storageKey="${KEY}">
		<App />
	</ThemeProvider>
)`

const ServerRenderingPage = () => (
	<Page title="Server rendering" subtitle="Next.js, React Router, Gatsby, Astro and any SSR setup">
		<Markdown>
			{
				'Every Xedonium component renders on the server: with `renderToString` or streaming, in Next.js, React Router (Remix), Gatsby, Astro or your own setup. Nothing reads `window` or `document` while it loads or renders, and React prints no warnings. A test renders every export in plain Node, and hydrates it again, to keep it that way.\n\nThe setup is the same everywhere: import the styles, put one `ThemeProvider` near the root, add the theme init script to `<head>`, and let Tailwind scan the library. The sections below show where each piece goes in each framework.'
			}
		</Markdown>
		<CodeBlock code={overview} />

		<H2>What renders on the server</H2>
		<Markdown>
			{
				'- **Overlays** that live in `<body>` (`Modal`, `Drawer`, `ConfirmDialog`, `CommandPalette`, `Portal`, a full screen `Backdrop`, and the panels of `Menu`, `Select`, `Popover` and the pickers) render nothing in the server HTML, as in most UI libraries, and appear right after hydration. Without server rendering they show on the first render.\n- **Values only the browser knows** are read after hydration, so the first paint matches the server HTML: `useMediaQuery` is `false` until then (so `AppShell` starts in its collapsed layout), `Calendar` takes today from the browser, `NetworkConnection` assumes it is online, and `Video` picks the `Auto` resolution for an ordinary screen and link.\n- **Dates:** the server and your visitors can be in different days, so give `Calendar` a `value` (or `min` / `max`) when the day it opens on matters.'
			}
		</Markdown>

		<H2>The theme, without a flash</H2>
		<Markdown>
			{
				'`ThemeProvider` sets `<html data-theme>` once the app has hydrated. Until then a server-rendered page would show the default theme, then switch. `getThemeInitScript` returns a small inline script that applies the saved choice (or the default) before the first paint. Pass it the same `storageKey` and `defaultTheme` as the provider.\n\nImport it from `xedonium/theme/initScript` where only server code runs, such as a Next.js App Router layout or an Astro page: that module has no React in it. `xedonium/theme` exports it too, for files that also use the provider. See [Theme](/foundations/theme) for the modes.\n\nWhen React renders the `<html>` element itself (Next.js App Router, React Router), add `suppressHydrationWarning` to it: the script sets `data-theme` before React hydrates, which React would otherwise report as a mismatch. It only applies to that one element.'
			}
		</Markdown>
		<CodeBlock code={initScript} />

		<H2>Tailwind</H2>
		<Markdown>
			{
				'The components ship Tailwind class names inside their compiled JavaScript, so Tailwind has to scan `node_modules/xedonium/dist` in every framework. With Tailwind v3 use the preset and add the path to `content`; with Tailwind v4 import the two CSS files and add an `@source` line.'
			}
		</Markdown>
		<CodeBlock code={tailwind3} />
		<CodeBlock code={tailwind4} />

		<H2>Next.js (App Router)</H2>
		<Markdown>
			{
				"Files in `app/` are Server Components unless they start with `'use client'`. Xedonium components use state and effects, so render them from Client Components, and keep `ThemeProvider` in a small client file of its own. The root layout stays a Server Component: it imports the init script from `xedonium/theme/initScript`, which is safe there (`xedonium/theme` is not, because it creates a React context)."
			}
		</Markdown>
		<CodeBlock code={nextProviders} />
		<CodeBlock code={nextLayout} />
		<Markdown>
			{'Then use components in any Client Component. Server Components can still render it and pass it data as props.'}
		</Markdown>
		<CodeBlock code={nextClient} />

		<H2>Next.js (Pages Router)</H2>
		<Markdown>
			{
				'Everything in `pages/` can use Xedonium directly. Put the init script in `_document` and the provider in `_app`. `_document` renders `<html>` without hydrating it, so it needs no `suppressHydrationWarning`.'
			}
		</Markdown>
		<CodeBlock code={nextDocument} />
		<CodeBlock code={nextApp} />

		<H2>React Router and Remix</H2>
		<Markdown>
			{
				"In React Router 7's framework mode (and Remix 2, its predecessor), `app/root.tsx` renders the whole document. Add the init script to the `Layout` head and wrap the `Outlet` in `ThemeProvider`. The CSS imports go in the same file."
			}
		</Markdown>
		<CodeBlock code={reactRouter} />

		<H2>Gatsby</H2>
		<Markdown>
			{
				'Gatsby renders pages at build time with `gatsby-ssr` and hydrates them with `gatsby-browser`. Wrap the root in `ThemeProvider` in both, from one shared file, so the server and the browser render the same tree. Add the init script with `onRenderBody`. Gatsby does not hydrate `<html>`, so no `suppressHydrationWarning` is needed.'
			}
		</Markdown>
		<CodeBlock code={gatsbyRoot} />
		<CodeBlock code={gatsbyBrowser} />
		<CodeBlock code={gatsbySsr} />

		<H2>Astro</H2>
		<Markdown>
			{
				"With `@astrojs/react`, Xedonium components render to HTML in `.astro` files and hydrate as islands (`client:load`, `client:idle`, `client:visible`).\n\n- **Import islands from their subpath.** An island loads the whole module it is imported from, so tree-shaking does not apply: `import BackToTop from 'xedonium/BackToTop'` ships one component, while `import { BackToTop } from 'xedonium'` ships the whole library (about 500 KB). Named imports work on subpaths too: `import { BackToTop } from 'xedonium/BackToTop'`.\n- **One `ThemeProvider` is enough.** The theme lives on `<html data-theme>`, so it styles the whole page, islands and static HTML alike. Islands do not share React context, though, so keep `ThemeToggle` (and anything else that calls `useTheme`) in the same island as the provider.\n- **Props that take JSX**, such as `icon={<StarIcon />}`, cannot be passed from an `.astro` file to an island. Render those components from a `.tsx` component."
			}
		</Markdown>
		<CodeBlock code={astroPage} />
		<CodeBlock code={astroIsland} />

		<H2>Vite and custom servers</H2>
		<Markdown>
			{
				"With your own server (Vite's SSR mode, Express and so on), render with `renderToString` or `renderToPipeableStream`, put the init script in the HTML template's head, and hydrate with `hydrateRoot`. The server and the client must render the same tree, `ThemeProvider` included."
			}
		</Markdown>
		<CodeBlock code={viteHtml} />
		<CodeBlock code={viteServer} />
		<CodeBlock code={viteClient} />

		<H2>Any other framework</H2>
		<Markdown>
			{
				"Docusaurus, TanStack Start, Waku, RedwoodJS and other React frameworks follow the same five steps:\n\n1. Import `xedonium/styles.css` once (or the Tailwind v4 CSS above).\n2. Let Tailwind scan `node_modules/xedonium/dist`.\n3. Wrap the root in one `ThemeProvider`, on the server and in the browser.\n4. Put `getThemeInitScript()` in an inline `<script>` in `<head>`, with the same `storageKey`.\n5. With React Server Components, render Xedonium from Client Components (`'use client'`). With islands, import each hydrated component from its subpath."
			}
		</Markdown>
		<Markdown>
			{
				'Something does not render on your server? [Open an issue](https://github.com/ankityadavpurson/xedonium-ui/issues) with the framework and version.'
			}
		</Markdown>
		<p className="m-0 text-xs text-app-muted">
			Setting up a new project? Start with <Link to="/getting-started">Getting started</Link>.
		</p>
	</Page>
)

export default ServerRenderingPage
