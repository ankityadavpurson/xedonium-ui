import type { ReactNode } from 'react'
import type { AsProps } from '../types'

export type BodyTextProps = AsProps<{ className?: string; children?: ReactNode }>

/** Body copy: `text-sm` in the primary text color. `as` changes the element (default p). */
const BodyText = ({ as: Tag = 'p', className = '', children, ...rest }: BodyTextProps) => (
	<Tag className={`m-0 text-sm text-app-text ${className}`} {...rest}>
		{children}
	</Tag>
)

export default BodyText
