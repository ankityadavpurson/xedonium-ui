import { useState } from 'react'
import { NotificationCenter, Popover } from 'xedonium'

export default function Demo() {
	const [notes, setNotes] = useState([
		{ id: 1, title: 'Deploy finished', body: 'Build 42 is live', time: '2m' },
		{ id: 2, title: 'Health check failed', body: 'api.example.com', time: '1h' },
		{ id: 3, title: 'Welcome', read: true },
	])

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Popover trigger="Popover" label="Popover">
				<div className="w-56 p-3 text-sm">Arbitrary content in a floating panel.</div>
			</Popover>
			<NotificationCenter
				notifications={notes}
				onSelect={() => {}}
				onMarkRead={id => setNotes(n => n.map(x => (x.id === id ? { ...x, read: true } : x)))}
				onMarkAllRead={() => setNotes(n => n.map(x => ({ ...x, read: true })))}
				onClear={() => setNotes([])}
			/>
		</div>
	)
}
