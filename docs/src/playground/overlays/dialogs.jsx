import { useState } from 'react'
import { Button, CommandPalette, ConfirmDialog, Drawer, Modal, useKeyboardShortcuts } from 'xedonium'

export default function Demo() {
	const [dialog, setDialog] = useState(false)
	const [busy, setBusy] = useState(false)
	const [modal, setModal] = useState(false)
	const [drawer, setDrawer] = useState(null)
	const [palette, setPalette] = useState(false)
	const [last, setLast] = useState('')

	useKeyboardShortcuts({ 'mod+k': () => setPalette(true) })

	const confirm = () => {
		setBusy(true)
		setTimeout(() => {
			setBusy(false)
			setDialog(false)
		}, 1000)
	}

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Button onClick={() => setDialog(true)}>Confirm dialog</Button>
			<Button variant="secondary" onClick={() => setModal(true)}>
				Modal
			</Button>
			<Button variant="secondary" onClick={() => setDrawer('right')}>
				Drawer right
			</Button>
			<Button variant="secondary" onClick={() => setDrawer('left')}>
				Drawer left
			</Button>
			<Button variant="secondary" onClick={() => setPalette(true)}>
				Command palette (Ctrl+K)
			</Button>
			<span className="text-xs text-app-muted">{last && `Ran: ${last}`}</span>

			<ConfirmDialog
				open={dialog}
				onClose={() => setDialog(false)}
				onConfirm={confirm}
				busy={busy}
				title="Confirm action"
				busyLabel="Working..."
			>
				<p>Are you sure you want to continue?</p>
			</ConfirmDialog>
			<Modal
				open={modal}
				onClose={() => setModal(false)}
				title="Modal"
				footer={<Button onClick={() => setModal(false)}>Close</Button>}
			>
				<p className="px-6 py-5 text-sm">Modal body.</p>
			</Modal>
			<Drawer
				open={!!drawer}
				side={drawer || 'right'}
				onClose={() => setDrawer(null)}
				title="Drawer"
				footer={<Button onClick={() => setDrawer(null)}>Done</Button>}
			>
				<p className="p-5 text-sm">Drawer content.</p>
			</Drawer>
			<CommandPalette
				open={palette}
				onClose={() => setPalette(false)}
				commands={[
					{ key: 'home', label: 'Go home', group: 'Navigate', shortcut: 'G H', onSelect: () => setLast('home') },
					{
						key: 'theme',
						label: 'Toggle theme',
						group: 'Actions',
						description: 'Switch light/dark',
						onSelect: () => setLast('theme'),
					},
					{ key: 'docs', label: 'Open docs', group: 'Navigate', onSelect: () => setLast('docs') },
				]}
			/>
		</div>
	)
}
