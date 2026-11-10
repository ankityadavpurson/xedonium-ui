import type { IconProps } from '../../types'

const TrafficConeIcon = ({ className }: IconProps) => (
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
		<path d="M10 3h4l4 14H6z" />
		<path d="M3 17h18v4H3z" />
		<path d="M7.7 12h8.6" />
	</svg>
)

export default TrafficConeIcon
