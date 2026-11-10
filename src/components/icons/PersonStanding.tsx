import type { IconProps } from '../../types'

const PersonStandingIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="4" r="2" />
		<path d="M12 8v7" />
		<path d="M7 11l5-3 5 3" />
		<path d="M9 22l3-7 3 7" />
	</svg>
)

export default PersonStandingIcon
