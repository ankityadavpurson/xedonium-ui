import { useState } from 'react'
import { Alert } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(true)

	return (
		<div className="flex flex-col gap-3">
			<Alert title="Heads up">Informational message.</Alert>
			<Alert tone="success" title="Saved">
				Everything worked.
			</Alert>
			<Alert tone="warning" title="Careful">
				This may take a while.
			</Alert>
			{open && (
				<Alert tone="danger" title="Failed" onClose={() => setOpen(false)}>
					Something went wrong.
				</Alert>
			)}
		</div>
	)
}
