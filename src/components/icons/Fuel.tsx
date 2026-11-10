import type { IconProps } from '../../types'

const FuelIcon = ({ className }: IconProps) => (
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
		<path d="M3 22V3h10v19" />
		<path d="M2 22h12" />
		<path d="M5 7h6v4H5z" />
		<path d="M13 9h3a2 2 0 0 1 2 2v6a2 2 0 0 0 4 0V9l-3-3" />
	</svg>
)

export default FuelIcon
