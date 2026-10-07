import type { IconProps } from '../../types'

const SwissFrancIcon = ({ className }: IconProps) => (
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
		<path d="M10 21V3h8" />
		<path d="M6 16h9" />
		<path d="M10 9.5h7" />
	</svg>
)

export default SwissFrancIcon
