import type { IconProps } from '../../types'

const AccessibilityIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="7" r="1" />
		<path d="M7 10l5 1 5-1" />
		<path d="M12 11v3" />
		<path d="M9 18l3-4 3 4" />
	</svg>
)

export default AccessibilityIcon
