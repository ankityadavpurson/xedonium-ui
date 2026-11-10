import type { IconProps } from '../../types'

const TrafficLightIcon = ({ className }: IconProps) => (
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
		<rect x="7" y="2" width="10" height="20" />
		<circle cx="12" cy="7" r="1.5" />
		<circle cx="12" cy="12" r="1.5" />
		<circle cx="12" cy="17" r="1.5" />
	</svg>
)

export default TrafficLightIcon
