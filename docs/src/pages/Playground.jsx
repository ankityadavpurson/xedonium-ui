import { Tabs } from 'xedonium'
import LiveSection from '../components/LiveSection'
import { sourceOf, tabs } from '../playground'
import Page from './Page'

// Every component on one screen. Each section shows its code; edit it and the result updates live.
const Playground = () => (
	<Page title="Playground" subtitle="Edit the code, see it run">
		<Tabs
			items={tabs.map(({ key, label, sections }) => ({
				key,
				label,
				content: (
					<div className="flex flex-col gap-4 pt-4">
						{sections.map(([slug, title]) => (
							<LiveSection key={slug} title={title} source={sourceOf(key, slug)} />
						))}
					</div>
				),
			}))}
		/>
	</Page>
)

export default Playground
