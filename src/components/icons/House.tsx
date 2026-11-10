import type { IconProps } from '../../types'

const HouseIcon = ({ className }: IconProps) => (
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
		<path d="M4 10l8-7 8 7v11H4z" />
		<path d="M16 6.5V3h3v6" />
		<path d="M10 21v-6h4v6" />
	</svg>
)

export default HouseIcon
