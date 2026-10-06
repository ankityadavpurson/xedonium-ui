import { useState } from 'react'
import * as Xedonium from 'xedonium'
import { Button, Field, Label, Modal } from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import Markdown from '../components/Markdown'
import Page, { H2 } from '../pages/Page'

const ICONS = Object.entries(Xedonium)
	.filter(([name]) => name.endsWith('Icon'))
	.sort(([a], [b]) => a.localeCompare(b))

// Tailwind classes written out in full so they are generated; the label is the pixel size
const SIZES = [
	['h-4 w-4', '16'],
	['h-5 w-5', '20'],
	['h-6 w-6', '24'],
	['h-8 w-8', '32'],
	['h-12 w-12', '48'],
]

// The module an icon lives in: its export name without "Icon" (the old LogoutIcon is the LogOut module)
const moduleOf = name => (name === 'LogoutIcon' ? 'LogOut' : name.replace(/Icon$/, ''))

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

const IconsPage = () => {
	const [query, setQuery] = useState('')
	const [selected, setSelected] = useState(null)
	const needle = query.trim().toLowerCase().replace(/icon$/, '')
	const shown = needle ? ICONS.filter(([name]) => name.toLowerCase().includes(needle)) : ICONS
	const chosen = ICONS.find(([name]) => name === selected)

	return (
		<Page title="Icons" subtitle={`${ICONS.length} inline SVGs`}>
			<Markdown>
				{
					'Icons are dependency-free inline SVGs drawn on a 24px grid as 2px outlines with square ends and sharp corners (circles and arcs only where the shape is round), so they inherit `currentColor`. A few stay rounded on purpose (`EyeIcon`, `EyeOffIcon`, `MapPinIcon`, `RocketIcon` and the three shields), and brand marks such as `GithubIcon` keep their original filled artwork. Pass `className` to size or color them (new icons default to `h-4 w-4`; the first few older ones have their own defaults). They are decorative (`aria-hidden`): put the accessible label on the button or control around them. Each icon is also its own module, as `xedonium/icons/<Name>`. Click an icon to see it at different sizes and copy its import.'
				}
			</Markdown>
			<H2>All icons</H2>
			<div className="max-w-xs">
				<Field label="Filter" value={query} onChange={setQuery} placeholder="search, arrow, user…" required={false} />
			</div>
			{shown.length === 0 && <p className="m-0 text-sm text-app-muted">No icon matches “{query}”.</p>}
			<ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 md:grid-cols-5">
				{shown.map(([name, Icon]) => (
					<li key={name}>
						<Button
							variant="secondary"
							onClick={() => setSelected(name)}
							aria-haspopup="dialog"
							className="flex h-full w-full flex-col items-center gap-2 !px-2 !py-3 !normal-case !tracking-normal"
						>
							<Icon className="h-6 w-6" />
							<span className="max-w-full break-all text-[11px] font-medium leading-tight">{name}</span>
						</Button>
					</li>
				))}
			</ul>
			{chosen && <IconDialog name={chosen[0]} Icon={chosen[1]} onClose={() => setSelected(null)} />}
		</Page>
	)
}

export default IconsPage
