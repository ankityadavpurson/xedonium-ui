import { useState } from 'react'
import { useKeyboardShortcuts } from 'xedonium'

export default function Demo() {
	const [last, setLast] = useState('none')
	useKeyboardShortcuts({
		'mod+k': () => setLast('mod+k'),
		'shift+?': () => setLast('?'),
		g: () => setLast('g'),
	})
	return (
		<p>
			Try Ctrl/Cmd+K, Shift+? or g. Last: <code>{last}</code>
		</p>
	)
}
