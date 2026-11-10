import type { IconProps } from '../../types'

const BuildingIcon = ({ className }: IconProps) => (
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
		<path d="M5 21V3h14v18" />
		<path d="M3 21h18" />
		<path d="M9 7h2M13 7h2M9 11h2M13 11h2" />
		<path d="M10 21v-5h4v5" />
	</svg>
)

export default BuildingIcon
