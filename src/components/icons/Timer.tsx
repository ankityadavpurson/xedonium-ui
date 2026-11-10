import type { IconProps } from '../../types'

const TimerIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="14" r="8" />
		<path d="M10 2h4" />
		<path d="M12 14l3-3" />
	</svg>
)

export default TimerIcon
