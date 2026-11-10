import type { IconProps } from '../../types'

const ParkingCircleIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="10" />
		<path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
	</svg>
)

export default ParkingCircleIcon
