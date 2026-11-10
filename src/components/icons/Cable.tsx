import type { IconProps } from '../../types'

const CableIcon = ({ className }: IconProps) => (
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
		<rect x="5" y="3" width="4" height="6" />
		<path d="M2 4.5h3M2 7.5h3" />
		<rect x="15" y="15" width="4" height="6" />
		<path d="M19 16.5h3M19 19.5h3" />
		<path d="M9 6h4a3 3 0 0 1 3 3 3 3 0 0 1-3 3h-2a3 3 0 0 0-3 3 3 3 0 0 0 3 3h4" />
	</svg>
)

export default CableIcon
