import { Timeline } from 'xedonium'

export default function Demo() {
	return (
		<Timeline
			branches={[
				{ id: 'main', label: 'main' },
				{ id: 'login', label: 'feature/freeze-ray' },
				{ id: 'hotfix', label: 'hotfix/banana-1.4.1' },
			]}
			items={[
				{ key: 1, title: 'Lair opened', time: 'Mon', tone: 'success' },
				{ key: 2, title: 'Start freeze ray', description: 'Branched from main', time: 'Tue', branch: 'login' },
				{ key: 3, title: 'Banana bug reported', time: 'Tue', tone: 'danger' },
				{ key: 4, title: 'Fix banana rounding', time: 'Wed', branch: 'hotfix', forkFrom: 'main' },
				{ key: 5, title: 'Freeze ray done', time: 'Wed', branch: 'login' },
				{
					key: 6,
					title: 'Lair upgraded',
					description: 'Hotfix merged',
					time: 'Thu',
					tone: 'success',
					mergeFrom: 'hotfix',
				},
				{ key: 7, title: 'Freeze ray merged', description: 'Gru approved', time: 'Fri', mergeFrom: 'login' },
			]}
		/>
	)
}
