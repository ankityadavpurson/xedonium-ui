import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Card, Grid, Label, PageHeader, useDocumentTitle } from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import Example from '../components/Example'
import Markdown, { Code } from '../components/Markdown'
import Neighbour from '../components/Neighbour'
import PropsTable from '../components/PropsTable'
import { pages, pathOf, propsFor } from '../content'
import { guidePath } from '../guides/hooks'
import NotFound from './NotFound'

// Demo components and their source text, keyed by path, e.g. "../examples/hooks/usetimedtoast-1.jsx"
const demos = import.meta.glob('../examples/**/*.jsx', { eager: true })
const sources = import.meta.glob('../examples/**/*.jsx', { query: '?raw', import: 'default', eager: true })

const exampleOf = entry => {
	if (!entry.example) return null
	const key = typeof entry.example === 'string' ? `../examples/hooks/${entry.example}` : entry.example.from
	return { Demo: demos[key]?.default, source: sources[key] }
}

// Docs page of a component, by its name or by a name documented on the page (e.g. ConfirmDialog)
const pageOf = name =>
	pages.find(p => p.component.name === name || Object.keys(propsFor(p.component) ?? {}).includes(name))

/** /hooks and /theme: a card per page. */
export const GuideIndex = ({ section }) => {
	useDocumentTitle(section.label, 'Xedonium')
	return (
		<div className="flex flex-col gap-6">
			<PageHeader title={section.label} subtitle={`${section.items.length} pages`} />
			<p className="m-0 max-w-2xl text-sm text-app-text">{section.description}</p>
			<Grid cols={3} gap={4}>
				{section.items.map(entry => (
					<Link key={entry.id} to={guidePath(section, entry)} className="block transition hover:opacity-90">
						<Card title={entry.name} className="h-full hover:border-app-strong">
							<span className="text-xs text-app-muted">{entry.summary}</span>
						</Card>
					</Link>
				))}
			</Grid>
		</div>
	)
}

/** /hooks/:id and /theme/:id: one hook or theme piece. */
export const GuideEntry = ({ section }) => {
	const { id } = useParams()
	const index = section.items.findIndex(item => item.id === id)
	const entry = section.items[index]
	useDocumentTitle(entry?.name ?? 'Not found', 'Xedonium')
	if (!entry) return <NotFound />

	const example = exampleOf(entry)
	const previous = section.items[index - 1]
	const next = section.items[index + 1]

	return (
		<article className="flex flex-col gap-8">
			<div className="flex flex-col gap-3">
				<Breadcrumb
					linkComponent={Link}
					linkProp="to"
					items={[{ label: section.label, href: section.path }, { label: entry.name }]}
				/>
				<PageHeader title={entry.name} subtitle={entry.summary} />
			</div>
			<CodeBlock code={entry.signature} />
			<Markdown>{entry.md}</Markdown>
			{example && <Example {...example} />}
			{!example && entry.code && <CodeBlock code={entry.code} />}
			{entry.api && (
				<section className="flex flex-col gap-3">
					<Label as="h2">API</Label>
					<PropsTable groups={entry.api} />
				</section>
			)}
			{(entry.usedBy || entry.see) && (
				<p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-app-muted">
					<span>See also:</span>
					{(entry.see ?? []).map(([label, to]) => (
						<Link key={to} to={to} className="underline underline-offset-2 hover:text-app-text">
							{label}
						</Link>
					))}
					{(entry.usedBy ?? []).map(name => {
						const page = pageOf(name)
						return page ? (
							<Link
								key={name}
								to={pathOf(page.category, page.component)}
								className="underline underline-offset-2 hover:text-app-text"
							>
								{name}
							</Link>
						) : (
							<Code key={name}>{name}</Code>
						)
					})}
				</p>
			)}
			<nav aria-label="Previous and next" className="flex gap-3 border-t border-app-border pt-6">
				<Neighbour
					to={previous && guidePath(section, previous)}
					name={previous?.name}
					label="Previous"
					align="text-left"
				/>
				<Neighbour to={next && guidePath(section, next)} name={next?.name} label="Next" align="text-right" next />
			</nav>
		</article>
	)
}
