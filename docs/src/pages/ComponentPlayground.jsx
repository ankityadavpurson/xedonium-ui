import { Link, useParams } from 'react-router-dom'
import { Breadcrumb, PageHeader, useDocumentTitle } from 'xedonium'
import LiveSection from '../components/LiveSection'
import { findPage, pathOf } from '../content'
import { exampleKey } from '../exampleLoader'
import { exampleNumbers } from '../playground'
import NotFound from './NotFound'

// The live, editable examples of one component, under its docs URL: /components/<category>/<component>/playground
const ComponentPlayground = () => {
	const { category: categorySlug, slug } = useParams()
	const page = findPage(categorySlug, slug)
	useDocumentTitle(page ? `${page.component.name} playground` : 'Not found', 'Xedonium')
	if (!page) return <NotFound />

	const { category, component } = page
	const docs = pathOf(category, component)

	return (
		<article className="flex flex-col gap-6">
			<div className="flex flex-col gap-3">
				<Breadcrumb
					linkComponent={Link}
					linkProp="to"
					items={[
						{ label: 'Components', href: '/components/' + category.slug },
						{ label: category.label, href: '/components/' + category.slug },
						{ label: component.name, href: docs },
						{ label: 'Playground' },
					]}
				/>
				<PageHeader title={`${component.name} playground`} subtitle="Edit the code, the result updates as you type">
					<Link
						to={docs}
						className="border border-app-border bg-app-bg px-3 py-2 text-xs font-semibold uppercase tracking-widest text-app-text transition hover:border-app-strong"
					>
						Back to docs
					</Link>
				</PageHeader>
			</div>
			<LiveSection
				plain
				id={component.slug}
				title={component.name}
				keys={exampleNumbers(component).map(n => exampleKey(category, component, n))}
			/>
		</article>
	)
}

export default ComponentPlayground
