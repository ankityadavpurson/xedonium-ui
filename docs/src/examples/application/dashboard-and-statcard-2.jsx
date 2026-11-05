import { useState } from 'react'
import { StatCard, UsersIcon } from 'xedonium'

// Tiles that link or act, with an icon, a status chip, a restricted state and a loading state
export default function Demo() {
	const [clicks, setClicks] = useState(0)
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard
				label="Minions"
				value="3,204"
				icon={<UsersIcon />}
				href="#minions"
				status="Happy"
				statusTone="success"
			/>
			<StatCard label="Bananas" value={clicks} hint="Click to peel" onClick={() => setClicks(n => n + 1)} />
			<StatCard label="Gru's vault" value="$1B" status="Restricted" statusTone="warning" disabled href="#vault" />
			<StatCard label="Loot" value="$0" delta="12%" trend="up" loading />
		</div>
	)
}
