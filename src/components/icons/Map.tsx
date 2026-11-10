import type { IconProps } from '../../types'

const MapIcon = ({ className }: IconProps) => (
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
		<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
		<path d="M9 3v15M15 6v15" />
	</svg>
)

export default MapIcon
