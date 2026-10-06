import { useState } from 'react'
import { Button, Progress, Stack } from 'xedonium'

export default function Demo() {
	const [value, setValue] = useState(62)

	return (
		<Stack gap={4}>
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="secondary" onClick={() => setValue(v => Math.max(0, v - 10))}>
					-10
				</Button>
				<Button variant="secondary" onClick={() => setValue(v => Math.min(100, v + 10))}>
					+10
				</Button>
			</div>
			<Progress label="Uploading" value={value} showValue />
			<Progress label="Working" />
		</Stack>
	)
}
