import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, Label, PageHeader, useDocumentTitle } from 'xedonium'
import Example from '../components/Example'
import FullPagePreview from '../components/FullPagePreview'
import Markdown from '../components/Markdown'
import Neighbour from '../components/Neighbour'
import PropsTable from '../components/PropsTable'
import { relatedGuides } from '../guides/hooks'
import { findPage, pages, pathOf } from '../content'
import { propsFor } from '../content/propsFor'
import { exampleKey } from '../exampleLoader'
import { playgroundPath } from '../playground'
import NotFound from './NotFound'

// Docs-only blocks that are components instead of Markdown or an example file
const CUSTOM_BLOCKS = { 'full-page-preview': FullPagePreview }

const ComponentPage = () => {
	const { category: categorySlug, slug } = useParams()
	const page = findPage(categorySlug, slug)
	useDocumentTitle(page?.component.name ?? 'Not found', 'Xedonium')
	if (!page) return <NotFound />

	const { category, component } = page
	const index = pages.indexOf(page)
	const props = propsFor(component)
	const related = relatedGuides([component.name, ...Object.keys(props ?? {})])

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
					<Link
						to={playgroundPath(category, component)}
						className="border border-app-border bg-app-bg px-3 py-2 text-xs font-semibold uppercase tracking-widest text-app-text transition hover:border-app-strong"
					>
						Open in Playground
					</Link>
				</PageHeader>
			</div>
			{component.blocks.map((block, i) => {
				if (block.md) return <Markdown key={i}>{block.md}</Markdown>
				if (block.custom) {
					const Custom = CUSTOM_BLOCKS[block.custom]
					return Custom ? <Custom key={i} /> : null
				}
				return <Example key={i} example={exampleKey(category, component, block.example)} />
			})}
			{props && (
				<section className="flex flex-col gap-3">
					<Label as="h2">Props</Label>
					<PropsTable groups={props} />
				</section>
			)}
			{related.length > 0 && (
				<p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-app-muted">
					<span>Related hooks and theme:</span>
					{related.map(({ id, name, path }) => (
						<Link key={id} to={path} className="underline underline-offset-2 hover:text-app-text">
							{name}
						</Link>
					))}
				</p>
			)}
			<nav aria-label="Previous and next" className="flex gap-3 border-t border-app-border pt-6">
				<Neighbour
					to={pages[index - 1] && pathOf(pages[index - 1].category, pages[index - 1].component)}
					name={pages[index - 1]?.component.name}
					label="Previous"
					align="text-left"
				/>
				<Neighbour
					to={pages[index + 1] && pathOf(pages[index + 1].category, pages[index + 1].component)}
					name={pages[index + 1]?.component.name}
					label="Next"
					align="text-right"
					next
				/>
			</nav>
		</article>
	)
}

export default ComponentPage
