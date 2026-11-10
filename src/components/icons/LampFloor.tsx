import type { IconProps } from '../../types'

const LampFloorIcon = ({ className }: IconProps) => (
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
		<path d="M8 2h8l2 8H6z" />
		<path d="M12 10v11" />
		<path d="M8 22h8" />
	</svg>
)

export default LampFloorIcon
