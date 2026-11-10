import type { IconProps } from '../../types'

const IceCreamBowlIcon = ({ className }: IconProps) => (
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
		<path d="M4 14h16a8 7 0 0 1-16 0z" />
		<path d="M6 14a6 6 0 0 1 12 0" />
		<circle cx="12" cy="5.5" r="1.5" />
	</svg>
)

export default IceCreamBowlIcon
