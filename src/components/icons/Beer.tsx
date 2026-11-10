import type { IconProps } from '../../types'

const BeerIcon = ({ className }: IconProps) => (
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
		<path d="M5 7h12v14H5z" />
		<path d="M17 10h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-3" />
		<path d="M9 11v6M13 11v6" />
		<path d="M5 7c0-3 2-4 4-3 1-1 4-1 5 1 1 0 3 1 3 2" />
	</svg>
)

export default BeerIcon
