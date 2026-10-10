import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useEscapeKey from '../hooks/useEscapeKey'
import { formatLogTime, type LogEntry, type LogLevel } from '../utils/logs'
import Button from './Button'
import Input from './Input'
import ToggleButton from './ToggleButton'
import ToggleButtonGroup from './ToggleButtonGroup'
import ArrowDownIcon from './icons/ArrowDown'
import FullscreenExitIcon from './icons/FullscreenExit'
import FullscreenIcon from './icons/Fullscreen'

export type { LogEntry, LogLevel }

export interface LogViewerProps {
	logs: LogEntry[]
	/** Keep the newest entry in view (live logs). Scrolling up pauses it; "Jump to latest" resumes it (default `true`). */
	autoScroll?: boolean
	/** Called when following the newest entry stops (the reader scrolled up) or resumes. */
	onAutoScrollChange?: (following: boolean) => void
	/** Font size of the entries, in px (default `13`). */
	fontSize?: number
	/** Fixed height of the log area. */
	height?: number | string
	/** Maximum height of the log area (default `24rem` when there is no `height`). */
	maxHeight?: number | string
	/** `theme` follows the light / dark theme; `dark` is always a dark console, like a terminal. */
	appearance?: 'theme' | 'dark'
	/** Show the full screen button (default `true`); Escape leaves full screen. */
	fullScreenButton?: boolean
	/** Placed before the level filter, e.g. a connection badge. */
	toolbarStart?: ReactNode
	/** Placed before the search box, e.g. an options menu. */
	toolbarEnd?: ReactNode
	/** Adds a "Clear" button that calls this. */
	onClear?: () => void
	/** Shown when there are no logs at all (default "No logs yet"). */
	emptyText?: string
	/** Accessible name of the log output. */
	label?: string
	className?: string
}

// Toolbar controls share the height of the search box (an input is 38px: two 8px paddings, a 20px line and borders)
const CONTROL = 'inline-flex h-[38px] items-center justify-center'
const ICON_CONTROL = `${CONTROL} w-[38px] !p-0`

const LEVELS: { level: LogLevel; label: string }[] = [
	{ level: 'error', label: 'Errors' },
	{ level: 'warn', label: 'Warnings' },
	{ level: 'info', label: 'Info' },
	{ level: 'debug', label: 'Debug' },
]

const LEVEL_CLASS: Record<LogLevel, string> = {
	debug: 'bg-app-border/40 text-app-muted',
	info: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
	warn: 'bg-amber-400/20 text-amber-800 dark:text-amber-300',
	error: 'bg-red-500/15 text-red-700 dark:text-red-300',
}
const LEVEL_CLASS_DARK: Record<LogLevel, string> = {
	debug: 'bg-white/10 text-zinc-400',
	info: 'bg-yellow-400/15 text-yellow-300',
	warn: 'bg-amber-400/20 text-amber-300',
	error: 'bg-red-500/20 text-red-300',
}

// Forces the dark tokens on the console, in either theme
const DARK_TOKENS =
	'[--color-app-bg:24_24_27] [--color-app-card:27_27_31] [--color-app-border:63_63_70] [--color-app-text:228_228_231] [--color-app-muted:140_140_150] bg-[#1b1b1f] text-zinc-300'

const DETAILS_LIMIT = 400
const BODY_LINES = 10
const NEAR_BOTTOM = 24

/** The text with every match of `query` wrapped in a mark. */
const highlight = (text: string, query: string): ReactNode => {
	if (!query) return text
	const lower = text.toLowerCase()
	const parts: ReactNode[] = []
	let from = 0
	for (let at = lower.indexOf(query, from); at >= 0; at = lower.indexOf(query, from)) {
		parts.push(text.slice(from, at))
		parts.push(
			<mark key={at} className="bg-yellow-300/40 text-inherit">
				{text.slice(at, at + query.length)}
			</mark>
		)
		from = at + query.length
	}
	parts.push(text.slice(from))
	return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)
}

const detailsText = (data: unknown) => {
	if (data === undefined || data === null || data === '') return ''
	return typeof data === 'string' ? data : (JSON.stringify(data) ?? String(data))
}

const searchText = (log: LogEntry) =>
	`${log.message} ${log.source ?? ''} ${log.level} ${formatLogTime(log.timestamp)} ${detailsText(log.data)} ${log.stack ?? ''}`.toLowerCase()

