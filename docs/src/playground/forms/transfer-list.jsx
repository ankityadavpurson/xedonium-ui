import { useState } from 'react'
import { TransferList } from 'xedonium'

const items = [
	{ key: 'read', label: 'Read' },
	{ key: 'write', label: 'Write' },
	{ key: 'delete', label: 'Delete' },
	{ key: 'share', label: 'Share' },
	{ key: 'admin', label: 'Admin (locked)', disabled: true },
]

export default function Demo() {
	const [granted, setGranted] = useState(['read'])

	return (
		<div className="flex flex-col gap-3">
			<TransferList
				label="Permissions"
				titles={['Available', 'Granted']}
				items={items}
				value={granted}
				onChange={setGranted}
				height={160}
			/>
			<p className="m-0 text-xs text-app-muted">Granted: {granted.join(', ') || 'nothing'}</p>
		</div>
	)
}
