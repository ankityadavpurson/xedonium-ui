import { useState } from 'react'
import { Button, FocusTrap, Stack, Switch } from 'xedonium'

export default function Demo() {
	const [active, setActive] = useState(false)
	return (
		<Stack gap={3}>
			<Switch label="Trap the Minions" checked={active} onChange={setActive} />
			<FocusTrap active={active} className="flex gap-2 border border-app-border p-3">
				<Button>Kevin</Button>
				<Button>Stuart</Button>
			</FocusTrap>
		</Stack>
	)
}
