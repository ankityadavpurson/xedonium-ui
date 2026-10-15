import type { IconProps } from '../../types'

const ArrowUpDownIcon = ({ className }: IconProps) => (
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
		<path d="M7 20V4M3 8l4-4 4 4" />
		<path d="M17 4v16M13 16l4 4 4-4" />
	</svg>
)

export default ArrowUpDownIcon
