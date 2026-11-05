import { Tabs } from 'xedonium'

export default function Demo() {
	return (
		<Tabs
			items={[
				{ key: 'a', label: 'Lair', content: 'Welcome to the lair.' },
				{ key: 'b', label: 'Bananas', content: 'Bananas eaten today: plenty.' },
				{ key: 'c', label: 'Disabled', disabled: true },
			]}
		/>
	)
}
