import type { IconProps } from '../../types'

const TruckIcon = ({ className }: IconProps) => (
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
		<path d="M1 4h14v12H1z" />
		<path d="M15 8h4l3 4v4h-7" />
		<circle cx="6" cy="18" r="2" />
		<circle cx="18" cy="18" r="2" />
	</svg>
)

export default TruckIcon