const Row = ({ log, query, dark }: { log: LogEntry; query: string; dark: boolean }) => {
	const [moreData, setMoreData] = useState(false)
	const [moreBody, setMoreBody] = useState(false)
	const [headline, ...body] = log.message.split('\n')
	const stack = log.stack ? log.stack.split('\n') : []
	const extra = [...body, ...stack]
	const hiddenLines = extra.length - BODY_LINES
	const shownLines = moreBody || hiddenLines <= 0 ? extra : extra.slice(0, BODY_LINES)
	const data = detailsText(log.data)
	const long = data.length > DETAILS_LIMIT
	const time = formatLogTime(log.timestamp)
	const date = log.timestamp === undefined ? undefined : new Date(log.timestamp)

	return (
		<li
			data-level={log.level}
			className={`px-3 py-2 ${log.level === 'error' ? 'bg-red-500/10' : ''} hover:bg-app-bg/60`}
		>
			<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				{time && (
					<time
						dateTime={date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined}
						title={date && !Number.isNaN(date.getTime()) ? date.toString() : undefined}
						className="shrink-0 tabular-nums text-app-muted"
					>
						{time}
					</time>
				)}
				<span
					className={`min-w-[3.5em] shrink-0 px-1.5 text-center text-[0.85em] font-semibold uppercase tracking-wider ${
						(dark ? LEVEL_CLASS_DARK : LEVEL_CLASS)[log.level]
					}`}
				>
					{log.level}
				</span>
				{log.source && <span className="shrink-0 text-app-muted">[{log.source}]</span>}
				<span className="min-w-0 flex-1 break-words text-app-text">{highlight(headline, query)}</span>
			</div>
			{shownLines.length > 0 && (
				<pre className="m-0 mt-1 overflow-x-auto whitespace-pre-wrap break-words text-app-muted">
					{shownLines.map((line, index) => (
						<div key={index} className={/^\s+at\s/.test(line) ? 'opacity-60' : undefined}>
							{highlight(line || ' ', query)}
						</div>
					))}
				</pre>
			)}
			{hiddenLines > 0 && (
				<button
					type="button"
					onClick={() => setMoreBody(m => !m)}
					className="mt-1 text-[0.9em] underline underline-offset-2"
				>
					{moreBody ? 'Show less' : `Show all (${extra.length - BODY_LINES} more lines)`}
				</button>
			)}
			{data && (
				<pre className="m-0 mt-1 overflow-x-auto whitespace-pre-wrap break-words text-app-muted">
					{long && !moreData ? `${data.slice(0, DETAILS_LIMIT)} …` : data}
				</pre>
			)}
			{long && (
				<button
					type="button"
					onClick={() => setMoreData(m => !m)}
					className="mt-1 text-[0.9em] underline underline-offset-2"
				>
					{moreData ? 'Show less' : `Show all (${data.length.toLocaleString()} characters)`}
				</button>
			)}
		</li>
	)
}

/**
 * One log view for live logs and stored files: filter by level (with counts), search the text (debounced, matches are
 * highlighted), errors stand out, long details and stack traces are cut with "Show all", and it can go full screen
 * (Escape leaves). With `autoScroll` it follows new entries until the reader scrolls up, then offers "Jump to latest".
 * Entries are `{ id, level, message, timestamp?, source?, data?, stack? }`; `parseLogFile` turns a log file into them.
 * `appearance="dark"` is a terminal-style console in either theme; `toolbarStart` / `toolbarEnd` take your own controls.
 */
