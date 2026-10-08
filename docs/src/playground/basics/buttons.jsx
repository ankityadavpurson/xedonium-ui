import { useState } from 'react'
import { ActionMenu, Button, ButtonGroup, ButtonLink, Toast, Tooltip, useTimedToast } from 'xedonium'

export default function Demo() {
	const { toast, showToast } = useTimedToast()
	const [view, setView] = useState('week')

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Button>Default</Button>
			<ButtonLink href="#link" variant="secondary">
				Link
			</ButtonLink>
			<Button variant="secondary">Secondary</Button>
			<Button variant="flat">Flat</Button>
			<Button variant="success">Success</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="warning">Warning</Button>
			<ButtonGroup aria-label="Calendar view">
				{['day', 'week', 'month'].map(name => (
					<Button
						key={name}
						variant={view === name ? 'default' : 'secondary'}
						aria-pressed={view === name}
						onClick={() => setView(name)}
					>
						{name}
					</Button>
				))}
			</ButtonGroup>
			<ButtonGroup aria-label="Document actions">
				<Button variant="secondary">Copy</Button>
				<Button variant="secondary">Paste</Button>
				<Button variant="danger">Delete</Button>
				<Button variant="secondary" disabled>
					Share
				</Button>
			</ButtonGroup>
			<ButtonGroup orientation="vertical" aria-label="Zoom">
				<Button variant="secondary">Zoom in</Button>
				<Button variant="secondary">Reset</Button>
				<Button variant="secondary">Zoom out</Button>
			</ButtonGroup>
			<ButtonGroup attached={false} aria-label="Dialog actions">
				<Button variant="flat">Cancel</Button>
				<Button>Save</Button>
			</ButtonGroup>
			<ButtonGroup fullWidth aria-label="Plan" className="basis-full">
				<Button variant="secondary">Monthly</Button>
				<Button>Yearly</Button>
				<Button variant="secondary">Lifetime</Button>
			</ButtonGroup>
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
			<Toast toast={toast} />
		</div>
	)
}
