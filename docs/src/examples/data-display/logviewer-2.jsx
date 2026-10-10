import { useEffect, useState } from 'react'
import { LogViewer, NetworkConnection } from 'xedonium'

const MESSAGES = [
	['info', 'api', 'GET /customers 200'],
	['info', 'api', 'POST /bills 201'],
	['warn', 'cache', 'Cache miss for /products'],
	['error', 'db', 'Connection timed out after 5000ms'],
	['debug', 'queue', 'Job 42 picked up'],
]

// A live stream: a new entry every second, kept to the newest 200
export default function Demo() {
	const [logs, setLogs] = useState([])
	const [live, setLive] = useState(true)

	useEffect(() => {
		if (!live) return undefined
		let id = logs.length
		const timer = setInterval(() => {
			const [level, source, message] = MESSAGES[id % MESSAGES.length]
			setLogs(current => [...current, { id: id++, level, source, message, timestamp: new Date() }].slice(-200))
		}, 1000)
		return () => clearInterval(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [live])

	return (
		<LogViewer
			logs={logs}
			height="20rem"
			appearance="dark"
			emptyText="Connected. New log messages appear here."
			onClear={() => setLogs([])}
			toolbarStart={
				<button type="button" className="inline-flex" onClick={() => setLive(l => !l)} aria-pressed={live}>
					<NetworkConnection
						variant="badge"
						className="h-[38px]"
						status={live ? 'connected' : 'disconnected'}
						labels={{ connected: 'Live', disconnected: 'Paused' }}
					/>
				</button>
			}
		/>
	)
}
