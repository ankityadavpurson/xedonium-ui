import type { IconProps } from '../../types'

const AlarmClockIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="13" r="8" />
		<path d="M12 9v4l2 2" />
		<path d="M5 3L2 6M22 6l-3-3M6 19l-2 3M18 19l2 3" />
	</svg>
)

export default AlarmClockIcon
