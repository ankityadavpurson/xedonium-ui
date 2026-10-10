import { NetworkConnection } from 'xedonium'

// Set the status yourself: from a socket, an API health check...
export default function Demo() {
	return (
		<div className="flex flex-col gap-3">
			<NetworkConnection name="Production API" status="connected" details="api.example.com" latency={42} />
			<NetworkConnection name="Log server" status="connecting" />
			<NetworkConnection name="Payments" status="error" details="503 Service Unavailable" onRetry={() => {}} />
		</div>
	)
}
