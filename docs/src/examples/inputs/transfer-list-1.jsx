import { useState } from 'react'
import { TransferList } from 'xedonium'

const items = [
	{ key: 'freeze', label: 'Freeze ray' },
	{ key: 'shrink', label: 'Shrink ray' },
	{ key: 'fart', label: 'Fart gun' },
	{ key: 'jelly', label: 'Jelly grenade' },
	{ key: 'rocket', label: 'Rocket (locked)', disabled: true },
	{ key: 'cannon', label: 'Banana cannon' },
]

export default function Demo() {
	const [granted, setGranted] = useState(['freeze'])

	return (
		<div className="flex flex-col gap-3">
			<TransferList
				label="Gadgets"
				titles={['Available', 'Equipped']}
				items={items}
				value={granted}
				onChange={setGranted}
				height={180}
			/>
			<p className="m-0 text-xs text-app-muted">Equipped: {granted.join(', ') || 'nothing'}</p>
		</div>
	)
}
