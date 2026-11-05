import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
	Alert,
	ArrowRightIcon,
	ButtonLink,
	Card,
	ExternalLinkIcon,
	Grid,
	Label,
	RackServer,
	Select,
	Switch,
	Tabs,
	useDocumentTitle,
} from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import InstallTabs from '../components/InstallTabs'
import Signature from '../components/Signature'
import VersionBadge from '../components/VersionBadge'
import { categories, pages } from '../content'

const GITHUB = 'https://github.com/ankityadavpurson/xedonium-ui'

// Only things that are true of the package: no `dependencies` in package.json, subpath exports for every module,
// peers are react 18+ and tailwind 3.4 or 4, types are built in.
const FEATURES = [
	[
		'Themes in one attribute',
		'Light, dark and the device setting through <html data-theme>. Every color is a semantic app-* token, so your own CSS follows the theme too.',
	],
	[
		'Import only what you use',
		'Each component is its own module. Pull in Button from xedonium/Button and nothing else is shipped.',
	],
	[
		'No runtime dependencies',
		'Only React and Tailwind as peers. There is no styling engine, icon pack or utility library to audit or update.',
	],
	[
		'Typed from the start',
		'TypeScript types ship in the package, so props, events and hooks autocomplete in your editor.',
	],
	[
		'Tailwind 3 and 4',
		'A preset for v3 and a CSS entry for v4. Override --color-app-primary once to recolor every primary button.',
	],
	[
		'More than buttons',
		'Charts, date pickers, a data grid, a rich text editor, overlays and a command palette, built on the same tokens.',
	],
]

const SETUP = {
	tailwind: {
		label: '1. Tailwind',
		code: `// tailwind.config.js
import xedonium from 'xedonium/tailwind-preset'

export default {
	presets: [xedonium],
	content: ['./src/**/*.{js,jsx}', './node_modules/xedonium/dist/**/*.js'],
}`,
	},
	styles: {
		label: '2. Styles',
		code: `// once, before your Tailwind CSS
import 'xedonium/styles.css'`,
	},
	app: {
		label: '3. Your app',
		code: `import { ThemeProvider, ThemeToggle, Button } from 'xedonium'

export default function App() {
	return (
		<ThemeProvider storageKey="minion-hq-theme">
			<ThemeToggle />
			<Button>Bello!</Button>
		</ThemeProvider>
	)
}`,
	},
}

const Stat = ({ value, label }) => (
	<div className="flex flex-col gap-1 bg-app-card px-4 py-4">
		<span className="text-2xl font-bold tracking-tight text-app-text sm:text-3xl">{value}</span>
		<span className="text-[10px] font-semibold uppercase tracking-widest text-app-muted">{label}</span>
	</div>
)

// Real components, not a screenshot: the visitor can change them
const LiveDemo = () => {
	const [banana, setBanana] = useState('cavendish')
	const [armed, setArmed] = useState(true)
	return (
		<Card title="Minion HQ" subtitle="Live components, try them">
			<div className="flex flex-col gap-4">
				<Select
					label="Banana of the day"
					value={banana}
					onChange={setBanana}
					options={[
						{ value: 'cavendish', label: 'Cavendish' },
						{ value: 'plantain', label: 'Plantain' },
						{ value: 'red', label: 'Red banana' },
					]}
				/>
				<Switch label="Freeze ray armed" checked={armed} onChange={setArmed} />
				<Alert tone={armed ? 'warning' : 'success'} title={armed ? 'Stand back' : 'All quiet'}>
					{armed ? `Kevin is guarding the ${banana} with the freeze ray.` : `Kevin is eating the ${banana} in peace.`}
				</Alert>
			</div>
		</Card>
	)
}

const SectionHead = ({ label, title, children }) => (
	<div className="flex max-w-2xl flex-col gap-2">
		<Label as="h2">{label}</Label>
		<p className="m-0 text-2xl font-bold tracking-tight text-app-text sm:text-3xl">{title}</p>
		{children && <p className="m-0 text-sm text-app-muted">{children}</p>}
	</div>
)

