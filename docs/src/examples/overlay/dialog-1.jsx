import { useState } from 'react'
import { Button, Modal } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open dialog</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Release notes"
				footer={<Button onClick={() => setOpen(false)}>Done</Button>}
			>
				<p className="m-0 px-6 py-5 text-sm text-app-text">
					A dialog with a title, a body and a footer. Escape, the backdrop and the close button dismiss it.
				</p>
			</Modal>
		</>
	)
}
