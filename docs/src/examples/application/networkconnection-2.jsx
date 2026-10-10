import { useState } from 'react'
import { NetworkConnection } from 'xedonium'

// With no `status` it checks the browser: try turning your Wi-Fi off, or the Network tab's "Offline" switch
export default function Demo() {
	const [last, setLast] = useState('none yet')

	return (
		<div className="flex flex-col gap-3">
			<NetworkConnection
				name="Your connection"
				probeUrl="https://www.gstatic.com/generate_204"
				interval={30000}
				showConnectionInfo
				onStatusChange={status => setLast(status)}
			/>
			<div className="flex flex-wrap items-center gap-3">
				<NetworkConnection variant="badge" />
				<span className="text-xs text-app-muted">Last change: {last}</span>
			</div>
			{/* a banner appears only while the connection is down */}
			<NetworkConnection variant="banner" probeUrl="https://www.gstatic.com/generate_204" />
		</div>
	)
}
