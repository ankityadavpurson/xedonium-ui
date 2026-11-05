import { Timeline } from 'xedonium'

export default function Demo() {
	return (
		<Timeline
			items={[
				{ key: 1, title: 'Launched', description: 'Rocket v1.4.0 to the moon', time: '10:42', tone: 'success' },
				{ key: 2, title: 'Gru approved the plan', time: '09:15' },
				{ key: 3, title: 'Banana shortage', description: 'The fridge was empty', time: 'Yesterday', tone: 'danger' },
			]}
		/>
	)
}
