// Helpers for LogViewer: turning log files into entries, and formatting log times.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
	/** Unique among the entries (used as the React key). */
	id: string | number
	level: LogLevel
	/** The message. A multi-line message shows its first line as the headline and the rest as a block under it. */
	message: string
	/** A time as an ISO string, milliseconds since the epoch or a Date; shown as `HH:mm:ss.SSS`. */
	timestamp?: string | number | Date
	/** Where it came from, e.g. `api` or `console`. */
	source?: string
	/** Structured details (an object or text): shown under the message, long ones cut with "Show all". */
	data?: unknown
	/** A stack trace: shown as its own block with the `at ...` lines dimmed. */
	stack?: string
}

const pad = (n: number, size = 2) => String(n).padStart(size, '0')

/** `HH:mm:ss.SSS` in local time, or the text as it is when it is not a date. */
export const formatLogTime = (timestamp: LogEntry['timestamp']) => {
	if (timestamp === undefined) return ''
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
	if (Number.isNaN(date.getTime())) return String(timestamp)
	return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
}

const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error']

/** A level name from a logger (`warning`, `ERROR`, `fatal`, `verbose`...) as one of the four LogViewer knows. */
export const toLogLevel = (value: unknown): LogLevel => {
	const level = String(value ?? '').toLowerCase()
	if (LEVELS.includes(level as LogLevel)) return level as LogLevel
	if (level === 'warning') return 'warn'
	if (level === 'fatal' || level === 'critical' || level === 'err') return 'error'
	if (level === 'verbose' || level === 'silly' || level === 'trace') return 'debug'
	return 'info'
}

const parseJsonLine = (line: string): Record<string, unknown> | null => {
	if (!line.startsWith('{')) return null
	try {
		const parsed: unknown = JSON.parse(line)
		return parsed && typeof parsed === 'object' && 'message' in parsed ? (parsed as Record<string, unknown>) : null
	} catch {
		return null
	}
}

// Node prints uncaught and console errors as text: "SomethingError: ..." followed by "    at ..." lines
const looksLikeError = (lines: string[]) =>
	/^\s*(\w+Error|Error|Exception|Uncaught|Unhandled)\b/.test(lines[0]) || lines.some(line => /^\s+at\s/.test(line))

/** An entry from one structured log line (`{ level, message, timestamp, ...details }`, as winston and pino write). */
export const entryFromRecord = (record: Record<string, unknown>, id: string | number): LogEntry => {
	const {
		level,
		logType,
		message,
		timestamp,
		time,
		source,
		label,
		data: given,
		errorData,
		stack: ownStack,
		...rest
	} = record
	let data: unknown = given ?? errorData ?? (Object.keys(rest).length ? rest : undefined)
	let stack = typeof ownStack === 'string' ? ownStack : undefined
	// a stack trace inside the details moves out to its own block
	if (!stack && data && typeof data === 'object' && typeof (data as { stack?: unknown }).stack === 'string') {
		const { stack: text, ...others } = data as { stack: string }
		stack = text
		data = Object.keys(others).length ? others : undefined
	}
	const origin = source ?? label
	return {
		id,
		level: toLogLevel(level ?? logType),
		message: String(message ?? ''),
		timestamp: (timestamp ?? time) as LogEntry['timestamp'],
		source: typeof origin === 'string' ? origin : undefined,
		data,
		stack,
	}
}

/**
 * Splits a log file into entries. A line of JSON (winston, pino...) is one entry; the lines that are not JSON (a printed
 * `Error`, a dumped object) up to the next JSON line are one entry, so a 70-line stack trace is one row and not 70.
 * Blocks that look like errors get the `error` level, the rest `info`, and their source is `console`.
 */
export const parseLogFile = (content: string): LogEntry[] => {
	const entries: LogEntry[] = []
	let block: string[] = []

	const flushBlock = () => {
		while (block.length && !block[block.length - 1].trim()) block.pop()
		while (block.length && !block[0].trim()) block.shift()
		if (block.length) {
			entries.push({
				id: `log-${entries.length}`,
				level: looksLikeError(block) ? 'error' : 'info',
				message: block.join('\n'),
				source: 'console',
			})
		}
		block = []
	}

	for (const line of content.split(/\r?\n/)) {
		const record = parseJsonLine(line)
		if (record) {
			flushBlock()
			entries.push(entryFromRecord(record, `log-${entries.length}`))
		} else block.push(line)
	}
	flushBlock()
	return entries
}
