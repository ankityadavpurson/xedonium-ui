import type { IconProps } from '../../types'

const StrikethroughIcon = ({ className }: IconProps) => (
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
		<path d="M16 4H9a3 3 0 0 0-2.83 4" />
		<path d="M14 12a4 4 0 0 1 0 8H6" />
		<path d="M4 12h16" />
	</svg>
)

export default StrikethroughIcon
