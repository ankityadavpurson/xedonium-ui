import Tooltip from './Tooltip'

// `tooltip` shows a styled Tooltip (used instead of the native `title` attribute)
const Button = props => {
	const {
		onClick,
		tooltip,
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

	return tooltip ? <Tooltip text={tooltip}>{button}</Tooltip> : button
}

export default Button
