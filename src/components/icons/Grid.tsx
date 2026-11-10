import type { IconProps } from '../../types'

const GridIcon = ({ className }: IconProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-5 w-5'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<rect x="3" y="3" width="18" height="18" />
		<path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
	</svg>
)

export default GridIcon
