import type { IconProps } from '../../types'

const GoalIcon = ({ className }: IconProps) => (
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
		<path d="M12 15V2l8 4-8 4" />
		<circle cx="12" cy="15" r="7" />
		<path d="M12 15h.01" />
	</svg>
)

export default GoalIcon
