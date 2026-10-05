import * as Xedonium from 'xedonium'
import { Flex, Table } from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import { Code } from '../components/Markdown'
import Markdown from '../components/Markdown'
import Page, { H2 } from './Page'

const ThemePage = () => (
	<Page title="Theme" subtitle="Light and dark">
		<Markdown>
			{
				'Light and dark are driven by `<html data-theme="light|dark">`. Wrap your app in `ThemeProvider` to set it: it follows the OS until the user toggles, and persists the override under `storageKey`.'
			}
		</Markdown>
		<CodeBlock
			code={`<ThemeProvider storageKey="my-app-theme" favicon>
	<App />
</ThemeProvider>`}
		/>
		<Markdown>
			{
				"- `useTheme()` returns `{ activeTheme, toggleTheme }`.\n- `ThemeToggle` is a ready-made button for `toggleTheme`.\n- `buildFaviconHref(theme)` builds a theme-colored favicon data URL.\n\nTailwind's `dark:` variant is wired to the same attribute by the preset (`darkMode: ['selector', '[data-theme=\"dark\"]']`)."
			}
		</Markdown>
	</Page>
)

const TOKENS = [
	['bg', 'Page background, input fill'],
	['card', 'Surfaces: cards, dialogs'],
	['border', 'Borders and dividers'],
	['text', 'Primary text'],
	['muted', 'Secondary text, labels'],
	['soft', 'Titles, emphasis'],
	['strong', 'Primary actions, focus rings'],
]

const ColorsPage = () => (
	<Page title="Colors & tokens" subtitle="Semantic app-* colors">
		<Markdown>
			{
				'Colors are space-separated RGB channel variables, exposed to Tailwind as `app-*` colors so opacity modifiers work (`bg-app-strong/20`). They change with the theme.'
			}
		</Markdown>
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{TOKENS.map(([name]) => (
				<div key={name} className="flex flex-col gap-1">
					<div className="h-12 border border-app-border" style={{ background: `rgb(var(--color-app-${name}))` }} />
					<Code>app-{name}</Code>
				</div>
			))}
		</div>
		<Table
			caption="Color tokens"
			rowKey="name"
			columns={[
				{ key: 'name', header: 'Token', render: row => <Code>app-{row.name}</Code> },
				{ key: 'variable', header: 'CSS variable', render: row => <Code>--color-app-{row.name}</Code> },
				{ key: 'use', header: 'Use' },
			]}
			rows={TOKENS.map(([name, use]) => ({ name, use }))}
		/>
		<Markdown>
			{
				'Other tokens: `--xd-z-modal` (80), `--xd-z-popover` (85, menus, pickers, popovers), `--xd-z-toast` (90) and `--xd-z-tooltip` (100) control overlay stacking, and the preset adds the `fade-up` and `indeterminate` animations.'
			}
		</Markdown>
	</Page>
)

// Each style: preview markup plus the exact JSX to copy
const TYPE_STYLES = [
	{
		name: 'Page title',
		code: '<h1 className="text-2xl font-bold tracking-tight text-app-text sm:text-3xl">Page title</h1>',
		preview: <h1 className="m-0 text-2xl font-bold tracking-tight text-app-text sm:text-3xl">Page title</h1>,
	},
	{
		name: 'Body',
		code: '<p className="text-sm text-app-text">Body text uses text-sm and the app-text color.</p>',
		preview: <p className="m-0 text-sm text-app-text">Body text uses text-sm and the app-text color.</p>,
	},
	{
		name: 'Helper text',
		code: '<p className="text-xs text-app-muted">Helper text uses text-xs and app-muted.</p>',
		preview: <p className="m-0 text-xs text-app-muted">Helper text uses text-xs and app-muted.</p>,
	},
	{
		name: 'Label',
		code: '<span className="text-xs font-semibold uppercase tracking-widest text-app-muted">Label</span>',
		preview: <span className="text-xs font-semibold uppercase tracking-widest text-app-muted">Label</span>,
	},
	{
		name: 'Link',
		code: '<a href="#" className="text-sm text-app-text underline underline-offset-2 hover:text-app-strong">Link</a>',
		preview: (
			<a href="#" className="text-sm text-app-text underline underline-offset-2 hover:text-app-strong">
				Link
			</a>
		),
	},
]

const TypographyPage = () => (
	<Page title="Typography" subtitle="Type scale">
		<Markdown>
			The library inherits your font family. Labels use small, bold, uppercase, widely tracked text; body text is
			`text-sm`. Copy the markup for any style below.
		</Markdown>
		{TYPE_STYLES.map(({ name, code, preview }) => (
			<section key={name} className="flex flex-col gap-2">
				<H2>{name}</H2>
				<div className="border border-app-border bg-app-bg p-4">{preview}</div>
				<CodeBlock code={code} />
			</section>
		))}
	</Page>
)

const ICONS = Object.entries(Xedonium).filter(([name]) => name.endsWith('Icon'))

const IconsPage = () => (
	<Page title="Icons" subtitle={`${ICONS.length} inline SVGs`}>
		<Markdown>
			Icons are inline SVGs that inherit `currentColor`. Pass `className` to size or color them (the defaults vary per
			icon).
		</Markdown>
		<H2>All icons</H2>
		<Flex wrap gap={6} className="text-app-text">
			{ICONS.map(([name, Icon]) => (
				<div key={name} className="flex w-28 flex-col items-center gap-2">
					<Icon className="h-6 w-6" />
					<Code>{name}</Code>
				</div>
			))}
		</Flex>
	</Page>
)

export const foundations = [
	{ path: '/foundations/theme', title: 'Theme', Page: ThemePage },
	{ path: '/foundations/colors', title: 'Colors & tokens', Page: ColorsPage },
	{ path: '/foundations/typography', title: 'Typography', Page: TypographyPage },
	{ path: '/foundations/icons', title: 'Icons', Page: IconsPage },
]
