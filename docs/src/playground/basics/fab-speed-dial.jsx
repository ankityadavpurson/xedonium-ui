import { useState } from 'react'
import { CopyIcon, EditIcon, FloatingActionButton, PlusIcon, PrinterIcon, SaveIcon, SpeedDial } from 'xedonium'

export default function Demo() {
	const [last, setLast] = useState('nothing yet')
	const actions = [
		{ key: 'copy', icon: <CopyIcon />, label: 'Copy', onClick: () => setLast('Copy') },
		{ key: 'save', icon: <SaveIcon />, label: 'Save', onClick: () => setLast('Save') },
		{ key: 'print', icon: <PrinterIcon />, label: 'Print', onClick: () => setLast('Print') },
	]

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-4">
				<FloatingActionButton size="sm" aria-label="Add" tooltip="Add">
					<PlusIcon />
				</FloatingActionButton>
				<FloatingActionButton aria-label="Edit" variant="secondary">
					<EditIcon />
				</FloatingActionButton>
				<FloatingActionButton variant="success" label="Save">
					<SaveIcon />
				</FloatingActionButton>
			</div>
			<div className="flex h-64 items-end gap-16 border border-app-border p-4 pl-12">
				<SpeedDial label="Quick actions" actions={actions} />
				<SpeedDial label="To the right" direction="right" showLabels actions={actions} variant="secondary" />
			</div>
			<p className="m-0 text-xs text-app-muted">Last action: {last}</p>
		</div>
	)
}
