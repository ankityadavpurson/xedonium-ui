import { useState } from 'react'
import {
	ActionMenu,
	Alert,
	Avatar,
	Breadcrumb,
	Button,
	Card,
	Divider,
	FanFavicon,
	Progress,
	RackServer,
	Skeleton,
	StatCard,
	Stepper,
	Timeline,
	Toast,
	Tooltip,
	useTimedToast,
} from 'xedonium'
import { Section } from './shared'

const Basics = () => {
	const [alert, setAlert] = useState(true)
	const { toast, showToast } = useTimedToast()

	return (
		<div className="flex flex-col gap-4">
			<Section title="Buttons">
				<Button>Default</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="success">Success</Button>
				<Button variant="danger">Danger</Button>
				<Button variant="warning">Warning</Button>
				<Button tooltip="Tooltip text">Hover me</Button>
				<Button disabled>Disabled</Button>
				<Tooltip text="Plain tooltip">
					<span className="border border-app-border px-2 py-1 text-xs">Tooltip target</span>
				</Tooltip>
				<ActionMenu
					label="Actions"
					trigger="Actions"
					items={[
						{ key: 'a', label: 'First', description: 'Does a thing', onClick: () => showToast('First') },
						{ key: 'b', label: 'Second', badge: 3, onClick: () => showToast('Second', 'error') },
					]}
				/>
			</Section>
			<Section title="Alerts" className="flex-col items-stretch">
				<Alert title="Heads up">Informational message.</Alert>
				<Alert tone="success" title="Saved">
					Everything worked.
				</Alert>
				<Alert tone="warning" title="Careful">
					This may take a while.
				</Alert>
				{alert && (
					<Alert tone="danger" title="Failed" onClose={() => setAlert(false)}>
						Something went wrong.
					</Alert>
				)}
			</Section>
			<Section title="Stat cards / Card" className="items-stretch">
				<StatCard label="Visits" value="1,204" delta="+12%" trend="up" hint="vs last week" />
				<StatCard label="Errors" value="8" delta="-3" trend="down" />
				<StatCard label="Uptime" value="99.9%" />
				<Card
					title="Card"
					subtitle="With header and footer"
					actions={<Button variant="secondary">Edit</Button>}
					footer="Footer"
				>
					Body content
				</Card>
			</Section>
			<Section title="Avatar / Progress / Skeleton / Divider">
				<Avatar name="Ada Lovelace" size="sm" />
				<Avatar name="Linus Torvalds" />
				<Avatar name="Grace Hopper" size="lg" />
				<div className="w-56">
					<Progress value={62} label="Upload" showValue />
				</div>
				<div className="w-56">
					<Progress label="Working" />
				</div>
				<div className="w-56">
					<Skeleton lines={3} />
				</div>
				<Skeleton circle className="h-10 w-10" />
				<div className="w-full">
					<Divider label="or" />
				</div>
			</Section>
			<Section title="Breadcrumb / Stepper / Timeline" className="flex-col items-stretch">
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
			</Section>
			<Section title="Loaders">
				<FanFavicon label="Loading" />
				<RackServer />
			</Section>
			<Toast toast={toast} />
		</div>
	)
}

export default Basics
