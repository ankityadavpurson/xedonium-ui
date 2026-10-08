import { useState } from 'react'
import { Button, ButtonGroup } from 'xedonium'

export default function Demo() {
	const [view, setView] = useState('week')

	return (
		<div className="flex flex-col items-start gap-6">
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
		</div>
	)
}
