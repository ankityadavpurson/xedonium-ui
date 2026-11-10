import type { IconProps } from '../../types'

const PlaneIcon = ({ className }: IconProps) => (
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
		<path d="M12 2c1 0 2 2 2 5v3l8 5v2l-8-2v4l3 2v2l-5-1-5 1v-2l3-2v-4l-8 2v-2l8-5V7c0-3 1-5 2-5z" />
	</svg>
)

export default PlaneIcon
