import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, PageHeader, useDocumentTitle } from 'xedonium'
import Example from '../components/Example'
import Markdown from '../components/Markdown'
import PropsTable from '../components/PropsTable'
import { exampleFor, findPage, pages, pathOf, propsFor } from '../content'
import NotFound from './NotFound'

const Neighbour = ({ page, label, align }) =>
	page ? (
		<Link
			to={pathOf(page.category, page.component)}
			className={`flex flex-1 flex-col gap-1 border border-app-border bg-app-card p-4 transition hover:border-app-strong ${align}`}
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
				<PageHeader title={component.name} />
			</div>
			{component.blocks.map((block, i) =>
				block.md ? (
					<Markdown key={i}>{block.md}</Markdown>
				) : (
					<Example key={i} {...exampleFor(category, component, block.example)} />
				)
			)}
			{props && (
				<section className="flex flex-col gap-3">
					<h2 className="m-0 text-xs font-semibold uppercase tracking-widest text-app-muted">Props</h2>
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
