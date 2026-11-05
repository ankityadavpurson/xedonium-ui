import { useState } from 'react'
import { Button, Drawer } from 'xedonium'

export default function Demo() {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open gadgets</Button>
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				title="Gadgets"
				footer={<Button onClick={() => setOpen(false)}>Done</Button>}
			>
				<p>Freeze ray, shrink ray and a banana cannon.</p>
			</Drawer>
		</>
	)
}
