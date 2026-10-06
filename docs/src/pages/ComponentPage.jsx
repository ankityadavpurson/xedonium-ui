import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Label, PageHeader, useDocumentTitle } from 'xedonium'
import Example from '../components/Example'
import FullPagePreview from '../components/FullPagePreview'
import Markdown from '../components/Markdown'
import PropsTable from '../components/PropsTable'
import { exampleFor, findPage, pages, pathOf, propsFor } from '../content'
import { playgroundPath, sectionFor } from '../playground'
import NotFound from './NotFound'

// Docs-only blocks that are components instead of Markdown or an example file
const CUSTOM_BLOCKS = { 'full-page-preview': FullPagePreview }

const Neighbour = ({ page, label, align }) =>
	page ? (
		<Link
			to={pathOf(page.category, page.component)}
			className={`flex min-w-0 flex-1 flex-col gap-1 break-words border border-app-border bg-app-card p-4 transition hover:border-app-strong ${align}`}
		>
			<span className="text-[10px] font-semibold uppercase tracking-widest text-app-muted">{label}</span>
			<span className="text-sm font-semibold text-app-text">{page.component.name}</span>
		</Link>
	) : (
		<span className="flex-1" />
	)

const ComponentPage = () => {
	const { category: categorySlug, slug } = useParams()
	const page = findPage(categorySlug, slug)
	useDocumentTitle(page?.component.name ?? 'Not found', 'Xedonium')
	if (!page) return <NotFound />

	const { category, component } = page
	const index = pages.indexOf(page)
	const props = propsFor(component)
	const playground = sectionFor(Object.keys(props ?? {}))

	return (
		<article className="flex flex-col gap-8">
			<div className="flex flex-col gap-3">
				<Breadcrumb
					linkComponent={Link}
					linkProp="to"
					items={[
						{ label: 'Components', href: '/components/' + category.slug },
						{ label: category.label, href: '/components/' + category.slug },
						{ label: component.name },
					]}
				/>
				<PageHeader title={component.name}>
					{playground && (
						<Link
							to={playgroundPath(playground)}
							className="border border-app-border bg-app-bg px-3 py-2 text-xs font-semibold uppercase tracking-widest text-app-text transition hover:border-app-strong"
						>
							Open in Playground
						</Link>
					)}
				</PageHeader>
			</div>
			{component.blocks.map((block, i) => {
				if (block.md) return <Markdown key={i}>{block.md}</Markdown>
				if (block.custom) {
					const Custom = CUSTOM_BLOCKS[block.custom]
					return Custom ? <Custom key={i} /> : null
				}
				return <Example key={i} {...exampleFor(category, component, block.example)} />
			})}
			{props && (
				<section className="flex flex-col gap-3">
					<Label as="h2">Props</Label>
					<PropsTable groups={props} />
				</section>
			)}
			<nav aria-label="Previous and next" className="flex gap-3 border-t border-app-border pt-6">
				<Neighbour page={pages[index - 1]} label="Previous" align="text-left" />
				<Neighbour page={pages[index + 1]} label="Next" align="text-right" />
			</nav>
		</article>
	)
}

export default ComponentPage
