import { useState } from 'react'
import { Button, ConfirmDialog, Field, useLeaveWarning } from 'xedonium'

// While the field has text, closing or reloading the tab asks the browser's "Leave site?" question, and the browser
// back button opens our own dialog (`backButton` + `onBack`; without `onBack` it uses a confirm box).
export default function Demo() {
	const [name, setName] = useState('')
	const [leave, setLeave] = useState(null)
	useLeaveWarning(name !== '', { backButton: true, onBack: go => setLeave(() => go) })

	return (
		<div className="flex flex-col gap-3">
			<Field label="Name" value={name} onChange={setName} />
			<p className="m-0 text-sm text-app-muted">
				{name !== ''
					? 'Unsaved changes: try to close this tab, reload it or press the back button.'
					: 'Nothing to lose yet: type something.'}
			</p>
			<div>
				<Button variant="secondary" disabled={name === ''} onClick={() => setName('')}>
					Discard
				</Button>
			</div>
			<ConfirmDialog
				open={leave !== null}
				onClose={() => setLeave(null)}
				onConfirm={() => {
					leave()
					setLeave(null)
				}}
				title="Discard changes?"
				confirmLabel="Discard and go back"
			>
				<p>You have changes that are not saved. If you go back now they are lost.</p>
			</ConfirmDialog>
		</div>
	)
}
