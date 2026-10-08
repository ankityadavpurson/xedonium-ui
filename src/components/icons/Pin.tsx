import type { IconProps } from '../../types'

const PinIcon = ({ className }: IconProps) => (
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
		<path d="M12 17v5" />
		<path d="M8 2h8v4h-1v5l4 4v2H5v-2l4-4V6H8z" />
	</svg>
)

export default PinIcon
