import Tooltip from './Tooltip'
import buttonClass from './buttonClass'

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

	const button = (
		<button type={type} onClick={onClick} disabled={disabled} className={buttonClass(variant, className)} {...rest}>
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
