import { Tabs } from 'xedonium'

export default function Demo() {
	return (
		<Tabs
			items={[
				{ key: 'a', label: 'Overview', content: 'Overview content' },
				{ key: 'b', label: 'Activity', content: 'Activity content' },
				{ key: 'c', label: 'Disabled', disabled: true },
			]}
		/>
	)
}
