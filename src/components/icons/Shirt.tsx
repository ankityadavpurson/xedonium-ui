import type { IconProps } from '../../types'

const ShirtIcon = ({ className }: IconProps) => (
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
		<path d="M8 3L2 7l3 4 3-2v12h8V9l3 2 3-4-6-4c-1 2-2 3-4 3S9 5 8 3z" />
	</svg>
)

export default ShirtIcon
