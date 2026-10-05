import { useState } from 'react'
import { Button, CommandPalette, useKeyboardShortcuts } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	const [last, setLast] = useState('none')
	useKeyboardShortcuts({ 'mod+k': () => setOpen(true) })
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open palette (Ctrl/Cmd+K)</Button>
			<p>Last command: {last}</p>
			<CommandPalette
				open={open}
				onClose={() => setOpen(false)}
				commands={[
					{ key: 'new', label: 'New project', group: 'Create', shortcut: 'N', onSelect: () => setLast('new') },
					{ key: 'invite', label: 'Invite teammate', group: 'Create', onSelect: () => setLast('invite') },
					{
						key: 'theme',
						label: 'Toggle theme',
						description: 'Switch light / dark',
						group: 'View',
						onSelect: () => setLast('theme'),
					},
				]}
			/>
		</>
	)
}
