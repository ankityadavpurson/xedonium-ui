import { Link } from 'react-router-dom'
import { Card, Grid } from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import InstallTabs from '../components/InstallTabs'
import VersionBadge from '../components/VersionBadge'
import { version } from '../version'
import Markdown from '../components/Markdown'
import Page, { H2 } from './Page'

const tailwind = `// tailwind.config.js
import xedonium from 'xedonium/tailwind-preset'

export default {
	presets: [xedonium],
	content: ['./index.html', './src/**/*.{js,jsx}', './node_modules/xedonium/dist/**/*.js'],
}`

const styles = `import 'xedonium/styles.css'`

const provider = `import { ThemeProvider, AppBar, PageLayout, Button } from 'xedonium'

<ThemeProvider storageKey="my-app-theme">
	<AppBar brand="My App" />
	<PageLayout>
		<Button>Hello</Button>
	</PageLayout>
</ThemeProvider>`

// Where to go after setup: [label, description, destination]. Paths starting with / are in-app routes.
const NEXT = [
	['Browse components', 'Layout, inputs, navigation, charts and more, each with live examples.', '/components/layout'],
	['Theme and tokens', 'Light and dark mode, the app-* colors and overlay z-index tokens.', '/foundations/theme'],
	['Hooks', 'Toasts, shortcuts, focus handling and dismissing.', '/hooks'],
	['Theme', 'ThemeProvider, useTheme, ThemeToggle and favicon helpers.', '/theme'],
	['Playground', 'Every component on one screen, to check light and dark.', '/playground'],
	[
		'Source on GitHub',
		'Read the code, star the repo or open an issue.',
		'https://github.com/ankityadavpurson/xedonium-ui',
	],
	['xedonium on npm', 'Versions, install stats and the changelog.', 'https://www.npmjs.com/package/xedonium'],
]

const NextCard = ({ title, text, to }) => {
	const card = (
		<Card title={title} className="h-full transition hover:border-app-strong">
			<span className="text-xs text-app-muted">{text}</span>
		</Card>
	)
	return to.startsWith('/') ? (
		<Link to={to} className="block">
			{card}
		</Link>
	) : (
		<a href={to} target="_blank" rel="noreferrer" className="block">
			{card}
		</a>
	)
}

const GettingStarted = () => (
	<Page title="Getting started" subtitle="Install and set up">
		<H2>Install</H2>
		<InstallTabs />
		<div className="flex flex-wrap items-center gap-2 text-sm text-app-text">
			Current version <VersionBadge />
			<span className="text-xs text-app-muted">
				pin it with <code>xedonium@{version}</code>
			</span>
		</div>
		<Markdown>
			{
				'Peer dependencies: `react`, `react-dom` (18 or newer) and `tailwindcss` (^3.4). npm 7+ installs peers for you; with yarn or pnpm add them yourself if your project does not already have them.'
			}
		</Markdown>
		<H2>1. Tailwind</H2>
		<Markdown>{"Use the preset and scan the library's files so its classes are generated:"}</Markdown>
		<CodeBlock code={tailwind} />
		<H2>2. Styles</H2>
		<Markdown>Import the theme tokens and base styles once, before your Tailwind CSS:</Markdown>
		<CodeBlock code={styles} />
		<H2>3. Provider</H2>
		<CodeBlock code={provider} />
		<Markdown>
			{
				'`AppBar` has no router dependency. For react-router pass `linkComponent={Link} linkProp="to"`.\n\nOverlay z-indexes can be overridden with `--xd-z-modal`, `--xd-z-toast` and `--xd-z-tooltip`.'
			}
		</Markdown>
		<H2>Next steps</H2>
		<Grid cols={2} gap={4}>
			{NEXT.map(([title, text, to]) => (
				<NextCard key={title} title={title} text={text} to={to} />
			))}
		</Grid>
	</Page>
)

export default GettingStarted
