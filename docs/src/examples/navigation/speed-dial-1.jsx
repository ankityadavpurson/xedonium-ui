import { useState } from 'react'
import { CopyIcon, EditIcon, PrinterIcon, SaveIcon, SpeedDial } from 'xedonium'

export default function Demo() {
	const [last, setLast] = useState('nothing yet')
	const actions = [
		{ key: 'copy', icon: <CopyIcon />, label: 'Copy', onClick: () => setLast('Copy') },
		{ key: 'save', icon: <SaveIcon />, label: 'Save', onClick: () => setLast('Save') },
		{ key: 'print', icon: <PrinterIcon />, label: 'Print', onClick: () => setLast('Print') },
		{ key: 'edit', icon: <EditIcon />, label: 'Edit (disabled)', disabled: true },
	]

	return (
		<div className="flex flex-col gap-4">
			<div className="flex h-72 flex-wrap items-end gap-24 border border-app-border p-4 pl-12">
				<SpeedDial label="Up" actions={actions} color="#2563eb" />
				<SpeedDial label="Labelled" direction="up" showLabels actions={actions} variant="secondary" />
				<SpeedDial label="Circle" direction="up" shape="circle" actions={actions} color="#3b82f6" />
				<SpeedDial label="Right" direction="right" actions={actions} color="success" />
			</div>
			<p className="m-0 text-xs text-app-muted">Last action: {last}</p>
		</div>
	)
}
