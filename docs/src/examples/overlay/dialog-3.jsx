import { useState } from 'react'
import { Button, Modal } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(null)
	const close = () => setOpen(null)

	return (
		<div className="flex flex-wrap gap-3">
			<Button onClick={() => setOpen('full')}>Always full screen</Button>
			<Button variant="secondary" onClick={() => setOpen('toggle')}>
				With a full screen button
			</Button>
			<Modal open={open === 'full'} onClose={close} title="Full screen dialog" fullScreen>
				<p className="m-0 p-6 text-sm text-app-text">
					This dialog fills the viewport at every size, and the page behind it does not scroll.
				</p>
			</Modal>
			<Modal
				open={open === 'toggle'}
				onClose={close}
				title="Resizable dialog"
				fullScreenToggle
				onFullScreenChange={full => console.info('full screen:', full)}
			>
				<p className="m-0 p-6 text-sm text-app-text">
					Use the button in the header to switch between this dialog and full screen.
				</p>
			</Modal>
		</div>
	)
}
