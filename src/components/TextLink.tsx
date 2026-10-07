import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

export interface TextLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
	href?: string
	/** Swap in a router link, e.g. `linkComponent={Link} linkProp="to"`. */
	linkComponent?: ElementType
	linkProp?: string
	children?: ReactNode
}

/**
 * Underlined inline link with a hover color. `linkComponent` / `linkProp` swap in a router link, as in AppBar
 * (e.g. `linkComponent={Link} linkProp="to"`).
 */
const TextLink = ({
	href,
	linkComponent: Link = 'a',
	linkProp = 'href',
	className = '',
	children,
	...rest
}: TextLinkProps) => (
	<Link
		{...{ [linkProp]: href }}
		className={`text-app-text underline underline-offset-2 transition hover:text-app-strong ${className}`}
		{...rest}
	>
		{children}
	</Link>
)

export default TextLink
