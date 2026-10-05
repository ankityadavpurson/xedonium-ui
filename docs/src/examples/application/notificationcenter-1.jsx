import { useState } from 'react'
import { NotificationCenter } from 'xedonium'

export default function Demo() {
	const [items, setItems] = useState([
		{ id: 1, title: 'Build finished', body: 'main passed all checks', time: '2 min ago' },
		{ id: 2, title: 'New comment', body: 'Ada replied to your review', time: '1 h ago' },
		{ id: 3, title: 'Welcome', time: 'Yesterday', read: true },
	])
	return (
		<NotificationCenter
			notifications={items}
			onMarkRead={id => setItems(list => list.map(n => (n.id === id ? { ...n, read: true } : n)))}
			onMarkAllRead={() => setItems(list => list.map(n => ({ ...n, read: true })))}
			onClear={() => setItems([])}
		/>
	)
}
