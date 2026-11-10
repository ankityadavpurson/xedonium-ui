import type { IconProps } from '../../types'

const CalendarClockIcon = ({ className }: IconProps) => (
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
		<path d="M21 11V4H3v18h6" />
		<path d="M16 2v4M8 2v4M3 10h18" />
		<circle cx="17" cy="17" r="5" />
		<path d="M17 15v2l1.5 1" />
	</svg>
)

export default CalendarClockIcon
