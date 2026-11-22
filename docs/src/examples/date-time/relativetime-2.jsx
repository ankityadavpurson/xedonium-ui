import { useState } from 'react'
import { RelativeTime } from 'xedonium'

const TICKS = [
	['tick={1000}', 1000, 'every second'],
	['default', undefined, 'every 30 seconds'],
	['tick={false}', false, 'never: worked out when it renders'],
]

export default function Demo() {
	// Kevin started peeling when the demo opened: watch the labels move apart
	const [peeling] = useState(() => Date.now())

	return (
		<div className="flex flex-col gap-2 text-sm text-app-text">
			{TICKS.map(([name, tick, note]) => (
				<div key={name} className="flex flex-wrap items-baseline gap-x-3">
					<code className="w-28 text-app-muted">{name}</code>
					<span>
						Kevin started peeling <RelativeTime date={peeling} tick={tick} />
					</span>
					<span className="text-xs text-app-muted">{note}</span>
				</div>
			))}
		</div>
	)
}
