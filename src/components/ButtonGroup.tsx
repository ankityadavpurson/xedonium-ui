import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface ButtonGroupProps extends ComponentPropsWithoutRef<'div'> {
	orientation?: 'horizontal' | 'vertical'
	/** Join the buttons into one bar with shared borders (default true); `false` keeps a small gap between them. */
	attached?: boolean
	/** Stretch the group to its container and share the width (or height) equally. */
	fullWidth?: boolean
	children?: ReactNode
}

// Overlap each button's border with its neighbour's; the hovered or focused one rises so its border is not covered
const ATTACHED = {
	horizontal: 'flex-row [&>*:not(:first-child)]:-ml-px',
	vertical: 'flex-col [&>*:not(:first-child)]:-mt-px',
}
const RAISE = '[&>*]:relative [&>*:hover]:z-10 [&>*:focus-visible]:z-10 [&>*[aria-pressed=true]]:z-10'

/**
 * Buttons joined into one bar (or column): put `Button`s inside. Use different variants to mark the active one, or
 * `aria-pressed` for a toggle group. It renders a `role="group"`; give it an `aria-label` that says what the buttons
 * have in common. `attached={false}` keeps them apart with a small gap.
 */
const ButtonGroup = ({
	orientation = 'horizontal',
	attached = true,
	fullWidth = false,
	className = '',
	children,
	...rest
}: ButtonGroupProps) => (
	<div
		role="group"
		className={`${fullWidth ? 'flex w-full [&>*]:flex-1' : 'inline-flex'} ${
			attached ? `${ATTACHED[orientation]} ${RAISE}` : `gap-2 ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`
		} ${className}`}
		{...rest}
	>
		{children}
	</div>
)

export default ButtonGroup
