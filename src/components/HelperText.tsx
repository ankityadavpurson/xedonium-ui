import type { ReactNode } from 'react'
import type { AsProps } from '../types'

export type HelperTextProps = AsProps<{ className?: string; children?: ReactNode }>

/** Secondary text for hints and captions: `text-xs` in the muted color. `as` changes the element (default p). */
const HelperText = ({ as: Tag = 'p', className = '', children, ...rest }: HelperTextProps) => (
	<Tag className={`m-0 text-xs text-app-muted ${className}`} {...rest}>
		{children}
	</Tag>
)

export default HelperText
