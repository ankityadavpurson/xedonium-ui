import { Timeline } from 'xedonium'

export default function Demo() {
	return (
		<Timeline
			orientation="horizontal"
			branches={[{ id: 'main' }, { id: 'login', label: 'feature/login' }]}
			items={[
				{ key: 1, title: 'Release 1.4.0', time: 'Mon', tone: 'success' },
				{ key: 2, title: 'Start login work', description: 'Branched from main', time: 'Tue', branch: 'login' },
				{ key: 3, title: 'Payment bug reported', time: 'Tue', tone: 'danger' },
				{ key: 4, title: 'Login form done', time: 'Wed', branch: 'login' },
				{ key: 5, title: 'Login merged', description: 'Review approved', time: 'Thu', mergeFrom: 'login' },
			]}
		/>
	)
}
