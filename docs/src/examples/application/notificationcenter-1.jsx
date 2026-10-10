import { useState } from 'react'
import { NotificationCenter } from 'xedonium'

export default function Demo() {
	const [opened, setOpened] = useState(false)
	const [items, setItems] = useState([
		{ id: 1, title: 'Build finished', body: 'main passed all checks', time: '2 min ago' },
		{ id: 2, title: 'New comment', body: 'Ada replied to your review', time: '1 h ago' },
		{ id: 3, title: 'Deploy started', body: 'production, v1.9.0', time: '3 h ago' },
		{ id: 4, title: 'Welcome', time: 'Yesterday', read: true },
		{ id: 5, title: 'Invoice ready', body: 'March invoice', time: '2 days ago', read: true },
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
