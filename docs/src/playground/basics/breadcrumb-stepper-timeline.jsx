import { Breadcrumb, Stepper, Timeline } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-col gap-4">
			<Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Apps', href: '#' }, { label: 'Detail' }]} />
			<Stepper
				steps={[{ label: 'Account' }, { label: 'Profile', description: 'Tell us more' }, { label: 'Done' }]}
				current={1}
			/>
			<Timeline
				items={[
					{ key: 1, title: 'Deployed', time: '2m ago', tone: 'success', description: 'Build 42' },
					{ key: 2, title: 'Cold start slow', time: '1h ago', tone: 'warning' },
					{ key: 3, title: 'Failed health check', time: '3h ago', tone: 'danger' },
					{ key: 4, title: 'Created' },
				]}
			/>
		</div>
	)
}
