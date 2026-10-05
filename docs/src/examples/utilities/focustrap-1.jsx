import { useState } from 'react'
import { Button, FocusTrap, Stack, Switch } from 'xedonium'

export default function Demo() {
	const [active, setActive] = useState(false)
	return (
		<Stack gap={3}>
			<Switch label="Trap focus" checked={active} onChange={setActive} />
			<FocusTrap active={active} className="flex gap-2 border border-app-border p-3">
				<Button>First</Button>
				<Button>Second</Button>
			</FocusTrap>
		</Stack>
	)
}
