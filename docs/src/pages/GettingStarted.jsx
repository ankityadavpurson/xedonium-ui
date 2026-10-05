import CodeBlock from '../components/CodeBlock'
import Markdown from '../components/Markdown'
import Page, { H2 } from './Page'

const install = `yarn add xedonium   # peers: react, react-dom, tailwindcss ^3.4`

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

const GettingStarted = () => (
	<Page title="Getting started" subtitle="Install and set up">
		<H2>Install</H2>
		<CodeBlock code={install} lang="bash" />
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
	</Page>
)

export default GettingStarted
