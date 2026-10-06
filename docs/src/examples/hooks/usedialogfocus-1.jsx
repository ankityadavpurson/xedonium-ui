import { useRef, useState } from 'react'
import { Button, Field, useDialogFocus } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const ref = useRef(null)
	useDialogFocus(open, ref)

	return (
		<div className="flex flex-col gap-3">
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			{open && (
				<div
					ref={ref}
					role="dialog"
					aria-label="Rename"
					className="flex max-w-xs flex-col gap-3 border border-app-border bg-app-card p-4"
				>
					<Field label="Name" value={name} onChange={setName} data-autofocus />
					<div className="flex gap-2">
						<Button onClick={() => setOpen(false)}>Save</Button>
						<Button variant="flat" onClick={() => setOpen(false)}>
							Cancel
						</Button>
					</div>
				</div>
			)}
			<p className="m-0 text-xs text-app-muted">
				Focus starts in the field, Tab stays inside, and returns to the button on close.
			</p>
		</div>
	)
}
