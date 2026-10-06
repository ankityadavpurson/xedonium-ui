import Label from './Label'

const RING = { sm: 32, md: 64, lg: 96 }
const RING_TEXT = { sm: 'text-[9px]', md: 'text-xs', lg: 'text-base' }

// Ring geometry on a 24x24 canvas: the track, then the arc. `pathLength` makes dash lengths read as percentages.
// A full ring is drawn undashed: a dash of exactly the whole length leaves a hairline gap where it starts and ends.
const Ring = ({ size, value }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="2.5"
		className={value === undefined ? 'animate-spin' : ''}
	>
		<circle cx="12" cy="12" r="9" className="stroke-app-border" />
		{value === undefined ? (
			<path d="M12 3a9 9 0 0 1 9 9" className="stroke-app-strong" />
		) : (
			<circle
				cx="12"
				cy="12"
				r="9"
				pathLength="100"
				strokeDasharray={value >= 100 ? undefined : `${value} 100`}
				transform="rotate(-90 12 12)"
				className="stroke-app-strong transition-[stroke-dasharray] duration-300"
			/>
		)}
	</svg>
)

/**
 * Progress indicator. `value` is 0-100; omit it for an indeterminate one.
 * `variant="linear"` (default) is a bar with the label above it; `variant="circular"` is a ring with the label below,
 * `size` (sm | md | lg) sizing it and `showValue` printing the percentage in the middle.
 */
const Progress = ({ value, label, showValue = false, variant = 'linear', size = 'md', className = '' }) => {
	const indeterminate = value === undefined
	const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value))
	const aria = {
		role: 'progressbar',
		'aria-label': label,
		'aria-valuemin': 0,
		'aria-valuemax': 100,
		'aria-valuenow': indeterminate ? undefined : Math.round(clamped),
	}

	if (variant === 'circular') {
		return (
			<div className={`inline-flex flex-col items-center gap-2 ${className}`}>
				<div {...aria} className="relative inline-flex">
					<Ring size={RING[size]} value={indeterminate ? undefined : clamped} />
					{showValue && !indeterminate && (
						<span
							className={`absolute inset-0 flex items-center justify-center font-semibold text-app-text ${RING_TEXT[size]}`}
						>
							{Math.round(clamped)}%
						</span>
					)}
				</div>
				{label && <Label>{label}</Label>}
			</div>
		)
	}

	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			{(label || (showValue && !indeterminate)) && (
				<div className="flex items-center justify-between gap-2">
					<Label>{label}</Label>
					{showValue && !indeterminate && (
						<span className="text-xs font-semibold uppercase tracking-widest text-app-text">
							{Math.round(clamped)}%
						</span>
					)}
				</div>
			)}
			<div {...aria} className="relative h-1.5 w-full overflow-hidden bg-app-border">
				{indeterminate ? (
					<div className="absolute inset-y-0 w-2/5 animate-indeterminate bg-app-strong" />
				) : (
					<div className="h-full bg-app-strong transition-all" style={{ width: `${clamped}%` }} />
				)}
			</div>
		</div>
	)
}

export default Progress
