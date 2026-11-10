import type { IconProps } from '../../types'

const CalendarDaysIcon = ({ className }: IconProps) => (
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
		<path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
	</svg>
)

export default CalendarDaysIcon
