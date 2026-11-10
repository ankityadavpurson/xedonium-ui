import type { IconProps } from '../../types'

const CalendarPlusIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="4" width="18" height="18" />
		<path d="M16 2v4M8 2v4M3 10h18" />
		<path d="M12 13v6M9 16h6" />
	</svg>
)

export default CalendarPlusIcon
