import type { IconProps } from '../../types'

const RoadIcon = ({ className }: IconProps) => (
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
		<path d="M5 21L8 3M19 21L16 3" />
		<path d="M12 4v3M12 10.5v3M12 17v3" />
	</svg>
)

export default RoadIcon
