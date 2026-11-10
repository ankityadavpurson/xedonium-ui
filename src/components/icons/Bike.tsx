import type { IconProps } from '../../types'

const BikeIcon = ({ className }: IconProps) => (
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
		<circle cx="5.5" cy="17.5" r="3.5" />
		<circle cx="18.5" cy="17.5" r="3.5" />
		<path d="M5.5 17.5H11L9 9h7l2.5 8.5" />
		<path d="M11 17.5L16 9" />
		<path d="M7.5 9h3M14 6h3" />
	</svg>
)

export default BikeIcon
