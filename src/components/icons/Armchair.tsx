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
		<path d="M17 10V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5" />
		<path d="M5 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H9v-2a2 2 0 0 0-4 0z" />
		<path d="M7 19v2M17 19v2" />
	</svg>
)

export default ArmchairIcon
