import { useSearchParams } from 'react-router-dom'
import { Tabs } from 'xedonium'
import LiveSection from '../components/LiveSection'
import { sourceOf, tabs } from '../playground'
import Page from './Page'

// Every component on one screen. Each section shows its code; edit it and the result updates live.
// Deep links: /playground?tab=forms&section=text-inputs opens that tab, scrolls to the section and shows its code.
const Playground = () => {
	const [params, setParams] = useSearchParams()
	const target = params.get('section')
	const requested = params.get('tab')
	const tab = tabs.some(t => t.key === requested) ? requested : tabs[0].key

	return (
		<Page title="Playground" subtitle="Edit the code, see it run">
			<Tabs
				value={tab}
				onChange={key => setParams({ tab: key }, { replace: true })}
				items={tabs.map(({ key, label, sections }) => ({
					key,
					label,
					content: (
						<div className="flex flex-col gap-4 pt-4">
							{sections.map(([slug, title]) => (
								<LiveSection
									key={slug}
									id={`playground-${slug}`}
									focused={slug === target}
									title={title}
									source={sourceOf(key, slug)}
								/>
							))}
						</div>
					),
				}))}
			/>
		</Page>
	)
}

export default Playground
