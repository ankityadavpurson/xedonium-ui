import type { ElementType, ReactNode } from 'react'

export interface LabelProps {
	/** Element to render; defaults to `label` when `htmlFor` is set, otherwise `span`. */
	as?: ElementType
	htmlFor?: string
	className?: string
	children?: ReactNode
	[attribute: string]: unknown
}

/**
 * Small uppercase label. Renders a real <label> when `htmlFor` is given (use it for form controls), otherwise a
 * <span>; `as` overrides the element.
 */
const Label = ({ as, htmlFor, className = '', children, ...rest }: LabelProps) => {
	const Tag = as ?? (htmlFor ? 'label' : 'span')
	return (
		<Tag
			htmlFor={Tag === 'label' ? htmlFor : undefined}
			className={`text-xs font-semibold uppercase tracking-widest text-app-muted ${className}`}
			{...rest}
		>
			{children}
		</Tag>
	)
}

export default Label
