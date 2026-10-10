import { useNetworkStatus } from 'xedonium'

export default function Demo() {
	const { status, online, latency, lastChecked, connection, check } = useNetworkStatus({
		// use your own endpoint here, such as your API's health check
		probeUrl: 'https://www.gstatic.com/generate_204',
		interval: 30000,
	})

	return (
		<div className="flex flex-col gap-2 text-sm text-app-text">
			<p className="m-0">
				Status: <strong>{status}</strong> (browser says {online ? 'online' : 'offline'})
			</p>
			<p className="m-0 text-app-muted">
				{latency !== undefined && `Latency ${latency} ms. `}
				{lastChecked && `Checked ${lastChecked.toLocaleTimeString()}. `}
				{connection.effectiveType && `Connection ${connection.effectiveType}.`}
			</p>
			<button
				type="button"
				onClick={check}
				className="self-start border border-app-border px-3 py-1.5 text-xs uppercase"
			>
				Check now
			</button>
		</div>
	)
}
