import type { IconProps } from '../../types'

const FlagIcon = ({ className }: IconProps) => (
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
		<path d="M5 22V3" />
		<path d="M5 4h14l-3 4 3 4H5" />
	</svg>
)

export default FlagIcon
