import type { IconProps } from '../../types'

const ShipIcon = ({ className }: IconProps) => (
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
		<path d="M3 17l2 4h14l2-4z" />
		<path d="M6 17v-6h12v6" />
		<path d="M9 11V7h6v4" />
		<path d="M12 7V3h3" />
	</svg>
)

export default ShipIcon
