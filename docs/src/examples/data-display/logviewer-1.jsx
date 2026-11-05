import { LogViewer } from 'xedonium'

const logs = [
	{
		id: 1,
		timestamp: '2026-04-02T10:42:01.120',
		level: 'info',
		source: 'lair',
		message: 'Banana delivery completed in 82ms',
	},
	{ id: 2, timestamp: '2026-04-02T10:42:04.450', level: 'warn', source: 'fridge', message: 'Banana stock running low' },
	{
		id: 3,
		timestamp: '2026-04-02T10:42:09.003',
		level: 'error',
		source: 'lair',
		message: 'Freeze ray misfired',
		data: { target: 'moon', gadget: 'freeze-ray', status: 500 },
		stack: 'Error: Banana Overflow\n    at peel (banana.js:42:11)\n    at eat (minion.js:9:3)',
	},
	{ id: 4, timestamp: '2026-04-02T10:42:10.870', level: 'debug', message: 'Minion retrying in 2s' },
]

export default function Demo() {
	return <LogViewer logs={logs} autoScroll={false} maxHeight="20rem" />
}
