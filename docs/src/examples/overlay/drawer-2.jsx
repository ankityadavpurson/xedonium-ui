import { useState } from 'react'
import { Button, Drawer } from 'xedonium'

// `busy` ignores Escape, backdrop and close while saving; `busyOverlay` also covers the body with a spinner
export default function Demo() {
	const [open, setOpen] = useState(false)
	const [busy, setBusy] = useState(false)
	const save = () => {
		setBusy(true)
		setTimeout(() => {
			setBusy(false)
			setOpen(false)
		}, 1500)
	}
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open drawer</Button>
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				title="Edit profile"
				busy={busy}
				busyOverlay
				footer={
					<Button onClick={save} disabled={busy}>
						Save
					</Button>
				}
			>
				<p>Press Save, then try Escape.</p>
			</Drawer>
		</>
	)
}
