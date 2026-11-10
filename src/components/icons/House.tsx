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
		<path d="M3 11l9-8 9 8" />
		<path d="M5 10v11h14V10" />
		<path d="M10 21v-6h4v6" />
	</svg>
)

export default HouseIcon
