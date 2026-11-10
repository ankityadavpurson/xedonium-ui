import type { IconProps } from '../../types'

const CarFrontIcon = ({ className }: IconProps) => (
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
		<path d="M4 7l1.5-4h13L20 7" />
		<rect x="3" y="7" width="18" height="10" />
		<path d="M3 12h18" />
		<path d="M7 15h.01M17 15h.01" />
		<path d="M5 17v3M19 17v3" />
	</svg>
)

export default CarFrontIcon