const Home = () => {
	useDocumentTitle('Xedonium')
	return (
		<div className="flex flex-col gap-16 pb-8 sm:gap-20">
			<section className="grid items-center gap-10 pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:pt-10">
				<div className="flex min-w-0 flex-col gap-6">
					<div className="flex items-center gap-3">
						<Label as="p">React · Tailwind · TypeScript</Label>
						<VersionBadge />
					</div>
					<h1 className="m-0 text-4xl font-bold leading-[1.05] tracking-tight text-app-text sm:text-5xl">
						Minimal UI that follows your theme.
					</h1>
					<p className="m-0 max-w-xl text-base text-app-soft sm:text-lg">
						{pages.length} square-cornered React components, 160+ icons and semantic color tokens. Light and dark with
						one attribute, and no runtime dependencies.
					</p>
					<div className="max-w-md">
						<InstallTabs />
					</div>
					<div className="flex flex-wrap gap-3">
						<ButtonLink linkComponent={Link} linkProp="to" href="/getting-started">
							Get started
							<ArrowRightIcon />
						</ButtonLink>
						<ButtonLink linkComponent={Link} linkProp="to" href="/playground" variant="secondary">
							Playground
						</ButtonLink>
						<ButtonLink href={GITHUB} variant="secondary" target="_blank" rel="noreferrer">
							GitHub
							<ExternalLinkIcon />
						</ButtonLink>
					</div>
				</div>
				<div className="hidden justify-center md:flex">
					<RackServer />
				</div>
			</section>

			<section
				aria-label="At a glance"
				className="grid grid-cols-2 gap-px border border-app-border bg-app-border sm:grid-cols-4"
			>
				<Stat value={pages.length} label="Components" />
				<Stat value="160+" label="Icons" />
				<Stat value="0" label="Runtime dependencies" />
				<Stat value={categories.length} label="Categories" />
			</section>

			<section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
				<div className="flex flex-col gap-4">
					<SectionHead label="Try it" title="Real components, not screenshots.">
						This card is built from Xedonium. Change the banana, flip the switch, then use the toggle in the header to
						see every surface follow the theme.
					</SectionHead>
					<div>
						<ButtonLink linkComponent={Link} linkProp="to" href="/playground" variant="flat">
							Edit examples live
							<ArrowRightIcon />
						</ButtonLink>
					</div>
				</div>
				<LiveDemo />
			</section>

			<section className="flex flex-col gap-6">
				<SectionHead label="Why Xedonium" title="Small surface, solid defaults." />
				<div className="grid gap-px border border-app-border bg-app-border sm:grid-cols-2 lg:grid-cols-3">
					{FEATURES.map(([title, text], index) => (
						<div key={title} className="flex flex-col gap-2 bg-app-card p-5">
							<span className="font-code text-xs text-app-muted">{String(index + 1).padStart(2, '0')}</span>
							<h3 className="m-0 text-sm font-bold text-app-text">{title}</h3>
							<p className="m-0 text-sm text-app-muted">{text}</p>
						</div>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-6">
				<SectionHead label="Quick start" title="Three steps from install to a themed button.">
					Peers: react and react-dom 18+, tailwindcss 3.4 or 4. The full guide covers Tailwind v4 and brand colors.
				</SectionHead>
				<Tabs
					items={Object.entries(SETUP).map(([key, { label, code }]) => ({
						key,
						label,
						content: <CodeBlock code={code} />,
					}))}
					defaultValue="tailwind"
				/>
				<div>
					<ButtonLink linkComponent={Link} linkProp="to" href="/getting-started" variant="secondary">
						Read the full guide
						<ArrowRightIcon />
					</ButtonLink>
				</div>
			</section>

			<section className="flex flex-col gap-6">
				<SectionHead label={`${pages.length} components`} title="Find what you need." />
				<Grid cols={3} gap={4}>
					{categories.map(category => (
						<Link key={category.slug} to={`/components/${category.slug}`} className="block">
							<Card
								title={category.label}
								subtitle={`${category.components.length} components`}
								className="h-full transition hover:border-app-strong"
							>
								<span className="text-xs text-app-muted">
									{category.components
										.slice(0, 4)
										.map(component => component.name)
										.join(', ')}
									{category.components.length > 4 ? ' and more' : ''}
								</span>
							</Card>
						</Link>
					))}
				</Grid>
			</section>

			<section className="flex flex-col items-start gap-4 border border-app-border bg-app-card p-6 sm:p-8">
				<h2 className="m-0 text-2xl font-bold tracking-tight text-app-text sm:text-3xl">Ready to build?</h2>
				<p className="m-0 max-w-xl text-sm text-app-muted">
					Install it, open the playground, or read what changed in the latest release. Issues and stars are welcome on
					GitHub.
				</p>
				<div className="flex flex-wrap gap-3">
					<ButtonLink linkComponent={Link} linkProp="to" href="/getting-started">
						Get started
					</ButtonLink>
					<ButtonLink linkComponent={Link} linkProp="to" href="/changelog" variant="secondary">
						Changelog
					</ButtonLink>
					<ButtonLink href={GITHUB} variant="secondary" target="_blank" rel="noreferrer">
						Star on GitHub
						<ExternalLinkIcon />
					</ButtonLink>
				</div>
			</section>

			<footer className="-mb-2 flex flex-wrap items-center justify-between gap-3 border-t border-app-border pt-6">
				<p className="m-0 text-xs text-app-muted">Xedonium is MIT licensed.</p>
				<Signature />
			</footer>
		</div>
	)
}

export default Home
