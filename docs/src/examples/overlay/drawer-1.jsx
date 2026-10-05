import { useState } from 'react'
import { Button, Drawer } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open drawer</Button>
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				title="Settings"
				footer={<Button onClick={() => setOpen(false)}>Done</Button>}
			>
				<p>Drawer content.</p>
			</Drawer>
		</>
	)
}
