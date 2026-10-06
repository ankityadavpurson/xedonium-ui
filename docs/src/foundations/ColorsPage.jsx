import { Table } from 'xedonium'
import { Code } from '../components/Markdown'
import Markdown from '../components/Markdown'
import Page from '../pages/Page'

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

export default ColorsPage
