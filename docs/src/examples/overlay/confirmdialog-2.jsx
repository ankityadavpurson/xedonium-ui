import { useState } from 'react'
import { Button, ConfirmDialog, Input } from 'xedonium'

// A destructive action that must be typed to confirm: `confirmDisabled` keeps the button off until it matches,
// and `maxWidth` gives the dialog more room
export default function Demo() {
	const [open, setOpen] = useState(false)
	const [typed, setTyped] = useState('')
	const close = () => {
		setOpen(false)
		setTyped('')
	}
	return (
		<>
			<Button variant="danger" onClick={() => setOpen(true)}>
				Delete project
			</Button>
			<ConfirmDialog
				open={open}
				onClose={close}
				onConfirm={close}
				tone="danger"
				title="Delete project"
				confirmLabel="Delete"
				confirmDisabled={typed !== 'delete'}
				maxWidth="max-w-lg"
			>
				<p className="m-0">This removes the project and everything in it. Type delete to confirm.</p>
				<Input aria-label="Type delete" placeholder="delete" value={typed} onChange={setTyped} />
			</ConfirmDialog>
		</>
	)
}
