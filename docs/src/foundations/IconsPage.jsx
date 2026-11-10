import { memo, useDeferredValue, useMemo, useState } from 'react'
import * as Xedonium from 'xedonium'
import { Button, Field, Label, Modal } from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import Markdown from '../components/Markdown'
import Page, { H2 } from '../views/Page'

// LogoutIcon is the old spelling of LogOutIcon (the same component), so the grid shows it once
const ICONS = Object.entries(Xedonium)
	.filter(([name]) => name.endsWith('Icon') && name !== 'LogoutIcon')
	.sort(([a], [b]) => a.localeCompare(b))
// Lowercased once, in the same order as ICONS, for the filter
const NAMES = ICONS.map(([name]) => name.toLowerCase())

// Tailwind classes written out in full so they are generated; the label is the pixel size
const SIZES = [
	['h-4 w-4', '16'],
	['h-5 w-5', '20'],
	['h-6 w-6', '24'],
	['h-8 w-8', '32'],
	['h-12 w-12', '48'],
]

// The module an icon lives in: its export name without "Icon"
const moduleOf = name => name.replace(/Icon$/, '')

const IconDialog = ({ name, Icon, onClose }) => (
	<Modal open onClose={onClose} title={<span className="normal-case tracking-normal">{name}</span>} maxWidth="max-w-xl">
		<div className="flex flex-col gap-5 p-6">
			<section className="flex flex-col gap-2" aria-label="Sizes">
				<Label as="h3">Sizes</Label>
				<ul className="m-0 flex list-none flex-wrap items-end justify-around gap-6 border border-app-border bg-app-bg p-4 text-app-text">
					{SIZES.map(([classes, px]) => (
						<li key={classes} className="flex flex-col items-center gap-2">
							<Icon className={classes} />
							<span className="text-[10px] tabular-nums text-app-muted">{px}px</span>
						</li>
					))}
				</ul>
				<p className="m-0 text-xs text-app-muted">
					Size and color come from <code>className</code>: use <code>h-4 w-4</code> up to <code>h-12 w-12</code>, and
					the icon follows the text color.
				</p>
			</section>
			<section className="flex flex-col gap-2" aria-label="Import">
				<Label as="h3">Import</Label>
				<CodeBlock code={`import { ${name} } from 'xedonium'`} />
				<CodeBlock code={`import ${name} from 'xedonium/icons/${moduleOf(name)}'`} />
			</section>
			<section className="flex flex-col gap-2" aria-label="Usage">
				<Label as="h3">Usage</Label>
				<CodeBlock code={`<${name} className="h-6 w-6" />`} />
			</section>
		</div>
	</Modal>
)

// One tile of the grid. Memoized, and hidden instead of unmounted when the filter excludes it, so typing only flips
// the `hidden` attribute on the tiles whose match changed instead of rebuilding hundreds of buttons and SVGs.
const IconTile = memo(({ name, Icon, hidden, onSelect }) => (
	<li hidden={hidden}>
		<Button
			variant="secondary"
			onClick={() => onSelect(name)}
			aria-haspopup="dialog"
			className="flex h-full w-full flex-col items-center gap-2 !px-2 !py-3 !normal-case !tracking-normal"
		>
			<Icon className="h-6 w-6" />
			<span className="max-w-full break-all text-[11px] font-medium leading-tight">{name}</span>
		</Button>
	</li>
))
IconTile.displayName = 'IconTile'

const IconsPage = () => {
	const [query, setQuery] = useState('')
	const [selected, setSelected] = useState(null)
	// The input updates at once; the grid follows with the deferred value, so fast typing never waits for the grid
	const deferredQuery = useDeferredValue(query)
	const needle = deferredQuery.trim().toLowerCase().replace(/icon$/, '')
	const matches = useMemo(() => NAMES.map(name => !needle || name.includes(needle)), [needle])
	const count = useMemo(() => matches.filter(Boolean).length, [matches])
	const chosen = ICONS.find(([name]) => name === selected)

	return (
		<Page title="Icons" subtitle={`${ICONS.length} inline SVGs`}>
			<Markdown>
				{
					"Icons are dependency-free inline SVGs drawn on a 24px grid as 2px outlines with square ends and sharp corners (circles and arcs only where the shape is round), so they inherit `currentColor`. A few stay rounded on purpose (`EyeIcon`, `EyeOffIcon`, `MapPinIcon`, `RocketIcon` and the three shields), and brand marks keep their original filled artwork: `GithubIcon`, `WhatsappIcon`, and the operating system and database logos (`WindowsIcon`, `AppleIcon`, `LinuxIcon`, `MysqlIcon` with its `MysqlNameIcon` and `MysqlLogoIcon` parts, `PostgresqlIcon`, `RedisIcon` and the classic `OldRedisIcon`, ...). The logos are one-colour paths from [Simple Icons](https://simpleicons.org) (CC0 1.0; `WindowsIcon` is drawn here), and each brand name is a trademark of its owner, so check the brand's usage rules before using a logo in a product. Pass `className` to size or color them (new icons default to `h-4 w-4`; the first few older ones have their own defaults). They are decorative (`aria-hidden`): put the accessible label on the button or control around them. Each icon is also its own module, as `xedonium/icons/<Name>`. Click an icon to see it at different sizes and copy its import."
				}
			</Markdown>
			<H2>All icons</H2>
			<div className="flex flex-wrap items-end gap-x-4 gap-y-2">
				<div className="w-full max-w-xs">
					<Field label="Filter" value={query} onChange={setQuery} placeholder="search, arrow, user…" required={false} />
				</div>
				<p role="status" className="m-0 pb-2 text-sm tabular-nums text-app-muted">
					{needle ? `${count} of ${ICONS.length} icons` : `${ICONS.length} icons`}
				</p>
			</div>
			{count === 0 && <p className="m-0 text-sm text-app-muted">No icon matches “{deferredQuery}”.</p>}
			<ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 md:grid-cols-5">
				{ICONS.map(([name, Icon], index) => (
					<IconTile key={name} name={name} Icon={Icon} hidden={!matches[index]} onSelect={setSelected} />
				))}
			</ul>
			{chosen && <IconDialog name={chosen[0]} Icon={chosen[1]} onClose={() => setSelected(null)} />}
		</Page>
	)
}

export default IconsPage
