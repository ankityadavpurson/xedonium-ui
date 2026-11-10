import type { IconProps } from '../../types'

const CrownIcon = ({ className }: IconProps) => (
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
		<path d="M3 18L2 7l5 4 5-7 5 7 5-4-1 11z" />
		<path d="M4 21h16" />
	</svg>
)

export default CrownIcon
