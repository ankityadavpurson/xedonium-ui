import { Timeline } from 'xedonium'

export default function Demo() {
	return (
		<Timeline
			items={[
				{ key: 1, title: 'Deployed', description: 'v1.4.0 to production', time: '10:42', tone: 'success' },
				{ key: 2, title: 'Review requested', time: '09:15' },
				{ key: 3, title: 'Build failed', description: 'Lint errors', time: 'Yesterday', tone: 'danger' },
			]}
		/>
	)
}
