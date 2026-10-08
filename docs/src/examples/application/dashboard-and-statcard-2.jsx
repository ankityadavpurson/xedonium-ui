import { useState } from 'react'
import { StatCard, UsersIcon } from 'xedonium'

// Tiles that link or act, with an icon, a status chip, a restricted state and a loading state
export default function Demo() {
	const [clicks, setClicks] = useState(0)
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard label="Users" value="3,204" icon={<UsersIcon />} href="#users" status="Healthy" statusTone="success" />
			<StatCard label="Clicks" value={clicks} hint="Click the tile" onClick={() => setClicks(n => n + 1)} />
			<StatCard label="Billing" value="$48k" status="Restricted" statusTone="warning" disabled href="#billing" />
			<StatCard label="Revenue" value="$0" delta="12%" trend="up" loading />
		</div>
	)
}
