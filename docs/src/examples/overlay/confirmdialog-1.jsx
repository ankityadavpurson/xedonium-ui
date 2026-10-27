import { useState } from 'react'
import { Button, ConfirmDialog } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	const [busy, setBusy] = useState(false)
	const confirm = () => {
		setBusy(true)
		setTimeout(() => {
			setBusy(false)
			setOpen(false)
		}, 1200)
	}
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open dialog</Button>
			<ConfirmDialog
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={confirm}
				busy={busy}
				title="Confirm action"
				confirmLabel="Confirm"
				busyLabel="Working..."
			>
				<p>Are you sure you want to continue?</p>
			</ConfirmDialog>
		</>
	)
}