const LogViewer = ({
	logs,
	autoScroll = true,
	onAutoScrollChange,
	fontSize = 13,
	height,
	maxHeight,
	appearance = 'theme',
	fullScreenButton = true,
	toolbarStart,
	toolbarEnd,
	onClear,
	emptyText = 'No logs yet',
	label = 'Logs',
	className = '',
}: LogViewerProps) => {
	const [level, setLevel] = useState<LogLevel | 'all'>('all')
	const [search, setSearch] = useState('')
	const [fullScreen, setFullScreen] = useState(false)
	const [following, setFollowing] = useState(autoScroll)
	const consoleRef = useRef<HTMLDivElement>(null)
	const query = useDebouncedValue(search, 250).trim().toLowerCase()
	const dark = appearance === 'dark'

	const counts = useMemo(() => {
		const result: Record<LogLevel, number> = { debug: 0, info: 0, warn: 0, error: 0 }
		for (const log of logs) result[log.level] += 1
		return result
	}, [logs])

	const visible = useMemo(
		() => logs.filter(log => (level === 'all' || log.level === level) && (!query || searchText(log).includes(query))),
		[logs, level, query]
	)

	// the prop turns following on and off; scrolling and "Jump to latest" change it too
	useEffect(() => setFollowing(autoScroll), [autoScroll])

	// keep the newest entry in view while following (also after a filter, a search or full screen change)
	useEffect(() => {
		const element = consoleRef.current
		if (following && element) element.scrollTop = element.scrollHeight
	}, [following, visible, fullScreen])

	// Escape leaves full screen, and the page behind does not scroll while it is on
	useEscapeKey(fullScreen, () => setFullScreen(false))
	useEffect(() => {
		if (!fullScreen) return undefined
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	}, [fullScreen])

	const follow = (next: boolean) => {
		setFollowing(next)
		onAutoScrollChange?.(next)
	}

	const handleScroll = () => {
		const element = consoleRef.current
		if (!element || !autoScroll) return
		const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= NEAR_BOTTOM
		if (atBottom !== following) follow(atBottom)
	}

	const jump = () => {
		const element = consoleRef.current
		if (element) element.scrollTop = element.scrollHeight
		follow(true)
	}

	const consoleStyle: CSSProperties = {
		fontSize,
		...(fullScreen ? {} : { height, maxHeight: maxHeight ?? (height === undefined ? '24rem' : undefined) }),
	}

	const toolbar = (
		<div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border p-3">
			<div className="flex flex-wrap items-center gap-3">
				{toolbarStart}
				<ToggleButtonGroup
					exclusive
					aria-label="Filter by level"
					value={level}
					onChange={value => setLevel((value as LogLevel | null) ?? 'all')}
				>
					<ToggleButton value="all" className={CONTROL}>
						All ({logs.length})
					</ToggleButton>
					{LEVELS.filter(item => counts[item.level] > 0 || level === item.level).map(item => (
						<ToggleButton key={item.level} value={item.level} className={CONTROL}>
							{item.label} ({counts[item.level]})
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				{toolbarEnd}
				<div className="w-full sm:w-56">
					<Input
						type="search"
						aria-label="Search logs"
						placeholder="Search logs…"
						value={search}
						onChange={setSearch}
					/>
				</div>
				{onClear && (
					<Button variant="secondary" onClick={onClear} disabled={logs.length === 0} className={CONTROL}>
						Clear
					</Button>
				)}
				{fullScreenButton && (
					<Button
						variant="secondary"
						aria-label={fullScreen ? 'Exit full screen' : 'Full screen'}
						tooltip={fullScreen ? 'Exit full screen' : 'Full screen'}
						onClick={() => setFullScreen(f => !f)}
						className={ICON_CONTROL}
					>
						{fullScreen ? <FullscreenExitIcon className="h-4 w-4" /> : <FullscreenIcon className="h-4 w-4" />}
					</Button>
				)}
			</div>
		</div>
	)

	return (
		<>
			{fullScreen && (
				<div
					aria-hidden="true"
					className="fixed inset-0 z-[var(--xd-z-modal,80)] bg-black/30 backdrop-blur-sm"
					onClick={() => setFullScreen(false)}
				/>
			)}
			<section
				className={`flex min-w-0 flex-col border border-app-border bg-app-card text-app-text ${
					fullScreen ? 'fixed inset-0 z-[calc(var(--xd-z-modal,80)+1)] border-0 shadow-2xl' : ''
				} ${className}`}
			>
				{toolbar}
				<div className={`relative flex min-h-0 flex-col ${fullScreen ? 'flex-1' : ''}`}>
					<div
						ref={consoleRef}
						role="log"
						aria-label={label}
						aria-live="off"
						tabIndex={0}
						onScroll={handleScroll}
						style={consoleStyle}
						className={`min-h-0 overflow-auto font-mono outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong ${
							fullScreen ? 'flex-1' : ''
						} ${dark ? DARK_TOKENS : 'bg-app-card'}`}
					>
						{visible.length === 0 ? (
							<p className="m-0 px-3 py-6 text-center font-sans text-app-muted">
								{logs.length === 0 ? emptyText : 'No entries match'}
							</p>
						) : (
							<ul className="m-0 list-none divide-y divide-app-border/60 p-0">
								{visible.map(log => (
									<Row key={log.id} log={log} query={query} dark={dark} />
								))}
							</ul>
						)}
					</div>
					{autoScroll && !following && logs.length > 0 && (
						<div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
							<span className="pointer-events-auto">
								<Button variant="secondary" onClick={jump} className="inline-flex items-center gap-2 shadow-xl">
									<ArrowDownIcon />
									Jump to latest
								</Button>
							</span>
						</div>
					)}
				</div>
			</section>
		</>
	)
}

export default LogViewer
