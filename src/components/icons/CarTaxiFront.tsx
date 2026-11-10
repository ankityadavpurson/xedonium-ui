import type { IconProps } from '../../types'

const CarTaxiFrontIcon = ({ className }: IconProps) => (
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
		<path d="M10 1h4v3h-4z" />
		<path d="M4 9l2-5h12l2 5" />
		<rect x="3" y="9" width="18" height="9" />
		<path d="M3 13h18" />
		<path d="M7 16h.01M17 16h.01" />
		<path d="M5 18v3M19 18v3" />
	</svg>
)

export default CarTaxiFrontIcon
