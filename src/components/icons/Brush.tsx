import type { IconProps } from '../../types'

const BrushIcon = ({ className }: IconProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-4 w-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<path d="M19 3l2 2-9.5 9.5-2-2z" />
		<path d="M9.5 12.5L11.5 14.5" />
		<path d="M9.5 14.5C6 14 5 16.5 4 18.5c-.5 1.5-2 2.5-2 2.5 4 1.5 8 .5 8.5-3z" />
	</svg>
)

export default BrushIcon
