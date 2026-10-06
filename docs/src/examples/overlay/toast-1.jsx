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
					<Button onClick={() => showToast('Saved')}>Success</Button>
					<Button variant="danger" onClick={() => showToast('Something failed', 'danger')}>
						Danger
					</Button>
					<Button variant="warning" onClick={() => showToast('Disk almost full', 'warning')}>
						Warning
					</Button>
					<Button variant="secondary" onClick={() => showToast('Update available', 'info')}>
						Info
					</Button>
					<Button
						variant="secondary"
						onClick={() =>
							showToast('Item deleted', 'info', {
								duration: 0,
								actions: [{ label: 'Undo', onClick: () => showToast('Restored') }],
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
