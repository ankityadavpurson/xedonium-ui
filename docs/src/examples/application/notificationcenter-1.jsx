import { useState } from 'react'
import { NotificationCenter } from 'xedonium'

export default function Demo() {
	const [opened, setOpened] = useState(false)
	const [items, setItems] = useState([
		{ id: 1, title: 'Banana delivery', body: 'Fresh bananas reached the lair', time: '2 min ago' },
		{ id: 2, title: 'New message', body: 'Kevin replied to your plan', time: '1 h ago' },
		{ id: 3, title: 'Mission started', body: 'Moon heist, step 3 of 9', time: '3 h ago' },
		{ id: 4, title: 'Bello!', time: 'Yesterday', read: true },
		{ id: 5, title: 'Banana bill ready', body: 'March bananas', time: '2 days ago', read: true },
	])

	return (
		<div className="flex items-center gap-4">
			<NotificationCenter
				notifications={items}
				maxItems={3}
				onMarkRead={id => setItems(list => list.map(n => (n.id === id ? { ...n, read: true } : n)))}
				onMarkAllRead={() => setItems(list => list.map(n => ({ ...n, read: true })))}
				onClear={() => setItems([])}
				onViewAll={() => setOpened(true)}
			/>
			<span className="text-xs text-app-muted">
				{opened ? 'Opened the notifications page.' : 'Open the bell and choose "View all".'}
			</span>
		</div>
	)
}
