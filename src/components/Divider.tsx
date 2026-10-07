import type { ReactNode } from 'react'
import Label from './Label'

export interface DividerProps {
	orientation?: 'horizontal' | 'vertical'
	/** Centered text (horizontal only). */
	label?: ReactNode
	className?: string
}

/** Horizontal or vertical rule, with optional centered label (horizontal only). */
const Divider = ({ orientation = 'horizontal', label, className = '' }: DividerProps) => {
	if (orientation === 'vertical') {
		return (
			<div role="separator" aria-orientation="vertical" className={`w-px self-stretch bg-app-border ${className}`} />
		)
	}
	if (!label) return <hr className={`border-0 border-t border-app-border ${className}`} />
	return (
		<div role="separator" className={`flex items-center gap-3 ${className}`}>
			<span className="h-px flex-1 bg-app-border" />
			<Label>{label}</Label>
			<span className="h-px flex-1 bg-app-border" />
		</div>
	)
}

export default Divider
