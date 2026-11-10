import type { IconProps } from '../../types'

const BriefcaseBusinessIcon = ({ className }: IconProps) => (
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
		<rect x="10" y="12" width="4" height="3" />
	</svg>
)

export default BriefcaseBusinessIcon
