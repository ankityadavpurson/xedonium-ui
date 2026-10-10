import { useEffect, useRef, type ReactNode } from 'react'
import useNetworkStatus, { type NetworkState, type UseNetworkStatusOptions } from '../hooks/useNetworkStatus'

export type NetworkConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface NetworkConnectionProps extends Omit<UseNetworkStatusOptions, 'enabled'> {
	/**
	 * Set the status yourself (a socket, an API...). Leave it out to detect it from the browser: online, offline, or
	 * (with a `probeUrl`) connected to a network without internet access.
	 */
	status?: NetworkConnectionStatus
	/** `panel` (default) is a status card, `badge` a small inline label, `banner` a bar that shows only while there is a problem. */
	variant?: 'panel' | 'badge' | 'banner'
	/** Connection name shown in the header (panel). */
	name?: ReactNode
	/** Extra detail after the status (for example a network name or an error message). */
	details?: ReactNode
	/** Latency in milliseconds, shown while connected (measured by the `probeUrl` check when detecting). */
	latency?: number
	/** Show the connection type, speed and data saver mode when the browser reports them (detecting only). */
	showConnectionInfo?: boolean
	/** Replace the text of any status. */
	labels?: Partial<Record<NetworkConnectionStatus, string>>
	/** Called when the status changes (also when it is detected). */
	onStatusChange?: (status: NetworkConnectionStatus, state?: NetworkState) => void
	/** Shown as a "Retry" action while disconnected or in error; when detecting, a check runs as well. */
	onRetry?: () => void
	/** For the `banner`: keep it visible while connected too (default `false`). */
	alwaysShow?: boolean
	className?: string
}

const STATUS: Record<NetworkConnectionStatus, { color: string; dot: string }> = {
	connected: { color: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
	connecting: { color: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
	disconnected: { color: 'text-app-muted', dot: 'bg-app-muted' },
	error: { color: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
}

// What the status is called when it comes from a status you set, and when it is detected from the browser
const SET_LABELS: Record<NetworkConnectionStatus, string> = {
	connected: 'Connected',
	connecting: 'Connecting',
	disconnected: 'Disconnected',
	error: 'Connection error',
}
const DETECTED_LABELS: Record<NetworkConnectionStatus, string> = {
	connected: 'Online',
	connecting: 'Checking connection',
	disconnected: 'Offline',
	error: 'Connected, no internet access',
}

const FROM_NETWORK = {
	online: 'connected',
	checking: 'connecting',
	offline: 'disconnected',
	unreachable: 'error',
} as const

const describeConnection = ({ connection }: NetworkState) =>
	[
		connection.effectiveType,
		connection.downlink !== undefined ? `${connection.downlink} Mbps` : undefined,
		connection.rtt !== undefined ? `${connection.rtt} ms RTT` : undefined,
		connection.saveData ? 'Data saver on' : undefined,
	]
		.filter(Boolean)
		.join(' · ')

const BANNER_TEXT: Record<NetworkConnectionStatus, string> = {
	connected: 'You are back online.',
	connecting: 'Checking your connection…',
	disconnected: 'You are offline. Changes may not be saved until you reconnect.',
	error: 'Connected to a network, but the internet cannot be reached.',
}

/**
 * Shows whether the client is connected. By default it **detects** it: the browser's online / offline events, the
 * connection type and speed where the browser reports them, and, with a `probeUrl`, whether the internet can really be
 * reached (so "connected to Wi-Fi without internet" shows as an error). Pass `status` to drive it from your own source
 * instead (a WebSocket, an API health check). `variant` picks a status card, an inline badge, or a banner that
 * appears only while something is wrong. The text is a polite live region, so changes are announced.
 */
const NetworkConnection = ({
	status: given,
	variant = 'panel',
	name = 'Network connection',
	details,
	latency,
	showConnectionInfo = false,
	labels,
	onStatusChange,
	onRetry,
	alwaysShow = false,
	probeUrl,
	interval,
	timeout,
	className = '',
}: NetworkConnectionProps) => {
	const detecting = given === undefined
	const network = useNetworkStatus({ probeUrl: probeUrl ?? '', interval, timeout, enabled: detecting })
	const status: NetworkConnectionStatus = given ?? FROM_NETWORK[network.status]
	const current = STATUS[status]
	const text = { ...(detecting ? DETECTED_LABELS : SET_LABELS), ...labels }
	const shownLatency = latency ?? (detecting ? network.latency : undefined)
	const info = detecting && showConnectionInfo ? describeConnection(network) : ''

	// report changes, but not the status the component starts with
	const previous = useRef(status)
	useEffect(() => {
		if (previous.current === status) return
		previous.current = status
		onStatusChange?.(status, detecting ? network : undefined)
	}, [status, detecting, network, onStatusChange])

	const retry =
		onRetry || detecting
			? () => {
					onRetry?.()
					if (detecting) void network.check()
				}
			: undefined
	const canRetry = !!retry && (status === 'disconnected' || status === 'error')
	const retryButton = canRetry && (
		<button
			type="button"
			onClick={retry}
			className="text-xs font-semibold uppercase tracking-widest text-app-muted underline underline-offset-2 outline-none hover:text-app-text focus-visible:ring-2 focus-visible:ring-app-strong"
		>
			Retry
		</button>
	)
	const extras = [details, info, shownLatency !== undefined && status === 'connected' ? `${shownLatency} ms` : null]

	if (variant === 'badge') {
		return (
			<span
				role="status"
				aria-live="polite"
				className={`inline-flex items-center gap-2 border border-app-border bg-app-card px-2 py-1 text-xs ${current.color} ${className}`}
			>
				<span aria-hidden="true" className={`h-2 w-2 shrink-0 ${current.dot}`} />
				{text[status]}
				{shownLatency !== undefined && status === 'connected' && (
					<span className="text-app-muted">{shownLatency} ms</span>
				)}
			</span>
		)
	}

	if (variant === 'banner') {
		if (status === 'connected' && !alwaysShow)
			return (
				<div role="status" aria-live="polite" className="sr-only">
					{text[status]}
				</div>
			)
		return (
			<div
				role={status === 'connected' ? 'status' : 'alert'}
				className={`flex flex-wrap items-center justify-between gap-3 border px-4 py-2.5 text-sm ${
					status === 'error'
						? 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-300'
						: status === 'connected'
							? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
							: 'border-amber-500/50 bg-amber-400/15 text-amber-900 dark:text-amber-200'
				} ${className}`}
			>
				<span className="flex min-w-0 items-center gap-2">
					<span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 ${current.dot}`} />
					<span>
						<strong className="font-semibold">{text[status]}.</strong> {details ?? BANNER_TEXT[status]}
					</span>
				</span>
				{retryButton}
			</div>
		)
	}

	return (
		<section
			className={`flex flex-wrap items-center justify-between gap-3 border border-app-border bg-app-card p-4 text-sm ${className}`}
		>
			<div className="flex min-w-0 items-center gap-3">
				<span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 ${current.dot}`} />
				<div className="min-w-0">
					<div className="font-medium text-app-text">{name}</div>
					<div className="flex flex-wrap items-center gap-x-2 text-xs text-app-muted">
						<span role="status" aria-live="polite" className={current.color}>
							{text[status]}
						</span>
						{extras.filter(Boolean).map((extra, index) => (
							<span key={index}>{extra}</span>
						))}
					</div>
				</div>
			</div>
			{retryButton}
		</section>
	)
}

export default NetworkConnection
