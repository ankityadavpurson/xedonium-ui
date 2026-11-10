import type { IconProps } from '../../types'

const SatelliteIcon = ({ className }: IconProps) => (
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
		<path d="M13 7L9 3 5 7l4 4" />
		<path d="M17 11l4 4-4 4-4-4" />
		<path d="M8 12l4 4 6-6-4-4z" />
		<path d="M16 8l3-3" />
		<path d="M9 21a6 6 0 0 0-6-6" />
	</svg>
)

export default SatelliteIcon
