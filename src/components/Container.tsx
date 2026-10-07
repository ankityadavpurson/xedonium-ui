import type { ReactNode } from 'react'
import type { AsProps } from '../types'

export type ContainerProps = AsProps<{
	/** A Tailwind `max-w-*` class. */
	maxWidth?: string
	className?: string
	children?: ReactNode
}>

// Centered, padded content column
const Container = ({ maxWidth = 'max-w-5xl', className = '', as: Tag = 'div', children, ...rest }: ContainerProps) => (
	<Tag className={`mx-auto w-full px-4 sm:px-6 ${maxWidth} ${className}`} {...rest}>
		{children}
	</Tag>
)

export default Container
