import { useState } from 'react'
import { Button, useEscapeKey } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	useEscapeKey(open, () => setOpen(false))

	return (
		<div className="flex flex-col gap-3">
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Show banner
			</Button>
			{open && <div className="border border-app-border bg-app-card p-3 text-sm">Press Escape to dismiss me</div>}
		</div>
	)
}
