import { useRef, useState } from 'react'
import { Button, useDismissable } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	const [reason, setReason] = useState('')
	const ref = useRef(null)

	useDismissable(open, ref, why => {
		setOpen(false)
		setReason(why)
	})

	return (
		<div className="flex flex-col gap-3">
			<div ref={ref} className="inline-flex flex-col gap-2">
				<Button variant="secondary" onClick={() => setOpen(o => !o)}>
					{open ? 'Close' : 'Open'} panel
				</Button>
				{open && <div className="border border-app-border bg-app-card p-3 text-sm">Click outside or press Escape</div>}
			</div>
			<p className="m-0 text-xs text-app-muted">Last dismissed by: {reason || 'nothing yet'}</p>
		</div>
	)
}
