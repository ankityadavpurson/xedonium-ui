import FanFavicon from './FanFavicon'
import HelperText from './HelperText'

const FAN = { sm: 32, md: 64, lg: 96 }
const RING = { sm: 16, md: 32, lg: 48 }
const TEXT = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

// Circular progress: a ring track with a quarter-circle arc spinning around it
const Spinner = ({ size }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="2.5"
		className="shrink-0 animate-spin"
	>
		<circle cx="12" cy="12" r="9" className="stroke-app-border" />
		<path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="butt" className="stroke-app-strong" />
	</svg>
)

const Dots = () => (
	<span aria-hidden="true" className="inline-flex">
		<span className="xd-dot">.</span>
		<span className="xd-dot">.</span>
		<span className="xd-dot">.</span>
	</span>
)

/**
 * Loading indicator in seven styles. `variant`:
 * - `fan` (default): the spinning FanFavicon with the label under it.
 * - `spinner`: circular progress ring.
 * - `dots`: the label followed by three pulsing dots.
 * - `shimmer`: the label with a light sweeping across it.
 * - `inline`: spinner beside the label.
 * - `stacked`: spinner above a centered label.
 * - `card`: bordered panel with spinner, label as the title and an optional `description` line.
 * `size` is sm | md | lg. The loader is a polite live region (`role="status"`); only `spinner` has no visible text,
 * so its `label` is read to screen readers only.
 */
const Loader = ({ variant = 'fan', size = 'md', label = 'Loading', description, className = '' }) => {
	const text = TEXT[size]
	const ring = RING[size]

	let content
	switch (variant) {
		case 'spinner':
			content = (
				<>
					<Spinner size={ring} />
					<span className="sr-only">{label}</span>
				</>
			)
			break
		case 'dots':
			content = (
				<span className={`${text} whitespace-nowrap font-semibold text-app-text`}>
					{label}
					<Dots />
				</span>
			)
			break
		case 'shimmer':
			content = <span className={`${text} xd-shimmer font-semibold`}>{label}</span>
			break
		case 'inline':
			content = (
				<span className="inline-flex items-center gap-2">
					<Spinner size={ring} />
					<span className={`${text} text-app-text`}>{label}</span>
				</span>
			)
			break
		case 'stacked':
			content = (
				<span className="flex flex-col items-center gap-3 text-center">
					<Spinner size={ring} />
					<span className={`${text} text-app-text`}>{label}</span>
				</span>
			)
			break
		case 'card':
			content = (
				<span className="flex w-full max-w-xs items-center gap-4 border border-app-border bg-app-card p-4">
					<Spinner size={ring} />
					<span className="flex min-w-0 flex-col gap-0.5">
						<span className={`${text} font-semibold text-app-text`}>{label}</span>
						{description && <HelperText as="span">{description}</HelperText>}
					</span>
				</span>
			)
			break
		default:
			content = (
				<span className="flex flex-col items-center gap-3 text-center">
					<FanFavicon size={FAN[size]} />
					<span className={`${text} text-app-text`}>{label}</span>
				</span>
			)
	}

	return (
		<div role="status" className={`inline-flex items-center justify-center ${className}`}>
			{content}
		</div>
	)
}

export default Loader
