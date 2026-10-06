import { Button, Toast, useTimedToast } from 'xedonium'

export default function Demo() {
	const { toasts, showToast, hideToast } = useTimedToast(4000, { max: 3 })
	return (
		<>
			<div className="flex flex-wrap gap-3">
				<Button onClick={() => showToast('Saved')}>Show toast</Button>
				<Button variant="secondary" onClick={() => showToast('Heads up', 'warning')}>
					Warning
				</Button>
				<Button variant="flat" onClick={() => hideToast()}>
					Clear all
				</Button>
			</div>
			<p className="mt-3 text-xs text-app-muted">Click a few times: toasts stack, and beyond 3 the oldest goes.</p>
			<Toast toasts={toasts} onClose={hideToast} />
		</>
	)
}
