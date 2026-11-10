import type { IconProps } from '../../types'

const MilestoneIcon = ({ className }: IconProps) => (
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
		<path d="M12 2v3M12 12v10" />
		<path d="M4 5h14l3 3.5-3 3.5H4z" />
	</svg>
)

export default MilestoneIcon
