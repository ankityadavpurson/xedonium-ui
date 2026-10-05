import { Tabs } from 'xedonium'
import Page from './Page'
import Basics from '../playground/Basics'
import Data from '../playground/Data'
import Forms from '../playground/Forms'
import Layout from '../playground/Layout'
import Overlays from '../playground/Overlays'

const tab = (key, label, Content) => ({
	key,
	label,
	content: (
		<div className="pt-4">
			<Content />
		</div>
	),
})

// Every component on one screen, for visual checks in light and dark
const Playground = () => (
	<Page title="Playground" subtitle="Every component, light and dark">
		<Tabs
			items={[
				tab('basics', 'Basics', Basics),
				tab('forms', 'Forms', Forms),
				tab('data', 'Data', Data),
				tab('overlays', 'Overlays', Overlays),
				tab('layout', 'Layout', Layout),
			]}
		/>
	</Page>
)

export default Playground
