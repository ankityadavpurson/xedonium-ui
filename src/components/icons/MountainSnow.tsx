import type { IconProps } from '../../types'

const MountainSnowIcon = ({ className }: IconProps) => (
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
		<path d="M2 21l8-14 5 8 2.5-4L22 21z" />
		<path d="M7.5 13.5l2.5-2 2 2 2-2.5" />
	</svg>
)

export default MountainSnowIcon
