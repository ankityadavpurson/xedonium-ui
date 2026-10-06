import { useState } from 'react'
import { Button, Progress } from 'xedonium'

export default function Demo() {
	const [value, setValue] = useState(65)

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="secondary" onClick={() => setValue(v => Math.max(0, v - 10))}>
					-10
				</Button>
				<Button variant="secondary" onClick={() => setValue(v => Math.min(100, v + 10))}>
					+10
				</Button>
			</div>
			<div className="flex flex-wrap items-end gap-8">
				<Progress variant="circular" size="sm" value={value} />
				<Progress variant="circular" value={value} showValue label="Upload" />
				<Progress variant="circular" size="lg" value={value} showValue label="Large" />
				<Progress variant="circular" label="Working" />
			</div>
		</div>
	)
}
