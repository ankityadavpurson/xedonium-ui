import { Button, Toast, useTimedToast } from 'xedonium'

export default function Demo() {
	const { toasts, showToast, hideToast } = useTimedToast()
	return (
		<>
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
			<Toast toasts={toasts} onClose={hideToast} />
		</>
	)
}
