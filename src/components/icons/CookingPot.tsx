import type { IconProps } from '../../types'

const CookingPotIcon = ({ className }: IconProps) => (
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
		<path d="M4 11h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
		<path d="M2 11h2M20 11h2" />
		<path d="M9 7V3M15 7V3" />
	</svg>
)

export default CookingPotIcon
