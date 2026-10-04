/** Progress bar. `value` is 0-100; omit it for an indeterminate bar. */
const Progress = ({ value, label, showValue = false, className = '' }) => {
	const indeterminate = value === undefined
	const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value))
	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			{(label || (showValue && !indeterminate)) && (
				<div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-app-muted">
					<span>{label}</span>
					{showValue && !indeterminate && <span className="text-app-text">{Math.round(clamped)}%</span>}
				</div>
			)}
			<div
				role="progressbar"
				aria-label={label}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
				className="relative h-1.5 w-full overflow-hidden bg-app-border"
			>
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
