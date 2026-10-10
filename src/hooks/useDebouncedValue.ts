import { useEffect, useRef, useState } from 'react'

export interface UseDebouncedValueOptions {
	/** Update at once on the first change after a quiet period, then debounce the rest (default `false`). */
	leading?: boolean
	/** Never wait longer than this many milliseconds, however often the value keeps changing. */
	maxWait?: number
}

/**
 * Returns `value` after it has remained unchanged for `delay` milliseconds (default 300). The pending update is
 * cancelled whenever the value or delay changes, so typing in a search box only reports the final text.
 * `leading` also updates on the first change after a quiet period; `maxWait` caps the delay for values that keep
 * changing (a live stream). A `delay` of `0` or less returns the value as it is.
 */
const useDebouncedValue = <Value>(value: Value, delay = 300, options: UseDebouncedValueOptions = {}): Value => {
	const { leading = false, maxWait } = options
	const [debounced, setDebounced] = useState(value)
	// when the current burst of changes started (null while it is quiet)
	const burstStart = useRef<number | null>(null)
	// the first run is the initial value, which is already what `debounced` holds
	const firstRun = useRef(true)

	useEffect(() => {
		if (delay <= 0) return undefined
		if (firstRun.current) {
			firstRun.current = false
			return undefined
		}
		const now = Date.now()
		const starting = burstStart.current === null
		const started = burstStart.current ?? now
		burstStart.current = started
		if (starting && leading) {
			setDebounced(value)
			// the burst ends if nothing else changes within the delay
			const end = setTimeout(() => {
				burstStart.current = null
			}, delay)
			return () => clearTimeout(end)
		}
		const remainingMax = maxWait === undefined ? Infinity : Math.max(0, started + maxWait - now)
		const timeout = setTimeout(
			() => {
				burstStart.current = null
				setDebounced(value)
			},
			Math.min(delay, remainingMax)
		)
		return () => clearTimeout(timeout)
	}, [value, delay, leading, maxWait])

	return delay <= 0 ? value : debounced
}

export default useDebouncedValue
