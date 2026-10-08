import { useState } from 'react'
import { CopyIcon, EditIcon, Menu, ScissorsIcon, Trash2Icon } from 'xedonium'

export default function Demo() {
	const [last, setLast] = useState('nothing yet')
	const pick = name => () => setLast(name)

	return (
		<div className="flex flex-col items-start gap-3">
			<Menu
				label="Edit"
				trigger="Edit"
				items={[
					{ key: 'cut', label: 'Cut', icon: <ScissorsIcon />, shortcut: 'Ctrl+X', onClick: pick('Cut') },
					{ key: 'copy', label: 'Copy', icon: <CopyIcon />, shortcut: 'Ctrl+C', onClick: pick('Copy') },
					{ key: 'rename', label: 'Rename', icon: <EditIcon />, shortcut: 'F2', onClick: pick('Rename') },
					{ key: 'archive', label: 'Archive (disabled)', disabled: true },
					{ key: 'd1', divider: true },
					{ key: 'delete', label: 'Delete', icon: <Trash2Icon />, tone: 'danger', onClick: pick('Delete') },
				]}
			/>
			<p className="m-0 text-xs text-app-muted">Last action: {last}</p>
		</div>
	)
}
