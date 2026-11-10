import type { IconProps } from '../../types'

const CarIcon = ({ className }: IconProps) => (
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
		<path d="M5 17H2v-6l3-4h11l4 4h2v6h-3" />
		<path d="M9 17h6" />
		<path d="M5 11h15" />
		<circle cx="7" cy="17" r="2" />
		<circle cx="17" cy="17" r="2" />
	</svg>
)

export default CarIcon
