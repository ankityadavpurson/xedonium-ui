import { useState } from 'react'
import { Button, RelativeTime } from 'xedonium'

const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE

export default function Demo() {
	// fixed when the demo mounts, so the labels keep moving as the shared clock ticks
	const [start] = useState(() => Date.now())
	const [deliveries, setDeliveries] = useState(() => [
		{ who: 'Kevin', what: 'delivered the bananas', at: start - 3 * MINUTE },
		{ who: 'Stuart', what: 'fixed the freeze ray', at: start - 5 * 60 * MINUTE },
		{ who: 'Bob', what: 'lost his teddy bear', at: start - DAY },
		{ who: 'Gru', what: 'plans the next heist', at: start + 3 * DAY },
	])

	return (
		<div className="flex flex-col gap-3">
			<ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-app-text">
				{deliveries.map(({ who, what, at }) => (
					<li key={`${who}-${at}`}>
						<strong>{who}</strong> {what} <RelativeTime date={at} className="text-app-muted" />
					</li>
				))}
			</ul>
			<div>
				<Button
					onClick={() =>
						setDeliveries(list => [{ who: 'Dave', what: 'brought one more banana', at: Date.now() }, ...list])
					}
				>
					Dave brings a banana
				</Button>
			</div>
		</div>
	)
}
