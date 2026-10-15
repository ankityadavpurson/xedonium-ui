import type { IconProps } from '../../types'

const TabletIcon = ({ className }: IconProps) => (
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
		<rect x="4" y="2" width="16" height="20" />
		<path d="M11 18h2" />
	</svg>
)

export default TabletIcon
