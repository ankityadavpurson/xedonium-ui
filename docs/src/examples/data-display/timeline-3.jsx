import { Timeline } from 'xedonium'

export default function Demo() {
	return (
		<Timeline
			orientation="horizontal"
			branches={[{ id: 'main' }, { id: 'login', label: 'feature/freeze-ray' }]}
			items={[
				{ key: 1, title: 'Lair opened', time: 'Mon', tone: 'success' },
				{ key: 2, title: 'Start freeze ray', description: 'Branched from main', time: 'Tue', branch: 'login' },
				{ key: 3, title: 'Banana bug reported', time: 'Tue', tone: 'danger' },
				{ key: 4, title: 'Freeze ray done', time: 'Wed', branch: 'login' },
				{ key: 5, title: 'Freeze ray merged', description: 'Gru approved', time: 'Thu', mergeFrom: 'login' },
			]}
		/>
	)
}
