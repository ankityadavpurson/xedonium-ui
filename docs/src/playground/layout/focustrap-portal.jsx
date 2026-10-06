import { useState } from 'react'
import { Button, FocusTrap, Portal, Switch } from 'xedonium'

// FocusTrap moves focus into itself the moment it becomes active, so it starts off and you switch it on
export default function Demo() {
	const [trap, setTrap] = useState(false)

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Switch label="Trap focus" checked={trap} onChange={setTrap} />
			<FocusTrap active={trap} className="flex gap-2 border border-dashed border-app-border p-3">
				<Button variant="secondary">Tab stays</Button>
				<Button variant="secondary">inside</Button>
			</FocusTrap>
			<Portal>
				<span className="fixed bottom-2 left-2 text-[10px] text-app-muted">portalled to body</span>
			</Portal>
		</div>
	)
}
