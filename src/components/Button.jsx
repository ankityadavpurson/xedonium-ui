import Tooltip from './Tooltip'

// `tooltip` shows a styled Tooltip (used instead of the native `title` attribute); `tooltipPlacement` is its placement
const Button = props => {
	const {
		onClick,
		tooltip,
		tooltipPlacement,
		variant = 'default',
		className = '',
		children,
		type = 'button',
		disabled = false,
		...rest
	} = props

	const variantClasses = {
		default: 'bg-app-strong text-app-bg border border-app-strong hover:bg-app-text',
		secondary: 'bg-app-bg text-app-text border border-app-border hover:border-app-strong hover:text-app-text',
		danger: 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20',
		success:
			'bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 dark:bg-emerald-500 dark:text-black dark:border-emerald-500 dark:hover:bg-emerald-400 dark:hover:border-emerald-400',
		warning: 'bg-amber-400 text-black border border-amber-400 hover:bg-amber-300 hover:border-amber-300',
	}

	const button = (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`text-xs font-semibold uppercase tracking-widest ${variantClasses[variant]} px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
			{...rest}
		>
			{children}
		</button>
	)

	return tooltip ? (
		<Tooltip text={tooltip} placement={tooltipPlacement}>
			{button}
		</Tooltip>
	) : (
		button
	)
}

export default Button
