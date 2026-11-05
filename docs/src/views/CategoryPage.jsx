import { Link, useParams } from 'react-router-dom'
import { Card, Grid, PageHeader, useDocumentTitle } from 'xedonium'
import { categories, pathOf } from '../content'
import summaryOf from '../summaryOf'
import NotFound from './NotFound'

const CategoryPage = () => {
	const { category: slug } = useParams()
	const category = categories.find(c => c.slug === slug)
	useDocumentTitle(category?.label ?? 'Not found', 'Xedonium')
	if (!category) return <NotFound />

	return (
		<div className="flex flex-col gap-6">
			<PageHeader title={category.label} subtitle={`${category.components.length} components`} />
			<p className="m-0 max-w-2xl text-sm text-app-text">{category.description}</p>
			<Grid cols={3} gap={4}>
				{category.components.map(component => (
					<Link key={component.slug} to={pathOf(category, component)} className="block transition hover:opacity-90">
						<Card title={component.name} className="h-full hover:border-app-strong">
							<span className="text-xs text-app-muted">{summaryOf(component)}</span>
						</Card>
					</Link>
				))}
			</Grid>
		</div>
	)
}

export default CategoryPage
