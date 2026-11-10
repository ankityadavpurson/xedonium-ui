import type { IconProps } from '../../types'

const MagnetIcon = ({ className }: IconProps) => (
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
		<path d="M4 2h5v11a3 3 0 0 0 6 0V2h5v11a8 8 0 0 1-16 0z" />
		<path d="M4 6h5M15 6h5" />
	</svg>
)

export default MagnetIcon
