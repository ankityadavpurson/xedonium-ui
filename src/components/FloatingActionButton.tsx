import type { ReactNode } from 'react'
import type { Size } from '../types'
import { readableTextColor } from '../utils/color'
import Button, { type ButtonProps } from './Button'
import type { ButtonVariant } from './buttonClass'

export type FabPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center'

export interface FloatingActionButtonProps extends Omit<ButtonProps, 'children'> {
	/** The icon (an icon-only button needs an `aria-label`). */
	children?: ReactNode
	/** Text shown after the icon; makes the button extended. */
	label?: ReactNode
	size?: Size
	/** `square` (the default, like the rest of the library) or `circle` (a round button, a pill when extended). */
	shape?: 'square' | 'circle'
	/** Fix the button to a corner of the viewport. */
	position?: FabPosition
	/** Color of the button: a Button variant name, or any CSS color such as `#e11d48` (it overrides `variant`). */
	color?: ButtonVariant | (string & {})
}

const VARIANTS: ButtonVariant[] = ['default', 'secondary', 'flat', 'danger', 'success', 'warning']

const ICON_ONLY: Record<Size, string> = { sm: 'h-10 w-10', md: 'h-14 w-14', lg: 'h-16 w-16' }
const EXTENDED: Record<Size, string> = { sm: 'h-10 !px-4', md: 'h-12 !px-5', lg: 'h-14 !px-6' }
const GLYPH: Record<Size, string> = {
	sm: '[&>svg]:h-4 [&>svg]:w-4',
	md: '[&>svg]:h-5 [&>svg]:w-5',
	lg: '[&>svg]:h-6 [&>svg]:w-6',
}
export const FAB_POSITIONS: Record<FabPosition, string> = {
	'bottom-right': 'bottom-5 right-5',
	'bottom-left': 'bottom-5 left-5',
	'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
	'top-right': 'top-5 right-5',
	'top-left': 'top-5 left-5',
	'top-center': 'top-5 left-1/2 -translate-x-1/2',
}

/**
 * The primary action of a screen: a raised square button that holds an icon (give it an `aria-label`), or an icon and
 * a `label` when extended. `variant` and `tooltip` work as on Button. Pass `position` to fix it to a corner of the
 * viewport; without it the button sits where you put it.
 */
const FloatingActionButton = ({
	children,
	label,
	size = 'md',
	shape = 'square',
	position,
	variant = 'default',
	color,
	className = '',
	style,
	...rest
}: FloatingActionButtonProps) => {
	const named = color !== undefined && VARIANTS.includes(color as ButtonVariant)
	const custom = color !== undefined && !named
	return (
		<Button
			variant={named ? (color as ButtonVariant) : variant}
			style={custom ? { backgroundColor: color, borderColor: color, color: readableTextColor(color), ...style } : style}
			className={`inline-flex items-center justify-center gap-2 shadow-xl ${shape === 'circle' ? 'rounded-full' : ''} ${label ? EXTENDED[size] : `${ICON_ONLY[size]} !p-0`} ${
				GLYPH[size]
			} ${position ? `fixed z-[var(--xd-z-popover,85)] ${FAB_POSITIONS[position]}` : ''} ${className}`}
			{...rest}
		>
			{children}
			{label}
		</Button>
	)
}

export default FloatingActionButton
