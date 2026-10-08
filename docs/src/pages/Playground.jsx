import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Tabs } from 'xedonium'
import LiveSection from '../components/LiveSection'
import { categories } from '../content'
import { exampleKey } from '../exampleLoader'
import { exampleNumbers } from '../playground'
import Page from './Page'

// Every docs category is a tab and its own page (/playground/inputs); every component of it is a section that opens
// to its live, editable examples. Deep link: /playground/inputs#button opens that section, scrolls to it and shows its code.
const Playground = () => {
	const { category: slug } = useParams()
	const navigate = useNavigate()
	const target = useLocation().hash.slice(1)
	const category = categories.find(c => c.slug === slug)
	if (!category) return <Navigate to={`/playground/${categories[0].slug}`} replace />

	return (
		<Page title="Playground" subtitle="Pick a category, open a component, edit the code">
			<Tabs
				value={category.slug}
				onChange={key => navigate(`/playground/${key}`)}
				items={categories.map(({ slug: key, label, components }) => ({
					key,
					label,
					content:
						key === category.slug ? (
							<div className="flex flex-col gap-2 pt-4">
								{components.map(component => (
									<LiveSection
										key={component.slug}
										id={component.slug}
										title={component.name}
										keys={exampleNumbers(component).map(n => exampleKey(category, component, n))}
										focused={component.slug === target}
									/>
								))}
							</div>
						) : undefined,
				}))}
			/>
		</Page>
	)
}

export default Playground
