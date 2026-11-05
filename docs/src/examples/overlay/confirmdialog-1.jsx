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
				title="Feed the Minions"
				confirmLabel="Confirm"
				busyLabel="Peeling..."
			>
				<p>Are you sure you want to give them all the bananas?</p>
			</ConfirmDialog>
		</>
	)
}
