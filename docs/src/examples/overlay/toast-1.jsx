import { Button, Toast, useTimedToast } from 'xedonium'

export default function Demo() {
	const { toast, showToast } = useTimedToast()
	return (
		<>
			<div className="flex gap-3">
				<Button onClick={() => showToast('Saved')}>Success toast</Button>
				<Button variant="danger" onClick={() => showToast('Something failed', 'error')}>
					Error toast
				</Button>
			</div>
			<Toast toast={toast} />
		</>
	)
}
