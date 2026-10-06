const sizeClasses = {
	sm: 'text-[11px]',
	md: 'text-xs',
}

const padding = {
	sm: 'px-1.5 py-0.5',
	md: 'px-2.5 py-1',
}

/**
 * Compact tag for filters, selections and input values. Pass `onClick` to make it a toggle button (use `selected`
 * for its pressed state), and `onRemove` to add a remove (x) button. `leading` shows an icon or avatar before the text.
 */
const Chip = ({
	selected,
	onClick,
	onRemove,
	removeLabel,
	leading,
	size = 'md',
	disabled = false,
	className = '',
	children,
	...rest
}) => {
	const label = removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove')
	const interactive = !!onClick
	const body = (
		<>
			{leading && <span className="inline-flex shrink-0 items-center">{leading}</span>}
			<span className="min-w-0 truncate">{children}</span>
		</>
	)

	return (
		<span
			className={`inline-flex max-w-full items-center border font-semibold transition ${sizeClasses[size]} ${
				selected ? 'border-app-strong bg-app-strong text-app-bg' : 'border-app-border bg-app-card text-app-text'
			} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
		>
			{interactive ? (
				<button
					type="button"
					disabled={disabled}
					aria-pressed={selected === undefined ? undefined : !!selected}
					onClick={onClick}
					className={`inline-flex min-w-0 items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-app-strong ${padding[size]} ${
						disabled ? 'cursor-not-allowed' : selected ? '' : 'hover:bg-app-bg'
					}`}
					{...rest}
				>
					{body}
				</button>
			) : (
				<span className={`inline-flex min-w-0 items-center gap-1.5 ${padding[size]}`} {...rest}>
					{body}
				</span>
			)}
			{onRemove && (
				<button
					type="button"
					disabled={disabled}
					aria-label={label}
					onClick={onRemove}
					className="inline-flex items-center self-stretch pr-2 text-current opacity-70 outline-none transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-app-strong disabled:cursor-not-allowed"
				>
					<svg
						aria-hidden="true"
						focusable="false"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						className="h-3 w-3"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			)}
		</span>
	)
}

export default Chip
