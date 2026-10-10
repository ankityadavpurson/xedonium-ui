import { LogViewer } from 'xedonium'

const logs = [
	{ id: 1, timestamp: '2026-04-02T10:42:01.120', level: 'info', source: 'api', message: 'Request completed in 82ms' },
	{ id: 2, timestamp: '2026-04-02T10:42:04.450', level: 'warn', source: 'cache', message: 'Cache miss for /users' },
	{
		id: 3,
		timestamp: '2026-04-02T10:42:09.003',
		level: 'error',
		source: 'api',
		message: 'Request failed with status 500',
		data: { url: '/orders/7', method: 'POST', status: 500 },
		stack: 'Error: Internal Server Error\n    at handle (server.js:42:11)\n    at next (router.js:9:3)',
	},
	{ id: 4, timestamp: '2026-04-02T10:42:10.870', level: 'debug', message: 'Retrying in 2s' },
]

export default function Demo() {
	return <LogViewer logs={logs} autoScroll={false} maxHeight="20rem" />
}
