import { useState } from 'react'
import { Button, Select, Toast, useTimedToast } from 'xedonium'

const POSITIONS = [
	'top-left',
	'top-center',
	'top-right',
	'middle-left',
	'middle-center',
	'middle-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
]

export default function Demo() {
	const { toasts, showToast, hideToast } = useTimedToast()
	const [position, setPosition] = useState('bottom-right')
	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="max-w-xs">
					<Select
						label="Position"
						value={position}
						onChange={setPosition}
						options={POSITIONS.map(value => ({ value, label: value }))}
					/>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button onClick={() => showToast('Banana saved')}>Success</Button>
					<Button variant="danger" onClick={() => showToast('Banana slipped', 'danger')}>
						Danger
					</Button>
					<Button variant="warning" onClick={() => showToast('Banana stock low', 'warning')}>
						Warning
					</Button>
					<Button variant="secondary" onClick={() => showToast('New Minion available', 'info')}>
						Info
					</Button>
					<Button
						variant="secondary"
						onClick={() =>
							showToast('Banana eaten', 'info', {
								duration: 0,
								actions: [{ label: 'Undo', onClick: () => showToast('Banana restored') }],
							})
						}
					>
						With action
					</Button>
				</div>
			</div>
			<Toast toasts={toasts} onClose={hideToast} position={position} />
		</>
	)
}
