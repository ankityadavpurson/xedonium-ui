import type { IconProps } from '../../types'

const MapPinnedIcon = ({ className }: IconProps) => (
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
		<path d="M12 16S6 12 6 8a6 6 0 0 1 12 0c0 4-6 8-6 8z" />
		<circle cx="12" cy="8" r="2" />
		<path d="M8.5 15H5l-2 6h18l-2-6h-3.5" />
	</svg>
)

export default MapPinnedIcon
