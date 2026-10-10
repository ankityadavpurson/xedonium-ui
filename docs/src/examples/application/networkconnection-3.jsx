import { useState } from 'react'
import { NetworkConnection, ToggleButton, ToggleButtonGroup } from 'xedonium'

// A banner that appears only while the connection is down. "Detect" uses the real connection; the other choices
// simulate a state by setting `status`, so you can see each one without touching your network.
const MODES = [
	['detect', 'Detect'],
	['disconnected', 'Simulate offline'],
	['error', 'Simulate no internet'],
	['connecting', 'Simulate checking'],
]

export default function Demo() {
	const [mode, setMode] = useState('detect')

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-3">
				<ToggleButtonGroup
					exclusive
					aria-label="Connection to show"
					value={mode}
					onChange={value => setMode(value ?? 'detect')}
				>
					{MODES.map(([value, label]) => (
						<ToggleButton key={value} value={value}>
							{label}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			</div>

			{/* in an app, put the banner right under the AppBar: className="sticky top-0 z-50" keeps it in view */}
			<div className="border border-app-border">
				<NetworkConnection
					variant="banner"
					probeUrl="https://www.gstatic.com/generate_204"
					interval={15000}
					status={mode === 'detect' ? undefined : mode}
					labels={{ disconnected: 'Offline', error: 'No internet access', connecting: 'Checking connection' }}
					onRetry={() => setMode('detect')}
				/>
				<p className="m-0 p-4 text-sm text-app-muted">
					Page content. In Detect mode the banner stays hidden while you are online: switch your network off to see it.
				</p>
			</div>
		</div>
	)
}
