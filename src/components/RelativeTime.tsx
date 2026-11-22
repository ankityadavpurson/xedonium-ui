import { useSyncExternalStore } from 'react'
import Tooltip from './Tooltip'
import type { Placement } from '../types'
import { DEFAULT_LOCALE, formatAbsolute, formatRelative, toDate, type DateInput } from '../utils/relativeTime'

export { formatAbsolute, formatRelative }
export type { DateInput }

export interface RelativeTimeProps {
	/** The moment to show: a Date, a timestamp in milliseconds, or an ISO 8601 string. */
	date: DateInput
	/** BCP 47 locale for the label and the tooltip, such as `fr` or `en-GB`. */
	locale?: string
	/** Show the full date and time in a Tooltip on hover and keyboard focus. */
	tooltip?: boolean
	/** Tooltip placement (see Tooltip). */
	tooltipPlacement?: Placement
	/**
	 * How often the label updates, in milliseconds (default `30000`; at least `1000`). Every RelativeTime with the same
	 * `tick` shares one timer. `false` (or `0`) turns updates off: the label is worked out when the component renders.
	 */
	tick?: number | false
	/** Merged onto the `<time>` element. */
	className?: string
}

const DEFAULT_TICK = 30_000
const MIN_TICK = 1000

interface Clock {
	subscribe: (listener: () => void) => () => void
	getNow: () => number
}

// One clock per tick, shared by every RelativeTime that uses it: a single timer, running only while at least one
// of them is mounted. A tick of 0 is a clock without a timer, for labels that do not update.
const createClock = (tick: number): Clock => {
	const listeners = new Set<() => void>()
	let timer: ReturnType<typeof setInterval> | undefined
	let now = 0
	return {
		subscribe: listener => {
			listeners.add(listener)
			if (tick && listeners.size === 1) {
				now = Date.now()
				timer = setInterval(() => {
					now = Date.now()
					listeners.forEach(notify => notify())
				}, tick)
			}
			return () => {
				listeners.delete(listener)
				if (listeners.size === 0) {
					clearInterval(timer)
					timer = undefined
				}
			}
		},
		// React may read the snapshot more than once per render and needs the same value each time. While no timer runs
		// (nothing mounted, or a clock that does not tick), refresh it on read instead, at most once a second (either way:
		// the device clock can be set back).
		getNow: () => {
			if ((!tick || !listeners.size) && Math.abs(Date.now() - now) >= 1000) now = Date.now()
			return now
		},
	}
}

const clocks = new Map<number, Clock>()
// The same clock object for the same tick, so useSyncExternalStore keeps its subscription between renders
const clockFor = (tick: number | false) => {
	const ms =
		tick === false || tick === 0 ? 0 : Number.isFinite(tick) && tick > 0 ? Math.max(MIN_TICK, tick) : DEFAULT_TICK
	let clock = clocks.get(ms)
	if (!clock) {
		clock = createClock(ms)
		clocks.set(ms, clock)
	}
	return clock
}

// The server, and the browser while it hydrates, have no clock: the label is worked out at render time instead, and
// replaced with the browser's right after hydration (so a page built days ago does not keep saying "5 minutes ago")
const getServerNow = () => null

/**
 * A moment as a live relative label ("3 minutes ago", "in 2 days") in a `<time>` element, with the full date and
 * time in a Tooltip. Instances share one clock per `tick` (every 30 seconds by default; `false` for a static label).
 */
const RelativeTime = ({
	date,
	locale = DEFAULT_LOCALE,
	tooltip = true,
	tooltipPlacement = 'top',
	tick = DEFAULT_TICK,
	className = '',
}: RelativeTimeProps) => {
	const clock = clockFor(tick)
	const current = useSyncExternalStore(clock.subscribe, clock.getNow, getServerNow)
	const time = toDate(date)
	if (Number.isNaN(time.getTime())) return null

	const hydrated = current !== null
	const element = (
		<time
			dateTime={time.toISOString()}
			// keyboard users reach the tooltip by focusing the label
			tabIndex={tooltip ? 0 : undefined}
			// the server and the browser render at slightly different moments; the label is corrected after hydration
			suppressHydrationWarning
			className={`${tooltip ? 'cursor-help underline decoration-app-border decoration-dotted underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-strong' : ''} ${className}`.trim()}
		>
			{formatRelative(time, hydrated ? current : Date.now(), locale)}
		</time>
	)
	if (!tooltip) return element
	// The full time depends on the device's time zone, which the server cannot know: render the ISO time (the same
	// everywhere) until hydration, then the local one
	return (
		<Tooltip text={hydrated ? formatAbsolute(time, locale) : time.toISOString()} placement={tooltipPlacement}>
			{element}
		</Tooltip>
	)
}

export { RelativeTime }
export default RelativeTime
