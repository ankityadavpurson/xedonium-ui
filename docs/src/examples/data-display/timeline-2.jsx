import { Timeline } from 'xedonium'

export default function Demo() {
	return (
		<Timeline
			branches={[
				{ id: 'main', label: 'main' },
				{ id: 'login', label: 'feature/login' },
				{ id: 'hotfix', label: 'hotfix/1.4.1' },
			]}
			items={[
				{ key: 1, title: 'Release 1.4.0', time: 'Mon', tone: 'success' },
				{ key: 2, title: 'Start login work', description: 'Branched from main', time: 'Tue', branch: 'login' },
				{ key: 3, title: 'Payment bug reported', time: 'Tue', tone: 'danger' },
				{ key: 4, title: 'Fix payment rounding', time: 'Wed', branch: 'hotfix', forkFrom: 'main' },
				{ key: 5, title: 'Login form done', time: 'Wed', branch: 'login' },
				{
					key: 6,
					title: 'Release 1.4.1',
					description: 'Hotfix merged',
					time: 'Thu',
					tone: 'success',
					mergeFrom: 'hotfix',
				},
				{ key: 7, title: 'Login merged', description: 'Review approved', time: 'Fri', mergeFrom: 'login' },
			]}
		/>
	)
}
