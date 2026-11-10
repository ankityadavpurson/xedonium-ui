import type { IconProps } from '../../types'

const BatteryChargingIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="7" width="17" height="10" />
		<path d="M22 11v2" />
		<path d="M11 9l-2 3h4l-2 3" />
	</svg>
)

export default BatteryChargingIcon
