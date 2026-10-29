import { useState } from 'react'
import { Button, Drawer } from 'xedonium'

export default function Demo() {
	const [side, setSide] = useState('right')
	const [open, setOpen] = useState(false)
	// `side` stays put while closing so the drawer slides back out the way it came in
	const show = name => {
		setSide(name)
		setOpen(true)
	}
	return (
		<>
			<div className="flex flex-wrap gap-2">
				{['top', 'right', 'bottom', 'left'].map(name => (
					<Button key={name} variant="secondary" onClick={() => show(name)}>
						From {name}
					</Button>
				))}
			</div>
			<Drawer
				animated
				open={open}
				side={side}
				onClose={() => setOpen(false)}
				title={`Animated, from ${side}`}
				footer={<Button onClick={() => setOpen(false)}>Done</Button>}
			>
				<p>It slides in from the {side} edge and back out the same way when closed.</p>
			</Drawer>
		</>
	)
}
