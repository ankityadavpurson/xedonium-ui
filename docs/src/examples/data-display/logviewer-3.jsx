import { useState } from 'react'
import { LogViewer, TextArea, parseLogFile } from 'xedonium'

// Paste the content of a log file: JSON lines and console text (like a printed Error) both work
const sample = `{"level":"info","message":"Lair opened","timestamp":"2026-04-02T10:00:00.000Z","minions":3000}
{"level":"warn","message":"Slow banana peeling","timestamp":"2026-04-02T10:00:03.200Z","ms":1280}
TypeError: Cannot read properties of undefined (reading 'id')
    at getMinion (minions.js:21:18)
    at handler (lair.js:8:5)
{"level":"error","message":"Prank failed","timestamp":"2026-04-02T10:00:04.100Z","url":"/minions/9"}`

export default function Demo() {
	const [text, setText] = useState(sample)

	return (
		<div className="flex flex-col gap-4">
			<TextArea label="Log file" value={text} onChange={setText} rows={6} />
			<LogViewer logs={parseLogFile(text)} autoScroll={false} maxHeight="18rem" label="Parsed log file" />
		</div>
	)
}
