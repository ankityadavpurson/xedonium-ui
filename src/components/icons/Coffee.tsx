import type { IconProps } from '../../types'

const CoffeeIcon = ({ className }: IconProps) => (
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
		<path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
		<path d="M17 10h2a3 3 0 0 1 0 6h-2" />
		<path d="M7 2v3M11 2v3" />
	</svg>
)

export default CoffeeIcon
