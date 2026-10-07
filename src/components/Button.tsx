import type { ComponentPropsWithoutRef } from 'react'
import type { Placement } from '../types'
import Tooltip from './Tooltip'
import buttonClass, { type ButtonVariant } from './buttonClass'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
	/** Shows a styled Tooltip (use it instead of the native `title`). */
	tooltip?: string
	tooltipPlacement?: Placement
	variant?: ButtonVariant
}

// `tooltip` shows a styled Tooltip (used instead of the native `title` attribute); `tooltipPlacement` is its placement
const Button = (props: ButtonProps) => {
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
