import type { IconProps } from '../../types'

const PipetteIcon = ({ className }: IconProps) => (
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
		<path d="M9 6V4a3 3 0 0 1 6 0v2" />
		<path d="M8 6h8" />
		<path d="M9 6v9l3 4 3-4V6" />
		<path d="M9 11h6" />
		<path d="M12 22h.01" />
	</svg>
)

export default PipetteIcon
