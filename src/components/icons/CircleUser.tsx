import type { IconProps } from '../../types'

const CircleUserIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="10" r="3" />
		<path d="M6.5 18.5l2.5-3h6l2.5 3" />
	</svg>
)

export default CircleUserIcon
