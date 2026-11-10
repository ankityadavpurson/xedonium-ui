import type { IconProps } from '../../types'

const CarrotIcon = ({ className }: IconProps) => (
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
		<path d="M3 21L8 8l8 8z" />
		<path d="M12 12L14 4M12 12l7-5M12 12l9 3" />
		<path d="M6 14l3 1M8.5 10l3 1" />
	</svg>
)

export default CarrotIcon
