import * as Xedonium from 'xedonium'
import { Link } from 'react-router-dom'
import { BodyText, Flex, HelperText, Label, PageTitle, Table, TextLink } from 'xedonium'
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
				"- [`ThemeProvider`](/theme/themeprovider) takes `storageKey`, `favicon` and `faviconTitle`.\n- [`useTheme()`](/theme/usetheme) returns `{ activeTheme, toggleTheme }`.\n- [`ThemeToggle`](/theme/themetoggle) is a ready-made button for `toggleTheme`.\n- [`useAppTheme`](/theme/useapptheme) is the hook behind the provider, for use without a context.\n- [`buildFaviconHref(theme)`](/theme/buildfaviconhref) builds a theme-colored favicon data URL.\n\nAll of them are documented, with examples, in the [Theme](/theme) section.\n\nTailwind's `dark:` variant is wired to the same attribute by the preset (`darkMode: ['selector', '[data-theme=\"dark\"]']`)."
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

// Each style is a library component: preview, the JSX to copy, and the page that documents it
const TYPE_STYLES = [
	{
		name: 'Page title',
		to: '/components/typography/page-title',
		code: '<PageTitle>Page title</PageTitle>',
		preview: <PageTitle>Page title</PageTitle>,
	},
	{
		name: 'Body',
		to: '/components/typography/body-text',
		code: '<BodyText>Body text uses text-sm and the app-text color.</BodyText>',
		preview: <BodyText>Body text uses text-sm and the app-text color.</BodyText>,
	},
	{
		name: 'Helper text',
		to: '/components/typography/helper-text',
		code: '<HelperText>Helper text uses text-xs and app-muted.</HelperText>',
		preview: <HelperText>Helper text uses text-xs and app-muted.</HelperText>,
	},
	{
		name: 'Label',
		to: '/components/typography/label',
		code: '<Label>Label</Label>',
		preview: <Label>Label</Label>,
	},
	{
		name: 'Link',
		to: '/components/typography/text-link',
		code: '<TextLink href="#">Link</TextLink>',
		preview: <TextLink href="#">Link</TextLink>,
	},
]

const TypographyPage = () => (
	<Page title="Typography" subtitle="Type scale">
		<Markdown>
			The library inherits your font family. Each text style below is a component; click a name for its props and
			examples, or copy the markup.
		</Markdown>
		{TYPE_STYLES.map(({ name, to, code, preview }) => (
			<section key={name} className="flex flex-col gap-2">
				<H2>
					<Link to={to} className="underline-offset-2 hover:underline">
						{name}
					</Link>
				</H2>
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
