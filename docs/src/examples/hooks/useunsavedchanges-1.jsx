import { useState } from 'react'
import { Button, ConfirmDialog, Field, TextLink, useUnsavedChanges } from 'xedonium'

// Type in the field, then click the link: you are asked first. Save, and the link works as usual.
export default function Demo() {
	const [name, setName] = useState('')
	const [saved, setSaved] = useState('')
	const { blocked, proceed, stay } = useUnsavedChanges({ when: name !== saved })

	return (
		<div className="flex flex-col gap-4">
			<Field label="Name" value={name} onChange={setName} />
			<div className="flex flex-wrap items-center gap-4">
				<Button disabled={name === saved} onClick={() => setSaved(name)}>
					Save
				</Button>
				<TextLink href="/">Leave this page</TextLink>
			</div>
			<ConfirmDialog
				open={blocked}
				onClose={stay}
				onConfirm={proceed}
				title="Discard changes?"
				confirmLabel="Discard and leave"
			>
				<p>You have changes that are not saved. If you leave now they are lost.</p>
			</ConfirmDialog>
		</div>
	)
}
