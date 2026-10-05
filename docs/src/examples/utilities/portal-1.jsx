import { useState } from 'react'
import { Button, Portal } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Show'} banner</Button>
			{open && (
				<Portal>
					<div className="fixed inset-x-0 top-0 z-[100] bg-app-strong p-3 text-center text-sm text-app-bg">
						Rendered into document.body, outside the example box.
					</div>
				</Portal>
			)}
		</>
	)
}
