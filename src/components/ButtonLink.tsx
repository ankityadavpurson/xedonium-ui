import type { ComponentPropsWithoutRef, ElementType, MouseEvent } from 'react'
import buttonClass, { type ButtonVariant } from './buttonClass'

export interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
	href?: string
	variant?: ButtonVariant
	disabled?: boolean
	/** Swap in a router link, e.g. `linkComponent={Link} linkProp="to"`. */
	linkComponent?: ElementType
	linkProp?: string
}

/**
 * A link that looks like a Button. Variants match Button. `disabled` removes it from the tab order and sets
 * aria-disabled (links cannot be natively disabled). `linkComponent` / `linkProp` swap in a router link, as in TextLink.
 */
const ButtonLink = ({
	href,
	variant = 'default',
	disabled = false,
	linkComponent: Link = 'a',
	linkProp = 'href',
	className = '',
	children,
	onClick,
	...rest
}: ButtonLinkProps) => (
	<Link
		{...{ [linkProp]: disabled ? undefined : href }}
		aria-disabled={disabled || undefined}
		tabIndex={disabled ? -1 : undefined}
		onClick={(event: MouseEvent<HTMLAnchorElement>) => {
			if (disabled) event.preventDefault()
			else onClick?.(event)
		}}
		className={`inline-block text-center ${buttonClass(variant, disabled ? `pointer-events-none opacity-50 ${className}` : className)}`}
		{...rest}
	>
		{children}
	</Link>
)

export default ButtonLink
