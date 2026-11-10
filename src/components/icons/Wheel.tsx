import type { IconProps } from '../../types'

const WheelIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="2.5" />
		<path d="M12 9.5V6M14.38 10.73l3.33-1.08M13.29 13.77l2.06 2.83M10.71 13.77L8.65 16.6M9.62 10.73L6.29 9.65" />
	</svg>
)

export default WheelIcon
