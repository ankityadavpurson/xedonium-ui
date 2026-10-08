import { useRef, useState } from 'react'
import { Button, Menu } from 'xedonium'

export default function Demo() {
	const anchor = useRef(null)
	const [open, setOpen] = useState(false)
	const [last, setLast] = useState('nothing yet')

	return (
		<div className="flex flex-col items-start gap-3">
			<span ref={anchor} className="inline-flex">
				<Button variant="flat" onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}>
					Your own anchor
				</Button>
			</span>
			<Menu
				label="Account"
				anchorRef={anchor}
				open={open}
				onOpenChange={setOpen}
				placement="bottom-start"
				items={[
					{ key: 'profile', label: 'Profile', onClick: () => setLast('Profile') },
					{ key: 'settings', label: 'Settings', onClick: () => setLast('Settings') },
					{ key: 'out', label: 'Sign out', tone: 'danger', onClick: () => setLast('Sign out') },
				]}
			/>
			<p className="m-0 text-xs text-app-muted">
				Controlled with <code>open</code> and <code>anchorRef</code>. Last action: {last}
			</p>
		</div>
	)
}
