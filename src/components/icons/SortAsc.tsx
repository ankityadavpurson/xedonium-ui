import type { IconProps } from '../../types'

const SortAscIcon = ({ className }: IconProps) => (
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
		<path d="M3 8l3-3 3 3M6 5v14" />
		<path d="M11 19h4M11 14h7M11 9h10" />
	</svg>
)

export default SortAscIcon
