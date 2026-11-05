import { NetworkConnection } from 'xedonium'

// Set the status yourself: from a socket, an API health check...
export default function Demo() {
	return (
		<div className="flex flex-col gap-3">
			<NetworkConnection name="Freeze ray" status="connected" details="freeze.gru-lair.example" latency={42} />
			<NetworkConnection name="Banana server" status="connecting" />
			<NetworkConnection name="Shrink ray" status="error" details="503 Service Unavailable" onRetry={() => {}} />
		</div>
	)
}
