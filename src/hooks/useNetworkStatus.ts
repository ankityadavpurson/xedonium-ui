import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * - `online`: the browser reports a network and (when you give a `probeUrl`) the internet is reachable.
 * - `offline`: the browser reports no network at all.
 * - `unreachable`: a network is connected but the `probeUrl` could not be reached (no internet access, a captive portal).
 * - `checking`: the first reachability check is still running.
 */
export type NetworkStatus = 'online' | 'offline' | 'unreachable' | 'checking'

/** What the Network Information API (where the browser has it) says about the connection. */
export interface ConnectionInfo {
	/** `slow-2g`, `2g`, `3g` or `4g`. */
	effectiveType?: string
	/** Estimated downlink in Mbps. */
	downlink?: number
	/** Estimated round-trip time in ms. */
	rtt?: number
	/** The user asked the browser to save data. */
	saveData?: boolean
}

export interface UseNetworkStatusOptions {
	/**
	 * **Required: use your own URL.** The address checked to prove the internet is really reachable (a HEAD request,
	 * no-cors, never cached). Point it at an endpoint you own and control, such as your API's health check: a third-party
	 * URL can change, rate-limit you, be blocked by your users' networks or content-security policy, or track them. The
	 * response is not read, so it only has to answer. Without a working check the browser's online flag cannot tell a
	 * network without internet from a working one. Pass `''` only to knowingly use that flag alone.
	 */
	probeUrl: string
	/** Check again every this many milliseconds while online (default `0`: only on start, on `online` and on `check()`). */
	interval?: number
	/** Give up on a check after this many milliseconds (default `5000`). */
	timeout?: number
	/** Set to `false` to stop listening and checking (default `true`). */
	enabled?: boolean
}

export interface NetworkState {
	status: NetworkStatus
	/** The browser's online flag (`navigator.onLine`). */
	online: boolean
	/** Round-trip time of the last successful check, in ms. */
	latency?: number
	/** When the last check finished. */
	lastChecked?: Date
	connection: ConnectionInfo
	/** Run a reachability check now (does nothing when `probeUrl` is empty). */
	check: () => Promise<void>
}

interface NavigatorWithConnection extends Navigator {
	connection?: ConnectionInfo & EventTarget
}

const readOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false)

const readConnection = (): ConnectionInfo => {
	if (typeof navigator === 'undefined') return {}
	const { effectiveType, downlink, rtt, saveData } = (navigator as NavigatorWithConnection).connection ?? {}
	return { effectiveType, downlink, rtt, saveData }
}

type Probe = { state: 'idle' | 'checking' | 'ok' | 'failed'; latency?: number; at?: Date }

/**
 * Tells whether the browser is online, offline, or connected to a network without internet access. It listens to the
 * browser's `online` / `offline` events and the Network Information API, and, with your own `probeUrl` (required), really tries to reach
 * the internet (on start, whenever the browser comes back online, on an `interval`, and on `check()`).
 */
const useNetworkStatus = ({
	probeUrl,
	interval = 0,
	timeout = 5000,
	enabled = true,
}: UseNetworkStatusOptions): NetworkState => {
	const [online, setOnline] = useState(readOnline)
	const [connection, setConnection] = useState(readConnection)
	const [probe, setProbe] = useState<Probe>({ state: 'idle' })
	const mounted = useRef(true)

	useEffect(() => {
		mounted.current = true
		return () => {
			mounted.current = false
		}
	}, [])

	const check = useCallback(async () => {
		if (!probeUrl || typeof fetch === 'undefined') return
		setProbe(previous => (previous.state === 'ok' ? previous : { ...previous, state: 'checking' }))
		const controller = new AbortController()
		const timer = setTimeout(() => controller.abort(), timeout)
		const started = performance.now()
		try {
			await fetch(probeUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: controller.signal })
			if (mounted.current) setProbe({ state: 'ok', latency: Math.round(performance.now() - started), at: new Date() })
		} catch {
			if (mounted.current) setProbe({ state: 'failed', at: new Date() })
		} finally {
			clearTimeout(timer)
		}
	}, [probeUrl, timeout])

	useEffect(() => {
		if (!enabled || typeof window === 'undefined') return undefined
		const goOnline = () => {
			setOnline(true)
			void check()
		}
		const goOffline = () => setOnline(false)
		window.addEventListener('online', goOnline)
		window.addEventListener('offline', goOffline)
		const source = (navigator as NavigatorWithConnection).connection
		const onChange = () => setConnection(readConnection())
		source?.addEventListener?.('change', onChange)
		setOnline(readOnline())
		void check()
		const timer = interval > 0 ? setInterval(() => void check(), interval) : undefined
		return () => {
			window.removeEventListener('online', goOnline)
			window.removeEventListener('offline', goOffline)
			source?.removeEventListener?.('change', onChange)
			if (timer) clearInterval(timer)
		}
	}, [enabled, check, interval])

	let status: NetworkStatus = 'online'
	if (!online) status = 'offline'
	else if (probeUrl && probe.state === 'checking') status = 'checking'
	else if (probeUrl && probe.state === 'failed') status = 'unreachable'

	return { status, online, latency: probe.latency, lastChecked: probe.at, connection, check }
}

export default useNetworkStatus
