import type { IconProps } from '../../types'

const BriefcaseIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="7" width="18" height="14" />
		<path d="M8 7V3h8v4" />
		<path d="M3 13h18" />
		<path d="M10 13v2h4v-2" />
	</svg>
)

export default BriefcaseIcon
