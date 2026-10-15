import type { IconProps } from '../../types'

const ArrowLeftRightIcon = ({ className }: IconProps) => (
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
		<path d="M4 7h16M16 3l4 4-4 4" />
		<path d="M20 17H4M8 13l-4 4 4 4" />
	</svg>
)

export default ArrowLeftRightIcon
