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
		<rect x="7" y="2" width="10" height="17" />
		<circle cx="12" cy="6" r="1" />
		<circle cx="12" cy="10.5" r="1" />
		<circle cx="12" cy="15" r="1" />
		<path d="M12 19v3" />
		<path d="M7 6H4M7 10.5H4M7 15H4M17 6h3M17 10.5h3M17 15h3" />
	</svg>
)

export default TrafficLightIcon
