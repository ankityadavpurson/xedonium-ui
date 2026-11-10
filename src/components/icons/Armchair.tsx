import type { IconProps } from '../../types'

const ArmchairIcon = ({ className }: IconProps) => (
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
		<path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" />
		<path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z" />
		<path d="M6 18v3M18 18v3" />
	</svg>
)

export default ArmchairIcon
